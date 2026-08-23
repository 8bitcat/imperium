// IMPERIUM v5 — ideologier & doktriner. Allt är data.
// mods = ideologins grundpåverkan; doktriner adderar sina egna.
// requires = { lagkategori: [tillåtna alternativ] } — tvingas vid antagande.
// locks = { lagkategori: [förbjudna alternativ] } — gråas ut i LAGAR-fliken.
// axes = ideologins läge på två axlar. Dessa driver TVÅ nya system i V5:
//   1) AFFINITET — ideologin har en åsikt om VARJE lagkategori, inte bara några.
//      Lagar som ligger nära ideologins läge ger harmoni; lagar som ligger långt
//      bort skaver och kostar dig ideologisk kraft, stabilitet och lugn.
//   2) IDEOLOGISKT AVSTÅND — hur främmande två länder är för varandra. Styr
//      relationer, handel, allianser och blockmedlemskap. Extrema val gör
//      världen fientlig på riktigt.
// COUNTRY_IDEOLOGY = grundideologi per land utifrån dagens verkliga läge.

import { LAWS } from './laws.js';

export const IDEOLOGY_COST = 150;   // Political power för ideologibyte
export const DOCTRINE_COST = 50;    // Political power för doktrinbyte

// ---------- IDEOLOGISKA LED ----------
// Ideologierna står i lodräta led. Man vandrar ETT steg i taget uppåt eller
// nedåt i sitt eget led — man hoppar inte fritt mellan ytterligheter. Vill man
// byta led måste man först ta sig upp till toppen av sitt nuvarande led;
// därifrån går det över till toppen av ett angränsande led.
export const IDEOLOGY_TRACKS = [
  { name: 'VÄNSTER', icon: '\u{270A}', ids: ['socialdemocracy', 'socialism', 'communism', 'anarchism'] },
  { name: 'MITTEN', icon: '\u{2696}\u{FE0F}', ids: ['democracy', 'liberalism', 'populism'] },
  { name: 'HÖGER', icon: '\u{1F3DB}\u{FE0F}', ids: ['conservatism', 'nationalism', 'imperialism'] },
  { name: 'AUKTORITÄRT', icon: '\u{1F451}', ids: ['monarchism', 'theocracy', 'fascism', 'natsoc'] },
];

export function trackOf(id) {
  for (let t = 0; t < IDEOLOGY_TRACKS.length; t++) {
    const i = IDEOLOGY_TRACKS[t].ids.indexOf(id);
    if (i >= 0) return { track: t, step: i };
  }
  return null;
}

// Får man byta från `from` till `to`? null = det går, annars skälet.
export function switchBlockedBy(from, to) {
  if (from === to) return 'DETTA ÄR DIN NUVARANDE IDEOLOGI';
  const a = trackOf(from), b = trackOf(to);
  if (!a || !b) return null;
  if (a.track === b.track) {
    return Math.abs(a.step - b.step) === 1 ? null : 'ETT STEG I TAGET — GÅ VIA MELLANLIGGANDE IDEOLOGI';
  }
  if (a.step !== 0) return `GÅ FÖRST UPP TILL ${(IDEOLOGIES[IDEOLOGY_TRACKS[a.track].ids[0]]?.name || '').toUpperCase()} FÖR ATT BYTA LED`;
  if (b.step !== 0) return `IN I DETTA LED KOMMER MAN BARA VIA ${(IDEOLOGIES[IDEOLOGY_TRACKS[b.track].ids[0]]?.name || '').toUpperCase()}`;
  if (Math.abs(a.track - b.track) !== 1) return 'BARA TILL ETT ANGRÄNSANDE LED';
  return null;
}

