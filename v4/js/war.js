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
// core = grundlandet som krävs; lands = historiska territorier (alla krävs för
// utrop sedan V5.8 — need sätts till lands.length nedan); aiChance = sannolikhet
// per AI-drag att riket driver sin expansion vidare.
export const HISTORICAL_EMPIRES = [
  { id: 'sovjet', name: 'Sovjetunionen', icon: '\u{262D}', core: '643', color: '#c0392b', aiChance: 0.25,
    lands: [
      '804', '112', '398', '860', '795', '762', '417', '268', '051', '031', '233', '428',
      '440', '498',
    ],
    mods: { milpower: 15, manpower: 12, factory: 10, freedom: -15 } },
  { id: 'brittiska', name: 'Brittiska imperiet', icon: '\u{1F451}', core: '826', color: '#b03060', aiChance: 0.12,
    lands: [
      '372', '470', '196', '818', '368', '400', '376', '275', '414', '048', '634', '784',
      '887', '729', '728', '404', '800', '834', '894', '716', '454', '072', '426', '748',
      '710', '516', '566', '288', '694', '270', '480', '690', '356', '586', '050', '144',
      '104', '462', '064', '458', '702', '096', '124', '388', '780', '044', '052', '084',
      '328', '028', '212', '308', '659', '662', '670', '036', '554', '242', '090', '598',
      '296', '520', '882', '776', '548',
    ],
    mods: { income: 15, gdp: 10, milpower: 8 } },
  { id: 'rom', name: 'Romarriket', icon: '\u{1F3DB}\u{FE0F}', core: '380', color: '#8e44ad', aiChance: 0.08,
    lands: [
      '724', '620', '250', '056', '442', '756', '040', '826', '705', '191', '070', '688',
      '499', '008', '807', '300', '100', '642', '792', '196', '470', '760', '422', '376',
      '275', '400', '368', '051', '818', '434', '788', '012', '674', '492', '020', '438',
    ],
    mods: { stability: 15, statepower: 12, income: 8 } },
  { id: 'mongol', name: 'Mongolväldet', icon: '\u{1F3F9}', core: '496', color: '#d35400', aiChance: 0.10,
    lands: [
      '156', '643', '804', '498', '398', '860', '795', '762', '417', '004', '364', '368',
      '031', '051', '268', '792', '408', '410',
    ],
    mods: { manpower: 15, milpower: 12, readiness: 10 } },
  { id: 'osman', name: 'Osmanska riket', icon: '\u{262A}\u{FE0F}', core: '792', color: '#16a085', aiChance: 0.15,
    lands: [
      '300', '100', '688', '807', '008', '499', '070', '348', '642', '498', '196', '760',
      '422', '376', '275', '400', '368', '818', '434', '788', '012', '682', '887',
    ],
    mods: { stability: 10, income: 10, milpower: 8 } },
  { id: 'stormakt', name: 'Svenska stormaktsväldet', icon: '\u{1F9AC}', core: '752', color: '#2980b9', aiChance: 0.06,
    lands: ['246', '233', '428'],
    mods: { milpower: 10, stability: 10, approval: 8 } },
  { id: 'kalmar', name: 'Kalmarunionen', icon: '\u{26F5}', core: '208', color: '#27ae60', aiChance: 0.06,
    lands: ['752', '578', '246', '352'],
    mods: { income: 10, stability: 12, approval: 5 } },
  { id: 'kejsardomet', name: 'Tyska kejsardömet', icon: '\u{1F985}', core: '276', color: '#5d6d7e', aiChance: 0.10,
    lands: ['516', '834', '646', '108', '120', '768', '598', '882', '520', '584', '585', '583'],
    mods: { factory: 12, milpower: 10, research: 8 } },
  { id: 'persien', name: 'Persiska riket', icon: '\u{1F981}', core: '364', color: '#af601a', aiChance: 0.10,
    lands: [
      '368', '004', '762', '795', '860', '586', '031', '051', '792', '760', '422', '376',
      '275', '400', '196', '818', '414',
    ],
    mods: { stability: 10, income: 8, ideopower: 8 } },
  { id: 'napoleon', name: 'Franska kejsardömet', icon: '\u{1F985}', core: '250', color: '#2c3e97', aiChance: 0.08,
    lands: ['056', '528', '442', '492', '380', '276', '756', '724', '705', '191', '020'],
    mods: { milpower: 12, statepower: 10, approval: 5 } },
  { id: 'spanska', name: 'Spanska imperiet', icon: '\u{26F5}', core: '724', color: '#b8860b', aiChance: 0.08,
    lands: [
      '484', '320', '340', '222', '558', '188', '591', '192', '214', '170', '862', '218',
      '604', '068', '152', '032', '600', '858', '780', '608', '226',
    ],
    mods: { income: 12, milpower: 8 } },
  { id: 'portugisiska', name: 'Portugisiska sjöväldet', icon: '\u{2693}', core: '620', color: '#2e8b57', aiChance: 0.06,
    lands: ['076', '024', '508', '624', '132', '678', '626'],
    mods: { income: 10, gdp: 8 } },
  { id: 'nederlandska', name: 'Nederländska handelsväldet', icon: '\u{1F6A2}', core: '528', color: '#e07020', aiChance: 0.06,
    lands: ['360', '740', '328', '480'],
    mods: { income: 15, gdp: 10 } },
  { id: 'bysans', name: 'Bysantinska riket', icon: '\u{2626}\u{FE0F}', core: '300', color: '#6a0dad', aiChance: 0.06,
    lands: [
      '792', '100', '807', '008', '688', '499', '070', '380', '674', '470', '196', '760',
      '422', '376', '275', '400', '818', '434', '788',
    ],
    mods: { stability: 12, ideopower: 10 } },
  { id: 'farao', name: 'Faraonernas rike', icon: '\u{1F3FA}', core: '818', color: '#c9a227', aiChance: 0.07,
    lands: ['376', '275', '422'],
    mods: { stability: 10, ideopower: 8 } },
  { id: 'inka', name: 'Inkariket', icon: '\u{26F0}\u{FE0F}', core: '604', color: '#8b4513', aiChance: 0.06,
    lands: ['218', '068', '152'],
    mods: { stability: 10, manpower: 8 } },
  { id: 'azteker', name: 'Aztekernas arv', icon: '\u{1F985}', core: '484', color: '#0e7a5f', aiChance: 0.06,
    lands: ['320', '222', '340', '558', '188'],
    mods: { manpower: 10, milpower: 6 } },
  { id: 'babylon', name: 'Babylons återkomst', icon: '\u{1F981}', core: '368', color: '#7b3f00', aiChance: 0.06,
    lands: ['760', '422', '376', '275', '400', '414'],
    mods: { stability: 8, income: 8 } },
  { id: 'arabhalvon', name: 'Halvöns enande', icon: '\u{1F54C}', core: '682', color: '#0f7a3d', aiChance: 0.07,
    lands: ['784', '634', '512', '414', '887', '048'],
    mods: { income: 15, stability: 8 } },
  { id: 'maurya', name: 'Mauryariket', icon: '\u{1F418}', core: '356', color: '#e08020', aiChance: 0.08,
    lands: ['586', '050', '004', '524'],
    mods: { manpower: 12, stability: 8 } },
  { id: 'mittensrike', name: 'Mittens rike', icon: '\u{1F409}', core: '156', color: '#c41e3a', aiChance: 0.10,
    lands: ['496'],
    mods: { factory: 12, milpower: 10 } },
  { id: 'aksum', name: 'Aksumriket', icon: '\u{1F992}', core: '231', color: '#8b6f2b', aiChance: 0.05,
    lands: ['232', '887'],
    mods: { stability: 10, manpower: 8 } },
  { id: 'maliriket', name: 'Maliriket', icon: '\u{1FA99}', core: '466', color: '#d4a017', aiChance: 0.05,
    lands: ['686', '270', '324', '624', '478'],
    mods: { income: 12, gdp: 8 } },
  { id: 'polsklit', name: 'Polsk-litauiska samväldet', icon: '\u{1F985}', core: '616', color: '#c0305a', aiChance: 0.07,
    lands: ['440', '112', '804', '428'],
    mods: { stability: 10, milpower: 8 } },
  { id: 'nordsjo', name: 'Nordsjöväldet', icon: '\u{2694}\u{FE0F}', core: '578', color: '#1d5f8a', aiChance: 0.05,
    lands: ['208', '826'],
    mods: { income: 10, milpower: 6 } },
  { id: 'habsburg', name: 'Habsburgska riket', icon: '\u{1F451}', core: '040', color: '#e8b923', aiChance: 0.07,
    lands: ['348', '203', '703', '705', '191', '070'],
    mods: { stability: 12, income: 8 } },
  { id: 'storungern', name: 'Kronans länder', icon: '\u{1F451}', core: '348', color: '#3e7a3e', aiChance: 0.05,
    lands: ['703', '191'],
    mods: { stability: 8, manpower: 6 } },
  { id: 'kejsarjapan', name: 'Japanska kejsardömet', icon: '\u{1F338}', core: '392', color: '#bc002d', aiChance: 0.06,
    lands: [
      '408', '410', '585', '584', '583', '608', '360', '458', '702', '096', '104', '626',
      '704', '418', '116', '520',
    ],
    mods: { factory: 10, milpower: 10 } },
  { id: 'manifest', name: 'Manifest Destiny', icon: '\u{1F985}', core: '840', color: '#3c5a99', aiChance: 0.05,
    lands: ['124', '484'],
    mods: { income: 15, milpower: 10 } },
  { id: 'sydamunion', name: 'Sydamerikas enande', icon: '\u{1F30E}', core: '076', color: '#0a7d40', aiChance: 0.05,
    lands: ['032', '152', '604', '170', '862', '600', '858', '068', '218', '328', '740'],
    mods: { manpower: 12, income: 10 } },
  { id: 'afrikaunion', name: 'Södra Afrikas union', icon: '\u{1F30D}', core: '710', color: '#b8860b', aiChance: 0.05,
    lands: ['516', '072', '716', '894', '508', '426', '748', '454', '024'],
    mods: { income: 10, stability: 8 } },
  { id: 'nusantara', name: 'Nusantara', icon: '\u{1F30A}', core: '360', color: '#0f6f8a', aiChance: 0.06,
    lands: ['458', '626', '096', '702'],
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

// V5.8: ett historiskt rike kräver ALLA sina gamla länder — Sovjetunionen kan
// bara utropas när alla femton sovjetrepublikerna är dina igen.
for (const e of HISTORICAL_EMPIRES) e.need = e.lands.length;

// Vilka riken kan spelaren utropa just nu? (äger core + alla lands)
export function formableEmpires(ownedIds) {
  return HISTORICAL_EMPIRES.filter((e) => empireComplete(e, ownedIds));
}

export function empireComplete(e, ownedIds) {
  const owned = new Set(ownedIds);
  return owned.has(e.core) && e.lands.every((l) => owned.has(l));
}

export function empireProgress(e, ownedIds) {
  const owned = new Set(ownedIds);
  const missing = e.lands.filter((l) => !owned.has(l));
  return { have: e.lands.length - missing.length, need: e.need, hasCore: owned.has(e.core), missing };
}
