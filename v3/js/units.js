// IMPERIUM v3 — enheter, skademat­ris, pixelsprites och biom (delas av båda stridsprototyperna)
import { resourcesOf } from './resources.js';

export const UNIT_TYPES = {
  INF:  { name: 'INFANTERI',  mv: 3, spd: 30, range: 58,  aggro: 110 },
  TANK: { name: 'STRIDSVAGN', mv: 5, spd: 46, range: 74,  aggro: 130 },
  FLYG: { name: 'FLYGPLAN',   mv: 6, spd: 80, range: 88,  aggro: 160 },
};

// Basskada i % (Advance Wars-stil): rad = anfallare, kolumn = försvarare
export const DMG = {
  INF:  { INF: 55, TANK: 18, FLYG: 8 },
  TANK: { INF: 70, TANK: 45, FLYG: 12 },
  FLYG: { INF: 60, TANK: 55, FLYG: 45 },
};

// HP-förlust 1..7 baserat på matris, anfallarens HP och försvararens terrängbonus
export function attackDamage(att, def, terrDef = 0) {
  const base = DMG[att.type][def.type];
  const dmg = base * (att.hp / 10) * (1 - 0.12 * terrDef);
  return Math.max(1, Math.round(dmg / 10));
}

export function mkUnit(type, side) { return { type, side, hp: 10 }; }

export const STARTER_ARMY = () => [
  mkUnit('INF', 0), mkUnit('INF', 0), mkUnit('INF', 0), mkUnit('INF', 0),
  mkUnit('TANK', 0), mkUnit('TANK', 0), mkUnit('FLYG', 0),
];

// Försvarsarmé genereras ur landets storlek + tillgångar (deterministiskt)
export function defenderArmy(country, facts) {
  const pop = facts?.p || 5e6;
  const n = Math.max(3, Math.min(8, 2 + Math.floor(pop / 25e6) + (pop > 5e6 ? 1 : 0)));
  const res = resourcesOf(country.id);
  const units = [];
  for (let i = 0; i < n; i++) {
    let t = 'INF';
    if (i % 3 === 2 && (res.includes('JARN') || res.includes('OLJA'))) t = 'TANK';
    else if (i % 4 === 3 && res.includes('GULD')) t = 'FLYG';
    else if (i % 5 === 4) t = 'TANK';
    units.push(mkUnit(t, 1));
  }
  return units;
}

export function compOf(units) {
  const c = { INF: 0, TANK: 0, FLYG: 0 };
  for (const u of units) c[u.type]++;
  return c;
}

// ---------- snabbresultat (tärningsmodell — konfliktförslag C) ----------
export function autoResolve(atkUnits, defUnits) {
  const a = atkUnits.map((u) => ({ ...u }));
  const d = defUnits.map((u) => ({ ...u }));
  let rounds = 0;
  while (a.some((u) => u.hp > 0) && d.some((u) => u.hp > 0) && rounds < 40) {
    rounds++;
    const volley = (from, to, defBonus) => {
      const alive = to.filter((u) => u.hp > 0);
      if (!alive.length) return;
      for (const u of from) {
        if (u.hp <= 0) continue;
        const target = alive[(rounds * 7 + u.hp * 3) % alive.length];
        if (target.hp <= 0) continue;
        target.hp = Math.max(0, target.hp - attackDamage(u, target, defBonus));
      }
    };
    volley(a, d, 1);   // försvararen har hemmaplansbonus
    volley(d, a, 0);
  }
  const surA = a.filter((u) => u.hp > 0);
  const surD = d.filter((u) => u.hp > 0);
  return { winner: surA.length && !surD.length ? 0 : surD.length && !surA.length ? 1 : (surA.length >= surD.length ? 0 : 1), survivorsA: surA, survivorsD: surD, rounds };
}

// ---------- biom ----------
export function biomeFor(country) {
  const lat = Math.abs(country.centroid[1]);
  const res = resourcesOf(country.id);
  if (lat > 55) return 'SNO';
  if (res.includes('OLJA') && lat < 38) return 'OKEN';
  if (lat < 25 && res.includes('TIMMER')) return 'DJUNGEL';
  return 'GRAS';
}

export const BIOMES = {
  GRAS:    { name: 'GRÄSMARK', ground: '#2e6b3a', alt: '#28603302', alt2: '#286033', forest: '#1c4526', mount: '#6b6f76', sky: '#0a2740' },
  SNO:     { name: 'SNÖ',      ground: '#b9c9d6', alt2: '#aebfcd', forest: '#7d99a8', mount: '#93a7b8', sky: '#22394f' },
  OKEN:    { name: 'ÖKEN',     ground: '#c9a35f', alt2: '#bd9654', forest: '#8a7a3d', mount: '#8d6e4a', sky: '#3a2c14' },
  DJUNGEL: { name: 'DJUNGEL',  ground: '#1f5c33', alt2: '#1a512c', forest: '#0f3a1e', mount: '#5d6b52', sky: '#06231a' },
};

// ---------- pixelsprites ----------
// Ritar en enhet i ett 12×10-rutnät skalat med s. facing: 1 = åt höger, -1 = åt vänster.
export function drawUnit(ctx, type, color, x, y, s = 2, facing = 1) {
  const r = (px, py, w, h, c) => {
    const xx = facing === 1 ? x + px * s : x + (12 - px - w) * s;
    ctx.fillStyle = c;
    ctx.fillRect(xx, y + py * s, w * s, h * s);
  };
  const dark = '#10151c';
  if (type === 'INF') {
    r(4, 1, 3, 2, dark);          // hjälm
    r(4, 3, 3, 1, '#e8c49a');     // ansikte
    r(3, 4, 5, 3, color);         // kropp
    r(6, 4, 5, 1, dark);          // gevär
    r(3, 7, 2, 2, dark);          // ben
    r(6, 7, 2, 2, dark);
  } else if (type === 'TANK') {
    r(1, 7, 10, 2, dark);         // band
    r(2, 8, 1, 1, '#3a4552');
    r(5, 8, 1, 1, '#3a4552');
    r(8, 8, 1, 1, '#3a4552');
    r(1, 5, 10, 2, color);        // skrov
    r(3, 3, 5, 2, color);         // torn
    r(4, 3, 3, 1, dark);          // lucka
    r(8, 3, 4, 1, dark);          // eldrör
  } else { // FLYG
    r(2, 4, 9, 2, color);         // flygkropp
    r(9, 3, 2, 1, '#bfe8ff');     // nos/cockpit
    r(4, 2, 3, 2, color);         // vinge upp
    r(4, 6, 3, 2, color);         // vinge ner
    r(1, 3, 2, 1, dark);          // stjärtfena
    r(1, 6, 2, 1, dark);
  }
}

// HP-siffra (1–10) i Advance Wars-stil: liten mörk bricka med vit siffra
export function drawHpBadge(ctx, hp, x, y, s = 1) {
  const shown = Math.max(1, Math.ceil(hp));
  const w = (shown >= 10 ? 9 : 6) * s;
  ctx.fillStyle = 'rgba(8,12,18,0.92)';
  ctx.fillRect(x, y, w, 7 * s);
  ctx.fillStyle = hp > 6 ? '#ffffff' : hp > 3 ? '#ffd24f' : '#ff6b5e';
  ctx.font = `${5 * s}px "Press Start 2P", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(String(shown), x + s, y + s);
}
