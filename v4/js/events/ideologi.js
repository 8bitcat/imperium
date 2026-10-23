// IMPERIUM V5.6 — HÄNDELSER: IDEOLOGIERNA.
// De fjorton ursprungliga ideologiernas inbyggda dilemman: det som varje lära lovar och det som verkligheten kräver.
export const EVENTS = [

  // ================= LIBERALISM =================
  {
    id: 'ide_lib_surveillance', icon: '\u{1F4F9}', weight: 2,
    title: 'SÄKERHETSPOLISEN VILL SE ALLT',
    text: 'Ett attentat mot centralstationen stoppades i sista stund. Säkerhetspolisen kräver nu rätt att läsa allas meddelanden utan domstolsbeslut. Ditt parti grundades för att staten inte ska göra just det.',
    when: (c) => c.ideo === 'liberalism' && (c.is('surveillance', 'none', 'warrant', 'targeted') || c.st.safety < 10),
    choices: [
      { text: 'GE DEM BEFOGENHETERNA', law: ['surveillance', 'mass'], perm: { safety: 6, freedom: -10 }, temp: { ideopower: -8 }, tip: 'Tryggare. Och lite mindre liberalt för varje dag.' },
      { text: 'TIDSBEGRÄNSAD LAG MED DOMSTOLSKONTROLL', cost: { pp: 20 }, temp: { safety: 5, freedom: -3 }, tip: 'Tillfälliga lagar har en tendens att bli kvar.' },
      { text: 'STÅ FAST — FRIHETEN ÄR INTE TILL SALU', perm: { freedom: 3 }, temp: { safety: -6, approval: -5, ideopower: 8 }, tip: 'Principfast. Nästa gång kanske ingen stoppar dem.' },
    ],
  },
  {
    id: 'ide_lib_monopoly', icon: '\u{1F3E2}', weight: 2,
    title: 'ETT BOLAG ÄGER HELA MARKNADEN',
    text: 'Landets största teknikbolag har köpt upp sina tre sista konkurrenter. Priserna stiger och nya företag får inte plats. Fri marknad, säger bolaget. Ingen marknad alls, säger konkurrensverket.',
    when: (c) => c.ideo === 'liberalism' && (c.is('ownership', 'mixed', 'privatized', 'full') || c.doc === 'right'),
    choices: [
      { text: 'SPLITTRA BOLAGET', cost: { pp: 25 }, perm: { corruption: -4, gdp: 4 }, temp: { income: -5 }, tip: 'Konkurrens måste ibland tvingas fram. Ironiskt nog.' },
      { text: 'MARKNADEN RÄTTAR TILL SIG SJÄLV', perm: { corruption: 5 }, temp: { gdp: 5, approval: -6 }, tip: 'Det gör den. Om några decennier.' },
      { text: 'REGLERA PRISERNA I STÄLLET', temp: { approval: 6, gdp: -5, ideopower: -6 }, tip: 'Bolaget lever vidare, nu som halvstatligt.' },
    ],
  },
  {
    id: 'ide_lib_inequality', icon: '\u{1F4C8}', weight: 2,
    title: 'VINNARNA OCH DE ANDRA',
    text: 'Den fria marknaden har gjort landet rikare än någonsin, men vinsterna hamnar hos ett fåtal. I de gamla industriorterna växer ilskan, och de som förlorat jobben röstar på partier som vill riva allt du byggt.',
    when: (c) => c.ideo === 'liberalism' && ((c.ind.gini ?? 34) > 36 || c.is('welfare', 'little', 'none', 'independent') || c.st.unrest > 15),
    choices: [
      { text: 'BASINKOMST VIA SKATTESYSTEMET', cost: { money: 900 }, perm: { welfare: 6, qol: 4 }, temp: { income: -6 }, tip: 'En liberal idé med en socialistisk prislapp.' },
      { text: 'SATSA PÅ OMSKOLNING OCH UTBILDNING', cost: { money: 600, pp: 10 }, perm: { hdi: 4, research: 3 }, temp: { unrest: -4 }, tip: 'Lika möjligheter, inte lika utfall. Tar en generation.' },
      { text: 'OJÄMLIKHET ÄR PRISET FÖR FRIHET', temp: { gdp: 5, unrest: 8, approval: -6 }, tip: 'Sant i seminarierummet. Svårare i fabriksorten.' },
    ],
  },
  {
    id: 'ide_lib_disinfo', icon: '\u{1F4F1}', weight: 2,
    title: 'LÖGNERNA SPRIDS FORTARE ÄN SANNINGEN',
    text: 'Inför valet sköljer falska nyheter över nätet, många av dem från utlandet. Valmyndigheten vill att du stiftar en lag som tvingar plattformarna att radera osanningar. Frågan är vem som ska avgöra vad som är sant.',
    when: (c) => c.ideo === 'liberalism' && c.is('internet', 'free', 'open', 'filtered'),
    choices: [
      { text: 'LAG MOT DESINFORMATION', cost: { pp: 20 }, law: ['internet', 'filtered'], temp: { stability: 6, freedom: -8, ideopower: -6 }, tip: 'Staten blir sanningsminister. Med goda avsikter, förstås.' },
      { text: 'KÄLLKRITIK PÅ SCHEMAT I VARJE SKOLA', cost: { money: 400 }, perm: { hdi: 2, freedom: 2 }, temp: { stability: -4 }, tip: 'Rätt svar. Hjälper inte till just det här valet.' },
      { text: 'YTTRANDEFRIHETEN ÄR ABSOLUT', temp: { freedom: 5, unrest: 6, stability: -5 }, tip: 'Lögnen får tala fritt. Det gör den gärna.' },
    ],
  },

  // ================= SOCIALDEMOKRATI =================
  {
    id: 'ide_sd_welfare_bill', icon: '\u{1F9FE}', weight: 2,
    title: 'VÄLFÄRDEN KOSTAR MER ÄN SKATTEN GER',
    text: 'Allt fler går i pension och allt färre arbetar. Finansministern visar kurvorna: om ingenting görs räcker skatterna inte till vården, skolan och pensionerna om tio år. Välfärdsstaten behöver en ny grund.',
    when: (c) => c.ideo === 'socialdemocracy' && ((c.ind.old ?? 9) > 15 || (c.ind.debt ?? 57) > 70 || c.st.income < 0),
    choices: [
      { text: 'HÖJ SKATTEN EN GÅNG TILL', cost: { pp: 20 }, perm: { income: 8, gdp: -4 }, temp: { approval: -6 }, tip: 'Det har fungerat förr. Taket närmar sig.' },
      { text: 'HÖJ PENSIONSÅLDERN', cost: { pp: 25 }, perm: { income: 6, manpower: 2 }, temp: { approval: -8, unrest: 5 }, tip: 'Matematiskt självklart. Politiskt plågsamt.' },
      { text: 'LÅNA OCH HOPPAS PÅ TILLVÄXT', res: { money: 800 }, perm: { income: -6 }, temp: { approval: 3 }, tip: 'Barnbarnen får notan, med ränta.' },
    ],
  },
  {
    id: 'ide_sd_union_wage', icon: '\u{1F91D}', weight: 2,
    title: 'FACKET KRÄVER SIN DEL',
    text: 'Fackförbunden har burit din rörelse i hundra år. Nu kräver de rejäla lönelyft, och centralbanken varnar för att priserna skenar och exportjobben försvinner. Samhällskontraktet mellan arbete och kapital knakar.',
    when: (c) => c.ideo === 'socialdemocracy' && (c.is('unions', 'mandatory', 'strong') || (c.ind.infl ?? 3) > 5 || c.harmony < 0.5),
    choices: [
      { text: 'STÖD FACKETS KRAV FULLT UT', temp: { approval: 8, gdp: -5, factory: -4 }, tip: 'Lojalt mot rörelsen. Lönerna växer, priserna med.' },
      { text: 'TRESIDIGT AVTAL: LÅGA LÖNEKRAV MOT BÄTTRE VÄLFÄRD', cost: { money: 700 }, perm: { welfare: 4 }, temp: { unrest: -8, stability: 5 }, tip: 'Klassisk kompromiss. Staten betalar mellanskillnaden.' },
      { text: 'SÄG NEJ — EXPORTEN GÅR FÖRST', cost: { pp: 15 }, temp: { unrest: 10, gdp: 5, ideopower: -8 }, tip: 'Ekonomerna applåderar. Gräsrötterna river sina medlemskort.' },
    ],
  },
  {
    id: 'ide_sd_profit_welfare', icon: '\u{1F3EB}', weight: 2,
    title: 'VINSTER I VÄLFÄRDEN',
    text: 'Privata bolag driver i dag var femte skola och vart tredje äldreboende, betalt med skattepengar. Ett av dem har just delat ut en rekordvinst samtidigt som personalen på boendena larmar om underbemanning.',
    when: (c) => c.ideo === 'socialdemocracy' && (c.is('ownership', 'mixed', 'privatized', 'full') || c.doc === 'reformist'),
    choices: [
      { text: 'FÖRBJUD VINSTUTTAG I SKATTEFINANSIERAD VERKSAMHET', cost: { pp: 25 }, perm: { welfare: 5, corruption: -3 }, temp: { gdp: -4, approval: 3 }, tip: 'Många bolag lämnar. Kommunerna får ta över i all hast.' },
      { text: 'HÅRDARE TILLSYN, MEN BEHÅLL VALFRIHETEN', cost: { money: 500 }, perm: { corruption: -4 }, temp: { approval: 3 }, tip: 'Fler inspektörer, samma system.' },
      { text: 'LÅT DEM VÄXA — DE ÄR BILLIGARE', perm: { income: 5, welfare: -4 }, temp: { ideopower: -8 }, tip: 'Budgeten tackar. Partikongressen gör det inte.' },
    ],
  },

  // ================= KONSERVATISM =================
  {
    id: 'ide_kon_village', icon: '\u{1F3D8}\u{FE0F}', weight: 2,
    title: 'BYGDEN TÖMS',
    text: 'Skolan, affären och bensinmacken har stängt i ännu en by. De unga flyttar till städerna och kvar blir de gamla och kyrkan. Ditt parti talar om tradition och gemenskap. Här håller båda på att försvinna.',
    when: (c) => c.ideo === 'conservatism' && ((c.ind.urban ?? 57) > 60 || c.doc === 'traditionalism' || c.doc === 'national'),
    choices: [
      { text: 'STÖD TILL SERVICE PÅ LANDSBYGDEN', cost: { money: 800 }, perm: { stability: 4, qol: 3 }, temp: { income: -4 }, tip: 'Varje bensinmack kostar som en motorväg. Nästan.' },
      { text: 'FLYTTA MYNDIGHETER UT FRÅN HUVUDSTADEN', cost: { pp: 20 }, perm: { stability: 3, ideopower: 4 }, temp: { research: -4 }, tip: 'Hälften av tjänstemännen säger hellre upp sig än flyttar.' },
      { text: 'LÅT MARKNADEN AVGÖRA VAR FOLK BOR', temp: { gdp: 5, ideopower: -6, approval: -5 }, tip: 'Effektivt. Det gamla landet blir ett vykort.' },
    ],
  },
  {
    id: 'ide_kon_sunday', icon: '\u{1F6D2}', weight: 2,
    title: 'SKA AFFÄRERNA HA ÖPPET PÅ SÖNDAGAR?',
    text: 'De stora butikskedjorna vill få hålla öppet dygnet runt, alla dagar. Näringslivsflygeln i ditt parti jublar. Traditionalisterna, kyrkan och småhandlarna menar att vilodagen är det sista som håller ihop familjerna.',
    when: (c) => c.ideo === 'conservatism' && (c.harmony < 0.6 || c.doc === 'neo' || c.doc === 'liberal'),
    choices: [
      { text: 'TILLÅT FRI ÖPPETTID', perm: { gdp: 3 }, temp: { income: 4, ideopower: -6, stability: -3 }, tip: 'Marknaden vann. Söndagen blev en vardag till.' },
      { text: 'BEHÅLL VILODAGEN', perm: { stability: 3 }, temp: { ideopower: 6, gdp: -3 }, tip: 'Tradition har ett pris. Den här gången var det lågt.' },
      { text: 'LÅT VARJE KOMMUN BESTÄMMA SJÄLV', cost: { pp: 15 }, temp: { stability: 3, approval: 4 }, tip: 'Makten närmare folket. Och problemet hos någon annan.' },
    ],
  },
  {
    id: 'ide_kon_crime', icon: '\u{1F694}', weight: 2,
    title: 'HÅRDARE TAG ELLER KLOKARE TAG?',
    text: 'En våg av skjutningar mellan kriminella gäng har skakat landet. Partiets gräsrötter kräver dubbla straff. Kriminologerna säger att längre straff inte stoppar unga rekryter, och fängelserna är redan fulla.',
    when: (c) => c.ideo === 'conservatism' && ((c.ind.homicide ?? 3) > 4 || c.st.safety < 0 || c.mod('lawless')),
    choices: [
      { text: 'DUBBLA STRAFFEN', law: ['punishments', 'harsh'], perm: { safety: 3, income: -4 }, temp: { approval: 8, freedom: -3 }, tip: 'Populärt, dyrt och delvis verkningslöst.' },
      { text: 'FLER POLISER OCH SOCIALARBETARE', cost: { money: 900 }, perm: { safety: 7 }, temp: { approval: 3 }, tip: 'Långsamt och tråkigt. Det fungerar.' },
      { text: 'FÖRBJUD GÄNGEN SOM ORGANISATIONER', cost: { pp: 20 }, perm: { safety: 4, freedom: -5 }, temp: { statepower: 5 }, tip: 'Rättssäkerheten får sig en törn. Gängen byter namn.' },
    ],
  },

  // ================= DEMOKRATI =================
  {
    id: 'ide_dem_referendum', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'FOLKET HAR TALAT — OCH DET BLEV FEL',
    text: 'En folkomröstning har med knapp marginal beslutat att avskaffa den skatt som finansierar sjukhusen. Alla experter varnar. Ingen lag tvingar dig att följa resultatet, men alla vet vad folket har sagt.',
    when: (c) => c.ideo === 'democracy' && (c.is('government', 'directdemo', 'strongdemo', 'democracy') || c.st.approval < 20),
    choices: [
      { text: 'GENOMFÖR BESLUTET', perm: { income: -6, freedom: 3 }, temp: { approval: 8 }, tip: 'Demokrati är att respektera även dåliga beslut.' },
      { text: 'KÖR ÖVER RESULTATET', cost: { pp: 30 }, perm: { freedom: -5 }, temp: { approval: -12, stability: -4 }, tip: 'Sjukhusen räddas. Tilliten till rösten gör det inte.' },
      { text: 'GENOMFÖR DET GRADVIS OCH FÖRKLARA KONSEKVENSERNA', cost: { pp: 15 }, perm: { income: -3 }, temp: { approval: 3, stability: 3 }, tip: 'Halvvägs är också en väg.' },
    ],
  },
  {
    id: 'ide_dem_turnout', icon: '\u{1F4C9}', weight: 2,
    title: 'BARA VAR TREDJE RÖSTADE',
    text: 'Valdeltagandet är det lägsta sedan allmän rösträtt infördes. De unga och de fattiga stannade hemma. En regering som valts av en tredjedel kan fortfarande styra, men hur länge kan den kalla sig folkets?',
    when: (c) => c.ideo === 'democracy' && (c.st.approval < 15 || (c.ind.voice ?? 0) < 0.5 || c.mod('lost_faith')),
    choices: [
      { text: 'INFÖR RÖSTPLIKT', cost: { pp: 20 }, perm: { stability: 4, freedom: -3 }, temp: { approval: -4 }, tip: 'Alla röstar. Inte alla bryr sig.' },
      { text: 'LOTTADE MEDBORGARRÅD I VARJE REGION', cost: { money: 400, pp: 10 }, perm: { approval: 4, freedom: 2 }, temp: { polpower: -6 }, tip: 'Vanligt folk får makt. Partierna tycker inte om det.' },
      { text: 'RÖSTA MED MOBILEN', cost: { rp: 40 }, temp: { approval: 5, stability: -3, safety: -3 }, tip: 'Lätt att rösta. Lätt att hacka.' },
      { text: 'DE SOM INTE RÖSTAR HAR OCKSÅ VALT', temp: { approval: -5, unrest: 4 }, tip: 'Formellt korrekt. Legitimiteten sipprar ut.' },
    ],
  },
  {
    id: 'ide_dem_minority', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'MAJORITETEN VILL TA BORT EN RÄTTIGHET',
    text: 'Parlamentet har med stor majoritet röstat för att förbjuda minoritetsspråk i myndigheternas kontakter med medborgarna. Författningsdomstolen säger att lagen strider mot grundlagen. Folket står bakom lagen.',
    when: (c) => c.ideo === 'democracy' && (c.doc === 'farright' || c.doc === 'right' || c.is('culture', 'mono') || c.st.integration < 0),
    choices: [
      { text: 'LÅT DOMSTOLEN RIVA LAGEN', perm: { freedom: 5, integration: 4 }, temp: { approval: -8 }, tip: 'Demokrati är mer än att räkna röster.' },
      { text: 'ÄNDRA GRUNDLAGEN SÅ MAJORITETEN BESTÄMMER', cost: { pp: 30 }, perm: { freedom: -8, integration: -6 }, temp: { approval: 6 }, rel: -6, tip: 'Folkviljan vinner. Nästa minoritet kan vara din.' },
      { text: 'KOMPROMISS: TOLK OCH ÖVERSÄTTNING PÅ BEGÄRAN', cost: { money: 300 }, perm: { integration: 2 }, temp: { stability: 3, approval: -3 }, tip: 'Ingen jublar. Ingen protesterar heller.' },
    ],
  },

  // ================= SOCIALISM =================
  {
    id: 'ide_soc_factory', icon: '\u{1F3ED}', weight: 2,
    title: 'ÄGARNA FLYTTAR FABRIKEN',
    text: 'Det sista stora privatägda verket i industristaden ska läggas ner och produktionen flyttas utomlands. Tvåtusen arbetare står utan jobb. Facket kräver att staten tar över, ägarna hotar med internationell skiljedom.',
    when: (c) => c.ideo === 'socialism' && !c.is('ownership', 'nationalized'),
    choices: [
      { text: 'FÖRSTATLIGA FABRIKEN', cost: { money: 800 }, perm: { factory: 4, gdp: -2 }, temp: { approval: 6 }, rel: -8, tip: 'Jobben räddas. Investerarna stryker landet från sina listor.' },
      { text: 'LÅT ARBETARNA TA ÖVER SOM KOOPERATIV', cost: { money: 400 }, perm: { ideopower: 5 }, temp: { factory: -4, approval: 5 }, tip: 'Ägt av dem som jobbar där. Ingen av dem har drivit ett företag.' },
      { text: 'LÅT DEM GÅ', temp: { unrest: 8, ideopower: -8, gdp: 3 }, tip: 'Svårt att förklara på första maj.' },
    ],
  },
  {
    id: 'ide_soc_councils', icon: '\u{270A}', weight: 2,
    title: 'ARBETARRÅDEN VILL BESTÄMMA',
    text: 'På varven och i gruvorna har arbetarna bildat egna råd som vill styra produktionen själva. Planmyndigheten säger att det skapar kaos. Rådens talesperson påminner om att socialism skulle betyda att arbetarna äger sina verk.',
    when: (c) => c.ideo === 'socialism' && (c.doc !== 'authoritarian' || c.st.unrest > 10),
    choices: [
      { text: 'GE RÅDEN VERKLIG MAKT', cost: { pp: 15 }, perm: { freedom: 6, statepower: -6 }, temp: { factory: -5, approval: 6 }, tip: 'Demokrati på arbetsplatsen. Planen får vänta.' },
      { text: 'PARTIET LEDER, RÅDEN RÅDGER', temp: { statepower: 4, approval: -3, ideopower: 3 }, tip: 'Rådgivande organ brukar sluta ge råd ganska snart.' },
      { text: 'UPPLÖS RÅDEN', cost: { pp: 25 }, perm: { statepower: 8, freedom: -8 }, temp: { unrest: 8 }, tip: 'Arbetarnas stat har just förbjudit arbetarna.' },
    ],
  },
  {
    id: 'ide_soc_housing', icon: '\u{1F3D7}\u{FE0F}', weight: 2,
    title: 'TIO ÅRS KÖ TILL EN LÄGENHET',
    text: 'Hyrorna är låga och reglerade, men det byggs nästan ingenting. Den som har en lägenhet behåller den livet ut, och unga familjer bor kvar hos sina föräldrar. Kön till en bostad i huvudstaden är nu tio år lång.',
    when: (c) => c.ideo === 'socialism' && (c.is('housing', 'public', 'rentcontrol') || (c.ind.urban ?? 57) > 65),
    choices: [
      { text: 'STATLIGT MILJONPROGRAM', cost: { money: 1200 }, perm: { qol: 6, welfare: 4 }, temp: { income: -5 }, tip: 'En miljon bostäder på tio år. Alla ser likadana ut.' },
      { text: 'TILLÅT PRIVAT BYGGANDE TILL MARKNADSHYRA', law: ['housing', 'mixed'], perm: { qol: 2 }, temp: { gdp: 4, ideopower: -8 }, tip: 'Det byggs igen. Hyran är en månadslön.' },
      { text: 'BEHÅLL SYSTEMET — KÖN ÄR RÄTTVIS', perm: { gdp: -2 }, temp: { ideopower: 4, qol: -4 }, tip: 'Alla väntar lika länge. Utom de som har rätt kontakter.' },
    ],
  },

  // ================= KOMMUNISM =================
  {
    id: 'ide_kom_plan_paper', icon: '\u{1F4CB}', weight: 2,
    title: 'PLANEN ÄR UPPFYLLD — PÅ PAPPERET',
    text: 'Varje fabrik rapporterar att femårsplanen överträffats med råge. Ändå är hyllorna i butikerna tomma. En ung statistiker har räknat ut att siffrorna blåses upp av direktörer som är rädda för att straffas.',
    when: (c) => c.ideo === 'communism' && (c.harmony < 0.7 || c.st.corruption > 0 || c.is('economic_system', 'central')),
    choices: [
      { text: 'SKICKA UT REVISORER OCH TA FRAM DE RIKTIGA SIFFRORNA', cost: { pp: 20 }, perm: { corruption: -6, gdp: 3 }, temp: { factory: -6, approval: -3 }, tip: 'Sanningen är lägre än planen. Det är en början.' },
      { text: 'SÄNK MÅLEN TILL DET SOM GÅR', perm: { qol: 3 }, temp: { factory: -4, ideopower: -6 }, tip: 'Ärliga mål. Partiet kallar det defaitism.' },
      { text: 'HÖJ MÅLEN — DET GÅR JU SÅ BRA', perm: { corruption: 5 }, temp: { factory: 5, qol: -6, ideopower: 4 }, tip: 'Nästa år blir siffrorna ännu bättre. Och hyllorna ännu tommare.' },
    ],
  },
  {
    id: 'ide_kom_party_shops', icon: '\u{1F6CD}\u{FE0F}', weight: 2,
    title: 'PARTIETS EGNA BUTIKER',
    text: 'Ett fotografi sprids i hemlighet: partifunktionärer handlar importerade varor i en butik som vanligt folk inte får gå in i. Utanför står köerna till brödet. I det klasslösa samhället har en ny klass vuxit fram.',
    when: (c) => c.ideo === 'communism' && (c.st.corruption > 0 || c.doc === 'stalinism' || c.doc === 'leninism'),
    choices: [
      { text: 'STÄNG SPECIALBUTIKERNA', cost: { pp: 25 }, perm: { corruption: -6 }, temp: { statepower: -6, approval: 8 }, tip: 'Folket jublar. Partitopparna börjar planera mot dig.' },
      { text: 'LOJALITET MÅSTE LÖNA SIG', perm: { corruption: 5, statepower: 5 }, temp: { approval: -6 }, tip: 'Apparaten är nöjd. Brödkön minns.' },
      { text: 'GRIP DEN SOM SPRED BILDEN', cost: { pp: 15 }, temp: { freedom: -8, unrest: 6 }, mod: 'cover_up', tip: 'Fotografiet försvinner. Historien om det gör det inte.' },
    ],
  },
  {
    id: 'ide_kom_harvest', icon: '\u{1F33E}', weight: 2,
    title: 'PLANEN SÄGER VETE, JORDEN SÄGER NEJ',
    text: 'Planmyndigheten har beordrat att halva landets åkrar ska sås med en gröda som partiets ledande agronom lovat ska ge dubbla skördar. Bönderna och universitetets forskare varnar för att jorden inte passar.',
    when: (c) => c.ideo === 'communism' && ((c.ind.agri ?? 8) > 5 || c.doc === 'maoism' || c.res('climate') < 3),
    choices: [
      { text: 'LYSSNA PÅ BÖNDERNA OCH FORSKARNA', cost: { pp: 20 }, perm: { research: 3 }, temp: { ideopower: -6 }, tip: 'Vetenskapen vinner. Agronomen tappar sin medalj.' },
      { text: 'PLANEN ÄR VETENSKAPLIG — GENOMFÖR DEN', perm: { research: -3 }, temp: { ideopower: 6, qol: -10, gdp: -6 }, tip: 'Lojaliteten belönas. Skörden gör det inte.' },
      { text: 'LÅT BÖNDERNA SÄLJA SITT ÖVERSKOTT SJÄLVA', temp: { qol: 6, gdp: 4, ideopower: -8 }, tip: 'Torgen fylls av mat. Och av frågor om vad planen är till för.' },
    ],
  },
  {
    id: 'ide_kom_export_revolution', icon: '\u{1F30D}', weight: 2,
    title: 'SKA REVOLUTIONEN EXPORTERAS?',
    text: 'En gerillarörelse i ett avlägset land ber om vapen och rådgivare i revolutionens namn. Hökarna i politbyrån säger att det är din plikt. Ekonomerna påpekar att det här hemma fortfarande saknas traktorer.',
    when: (c) => c.ideo === 'communism' && (c.doc === 'leninism' || c.doc === 'maoism' || c.st.ideopower > 10),
    choices: [
      { text: 'SKICKA VAPEN OCH RÅDGIVARE', cost: { money: 700, man: 5 }, perm: { ideopower: 6 }, rel: -10, tip: 'Revolutionen sprids. Det gör även fiendskapen.' },
      { text: 'SOCIALISM I ETT LAND — BYGG HÄR HEMMA', temp: { ideopower: -5, factory: 4 }, tip: 'Pragmatiskt. Hökarna kallar dig borgerlig.' },
      { text: 'SKICKA LÄKARE OCH LÄRARE I STÄLLET', cost: { money: 400 }, temp: { ideopower: 3 }, rel: 6, tip: 'Solidaritet som även fienden har svårt att kritisera.' },
    ],
  },

  // ================= ANARKISM =================
  {
    id: 'ide_ana_defence', icon: '\u{1F6E1}\u{FE0F}', weight: 2,
    title: 'VEM FÖRSVARAR ETT LAND UTAN ARMÉ?',
    text: 'Grannlandets trupper samlas vid gränsen. Det finns ingen generalstab, ingen värnplikt och ingen som kan ge order. Stormötena diskuterar vad som ska göras medan pansarkolonnerna rullar närmare.',
    when: (c) => c.ideo === 'anarchism' && (c.atWar || c.wars > 0 || c.st.milpower < 10),
    choices: [
      { text: 'FRIVILLIGA MILISER MED VALDA BEFÄL', cost: { man: 8 }, perm: { ideopower: 3 }, temp: { milpower: 8, readiness: 6 }, tip: 'Modiga, frivilliga och dåligt samordnade.' },
      { text: 'INRÄTTA EN TILLFÄLLIG ARMÉ MED KOMMANDOKEDJA', cost: { pp: 20 }, perm: { milpower: 10, statepower: 6, freedom: -6 }, temp: { ideopower: -8 }, tip: 'Tillfälliga arméer brukar vilja bli permanenta.' },
      { text: 'CIVIL OLYDNAD OCH GENERALSTREJK MOT ERÖVRARNA', temp: { milpower: -5, ideopower: 6, factory: -5 }, rel: 6, tip: 'Världen beundrar er. Pansarvagnarna stannar inte för det.' },
    ],
  },
  {
    id: 'ide_ana_consensus', icon: '\u{1F5E3}\u{FE0F}', weight: 2,
    title: 'STORMÖTET KAN INTE BESTÄMMA SIG',
    text: 'Vattenverket i huvudstaden behöver lagas akut, men stormötet har diskuterat saken i tre månader utan att nå konsensus. Varje förslag blockeras av någon. Kranarna har börjat hosta.',
    when: (c) => c.ideo === 'anarchism' && (c.st.stability < 20 || c.harmony > 0.3),
    choices: [
      { text: 'MAJORITETSBESLUT I AKUTA FRÅGOR', cost: { pp: 10 }, temp: { stability: 6, ideopower: -5 }, tip: 'Effektivt. Minoriteten känner sig överkörd.' },
      { text: 'DE SOM GÖR JOBBET FÅR BESTÄMMA', temp: { stability: 4, factory: 4, freedom: -3 }, tip: 'Ingenjörerna lagar vattenverket. Och börjar bestämma över mer.' },
      { text: 'FORTSÄTT TILLS ALLA ÄR ENSE', perm: { freedom: 2 }, temp: { stability: -8, qol: -5 }, tip: 'Principen överlever. Vattnet gör det inte riktigt.' },
    ],
  },
  {
    id: 'ide_ana_justice', icon: '\u{1F465}', weight: 2,
    title: 'ETT BROTT, MEN INGEN DOMSTOL',
    text: 'En man har lurat ett tjugotal grannar på deras sparpengar. Det finns ingen polis och inga domstolar. Bykollektivet vill köra ut honom ur staden, andra kräver ett rättvist förfarande. Men vem ska döma?',
    when: (c) => c.ideo === 'anarchism' && (c.st.safety < 20 || (c.ind.homicide ?? 3) > 2),
    choices: [
      { text: 'FRIVILLIGA MEDLINGSRÅD', cost: { pp: 10 }, perm: { safety: 4 }, temp: { freedom: 3 }, tip: 'Bedragaren och de lurade möts. Det fungerar oftare än man tror.' },
      { text: 'BYSTÄMMAN FÅR DÖMA', temp: { safety: 5, freedom: -6, unrest: 4 }, tip: 'Snabbt och folkligt. Inte alltid rättvist.' },
      { text: 'INGEN HAR RÄTT ATT DÖMA NÅGON', temp: { safety: -8, ideopower: 4 }, tip: 'Renlärigt. Bedragarna har hittat sitt drömland.' },
    ],
  },
  {
    id: 'ide_ana_rich_commune', icon: '\u{1F4A7}', weight: 2,
    title: 'DEN RIKA KOMMUNEN VILL INTE DELA',
    text: 'Kommunen vid kusten har hamnen och kraftverket och har blivit förmögen. Bergsbyarna saknar el och mediciner. Kustborna säger att samarbete ska vara frivilligt. Bergsborna säger att de rika alltid har låtit så.',
    when: (c) => c.ideo === 'anarchism' && (c.doc !== 'ancap' || (c.ind.gini ?? 34) > 32),
    choices: [
      { text: 'TVINGA FRAM EN UTJÄMNING', cost: { pp: 20 }, perm: { welfare: 5, freedom: -5 }, temp: { ideopower: -6 }, tip: 'Rättvist. Men vem gav dig rätt att tvinga?' },
      { text: 'FRIVILLIG HANDEL MELLAN KOMMUNERNA', temp: { gdp: 4, welfare: -4, unrest: 4 }, tip: 'De rika blir rikare. Frivilligt, förstås.' },
      { text: 'ÖVERTYGA DEM PÅ STORMÖTET', cost: { pp: 10 }, temp: { welfare: 3, stability: -3 }, tip: 'Hälften av elen kommer fram. Det är något.' },
    ],
  },

  // ================= POPULISM =================
  {
    id: 'ide_pop_judges', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'DOMSTOLEN STOPPAR DIN REFORM',
    text: 'Högsta domstolen har underkänt din viktigaste reform som grundlagsstridig. Dina anhängare samlas utanför domstolen och kallar domarna en elit som ingen har valt. De väntar på att du ska säga vad som händer nu.',
    when: (c) => c.ideo === 'populism' && (c.st.statepower < 30 || c.is('trials', 'long', 'extended', 'balanced')),
    choices: [
      { text: 'RESPEKTERA DOMEN', perm: { freedom: 3, corruption: -2 }, temp: { approval: -8, ideopower: -5 }, tip: 'Rättsstaten håller. Dina väljare känner sig svikna.' },
      { text: 'BYT UT DOMARNA MOT EGNA', cost: { pp: 30 }, perm: { statepower: 8, corruption: 6, freedom: -8 }, rel: -6, tip: 'Domstolen säger aldrig nej igen. Det var just det som var problemet.' },
      { text: 'UTLYS EN FOLKOMRÖSTNING OM REFORMEN', cost: { money: 500 }, temp: { approval: 8, stability: -5 }, tip: 'Folket mot domarna. Spänningen består.' },
    ],
  },
  {
    id: 'ide_pop_price_cap', icon: '\u{1F4CA}', weight: 2,
    title: 'EXPERTERNA VARNAR, FOLKET JUBLAR',
    text: 'Matpriserna har stigit hela året. Du har lovat ett pristak på mjölk, bröd och bensin. Centralbanken och ekonomerna varnar för tomma hyllor och svarthandel. Dina väljare bryr sig inte om ekonomer.',
    when: (c) => c.ideo === 'populism' && ((c.ind.infl ?? 3) > 4 || c.st.approval < 15 || c.st.qol < 0),
    choices: [
      { text: 'INFÖR PRISTAKET', cost: { money: 600 }, perm: { corruption: 3 }, temp: { approval: 12, factory: -6 }, tip: 'Brödet blir billigt. Om man hittar något.' },
      { text: 'LYSSNA PÅ CENTRALBANKEN', temp: { approval: -8, stability: 5, ideopower: -5 }, tip: 'Ekonomiskt klokt. Politiskt nära nog självmord.' },
      { text: 'SPARKA CENTRALBANKSCHEFEN', cost: { pp: 20 }, law: ['monetary', 'loose'], perm: { corruption: 3 }, temp: { approval: 6 }, rel: -4, tip: 'Pengarna blir billigare. Det blir inte priserna.' },
    ],
  },
  {
    id: 'ide_pop_press', icon: '\u{1F4F0}', weight: 2,
    title: 'DE KALLAR PRESSEN FÖR FOLKETS FIENDE',
    text: 'En tidning har avslöjat att din närmaste rådgivare tagit emot pengar från ett byggbolag. Dina anhängare svarar med en storm av hot mot journalisterna. Alla väntar på vad du säger i kvällens tal.',
    when: (c) => c.ideo === 'populism' && c.is('press', 'full', 'free', 'publicservice', 'laxed', 'mixed', 'oligarch'),
    choices: [
      { text: 'FÖRDÖM HOTEN OCH SPARKA RÅDGIVAREN', cost: { pp: 10 }, perm: { corruption: -3 }, temp: { freedom: 4, approval: -5 }, tip: 'Rätt sak. Rörelsen undrar vems sida du står på.' },
      { text: 'KALLA DET FÖRTAL OCH ELDA PÅ', temp: { approval: 6, freedom: -8, unrest: 5 }, mod: 'scandal', tip: 'Basen jublar. Skandalen växer ändå.' },
      { text: 'DRA IN STÖDET TILL KRITISKA MEDIER', cost: { pp: 20 }, perm: { freedom: -6, statepower: 4 }, rel: -5, tip: 'Granskningen tystnar. Och med den varningssignalerna.' },
    ],
  },

  // ================= NATIONALISM =================
  {
    id: 'ide_nat_history', icon: '\u{1F4DA}', weight: 2,
    title: 'VEM SKRIVER HISTORIEBÖCKERNA?',
    text: 'En regeringskommission föreslår nya läroböcker där nationens segrar får större plats och de mörka kapitlen kortas ner. Historikerna protesterar. Rörelsen säger att barnen behöver något att vara stolta över.',
    when: (c) => c.ideo === 'nationalism' && (c.st.ideopower < 40 || c.doc === 'ethno'),
    choices: [
      { text: 'HJÄLTEBERÄTTELSEN I VARJE KLASSRUM', cost: { pp: 15 }, perm: { ideopower: 6, research: -3 }, rel: -5, tip: 'Stolta barn. Grannländerna känner inte igen historien.' },
      { text: 'HELA HISTORIEN, ÄVEN DET SOM SKAVER', perm: { research: 2, integration: 2 }, temp: { ideopower: -6 }, tip: 'En nation som tål sanningen är starkare. Rörelsen tvivlar.' },
      { text: 'HISTORIKERNA SKRIVER, MEN MED FLER HJÄLTAR', cost: { money: 300 }, temp: { ideopower: 3, stability: 3 }, tip: 'Ett par extra statyer i marginalen.' },
    ],
  },
  {
    id: 'ide_nat_tariffs', icon: '\u{1F3F7}\u{FE0F}', weight: 2,
    title: 'KÖP INHEMSKT',
    text: 'Billiga importvaror slår ut landets sista textilfabriker och stålverk. Rörelsen kräver höga tullar för att skydda nationens arbetare. Handelspartnerna varnar för att de i så fall svarar med samma mynt.',
    when: (c) => c.ideo === 'nationalism' && !c.is('globalism', 'protectionism', 'disengagement', 'isolationist'),
    choices: [
      { text: 'HÖGA TULLAR PÅ IMPORT', law: ['globalism', 'protectionism'], perm: { factory: 5, gdp: -4 }, temp: { approval: 4 }, rel: -8, tip: 'Fabrikerna lever. Allt i butikerna blir dyrare.' },
      { text: 'KAMPANJ FÖR INHEMSKA VAROR, INGA TULLAR', cost: { money: 300 }, temp: { factory: 3, ideopower: 4 }, tip: 'Flaggan på förpackningen säljer. Lite.' },
      { text: 'FRIHANDEL GÖR NATIONEN STARK', temp: { gdp: 5, ideopower: -8, unrest: 4 }, tip: 'Rätt enligt ekonomerna. Fel enligt dina väljare.' },
    ],
  },
  {
    id: 'ide_nat_citizenship', icon: '\u{1FAAA}', weight: 2,
    title: 'VEM ÄR EN AV OSS?',
    text: 'Hundratusentals unga är födda och uppvuxna i landet men har föräldrar som kom från annat håll. Ska de räknas som medborgare? Rörelsen är splittrad mellan dem som ser nationen som ett löfte och dem som ser den som ett arv.',
    when: (c) => c.ideo === 'nationalism' && ((c.ind.netmig ?? 0) > 0 || c.st.immigration > -20 || c.doc === 'civic'),
    choices: [
      { text: 'ALLA SOM ÄR FÖDDA HÄR ÄR MEDBORGARE', perm: { integration: 8, stability: 3 }, temp: { ideopower: -6 }, tip: 'Nationen blir ett löfte. Hårdlinjerna lämnar rörelsen.' },
      { text: 'MEDBORGARSKAP GENOM SPRÅK OCH SAMHÄLLSPROV', cost: { money: 400 }, perm: { integration: 4 }, temp: { ideopower: 3 }, tip: 'Den som vill vara med får vara med. Efter ett prov.' },
      { text: 'BARA GENOM HÄRKOMST', cost: { pp: 20 }, perm: { integration: -8, freedom: -6 }, temp: { unrest: 8, ideopower: 5 }, rel: -8, tip: 'En generation görs till främlingar i sitt eget land.' },
    ],
  },

  // ================= FASCISM =================
  {
    id: 'ide_fas_informers', icon: '\u{1F442}', weight: 2,
    title: 'GRANNE ANGER GRANNE',
    text: 'Statens nya angivarsystem belönar den som rapporterar illojala medborgare. Anmälningarna väller in, men utredarna ser att de flesta handlar om grannfejder, avund och gamla arvstvister. Ingen litar längre på någon.',
    when: (c) => c.ideo === 'fascism' && (c.is('surveillance', 'targeted', 'mass', 'total') || c.st.statepower > 0),
    choices: [
      { text: 'BYGG UT SYSTEMET', law: ['surveillance', 'total'], perm: { statepower: 6, freedom: -10 }, temp: { approval: -6, research: -4 }, tip: 'Rädslan blir statens bästa verktyg. Förtroendet dör.' },
      { text: 'GRANSKA VARJE ANGIVELSE', cost: { pp: 15 }, temp: { statepower: -4, safety: 3 }, tip: 'Några oskyldiga slipper. Systemet står kvar.' },
      { text: 'AVVECKLA SYSTEMET I TYSTHET', cost: { pp: 25 }, perm: { freedom: 5 }, temp: { ideopower: -10, statepower: -6 }, tip: 'Partiet ser det som svaghet. Folket vågar andas igen.' },
    ],
  },
  {
    id: 'ide_fas_scientists', icon: '\u{1F393}', weight: 2,
    title: 'FORSKARNA LÄMNAR LANDET',
    text: 'Universiteten har fått order om att alla lärare ska svära en lojalitetsed till rörelsen. Dussintals av landets främsta forskare har redan tagit tåget över gränsen. Utländska lärosäten tar gärna emot dem.',
    when: (c) => c.ideo === 'fascism' && (c.st.research < 30 || c.is('education', 'strict', 'verystrict', 'authority')),
    choices: [
      { text: 'EDEN GÄLLER ALLA', perm: { research: -8, freedom: -4 }, temp: { ideopower: 6 }, tip: 'Lojala lärare. Tomma laboratorier.' },
      { text: 'UNDANTA FORSKARNA FRÅN EDEN', cost: { pp: 20 }, perm: { freedom: 2 }, temp: { ideopower: -8, research: 5 }, tip: 'Ett hål i muren. Partiet har sett det.' },
      { text: 'STOPPA DEM VID GRÄNSEN', cost: { pp: 25 }, perm: { freedom: -8 }, temp: { research: -4 }, rel: -10, tip: 'Man kan inte tvinga fram tankar. Bara stänga in dem.' },
    ],
  },
  {
    id: 'ide_fas_guns_butter', icon: '\u{2699}\u{FE0F}', weight: 2,
    title: 'KANONER ELLER BRÖD',
    text: 'Generalerna och partiet kräver att fabrikerna ställs om till vapentillverkning. Det betyder ransonering av mat, kläder och bränsle för vanliga familjer. Grannländerna följer upprustningen med växande oro.',
    when: (c) => c.ideo === 'fascism' && (c.doc === 'classical' || c.doc === 'corporatism' || c.st.milpower < 40),
    choices: [
      { text: 'TOTAL UPPRUSTNING', cost: { money: 800 }, perm: { milpower: 8, qol: -8, welfare: -6 }, temp: { readiness: 6 }, rel: -12, tip: 'Arméns lager fylls. Skafferierna töms. Grannarna börjar rusta.' },
      { text: 'BRÖDET FÖRST', temp: { ideopower: -8, approval: 5, milpower: -3 }, tip: 'Familjerna äter. Generalerna glömmer inte.' },
      { text: 'ARBETSPLIKT I RUSTNINGSINDUSTRIN', cost: { pp: 25 }, perm: { factory: 6, freedom: -10, qol: -6 }, temp: { unrest: 8 }, rel: -10, tip: 'Siffrorna stiger. Människorna bakom dem räknas inte.' },
    ],
  },
  {
    id: 'ide_fas_youth', icon: '\u{1F941}', weight: 2,
    title: 'RÖRELSENS UNGDOMSFÖRBUND I VARJE SKOLA',
    text: 'Partiet vill göra sitt ungdomsförbund obligatoriskt för alla barn och lägga ner scoutkårer, idrottsklubbar och körer som inte ansluter sig. Föräldrar och lärare vågar bara protestera i viskningar.',
    when: (c) => c.ideo === 'fascism' && !c.is('education', 'nonecomp', 'freewill'),
    choices: [
      { text: 'GÖR FÖRBUNDET OBLIGATORISKT', law: ['education', 'authority'], perm: { ideopower: 8, freedom: -8 }, mod: 'lost_generation', tip: 'En generation lär sig lyda innan den lär sig tänka.' },
      { text: 'LÅT FÖRENINGSLIVET VARA FRITT', cost: { pp: 20 }, perm: { freedom: 4, qol: 2 }, temp: { ideopower: -8 }, tip: 'Barnen spelar fotboll i stället för att marschera. Partiet rasar.' },
      { text: 'FRIVILLIGT, MEN MED FÖRMÅNER FÖR DEM SOM GÅR MED', cost: { money: 400 }, perm: { freedom: -3, integration: -2 }, temp: { ideopower: 4 }, tip: 'Den som avstår syns. Det är meningen.' },
    ],
  },

  // ================= NATIONALSOCIALISM =================
  {
    id: 'ide_ns_isolation', icon: '\u{1F6AB}', weight: 2,
    title: 'VÄRLDEN VÄNDER DIG RYGGEN',
    text: 'Regimens förföljelse av oliktänkande och minoriteter har fått omvärlden att reagera. Ambassader stängs, handelsavtal sägs upp och landets idrottare portas från internationella tävlingar. Ekonomin märker det redan.',
    when: (c) => c.ideo === 'natsoc',
    choices: [
      { text: 'VI KLARAR OSS SJÄLVA', law: ['globalism', 'isolationist'], perm: { gdp: -8, qol: -6 }, temp: { ideopower: 5 }, mod: 'capital_flight', tip: 'Självförsörjning på papperet. Brist i verkligheten.' },
      { text: 'SMUGGLA VIA MELLANHÄNDER', cost: { money: 600 }, perm: { corruption: 8 }, temp: { gdp: 3 }, rel: -5, tip: 'Varorna kommer in. Mutorna också.' },
      { text: 'ÅTERGE MINORITETERNA DERAS RÄTTIGHETER', cost: { pp: 35 }, perm: { freedom: 10, integration: 6 }, temp: { ideopower: -15, stability: -6 }, rel: 12, tip: 'Det enda som verkligen hjälper. Det rubbar hela regimens grund.' },
    ],
  },
  {
    id: 'ide_ns_exodus', icon: '\u{1F9F3}', weight: 2,
    title: 'LANDET TÖMS PÅ MÄNNISKOR',
    text: 'Läkare, ingenjörer, konstnärer och hela familjer flyr över gränserna, många för att de pekats ut som oönskade, andra för att de vägrar leva under regimen. Grannländerna tar emot dem och fördömer dig öppet.',
    when: (c) => c.ideo === 'natsoc' && (c.st.freedom < 30 || c.st.unrest > 0),
    choices: [
      { text: 'STÄNG GRÄNSERNA FÖR UTRESA', cost: { pp: 25 }, perm: { freedom: -10 }, temp: { unrest: 8 }, rel: -12, tip: 'Ingen kommer ut. Landet har blivit ett fängelse.' },
      { text: 'LÅT DEM GÅ', perm: { research: -6, hdi: -4 }, rel: -6, tip: 'Det de kunde tar de med sig. Det kommer aldrig tillbaka.' },
      { text: 'AMNESTI OCH FULLA RÄTTIGHETER FÖR DEM SOM ÅTERVÄNDER', cost: { pp: 30 }, perm: { freedom: 6, research: 3 }, temp: { ideopower: -12, stability: -5 }, rel: 8, tip: 'Några vågar komma hem. Regimen har erkänt att den hade fel.' },
    ],
  },
  {
    id: 'ide_ns_resistance', icon: '\u{1F4DC}', weight: 2,
    title: 'FLYGBLAD I NATTEN',
    text: 'Studenter, präster och fabriksarbetare har bildat en motståndsrörelse. Varje morgon hittar folk nya flygblad i brevlådorna som berättar det propagandan tiger om. Säkerhetstjänsten vet inte vem som står bakom.',
    when: (c) => c.ideo === 'natsoc' && (c.st.unrest > -10 || c.st.approval < 20),
    choices: [
      { text: 'HÅRDARE TAG MOT MOTSTÅNDET', cost: { pp: 25 }, perm: { freedom: -8 }, temp: { unrest: -8 }, mod: 'martyr', tip: 'Varje gripande ger rörelsen en ny martyr.' },
      { text: 'MER PROPAGANDA', cost: { money: 500 }, perm: { research: -2 }, temp: { ideopower: 5, unrest: -3 }, tip: 'Fler affischer. Färre som tror på dem.' },
      { text: 'LÄTTA PÅ GREPPET', perm: { freedom: 6 }, temp: { unrest: -6, ideopower: -12, stability: -6 }, tip: 'Flygbladen fick rätt. Regimen börjar spricka.' },
    ],
  },

  // ================= IMPERIALISM =================
  {
    id: 'ide_imp_artefacts', icon: '\u{1F3FA}', weight: 2,
    title: 'MUSEET ÄR FULLT AV ANDRAS SKATTER',
    text: 'Nationalmuseets finaste salar visar kronor, statyer och manuskript som togs från erövrade länder för länge sedan. Nu kräver deras regeringar att föremålen lämnas tillbaka, och världspressen följer frågan.',
    when: (c) => c.ideo === 'imperialism' && (c.claims >= 2 || c.st.ideopower > 0),
    choices: [
      { text: 'LÄMNA TILLBAKA ALLT', temp: { ideopower: -8, approval: -3 }, rel: 10, tip: 'Tomma montrar hemma. Öppna dörrar utomlands.' },
      { text: 'BEHÅLL DEM — HÄR ÄR DE SÄKRAST', temp: { ideopower: 5 }, rel: -8, tip: 'Det säger alla museer som har något att förlora.' },
      { text: 'GEMENSAMMA UTSTÄLLNINGAR OCH DELAD FORSKNING', cost: { money: 300, rp: 20 }, perm: { research: 2 }, rel: 5, tip: 'Föremålen reser. Frågan om vem som äger dem står kvar.' },
    ],
  },
  {
    id: 'ide_imp_provinces_vote', icon: '\u{1F4E8}', weight: 2,
    title: 'PROVINSERNA VILL HA RÖSTRÄTT',
    text: 'Invånarna i de erövrade provinserna betalar skatt och tjänstgör i armén men har ingen röst i huvudstaden. Nu kräver de platser i parlamentet. Ger du dem det kan de en dag bli fler än kärnlandets egna ledamöter.',
    when: (c) => c.ideo === 'imperialism' && c.claims >= 2,
    choices: [
      { text: 'FULLA MEDBORGARRÄTTER I HELA RIKET', cost: { pp: 20 }, perm: { integration: 8, stability: 4 }, temp: { ideopower: -8 }, tip: 'Ett rike av medborgare, inte undersåtar. Kärnlandet är nervöst.' },
      { text: 'ETT RÅDGIVANDE PROVINSRÅD', cost: { pp: 10 }, temp: { unrest: -5, integration: 3 }, tip: 'De får tala. Någon annan bestämmer.' },
      { text: 'NEJ, DE ÄR UNDERSÅTAR', temp: { unrest: 10, integration: -6, statepower: 5 }, tip: 'Klart besked. Upproren brukar börja med klara besked.' },
    ],
  },
  {
    id: 'ide_imp_rebellion', icon: '\u{1F525}', weight: 2,
    title: 'UPPROR I DEN YTTERSTA PROVINSEN',
    text: 'Garnisonen i rikets mest avlägsna provins är belägrad av upprorsmän som vill ha självständighet. Förstärkningar tar veckor att skicka. Varje dag som upproret lever inspirerar andra provinser att följa efter.',
    when: (c) => c.ideo === 'imperialism' && (c.claims >= 4 || c.puppets > 0 || c.st.unrest > 15),
    choices: [
      { text: 'SKICKA FÖRSTÄRKNINGAR', cost: { money: 400, man: 10 }, temp: { unrest: -8, stability: 5 }, rel: -6, tip: 'Upproret slås ner. Hatet mot huvudstaden gör det inte.' },
      { text: 'FÖRHANDLA OM SJÄLVSTYRE', cost: { pp: 20 }, temp: { statepower: -6, unrest: -6 }, rel: 6, tip: 'Provinsen stannar kvar, på sina egna villkor.' },
      { text: 'LÅT PROVINSEN SKÖTA SIG SJÄLV', perm: { income: -4 }, temp: { ideopower: -12, approval: -4 }, rel: 8, tip: 'Imperiet krymper. Kärnlandet ser det som ett nederlag.' },
    ],
  },
  {
    id: 'ide_imp_settlers', icon: '\u{1F3D5}\u{FE0F}', weight: 2,
    title: 'NYBYGGARNA OCH DE SOM BODDE DÄR FÖRST',
    text: 'Familjer från kärnlandet har fått billig mark i en erövrad provins. De som bodde där före erövringen ser sina betesmarker inhägnas och sina byar flyttas. Protesterna växer och nybyggarna kräver skydd.',
    when: (c) => c.ideo === 'imperialism' && (c.claims >= 3 || c.st.integration < 10),
    choices: [
      { text: 'SKYDDA NYBYGGARNA MED TRUPPER', perm: { integration: -6 }, temp: { unrest: 8, ideopower: 5, readiness: -4 }, rel: -8, tip: 'Marken är din. Freden är det inte.' },
      { text: 'STOPPA NYBYGGET OCH ERSÄTT DE FÖRDRIVNA', cost: { money: 600 }, perm: { integration: 6 }, temp: { ideopower: -6, approval: -4 }, rel: 5, tip: 'Rättvisa kostar, särskilt i efterhand.' },
      { text: 'DELA MARKEN — GEMENSAMMA BYAR', cost: { pp: 15 }, perm: { integration: 3 }, temp: { unrest: 3 }, tip: 'Grannar på papperet. Vänner om en generation, kanske.' },
    ],
  },

  // ================= TEOKRATI =================
  {
    id: 'ide_teo_epidemic', icon: '\u{1F9A0}', weight: 2,
    title: 'SMITTAN OCH HÖGTIDEN',
    text: 'En smittsam sjukdom sprider sig i städerna just inför årets största högtid. Läkarna vill ställa in alla stora bönesammankomster tills smittan ebbat ut. De skriftlärda svarar att folket aldrig behövt sin tro mer än nu.',
    when: (c) => c.ideo === 'theocracy' && (c.mod('epidemic') || c.st.qol < 10 || (c.ind.doctors ?? 2) < 2),
    choices: [
      { text: 'STÄLL IN SAMMANKOMSTERNA FÖR SMITTANS SKULL', cost: { pp: 20 }, temp: { safety: 6, ideopower: -8 }, tip: 'Läkarna får rätt. De skriftlärda glömmer det inte.' },
      { text: 'TRON SKYDDAR — HÅLL ALLT ÖPPET', temp: { ideopower: 6, safety: -6, hdi: -5 }, mod: 'epidemic', tip: 'Högtiden blir minnesvärd. Sjukhusen också.' },
      { text: 'BÖN UTOMHUS MED AVSTÅND', cost: { money: 300 }, temp: { safety: 3, ideopower: 3 }, tip: 'Kompromissens lilla mirakel.' },
    ],
  },
  {
    id: 'ide_teo_science', icon: '\u{1F52D}', weight: 2,
    title: 'VAD FÅR SKOLAN LÄRA UT?',
    text: 'Universitetets biologer och astronomer vill att skolan undervisar om jordens ålder och livets utveckling som vetenskapen beskriver dem. Det religiösa rådet kräver att de heliga skrifternas berättelse går först.',
    when: (c) => c.ideo === 'theocracy' && !c.is('education', 'nonecomp'),
    choices: [
      { text: 'SKRIFTEN GÅR FÖRST', perm: { research: -6, ideopower: 6 }, temp: { hdi: -3 }, tip: 'Tron står stark. Landets ingenjörer får läsa utomlands.' },
      { text: 'VETENSKAP I SKOLAN, TRO I HEMMET', cost: { pp: 25 }, perm: { research: 6 }, temp: { ideopower: -10, unrest: 6 }, tip: 'En mycket gammal kompromiss som fortfarande väcker ilska.' },
      { text: 'BÅDA BERÄTTELSERNA SIDA VID SIDA', cost: { pp: 10 }, perm: { research: 2 }, temp: { ideopower: -3, stability: 3 }, tip: 'Eleverna får välja själva. Det oroar båda sidor.' },
    ],
  },
  {
    id: 'ide_teo_succession', icon: '\u{1F56F}\u{FE0F}', weight: 1, cooldown: 900,
    title: 'DEN HÖGSTE LÄRAREN ÄR DÖD',
    text: 'Landets andlige ledare har avlidit efter fyrtio år vid makten. Det heliga rådet ska utse en efterträdare och kandidaterna är två: en sträng väktare av läran och en yngre lärd som talar om öppenhet mot omvärlden.',
    when: (c) => c.ideo === 'theocracy' && (c.day > 200 || c.harmony > 0.4),
    choices: [
      { text: 'VÄKTAREN AV LÄRAN', perm: { freedom: -5 }, mod: 'religious_revival', rel: -6, tip: 'Ingenting förändras. Det var ju hela poängen.' },
      { text: 'DEN ÖPPNE REFORMATORN', cost: { pp: 20 }, perm: { freedom: 6, research: 4, ideopower: -6 }, temp: { stability: -6 }, rel: 8, tip: 'Fönstren öppnas. Det drar från alla håll.' },
      { text: 'LÅT DE TROENDE I HELA LANDET RÖSTA', cost: { pp: 25 }, perm: { freedom: 2 }, temp: { approval: 8, ideopower: -4, stability: -4 }, tip: 'Rådet säger att Gud inte väljer genom valurnor. Folket håller inte med.' },
    ],
  },

  // ================= MONARKISM =================
  {
    id: 'ide_mon_regency', icon: '\u{1F451}', weight: 1, cooldown: 900,
    title: 'KUNGEN ÄR DÖD, ARVINGEN ÄR NIO ÅR',
    text: 'Kungen har oväntat avlidit och tronarvingen går fortfarande i skolan. Någon måste styra i arvingens namn tills den blir myndig. Änkedrottningen, kungens ärelystne bror och parlamentet gör alla anspråk på förmyndarskapet.',
    when: (c) => c.ideo === 'monarchism' && (c.day > 150 || c.st.stability < 30),
    choices: [
      { text: 'ÄNKEDROTTNINGEN BLIR FÖRMYNDARE', perm: { stability: 4 }, temp: { approval: 4, statepower: -4 }, tip: 'Trygg och lojal. Utan erfarenhet av att styra.' },
      { text: 'KUNGENS BROR BLIR RIKSFÖRESTÅNDARE', cost: { pp: 20 }, perm: { statepower: 6, corruption: 4 }, temp: { stability: -4 }, tip: 'Han styr väl. Men vill han lämna tillbaka makten om nio år?' },
      { text: 'ETT FÖRMYNDARRÅD UTSETT AV PARLAMENTET', cost: { pp: 15 }, perm: { freedom: 4, statepower: -4 }, temp: { ideopower: -4 }, tip: 'Kollektivt ansvar. Kollektivt långsamt.' },
    ],
  },
  {
    id: 'ide_mon_daughter', icon: '\u{1F478}', weight: 2,
    title: 'DEN FÖRSTFÖDDA ÄR EN DOTTER',
    text: 'Kronprinsparet har fått sitt första barn, en flicka. Enligt den gamla successionsordningen går tronen bara till söner, så en framtida lillebror skulle gå före henne. Kvinnorörelsen och de unga kräver lika tronföljd.',
    when: (c) => c.ideo === 'monarchism' && !c.is('equality', 'full'),
    choices: [
      { text: 'INFÖR LIKA TRONFÖLJD', cost: { pp: 15 }, perm: { freedom: 2 }, temp: { approval: 8, ideopower: -4 }, tip: 'Tusen år av tradition ändras med ett penndrag. Himlen faller inte ner.' },
      { text: 'TRADITIONEN GÄLLER', temp: { ideopower: 5, approval: -6 }, rel: -3, tip: 'Hovet är nöjt. Ingen annan är det.' },
      { text: 'VÄNTA OCH SE — KANSKE BLIR DET INGEN SON', temp: { stability: -3 }, tip: 'Den klassiska kungliga strategin: skjut frågan en generation framåt.' },
    ],
  },
  {
    id: 'ide_mon_costs', icon: '\u{1F3F0}', weight: 2,
    title: 'VAD KOSTAR KUNGAHUSET?',
    text: 'En granskning visar vad hovet egentligen kostar: elva slott, en kunglig jakt, hovstall och hundratals anställda. Samtidigt drar regeringen ner på äldrevården. Republikanerna har aldrig haft så många medlemmar.',
    when: (c) => c.ideo === 'monarchism' && (c.st.approval < 25 || (c.ind.infl ?? 3) > 4 || c.doc === 'constitutional'),
    choices: [
      { text: 'BANTA HOVET OCH SÄLJ TRE SLOTT', res: { money: 400 }, temp: { approval: 6, ideopower: -5 }, tip: 'Kungen bor fortfarande fint. Bara lite mindre.' },
      { text: 'KRONAN ÄR VÄRD VARJE KRONA', temp: { approval: -6, ideopower: 4 }, tip: 'En ordlek som inte övertygar pensionärerna.' },
      { text: 'ÖPPNA SLOTTEN FÖR TURISTER', cost: { money: 300 }, perm: { income: 3 }, temp: { ideopower: -3, approval: 3 }, tip: 'Kungligheter som sevärdhet. Det betalar sig faktiskt.' },
    ],
  },
  {
    id: 'ide_mon_veto', icon: '\u{2712}\u{FE0F}', weight: 2,
    title: 'KUNGEN VÄGRAR SKRIVA UNDER',
    text: 'Parlamentet har antagit en lag som kungen anser strider mot hans samvete, och han vägrar att underteckna den. Formellt har han rätt att göra så. I praktiken har ingen monark gjort det på hundra år.',
    when: (c) => c.ideo === 'monarchism' && (c.doc === 'constitutional' || c.is('government', 'constmonarchy', 'democracy', 'strongdemo', 'mixed')),
    choices: [
      { text: 'PARLAMENTET HAR SISTA ORDET', perm: { freedom: 4, statepower: -3 }, temp: { ideopower: -6 }, tip: 'Kungen undertecknar till slut. Tronen blir lite mer dekorativ.' },
      { text: 'KUNGENS VETO GÄLLER', cost: { pp: 20 }, perm: { statepower: 6, freedom: -5 }, temp: { unrest: 6, approval: -4 }, tip: 'Tronen har talat. Parlamentet kallar det en författningskris.' },
      { text: 'FÖRKLARA KUNGEN OFÖRMÖGEN ATT REGERA I ETT DYGN', cost: { pp: 10 }, temp: { stability: 3, ideopower: -3 }, tip: 'Lagen undertecknas, samvetet räddas och juristerna skakar på huvudet.' },
    ],
  },
];
