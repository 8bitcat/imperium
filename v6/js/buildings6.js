// TRADE WARS — byggnaderna.
//
// Varje byggnad drar STRÖM och kostar UNDERHÅLL varje dag. Det är spärren mot
// att bara fylla varenda stad med de finaste husen: utan infrastruktur som bär
// dem går riket i konkurs. Bara den första byggnaden i varje kedja är
// tillgänglig från start — resten måste forskas fram.
//
// yield = dagliga poäng. mw = strömbehov. upkeep = 💰 per dag.

export const BUILDINGS = {
  // ---------- FORSKNING ----------
  school: {
    name: 'SKOLA', icon: '\u{1F3EB}', group: 'civil',
    cost: 420, days: 8, upkeep: 2, mw: 1,
    yield: { research: 0.5 },
    desc: 'GRUNDEN I ALLT. LITE FORSKNING, LITE UNDERHÅLL.',
  },
  university: {
    name: 'UNIVERSITET', icon: '\u{1F393}', group: 'civil',
    cost: 1900, days: 20, upkeep: 9, mw: 5,
    yield: { research: 2.2, pp: 0.2 },
    research: ['education', 1],
    desc: 'MÅNGDUBBLAR FORSKNINGEN — OCH RÄKNINGEN.',
  },
  researchpark: {
    name: 'FORSKNINGSPARK', icon: '\u{1F9EA}', group: 'civil',
    cost: 6200, days: 40, upkeep: 26, mw: 16,
    yield: { research: 6.5, money: 1.5 },
    research: ['education', 3],
    desc: 'TUNG FORSKNING. KRÄVER ETT ORDENTLIGT ELNÄT.',
  },
  // ---------- PENGAR ----------
  market: {
    name: 'MARKNAD', icon: '\u{1F3EA}', group: 'civil',
    cost: 380, days: 7, upkeep: 1, mw: 1,
    yield: { money: 2.2 },
    desc: 'STADENS TORG. SMÅ MEN SÄKRA PENGAR.',
  },
  bank: {
    name: 'BANK', icon: '\u{1F3E6}', group: 'civil',
    cost: 2200, days: 22, upkeep: 8, mw: 4,
    yield: { money: 9, pp: 0.2 },
    research: ['economy', 1],
    desc: 'KAPITAL SOM ARBETAR. BÄR SITT EGET UNDERHÅLL MED MARGINAL.',
  },
  exchange: {
    name: 'BÖRS', icon: '\u{1F4C8}', group: 'civil',
    cost: 7400, days: 45, upkeep: 30, mw: 14,
    yield: { money: 30, research: 1 },
    research: ['economy', 3],
    desc: 'RIKETS FINANSIELLA HJÄRTA.',
  },
  // ---------- POLITISK MAKT ----------
  townhall: {
    name: 'RÅDHUS', icon: '\u{1F3DB}\u{FE0F}', group: 'civil',
    cost: 520, days: 9, upkeep: 2, mw: 1,
    yield: { pp: 0.4 },
    desc: 'LOKAL FÖRVALTNING. LITE ORDNING I LEDET.',
  },
  ministry: {
    name: 'MINISTERIUM', icon: '\u{1F5C3}\u{FE0F}', group: 'civil',
    cost: 2600, days: 24, upkeep: 11, mw: 5,
    yield: { pp: 2.0, research: 0.3 },
    research: ['political', 2],
    desc: 'STATSAPPARAT MED RIKTIG TYNGD.',
  },
  // ---------- MANSKAP ----------
  housing: {
    name: 'BOSTADSOMRÅDE', icon: '\u{1F3D8}\u{FE0F}', group: 'civil',
    cost: 340, days: 7, upkeep: 1, mw: 1,
    yield: { man: 1.2 },
    desc: 'FOLK ATT VÄRVA IFRÅN.',
  },
  hospital: {
    name: 'SJUKHUS', icon: '\u{1F3E5}', group: 'civil',
    cost: 2400, days: 24, upkeep: 12, mw: 6,
    yield: { man: 4, research: 0.4 },
    research: ['healthcare', 1],
    desc: 'FRISKARE BEFOLKNING — FLER SOM KAN TJÄNSTGÖRA.',
  },
  // ---------- ALLROUND (dyr i drift, ger allt) ----------
  admin: {
    name: 'FÖRVALTNINGSCENTRUM', icon: '\u{1F3E2}', group: 'civil',
    cost: 5200, days: 34, upkeep: 34, mw: 12,
    yield: { money: 5, research: 1.6, pp: 1.2, man: 1.6 },
    research: ['political', 3],
    desc: 'GER ALLA POÄNGSLAG — MEN UNDERHÅLLET ÄTER DIG OM DU BYGGER FÖR MÅNGA.',
  },
  arcology: {
    name: 'ARKOLOGI', icon: '\u{1F306}', group: 'civil',
    cost: 21000, days: 90, upkeep: 95, mw: 44,
    yield: { money: 22, research: 7, pp: 4, man: 8 },
    research: ['education', 5],
    desc: 'EN HEL STAD I EN BYGGNAD. ENORM UTVÄXLING, ENORM RÄKNING.',
  },
  // ---------- INFRASTRUKTUR (terminaler) ----------
  truckterminal: {
    name: 'LASTTERMINAL', icon: '\u{1F69B}', group: 'infra',
    cost: 560, days: 8, upkeep: 2, mw: 2,
    desc: 'KRÄVS I BÅDA ÄNDAR FÖR ATT EN VÄG SKA GE INKOMST.',
  },
  trainstation: {
    name: 'TÅGSTATION', icon: '\u{1F686}', group: 'infra',
    cost: 1500, days: 16, upkeep: 4, mw: 5,
    research: ['rail', 1],
    desc: 'KRÄVS I BÅDA ÄNDAR FÖR JÄRNVÄG.',
  },
  harbour: {
    name: 'HAMN', icon: '\u{2693}', group: 'infra',
    cost: 2400, days: 22, upkeep: 6, mw: 6,
    research: ['shipping', 1], coastal: true,
    desc: 'BARA I KUSTSTÄDER. KRÄVS I BÅDA ÄNDAR FÖR SJÖFART.',
  },
  airport: {
    name: 'FLYGPLATS', icon: '\u{2708}\u{FE0F}', group: 'infra',
    cost: 4800, days: 34, upkeep: 12, mw: 12,
    research: ['aviation', 1],
    desc: 'KRÄVS I BÅDA ÄNDAR FÖR FLYGFRAKT. DYRAST — OCH SNABBAST.',
  },
  // ---------- LAGER (bara huvudstaden) ----------
  warehouse: {
    name: 'RÅVARULAGER', icon: '\u{1F3ED}', group: 'store',
    cost: 5600, days: 30, upkeep: 14, mw: 8,
    capital: true, capacity: 120,
    desc: 'BARA I HUVUDSTADEN. HÄR SAMLAS RIKETS RÅVAROR — OCH HÄRIFRÅN SÄLJS DE.',
  },
  warehouseExt: {
    name: 'LAGERUTBYGGNAD', icon: '\u{1F4E6}', group: 'store',
    cost: 3400, days: 18, upkeep: 9, mw: 5,
    capital: true, capacity: 90, repeatable: true,
    research: ['logistics', 2],
    desc: 'HÖJER LAGRETS TAK. GÅR ATT BYGGA FLERA GÅNGER.',
  },
};

// Går byggnaden att uppföra med nuvarande forskning?
export function unlocked(key, research) {
  const req = BUILDINGS[key]?.research;
  if (!req) return true;
  return (research?.[req[0]] || 0) >= req[1];
}

// Summerar allt riket producerar och allt det kostar i drift.
export function tally(cityBuildings) {
  const y = { money: 0, research: 0, pp: 0, man: 0 };
  let upkeep = 0, mw = 0, capacity = 0;
  for (const list of Object.values(cityBuildings || {})) {
    for (const key of list) {
      const b = BUILDINGS[key];
      if (!b) continue;
      upkeep += b.upkeep || 0;
      mw += b.mw || 0;
      capacity += b.capacity || 0;
      for (const [k, v] of Object.entries(b.yield || {})) y[k] += v;
    }
  }
  return { yield: y, upkeep, mw, capacity };
}
