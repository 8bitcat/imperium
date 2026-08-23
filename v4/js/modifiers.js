// IMPERIUM V5 — MODIFIERARE.
//
// En modifierare är ett tillstånd landet befinner sig i. Den kan vara positiv
// eller negativ, och den kan vara:
//
//   temp     — tillfällig, tickar ner och försvinner av sig själv
//   perm     — permanent, sitter kvar tills något tar bort den
//   assigned — TILLDELAD: den sitter kvar så länge orsaken finns kvar.
//              Assigned är nästan alltid negativ. Den försvinner först när du
//              faktiskt har rättat till det som utlöste den — ofta krävs flera
//              lagändringar eller mycket forskning.
//
// En tilldelad modifierare kan bära med sig ÅTGÄRDER. Oftast finns bara ett sätt
// att komma åt problemet, ibland två — och då får du välja.
//
// `when(c)` = villkoret. Så länge det är sant sitter modifieraren kvar.
// `mods`    = effekten på nationsvärdena, exakt som lagar och forskning.
// `tone`    = 'good' | 'bad' | 'mixed' — styr färg och ton i aviseringen.
// `power`   = 1..4, hur stor sak det är (liten effekt → extremt stor effekt).

export const MODIFIERS = {

  // ---------- TILLDELADE, NEGATIVA ----------
  // Sitter kvar tills orsaken är åtgärdad. Det är dessa spelaren jagar bort.
  rampant_corruption: {
    name: 'GENOMKORRUMPERAD STAT', icon: '\u{1F4B8}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Mutor är normen i förvaltningen. Pengar försvinner på väg till sitt mål och ingen upphandling går rätt till.',
    fix: 'Sänk korruptionen under 25 — forska i antikorruption, öppna pressen eller rensa i lagboken.',
    when: (c) => c.st.corruption > 40,
    mods: { income: -18, gdp: -12, approval: -10, stability: -8 },
    actions: [
      { text: 'UTRENSNING I FÖRVALTNINGEN', cost: { pp: 40 }, temp: { corruption: -25, unrest: 8 }, tip: 'Snabb effekt, men skrämmer tjänstemännen.' },
      { text: 'LÅT DET VARA — DET ÄR SÅ DET FUNGERAR', temp: { corruption: 5 }, tip: 'Gratis. Problemet växer.' },
    ],
  },
  lost_faith: {
    name: 'FOLKET HAR TAPPAT FÖRTROENDET', icon: '\u{1F494}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Ingen tror längre på att ledningen vill dem väl. Varje beslut möts av misstro innan det ens är läst.',
    fix: 'Få upp approval över −15 igen.',
    when: (c) => c.st.approval < -30,
    mods: { unrest: 14, stability: -12, polpower: -10 },
    actions: [
      { text: 'STORT VÄLFÄRDSPAKET', cost: { money: 800 }, temp: { approval: 20, qol: 8 }, tip: 'Dyrt men verkar direkt.' },
      { text: 'SKYLL PÅ FÖREGÅENDE REGERING', cost: { pp: 20 }, temp: { approval: 8, corruption: 4 }, tip: 'Billigt, halva effekten, luktar illa.' },
    ],
  },
  boiling_over: {
    name: 'LANDET SJUDER', icon: '\u{1F525}', kind: 'assigned', tone: 'bad', power: 4,
    desc: 'Protester varje vecka, strejker i nyckelbranscher och kravaller i storstäderna. Det är inte längre enskilda utbrott utan ett tillstånd.',
    fix: 'Få ner unrest under 25.',
    when: (c) => c.st.unrest > 45,
    mods: { income: -20, factory: -15, stability: -18, approval: -8 },
    actions: [
      { text: 'SÄTT IN KRAVALLPOLIS', cost: { pp: 30 }, temp: { unrest: -20, freedom: -12, approval: -6 }, tip: 'Trycker ner det. Löser ingenting.' },
      { text: 'MÖT DERAS KRAV', cost: { money: 600 }, temp: { unrest: -18, approval: 12, income: -8 }, tip: 'Dyrt, men oron försvinner på riktigt.' },
    ],
  },
  police_state: {
    name: 'POLISSTAT', icon: '\u{1F693}', kind: 'assigned', tone: 'bad', power: 2,
    desc: 'Övervakning, angiveri och godtyckliga gripanden. Folk vaktar sina ord vid middagsbordet.',
    fix: 'Höj freedom över −45.',
    when: (c) => c.st.freedom < -60,
    mods: { research: -12, gdp: -10, immigration: -15, hdi: -8 },
    actions: [
      { text: 'MILDRA DE HÅRDASTE LAGARNA', cost: { pp: 35 }, temp: { freedom: 15, unrest: -5, statepower: -8 }, tip: 'Släpper på trycket, försvagar staten.' },
    ],
  },
  fiscal_collapse: {
    name: 'STATSFINANSERNA I FRITT FALL', icon: '\u{1F4C9}', kind: 'assigned', tone: 'bad', power: 4,
    desc: 'Utgifterna överstiger intäkterna med marginal och kassan töms varje dag. Långivarna har börjat ställa frågor.',
    fix: 'Få income över −20 — höj skatterna eller skär i utgifterna.',
    when: (c) => c.st.income < -40,
    mods: { gdp: -15, factory: -12, welfare: -10, stability: -10 },
    actions: [
      { text: 'NÖDLÅN FRÅN UTLANDET', cost: { pp: 25 }, res: { money: 1500 }, temp: { income: -6, statepower: -10 }, tip: 'Pengar nu, beroende sedan.' },
      { text: 'HÅRDA NEDSKÄRNINGAR', cost: { pp: 45 }, temp: { income: 25, welfare: -15, approval: -14, unrest: 10 }, tip: 'Räddar kassan, folket får betala.' },
    ],
  },
  crumbling_state: {
    name: 'STATEN VACKLAR', icon: '\u{1F3DA}\u{FE0F}', kind: 'assigned', tone: 'bad', power: 4,
    desc: 'Myndigheter slutar lyda centralt, regionerna gör som de vill och ingen vet längre var makten sitter.',
    fix: 'Få stability över −10.',
    when: (c) => c.st.stability < -30,
    mods: { polpower: -15, statepower: -18, income: -12, unrest: 10 },
    actions: [
      { text: 'UNDANTAGSTILLSTÅND', cost: { pp: 50 }, temp: { stability: 22, statepower: 15, freedom: -20, approval: -10 }, tip: 'Griper tillbaka makten med tvång.' },
      { text: 'DECENTRALISERA — GE REGIONERNA MAKTEN', cost: { pp: 30 }, temp: { stability: 12, approval: 8, statepower: -12 }, tip: 'Lugnare, men du får aldrig tillbaka greppet helt.' },
    ],
  },
  brain_drain: {
    name: 'KUNSKAPSTAPP', icon: '\u{1F393}', kind: 'assigned', tone: 'bad', power: 2,
    desc: 'Forskare, läkare och ingenjörer lämnar landet. De som är kvar undervisar allt färre.',
    fix: 'Få research över −5.',
    when: (c) => c.st.research < -20,
    mods: { gdp: -10, hdi: -12, factory: -8 },
    actions: [
      { text: 'STIPENDIEPROGRAM FÖR ÅTERVÄNDARE', cost: { money: 700 }, temp: { research: 15, hdi: 6, income: -5 }, tip: 'Fungerar, men tar tid och pengar.' },
    ],
  },
  misery: {
    name: 'ELÄNDE', icon: '\u{1F327}\u{FE0F}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Vardagen är hård, kall och kort. Folk lever men de lever inte bra.',
    fix: 'Få quality of life över −10.',
    when: (c) => c.st.qol < -30,
    mods: { approval: -12, unrest: 12, manpower: -10, hdi: -10 },
    actions: [
      { text: 'BOSTADS- OCH MATPROGRAM', cost: { money: 900 }, temp: { qol: 18, approval: 10, income: -8 }, tip: 'Direkt lindring, tung nota.' },
    ],
  },
  defenceless: {
    name: 'FÖRSVARSLÖS', icon: '\u{1F6A9}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Armén är för liten, för gammal och för dåligt övad för att stoppa någon som verkligen vill in.',
    fix: 'Få military power över −10.',
    when: (c) => c.st.milpower < -30,
    mods: { statepower: -10, stability: -8, justtime: 12 },
    actions: [
      { text: 'NÖDUPPRUSTNING', cost: { money: 1200, pp: 20 }, temp: { milpower: 25, readiness: 12, income: -10 }, tip: 'Snabbt, dyrt, ohållbart i längden.' },
      { text: 'SÖK SKYDD HOS EN STARKARE GRANNE', cost: { pp: 40 }, temp: { milpower: 15, statepower: -15, ideopower: -8 }, tip: 'Trygghet i utbyte mot självständighet.' },
    ],
  },
  lawless: {
    name: 'LAGLÖSHET', icon: '\u{1F52A}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Gäng styr stadsdelar, polisen vågar inte gå in och rättsväsendet har slutat fungera.',
    fix: 'Få safety över −10.',
    when: (c) => c.st.safety < -30,
    mods: { gdp: -12, qol: -12, approval: -10, unrest: 10 },
    actions: [
      { text: 'MILITÄR PÅ GATORNA', cost: { pp: 35 }, temp: { safety: 20, freedom: -15, unrest: 6 }, tip: 'Återtar gatan med våld.' },
      { text: 'SATSA PÅ FÖREBYGGANDE ARBETE', cost: { money: 800 }, temp: { safety: 14, qol: 8, income: -6 }, tip: 'Långsammare, håller längre.' },
    ],
  },
  no_safety_net: {
    name: 'INGET SKYDDSNÄT', icon: '\u{1F573}\u{FE0F}', kind: 'assigned', tone: 'bad', power: 2,
    desc: 'Den som blir sjuk, gammal eller arbetslös faller rakt igenom. Tiggeriet syns i varje stad.',
    fix: 'Få welfare över −10.',
    when: (c) => c.st.welfare < -30,
    mods: { qol: -12, approval: -10, unrest: 8, hdi: -8 },
    actions: [
      { text: 'INFÖR ETT GRUNDSKYDD', cost: { money: 700 }, temp: { welfare: 18, approval: 8, income: -10 }, tip: 'Fångar upp de värsta fallen.' },
    ],
  },
  pariah: {
    name: 'PARIASTAT', icon: '\u{1F30D}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Omvärlden har slutat behandla dig som ett normalt land. Ambassadörer kallas hem och avtal sägs upp.',
    fix: 'Mildra ideologin eller lagarna tills freedom och approval kommit upp.',
    when: (c) => c.st.freedom < -50 && c.st.approval < -20,
    mods: { income: -15, gdp: -12, research: -10, immigration: -12 },
    actions: [
      { text: 'KOSMETISKA REFORMER FÖR OMVÄRLDEN', cost: { pp: 30 }, temp: { freedom: 10, income: 8, ideopower: -8 }, tip: 'Räcker för att lätta på trycket ett tag.' },
    ],
  },

  // ---------- TILLDELADE, POSITIVA ----------
  // Belöningar som sitter kvar så länge du håller nivån.
  economic_miracle: {
    name: 'EKONOMISKT UNDER', icon: '\u{1F680}', kind: 'assigned', tone: 'good', power: 4,
    desc: 'Ekonomin går som ingen annan i världen. Kapital söker sig hit av sig självt och alla vill vara med.',
    when: (c) => c.st.gdp > 40 && c.st.income > 30,
    mods: { income: 20, gdp: 15, factory: 12, approval: 10, research: 8 },
  },
  beloved_leadership: {
    name: 'ÄLSKAD LEDNING', icon: '\u{1F49B}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Folket står bakom sin ledning på ett sätt som inte går att köpa. Även impopulära beslut får förtroende.',
    when: (c) => c.st.approval > 50,
    mods: { polpower: 15, stability: 12, unrest: -14, ideopower: 8 },
  },
  scientific_superpower: {
    name: 'VETENSKAPLIG STORMAKT', icon: '\u{1F52C}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Världens skarpaste hjärnor arbetar här. Genombrotten kommer snabbare än omvärlden hinner läsa om dem.',
    when: (c) => c.st.research > 50,
    mods: { research: 18, gdp: 12, hdi: 10, milpower: 6 },
  },
  clean_state: {
    name: 'REN STAT', icon: '\u{1F9FC}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Förvaltningen är oantastlig. Varje krona hamnar där den ska och ingen ens försöker längre.',
    when: (c) => c.st.corruption < -40,
    mods: { income: 15, approval: 12, stability: 10, gdp: 8 },
  },
  civil_peace: {
    name: 'SAMHÄLLSFRED', icon: '\u{1F54A}\u{FE0F}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Konflikterna löses innan de blir konflikter. Ingen minns när det senast brann.',
    when: (c) => c.st.unrest < -35,
    mods: { factory: 12, income: 10, stability: 15, approval: 8 },
  },
  military_superpower: {
    name: 'MILITÄR SUPERMAKT', icon: '\u{2694}\u{FE0F}', kind: 'assigned', tone: 'good', power: 4,
    desc: 'Din armé är ett faktum andra länder planerar sin utrikespolitik runt.',
    when: (c) => c.st.milpower > 60,
    mods: { statepower: 18, justtime: -12, readiness: 12, ideopower: 8 },
  },
  best_place_to_live: {
    name: 'VÄRLDENS BÄSTA LAND ATT LEVA I', icon: '\u{1F33B}', kind: 'assigned', tone: 'good', power: 4,
    desc: 'Utländska tidningar skriver reportage om vardagen här. Folk står i kö för att få flytta hit.',
    when: (c) => c.st.qol > 50 && c.st.hdi > 40,
    mods: { immigration: 18, research: 12, approval: 15, manpower: 8, gdp: 10 },
  },
  beacon_of_liberty: {
    name: 'FRIHETENS FYRBÅK', icon: '\u{1F5FD}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Ditt land är argumentet andra frihetsrörelser använder. Dissidenter världen över söker sig hit.',
    when: (c) => c.st.freedom > 50,
    mods: { research: 14, immigration: 12, approval: 10, ideopower: 10 },
  },
  rock_solid: {
    name: 'KLIPPFAST', icon: '\u{1F3DB}\u{FE0F}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Institutionerna står oavsett vem som sitter vid rodret. Kriser passerar utan att lämna spår.',
    when: (c) => c.st.stability > 50,
    mods: { polpower: 12, statepower: 12, unrest: -12, income: 8 },
  },
  the_true_faith: {
    name: 'IDEOLOGISK ENHET', icon: '\u{1F9ED}', kind: 'assigned', tone: 'good', power: 3,
    desc: 'Lagboken och partiprogrammet är samma dokument. Ingen behöver förklara varför något görs.',
    when: (c) => c.harmony >= 0.9,
    mods: { ideopower: 15, polpower: 12, stability: 10, unrest: -10 },
  },
  hollow_creed: {
    name: 'TOM IDEOLOGI', icon: '\u{1F573}\u{FE0F}', kind: 'assigned', tone: 'bad', power: 3,
    desc: 'Du kallar dig en sak och styr som en annan. Din egen rörelse har slutat lyssna på dig.',
    fix: 'Få den ideologiska harmonin över 40 % — lagstifta enligt din egen linje.',
    when: (c) => c.harmony < 0.3,
    mods: { ideopower: -18, polpower: -12, approval: -8, unrest: 8 },
    actions: [
      { text: 'ANPASSA LAGARNA EFTER PARTIET', cost: { pp: 40 }, tip: 'Kostar politisk makt — men du måste ändå ändra lagarna själv.' },
      { text: 'BYT IDEOLOGI I STÄLLET', tip: 'Gratis råd: gå till IDEOLOGI-fliken och välj en linje du faktiskt styr efter.' },
    ],
  },

  // ---------- TREND: hur det GÅR, inte var du är ----------
  boom: {
    name: 'HÖGKONJUNKTUR', icon: '\u{1F4C8}', kind: 'temp', tone: 'good', power: 2, days: 60,
    desc: 'Kurvorna pekar uppåt över hela linjen och alla känner det. Optimismen är i sig en tillgång.',
    mods: { income: 12, gdp: 10, factory: 8, approval: 6 },
  },
  downturn: {
    name: 'NEDÅTSPIRAL', icon: '\u{1F4C9}', kind: 'temp', tone: 'bad', power: 2, days: 60,
    desc: 'Allt går åt fel håll samtidigt och folk har börjat märka det. Förväntan om sämre tider gör tiderna sämre.',
    mods: { income: -12, gdp: -8, approval: -8, unrest: 6 },
  },

  // ---------- TILLFÄLLIGA, delas ut av händelser ----------
  scandal: { name: 'REGERINGSSKANDAL', icon: '\u{1F4F0}', kind: 'temp', tone: 'bad', power: 2, days: 45,
    desc: 'Avslöjandet ligger på varje förstasida och ingen pratar om något annat.', mods: { approval: -12, stability: -8, polpower: -6 } },
  cover_up: { name: 'MÖRKLÄGGNING', icon: '\u{1F576}\u{FE0F}', kind: 'temp', tone: 'mixed', power: 2, days: 90,
    desc: 'Historien tystades. Den som vet att den tystades vet också vad det säger om dig.', mods: { corruption: 15, stability: 6, freedom: -8 } },
  martyr: { name: 'EN MARTYR', icon: '\u{1F56F}\u{FE0F}', kind: 'temp', tone: 'bad', power: 3, days: 120,
    desc: 'Någon dog för sin sak och har blivit en symbol som inte går att arrestera.', mods: { unrest: 15, approval: -10, ideopower: -8 } },
  national_unity: { name: 'NATIONELL SAMLING', icon: '\u{1F91D}', kind: 'temp', tone: 'good', power: 3, days: 90,
    desc: 'Något har fått landet att sluta upp bakom sig självt. Motsättningarna vilar.', mods: { unrest: -18, approval: 15, stability: 12, polpower: 8 } },
  war_fever: { name: 'KRIGSYRA', icon: '\u{2694}\u{FE0F}', kind: 'temp', tone: 'mixed', power: 3, days: 80,
    desc: 'Folket vill ha krig och kräver det av dig. Att inte leverera blir också ett problem.', mods: { milpower: 14, readiness: 12, manpower: 10, justtime: -15, research: -8, qol: -6 } },
  war_weariness: { name: 'KRIGSTRÖTTHET', icon: '\u{1F62B}', kind: 'temp', tone: 'bad', power: 3, days: 120,
    desc: 'Kistorna kommer hem och ingen minns längre varför kriget började.', mods: { approval: -15, unrest: 14, manpower: -12, readiness: -10 } },
  golden_generation: { name: 'GYLLENE GENERATION', icon: '\u{1F31F}', kind: 'perm', tone: 'good', power: 3,
    desc: 'En ovanligt begåvad årskull går ut skolan och sätter spår i landet för resten av sina liv.', mods: { research: 12, gdp: 8, hdi: 8 } },
  lost_generation: { name: 'FÖRLORAD GENERATION', icon: '\u{1F494}', kind: 'perm', tone: 'bad', power: 3,
    desc: 'En hel årskull föll mellan stolarna och kommer aldrig ikapp.', mods: { research: -10, gdp: -8, manpower: -8, unrest: 6 } },
  industrial_boom: { name: 'INDUSTRIELLT LYFT', icon: '\u{1F3ED}', kind: 'perm', tone: 'good', power: 3,
    desc: 'Nya fabriker, nya metoder, ny kapacitet. Landet producerar varaktigt mer än förut.', mods: { factory: 15, income: 10, gdp: 8 } },
  epidemic: { name: 'EPIDEMI', icon: '\u{1F9A0}', kind: 'temp', tone: 'bad', power: 4, days: 100,
    desc: 'Sjukdomen sprider sig snabbare än vården hinner med. Sjukhusen går på knäna.', mods: { qol: -18, manpower: -15, factory: -12, approval: -8, income: -10 } },
  natural_disaster: { name: 'NATURKATASTROF', icon: '\u{1F30A}', kind: 'temp', tone: 'bad', power: 3, days: 70,
    desc: 'Stora områden har slagits sönder och återuppbyggnaden slukar allt.', mods: { income: -18, factory: -14, qol: -10, unrest: 6 } },
  purge_aftermath: { name: 'EFTER UTRENSNINGEN', icon: '\u{1FA93}', kind: 'temp', tone: 'mixed', power: 3, days: 110,
    desc: 'De illojala är borta. Så är också en stor del av kompetensen, och alla vet vad som hände.', mods: { statepower: 18, corruption: -12, research: -12, approval: -12, freedom: -15 } },
  foreign_investment: { name: 'UTLÄNDSKA INVESTERINGAR', icon: '\u{1F4B9}', kind: 'temp', tone: 'good', power: 2, days: 90,
    desc: 'Utländskt kapital strömmar in i industrin och infrastrukturen.', mods: { income: 12, gdp: 10, factory: 10, statepower: -5 } },
  capital_flight: { name: 'KAPITALFLYKT', icon: '\u{1F4B8}', kind: 'temp', tone: 'bad', power: 3, days: 90,
    desc: 'Pengarna lämnar landet fortare än de kan beskattas.', mods: { income: -15, gdp: -14, factory: -8 } },
  tech_breakthrough: { name: 'TEKNISKT GENOMBROTT', icon: '\u{1F4A1}', kind: 'perm', tone: 'good', power: 3,
    desc: 'En upptäckt som förändrar vad landet kan göra. Effekten sitter i.', mods: { research: 12, factory: 10, milpower: 6 } },
  religious_revival: { name: 'RELIGIÖS VÄCKELSE', icon: '\u{1F64F}', kind: 'temp', tone: 'mixed', power: 2, days: 120,
    desc: 'En våg av tro drar genom landet. Den ger sammanhållning — och krav.', mods: { ideopower: 14, stability: 8, research: -8, freedom: -6 } },
  general_strike: { name: 'GENERALSTREJK', icon: '\u{270A}', kind: 'temp', tone: 'bad', power: 4, days: 40,
    desc: 'Landet står stilla. Ingenting produceras och ingenting transporteras.', mods: { factory: -25, income: -22, unrest: 15, gdp: -12 } },
  border_crisis: { name: 'GRÄNSKRIS', icon: '\u{1F6C2}', kind: 'temp', tone: 'bad', power: 3, days: 90,
    desc: 'Fler kommer än systemet klarar av, och det syns i varje gränsstad.', mods: { integration: -15, safety: -10, unrest: 10, welfare: -8 } },
  olympic_glory: { name: 'IDROTTSTRIUMF', icon: '\u{1F3C5}', kind: 'temp', tone: 'good', power: 1, days: 60,
    desc: 'Landet vann något stort och alla vet vilka vi är just nu.', mods: { approval: 12, unrest: -8, ideopower: 6 } },
  cult_of_personality: { name: 'PERSONKULT', icon: '\u{1F5FF}', kind: 'perm', tone: 'mixed', power: 4,
    desc: 'Ditt ansikte hänger i varje sal. Systemet lyder dig — och bara dig.', mods: { ideopower: 25, polpower: 18, statepower: 15, freedom: -20, research: -10, corruption: 10 } },
};

