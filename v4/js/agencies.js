// IMPERIUM V5.21 — MYNDIGHETERNA (Henrys önskemål): "lägg även till myndigheter! Minst 10 för varje
// land, som du själv bestämmer budgeten för och dess namn och logga. Ta gärna de som finns IRL … och om
// det inte är Sverige så översätt till svenska där också! Men ha kvar landets riktiga myndighet".
//
// Varje land har 10–14 riktiga myndigheter (agencies-data.js): det riktiga namnet på landets språk (n,
// och t = latinska bokstäver när skriften är en annan), en svensk översättning (sv), förkortningen (a)
// och loggans bild, färger och stil. Påhittade är märkta x. Saknas landet byggs tio av slagen (fallback).
//
// En myndighet är av ett SLAG (KINDS). Slaget bestämmer vad budgeten gör, per steg g
// (BUDGETS: NORMAL = 0, ENORM = +1,25, NEDLAGD = −1,6):
//   mods       nationsvärden × g (åt båda hållen)
//   big        nationsvärden × g bara när budgeten är över det normala
//   cut        vad som händer per steg nedskärning (× −g): oro +3, beredskap −2 …
//   rev        statens intäkter i % × g (skatteverket och tullen tar in pengarna), cutRev när den skärs
//   add / mul  statistikmått: + v·g, eller × (1 + v·g); bigAdd, cutAdd, bigMul, cutMul åt ena hållet
// drift = vad myndigheten kostar vid NORMAL, i % av rikets dagsinkomst. Den kostnaden finns redan i
// statsbudgeten, så bara skillnaden mot NORMAL kostar eller sparar. Egna myndigheter (own) kostar hela
// sin budget och ger bara plus. Generaldirektörens skicklighet (1–5) gör budgeten 0,7–1,3 gånger så
// verksam åt plushållet. Två myndigheter av samma slag räknas 1 + 0,6 + 0,4 + 0,25 …
//
// Ren logik och data — main.js håller tillståndet (state.solo.agencies) och kopplar in det.
import { AGENCIES } from './agencies-data.js';
import { shapeSvg } from './flagmaker.js';

// ---------- budgeten ----------
// f = budget gånger det normala, g = hur mycket myndigheten gör jämfört med det normala
export const BUDGETS = [
  { name: 'NEDLAGD', f: 0, g: -1.6, own: 0 },
  { name: 'SVÄLTFÖDD', f: 0.3, g: -0.9, own: 0.15 },
  { name: 'SNÅL', f: 0.65, g: -0.35, own: 0.35 },
  { name: 'NORMAL', f: 1, g: 0, own: 0.6 },
  { name: 'GENERÖS', f: 1.5, g: 0.45, own: 0.85 },
  { name: 'STOR', f: 2.2, g: 0.85, own: 1.1 },
  { name: 'ENORM', f: 3.2, g: 1.25, own: 1.4 },
];
export const NORMAL = 3;
export const SKILLS = ['UDUGLIG', 'SVAG', 'MEDEL', 'SKICKLIG', 'LYSANDE'];
const SKILL_MUL = [0.7, 0.85, 1, 1.15, 1.3];
const DUP_W = [1, 0.6, 0.4, 0.25];

// priser
export const AG_COSTS = {
  boss: 6,           // ⚖️ ny generaldirektör
  reopen: 10,        // ⚖️ öppna en nedlagd myndighet
  close: 8,          // ⚖️ lägga ner
  foundPP: 20,       // ⚖️ grunda en ny
  foundDays: 15,     // … och dagsinkomster i pengar
  rename: 2,         // ⚖️ byta namn
};

// ---------- brottsfamiljerna (statistics.js CRIME_PROP, CRIME_VIOL, CRIME_ORG) ----------
const PROP = ['theft', 'burglary', 'cartheft', 'shoplift', 'biketheft', 'pickpocket', 'vandalism', 'graffiti', 'trespass'];
const VIOL = ['homicide', 'assault', 'threats', 'robbery', 'harass', 'knifecrime', 'arson'];
const ORG = ['gangs', 'extortion', 'drugcrime', 'weapons', 'trafficking', 'smuggling', 'kidnapping'];
const each = (ids, v) => Object.fromEntries(ids.map((id) => [id, v]));

