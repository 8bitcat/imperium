// IMPERIUM v3 — enheter, skadematris, detaljerade pixelsprites och biom
// (delas av båda stridsprototyperna och klinch-skärmen)
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

// ---------- snabbresultat (tärningsmodell) ----------
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
    volley(a, d, 1);
    volley(d, a, 0);
  }
  const surA = a.filter((u) => u.hp > 0);
  const surD = d.filter((u) => u.hp > 0);
  return { winner: surA.length && !surD.length ? 0 : surD.length && !surA.length ? 1 : (surA.length >= surD.length ? 0 : 1), survivorsA: surA, survivorsD: surD, rounds };
}

// ---------- färghjälpare ----------
function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function tint(hex, f) {
  const [r, g, b] = hexRgb(hex);
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}
export function lighten(hex, f) {
  const [r, g, b] = hexRgb(hex);
  return `rgb(${Math.round(r + (255 - r) * f)},${Math.round(g + (255 - g) * f)},${Math.round(b + (255 - b) * f)})`;
}

// ---------- biom ----------
// Tropikbandet (< ~16°) är djungel, oavsett tillgångar (Venezuela, Kongo, Indonesien…).
// Kurerade undantag för länder där heuristiken slår fel.
const BIOME_OVERRIDE = {
  '818': 'OKEN',    // Egypten
  '729': 'OKEN',    // Sudan
  '478': 'OKEN',    // Mauretanien
  '504': 'OKEN',    // Marocko
  '148': 'OKEN',    // Tchad
  '562': 'OKEN',    // Niger
  '466': 'OKEN',    // Mali
  '682': 'OKEN',    // Saudiarabien
  '887': 'OKEN',    // Jemen
  '036': 'OKEN',    // Australien (outback)
  '496': 'GRAS',    // Mongoliet (stäpp)
};

export function biomeFor(country) {
  const o = BIOME_OVERRIDE[String(country.id)];
  if (o) return o;
  const lat = Math.abs(country.centroid[1]);
  const res = resourcesOf(country.id);
  if (lat > 55) return 'SNO';
  if (lat < 16) return 'DJUNGEL';
  if (res.includes('OLJA') && lat < 38) return 'OKEN';
  if (lat < 25 && res.includes('TIMMER')) return 'DJUNGEL';
  return 'GRAS';
}

export const BIOMES = {
  GRAS: {
    name: 'GRÄSMARK', sky: '#8fc7e8',
    ground: '#4e9b57', ground2: '#459050', tuft: '#3b8347',
    tree1: '#6fc76f', tree2: '#3f9448', tree3: '#2a703a', trunk: '#6b4a2b',
    mount: '#8a8f96', mount2: '#a8adb4', mountShade: '#6b7076', snowcap: '#eef3f7',
    road: '#c9b389', roadEdge: '#94815c',
    water: '#3579c0', water2: '#5b9ad6',
    wall: '#e3d9c6', roof: '#c25b45', pine: false,
  },
  SNO: {
    name: 'SNÖ', sky: '#b8ccdd',
    ground: '#dfe9f1', ground2: '#d2dfe9', tuft: '#b8c9d8',
    tree1: '#5f8a7d', tree2: '#42695f', tree3: '#2d4a43', trunk: '#5a4632',
    mount: '#9fb0c0', mount2: '#c0cdd9', mountShade: '#7e8fa0', snowcap: '#ffffff',
    road: '#b0a68f', roadEdge: '#7e7663',
    water: '#7fb4d8', water2: '#a3cce6',
    wall: '#d8d2c5', roof: '#8a5b45', pine: true,
  },
  OKEN: {
    name: 'ÖKEN', sky: '#f0d9a8',
    ground: '#d9b878', ground2: '#cfae6e', tuft: '#b8965a',
    tree1: '#9fb453', tree2: '#7a9143', tree3: '#5b6f33', trunk: '#8a6a3a',
    mount: '#b08a5e', mount2: '#c9a878', mountShade: '#8a6a48', snowcap: '#e8d9b8',
    road: '#a89577', roadEdge: '#7a6c56',
    water: '#3a9ec4', water2: '#63bcd8',
    wall: '#e8dcc0', roof: '#a86a3a', pine: false,
  },
  DJUNGEL: {
    name: 'DJUNGEL', sky: '#7fb8a0',
    ground: '#2f7a44', ground2: '#296e3d', tuft: '#1f5c33',
    tree1: '#54b060', tree2: '#2f8443', tree3: '#1c5e30', trunk: '#4a3620',
    mount: '#6f7d68', mount2: '#8c9a84', mountShade: '#525e4d', snowcap: '#d8e0d0',
    road: '#a8895e', roadEdge: '#75613f',
    water: '#2a7aa8', water2: '#4a9cc4',
    wall: '#d9cfb0', roof: '#8a4a3a', pine: false,
  },
};

