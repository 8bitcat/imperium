// IMPERIUM V5.20 — MEDIERNA (Henrys önskemål): "nyhetskanaler, och public service som du själv
// bestämmer över".
//
// PUBLIC SERVICE är statens radio- och TV-bolag. Spelaren bestämmer namnet, budgeten (0 nedlagt …
// 4 enormt), hur fritt det står från regeringen (fristående … propagandaapparat), hur det betalas
// och vad det sänder (högst tre inriktningar). Presslagen sätter gränserna.
// NYHETSKANALERNA är landets övriga kanaler: privata, kvällspress, miljardärernas, utländska,
// partikanaler, folkrörelsernas, religiösa och statliga. Var och en har en lutning, räckvidd,
// förtroende och en hållning mot regeringen (stanceOf). Spelaren kan stödja, censurera, stänga,
// köpa upp, starta egna kanaler och bevilja nya.
// MEDIEKLIMATET (mediaSummary) väger ihop allt efter räckvidd och blir en egen källa i
// nationsvärdena (mediaMods). Kanalerna skriver rubriker om det som händer (headline), i sin ton.
//
// Ren logik och data — main.js håller tillståndet (state.solo.media) och kopplar in det.
import { HEADLINES, FILLER, CHANNEL_NAMES, PS_NAMES } from './media-news.js';

// ---------- presslagen → hur fria medierna är (0 styrda … 4 helt fria) ----------
export const PRESS_LEVEL = {
  radicaltransp: 4, transparency: 4, full: 4, free: 4,
  publicservice: 3, laxed: 3,
  mixed: 2, libel: 2, oligarch: 2,
  licensed: 1, state: 1, censorboard: 1,
  highstate: 0, propaganda: 0, typewriters: 0,
};
export const PRESS_NAMES = ['STATENS KONTROLL', 'LICENS OCH TILLSYN', 'BLANDAT', 'MESTADELS FRI', 'HELT FRI'];
export const pressLevelOf = (opt) => PRESS_LEVEL[opt] ?? 2;

// ---------- public service ----------
// drift = % av rikets dagsinkomst, power = hur mycket bolaget påverkar landet
export const PS_BUDGETS = [
  { name: 'NEDLAGT', drift: 0, reach: 0, power: 0 },
  { name: 'LITEN', drift: 0.4, reach: 30, power: 0.55 },
  { name: 'NORMAL', drift: 0.9, reach: 55, power: 1 },
  { name: 'STOR', drift: 1.6, reach: 75, power: 1.5 },
  { name: 'ENORM', drift: 2.6, reach: 92, power: 2.1 },
];
// presslagen begränsar: en propagandaapparat kräver styrd press, och helt fri press tål inte en
export const PS_CONTROL = [
  { name: 'HELT FRISTÅENDE', icon: '\u{1F5FD}', stance: -15, trust: 82, minPress: 2, maxPress: 4,
    mods: { freedom: 6, corruption: -6, approval: -2, statepower: -3 },
    desc: 'Journalisterna granskar alla, regeringen också. Folket litar på dem, korruptionen har svårt att gömma sig — men du får tåla kritik.' },
  { name: 'ARMLÄNGDS AVSTÅND', icon: '\u{1F91D}', stance: 10, trust: 74, minPress: 1, maxPress: 4,
    mods: { freedom: 4, corruption: -4, stability: 2 },
    desc: 'Staten äger och betalar, en styrelse står emellan. Sakligt, pålitligt och lugnande.' },
  { name: 'REGERINGSSTYRT', icon: '\u{1F3DB}\u{FE0F}', stance: 55, trust: 46, minPress: 0, maxPress: 3,
    mods: { approval: 4, statepower: 4, freedom: -4, corruption: 2 },
    desc: 'Regeringen tillsätter cheferna och bestämmer vad som är viktigt. Stödet ökar, men förtroendet sjunker.' },
  { name: 'PROPAGANDAAPPARAT', icon: '\u{1F4E2}', stance: 95, trust: 18, minPress: 0, maxPress: 1,
    mods: { approval: 7, ideopower: 8, stability: 4, statepower: 5, freedom: -10, corruption: 4 },
    desc: 'Allt som sänds hyllar ledaren och ideologin. Effektivt — så länge folk inte slutar titta.' },
];
export const PS_FUNDING = {
  license: { name: 'LICENSAVGIFT', icon: '\u{1F4FA}', drift: 0.5, trust: 8, mods: { approval: -2, freedom: 1 },
    desc: 'Varje hushåll betalar en avgift. Fristående och statens kostnad halveras — men folk klagar på avgiften.' },
  tax: { name: 'SKATT', icon: '\u{1F9FE}', drift: 1, trust: 4, mods: {}, desc: 'Betalas över skatten. Stabilt och utan bråk.' },
  ads: { name: 'REKLAM', icon: '\u{1F4B0}', drift: 0.3, trust: -10, mods: { qol: -1 }, desc: 'Reklamen betalar det mesta. Billigt, men programmen blir sämre och förtroendet sjunker.' },
  state: { name: 'STATSBUDGETEN', icon: '\u{1F3E6}', drift: 1, trust: -6, mods: { statepower: 2 }, desc: 'Regeringen anslår pengar varje år — och kan ta bort dem. Bolaget lyssnar på den som betalar.' },
};
export const PS_FOCUS = {
  news: { name: 'NYHETER', icon: '\u{1F4F0}', mods: { corruption: -3, freedom: 2, approval: -1 }, govMods: { approval: 3, ideopower: 3 } },
  culture: { name: 'KULTUR', icon: '\u{1F3AD}', mods: { integration: 3, ideopower: 2, qol: 2 } },
  fun: { name: 'UNDERHÅLLNING', icon: '\u{1F3AC}', mods: { approval: 4, stability: 2, research: -1 } },
  edu: { name: 'UTBILDNING', icon: '\u{1F393}', mods: { research: 4, hdi: 2 } },
  sport: { name: 'SPORT', icon: '\u{26BD}', mods: { approval: 3, readiness: 2, qol: 1 } },
  kids: { name: 'BARN & UNGA', icon: '\u{1F9F8}', mods: { qol: 3, integration: 2, hdi: 1 } },
  faith: { name: 'TRO', icon: '\u{1F64F}', mods: { stability: 3, ideopower: 2, freedom: -1 } },
  defense: { name: 'BEREDSKAP', icon: '\u{1F6E1}\u{FE0F}', mods: { readiness: 4, safety: 2 } },
};
export const PS_FOCUS_MAX = 3;

