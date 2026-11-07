// IMPERIUM V5.21 MYNDIGHETERNA — HÄNDELSER: SKATTEN, POLISEN, VÅRDEN, FÖRSVARET OCH GENERALDIREKTÖRERNA.
// Henry önskade: "lägg även till myndigheter! Minst 10 för varje land, som du själv bestämmer budgeten för
// och dess namn och logga". Spelaren styr nu i fliken MYNDIGHETER: varje myndighets budget (NEDLAGD 0,
// SVÄLTFÖDD 1, SNÅL 2, NORMAL 3, GENERÖS 4, STOR 5, ENORM 6), namn, logga och generaldirektör (skicklighet
// 1-5), och kan grunda nya och lägga ner gamla. Händelserna graderas på c.myn: antal myndigheter (count,
// open, closed), hur många som har mer eller mindre än normal budget (big, cut), generaldirektörernas snitt
// (skill), hela budgeten i % av den normala (spend) och budgetnivån för spelarens första myndighet av varje
// slag (kinds.<slag>, -1 = ingen sådan, 0 = nedlagd).
// Fältet myn: '<slag>' | 'any' = händelsen gäller spelarens myndighet av det slaget, och when frågar då
// c.myn.kinds.<slag> >= 1 (any: c.myn.open >= 1). Platshållare: {myndighet}/{MYNDIGHET} = myndighetens
// namn, som kan vara på landets eget språk, och {slag} = vad den gör. Valen kan ändra myndighetens budget
// (mynBudget: ±N, 1-6, lägger aldrig ner), byta generaldirektör (mynChef: true), göra chefen skickligare
// eller sämre (mynSkill: ±N) och lägga ner myndigheten (mynStang: true).
// Avsnitten:
//   skatten och pengarna   skattesystemet som kraschar, stjärnans skattefint, miljarderna, statistiken
//                          som ministern inte gillar, revisorerna som hittar slöseriet
//   ordningen              rekordbeslaget, polischefen som vill ha mer makt, polisen som inte kommer,
//                          landet utan polis, säkerhetstjänsten som vill läsa allt, mullvaden, fångflykten
//   försvar och kris       kängorna som löstes upp, jaktplanen, stormvarningen, översvämningen utan ledning
//   välfärden              vaccinet, sjukhusdatorn, bidragsligan, pensionerna, lärarbristen, provresultaten,
//                          högen med ärenden hos migrationen
//   landet                 bron, e-legitimationen, satelliten, grodan, inspektörerna, elen i vinter,
//                          omräkningen, medietillsynen
//   generaldirektörerna    intervjun, budet från utlandet, studieresan
//   kuriosa                loggan, katten, rapporten om kortare rapporter
//   hela staten            strejken, staten som växer, huset som står tomt, staten som fungerar
// Grundtanken: en svältfödd myndighet får köer, krascher och personal som slutar, en enorm får slöseri,
// maktbegär och övervakning, och en nedlagd lämnar ett hål som någon annan måste fylla.
// Familjevänligt: ingen beskrivs skadad; "förd till förhör och släppt" är gränsen.
export const EVENTS = [

  // ===== SKATTEN OCH PENGARNA =====
  {
    id: 'myn_skatt_itkrasch', icon: '\u{1F4BB}', weight: 2, cooldown: 900, kind: 'skatt', myn: 'skatt',
    title: 'DEKLARATIONEN SOM KRASCHADE',
    text: 'Två dagar före sista dagen för deklarationen lade datorsystemet hos {myndighet} av. Fyra miljoner hushåll får ett felmeddelande, telefonkön är sex timmar lång och en handläggare i {stad} tar emot deklarationer på papper i en skokartong. Systemet är tjugo år gammalt och har lappats ihop varje vår sedan dess.',
    when: (c) => c.myn.kinds.skatt >= 1 && c.myn.kinds.skatt <= 3 && (c.myn.kinds.skatt <= 2 || c.res('computing') < 3) && c.day > 60,
    choices: [
      { text: 'KÖP ETT NYTT DATORSYSTEM', cost: { money: 200 }, mynBudget: 1, temp: { approval: 1 }, ind: { trustgov: 1 }, next: 'myn_skatt_nya_systemet', tip: 'Nytt system, nya konsulter och nya löften. Det brukar gå bra. Ibland.' },
      { text: 'SKJUT UPP SISTA DAGEN EN MÅNAD', temp: { income: -2, approval: 2 }, griev: -2, tip: 'Alla får en månad till. Pengarna kommer också en månad senare.' },
      { text: 'SKYLL PÅ GENERALDIREKTÖREN', cost: { pp: 4 }, mynChef: true, temp: { approval: 1, stability: -1 }, ind: { trustgov: -1 }, tip: 'En ny chef på måndag. Datorn är lika gammal på tisdag.' },
    ],
  },
  {
    id: 'myn_skatt_nya_systemet', icon: '\u{1F5A5}\u{FE0F}', chain: true, myn: 'skatt',
    title: 'DET NYA SKATTESYSTEMET',
    text: 'Konsulterna som bygger det nya systemet åt {myndighet} är klara med fas ett av fem. Fas ett bestod av att ta fram en logga för projektet. Budgeten är redan överskriden med en tredjedel och projektledaren vill ha mer tid. Samtidigt säger de anställda att provversionen faktiskt är snabb och lätt att använda.',
    choices: [
      { text: 'BETALA OCH LÅT DEM BLI KLARA', cost: { money: 180 }, perm: { income: 1 }, ind: { trustgov: 1 }, tip: 'Dyrt och sent, men det fungerar. Det är mer än de flesta it-projekt kan säga.' },
      { text: 'LÅT MYNDIGHETENS EGNA TEKNIKER TA ÖVER', cost: { money: 60 }, mynSkill: 1, tip: 'Teknikerna känner det gamla systemet bättre än någon konsult.',
        risk: { chance: 0.6,
          win: { text: 'De egna teknikerna blir klara före jul. Konsulterna skickar en blomma.', perm: { income: 1 }, temp: { research: 1 } },
          lose: { text: 'Teknikerna drunknar i gammal kod. Systemet blir halvfärdigt.', temp: { income: -2 } } } },
      { text: 'AVBRYT ALLTIHOP', temp: { approval: -1, income: -1 }, tip: 'Den gamla datorn får en ny fläkt. Den har klarat tjugo vårar, den klarar en till.' },
    ],
  },
  {
    id: 'myn_skatt_stjarnan', icon: '\u{26BD}', weight: 2, cooldown: 1000, kind: 'skatt', myn: 'skatt',
    title: 'STJÄRNANS SKATTEFINT',
    text: 'Landets mest kända fotbollsspelare är skriven i en fyr på en ö med elva invånare, där skatten är lägst i landet. {myndighet} har räknat ut att han aldrig satt sin fot där och kräver honom på tolv miljoner. Fansen har startat en insamling, och hans advokat säger att fyren har "ett stort känslomässigt värde".',
    when: (c) => c.myn.kinds.skatt >= 2 && c.st.corruption > 0 && (c.ind.taxevasion ?? 10) > 4 && c.day > 90,
    choices: [
      { text: 'LÅT {MYNDIGHET} DRIVA FALLET HELA VÄGEN', res: { money: 60 }, temp: { approval: -1 }, perm: { corruption: -1 }, ind: { trustgov: 1 }, tip: 'Han betalar till slut. Fansen tycker att staten är snål. Alla andra tycker att det var rätt.' },
      { text: 'GÖR UPP I GODO', res: { money: 30 }, temp: { approval: 1 }, tip: 'Halva summan, och en bild där han skakar hand med generaldirektören.' },
      { text: 'TÄPP TILL KRYPHÅLET FÖR ALLA', cost: { pp: 8 }, perm: { income: 1, corruption: -1 }, griev: 2, tip: 'Fyrar, båtar och hundkojor räknas inte längre som bostad.' },
      { text: 'LÅT HONOM VARA, HAN ÄR EN NATIONALHJÄLTE', temp: { approval: 2 }, perm: { corruption: 1 }, ind: { trustgov: -1 }, tip: 'Alla med en fyr i släkten börjar skriva sig där.' },
    ],
  },
  {
    id: 'myn_skatt_miljarderna', icon: '\u{1F4B0}', weight: 2, cooldown: 1100, myn: 'skatt',
    title: 'SKATTEGRANSKARNA HITTAR MILJARDER',
    text: 'En grupp unga granskare på {myndighet} har kört alla bolagsdeklarationer från de senaste fem åren genom ett nytt program. Resultatet: flera miljarder i skatt som aldrig betalats, de flesta från tre stora koncerner. Koncernerna säger att de bara följt sina rådgivare. Granskarna vill ha resurser för att driva alla fall samtidigt.',
    when: (c) => c.myn.kinds.skatt >= 4 && c.day > 120,
    choices: [
      { text: 'GE GRANSKARNA ALLT DE BEHÖVER', cost: { money: 80 }, mynBudget: 1, perm: { income: 2, corruption: -1 }, tip: 'Det tar två år. Sedan kommer pengarna, och fler än någon räknat med.' },
      { text: 'GÖR EN SNABB UPPGÖRELSE', res: { money: 250 }, temp: { approval: 1 }, tip: 'En tredjedel av summan, direkt i kassan. Koncernerna andas ut.' },
      { text: 'LÅT BOLAGEN VARA, DE SKAPAR JOBB', temp: { gdp: 1 }, perm: { corruption: 2 }, mynSkill: -1, ind: { trustgov: -2 }, tip: 'De bästa granskarna söker andra jobb. Två av dem hamnar hos koncernernas rådgivare.' },
    ],
  },
  {
    id: 'myn_statistik_pinsam', icon: '\u{1F4CA}', weight: 2, cooldown: 1000, myn: 'statistik',
    title: 'SIFFRAN SOM MINISTERN INTE GILLAR',
    text: 'I morgon publicerar {myndighet} kvartalets siffror, och de är pinsamma: arbetslösheten har stigit, tvärtemot allt regeringen lovat. Ekonomiministern föreslår att man "räknar på ett annat sätt" i år, till exempel genom att inte räkna med dem som letat jobb längre än ett år. Generaldirektören vill veta var du står.',
    when: (c) => c.myn.kinds.statistik >= 1 && c.trend('unemp') > 0 && c.day > 90,
    choices: [
      { text: 'SIFFRORNA SKA PUBLICERAS SOM DE ÄR', temp: { approval: -2 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, tip: 'En dålig dag i tidningarna. Ett land som vet att siffrorna stämmer.' },
      { text: 'RÄKNA PÅ ETT ANNAT SÄTT', temp: { approval: 2 }, perm: { corruption: 2 }, mynSkill: -1, next: ['myn_statistik_lackan', null], tip: 'Arbetslösheten sjunker över en natt. Ingen har fått ett jobb.' },
      { text: 'BYT TILL EN MEDGÖRLIG GENERALDIREKTÖR', cost: { pp: 8 }, mynChef: true, temp: { statepower: 2, approval: 1 }, perm: { corruption: 2 }, ind: { trustgov: -2 }, next: 'myn_statistik_lackan', tip: 'Den nya chefen förstår vad landet behöver. Det gör statistikerna också.' },
    ],
  },
  {
    id: 'myn_statistik_lackan', icon: '\u{1F4C1}', chain: true, kind: 'frihet', myn: 'statistik',
    title: 'STATISTIKERNA SÄGER IFRÅN',
    text: 'Fyrtio statistiker på {myndighet} har skrivit ett öppet brev: de har räknat om kvartalets siffror på det gamla sättet, och arbetslösheten steg. Brevet har publicerats av tre tidningar och översatts av utländska ekonomer. Kreditinstituten undrar nu vilka andra siffror från {rike} som inte stämmer.',
    choices: [
      { text: 'ERKÄNN OCH PUBLICERA DE RIKTIGA SIFFRORNA', cost: { pp: 8 }, temp: { approval: -3 }, perm: { corruption: -2 }, griev: -3, ind: { trustgov: 2 }, tip: 'Det svider. Men nästa gång tror folk på siffrorna igen.' },
      { text: 'GÖR STATISTIKEN OBEROENDE I LAG', cost: { pp: 12 }, mynSkill: 1, perm: { corruption: -2, stability: 1 }, griev: -5, ind: { trustgov: 3 }, tip: 'Ingen minister får någonsin ringa statistikerna igen. Inte ens du.' },
      { text: 'FÖRFLYTTA DE FYRTIO', temp: { statepower: 1, approval: -2 }, perm: { corruption: 1 }, griev: 5, rel: -2, ind: { trustgov: -3 }, tip: 'De räknar fyrar längs kusten nu. Omvärlden räknar också, på sitt sätt.' },
    ],
  },
  {
    id: 'myn_revision_sloseri', icon: '\u{1F50D}', weight: 2, cooldown: 1000, myn: 'revision',
    title: 'REVISORERNA HITTAR SLÖSERIET',
    text: 'I sin årsrapport har {myndighet} gått igenom hur staten använder pengarna. Ett ministerium har fjorton tjänstebilar som inte körts på tre år, ett annat betalar hyra för ett kontor som ingen flyttat in i och ett tredje har köpt en chokladfontän "för representation". Totalt rör det sig om hundratals miljoner.',
    when: (c) => c.myn.kinds.revision >= 2 && c.day > 100,
    choices: [
      { text: 'GENOMFÖR ALLA REVISORERNAS FÖRSLAG', cost: { pp: 8 }, res: { money: 120 }, perm: { corruption: -2 }, tip: 'Bilarna säljs, kontoret sägs upp och chokladfontänen hamnar på ett museum.' },
      { text: 'GE {MYNDIGHET} FLER REVISORER', cost: { money: 60 }, mynBudget: 1, perm: { corruption: -2 }, ind: { trustgov: 1 }, tip: 'Varje revisor hittar mer än sin egen lön. Det är en bra affär.' },
      { text: 'BEHÅLL CHOKLADFONTÄNEN', temp: { approval: -1 }, perm: { corruption: 1 }, tip: 'Den används vid ett enda mottagande per år. Ett mycket uppskattat mottagande.' },
    ],
  },

  // ===== ORDNINGEN =====
  {
    id: 'myn_polis_beslag', icon: '\u{1F4E6}', weight: 2, cooldown: 900, kind: 'trygghet', myn: 'polis',
    title: 'REKORDBESLAGET',
    text: 'Efter två års spaning har {myndighet} slagit till mot en lagerlokal utanför {stad}: rekordmycket narkotika, sex lastbilar och en båt som stod på en släpvagn mitt i skogen. Fjorton personer har förts till förhör. Polischefen vill hålla presskonferens i dag, och hon vill att du står bredvid.',
    when: (c) => c.myn.kinds.polis >= 3 && c.crimeRise > 0.95 && c.st.corruption < 30 && c.day > 60,
    choices: [
      { text: 'STÅ BREDVID PÅ PRESSKONFERENSEN', temp: { approval: 3 }, ind: { policetrust: 3, feelsafe: 2 }, tip: 'Bilden på dig och båten i skogen hamnar på alla förstasidor.' },
      { text: 'GE POLISEN PENGAR TILL NÄSTA STORA FALL', cost: { money: 120 }, mynBudget: 1, perm: { safety: 1 }, griev: -3, ind: { drugcrime: -8, gangs: -5 }, tip: 'Spanarna får fler bilar och mer tid. De som sitter i förhör pratar redan.' },
      { text: 'LÅT POLISEN TA ÄRAN', temp: { stability: 1 }, griev: -2, ind: { policetrust: 2 }, tip: 'Du skickar en tårta till spanarna. De har inte ätit ordentligt på två år.' },
    ],
  },
  {
    id: 'myn_polis_makt', icon: '\u{1F46E}', weight: 2, cooldown: 1000, kind: 'frihet', myn: 'polis',
    title: 'POLISCHEFEN VILL HA MER MAKT',
    text: 'Chefen för {myndighet} har en lista: kameror med ansiktsigenkänning på alla torg, rätt att visitera vem som helst i utsatta områden och tillgång till bankernas register utan domstolsbeslut. "Med det här halverar vi brottsligheten på två år", säger hon. Juristerna på justitiedepartementet har blivit bleka.',
    when: (c) => c.myn.kinds.polis >= 4 && c.day > 90,
    choices: [
      { text: 'GE HENNE ALLT HON BER OM', cost: { pp: 12 }, law: ['surveillance', 'facial'], temp: { safety: 3, freedom: -4 }, griev: 8, ind: { crimeidx: -10, feelsafe: 3 }, tip: 'Brotten minskar. Det gör också antalet människor som vågar demonstrera.' },
      { text: 'BARA MED DOMSTOLSBESLUT', cost: { pp: 6 }, law: ['surveillance', 'warrant'], temp: { safety: 1 }, griev: -2, ind: { policetrust: 2 }, tip: 'Hon får en del av listan, och en domare som läser den.' },
      { text: 'NEJ, OCH BYT CHEF', cost: { pp: 6 }, mynChef: true, temp: { freedom: 1, stability: -1 }, griev: -3, tip: 'Den nya chefen har ingen lista. Än.' },
      { text: 'NEJ TACK', temp: { freedom: 1 }, ind: { policetrust: -1 }, tip: 'Polischefen säger att hon respekterar beslutet. Hon har sparat listan.' },
    ],
  },
  {
    id: 'myn_polis_svalt', icon: '\u{260E}\u{FE0F}', weight: 3, cooldown: 800, kind: 'trygghet', myn: 'polis',
    title: 'INGEN POLIS KOMMER',
    text: 'Efter nedskärningarna har {myndighet} bara en patrull för hela {stad} på nätterna. Den som ringer om ett inbrott får vänta till nästa vecka, och en kiosk har rånats fyra gånger av samma person, som numera hälsar på ägaren. Grannar har börjat patrullera själva med ficklampor och gula västar.',
    when: (c) => c.myn.kinds.polis >= 1 && c.myn.kinds.polis <= 2,
    choices: [
      { text: 'ÅTERSTÄLL POLISENS BUDGET', cost: { money: 200 }, mynBudget: 2, griev: -6, ind: { feelsafe: 4, burglary: -10 }, tip: 'Patrullerna kommer tillbaka. Kioskägaren får äntligen semester.' },
      { text: 'STÖD GRANNARNAS PATRULLER', cost: { money: 30 }, temp: { safety: 1, stability: -1 }, griev: -2, tip: 'Gula västar och ficklampor. Det hjälper lite, och det är bättre än inget.' },
      { text: 'SÄG ATT BROTTEN MINSKAR', temp: { approval: -2 }, griev: 6, ind: { burglary: 10, feelsafe: -4, policetrust: -3 }, tip: 'De minskar i statistiken. Ingen anmäler ju längre.' },
    ],
  },
  {
    id: 'myn_polis_nedlagd', icon: '\u{1F6A8}', weight: 3, cooldown: 700, kind: 'trygghet',
    title: 'VEM SVARAR NÄR MAN RINGER?',
    text: 'Sedan polisen lades ned går samtalen till larmnumret till en telefonsvarare. I {stad} har butikerna anställt egna vakter, en gata har byggt en grind och en granne i ett villaområde kallar sig numera "sheriffen". Det fungerar ganska bra för dem som har råd. Alla andra låser dörren två gånger.',
    when: (c) => c.myn.kinds.polis === 0,
    choices: [
      { text: 'LÅT ARMÉN PATRULLERA GATORNA', cost: { pp: 10 }, temp: { safety: 3, freedom: -3, statepower: 2 }, griev: -3, tip: 'Soldater i varje gathörn. Det är tryggt, och det känns inte tryggt.' },
      { text: 'TILLÅT PRIVATA VAKTBOLAG ÖVERALLT', temp: { safety: 1, qol: -1 }, perm: { corruption: 1 }, griev: 4, ind: { feelsafe: -2 }, tip: 'Den som betalar blir skyddad. Den som inte betalar får en broschyr.' },
      { text: 'LÅT KOMMUNERNA ANSTÄLLA ORDNINGSVAKTER', cost: { money: 150 }, temp: { safety: 2 }, griev: -4, ind: { feelsafe: 3 }, tip: 'Det är nästan en polis. Den har bara inte samma namn.' },
    ],
  },
  {
    id: 'myn_sakerhet_las_allt', icon: '\u{1F441}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet', myn: 'sakerhet',
    title: 'DE VILL LÄSA ALLAS MEDDELANDEN',
    text: '{myndighet} har lämnat ett förslag till regeringen: alla meddelandeappar ska bygga in en bakdörr så att säkerhetstjänsten kan läsa vad som helst, när som helst. "Vi letar bara efter spioner", skriver generaldirektören. Apparnas ägare hotar att lämna landet, och juristerna kallar förslaget "en nyckel till varje brevlåda i landet".',
    when: (c) => c.myn.kinds.sakerhet >= 3 && c.day > 90,
    choices: [
      { text: 'GENOMFÖR FÖRSLAGET', cost: { pp: 12 }, law: ['surveillance', 'mass'], temp: { statepower: 3, freedom: -4, stability: 1 }, griev: 9, ind: { pressfree: -3, trustgov: -2 }, tip: 'Säkerhetstjänsten läser allt. Folk börjar skriva vykort igen.' },
      { text: 'BARA EFTER BESLUT AV EN DOMSTOL', cost: { pp: 6 }, law: ['surveillance', 'warrant'], temp: { stability: 1 }, griev: -2, tip: 'En domare per meddelande. Det tar tid, och det är meningen.' },
      { text: 'AVSLÅ, OCH STRAMA ÅT {MYNDIGHET}', mynBudget: -1, temp: { freedom: 2, statepower: -1 }, griev: -4, ind: { pressfree: 1 }, tip: 'Generaldirektören tar det personligt. Det är inte personligt.' },
    ],
  },
  {
    id: 'myn_sakerhet_mullvad', icon: '\u{1F575}\u{FE0F}', weight: 2, cooldown: 1200, myn: 'sakerhet',
    title: 'EN MULLVAD I SÄKERHETSTJÄNSTEN',
    text: 'En vänligt sinnad utländsk underrättelsetjänst har varnat dig: någon inne på {myndighet} har i flera år lämnat ut hemligheter till {land}. De vet inte vem. Det kan vara en av fyrtio personer med rätt behörighet, och en av dem är generaldirektörens närmaste medarbetare. Generaldirektören vill sköta jakten själv.',
    when: (c) => c.myn.kinds.sakerhet >= 1 && c.day > 150,
    choices: [
      { text: 'LÅT GENERALDIREKTÖREN JAGA I TYSTHET', temp: { stability: 1 }, next: 'myn_sakerhet_mullvaden_fast', tip: 'Fyrtio personer får var sin falsk hemlighet. Den som lämnar ut sin avslöjar sig.' },
      { text: 'TILLSÄTT EN UTOMSTÅENDE UTREDARE', cost: { pp: 8 }, perm: { corruption: -1 }, next: 'myn_sakerhet_mullvaden_fast', tip: 'Utredaren litar inte på någon. Det är därför hon fick jobbet.' },
      { text: 'BYT UT HELA LEDNINGEN', cost: { pp: 10 }, mynChef: true, temp: { stability: -2, statepower: -1 }, tip: 'Mullvaden kanske försvann. Det gjorde också allt de gamla cheferna visste.' },
    ],
  },
  {
    id: 'myn_sakerhet_mullvaden_fast', icon: '\u{1F345}', chain: true, myn: 'sakerhet',
    title: 'MULLVADEN ÄR AVSLÖJAD',
    text: 'Mullvaden på {myndighet} var en stillsam arkivarie som arbetat där i tjugotvå år, odlade tomater och aldrig tog semester. Han avslöjades av en falsk hemlighet om en ubåt som inte finns, har förts till förhör och erkänner allt. {land} säger att de aldrig hört talas om honom, men byter gärna honom mot två av sina egna.',
    choices: [
      { text: 'BYT HONOM MOT DERAS TVÅ', rel: 2, temp: { stability: 1, approval: 1 }, tip: 'Utbytet sker på en bro i gryningen. Det är precis lika filmiskt som det låter.' },
      { text: 'ÅTALA HONOM OFFENTLIGT', cost: { pp: 6 }, temp: { statepower: 2, approval: 2 }, rel: -3, tip: 'Rättegången blir lång. Han pratar mest om tomater.' },
      { text: 'ANVÄND HONOM FÖR ATT LURA {LAND}', cost: { pp: 8 }, mynSkill: 1, temp: { readiness: 2 }, rel: -1, tip: 'Han fortsätter att skicka hemligheter. Nu är det du som skriver dem.' },
    ],
  },
  {
    id: 'myn_kriminalvard_rymning', icon: '\u{1F95E}', weight: 2, cooldown: 900, kind: 'trygghet', myn: 'kriminalvard',
    title: 'RYMNINGEN I TVÄTTVAGNEN',
    text: 'En fånge har rymt från anstalten utanför {stad} genom att gömma sig i en vagn med smutstvätt. {myndighet} hittade honom efter två dygn hemma hos hans mamma, där han åt pannkakor och tittade på tv. Han sa att han "bara ville äta riktig mat en gång". Han är tillbaka i cellen, men det är den tredje rymningen i år.',
    when: (c) => c.myn.kinds.kriminalvard >= 1 && c.myn.kinds.kriminalvard <= 3 && c.day > 60,
    choices: [
      { text: 'BÄTTRE SKYDD PÅ ALLA ANSTALTER', cost: { money: 120 }, mynBudget: 1, temp: { safety: 1 }, griev: -3, ind: { prisonocc: -5 }, tip: 'Nya grindar, nya kameror och en ny rutin för tvätten.' },
      { text: 'BÄTTRE MAT PÅ ANSTALTERNA', cost: { money: 30 }, temp: { approval: -1, stability: 1 }, tip: 'Rymningarna minskar. Kvällstidningarna skriver om pannkakor på anstalterna.' },
      { text: 'BYT GENERALDIREKTÖR', cost: { pp: 5 }, mynChef: true, temp: { approval: 1 }, tip: 'Den nya chefen läser rapporten om tvättvagnen och skakar på huvudet.' },
      { text: 'DET VAR EN ENGÅNGSHÄNDELSE', temp: { approval: -1 }, griev: 3, tip: 'Det var den tredje engångshändelsen i år.' },
    ],
  },

  // ===== FÖRSVAR OCH KRIS =====
  {
    id: 'myn_forsvar_kangor', icon: '\u{1F97E}', weight: 2, cooldown: 1000, kind: 'forsvar', myn: 'forsvar',
    title: 'KÄNGORNA SOM LÖSTES UPP I REGNET',
    text: '{myndighet} har köpt fyrtiotusen par kängor av en leverantör som ingen hört talas om. Vid första övningen i regn löste sularna upp sig, och soldaterna fick gå tillbaka till kasernen i strumplästen. Det visar sig att leverantören ägs av en kusin till en officer på upphandlingsenheten. Pressen har fått tag på fakturan.',
    when: (c) => c.myn.kinds.forsvar >= 3 && c.st.corruption > 0 && c.day > 90,
    choices: [
      { text: 'GRANSKA ALLA UPPHANDLINGAR', cost: { money: 60, pp: 6 }, perm: { corruption: -2 }, ind: { trustgov: 1 }, tip: 'Kängorna var bara början. Det finns också hjälmarna.' },
      { text: 'BYT GENERALDIREKTÖR OCH KÖP NYA KÄNGOR', cost: { money: 100 }, mynChef: true, temp: { readiness: 1 }, perm: { corruption: -1 }, griev: -2, tip: 'Nya kängor från en känd tillverkare. De klarar regn. Det står på lådan.' },
      { text: 'TYST, DET HÄR ÄR EN SÄKERHETSFRÅGA', temp: { readiness: -1, approval: -1 }, mod: 'cover_up', griev: 3, tip: 'Det är svårt att hemligstämpla fyrtiotusen par blöta strumpor.' },
    ],
  },
  {
    id: 'myn_forsvar_jaktplan', icon: '\u{2708}\u{FE0F}', weight: 2, cooldown: 1200, kind: 'forsvar', myn: 'forsvar',
    title: 'GENERALEN VILL HA NYA JAKTPLAN',
    text: 'Chefen för {myndighet} har lagt fram en plan: fyrtio jaktplan av den senaste modellen, till ett pris som motsvarar alla landets skolor i två år. "Utan dem står vi försvarslösa i luften om tio år", säger generaldirektören. Finansministern har lagt ansiktet i händerna. Tre länder vill sälja, och alla erbjuder sig att bygga en fabrik i {stad}.',
    when: (c) => c.myn.kinds.forsvar >= 4 && c.day > 150,
    choices: [
      { text: 'KÖP ALLA FYRTIO', cost: { money: 500 }, perm: { milpower: 3, readiness: 2 }, temp: { approval: -2 }, griev: -4, next: 'myn_forsvar_jaktplanen_sena', tip: 'Fyrtio plan och en fabrik. Leveransen är beräknad till om fem år.' },
      { text: 'KÖP TJUGO OCH UPPGRADERA DE GAMLA', cost: { money: 250 }, perm: { milpower: 2 }, temp: { readiness: 1 }, next: ['myn_forsvar_jaktplanen_sena', null], tip: 'En kompromiss som ingen general gillar och ingen finansminister hatar.' },
      { text: 'NEJ, OCH SKÄR NER PÅ {MYNDIGHET}', mynBudget: -1, res: { money: 80 }, temp: { approval: 1, readiness: -2 }, griev: 4, tip: 'Pengarna går till skolorna. Generalerna skriver insändare.' },
      { text: 'VÄNTA ETT ÅR TILL', temp: { readiness: -1 }, tip: 'Planen läggs i en låda. Den kommer tillbaka nästa år med ett högre pris.' },
    ],
  },
  {
    id: 'myn_forsvar_jaktplanen_sena', icon: '\u{1F4C6}', chain: true, kind: 'forsvar', myn: 'forsvar',
    title: 'JAKTPLANEN ÄR FÖRSENADE',
    text: 'Tillverkaren meddelar {myndighet} att de nya jaktplanen blir två år försenade och en fjärdedel dyrare. Det beror på "oförutsedda utmaningar" med en mjukvara, en motor och en fabrik som inte är byggd än. Piloterna har redan gått utbildningen, i en simulator, och flyger nu de gamla planen igen.',
    choices: [
      { text: 'BETALA MERPRISET', cost: { money: 200 }, perm: { milpower: 2 }, griev: -2, tip: 'Planen kommer. Senare och dyrare, som alltid.' },
      { text: 'KRÄV SKADESTÅND', cost: { pp: 6 }, res: { money: 120 }, temp: { readiness: -1 }, rel: -1, tip: 'Juristerna jobbar i tre år. Tillverkaren betalar till slut, i reservdelar.' },
      { text: 'SÄG UPP AVTALET', res: { money: 60 }, temp: { readiness: -2, approval: 1 }, rel: -2, griev: 3, tip: 'En del av pengarna kommer tillbaka. Försvaret börjar om från början.' },
    ],
  },
  {
    id: 'myn_kris_storm', icon: '\u{1F32A}\u{FE0F}', weight: 2, cooldown: 900, kind: 'kris', myn: 'kris',
    title: 'STORMVARNINGEN',
    text: 'Meteorologerna på {myndighet} varnar för den kraftigaste stormen på trettio år. Den kan nå kusten vid {stad} i morgon kväll, eller dra förbi ute till havs. Generaldirektören vill skicka ett sms till alla mobiler, stänga skolorna och flytta folk från husen närmast stranden. Det kostar, och om stormen vänder blir folk arga.',
    when: (c) => c.myn.kinds.kris >= 1 && c.day > 30,
    choices: [
      { text: 'GÖR ALLT GENERALDIREKTÖREN VILL', cost: { money: 80 }, griev: -3, tip: 'Hellre en onödig natt i en gympasal än en natt i ovisshet.',
        risk: { chance: 0.5,
          win: { text: 'Stormen slår till precis där den skulle. Alla var i säkerhet, och folk tackar.', temp: { approval: 4, stability: 2 } },
          lose: { text: 'Stormen drar förbi till havs. Folk satt i gympasalar i onödan och är sura.', temp: { approval: -2 } } } },
      { text: 'BARA SMS:ET', tip: 'Alla vet. Var och en bestämmer själv. Några bestämmer fel.',
        risk: { chance: 0.6,
          win: { text: 'Folk tar varningen på allvar och bär in trädgårdsmöblerna. Det går bra.', temp: { stability: 1 } },
          lose: { text: 'Stormen tar tak och båtar längs kusten. Ingen kom till skada, men skadorna är stora.', temp: { gdp: -1, qol: -1 }, griev: 4 } } },
      { text: 'GE {MYNDIGHET} PENGAR TILL SKYDDSVALLAR', cost: { money: 250 }, mynBudget: 1, perm: { safety: 1, stability: 1 }, tip: 'Vallarna blir klara efter stormen. Men till nästa storm står de på plats.' },
    ],
  },
  {
    id: 'myn_kris_nedlagd', icon: '\u{1F30A}', weight: 3, cooldown: 800, kind: 'kris',
    title: 'ÖVERSVÄMNINGEN SOM INGEN LEDDE',
    text: 'Floden har svämmat över norr om {stad}, och det finns ingen myndighet som samordnar. Räddningstjänsten väntar på besked från kommunen, kommunen väntar på regeringen och regeringen letar efter telefonnumret till någon som vet. Under tiden har en pensionerad brandchef tagit kommandot med en megafon från sin roddbåt.',
    when: (c) => c.myn.kinds.kris === 0,
    choices: [
      { text: 'GE BRANDCHEFEN FULLMAKT', temp: { stability: 1, approval: 2 }, griev: -3, tip: 'Han samordnar allt från roddbåten. Det fungerar förvånansvärt bra.' },
      { text: 'SKICKA IN ARMÉN', cost: { pp: 6 }, temp: { stability: 2, readiness: -1 }, griev: -5, tip: 'Soldaterna fyller sandsäckar i tre dygn. Det gör de bra.' },
      { text: 'LÅT KOMMUNERNA LÖSA DET', temp: { approval: -3, qol: -1 }, griev: 6, tip: 'Tre kommuner, tre planer och en flod som inte bryr sig om kommungränser.' },
    ],
  },

  // ===== VÄLFÄRDEN =====
  {
    id: 'myn_halsa_vaccin', icon: '\u{1F489}', weight: 2, cooldown: 1000, kind: 'valfard', myn: 'halsa',
    title: 'VACCINET RÄCKER INTE',
    text: 'Inför vintern har {myndighet} beställt vaccin mot influensan, men tillverkaren levererar bara hälften. Resten har sålts till länder som betalade mer. Äldreboendena ringer varje dag, apoteken har satt upp lappar om att vaccinet är slut och en minister har redan fått frågan om hon själv har blivit vaccinerad.',
    when: (c) => c.myn.kinds.halsa >= 1 && c.myn.kinds.halsa <= 4 && (c.mod('epidemic') || c.st.hdi < 0) && c.day > 60,
    choices: [
      { text: 'KÖP RESTEN DYRT PÅ VÄRLDSMARKNADEN', cost: { money: 200 }, temp: { hdi: 1, approval: 1 }, griev: -4, rel: -1, tip: 'Vaccinet kommer. Ett fattigare land får vänta en månad till.' },
      { text: 'DE ÄLDSTA OCH SJUKASTE FÖRST', temp: { approval: -1, stability: 1 }, griev: 2, tip: 'Ordningen är rättvis. Den som står sist i kön tycker ändå inte det.' },
      { text: 'BYGG EN EGEN VACCINFABRIK', cost: { money: 300, pp: 6 }, mynBudget: 1, perm: { research: 1, hdi: 1 }, temp: { approval: -1 }, tip: 'Klar om tre år. Nästa vinter blir lika knapp, men vintern därpå blir bättre.' },
    ],
  },
  {
    id: 'myn_halsa_it', icon: '\u{1F4CB}', weight: 2, cooldown: 1000, myn: 'halsa',
    title: 'SJUKHUSEN SKRIVER PÅ PAPPER',
    text: 'I går morse slocknade datorsystemet som {myndighet} använder för journaler, recept och tidsbokning. Läkarna skriver på papper och springer med pärmar i korridorerna, och apoteken kan inte se några recept. Teknikerna vet inte vad som hänt. Ett äldre biträde på sjukhuset i {stad} är den enda som minns hur pappersjournalerna fungerade.',
    when: (c) => c.myn.kinds.halsa >= 1 && c.res('computing') <= 3 && c.day > 120,
    choices: [
      { text: 'SKICKA IN ALLA TEKNIKER LANDET HAR', cost: { money: 100 }, temp: { stability: 1 }, next: 'myn_halsa_it_orsaken', tip: 'Tekniker från banker, flygbolag och spelföretag. Alla har en teori.' },
      { text: 'GÖR BITRÄDET TILL NATIONELL SAMORDNARE', temp: { approval: 2 }, next: 'myn_halsa_it_orsaken', tip: 'Hon har ett system med färgade gem. Det fungerar bättre än någon vågar säga.' },
      { text: 'GE {MYNDIGHET} ETT NYTT SYSTEM PÅ STUDS', cost: { money: 220 }, mynBudget: 1, temp: { hdi: -1 }, perm: { research: 1 }, tip: 'Det nya systemet är modernt. Ingen har hunnit testa det.' },
    ],
  },
  {
    id: 'myn_halsa_it_orsaken', icon: '\u{1F50C}', chain: true, myn: 'halsa',
    title: 'SÅ HÄNDE DET MED SJUKHUSDATORN',
    text: 'Utredningen är klar. Haveriet på {myndighet} började när en städare i serverhallen drog ur en kontakt för att dammsuga, och reservsystemet visade sig ha varit avstängt sedan en budgetöversyn för sex år sedan. Ingen märkte något. Städaren har bett om ursäkt i tv, och folk har skickat blommor till honom.',
    choices: [
      { text: 'BYGG RIKTIGA RESERVSYSTEM', cost: { money: 150 }, perm: { stability: 1, hdi: 1 }, tip: 'Två serverhallar, två elnät och en skylt: DRA INTE UR SLADDEN.' },
      { text: 'GE STÄDAREN EN MEDALJ FÖR ÄRLIGHET', temp: { approval: 2 }, tip: 'Den första medaljen någonsin för att ha dammsugit. Ingen annan erkände något.' },
      { text: 'BYT GENERALDIREKTÖR', cost: { pp: 5 }, mynChef: true, temp: { approval: 1 }, perm: { corruption: -1 }, tip: 'Den nya chefen börjar med att läsa alla budgetöversyner. Det tar en vecka.' },
    ],
  },
  {
    id: 'myn_social_fusk', icon: '\u{1F40E}', weight: 2, cooldown: 1000, kind: 'valfard', myn: 'social',
    title: 'BIDRAGSLIGAN',
    text: 'Utredare på {myndighet} har avslöjat ett nätverk som i fem år fått barnbidrag för sexhundra barn som inte finns. Alla barnen var skrivna på samma tre adresser, och ett av dem var enligt registret 147 år gammalt. Pengarna har gått till bilar och en tävlingshäst. Fjorton personer har förts till förhör.',
    when: (c) => c.myn.kinds.social >= 1 && c.day > 90,
    choices: [
      { text: 'BYGG EN EGEN ENHET MOT FUSK', cost: { money: 100 }, mynBudget: 1, perm: { corruption: -1 }, ind: { fraud: -10 }, tip: 'Enheten hittar fusket. Den hittar också felen i myndighetens egna register.' },
      { text: 'STRAMA ÅT KONTROLLEN FÖR ALLA', temp: { welfare: -1, approval: -1 }, perm: { corruption: -1 }, griev: 4, tip: 'Alla föräldrar ska visa upp sina barn. Det tar tid, men barnen tycker att det är roligt.' },
      { text: 'SÄLJ TÄVLINGSHÄSTEN', res: { money: 30 }, temp: { approval: 2 }, tip: 'Hästen vinner sitt första lopp för den nya ägaren. Staten får tillbaka en liten del.' },
    ],
  },
  {
    id: 'myn_social_sena', icon: '\u{1F4EC}', weight: 3, cooldown: 800, kind: 'valfard', myn: 'social',
    title: 'PENSIONERNA KOM INTE',
    text: 'För första gången på femtio år betalade {myndighet} inte ut pensionerna i tid. Det fanns för få handläggare för att hinna med, och en gammal dator gav upp mitt i körningen. Två miljoner pensionärer fick ingenting på utbetalningsdagen. Köerna utanför kontoren är långa, och en pensionärsförening har hyrt bussar till {huvudstad}.',
    when: (c) => c.myn.kinds.social >= 1 && c.myn.kinds.social <= 2,
    choices: [
      { text: 'BETALA UT MED RÄNTA OCH ÅTERSTÄLL BUDGETEN', cost: { money: 220 }, mynBudget: 2, temp: { approval: 1 }, griev: -8, tip: 'Pensionärerna får en hundralapp extra. De tackar men har inte glömt.' },
      { text: 'BE OM URSÄKT I TV', cost: { pp: 4 }, temp: { approval: 1 }, griev: -3, tip: 'Ursäkten sänds på eftermiddagen. Det är då pensionärerna tittar.' },
      { text: 'SKYLL PÅ DATORN', temp: { approval: -3, stability: -1 }, griev: 7, tip: 'Datorn har inga väljare. Det har pensionärerna.' },
    ],
  },
  {
    id: 'myn_skola_lararbrist', icon: '\u{1F9F9}', weight: 3, cooldown: 800, kind: 'valfard', myn: 'skola',
    title: 'INGEN LÄRARE I KLASSRUMMET',
    text: 'Var femte lärartjänst står tom sedan budgeten för {myndighet} skars ner. I {stad} har en femteklass haft elva olika vikarier sedan jul, och en av dem var skolans vaktmästare, som lärt barnen allt om ventilationssystem. Föräldrarna har bildat en förening och kräver att någon gör något.',
    when: (c) => c.myn.kinds.skola >= 1 && c.myn.kinds.skola <= 2,
    choices: [
      { text: 'HÖJ LÄRARLÖNERNA', cost: { money: 220 }, mynBudget: 2, temp: { approval: 2 }, griev: -6, tip: 'Lärare som slutat kommer tillbaka. Några hade blivit konsulter och saknade barnen.' },
      { text: 'SNABBUTBILDA NYA LÄRARE PÅ ETT HALVÅR', cost: { money: 80 }, temp: { research: -1 }, griev: -2, tip: 'Lärare på ett halvår. Barnen lär sig. Lärarna lär sig ännu mer.' },
      { text: 'STÖRRE KLASSER, FÄRRE LÄRARE', temp: { approval: -2, hdi: -1 }, griev: 6, tip: 'Trettiofem elever i varje klassrum. Vaktmästaren får fler att undervisa.' },
    ],
  },
  {
    id: 'myn_skola_resultat', icon: '\u{1F4DA}', weight: 2, cooldown: 1100, myn: 'skola',
    title: 'DE BÄSTA PROVRESULTATEN PÅ LÄNGE',
    text: 'De nationella proven som {myndighet} rättar är klara, och eleverna har aldrig läst och räknat bättre. Skolorna i {stad} har gått från botten till toppen på fem år. Lärarna säger att det beror på mindre klasser och mer tid till varje elev. Utländska delegationer ringer och vill komma på studiebesök.',
    when: (c) => c.myn.kinds.skola >= 4 && c.day > 200,
    choices: [
      { text: 'BJUD IN LÄRARNA TILL EN FEST', cost: { money: 30 }, temp: { approval: 2, stability: 1 }, tip: 'Lärarna dansar på regeringens gräsmatta. Rektorerna står vid kaffet och pratar scheman.' },
      { text: 'TA EMOT DELEGATIONERNA', temp: { approval: 1 }, rel: 2, tip: 'De vill se klassrummen, matsalen och lärarrummet. Mest lärarrummet.' },
      { text: 'SATSA ÄNNU MER PÅ SKOLAN', cost: { money: 200 }, mynBudget: 1, perm: { research: 1, hdi: 1 }, tip: 'Om tjugo år är de här barnen forskare, läkare och ingenjörer. Några blir journalister.' },
    ],
  },
  {
    id: 'myn_migration_hogen', icon: '\u{1F4C2}', weight: 3, cooldown: 800, kind: 'migration', myn: 'migration',
    title: 'HÖGEN MED OBEHANDLADE ÄRENDEN',
    text: 'Hos {myndighet} ligger nittiotusen ärenden och väntar: asyl, uppehållstillstånd och medborgarskap. Handläggarna är för få och datorerna långsamma. En ingenjör i {stad} har väntat på sitt arbetstillstånd så länge att företaget som ville anställa honom har flyttat utomlands. Kommunerna vet inte hur många de ska planera för.',
    when: (c) => c.myn.kinds.migration >= 1 && (c.myn.kinds.migration <= 2 || c.migRate > 1.2),
    choices: [
      { text: 'ANSTÄLL FLER HANDLÄGGARE', cost: { money: 150 }, mynBudget: 1, perm: { integration: 1 }, griev: -4, tip: 'Högen krymper med tusen ärenden i veckan. Ingenjören får sitt tillstånd, för sent.' },
      { text: 'SNABBSPÅR FÖR DEM SOM HAR ETT JOBB', cost: { pp: 6 }, temp: { gdp: 1, integration: 1 }, griev: -2, tip: 'Den som har ett jobb väntar en vecka. Alla andra väntar lite längre.' },
      { text: 'LÅT HÖGEN LIGGA', temp: { integration: -2, stability: -1 }, griev: 5, ind: { segreg: 2 }, tip: 'Den som väntar på ett beslut får inte jobba, och blir aldrig riktigt en del av landet.' },
    ],
  },

  // ===== LANDET =====
  {
    id: 'myn_trafik_bron', icon: '\u{1F309}', weight: 2, cooldown: 1000, kind: 'ekonomi', myn: 'trafik',
    title: 'BRON MED SPRICKORNA',
    text: 'Inspektörerna på {myndighet} har hittat sprickor i den stora bron vid {stad}, och den har stängts med en timmes varsel. Fyrtiotusen bilar om dagen får nu ta en omväg på femtio kilometer. Bron skulle ha renoverats för sex år sedan, men pengarna gick till annat. En färjeredare har redan börjat sälja biljetter.',
    when: (c) => c.myn.kinds.trafik >= 1 && c.myn.kinds.trafik <= 3 && c.day > 100,
    choices: [
      { text: 'BYGG OM BRON I REKORDFART', cost: { money: 300 }, mynBudget: 1, temp: { gdp: -1 }, perm: { factory: 1 }, griev: -3, tip: 'Arbetet pågår dygnet runt. Bron öppnar igen om ett år, starkare än förut.' },
      { text: 'SÄTT IN GRATIS FÄRJOR', cost: { money: 80 }, temp: { approval: 1, gdp: -1 }, tip: 'Pendlarna dricker kaffe på färjan och börjar prata med varandra. Några gifter sig.' },
      { text: 'LAPPA OCH ÖPPNA FÖR PERSONBILAR', temp: { gdp: -1 }, tip: 'Billigt, snabbt och osäkert.',
        risk: { chance: 0.7,
          win: { text: 'Lagningen håller. Lastbilarna tar omvägen, men vardagen fungerar igen.', temp: { approval: 1 } },
          lose: { text: 'Nya sprickor efter en vecka. Bron stängs igen, och nu för gott.', temp: { gdp: -2, approval: -2 }, griev: 4 } } },
    ],
  },
  {
    id: 'myn_digital_eid', icon: '\u{1F510}', weight: 2, cooldown: 1000, myn: 'digital',
    title: 'E-LEGITIMATIONEN LIGGER NERE',
    text: 'Sedan i morse går det inte att logga in någonstans. Den statliga e-legitimationen som {myndighet} driver har slagits ut av en överbelastningsattack, och folk kan inte betala räkningar, hämta ut recept eller se sina betyg. Angriparna har lagt upp en bild på en katt med solglasögon på myndighetens startsida.',
    when: (c) => c.myn.kinds.digital >= 1 && (c.ind.internet ?? 60) > 40,
    choices: [
      { text: 'BYGG ETT SKYDD SOM HÅLLER', cost: { money: 150 }, mynBudget: 1, perm: { stability: 1 }, ind: { hacking: -8 }, tip: 'Dubbla system, nya brandväggar och en avdelning som bara övar på attacker.' },
      { text: 'ANLITA FEMTONÅRINGEN SOM VARNADE', cost: { money: 10 }, temp: { approval: 2, research: 1 }, ind: { hacking: -3 }, tip: 'Han hittade hålet förra året. Ingen svarade på hans mejl.' },
      { text: 'ÖPPNA KONTOREN OCH KÖR PÅ PAPPER', temp: { gdp: -1, approval: -1 }, tip: 'Köerna är långa men räkningarna blir betalda. Pensionärerna tycker att det är som förr.' },
    ],
  },
  {
    id: 'myn_rymd_satellit', icon: '\u{1F680}', weight: 2, cooldown: 1200, myn: 'rymd',
    title: 'LANDETS FÖRSTA EGNA SATELLIT',
    text: 'Efter fem års arbete är {myndighet} redo att skjuta upp landets första egenbyggda satellit. Den ska fotografera skogarna, mäta isen och hjälpa fiskebåtarna. Raketen står på startplattan utanför {stad} och hela landet följer nedräkningen. Ingenjörerna säger att chansen är god. De säger inte hur god.',
    when: (c) => c.myn.kinds.rymd >= 3 && c.day > 150,
    choices: [
      { text: 'SKJUT UPP I DIREKTSÄNDNING', tip: 'Om det går bra ser alla det. Om det går dåligt ser alla det också.',
        risk: { chance: 0.65,
          win: { text: 'Satelliten når sin bana och skickar hem en första bild. Den hamnar på frimärken.', temp: { approval: 4, ideopower: 2 }, perm: { research: 1 } },
          lose: { text: 'Raketen svänger ut över havet och försvinner. Ingenjörerna börjar om.', temp: { approval: -2 } } } },
      { text: 'SKJUT UPP I TYSTHET PÅ NATTEN', tip: 'Mindre fest, mindre fall.',
        risk: { chance: 0.65,
          win: { text: 'Satelliten fungerar. Nyheten kommer dagen efter, med bilder.', temp: { approval: 2 }, perm: { research: 1 } },
          lose: { text: 'Uppskjutningen misslyckas. Ingen såg det, men alla läser om det.', temp: { approval: -1 } } } },
      { text: 'TESTA ETT HALVÅR TILL', cost: { money: 80 }, mynBudget: 1, perm: { research: 1 }, tip: 'Ingenjörerna hittar två fel. Det var värt att vänta.' },
    ],
  },
  {
    id: 'myn_miljo_grodan', icon: '\u{1F438}', weight: 2, cooldown: 1100, kind: 'miljo', myn: 'miljo',
    title: 'GRODAN SOM STOPPADE GRUVAN',
    text: 'En ny gruva utanför {stad} skulle ge tusen jobb. Nu har {myndighet} stoppat bygget, eftersom marken är den sista platsen i landet där en liten grön groda lever. Gruvbolaget kallar den "världshistoriens dyraste groda". Naturvännerna har döpt den till Gunnar och sålt tiotusen tröjor med hans bild.',
    when: (c) => c.myn.kinds.miljo >= 3 && c.day > 90,
    choices: [
      { text: 'GRODAN STANNAR', temp: { qol: 1, gdp: -1 }, griev: -3, tip: 'Gunnar får en egen naturreserv. Gruvbolaget får en ny utredning.' },
      { text: 'FLYTTA GRODORNA TILL EN NY DAMM', cost: { money: 120 }, temp: { gdp: 1 }, griev: -1, tip: 'Biologerna bär grodor i hinkar i tre veckor. De flesta grodorna trivs.' },
      { text: 'KÖR ÖVER {MYNDIGHET} OCH BYGG', cost: { pp: 8 }, temp: { gdp: 2, qol: -1 }, perm: { factory: 1 }, griev: 7, tip: 'Tusen jobb och en groda mindre. Gunnar-tröjorna säljer bättre än någonsin.' },
    ],
  },
  {
    id: 'myn_miljo_inspektorerna', icon: '\u{1F35E}', weight: 2, cooldown: 1000, kind: 'miljo', myn: 'miljo',
    title: 'BAGERIET SOM FICK BÖTER',
    text: 'Med sin enorma budget har {myndighet} anställt fyratusen nya inspektörer, och de är flitiga. Ett bageri i {stad} har fått böter för röken från vedugnen, en bonde för att hans kor släpper ut för mycket gas och en scoutkår för en lägereld utan tillstånd. Företagarna säger att de inte hinner arbeta för alla blanketter.',
    when: (c) => c.myn.kinds.miljo >= 5,
    choices: [
      { text: 'SKÄR NER PÅ {MYNDIGHET}', mynBudget: -2, res: { money: 60 }, temp: { gdp: 1, qol: -1 }, griev: 3, tip: 'Inspektörerna blir färre. Bageriet tänder ugnen igen.' },
      { text: 'INSPEKTÖRERNA SKA HJÄLPA, INTE BARA BÖTFÄLLA', cost: { pp: 6 }, temp: { gdp: 1, approval: 1 }, griev: -2, tip: 'Inspektörerna lär sig säga "så här kan ni göra". Det tar några veckor.' },
      { text: 'MILJÖN GÅR FÖRST', temp: { qol: 1, gdp: -1, approval: -2 }, griev: -3, tip: 'Luften blir renare. Scoutkåren grillar korv över ett elektriskt element.' },
      { text: 'LÄGG NER {MYNDIGHET}', cost: { pp: 8 }, mynStang: true, res: { money: 100 }, temp: { gdp: 2, qol: -2 }, griev: 10, tip: 'Inga fler böter. Inga fler mätningar heller, och snart inga fler grodor.' },
    ],
  },
  {
    id: 'myn_energi_vinter', icon: '\u{26A1}', weight: 2, cooldown: 1000, kind: 'ekonomi', myn: 'energi',
    title: 'RÄCKER ELEN I VINTER?',
    text: 'Prognosen från {myndighet} är dyster: blir vintern kall räcker elen inte under de kallaste dagarna. Två kraftverk står still för reparation och vindprognosen är svag. Generaldirektören föreslår planerade avbrott, två timmar i taget, område för område. Elbolagen vill hellre att staten betalar för att starta ett gammalt oljekraftverk.',
    when: (c) => c.myn.kinds.energi >= 1 && c.day > 100,
    choices: [
      { text: 'STARTA OLJEKRAFTVERKET', cost: { money: 200 }, temp: { factory: 1, qol: -1 }, griev: -2, tip: 'Elen räcker. Röken syns från tre kommuner.' },
      { text: 'PLANERADE AVBROTT, OM DET BEHÖVS', temp: { approval: -2, factory: -1 }, griev: 4, tip: 'Folk köper stearinljus och spelar kort. Vissa tycker att det är mysigt.' },
      { text: 'KAMPANJ: SÄNK VÄRMEN EN GRAD', cost: { money: 30 }, tip: 'En grad är en tröja. En tröja är billigare än ett kraftverk.',
        risk: { chance: 0.6,
          win: { text: 'Hela landet drar på sig en tröja till. Elen räcker med god marginal.', temp: { stability: 1, approval: 1 } },
          lose: { text: 'Vintern blir rekordkall. Tröjorna räcker inte, och några områden släcks ned.', temp: { approval: -2, factory: -1 }, griev: 3 } } },
      { text: 'GE {MYNDIGHET} PENGAR TILL ETT NYTT NÄT', cost: { money: 300 }, mynBudget: 1, perm: { factory: 1, stability: 1 }, tip: 'Det hjälper inte i vinter. Men om fem år har landet el över.' },
    ],
  },
  {
    id: 'myn_val_omrakning', icon: '\u{1F407}', weight: 2, cooldown: 1200, kind: 'frihet', myn: 'val',
    title: 'VALSEDELN MED KANINEN',
    text: 'Valet blev så jämnt att {myndighet} inte vågar fastställa resultatet. Elva röster skiljer i en valkrets som avgör majoriteten. Valförrättare räknar för hand i en idrottshall under ögonen på ombud från alla partier, och en valsedel med en ritad kanin i stället för ett kryss har blivit landets mest omdiskuterade papper.',
    when: (c) => c.myn.kinds.val >= 1 && c.demo > 5 && c.day > 300,
    choices: [
      { text: 'LÅT {MYNDIGHET} RÄKNA I LUGN OCH RO', temp: { stability: -1 }, griev: -3, ind: { trustgov: 2 }, tip: 'Det tar tre veckor. Resultatet håller, för ingen kan säga att det gick för fort.' },
      { text: 'FLER RÄKNARE OCH KAMEROR I HALLEN', cost: { money: 50 }, mynBudget: 1, temp: { stability: 1 }, griev: -3, ind: { trustgov: 2, turnout: 1 }, tip: 'Räkningen sänds direkt och blir en oväntad tittarsuccé.' },
      { text: 'KANINEN RÄKNAS SOM EN RÖST FÖR OSS', cost: { pp: 6 }, temp: { approval: -2, stability: -2 }, perm: { corruption: 2 }, griev: 8, ind: { trustgov: -3 }, tip: 'Kaninen avgör valet. Halva landet kommer aldrig att förlåta kaninen.' },
    ],
  },
  {
    id: 'myn_media_tillsyn', icon: '\u{1F4E2}', weight: 2, cooldown: 1000, kind: 'frihet', myn: 'media',
    title: 'MEDIETILLSYNEN VILL GRANSKA ALLT',
    text: '{myndighet}, som delar ut sändningstillstånden, har föreslagit nya regler: alla kanaler ska varje månad lämna in sina planerade program för "granskning av balans och lämplighet". Generaldirektören säger att det handlar om kvalitet. Journalisterna säger att det handlar om censur. Ett satirprogram har redan gjort ett avsnitt om förslaget.',
    when: (c) => c.myn.kinds.media >= 4,
    choices: [
      { text: 'GENOMFÖR REGLERNA', cost: { pp: 10 }, temp: { statepower: 2, freedom: -3 }, griev: 7, ind: { pressfree: -4 }, tip: 'Programmen blir balanserade. Och väldigt försiktiga.' },
      { text: 'AVSLÅ OCH MINSKA BUDGETEN', mynBudget: -2, temp: { freedom: 2 }, griev: -4, ind: { pressfree: 2 }, tip: 'Myndigheten får ägna sig åt det den ska: tillstånd och frekvenser.' },
      { text: 'LÄGG NER {MYNDIGHET}', cost: { pp: 8 }, mynStang: true, temp: { freedom: 3, stability: -1 }, griev: -6, ind: { pressfree: 3 }, tip: 'En liten nämnd delar ut tillstånden i stället. Ingen saknar granskningen.' },
    ],
  },

  // ===== GENERALDIREKTÖRERNA =====
  {
    id: 'myn_gd_intervju', icon: '\u{1F3A4}', weight: 2, cooldown: 900, myn: 'any',
    title: 'GENERALDIREKTÖREN SA FÖR MYCKET',
    text: 'I en radiointervju fick generaldirektören för {myndighet} frågan vad myndigheten egentligen gör. Svaret blev ärligare än någon räknat med: "Ungefär en tredjedel av tiden fyller vi i blanketter om andra blanketter, och resten av tiden väntar vi på svar från departementet." Klippet har spelats i alla nyhetsprogram.',
    when: (c) => c.myn.open >= 1 && c.st.approval < 15 && c.st.corruption > -15 && c.day > 60,
    choices: [
      { text: 'BYT GENERALDIREKTÖR', cost: { pp: 5 }, mynChef: true, temp: { approval: 1, stability: -1 }, tip: 'Den nya chefen ger inga intervjuer alls. Ingen vet om det är bättre.' },
      { text: 'GE HONOM I UPPDRAG ATT STÄDA BLANKETTERNA', mynSkill: 1, temp: { approval: 2 }, perm: { corruption: -1 }, tip: 'Han river fyrahundra blanketter på ett år. Personalen ordnar en fest.' },
      { text: 'KRÄV EN OFFENTLIG URSÄKT', temp: { approval: -1 }, ind: { trustgov: -1 }, tip: 'Ursäkten är ännu ärligare än intervjun.' },
    ],
  },
  {
    id: 'myn_gd_budet', icon: '\u{1F4E9}', weight: 2, cooldown: 1100, myn: 'any',
    title: 'GENERALDIREKTÖREN FÅR ETT BUD',
    text: 'Den skickliga generaldirektören för {myndighet} har fått ett erbjudande från {land}: dubbel lön, ett hus vid havet och en titel som är för lång för ett visitkort. Under hennes ledning har myndigheten blivit en av de bästa i världen på sitt område. Hon vill gärna stanna, säger hon, men hon har tre barn och ett lån.',
    when: (c) => c.myn.open >= 1 && c.myn.skill >= 3.2 && c.day > 150,
    choices: [
      { text: 'MATCHA BUDET', cost: { money: 60 }, mynSkill: 1, temp: { approval: -1 }, tip: 'Hon stannar. Lönen hamnar i kvällstidningarna, men det gör också resultaten.' },
      { text: 'LÅT HENNE GÅ MED ÄRA', mynChef: true, rel: 2, temp: { approval: 1 }, tip: 'Hon blir en vän av {rike} i {land}. Efterträdaren har stora skor att fylla.' },
      { text: 'GÖR HENNE TILL MINISTER', cost: { pp: 10 }, mynChef: true, temp: { approval: 2, stability: 1 }, perm: { corruption: -1 }, tip: 'Nu bestämmer hon över fler myndigheter. Några av dem är nervösa.' },
    ],
  },
  {
    id: 'myn_gd_resan', icon: '\u{1F9A9}', weight: 2, cooldown: 1000, myn: 'any',
    title: 'STUDIERESAN TILL PARADISÖN',
    text: 'Generaldirektören för {myndighet} och tolv chefer har varit på en tio dagar lång studieresa till en tropisk ö för att "studera moderna arbetssätt". Programmet bestod av två studiebesök, en båttur och sju middagar. Skattebetalarna fick notan. En kvällstidning har publicerat bilder på generaldirektören i en uppblåsbar flamingo.',
    when: (c) => c.myn.open >= 1 && c.st.corruption > 0 && c.day > 90,
    choices: [
      { text: 'SPARKA GENERALDIREKTÖREN', cost: { pp: 5 }, mynChef: true, temp: { approval: 2 }, perm: { corruption: -1 }, tip: 'Flamingon säljs på auktion till förmån för en skola. Den går för ett bra pris.' },
      { text: 'KRÄV TILLBAKA PENGARNA', res: { money: 15 }, temp: { approval: 1 }, perm: { corruption: -1 }, mynSkill: -1, tip: 'Cheferna betalar själva och blir sura. Resan blev mindre rolig i efterhand.' },
      { text: 'NYA REGLER FÖR ALLA MYNDIGHETERS RESOR', cost: { pp: 8 }, perm: { corruption: -2 }, ind: { trustgov: 1 }, tip: 'Studieresor får bara gå till platser där det regnar. Antalet resor halveras.' },
      { text: 'DET VAR EN STUDIERESA', temp: { approval: -2 }, perm: { corruption: 1 }, ind: { trustgov: -2 }, tip: 'Flamingon har ett eget konto på nätet nu. Den är inte snäll.' },
    ],
  },

  // ===== KURIOSA =====
  {
    id: 'myn_loggan', icon: '\u{1F986}', weight: 1, cooldown: 1300, myn: 'any',
    title: 'DEN NYA LOGGAN',
    text: '{myndighet} har lanserat en ny logga efter två års arbete med en reklambyrå. Den ska stå för "framåtrörelse, trygghet och öppenhet". Folk tycker att den ser ut som en ledsen anka. På nätet har tusentals ritat egna förslag, och det populäraste är en potatis med solglasögon.',
    when: (c) => c.myn.open >= 1 && c.st.approval < 20 && c.money > 0 && c.day > 30,
    choices: [
      { text: 'BEHÅLL ANKAN', res: { money: 10 }, temp: { approval: -1 }, tip: 'Om två år har folk vant sig. Om tio år älskar de den.' },
      { text: 'ANTA POTATISEN', cost: { money: 10 }, temp: { approval: 3 }, tip: 'Myndigheten med potatisen blir den mest omtyckta i landet. Ingen vet varför.' },
      { text: 'KRÄV PENGARNA TILLBAKA AV REKLAMBYRÅN', cost: { pp: 3 }, res: { money: 25 }, perm: { corruption: -1 }, tip: 'Reklambyrån betalar och gör sedan en kampanj om hur ärliga de är.' },
    ],
  },
  {
    id: 'myn_katten', icon: '\u{1F408}', weight: 1, cooldown: 1400, myn: 'any',
    title: 'KATTEN PÅ MYNDIGHETEN',
    text: 'En grå katt har flyttat in på {myndighet}. Den sover i receptionen, går på alla möten och lägger sig på tangentborden när någon skriver för långa promemorior. Personalen har gett den ett passerkort och titeln "Överinspektör, {slag}". Besökarna har blivit fler och sjukskrivningarna färre för första gången på åratal.',
    when: (c) => c.myn.open >= 1 && c.st.qol > -10 && c.st.approval < 15 && c.day > 100,
    choices: [
      { text: 'GE KATTEN EN OFFICIELL TJÄNST', temp: { approval: 3 }, next: ['myn_katten_kandis', null], tip: 'Lönen är en burk tonfisk om dagen. Statens bästa investering hittills.' },
      { text: 'INFÖR KATTER PÅ ALLA MYNDIGHETER', cost: { money: 10 }, temp: { approval: 2, qol: 1 }, next: 'myn_katten_kandis', tip: 'Fyrtio myndigheter, fyrtio katter. Promemoriorna blir märkbart kortare.' },
      { text: 'DJUR HÖR INTE HEMMA PÅ EN MYNDIGHET', temp: { approval: -3 }, tip: 'Katten flyttar till departementet i stället. Den väljer själv var den bor.' },
    ],
  },
  {
    id: 'myn_katten_kandis', icon: '\u{1F63A}', chain: true, myn: 'any',
    title: 'KATTEN ÄR VÄRLDSKÄND',
    text: 'Katten på {myndighet} har blivit världskänd. En film där den stänger av generaldirektörens dator mitt i en presentation har setts hundra miljoner gånger, och turister från {land} köar utanför entrén. Personalen säljer kattkalendrar till förmån för ett djurhem. Generaldirektören säger att det är "svårt att få arbetsro".',
    choices: [
      { text: 'GÖR KATTEN TILL AMBASSADÖR FÖR {RIKE}', temp: { approval: 2 }, rel: 3, ind: { tourists: 6 }, tip: 'Katten reser inte. Ambassadörerna får komma till katten.' },
      { text: 'BYGG ETT KATTKAFÉ VID ENTRÉN', cost: { money: 20 }, temp: { approval: 1 }, ind: { tourists: 8 }, tip: 'Kaféet går med vinst efter en månad. Myndigheten får arbetsro på andra våningen.' },
      { text: 'FLYTTA KATTEN TILL EN LUGNARE PLATS', mynSkill: 1, temp: { approval: -2 }, tip: 'Generaldirektören får arbetsro. Folket får en ny sak att vara arga på.' },
    ],
  },
  {
    id: 'myn_rapporten', icon: '\u{1F4D1}', weight: 1, cooldown: 1300, myn: 'any',
    title: 'RAPPORTEN OM KORTARE RAPPORTER',
    text: 'Efter tre års arbete har {myndighet} lämnat in en utredning om hur myndigheter kan skriva kortare rapporter. Den är 412 sidor lång, har sju bilagor och en sammanfattning på trettio sidor. Huvudförslaget är att alla rapporter ska ha en sammanfattning på högst en sida. Det har utredningen inte.',
    when: (c) => c.myn.open >= 1 && c.st.statepower > -10 && c.st.corruption > -20 && c.day > 60,
    choices: [
      { text: 'INFÖR EN-SIDA-REGELN ÖVERALLT', cost: { pp: 4 }, temp: { gdp: 1 }, perm: { corruption: -1 }, tip: 'Ministrarna läser plötsligt allt som kommer in. Det har aldrig hänt förut.' },
      { text: 'BE OM EN KORTARE VERSION AV RAPPORTEN', temp: { approval: 1 }, tip: 'Den kortare versionen är 260 sidor. Det är ändå en förbättring.' },
      { text: 'SKÄR NER PÅ {MYNDIGHET}', mynBudget: -1, res: { money: 30 }, temp: { approval: 1, stability: -1 }, tip: 'Det blir färre rapporter. De som blir kvar är kortare.' },
    ],
  },

  // ===== HELA STATEN =====
  {
    id: 'myn_strejken', icon: '\u{1FAA7}', weight: 2, cooldown: 1000, kind: 'valfard',
    title: 'TJÄNSTEMÄNNEN STREJKAR',
    text: 'Efter två år av nedskärningar har de statsanställdas fackförbund utlyst strejk på flera myndigheter samtidigt. Handläggarna har satt upp lappar med texten "Stängt på grund av sparkrav" och läser högt ur statsbudgeten utanför departementen. Pass, bygglov och bidrag står stilla. Facket kräver att budgetarna återställs.',
    when: (c) => c.myn.cut >= 3,
    choices: [
      { text: 'GÅ MED PÅ KRAVEN', cost: { money: 250 }, temp: { approval: 2, stability: 1 }, griev: -8, ind: { strikes: -30 }, tip: 'Myndigheterna öppnar igen. Pengarna får tas någon annanstans.' },
      { text: 'FÖRHANDLA FRAM EN KOMPROMISS', cost: { money: 100, pp: 6 }, temp: { stability: 1 }, griev: -3, ind: { strikes: -15 }, tip: 'Halva kravet, en löneökning nästa år och tårta på förhandlingen.' },
      { text: 'VÄNTA UT DEM', temp: { approval: -3, gdp: -1, stability: -1 }, griev: 6, ind: { strikes: 40 }, tip: 'Strejkkassan räcker länge. Passköerna räcker längre.' },
    ],
  },
  {
    id: 'myn_staten_vaxer', icon: '\u{1F3DB}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'MYNDIGHETERNA VÄXER OCH VÄXER',
    text: 'Statens myndigheter har aldrig varit så stora. På fem år har de anställt fler kommunikatörer än landet har barnmorskor, och en myndighet har byggt ett nytt huvudkontor med ett vattenfall i entrén. En tankesmedja har räknat ut att varannan ny tjänst handlar om att samordna de andra. Oppositionen talar om "byråkratins guldålder".',
    when: (c) => c.myn.spend >= 140 && c.myn.big >= 3,
    choices: [
      { text: 'ANSTÄLLNINGSSTOPP PÅ ALLA MYNDIGHETER', cost: { pp: 8 }, res: { money: 100 }, temp: { approval: 1, qol: -1 }, perm: { corruption: -1 }, tip: 'Inga nya tjänster på ett år. Vattenfallet stängs av för att spara el.' },
      { text: 'MÄT VAD DE FAKTISKT GÖR', cost: { money: 40 }, temp: { stability: 1 }, perm: { corruption: -1 }, tip: 'En myndighet som mäter myndigheter. Den anställer genast tolv kommunikatörer.' },
      { text: 'STOR STAT ÄR TRYGG STAT', temp: { approval: -2, welfare: 1 }, perm: { corruption: 1 }, tip: 'Folket ser vattenfallet och undrar vad de får för pengarna.' },
    ],
  },
  {
    id: 'myn_huset_tomt', icon: '\u{1F3DA}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'HUSET SOM STÅR TOMT',
    text: 'Myndighetshuset i {huvudstad} har stått tomt sedan verksamheten lades ned. Skrivborden står kvar, telefonerna ringer ibland och en vaktmästare går fortfarande en runda varje kväll av gammal vana. Nu vill en konstnärsgrupp göra om huset till ateljéer, ett hotell vill köpa det och en skola behöver nya lokaler.',
    when: (c) => c.myn.closed >= 1,
    choices: [
      { text: 'SÄLJ HUSET TILL HOTELLET', res: { money: 120 }, temp: { approval: -1 }, tip: 'Hotellet behåller den gamla skylten i entrén. Gästerna tycker att det är charmigt.' },
      { text: 'GE HUSET TILL SKOLAN', temp: { approval: 2, research: 1 }, tip: 'Barnen leker i det gamla sammanträdesrummet. Det har aldrig varit så livligt där.' },
      { text: 'LÅT KONSTNÄRERNA FLYTTA IN', temp: { approval: 1, qol: 1 }, ind: { tourists: 3 }, tip: 'Den första utställningen heter "Ärendet är avslutat". Den blir en succé.' },
    ],
  },
  {
    id: 'myn_staten_fungerar', icon: '\u{1F3C6}', weight: 2, cooldown: 1300,
    title: 'STATEN SOM FUNGERAR',
    text: 'En internationell jämförelse har rankat myndigheterna i {rike} bland de effektivaste i världen. Pass kommer på en vecka, återbäringen kommer innan folk hunnit undra var den är och handläggarna svarar i telefon. Rapporten lyfter fram generaldirektörerna, som beskrivs som "ovanligt kompetenta och ovanligt lite rädda för ministrar".',
    when: (c) => c.myn.skill >= 3.6 && c.myn.open >= 6,
    choices: [
      { text: 'GE ALLA GENERALDIREKTÖRER FRIARE HÄNDER', cost: { pp: 6 }, temp: { statepower: -1 }, perm: { corruption: -1, stability: 1 }, tip: 'Mindre detaljstyrning, mer ansvar. Ministrarna får vänja sig.' },
      { text: 'TA EMOT DELEGATIONER FRÅN HELA VÄRLDEN', rel: 3, temp: { approval: 1 }, tip: 'Alla vill veta hemligheten. Den är tråkig: bra chefer och tydliga uppdrag.' },
      { text: 'TA ÅT DIG ÄRAN', temp: { approval: 2 }, ind: { trustgov: -1 }, tip: 'Generaldirektörerna ler artigt på bilden. De vet vem som gjorde jobbet.' },
    ],
  },
];
