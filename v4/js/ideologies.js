// IMPERIUM v4 — ideologier & doktriner (M3). Allt är data.
// mods = ideologins grundpåverkan; doktriner adderar sina egna.
// requires = { lagkategori: [tillåtna alternativ] } — tvingas vid antagande.
// locks = { lagkategori: [förbjudna alternativ] } — gråas ut i LAGAR-fliken.
// COUNTRY_IDEOLOGY = grundideologi per land utifrån dagens verkliga läge.

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
    mods: { freedom: 15, gdp: 8, income: 5, statepower: -8, ideopower: -5 },
    locks: { government: ['authoritarian', 'totalitarian'], elections: ['unfair', 'no'], press: ['propaganda'] },
    doctrines: {
      left: { name: 'Left wing', mods: { welfare: 8, qol: 5, income: -5 } },
      mixed: { name: 'Mixed', mods: { approval: 4 } },
      right: { name: 'Right wing', mods: { gdp: 8, income: 5, welfare: -6 } },
    },
  },
  socialdemocracy: {
    name: 'Socialdemokrati', icon: '\u{1F339}',
    mods: { welfare: 15, qol: 10, approval: 8, freedom: 8, income: -10, gdp: -3 },
    locks: { government: ['totalitarian'], elections: ['unfair', 'no'], press: ['highstate', 'propaganda'], welfare: ['none', 'independent'] },
  },
  conservatism: {
    name: 'Conservatism', icon: '\u{1F3F0}',
    mods: { stability: 12, integration: 8, safety: 5, ideopower: 5, immigration: -5, freedom: -3 },
    locks: { government: ['totalitarian'], culture: ['multi'] },
    doctrines: {
      national: { name: 'National', mods: { integration: 6, statepower: 5, immigration: -8 } },
      progressivism: { name: 'Progressivism', mods: { freedom: 6, research: 4, stability: -3 } },
      liberal: { name: 'Liberal', mods: { gdp: 5, freedom: 4 } },
      neo: { name: 'Neo', mods: { income: 6, milpower: 5, welfare: -5 } },
      traditionalism: { name: 'Traditionalism', mods: { stability: 8, ideopower: 6, research: -5, freedom: -5 } },
    },
  },
  democracy: {
    name: 'Democracy', icon: '\u{1F5F3}\u{FE0F}',
    mods: { freedom: 12, approval: 10, stability: 5, statepower: -5, justtime: 8 },
    locks: { government: ['authoritarian', 'totalitarian'], elections: ['hybrid', 'unfair', 'no'], press: ['highstate', 'propaganda'], civil_rights: ['verylimited', 'norights'] },
    doctrines: {
      farleft: { name: 'Far left', mods: { welfare: 10, income: -8, unrest: 3 } },
      left: { name: 'Left', mods: { welfare: 6, qol: 3, income: -4 } },
      center: { name: 'Center', mods: { stability: 5, approval: 3 } },
      right: { name: 'Right', mods: { gdp: 6, income: 4, welfare: -4 } },
      farright: { name: 'Far right', mods: { statepower: 6, immigration: -8, unrest: 3, freedom: -4 } },
    },
  },
  socialism: {
    name: 'Socialism', icon: '\u{1F91D}',
    mods: { welfare: 18, factory: 8, gdp: -8, income: -8, freedom: -5, statepower: 8 },
    requires: { economic_system: ['central', 'planned', 'thirdpos'] },
    locks: { welfare: ['none', 'independent', 'little'], taxes: ['t0', 't10'] },
    doctrines: {
      authoritarian: { name: 'Authoritarian', mods: { statepower: 12, unrest: -5, freedom: -12, approval: -5 } },
      hybrid: { name: 'Hybrid', mods: { statepower: 5, freedom: -3 } },
      balanced: { name: 'Balanced', mods: { approval: 4 } },
      democratic: { name: 'Democratic', mods: { freedom: 8, approval: 6, statepower: -5 } },
      libertarian: { name: 'Libertarian', mods: { freedom: 12, statepower: -10, stability: -4 } },
    },
  },
  communism: {
    name: 'Communism', icon: '\u{262D}',
    mods: { welfare: 20, factory: 12, statepower: 15, ideopower: 15, gdp: -18, income: -10, freedom: -20, corruption: 8 },
    requires: { economic_system: ['central', 'planned'], welfare: ['extreme', 'huge', 'coverage'] },
    locks: { elections: ['entirelyfree', 'free'], press: ['full', 'free'], taxes: ['t0', 't10'], government: ['directdemo', 'strongdemo'] },
    doctrines: {
      marxism: { name: 'Marxism', mods: { welfare: 5, approval: 3 } },
      leninism: { name: 'Leninism', mods: { statepower: 8, polpower: 6, freedom: -5 } },
      stalinism: { name: 'Stalinism', mods: { statepower: 15, milpower: 10, unrest: -8, freedom: -15, approval: -10, corruption: 6 } },
      maoism: { name: 'Maoism', mods: { manpower: 10, factory: 6, ideopower: 8, gdp: -5, freedom: -8 } },
    },
  },
  anarchism: {
    name: 'Anarchism', icon: '\u{24B6}',
    mods: { freedom: 30, statepower: -35, polpower: -20, stability: -18, unrest: 12, income: -12, milpower: -15 },
    requires: { government: ['directdemo', 'strongdemo', 'democracy'], civil_rights: ['extremelyhigh', 'veryhigh', 'high'] },
    locks: { elections: ['unfair', 'no'], press: ['state', 'highstate', 'propaganda'], party_loyalty: ['high', 'maximum', 'onlyrep'] },
    doctrines: {
      ancom: { name: 'Anarcho-communism', mods: { welfare: 10, gdp: -8 } },
      eco: { name: 'Eco-Anarchism', mods: { qol: 8, factory: -8 } },
      market: { name: 'Market-anarchism', mods: { gdp: 8, welfare: -5 } },
      ancap: { name: 'Anarcho-capitalism', mods: { gdp: 12, income: 5, welfare: -12, safety: -5 } },
      classical: { name: 'Classical', mods: { freedom: 5 } },
    },
  },
  populism: {
    name: 'Populism', icon: '\u{1F4E3}',
    mods: { approval: 12, polpower: 8, stability: -5, corruption: 5, research: -3 },
    doctrines: {
      left: { name: 'Left-wing', mods: { welfare: 8, income: -5 } },
      mixed: { name: 'Mixed', mods: { approval: 3 } },
      right: { name: 'Right wing', mods: { immigration: -8, integration: 5, safety: 3 } },
    },
  },
  nationalism: {
    name: 'Nationalism', icon: '\u{1F6A9}',
    mods: { ideopower: 15, integration: 10, milpower: 10, manpower: 5, immigration: -12, freedom: -8, justtime: -8 },
    locks: { immigration: ['noborders', 'open'], culture: ['multi'], globalism: ['major', 'big'] },
    doctrines: {
      ethno: { name: 'Ethno-Nationalism', mods: { integration: 8, immigration: -15, approval: -8, unrest: 8, freedom: -8 } },
      civic: { name: 'Civic-Nationalism', mods: { stability: 6, approval: 3 } },
      left: { name: 'Left-Wing', mods: { welfare: 6, factory: 5, gdp: -4 } },
    },
  },
  fascism: {
    name: 'Fascism', icon: '\u{1F985}',
    mods: { milpower: 18, statepower: 22, ideopower: 20, manpower: 10, readiness: 10, freedom: -30, approval: -12, unrest: 12, corruption: 10, justtime: -15, gdp: -8 },
    requires: { government: ['authoritarian', 'totalitarian'], press: ['state', 'highstate', 'propaganda'], party_loyalty: ['high', 'maximum', 'onlyrep'] },
    locks: { elections: ['entirelyfree', 'free', 'mostlyfree'], civil_rights: ['extremelyhigh', 'veryhigh', 'high'] },
    doctrines: {
      falangism: { name: 'Falangism', mods: { ideopower: 6, stability: 4 } },
      corporatism: { name: 'Corporatism', mods: { factory: 8, income: 5, corruption: 5 } },
      clerical: { name: 'Clerical', mods: { ideopower: 8, stability: 5, research: -6 } },
      classical: { name: 'Classical', mods: { milpower: 6, unrest: 3 } },
    },
  },
  natsoc: {
    name: 'National socialism', icon: '\u{26A0}\u{FE0F}',
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
    mods: { milpower: 15, readiness: 10, justtime: -18, income: 8, statepower: 12, approval: -8, unrest: 8, freedom: -10 },
  },
  theocracy: {
    name: 'Theocracy', icon: '\u{1F64F}',
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
    mods: { stability: 15, ideopower: 8, approval: 5, polpower: 5, freedom: -5 },
    doctrines: {
      constitutional: { name: 'Constitutional', mods: { freedom: 8, approval: 5 } },
      absolute: { name: 'Absolute', mods: { statepower: 18, polpower: 10, freedom: -18, approval: -8, corruption: 8 } },
    },
  },
};