// ---------- kanalerna ----------
// axes = [ekonomi −100 vänster … 100 höger, auktoritet 0 fri … 100 styrd] som ideologiernas axlar
export const LEANS = {
  left: { name: 'VÄNSTER', axes: [-60, 30], color: '#e84a5f' },
  center: { name: 'MITTEN', axes: [0, 35], color: '#c9cfd8' },
  right: { name: 'HÖGER', axes: [55, 45], color: '#4a8fe8' },
  liberal: { name: 'LIBERAL', axes: [40, 12], color: '#f2c94c' },
  green: { name: 'GRÖN', axes: [-30, 18], color: '#4ae37a' },
  nat: { name: 'NATIONALISTISK', axes: [10, 75], color: '#c0703a' },
  faith: { name: 'RELIGIÖS', axes: [15, 65], color: '#9b6ae8' },
  gov: { name: 'REGERINGENS', axes: null, color: '#ffb02e' },
};
export const OWNERS = {
  private: { name: 'PRIVAT', icon: '\u{1F4FA}' },
  tabloid: { name: 'KVÄLLSPRESS', icon: '\u{1F5DE}\u{FE0F}' },
  billionaire: { name: 'MILJARDÄR', icon: '\u{1F48E}' },
  foreign: { name: 'UTLÄNDSK', icon: '\u{1F310}' },
  party: { name: 'PARTIKANAL', icon: '\u{1F6A9}' },
  coop: { name: 'FOLKRÖRELSE', icon: '\u{1F3D8}\u{FE0F}' },
  religious: { name: 'RELIGIÖS', icon: '\u{1F64F}' },
  state: { name: 'STATLIG', icon: '\u{1F3DB}\u{FE0F}' },
};
export const TONES = {
  friendly: { name: 'VÄNLIG', color: '#4ae37a' },
  neutral: { name: 'SAKLIG', color: '#c9cfd8' },
  critical: { name: 'KRITISK', color: '#ff6b5e' },
  propaganda: { name: 'PROPAGANDA', color: '#ffb02e' },
};

// priser
export const COSTS = {
  censor: 20,          // ⚖️
  close: 35,           // ⚖️ (dubbelt med fri press)
  control: 25,         // ⚖️ per steg i public service-styrningen
  funding: 15,         // ⚖️
  focus: 5,            // ⚖️
  startPP: 15,         // ⚖️ för att starta en statskanal
  startDays: 30,       // … och dagsinkomster i pengar
  buyDays: 1.2,        // köpa upp: dagsinkomster per procent räckvidd
  support: 0.25,       // stöd: % av dagsinkomsten per kanal och dag
  stateRun: 0.35,      // egna statskanaler: % av dagsinkomsten per kanal och dag
};