export const IDEOLOGIES = {
  liberalism: {
    name: 'Liberalism', icon: '\u{1F54A}\u{FE0F}',
    axes: { econ: 40, auth: 20 },
    mods: { freedom: 15, gdp: 8, income: 5, statepower: -8, ideopower: -5 },
    locks: { government: ['authoritarian', 'totalitarian'], elections: ['unfair', 'no'], press: ['propaganda'] },
    doctrines: {
      left: { name: 'Left wing', mods: { welfare: 8, qol: 5, income: -5 }, axes: { econ: -15 } },
      mixed: { name: 'Mixed', mods: { approval: 4 } },
      right: { name: 'Right wing', mods: { gdp: 8, income: 5, welfare: -6 }, axes: { econ: 15 } },
    },
  },
  socialdemocracy: {
    // BUFF (V5): socialdemokratin är nu ett fullvärdigt "bygga samhälle"-spår —
    // trygghet, utbildning och lugn i botten, inte bara dyr välfärd.
    name: 'Socialdemokrati', icon: '\u{1F339}',
    axes: { econ: -35, auth: 30 },
    mods: { welfare: 30, qol: 22, approval: 20, freedom: 14, hdi: 15, stability: 12, unrest: -12, research: 6, income: -8, gdp: -2 },
    locks: { government: ['totalitarian'], elections: ['unfair', 'no'], press: ['highstate', 'propaganda'], welfare: ['none', 'independent'] },
    doctrines: {
      reformist: { name: 'Reformistisk', mods: { gdp: 8, income: 6, research: 4 }, axes: { econ: 12 } },
      nordic: { name: 'Nordisk modell', mods: { welfare: 10, hdi: 8, corruption: -10, approval: 6 } },
      radical: { name: 'Radikal', mods: { welfare: 12, statepower: 8, gdp: -6, income: -6 }, axes: { econ: -18 } },
    },
  },
  conservatism: {
    // BUFF (V5): konservatismen ger nu verklig utväxling — ett lugnt, tryggt och
    // välmående samhälle som håller ihop, inte bara några stabilitetspoäng.
    name: 'Conservatism', icon: '\u{1F3F0}',
    axes: { econ: 30, auth: 45 },
    mods: { stability: 26, integration: 18, safety: 14, ideopower: 14, approval: 8, gdp: 8, income: 6, unrest: -8, immigration: -5, freedom: -3 },
    locks: { government: ['totalitarian'], culture: ['multi'] },
    doctrines: {
      national: { name: 'National', mods: { integration: 8, statepower: 8, milpower: 6, immigration: -8 }, axes: { auth: 12 } },
      progressivism: { name: 'Progressivism', mods: { freedom: 8, research: 8, hdi: 5, stability: -3 }, axes: { auth: -12 } },
      liberal: { name: 'Liberal', mods: { gdp: 10, income: 6, freedom: 6 }, axes: { econ: 12 } },
      neo: { name: 'Neo', mods: { income: 10, milpower: 10, gdp: 6, welfare: -5 }, axes: { econ: 15 } },
      traditionalism: { name: 'Traditionalism', mods: { stability: 12, ideopower: 10, approval: 5, research: -5, freedom: -5 }, axes: { auth: 15 } },
    },
  },
  democracy: {
    // BUFF (V5): demokrati är nu ett starkt "långsiktigt välstånd"-spår —
    // låg korruption, hög utveckling och ett folk som faktiskt står bakom dig.
    name: 'Democracy', icon: '\u{1F5F3}\u{FE0F}',
    axes: { econ: 0, auth: 20 },
    mods: { freedom: 22, approval: 22, stability: 16, hdi: 12, research: 10, gdp: 10, corruption: -12, unrest: -10, statepower: -5, justtime: 8 },
    locks: { government: ['authoritarian', 'totalitarian'], elections: ['hybrid', 'unfair', 'no'], press: ['highstate', 'propaganda'], civil_rights: ['verylimited', 'norights'] },
    doctrines: {
      farleft: { name: 'Far left', mods: { welfare: 14, qol: 6, income: -8, unrest: 3 }, axes: { econ: -40 } },
      left: { name: 'Left', mods: { welfare: 8, qol: 5, hdi: 4, income: -4 }, axes: { econ: -20 } },
      center: { name: 'Center', mods: { stability: 8, approval: 5, corruption: -5 } },
      right: { name: 'Right', mods: { gdp: 8, income: 6, factory: 4, welfare: -4 }, axes: { econ: 20 } },
      farright: { name: 'Far right', mods: { statepower: 8, safety: 6, immigration: -8, unrest: 3, freedom: -4 }, axes: { econ: 35, auth: 15 } },
    },
  },
  socialism: {
    name: 'Socialism', icon: '\u{1F91D}',
    axes: { econ: -70, auth: 55 },
    mods: { welfare: 18, factory: 8, gdp: -8, income: -8, freedom: -5, statepower: 8 },
    requires: { economic_system: ['central', 'planned', 'thirdpos'] },
    locks: { welfare: ['none', 'independent', 'little'], taxes: ['t0', 't10'] },
    doctrines: {
      authoritarian: { name: 'Authoritarian', mods: { statepower: 12, unrest: -5, freedom: -12, approval: -5 }, axes: { auth: 20 } },
      hybrid: { name: 'Hybrid', mods: { statepower: 5, freedom: -3 }, axes: { auth: 8 } },
      balanced: { name: 'Balanced', mods: { approval: 4 } },
      democratic: { name: 'Democratic', mods: { freedom: 8, approval: 6, statepower: -5 }, axes: { auth: -18 } },
      libertarian: { name: 'Libertarian', mods: { freedom: 12, statepower: -10, stability: -4 }, axes: { auth: -30 } },
    },
  },
  communism: {
    name: 'Communism', icon: '\u{262D}',
    axes: { econ: -95, auth: 85 },
    mods: { welfare: 20, factory: 12, statepower: 15, ideopower: 15, gdp: -18, income: -10, freedom: -20, corruption: 8 },
    requires: { economic_system: ['central', 'planned'], welfare: ['extreme', 'huge', 'coverage'] },
    locks: { elections: ['entirelyfree', 'free'], press: ['full', 'free'], taxes: ['t0', 't10'], government: ['directdemo', 'strongdemo'] },
    doctrines: {
      marxism: { name: 'Marxism', mods: { welfare: 5, approval: 3 } },
      leninism: { name: 'Leninism', mods: { statepower: 8, polpower: 6, freedom: -5 }, axes: { auth: 8 } },
      stalinism: { name: 'Stalinism', mods: { statepower: 15, milpower: 10, unrest: -8, freedom: -15, approval: -10, corruption: 6 }, axes: { auth: 15 } },
      maoism: { name: 'Maoism', mods: { manpower: 10, factory: 6, ideopower: 8, gdp: -5, freedom: -8 }, axes: { auth: 10 } },
    },
  },
  anarchism: {
    name: 'Anarchism', icon: '\u{24B6}',
    axes: { econ: -50, auth: 0 },
    mods: { freedom: 30, statepower: -35, polpower: -20, stability: -18, unrest: 12, income: -12, milpower: -15 },
    requires: { government: ['directdemo', 'strongdemo', 'democracy'], civil_rights: ['extremelyhigh', 'veryhigh', 'high'] },
    locks: { elections: ['unfair', 'no'], press: ['state', 'highstate', 'propaganda'], party_loyalty: ['high', 'maximum', 'onlyrep'] },
    doctrines: {
      ancom: { name: 'Anarcho-communism', mods: { welfare: 10, gdp: -8 }, axes: { econ: -35 } },
      eco: { name: 'Eco-Anarchism', mods: { qol: 8, factory: -8 } },
      market: { name: 'Market-anarchism', mods: { gdp: 8, welfare: -5 }, axes: { econ: 45 } },
      ancap: { name: 'Anarcho-capitalism', mods: { gdp: 12, income: 5, welfare: -12, safety: -5 }, axes: { econ: 70 } },
      classical: { name: 'Classical', mods: { freedom: 5 } },
    },
  },
  populism: {
    name: 'Populism', icon: '\u{1F4E3}',
    axes: { econ: 0, auth: 45 },
    mods: { approval: 12, polpower: 8, stability: -5, corruption: 5, research: -3 },
    doctrines: {
      left: { name: 'Left-wing', mods: { welfare: 8, income: -5 }, axes: { econ: -35 } },
      mixed: { name: 'Mixed', mods: { approval: 3 } },
      right: { name: 'Right wing', mods: { immigration: -8, integration: 5, safety: 3 }, axes: { econ: 30 } },
    },
  },
  nationalism: {
    name: 'Nationalism', icon: '\u{1F6A9}',
    axes: { econ: 20, auth: 65 },
    mods: { ideopower: 15, integration: 10, milpower: 10, manpower: 5, immigration: -12, freedom: -8, justtime: -8 },
    locks: { immigration: ['noborders', 'open'], culture: ['multi'], globalism: ['major', 'big'] },
    doctrines: {
      ethno: { name: 'Ethno-Nationalism', mods: { integration: 8, immigration: -15, approval: -8, unrest: 8, freedom: -8 }, axes: { auth: 15 } },
      civic: { name: 'Civic-Nationalism', mods: { stability: 6, approval: 3 }, axes: { auth: -10 } },
      left: { name: 'Left-Wing', mods: { welfare: 6, factory: 5, gdp: -4 }, axes: { econ: -40 } },
    },
  },
  fascism: {
    // BUFF (V5): fascismen är nu det starkaste krigs- och industrispåret i spelet
    // — total mobilisering av samhället — men gör dig till världens fiende.
    name: 'Fascism', icon: '\u{1F985}',
    axes: { econ: 25, auth: 90 },
    mods: { milpower: 34, statepower: 38, ideopower: 34, manpower: 20, readiness: 22, factory: 18, polpower: 14, stability: 10, freedom: -30, approval: -10, unrest: 8, corruption: 8, justtime: -26, gdp: -6 },
    requires: { government: ['authoritarian', 'totalitarian'], press: ['state', 'highstate', 'propaganda'], party_loyalty: ['high', 'maximum', 'onlyrep'] },
    locks: { elections: ['entirelyfree', 'free', 'mostlyfree'], civil_rights: ['extremelyhigh', 'veryhigh', 'high'] },
    doctrines: {
      falangism: { name: 'Falangism', mods: { ideopower: 10, stability: 8, integration: 6 } },
      corporatism: { name: 'Corporatism', mods: { factory: 16, income: 12, gdp: 6, corruption: 5 }, axes: { econ: 15 } },
      clerical: { name: 'Clerical', mods: { ideopower: 12, stability: 10, approval: 6, research: -6 } },
      classical: { name: 'Classical', mods: { milpower: 12, readiness: 8, unrest: 3 }, axes: { auth: 8 } },
    },
  },
  natsoc: {
    name: 'National socialism', icon: '\u{26A0}\u{FE0F}',
    axes: { econ: 20, auth: 100 },
    mods: { milpower: 20, statepower: 25, ideopower: 25, manpower: 12, readiness: 12, freedom: -45, approval: -20, unrest: 20, corruption: 12, justtime: -20, gdp: -12, immigration: -30, hdi: -10 },
    requires: { government: ['totalitarian'], press: ['propaganda'], party_loyalty: ['onlyrep'], culture: ['mono'] },
    locks: { elections: ['entirelyfree', 'free', 'mostlyfree', 'balanced'], civil_rights: ['extremelyhigh', 'veryhigh', 'high', 'balanced'], immigration: ['noborders', 'open', 'relaxed', 'balanced'] },
    doctrines: {
      neo: { name: 'Neo', mods: { unrest: 5, approval: -5 } },
      classical: { name: 'Classical', mods: { milpower: 5, unrest: 5 } },
    },
  },
  imperialism: {
    name: 'Imperialism', icon: '\u{1F451}',
    axes: { econ: 45, auth: 75 },
    mods: { milpower: 15, readiness: 10, justtime: -18, income: 8, statepower: 12, approval: -8, unrest: 8, freedom: -10 },
  },
  theocracy: {
    name: 'Theocracy', icon: '\u{1F64F}',
    axes: { econ: 0, auth: 80 },
    mods: { ideopower: 20, stability: 10, integration: 8, freedom: -18, research: -10, statepower: 10 },
    requires: { religion: ['statereligion'] },
    locks: { elections: ['entirelyfree', 'free'], press: ['full', 'free'] },
    doctrines: {
      islamic: { name: 'Islamic', mods: { stability: 4 } },
      christian: { name: 'Christian', mods: { approval: 4 } },
      jewish: { name: 'Jewish', mods: { integration: 4 } },
    },
  },
  monarchism: {
    name: 'Monarchism', icon: '\u{1F451}',
    axes: { econ: 35, auth: 70 },
    mods: { stability: 15, ideopower: 8, approval: 5, polpower: 5, freedom: -5 },
    doctrines: {
      constitutional: { name: 'Constitutional', mods: { freedom: 8, approval: 5 }, axes: { auth: -30 } },
      absolute: { name: 'Absolute', mods: { statepower: 18, polpower: 10, freedom: -18, approval: -8, corruption: 8 }, axes: { auth: 20 } },
    },
  },
};

