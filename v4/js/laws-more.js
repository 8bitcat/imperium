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

  // ---------- V5.9: åtta nya lagar (Henrys önskemål), flera om befolkningen ----------

  // Vänster → höger: från lång ledighet som staten betalar till ingen ledighet alls.
  parental_leave: {
    name: 'Parental leave', icon: '\u{1F37C}', axis: 'econ', dir: 1,
    options: [
      { id: 'generous', name: 'Very long paid leave', mods: { welfare: 12, qol: 8, approval: 7, manpower: 3, income: -12, gdp: -4, factory: -2 },
        desc: 'Föräldrarna får dela på nästan två års ledighet med nästan full lön, och jobbet väntar på dem när de kommer tillbaka. Familjerna får gott om tid med sina små barn och fler vågar skaffa barn. Det kostar staten väldigt mycket, och den som är borta länge från jobbet kan halka efter.' },
      { id: 'long', name: 'Long paid leave', mods: { welfare: 8, qol: 5, approval: 4, manpower: 2, income: -7, gdp: -1 },
        desc: 'Ungefär ett år ledigt med en stor del av lönen, som i de nordiska länderna. Både mammor och pappor hinner vara hemma, och mammorna kommer tillbaka till sina jobb efteråt. Staten betalar en hel del för det.' },
      { id: 'paid', name: 'Paid leave', mods: { welfare: 4, qol: 3, approval: 2, income: -3 },
        desc: 'Ett halvår ledigt med lön från staten när ett barn föds. Familjerna får en lugn start och fler mammor går tillbaka till jobbet efteråt. Ett steg åt det generösa hållet som kostar lite pengar.' },
      { id: 'standard', name: 'Standard', default: true, mods: {},
        desc: 'Några månaders betald ledighet för mamman och några veckor för pappan, ungefär som i de flesta länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'unpaid', name: 'Unpaid leave only', mods: { gdp: 2, income: 3, welfare: -4, qol: -3, approval: -2 },
        desc: 'Föräldrar har rätt att vara lediga och få tillbaka sitt jobb, men ingen betalar någon lön under tiden. Staten och företagen sparar pengar. Många har inte råd att vara hemma och går tillbaka till jobbet efter bara några veckor.' },
      { id: 'none', name: 'No parental leave', mods: { gdp: 4, income: 5, factory: 3, welfare: -8, qol: -6, approval: -6, unrest: 2, manpower: -2 },
        desc: 'Den som får barn har ingen rätt att vara ledig, och den som stannar hemma kan bli av med jobbet. Företagen slipper all kostnad och frånvaro. Många väntar med att skaffa barn, och mammor som vill vara hemma måste ofta sluta arbeta.' },
    ],
    locks: {
      communism: ['unpaid', 'none'], socialism: ['none'], socialdemocracy: ['none'], greens: ['none'], christdem: ['none'],
      libertarianism: ['generous'],
    },
    effects: {
      generous: { fert: ['+', 0.2], birth: ['+', 1.2], femlabor: ['+', -2], infmort: ['*', 0.95] },
      long: { fert: ['+', 0.12], birth: ['+', 0.7], femlabor: ['+', 3], infmort: ['*', 0.97] },
      paid: { fert: ['+', 0.05], birth: ['+', 0.3], femlabor: ['+', 2] },
      unpaid: { fert: ['+', -0.05], birth: ['+', -0.3], femlabor: ['+', -2] },
      none: { fert: ['+', -0.12], birth: ['+', -0.7], femlabor: ['+', -5], infmort: ['*', 1.04] },
    },
  },

  // Vänster → höger: från tidig pension till ingen pensionsålder alls.
  retirement_age: {
    name: 'Retirement age', icon: '\u{1F9D3}', axis: 'econ', dir: 1,
    options: [
      { id: 'age55', name: 'Retire at 55', mods: { welfare: 12, qol: 8, approval: 10, unrest: -3, income: -14, gdp: -7, factory: -6 },
        desc: 'Alla får gå i pension med full pension redan vid 55 års ålder. Folk får många friska år med barnbarn och fritid och älskar dig för det. Men allt färre arbetar för att försörja allt fler pensionärer, och statskassan och fabrikerna saknar erfaret folk.' },
      { id: 'age60', name: 'Retire at 60', mods: { welfare: 8, qol: 5, approval: 6, income: -9, gdp: -4, factory: -3 },
        desc: 'Pensionen börjar vid 60 års ålder. De äldre får gott om tid att vila efter ett långt arbetsliv. Arbetskraften krymper och pensionerna blir en stor post i statens budget.' },
      { id: 'age62', name: 'Retire at 62', mods: { welfare: 3, qol: 2, approval: 3, income: -4, gdp: -2 },
        desc: 'Pensionen börjar vid 62 års ålder, lite tidigare än i de flesta länder. Folk uppskattar några extra år som pensionärer. Det kostar statskassan en del.' },
      { id: 'age65', name: 'Retire at 65', default: true, mods: {},
        desc: 'Pensionen börjar vid 65 års ålder, ungefär som i de flesta länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'age67', name: 'Retire at 67', mods: { income: 4, gdp: 2, factory: 2, approval: -3, qol: -2 },
        desc: 'Pensionen börjar vid 67 års ålder, eftersom folk lever längre än förr. Fler arbetar och betalar skatt, och pensionspengarna räcker längre. Många som har tunga jobb tycker att det är för sent.' },
      { id: 'age70', name: 'Retire at 70', mods: { income: 8, gdp: 4, factory: 4, approval: -7, qol: -5, unrest: 3 },
        desc: 'Pensionen börjar först vid 70 års ålder. Landet har många erfarna arbetare och statskassan sparar stora summor. Den som sliter med kroppen orkar inte så länge, och folket är missnöjt.' },
      { id: 'none', name: 'No retirement age', mods: { income: 12, gdp: 5, factory: 5, welfare: -10, qol: -8, approval: -10, unrest: 6 },
        desc: 'Det finns ingen pensionsålder alls: man arbetar så länge man orkar och får sedan klara sig på sina besparingar eller sin familj. Arbetskraften blir stor och staten slipper nästan alla pensionskostnader. Gamla som inte längre orkar arbeta hamnar lätt i fattigdom.' },
    ],
    locks: { communism: ['age70', 'none'], socialism: ['none'], socialdemocracy: ['none'], greens: ['none'], libertarianism: ['age55'] },
    effects: {
      age55: { lfpr: ['+', -5], labor: ['*', 0.88], dependency: ['+', 9], debt: ['+', 15] },
      age60: { lfpr: ['+', -3], labor: ['*', 0.93], dependency: ['+', 5], debt: ['+', 8] },
      age62: { lfpr: ['+', -1.2], labor: ['*', 0.97], dependency: ['+', 2], debt: ['+', 3] },
      age67: { lfpr: ['+', 1.2], labor: ['*', 1.03], dependency: ['+', -2], debt: ['+', -3] },
      age70: { lfpr: ['+', 3], labor: ['*', 1.07], dependency: ['+', -5], debt: ['+', -6] },
      none: { lfpr: ['+', 5], labor: ['*', 1.12], dependency: ['+', -8], debt: ['+', -10], poverty: ['*', 1.15] },
    },
  },

  // Fri → styrd: från rösträtt vid 16 till att bara de som staten godkänt får rösta.
  voting_age: {
    name: 'Voting age', icon: '\u{270B}', axis: 'auth', dir: 1,
    options: [
      { id: 'age16', name: 'Vote at 16', mods: { freedom: 7, approval: 4, statepower: -3, stability: -2 },
        desc: 'Alla som fyllt 16 år får rösta i alla val, som i Österrike och Brasilien. Unga får vara med och bestämma om sin egen framtid, och skolan och klimatet hamnar högre upp i debatten. Vissa tycker att 16-åringar är för unga, och valen blir lite mer oförutsägbara.' },
      { id: 'local16', name: 'Local vote at 16', mods: { freedom: 4, approval: 2, stability: -1 },
        desc: 'Den som fyllt 16 får rösta i valen till kommunen, men inte till riksdagen. Unga får öva på demokrati nära sin egen vardag. De stora besluten om landet får de ändå inte vara med och fatta.' },
      { id: 'age18', name: 'Vote at 18', default: true, mods: {},
        desc: 'Alla medborgare som fyllt 18 år får rösta, som i nästan alla länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'age21', name: 'Vote at 21', mods: { stability: 3, statepower: 2, freedom: -4, approval: -3 },
        desc: 'Man får rösta först när man fyllt 21, som i många länder förr i tiden. Väljarna har lite mer livserfarenhet och valen blir stabilare. De unga får inte vara med och bestämma, fast de redan arbetar, betalar skatt och kan kallas in till armén.' },
      { id: 'age25', name: 'Vote at 25', mods: { stability: 4, statepower: 5, freedom: -8, approval: -6, unrest: 3 },
        desc: 'Bara den som fyllt 25 år får rösta. Ledningen behöver sällan bry sig om vad de unga tycker, och politiken blir lugn och förutsägbar. En stor del av de vuxna står utanför, och många unga känner att landet inte är deras.' },
      { id: 'approved', name: 'Approved voters only', mods: { statepower: 10, ideopower: 5, freedom: -15, approval: -10, unrest: 6, corruption: 4 },
        desc: 'Bara de som staten har godkänt som lojala får rösta, till exempel medlemmar i det styrande partiet, soldater och tjänstemän. Ledningen vet alltid hur valet ska sluta och staten blir mycket stark. De flesta vuxna har ingen röst alls, och missnöjet samlas tyst under ytan.' },
    ],
    locks: {
      democracy: ['approved'], liberalism: ['approved'], libertarianism: ['approved'], christdem: ['approved'],
      socialdemocracy: ['age25', 'approved'], greens: ['age25', 'approved'], anarchism: ['age25', 'approved'],
      fascism: ['age16'], natsoc: ['age16'], theocracy: ['age16'],
    },
    effects: {
      age16: { voice: ['+', 0.15] }, local16: { voice: ['+', 0.07] },
      age21: { voice: ['+', -0.1] }, age25: { voice: ['+', -0.25] },
      approved: { voice: ['+', -0.7] },
    },
  },

  // Fri → styrd: från fri försäljning till totalförbud.
  tobacco: {
    name: 'Tobacco', icon: '\u{1F6AD}', axis: 'auth', dir: 1,
    options: [
      { id: 'free', name: 'Free sale', mods: { freedom: 6, income: 3, approval: 3, qol: -5, hdi: -3 },
        desc: 'Cigaretter och snus säljs överallt, till alla åldrar, och man får röka var man vill. Folk uppskattar friheten och tobaksbolagen betalar skatt. Fler börjar röka redan som barn, och lungcancer och hjärtsjukdomar blir vanliga.' },
      { id: 'light', name: 'Few rules', mods: { freedom: 3, income: 2, qol: -2, hdi: -1 },
        desc: 'Det finns en åldersgräns, men reklam för tobak är tillåten och man får röka på restauranger. Ett fritt och enkelt system. Lite fler röker än med hårdare regler.' },
      { id: 'regulated', name: 'Regulated', default: true, mods: {},
        desc: 'Åldersgräns på 18 år, varningstexter på paketen och rökförbud inomhus, som i de flesta länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'tough', name: 'High taxes and plain packs', mods: { income: 4, qol: 3, hdi: 2, freedom: -2, approval: -2 },
        desc: 'Tobaken beskattas hårt, säljs i fula och likadana paket och får inte synas i butikerna. Färre börjar röka och folkhälsan blir bättre. Rökarna klagar på priserna och en del köper smuggelcigaretter.' },
      { id: 'smokefree', name: 'Smoke-free generation', mods: { qol: 5, hdi: 3, freedom: -5, approval: -3, corruption: 2, income: -2 },
        desc: 'Den som är född efter ett visst år får aldrig någonsin köpa tobak, så varje ny generation växer upp helt rökfri. Om några årtionden röker nästan ingen och folk lever längre. Många tycker att det är förmynderi, och tobak börjar säljas svart.' },
      { id: 'banned', name: 'Total ban', mods: { qol: 4, hdi: 2, freedom: -10, approval: -8, corruption: 8, income: -5, unrest: 4 },
        desc: 'All tobak är förbjuden att sälja, köpa och röka. Rökningen minskar kraftigt och sjukhusen får färre lungsjuka. En svart marknad växer fram, polisen mutas och folk är arga över att staten bestämmer så mycket.' },
    ],
    locks: { liberalism: ['banned'], libertarianism: ['smokefree', 'banned'], anarchism: ['smokefree', 'banned'] },
    effects: {
      free: { smoking: ['*', 1.3], life: ['+', -0.8], ncd: ['+', 1.5], death: ['+', 0.3] },
      light: { smoking: ['*', 1.12], life: ['+', -0.3], ncd: ['+', 0.6], death: ['+', 0.1] },
      tough: { smoking: ['*', 0.85], life: ['+', 0.4], ncd: ['+', -0.8], death: ['+', -0.1], smuggling: ['*', 1.05] },
      smokefree: { smoking: ['*', 0.65], life: ['+', 0.8], ncd: ['+', -1.5], death: ['+', -0.2], smuggling: ['*', 1.15] },
      banned: { smoking: ['*', 0.45], life: ['+', 1], ncd: ['+', -2], death: ['+', -0.3], smuggling: ['*', 1.5], gangs: ['*', 1.1], bribery: ['+', 1.5] },
    },
  },

  // Fri → styrd: från inga vacciner alls till vaccinationstvång med böter.
  vaccination: {
    name: 'Vaccination', icon: '\u{1F489}', axis: 'auth', dir: 1,
    options: [
      { id: 'noprogram', name: 'No vaccine program', mods: { freedom: 3, income: 4, hdi: -6, qol: -5, approval: -3, manpower: -2 },
        desc: 'Staten erbjuder inga vacciner alls, och den som vill skydda sina barn får ordna och betala det själv. Statskassan sparar pengar och ingen behöver ta ställning. Mässling, kikhosta och andra gamla sjukdomar kommer tillbaka, och fler små barn blir svårt sjuka.' },
      { id: 'voluntary', name: 'Voluntary, no campaigns', mods: { freedom: 3, hdi: -2, qol: -2 },
        desc: 'Vaccinerna är gratis, men staten gör ingen reklam för dem och skolan frågar aldrig. Familjerna bestämmer helt själva. Fler glömmer bort eller struntar i vaccinerna, och utbrott av mässling blir vanligare.' },
      { id: 'recommended', name: 'Free and recommended', default: true, mods: {},
        desc: 'Barnen erbjuds gratis vacciner på barnavårdscentralen och vården rekommenderar starkt att alla tar dem, som i Sverige. Varken bonus eller straff. Utgångsläget.' },
      { id: 'campaigns', name: 'Vaccination campaigns', mods: { hdi: 3, qol: 2, approval: 1, income: -3 },
        desc: 'Sjuksköterskor vaccinerar barnen i skolan, påminner familjer som missat en dos och åker ut till byar långt bort. Nästan alla barn blir skyddade och färre blir sjuka. Kampanjerna kostar pengar.' },
      { id: 'school', name: 'Required for school', mods: { hdi: 4, qol: 3, statepower: 3, freedom: -4, approval: -2 },
        desc: 'Barn måste vara vaccinerade för att få gå i förskolan och skolan, som i Frankrike och Italien. Nästan alla vaccinerar sig och utbrotten blir sällsynta. Familjer som inte vill känner sig tvingade.' },
      { id: 'mandatory', name: 'Mandatory with fines', mods: { hdi: 5, qol: 3, statepower: 6, freedom: -8, approval: -4, unrest: 3 },
        desc: 'Alla måste ta de vacciner staten bestämmer, och den som vägrar får böter. Sjukdomarna försvinner nästan helt och sjukhusen får det lugnare. Många tycker att staten går för långt när den bestämmer över människors kroppar, och en del protesterar.' },
    ],
    locks: {
      libertarianism: ['mandatory'], liberalism: ['mandatory'], anarchism: ['school', 'mandatory'],
      communism: ['noprogram'], socialism: ['noprogram'], socialdemocracy: ['noprogram'], technocracy: ['noprogram', 'voluntary'],
    },
    effects: {
      noprogram: { measles: ['+', -20], dpt: ['+', -20], u5mort: ['*', 1.3], infmort: ['*', 1.15], life: ['+', -1.5] },
      voluntary: { measles: ['+', -6], dpt: ['+', -5], u5mort: ['*', 1.08], life: ['+', -0.3] },
      campaigns: { measles: ['+', 4], dpt: ['+', 4], u5mort: ['*', 0.95], infmort: ['*', 0.97], life: ['+', 0.3] },
      school: { measles: ['+', 7], dpt: ['+', 7], u5mort: ['*', 0.92], infmort: ['*', 0.95], life: ['+', 0.5] },
      mandatory: { measles: ['+', 9], dpt: ['+', 9], u5mort: ['*', 0.9], infmort: ['*', 0.94], life: ['+', 0.6] },
    },
  },

  // Vänster → höger: från mycket hög arvsskatt till skattefria familjestiftelser.
  inheritance_tax: {
    name: 'Inheritance tax', icon: '\u{1F4DC}', axis: 'econ', dir: 1,
    options: [
      { id: 'veryhigh', name: 'Very high', mods: { income: 7, welfare: 5, gdp: -6, approval: -3, corruption: 3 },
        desc: 'Staten tar mer än hälften av alla stora arv, så att ingen kan ärva sig rik. Förmögenheterna sprids ut och statskassan får mer pengar. Många rika flyttar sina pengar utomlands, och familjeföretag måste ibland säljas för att betala skatten.' },
      { id: 'high', name: 'High', mods: { income: 4, welfare: 3, gdp: -3, approval: -2 },
        desc: 'En hög skatt på stora arv, medan vanliga arv efter föräldrarna nästan klarar sig. Klyftorna mellan rika och fattiga minskar. Rika familjer anlitar skatteexperter för att slippa betala.' },
      { id: 'raised', name: 'Above average', mods: { income: 2, gdp: -1, approval: -1 },
        desc: 'Arvsskatten är lite högre än i de flesta länder och gäller fler arv. Ett litet tillskott till statskassan. Den som ärver ett hus eller en gård märker det.' },
      { id: 'standard', name: 'Standard', default: true, mods: {},
        desc: 'En måttlig skatt på riktigt stora arv, medan vanliga arv är skattefria, som i många länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'none', name: 'No inheritance tax', mods: { gdp: 3, approval: 2, income: -3, welfare: -1 },
        desc: 'Ingen betalar skatt på det de ärver, som i Sverige sedan 2005. Familjeföretag och gårdar kan gå vidare till barnen och många tycker att det är rättvist. Staten går miste om lite pengar, och den som föds i en rik familj får ett försprång.' },
      { id: 'trusts', name: 'Tax-free family trusts', mods: { gdp: 5, factory: 2, income: -5, welfare: -3, approval: -3, corruption: 5 },
        desc: 'Ingen arvsskatt, och rika familjer får dessutom lägga sina förmögenheter i stiftelser som aldrig beskattas. Stora förmögenheter och investerare söker sig till landet. Samma familjer blir rikare för varje generation, och en del av pengarna kommer från tvivelaktiga affärer.' },
    ],
    locks: {
      communism: ['none', 'trusts'], socialism: ['trusts'], socialdemocracy: ['trusts'],
      libertarianism: ['veryhigh', 'high'], monarchism: ['veryhigh'],
    },
    effects: {
      veryhigh: { gini: ['+', -2.5], tax: ['+', 1], taxevasion: ['+', 2] },
      high: { gini: ['+', -1.2], tax: ['+', 0.5], taxevasion: ['+', 1] },
      raised: { gini: ['+', -0.5], tax: ['+', 0.2] },
      none: { gini: ['+', 1], tax: ['+', -0.2] },
      trusts: { gini: ['+', 2.5], tax: ['+', -0.4], moneylaundering: ['+', 0.6], fdi: ['+', 0.5] },
    },
  },

  // Vänster → höger: från bara statliga skolor till skolor som familjerna betalar.
  school_choice: {
    name: 'School choice', icon: '\u{1F3EB}', axis: 'econ', dir: 1,
    options: [
      { id: 'stateonly', name: 'State schools only', mods: { integration: 6, welfare: 4, statepower: 4, freedom: -7, research: -3, gdp: -2 },
        desc: 'Privata skolor är förbjudna och alla barn går i statens skola där de bor. Rika och fattiga barn går i samma klasser och lär känna varandra. Den som har en dålig skola kan inte byta, och nya idéer om undervisning får svårt att prövas.' },
      { id: 'assigned', name: 'Neighborhood schools', mods: { integration: 4, welfare: 2, freedom: -3, research: -1 },
        desc: 'Alla barn går i den kommunala skolan närmast hemmet, och privata skolor får inga pengar från staten. Skolan blir en mötesplats för alla i området. Familjerna kan inte välja, och i fattiga områden blir skolorna sämre.' },
      { id: 'nonprofit', name: 'No profit in schools', mods: { welfare: 2, approval: 2, corruption: -2, gdp: -1 },
        desc: 'Familjerna får välja skola och fristående skolor får pengar från staten, men ingen får tjäna pengar på att driva en skola. Alla skolpengar går till eleverna. Färre nya skolor startas än om företag fick vara med.' },
      { id: 'mixed', name: 'Mixed', default: true, mods: {},
        desc: 'Kommunala och fristående skolor finns sida vid sida, och familjerna får söka till en annan skola än den närmaste. Varken bonus eller straff. Utgångsläget.' },
      { id: 'vouchers', name: 'School vouchers', mods: { freedom: 5, research: 3, gdp: 2, integration: -4, welfare: -2, corruption: 2 },
        desc: 'Varje elev får en skolpeng som följer med till den skola familjen väljer, även skolor som drivs av företag. Skolorna tävlar om eleverna och nya idéer prövas. Barn med föräldrar som väljer aktivt hamnar i samma skolor, och vissa företag sparar på lärarna för att tjäna mer.' },
      { id: 'feepaying', name: 'Fee-paying schools', mods: { gdp: 4, income: 6, research: 2, welfare: -10, hdi: -6, qol: -4, integration: -6, approval: -5 },
        desc: 'Staten driver inga skolor alls, och alla skolor är företag där familjerna betalar avgift. De bästa skolorna blir mycket bra och staten sparar stora summor. Barn i fattiga familjer får gå i billiga, dåliga skolor eller ingen skola alls.' },
    ],
    locks: {
      libertarianism: ['stateonly', 'assigned'], communism: ['vouchers', 'feepaying'],
      socialism: ['feepaying'], socialdemocracy: ['feepaying'], greens: ['feepaying'],
    },
    effects: {
      stateonly: { gini: ['+', -1] },
      assigned: { gini: ['+', -0.5] },
      nonprofit: { pupilteacher: ['*', 0.97] },
      vouchers: { gini: ['+', 0.8], pupilteacher: ['*', 1.05] },
      feepaying: { gini: ['+', 3], secondary: ['+', -8], outofschool: ['*', 1.6], youthlit: ['+', -3], schoolyears: ['+', -0.6] },
    },
  },

  // Vänster → höger: från djurens rättigheter i lag till inget djurskydd alls.
  animal_welfare: {
    name: 'Animal welfare', icon: '\u{1F43E}', axis: 'econ', dir: 1,
    options: [
      { id: 'animalrights', name: 'Animal rights', mods: { qol: 6, approval: 2, factory: -6, gdp: -4, research: -3 },
        desc: 'Djur har egna rättigheter i lagen. Pälsfarmer, burhöns, djurförsök och vilda djur på cirkus är förbjudna, och skyddet kontrolleras noga. Djuren mår bra och naturen gynnas. Kött, ägg och mediciner blir dyrare och en del forskning flyttar utomlands.' },
      { id: 'strong', name: 'Strong protection', mods: { qol: 4, approval: 3, factory: -3, gdp: -2 },
        desc: 'Korna ska få gå ute på sommaren, grisar och höns ska ha plats att röra sig och pälsfarmer är förbjudna. Djuren har det bra och folk är stolta över maten. Bönderna får högre kostnader och maten blir lite dyrare.' },
      { id: 'improved', name: 'Above average', mods: { qol: 2, approval: 1, gdp: -1 },
        desc: 'Lite strängare djurskyddsregler än i de flesta länder och fler kontroller på gårdarna. Djuren får det bättre. Bönderna får lite mer pappersarbete.' },
      { id: 'standard', name: 'Standard', default: true, mods: {},
        desc: 'Det är förbjudet att plåga djur, och lantbruksdjur ska ha mat, vatten och tak över huvudet, som i de flesta länder. Varken bonus eller straff. Utgångsläget.' },
      { id: 'weak', name: 'Weak protection', mods: { gdp: 3, factory: 3, qol: -3, approval: -2 },
        desc: 'Djurskyddsreglerna är få och kontrolleras sällan. Fabriksjordbruken producerar billigt kött och billiga ägg. Djuren står trångt, och vilda djur jagas och säljs utan att någon bryr sig.' },
      { id: 'none', name: 'No protection', mods: { gdp: 5, factory: 5, income: 2, qol: -6, approval: -5, corruption: 2 },
        desc: 'Djur räknas bara som saker som ägaren får göra vad den vill med. Industrin och jordbruket tjänar pengar utan krångliga regler. Djuren far illa, sällsynta arter jagas tills de nästan är borta och många skäms över sitt land.' },
    ],
    locks: { greens: ['weak', 'none'], socialdemocracy: ['none'], libertarianism: ['animalrights'] },
    effects: {
      animalrights: { poaching: ['+', -12], thrmammals: ['*', 0.85], thrbirds: ['*', 0.85], methane: ['*', 0.9], fishcatch: ['*', 0.85] },
      strong: { poaching: ['+', -6], thrmammals: ['*', 0.92], thrbirds: ['*', 0.92], methane: ['*', 0.96] },
      improved: { poaching: ['+', -3] },
      weak: { poaching: ['+', 6], thrmammals: ['*', 1.08], thrbirds: ['*', 1.08] },
      none: { poaching: ['+', 12], thrmammals: ['*', 1.18], thrbirds: ['*', 1.18], methane: ['*', 1.05], fishcatch: ['*', 1.1] },
    },
  },
};