// Grundideologi per land — satt utifrån dagens verkliga läge (förenklat, spelnivå).
// Länder som saknas här får fallbacken democracy/center.
export const COUNTRY_IDEOLOGY = {
  '752': ['socialdemocracy'],                 // Sverige
  '578': ['socialdemocracy'],                 // Norge
  '208': ['socialdemocracy'],                 // Danmark
  '246': ['socialdemocracy'],                 // Finland
  '352': ['socialdemocracy'],                 // Island
  '840': ['liberalism', 'right'],             // USA
  '124': ['liberalism', 'left'],              // Kanada
  '826': ['conservatism', 'liberal'],         // Storbritannien
  '276': ['conservatism', 'liberal'],         // Tyskland
  '250': ['liberalism', 'mixed'],             // Frankrike
  '724': ['socialdemocracy'],                 // Spanien
  '620': ['democracy', 'center'],             // Portugal
  '380': ['conservatism', 'national'],        // Italien
  '756': ['democracy', 'center'],             // Schweiz
  '528': ['liberalism', 'right'],             // Nederländerna
  '056': ['liberalism', 'mixed'],             // Belgien
  '040': ['conservatism', 'liberal'],         // Österrike
  '616': ['conservatism', 'liberal'],         // Polen
  '203': ['liberalism', 'right'],             // Tjeckien
  '348': ['populism', 'right'],               // Ungern
  '642': ['socialdemocracy'],                 // Rumänien
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
  '710': ['socialdemocracy'],                 // Sydafrika
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
