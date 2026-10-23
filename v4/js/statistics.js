// IMPERIUM V5.6 — STATISTIK. 74 verkliga mått per land och rike.
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

export const IND_GROUPS = [
  { id: 'eko', name: 'EKONOMI', icon: '\u{1F4B0}' },
  { id: 'hal', name: 'VÄLFÄRD & HÄLSA', icon: '\u{1F3E5}' },
  { id: 'bef', name: 'BEFOLKNING', icon: '\u{1F465}' },
  { id: 'kun', name: 'KUNSKAP & TEKNIK', icon: '\u{1F4DA}' },
  { id: 'sam', name: 'SAMHÄLLE & RÄTT', icon: '\u{2696}\u{FE0F}' },
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
  { id: 'unemp', name: 'Arbetslöshet', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: 0.2, max: 60,
    fx: { gdp: -4, factory: -4, welfare: 1, immigration: 1.5, corruption: 1.5, unrest: 2 }, desc: 'Andel av arbetskraften utan jobb' },
  { id: 'youthunemp', name: 'Ungdomsarbetslöshet', group: 'eko', fmt: 'pct', better: 'low', mode: 'add', min: 0.5, max: 80,
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
  { id: 'agri', name: 'Jordbruk', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 0.1, max: 70, agg: 'gdp',
    fx: { factory: -3, gdp: -3 }, desc: 'Jordbrukets del av ekonomin' },
  { id: 'manuf', name: 'Industri', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 1, max: 50, agg: 'gdp',
    fx: { factory: 8 }, desc: 'Tillverkningsindustrins del av ekonomin' },
  { id: 'services', name: 'Tjänster', group: 'eko', fmt: 'pctgdp', better: null, mode: 'add', min: 10, max: 90, agg: 'gdp',
    fx: { gdp: 4, factory: -6, research: 2 }, desc: 'Tjänstesektorns del av ekonomin' },
  { id: 'tourists', name: 'Turister per år', group: 'eko', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { safety: 0.3, qol: 0.2, freedom: 0.2, unrest: -0.4 }, desc: 'Utländska besökare på ett år' },
  { id: 'airpax', name: 'Flygresenärer per år', group: 'eko', fmt: 'count', better: 'high', mode: 'mul', agg: 'sum',
    fx: { gdp: 0.3, freedom: 0.1, qol: 0.1 }, desc: 'Passagerare med landets flygbolag' },

  // ---------- VÄLFÄRD & HÄLSA ----------
  { id: 'hdi', name: 'HDI', group: 'hal', fmt: 'idx3', better: 'high', agg: 'derived', desc: 'FN:s mått på mänsklig utveckling: livslängd, utbildning och inkomst' },
  { id: 'life', name: 'Medellivslängd', group: 'hal', fmt: 'years', better: 'high', mode: 'add', min: 40, max: 90,
    fx: { qol: 3, welfare: 2.5, hdi: 2, safety: 1, unrest: -1.5 }, desc: 'Hur länge en nyfödd kan väntas leva' },
  { id: 'happiness', name: 'Lycka', group: 'hal', fmt: 'score10', better: 'high', agg: 'derived',
    fx: { qol: 1.2, approval: 1, freedom: 0.8, unrest: -1, safety: 0.5 }, desc: 'Hur nöjda människor är med sina liv (0–10)' },
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
  { id: 'elec', name: 'Tillgång till el', group: 'hal', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 100,
    fx: { hdi: 6, factory: 4 }, desc: 'Andel av befolkningen som har el' },
  { id: 'poverty', name: 'Extrem fattigdom', group: 'hal', fmt: 'pct', better: 'low', mode: 'mul',
    fx: { welfare: -0.5, gdp: -0.4, corruption: 0.3, unrest: 0.2 }, desc: 'Andel som lever på under 2,15 $ om dagen' },
  { id: 'gini', name: 'Inkomstskillnader (Gini)', group: 'hal', fmt: 'num1', better: 'low', mode: 'add', min: 20, max: 70,
    fx: { welfare: -10, statepower: -2, gdp: 2, corruption: 4 }, desc: '0 = alla tjänar lika, 100 = en person tjänar allt' },
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
  { id: 'fert', name: 'Barn per kvinna', group: 'bef', fmt: 'num2', better: null, mode: 'add', min: 0.8, max: 7.5,
    fx: { hdi: -0.8, welfare: 0.3, ideopower: 0.15 }, desc: 'Hur många barn en kvinna föder i genomsnitt' },
  { id: 'kids', name: 'Andel barn (0–14)', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: 8, max: 55,
    fx: { hdi: -4 }, desc: 'Andel av befolkningen som är barn' },
  { id: 'old', name: 'Andel över 65', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: 1, max: 35,
    fx: { hdi: 4, welfare: 1 }, desc: 'Andel av befolkningen som är pensionärer' },
  { id: 'urban', name: 'Andel i städer', group: 'bef', fmt: 'pct', better: null, mode: 'add', min: 10, max: 100,
    fx: { factory: 6, gdp: 4 }, desc: 'Andel som bor i städer' },
  { id: 'netmig', name: 'Nettoinvandring per år', group: 'bef', fmt: 'scount', better: null, agg: 'sum', desc: 'Invandrare minus utvandrare på ett år' },
  { id: 'area', name: 'Yta', group: 'bef', fmt: 'km2', better: 'high', agg: 'sum', desc: 'Rikets landyta' },
  { id: 'density', name: 'Befolkningstäthet', group: 'bef', fmt: 'perkm2', better: null, agg: 'derived', desc: 'Invånare per kvadratkilometer' },

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
  { id: 'internet', name: 'Internetanvändare', group: 'kun', fmt: 'pct', better: 'high', mode: 'add', min: 1, max: 100,
    fx: { research: 10, freedom: 10, gdp: 8, statepower: -3 }, desc: 'Andel som använder internet' },
  { id: 'mobile', name: 'Mobilabonnemang', group: 'kun', fmt: 'per100', better: 'high', mode: 'add', min: 1, max: 200,
    fx: { gdp: 20, freedom: 5 }, desc: 'Mobilabonnemang per 100 invånare' },

  // ---------- SAMHÄLLE & RÄTT ----------
  { id: 'homicide', name: 'Mord', group: 'sam', fmt: 'per100k', better: 'low', mode: 'mul',
    fx: { safety: -0.6, unrest: 0.4, corruption: 0.3, welfare: -0.15 }, desc: 'Mord per 100 000 invånare och år' },
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
  { id: 'femlabor', name: 'Kvinnor i arbete', group: 'sam', fmt: 'pct', better: 'high', mode: 'add', min: 5, max: 90,
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
  { id: 'milbudget', name: 'Försvarsbudget', group: 'fvr', fmt: 'usdbig', better: 'high', agg: 'derived', desc: 'Försvarets pengar på ett år' },
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
  firearms: { free: { homicide: ['*', 1.8] }, licensed: { homicide: ['*', 1.2] }, ban: { homicide: ['*', 0.85] }, stateonly: { homicide: ['*', 0.75] } },
  drugs: { legal: { homicide: ['*', 0.85] }, decriminalized: { homicide: ['*', 0.95] }, war: { homicide: ['*', 1.3] } },
  punishments: { minimal: { homicide: ['*', 1.15] }, harsh: { homicide: ['*', 0.93] }, veryharsh: { homicide: ['*', 0.88] } },
  surveillance: { none: { voice: ['+', 0.2] }, mass: { voice: ['+', -0.4], homicide: ['*', 0.9] }, total: { voice: ['+', -0.9], homicide: ['*', 0.85] } },
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
    traditional: { femlabor: ['+', -12], womenparl: ['+', -8], gii: ['+', 0.1], fert: ['+', 0.4] },
    restricted: { femlabor: ['+', -30], womenparl: ['=', 0], gii: ['+', 0.3], fert: ['+', 0.9], literacy: ['+', -8] },
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
  popgrowth: { none: { fert: ['+', -0.4] }, discouraged: { fert: ['+', -0.2] }, encouraged: { fert: ['+', 0.3] }, mandatory: { fert: ['+', 0.8], birth: ['+', 4] } },
  workhours: { minimum: { unemp: ['+', 1] }, extended: { unemp: ['+', -0.5] }, maximum: { unemp: ['+', -1], life: ['+', -1] } },
  immigration: {
    noborders: { netmig: ['*', 3], popgrowth: ['+', 0.8] }, open: { netmig: ['*', 2], popgrowth: ['+', 0.4] },
    humanitarian: { netmig: ['*', 1.8], popgrowth: ['+', 0.35] }, relaxed: { netmig: ['*', 1.4] },
    managed: { netmig: ['*', 0.7] }, points: { netmig: ['*', 0.6] }, restricted: { netmig: ['*', 0.35], popgrowth: ['+', -0.2] },
    closed: { netmig: ['=', 0], popgrowth: ['+', -0.3] }, deportation: { netmig: ['%pop', -0.006], popgrowth: ['+', -0.8] },
  },
};

// startläget per lagkategori (det verkliga datat har redan landets politik)
const DEFAULT_LAW = Object.fromEntries(Object.entries(LAWS).map(([cat, L]) =>
  [cat, (L.options.find((o) => o.default) || L.options[Math.floor(L.options.length / 2)]).id]));

// ---------- formatering ----------
const dec = (v, n) => (Math.round(v * 10 ** n) / 10 ** n).toFixed(n).replace('.', ',');
export function fmtInd(id, v) {
  if (v == null || !Number.isFinite(v)) return '–';
  switch (IND[id]?.fmt) {
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
    case 'ugm3': return `${dec(v, 1)} UG/M3`;
    case 'liters': return `${dec(v, 1)} LITER`;
    default: return dec(v, 1);
  }
}

// ---------- data + uppskattning av det som saknas ----------
let BASE = {};          // cid -> { nyckel: värde }
let EST = {};           // cid -> Set(nycklar som är uppskattade)
const RAW_KEYS = ['gdppc', 'gdpgrowth', 'unemp', 'youthunemp', 'infl', 'lendrate', 'debt', 'tax', 'exports', 'imports',
  'fdi', 'hitech', 'agri', 'manuf', 'services', 'tourists', 'airpax', 'life', 'infmort', 'u5mort', 'doctors', 'beds',
  'healthx', 'water', 'elec', 'poverty', 'gini', 'smoking', 'alcohol', 'popgrowth', 'birth', 'death', 'fert', 'kids',
  'old', 'urban', 'netmig', 'area', 'literacy', 'schoolyears', 'tertiary', 'edux', 'rnd', 'patents', 'internet',
  'mobile', 'homicide', 'voice', 'corruptgov', 'rulelaw', 'polstab', 'goveff', 'regq', 'femlabor', 'womenparl', 'gii',
  'co2', 'pm25', 'renew', 'forest', 'protected', 'milx', 'hdi'];
// räknas per invånare — uppskattas som andel och skalas sedan med folkmängden
const PER_CAPITA_SUMS = { tourists: 1, airpax: 1, patents: 1, netmig: 1 };

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
    BASE[cid] = { ...(raw[cid] || {}), ...(OVERRIDES[cid] || {}) };
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
  for (const key of RAW_KEYS) {
    const pc = PER_CAPITA_SUMS[key];
    const have = ids.filter((c) => Number.isFinite(BASE[c][key]))
      .map((c) => ({ c, l: lg(c), v: pc ? BASE[c][key] / popOf(c) : BASE[c][key] }));
    if (!have.length) continue;
    for (const cid of ids) {
      if (Number.isFinite(BASE[cid][key])) continue;
      const l = lg(cid);
      const near = [...have].sort((a, b) => Math.abs(a.l - l) - Math.abs(b.l - l)).slice(0, 8);
      const avg = near.reduce((a, x) => a + x.v, 0) / near.length;
      BASE[cid][key] = pc ? avg * popOf(cid) : avg;
      (EST[cid] ||= new Set()).add(key);
    }
  }
  for (const cid of ids) BASE[cid].pop = popOf(cid);
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
  for (const k of new Set([...Object.keys(T || {}), ...Object.keys(T0)])) D[k] = (T?.[k] || 0) - (T0[k] || 0);
  return D;
}

// laws = landets lagar (för LAW_EFFECTS); null = inga direkta lageffekter
export function countryIndicators(cid, T, T0 = null, laws = null) {
  const b = BASE[cid];
  if (!b) return null;
  const D = minus(T, T0);
  const v = {};
  for (const d of INDICATORS) {
    if (!d.mode) continue;
    const base = b[d.id];
    if (!Number.isFinite(base)) continue;
    v[d.id] = d.mode === 'mul'
      ? clampV(base * Math.max(0.05, 1 + effect(d.fx, D)), d.min, d.max)
      : clampV(base + effect(d.fx, D), d.min, d.max);
  }
  // nettoinvandringen följer invandringsvärdet: +100 ≈ 0,4 % av folkmängden per år
  v.netmig = (b.netmig || 0) + b.pop * 0.004 * ((D.immigration || 0) / 100);
  // lagar som slår direkt på ett mått (bara de som skiljer sig från startläget)
  for (const [cat, opt] of Object.entries(laws || {})) {
    if (opt === DEFAULT_LAW[cat]) continue;
    for (const [id, [op, n]] of Object.entries(LAW_EFFECTS[cat]?.[opt] || {})) {
      if (!Number.isFinite(v[id])) continue;
      v[id] = op === '+' ? v[id] + n : op === '*' ? v[id] * n : op === '=' ? n : op === '%pop' ? b.pop * n : v[id];
      if (IND[id]) v[id] = clampV(v[id], IND[id].min, IND[id].max);
    }
  }
  v.pop = b.pop;
  v.area = b.area;
  v.gdp = v.gdppc * b.pop;
  // HDI: verkligt utgångsvärde × hur mycket delarna rört sig
  const h0 = hdiCalc(b.life, b.schoolyears, b.gdppc);
  v.hdi = clampV((b.hdi || h0) * (hdiCalc(v.life, v.schoolyears, v.gdppc) / h0), 0.2, 1);
  return v;
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
    if (v) per.push({ v, w: share });
  }
  if (!per.length) return null;
  const out = {};
  let pop = 0, gdp = 0;
  for (const { v, w } of per) { pop += v.pop * w; gdp += v.gdp * w; }
  for (const d of INDICATORS) {
    if (d.agg === 'derived') continue;
    let num = 0, den = 0;
    for (const { v, w } of per) {
      if (!Number.isFinite(v[d.id])) continue;
      if (d.agg === 'sum') { num += v[d.id] * w; den = 1; }
      else {
        const weight = d.agg === 'gdp' ? v.gdp * w : v.pop * w;
        num += v[d.id] * weight; den += weight;
      }
    }
    if (den) out[d.id] = num / den;
  }
  out.pop = pop;
  out.gdp = gdp;
  out.gdppc = pop ? gdp / pop : 0;
  out.density = out.area ? pop / out.area : 0;
  out.taxrev = gdp * (out.tax || 0) / 100;
  out.milbudget = gdp * (out.milx || 0) / 100;
  out.tradebal = (out.exports || 0) - (out.imports || 0);
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
];

// rows = [{ key, name, mine, ind }] → sorterade efter måttet (bäst först)
export function rankBy(rows, id) {
  const low = IND[id]?.better === 'low';
  return rows.filter((r) => Number.isFinite(r.ind?.[id]))
    .sort((a, b) => (low ? a.ind[id] - b.ind[id] : b.ind[id] - a.ind[id]))
    .map((r, i) => ({ ...r, place: i + 1, value: r.ind[id] }));
}
