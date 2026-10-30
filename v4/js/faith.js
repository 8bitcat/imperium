// IMPERIUM V5.12 — TRON. Vilken religion folket har, vilken staten valt, och
// vad som händer när de inte är samma. Ren logik: main.js håller tillståndet
// (state.solo.faith) och statistics.js visar fördelningen i STATISTIK.
//
// Folket: RELIGION_SHARES (ungefär Pew 2020) per land, i spelets tio grupper.
// Staten: religionslagen säger om staten HAR en tro (statskyrka, statsreligion,
// religiös lag, prästerskapets styre), är neutral (sekulär, pluralism) eller
// emot tro (ateism, religion förbjuden).
//
// Med en statsreligion omvänds folket långsamt — snabbare ju hårdare lagen.
// Så länge många troende har en ANNAN tro än staten blir det oro, och väljer
// staten en tro som folket inte har blir det totalt kaos tills omvändelsen
// hunnit ikapp. Omvändelsen sparas per land som en lista steg [[religion, andel]]
// — ett nyerövrat land med en annan tro börjar alltså om från noll.
import { RELIGIONS, religionOf } from './integration.js';
import { RELIGION_SHARES } from './country-data.js';

export const FAITHS = ['KRISTEN', 'KATOLSK', 'ORTODOX', 'ISLAM', 'JUDISK', 'HINDU', 'BUDDHIST', 'SIKH', 'FOLKTRO'];
export const FAITH_KEYS = [...FAITHS, 'SEKULAR'];

// religionslagens alternativ: hur hårt staten driver sin tro (0 = har ingen)
export const STATE_FAITH = { established: 0.6, statereligion: 1, religiouslaw: 1.4, clergyrule: 1.8 };
export const NO_FAITH = { banned: true, atheism: true };

export function faithKind(opt) {
  if (STATE_FAITH[opt]) return 'state';
  if (NO_FAITH[opt]) return 'none';
  return 'neutral';
}

// Omvändelse per dag med en statsreligion av styrka 1: hela folket på ~600 dagar (5 spelår)
const CONVERT_PER_DAY = 1 / 600;
export const convertRate = (opt) => (STATE_FAITH[opt] || 0) * CONVERT_PER_DAY;

// Landets fördelning i startläget (summerar till 100). Saknas data: huvudreligionen
// enligt spelets gamla tabell, lite sekulära och lite övriga.
const fallback = new Map();
export function sharesOf(cid) {
  const s = RELIGION_SHARES[cid];
  if (s) return s;
  if (!fallback.has(cid)) {
    const main = religionOf(cid) || 'FOLKTRO';
    const f = Object.fromEntries(FAITH_KEYS.map((k) => [k, 0]));
    if (main === 'SEKULAR') { f.SEKULAR = 55; f.KRISTEN = 40; f.ISLAM = 5; }
    else { f[main] += 86; f.SEKULAR += 8; f[main === 'FOLKTRO' ? 'KRISTEN' : 'FOLKTRO'] += 6; }
    fallback.set(cid, f);
  }
  return fallback.get(cid);
}

// Ett omvändelsesteg: andelen c av de troende som INTE redan har tron `rel` går över till den
export function convert(S, rel, c) {
  if (!(c > 0) || !rel) return S;
  const out = { ...S };
  let moved = 0;
  for (const k of FAITHS) {
    if (k === rel) continue;
    const m = (S[k] || 0) * Math.min(1, c);
    out[k] = (S[k] || 0) - m;
    moved += m;
  }
  out[rel] = (S[rel] || 0) + moved;
  return out;
}

// Fördelningen i ett land efter alla omvändelsesteg
export function compositionOf(cid, steps) {
  let S = sharesOf(cid);
  for (const [rel, c] of steps || []) S = convert(S, rel, c);
  return S;
}

// Största tron bland de troende (aldrig SEKULAR) — "mest anknuten till".
// De kristna räknas ihop först: är de tillsammans störst blir det deras största kyrka.
export const CHRISTIAN = ['KRISTEN', 'KATOLSK', 'ORTODOX'];
export function majorityFaith(S) {
  let best = 'KRISTEN', bv = -1, bestC = 'KRISTEN', cv = -1, sumC = 0;
  for (const k of FAITHS) {
    const v = S[k] || 0;
    if (CHRISTIAN.includes(k)) { sumC += v; if (v > cv) { bestC = k; cv = v; } }
    else if (v > bv) { best = k; bv = v; }
  }
  return sumC >= bv ? bestC : best;
}

// Hur långt ifrån varandra två trosriktningar står (0 = samma, 1 = helt olika)
export function faithDistance(a, b) {
  if (a === b) return 0;
  if (CHRISTIAN.includes(a) && CHRISTIAN.includes(b)) return 0.35;
  return RELIGIONS[a]?.fam && RELIGIONS[a].fam === RELIGIONS[b]?.fam ? 0.8 : 1;
}

// Hur stor del av de troende har en ANNAN tro än staten? Närliggande tro
// (t.ex. katoliker under en protestantisk statskyrka) räknas som en del av skillnaden.
export function mismatch(S, rel) {
  const believers = FAITHS.reduce((a, k) => a + (S[k] || 0), 0);
  if (!rel || believers <= 0.5) return 0;
  let off = 0;
  for (const k of FAITHS) off += (S[k] || 0) * faithDistance(k, rel);
  return Math.max(0, Math.min(1, off / believers));
}

// Kaos 0..1: bara en stat MED tro får sitt folk emot sig
export function chaosOf(S, rel, opt) {
  if (faithKind(opt) !== 'state' || !rel) return 0;
  const m = mismatch(S, rel);
  // lite olikhet är vardag; över ungefär en femtedel börjar det skava på riktigt
  return Math.max(0, Math.min(1, (m - 0.08) * 1.25 * Math.sqrt(STATE_FAITH[opt])));
}

export function chaosLabel(ch) {
  return ch >= 0.7 ? 'TOTALT KAOS' : ch >= 0.45 ? 'UPPLOPP' : ch >= 0.25 ? 'ORO' : ch >= 0.08 ? 'SPÄNNINGAR' : 'LUGNT';
}

// Kaosets effekt på nationsvärdena
export function chaosMods(ch) {
  if (!(ch > 0.005)) return {};
  const r = (k) => Math.round(k * ch);
  return {
    unrest: r(55), stability: r(-45), approval: r(-38), safety: r(-32), integration: r(-30),
    qol: r(-16), gdp: r(-16), income: r(-14), factory: r(-12), ideopower: r(-22), polpower: r(-8),
    immigration: r(-18), corruption: r(10),
  };
}
