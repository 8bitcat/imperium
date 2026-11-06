// IMPERIUM V5.16 VERKLIGHETEN — HÄNDELSER: STATSFINANSER & EKONOMI.
// Från V5.16 får statskassan gå under noll: staten lever på bankens kredit så länge
// Income är -70 eller högre. Varje månad läggs underskottet på statsskulden, betyget
// sjunker när skulden växer och tre missade betalningar till banken = statsbankrutt.
// Här är vad det betyder för folk: löner och bidrag som kommer sent, leverantörer
// som slutar leverera, ratingbyråer, obligationsauktioner, Valutafonden, sparpaket,
// sedelpressen och hyperinflationen, bankrusningar, skatteuppror — och den goda
// sidan: överskott, högre betyg, en statlig fond, högkonjunktur. Bubblor som växer
// och spricker. De flesta händelser är följder av ett läge (c.deficit, c.money,
// c.debt, c.ratingIdx, missnöjet) eller av en lag du just ändrat (c.cut/c.changed).
//
// KEDJOR (chain: true nås bara via next):
//   lönerna sena → lärarstrejk → nödlån / generalstrejk (+ polisen arbetar efter klockan)
//   leverantörerna obetalda → sjukhusen saknar material
//   betyget sänks → auktionen räddas / floppar → byrån sänker igen → Valutafonden
//   Valutafonden → villkoren → nedskärningarna på gatan → fonden lämnar landet
//   sparpaketet → "Spara på er själva"
//   statens bolag till salu → budstrid / ett år efter försäljningen
//   sedelpressen → priserna stiger → hyperinflation → ny valuta / byteshandel (+ tomma hyllor)
//   bankrusning → bankhelgen → banken är borta / köerna är borta
//   skattevägran → skattestrejk → skatteupproret
//   pensionsfonden lånas → hålet i pensionsfonden
//   statsbankrutt → fordringsägarna → isolerade / tillbaka på marknaden
//   överskott → statlig fond → fonden växer / rasar / skandal
//   börsfeber → krasch → pensionspengarna; bostadsbubbla → krasch → bankerna
//   lågkonjunktur → varselvågen → den långa arbetslösheten
//   hungermarschen → kravallerna
export const EVENTS = [

  // ===== TOM STATSKASSA: LÖNER, BIDRAG OCH RÄKNINGAR =====
  {
    id: 'sfi_lon_sen', icon: '\u{1F3EB}', weight: 2, cooldown: 600,
    kind: 'underskott', react: true,
    title: 'LÄRARNA FICK INGEN LÖN',
    text: 'Statskassan har legat under noll i flera veckor. I morse kom beskedet att lärarnas lön för månaden skjuts upp tio dagar, eftersom banken bara betalar ut krediten i omgångar. I {stad} har en högstadielärare satt upp en lapp på klassrumsdörren: "Undervisning sker i mån av hyra."',
    when: (c) => c.deficit && c.day > 30 && c.grievOf('underskott') < 30,
    choices: [
      { text: 'LÅNA EXTRA OCH BETALA LÖNERNA I DAG', cost: { money: 400 }, griev: -12, temp: { approval: 2 }, tip: 'Skulden växer. Men barnen har en lärare på måndag.' },
      { text: 'BETALA LÄRARNA FÖRST, POLISEN FÅR VÄNTA', cost: { pp: 10 }, griev: -4, temp: { safety: -2 }, next: ['sfi_polis_sen', null], tip: 'Någon står alltid sist i kön. Den här gången har den batong.' },
      { text: 'BE OM TÅLAMOD I ETT TAL TILL NATIONEN', griev: 8, temp: { approval: -4 }, ind: { trustgov: -3 }, next: ['sfi_lon_strejk', 'sfi_lon_strejk', null], tip: 'Tålamod är gratis. Hyran är det inte.' },
    ],
  },
  {
    id: 'sfi_lon_strejk', icon: '\u{270A}', chain: true, kind: 'underskott',
    title: 'LÄRARSTREJKEN BÖRJAR',
    text: 'Lärarfacket har tröttnat på uppskjutna löner. Från måndag stänger skolorna i fem städer, först i {stad}. Föräldrar tar ledigt för att passa barnen, vilket gör att även sjukhusen och bussbolagen saknar folk. Facket kräver lönen plus dröjsmålsränta och ett löfte på papper om att det inte händer igen.',
    choices: [
      { text: 'BETALA MED RÄNTA OCH SKRIV UNDER', cost: { money: 600 }, griev: -18, temp: { approval: 3, unrest: -4 }, ind: { strikes: -40 }, tip: 'Dyrt. Men skolklockan ringer igen.' },
      { text: 'TA ETT NÖDLÅN FRÅN UTLANDET', cost: { pp: 10 }, griev: -4, next: 'sfi_nodlan', tip: 'Någon annans pengar. Med någon annans villkor.' },
      { text: 'KALLA IN VIKARIER OCH VÄNTA UT DEM', griev: 10, temp: { unrest: 6, approval: -5 }, ind: { strikes: 60, trustgov: -4 }, next: ['sfi_generalstrejk', null], tip: 'Vikarierna har också barn. Och också sena löner.' },
    ],
  },
  {
    id: 'sfi_nodlan', icon: '\u{1F91D}', chain: true, kind: 'underskott',
    title: 'NÖDLÅNET FRÅN {LAND}',
    text: 'Regeringen i {land} erbjuder ett nödlån som täcker alla statliga löner i tre månader. Räntan är låg, men villkoren står i en bilaga på fyrtio sidor: förtur för deras bolag i statliga upphandlingar och en hamn som ska arrenderas ut i nittionio år.',
    choices: [
      { text: 'TA LÅNET, BILAGAN OCH ALLT', res: { money: 1200 }, griev: -10, perm: { income: -2 }, temp: { statepower: -3 }, rel: 6, tip: 'Hamnen var ändå mest full av måsar.' },
      { text: 'FÖRHANDLA BORT HAMNEN', cost: { pp: 20 }, res: { money: 700 }, griev: -6, rel: 2, tip: 'Mindre pengar. Mer hamn.' },
      { text: 'TACKA NEJ OCH SKÄR I STATENS EGNA KOSTNADER', griev: 6, temp: { approval: -3, welfare: -3 }, perm: { income: 1 }, tip: 'Tjänstebilarna säljs först. Sedan blir det svårare.' },
    ],
  },
  {
    id: 'sfi_generalstrejk', icon: '\u{1F6A7}', chain: true, kind: 'underskott',
    title: 'HELA OFFENTLIGA SEKTORN STREJKAR',
    text: 'Lärarna har fått sällskap. Sjuksköterskor, sophämtare, tågklarerare och tulltjänstemän har gått ut i en gemensam strejk för uteblivna löner. Tågen står still, soporna växer på trottoarerna i {huvudstad} och bara akuten har öppet. Fackens gemensamma krav: alla löner betalda inom en vecka.',
    choices: [
      { text: 'BETALA ALLT, VAD DET ÄN KOSTAR', cost: { money: 1200 }, griev: -25, temp: { unrest: -8, approval: 2 }, ind: { strikes: -60 }, tip: 'Banken suckar. Sopbilarna rullar.' },
      { text: 'MEDLA: HALVA NU, RESTEN MED RÄNTA I HÖST', cost: { money: 500, pp: 20 }, griev: -12, temp: { unrest: -3 }, tip: 'Ingen jublar. Alla går tillbaka till jobbet.' },
      { text: 'FÖRBJUD STREJKEN MED NÖDLAGAR', griev: 12, temp: { statepower: 6, unrest: 10, freedom: -6, approval: -8 }, ind: { trustgov: -6, demo: -0.3 }, mod: 'general_strike', tip: 'Lagen säger att de ska jobba. Lagen betalar inte deras hyra.' },
    ],
  },
  {
    id: 'sfi_polis_sen', icon: '\u{1F46E}', chain: true, kind: 'underskott',
    title: 'POLISEN ARBETAR EFTER KLOCKAN',
    text: 'Poliserna fick inte sin lön i tid, och facket har infört "regelstrikt arbete": varje fortkörning utreds i detalj, inga övertidspass och inga utryckningar utan full bemanning. I {stad} tar det nu fyrtio minuter innan en patrull kommer till ett inbrott.',
    choices: [
      { text: 'BETALA POLISEN MED EN BONUS', cost: { money: 350 }, griev: -8, temp: { safety: 3 }, ind: { policetrust: 3 }, tip: 'Bonusen syns direkt i utryckningstiden.' },
      { text: 'LÅT MILITÄREN PATRULLERA GATORNA', cost: { man: 5 }, temp: { safety: 2, freedom: -4, unrest: 3 }, ind: { feelsafe: -2 }, tip: 'Soldater på torget lugnar inte alla.' },
      { text: 'LOVA LÖNEN NÄSTA MÅNAD', griev: 6, temp: { safety: -5 }, ind: { crimeidx: 6, feelsafe: -4 }, tip: 'Tjuvarna har läst samma tidning.' },
    ],
  },
  {
    id: 'sfi_soldater_sen', icon: '\u{1FA96}', weight: 2, cooldown: 700, kind: 'underskott',
    title: 'SOLDATERNA HAR INTE FÅTT SOLD',
    text: 'Vid regementet utanför {stad} har sexhundra soldater inte fått sin sold på två veckor. Officerarna låter dem baka bröd i fältköket och säger att moralen är god. Underrättelsetjänsten säger något annat: två kompanier har slutat svara i radion, och en överste har bjudit oppositionsledaren på middag.',
    when: (c) => c.deficit && (c.atWar || c.st.milpower > 15),
    choices: [
      { text: 'SOLDEN FÖRST AV ALLT', cost: { money: 500 }, griev: -8, temp: { readiness: 4, stability: 2 }, tip: 'En armé marscherar på magen. Och på lönen.' },
      { text: 'GE DEM MARK I STÄLLET FÖR PENGAR', cost: { pp: 15 }, griev: -3, temp: { readiness: 2, approval: -2 }, perm: { income: -1 }, tip: 'Romarna gjorde så. Det slutade med kejsare.' },
      { text: 'BYT UT ÖVERSTEN',
        risk: { chance: 0.6,
          win: { text: 'Den nya översten lugnar regementet och betalar ut det som finns.', temp: { stability: 3, statepower: 3 } },
          lose: { text: 'Kompanierna vägrar ta emot honom och marscherar mot staden.', temp: { stability: -8, unrest: 8, readiness: -5 } } } },
    ],
  },
  {
    id: 'sfi_bidrag_sen', icon: '\u{1F37C}', weight: 2, cooldown: 600,
    kind: 'underskott', react: true,
    title: 'BARNBIDRAGET KOM INTE',
    text: 'Den tjugofemte i månaden brukar barnbidraget och sjukpenningen komma in på kontot. I dag kom ett sms: "Utbetalningen är försenad på grund av statens likviditet." Matbanken i {stad} hade kö runt kvarteret redan klockan sju, och kyrkan har ställt fram extra bord.',
    when: (c) => c.deficit && c.day > 40,
    choices: [
      { text: 'PRIORITERA BIDRAGEN, SKJUT PÅ VÄGBYGGENA', cost: { pp: 10 }, griev: -10, temp: { approval: 2, factory: -3 }, tip: 'Gropen i vägen får vänta. Barnen kan inte det.' },
      { text: 'BETALA UT ALLT PÅ KREDIT', cost: { money: 450 }, griev: -14, tip: 'Banken tar ränta. Matbanken stänger tidigare.' },
      { text: 'BETALA HÄLFTEN NU, RESTEN SENARE', griev: 7, temp: { qol: -3, approval: -3 }, ind: { trustgov: -3, happiness: -0.1 }, tip: 'Halva bidraget räcker till halva månaden.' },
    ],
  },
  {
    id: 'sfi_leverantor', icon: '\u{1F9FE}', weight: 2, cooldown: 700, kind: 'underskott',
    title: 'LEVERANTÖRERNA VILL HA BETALT',
    text: 'Statens obetalda fakturor har passerat fyrtiotusen. Ett bussbolag i {stad} har slutat köra skolskjutsen, ett städbolag har slutat städa domstolarna och leverantören av förband till sjukhusen kräver nu förskott. Små företag som bara har staten som kund varslar personal.',
    when: (c) => c.deficit && c.money < -500,
    choices: [
      { text: 'BETALA DE MINSTA FÖRETAGEN FÖRST', cost: { money: 300 }, griev: -6, temp: { gdp: 1 }, tip: 'Den lilla firman överlever. Den stora kan vänta.' },
      { text: 'BETALA MED STATLIGA SKULDSEDLAR', cost: { pp: 10 }, griev: -2, temp: { stability: -2 }, perm: { corruption: 1 }, tip: 'Kalifornien gjorde så 2009. Det gick ungefär.' },
      { text: 'LÅT DEM VÄNTA', griev: 6, temp: { gdp: -3 }, ind: { unemp: 0.3 }, next: ['sfi_sjukhus_material', null], tip: 'Fakturor försvinner inte. De får påminnelseavgift.' },
    ],
  },
  {
    id: 'sfi_sjukhus_material', icon: '\u{1F3E5}', chain: true, kind: 'underskott',
    title: 'SJUKHUSEN SAKNAR HANDSKAR',
    text: 'Sedan leverantörerna slutade leverera på kredit har sjukhuset i {stad} börjat skjuta upp planerade operationer. Sjuksköterskorna tar med egna handskar hemifrån, och en överläkare säger i radio att hon aldrig trodde att hon skulle få ransonera plåster i ett modernt land.',
    choices: [
      { text: 'NÖDANSLAG TILL VÅRDEN', cost: { money: 500 }, griev: -8, temp: { qol: 2 }, tip: 'Plåster är billigt. Brist på plåster är dyrt.' },
      { text: 'BE {GRANNE} OM NÖDHJÄLP', cost: { pp: 10 }, griev: -4, rel: 3, temp: { qol: 1, ideopower: -3 }, tip: 'Grannarna hjälper gärna. Och berättar gärna om det.' },
      { text: 'OPERATIONERNA FÅR VÄNTA', griev: 8, temp: { qol: -4, hdi: -2, approval: -4 }, tip: 'Höftlederna väntar. De gör det inte tyst.' },
    ],
  },
  {
    id: 'sfi_pensioner_sen', icon: '\u{1F9D3}', weight: 2, cooldown: 700, kind: 'underskott',
    title: 'PENSIONERNA BETALAS UT I DELAR',
    text: 'Pensionsmyndigheten meddelar att pensionerna för månaden betalas ut i två delar, med tre veckor emellan. På kaféet vid torget i {stad} har pensionärerna lagt ihop sina kontanter så att den som inte har råd ändå får sin kaffe. Pensionärsförbundet kallar det en skam för en hel generation.',
    when: (c) => c.deficit && c.grievOf('underskott') > 8 && c.day > 90,
    choices: [
      { text: 'PENSIONERNA FÅR INTE RÖRAS', cost: { money: 600 }, griev: -14, temp: { approval: 3 }, tip: 'Pensionärer röstar. Alla. Varje gång.' },
      { text: 'BETALA GRUNDPENSIONEN FULLT UT', cost: { money: 250 }, griev: -6, tip: 'De fattigaste får sitt. Övriga får ett brev.' },
      { text: 'ALLA FÅR VÄNTA LIKA MYCKET', griev: 9, temp: { approval: -5, unrest: 3 }, ind: { trustgov: -3 }, tip: 'Rättvist. Och rättvist impopulärt.' },
    ],
  },
  {
    id: 'sfi_tre_lappar', icon: '\u{1F4DD}', weight: 2, cooldown: 800, kind: 'underskott',
    title: 'FINANSMINISTERNS TRE LAPPAR',
    text: 'Finansministern kommer in utan att knacka. Statskassan är så djupt under noll att banken ringer varje morgon. Hon har tre lappar med sig: vad som kan säljas, vad som kan skäras ner och vilka skatter som går att höja. Hon säger att det inte finns någon fjärde lapp.',
    when: (c) => c.money < -1000,
    choices: [
      { text: 'SÄLJ STATENS SKOGAR OCH FASTIGHETER', res: { money: 900 }, griev: -6, perm: { income: -2 }, temp: { approval: -2 }, tip: 'Skogen växer upp igen. Hos någon annan.' },
      { text: 'SKÄR TIO PROCENT PÅ ALLA DEPARTEMENT', griev: -6, perm: { income: 2 }, temp: { welfare: -5, qol: -3, approval: -4 }, tip: 'Osthyveln. Den skär lika illa överallt.' },
      { text: 'HÖJ MOMSEN MED TVÅ PROCENTENHETER', cost: { pp: 15 }, griev: -4, perm: { income: 3 }, temp: { approval: -5, qol: -2 }, ind: { infl: 0.4 }, tip: 'Alla betalar lite. Alla klagar mycket.' },
    ],
  },
  {
    id: 'sfi_kommuner', icon: '\u{1F3DB}\u{FE0F}', weight: 2, cooldown: 800, kind: 'underskott',
    title: 'KOMMUNERNA FÅR INGA STATSBIDRAG',
    text: 'När staten skjuter upp statsbidragen får kommunerna klara sig själva. {stad} har stängt simhallen, halverat snöröjningen och sagt upp alla timanställda på äldreboendena. Kommunstyrelsens ordförande har skickat en faktura till regeringen på exakt det belopp som saknas, med påminnelseavgift.',
    when: (c) => c.deficit && c.day > 100,
    choices: [
      { text: 'BETALA FAKTURAN, AVGIFTEN OCKSÅ', cost: { money: 400 }, griev: -8, temp: { qol: 2 }, tip: 'Simhallen öppnar. Snön ligger kvar lite till.' },
      { text: 'LÅT KOMMUNERNA HÖJA KOMMUNALSKATTEN', cost: { pp: 10 }, griev: -3, temp: { approval: -3, qol: -1 }, tip: 'Problemet flyttar en våning ner. Väljarna bor på alla våningar.' },
      { text: 'SKICKA TILLBAKA FAKTURAN OBETALD', griev: 7, temp: { approval: -3, qol: -3 }, ind: { trustgov: -2 }, tip: 'Med ett frimärke som kommunen får betala.' },
    ],
  },
  {
    id: 'sfi_bank_plan', icon: '\u{1F3E6}', weight: 2, cooldown: 900, kind: 'underskott',
    title: 'BANKEN VILL SE EN PLAN',
    text: 'Bankens riskchef har bett om ett möte. Krediten är inte oändlig, säger hon, och i nuvarande takt når statskassan golvet inom några månader. Banken vill se en plan för hur underskottet ska stängas, annars kortas krediten och räntan går upp. Hon har med sig en kalkylator och ingen kaka.',
    when: (c) => c.deficit && c.money < -700 && c.ratingIdx >= 3,
    choices: [
      { text: 'LÄGG EN TREÅRIG SANERINGSPLAN', cost: { pp: 25 }, griev: -6, perm: { income: 3 }, temp: { welfare: -3, approval: -2 }, ind: { trustgov: 2 }, tip: 'Tre år av tråkiga budgetar. Det är meningen.' },
      { text: 'SKRIV IN EN SKULDBROMS I GRUNDLAGEN', cost: { pp: 40 }, law: ['debt_brake', 'brake'], temp: { stability: 3, approval: -3 }, tip: 'Banken älskar bromsar. Väljarna älskar gasen.' },
      { text: 'PLANEN ÄR TILLVÄXT',
        risk: { chance: 0.35,
          win: { text: 'Ekonomin tar fart och skatteintäkterna ökar mer än någon räknat med.', temp: { gdp: 4, income: 3 } },
          lose: { text: 'Banken tror inte på ett ord. Räntan höjs redan nästa vecka.', temp: { income: -4, stability: -2 }, griev: 4 } } },
    ],
  },
  {
    id: 'sfi_snabblan', icon: '\u{1F552}', weight: 2, cooldown: 900, kind: 'underskott',
    title: 'STATSLÖNEN KOMMER — MEN NÄR?',
    text: 'Sena löner har blivit vardag. Folk har slutat lägga räkningar i kuvert och börjat ta snabblån för att klara hyran. Kronofogden rapporterar rekordmånga ärenden, och på krogen har "statslönen" blivit ett skämt: den kommer, man vet bara inte vilken månad.',
    when: (c) => c.deficit && c.grievOf('underskott') > 25,
    choices: [
      { text: 'HALVERA REGERINGSKANSLIET', cost: { pp: 20 }, griev: -10, perm: { income: 1 }, temp: { statepower: -4 }, tip: 'Ingen märker att hälften är borta. Det är det oroande.' },
      { text: 'PANTSÄTT GULDRESERVEN HOS BANKEN', res: { money: 800 }, griev: -8, temp: { stability: -3, ideopower: -3 }, tip: 'Guldet ligger kvar i källaren. Det är bara inte ditt längre.' },
      { text: 'SÄG ATT DET VÄRSTA ÄR ÖVER', griev: 6, temp: { approval: -4 }, ind: { trustgov: -4, happiness: -0.1 }, tip: 'Det har du sagt förut.' },
    ],
  },
  {
    id: 'sfi_sjukskoterskor', icon: '\u{1F489}', weight: 2, cooldown: 800, kind: 'underskott',
    title: 'SJUKSKÖTERSKORNA SÄGER UPP SIG',
    text: 'Fyrtio sjuksköterskor på akuten i {stad} lämnade in sina uppsägningar samma dag. Lönen har kommit sent tre månader i rad, och ett sjukhus i {granne} erbjuder dubbelt betalt och en bostad. Avdelningschefen säger att hon kan hålla öppet i två veckor till med inhyrd personal.',
    when: (c) => c.deficit && c.grievOf('underskott') > 12,
    choices: [
      { text: 'RETROAKTIV LÖN OCH ETT LÖNETILLÄGG', cost: { money: 500 }, griev: -10, temp: { qol: 2 }, tip: 'Trettiofem av fyrtio river sina uppsägningar.' },
      { text: 'HYR IN PERSONAL TILL DUBBLA PRISET', cost: { money: 300 }, griev: -3, temp: { income: -2 }, tip: 'Samma sjuksköterskor, nu via ett bemanningsbolag.' },
      { text: 'LÅT DEM GÅ', griev: 6, temp: { qol: -4, hdi: -1 }, ind: { life: -0.1 }, tip: 'Grannlandet tackar för de välutbildade sjuksköterskorna.' },
    ],
  },
  {
    id: 'sfi_tullen', icon: '\u{1F69A}', weight: 1, cooldown: 900, kind: 'underskott',
    title: 'TULLEN KONTROLLERAR VARJE LASTBIL',
    text: 'Tullpersonalen har inte fått sin lön i tid på två månader och har infört maskning: varje lastbil vid gränsen mot {granne} kontrolleras i minsta detalj, och kön är tolv kilometer lång. Åkerierna förlorar stora pengar varje dag, och färska grönsaker ruttnar i lastbilarna.',
    when: (c) => c.deficit && c.grievOf('underskott') > 10,
    choices: [
      { text: 'BETALA TULLARNA FÖRST AV ALLA', cost: { money: 250 }, griev: -6, temp: { gdp: 1 }, tip: 'Den billigaste lönen att betala. Den dyraste att låta bli.' },
      { text: 'SKICKA KUSTBEVAKNINGEN ATT HJÄLPA TILL', cost: { man: 3 }, griev: -2, temp: { gdp: 1, readiness: -2 }, tip: 'Kustbevakare som räknar tomater.' },
      { text: 'LÅT KÖERNA STÅ', griev: 5, temp: { gdp: -4 }, rel: -3, ind: { gdpgrowth: -0.2 }, tip: 'Lastbilschaufförerna lär sig spela kort.' },
    ],
  },
  {
    id: 'sfi_brandbilar', icon: '\u{1F692}', weight: 1, cooldown: 900, kind: 'underskott',
    title: 'BRANDBILARNA STÅR PÅ VERKSTAN',
    text: 'Staten har skjutit upp allt underhåll sedan kassan gick under noll. Två av de fyra brandbilarna i {stad} har stått på verkstaden i en månad i väntan på reservdelar som ingen betalat. Räddningstjänsten lånar en stege av en takläggare. Brandchefen säger att det fungerar, så länge det inte brinner.',
    when: (c) => c.deficit && c.day > 150 && c.money < -200,
    choices: [
      { text: 'BETALA RESERVDELARNA OCH UNDERHÅLLET', cost: { money: 300 }, griev: -5, temp: { safety: 3 }, tip: 'Uppskjutet underhåll är bara en dyrare räkning senare.' },
      { text: 'LÅNA BRANDBILAR AV {GRANNE}', cost: { pp: 5 }, rel: 2, temp: { safety: 1, ideopower: -2 }, tip: 'De kommer med en annan färg och en annan siren.' },
      { text: 'ANNAT GÅR FÖRE', griev: 5, temp: { safety: -4 }, ind: { feelsafe: -2 }, tip: 'Takläggaren har en bra stege, i alla fall.' },
    ],
  },
  {
    id: 'sfi_kort_sparrat', icon: '\u{1F4B3}', weight: 1, cooldown: 1000, kind: 'underskott',
    title: 'AMBASSADEN KUNDE INTE BETALA HYRAN',
    text: 'Det låter som ett skämt men är det inte: ambassaden i {land} kunde inte betala hyran förra veckan, eftersom statens konto var spärrat. En ambassadsekreterare betalade med sitt eget kort. Historien har blivit en snackis i utländska tidningar, och en tecknare har ritat regeringen som tigger på ett torg.',
    when: (c) => c.money < -1200,
    choices: [
      { text: 'BETALA ALLA UTLANDSRÄKNINGAR DIREKT', cost: { money: 300 }, griev: -4, rel: 4, tip: 'Och ersätt sekreterarens kort, med ränta.' },
      { text: 'STÄNG TIO AMBASSADER', perm: { income: 1 }, rel: -6, temp: { ideopower: -2 }, tip: 'Tio länder får veta att de inte var så viktiga.' },
      { text: 'SKRATTA MED I EN INTERVJU',
        risk: { chance: 0.5,
          win: { text: 'Självironin går hem. Folk skrattar med i stället för åt.', temp: { approval: 4 } },
          lose: { text: 'Ingen tycker att det är roligt när den egna lönen är sen.', temp: { approval: -4 }, griev: 5 } } },
    ],
  },
  {
    id: 'sfi_folkobligationer', icon: '\u{1F4DC}', weight: 1, cooldown: 1000, kind: 'underskott',
    title: 'LÅNA AV OSS I STÄLLET',
    text: 'En pensionerad lärare i {stad} har skrivit en insändare som spridits över hela landet: "Om staten måste låna, varför inte av oss i stället för av bankerna i {land}?" Hundratusentals har skrivit under. Finansdepartementet har tagit fram ett förslag på sparobligationer för vanligt folk.',
    when: (c) => c.deficit && c.st.approval > 10 && c.ratingIdx >= 3,
    choices: [
      { text: 'SÄLJ FOLKOBLIGATIONER MED BRA RÄNTA', cost: { pp: 10 }, res: { money: 900 }, griev: -8, perm: { income: -1 }, temp: { approval: 4 }, tip: 'Räntan går till väljarna i stället för till bankerna.' },
      { text: 'GÖR DEM RÄNTEFRIA, SOM EN GÄRNING FÖR LANDET',
        risk: { chance: 0.4,
          win: { text: 'Folket köper ändå. Det blir en folkrörelse med egna knappar.', res: { money: 700 }, temp: { approval: 4 } },
          lose: { text: 'Nästan ingen köper. Insändarskribenten känner sig lurad.', temp: { approval: -3 } } } },
      { text: 'BANKERNA KAN DET HÄR BÄTTRE', griev: 3, temp: { approval: -3 }, tip: 'Sant. Men det var inte frågan.' },
    ],
  },
  {
    id: 'sfi_forsvar_skuld', icon: '\u{1F6E1}\u{FE0F}', weight: 2, cooldown: 900, kind: 'underskott',
    title: 'FÖRSVARET ELLER BANKEN',
    text: 'Försvaret kostar mer än någonsin och statskassan är under noll. Överbefälhavaren vill ha nya luftvärnssystem, finansministern vill skära i övningsdagarna och banken vill bara ha sina pengar. Det finns inte pengar till alla tre, och alla tre har hört att de andra fått företräde.',
    when: (c) => c.deficit && (c.atWar || c.is('defense_budget', 'rearm', 'high', 'fortress', 'garrison', 'wareconomy')),
    choices: [
      { text: 'FÖRSVARET GÅR FÖRST', cost: { money: 700 }, griev: 4, temp: { milpower: 4, readiness: 3 }, tip: 'Luftvärnet kommer. Lönerna kommer sedan.' },
      { text: 'FÄRRE ÖVNINGAR, SAMMA ARMÉ', griev: -4, perm: { income: 1 }, temp: { readiness: -5 }, tip: 'Soldaterna övar på papper i stället.' },
      { text: 'SÄLJ KRIGSOBLIGATIONER TILL FOLKET', cost: { pp: 15 }, res: { money: 800 }, temp: { approval: 2 }, perm: { income: -1 }, tip: 'Fosterlandskärlek med sju procents ränta.' },
    ],
  },

  // ===== MARKNADERNA OCH KREDITBETYGET =====
  {
    id: 'sfi_betyg_sankt', icon: '\u{1F4C9}', weight: 2, cooldown: 600,
    kind: 'kris', react: true,
    title: 'KREDITBETYGET SÄNKS',
    text: 'Klockan tio i kväll, efter börsens stängning, kom beskedet: ratingbyrån sänker landets kreditbetyg ett steg och kallar utsikterna "negativa". Motiveringen är två ord lång: växande underskott. I morgon bitti ska finansdepartementet sälja nya statsobligationer, och ingen vet om någon vill köpa.',
    when: (c) => c.ratingIdx >= 3 && c.ratingIdx <= 6 && (c.deficit || c.trend('debt') > 3),
    choices: [
      { text: 'SKICKA FINANSMINISTERN TILL BYRÅN MED EN PLAN', cost: { pp: 15 }, temp: { stability: 2 }, next: ['sfi_auktion_ok', 'sfi_auktion_flopp'], tip: 'En plan i en pärm. Byrån älskar pärmar.' },
      { text: 'HÖJ RÄNTAN I AUKTIONEN SÅ DEN SÄLJS', cost: { money: 300 }, perm: { income: -1 }, next: ['sfi_auktion_ok', null], tip: 'Pengar lockar pengar. Dyrt, men säkert.' },
      { text: 'KALLA BYRÅN PARTISK I TV', griev: 4, temp: { approval: 3, ideopower: 2 }, rel: -3, next: ['sfi_auktion_flopp', 'sfi_auktion_flopp', null], tip: 'Väljarna gillar det. Köparna av obligationer röstar inte.' },
    ],
  },
  {
    id: 'sfi_auktion_flopp', icon: '\u{1F528}', chain: true, kind: 'kris',
    title: 'INGEN VILL KÖPA OBLIGATIONERNA',
    text: 'Staten bjöd ut tioåriga obligationer i morse. Efter en timme hade köparna bara tecknat hälften, trots att räntan höjts två gånger. Mäklarna i {huvudstad} pratar om köparstrejk. Utan pengarna från auktionen kan statskassan inte betala nästa månads löner fullt ut.',
    choices: [
      { text: 'ERBJUD EN RÄNTA SOM INGEN KAN SÄGA NEJ TILL', res: { money: 900 }, perm: { income: -3 }, tip: 'Pengarna kommer. Räntan också, varje år i tio år.' },
      { text: 'LÅT CENTRALBANKEN KÖPA RESTEN', res: { money: 600 }, griev: 4, temp: { stability: -2 }, ind: { infl: 1.5 }, next: ['sfi_press_priser', null], tip: 'Staten lånar av sig själv. Det har aldrig gått fel. Utom alla gånger.' },
      { text: 'STÄLL IN AUKTIONEN OCH SPARA', griev: 6, temp: { welfare: -4, approval: -4 }, ind: { gdpgrowth: -0.4 }, tip: 'Den som inte lånar behöver inte betala ränta. Eller löner.' },
    ],
  },
  {
    id: 'sfi_auktion_ok', icon: '\u{1F4E8}', chain: true, kind: 'kris',
    title: 'AUKTIONEN RÄDDADES I SISTA MINUTEN',
    text: 'Ett stort pensionsbolag i {land} köpte den sista tredjedelen av obligationerna strax före stängning. Räntan blev högre än förra året men lägre än alla fruktat. Analytikerna skriver att marknaden ger landet en sista chans, och att den inte brukar ge en till.',
    choices: [
      { text: 'ANVÄND CHANSEN: STÄNG UNDERSKOTTET', cost: { pp: 20 }, griev: -4, perm: { income: 2 }, temp: { welfare: -2 }, ind: { trustgov: 2 }, tip: 'Tråkigt, ansvarsfullt och precis vad byrån ville se.' },
      { text: 'FIRA MED ETT INVESTERINGSPAKET', cost: { money: 400 }, temp: { gdp: 3, approval: 3 }, next: ['sfi_betyg_igen', null], tip: 'Byrån läser också tidningen.' },
      { text: 'TACKA KÖPAREN MED EN STATSMIDDAG', rel: 4, temp: { approval: 1 }, tip: 'Pensionsbolagets vd får sitta nästan bredvid kungligheter.' },
    ],
  },
  {
    id: 'sfi_betyg_igen', icon: '\u{1F4C9}', chain: true, kind: 'kris',
    title: 'BYRÅN SÄNKER IGEN',
    text: 'Ratingbyrån har gjort en ny granskning och dragit sin slutsats: landet har inte förstått allvaret. Betyget sänks ytterligare ett steg och utsikterna är fortfarande negativa. Bankerna höjer redan räntan på bolånen, och i {stad} har en byggfirma stoppat tre bostadsprojekt.',
    choices: [
      { text: 'FRYS ALLA NYA UTGIFTER', cost: { pp: 15 }, perm: { income: 2 }, temp: { gdp: -2, approval: -3 }, tip: 'Inga nya löften. Bara gamla räkningar.' },
      { text: 'SÖK HJÄLP HOS VALUTAFONDEN', temp: { ideopower: -3 }, next: 'sfi_fonden_villkor', tip: 'Den sista utvägen. Den har en lång blankett.' },
      { text: 'FORTSÄTT SOM PLANERAT', griev: 5, temp: { stability: -4 }, ind: { stockcap: -8, houseprice: -3 }, tip: 'Planen var ju bra. På papperet.' },
    ],
  },
  {
    id: 'sfi_negativ_utsikt', icon: '\u{1F50E}', weight: 1, cooldown: 800, kind: 'kris',
    title: 'BYRÅN SÄTTER LANDET UNDER BEVAKNING',
    text: 'Ratingbyrån har inte sänkt betyget, men ändrat utsikterna till negativa. Det betyder att ett beslut kommer inom ett halvår. Skulden har vuxit snabbare än ekonomin i ett år, och byrån skriver att den vill se trovärdiga åtgärder före nästa granskning.',
    when: (c) => c.ratingIdx >= 1 && c.ratingIdx <= 3 && c.trend('debt') > 2 && !c.deficit,
    choices: [
      { text: 'SKRIV IN BUDGETREGLER I LAG', cost: { pp: 25 }, law: ['debt_brake', 'rules'], temp: { approval: -1 }, tip: 'Tre procent i underskott, högst. Som EU.' },
      { text: 'EN MINDRE BESPARING NU', cost: { pp: 10 }, perm: { income: 1 }, temp: { welfare: -2 }, tip: 'Små steg i tid sparar stora steg senare.' },
      { text: 'VÄNTA OCH SE',
        risk: { chance: 0.5,
          win: { text: 'Ekonomin växer ifatt skulden och byrån tar tillbaka varningen.', temp: { stability: 2 } },
          lose: { text: 'Byrån sänker betyget vid nästa granskning, som den lovade.', temp: { stability: -4, income: -3 }, griev: 4 } } },
    ],
  },
  {
    id: 'sfi_rantechock', icon: '\u{1F4C8}', weight: 2, cooldown: 800, kind: 'kris',
    title: 'RÄNTAN PÅ STATSLÅNEN STIGER',
    text: 'Räntan på landets tioåriga statsobligationer har passerat åtta procent. Varje gammal obligation som förfaller måste lånas om till nästan dubbla räntan, och räntekostnaderna har gått om försvarsbudgeten. En ekonom i {huvudstad} räknar ut att varje barn som föds i år ärver en skuld större än en bil.',
    when: (c) => (c.ind.bondrate ?? 3) > 8 && c.debt > 60 && c.ratingIdx >= 3,
    choices: [
      { text: 'BETALA AV DE DYRASTE LÅNEN', cost: { money: 800 }, perm: { income: 2 }, temp: { approval: -1 }, tip: 'Den bästa investeringen staten kan göra är ofta att betala av.' },
      { text: 'LÅNA KORTARE TILL LÄGRE RÄNTA', cost: { pp: 10 }, temp: { income: 3, stability: -3 }, tip: 'Billigt i dag. Om ett år ska allt lånas om igen.' },
      { text: 'ACCEPTERA RÄNTAN', griev: 4, perm: { income: -2 }, ind: { gdpgrowth: -0.3 }, tip: 'Långivarna tackar. Varje kvartal.' },
    ],
  },
  {
    id: 'sfi_rantor_budget', icon: '\u{1F9EE}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'RÄNTORNA ÄTER UPP BUDGETEN',
    text: 'Budgeten är klar, och för första gången är räntan på statsskulden den största enskilda utgiften, större än skolan och försvaret. Varje dag går en summa som räcker till tjugo nya förskolor direkt till långivarna. Riksdagens finansutskott vill veta hur det ska vändas.',
    when: (c) => c.debt > 120 && c.ratingIdx >= 3,
    choices: [
      { text: 'EN AMORTERINGSPLAN PÅ TJUGO ÅR', cost: { pp: 20 }, perm: { income: 2 }, temp: { welfare: -3, approval: -2 }, tip: 'Tjugo år. Ungefär fem regeringar. Lycka till.' },
      { text: 'SÄLJ STATENS AKTIER I BANKERNA', res: { money: 1000 }, perm: { income: -2 }, temp: { approval: -2 }, tip: 'Engångspengar mot årlig utdelning. Klassiskt.' },
      { text: 'LÅT INFLATIONEN ÄTA UPP SKULDEN', griev: 6, temp: { stability: -3, qol: -2 }, ind: { infl: 2 }, tip: 'Spararna betalar. De märker det sist.' },
    ],
  },
  {
    id: 'sfi_utland_saljer', icon: '\u{1F4B1}', weight: 2, cooldown: 800, kind: 'kris',
    title: 'UTLÄNNINGARNA SÄLJER VÅRA OBLIGATIONER',
    text: 'Utländska fonder har sålt statsobligationer för motsvarande en tiondel av statsskulden på en månad. Valutan har tappat sju procent, importvarorna blir dyrare och bensinen har blivit dyrare två veckor i rad. Centralbanken vill höja räntan kraftigt för att få pengarna att stanna.',
    when: (c) => c.ratingIdx >= 4 && (c.ind.bondrate ?? 3) > 6 && c.trend('debt') > 1,
    choices: [
      { text: 'LÅT CENTRALBANKEN HÖJA RÄNTAN', griev: 5, temp: { stability: 3 }, ind: { unemp: 0.5, gdpgrowth: -0.6, houseprice: -4 }, tip: 'Valutan räddas. Bolånetagarna gör det inte.' },
      { text: 'FÖRSVARA VALUTAN MED RESERVEN', cost: { money: 900 }, temp: { stability: 4 }, tip: 'Reserven räcker en månad. Spekulanterna har längre andning.' },
      { text: 'INFÖR VALUTAKONTROLL', cost: { pp: 15 }, temp: { statepower: 4, freedom: -3, gdp: -4 }, rel: -4, tip: 'Pengarna kan inte lämna landet. Nya pengar kommer inte heller in.' },
    ],
  },
  {
    id: 'sfi_spekulanter', icon: '\u{1F3B2}', weight: 1, cooldown: 900, kind: 'kris',
    title: 'SPEKULANTERNA SATSAR PÅ KONKURS',
    text: 'En hedgefond i {land} har köpt försäkringar som betalar ut om landet ställer in betalningarna, och berättat om det i en intervju. Sedan dess har priset på sådana försäkringar tredubblats. Ministrarna får samma fråga på varje presskonferens: "Kommer landet att gå i konkurs?"',
    when: (c) => c.ratingIdx >= 5 && c.deficit,
    choices: [
      { text: 'SVARA MED EN TROVÄRDIG SPARPLAN', cost: { pp: 20 }, griev: -3, perm: { income: 2 }, temp: { welfare: -3, approval: -3 }, ind: { trustgov: 2 }, tip: 'Det enda språk spekulanter förstår är siffror.' },
      { text: 'FÖRBJUD SPEKULATIONEN', cost: { pp: 10 }, temp: { statepower: 3, gdp: -2 }, rel: -4, tip: 'Det har prövats förr. Det hjälpte inte så mycket.' },
      { text: 'GARANTERA ATT ALLA SKULDER BETALAS',
        risk: { chance: 0.45,
          win: { text: 'Marknaden tror på dig. Försäkringspriset faller tillbaka.', temp: { stability: 4 } },
          lose: { text: 'Ingen tror på garantin, och den blir ett skämt i finanspressen.', temp: { stability: -5, income: -3 }, griev: 5 } } },
    ],
  },
  {
    id: 'sfi_skuldfallan', icon: '\u{1F300}', weight: 1, cooldown: 1000, kind: 'kris',
    title: 'SKULDFÄLLAN',
    text: 'Ekonomerna kallar det skuldfällan: räntan på skulden är högre än tillväxten, så skulden växer av sig själv även om staten slutar låna helt. Varje år utan förändring gör nästa års åtgärd större. Finansdepartementets prognos visar en kurva som går rakt upp i taket.',
    when: (c) => c.debt > 150 && c.ratingIdx >= 5,
    choices: [
      { text: 'BE LÅNGIVARNA OM OMFÖRHANDLING', cost: { pp: 30 }, perm: { income: 3 }, temp: { stability: -3 }, rel: -5, tip: 'Ett finare ord för att inte betala allt.' },
      { text: 'VÄX UR SKULDEN: SATSA PÅ INDUSTRIN', cost: { money: 600 }, perm: { factory: 2 }, temp: { gdp: 3 }, tip: 'Det fungerar om tillväxten kommer före räntan.' },
      { text: 'HOPPAS PÅ BÄTTRE TIDER', griev: 4, temp: { stability: -3, approval: -2 }, ind: { trustgov: -3 }, tip: 'Hoppet är gratis. Räntan är det inte.' },
    ],
  },
  {
    id: 'sfi_betyg_hojt', icon: '\u{1F4C8}', weight: 2, cooldown: 800,
    title: 'KREDITBETYGET HÖJS',
    text: 'Ratingbyrån har höjt landets kreditbetyg. I motiveringen står ord som "trovärdig finanspolitik" och "starka institutioner". Räntan på statsobligationerna föll på en kvart, och tre utländska pensionsfonder har hört av sig för att köpa mer. Finansministern har köpt bullar till hela departementet.',
    when: (c) => c.ratingIdx <= 1 && !c.deficit && c.trend('debt') < 0 && c.day > 120,
    choices: [
      { text: 'SÄNK SKATTEN LITE SOM BELÖNING', cost: { pp: 10 }, perm: { income: -1 }, temp: { approval: 4 }, tip: 'Väljarna får sin bulle också.' },
      { text: 'LÅNA BILLIGT OCH BYGG JÄRNVÄG', cost: { money: 600 }, perm: { factory: 2, gdp: 1 }, temp: { approval: 2 }, tip: 'Billiga lån till saker som håller i hundra år.' },
      { text: 'HÅLL KURSEN', perm: { stability: 1 }, temp: { approval: 1 }, ind: { trustgov: 2 }, tip: 'Det som fungerar ska man inte laga.' },
    ],
  },
  {
    id: 'sfi_aaa', icon: '\u{1F947}', weight: 1, cooldown: 1500, rare: true,
    title: 'HÖGSTA BETYG: AAA',
    text: 'Landet har fått AAA av alla tre stora ratingbyråer, som en av en handfull stater i världen. Statsobligationerna räknas nu som lika säkra som guld, och finansministern har ramat in beskedet och hängt det på toaletten, "där det syns mest".',
    when: (c) => c.ratingIdx === 0 && c.debt < 40 && c.day > 200,
    choices: [
      { text: 'MARKNADSFÖR LANDET FÖR INVESTERARE', cost: { money: 200 }, mod: 'foreign_investment', temp: { gdp: 2 }, tip: 'Tre bokstäver som öppnar alla dörrar.' },
      { text: 'BJUD FOLKET PÅ TÅRTA', cost: { money: 100 }, temp: { approval: 4, qol: 1 }, tip: 'En tårta med tre A i marsipan.' },
      { text: 'SÄG INGENTING. STABILITET ÄR TRÅKIG', perm: { stability: 2 }, tip: 'De bästa finansministrarna är de som ingen vet namnet på.' },
    ],
  },
  {
    id: 'sfi_ranta_faller', icon: '\u{1F54A}\u{FE0F}', weight: 1, cooldown: 1000,
    title: 'RÄNTAN PÅ STATSLÅNEN ÄR REKORDLÅG',
    text: 'Räntan på landets tioåriga statsobligationer har fallit under två procent, den lägsta nivån i mannaminne. Investerare från hela världen köper, eftersom landet räknas som en säker hamn. Varje gammalt lån som förfaller kan nu lånas om billigare, och budgeten får plötsligt luft.',
    when: (c) => (c.ind.bondrate ?? 3) < 2 && c.ratingIdx <= 2,
    choices: [
      { text: 'LÅNA OM ALLT TILL DEN LÅGA RÄNTAN', cost: { pp: 10 }, perm: { income: 2 }, tip: 'Trettio år med låg ränta. Tråkigt och briljant.' },
      { text: 'LÅNA BILLIGT OCH BYGG SJUKHUS', cost: { money: 500 }, temp: { qol: 3, approval: 3 }, tip: 'Sjukhuset blir billigare än någonsin. Personalen inte.' },
      { text: 'INGET FÖRHASTAT', perm: { stability: 1 }, tip: 'Låga räntor varar inte för evigt. Det gör däremot skulder.' },
    ],
  },

  // ===== RÄDDNING OCH NÖDÅTGÄRDER =====
  {
    id: 'sfi_fonden', icon: '\u{1F30D}', weight: 2, cooldown: 1200, kind: 'kris',
    title: 'VALUTAFONDEN KNACKAR PÅ',
    text: 'Den internationella valutafonden har skickat en delegation till {huvudstad}. De erbjuder ett räddningspaket som räcker till alla löner och lån i ett år, men vill först se böckerna. Gruppchefen är en vänlig man med glasögon som har gjort samma resa till fjorton länder.',
    when: (c) => c.ratingIdx >= 5 && c.ratingIdx <= 7 && (c.deficit || c.debt > 120),
    choices: [
      { text: 'ÖPPNA BÖCKERNA', cost: { pp: 10 }, temp: { ideopower: -2 }, next: 'sfi_fonden_villkor', tip: 'Han har sett värre böcker. Inte många.' },
      { text: 'FRÅGA {GRANNE} I STÄLLET', cost: { pp: 15 }, res: { money: 600 }, rel: 3, temp: { statepower: -3 }, tip: 'Grannar lånar gärna ut. De påminner också gärna.' },
      { text: 'NEJ TACK, VI KLARAR OSS SJÄLVA', temp: { ideopower: 4, approval: 3, stability: -3 }, next: ['sfi_betyg_igen', null], tip: 'Stolthet är en bra drivkraft. Och en dålig budget.' },
    ],
  },
  {
    id: 'sfi_fonden_villkor', icon: '\u{1F4D1}', chain: true, kind: 'kris',
    title: 'VALUTAFONDENS VILLKOR',
    text: 'Räddningspaketet ligger på bordet. Villkoren: en skuldbroms i lag, höjd pensionsålder, tio procent lägre statliga löner och försäljning av statsbolag. Pengarna betalas ut i fyra delar, och före varje del kommer delegationen tillbaka och kontrollerar att löftena hålls.',
    choices: [
      { text: 'SKRIV UNDER ALLT', res: { money: 2000 }, law: ['debt_brake', 'brake'], griev: 12, temp: { approval: -6, welfare: -6 }, ind: { trustgov: -4 }, next: ['sfi_fonden_gatan', 'sfi_fonden_klar'], tip: 'Pengarna kommer. Nedskärningarna också.' },
      { text: 'SKULDBROMS JA, LÖNESÄNKNINGAR NEJ', cost: { pp: 25 }, res: { money: 1200 }, law: ['debt_brake', 'rules'], griev: 5, temp: { approval: -2 }, next: ['sfi_fonden_klar', null], tip: 'Mindre pengar, mindre smärta. Fonden kan leva med det.' },
      { text: 'RIV UPP AVTALET', temp: { ideopower: 3, stability: -5 }, rel: -4, ind: { stockcap: -10 }, next: ['sfi_betyg_igen', null], tip: 'Börsen tar det personligt.' },
    ],
  },
  {
    id: 'sfi_fonden_gatan', icon: '\u{1F4E2}', chain: true, kind: 'kris',
    title: 'FONDENS PAKET NÅR GATAN',
    text: 'Den första delen av räddningspaketet har betalats ut, och nedskärningarna märks. Tjugotusen människor tågar genom {huvudstad} med plakat där fondens namn är överstruket. En sjuksköterska på scenen säger att hon fått lönen i tid för första gången på ett halvår, men tio procent mindre.',
    choices: [
      { text: 'BE FONDEN SKJUTA PÅ LÖNESÄNKNINGEN', cost: { pp: 20 }, griev: -8, temp: { unrest: -3 }, rel: -2, tip: 'Gruppchefen suckar och tar fram en ny blankett.' },
      { text: 'HÅLL FAST VID PAKETET', griev: 6, perm: { income: 2 }, temp: { unrest: 6, approval: -4 }, next: ['sfi_fonden_klar', null], tip: 'Medicinen smakar illa. Så vet man att den verkar, säger fonden.' },
      { text: 'SKYLL PÅ FONDEN', temp: { approval: 2, ideopower: 2 }, rel: -3, ind: { trustgov: -2 }, tip: 'Fonden är van. Det ingår i jobbet.' },
    ],
  },
  {
    id: 'sfi_fonden_klar', icon: '\u{1F305}', chain: true, kind: 'kris',
    title: 'VALUTAFONDEN ÅKER HEM',
    text: 'Tre år efter att räddningspaketet skrevs under åker delegationen hem för sista gången. Budgeten går nästan jämnt ut, räntan på statsobligationerna har halverats och ratingbyrån har höjt betyget två steg. Arbetslösheten är fortfarande högre än före krisen, och många minns vad det kostade.',
    choices: [
      { text: 'BETALA TILLBAKA I FÖRTID', cost: { money: 800 }, rel: 6, perm: { stability: 2 }, tip: 'Det har bara ett fåtal länder gjort. Fonden skickar blommor.' },
      { text: 'HÅLL ETT TAL OM UPPOFFRINGARNA', griev: -10, temp: { approval: 4 }, ind: { trustgov: 3 }, tip: 'Folk vill höra att det var värt det.' },
      { text: 'LÄTTA PÅ NEDSKÄRNINGARNA NU', cost: { pp: 15 }, griev: -8, temp: { welfare: 4, approval: 4 }, perm: { income: -1 }, tip: 'Försiktigt. Fonden har ett långt minne.' },
    ],
  },
  {
    id: 'sfi_sparpaket', icon: '\u{2702}\u{FE0F}', weight: 2, cooldown: 900, kind: 'underskott',
    title: 'REGERINGENS SPARPAKET',
    text: 'Finansdepartementet har tagit fram ett sparpaket på fyrtio punkter. De största: frys alla statliga löner i två år, stäng hälften av myndigheternas lokalkontor och sänk bidragen till kultur och idrott. Det räcker för att stänga underskottet på två år, säger finansministern.',
    when: (c) => c.deficit && c.money < -600 && c.day > 60,
    choices: [
      { text: 'GENOMFÖR HELA PAKETET', cost: { pp: 20 }, griev: -10, perm: { income: 4 }, temp: { welfare: -5, qol: -3, approval: -6 }, ind: { unemp: 0.3 }, next: ['sfi_sparpaket_protest', null], tip: 'Kassan läker. Folket får ont.' },
      { text: 'BARA DET SOM INTE SYNS: LOKALKONTOREN', cost: { pp: 10 }, griev: -4, perm: { income: 2 }, temp: { statepower: -2 }, tip: 'Det syns om ett år, i en by långt borta.' },
      { text: 'SPARA PÅ FÖRSVARET I STÄLLET', griev: -4, perm: { income: 2 }, temp: { milpower: -5, readiness: -4 }, tip: 'Pansarvagnarna står kvar. De rullar bara mindre.' },
    ],
  },
  {
    id: 'sfi_sparpaket_protest', icon: '\u{1FAA7}', chain: true, kind: 'kris',
    title: 'SPARA PÅ ER SJÄLVA',
    text: 'Sparpaketet har slagit igenom. Bibliotek stänger, simhallar säljs och i {stad} har vårdcentralen öppet två dagar i veckan. Fackföreningar, pensionärer och studenter har gått ihop i en rörelse som kallar sig "Spara på er själva" och sitter på trappan till finansdepartementet.',
    choices: [
      { text: 'SÄNK MINISTRARNAS LÖNER MED TJUGO PROCENT', cost: { pp: 10 }, griev: -8, temp: { approval: 5 }, tip: 'Det sparar nästan inget. Det betyder nästan allt.' },
      { text: 'ÖPPNA VÅRDCENTRALERNA IGEN', cost: { money: 400 }, griev: -10, perm: { income: -1 }, temp: { qol: 2 }, tip: 'Den nedskärning som gjorde mest ont backas först.' },
      { text: 'SIFFRORNA ÄR SIFFRORNA', griev: 8, temp: { unrest: 6, approval: -4 }, ind: { protests: 40 }, tip: 'Siffrorna har sällan stått på en trappa i regnet.' },
    ],
  },
  {
    id: 'sfi_nodskatt', icon: '\u{1F4B8}', weight: 2, cooldown: 900, kind: 'skatt',
    title: 'EN TILLFÄLLIG NÖDSKATT',
    text: 'Finansministern föreslår en tillfällig solidaritetsskatt på tre procent av alla inkomster i två år, öronmärkt för att betala tillbaka krediten i banken. Ordet "tillfällig" får oppositionen att skratta: förra tillfälliga skatten infördes för att bygga en bro som stod klar för trettio år sedan.',
    when: (c) => c.deficit && c.money < -400 && !c.is('taxes', 't60'),
    choices: [
      { text: 'INFÖR NÖDSKATTEN', cost: { pp: 20 }, griev: 12, perm: { income: 4 }, temp: { approval: -5 }, ind: { gdpgrowth: -0.3 }, tip: 'Skatten är tillfällig. Det är vi alla.' },
      { text: 'BARA FÖR DE HÖGSTA INKOMSTERNA', cost: { pp: 25 }, griev: 4, perm: { income: 2 }, temp: { approval: 1, gdp: -1 }, tip: 'Mindre pengar, färre arga. Och de arga har advokater.' },
      { text: 'INGA NYA SKATTER', griev: -3, temp: { stability: -3 }, tip: 'Underskottet tackar för förtroendet.' },
    ],
  },
  {
    id: 'sfi_formogenhetsskatt', icon: '\u{1F48E}', weight: 1, cooldown: 1000, kind: 'skatt',
    title: 'EN ENGÅNGSSKATT PÅ DE RIKASTE',
    text: 'Ett förslag har fått fart i riksdagen: en engångsskatt på fem procent av alla förmögenheter över tio miljoner, för att betala av en tiondel av statsskulden på en gång. De rikaste familjerna har redan anlitat advokater i {land}, och en känd industriman hotar att flytta huvudkontoret.',
    when: (c) => c.debt > 100 && c.deficit && c.day > 100,
    choices: [
      { text: 'INFÖR ENGÅNGSSKATTEN', cost: { pp: 25 }, res: { money: 1400 }, griev: 6, mod: 'capital_flight', temp: { approval: 3 }, tip: 'Pengarna kommer. En del av de rika går.' },
      { text: 'GÖR DEN FRIVILLIG, MED EN MEDALJ', res: { money: 200 }, temp: { approval: 1 }, tip: 'Elva familjer betalar. Det blir en fin ceremoni.' },
      { text: 'AVSLÅ FÖRSLAGET', griev: -3, temp: { approval: -3 }, tip: 'Industrimannen stannar. Skulden också.' },
    ],
  },
  {
    id: 'sfi_salja', icon: '\u{1F3F7}\u{FE0F}', weight: 2, cooldown: 1200, kind: 'ekonomi',
    title: 'STATENS BOLAG TILL SALU',
    text: 'Investmentbanken som staten anlitat har gjort en lista: elbolaget, järnvägen, posten och telebolaget är tillsammans värda nästan en fjärdedel av statsskulden. Det finns köpare, både inhemska pensionsfonder och ett energibolag från {land}. Facket på järnvägen har redan börjat måla banderoller.',
    when: (c) => (c.deficit || c.debt > 90) && c.ratingIdx >= 3 && c.day > 90 && !c.is('ownership', 'privatized', 'full', 'oligarch'),
    choices: [
      { text: 'SÄLJ ELBOLAGET TILL HÖGSTBJUDANDE', res: { money: 1500 }, griev: 6, perm: { income: -2 }, next: ['sfi_salja_budstrid', 'sfi_salja_efter'], tip: 'Ett elbolag säljer man bara en gång.' },
      { text: 'BÖRSNOTERA HÄLFTEN AV TELEBOLAGET', cost: { pp: 15 }, res: { money: 800 }, perm: { income: -1 }, temp: { approval: 1 }, ind: { stockcap: 4 }, tip: 'Folkaktien. Halva landet blir delägare i sin egen telefon.' },
      { text: 'INGENTING SÄLJS', griev: -4, temp: { stability: -2 }, tip: 'Familjesilvret stannar i lådan. Räkningarna också.' },
    ],
  },
  {
    id: 'sfi_salja_budstrid', icon: '\u{1F4E9}', chain: true, kind: 'ekonomi',
    title: 'BUDSTRIDEN OM ELBOLAGET',
    text: 'Två budgivare står kvar: en inhemsk pensionsfond som vill behålla personalen, och energibolaget från {land} som bjuder trettio procent mer. Säkerhetspolisen har skickat ett brev märkt HEMLIGT: bolaget från {land} ägs delvis av den staten, och elnätet räknas som samhällsviktigt.',
    choices: [
      { text: 'SÄLJ TILL PENSIONSFONDEN', res: { money: 300 }, temp: { stability: 2, approval: 2 }, tip: 'Mindre pengar. Inga främmande fingrar på strömbrytaren.' },
      { text: 'TA DET HÖGSTA BUDET', res: { money: 900 }, rel: 3, temp: { safety: -3, statepower: -3 }, tip: 'Den som betalar mest får strömbrytaren.' },
      { text: 'BEHÅLL NÄTET, SÄLJ BARA KRAFTVERKEN', cost: { pp: 15 }, res: { money: 500 }, temp: { stability: 1 }, tip: 'En kompromiss som säkerhetspolisen kan sova på.' },
    ],
  },
  {
    id: 'sfi_salja_efter', icon: '\u{1F50C}', chain: true, kind: 'ekonomi',
    title: 'ETT ÅR EFTER FÖRSÄLJNINGEN',
    text: 'Ett år efter försäljningen har elpriset för hushållen stigit med en femtedel. Det nya ägarbolaget har dragit ner på underhållet, och i vintras var {stad} utan ström i två dygn. Bolaget gör rekordvinst, och utdelningen som staten förut fick går nu till aktieägarna.',
    choices: [
      { text: 'INFÖR ETT PRISTAK PÅ EL', cost: { pp: 15 }, law: ['price_controls', 'energycap'], griev: -6, tip: 'Priset hålls nere. Underhållet också, troligen.' },
      { text: 'KÖP TILLBAKA BOLAGET', cost: { money: 1400 }, griev: -10, perm: { income: 1 }, temp: { approval: 4 }, tip: 'Dyrare att köpa än det var att sälja. Det är alltid så.' },
      { text: 'BÖTFÄLL BOLAGET FÖR STRÖMAVBROTTET', res: { money: 200 }, rel: -2, temp: { approval: 2 }, tip: 'Boten blir en rad i årsredovisningen.' },
    ],
  },

  // ===== SEDELPRESSEN OCH HYPERINFLATIONEN =====
  {
    id: 'sfi_sedelpress', icon: '\u{1F5A8}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'underskott',
    title: 'TANKEN PÅ SEDELPRESSEN',
    text: 'En rådgivare har en idé som löser allt på en eftermiddag: låt centralbanken trycka pengarna som saknas och köpa statens obligationer. Centralbankschefen har redan sagt nej i ett brev. Rådgivaren säger att lagen kan ändras, och att ingen förstår inflation förrän den är här.',
    when: (c) => c.deficit && c.money < -600 && !c.is('monetary', 'printing'),
    choices: [
      { text: 'ÄNDRA LAGEN OCH STARTA SEDELPRESSEN', cost: { pp: 20 }, law: ['monetary', 'printing'], res: { money: 1200 }, griev: -6, next: 'sfi_press_priser', tip: 'Pengarna kommer direkt. Notan kommer i butiken.' },
      { text: 'BARA EN GÅNG, BARA DEN HÄR MÅNADEN', cost: { pp: 10 }, res: { money: 600 }, griev: -4, ind: { infl: 1.5 }, next: ['sfi_press_priser', null], tip: 'Den mest kända lögnen i ekonomins historia.' },
      { text: 'LYSSNA PÅ CENTRALBANKSCHEFEN', griev: 4, temp: { stability: 2 }, ind: { trustgov: 1 }, tip: 'Hon är tråkig. Det är därför hon har jobbet.' },
    ],
  },
  {
    id: 'sfi_press_priser', icon: '\u{1F6D2}', chain: true, kind: 'kris',
    title: 'PRISERNA STIGER VARJE VECKA',
    text: 'Sedan centralbanken började köpa statens obligationer har priserna stigit med fyra procent på en månad. Butikerna byter prislappar varje måndag och fredag, och folk köper ris, olja och toalettpapper i förväg. Lönerna kommer i tid nu, men räcker till mindre för varje vecka.',
    choices: [
      { text: 'STÄNG AV SEDELPRESSEN DIREKT', cost: { pp: 20 }, law: ['monetary', 'tight'], griev: -6, temp: { approval: -3 }, ind: { infl: -2, unemp: 0.6 }, tip: 'Det gör ont nu, så att det slutar göra ont sedan.' },
      { text: 'FRYS ALLA PRISER', cost: { pp: 15 }, law: ['price_controls', 'freeze'], griev: -3, ind: { infl: -1 }, next: ['sfi_tomma_hyllor', null], tip: 'Prislapparna står still. Varorna börjar röra sig mot dörren.' },
      { text: 'TRYCK MER, LÖNERNA MÅSTE UPP', res: { money: 800 }, griev: 8, ind: { infl: 4 }, next: ['sfi_hyper', 'sfi_hyper', null], tip: 'Mer pengar som är värda mindre. Matematiken är obarmhärtig.' },
    ],
  },
  {
    id: 'sfi_tomma_hyllor', icon: '\u{1F95B}', chain: true, kind: 'kris',
    title: 'HYLLORNA ÄR TOMMA',
    text: 'Prisstoppet har hållit priserna nere, men varorna har försvunnit från hyllorna. Bönderna säljer hellre mjölken till {granne} än till de frysta priserna, och ett kilo kaffe kostar fyra gånger så mycket på svarta marknaden bakom busstationen. Köerna börjar klockan fem på morgonen.',
    choices: [
      { text: 'SLÄPP PRISSTOPPET', cost: { pp: 15 }, law: ['price_controls', 'utilities'], griev: 3, temp: { qol: 2 }, ind: { infl: 2 }, tip: 'Varorna kommer tillbaka. Till sitt riktiga pris.' },
      { text: 'RANSONERINGSKORT TILL ALLA', cost: { money: 300 }, griev: -4, temp: { statepower: 3, qol: -2 }, tip: 'Ett halvt kilo smör i veckan. Som mormor berättade om.' },
      { text: 'JAGA SVARTHANDLARNA', temp: { unrest: 4, freedom: -3, statepower: 2 }, ind: { crimeidx: -4 }, tip: 'Svarthandlarna flyttar till nästa busstation.' },
    ],
  },
  {
    id: 'sfi_hyper', icon: '\u{1F4B4}', chain: true, kind: 'kris',
    title: 'HYPERINFLATIONEN',
    text: 'En limpa har gått från att kosta en sedel till en bunt sedlar på tre månader. Arbetare får lönen två gånger om dagen och springer till affären på lunchen innan priserna hinner höjas. Barn bygger torn av gamla sedlar på skolgården, och bönderna i {stad} vill ha bensin i stället för pengar.',
    choices: [
      { text: 'NY VALUTA, SEX NOLLOR STRUKNA', cost: { pp: 30 }, law: ['monetary', 'currencyboard'], griev: -10, ind: { infl: -8, unemp: 1, gdpgrowth: -1.5 }, next: ['sfi_valutareform', null], tip: 'En ny sedel med en ny hjälte på. Och en hård regel bakom.' },
      { text: 'BYT TILL EN UTLÄNDSK VALUTA', cost: { pp: 25 }, law: ['monetary', 'dollarization'], griev: -8, temp: { ideopower: -6 }, ind: { infl: -8, gdpgrowth: -1 }, tip: 'Priserna slutar stiga. Någon annans centralbank bestämmer räntan.' },
      { text: 'FORTSÄTT TRYCKA', res: { money: 1000 }, griev: 15, temp: { unrest: 10, stability: -8 }, ind: { infl: 8 }, next: ['sfi_byteshandel', null], tip: 'Tryckeriet går på tre skift. Det är det enda som går bra.' },
    ],
  },
  {
    id: 'sfi_byteshandel', icon: '\u{1F95A}', chain: true, kind: 'kris',
    title: 'PENGARNA ÄR VÄRDELÖSA',
    text: 'Ingen tar längre emot landets egen valuta. På marknaden i {stad} betalar man med ägg, bensin och utländska sedlar. Lärarna har bett om lönen i mjöl, och en tandläkare tar betalt i kaffe. Staten kan inte längre ta in skatt i något som är värt någonting.',
    choices: [
      { text: 'NY VALUTA OCH NÖDBUDGET PÅ EN GÅNG', cost: { pp: 40 }, law: ['monetary', 'currencyboard'], griev: -15, ind: { infl: -10, unemp: 1.2 }, next: 'sfi_valutareform', tip: 'Allt på en gång. Det är så det brukar sluta.' },
      { text: 'TA EMOT SKATT I UTLÄNDSKA SEDLAR', cost: { pp: 15 }, law: ['monetary', 'dollarization'], griev: -5, temp: { ideopower: -5 }, ind: { infl: -6 }, tip: 'Statskassan fylls med andras pengar.' },
      { text: 'BETALA LÖNERNA I MAT FRÅN STATENS LAGER', griev: -4, temp: { approval: 2, gdp: -5, factory: -4 }, tip: 'Ett kilo mjöl, en liter olja och en klapp på axeln.' },
    ],
  },
  {
    id: 'sfi_valutareform', icon: '\u{1FA99}', chain: true, kind: 'kris',
    title: 'DEN NYA VALUTAN',
    text: 'I måndags växlades de gamla sedlarna mot nya, med sex nollor strukna. Folk stod i kö utanför bankerna med sopsäckar fulla av pengar och gick därifrån med ett kuvert. Priserna har slutat stiga för första gången på ett år, men sparpengarna är borta för gott, och det minns alla.',
    choices: [
      { text: 'KOMPENSERA DEM SOM FÖRLORAT MEST', cost: { money: 600 }, griev: -10, temp: { approval: 3 }, tip: 'Inte allt. Men något. Det är viktigt för förtroendet.' },
      { text: 'FÖRBJUD STATEN ATT LÅNA, I GRUNDLAGEN', cost: { pp: 20 }, law: ['debt_brake', 'debtban'], ind: { trustgov: 3 }, tip: 'Ett löfte som är svårt att bryta. Det är hela poängen.' },
      { text: 'ALLA BÖRJAR OM FRÅN NOLL', griev: 4, temp: { stability: 3, approval: -2 }, tip: 'Rättvist för alla som inte hade sparat något.' },
    ],
  },
  {
    id: 'sfi_inflation_skenar', icon: '\u{1F525}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'INFLATIONEN SKENAR',
    text: 'Inflationen har passerat femton procent och stiger fortfarande. Pensionärerna ser sina besparingar krympa varje månad, facken kräver löneökningar som följer priserna och företagen höjer priserna för att betala lönerna. Ekonomerna kallar det en pris- och lönespiral, och den snurrar fortare för varje varv.',
    when: (c) => (c.ind.infl ?? 2) > 15 || (c.is('monetary', 'printing', 'qe') && (c.ind.infl ?? 2) > 5),
    choices: [
      { text: 'CENTRALBANKEN HÖJER RÄNTAN KRAFTIGT', cost: { pp: 15 }, law: ['monetary', 'tight'], griev: 4, ind: { infl: -3, unemp: 0.8, gdpgrowth: -1 }, tip: 'Recept: en lågkonjunktur. Biverkning: priserna slutar stiga.' },
      { text: 'ETT AVTAL MELLAN STAT, FACK OCH FÖRETAG', cost: { pp: 25 }, griev: -4, temp: { stability: 2 }, ind: { infl: -2 }, tip: 'Alla avstår lite samtidigt. Svårt att få till, värt det.' },
      { text: 'KOPPLA LÖNER OCH PENSIONER TILL PRISERNA', griev: -6, perm: { income: -1 }, ind: { infl: 2 }, next: ['sfi_hyper', null], tip: 'Ingen tappar köpkraft. Spiralen får en motor.' },
    ],
  },
  {
    id: 'sfi_centralbank_avgar', icon: '\u{1F3E6}', weight: 2, cooldown: 800,
    kind: 'ekonomi', react: true,
    title: 'CENTRALBANKSCHEFEN AVGÅR',
    text: 'Centralbankschefen har lämnat in sin avskedsansökan med ett brev som läckte till pressen inom en timme: "Jag kan inte stå för en penningpolitik som skrivs av finansdepartementet." Valutan föll fyra procent under förmiddagen. Hennes ställföreträdare säger att han gärna tar över.',
    when: (c) => c.changed('monetary') && c.is('monetary', 'printing', 'repression', 'qe', 'loose'),
    choices: [
      { text: 'BE HENNE STANNA OCH BACKA BESLUTET', cost: { pp: 20 }, undo: 'monetary', griev: -6, temp: { stability: 2 }, ind: { infl: -0.5 }, tip: 'Valutan återhämtar sig på en eftermiddag.' },
      { text: 'UTSE STÄLLFÖRETRÄDAREN', temp: { statepower: 3 }, ind: { infl: 1.5, stockcap: -4 }, tip: 'Han håller med om allt. Det är just det som är problemet.' },
      { text: 'TACKA FÖR LÅNG OCH TROGEN TJÄNST', griev: 3, temp: { stability: -2 }, ind: { infl: 0.8 }, tip: 'Hon skriver en bok. Den blir en bästsäljare.' },
    ],
  },
  {
    id: 'sfi_valutavaxlare', icon: '\u{1F4B5}', weight: 1, cooldown: 900, kind: 'kris',
    title: 'VÄXLARNA PÅ GATAN',
    text: 'Utanför centralstationen i {huvudstad} står män i läderjackor och viskar "dollar, dollar" åt förbipasserande. På svarta marknaden kostar en utländsk sedel nästan dubbelt så mycket som bankens officiella kurs. Alla som kan har slutat spara i landets egen valuta.',
    when: (c) => c.ratingIdx >= 6 || (c.ind.infl ?? 2) > 20,
    choices: [
      { text: 'SLÄPP KURSEN FRI', griev: 4, temp: { stability: -2 }, perm: { corruption: -1 }, ind: { infl: 3, gdpgrowth: -0.5 }, tip: 'Den officiella kursen blir sann. Det gör ont en vecka.' },
      { text: 'GRIP VÄXLARNA', cost: { pp: 10 }, temp: { statepower: 3, freedom: -2 }, ind: { crimeidx: -3 }, tip: 'Nya växlare står där i morgon. Med nya jackor.' },
      { text: 'LÅT BANKERNA SÄLJA VALUTA FRITT', cost: { pp: 15 }, perm: { corruption: -2 }, temp: { gdp: 2 }, tip: 'Svarta marknaden blir en vanlig marknad. Med kvitto.' },
    ],
  },

  // ===== PANIK OCH REVOLT =====
  {
    id: 'sfi_rusning', icon: '\u{1F6A8}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'KÖER UTANFÖR BANKERNA',
    text: 'Ett rykte på sociala medier säger att staten ska frysa alla bankkonton för att betala sina skulder. Sedan i morse står det köer utanför varje bankkontor i {huvudstad}. Bankomaterna är tomma före lunch, och en av de mindre bankerna har stängt dörrarna "av tekniska skäl".',
    when: (c) => c.ratingIdx >= 5 && (c.deficit || c.st.stability < -20),
    choices: [
      { text: 'GARANTERA ALLA INSÄTTNINGAR', cost: { pp: 20 }, griev: -6, temp: { stability: 4 }, perm: { income: -1 }, next: ['sfi_rusning_lugn', 'sfi_rusning_lugn', 'sfi_rusning_dag2'], tip: 'Ett löfte från staten. Hoppas att någon tror på det.' },
      { text: 'STÄNG BANKERNA I TRE DAGAR', griev: 6, temp: { stability: -3, approval: -5, freedom: -2 }, ind: { stockcap: -8 }, next: ['sfi_rusning_dag2', 'sfi_rusning_lugn'], tip: 'Ingen kan ta ut pengar. Det lugnar inte någon.' },
      { text: 'DEMENTERA RYKTET I TV', next: [null, 'sfi_rusning_dag2'],
        risk: { chance: 0.45,
          win: { text: 'Köerna krymper. Folk går hem och skäms lite.', temp: { stability: 3 } },
          lose: { text: 'Ingen tror på dementin. Köerna blir längre.', temp: { stability: -5 }, griev: 6 } } },
    ],
  },
  {
    id: 'sfi_rusning_dag2', icon: '\u{1F3E6}', chain: true, kind: 'kris',
    title: 'BANKHELGEN',
    text: 'Bankerna öppnade igen efter helgen, och köerna var längre än förut. Den största banken har bara kontanter till en fjärdedel av kundernas insättningar om alla vill ta ut samtidigt. Bankdirektören sitter i ditt väntrum med en mapp och ber om ett nödlån från staten före klockan tre.',
    choices: [
      { text: 'NÖDLÅN TILL BANKEN', cost: { money: 1000 }, griev: -6, temp: { stability: 4 }, next: ['sfi_rusning_lugn', null], tip: 'Bankdirektören tackar. Han behåller också sin bonus.' },
      { text: 'FÖRSTATLIGA BANKEN', cost: { pp: 30 }, law: ['banking', 'nationalized'], griev: -4, temp: { stability: 3, statepower: 4 }, tip: 'Nu äger staten en bank. Och alla dess lån.' },
      { text: 'LÅT BANKEN GÅ OMKULL', griev: 12, temp: { stability: -8, unrest: 6 }, ind: { unemp: 0.8, stockcap: -15, gdpgrowth: -1.2 }, next: 'sfi_rusning_kollaps', tip: 'Marknaden ska städa själv. Med en mycket stor kvast.' },
    ],
  },
  {
    id: 'sfi_rusning_kollaps', icon: '\u{1F4A5}', chain: true, kind: 'kris',
    title: 'BANKEN ÄR BORTA',
    text: 'Landets näst största bank har gått i konkurs. Två miljoner kunder kommer inte åt sina pengar, tusentals företag kan inte betala löner och i {stad} tar butikerna bara emot kontanter. Utanför bankens huvudkontor står folk tysta med skyltar där de skrivit hur mycket de hade sparat.',
    choices: [
      { text: 'STATEN ERSÄTTER ALLA SPARARE', cost: { money: 1500 }, griev: -15, temp: { stability: 3 }, perm: { income: -1 }, tip: 'Spararna räddas. Skattebetalarna, som är samma människor, betalar.' },
      { text: 'ERSÄTT UPP TILL ETT TAK', cost: { money: 600 }, griev: -6, temp: { approval: -2 }, tip: 'De flesta får tillbaka allt. De som hade mest får vänta.' },
      { text: 'STRÄNGARE BANKREGLER, INGA PENGAR', law: ['banking', 'strict'], griev: 8, temp: { approval: -6, unrest: 6 }, tip: 'Nästa bank blir säkrare. Den här är fortfarande borta.' },
    ],
  },
  {
    id: 'sfi_rusning_lugn', icon: '\u{1F6CF}\u{FE0F}', chain: true, kind: 'kris',
    title: 'KÖERNA ÄR BORTA',
    text: 'En vecka efter paniken är köerna borta. Garantin höll, bankerna fick tid att låna och de flesta som tog ut sina pengar har satt in dem igen. En pensionär i {stad} berättar i lokalradion att hon hade madrassen full av sedlar i fyra dagar och inte sov en blund.',
    choices: [
      { text: 'INFÖR EN PERMANENT INSÄTTNINGSGARANTI', cost: { pp: 15 }, griev: -4, perm: { stability: 2 }, tip: 'Nästa rykte möts av en axelryckning.' },
      { text: 'LÅT BANKERNA BETALA FÖR GARANTIN', res: { money: 300 }, temp: { gdp: -1 }, tip: 'En avgift per konto. Bankerna klagar, men betalar.' },
      { text: 'UTRED VEM SOM SPRED RYKTET', temp: { statepower: 2, freedom: -2 }, tip: 'Det visar sig vara en sjuttonåring med för mycket fritid.' },
    ],
  },
  {
    id: 'sfi_kapitalflykt', icon: '\u{1F6EB}', weight: 2, cooldown: 700,
    kind: 'skatt', react: true,
    title: 'FÖRETAGEN FLYTTAR UTOMLANDS',
    text: 'Sedan beslutet om {lag} har tre av landets tio största företag flyttat sina huvudkontor till {land}, och privatbankerna rapporterar att förmögna kunder för över sina pengar utomlands. Valutan har försvagats i fyra veckor. Näringslivet har köpt helsidesannonser med texten "Sista man släcker ljuset".',
    when: (c) => c.cut('corporate_tax', 'taxes', 'inheritance_tax') && (c.ratingIdx >= 3 || c.deficit),
    choices: [
      { text: 'BACKA ÄNDRINGEN AV {LAG}', cost: { pp: 20 }, undo: true, griev: -10, temp: { approval: -3 }, ind: { stockcap: 5 }, tip: 'Huvudkontoren kommer kanske tillbaka. Förtroendet tar längre tid.' },
      { text: 'INFÖR EN UTFLYTTNINGSSKATT', cost: { pp: 15 }, law: ['emigration', 'exittax'], temp: { statepower: 2 }, rel: -3, tip: 'Den som vill lämna landet får betala för dörren.' },
      { text: 'LÅT DEM GÅ — DE SOM STANNAR BETALAR', griev: 4, mod: 'capital_flight', temp: { approval: 2 }, ind: { stockcap: -10, unemp: 0.3 }, tip: 'Populärt på torget. Mindre populärt på arbetsförmedlingen.' },
    ],
  },
  {
    id: 'sfi_skattevagran', icon: '\u{1F525}', weight: 2, cooldown: 900,
    kind: 'skatt', react: true,
    title: 'VI BETALAR INTE',
    text: 'Sedan ändringen av {lag} har en rörelse vuxit fram som uppmanar alla att vägra betala. På torget i {stad} brände ett hundratal småföretagare sina skattsedlar i en tunna, och en populär bloggare har räknat ut att om var tionde vägrar hinner Skatteverket inte driva in allt.',
    when: (c) => c.cut('taxes', 'corporate_tax', 'inheritance_tax', 'price_controls', 'cash') && c.grievOf('skatt') > 12,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 25 }, undo: true, griev: -20, temp: { approval: 3, statepower: -3 }, tip: 'Rörelsen firar. Nästa rörelse antecknar hur det gick till.' },
      { text: 'SÄNK SKATTEN FÖR SMÅFÖRETAGARE', cost: { pp: 15 }, griev: -8, perm: { income: -1 }, tip: 'Frisörerna är nöjda. Bloggaren letar efter ett nytt ämne.' },
      { text: 'DRIV IN VARJE KRONA', griev: 6, temp: { statepower: 3, unrest: 5, approval: -3 }, next: ['sfi_skattestrejk', 'sfi_skattestrejk', null], tip: 'Kronofogden har aldrig haft så mycket att göra.' },
    ],
  },
  {
    id: 'sfi_skattestrejk', icon: '\u{1F4E3}', chain: true, kind: 'skatt',
    title: 'SKATTESTREJKEN SPRIDER SIG',
    text: 'Skattevägrarna har blivit fler. Var sjunde småföretagare har inte betalat in momsen i tid, och Skatteverkets kontor i {stad} har fått stänga sedan demonstranter tömt pärmar över golvet. Statens skatteintäkter för månaden ligger en sjättedel under prognosen.',
    choices: [
      { text: 'AMNESTI FÖR DEN SOM BETALAR INOM EN MÅNAD', cost: { pp: 15 }, griev: -10, temp: { income: 3 }, tip: 'De flesta betalar. De vill mest bli lämnade i fred.' },
      { text: 'KRONOFOGDEN MED POLISESKORT', griev: 8, temp: { statepower: 4, unrest: 7, freedom: -3 }, next: ['sfi_skatteuppror', null], tip: 'Bilderna på polisen i frisersalongen blir inte bra.' },
      { text: 'FOLKOMRÖSTNING OM SKATTEN', cost: { money: 200 },
        risk: { chance: 0.5,
          win: { text: 'Folket säger ja till skatten med knapp marginal. Vägrarna tystnar.', griev: -15, temp: { stability: 3 } },
          lose: { text: 'Folket säger nej. Skatten åker ut och hålet i budgeten blir kvar.', undo: true, griev: -10, temp: { income: -4 } } } },
    ],
  },
  {
    id: 'sfi_skatteuppror', icon: '\u{1F69C}', chain: true, kind: 'skatt',
    title: 'TRAKTORERNA BLOCKERAR VÄGARNA',
    text: 'I tre landskap har skattevägrarna bildat egna medborgarkommittéer som blockerar vägarna till Skatteverkets kontor med traktorer. Polisen i {stad} säger att den inte har folk nog att ta sig igenom. Kommittéerna kräver att skatten tas bort och att finansministern avgår.',
    choices: [
      { text: 'FINANSMINISTERN AVGÅR, SKATTEN BACKAS', cost: { pp: 20 }, undo: true, griev: -18, temp: { stability: 2, approval: 2 }, tip: 'En minister mindre. En traktorkö mindre.' },
      { text: 'MILITÄREN RÖJER VÄGARNA', cost: { man: 6 }, griev: 10, temp: { statepower: 5, unrest: 10, freedom: -5, approval: -6 }, ind: { trustgov: -6, demo: -0.2 }, tip: 'Stridsvagnar mot traktorer. Ingen vinner den bilden.' },
      { text: 'VÄNTA UT DEM, SKÖRDEN MÅSTE IN', griev: 4, temp: { income: -4, stability: -3 }, tip: 'Traktorerna behövs på åkern i september.' },
    ],
  },
  {
    id: 'sfi_pensionsfond', icon: '\u{1F9F3}', weight: 2, cooldown: 1200, kind: 'underskott',
    title: 'FINGRARNA I PENSIONSFONDEN',
    text: 'Den statliga pensionsfonden har tillgångar värda en tredjedel av BNP, sparade åt dem som går i pension om trettio år. Finansdepartementet föreslår att staten lånar en tiondel för att täcka underskottet, mot ett skuldebrev till fonden. Fondens styrelse har inte blivit tillfrågad.',
    when: (c) => c.deficit && c.money < -300 && !c.is('pensions', 'none', 'filial'),
    choices: [
      { text: 'LÅNA UR FONDEN', res: { money: 1500 }, griev: -10, temp: { approval: -2 }, ind: { trustgov: -3 }, next: ['sfi_pensionsfond_hal', 'sfi_pensionsfond_hal', null], tip: 'Pengarna finns ju där. Det är just det som är frestelsen.' },
      { text: 'LÅNA HÄLFTEN, MED RIKTIG RÄNTA', cost: { pp: 10 }, res: { money: 700 }, griev: -5, perm: { income: -1 }, tip: 'Ett riktigt lån med ett riktigt datum för återbetalning.' },
      { text: 'FONDEN ÄR HELIG', griev: 4, temp: { stability: 2 }, ind: { trustgov: 1 }, tip: 'Framtidens pensionärer tackar. De vet inte om det än.' },
    ],
  },
  {
    id: 'sfi_pensionsfond_hal', icon: '\u{1F4F0}', chain: true, kind: 'underskott',
    title: 'DE LÅNADE DIN PENSION',
    text: 'En granskning i landets största dagstidning visar att statens skuldebrev till pensionsfonden saknar återbetalningsdag. Pensionärsorganisationerna har stämt staten och fått med sig facken. Under rubriken "De lånade din pension" visar tidningen hur mycket varje fyrtioåring har förlorat.',
    choices: [
      { text: 'BETALA TILLBAKA MED RÄNTA PÅ TIO ÅR', cost: { pp: 15 }, griev: -8, perm: { income: -2 }, temp: { approval: 3 }, tip: 'Ett datum på skuldebrevet. Äntligen.' },
      { text: 'BETALA TILLBAKA DIREKT', cost: { money: 1200 }, griev: -14, ind: { trustgov: 3 }, tip: 'Hålet i fonden är lagat. Hålet i kassan är tillbaka.' },
      { text: 'LÅT DOMSTOLEN AVGÖRA',
        risk: { chance: 0.4,
          win: { text: 'Domstolen ger staten rätt. Lånet var lagligt, om än fult.', temp: { statepower: 2, approval: -2 } },
          lose: { text: 'Domstolen dömer staten att betala tillbaka allt med dröjsmålsränta.', temp: { income: -6, approval: -3 }, griev: 4 } } },
    ],
  },
  {
    id: 'sfi_hungermarsch', icon: '\u{1F6B6}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'HUNGERMARSCHEN',
    text: 'Från fyra städer har tusentals arbetslösa, pensionärer och studenter vandrat i en vecka mot {huvudstad}. De kallar det hungermarschen och har en enda banderoll: "ARBETE OCH BRÖD". När de kommer fram i morgon väntas hundratusen människor på torget framför parlamentet.',
    when: (c) => c.grievOf('kris') > 35,
    choices: [
      { text: 'TA EMOT DEM OCH LOVA ETT KRISPAKET', cost: { money: 800, pp: 10 }, griev: -15, temp: { unrest: -6, approval: 3 }, tip: 'Ett löfte inför hundratusen vittnen. Det måste hållas.' },
      { text: 'TALA TILL MASSORNA SJÄLV', cost: { pp: 15 },
        risk: { chance: 0.5,
          win: { text: 'Talet träffar rätt. Folk går hem med hopp, och du med ett uppdrag.', griev: -10, temp: { approval: 5 } },
          lose: { text: 'Visslingarna överröstar dig. Bilderna går jorden runt.', griev: 6, temp: { approval: -5, unrest: 5 } } } },
      { text: 'SPÄRRA AV TORGET', griev: 10, temp: { unrest: 8, freedom: -4, statepower: 3 }, ind: { trustgov: -5, protests: 40 }, next: ['sfi_kravall', 'sfi_kravall', null], tip: 'Hundratusen människor och ett staket. Vad kan gå fel?' },
    ],
  },
  {
    id: 'sfi_kravall', icon: '\u{1F6A8}', chain: true, kind: 'kris',
    title: 'NATTEN EFTER HUNGERMARSCHEN',
    text: 'Avspärrningen höll i två timmar. Sedan bröt sig en grupp igenom, och natten blev den oroligaste i {huvudstad} på decennier: brinnande containrar, krossade skyltfönster och sexhundra gripna. I morse samlas folk med sopkvastar för att städa, och oppositionen kräver regeringens avgång.',
    choices: [
      { text: 'KRISREGERING MED OPPOSITIONEN', cost: { pp: 30 }, mod: 'national_unity', griev: -12, temp: { stability: 3 }, tip: 'Alla partier i samma båt. Ingen får skylla på någon.' },
      { text: 'UNDANTAGSTILLSTÅND', griev: 8, temp: { statepower: 6, freedom: -8, unrest: -4 }, ind: { demo: -0.4, trustgov: -6 }, tip: 'Gatorna blir lugna. Det blir inte folket.' },
      { text: 'ETT KRISPAKET OCH EN UTREDNING', cost: { money: 900 }, griev: -10, temp: { unrest: -4 }, tip: 'Pengar nu, svar om två år.' },
    ],
  },

  // ===== SKATTERNA =====
  {
    id: 'sfi_moms', icon: '\u{1F6D2}', weight: 2, cooldown: 800,
    kind: 'skatt', react: true,
    title: 'HANDELN FLYR TILL {GRANNE}',
    text: 'Sedan beslutet om {lag} har handeln i {stad} sett försäljningen falla med en tiondel. Folk åker över gränsen till {granne} för att handla, och bussar fulla med pensionärer kommer hem med smör, kaffe och tvättmedel. Handelsfacket varnar för varsel inom ett halvår.',
    when: (c) => c.cut('taxes') && (c.deficit || c.grievOf('skatt') > 10),
    choices: [
      { text: 'BACKA ÄNDRINGEN AV {LAG}', cost: { pp: 20 }, undo: true, griev: -15, temp: { income: -3 }, tip: 'Smöret blir billigt igen. Underskottet blir det inte.' },
      { text: 'SÄNK MATMOMSEN, BEHÅLL RESTEN', cost: { pp: 10 }, griev: -6, perm: { income: -1 }, tip: 'Smöret stannar hemma. Tvättmedlet åker fortfarande buss.' },
      { text: 'STÅ FAST', griev: 6, temp: { approval: -3 }, ind: { unemp: 0.2, gdpgrowth: -0.2 }, tip: 'Grannlandets butiker skickar ett tackkort.' },
    ],
  },
  {
    id: 'sfi_skatt_fungerar', icon: '\u{1F4CA}', weight: 2, cooldown: 900, kind: 'skatt',
    title: 'DE NYA SKATTERNA BÄR FRUKT',
    text: 'Det har gått några månader sedan ändringen av {lag}, och de första siffrorna har kommit. Skatteintäkterna har ökat mer än beräknat, underskottet har krympt och ratingbyrån skriver om "en ansvarsfull regering". Klagomålen hörs fortfarande, men lite lägre för varje vecka.',
    when: (c) => c.cut('taxes', 'corporate_tax', 'inheritance_tax') && !c.deficit && c.day > 120,
    choices: [
      { text: 'LÄGG PENGARNA PÅ SKOLAN', cost: { money: 300 }, griev: -6, temp: { qol: 3, approval: 3 }, tip: 'Folk betalar gärnare när de ser vad det blir.' },
      { text: 'BETALA AV PÅ SKULDEN', cost: { money: 500 }, griev: -3, perm: { stability: 1 }, ind: { trustgov: 2 }, tip: 'Ingen ser det. Alla långivare ser det.' },
      { text: 'TACKA SKATTEBETALARNA I ETT TAL', griev: -3, temp: { approval: 2 }, tip: 'Ett tack kostar inget. Det märks ändå.' },
    ],
  },
  {
    id: 'sfi_svartjobb', icon: '\u{1F9F1}', weight: 1, cooldown: 900, kind: 'skatt',
    title: 'SVARTJOBBEN BLIR FLER',
    text: 'Skatteverket har gjort stickprov hos frisörer, byggfirmor och restauranger i {stad}. Var fjärde betalar delar av lönerna svart, och kontanterna har kommit tillbaka sedan skatterna höjdes. En hantverkare säger öppet i tv att "ingen med vett tar betalt vitt längre".',
    when: (c) => (c.grievOf('skatt') > 15 || c.is('taxes', 't40', 't60')) && (c.ind.taxevasion ?? 20) > 15,
    choices: [
      { text: 'FLER SKATTEREVISORER', cost: { money: 250 }, perm: { income: 2 }, temp: { approval: -1 }, tip: 'Varje revisor tar in tio gånger sin lön. Ingen bjuder dem på fika.' },
      { text: 'SÄNK SKATTEN PÅ HANTVERKSTJÄNSTER', cost: { pp: 10 }, griev: -6, perm: { income: -1 }, temp: { approval: 3 }, tip: 'Vitt blir billigare än svart. Hantverkaren byter åsikt.' },
      { text: 'TAK FÖR KONTANTBETALNINGAR', law: ['cash', 'limits'], perm: { income: 1 }, temp: { freedom: -2 }, tip: 'Sedlarna blir färre. Kortläsarna fler.' },
    ],
  },
  {
    id: 'sfi_skattesankning', icon: '\u{1F4C9}', weight: 2, cooldown: 800,
    kind: 'skatt', react: true,
    title: 'SÄNKNINGEN SOM INTE BETALADE SIG',
    text: 'När {lag} ändrades lovade regeringen att lägre skatter skulle betala sig själva genom högre tillväxt. Nu visar finansdepartementets egen rapport att tillväxten blev lite högre men skatteintäkterna lägre, och underskottet har vuxit med nästan exakt vad sänkningen kostade.',
    when: (c) => c.raised('taxes', 'corporate_tax', 'inheritance_tax') && (c.deficit || c.trend('debt') > 2),
    choices: [
      { text: 'BACKA SÄNKNINGEN', cost: { pp: 20 }, undo: true, griev: 4, temp: { approval: -4 }, tip: 'Ingen gillar en skattehöjning. Inte ens en tillbakagång.' },
      { text: 'GE DEN ETT ÅR TILL',
        risk: { chance: 0.35,
          win: { text: 'Investeringarna kommer till slut och skatteintäkterna växer ikapp.', temp: { gdp: 4, income: 3 } },
          lose: { text: 'Ett år till med lägre intäkter. Hålet i budgeten har vuxit.', temp: { income: -4, stability: -2 } } } },
      { text: 'SKÄR I UTGIFTERNA I STÄLLET', cost: { pp: 15 }, perm: { income: 2 }, temp: { welfare: -4, approval: -2 }, tip: 'Skatten blir låg. Det blir köerna på vårdcentralen också, fast tvärtom.' },
    ],
  },
  {
    id: 'sfi_bankskatt', icon: '\u{1F4B0}', weight: 1, cooldown: 1000, kind: 'skatt',
    title: 'BANKERNA GÖR REKORDVINST',
    text: 'Medan staten lånar till höga räntor gör bankerna rekordvinst på samma räntor. Storbankernas vinster har fördubblats på två år, och cheferna får bonusar som motsvarar trettio sjuksköterskelöner. Oppositionen föreslår en särskild bankskatt. Bankföreningen varnar för att lånen då blir dyrare för alla.',
    when: (c) => (c.ind.bondrate ?? 3) > 4 && (c.deficit || c.debt > 80) && (c.ind.stockcap ?? 50) > 40 && c.ratingIdx >= 2,
    choices: [
      { text: 'INFÖR EN TILLFÄLLIG BANKSKATT', cost: { pp: 15 }, res: { money: 700 }, griev: -4, temp: { approval: 3 }, ind: { stockcap: -4 }, tip: 'Bankerna betalar. Och höjer avgiften på kortet.' },
      { text: 'BE BANKERNA SÄNKA RÄNTAN FRIVILLIGT',
        risk: { chance: 0.3,
          win: { text: 'Bankerna sänker räntan för småföretag. Pressen är mer imponerad än du.', temp: { approval: 3, gdp: 2 } },
          lose: { text: 'Bankerna skickar ett vänligt brev och höjer bonusarna.', temp: { approval: -3 } } } },
      { text: 'BANKERNA FÅR BEHÅLLA VINSTERNA', temp: { approval: -3 }, ind: { stockcap: 3 }, tip: 'Aktieägarna jublar. De är inte så många.' },
    ],
  },

  // ===== STATSBANKRUTTEN =====
  {
    id: 'sfi_konkurs_nara', icon: '\u{1F4EE}', weight: 2, cooldown: 600,
    kind: 'underskott', react: true,
    title: 'SISTA PÅMINNELSEN FRÅN BANKEN',
    text: 'Banken har skickat ett brev med röd stämpel: avbetalningarna måste betalas fullt ut, annars börjar räkningen mot statsbankrutt. Tre missade betalningar i rad och landet förklaras insolvent. Kassaprognosen visar att pengarna inte räcker. Ministrarna har slutat gå hem på kvällarna.',
    when: (c) => c.deficit && c.ratingIdx >= 6 && c.ratingIdx <= 7,
    choices: [
      { text: 'SÄLJ GULDRESERVEN', res: { money: 1200 }, griev: -6, temp: { stability: -2, ideopower: -3 }, tip: 'Guldet har legat i källaren i hundra år. Nu åker det.' },
      { text: 'STOPPA ALLA UTGIFTER UTOM LÖNERNA', cost: { pp: 20 }, griev: 4, perm: { income: 3 }, temp: { welfare: -6, qol: -3, approval: -5 }, tip: 'Landet står still, men betalar banken.' },
      { text: 'RING VALUTAFONDEN', temp: { ideopower: -3 }, next: 'sfi_fonden_villkor', tip: 'Gruppchefen med glasögonen svarar på första signalen.' },
    ],
  },
  {
    id: 'sfi_konkurs', icon: '\u{1F4A5}', weight: 3, cooldown: 1500,
    kind: 'kris', react: true,
    title: 'STATSBANKRUTT',
    text: 'Det har hänt. Efter tre missade betalningar har landet förklarats insolvent, och banken har strukit halva skulden. Morgontidningarnas förstasidor är helt svarta. Ingen långivare i världen vill låna ut något på ett år, och allt staten köper måste betalas kontant, i förskott.',
    when: (c) => c.ratingIdx === 8,
    choices: [
      { text: 'SAMLA ALLA PARTIER I EN KRISREGERING', cost: { pp: 30 }, mod: 'national_unity', griev: -10, next: ['sfi_konkurs_forhandling', null], tip: 'Ingen vill ha skulden. Alla får dela på den.' },
      { text: 'NÖDBUDGET: BARA LÖNER, VÅRD OCH MAT', cost: { pp: 15 }, griev: 6, perm: { income: 3 }, temp: { welfare: -6, qol: -4 }, next: 'sfi_konkurs_forhandling', tip: 'Allt annat får vänta. Det mesta är annat.' },
      { text: 'SKYLL PÅ BANKERNA OCH UTLANDET', temp: { ideopower: 5, approval: 3 }, rel: -8, next: ['sfi_konkurs_isolering', null], tip: 'Det känns bra i en vecka. Sedan kommer räkningen.' },
    ],
  },
  {
    id: 'sfi_konkurs_forhandling', icon: '\u{1F91D}', chain: true, kind: 'kris',
    title: 'FORDRINGSÄGARNA VID BORDET',
    text: 'I en konferenssal i {land} sitter representanter för hundratals långivare: pensionsfonder, banker och några hedgefonder som köpt skulden billigt. De vill ha nya obligationer i utbyte mot de gamla. Ju mer du erbjuder nu, desto snabbare får landet låna igen.',
    choices: [
      { text: 'GENERÖST ERBJUDANDE, SNABB ÅTERKOMST', cost: { money: 800 }, rel: 6, temp: { stability: 2 }, next: 'sfi_konkurs_tillbaka', tip: 'Dyrt nu. Billigare lån sedan.' },
      { text: 'HÅRT ERBJUDANDE: DE FÅR TJUGO PROCENT', cost: { pp: 20 }, perm: { income: 2 }, rel: -6, next: ['sfi_konkurs_tillbaka', 'sfi_konkurs_isolering'], tip: 'Argentina har gjort så. Flera gånger.' },
      { text: 'INGET ERBJUDANDE ALLS', rel: -10, temp: { ideopower: 3, stability: -3 }, next: 'sfi_konkurs_isolering', tip: 'Långivarna har advokater. Och tålamod.' },
    ],
  },
  {
    id: 'sfi_konkurs_isolering', icon: '\u{2693}', chain: true, kind: 'kris',
    title: 'HEDGEFONDEN TOG SKOLFARTYGET',
    text: 'En hedgefond som vägrade gå med på uppgörelsen har stämt landet i en domstol i {land} och fått rätt att beslagta statens egendom utomlands. Förra veckan tog de flottans skolfartyg i en utländsk hamn. Utrikesministern säger att ambassaderna ligger "i riskzonen".',
    choices: [
      { text: 'BETALA FONDEN FULLT UT', cost: { money: 1200 }, rel: 4, temp: { ideopower: -4 }, next: 'sfi_konkurs_tillbaka', tip: 'Den som väntade längst fick mest. Det sprider sig.' },
      { text: 'FÖRLIK MED FONDEN', cost: { money: 500, pp: 15 }, rel: 2, temp: { stability: 1 }, next: ['sfi_konkurs_tillbaka', null], tip: 'Skolfartyget kommer hem. Med en ny målning.' },
      { text: 'VÄGRA PÅ PRINCIP', rel: -6, temp: { ideopower: 4, approval: 2, gdp: -3 }, tip: 'Skolfartyget seglar nu under hedgefondens flagga.' },
    ],
  },
  {
    id: 'sfi_konkurs_tillbaka', icon: '\u{1F305}', chain: true, kind: 'kris',
    title: 'TILLBAKA PÅ MARKNADEN',
    text: 'För första gången sedan bankrutten har landet sålt nya statsobligationer. Räntan blev hög, men auktionen var övertecknad tre gånger. Finansministern brast i gråt på presskonferensen och sa att hon skulle ringa sin mamma. Kurvan på departementets vägg pekar uppåt för första gången på länge.',
    choices: [
      { text: 'LÅNA FÖRSIKTIGT, MED BUDGETREGLER', cost: { pp: 10 }, law: ['debt_brake', 'rules'], perm: { stability: 2 }, tip: 'En gång bankrutt räcker för en livstid.' },
      { text: 'FIRA OCH HÖJ PENSIONERNA', cost: { money: 500 }, griev: -10, temp: { approval: 6 }, tip: 'Pensionärerna har väntat längst. De firar först.' },
      { text: 'LÅT SIFFRORNA TALA', griev: -5, temp: { approval: 2 }, ind: { trustgov: 3 }, tip: 'Den bästa nyheten på flera år, berättad helt torrt.' },
    ],
  },

  // ===== GODA TIDER =====
  {
    id: 'sfi_overskott', icon: '\u{1F4B0}', weight: 2, cooldown: 900,
    title: 'ÖVERSKOTT I STATSKASSAN',
    text: 'Statsbokslutet visar ett ordentligt överskott. Skatteintäkterna har ökat, arbetslösheten har sjunkit och det finns pengar över. Oppositionen vill sänka skatten, facken vill höja lönerna och centralbanken vill att staten betalar av skulden. Alla har en åsikt om pengar som ingen trodde fanns.',
    when: (c) => !c.deficit && c.money > 2500 && (c.ind.budgetbal ?? 0) > 0,
    choices: [
      { text: 'STARTA EN STATLIG FOND FÖR FRAMTIDEN', cost: { money: 1000 }, perm: { stability: 1 }, next: 'sfi_fond_start', tip: 'Norge gjorde så med oljan. Det gick bra.' },
      { text: 'BETALA AV PÅ STATSSKULDEN', cost: { money: 1200 }, perm: { income: 2 }, ind: { trustgov: 2 }, tip: 'Varje krona av skulden som försvinner slutar kosta ränta.' },
      { text: 'EN BONUS TILL ALLA HUSHÅLL', cost: { money: 800 }, temp: { approval: 7, qol: 2 }, ind: { infl: 0.4 }, tip: 'Alla blir glada. Butikerna höjer priserna lite.' },
      { text: 'SÄNK SKATTEN', perm: { income: -2 }, temp: { approval: 5 }, ind: { gdpgrowth: 0.3 }, tip: 'Överskottet blir ett minne. Skattesänkningen blir kvar.' },
    ],
  },
  {
    id: 'sfi_fond_start', icon: '\u{1F3DB}\u{FE0F}', chain: true,
    title: 'DEN STATLIGA FONDEN',
    text: 'Den nya statliga fonden har fått sina första pengar och en styrelse med ekonomer, en fackordförande och en pensionerad sjökapten som ingen riktigt vet varför hon är med. Nu ska den bestämma hur pengarna placeras: brett i världens aktier, i inhemska företag eller försiktigt i obligationer.',
    choices: [
      { text: 'BRETT I VÄRLDENS AKTIER, LÅNGSIKTIGT', perm: { stability: 1 }, next: ['sfi_fond_vaxer', 'sfi_fond_vaxer', 'sfi_fond_ras'], tip: 'Lite av allt, överallt, i trettio år.' },
      { text: 'I INHEMSKA FÖRETAG OCH INFRASTRUKTUR', cost: { pp: 10 }, perm: { factory: 2 }, next: ['sfi_fond_skandal', 'sfi_fond_vaxer', null], tip: 'Pengarna stannar hemma. Det gör frestelserna också.' },
      { text: 'FÖRSIKTIGT I STATSOBLIGATIONER', perm: { income: 1 }, temp: { stability: 2 }, tip: 'Säkert och sömnigt. Sjökaptenen gäspar.' },
    ],
  },
  {
    id: 'sfi_fond_vaxer', icon: '\u{1F331}', chain: true,
    title: 'FONDEN HAR VUXIT',
    text: 'Den statliga fonden har gått bättre än någon vågat hoppas. Avkastningen räcker nu till en tiondel av skolans budget varje år, utan att någon behöver betala mer skatt. Delegationer från tre länder har kommit för att studera modellen, och sjökaptenen i styrelsen har blivit något av en folkhjälte.',
    choices: [
      { text: 'TA UT AVKASTNINGEN TILL VÄLFÄRDEN', res: { money: 600 }, temp: { welfare: 3, approval: 3 }, tip: 'Pengar som ingen behövde betala in. Det bästa slaget.' },
      { text: 'LÅT DEN VÄXA I TJUGO ÅR TILL', perm: { stability: 2, income: 1 }, tip: 'Barnbarnen kommer att tacka. Om de läser historia.' },
      { text: 'ETISKA REGLER: INGA VAPEN, INGET KOL', cost: { pp: 10 }, rel: 4, temp: { approval: 2 }, tip: 'Lite lägre avkastning. Mycket bättre rykte.' },
    ],
  },
  {
    id: 'sfi_fond_ras', icon: '\u{1F4C9}', chain: true,
    title: 'FONDEN TAPPAR EN FJÄRDEDEL',
    text: 'Världens börser har fallit kraftigt och den statliga fonden har tappat en fjärdedel av sitt värde på tre månader. Kvällstidningarna räknar ut hur många sjukhus pengarna hade räckt till. Fondens chef säger lugnt att man ska se på trettio år och inte på trettio dagar.',
    choices: [
      { text: 'LYSSNA PÅ CHEFEN OCH VÄNTA', perm: { income: 1 }, temp: { approval: -2 }, tip: 'Börsen har alltid kommit tillbaka. Hittills.' },
      { text: 'SÄLJ ALLT INNAN DET BLIR VÄRRE', res: { money: 500 }, perm: { stability: -1 }, temp: { approval: 1 }, tip: 'Att sälja på botten är en klassiker.' },
      { text: 'BYT UT STYRELSEN', cost: { pp: 10 }, temp: { approval: 2, stability: -1 }, tip: 'Sjökaptenen får sparken. Hon tar det med fattning.' },
    ],
  },
  {
    id: 'sfi_fond_skandal', icon: '\u{1F575}\u{FE0F}', chain: true,
    title: 'FONDEN KÖPTE MINISTERNS BOLAG',
    text: 'En granskning visar att den statliga fonden köpt aktier i tre bolag där en minister är delägare, till priser långt över marknadsvärdet. Ministern säger att hon "inte hade en aning", fondens vd säger att han fick ett tips. Pengarna som försvann motsvarar en ny gymnasieskola.',
    choices: [
      { text: 'MINISTERN AVGÅR, POLISEN UTREDER', cost: { pp: 15 }, perm: { corruption: -2 }, temp: { approval: 2, stability: -2 }, tip: 'Det svider. Det läker också.' },
      { text: 'TYST UPPGÖRELSE', mod: 'cover_up', perm: { corruption: 2 }, temp: { stability: 1 }, tip: 'Ingen pratar om det. Alla vet om det.' },
      { text: 'LÄGG FONDEN UNDER RIKSDAGENS REVISORER', cost: { pp: 10 }, perm: { corruption: -1 }, temp: { statepower: -2 }, tip: 'Revisorer är tråkiga. Det är därför de fungerar.' },
    ],
  },
  {
    id: 'sfi_skuld_noll', icon: '\u{1F389}', weight: 1, cooldown: 1500,
    title: 'STATSSKULDEN ÄR NÄSTAN BORTA',
    text: 'Statsskulden har krympt till en bråkdel av vad den var. Räntekostnaderna som förut åt upp en hel skolbudget kan nu gå till annat, och landet kan låna billigare än nästan alla andra stater om en kris kommer. En ekonom kallar det "en krigskassa i fredstid".',
    when: (c) => c.debt < 15 && !c.deficit && c.day > 300,
    choices: [
      { text: 'SPARA KRIGSKASSAN TILL NÄSTA KRIS', perm: { stability: 2 }, temp: { approval: 1 }, tip: 'Nästa kris kommer. Den här gången är ni redo.' },
      { text: 'BYGG JÄRNVÄGAR OCH BREDBAND', cost: { money: 900 }, perm: { factory: 2, gdp: 2 }, temp: { approval: 3 }, tip: 'Det bästa sättet att använda billiga pengar.' },
      { text: 'SÄNK SKATTEN FÖR ALLA', cost: { pp: 10 }, perm: { income: -2 }, temp: { approval: 6 }, tip: 'Populärt i dag. Skulden kan komma tillbaka i morgon.' },
    ],
  },
  {
    id: 'sfi_lon_i_tid', icon: '\u{1F382}', weight: 2, cooldown: 800,
    kind: 'underskott', react: true,
    title: 'LÖNERNA KOMMER I TID IGEN',
    text: 'För första gången på månader betalades alla löner, pensioner och bidrag ut på rätt dag. Statskassan är över noll igen. Lärarna i {stad} har bakat en tårta formad som ett lönebesked och skickat den till finansdepartementet. Förtroendet tar längre tid att baka tillbaka.',
    when: (c) => !c.deficit && c.grievOf('underskott') > 5 && c.money > 200,
    choices: [
      { text: 'BETALA DRÖJSMÅLSRÄNTA TILL ALLA', cost: { money: 400 }, griev: -15, ind: { trustgov: 3 }, tip: 'Ett tack i pengar. Det förstår alla.' },
      { text: 'LOVA I LAG ATT DET INTE HÄNDER IGEN', cost: { pp: 20 }, law: ['debt_brake', 'rules'], griev: -10, tip: 'Budgetregler i lag. Banken nickar gillande.' },
      { text: 'TACKA PERSONALEN I ETT TAL', griev: -6, temp: { approval: 2 }, tip: 'Och ät upp tårtan. Den var god.' },
    ],
  },
  {
    id: 'sfi_overskott_strid', icon: '\u{1FAA7}', weight: 1, cooldown: 900, kind: 'valfard',
    title: 'NI HAR PENGAR NU',
    text: 'Statskassan är välfylld, och nu vill alla ha en del. Sjuksköterskorna demonstrerar för högre löner med skyltar där det står "NI HAR PENGAR NU", lärarna har startat en namninsamling och pensionärsförbundet har räknat ut exakt hur stort överskottet är per pensionär.',
    when: (c) => !c.deficit && c.money > 3000 && c.grievOf('valfard') > 10,
    choices: [
      { text: 'HÖJ LÖNERNA I VÅRDEN OCH SKOLAN', cost: { money: 900 }, griev: -15, perm: { income: -1 }, temp: { qol: 2, approval: 3 }, tip: 'Lönerna höjs för alltid. Överskottet var tillfälligt.' },
      { text: 'ETT ENGÅNGSTILLÄGG TILL PENSIONÄRERNA', cost: { money: 500 }, griev: -8, temp: { approval: 3 }, tip: 'En gång. Pensionärerna minns det i tio år.' },
      { text: 'PENGARNA SKA LIGGA KVAR', griev: 5, perm: { stability: 1 }, temp: { approval: -3 }, tip: 'Ansvarsfullt. Och väldigt svårt att förklara på ett torg.' },
    ],
  },
  {
    id: 'sfi_fonden_berom', icon: '\u{1F31F}', weight: 1, cooldown: 1200,
    title: 'VALUTAFONDEN BERÖMMER LANDET',
    text: 'I sin årliga granskning lyfter Valutafonden fram landet som ett föredöme: skulden sjunker, budgeten är i balans och reformerna har gjorts utan att välfärden rasat. Rapporten citeras i tidningar i {land} och {granne}, och tre finansministrar vill komma på studiebesök.',
    when: (c) => !c.deficit && c.ratingIdx <= 2 && c.trend('debt') < -1 && c.day > 150,
    choices: [
      { text: 'TA EMOT STUDIEBESÖKEN', cost: { money: 100 }, rel: 6, temp: { approval: 2 }, tip: 'Kaffe, bullar och en powerpoint om budgetdisciplin.' },
      { text: 'ANVÄND BERÖMMET I VALKAMPANJEN', temp: { approval: 5, ideopower: 2 }, tip: 'Det står i en rapport. Alltså är det sant.' },
      { text: 'GE RÅDGIVNING TILL FATTIGARE LÄNDER', cost: { pp: 10 }, rel: 8, temp: { ideopower: 2 }, tip: 'Det bästa landet kan exportera är ett gott exempel.' },
    ],
  },
  {
    id: 'sfi_rekordar', icon: '\u{2600}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'REKORDÅR FÖR STATSKASSAN',
    text: 'Tillväxten är den högsta på tio år. Skatteintäkterna strömmar in, a-kassan kostar nästan ingenting och företagen i {stad} letar desperat efter svetsare och programmerare. Finansministern har höjt prognosen för andra gången i år och ser ut som en människa som har sovit gott.',
    when: (c) => (c.ind.gdpgrowth ?? 2) > 4.5 && !c.deficit && (c.ind.unemp ?? 6) < 9,
    choices: [
      { text: 'SPARA I GODA TIDER', perm: { income: 2 }, temp: { approval: -1 }, tip: 'Det svåraste i politiken: att inte spendera pengar man har.' },
      { text: 'SATSA PÅ UTBILDNING', cost: { money: 600 }, perm: { research: 2 }, temp: { approval: 2 }, tip: 'Svetsarna och programmerarna till nästa högkonjunktur.' },
      { text: 'HÖJ ALLA PENSIONER', cost: { money: 700 }, perm: { income: -1 }, temp: { approval: 5 }, ind: { infl: 0.5 }, tip: 'Goda tider varar inte. Pensionshöjningar gör det.' },
    ],
  },
  {
    id: 'sfi_jobben_tillbaka', icon: '\u{1F4BC}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'ARBETSLÖSHETEN HAR VÄNT',
    text: 'Arbetslösheten har sjunkit sex månader i rad. I {stad} har lastbilsfabriken återanställt hälften av dem som varslades, och fler unga har fått sitt första jobb än på flera år. Skatteintäkterna stiger och a-kassan kostar mindre för varje månad.',
    when: (c) => c.trend('unemp') < -0.3 && (c.ind.unemp ?? 6) < 9 && c.day > 150,
    choices: [
      { text: 'FIRA MED DE ÅTERANSTÄLLDA', cost: { money: 100 }, griev: -6, temp: { approval: 4 }, tip: 'Tårta i fabriksmatsalen. Kameror på plats.' },
      { text: 'SPARA DET SOM BLIR ÖVER', griev: -3, perm: { income: 1 }, tip: 'Tyst och förnuftigt.' },
      { text: 'SATSA PÅ DEM SOM FORTFARANDE STÅR UTANFÖR', cost: { money: 400 }, griev: -8, ind: { unemp: -0.3 }, tip: 'De sista är svårast att få i arbete. Och viktigast.' },
    ],
  },
  {
    id: 'sfi_krisen_over', icon: '\u{1F308}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'DET VÄRSTA ÄR ÖVER',
    text: 'Ekonomerna är försiktiga men eniga: krisen har vänt. Tillväxten är tillbaka, priserna stiger i normal takt och fler företag nyanställer än varslar. På kaféerna i {stad} pratar folk om semesterresor igen i stället för om räntor.',
    when: (c) => c.grievOf('kris') > 8 && c.grievOf('kris') < 30 && (c.ind.gdpgrowth ?? 2) > 2 && (c.ind.infl ?? 2) < 5,
    choices: [
      { text: 'TACKA FOLKET FÖR TÅLAMODET', griev: -8, temp: { approval: 3 }, tip: 'De fick vänta. Nu får de höra att det var värt det.' },
      { text: 'ÅTERSTÄLL DET SOM SKARS NER I KRISEN', cost: { money: 500 }, griev: -12, temp: { welfare: 3 }, tip: 'Simhallen öppnar igen. Barnen märker det först.' },
      { text: 'BYGG EN BUFFERT TILL NÄSTA KRIS', cost: { pp: 10 }, griev: -4, perm: { stability: 2 }, tip: 'Nästa kris kommer. Den kommer alltid.' },
    ],
  },
  {
    id: 'sfi_buffert', icon: '\u{2602}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'BUFFERTEN RÄDDADE LANDET',
    text: 'När konjunkturen vände nedåt hade staten pengar på kontot och en låg skuld. Medan grannländerna skär ner kan regeringen betala korttidsarbete och tidigarelägga vägbyggen utan att låna dyrt. Ekonomer i {land} kallar det ett skolboksexempel på hur man sparar i goda tider.',
    when: (c) => !c.deficit && c.debt < 50 && c.ratingIdx <= 2 && ((c.ind.gdpgrowth ?? 2) < 1 || c.grievOf('kris') > 10),
    choices: [
      { text: 'ANVÄND BUFFERTEN NU', cost: { money: 800 }, griev: -10, ind: { unemp: -0.4, gdpgrowth: 0.5 }, tip: 'Det var därför ni sparade.' },
      { text: 'ANVÄND HÄLFTEN, SPARA HÄLFTEN', cost: { money: 400 }, griev: -5, perm: { stability: 1 }, ind: { gdpgrowth: 0.2 }, tip: 'Krisen kan bli längre än någon tror.' },
      { text: 'SPARA ALLT TILL VÄRRE TIDER', griev: 5, perm: { income: 1 }, ind: { unemp: 0.2 }, tip: 'Ett paraply som aldrig fälls upp håller ingen torr.' },
    ],
  },
  {
    id: 'sfi_skattemoral', icon: '\u{1F48C}', weight: 1, cooldown: 1200, kind: 'skatt',
    title: 'FOLK BETALAR GÄRNA SKATT',
    text: 'En ny undersökning visar att nio av tio tycker att skatten går till något vettigt. Skattefusket är det lägsta som uppmätts, och Skatteverket får fler tackbrev än klagomål. En pensionär i {stad} har skickat in en extra hundralapp "för att vägarna är så fina".',
    when: (c) => !c.deficit && c.grievOf('skatt') < 3 && c.st.corruption < -5 && (c.ind.taxevasion ?? 20) < 20,
    choices: [
      { text: 'SKICKA TILLBAKA HUNDRALAPPEN MED ETT TACKBREV', griev: -4, temp: { approval: 2 }, ind: { trustgov: 2 }, tip: 'Brevet hamnar inramat i hennes hall.' },
      { text: 'SÄNK SKATTEN LITE SOM TACK', cost: { pp: 10 }, griev: -6, perm: { income: -1 }, temp: { approval: 4 }, tip: 'Ett tack i plånboken. Det förstår alla.' },
      { text: 'VISA VART VARJE KRONA GÅR, PÅ NÄTET', cost: { money: 100 }, perm: { corruption: -1 }, ind: { trustgov: 3 }, tip: 'Öppenhet är det bästa skälet att betala.' },
    ],
  },
  {
    id: 'sfi_investerare', icon: '\u{1F91D}', weight: 1, cooldown: 1000,
    title: 'PENSIONSFONDERNA VILL INVESTERA HÄR',
    text: 'Tre av världens största pensionsfonder vill investera i landets vindkraft, hamnar och bostäder. De säger att de söker stabila länder med förutsägbar politik och låg skuld, och att landet är ett av få som klarar kraven. En fondchef från {land} har redan bokat hotell i {huvudstad}.',
    when: (c) => c.ratingIdx <= 2 && !c.deficit && c.st.stability > 10 && c.day > 100,
    choices: [
      { text: 'VÄLKOMNA DEM MED ÖPPNA ARMAR', mod: 'foreign_investment', temp: { gdp: 3, statepower: -2 }, tip: 'Kapital söker trygghet. Ni har det.' },
      { text: 'JA, MEN STATEN BEHÅLLER MAJORITETEN', cost: { pp: 15 }, perm: { factory: 1 }, temp: { gdp: 2 }, tip: 'Deras pengar, er kontroll. De går med på det.' },
      { text: 'VI BYGGER SJÄLVA', cost: { money: 700 }, perm: { factory: 2 }, temp: { approval: 2 }, tip: 'Dyrare, långsammare och helt ert eget.' },
    ],
  },
  {
    id: 'sfi_skuld_krymper', icon: '\u{1F4C9}', weight: 2, cooldown: 1000,
    title: 'SKULDEN KRYMPER ÅR EFTER ÅR',
    text: 'Statsskulden har minskat tre år i rad. Räntekostnaderna har sjunkit så mycket att budgeten har luft för första gången på länge, och de yngsta ekonomerna på finansdepartementet har aldrig varit med om något liknande. Oppositionen säger att det är tur. Ratingbyrån säger att det är skicklighet.',
    when: (c) => !c.deficit && c.debt > 40 && c.trend('debt') < -3,
    choices: [
      { text: 'FORTSÄTT BETALA AV I SAMMA TAKT', perm: { stability: 1 }, ind: { trustgov: 2 }, tip: 'Tråkigt, stadigt, effektivt.' },
      { text: 'ANVÄND RÄNTEPENGARNA TILL SJUKVÅRDEN', cost: { money: 400 }, temp: { qol: 3, approval: 3 }, tip: 'Pengar som förut gick till långivarna går nu till patienterna.' },
      { text: 'SAKTA IN, HÖJ BARNBIDRAGET', cost: { pp: 10 }, perm: { income: -1 }, temp: { approval: 4, welfare: 2 }, tip: 'Skulden krymper lite långsammare. Familjerna märker skillnaden.' },
    ],
  },

  // ===== BOOM OCH BUST =====
  {
    id: 'sfi_bors_feber', icon: '\u{1F4C8}', weight: 2, cooldown: 1000, kind: 'ekonomi',
    title: 'ALLA KÖPER AKTIER',
    text: 'Börsen har stigit med fyrtio procent på ett år. Taxichaufförer ger aktietips, frisörer pratar om teknikbolag och en tolvåring i {stad} har blivit känd för att ha tjänat mer än sina föräldrar på tre månader. Bankerna lånar gärna ut till den som vill köpa ännu mer aktier.',
    when: (c) => ((c.ind.stockcap ?? 50) > 90 && (c.ind.gdpgrowth ?? 2) > 2) || (c.mod('boom') && (c.ind.stockcap ?? 50) > 60),
    choices: [
      { text: 'SKÄRP REGLERNA FÖR LÅN MOT AKTIER', cost: { pp: 15 }, law: ['banking', 'strict'], temp: { approval: -2 }, ind: { stockcap: -6 }, tip: 'Festens tråkigaste gäst. Den som tar hem bilnycklarna.' },
      { text: 'SÄLJ STATENS AKTIER MEDAN PRISERNA ÄR HÖGA', res: { money: 900 }, perm: { income: -1 }, next: ['sfi_bors_krasch', null], tip: 'Sälj när taxichauffören köper, säger en gammal regel.' },
      { text: 'LÅT FESTEN FORTSÄTTA', temp: { approval: 3, gdp: 2 }, ind: { stockcap: 10 }, next: ['sfi_bors_krasch', 'sfi_bors_krasch', null], tip: 'Ingen fest har någonsin slutat av sig själv.' },
    ],
  },
  {
    id: 'sfi_bors_krasch', icon: '\u{1F4C9}', chain: true, kind: 'kris',
    title: 'BÖRSKRASCHEN',
    text: 'Det började med ett teknikbolag som visade sig ha hittat på sina siffror. På tre dagar föll börsen med en tredjedel. De som lånat till aktier tvingas sälja allt, bankerna sitter med lån som ingen kan betala och tolvåringen i {stad} har lagt ner sin videokanal.',
    choices: [
      { text: 'STÖDKÖP MED STATENS PENGAR', cost: { money: 1000 }, temp: { stability: 3 }, ind: { stockcap: 10 }, tip: 'Staten köper på botten. Ibland är det en bra affär.' },
      { text: 'SÄNK RÄNTAN OCH VÄNTA', griev: 4, ind: { stockcap: -10, unemp: 0.4, gdpgrowth: -0.6 }, next: ['sfi_varselvag', 'sfi_bors_efter', null], tip: 'Botten hittar sig själv. Det tar bara ett tag.' },
      { text: 'STÄLL BEDRAGARNA INFÖR RÄTTA', cost: { pp: 10 }, perm: { corruption: -1 }, temp: { approval: 3 }, ind: { stockcap: -15 }, next: ['sfi_bors_efter', null], tip: 'Rättvisan är bra för förtroendet. Inte för kurserna, just nu.' },
    ],
  },
  {
    id: 'sfi_bors_efter', icon: '\u{1F68C}', chain: true, kind: 'kris',
    title: 'PENSIONSPENGARNA SOM FÖRSVANN',
    text: 'Ett halvår efter kraschen har de första granskningarna kommit. Hundratusentals människor hade sitt pensionssparande i fonder som köpte teknikbolagen på toppen. En sextiotreårig busschaufför berättar att han måste jobba fem år till, och han är långt ifrån ensam.',
    choices: [
      { text: 'ETT GOLV FÖR DEM SOM FÖRLORAT MEST', cost: { money: 600 }, griev: -10, temp: { approval: 3 }, tip: 'Busschauffören kan gå i pension i tid.' },
      { text: 'HÅRDARE REGLER FÖR PENSIONSFONDER', cost: { pp: 10 }, perm: { stability: 1 }, ind: { trustgov: 2 }, tip: 'Nästa krasch blir mindre. Den här är redan här.' },
      { text: 'SÅ FUNGERAR AKTIER', griev: 6, temp: { approval: -4 }, tip: 'Korrekt. Och sällan populärt.' },
    ],
  },
  {
    id: 'sfi_bostad_bubbla', icon: '\u{1F3E0}', weight: 2, cooldown: 1000, kind: 'ekonomi',
    title: 'BOSTADSPRISERNA RUSAR',
    text: 'En vanlig trea i {huvudstad} kostar nu tolv årslöner, och priserna har stigit varje månad i fyra år. Unga par lånar fem gånger sin inkomst med lån som inte behöver betalas av på femtio år. Mäklarna kallar det en trygg investering. Centralbanken kallar det något annat i sin senaste rapport.',
    when: (c) => (c.ind.houseprice ?? 8) > 11 && ((c.ind.hhdebt ?? 60) > 80 || c.trend('houseprice') > 0.4) && c.day > 60,
    choices: [
      { text: 'AMORTERINGSKRAV OCH LÅNETAK', cost: { pp: 15 }, griev: 4, temp: { approval: -3 }, ind: { houseprice: -5 }, tip: 'Luften går ur långsamt. Det är det bästa sättet.' },
      { text: 'BYGG FLER BOSTÄDER', cost: { money: 700 }, temp: { approval: 2 }, ind: { houseprice: -3 }, tip: 'Det tar fem år. Men det är det enda som verkligen hjälper.' },
      { text: 'LÅT MARKNADEN STYRA', temp: { approval: 2 }, ind: { houseprice: 6 }, next: ['sfi_bostad_krasch', 'sfi_bostad_krasch', null], tip: 'Alla som äger blir rikare. På papperet.' },
    ],
  },
  {
    id: 'sfi_bostad_krasch', icon: '\u{1F3DA}\u{FE0F}', chain: true, kind: 'kris',
    title: 'BOSTADSBUBBLAN SPRICKER',
    text: 'Räntorna steg en halv procentenhet, och det räckte. På ett halvår har bostadspriserna i {huvudstad} fallit med en femtedel. Tusentals familjer har lån som är större än vad bostaden är värd, byggbolagen har stoppat alla nya projekt och snickare, rörmokare och elektriker står utan jobb.',
    choices: [
      { text: 'STATLIGA GARANTIER FÖR BOLÅNEN', cost: { money: 900 }, griev: -8, perm: { income: -1 }, ind: { houseprice: 4 }, tip: 'Fallet bromsas. Notan hamnar hos staten.' },
      { text: 'KÖP OSÅLDA LÄGENHETER TILL HYRESRÄTTER', cost: { money: 600 }, temp: { approval: 3 }, ind: { homeless: -10, unemp: -0.2 }, tip: 'Byggarna får jobba klart. Bostadskön blir kortare.' },
      { text: 'LÅT PRISERNA HITTA BOTTEN', griev: 8, ind: { houseprice: -8, unemp: 0.6, gdpgrowth: -0.8 }, next: ['sfi_bostad_banker', null], tip: 'Botten finns. Ingen vet var.' },
    ],
  },
  {
    id: 'sfi_bostad_banker', icon: '\u{1F3E6}', chain: true, kind: 'kris',
    title: 'BANKERNA SITTER MED DÅLIGA LÅN',
    text: 'Bostadskraschen har nått bankerna. Den tredje största banken har lånat ut mer mot bostäder än hela sitt eget kapital, och ratingbyrån varnar för att staten kan tvingas gå in. Bankdirektören har bett om ett möte och tagit med sig en presentation på åttio sidor.',
    choices: [
      { text: 'RÄDDA BANKEN MOT ATT STATEN FÅR AKTIER', cost: { money: 1100 }, perm: { income: 1 }, temp: { stability: 3 }, tip: 'När banken friskar till säljer staten aktierna med vinst.' },
      { text: 'DELA BANKEN: EN BRA OCH EN DÅLIG', cost: { pp: 25 }, perm: { corruption: -1 }, temp: { stability: 2 }, tip: 'Sverige gjorde så på nittiotalet. Det fungerade.' },
      { text: 'BANKEN FÅR KLARA SIG SJÄLV', griev: 8, temp: { stability: -6 }, ind: { stockcap: -12, unemp: 0.5 }, next: ['sfi_rusning_dag2', null], tip: 'Kunderna läser också tidningen. Och de har bråttom.' },
    ],
  },
  {
    id: 'sfi_lagkonj', icon: '\u{1F327}\u{FE0F}', weight: 2, cooldown: 900,
    kind: 'kris', react: true,
    title: 'LANDET ÄR I RECESSION',
    text: 'Ekonomin har krympt två kvartal i rad, och statistikmyndigheten har gjort det officiellt: landet är i recession. Fabrikerna kör färre skift, restaurangerna i {stad} har kortare öppettider och skatteintäkterna sjunker samtidigt som fler behöver a-kassa. Varje beslut nu kommer att synas i flera år.',
    when: (c) => (c.ind.gdpgrowth ?? 2) < 0,
    choices: [
      { text: 'ETT STIMULANSPAKET: VÄGAR OCH SKOLOR', cost: { money: 900 }, griev: -6, ind: { gdpgrowth: 0.8, unemp: -0.4 }, tip: 'Keynes nickar från himlen. Skulden växer här nere.' },
      { text: 'SÄNKT SKATT FÖR FÖRETAGEN', cost: { pp: 15 }, perm: { income: -2 }, temp: { approval: 1 }, ind: { gdpgrowth: 0.5 }, tip: 'Företagen anställer, kanske. Statskassan tappar, säkert.' },
      { text: 'SPARA, KASSAN MÅSTE HÅLLAS', griev: 8, perm: { income: 1 }, ind: { gdpgrowth: -0.4, unemp: 0.4 }, next: ['sfi_varselvag', null], tip: 'Att spara i en lågkonjunktur är som att banta i en hungersnöd.' },
    ],
  },
  {
    id: 'sfi_varselvag', icon: '\u{1F4C4}', chain: true, kind: 'kris',
    title: 'VARSELLISTORNA BLIR LÄNGRE',
    text: 'Fyra stora arbetsgivare i {stad} har varslat tvåtusen anställda på en vecka: en lastbilsfabrik, ett callcenter, ett pappersbruk och kommunens eget bussbolag. Arbetsförmedlingen har ställt upp tält utanför fabriksgrindarna. Facket kräver att staten gör något före jul.',
    choices: [
      { text: 'KORTTIDSARBETE: STATEN BETALAR EN DEL AV LÖNEN', cost: { money: 700 }, griev: -8, ind: { unemp: -0.5 }, tip: 'Folk behåller jobbet och kunnandet tills det vänder.' },
      { text: 'OMSKOLNING OCH UTBILDNINGSPLATSER', cost: { money: 400 }, griev: -4, perm: { research: 1 }, ind: { youthunemp: -1 }, tip: 'Pappersbrukaren blir undersköterska. Det tar ett år.' },
      { text: 'ARBETSLÖSHETEN ÄR PRISET FÖR SUNDA FINANSER', griev: 8, temp: { approval: -5, unrest: 4 }, ind: { unemp: 0.6 }, next: ['sfi_arbetslos_kris', null], tip: 'Priset betalas av någon annan än den som säger det.' },
    ],
  },
  {
    id: 'sfi_arbetslos_kris', icon: '\u{1FA91}', chain: true, kind: 'kris',
    title: 'DEN LÅNGA ARBETSLÖSHETEN',
    text: 'Ett år efter varslen har hälften av dem som förlorade jobbet i {stad} fortfarande inget nytt. Många har slutat söka. Läkarna ser fler som är sjukskrivna för depression, och skolan märker att barn i familjer utan arbete halkar efter. Kommunens försörjningsstöd har fördubblats.',
    choices: [
      { text: 'STATLIGA BEREDSKAPSJOBB', cost: { money: 700 }, griev: -10, perm: { income: -1 }, ind: { unemp: -0.6 }, tip: 'Skogar röjs, parker målas, folk får en anledning att gå upp.' },
      { text: 'FLYTTBIDRAG DIT JOBBEN FINNS', cost: { money: 300 }, griev: -3, temp: { qol: -1 }, ind: { unemp: -0.2 }, tip: 'Jobben finns i huvudstaden. Det gör inte bostäderna.' },
      { text: 'LÅT KOMMUNEN TA ANSVARET', griev: 6, temp: { qol: -4, unrest: 4 }, ind: { happiness: -0.2 }, tip: 'Kommunen har inga pengar heller. Den har en kö.' },
    ],
  },
  {
    id: 'sfi_arbetslos', icon: '\u{1F465}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'KÖ UT PÅ GATAN PÅ ARBETSFÖRMEDLINGEN',
    text: 'Arbetslösheten har passerat tio procent, och bland unga är den dubbelt så hög. Arbetsförmedlingen i {stad} har kö ut på gatan och varje handläggare har en lista med fyrahundra namn. A-kassan kostar staten mer för varje månad, och skatteintäkterna minskar i samma takt.',
    when: (c) => (c.ind.unemp ?? 6) > 10 && c.day > 60,
    choices: [
      { text: 'JOBBGARANTI FÖR UNGA', cost: { money: 800 }, griev: -8, perm: { income: -1 }, ind: { youthunemp: -2, unemp: -0.4 }, tip: 'Ett första jobb är det viktigaste jobbet.' },
      { text: 'SÄNK ARBETSGIVARAVGIFTEN', cost: { pp: 15 }, perm: { income: -2 }, temp: { gdp: 2 }, ind: { unemp: -0.3 }, tip: 'Billigare att anställa. Dyrare för statskassan.' },
      { text: 'SÄNK A-KASSAN SÅ ATT FLER SÖKER JOBB', griev: 8, perm: { income: 2 }, temp: { welfare: -4, approval: -4 }, ind: { unemp: -0.2 }, tip: 'Ekonomerna är oense. De arbetslösa är det inte.' },
    ],
  },
  {
    id: 'sfi_hushallsskuld', icon: '\u{1F4E8}', weight: 1, cooldown: 900, kind: 'kris',
    title: 'HUSHÅLLEN DRUNKNAR I SKULDER',
    text: 'Hushållen har lånat mer år efter år, och nu har räntorna stigit. Kronofogden har fått dubbelt så många ärenden som förra året, och skuldrådgivarna i {stad} har sex månaders kö. En familj berättar i lokaltidningen att de betalar mer i ränta än för mat.',
    when: (c) => (c.ind.hhdebt ?? 60) > 70 && ((c.ind.bondrate ?? 3) > 3 || (c.ind.infl ?? 2) > 5),
    choices: [
      { text: 'SKULDSANERING FÖR DE MEST UTSATTA', cost: { money: 400 }, griev: -8, ind: { happiness: 0.1 }, tip: 'En ny början. Med ett strikt budgetschema.' },
      { text: 'RÄNTETAK PÅ SNABBLÅN', cost: { pp: 15 }, law: ['consumer_protection', 'ombudsman'], griev: -4, tip: 'Snabblånebolagen sponsrar inte längre fotbollslaget.' },
      { text: 'MAN FÅR TA ANSVAR FÖR SINA LÅN', griev: 6, temp: { approval: -3 }, ind: { homeless: 8 }, tip: 'Sant. Men lånen skrevs med bankens penna.' },
    ],
  },
  {
    id: 'sfi_reallon', icon: '\u{1F35E}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'LÖNEN RÄCKER INTE LÄNGRE',
    text: 'Inflationen är över sju procent och lönerna har höjts med tre. För en vanlig familj betyder det att maten, hyran och bussbiljetten har blivit dyrare än vad lönen räcker till. Facket i {stad} kräver kompensation, och företagen säger att högre löner bara gör priserna ännu högre.',
    when: (c) => (c.ind.infl ?? 2) > 7 && (c.ind.infl ?? 2) <= 15,
    choices: [
      { text: 'STÖD TILL HUSHÅLLEN MED LÄGST INKOMST', cost: { money: 500 }, griev: -8, ind: { infl: 0.3 }, tip: 'Riktat stöd. De som behöver det mest får det.' },
      { text: 'SÄNK MOMSEN PÅ MAT', cost: { pp: 15 }, griev: -6, perm: { income: -2 }, ind: { infl: -0.5 }, tip: 'Brödet blir billigare. Statskassan blir tunnare.' },
      { text: 'LÅT CENTRALBANKEN SKÖTA DET', griev: 5, temp: { approval: -2 }, ind: { infl: -1, unemp: 0.5 }, tip: 'Räntan biter. Först på bolånen, sedan på jobben.' },
    ],
  },
  {
    id: 'sfi_svag_valuta', icon: '\u{1F3E8}', weight: 1, cooldown: 1000,
    title: 'SVAG VALUTA, FULLA HOTELL',
    text: 'Valutan har tappat en fjärdedel av sitt värde på ett år, och plötsligt är landet billigt för alla andra. Hotellen i {stad} är fullbokade, exportföretagen får fler order än de hinner med och en verkstad som skulle läggas ned har anställt tjugo personer. En bra tid att sälja, en dålig tid att köpa.',
    when: (c) => c.ratingIdx >= 4 && (c.ind.infl ?? 2) > 4 && c.day > 60,
    choices: [
      { text: 'SATSA PÅ EXPORTEN NU', cost: { money: 300 }, temp: { factory: 3, gdp: 2 }, tip: 'Sälj medan alla vill köpa.' },
      { text: 'MARKNADSFÖR LANDET FÖR TURISTER', cost: { money: 200 }, temp: { approval: 1 }, ind: { tourists: 15 }, tip: 'Billigt, vackert och nära. Affischerna skriver sig själva.' },
      { text: 'NJUT AV DET MEDAN DET VARAR', temp: { gdp: 2 }, ind: { unemp: -0.2 }, tip: 'Importvarorna är fortfarande dyra. Det är baksidan.' },
    ],
  },
  {
    id: 'sfi_barnfattigdom', icon: '\u{1F963}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'BARNEN FÅR INGEN FRUKOST',
    text: 'En barnrättsorganisation visar i sin årsrapport att vart femte barn i {stad} växer upp i en familj som inte har råd med vinterskor, tandläkare eller klassresan. Andelen har ökat sedan krisen började. Lärarna berättar om elever som somnar på lektionerna eftersom de inte har ätit frukost.',
    when: (c) => c.grievOf('kris') > 20 && (c.ind.unemp ?? 6) > 7,
    choices: [
      { text: 'GRATIS SKOLFRUKOST I HELA LANDET', cost: { money: 400 }, griev: -10, temp: { qol: 2, approval: 3 }, tip: 'Gröt och smörgås. Det enklaste som finns, och det fungerar.' },
      { text: 'HÖJ BARNBIDRAGET', cost: { money: 600 }, griev: -12, perm: { income: -1 }, tip: 'Pengar direkt till familjerna. Varje månad.' },
      { text: 'FÖRÄLDRARNA HAR ANSVARET', griev: 6, temp: { approval: -4 }, ind: { happiness: -0.1 }, tip: 'Föräldrarna håller med. De har bara inget jobb.' },
    ],
  },

  // ===== LAGARNA OCH STATSFINANSERNA =====
  {
    id: 'sfi_broms_biter', icon: '\u{1F6D1}', weight: 2, cooldown: 800,
    kind: 'ekonomi', react: true,
    title: 'SKULDBROMSEN BITER',
    text: 'Skuldbromsen har börjat verka. Varje departement har fått ett tak, och den första budgeten under de nya reglerna stryker en ny järnväg, ett sjukhusbygge i {stad} och höjda studiebidrag. Ratingbyrån applåderar. Byggfacket och studentkåren gör det inte.',
    when: (c) => c.changed('debt_brake') && c.is('debt_brake', 'debtban', 'surplus', 'brake'),
    choices: [
      { text: 'UNDANTAG FÖR SJUKHUSET', cost: { pp: 15 }, perm: { income: -1 }, temp: { qol: 2, approval: 2 }, tip: 'Ett undantag. Det första av många, säger oppositionen.' },
      { text: 'INGA UNDANTAG', griev: 6, perm: { income: 1 }, temp: { approval: -3 }, tip: 'En broms som släpper vid första backen är ingen broms.' },
      { text: 'MJUKA UPP BROMSEN TILL BUDGETREGLER', cost: { pp: 20 }, law: ['debt_brake', 'rules'], griev: -6, tip: 'Mjukare regler. Fortfarande regler.' },
    ],
  },
  {
    id: 'sfi_broms_borta', icon: '\u{1F3CE}\u{FE0F}', weight: 2, cooldown: 800,
    kind: 'ekonomi', react: true,
    title: 'BROMSEN ÄR BORTA',
    text: 'När skuldbromsen togs bort skrev ministrarna under en budget med fyrtio nya reformer på en eftermiddag. Ratingbyrån har satt landet under bevakning och räntan på statsobligationerna har stigit tre veckor i rad. På finansdepartementet har någon satt en lapp på kaffemaskinen: "Det finns ingen gratis lunch."',
    when: (c) => c.changed('debt_brake') && c.is('debt_brake', 'deficit', 'unlimited', 'invest'),
    choices: [
      { text: 'ÅTERINFÖR BROMSEN', cost: { pp: 20 }, undo: 'debt_brake', temp: { approval: -2 }, tip: 'Fyrtio reformer blir tio. Ratingbyrån andas ut.' },
      { text: 'LÅNA BARA TILL INVESTERINGAR', cost: { pp: 10 }, law: ['debt_brake', 'invest'], temp: { gdp: 2 }, tip: 'Järnvägar ja, fester nej. I teorin.' },
      { text: 'KÖR PÅ', temp: { approval: 3, stability: -2 }, ind: { stockcap: -4 }, next: ['sfi_betyg_igen', null], tip: 'Gasen i botten. Bromsen ligger i diket.' },
    ],
  },
  {
    id: 'sfi_banker_latt', icon: '\u{1F4F1}', weight: 2, cooldown: 800,
    kind: 'ekonomi', react: true,
    title: 'LÅN PÅ TRE MINUTER',
    text: 'Sedan bankreglerna lättades har utlåningen ökat med en femtedel på ett år. Bankerna erbjuder lån utan säkerhet i mobilen på tre minuter, och snabblåneföretagen sponsrar fotbollslag. Hushållens skulder växer snabbare än lönerna, och finanstillsynen har skickat ett bekymrat brev.',
    when: (c) => c.changed('banking') && c.is('banking', 'light', 'secrecy', 'offshore', 'none'),
    choices: [
      { text: 'SKÄRP REGLERNA IGEN', cost: { pp: 15 }, undo: 'banking', ind: { houseprice: -3 }, tip: 'Tre minuter blir tre dagar. Det räcker för att tänka efter.' },
      { text: 'RÄNTETAK PÅ SNABBLÅN', cost: { pp: 10 }, law: ['consumer_protection', 'ombudsman'], temp: { qol: 1 }, tip: 'Bankerna får låna ut. Bara inte till vilken ränta som helst.' },
      { text: 'LÅT DEM LÅNA', temp: { gdp: 2 }, ind: { houseprice: 4, gdpgrowth: 0.3 }, next: ['sfi_bostad_krasch', null], tip: 'Ekonomin får fart. På lånade pengar.' },
    ],
  },
  {
    id: 'sfi_prisstopp', icon: '\u{1F95B}', weight: 2, cooldown: 800,
    kind: 'skatt', react: true,
    title: 'MJÖLKEN TAR SLUT FÖRE LUNCH',
    text: 'Sedan prisstoppet infördes säljer mejerierna mjölken med förlust. Tre mejerier i {stad} har slutat köpa in från bönderna, och bönderna häller ut mjölk framför länsstyrelsen i protest. I affärerna är mjölkhyllan tom på förmiddagen, men priset är lågt för den som hinner.',
    when: (c) => c.changed('price_controls') && c.is('price_controls', 'stateprices', 'margincap', 'freeze'),
    choices: [
      { text: 'STATLIGT STÖD TILL MEJERIERNA', cost: { money: 400 }, griev: -4, temp: { approval: 1 }, tip: 'Staten betalar mellanskillnaden. Varje liter.' },
      { text: 'HÖJ PRISTAKET LITE', cost: { pp: 10 }, griev: 2, temp: { qol: 1 }, ind: { infl: 0.4 }, tip: 'Lite dyrare mjölk, men mjölk.' },
      { text: 'SLOPA PRISSTOPPET', undo: 'price_controls', temp: { approval: -2 }, ind: { infl: 1 }, tip: 'Hyllan fylls. Prislappen också.' },
    ],
  },
  {
    id: 'sfi_pensionssystem', icon: '\u{1F474}', weight: 1, cooldown: 1200, kind: 'underskott',
    title: 'PENSIONERNA GÅR INTE IHOP',
    text: 'Pensionsmyndighetens nya prognos är dyster: med fler pensionärer och färre i arbete kommer pensionerna att kosta en fjärdedel mer om tio år. Redan i dag lånar staten för att betala dem. Myndighetens chef säger att det finns tre vägar: höja avgifterna, sänka pensionerna eller höja pensionsåldern.',
    when: (c) => c.is('pensions', 'early', 'generous', 'public') && (c.deficit || c.debt > 100) && c.day > 100,
    choices: [
      { text: 'HÖJ PENSIONSÅLDERN TILL 67', cost: { pp: 25 }, law: ['retirement_age', 'age67'], perm: { income: 2 }, temp: { approval: -4 }, tip: 'Två år till på jobbet. Ingen tackar dig i dag.' },
      { text: 'PENSIONER SOM FÖLJER EKONOMIN', cost: { pp: 30 }, law: ['pensions', 'notional'], perm: { stability: 1 }, temp: { approval: -2 }, tip: 'Systemet balanserar sig självt. Som det svenska.' },
      { text: 'LÅNA OCH LÅT NÄSTA REGERING LÖSA DET', griev: 3, perm: { income: -1 }, temp: { approval: 2 }, tip: 'Den traditionella lösningen.' },
    ],
  },
  {
    id: 'sfi_planekonomi', icon: '\u{1F3ED}', weight: 2, cooldown: 1000, kind: 'ekonomi',
    title: 'TIOTUSEN KYLSKÅP SOM INGEN VILL HA',
    text: 'Planeringskommitténs femårsplan har slagit fel för tredje året i rad. Fabrikerna i {stad} har gjort tiotusen kylskåp som ingen vill ha och alldeles för få traktorer. Fabrikscheferna rapporterar att målen är nådda, och förråden är fulla av saker utan köpare. Statskassan betalar för varje kylskåp.',
    when: (c) => c.is('economic_system', 'central', 'planned') && (c.deficit || (c.ind.gdpgrowth ?? 2) < 1.5),
    choices: [
      { text: 'TILLÅT SMÅ PRIVATA FÖRETAG', cost: { pp: 20 }, law: ['economic_system', 'socialmkt'], temp: { ideopower: -4, gdp: 3 }, tip: 'Den första kiosken öppnar inom en vecka. Den har kö.' },
      { text: 'EN NY PLAN MED BÄTTRE STATISTIK', cost: { rp: 20 }, perm: { factory: 1 }, temp: { ideopower: 2 }, tip: 'Datorerna räknar fram rätt antal traktorer. Nästan.' },
      { text: 'STRAFFA FABRIKSCHEFERNA', temp: { statepower: 3, approval: -1, factory: -3 }, ind: { trustgov: -2 }, tip: 'De nya cheferna rapporterar också att målen är nådda.' },
    ],
  },
  {
    id: 'sfi_skuldklocka', icon: '\u{23F0}', weight: 1, cooldown: 1000, kind: 'kris',
    title: 'SKULDKLOCKAN PÅ TORGET',
    text: 'En ungdomsorganisation har satt upp en digital skuldklocka på torget i {huvudstad}. Den visar statsskulden i realtid och hur mycket den blir per invånare. Siffrorna rullar så fort att turisterna filmar dem. Under klockan står det: "Vi har inte röstat om det här, men vi får betala."',
    when: (c) => c.debt > 100 && c.trend('debt') > 2,
    choices: [
      { text: 'BJUD IN UNGDOMARNA TILL BUDGETARBETET', cost: { pp: 10 }, temp: { approval: 3 }, ind: { trustgov: 2 }, tip: 'De kommer med frågor ingen minister vågat ställa.' },
      { text: 'EN GENERATIONSPLAN: SKULDEN NER PÅ TJUGO ÅR', cost: { pp: 20 }, perm: { income: 2 }, temp: { welfare: -2, approval: -1 }, tip: 'Klockan börjar rulla baklänges. Långsamt.' },
      { text: 'KLOCKAN STÖR TRAFIKEN, FLYTTA DEN', griev: 4, temp: { freedom: -2, approval: -3 }, ind: { protests: 20 }, tip: 'Klockan flyttas. Nu står den utanför ditt fönster.' },
    ],
  },
];