// ---------- detaljerade pixelsprites (16×14-rutnät, skala s) ----------
const INK = '#10151c';
const STEEL = '#4a5562';
const STEEL_D = '#2a323c';
const SKIN = '#e8c49a';

export function drawUnit(ctx, type, color, x, y, s = 2, facing = 1) {
  const dark = tint(color, 0.55);
  const light = lighten(color, 0.4);
  const r = (px, py, w, h, c) => {
    const xx = facing === 1 ? x + px * s : x + (16 - px - w) * s;
    ctx.fillStyle = c;
    ctx.fillRect(xx, y + py * s, w * s, h * s);
  };
  if (type === 'INF') {
    r(3, 6, 1, 4, dark);            // ryggsäck
    r(5, 0, 5, 1, dark);            // hjälmtopp
    r(4, 1, 7, 2, color);           // hjälm
    r(4, 2, 7, 1, light);           // hjälmglans
    r(4, 3, 6, 1, dark);            // hjälmkant
    r(5, 4, 4, 2, SKIN);            // ansikte
    r(8, 4, 1, 1, INK);             // öga
    r(4, 6, 7, 3, color);           // jacka
    r(4, 6, 7, 1, light);           // axelhighlight
    r(4, 9, 7, 1, dark);            // bälte
    r(9, 6, 2, 1, SKIN);            // hand
    r(8, 7, 7, 1, INK);             // gevär
    r(14, 6, 2, 1, STEEL);          // mynning
    r(10, 8, 1, 2, INK);            // magasin
    r(5, 10, 2, 3, STEEL_D);        // ben
    r(8, 10, 2, 3, STEEL_D);
    r(5, 13, 3, 1, INK);            // kängor
    r(8, 13, 3, 1, INK);
  } else if (type === 'TANK') {
    r(3, 0, 1, 3, dark);            // antenn
    r(8, 4, 7, 1, STEEL_D);         // eldrör
    r(14, 3, 2, 2, STEEL);          // mynningsbroms
    r(4, 2, 6, 3, color);           // torn
    r(4, 2, 6, 1, light);           // tornglans
    r(6, 1, 2, 1, light);           // lucka
    r(1, 5, 14, 3, color);          // skrov
    r(1, 5, 14, 1, light);          // skrovglans
    r(1, 7, 14, 1, dark);           // skrovskugga
    r(0, 8, 16, 5, '#232a33');      // band
    r(0, 8, 16, 1, '#39424e');      // stänkskärm
    r(2, 10, 2, 2, STEEL);          // hjul
    r(5, 10, 2, 2, STEEL);
    r(8, 10, 2, 2, STEEL);
    r(11, 10, 2, 2, STEEL);
    r(14, 10, 1, 2, STEEL);
  } else { // FLYG — jaktplan
    r(0, 6, 1, 2, '#ff9f3e');       // efterbrännare
    r(1, 6, 1, 2, STEEL_D);         // utblås
    r(2, 3, 2, 3, dark);            // stjärtfena
    r(2, 3, 1, 1, light);
    r(2, 6, 12, 2, color);          // flygkropp
    r(2, 6, 12, 1, light);          // glans
    r(14, 6, 2, 1, light);          // nos
    r(11, 5, 3, 1, '#bfe8ff');      // cockpit
    r(12, 5, 1, 1, '#ffffff');      // glint
    r(4, 2, 2, 2, dark);            // övre vinge (svept)
    r(6, 3, 2, 2, dark);
    r(8, 4, 2, 2, dark);
    r(4, 10, 2, 2, dark);           // undre vinge
    r(6, 9, 2, 2, dark);
    r(8, 8, 2, 2, dark);
    r(5, 8, 3, 1, STEEL);           // robotar
  }
}

