// TRADE WARS — ekonomins grundregler.
//
// Hela V6 vilar på en enda idé: DU FÖDS FATTIG. Varje land i världen får exakt
// samma lilla basinkomst, oavsett storlek och rikedom. Vill du ha mer måste du
// bygga upp landet — el, infrastruktur, byggnader — och varje sak du bygger
// kostar underhåll varje dag. Fyller du städerna med fina byggnader utan att
// ha inkomsten som bär dem går du i konkurs.

// Basinkomsten. Kalibrerad så att FÖRSTA infanteriet tar ungefär ett år att
// spara ihop till om du inte bygger något alls (INF_COST / BASE.money ≈ 360).
export const BASE = {
  money: 9,        // 💰 per dag (netto ca 6 efter startverkets underhåll)
  research: 0.5,   // 🔬
  pp: 0.35,        // ⚖️ politisk makt
  man: 1,          // 🧍 manskap
};

export const INF_COST = { money: 2100, man: 40 };
export const TANK_COST = { money: 5200, man: 55 };
export const AIR_COST = { money: 9000, man: 45 };

// Totalförsvar ersätter kaserner: ett landsomfattande program med dagligt
// underhåll. Det går inte att starta i början — du måste ha byggt upp en
// ekonomi som bär det, annars äter det upp dig.
export const DEFENCE = {
  minIncome: 45,       // krävd nettoinkomst per dag innan det ens går att starta
  upkeep: 28,          // 💰 per dag
  manPerDay: 4,        // 🧍 per dag
  readiness: 18,       // stridsbonus
};

// Poängtyperna spelet styrs av. Allt utom money kan bara växa via byggnader.
export const POINTS = {
  money: { icon: '\u{1F4B0}', name: 'PENGAR' },
  research: { icon: '\u{1F52C}', name: 'FORSKNING' },
  pp: { icon: '\u{2696}\u{FE0F}', name: 'POLITISK MAKT' },
  man: { icon: '\u{1F9CD}', name: 'MANSKAP' },
};

// Summerar dagens inkomst: bas + byggnader − underhåll.
export function dailyIncome(s, buildingYield, upkeep, ideoMods) {
  const out = { money: BASE.money, research: BASE.research, pp: BASE.pp, man: BASE.man };
  for (const k of Object.keys(out)) {
    out[k] += buildingYield?.[k] || 0;
    out[k] *= 1 + ((ideoMods?.[k] || 0) / 100);
    if (k === 'money') out[k] -= upkeep || 0;
  }
  return out;
}

// Priset på en förbindelse växer med avståndet — men intäkten per resa växer
// snabbare än linjärt i början och planar ut. Långa linjer är en investering
// som betalar sig, korta ger snabba men små pengar.
export function linkCost(kind, km) {
  const K = LINK[kind];
  return Math.round(K.base + km * K.perKm);
}

export function linkIncome(kind, km, level) {
  const K = LINK[kind];
  return Math.round((K.baseIncome + Math.pow(km, 0.72) * K.incPerKm) * level);
}

// Restid i speldagar för en resa åt ett håll.
export function linkTripDays(kind, km) {
  const K = LINK[kind];
  return Math.max(0.5, km / K.kmPerDay);
}

// De fyra transportslagen. Väg är billigast och långsammast att tjäna på;
// sjöfart är långsammast men betalar mest per resa; flyg är snabbast.
export const LINK = {
  road: {
    name: 'VÄG', icon: '\u{1F69B}', color: '#c9a227',
    base: 260, perKm: 0.55,
    baseIncome: 2, incPerKm: 0.38,
    kmPerDay: 110,
    terminal: 'truckterminal',
    upgradeCost: 1.8,        // faktor per nivå
    vehicle: 'truck',
  },
  rail: {
    name: 'JÄRNVÄG', icon: '\u{1F686}', color: '#9fb6c8',
    base: 900, perKm: 1.7,
    baseIncome: 5, incPerKm: 0.45,
    kmPerDay: 190,
    terminal: 'trainstation',
    upgradeCost: 1.9,
    vehicle: 'train',
  },
  sea: {
    name: 'SJÖFART', icon: '\u{1F6A2}', color: '#4aa6e0',
    base: 1400, perKm: 0.9,
    baseIncome: 10, incPerKm: 1.10,
    kmPerDay: 70,
    terminal: 'harbour',
    upgradeCost: 2.1,
    vehicle: 'ship',
    coastalOnly: true,
  },
  air: {
    name: 'FLYG', icon: '\u{2708}\u{FE0F}', color: '#e8f6ff',
    base: 3200, perKm: 1.15,
    baseIncome: 6, incPerKm: 0.28,
    kmPerDay: 600,
    terminal: 'airport',
    upgradeCost: 2.4,
    vehicle: 'plane',
  },
};

export const MAX_LINK_LEVEL = 3;

// Kostnad för att uppgradera en förbindelse till nästa nivå.
export function upgradeCost(kind, km, currentLevel) {
  return Math.round(linkCost(kind, km) * Math.pow(LINK[kind].upgradeCost, currentLevel));
}

// Storcirkelavstånd i km mellan två lon/lat-punkter.
export function kmBetween(a, b) {
  const R = 6371;
  const toRad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toRad;
  const dLon = (b[0] - a[0]) * toRad;
  const la1 = a[1] * toRad, la2 = b[1] * toRad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}
