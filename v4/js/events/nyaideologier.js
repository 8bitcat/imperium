// IMPERIUM V5.6 — HÄNDELSER: DE FEM NYA IDEOLOGIERNA.
// Gröna, libertarianer, teknokrater, kristdemokrater och militärstyre: deras vardag, inre strider och hur de växer fram i andra länder.
export const EVENTS = [

  // ================= GRÖN POLITIK =================
  {
    id: 'ny_gron_bruksorten', icon: '\u{1F3ED}', weight: 2,
    title: 'KLIMATMÅLET MOT BRUKSORTEN',
    text: 'Enligt den gröna regeringens klimatplan ska stålverket i en liten bruksort stängas inom två år. Hela orten lever på verket, och facket har kallat till protestmöte på torget.',
    when: (c) => c.ideo === 'greens' && ((c.ind.co2 ?? 3) > 1.5 || c.st.factory > 10),
    choices: [
      { text: 'STÄNG VERKET ENLIGT PLANEN', perm: { qol: 4, factory: -8 }, temp: { unrest: 8, approval: -5 }, tip: 'Utsläppen sjunker. Stämningen på orten också.' },
      { text: 'STARTA EN OMSTÄLLNINGSFOND FÖR ORTEN', cost: { money: 900 }, perm: { qol: 3, factory: -4 }, temp: { unrest: -4, approval: 4 }, tip: 'Nya jobb, köpta med skattepengar.' },
      { text: 'BYGG OM VERKET FÖR STÅL MED VÄTGAS', cost: { money: 1400, rp: 40 }, perm: { factory: 4, qol: 2, research: 3 }, tip: 'Grönt stål. Dyrt stål.' },
      { text: 'SKJUT UPP STÄNGNINGEN FEM ÅR', temp: { ideopower: -10, approval: 3 }, tip: 'Fundis kommer att kalla det förräderi.' },
    ],
  },
  {
    id: 'ny_gron_karnkraft', icon: '\u{269B}\u{FE0F}', weight: 2,
    title: 'KÄRNKRAFTEN DELAR PARTIET',
    text: 'Partiprogrammet säger att reaktorerna ska avvecklas, men elpriset stiger och realos vill behålla dem som en brygga till det förnybara. Kongressen kräver att du väljer sida.',
    when: (c) => c.ideo === 'greens' && (c.is('energy', 'nuclear', 'mixed') || c.res('nuclear') >= 3),
    choices: [
      { text: 'AVVECKLA REAKTORERNA', cost: { pp: 20 }, law: ['energy', 'renewable'], perm: { factory: -6 }, temp: { ideopower: 8, income: -6 }, tip: 'Principfast. Vintern blir dyr.' },
      { text: 'BEHÅLL DEM SOM BRYGGA', perm: { factory: 2 }, temp: { ideopower: -6, approval: 3 }, tip: 'Realos jublar. Fundis lämnar salen.' },
      { text: 'SATSA PÅ EN NY GENERATION REAKTORER', cost: { money: 1200, rp: 50 }, law: ['energy', 'nuclear'], perm: { factory: 6, research: 4 }, temp: { ideopower: -12 }, tip: 'Ett grönt parti som bygger kärnkraft. Historien är full av överraskningar.' },
    ],
  },
  {
    id: 'ny_gron_bilfritt', icon: '\u{1F6B2}', weight: 2,
    title: 'BILARNA UT UR INNERSTADEN',
    text: 'Huvudstadens gröna borgarråd vill göra hela innerstaden bilfri och bygga om parkeringshusen till cykelgarage och parker. Handlarna varnar för att kunderna flyr till köpcentrumen utanför stan.',
    when: (c) => c.ideo === 'greens' && (c.ind.urban ?? 60) > 50,
    choices: [
      { text: 'BILFRITT INNANFÖR TULLARNA', cost: { pp: 20 }, perm: { qol: 6, safety: 3 }, temp: { approval: -6, gdp: -3 }, tip: 'Tyst, grönt och lite tomt i butikerna.' },
      { text: 'BYGG CYKELBANOR, LÅT BILARNA STANNA', cost: { money: 500 }, perm: { qol: 3 }, temp: { approval: 2 }, tip: 'Alla får något. Ingen får det de ville ha.' },
      { text: 'LÅT STADEN BESTÄMMA SJÄLV', temp: { ideopower: -5, stability: 2 }, tip: 'Lokalt självstyre, den bekvämaste av principer.' },
    ],
  },
  {
    id: 'ny_gron_kottskatt', icon: '\u{1F969}', weight: 2,
    title: 'SKATT PÅ KÖTTET',
    text: 'Klimatrådet föreslår en skatt på kött och mejeriprodukter. Bönderna har kört upp traktorerna utanför parlamentet, och plötsligt har varje grillkväll blivit en politisk handling.',
    when: (c) => c.ideo === 'greens' && ((c.ind.co2 ?? 3) > 4 || c.doc === 'fundi' || c.doc === 'ecosocial'),
    choices: [
      { text: 'INFÖR KÖTTSKATTEN', res: { money: 400 }, perm: { qol: 2, hdi: 2 }, temp: { approval: -8, unrest: 6 }, tip: 'Statskassan växer. Traktorerna står kvar.' },
      { text: 'SUBVENTIONERA GRÖNSAKER I STÄLLET', cost: { money: 600 }, perm: { qol: 3 }, temp: { approval: 3 }, tip: 'Morot i stället för piska. Bokstavligen.' },
      { text: 'TILLSÄTT EN UTREDNING', temp: { ideopower: -6 }, tip: 'Utredningen beräknas vara klar om sju år.' },
    ],
  },
  {
    id: 'ny_gron_realo_fundi', icon: '\u{1F331}', weight: 2,
    title: 'REALOS MOT FUNDIS',
    text: 'Partistämman har blivit en öppen strid. Realos vill kompromissa för att få igenom något alls, fundis anklagar dem för att ha sålt rörelsens själ för ministerposter.',
    when: (c) => c.ideo === 'greens' && c.harmony < 0.5,
    choices: [
      { text: 'STÖD REALOS: HELLRE HALVA SEGRAR ÄN INGA', perm: { gdp: 3, factory: 3 }, temp: { ideopower: -8, approval: 4 }, tip: 'Pragmatiskt. Gräsrötterna börjar vissna.' },
      { text: 'STÖD FUNDIS: PRINCIPERNA ÄR INTE TILL SALU', perm: { qol: 3, ideopower: 6 }, temp: { polpower: -8, approval: -5 }, tip: 'Ren profil. Färre allierade.' },
      { text: 'LÅT MEDLEMMARNA RÖSTA', cost: { pp: 20 }, temp: { stability: 4, freedom: 3, ideopower: 4 }, tip: 'Demokrati inom partiet. Långa nätter.' },
    ],
  },
  {
    id: 'ny_gron_vindkraft', icon: '\u{1F32C}\u{FE0F}', weight: 2,
    title: 'VINDKRAFTVERKEN I FJÄLLEN',
    text: 'Ett bolag vill bygga landets största vindkraftspark på en orörd fjällhed. Klimatet behöver elen, men naturskyddarna, de lokala jägarna och halva ditt eget parti säger nej.',
    when: (c) => c.ideo === 'greens' && (c.is('energy', 'renewable', 'green') || (c.ind.renew ?? 20) < 30),
    choices: [
      { text: 'BYGG, KLIMATET GÅR FÖRST', cost: { money: 600 }, perm: { income: 3, qol: 2 }, temp: { unrest: 5, ideopower: -4 }, tip: 'Grön el från en hed som inte längre är orörd.' },
      { text: 'FLYTTA PARKEN UT TILL HAVET', cost: { money: 1400 }, perm: { income: 3, qol: 3 }, tip: 'Dubbelt så dyrt, hälften så många arga.' },
      { text: 'STOPPA PARKEN, NATUREN GÅR FÖRST', perm: { factory: -3 }, temp: { ideopower: 5, approval: 2 }, tip: 'Heden får vara. Kolkraften i grannlandet tackar.' },
    ],
  },
  {
    id: 'ny_gron_flygskatt', icon: '\u{2708}\u{FE0F}', weight: 2,
    title: 'FLYGSKATTEN OCH CHARTERRESAN',
    text: 'Regeringen vill höja flygskatten så att en resa till solen kostar dubbelt så mycket. Resebolagen hotar att flytta, och kvällstidningarna kallar det ett angrepp på vanligt folks semester.',
    when: (c) => c.ideo === 'greens' && (c.ind.tourists ?? 1000000) > 500000,
    choices: [
      { text: 'HÖJ FLYGSKATTEN KRAFTIGT', res: { money: 500 }, perm: { qol: 2 }, temp: { approval: -6, gdp: -3 }, tip: 'Färre plan, fler arga semesterfirare.' },
      { text: 'BYGG NATTÅG TILL KONTINENTEN', cost: { money: 1300 }, perm: { qol: 4, income: 2 }, temp: { approval: 4 }, tip: 'Sov dig till solen. Långsamt och dyrt.' },
      { text: 'LÅT FLYGET VARA', temp: { ideopower: -8, approval: 3 }, tip: 'Semestern räddad. Klimatmålet mindre så.' },
    ],
  },
  {
    id: 'ny_gron_smog', icon: '\u{1F32B}\u{FE0F}', weight: 2,
    title: 'SMOGEN LIGGER ÖVER STADEN',
    text: 'För tredje veckan i rad syns inte solen över huvudstaden. Skolor stängs, barnavdelningarna fylls av barn med astma, och ett nytt grönt parti samlar namn för att kolkraftverken ska stängas.',
    when: (c) => c.ideo !== 'greens' && (c.ind.pm25 ?? 15) > 35 && !c.is('energy', 'renewable', 'green'),
    choices: [
      { text: 'STÄNG KOLKRAFTVERKEN RUNT STADEN', cost: { money: 900 }, law: ['energy', 'green'], perm: { qol: 5, hdi: 2, factory: -5 }, tip: 'Blå himmel, dyrare el.' },
      { text: 'KÖRFÖRBUD VARANNAN DAG', cost: { pp: 15 }, temp: { qol: 4, gdp: -3, unrest: 3 }, tip: 'Jämna registreringsnummer på måndagar.' },
      { text: 'VÄNTA PÅ BLÅSIGARE VÄDER', perm: { hdi: -2 }, temp: { approval: -6, unrest: 5 }, tip: 'Meteorologerna lovar ingenting.' },
    ],
  },
  {
    id: 'ny_gron_nedvaxt', icon: '\u{267B}\u{FE0F}', weight: 2,
    title: 'NEDVÄXT ELLER GRÖN TILLVÄXT',
    text: 'Ekosocialisterna menar att planeten inte tål evig tillväxt och vill korta arbetsveckan och konsumera mindre. Finansministern vill i stället satsa stort på en grön investeringsplan.',
    when: (c) => c.ideo === 'greens' && (c.doc === 'ecosocial' || (c.ind.gdpgrowth ?? 2) < 0.5),
    choices: [
      { text: 'INFÖR FYRADAGARSVECKA', cost: { pp: 25 }, law: ['workhours', 'limited'], perm: { qol: 4, gdp: -4 }, tip: 'Mer liv, mindre BNP. Frågan är vilket som räknas.' },
      { text: 'GRÖN INVESTERINGSPLAN FÖR HELA LANDET', cost: { money: 1500 }, perm: { factory: 4, gdp: 3, qol: 2 }, tip: 'Tillväxt med gott samvete och dålig budget.' },
      { text: 'HÅLL FAST VID BUDGETEN', temp: { ideopower: -5, stability: 3 }, tip: 'Ingen revolution i år heller.' },
    ],
  },

  // ================= LIBERTARIANISM =================
  {
    id: 'ny_lib_vagarna', icon: '\u{1F6E3}\u{FE0F}', weight: 2,
    title: 'VÄGARNA HAR SÅLTS',
    text: 'Sedan landsvägarna privatiserades har bolagen satt upp bommar och tar betalt per kilometer. På landsbygden växer groparna i vägarna som inte lönar sig, och mjölkbilen har slutat komma till flera byar.',
    when: (c) => c.ideo === 'libertarianism' && (c.is('ownership', 'privatized', 'full') || c.st.welfare < 0),
    choices: [
      { text: 'LÅT MARKNADEN SÄTTA PRISET', perm: { gdp: 3, qol: -3 }, temp: { unrest: 6 }, tip: 'Vägen finns. Den kostar bara.' },
      { text: 'INFÖR ETT TAK FÖR VÄGAVGIFTERNA', cost: { pp: 20 }, perm: { income: -2 }, temp: { ideopower: -6, approval: 5 }, tip: 'Prisreglering. Smaka på ordet.' },
      { text: 'KÖP TILLBAKA LANDSVÄGARNA', cost: { money: 1200 }, perm: { qol: 4 }, temp: { ideopower: -10, approval: 4 }, tip: 'Staten äger vägar igen. Någon i partiet gråter.' },
    ],
  },
  {
    id: 'ny_lib_myndigheter', icon: '\u{2702}\u{FE0F}', weight: 2,
    title: 'FEMTIO MYNDIGHETER SKA BORT',
    text: 'Regeringen har en lista över femtio myndigheter som ska läggas ner, från statistikverket till livsmedelskontrollen. Tusentals tjänstemän väntar på besked och oppositionen frågar vem som ska kontrollera maten.',
    when: (c) => c.ideo === 'libertarianism' && c.st.statepower > -10,
    choices: [
      { text: 'LÄGG NER ALLA PÅ EN GÅNG', perm: { income: 6, statepower: -8, corruption: -3 }, temp: { unrest: 6, stability: -6 }, tip: 'Motorsågen går varm.' },
      { text: 'EN I TAGET, MED UTVÄRDERING', cost: { pp: 20 }, perm: { income: 3, statepower: -3 }, tip: 'Långsamt, försiktigt och tråkigt.' },
      { text: 'SPARA LIVSMEDELSKONTROLLEN', cost: { pp: 10 }, perm: { income: 4, safety: 3, statepower: -5 }, temp: { ideopower: -4 }, tip: 'Även frihetsvänner vill kunna lita på köttfärsen.' },
    ],
  },
  {
    id: 'ny_lib_krypto', icon: '\u{1FA99}', weight: 2,
    title: 'KRYPTO SOM LAGLIGT BETALMEDEL',
    text: 'Ett lagförslag vill göra en kryptovaluta till lagligt betalmedel vid sidan av den vanliga valutan. Entreprenörer strömmar till, men centralbanken varnar för penningtvätt och vilda kurssvängningar.',
    when: (c) => c.ideo === 'libertarianism',
    choices: [
      { text: 'GÖR KRYPTON TILL LAGLIGT BETALMEDEL', mod: 'foreign_investment', perm: { freedom: 4, corruption: 4 }, temp: { stability: -4 }, tip: 'Landet blir ett kryptoparadis. Även för fel sorts kunder.' },
      { text: 'TILLÅT DET, MEN MED TUFFA REGLER', cost: { pp: 20 }, perm: { gdp: 2, freedom: 2 }, tip: 'Ett mellanting som ingen skriver hem om.' },
      { text: 'AVSLÅ FÖRSLAGET', perm: { stability: 2 }, temp: { ideopower: -5 }, tip: 'Centralbanken andas ut.' },
    ],
  },
  {
    id: 'ny_lib_kryptokrasch', icon: '\u{1F4C9}', weight: 2,
    title: 'KRYPTOBÖRSEN HAR KRASCHAT',
    text: 'Landets största kryptobörs har gått i konkurs över en natt och grundaren har lämnat landet. Hundratusentals småsparare har förlorat allt, och nu ropar de på den stat de röstade för att krympa.',
    when: (c) => c.ideo === 'libertarianism' && c.st.corruption > 0,
    choices: [
      { text: 'INGEN RÄDDNING, RISK ÄR RISK', perm: { ideopower: 3 }, temp: { gdp: -5, approval: -8 }, tip: 'Konsekvent. Mycket konsekvent.' },
      { text: 'ERSÄTT SMÅSPARARNA', cost: { money: 1000 }, temp: { approval: 6, ideopower: -8 }, tip: 'Vinsterna var privata. Förlusterna blev det inte.' },
      { text: 'INFÖR REGLER FÖR HANDELN', cost: { pp: 25 }, perm: { safety: 3, corruption: -4, freedom: -2 }, tip: 'En myndighet till. Ironin går ingen förbi.' },
    ],
  },
  {
    id: 'ny_lib_brandkaren', icon: '\u{1F692}', weight: 2,
    title: 'VEM BETALAR BRANDKÅREN?',
    text: 'Räddningstjänsten finansieras numera med frivilliga abonnemang. I natt brann ett hus vars ägare inte hade betalat, och brandmännen skyddade bara grannens tomt. Ingen skadades, men bilderna finns överallt.',
    when: (c) => c.ideo === 'libertarianism' && (c.st.welfare < 10 || c.st.safety < 0),
    choices: [
      { text: 'AVTAL ÄR AVTAL', perm: { safety: -3, income: 2 }, temp: { approval: -8 }, tip: 'Nästa gång betalar de nog.' },
      { text: 'SKATTEFINANSIERA BRANDKÅREN IGEN', cost: { money: 600 }, perm: { safety: 5 }, temp: { ideopower: -8, approval: 4 }, tip: 'Ett kollektivt nödsystem. Ordet är tabu i partiet.' },
      { text: 'STATSBIDRAG TILL FRIVILLIGA BRANDKÅRER', cost: { money: 300 }, perm: { safety: 2 }, temp: { approval: 3 }, tip: 'Civilsamhället rycker ut, med statens slangar.' },
    ],
  },
  {
    id: 'ny_lib_frihet_trygghet', icon: '\u{1F6E1}\u{FE0F}', weight: 2,
    title: 'FRIHET ELLER TRYGGHET',
    text: 'Efter en rad inbrott och rån har polisen för få patruller för att hinna med. Hälften av väljarna vill ha fler poliser, den andra hälften vill få rätt att försvara sig själva.',
    when: (c) => c.ideo === 'libertarianism' && (c.st.safety < 0 || (c.ind.homicide ?? 3) > 8),
    choices: [
      { text: 'LÄTTA PÅ VAPENLAGARNA', law: ['firearms', 'free'], perm: { freedom: 4 }, temp: { safety: -4, ideopower: 4 }, tip: 'Varje medborgare sin egen polis.' },
      { text: 'ANSTÄLL FLER POLISER', cost: { money: 800 }, perm: { safety: 6 }, temp: { ideopower: -6 }, tip: 'Staten växer, ett kvarter i taget.' },
      { text: 'LÅT VAKTBOLAGEN TA ÖVER', perm: { safety: 3, corruption: 3, qol: -2 }, tip: 'Trygghet för den som har råd med ett abonnemang.' },
    ],
  },
  {
    id: 'ny_lib_paleo_grans', icon: '\u{1F6A7}', weight: 2,
    title: 'GRÄNSEN DELAR FRIHETSRÖRELSEN',
    text: 'Paleoflygeln vill stänga gränserna för att skydda den lokala gemenskapen. De klassiska liberalerna svarar att fri rörlighet för människor är frihandel, och att staten inte ska välja vem som får flytta hit.',
    when: (c) => c.ideo === 'libertarianism' && (c.doc === 'paleo' || c.st.immigration > 15),
    choices: [
      { text: 'ÖPPNA GRÄNSERNA', law: ['immigration', 'open'], perm: { gdp: 3 }, temp: { integration: -6, stability: -3 }, tip: 'Arbetskraften kommer med tåget. Integrationen står kvar på perrongen.' },
      { text: 'STRAMA ÅT GRÄNSERNA', law: ['immigration', 'restricted'], perm: { integration: 3, gdp: -2 }, temp: { freedom: -3 }, tip: 'En liten stat med en stor gräns.' },
      { text: 'INFÖR ETT POÄNGSYSTEM', cost: { pp: 20 }, law: ['immigration', 'points'], perm: { gdp: 2, research: 2 }, tip: 'Välkommen, om du har rätt examen.' },
    ],
  },
  {
    id: 'ny_lib_charterstad', icon: '\u{1F3DD}\u{FE0F}', weight: 2,
    title: 'EN PRIVAT STAD PÅ ÖN',
    text: 'Ett konsortium av investerare vill bygga en egen stad på en ö utanför kusten, med egna lagar, egna domstolar och egen polis. De lovar tiotusentals jobb, men ingen har frågat öborna som bor där i dag.',
    when: (c) => c.ideo === 'libertarianism' && (c.st.gdp < 20 || c.doc === 'minarchist'),
    choices: [
      { text: 'GE DEM EN FRIZON MED EGNA LAGAR', mod: 'foreign_investment', perm: { gdp: 3, statepower: -5 }, temp: { unrest: 6 }, tip: 'Ett land i landet. Vad kan gå fel?' },
      { text: 'JA, MEN LANDETS LAGAR GÄLLER', cost: { pp: 20 }, perm: { gdp: 3 }, temp: { unrest: 2 }, tip: 'Investerarna tvekar. Öborna också.' },
      { text: 'LÅT ÖBORNA RÖSTA', cost: { money: 200 }, temp: { freedom: 4, approval: 3 }, tip: 'De röstar nej. Det visste alla.' },
      { text: 'TACKA NEJ', temp: { ideopower: -4, stability: 2 }, tip: 'Ön förblir en ö.' },
    ],
  },
  {
    id: 'ny_lib_skatteuppror', icon: '\u{1F4B8}', weight: 2,
    title: 'SKATTEUPPRORET',
    text: 'En ny rörelse uppmanar folk att sluta betala skatt tills staten har halverats. Mötena fylls av småföretagare och unga, och rörelsens frihetsparti har gått om två etablerade partier i mätningarna.',
    when: (c) => c.ideo !== 'libertarianism' && c.is('taxes', 't40', 't60') && (c.st.gdp < 0 || c.st.approval < 0),
    choices: [
      { text: 'SÄNK SKATTERNA TILL MEDELNIVÅ', law: ['taxes', 'balanced'], perm: { gdp: 3 }, temp: { income: -8, approval: 6 }, tip: 'Rörelsen tappar luft. Statskassan också.' },
      { text: 'FÖRENKLA SKATTESYSTEMET', cost: { pp: 20 }, perm: { gdp: 2, corruption: -2 }, temp: { approval: 3 }, tip: 'Samma skatt, färre blanketter.' },
      { text: 'JAGA SKATTEVÄGRARNA', cost: { pp: 15 }, res: { money: 300 }, temp: { unrest: 6, freedom: -3 }, tip: 'Indrivningen lyckas. Martyrskapet också.' },
      { text: 'LÅT DEM PROTESTERA', temp: { unrest: 4, approval: -3 }, tip: 'Rörelsen fortsätter växa i lugn och ro.' },
    ],
  },
  {
    id: 'ny_lib_motorsagen', icon: '\u{1FA9A}', weight: 2,
    title: 'EN OUTSIDER MED MOTORSÅG',
    text: 'Med priserna skenande har en ekonomiprofessor utan partibakgrund blivit landets mest omtalade politiker. Han viftar med en motorsåg på sina möten och lovar att skära bort halva staten och stoppa sedelpressarna.',
    when: (c) => c.ideo !== 'libertarianism' && (c.ind.infl ?? 3) > 11 && c.st.approval < 20,
    choices: [
      { text: 'ANTA HANS PLAN: STRAM PENNINGPOLITIK', cost: { pp: 20 }, law: ['monetary', 'tight'], perm: { income: 4 }, temp: { welfare: -6, unrest: 6, approval: -4 }, tip: 'Inflationen faller. Köpkraften också.' },
      { text: 'TA IN HONOM I REGERINGEN', cost: { pp: 25 }, perm: { statepower: -3, freedom: 2 }, temp: { approval: 6, stability: -4 }, tip: 'Bättre att ha motorsågen inne i tältet.' },
      { text: 'KALLA HONOM EN CLOWN', temp: { ideopower: 3, approval: -5 }, tip: 'Folk gillar clowner när priserna stiger.' },
    ],
  },

  // ================= TEKNOKRATI =================
  {
    id: 'ny_tek_folkviljan', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'EXPERTERNA MOT FOLKVILJAN',
    text: 'En folkomröstning har gått emot regeringens expertråd med klar marginal. Ekonomerna är eniga om att beslutet kommer att kosta landet dyrt, men folket har talat.',
    when: (c) => c.ideo === 'technocracy' && c.st.approval < 15,
    choices: [
      { text: 'KÖR ÖVER RESULTATET', cost: { pp: 25 }, perm: { gdp: 3 }, temp: { approval: -10, freedom: -5, unrest: 5 }, tip: 'Rätt beslut, fel avsändare.' },
      { text: 'FÖLJ FOLKVILJAN', perm: { gdp: -2 }, temp: { ideopower: -8, approval: 6, freedom: 2 }, tip: 'Experterna suckar högt i radion.' },
      { text: 'FÖRKLARA BÄTTRE OCH RÖSTA IGEN', cost: { money: 400, pp: 10 }, temp: { stability: 3, approval: -3 }, tip: 'Man röstar tills svaret blir rätt.' },
    ],
  },
  {
    id: 'ny_tek_algoritmen', icon: '\u{1F916}', weight: 2,
    title: 'ALGORITMEN STOPPADE BIDRAGEN',
    text: 'Ett självlärande system som skulle hitta bidragsfusk har i två år stoppat utbetalningar till tusentals familjer som gjort allt rätt. Ingen tjänsteman kan förklara varför systemet valde just dem.',
    when: (c) => c.ideo === 'technocracy' && (c.st.welfare > -10 || c.doc === 'expert'),
    choices: [
      { text: 'STÄNG AV SYSTEMET OCH BETALA TILLBAKA', cost: { money: 900 }, perm: { corruption: -3 }, temp: { approval: 4, ideopower: -6 }, tip: 'Dyr rättelse. Billigare än alternativet.' },
      { text: 'RÄTTA MODELLEN I TYSTHET', mod: 'cover_up', temp: { stability: 2 }, tip: 'Felet är borta. Familjernas ilska är det inte.' },
      { text: 'HELA REGERINGEN AVGÅR', cost: { pp: 30 }, perm: { corruption: -5, freedom: 3 }, temp: { stability: -8, approval: 6 }, tip: 'Någon måste ta ansvar. Ingen algoritm gör det.' },
    ],
  },
  {
    id: 'ny_tek_ai_forvaltning', icon: '\u{1F9EE}', weight: 2,
    title: 'AI I FÖRVALTNINGEN',
    text: 'Ett försök där en AI handlägger bygglov har kortat väntetiden från månader till minuter. Nu vill expertrådet låta AI sköta skatteärenden, socialbidrag och tillståndsprövning i hela landet.',
    when: (c) => c.ideo === 'technocracy' && (c.res('education') >= 3 || c.st.research > 20),
    choices: [
      { text: 'AUTOMATISERA ALLA ÄRENDEN', cost: { rp: 60 }, perm: { income: 5, corruption: -4, freedom: -3 }, temp: { unrest: 4 }, tip: 'Snabbt, opartiskt och omöjligt att överklaga.' },
      { text: 'AI FÖRESLÅR, MÄNNISKAN BESLUTAR', cost: { money: 600, rp: 30 }, perm: { income: 2, corruption: -2 }, tip: 'Hälften så snabbt. Dubbelt så tryggt.' },
      { text: 'VÄNTA PÅ UTVÄRDERINGEN', temp: { ideopower: -4, research: -2 }, tip: 'En expertregering som väntar på experter.' },
    ],
  },
  {
    id: 'ny_tek_modellen_fel', icon: '\u{1F4CA}', weight: 2,
    title: 'MODELLEN HADE FEL',
    text: 'Expertregeringens ekonomiska modell förutsade stabil tillväxt. I stället har landet gått in i en lågkonjunktur, och det visar sig att modellen byggde på data från ett helt annat land.',
    when: (c) => c.ideo === 'technocracy' && ((c.ind.gdpgrowth ?? 2) < 1 || c.st.gdp < 0),
    choices: [
      { text: 'ERKÄNN FELET OFFENTLIGT', perm: { corruption: -2 }, temp: { approval: -6, ideopower: -6 }, tip: 'Ärligt. Expertisen tappar sin glans.' },
      { text: 'BYT UT HELA EXPERTGRUPPEN', cost: { pp: 20 }, perm: { research: -2 }, temp: { approval: 3, stability: -3 }, tip: 'Nya experter, nya modeller, samma osäkerhet.' },
      { text: 'SKYLL PÅ OMVÄRLDEN', temp: { ideopower: 3, stability: 2 }, rel: -4, tip: 'Det var ju de andras data.' },
    ],
  },
  {
    id: 'ny_tek_foretagsstyre', icon: '\u{1F3E2}', weight: 2,
    title: 'BOLAGEN VILL STYRA LANDET',
    text: 'Cheferna för landets fem största bolag sitter redan i regeringens råd. Nu föreslår de att näringslivet ska få egna ministerposter, eftersom de ändå skriver de flesta lagförslagen.',
    when: (c) => c.ideo === 'technocracy' && (c.doc === 'corporate' || c.st.corruption > 15),
    choices: [
      { text: 'GE NÄRINGSLIVET MINISTERPOSTER', perm: { gdp: 5, income: 3, corruption: 4, welfare: -3 }, temp: { approval: -4 }, tip: 'Landet drivs som ett bolag. Med avkastningskrav.' },
      { text: 'INFÖR STRIKTA JÄVSREGLER', cost: { pp: 20 }, perm: { corruption: -6 }, temp: { gdp: -3 }, tip: 'Bolagen tar hem sina experter.' },
      { text: 'LÅT RÅDET FÖRBLI RÅDGIVANDE', cost: { pp: 10 }, perm: { corruption: 1 }, temp: { stability: 3 }, tip: 'Formellt rådgivande. Informellt allt annat.' },
    ],
  },
  {
    id: 'ny_tek_pandemimodellen', icon: '\u{1F9A0}', weight: 2,
    title: 'MODELLERNA MOT MAGKÄNSLAN',
    text: 'Ett nytt virus sprider sig och regeringens epidemiologer har tre modeller som pekar åt tre olika håll. Den mest pessimistiska kräver att hela landet stänger redan i morgon.',
    when: (c) => c.ideo === 'technocracy' && (c.mod('epidemic') || c.st.qol < 0 || c.doc === 'scientific'),
    choices: [
      { text: 'STÄNG NER ENLIGT DEN VÄRSTA MODELLEN', cost: { pp: 20 }, perm: { hdi: 2 }, temp: { gdp: -8, freedom: -6, safety: 6 }, tip: 'Säkrast på pappret. Dyrast i verkligheten.' },
      { text: 'RIKTADE RÅD, INGA FÖRBUD', temp: { safety: -4, approval: 3 }, tip: 'Förtroende i stället för tvång. Ett experiment i sig.' },
      { text: 'PUBLICERA ALL DATA ÖPPET', cost: { rp: 30 }, perm: { research: 3, freedom: 2 }, temp: { stability: -3 }, tip: 'Tusen amatörepidemiologer föds över en natt.' },
    ],
  },
  {
    id: 'ny_tek_expertregering', icon: '\u{1F454}', weight: 2,
    title: 'LÅT EXPERTERNA TA ÖVER',
    text: 'Partierna i din koalition har inte kunnat enas om en budget på ett halvår och räntorna stiger. Allt fler kräver en opolitisk regering ledd av en före detta centralbankschef tills läget lugnat sig.',
    when: (c) => c.ideo !== 'technocracy' && c.st.stability < -10 && (c.ind.goveff ?? 0) < 0.5 && c.st.unrest > 0,
    choices: [
      { text: 'GODKÄNN EN EXPERTREGERING', cost: { pp: 30 }, perm: { corruption: -4, gdp: 3 }, temp: { stability: 8, polpower: -10, ideopower: -8 }, tip: 'Teknokraterna kliver in. De brukar inte kliva ut igen.' },
      { text: 'BILDA EN SAMLINGSREGERING', cost: { pp: 20 }, temp: { stability: 5, approval: 3 }, tip: 'Alla partier vid bordet. Ingen får bestämma.' },
      { text: 'UTLYS NYVAL', temp: { stability: -6, freedom: 3 }, tip: 'Låt väljarna reda ut det. Igen.' },
    ],
  },
  {
    id: 'ny_tek_sensorerna', icon: '\u{1F4F9}', weight: 2,
    title: 'SENSORERNA SER ALLT',
    text: 'Huvudstaden har blivit en smart stad där varje gatlykta mäter trafik, buller och folkflöden. Expertrådet vill koppla ihop all data med polisens register för att förutse brott innan de begås.',
    when: (c) => c.ideo === 'technocracy' && !c.is('surveillance', 'none'),
    choices: [
      { text: 'KOPPLA IHOP ALLA DATAKÄLLOR', law: ['surveillance', 'mass'], perm: { safety: 5, income: 2 }, temp: { freedom: -8 }, tip: 'Ett brott som aldrig sker syns aldrig i statistiken.' },
      { text: 'ANONYMISERA ALL DATA', cost: { money: 500, rp: 20 }, perm: { freedom: 3, safety: 2 }, tip: 'Smart stad, diskreta lyktor.' },
      { text: 'STÄNG AV SENSORERNA', temp: { freedom: 3, safety: -3, research: -3 }, tip: 'Gatlyktorna blir vanliga gatlyktor igen.' },
    ],
  },
  {
    id: 'ny_tek_vetenskapsradet', icon: '\u{1F52C}', weight: 2,
    title: 'FORSKARNA VILL HA VETORÄTT',
    text: 'Vetenskapsrådet kräver rätt att stoppa varje lag som strider mot forskningsläget. Universiteten stöder förslaget, men kritikerna påpekar att det ger makt åt människor som ingen har valt.',
    when: (c) => c.ideo === 'technocracy' && (c.doc === 'scientific' || c.st.research > 25),
    choices: [
      { text: 'GE RÅDET VETORÄTT', cost: { pp: 25 }, perm: { research: 6, corruption: -3, freedom: -3 }, temp: { approval: -4 }, tip: 'Lagarna blir bättre underbyggda. Och färre.' },
      { text: 'RÅDET FÅR YTTRA SIG, INTE BESLUTA', perm: { research: 2 }, temp: { ideopower: -3 }, tip: 'Rapporterna blir längre. Ingen läser dem.' },
      { text: 'TILLSÄTT RÅDET SJÄLV', cost: { pp: 15 }, perm: { statepower: 4, corruption: 3 }, temp: { research: -4 }, tip: 'Vetenskapen säger det du vill höra.' },
    ],
  },
  {
    id: 'ny_tek_kunskapsprov', icon: '\u{1F4DD}', weight: 1,
    title: 'KUNSKAPSPROV FÖR RÖSTRÄTT',
    text: 'En tankesmedja nära regeringen föreslår att bara den som klarar ett prov i samhällskunskap ska få rösta. Förslaget har väckt ilska, men har också fått oväntat stöd i mätningarna.',
    when: (c) => c.ideo === 'technocracy' && c.st.freedom < 20,
    choices: [
      { text: 'AVVISA FÖRSLAGET', temp: { freedom: 3, ideopower: -4 }, tip: 'Rösträtten är inget körkort.' },
      { text: 'MER SAMHÄLLSKUNSKAP I SKOLAN', cost: { money: 500 }, perm: { hdi: 2, research: 2 }, tip: 'Bättre väljare i stället för färre.' },
      { text: 'INFÖR PROVET', cost: { pp: 40 }, law: ['elections', 'hybrid'], perm: { statepower: 6 }, temp: { freedom: -10, unrest: 8 }, rel: -6, tip: 'Valdeltagandet halveras. Experterna kallar det kvalitet.' },
    ],
  },

  // ================= KRISTDEMOKRATI =================
  {
    id: 'ny_kd_familjen', icon: '\u{1F46A}', weight: 2,
    title: 'FAMILJEN I CENTRUM',
    text: 'Födelsetalen har sjunkit flera år i rad och partiets familjepolitiker vill göra något stort. Frågan är om stödet ska gå till föräldrar som stannar hemma eller till fler förskoleplatser.',
    when: (c) => c.ideo === 'christdem' && ((c.ind.fert ?? 2) < 2 || c.st.welfare < 0),
    choices: [
      { text: 'DUBBLA BARNBIDRAGET', cost: { money: 1000 }, law: ['popgrowth', 'encouraged'], perm: { welfare: 4, qol: 3 }, temp: { approval: 5 }, tip: 'Alla familjer får mer. Statskassan får mindre.' },
      { text: 'VÅRDNADSBIDRAG TILL HEMMAFÖRÄLDRAR', cost: { money: 600 }, perm: { stability: 2, ideopower: 3, gdp: -2 }, tip: 'Valfrihet, säger partiet. Kvinnofälla, säger oppositionen.' },
      { text: 'FÖRSKOLA TILL ALLA BARN', cost: { money: 800 }, perm: { gdp: 3, qol: 2 }, temp: { ideopower: -4 }, tip: 'Fler i arbete, färre vid köksbordet.' },
      { text: 'SKJUT UPP TILL NÄSTA BUDGET', temp: { approval: -4 }, tip: 'Barnen växer under tiden.' },
    ],
  },
  {
    id: 'ny_kd_kyrkans_omsorg', icon: '\u{26EA}', weight: 2,
    title: 'KYRKAN DRIVER ÄLDREOMSORGEN',
    text: 'Partiet anser att det som kan skötas nära människorna ska skötas där, och församlingar och föreningar driver redan en stor del av äldreomsorgen. Nu vill de ha mer pengar och mer ansvar.',
    when: (c) => c.ideo === 'christdem' && (c.st.welfare < 20 || (c.ind.old ?? 9) > 15),
    choices: [
      { text: 'LÅT FÖRSAMLINGARNA TA ÖVER MER', perm: { income: 3, integration: 2 }, temp: { welfare: -3, ideopower: 4 }, tip: 'Värme och kaffe. Kvaliteten varierar.' },
      { text: 'SAMMA KRAV PÅ ALLA UTFÖRARE', cost: { pp: 15 }, perm: { welfare: 3, corruption: -3 }, tip: 'Tillsyn för alla, även för de goda.' },
      { text: 'STATEN TAR TILLBAKA ANSVARET', cost: { money: 900 }, perm: { welfare: 5 }, temp: { ideopower: -6 }, tip: 'Likvärdigt och byråkratiskt.' },
    ],
  },
  {
    id: 'ny_kd_sondagen', icon: '\u{1F6D2}', weight: 2,
    title: 'SÖNDAGEN SKA VARA VILODAG',
    text: 'Partiets konservativa flygel vill förbjuda butiker att hålla öppet på söndagar så att familjerna får en gemensam vilodag. Handeln protesterar, och många unga extrajobbar just på helgerna.',
    when: (c) => c.ideo === 'christdem' && (c.ind.services ?? 55) > 45,
    choices: [
      { text: 'STÄNG BUTIKERNA PÅ SÖNDAGAR', cost: { pp: 15 }, perm: { stability: 3, qol: 2 }, temp: { gdp: -3, approval: -3 }, tip: 'Lugna söndagar. Fulla lördagar.' },
      { text: 'FRITT FRAM FÖR HANDELN', perm: { gdp: 2 }, temp: { ideopower: -6 }, tip: 'Söndagen blir en vardag som alla andra.' },
      { text: 'ÖPPET, MEN MED HÖGRE SÖNDAGSLÖN', cost: { pp: 10 }, perm: { qol: 2, welfare: 1 }, temp: { gdp: -1 }, tip: 'Den som jobbar på söndagen får åtminstone betalt för det.' },
    ],
  },
  {
    id: 'ny_kd_samvetet', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'SAMVETSFRIHET I VÅRDEN',
    text: 'En barnmorska har sagts upp sedan hon vägrat medverka vid vissa ingrepp av samvetsskäl. Partiet vill lagstifta om samvetsfrihet för vårdpersonal, medan patientförbunden varnar för att vården kan bli ett lotteri.',
    when: (c) => c.ideo === 'christdem' && c.st.freedom > -20,
    choices: [
      { text: 'LAGSTIFTA OM SAMVETSFRIHET', cost: { pp: 20 }, perm: { ideopower: 5, stability: 2, qol: -2 }, temp: { approval: -4 }, tip: 'Personalens samvete vinner. Patienternas valfrihet förlorar.' },
      { text: 'SAMMA REGLER FÖR ALLA I VÅRDEN', temp: { ideopower: -6, approval: 3 }, tip: 'Vården blir förutsägbar. Partiet blir surt.' },
      { text: 'LÅT DOMSTOLEN AVGÖRA', cost: { pp: 10 }, perm: { freedom: 2 }, temp: { stability: -2 }, tip: 'Juristerna får göra politikernas jobb.' },
    ],
  },
  {
    id: 'ny_kd_trossamfunden', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'ETT RÅD FÖR ALLA TROSSAMFUND',
    text: 'Regeringen vill bilda ett råd där landets alla trossamfund samarbetar kring hemlösa, ensamma äldre och nyanlända. Några av partiets egna kyrkor vägrar sitta vid samma bord som de andra.',
    when: (c) => c.ideo === 'christdem' && (c.doc === 'ecumenical' || c.st.integration < 0),
    choices: [
      { text: 'BJUD IN ALLA TROSSAMFUND', cost: { pp: 15 }, perm: { integration: 6, stability: 2 }, temp: { ideopower: -4 }, tip: 'Fler vid bordet, mindre misstro.' },
      { text: 'BARA KRISTNA SAMFUND', perm: { ideopower: 4 }, temp: { integration: -4 }, tip: 'Tryggt för partiet. Kallt för grannarna.' },
      { text: 'ETT SEKULÄRT RÅD UTAN PRÄSTER', perm: { integration: 3, freedom: 2 }, temp: { ideopower: -8 }, tip: 'Neutralt och effektivt. Själlöst, säger kritikerna.' },
    ],
  },
  {
    id: 'ny_kd_medbestammande', icon: '\u{1F91D}', weight: 2,
    title: 'ARBETARNA I STYRELSERUMMET',
    text: 'I den sociala marknadsekonomins anda föreslås att de anställda ska få hälften av platserna i alla stora bolags styrelser. Industrin varnar för långsamma beslut, facket jublar.',
    when: (c) => c.ideo === 'christdem' && (c.doc === 'social' || c.is('unions', 'balanced', 'strong', 'mandatory')),
    choices: [
      { text: 'INFÖR MEDBESTÄMMANDE I STYRELSERNA', cost: { pp: 20 }, law: ['unions', 'strong'], perm: { stability: 4, qol: 2 }, temp: { gdp: -2 }, tip: 'Färre strejker, längre styrelsemöten.' },
      { text: 'LÅT PARTERNA SKÖTA DET SJÄLVA', perm: { factory: 2 }, temp: { stability: 2, ideopower: -3 }, tip: 'Staten håller sig utanför. Som vanligt.' },
      { text: 'AVREGLERA ARBETSMARKNADEN', law: ['unions', 'weak'], perm: { gdp: 4 }, temp: { unrest: 6, ideopower: -6 }, tip: 'Bra för aktiekursen. Sämre för stämningen.' },
    ],
  },
  {
    id: 'ny_kd_koalitionen', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'KOALITIONEN KNAKAR',
    text: 'Ditt liberala samarbetsparti kräver att narkotikabruk avkriminaliseras och hotar annars att fälla regeringen. Dina egna väljare ser frågan som en ren samvetsfråga.',
    when: (c) => c.ideo === 'christdem' && c.harmony < 0.5,
    choices: [
      { text: 'GE EFTER OCH AVKRIMINALISERA', law: ['drugs', 'decriminalized'], perm: { freedom: 3 }, temp: { ideopower: -8, stability: 2 }, tip: 'Regeringen överlever. Partisjälen får sig en törn.' },
      { text: 'BRYT KOALITIONEN', cost: { pp: 30 }, temp: { stability: -8, ideopower: 6 }, tip: 'Ren profil. Ingen majoritet.' },
      { text: 'KOHANDLA OM NÅGOT ANNAT', cost: { pp: 15 }, perm: { welfare: 2 }, temp: { stability: 4, ideopower: -3 }, tip: 'De får sin skolreform, du får ditt barnbidrag.' },
    ],
  },
  {
    id: 'ny_kd_religiosa_skolor', icon: '\u{1F3EB}', weight: 2,
    title: 'SKOLOR MED RELIGIÖS INRIKTNING',
    text: 'Antalet skolor som drivs av trossamfund har fördubblats. Föräldrarna är nöjda, men skolinspektionen undrar om alla elever får samma undervisning i biologi och samhällskunskap.',
    when: (c) => c.ideo === 'christdem' && !c.is('religion', 'statereligion'),
    choices: [
      { text: 'TILLÅT OCH FINANSIERA DEM FULLT UT', perm: { ideopower: 4, stability: 2 }, temp: { integration: -4 }, tip: 'Föräldrarna väljer. Barnen hamnar i olika världar.' },
      { text: 'STOPPA NYA RELIGIÖSA SKOLOR', cost: { pp: 20 }, perm: { integration: 3 }, temp: { ideopower: -6, approval: -3 }, tip: 'Partiets egna skolor får också stopp.' },
      { text: 'SAMMA LÄROPLAN FÖR ALLA SKOLOR', cost: { money: 400 }, perm: { integration: 2, hdi: 1 }, tip: 'Tro på fritiden, fakta på schemat.' },
    ],
  },
  {
    id: 'ny_kd_nytt_parti', icon: '\u{271D}\u{FE0F}', weight: 2,
    title: 'ETT NYTT PARTI FÖR FAMILJEN',
    text: 'Ett kristdemokratiskt parti med fokus på familjen, ensamma äldre och lokalsamhället växer snabbt i ett land där allt färre får barn. Dess ledare fyller församlingshemmen i varje stad.',
    when: (c) => c.ideo !== 'christdem' && (c.ind.fert ?? 2) < 1.5 && c.st.freedom > -20,
    choices: [
      { text: 'TA ÖVER DERAS FAMILJEPOLITIK', cost: { money: 700 }, law: ['popgrowth', 'encouraged'], perm: { welfare: 2 }, temp: { approval: 4 }, tip: 'Den bästa idén är den man lånar.' },
      { text: 'BJUD IN DEM TILL REGERINGEN', cost: { pp: 20 }, perm: { stability: 3 }, temp: { ideopower: -5, approval: 3 }, tip: 'Fler röster. Fler viljor.' },
      { text: 'AVFÄRDA DEM SOM GAMMALDAGS', temp: { ideopower: 3, approval: -3 }, tip: 'De växer bäst när någon skrattar åt dem.' },
    ],
  },
  {
    id: 'ny_kd_kyrkoasyl', icon: '\u{1F56F}\u{FE0F}', weight: 2,
    title: 'FAMILJEN SOM GÖMS I KYRKAN',
    text: 'En församling har gett kyrkoasyl åt en familj som fått avslag och ska utvisas. Prästen säger att samvetet går före lagen, och flera av ditt partis egna ledamöter har besökt familjen.',
    when: (c) => c.ideo === 'christdem' && !c.is('immigration', 'noborders', 'open'),
    choices: [
      { text: 'RESPEKTERA KYRKOASYLET', perm: { integration: 2 }, temp: { statepower: -4, ideopower: 4 }, tip: 'Lagen får vänta utanför kyrkporten.' },
      { text: 'LÅT POLISEN HÄMTA FAMILJEN', cost: { pp: 15 }, temp: { statepower: 5, approval: -6, ideopower: -6 }, tip: 'Lagen följs. Bilderna sprids.' },
      { text: 'PRÖVA ÄRENDET PÅ NYTT', cost: { pp: 10 }, perm: { freedom: 2 }, temp: { stability: 2 }, tip: 'En kompromiss som tar ett år.' },
    ],
  },

  // ================= MILITÄRSTYRE =================
  {
    id: 'ny_mil_generalerna', icon: '\u{1F396}\u{FE0F}', weight: 2,
    title: 'ARMÉN MOT FLYGVAPNET',
    text: 'Militärrådet är splittrat. Arméchefen och flygvapenchefen grälar öppet om budgeten och om vem som ska efterträda dig, och båda har börjat flytta förband närmare huvudstaden.',
    when: (c) => c.ideo === 'stratocracy' && c.harmony < 0.6,
    choices: [
      { text: 'STÄLL DIG BAKOM ARMÉCHEFEN', perm: { milpower: 3 }, temp: { stability: 3, readiness: -4 }, tip: 'Flygvapnet minns. Flygvapnet har plan.' },
      { text: 'DELA BUDGETEN LIKA', cost: { money: 600 }, temp: { stability: 5 }, tip: 'Freden i rådet har ett pris per kvartal.' },
      { text: 'AVSKEDA BÅDA OCH UTSE EN TREDJE', cost: { pp: 30 }, perm: { statepower: 5, corruption: -2 }, temp: { stability: -6, readiness: -5 }, tip: 'En ny general, lojal tills vidare.' },
    ],
  },
  {
    id: 'ny_mil_valloftet', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'LÖFTET OM VAL',
    text: 'När militären tog makten lovades fria val inom två år. Tiden har gått ut, grannländerna kräver en valdag och oppositionen har redan börjat trycka valaffischer.',
    when: (c) => c.ideo === 'stratocracy' && c.day > 200,
    choices: [
      { text: 'HÅLL VALET SOM UTLOVAT', cost: { pp: 25 }, law: ['elections', 'mostlyfree'], perm: { statepower: -4 }, temp: { approval: 8, freedom: 6 }, rel: 8, tip: 'Ett löfte som hålls. Generalerna är nervösa.' },
      { text: 'SKJUT UPP VALET ETT ÅR TILL', temp: { approval: -6, unrest: 6 }, rel: -5, tip: 'Det tredje året är alltid lättast att skjuta upp.' },
      { text: 'HÅLL VAL MED GENERALEN SOM KANDIDAT', cost: { pp: 30 }, law: ['elections', 'hybrid'], mod: 'cult_of_personality', temp: { approval: 3, freedom: -3 }, rel: -3, tip: 'Uniformen byts mot kostym. Makten stannar.' },
    ],
  },
  {
    id: 'ny_mil_civila', icon: '\u{1F4BC}', weight: 2,
    title: 'CIVILA MINISTRAR?',
    text: 'Officerarna som leder ministerierna kan logistik men inte budgetar. Ekonomin krymper och de utländska långivarna vägrar förhandla med någon annan än civila experter.',
    when: (c) => c.ideo === 'stratocracy' && (c.st.gdp < 0 || c.st.income < 0),
    choices: [
      { text: 'UTSE CIVILA EXPERTER TILL EKONOMIN', cost: { pp: 20 }, perm: { gdp: 4, income: 3, corruption: -3 }, temp: { statepower: -5 }, tip: 'Kostymer i korridorerna. Generalerna rynkar på näsan.' },
      { text: 'BEHÅLL OFFICERARNA PÅ ALLA POSTER', perm: { gdp: -2, corruption: 2 }, temp: { stability: 3 }, tip: 'Lojalitet före kompetens, i givakt.' },
      { text: 'CIVILA MINISTRAR UTAN VERKLIG MAKT', cost: { pp: 10 }, temp: { approval: 3 }, rel: 4, tip: 'Fasaden blir civil. Besluten fattas i kasernen.' },
    ],
  },
  {
    id: 'ny_mil_kaptenerna', icon: '\u{1FA96}', weight: 2,
    title: 'KAPTENERNA ÄR MISSNÖJDA',
    text: 'Medan generalerna har fått villor och tjänstebilar har de unga kaptenerna ute vid gränsen inte fått lön på tre månader. Det var precis så den nuvarande regimen själv kom till makten.',
    when: (c) => c.ideo === 'stratocracy' && (c.st.stability < 10 || c.doc === 'praetorian'),
    choices: [
      { text: 'BETALA UT LÖNERNA MED RÄNTA', cost: { money: 700 }, temp: { stability: 6, readiness: 4 }, tip: 'Den billigaste kuppförsäkring som finns.' },
      { text: 'BEFORDRA DE MEST MISSNÖJDA', cost: { pp: 15 }, perm: { corruption: 3 }, temp: { stability: 4 }, tip: 'Nu är de majorer. Och fortfarande hungriga.' },
      { text: 'FÖRFLYTTA DEM LÄNGRE BORT', temp: { stability: -4, readiness: 3 }, tip: 'Långt borta. Tills de kommer tillbaka.' },
    ],
  },
  {
    id: 'ny_mil_sanktioner', icon: '\u{1F6AB}', weight: 2,
    title: 'GRANNARNA STÄNGER GRÄNSERNA',
    text: 'Grannländerna har stängt gränserna för handel och fryst statens konton utomlands tills makten lämnas till civila. Köerna till bensinstationerna växer och reservdelarna till elnätet tar slut.',
    when: (c) => c.ideo === 'stratocracy' && (c.mod('pariah') || c.st.gdp < 10),
    choices: [
      { text: 'SÖK NYA VÄNNER BLAND AUKTORITÄRA STATER', res: { money: 400 }, perm: { corruption: 2 }, temp: { gdp: 3 }, rel: -4, tip: 'De nya vännerna tar betalt i gruvrättigheter.' },
      { text: 'FRIGE DE POLITISKA FÅNGARNA', cost: { pp: 25 }, temp: { statepower: -5, freedom: 5 }, rel: 10, tip: 'En gest som öppnar dörren på glänt.' },
      { text: 'SMUGGLA DET VI BEHÖVER', res: { money: 300 }, perm: { corruption: 5 }, temp: { gdp: 2 }, tip: 'Gränshandlarna har aldrig tjänat så bra.' },
    ],
  },
  {
    id: 'ny_mil_legosoldater', icon: '\u{2694}\u{FE0F}', weight: 2,
    title: 'LEGOSOLDATER ERBJUDER SIG',
    text: 'Ett utländskt säkerhetsbolag erbjuder sig att få slut på upproret i norr. De vill inte ha pengar, bara rätten att bryta guld i området i tjugo år.',
    when: (c) => c.ideo === 'stratocracy' && (c.st.safety < 0 || c.atWar),
    choices: [
      { text: 'TA EMOT ERBJUDANDET', perm: { corruption: 4, income: -3 }, temp: { safety: 6, milpower: 8 }, rel: -8, tip: 'Guldet försvinner ut ur landet. Upproret tystnar, en tid.' },
      { text: 'BYGG UT DEN EGNA ARMÉN', cost: { money: 600, man: 10 }, perm: { milpower: 5, readiness: 3 }, tip: 'Långsammare. Men soldaterna är dina.' },
      { text: 'FÖRHANDLA MED UPPRORSMÄNNEN', cost: { pp: 20 }, temp: { safety: 3, stability: 3, statepower: -4 }, tip: 'En junta som förhandlar. Ovanligt, och klokt.' },
    ],
  },
  {
    id: 'ny_mil_affischerna', icon: '\u{1F5BC}\u{FE0F}', weight: 2,
    title: 'GENERALEN PÅ VARJE AFFISCH',
    text: 'Ditt porträtt i uniform hänger nu i varje skola, butik och busskur. Informationsministeriet vill gå längre och döpa om huvudstadens största torg efter dig.',
    when: (c) => c.ideo === 'stratocracy' && (c.doc === 'caudillo' || c.st.approval > 20),
    choices: [
      { text: 'DÖP OM TORGET', mod: 'cult_of_personality', temp: { approval: 3, freedom: -3 }, tip: 'Ett torg i ditt namn. Tills nästa regim.' },
      { text: 'TA NER PORTRÄTTEN', cost: { pp: 15 }, perm: { corruption: -2 }, temp: { ideopower: -4, approval: 2 }, tip: 'Ödmjukt. Officerarna undrar om du blivit svag.' },
      { text: 'UTNÄMN DIG TILL MARSKALK PÅ LIVSTID', cost: { pp: 25 }, perm: { statepower: 6, ideopower: 4 }, temp: { freedom: -4 }, rel: -6, tip: 'Livstid är en lång tid i den här branschen.' },
    ],
  },
  {
    id: 'ny_mil_officerarna', icon: '\u{1F6A8}', weight: 2,
    title: 'OFFICERARNA HAR TRÖTTNAT',
    text: 'Efter månader av kravaller, regeringskriser och strejker har en grupp högre officerare skrivit ett öppet brev. De kräver att politikerna återställer ordningen, annars gör armén det.',
    when: (c) => ['nationalism', 'populism', 'socialism', 'communism', 'imperialism', 'theocracy', 'monarchism', 'fascism', 'technocracy'].includes(c.ideo) && (c.ind.polstab ?? 0) < -0.8 && c.st.stability < 0,
    choices: [
      { text: 'LÄMNA ÖVER MAKTEN TILL ETT MILITÄRRÅD', law: ['government', 'junta'], perm: { statepower: 8, milpower: 5 }, temp: { freedom: -12, stability: 6 }, rel: -8, tip: 'Ordningen återställs. Frågan är av vem, och för hur länge.' },
      { text: 'GE ARMÉN UNDANTAGSBEFOGENHETER', cost: { pp: 20 }, perm: { statepower: 5, safety: 3 }, temp: { freedom: -8 }, tip: 'Soldater på gatorna, politikerna kvar på papperet.' },
      { text: 'REFORMER FÖR ATT LUGNA LANDET', cost: { money: 900 }, temp: { stability: 6, unrest: -6 }, tip: 'Svaret på kaos är att lösa kaoset. Dyrt men klokt.' },
      { text: 'AVSKEDA BREVSKRIVARNA', cost: { pp: 25 }, temp: { milpower: -6, statepower: 4, stability: -3 }, tip: 'Brevet tystnar. Kasernerna gör det inte.' },
    ],
  },
  {
    id: 'ny_mil_gardet', icon: '\u{1F482}', weight: 2,
    title: 'GARDET BLIR EN STAT I STATEN',
    text: 'Presidentgardet är landets bäst utrustade förband och svarar bara inför dig. Nu driver gardet egna hamnar, hotell och telefonbolag, och den vanliga armén ser med avund på hur gardisterna lever.',
    when: (c) => c.ideo === 'stratocracy' && (c.doc === 'praetorian' || c.st.corruption > 15),
    choices: [
      { text: 'LÅT GARDET BEHÅLLA SINA FÖRETAG', res: { money: 400 }, perm: { corruption: 6, gdp: -2 }, temp: { stability: 3 }, tip: 'Gardet är nöjt. Näringslivet har fått en mycket beväpnad konkurrent.' },
      { text: 'SLÅ IHOP GARDET MED ARMÉN', cost: { pp: 25 }, perm: { readiness: 4, corruption: -2 }, temp: { stability: -6 }, tip: 'Rättvist. Gardisterna är inte förtjusta.' },
      { text: 'GE ARMÉN SAMMA FÖRMÅNER', cost: { money: 800 }, perm: { milpower: 4 }, temp: { stability: 5 }, tip: 'Freden mellan uniformerna köps kontant.' },
    ],
  },
  {
    id: 'ny_mil_kasernerna', icon: '\u{1F4DC}', weight: 2,
    title: 'TILLBAKA TILL KASERNERNA?',
    text: 'Protesterna växer, och ett regionalt förbund erbjuder bistånd och handel om militären lämnar över till en civil övergångsregering. Hälften av militärrådet vill tacka ja, den andra hälften vägrar.',
    when: (c) => c.ideo === 'stratocracy' && (c.st.approval < 0 || c.st.unrest > 15),
    choices: [
      { text: 'TILLSÄTT EN CIVIL ÖVERGÅNGSREGERING', cost: { pp: 30 }, law: ['government', 'authoritarian'], perm: { milpower: -4 }, temp: { approval: 8, unrest: -6 }, rel: 10, tip: 'Ett första steg ut ur kasernen. Det svåraste.' },
      { text: 'SLÅ NER PROTESTERNA', cost: { pp: 20 }, temp: { unrest: -10, freedom: -8, approval: -6 }, rel: -8, tip: 'Tyst på gatorna. Högljutt i omvärlden.' },
      { text: 'LOVA EN NY GRUNDLAG', temp: { unrest: -4, stability: -2 }, tip: 'Ett löfte till. Folk har börjat räkna.' },
    ],
  },
];
