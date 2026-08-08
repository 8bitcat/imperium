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
  { id: 'spanska', name: 'Spanska imperiet', icon: '\u{26F5}', core: '724', color: '#b8860b', need: 3, aiChance: 0.08,
    lands: ['484', '170', '604', '152', '032', '068', '862', '608'],
    mods: { income: 12, milpower: 8 } },
  { id: 'portugisiska', name: 'Portugisiska sjöväldet', icon: '\u{2693}', core: '620', color: '#2e8b57', need: 2, aiChance: 0.06,
    lands: ['076', '508', '024'],
    mods: { income: 10, gdp: 8 } },
  { id: 'nederlandska', name: 'Nederländska handelsväldet', icon: '\u{1F6A2}', core: '528', color: '#e07020', need: 1, aiChance: 0.06,
    lands: ['360', '740'],
    mods: { income: 15, gdp: 10 } },
  { id: 'bysans', name: 'Bysantinska riket', icon: '\u{2626}\u{FE0F}', core: '300', color: '#6a0dad', need: 2, aiChance: 0.06,
    lands: ['792', '100', '807', '196'],
    mods: { stability: 12, ideopower: 10 } },
  { id: 'farao', name: 'Faraonernas rike', icon: '\u{1F3FA}', core: '818', color: '#c9a227', need: 1, aiChance: 0.07,
    lands: ['729', '434'],
    mods: { stability: 10, ideopower: 8 } },
  { id: 'inka', name: 'Inkariket', icon: '\u{26F0}\u{FE0F}', core: '604', color: '#8b4513', need: 2, aiChance: 0.06,
    lands: ['068', '152', '218'],
    mods: { stability: 10, manpower: 8 } },
  { id: 'azteker', name: 'Aztekernas arv', icon: '\u{1F985}', core: '484', color: '#0e7a5f', need: 2, aiChance: 0.06,
    lands: ['320', '340', '222', '558'],
    mods: { manpower: 10, milpower: 6 } },
  { id: 'babylon', name: 'Babylons återkomst', icon: '\u{1F981}', core: '368', color: '#7b3f00', need: 1, aiChance: 0.06,
    lands: ['760', '400', '414'],
    mods: { stability: 8, income: 8 } },
  { id: 'arabhalvon', name: 'Halvöns enande', icon: '\u{1F54C}', core: '682', color: '#0f7a3d', need: 2, aiChance: 0.07,
    lands: ['784', '634', '512', '414', '887'],
    mods: { income: 15, stability: 8 } },
  { id: 'maurya', name: 'Mauryariket', icon: '\u{1F418}', core: '356', color: '#e08020', need: 2, aiChance: 0.08,
    lands: ['586', '050', '144'],
    mods: { manpower: 12, stability: 8 } },
  { id: 'mittensrike', name: 'Mittens rike', icon: '\u{1F409}', core: '156', color: '#c41e3a', need: 1, aiChance: 0.10,
    lands: ['158', '496'],
    mods: { factory: 12, milpower: 10 } },
  { id: 'aksum', name: 'Aksumriket', icon: '\u{1F992}', core: '231', color: '#8b6f2b', need: 2, aiChance: 0.05,
    lands: ['232', '262', '706'],
    mods: { stability: 10, manpower: 8 } },
  { id: 'maliriket', name: 'Maliriket', icon: '\u{1FA99}', core: '466', color: '#d4a017', need: 2, aiChance: 0.05,
    lands: ['686', '324', '288'],
    mods: { income: 12, gdp: 8 } },
  { id: 'polsklit', name: 'Polsk-litauiska samväldet', icon: '\u{1F985}', core: '616', color: '#c0305a', need: 2, aiChance: 0.07,
    lands: ['440', '112', '804', '428'],
    mods: { stability: 10, milpower: 8 } },
  { id: 'nordsjo', name: 'Nordsjöväldet', icon: '\u{2694}\u{FE0F}', core: '578', color: '#1d5f8a', need: 1, aiChance: 0.05,
    lands: ['208', '352'],
    mods: { income: 10, milpower: 6 } },
  { id: 'habsburg', name: 'Habsburgska riket', icon: '\u{1F451}', core: '040', color: '#e8b923', need: 3, aiChance: 0.07,
    lands: ['348', '203', '703', '705', '191'],
    mods: { stability: 12, income: 8 } },
  { id: 'storungern', name: 'Kronans länder', icon: '\u{1F451}', core: '348', color: '#3e7a3e', need: 2, aiChance: 0.05,
    lands: ['642', '703', '191'],
    mods: { stability: 8, manpower: 6 } },
  { id: 'kejsarjapan', name: 'Japanska kejsardömet', icon: '\u{1F338}', core: '392', color: '#bc002d', need: 2, aiChance: 0.06,
    lands: ['410', '408', '158'],
    mods: { factory: 10, milpower: 10 } },
  { id: 'manifest', name: 'Manifest Destiny', icon: '\u{1F985}', core: '840', color: '#3c5a99', need: 1, aiChance: 0.05,
    lands: ['124', '484'],
    mods: { income: 15, milpower: 10 } },
  { id: 'sydamunion', name: 'Sydamerikas enande', icon: '\u{1F30E}', core: '076', color: '#0a7d40', need: 4, aiChance: 0.05,
    lands: ['032', '152', '604', '170', '862', '600', '858', '068'],
    mods: { manpower: 12, income: 10 } },
  { id: 'afrikaunion', name: 'Södra Afrikas union', icon: '\u{1F30D}', core: '710', color: '#b8860b', need: 2, aiChance: 0.05,
    lands: ['716', '894', '072', '516'],
    mods: { income: 10, stability: 8 } },
  { id: 'nusantara', name: 'Nusantara', icon: '\u{1F30A}', core: '360', color: '#0f6f8a', need: 2, aiChance: 0.06,
    lands: ['458', '626', '096'],
    mods: { income: 10, manpower: 8 } },
];

// ---------- påhittade AI-ambitioner (genereras dynamiskt, sällsynta) ----------
// KONTINENT: ett (gärna litet) land vill erövra en stor del av sin världsdel.
// VARLDSHERRAVALDE: ett land vill ta över världen. Mycket sällsynt.
export const DYNAMIC_GOALS = {
  KONTINENT: { chance: 0.04, icon: '\u{1F5FA}\u{FE0F}', label: 'KONTINENTAL DOMINANS' },
  VARLDSHERRAVALDE: { chance: 0.008, icon: '\u{1F30D}', label: 'VÄRLDSHERRAVÄLDE' },
};

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