// ---------- V5: IDEOLOGIN HAR EN ÅSIKT OM VARJE LAG ----------
// Varje lagkategori ligger på en axel. Alternativen står i ordning från den ena
// polen till den andra; `dir: -1` betyder att listan går åt motsatt håll mot
// axelns värde. Ur detta räknas ideologins ÖNSKADE alternativ fram automatiskt
// för ALLA kategorier — inte bara de som råkar finnas i locks/requires.
export const LAW_AXIS = {
  military_service:   { axis: 'auth', dir:  1 },
  press:              { axis: 'auth', dir:  1 },
  party_loyalty:      { axis: 'auth', dir:  1 },
  healthcare:         { axis: 'econ', dir:  1 },
  healthcare_quality: { axis: 'econ', dir: -1 },
  welfare:            { axis: 'econ', dir:  1 },
  taxes:              { axis: 'econ', dir: -1 },
  un:                 { axis: 'auth', dir: -1 },
  immigration:        { axis: 'auth', dir:  1 },
  culture:            { axis: 'auth', dir:  1 },
  religion:           { axis: 'auth', dir:  1 },
  elections:          { axis: 'auth', dir:  1 },
  government:         { axis: 'auth', dir:  1 },
  civil_rights:       { axis: 'auth', dir:  1 },
  economic_system:    { axis: 'econ', dir:  1 },
  education:          { axis: 'auth', dir:  1 },
  trials:             { axis: 'auth', dir:  1 },
  punishments:        { axis: 'auth', dir:  1 },
  rehabilitation:     { axis: 'auth', dir:  1 },
  death_penalty:      { axis: 'auth', dir:  1 },
  globalism:          { axis: 'auth', dir:  1 },
  popgrowth:          { axis: 'auth', dir:  1 },
  workhours:          { axis: 'econ', dir:  1 },
};

