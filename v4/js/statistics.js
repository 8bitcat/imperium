// IMPERIUM V5.6 — STATISTIK. 74 verkliga mått per land och rike.
// V5.8: 224 mått i 13 grupper — 91 nya från Världsbanken (köpkraft, arbete,
// energi, jordbruk, vaccin, hotade arter …) och 30 nya brott, som liksom de
// gamla brotten är uppskattade ur verkliga mått (mord, rättsstat, korruption,
// välstånd, inkomstskillnader, städer) och märks med ~.
// V5.10: DEMOGRAFI & FAMILJ — 22 nya mått (åldrar, försörjning, tonårsfödslar,
// vuxendödlighet, hushåll, städer, framtida befolkning) och befolkningspyramiden
// (realmPyramid), som rör sig med andelen barn och pensionärer.
//
// Varje mått utgår från landets VERKLIGA värde (data/indicators.json, byggt av
// tools/build-indicators.mjs ur Världsbanken och FN:s HDR) och flyttas av de
// 22 nationsvärdena — alltså av lagarna, ideologin, forskningen och allt annat
// som redan driver dem. Två sätt:
//   mul  värdet = bas × (1 + Σ k·värde/100)     (relativt, t.ex. BNP per capita)
//   add  värdet = bas + Σ k·värde/100            (i måttets egen enhet, t.ex. procent)
// Ett rike räknas ihop över alla sina länder: summor summeras, andelar vägs
// efter befolkning, och BNP per capita = rikets BNP / rikets befolkning.
// Saknas ett värde för ett land uppskattas det ur de 8 länder som ligger
// närmast i BNP per capita (markeras som uppskattat).
import { dollars, bigNumber } from './real.js';
import { LAWS } from './laws.js';
import { LAW_EXTRAS } from './laws-extra.js';
import { NEW_LAWS } from './laws-more.js';
import { FX_511 } from './laws-511.js';
import { FAITHS, FAITH_KEYS, sharesOf, compositionOf } from './faith.js';
import { DEMOCRACY } from './democracy-data.js';     // V5.16: EIU:s demokratiindex
import { regimeOf, DEMO_SUBS } from './realism.js';
import { RATINGS } from './bank.js';

export const IND_GROUPS = [
  { id: 'eko', name: 'EKONOMI', icon: '\u{1F4B0}' },
  { id: 'fin', name: 'STATSFINANSER', icon: '\u{1F3E6}' },              // V5.16
  { id: 'arb', name: 'ARBETE', icon: '\u{1F477}' },
  { id: 'var', name: 'VARDAG & PLÅNBOK', icon: '\u{1F6D2}' },           // V5.16
  { id: 'hal', name: 'VÄLFÄRD & HÄLSA', icon: '\u{1F3E5}' },
  { id: 'jor', name: 'JORDBRUK & MAT', icon: '\u{1F33E}' },
  { id: 'bef', name: 'BEFOLKNING', icon: '\u{1F465}' },
  { id: 'mig', name: 'MIGRATION & INTEGRATION', icon: '\u{1F6C2}' },    // V5.16
  { id: 'dem', name: 'DEMOGRAFI & FAMILJ', icon: '\u{1F46A}' },
  { id: 'rel', name: 'TRO & RELIGION', icon: '\u{1F64F}' },   // V5.12
  { id: 'kun', name: 'KUNSKAP & TEKNIK', icon: '\u{1F4DA}' },
  { id: 'dmk', name: 'DEMOKRATI & STYRE', icon: '\u{1F5F3}\u{FE0F}' },   // V5.16
  { id: 'sam', name: 'SAMHÄLLE & RÄTT', icon: '\u{2696}\u{FE0F}' },
  { id: 'brt', name: 'BROTT & SÄKERHET', icon: '\u{1F6A8}' },
  { id: 'ekb', name: 'EKOBROTT & MILJÖBROTT', icon: '\u{1F575}\u{FE0F}' },
  { id: 'rtt', name: 'POLIS & RÄTTSVÄSENDE', icon: '\u{1F46E}' },
  { id: 'inf', name: 'INFRASTRUKTUR & ENERGI', icon: '\u{26A1}' },
  { id: 'nat', name: 'MILJÖ', icon: '\u{1F333}' },
  { id: 'fvr', name: 'FÖRSVAR', icon: '\u{1F396}\u{FE0F}' },
];

