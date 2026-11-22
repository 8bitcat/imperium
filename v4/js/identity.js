// IMPERIUM V5.22 — STOLTHETEN. Carl 2026-11-22: «utöka spelets realism kraftigt, lägg till otroligt många mer
// funktioner, grejer man kan göra med flaggan, passet alltså symboler och allt möjligt, men inte bara de».
//
// Före 5.22 var flaggan, passet och symbolerna nästan bara utseende. Nu gör de något, och allt utgår från verkligheten
// (identity-data.js: nationalsång, valspråk, nationaldag, flaggans år, helgdagar, ambassader, passindex och hur stolta
// folket är enligt World Values Survey):
//   • FLAGGAN har en kvalitet (NAVA:s fem regler i «Good Flag, Bad Flag»), en ålder som folket fäster sig vid och en
//     kännedom i världen. Byts den genom dekret, riksdagsbeslut eller folkomröstning (Nya Zeeland 2016 röstade nej).
//     Flagglag (fri / skyddad / helig), flaggan i ockuperade länder, halv stång.
//   • NATIONALSTOLTHETEN (andel «mycket stolta») glider mot ett mål som flaggan, sången, helgdagarna, monumenten,
//     krigen, krisen och propagandan sätter — och den ger stabilitet, beredskap och lägre oro, men gör integrationen
//     svårare när den blir chauvinism.
//   • PASSET: avgift, säkerhet (papper → maskinläsbart → chip → fingeravtryck), gyllene pass och visum, utresevisum,
//     indragna pass för kritiker. Visumfrihet förhandlas land för land (ömsesidighet), inreseförbud, passindex.
//   • AMBASSADERNA: öppna, stänga, kalla hem; de ger bättre relationer och krävs för att förhandla visumfrihet.
//   • HELGDAGARNA: varje ledig dag kostar ungefär en tiondels procent av BNP men ger livskvalitet; att stryka en
//     helgdag ger protester (Danmark strök Store Bededag 2023).
//   • MONUMENTEN, ORDNARNA, SEDLARNAS MOTIV och FRIMÄRKENA.
// main.js äger tillståndet (state.solo.identity), dagstakten och panelerna; den här filen är logik och data.

import { LAYOUTS, SHAPES } from './flagmaker.js';

export const YEAR = 120;                 // speldagar per spelår (realism.js YEAR_DAYS)
export const START_YEAR = 2025;          // spelet börjar i verkligheten det här året

// ---------- verkligheten (identity-data.js läses in av main.js) ----------
let DATA = {};
export function setIdentityData(d) { DATA = d || {}; }
const F = ['anthem', 'anthemYear', 'anthemLyrics', 'motto', 'natday', 'flagYear', 'animal', 'holidays', 'embassies', 'visaFree', 'pride'];
export function realOf(cid) {
  const r = DATA[cid];
  if (!Array.isArray(r)) return {};
  const o = {};
  F.forEach((k, i) => { if (r[i] != null) o[k] = r[i]; });
  return o;
}
export function hasIdentityData() { return Object.keys(DATA).length > 0; }
export function worldValues(key) {
  const i = F.indexOf(key);
  return Object.entries(DATA).map(([cid, r]) => [cid, r?.[i]]).filter(([, v]) => Number.isFinite(v));
}
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
export function worldMedianOf(key) { return median(worldValues(key).map(([, v]) => v)); }

// nationaldjuret i verkligheten (svenska ord) → spelets bild
const ANIMAL_EMOJI = { lejon: '\u{1F981}', 'örn': '\u{1F985}', 'björn': '\u{1F43B}', varg: '\u{1F43A}', 'älg': '\u{1FACE}', hjort: '\u{1F98C}',
  drake: '\u{1F409}', elefant: '\u{1F418}', tiger: '\u{1F42F}', 'räv': '\u{1F98A}', 'tjur': '\u{1F402}', 'häst': '\u{1F40E}', 'tupp': '\u{1F413}',
  'kondor': '\u{1F985}', 'falk': '\u{1F985}', 'svan': '\u{1F9A2}', 'duva': '\u{1F54A}\u{FE0F}', 'känguru': '\u{1F998}', 'kiwi': '\u{1F426}',
  'panda': '\u{1F43C}', 'jaguar': '\u{1F406}', 'leopard': '\u{1F406}', 'zebra': '\u{1F993}', 'kamel': '\u{1F42A}', 'bäver': '\u{1F9AB}', 'uggla': '\u{1F989}',
  'enhörning': '\u{1F984}', 'delfin': '\u{1F42C}', 'sköldpadda': '\u{1F422}', 'krokodil': '\u{1F40A}', 'orm': '\u{1F40D}', 'papegoja': '\u{1F99C}' };
