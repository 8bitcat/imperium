// TRADE WARS — elen.
//
// Ingenting av värde går att bygga utan ström. Du börjar med ett enda vindkraft-
// verk i huvudstaden; alla andra städer är mörka tills du drar ledningar dit.
// Att bygga kraft är dyrt, att dra ledning är billigt — så den naturliga vägen
// är ett fåtal kraftverk och ett nät som sprider strömmen. Vill man hellre
// vänta in basinkomsten och bygga eget verk i varje stad står det en fritt.

export const PLANTS = {
  wind: {
    name: 'VINDKRAFTVERK', icon: '\u{1F4A8}', mw: 12,
    cost: 900, days: 14, upkeep: 3,
    desc: 'BILLIGAST ATT RESA. LITE STRÖM, INGEN BRÄNSLEKOSTNAD.',
  },
  solar: {
    name: 'SOLPANELSPARK', icon: '\u{2600}\u{FE0F}', mw: 20,
    cost: 1700, days: 20, upkeep: 5, research: ['power', 1],
    desc: 'MER STRÖM ÄN VINDEN, MEN DYRARE ATT ANLÄGGA.',
  },
  windPlus: {
    name: 'HÖGVINDVERK', icon: '\u{1F4A8}', mw: 19,
    cost: 1500, days: 18, upkeep: 4, research: ['power', 2],
    desc: 'FÖRBÄTTRAD VINDKRAFT — HÖGRE TORN, STÖRRE SVEPYTA.',
  },
  solarPlus: {
    name: 'KONCENTRERAD SOLKRAFT', icon: '\u{2600}\u{FE0F}', mw: 31,
    cost: 2900, days: 26, upkeep: 7, research: ['power', 3],
    desc: 'SPEGLAR SOM KOKAR SALT — GER STRÖM ÄVEN EFTER SOLNEDGÅNG.',
  },
  reactor: {
    name: 'KÄRNREAKTOR', icon: '\u{2622}\u{FE0F}', mw: 110,
    cost: 14000, days: 90, upkeep: 26, research: ['power', 4],
    desc: 'ENORMT MYCKET STRÖM. TAR LÅNG TID OCH KOSTAR DÄREFTER.',
  },
  fusion: {
    name: 'FUSIONSREAKTOR', icon: '\u{269B}\u{FE0F}', mw: 340,
    cost: 62000, days: 220, upkeep: 40, research: ['power', 6],
    desc: 'EXPERIMENTELL. ETT ENDA VERK BÄR ETT HELT RIKE.',
  },
  geothermal: {
    name: 'GEOTERMISK ANLÄGGNING', icon: '\u{1F30B}', mw: 74,
    cost: 9000, days: 60, upkeep: 15, research: ['power', 5],
    desc: 'BORRAR NER I BERGGRUNDEN. JÄMN STRÖM DYGNET RUNT.',
  },
};

// Elledning mellan två städer. Betydligt billigare än att bygga ett eget verk
// — det är hela poängen: näten ska löna sig framför lokala kraftverk.
export const LINE_BASE = 120;
export const LINE_PER_KM = 0.22;
export const LINE_DAYS_PER_1000KM = 6;

export function lineCost(km) {
  return Math.round(LINE_BASE + km * LINE_PER_KM);
}

export function lineDays(km) {
  return Math.max(2, Math.round((km / 1000) * LINE_DAYS_PER_1000KM) + 2);
}

// Vilka städer har ström? Ett kraftverk elektrifierar sin egen stad, och
// strömmen rinner vidare längs varje färdig ledning. Ren grafgenomgång.
export function poweredCities(plants, lines) {
  const has = new Set();
  for (const p of plants) if (p.done) has.add(p.city);
  const adj = {};
  for (const l of lines) {
    if (!l.done) continue;
    (adj[l.a] ||= []).push(l.b);
    (adj[l.b] ||= []).push(l.a);
  }
  const queue = [...has];
  while (queue.length) {
    const c = queue.pop();
    for (const nb of adj[c] || []) {
      if (!has.has(nb)) { has.add(nb); queue.push(nb); }
    }
  }
  return has;
}

// Total kapacitet i megawatt (bara färdigbyggda verk räknas).
export function totalMW(plants) {
  return plants.reduce((a, p) => a + (p.done ? (PLANTS[p.kind]?.mw || 0) : 0), 0);
}

// Går verket att bygga med nuvarande forskning?
export function plantUnlocked(kind, research) {
  const req = PLANTS[kind]?.research;
  if (!req) return true;
  return (research?.[req[0]] || 0) >= req[1];
}
