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

export const IND_GROUPS = [
  { id: 'eko', name: 'EKONOMI', icon: '\u{1F4B0}' },
  { id: 'arb', name: 'ARBETE', icon: '\u{1F477}' },
  { id: 'hal', name: 'VÄLFÄRD & HÄLSA', icon: '\u{1F3E5}' },
  { id: 'jor', name: 'JORDBRUK & MAT', icon: '\u{1F33E}' },
  { id: 'bef', name: 'BEFOLKNING', icon: '\u{1F465}' },
  { id: 'dem', name: 'DEMOGRAFI & FAMILJ', icon: '\u{1F46A}' },
  { id: 'kun', name: 'KUNSKAP & TEKNIK', icon: '\u{1F4DA}' },
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
  { id: 'debt', name: 'Statsskuld', group: 'eko', fmt: 'pctgdp', better: 'low', mode: 'add', min: 0, max: 300, agg: 'gdp',
    fx: { welfare: 15, income: -20, milpower: 8, stability: -5 }, desc: 'Statens skulder i procent av BNP' },
  { id: 'tax', name: 'Skatteintäkter', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 3, max: 60, agg: 'gdp',
    fx: { income: 12, welfare: 6, gdp: -3 }, desc: 'Skatter i procent av BNP' },
  { id: 'taxrev', name: 'Statens skatteintäkter', group: 'eko', fmt: 'usdbig', better: 'high', agg: 'derived', desc: 'Skatter som staten tar in på ett år' },
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
  { id: 'govspend', name: 'Statens utgifter', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 8, max: 70, agg: 'gdp',
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
  { id: 'netmig', name: 'Nettoinvandring per år', group: 'bef', fmt: 'scount', better: null, agg: 'sum', desc: 'Invandrare minus utvandrare på ett år' },
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
  { id: 'interestpay', name: 'Räntekostnader', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: 0, max: 90,
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
  { id: 'migrants', name: 'Födda utomlands', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: 0, max: 90,
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
// räknas per invånare — uppskattas som andel och skalas sedan med folkmängden
const PER_CAPITA_SUMS = { tourists: 1, airpax: 1, patents: 1, netmig: 1, articles: 1, armsexp: 1, labor: 1,
  tourrcpt: 1, listed: 1, cerealprod: 1, fishcatch: 1, aquaculture: 1, outofschool: 1, co2total: 1, methane: 1,
  armsimp: 1, airfreight: 1 };
// V5.8: saknas värdet betyder det (nästan alltid) noll: inga malariamyggor, ett
// givarland som inte får bistånd, ingen järnväg, eller — i ett fattigare land —
// ingen börs. true = säkert noll, en funktion = noll bara om villkoret gäller
// (märks då som uppskattat), annars vanlig uppskattning.
// 'wb' = noll om Världsbanken har landet men inte måttet (V5.10: ett land utan
// miljonstad saknas i listan) — ett land som helt saknas där uppskattas i stället.
const ZERO_IF_MISSING = { malaria: true, aid: true, rail: true, listed: (b) => b.gdppc < 12000, megacity: 'wb' };
// järnvägsnät som Världsbanken saknar (CIA World Factbook, avrundat — märks ~)
const RAIL_KM = { '484': 20800, '036': 33000, '170': 2100, '024': 2900, '068': 4000, '516': 2600, '324': 1100,
  '400': 500, '430': 430, '768': 570, '418': 420, '728': 250, '232': 300 };
// går inte att gissa (landet saknar kust, eller handeln med energi följer inte välståndet)
const NO_IMPUTE = { marine: 1, ports: 1, energyimp: 1 };
// brotten som vägs ihop till Brottslighet (100 = ett typiskt land i världen)
const CRIME_KEYS = ['homicide', 'assault', 'threats', 'robbery', 'burglary', 'theft', 'cartheft', 'vandalism',
  'kidnapping', 'extortion', 'fraud', 'gangs'];
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
  const robust = new Set([...RAW_KEYS_58, ...RAW_KEYS_510]);
  for (const key of [...RAW_KEYS, ...RAW_KEYS_58, ...RAW_KEYS_510]) {
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
    for (const [k, v] of Object.entries(model2)) {
      if (Number.isFinite(b[k])) continue;
      b[k] = v;
      (EST[cid] ||= new Set()).add(k);
    }
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
  // Brottslighet: brotten jämförda med medianlandet, vägda ihop (geometriskt medel)
  let s = 0, n = 0;
  for (const k of CRIME_KEYS) {
    const x = v[k], m = CRIME_MED[k];
    if (x > 0 && m > 0) { s += Math.log(x / m); n++; }
  }
  if (n) v.crimeidx = 100 * Math.exp(s / n);
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
    for (const [id, [op, n]] of lawFxOf(cat, opt)) {
      if (!Number.isFinite(v[id])) continue;
      v[id] = op === '+' ? v[id] + n : op === '*' ? v[id] * n : op === '=' ? n : op === '%pop' ? (LIVE?.[cid]?.p || b.pop) * n : v[id];
      if (IND[id]) v[id] = clampV(v[id], IND[id].min, IND[id].max);
    }
  }
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
  { id: 'voice', name: 'DEMOKRATI' },
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