// Ideologins läge på axlarna, doktrinen inräknad.
export function axesOf(nation) {
  const ideo = nation?.ideology && IDEOLOGIES[nation.ideology];
  if (!ideo) return { econ: 0, auth: 40 };
  const base = { econ: 0, auth: 40, ...(ideo.axes || {}) };
  const doc = nation.doctrine && ideo.doctrines?.[nation.doctrine];
  if (doc?.axes) {
    for (const [k, v] of Object.entries(doc.axes)) base[k] = (base[k] || 0) + v;
  }
  base.econ = Math.max(-100, Math.min(100, base.econ));
  base.auth = Math.max(0, Math.min(100, base.auth));
  return base;
}

// Vilket alternativindex vill ideologin ha i den här lagkategorin?
export function preferredIndex(nation, cat) {
  const map = LAW_AXIS[cat];
  const opts = LAWS[cat]?.options;
  if (!map || !opts?.length) return null;
  const a = axesOf(nation);
  // normalisera axeln till 0..1
  let t = map.axis === 'econ' ? (a.econ + 100) / 200 : a.auth / 100;
  if (map.dir < 0) t = 1 - t;
  return Math.round(t * (opts.length - 1));
}

// Hur långt från ideologins önskade läge ligger den valda lagen? 0 = precis rätt.
export function lawDeviation(nation, cat) {
  const want = preferredIndex(nation, cat);
  if (want == null) return 0;
  const opts = LAWS[cat].options;
  const has = opts.findIndex((o) => o.id === nation.laws?.[cat]);
  if (has < 0) return 0;
  return Math.abs(has - want);
}