// ---------- riktiga krigssprites (BerkleyToreno, CC BY-NC-SA 3.0) ----------
// Används i klinch-skärmen. Spelarens fordon tonas röda; fiendens tank har
// en äkta blå livery. Arken pekar åt vänster — facing 1 speglas.
export const WAR_SPRITES = {};
const SPRITE_DEFS = {
  INF:  { fileP: 'apc-wheeled.png', tintP: '#ff5a4a', tintE: '#4fa8ff' }, // lätt mekaniserat (DANA)
  TANK: { fileP: 'tank-tan.png', fileE: 'tank-blue.png', tintP: '#ff5a4a' },
  FLYG: { fileP: 'heli-gray.png', tintP: '#ff5a4a', tintE: '#4fa8ff' },
};
const spriteCache = new Map();

export function loadWarSprites(base = 'assets/sprites/') {
  for (const [type, def] of Object.entries(SPRITE_DEFS)) {
    for (const [side, file] of [['P', def.fileP], ['E', def.fileE || def.fileP]]) {
      const img = new Image();
      img.onload = () => { WAR_SPRITES[type + '_' + side] = img; };
      img.src = base + file;
    }
  }
}

export function warSprite(type, side, facing) {
  const def = SPRITE_DEFS[type];
  if (!def) return null;
  const imgKey = type + '_' + (side === 1 ? 'E' : 'P');
  const img = WAR_SPRITES[imgKey];
  if (!img) return null;
  const key = imgKey + '|' + facing;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const cv = document.createElement('canvas');
  cv.width = img.width; cv.height = img.height;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  if (facing === 1) { c.translate(img.width, 0); c.scale(-1, 1); }
  c.drawImage(img, 0, 0);
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tintCol = side === 0 ? def.tintP : (def.fileE ? null : def.tintE);
  if (tintCol) {
    c.globalCompositeOperation = 'source-atop';
    c.globalAlpha = 0.28;
    c.fillStyle = tintCol;
    c.fillRect(0, 0, cv.width, cv.height);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
  }
  spriteCache.set(key, cv);
  return cv;
}

// HP-siffra (1–10) i Advance Wars-stil
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

// ---------- terrängritning (delas av battleA/battleB) ----------
export function drawTree(ctx, B, x, y, s = 1) {
  const r = (px, py, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + px * s, y + py * s, w * s, h * s); };
  if (B.pine) {
    r(5, 12, 2, 3, B.trunk);
    r(2, 9, 8, 3, B.tree3);
    r(3, 6, 6, 3, B.tree2);
    r(4, 3, 4, 3, B.tree1);
    r(5, 1, 2, 2, B.tree1);
    r(3, 6, 1, 1, '#eef3f7');
  } else {
    r(5, 11, 2, 4, B.trunk);
    r(1, 6, 10, 5, B.tree3);
    r(2, 4, 8, 4, B.tree2);
    r(3, 2, 6, 3, B.tree1);
    r(4, 3, 2, 1, lighten(B.tree1, 0.4));
  }
}

export function drawHouse(ctx, B, x, y, s = 1) {
  const r = (px, py, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + px * s, y + py * s, w * s, h * s); };
  r(1, 6, 12, 8, B.wall);
  r(1, 6, 12, 1, tint(B.wall, 0.75));
  r(0, 3, 14, 3, B.roof);
  r(2, 1, 10, 2, B.roof);
  r(2, 1, 10, 1, lighten(B.roof, 0.3));
  r(3, 9, 3, 5, tint(B.wall, 0.45));   // dörr
  r(8, 8, 3, 3, '#9fd8ff');            // fönster
  r(8, 8, 3, 1, '#ffffff');
  r(1, 13, 12, 1, tint(B.wall, 0.6));
}

export function drawMountain(ctx, B, x, y, s = 1) {
  const r = (px, py, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + px * s, y + py * s, w * s, h * s); };
  r(1, 10, 14, 4, B.mountShade);
  r(2, 7, 12, 3, B.mount);
  r(4, 4, 8, 3, B.mount);
  r(6, 2, 4, 2, B.mount);
  r(4, 4, 3, 3, B.mount2);            // ljussida
  r(2, 7, 4, 3, B.mount2);
  r(6, 1, 4, 2, B.snowcap);           // snötopp
  r(7, 3, 2, 1, B.snowcap);
}
