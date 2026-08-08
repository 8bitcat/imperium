// IMPERIUM v4 — M8: krigsrättfärdiganden, krav, statsförbund och historiska riken.
// Allt är data — justera fritt.

// ---------- casus belli ----------
export const CASUS_BELLI = {
  annexation: {
    name: 'Annektering', icon: '\u{2694}\u{FE0F}', ppCost: 60,
    desc: 'Ta landet (eller delar av det) för dess territorium.',
    unlocks: 'Annektera land · beslagta 5–90% av pengar & resurser · krigsskadestånd 5–25% i 2–10 år',
    cannot: 'Tvinga ideologi · befria länder · göra lydstat · tvinga lagar',
    demands: { annex: true, seize: true, reparations: true },
  },
  enforcement: {
    name: 'Underkuvande', icon: '\u{1F517}', ppCost: 50,
    desc: 'Gör landet till lydstat: självstyre men följer dig i krig. Du måste försvara det. Under 40% stabilitet hos dig kan lydstaten göra uppror.',
    unlocks: 'Lydstat · tvinga ideologi · tvinga lagar · beslagta 0–90% · krigsskadestånd',
    cannot: 'Annektera land · befria länder',
    demands: { puppet: true, ideology: true, laws: true, seize: true, reparations: true },
  },
  liberation: {
    name: 'Befrielse', icon: '\u{1F54A}\u{FE0F}', ppCost: 40,
    desc: 'Krossa landet och släpp fritt allt det håller — imperier faller, lydstater befrias.',
    unlocks: 'Befria alla länder under målets styre · beslagta 0–90% · krigsskadestånd',
    cannot: 'Behålla annekterat land · tvinga lagar/ideologi · göra lydstat',
    demands: { liberate: true, seize: true, reparations: true },
  },
};

// dagar att rättfärdiga: bas 12, Justification time-statet förlänger/förkortar
export function justifyDays(justtimeStat) {
  return Math.max(5, Math.min(30, Math.round(12 + justtimeStat / 8)));
}

// beslagtagbar summa (AI-länder har virtuell statskassa baserad på befolkning)
export function seizeAmount(pop, pct) {
  return Math.round((150 + (pop || 5e6) / 3e5) * pct);
}

// ---------- statsförbund (historiskt grundade former) ----------
export const FEDERATION_FORMS = [
  { id: 'personalunion', name: 'Personalunion', icon: '\u{1F451}', min: 2, ppCost: 80,
    req: { ideologies: ['monarchism'] },
    desc: 'Två kronor, en monark — som Kalmarunionen eller Polen-Litauen.',
    mods: { stability: 10, approval: 5 } },
  { id: 'konfederation', name: 'Konfederation', icon: '\u{1F91D}', min: 3, ppCost: 100,
    req: {},
    desc: 'Löst förbund av självständiga stater — som Tyska förbundet 1815 eller Schweiz.',
    mods: { polpower: 8, stability: 5, income: 5 } },
  { id: 'federation', name: 'Federal union', icon: '\u{1F3DB}\u{FE0F}', min: 4, ppCost: 140,
    req: { ideologies: ['democracy', 'liberalism', 'socialdemocracy', 'conservatism'] },
    desc: 'En stat av delstater — som USA 1787 eller Tyska riket 1871.',
    mods: { income: 12, approval: 8, stability: 8, research: 5 } },
  { id: 'imperium', name: 'Imperium', icon: '\u{1F985}', min: 5, ppCost: 160,
    req: { ideologies: ['monarchism', 'imperialism', 'fascism', 'nationalism', 'communism'] },
    desc: 'Ett rike, en härskare — kräver järnhand och många provinser.',
    mods: { milpower: 12, manpower: 10, statepower: 12, approval: -8, unrest: 5 } },
];

