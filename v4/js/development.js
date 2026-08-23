// IMPERIUM V5 — STADSNIVÅ & INFRASTRUKTUR.
//
// Varje land i världen har två utvecklingsvärden, båda 0–100. ALLA länder —
// inklusive ditt — börjar på 0 och byggs upp därifrån.
//
//   INFRASTRUKTUR  vägar, järnväg, hamnar, elnät, bredband.
//                  → bättre handel och högre fabriksproduktion
//   STADSNIVÅ      hur modern och teknisk bebyggelsen är.
//                  → högre livskvalitet, mer forskning, rikare befolkning
//
// AI-länderna bygger också. Ett land som satsat i femtio år ser annorlunda ut på
// kartan än ett som inte gjort det — och det syns direkt i INFRASTRUKTUR-lagret,
// som går från mörkrött (ingenting) till mörkblått (världsledande).

export const DEV_MAX = 100;

export const DEV_KINDS = {
  infra: {
    name: 'INFRASTRUKTUR', icon: '\u{1F309}',
    desc: 'Vägar, järnvägar, hamnar och elnät. Höjer handelns värde och fabrikernas produktion.',
  },
  tier: {
    name: 'STADSNIVÅ', icon: '\u{1F3D9}\u{FE0F}',
    desc: 'Hur modern bebyggelsen är. Höjer livskvalitet, forskning och välstånd.',
  },
};

// Ett steg = 5 nivåer. Priset stiger brant — de sista stegen är ett livsverk.
export const DEV_STEP = 5;

export function stepCost(level) {
  const t = level / DEV_MAX;                       // 0..1
  return {
    money: Math.round(220 + 2600 * t * t),         // 220 → 2820
    rp: Math.round(8 + 150 * t * t),               // 8 → 158
    days: Math.round(8 + 40 * t),                  // 8 → 48
  };
}

// ---------- LAGRING ----------
// world.devLevels = { cid: { infra, tier } } — delas av spelare och AI.
export function devOf(world, cid) {
  world.devLevels ||= {};
  return (world.devLevels[cid] ||= { infra: 0, tier: 0 });
}

export function raiseDev(world, cid, kind, amount = DEV_STEP) {
  const d = devOf(world, cid);
  const before = d[kind] || 0;
  d[kind] = Math.min(DEV_MAX, before + amount);
  return d[kind] - before;
}

// Snittnivå över de länder du äger — det är den som ger dig dina bonusar.
export function realmDev(world, cids) {
  const list = (cids || []).filter(Boolean);
  if (!list.length) return { infra: 0, tier: 0 };
  let infra = 0, tier = 0;
  for (const cid of list) {
    const d = devOf(world, cid);
    infra += d.infra || 0;
    tier += d.tier || 0;
  }
  return { infra: infra / list.length, tier: tier / list.length };
}

// ---------- EFFEKTER ----------
// Vid nivå 100 i båda: +30 factory, +26 income, +14 gdp, +26 qol, +20 research,
// +14 hdi. Det är en stor men inte spelavgörande satsning — den tar hela partiet.
export function devMods(world, cids) {
  const { infra, tier } = realmDev(world, cids);
  const i = infra / DEV_MAX, t = tier / DEV_MAX;
  return {
    factory: Math.round(30 * i),
    income: Math.round(26 * i),
    gdp: Math.round(14 * i + 10 * t),
    qol: Math.round(26 * t),
    research: Math.round(20 * t),
    hdi: Math.round(14 * t),
  };
}

// Handelsavtal blir billigare ju bättre infrastruktur du har (0.6× vid nivå 100).
export function tradeDevFactor(world, cids) {
  return 1 - 0.4 * (realmDev(world, cids).infra / DEV_MAX);
}

// ---------- KARTLAGRET ----------
// Mörkrött (ingen infrastruktur) → mörkblått (världsledande).
export const DEV_RAMP = [
  { at: 0,   color: '#4a0d12', name: 'INGEN'          },
  { at: 15,  color: '#8c2318', name: 'MYCKET LÅG'     },
  { at: 30,  color: '#c05a1c', name: 'LÅG'            },
  { at: 45,  color: '#d8b02c', name: 'GRUNDLÄGGANDE'  },
  { at: 60,  color: '#5aa03e', name: 'GOD'            },
  { at: 75,  color: '#2f86b8', name: 'MODERN'         },
  { at: 90,  color: '#1d4f9c', name: 'AVANCERAD'      },
  { at: 100, color: '#0d2154', name: 'VÄRLDSLEDANDE'  },
];

function lerpHex(a, b, t) {
  const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [r1, g1, b1] = p(a), [r2, g2, b2] = p(b);
  const c = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

export function devColor(level) {
  const v = Math.max(0, Math.min(DEV_MAX, level || 0));
  for (let i = 0; i < DEV_RAMP.length - 1; i++) {
    const a = DEV_RAMP[i], b = DEV_RAMP[i + 1];
    if (v <= b.at) return lerpHex(a.color, b.color, (v - a.at) / (b.at - a.at || 1));
  }
  return DEV_RAMP[DEV_RAMP.length - 1].color;
}

export function devLabel(level) {
  let last = DEV_RAMP[0];
  for (const r of DEV_RAMP) if (level >= r.at) last = r;
  return last.name;
}

// Färgkarta för hela globen — matas rakt in i globe.setTerrainColors().
export function devColorMap(world, countries, kind = 'infra') {
  const map = {};
  for (const c of countries) map[c.id] = devColor(devOf(world, c.id)[kind] || 0);
  return map;
}

// ---------- AI ----------
// AI-länder bygger utifrån sin dröm och sin ekonomiska tyngd. Rika, fredliga
// länder drar ifrån; länder i krig bygger nästan ingenting.
export function aiDevStep(world, cid, opts = {}) {
  const d = devOf(world, cid);
  const { wealth = 1, atWar = false, dream = 'eco' } = opts;
  if (atWar && Math.random() < 0.7) return null;
  // vilken av de två satsar landet på?
  const wantTier = dream === 'wel' || dream === 'space' ? 0.6 : dream === 'eco' ? 0.45 : 0.25;
  const kind = Math.random() < wantTier ? 'tier' : 'infra';
  // ju högre nivå desto trögare — och fattiga länder kommer aldrig långt
  const lvl = d[kind] || 0;
  const chance = wealth * (1 - lvl / (DEV_MAX * 1.15)) * 0.55;
  if (Math.random() > chance) return null;
  const gained = raiseDev(world, cid, kind, DEV_STEP);
  return gained ? { kind, level: d[kind], gained } : null;
}
