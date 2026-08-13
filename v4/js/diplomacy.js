// IMPERIUM V5 — DIPLOMATI. Relationer är valutan: allianser, vapenvila,
// sanktioner och block läser alla samma relationsvärde (−100 … +100).
import { IDEO_AXIS, RELIGIONS } from './integration.js';

export const REL = {
  ALLIED: 70, FRIENDLY: 35, NEUTRAL: 0, COOL: -25, HOSTILE: -55,
};

export function relLabel(v) {
  if (v >= 70) return { name: 'ALLIERADE', color: '#4ae37a' };
  if (v >= 35) return { name: 'VÄNSKAPLIG', color: '#8fd8a0' };
  if (v >= -15) return { name: 'NEUTRAL', color: '#7fd1e8' };
  if (v >= -45) return { name: 'KYLIG', color: '#ffb02e' };
  if (v >= -75) return { name: 'FIENTLIG', color: '#ff8a5e' };
  return { name: 'HATAR DIG', color: '#ff4f4f' };
}

// Naturligt läge mellan två nationer utifrån ideologi och religion.
// Relationen driver långsamt mot detta värde; händelser ger stora hopp.
export function naturalRelation(myIdeo, theirIdeo, myRel, theirRel) {
  const gap = Math.abs((IDEO_AXIS[myIdeo] ?? 0) - (IDEO_AXIS[theirIdeo] ?? 0));
  let v = 25 - gap * 14;                       // samma ideologi = +25, motpol = −59
  if (myRel && theirRel && myRel !== theirRel) {
    v -= RELIGIONS[myRel]?.fam === RELIGIONS[theirRel]?.fam ? 5 : 14;
  }
  return Math.max(-80, Math.min(60, v));
}

// Händelser som flyttar relationen direkt
export const REL_EVENTS = {
  war: -45, justify: -25, conquer: -35, ally: 30, breakAlly: -50,
  trade: 8, gift: 12, sanction: -20, coup: -30, liberate: 20, truce: 5,
};

// ---------- SANKTIONER ----------
// Auktoritära ideologier stöts bort av demokratier — och lockar andra diktaturer.
export const SANCTION_LEVELS = [
  { at: -20, id: 'tariff', name: 'TULLAR', icon: '\u{1F4B8}', desc: 'HANDELN BESKATTAS', income: -0.08 },
  { at: -45, id: 'embargo', name: 'HANDELSSTOPP', icon: '\u{1F6AB}', desc: 'INGEN HANDEL ALLS', income: -0.18 },
  { at: -65, id: 'sanction', name: 'HÅRDA SANKTIONER', icon: '\u{2620}\u{FE0F}', desc: 'EKONOMIN STRYPS', income: -0.3 },
  { at: -85, id: 'expelled', name: 'UTESLUTEN UR FN', icon: '\u{1F30D}', desc: 'ISOLERAD FRÅN VÄRLDEN', income: -0.42 },
];

export function sanctionFor(rel) {
  let s = null;
  for (const lv of SANCTION_LEVELS) if (rel <= lv.at) s = lv;
  return s;
}

// ---------- ALLIANSER ----------
export const ALLY_MIN_REL = 40;      // krävs för att ens få fråga
export const TRUCE_DAYS = 360;       // tre spelår (120 dagar/år)

// Vill AI:t gå med på allians? Väger relation, hot och ideologisk närhet.
export function aiAcceptsAlliance(rel, theirStance, threatened) {
  let chance = (rel - ALLY_MIN_REL) / 60;
  if (threatened) chance += 0.35;
  if (theirStance === 'defensive') chance += 0.2;
  if (theirStance === 'ultra') chance -= 0.4;
  return Math.random() < Math.max(0, Math.min(0.95, chance));
}

// ---------- FAKTIONER / BLOCK ----------
export const BLOC_TYPES = {
  defense: { name: 'FÖRSVARSPAKT', icon: '\u{1F6E1}\u{FE0F}', desc: 'ALLA FÖRSVARAR ALLA' },
  trade: { name: 'FRIHANDELSBLOCK', icon: '\u{1F91D}', desc: 'FRI HANDEL OCH RÖRLIGHET' },
  ideology: { name: 'IDEOLOGISKT BLOCK', icon: '\u{1F5F3}\u{FE0F}', desc: 'BARA EN IDEOLOGI SLÄPPS IN' },
};

export const BLOC_COST = 120;        // political power för att grunda ett block