// ---------- slump med frö (samma land får samma kanaler) ----------
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
const pickR = (r, arr) => arr[Math.floor(r() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function fillVars(t, v = {}) {
  return String(t || '').replace(/\{(\w+)\}/g, (m, k) => (v[k] != null && v[k] !== '' ? String(v[k]) : m));
}

function channelName(r, owner, vars, taken) {
  const list = CHANNEL_NAMES?.[owner]?.length ? CHANNEL_NAMES[owner] : ['NYHETSKANALEN', 'DAGSNYTT', 'KANAL ETT'];
  for (let i = 0; i < 12; i++) {
    const n = fillVars(pickR(r, list), vars).toUpperCase();
    if (!taken.has(n) && !/\{/.test(n)) { taken.add(n); return n; }
  }
  const n = `${fillVars(pickR(r, list), vars).toUpperCase().replace(/\{\w+\}/g, '')} ${taken.size + 1}`.trim();
  taken.add(n);
  return n;
}

const OWNER_LEANS = {
  private: ['center', 'right', 'liberal', 'left', 'center'],
  tabloid: ['center'],
  billionaire: ['right', 'liberal', 'nat'],
  foreign: ['liberal', 'center', 'nat', 'left'],
  party: ['left', 'right', 'green', 'nat'],
  coop: ['left', 'green', 'center'],
  religious: ['faith'],
  state: ['gov'],
};

function newChannel(r, owner, vars, taken, day, reach = null) {
  const lean = pickR(r, OWNER_LEANS[owner] || ['center']);
  return {
    id: 'k' + Math.floor(r() * 1e9).toString(36),
    name: channelName(r, owner, vars, taken),
    owner, lean,
    reach: reach ?? Math.round(owner === 'tabloid' ? 18 + r() * 22 : owner === 'private' ? 10 + r() * 30
      : owner === 'billionaire' ? 8 + r() * 20 : owner === 'state' ? 20 + r() * 25 : 3 + r() * 12),
    trust: Math.round(owner === 'tabloid' ? 25 + r() * 20 : owner === 'foreign' ? 35 + r() * 25
      : owner === 'state' ? 30 + r() * 20 : 45 + r() * 30),
    status: 'on', support: 0, founded: day,
    hue: Math.floor(r() * 360),
  };
}

// Landets medier vid start: fler och friare kanaler med fri press, färre och statliga utan.
// vars = { rike, stad, huvudstad } · wealth 1–3 (economy.js)
export function initMedia(seed, pressLevel, vars, wealth = 1.5, day = 1) {
  const r = rng('media:' + seed);
  const taken = new Set();
  const ch = [];
  const plan = pressLevel >= 3
    ? ['private', 'private', 'tabloid', 'billionaire', 'coop', 'foreign', ...(wealth >= 2 ? ['private', 'tabloid'] : []), 'religious']
    : pressLevel === 2
      ? ['private', 'tabloid', 'billionaire', 'state', 'foreign', 'religious']
      : pressLevel === 1
        ? ['state', 'state', 'private', 'party', 'religious']
        : ['state', 'state', 'party'];
  for (const owner of plan) {
    const c = newChannel(r, owner, vars, taken, day);
    if (owner === 'party' && pressLevel <= 1) c.lean = 'gov';
    if (pressLevel === 0 && owner !== 'state' && owner !== 'party') c.status = 'censored';
    ch.push(c);
  }
  const psName = fillVars(pickR(r, PS_NAMES?.length ? PS_NAMES : ['{rike}S RADIO OCH TV']), vars).toUpperCase();
  return {
    ps: {
      name: psName,
      budget: pressLevel >= 2 ? 2 : 1,
      control: pressLevel >= 3 ? 1 : pressLevel === 2 ? 1 : pressLevel === 1 ? 2 : 3,
      funding: pressLevel >= 3 ? 'license' : pressLevel === 2 ? 'tax' : 'state',
      focus: pressLevel >= 2 ? ['news', 'culture', 'kids'] : ['news', 'sport', 'defense'],
    },
    channels: ch,
    banned: [],          // [{ name, owner, day }]
    apps: [],            // ansökningar om sändningstillstånd [{ ...kanal, day }]
    trustShock: 0,       // händelsernas förtroendechocker, klingar av
    fx: {},              // statistikens glidande medieeffekter
    seq: 0,
  };
}

// ---------- hållningen ----------
// gov = { axes: {econ, auth}, approval, pressLevel, control (PS), worldRel (medel −100…100) }
export function stanceOf(c, gov) {
  let st;
  if (c.owner === 'state' || c.lean === 'gov') st = gov.pressLevel <= 1 ? 90 : 70;
  else if (c.owner === 'tabloid') st = (gov.approval || 0) * 0.55 - 10;   // folkets humör
  else if (c.owner === 'foreign') st = -30 + (gov.worldRel || 0) * 0.5;
  else {
    const L = LEANS[c.lean]?.axes || [0, 35];
    const d = Math.hypot((L[0] - (gov.axes?.econ ?? 0)) / 2, L[1] - (gov.axes?.auth ?? 40));
    st = 60 - d * 1.9;
  }
  st += (gov.approval || 0) * 0.12;                 // medvind smittar
  if (c.support > (gov.day || 0)) st += 30;         // statligt stöd
  if (c.status === 'censored') st = Math.max(st, 60);
  return clamp(Math.round(st), -100, 100);
}
export function psStanceOf(ps, gov) {
  return clamp(Math.round(PS_CONTROL[ps.control].stance + (gov.approval || 0) * 0.1), -100, 100);
}
export function toneOf(stance, propaganda) {
  if (propaganda) return 'propaganda';
  return stance >= 35 ? 'friendly' : stance <= -20 ? 'critical' : 'neutral';
}
// kanalens ton i nyheterna
export function channelTone(c, gov) {
  const prop = (c.owner === 'state' || c.lean === 'gov') && gov.pressLevel <= 0
    || (c.status === 'censored' && gov.pressLevel <= 0);
  return toneOf(stanceOf(c, gov), prop);
}
export function psTone(ps, gov) {
  return toneOf(psStanceOf(ps, gov), ps.control >= 3);
}
export const channelTrust = (c) => clamp(c.trust - (c.status === 'censored' ? 25 : 0), 2, 98);
export function psTrust(m) {
  const ps = m.ps;
  return clamp(PS_CONTROL[ps.control].trust + (PS_FUNDING[ps.funding]?.trust || 0) + (m.trustShock || 0) * 0.5, 2, 98);
}
export function psReach(ps) {
  if (!ps.budget) return 0;
  const base = PS_BUDGETS[ps.budget].reach;
  return Math.round(base * (ps.control >= 3 ? 0.75 : 1) * (ps.funding === 'ads' ? 0.9 : 1));
}

export const activeChannels = (m) => (m?.channels || []).filter((c) => c.status !== 'banned');

// ---------- medieklimatet ----------
// → { reach, climate, critical, friendly, stateShare, trust, channels, censored, banned, psReach, psTrust }
export function mediaSummary(m, gov) {
  if (!m) return null;
  const list = activeChannels(m).map((c) => ({ reach: c.reach, st: stanceOf(c, gov), trust: channelTrust(c), state: c.owner === 'state' || c.lean === 'gov' }));
  const pr = psReach(m.ps);
  if (pr) list.push({ reach: pr, st: psStanceOf(m.ps, gov), trust: psTrust(m), state: true, ps: true });
  const tot = list.reduce((a, x) => a + x.reach, 0) || 1;
  const w = (f) => list.reduce((a, x) => a + (f(x) ? x.reach : 0), 0) / tot * 100;
  return {
    reach: Math.min(98, Math.round(tot * 0.55 + 10)),   // publiken överlappar
    climate: Math.round(list.reduce((a, x) => a + x.st * x.reach, 0) / tot),
    critical: Math.round(w((x) => x.st <= -20)),
    friendly: Math.round(w((x) => x.st >= 35)),
    stateShare: Math.round(w((x) => x.state)),
    trust: Math.round(clamp(list.reduce((a, x) => a + x.trust * x.reach, 0) / tot + (m.trustShock || 0), 2, 98)),
    channels: activeChannels(m).length,
    censored: (m.channels || []).filter((c) => c.status === 'censored').length,
    banned: (m.banned || []).length,
    psReach: pr,
    psTrust: Math.round(psTrust(m)),
    pressLevel: gov.pressLevel,
  };
}

// ---------- medierna i nationsvärdena ----------
export function mediaMods(m, sum, gov) {
  const out = {};
  if (!m || !sum) return out;
  const add = (mods, f) => { for (const [k, v] of Object.entries(mods || {})) out[k] = (out[k] || 0) + v * f; };
  // public service: styrning + finansiering + inriktning, i bolagets storlek och förtroende
  const ps = m.ps;
  const P = PS_BUDGETS[ps.budget].power * (0.5 + psTrust(m) / 140);
  if (P > 0) {
    add(PS_CONTROL[ps.control].mods, P);
    add(PS_FUNDING[ps.funding]?.mods, Math.min(1, P));
    for (const f of ps.focus || []) {
      const F = PS_FOCUS[f];
      if (F) add(ps.control >= 2 && F.govMods ? F.govMods : F.mods, P * 0.8);
    }
  }
  // klimatet: vänliga medier ger stöd, kritiska sänker det men håller korruptionen borta
  add({ approval: 0.1, stability: 0.04 }, sum.climate);
  add({ corruption: -0.1, freedom: 0.04 }, sum.critical * (sum.trust / 60));
  // statens grepp om medierna
  if (gov.pressLevel <= 1) add({ ideopower: 0.08 }, sum.stateShare);
  add({ freedom: -0.05 }, Math.max(0, sum.stateShare - 30));
  add({ freedom: -3, unrest: gov.pressLevel >= 3 ? 1.5 : 0.5 }, sum.censored);
  add({ freedom: -1.5 }, Math.min(6, sum.banned));
  if (sum.trust < 30) add({ stability: -3, unrest: 2 }, 1);
  if (sum.channels >= 6 && gov.pressLevel >= 3) add({ research: 2, freedom: 3 }, 1);
  for (const k of Object.keys(out)) { out[k] = Math.round(out[k]); if (!out[k]) delete out[k]; }
  return out;
}

// pengar per dag (i % av dagsinkomsten): public service + stöd + egna statskanaler
export function mediaCostPct(m, day) {
  if (!m) return 0;
  const ps = m.ps;
  let pct = PS_BUDGETS[ps.budget].drift * (PS_FUNDING[ps.funding]?.drift ?? 1);
  for (const c of activeChannels(m)) {
    if (c.support > day) pct += COSTS.support;
    if (c.owner === 'state') pct += COSTS.stateRun;
  }
  return pct;
}

// ---------- statistiken: vart medierna drar måtten (main.js glider dit) ----------
export function mediaIndTargets(sum) {
  if (!sum) return {};
  const indep = 100 - sum.stateShare;
  return {
    pressfree: (indep - 55) * 0.18 - sum.censored * 4 - Math.min(6, sum.banned) * 2 + (sum.critical - 20) * 0.08,
    trustgov: sum.climate * 0.08,
    demo_civ: -sum.censored * 0.25 - Math.min(6, sum.banned) * 0.1 + (sum.critical > 30 ? 0.15 : 0),
    demo_cult: (sum.trust - 50) * 0.008,
    voice: (indep - 55) * 0.004 - sum.censored * 0.06,
  };
}

// ---------- rubrikerna ----------
const recent = [];
export function headline(topic, tone, vars) {
  const T = HEADLINES?.[topic];
  const list = T?.[tone]?.length ? T[tone] : T?.neutral || [];
  if (!list.length) return null;
  for (let i = 0; i < 6; i++) {
    const h = list[Math.floor(Math.random() * list.length)];
    if (recent.includes(h) && i < 5) continue;
    recent.push(h);
    if (recent.length > 30) recent.shift();
    const out = fillVars(h, vars);
    if (/\{\w+\}/.test(out)) continue;   // en platshållare saknas — ta en annan
    return out.toUpperCase();
  }
  return null;
}
export function filler(vars) {
  if (!FILLER?.length) return null;
  for (let i = 0; i < 6; i++) {
    const out = fillVars(FILLER[Math.floor(Math.random() * FILLER.length)], vars);
    if (!/\{\w+\}/.test(out)) return out.toUpperCase();
  }
  return null;
}

// en ny kanal som söker sändningstillstånd
export function applicant(m, vars, day) {
  const r = rng('app:' + (m.seq = (m.seq || 0) + 1) + ':' + day + ':' + Math.random());
  const taken = new Set([...(m.channels || []).map((c) => c.name), ...(m.banned || []).map((b) => b.name)]);
  const owner = pickR(r, ['private', 'private', 'tabloid', 'billionaire', 'coop', 'foreign', 'religious', 'party']);
  return newChannel(r, owner, vars, taken, day, Math.round(3 + r() * 9));
}
export function stateChannel(m, name, vars, day) {
  const r = rng('state:' + day + ':' + Math.random());
  const c = newChannel(r, 'state', vars, new Set((m.channels || []).map((x) => x.name)), day, 8);
  if (name) c.name = String(name).toUpperCase().slice(0, 24);
  c.lean = 'gov';
  return c;
}
// kanalens logga: färgad ruta med initialer
export function channelInitials(name) {
  const w = String(name || '?').replace(/[^A-ZÅÄÖ0-9 ]/gi, ' ').trim().split(/\s+/);
  return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
}