// ---------- MOTOR ----------
// s.mods = { id: { id, since, until } }  — until = null för perm/assigned

export function activeList(store) {
  return Object.values(store || {}).map((m) => ({ ...MODIFIERS[m.id], ...m })).filter((m) => m.name);
}

// Summera alla aktiva modifierares effekt → { statId: delta }
export function modifierMods(store) {
  const sum = {};
  for (const m of activeList(store)) {
    for (const [k, v] of Object.entries(m.mods || {})) sum[k] = (sum[k] || 0) + v;
  }
  return sum;
}

export function grant(store, id, day) {
  const def = MODIFIERS[id];
  if (!def || store[id]) return null;
  store[id] = { id, since: day, until: def.kind === 'temp' ? day + (def.days || 60) : null };
  return def;
}

export function revoke(store, id) {
  const had = !!store[id];
  delete store[id];
  return had;
}

export function hasMod(store, id) { return !!store?.[id]; }

// Körs varje dag. Returnerar { added: [def], removed: [def], expired: [def] }
// - assigned: läggs till när villkoret blir sant, tas bort när det blir falskt
// - temp: tickar ut av sig själv
// - perm: rörs inte
export function tickModifiers(store, c, day) {
  const added = [], removed = [], expired = [];
  for (const [id, def] of Object.entries(MODIFIERS)) {
    if (def.kind !== 'assigned' || !def.when) continue;
    let on = false;
    try { on = !!def.when(c); } catch (e) { on = false; }
    if (on && !store[id]) { grant(store, id, day); added.push({ id, ...def }); }
    else if (!on && store[id]) { delete store[id]; removed.push({ id, ...def }); }
  }
  for (const [id, m] of Object.entries(store)) {
    if (m.until != null && day >= m.until) { delete store[id]; expired.push({ id, ...MODIFIERS[id] }); }
  }
  return { added, removed, expired };
}

// Trendmodifierare: jämför dagens nyckeltal med läget för en tid sedan.
// Detta är "din ekonomi blir bättre / dina värden går uppåt"-delen.
const TREND_KEYS = ['income', 'gdp', 'factory', 'approval', 'research', 'qol'];
export function tickTrend(s, st, day) {
  s.trend ||= { at: day, base: null };
  if (!s.trend.base) { s.trend.base = TREND_KEYS.map((k) => st[k]?.total || 0); s.trend.at = day; return null; }
  if (day - s.trend.at < 45) return null;
  const now = TREND_KEYS.map((k) => st[k]?.total || 0);
  const diff = now.reduce((a, v, i) => a + (v - s.trend.base[i]), 0);
  s.trend.base = now; s.trend.at = day;
  if (diff >= 22) return 'boom';
  if (diff <= -22) return 'downturn';
  return null;
}