// better: 'high' = högt är bra, 'low' = lågt är bra, null = varken eller
// agg: 'sum' summeras över riket, 'wavg' vägs efter befolkning (standard),
//      'gdp' vägs efter BNP, 'derived' räknas fram efter ihopräkningen
export const INDICATORS = [
  // ---------- EKONOMI ----------
  { id: 'gdp', name: 'BNP', group: 'eko', fmt: 'usdbig', better: 'high', agg: 'derived', desc: 'Värdet av allt landet producerar på ett år' },
  { id: 'gdppc', name: 'BNP per capita', group: 'eko', fmt: 'usd', better: 'high', mode: 'mul', agg: 'derived',
    fx: { gdp: 0.30, factory: 0.10, research: 0.06, corruption: -0.10, stability: 0.05, unrest: -0.06, freedom: 0.03 }, desc: 'Genomsnittlig produktion per invånare' },
  { id: 'gdpgrowth', name: 'BNP-tillväxt', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: -15, max: 15,
    fx: { gdp: 2.5, factory: 1.5, research: 1, stability: 1, unrest: -1.5, corruption: -1 }, desc: 'Hur mycket ekonomin växer per år' },
  { id: 'unemp', name: 'Arbetslöshet', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0.2, max: 60,
    fx: { gdp: -4, factory: -4, welfare: 1, immigration: 1.5, corruption: 1.5, unrest: 2 }, desc: 'Andel av arbetskraften utan jobb' },
  { id: 'youthunemp', name: 'Ungdomsarbetslöshet', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0.5, max: 80,
    fx: { gdp: -8, factory: -6, research: -2, unrest: 3, immigration: 2 }, desc: 'Arbetslöshet bland 15–24-åringar' },
  { id: 'infl', name: 'Inflation', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: -3, max: 300,
    fx: { income: 3, stability: -3, corruption: 2, unrest: 2, statepower: 1 }, desc: 'Hur snabbt priserna stiger per år' },
  { id: 'lendrate', name: 'Utlåningsränta', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 80,
    fx: { stability: -2, corruption: 2, gdp: -1 }, desc: 'Vad det kostar att låna pengar' },
  { id: 'debt', name: 'Statsskuld', group: 'fin', fmt: 'pctgdp', better: 'low', mode: 'add', min: 0, max: 1000, agg: 'gdp',
    fx: { welfare: 15, income: -20, milpower: 8, stability: -5 }, desc: 'Statens skulder i procent av BNP' },
  { id: 'tax', name: 'Skatteintäkter', group: 'fin', fmt: 'pctgdp', better: null, mode: 'add', min: 3, max: 60, agg: 'gdp',
    fx: { income: 12, welfare: 6, gdp: -3 }, desc: 'Skatter i procent av BNP' },
  { id: 'taxrev', name: 'Statens skatteintäkter', group: 'fin', fmt: 'usdbig', better: 'high', agg: 'derived', desc: 'Skatter som staten tar in på ett år' },
  { id: 'exports', name: 'Export', group: 'eko', fmt: 'pctgdp', better: null, mode: 'mul', agg: 'gdp',
    fx: { factory: 0.25, gdp: 0.10, research: 0.10 }, desc: 'Varor och tjänster som säljs utomlands' },
  { id: 'imports', name: 'Import', group: 'eko', fmt: 'pctgdp', better: null, mode: 'mul', agg: 'gdp',
    fx: { gdp: 0.15, qol: 0.05, factory: -0.05 }, desc: 'Varor och tjänster som köps från utlandet' },
  { id: 'tradebal', name: 'Handelsbalans', group: 'eko', fmt: 'pp', better: 'high', agg: 'derived', desc: 'Export minus import, procent av BNP' },
  { id: 'fdi', name: 'Utländska investeringar', group: 'eko', fmt: 'pctgdp', better: 'high', mode: 'add', min: -10, max: 40, agg: 'gdp',
    fx: { gdp: 2, stability: 2, corruption: -2, freedom: 1, statepower: -1 }, desc: 'Pengar som utländska företag investerar i landet' },
  { id: 'hitech', name: 'Högteknologisk export', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 70, agg: 'gdp',
    fx: { research: 12, factory: 4 }, desc: 'Andel av industriexporten som är avancerad teknik' },
  { id: 'agri', name: 'Jordbruk', group: 'jor', fmt: 'pctgdp', better: null, mode: 'add', min: 0.1, max: 70, agg: 'gdp',
    fx: { factory: -3, gdp: -3 }, desc: 'Jordbrukets del av ekonomin' },
  { id: 'manuf', name: 'Industri', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 1, max: 50, agg: 'gdp',
    fx: { factory: 8 }, desc: 'Tillverkningsindustrins del av ekonomin' },
  { id: 'services', name: 'Tjänster', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 10, max: 90, agg: 'gdp',
    fx: { gdp: 4, factory: -6, research: 2 }, desc: 'Tjänstesektorns del av ekonomin' },
  // V5.7
  { id: 'govspend', name: 'Statens utgifter', group: 'fin', fmt: 'pctgdp', better: null, mode: 'add', min: 8, max: 70, agg: 'gdp',
    fx: { welfare: 10, statepower: 6, income: 4, milpower: 3 }, desc: 'Statens utgifter i procent av BNP' },
  { id: 'curacc', name: 'Bytesbalans', group: 'eko', fmt: 'pp', better: 'high', mode: 'add', min: -30, max: 30, agg: 'gdp',
    fx: { factory: 4, gdp: 1 }, desc: 'Vad landet tjänar mot omvärlden, procent av BNP' },
  { id: 'stockcap', name: 'Börsvärde', group: 'eko', fmt: 'pctgdp', better: 'high', mode: 'mul', agg: 'gdp',
    fx: { gdp: 0.4, freedom: 0.2, stability: 0.3, statepower: -0.2 }, desc: 'Börsbolagens värde i procent av BNP' },
  { id: 'bankacc', name: 'Har bankkonto', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 100,
    fx: { gdp: 8, hdi: 6 }, desc: 'Andel vuxna med bankkonto eller konto i mobilen' },
  { id: 'labor', name: 'Arbetskraft', group: 'arb', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { gdp: 0.05, immigration: 0.05 }, desc: 'Personer som arbetar eller söker arbete' },
  { id: 'tourists', name: 'Turister per år', group: 'eko', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { safety: 0.3, qol: 0.2, freedom: 0.2, unrest: -0.4 }, desc: 'Utländska besökare på ett år' },
  { id: 'airpax', name: 'Flygresenärer per år', group: 'inf', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { gdp: 0.3, freedom: 0.1, qol: 0.1 }, desc: 'Passagerare med landets flygbolag' },

  // ---------- VÄLFÄRD & HÄLSA ----------
  { id: 'hdi', name: 'HDI', group: 'hal', fmt: 'idx3', better: 'high', agg: 'derived', desc: 'FN:s mått på mänsklig utveckling: livslängd, utbildning och inkomst' },
  { id: 'life', name: 'Medellivslängd', group: 'hal', fmt: 'years', better: 'high', mode: 'add', min: 40, max: 90,
    fx: { qol: 3, welfare: 2.5, hdi: 2, safety: 1, unrest: -1.5 }, desc: 'Hur länge en nyfödd kan väntas leva' },
  { id: 'happiness', name: 'Lycka', group: 'hal', fmt: 'score10', better: 'high', agg: 'derived',
    fx: { qol: 1.2, approval: 1, freedom: 0.8, unrest: -1, safety: 0.5 }, desc: 'Hur nöjda människor är med sina liv (0–10)' },
  { id: 'lifefem', name: 'Livslängd kvinnor', group: 'hal', fmt: 'years', better: 'high', mode: 'add', min: 40, max: 95,
    fx: { qol: 3, welfare: 2.5, hdi: 2, safety: 0.5, unrest: -1 }, desc: 'Hur länge en nyfödd flicka kan väntas leva' },
  { id: 'lifemale', name: 'Livslängd män', group: 'hal', fmt: 'years', better: 'high', mode: 'add', min: 40, max: 92,
    fx: { qol: 3, welfare: 2, hdi: 2, safety: 1.5, unrest: -2 }, desc: 'Hur länge en nyfödd pojke kan väntas leva' },
  { id: 'infmort', name: 'Spädbarnsdödlighet', group: 'hal', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { welfare: -0.3, qol: -0.2, hdi: -0.25, corruption: 0.1 }, desc: 'Barn som dör före ett års ålder, per 1 000 födda' },
  { id: 'u5mort', name: 'Barnadödlighet', group: 'hal', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { welfare: -0.3, qol: -0.2, hdi: -0.25, corruption: 0.1 }, desc: 'Barn som dör före fem års ålder, per 1 000 födda' },
  { id: 'doctors', name: 'Läkare', group: 'hal', fmt: 'per1000', better: 'high', mode: 'mul',
    fx: { welfare: 0.3, hdi: 0.2, research: 0.1 }, desc: 'Läkare per 1 000 invånare' },
  { id: 'beds', name: 'Sjukhussängar', group: 'hal', fmt: 'per1000', better: 'high', mode: 'mul',
    fx: { welfare: 0.3, hdi: 0.15 }, desc: 'Sjukhussängar per 1 000 invånare' },
  { id: 'healthx', name: 'Vårdutgifter', group: 'hal', fmt: 'pctgdp', better: 'high', mode: 'add', min: 1, max: 20, agg: 'gdp',
    fx: { welfare: 4, qol: 1 }, desc: 'Vad landet lägger på sjukvård, procent av BNP' },
  { id: 'water', name: 'Rent dricksvatten', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 100,
    fx: { hdi: 8, welfare: 5, corruption: -3 }, desc: 'Andel med säkert dricksvatten' },
  { id: 'elec', name: 'Tillgång till el', group: 'inf', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 100,
    fx: { hdi: 6, factory: 4 }, desc: 'Andel av befolkningen som har el' },
  { id: 'poverty', name: 'Extrem fattigdom', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { welfare: -0.5, gdp: -0.4, corruption: 0.3, unrest: 0.2 }, desc: 'Andel som lever på under 2,15 $ om dagen' },
  { id: 'gini', name: 'Inkomstskillnader (Gini)', group: 'hal', fmt: 'num1', better: 'low', mode: 'add', min: 20, max: 70,
    fx: { welfare: -10, statepower: -2, gdp: 2, corruption: 4 }, desc: '0 = alla tjänar lika, 100 = en person tjänar allt' },
  { id: 'overweight', name: 'Övervikt', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 3, max: 85,
    fx: { qol: -3, gdp: 2 }, desc: 'Andel vuxna med övervikt' },
  { id: 'undernourish', name: 'Undernäring', group: 'jor', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { welfare: -0.4, gdp: -0.4, corruption: 0.2 }, desc: 'Andel som inte får tillräckligt med mat' },
  { id: 'sanitation', name: 'Säkra toaletter', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 3, max: 100,
    fx: { hdi: 8, welfare: 4 }, desc: 'Andel med toalett och avlopp som är säkra' },
  { id: 'smoking', name: 'Rökare', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 2, max: 50,
    fx: { qol: -4, hdi: -3, freedom: 2 }, desc: 'Andel vuxna som röker' },
  { id: 'alcohol', name: 'Alkohol', group: 'hal', fmt: 'liters', better: 'low', mode: 'add', min: 0, max: 18,
    fx: { freedom: 1.5, qol: -1, statepower: -1 }, desc: 'Liter ren alkohol per vuxen och år' },

  // ---------- BEFOLKNING ----------
  { id: 'pop', name: 'Befolkning', group: 'bef', fmt: 'count', better: 'high', agg: 'derived', desc: 'Antal invånare i riket' },
  { id: 'popgrowth', name: 'Befolkningstillväxt', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: -3, max: 5,
    fx: { immigration: 1, welfare: 0.2, qol: 0.2, unrest: -0.3, hdi: -0.3 }, desc: 'Hur snabbt befolkningen växer per år' },
  { id: 'birth', name: 'Födelsetal', group: 'bef', fmt: 'per1000', better: null, mode: 'add', min: 5, max: 50,
    fx: { hdi: -6, welfare: 2, ideopower: 1, stability: 1 }, desc: 'Födda per 1 000 invånare och år' },
  { id: 'death', name: 'Dödstal', group: 'bef', fmt: 'per1000', better: 'low', mode: 'add', min: 2, max: 20,
    fx: { qol: -2, welfare: -1.5, safety: -0.5 }, desc: 'Döda per 1 000 invånare och år' },
  { id: 'urban', name: 'Andel i städer', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: 10, max: 100,
    fx: { factory: 6, gdp: 4 }, desc: 'Andel som bor i städer' },
  { id: 'netmig', name: 'Nettoinvandring per år', group: 'mig', fmt: 'scount', better: null, agg: 'sum', desc: 'Invandrare minus utvandrare på ett år' },
  { id: 'births', name: 'Födda per år', group: 'bef', fmt: 'count', better: null, agg: 'sum', desc: 'Barn som föds på ett år' },
  { id: 'deaths', name: 'Döda per år', group: 'bef', fmt: 'count', better: null, agg: 'sum', desc: 'Människor som dör på ett år' },
  { id: 'popchange', name: 'Befolkningsförändring per år', group: 'bef', fmt: 'scount', better: null, agg: 'sum',
    desc: 'Födda minus döda plus nettoinvandring — så mycket växer eller krymper befolkningen' },
  { id: 'area', name: 'Yta', group: 'bef', fmt: 'km2', better: 'high', agg: 'sum', desc: 'Rikets landyta' },
  { id: 'density', name: 'Befolkningstäthet', group: 'bef', fmt: 'perkm2', better: null, agg: 'derived', desc: 'Invånare per kvadratkilometer' },

  // ---------- V5.10: DEMOGRAFI & FAMILJ ----------
  // Åldrarna (medianålder, unga vuxna, över 80, antal barn/vuxna/pensionärer)
  // räknas ur befolkningspyramiden (realmPyramid), som följer andelen barn och
  // pensionärer — så siffrorna stämmer med diagrammet.
  { id: 'medianage', name: 'Medianålder', group: 'dem', fmt: 'years', better: null, agg: 'derived',
    desc: 'Hälften av invånarna är yngre än så här och hälften är äldre' },
  { id: 'fert', name: 'Barn per kvinna', group: 'dem', fmt: 'num2', better: null, mode: 'add', min: 0.8, max: 7.5,
    fx: { hdi: -0.8, welfare: 0.3, ideopower: 0.15 }, desc: 'Hur många barn en kvinna föder i genomsnitt' },
  { id: 'kids', name: 'Andel barn (0–14)', group: 'dem', fmt: 'pct', better: null, mode: 'add', min: 8, max: 55,
    fx: { hdi: -4 }, desc: 'Andel av befolkningen som är barn' },
  { id: 'youth', name: 'Unga vuxna (15–24)', group: 'dem', fmt: 'pct', better: null, agg: 'derived',
    desc: 'Andel av befolkningen som är tonåringar och unga vuxna' },
  { id: 'old', name: 'Andel över 65', group: 'dem', fmt: 'pct', better: null, mode: 'add', min: 1, max: 35,
    fx: { hdi: 4, welfare: 1 }, desc: 'Andel av befolkningen som är pensionärer' },
  { id: 'oldest', name: 'Andel över 80', group: 'dem', fmt: 'pct', better: null, agg: 'derived',
    desc: 'Andel av befolkningen som är 80 år eller äldre' },
  { id: 'kidsn', name: 'Barn (0–14)', group: 'dem', fmt: 'count', better: null, agg: 'derived',
    desc: 'Hur många barn som bor i riket' },
  { id: 'workage', name: 'I arbetsför ålder (15–64)', group: 'dem', fmt: 'count', better: 'high', agg: 'derived',
    desc: 'Hur många som är i den ålder då man brukar plugga vidare eller jobba' },
  { id: 'oldn', name: 'Pensionärer (65+)', group: 'dem', fmt: 'count', better: null, agg: 'derived',
    desc: 'Hur många som är 65 år eller äldre' },
  { id: 'dependency', name: 'Försörjningsbörda', group: 'dem', fmt: 'per100', better: null, mode: 'add', min: 10, max: 130,
    desc: 'Barn och pensionärer per 100 personer i arbetsför ålder' },
  { id: 'youngdep', name: 'Barn per 100 i arbetsför ålder', group: 'dem', fmt: 'per100', better: null, mode: 'add', min: 3, max: 130,
    desc: 'Hur många barn (0–14) det finns för varje 100 personer som är 15–64 år' },
  { id: 'olddep', name: 'Pensionärer per 100 i arbetsför ålder', group: 'dem', fmt: 'per100', better: null, mode: 'add', min: 0.5, max: 90,
    desc: 'Hur många pensionärer (65+) det finns för varje 100 personer som är 15–64 år' },
  { id: 'female', name: 'Andel kvinnor', group: 'dem', fmt: 'pct', better: null, mode: 'add', min: 25, max: 60,
    desc: 'Hur stor del av befolkningen som är kvinnor' },
  { id: 'sexratio', name: 'Pojkar per 100 flickor', group: 'dem', fmt: 'ratio100', better: null, mode: 'add', min: 0.95, max: 1.3,
    desc: 'Hur många pojkar som föds för varje 100 flickor — av naturen blir det ungefär 105' },
  { id: 'adofert', name: 'Tonårsmammor', group: 'dem', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { hdi: -0.4, welfare: -0.2 }, desc: 'Barn som föds av flickor som är 15–19 år, per 1 000 flickor och år' },
  { id: 'contracept', name: 'Preventivmedel', group: 'dem', fmt: 'pct', better: null, mode: 'add', min: 2, max: 92,
    fx: { hdi: 8, freedom: 4 }, desc: 'Andel par (kvinnor 15–49) som använder skydd för att själva välja när de får barn' },
  { id: 'adultmortm', name: 'Vuxendödlighet män', group: 'dem', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { qol: -0.2, welfare: -0.15, hdi: -0.2, safety: -0.2, unrest: 0.15 }, desc: 'Av 1 000 män som fyller 15 — så många dör innan de fyller 60' },
  { id: 'adultmortf', name: 'Vuxendödlighet kvinnor', group: 'dem', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { qol: -0.2, welfare: -0.2, hdi: -0.25, safety: -0.05 }, desc: 'Av 1 000 kvinnor som fyller 15 — så många dör innan de fyller 60' },
  { id: 'hhsize', name: 'Hushållsstorlek', group: 'dem', fmt: 'persons', better: null, mode: 'mul', agg: 'derived',
    fx: { gdp: -0.06, welfare: -0.05 }, desc: 'Hur många som bor i samma hem i genomsnitt' },
  { id: 'households', name: 'Hushåll', group: 'dem', fmt: 'count', better: null, agg: 'sum',
    desc: 'Hur många hem (hushåll) det finns i riket' },
  { id: 'birthreg', name: 'Registrerade födslar', group: 'dem', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 100,
    fx: { statepower: 6, hdi: 5, welfare: 3 }, desc: 'Andel barn vars födsel skrivs in hos myndigheterna' },
  { id: 'pop25', name: 'Befolkning om 25 år', group: 'dem', fmt: 'count', better: null, agg: 'derived',
    desc: 'Så många bor i riket om 25 år om befolkningen fortsätter att växa eller krympa som nu' },
  { id: 'doubling', name: 'Fördubblingstid', group: 'dem', fmt: 'dbl', better: null, agg: 'derived',
    desc: 'Hur länge det dröjer innan befolkningen är dubbelt så stor — eller bara hälften så stor om den krymper' },
  { id: 'urbanpop', name: 'Stadsbor', group: 'dem', fmt: 'count', better: null, agg: 'sum',
    desc: 'Hur många som bor i städer' },
  { id: 'ruralpop', name: 'Landsbygdsbor', group: 'dem', fmt: 'count', better: null, agg: 'sum',
    desc: 'Hur många som bor på landet' },
  { id: 'bigcity', name: 'Största staden', group: 'dem', fmt: 'count', better: null, agg: 'max',
    desc: 'Hur många som bor i rikets största stad' },
  { id: 'largestcity', name: 'Största stadens andel', group: 'dem', fmt: 'pct', better: null, mode: 'add', min: 1, max: 100,
    fx: { statepower: 3 }, desc: 'Andel av stadsborna som bor i landets största stad' },
  { id: 'megacity', name: 'Bor i miljonstäder', group: 'dem', fmt: 'pct', better: null, mode: 'mul', max: 100,
    desc: 'Andel av invånarna som bor i en stad med över en miljon människor' },

  // ---------- V5.12: TRO & RELIGION ----------
  // Folkets tro ur faith.js (ungefär Pew 2020). Religionslagen flyttar andelen
  // utan religion; en statsreligion omvänder de troende (se countryIndicators).
  { id: 'believers', name: 'Troende', group: 'rel', fmt: 'pct', better: null, agg: 'derived',
    desc: 'Andel av befolkningen som tillhör någon religion' },
  { id: 'mainfaith', name: 'Största trons andel', group: 'rel', fmt: 'pct', better: null, agg: 'derived',
    desc: 'Hur stor del av folket som har landets största tro' },
  { id: 'statefaith', name: 'Följer statens tro', group: 'rel', fmt: 'pct', better: 'high', agg: 'derived',
    desc: 'Andel av de troende som har samma tro som staten (bara när staten har en religion)' },
  { id: 'reldiv', name: 'Religiös mångfald', group: 'rel', fmt: 'score100', better: null, agg: 'derived',
    desc: '0 = alla troende har samma tro, 100 = väldigt många olika' },
  { id: 'reltension', name: 'Religiösa spänningar', group: 'rel', fmt: 'score10', better: 'low', agg: 'derived',
    desc: 'Hur mycket tron splittrar landet — högt när staten och folket tror på olika saker' },
  { id: 'r_kristen', name: 'Protestanter & andra kristna', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som är protestanter eller tillhör andra kristna kyrkor' },
  { id: 'r_katolsk', name: 'Katoliker', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som tillhör katolska kyrkan' },
  { id: 'r_ortodox', name: 'Ortodoxa kristna', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som tillhör de ortodoxa kyrkorna' },
  { id: 'r_islam', name: 'Muslimer', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som är muslimer' },
  { id: 'r_judisk', name: 'Judar', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som är judar' },
  { id: 'r_hindu', name: 'Hinduer', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som är hinduer' },
  { id: 'r_buddhist', name: 'Buddhister', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som är buddhister' },
  { id: 'r_sikh', name: 'Sikher', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som är sikher' },
  { id: 'r_folktro', name: 'Folktro & övriga', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel med folkreligioner, traditionella religioner och övriga trosriktningar' },
  { id: 'r_sekular', name: 'Ingen religion', group: 'rel', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel som inte tillhör någon religion' },

  // ---------- KUNSKAP & TEKNIK ----------
  { id: 'literacy', name: 'Läskunnighet', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 100,
    fx: { hdi: 10, welfare: 3, research: 3, freedom: 2 }, desc: 'Andel vuxna som kan läsa och skriva' },
  { id: 'schoolyears', name: 'Utbildningsår', group: 'kun', fmt: 'years', better: 'high', mode: 'add', min: 1, max: 15,
    fx: { hdi: 2.5, research: 1, welfare: 0.5 }, desc: 'Genomsnittligt antal år i skolan för vuxna' },
  { id: 'tertiary', name: 'Högskolestudier', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 150,
    fx: { research: 25, hdi: 10, welfare: 5 }, desc: 'Studerande på högskola i förhållande till åldersgruppen' },
  { id: 'edux', name: 'Utbildningsutgifter', group: 'kun', fmt: 'pctgdp', better: 'high', mode: 'add', min: 1, max: 10, agg: 'gdp',
    fx: { welfare: 2, research: 2 }, desc: 'Vad landet lägger på skola, procent av BNP' },
  { id: 'rnd', name: 'Forskning', group: 'kun', fmt: 'pctgdp', better: 'high', mode: 'add', min: 0, max: 6, agg: 'gdp',
    fx: { research: 2.5 }, desc: 'Vad landet lägger på forskning, procent av BNP' },
  { id: 'patents', name: 'Patentansökningar per år', group: 'kun', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { research: 0.8, gdp: 0.2, freedom: 0.2 }, desc: 'Nya uppfinningar som söker patent' },
  { id: 'primary', name: 'Fullföljd grundskola', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 110,
    fx: { hdi: 8, welfare: 4 }, desc: 'Andel barn som går ut grundskolan' },
  { id: 'researchers', name: 'Forskare', group: 'kun', fmt: 'permillion', better: 'high', mode: 'mul',
    fx: { research: 0.6, hdi: 0.1 }, desc: 'Forskare per miljon invånare' },
  { id: 'articles', name: 'Vetenskapliga artiklar per år', group: 'kun', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { research: 0.7, freedom: 0.1 }, desc: 'Publicerade forskningsartiklar på ett år' },
  { id: 'broadband', name: 'Bredband', group: 'kun', fmt: 'per100', better: 'high', mode: 'add', min: 0, max: 60,
    fx: { gdp: 10, research: 6 }, desc: 'Fasta bredbandsabonnemang per 100 invånare' },
  { id: 'internet', name: 'Internetanvändare', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 100,
    fx: { research: 10, freedom: 10, gdp: 8, statepower: -3 }, desc: 'Andel som använder internet' },
  { id: 'mobile', name: 'Mobilabonnemang', group: 'kun', fmt: 'per100', better: 'high', mode: 'add', min: 1, max: 200,
    fx: { gdp: 20, freedom: 5 }, desc: 'Mobilabonnemang per 100 invånare' },

  // ---------- SAMHÄLLE & RÄTT ----------
  // V5.8: alla vanliga brott vägda ihop (räknas i countryIndicators)
  { id: 'crimeidx', name: 'Brottslighet', group: 'brt', fmt: 'index', better: 'low',
    desc: 'Alla vanliga brott vägda ihop — 100 är som ett typiskt land i världen' },
  { id: 'homicide', name: 'Mord', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.6, unrest: 0.4, corruption: 0.3, welfare: -0.15 }, desc: 'Mord per 100 000 invånare och år' },
  { id: 'robbery', name: 'Rån', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.5, unrest: 0.4, welfare: -0.2, corruption: 0.2 }, desc: 'Rån per 100 000 invånare och år' },
  { id: 'burglary', name: 'Inbrott', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.4, welfare: -0.15, unrest: 0.2 }, desc: 'Inbrott per 100 000 invånare och år' },
  { id: 'drugcrime', name: 'Narkotikabrott', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.3, unrest: 0.2, safety: -0.2 }, desc: 'Narkotikabrott per 100 000 invånare och år' },
  { id: 'cybercrime', name: 'Nätbedrägerier', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { research: 0.2, safety: -0.2 }, desc: 'Anmälda bedrägerier på nätet per 100 000 invånare och år' },
  { id: 'prisoners', name: 'Fångar', group: 'rtt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { statepower: 0.4, freedom: -0.4, safety: 0.2 }, desc: 'Människor i fängelse per 100 000 invånare' },
  { id: 'police', name: 'Poliser', group: 'rtt', fmt: 'per100k', better: null, mode: 'mul',
    fx: { statepower: 0.4, safety: 0.2 }, desc: 'Poliser per 100 000 invånare' },
  { id: 'feelsafe', name: 'Trygghet', group: 'brt', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 99,
    fx: { safety: 15, unrest: -10, freedom: 3 }, desc: 'Andel som känner sig trygga ute ensamma på kvällen' },
  { id: 'traffic', name: 'Trafikdöda', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { qol: -0.2, hdi: -0.2, safety: -0.2 }, desc: 'Döda i trafiken per 100 000 invånare och år' },
  { id: 'voice', name: 'Demokrati & yttrandefrihet', group: 'sam', fmt: 'wgi', better: 'high', mode: 'add', min: -2.5, max: 2.5,
    fx: { freedom: 2, ideopower: -0.3, statepower: -0.5 }, desc: 'Fria val, fri press och fri organisering (0–100)' },
  { id: 'pressfree', name: 'Pressfrihet', group: 'sam', fmt: 'score100', better: 'high', agg: 'derived', desc: 'Hur fritt journalister kan arbeta (0–100)' },
  { id: 'corruptgov', name: 'Korruptionsfrihet', group: 'sam', fmt: 'wgi', better: 'high', mode: 'add', min: -2.5, max: 2.5,
    fx: { corruption: -1.5, freedom: 0.3, statepower: 0.2 }, desc: 'Hur väl korruption hålls borta (0–100)' },
  { id: 'rulelaw', name: 'Rättsstat', group: 'sam', fmt: 'wgi', better: 'high', mode: 'add', min: -2.5, max: 2.5,
    fx: { freedom: 0.8, corruption: -1, safety: 0.5, statepower: -0.2 }, desc: 'Hur väl lagar och domstolar fungerar (0–100)' },
  { id: 'polstab', name: 'Politisk stabilitet', group: 'sam', fmt: 'wgi', better: 'high', mode: 'add', min: -2.5, max: 2.5,
    fx: { stability: 1.5, unrest: -1.5, safety: 0.5 }, desc: 'Risken för kupper, uppror och politiskt våld (0–100)' },
  { id: 'goveff', name: 'Statens effektivitet', group: 'sam', fmt: 'wgi', better: 'high', mode: 'add', min: -2.5, max: 2.5,
    fx: { corruption: -0.8, research: 0.4, statepower: 0.3, stability: 0.3 }, desc: 'Hur bra myndigheterna sköter sitt jobb (0–100)' },
  { id: 'regq', name: 'Företagsklimat', group: 'sam', fmt: 'wgi', better: 'high', mode: 'add', min: -2.5, max: 2.5,
    fx: { gdp: 0.8, freedom: 0.4, corruption: -0.6, statepower: -0.3 }, desc: 'Hur lätt det är att driva företag (0–100)' },
  { id: 'femlabor', name: 'Kvinnor i arbete', group: 'arb', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 90,
    fx: { freedom: 6, gdp: 4, welfare: 4 }, desc: 'Andel kvinnor som arbetar' },
  { id: 'womenparl', name: 'Kvinnor i parlamentet', group: 'sam', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 65,
    fx: { freedom: 10, hdi: 6 }, desc: 'Andel av parlamentets platser' },
  { id: 'gii', name: 'Ojämställdhet', group: 'sam', fmt: 'idx3', better: 'low', mode: 'add', min: 0, max: 0.85,
    fx: { freedom: -0.15, hdi: -0.2 }, desc: 'FN:s mått på skillnader mellan kvinnor och män (0 = lika)' },

  // ---------- MILJÖ ----------
  { id: 'co2', name: 'Koldioxid per invånare', group: 'nat', fmt: 'tons', better: 'low', mode: 'mul',
    fx: { factory: 0.5, qol: -0.2, gdp: 0.1 }, desc: 'Ton koldioxid per person och år' },
  { id: 'pm25', name: 'Luftföroreningar', group: 'nat', fmt: 'ugm3', better: 'low', mode: 'mul',
    fx: { factory: 0.5, qol: -0.4 }, desc: 'Fina partiklar i luften (PM2,5)' },
  { id: 'energyuse', name: 'Energianvändning per invånare', group: 'nat', fmt: 'kgoe', better: null, mode: 'mul',
    fx: { factory: 0.4, gdp: 0.1 }, desc: 'Energi per person och år, i kilo olja' },
  { id: 'renew', name: 'Förnybar energi', group: 'nat', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 100,
    fx: { qol: 12, research: 4, factory: -6 }, desc: 'Andel av energin från sol, vind, vatten och bio' },
  { id: 'forest', name: 'Skog', group: 'nat', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 98,
    fx: { qol: 3, factory: -3 }, desc: 'Andel av landytan som är skog' },
  { id: 'protected', name: 'Skyddad natur', group: 'nat', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 60,
    fx: { qol: 10, factory: -4 }, desc: 'Andel av landytan som är naturskydd' },

  // ---------- FÖRSVAR ----------
  { id: 'soldiers', name: 'Soldater i tjänst', group: 'fvr', fmt: 'count', better: 'high', agg: 'derived', desc: 'Soldater i rikets arméer just nu' },
  { id: 'reserve', name: 'Reservister', group: 'fvr', fmt: 'count', better: 'high', agg: 'derived', desc: 'Manskap som kan kallas in' },
  { id: 'milx', name: 'Försvarsutgifter', group: 'fvr', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 40, agg: 'gdp',
    fx: { milpower: 3, readiness: 2, welfare: -1 }, desc: 'Vad landet lägger på försvaret, procent av BNP' },
  { id: 'milpers', name: 'Militär personal', group: 'fvr', fmt: 'pct', better: null, mode: 'add', min: 0, max: 15,
    fx: { milpower: 1, manpower: 1.5 }, desc: 'Andel av arbetskraften som är militärer' },
  { id: 'armsexp', name: 'Vapenexport', group: 'fvr', fmt: 'usdbig', better: null, mode: 'mul', agg: 'sum',
    fx: { milpower: 0.8, factory: 0.3 }, desc: 'Värdet av vapen som säljs till andra länder per år' },
  { id: 'milbudget', name: 'Försvarsbudget', group: 'fvr', fmt: 'usdbig', better: 'high', agg: 'derived', desc: 'Försvarets pengar på ett år' },

  // ================= V5.8: 91 nya verkliga mått + 30 nya brott =================
  // ---------- EKONOMI ----------
  { id: 'gdppcppp', name: 'Köpkraft per invånare', group: 'eko', fmt: 'usd', better: 'high', mode: 'mul', agg: 'derived',
    desc: 'BNP per capita räknat i vad pengarna räcker till i landet (PPP)' },
  { id: 'gdpppp', name: 'BNP i köpkraft', group: 'eko', fmt: 'usdbig', better: 'high', agg: 'sum',
    desc: 'Hela ekonomin räknad i vad pengarna räcker till i landet (PPP)' },
  { id: 'productivity', name: 'Produktivitet', group: 'eko', fmt: 'usd', better: 'high', mode: 'mul',
    desc: 'Vad varje person som jobbar producerar på ett år (PPP)' },
  { id: 'savings', name: 'Sparande', group: 'eko', fmt: 'pctgdp', better: 'high', mode: 'add', min: -30, max: 70, agg: 'gdp',
    fx: { gdp: 3, stability: 2, welfare: -3 }, desc: 'Hur mycket av inkomsterna landet sparar' },
  { id: 'consumption', name: 'Hushållens konsumtion', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 140, agg: 'gdp',
    fx: { qol: 4, welfare: 3, factory: -3 }, desc: 'Vad familjerna handlar för, i procent av BNP' },
  { id: 'invest', name: 'Investeringar', group: 'eko', fmt: 'pctgdp', better: 'high', mode: 'add', min: -5, max: 60, agg: 'gdp',
    fx: { factory: 5, gdp: 2, stability: 2, corruption: -2 }, desc: 'Pengar som läggs på nya fabriker, hus, vägar och maskiner' },
  { id: 'industry', name: 'Industri och byggen', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 85, agg: 'gdp',
    fx: { factory: 8 }, desc: 'Fabriker, gruvor, kraftverk och byggen — deras del av ekonomin' },
  { id: 'interestpay', name: 'Räntekostnader', group: 'fin', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 90,
    fx: { income: -3, stability: -2 }, desc: 'Del av statens inkomster som går till räntor på statsskulden' },
  { id: 'realrate', name: 'Realränta', group: 'eko', fmt: 'pct', better: null, mode: 'add', min: -90, max: 60,
    fx: { stability: 1, corruption: 1 }, desc: 'Räntan när man räknat bort inflationen' },
  { id: 'reserves', name: 'Valutareserv', group: 'eko', fmt: 'months', better: 'high', mode: 'mul',
    fx: { stability: 0.2, factory: 0.15, income: 0.1 }, desc: 'Hur många månaders import landets sparade utländska pengar räcker till' },
  { id: 'newbiz', name: 'Nya företag', group: 'eko', fmt: 'per1000', better: 'high', mode: 'mul',
    fx: { gdp: 0.3, freedom: 0.3, statepower: -0.3, corruption: -0.2 }, desc: 'Nystartade företag per år, per 1 000 i arbetsför ålder' },
  { id: 'listed', name: 'Börsbolag', group: 'eko', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { gdp: 0.3, freedom: 0.2, statepower: -0.2 }, desc: 'Företag vars aktier går att köpa på landets börs' },
  { id: 'tourrcpt', name: 'Turistintäkter', group: 'eko', fmt: 'usdbig', better: 'high', mode: 'mul', agg: 'sum',
    desc: 'Vad utländska turister spenderar i landet på ett år (före pandemin)' },
  { id: 'ictserv', name: 'IT-tjänsteexport', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 80, agg: 'gdp',
    fx: { research: 8 }, desc: 'Andel av tjänsteexporten som är data, appar och telekom' },
  { id: 'remit', name: 'Pengar från utlandet', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 60, agg: 'gdp',
    fx: { gdp: -2 }, desc: 'Pengar som landsmän som jobbar utomlands skickar hem' },
  { id: 'aid', name: 'Bistånd per invånare', group: 'eko', fmt: 'usd', better: null, mode: 'mul', min: 0,
    fx: { gdp: -0.3, welfare: -0.1 }, desc: 'Bistånd som landet får från andra länder, per invånare och år' },
  { id: 'natres', name: 'Naturresurser', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 75, agg: 'gdp',
    fx: { factory: 2 }, desc: 'Vad olja, gas, gruvor och skog ger, i procent av BNP' },
  { id: 'oilrent', name: 'Oljeintäkter', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 65, agg: 'gdp',
    fx: { factory: 1 }, desc: 'Vad oljan ger landet, i procent av BNP' },
  { id: 'minrent', name: 'Gruvintäkter', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 40, agg: 'gdp',
    fx: { factory: 1.5 }, desc: 'Vad metaller och mineraler ur gruvorna ger, i procent av BNP' },
  { id: 'tariff', name: 'Tullar', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 60, agg: 'gdp',
    fx: { statepower: 1, freedom: -1 }, desc: 'Genomsnittlig avgift på varor som köps in från utlandet' },

  // ---------- ARBETE ----------
  { id: 'lfpr', name: 'Andel i arbetskraften', group: 'arb', fmt: 'pct', better: 'high', mode: 'add', min: 20, max: 92,
    fx: { gdp: 3, freedom: 1, welfare: -1 }, desc: 'Andel vuxna som jobbar eller söker jobb' },
  { id: 'lfprmale', name: 'Män i arbete', group: 'arb', fmt: 'pct', better: 'high', mode: 'add', min: 20, max: 97,
    fx: { gdp: 2 }, desc: 'Andel män som jobbar eller söker jobb' },
  { id: 'emprate', name: 'Sysselsättning', group: 'arb', fmt: 'pct', better: 'high', mode: 'add', min: 15, max: 90,
    desc: 'Andel vuxna som har ett jobb' },
  { id: 'empagri', name: 'Jobb i jordbruket', group: 'arb', fmt: 'pct', better: null, mode: 'add', min: 0.05, max: 90,
    fx: { factory: -5, gdp: -5, research: -2 }, desc: 'Andel av alla jobb som finns på gårdar, i skogen och i fisket' },
  { id: 'empind', name: 'Jobb i industrin', group: 'arb', fmt: 'pct', better: null, mode: 'add', min: 1, max: 60,
    fx: { factory: 6 }, desc: 'Andel av alla jobb som finns i fabriker, gruvor och byggen' },
  { id: 'empserv', name: 'Jobb i tjänstesektorn', group: 'arb', fmt: 'pct', better: null, mode: 'add', min: 5, max: 97,
    desc: 'Andel av alla jobb i butiker, skolor, vård, kontor och liknande' },
  { id: 'vulnemp', name: 'Osäkra jobb', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0.2, max: 95,
    fx: { gdp: -6, welfare: -4, factory: -3 }, desc: 'Andel som jobbar utan anställning och trygghet' },
  { id: 'selfemp', name: 'Egenföretagare', group: 'arb', fmt: 'pct', better: null, mode: 'add', min: 0.5, max: 95,
    fx: { gdp: -5, freedom: 2, statepower: -2 }, desc: 'Andel som driver eget i stället för att vara anställda' },
  { id: 'neet', name: 'Unga utan jobb eller skola', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 1, max: 70,
    fx: { welfare: -4, gdp: -3, research: -2, unrest: 3 }, desc: 'Andel 15–24-åringar som varken jobbar eller pluggar' },

  // ---------- VÄLFÄRD & HÄLSA ----------
  { id: 'nurses', name: 'Sjuksköterskor', group: 'hal', fmt: 'per1000', better: 'high', mode: 'mul',
    fx: { welfare: 0.3, hdi: 0.2 }, desc: 'Sjuksköterskor och barnmorskor per 1 000 invånare' },
  { id: 'measles', name: 'Vaccin mot mässling', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 99.5,
    fx: { welfare: 6, hdi: 6 }, desc: 'Andel småbarn som fått vaccin mot mässling' },
  { id: 'dpt', name: 'Vaccin mot kikhosta', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 99.5,
    fx: { welfare: 6, hdi: 6 }, desc: 'Andel småbarn som fått vaccin mot difteri, stelkramp och kikhosta' },
  { id: 'tb', name: 'Tuberkulos', group: 'hal', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { welfare: -0.3, hdi: -0.3, qol: -0.1 }, desc: 'Nya fall av tuberkulos per 100 000 invånare och år' },
  { id: 'hiv', name: 'HIV', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul', max: 40,
    fx: { welfare: -0.3, hdi: -0.3 }, desc: 'Andel 15–49-åringar som lever med HIV' },
  { id: 'malaria', name: 'Malaria', group: 'hal', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { welfare: -0.3, hdi: -0.3, research: -0.2 }, desc: 'Nya malariafall per år, per 1 000 som bor där myggorna sprider sjukdomen' },
  { id: 'matmort', name: 'Mödradödlighet', group: 'hal', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { welfare: -0.4, hdi: -0.3, qol: -0.1 }, desc: 'Mammor som dör av graviditet eller förlossning, per 100 000 födda barn' },
  { id: 'skilledbirth', name: 'Förlossning med barnmorska', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 100,
    fx: { welfare: 8, hdi: 8 }, desc: 'Andel barn som föds med läkare eller barnmorska på plats' },
  { id: 'oop', name: 'Vård man betalar själv', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 90,
    fx: { welfare: -12 }, desc: 'Andel av vårdkostnaderna som patienterna betalar ur egen ficka' },
  { id: 'diabetes', name: 'Diabetes', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 1, max: 35,
    fx: { qol: -2, gdp: 1 }, desc: 'Andel vuxna med diabetes' },
  { id: 'ncd', name: 'Död i folksjukdomar', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 4, max: 50,
    fx: { welfare: -4, qol: -3, hdi: -2 }, desc: 'Risken att dö mellan 30 och 70 år i hjärtsjukdom, cancer, diabetes eller lungsjukdom' },
  { id: 'anemia', name: 'Blodbrist hos barn', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 2, max: 90,
    fx: { welfare: -8, hdi: -6 }, desc: 'Andel småbarn med för lite järn i blodet' },
  { id: 'waterdeath', name: 'Död av smutsigt vatten', group: 'hal', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { welfare: -0.4, hdi: -0.4 }, desc: 'Döda av orent vatten och dålig hygien, per 100 000 invånare och år' },
  { id: 'slums', name: 'Slumområden', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul', max: 100,
    fx: { welfare: -0.4, gdp: -0.3, corruption: 0.2 }, desc: 'Andel av stadsborna som bor i slum' },

  // ---------- JORDBRUK & MAT ----------
  { id: 'cerealprod', name: 'Spannmålsskörd', group: 'jor', fmt: 'tonsbig', better: 'high', mode: 'mul', agg: 'sum',
    desc: 'Vete, ris, majs och annan säd som skördas på ett år' },
  { id: 'cerealyield', name: 'Skörd per hektar', group: 'jor', fmt: 'kgha', better: 'high', mode: 'mul',
    fx: { factory: 0.3, research: 0.3 }, desc: 'Hur mycket säd varje hektar åker ger' },
  { id: 'agland', name: 'Jordbruksmark', group: 'jor', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    fx: { factory: -1 }, desc: 'Andel av landytan som är åkrar och betesmark' },
  { id: 'arable', name: 'Åkermark per invånare', group: 'jor', fmt: 'ha', better: 'high', mode: 'mul',
    desc: 'Hektar åker som finns per person' },
  { id: 'fertilizer', name: 'Konstgödsel', group: 'jor', fmt: 'kgha', better: null, mode: 'mul',
    fx: { factory: 0.3 }, desc: 'Kilo gödning som sprids per hektar åker och år' },
  { id: 'irrigated', name: 'Bevattnad mark', group: 'jor', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    fx: { factory: 3, research: 2 }, desc: 'Andel av jordbruksmarken som vattnas med kanaler och slangar' },
  { id: 'fishcatch', name: 'Fiske', group: 'jor', fmt: 'tonsbig', better: null, mode: 'mul', agg: 'sum',
    fx: { factory: 0.1 }, desc: 'Fisk som fångas i hav, sjöar och älvar på ett år' },
  { id: 'aquaculture', name: 'Fiskodling', group: 'jor', fmt: 'tonsbig', better: 'high', mode: 'mul', agg: 'sum',
    fx: { research: 0.3, factory: 0.2 }, desc: 'Fisk, räkor och musslor som odlas på ett år' },
  { id: 'stunting', name: 'Barn som växer för lite', group: 'jor', fmt: 'pct', better: 'low', mode: 'mul', max: 80,
    fx: { welfare: -0.4, gdp: -0.3, hdi: -0.2 }, desc: 'Andel barn under fem som är för korta för sin ålder av för lite mat' },

  // ---------- BEFOLKNING ----------
  { id: 'urbgrowth', name: 'Städernas tillväxt', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: -5, max: 8,
    fx: { factory: 1, gdp: 0.5, immigration: 1 }, desc: 'Hur snabbt befolkningen i städerna växer per år' },
  { id: 'migrants', name: 'Födda utomlands', group: 'mig', fmt: 'pct', better: null, mode: 'add', min: 0, max: 90,
    fx: { immigration: 4 }, desc: 'Andel av invånarna som är födda i ett annat land' },

  // ---------- KUNSKAP & TEKNIK ----------
  { id: 'preschool', name: 'Förskola', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 180,
    fx: { welfare: 8 }, desc: 'Barn i förskolan i förhållande till hur många barn i förskoleåldern det finns' },
  { id: 'secondary', name: 'Högstadium och gymnasium', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 3, max: 170,
    fx: { hdi: 8, welfare: 4, research: 3 }, desc: 'Elever i högstadiet och gymnasiet i förhållande till åldersgruppen' },
  { id: 'bachelor', name: 'Högskoleexamen', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 0.5, max: 65,
    fx: { research: 6, hdi: 4 }, desc: 'Andel vuxna över 25 med minst kandidatexamen' },
  { id: 'youthlit', name: 'Läskunniga unga', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 100,
    fx: { hdi: 8, welfare: 3 }, desc: 'Andel 15–24-åringar som kan läsa och skriva' },
  { id: 'pupilteacher', name: 'Elever per lärare', group: 'kun', fmt: 'num1', better: 'low', mode: 'mul',
    fx: { welfare: -0.2, research: -0.1 }, desc: 'Hur många elever varje lärare har i lågstadiet' },
  { id: 'outofschool', name: 'Barn utanför skolan', group: 'kun', fmt: 'count', better: 'low', mode: 'mul', agg: 'sum',
    fx: { welfare: -0.5, hdi: -0.4 }, desc: 'Barn i lågstadieåldern som inte går i skolan' },
  { id: 'hci', name: 'Humankapital', group: 'kun', fmt: 'idx3', better: 'high', mode: 'add', min: 0.2, max: 0.95,
    fx: { welfare: 0.08, hdi: 0.1, research: 0.04 }, desc: 'Världsbankens mått på hur mycket ett barn som föds i dag kommer att lära sig och kunna (0–1)' },
  { id: 'servers', name: 'Säkra servrar', group: 'kun', fmt: 'permillion', better: 'high', mode: 'mul',
    fx: { research: 0.6, freedom: 0.3, gdp: 0.3 }, desc: 'Säkra internetservrar per miljon invånare' },
  { id: 'ictgoods', name: 'Elektronikexport', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 80, agg: 'gdp',
    fx: { research: 6, factory: 3 }, desc: 'Andel av varuexporten som är datorer, mobiler och elektronik' },

  // ---------- SAMHÄLLE ----------
  { id: 'top10', name: 'Rikaste tiondelen', group: 'sam', fmt: 'pct', better: 'low', mode: 'add', min: 15, max: 65,
    desc: 'Andel av alla inkomster som går till de rikaste 10 procenten' },
  { id: 'bottom20', name: 'Fattigaste femtedelen', group: 'sam', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 15,
    desc: 'Andel av alla inkomster som går till de fattigaste 20 procenten' },
  { id: 'womenmin', name: 'Kvinnor i regeringen', group: 'sam', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 75,
    fx: { freedom: 8 }, desc: 'Andel av ministrarna som är kvinnor' },

  // ---------- BROTT & SÄKERHET (uppskattade, se setIndicatorData) ----------
  { id: 'assault', name: 'Misshandel', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.5, unrest: 0.35, welfare: -0.15, qol: -0.1 }, desc: 'Någon slås eller skadas med flit, fall per 100 000 invånare och år' },
  { id: 'threats', name: 'Olaga hot', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.45, unrest: 0.35, integration: -0.1 }, desc: 'Någon hotas så att den blir rädd på allvar, fall per 100 000 och år' },
  { id: 'theft', name: 'Stöld', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.4, welfare: -0.2, unrest: 0.2 }, desc: 'Saker som stjäls, fall per 100 000 invånare och år' },
  { id: 'pickpocket', name: 'Fickstölder', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.4, unrest: 0.2, welfare: -0.15 }, desc: 'Plånböcker och mobiler som snos ur fickor och väskor, per 100 000 och år' },
  { id: 'cartheft', name: 'Bilstölder', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.4, corruption: 0.2, unrest: 0.2 }, desc: 'Stulna bilar per 100 000 invånare och år' },
  { id: 'shoplift', name: 'Snatteri', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.3, welfare: -0.25, unrest: 0.15 }, desc: 'Varor som tas i butiker utan att betalas, per 100 000 och år' },
  { id: 'vandalism', name: 'Skadegörelse', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.3, unrest: 0.4, qol: -0.15, integration: -0.1 }, desc: 'Klotter, krossade rutor och annat som förstörs med flit, per 100 000 och år' },
  { id: 'arson', name: 'Mordbrand', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { unrest: 0.5, safety: -0.3 }, desc: 'Bränder som tänds med flit, per 100 000 invånare och år' },
  { id: 'weapons', name: 'Vapenbrott', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.5, unrest: 0.4 }, desc: 'Brott där vapen används eller bärs olagligt, per 100 000 och år' },
  { id: 'kidnapping', name: 'Kidnappning', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.6, unrest: 0.5, corruption: 0.3 }, desc: 'Människor som förs bort mot sin vilja, per 100 000 och år' },
  { id: 'extortion', name: 'Utpressning', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.5, safety: -0.4, statepower: -0.2 }, desc: 'Någon tvingas betala under hot, per 100 000 och år' },
  { id: 'trafficking', name: 'Människohandel', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.5, safety: -0.3, welfare: -0.2 }, desc: 'Människor som utnyttjas och säljs som varor, upptäckta offer per 100 000 och år' },
  { id: 'gangs', name: 'Gängmedlemmar', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.5, unrest: 0.4, welfare: -0.3, integration: -0.3, corruption: 0.2 }, desc: 'Personer i kriminella gäng per 100 000 invånare' },
  { id: 'hatecrime', name: 'Hatbrott', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { integration: -0.6, unrest: 0.4, ideopower: 0.2 }, desc: 'Brott mot någon för deras hudfärg, tro, ursprung eller vem de älskar, per 100 000 och år' },
  { id: 'dui', name: 'Rattfylleri', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.3, statepower: -0.2 }, desc: 'Förare som kör berusade och åker fast, per 100 000 och år' },

  // ---------- EKOBROTT & MILJÖBROTT (uppskattade) ----------
  { id: 'fraud', name: 'Bedrägerier', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.3, safety: -0.2, research: 0.1 }, desc: 'Någon luras på pengar, fall per 100 000 invånare och år' },
  { id: 'idtheft', name: 'Identitetsstölder', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { research: 0.2, safety: -0.2 }, desc: 'Någon låtsas vara någon annan för att låna eller handla i deras namn, per 100 000 och år' },
  { id: 'bribery', name: 'Mutor', group: 'ekb', fmt: 'pct', better: 'low', mode: 'add', min: 0.3, max: 85,
    fx: { corruption: 25, statepower: -2, freedom: -2 }, desc: 'Andel som fått betala en muta till polis, skola eller myndighet det senaste året' },
  { id: 'moneylaundering', name: 'Penningtvätt', group: 'ekb', fmt: 'pctgdp', better: 'low', mode: 'add', min: 0.2, max: 25, agg: 'gdp',
    fx: { corruption: 4, statepower: -1 }, desc: 'Pengar från brott som görs om till vanliga pengar, i procent av BNP' },
  { id: 'taxevasion', name: 'Skattefusk', group: 'ekb', fmt: 'pct', better: 'low', mode: 'add', min: 2, max: 70, agg: 'gdp',
    fx: { corruption: 10, statepower: -4, stability: -2 }, desc: 'Andel av skatterna som aldrig betalas in' },
  { id: 'shadow', name: 'Svart ekonomi', group: 'ekb', fmt: 'pctgdp', better: 'low', mode: 'add', min: 3, max: 75, agg: 'gdp',
    fx: { corruption: 12, statepower: -4, gdp: -3, welfare: -2 }, desc: 'Svartjobb och affärer som göms för staten, i procent av BNP' },
  { id: 'smuggling', name: 'Smuggling', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.6, statepower: -0.2 }, desc: 'Upptäckta smugglingsbrott över gränsen, per 100 000 och år' },
  { id: 'envcrime', name: 'Miljöbrott', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.4, factory: 0.2, qol: -0.1 }, desc: 'Olaglig avverkning, dumpning och utsläpp, fall per 100 000 och år' },
  { id: 'poaching', name: 'Tjuvjakt', group: 'ekb', fmt: 'score100', better: 'low', mode: 'add', min: 0, max: 100,
    fx: { corruption: 20, safety: -8, statepower: -5 }, desc: 'Hur vanligt det är att skyddade djur jagas olagligt (0–100)' },

  // ---------- POLIS & RÄTTSVÄSENDE (uppskattade) ----------
  { id: 'clearance', name: 'Uppklarade brott', group: 'rtt', fmt: 'pct', better: 'high', mode: 'add', min: 2, max: 90,
    fx: { statepower: 8, research: 6, corruption: -10, safety: 5 }, desc: 'Andel av brotten där polisen hittar den skyldiga' },
  { id: 'recidivism', name: 'Återfall i brott', group: 'rtt', fmt: 'pct', better: 'low', mode: 'add', min: 8, max: 90,
    fx: { welfare: -8, integration: -5, safety: -2 }, desc: 'Andel som begår nya brott inom tre år efter fängelset' },
  { id: 'prisonocc', name: 'Fulla fängelser', group: 'rtt', fmt: 'pct', better: 'low', mode: 'add', min: 30, max: 450,
    fx: { welfare: -5 }, desc: 'Hur fulla fängelserna är — över 100 % betyder att det är trångt' },
  { id: 'courtwait', name: 'Väntan på dom', group: 'rtt', fmt: 'days', better: 'low', mode: 'mul',
    fx: { corruption: 0.35, statepower: -0.15, research: -0.1 }, desc: 'Hur många dagar ett mål i genomsnitt tar i domstolen' },
  { id: 'response', name: 'Polisens utryckningstid', group: 'rtt', fmt: 'minutes', better: 'low', mode: 'mul',
    fx: { safety: -0.25, statepower: -0.15, research: -0.1 }, desc: 'Minuter innan polisen är på plats efter ett larm' },
  { id: 'cctv', name: 'Övervakningskameror', group: 'rtt', fmt: 'per1000', better: null, mode: 'mul', max: 1000,
    fx: { statepower: 0.8, freedom: -0.5, research: 0.3 }, desc: 'Kameror som filmar gator och platser, per 1 000 invånare' },

  // ---------- INFRASTRUKTUR & ENERGI ----------
  { id: 'renewelec', name: 'Förnybar el', group: 'inf', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 100,
    fx: { qol: 6, research: 3, factory: -3 }, desc: 'Andel av elen från vatten, vind, sol och bio' },
  { id: 'hydro', name: 'Vattenkraft', group: 'inf', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    desc: 'Andel av elen från vattenkraftverk' },
  { id: 'nuclear', name: 'Kärnkraft', group: 'inf', fmt: 'pct', better: null, mode: 'add', min: 0, max: 90,
    fx: { research: 1 }, desc: 'Andel av elen från kärnkraftverk' },
  { id: 'coal', name: 'Kolkraft', group: 'inf', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 100,
    fx: { factory: 4, qol: -2 }, desc: 'Andel av elen från kolkraftverk' },
  { id: 'eleccons', name: 'Elanvändning per invånare', group: 'inf', fmt: 'kwh', better: null, mode: 'mul',
    fx: { factory: 0.3, gdp: 0.2, qol: 0.1 }, desc: 'Kilowattimmar el per person och år' },
  { id: 'energyimp', name: 'Energiimport', group: 'inf', fmt: 'spct', better: null, mode: 'add', min: -1000, max: 400,
    fx: { factory: 3 }, desc: 'Del av energin som köps från utlandet — minus betyder att landet säljer energi' },
  { id: 'cleancook', name: 'Ren matlagning', group: 'inf', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 100,
    fx: { hdi: 6, gdp: 3 }, desc: 'Andel som lagar mat med el eller gas i stället för ved och kol inomhus' },
  { id: 'rail', name: 'Järnväg', group: 'inf', fmt: 'km', better: 'high', mode: 'mul', agg: 'sum',
    fx: { factory: 0.15, statepower: 0.1 }, desc: 'Kilometer järnvägsspår i landet' },
  { id: 'ports', name: 'Containerhamnar', group: 'inf', fmt: 'teu', better: 'high', mode: 'mul', agg: 'sum',
    fx: { factory: 0.3, gdp: 0.2 }, desc: 'Containrar som lastas och lossas i landets hamnar på ett år' },
  { id: 'airfreight', name: 'Flygfrakt', group: 'inf', fmt: 'mtkm', better: null, mode: 'mul', agg: 'sum',
    fx: { gdp: 0.3, factory: 0.2 }, desc: 'Gods som flygs på ett år, i ton gånger kilometer' },
  { id: 'lpi', name: 'Logistik', group: 'inf', fmt: 'score5', better: 'high', mode: 'add', min: 1, max: 5,
    fx: { gdp: 0.6, corruption: -0.6, research: 0.3 }, desc: 'Hur snabbt och smidigt varor tar sig fram genom landet (1–5)' },
  { id: 'phones', name: 'Fasta telefoner', group: 'inf', fmt: 'per100', better: null, mode: 'add', min: 0, max: 100,
    fx: { gdp: 3, research: -2 }, desc: 'Telefoner med sladd i väggen per 100 invånare' },

  // ---------- MILJÖ ----------
  { id: 'co2total', name: 'Koldioxid totalt', group: 'nat', fmt: 'mt', better: 'low', mode: 'mul', agg: 'sum',
    desc: 'Hela landets utsläpp av koldioxid på ett år' },
  { id: 'methane', name: 'Metan', group: 'nat', fmt: 'mt', better: 'low', mode: 'mul', agg: 'sum',
    fx: { factory: 0.3 }, desc: 'Metan från kor, risfält, soptippar och gas, räknat som koldioxid' },
  { id: 'airdeath', name: 'Död av luftföroreningar', group: 'nat', fmt: 'per100k', better: 'low', mode: 'mul',
    desc: 'Döda av smutsig luft ute och inne, per 100 000 invånare och år' },
  { id: 'waterstress', name: 'Vattenbrist', group: 'nat', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { factory: 0.3 }, desc: 'Hur mycket av landets sötvatten som tas ut — över 100 % tömmer reserverna' },
  { id: 'freshwater', name: 'Sötvatten per invånare', group: 'nat', fmt: 'm3', better: 'high', mode: 'mul',
    desc: 'Kubikmeter nytt sötvatten från regn och älvar per person och år' },
  { id: 'marine', name: 'Skyddat hav', group: 'nat', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 100,
    desc: 'Andel av landets havsområde som är naturskydd' },
  { id: 'thrmammals', name: 'Hotade däggdjur', group: 'nat', fmt: 'species', better: 'low', mode: 'mul', agg: 'max',
    fx: { factory: 0.2, qol: -0.1 }, desc: 'Arter av däggdjur i landet som riskerar att dö ut' },
  { id: 'thrbirds', name: 'Hotade fåglar', group: 'nat', fmt: 'species', better: 'low', mode: 'mul', agg: 'max',
    fx: { factory: 0.2, qol: -0.1 }, desc: 'Fågelarter i landet som riskerar att dö ut' },
  { id: 'thrfish', name: 'Hotade fiskar', group: 'nat', fmt: 'species', better: 'low', mode: 'mul', agg: 'max',
    fx: { factory: 0.2, qol: -0.1 }, desc: 'Fiskarter i landet som riskerar att dö ut' },
  { id: 'thrplants', name: 'Hotade växter', group: 'nat', fmt: 'species', better: 'low', mode: 'mul', agg: 'max',
    fx: { factory: 0.2, qol: -0.1 }, desc: 'Växtarter i landet som riskerar att dö ut' },

  // ---------- FÖRSVAR ----------
  { id: 'armsimp', name: 'Vapenimport', group: 'fvr', fmt: 'usdbig', better: null, mode: 'mul', agg: 'sum',
    fx: { milpower: 0.6, readiness: 0.2, factory: -0.3 }, desc: 'Värdet av vapen som köps från andra länder per år' },

  // ================= V5.14: 37 nya verkliga mått + 18 nya brott =================
  // ---------- EKONOMI ----------
  { id: 'gnipc', name: 'BNI per capita', group: 'eko', fmt: 'usd', better: 'high', mode: 'mul',
    desc: 'Inkomsten per invånare, inräknat pengar som flyter in och ut ur landet' },
  { id: 'manufexp', name: 'Industrivaror i exporten', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 100,
    fx: { factory: 12, research: 5 }, desc: 'Andel av varuexporten som är fabriksvaror' },
  { id: 'ictexp', name: 'IT-varor i exporten', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 80,
    fx: { research: 8, factory: 4 }, desc: 'Andel av varuexporten som är datorer, telefoner och elektronik' },
  { id: 'fuelexp', name: 'Bränsle i exporten', group: 'eko', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    fx: { factory: 3 }, desc: 'Andel av varuexporten som är olja, gas och kol' },
  { id: 'oresexp', name: 'Malm och metaller i exporten', group: 'eko', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    fx: { factory: 2 }, desc: 'Andel av varuexporten som är malm och metaller' },
  { id: 'foodimp', name: 'Mat i importen', group: 'eko', fmt: 'pct', better: null, mode: 'add', min: 0, max: 80,
    fx: { factory: -3, gdp: -2 }, desc: 'Andel av varuimporten som är livsmedel' },
  { id: 'credit', name: 'Lån till företag och hushåll', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 300, agg: 'gdp',
    fx: { gdp: 12, factory: 5, corruption: -5 }, desc: 'Hur mycket bankerna lånat ut till företag och hushåll, i procent av BNP' },
  { id: 'broadmoney', name: 'Penningmängd', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 5, max: 500, agg: 'gdp',
    fx: { gdp: 10 }, desc: 'Alla pengar i landet (kontanter och bankkonton) i procent av BNP' },
  { id: 'extdebt', name: 'Utlandsskuld', group: 'eko', fmt: 'pctgdp', better: 'low', mode: 'add', min: 0, max: 400, agg: 'gdp',
    fx: { income: -10, corruption: 5, stability: -5 }, desc: 'Vad landet är skyldigt utlandet, i procent av inkomsten' },
  { id: 'debtserv', name: 'Skuldtjänst', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 150,
    fx: { income: -6, corruption: 4 }, desc: 'Andel av exportinkomsterna som går till att betala utlandsskulden' },
  { id: 'tourspend', name: 'Turistresor utomlands', group: 'eko', fmt: 'usdbig', better: null, mode: 'mul', agg: 'sum',
    fx: { qol: 0.6, gdp: 0.4 }, desc: 'Vad landets invånare spenderar på resor utomlands per år' },
  { id: 'atms', name: 'Bankomater', group: 'eko', fmt: 'per100k', better: null, mode: 'mul',
    fx: { gdp: 0.3, corruption: -0.2 }, desc: 'Uttagsautomater per 100 000 vuxna' },
  { id: 'bankbranch', name: 'Bankkontor', group: 'eko', fmt: 'per100k', better: null, mode: 'mul',
    fx: { gdp: 0.2 }, desc: 'Bankkontor per 100 000 vuxna' },
  // ---------- ARBETE ----------
  { id: 'unempfem', name: 'Arbetslöshet bland kvinnor', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0.2, max: 60,
    desc: 'Andel av kvinnorna i arbetskraften som saknar jobb' },
  { id: 'unempmale', name: 'Arbetslöshet bland män', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0.2, max: 60,
    desc: 'Andel av männen i arbetskraften som saknar jobb' },
  { id: 'unempedu', name: 'Arbetslösa högutbildade', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0.2, max: 60,
    fx: { gdp: -3, research: -3, unrest: 1 }, desc: 'Arbetslöshet bland dem som pluggat på universitet' },
  { id: 'wagework', name: 'Löntagare', group: 'arb', fmt: 'pct', better: 'high', mode: 'add', min: 3, max: 99,
    fx: { gdp: 8, factory: 6, welfare: 3 }, desc: 'Andel av de sysselsatta som har en anställning med lön' },
  { id: 'parttime', name: 'Deltidsarbetande', group: 'arb', fmt: 'pct', better: null, mode: 'add', min: 1, max: 60,
    fx: { welfare: 4, qol: 3 }, desc: 'Andel av de sysselsatta som jobbar deltid' },
  { id: 'femmanagers', name: 'Kvinnliga chefer', group: 'arb', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 70,
    fx: { freedom: 6, welfare: 2 }, desc: 'Andel av cheferna som är kvinnor' },
  { id: 'childlabor', name: 'Barnarbete (7–14 år)', group: 'arb', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 70,
    fx: { welfare: -10, hdi: -10, gdp: -3 }, desc: 'Andel av barnen som måste arbeta i stället för att bara gå i skolan' },
  // ---------- VÄLFÄRD & HÄLSA ----------
  { id: 'healthpc', name: 'Vård per invånare', group: 'hal', fmt: 'usd', better: 'high', mode: 'mul',
    desc: 'Vad landet lägger på vård per invånare och år' },
  { id: 'neonatal', name: 'Nyföddas dödlighet', group: 'hal', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { welfare: -0.5, hdi: -0.6, qol: -0.2 }, desc: 'Barn som dör under sin första månad, per 1 000 födda' },
  { id: 'birthcare', name: 'Förlossningar med barnmorska', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 100,
    fx: { welfare: 10, hdi: 8 }, desc: 'Andel av barnen som föds med läkare eller barnmorska på plats' },
  { id: 'hepb', name: 'Vaccin mot hepatit B', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 20, max: 99,
    fx: { welfare: 6, hdi: 4 }, desc: 'Andel av ettåringarna som vaccinerats mot hepatit B' },
  { id: 'handwash', name: 'Tvätta händerna hemma', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 2, max: 100,
    fx: { welfare: 6, qol: 6 }, desc: 'Andel som har tvål och vatten att tvätta händerna med hemma' },
  { id: 'cleanfuel', name: 'Rent bränsle i köket', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 100,
    fx: { qol: 8, hdi: 6, factory: 2 }, desc: 'Andel som lagar mat med el eller gas i stället för ved och kol' },
  { id: 'commdeath', name: 'Döda i smittsamma sjukdomar', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 1, max: 80,
    fx: { welfare: -8, hdi: -10 }, desc: 'Andel av dödsfallen som beror på smittsamma sjukdomar, svält och förlossningar' },
  { id: 'injurydeath', name: 'Döda i olyckor och skador', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 2, max: 40,
    fx: { safety: -5, qol: -2 }, desc: 'Andel av dödsfallen som beror på olyckor, trafik och våld' },
  // ---------- KUNSKAP & TEKNIK ----------
  { id: 'lowsec', name: 'Klarar grundskolan', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 110,
    fx: { hdi: 10, research: 5, welfare: 4 }, desc: 'Andel av ungdomarna som går ut grundskolan (över 100 = fler äldre tar igen den)' },
  { id: 'litfem', name: 'Läskunniga kvinnor', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 100,
    fx: { hdi: 8, freedom: 4 }, desc: 'Andel av de vuxna kvinnorna som kan läsa och skriva' },
  { id: 'girlsschool', name: 'Flickor per pojke i skolan', group: 'kun', fmt: 'num2', better: null, mode: 'add', min: 0.4, max: 1.4,
    fx: { freedom: 0.1 }, desc: '1,00 betyder att lika många flickor som pojkar går i skolan' },
  { id: 'trainedteach', name: 'Utbildade lärare', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 10, max: 100,
    fx: { research: 6, welfare: 4 }, desc: 'Andel av lärarna i lågstadiet som har lärarutbildning' },
  { id: 'patentsfor', name: 'Patent från utlandet', group: 'kun', fmt: 'count', better: null, mode: 'mul', agg: 'sum',
    fx: { research: 0.4, gdp: 0.4 }, desc: 'Patentansökningar från utländska företag per år' },
  // ---------- INFRASTRUKTUR & ENERGI ----------
  { id: 'elecloss', name: 'Elförluster i nätet', group: 'inf', fmt: 'pct', better: 'low', mode: 'add', min: 1, max: 60,
    fx: { factory: -6, corruption: 5 }, desc: 'Andel av elen som försvinner (läckor och stöld) innan den når kunden' },
  // ---------- MILJÖ ----------
  { id: 'ghg', name: 'Växthusgaser totalt', group: 'nat', fmt: 'mt', better: 'low', mode: 'mul', agg: 'sum',
    fx: { factory: 0.5 }, desc: 'Alla växthusgaser landet släpper ut per år, omräknat till koldioxid' },
  { id: 'n2o', name: 'Lustgas', group: 'nat', fmt: 'mt', better: 'low', mode: 'mul', agg: 'sum',
    fx: { factory: 0.3 }, desc: 'Utsläpp av lustgas (mest från gödsel och jordbruk), omräknat till koldioxid' },
  { id: 'disasters', name: 'Drabbade av torka och översvämning', group: 'nat', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 40,
    desc: 'Andel av befolkningen som drabbats av torka, översvämning eller extrem hetta (snitt per år)' },

  // ---------- V5.14: nya brott (uppskattade som de andra, se setIndicatorData) ----------
  { id: 'youthcrime', name: 'Ungdomsbrott', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { welfare: -0.3, safety: -0.2, unrest: 0.2 }, desc: 'Brott där den misstänkta är 15–20 år, per 100 000 invånare och år' },
  { id: 'harass', name: 'Ofredande', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.3, freedom: -0.1 }, desc: 'Någon blir trakasserad eller skrämd, fall per 100 000 och år' },
  { id: 'trespass', name: 'Olaga intrång', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.2 }, desc: 'Någon tar sig in där de inte får vara, fall per 100 000 och år' },
  { id: 'biketheft', name: 'Cykelstölder', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.2, welfare: -0.1 }, desc: 'Stulna cyklar per 100 000 invånare och år' },
  { id: 'graffiti', name: 'Klotter', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.15, qol: -0.1 }, desc: 'Anmält klotter på hus, tåg och skyltar, per 100 000 och år' },
  { id: 'hitrun', name: 'Smitning från olycka', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.2 }, desc: 'Förare som kör iväg efter en olycka, per 100 000 och år' },
  { id: 'speeding', name: 'Fortkörningsböter', group: 'brt', fmt: 'per100k', better: null, mode: 'mul',
    fx: { statepower: 0.2, safety: 0.1 }, desc: 'Bötfällda för fortkörning per 100 000 och år — fler kameror ger fler böter' },
  { id: 'animalcruelty', name: 'Djurplågeri', group: 'brt', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { welfare: -0.2 }, desc: 'Anmält djurplågeri per 100 000 invånare och år' },
  { id: 'counterfeit', name: 'Varumärkesförfalskning', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.4, research: -0.2 }, desc: 'Upptäckta piratkopior och fejkade märkesvaror, fall per 100 000 och år' },
  { id: 'forgery', name: 'Dokumentförfalskning', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.4, statepower: -0.2 }, desc: 'Falska pass, intyg och kontrakt, fall per 100 000 och år' },
  { id: 'embezzle', name: 'Förskingring', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.5 }, desc: 'Någon tar pengar som de bara skulle ta hand om, fall per 100 000 och år' },
  { id: 'insider', name: 'Insiderbrott', group: 'ekb', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { corruption: 0.3 }, desc: 'Fusk på börsen med hemlig information, fall per 100 000 och år' },
  { id: 'piracy', name: 'Piratkopierade program', group: 'ekb', fmt: 'pct', better: 'low', mode: 'add', min: 5, max: 95,
    fx: { corruption: 2, research: -2 }, desc: 'Andel av datorprogrammen i landet som är olagliga kopior' },
  { id: 'illegallog', name: 'Olaglig avverkning', group: 'ekb', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 90,
    fx: { corruption: 3, statepower: -1 }, desc: 'Andel av skogen som huggs ner som sker olagligt' },
  { id: 'detention', name: 'Häktade utan dom', group: 'rtt', fmt: 'pct', better: 'low', mode: 'add', min: 3, max: 90,
    fx: { freedom: -6, statepower: 4, justtime: 2 }, desc: 'Andel av fångarna som sitter inne utan att ha fått en dom' },
  { id: 'policetrust', name: 'Förtroende för polisen', group: 'rtt', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 97,
    fx: { safety: 8, corruption: -10, freedom: 3, approval: 3 }, desc: 'Andel som litar på polisen' },
  { id: 'lawyers', name: 'Advokater', group: 'rtt', fmt: 'per100k', better: null, mode: 'mul',
    fx: { freedom: 0.3, corruption: -0.2 }, desc: 'Advokater per 100 000 invånare' },
  { id: 'judges', name: 'Domare', group: 'rtt', fmt: 'per100k', better: null, mode: 'mul',
    fx: { statepower: 0.2, freedom: 0.1 }, desc: 'Domare per 100 000 invånare' },

  // ========== V5.16 VERKLIGHETEN: 75 nya mått ==========
  // ---------- DEMOKRATI & STYRE (The Economists demokratiindex, EIU 2024) ----------
  { id: 'demo', name: 'Demokratiindex', group: 'dmk', fmt: 'score10', better: 'high', agg: 'derived',
    desc: 'The Economists demokratiindex, medel av de fem delarna. Över 8 = full demokrati, 6–8 bristfällig, 4–6 hybridregim, under 4 auktoritär' },
  { id: 'regime', name: 'Styrelseskick', group: 'dmk', fmt: 'regime', better: 'high', agg: 'derived', desc: 'Vad demokratiindexet säger om landet' },
  { id: 'demo_el', name: 'Val och mångfald', group: 'dmk', fmt: 'score10', better: 'high', mode: 'add', min: 0, max: 10,
    fx: { freedom: 2.5, statepower: -1.2, ideopower: -0.6 }, desc: 'Fria och rättvisa val, flera partier och en opposition som får verka (0–10)' },
  { id: 'demo_gov', name: 'Regeringens funktion', group: 'dmk', fmt: 'score10', better: 'high', mode: 'add', min: 0, max: 10,
    fx: { corruption: -1.5, stability: 1, freedom: 0.8, statepower: -0.5 }, desc: 'Om de valda styr på riktigt — med insyn, kontroll och utan korruption (0–10)' },
  { id: 'demo_part', name: 'Politiskt deltagande', group: 'dmk', fmt: 'score10', better: 'high', mode: 'add', min: 0, max: 10,
    fx: { freedom: 1.8, approval: 0.6, statepower: -0.6 }, desc: 'Valdeltagande, partier, föreningar och engagemang (0–10)' },
  { id: 'demo_cult', name: 'Politisk kultur', group: 'dmk', fmt: 'score10', better: 'high', mode: 'add', min: 0, max: 10,
    fx: { freedom: 1, stability: 0.8, ideopower: -0.8, unrest: -0.6 }, desc: 'Folkets stöd för demokratin och viljan att kompromissa (0–10)' },
  { id: 'demo_civ', name: 'Fri- och rättigheter', group: 'dmk', fmt: 'score10', better: 'high', mode: 'add', min: 0, max: 10,
    fx: { freedom: 3, safety: 0.3, statepower: -1.2 }, desc: 'Yttrandefrihet, pressfrihet, rättssäkerhet och skydd för minoriteter (0–10)' },
  { id: 'turnout', name: 'Valdeltagande', group: 'dmk', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 99,
    fx: { freedom: 6, approval: 4, unrest: -2 }, desc: 'Andel av de röstberättigade som röstade i senaste valet (~)' },
  { id: 'trustgov', name: 'Förtroende för regeringen', group: 'dmk', fmt: 'pct', better: 'high', mode: 'add', min: 3, max: 95,
    fx: { approval: 25, corruption: -8, unrest: -6, stability: 5 }, desc: 'Andel som litar på regeringen (~)' },
  { id: 'trustparl', name: 'Förtroende för parlamentet', group: 'dmk', fmt: 'pct', better: 'high', mode: 'add', min: 3, max: 92,
    fx: { approval: 18, corruption: -8, freedom: 4 }, desc: 'Andel som litar på parlamentet (~)' },
  { id: 'trustcourt', name: 'Förtroende för domstolarna', group: 'dmk', fmt: 'pct', better: 'high', mode: 'add', min: 3, max: 95,
    fx: { corruption: -10, freedom: 5, statepower: -4, safety: 3 }, desc: 'Andel som litar på domstolarna (~)' },
  { id: 'griev', name: 'Missnöje', group: 'dmk', fmt: 'score100', better: 'low', mode: 'add', min: 0, max: 100,
    fx: { unrest: 50, approval: -20, stability: -10 }, desc: 'Hur mycket folket har att klaga på: nedskärningar, skatter, kriser och inskränkt frihet (0–100)' },
  { id: 'protests', name: 'Demonstrationer per år', group: 'dmk', fmt: 'count', better: null, mode: 'mul', agg: 'sum',
    fx: { unrest: 1.2, freedom: 0.4, statepower: -0.3 }, desc: 'Demonstrationer och protestmöten på ett år (~)' },
  { id: 'strikes', name: 'Strejkdagar', group: 'dmk', fmt: 'per1000', better: 'low', mode: 'mul',
    fx: { unrest: 1.5, welfare: -0.3, statepower: -0.3 }, desc: 'Arbetsdagar som går förlorade i strejker, per 1 000 anställda och år (~)' },
  { id: 'polprisoners', name: 'Politiska fångar', group: 'dmk', fmt: 'count', better: 'low', agg: 'sum', desc: 'Människor som sitter fängslade för sina åsikter (~)' },
  { id: 'parties', name: 'Partier i parlamentet', group: 'dmk', fmt: 'index', better: null, agg: 'max', desc: 'Hur många partier som har platser i parlamentet (~)' },
  { id: 'unionrate', name: 'Fackligt anslutna', group: 'arb', fmt: 'pct', better: null, mode: 'add', min: 0, max: 95,
    fx: { welfare: 8, freedom: 3, statepower: -3 }, desc: 'Andel av de anställda som är med i ett fackförbund (~)' },

  // ---------- STATSFINANSER ----------
  { id: 'treasury', name: 'Statskassan', group: 'fin', fmt: 'susd', better: 'high', agg: 'derived', desc: 'Pengarna i statskassan just nu — under noll lever staten på bankens kredit' },
  { id: 'budgetbal', name: 'Budgetsaldo', group: 'fin', fmt: 'pp', better: 'high', mode: 'add', min: -40, max: 25, agg: 'gdp',
    fx: { income: 3, welfare: -2, milpower: -1, gdp: 1 }, desc: 'Statens inkomster minus utgifter, procent av BNP (minus = underskott)' },
  { id: 'deficitusd', name: 'Över- eller underskott', group: 'fin', fmt: 'susd', better: 'high', agg: 'derived', desc: 'Budgetsaldot i pengar på ett år' },
  { id: 'revenue', name: 'Statens inkomster', group: 'fin', fmt: 'pctgdp', better: null, mode: 'add', min: 5, max: 75, agg: 'gdp',
    fx: { income: 10, welfare: 5, gdp: -2 }, desc: 'Skatter, avgifter och andra inkomster i procent av BNP' },
  { id: 'debtusd', name: 'Statsskulden', group: 'fin', fmt: 'usdbig', better: 'low', agg: 'derived', desc: 'Hela statsskulden i dollar' },
  { id: 'debtpc', name: 'Statsskuld per invånare', group: 'fin', fmt: 'usd', better: 'low', agg: 'derived', desc: 'Statsskulden delad på alla invånare' },
  { id: 'rating', name: 'Kreditbetyg', group: 'fin', fmt: 'rating', better: 'low', mode: 'add', min: 0, max: 8, agg: 'gdp',
    fx: { stability: -1.5, corruption: 1.5, unrest: 1, income: -1 }, desc: 'Vad långivarna tror om statens förmåga att betala (AAA bäst — D = statsbankrutt)' },
  { id: 'bondrate', name: 'Ränta på statslån', group: 'fin', fmt: 'pct', better: 'low', agg: 'derived', desc: 'Vad staten betalar i ränta när den lånar' },
  { id: 'interestusd', name: 'Räntor per år', group: 'fin', fmt: 'usdbig', better: 'low', agg: 'derived', desc: 'Vad statsskulden kostar i ränta på ett år' },
  { id: 'pensionx', name: 'Pensionsutgifter', group: 'fin', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 25, agg: 'gdp',
    fx: { welfare: 3, income: -1 }, desc: 'Allmänna pensioner i procent av BNP (~)' },
  { id: 'socialx', name: 'Sociala transfereringar', group: 'fin', fmt: 'pctgdp', better: null, mode: 'add', min: 0, max: 35, agg: 'gdp',
    fx: { welfare: 8, income: -2 }, desc: 'Bidrag, försäkringar och stöd utom pensioner, procent av BNP (~)' },
  { id: 'corptax', name: 'Bolagsskatt', group: 'fin', fmt: 'pct', better: null, mode: 'add', min: 0, max: 60, agg: 'gdp',
    fx: { income: 6 }, desc: 'Skattesatsen på företagens vinster' },
  { id: 'incometax', name: 'Högsta inkomstskatt', group: 'fin', fmt: 'pct', better: null, mode: 'add', min: 0, max: 80, agg: 'gdp',
    fx: { income: 8, welfare: 4 }, desc: 'Högsta marginalskatten på lön' },
  { id: 'vat', name: 'Moms', group: 'fin', fmt: 'pct', better: null, mode: 'add', min: 0, max: 30, agg: 'gdp',
    fx: { income: 4 }, desc: 'Mervärdesskatten på det mesta man köper (USA: delstaternas försäljningsskatt)' },

  // ---------- MIGRATION & INTEGRATION ----------
  { id: 'immig', name: 'Invandrare per år', group: 'mig', fmt: 'count', better: null, agg: 'sum', desc: 'Människor som flyttar till landet på ett år (~)' },
  { id: 'emig', name: 'Utvandrare per år', group: 'mig', fmt: 'count', better: null, mode: 'mul', agg: 'sum',
    fx: { qol: -0.3, freedom: -0.2, unrest: 0.3, gdp: -0.2 }, desc: 'Människor som flyttar från landet på ett år (~)' },
  { id: 'asylum', name: 'Asylsökande per år', group: 'mig', fmt: 'count', better: null, mode: 'mul', agg: 'sum',
    fx: { immigration: 0.8, freedom: 0.2 }, desc: 'Människor som söker skydd i landet på ett år (~)' },
  { id: 'newcitizens', name: 'Nya medborgare per år', group: 'mig', fmt: 'count', better: null, mode: 'mul', agg: 'sum',
    fx: { integration: 0.4, immigration: 0.2 }, desc: 'Invandrare som blir medborgare på ett år (~)' },
  { id: 'migstock', name: 'Utrikes födda', group: 'mig', fmt: 'count', better: null, agg: 'sum', desc: 'Invånare som är födda i ett annat land' },
  { id: 'secondgen', name: 'Andra generationen', group: 'mig', fmt: 'pct', better: null, mode: 'add', min: 0, max: 60,
    fx: {}, desc: 'Andel födda i landet med två föräldrar födda utomlands (~)' },
  { id: 'migemp', name: 'Utrikes födda i arbete', group: 'mig', fmt: 'pct', better: 'high', mode: 'add', min: 15, max: 90,
    fx: { integration: 12, gdp: 4, unrest: -3 }, desc: 'Sysselsättningen bland utrikes födda (~)' },
  { id: 'integ', name: 'Integrationsindex', group: 'mig', fmt: 'score100', better: 'high', mode: 'add', min: 0, max: 100,
    fx: { integration: 30, welfare: 4, unrest: -6, immigration: -6 }, desc: 'Hur väl nya invånare kommer in i språk, jobb och samhälle (~)' },
  { id: 'segreg', name: 'Boendesegregation', group: 'mig', fmt: 'score100', better: 'low', mode: 'add', min: 0, max: 100,
    fx: { integration: -18, welfare: -5, immigration: 6, safety: -3 }, desc: 'Hur uppdelade städerna är efter inkomst och ursprung (~)' },
  { id: 'exclusion', name: 'Bor i utanförskapsområden', group: 'mig', fmt: 'pct', better: 'low', desc: 'Andel som bor i områden med låg sysselsättning, hög brottslighet och svag skola (~)' },
  { id: 'xenophobia', name: 'Främlingsfientlighet', group: 'mig', fmt: 'pct', better: 'low', mode: 'add', min: 1, max: 90,
    fx: { integration: -15, unrest: 8, freedom: -4, immigration: 5 }, desc: 'Andel som inte vill ha invandrare som grannar (~)' },

  // ---------- VARDAG & PLÅNBOK ----------
  { id: 'medinc', name: 'Medianinkomst', group: 'var', fmt: 'usd', better: 'high', desc: 'Hälften tjänar mer, hälften mindre — per invånare och år efter skatt (~)' },
  { id: 'wage', name: 'Medellön', group: 'var', fmt: 'usdmo', better: 'high', desc: 'Genomsnittlig lön före skatt (~)' },
  { id: 'minwage', name: 'Minimilön', group: 'var', fmt: 'usdmo', better: null, desc: 'Lägsta lön enligt lag — 0 betyder att lönerna sätts i avtal eller inte alls (~)' },
  { id: 'houseprice', name: 'Bostadspriser', group: 'var', fmt: 'ratio', better: 'low', mode: 'mul',
    fx: { gdp: 0.25, immigration: 0.15, factory: -0.05 }, desc: 'Vad en vanlig bostad kostar, räknat i årsinkomster (~)' },
  { id: 'rentshare', name: 'Boendekostnad', group: 'var', fmt: 'pct', better: 'low', mode: 'add', min: 8, max: 70,
    fx: { welfare: -3 }, desc: 'Andel av inkomsten som går till hyra eller bolån (~)' },
  { id: 'homeless', name: 'Hemlösa', group: 'var', fmt: 'count', better: 'low', mode: 'mul', agg: 'sum',
    fx: { welfare: -0.4, qol: -0.2, gdp: -0.1 }, desc: 'Människor utan eget boende (~)' },
  { id: 'housingshort', name: 'Bostadsbrist', group: 'var', fmt: 'count', better: 'low', agg: 'sum', desc: 'Bostäder som saknas för att alla ska få ett eget hem (~)' },
  { id: 'foodprice', name: 'Matpriser', group: 'var', fmt: 'index', better: 'low', mode: 'mul',
    fx: { factory: -0.08, income: 0.04, unrest: 0.06 }, desc: 'Vad maten kostar i förhållande till inkomsterna (100 = när du tog makten)' },
  { id: 'fuelprice', name: 'Bensinpris', group: 'var', fmt: 'usdl', better: 'low', mode: 'mul',
    fx: { factory: -0.05 }, desc: 'En liter bensin vid pumpen' },
  { id: 'elprice', name: 'Elpris', group: 'var', fmt: 'usdkwh', better: 'low', mode: 'mul',
    fx: { factory: -0.05, research: -0.03 }, desc: 'En kilowattimme el för hushållen' },
  { id: 'hhdebt', name: 'Hushållens skulder', group: 'var', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { gdp: 0.2, freedom: 0.05 }, desc: 'Hushållens lån i procent av deras årsinkomst (~)' },
  { id: 'retireage', name: 'Pensionsålder', group: 'var', fmt: 'years', better: null, mode: 'add', min: 45, max: 80,
    fx: {}, desc: 'När man normalt går i pension' },
  { id: 'workweek', name: 'Arbetsvecka', group: 'var', fmt: 'hours', better: null, mode: 'add', min: 25, max: 65,
    fx: { factory: 2, qol: -2 }, desc: 'Arbetade timmar i veckan för den som jobbar heltid' },
  { id: 'vacationdays', name: 'Semester', group: 'var', fmt: 'days', better: 'high', mode: 'add', min: 0, max: 50,
    fx: {}, desc: 'Lagstadgade semesterdagar per år' },
  { id: 'parentalweeks', name: 'Föräldraledighet', group: 'var', fmt: 'weeks', better: 'high', mode: 'add', min: 0, max: 160,
    fx: {}, desc: 'Betalda veckor för föräldrarna tillsammans när ett barn föds' },
  { id: 'cars', name: 'Bilar', group: 'var', fmt: 'per1000', better: null, mode: 'mul',
    fx: { gdp: 0.25 }, desc: 'Personbilar per 1 000 invånare (~)' },
  { id: 'commute', name: 'Restid till jobbet', group: 'var', fmt: 'minutes', better: 'low', mode: 'add', min: 10, max: 120,
    fx: { factory: 1, gdp: -1 }, desc: 'Genomsnittlig resa till jobbet, enkel väg (~)' },

  // ---------- VÄLFÄRD & HÄLSA, KUNSKAP, EKONOMI, ENERGI ----------
  { id: 'carewait', name: 'Väntetid i vården', group: 'hal', fmt: 'days', better: 'low', mode: 'mul',
    fx: { welfare: -0.35, hdi: -0.1, income: 0.05 }, desc: 'Väntan på att få träffa en specialistläkare (~)' },
  { id: 'sickleave', name: 'Sjukfrånvaro', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 0.5, max: 15,
    fx: { welfare: 1, qol: -0.8, unrest: 0.5 }, desc: 'Andel av arbetstiden som försvinner i sjukdom (~)' },
  { id: 'mentalill', name: 'Psykisk ohälsa', group: 'hal', fmt: 'pct', better: 'low', mode: 'add', min: 3, max: 40,
    fx: { qol: -4, unrest: 2, welfare: -1.5, freedom: -1 }, desc: 'Andel med ångest, depression eller annan psykisk sjukdom (~)' },
  { id: 'suicide', name: 'Självmord', group: 'hal', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { qol: -0.25, welfare: -0.15, unrest: 0.1 }, desc: 'Självmord per 100 000 invånare och år' },
  { id: 'govhealth', name: 'Statens vårdutgifter', group: 'hal', fmt: 'pctgdp', better: 'high', mode: 'add', min: 0, max: 15, agg: 'gdp',
    fx: { welfare: 3, income: -1 }, desc: 'Vård som staten betalar, procent av BNP' },
  { id: 'poverty365', name: 'Fattiga (under 3,65 $)', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { welfare: -0.4, gdp: -0.4, corruption: 0.25 }, desc: 'Andel som lever på under 3,65 $ om dagen' },
  { id: 'poverty685', name: 'Fattiga (under 6,85 $)', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { welfare: -0.35, gdp: -0.35, corruption: 0.2 }, desc: 'Andel som lever på under 6,85 $ om dagen' },
  { id: 'natpov', name: 'Under fattigdomsgränsen', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { welfare: -0.4, gdp: -0.25 }, desc: 'Andel som lever under landets egen fattigdomsgräns' },
  { id: 'pisa', name: 'Skolresultat', group: 'kun', fmt: 'index', better: 'high', mode: 'add', min: 250, max: 620,
    fx: { research: 30, welfare: 15, hdi: 10 }, desc: 'Femtonåringarnas kunskaper i matte, läsning och naturvetenskap (PISA-skalan, 500 = OECD-snitt) (~)' },
  { id: 'learnpov', name: 'Kan inte läsa vid tio', group: 'kun', fmt: 'pct', better: 'low', mode: 'add', min: 1, max: 99,
    fx: { welfare: -10, research: -8, hdi: -6 }, desc: 'Andel tioåringar som inte kan läsa och förstå en enkel text' },
  { id: 'tertfem', name: 'Kvinnor på högskolan', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 0, max: 160,
    fx: { research: 8, freedom: 6, hdi: 4 }, desc: 'Kvinnor som studerar på högskola i förhållande till åldersgruppen' },
  { id: 'depositrate', name: 'Sparränta', group: 'eko', fmt: 'pct', better: null, mode: 'add', min: 0, max: 60,
    fx: { stability: -1.5, corruption: 1.5 }, desc: 'Räntan bankerna ger på sparpengar' },
  { id: 'femown', name: 'Företag med kvinnliga ägare', group: 'eko', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 80,
    fx: { freedom: 8 }, desc: 'Andel företag där en kvinna är med och äger' },
  { id: 'firmbribe', name: 'Företag som fått mutkrav', group: 'ekb', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 80,
    fx: { corruption: 12, statepower: 2 }, desc: 'Andel företag som blivit ombedda att betala en muta' },
  { id: 'fossilelec', name: 'Fossil el', group: 'inf', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 100,
    fx: { factory: 5, research: -4 }, desc: 'Andel av elen från kol, olja och gas' },
  { id: 'gaselec', name: 'Gaskraft', group: 'inf', fmt: 'pct', better: null, mode: 'add', min: 0, max: 100,
    fx: { factory: 2 }, desc: 'Andel av elen från naturgas' },
];