// ---------- slagen ----------
// name = slaget på svenska, gen = förslaget när du grundar en ny, base = namnet i ett land utan data ("ANTARKTIS SKATTEMYNDIGHET"), st/em = loggans stil och bild,
// col = loggans färger om inget annat är känt, griev = vilket missnöje nedskärningar ger
export const KINDS = {
  skatt: { name: 'SKATT', icon: '\u{1F4B0}', gen: 'SKATTEMYNDIGHETEN', base: 'SKATTEMYNDIGHET', drift: 1, st: 'stripe', em: 'coin', col: ['#1d4a2e', '#f2e6c2'], griev: null,
    desc: 'Tar in skatterna. Utan den kommer pengarna inte in — med en stor blir fusket svårt.',
    mods: { income: 3, corruption: -1.5 }, big: { approval: -1 }, cut: { corruption: 2 }, rev: 4, cutRev: 20,
    add: { taxevasion: -4, shadow: -2 } },
  tull: { name: 'TULL', icon: '\u{1F6C3}', gen: 'TULLVERKET', base: 'TULLVERK', drift: 0.4, st: 'shield', em: 'anchor', col: ['#1f2e4f', '#e2c26a'],
    desc: 'Vaktar gränsen för varor. Smuggling, falska märkesvaror och vapen stoppas.',
    mods: { income: 1, safety: 1.5 }, cut: { corruption: 1.5 }, rev: 2, cutRev: 4,
    mul: { smuggling: -0.15, counterfeit: -0.12, drugcrime: -0.06, weapons: -0.06, trafficking: -0.08 } },
  finans: { name: 'FINANS', icon: '\u{1F3E6}', gen: 'FINANSINSPEKTIONEN', base: 'FINANSINSPEKTION', drift: 0.3, st: 'seal', em: 'pillars', col: ['#14213d', '#d4af37'],
    desc: 'Centralbanken och tillsynen över bankerna. Låg inflation och stabila pengar.',
    mods: { gdp: 2, stability: 1.5 }, cut: { stability: -2, corruption: 1 },
    add: { infl: -0.6, bankacc: 2, moneylaundering: -0.8 }, mul: { insider: -0.1 } },
  statistik: { name: 'STATISTIK', icon: '\u{1F4CA}', gen: 'STATISTIKBYRÅN', base: 'STATISTIKBYRÅ', drift: 0.2, st: 'square', em: 'bars', col: ['#0b4f8a', '#ffffff'],
    desc: 'Räknar landet. Regeringen vet vad som händer — och det blir svårare att gömma fusk.',
    mods: { research: 1, corruption: -1, stability: 0.5 }, cut: { corruption: 1 },
    add: { goveff: 0.08 } },
  revision: { name: 'REVISION', icon: '\u{1F50D}', gen: 'RIKSREVISIONEN', base: 'RIKSREVISION', drift: 0.2, st: 'seal', em: 'magnifier', col: ['#3a2a5a', '#f2e6c2'],
    desc: 'Granskar hur staten använder pengarna och jagar mutor.',
    mods: { corruption: -3.5, approval: 0.5 }, big: { statepower: -0.6 }, cut: { corruption: 1.5 },
    add: { corruptgov: 0.12, bribery: -1.5, welfarefraud: -0.5 }, mul: { embezzle: -0.12 } },
  polis: { name: 'POLIS', icon: '\u{1F693}', gen: 'POLISMYNDIGHETEN', base: 'POLISMYNDIGHET', drift: 2, st: 'badge', em: 'star', col: ['#1d3f8f', '#f2c94c'], griev: 'trygghet',
    desc: 'Håller ordning och utreder brott. Mycket polis ger trygghet — för mycket tar friheten.',
    mods: { safety: 4, stability: 1.5, unrest: -1.5 }, big: { freedom: -1.2 }, cut: { unrest: 3 },
    add: { clearance: 4, policetrust: 2, feelsafe: 3 }, mul: { ...each(PROP, -0.07), ...each(VIOL, -0.06), ...each(ORG, -0.08), response: -0.1 } },
  sakerhet: { name: 'SÄKERHETSTJÄNST', icon: '\u{1F575}\u{FE0F}', gen: 'SÄKERHETSTJÄNSTEN', base: 'SÄKERHETSTJÄNST', drift: 0.8, st: 'shield', em: 'eye', col: ['#1a1a1a', '#c9cfd8'],
    desc: 'Den hemliga polisen. Skyddar staten mot spioner och kupper — och ibland mot sitt eget folk.',
    mods: { stability: 2.5, statepower: 2.5 }, big: { freedom: -2.5, approval: -0.5 }, cut: { stability: -1.5 },
    add: { polstab: 0.08 }, bigAdd: { voice: -0.08, pressfree: -3, demo_civ: -0.15 }, mul: { bombings: -0.1 }, bigMul: { polprisoners: 0.4 } },
  underrattelse: { name: 'UNDERRÄTTELSE', icon: '\u{1F6F0}\u{FE0F}', gen: 'UNDERRÄTTELSETJÄNSTEN', base: 'UNDERRÄTTELSETJÄNST', drift: 0.8, st: 'seal', em: 'globe', col: ['#0f2a3f', '#9fd4ff'],
    desc: 'Spanar på omvärlden. Armén vet vad fienden gör innan den gör det.',
    mods: { readiness: 2.5, milpower: 1.5, statepower: 1 }, big: { freedom: -0.8 },
    mul: { hacking: -0.06 } },
  forsvar: { name: 'FÖRSVAR', icon: '\u{1F6E1}\u{FE0F}', gen: 'FÖRSVARSMAKTEN', base: 'FÖRSVARSMAKT', drift: 2.5, st: 'shield', em: 'sword', col: ['#3b4a2a', '#e2c26a'], griev: 'forsvar',
    desc: 'Armén, flottan och flyget och allt de behöver.',
    mods: { milpower: 4, readiness: 2.5 }, big: { approval: -0.5 }, cut: { readiness: -2 },
    add: { milx: 0.25 } },
  kris: { name: 'KRISBEREDSKAP', icon: '\u{1F6A8}', gen: 'KRISMYNDIGHETEN', base: 'KRISMYNDIGHET', drift: 0.6, st: 'hex', em: 'flame', col: ['#c8102e', '#ffffff'],
    desc: 'Räddningstjänst, katastrofer och väder. Snabb hjälp när något händer.',
    mods: { safety: 2, stability: 1.5, readiness: 1 },
    add: { injurydeath: -0.6, disasters: -0.6 }, mul: { response: -0.05 } },
  rattsvasende: { name: 'RÄTTSVÄSENDE', icon: '\u{2696}\u{FE0F}', gen: 'DOMSTOLSVERKET', base: 'DOMSTOLSVERK', drift: 0.8, st: 'seal', em: 'scales', col: ['#2b2b2b', '#d4af37'], griev: 'trygghet',
    desc: 'Domstolarna och åklagarna. Snabba och rättvisa domar.',
    mods: { safety: 1.5, freedom: 1.5, corruption: -1.5 }, cut: { unrest: 1.5, corruption: 2 },
    add: { rulelaw: 0.1, trustcourt: 3, clearance: 1.5 }, mul: { courtwait: -0.15 } },
  kriminalvard: { name: 'KRIMINALVÅRD', icon: '\u{1F512}', gen: 'KRIMINALVÅRDEN', base: 'KRIMINALVÅRD', drift: 0.8, st: 'shield', em: 'key', col: ['#2f3e4e', '#e8e8e8'], griev: 'trygghet',
    desc: 'Fängelser och frivård. Färre som rymmer och färre som återfaller i brott.',
    mods: { safety: 2 }, cut: { safety: -2, unrest: 1 },
    add: { recidivism: -3, prisonocc: -12 }, mul: { prisonescape: -0.2 } },
  migration: { name: 'MIGRATION', icon: '\u{1F6C2}', gen: 'MIGRATIONSVERKET', base: 'MIGRATIONSVERK', drift: 0.6, st: 'square', em: 'globe', col: ['#004f71', '#f2e6c2'], griev: 'migration',
    desc: 'Asyl, uppehållstillstånd och medborgarskap. Ordning vid gränsen och snabbare integration.',
    mods: { integration: 3, stability: 1, immigration: 1 }, cut: { integration: -2, unrest: 1.5 },
    add: { integ: 3, segreg: -2, xenophobia: -1 } },
  halsa: { name: 'HÄLSA', icon: '\u{1F3E5}', gen: 'FOLKHÄLSOMYNDIGHETEN', base: 'FOLKHÄLSOMYNDIGHET', drift: 2, st: 'circle', em: 'medcross', col: ['#ffffff', '#c8102e'], griev: 'valfard',
    desc: 'Vården, läkemedlen och folkhälsan. Längre liv och kortare köer.',
    mods: { hdi: 2.5, qol: 2, welfare: 1 }, cut: { unrest: 1.5 },
    add: { life: 0.6, measles: 2, healthx: 0.25 }, mul: { infmort: -0.06, carewait: -0.12 } },
  social: { name: 'SOCIALFÖRSÄKRING', icon: '\u{1F91D}', gen: 'FÖRSÄKRINGSKASSAN', base: 'FÖRSÄKRINGSKASSA', drift: 2.5, st: 'stripe', em: 'hands', col: ['#00684a', '#ffffff'], griev: 'valfard',
    desc: 'Pensioner, barnbidrag och sjukpenning. Trygghet för alla — dyrt.',
    mods: { welfare: 4, approval: 1.5, qol: 1 }, big: { gdp: -0.5 }, cut: { unrest: 3, approval: -2 },
    add: { gini: -0.8, socialx: 0.8 }, mul: { poverty: -0.1, homeless: -0.08 } },
  arbete: { name: 'ARBETE', icon: '\u{1F4BC}', gen: 'ARBETSFÖRMEDLINGEN', base: 'ARBETSFÖRMEDLING', drift: 0.8, st: 'stripe', em: 'briefcase', col: ['#5a2a7a', '#ffffff'], griev: 'kris',
    desc: 'Hjälper folk till jobb och ser till att arbetsplatserna är säkra.',
    mods: { gdp: 1.5, unrest: -1, integration: 1 },
    add: { unemp: -0.5, youthunemp: -1, neet: -0.8 } },
  skola: { name: 'SKOLA', icon: '\u{1F393}', gen: 'SKOLVERKET', base: 'SKOLVERK', drift: 1.8, st: 'square', em: 'book', col: ['#0e5e9c', '#ffd200'], griev: 'valfard',
    desc: 'Skolorna, lärarna och proven. Smartare barn — och fler forskare om tjugo år.',
    mods: { research: 2, hdi: 2, integration: 1 }, cut: { unrest: 1 },
    add: { literacy: 0.8, pisa: 6, schoolyears: 0.25 }, mul: { outofschool: -0.12 } },
  forskning: { name: 'FORSKNING', icon: '\u{1F52C}', gen: 'FORSKNINGSRÅDET', base: 'FORSKNINGSRÅD', drift: 0.8, st: 'hex', em: 'atom', col: ['#1b1b4f', '#7fe0ff'],
    desc: 'Pengar till forskarna, uppfinningar och patent.',
    mods: { research: 4, gdp: 1 },
    add: { rnd: 0.18 }, mul: { patents: 0.12, researchers: 0.1 } },
  rymd: { name: 'RYMD', icon: '\u{1F680}', gen: 'RYMDSTYRELSEN', base: 'RYMDSTYRELSE', drift: 0.6, st: 'circle', em: 'rocket', col: ['#0b1d3a', '#ffffff'],
    desc: 'Raketer, satelliter och landets plats bland stjärnorna.',
    mods: { research: 2.5, ideopower: 1.2, milpower: 1 },
    add: { hitech: 0.6 } },
  digital: { name: 'DIGITAL', icon: '\u{1F4BB}', gen: 'DIGITALISERINGSMYNDIGHETEN', base: 'DIGITALISERINGSMYNDIGHET', drift: 0.4, st: 'mono', em: 'chip', col: ['#0b1620', '#4ae3c0'],
    desc: 'Internet, it-säkerhet och e-tjänster. Snabbare stat och färre dataintrång.',
    mods: { research: 1.5, gdp: 1, income: 1 },
    add: { internet: 1.5, broadband: 1.2 }, mul: { hacking: -0.08, cybercrime: -0.06 } },
  trafik: { name: 'TRANSPORT', icon: '\u{1F6E3}\u{FE0F}', gen: 'TRAFIKVERKET', base: 'TRAFIKVERK', drift: 1.6, st: 'stripe', em: 'wheel', col: ['#c8102e', '#ffffff'],
    desc: 'Vägar, järnvägar, hamnar och flyg. Varorna kommer fram och folk till jobbet.',
    mods: { gdp: 2, factory: 1.5, qol: 0.5 }, cut: { gdp: -1 },
    add: { lpi: 0.08, commute: -1.5 }, mul: { traffic: -0.07 } },
  energi: { name: 'ENERGI', icon: '\u{26A1}', gen: 'ENERGIMYNDIGHETEN', base: 'ENERGIMYNDIGHET', drift: 0.5, st: 'hex', em: 'bolt', col: ['#ffcd00', '#1a1a1a'], griev: 'miljo',
    desc: 'Elen, kärnkraften och nätet. Billigare el och mer från sol och vind.',
    mods: { factory: 2.5, gdp: 0.8 },
    add: { renewelec: 1.5 }, mul: { elprice: -0.06 } },
  miljo: { name: 'MILJÖ', icon: '\u{1F333}', gen: 'NATURVÅRDSVERKET', base: 'NATURVÅRDSVERK', drift: 0.5, st: 'circle', em: 'leaf', col: ['#2e7d32', '#ffffff'], griev: 'miljo',
    desc: 'Ren luft, rent vatten, skogarna och nationalparkerna.',
    mods: { qol: 2, hdi: 0.5 }, big: { factory: -1 }, cut: { qol: -1 },
    add: { protected: 1.2, forest: 0.3 }, mul: { pm25: -0.07, co2: -0.04 } },
  jordbruk: { name: 'JORDBRUK', icon: '\u{1F33E}', gen: 'JORDBRUKSVERKET', base: 'JORDBRUKSVERK', drift: 0.6, st: 'square', em: 'wheat', col: ['#6b8e23', '#fff3c4'],
    desc: 'Bönderna, fisket och maten. Större skördar och säker mat.',
    mods: { qol: 1, factory: 1, stability: 0.5 },
    add: { undernourish: -0.6 }, mul: { cerealyield: 0.05, foodprice: -0.04 } },
  bostad: { name: 'BOSTÄDER', icon: '\u{1F3E0}', gen: 'BOVERKET', base: 'BOVERK', drift: 0.5, st: 'square', em: 'house', col: ['#8a3b12', '#ffffff'],
    desc: 'Bostäder, städernas planer och kartorna. Fler hem och färre hemlösa.',
    mods: { qol: 2, welfare: 1 },
    mul: { homeless: -0.1, housingshort: -0.1, houseprice: -0.04 } },
  kultur: { name: 'KULTUR', icon: '\u{1F3AD}', gen: 'KULTURRÅDET', base: 'KULTURRÅD', drift: 0.4, st: 'circle', em: 'mask', col: ['#7a1f5c', '#ffd6ec'],
    desc: 'Konsten, museerna, arvet, idrotten och turisterna.',
    mods: { integration: 1.5, ideopower: 1, qol: 1, approval: 0.5 },
    add: { happiness: 0.05 } },
  konsument: { name: 'KONSUMENT', icon: '\u{1F6D2}', gen: 'KONSUMENTVERKET', base: 'KONSUMENTVERK', drift: 0.2, st: 'stripe', em: 'cart', col: ['#e35d0b', '#ffffff'],
    desc: 'Skyddar köparna mot fusk och företagen mot karteller.',
    mods: { qol: 1, corruption: -1, gdp: 0.5 },
    mul: { fraud: -0.08, elderfraud: -0.1, foodprice: -0.02 } },
  val: { name: 'VAL', icon: '\u{1F5F3}\u{FE0F}', gen: 'VALMYNDIGHETEN', base: 'VALMYNDIGHET', drift: 0.1, st: 'seal', em: 'ballot', col: ['#00539f', '#ffffff'], griev: 'frihet',
    desc: 'Ordnar valen och räknar rösterna. Utan den blir valen en fars.',
    mods: { freedom: 1.5, stability: 1 }, cut: { freedom: -4, stability: -2, unrest: 2 },
    add: { turnout: 1.5, demo_el: 0.15 }, cutAdd: { demo_el: -1.2, trustparl: -4 } },
  rattigheter: { name: 'RÄTTIGHETER', icon: '\u{1F54A}\u{FE0F}', gen: 'OMBUDSMANNEN', base: 'OMBUDSMAN', drift: 0.15, st: 'circle', em: 'dove', col: ['#4a8fe8', '#ffffff'], griev: 'frihet',
    desc: 'Ombudsmän och diskrimineringsskydd. Lika rättigheter för alla.',
    mods: { freedom: 2, integration: 1.5 }, big: { statepower: -0.5 },
    add: { demo_civ: 0.15, xenophobia: -1, gii: -0.01 }, mul: { hatecrime: -0.08, harass: -0.06 } },
  media: { name: 'MEDIETILLSYN', icon: '\u{1F4E2}', gen: 'MEDIEMYNDIGHETEN', base: 'MEDIEMYNDIGHET', drift: 0.3, st: 'square', em: 'megaphone', col: ['#b8002e', '#ffffff'], griev: 'frihet',
    desc: 'Tillstånd för radio och TV — och i hårda länder censuren och propagandan.',
    mods: { ideopower: 2, statepower: 1.5 }, big: { freedom: -2.5 }, cut: { statepower: -1 },
    bigAdd: { pressfree: -3 }, cutAdd: { pressfree: 2 } },
  religion: { name: 'RELIGION', icon: '\u{1F54C}', gen: 'TROSSAMFUNDSMYNDIGHETEN', base: 'TROSSAMFUNDSMYNDIGHET', drift: 0.4, st: 'seal', em: 'crescent', col: ['#1f4d2b', '#e2c26a'],
    desc: 'Statens kontakt med trossamfunden — och i vissa länder religionspolisen.',
    mods: { ideopower: 1.5, stability: 1 }, big: { freedom: -1.5, integration: -0.5 },
    add: { reltension: -0.1 }, bigAdd: { believers: 1 } },
};
export const KIND_IDS = Object.keys(KINDS);
// Det här måste varje land ha (agencies-data.js och fallback)
export const CORE_KINDS = ['skatt', 'polis', 'halsa', 'skola', 'forsvar', 'statistik'];

