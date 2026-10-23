// IMPERIUM V5.8 — helt nya lagkategorier, i ett eget format så att de bär sin
// egen axel, sina spärrar och sina statistikeffekter:
//   { kategori: { name, icon, axis: 'econ'|'auth', dir: 1|-1,
//                 options: [ {id, name, mods, desc, default?} ],   // pol → pol
//                 locks?: { ideologi: [alternativ] },
//                 effects?: { alternativ: { mått: [op, n] } } } }
// laws.js lägger in dem i LAWS, ideologies.js i LAW_AXIS + spärrar, statistics.js i LAW_EFFECTS.
export const NEW_LAWS = {
  // Fri → styrd: från att allt får sägas till att all kritik är ett brott.
  speech: {
    name: 'Freedom of speech', icon: '\u{1F5E3}\u{FE0F}', axis: 'auth', dir: 1,
    options: [
      { id: 'absolute', name: 'Absolute free speech', mods: { freedom: 18, research: 5, corruption: -4, statepower: -10, integration: -6, unrest: 5 },
        desc: 'Allt får sägas, skrivas och sändas, även det som är grovt kränkande eller osant, så länge det inte är ett direkt hot. Idéer och kritik flödar fritt, forskningen frodas och ingen makthavare kan tysta sina granskare. Men hatiska budskap mot minoriteter får fritt spelrum, och samhället blir hårdare och mer splittrat.' },
      { id: 'broad', name: 'Broad free speech', mods: { freedom: 10, research: 3, approval: 2, statepower: -5, integration: -2 },
        desc: 'Yttrandefriheten är stark och begränsas bara av förtal, hot och uppmaningar till våld. Debatten är livlig och fri utan att det blir helt laglöst. Staten har få verktyg att stoppa skadliga kampanjer innan de sprids.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Yttrandefrihet med de vanliga gränserna: förtal, olaga hot och hets mot folkgrupp är förbjudet. Varken bonus eller straff. Utgångsläget.' },
      { id: 'hatelaws', name: 'Strict hate speech laws', mods: { integration: 6, stability: 3, freedom: -5, research: -2, approval: -2 },
        desc: 'Hårda lagar mot hatiska uttalanden, även på nätet, där plattformarna måste ta bort kränkande inlägg snabbt. Minoriteter känner sig tryggare och samhället hänger bättre ihop. Gränsen för vad som får sägas blir otydlig, och många håller hellre tyst än riskerar ett straff.' },
      { id: 'lesemajeste', name: 'Insulting the leader banned', mods: { statepower: 8, ideopower: 6, polpower: 3, freedom: -12, approval: -5, corruption: 3 },
        desc: 'Det är olagligt att förolämpa eller håna landets ledare, flagga och symboler, och satir om makten kan ge böter eller fängelse. Ledningen framstår som ostörd och statens auktoritet växer. Folket skämtar bara i det tysta, och missnöjet med ledarna når aldrig fram till dem.' },
      { id: 'criminalized', name: 'Criticism criminalized', mods: { statepower: 16, ideopower: 14, unrest: -8, freedom: -26, approval: -10, research: -6, corruption: 8 },
        desc: 'All kritik mot staten, ledningen eller den officiella linjen är ett brott. Oppositionen tystnar och ideologin möter inget motstånd i det offentliga samtalet. Men felbeslut och fusk i förvaltningen rättas aldrig när ingen vågar påpeka dem, och de fria tänkarna lämnar landet.' },
    ],
    locks: {
      democracy: ['criminalized'], liberalism: ['criminalized'], socialdemocracy: ['criminalized'], greens: ['criminalized'],
      anarchism: ['lesemajeste', 'criminalized'], libertarianism: ['lesemajeste', 'criminalized'],
      fascism: ['absolute'], natsoc: ['absolute', 'broad'], communism: ['absolute', 'broad'], theocracy: ['absolute'], stratocracy: ['absolute'],
    },
    effects: {
      absolute: { voice: ['+', 0.3] }, broad: { voice: ['+', 0.15] },
      lesemajeste: { voice: ['+', -0.4] }, criminalized: { voice: ['+', -1] },
    },
  },

  // Fri → styrd: från fri demonstrationsrätt till förbjudna demonstrationer.
  protest: {
    name: 'Right to protest', icon: '\u{1FAA7}', axis: 'auth', dir: 1,
    options: [
      { id: 'free', name: 'Free assembly', mods: { freedom: 12, approval: 5, unrest: 5, statepower: -10, stability: -3 },
        desc: 'Alla får demonstrera var och när de vill, utan att fråga någon om lov. Folket känner att deras röst hörs och regeringen får snabbt veta vad som skaver. Gatorna fylls ofta av protester, och staten har svårt att hålla ordning när stora folkmassor samlas.' },
      { id: 'notice', name: 'Notification only', mods: { freedom: 6, approval: 3, unrest: 2, statepower: -4 },
        desc: 'Den som vill demonstrera anmäler bara tid och plats till polisen, som inte kan säga nej. Rätten att protestera är stark och polisen hinner ändå planera. Protesterna blir många och ibland stökiga.' },
      { id: 'permit', name: 'Permit required', default: true, mods: {},
        desc: 'Demonstrationer kräver tillstånd från polisen, som nästan alltid ger det. Varken bonus eller straff. Utgångsläget.' },
      { id: 'zones', name: 'Designated protest zones', mods: { statepower: 4, unrest: -3, freedom: -5, approval: -3 },
        desc: 'Protester får bara hållas på särskilda platser, långt från regeringsbyggnader och stora gator. Ordningen blir lättare att hålla och vardagen störs sällan. Budskapen når färre, och många upplever att deras röst har trängts undan.' },
      { id: 'restricted', name: 'Rarely permitted', mods: { statepower: 10, unrest: -6, stability: 3, freedom: -12, approval: -7 },
        desc: 'Tillstånd ges sällan, och den som deltar i en otillåten demonstration riskerar böter eller fängelse. Gatorna blir lugna och oppositionen har svårt att visa sin styrka. Missnöjet försvinner inte utan flyttar in i hemmen, och folket litar allt mindre på polisen.' },
      { id: 'banned', name: 'Protests banned', mods: { statepower: 16, ideopower: 5, unrest: -9, freedom: -22, approval: -12, qol: -3 },
        desc: 'Alla demonstrationer och offentliga möten utan statens godkännande är förbjudna, och polisen skingrar varje samling direkt. Inga protester syns och staten har full kontroll över gator och torg. Folket har ingen laglig väg att visa sitt missnöje, och förtroendet för ledningen sjunker stadigt.' },
    ],
    locks: {
      democracy: ['restricted', 'banned'], liberalism: ['restricted', 'banned'], socialdemocracy: ['banned'], greens: ['banned'],
      anarchism: ['restricted', 'banned'], libertarianism: ['restricted', 'banned'],
      fascism: ['free'], natsoc: ['free', 'notice'], communism: ['free'], stratocracy: ['free'],
    },
    effects: {
      free: { voice: ['+', 0.2] }, notice: { voice: ['+', 0.1] }, zones: { voice: ['+', -0.1] },
      restricted: { voice: ['+', -0.3] }, banned: { voice: ['+', -0.7] },
    },
  },

  // Vänster → höger: från mycket hög bolagsskatt till ingen alls.
  corporate_tax: {
    name: 'Corporate tax', icon: '\u{1F3E2}', axis: 'econ', dir: 1,
    options: [
      { id: 'veryhigh', name: 'Very high', mods: { income: 16, approval: 3, gdp: -10, factory: -9, research: -4 },
        desc: 'Bolagen lämnar fyrtio procent eller mer av sin vinst till staten. Statskassan växer och folket tycker att de stora bolagen äntligen betalar sin del. Men företagen investerar mindre, en del flyttar huvudkontoret utomlands och nya fabriker byggs någon annanstans.' },
      { id: 'high', name: 'High', mods: { income: 10, approval: 2, gdp: -6, factory: -5, research: -2 },
        desc: 'En hög skatt på bolagens vinster, kring trettiofem procent. Staten får ett stadigt tillskott till kassan. Investeringarna dämpas och vissa bolag letar efter sätt att flytta vinsten till länder med lägre skatt.' },
      { id: 'raised', name: 'Above average', mods: { income: 5, gdp: -3, factory: -2 },
        desc: 'Bolagsskatten ligger något över vad de flesta länder tar ut, kring tjugofem till trettio procent. Ett litet extra tillskott till statskassan. Företagen märker skillnaden men stannar kvar.' },
      { id: 'standard', name: 'Standard', default: true, mods: {},
        desc: 'En vanlig bolagsskatt kring tjugo procent, i nivå med grannländerna. Varken bonus eller straff. Utgångsläget.' },
      { id: 'low', name: 'Low', mods: { gdp: 4, factory: 3, income: -5 },
        desc: 'En låg bolagsskatt kring femton procent som gör landet lockande att investera i. Fler företag startar och växer här. Statskassan får in mindre.' },
      { id: 'verylow', name: 'Very low', mods: { gdp: 7, factory: 6, research: 2, income: -10, approval: -2 },
        desc: 'Bolagsskatten är under tio procent och utländska koncerner flyttar gärna hit sina kontor. Investeringarna strömmar in och forskning och industri får fart. Staten går miste om stora intäkter, och folk undrar varför bolagen betalar mindre skatt än de anställda.' },
      { id: 'none', name: 'No corporate tax', mods: { gdp: 10, factory: 7, research: 3, income: -15, corruption: 6, approval: -3 },
        desc: 'Bolagen betalar ingen skatt alls på sin vinst, och landet blir ett skatteparadis. Kapital och huvudkontor från hela världen söker sig hit och ekonomin växer snabbt. Statskassan tappar en viktig inkomst, och en del av pengarna som flyttar hit kommer från tvivelaktiga affärer.' },
    ],
    locks: { libertarianism: ['veryhigh', 'high'], socialism: ['none'], communism: ['verylow', 'none'] },
    effects: {
      veryhigh: { tax: ['+', 3], fdi: ['+', -2.5] }, high: { tax: ['+', 2], fdi: ['+', -1.5] }, raised: { tax: ['+', 1], fdi: ['+', -0.5] },
      low: { tax: ['+', -1], fdi: ['+', 1] }, verylow: { tax: ['+', -2], fdi: ['+', 2.5] }, none: { tax: ['+', -3], fdi: ['+', 5] },
    },
  },

  // Fri → styrd (som globalism och FN): öppna, internationella länder ger mest,
  // slutna och nationalistiska minst.
  foreign_aid: {
    name: 'Foreign aid', icon: '\u{1F932}', axis: 'auth', dir: 1,
    options: [
      { id: 'verygenerous', name: 'Very generous', mods: { polpower: 6, approval: 3, income: -10, justtime: 8 },
        desc: 'Landet ger över en procent av sin ekonomi i bistånd till skolor, sjukvård och rent vatten i fattiga länder. Det ger gott anseende och en stark röst i världen, och folket är stolta över att hjälpa. Det kostar mycket, och omvärlden väntar sig att ett sådant land löser konflikter med samtal snarare än vapen.' },
      { id: 'generous', name: 'Generous', mods: { polpower: 4, approval: 2, income: -6, justtime: 5 },
        desc: 'Biståndet når FN:s mål på sju tiondels procent av ekonomin. Landet räknas som en pålitlig vän till fattigare länder och får lyssnande öron i världen. Det blir en märkbar post i statens budget.' },
      { id: 'increased', name: 'Above average', mods: { polpower: 2, income: -3, justtime: 2 },
        desc: 'Lite mer bistånd än de flesta länder ger, med fokus på hälsa och utbildning. Ger ett gott rykte till en rimlig kostnad. Ett steg åt det givmilda hållet.' },
      { id: 'standard', name: 'Standard', default: true, mods: {},
        desc: 'Ett vanligt bistånd och snabb hjälp när katastrofer inträffar, ungefär som de flesta länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'reduced', name: 'Reduced aid', mods: { income: 3, polpower: -2, justtime: -2 },
        desc: 'Biståndet skärs ner till ett minimum utöver katastrofhjälp. Pengarna stannar hemma och kan användas till annat. Landet hörs mindre i världen och har färre vänner när det behövs.' },
      { id: 'tied', name: 'Aid for allies only', mods: { factory: 3, ideopower: 4, justtime: -4, corruption: 5, polpower: -2 },
        desc: 'Bistånd ges bara till länder som stödjer landets politik, och pengarna måste användas till att köpa landets egna varor. Industrin får beställningar och idéerna sprids till vänligt sinnade regeringar. Hjälpen hamnar ofta hos makthavarna i stället för hos de fattiga, och fusk med kontrakten blir vanligt.' },
      { id: 'none', name: 'No foreign aid', mods: { income: 6, justtime: -6, polpower: -5, approval: -3 },
        desc: 'Landet ger ingen hjälp alls till andra länder, inte ens vid svält eller jordbävningar. Varje krona stannar hemma och ingen utomstående kan ställa krav. Landet framstår som kallt och själviskt, och få länder ställer sig på dess sida när det gäller.' },
    ],
    locks: { nationalism: ['verygenerous'], fascism: ['verygenerous'], natsoc: ['verygenerous', 'generous'] },
  },

  // Fri → styrd: från nedrustning till en doktrin om att slå först.
  nuclear_doctrine: {
    name: 'Nuclear doctrine', icon: '\u{2622}\u{FE0F}', axis: 'auth', dir: 1,
    options: [
      { id: 'disarmament', name: 'Disarmament', mods: { approval: 5, polpower: 4, income: 3, milpower: -10, readiness: -4, justtime: 10 },
        desc: 'Landet har inga kärnvapen, har skrivit under FN:s förbud mot dem och arbetar för att alla andra också ska skrota sina. Landet blir en respekterad röst för fred och folket står bakom linjen. Utan egna vapen eller en allierads skydd står landet svagare om en granne hotar, och krig blir mycket svåra att motivera.' },
      { id: 'nonnuclear', name: 'Nuclear-free', mods: { approval: 2, income: 2, milpower: -5, justtime: 5 },
        desc: 'Landet har inga kärnvapen och tillåter inte heller andra länder att placera sina vapen här. Pengarna går till annat och grannarna känner sig inte hotade. Försvaret saknar den yttersta avskräckningen.' },
      { id: 'umbrella', name: 'Allied umbrella', default: true, mods: {},
        desc: 'Landet har inga egna kärnvapen men skyddas av en allierad stormakts avskräckning. Varken bonus eller straff. Utgångsläget.' },
      { id: 'minimal', name: 'Minimal deterrent', mods: { milpower: 8, readiness: 3, statepower: 3, income: -5, approval: -2 },
        desc: 'Landet håller en liten egen kärnvapenstyrka, bara stor nog att avskräcka den som funderar på att anfalla. Militärmakten växer och landet behöver inte förlita sig på någon annan. Vapnen är dyra att underhålla och många invånare ogillar att de finns.' },
      { id: 'deterrence', name: 'Full deterrence', mods: { milpower: 16, readiness: 8, statepower: 6, stability: 3, income: -10, approval: -4, justtime: -4 },
        desc: 'En stor och modern kärnvapenstyrka som alltid kan svara om landet blir anfallet. Ingen stat vågar utmana landet på allvar och beredskapen är hög. Kostnaden är mycket stor, och många invånare oroar sig för vad som kan hända.' },
      { id: 'firststrike', name: 'First-strike doctrine', mods: { milpower: 24, readiness: 14, statepower: 10, justtime: -14, income: -14, approval: -10, unrest: 6 },
        desc: 'Landet förbehåller sig rätten att använda kärnvapen först, även innan det självt blivit anfallet. Ingen granne vågar provocera och krig blir lätta att motivera. Folket lever med en ständig oro, statskassan blöder och hela världen ser landet som ett hot.' },
    ],
    locks: {
      anarchism: ['deterrence', 'firststrike'], greens: ['deterrence', 'firststrike'], socialdemocracy: ['firststrike'],
      fascism: ['disarmament'], natsoc: ['disarmament', 'nonnuclear'], stratocracy: ['disarmament'], imperialism: ['disarmament'],
    },
    effects: {
      disarmament: { milx: ['+', -0.2] }, minimal: { milx: ['+', 0.3] },
      deterrence: { milx: ['+', 0.7] }, firststrike: { milx: ['+', 1.2] },
    },
  },

  // Vänster → höger: från förbud som skyddar jobben till helt fri utveckling.
  ai_regulation: {
    name: 'AI and automation', icon: '\u{1F916}', axis: 'econ', dir: 1,
    options: [
      { id: 'ban', name: 'AI ban', mods: { approval: 4, unrest: -4, stability: 3, research: -14, gdp: -8, factory: -8 },
        desc: 'Avancerad AI och automatisering som ersätter arbetare är förbjuden för att skydda jobben. Ingen förlorar arbetet till en maskin och folket känner sig trygga. Landet halkar efter i forskning och teknik, och industrin kan inte konkurrera med länder som automatiserar.' },
      { id: 'moratorium', name: 'Development pause', mods: { safety: 2, stability: 2, research: -9, gdp: -4, factory: -3 },
        desc: 'All utveckling av nya AI-system är pausad tills forskarna har förstått riskerna. Samhället hinner ställa om och farliga misstag undviks. Forskarna och de nya företagen flyttar utomlands under tiden.' },
      { id: 'strict', name: 'Strict regulation', mods: { safety: 3, freedom: 3, approval: 2, research: -5, gdp: -3, factory: -2 },
        desc: 'Varje AI-system måste godkännas av en myndighet innan det får användas, och människors data är starkt skyddad. Medborgarna är trygga mot övervakning och falska bilder. Reglerna gör det dyrt och långsamt att ta fram ny teknik.' },
      { id: 'responsible', name: 'Responsible AI', default: true, mods: {},
        desc: 'AI får användas fritt, men den som orsakar skada bär ansvaret och riskabla system granskas. Varken bonus eller straff. Utgångsläget.' },
      { id: 'light', name: 'Light regulation', mods: { research: 5, gdp: 4, factory: 4, unrest: 2, safety: -2 },
        desc: 'Få regler och snabba tillstånd lockar AI-företag och forskare till landet. Forskning och industri får fart med nya smarta verktyg. Fler jobb tas över av maskiner, och bedrägerier med falska röster och bilder ökar.' },
      { id: 'free', name: 'Free development', mods: { research: 10, gdp: 8, factory: 8, income: 3, unrest: 6, safety: -4, approval: -4 },
        desc: 'Inga regler alls: vem som helst får bygga och använda vilken AI som helst. Landet blir ett centrum för ny teknik och fabrikerna automatiseras i rekordfart. Många förlorar jobbet till maskinerna, och falska bilder och bedrägerier sprids snabbare än någon hinner stoppa dem.' },
    ],
    locks: { libertarianism: ['ban', 'moratorium'], technocracy: ['ban'] },
    effects: {
      ban: { hitech: ['+', -6], patents: ['*', 0.8] }, moratorium: { hitech: ['+', -3], patents: ['*', 0.9] },
      light: { hitech: ['+', 2], patents: ['*', 1.08] },
      free: { hitech: ['+', 5], patents: ['*', 1.2], unemp: ['+', 1], cybercrime: ['*', 1.2] },
    },
  },
};