export const IND = Object.fromEntries(INDICATORS.map((d) => [d.id, d]));

// ---------- lagar som slår direkt på ett mått ----------
// Utöver vägen via nationsvärdena har vissa lagar ett uppenbart, direkt samband
// med ett mått: förnybar energi höjer andelen förnybart, skattenivån ÄR
// skatteintäkterna, sedelpressen ger inflation. Bara lagar som skiljer sig från
// startläget räknas (det verkliga datat har redan landets egen politik).
//   ['+', n] lägg till   ['*', f] multiplicera   ['=', n] sätt till
//   ['%pop', f] sätt till en andel av befolkningen (nettoinvandring per år)
export const LAW_EFFECTS = {
  taxes: { t0: { tax: ['=', 8] }, t10: { tax: ['=', 15] }, t30: { tax: ['=', 33] }, t40: { tax: ['=', 43] }, t60: { tax: ['=', 58] } },
  monetary: {
    printing: { infl: ['+', 25], lendrate: ['+', 6] }, loose: { infl: ['+', 2], lendrate: ['+', -1] },
    tight: { infl: ['+', -1.5], lendrate: ['+', 2.5] }, gold: { infl: ['+', -2], lendrate: ['+', 3] },
  },
  energy: {
    renewable: { renew: ['+', 35], co2: ['*', 0.55], pm25: ['*', 0.75] }, green: { renew: ['+', 15], co2: ['*', 0.8] },
    nuclear: { co2: ['*', 0.75], renew: ['+', -5] }, fossil: { renew: ['+', -15], co2: ['*', 1.35], pm25: ['*', 1.3] },
  },
  environment: {
    strict: { pm25: ['*', 0.6], protected: ['+', 15], forest: ['+', 4], co2: ['*', 0.85] },
    strong: { pm25: ['*', 0.8], protected: ['+', 7] },
    weak: { pm25: ['*', 1.2], protected: ['+', -4] },
    none: { pm25: ['*', 1.5], protected: ['+', -10], forest: ['+', -6] },
  },
  minimum_wage: {
    veryhigh: { unemp: ['+', 3], youthunemp: ['+', 8], poverty: ['*', 0.6], gini: ['+', -3] },
    high: { unemp: ['+', 1.2], youthunemp: ['+', 3], poverty: ['*', 0.8] },
    low: { unemp: ['+', -0.8], poverty: ['*', 1.15] },
    none: { unemp: ['+', -1.5], poverty: ['*', 1.4], gini: ['+', 4] },
  },
  pensions: {
    generous: { debt: ['+', 25], poverty: ['*', 0.85] }, public: { debt: ['+', 8] },
    private: { debt: ['+', -5], gini: ['+', 2] }, none: { poverty: ['*', 1.3], debt: ['+', -12], gini: ['+', 4] },
  },
  unions: {
    mandatory: { gini: ['+', -4], unemp: ['+', 1.5] }, strong: { gini: ['+', -2], unemp: ['+', 0.6] },
    weak: { gini: ['+', 2] }, banned: { gini: ['+', 5], unemp: ['+', -1] },
  },
  ownership: {
    nationalized: { gdpgrowth: ['+', -1.5], fdi: ['+', -3] }, strategic: { fdi: ['+', -1] },
    privatized: { gdpgrowth: ['+', 0.5], fdi: ['+', 1.5] }, full: { gdpgrowth: ['+', 0.8], fdi: ['+', 3], gini: ['+', 3] },
  },
  housing: { public: { gini: ['+', -2], debt: ['+', 6] }, rentcontrol: { gini: ['+', -1] }, deregulated: { gini: ['+', 3] } },
  firearms: {
    free: { homicide: ['*', 1.8], robbery: ['*', 1.2], feelsafe: ['+', -4] }, licensed: { homicide: ['*', 1.2] },
    ban: { homicide: ['*', 0.85], robbery: ['*', 0.9] }, stateonly: { homicide: ['*', 0.75], robbery: ['*', 0.85] },
  },
  drugs: {
    legal: { homicide: ['*', 0.85], drugcrime: ['*', 0.15], prisoners: ['*', 0.85] },
    decriminalized: { homicide: ['*', 0.95], drugcrime: ['*', 0.4], prisoners: ['*', 0.9] },
    strict: { drugcrime: ['*', 1.4], prisoners: ['*', 1.15] },
    war: { homicide: ['*', 1.3], drugcrime: ['*', 2.2], prisoners: ['*', 1.5] },
  },
  punishments: {
    minimal: { homicide: ['*', 1.15], prisoners: ['*', 0.6] }, low: { prisoners: ['*', 0.8] },
    harsh: { homicide: ['*', 0.93], prisoners: ['*', 1.3] }, veryharsh: { homicide: ['*', 0.88], prisoners: ['*', 1.7] },
  },
  rehabilitation: {
    veryhigh: { prisoners: ['*', 0.8], robbery: ['*', 0.9] }, high: { prisoners: ['*', 0.9] },
    unavailable: { prisoners: ['*', 1.15], robbery: ['*', 1.1] }, nonexistent: { prisoners: ['*', 1.25], robbery: ['*', 1.15] },
  },
  trials: { long: { prisoners: ['*', 0.9] }, speedup: { prisoners: ['*', 1.1] }, quick: { prisoners: ['*', 1.2] } },
  surveillance: {
    none: { voice: ['+', 0.2], cybercrime: ['*', 1.1] },
    mass: { voice: ['+', -0.4], homicide: ['*', 0.9], cybercrime: ['*', 0.85], feelsafe: ['+', 3] },
    total: { voice: ['+', -0.9], homicide: ['*', 0.85], cybercrime: ['*', 0.75], feelsafe: ['+', 5] },
  },
  // V5.7: de sex nya lagarna
  alcohol_policy: {
    free: { alcohol: ['*', 1.25] }, licensed: { alcohol: ['*', 1.1] }, monopoly: { alcohol: ['*', 0.8] },
    restricted: { alcohol: ['*', 0.6] }, prohibition: { alcohol: ['*', 0.3], homicide: ['*', 1.15] },
  },
  transport: {
    freetransit: { co2: ['*', 0.85], pm25: ['*', 0.85], traffic: ['*', 0.8] }, transitfirst: { co2: ['*', 0.92], pm25: ['*', 0.9], traffic: ['*', 0.9] },
    roads: { co2: ['*', 1.08], traffic: ['*', 1.1] }, carnation: { co2: ['*', 1.2], pm25: ['*', 1.15], traffic: ['*', 1.25] },
    private: { traffic: ['*', 1.1] },
  },
  agriculture: {
    collective: { agri: ['+', 3], undernourish: ['*', 1.2] }, subsidized: { agri: ['+', 1.5], undernourish: ['*', 0.8] },
    organic: { protected: ['+', 2], pm25: ['*', 0.95] }, freemarket: { agri: ['+', -1] }, agribusiness: { agri: ['+', -1.5], forest: ['+', -3] },
  },
  citizenship: { birthright: { netmig: ['*', 1.15] }, easy: { netmig: ['*', 1.08] }, bloodline: { netmig: ['*', 0.8] }, loyalty: { netmig: ['*', 0.7] } },
  childcare: {
    free: { femlabor: ['+', 8], fert: ['+', 0.15], birth: ['+', 1] }, subsidized: { femlabor: ['+', 4], fert: ['+', 0.08], birth: ['+', 0.5] },
    familycash: { femlabor: ['+', -4], fert: ['+', 0.1], birth: ['+', 0.6] }, private: { femlabor: ['+', -3], fert: ['+', -0.1], birth: ['+', -0.6] },
    none: { femlabor: ['+', -8], fert: ['+', -0.15], birth: ['+', -1] },
  },
  policing: {
    unarmed: { police: ['*', 0.9], homicide: ['*', 1.05], feelsafe: ['+', 2] },
    community: { police: ['*', 0.95], homicide: ['*', 0.95], prisoners: ['*', 0.85], feelsafe: ['+', 4] },
    tough: { prisoners: ['*', 1.3], robbery: ['*', 0.85], feelsafe: ['+', 2] },
    militarized: { police: ['*', 1.4], prisoners: ['*', 1.5], homicide: ['*', 0.9], feelsafe: ['+', -2] },
    secretpolice: { police: ['*', 1.8], prisoners: ['*', 1.8], voice: ['+', -0.6], feelsafe: ['+', -8] },
  },
  internet: {
    free: { internet: ['+', 4] }, censored: { internet: ['+', -8], voice: ['+', -0.3] },
    firewall: { internet: ['+', -20], voice: ['+', -0.6] },
  },
  press: {
    full: { voice: ['+', 0.4] }, free: { voice: ['+', 0.25] }, publicservice: { voice: ['+', 0.25] },
    oligarch: { voice: ['+', -0.2], corruptgov: ['+', -0.3] }, state: { voice: ['+', -0.4] },
    highstate: { voice: ['+', -0.8] }, propaganda: { voice: ['+', -1.4] },
  },
  elections: {
    entirelyfree: { voice: ['+', 0.4] }, free: { voice: ['+', 0.2] }, hybrid: { voice: ['+', -0.3] },
    unfair: { voice: ['+', -0.8] }, no: { voice: ['+', -1.4], polstab: ['+', -0.2] },
  },
  government: {
    directdemo: { voice: ['+', 0.5] }, strongdemo: { voice: ['+', 0.3] }, democracy: { voice: ['+', 0.15] },
    constmonarchy: { voice: ['+', 0.15], polstab: ['+', 0.2] }, hybrid: { voice: ['+', -0.3] },
    authoritarian: { voice: ['+', -1], polstab: ['+', 0.1] }, junta: { voice: ['+', -1.4], polstab: ['+', -0.4], milx: ['+', 2.5] },
    totalitarian: { voice: ['+', -1.8] },
  },
  civil_rights: { extremelyhigh: { voice: ['+', 0.3], rulelaw: ['+', 0.2] }, verylimited: { voice: ['+', -0.6], rulelaw: ['+', -0.4] }, norights: { voice: ['+', -1], rulelaw: ['+', -0.8] } },
  equality: {
    full: { femlabor: ['+', 10], womenparl: ['+', 12], gii: ['+', -0.04] },
    strong: { femlabor: ['+', 5], womenparl: ['+', 6], gii: ['+', -0.02] },
    traditional: { femlabor: ['+', -12], womenparl: ['+', -8], gii: ['+', 0.1], fert: ['+', 0.4], birth: ['+', 2.5] },
    restricted: { femlabor: ['+', -30], womenparl: ['=', 0], gii: ['+', 0.3], fert: ['+', 0.9], birth: ['+', 5], literacy: ['+', -8] },
  },
  military_service: { none: { milx: ['+', -0.4] }, high: { milx: ['+', 0.5], youthunemp: ['+', -3] }, mandatory: { milx: ['+', 1], unemp: ['+', -1], youthunemp: ['+', -6] } },
  healthcare: { fullyfree: { healthx: ['+', 2], life: ['+', 1] }, free: { healthx: ['+', 1], life: ['+', 0.5] }, mostlyunfree: { life: ['+', -0.7] }, unfree: { life: ['+', -1.5], infmort: ['*', 1.2] } },
  healthcare_quality: { minimal: { life: ['+', -3], infmort: ['*', 1.5], doctors: ['*', 0.6] }, low: { life: ['+', -1.2], doctors: ['*', 0.8] }, modern: { life: ['+', 1], doctors: ['*', 1.15] }, extra: { life: ['+', 2], doctors: ['*', 1.3], healthx: ['+', 2] } },
  education: { nonecomp: { literacy: ['+', -15], tertiary: ['*', 0.6] }, freewill: { literacy: ['+', -5] }, free: { tertiary: ['*', 1.2] }, strict: { literacy: ['+', 2] }, verystrict: { literacy: ['+', 3], tertiary: ['*', 0.9] } },
  welfare: { extreme: { poverty: ['*', 0.5], gini: ['+', -5], debt: ['+', 20] }, huge: { poverty: ['*', 0.65], gini: ['+', -3], debt: ['+', 10] }, little: { poverty: ['*', 1.2], gini: ['+', 2] }, none: { poverty: ['*', 1.5], gini: ['+', 6] }, independent: { poverty: ['*', 1.3], gini: ['+', 4] } },
  globalism: {
    major: { exports: ['*', 1.3], imports: ['*', 1.3], fdi: ['+', 3], tourists: ['*', 1.3] }, big: { exports: ['*', 1.15], imports: ['*', 1.15], fdi: ['+', 1.5] },
    protectionism: { imports: ['*', 0.85], fdi: ['+', -1] }, disengagement: { exports: ['*', 0.75], imports: ['*', 0.7], fdi: ['+', -2], tourists: ['*', 0.7] },
    isolationist: { exports: ['*', 0.5], imports: ['*', 0.5], fdi: ['+', -4], tourists: ['*', 0.3] },
  },
  popgrowth: {
    none: { fert: ['+', -0.4], birth: ['+', -3] }, discouraged: { fert: ['+', -0.2], birth: ['+', -1.5] },
    encouraged: { fert: ['+', 0.3], birth: ['+', 2] }, mandatory: { fert: ['+', 0.8], birth: ['+', 5] },
  },
  workhours: { minimum: { unemp: ['+', 1] }, extended: { unemp: ['+', -0.5] }, maximum: { unemp: ['+', -1], life: ['+', -1] } },
  immigration: {
    noborders: { netmig: ['*', 3], popgrowth: ['+', 0.8] }, open: { netmig: ['*', 2], popgrowth: ['+', 0.4] },
    humanitarian: { netmig: ['*', 1.8], popgrowth: ['+', 0.35] }, relaxed: { netmig: ['*', 1.4] },
    managed: { netmig: ['*', 0.7] }, points: { netmig: ['*', 0.6] }, restricted: { netmig: ['*', 0.35], popgrowth: ['+', -0.2] },
    closed: { netmig: ['=', 0], popgrowth: ['+', -0.3] }, deportation: { netmig: ['%pop', -0.006], popgrowth: ['+', -0.8] },
  },
};