// ---------- loggorna ----------
export const LOGO_STYLES = { seal: 'SIGILL', shield: 'SKÖLD', square: 'RUTA', badge: 'POLISBRICKA', hex: 'SEXHÖRNING', circle: 'CIRKEL', mono: 'BOKSTÄVER', stripe: 'MODERN' };
export const EMBLEMS = ['pillars', 'crown', 'star', 'shield', 'scales', 'coin', 'bars', 'magnifier', 'eye', 'lock', 'key', 'sword',
  'anchor', 'plane', 'wheel', 'bolt', 'leaf', 'tree', 'wheat', 'drop', 'sun', 'house', 'book', 'cap', 'flask', 'atom', 'rocket',
  'chip', 'globe', 'medcross', 'heart', 'hands', 'briefcase', 'ballot', 'dove', 'megaphone', 'mask', 'cart', 'gear', 'flame',
  'crescent', 'mountain', 'wave', 'torch', 'eagle', 'fish', 'train'];
// formerna som redan finns i flaggskaparen
const FROM_FLAG = { star: 'star5', crown: 'crown', shield: 'shield', sun: 'sun', wheel: 'wheel', leaf: 'leaf', tree: 'tree',
  mountain: 'mountain', wave: 'wave', key: 'key', sword: 'sword', crescent: 'crescent' };

