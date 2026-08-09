// IMPERIUM v4 — INTEGRATION av erövrade länder.
// Ett erövrat land ger inget direkt: det är oroligt, kostar att styra och måste
// integreras i moderlandet i tre faser. Hur illa det börjar avgörs av hur långt
// ifrån varandra ideologierna och religionerna ligger.

// ---------- ideologisk axel: -3 = långt till vänster, +3 = långt till höger ----------
export const IDEO_AXIS = {
  anarchism: -3, communism: -3, socialism: -2, socialdemocracy: -1,
  liberalism: 0, democracy: 0, populism: 0,
  conservatism: 1, monarchism: 1, theocracy: 2, nationalism: 2,
  imperialism: 2, fascism: 3, natsoc: 3,
};

// ---------- religioner ----------
export const RELIGIONS = {
  KRISTEN:   { name: 'Kristendom', icon: '\u{271D}\u{FE0F}', fam: 'abrahamitisk' },
  KATOLSK:   { name: 'Katolicism', icon: '\u{26EA}', fam: 'abrahamitisk' },
  ORTODOX:   { name: 'Ortodox kristendom', icon: '\u{2626}\u{FE0F}', fam: 'abrahamitisk' },
  ISLAM:     { name: 'Islam', icon: '\u{262A}\u{FE0F}', fam: 'abrahamitisk' },
  JUDISK:    { name: 'Judendom', icon: '\u{2721}\u{FE0F}', fam: 'abrahamitisk' },
  HINDU:     { name: 'Hinduism', icon: '\u{1F549}\u{FE0F}', fam: 'dharmisk' },
  BUDDHIST:  { name: 'Buddhism', icon: '\u{2638}\u{FE0F}', fam: 'dharmisk' },
  SIKH:      { name: 'Sikhism', icon: '\u{1FAAF}', fam: 'dharmisk' },
  FOLKTRO:   { name: 'Folktro', icon: '\u{1F343}', fam: 'folklig' },
  SEKULAR:   { name: 'Sekulär', icon: '\u{1F52C}', fam: 'sekulär' },
};

