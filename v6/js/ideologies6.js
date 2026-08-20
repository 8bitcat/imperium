// TRADE WARS — ideologierna.
//
// Bonusarna är satta för att likna vad systemen faktiskt gör i verkligheten,
// inte för att vara balanserade spegelbilder av varandra. Planekonomier bygger
// snabbt och billigt men förvaltar illa; marknadsekonomier tjänar pengar men
// betalar mer för infrastruktur; auktoritära stater får ut manskap och politisk
// makt men tappar i forskning. Varje val ska kosta något.
//
// mods verkar på baspoängen i procent, plus några särskilda spakar:
//   buildCost / upkeepPct / linkIncome / powerCost

export const IDEOLOGIES = {
  socialdemocracy: {
    name: 'Socialdemokrati', icon: '\u{1F339}',
    desc: 'Blandekonomi med stark offentlig sektor. Jämn men inte spektakulär.',
    mods: { research: 12, man: 10, money: -4, upkeepPct: -8 },
  },
  socialism: {
    name: 'Socialism', icon: '\u{270A}',
    desc: 'Offentligt ägande. Bygger billigt, tjänar sämre.',
    mods: { man: 18, pp: 8, money: -14, buildCost: -12 },
  },
  communism: {
    name: 'Kommunism', icon: '\u{262D}',
    desc: 'Planekonomi. Enorm mobiliseringsförmåga, svag marknad.',
    mods: { man: 30, pp: 14, money: -26, buildCost: -22, research: -8 },
  },
  liberalism: {
    name: 'Liberalism', icon: '\u{1F54A}\u{FE0F}',
    desc: 'Fri marknad och öppen handel. Pengar och forskning, svagt manskap.',
    mods: { money: 22, research: 10, man: -14, linkIncome: 10 },
  },
  democracy: {
    name: 'Demokrati', icon: '\u{1F5F3}\u{FE0F}',
    desc: 'Bred legitimitet, långsamma beslut. Stabilt allroundval.',
    mods: { research: 10, money: 8, pp: -6, upkeepPct: -5 },
  },
  conservatism: {
    name: 'Konservatism', icon: '\u{1F3DB}\u{FE0F}',
    desc: 'Ordning och institutioner. Billig drift, trögt nytänkande.',
    mods: { pp: 14, money: 6, research: -10, upkeepPct: -12 },
  },
  nationalism: {
    name: 'Nationalism', icon: '\u{1F985}',
    desc: 'Egen industri framför handel. Stark hemmaproduktion, dyr import.',
    mods: { man: 16, pp: 10, linkIncome: -12, buildCost: -8 },
  },
  imperialism: {
    name: 'Imperialism', icon: '\u{1F451}',
    desc: 'Rikedom hämtas utifrån. Stark handel, svag inhemsk legitimitet.',
    mods: { money: 18, linkIncome: 18, pp: -10, man: 6 },
  },
  monarchism: {
    name: 'Monarki', icon: '\u{1F478}',
    desc: 'Ärvd makt. Mycket politisk makt, långsam forskning.',
    mods: { pp: 26, money: 4, research: -14 },
  },
  theocracy: {
    name: 'Teokrati', icon: '\u{1F54C}',
    desc: 'Religiöst styre. Enande men vetenskapsfientligt.',
    mods: { pp: 20, man: 14, research: -26 },
  },
  fascism: {
    name: 'Fascism', icon: '\u{26A1}',
    desc: 'Militariserad statskapitalism. Bygger snabbt, förvaltar dyrt.',
    mods: { man: 26, pp: 16, research: -16, buildCost: -18, upkeepPct: 14 },
  },
  populism: {
    name: 'Populism', icon: '\u{1F4E2}',
    desc: 'Kortsiktiga löften. Snabba pengar nu, dyr räkning sen.',
    mods: { money: 16, man: 8, research: -12, upkeepPct: 12 },
  },
  technocracy: {
    name: 'Teknokrati', icon: '\u{1F9EA}',
    desc: 'Experter styr. Forskning framför allt, folkligt stöd svagt.',
    mods: { research: 34, money: 6, pp: -14, man: -8 },
  },
  anarchism: {
    name: 'Anarkism', icon: '\u{24B6}',
    desc: 'Ingen central stat. Fri men oorganiserad — infrastrukturen lider.',
    mods: { money: 10, research: 8, pp: -30, linkIncome: -18, upkeepPct: -20 },
  },
};

export function ideologyMods(id) {
  return IDEOLOGIES[id]?.mods || {};
}

// Praktiska spakar som ideologin drar i.
export function buildCostMult(id) { return 1 + ((ideologyMods(id).buildCost || 0) / 100); }
export function upkeepMult(id) { return 1 + ((ideologyMods(id).upkeepPct || 0) / 100); }
export function linkIncomeMult(id) { return 1 + ((ideologyMods(id).linkIncome || 0) / 100); }