const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const okColor = (c, d) => (/^#[0-9a-fA-F]{6}$/.test(String(c || '')) ? c : d);

// en bild i en ruta 100×100, mitten 50,50, i färgen c på bakgrunden bg
export function emblemSvg(id, c, bg) {
  if (FROM_FLAG[id]) return shapeSvg(FROM_FLAG[id], c, bg);
  const f = `fill="${c}"`, k = (w) => `stroke="${c}" stroke-width="${w}" fill="none"`;
  switch (id) {
    case 'pillars': return `<polygon points="50,6 94,30 6,30" ${f}/><rect x="10" y="32" width="80" height="6" ${f}/>`
      + [16, 34, 52, 70].map((x) => `<rect x="${x}" y="42" width="12" height="36" ${f}/>`).join('') + `<rect x="6" y="80" width="88" height="10" ${f}/>`;
    case 'scales': return `<rect x="47" y="16" width="6" height="68" ${f}/><circle cx="50" cy="14" r="6" ${f}/><rect x="30" y="84" width="40" height="8" ${f}/>`
      + `<rect x="12" y="24" width="76" height="5" ${f}/><path d="M19 27 L8 56 M19 27 L30 56 M81 27 L70 56 M81 27 L92 56" ${k(2.5)}/>`
      + `<path d="M4 56 H34 A15 11 0 0 1 4 56 Z" ${f}/><path d="M66 56 H96 A15 11 0 0 1 66 56 Z" ${f}/>`;
    case 'coin': return `<ellipse cx="36" cy="84" rx="30" ry="9" ${f}/><rect x="6" y="70" width="60" height="14" ${f}/><ellipse cx="36" cy="70" rx="30" ry="9" stroke="${bg}" stroke-width="2.5" ${f}/>`
      + `<rect x="6" y="56" width="60" height="14" ${f}/><ellipse cx="36" cy="56" rx="30" ry="9" stroke="${bg}" stroke-width="2.5" ${f}/>`
      + `<circle cx="68" cy="40" r="28" stroke="${bg}" stroke-width="3" ${f}/><circle cx="68" cy="40" r="20" stroke="${bg}" stroke-width="2.5" fill="none"/><polygon points="58,47 56,33 63,39 68,30 73,39 80,33 78,47" fill="${bg}"/>`;
    case 'bars': return `<rect x="12" y="60" width="16" height="30" ${f}/><rect x="32" y="44" width="16" height="46" ${f}/><rect x="52" y="28" width="16" height="62" ${f}/><rect x="72" y="12" width="16" height="78" ${f}/><rect x="6" y="91" width="88" height="5" ${f}/>`;
    case 'magnifier': return `<circle cx="42" cy="42" r="27" ${k(10)}/><path d="M62 62 L88 88" stroke="${c}" stroke-width="14" stroke-linecap="round"/>`;
    case 'eye': return `<path d="M4 50 Q50 8 96 50 Q50 92 4 50 Z" ${f}/><circle cx="50" cy="50" r="18" fill="${bg}"/><circle cx="50" cy="50" r="9" ${f}/>`;
    case 'lock': return `<path d="M30 46 V32 A20 20 0 0 1 70 32 V46" ${k(9)}/><rect x="18" y="44" width="64" height="48" rx="6" ${f}/><circle cx="50" cy="62" r="7" fill="${bg}"/><rect x="47" y="64" width="6" height="16" fill="${bg}"/>`;
    case 'anchor': return `<circle cx="50" cy="14" r="8" ${k(5)}/><rect x="46" y="22" width="8" height="64" ${f}/><rect x="28" y="30" width="44" height="7" ${f}/>`
      + `<path d="M14 58 Q18 92 50 92 Q82 92 86 58" ${k(8)}/><polygon points="6,64 14,48 24,62" ${f}/><polygon points="94,64 86,48 76,62" ${f}/>`;
    case 'plane': return `<path d="M50 4 C55 4 57 12 57 22 V40 L94 60 V68 L57 58 V78 L68 86 V93 L50 88 L32 93 V86 L43 78 V58 L6 68 V60 L43 40 V22 C43 12 45 4 50 4 Z" ${f}/>`;
    case 'bolt': return `<polygon points="60,4 18,56 46,56 36,96 82,40 54,40 66,4" ${f}/>`;
    case 'wheat': {
      let o = `<rect x="48" y="22" width="4" height="74" ${f}/><ellipse cx="50" cy="13" rx="6" ry="11" ${f}/>`;
      for (let i = 0; i < 4; i++) {
        const y = 30 + i * 13;
        o += `<ellipse cx="40" cy="${y}" rx="6" ry="11" transform="rotate(-35 40 ${y})" ${f}/><ellipse cx="60" cy="${y}" rx="6" ry="11" transform="rotate(35 60 ${y})" ${f}/>`;
      }
      return o;
    }
    case 'drop': return `<path d="M50 4 C50 4 16 46 16 64 A34 34 0 0 0 84 64 C84 46 50 4 50 4 Z" ${f}/><path d="M32 66 A18 18 0 0 0 46 82" stroke="${bg}" stroke-width="5" fill="none"/>`;
    case 'house': return `<polygon points="50,6 96,46 84,46 84,94 16,94 16,46 4,46" ${f}/><rect x="42" y="62" width="16" height="32" fill="${bg}"/><rect x="24" y="54" width="12" height="12" fill="${bg}"/><rect x="64" y="54" width="12" height="12" fill="${bg}"/>`;
    case 'book': return `<path d="M50 24 C38 14 20 14 6 18 V84 C20 80 38 80 50 90 Z" ${f}/><path d="M50 24 C62 14 80 14 94 18 V84 C80 80 62 80 50 90 Z" ${f}/><path d="M50 26 V88" stroke="${bg}" stroke-width="3"/>`;
    case 'cap': return `<polygon points="50,12 98,36 50,60 2,36" ${f}/><path d="M22 46 V68 C22 82 78 82 78 68 V46 L50 60 Z" ${f}/><path d="M88 41 V72" ${k(3)}/><circle cx="88" cy="75" r="5" ${f}/>`;
    case 'flask': return `<path d="M38 6 H62 V13 H57 V38 L86 84 C90 92 86 96 77 96 H23 C14 96 10 92 14 84 L43 38 V13 H38 Z" ${f}/><circle cx="42" cy="80" r="5" fill="${bg}"/><circle cx="58" cy="72" r="4" fill="${bg}"/><circle cx="52" cy="86" r="3" fill="${bg}"/>`;
    case 'atom': return [0, 60, 120].map((r) => `<ellipse cx="50" cy="50" rx="44" ry="16" transform="rotate(${r} 50 50)" ${k(5)}/>`).join('') + `<circle cx="50" cy="50" r="9" ${f}/>`;
    case 'rocket': return `<path d="M50 4 C66 18 70 40 66 68 H34 C30 40 34 18 50 4 Z" ${f}/><circle cx="50" cy="34" r="8" fill="${bg}"/>`
      + `<polygon points="34,50 16,74 20,88 35,74" ${f}/><polygon points="66,50 84,74 80,88 65,74" ${f}/><polygon points="40,72 60,72 50,97" ${f}/>`;
    case 'chip': {
      let o = `<rect x="24" y="24" width="52" height="52" rx="4" ${f}/><rect x="36" y="36" width="28" height="28" fill="${bg}"/>`;
      for (let i = 0; i < 4; i++) {
        const p = 29 + i * 12;
        o += `<rect x="${p}" y="8" width="6" height="14" ${f}/><rect x="${p}" y="78" width="6" height="14" ${f}/><rect x="8" y="${p}" width="14" height="6" ${f}/><rect x="78" y="${p}" width="14" height="6" ${f}/>`;
      }
      return o;
    }
    case 'globe': return `<circle cx="50" cy="50" r="42" ${f}/><ellipse cx="50" cy="50" rx="17" ry="42" stroke="${bg}" stroke-width="3.5" fill="none"/><path d="M8 50 H92 M15 29 H85 M15 71 H85 M50 8 V92" stroke="${bg}" stroke-width="3.5"/>`;
    case 'medcross': return `<rect x="36" y="8" width="28" height="84" rx="4" ${f}/><rect x="8" y="36" width="84" height="28" rx="4" ${f}/>`;
    case 'heart': return `<path d="M50 30 C50 18 40 10 28 10 C14 10 6 22 6 34 C6 56 30 72 50 92 C70 72 94 56 94 34 C94 22 86 10 72 10 C60 10 50 18 50 30 Z" ${f}/>`;
    case 'hands': return `<circle cx="50" cy="26" r="13" ${f}/><path d="M27 92 V66 C27 50 38 43 50 43 C62 43 73 50 73 66 V92 Z" ${f}/>`
      + `<circle cx="20" cy="38" r="9" ${f}/><path d="M4 92 V72 C4 60 10 53 20 53 C25 53 29 55 31 58 V92 Z" ${f}/>`
      + `<circle cx="80" cy="38" r="9" ${f}/><path d="M96 92 V72 C96 60 90 53 80 53 C75 53 71 55 69 58 V92 Z" ${f}/>`;
    case 'briefcase': return `<path d="M36 30 V20 C36 15 39 13 43 13 H57 C61 13 64 15 64 20 V30" ${k(7)}/><rect x="6" y="30" width="88" height="58" rx="6" ${f}/><rect x="6" y="52" width="88" height="5" fill="${bg}"/><rect x="44" y="48" width="12" height="13" rx="2" ${f}/>`;
    case 'ballot': return `<rect x="34" y="6" width="32" height="44" ${f}/><path d="M40 28 L48 37 L61 18" stroke="${bg}" stroke-width="5" fill="none"/><rect x="12" y="46" width="76" height="48" ${f}/><rect x="28" y="52" width="44" height="6" fill="${bg}"/>`;
    case 'dove': return `<path d="M6 52 C22 38 40 40 50 48 C56 30 72 18 94 20 C82 30 76 38 74 46 C82 50 88 56 90 64 C74 66 62 64 54 62 C46 76 30 82 12 82 C24 72 30 64 32 58 C22 58 12 56 6 52 Z" ${f}/><circle cx="22" cy="49" r="3" fill="${bg}"/>`;
    case 'megaphone': return `<path d="M10 38 H32 L80 12 V88 L32 62 H10 Z" ${f}/><rect x="24" y="62" width="11" height="24" ${f}/><path d="M88 34 Q97 50 88 66" ${k(5)}/>`;
    case 'mask': return `<path d="M12 12 H88 V44 C88 72 70 92 50 92 C30 92 12 72 12 44 Z" ${f}/><ellipse cx="33" cy="40" rx="10" ry="7" fill="${bg}"/><ellipse cx="67" cy="40" rx="10" ry="7" fill="${bg}"/><path d="M30 60 Q50 82 70 60 Q50 70 30 60 Z" fill="${bg}"/>`;
    case 'cart': return `<path d="M2 12 H14 L28 70 H86" ${k(7)}/><polygon points="16,22 96,22 86,58 26,58" ${f}/><circle cx="34" cy="84" r="9" ${f}/><circle cx="78" cy="84" r="9" ${f}/>`;
    case 'gear': {
      let o = `<circle cx="50" cy="50" r="32" ${f}/>`;
      for (let i = 0; i < 8; i++) o += `<rect x="42" y="4" width="16" height="20" rx="2" transform="rotate(${i * 45} 50 50)" ${f}/>`;
      return o + `<circle cx="50" cy="50" r="13" fill="${bg}"/>`;
    }
    case 'flame': return `<path d="M50 4 C60 24 82 36 82 62 C82 82 68 96 50 96 C32 96 18 82 18 62 C18 46 28 38 33 26 C37 40 43 44 47 44 C45 30 45 16 50 4 Z" ${f}/><path d="M50 58 C57 67 63 72 63 80 C63 88 57 93 50 93 C43 93 37 88 37 80 C37 72 45 67 50 58 Z" fill="${bg}"/>`;
    case 'torch': return `<path d="M50 4 C58 16 67 22 67 34 C67 44 59 50 50 50 C41 50 33 44 33 34 C33 26 39 20 42 12 C44 20 48 22 50 22 C48 16 48 10 50 4 Z" ${f}/><polygon points="28,52 72,52 61,65 39,65" ${f}/><polygon points="41,65 59,65 55,97 45,97" ${f}/>`;
    case 'eagle': return `<polygon points="42,40 2,20 9,33 1,40 11,48 4,57 40,60" ${f}/><polygon points="58,40 98,20 91,33 99,40 89,48 96,57 60,60" ${f}/>`
      + `<ellipse cx="50" cy="52" rx="11" ry="24" ${f}/><circle cx="50" cy="22" r="9" ${f}/><polygon points="57,20 66,24 57,27" ${f}/><polygon points="40,72 60,72 66,94 50,86 34,94" ${f}/>`;
    case 'fish': return `<path d="M8 50 C24 24 62 24 78 50 C62 76 24 76 8 50 Z" ${f}/><polygon points="74,50 96,30 90,50 96,70" ${f}/><circle cx="25" cy="45" r="5" fill="${bg}"/>`;
    case 'train': return `<rect x="18" y="8" width="64" height="70" rx="12" ${f}/><rect x="26" y="18" width="48" height="24" rx="3" fill="${bg}"/><circle cx="32" cy="62" r="6" fill="${bg}"/><circle cx="68" cy="62" r="6" fill="${bg}"/>`
      + `<path d="M30 80 L16 96 M70 80 L84 96 M8 96 H92" ${k(5)}/>`;
    default: return shapeSvg('star5', c, bg);
  }
}

// En logga: { st: stil, bg, fg, em: bild, tx: förkortningen } → SVG-sträng (kvadrat)
export function logoSvg(lg0, size = 40) {
  const lg = cleanLogo(lg0);
  const { bg, fg } = lg;
  const tx = esc(lg.tx);
  const n = Math.max(1, [...lg.tx].length);
  const font = `font-family="'Press Start 2P',monospace" font-weight="normal"`;
  const text = (y, fs, col = fg) => (tx ? `<text x="50" y="${y}" ${font} font-size="${fs}" fill="${col}" text-anchor="middle" dominant-baseline="central">${tx}</text>` : '');
  const em = (x, y, s, col = fg, back = bg) => `<g transform="translate(${x} ${y}) scale(${s / 100})">${emblemSvg(lg.em, col, back)}</g>`;
  const fs = Math.min(17, 78 / n);
  let body;
  switch (lg.st) {
    case 'seal': body = `<circle cx="50" cy="50" r="48" fill="${bg}"/><circle cx="50" cy="50" r="42" fill="none" stroke="${fg}" stroke-width="2.5"/>`
      + `<circle cx="50" cy="50" r="38" fill="none" stroke="${fg}" stroke-width="1" stroke-dasharray="2 3"/>` + em(27, tx ? 15 : 27, tx ? 46 : 46) + text(75, Math.min(12, 60 / n)); break;
    case 'shield': body = `<path d="M8 6 H92 V46 C92 74 70 90 50 98 C30 90 8 74 8 46 Z" fill="${bg}" stroke="${fg}" stroke-width="4"/>` + em(26, tx ? 14 : 24, tx ? 48 : 52) + text(72, Math.min(12, 58 / n)); break;
    case 'badge': {
      const pts = [];
      for (let i = 0; i < 12; i++) { const r = i % 2 ? 30 : 48, a = (-90 + i * 30) * Math.PI / 180; pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`); }
      body = `<polygon points="${pts.join(' ')}" fill="${fg}"/><circle cx="50" cy="50" r="27" fill="${bg}"/>` + (tx ? text(50, Math.min(11, 44 / n)) : em(30, 30, 40)); break;
    }
    case 'hex': body = `<polygon points="50,2 93,26 93,74 50,98 7,74 7,26" fill="${bg}" stroke="${fg}" stroke-width="3"/>` + em(25, tx ? 14 : 25, 50) + text(78, Math.min(11, 52 / n)); break;
    case 'circle': body = `<circle cx="50" cy="50" r="48" fill="${bg}"/>` + em(tx ? 22 : 18, tx ? 10 : 18, tx ? 56 : 64) + text(80, Math.min(11, 60 / n)); break;
    case 'mono': body = `<rect x="0" y="0" width="100" height="100" rx="8" fill="${bg}"/>` + text(46, Math.min(24, 88 / n)) + `<rect x="18" y="72" width="64" height="5" fill="${fg}"/>` + (tx ? '' : em(20, 14, 60)); break;
    case 'stripe': body = `<rect x="0" y="0" width="100" height="100" rx="6" fill="${bg}"/><rect x="0" y="70" width="100" height="30" fill="${fg}"/><rect x="0" y="94" width="100" height="6" fill="${bg}" opacity="0.4"/>`
      + em(27, 8, 46) + text(83, Math.min(13, 70 / n), bg); break;
    default: body = `<rect x="2" y="2" width="96" height="96" rx="10" fill="${bg}" stroke="${fg}" stroke-width="3"/>` + em(25, tx ? 10 : 22, tx ? 50 : 56) + text(80, fs > 13 ? 13 : fs);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block">${body}</svg>`;
}

export function cleanLogo(x = {}) {
  return {
    st: LOGO_STYLES[x.st] ? x.st : 'square',
    bg: okColor(x.bg, '#1f2e4f'),
    fg: okColor(x.fg, '#ffffff'),
    em: EMBLEMS.includes(x.em) ? x.em : 'pillars',
    tx: String(x.tx ?? '').replace(/[<>"&]/g, '').toUpperCase().slice(0, 6),
  };
}

// ---------- listan per land ----------
// rad i agencies-data.js: [slag, namn, svenska, förkortning, bild, färg1, färg2, stil, translitterering, påhittad]
function unpack(r) {
  const [k, n, sv, a, e, c0, c1, st, t, x] = r;
  return { k, n, sv, a, e, c: [c0 ? '#' + c0 : null, c1 ? '#' + c1 : null], st: st || null, t: t || null, x: !!x };
}
export function hasRealAgencies(cid) { return !!AGENCIES[cid]?.length; }

// Myndigheterna för ett land: riktiga om de finns, annars tio av slagen med landets namn
export function agencyListFor(cid, land = 'LANDET') {
  const rows = AGENCIES[cid];
  if (rows?.length) return rows.map(unpack);
  const L = String(land).toUpperCase();
  const kinds = [...CORE_KINDS, 'val', 'tull', 'kris', 'miljo'];
  return kinds.map((k) => {
    const name = `${L}${/S$/.test(L) ? '' : 'S'} ${KINDS[k].base}`;
    return { k, n: name, sv: name, a: (L[0] || 'M') + KINDS[k].base.replace(/[^A-ZÅÄÖ]/g, '').slice(0, 3), e: KINDS[k].em, c: KINDS[k].col, st: null, t: null, x: true };
  });
}
export function initials(name) {
  const w = String(name || '').toUpperCase().replace(/[^A-ZÅÄÖ0-9 ]/g, ' ').split(/\s+/).filter((x) => x.length > 2);
  const s = w.map((x) => x[0]).join('').slice(0, 4);
  return s.length >= 2 ? s : String(name || 'M').toUpperCase().replace(/[^A-ZÅÄÖ]/g, '').slice(0, 3) || 'M';
}

export function defaultLogo(e) {
  const K = KINDS[e.k] || KINDS.statistik;
  return cleanLogo({ st: e.st || K.st, bg: e.c?.[0] || K.col[0], fg: e.c?.[1] || K.col[1], em: e.e || K.em, tx: e.a || initials(e.n) });
}

// ---------- slump med frö ----------
function rng(seed) {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// 1–5, oftast medel
export function rollSkill(r = Math.random) {
  const x = r();
  return x < 0.1 ? 1 : x < 0.3 ? 2 : x < 0.65 ? 3 : x < 0.88 ? 4 : 5;
}

// Tillståndet: { list: [myndighet], fx: {mått: plus}, mul: {mått: faktor} }
// myndighet = { id, k, n, orig, sv, t, a, x, lvl, skill, logo, own, founded }
export function initAgencies(cid, land, seed, day = 1) {
  const r = rng('myn:' + seed);
  const list = agencyListFor(cid, land).map((e, i) => ({
    id: 'a' + i, k: e.k, n: e.n, orig: e.n, sv: e.sv, t: e.t, a: e.a, x: e.x || false,
    lvl: NORMAL, skill: rollSkill(r), logo: defaultLogo(e), own: false, founded: day,
  }));
  return { list, fx: {}, mul: {}, seq: list.length };
}
export function newAgency(st, k, name, day, logo = null) {
  const K = KINDS[k];
  const n = String(name || '').replace(/[<>"&]/g, '').trim().slice(0, 48) || K.gen;
  const a = initials(n);
  const ag = { id: 'n' + (st.seq = (st.seq || 0) + 1), k, n, orig: n, sv: n, t: null, a, x: false, lvl: NORMAL, skill: rollSkill(),
    logo: cleanLogo(logo || { st: K.st, bg: K.col[0], fg: K.col[1], em: K.em, tx: a }), own: true, founded: day };
  st.list.push(ag);
  return ag;
}

// ---------- verkan ----------
// hur mycket myndigheten gör (g) och hur tungt den väger mot andra av samma slag (w)
export function agencyG(a) {
  const B = BUDGETS[a.lvl] || BUDGETS[NORMAL];
  const g = a.own ? B.own : B.g;
  return g > 0 ? g * (SKILL_MUL[(a.skill || 3) - 1] ?? 1) : g;
}
function weighted(st) {
  const seen = {};
  return (st?.list || []).map((a) => {
    const i = seen[a.k] = (seen[a.k] ?? -1) + 1;
    return { a, K: KINDS[a.k], g: agencyG(a), w: DUP_W[Math.min(i, DUP_W.length - 1)] };
  }).filter((x) => x.K);
}

export function agencyMods(st) {
  const out = {};
  const add = (mods, f) => { for (const [k, v] of Object.entries(mods || {})) out[k] = (out[k] || 0) + v * f; };
  for (const { K, g, w } of weighted(st)) {
    if (!g) continue;
    add(K.mods, g * w);
    if (g > 0) add(K.big, g * w);
    else add(K.cut, -g * w);   // cut = vad som händer per steg nedskärning (oro +3, beredskap −2 …)
  }
  for (const k of Object.keys(out)) { out[k] = Math.round(out[k]); if (!out[k]) delete out[k]; }
  return out;
}

// pengar per dag i % av dagsinkomsten (plus = kostar, minus = sparar eller tjänar)
export function agencyCostPct(st) {
  let pct = 0;
  for (const { a, K, g, w } of weighted(st)) {
    const B = BUDGETS[a.lvl] || BUDGETS[NORMAL];
    pct += K.drift * (a.own ? B.f : B.f - 1);
    if (K.rev) pct -= K.rev * g * w * (g < 0 ? 1 + (K.cutRev || 0) / K.rev : 1);
  }
  return pct;
}
// det myndigheten kostar i sig (för listan): % av dagsinkomsten
export function agencyBudgetPct(a) {
  const B = BUDGETS[a.lvl] || BUDGETS[NORMAL];
  return (KINDS[a.k]?.drift || 0) * B.f;
}

// statistiken: vart myndigheterna drar måtten → { add: {mått: plus}, mul: {mått: faktor} }
export function agencyIndTargets(st) {
  const add = {}, mul = {};
  const A = (m, f) => { for (const [k, v] of Object.entries(m || {})) add[k] = (add[k] || 0) + v * f; };
  const M = (m, f) => { for (const [k, v] of Object.entries(m || {})) mul[k] = (mul[k] || 0) + v * f; };
  for (const { K, g, w } of weighted(st)) {
    if (!g) continue;
    A(K.add, g * w); M(K.mul, g * w);
    if (g > 0) { A(K.bigAdd, g * w); M(K.bigMul, g * w); }
    else { A(K.cutAdd, -g * w); M(K.cutMul, -g * w); }
  }
  // en faktor: 1 + summan, aldrig under 0,25 eller över 3
  for (const k of Object.keys(mul)) mul[k] = Math.max(0.25, Math.min(3, 1 + mul[k]));
  return { add, mul };
}

export function agencySummary(st) {
  const list = st?.list || [];
  const open = list.filter((a) => a.lvl > 0);
  const budgetPct = list.reduce((s, a) => s + agencyBudgetPct(a), 0);
  const normPct = list.filter((a) => !a.own).reduce((s, a) => s + (KINDS[a.k]?.drift || 0), 0);
  // kinds: budgetnivån för den första myndigheten av varje slag (−1 = ingen) — händelserna läser den
  const kinds = Object.fromEntries(KIND_IDS.map((k) => [k, -1]));
  for (const a of list) if (kinds[a.k] === -1) kinds[a.k] = a.lvl;
  return {
    count: list.length, open: open.length, closed: list.length - open.length, own: list.filter((a) => a.own).length,
    big: open.filter((a) => a.lvl > NORMAL).length, cut: open.filter((a) => a.lvl < NORMAL).length,
    skill: open.length ? open.reduce((s, a) => s + (a.skill || 3), 0) / open.length : 0,
    budgetPct, normPct, spend: normPct ? Math.round(budgetPct / normPct * 100) : 100, kinds,
  };
}

// Vad en ändring gör (förhandsrutan): mods för just den här myndigheten på nivån lvl
export function agencyModsAt(a, lvl) {
  return agencyMods({ list: [{ ...a, lvl }] });
}