// V5.8: lagarnas direkta effekter på de nya måtten. Läggs ihop med raderna
// ovan (och med laws-extra/laws-more nedan) — inget skrivs över.
const LAW_EFFECTS_58 = {
  // ----- brott, polis och domstolar -----
  policing: {
    unarmed: { assault: ['*', 1.05], weapons: ['*', 1.1], response: ['*', 1.1], clearance: ['+', -2] },
    community: { assault: ['*', 0.93], threats: ['*', 0.92], vandalism: ['*', 0.85], gangs: ['*', 0.85], hatecrime: ['*', 0.85], clearance: ['+', 3], response: ['*', 0.9] },
    tough: { theft: ['*', 0.9], gangs: ['*', 0.85], weapons: ['*', 0.85], clearance: ['+', 2], response: ['*', 0.85] },
    militarized: { gangs: ['*', 0.8], kidnapping: ['*', 0.8], weapons: ['*', 0.8], response: ['*', 0.8], hatecrime: ['*', 1.1] },
    secretpolice: { gangs: ['*', 0.7], extortion: ['*', 1.2], bribery: ['+', 4], cctv: ['*', 1.8], hatecrime: ['*', 1.2] },
  },
  firearms: {
    bearing: { weapons: ['*', 1.9], assault: ['*', 1.12], threats: ['*', 1.1] },
    free: { weapons: ['*', 1.6], assault: ['*', 1.08], threats: ['*', 1.08] },
    licensed: { weapons: ['*', 1.2] }, handgun: { weapons: ['*', 0.85] },
    ban: { weapons: ['*', 0.75], smuggling: ['*', 1.1] }, stateonly: { weapons: ['*', 0.65], smuggling: ['*', 1.15] },
  },
  drugs: {
    legal: { gangs: ['*', 0.7], smuggling: ['*', 0.6], moneylaundering: ['+', -0.6], theft: ['*', 0.9], dui: ['*', 1.1] },
    decriminalized: { gangs: ['*', 0.9], smuggling: ['*', 0.9], theft: ['*', 0.95] },
    harmreduction: { hiv: ['*', 0.85], theft: ['*', 0.95] },
    strict: { gangs: ['*', 1.05], smuggling: ['*', 1.1] },
    war: { gangs: ['*', 1.3], kidnapping: ['*', 1.4], extortion: ['*', 1.3], smuggling: ['*', 1.3], bribery: ['+', 4], moneylaundering: ['+', 1] },
    deathpenalty: { smuggling: ['*', 0.8], gangs: ['*', 1.1], bribery: ['+', 3] },
  },
  alcohol_policy: {
    free: { dui: ['*', 1.25], assault: ['*', 1.12], vandalism: ['*', 1.1] },
    licensed: { dui: ['*', 1.1], assault: ['*', 1.05] },
    monopoly: { dui: ['*', 0.85], assault: ['*', 0.93] },
    restricted: { dui: ['*', 0.7], assault: ['*', 0.88], smuggling: ['*', 1.2] },
    prohibition: { dui: ['*', 0.5], assault: ['*', 0.85], smuggling: ['*', 1.8], gangs: ['*', 1.4], bribery: ['+', 3], shadow: ['+', 2] },
  },
  surveillance: {
    none: { cctv: ['*', 0.3], idtheft: ['*', 1.1], clearance: ['+', -3] },
    warrant: { cctv: ['*', 0.6], clearance: ['+', -1] },
    oversight: { cctv: ['*', 0.85] },
    retention: { cctv: ['*', 1.2], fraud: ['*', 0.95], clearance: ['+', 1] },
    mass: { cctv: ['*', 2.5], theft: ['*', 0.9], pickpocket: ['*', 0.85], clearance: ['+', 5], response: ['*', 0.9] },
    total: { cctv: ['*', 5], theft: ['*', 0.85], pickpocket: ['*', 0.7], vandalism: ['*', 0.75], clearance: ['+', 8], response: ['*', 0.85] },
  },
  punishments: {
    minimal: { theft: ['*', 1.1], recidivism: ['+', 3] }, restorative: { recidivism: ['+', -8], vandalism: ['*', 0.9] },
    low: { recidivism: ['+', -3] }, harsh: { theft: ['*', 0.95], recidivism: ['+', 3] },
    veryharsh: { theft: ['*', 0.9], recidivism: ['+', 6] }, penallabor: { theft: ['*', 0.9], recidivism: ['+', 8] },
  },
  rehabilitation: {
    open: { recidivism: ['+', -12] }, veryhigh: { recidivism: ['+', -15] }, high: { recidivism: ['+', -8] },
    extended: { recidivism: ['+', -4] }, shortened: { recidivism: ['+', 3] }, private: { recidivism: ['+', 4] },
    unavailable: { recidivism: ['+', 10] }, nonexistent: { recidivism: ['+', 15] },
  },
  trials: {
    long: { courtwait: ['*', 1.5], clearance: ['+', 1] }, jury: { courtwait: ['*', 1.25] }, extended: { courtwait: ['*', 1.3] },
    speedup: { courtwait: ['*', 0.7] }, quick: { courtwait: ['*', 0.45] }, tribunals: { courtwait: ['*', 0.3] },
  },
  culture: { multi: { hatecrime: ['*', 0.8] }, minority: { hatecrime: ['*', 0.85] }, corecult: { hatecrime: ['*', 1.15] }, mono: { hatecrime: ['*', 1.4] } },
  civil_rights: {
    extremelyhigh: { hatecrime: ['*', 0.85], courtwait: ['*', 1.1] }, veryhigh: { hatecrime: ['*', 0.9] },
    ombudsman: { bribery: ['+', -1] }, limited: { hatecrime: ['*', 1.05] },
    verylimited: { hatecrime: ['*', 1.2], bribery: ['+', 2] }, passports: { bribery: ['+', 2] },
    norights: { hatecrime: ['*', 1.4], bribery: ['+', 4] },
  },
  government: {
    absmonarchy: { bribery: ['+', 1.5] }, authoritarian: { cctv: ['*', 1.5], bribery: ['+', 1.5] },
    junta: { bribery: ['+', 3], extortion: ['*', 1.2] }, totalitarian: { cctv: ['*', 3], bribery: ['+', 2] },
  },
  // ----- ekonomi och arbete -----
  taxes: {
    haven: { moneylaundering: ['+', 4], shadow: ['+', -2], taxevasion: ['+', -3] },
    t0: { shadow: ['+', -3], taxevasion: ['+', -4] }, t10: { shadow: ['+', -2], taxevasion: ['+', -2] },
    flat: { taxevasion: ['+', -2] }, t30: { taxevasion: ['+', 1] },
    t40: { shadow: ['+', 1.5], taxevasion: ['+', 2.5] }, t60: { shadow: ['+', 3], taxevasion: ['+', 5] },
  },
  economic_system: {
    central: { shadow: ['+', 10], bribery: ['+', 4], newbiz: ['*', 0.1], listed: ['*', 0.1] },
    planned: { shadow: ['+', 6], bribery: ['+', 2], newbiz: ['*', 0.3], listed: ['*', 0.4] },
    thirdpos: { shadow: ['+', 3], newbiz: ['*', 0.7] },
    liberal: { shadow: ['+', -1], newbiz: ['*', 1.2] }, plain: { shadow: ['+', -2], newbiz: ['*', 1.35] },
  },
  ownership: {
    nationalized: { listed: ['*', 0.4], bribery: ['+', 2] }, strategic: { listed: ['*', 0.8] },
    privatized: { listed: ['*', 1.2] }, full: { listed: ['*', 1.4] },
  },
  monetary: {
    printing: { realrate: ['+', -8], reserves: ['*', 0.6] }, qe: { realrate: ['+', -2] }, loose: { realrate: ['+', -1] },
    tight: { realrate: ['+', 1.5] }, currencyboard: { reserves: ['*', 1.5] }, gold: { realrate: ['+', 2], reserves: ['*', 1.3] },
  },
  globalism: {
    union: { tariff: ['*', 0.2], smuggling: ['*', 0.7], ports: ['*', 1.3], airfreight: ['*', 1.3] },
    major: { tariff: ['*', 0.5], ports: ['*', 1.2], airfreight: ['*', 1.2] },
    big: { tariff: ['*', 0.75], ports: ['*', 1.1], airfreight: ['*', 1.1] },
    protectionism: { tariff: ['+', 6], smuggling: ['*', 1.3] },
    disengagement: { tariff: ['+', 12], smuggling: ['*', 1.5], ports: ['*', 0.75], airfreight: ['*', 0.75] },
    isolationist: { tariff: ['+', 25], smuggling: ['*', 2], ports: ['*', 0.5], airfreight: ['*', 0.5] },
  },
  minimum_wage: {
    veryhigh: { vulnemp: ['+', -3], shadow: ['+', 2] }, high: { vulnemp: ['+', -2] },
    low: { vulnemp: ['+', 2] }, none: { vulnemp: ['+', 4] },
  },
  unions: { mandatory: { vulnemp: ['+', -4] }, strong: { vulnemp: ['+', -2] }, banned: { vulnemp: ['+', 5] } },
  military_service: { high: { neet: ['+', -2] }, mandatory: { neet: ['+', -4] }, lifelong: { neet: ['+', -6] } },
  welfare: {
    extreme: { slums: ['*', 0.5], neet: ['+', -3], recidivism: ['+', -3] }, ubi: { slums: ['*', 0.6], neet: ['+', -2] },
    huge: { slums: ['*', 0.7], neet: ['+', -2] }, little: { slums: ['*', 1.15], neet: ['+', 1.5] },
    none: { slums: ['*', 1.4], neet: ['+', 3], theft: ['*', 1.1] }, independent: { slums: ['*', 1.3] },
  },
  housing: { public: { slums: ['*', 0.6] }, rentcontrol: { slums: ['*', 0.9] }, coop: { slums: ['*', 0.85] }, deregulated: { slums: ['*', 1.2] } },
  // ----- hälsa, skola, jämställdhet -----
  healthcare: {
    fullyfree: { oop: ['*', 0.25], measles: ['+', 2], dpt: ['+', 2] }, free: { oop: ['*', 0.5], measles: ['+', 1], dpt: ['+', 1] },
    socialins: { oop: ['*', 0.7] }, savings: { oop: ['*', 1.4] },
    mostlyunfree: { oop: ['*', 1.5], measles: ['+', -3], dpt: ['+', -3] },
    unfree: { oop: ['*', 2], measles: ['+', -6], dpt: ['+', -6], matmort: ['*', 1.2] },
  },
  healthcare_quality: {
    minimal: { nurses: ['*', 0.6], measles: ['+', -15], dpt: ['+', -15], matmort: ['*', 1.6], ncd: ['+', 4] },
    low: { nurses: ['*', 0.8], measles: ['+', -5], dpt: ['+', -5], matmort: ['*', 1.2], ncd: ['+', 1.5] },
    primary: { nurses: ['*', 1.1], measles: ['+', 3], dpt: ['+', 3] }, digital: { ncd: ['+', -0.5] },
    modern: { nurses: ['*', 1.15], matmort: ['*', 0.85], ncd: ['+', -1.5] },
    extra: { nurses: ['*', 1.3], matmort: ['*', 0.7], ncd: ['+', -3] },
  },
  education: {
    nonecomp: { secondary: ['+', -20], youthlit: ['+', -12], outofschool: ['*', 2.5], bachelor: ['+', -4], pupilteacher: ['*', 1.3] },
    freewill: { secondary: ['+', -8], youthlit: ['+', -4], outofschool: ['*', 1.5] },
    free: { secondary: ['+', 3], bachelor: ['+', 3], pupilteacher: ['*', 0.9] },
    dual: { secondary: ['+', 2], bachelor: ['+', -2], neet: ['+', -3] },
    strict: { youthlit: ['+', 1], outofschool: ['*', 0.7] }, verystrict: { youthlit: ['+', 2], outofschool: ['*', 0.6] },
  },
  childcare: {
    free: { preschool: ['+', 25] }, subsidized: { preschool: ['+', 12] }, familycash: { preschool: ['+', -10] },
    private: { preschool: ['+', -8] }, none: { preschool: ['+', -25] },
  },
  equality: {
    full: { womenmin: ['+', 12] }, parental: { womenmin: ['+', 5] }, strong: { womenmin: ['+', 6] },
    homemaker: { womenmin: ['+', -4] }, traditional: { womenmin: ['+', -10] },
    restricted: { womenmin: ['=', 0], youthlit: ['+', -6], outofschool: ['*', 1.8], matmort: ['*', 1.3] },
  },
  internet: {
    free: { servers: ['*', 1.1], idtheft: ['*', 1.05] }, realname: { idtheft: ['*', 0.85] }, censored: { servers: ['*', 0.8] },
    firewall: { servers: ['*', 0.5] }, intranet: { servers: ['*', 0.1], idtheft: ['*', 0.3] },
  },
  immigration: {
    noborders: { migrants: ['+', 6] }, open: { migrants: ['+', 4] }, humanitarian: { migrants: ['+', 3] },
    freemove: { migrants: ['+', 3] }, relaxed: { migrants: ['+', 1.5] }, managed: { migrants: ['+', -0.5] },
    points: { migrants: ['+', -0.5] }, restricted: { migrants: ['+', -1.5] }, closed: { migrants: ['+', -2.5] },
    deportation: { migrants: ['+', -5] },
  },
  // ----- miljö, energi, jordbruk, transport -----
  environment: {
    rightsofnature: { envcrime: ['*', 0.6], poaching: ['+', -15], marine: ['+', 25], thrmammals: ['*', 0.7], thrbirds: ['*', 0.7], thrfish: ['*', 0.7], thrplants: ['*', 0.7], fishcatch: ['*', 0.6], fertilizer: ['*', 0.7], agland: ['+', -4], coal: ['*', 0.6] },
    strict: { envcrime: ['*', 0.75], poaching: ['+', -10], marine: ['+', 12], thrmammals: ['*', 0.8], thrbirds: ['*', 0.8], thrfish: ['*', 0.8], thrplants: ['*', 0.8], fishcatch: ['*', 0.8], fertilizer: ['*', 0.8], agland: ['+', -2], coal: ['*', 0.7] },
    strong: { envcrime: ['*', 0.9], poaching: ['+', -5], marine: ['+', 5], thrmammals: ['*', 0.9], thrbirds: ['*', 0.9], thrfish: ['*', 0.9], thrplants: ['*', 0.9] },
    trading: { coal: ['*', 0.85] },
    weak: { envcrime: ['*', 1.2], poaching: ['+', 5], marine: ['+', -3], thrmammals: ['*', 1.1], thrbirds: ['*', 1.1], thrfish: ['*', 1.1], thrplants: ['*', 1.1], fishcatch: ['*', 1.1] },
    none: { envcrime: ['*', 1.6], poaching: ['+', 12], marine: ['+', -8], thrmammals: ['*', 1.25], thrbirds: ['*', 1.25], thrfish: ['*', 1.25], thrplants: ['*', 1.25], fishcatch: ['*', 1.25] },
  },
  energy: {
    renewable: { renewelec: ['+', 40], coal: ['*', 0.3], nuclear: ['+', -10], methane: ['*', 0.85], oilrent: ['*', 0.8], energyimp: ['+', -15] },
    green: { renewelec: ['+', 20], coal: ['*', 0.6], methane: ['*', 0.92] },
    gasbridge: { coal: ['*', 0.5], renewelec: ['+', -3] },
    nuclear: { nuclear: ['+', 30], coal: ['*', 0.6], renewelec: ['+', -8] },
    fossil: { renewelec: ['+', -15], coal: ['+', 10], oilrent: ['*', 1.15], methane: ['*', 1.1] },
    dominance: { renewelec: ['+', -25], coal: ['+', 15], oilrent: ['*', 1.3], methane: ['*', 1.25], energyimp: ['+', -25] },
  },
  agriculture: {
    collective: { cerealyield: ['*', 0.8], agland: ['+', 2] }, subsidized: { cerealyield: ['*', 1.05] },
    organic: { cerealyield: ['*', 0.8], fertilizer: ['*', 0.3], methane: ['*', 0.95] }, freemarket: { cerealyield: ['*', 1.05] },
    agribusiness: { cerealyield: ['*', 1.2], fertilizer: ['*', 1.4], agland: ['+', 3], methane: ['*', 1.1], waterstress: ['*', 1.15] },
  },
  transport: {
    freetransit: { rail: ['*', 1.15], dui: ['*', 0.8] }, transitfirst: { rail: ['*', 1.1], dui: ['*', 0.9] },
    roads: { rail: ['*', 0.97], cartheft: ['*', 1.05] }, carnation: { rail: ['*', 0.9], dui: ['*', 1.2], cartheft: ['*', 1.1] },
    private: { rail: ['*', 0.95] },
  },
};

// lägg ihop en lags effekter med de som redan finns (nyare rad vinner per mått)
function addLawFx(cat, opt, fx) {
  const L = (LAW_EFFECTS[cat] ||= {});
  L[opt] = { ...(L[opt] || {}), ...fx };
}
for (const [cat, opts] of Object.entries(LAW_EFFECTS_58)) {
  for (const [opt, fx] of Object.entries(opts)) addLawFx(cat, opt, fx);
}

