// IMPERIUM V5.16 — HÄNDELSER: SAMHÄLLSLIV.
// Vardagen i ett riktigt land: bostäder, vård, skola, åldrande, brottsvågor, levnads-
// kostnader, arbetsliv, familj, pendling, närmiljö och det digitala livet. Händelserna
// följer av ett läge i statistiken (c.ind), av en trend (c.trend) eller av en lag spelaren
// ändrat (c.cut / c.raised / c.changed). Följderna kommer senare genom kedjor:
// personalbrist → akuten stänger → skandalen, lärarbrist → obehöriga lärare → PISA-chocken.
// Bra politik märks också: kortare köer, stigande skolresultat, tryggare gator.

// antal per 1 000 invånare, för mått som räknas i antal (hemlösa, saknade bostäder)
const perK = (c, n) => (n ?? 0) / Math.max(1, c.ind.pop ?? 1e7) * 1000;

export const EVENTS = [

  // ===== BOSTÄDER =====
  {
    id: 'sml_bo_ko', icon: '\u{1F3D8}\u{FE0F}', weight: 2, cooldown: 700,
    title: 'BOSTADSKÖN ÄR ÅTTA ÅR LÅNG',
    text: 'Den kommunala bostadskön i {huvudstad} har passerat åtta år för en vanlig hyresrätt. Unga vuxna köper kontrakt svart för två månadslöner, och företagen säger att de inte kan anställa folk som inte har någonstans att bo. Byggbolagen pekar på detaljplaner som tar sju år att få klara.',
    when: (c) => c.day > 60 && perK(c, c.ind.housingshort) > 18 && c.trend('houseprice') > 0 && c.st.welfare < 30,
    choices: [
      { text: 'STATEN BYGGER 40 000 HYRESRÄTTER', cost: { money: 1300 }, perm: { qol: 2 }, temp: { approval: 3, gdp: 2 }, ind: { homeless: -6 }, tip: 'Första inflyttningen om tre år. Kranarna syns redan i morgon.' },
      { text: 'KORTARE PLANPROCESS OCH HÖGRE HUS', cost: { pp: 20 }, law: ['urban_planning', 'upzoning'], temp: { approval: 1 }, tip: 'Grannarna överklagar fortfarande. Men nu bara en gång var.' },
      { text: 'BOSTADSBIDRAG TILL DE UNGA', cost: { money: 400 }, temp: { approval: 3 }, ind: { houseprice: 2 }, tip: 'Mer pengar till samma antal lägenheter. Gissa vad som händer med priset.' },
      { text: 'MARKNADEN FÅR LÖSA DET', temp: { approval: -4, gdp: 1 }, ind: { homeless: 6 }, tip: 'Marknaden löser det. Om tio år. För dem som har råd.' },
    ],
  },
  {
    id: 'sml_bo_bubbla', icon: '\u{1F4C8}', weight: 2, cooldown: 1200,
    title: 'BOSTADSPRISERNA SKENAR',
    text: 'En vanlig trea i {huvudstad} kostar nu mer än elva årslöner, och priserna har stigit varje månad i två år. Bankerna lånar ut till nästan vem som helst, mäklarna har budgivningar på varje visning och centralbanken varnar för att hushållens skulder aldrig varit högre.',
    when: (c) => c.day > 90 && (c.ind.houseprice ?? 6) > 11 && c.trend('houseprice') > 0 && (c.ind.lendrate ?? 6) < 9,
    choices: [
      { text: 'INFÖR AMORTERINGSKRAV OCH LÅNETAK', cost: { pp: 15 }, temp: { gdp: -2, approval: -2 }, ind: { houseprice: -5 }, next: ['sml_bo_mjuk', null], tip: 'Ingen tackar den som tar bort bålen innan festen är slut.' },
      { text: 'BYGG BORT BRISTEN', cost: { money: 900 }, perm: { qol: 1 }, temp: { gdp: 1 }, next: ['sml_bo_mjuk', 'sml_bo_krasch', null], tip: 'Rätt medicin. Men den verkar först om några år.' },
      { text: 'LÅT FESTEN FORTSÄTTA', temp: { gdp: 3, approval: 2 }, ind: { houseprice: 5 }, next: ['sml_bo_krasch', 'sml_bo_krasch', null], tip: 'Alla känner sig rika. Så länge ingen säljer.' },
    ],
  },
  {
    id: 'sml_bo_krasch', icon: '\u{1F4C9}', chain: true,
    title: 'BOSTADSBUBBLAN HAR SPRUCKIT',
    text: 'På sex månader har bostadspriserna fallit med en femtedel. Familjer som köpte i fjol har lån som är större än vad huset är värt, byggbolagen avbryter projekt mitt i gjutningen och snickare och elektriker står utan jobb. Två mindre banker ber om nödlån.',
    choices: [
      { text: 'RÄDDA BANKERNA MED STATSGARANTIER', cost: { money: 1500 }, temp: { stability: 5, approval: -4 }, perm: { corruption: 1 }, ind: { stockcap: 6 }, tip: 'Bankerna överlever. Väljarna minns vem som fick hjälp först.' },
      { text: 'STÖD TILL SKULDSATTA HUSHÅLL', cost: { money: 1000 }, temp: { approval: 4, welfare: 2 }, ind: { homeless: -6 }, tip: 'Ingen familj ska behöva lämna huset för att priset föll.' },
      { text: 'LÅT PRISERNA HITTA BOTTEN', temp: { approval: -5, gdp: -3 }, ind: { houseprice: -10, unemp: 1.2 }, mod: 'downturn', next: ['sml_bo_fonder', null], tip: 'Marknaden städar. Det är bara inte den som får städa.' },
    ],
  },
  {
    id: 'sml_bo_mjuk', icon: '\u{1F6EC}', chain: true,
    title: 'MJUKLANDNINGEN LYCKADES',
    text: 'Ett år efter åtgärderna har bostadspriserna planat ut i stället för att rasa. Hushållen amorterar, byggandet går i jämn takt och Internationella valutafonden skriver i sin årsrapport att landet "hanterade bostadsmarknaden föredömligt". Mäklarna klagar på att visningarna har blivit tråkiga.',
    choices: [
      { text: 'BEHÅLL REGLERNA SOM DE ÄR', temp: { stability: 4, approval: 2 }, perm: { gdp: 1 }, tip: 'Tråkigt är underskattat i ekonomi.' },
      { text: 'LÄTTA PÅ KRAVEN FÖR FÖRSTAGÅNGSKÖPARE', cost: { pp: 10 }, temp: { approval: 5 }, ind: { houseprice: 3 }, tip: 'De unga jublar. Centralbanken höjer ett ögonbryn.' },
      { text: 'TA ÅT DIG ÄRAN I EN STOR INTERVJU', temp: { approval: 3, ideopower: 2 }, ind: { trustgov: 2 }, tip: 'Du förtjänar ungefär hälften av den.' },
    ],
  },
  {
    id: 'sml_bo_fonder', icon: '\u{1F3E2}', chain: true,
    title: 'FONDERNA KÖPER UPP HYRESHUSEN',
    text: 'Efter kraschen har utländska fastighetsfonder köpt tusentals hyreslägenheter till vrakpris. Nu kommer breven: renoveringar som ingen bett om och hyreshöjningar på fyrtio procent. I {stad} har hyresgästerna i ett helt kvarter bildat en förening och vägrar betala de nya hyrorna.',
    choices: [
      { text: 'KOMMUNERNA KÖPER TILLBAKA HUSEN', cost: { money: 1200 }, perm: { welfare: 1 }, temp: { approval: 4 }, ind: { homeless: -5 }, tip: 'Staten blir hyresvärd igen. Med allt vad det innebär av trasiga hissar.' },
      { text: 'INFÖR HYRESREGLERING', cost: { pp: 20 }, law: ['housing', 'rentcontrol'], temp: { approval: 5, gdp: -1 }, tip: 'Hyrorna fryses. Det gör nybyggandet också.' },
      { text: 'VÄLKOMNA KAPITALET', mod: 'foreign_investment', temp: { approval: -5, unrest: 4 }, ind: { homeless: 8 }, tip: 'Pengar strömmar in. Hyresgäster strömmar ut.' },
    ],
  },
  {
    id: 'sml_bo_hyra', icon: '\u{1F511}', weight: 2, cooldown: 800,
    title: 'HYRAN ÄTER HALVA LÖNEN',
    text: 'En ny rapport visar att en ensamstående undersköterska i {huvudstad} lägger nästan hälften av lönen på hyran. Var femte hyresgäst har fått en betalningsanmärkning det senaste året, och kronofogden har fler vräkningar på schemat än någon gång under det här årtiondet.',
    when: (c) => c.day > 60 && (c.ind.rentshare ?? 25) > 34 && c.st.welfare < 20,
    choices: [
      { text: 'HÖJ BOSTADSBIDRAGET', cost: { money: 600 }, temp: { welfare: 3, approval: 3 }, ind: { homeless: -5 }, tip: 'Hyresvärdarna har också läst rapporten.' },
      { text: 'HYRESTAK I STORSTÄDERNA', cost: { pp: 15 }, law: ['housing', 'rentcontrol'], temp: { approval: 4, gdp: -1 }, tip: 'Billigt att bo. Om man har ett kontrakt.' },
      { text: 'BYGG BILLIGA SMÅLÄGENHETER', cost: { money: 800 }, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'Trettio kvadrat, en balkong och tre års väntan på bygget.' },
      { text: 'DET ÄR ETT VAL VAR MAN BOR', temp: { approval: -4, unrest: 3 }, ind: { homeless: 6 }, tip: 'Undersköterskan flyttar. Vem sköter då de gamla i stan?' },
    ],
  },
  {
    id: 'sml_bo_protest', icon: '\u{1FAA7}', kind: 'valfard', react: true, cooldown: 600,
    title: 'HYRESGÄSTERNA GÅR UT PÅ GATORNA',
    text: 'Sedan beslutet om {lag} har hyresgästföreningen samlat fyrtio tusen människor på torget i {huvudstad}. Plakaten handlar om höjda hyror, uppsagda kontrakt och barnfamiljer som tvingas flytta från skolan där barnen har sina kompisar. Föreningen kräver att beslutet rivs upp före sommaren.',
    when: (c) => c.cut('housing') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -22, temp: { approval: 3 }, tip: 'Föreningen firar. Oppositionen kallar det en kullerbytta.' },
      { text: 'FÖRHANDLA FRAM ETT ÖVERGÅNGSSTÖD', cost: { money: 400 }, griev: -10, temp: { approval: 1 }, ind: { protests: -20 }, tip: 'Ett år av anstånd. Sedan står ni här igen.' },
      { text: 'STÅ FAST VID BESLUTET', griev: 8, temp: { unrest: 5, approval: -3 }, ind: { protests: 30, trustgov: -3 }, tip: 'Det blir en lång vår på torget.' },
    ],
  },
  {
    id: 'sml_bo_talt', icon: '\u{26FA}', weight: 2, cooldown: 900,
    title: 'TÄLTLÄGRET I STADSPARKEN',
    text: 'I stadsparken i {stad} bor nu ett par hundra människor i tält och kartonger. Det är byggnadsarbetare som förlorat jobbet, unga som slängts ut hemifrån och äldre män med missbruk. Härbärgena är fulla varje natt, och grannarna har startat en namninsamling.',
    when: (c) => c.day > 90 && perK(c, c.ind.homeless) > 3.5 && c.st.welfare < 10 && c.st.qol < 20 && (c.ind.unemp ?? 5) > 5,
    choices: [
      { text: 'FLER HÄRBÄRGEN OCH UPPSÖKARE', cost: { money: 400 }, temp: { welfare: 2, approval: 2 }, ind: { homeless: -6 }, next: ['sml_bo_vinter', null], tip: 'Tak över huvudet i natt. Frågan om i morgon kvarstår.' },
      { text: 'BOSTAD FÖRST: EGEN LÄGENHET UTAN VILLKOR', cost: { money: 900 }, perm: { welfare: 1 }, temp: { approval: 1 }, ind: { homeless: -12 }, next: 'sml_bo_bostadforst', tip: 'Dyrt i början. Billigare än akuten, polisen och härbärget i längden.' },
      { text: 'POLISEN RIVER LÄGRET', temp: { safety: 2, freedom: -2, approval: -2 }, ind: { homeless: 3 }, next: 'sml_bo_vinter', tip: 'Parken är tom. Människorna finns kvar någon annanstans.' },
    ],
  },
  {
    id: 'sml_bo_vinter', icon: '\u{2744}\u{FE0F}', chain: true,
    title: 'KÖLDKNÄPPEN',
    text: 'Termometern visar minus tjugo i {stad} för tredje natten i rad. Härbärgena har lagt madrasser i korridorerna och frivilliga kör runt med soppa och sovsäckar. I morse hittades en nedkyld man under en bro. Han klarade sig, men morgontidningarna frågar vem som bär ansvaret.',
    choices: [
      { text: 'ÖPPNA SKOLOR OCH IDROTTSHALLAR NATTETID', cost: { money: 200 }, temp: { approval: 4, welfare: 2 }, ind: { homeless: -4 }, tip: 'Gymnastiksalen luktar kaffe och våta ullsockor. Ingen fryser.' },
      { text: 'HEMVÄRNET SÄTTER UPP VÄRMETÄLT', cost: { money: 150, man: 2 }, temp: { approval: 3, stability: 1 }, tip: 'Soldater som delar ut filtar. Ovanligt men uppskattat.' },
      { text: 'DET ÄR KOMMUNENS ANSVAR', temp: { approval: -5 }, ind: { trustgov: -4, happiness: -0.1 }, tip: 'Kommunen säger att det är statens. Mannen under bron bryr sig inte.' },
    ],
  },
  {
    id: 'sml_bo_bostadforst', icon: '\u{1F3E0}', chain: true,
    title: 'BOSTAD FÖRST FUNGERAR',
    text: 'Ett år senare bor åtta av tio i försöket kvar i sina lägenheter. Akutbesöken har halverats, flera har börjat jobba och en av dem har blivit fotbollstränare för grannens barn. Forskarna som följt projektet säger att det har sparat mer pengar än det kostat.',
    choices: [
      { text: 'GÖR DET TILL EN NATIONELL MODELL', cost: { money: 700 }, perm: { welfare: 2, qol: 1 }, ind: { homeless: -10 }, tip: 'Det bästa beviset är en tränare som kommer i tid till varje match.' },
      { text: 'LÅT KOMMUNERNA VÄLJA SJÄLVA', temp: { approval: 3 }, ind: { homeless: -3 }, tip: 'Några gör det. Andra väntar på att någon annan ska göra det.' },
      { text: 'VISA UPP PROJEKTET FÖR OMVÄRLDEN', cost: { pp: 5 }, rel: 4, temp: { approval: 2 }, tip: 'Delegationer från sex länder vill komma på studiebesök.' },
    ],
  },
  {
    id: 'sml_bo_kranar', icon: '\u{1F3D7}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'KRANARNA ÄR TILLBAKA',
    text: 'Byggstarterna är de högsta på tjugo år. Med de nya reglerna för byggande växer hela kvarter upp i {stad}, bostadsköerna blir kortare och för första gången på länge har bostadspriserna slutat stiga snabbare än lönerna. Byggfacket varnar för att det snart saknas murare.',
    when: (c) => c.day > 120 && (c.is('urban_planning', 'upzoning', 'masterplan', 'newtowns') || c.is('housing', 'upzoning', 'coop', 'public')) && c.trend('houseprice') <= 0,
    choices: [
      { text: 'YRKESUTBILDNING FÖR BYGGARBETARE', cost: { money: 400 }, perm: { factory: 1 }, temp: { approval: 2 }, tip: 'Murare växer inte på träd. Men de kan utbildas på ett år.' },
      { text: 'KRÄV PARKER OCH SKOLOR I VARJE NYTT KVARTER', cost: { money: 500 }, perm: { qol: 2 }, temp: { gdp: -1 }, tip: 'Lite dyrare lägenheter. Mycket trevligare barndom.' },
      { text: 'BYGG SÅ FORT DET GÅR', temp: { gdp: 3, approval: 2 }, ind: { houseprice: -3, segreg: 2 }, tip: 'Snabbt och billigt. Om tjugo år kallas det ett problemområde.' },
    ],
  },
  {
    id: 'sml_bo_unga', icon: '\u{1F6CF}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'TRETTIO ÅR OCH BOR HEMMA',
    text: 'Var tredje ung vuxen i {huvudstad} bor fortfarande kvar i pojk- eller flickrummet. Lönerna räcker inte till kontantinsatsen och förstahandskontrakt finns inte. Undersökningar visar att unga skjuter upp både sambo och barn, och demograferna har börjat se det i födelsetalen.',
    when: (c) => c.day > 60 && (c.ind.houseprice ?? 6) > 10 && (c.ind.youthunemp ?? 10) > 8 && (c.ind.fert ?? 2) < 2,
    choices: [
      { text: 'STARTLÅN MED STATLIG GARANTI', cost: { money: 500 }, temp: { approval: 4 }, ind: { houseprice: 3 }, tip: 'Kontantinsatsen är löst. Priset stiger med exakt lika mycket.' },
      { text: 'BYGG STUDENT- OCH UNGDOMSBOSTÄDER', cost: { money: 800 }, perm: { qol: 1 }, temp: { approval: 3 }, ind: { homeless: -3 }, tip: 'Tjugo kvadrat med eget kylskåp. Ett palats för den som delat rum med lillebror.' },
      { text: 'UPPMUNTRA FLYTT TILL LANDSBYGDEN', cost: { pp: 5 }, temp: { approval: -1, gdp: 1 }, tip: 'Billiga hus finns. Jobb och fiber är en annan fråga.' },
      { text: 'VI SPARADE IHOP TILL VÅRT FÖRSTA HUS', temp: { approval: -3 }, ind: { happiness: -0.1 }, tip: 'Det gjorde ni. När ett hus kostade fyra årslöner.' },
    ],
  },
  {
    id: 'sml_bo_renovering', icon: '\u{1F9F1}', weight: 1, cooldown: 1000,
    title: 'RENOVERINGEN SOM BLEV EN UTFLYTTNING',
    text: 'Det stora hyresbolaget i {stad} ska renovera fyratusen lägenheter från sextiotalet. Rören behöver bytas, det är alla överens om. Men hyran höjs med femtio procent efteråt, och de flesta som bor där i dag har inte råd att flytta tillbaka. Hyresgästerna säger att bolaget byter ut de boende i stället för rören.',
    when: (c) => c.day > 150 && (c.ind.segreg ?? 30) > 44 && (c.ind.rentshare ?? 25) > 31 && c.st.welfare < 25,
    choices: [
      { text: 'STATLIGT STÖD TILL VARSAM RENOVERING', cost: { money: 600 }, temp: { approval: 3 }, ind: { segreg: -2, homeless: -3 }, tip: 'Nya rör, samma grannar. Hyran höjs med tio procent.' },
      { text: 'LAGSTIFTA OM RÄTT ATT BO KVAR', cost: { pp: 15 }, temp: { approval: 4, freedom: 1, gdp: -1 }, tip: 'Hyresgästerna stannar. Rören också, ett tag till.' },
      { text: 'LÅT BOLAGET GÖRA SOM DET VILL', temp: { gdp: 2, approval: -3 }, ind: { segreg: 3, homeless: 4 }, tip: 'Fräscha lägenheter, nya hyresgäster. De gamla flyttade längre ut.' },
    ],
  },

  // ===== VÅRDEN =====
  {
    id: 'sml_va_telefon', icon: '\u{260E}\u{FE0F}', kind: 'valfard', react: true, cooldown: 600,
    title: 'VÅRDCENTRALERNA SVARAR INTE',
    text: 'Sedan beslutet om {lag} har det blivit svårare att komma fram. Telefonköerna till vårdcentralerna i {stad} är tre timmar långa, och den som till slut kommer fram får en tid om fem veckor. Läkarförbundet skriver ett öppet brev och kallar det "ett experiment med folkhälsan".',
    when: (c) => c.cut('healthcare', 'healthcare_quality') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -22, temp: { approval: 3 }, tip: 'Det kostar prestige. Sjukdomar väntar inte på prestige.' },
      { text: 'EXTRA PENGAR TILL VÅRDCENTRALERNA', cost: { money: 700 }, griev: -10, temp: { welfare: 2 }, tip: 'Ett plåster som räcker ett år.' },
      { text: 'STÅ FAST: VÅRDEN MÅSTE EFFEKTIVISERAS', griev: 9, temp: { approval: -3, unrest: 3 }, ind: { trustgov: -4 }, next: ['sml_va_akuten', null], tip: 'Effektivare blir den. Kortare blir köerna inte.' },
    ],
  },
  {
    id: 'sml_va_sjukskot', icon: '\u{1FA7A}', weight: 2, cooldown: 1000,
    title: 'SJUKSKÖTERSKORNA SÄGER UPP SIG',
    text: 'På sjukhuset i {stad} har fyrtio sjuksköterskor lämnat in sina uppsägningar samma dag. De säger att de inte hinner ge patienterna den vård de behöver, att övertiden aldrig tar slut och att lönen inte räcker för att bo i staden. Avdelningscheferna tittar på sommarschemat och blir bleka.',
    when: (c) => c.day > 80 && (c.ind.nurses ?? 8) < 7 && (c.ind.carewait ?? 40) > 45 && c.st.welfare < 15 && (c.ind.gdppc ?? 0) > 4000,
    choices: [
      { text: 'LÖNELYFT PÅ TOLV PROCENT', cost: { money: 900 }, temp: { welfare: 3, approval: 2 }, next: ['sml_va_tillbaka', null], tip: 'Det dyraste svaret. Och det enda de själva bad om.' },
      { text: 'REKRYTERA SJUKSKÖTERSKOR FRÅN UTLANDET', cost: { money: 300, pp: 10 }, temp: { welfare: 1, immigration: 2 }, next: ['sml_va_tillbaka', 'sml_va_akuten'], tip: 'Språkkurs, legitimation, bostad. Det tar ett år innan de står på golvet.' },
      { text: 'HYR IN BEMANNINGSSJUKSKÖTERSKOR', cost: { money: 500 }, temp: { welfare: 1 }, next: ['sml_va_akuten', null], tip: 'Samma sjuksköterskor, nu via ett bolag och till dubbla priset.' },
      { text: 'DE KOMMER TILLBAKA NÄR DE FÅTT VILA', temp: { welfare: -3, approval: -2 }, next: 'sml_va_akuten', tip: 'Några gör det. De flesta har redan börjat på apoteket.' },
    ],
  },
  {
    id: 'sml_va_akuten', icon: '\u{1F691}', chain: true,
    title: 'AKUTEN STÄNGER NATTETID',
    text: 'Akutmottagningen i {stad} har inte personal nog och stänger mellan tio på kvällen och sju på morgonen. Ambulanserna får köra nio mil till närmaste sjukhus. Lokaltidningen har satt upp en klocka på förstasidan som räknar dagarna sedan stängningen.',
    choices: [
      { text: 'AMBULANSHELIKOPTER OCH FLER AMBULANSER', cost: { money: 500 }, temp: { welfare: 2, approval: 2 }, tip: 'Snabbare transport. Men det är fortfarande nio mil.' },
      { text: 'NÖDLÖN FÖR ALLA SOM TAR NATTPASS', cost: { money: 700 }, temp: { welfare: 3, approval: 3 }, perm: { income: -1 }, tip: 'Akuten öppnar igen. Nu ska pengarna bara finnas varje månad.' },
      { text: 'CENTRALISERA VÅRDEN TILL STORSJUKHUSET', temp: { income: 2, approval: -5 }, ind: { trustgov: -4 }, next: ['sml_va_skandal', null], tip: 'Effektivt på en karta. Mindre effektivt mitt i natten.' },
    ],
  },
  {
    id: 'sml_va_skandal', icon: '\u{1F4F0}', chain: true,
    title: 'NIO TIMMAR I VÄNTRUMMET',
    text: 'En 58-årig man med bröstsmärtor fick vänta nio timmar innan en läkare hann undersöka honom. Han klarade sig efter en akut hjärtoperation. Hans dotter har berättat allt i tv, och sjukhusets egen avvikelserapport har läckt: personalen varnade ledningen redan i våras.',
    choices: [
      { text: 'OBEROENDE GRANSKNING AV HELA VÅRDKEDJAN', cost: { pp: 15 }, temp: { approval: 2 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, tip: 'Granskningen tar ett år. Men den visar att du tar det på allvar.' },
      { text: 'VÅRDGARANTI MED ÖRONMÄRKTA PENGAR', cost: { money: 1200 }, perm: { welfare: 2 }, temp: { approval: 4 }, ind: { life: 0.1 }, tip: 'Lagen säger att ingen ska vänta så länge. Pengarna gör det möjligt.' },
      { text: 'SPARKA SJUKHUSDIREKTÖREN', temp: { approval: 2, stability: -1, welfare: -1 }, tip: 'En syndabock. Väntrummet är lika fullt i morgon.' },
      { text: 'TONA NER DET SOM ETT ENSKILT FALL', mod: 'cover_up', temp: { approval: -4 }, ind: { trustgov: -6 }, tip: 'Det finns alltid ett fall till. Och en dotter till med en telefon.' },
    ],
  },
  {
    id: 'sml_va_tillbaka', icon: '\u{1F49A}', chain: true,
    title: 'SJUKSKÖTERSKORNA KOMMER TILLBAKA',
    text: 'Ett halvår efter satsningen har sjukhuset i {stad} fler sökande än lediga tjänster för första gången på tio år. Flera som slutade har kommit tillbaka, övertiden har nästan halverats och sjukfrånvaron bland personalen sjunker. En av dem säger i radio att hon äntligen hinner hålla patienterna i handen.',
    choices: [
      { text: 'GÖR LÖNELYFTET PERMANENT', cost: { money: 600 }, perm: { welfare: 2, qol: 1 }, tip: 'Det som fungerar ska man inte ta bort nästa budgetår.' },
      { text: 'UTBILDA FLER SPECIALISTSJUKSKÖTERSKOR', cost: { money: 400, rp: 10 }, perm: { hdi: 1 }, temp: { welfare: 1 }, tip: 'Narkos, barn, intensivvård. Det tar två år och håller i trettio.' },
      { text: 'TACKA PERSONALEN OFFENTLIGT', temp: { approval: 3, stability: 1 }, tip: 'Blommor är billigare än löner. Den här gången räcker de.' },
    ],
  },
  {
    id: 'sml_va_kortare', icon: '\u{23F1}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'VÄNTETIDERNA HAR HALVERATS',
    text: 'Den nya mätningen visar att väntetiden till specialistvård har halverats på två år. Höftoperationer som förr tog ett år görs nu inom tre månader, och vårdcentralerna svarar i telefon samma dag. Patientföreningen, som brukar vara hårdast i sin kritik, skickar en tårta till departementet.',
    when: (c) => c.day > 150 && (c.ind.carewait ?? 60) < 40 && c.trend('carewait') < 0 && c.st.welfare > 0,
    choices: [
      { text: 'BEHÅLL SATSNINGEN SOM DEN ÄR', cost: { money: 300 }, perm: { welfare: 1 }, temp: { approval: 4 }, tip: 'Det tråkiga underhållet av något som fungerar.' },
      { text: 'FLYTTA PENGAR TILL PSYKIATRIN', cost: { pp: 10 }, perm: { hdi: 1 }, temp: { approval: 2 }, ind: { happiness: 0.1 }, tip: 'Höfterna är lagade. Nu är det själen som står i kö.' },
      { text: 'SPARA DET SOM BLIR ÖVER', res: { money: 400 }, temp: { approval: -2 }, tip: 'Köerna minns hur det var. De kommer tillbaka om de får chansen.' },
    ],
  },
  {
    id: 'sml_va_lakare', icon: '\u{2708}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'LÄKARNA FLYTTAR UTOMLANDS',
    text: 'Var fjärde nyutbildad läkare har lämnat landet inom tre år, de flesta till sjukhus i {land} där lönen är tre gånger så hög. På landsbygden finns byar där närmaste läkare är fem timmars bussresa bort. Läkarskolan utbildar i praktiken läkare åt andra länder.',
    when: (c) => c.day > 60 && (c.ind.doctors ?? 3) < 1.5 && c.st.welfare < 20 && (c.ind.gdppc ?? 0) > 1500 && (c.ind.gdppc ?? 0) < 25000,
    choices: [
      { text: 'DUBBLA LÄKARLÖNERNA PÅ LANDSBYGDEN', cost: { money: 700 }, temp: { welfare: 2 }, perm: { hdi: 1 }, tip: 'Det är dyrt att konkurrera med utlandet. Det är dyrare att låta bli.' },
      { text: 'FEM ÅRS TJÄNSTGÖRINGSPLIKT EFTER EXAMEN', cost: { pp: 15 }, temp: { freedom: -2, welfare: 2 }, tip: 'Läkarna stannar. Somliga med sammanbitna käkar.' },
      { text: 'UTBILDA FLER, OCH SNABBARE', cost: { money: 500, rp: 20 }, perm: { hdi: 1 }, tip: 'Om hälften flyttar får man utbilda dubbelt så många. Det tar sex år.' },
      { text: 'LÅT DEM FLYTTA, DE SKICKAR HEM PENGAR', temp: { gdp: 1, welfare: -3 }, ind: { life: -0.1 }, tip: 'Pengarna kommer hem. Läkarna gör det inte.' },
    ],
  },
  {
    id: 'sml_va_korridor', icon: '\u{1F6CC}', weight: 2, cooldown: 800,
    title: 'PATIENTERNA LIGGER I KORRIDOREN',
    text: 'Influensan har slagit till tidigt, och sjukhuset i {huvudstad} har inte en enda ledig vårdplats. Patienter ligger på britsar i korridorerna, operationer ställs in och äldre som är färdigbehandlade kan inte skrivas ut eftersom kommunen saknar platser på äldreboendena.',
    when: (c) => c.day > 60 && (c.ind.beds ?? 4) < 2.6 && (c.ind.old ?? 10) > 10 && c.st.welfare < 20,
    choices: [
      { text: 'ÖPPNA FLER VÅRDPLATSER', cost: { money: 800 }, perm: { welfare: 1 }, temp: { approval: 2 }, tip: 'Sängar går att köpa. Det är personalen bredvid dem som är svår.' },
      { text: 'VACCINATIONSKAMPANJ INFÖR NÄSTA VINTER', cost: { money: 250 }, temp: { welfare: 1, approval: 1 }, ind: { life: 0.1 }, tip: 'Ingen ser en influensa som uteblev. Men den syns i korridoren.' },
      { text: 'BÖTFÄLL KOMMUNER SOM INTE TAR HEM SINA ÄLDRE', cost: { pp: 10 }, temp: { income: 1, approval: -1, welfare: 1 }, tip: 'Kommunerna betalar med pengar som skulle gått till äldreboenden.' },
      { text: 'STÄLL IN ALLA PLANERADE OPERATIONER', temp: { welfare: -3, approval: -3 }, ind: { trustgov: -3 }, tip: 'Korridoren töms. Kön för höftoperationer växer med tusen.' },
    ],
  },
  {
    id: 'sml_va_sjukskrivning', icon: '\u{1F912}', weight: 2, cooldown: 900,
    title: 'SJUKSKRIVNINGARNA RUSAR',
    text: 'Sjukfrånvaron är den högsta på femton år. Det är inte förkylningar utan stress, utmattning och ryggvärk, och mest drabbade är kvinnor i vård, skola och omsorg. Försäkringskassan begär mer pengar, och arbetsgivarna klagar på att de inte kan planera någonting.',
    when: (c) => c.day > 60 && (c.ind.sickleave ?? 3) > 4.2 && (c.ind.gdppc ?? 0) > 8000,
    choices: [
      { text: 'NY LAG OM ARBETSMILJÖ OCH BEMANNING', cost: { pp: 15 }, perm: { qol: 1 }, temp: { factory: -1, approval: 2 }, tip: 'Färre utbrända. Lite dyrare att driva en förskola.' },
      { text: 'TIDIG REHABILITERING I STÄLLET FÖR LÅNG SJUKSKRIVNING', cost: { money: 500 }, perm: { welfare: 1 }, temp: { gdp: 1 }, tip: 'En fysioterapeut i dag sparar ett års frånvaro i morgon.' },
      { text: 'SKÄRP KONTROLLEN AV SJUKINTYGEN', temp: { income: 2, approval: -3 }, ind: { happiness: -0.1 }, tip: 'Fler går till jobbet. Somliga av dem borde inte göra det.' },
    ],
  },
  {
    id: 'sml_va_psyk', icon: '\u{1F9E0}', weight: 2, cooldown: 900,
    title: 'DE UNGA MÅR SÄMRE ÄN NÅGONSIN',
    text: 'Var femte femtonåring säger i den nya folkhälsoenkäten att de ofta har ångest eller sover dåligt. Kön till barn- och ungdomspsykiatrin i {stad} är åtta månader lång, och skolkuratorerna hinner bara med de mest akuta. Föräldrar startar egna stödgrupper på nätet.',
    when: (c) => c.day > 60 && (c.ind.mentalill ?? 12) > 14 && (c.ind.internet ?? 50) > 60,
    choices: [
      { text: 'STOR SATSNING PÅ BARNPSYKIATRIN', cost: { money: 800 }, perm: { hdi: 1, welfare: 1 }, ind: { happiness: 0.1 }, tip: 'Åtta månaders kö blir tre. Fortfarande en evighet för en femtonåring.' },
      { text: 'EN KURATOR OCH EN SKOLSKÖTERSKA PÅ VARJE SKOLA', cost: { money: 500 }, perm: { welfare: 1 }, temp: { approval: 3 }, tip: 'Någon att prata med innan det blir en remiss.' },
      { text: 'MOBILFRIA SKOLDAGAR I HELA LANDET', cost: { pp: 10 }, temp: { approval: 2, freedom: -1 }, ind: { happiness: 0.05 }, tip: 'Eleverna protesterar. Rasterna blir plötsligt högljudda.' },
      { text: 'DET ÄR FÖRÄLDRARNAS ANSVAR', temp: { approval: -3 }, ind: { happiness: -0.1 }, tip: 'Föräldrarna håller med. De vet bara inte vad de ska göra.' },
    ],
  },
  {
    id: 'sml_va_nollvision', icon: '\u{1F56F}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'NOLLVISIONEN SOM INGEN PRATAR OM',
    text: 'Statistiken är tydlig: fler dör för egen hand än i trafiken, men samhället lägger en bråkdel så mycket pengar på att förebygga det. Anhörigföreningarna har samlat in en miljon namnunderskrifter och ber om en nationell nollvision, med samma allvar som när man byggde mitträcken på vägarna.',
    when: (c) => c.day > 90 && (c.ind.suicide ?? 8) > 14 && (c.ind.gdppc ?? 0) > 5000,
    choices: [
      { text: 'INFÖR EN NATIONELL NOLLVISION', cost: { money: 600 }, perm: { hdi: 1, welfare: 1 }, ind: { happiness: 0.1 }, tip: 'Stödlinjer, utbildad skolpersonal, snabbare hjälp. Det räddar liv i tysthet.' },
      { text: 'STÖDLINJE SOM SVARAR DYGNET RUNT', cost: { money: 200 }, temp: { welfare: 2, approval: 2 }, tip: 'Någon som svarar klockan tre på natten. Mer behövs inte alltid.' },
      { text: 'LÅT REGIONERNA SKÖTA DET SOM I DAG', temp: { approval: -3 }, ind: { trustgov: -2 }, tip: 'Det är regionernas ansvar. Det har det varit i tjugo år.' },
    ],
  },
  {
    id: 'sml_va_forsakring', icon: '\u{1F4B3}', kind: 'valfard', react: true, cooldown: 700,
    title: 'FÖRSÄKRINGSKORTET AVGÖR',
    text: 'Sedan beslutet om {lag} måste patienterna visa betalkort eller försäkring innan de får träffa en läkare. I {stad} har en välgörenhetsklinik öppnat i en gammal kyrka, och kön ringlar runt kvarteret varje morgon. Läkarna där ser sjukdomar som borde ha behandlats för ett år sedan.',
    when: (c) => c.cut('healthcare') && c.is('healthcare', 'employer', 'savings', 'mostlyunfree', 'unfree'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -20, temp: { approval: 3 }, tip: 'Kyrkan blir kyrka igen.' },
      { text: 'STATLIG GRUNDFÖRSÄKRING FÖR ALLA', cost: { money: 700 }, griev: -12, perm: { welfare: 1 }, tip: 'Ett golv under alla. Lägre än det gamla, men ett golv.' },
      { text: 'BIDRAG TILL VÄLGÖRENHETSKLINIKERNA', cost: { money: 200 }, griev: -4, temp: { approval: 1 }, tip: 'Staten betalar kyrkan för att göra statens jobb.' },
      { text: 'MARKNADEN HÅLLER NERE KOSTNADERNA', griev: 8, temp: { income: 2 }, ind: { life: -0.2, trustgov: -3 }, tip: 'Kostnaderna sjunker. Det gör medellivslängden också.' },
    ],
  },
  {
    id: 'sml_va_mobilen', icon: '\u{1F4F1}', weight: 1, cooldown: 1000,
    title: 'VÅRDCENTRALEN I MOBILEN',
    text: 'Två år efter satsningen på digital vård kan nio av tio invånare boka tid, förnya recept och prata med en sjuksköterska i mobilen. Väntrummen har blivit lugnare och läkarna hinner med de svåra fallen. Men pensionärsföreningen påminner om att alla inte har en smart telefon.',
    when: (c) => c.day > 150 && c.is('healthcare_quality', 'digital', 'modern', 'extra', 'frontier') && (c.ind.internet ?? 50) > 80,
    choices: [
      { text: 'DIGITALA LOTSAR FÖR ÄLDRE', cost: { money: 200 }, temp: { welfare: 2, approval: 3 }, tip: 'Ett barnbarn i statens tjänst. Med tålamod.' },
      { text: 'LÅT AI SORTERA PATIENTERNA', cost: { rp: 20 }, perm: { welfare: 1 }, temp: { freedom: -1 }, tip: 'Snabbare sortering. Och en ny debatt om vem som har ansvaret när den har fel.' },
      { text: 'SÄLJ SYSTEMET TILL ANDRA LÄNDER', res: { money: 400 }, rel: 3, temp: { research: 1 }, tip: 'Den bästa exportvaran: något som fungerar.' },
    ],
  },
  {
    id: 'sml_va_lofte', icon: '\u{1F3E5}', kind: 'valfard', react: true, cooldown: 700,
    title: 'VÅRDLÖFTET MÖTER VERKLIGHETEN',
    text: 'Sedan beslutet om {lag} finns pengarna till en bättre vård. Men regionerna kan inte anställa folk som inte finns: det tar tre år att utbilda en sjuksköterska och elva år att utbilda en specialistläkare. Kvällstidningen har räknat efter, och väntetiderna har inte rört sig.',
    when: (c) => c.raised('healthcare', 'healthcare_quality') && c.day > 30,
    choices: [
      { text: 'BE OM TÅLAMOD I ETT TAL TILL NATIONEN', cost: { pp: 5 }, griev: -5, temp: { approval: 1, stability: 2 }, tip: 'Ärlighet är ovanligt i politiken. Ibland belönas den.' },
      { text: 'FLER PLATSER PÅ VÅRDUTBILDNINGARNA', cost: { money: 500 }, griev: -8, perm: { welfare: 2 }, tip: 'Resultatet syns om tre år. Valet är om två.' },
      { text: 'HYR IN PERSONAL FRÅN BEMANNINGSBOLAG', cost: { money: 800 }, griev: -6, temp: { welfare: 3 }, perm: { income: -1 }, tip: 'Snabbt och dyrt. Bemanningsbolagen öppnar champagnen.' },
      { text: 'SKYLL PÅ REGIONERNA', griev: 4, temp: { approval: -2 }, ind: { trustgov: -2 }, tip: 'Regionerna skyller tillbaka. Patienterna lyssnar inte på någon.' },
    ],
  },

  // ===== SKOLAN =====
  {
    id: 'sml_sk_protest', icon: '\u{1F3EB}', kind: 'valfard', react: true, cooldown: 600,
    title: 'LÄRARNA LÄMNAR KLASSRUMMEN',
    text: 'Klockan tio i morse reste sig lärarna på hundratals skolor och gick ut på skolgårdarna. Protesten gäller beslutet om {lag}, som lärarfacket säger ger större klasser och sämre stöd till de elever som har det svårast. Eleverna gick efter, och många föräldrar kom dit med kaffe.',
    when: (c) => c.cut('education', 'school_choice') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -20, temp: { approval: 3 }, tip: 'Lärarna går in igen. Rasten var ovanligt lång i dag.' },
      { text: 'LOVA FLER SPECIALPEDAGOGER', cost: { money: 500 }, griev: -10, temp: { welfare: 1 }, tip: 'Ett löfte med en prislapp. Lärarna har sett sådana förut.' },
      { text: 'STÅ FAST VID BESLUTET', griev: 8, temp: { approval: -3, unrest: 3 }, ind: { trustgov: -3 }, next: ['sml_sk_obehoriga', null], tip: 'Lärarna går in. Några av dem går sedan till ett annat yrke.' },
    ],
  },
  {
    id: 'sml_sk_lararbrist', icon: '\u{1F4DA}', weight: 2, cooldown: 1000,
    title: 'LÄRARBRISTEN',
    text: 'Inför höstterminen saknas tusentals behöriga lärare. Rektorerna i {stad} ringer runt till pensionerade lärare, studenter och föräldrar som "kan lite matte". Lärarutbildningarna har halvtomma föreläsningssalar, och många som tar examen byter yrke efter några år.',
    when: (c) => c.day > 80 && ((c.ind.pupilteacher ?? 15) > 20 || (c.ind.trainedteach ?? 95) < 85) && c.st.welfare < 15 && (c.ind.gdppc ?? 0) > 3000,
    choices: [
      { text: 'LÖNELYFT FÖR ALLA LÄRARE', cost: { money: 800 }, temp: { welfare: 2, approval: 2 }, next: ['sml_sk_lararlyft', null], tip: 'Det tar fyra år att utbilda en lärare. Det tar en dag att få en att stanna.' },
      { text: 'SNABBSPÅR FÖR AKADEMIKER SOM VILL BLI LÄRARE', cost: { money: 300, rp: 10 }, temp: { research: 1 }, next: ['sml_sk_lararlyft', 'sml_sk_obehoriga'], tip: 'Kemister och ingenjörer framför tavlan. Somliga är födda pedagoger.' },
      { text: 'STÖRRE KLASSER', temp: { income: 2, approval: -2 }, next: 'sml_sk_obehoriga', tip: 'Trettiotvå elever per klass. Det fungerade på femtiotalet, säger någon.' },
    ],
  },
  {
    id: 'sml_sk_obehoriga', icon: '\u{270F}\u{FE0F}', chain: true,
    title: 'VIKARIERNA SOM BLEV KVAR',
    text: 'Nu undervisar en av fyra lärare utan lärarexamen. Många gör ett hjältemodigt jobb, men i {stad} har en niondeklass haft sju olika mattelärare på ett läsår. Skolinspektionen varnar för att elever vars föräldrar inte kan hjälpa till hemma halkar efter mest.',
    choices: [
      { text: 'BETALD LÄRARUTBILDNING FÖR VIKARIERNA', cost: { money: 600 }, perm: { qol: 1 }, temp: { approval: 2 }, next: ['sml_sk_lararlyft', null], tip: 'De kan redan klassrummet. Nu får de papper på det.' },
      { text: 'LÄXHJÄLP OCH LOVSKOLA', cost: { money: 300 }, temp: { welfare: 1, approval: 1 }, tip: 'Ett skyddsnät under dem som faller. Hålet i taket är kvar.' },
      { text: 'VÄNTA PÅ NÄSTA KUNSKAPSMÄTNING', temp: { approval: -2 }, next: 'sml_sk_pisachock', tip: 'Mätningen kommer. Den brukar inte vänta.' },
    ],
  },
  {
    id: 'sml_sk_pisachock', icon: '\u{1F4C9}', chain: true,
    title: 'PISA-CHOCKEN',
    text: 'Den internationella kunskapsmätningen är här, och landet har rasat. Femtonåringarna läser sämre än för tio år sedan och var femte klarar inte grundläggande matematik. Tidningarna gör hela uppslag med tabeller där {granne} ligger långt före. Föräldrar ringer rektorerna och undrar vad som har hänt.',
    choices: [
      { text: 'TILLSÄTT EN SKOLKOMMISSION', cost: { pp: 15 }, temp: { approval: 2, stability: 1 }, ind: { trustgov: 1 }, tip: 'Kommissionen svarar om två år. Eleverna har gått ut då.' },
      { text: 'LÄSA-SKRIVA-RÄKNA-GARANTI FRÅN FÖRSTA KLASS', cost: { money: 700 }, perm: { hdi: 1, qol: 1 }, temp: { approval: 1 }, tip: 'Varje barn som halkar efter ska fångas upp tidigt. Effekten syns om åtta år.' },
      { text: 'SKYLL PÅ MÄTMETODEN', temp: { approval: -3, ideopower: 1 }, ind: { trustgov: -3 }, tip: 'Termometern har fel, sa patienten med feber.' },
    ],
  },
  {
    id: 'sml_sk_lararlyft', icon: '\u{1F34E}', chain: true,
    title: 'LÄRARYRKET ÄR POPULÄRT IGEN',
    text: 'För första gången på femton år har lärarutbildningen fler sökande än platser. Lönerna har gått upp, klasserna har krympt och i {stad} har en skola alla tjänster tillsatta med behöriga lärare. De nya lärarna säger att de valde yrket för att det äntligen syns att samhället bryr sig.',
    choices: [
      { text: 'BEHÅLL SATSNINGEN I FLERA MANDATPERIODER', cost: { money: 400 }, perm: { hdi: 1, qol: 1 }, tip: 'Skolan är ett tjugoårsprojekt i ett fyraårigt system.' },
      { text: 'LÅT LÄRARNA BESTÄMMA MER SJÄLVA', cost: { pp: 5 }, temp: { approval: 2, research: 1, freedom: 1 }, tip: 'Färre blanketter. Mer undervisning. Rektorerna vet inte vad de ska göra.' },
      { text: 'MINSKA SATSNINGEN, DET RÄCKER NU', res: { money: 300 }, temp: { approval: -3 }, tip: 'Det räckte länge nog för att börja igen.' },
    ],
  },
  {
    id: 'sml_sk_pisaupp', icon: '\u{1F3C6}', weight: 2, cooldown: 1000,
    title: 'SKOLRESULTATEN STIGER IGEN',
    text: 'Den nya kunskapsmätningen visar att femtonåringarna läser, räknar och förstår naturvetenskap bättre än förra gången, och skillnaderna mellan skolor har minskat. Utländska delegationer bokar studiebesök, och i {stad} har en högstadieskola i ett utsatt område tagit sig in bland de tio bästa i landet.',
    when: (c) => c.day > 150 && (c.ind.pisa ?? 450) > 490 && c.trend('pisa') > 0,
    choices: [
      { text: 'BJUD IN LÄRARNA TILL EN FEST PÅ SLOTTET', cost: { money: 100 }, temp: { approval: 3, stability: 1 }, tip: 'Tårta och tal. Lärarna har förtjänat båda.' },
      { text: 'SÄLJ LÄROMEDLEN TILL UTLANDET', res: { money: 300 }, rel: 3, tip: 'Mattebok på tolv språk. Med landets flagga på baksidan.' },
      { text: 'SKRIV IN METODERNA I LÄROPLANEN', cost: { pp: 10 }, perm: { hdi: 1 }, temp: { research: 1 }, tip: 'Det som fungerar på en skola ska fungera på alla. Förhoppningsvis.' },
    ],
  },
  {
    id: 'sml_sk_lasa', icon: '\u{1F4D6}', weight: 2, cooldown: 1000,
    title: 'VAR FJÄRDE ELEV LÄSER DÅLIGT',
    text: 'En ny rapport visar att var fjärde elev som lämnar grundskolan inte kan läsa en tidningsartikel och förstå vad den handlar om. Lärarna pekar på mobilerna, de stora klasserna och att barnen läser färre böcker hemma. Arbetsgivarna klagar på att nyanställda inte förstår en arbetsorder.',
    when: (c) => c.day > 60 && (c.ind.pisa ?? 450) < 440 && (c.ind.gdppc ?? 0) > 12000,
    choices: [
      { text: 'BIBLIOTEKARIE PÅ VARJE SKOLA', cost: { money: 400 }, perm: { hdi: 1, qol: 1 }, tip: 'Ett rum fullt av böcker och en vuxen som vet vilken som passar.' },
      { text: 'EN TIMMES LÄSNING VARJE SKOLDAG', cost: { pp: 10 }, perm: { hdi: 1 }, temp: { approval: 1 }, tip: 'Tyst i klassrummet. Bara bladvändningar.' },
      { text: 'FLER NATIONELLA PROV', cost: { money: 150 }, temp: { statepower: 1, approval: -1 }, tip: 'Att väga grisen gör den inte tyngre.' },
      { text: 'DET HAR ALLTID SAGTS ATT UNGDOMEN ÄR SÄMRE', temp: { approval: -3, research: -1 }, tip: 'Det har det. Men den här gången finns det siffror.' },
    ],
  },
  {
    id: 'sml_sk_friskolor', icon: '\u{1F392}', weight: 2, cooldown: 1000,
    title: 'FRISKOLORNA OCH DE SOM BLEV KVAR',
    text: 'Med fritt skolval har föräldrar med tid och kunskap valt bort skolan i förorten. Nu har den kommunala skolan i {stad} mest elever som ingen annan skola ville ta emot, och lärarna slutar en efter en. Forskarna kallar det segregation genom fria val. Föräldrarna kallar det att vilja barnens bästa.',
    when: (c) => c.day > 120 && c.is('school_choice', 'vouchers', 'esa', 'feepaying', 'selective') && (c.ind.segreg ?? 30) > 40,
    choices: [
      { text: 'LOTTA PLATSERNA I STÄLLET FÖR KÖTID', cost: { pp: 15 }, temp: { approval: -1 }, ind: { segreg: -2 }, tip: 'Rättvist. Föräldrarna som stått i kö sedan förlossningen tycker annorlunda.' },
      { text: 'FÖRBJUD VINSTUTDELNING I SKOLAN', cost: { pp: 20 }, law: ['school_choice', 'nonprofit'], temp: { approval: 2, gdp: -1 }, tip: 'Skolbolagen flyttar pengarna till lärarlöner. Eller till ett annat land.' },
      { text: 'EXTRA PENGAR TILL SKOLOR I UTSATTA OMRÅDEN', cost: { money: 500 }, perm: { qol: 1 }, ind: { segreg: -1 }, tip: 'Bästa lärarna till de svåraste klasserna. Det är dyrt att övertyga dem.' },
      { text: 'FRIA VAL ÄR FRIA VAL', temp: { freedom: 1, approval: -2 }, ind: { segreg: 2 }, tip: 'Alla får välja. Somliga får välja mer än andra.' },
    ],
  },
  {
    id: 'sml_sk_konkurs', icon: '\u{1F6AA}', weight: 1, cooldown: 1500, rare: true,
    title: 'SKOLKONCERNEN GICK I KONKURS',
    text: 'Mitt i terminen har en av landets största skolkoncerner gått i konkurs. Tolv skolor stänger på fredag och fyratusen elever står utan skola på måndag. Det visar sig att koncernen lånat pengar med skolhusen som säkerhet och betalat ut stora vinster till ägarna i {land}.',
    when: (c) => c.day > 150 && c.is('school_choice', 'vouchers', 'esa', 'feepaying', 'selective', 'mixed') && c.st.corruption > 15,
    choices: [
      { text: 'KOMMUNERNA TAR EMOT ALLA ELEVER', cost: { money: 600 }, temp: { approval: 3, welfare: 1 }, tip: 'Gymnastiksalar blir klassrum. Ingen elev blir utan.' },
      { text: 'STATEN DRIVER SKOLORNA ÅRET UT', cost: { money: 200, pp: 15 }, temp: { stability: 2, statepower: 2 }, tip: 'Samma lärare, samma klassrum, ny arbetsgivare på måndag.' },
      { text: 'SKÄRPT ÄGARPRÖVNING FÖR SKOLBOLAG', cost: { pp: 10 }, perm: { corruption: -1 }, temp: { approval: 1 }, tip: 'Den som vill driva skola ska visa att den kan räkna.' },
      { text: 'FÖRÄLDRARNA FÅR HITTA EN NY SKOLA', temp: { approval: -6 }, ind: { trustgov: -4 }, tip: 'Fyratusen familjer ringer samma tio rektorer.' },
    ],
  },
  {
    id: 'sml_sk_utanfor', icon: '\u{1F467}', weight: 2, cooldown: 900,
    title: 'BARNEN SOM INTE GÅR I SKOLAN',
    text: 'I bergsbyarna och i kåkstäderna runt {huvudstad} går inte vart tionde barn i skolan alls. Flickorna stannar hemma och passar syskon, pojkarna bär vatten eller säljer saker på gatan. Skolan är gratis, men skoluniformen, böckerna och den långa vägen kostar mer än många familjer har.',
    when: (c) => c.day > 60 && (c.ind.outofschool ?? 0) / Math.max(1, c.ind.kidsn ?? 1e6) > 0.04,
    choices: [
      { text: 'GRATIS SKOLLUNCH ÅT ALLA BARN', cost: { money: 400 }, perm: { hdi: 1 }, temp: { approval: 3 }, tip: 'Ett mål mat om dagen. Det är skäl nog att gå till skolan.' },
      { text: 'BIDRAG TILL FAMILJER VARS BARN GÅR I SKOLAN', cost: { money: 300, pp: 10 }, law: ['welfare', 'cct'], temp: { approval: 2 }, tip: 'Pengarna kommer varje månad som barnet varit i skolan.' },
      { text: 'BYGG SKOLOR UTE I BYARNA', cost: { money: 800 }, perm: { hdi: 2 }, temp: { approval: 2 }, tip: 'Två timmars promenad blir tio minuter.' },
      { text: 'SKOLPLIKT MED BÖTER', temp: { statepower: 2, approval: -4 }, tip: 'Böter till dem som inte har råd med skoluniform. Det löser sig nog.' },
    ],
  },
  {
    id: 'sml_sk_hemmasittare', icon: '\u{1F3E0}', weight: 2, cooldown: 900,
    title: 'HEMMASITTARNA',
    text: 'Tusentals elever har inte varit i skolan på månader. De är inte sjuka i vanlig mening, utan har ångest, har blivit mobbade eller orkar helt enkelt inte. Föräldrarna i {stad} får brev om skolplikten men ingen hjälp. En mamma har gått ner på halvtid för att kunna vara hemma med sin son.',
    when: (c) => c.day > 60 && (c.ind.mentalill ?? 12) > 13 && (c.ind.gdppc ?? 0) > 20000,
    choices: [
      { text: 'RESURSSKOLOR MED SMÅ GRUPPER', cost: { money: 500 }, perm: { welfare: 1 }, ind: { happiness: 0.05 }, tip: 'Sex elever, två lärare och en hund. Några kommer tillbaka.' },
      { text: 'SKOLAN MÅSTE NÅ VARJE ELEV INOM EN VECKA', cost: { pp: 10 }, temp: { welfare: 1, approval: 2 }, tip: 'Någon knackar på. Ibland är det allt som behövs.' },
      { text: 'HÅRDARE TAG MOT FRÅNVARON', temp: { statepower: 1, approval: -2 }, ind: { happiness: -0.05 }, tip: 'Ett hotbrev till en familj som redan inte vet vad den ska göra.' },
    ],
  },
  {
    id: 'sml_sk_larlingar', icon: '\u{1F527}', weight: 2, cooldown: 1000,
    title: 'LÄRLINGARNA FÅR JOBB DIREKT',
    text: 'Nio av tio elever från lärlingsprogrammen har fast jobb ett halvår efter examen. Verkstäderna i {stad} tävlar om eleverna redan i andra årskursen, och ungdomsarbetslösheten har sjunkit för andra året i rad. Rörmokare, svetsare och undersköterskor är plötsligt yrken som unga drömmer om.',
    when: (c) => c.day > 150 && c.is('education', 'dual', 'stem', 'strict') && c.trend('youthunemp') < 0,
    choices: [
      { text: 'FLER LÄRLINGSPLATSER I KOMMUNERNA', cost: { money: 400 }, perm: { factory: 1 }, ind: { youthunemp: -1 }, tip: 'Kommunen behöver också rörmokare.' },
      { text: 'SKATTEAVDRAG FÖR FÖRETAG SOM TAR LÄRLINGAR', cost: { pp: 10 }, temp: { gdp: 2, income: -2 }, ind: { youthunemp: -1 }, tip: 'Företagen tar fler lärlingar. Och några som de ändå skulle ha tagit.' },
      { text: 'GLÄDJ DIG OCH LÅT DET VÄXA AV SIG SJÄLVT', temp: { approval: 2, gdp: 1 }, tip: 'Ett gott rykte sprids snabbare än en reklamkampanj.' },
    ],
  },
  {
    id: 'sml_sk_hot', icon: '\u{1F6E1}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'LÄRAREN SOM BLEV HOTAD',
    text: 'En lärare på högstadiet i {stad} har fått polisskydd efter att ha blivit hotad av elever som hon satt betyg på. Det är tredje fallet i år. Lärarfacket säger att var femte lärare har blivit hotad någon gång, och flera skolor har börjat låsa dörrarna under lektionstid.',
    when: (c) => c.day > 60 && (c.ind.crimeidx ?? 80) > 140 && (c.ind.youthcrime ?? 300) > 500,
    choices: [
      { text: 'FLER VUXNA I SKOLAN', cost: { money: 400 }, temp: { safety: 2, welfare: 1 }, ind: { feelsafe: 1 }, tip: 'Fritidsledare, kuratorer, vaktmästare. Någon som ser vad som händer i korridoren.' },
      { text: 'SKOLPOLISER PÅ UTSATTA SKOLOR', cost: { money: 300 }, temp: { safety: 3, freedom: -1 }, ind: { feelsafe: 2 }, tip: 'Tryggare korridorer. Och en skola som känns lite som en vakt.' },
      { text: 'RÄTT FÖR SKOLAN ATT STÄNGA AV ELEVER', cost: { pp: 10 }, temp: { safety: 2, approval: 1, welfare: -1 }, tip: 'De avstängda försvinner från skolan. Inte från gatan.' },
      { text: 'DET ÄR SKOLANS SAK', temp: { approval: -3 }, ind: { feelsafe: -2 }, tip: 'Skolan säger att det är samhällets sak.' },
    ],
  },

  // ===== ÅLDRANDET =====
  {
    id: 'sml_al_matko', icon: '\u{1F96B}', kind: 'valfard', react: true, cooldown: 600,
    title: 'PENSIONÄRERNA I MATKÖN',
    text: 'Utanför kyrkans matutdelning i {stad} står det numera lika många pensionärer som studenter. Sedan beslutet om {lag} räcker pengarna inte till både hyra, mediciner och mat. En 81-årig kvinna säger i tv att hon arbetat i fyrtiotre år och aldrig trott att hon skulle stå här.',
    when: (c) => c.cut('pensions', 'welfare') && (c.ind.old ?? 10) > 10,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -24, temp: { approval: 4 }, tip: 'Pensionärer röstar. Alla vet det, ändå glöms det bort.' },
      { text: 'GARANTITILLÄGG TILL DE FATTIGASTE', cost: { money: 600 }, griev: -12, temp: { welfare: 2 }, tip: 'Den som har minst får lite mer. Resten är fortfarande arga.' },
      { text: 'STÅ FAST, SYSTEMET MÅSTE HÅLLA', griev: 10, temp: { approval: -4, income: 1 }, ind: { trustgov: -4, happiness: -0.1 }, tip: 'Systemet håller. Det gör inte förtroendet.' },
    ],
  },
  {
    id: 'sml_al_orkar', icon: '\u{1F9D3}', kind: 'valfard', react: true, cooldown: 700,
    title: 'UNDERSKÖTERSKAN SOM INTE ORKAR',
    text: 'Margareta, 61 år och undersköterska i hemtjänsten i {stad}, har blivit landets mest kända ansikte. Sedan beslutet om {lag} måste hon jobba flera år till. Hon har ont i axlarna, knäna och ryggen och undrar i ett brev till alla tidningar hur hon ska orka lyfta gamla så länge. Hundratusen har delat brevet.',
    when: (c) => c.cut('retirement_age', 'pensions') && c.day > 30 && (c.ind.old ?? 10) > 8,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -22, temp: { approval: 3 }, tip: 'Margareta tackar i ett nytt brev. Det delas också.' },
      { text: 'UNDANTAG FÖR TUNGA YRKEN', cost: { pp: 15 }, law: ['retirement_age', 'hardjobs'], griev: -12, temp: { approval: 2 }, tip: 'Vem har ett tungt yrke? Tre utredningar och en lång debatt senare vet ni.' },
      { text: 'OMSKOLNING FÖR DEN SOM INTE ORKAR', cost: { money: 400 }, griev: -5, temp: { welfare: 1 }, tip: 'Kontorsjobb för den som inte kan lyfta längre. Om det finns ett.' },
      { text: 'STÅ FAST VID BESLUTET', griev: 9, temp: { approval: -3 }, ind: { trustgov: -3, strikes: 20 }, tip: 'Vårdförbundet har läst brevet. De har ett eget.' },
    ],
  },
  {
    id: 'sml_al_boende', icon: '\u{1F475}', weight: 2, cooldown: 1000,
    title: 'NATTEN PÅ ÄLDREBOENDET',
    text: 'På äldreboendet i {stad} arbetar en undersköterska ensam på natten med fjorton boende, flera med demens. Personalen har varnat i två år. Var tredje anställd är timvikarie med en halv dags introduktion, och den som trycker på larmet får vänta en halvtimme. Anhöriga har börjat sova över.',
    when: (c) => c.day > 100 && (c.ind.old ?? 10) > 15 && c.st.welfare < 10,
    choices: [
      { text: 'BEMANNINGSGARANTI MED FAST PERSONAL', cost: { money: 900 }, perm: { welfare: 1 }, next: ['sml_al_bra', null], tip: 'Två på natten. Samma ansikten varje vecka. Det är allt de bad om.' },
      { text: 'REKRYTERA OMSORGSPERSONAL FRÅN UTLANDET', cost: { money: 200, pp: 10 }, temp: { immigration: 2, welfare: 1 }, next: ['sml_al_bra', 'sml_al_vanvard'], tip: 'Varma händer och en språkkurs. Det tar tid, men det håller.' },
      { text: 'SENSORER OCH KAMEROR I STÄLLET FÖR NATTPERSONAL', cost: { money: 200, rp: 25 }, temp: { welfare: 1, freedom: -1 }, next: ['sml_al_bra', 'sml_al_vanvard'], tip: 'En sensor larmar när någon ramlar. Den kan inte hålla någon i handen.' },
      { text: 'LÅT KOMMUNERNA LÖSA DET', temp: { approval: -2 }, next: 'sml_al_vanvard', tip: 'Kommunerna har samma budget som i fjol och fler gamla än någonsin.' },
    ],
  },
  {
    id: 'sml_al_vanvard', icon: '\u{1F3A5}', chain: true,
    title: 'DOLD KAMERA PÅ AVDELNING TRE',
    text: 'En reporter som tog jobb som timvikarie har filmat med dold kamera i tre veckor. Filmen visar boende som får vänta i timmar på hjälp till toaletten, mat som ställs fram och tas bort orörd, och personal som springer mellan larmen. Ingen är elak. Det finns bara för få händer.',
    choices: [
      { text: 'TILLSYNSMYNDIGHETEN GRANSKAR VARJE BOENDE', cost: { money: 200, pp: 15 }, perm: { corruption: -1 }, temp: { approval: 2 }, tip: 'Inspektörerna åker ut i morgon. Utan att ringa först.' },
      { text: 'AKUTA PENGAR TILL FLER ANSTÄLLDA', cost: { money: 800 }, temp: { welfare: 3, approval: 3 }, tip: 'Fler händer redan nästa månad. Frågan är vem som betalar nästa år.' },
      { text: 'FASTA HELTIDSJOBB I STÄLLET FÖR TIMVIKARIER', cost: { money: 500, pp: 10 }, perm: { welfare: 1, qol: 1 }, tip: 'Samma människor varje dag. De boende kommer ihåg deras namn.' },
      { text: 'ETT ENSKILT BOENDE MED DÅLIG LEDNING', temp: { approval: -4 }, ind: { trustgov: -4 }, next: 'sml_al_kommission', tip: 'Tre andra tidningar skickar ut egna reportrar samma kväll.' },
    ],
  },
  {
    id: 'sml_al_kommission', icon: '\u{1F4DC}', chain: true,
    title: 'ÄLDREKOMMISSIONENS DOM',
    text: 'Kommissionen som granskat äldreomsorgen lämnar sitt betänkande. Det är sexhundra sidor och slutsatsen är hård: staten visste, kommunerna visste, och ingen tog ansvar. Ordföranden säger på presskonferensen att "det här är ett politiskt misslyckande, inte personalens".',
    choices: [
      { text: 'ERKÄNN ANSVARET OCH LÄGG EN ÄLDREREFORM', cost: { money: 1000, pp: 10 }, perm: { welfare: 2 }, temp: { approval: 2 }, ind: { trustgov: 3 }, tip: 'Att säga förlåt kostar ingenting. Reformen kostar en hel del.' },
      { text: 'ÄLDREMINISTERN AVGÅR', cost: { pp: 20 }, temp: { approval: 4, stability: -2 }, tip: 'En ny minister med samma budget. Men ett nytt ansikte.' },
      { text: 'TILLBAKAVISA SLUTSATSERNA', mod: 'scandal', temp: { approval: -5 }, ind: { trustgov: -6 }, tip: 'Sexhundra sidor mot ett pressmeddelande. Gissa vem som vinner.' },
    ],
  },
  {
    id: 'sml_al_bra', icon: '\u{1F33B}', chain: true,
    title: 'BÄSTA ÄLDREOMSORGEN I EUROPA',
    text: 'En europeisk jämförelse av äldreomsorgen placerar landet i topp. Personalen på boendet i {stad} har fasta tjänster, kan namnen på alla som bor där och har tid att gå ut med dem på promenad. Anhöriga säger att de för första gången kan åka på semester utan dåligt samvete.',
    choices: [
      { text: 'SKRIV IN BEMANNINGEN I LAGEN', cost: { pp: 10 }, perm: { welfare: 2 }, tip: 'Så att nästa regering inte kan spara bort promenaderna.' },
      { text: 'TA EMOT STUDIEBESÖK FRÅN HELA VÄRLDEN', rel: 4, temp: { approval: 2 }, tip: 'Delegationerna dricker kaffe med de boende. De boende älskar det.' },
      { text: 'MER PENGAR TILL HEMTJÄNSTEN OCKSÅ', cost: { money: 400 }, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'De flesta gamla bor hemma. De förtjänar också promenader.' },
    ],
  },
  {
    id: 'sml_al_ensam', icon: '\u{2615}', weight: 2, cooldown: 900,
    title: 'ENSAMHETEN BLAND DE GAMLA',
    text: 'Var femte person över åttio säger att de inte pratat med någon på en hel vecka. I {stad} har brevbärarna börjat knacka på hos ensamma äldre, och en pensionär har satt upp en lapp i trappuppgången: "Jag bjuder på kaffe, vem som helst får komma." Fyrtio grannar kom.',
    when: (c) => c.day > 60 && (c.ind.oldest ?? 2) > 4 && (c.ind.hhsize ?? 3) < 2.5,
    choices: [
      { text: 'TRÄFFPUNKTER I VARJE STADSDEL', cost: { money: 300 }, perm: { qol: 1 }, ind: { happiness: 0.1 }, tip: 'Kaffe, bingo och någon som frågar hur man mår.' },
      { text: 'STUDENTER BOR BILLIGT PÅ ÄLDREBOENDEN', cost: { money: 150 }, temp: { qol: 2, approval: 2 }, tip: 'Billig hyra mot tre middagar i veckan med grannarna. Alla vinner.' },
      { text: 'RING ALLA ÖVER 85 EN GÅNG I MÅNADEN', cost: { pp: 5 }, temp: { welfare: 1, approval: 2 }, tip: 'Ett telefonsamtal i månaden. För vissa är det månadens höjdpunkt.' },
      { text: 'SÅNT SKÖTER FAMILJERNA', temp: { approval: -2 }, ind: { happiness: -0.05 }, tip: 'Familjerna bor i en annan stad. Telefonen ringer på söndagar.' },
    ],
  },
  {
    id: 'sml_al_pensionsnota', icon: '\u{1F9FE}', weight: 2, cooldown: 1000,
    title: 'PENSIONSNOTAN SPRÄNGER BUDGETEN',
    text: 'Pensionerna kostar nu mer än skolan, polisen och försvaret tillsammans. Finansdepartementet har räknat: om ingenting görs går var tredje skattekrona till pensioner om femton år. Pensionärsorganisationerna har redan bokat stora torget, ifall någon skulle komma på idéer.',
    when: (c) => c.day > 100 && (c.ind.pensionx ?? 5) > 8.5 && c.debt > 60,
    choices: [
      { text: 'HÖJ PENSIONSÅLDERN STEGVIS', cost: { pp: 20 }, law: ['retirement_age', 'age67'], temp: { approval: -3 }, perm: { income: 2 }, tip: 'Ett år i taget, så att ingen märker det. Alla märker det.' },
      { text: 'LÅT PENSIONERNA FÖLJA EKONOMIN', cost: { pp: 15 }, law: ['pensions', 'notional'], temp: { approval: -2 }, perm: { income: 1 }, tip: 'Går det bra för landet går det bra för pensionärerna. Och tvärtom.' },
      { text: 'HÖJ SKATTEN FÖR ATT BETALA', temp: { approval: -4, gdp: -1 }, perm: { income: 2 }, tip: 'De som jobbar betalar för dem som har jobbat. Så har det alltid varit.' },
      { text: 'LÅNA OCH LÅT NÄSTA GENERATION BETALA', temp: { approval: 2 }, perm: { income: -1 }, tip: 'Nästa generation röstar inte än. Det gör de om tio år.' },
    ],
  },
  {
    id: 'sml_al_forsorj', icon: '\u{1F465}', weight: 2, cooldown: 1000,
    title: 'FÄRRE SKA FÖRSÖRJA FLER',
    text: 'Den nya befolkningsprognosen visar att det om tjugo år går en pensionär på varannan person i arbetsför ålder. Redan nu saknas undersköterskor, busschaufförer och lärare i nästan varje kommun. Ekonomerna är överens om problemet, men inte om lösningen.',
    when: (c) => c.day > 60 && (c.ind.olddep ?? 15) > 30 && (c.ind.fert ?? 2) < 1.6,
    choices: [
      { text: 'ARBETSKRAFTSINVANDRING TILL BRISTYRKEN', cost: { pp: 15 }, temp: { immigration: 3, gdp: 2, integration: -1 }, tip: 'Folk som vill jobba, i yrken som saknar folk. Bostäderna är en annan fråga.' },
      { text: 'SATSA PÅ AUTOMATION OCH ROBOTAR', cost: { money: 600, rp: 20 }, perm: { factory: 1 }, temp: { research: 1 }, tip: 'Robotar betalar ingen skatt. Än.' },
      { text: 'FAMILJEPOLITIK FÖR FLER BARN', cost: { money: 500 }, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'Barnen som föds i år börjar jobba om tjugo år. Tålamod.' },
      { text: 'ALLA FÅR JOBBA LITE LÄNGRE', temp: { approval: -3, income: 2 }, tip: 'Det enkla svaret. Ingen gillar det.' },
    ],
  },
  {
    id: 'sml_al_hemtjanst', icon: '\u{1F49B}', kind: 'valfard', react: true, cooldown: 800,
    title: 'MER TID HOS FRU LUNDQVIST',
    text: 'Sedan beslutet om {lag} har hemtjänsten i {stad} fått fler timmar. Fru Lundqvist, 92 år, får besök fyra gånger om dagen i stället för två, och personalen hinner dricka en kopp kaffe med henne. Hennes son säger att hon har börjat skratta igen. Pensionärsförbundet skickar ett tackbrev.',
    when: (c) => c.raised('pensions', 'welfare', 'healthcare') && (c.ind.old ?? 10) > 12,
    choices: [
      { text: 'GÖR TIDEN TILL EN RÄTTIGHET', cost: { pp: 10 }, griev: -8, perm: { welfare: 1 }, tip: 'Kaffet hos fru Lundqvist står nu i lagen.' },
      { text: 'FLER UNDERSKÖTERSKOR PÅ UTBILDNING', cost: { money: 400 }, griev: -5, perm: { qol: 1 }, tip: 'Fler timmar kräver fler händer. Det glömmer man ofta.' },
      { text: 'NÖJ DIG MED TACKBREVET', griev: -3, temp: { approval: 2 }, tip: 'Det hänger på kylskåpet i departementet.' },
    ],
  },

  // ===== BROTTSVÅGEN =====
  {
    id: 'sml_br_skott', icon: '\u{1F6A8}', weight: 2, cooldown: 900,
    title: 'SKOTTLOSSNINGEN I {STAD}',
    text: 'Sent i går kväll avlossades flera skott utanför en pizzeria i {stad}. En 19-åring skadades i benet och fördes till sjukhus. Polisen tror att det handlar om en konflikt mellan två gäng om narkotikaförsäljningen i området. Det är den fjärde skottlossningen i stan på två månader, och föräldrar vågar inte låta barnen gå till träningen.',
    when: (c) => c.day > 60 && (c.ind.gangs ?? 50) > 120 && (c.ind.crimeidx ?? 80) > 110 && (c.ind.gdppc ?? 0) > 6000,
    choices: [
      { text: 'SÄRSKILD INSATSSTYRKA TILL STADEN', cost: { money: 500 }, temp: { safety: 4 }, ind: { feelsafe: 2 }, next: ['sml_br_hamnd', 'sml_br_lugn'], tip: 'Fler poliser på gatan i morgon. Gängen flyttar ett kvarter bort.' },
      { text: 'SOCIALTJÄNST, FRITIDSGÅRDAR OCH AVHOPPARPROGRAM', cost: { money: 600 }, perm: { safety: 1 }, next: ['sml_br_lugn', 'sml_br_hamnd', null], tip: 'Långsamt. Men varje pojke som hoppar av är en som inte skjuter.' },
      { text: 'VISITATIONSZONER OCH KAMEROR', cost: { pp: 10 }, temp: { safety: 3, freedom: -3 }, ind: { feelsafe: 1, policetrust: -1 }, next: ['sml_br_hamnd', 'sml_br_lugn'], tip: 'Alla i området blir misstänkta. Även de som bara ska handla mjölk.' },
      { text: 'POLISEN HAR DET UNDER KONTROLL', temp: { approval: -3 }, ind: { feelsafe: -3 }, next: 'sml_br_hamnd', tip: 'Polisen säger själv att de inte har det.' },
    ],
  },
  {
    id: 'sml_br_hamnd', icon: '\u{1F4A5}', chain: true,
    title: 'SPRÄNGNINGEN I TRAPPHUSET',
    text: 'Mitt i natten exploderade en sprängladdning vid en lägenhetsdörr i {stad}. Ingen skadades allvarligt, men trettio familjer fick evakueras i pyjamas och fönster krossades i hela kvarteret. Polisen säger att det var en hämnd för skottlossningen. Fel dörr, säger grannarna: där bodde en pensionär.',
    choices: [
      { text: 'HÅRDARE STRAFF FÖR SPRÄNGBROTT', cost: { pp: 15 }, law: ['punishments', 'harsh'], temp: { safety: 2, approval: 2 }, tip: 'Längre straff för dem som åker fast. De flesta gör inte det.' },
      { text: 'MILITÄREN STÖTTAR POLISEN', cost: { man: 5 }, temp: { safety: 4, freedom: -4 }, ind: { feelsafe: 3, policetrust: -2 }, next: ['sml_br_omrade', null], tip: 'Soldater utanför tunnelbanan. Lugnt, men inte normalt.' },
      { text: 'DUBBLA POLISENS UTREDARE', cost: { money: 700 }, temp: { safety: 3 }, perm: { safety: 1 }, ind: { policetrust: 2 }, tip: 'Den som klarar upp brotten behöver inte vakta gatorna lika mycket.' },
      { text: 'ÖKA POLISENS BUDGET NÄSTA ÅR', temp: { approval: -3 }, ind: { feelsafe: -4, homicide: 10 }, next: 'sml_br_omrade', tip: 'Nästa år är långt borta för den som bor i trapphuset.' },
    ],
  },
  {
    id: 'sml_br_omrade', icon: '\u{1F4EE}', chain: true,
    title: 'OMRÅDET DÄR POSTEN SLUTAT KOMMA',
    text: 'I bostadsområdet i {stad} har posten slutat dela ut paket, taxibolagen kör inte dit efter mörkrets inbrott och vårdcentralen har stängt. De flesta som bor där har aldrig haft med gängen att göra, men nu bor de mitt i deras revir. Den som har råd flyttar därifrån.',
    choices: [
      { text: 'STOR SATSNING PÅ HELA OMRÅDET', cost: { money: 1000 }, perm: { safety: 2, qol: 1 }, ind: { segreg: -2, feelsafe: 3 }, tip: 'Skola, vårdcentral, polis och jobb. Allt på en gång, i tio år.' },
      { text: 'EN POLISSTATION MITT I OMRÅDET', cost: { money: 400 }, temp: { safety: 3 }, ind: { feelsafe: 2, policetrust: 2 }, tip: 'Poliser som handlar i samma affär som de boende.' },
      { text: 'RIV DE VÄRSTA HUSEN OCH BYGG NYTT', cost: { money: 800 }, temp: { approval: -2 }, ind: { segreg: -3, homeless: 4 }, tip: 'Nya hus, blandade upplåtelseformer. De gamla hyresgästerna får flytta.' },
      { text: 'DE SOM VILL FÅR FLYTTA', temp: { approval: -4 }, ind: { segreg: 3, feelsafe: -3 }, tip: 'De som kan flyttar. De som blir kvar har ännu mindre.' },
    ],
  },
  {
    id: 'sml_br_lugn', icon: '\u{26BD}', chain: true,
    title: 'ETT HELT ÅR UTAN SKOTTLOSSNING',
    text: 'Det har gått ett år sedan den senaste skottlossningen i {stad}. Avhopparprogrammet har hjälpt fyrtio unga män ut ur gängen, fritidsgården har öppet till midnatt och poliserna känner barnen i området vid namn. Bilarna står kvar på parkeringen över natten, och fotbollsplanen är full igen.',
    choices: [
      { text: 'GÖR MODELLEN NATIONELL', cost: { money: 600 }, perm: { safety: 2 }, ind: { feelsafe: 3 }, tip: 'Det som tog ett år i en stad tar tio i ett land.' },
      { text: 'FIRA MED EN FOTBOLLSTURNERING', temp: { approval: 3 }, ind: { feelsafe: 2 }, tip: 'Polisen ställer upp med ett eget lag. De förlorar mot tolvåringarna.' },
      { text: 'FLYTTA RESURSERNA TILL NÄSTA STAD', cost: { pp: 10 }, temp: { safety: 2, approval: 1 }, tip: 'Det fungerade för att det fick tid. Tiden flyttar inte med.' },
    ],
  },
  {
    id: 'sml_br_hardatag', icon: '\u{1F46E}', kind: 'frihet', react: true, cooldown: 800,
    title: 'DE HÅRDA TAGEN: FÖRSTA ÅRET',
    text: 'Ett år efter de hårdare tagen är fängelserna fulla och domstolarna har köer på åtta månader. Brottsligheten på gatorna har minskat något, men kriminologerna varnar för att unga som sitter inne lär sig mer av andra kriminella än av vårdarna. Poliserna klagar på att pappersarbetet tar mer tid än gatan.',
    when: (c) => c.changed('policing', 'punishments') && (c.is('policing', 'tough', 'militarized', 'predictive') || c.is('punishments', 'harsh', 'threestrikes', 'veryharsh', 'penallabor')),
    choices: [
      { text: 'BYGG FLER FÄNGELSER', cost: { money: 1000 }, temp: { safety: 3 }, perm: { safety: 1 }, tip: 'Det går fortare att döma än att bygga.' },
      { text: 'SATSA PÅ ATT DE INTE ÅTERFALLER', cost: { money: 500 }, law: ['rehabilitation', 'high'], perm: { safety: 1 }, temp: { approval: -1 }, tip: 'Utbildning bakom murarna. Kvällstidningarna kallar det lyxfängelse.' },
      { text: 'FORTSÄTT, DET FUNGERAR', temp: { safety: 2, freedom: -2 }, ind: { feelsafe: 2, policetrust: -2 }, tip: 'Det fungerar mot det som syns. Resten får vänta.' },
      { text: 'MILDRA STRAFFEN IGEN', cost: { pp: 15 }, law: ['punishments', 'balanced'], griev: -8, temp: { approval: -2, freedom: 2 }, tip: 'Tillbaka till mitten. Båda sidor är missnöjda, vilket kanske betyder att det är rätt.' },
    ],
  },
  {
    id: 'sml_br_straffrihet', icon: '\u{2696}\u{FE0F}', kind: 'frihet', react: true, cooldown: 800,
    title: 'DOMEN SOM FICK LANDET ATT KOKA',
    text: 'En man som slog ner en busschaufför i {stad} har dömts till samhällstjänst och medling. Med de nya, mildare reglerna är det helt i sin ordning, säger domstolen. Busschaufförerna i hela landet ställer in turerna i en timme i protest, och kvällstidningarna kallar det "straffrihetens land".',
    when: (c) => c.changed('punishments', 'policing') && (c.is('punishments', 'abolition', 'minimal', 'restorative', 'low') || c.is('policing', 'abolished', 'unarmed', 'community')),
    choices: [
      { text: 'FÖRKLARA FORSKNINGEN BAKOM REFORMEN', cost: { pp: 10 },
        risk: { chance: 0.5,
          win: { text: 'Siffrorna visar färre återfall. Debatten svänger, långsamt.', temp: { approval: 3, safety: 1 } },
          lose: { text: 'Ingen lyssnar på statistik när det finns en film på en busschaufför.', temp: { approval: -4 }, ind: { trustgov: -3 } } } },
      { text: 'SKÄRP STRAFFEN FÖR VÅLD MOT YRKESFOLK', cost: { pp: 15 }, temp: { approval: 3, safety: 1, freedom: -1 }, tip: 'Ett undantag i reformen. Nästa grupp står redan i kö för ett eget.' },
      { text: 'BACKA HELA REFORMEN', law: ['punishments', 'balanced'], temp: { approval: 2, freedom: -1 }, ind: { policetrust: 2 }, tip: 'Reformens anhängare kallar det panik. Busschaufförerna kallar det rimligt.' },
    ],
  },
  {
    id: 'sml_br_otrygg', icon: '\u{1F319}', weight: 2, cooldown: 900,
    title: 'RÄDSLAN ÄR STÖRRE ÄN BROTTEN',
    text: 'Brottsligheten har inte ökat, men otryggheten växer: var tredje kvinna i {huvudstad} säger att hon inte vågar gå ut ensam på kvällen. Forskarna pekar på mörka gångtunnlar, sociala medier och nyheter som visar samma rån tio gånger. Ett gatlyktsföretag har aldrig sålt så bra.',
    when: (c) => c.day > 60 && c.trend('feelsafe') < -2 && (c.ind.homicide ?? 3) < 4 && c.trend('crimeidx') <= 0,
    choices: [
      { text: 'BELYS GÅNGTUNNLAR OCH PARKER', cost: { money: 300 }, temp: { safety: 1, qol: 1 }, ind: { feelsafe: 3 }, tip: 'Ljus är billigare än poliser och fungerar dygnet runt. Nästan.' },
      { text: 'FLER POLISER SOM SYNS PÅ GATAN', cost: { money: 400 }, temp: { safety: 2 }, ind: { feelsafe: 4, policetrust: 1 }, tip: 'En polis som säger hej gör mer än tio som sitter i en bil.' },
      { text: 'NATTVANDRARE MED STATSBIDRAG', cost: { money: 100 }, temp: { approval: 2 }, ind: { feelsafe: 2 }, tip: 'Föräldrar i gula jackor och termosar med kaffe.' },
      { text: 'STATISTIKEN SÄGER ATT DET ÄR TRYGGT', temp: { approval: -3 }, ind: { feelsafe: -1, trustgov: -2 }, tip: 'Rädsla lyssnar inte på statistik.' },
    ],
  },
  {
    id: 'sml_br_mutor', icon: '\u{1F4B5}', weight: 2, cooldown: 900,
    title: 'POLISEN SOM TAR BETALT',
    text: 'En mobilfilm visar hur två trafikpoliser i {stad} tar emot sedlar från en lastbilschaufför i stället för att skriva böter. Filmen har setts av miljoner. Folk berättar om liknande händelser i kommentarerna, och i en ny mätning säger bara var femte invånare att de litar på polisen.',
    when: (c) => c.day > 60 && (c.ind.policetrust ?? 40) < 20 && c.st.corruption > 10,
    choices: [
      { text: 'EN OBEROENDE ENHET SOM GRANSKAR POLISEN', cost: { pp: 20 }, perm: { corruption: -2 }, temp: { approval: 2 }, ind: { policetrust: 4 }, tip: 'Poliser som utreder poliser. Från ett annat hus, med en annan chef.' },
      { text: 'HÖJ POLISLÖNERNA', cost: { money: 600 }, perm: { corruption: -1 }, ind: { policetrust: 2 }, tip: 'Den som kan leva på lönen behöver inga sedlar i fickan.' },
      { text: 'KROPPSKAMEROR PÅ ALLA POLISER', cost: { money: 300 }, temp: { freedom: -1 }, ind: { policetrust: 3 }, tip: 'Kameran ser både polisen och chauffören. Båda beter sig bättre.' },
      { text: 'TVÅ RÖTTA ÄGG I EN STOR KORG', temp: { approval: -3 }, ind: { policetrust: -4 }, tip: 'Kommentarsfälten har tusen ägg till.' },
    ],
  },
  {
    id: 'sml_br_tryggt', icon: '\u{1F6B2}', weight: 2, cooldown: 1000,
    title: 'DET TRYGGASTE ÅRET HITTILLS',
    text: 'Den nationella trygghetsundersökningen visar att fler än någonsin känner sig trygga i sitt bostadsområde. Anmälda inbrott, rån och misshandel har minskat för tredje året i rad. I {stad} har kvarterspolisen börjat bjuda på kaffe på torget varje fredag, och det har blivit stadens populäraste mötesplats.',
    when: (c) => c.day > 120 && (c.ind.feelsafe ?? 70) > 80 && c.trend('crimeidx') < 0,
    choices: [
      { text: 'BEHÅLL KVARTERSPOLISERNA', cost: { money: 300 }, perm: { safety: 1 }, ind: { policetrust: 2 }, tip: 'Det tryggaste är inte en ny polisbil, utan samma polis som förra veckan.' },
      { text: 'FLYTTA PENGAR FRÅN POLISEN TILL SKOLAN', cost: { pp: 10 }, perm: { hdi: 1 }, temp: { safety: -1 }, tip: 'Förebygga i stället för att släcka. Polisfacket protesterar.' },
      { text: 'TA EMOT GRATULATIONERNA', temp: { approval: 3, stability: 1 }, tip: 'Fikabröd till hela kvarterspolisen.' },
    ],
  },
  {
    id: 'sml_br_tolvaringar', icon: '\u{1F4E6}', weight: 2, cooldown: 900,
    title: 'GÄNGEN REKRYTERAR TOLVÅRINGAR',
    text: 'Polisen i {stad} varnar för att gängen värvar barn i mellanstadiet via sociala medier. Ett uppdrag att bära ett paket betalar mer än en månads sommarjobb, och barn under femton år kan inte dömas till fängelse. Föräldrar berättar om söner som plötsligt har nya skor och inte vill säga varifrån.',
    when: (c) => c.day > 60 && (c.ind.youthunemp ?? 10) > 18 && (c.ind.gangs ?? 50) > 80,
    choices: [
      { text: 'SOMMARJOBB OCH FRITIDSGÅRDAR FÖR ALLA UNGA', cost: { money: 500 }, temp: { safety: 2 }, ind: { youthunemp: -1, feelsafe: 1 }, tip: 'En lön och någonstans att vara. Gängen har svårt att slå det.' },
      { text: 'SÄNK STRAFFBARHETSÅLDERN', cost: { pp: 15 }, law: ['juvenile_justice', 'age12'], temp: { safety: 1, freedom: -2, approval: 1 }, tip: 'Gängen börjar värva tioåringar i stället.' },
      { text: 'SOCIALTJÄNSTEN KNACKAR PÅ HOS VARJE FAMILJ', cost: { money: 300, pp: 5 }, perm: { safety: 1 }, temp: { freedom: -1 }, tip: 'En socialsekreterare vid köksbordet i tid är värd tio poliser för sent.' },
      { text: 'FÖRÄLDRARNA MÅSTE TA ANSVAR', temp: { approval: -2 }, ind: { feelsafe: -2 }, tip: 'Föräldrarna jobbar kväll. Gängen gör det också.' },
    ],
  },
  {
    id: 'sml_br_fangelser', icon: '\u{1F512}', weight: 2, cooldown: 900,
    title: 'FÄNGELSERNA ÄR ÖVERFULLA',
    text: 'Landets fängelser har fyrtio procent fler intagna än platser. Två fångar delar celler som byggts för en, och vårdarna arbetar dubbla pass. Kriminalvården varnar för att våldet ökar, att droger smugglas in och att ingen hinner med programmen som ska få de intagna att sluta begå brott.',
    when: (c) => c.day > 60 && (c.ind.prisonocc ?? 100) > 140 && c.st.safety < 30 && (c.ind.gdppc ?? 0) > 3000,
    choices: [
      { text: 'BYGG TRE NYA ANSTALTER', cost: { money: 1000 }, temp: { safety: 2 }, perm: { safety: 1 }, tip: 'Klara om fem år. Fulla om sex.' },
      { text: 'FOTBOJA FÖR KORTA STRAFF', cost: { pp: 15 }, law: ['punishments', 'tagging'], temp: { safety: -1, income: 1 }, tip: 'Snattaren sover hemma med en dosa runt ankeln. Platsen går till en rånare.' },
      { text: 'HYR FÄNGELSEPLATSER UTOMLANDS', cost: { money: 400 }, rel: 1, temp: { freedom: -1, approval: -1 }, tip: 'Ett fängelse i grannlandet, med egna vårdare och grannlandets väder.' },
      { text: 'DUBBELBELÄGG SOM VANLIGT', temp: { safety: -2, approval: -1 }, ind: { crimeidx: 3 }, tip: 'Två i varje cell, och ännu fler som lär sig av varandra.' },
    ],
  },
  {
    id: 'sml_br_inbrott', icon: '\u{1F3E1}', weight: 2, cooldown: 900,
    title: 'INBROTTSVÅGEN I VILLAOMRÅDENA',
    text: 'Under sommarsemestern har det varit inbrott i nästan vart tionde hus i villaområdena runt {stad}. Ligorna kommer i hyrbilar, tar smycken och elektronik och är borta på tio minuter. Grannar har startat egna patruller, och larmföretagen har tre månaders väntetid.',
    when: (c) => c.day > 60 && (c.ind.burglary ?? 60) > 108 && (c.ind.gdppc ?? 0) > 15000,
    choices: [
      { text: 'GRANNSAMVERKAN MED POLISEN', cost: { money: 100 }, temp: { safety: 2 }, ind: { feelsafe: 2, policetrust: 1 }, tip: 'Grannen som tömmer brevlådan är det bästa larmet.' },
      { text: 'KONTROLLER VID GRÄNSER OCH HAMNAR', cost: { money: 300 }, temp: { safety: 2, freedom: -1 }, rel: -2, tip: 'Ligorna åker en annan väg. Lastbilarna står i kö.' },
      { text: 'AVDRAG FÖR LARM OCH SÄKERHETSDÖRRAR', cost: { money: 300 }, temp: { approval: 2 }, ind: { crimeidx: -2 }, tip: 'Den som har råd med larm skyddas. Tjuvarna går till huset bredvid.' },
      { text: 'STÄNG FÖNSTREN NÄR NI ÅKER BORT', temp: { approval: -3 }, ind: { feelsafe: -2 }, tip: 'Det hade de gjort.' },
    ],
  },

  // ===== LEVNADSKOSTNADER =====
  {
    id: 'sml_lk_elchock', icon: '\u{26A1}', weight: 2, cooldown: 900,
    title: 'ELRÄKNINGEN SOM KOM I JANUARI',
    text: 'Januarifakturan har landat i brevlådorna, och för många villaägare är elräkningen tre gånger så hög som i fjol. En pensionär i {stad} har fått en räkning på mer än hela hennes pension. Elbolagen pekar på kalla vintrar och dyra bränslen i omvärlden. Kunderna pekar på elbolagens vinster.',
    when: (c) => c.day > 60 && ((c.ind.elprice ?? 0.1) > 0.2 || ((c.ind.elprice ?? 0.1) > 0.12 && c.trend('elprice') > 0.006)),
    choices: [
      { text: 'ELSTÖD TILL ALLA HUSHÅLL', cost: { money: 800 }, temp: { approval: 4 }, ind: { trustgov: 2 }, next: ['sml_lk_elstod', null], tip: 'Snabbt och enkelt. Kanske för enkelt.' },
      { text: 'TAK FÖR ELPRISET', cost: { pp: 15 }, law: ['price_controls', 'energycap'], temp: { approval: 5 }, next: ['sml_lk_eltak', null], tip: 'Priset är fast. Elen är det inte.' },
      { text: 'SPARKAMPANJ: SÄNK INOMHUSTEMPERATUREN', cost: { money: 100 }, temp: { approval: -2 }, next: ['sml_lk_kyla', null], tip: 'Tjocktröjan som nationell symbol. Den kliar.' },
      { text: 'PRISERNA STYRS AV MARKNADEN', temp: { approval: -5 }, ind: { happiness: -0.1 }, next: 'sml_lk_kyla', tip: 'Marknaden fryser inte. Det gör pensionärerna.' },
    ],
  },
  {
    id: 'sml_lk_kyla', icon: '\u{1F9E3}', chain: true,
    title: 'PENSIONÄRERNA SOM INTE VÅGAR VÄRMA',
    text: 'Hemtjänsten i {stad} har slagit larm: allt fler äldre sitter med ytterkläder inne och har stängt av elementen för att klara räkningen. En 87-årig man fördes till sjukhuset med lunginflammation. Socialtjänsten har fått rekordmånga ansökningar om hjälp med elräkningen.',
    choices: [
      { text: 'AKUT VÄRMESTÖD TILL ÄLDRE', cost: { money: 300 }, temp: { welfare: 2, approval: 3 }, tip: 'Pengarna går direkt till dem som fryser. Det borde ha varit första valet.' },
      { text: 'ENERGIRÅDGIVARE SOM TÄTAR FÖNSTER', cost: { money: 200 }, perm: { qol: 1 }, temp: { approval: 1 }, tip: 'Tätningslist och nya lampor. Räkningen sjunker i tjugo år.' },
      { text: 'KOMMUNERNA HAR FÖRSÖRJNINGSSTÖD', temp: { approval: -4 }, ind: { life: -0.1, trustgov: -3 }, tip: 'Tolv sidor blankett för en pensionär som inte har dator.' },
    ],
  },
  {
    id: 'sml_lk_elstod', icon: '\u{1F3CA}', chain: true,
    title: 'ELSTÖDET GICK TILL FEL HUSHÅLL',
    text: 'En granskning visar att elstödet mest gick till stora villor med pool och elbil, medan studenter och pensionärer i små lägenheter fick några hundralappar. En familj i {stad} fick så mycket att de köpte en ny bastu. Ekonomerna påpekar att stödet höll uppe efterfrågan och därmed priset.',
    choices: [
      { text: 'RIKTA NÄSTA STÖD EFTER INKOMST', cost: { pp: 10 }, temp: { approval: 2, welfare: 1 }, tip: 'Mer rättvist. Mer byråkrati. Så brukar det vara.' },
      { text: 'KRÄV TILLBAKA PENGAR FRÅN DE RIKASTE', cost: { pp: 15 },
        risk: { chance: 0.5,
          win: { text: 'Pengarna kommer tillbaka och folket gillar det.', res: { money: 300 }, temp: { approval: 3 } },
          lose: { text: 'Juristerna säger nej. Det blir ett år av rättegångar.', temp: { approval: -3, stability: -1 } } } },
      { text: 'ALLA BETALAR SKATT, ALLA FÅR STÖD', temp: { approval: -2 }, ind: { trustgov: -2 }, tip: 'Rättvist på ett sätt. Bastun är varm.' },
    ],
  },
  {
    id: 'sml_lk_eltak', icon: '\u{1F50C}', chain: true,
    title: 'PRISTAKET OCH DE TOMMA KRAFTVERKEN',
    text: 'Med pristaket lönar det sig inte längre att köra de dyra reservkraftverken, och elbolagen säljer strömmen till {granne} där priset är högre. Stamnätet varnar för roterande strömavbrott om det blir riktigt kallt. Industrin i {stad} har redan fått ett brev om att dra ner på förbrukningen.',
    choices: [
      { text: 'STATEN BETALAR MELLANSKILLNADEN', cost: { money: 900 }, temp: { stability: 2, approval: 1 }, tip: 'Lampan lyser. Statskassan blinkar.' },
      { text: 'EXPORTFÖRBUD FÖR EL UNDER VINTERN', cost: { pp: 15 }, rel: -4, temp: { stability: 2, factory: -1 }, tip: 'Grannlandet minns det här nästa gång ni behöver deras ström.' },
      { text: 'TA BORT TAKET IGEN', law: ['price_controls', 'utilities'], temp: { approval: -4, stability: 1 }, tip: 'Priset hoppar upp igen. Ljuset stannar kvar.' },
      { text: 'ROTERANDE STRÖMAVBROTT OM DET BEHÖVS', temp: { factory: -3, approval: -4 }, ind: { happiness: -0.1 }, tip: 'Två timmar utan el varannan kväll. Stearinljusen tar slut i affärerna.' },
    ],
  },
  {
    id: 'sml_lk_mat', icon: '\u{1F6D2}', weight: 2, cooldown: 800,
    title: 'MATPRISERNA HAR STICKIT IVÄG',
    text: 'En vanlig matkasse kostar en femtedel mer än för ett år sedan. Föräldrar i {stad} berättar att de köper mindre frukt och mer pasta, och matbankerna har aldrig haft så många besökare. Samtidigt redovisar de tre stora livsmedelskedjorna rekordvinster, och bönderna säger att de inte sett röken av pengarna.',
    when: (c) => c.day > 60 && ((c.ind.foodprice ?? 100) > 112 || c.trend('foodprice') > 5) && (c.ind.infl ?? 2) > 3,
    choices: [
      { text: 'SÄNK MATMOMSEN TILLFÄLLIGT', cost: { money: 600 }, temp: { approval: 4, income: -2 }, ind: { infl: -0.5 }, tip: 'Priset sjunker en vecka. Sedan undrar man vart sänkningen tog vägen.' },
      { text: 'GRANSKA KEDJORNAS MARGINALER', cost: { pp: 15 }, law: ['antitrust', 'strict'], temp: { approval: 3, gdp: -1 }, tip: 'Tre kedjor som äger hela marknaden. Det borde någon ha sett tidigare.' },
      { text: 'PRISSTOPP PÅ BASVAROR', cost: { pp: 10 }, law: ['price_controls', 'freeze'], temp: { approval: 5, factory: -2 }, ind: { infl: -1 }, tip: 'Mjölken är billig. Om det finns någon i hyllan.' },
      { text: 'KÖP SÄSONGENS GRÖNSAKER', temp: { approval: -4 }, ind: { happiness: -0.1 }, tip: 'Rådet blir årets mest citerade. Inte på ett bra sätt.' },
    ],
  },
  {
    id: 'sml_lk_bensin', icon: '\u{26FD}', weight: 2, cooldown: 900,
    title: 'BENSINUPPRORET PÅ LANDSBYGDEN',
    text: 'Bensinpriset har passerat smärtgränsen, och på landsbygden finns inga bussar att byta till. I {stad} har bilister blockerat rondellerna i protest, iförda gula reflexvästar. Hemtjänstpersonal, hantverkare och pendlare säger att de inte längre har råd att köra till jobbet.',
    when: (c) => c.day > 60 && ((c.ind.fuelprice ?? 0.9) > 1.5 || c.is('energy', 'carbontax', 'rationing')) && (c.ind.ruralpop ?? 0) / Math.max(1, c.ind.pop ?? 1) > 0.15,
    choices: [
      { text: 'SÄNK SKATTEN PÅ DRIVMEDEL', cost: { money: 500 }, temp: { approval: 4, income: -2 }, tip: 'Rondellerna töms. Klimatmålen flyttar ett år fram.' },
      { text: 'HÖJT RESEAVDRAG FÖR DEM SOM MÅSTE KÖRA', cost: { money: 300 }, temp: { approval: 3 }, tip: 'Den som bor långt bort får tillbaka en del. Den som bor nära undrar varför.' },
      { text: 'FLER BUSSLINJER PÅ LANDSBYGDEN', cost: { money: 700 }, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'En buss i timmen är bättre än ingen. Den kommer om ett år.' },
      { text: 'STÅ FAST, KLIMATET KRÄVER DET', temp: { approval: -4, unrest: 4 }, ind: { protests: 25 }, tip: 'Rätt i sak. Västarna är kvar i rondellen.' },
    ],
  },
  {
    id: 'sml_lk_manad', icon: '\u{1F45B}', weight: 2, cooldown: 800,
    title: 'LÖNEN RÄCKER INTE MÅNADEN UT',
    text: 'Med inflationen på den här nivån tappar lönen värde i en takt som ingen under fyrtio har varit med om. Hyran, maten och bussbiljetten har blivit dyrare, men lönerna har inte hängt med. Facken kräver kompensation och arbetsgivarna varnar för en spiral där löner och priser jagar varandra.',
    when: (c) => c.day > 60 && (c.ind.infl ?? 2) > 7 && (c.ind.gdppc ?? 0) > 2000,
    choices: [
      { text: 'LÅT CENTRALBANKEN HÖJA RÄNTAN KRAFTIGT', cost: { pp: 10 }, law: ['monetary', 'tight'], temp: { gdp: -2, approval: -2 }, ind: { infl: -2, unemp: 0.5 }, tip: 'Den bittraste medicinen. Den verkar, efter ett år.' },
      { text: 'RIKTADE STÖD TILL LÅGINKOMSTTAGARE', cost: { money: 600 }, temp: { welfare: 2, approval: 3 }, ind: { infl: 0.3 }, tip: 'Den som har minst får hjälp. Priserna tackar för extra köpkraft.' },
      { text: 'SAMLA PARTERNA TILL ETT LÖNEAVTAL', cost: { pp: 15 }, temp: { stability: 2 }, ind: { infl: -1, strikes: -20 }, tip: 'Lagom löneökningar för alla. Ingen är nöjd, därför fungerar det.' },
      { text: 'PRISERNA KOMMER ATT VÄNDA', temp: { approval: -4 }, ind: { trustgov: -3, strikes: 20 }, tip: 'Det gör de. Om två år. Facken väntar inte så länge.' },
    ],
  },
  {
    id: 'sml_lk_stadarna', icon: '\u{1F9F9}', kind: 'valfard', react: true, cooldown: 700,
    title: 'STÄDARNA PÅ HOTELLET',
    text: 'Sedan beslutet om {lag} har städarna på de stora hotellen i {huvudstad} fått lägre timlön. Många har redan två jobb och berättar att de nu tar ett tredje på helgerna. Hotellägarna säger att fler kommer att anställas. Städarna säger att de inte längre har tid att träffa sina barn.',
    when: (c) => c.cut('minimum_wage') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -18, temp: { approval: 2 }, tip: 'Städarna får tillbaka sin lön. Hotellen sin gamla vinst.' },
      { text: 'SKATTELÄTTNAD PÅ LÅGA LÖNER', cost: { money: 400 }, griev: -8, temp: { income: -1 }, tip: 'Staten betalar mellanskillnaden. Hotellen tackar.' },
      { text: 'FLER JOBB ÄR BÄTTRE ÄN HÖGA LÖNER', griev: 7, temp: { gdp: 1, approval: -3 }, ind: { unemp: -0.2, happiness: -0.1 }, tip: 'Fler jobb, det stämmer. Fler jobb per person, också.' },
    ],
  },
  {
    id: 'sml_lk_pizzeria', icon: '\u{1F355}', kind: 'valfard', react: true, cooldown: 800,
    title: 'LÖNELYFTET OCH PIZZERIAN PÅ HÖRNET',
    text: 'Sedan beslutet om {lag} har tusentals låglönearbetare fått mer i plånboken, och butikerna i {stad} säljer mer. Men ägaren till pizzerian på hörnet har räknat och säger att hon antingen måste höja priset på pizzan eller säga upp en av sina tre anställda. Ekonomerna bråkar om vad som väger tyngst.',
    when: (c) => c.raised('minimum_wage') && c.day > 30,
    choices: [
      { text: 'STÖD TILL SMÅFÖRETAG UNDER ETT ÖVERGÅNGSÅR', cost: { money: 400 }, griev: -5, temp: { gdp: 1, approval: 2 }, tip: 'Pizzerian klarar året. Sedan får den klara sig själv.' },
      { text: 'LÅT MARKNADEN ANPASSA SIG', griev: -4, temp: { approval: 2 }, ind: { unemp: 0.2, infl: 0.3 }, tip: 'Pizzan blir dyrare. Den anställde får behålla jobbet. Den här gången.' },
      { text: 'LÄGRE ARBETSGIVARAVGIFT FÖR UNGA', cost: { pp: 10 }, griev: -3, temp: { income: -1 }, ind: { youthunemp: -1 }, tip: 'Det första jobbet blir billigare att ge bort.' },
    ],
  },
  {
    id: 'sml_lk_ranta', icon: '\u{1F3E6}', weight: 2, cooldown: 900,
    title: 'RÄNTECHOCKEN I VILLAOMRÅDET',
    text: 'Räntan på bolånen har stigit kraftigt på ett år, och familjer som lånade maximalt när pengarna var billiga får nu betala betydligt mer varje månad. I villaområdet utanför {stad} står ovanligt många hus till salu. Bankerna rapporterar att allt fler ber om anstånd med betalningarna.',
    when: (c) => c.day > 60 && (c.ind.hhdebt ?? 40) > 100 && (c.ind.lendrate ?? 5) > 5,
    choices: [
      { text: 'TILLFÄLLIGT UPPEHÅLL MED AMORTERINGEN', cost: { pp: 10 }, temp: { approval: 3 }, ind: { houseprice: 2 }, tip: 'Ett andrum. Skulden står kvar, precis lika stor.' },
      { text: 'HÖJ RÄNTEAVDRAGET', cost: { money: 500 }, temp: { approval: 3, income: -1 }, tip: 'Staten betalar en del av räntan. Även för dem med störst lån.' },
      { text: 'MAN SKA INTE LÅNA MER ÄN MAN KLARAR', temp: { approval: -3 }, ind: { houseprice: -4, happiness: -0.1 }, tip: 'Sant. Och omöjligt att säga högt utan att förlora val.' },
    ],
  },
  {
    id: 'sml_lk_reallon', icon: '\u{1F31E}', weight: 2, cooldown: 900,
    title: 'REALLÖNERNA STIGER IGEN',
    text: 'För första gången på flera år ökar lönerna snabbare än priserna. Hushållen i {stad} har fått råd med en semesterresa igen, restaurangerna är fulla en vanlig tisdag och sparandet ökar. Opinionsinstitutet mäter den högsta framtidstron på ett årtionde.',
    when: (c) => c.day > 150 && c.trend('medinc') > 0 && (c.ind.infl ?? 3) < 3 && (c.ind.unemp ?? 6) < 7,
    choices: [
      { text: 'SPARA I GODA TIDER', res: { money: 300 }, temp: { stability: 2 }, tip: 'Det tråkigaste rådet i ekonomin. Och det bästa.' },
      { text: 'SÄNK SKATTEN LITE', cost: { pp: 10 }, temp: { approval: 4, income: -2 }, tip: 'Alla gillar det i dag. Kassan märker det i nästa kris.' },
      { text: 'INVESTERA I VÄGAR OCH JÄRNVÄG NU', cost: { money: 600 }, perm: { gdp: 1, factory: 1 }, tip: 'Bygg när det går bra, så går det bättre sedan.' },
    ],
  },

  // ===== ARBETSLIVET =====
  {
    id: 'sml_ar_buss', icon: '\u{1F68C}', weight: 2, cooldown: 1000,
    title: 'BUSSCHAUFFÖRERNA LÄGGER NER ARBETET',
    text: 'I morse stod bussarna i {stad} kvar i depåerna. Chaufförerna har gått ut i vild strejk mot delade turer, där de arbetar tre timmar på morgonen och tre på kvällen men är borta hemifrån i fjorton. Skolbarn, sjuksköterskor och pensionärer står vid hållplatserna, och den lokala fackordföranden säger att det har pågått i åratal.',
    when: (c) => c.day > 60 && (c.ind.strikes ?? 15) > 25 && (c.ind.unionrate ?? 10) > 10 && (c.grievOf('valfard') + c.grievOf('kris') > 10 || c.st.unrest > 10),
    choices: [
      { text: 'SKICKA EN MEDLARE', cost: { pp: 10 }, temp: { unrest: -2 }, next: ['sml_ar_avtal', 'sml_ar_sympati'], tip: 'Medlare dricker mycket kaffe. Ibland räcker det.' },
      { text: 'GE CHAUFFÖRERNA RÄTT, STATEN BETALAR', cost: { money: 400 }, temp: { approval: 2 }, next: ['sml_ar_avtal', null], tip: 'Bussarna går i morgon. Lokförarna har redan börjat räkna på sina scheman.' },
      { text: 'KALLA STREJKEN OLAGLIG', temp: { statepower: 2, freedom: -2, approval: -2 }, next: ['sml_ar_sympati', 'sml_ar_avtal'], tip: 'Lagen är på din sida. Hållplatserna är det inte.' },
      { text: 'VÄNTA UT DEM', temp: { approval: -2 }, ind: { strikes: 20 }, next: 'sml_ar_sympati', tip: 'Chaufförerna har väntat i åratal. De är vana.' },
    ],
  },
  {
    id: 'sml_ar_sympati', icon: '\u{270A}', chain: true,
    title: 'SYMPATISTREJKEN SPRIDER SIG',
    text: 'Strejken i {stad} har spridit sig. Sophämtarna, hamnarbetarna och tunnelbaneförarna har gått ut i sympati, och det börjar lukta i bostadsområdena. Facket har varslat om att ta ut fler förbund nästa vecka. Arbetsgivarna kräver att regeringen agerar, och opinionen står än så länge på de strejkandes sida.',
    choices: [
      { text: 'FÖRHANDLA PERSONLIGEN MED FACKEN', cost: { pp: 20 }, temp: { approval: 2, stability: 1 }, next: ['sml_ar_avtal', null], tip: 'Statsledningen vid förhandlingsbordet. Det händer en gång per generation.' },
      { text: 'LAGSTIFTA BORT DELADE TURER', cost: { money: 300, pp: 15 }, temp: { approval: 4, gdp: -1 }, next: 'sml_ar_avtal', tip: 'Kravet uppfyllt. Arbetsgivarna kallar det politisk inblandning.' },
      { text: 'FÖRBJUD STRIDSÅTGÄRDER TILLFÄLLIGT', cost: { pp: 10 }, law: ['unions', 'weak'], temp: { freedom: -4, statepower: 3 }, ind: { protests: 40 }, next: ['sml_ar_general', null], tip: 'Förbudet gäller strejker. Det gäller inte demonstrationer.' },
      { text: 'LÅT DET BLI EN KRAFTMÄTNING', temp: { factory: -3, approval: -2 }, ind: { strikes: 50 }, next: ['sml_ar_general', 'sml_ar_avtal'], tip: 'Någon vinner en kraftmätning. Det är sällan landet.' },
    ],
  },
  {
    id: 'sml_ar_general', icon: '\u{1F6D1}', chain: true,
    title: 'LANDET STÅR STILL',
    text: 'Det som började som en busstrejk i {stad} har blivit en generalstrejk. Tågen står still, skolorna är stängda, hamnarna är tomma, och elektriker, lärare och lagerarbetare marscherar tillsammans genom {huvudstad}. Facken säger att de inte går tillbaka förrän regeringen lyssnar. Varje dag kostar landet en förmögenhet.',
    choices: [
      { text: 'STORT TREPARTSAVTAL MED FACK OCH ARBETSGIVARE', cost: { money: 1000, pp: 20 }, temp: { stability: 4, approval: 3 }, ind: { strikes: -60 }, tip: 'Dyrt, långt och tråkigt att läsa. Det håller i tio år.' },
      { text: 'GE MED PÅ HUVUDKRAVEN', cost: { pp: 15 }, temp: { approval: 4, income: -3, factory: -1 }, ind: { strikes: -50, trustgov: 2 }, tip: 'Facken vinner. Nästa gång vet de att det fungerar.' },
      { text: 'MILITÄREN KÖR TÅGEN', cost: { man: 6 }, temp: { statepower: 4, freedom: -5, approval: -4 }, ind: { protests: 50 }, tip: 'Tågen går. Ingen vill åka med dem.' },
      { text: 'SITT KVAR OCH VÄNTA UT DEM', mod: 'general_strike', temp: { approval: -6 }, ind: { gdpgrowth: -1, unemp: 0.4, trustgov: -5 }, tip: 'Den som väntar på något gott väntar ofta länge.' },
    ],
  },
  {
    id: 'sml_ar_avtal', icon: '\u{1F91D}', chain: true,
    title: 'AVTALET SOM BLEV EN FÖREBILD',
    text: 'Efter tre veckors förhandlingar har parterna skrivit under: delade turer avskaffas stegvis, lönerna höjs något och företagen får längre avtalsperioder i gengäld. Bussarna i {stad} går som vanligt igen. Andra branscher vill nu ha samma modell, och arbetsgivarna medger att det blev billigare än en lång konflikt.',
    choices: [
      { text: 'SKRIV IN MODELLEN I LAGEN', cost: { pp: 15 }, perm: { qol: 1, stability: 1 }, tip: 'Det parterna kom överens om blir en regel för alla.' },
      { text: 'LÅT PARTERNA SKÖTA RESTEN SJÄLVA', temp: { stability: 2, approval: 2 }, ind: { strikes: -30 }, tip: 'Staten håller sig undan. Det är ofta det klokaste.' },
      { text: 'BJUD CHAUFFÖRERNA PÅ TÅRTA', cost: { money: 50 }, temp: { approval: 2, unrest: -2 }, tip: 'Tårtan kommer med buss. I tid.' },
    ],
  },
  {
    id: 'sml_ar_fack', icon: '\u{1F4E3}', kind: 'valfard', react: true, cooldown: 700,
    title: 'FACKET KALLAR TILL STORMÖTE',
    text: 'Sedan beslutet om {lag} har landets största fackförbund kallat till stormöte i {huvudstad}. Tiotusentals medlemmar fyller arenan, och ordföranden säger att "man tar inte bort hundra år av rättigheter med ett pennstreck". Förbunden diskuterar en samordnad strejk, och flera arbetsgivare oroar sig redan för konflikten.',
    when: (c) => c.cut('unions') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -20, temp: { approval: 2 }, tip: 'Arenan jublar. Arbetsgivarna suckar, men lättat.' },
      { text: 'BJUD IN TILL TREPARTSSAMTAL', cost: { pp: 10 }, griev: -10, temp: { stability: 1 }, tip: 'Samtal i stället för strejk. Båda sidor sparar pengar.' },
      { text: 'STÅ FAST, ARBETSMARKNADEN MÅSTE BLI FRIARE', griev: 10, temp: { gdp: 1, unrest: 4 }, ind: { strikes: 40, protests: 30 }, tip: 'Friare för vem? frågar ordföranden från scenen.' },
    ],
  },
  {
    id: 'sml_ar_semester', icon: '\u{1F3D6}\u{FE0F}', kind: 'valfard', react: true, cooldown: 700,
    title: 'SEMESTERN SOM FÖRSVANN',
    text: 'Sedan beslutet om {lag} har sommarstugeorterna fått avbokningar, och barnfamiljer i {stad} pusslar med ledighet som inte räcker till hela skollovet. En undersökning visar att var tredje anställd känner sig mer stressad än för ett år sedan. Turistnäringen räknar med ett förlorat år.',
    when: (c) => c.cut('workhours', 'vacation') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -18, temp: { approval: 3 }, tip: 'Sommarstugorna fylls igen. Grillarna tänds.' },
      { text: 'LÅT PARTERNA FÖRHANDLA FRAM MER LEDIGHET', cost: { pp: 5 }, griev: -6, temp: { gdp: -1 }, tip: 'Några branscher får tillbaka veckorna. Andra får vänta till nästa avtal.' },
      { text: 'MER ARBETE GER MER VÄLSTÅND', griev: 7, temp: { gdp: 2, approval: -3 }, ind: { happiness: -0.15, tourists: -5 }, tip: 'Välståndet ökar. Det finns bara ingen tid att njuta av det.' },
    ],
  },
  {
    id: 'sml_ar_fyradagar', icon: '\u{1F4C5}', weight: 2, cooldown: 1200,
    title: 'KORTARE ARBETSVECKA: ETT ÅR SENARE',
    text: 'Ett år efter att arbetsveckan kortades visar utvärderingen att sjukfrånvaron har sjunkit, att färre har sagt upp sig och att de flesta arbetsplatser producerar nästan lika mycket som förut. Men i vården och kollektivtrafiken har det blivit svårt att få ihop schemat. På fredagar är golfbanorna i {stad} fullbokade.',
    when: (c) => c.day > 150 && c.is('workhours', 'fourday', 'week35'),
    choices: [
      { text: 'BEHÅLL REFORMEN OCH ANSTÄLL FLER I VÅRDEN', cost: { money: 600 }, perm: { qol: 2, welfare: 1 }, tip: 'Kortare veckor kräver fler händer i yrken som aldrig stänger.' },
      { text: 'LÅT VARJE BRANSCH VÄLJA SJÄLV', cost: { pp: 10 }, temp: { gdp: 2, approval: 1 }, tip: 'Kontoren behåller fredagen. Sjukhusen tar tillbaka den.' },
      { text: 'FIRA MED EN LÅNG HELG', temp: { approval: 3 }, ind: { happiness: 0.1 }, tip: 'Tre dagar ledigt. Alla vet redan hur det känns.' },
    ],
  },
  {
    id: 'sml_ar_deltid', icon: '\u{231B}', weight: 2, cooldown: 900,
    title: 'DE SOM VILL JOBBA HELTID',
    text: 'Var tredje undersköterska, butiksanställd och barnskötare arbetar deltid, de flesta för att heltid inte finns att få. Lönen räcker inte och pensionen blir låg. I {stad} har en undersköterska tre olika timanställningar för att få ihop en heltid, och hon kör mellan dem i en bil som inte vill starta på vintern.',
    when: (c) => c.day > 60 && (c.ind.parttime ?? 20) > 35 && (c.ind.femlabor ?? 50) > 45 && (c.ind.gdppc ?? 0) > 10000,
    choices: [
      { text: 'HELTID SOM NORM I VÅRD OCH OMSORG', cost: { money: 500 }, perm: { qol: 1 }, temp: { welfare: 2 }, tip: 'Fler heltider, färre som pusslar. Schemaläggarna får ett nytt pussel.' },
      { text: 'RÄTT TILL HELTID I LAG', cost: { pp: 15 }, temp: { approval: 3, gdp: -1, factory: -1 }, tip: 'Rätten finns. Jobben ska bara hinna komma ikapp.' },
      { text: 'FLEXIBILITET ÄR BRA FÖR ARBETSMARKNADEN', temp: { gdp: 1, approval: -3 }, ind: { happiness: -0.05 }, tip: 'Flexibelt för arbetsgivaren. Bilen startar fortfarande inte.' },
    ],
  },
  {
    id: 'sml_ar_utbrand', icon: '\u{1F4BC}', weight: 2, cooldown: 900,
    title: 'UTBRÄNDA PÅ KONTORET',
    text: 'Kontorsfolket i {huvudstad} arbetar långa veckor, och många svarar på mejl till midnatt. Stressmottagningarna har köer på ett halvår. En ung jurist har blivit känd för en video där hon somnar framför datorn klockan elva på kvällen, och den har delats en miljon gånger.',
    when: (c) => c.day > 60 && ((c.ind.workweek ?? 40) > 44 || c.is('workhours', 'optout', 'extended', 'sixday', 'maximum')) && (c.ind.gdppc ?? 0) > 8000,
    choices: [
      { text: 'RÄTT ATT INTE SVARA EFTER ARBETSTID', cost: { pp: 15 }, law: ['workhours', 'disconnect'], temp: { approval: 3, gdp: -1 }, tip: 'Mejlen kan vänta till i morgon. De flesta kunde det redan förut.' },
      { text: 'STÖD TILL STRESSMOTTAGNINGARNA', cost: { money: 300 }, temp: { welfare: 1 }, ind: { happiness: 0.05 }, tip: 'Kortare kö till hjälpen. Samma arbetsplats att gå tillbaka till.' },
      { text: 'DET ÄR SÅ MAN BLIR RIK', temp: { gdp: 2, approval: -2 }, ind: { happiness: -0.1 }, tip: 'Rika på pengar, fattiga på sömn.' },
    ],
  },
  {
    id: 'sml_ar_bud', icon: '\u{1F6B4}', weight: 2, cooldown: 900,
    title: 'CYKELBUDEN UTAN SKYDDSNÄT',
    text: 'Tusentals unga cyklar mat och paket genom {huvudstad} åt appföretag som kallar dem "partner" i stället för anställd. De har ingen sjuklön, ingen försäkring och ingen semester. När en av dem blev påkörd i en korsning fick han ingen ersättning alls, och nu protesterar buden med en cykelkortege genom stan.',
    when: (c) => c.day > 60 && c.is('unions', 'righttowork', 'weak', 'banned', 'stateunions') && (c.ind.youthunemp ?? 10) > 10 && (c.ind.internet ?? 50) > 60,
    choices: [
      { text: 'BUDEN RÄKNAS SOM ANSTÄLLDA', cost: { pp: 15 }, perm: { welfare: 1 }, temp: { approval: 3, gdp: -1 }, tip: 'Appföretagen hotar att lämna landet. Två av tre stannar.' },
      { text: 'OLYCKSFALLSFÖRSÄKRING FÖR ALLA BUD', cost: { money: 200 }, temp: { welfare: 1, approval: 2 }, tip: 'Ett minimum av skydd. Buden tar det.' },
      { text: 'FRIHET ATT VÄLJA SINA PASS', temp: { gdp: 1, approval: -2 }, ind: { youthunemp: -0.5 }, tip: 'Friheten att cykla i regnet för en tjuga i timmen.' },
    ],
  },

  // ===== FAMILJEN =====
  {
    id: 'sml_fa_fodda', icon: '\u{1F476}', weight: 2, cooldown: 1000,
    title: 'FÄRRE BARN ÄN NÅGONSIN',
    text: 'Förra året föddes färre barn än något år sedan mätningarna började. I {stad} har en förlossningsavdelning stängt och skolor på landsbygden slås ihop. När forskarna frågar unga varför de väntar svarar de bostäder, otrygga jobb och att det känns som att allt kostar för mycket.',
    when: (c) => c.day > 90 && (c.ind.fert ?? 2) < 1.45,
    choices: [
      { text: 'BOSTÄDER OCH TRYGGA JOBB FÖR UNGA FAMILJER', cost: { money: 800 }, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'Den bästa familjepolitiken är en egen lägenhet och ett fast jobb.' },
      { text: 'STORT BIDRAG FÖR ANDRA OCH TREDJE BARNET', cost: { money: 500, pp: 10 }, law: ['popgrowth', 'babybonus'], temp: { approval: 3 }, tip: 'Pengar hjälper lite. Forskarna är oense om hur lite.' },
      { text: 'DET ÄR FOLKS EGET VAL', temp: { approval: -2 }, ind: { happiness: -0.05 }, tip: 'Det är det. Valet görs bara under omständigheter som staten bestämmer.' },
    ],
  },
  {
    id: 'sml_fa_forskoleko', icon: '\u{1F9F8}', weight: 2, cooldown: 1000,
    title: 'INGEN PLATS PÅ FÖRSKOLAN',
    text: 'Lisa i {stad} ska börja jobba efter föräldraledigheten, men kommunen kan inte erbjuda någon förskoleplats förrän om åtta månader. Hon är inte ensam: kön är tvåtusen barn lång. Den privata förskolan kostar halva hennes lön, och farmor bor i en annan stad. Arbetsgivaren har varit tålmodig, men inte för evigt.',
    when: (c) => c.day > 60 && (c.ind.preschool ?? 80) < 75 && (c.ind.femlabor ?? 50) > 40 && (c.ind.gdppc ?? 0) > 5000,
    choices: [
      { text: 'BYGG FÖRSKOLOR, STATEN BETALAR HÄLFTEN', cost: { money: 800 }, temp: { approval: 2 }, next: ['sml_fa_forskolaklar', null], tip: 'Två år att bygga. Lisa hinner bli ledig en gång till.' },
      { text: 'MAXTAXA OCH PLATSGARANTI', cost: { money: 500, pp: 10 }, law: ['childcare', 'subsidized'], next: ['sml_fa_forskolaklar', 'sml_fa_mammorna'], tip: 'En garanti är ett löfte. Någon måste bygga det också.' },
      { text: 'VÅRDNADSBIDRAG TILL DEN SOM STANNAR HEMMA', cost: { money: 300 }, law: ['childcare', 'familycash'], next: 'sml_fa_mammorna', tip: 'Billigare än förskolor. Gissa vem som stannar hemma.' },
      { text: 'KÖN BLIR KORTARE NÄR BARNEN VÄXER', temp: { approval: -3 }, next: 'sml_fa_mammorna', tip: 'Tekniskt sant. Lisa är inte imponerad.' },
    ],
  },
  {
    id: 'sml_fa_mammorna', icon: '\u{1F469}', chain: true,
    title: 'MAMMORNA SOM INTE KOM TILLBAKA',
    text: 'Ett år senare visar statistiken att tusentals småbarnsmammor har lämnat arbetsmarknaden. De flesta ville jobba, men utan förskola gick det inte ihop. Sjukhuset i {stad} saknar sjuksköterskor, skolorna saknar lärare, och pensionsmyndigheten räknar ut att de här kvinnorna kommer att få en fjärdedel lägre pension.',
    choices: [
      { text: 'AKUT UTBYGGNAD AV FÖRSKOLAN', cost: { money: 900 }, perm: { welfare: 1 }, temp: { gdp: 1, approval: 2 }, tip: 'Det som borde ha byggts för ett år sedan, nu till dubbla priset.' },
      { text: 'FÖRSKOLOR PÅ ARBETSPLATSERNA', cost: { pp: 10 }, law: ['childcare', 'workplace'], temp: { gdp: 1, approval: 1 }, tip: 'Sjukhuset öppnar en förskola i källaren. Sjuksköterskorna kommer tillbaka.' },
      { text: 'FAMILJERNA VÄLJER SJÄLVA', temp: { approval: -2, gdp: -2 }, ind: { unemp: 0.2 }, tip: 'De valde. Mellan två dåliga alternativ.' },
    ],
  },
  {
    id: 'sml_fa_forskolaklar', icon: '\u{1F388}', chain: true,
    title: 'FÖRSKOLEUTBYGGNADEN ÄR KLAR',
    text: 'Den sista av de nya förskolorna i {stad} har öppnat, och för första gången på tio år finns det ingen kö. Föräldrar kan börja jobba när de vill, fler kvinnor har jobb och förskollärarna säger att barnen klarar sig bättre när de börjar skolan. På invigningen klipper en fyraåring bandet med en plastsax.',
    choices: [
      { text: 'MINDRE BARNGRUPPER NU NÄR PLATSERNA FINNS', cost: { money: 400 }, perm: { qol: 1, hdi: 1 }, tip: 'Femton barn i stället för tjugotvå. Det hörs, på ett bra sätt.' },
      { text: 'BJUD IN PRESSEN TILL INVIGNINGEN', temp: { approval: 3, stability: 1 }, tip: 'Fyraåringen blir veckans mest delade bild.' },
      { text: 'SÄNK AVGIFTEN YTTERLIGARE', cost: { money: 300 }, temp: { approval: 3, gdp: 1 }, tip: 'Billig förskola betalar sig själv i skatt från föräldrarna som jobbar.' },
    ],
  },
  {
    id: 'sml_fa_barnvagn', icon: '\u{1F37C}', kind: 'valfard', react: true, cooldown: 700,
    title: 'BARNVAGNSMARSCHEN',
    text: 'Tiotusen föräldrar har rullat barnvagnar genom {huvudstad} i protest mot beslutet om {lag}. Bebisar sover i vagnarna medan föräldrarna ropar slagord och delar ut flygblad. Ett plakat har blivit en symbol på nätet: "Jag har inte sovit på ett år, men jag har tid att demonstrera."',
    when: (c) => c.cut('parental_leave', 'childcare') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -20, temp: { approval: 3 }, tip: 'Föräldrarna går hem och sover. Äntligen.' },
      { text: 'KOMPENSATION TILL FAMILJER MED SMÅ BARN', cost: { money: 500 }, griev: -10, temp: { welfare: 1 }, tip: 'Pengar i stället för tid. Föräldrar vill ha båda.' },
      { text: 'STÅ FAST VID BESLUTET', griev: 9, temp: { approval: -4 }, ind: { protests: 25, trustgov: -3 }, tip: 'Föräldrar till små barn har aldrig tid. Utom när de är arga.' },
    ],
  },
  {
    id: 'sml_fa_pappor', icon: '\u{1F468}\u{200D}\u{1F37C}', weight: 2, cooldown: 1200,
    title: 'PAPPORNA MED BARNVAGNARNA',
    text: 'På kaféerna i {stad} sitter numera lika många pappor som mammor med barnvagn en vanlig vardag. Papporna tar ut nästan hälften av föräldraledigheten, och forskarna ser att lönegapet mellan kvinnor och män krymper. Utländska journalister kommer för att fotografera "lattepapporna", som de kallas.',
    when: (c) => c.day > 120 && (c.is('parental_leave', 'equal', 'generous', 'long', 'paid') || c.is('equality', 'parental', 'full', 'quotas')) && (c.ind.fert ?? 2) < 2.2 && (c.ind.gdppc ?? 0) > 8000,
    choices: [
      { text: 'KAMPANJ FÖR PAPPALEDIGHET I INDUSTRIN', cost: { money: 100 }, perm: { qol: 1 }, temp: { approval: 1 }, tip: 'Svetsare med bärsele. Det är inte så ovanligt längre.' },
      { text: 'BJUD IN DE UTLÄNDSKA JOURNALISTERNA', rel: 3, temp: { approval: 2 }, tip: 'Landets bästa reklam är en pappa som byter blöja.' },
      { text: 'LÄNGRE FÖRÄLDRALEDIGHET FÖR ALLA', cost: { money: 500 }, perm: { qol: 1, welfare: 1 }, tip: 'Mer tid med barnen. Arbetsgivarna får planera lite mer.' },
    ],
  },
  {
    id: 'sml_fa_babyboom', icon: '\u{1F37C}', kind: 'valfard', react: true, cooldown: 1200,
    title: 'BABYBOOMEN',
    text: 'Sedan beslutet om {lag} har födelsetalen börjat stiga för första gången på länge. Barnmorskorna i {stad} har fullt upp och en gammal förlossningsavdelning har öppnat igen. Men demograferna har en påminnelse: om tre år behövs fler förskoleplatser, och om sju år fler lärare.',
    when: (c) => c.raised('parental_leave', 'childcare', 'housing') && c.day > 60 && (c.ind.fert ?? 2) < 2.5,
    choices: [
      { text: 'PLANERA FÖRSKOLOR OCH SKOLOR REDAN NU', cost: { money: 500 }, griev: -6, perm: { qol: 1, welfare: 1 }, tip: 'Sällsynt framförhållning. Om sju år tackar någon dig utan att veta varför.' },
      { text: 'FLER BARNMORSKOR OCH BB-PLATSER', cost: { money: 300 }, griev: -4, temp: { welfare: 2 }, tip: 'Ingen ska behöva föda i en bil på väg till nästa stad.' },
      { text: 'VI TAR DET NÄR DET KOMMER', temp: { approval: 2 }, tip: 'Det kommer. Om tre år, med blöja.' },
    ],
  },
  {
    id: 'sml_fa_trangbott', icon: '\u{1F6AA}', weight: 2, cooldown: 900,
    title: 'TRE GENERATIONER I TVÅ RUM',
    text: 'I stadsdelarna runt {huvudstad} bor familjer med farföräldrar, föräldrar och barn i lägenheter på två rum. Barnen gör läxorna i badrummet, eftersom det är det enda rummet med en dörr som går att stänga. Lärarna märker det: elever från trångbodda hem är tröttare och har svårare att hänga med.',
    when: (c) => c.day > 60 && (c.ind.hhsize ?? 3) > 4.2 && (c.ind.urban ?? 50) > 45,
    choices: [
      { text: 'BYGG STORA LÄGENHETER FÖR STORA FAMILJER', cost: { money: 700 }, perm: { qol: 1 }, ind: { segreg: -1 }, tip: 'Fem rum och kök. Farmor får ett eget rum för första gången.' },
      { text: 'LÄXHJÄLP OCH LÄSRUM PÅ BIBLIOTEKEN', cost: { money: 200 }, perm: { hdi: 1 }, temp: { approval: 1 }, tip: 'Ett tyst bord och en vuxen som kan matte. Det är allt som behövs.' },
      { text: 'SÅ HAR FAMILJER ALLTID BOTT', temp: { approval: -2 }, ind: { happiness: -0.05 }, tip: 'Det har de. Läxorna var färre då.' },
    ],
  },

  // ===== INFRASTRUKTUR OCH PENDLING =====
  {
    id: 'sml_in_signal', icon: '\u{1F686}', weight: 2, cooldown: 1000,
    title: 'SIGNALFELET',
    text: 'För tredje gången den här månaden står tågtrafiken in till {huvudstad} still i morgonrusningen: ett signalfel, en trasig växel och en kontaktledning som rasat. Järnvägen har en underhållsskuld på flera miljarder och spåren är i snitt fyrtio år gamla. Pendlarna har startat en grupp på nätet som heter "Försenade igen".',
    when: (c) => c.day > 80 && (c.ind.rail ?? 0) > 1500 && c.st.income < 20 && c.res('infrastructure') < 5,
    choices: [
      { text: 'EN UNDERHÅLLSMILJARD TILL JÄRNVÄGEN', cost: { money: 1000 }, temp: { approval: 1 }, next: ['sml_in_tagbra', null], tip: 'Nya växlar syns inte på bild. De syns i tidtabellen.' },
      { text: 'PRIVATISERA DRIFTEN', cost: { pp: 15 }, law: ['transport', 'private'], temp: { income: 1 }, next: ['sml_in_tagbra', 'sml_in_urspar'], tip: 'Ett bolag med vinstkrav sköter spåren. Det kan gå åt båda hållen.' },
      { text: 'SKJUT UPP UNDERHÅLLET ETT ÅR TILL', temp: { income: 2, approval: -2 }, next: ['sml_in_urspar', 'sml_in_urspar', null], tip: 'Ett år till på fyrtioåriga spår. Vad kan gå fel?' },
    ],
  },
  {
    id: 'sml_in_urspar', icon: '\u{1F6A7}', chain: true,
    title: 'URSPÅRNINGEN VID {STAD}',
    text: 'Ett godståg har spårat ur strax utanför {stad}. Ingen skadades, men tjugo vagnar ligger huller om buller över båda spåren och stambanan är stängd i tre veckor. Haverikommissionen hittar snabbt orsaken: en rälsbrytning som stått på underhållslistan i två år. Industrin får köra godset med lastbil.',
    choices: [
      { text: 'REPARERA DYGNET RUNT', cost: { money: 600 }, temp: { stability: 1, approval: 1 }, tip: 'Banan öppnar på tio dagar i stället för tjugoen.' },
      { text: 'NY UNDERHÅLLSPLAN FÖR HELA NÄTET', cost: { money: 400, pp: 10 }, perm: { factory: 1 }, ind: { trustgov: 2 }, tip: 'Tråkigt, dyrt och nödvändigt. Som det mesta som fungerar.' },
      { text: 'OLYCKOR HÄNDER', temp: { approval: -4, factory: -2 }, ind: { trustgov: -4 }, tip: 'De händer oftare på spår som ingen har lagat.' },
    ],
  },
  {
    id: 'sml_in_tagbra', icon: '\u{1F684}', chain: true,
    title: 'TÅGEN GÅR I TID',
    text: 'Ett år efter satsningen går nio av tio tåg i tid, och pendlarna i {stad} har slutat ta med sig matsäck för säkerhets skull. Gruppen "Försenade igen" har bytt namn till "Nästan alltid i tid" och tappat hälften av medlemmarna. Fler lämnar bilen hemma, och köerna in till {huvudstad} har krympt.',
    choices: [
      { text: 'FLER AVGÅNGAR', cost: { money: 700 }, perm: { qol: 1, gdp: 1 }, tip: 'Tåg varje kvart. Då slutar folk titta på tidtabellen.' },
      { text: 'BJUD PENDLARNA PÅ KAFFE PÅ CENTRALEN', temp: { approval: 3 }, tip: 'En kopp kaffe för tio år av förseningar. De tar den ändå.' },
      { text: 'SÄNK BILJETTPRISET', cost: { money: 300 }, temp: { approval: 3, qol: 1 }, tip: 'Billigare och i tid. Bilarna står kvar i garaget.' },
    ],
  },
  {
    id: 'sml_in_pendling', icon: '\u{1F68F}', weight: 2, cooldown: 900,
    title: 'NITTIO MINUTER TILL JOBBET',
    text: 'Pendlingen i {huvudstad} blir längre för varje år. Många åker en och en halv timme åt varje håll och ser sina barn vakna bara på helgerna. Ekonomerna pekar på att bostäderna byggs långt från jobben, och trafikforskarna på att nya vägar bara fylls med fler bilar.',
    when: (c) => c.day > 60 && (c.ind.commute ?? 30) > 38,
    choices: [
      { text: 'SNABBA REGIONTÅG', cost: { money: 900 }, perm: { qol: 1, gdp: 1 }, tip: 'Halva restiden. Om tio år, när spåren är klara.' },
      { text: 'BYGG BOSTÄDER NÄRA JOBBEN', cost: { pp: 15 }, law: ['urban_planning', 'masterplan'], perm: { qol: 1 }, tip: 'Stad och jobb på samma ställe. Ett gammalt påfund som fungerar.' },
      { text: 'RÄTT ATT JOBBA HEMIFRÅN TVÅ DAGAR I VECKAN', cost: { pp: 10 }, temp: { approval: 3 }, ind: { happiness: 0.05 }, tip: 'Tre timmar mindre i bilen. Lunchrestaurangerna i centrum suckar.' },
      { text: 'PENDLING ÄR ETT EGET VAL', temp: { approval: -2 }, ind: { happiness: -0.05 }, tip: 'Valet mellan en lägenhet man har råd med och en man inte har råd med.' },
    ],
  },
  {
    id: 'sml_in_bilko', icon: '\u{1F697}', weight: 2, cooldown: 900,
    title: 'BILKÖERNA RUNT {HUVUDSTAD}',
    text: 'Varje morgon står en halv miljon bilar i kö in mot {huvudstad}. Ambulanserna fastnar, bussarna kommer inte fram och luften vid de stora lederna är bland den sämsta i landet. Stadsplanerarna föreslår trängselskatt. Förortsborna kallar det en skatt på att bo långt ifrån stan.',
    when: (c) => c.day > 60 && (c.ind.cars ?? 300) > 520 && (c.ind.urban ?? 50) > 75,
    choices: [
      { text: 'INFÖR TRÄNGSELSKATT', cost: { pp: 15 }, temp: { approval: -3, income: 2 }, perm: { qol: 1 }, tip: 'Alla hatar den första året. Sedan vill ingen ta bort den.' },
      { text: 'KOLLEKTIVTRAFIKEN FÖRST', cost: { money: 700 }, law: ['transport', 'transitfirst'], perm: { qol: 1 }, tip: 'Bussfiler överallt. Bilisterna i kön tittar avundsjukt.' },
      { text: 'BYGG EN NY RINGLED', cost: { money: 900 }, temp: { gdp: 2, approval: 1 }, tip: 'Kön försvinner i två år. Sedan är ringleden också full.' },
      { text: 'KÖER ÄR ETT TECKEN PÅ VÄLSTÅND', temp: { approval: -2 }, ind: { happiness: -0.05 }, tip: 'Välstånd som står still på motorvägen.' },
    ],
  },
  {
    id: 'sml_in_trafikreform', icon: '\u{1F68E}', kind: 'miljo', react: true, cooldown: 800,
    title: 'TRAFIKREFORMEN: FÖRSTA MÅNADEN',
    text: 'En månad efter beslutet om {lag} är bussarna i {stad} så fulla att folk får stå i dörrarna, och centrum har blivit tystare. Pensionärer och studenter jublar. Men butiksägarna längs huvudgatan säger att kunderna med bil har försvunnit till köpcentret utanför stan, och bussförarna kräver fler kollegor.',
    when: (c) => c.changed('transport') && c.is('transport', 'freetransit', 'carfree', 'transitfirst'),
    choices: [
      { text: 'FLER BUSSAR OCH FÖRARE', cost: { money: 600 }, griev: -6, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'Ingen ska behöva stå i dörren. Det tar ett halvår att anställa förarna.' },
      { text: 'INFARTSPARKERINGAR VID STADSGRÄNSEN', cost: { money: 300 }, griev: -4, temp: { gdp: 1 }, tip: 'Bilen vid gränsen, bussen in. Butikerna får tillbaka några kunder.' },
      { text: 'LYSSNA PÅ BUTIKERNA OCH BACKA', cost: { pp: 15 }, undo: true, griev: 5, temp: { gdp: 1, approval: -1 }, tip: 'Bilarna kommer tillbaka. Det gör tystnaden inte.' },
      { text: 'GE REFORMEN ETT ÅR', temp: { qol: 2, approval: -2 }, tip: 'Vanor tar tid att ändra. Butiksägarna har inte ett år.' },
    ],
  },
  {
    id: 'sml_in_bro', icon: '\u{1F309}', weight: 2, cooldown: 1000,
    title: 'BRON SOM STÄNGDES',
    text: 'Inspektörerna har hittat sprickor i bärverket på den stora bron i {stad}, och den stängs för all tung trafik på obestämd tid. Lastbilarna får köra en omväg på sex mil och ambulanserna tar tjugo minuter längre. Bron skulle ha renoverats för fem år sedan, men pengarna gick till annat.',
    when: (c) => c.day > 200 && (c.st.income < -10 || c.deficit) && c.res('infrastructure') < 4 && (c.ind.gdppc ?? 0) > 3000,
    choices: [
      { text: 'AKUT RENOVERING', cost: { money: 900 }, temp: { approval: 2, factory: 1 }, tip: 'Det dyraste sättet att laga en bro är att vänta med det.' },
      { text: 'TILLFÄLLIG MILITÄRBRO', cost: { money: 200, man: 3 }, temp: { approval: 2 }, tip: 'Ingenjörstrupperna bygger på en vecka det som tar ett år att upphandla.' },
      { text: 'VÄNTA PÅ NÄSTA BUDGET', temp: { factory: -2, approval: -3 }, ind: { trustgov: -2 }, tip: 'Lastbilarna kör sex mil extra. Varje dag. Det kostar också.' },
    ],
  },

  // ===== NÄRMILJÖN =====
  {
    id: 'sml_nm_smog', icon: '\u{1F32B}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'SMOGEN LIGGER ÖVER {HUVUDSTAD}',
    text: 'För femte dagen i rad ligger en gulgrå dimma över {huvudstad}. Man ser inte toppen på de högsta husen, skolorna håller barnen inne på rasterna och apoteken har sålt slut på andningsskydd. Läkarna rapporterar fler astmaanfall och hjärtproblem. Röken kommer från bilarna, kolkraftverken och fabrikerna runt staden.',
    when: (c) => c.day > 60 && (c.ind.pm25 ?? 15) > 30 && (c.ind.urban ?? 50) > 40,
    choices: [
      { text: 'KÖRFÖRBUD FÖR VARANNAN BIL', cost: { pp: 10 }, temp: { approval: -2, gdp: -1, qol: 1 }, ind: { life: 0.05 }, tip: 'Jämna registreringsnummer i dag, udda i morgon. Alla lånar grannens bil.' },
      { text: 'STÄNG DET ÄLDSTA KOLKRAFTVERKET', cost: { money: 800 }, perm: { qol: 1 }, temp: { factory: -1 }, ind: { life: 0.1 }, tip: 'Himlen blir blå igen. Elen måste komma någon annanstans ifrån.' },
      { text: 'RENINGSFILTER PÅ FABRIKERNA', cost: { money: 500, pp: 5 }, perm: { qol: 1 }, temp: { factory: -1 }, tip: 'Fabrikerna klagar på kostnaden. Grannarna slutar hosta.' },
      { text: 'DET BLÅSER UPP SNART', temp: { approval: -4 }, ind: { life: -0.1, happiness: -0.1 }, tip: 'Vinden kommer. Smogen också, nästa vinter.' },
    ],
  },
  {
    id: 'sml_nm_varme', icon: '\u{1F321}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'VÄRMEBÖLJAN OCH ÄLDREBOENDENA',
    text: 'Termometern har visat över trettiofyra grader i två veckor. På äldreboendena i {stad} finns ingen luftkonditionering, och personalen springer runt med blöta handdukar och vattenglas. Sjukhusen tar emot fler äldre med uttorkning än någonsin. Meteorologerna säger att somrar som den här kommer att bli vanligare.',
    when: (c) => c.day > 100 && (c.ind.old ?? 10) > 14 && c.res('climate') < 3 && c.st.welfare < 25,
    choices: [
      { text: 'SVALA RUM PÅ VARJE ÄLDREBOENDE', cost: { money: 500 }, perm: { welfare: 1 }, ind: { life: 0.05 }, tip: 'Ett rum med luftkonditionering där alla kan sitta på eftermiddagen.' },
      { text: 'VÄRMEPLAN MED HEMBESÖK HOS ÄLDRE', cost: { money: 200, pp: 5 }, temp: { welfare: 2, approval: 2 }, tip: 'Någon som knackar på och kollar att vattenglaset är fullt.' },
      { text: 'PLANTERA TRÄD OCH PARKER I STÄDERNA', cost: { money: 300 }, perm: { qol: 1 }, tip: 'Ett träd sänker temperaturen på gatan med flera grader. Om tjugo år.' },
      { text: 'DET ÄR BARA EN VARM SOMMAR', temp: { approval: -3 }, ind: { life: -0.1 }, tip: 'Nästa sommar är också bara en varm sommar.' },
    ],
  },
  {
    id: 'sml_nm_renluft', icon: '\u{1F343}', weight: 2, cooldown: 1200,
    title: 'STADSLUFTEN ÄR REN IGEN',
    text: 'Mätstationerna i {huvudstad} visar att luften är renare än på femtio år. Elbussarna har tagit över, de gamla pannorna är utbytta och barnläkarna ser färre fall av astma. Lavar som försvann från stadens träd på sextiotalet har kommit tillbaka, och stadens cyklister har börjat kräva fler cykelbanor.',
    when: (c) => c.day > 150 && (c.ind.pm25 ?? 15) < 10 && c.trend('pm25') < 0 && (c.ind.urban ?? 50) > 60,
    choices: [
      { text: 'MILJÖZON I HELA CENTRUM', cost: { pp: 10 }, perm: { qol: 1 }, temp: { approval: 1 }, tip: 'Det som har blivit bra ska inte bli sämre igen.' },
      { text: 'BJUD IN VÄRLDSHÄLSOORGANISATIONEN', rel: 3, temp: { approval: 2 }, tip: 'Experterna tar djupa andetag och skriver en positiv rapport.' },
      { text: 'FLER CYKELBANOR', cost: { money: 300 }, perm: { qol: 1 }, ind: { happiness: 0.05 }, tip: 'Cyklisterna får som de vill. De ringer i klockan av glädje.' },
    ],
  },
  {
    id: 'sml_nm_astma', icon: '\u{1F3ED}', kind: 'miljo', react: true, cooldown: 800,
    title: 'ASTMABARNEN I {STAD}',
    text: 'Sedan beslutet om {lag} har det gamla kraftverket i {stad} startats igen och går för fullt. Föräldrar till barn med astma har startat ett upprop, och barnkliniken bekräftar att besöken har ökat. Kraftverket ger jobb åt fyrahundra personer och billigare el, säger kommunen. Föräldrarna frågar vad billig el är värd mot ett barns lungor.',
    when: (c) => c.changed('energy') && c.is('energy', 'fossil', 'fuelsubsidy', 'dominance', 'gasbridge') && (c.ind.urban ?? 50) > 40,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -12, temp: { approval: 2 }, tip: 'Kraftverket stängs igen. De fyrahundra jobben också.' },
      { text: 'RENINGSFILTER PÅ KRAFTVERKET', cost: { money: 500 }, griev: -6, perm: { qol: 1 }, tip: 'Dyrare el, renare luft. En kompromiss som går att andas.' },
      { text: 'JOBBEN OCH ELPRISET GÅR FÖRST', griev: 6, temp: { gdp: 1, approval: -3 }, ind: { life: -0.05 }, tip: 'Föräldrarna glömmer inte. Barnen hostar.' },
    ],
  },
  {
    id: 'sml_nm_vindkraft', icon: '\u{1F32C}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'VINDKRAFTVERKEN OCH BYN',
    text: 'Ett energibolag vill bygga fyrtio vindkraftverk på åsen ovanför en by utanför {stad}, varje snurra högre än kyrktornet. Byborna oroar sig för ljudet, de blinkande lamporna och fallande huspriser. Elen behövs i städerna och fabrikerna, säger bolaget. Byborna undrar varför den då inte byggs där.',
    when: (c) => c.day > 100 && c.is('energy', 'renewable', 'green', 'carbontax') && (c.ind.ruralpop ?? 0) / Math.max(1, c.ind.pop ?? 1) > 0.1,
    choices: [
      { text: 'BYGDEPENG: EN DEL AV VINSTEN TILL BYN', cost: { money: 300 }, perm: { factory: 1 }, temp: { approval: 2 }, tip: 'Ny skolbuss och upprustad bygdegård. Snurrorna låter lite mindre.' },
      { text: 'STATEN KÖR ÖVER KOMMUNENS VETO', cost: { pp: 15 }, perm: { factory: 1 }, temp: { freedom: -1, approval: -2 }, tip: 'Elen kommer. Byn röstar på någon annan i nästa val.' },
      { text: 'FLYTTA PROJEKTET UT TILL HAVS', cost: { money: 700 }, perm: { factory: 1 }, temp: { approval: 2 }, tip: 'Dyrare att bygga. Fiskarna har inga överklaganden.' },
      { text: 'LÅT BYN BESTÄMMA', temp: { approval: 2, gdp: -1 }, tip: 'Byn säger nej. Elen får komma från något annat ställe.' },
    ],
  },

  // ===== DET DIGITALA LIVET =====
  {
    id: 'sml_di_gissla', icon: '\u{1F512}', weight: 2, cooldown: 1200,
    title: 'GISSLANPROGRAMMET',
    text: 'I natt låstes alla datorer i sjukvårdsregionen runt {stad}. På skärmarna står ett krav: en stor summa i kryptovaluta, annars publiceras patientjournalerna. Sjukhusen har gått över till papper och penna, operationer skjuts upp och ambulanserna kör på minnet. IT-avdelningen tror att säkerhetskopiorna kanske fungerar.',
    when: (c) => c.day > 80 && (c.ind.internet ?? 50) > 75 && (c.ind.cybercrime ?? 150) > 200 && c.res('computing') < 5 && c.st.safety < 20,
    choices: [
      { text: 'BETALA LÖSENSUMMAN I TYSTHET', cost: { money: 400 }, next: ['sml_di_lacka', null],
        risk: { chance: 0.5,
          win: { text: 'Nycklarna fungerar. Systemen är uppe igen efter två dygn.', temp: { welfare: 1 } },
          lose: { text: 'Pengarna försvann, och journalerna läcker ändå.', temp: { approval: -5 }, ind: { trustgov: -4 } } } },
      { text: 'ÅTERSTÄLL FRÅN SÄKERHETSKOPIORNA', cost: { money: 300, rp: 10 }, temp: { welfare: -2 }, next: ['sml_di_lacka', 'sml_di_cyber', null], tip: 'En vecka med papper och penna. Sedan är det mesta tillbaka.' },
      { text: 'VÄGRA BETALA OCH BYGG OM ALLT', cost: { money: 700 }, temp: { welfare: -3 }, next: ['sml_di_cyber', 'sml_di_lacka'], tip: 'Dyrt och långsamt. Men nästa gång finns det ingen dörr på glänt.' },
      { text: 'VÄNTA OCH SE', temp: { welfare: -4, approval: -2 }, next: ['sml_di_lacka', 'sml_di_lacka', 'sml_di_cyber'], tip: 'Hackarna väntar inte. De har en deadline.' },
    ],
  },
  {
    id: 'sml_di_lacka', icon: '\u{1F4C2}', chain: true,
    title: 'PATIENTJOURNALERNA PÅ NÄTET',
    text: 'Hackarna har lagt ut tiotusentals patientjournaler på nätet. Nu får människor i {stad} mejl där bedragare hotar att berätta om deras sjukdomar för arbetsgivare och grannar om de inte betalar. Dataskyddsmyndigheten har öppnat en granskning, och regionen har satt upp en stödlinje som inte hinner svara.',
    choices: [
      { text: 'STÖD OCH SKADESTÅND TILL DE DRABBADE', cost: { money: 600 }, temp: { approval: 2, welfare: 1 }, ind: { trustgov: 2 }, tip: 'Pengar lagar inte en läckt journal. Men det visar att någon bryr sig.' },
      { text: 'JAKTEN PÅ HACKARNA FÅR HÖGSTA PRIORITET', cost: { money: 200, rp: 20 }, temp: { safety: 2 }, rel: 1, tip: 'Spåren leder utomlands. Det gör de alltid.' },
      { text: 'REGIONEN FÅR TA ANSVARET', temp: { approval: -4 }, ind: { trustgov: -5 }, tip: 'Regionen har inga pengar. Staten har inget ansvar. Patienterna har ingen hjälp.' },
    ],
  },
  {
    id: 'sml_di_cyber', icon: '\u{1F6E1}\u{FE0F}', chain: true,
    title: 'DEN NYA CYBERFÖRSVARSCENTRALEN',
    text: 'Efter attacken byggde landet en cyberförsvarscentral där experter från polisen, försvaret och näringslivet sitter i samma rum. Ett år senare har den stoppat tre stora attacker innan de hann göra skada. Centralen har anställt unga hackare som tidigare fanns i polisens register, och flera säger att det är första jobbet de är stolta över.',
    choices: [
      { text: 'GE CENTRALEN MER PENGAR', cost: { money: 400 }, perm: { safety: 1, research: 1 }, tip: 'Den bästa attacken är den som aldrig syns i tidningen.' },
      { text: 'DELA ERFARENHETERNA MED GRANNLÄNDERNA', cost: { pp: 5 }, rel: 5, temp: { research: 1 }, tip: 'Hackare bryr sig inte om gränser. Det borde försvararna inte heller göra.' },
      { text: 'NÖJ DIG MED ATT DET FUNGERAR', temp: { stability: 2, safety: 1 }, tip: 'Tyst och effektivt. Ingen vet hur nära det var.' },
    ],
  },
  {
    id: 'sml_di_bedragare', icon: '\u{1F4DE}', weight: 2, cooldown: 900,
    title: 'BEDRAGARNA RINGER MORMOR',
    text: 'Telefonbedrägerierna har blivit en folksjukdom. En vänlig röst som säger sig vara från banken lurar äldre att legitimera sig i mobilen, och på tio minuter är sparpengarna borta. En 84-årig man i {stad} förlorade allt han sparat till barnbarnen. Bankerna säger att kunden själv har godkänt överföringen.',
    when: (c) => c.day > 60 && (c.ind.cybercrime ?? 150) > 300 && (c.ind.old ?? 10) > 12,
    choices: [
      { text: 'BANKERNA MÅSTE ERSÄTTA DE LURADE', cost: { pp: 15 }, law: ['consumer_protection', 'ombudsman'], temp: { approval: 3, gdp: -1 }, tip: 'Plötsligt blir bankernas säkerhet mycket bättre. Konstigt.' },
      { text: 'FÖRSTÄRK POLISENS BEDRÄGERIENHET', cost: { money: 400 }, temp: { safety: 2 }, next: ['sml_di_liga', null], tip: 'Utredarna följer pengarna. De går ofta långt.' },
      { text: 'INFORMATIONSKAMPANJ TILL ALLA ÖVER 65', cost: { money: 150 }, temp: { approval: 1 }, next: ['sml_di_liga', null], tip: 'Banken ringer aldrig och ber om koder. Säg det tio gånger.' },
      { text: 'MAN SKA ALDRIG LÄMNA UT SINA KODER', temp: { approval: -3 }, ind: { trustgov: -2 }, tip: 'Det visste han. Rösten var bara så vänlig.' },
    ],
  },
  {
    id: 'sml_di_liga', icon: '\u{1F575}\u{FE0F}', chain: true,
    title: 'BEDRAGARLIGAN I {LAND}',
    text: 'Polisen har spårat samtalen till ett callcenter i {land}, där hundra unga personer sitter i skift och ringer äldre i hela Europa. Cheferna kör dyra bilar och syns på sociala medier. För att gripa dem krävs ett samarbete med polisen där, och ett sådant samarbete har aldrig prövats förut.',
    choices: [
      { text: 'GEMENSAM UTREDNING MED POLISEN DÄR', cost: { pp: 15 }, rel: 3,
        risk: { chance: 0.6,
          win: { text: 'Tillslaget lyckas. Femtio gripna och servrarna beslagtagna.', temp: { safety: 3, approval: 3 } },
          lose: { text: 'Någon varnade ligan. Callcentret är tomt när polisen kommer.', temp: { approval: -2 } } } },
      { text: 'SPÄRRA SAMTAL FRÅN UTLANDET TILL ÄLDRES TELEFONER', cost: { money: 200 }, temp: { safety: 2, freedom: -1 }, tip: 'Mormor slipper bedragarna. Och kusinen i Australien.' },
      { text: 'LÅT INTERPOL SKÖTA DET', rel: 1, temp: { approval: -2 }, tip: 'Interpol har en lång lista. Ni hamnar någonstans i mitten.' },
    ],
  },
  {
    id: 'sml_di_bredband', icon: '\u{1F4E1}', weight: 2, cooldown: 900,
    title: 'BYN UTAN BREDBAND',
    text: 'I byn utanför {stad} går internet så långsamt att barnen åker till bensinmacken för att göra läxorna på dess trådlösa nät. Den lokala snickarfirman kan inte skicka offerter, och två familjer som ville flytta dit från storstaden valde en annan by. Teleoperatörerna säger att det inte lönar sig att gräva fiber för så få kunder.',
    when: (c) => c.day > 60 && (c.ind.broadband ?? 20) < 15 && (c.ind.internet ?? 50) > 50 && (c.ind.ruralpop ?? 0) / Math.max(1, c.ind.pop ?? 1) > 0.2,
    choices: [
      { text: 'STATLIGT STÖD TILL FIBER PÅ LANDSBYGDEN', cost: { money: 700 }, perm: { qol: 1 }, temp: { gdp: 1, approval: 2 }, tip: 'Ett dike genom hela landet. Snickarfirman skickar offerter igen.' },
      { text: 'BIDRAG TILL BYAR SOM GRÄVER SJÄLVA', cost: { money: 250 }, temp: { approval: 3, qol: 1 }, tip: 'Byborna gräver på helgerna. Det blir en fest varje gång en fastighet kopplas in.' },
      { text: 'SATELLITINTERNET TILL ALLA SOM BEHÖVER', cost: { money: 400, rp: 10 }, temp: { qol: 2, approval: 1 }, tip: 'En parabol på taket och internet som fungerar, utom när det snöar.' },
      { text: 'OPERATÖRERNA VET BÄST', temp: { approval: -3 }, ind: { happiness: -0.05 }, tip: 'Operatörerna vet att det inte lönar sig. Det är just det som är problemet.' },
    ],
  },
  {
    id: 'sml_di_kontanter', icon: '\u{1FA99}', weight: 2, cooldown: 1000,
    title: 'BANKKONTORET SOM STÄNGDE',
    text: 'Det sista bankkontoret i {stad} har stängt, och de flesta butiker tar inte längre emot kontanter. För Stig, 88 år, som aldrig har haft en smart telefon, har det blivit svårt att betala för sig. Han måste be grannen om hjälp för att köpa en bussbiljett. Pensionärsförbundet kräver rätt att betala med kontanter.',
    when: (c) => c.day > 60 && (c.is('cash', 'cardfirst', 'cbdc', 'tracked', 'limits') || (c.ind.bankbranch ?? 15) < 6) && (c.ind.old ?? 10) > 12 && (c.ind.internet ?? 50) > 70,
    choices: [
      { text: 'LAG OM RÄTT ATT BETALA KONTANT', cost: { pp: 10 }, law: ['cash', 'cashlaw'], temp: { approval: 3, gdp: -1 }, tip: 'Butikerna måste ha en kassa öppen. Stig köper sin biljett själv.' },
      { text: 'SERVICEPUNKTER MED KASSA I VARJE KOMMUN', cost: { money: 300 }, temp: { approval: 2, welfare: 1 }, tip: 'Ett ställe där man kan sätta in och ta ut pengar och få hjälp med mobilen.' },
      { text: 'FRAMTIDEN ÄR DIGITAL', temp: { approval: -2, gdp: 1 }, ind: { happiness: -0.05 }, tip: 'Den är det. Stig är inte med på den.' },
    ],
  },
];