// Landets dominerande religion (ISO-numeriskt id). Saknas landet används
// regionsgissningen i religionOf().
export const COUNTRY_RELIGION = {
  // Norden & Västeuropa
  '752': 'SEKULAR', '578': 'KRISTEN', '208': 'SEKULAR', '246': 'KRISTEN', '352': 'KRISTEN',
  '826': 'KRISTEN', '372': 'KATOLSK', '250': 'SEKULAR', '276': 'KRISTEN', '528': 'SEKULAR',
  '056': 'KATOLSK', '442': 'KATOLSK', '756': 'KRISTEN', '040': 'KATOLSK', '380': 'KATOLSK',
  '724': 'KATOLSK', '620': 'KATOLSK', '300': 'ORTODOX', '616': 'KATOLSK', '203': 'SEKULAR',
  '703': 'KATOLSK', '348': 'KATOLSK', '705': 'KATOLSK', '191': 'KATOLSK', '642': 'ORTODOX',
  '100': 'ORTODOX', '688': 'ORTODOX', '070': 'ISLAM', '807': 'ORTODOX', '008': 'ISLAM',
  '233': 'SEKULAR', '428': 'KRISTEN', '440': 'KATOLSK', '112': 'ORTODOX', '804': 'ORTODOX',
  '498': 'ORTODOX', '643': 'ORTODOX', '268': 'ORTODOX', '051': 'KRISTEN', '031': 'ISLAM',
  // Mellanöstern & Nordafrika
  '792': 'ISLAM', '364': 'ISLAM', '368': 'ISLAM', '760': 'ISLAM', '400': 'ISLAM',
  '682': 'ISLAM', '887': 'ISLAM', '512': 'ISLAM', '784': 'ISLAM', '634': 'ISLAM',
  '414': 'ISLAM', '048': 'ISLAM', '376': 'JUDISK', '818': 'ISLAM', '434': 'ISLAM',
  '788': 'ISLAM', '012': 'ISLAM', '504': 'ISLAM', '732': 'ISLAM',
  // Afrika söder om Sahara
  '729': 'ISLAM', '728': 'KRISTEN', '231': 'ORTODOX', '232': 'ORTODOX', '706': 'ISLAM',
  '404': 'KRISTEN', '834': 'KRISTEN', '800': 'KRISTEN', '646': 'KRISTEN', '108': 'KRISTEN',
  '180': 'KRISTEN', '178': 'KRISTEN', '024': 'KRISTEN', '894': 'KRISTEN', '716': 'KRISTEN',
  '508': 'KRISTEN', '710': 'KRISTEN', '516': 'KRISTEN', '072': 'KRISTEN', '426': 'KRISTEN',
  '748': 'KRISTEN', '450': 'KRISTEN', '454': 'KRISTEN', '566': 'ISLAM', '288': 'KRISTEN',
  '384': 'ISLAM', '854': 'ISLAM', '466': 'ISLAM', '562': 'ISLAM', '148': 'ISLAM',
  '478': 'ISLAM', '686': 'ISLAM', '270': 'ISLAM', '324': 'ISLAM', '624': 'ISLAM',
  '694': 'ISLAM', '430': 'KRISTEN', '384_': 'ISLAM', '120': 'KRISTEN', '140': 'KRISTEN',
  // Asien
  '356': 'HINDU', '586': 'ISLAM', '050': 'ISLAM', '524': 'HINDU', '144': 'BUDDHIST',
  '104': 'BUDDHIST', '764': 'BUDDHIST', '116': 'BUDDHIST', '418': 'BUDDHIST', '704': 'FOLKTRO',
  '458': 'ISLAM', '360': 'ISLAM', '096': 'ISLAM', '608': 'KATOLSK', '156': 'SEKULAR',
  '158': 'FOLKTRO', '392': 'BUDDHIST', '410': 'SEKULAR', '408': 'SEKULAR', '496': 'BUDDHIST',
  '398': 'ISLAM', '860': 'ISLAM', '795': 'ISLAM', '762': 'ISLAM', '417': 'ISLAM',
  '004': 'ISLAM', '051_': 'KRISTEN', '268_': 'ORTODOX',
  // Amerika
  '840': 'KRISTEN', '124': 'SEKULAR', '484': 'KATOLSK', '320': 'KATOLSK', '340': 'KATOLSK',
  '558': 'KATOLSK', '188': 'KATOLSK', '591': 'KATOLSK', '192': 'KATOLSK', '214': 'KATOLSK',
  '332': 'KATOLSK', '388': 'KRISTEN', '780': 'KRISTEN', '076': 'KATOLSK', '032': 'KATOLSK',
  '152': 'KATOLSK', '604': 'KATOLSK', '170': 'KATOLSK', '862': 'KATOLSK', '218': 'KATOLSK',
  '068': 'KATOLSK', '600': 'KATOLSK', '858': 'SEKULAR', '328': 'KRISTEN', '740': 'KRISTEN',
  // Oceanien
  '036': 'SEKULAR', '554': 'SEKULAR', '598': 'KRISTEN', '242': 'KRISTEN', '090': 'KRISTEN',
};

// Regionsgissning när landet saknas i tabellen
export function religionOf(cid, centroid) {
  const known = COUNTRY_RELIGION[cid];
  if (known) return known;
  const [lon, lat] = centroid || [0, 0];
  if (lat > 35 && lon > -12 && lon < 40) return 'KRISTEN';       // Europa
  if (lat > 12 && lat < 42 && lon > -18 && lon < 65) return 'ISLAM'; // MENA
  if (lat < 15 && lat > -35 && lon > -20 && lon < 52) return 'KRISTEN'; // Afrika
  if (lat > 5 && lon >= 65 && lon < 95) return 'HINDU';
  if (lon >= 95 && lat > -10) return 'BUDDHIST';
  if (lon < -30) return 'KATOLSK';                               // Latinamerika
  return 'FOLKTRO';
}

// ---------- startvärde för integrationen ----------
// Ju längre isär ideologi och religion ligger, desto djupare i minus börjar man.
// Ett land UTAN landgräns mot ditt rike är det överlägset svåraste att hålla —
// det är den största enskilda debuffen i systemet.
export const EXCLAVE_PENALTY = 45;