// V5.10: lagarna och demografin. Andelen barn (kids) och pensionärer (old) styr
// befolkningspyramiden — och med den medianåldern, försörjningskvoterna och
// hushållens storlek — så familjepolitik, vård och invandring syns i diagrammet.
const LAW_EFFECTS_510 = {
  popgrowth: {
    none: { kids: ['+', -2.5], adofert: ['*', 0.8], contracept: ['+', 8], sexratio: ['+', 0.05] },
    discouraged: { kids: ['+', -1.2], adofert: ['*', 0.9], contracept: ['+', 4], sexratio: ['+', 0.015] },
    planning: { kids: ['+', -0.8], adofert: ['*', 0.75], contracept: ['+', 12] },
    encouraged: { kids: ['+', 1.2], adofert: ['*', 1.05], contracept: ['+', -3] },
    childtax: { kids: ['+', 1.5], adofert: ['*', 1.1], contracept: ['+', -6] },
    mandatory: { kids: ['+', 3.5], adofert: ['*', 1.35], contracept: ['+', -20] },
  },
  childcare: {
    free: { kids: ['+', 0.6] }, subsidized: { kids: ['+', 0.3] }, familycash: { kids: ['+', 0.4], hhsize: ['*', 1.02] },
    private: { kids: ['+', -0.4] }, none: { kids: ['+', -0.6], hhsize: ['*', 1.03] },
  },
  parental_leave: {
    generous: { kids: ['+', 0.8] }, long: { kids: ['+', 0.5] }, paid: { kids: ['+', 0.2] },
    unpaid: { kids: ['+', -0.2] }, none: { kids: ['+', -0.5] },
  },
  equality: {
    full: { adofert: ['*', 0.85], contracept: ['+', 5] }, parental: { adofert: ['*', 0.9], contracept: ['+', 3], kids: ['+', 0.3] },
    strong: { adofert: ['*', 0.92], contracept: ['+', 3] }, homemaker: { kids: ['+', 0.5], hhsize: ['*', 1.02] },
    traditional: { kids: ['+', 1.5], adofert: ['*', 1.25], contracept: ['+', -8], sexratio: ['+', 0.02], hhsize: ['*', 1.05] },
    restricted: { kids: ['+', 3.5], adofert: ['*', 1.7], contracept: ['+', -20], sexratio: ['+', 0.04], hhsize: ['*', 1.1] },
  },
  religion: {
    atheism: { contracept: ['+', 2] },
    statereligion: { kids: ['+', 0.5], adofert: ['*', 1.08], contracept: ['+', -4], hhsize: ['*', 1.02] },
    religiouslaw: { kids: ['+', 1.5], adofert: ['*', 1.2], contracept: ['+', -10], hhsize: ['*', 1.05] },
  },
  education: {
    nonecomp: { adofert: ['*', 1.4], contracept: ['+', -5] }, freewill: { adofert: ['*', 1.15] },
    free: { adofert: ['*', 0.9] }, strict: { adofert: ['*', 0.92] }, verystrict: { adofert: ['*', 0.9] },
  },
  healthcare: {
    fullyfree: { old: ['+', 0.6], adultmortm: ['*', 0.93], adultmortf: ['*', 0.93], contracept: ['+', 4] },
    free: { old: ['+', 0.3], adultmortm: ['*', 0.96], adultmortf: ['*', 0.96], contracept: ['+', 2] },
    socialins: { adultmortm: ['*', 0.98], adultmortf: ['*', 0.98] },
    savings: { adultmortm: ['*', 1.02], adultmortf: ['*', 1.02] },
    mostlyunfree: { old: ['+', -0.4], adultmortm: ['*', 1.06], adultmortf: ['*', 1.06], contracept: ['+', -3] },
    unfree: { old: ['+', -0.8], adultmortm: ['*', 1.12], adultmortf: ['*', 1.12], contracept: ['+', -5] },
  },
  healthcare_quality: {
    minimal: { old: ['+', -1.5], adultmortm: ['*', 1.3], adultmortf: ['*', 1.3] },
    low: { old: ['+', -0.6], adultmortm: ['*', 1.1], adultmortf: ['*', 1.1] },
    digital: { adultmortm: ['*', 0.98], adultmortf: ['*', 0.98] },
    modern: { old: ['+', 0.5], adultmortm: ['*', 0.93], adultmortf: ['*', 0.93] },
    extra: { old: ['+', 1], adultmortm: ['*', 0.88], adultmortf: ['*', 0.88] },
  },
  // invandrare är oftast unga vuxna — färre pensionärer i andel
  immigration: {
    noborders: { old: ['+', -1.2] }, open: { old: ['+', -0.8] }, humanitarian: { old: ['+', -0.6], kids: ['+', 0.3] },
    freemove: { old: ['+', -0.5] }, relaxed: { old: ['+', -0.3] },
    restricted: { old: ['+', 0.3] }, closed: { old: ['+', 0.5] }, deportation: { old: ['+', 1], kids: ['+', -0.3] },
  },
  // med egen pension bor de äldre oftare själva — utan bor de hos sina barn
  pensions: {
    early: { hhsize: ['*', 0.97] }, generous: { hhsize: ['*', 0.97] }, private: { hhsize: ['*', 1.02] }, none: { hhsize: ['*', 1.06] },
  },
  housing: {
    public: { hhsize: ['*', 0.95] }, rentcontrol: { hhsize: ['*', 0.98] }, coop: { hhsize: ['*', 0.98] },
    market: { hhsize: ['*', 1.02] }, deregulated: { hhsize: ['*', 1.05] },
  },
  alcohol_policy: {
    free: { adultmortm: ['*', 1.05], adultmortf: ['*', 1.02] }, monopoly: { adultmortm: ['*', 0.97] },
    restricted: { adultmortm: ['*', 0.96] }, prohibition: { adultmortm: ['*', 0.95] },
  },
  tobacco: {
    free: { adultmortm: ['*', 1.05], adultmortf: ['*', 1.03] }, tough: { adultmortm: ['*', 0.98], adultmortf: ['*', 0.98] },
    smokefree: { adultmortm: ['*', 0.96], adultmortf: ['*', 0.97] }, banned: { adultmortm: ['*', 0.93], adultmortf: ['*', 0.95] },
  },
  firearms: { bearing: { adultmortm: ['*', 1.04] }, free: { adultmortm: ['*', 1.03] } },
  workhours: { maximum: { adultmortm: ['*', 1.05], adultmortf: ['*', 1.04] } },
};
for (const [cat, opts] of Object.entries(LAW_EFFECTS_510)) {
  if (!LAWS[cat]) continue;   // lagar som inte finns (än) hoppas över
  for (const [opt, fx] of Object.entries(opts)) addLawFx(cat, opt, fx);
}

// V5.8: helt nya lagar (laws-more.js) har sina effekter med sig
for (const [cat, L] of Object.entries(NEW_LAWS)) {
  for (const [opt, fx] of Object.entries(L.effects || {})) addLawFx(cat, opt, fx);
}

// V5.7: nya lagalternativ (laws-extra.js) kan ha egna direkta effekter
for (const [cat, list] of Object.entries(LAW_EXTRAS)) {
  for (const e of list) if (e.effects) addLawFx(cat, e.option.id, e.effects);
}

// V5.11: LAGARNAS MAKT — varje alternativ i varje lag har en egen, stark
// uppsättning (laws-511.js). Läggs sist så att de ersätter äldre värden per mått.
for (const [cat, opts] of Object.entries(FX_511)) {
  if (!LAWS[cat]) continue;
  for (const [opt, fx] of Object.entries(opts)) addLawFx(cat, opt, fx);
}

// V5.12: religionslagen flyttar andelen utan religion (de troende fördelas
// sedan som förut — se faithStep)
const FAITH_LAW_FX = {
  banned: { r_sekular: ['+', 40] }, atheism: { r_sekular: ['+', 22] }, pluralism: { r_sekular: ['+', -4] },
  established: { r_sekular: ['+', -6] }, statereligion: { r_sekular: ['+', -14] },
  religiouslaw: { r_sekular: ['+', -25] }, clergyrule: { r_sekular: ['+', -35] },
};
for (const [opt, fx] of Object.entries(FAITH_LAW_FX)) addLawFx('religion', opt, fx);

// V5.14: lagarnas effekter på de nya måtten och brotten (läggs sist, nyare vinner per mått)
const LAW_EFFECTS_514 = {
  policing: {
    abolished: { youthcrime: ['*', 1.6], biketheft: ['*', 1.8], graffiti: ['*', 2], trespass: ['*', 1.8], speeding: ['*', 0.2], policetrust: ['+', -20] },
    unarmed: { youthcrime: ['*', 1.1], harass: ['*', 1.05], policetrust: ['+', 8], speeding: ['*', 0.8] },
    community: { youthcrime: ['*', 0.8], graffiti: ['*', 0.8], harass: ['*', 0.85], policetrust: ['+', 15], detention: ['+', -4] },
    oversight: { policetrust: ['+', 18], detention: ['+', -6], harass: ['*', 0.9] },
    tough: { youthcrime: ['*', 0.85], graffiti: ['*', 0.75], biketheft: ['*', 0.85], policetrust: ['+', -5], detention: ['+', 6], speeding: ['*', 1.3] },
    militarized: { youthcrime: ['*', 0.85], policetrust: ['+', -15], detention: ['+', 12], speeding: ['*', 1.2] },
    predictive: { youthcrime: ['*', 0.8], biketheft: ['*', 0.85], detention: ['+', 8], policetrust: ['+', -8] },
    secretpolice: { policetrust: ['+', -35], detention: ['+', 30], lawyers: ['*', 0.6], harass: ['*', 1.2] },
  },
  surveillance: {
    none: { speeding: ['*', 0.6], graffiti: ['*', 1.15], biketheft: ['*', 1.1] },
    encryption: { speeding: ['*', 0.8] },
    facial: { graffiti: ['*', 0.75], biketheft: ['*', 0.8], policetrust: ['+', -4] },
    mass: { speeding: ['*', 1.8], graffiti: ['*', 0.7], biketheft: ['*', 0.8], policetrust: ['+', -8] },
    total: { speeding: ['*', 2.5], graffiti: ['*', 0.5], biketheft: ['*', 0.6], harass: ['*', 0.8], policetrust: ['+', -15] },
    informant: { harass: ['*', 0.85], policetrust: ['+', -25], detention: ['+', 15] },
  },
  punishments: {
    abolition: { detention: ['+', -10], youthcrime: ['*', 1.25], judges: ['*', 0.7] },
    minimal: { youthcrime: ['*', 1.1], detention: ['+', -5] },
    restorative: { youthcrime: ['*', 0.85], graffiti: ['*', 0.85] },
    harsh: { detention: ['+', 8], youthcrime: ['*', 0.95] },
    threestrikes: { detention: ['+', 10], lawyers: ['*', 1.1] },
    veryharsh: { detention: ['+', 15], youthcrime: ['*', 0.9], policetrust: ['+', -5] },
    penallabor: { detention: ['+', 18], policetrust: ['+', -8] },
  },
  trials: {
    long: { detention: ['+', 10], lawyers: ['*', 1.2], judges: ['*', 1.2] }, legalaid: { lawyers: ['*', 1.4], detention: ['+', -8] },
    jury: { lawyers: ['*', 1.15] }, plea: { detention: ['+', -4], lawyers: ['*', 0.9] },
    quick: { detention: ['+', -6], judges: ['*', 0.8], lawyers: ['*', 0.8] },
    tribunals: { detention: ['+', 20], lawyers: ['*', 0.5], judges: ['*', 0.6], policetrust: ['+', -8] },
    notrial: { detention: ['+', 45], lawyers: ['*', 0.4], policetrust: ['+', -20] },
  },
  civil_rights: {
    extremelyhigh: { detention: ['+', -8], lawyers: ['*', 1.2], policetrust: ['+', 8] }, antidiscrim: { harass: ['*', 0.8], femmanagers: ['+', 4] },
    emergency: { detention: ['+', 20], policetrust: ['+', -8] }, socialcredit: { detention: ['+', 15], harass: ['*', 0.8], speeding: ['*', 1.5] },
    norights: { detention: ['+', 30], lawyers: ['*', 0.4], policetrust: ['+', -20] },
  },
  government: {
    directdemo: { policetrust: ['+', 5] }, authoritarian: { detention: ['+', 12], lawyers: ['*', 0.8] },
    junta: { detention: ['+', 20], policetrust: ['+', -12] }, totalitarian: { detention: ['+', 25], policetrust: ['+', -10], lawyers: ['*', 0.5] },
  },
  drugs: { legal: { youthcrime: ['*', 0.85] }, freemarket: { youthcrime: ['*', 0.9] }, war: { youthcrime: ['*', 1.2], detention: ['+', 12], policetrust: ['+', -10] } },
  alcohol_policy: { dutyfree: { harass: ['*', 1.2], hitrun: ['*', 1.25] }, free: { harass: ['*', 1.15], hitrun: ['*', 1.15] }, prohibition: { harass: ['*', 0.85], hitrun: ['*', 0.8] } },
  internet: { charter: { piracy: ['+', 4] }, free: { piracy: ['+', 5], counterfeit: ['*', 1.1] }, censored: { piracy: ['+', 8] }, firewall: { piracy: ['+', 12] } },
  intellectual_property: {
    abolished: { piracy: ['+', 40], counterfeit: ['*', 3], patentsfor: ['*', 0.1] }, prizes: { piracy: ['+', 20], counterfeit: ['*', 1.8], patentsfor: ['*', 0.4] },
    short: { piracy: ['+', 8], counterfeit: ['*', 1.3], patentsfor: ['*', 0.8] }, compulsory: { piracy: ['+', 4], patentsfor: ['*', 0.7] },
    extended: { piracy: ['+', -6], counterfeit: ['*', 0.8], patentsfor: ['*', 1.2] }, enforcement: { piracy: ['+', -15], counterfeit: ['*', 0.6], patentsfor: ['*', 1.3] },
    perpetual: { piracy: ['+', -20], counterfeit: ['*', 0.5], patentsfor: ['*', 1.4] },
  },
  environment: {
    rightsofnature: { illegallog: ['+', -18] }, strict: { illegallog: ['+', -12] }, thirty: { illegallog: ['+', -10] }, strong: { illegallog: ['+', -6] },
    voluntary: { illegallog: ['+', 5] }, weak: { illegallog: ['+', 10] }, none: { illegallog: ['+', 20] }, frontier: { illegallog: ['+', 28] },
  },
  animal_welfare: {
    phaseout: { animalcruelty: ['*', 0.3] }, animalrights: { animalcruelty: ['*', 0.4] }, strong: { animalcruelty: ['*', 0.6] }, improved: { animalcruelty: ['*', 0.8] },
    selfreg: { animalcruelty: ['*', 1.1] }, weak: { animalcruelty: ['*', 1.3] }, none: { animalcruelty: ['*', 1.8] }, wildtrade: { animalcruelty: ['*', 2.2] },
  },
  education: {
    nonecomp: { youthcrime: ['*', 1.4], lowsec: ['+', -30], litfem: ['+', -15], childlabor: ['+', 8], trainedteach: ['+', -15] },
    freewill: { lowsec: ['+', -12], childlabor: ['+', 3], youthcrime: ['*', 1.15] }, free: { lowsec: ['+', 5], trainedteach: ['+', 4] },
    strict: { lowsec: ['+', 4], youthcrime: ['*', 0.92] }, verystrict: { lowsec: ['+', 6], youthcrime: ['*', 0.88] },
  },
  equality: {
    quotas: { femmanagers: ['+', 18], unempfem: ['+', -1], girlsschool: ['+', 0.05] },
    full: { femmanagers: ['+', 15], litfem: ['+', 3], girlsschool: ['+', 0.05], unempfem: ['+', -1] },
    strong: { femmanagers: ['+', 8] }, equalpay: { femmanagers: ['+', 6], unempfem: ['+', -0.5] },
    homemaker: { femmanagers: ['+', -6], parttime: ['+', 6] },
    traditional: { femmanagers: ['+', -15], unempfem: ['+', 2], girlsschool: ['+', -0.1], litfem: ['+', -8] },
    segregation: { femmanagers: ['+', -20], girlsschool: ['+', -0.15], litfem: ['+', -15] },
    restricted: { femmanagers: ['+', -40], litfem: ['+', -30], girlsschool: ['+', -0.4] },
  },
  childcare: { compulsory: { unempfem: ['+', -2], parttime: ['+', -6] }, free: { unempfem: ['+', -1.5], parttime: ['+', -5] }, none: { parttime: ['+', 5], unempfem: ['+', 1.5] } },
  minimum_wage: { statewages: { wagework: ['+', 8] }, veryhigh: { wagework: ['+', 5], childlabor: ['+', -2] }, none: { childlabor: ['+', 4], wagework: ['+', -8] } },
  unions: { selfmanaged: { wagework: ['+', 4] }, mandatory: { wagework: ['+', 4], parttime: ['+', -4] }, banned: { childlabor: ['+', 3], wagework: ['+', -3] } },
  workhours: { fourday: { parttime: ['+', 10] }, week35: { parttime: ['+', 5] }, sixday: { parttime: ['+', -8], injurydeath: ['+', 1] }, maximum: { parttime: ['+', -15], injurydeath: ['+', 2] } },
  welfare: { extreme: { youthcrime: ['*', 0.75], childlabor: ['+', -5], commdeath: ['+', -4] }, huge: { youthcrime: ['*', 0.85] }, none: { youthcrime: ['*', 1.3], childlabor: ['+', 6] }, independent: { youthcrime: ['*', 1.2] } },
  healthcare: {
    statemed: { healthpc: ['*', 1.2], neonatal: ['*', 0.75], birthcare: ['+', 8] },
    fullyfree: { healthpc: ['*', 1.4], neonatal: ['*', 0.7], birthcare: ['+', 8], hepb: ['+', 4] },
    free: { healthpc: ['*', 1.2], neonatal: ['*', 0.85], birthcare: ['+', 4] }, mostlyunfree: { neonatal: ['*', 1.2], birthcare: ['+', -6] },
    unfree: { healthpc: ['*', 0.8], neonatal: ['*', 1.5], birthcare: ['+', -15], hepb: ['+', -10], commdeath: ['+', 6] },
  },
  healthcare_quality: {
    minimal: { neonatal: ['*', 1.8], birthcare: ['+', -20], commdeath: ['+', 10] }, low: { neonatal: ['*', 1.3] },
    modern: { neonatal: ['*', 0.8], healthpc: ['*', 1.2] }, extra: { neonatal: ['*', 0.6], healthpc: ['*', 1.5] },
  },
  vaccination: { discouraged: { hepb: ['+', -55], commdeath: ['+', 10] }, noprogram: { hepb: ['+', -45], commdeath: ['+', 8] }, mandatory: { hepb: ['+', 6] }, passport: { hepb: ['+', 8] } },
  energy: { rationing: { ghg: ['*', 0.4] }, renewable: { ghg: ['*', 0.5], elecloss: ['+', -2] }, green: { ghg: ['*', 0.75] }, fossil: { ghg: ['*', 1.3] }, dominance: { ghg: ['*', 1.5], fuelexp: ['+', 15] } },
  agriculture: { organic: { n2o: ['*', 0.6] }, agribusiness: { n2o: ['*', 1.4] }, biotech: { n2o: ['*', 1.2] } },
  globalism: {
    tradehub: { manufexp: ['+', 8], tourspend: ['*', 1.6], foodimp: ['+', 4] }, union: { manufexp: ['+', 6], tourspend: ['*', 1.4], foodimp: ['+', 3] },
    isolationist: { tourspend: ['*', 0.2], foodimp: ['+', -8], manufexp: ['+', -15] }, autarky: { tourspend: ['*', 0.05], foodimp: ['+', -10], manufexp: ['+', -20] },
  },
  monetary: { printing: { broadmoney: ['+', 60], credit: ['+', -30] }, gold: { broadmoney: ['+', -20] }, freebanking: { credit: ['+', 20] } },
  banking: {
    monobank: { atms: ['*', 0.5], bankbranch: ['*', 1.4], credit: ['+', -40] }, nationalized: { credit: ['+', -25], bankbranch: ['*', 1.2] },
    strict: { credit: ['+', -10] }, light: { credit: ['+', 15], atms: ['*', 1.1] }, offshore: { credit: ['+', 25], insider: ['*', 1.5] },
    none: { credit: ['+', 40], insider: ['*', 2], embezzle: ['*', 1.5] },
  },
  economic_system: { central: { credit: ['+', -50], atms: ['*', 0.4], wagework: ['+', 10] }, planned: { credit: ['+', -30], wagework: ['+', 6] }, plain: { credit: ['+', 30] }, ancap: { credit: ['+', 40], insider: ['*', 2] } },
  transport: {
    carfree: { biketheft: ['*', 1.6], hitrun: ['*', 0.5], speeding: ['*', 0.3] }, freetransit: { biketheft: ['*', 1.3], hitrun: ['*', 0.8] },
    carnation: { hitrun: ['*', 1.2], biketheft: ['*', 0.8], speeding: ['*', 1.3] },
  },
  military_service: { mandatory: { youthcrime: ['*', 0.85] }, nationalservice: { youthcrime: ['*', 0.85] }, lifelong: { youthcrime: ['*', 0.75] } },
  emigration: { banned: { tourspend: ['*', 0.05] }, approved: { tourspend: ['*', 0.2] }, exitvisa: { tourspend: ['*', 0.4] } },
  visa_policy: { visafree: { counterfeit: ['*', 1.1] }, closed: { counterfeit: ['*', 0.6] } },
  cash: {
    anonymous: { atms: ['*', 1.6], bankbranch: ['*', 1.4] }, cashlaw: { atms: ['*', 1.3] }, cardfirst: { atms: ['*', 0.6] },
    cbdc: { atms: ['*', 0.4] }, tracked: { atms: ['*', 0.2], bankbranch: ['*', 0.5] },
  },
  // ----- de nya lagarna i V5.14 -----
  juvenile_justice: {
    socialonly: { youthcrime: ['*', 1.35], detention: ['+', -6] }, age16: { youthcrime: ['*', 1.15] }, conferences: { youthcrime: ['*', 0.8], graffiti: ['*', 0.85] },
    records: { youthcrime: ['*', 0.95] }, parental: { youthcrime: ['*', 0.9], graffiti: ['*', 0.9] }, age12: { youthcrime: ['*', 0.85], detention: ['+', 4] },
    bootcamp: { youthcrime: ['*', 0.8], detention: ['+', 6], policetrust: ['+', -4] }, adults: { youthcrime: ['*', 0.75], detention: ['+', 10], policetrust: ['+', -8] },
  },
  anti_corruption: {
    agency: { embezzle: ['*', 0.4], forgery: ['*', 0.6], insider: ['*', 0.5], policetrust: ['+', 12] }, opengov: { embezzle: ['*', 0.55], insider: ['*', 0.7], policetrust: ['+', 8] },
    whistle: { embezzle: ['*', 0.65], insider: ['*', 0.75] }, assetdecl: { embezzle: ['*', 0.8] }, gifts: { embezzle: ['*', 1.2] },
    immunity: { embezzle: ['*', 1.5], policetrust: ['+', -8] }, purges: { embezzle: ['*', 1.1], detention: ['+', 10], policetrust: ['+', -10] },
    patronage: { embezzle: ['*', 2], forgery: ['*', 1.5], insider: ['*', 1.8], policetrust: ['+', -15] },
  },
  border_control: {
    none: { counterfeit: ['*', 1.6], forgery: ['*', 1.3] }, openunion: { counterfeit: ['*', 1.25] }, biometric: { forgery: ['*', 0.7] },
    scanning: { counterfeit: ['*', 0.8], forgery: ['*', 0.75] }, fences: { counterfeit: ['*', 0.75], tourspend: ['*', 0.9] },
    wall: { counterfeit: ['*', 0.6], tourspend: ['*', 0.8] }, militarized: { counterfeit: ['*', 0.5], tourspend: ['*', 0.6], detention: ['+', 6] },
  },
  lobbying: {
    publiconly: { embezzle: ['*', 0.7], insider: ['*', 0.7] }, register: { insider: ['*', 0.9] }, revolving: { insider: ['*', 1.3] },
    anonymous: { embezzle: ['*', 1.3], insider: ['*', 1.4] }, superpac: { insider: ['*', 1.5] }, unlimited: { embezzle: ['*', 1.6], insider: ['*', 1.8] },
  },
  consumer_protection: {
    pricecontrol: { counterfeit: ['*', 0.6] }, adban: { counterfeit: ['*', 0.75] }, warranty: { counterfeit: ['*', 0.8] }, ombudsman: { counterfeit: ['*', 0.85] },
    aggressive: { counterfeit: ['*', 1.3] }, arbitration: { counterfeit: ['*', 1.4] }, caveat: { counterfeit: ['*', 2] },
  },
  forestry: {
    oldgrowth: { illegallog: ['+', -15] }, stateforest: { illegallog: ['+', -10] }, certified: { illegallog: ['+', -8] },
    production: { illegallog: ['+', 4] }, concessions: { illegallog: ['+', 12] }, landclearing: { illegallog: ['+', 20] }, clearcut: { illegallog: ['+', 25] },
  },
  hunting: {
    banned: { animalcruelty: ['*', 0.7] }, sanctuaries: { animalcruelty: ['*', 0.8] }, openseason: { animalcruelty: ['*', 1.3] }, trophy: { animalcruelty: ['*', 1.6] },
  },
  science_funding: { megaprojects: { patentsfor: ['*', 1.3] }, cuts: { patentsfor: ['*', 0.8] }, none: { patentsfor: ['*', 0.6] } },
  road_safety: {
    nolimits: { speeding: ['*', 0.1], hitrun: ['*', 1.4] }, autobahn: { speeding: ['*', 0.4], hitrun: ['*', 1.2] }, lightenf: { speeding: ['*', 0.6], hitrun: ['*', 1.1] },
    vision: { speeding: ['*', 1.3], hitrun: ['*', 0.85] }, cameras: { speeding: ['*', 2], hitrun: ['*', 0.75] },
    strict: { speeding: ['*', 2.5], hitrun: ['*', 0.7] }, zerotol: { speeding: ['*', 3.5], hitrun: ['*', 0.6] },
  },
  urban_planning: { newtowns: { graffiti: ['*', 0.9] }, developer: { graffiti: ['*', 1.1] }, nozoning: { graffiti: ['*', 1.25], trespass: ['*', 1.2] } },
};
for (const [cat, opts] of Object.entries(LAW_EFFECTS_514)) {
  if (!LAWS[cat]) continue;
  for (const [opt, fx] of Object.entries(opts)) addLawFx(cat, opt, fx);
}