// Harmoni 0..1 över ALLA lagkategorier. Full poäng kräver att lagen ligger på
// partiets linje; ett steg fel är förlåtligt, två steg börjar kosta på riktigt.
// Att bara anta en ideologi räcker alltså inte — du måste lagstifta fram den.
export function ideologyHarmony(nation) {
  const cats = Object.keys(LAW_AXIS).filter((c) => LAWS[c]);
  if (!cats.length) return 1;
  let score = 0;
  for (const cat of cats) {
    const opts = LAWS[cat].options.length;
    const dev = lawDeviation(nation, cat);
    score += Math.max(0, 1 - dev / Math.max(1, (opts - 1) * 0.55));
  }
  return score / cats.length;
}

// Harmonins effekt på nationen. Lagar i linje med ideologin ger ett samhälle som
// hänger ihop; lagar som drar åt fel håll gör ideologin till en tom fasad.
export function harmonyMods(nation) {
  if (!nation?.ideology) return {};
  const h = ideologyHarmony(nation);
  const d = h - 0.5;   // −0.5 … +0.5
  const r = (x) => Math.round(d * x);
  return {
    ideopower: r(44),
    stability: r(26),
    unrest: r(-40),
    approval: r(22),
    polpower: r(18),
  };
}

// Kostnadsmultiplikator för ett lagbyte: mot ideologin är billigt, ifrån är dyrt.
export function lawCostFactor(nation, cat, toId) {
  const want = preferredIndex(nation, cat);
  if (want == null) return 1;
  const opts = LAWS[cat].options;
  const from = opts.findIndex((o) => o.id === nation.laws?.[cat]);
  const to = opts.findIndex((o) => o.id === toId);
  if (from < 0 || to < 0) return 1;
  const before = Math.abs(from - want);
  const after = Math.abs(to - want);
  if (after < before) return 0.5;   // partiet driver på — halva priset
  if (after > before) return 2;     // du bråkar med din egen rörelse
  return 1;
}