export function startPercent(myIdeo, theirIdeo, myRel, theirRel, adjacent = true) {
  const a = IDEO_AXIS[myIdeo] ?? 0;
  const b = IDEO_AXIS[theirIdeo] ?? 0;
  const gap = Math.abs(a - b);
  // 0 steg = 0, 1 steg = -8, 2 = -18, 3 = -30, 4 = -42, 5+ = -55
  const ideoPen = [0, 8, 18, 30, 42, 55, 62][Math.min(gap, 6)];
  let relPen = 0;
  if (myRel !== theirRel) {
    const fa = RELIGIONS[myRel]?.fam, fb = RELIGIONS[theirRel]?.fam;
    relPen = fa === fb ? 8 : 22;                 // samma familj = lindrigt
    if (myRel === 'SEKULAR' || theirRel === 'SEKULAR') relPen = Math.min(relPen, 12);
  }
  return Math.max(-95, -(ideoPen + relPen + (adjacent ? 0 : EXCLAVE_PENALTY)));
}

// ---------- tre integrationsfaser ----------
// Fas 1 (ockupation) kostar mest — därefter går landet plus minus noll.
export const PHASES = [
  { at: 0, name: 'OCKUPATION', desc: 'INGEN INKOMST — LANDET KOSTAR ATT HÅLLA', income: -0.5, pp: -0.4, unrest: 34 },
  { at: 40, name: 'PACIFICERING', desc: 'LANDET BÄR SIG SJÄLVT (\u{00B1}0)', income: 0, pp: 0, unrest: 18 },
  { at: 75, name: 'ASSIMILERING', desc: 'HALV INKOMST, ORON LÄGGER SIG', income: 0.5, pp: 0.5, unrest: 8 },
  { at: 100, name: 'INTEGRERAT', desc: 'FULL INKOMST — LANDET ÄR DITT', income: 1, pp: 1, unrest: 0 },
];

export function phaseOf(pct) {
  let p = PHASES[0];
  for (const ph of PHASES) if (pct >= ph.at) p = ph;
  return p;
}

export function phaseIndex(pct) {
  return PHASES.indexOf(phaseOf(pct));
}

// ---------- kostnad för att köpa på integrationen ----------
// Priset stiger med landets storlek och sjunker med forskningen.
export function pushCost(pop, pct, researchTier) {
  const size = Math.max(1, Math.sqrt((pop || 5e6) / 1e6) / 3);
  const disc = 1 - 0.12 * (researchTier || 0);
  const stage = pct < 40 ? 1.6 : pct < 75 ? 1.1 : 0.8; // första fasen kostar mest
  return {
    money: Math.round(120 * size * stage * disc),
    pp: Math.round(14 * size * stage * disc),
    gain: 12,
  };
}

// daglig integrationstakt
// Hur stor ockupationsstyrka landet KRÄVER för att alls hålla ihop. Stora
// länder kräver mer, och ju längre ifrån varandra ideologi och religion ligger
// desto fler soldater behövs för att hålla ordning.
export function garrisonNeeded(pop, myIdeo, theirIdeo, myRel, theirRel, adjacent = true) {
  const size = Math.max(3, Math.round(Math.sqrt((pop || 5e6) / 1e6) * 1.4));
  const gap = Math.abs((IDEO_AXIS[myIdeo] ?? 0) - (IDEO_AXIS[theirIdeo] ?? 0));
  const relDiff = myRel !== theirRel
    ? (RELIGIONS[myRel]?.fam === RELIGIONS[theirRel]?.fam ? 0.12 : 0.3)
    : 0;
  return Math.max(2, Math.round(size * (1 + gap * 0.14 + relDiff + (adjacent ? 0 : 0.4))));
}

export function dailyRate({ researchTier = 0, office = false, armyUnits = 0, needed = 0, sameIdeo = false, adjacent = true }) {
  // Utan tillräcklig ockupationsstyrka BACKAR integrationen — landet glider ur
  // händerna. Med rätt styrka går den framåt, och överskott snabbar på.
  const deficit = Math.max(0, needed - armyUnits);
  let r = deficit > 0
    ? -0.1 - 0.22 * Math.min(8, deficit)              // för lite trupp → tydligt nedåt
    : 0.55 + 0.05 * Math.min(12, armyUnits - needed); // full styrka → uppåt
  // bonusarna hjälper, men kan inte ersätta soldater på marken
  const help = 0.15 * researchTier + (office ? 0.5 : 0) + (sameIdeo ? 0.2 : 0);
  r += deficit > 0 ? help * 0.35 : help;
  if (!adjacent) r = r > 0 ? r * 0.4 : r * 1.4;       // exklav: trögt och skörare
  return r;
}