// V5.16 VERKLIGHETEN: lagarnas effekter på de nya måtten. ['~', nivå, styrka] drar
// måttet mot en nivå oavsett var landet började — helt fria val ger ett högt valindex
// även i ett land som aldrig haft det, och ett enpartisystem river det.
const pull = (n, k = 0.6) => ['~', n, k];
const LAW_EFFECTS_516 = {
  elections: {
    entirelyfree: { demo_el: pull(9.8, 0.7), demo_part: ['+', 0.6], turnout: ['+', 4] },
    publicfund: { demo_el: pull(9.6), demo_part: ['+', 0.5] }, free: { demo_el: pull(9.2), demo_part: ['+', 0.3] },
    compulsory: { demo_el: pull(9, 0.5), demo_part: ['+', 0.4], turnout: pull(91, 0.8) }, mostlyfree: { demo_el: pull(7.5, 0.5) },
    hybrid: { demo_el: pull(4.5), demo_part: ['+', -0.8], turnout: ['+', -8] },
    restricted: { demo_el: pull(3, 0.7), demo_part: ['+', -1.5], turnout: ['+', -12] },
    unfair: { demo_el: pull(1.8, 0.75), demo_gov: ['+', -1], turnout: ['+', -15] },
    oneparty: { demo_el: pull(0.3, 0.9), demo_part: pull(2), turnout: ['=', 98] },
    plebiscite: { demo_el: pull(0.9, 0.85), turnout: ['=', 95] },
    no: { demo_el: ['=', 0], demo_part: pull(1.2, 0.7), turnout: ['=', 0] },
  },
  government: {
    commune: { demo_part: pull(8.5, 0.5), demo_gov: ['+', -1.5] }, directdemo: { demo_part: pull(9.6), demo_el: ['+', 0.3], turnout: ['+', 6] },
    strongdemo: { demo_el: ['+', 0.4], demo_gov: ['+', 0.5], demo_cult: ['+', 0.3] }, democracy: { demo_el: ['+', 0.3], demo_gov: ['+', 0.3] },
    constmonarchy: { demo_cult: ['+', 0.2] },
    technocratic: { demo_gov: pull(5.5, 0.4), demo_part: ['+', -1.5], demo_el: ['+', -1] },
    hybrid: { demo_el: pull(4.5, 0.5), demo_gov: pull(4, 0.5), demo_civ: ['+', -1] },
    absmonarchy: { demo_el: pull(0.5, 0.8), demo_gov: pull(2.5), demo_part: pull(2), demo_civ: pull(2.5, 0.5) },
    authoritarian: { demo_el: pull(0.8, 0.8), demo_gov: pull(2.2), demo_part: pull(2.5, 0.5), demo_civ: pull(2) },
    partystate: { demo_el: pull(0.2, 0.85), demo_gov: pull(3, 0.5), demo_part: pull(2.8, 0.5), demo_civ: pull(1.5) },
    junta: { demo_el: ['=', 0], demo_gov: pull(0.5, 0.8), demo_part: pull(1.2, 0.7), demo_civ: pull(1, 0.7), demo_cult: ['+', -1] },
    totalitarian: { demo_el: ['=', 0], demo_gov: pull(0.5, 0.8), demo_part: pull(0.8, 0.8), demo_civ: pull(0.2, 0.9), demo_cult: pull(2) },
  },
  press: {
    transparency: { demo_civ: ['+', 0.6], demo_gov: ['+', 0.5] }, full: { demo_civ: ['+', 0.5] }, free: { demo_civ: ['+', 0.3] },
    publicservice: { demo_civ: ['+', 0.3], demo_part: ['+', 0.2] }, libel: { demo_civ: ['+', -0.4] },
    oligarch: { demo_civ: ['+', -0.7], demo_gov: ['+', -0.4] }, licensed: { demo_civ: ['+', -1] },
    state: { demo_civ: ['+', -1.5], demo_el: ['+', -0.8] }, censorboard: { demo_civ: pull(3, 0.5), demo_el: ['+', -1] },
    highstate: { demo_civ: pull(2), demo_el: ['+', -1.5] }, propaganda: { demo_civ: pull(1, 0.7), demo_el: ['+', -2], demo_cult: ['+', -1] },
  },
  speech: {
    absolute: { demo_civ: ['+', 0.5] }, broad: { demo_civ: ['+', 0.4] }, whistleblower: { demo_civ: ['+', 0.3], demo_gov: ['+', 0.3] },
    hatelaws: { demo_civ: ['+', -0.2] }, fakenews: { demo_civ: ['+', -0.8] }, lesemajeste: { demo_civ: ['+', -1.2] },
    foreignagent: { demo_civ: ['+', -1.5], demo_part: ['+', -0.6] }, criminalized: { demo_civ: pull(1.5), demo_part: ['+', -1] },
  },
  protest: {
    disobedience: { demo_part: ['+', 0.6], demo_civ: ['+', 0.2], protests: ['*', 1.5] }, free: { demo_part: ['+', 0.5], demo_civ: ['+', 0.3], protests: ['*', 1.3] },
    notice: { demo_part: ['+', 0.2], protests: ['*', 1.1] }, zones: { demo_civ: ['+', -0.4], protests: ['*', 0.8] },
    liability: { demo_civ: ['+', -0.6], demo_part: ['+', -0.3], protests: ['*', 0.7] },
    restricted: { demo_civ: ['+', -1.2], demo_part: ['+', -0.8], protests: ['*', 0.4] },
    banned: { demo_civ: ['+', -2], demo_part: pull(2, 0.5), protests: ['*', 0.1] },
    staterallies: { demo_civ: ['+', -2.2], demo_part: pull(1.5), demo_cult: ['+', -0.8], protests: ['*', 0.15] },
  },
  civil_rights: {
    extremelyhigh: { demo_civ: pull(9.8) }, veryhigh: { demo_civ: pull(9.4, 0.5) }, ombudsman: { demo_civ: ['+', 0.5], demo_gov: ['+', 0.3] },
    high: { demo_civ: ['+', 0.4] }, antidiscrim: { demo_civ: ['+', 0.3] }, limited: { demo_civ: ['+', -1] },
    emergency: { demo_civ: ['+', -1.8], demo_el: ['+', -0.8] }, verylimited: { demo_civ: pull(2.5) }, passports: { demo_civ: pull(2) },
    socialcredit: { demo_civ: pull(1.2, 0.7), demo_part: ['+', -1] }, norights: { demo_civ: ['=', 0] },
  },
  surveillance: {
    none: { demo_civ: ['+', 0.3] }, encryption: { demo_civ: ['+', 0.3] }, warrant: { demo_civ: ['+', 0.2] },
    retention: { demo_civ: ['+', -0.3] }, facial: { demo_civ: ['+', -0.6] }, mass: { demo_civ: ['+', -1.2] },
    total: { demo_civ: ['+', -2], demo_cult: ['+', -0.5] }, informant: { demo_civ: ['+', -2.5], demo_cult: ['+', -1] },
  },
  internet: {
    charter: { demo_civ: ['+', 0.3], demo_part: ['+', 0.2] }, free: { demo_civ: ['+', 0.2] }, open: { demo_civ: ['+', 0.1] },
    ageverify: { demo_civ: ['+', -0.1] }, realname: { demo_civ: ['+', -0.6] }, censored: { demo_civ: ['+', -1.2], demo_part: ['+', -0.3] },
    shutdowns: { demo_civ: ['+', -1.8], demo_part: ['+', -0.5] }, firewall: { demo_civ: ['+', -2], demo_part: ['+', -0.5] },
    intranet: { demo_civ: ['+', -2.5], demo_part: ['+', -0.8] },
  },
  party_loyalty: {
    neutral: { demo_gov: ['+', 0.4] }, none: { demo_gov: ['+', 0.3] }, minimum: { demo_gov: ['+', 0.2] }, low: { demo_gov: ['+', 0.1] },
    proporz: { demo_gov: ['+', -0.3] }, spoils: { demo_gov: ['+', -0.8] }, high: { demo_gov: ['+', -0.6], demo_el: ['+', -0.4] },
    maximum: { demo_gov: ['+', -1.2], demo_el: ['+', -0.8] }, commissars: { demo_gov: ['+', -1.6], demo_el: ['+', -1.2] },
    onlyrep: { demo_el: pull(0.5, 0.7) }, purges: { demo_el: pull(0.3, 0.7), demo_civ: ['+', -1.5] },
  },
  trials: {
    long: { demo_civ: ['+', 0.3] }, jury: { demo_civ: ['+', 0.3], trustcourt: ['+', 4] }, extended: { demo_civ: ['+', 0.2] },
    legalaid: { demo_civ: ['+', 0.3], trustcourt: ['+', 3] }, plea: { demo_civ: ['+', -0.1] }, speedup: { demo_civ: ['+', -0.3] },
    quick: { demo_civ: ['+', -0.6], trustcourt: ['+', -4] }, tribunals: { demo_civ: ['+', -1.5], trustcourt: ['+', -12] },
    notrial: { demo_civ: pull(1), trustcourt: ['+', -25] },
  },
  lobbying: {
    publiconly: { demo_gov: ['+', 0.5], trustparl: ['+', 5] }, smallmatch: { demo_gov: ['+', 0.4] }, nocorporate: { demo_gov: ['+', 0.3] },
    register: { demo_gov: ['+', 0.2] }, revolving: { demo_gov: ['+', -0.4], trustparl: ['+', -4] },
    anonymous: { demo_gov: ['+', -0.6], trustparl: ['+', -6] }, superpac: { demo_gov: ['+', -0.6], trustparl: ['+', -6] },
    unlimited: { demo_gov: ['+', -0.9], trustparl: ['+', -9] },
  },
  anti_corruption: {
    agency: { demo_gov: ['+', 0.6], trustgov: ['+', 4] }, opengov: { demo_gov: ['+', 0.7], trustgov: ['+', 5] },
    whistle: { demo_gov: ['+', 0.4] }, assetdecl: { demo_gov: ['+', 0.3] }, gifts: { demo_gov: ['+', -0.3] },
    immunity: { demo_gov: ['+', -0.8], trustgov: ['+', -6] }, purges: { demo_gov: ['+', -0.5], demo_civ: ['+', -0.8] },
    patronage: { demo_gov: ['+', -1.2], trustgov: ['+', -8] },
  },
  voting_age: {
    proxykids: { demo_part: ['+', 0.2] }, age16: { demo_part: ['+', 0.3] }, local16: { demo_part: ['+', 0.15] },
    residents: { demo_part: ['+', 0.3] }, age21: { demo_part: ['+', -0.2] }, age25: { demo_part: ['+', -0.5] },
    taxpayers: { demo_part: ['+', -1.5], demo_el: ['+', -1.5] }, approved: { demo_el: pull(1, 0.7) },
  },
  policing: {
    abolished: { demo_civ: ['+', 0.2], demo_gov: ['+', -1] }, unarmed: { demo_civ: ['+', 0.2] }, community: { demo_civ: ['+', 0.3] },
    oversight: { demo_civ: ['+', 0.3] }, tough: { demo_civ: ['+', -0.3] }, militarized: { demo_civ: ['+', -0.8] },
    predictive: { demo_civ: ['+', -0.6] }, secretpolice: { demo_civ: ['+', -2.5], demo_cult: ['+', -1] },
  },
  religion: {
    banned: { demo_civ: ['+', -1.5] }, atheism: { demo_civ: ['+', -0.6] }, religiouslaw: { demo_civ: ['+', -1.5] },
    clergyrule: { demo_el: pull(2, 0.5), demo_civ: ['+', -2] },
  },
  unions: {
    banned: { demo_civ: ['+', -0.8], demo_part: ['+', -0.6], unionrate: ['=', 0], strikes: ['*', 0.1] },
    stateunions: { unionrate: pull(80, 0.8), demo_part: ['+', -0.4], strikes: ['*', 0.2] }, mandatory: { unionrate: pull(88, 0.8) },
    ghent: { unionrate: pull(70, 0.7) }, strong: { unionrate: ['+', 8], strikes: ['*', 1.3] }, codetermination: { unionrate: ['+', 5], strikes: ['*', 0.6] },
    selfmanaged: { unionrate: pull(75) }, righttowork: { unionrate: ['*', 0.6], strikes: ['*', 0.7] }, weak: { unionrate: ['*', 0.55], strikes: ['*', 0.6] },
  },
  // statsfinanserna
  taxes: {
    haven: { incometax: ['=', 0], corptax: pull(0, 0.9), vat: pull(5), revenue: pull(12) },
    t0: { incometax: ['=', 0], vat: pull(18), revenue: pull(14) }, t10: { incometax: pull(10, 0.9), revenue: pull(18) },
    consumption: { incometax: pull(15), vat: ['+', 7] }, flat: { incometax: pull(20, 0.8) }, landtax: { incometax: pull(22, 0.4) },
    progressive: { incometax: ['+', 5] }, t30: { incometax: pull(35, 0.8), revenue: ['+', 3] },
    t40: { incometax: pull(50, 0.8), revenue: ['+', 6] }, t60: { incometax: pull(65, 0.9), revenue: ['+', 10] },
  },
  corporate_tax: {
    excess: { corptax: pull(45, 0.8) }, veryhigh: { corptax: pull(38, 0.8) }, high: { corptax: pull(32, 0.7) }, raised: { corptax: ['+', 4] },
    patentbox: { corptax: ['+', -3] }, low: { corptax: pull(15, 0.7) }, payout: { corptax: pull(20, 0.5) },
    verylow: { corptax: pull(9, 0.8) }, none: { corptax: ['=', 0] },
  },
  pensions: {
    early: { pensionx: ['+', 3], retireage: ['+', -3] }, generous: { pensionx: ['+', 2] }, public: { pensionx: ['+', 1] },
    notional: { pensionx: ['+', -0.3] }, age70: { pensionx: ['+', -1.5], retireage: pull(70, 0.8) }, mandatory: { pensionx: ['+', -0.5] },
    private: { pensionx: ['*', 0.45] }, none: { pensionx: ['*', 0.15] }, filial: { pensionx: ['*', 0.1] },
  },
  retirement_age: {
    age50: { retireage: ['=', 50], pensionx: ['+', 4] }, age55: { retireage: ['=', 55], pensionx: ['+', 2.8] },
    age60: { retireage: ['=', 60], pensionx: ['+', 1.5] }, age62: { retireage: ['=', 62], pensionx: ['+', 0.6] },
    hardjobs: { retireage: ['+', -1], pensionx: ['+', 0.3] }, age67: { retireage: ['=', 67], pensionx: ['+', -0.6] },
    lifeexp: { retireage: pull(68, 0.9), pensionx: ['+', -0.9] }, age70: { retireage: ['=', 70], pensionx: ['+', -1.5] },
    none: { retireage: ['=', 74], pensionx: ['*', 0.3] },
  },
  welfare: {
    extreme: { socialx: ['+', 10], homeless: ['*', 0.4] }, ubi: { socialx: ['+', 9], homeless: ['*', 0.45] },
    huge: { socialx: ['+', 6], homeless: ['*', 0.6] }, flexicurity: { socialx: ['+', 4], homeless: ['*', 0.75] },
    coverage: { socialx: ['+', 3], homeless: ['*', 0.8] }, jobguarantee: { socialx: ['+', 2.5], homeless: ['*', 0.85] },
    cct: { socialx: ['+', -1] }, workfare: { socialx: ['+', -2], homeless: ['*', 1.1] }, little: { socialx: ['+', -4], homeless: ['*', 1.4] },
    none: { socialx: ['*', 0.3], homeless: ['*', 2] }, independent: { socialx: ['*', 0.5], homeless: ['*', 1.5] },
  },
  debt_brake: {
    debtban: { budgetbal: pull(1, 0.7) }, surplus: { budgetbal: pull(2) }, brake: { budgetbal: pull(-0.5) }, rules: { budgetbal: pull(-2, 0.4) },
    countercyclical: { budgetbal: ['+', -0.5] }, invest: { budgetbal: ['+', -1.5] }, deficit: { budgetbal: ['+', -3] }, unlimited: { budgetbal: ['+', -5] },
  },
  monetary: {
    printing: { hhdebt: ['*', 1.1], houseprice: ['*', 1.15], depositrate: ['+', 6] }, repression: { depositrate: pull(0.5, 0.8) },
    qe: { houseprice: ['*', 1.12], hhdebt: ['*', 1.08], depositrate: ['*', 0.5] }, loose: { houseprice: ['*', 1.07], hhdebt: ['*', 1.05], depositrate: ['*', 0.7] },
    tight: { houseprice: ['*', 0.92], hhdebt: ['*', 0.95], depositrate: ['*', 1.4] }, dollarization: { depositrate: ['*', 0.8] },
    gold: { houseprice: ['*', 0.95], depositrate: ['*', 1.2] }, freebanking: { hhdebt: ['*', 1.15] },
  },
  banking: {
    monobank: { hhdebt: ['*', 0.6] }, nationalized: { hhdebt: ['*', 0.8] }, coop: { hhdebt: ['*', 0.9] },
    strict: { hhdebt: ['*', 0.85], houseprice: ['*', 0.95] }, light: { hhdebt: ['*', 1.1], houseprice: ['*', 1.05] },
    none: { hhdebt: ['*', 1.25], houseprice: ['*', 1.1] },
  },
  // migrationen
  immigration: {
    noborders: { asylum: ['*', 3], migemp: ['+', -7], integ: ['+', -12], segreg: ['+', 8], xenophobia: ['+', 6] },
    open: { asylum: ['*', 2], migemp: ['+', -4], integ: ['+', -7], segreg: ['+', 5], xenophobia: ['+', 4] },
    humanitarian: { asylum: ['*', 2.5], migemp: ['+', -5], integ: ['+', -4], segreg: ['+', 3], xenophobia: ['+', 2] },
    freemove: { asylum: ['*', 1.1], migemp: ['+', 3], integ: ['+', -2] },
    guestworker: { asylum: ['*', 0.6], migemp: ['+', 9], integ: ['+', -6], segreg: ['+', 4] },
    relaxed: { asylum: ['*', 1.3], migemp: ['+', -1], integ: ['+', -2] }, managed: { asylum: ['*', 0.7], migemp: ['+', 2], integ: ['+', 2] },
    points: { asylum: ['*', 0.5], migemp: ['+', 7], integ: ['+', 4] }, goldenvisa: { asylum: ['*', 0.6], migemp: ['+', 2] },
    restricted: { asylum: ['*', 0.4], migemp: ['+', 2], integ: ['+', 2], xenophobia: ['+', 2] },
    closed: { asylum: ['*', 0.15], xenophobia: ['+', 5], newcitizens: ['*', 0.6] }, exitban: { asylum: ['*', 0.5], emig: ['*', 0.1] },
    deportation: { asylum: ['*', 0.05], xenophobia: ['+', 10], migemp: ['+', -5], integ: ['+', -8], newcitizens: ['*', 0.2] },
  },
  citizenship: {
    residency: { newcitizens: ['*', 2.5], integ: ['+', 3] }, birthright: { newcitizens: ['*', 1.6], integ: ['+', 4] },
    easy: { newcitizens: ['*', 1.8], integ: ['+', 2] }, investment: { newcitizens: ['*', 0.8] }, testsoath: { newcitizens: ['*', 0.7], integ: ['+', 1] },
    bloodline: { newcitizens: ['*', 0.25], integ: ['+', -5], xenophobia: ['+', 4] }, loyalty: { newcitizens: ['*', 0.3], integ: ['+', -3], xenophobia: ['+', 3] },
    denaturalize: { newcitizens: ['*', 0.1], integ: ['+', -8], xenophobia: ['+', 6] },
  },
  language: {
    manyofficial: { integ: ['+', 3] }, mothertongue: { integ: ['+', 2] }, regional: { integ: ['+', 1] },
    langtests: { integ: ['+', 4], migemp: ['+', 2] }, publiconly: { integ: ['+', -2] },
    assimilation: { integ: ['+', -4], xenophobia: ['+', 3] }, banned: { integ: ['+', -8], xenophobia: ['+', 5] },
  },
  culture: {
    multi: { integ: ['+', 5], xenophobia: ['+', -4], segreg: ['+', -2] }, minority: { integ: ['+', 3], xenophobia: ['+', -2] },
    bilingual: { integ: ['+', 2] }, heritage: { xenophobia: ['+', 1] }, corecult: { integ: ['+', -1], xenophobia: ['+', 3] },
    mono: { integ: ['+', -4], xenophobia: ['+', 6] }, assimilation: { integ: ['+', -2], xenophobia: ['+', 8], segreg: ['+', -2] },
  },
  emigration: {
    laborexport: { emig: ['*', 1.8] }, dualcitizen: { emig: ['*', 1.1] }, exittax: { emig: ['*', 0.8] }, bonded: { emig: ['*', 0.6] },
    exitvisa: { emig: ['*', 0.3] }, approved: { emig: ['*', 0.4] }, banned: { emig: ['*', 0.1] },
  },
  // vardagen
  housing: {
    allocated: { houseprice: ['*', 0.6], homeless: ['*', 0.6], segreg: ['+', -6], rentshare: ['+', -6] },
    public: { houseprice: ['*', 0.85], homeless: ['*', 0.7], segreg: ['+', -4], rentshare: ['+', -4] },
    rentcontrol: { houseprice: ['*', 1.05], rentshare: ['+', -5], homeless: ['*', 1.05] }, coop: { houseprice: ['*', 0.9], rentshare: ['+', -2] },
    landtax: { houseprice: ['*', 0.85] }, righttobuy: { houseprice: ['*', 1.05], homeless: ['*', 1.1] },
    upzoning: { houseprice: ['*', 0.8], homeless: ['*', 0.85], segreg: ['+', -2] },
    market: { houseprice: ['*', 1.08], rentshare: ['+', 2], segreg: ['+', 3] },
    deregulated: { houseprice: ['*', 1.12], rentshare: ['+', 4], homeless: ['*', 1.2], segreg: ['+', 5] },
  },
  urban_planning: {
    newtowns: { houseprice: ['*', 0.85], commute: ['+', 5] }, regional: { houseprice: ['*', 0.92] }, masterplan: { commute: ['+', -3] },
    upzoning: { houseprice: ['*', 0.85], commute: ['+', -2] }, developer: { houseprice: ['*', 0.95], segreg: ['+', 2] },
    minimal: { houseprice: ['*', 0.9], commute: ['+', 3] }, nozoning: { houseprice: ['*', 0.8], commute: ['+', 4], segreg: ['+', 3] },
  },
  workhours: {
    minimum: { workweek: ['=', 30], sickleave: ['+', -0.4] }, fourday: { workweek: ['=', 32], sickleave: ['+', -0.5], mentalill: ['+', -1] },
    week35: { workweek: ['=', 35] }, limited: { workweek: pull(38, 0.7) }, disconnect: { workweek: ['+', -0.5], mentalill: ['+', -0.8] },
    optout: { workweek: ['+', 1.5] }, extended: { workweek: pull(44, 0.7), sickleave: ['+', 0.4] },
    sixday: { workweek: pull(48, 0.8), sickleave: ['+', 0.8], mentalill: ['+', 1.5] },
    maximum: { workweek: pull(56, 0.8), sickleave: ['+', 1.5], mentalill: ['+', 3] },
  },
  vacation: {
    eightweeks: { vacationdays: ['=', 40] }, sixweeks: { vacationdays: ['=', 30] }, fiveweeks: { vacationdays: ['=', 25] },
    twoweeks: { vacationdays: ['=', 10] }, employer: { vacationdays: pull(5, 0.8) }, none: { vacationdays: ['=', 0], mentalill: ['+', 1.5] },
  },
  parental_leave: {
    homecare: { parentalweeks: ['=', 150] }, generous: { parentalweeks: pull(70, 0.8) }, equal: { parentalweeks: pull(60, 0.8) },
    long: { parentalweeks: pull(52, 0.8) }, paid: { parentalweeks: pull(30, 0.7) }, employer: { parentalweeks: ['*', 0.6] },
    unpaid: { parentalweeks: ['*', 0.3] }, none: { parentalweeks: ['=', 0] },
  },
  healthcare_quality: {
    minimal: { carewait: ['*', 1.6] }, low: { carewait: ['*', 1.3] }, barefoot: { carewait: ['*', 1.2] }, primary: { carewait: ['*', 1.05] },
    prevention: { carewait: ['*', 0.9], sickleave: ['+', -0.3] }, digital: { carewait: ['*', 0.8] }, modern: { carewait: ['*', 0.75] },
    extra: { carewait: ['*', 0.7] }, frontier: { carewait: ['*', 0.8] },
  },
  healthcare: {
    statemed: { carewait: ['*', 1.15], govhealth: ['+', 2.5] }, fullyfree: { carewait: ['*', 1.2], govhealth: ['+', 2] },
    free: { carewait: ['*', 1.1], govhealth: ['+', 1.2] }, socialins: { carewait: ['*', 0.95], govhealth: ['+', 0.5] },
    mandate: { carewait: ['*', 0.9] }, employer: { carewait: ['*', 0.9], govhealth: ['+', -0.8] },
    savings: { carewait: ['*', 0.85], govhealth: ['+', -1.2] }, mostlyunfree: { carewait: ['*', 0.8], govhealth: ['+', -2] },
    unfree: { carewait: ['*', 0.7], govhealth: ['*', 0.3] },
  },
  education: {
    free: { pisa: ['+', 5] }, strict: { pisa: ['+', 8] }, verystrict: { pisa: ['+', 10], mentalill: ['+', 1] }, stem: { pisa: ['+', 8] },
    dual: { pisa: ['+', 3] }, vouchers: { pisa: ['+', -2] }, freewill: { pisa: ['+', -12] }, nonecomp: { pisa: ['+', -40] },
    patriotic: { pisa: ['+', -8] }, authority: { pisa: ['+', -3] }, boarding: { pisa: ['+', 2] },
  },
  school_choice: {
    busing: { segreg: ['+', -4], pisa: ['+', 2] }, stateonly: { segreg: ['+', -2] }, assigned: { segreg: ['+', -1] },
    selective: { segreg: ['+', 3], pisa: ['+', 3] }, vouchers: { segreg: ['+', 4], pisa: ['+', 1] }, esa: { segreg: ['+', 5] },
    feepaying: { segreg: ['+', 6], pisa: ['+', 2] },
  },
  energy: {
    rationing: { elprice: ['*', 1.5], fuelprice: ['*', 1.6] }, renewable: { elprice: ['*', 1.1], fuelprice: ['*', 1.1], fossilelec: ['*', 0.5] },
    green: { elprice: ['*', 1.15], fuelprice: ['*', 1.15], fossilelec: ['*', 0.65] },
    carbontax: { elprice: ['*', 1.2], fuelprice: ['*', 1.25], fossilelec: ['*', 0.75] }, gasbridge: { gaselec: ['*', 1.4] },
    nuclear: { elprice: ['*', 0.88], fossilelec: ['*', 0.6] }, fossil: { elprice: ['*', 0.9], fuelprice: ['*', 0.88], fossilelec: ['*', 1.3] },
    fuelsubsidy: { elprice: ['*', 0.75], fuelprice: ['*', 0.5] }, dominance: { elprice: ['*', 0.85], fuelprice: ['*', 0.8], fossilelec: ['*', 1.25] },
  },
  price_controls: {
    stateprices: { foodprice: ['*', 0.8], elprice: ['*', 0.6], fuelprice: ['*', 0.7] }, margincap: { foodprice: ['*', 0.92] },
    freeze: { foodprice: ['*', 0.85], fuelprice: ['*', 0.85] }, caps: { foodprice: ['*', 0.9] },
    energycap: { elprice: ['*', 0.75], fuelprice: ['*', 0.85] }, gouging: { foodprice: ['*', 0.97] },
    free: { foodprice: ['*', 1.05], elprice: ['*', 1.08] },
  },
  agriculture: {
    requisition: { foodprice: ['*', 1.4] }, collective: { foodprice: ['*', 1.2] }, landreform: { foodprice: ['*', 1.05] },
    subsidized: { foodprice: ['*', 0.9] }, organic: { foodprice: ['*', 1.15] }, freemarket: { foodprice: ['*', 1.02] },
    biotech: { foodprice: ['*', 0.92] }, agribusiness: { foodprice: ['*', 0.9] },
  },
  globalism: {
    tradehub: { foodprice: ['*', 0.9], fuelprice: ['*', 0.95] }, union: { foodprice: ['*', 0.95] }, protectionism: { foodprice: ['*', 1.08] },
    importsub: { foodprice: ['*', 1.12] }, disengagement: { foodprice: ['*', 1.15] },
    isolationist: { foodprice: ['*', 1.25], fuelprice: ['*', 1.2] }, autarky: { foodprice: ['*', 1.4], fuelprice: ['*', 1.35] },
  },
  transport: {
    carfree: { cars: ['*', 0.35], commute: ['+', 4] }, freetransit: { cars: ['*', 0.8], commute: ['+', 1] },
    transitfirst: { cars: ['*', 0.85], commute: ['+', -2] }, highspeed: { cars: ['*', 0.95], commute: ['+', -3] },
    roads: { cars: ['*', 1.1], commute: ['+', -1] }, carnation: { cars: ['*', 1.25], commute: ['+', 4] },
    private: { commute: ['+', 1] }, deregulated: { commute: ['+', 2] },
  },
};
for (const [cat, opts] of Object.entries(LAW_EFFECTS_516)) {
  if (!LAWS[cat]) continue;
  for (const [opt, fx] of Object.entries(opts)) {
    if (LAWS[cat].options.some((o) => o.id === opt)) addLawFx(cat, opt, fx);
  }
}

// startläget per lagkategori (det verkliga datat har redan landets politik)
const DEFAULT_LAW = Object.fromEntries(Object.entries(LAWS).map(([cat, L]) =>
  [cat, (L.options.find((o) => o.default) || L.options[Math.floor(L.options.length / 2)]).id]));

// ---------- formatering ----------
const dec = (v, n) => (Math.round(v * 10 ** n) / 10 ** n).toFixed(n).replace('.', ',');
export function fmtInd(id, v) {
  if (v == null || !Number.isFinite(v)) return '–';
  switch ((IND[id] || IND[RANK_ALIAS[id]?.of])?.fmt) {
    case 'usd': case 'usdbig': return dollars(v);
    case 'pct': return `${dec(v, 1)} %`;
    case 'pctgdp': return `${dec(v, 1)} % AV BNP`;
    case 'pp': return `${v > 0 ? '+' : ''}${dec(v, 1)} % AV BNP`;
    case 'num1': return dec(v, 1);
    case 'num2': return dec(v, 2);
    case 'idx3': return dec(v, 3);
    case 'count': return bigNumber(v);
    case 'scount': return (v > 0 ? '+' : '') + bigNumber(v);
    case 'per1000': return `${dec(v, 1)} / 1\u{00A0}000`;
    case 'per100': return `${dec(v, 0)} / 100`;
    case 'per100k': return `${dec(v, 1)} / 100\u{00A0}000`;
    case 'years': return `${dec(v, 1)} ÅR`;
    case 'km2': return `${bigNumber(v)} KM2`;
    case 'perkm2': return `${dec(v, 0)} / KM2`;
    case 'wgi': return `${Math.round((v + 2.5) * 20)} / 100`;
    case 'score10': return `${dec(v, 1)} / 10`;
    case 'score100': return `${Math.round(v)} / 100`;
    case 'tons': return `${dec(v, 1)} TON`;
    case 'permillion': return `${bigNumber(v)} / MILJON`;
    case 'kgoe': return `${bigNumber(v)} KG OLJA`;
    case 'ugm3': return `${dec(v, 1)} UG/M3`;
    case 'liters': return `${dec(v, 1)} LITER`;
    // V5.8
    case 'spct': return `${v > 0 ? '+' : ''}${dec(v, 1)} %`;
    case 'index': return dec(v, 0);
    case 'months': return `${dec(v, 1)} MÅNADER`;
    case 'days': return `${dec(v, 0)} DAGAR`;
    case 'minutes': return `${dec(v, 0)} MINUTER`;
    case 'kwh': return `${bigNumber(v)} KWH`;
    case 'km': return `${bigNumber(v)} KM`;
    case 'kgha': return `${bigNumber(v)} KG/HEKTAR`;
    case 'ha': return `${dec(v, 2)} HEKTAR`;
    case 'tonsbig': return `${bigNumber(v)} TON`;
    case 'mt': return `${bigNumber(v * 1e6)} TON`;
    case 'mtkm': return `${bigNumber(v * 1e6)} TONKM`;
    case 'teu': return `${bigNumber(v)} CONTAINRAR`;
    case 'm3': return `${bigNumber(v)} M3`;
    case 'score5': return `${dec(v, 1)} / 5`;
    case 'species': return `${dec(v, 0)} ${Math.round(v) === 1 ? 'ART' : 'ARTER'}`;
    // V5.10
    case 'ratio100': return `${dec(v * 100, 1)} / 100`;
    case 'persons': return `${dec(v, 1)} PERSONER`;
    // V5.16
    case 'regime': return regimeOf(v >= 3 ? 9 : v >= 2 ? 7 : v >= 1 ? 5 : 2)?.name || '–';
    case 'rating': return RATINGS[Math.max(0, Math.min(RATINGS.length - 1, Math.round(v)))].id;
    case 'susd': return (v > 0 ? '+' : '') + dollars(v);
    case 'usdmo': return `${dollars(v)} / MÅNAD`;
    case 'usdl': return `${dec(v, 2)}\u{00A0}$ / LITER`;
    case 'usdkwh': return `${dec(v, 2)}\u{00A0}$ / KWH`;
    case 'hours': return `${dec(v, 1)} TIMMAR`;
    case 'weeks': return `${dec(v, 0)} VECKOR`;
    case 'ratio': return `${dec(v, 1)} ÅRSINKOMSTER`;
    case 'dbl': {   // värdet är tillväxten i % per år — visas som fördubblings- eller halveringstid
      const g = Math.max(-50, v) / 100;
      const y = Math.abs(g) > 1e-9 ? Math.LN2 / Math.abs(Math.log(1 + g)) : Infinity;
      if (y > 999) return 'STÅR NÄSTAN STILLA';
      return `${g > 0 ? 'FÖRDUBBLAS' : 'HALVERAS'} PÅ ${dec(y, 0)} ÅR`;
    }
    default: return dec(v, 1);
  }
}

// ---------- data + uppskattning av det som saknas ----------
let BASE = {};          // cid -> { nyckel: värde }
let EST = {};           // cid -> Set(nycklar som är uppskattade)
let LIVE = null;        // V5.7: facts-objektet — befolkningen ändras under spelets gång
const RAW_KEYS = ['gdppc', 'gdpgrowth', 'unemp', 'youthunemp', 'infl', 'lendrate', 'debt', 'tax', 'exports', 'imports',
  'fdi', 'hitech', 'agri', 'manuf', 'services', 'tourists', 'airpax', 'life', 'infmort', 'u5mort', 'doctors', 'beds',
  'healthx', 'water', 'elec', 'poverty', 'gini', 'smoking', 'alcohol', 'popgrowth', 'birth', 'death', 'fert', 'kids',
  'old', 'urban', 'netmig', 'area', 'literacy', 'schoolyears', 'tertiary', 'edux', 'rnd', 'patents', 'internet',
  'mobile', 'homicide', 'voice', 'corruptgov', 'rulelaw', 'polstab', 'goveff', 'regq', 'femlabor', 'womenparl', 'gii',
  'co2', 'pm25', 'renew', 'forest', 'protected', 'milx', 'hdi',
  // V5.7
  'lifefem', 'lifemale', 'overweight', 'undernourish', 'sanitation', 'researchers', 'articles', 'primary', 'broadband',
  'govspend', 'curacc', 'stockcap', 'bankacc', 'energyuse', 'armsexp', 'milpers', 'labor', 'traffic'];
// V5.8: de nya måtten uppskattas med medianen av de 8 närmaste i stället för
// medelvärdet, så att ett enda extremt land (skatteparadis, små östater) inte drar iväg
const RAW_KEYS_58 = ['gdppcppp', 'savings', 'consumption', 'invest', 'industry', 'interestpay', 'realrate', 'reserves', 'newbiz', 'ictserv',
  'remit', 'aid', 'natres', 'oilrent', 'minrent', 'listed', 'tariff', 'productivity', 'tourrcpt',
  'lfpr', 'lfprmale', 'emprate', 'empagri', 'empind', 'empserv', 'vulnemp', 'selfemp', 'neet',
  'cleancook', 'renewelec', 'nuclear', 'coal', 'hydro', 'eleccons', 'energyimp', 'rail', 'airfreight', 'ports', 'lpi', 'phones',
  'cerealyield', 'cerealprod', 'agland', 'arable', 'fertilizer', 'irrigated', 'fishcatch', 'aquaculture', 'stunting',
  'nurses', 'measles', 'dpt', 'tb', 'hiv', 'malaria', 'matmort', 'oop', 'diabetes', 'ncd', 'skilledbirth', 'anemia',
  'waterdeath', 'airdeath', 'slums', 'female', 'urbgrowth', 'dependency', 'migrants', 'birthreg',
  'pupilteacher', 'secondary', 'preschool', 'youthlit', 'outofschool', 'bachelor', 'servers', 'ictgoods', 'hci',
  'top10', 'bottom20', 'womenmin', 'co2total', 'methane', 'waterstress', 'freshwater', 'marine',
  'thrmammals', 'thrbirds', 'thrfish', 'thrplants', 'armsimp'];
// V5.10: demografin (uppskattas som V5.8-måtten, med medianen)
const RAW_KEYS_510 = ['olddep', 'youngdep', 'adofert', 'contracept', 'adultmortm', 'adultmortf', 'sexratio',
  'largestcity', 'megacity'];
// V5.14: ännu fler verkliga mått (tools/build-indicators.mjs)
const RAW_KEYS_514 = ['gnipc', 'fuelexp', 'foodimp', 'oresexp', 'manufexp', 'ictexp', 'extdebt', 'debtserv', 'credit',
  'broadmoney', 'tourspend', 'atms', 'bankbranch', 'parttime', 'wagework', 'unempfem', 'unempmale', 'unempedu',
  'childlabor', 'femmanagers', 'healthpc', 'birthcare', 'hepb', 'handwash', 'cleanfuel', 'neonatal', 'commdeath',
  'injurydeath', 'girlsschool', 'lowsec', 'litfem', 'trainedteach', 'patentsfor', 'elecloss', 'ghg', 'n2o', 'disasters'];
// V5.16: Världsbankens statsfinanser, hälsa, företag, el och fattigdom
const RAW_KEYS_516 = ['suicide', 'govhealth', 'revenue', 'budgetbal', 'depositrate', 'firmbribe', 'femown', 'gaselec',
  'fossilelec', 'poverty365', 'poverty685', 'natpov', 'learnpov', 'tertfem'];