// ---------- V5: IDEOLOGISKT AVSTÅND MELLAN LÄNDER ----------
// Ärkefiender: par som avskyr varandra oavsett vad axlarna säger.
const NEMESIS = [
  ['fascism', 'communism'], ['fascism', 'socialism'], ['fascism', 'anarchism'],
  ['natsoc', 'communism'], ['natsoc', 'socialism'], ['natsoc', 'anarchism'],
  ['natsoc', 'liberalism'], ['natsoc', 'democracy'], ['natsoc', 'socialdemocracy'],
  ['communism', 'theocracy'], ['communism', 'monarchism'], ['communism', 'liberalism'],
  ['anarchism', 'monarchism'], ['anarchism', 'theocracy'], ['anarchism', 'imperialism'],
];
const nemesisKey = (a, b) => [a, b].sort().join('|');
const NEMESIS_SET = new Set(NEMESIS.map(([a, b]) => nemesisKey(a, b)));

// 0 = identiska, 100 = så främmande det går.
export function ideologyDistance(a, b) {
  if (!a || !b) return 40;
  if (a.ideology === b.ideology) {
    // samma ideologi men olika doktrin är fortfarande nästan samma sak
    return a.doctrine === b.doctrine ? 0 : 8;
  }
  const A = axesOf(a), B = axesOf(b);
  const de = Math.abs(A.econ - B.econ) / 2;      // 0..100
  const da = Math.abs(A.auth - B.auth);          // 0..100
  let d = Math.min(100, Math.sqrt(de * de + da * da) / Math.SQRT2 * 1.15);
  if (NEMESIS_SET.has(nemesisKey(a.ideology, b.ideology))) d = Math.min(100, d + 45);
  return Math.round(d);
}

// Hur mycket ideologin drar relationen mellan två länder. + = vänskap, − = fiendskap.
export function ideologyRelationBias(a, b) {
  const d = ideologyDistance(a, b);
  return Math.round(28 - d * 0.85);   // +28 vid identiska, −57 vid ärkefiender
}

// Över detta avstånd vägrar landet alliera sig med dig.
export const ALLY_MAX_DISTANCE = 55;
// Över detta avstånd vägrar landet gå med i ditt block.
export const BLOC_MAX_DISTANCE = 42;
// Över detta avstånd blir handeln dyrare — och till sist omöjlig.
export const TRADE_FRICTION_FROM = 35;
export const TRADE_MAX_DISTANCE = 80;