// ---------- historiska riken (AI kan återskapa dem; spelaren kan utropa dem) ----------
// core = grundlandet som krävs; lands = historiska territorier; need = antal av
// dessa (utöver core) som krävs för utrop; aiChance = sannolikhet per AI-drag att
// riket driver sin expansion vidare.
export const HISTORICAL_EMPIRES = [
  { id: 'sovjet', name: 'Sovjetunionen', icon: '\u{262D}', core: '643', color: '#c0392b', need: 4, aiChance: 0.25,
    lands: ['804', '112', '398', '860', '795', '762', '417', '268', '051', '031', '233', '428', '440', '498'],
    mods: { milpower: 15, manpower: 12, factory: 10, freedom: -15 } },
  { id: 'brittiska', name: 'Brittiska imperiet', icon: '\u{1F451}', core: '826', color: '#b03060', need: 4, aiChance: 0.12,
    lands: ['372', '356', '586', '036', '554', '124', '710', '818', '404', '288'],
    mods: { income: 15, gdp: 10, milpower: 8 } },
  { id: 'rom', name: 'Romarriket', icon: '\u{1F3DB}\u{FE0F}', core: '380', color: '#8e44ad', need: 5, aiChance: 0.08,
    lands: ['724', '250', '300', '792', '818', '788', '434', '504', '826', '688'],
    mods: { stability: 15, statepower: 12, income: 8 } },
  { id: 'mongol', name: 'Mongolväldet', icon: '\u{1F3F9}', core: '496', color: '#d35400', need: 3, aiChance: 0.10,
    lands: ['156', '643', '398', '860', '795', '364', '408', '410'],
    mods: { manpower: 15, milpower: 12, readiness: 10 } },
  { id: 'osman', name: 'Osmanska riket', icon: '\u{262A}\u{FE0F}', core: '792', color: '#16a085', need: 4, aiChance: 0.15,
    lands: ['760', '368', '422', '376', '400', '818', '300', '100', '688', '682'],
    mods: { stability: 10, income: 10, milpower: 8 } },
  { id: 'stormakt', name: 'Svenska stormaktsväldet', icon: '\u{1F9AC}', core: '752', color: '#2980b9', need: 2, aiChance: 0.06,
    lands: ['246', '233', '428', '578', '616'],
    mods: { milpower: 10, stability: 10, approval: 8 } },
  { id: 'kalmar', name: 'Kalmarunionen', icon: '\u{26F5}', core: '208', color: '#27ae60', need: 2, aiChance: 0.06,
    lands: ['752', '578', '352', '246'],
    mods: { income: 10, stability: 12, approval: 5 } },
  { id: 'kejsardomet', name: 'Tyska kejsardömet', icon: '\u{1F985}', core: '276', color: '#5d6d7e', need: 2, aiChance: 0.10,
    lands: ['616', '250', '040', '203'],
    mods: { factory: 12, milpower: 10, research: 8 } },
  { id: 'persien', name: 'Persiska riket', icon: '\u{1F981}', core: '364', color: '#af601a', need: 3, aiChance: 0.10,
    lands: ['368', '004', '762', '795', '031', '818', '792'],
    mods: { stability: 10, income: 8, ideopower: 8 } },
  { id: 'napoleon', name: 'Franska kejsardömet', icon: '\u{1F985}', core: '250', color: '#2c3e97', need: 3, aiChance: 0.08,
    lands: ['724', '380', '056', '528', '276', '616', '040'],
    mods: { milpower: 12, statepower: 10, approval: 5 } },
];

export function empireById(id) { return HISTORICAL_EMPIRES.find((e) => e.id === id) || null; }

// Vilka riken kan spelaren utropa just nu? (äger core + minst `need` av lands)
export function formableEmpires(ownedIds) {
  const owned = new Set(ownedIds);
  return HISTORICAL_EMPIRES.filter((e) => {
    if (!owned.has(e.core)) return false;
    const have = e.lands.filter((l) => owned.has(l)).length;
    return have >= e.need;
  });
}

export function empireProgress(e, ownedIds) {
  const owned = new Set(ownedIds);
  return { have: e.lands.filter((l) => owned.has(l)).length, need: e.need, hasCore: owned.has(e.core) };
}