// V5.16: verkliga siffror där Världsbanken inte har dem (OECD, ILO, KPMG, skatteverk,
// PISA 2022, avrundade). Övriga länder uppskattas ur sina andra mått och märks ~.
const T516 = {
  // fackligt anslutna %
  unionrate: { 752: 65, 246: 58, 208: 67, 578: 50, 352: 91, '056': 49, 380: 33, '040': 26, 124: 26, 826: 22, 372: 26,
    276: 16, 528: 15, 392: 17, '036': 13, 840: 10, 250: 9, 724: 12, 410: 12, 616: 13, 203: 11, 348: 8, 233: 5,
    440: 7, 792: 9, 484: 12, 152: 18, 554: 17, 756: 14, 620: 15, 300: 20, 703: 11, 705: 24, 442: 31, 376: 25,
    643: 27, 156: 44, 710: 26, '032': 28, '076': 11, 356: 10 },
  // strejkdagar per 1 000 anställda och år (snitt flera år)
  strikes: { 752: 3, 578: 30, 208: 40, 246: 50, 250: 100, '056': 90, 724: 50, 380: 40, 826: 20, 276: 18, 840: 8,
    124: 80, 392: 0.5, 410: 30, '036': 15, 554: 15, 528: 15, '040': 5, 756: 2, 372: 10, 620: 25, 300: 40,
    616: 2, 348: 2, 203: 1, 356: 30, '076': 40, 710: 150, '032': 80, 152: 30, 484: 5, 792: 20, 376: 40, 156: 1, 643: 1 },
  // bolagsskatt %
  corptax: { 752: 20.6, 208: 22, 578: 22, 246: 20, 826: 25, 276: 29.9, 250: 25, 724: 25, 380: 24, 528: 25.8,
    '056': 25, '040': 23, 756: 19.6, 372: 12.5, 348: 9, 616: 19, 203: 21, 840: 21, 124: 26.5, 392: 30.6, 410: 24,
    156: 25, 356: 25.2, 643: 25, '076': 34, 484: 30, '032': 35, 710: 27, 566: 30, 818: 22.5, '036': 30, 554: 28,
    784: 9, 682: 20, 634: 10, 702: 17, 344: 16.5, 158: 20, 792: 25, 376: 23, 360: 22, 764: 20, 704: 20, 608: 25, 458: 24 },
  // högsta marginalskatt på lön %
  incometax: { 752: 52, 208: 55.9, 578: 47.4, 246: 51, 826: 45, 276: 45, 250: 45, 724: 47, 380: 43, 528: 49.5,
    '056': 50, '040': 55, 756: 40, 372: 40, 348: 15, 616: 32, 203: 23, 840: 37, 124: 33, 392: 45, 410: 45, 156: 45,
    356: 39, 643: 22, '076': 27.5, 484: 35, '032': 35, 710: 45, 566: 24, 818: 27.5, '036': 45, 554: 39, 784: 0,
    682: 0, 634: 0, 414: 0, '048': 0, 512: 0, 702: 24, 344: 17, 158: 40, 792: 40, 376: 50, 360: 35, 764: 35, 704: 35 },
  // moms (USA: snittet för försäljningsskatt)
  vat: { 752: 25, 208: 25, 578: 25, 246: 25.5, 348: 27, 826: 20, 276: 19, 250: 20, 724: 21, 380: 22, 528: 21,
    '056': 21, '040': 20, 756: 8.1, 372: 23, 616: 23, 203: 21, 840: 6.6, 124: 13, 392: 10, 410: 10, 156: 13, 356: 18,
    643: 20, '076': 17, 484: 16, '032': 21, 710: 15, 566: 7.5, 818: 14, '036': 10, 554: 15, 784: 5, 682: 15, 634: 0,
    414: 0, 702: 9, 344: 0, 158: 5, 792: 20, 376: 18, 360: 11, 764: 7, 704: 10, 608: 12, 458: 8 },
  // bensin $/liter (2024)
  fuelprice: { 752: 1.85, 578: 2.1, 208: 2.05, 246: 1.9, 276: 1.9, 250: 1.95, 826: 1.85, 528: 2.2, 380: 1.95,
    724: 1.7, 840: 0.93, 124: 1.2, 392: 1.15, 156: 1.1, 356: 1.25, 643: 0.6, '076': 1.15, 682: 0.62, 364: 0.03,
    862: 0.035, 566: 0.65, 818: 0.32, 360: 0.65, 484: 1.25, 792: 1.25, '036': 1.25, 410: 1.3, 710: 1.3, '032': 1.0,
    616: 1.6, 804: 1.3, 398: 0.5, 634: 0.5, 784: 0.75, 414: 0.34, 434: 0.03, '012': 0.34, 458: 0.44 },
  // el för hushåll $/kWh (2024)
  elprice: { 752: 0.2, 208: 0.38, 276: 0.4, 826: 0.35, 250: 0.27, 380: 0.35, 724: 0.28, 578: 0.13, 246: 0.17,
    840: 0.17, 124: 0.13, 392: 0.22, 156: 0.08, 356: 0.08, 643: 0.06, '076': 0.15, 682: 0.05, 818: 0.03, 566: 0.06,
    710: 0.17, '036': 0.25, 410: 0.11, 484: 0.09, 792: 0.1, '032': 0.04, 616: 0.25, 804: 0.06, 634: 0.03, 414: 0.01, 784: 0.08 },
  // hushållens skulder % av disponibel inkomst
  hhdebt: { 752: 180, 208: 230, 578: 230, 528: 190, 756: 200, '036': 190, 124: 180, 840: 100, 826: 130, 276: 90,
    250: 120, 392: 110, 410: 170, 156: 100, 380: 80, 724: 90, 246: 130, 554: 160, 372: 90, '056': 105 },
  // pensionsålder
  retireage: { 752: 66, 208: 67, 578: 67, 246: 65, 826: 66, 276: 66, 250: 64, 724: 66, 380: 67, 528: 67, 840: 67,
    124: 65, 392: 65, 410: 63, 156: 61, 356: 60, 643: 63, '076': 63, '036': 67, 554: 65, 484: 65, 792: 60, 710: 60 },
  // lagstadgade semesterdagar
  vacationdays: { 752: 25, 208: 25, 578: 25, 246: 25, 250: 25, 276: 20, 826: 28, 380: 20, 724: 22, 528: 20, 840: 0,
    124: 10, 392: 10, 410: 15, 156: 5, 356: 12, 643: 28, '076': 30, '036': 20, 554: 20, 484: 12, 792: 14, 710: 15 },
  // betald föräldraledighet, veckor för båda föräldrarna
  parentalweeks: { 752: 69, 578: 49, 208: 52, 246: 58, 276: 58, 250: 42, 826: 39, 380: 34, 724: 32, 528: 26,
    840: 0, 124: 52, 392: 58, 410: 52, 156: 14, 356: 26, 643: 156, '076': 17, '036': 24, 554: 26, 484: 13, 792: 16, 710: 17 },
  // PISA 2022 (snitt av matte, läsning och naturvetenskap)
  pisa: { 702: 560, 392: 533, 410: 523, 158: 533, 344: 520, 446: 535, 233: 516, 372: 504, 124: 507, 756: 498,
    528: 482, 246: 490, 208: 489, 752: 487, 276: 479, 826: 494, 840: 478, '036': 494, 554: 488, 616: 488, 203: 487,
    '040': 487, '056': 489, 250: 478, 578: 471, 620: 474, 380: 471, 724: 477, 348: 475, 440: 474, 428: 482,
    705: 487, 352: 449, 376: 457, 792: 456, 300: 438, 152: 431, 484: 410, '076': 390, 170: 398, '032': 398,
    604: 397, 764: 397, 458: 405, 360: 369, 608: 353, 504: 356, 400: 360, 682: 383, 784: 422, 634: 413, 398: 412,
    704: 505, 156: 560, 643: 482, 804: 441, 688: 440, 642: 428, 100: 418, '008': 363, 807: 370, 268: 380,
    496: 420, 214: 345, 591: 375, 600: 347, 320: 360, 222: 360, 188: 400, 858: 420, 388: 400 },
};
// demokratiindexets delar ur Världsbankens styrningsmått (minsta kvadrat över EIU:s 166 länder):
// [konstant, voice, goveff, polstab, rulelaw, corruptgov] per delindex i DEMO_SUBS-ordning
const DEMO_FIT = [[6.02, 4.34, 1.25, 0.38, -1.56, -1.05], [4.73, 1.43, 1.66, 0.24, -0.40, -0.31],
  [5.49, 1.84, 1.10, -0.58, -0.33, -0.63], [5.65, 0.18, -0.60, -0.06, 1.41, 0.46], [5.92, 2.51, 0.27, 0.23, 0.09, -0.51]];
// minimilönen i andel av medellönen per lagalternativ (collective/none = ingen lagstadgad)
const MINWAGE_SHARE = { statewages: 0.75, veryhigh: 0.65, high: 0.55, indexed: 0.5, collective: 0, youth: 0.4,
  sector: 0.35, low: 0.3, none: 0 };
// länder utan lagstadgad minimilön (lönerna sätts i kollektivavtal)
const NO_MINWAGE = new Set(['752', '208', '578', '246', '380', '040', '352', '756', '702']);
// länder med röstplikt
const COMPULSORY_VOTE = new Set(['036', '056', '076', '032', '604', '218', '068', '858', '442', '702']);
// räknas per invånare — uppskattas som andel och skalas sedan med folkmängden
const PER_CAPITA_SUMS = { tourists: 1, airpax: 1, patents: 1, netmig: 1, articles: 1, armsexp: 1, labor: 1,
  tourrcpt: 1, listed: 1, cerealprod: 1, fishcatch: 1, aquaculture: 1, outofschool: 1, co2total: 1, methane: 1,
  armsimp: 1, airfreight: 1, tourspend: 1, patentsfor: 1, ghg: 1, n2o: 1 };
// V5.8: saknas värdet betyder det (nästan alltid) noll: inga malariamyggor, ett
// givarland som inte får bistånd, ingen järnväg, eller — i ett fattigare land —
// ingen börs. true = säkert noll, en funktion = noll bara om villkoret gäller
// (märks då som uppskattat), annars vanlig uppskattning.
// 'wb' = noll om Världsbanken har landet men inte måttet (V5.10: ett land utan
// miljonstad saknas i listan) — ett land som helt saknas där uppskattas i stället.
const ZERO_IF_MISSING = { malaria: true, aid: true, rail: true, listed: (b) => b.gdppc < 12000, megacity: 'wb',
  // V5.14: rika länder har inget barnarbete och redovisar ingen utlandsskuld hos Världsbanken
  childlabor: (b) => b.gdppc > 15000, debtserv: (b) => b.gdppc > 15000 };
// järnvägsnät som Världsbanken saknar (CIA World Factbook, avrundat — märks ~)
const RAIL_KM = { '484': 20800, '036': 33000, '170': 2100, '024': 2900, '068': 4000, '516': 2600, '324': 1100,
  '400': 500, '430': 430, '768': 570, '418': 420, '728': 250, '232': 300 };
// går inte att gissa (landet saknar kust, eller handeln med energi följer inte välståndet)
const NO_IMPUTE = { marine: 1, ports: 1, energyimp: 1 };
// brotten som vägs ihop till Brottslighet (100 = ett typiskt land i världen)
const CRIME_KEYS = ['homicide', 'assault', 'threats', 'robbery', 'burglary', 'theft', 'cartheft', 'vandalism',
  'kidnapping', 'extortion', 'fraud', 'gangs', 'youthcrime', 'harass', 'biketheft', 'graffiti'];
let CRIME_MED = {};

// V5.10: befolkningspyramiden — Världsbankens andel av männen (pm…) resp.
// kvinnorna (pf…) i varje femårsgrupp. Grupp 0–2 är barn (0–14), 13–16 är 65+.
export const PYRAMID_GROUPS = ['0–4', '5–9', '10–14', '15–19', '20–24', '25–29', '30–34', '35–39', '40–44',
  '45–49', '50–54', '55–59', '60–64', '65–69', '70–74', '75–79', '80+'];
const PYR_KEYS = ['0004', '0509', '1014', '1519', '2024', '2529', '3034', '3539', '4044', '4549', '5054', '5559',
  '6064', '6569', '7074', '7579', '80up'];
const PYR_RAW = new Set(PYR_KEYS.flatMap((g) => ['pm' + g, 'pf' + g]));
const PYR_KIDS = 3, PYR_OLD = 13;
// måtten som räknas ur pyramiden — uppskattade när landets pyramid är det
const PYR_DERIVED = ['medianage', 'youth', 'oldest', 'kidsn', 'workage', 'oldn'];
let PYR = {};           // cid -> { m, f: [17] (summerar till 100), km, kf, om, of: andel barn/65+ per kön }

// Länder Världsbanken saknar helt (inte medlemmar m.m.) — verkliga värden från
// nationell statistik, avrundade. Resten fylls av uppskattningen nedan.
const OVERRIDES = {
  '158': { pop: 23400000, gdppc: 33900, life: 80.9, hdi: 0.926, unemp: 3.4, infl: 2.2, schoolyears: 12.6, homicide: 0.8, internet: 92, urban: 80, fert: 0.87, area: 36197, voice: 1.1, corruptgov: 1.2, rulelaw: 1.2, polstab: 0.6, goveff: 1.4, regq: 1.4 },
  '408': { gdppc: 1200, life: 73.6, hdi: 0.733, internet: 0, voice: -2.2, corruptgov: -1.6, rulelaw: -1.6, polstab: -0.5, goveff: -1.6, regq: -2.2, milx: 24, area: 120540 },
};

export function setIndicatorData(raw, facts) {
  BASE = {};
  EST = {};
  const popOf = (cid) => facts?.[cid]?.p || OVERRIDES[cid]?.pop || 0;
  for (const cid of Object.keys(facts || {})) {
    if (!popOf(cid)) continue;
    // V5.10: pyramidens 34 andelar hålls för sig (PYR nedan) — inte i BASE, som
    // countryIndicators läser för hela världen
    const own = {};
    for (const k in raw[cid] || {}) if (!PYR_RAW.has(k)) own[k] = raw[cid][k];
    BASE[cid] = { ...own, ...(OVERRIDES[cid] || {}) };
    // V5.12: folkets tro (faith.js) — alla länder har en fördelning
    const S = sharesOf(cid);
    for (let i = 0; i < FAITH_KEYS.length; i++) BASE[cid][FAITH_IDS[i]] = S[FAITH_KEYS[i]] || 0;
  }
  const ids = Object.keys(BASE);
  // land utan BNP per capita: grannarna i HDI, annars världsmedianen
  const median = (arr) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const gdps = ids.map((c) => BASE[c].gdppc).filter((v) => v > 0);
  for (const cid of ids) {
    if (BASE[cid].gdppc > 0) continue;
    (EST[cid] ||= new Set()).add('gdppc');
    BASE[cid].gdppc = median(gdps);
  }
  const lg = (cid) => Math.log(Math.max(100, BASE[cid].gdppc));
  const robust = new Set([...RAW_KEYS_58, ...RAW_KEYS_510, ...RAW_KEYS_514, ...RAW_KEYS_516]);
  for (const key of [...RAW_KEYS, ...RAW_KEYS_58, ...RAW_KEYS_510, ...RAW_KEYS_514, ...RAW_KEYS_516]) {
    if (NO_IMPUTE[key]) continue;
    let missing = ids.filter((c) => !Number.isFinite(BASE[c][key]));
    if (!missing.length) continue;
    const per = PER_CAPITA_SUMS[key] ? popOf : null;
    const have = ids.filter((c) => Number.isFinite(BASE[c][key]))
      .map((c, i) => ({ i, l: lg(c), v: per ? BASE[c][key] / per(c) : BASE[c][key] }));
    const zero = ZERO_IF_MISSING[key];
    if (zero) {
      for (const cid of missing) {
        if (zero === 'wb' ? !raw[cid] : zero !== true && !zero(BASE[cid])) continue;
        const known = key === 'rail' ? RAIL_KM[cid] : undefined;
        BASE[cid][key] = known ?? 0;
        if (known || (zero !== true && zero !== 'wb')) (EST[cid] ||= new Set()).add(key);
      }
      missing = missing.filter((c) => !Number.isFinite(BASE[c][key]));
      if (!missing.length) continue;
    }
    if (!have.length) continue;
    // V5.8: de 8 närmaste i BNP per capita (samma urval och ordning som en full
    // sortering, men bara ett fönster kring landet sorteras — 200+ mått gånger
    // 200+ länder blev annars märkbart vid start)
    const byL = [...have].sort((a, b) => a.l - b.l || a.i - b.i);
    for (const cid of missing) {
      const l = lg(cid);
      let lo = 0, hi = byL.length;
      while (lo < hi) { const m = (lo + hi) >> 1; if (byL[m].l < l) lo = m + 1; else hi = m; }
      let a = Math.max(0, lo - 8), z = Math.min(byL.length, lo + 8);
      const dist = (x) => Math.abs(x.l - l);
      let cut = byL.slice(a, z).map(dist).sort((p, q) => p - q)[Math.min(7, z - a - 1)];
      while (a > 0 && dist(byL[a - 1]) <= cut) a--;
      while (z < byL.length && dist(byL[z]) <= cut) z++;
      const near = byL.slice(a, z).sort((p, q) => dist(p) - dist(q) || p.i - q.i).slice(0, 8);
      let avg = near.reduce((s, x) => s + x.v, 0) / near.length;
      if (robust.has(key) && near.length > 2) {
        const s = near.map((x) => x.v).sort((p, q) => p - q), h = s.length >> 1;
        avg = s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
      }
      BASE[cid][key] = per ? avg * per(cid) : avg;
      (EST[cid] ||= new Set()).add(key);
    }
  }
  for (const cid of ids) BASE[cid].pop = popOf(cid);
  // V5.7: brottsstatistik finns inte i Världsbanken — den uppskattas ur landets
  // verkliga mordtal, inkomstskillnader, urbanisering, rättsstat och välstånd.
  for (const cid of ids) {
    const b = BASE[cid];
    const H = Math.max(0.2, b.homicide || 3), G = b.gini || 34, Ur = b.urban || 60, Rl = b.rulelaw || 0;
    const P = Math.max(300, b.gdppc), Ps = b.polstab || 0, Net = b.internet || 50;
    const model = {
      robbery: 15 + 18 * H ** 0.8 * (G / 34) * Math.sqrt(Ur / 60),
      burglary: 80 * (P / 10000) ** 0.35 * Math.max(0.3, 1 - Rl / 6),
      drugcrime: 40 * (P / 10000) ** 0.3,
      cybercrime: 3 * Net * (P / 10000) ** 0.3,
      prisoners: Math.max(20, 60 + 18 * H ** 0.7 - 15 * Rl),
      police: Math.max(80, 220 - 30 * Rl + 10 * Math.max(0, -Ps)),
      feelsafe: Math.max(15, Math.min(98, 88 - 7 * Math.sqrt(H) + 3 * Ps)),
    };
    for (const [k, v] of Object.entries(model)) {
      if (Number.isFinite(b[k])) continue;
      b[k] = v;
      (EST[cid] ||= new Set()).add(k);
    }
    // V5.8: 30 nya brott och rättsmått, uppskattade på samma sätt. Våld följer
    // landets mordtal, stöld följer välstånd och städer, ekobrott följer
    // korruptionen och rättsväsendet följer hur väl staten fungerar.
    const Cg = b.corruptgov || 0, Ge = b.goveff || 0, Rq = b.regq || 0, V = b.voice || 0;
    const urb = Math.sqrt(Ur / 60);                       // städer → mer brott
    const law = Math.max(0.3, 1 - Rl / 5);                // svag rättsstat → mer brott
    const corr = Math.max(0.3, 1 - Cg / 4);               // korruption
    const rich = P / 10000;
    const unst = Math.max(0, -Ps);                        // oroligt land
    const cars = Math.min(1, (P / 25000) ** 0.8);         // ungefär hur många som har bil
    const alc = b.alcohol ?? 6;
    const youth = Math.sqrt((b.kids ?? 25) / 20);         // många unga
    const C = H ** 0.35;                                  // brottsklimatet i stort
    const shadow = clampV(8 + 10 * Math.max(0, 1.8 - (Rl + Cg + Rq) / 3) + 0.15 * Math.max(0, (b.vulnemp ?? 30) - 10), 5, 70);
    const model2 = {
      assault: 180 * H ** 0.5 * Math.sqrt(G / 34) * urb * (0.8 + alc / 40),
      threats: 250 * H ** 0.45 * Math.sqrt(urb),
      theft: 600 * rich ** 0.25 * urb * law * Math.sqrt(G / 34) * (0.3 + 0.7 * C),
      pickpocket: 20 + 300 * Math.sqrt(Math.min(4, (b.tourists || 0) / b.pop)) * law * Math.sqrt(C),
      cartheft: 80 * cars * H ** 0.8 * law * urb,
      shoplift: 250 * rich ** 0.3 * law * C,
      vandalism: 400 * urb * rich ** 0.15 * law * C ** 0.7 * youth,
      arson: 8 * urb * law * C ** 0.8 * (1 + 0.5 * unst),
      weapons: 15 * H ** 0.7 * urb * law,
      kidnapping: 0.15 * H ** 0.9 * corr * (1 + 0.8 * unst),
      extortion: 3 * H ** 0.7 * corr * (1 + 0.3 * unst),
      trafficking: 0.4 + 1.2 * corr ** 1.5 * (1 + 0.3 * unst) * H ** 0.15,
      gangs: 15 + 25 * H ** 0.7 * urb * youth * (1 + Math.max(0, G - 35) / 30),
      hatecrime: 2 + 0.5 * (b.migrants ?? 5) ** 0.7 * Math.max(0.3, 1.2 - V / 5) * (0.7 + 0.3 * C) + 4 * unst,
      dui: 2 + 120 * cars * (alc / 8) * (0.6 + 0.4 * law),
      fraud: 200 * rich ** 0.3 * (0.5 + Net / 100) * corr,
      idtheft: 0.8 * Net * rich ** 0.4 * (0.6 + 0.4 * corr),
      bribery: clampV(50 / (1 + Math.exp(2 * (Cg + 0.6))), 0.5, 80),
      moneylaundering: clampV(0.8 + 2.2 * corr + 0.4 * (C - 1), 0.5, 15),
      shadow,
      taxevasion: clampV(3 + 0.7 * shadow, 3, 60),
      smuggling: 6 * Math.sqrt(((b.exports ?? 30) + (b.imports ?? 35)) / 70) * corr ** 1.5 * (1 + 0.4 * unst),
      envcrime: 10 + 30 * corr * law * (0.6 + (b.forest ?? 30) / 100),
      poaching: clampV(60 * corr ** 1.2 * Math.min(1.5, Math.sqrt((b.thrmammals ?? 10) / 25))
        * Math.max(0.3, 1 - Math.log10(P / 1000) / 3), 1, 100),
      clearance: clampV(22 + 5 * (Ge + Rl) - 4 * Math.log(H), 3, 75),
      recidivism: clampV(48 - 6 * Ge + 0.03 * (b.prisoners - 150), 15, 80),
      prisonocc: clampV(85 + 60 * Math.max(0, 0.8 - Ge / 2) ** 1.3 + 0.03 * (b.prisoners - 150), 50, 400),
      courtwait: clampV(90 + 250 * (1 - (Ge + Rl) / 5), 30, 1500),
      response: clampV(5 + 16 * (1 - Ur / 100) + 12 * Math.max(0, 0.8 - Ge / 2.5)
        + 6 / Math.sqrt(Math.max(1, b.density || 50) / 50), 5, 90),
      cctv: clampV(1 + 40 * (P / 20000) ** 0.9 * (1 + 1.5 * Math.max(0, -V)) * (1.4 - 0.35 * Math.max(0, V)), 0.5, 600),
    };
    // V5.14: 18 nya brott och rättsmått, uppskattade på samma sätt
    const eff = (Ge + Rl + 5) / 10;                       // 0 = stat som inte fungerar, 1 = mycket välfungerande
    const model3 = {
      youthcrime: 320 * youth * urb * law * C ** 0.6,
      harass: 90 * H ** 0.3 * urb * (0.6 + 0.4 * law),
      trespass: 40 * rich ** 0.25 * law * urb,
      biketheft: 150 * urb * rich ** 0.2 * law * C ** 0.5,
      graffiti: 120 * urb * rich ** 0.3 * law * youth,
      hitrun: 3 + 25 * cars * law * C ** 0.5,
      speeding: 400 + 3500 * cars * (0.3 + 0.7 * eff),
      animalcruelty: 2 + 8 * law * (1 + 0.5 * unst),
      counterfeit: 4 + 15 * corr * rich ** 0.2 * Math.sqrt(((b.exports ?? 30) + (b.imports ?? 35)) / 70),
      forgery: 5 + 20 * corr * law,
      embezzle: 3 + 12 * corr ** 1.3 * rich ** 0.2,
      insider: 0.05 + 0.3 * Math.sqrt(rich) * corr,
      piracy: clampV(18 + 55 * (1 - (Rl + 2.5) / 5) - 4 * Math.log10(Math.max(1, rich)), 8, 92),
      illegallog: clampV(3 + 55 * corr ** 1.4 * law * Math.min(1.3, (b.forest ?? 30) / 30), 0, 85),
      detention: clampV(12 + 50 * (1 - eff) ** 1.3, 5, 85),
      policetrust: clampV(28 + 12 * Rl + 8 * Ge - 4 * Math.log(H), 8, 95),
      lawyers: 15 + 140 * Math.min(2, rich) ** 0.5 * eff,
      judges: 2 + 18 * eff,
    };
    for (const [k, v] of Object.entries(model3)) {
      if (Number.isFinite(b[k])) continue;
      b[k] = v;
      (EST[cid] ||= new Set()).add(k);
    }
    for (const [k, v] of Object.entries(model2)) {
      if (Number.isFinite(b[k])) continue;
      b[k] = v;
      (EST[cid] ||= new Set()).add(k);
    }
    // V5.16 VERKLIGHETEN: demokratiindexet (EIU 2024). Saknas landet räknas det fram
    // ur Världsbankens styrningsmått med samma samband som för de 166 länder som har det.
    const dem = DEMOCRACY[cid];
    DEMO_SUBS.forEach((k, i) => {
      if (Number.isFinite(b[k])) return;
      if (dem) { b[k] = dem[i + 1]; return; }
      const c = DEMO_FIT[i];
      b[k] = clampV(c[0] + c[1] * V + c[2] * Ge + c[3] * Ps + c[4] * Rl + c[5] * Cg, 0, 10);
      (EST[cid] ||= new Set()).add(k);
    });
    if (!dem) for (const k of ['demo', 'regime', 'parties', 'polprisoners']) (EST[cid] ||= new Set()).add(k);
    // … och resten av de nya måtten: verkliga siffror ur T516 där de finns, annars uppskattade
    const tab = (k) => T516[k]?.[cid];
    const pop = b.pop || 1, mig = b.migrants ?? 5, hdi = b.hdi ?? 0.7;
    const lgp = Math.log10(Math.max(300, b.gdppc) / 1000);
    const tg = clampV(18 + 7 * Ge + 5 * Cg + 4 * Ps, 8, 85);
    const penx = clampV(0.32 * (b.old ?? 8) + (P > 20000 ? 1.5 : 0), 0.5, 16);
    const hp = clampV(4 + 0.04 * Ur + 1.4 * Math.log10(Math.max(5, b.density || 50)) + (P < 8000 ? 2 : 0), 3, 20);
    const model516 = {
      turnout: COMPULSORY_VOTE.has(cid) ? 88 : clampV(30 + 5.5 * b.demo_part, 25, 85),
      trustgov: tg,
      trustparl: clampV(tg * 0.85 + 3, 5, 85),
      trustcourt: clampV(28 + 13 * Rl, 8, 90),
      griev: clampV(12 - 8 * Ps, 0, 60),
      protests: 30 * (pop / 1e6) ** 0.7 * clampV(0.4 + 0.3 * (V + 2.5), 0.2, 2) * (1 + unst),
      strikes: tab('strikes') ?? clampV(8 + 14 * Math.max(0, V) + 25 * unst, 1, 250),
      unionrate: tab('unionrate') ?? clampV(6 + 8 * Math.max(0, V) + 4 * Math.max(0, Ge), 2, 60),
      rating: clampV(Math.round(3 - 1.4 * Ge - 0.35 * Ps + (b.debt ?? 60) / 120 - (P > 30000 ? 1 : 0)), 0, 7),
      pensionx: penx,
      socialx: clampV((b.govspend ?? 25) * 0.42 - 0.5 * penx, 1, 30),
      corptax: tab('corptax') ?? 24,
      incometax: tab('incometax') ?? clampV(20 + 6 * lgp, 10, 45),
      vat: tab('vat') ?? 15,
      emig: pop * clampV((0.0042 + 0.008 * Math.max(0, 0.8 - hdi)) * Math.max(1, pop / 1e7) ** -0.25, 0.001, 0.015),
      asylum: Math.max(0, b.netmig || 0) * 0.25 * (hdi > 0.8 ? 1 : 0.3),
      newcitizens: mig / 100 * pop * 0.03 * (hdi > 0.8 ? 1 : 0.4),
      secondgen: mig * 0.5 * (hdi > 0.85 ? 1 : 0.6),
      migemp: clampV((b.emprate ?? 58) * 0.95 + 3 * Rq, 25, 85),
      integ: clampV(50 + 12 * Ge + 6 * Rl - 0.25 * Math.max(0, mig - 15), 10, 95),
      segreg: clampV(25 + 0.6 * mig + 0.3 * G - 6 * Ge, 5, 85),
      xenophobia: clampV(30 - 7 * V + 3 * unst - 0.1 * mig, 3, 75),
      houseprice: hp,
      rentshare: clampV(15 + 1.7 * hp, 10, 60),
      homeless: pop * 0.0012 * (hp / 8) * (1 + Math.max(0, G - 30) / 20) * clampV(1.5 - 0.3 * Ge, 0.6, 2.3),
      foodprice: 100,
      fuelprice: tab('fuelprice') ?? clampV(0.55 + 0.012 * (b.tax ?? 15) + 0.12 * lgp - ((b.oilrent ?? 0) > 8 ? 0.35 : 0), 0.05, 2.4),
      elprice: tab('elprice') ?? clampV(0.05 + 0.04 * lgp, 0.02, 0.4),
      hhdebt: tab('hhdebt') ?? clampV((b.credit ?? 40) * 0.9, 5, 250),
      retireage: tab('retireage') ?? clampV(48 + 0.22 * (b.life ?? 72), 55, 67),
      workweek: clampV(50 - 7 * lgp, 30, 52),
      vacationdays: tab('vacationdays') ?? (P > 30000 ? 20 : 15),
      parentalweeks: tab('parentalweeks') ?? 14,
      cars: clampV(650 * (1 - Math.exp(-P / 25000)), 3, 800),
      commute: clampV(15 + 0.2 * Ur + 0.15 * (b.megacity ?? 0), 15, 70),
      carewait: clampV(10 + 120 / Math.sqrt(Math.max(0.05, (b.beds ?? 2) * (b.doctors ?? 1.5))), 5, 220),
      sickleave: clampV(1.5 + 0.25 * (b.healthx ?? 6) + 0.05 * Math.max(0, (b.old ?? 8) - 15), 0.8, 8),
      mentalill: clampV(11 + 0.03 * Ur + 0.15 * Math.max(0, (b.unemp ?? 6) - 5) - (hdi > 0.85 ? 0.5 : 0), 6, 25),
      pisa: tab('pisa') ?? clampV(250 + 330 * (b.hci ?? 0.55), 300, 560),
    };
    for (const [k, v] of Object.entries(model516)) {
      if (Number.isFinite(b[k])) continue;
      b[k] = v;
      if (k !== 'foodprice' && tab(k) == null) (EST[cid] ||= new Set()).add(k);
    }
    b.minshare = NO_MINWAGE.has(cid) ? 0 : 0.45;
    for (const k of ['exclusion', 'medinc', 'wage', 'minwage', 'housingshort', 'immig']) (EST[cid] ||= new Set()).add(k);
    // räknas fram ur andra mått — uppskattat om källan är det
    if (EST[cid]?.has('gdppcppp')) EST[cid].add('gdpppp');
    (EST[cid] ||= new Set()).add('crimeidx');
    // V5.10: hushållens storlek finns inte för hela världen — uppskattas som
    // vuxna per hem (fler i fattiga länder och på landsbygden) plus deras barn
    if (!Number.isFinite(b.hhsize)) {
      const poor = clampV(Math.log(60000 / P) / Math.log(60), 0, 1);
      b.hhsize = (1.7 + 1.2 * poor + 0.5 * (1 - Ur / 100)) * 100 / Math.max(40, 100 - (b.kids ?? 25));
    }
    for (const k of ['hhsize', 'households', 'pop25', 'doubling']) EST[cid].add(k);
    if (EST[cid].has('urban')) for (const k of ['urbanpop', 'ruralpop', 'bigcity']) EST[cid].add(k);
    if (EST[cid].has('largestcity')) EST[cid].add('bigcity');
  }
  // V5.10: befolkningspyramiden. Ett land som saknar den får medelformen hos de
  // 8 länder som ligger närmast i BNP per capita (märks som uppskattad).
  PYR = {};
  const sum = (a, from = 0, to = a.length) => { let s = 0; for (let i = from; i < to; i++) s += a[i]; return s; };
  const haveP = [];
  for (const cid of ids) {
    const r = raw[cid] || {};
    const m = PYR_KEYS.map((g) => r['pm' + g]), f = PYR_KEYS.map((g) => r['pf' + g]);
    if (m.every((x) => x >= 0) && f.every((x) => x >= 0) && sum(m) > 0 && sum(f) > 0) { PYR[cid] = { m, f }; haveP.push(cid); }
  }
  for (const cid of ids) {
    if (PYR[cid] || !haveP.length) continue;
    const l = lg(cid);
    const near = haveP.map((c) => ({ c, d: Math.abs(lg(c) - l) })).sort((p, q) => p.d - q.d).slice(0, 8);
    const avg = (sex) => PYR_KEYS.map((_, i) => near.reduce((s, x) => s + PYR[x.c][sex][i], 0) / near.length);
    PYR[cid] = { m: avg('m'), f: avg('f') };
    for (const k of PYR_DERIVED) (EST[cid] ||= new Set()).add(k);
  }
  for (const p of Object.values(PYR)) {
    const sm = sum(p.m), sf = sum(p.f);
    p.m = p.m.map((x) => x * 100 / sm);
    p.f = p.f.map((x) => x * 100 / sf);
    p.km = sum(p.m, 0, PYR_KIDS); p.om = sum(p.m, PYR_OLD);
    p.kf = sum(p.f, 0, PYR_KIDS); p.of = sum(p.f, PYR_OLD);
  }
  // Brottslighet jämförs med medianlandet i världen
  CRIME_MED = {};
  for (const k of CRIME_KEYS) CRIME_MED[k] = median(ids.map((c) => BASE[c][k]).filter((x) => x > 0)) || 1;
  LIVE = facts;
}

export function hasIndicatorData() { return Object.keys(BASE).length > 0; }
export function isEstimated(cid, key) { return !!EST[cid]?.has(key); }
export function baseOf(cid) { return BASE[cid] || null; }