// Prispåslag på handelsavtal på grund av ideologisk fiendskap (1 = normalpris).
export function tradeCostFactor(a, b) {
  const d = ideologyDistance(a, b);
  if (d <= TRADE_FRICTION_FROM) return 1;
  return 1 + (d - TRADE_FRICTION_FROM) / 30;   // upp till ~2.5× vid ärkefiende
}

export function tradeBlockedBy(a, b) {
  const d = ideologyDistance(a, b);
  if (d < TRADE_MAX_DISTANCE) return null;
  return `${IDEOLOGIES[b.ideology]?.name.toUpperCase() || '?'} HANDLAR INTE MED ${IDEOLOGIES[a.ideology]?.name.toUpperCase() || '?'}`;
}

export function allyBlockedBy(a, b) {
  const d = ideologyDistance(a, b);
  if (d <= ALLY_MAX_DISTANCE) return null;
  return `IDEOLOGISK AVGRUND (${d}) — ${IDEOLOGIES[b.ideology]?.name.toUpperCase() || '?'} ALLIERAR SIG ALDRIG MED DIG`;
}

export function blocBlockedBy(a, b) {
  const d = ideologyDistance(a, b);
  if (d <= BLOC_MAX_DISTANCE) return null;
  return `FÖR IDEOLOGISKT FRÄMMANDE (${d}) FÖR ATT DELA BLOCK`;
}

// Grundideologi per land — satt utifrån dagens verkliga läge (förenklat, spelnivå).
// Länder som saknas här får fallbacken democracy/center.
export const COUNTRY_IDEOLOGY = {
  '752': ['socialdemocracy', 'nordic'],       // Sverige
  '578': ['socialdemocracy', 'nordic'],       // Norge
  '208': ['socialdemocracy', 'nordic'],       // Danmark
  '246': ['socialdemocracy', 'nordic'],       // Finland
  '352': ['socialdemocracy', 'nordic'],       // Island
  '840': ['liberalism', 'right'],             // USA
  '124': ['liberalism', 'left'],              // Kanada
  '826': ['conservatism', 'liberal'],         // Storbritannien
  '276': ['conservatism', 'liberal'],         // Tyskland
  '250': ['liberalism', 'mixed'],             // Frankrike
  '724': ['socialdemocracy', 'reformist'],    // Spanien
  '620': ['democracy', 'center'],             // Portugal
  '380': ['conservatism', 'national'],        // Italien
  '756': ['democracy', 'center'],             // Schweiz
  '528': ['liberalism', 'right'],             // Nederländerna
  '056': ['liberalism', 'mixed'],             // Belgien
  '040': ['conservatism', 'liberal'],         // Österrike
  '616': ['conservatism', 'liberal'],         // Polen
  '203': ['liberalism', 'right'],             // Tjeckien
  '348': ['populism', 'right'],               // Ungern
  '642': ['socialdemocracy', 'reformist'],    // Rumänien
  '300': ['conservatism', 'liberal'],         // Grekland
  '372': ['liberalism', 'mixed'],             // Irland
  '804': ['democracy', 'center'],             // Ukraina
  '112': ['nationalism', 'civic'],            // Belarus
  '643': ['nationalism', 'civic'],            // Ryssland
  '156': ['communism', 'maoism'],             // Kina
  '408': ['communism', 'stalinism'],          // Nordkorea
  '410': ['democracy', 'center'],             // Sydkorea
  '392': ['conservatism', 'liberal'],         // Japan
  '704': ['communism', 'leninism'],           // Vietnam
  '418': ['communism', 'leninism'],           // Laos
  '192': ['communism', 'leninism'],           // Kuba
  '764': ['monarchism', 'constitutional'],    // Thailand
  '356': ['nationalism', 'civic'],            // Indien
  '586': ['democracy', 'right'],              // Pakistan
  '050': ['democracy', 'center'],             // Bangladesh
  '360': ['democracy', 'center'],             // Indonesien
  '458': ['monarchism', 'constitutional'],    // Malaysia
  '608': ['democracy', 'center'],             // Filippinerna
  '036': ['democracy', 'left'],               // Australien
  '554': ['democracy', 'left'],               // Nya Zeeland
  '364': ['theocracy', 'islamic'],            // Iran
  '682': ['monarchism', 'absolute'],          // Saudiarabien
  '784': ['monarchism', 'absolute'],          // Förenade Arabemiraten
  '634': ['monarchism', 'absolute'],          // Qatar
  '414': ['monarchism', 'constitutional'],    // Kuwait
  '400': ['monarchism', 'constitutional'],    // Jordanien
  '512': ['monarchism', 'absolute'],          // Oman
  '376': ['democracy', 'right'],              // Israel
  '792': ['populism', 'right'],               // Turkiet
  '818': ['nationalism', 'civic'],            // Egypten
  '004': ['theocracy', 'islamic'],            // Afghanistan
  '336': ['theocracy', 'christian'],          // Vatikanen
  '504': ['monarchism', 'constitutional'],    // Marocko
  '012': ['nationalism', 'civic'],            // Algeriet
  '434': ['nationalism', 'civic'],            // Libyen
  '760': ['nationalism', 'civic'],            // Syrien
  '729': ['nationalism', 'civic'],            // Sudan
  '368': ['democracy', 'center'],             // Irak
  '566': ['democracy', 'center'],             // Nigeria
  '710': ['socialdemocracy', 'radical'],      // Sydafrika
  '231': ['democracy', 'center'],             // Etiopien
  '404': ['democracy', 'center'],             // Kenya
  '232': ['nationalism', 'civic'],            // Eritrea
  '076': ['democracy', 'left'],               // Brasilien
  '032': ['liberalism', 'right'],             // Argentina
  '152': ['democracy', 'left'],               // Chile
  '170': ['democracy', 'left'],               // Colombia
  '604': ['democracy', 'right'],              // Peru
  '862': ['socialism', 'authoritarian'],      // Venezuela
  '068': ['socialism', 'democratic'],         // Bolivia
  '484': ['populism', 'left'],                // Mexiko
  '398': ['nationalism', 'civic'],            // Kazakstan
  '795': ['nationalism', 'civic'],            // Turkmenistan
  '860': ['nationalism', 'civic'],            // Uzbekistan
};