export function animalEmoji(word) {
  if (!word) return null;
  const w = String(word).toLowerCase();
  for (const [k, e] of Object.entries(ANIMAL_EMOJI)) if (w.includes(k)) return e;
  return null;
}

// ================================================================== FLAGGANS KVALITET
// North American Vexillological Association, «Good Flag, Bad Flag» (2006): 1 håll den enkel, 2 meningsfull
// symbolik, 3 två eller tre grundfärger, 4 ingen text eller sigill, 5 sticka ut eller vara släkt.
// [färger som syns i mallen, hur sammansatt mallen är 0–2,5]
const LAYOUT_INFO = {
  solid: [1, 0], h2: [2, 0.35], h3: [3, 0.55], v2: [2, 0.35], v3: [3, 0.55], h3wide: [2, 0.55], hband: [3, 1.15], hstripes: [2, 1.3],
  stars: [3, 2.3], nordic: [2, 0.75], nordic2: [3, 1.3], cross: [2, 0.75], saltire: [2, 0.9], union: [3, 2.1], canton: [2, 1.0],
  vband: [4, 1.6], triangle: [3, 1.15], chevron: [4, 1.7], bend: [2, 0.9], perbend: [2, 0.6], quartered: [2, 1.0], pall: [4, 2.0],
  border: [2, 0.9], disk: [2, 0.55], rays: [3, 1.8], diamond: [2, 0.8],
};
const TRICOLOR = new Set(['h2', 'h3', 'v2', 'v3', 'h3wide', 'solid']);
function rgb(c) {
  const h = String(c || '').replace('#', '');
  const x = h.length === 3 ? h.split('').map((d) => d + d).join('') : h.slice(0, 6);
  const n = parseInt(x, 16);
  return Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [128, 128, 128];
}
function cdist(a, b) { const p = rgb(a), q = rgb(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
function distinctColors(list) {
  const out = [];
  for (const c of list) if (c && !out.some((o) => cdist(o, c) < 48)) out.push(c);
  return out;
}
function usedColors(spec) {
  const [n] = LAYOUT_INFO[spec.layout] || [3];
  const cs = (spec.colors || []).slice(0, n);
  if (spec.sym && SHAPES[spec.sym]) cs.push(spec.symColor);
  return distinctColors(cs);
}
const SYM_FACTOR = { 1: 1, 3: 1.4, 5: 1.8, 12: 2.2 };
// ctx: { natColors: [hex], faith: 'ISLAM'…, ideo, title, animal (emoji), others: [{ name, colors }] }
export function flagScore(spec, ctx = {}) {
  if (!spec) return null;
  const [, lc] = LAYOUT_INFO[spec.layout] || [3, 1];
  const isShape = spec.sym && SHAPES[spec.sym];
  const isPic = spec.sym && !isShape;
  const cnt = SYM_FACTOR[spec.symCount] || 1;
  const symC = !spec.sym ? 0 : isShape ? 0.6 * cnt : 2.3 * Math.sqrt(cnt);
  const simple = clamp(100 - (lc + symC) * 22, 0, 100);
  // 2: symbolik — knyter flaggan an till landet, tron, idéerna eller djuret?
  let mean = spec.sym ? 50 : 58;
  const natC = ctx.natColors || [];
  const used = usedColors(spec);
  const natHits = used.filter((c) => natC.some((n) => cdist(n, c) < 60)).length;
  if (natHits) mean += 14 + Math.min(2, natHits - 1) * 6;
  const s = spec.sym;
  const fit = (s === 'crescent' || s === 'crescentstar') ? ctx.faith === 'ISLAM'
    : s === 'cross' ? ['KRISTEN', 'KATOLSK', 'ORTODOX'].includes(ctx.faith)
      : s === 'star6' ? ctx.faith === 'JUDISK'
        : s === 'wheel' ? ['HINDU', 'BUDDHIST'].includes(ctx.faith)
          : s === 'hammer' ? /commun|socialis/.test(ctx.ideo || '')
            : s === 'crown' ? /KUNG|DROTTNING|KEJSAR|FURSTE|STORHERTIG/.test(ctx.title || '')
              : s === 'leaf' || s === 'tree' ? /green|eco/.test(ctx.ideo || '') || !!ctx.forest
                : s === ctx.animal;
  if (fit) mean += 18;
  else if (s === 'hammer' || s === 'crown' || s === 'crescentstar' || s === 'cross') mean -= 12;   // en tung symbol som inte hör hemma
  mean = clamp(mean, 0, 100);
  // 3: två eller tre färger
  const nc = used.length;
  const colors = nc === 2 ? 100 : nc === 3 ? 94 : nc === 1 ? 62 : nc === 4 ? 58 : 34;
  // 4: ingen text, inga sigill — en detaljerad bild är som ett sigill: den syns inte på avstånd
  const seals = isPic ? (cnt > 1.5 ? 28 : 46) : s === 'crown' || s === 'shield' ? 82 : 100;
  // 5: sticka ut — en trikolor i samma färger som ett annat land förväxlas
  let distinct = 90, like = null;
  if (TRICOLOR.has(spec.layout) && !spec.sym) {
    for (const o of ctx.others || []) {
      const oc = distinctColors(o.colors || []);
      if (oc.length !== nc || nc < 2) continue;
      if (oc.every((c) => used.some((u) => cdist(u, c) < 55))) { distinct = 32; like = o.name; break; }
    }
  }
  if (distinct > 40 && natHits && TRICOLOR.has(spec.layout)) distinct = 84;   // släkt med landets egna — det är tillåtet
  const parts = [
    { id: 'simple', name: 'ENKEL', v: simple, tip: 'Färre fält och färre symboler — ett barn ska kunna rita den ur minnet.' },
    { id: 'mean', name: 'MENING', v: mean, tip: 'Landets egna färger och en symbol som betyder något för folket.' },
    { id: 'colors', name: 'FÄRGER', v: colors, tip: 'Två eller tre klara färger.' },
    { id: 'seals', name: 'UTAN SIGILL', v: seals, tip: 'Inga detaljerade bilder — de blir en klump på avstånd.' },
    { id: 'distinct', name: 'EGEN', v: distinct, tip: like ? `Förväxlas med ${like}s flagga.` : 'Den ska inte gå att ta för ett annat lands.' },
  ];
  const total = Math.round(simple * 0.25 + mean * 0.2 + colors * 0.2 + seals * 0.15 + distinct * 0.2);
  return { total, parts, grade: gradeOf(total), like };
}
export function gradeOf(v) {
  return v >= 85 ? { id: 'A', name: 'UTMÄRKT' } : v >= 72 ? { id: 'B', name: 'BRA' } : v >= 60 ? { id: 'C', name: 'GODKÄND' }
    : v >= 45 ? { id: 'D', name: 'SVAG' } : { id: 'E', name: 'RISIG' };
}
// den riktiga flaggan: folket bedömer den inte efter reglerna — den är deras. Den räknas som 70.
export const REAL_FLAG_SCORE = 70;

// hur fäst folket är vid något som funnits i `years` år (0..1)
export function attachment(years) { return 1 - Math.exp(-Math.max(0, years) / 18); }

// ================================================================== FLAGGBYTET
export const FLAG_METHODS = {
  decree: { name: 'DEKRET', icon: '\u{1F4DC}', pp: 12, days: 0, desc: 'Flaggan byts i dag. Den som var fäst vid den gamla protesterar.', griev: 1 },
  parliament: { name: 'RIKSDAGSBESLUT', icon: '\u{1F3DB}\u{FE0F}', pp: 30, days: 20, desc: 'Riksdagen röstar om tjugo dagar. Hälften så mycket protester.', griev: 0.5 },
  referendum: { name: 'FOLKOMRÖSTNING', icon: '\u{1F5F3}\u{FE0F}', pp: 6, days: 60, costPct: 0.004, desc: 'Folket avgör om sextio dagar. Säger de ja blir ingen arg — men de säger ofta nej (Nya Zeeland 2016).', griev: 0 },
};
// sannolikheten att ett ja vinner: en bättre flagga drar, men vanan och en impopulär regering drar åt nej
export function referendumYes({ newScore, oldScore, attach, approval = 0, pride = 50 }) {
  const x = (newScore - oldScore) / 14 - attach * 2.2 + approval / 70 - (pride - 50) / 60 + 0.25;
  return clamp(1 / (1 + Math.exp(-x)), 0.04, 0.95);
}

// ================================================================== REGLERNA KRING SYMBOLERNA
export const FLAG_LAWS = {
  free: { name: 'FRI — FLAGGAN FÅR BRÄNNAS', icon: '\u{1F525}', mods: { freedom: 2 }, pride: -1, shame: 0, desc: 'Som i USA och Sverige: det är en åsikt att bränna en flagga.' },
  protected: { name: 'SKYDDAD — BÖTER', icon: '\u{1F6A9}', mods: { freedom: -1 }, pride: 1, shame: 0, desc: 'Som i Tyskland och Frankrike: den som skändar flaggan får böter.' },
  sacred: { name: 'HELIG — FÄNGELSE', icon: '\u{26D3}\u{FE0F}', mods: { freedom: -5, statepower: 2 }, pride: 2.5, shame: 3, desc: 'Fängelse för den som skändar flaggan. Omvärlden ser det som förtryck.' },
};
export const ANTHEM_RULES = {
  free: { name: 'FRIVILLIG', icon: '\u{1F3B5}', mods: {}, pride: 0, desc: 'Den som vill sjunger.' },
  schools: { name: 'I SKOLORNA', icon: '\u{1F3EB}', mods: { freedom: -1, ideopower: 1 }, pride: 2, desc: 'Barnen sjunger den varje morgon.' },
  mandatory: { name: 'STÅ UPP — PÅ BIO, ARENOR OCH MÖTEN', icon: '\u{1F9CD}', mods: { freedom: -3, statepower: 1, ideopower: 2 }, pride: 3, shame: 1, desc: 'Som Indien 2016–2018 och Kinas lag om nationalsången: alla står upp, annars straff.' },
};
export const OCC_FLAGS = {
  local: { name: 'LANDETS EGEN FLAGGA', icon: '\u{1F3F3}\u{FE0F}', integ: 0.85, unrest: -4, desc: 'Folket får behålla sin flagga. Lugnare, men de blir långsammare en del av riket.' },
  both: { name: 'BÅDA FLAGGORNA', icon: '\u{1F91D}', integ: 1, unrest: 0, desc: 'Din flagga vid din förvaltning, deras överallt annars.' },
  own: { name: 'DIN FLAGGA ÖVERALLT', icon: '\u{1F6A9}', integ: 1.15, unrest: 6, desc: 'Din flagga på varje stadshus. Snabbare in i riket när de väl lugnat sig — men mer motstånd först.' },
};

// ================================================================== PASSET
export const PASS_FEES = [
  { name: 'GRATIS', usd: 0, emig: 1.04, approval: 1 },
  { name: 'LÅG', usd: 30, emig: 1.02, approval: 0 },
  { name: 'NORMAL', usd: 70, emig: 1, approval: 0 },
  { name: 'HÖG', usd: 150, emig: 0.97, approval: -1 },
  { name: 'MYCKET HÖG', usd: 400, emig: 0.9, approval: -3 },
];
// Hur säkert passet är. De flesta länder har chip sedan 2006–2015 (ICAO 9303); USA:s viseringsundantag kräver chip.
export const PASS_SEC = [
  { name: 'HANDSKRIVET PAPPER', icon: '\u{1F4DD}', visa: -14, fraud: 1.35, freedom: 0, need: 0 },
  { name: 'MASKINLÄSBART', icon: '\u{1F4C7}', visa: -6, fraud: 1.12, freedom: 0, need: 0 },
  { name: 'BIOMETRISKT CHIP', icon: '\u{1F4F6}', visa: 0, fraud: 1, freedom: 0, need: 1 },
  { name: 'CHIP + FINGERAVTRYCK', icon: '\u{1F590}\u{FE0F}', visa: 3, fraud: 0.85, freedom: -1, need: 3 },
];
export const SEC_DAYS = 90;                // så lång tid tar det att byta ut passen
export const SEC_COST_PCT = 0.0001;        // andel av BNP (ett nytt passystem ≈ några hundra miljoner kronor)
// Gyllene pass: medborgarskap eller uppehållstillstånd mot investering (Malta, Cypern, Vanuatu, St Kitts …)
export const GOLDEN = {
  off: { name: 'NEJ', icon: '\u{1F6AB}', usd: 0, corruption: 0, shame: 0 },
  residence: { name: 'GYLLENE VISUM (UPPEHÅLLSTILLSTÅND)', icon: '\u{1F3E0}', usd: 500e3, corruption: 2, shame: 0.5, demand: 0.7 },
  citizenship: { name: 'GYLLENE PASS (MEDBORGARSKAP)', icon: '\u{1F4B3}', usd: 1e6, corruption: 5, shame: 2, demand: 1 },
};
// sökande per år: ett starkt pass och ett stabilt land lockar — i verkligheten några hundra till några tusen
export function goldenApplicants(kind, visaFree, stability = 0) {
  const g = GOLDEN[kind];
  if (!g?.demand) return 0;
  const pull = Math.max(0, (visaFree - 60) / 130);
  return Math.round(g.demand * 3000 * pull * pull * clamp(1 + stability / 200, 0.5, 1.4));
}

// ================================================================== HELGDAGARNA
// Varje ledig dag kostar ungefär 0,1 % av BNP (studier av t.ex. Tyskland och Danmark) men ger vila och sammanhang.
export const HOLIDAY_GDP = 0.001;
export const HOLIDAYS = {
  nyar: { name: 'NYÅRSDAGEN', icon: '\u{1F386}', kind: 'civic', pride: 0, mods: { qol: 0.5 } },
  natday: { name: 'NATIONALDAGEN', icon: '\u{1F389}', kind: 'civic', pride: 2.5, mods: { approval: 1 }, needNatday: true },
  maj1: { name: 'ARBETARNAS DAG', icon: '\u{270A}', kind: 'ideo', pride: 0.5, mods: { approval: 0.5 }, left: 1 },
  jul: { name: 'JULEN', icon: '\u{1F384}', kind: 'faith', faith: ['KRISTEN', 'KATOLSK', 'ORTODOX'], pride: 0.5, mods: { qol: 1 } },
  pask: { name: 'PÅSKEN', icon: '\u{1F423}', kind: 'faith', faith: ['KRISTEN', 'KATOLSK', 'ORTODOX'], pride: 0, mods: { qol: 0.5 } },
  midsommar: { name: 'MIDSOMMAR', icon: '\u{1F33C}', kind: 'civic', pride: 1, mods: { qol: 1 } },
  eidf: { name: 'EID AL-FITR', icon: '\u{1F319}', kind: 'faith', faith: ['ISLAM'], pride: 0.5, mods: { qol: 1 } },
  eida: { name: 'EID AL-ADHA', icon: '\u{1F411}', kind: 'faith', faith: ['ISLAM'], pride: 0.5, mods: { qol: 0.5 } },
  diwali: { name: 'DIWALI', icon: '\u{1FA94}', kind: 'faith', faith: ['HINDU', 'SIKH'], pride: 0.5, mods: { qol: 1 } },
  vesak: { name: 'VESAK', icon: '\u{2638}\u{FE0F}', kind: 'faith', faith: ['BUDDHIST'], pride: 0.5, mods: { qol: 0.5 } },
  yomkippur: { name: 'JOM KIPPUR', icon: '\u{2721}\u{FE0F}', kind: 'faith', faith: ['JUDISK'], pride: 0.5, mods: { qol: 0.5 } },
  manar: { name: 'MÅNÅRET', icon: '\u{1F9E7}', kind: 'faith', faith: ['FOLKTRO', 'BUDDHIST'], pride: 1, mods: { qol: 1 } },
  grundlag: { name: 'GRUNDLAGENS DAG', icon: '\u{1F4DC}', kind: 'civic', pride: 1, mods: { freedom: 0.5 }, demo: true },
  minnes: { name: 'MINNESDAGEN FÖR DE STUPADE', icon: '\u{1F396}\u{FE0F}', kind: 'civic', pride: 1.5, mods: { readiness: 1 } },
  flaggdag: { name: 'FLAGGANS DAG', icon: '\u{1F6A9}', kind: 'civic', pride: 1.5, mods: {} },
  kvinnor: { name: 'KVINNODAGEN', icon: '\u{1F490}', kind: 'civic', pride: 0, mods: { qol: 0.5, freedom: 0.5 } },
  barn: { name: 'BARNENS DAG', icon: '\u{1F9D2}', kind: 'civic', pride: 0, mods: { welfare: 0.5 } },
  jorden: { name: 'JORDENS DAG', icon: '\u{1F30D}', kind: 'ideo', pride: 0, mods: { qol: 0.5 }, green: true },
  vetenskap: { name: 'VETENSKAPENS DAG', icon: '\u{1F52C}', kind: 'civic', pride: 0.5, mods: { research: 0.5 } },
  seger: { name: 'SEGERDAGEN', icon: '\u{1F396}\u{FE0F}', kind: 'event', pride: 3, mods: { readiness: 1.5 }, needWins: 1 },
  revolution: { name: 'REVOLUTIONSDAGEN', icon: '\u{1F6A9}', kind: 'ideo', pride: 2, mods: { ideopower: 2 }, left: 2 },
  ledare: { name: 'LEDARENS FÖDELSEDAG', icon: '\u{1F382}', kind: 'ideo', pride: 1, mods: { statepower: 2, ideopower: 1 }, cult: true, shame: 1 },
};
export const HOLIDAY_IDS = Object.keys(HOLIDAYS);
// Vilka namngivna helgdagar ett land har i början — resten av det verkliga antalet blir «övriga traditionella»
export function startHolidays(real, majority, hasNatday) {
  const n = Number.isFinite(real.holidays) ? real.holidays : 11;
  const pick = ['nyar'];
  if (hasNatday) pick.push('natday');
  const byFaith = { KRISTEN: ['jul', 'pask'], KATOLSK: ['jul', 'pask'], ORTODOX: ['jul', 'pask'], ISLAM: ['eidf', 'eida'], HINDU: ['diwali'], SIKH: ['diwali'],
    BUDDHIST: ['vesak', 'manar'], JUDISK: ['yomkippur'], FOLKTRO: ['manar'], SEKULAR: [] };
  for (const h of byFaith[majority] || []) pick.push(h);
  if (n >= 9) pick.push('maj1');   // första maj är helgdag i drygt hälften av världens länder
  const named = [...new Set(pick)].slice(0, Math.max(1, n));
  return { named, trad: Math.max(0, n - named.length) };
}
export function holidayCount(h) { return (h?.named?.length || 0) + (h?.trad || 0); }
// Får landet fira den här dagen nu? (ideologin, tron, segrar)
export function holidayAllowed(id, ctx) {
  const H = HOLIDAYS[id];
  if (!H) return 'FINNS INTE';
  if (H.needNatday && !ctx.natday) return 'VÄLJ EN NATIONALDAG I RIKETS SYMBOLER FÖRST';
  if (H.needWins && (ctx.wins || 0) < H.needWins) return 'KRÄVER ATT DU VUNNIT ETT KRIG';
  if (H.demo && (ctx.demo ?? 5) < 5) return 'BARA I ETT LAND MED EN GRUNDLAG SOM GÄLLER (DEMOKRATIINDEX 5+)';
  if (H.cult && (ctx.auth ?? 0) < 55) return 'BARA I EN AUKTORITÄR STAT';
  if ((H.left || 0) >= 2 && !ctx.left) return 'KRÄVER EN SOCIALISTISK ELLER KOMMUNISTISK IDEOLOGI';
  return null;
}

// ================================================================== MONUMENTEN
// cost = % av BNP (en staty ~0,002 %, ett nationalmuseum ~0,03 %), days = byggtid, upkeep = % av kostnaden per spelår
export const MONUMENTS = {
  staty: { name: 'LEDARENS STATY', icon: '\u{1F5FF}', cost: 0.003, days: 60, upkeep: 2, pride: 1.5, tour: 0.005, mods: { statepower: 2 }, cult: true, demoMods: { approval: -2 }, topple: true },
  krigsminne: { name: 'KRIGSMINNESMÄRKET', icon: '\u{1FAA6}', cost: 0.004, days: 90, upkeep: 2, pride: 2, tour: 0.005, mods: { readiness: 1 }, needWar: true },
  okand: { name: 'DEN OKÄNDE SOLDATENS GRAV', icon: '\u{1F525}', cost: 0.003, days: 60, upkeep: 3, pride: 2.5, tour: 0.005, mods: { readiness: 1, approval: 1 }, needWar: true },
  triumf: { name: 'TRIUMFBÅGEN', icon: '\u{1F3DB}\u{FE0F}', cost: 0.012, days: 180, upkeep: 1, pride: 3.5, tour: 0.03, recog: 3, mods: { milpower: 1 }, needWins: 1 },
  museum: { name: 'NATIONALMUSEET', icon: '\u{1F3FA}', cost: 0.03, days: 360, upkeep: 6, pride: 2, tour: 0.04, mods: { hdi: 1, research: 0.5 } },
  opera: { name: 'NATIONALOPERAN', icon: '\u{1F3AD}', cost: 0.04, days: 420, upkeep: 8, pride: 1.5, tour: 0.03, recog: 1, mods: { qol: 1 } },
  bibliotek: { name: 'NATIONALBIBLIOTEKET', icon: '\u{1F4DA}', cost: 0.02, days: 300, upkeep: 6, pride: 1, tour: 0.005, mods: { research: 1.5, hdi: 0.5 } },
  mausoleum: { name: 'MAUSOLEET', icon: '\u{26B1}\u{FE0F}', cost: 0.01, days: 180, upkeep: 4, pride: 2, tour: 0.01, mods: { statepower: 2, ideopower: 2 }, cult: true, topple: true },
  frihet: { name: 'FRIHETSSTATYN', icon: '\u{1F5FD}', cost: 0.008, days: 240, upkeep: 2, pride: 2, tour: 0.035, recog: 4, mods: { freedom: 1 }, demo: true },
  revmon: { name: 'REVOLUTIONSMONUMENTET', icon: '\u{2B50}', cost: 0.006, days: 120, upkeep: 2, pride: 2, tour: 0.005, mods: { ideopower: 3 }, left: true, topple: true },
  helgedom: { name: 'NATIONALHELGEDOMEN', icon: '\u{26EA}', cost: 0.02, days: 480, upkeep: 3, pride: 2, tour: 0.03, mods: { stability: 1, approval: 1 }, faith: true },
  stadion: { name: 'NATIONALARENAN', icon: '\u{1F3DF}\u{FE0F}', cost: 0.05, days: 480, upkeep: 5, pride: 2, tour: 0.02, recog: 1, mods: { qol: 1 } },
  torn: { name: 'LANDMÄRKESTORNET', icon: '\u{1F5FC}', cost: 0.03, days: 360, upkeep: 3, pride: 2, tour: 0.06, recog: 5, mods: {} },
  rymd: { name: 'RYMDMONUMENTET', icon: '\u{1F680}', cost: 0.01, days: 180, upkeep: 2, pride: 1.5, tour: 0.01, recog: 2, mods: { research: 1 }, needSpace: true },
  forsoning: { name: 'FÖRSONINGSMONUMENTET', icon: '\u{1F54A}\u{FE0F}', cost: 0.005, days: 120, upkeep: 2, pride: 1, tour: 0.005, mods: { unrest: -2, stability: 1 }, heal: 10 },
  offer: { name: 'MINNESMÄRKET ÖVER OFFREN', icon: '\u{1F56F}\u{FE0F}', cost: 0.004, days: 90, upkeep: 2, pride: 0.5, tour: 0.005, rel: 3, mods: { approval: 1 } },
};
export function monumentAllowed(id, ctx) {
  const M = MONUMENTS[id];
  if (!M) return 'FINNS INTE';
  if (ctx.built?.includes(id)) return 'FINNS REDAN';
  if (M.needWar && !(ctx.wars || ctx.wins || ctx.losses)) return 'KRÄVER ATT LANDET HAR KRIGAT';
  if (M.needWins && (ctx.wins || 0) < M.needWins) return 'KRÄVER EN SEGER I KRIG';
  if (M.cult && (ctx.auth ?? 0) < 45) return 'FOLKET GÅR INTE MED PÅ PERSONKULT (KRÄVER EN AUKTORITÄR STAT)';
  if (M.demo && (ctx.demo ?? 5) < 6) return 'KRÄVER EN DEMOKRATI (DEMOKRATIINDEX 6+)';
  if (M.left && !ctx.left) return 'KRÄVER EN SOCIALISTISK ELLER KOMMUNISTISK IDEOLOGI';
  if (M.faith && !ctx.stateFaith) return 'KRÄVER EN STATSRELIGION (LAGAR → RELIGION)';
  if (M.needSpace && (ctx.space || 0) < 1) return 'KRÄVER RYMDFORSKNING';
  return null;
}

// ================================================================== ORDNARNA
export const ORDER_COST_PP = 10;
export const AWARDS = {
  minister: { name: 'EN MINISTER', icon: '\u{1F454}', pp: 2, days: 20, desc: 'Ministern växer i ämbetet (+30 erfarenhet).' },
  general: { name: 'EN GENERAL', icon: '\u{1F396}\u{FE0F}', pp: 2, days: 20, desc: 'Beredskapen och moralen stiger en tid.', temp: { readiness: 4, milpower: 2 } },
  hero: { name: 'FOLKETS HJÄLTAR', icon: '\u{1F9D1}\u{200D}\u{2695}\u{FE0F}', pp: 1, days: 15, desc: 'Sjuksköterskor, lärare och brandmän — folket blir stolt.', temp: { approval: 3 }, pride: 0.6 },
  scientist: { name: 'EN FORSKARE', icon: '\u{1F52C}', pp: 2, days: 20, desc: 'Forskningen får en knuff.', temp: { research: 4 } },
  foreign: { name: 'EN UTLÄNDSK STATSCHEF', icon: '\u{1F30D}', pp: 3, days: 0, desc: 'Som Serafimerorden till besökande statschefer: relationen till landet stiger.', rel: 8 },
  sell: { name: 'SÄLJ ORDNAR TILL RIKA', icon: '\u{1F4B0}', pp: 0, days: 30, desc: 'Pengar nu — men korruptionen växer och det kan bli skandal (Storbritannien, «cash for honours» 2006).', corruption: 2 },
};
export const PRESTIGE_HIT = 9;           // varje utdelning nöter på ordens värde …
export const PRESTIGE_REGEN = 0.15;      // … som kommer tillbaka långsamt (per dag)

// ================================================================== SEDLAR OCH FRIMÄRKEN
export const NOTES = {
  heroes: { name: 'NATIONENS STORA', icon: '\u{1F3A8}', mods: {}, pride: 1, desc: 'Konstnärer, forskare och författare (som de svenska sedlarna sedan 2015).' },
  leader: { name: 'LEDARENS PORTRÄTT', icon: '\u{1F935}', mods: { statepower: 2, ideopower: 1 }, demoMods: { approval: -3 }, pride: 0.5, shame: 0.5, desc: 'Ledaren i varje plånbok. I en diktatur väntat, i en demokrati en skandal.' },
  monarch: { name: 'MONARKEN', icon: '\u{1F451}', mods: { stability: 1 }, pride: 1, desc: 'Kungen eller drottningen, som i Storbritannien och Thailand.', needCrown: true },
  nature: { name: 'NATUREN OCH DJUREN', icon: '\u{1F98C}', mods: { qol: 0.5 }, pride: 0.5, tour: 0.005, desc: 'Landskap och djur — ingen blir arg.' },
  monuments: { name: 'BYGGNADER OCH MONUMENT', icon: '\u{1F3DB}\u{FE0F}', mods: {}, pride: 0.5, tour: 0.005, desc: 'Broar, valv och fönster (som eurosedlarna).' },
  ideology: { name: 'IDEOLOGINS SYMBOLER', icon: '\u{1F6A9}', mods: { ideopower: 3 }, pride: 0.5, desc: 'Partiets symboler och revolutionens hjältar.' },
};
export const NOTE_COST_PCT = 0.0003;     // andel av BNP: en ny sedelserie ≈ 0,03 %
export const NOTE_DAYS = 120;            // så lång tid tar det innan de gamla sedlarna är borta
export const STAMP_TOPICS = {
  natday: { name: 'NATIONALDAGEN', icon: '\u{1F389}' },
  flag: { name: 'FLAGGAN', icon: '\u{1F6A9}' },
  leader: { name: 'LEDAREN', icon: '\u{1F935}' },
  animal: { name: 'NATIONALDJURET', icon: '\u{1F98C}' },
  monument: { name: 'DET NYA MONUMENTET', icon: '\u{1F3DB}\u{FE0F}' },
  victory: { name: 'SEGERN', icon: '\u{1F396}\u{FE0F}' },
  science: { name: 'FORSKNINGEN', icon: '\u{1F52C}' },
  sport: { name: 'IDROTTEN', icon: '\u{1F3C5}' },
};
export const STAMP_GAP = 20;             // dagar mellan två frimärken
export const MISPRINT_CHANCE = 0.025;    // ett feltryck blir en raritet (som Inverted Jenny 1918)

// ================================================================== AMBASSADER
export const EMB_OPEN_USD = 25e6;        // att öppna en ambassad
export const EMB_YEAR_USD = 6e6;         // driften per år
export const EMB_PP = 3;
// hur många ambassader ett land har från början om Lowy-indexet saknar det: ungefär efter tyngd
export function embassiesGuess(pop, tier) {
  return Math.round(clamp(8 + Math.log10(Math.max(1e5, pop)) * 6 - 30 + (tier - 1) * 22, 6, 120));
}

// ================================================================== NATIONALSTOLTHETEN
// pride = andel som är «mycket stolta» (World Values Survey). Målet räknas om varje dag; värdet glider dit
// med en halveringstid på ungefär ett och ett halvt spelår.
export const PRIDE_HALF_YEARS = 1.5;
export function prideStep(cur, target) {
  const k = 1 - Math.pow(0.5, 1 / (PRIDE_HALF_YEARS * YEAR));
  return cur + (target - cur) * k;
}
// stoltheten mot startläget → nationsvärden
export function prideMods(pride, pride0) {
  const d = (pride || 0) - (pride0 || 0);
  const lim = (x) => Math.round(clamp(x, -14, 14) * 10) / 10;
  const o = {
    stability: lim(d * 0.15), unrest: lim(-d * 0.12), readiness: lim(d * 0.15), manpower: lim(d * 0.1), approval: lim(d * 0.06),
  };
  if (d > 4) { o.integration = lim(-(d - 4) * 0.08); o.immigration = lim(-(d - 4) * 0.05); }   // chauvinism
  for (const k of Object.keys(o)) if (!o[k]) delete o[k];
  return o;
}

// ================================================================== HJÄLP
export function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
export function sumMods(...list) {
  const o = {};
  for (const m of list) for (const [k, v] of Object.entries(m || {})) if (v) o[k] = (o[k] || 0) + v;
  for (const k of Object.keys(o)) { o[k] = Math.round(o[k] * 10) / 10; if (!o[k]) delete o[k]; }
  return o;
}
export const LAYOUT_IDS = LAYOUTS.map(([id]) => id);