// ---------- ett lands värden givet nationsvärdena T (stat-id -> värde) ----------
function effect(fx, T) {
  let e = 0;
  for (const [k, w] of Object.entries(fx || {})) e += w * (T?.[k] || 0);
  return e / 100;
}

const clampV = (v, lo, hi) => Math.max(lo ?? -Infinity, Math.min(hi ?? Infinity, v));

// FN:s HDI-formel (förenklad: medelutbildningsår, BNP per capita som inkomst)
function hdiCalc(life, years, gdppc) {
  const le = clampV((life - 20) / 65, 0.01, 1);
  const ed = clampV(years / 15, 0.01, 1);
  const inc = clampV((Math.log(Math.max(100, gdppc)) - Math.log(100)) / (Math.log(75000) - Math.log(100)), 0.01, 1);
  return Math.cbrt(le * ed * inc);
}

// T0 = landets nationsvärden i STARTLÄGET (dess egna lagar och verkliga ideologi).
// Det verkliga datat innehåller redan landets politik, så bara SKILLNADEN mot
// startläget får flytta måtten — annars räknas t.ex. Sveriges välfärd två gånger.
function minus(T, T0) {
  if (!T0) return T || {};
  const D = {};
  for (const k in T0) D[k] = (T?.[k] || 0) - (T0[k] || 0);
  if (T) for (const k in T) if (!(k in D)) D[k] = T[k] || 0;
  return D;
}

// V5.8: måtten med mode och deras fx som listor, så att de inte packas upp
// på nytt för varje land varje gång (countryIndicators körs för hela världen)
// V5.10: fx som två raka listor (nycklar + vikter) — snabbare att loopa, samma summa i samma ordning
const MODE_LIST = INDICATORS.filter((d) => d.mode)
  .map((d) => ({ id: d.id, mul: d.mode === 'mul', fk: Object.keys(d.fx || {}), fw: Object.values(d.fx || {}), min: d.min, max: d.max }));
// V5.10: hur varje mått räknas ihop över ett rike (0 = summa, 1 = störst, 2 = vägt efter BNP, 3 = efter befolkning)
const AGG_LIST = INDICATORS.filter((d) => d.agg !== 'derived')
  .map((d) => ({ id: d.id, how: d.agg === 'sum' ? 0 : d.agg === 'max' ? 1 : d.agg === 'gdp' ? 2 : 3 }));
const lawFxCache = new Map();   // V5.10: lag → (alternativ → lista), utan att bygga en sträng per uppslag
function lawFxOf(cat, opt) {
  let byOpt = lawFxCache.get(cat);
  if (!byOpt) lawFxCache.set(cat, (byOpt = new Map()));
  let list = byOpt.get(opt);
  if (!list) { list = Object.entries(LAW_EFFECTS[cat]?.[opt] || {}); byOpt.set(opt, list); }
  return list;
}

// V5.8: mått som hänger ihop med andra mått följer med dem (efter lagarna, så
// att t.ex. hårdare straff → fler fångar → fullare fängelser). I startläget är
// alla kvoter 1, så de verkliga värdena visas oförändrade.
function followers(v, b, pop) {
  // startvärdet så som det visas (ett verkligt värde utanför måttets gränser klipps)
  const b0 = (id) => (IND[id] && Number.isFinite(b[id]) ? clampV(b[id], IND[id].min, IND[id].max) : b[id]);
  const ratio = (id) => { const z = b0(id); return z > 0 && v[id] > 0 ? v[id] / z : 1; };
  const set = (id, x) => {
    if (!Number.isFinite(v[id]) || !Number.isFinite(x)) return;
    const d = IND[id];
    v[id] = d ? clampV(x, d.min, d.max) : x;
  };
  const popR = b.pop > 0 ? pop / b.pop : 1;
  // arbete: kvinnorna är halva arbetskraften; sysselsatta = arbetskraft − arbetslösa
  set('lfpr', v.lfpr + ((v.femlabor ?? b0('femlabor')) - b0('femlabor')) / 2);
  const empNow = v.lfpr * (1 - (v.unemp ?? b0('unemp')) / 100), empBase = b0('lfpr') * (1 - b0('unemp') / 100);
  if (empBase > 0) set('emprate', v.emprate * empNow / empBase);
  set('empserv', v.empserv + (b0('empagri') - v.empagri) + (b0('empind') - v.empind));
  // ekonomi
  const gdpR = ratio('gdppc');
  set('gdppcppp', v.gdppcppp * gdpR);
  set('productivity', v.productivity * gdpR);
  if (Number.isFinite(v.gdppcppp)) v.gdpppp = v.gdppcppp * pop;
  set('tourrcpt', v.tourrcpt * ratio('tourists'));
  set('interestpay', v.interestpay * ratio('debt'));
  // befolkningen växer: totaler upp, per invånare ned
  set('co2total', v.co2total * ratio('co2') * popR);
  set('methane', v.methane * popR);
  set('outofschool', v.outofschool * popR);
  set('cerealprod', v.cerealprod * ratio('cerealyield') * ratio('agland'));
  set('arable', v.arable * ratio('agland') / popR);
  set('freshwater', v.freshwater / popR);
  set('airdeath', v.airdeath * ratio('pm25') ** 0.7);
  set('prisonocc', v.prisonocc * ratio('prisoners'));
  // V5.14: de nya måtten följer sina föräldrar
  set('gnipc', v.gnipc * gdpR);
  set('healthpc', v.healthpc * gdpR * ratio('healthx'));
  set('tourspend', v.tourspend * gdpR * popR);
  set('patentsfor', v.patentsfor * ratio('patents'));
  set('ghg', v.ghg * ratio('co2') * popR);
  set('n2o', v.n2o * ratio('fertilizer') * popR);
  set('neonatal', v.neonatal * ratio('infmort'));
  const du = (v.unemp ?? b0('unemp')) - b0('unemp');
  set('unempfem', v.unempfem + du);
  set('unempmale', v.unempmale + du);
  set('unempedu', v.unempedu + du * 0.6);
  set('litfem', v.litfem + ((v.literacy ?? b0('literacy')) - b0('literacy')));
  // fler barn och pensionärer → tyngre försörjningsbörda
  const dep = (k, o) => (k + o) / Math.max(1, 100 - k - o);
  if (Number.isFinite(v.kids) && Number.isFinite(v.old)) set('dependency', v.dependency * dep(v.kids, v.old) / dep(b0('kids'), b0('old')));
  // V5.10: … liksom barn- och äldreförsörjningen var för sig, och fler barn gör
  // hemmen större. Miljonstäderna växer med städerna.
  if (Number.isFinite(v.kids) && Number.isFinite(v.old)) {
    const w0 = Math.max(1, 100 - b0('kids') - b0('old')), w1 = Math.max(1, 100 - v.kids - v.old);
    set('youngdep', v.youngdep * (v.kids / w1) / (b0('kids') / w0));
    set('olddep', v.olddep * (v.old / w1) / (b0('old') / w0));
    set('hhsize', v.hhsize * Math.max(40, 100 - b0('kids')) / Math.max(40, 100 - v.kids));
  }
  set('megacity', v.megacity * ratio('urban'));
  if (Number.isFinite(v.urban)) {
    v.urbanpop = pop * v.urban / 100;
    v.ruralpop = pop - v.urbanpop;
    if (Number.isFinite(v.largestcity)) v.bigcity = v.urbanpop * v.largestcity / 100;
  }
  if (v.hhsize > 0) v.households = pop / v.hhsize;
  // inkomstskillnaderna följer Gini
  const dg = (v.gini ?? b0('gini')) - b0('gini');
  set('top10', v.top10 + dg * 0.45);
  set('bottom20', v.bottom20 - dg * 0.12);
  // V5.16: de nya måtten följer sina föräldrar
  const d0 = (id) => (Number.isFinite(v[id]) && Number.isFinite(b0(id)) ? v[id] - b0(id) : 0);
  const dVoice = d0('voice');
  set('demo_civ', v.demo_civ + 1.2 * dVoice);
  set('demo_el', v.demo_el + 0.8 * dVoice);
  set('demo_part', v.demo_part + 0.5 * dVoice);
  set('trustcourt', v.trustcourt + 8 * d0('rulelaw'));
  set('trustgov', v.trustgov + 4 * d0('goveff'));
  set('revenue', v.revenue + d0('tax'));
  set('socialx', v.socialx + 0.3 * d0('govspend'));
  if (v.old > 0 && b0('old') > 0) set('pensionx', v.pensionx * v.old / b0('old'));
  const dMig = d0('migrants');
  set('segreg', v.segreg + 0.4 * dMig);
  set('xenophobia', v.xenophobia + 0.4 * dMig);
  set('integ', v.integ - 0.3 * Math.max(0, dMig));
  set('secondgen', v.secondgen + 0.15 * dMig);
  set('migemp', v.migemp + 0.5 * d0('emprate'));
  set('houseprice', v.houseprice * popR ** 1.2 * gdpR ** 0.4);
  set('rentshare', v.rentshare + 1.6 * d0('houseprice'));
  set('homeless', v.homeless * ratio('houseprice') ** 1.3 * Math.max(0.3, 1 + 0.04 * d0('unemp')) * popR);
  set('foodprice', v.foodprice * (1 + Math.max(0, d0('infl')) * 0.01));
  set('carewait', v.carewait * ratio('doctors') ** -0.5 * ratio('beds') ** -0.3 * ratio('old') ** 0.4);
  set('mentalill', v.mentalill + 0.15 * d0('unemp'));
  set('suicide', v.suicide * ratio('mentalill'));
  set('govhealth', v.govhealth + 0.8 * d0('healthx'));
  set('cars', v.cars * gdpR ** 0.6);
  set('strikes', v.strikes * (1 + Math.max(0, d0('unionrate')) / 40));
  for (const k of ['poverty365', 'poverty685', 'natpov']) set(k, v[k] * ratio('poverty') ** 0.6);
  set('fossilelec', v.fossilelec - d0('renewelec') - d0('nuclear'));
  set('commute', v.commute + 0.1 * d0('urban'));
  // Brottslighet: brotten jämförda med medianlandet, vägda ihop (geometriskt medel)
  let s = 0, n = 0;
  for (const k of CRIME_KEYS) {
    const x = v[k], m = CRIME_MED[k];
    if (x > 0 && m > 0) { s += Math.log(x / m); n++; }
  }
  if (n) v.crimeidx = 100 * Math.exp(s / n);
}

// ---------- V5.12: tron ----------
// FAITH = spelarens rike: { cids: Set, steps(cid) → omvändelsestegen, rel = statens tro, chaos 0..1 }
// (sätts av main.js). Bara där — och bara när lagarna räknas — omvänds folket och biter kaoset.
let FAITH = null;
export function setFaith(f) { FAITH = f; }
const FAITH_IDS = FAITH_KEYS.map((k) => 'r_' + k.toLowerCase());

function faithStep(v, b, cid, laws) {
  const mine = !!laws && !!FAITH?.cids?.has(cid);
  const S = mine ? compositionOf(cid, FAITH.steps(cid)) : sharesOf(cid);
  // lagarna har flyttat andelen utan religion; de troende fördelas som i S
  const sec = clampV(v.r_sekular, 0, 100);
  const bel0 = 100 - (S.SEKULAR || 0);
  const k = bel0 > 0 ? (100 - sec) / bel0 : 0;
  for (let i = 0; i < FAITHS.length; i++) v[FAITH_IDS[i]] = (S[FAITHS[i]] || 0) * k;
  v.r_sekular = sec;
  const ch = mine ? FAITH.chaos || 0 : 0;
  if (ch < 0.01) return;
  // religiöst kaos: hatbrott, våld och flykt — och turisterna uteblir
  const mul = (id, f) => { if (Number.isFinite(v[id])) v[id] = clampV(v[id] * f, IND[id]?.min, IND[id]?.max); };
  const add = (id, n) => { if (Number.isFinite(v[id])) v[id] = clampV(v[id] + n, IND[id]?.min, IND[id]?.max); };
  mul('hatecrime', 1 + 4 * ch); mul('homicide', 1 + ch); mul('assault', 1 + 0.8 * ch); mul('vandalism', 1 + 1.5 * ch);
  mul('tourists', 1 - 0.75 * ch); add('feelsafe', -35 * ch); add('polstab', -1.8 * ch); add('gdpgrowth', -4 * ch);
  add('voice', -0.5 * ch);
  v.netmig = (v.netmig || 0) - (LIVE?.[cid]?.p || b.pop) * 0.012 * ch;
}

// laws = landets lagar (för LAW_EFFECTS); null = inga direkta lageffekter
export function countryIndicators(cid, T, T0 = null, laws = null) {
  const b = BASE[cid];
  if (!b) return null;
  const D = minus(T, T0);
  const v = {};
  for (const d of MODE_LIST) {
    const base = b[d.id];
    if (!Number.isFinite(base)) continue;
    let e = 0;
    const fk = d.fk, fw = d.fw;
    for (let i = 0; i < fk.length; i++) e += fw[i] * (D[fk[i]] || 0);
    e /= 100;
    v[d.id] = d.mul ? clampV(base * Math.max(0.05, 1 + e), d.min, d.max) : clampV(base + e, d.min, d.max);
  }
  // nettoinvandringen följer invandringsvärdet: +100 ≈ 0,4 % av folkmängden per år
  v.netmig = (b.netmig || 0) + (LIVE?.[cid]?.p || b.pop) * 0.004 * ((D.immigration || 0) / 100);
  // lagar som slår direkt på ett mått (bara de som skiljer sig från startläget)
  for (const cat in laws || {}) {
    const opt = laws[cat];
    if (opt === DEFAULT_LAW[cat]) continue;
    for (const [id, [op, n, k]] of lawFxOf(cat, opt)) {
      if (!Number.isFinite(v[id])) continue;
      v[id] = op === '+' ? v[id] + n : op === '*' ? v[id] * n : op === '=' ? n : op === '%pop' ? (LIVE?.[cid]?.p || b.pop) * n
        : op === '~' ? v[id] + (n - v[id]) * (k ?? 0.6) : v[id];   // V5.16: '~' drar måttet mot en nivå
      if (IND[id]) v[id] = clampV(v[id], IND[id].min, IND[id].max);
    }
  }
  if (Number.isFinite(v.r_sekular)) faithStep(v, b, cid, laws);   // V5.12
  // V5.7: befolkningen lever — dagens folkmängd i stället för startårets
  const pop = LIVE?.[cid]?.p || b.pop;
  v.pop = pop;
  v.area = b.area;
  v.gdp = v.gdppc * pop;
  if (Number.isFinite(v.labor)) v.labor *= pop / b.pop;
  followers(v, b, pop);
  v.births = (v.birth || 0) / 1000 * pop;
  v.deaths = (v.death || 0) / 1000 * pop;
  // Världsbankens födda, döda och nettoinvandring summerar sällan exakt till
  // landets verkliga tillväxt (oregistrerad utvandring m.m.). Resten läggs till
  // så att startläget växer i verklig takt — och det är detta tal som
  // befolkningen faktiskt ändras med (main.js: tickPopulation).
  const resid = (b.popgrowth || 0) / 100 - ((b.birth || 0) - (b.death || 0)) / 1000 - (b.netmig || 0) / b.pop;
  v.popchange = v.births - v.deaths + (v.netmig || 0) + resid * pop;
  // V5.16: mått som räknas fram ur andra
  if (Number.isFinite(v.demo_civ)) v.polprisoners = pop / 1e6 * 60 * Math.max(0, (4.5 - v.demo_civ) / 4.5) ** 2;
  if (Number.isFinite(v.demo_el)) v.parties = v.demo_el < 0.8 ? 1 : Math.round(clampV(1 + 0.75 * v.demo_el, 1, 12));
  if (Number.isFinite(v.segreg)) v.exclusion = clampV((v.segreg - 15) * 0.12 * Math.sqrt((v.migrants ?? 5) / 10 + 0.1), 0, 30);
  if (Number.isFinite(v.gdppc)) {
    v.medinc = v.gdppc * clampV(0.75 - 0.006 * (v.gini ?? 35), 0.3, 0.6);
    v.wage = 0.065 * v.gdppc * (Math.max(300, v.gdppc) / 30000) ** -0.08;
    const mw = laws?.minimum_wage && laws.minimum_wage !== DEFAULT_LAW.minimum_wage ? MINWAGE_SHARE[laws.minimum_wage] : undefined;
    v.minwage = v.wage * (mw ?? b.minshare ?? 0.45);
  }
  if (Number.isFinite(v.migrants)) v.migstock = v.migrants / 100 * pop;
  if (Number.isFinite(v.emig)) v.immig = Math.max(0, (v.netmig || 0) + v.emig);
  if (v.households > 0 && Number.isFinite(v.houseprice)) {
    v.housingshort = Math.max(0, v.households * (0.01 + 0.004 * (v.houseprice - 5)) * (1 + Math.max(0, v.popchange / pop * 100) * 0.8));
  }
  // HDI: verkligt utgångsvärde × hur mycket delarna rört sig
  const h0 = hdiCalc(b.life, b.schoolyears, b.gdppc);
  v.hdi = clampV((b.hdi || h0) * (hdiCalc(v.life, v.schoolyears, v.gdppc) / h0), 0.2, 1);
  return v;
}

// ---------- V5.10: befolkningspyramiden ----------
// Varje land bidrar med sin LEVANDE befolkning (gånger andelen av landet riket
// äger), delad på män och kvinnor efter Andel kvinnor och fördelad efter landets
// verkliga pyramid. Politiken flyttar den: barngrupperna skalas med hur mycket
// Andel barn ändrats mot startläget, 65+ med Andel över 65, och grupperna däremellan
// tar upp resten — så att summan alltid är befolkningen och andelarna i
// diagrammet är desamma som i statistiken. I startläget är det landets verkliga pyramid.
function pyramidSex(out, shape, K, O, kR, oR, n) {
  let k = K * kR, o = O * oR;
  if (k + o > 92) { const s = 92 / (k + o); k *= s; o *= s; }
  const fk = K > 0 ? k / K : 0, fo = O > 0 ? o / O : 0;
  const fm = (100 - k - o) / Math.max(1e-9, 100 - K - O);
  const u = n / 100;
  for (let g = 0; g < 17; g++) out[g] += shape[g] * (g < PYR_KIDS ? fk : g >= PYR_OLD ? fo : fm) * u;
}

// list = [{ cid, v (countryIndicators), w (andel) }] → antal män/kvinnor per femårsgrupp
function pyramidOf(list) {
  const male = new Array(17).fill(0), female = new Array(17).fill(0);
  let any = false, est = false;
  for (const { cid, v, w } of list) {
    const P = PYR[cid], b = BASE[cid];
    const n = (v?.pop || 0) * w;
    if (!P || !(n > 0)) continue;
    any = true;
    if (EST[cid]?.has('medianage')) est = true;
    // hur långt barnen och pensionärerna flyttats från startläget (1 = oförändrat)
    const rel = (id) => {
      const d = IND[id], z = clampV(b[id], d.min, d.max);
      return z > 0 && v[id] > 0 ? v[id] / z : 1;
    };
    const kR = rel('kids'), oR = rel('old');
    const fem = clampV(Number.isFinite(v.female) ? v.female : 50, 25, 75) / 100;
    pyramidSex(male, P.m, P.km, P.om, kR, oR, n * (1 - fem));
    pyramidSex(female, P.f, P.kf, P.of, kR, oR, n * fem);
  }
  return any ? { male, female, est } : null;
}

// medianålder (linjärt inom femårsgruppen) och åldersmåtten ur en pyramid
function pyramidStats(male, female) {
  const t = male.map((x, g) => x + female[g]);
  let total = 0;
  for (const x of t) total += x;
  let cum = 0, medianage = 0;
  for (let g = 0; g < 17; g++) {
    if (t[g] > 0 && cum + t[g] >= total / 2) { medianage = 5 * g + (g === 16 ? 20 : 5) * (total / 2 - cum) / t[g]; break; }
    cum += t[g];
  }
  let kidsn = 0, oldn = 0;
  for (let g = 0; g < PYR_KIDS; g++) kidsn += t[g];
  for (let g = PYR_OLD; g < 17; g++) oldn += t[g];
  const pct = (x) => (total > 0 ? 100 * x / total : 0);
  return { total, medianage, kidsn, oldn, workage: total - kidsn - oldn, youth: pct(t[3] + t[4]), oldest: pct(t[16]) };
}

// Rikets befolkningspyramid (ritas i STATISTIK). Samma indata som realmIndicators;
// T = null betyder startläget (landens verkliga pyramider, ingen ändrad politik).
// → { groups, male[17], female[17], total, medianAge, estimated } i antal människor,
// eller null om inget land i riket har data.
export function realmPyramid(parts, T, t0Of = null, laws = null) {
  const list = [];
  for (const { cid, share = 1 } of parts || []) {
    const T0 = t0Of?.(cid) || null;
    const v = countryIndicators(cid, T ?? T0, T0, laws);
    if (v) list.push({ cid, v, w: share });
  }
  const p = pyramidOf(list);
  if (!p) return null;
  const s = pyramidStats(p.male, p.female);
  return { groups: PYRAMID_GROUPS, male: p.male, female: p.female, total: s.total, medianAge: s.medianage, estimated: p.est };
}

// ---------- ett rike: [{cid, share}] + nationsvärden → alla mått ----------
// extra = { soldiers, reserve } från spelet (arméerna finns inte i datat)
// t0Of(cid) = landets startläge (se minus ovan)
// laws = rikets lagar. noPolicy = landens verkliga värden utan någon ändrad
// politik (det spelet utgår från innan lagarna hunnit verka).
export function realmIndicators(parts, T, extra = {}, t0Of = null, laws = null, noPolicy = false) {
  const per = [];
  for (const { cid, share = 1 } of parts) {
    const T0 = t0Of?.(cid) || null;
    const v = noPolicy ? countryIndicators(cid, T0, T0, null) : countryIndicators(cid, T, T0, laws);
    if (v) per.push({ cid, v, w: share });
  }
  if (!per.length) return null;
  const out = {};
  let pop = 0, gdp = 0;
  for (const { v, w } of per) { pop += v.pop * w; gdp += v.gdp * w; }
  for (const { id, how } of AGG_LIST) {
    let num = 0, den = 0;
    for (const { v, w } of per) {
      const x = v[id];
      if (!Number.isFinite(x)) continue;
      if (how === 0) { num += x * w; den = 1; }
      else if (how === 1) { num = Math.max(num, x); den = 1; }   // V5.8: t.ex. hotade arter
      else {
        const weight = how === 2 ? v.gdp * w : v.pop * w;
        num += x * weight; den += weight;
      }
    }
    if (den) out[id] = num / den;
  }
  out.pop = pop;
  out.gdp = gdp;
  out.gdppc = pop ? gdp / pop : 0;
  if (Number.isFinite(out.gdpppp)) out.gdppcppp = pop ? out.gdpppp / pop : 0;   // V5.8
  out.density = out.area ? pop / out.area : 0;
  out.taxrev = gdp * (out.tax || 0) / 100;
  out.milbudget = gdp * (out.milx || 0) / 100;
  out.tradebal = (out.exports || 0) - (out.imports || 0);
  // V5.10: åldrarna ur befolkningspyramiden, hushållen, och befolkningen framåt
  const pyr = pyramidOf(per);
  if (pyr) {
    const ps = pyramidStats(pyr.male, pyr.female);
    for (const k of PYR_DERIVED) out[k] = ps[k];
  }
  if (out.households > 0) out.hhsize = pop / out.households;
  // V5.12: tron i riket — troende, mångfald, statens tro och spänningarna
  if (Number.isFinite(out.r_sekular)) {
    const bel = Math.max(0, 100 - out.r_sekular);
    let mx = 0, h = 0;
    for (let i = 0; i < FAITHS.length; i++) {
      const x = out[FAITH_IDS[i]] || 0;
      if (x > mx) mx = x;
      if (bel > 0) h += (x / bel) ** 2;
    }
    out.believers = bel;
    out.mainfaith = mx;
    out.reldiv = bel > 0 ? clampV(100 * (1 - h), 0, 100) : 0;
    const mine = !noPolicy && laws && FAITH && parts.some((p) => FAITH.cids.has(p.cid));
    const rel = mine ? FAITH.rel : null;
    if (rel && bel > 0) out.statefaith = 100 * (out['r_' + rel.toLowerCase()] || 0) / bel;
    const ch = mine ? FAITH.chaos || 0 : 0;
    out.reltension = clampV(out.reldiv / 100 * 3.5 + ch * 6.5 + 0.5 * Math.log10(Math.max(1, out.hatecrime || 1)), 0, 10);
  }
  const growth = pop > 0 ? (out.popchange || 0) / pop : 0;
  out.doubling = 100 * growth;
  out.pop25 = pop * Math.max(0, 1 + growth) ** 25;
  let hdiW = 0, hdiN = 0;
  for (const { v, w } of per) { hdiN += v.hdi * v.pop * w; hdiW += v.pop * w; }
  out.hdi = hdiW ? hdiN / hdiW : 0;
  // lycka (0–10): välstånd, utveckling och frihet + hur livet känns just nu
  const lyck = 3 + 2.5 * ((out.hdi - 0.4) / 0.55) + 0.4 * (out.voice || 0) + 0.6 * Math.log10(Math.max(100, out.gdppc) / 1000);
  const D = noPolicy ? {} : minus(T, t0Of?.(parts[0]?.cid) || null);
  out.happiness = clampV(lyck + effect(IND.happiness.fx, D), 1, 9.5);
  out.pressfree = clampV(52 + (out.voice || 0) * 18 + effect({ freedom: 10, statepower: -6 }, D), 0, 100);
  out.soldiers = extra.soldiers ?? 0;
  out.reserve = extra.reserve ?? 0;
  if (Number.isFinite(extra.treasury)) out.treasury = extra.treasury;   // V5.16: statskassan i dollar
  return refreshDerived(out);
}

// V5.16: det som räknas fram ur andra mått för ett helt rike — körs också igen i
// main.js efter att trögheten och banken har ändrat delarna (demokratiindexet är
// medlet av sina fem delar, statsskulden i dollar följer BNP osv.)
export function refreshDerived(out) {
  if (!out) return out;
  const pop = out.pop || 0;
  if (Number.isFinite(out.gdppc) && pop) out.gdp = out.gdppc * pop;
  const gdp = out.gdp || 0;
  if (Number.isFinite(out.gdppcppp) && pop) out.gdpppp = out.gdppcppp * pop;
  out.taxrev = gdp * (out.tax || 0) / 100;
  out.milbudget = gdp * (out.milx || 0) / 100;
  out.tradebal = (out.exports || 0) - (out.imports || 0);
  if (DEMO_SUBS.every((k) => Number.isFinite(out[k]))) {
    out.demo = DEMO_SUBS.reduce((s, k) => s + out[k], 0) / 5;
    out.regime = regimeOf(out.demo).id;
  }
  if (Number.isFinite(out.debt)) { out.debtusd = gdp * out.debt / 100; out.debtpc = pop ? out.debtusd / pop : 0; }
  if (Number.isFinite(out.budgetbal)) out.deficitusd = gdp * out.budgetbal / 100;
  if (Number.isFinite(out.rating)) {
    const R = RATINGS[clampV(Math.round(out.rating), 0, RATINGS.length - 1)];
    out.bondrate = R.rate + Math.max(0, (out.infl || 0) - 2) * 0.5;
    if (Number.isFinite(out.debtusd)) out.interestusd = out.debtusd * out.bondrate / 100;
  }
  return out;
}

// En procentenhet, ett år i livslängd eller 10 % mer pengar är ungefär lika
// märkbart — så jämförs ändringar i olika enheter rättvist.
function noticeable(fmt, a, b) {
  const d = Math.abs(b - a);
  switch (fmt) {
    case 'pct': case 'pctgdp': case 'pp': return d;
    case 'wgi': return d / 0.25;
    case 'years': return d;
    case 'idx3': return d / 0.01;
    case 'score10': return d / 0.25;
    case 'score100': return d / 2.5;
    case 'spct': return d;              // V5.8
    case 'score5': return d / 0.125;
    case 'index': return d / 2.5;
    case 'dbl': return d * 0.5;         // V5.10: tillväxt i % — halv vikt, Befolkningstillväxt visar samma sak
    case 'regime': return d * 6;        // V5.16: ett steg i styrelseskick är stort
    case 'rating': return d * 3;
    case 'hours': return d / 2;
    case 'weeks': return d / 4;
    default: return (d / Math.max(Math.abs(a), 1e-9)) * 10;
  }
}

// Vilka mått ändras mest mellan två lägen? (för förhandsvisningen av en lag)
export function biggestChanges(before, after, n = 4) {
  const rows = [];
  for (const d of INDICATORS) {
    const a = before?.[d.id], b = after?.[d.id];
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) continue;
    // hur märkbar är ändringen? 1 = ungefär "en tydlig skillnad" i måttets egen skala
    const rel = noticeable(d.fmt, a, b);
    if (rel < 0.1) continue;
    const good = d.better === 'high' ? b > a : d.better === 'low' ? b < a : null;
    rows.push({ id: d.id, name: d.name, from: a, to: b, rel, good });
  }
  return rows.sort((x, y) => y.rel - x.rel).slice(0, n);
}

// ---------- rankningar ----------
export const RANKINGS = [
  { id: 'gdp', name: 'BNP' },
  { id: 'gdppc', name: 'BNP PER CAPITA' },
  { id: 'hdi', name: 'HDI' },
  { id: 'pop', name: 'BEFOLKNING' },
  { id: 'soldiers', name: 'STÖRSTA ARMÉER' },
  { id: 'life', name: 'MEDELLIVSLÄNGD' },
  { id: 'happiness', name: 'LYCKLIGAST' },
  { id: 'demo', name: 'DEMOKRATI' },   // V5.16: The Economists demokratiindex
  { id: 'corruptgov', name: 'MINST KORRUPTION' },
  { id: 'homicide', name: 'TRYGGAST' },
  { id: 'rnd', name: 'FORSKNING' },
  { id: 'co2', name: 'MINST UTSLÄPP' },
  { id: 'milbudget', name: 'FÖRSVARSBUDGET' },
  { id: 'area', name: 'STÖRST YTA' },
  { id: 'feelsafe', name: 'TRYGGAST ATT GÅ UT' },
  { id: 'popchange', name: 'SNABBAST VÄXANDE' },
  { id: 'researchers', name: 'FLEST FORSKARE' },
  { id: 'lifefem', name: 'LÄNGST LIV (KVINNOR)' },
  // V5.8
  { id: 'crimeidx', name: 'LÄGST BROTTSLIGHET' },
  { id: 'assault', name: 'MINST MISSHANDEL' },
  { id: 'bribery', name: 'MINST MUTOR' },
  { id: 'clearance', name: 'FLEST UPPKLARADE BROTT' },
  { id: 'gdppcppp', name: 'KÖPKRAFT PER INVÅNARE' },
  { id: 'renewelec', name: 'MEST FÖRNYBAR EL' },
  { id: 'measles', name: 'HÖGST VACCINATION' },
  { id: 'matmort', name: 'LÄGST MÖDRADÖDLIGHET' },
  { id: 'lpi', name: 'BÄST LOGISTIK' },
  { id: 'cerealprod', name: 'STÖRST SKÖRD' },
  // V5.10
  { id: 'medianage', name: 'ÄLDST BEFOLKNING' },
  { id: 'youngest', name: 'YNGST BEFOLKNING' },
  { id: 'fert', name: 'FLEST BARN PER KVINNA' },
  { id: 'bigcity', name: 'STÖRST STAD' },
  { id: 'pop25', name: 'STÖRST OM 25 ÅR' },
  // V5.16
  { id: 'trustgov', name: 'MEST FÖRTROENDE FÖR REGERINGEN' },
  { id: 'pisa', name: 'BÄST SKOLA' },
  { id: 'carewait', name: 'KORTAST VÅRDKÖ' },
  { id: 'vacationdays', name: 'LÄNGST SEMESTER' },
  { id: 'houseprice', name: 'BILLIGAST BOSTÄDER' },
  { id: 'medinc', name: 'HÖGST MEDIANINKOMST' },
  { id: 'integ', name: 'BÄST INTEGRATION' },
  { id: 'budgetbal', name: 'STARKAST STATSFINANSER' },
];

// V5.10: rankningar som läser ett annat mått åt andra hållet (yngst = lägst medianålder)
const RANK_ALIAS = { youngest: { of: 'medianage', better: 'low' } };

// rows = [{ key, name, mine, ind }] → sorterade efter måttet (bäst först)
export function rankBy(rows, id) {
  const alias = RANK_ALIAS[id];
  const key = alias ? alias.of : id;
  const low = (alias ? alias.better : IND[id]?.better) === 'low';
  return rows.filter((r) => Number.isFinite(r.ind?.[key]))
    .sort((a, b) => (low ? a.ind[key] - b.ind[key] : b.ind[key] - a.ind[key]))
    .map((r, i) => ({ ...r, place: i + 1, value: r.ind[key] }));
}