export function countryIdeology(countryId) {
  const entry = COUNTRY_IDEOLOGY[String(countryId)];
  if (entry) return { ideology: entry[0], doctrine: entry[1] || null };
  return { ideology: 'democracy', doctrine: 'center' };
}

export function ideologyMods(nation) {
  if (!nation?.ideology) return {};
  const ideo = IDEOLOGIES[nation.ideology];
  if (!ideo) return {};
  const sum = { ...ideo.mods };
  const doc = nation.doctrine && ideo.doctrines?.[nation.doctrine];
  if (doc) for (const [k, v] of Object.entries(doc.mods)) sum[k] = (sum[k] || 0) + v;
  // harmonin mellan ideologi och lagar läggs på ovanpå grundmoddarna
  for (const [k, v] of Object.entries(harmonyMods(nation))) sum[k] = (sum[k] || 0) + v;
  return sum;
}

// Är ett lagalternativ blockerat av nuvarande ideologi?
export function lawLockedBy(nation, cat, optId) {
  const ideo = nation?.ideology && IDEOLOGIES[nation.ideology];
  if (!ideo) return null;
  if (ideo.locks?.[cat]?.includes(optId)) return ideo.name + ' förbjuder detta';
  if (ideo.requires?.[cat] && !ideo.requires[cat].includes(optId)) return ideo.name + ' kräver: ' + ideo.requires[cat].join(' / ');
  return null;
}

// Tvinga lagarna att uppfylla ideologins krav — returnerar lista över ändringar
export function enforceRequirements(nation) {
  const ideo = nation?.ideology && IDEOLOGIES[nation.ideology];
  const changed = [];
  if (!ideo?.requires) return changed;
  for (const [cat, allowed] of Object.entries(ideo.requires)) {
    if (!allowed.includes(nation.laws[cat])) {
      nation.laws[cat] = allowed[0];
      changed.push(cat);
    }
  }
  return changed;
}
