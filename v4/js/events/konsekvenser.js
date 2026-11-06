// IMPERIUM V5.16 — HÄNDELSER: KONSEKVENSER.
// Långa följdberättelser. Varje berättelse börjar i något verkligt — en lag du ändrat,
// ett underskott, en snabb invandring, en demokrati som glider — och förgrenar sig
// sedan över spelåren, så att det du gör i dag kommer tillbaka långt senare.
// Varje berättelse har en starthändelse (med when) och 3–6 kedjehändelser
// (chain: true) som bara nås via next. Olika val leder till olika fortsättningar,
// och next: ['a', 'b', null] gör att man aldrig riktigt vet vad som kommer.
// Kedjehändelserna ärver lagen ({lag}) och platserna ({stad}, {land} …) från starten.
// Varje berättelse har minst en förödande väg och minst en väg som slutar väl.
export const EVENTS = [

  // ===== NEDSKÄRNINGEN SOM VÄXTE =====
  // Vården skärs ner → sjuksköterskorna slutar → akuten stänger → valet handlar om vården.
  {
    id: 'kon_snitt', icon: '\u{1F3E5}', weight: 2, cooldown: 1200, kind: 'valfard', react: true,
    title: 'SJUKSKÖTERSKORNA I {STAD} SÄGER UPP SIG',
    text: 'Några veckor efter ändringen av {lag} lämnade fyrtio sjuksköterskor på länssjukhuset i {stad} in sina uppsägningar samma morgon. De har räknat på de nya schemana och säger att det inte går att jobba så. Avdelningschefen har redan stängt tolv vårdplatser, och patienterna ligger i korridoren.',
    when: (c) => c.cut('healthcare', 'healthcare_quality', 'welfare') && c.grievOf('valfard') > 8 && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -18, temp: { approval: 2, polpower: -3 }, next: ['kon_snitt_tack', null], tip: 'Att backa kostar prestige. Att stå kvar kostar sjuksköterskor.' },
      { text: 'HYR IN SJUKSKÖTERSKOR FRÅN BEMANNINGSBOLAG', cost: { money: 350 }, temp: { welfare: 2 }, griev: -4, next: ['kon_snitt_bemanning', 'kon_snitt_kris'], tip: 'Sängarna blir bemannade. Till tre gånger priset.' },
      { text: 'STÅ FAST — DET FINNS ANDRA SOM VILL HA JOBBEN', temp: { approval: -3, qol: -2 }, griev: 6, ind: { trustgov: -3 }, next: ['kon_snitt_kris', 'kon_snitt_strejk'], tip: 'Det finns det. I andra länder.' },
    ],
  },
  {
    id: 'kon_snitt_bemanning', icon: '\u{1F9FE}', chain: true, kind: 'valfard',
    title: 'BEMANNINGSNOTAN',
    text: 'Ett halvår senare har regionen betalat mer för hyrsjuksköterskor än vad hela besparingen på {lag} skulle ge. Flera av dem som sa upp sig står nu på samma avdelning i {stad} igen, via ett bemanningsbolag och för dubbla lönen. Revisorernas rapport har ovanligt många utropstecken.',
    choices: [
      { text: 'ANSTÄLL DEM IGEN — MED HÖGRE LÖN', cost: { money: 500 }, perm: { welfare: 2 }, temp: { approval: 3 }, griev: -10, next: ['kon_snitt_tack', null], tip: 'Dyrare än före nedskärningen. Billigare än bemanningsbolagen.' },
      { text: 'SÄTT TAK FÖR BEMANNINGSPRISERNA', cost: { pp: 15 },
        risk: { chance: 0.55,
          win: { text: 'Bolagen sänker priserna och de flesta sköterskorna blir kvar.', temp: { welfare: 2, income: 2 } },
          lose: { text: 'Bolagen skickar sina sköterskor utomlands i stället. Fler avdelningar stänger.', temp: { welfare: -3, approval: -3 }, griev: 6 } } },
      { text: 'TA PENGARNA FRÅN ÄLDREOMSORGEN', temp: { welfare: -2, qol: -2 }, griev: 6, next: ['kon_snitt_kris', null], tip: 'Hålet flyttar. Det försvinner inte.' },
    ],
  },
  {
    id: 'kon_snitt_kris', icon: '\u{1F691}', chain: true, kind: 'valfard',
    title: 'AKUTEN I {STAD} STÄNGER NATTETID',
    text: 'Ett halvår efter beslutet om {lag} räcker personalen inte längre till. Akutmottagningen i {stad} håller stängt mellan tio på kvällen och sju på morgonen, och ambulanserna får köra nittio minuter till närmaste öppna sjukhus. Väntetiden till en specialist har nästan fördubblats sedan i våras.',
    choices: [
      { text: 'SKICKA ARMÉNS FÄLTSJUKVÅRD', cost: { money: 300, man: 3 }, temp: { welfare: 3, readiness: -3, approval: 2 }, next: ['kon_snitt_val', null], tip: 'Tältsjukhus på parkeringen. Det fungerar, och det syns.' },
      { text: 'ÅTERSTÄLL {LAG} OCH ÖPPNA AKUTEN', cost: { money: 250, pp: 25 }, undo: true, griev: -15, temp: { stability: 2 }, ind: { trustgov: 2 }, next: ['kon_snitt_tack', null], tip: 'Sent, men inte för sent.' },
      { text: 'HÄNVISA TILL SJUKHUSET I {HUVUDSTAD}', temp: { qol: -3, approval: -4 }, griev: 8, ind: { trustgov: -4 }, next: ['kon_snitt_ambulans', 'kon_snitt_val'], tip: 'Det är bara två timmar bort. Med bil. Om man har bil.' },
    ],
  },
  {
    id: 'kon_snitt_strejk', icon: '\u{1FA7A}', chain: true, kind: 'valfard',
    title: 'SJUKSKÖTERSKORNA VARSLAR OM STREJK',
    text: 'Sjuksköterskornas förbund har varslat om strejk på alla landets sjukhus från nästa måndag. Kraven är två: ta tillbaka ändringen av {lag} och höj lönerna med åtta procent. Sju av tio väljare står på sjuksköterskornas sida i mätningarna, även många av dem som röstade på dig.',
    choices: [
      { text: 'GE DEM LÖNEHÖJNINGEN', cost: { money: 600 }, perm: { welfare: 2 }, temp: { approval: 4 }, griev: -12, ind: { strikes: -30 }, next: ['kon_snitt_tack'], tip: 'Dyrt. Men akuten är öppen i natt.' },
      { text: 'FÖRBJUD STREJKEN SOM SAMHÄLLSFARLIG', cost: { pp: 25 }, law: ['unions', 'weak'], temp: { freedom: -4, unrest: 8, approval: -6 }, griev: 10, ind: { trustgov: -6, protests: 40 }, next: ['kon_snitt_val'], tip: 'Lagligt. Och ungefär lika populärt som en tandläkare utan bedövning.' },
      { text: 'LÅT DEM STREJKA', temp: { welfare: -5, unrest: 5, qol: -3 }, griev: 6, ind: { strikes: 60 }, next: ['kon_snitt_kris', 'kon_snitt_ambulans'], tip: 'Akutfallen tas om hand. Allt annat får vänta.' },
    ],
  },
  {
    id: 'kon_snitt_ambulans', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'valfard',
    title: 'NITTIO MINUTER I AMBULANSEN',
    text: 'En sextioårig busschaufför från {stad} dog i ambulansen på väg till ett sjukhus långt bort, sedan den närmaste akuten stängt för natten. Hans dotter läste ett brev i radio i morse. I kväll står tiotusentals människor med tända ljus utanför regeringskansliet, och tre av dina egna ledamöter kräver att vårdministern avgår.',
    choices: [
      { text: 'VÅRDMINISTERN FÅR AVGÅ', cost: { pp: 15 }, temp: { approval: 3, stability: -3 }, griev: -8, next: ['kon_snitt_val'], tip: 'Någon måste bära ansvaret. Helst inte du.' },
      { text: 'ÅTERSTÄLL {LAG} OCH ÖPPNA ALLA AKUTER', cost: { money: 400, pp: 20 }, undo: true, griev: -20, temp: { approval: 2, welfare: 3 }, next: ['kon_snitt_tack', 'kon_snitt_val'], tip: 'Rätt beslut. Ett halvår för sent.' },
      { text: 'KALLA DET EN TRAGISK OLYCKSHÄNDELSE', temp: { approval: -8, unrest: 8 }, griev: 14, mod: 'martyr', ind: { trustgov: -8, protests: 60 }, next: ['kon_snitt_val'], tip: 'Ingen olyckshändelse har någonsin fått så många tända ljus.' },
    ],
  },
  {
    id: 'kon_snitt_val', icon: '\u{1F5F3}\u{FE0F}', chain: true, kind: 'valfard',
    title: 'VALET SOM HANDLADE OM VÅRDEN',
    text: 'Nästan två år efter att {lag} ändrades går landet till val, och det finns bara en fråga. Oppositionen turnerar med en buss målad som en ambulans, och varje debatt börjar med väntetiderna i {stad}. Dina strateger säger att du kan vinna, men bara om väljarna tror att du har förstått.',
    choices: [
      { text: 'BE OM URSÄKT I TV OCH LOVA EN VÅRDMILJARD', cost: { money: 800 },
        risk: { chance: 0.6,
          win: { text: 'Ursäkten tas emot. Du vinner valet med knapp marginal.', temp: { approval: 8, stability: 4 }, griev: -15 },
          lose: { text: 'Ingen tror på löftet. Valet blir ett jordskred åt fel håll.', temp: { approval: -6, stability: -5, polpower: -8 }, ind: { trustgov: -5 } } } },
      { text: 'KÖR PÅ EKONOMIN OCH HOPPAS',
        risk: { chance: 0.35,
          win: { text: 'Väljarna röstar med plånboken. Du sitter kvar, med minsta möjliga marginal.', temp: { stability: 3, polpower: 3 } },
          lose: { text: 'Valnatten blir lång och mörk. Du förlorar din egen majoritet.', temp: { approval: -8, polpower: -10, stability: -4 }, griev: 5 } } },
      { text: 'GÖR UPP OM VÅRDEN MED OPPOSITIONEN', cost: { pp: 30 }, perm: { welfare: 3 }, temp: { stability: 5, polpower: -5 }, griev: -12, ind: { trustgov: 3 }, tip: 'Ingen vinner valet på vården. Men vården vinner.' },
    ],
  },
  {
    id: 'kon_snitt_tack', icon: '\u{1F490}', chain: true, kind: 'valfard',
    title: 'DE KOM TILLBAKA',
    text: 'Ett år efter krisen på sjukhuset i {stad} har trettiotvå av de fyrtio sjuksköterskorna kommit tillbaka. Alla vårdplatser är öppna igen och väntetiderna är nere på samma nivå som före bråket om {lag}. I går fick avdelningen en tårta från pensionärsföreningen, med texten "TACK FÖR ATT NI STANNADE".',
    choices: [
      { text: 'BJUD IN DEM TILL REGERINGSKANSLIET', cost: { money: 50 }, temp: { approval: 4, qol: 2 }, griev: -8, tip: 'Tårta i kanslihuset, för en gångs skull av goda skäl.' },
      { text: 'GÖR {STAD} TILL FÖREBILD FÖR HELA LANDET', cost: { money: 400 }, perm: { welfare: 3, qol: 1 }, griev: -10, ind: { trustgov: 3 }, tip: 'Det som fungerar ska man göra mer av.' },
      { text: 'LÅT DET VARA EN TYST SEGER', temp: { stability: 3 }, griev: -5, tip: 'Den bästa vårdpolitiken märks inte alls.' },
    ],
  },

  // ===== BOSTADSBUBBLAN =====
  // Priserna rusar → reglera, bygga eller låta det vara → mjuklandning eller krasch.
  {
    id: 'kon_bubbla', icon: '\u{1F3E0}', weight: 2, cooldown: 1400, kind: 'ekonomi',
    title: 'TVÅAN SOM KOSTADE TIO ÅRSLÖNER',
    text: 'En tvåa i {huvudstad} såldes i helgen för tolv procent över utropspriset, efter budstrid mellan nitton spekulanter. Priserna har stigit varje månad i tre år och hushållens lån är nu långt större än deras inkomster. Bankerna lånar ut som aldrig förr, och centralbankschefen har börjat använda ordet "obalanser".',
    when: (c) => c.day > 120 && (((c.ind.houseprice ?? 8) > 12 && (c.ind.hhdebt ?? 60) > 90) || c.trend('houseprice') > 0.6),
    choices: [
      { text: 'INFÖR BOLÅNETAK OCH AMORTERINGSKRAV', cost: { pp: 20 }, law: ['banking', 'strict'], temp: { gdp: -2 }, ind: { houseprice: -4 }, next: ['kon_bubbla_mjuk', 'kon_bubbla_unga'], tip: 'Festen dämpas medan den fortfarande är trevlig.' },
      { text: 'BYGG BORT BOSTADSBRISTEN', cost: { money: 700 }, law: ['urban_planning', 'upzoning'], perm: { qol: 1 }, next: ['kon_bubbla_kranar', 'kon_bubbla_mjuk', 'kon_bubbla_spricker'], tip: 'Hus tar tre år att bygga. Bubblor tar tre veckor att spricka.' },
      { text: 'LÅT MARKNADEN SKÖTA SIG', temp: { gdp: 3, approval: 2 }, ind: { houseprice: 6 }, next: ['kon_bubbla_spricker', 'kon_bubbla_spricker', null], tip: 'Alla som äger en bostad känner sig rika. Tills vidare.' },
    ],
  },
  {
    id: 'kon_bubbla_spricker', icon: '\u{1F4C9}', chain: true, kind: 'ekonomi',
    title: 'BUBBLAN HAR SPRUCKIT',
    text: 'Det började med att en stor byggfirma i {stad} inte kunde betala sina lån. Ett halvår senare har bostadspriserna fallit med en femtedel, tusentals hushåll har lån som är större än vad bostaden är värd och två banker har slutat låna ut. Byggkranarna står stilla och snickarna står i kö på arbetsförmedlingen.',
    choices: [
      { text: 'RÄDDA BANKERNA MED SKATTEPENGAR', cost: { money: 1500 }, temp: { stability: 4, approval: -5 }, ind: { houseprice: -8, stockcap: 6 }, next: ['kon_bubbla_notan'], tip: 'Systemet räddas. Bankdirektörerna också.' },
      { text: 'STÖD HUSHÅLLEN I STÄLLET', cost: { money: 900 }, temp: { approval: 4, qol: 2 }, ind: { houseprice: -10, homeless: -8 }, next: ['kon_bubbla_notan', 'kon_bubbla_vinter'], tip: 'Folk får bo kvar. Bankerna får vackla.' },
      { text: 'LÅT DEM SOM CHANSADE TA SMÄLLEN', temp: { gdp: -6, unrest: 6, approval: -4 }, mod: 'downturn', ind: { unemp: 1.2, houseprice: -15, homeless: 15 }, next: ['kon_bubbla_vinter'], tip: 'Rättvist, i teorin. Smärtsamt, i praktiken.' },
    ],
  },
  {
    id: 'kon_bubbla_mjuk', icon: '\u{1F6EC}', chain: true, kind: 'ekonomi',
    title: 'MJUKLANDNINGEN',
    text: 'Ett år efter de nya bolånereglerna har bostadspriserna slutat stiga utan att rasa. De sjunker med en procent i kvartalet, precis som ekonomerna hoppades men ingen trodde. Internationella valutafonden kallar landet "ett läroboksexempel", och mäklarna i {huvudstad} klagar på att de måste börja jobba igen.',
    choices: [
      { text: 'HÅLL KURSEN', temp: { stability: 4, gdp: 1 }, perm: { stability: 1 }, ind: { houseprice: -3 }, tip: 'Tråkigt är det nya spännande.' },
      { text: 'LÄTTA PÅ REGLERNA FÖR FÖRSTAGÅNGSKÖPARE', cost: { pp: 10 }, temp: { approval: 4, qol: 2 }, ind: { houseprice: 2 }, tip: 'Ungdomarna får en chans. Bubblan får en liten puff.' },
      { text: 'TA ÄRAN I EN STOR INTERVJU', temp: { approval: 3, polpower: 3 }, rel: 3, tip: 'Valutafonden citeras på förstasidan. Du också.' },
    ],
  },
  {
    id: 'kon_bubbla_unga', icon: '\u{1F511}', chain: true, kind: 'ekonomi',
    title: 'TRETTIO ÅR OCH BOR HOS MAMMA',
    text: 'Bolånetaket dämpade priserna, men det stängde också dörren för en hel generation. En sjuksköterska med fast jobb behöver nu spara i elva år till kontantinsatsen. Ungdomsförbunden har startat kampanjen "Vi bor i pojkrummet", och på nätet delas bilder på trettioåringar som sover under affischer från tonåren.',
    choices: [
      { text: 'STATLIGA STARTLÅN FÖR UNGA', cost: { money: 500 }, temp: { approval: 4, qol: 2 }, ind: { houseprice: 3 }, next: ['kon_bubbla_mjuk', null], tip: 'Staten tar risken som bankerna inte vill ta.' },
      { text: 'BYGG HYRESRÄTTER I STÄLLET', cost: { money: 800 }, law: ['housing', 'public'], perm: { qol: 2 }, next: ['kon_bubbla_kranar', null], tip: 'Det tar tre år. Pojkrummet får vänta lite till.' },
      { text: 'REGLERNA STÅR SIG', temp: { approval: -4, stability: 2 }, ind: { trustgov: -3 }, tip: 'Rätt i kalkylen. Fel i köket hemma hos mamma.' },
    ],
  },
  {
    id: 'kon_bubbla_kranar', icon: '\u{1F3D7}\u{FE0F}', chain: true, kind: 'ekonomi',
    title: 'KRANARNA ÖVER {STAD}',
    text: 'Två år efter att byggreglerna luckrades upp står det fyrtio byggkranar över {stad}. Tolv tusen nya lägenheter blir klara i år, kön till hyresrätterna har halverats och priserna har planat ut. Grannarna klagar på bullret och en förening protesterar mot att parken krymper, men i bostadskön jublar man.',
    choices: [
      { text: 'FORTSÄTT BYGGA — I HELA LANDET', cost: { money: 600 }, perm: { qol: 2, gdp: 1 }, ind: { houseprice: -5, homeless: -10 }, mod: 'boom', tip: 'Betong, kranar och fler hem.' },
      { text: 'SPARA PARKEN OCH BYGG HÖGRE', cost: { pp: 10 }, temp: { qol: 3, approval: 3 }, ind: { houseprice: -3 }, tip: 'Alla får något. Utsikten blir annorlunda.' },
      { text: 'SÄNK TAKTEN NU NÄR DET HAR VÄNT', temp: { stability: 2, approval: 1 }, ind: { houseprice: -2 }, tip: 'Grannarna får sova. Kön börjar växa igen.' },
    ],
  },
  {
    id: 'kon_bubbla_notan', icon: '\u{1F4B8}', chain: true, kind: 'ekonomi',
    title: 'BONUSARNA EFTER RÄDDNINGEN',
    text: 'Ett och ett halvt år efter kraschen går bankerna med vinst igen. I dag kom årsredovisningarna: direktörerna på de räddade bankerna delar på bonusar som motsvarar vad tretusen undersköterskor tjänar på ett år. Utanför huvudkontoren i {huvudstad} står demonstranter med skyltar som inte går att citera i tidningen.',
    choices: [
      { text: 'BANKSKATT TILLS SKATTEBETALARNA FÅTT TILLBAKA ALLT', cost: { pp: 20 }, res: { money: 500 }, temp: { approval: 6 }, ind: { stockcap: -5 }, tip: 'Pengarna kommer hem. Bankerna hotar att flytta.' },
      { text: 'FÖRBJUD BONUSAR I RÄDDADE BANKER', cost: { pp: 10 }, temp: { approval: 4 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, tip: 'Direktörerna får klara sig på sina löner. De överlever.' },
      { text: 'MARKNADEN ÄR MARKNADEN', temp: { approval: -6, unrest: 4 }, griev: 6, ind: { trustgov: -5, protests: 30 }, tip: 'Bankerna tackar. Ingen annan gör det.' },
    ],
  },
  {
    id: 'kon_bubbla_vinter', icon: '\u{2744}\u{FE0F}', chain: true, kind: 'ekonomi',
    title: 'DEN LÅNGA VINTERN EFTER KRASCHEN',
    text: 'Ett år efter att bubblan sprack har vart tionde byggjobb försvunnit och konsumtionen fallit tre kvartal i rad. Familjer som köpte på toppen säljer med förlust och flyttar in hos släktingar. Härbärgena i {stad} är fulla för första gången på tjugo år, och kronofogden har fått anställa fler handläggare.',
    choices: [
      { text: 'STORT STIMULANSPAKET', cost: { money: 1200 }, temp: { gdp: 5, approval: 4 }, unmod: 'downturn', ind: { unemp: -0.6, homeless: -10 }, tip: 'Kassan blöder. Byggkranarna börjar röra sig.' },
      { text: 'SKULDSANERING FÖR DE HÅRDAST DRABBADE', cost: { money: 500, pp: 10 }, temp: { qol: 3, approval: 3 }, perm: { welfare: 1 }, ind: { homeless: -15 }, tip: 'En nystart för dem som köpte i fel år.' },
      { text: 'VÄNTA PÅ ATT DET VÄNDER', temp: { gdp: -3, unrest: 5, approval: -5 }, griev: 8, ind: { unemp: 0.5, homeless: 10 }, tip: 'Det vänder alltid. Frågan är bara när.' },
    ],
  },

  // ===== DEN TOMMA STATSKASSAN =====
  // Underskott → sena löner → strejk eller dyrare lån → valutafonden eller statsbankrutt.
  {
    id: 'kon_kassa', icon: '\u{1F4B0}', weight: 3, cooldown: 1000, kind: 'underskott', react: true,
    title: 'LÖNERNA KOM TRE DAGAR FÖR SENT',
    text: 'Statskassan är tom, och i går fick landets lärare, poliser och busschaufförer sina löner tre dagar för sent. Finansdepartementet förklarar att pengarna "är på väg" från ett kortfristigt banklån. På lärarrummen i {stad} pratar man inte om något annat, och bankernas analytiker har börjat skriva långa rapporter om landets skulder.',
    when: (c) => c.deficit && c.day > 40,
    choices: [
      { text: 'SPARPAKET — SKÄR I ALLA DEPARTEMENT', cost: { pp: 20 }, perm: { welfare: -2 }, temp: { income: 6, approval: -4 }, griev: -6, next: ['kon_kassa_balans', 'kon_kassa_strejk'], tip: 'Ordning i kassan. Oordning på gatan.' },
      { text: 'HÖJ SKATTERNA TILLFÄLLIGT', cost: { pp: 15 }, temp: { income: 8, approval: -5, gdp: -2 }, griev: -4, next: ['kon_kassa_balans', null], tip: 'Inget är så permanent som en tillfällig skatt.' },
      { text: 'LÅNA MER — DET LÖSER SIG', res: { money: 500 }, temp: { stability: 2 }, griev: 4, ind: { trustgov: -2 }, next: ['kon_kassa_ranta', 'kon_kassa_ranta', null], tip: 'Det löser sig alltid. Fram till dagen då det inte gör det.' },
    ],
  },
  {
    id: 'kon_kassa_strejk', icon: '\u{1F68C}', chain: true, kind: 'underskott',
    title: 'BUSSARNA STÅR STILLA I {STAD}',
    text: 'Fjärde månaden med sena löner och nu har tålamodet tagit slut. Busschaufförerna i {stad} vägrar köra innan lönen är på kontot, och lärarna på tre gymnasieskolor har följt efter. Facken kallar det inte strejk utan "att vänta på betalning", vilket gör det lagligt. Föräldrar kör barnen till skolan och trafiken står still.',
    choices: [
      { text: 'BETALA LÖNERNA FÖRST, ALLT ANNAT SEN', cost: { money: 400 }, temp: { unrest: -4, approval: 3 }, griev: -12, ind: { strikes: -20 }, next: ['kon_kassa_balans', 'kon_kassa_ranta'], tip: 'Lönerna betalas. Någon annan räkning får vänta.' },
      { text: 'SÄLJ STATLIGA BOLAG FÖR ATT FÅ IN PENGAR', cost: { pp: 15 }, res: { money: 700 }, law: ['ownership', 'privatized'], perm: { income: -1 }, griev: -8, next: ['kon_kassa_balans', null], tip: 'Familjesilvret kan bara säljas en gång.' },
      { text: 'KALLA DET OLAGLIG STREJK', temp: { unrest: 7, approval: -5, freedom: -2 }, griev: 10, ind: { strikes: 70, trustgov: -5 }, next: ['kon_kassa_imf', 'kon_kassa_ranta'], tip: 'Juristerna håller inte med. Busschaufförerna inte heller.' },
    ],
  },
  {
    id: 'kon_kassa_ranta', icon: '\u{1F4C8}', chain: true, kind: 'underskott',
    title: 'KREDITBETYGET SÄNKS',
    text: 'Ett halvår efter att statskassan gick tom har kreditvärderingsinstitutet sänkt landets betyg ett steg och skrivit "negativa utsikter". Räntan på statens tioåriga lån har stigit med två procentenheter på en månad. Varje ny krona staten lånar kostar nu mer, och en allt större del av budgeten går till räntor i stället för skolor.',
    choices: [
      { text: 'SKULDBROMS I GRUNDLAGEN', cost: { pp: 30 }, law: ['debt_brake', 'brake'], temp: { stability: 3, approval: -3 }, perm: { income: 2 }, griev: -6, next: ['kon_kassa_balans', 'kon_kassa_strejk'], tip: 'Marknaden lugnar sig. Politikerna får mindre att leka med.' },
      { text: 'BJUD IN INSTITUTET OCH FÖRKLARA PLANEN', cost: { money: 100 },
        risk: { chance: 0.4,
          win: { text: 'De är imponerade av planen. Utsikterna blir stabila igen.', temp: { stability: 3 }, griev: -5 },
          lose: { text: 'De lyssnar artigt och sänker betyget ett steg till.', temp: { income: -4, stability: -3 }, griev: 6 } } },
      { text: 'LÅNA ÄNDÅ — VI HAR INGET VAL', res: { money: 600 }, temp: { income: -3 }, griev: 4, ind: { trustgov: -3 }, next: ['kon_kassa_imf', 'kon_kassa_imf', 'kon_kassa_bankrutt'], tip: 'Det nya lånet betalar räntan på det gamla.' },
    ],
  },
  {
    id: 'kon_kassa_imf', icon: '\u{1F3E6}', chain: true, kind: 'underskott',
    title: 'VALUTAFONDEN STÅR I DÖRREN',
    text: 'Ett år efter de första sena lönerna kan staten inte längre låna på marknaden. En delegation från Internationella valutafonden har landat i {huvudstad} med ett erbjudande: ett stort nödlån, mot att pensionerna fryses, tusentals statsanställda sägs upp och subventionerna på bröd och bensin tas bort. De vill ha svar inom en vecka.',
    choices: [
      { text: 'SKRIV UNDER PROGRAMMET', res: { money: 1500 }, perm: { welfare: -3 }, temp: { approval: -8, unrest: 8, stability: 3 }, griev: -15, ind: { unemp: 0.8, protests: 50 }, next: ['kon_kassa_balans', null], tip: 'Kassan räddas. Gatorna fylls.' },
      { text: 'FÖRHANDLA OM VILLKOREN', cost: { pp: 25 }, next: ['kon_kassa_balans', 'kon_kassa_bankrutt'],
        risk: { chance: 0.5,
          win: { text: 'Fonden går med på mjukare villkor. Pensionerna klarar sig.', res: { money: 1000 }, perm: { welfare: -1 }, griev: -10 },
          lose: { text: 'Förhandlingarna kör fast. Fonden reser hem och marknaden får panik.', temp: { stability: -6, income: -5 }, griev: 10 } } },
      { text: 'SÄG NEJ — VI KLARAR OSS SJÄLVA', temp: { approval: 6, ideopower: 4, stability: -4 }, rel: -5, griev: 6, next: ['kon_kassa_bankrutt', 'kon_kassa_bankrutt', 'kon_kassa_balans'], tip: 'Stolt. Kanske dumdristigt.' },
    ],
  },
  {
    id: 'kon_kassa_bankrutt', icon: '\u{1F6A8}', chain: true, kind: 'underskott',
    title: 'STATEN STÄLLER IN BETALNINGARNA',
    text: 'Klockan sex i morse meddelade finansministern att staten inte kommer att betala räntan på sina lån den här månaden. Bankomaterna i {huvudstad} var tomma vid lunch, apoteken tar bara kontanter och utländska fordringsägare har anlitat advokater. Det här är dagen som alla ekonomer har varnat för i ett och ett halvt år.',
    choices: [
      { text: 'KRISREGERING MED OPPOSITIONEN', cost: { pp: 40 }, temp: { stability: 4, approval: 2, income: -4 }, mod: 'national_unity', griev: -10, ind: { trustgov: 3, gdppc: -4 }, tip: 'Alla i samma båt. Båten läcker.' },
      { text: 'FÖRHANDLA NER SKULDEN MED FORDRINGSÄGARNA', cost: { pp: 20 }, rel: -8, temp: { income: 4, stability: -3 }, griev: -6, ind: { gdppc: -5, stockcap: -20 }, next: ['kon_kassa_balans', null], tip: 'De får trettio öre per krona. De kommer att minnas det.' },
      { text: 'TRYCK PENGAR TILL LÖNERNA', law: ['monetary', 'printing'], temp: { income: 6, approval: 2 }, perm: { stability: -2 }, griev: -8, ind: { infl: 8, gdppc: -6 }, tip: 'Lönerna betalas. Med pengar som är värda allt mindre.' },
    ],
  },
  {
    id: 'kon_kassa_balans', icon: '\u{2696}\u{FE0F}', chain: true, kind: 'underskott',
    title: 'KASSAN ÄR I BALANS IGEN',
    text: 'Ett och ett halvt år efter krisen visar årsbokslutet ett litet överskott för första gången. Lönerna har kommit i tid tolv månader i rad, räntan på statens lån har sjunkit och kreditinstitutet har höjt utsikterna till "stabila". På lärarrummet i {stad} sitter lönebeskedet uppsatt på anslagstavlan, med en hjärtformad magnet.',
    choices: [
      { text: 'BYGG EN BUFFERT FÖR NÄSTA KRIS', perm: { stability: 2, income: 1 }, griev: -10, tip: 'Tråkigt. Klokt. Tråkigt klokt.' },
      { text: 'GE TILLBAKA LITE AV DET SOM SPARADES', cost: { money: 400 }, perm: { welfare: 2 }, temp: { approval: 6 }, griev: -12, ind: { trustgov: 4 }, tip: 'Folket bar krisen. Nu får de en del av belöningen.' },
      { text: 'SÄNK SKATTERNA INFÖR VALET', cost: { money: 300 }, temp: { approval: 8, income: -3 }, griev: -6, tip: 'Populärt. Nästa kris tackar för att den får börja i förtid.' },
    ],
  },

  // ===== INTEGRATIONENS ÅR =====
  // Invandringen rusar → mottagandet avgör → jobb och levande byar, eller utanförskap och oro.
  {
    id: 'kon_integ', icon: '\u{1F9F3}', weight: 2, cooldown: 1200, kind: 'migration', react: true,
    title: 'INTEGRATIONENS ÅR',
    text: 'Invandringen har aldrig gått så fort. I år har fler flyttat hit än under de fem föregående åren tillsammans, och mottagningen i {stad} har ställt fältsängar i idrottshallen. Kommunen har trehundra platser på språkkurserna och fyratusen som vill gå. Kommunalrådet ringer dig varje morgon klockan sju.',
    when: (c) => c.migRate > 1.4 && c.day > 60,
    choices: [
      { text: 'SATSA PÅ SPRÅK OCH JOBB FRÅN FÖRSTA DAGEN', cost: { money: 600 }, perm: { integration: 3 }, temp: { approval: -2 }, griev: -6, next: ['kon_integ_jobb', 'kon_integ_jobb', 'kon_integ_trangt'], tip: 'Dyrt i år. Billigare om tio.' },
      { text: 'FÖRDELA DE NYANLÄNDA ÖVER HELA LANDET', cost: { pp: 20 }, temp: { integration: 2, unrest: 2 }, griev: -3, next: ['kon_integ_bygd', 'kon_integ_trangt'], tip: 'Varje kommun tar sin del. Varje kommun protesterar.' },
      { text: 'LÅT KOMMUNERNA LÖSA DET', temp: { approval: 1, integration: -2 }, griev: 5, ind: { segreg: 2 }, next: ['kon_integ_forort', 'kon_integ_forort', 'kon_integ_trangt'], tip: 'De löser det. Där hyrorna är lägst.' },
      { text: 'STRAMA ÅT INVANDRINGEN', cost: { pp: 25 }, law: ['immigration', 'managed'], temp: { immigration: -6, approval: 3, freedom: -1 }, griev: -8, rel: -2, next: ['kon_integ_jobb', null], tip: 'Färre kommer. De som redan är här behöver fortfarande jobb.' },
    ],
  },
  {
    id: 'kon_integ_jobb', icon: '\u{1F68D}', chain: true, kind: 'migration',
    title: 'FÖRSTA KULLEN HAR FÅTT JOBB',
    text: 'Två år efter det stora året visar statistiken något som få vågade hoppas på: sex av tio av de nyanlända har ett arbete. Busstrafiken i {stad} har inga inställda turer längre, sedan tvåhundra nya förare tagit körkort, och äldreboendena har fått undersköterskor. Årets företagarpris i kommunen gick till en bagare som kom hit med en resväska.',
    choices: [
      { text: 'GÖR PROGRAMMET NATIONELLT', cost: { money: 500 }, perm: { integration: 3, gdp: 1 }, griev: -8, ind: { xenophobia: -2 }, tip: 'Det som fungerar i en stad kan fungera i alla.' },
      { text: 'SNABBARE VÄG TILL MEDBORGARSKAP FÖR DEM SOM JOBBAR', cost: { pp: 15 }, perm: { integration: 2 }, temp: { approval: -2, stability: 2 }, griev: -4, tip: 'Den som betalar skatt vill också få rösta.' },
      { text: 'BERÄTTA OM DET I ETT TAL TILL NATIONEN', temp: { approval: 3, unrest: -2 }, ind: { xenophobia: -2 }, griev: -5, tip: 'Goda nyheter blir sällan rubriker. Ibland måste man ropa.' },
    ],
  },
  {
    id: 'kon_integ_trangt', icon: '\u{1F3E2}', chain: true, kind: 'migration',
    title: 'TRE FAMILJER I EN TREA',
    text: 'Ett halvår efter rekordåret finns det inte en ledig lägenhet kvar i {stad}. Hyresvärdar hyr ut madrasser i källare, och socialtjänsten har hittat tre familjer som delar en trerumslägenhet. Barnen gör läxorna i trappuppgången. Både de nyanlända och de som bott där i fyrtio år är arga, men inte alltid på samma sak.',
    choices: [
      { text: 'BYGG BOSTÄDER I EN FART', cost: { money: 800 }, perm: { qol: 1, integration: 2 }, griev: -8, ind: { homeless: -10, segreg: -1 }, next: ['kon_integ_jobb', null], tip: 'Moduler nu, riktiga hus om tre år.' },
      { text: 'SLÅ TILL MOT SVARTA ANDRAHANDSKONTRAKT', cost: { pp: 10 }, temp: { safety: 3 }, perm: { corruption: -1 }, griev: -3, ind: { homeless: 8 }, next: ['kon_integ_forort', null], tip: 'Ockrarna försvinner. Madrasserna också. Folket finns kvar.' },
      { text: 'BOSTADSBRISTEN ÄR KOMMUNERNAS SAK', temp: { integration: -3, unrest: 4 }, griev: 7, ind: { segreg: 3, homeless: 12 }, next: ['kon_integ_forort', 'kon_integ_oro'], tip: 'Kommunerna tycker att den är statens. Alla har rätt, ingen bygger.' },
    ],
  },
  {
    id: 'kon_integ_bygd', icon: '\u{1F3EB}', chain: true, kind: 'migration',
    title: 'BYN SOM VAKNADE',
    text: 'Ett år efter att de nyanlända fördelades över landet har byskolan i en liten ort utanför {stad} fått tjugotre nya elever och slipper läggas ner. Lanthandeln har öppet på söndagar igen och fotbollslaget har ett juniorlag för första gången sedan åttiotalet. Den äldsta i byn, nittiotvå år, har börjat lära ut sin gamla surdegsbakning.',
    choices: [
      { text: 'STÖD FLER BYAR ATT GÖRA LIKADANT', cost: { money: 400 }, perm: { integration: 2, qol: 1 }, griev: -8, ind: { xenophobia: -2 }, tip: 'Landsbygden behövde folk. Folket behövde ett hem.' },
      { text: 'BYGG BUSSLINJE TILL JOBBEN I STADEN', cost: { money: 300 }, perm: { gdp: 1 }, temp: { approval: 3 }, griev: -4, tip: 'Den som har en buss kan stanna kvar på landet.' },
      { text: 'LÅT BYN BERÄTTA SIN HISTORIA I TV', temp: { approval: 3, integration: 2 }, griev: -5, tip: 'Surdegen blir landskänd. Surdegen och tjugotre nya elever.' },
    ],
  },
  {
    id: 'kon_integ_forort', icon: '\u{1F3D9}\u{FE0F}', chain: true, kind: 'migration',
    title: 'FÖRORTEN SOM GLÖMDES',
    text: 'Två år efter det stora året bor nästan alla nyanlända i {stad} i samma tre förorter. Där har bara var tredje vuxen ett jobb, skolorna har lärare som byts varje termin och banken har stängt sitt kontor. De unga som växer upp där säger att de inte känner någon som bor i resten av staden.',
    choices: [
      { text: 'FLYTTA DIT MYNDIGHETER OCH JOBB', cost: { money: 700 }, perm: { integration: 2 }, griev: -8, ind: { segreg: -3 }, next: ['kon_integ_vand', 'kon_integ_vand', null], tip: 'Där det finns jobb finns det framtid.' },
      { text: 'FLER POLISER OCH KAMEROR', cost: { money: 300 }, temp: { safety: 4, freedom: -2 }, griev: 3, ind: { feelsafe: 3 }, next: ['kon_integ_oro', 'kon_integ_vand'], tip: 'Tryggare gator. Samma brist på jobb.' },
      { text: 'DET ÄR DERAS EGET ANSVAR', temp: { integration: -3, approval: 2 }, griev: 8, ind: { segreg: 3, xenophobia: 2 }, next: ['kon_integ_oro', 'kon_integ_oro', null], tip: 'Ansvaret ligger kvar där du lämnade det.' },
    ],
  },
  {
    id: 'kon_integ_oro', icon: '\u{1F525}', chain: true, kind: 'migration',
    title: 'NÄTTERNA I {STAD}',
    text: 'Det började med att polisen stoppade fel bil en kväll i förorten. Sju nätter i rad har ungdomar bränt containrar och kastat sten mot räddningstjänsten. Ingen har skadats allvarligt, men en skola och en bensinstation har brunnit ner. I resten av landet växer stödet för dem som vill stänga gränserna helt, och i förorten säger alla att de vill ha det lugnt.',
    choices: [
      { text: 'KRAVALLPOLIS OCH UTEGÅNGSFÖRBUD',
        risk: { chance: 0.55,
          win: { text: 'Nätterna blir lugna efter fyra dygn. Ingen glömmer dem.', temp: { safety: 4, stability: 3, freedom: -3 }, ind: { xenophobia: 2 } },
          lose: { text: 'Oroligheterna sprider sig till två andra städer.', temp: { unrest: 10, safety: -5 }, griev: 10, ind: { xenophobia: 5, crimeidx: 6 } } } },
      { text: 'LYSSNA PÅ FÖRÄLDRARNA, FÖRENINGARNA OCH TRÄNARNA', cost: { pp: 15 }, temp: { unrest: -5, integration: 2 }, griev: -8, ind: { xenophobia: -1 }, next: ['kon_integ_vand', null], tip: 'Mammorna går nattvandring. Det gör mer än tio polisbilar.' },
      { text: 'STÄNG GRÄNSERNA', cost: { pp: 20 }, law: ['immigration', 'restricted'], temp: { approval: 4, unrest: 3, freedom: -3 }, rel: -6, griev: 6, ind: { xenophobia: 4 }, tip: 'Det kommer färre. De som brände containrarna var födda här.' },
    ],
  },
  {
    id: 'kon_integ_vand', icon: '\u{1F31F}', chain: true, kind: 'migration',
    title: 'VÄNDNINGEN I FÖRORTEN',
    text: 'Tre år efter de svåra åren har något hänt i förorten i {stad}. Arbetslösheten har halverats sedan två myndigheter flyttade dit, gymnasiet har landets mest förbättrade resultat och ett lokalt bryggeri säljer öl med förortens namn i hela landet. Bostadspriserna stiger, och för första gången flyttar folk dit av fri vilja.',
    choices: [
      { text: 'GÖR DET TILL EN NATIONELL FÖREBILD', cost: { money: 400 }, perm: { integration: 3, safety: 1 }, griev: -10, ind: { segreg: -3, xenophobia: -2 }, tip: 'Det tog tre år och mycket tålamod. Det går att göra om.' },
      { text: 'BYGG BOSTADSRÄTTER BREDVID HYRESHUSEN', cost: { money: 300 }, perm: { qol: 1 }, ind: { segreg: -2, houseprice: 3 }, griev: -4, tip: 'Blandade områden. Och en del nya grannar som klagar på gatumusiken.' },
      { text: 'INVIG GYMNASIETS NYA AULA PERSONLIGEN', temp: { approval: 4, integration: 2 }, griev: -6, ind: { trustgov: 2 }, tip: 'Eleverna har skrivit ett tal. Det är bättre än ditt.' },
    ],
  },

  // ===== DEMOKRATINS VÄGSKÄL =====
  // En frihet inskränks → uppropet → torget fylls → reform eller tillslag, sanktioner och exil.
  {
    id: 'kon_demo', icon: '\u{1F4DC}', weight: 2, cooldown: 1200, kind: 'frihet', react: true,
    title: 'UPPROPET FRÅN PROFESSORERNA',
    text: 'En vecka efter beslutet om {lag} har niohundra professorer, domare och författare skrivit under ett upprop på förstasidan av landets största tidning. "Det är så här det börjar", står det i rubriken. Journalistförbundet har begärt ett möte, och flera ambassader ställer frågor som deras regeringar sällan ställer offentligt.',
    when: (c) => c.cut('press', 'speech', 'protest', 'elections', 'civil_rights', 'internet') && c.demo > 3 && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -15, temp: { freedom: 3, polpower: -4 }, ind: { trustgov: 2 }, next: ['kon_demo_reform', null], tip: 'En ledare som kan ändra sig är ovanligare än en som inte kan.' },
      { text: 'BJUD IN DEM TILL SAMTAL — MEN STÅ FAST', cost: { pp: 10 }, temp: { stability: 1 }, griev: 3, next: ['kon_demo_protest', 'kon_demo_reform', null], tip: 'Kaffe och kakor. Lagen ligger kvar på bordet.' },
      { text: 'KALLA UPPROPET UTLÄNDSK PÅVERKAN', temp: { statepower: 4, freedom: -3, approval: -2 }, griev: 8, rel: -4, ind: { pressfree: -3, demo: -0.2 }, next: ['kon_demo_protest', 'kon_demo_protest', 'kon_demo_tillslag'], tip: 'Niohundra professorer i utländsk tjänst. Det blir svårt att bevisa.' },
    ],
  },
  {
    id: 'kon_demo_protest', icon: '\u{1F4E3}', chain: true, kind: 'frihet',
    title: 'HUNDRATUSEN PÅ TORGET',
    text: 'Ett kvartal efter ändringen av {lag} fylls stora torget i {huvudstad} för fjärde lördagen i rad. Där står pensionärer, studenter och småbarnsföräldrar med barnvagnar, och de sjunger gamla frihetssånger. Polisen räknar till hundratusen. Arrangörerna säger att de kommer tillbaka varje lördag tills {lag} är som förut.',
    choices: [
      { text: 'MÖT DEM PÅ TORGET OCH LOVA EN FOLKOMRÖSTNING', cost: { pp: 20, money: 200 }, temp: { unrest: -6, freedom: 3 }, griev: -10, next: ['kon_demo_reform', 'kon_demo_reform', 'kon_demo_val'], tip: 'Låt folket avgöra. Det brukar de göra ändå, till slut.' },
      { text: 'VÄNTA UT DEM — VINTERN KOMMER', temp: { unrest: 5, approval: -3 }, griev: 6, ind: { protests: 40 }, next: ['kon_demo_val', 'kon_demo_tillslag', null], tip: 'Vintern har avslutat fler protester än polisen. Men inte alla.' },
      { text: 'LÅT POLISEN RENSA TORGET', law: ['protest', 'restricted'], temp: { statepower: 5, unrest: 6, freedom: -5 }, griev: 12, ind: { demo: -0.4, trustgov: -5 }, next: ['kon_demo_tillslag'], tip: 'Torget blir tomt. Allt annat blir fullt.' },
    ],
  },
  {
    id: 'kon_demo_tillslag', icon: '\u{1F6A8}', chain: true, kind: 'frihet',
    title: 'NATTEN DÅ TORGET RENSADES',
    text: 'Strax efter midnatt gick kravallpolisen in med sköldar och vattenkanoner. Fyrahundra greps, bland dem två parlamentsledamöter och en sjuttioårig psalmförfattare. Bilderna gick jorden runt på en timme. På morgonen har tre ministrar lämnat regeringen och flera länder har kallat hem sina ambassadörer för samtal.',
    choices: [
      { text: 'SLÄPP ALLA OCH TILLSÄTT EN OBEROENDE GRANSKNING', cost: { pp: 25 }, temp: { freedom: 3, statepower: -4 }, griev: -12, ind: { trustgov: 3 }, next: ['kon_demo_reform', 'kon_demo_val'], tip: 'Att erkänna ett misstag är sällsynt. Därför är det värt mycket.' },
      { text: 'UTLYS UNDANTAGSTILLSTÅND', law: ['civil_rights', 'emergency'], temp: { statepower: 8, freedom: -8, unrest: 4 }, rel: -10, griev: 15, ind: { demo: -0.8, pressfree: -6 }, next: ['kon_demo_sanktion', 'kon_demo_exil'], tip: 'Ordning. Den sortens ordning som syns från rymden.' },
      { text: 'SKYLL PÅ ENSKILDA POLISER', temp: { approval: -4, safety: -2 }, griev: 8, ind: { policetrust: -6, trustgov: -4 }, next: ['kon_demo_sanktion', 'kon_demo_val', null], tip: 'Poliserna gjorde det du sa. Det vet de, och det vet alla.' },
    ],
  },
  {
    id: 'kon_demo_sanktion', icon: '\u{1F6AB}', chain: true, kind: 'frihet',
    title: 'OMVÄRLDEN VÄNDER RYGGEN',
    text: 'Ett halvår efter tillslaget har {land} och tolv andra länder infört sanktioner mot ledande personer i regeringen. Två stora investerare har dragit sig ur, resebyråerna rapporterar avbokningar och landets idrottare buas ut på en tävling utomlands. Utrikesministern säger att "det här går över". Det säger utrikesministrar alltid.',
    choices: [
      { text: 'ÅTERINFÖR FRIHETERNA OCH FÅ SLUT PÅ SANKTIONERNA', cost: { pp: 30 }, law: ['protest', 'permit'], temp: { freedom: 5, statepower: -4 }, rel: 12, griev: -12, ind: { demo: 0.4, tourists: 15 }, next: ['kon_demo_reform'], tip: 'Tillbaka till startrutan. Med ett ärr.' },
      { text: 'SÖK NYA VÄNNER SOM INTE STÄLLER FRÅGOR', cost: { money: 200 }, temp: { income: 3 }, perm: { corruption: 2 }, rel: -6, griev: 4, ind: { tourists: -15 }, next: ['kon_demo_exil', null], tip: 'De nya vännerna ställer inga frågor. De skickar fakturor.' },
      { text: 'BIT IHOP OCH VÄNTA', temp: { gdp: -4, approval: -3 }, mod: 'capital_flight', griev: 5, ind: { tourists: -25, stockcap: -10 }, next: ['kon_demo_exil', null], tip: 'Sanktioner biter långsamt. Men de biter.' },
    ],
  },
  {
    id: 'kon_demo_exil', icon: '\u{2708}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'DE SOM LÄMNADE LANDET',
    text: 'Ett år efter krisen kring {lag} har tusentals journalister, läkare och programmerare flyttat utomlands. I {land} sänder en exilradio varje kväll, och allt fler här hemma lyssnar i smyg. Universiteten saknar lärare i fysik, och de stora sjukhusen i {huvudstad} har platsannonser ute som ingen svarar på.',
    choices: [
      { text: 'AMNESTI OCH GARANTI FÖR DEM SOM VILL KOMMA HEM', cost: { pp: 20 }, temp: { freedom: 4, research: 2 }, griev: -8, ind: { demo: 0.3 }, next: ['kon_demo_reform', null], tip: 'Några kommer hem. De flesta väntar och ser.' },
      { text: 'DRA IN PASSEN FÖR KRITIKERNA', cost: { pp: 10 }, law: ['emigration', 'exitvisa'], temp: { statepower: 5, freedom: -6 }, perm: { research: -2 }, rel: -8, griev: 10, ind: { demo: -0.5 }, tip: 'Ingen kan lämna landet. Ingen vill heller komma hit.' },
      { text: 'LÅT DEM GÅ — VI KLARAR OSS UTAN DEM', perm: { research: -2, qol: -1 }, temp: { stability: 2 }, griev: 4, ind: { pressfree: -3 }, tip: 'Det gör vi inte. Men det låter bra i ett tal.' },
    ],
  },
  {
    id: 'kon_demo_val', icon: '\u{1F5F3}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'VALET SOM AVGÖR VÄGEN',
    text: 'Ett och ett halvt år efter bråket om {lag} går landet till val. Valobservatörer från fyrtio länder har kommit till {huvudstad}, och valdeltagandet ser ut att bli det högsta någonsin. Oppositionen har bara ett vallöfte: att återställa allt som ändrats. Du har regeringen, budgeten och statstelevisionen.',
    choices: [
      { text: 'ETT RENT OCH ÄRLIGT VAL',
        risk: { chance: 0.5,
          win: { text: 'Du vinner, knappt men ärligt. Segern väger tyngre än alla dina tal.', temp: { approval: 6, stability: 5 }, griev: -10, ind: { demo: 0.3, turnout: 5 } },
          lose: { text: 'Du förlorar och lämnar över med ett handslag. Historien kommer att minnas det.', temp: { polpower: -12, stability: 3, freedom: 4 }, griev: -15 } } },
      { text: 'LÅT STATSTELEVISIONEN HJÄLPA TILL', cost: { pp: 15 },
        risk: { chance: 0.6,
          win: { text: 'Du vinner stort. Observatörerna skriver en lång och sur rapport.', temp: { polpower: 6, freedom: -3 }, rel: -5, ind: { demo: -0.3 } },
          lose: { text: 'Det syns. Valet kallas orättvist och protesterna börjar om.', temp: { unrest: 8, approval: -6 }, griev: 10, ind: { demo: -0.5 } } } },
      { text: 'SKJUT UPP VALET ETT ÅR', law: ['elections', 'restricted'], temp: { statepower: 6, freedom: -8, unrest: 8 }, rel: -12, griev: 15, ind: { demo: -1, trustgov: -8 }, next: ['kon_demo_sanktion', 'kon_demo_exil'], tip: 'Ett år blir två. Två år blir en vana.' },
    ],
  },
  {
    id: 'kon_demo_reform', icon: '\u{1F54A}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'DEN STORA KOMPROMISSEN',
    text: 'Ett år efter krisen har regeringen och oppositionen enats om något ingen trodde var möjligt: en ny grundlag som skyddar pressen, domstolarna och rätten att demonstrera bättre än någonsin. Professorerna som skrev uppropet sitter i kommittén. Utländska tidningar skriver om landet "som stod vid ett vägskäl och valde rätt".',
    choices: [
      { text: 'SKRIV IN DET I GRUNDLAGEN', cost: { pp: 30 }, perm: { freedom: 4, stability: 2 }, rel: 6, griev: -15, ind: { demo: 0.6, trustgov: 4, pressfree: 4 }, tip: 'Framtida ledare kommer att svära över den. Det är meningen.' },
      { text: 'FIRA MED EN FOLKFEST PÅ TORGET', cost: { money: 150 }, temp: { approval: 6, unrest: -6 }, mod: 'national_unity', griev: -10, tip: 'Samma torg. En helt annan stämning.' },
      { text: 'TACKA PROFESSORERNA OFFENTLIGT', temp: { approval: 3, freedom: 2 }, griev: -6, ind: { trustgov: 2 }, tip: 'Det kostar inget att säga att någon hade rätt. Bara stolthet.' },
    ],
  },

  // ===== PENSIONSBOMBEN =====
  // Allt fler äldre → höj åldern, fondera eller skjut upp → protester, generationskrig eller tom fond.
  {
    id: 'kon_pension', icon: '\u{1F474}', weight: 2, cooldown: 1500, kind: 'valfard',
    title: 'PROGNOSEN SOM INGEN VILLE LÄSA',
    text: 'Pensionsmyndighetens årsrapport har en graf som går rakt ner. För trettio år sedan gick det fem arbetande på varje pensionär, i dag knappt tre och om tjugo år två. Om ingenting görs är buffertfonden tom innan dagens fyrtioåringar går i pension. Rapporten släpptes en fredag eftermiddag, men alla har läst den.',
    when: (c) => c.day > 150 && (c.ind.olddep ?? 25) > 28 && (c.ind.pensionx ?? 7) > 7,
    choices: [
      { text: 'HÖJ PENSIONSÅLDERN TILL 67', cost: { pp: 25 }, law: ['retirement_age', 'age67'], perm: { income: 2 }, temp: { approval: -5 }, griev: 8, next: ['kon_pension_tag', 'kon_pension_fond'], tip: 'Matematiken är enkel. Att sälja den är det inte.' },
      { text: 'FONDERA — HÖJ AVGIFTEN REDAN NU', cost: { pp: 15, money: 300 }, temp: { gdp: -1, approval: -2 }, griev: 2, next: ['kon_pension_fond', 'kon_pension_fond', 'kon_pension_unga'], tip: 'Den som betalar i dag får en pension i morgon.' },
      { text: 'DET FÅR NÄSTA REGERING LÖSA', temp: { approval: 2, stability: 1 }, next: ['kon_pension_tom', 'kon_pension_tom', null], tip: 'Nästa regering tackar så hjärtligt.' },
    ],
  },
  {
    id: 'kon_pension_tag', icon: '\u{1F9D3}', chain: true, kind: 'valfard',
    title: 'PENSIONÄRERNA TÅGAR',
    text: 'Ett halvår efter beslutet om pensionsåldern har sextiotusen människor marscherat genom {huvudstad}, de flesta över sextio. Främst går en undersköterska från {stad} som har lyft patienter i fyrtio år och säger att ryggen inte klarar två år till. Hon har blivit landets mest intervjuade person. På hennes skylt står det "VEM SKA LYFTA MIG?".',
    choices: [
      { text: 'UNDANTAG FÖR TUNGA YRKEN', cost: { pp: 20 }, law: ['retirement_age', 'hardjobs'], temp: { approval: 4 }, griev: -12, next: ['kon_pension_fond', null], tip: 'Den som lyft patienter får gå tidigare. Den som lyft pennor får vänta.' },
      { text: 'BACKA TILL 65', cost: { pp: 15 }, law: ['retirement_age', 'age65'], perm: { income: -2 }, temp: { approval: 5, polpower: -3 }, griev: -15, next: ['kon_pension_tom', null], tip: 'Ryggen räddad. Fonden fortsätter att tömmas.' },
      { text: 'STÅ FAST — ALLA MÅSTE BIDRA', temp: { unrest: 6, approval: -4 }, griev: 8, ind: { protests: 50, strikes: 30 }, next: ['kon_pension_unga', 'kon_pension_fond'], tip: 'Alla bidrar. Somliga mer än andra.' },
    ],
  },
  {
    id: 'kon_pension_fond', icon: '\u{1F331}', chain: true, kind: 'valfard',
    title: 'FONDEN VÄXER IGEN',
    text: 'Tre år efter pensionsreformen har årsrapporten en graf som går uppåt. Buffertfonden har vuxit för första gången på ett decennium, och internationella pensionsexperter kallar systemet "ett av de få som håller". Den som är tjugofem i dag kan räkna med en pension. Det är tråkiga nyheter, och de bästa på länge.',
    choices: [
      { text: 'LÅS FAST REGLERNA ÖVER PARTIGRÄNSERNA', cost: { pp: 20 }, perm: { stability: 2, welfare: 2 }, griev: -10, ind: { trustgov: 3 }, tip: 'En uppgörelse som överlever alla val.' },
      { text: 'HÖJ DE LÄGSTA PENSIONERNA', cost: { money: 400 }, perm: { welfare: 2, qol: 1 }, temp: { approval: 5 }, griev: -12, tip: 'De som har minst marginal får mest.' },
      { text: 'LÅT FONDEN VÄXA I FRED', perm: { income: 1 }, temp: { stability: 2 }, griev: -4, tip: 'Ränta på ränta är världens tråkigaste mirakel.' },
    ],
  },
  {
    id: 'kon_pension_unga', icon: '\u{1F9D1}', chain: true, kind: 'valfard',
    title: 'GENERATIONSKRIGET',
    text: 'Ett år efter pensionsbråket har ungdomsförbunden startat ett eget parti med en enda fråga: de vill inte betala för pensioner som de själva aldrig kommer att få. I debatterna ställs tjugoåringar mot sjuttioåringar, och på nätet kallar de varandra saker som inte hör hemma vid ett middagsbord. Mormödrar och barnbarn har slutat prata med varandra.',
    choices: [
      { text: 'GENERATIONSKONTRAKTET — EN UPPGÖRELSE FÖR ALLA', cost: { pp: 25 }, perm: { stability: 2 }, temp: { approval: 4 }, griev: -10, next: ['kon_pension_fond', null], tip: 'De unga betalar, de äldre avstår lite, alla får något.' },
      { text: 'SATSA PÅ DE UNGA — BOSTÄDER OCH UTBILDNING', cost: { money: 600 }, perm: { qol: 1, research: 1 }, temp: { approval: 3 }, griev: -6, ind: { youthunemp: -1 }, tip: 'De unga lugnar sig. Pensionärerna undrar var deras del är.' },
      { text: 'DE ÄLDRE RÖSTAR, DE UNGA SOVER', temp: { approval: 2, stability: -3 }, griev: 6, ind: { turnout: -3, trustgov: -3 }, tip: 'Stämmer i dag. Om tio år röstar de unga också.' },
    ],
  },
  {
    id: 'kon_pension_tom', icon: '\u{1F4ED}', chain: true, kind: 'valfard',
    title: 'PENSIONERNA SÄNKS ÖVER EN NATT',
    text: 'Flera år efter prognosen som ingen ville läsa är buffertfonden tom. Enligt lagen sänks alla pensioner automatiskt med elva procent från nästa månad. I {stad} står pensionärer i kö utanför kommunens kontor för att fråga om bostadsbidrag, och apoteken rapporterar att allt fler slutar hämta ut sina mediciner.',
    choices: [
      { text: 'NÖDLÅN FÖR ATT BETALA PENSIONERNA', cost: { money: 1200 }, temp: { approval: 3, stability: 2 }, perm: { income: -2 }, griev: -10, tip: 'Pensionärerna är räddade. Barnbarnen får betala.' },
      { text: 'HÖJ PENSIONSÅLDERN TILL 70 — NU', cost: { pp: 30 }, law: ['retirement_age', 'age70'], perm: { income: 3 }, temp: { approval: -8, unrest: 8 }, griev: 15, ind: { protests: 60, trustgov: -5 }, tip: 'Fonden räddas. Ingen kommer att förlåta dig.' },
      { text: 'LÅT SÄNKNINGEN GÅ IGENOM', perm: { welfare: -3, qol: -2 }, temp: { approval: -8, unrest: 6 }, griev: 18, ind: { trustgov: -7, happiness: -0.2 }, tip: 'Lagen följs. Elva procent av varje pension försvinner.' },
    ],
  },

  // ===== INFLATIONSSPIRALEN =====
  // Priserna skenar → räntechock, prisstopp eller sedelpress → seger, tomma hyllor eller hyperinflation.
  {
    id: 'kon_infl', icon: '\u{1F95B}', weight: 2, cooldown: 1200, kind: 'kris',
    title: 'MJÖLKEN KOSTAR EN TREDJEDEL MER',
    text: 'Matpriserna har stigit varje månad i ett år. En liter mjölk kostar en tredjedel mer än förra julen och hyran har höjts två gånger. I mataffären i {stad} har personalen börjat sätta larmbrickor på smöret. Pensionärer räknar växel vid kassan, och facken kräver tio procent i nästa avtalsrörelse.',
    when: (c) => c.day > 60 && ((c.ind.infl ?? 2) > 8 || (c.is('monetary', 'printing', 'qe', 'loose') && (c.ind.infl ?? 2) > 4)),
    choices: [
      { text: 'LÅT CENTRALBANKEN HÖJA RÄNTAN KRAFTIGT', law: ['monetary', 'tight'], temp: { gdp: -3, approval: -4 }, griev: 4, ind: { infl: -2, unemp: 0.4 }, next: ['kon_infl_ranta', 'kon_infl_seger'], tip: 'Den beska medicinen. Den fungerar, och den smakar illa.' },
      { text: 'FRYS PRISERNA PÅ MAT OCH HYROR', cost: { pp: 20 }, law: ['price_controls', 'freeze'], temp: { approval: 6, qol: 2 }, griev: -8, ind: { infl: -1.5 }, next: ['kon_infl_hyllor', 'kon_infl_hyllor', null], tip: 'Priserna står still. Snart gör leveranserna det också.' },
      { text: 'KOMPENSERA HUSHÅLLEN MED BIDRAG', cost: { money: 600 }, temp: { approval: 4 }, griev: -6, ind: { infl: 1 }, next: ['kon_infl_spiral', 'kon_infl_seger', null], tip: 'Mer pengar i plånboken. Och i priserna.' },
      { text: 'TRYCK MER PENGAR — EKONOMIN BEHÖVER DET', law: ['monetary', 'printing'], res: { money: 600 }, temp: { gdp: 2, approval: 2 }, ind: { infl: 4 }, next: ['kon_infl_hyper', 'kon_infl_spiral'], tip: 'Det har prövats förut. Läs historieboken först.' },
    ],
  },
  {
    id: 'kon_infl_spiral', icon: '\u{1F300}', chain: true, kind: 'kris',
    title: 'LÖNERNA JAGAR PRISERNA',
    text: 'Ett halvår senare har facken fått tio procents löneökning och företagen har höjt priserna med tolv. Nu kräver facken femton. Varje gång lönerna stiger stiger priserna lite mer, och ingen vill vara först med att sluta. Ekonomerna kallar det en löne- och prisspiral. I {stad} kallar man det att springa i ett ekorrhjul.',
    choices: [
      { text: 'SAMLA FACK OCH ARBETSGIVARE TILL ETT STORT AVTAL', cost: { pp: 25 }, next: ['kon_infl_seger', 'kon_infl_ranta'],
        risk: { chance: 0.6,
          win: { text: 'Alla skriver under på måttliga löner i tre år. Spiralen bryts.', temp: { stability: 5 }, griev: -12, ind: { infl: -3 } },
          lose: { text: 'Ett av facken går ut i strejk och avtalet faller samman.', temp: { unrest: 6, stability: -3 }, griev: 6, ind: { strikes: 60 } } } },
      { text: 'HÖJ RÄNTAN — HÅRT', law: ['monetary', 'tight'], temp: { gdp: -4, approval: -5 }, griev: 6, ind: { infl: -3, unemp: 0.6 }, next: ['kon_infl_ranta'], tip: 'Det kommer att göra ont. Det är hela poängen.' },
      { text: 'INDEXERA ALLT — LÖNER, PENSIONER OCH BIDRAG', cost: { money: 500 }, temp: { approval: 3 }, perm: { income: -2 }, griev: -4, ind: { infl: 3 }, next: ['kon_infl_hyper', null], tip: 'Alla hänger med. Ingen kommer ikapp.' },
    ],
  },
  {
    id: 'kon_infl_hyllor', icon: '\u{1F6D2}', chain: true, kind: 'kris',
    title: 'TOMMA HYLLOR I {STAD}',
    text: 'Tre månader efter prisstoppet säljer bönderna hellre sin mjölk till {granne} än till de frysta priserna här hemma. Hyllorna med smör, kaffe och kött är tomma klockan tio på förmiddagen, och på torget säljer någon samma varor ur en skåpbil för dubbla priset. Köerna utanför butikerna ringlar runt kvarteret.',
    choices: [
      { text: 'SLÄPP PRISERNA STEGVIS', cost: { pp: 15 }, law: ['price_controls', 'caps'], temp: { approval: -3, qol: 1 }, griev: 4, ind: { infl: 1.5 }, next: ['kon_infl_seger', 'kon_infl_spiral'], tip: 'Priserna stiger och hyllorna fylls. Båda delarna märks.' },
      { text: 'RANSONERING MED KUPONGER', cost: { money: 300 }, temp: { stability: 2, freedom: -3, qol: -2 }, perm: { corruption: 1 }, griev: 3, tip: 'Alla får lika lite. Vissa får lite mer genom bakdörren.' },
      { text: 'JAGA SVARTABÖRSHAJARNA', temp: { statepower: 3, approval: 2, safety: -1 }, griev: 5, ind: { crimeidx: 4 }, next: ['kon_infl_spiral', null], tip: 'Skåpbilen försvinner. Smöret kommer inte tillbaka.' },
    ],
  },
  {
    id: 'kon_infl_ranta', icon: '\u{1F3DA}\u{FE0F}', chain: true, kind: 'kris',
    title: 'RÄNTECHOCKEN',
    text: 'Ett halvår efter de stora räntehöjningarna har inflationen börjat falla, men priset betalas av andra. Byggföretag varslar, villaägare med rörliga lån betalar dubbelt så mycket som förra året och arbetslösheten stiger varje månad. I {stad} har möbelfabriken gått över till fyradagarsvecka. Ekonomerna säger att det värsta snart är över.',
    choices: [
      { text: 'HÅLL I — DET ÄR NÄSTAN KLART', temp: { approval: -4, stability: 2 }, griev: 6, ind: { unemp: 0.3, infl: -2 }, next: ['kon_infl_seger', 'kon_infl_seger', null], tip: 'Ekonomerna har rätt. Den här gången.' },
      { text: 'STÖD TILL DE HÅRDAST DRABBADE HUSHÅLLEN', cost: { money: 500 }, temp: { approval: 3, qol: 1 }, griev: -8, ind: { homeless: -8 }, next: ['kon_infl_seger', null], tip: 'Den som hade otur med lånet får lite hjälp.' },
      { text: 'TVINGA CENTRALBANKEN ATT SÄNKA RÄNTAN', cost: { pp: 25 }, law: ['monetary', 'loose'], temp: { approval: 4, gdp: 2 }, perm: { stability: -1 }, griev: -4, ind: { infl: 2 }, next: ['kon_infl_spiral', 'kon_infl_hyper'], tip: 'Marknaden noterar att centralbanken lyder dig nu.' },
    ],
  },
  {
    id: 'kon_infl_hyper', icon: '\u{1F4B5}', chain: true, kind: 'kris',
    title: 'SEDLAR I SKOTTKÄRRA',
    text: 'Ett år efter att sedelpressarna sattes igång stiger priserna med fyra procent i veckan. Lönerna betalas ut två gånger om dagen, så att folk hinner handla innan pengarna tappar värdet. I {stad} betalar man hyran i potatis och bensin, och sparpengar som det tog ett helt liv att samla är värda ett busskort.',
    choices: [
      { text: 'NY VALUTA MED FAST VÄXELKURS', cost: { pp: 40, money: 500 }, law: ['monetary', 'currencyboard'], temp: { stability: 4, approval: -3 }, griev: -15, ind: { infl: -10, gdppc: -4 }, next: ['kon_infl_seger'], tip: 'En nollställning. Smärtsam, men pengar blir pengar igen.' },
      { text: 'BYT TILL DOLLARN', cost: { pp: 30 }, law: ['monetary', 'dollarization'], temp: { stability: 3 }, perm: { statepower: -2 }, rel: 3, griev: -10, ind: { infl: -8 }, tip: 'Inflationen dör. Penningpolitiken flyttar till ett annat land.' },
      { text: 'TRYCK STÖRRE SEDLAR', temp: { approval: -8, unrest: 10, gdp: -6 }, mod: 'downturn', griev: 15, ind: { infl: 10, gdppc: -6, trustgov: -8 }, tip: 'Miljardsedeln trycks i morgon. Den räcker till en limpa.' },
    ],
  },
  {
    id: 'kon_infl_seger', icon: '\u{1F3C1}', chain: true, kind: 'kris',
    title: 'INFLATIONEN ÄR BRUTEN',
    text: 'Ett och ett halvt år efter de svåra månaderna visar statistiken två procents inflation, precis där den ska vara. Räntan har börjat sjunka, villaägarna andas ut och facken förhandlar om löner som räcker längre än till nästa månad. I mataffären i {stad} har larmbrickorna plockats bort från smöret.',
    choices: [
      { text: 'SKYDDA CENTRALBANKENS OBEROENDE', cost: { pp: 10 }, law: ['monetary', 'independent'], perm: { stability: 2 }, griev: -8, ind: { trustgov: 2 }, tip: 'Den som vann kriget får behålla sina vapen.' },
      { text: 'SÄNK MATMOMSEN SOM TACK', cost: { money: 400 }, temp: { approval: 6, qol: 2 }, griev: -10, ind: { infl: 0.5 }, tip: 'En fin gest. Ekonomerna himlar lite med ögonen.' },
      { text: 'HÅLL ETT TAL OM VAD VI HAR LÄRT OSS', temp: { approval: 3, stability: 2 }, griev: -6, tip: 'Det viktigaste vi lärt oss: att vi aldrig vill göra om det.' },
    ],
  },

  // ===== KAPITALFLYKTEN =====
  // Skatten höjs → huvudkontoren flyttar → flykt och valutareglering, eller de som stannade.
  {
    id: 'kon_kapital', icon: '\u{1F69A}', weight: 2, cooldown: 1300, kind: 'skatt', react: true,
    title: 'HUVUDKONTOREN FLYTTAR TILL {LAND}',
    text: 'En månad efter ändringen av {lag} har tre av landets största familjeföretag meddelat att huvudkontoren flyttar till {land}. Fabrikerna blir kvar, säger de, men vinsterna och skatten flyttar. Börsen föll fyra procent på en dag, och företagarföreningen har köpt helsidesannonser med en bild på en flyttbil.',
    when: (c) => c.changed('corporate_tax', 'inheritance_tax', 'taxes') && (c.is('corporate_tax', 'excess', 'veryhigh', 'high') || c.is('inheritance_tax', 'forall', 'veryhigh', 'high') || c.is('taxes', 't60', 't40')) && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -12, temp: { polpower: -4, approval: -2 }, ind: { stockcap: 4 }, next: ['kon_kapital_hem', null], tip: 'Företagen stannar. De som ville se dem betala undrar vad som hände.' },
      { text: 'INFÖR UTFLYTTNINGSSKATT', cost: { pp: 15 }, law: ['emigration', 'exittax'], temp: { income: 3, freedom: -2 }, griev: 4, next: ['kon_kapital_flykt', 'kon_kapital_stannar'], tip: 'Den som vill gå får betala vid dörren.' },
      { text: 'LÅT DEM GÅ — VI SATSAR PÅ DEM SOM STANNAR', temp: { approval: 3, gdp: -2 }, griev: 2, ind: { stockcap: -5 }, next: ['kon_kapital_flykt', 'kon_kapital_stannar', 'kon_kapital_stannar'], tip: 'Tre företag går. Hundratusen småföretag har ingenstans att ta vägen.' },
    ],
  },
  {
    id: 'kon_kapital_flykt', icon: '\u{1F4B1}', chain: true, kind: 'skatt',
    title: 'PENGARNA LÄMNAR LANDET',
    text: 'Ett kvartal efter huvudkontorens flytt har flykten blivit en flodvåg. Banker i {land} rapporterar rekordmånga nya konton från landet, valutan har tappat en tiondel mot dollarn och två utländska fabriksprojekt har lagts på is. Bankerna i {huvudstad} ser kunderna ta ut sina pengar och undrar vem som står på tur.',
    choices: [
      { text: 'VALUTAREGLERING — INGA PENGAR UT', cost: { pp: 25 }, law: ['banking', 'strict'], temp: { stability: 3, freedom: -3 }, griev: 6, ind: { stockcap: -8 }, next: ['kon_kapital_reglering'], tip: 'Dörren stängs. Fönstren står fortfarande öppna.' },
      { text: 'HÖJ RÄNTAN FÖR ATT LOCKA TILLBAKA PENGARNA', law: ['monetary', 'tight'], temp: { gdp: -3, approval: -3 }, griev: 3, ind: { unemp: 0.4, infl: -1 }, next: ['kon_kapital_hem', null], tip: 'Dyrt att låna. Lönsamt att spara här igen.' },
      { text: 'BACKA ÄNDRINGEN AV {LAG}', cost: { pp: 20 }, undo: true, griev: -10, temp: { approval: -3, polpower: -4 }, next: ['kon_kapital_hem'], tip: 'Pengarna vänder. Din trovärdighet tar längre tid.' },
      { text: 'LÅT VALUTAN FALLA', mod: 'capital_flight', temp: { gdp: -4, income: -3 }, griev: 6, ind: { stockcap: -15, infl: 2 }, next: ['kon_kapital_stannar', 'kon_kapital_reglering', null], tip: 'En svag valuta gör exporten billig. Och allt annat dyrt.' },
    ],
  },
  {
    id: 'kon_kapital_reglering', icon: '\u{1F575}\u{FE0F}', chain: true, kind: 'skatt',
    title: 'VALUTAREGLERINGENS SVARTA MARKNAD',
    text: 'Ett år efter att valutaregleringen infördes säljs dollar på bakgårdar i {huvudstad} för en tredjedel över den officiella kursen. Företag som behöver köpa maskiner utomlands väntar i månader på tillstånd, och tjänstemännen som delar ut tillstånden har börjat köra dyra bilar. Den som har kontakter klarar sig. Den som inte har det gör det inte.',
    choices: [
      { text: 'AVVECKLA REGLERINGEN STEGVIS', cost: { pp: 20 }, law: ['banking', 'normal'], temp: { gdp: 3, stability: -2 }, griev: -6, ind: { stockcap: 8 }, next: ['kon_kapital_hem', null], tip: 'Kursen faller en sista gång. Sedan stabiliseras den.' },
      { text: 'RENSA UT DE MUTADE TJÄNSTEMÄNNEN', cost: { money: 200 }, perm: { corruption: -3 }, temp: { statepower: 2 }, griev: -3, tip: 'De dyra bilarna säljs. Svarta marknaden finns kvar.' },
      { text: 'HÅRDARE STRAFF FÖR VALUTASMUGGLING', temp: { statepower: 4, freedom: -3, safety: -1 }, perm: { corruption: 2 }, griev: 5, ind: { crimeidx: 4 }, tip: 'Smugglarna höjer priset. Tjänstemännen höjer mutorna.' },
    ],
  },
  {
    id: 'kon_kapital_stannar', icon: '\u{1F52C}', chain: true, kind: 'skatt',
    title: 'DE SOM STANNADE',
    text: 'Två år efter flytten har något oväntat hänt. Skatteintäkterna har ökat, eftersom företagen som stannade växer och anställer ingenjörerna som de flyttade bolagen lämnade efter sig. Ett av familjeföretagen har tyst flyttat hem igen, eftersom ingen i {land} ville jobba där. Skolorna i {stad} har fått nya laboratorier för skattepengarna.',
    choices: [
      { text: 'INVESTERA I FORSKNING OCH UTBILDNING', cost: { money: 500 }, perm: { research: 2, gdp: 1 }, griev: -8, tip: 'Pengar som stannar i landet. Kunskap som stannar ännu längre.' },
      { text: 'SÄNK SKATTEN LITE FÖR SMÅFÖRETAGEN', cost: { money: 200 }, temp: { gdp: 3, approval: 3 }, griev: -10, ind: { stockcap: 4 }, tip: 'Ett tack till dem som stannade.' },
      { text: 'BERÄTTA FÖR VÄRLDEN ATT DET GICK', temp: { approval: 3 }, rel: 4, griev: -5, ind: { trustgov: 2 }, tip: 'Ekonomer i tolv länder skriver förvånade artiklar.' },
    ],
  },
  {
    id: 'kon_kapital_hem', icon: '\u{1F3E1}', chain: true, kind: 'skatt',
    title: 'FLYTTBILARNA KOMMER TILLBAKA',
    text: 'Ett år efter flykten har två av de tre familjeföretagen flyttat tillbaka sina huvudkontor till {huvudstad}. Valutan har återhämtat sig och bankerna rapporterar att pengarna strömmar in igen. Företagarföreningen har köpt nya helsidesannonser, nu med samma flyttbil som kör åt andra hållet.',
    choices: [
      { text: 'VÄLKOMNA DEM MED ETT INVESTERINGSAVTAL', cost: { pp: 15 }, mod: 'foreign_investment', temp: { gdp: 3 }, griev: -6, ind: { stockcap: 6 }, tip: 'Fabrikerna växer. Tretusen nya jobb.' },
      { text: 'KRÄV SKATTEN DE SMET UNDAN', res: { money: 300 }, temp: { approval: 4, gdp: -1 }, griev: -4, tip: 'Rättvist. Och ett utmärkt sätt att få dem att flytta igen.' },
      { text: 'LOVA STABILA REGLER I TIO ÅR', cost: { pp: 20 }, perm: { stability: 2, gdp: 1 }, griev: -6, tip: 'Ingenting lockar kapital som förutsägbarhet.' },
    ],
  },

  // ===== DEN GRÖNA OMSTÄLLNINGEN =====
  // Miljö- och energilagar skärps → traktorer på motorvägen → västar, fabriker, mörker eller export.
  {
    id: 'kon_gron', icon: '\u{1F69C}', weight: 2, cooldown: 1300, kind: 'miljo', react: true,
    title: 'TRAKTORERNA PÅ MOTORVÄGEN',
    text: 'Tre veckor efter ändringen av {lag} kostar dieseln en femtedel mer. I morse körde fyrahundra bönder och åkare ut på motorvägen vid {stad} och ställde sig i bredd. Kön är fyra mil lång. "Ni i {huvudstad} kan ta tunnelbanan. Vi har inte ens en buss", säger deras talesperson, en mjölkbonde med tre barn.',
    when: (c) => c.changed('energy', 'environment', 'transport') && (c.is('energy', 'renewable', 'green', 'carbontax', 'rationing') || c.is('environment', 'rightsofnature', 'strict', 'thirty', 'strong') || c.is('transport', 'carfree', 'transitfirst')) && c.day > 30,
    choices: [
      { text: 'KOMPENSERA LANDSBYGDEN', cost: { money: 500 }, temp: { approval: 3, unrest: -3 }, griev: -10, next: ['kon_gron_fabrik', 'kon_gron_vastar', null], tip: 'Omställningen blir dyrare. Men den blir av.' },
      { text: 'STÅ FAST — KLIMATET VÄNTAR INTE', temp: { approval: -4, unrest: 5 }, perm: { qol: 1 }, griev: 8, ind: { protests: 40 }, next: ['kon_gron_vastar', 'kon_gron_fabrik', 'kon_gron_elnat'], tip: 'Klimatet väntar inte. Bönderna inte heller.' },
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -15, temp: { polpower: -3 }, rel: -3, tip: 'Traktorerna åker hem. Klimatmålen också.' },
    ],
  },
  {
    id: 'kon_gron_vastar', icon: '\u{1F9BA}', chain: true, kind: 'miljo',
    title: 'GULA VÄSTAR VARJE LÖRDAG',
    text: 'Ett halvår efter beslutet om {lag} har protesterna blivit en rörelse. Varje lördag samlas tiotusentals i gula reflexvästar över hela landet, och i {stad} har en grupp ockuperat rondellen vid infarten sedan i höstas. De flesta är fredliga, men i {huvudstad} krossades skyltfönster i helgen och polisen använde tårgas.',
    choices: [
      { text: 'NATIONELL DIALOG I VARJE KOMMUN', cost: { pp: 25, money: 200 }, temp: { unrest: -6, approval: 3 }, griev: -12, ind: { protests: -40 }, next: ['kon_gron_fabrik', null], tip: 'Tusen möten i tusen stadshus. Alla får säga sitt.' },
      { text: 'SKROTA HELA PAKETET', cost: { pp: 15 }, undo: true, perm: { qol: -1 }, temp: { approval: 2, stability: 2 }, rel: -6, griev: -18, tip: 'Rörelsen vann. Nästa rörelse har lärt sig hur man gör.' },
      { text: 'HÅRDARE TAG MOT VANDALERNA', temp: { safety: 3, freedom: -3, unrest: 6 }, griev: 10, ind: { protests: 50, policetrust: -4 }, next: ['kon_gron_elnat', null], tip: 'Vandalerna försvinner. De fredliga blir fler.' },
    ],
  },
  {
    id: 'kon_gron_fabrik', icon: '\u{1F50B}', chain: true, kind: 'miljo',
    title: 'BATTERIFABRIKEN I {STAD}',
    text: 'Två år efter att omställningen började har ett av världens största batteriföretag valt {stad} för sin nya fabrik, tack vare billig grön el och tydliga regler. Det blir tretusen jobb, och lika många hos underleverantörerna. Mjölkbonden som ledde traktorprotesten har sålt mark till fabriken och leder nu kommunens näringslivskontor.',
    choices: [
      { text: 'SATSA PÅ EN HEL GRÖN INDUSTRI', cost: { money: 800 }, perm: { factory: 3, gdp: 1 }, mod: 'industrial_boom', griev: -10, next: ['kon_gron_export', null], tip: 'En fabrik är ett jobb. Tio fabriker är en framtid.' },
      { text: 'UTBILDA DE SOM BOR DÄR FÖRST', cost: { money: 300 }, perm: { qol: 1 }, temp: { approval: 4 }, griev: -8, ind: { unemp: -0.3 }, next: ['kon_gron_export', null], tip: 'Jobben går till dem som bor där. Det märks.' },
      { text: 'TA ÄRAN — DET VAR VÅR POLITIK', temp: { approval: 4, polpower: 3 }, griev: -5, tip: 'Det var det. Den här gången stämmer det faktiskt.' },
    ],
  },
  {
    id: 'kon_gron_elnat', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'miljo',
    title: 'DEN KALLA VECKAN',
    text: 'Den första riktigt kalla vintern efter omställningen räckte elnätet inte till. Vinden mojnade i fem dagar och de gamla kraftverken var redan stängda. I {stad} var strömmen borta sex timmar om dagen, skolor höll stängt och pensionärer flyttades till sporthallar med reservkraft. Elpriset slog rekord tre dagar i rad.',
    choices: [
      { text: 'BYGG UT LAGRING OCH NYA LEDNINGAR', cost: { money: 1000 }, perm: { factory: 1, qol: 1 }, temp: { approval: 2 }, griev: -10, next: ['kon_gron_export', null], tip: 'Batterier, ledningar och ny kraft. Nästa vinter blir annorlunda.' },
      { text: 'SATSA PÅ KÄRNKRAFT', cost: { pp: 25 }, law: ['energy', 'nuclear'], perm: { factory: 2 }, temp: { approval: 2 }, griev: -6, tip: 'Stabil el, långa byggtider och en helt ny debatt.' },
      { text: 'STARTA DE GAMLA KOLKRAFTVERKEN', law: ['energy', 'fossil'], temp: { approval: 3, qol: -2 }, rel: -4, griev: 4, tip: 'Ljuset är tillbaka. Utsläppen också.' },
    ],
  },
  {
    id: 'kon_gron_export', icon: '\u{1F30D}', chain: true, kind: 'miljo',
    title: 'TEKNIKEN SOM VÄRLDEN VILL KÖPA',
    text: 'Tre år efter bråket om {lag} är landet världsledande på något ingen trodde: grönt stål och lagring av el. Delegationer från {land} och femton andra länder står i kö för att besöka fabrikerna, och exporten av gröna maskiner har gått om skogsindustrin. Elpriset är det lägsta på ett decennium.',
    choices: [
      { text: 'SÄLJ LICENSER TILL HELA VÄRLDEN', res: { money: 800 }, temp: { gdp: 3 }, rel: 5, griev: -6, tip: 'Klimatet tjänar på det. Statskassan också.' },
      { text: 'GE BORT TEKNIKEN TILL FATTIGA LÄNDER', temp: { approval: 3 }, rel: 12, griev: -8, tip: 'Världen blir lite grönare. Och lite vänligare mot oss.' },
      { text: 'GÖR DET TILL LANDETS VARUMÄRKE', cost: { money: 300 }, mod: 'tech_breakthrough', temp: { approval: 4 }, griev: -8, tip: 'Från traktorer på motorvägen till världens förebild.' },
    ],
  },

  // ===== VALFUSKET =====
  // Observatörerna hittar för många röster → kommission, film från vallokalen, gatorna fylls → omval eller armén.
  {
    id: 'kon_fusk', icon: '\u{1F5F3}\u{FE0F}', weight: 2, cooldown: 1500, kind: 'frihet',
    title: 'FYRTIOTUSEN RÖSTER FÖR MYCKET',
    text: 'Valobservatörerna har lämnat sin rapport. I tre valdistrikt i {stad} röstade fler än det finns invånare, och i ett av dem fick ditt parti nittioåtta procent. Rapporten är skriven på torr byråkratprosa, men en mening har redan blivit en slogan på nätet: "rösterna räknades av samma personer som de räknades för".',
    when: (c) => c.day > 150 && c.demo < 6.5 && c.demo > 2.5 && c.st.corruption > 10,
    choices: [
      { text: 'GÖR OM VALET I {STAD}', cost: { money: 300, pp: 15 }, temp: { freedom: 3, polpower: -3 }, griev: -10, ind: { trustgov: 3 }, next: ['kon_fusk_omval'], tip: 'Det kostar platser i parlamentet. Det köper förtroende.' },
      { text: 'TILLSÄTT EN KOMMISSION', cost: { pp: 10 }, temp: { stability: 2 }, griev: -3, next: ['kon_fusk_kommission', 'kon_fusk_video'], tip: 'En kommission tar ett år. Ett år är lång tid i politiken.' },
      { text: 'AVFÄRDA RAPPORTEN SOM PARTISK', temp: { statepower: 3, approval: -3 }, rel: -4, griev: 8, ind: { demo: -0.2, trustgov: -4 }, next: ['kon_fusk_video', 'kon_fusk_gatan'], tip: 'Observatörerna har kameror. Det har alla nu för tiden.' },
    ],
  },
  {
    id: 'kon_fusk_video', icon: '\u{1F4F1}', chain: true, kind: 'frihet',
    title: 'FILMEN FRÅN VALLOKALEN',
    text: 'En valförrättare i {stad} har lämnat en mobilfilm till en oberoende nyhetssajt. På filmen syns två män som stoppar tjocka buntar valsedlar i urnan medan en polis tittar bort. Filmen har setts sju miljoner gånger på ett dygn. Valförrättaren har gått under jorden, och hennes advokat säger att hon har fått hot.',
    choices: [
      { text: 'ÅTALA MÄNNEN PÅ FILMEN', cost: { pp: 15 }, temp: { safety: 2, approval: 3 }, perm: { corruption: -2 }, griev: -8, next: ['kon_fusk_kommission', null], tip: 'Två fotsoldater döms. Frågan om vem som skickade dem består.' },
      { text: 'GE VALFÖRRÄTTAREN SKYDD OCH TACKA HENNE', cost: { money: 100 }, temp: { freedom: 3, approval: 2 }, griev: -6, ind: { trustgov: 2 }, next: ['kon_fusk_omval', 'kon_fusk_kommission'], tip: 'En modig människa skyddad. Det skickar ett budskap.' },
      { text: 'KALLA FILMEN FÖRFALSKAD', temp: { statepower: 3, approval: -6 }, griev: 12, ind: { pressfree: -4, trustgov: -6, protests: 50 }, next: ['kon_fusk_gatan'], tip: 'Sju miljoner har sett den. Sju miljoner tror inte på dig.' },
    ],
  },
  {
    id: 'kon_fusk_gatan', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'FOLKET VÄGRAR GÅ HEM',
    text: 'Två veckor efter att fusket blev känt står tvåhundratusen människor på gatorna i {huvudstad}, natt och dag, i minusgrader. De delar ut te och sjunger. Facken hotar med generalstrejk, studenterna har ockuperat universitetet och ett av statstelevisionens nyhetsankare läste i går upp sin avskedsansökan i direktsändning.',
    choices: [
      { text: 'NYVAL MED INTERNATIONELLA OBSERVATÖRER', cost: { pp: 30 }, law: ['elections', 'free'], temp: { unrest: -10, freedom: 5, polpower: -6 }, griev: -18, ind: { demo: 0.6, trustgov: 5 }, next: ['kon_fusk_omval'], tip: 'Du kan förlora. Det är det som gör det till ett val.' },
      { text: 'KALLA IN ARMÉN FÖR ATT HÅLLA ORDNING', temp: { statepower: 6, unrest: 10, freedom: -6 }, rel: -10, griev: 15, ind: { demo: -1, protests: 60 }, next: ['kon_fusk_armen'], tip: 'Armén kommer. Frågan är vems order den lyder när den väl är där.' },
      { text: 'BJUD IN OPPOSITIONEN TILL RUNDABORDSSAMTAL', cost: { pp: 20 }, temp: { unrest: -5, stability: 2 }, griev: -8, next: ['kon_fusk_kommission', 'kon_fusk_omval'], tip: 'Samtalen tar veckor. Gatorna är fulla under tiden.' },
    ],
  },
  {
    id: 'kon_fusk_armen', icon: '\u{1FA96}', chain: true, kind: 'frihet',
    title: 'SOLDATERNA SÄNKER VAPNEN',
    text: 'Den tredje natten med soldater på gatorna hände det som ingen hade räknat med. En pansarbataljon utanför {huvudstad} vägrade köra mot torget, och i gryningen delade soldaterna sitt frukostbröd med demonstranterna. Arméchefen ringde i morse och sa, mycket artigt, att armén "inte vänder sig mot sitt eget folk". Han väntar på ditt svar.',
    choices: [
      { text: 'AVGÅ OCH UTLYS NYVAL', temp: { stability: 4, polpower: -15, unrest: -10 }, rel: 10, griev: -20, ind: { demo: 0.8, trustgov: 4 }, tip: 'En värdig sorti. Historieböckerna blir vänliga.' },
      { text: 'BYT UT ARMÉCHEFEN', cost: { pp: 30 },
        risk: { chance: 0.35,
          win: { text: 'Den nya chefen lyder. Torget töms, men landet är inte detsamma.', temp: { statepower: 6, freedom: -6 }, griev: 10, ind: { demo: -0.8 } },
          lose: { text: 'Ingen general vill ta jobbet. Regeringen står helt ensam.', temp: { stability: -10, polpower: -10 }, griev: 10 } } },
      { text: 'GÖR UPP OM NYVAL — MED DIG SOM KANDIDAT', cost: { pp: 20 }, law: ['elections', 'free'], temp: { unrest: -8, stability: 2 }, griev: -12, ind: { demo: 0.5 }, next: ['kon_fusk_omval'], tip: 'Du får en chans till. En ärlig.' },
    ],
  },
  {
    id: 'kon_fusk_kommission', icon: '\u{1F4D1}', chain: true, kind: 'frihet',
    title: 'KOMMISSIONENS RAPPORT',
    text: 'Ett år efter valet har kommissionen lämnat sin rapport på sexhundra sidor. Fusket var organiserat, det betalades med pengar från ett byggbolag och det fanns personer i ditt eget partikansli som visste. Inga ministrar pekas ut med namn, men tre ledamöter har redan lämnat partiet. Pressen fick rapporten samtidigt som du.',
    choices: [
      { text: 'PUBLICERA ALLT OCH RENSA I PARTIET', cost: { pp: 20 }, perm: { corruption: -3 }, temp: { approval: 4, polpower: -4 }, griev: -12, ind: { trustgov: 4 }, tip: 'Det gör ont i partiet. Det gör gott i landet.' },
      { text: 'OBEROENDE VALMYNDIGHET OCH NY VALLAG', cost: { pp: 25, money: 200 }, law: ['elections', 'publicfund'], perm: { freedom: 2, stability: 1 }, griev: -10, ind: { demo: 0.5 }, tip: 'Nästa val blir det renaste i landets historia.' },
      { text: 'BEGRAV RAPPORTEN I ETT UTSKOTT', mod: 'cover_up', temp: { stability: 2, approval: -4 }, griev: 8, ind: { trustgov: -4 }, tip: 'Sexhundra sidor är tunga att lyfta. Pressen har redan lyft dem.' },
    ],
  },
  {
    id: 'kon_fusk_omval', icon: '\u{1F9FA}', chain: true, kind: 'frihet',
    title: 'OMVALET',
    text: 'Ett halvår efter skandalen går väljarna i {stad} till urnorna igen. Den här gången står valobservatörer från tjugo länder i varje vallokal och rösterna räknas i direktsändning. Valdeltagandet är det högsta på femtio år. Pensionärer har tagit med sig matsäck och fotograferar sig själva med sina röstkort.',
    choices: [
      { text: 'RESPEKTERA RESULTATET — VAD DET ÄN BLIR',
        risk: { chance: 0.55,
          win: { text: 'Ditt parti behåller platserna, ärligt den här gången. Segern smakar annorlunda.', temp: { approval: 6, stability: 4 }, griev: -12, ind: { demo: 0.4, turnout: 5 } },
          lose: { text: 'Oppositionen vinner stort i staden. Men du förlorade med heder.', temp: { polpower: -6, freedom: 3, stability: 3 }, griev: -12, ind: { demo: 0.4 } } } },
      { text: 'GÖR OMVALET TILL MALL FÖR HELA LANDET', cost: { money: 300 }, perm: { freedom: 2, stability: 1 }, griev: -10, ind: { trustgov: 4, demo: 0.3 }, tip: 'Matsäck och observatörer i varje vallokal.' },
      { text: 'SKICKA DINA MINISTRAR DIT FÖR ATT VALARBETA', cost: { pp: 10 }, temp: { polpower: 3, approval: 2 }, griev: -4, tip: 'Ministrarna delar ut kaffe. Väljarna dricker och röstar som de vill.' },
    ],
  },

  // ===== STREJKVINTERN =====
  // Arbetsrätten försämras → hamnen stannar → avtal i gryningen eller generalstrejk.
  {
    id: 'kon_strejk', icon: '\u{2693}', weight: 2, cooldown: 1200, kind: 'valfard', react: true,
    title: 'HAMNARBETARNA I {STAD} LÄGGER NER',
    text: 'Två veckor efter ändringen av {lag} har hamnarbetarna i {stad} gått ut i vild strejk. Lastbilschaufförerna vägrar köra förbi deras vakter och containrarna staplas på kajen. Fackens centralorganisation har kallat till krismöte och säger att {lag} måste tillbaka, annars blir det "en vinter som landet aldrig glömmer".',
    when: (c) => c.cut('unions', 'minimum_wage', 'workhours', 'vacation') && c.grievOf('valfard') > 10 && c.day > 30,
    choices: [
      { text: 'FÖRHANDLA MED FACKEN', cost: { pp: 15 }, temp: { unrest: -3 }, griev: -6, next: ['kon_strejk_avtal', 'kon_strejk_avtal', 'kon_strejk_hamn'], tip: 'Kaffe, bullar och mycket långa nätter.' },
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -15, temp: { polpower: -4, approval: 2 }, ind: { strikes: -40 }, next: ['kon_strejk_avtal', null], tip: 'Hamnen öppnar i morgon. Arbetsgivarna rasar i kväll.' },
      { text: 'BEGRÄNSA STREJKRÄTTEN', cost: { pp: 25 }, law: ['unions', 'weak'], temp: { statepower: 4, freedom: -3, unrest: 6 }, griev: 12, ind: { strikes: 60, trustgov: -5 }, next: ['kon_strejk_general', 'kon_strejk_general', 'kon_strejk_hamn'], tip: 'Att förbjuda en strejk har sällan stoppat en.' },
      { text: 'VÄNTA UT DEM', temp: { gdp: -2, unrest: 3 }, griev: 5, ind: { strikes: 40 }, next: ['kon_strejk_hamn', 'kon_strejk_general', null], tip: 'Strejkkassan räcker i tre veckor. Eller tre månader.' },
    ],
  },
  {
    id: 'kon_strejk_hamn', icon: '\u{1F6A2}', chain: true, kind: 'valfard',
    title: 'HAMNEN I {STAD} STÅR STILLA',
    text: 'Sjätte veckan med strejk i hamnen. Fyrtio fartyg ligger för ankar ute på redden, bilfabriken har stoppat bandet i brist på delar och apoteken varnar för att vissa mediciner tar slut till jul. Hamnarbetarnas strejkkassa räcker förvånansvärt länge, eftersom kollegor i {land} skickar pengar.',
    choices: [
      { text: 'MEDLARE MED MANDAT ATT GE EFTER', cost: { pp: 20 }, temp: { unrest: -5, gdp: 2 }, griev: -10, ind: { strikes: -40 }, next: ['kon_strejk_avtal'], tip: 'Båda sidor får säga att de vann.' },
      { text: 'SÄTT IN SOLDATER SOM HAMNARBETARE', cost: { man: 5 }, temp: { gdp: 2, unrest: 8, freedom: -3 }, griev: 10, ind: { strikes: 50, protests: 40 }, next: ['kon_strejk_general', null], tip: 'Soldaterna kan inte köra kranarna. Det tar dem två veckor att lära sig.' },
      { text: 'LÅT EXPORTEN STÅ', temp: { gdp: -4, income: -3 }, mod: 'downturn', griev: 4, ind: { gdpgrowth: -0.6 }, next: ['kon_strejk_avtal', 'kon_strejk_general'], tip: 'Varje dag kostar. Facket räknar med att du räknar.' },
    ],
  },
  {
    id: 'kon_strejk_general', icon: '\u{270A}', chain: true, kind: 'valfard',
    title: 'GENERALSTREJKEN',
    text: 'Klockan sex på måndagsmorgonen stannade landet. Bussar, tåg, sophämtning, skolor och fabriker. Bara akutmottagningarna och brandkåren är bemannade. Sjuhundratusen människor strejkar för att få tillbaka {lag}, och i {huvudstad} har stora torget blivit ett tältläger med soppkök och barnpassning.',
    choices: [
      { text: 'GE EFTER OCH ÅTERSTÄLL {LAG}', cost: { pp: 30 }, undo: true, temp: { polpower: -8, stability: 3 }, griev: -20, ind: { strikes: -60 }, next: ['kon_strejk_varen'], tip: 'En stor förlust för regeringen. Ett stort lugn för landet.' },
      { text: 'NÖDLAG OCH GRIP STREJKLEDARNA', law: ['civil_rights', 'emergency'], mod: 'general_strike', temp: { statepower: 6, freedom: -8, unrest: 12 }, rel: -8, griev: 15, ind: { demo: -0.6, protests: 60, trustgov: -8 }, next: ['kon_strejk_varen'], tip: 'Ledarna sitter inne. Strejken leds från cellen.' },
      { text: 'UTLYS NYVAL OM {LAG}', cost: { pp: 20 },
        risk: { chance: 0.5,
          win: { text: 'Väljarna ger dig stöd. Facken går tillbaka till jobbet med sänkta huvuden.', temp: { approval: 5, stability: 5 }, griev: -8 },
          lose: { text: 'Du förlorar valet. Den nya regeringen återställer allt.', temp: { polpower: -12, stability: 2 }, undo: true, griev: -15 } } },
    ],
  },
  {
    id: 'kon_strejk_avtal', icon: '\u{1F91D}', chain: true, kind: 'valfard',
    title: 'AVTALET I GRYNINGEN',
    text: 'Efter tre dygn i förhandlingsrummet skakade facken och arbetsgivarna hand klockan fem i morse. Avtalet ger lite till alla: kortare arbetstid i tunga yrken, en måttlig löneökning och en kommission om {lag}. Ute på kajen i {stad} startade den första kranen innan pressmeddelandet ens hade skickats ut.',
    choices: [
      { text: 'GÖR DET TILL ETT SAMHÄLLSKONTRAKT', cost: { pp: 20 }, perm: { stability: 3 }, mod: 'national_unity', griev: -12, ind: { strikes: -50, trustgov: 3 }, next: ['kon_strejk_varen', null], tip: 'Fred på arbetsmarknaden i tio år. Om alla håller vad de lovat.' },
      { text: 'BJUD PÅ FRUKOST I HAMNEN', cost: { money: 50 }, temp: { approval: 4, unrest: -3 }, griev: -6, tip: 'Hamnarbetarna äter. Fotograferna fotograferar.' },
      { text: 'LÅT PARTERNA TA ÄRAN', temp: { stability: 3 }, perm: { stability: 1 }, griev: -8, tip: 'Den som inte behöver äran får ofta freden.' },
    ],
  },
  {
    id: 'kon_strejk_varen', icon: '\u{1F337}', chain: true, kind: 'valfard',
    title: 'VÅREN EFTER STREJKVINTERN',
    text: 'Ett halvår efter den stora konflikten har snön smält, men något har förändrats. Facken har fått hundratusen nya medlemmar, mest unga, och de ställer högre krav än någonsin. Arbetsgivarna har slutat bjuda in till lunch. Ekonomerna räknar ut att strejkvintern kostade landet en procent av BNP, och båda sidor skyller på dig.',
    choices: [
      { text: 'ETT TREPARTSRÅD — STAT, FACK OCH ARBETSGIVARE', cost: { pp: 20 }, perm: { stability: 2 }, griev: -10, ind: { strikes: -30, trustgov: 2 }, tip: 'Ett bord där alla sitter. Varje månad.' },
      { text: 'STIMULERA EKONOMIN OCH TA IGEN FÖRLUSTEN', cost: { money: 600 }, temp: { gdp: 4, approval: 3 }, griev: -6, ind: { unemp: -0.3 }, tip: 'Det som förlorades i vintras tas igen i sommar.' },
      { text: 'GÅ VIDARE OCH PRATA OM NÅGOT ANNAT', temp: { approval: -2, stability: 1 }, griev: 4, ind: { trustgov: -2 }, tip: 'Väljarna pratar om det ändå.' },
    ],
  },

  // ===== KOMPETENSFLYKTEN =====
  // De utbildade flyttar → behålla, binda eller släppa → hemvändare, diaspora eller tomma labb.
  {
    id: 'kon_hjarna', icon: '\u{1F9F3}', weight: 2, cooldown: 1300, kind: 'ekonomi',
    title: 'LÄKARNA SOM PACKAR VÄSKORNA',
    text: 'Tre av fyra som tog läkarexamen i våras har sökt jobb utomlands. Sjukhusen i {land} erbjuder dubbla lönen, lägenhet och flytthjälp, och deras rekryterare står utanför universitetet i {huvudstad} med broschyrer. Samma sak händer bland ingenjörer och programmerare. Utbildningen betalade landet. Lönen betalar någon annan.',
    when: (c) => c.day > 80 && (c.cut('science_funding', 'education') || ((c.ind.youthunemp ?? 15) > 25 && c.st.qol < 0)),
    choices: [
      { text: 'HÖJ LÖNERNA OCH GE EN HEMVÄNDARBONUS', cost: { money: 700 }, perm: { research: 1 }, temp: { approval: 2 }, griev: -6, next: ['kon_hjarna_hem', 'kon_hjarna_hem', 'kon_hjarna_diaspora'], tip: 'Dyrt att behålla dem. Dyrare att förlora dem.' },
      { text: 'KRÄV TILLBAKA STUDIESKULDEN AV DEM SOM FLYTTAR', cost: { pp: 15 }, law: ['emigration', 'exittax'], temp: { income: 2, freedom: -2 }, griev: 4, next: ['kon_hjarna_ilska', 'kon_hjarna_tom'], tip: 'Rättvist på papperet. Ingen kommer hem för att slippa en räkning.' },
      { text: 'LÅT DEM GÅ — DE KOMMER TILLBAKA', temp: { stability: 1 }, perm: { research: -1 }, griev: 3, next: ['kon_hjarna_tom', 'kon_hjarna_diaspora'], tip: 'Vissa kommer tillbaka. Om tjugo år, med barn som inte talar språket.' },
    ],
  },
  {
    id: 'kon_hjarna_tom', icon: '\u{1F97C}', chain: true, kind: 'ekonomi',
    title: 'LABBEN STÅR TOMMA',
    text: 'Två år efter den stora utflyttningen har universitetssjukhuset i {stad} stängt två avdelningar i brist på läkare. Forskningsinstitutet har förlorat hälften av sina forskare, och tre teknikföretag har flyttat utvecklingen till {land}, där personalen redan bor. Landets mest citerade forskare under fyrtio arbetar alla utomlands.',
    choices: [
      { text: 'ETT STORT FORSKNINGSLYFT', cost: { money: 900, rp: 30 }, law: ['science_funding', 'generous'], perm: { research: 3 }, griev: -10, next: ['kon_hjarna_hem', null], tip: 'Labben fylls igen. Det tar fem år.' },
      { text: 'REKRYTERA LÄKARE FRÅN ANDRA LÄNDER', cost: { money: 400 }, perm: { welfare: 1 }, temp: { immigration: 3 }, griev: -4, ind: { migrants: 0.2 }, tip: 'Avdelningarna öppnar. Någon annans land får samma problem.' },
      { text: 'ACCEPTERA ATT VI ÄR ETT LITET LAND', perm: { research: -2, gdp: -1 }, temp: { approval: -3 }, griev: 6, tip: 'Små länder kan vara stora. Men inte utan folk.' },
    ],
  },
  {
    id: 'kon_hjarna_diaspora', icon: '\u{1F4E8}', chain: true, kind: 'ekonomi',
    title: 'PENGARNA FRÅN DEM SOM FLYTTADE',
    text: 'Flera år efter att de första läkarna flyttade har något överraskande hänt. De utlandsboende skickar hem lika mycket pengar som hela turistnäringen drar in, och ett nätverk av forskare i {land} har startat tre företag här hemma. En av dem, en programmerare från {stad}, har köpt nya datorer till sin gamla gymnasieskola.',
    choices: [
      { text: 'BJUD IN DIASPORAN TILL ETT STORT MÖTE', cost: { money: 200 }, mod: 'foreign_investment', temp: { approval: 3 }, griev: -6, tip: 'De kommer hem en vecka. Några stannar.' },
      { text: 'DUBBELT MEDBORGARSKAP FÖR UTLANDSBOENDE', cost: { pp: 15 }, law: ['emigration', 'dualcitizen'], perm: { research: 1 }, temp: { approval: 2 }, griev: -6, tip: 'De är fortfarande våra. Nu står det i passet också.' },
      { text: 'BESKATTA PENGARNA SOM SKICKAS HEM', res: { money: 300 }, temp: { approval: -3 }, griev: 4, tip: 'En liten avgift. Snart reser pengarna i resväskor i stället.' },
    ],
  },
  {
    id: 'kon_hjarna_hem', icon: '\u{1F6EC}', chain: true, kind: 'ekonomi',
    title: 'HEMVÄNDARNA',
    text: 'Ett år efter lönelyftet har sexhundra läkare och ingenjörer flyttat hem. Många har barn som ska börja skolan och säger att de vill att barnen ska växa upp nära mormor. De har med sig erfarenheter från några av världens bästa sjukhus och företag, och en av dem har redan öppnat en ny klinik i {stad}.',
    choices: [
      { text: 'GE DEM ANSVARET FÖR NYA FORSKNINGSCENTRA', cost: { money: 400, rp: 20 }, perm: { research: 2 }, mod: 'tech_breakthrough', griev: -8, tip: 'Deras kontaktnät följer med hem.' },
      { text: 'GÖR BONUSEN PERMANENT', cost: { money: 300 }, perm: { research: 1, welfare: 1 }, griev: -6, tip: 'Fler kommer hem. Kassan märker det varje år.' },
      { text: 'BERÄTTA DERAS HISTORIER I TV', temp: { approval: 4, qol: 1 }, griev: -5, tip: 'Ett reportage om att flytta hem. Tretusen nya ansökningar.' },
    ],
  },
  {
    id: 'kon_hjarna_ilska', icon: '\u{1F6C2}', chain: true, kind: 'ekonomi',
    title: 'DE SOM INTE FICK RESA',
    text: 'Ett halvår efter att avgiften för utflyttning infördes har sjukhusen fått behålla sina läkare, men ingen är glad. Unga läkare som ville vidareutbilda sig utomlands i två år och sedan komma hem sitter fast. Läkarförbundet har varslat om konflikt, och utländska universitet har slutat ta emot utbytesstudenter härifrån.',
    choices: [
      { text: 'UNDANTAG FÖR DEM SOM LOVAR ATT KOMMA HEM', cost: { pp: 15 }, law: ['emigration', 'free'], temp: { freedom: 3, approval: 3 }, griev: -8, next: ['kon_hjarna_hem', 'kon_hjarna_diaspora'], tip: 'De flesta håller sitt löfte. Inte alla.' },
      { text: 'HÖJ LÖNERNA I STÄLLET', cost: { money: 500 }, perm: { welfare: 1 }, temp: { approval: 3 }, griev: -8, next: ['kon_hjarna_hem', null], tip: 'Morot i stället för piska. Det brukar fungera bättre.' },
      { text: 'BEHÅLL AVGIFTEN', temp: { statepower: 2, freedom: -2 }, perm: { research: -1 }, griev: 6, ind: { strikes: 30 }, next: ['kon_hjarna_tom', null], tip: 'Läkarna stannar. De nya studenterna väljer andra yrken.' },
    ],
  },

  // ===== KORRUPTIONSAFFÄREN =====
  // En bro för dyr → utredning, sparken eller mörkläggning → läcka, reporter i häktet, dom eller misstroende.
  {
    id: 'kon_korr', icon: '\u{1F309}', weight: 2, cooldown: 1300, kind: 'frihet',
    title: 'BRON SOM KOSTADE TRE GÅNGER SÅ MYCKET',
    text: 'En lokaltidning i {stad} har granskat bygget av den nya bron. Den kostade tre gånger så mycket som beräknat, byggbolaget fick kontraktet utan upphandling och bolagets ägare är svåger till en av dina ministrar. Reportern som skrev artikeln är tjugosex år gammal och har jobbat på tidningen i åtta månader.',
    when: (c) => c.day > 100 && (c.cut('anti_corruption', 'lobbying') || c.st.corruption > 25),
    choices: [
      { text: 'OBEROENDE UTREDNING MED FULLA BEFOGENHETER', cost: { money: 250 }, temp: { approval: 2 }, perm: { corruption: -1 }, griev: -6, next: ['kon_korr_dom', 'kon_korr_toppen'], tip: 'Utredare som inte går att ringa. Ovanligt och obekvämt.' },
      { text: 'GE MINISTERN SPARKEN', cost: { pp: 10 }, temp: { approval: 3, stability: -1 }, griev: -4, next: ['kon_korr_toppen', null], tip: 'En minister mindre. Svågern finns kvar.' },
      { text: 'MÖRKLÄGG — DET ÄR BARA EN LOKALTIDNING', mod: 'cover_up', temp: { stability: 2 }, griev: 4, next: ['kon_korr_lacka', 'kon_korr_reporter'], tip: 'Lokaltidningar har en tendens att bli rikstidningar.' },
    ],
  },
  {
    id: 'kon_korr_lacka', icon: '\u{1F4E8}', chain: true, kind: 'frihet',
    title: 'DEN STORA LÄCKAN',
    text: 'Fyra månader efter artikeln om bron har en okänd källa skickat fyrtiotusen interna dokument till tidningar i sex länder. Mejlen visar att svågerns bolag fått elva kontrakt till på samma sätt, och att en del av pengarna gick till ett konto i {land}. Ditt namn förekommer fyra gånger, alltid tillsammans med ordet "lunch".',
    choices: [
      { text: 'BE OM URSÄKT OCH ÖPPNA ALLA BÖCKER', cost: { pp: 25 }, perm: { corruption: -3 }, temp: { approval: -3, polpower: -4 }, unmod: 'cover_up', griev: -10, ind: { trustgov: 2 }, next: ['kon_korr_dom'], tip: 'Ärligheten svider i dag. Lögnen svider i tio år.' },
      { text: 'SKYLL PÅ SVÅGERN', temp: { approval: -4 }, mod: 'scandal', griev: 6, ind: { trustgov: -5 }, next: ['kon_korr_toppen', 'kon_korr_dom'], tip: 'Svågern har också mejl. Och en advokat.' },
      { text: 'JAGA LÄCKAN I STÄLLET', cost: { pp: 15 }, temp: { statepower: 4, freedom: -4 }, griev: 10, ind: { pressfree: -5, trustgov: -6 }, next: ['kon_korr_reporter', 'kon_korr_toppen'], tip: 'Att jaga budbäraren har aldrig fått en nyhet att försvinna.' },
    ],
  },
  {
    id: 'kon_korr_reporter', icon: '\u{1F4F0}', chain: true, kind: 'frihet',
    title: 'REPORTERN ÄR ANHÅLLEN',
    text: 'Klockan fem i morse hämtades reportern från {stad} av polisen, misstänkt för att ha spridit statshemligheter. Hennes dator och telefon är beslagtagna. Utanför polishuset står journalister från hela landet med tejp över munnen, och pressfrihetsorganisationer i {land} har satt landet på sin lista över länder att hålla ögonen på.',
    choices: [
      { text: 'SLÄPP HENNE OCH BE OM URSÄKT', cost: { pp: 20 }, temp: { freedom: 3, approval: 2 }, griev: -10, ind: { pressfree: 3 }, next: ['kon_korr_dom', 'kon_korr_toppen'], tip: 'Hon blir årets journalist ändå. Bättre att du inte blir årets skurk.' },
      { text: 'ÅTALA HENNE', law: ['press', 'libel'], temp: { statepower: 5, freedom: -6, approval: -6 }, rel: -10, griev: 14, mod: 'martyr', ind: { pressfree: -8, demo: -0.4 }, next: ['kon_korr_toppen'], tip: 'Rättegången blir den mest bevakade i landets historia.' },
      { text: 'LÅT DOMSTOLEN AVGÖRA', temp: { freedom: -2, stability: 1 }, griev: 5, ind: { pressfree: -3 }, next: ['kon_korr_dom', null], tip: 'Domstolen släpper henne efter tre dagar. Skadan är redan skedd.' },
    ],
  },
  {
    id: 'kon_korr_toppen', icon: '\u{1F3DB}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'SPÅREN LEDER TILL REGERINGEN',
    text: 'Ett halvår efter artikeln om bron har åklagaren begärt att få förhöra två ministrar och din egen stabschef. Pengarna från kontot i {land} har spårats till en stiftelse som betalade partiets senaste valkampanj. Oppositionen har begärt misstroendeomröstning, och flera av dina egna ledamöter har slutat svara i telefon.',
    choices: [
      { text: 'SAMARBETA FULLT UT MED ÅKLAGAREN', cost: { pp: 20 }, perm: { corruption: -3 }, temp: { polpower: -6, stability: -2 }, griev: -10, ind: { trustgov: 3 }, next: ['kon_korr_dom'], tip: 'Några i din närhet åker fast. Du själv klarar dig. Kanske.' },
      { text: 'RID UT MISSTROENDEOMRÖSTNINGEN',
        risk: { chance: 0.5,
          win: { text: 'Du klarar omröstningen med tre rösters marginal.', temp: { stability: 2, polpower: -3 }, griev: 4 },
          lose: { text: 'Misstroendet går igenom. Du leder en svag övergångsregering.', temp: { polpower: -12, stability: -6 }, griev: -5 } } },
      { text: 'FÖRBJUD FÖRETAGSPENGAR I POLITIKEN', cost: { pp: 25 }, law: ['lobbying', 'publiconly'], perm: { corruption: -4 }, temp: { polpower: -4 }, griev: -12, next: ['kon_korr_dom', null], tip: 'Partierna får klara sig på medlemsavgifter. Ditt också.' },
    ],
  },
  {
    id: 'kon_korr_dom', icon: '\u{2696}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'DOMEN I BROMÅLET',
    text: 'Ett och ett halvt år efter tidningsartikeln har domstolen i {stad} dömt byggbolagets ägare, två tjänstemän och en före detta minister till fängelse. Pengarna från kontot i {land} har betalats tillbaka, och reportern som skrev den första artikeln har fått landets största journalistpris. Förtroendet för domstolarna är det högsta på tio år.',
    choices: [
      { text: 'INRÄTTA EN MYNDIGHET MOT KORRUPTION', cost: { money: 300, pp: 15 }, law: ['anti_corruption', 'agency'], perm: { corruption: -4 }, griev: -10, ind: { trustgov: 4 }, tip: 'Nästa svåger får det svårare.' },
      { text: 'SKYDDA VISSELBLÅSARE I LAG', cost: { pp: 15 }, law: ['anti_corruption', 'whistle'], perm: { corruption: -3, freedom: 1 }, griev: -8, tip: 'Den som ser något ska kunna säga något.' },
      { text: 'LÅT DOMEN TALA FÖR SIG SJÄLV', temp: { approval: 3, stability: 2 }, perm: { corruption: -1 }, griev: -5, tip: 'Rättvisan har talat. Den talade tydligt.' },
    ],
  },

  // ===== FABRIKEN I STADEN =====
  // Stålverket stänger → staten köper, omställning eller marknaden → en ny näring eller en stad som töms.
  {
    id: 'kon_fabrik', icon: '\u{1F3ED}', weight: 2, cooldown: 1300, kind: 'kris',
    title: 'STÅLVERKET I {STAD} SLÄCKER MASUGNEN',
    text: 'Efter hundratjugo år slocknar masugnen i {stad}. Ägarna flyttar produktionen till {land}, där lönerna är lägre, och fyratusen människor förlorar jobbet samma dag. Tretusen till jobbar hos underleverantörer. På parkeringen utanför grindarna står en svetsare som har jobbat där i trettiofem år och inte vet vad han ska säga till barnbarnen.',
    when: (c) => c.day > 60 && ((c.ind.unemp ?? 6) > 9 || (c.changed('globalism', 'industrial_subsidies') && c.st.factory < 15)),
    choices: [
      { text: 'STATEN KÖPER STÅLVERKET', cost: { money: 1200 }, law: ['ownership', 'strategic'], temp: { approval: 5, unrest: -4 }, griev: -12, next: ['kon_fabrik_statlig'], tip: 'Masugnen brinner igen. Förlusterna också.' },
      { text: 'OMSTÄLLNING — UTBILDNING OCH NYA FÖRETAG', cost: { money: 600 }, perm: { qol: 1 }, temp: { approval: 2 }, griev: -6, next: ['kon_fabrik_omstallning', 'kon_fabrik_omstallning', 'kon_fabrik_tom'], tip: 'En svetsare kan bli mycket. Men det tar tid.' },
      { text: 'MARKNADEN HAR TALAT', temp: { gdp: 1, approval: -5, unrest: 4 }, griev: 10, ind: { unemp: 0.3 }, next: ['kon_fabrik_tom', 'kon_fabrik_tom', 'kon_fabrik_data'], tip: 'Marknaden talade. Staden lyssnade inte.' },
    ],
  },
  {
    id: 'kon_fabrik_statlig', icon: '\u{1F525}', chain: true, kind: 'kris',
    title: 'STATENS STÅLVERK',
    text: 'Två år efter att staten tog över går stålverket i {stad} fortfarande med förlust. Varje jobb kostar skattebetalarna lika mycket som en sjuksköterskelön om året, och stålpriset på världsmarknaden har fallit ännu mer. Men staden lever, bageriet har öppet och fotbollslaget har kvar sin sponsor.',
    choices: [
      { text: 'STÄLL OM TILL GRÖNT STÅL', cost: { money: 900, rp: 30 },
        risk: { chance: 0.6,
          win: { text: 'Det gröna stålet blir en exportsuccé. Kunderna står i kö.', perm: { factory: 3, research: 1 }, mod: 'industrial_boom', griev: -10 },
          lose: { text: 'Tekniken krånglar. Det blir två år till med förluster.', temp: { income: -4 }, griev: 4 } } },
      { text: 'SÄLJ DET TILL EN UTLÄNDSK KÖPARE', res: { money: 500 }, temp: { approval: -4 }, griev: 6, next: ['kon_fabrik_tom', null], tip: 'Köparen lovar att behålla jobben. I två år.' },
      { text: 'FORTSÄTT BETALA FÖRLUSTERNA', perm: { income: -2 }, temp: { approval: 2, stability: 1 }, griev: -4, tip: 'Det är dyrt att hålla en stad vid liv. Dyrare att låta den dö.' },
    ],
  },
  {
    id: 'kon_fabrik_omstallning', icon: '\u{1F468}\u{200D}\u{1F527}', chain: true, kind: 'kris',
    title: 'FRÅN SVETSARE TILL DRIFTTEKNIKER',
    text: 'Två år efter att masugnen slocknade har sju av tio av de uppsagda i {stad} fått nya jobb. Svetsaren från parkeringen är drifttekniker på ett vindkraftsföretag och säger att han inte har haft så roligt sedan han var ung. Kommunen har startat en yrkeshögskola i det gamla kontorshuset vid verket.',
    choices: [
      { text: 'GÖR {STAD} TILL MODELL FÖR HELA LANDET', cost: { money: 500 }, perm: { qol: 1, gdp: 1 }, griev: -10, ind: { unemp: -0.3 }, tip: 'Omställning är ett hantverk. Nu kan landet det.' },
      { text: 'GE YRKESHÖGSKOLAN PENGAR I TIO ÅR', cost: { money: 300 }, perm: { research: 1 }, griev: -6, tip: 'Utbildning är det enda som aldrig flyttar till ett låglöneland.' },
      { text: 'BESÖK SVETSAREN PÅ HANS NYA JOBB', temp: { approval: 4 }, griev: -5, tip: 'Han bjuder på kaffe ur termos. Bilden blir årets pressfoto.' },
    ],
  },
  {
    id: 'kon_fabrik_tom', icon: '\u{1F3DA}\u{FE0F}', chain: true, kind: 'kris',
    title: 'STADEN SOM TÖMDES',
    text: 'Tre år efter att masugnen slocknade har {stad} förlorat var femte invånare. De unga har flyttat till {huvudstad}, skolan har slagits ihop med grannortens och huspriserna har halverats. På kvällarna lyser det i vart tredje fönster. I lokalvalet fick ett nytt protestparti fyrtio procent med parollen "De glömde oss".',
    choices: [
      { text: 'FLYTTA EN MYNDIGHET DIT', cost: { money: 600 }, perm: { qol: 1 }, temp: { approval: 3 }, griev: -10, ind: { unemp: -0.2 }, next: ['kon_fabrik_data', null], tip: 'Fyrahundra tjänstemän och deras familjer. Det märks i en liten stad.' },
      { text: 'GÖR MASUGNEN TILL INDUSTRIMUSEUM', cost: { money: 300 }, temp: { qol: 2, approval: 2 }, griev: -5, ind: { tourists: 5 }, tip: 'Både sorgligt och vackert. Turisterna köper vykort.' },
      { text: 'MÖT PROTESTPARTIET', cost: { pp: 15 },
        risk: { chance: 0.5,
          win: { text: 'Ni hittar gemensamma frågor. Protestpartiet blir ett lokalt samarbetsparti.', temp: { stability: 3, unrest: -4 }, griev: -8 },
          lose: { text: 'Mötet blir ett tv-spektakel och partiet växer i hela landet.', temp: { polpower: -6, unrest: 5 }, griev: 6 } } },
      { text: 'STÄDER KOMMER OCH GÅR', perm: { gdp: -1 }, temp: { approval: -5, unrest: 4 }, griev: 10, ind: { trustgov: -4 }, next: ['kon_fabrik_val'], tip: 'De gör det. Väljarna också.' },
    ],
  },
  {
    id: 'kon_fabrik_data', icon: '\u{1F5A5}\u{FE0F}', chain: true, kind: 'kris',
    title: 'DATACENTRET VID MASUGNEN',
    text: 'Två år efter nedläggningen har ett internationellt teknikföretag köpt den gamla industritomten i {stad}. Kylvattnet från älven, de kraftiga elledningarna till verket och folk som är vana vid skiftarbete gjorde staden perfekt för ett datacenter. Det blir åttahundra jobb, och fyrahundra av dem går till före detta stålarbetare.',
    choices: [
      { text: 'BYGG UT ELNÄTET FÖR FLER', cost: { money: 500 }, perm: { factory: 2, gdp: 1 }, mod: 'foreign_investment', griev: -8, tip: 'Ett datacenter lockar fler. Datacenter gillar sällskap.' },
      { text: 'KRÄV ATT SPILLVÄRMEN VÄRMER STADEN', cost: { pp: 10 }, perm: { qol: 1 }, temp: { approval: 3 }, griev: -6, tip: 'Servrarnas värme värmer skolan och simhallen.' },
      { text: 'TACKA OCH LÅT DEM BYGGA I FRED', temp: { gdp: 2, approval: 2 }, griev: -5, tip: 'De bästa företagen vill helst bara få bygga.' },
    ],
  },
  {
    id: 'kon_fabrik_val', icon: '\u{1F4E2}', chain: true, kind: 'kris',
    title: 'DE GLÖMDA RÖSTAR',
    text: 'Fyra år efter att masugnen i {stad} slocknade får protestpartiet "De glömde oss" arton procent i parlamentsvalet. De vinner i varje bruksort i landet. Deras ledare, en före detta fackordförande från stålverket, har inget program utöver ilska, men ilskan räcker långt. Ingen regering kan bildas utan dem.',
    choices: [
      { text: 'BJUD IN DEM I REGERINGEN', cost: { pp: 20 }, temp: { stability: 3, polpower: -6 }, griev: -12, ind: { trustgov: 2 }, tip: 'Makt gör protestpartier ansvarsfulla. Eller tvärtom.' },
      { text: 'EN STOR SATSNING PÅ BRUKSORTERNA', cost: { money: 1000 }, perm: { qol: 1, factory: 1 }, temp: { approval: 4 }, griev: -15, ind: { unemp: -0.4 }, tip: 'Det hade varit billigare för fyra år sedan.' },
      { text: 'HÅLL DEM UTANFÖR TILL VARJE PRIS', temp: { stability: -4, unrest: 6 }, griev: 10, ind: { trustgov: -5, turnout: 3 }, tip: 'De utestängda blir fler för varje val.' },
    ],
  },

  // ===== TORKAN OCH BRÖDET =====
  // Två torra somrar → lager, exportstopp eller dyrt bröd → regn, kravaller eller en tredje torr sommar.
  {
    id: 'kon_torka', icon: '\u{1F33E}', weight: 2, cooldown: 1300, kind: 'kris',
    title: 'ANDRA SOMMAREN UTAN REGN',
    text: 'För andra sommaren i rad har det knappt regnat. Veteskörden är halverad, åarna runt {stad} har torkat ut och bönderna säljer kor som de inte har foder till. Brödpriset har stigit med en fjärdedel sedan i våras. Meteorologerna säger att nästa sommar kan bli lika torr, och lantbrukarnas förbund begär ett krismöte.',
    when: (c) => c.day > 90 && (c.ind.agri ?? 3) > 4 && ((c.ind.foodprice ?? 100) > 115 || (c.ind.waterstress ?? 10) > 40) && c.st.qol < 20,
    choices: [
      { text: 'ÖPPNA BEREDSKAPSLAGREN OCH STÖD BÖNDERNA', cost: { money: 600 }, temp: { qol: 2, approval: 3 }, griev: -8, next: ['kon_torka_regn', 'kon_torka_tredje'], tip: 'Lagren töms nu. Hoppas att de inte behövs nästa år.' },
      { text: 'FÖRBJUD EXPORT AV SPANNMÅL', cost: { pp: 15 }, law: ['globalism', 'protectionism'], temp: { qol: 1 }, rel: -6, griev: -4, next: ['kon_torka_granne', 'kon_torka_regn'], tip: 'Brödet stannar hemma. Grannarna blir hungriga.' },
      { text: 'LÅT PRISERNA STIGA', temp: { approval: -4, gdp: 1 }, griev: 8, ind: { infl: 1 }, next: ['kon_torka_brod', 'kon_torka_tredje'], tip: 'Höga priser lockar fram mer mat. Till slut.' },
    ],
  },
  {
    id: 'kon_torka_brod', icon: '\u{1F35E}', chain: true, kind: 'kris',
    title: 'BRÖDKRAVALLERNA',
    text: 'En vinter efter torkan har brödpriset fördubblats. I {stad} stormade hundratals människor ett spannmålslager i natt och bar ut säckar med mjöl, medan polisen stod och såg på. I fattigare stadsdelar har barn slutat komma till skolan eftersom de går hemifrån utan frukost, och föräldrar står i kö till kyrkornas soppkök.',
    choices: [
      { text: 'GRATIS SKOLLUNCH OCH BRÖDBIDRAG', cost: { money: 700 }, temp: { approval: 5, qol: 3, unrest: -5 }, perm: { welfare: 1 }, griev: -12, tip: 'Inget barn ska behöva gå hungrigt till skolan.' },
      { text: 'PRISTAK PÅ BRÖD', cost: { pp: 15 }, law: ['price_controls', 'caps'], temp: { approval: 4, unrest: -3 }, griev: -8, next: ['kon_torka_tredje', null], tip: 'Billigt bröd. Om det finns något.' },
      { text: 'MILITÄRVAKT VID LAGREN', temp: { safety: 3, unrest: 8, freedom: -3 }, griev: 10, ind: { protests: 60, trustgov: -5 }, next: ['kon_torka_tredje', null], tip: 'Lagren skyddas. Hungern gör det inte.' },
    ],
  },
  {
    id: 'kon_torka_tredje', icon: '\u{1F525}', chain: true, kind: 'kris',
    title: 'DEN TREDJE TORRA SOMMAREN',
    text: 'Meteorologerna hade rätt. Den tredje sommaren är den torraste på hundra år. Skogsbränder har brunnit i veckor norr om {stad}, grundvattnet är så lågt att brunnarna sinar och hälften av landets bönder säger att de inte klarar ett år till. Torkan är inte längre en naturkatastrof. Den är det nya vädret.',
    choices: [
      { text: 'BYGG BEVATTNING OCH VATTENRESERVOARER', cost: { money: 1000 }, law: ['water', 'publicinvest'], perm: { qol: 1, factory: 1 }, griev: -10, next: ['kon_torka_regn'], tip: 'Dyrt. Men det regnar inte mer av att man väntar.' },
      { text: 'SATSA PÅ TORKTÅLIGA GRÖDOR', cost: { money: 400, rp: 30 }, law: ['agriculture', 'biotech'], perm: { research: 1 }, griev: -6, next: ['kon_torka_regn', null], tip: 'Forskarna har ett vete som klarar sig på halva vattnet.' },
      { text: 'HOPPAS PÅ REGN', mod: 'natural_disaster', temp: { approval: -5, qol: -3 }, griev: 10, ind: { infl: 1 }, tip: 'Mat på hyllorna, importerad. Bönderna säljer gården.' },
    ],
  },
  {
    id: 'kon_torka_granne', icon: '\u{1F69B}', chain: true, kind: 'kris',
    title: '{GRANNE} SAKNAR VÅRT VETE',
    text: 'Ett halvår efter exportförbudet har brödpriserna i {granne} stigit med femtio procent, eftersom de köpte en tredjedel av sitt vete härifrån. Deras regering kallar förbudet "ett svek mellan grannar", och deras tv visar bilder på tomma bagerier. Här hemma klagar bönderna på att de inte längre får sälja till det högsta priset.',
    choices: [
      { text: 'HÄV FÖRBUDET OCH SKICKA NÖDHJÄLP', cost: { money: 300 }, law: ['globalism', 'balanced'], rel: 10, temp: { approval: -2 }, griev: 2, tip: 'Grannar man hjälper i nöd glömmer det inte.' },
      { text: 'SÄLJ TILL DEM — TILL ETT SÄRSKILT PRIS', res: { money: 400 }, rel: -4, temp: { gdp: 1 }, griev: -2, tip: 'Det kallas affärer. De kallar det något annat.' },
      { text: 'VÅRT FOLK GÅR FÖRST', temp: { approval: 3, qol: 1 }, rel: -10, griev: -3, tip: 'Grannar har långt minne.' },
    ],
  },
  {
    id: 'kon_torka_regn', icon: '\u{1F327}\u{FE0F}', chain: true, kind: 'kris',
    title: 'REGNET KOM',
    text: 'Efter två torra år kom regnet i maj och slutade inte förrän i juni. Åkrarna runt {stad} är gröna igen, dammarna är fulla och skörden ser ut att bli den största på ett decennium. Bönderna dansade på torget i regnet. Brödpriset har börjat falla, och beredskapslagren kan fyllas på igen.',
    choices: [
      { text: 'FYLL LAGREN — NÄSTA TORKA KOMMER', cost: { money: 300 }, perm: { stability: 2 }, griev: -8, tip: 'Regnet tar slut. Lagren gör det inte, om man fyller dem.' },
      { text: 'SKÖRDEFEST I HELA LANDET', cost: { money: 100 }, temp: { approval: 5, qol: 3 }, mod: 'national_unity', griev: -8, tip: 'Dragspel, nybakat bröd och ett lättat land.' },
      { text: 'SÄLJ ÖVERSKOTTET UTOMLANDS', res: { money: 500 }, temp: { gdp: 2 }, rel: 3, griev: -4, tip: 'Det som är för mycket här är för lite någon annanstans.' },
    ],
  },

  // ===== GENERALENS AMBITION =====
  // En svag demokrati och en general med publik → avsked, ministerpost eller kupp.
  {
    id: 'kon_general', icon: '\u{1F396}\u{FE0F}', weight: 2, cooldown: 1500, kind: 'frihet',
    title: 'TALET PÅ KASERNGÅRDEN',
    text: 'Generalmajor Varga, chef för landets största armékår, höll i går ett tal för tvåtusen soldater på kaserngården i {stad}. Han talade om "politiker som sviker nationen" och om "armén som landets sista ansvarsfulla institution". Talet var inte godkänt av försvarsministern. Det filmades, och nästan varje officer i landet har delat klippet.',
    when: (c) => c.day > 120 && c.demo < 5.5 && c.st.stability < 10 && c.ideo !== 'stratocracy',
    choices: [
      { text: 'AVSKEDA HONOM I MORGON BITTI', cost: { pp: 20 }, next: ['kon_general_lugn', 'kon_general_lugn', 'kon_general_kupp'],
        risk: { chance: 0.6,
          win: { text: 'Varga lämnar kasernen utan ett ord. Officerarna förstår budskapet.', temp: { stability: 3, statepower: 3 }, ind: { demo: 0.2 } },
          lose: { text: 'Han vägrar gå, och regementet ställer sig bakom honom.', temp: { stability: -6, statepower: -4 }, griev: 6 } } },
      { text: 'GÖR HONOM TILL FÖRSVARSMINISTER', cost: { pp: 10 }, temp: { milpower: 4, readiness: 4, stability: 2 }, griev: 4, ind: { demo: -0.3 }, next: ['kon_general_minister'], tip: 'Håll dina fiender nära. Och ge dem ett skrivbord.' },
      { text: 'HÖJ OFFICERSLÖNERNA', cost: { money: 500 }, temp: { readiness: 3, stability: 2 }, griev: -2, next: ['kon_general_lugn', 'kon_general_minister', null], tip: 'Nöjda officerare håller sällan tal.' },
      { text: 'LÅTSAS ATT DU INTE HÖRDE', temp: { statepower: -3 }, griev: 3, next: ['kon_general_minister', 'kon_general_kupp', null], tip: 'Han hörde inte dig heller.' },
    ],
  },
  {
    id: 'kon_general_minister', icon: '\u{1F454}', chain: true, kind: 'frihet',
    title: 'GENERALEN I REGERINGEN',
    text: 'Ett halvår efter talet på kaserngården sitter Varga i regeringen, och han har varit flitig. Han har bytt ut fyra regementschefer mot sina egna officerare, tagit kontroll över gränspolisen och kräver nu att säkerhetstjänsten ska lyda under hans departement. På regeringens möten hälsar han inte längre på någon.',
    choices: [
      { text: 'SÄTT STOPP — TILLBAKA TILL LEDET', cost: { pp: 30 }, next: ['kon_general_lugn', 'kon_general_kupp'],
        risk: { chance: 0.5,
          win: { text: 'Han avgår, sur men lydig. Den civila kontrollen är återställd.', temp: { stability: 4 }, griev: -8, ind: { demo: 0.4 } },
          lose: { text: 'Han vägrar avgå och flyttar in i försvarshögkvarteret.', temp: { stability: -8 }, griev: 8 } } },
      { text: 'GE HONOM SÄKERHETSTJÄNSTEN OCKSÅ', law: ['surveillance', 'mass'], temp: { statepower: 6, freedom: -5, milpower: 3 }, griev: 8, ind: { demo: -0.6, pressfree: -4 }, next: ['kon_general_kupp', 'kon_general_kupp', null], tip: 'Han har armén, gränsen och hemligheterna. Vad har du?' },
      { text: 'STÄRK PARLAMENTETS FÖRSVARSUTSKOTT', cost: { pp: 15, money: 200 }, temp: { freedom: 2, stability: 2 }, griev: -4, ind: { demo: 0.2 }, next: ['kon_general_lugn', null], tip: 'Ledamöter som ställer frågor. Han tycker inte om frågor.' },
    ],
  },
  {
    id: 'kon_general_kupp', icon: '\u{1F4FB}', chain: true, kind: 'frihet',
    title: 'PANSARVAGNAR VID RADIOHUSET',
    text: 'Klockan fyra i natt rullade pansarvagnar upp utanför radiohuset i {huvudstad}. Klockan fem läste en officer upp ett uttalande om att "armén tagit ansvar för nationens framtid". Men flera regementen har inte anslutit sig, polisen lyder fortfarande regeringen och tusentals människor går mot radiohuset med flaggor.',
    choices: [
      { text: 'GÅ UT TILL FOLKET OCH VÄGRA GE UPP', next: ['kon_general_efter'],
        risk: { chance: 0.6,
          win: { text: 'Folket fyller gatorna och kuppen kollapsar före lunch.', temp: { stability: 6, approval: 10 }, mod: 'national_unity', griev: -15, ind: { demo: 0.5 } },
          lose: { text: 'Kuppmakarna håller huvudstaden. Regeringen flyr till {stad}.', temp: { stability: -15, polpower: -15, statepower: -10 }, griev: 15, ind: { demo: -1.2 } } } },
      { text: 'FÖRHANDLA MED GENERALERNA', cost: { pp: 30 }, temp: { stability: 3, freedom: -6, statepower: -4 }, griev: 10, ind: { demo: -0.8 }, next: ['kon_general_efter'], tip: 'Du behåller titeln. De behåller vapnen.' },
      { text: 'BE OMVÄRLDEN OM HJÄLP', cost: { pp: 15 }, rel: 10, next: ['kon_general_efter'],
        risk: { chance: 0.5,
          win: { text: 'Sanktionshot och samtal från tolv huvudstäder. Kuppen faller ihop.', temp: { stability: 4 }, griev: -10, ind: { demo: 0.3 } },
          lose: { text: 'Omvärlden uttrycker oro. Det är allt den gör.', temp: { stability: -8 }, griev: 8 } } },
    ],
  },
  {
    id: 'kon_general_lugn', icon: '\u{1F3F3}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'KASERNERNA ÄR TYSTA',
    text: 'Ett år efter talet på kaserngården har armén fått en ny chef, utsedd av parlamentet efter öppna utfrågningar. Officersutbildningen har en ny kurs i demokrati och folkrätt, och de flesta officerare svarar i en enkät att de tycker att den är bra. Varga skriver memoarer i en villa vid kusten. Inget förlag vill ge ut dem.',
    choices: [
      { text: 'SKRIV IN CIVIL KONTROLL I GRUNDLAGEN', cost: { pp: 25 }, perm: { stability: 3, freedom: 1 }, griev: -10, ind: { demo: 0.5 }, tip: 'Armén lyder folket. Nu står det på papper.' },
      { text: 'HÖJ FÖRSVARSBUDGETEN SOM TACK', cost: { money: 400 }, perm: { milpower: 2 }, temp: { readiness: 3 }, griev: -4, tip: 'En lojal armé ska ha bra utrustning.' },
      { text: 'BJUD IN OFFICERARNA TILL PARLAMENTET', temp: { stability: 3, approval: 2 }, griev: -6, ind: { trustgov: 2 }, tip: 'Kaffe med ledamöterna. Ovant för båda sidor.' },
    ],
  },
  {
    id: 'kon_general_efter', icon: '\u{1F5FF}', chain: true, kind: 'frihet',
    title: 'ETT ÅR EFTER KUPPFÖRSÖKET',
    text: 'Ett år efter natten vid radiohuset är landet fortfarande delat. Varga sitter antingen i fängelse eller vid makten, beroende på vem man frågar och vilken tidning man läser. Turisterna har inte kommit tillbaka, utländska investerare väntar och i {stad} har man rest ett monument över natten då folket gick mot pansarvagnarna.',
    choices: [
      { text: 'SANNINGSKOMMISSION OCH FÖRSONING', cost: { pp: 20 }, temp: { stability: 4, freedom: 3 }, griev: -12, ind: { demo: 0.5, trustgov: 3 }, tip: 'Alla får berätta. Ingen får glömma.' },
      { text: 'RENSNING I OFFICERSKÅREN', cost: { pp: 15 }, mod: 'purge_aftermath', temp: { statepower: 5, milpower: -5, readiness: -5 }, griev: 4, tip: 'Armén blir lojal. Och mycket mindre.' },
      { text: 'GÖR NATTEN TILL NATIONELL HELGDAG', temp: { approval: 4, stability: 2 }, mod: 'national_unity', griev: -6, ind: { tourists: 10 }, tip: 'Natten blir en högtid. Varga blir en fotnot.' },
    ],
  },

  // ===== DET STORA SKATTEUPPRORET =====
  // En skatt höjs → hantverkarna slutar betala → svart ekonomi, skatteparti, bojkott eller en skola att visa upp.
  {
    id: 'kon_skatt', icon: '\u{1F527}', weight: 2, cooldown: 1200, kind: 'skatt', react: true,
    title: 'HANTVERKARNA I {STAD} SLUTAR BETALA',
    text: 'En månad efter ändringen av {lag} har sexhundra hantverkare, frisörer och krögare i {stad} meddelat att de sätter in skatten på ett spärrat konto i stället för att betala den. "Vi betalar när politikerna kan förklara vart pengarna tar vägen", säger deras talesperson, en rörmokare vars mustasch redan är landskänd.',
    when: (c) => c.cut('taxes', 'corporate_tax', 'inheritance_tax', 'alcohol_policy', 'tobacco', 'price_controls', 'cash') && c.grievOf('skatt') > 10 && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -15, temp: { polpower: -3, income: -2 }, tip: 'Rörmokaren vann. Han putsar mustaschen inför kamerorna.' },
      { text: 'VISA VAD SKATTEN GÅR TILL — I VARJE KOMMUN', cost: { pp: 10, money: 150 }, temp: { approval: 2 }, griev: -6, next: ['kon_skatt_skola', 'kon_skatt_skola', 'kon_skatt_parti'], tip: 'En skylt på varje ny förskola: "betald med din skatt".' },
      { text: 'SKICKA SKATTEVERKET', cost: { money: 200 }, temp: { income: 3, statepower: 2, approval: -3 }, griev: 6, next: ['kon_skatt_svart', 'kon_skatt_bojkott'], tip: 'Revisorer i varje frisersalong. Många nya kunder, i början.' },
      { text: 'IGNORERA DEM', temp: { income: -2 }, griev: 4, next: ['kon_skatt_bojkott', 'kon_skatt_parti', null], tip: 'Sexhundra är inte många. Sexhundra som vinner blir fler.' },
    ],
  },
  {
    id: 'kon_skatt_svart', icon: '\u{1F9FE}', chain: true, kind: 'skatt',
    title: 'DEN SVARTA EKONOMIN VÄXER',
    text: 'Ett halvår efter skattestriden i {stad} har landet fått en ny vana. Hantverkare frågar "kvitto eller inte?", restauranger har två kassaapparater och var femte städtimme betalas kontant. Skatteverket räknar med att staten förlorar lika mycket som ändringen av {lag} skulle ge. Ekonomerna varnade för det. Ingen lyssnade på ekonomerna.',
    choices: [
      { text: 'SÄNK SKATTEN PÅ ARBETE I HEMMET', cost: { money: 300 }, temp: { income: 2, approval: 3 }, griev: -8, ind: { crimeidx: -3 }, tip: 'Kvitto blir billigare än svart. Plötsligt vill alla ha kvitto.' },
      { text: 'BEGRÄNSA KONTANTERNA', cost: { pp: 15 }, law: ['cash', 'limits'], temp: { income: 3, freedom: -2 }, griev: 4, next: ['kon_skatt_parti', null], tip: 'Svarta pengar blir svåra att använda. Mormors sparburk också.' },
      { text: 'HÅRDARE STRAFF FÖR SKATTEFUSK', temp: { statepower: 3, income: 2, approval: -3 }, griev: 6, next: ['kon_skatt_bojkott', null], tip: 'Några döms. Resten blir försiktigare.' },
    ],
  },
  {
    id: 'kon_skatt_parti', icon: '\u{1F4CA}', chain: true, kind: 'skatt',
    title: 'SKATTEPARTIET',
    text: 'Ett år efter skattestriden har rörmokaren med mustaschen startat ett parti. Det har ett enda löfte, att riva upp ändringen av {lag}, och ligger på nitton procent i mätningarna. Partiets möten fyller idrottshallar, och hans tal slutar alltid med att han håller upp en skiftnyckel. Dina egna väljare på landsbygden har börjat bära partiets nålar.',
    choices: [
      { text: 'TA ÖVER HANS BÄSTA IDÉER', cost: { pp: 15 }, temp: { approval: 4, income: -2 }, griev: -10, tip: 'Den som lånar en bra idé brukar få behålla väljarna.' },
      { text: 'DEBATTERA HONOM I TV',
        risk: { chance: 0.5,
          win: { text: 'Du är påläst och han har bara en skiftnyckel. Partiet faller i mätningarna.', temp: { approval: 5, polpower: 3 }, griev: -6 },
          lose: { text: 'Han är rolig och du är stel. Partiet stiger till tjugofem procent.', temp: { approval: -5, polpower: -5 }, griev: 8 } } },
      { text: 'HÅLL FAST VID {LAG} OCH VISA RESULTATEN', cost: { money: 300 }, temp: { stability: 2 }, griev: -3, next: ['kon_skatt_skola', 'kon_skatt_bojkott'], tip: 'Resultat är svåra att säga emot. Men de tar tid.' },
    ],
  },
  {
    id: 'kon_skatt_bojkott', icon: '\u{1F6AB}', chain: true, kind: 'skatt',
    title: 'SKATTEBOJKOTTEN',
    text: 'Det som började med sexhundra hantverkare i {stad} har spridit sig. Tvåhundratusen småföretagare och egenföretagare betalar inte längre sin skatt, och i flera kommuner har skatteverkets kontor fått stänga på grund av protester. Statens inkomster har fallit med en tiondel på ett kvartal, och kreditinstituten ringer finansministern varje dag.',
    choices: [
      { text: 'GE EFTER — ÅTERSTÄLL {LAG}', cost: { pp: 25 }, undo: true, temp: { polpower: -6, income: 2 }, griev: -18, tip: 'Bojkotten tar slut. Nästa grupp som vill något har lärt sig hur man gör.' },
      { text: 'AMNESTI FÖR DEM SOM BETALAR INOM EN MÅNAD', cost: { pp: 15 }, temp: { income: 4, approval: 2 }, griev: -8, ind: { trustgov: 2 }, tip: 'De flesta betalar. De flesta ville egentligen bara bli hörda.' },
      { text: 'BESLAGTA FÖRETAG OCH FASTIGHETER', temp: { income: 5, statepower: 4, unrest: 10, freedom: -4 }, griev: 15, ind: { protests: 60, trustgov: -8 }, tip: 'Pengarna kommer in. Förtroendet går ut.' },
    ],
  },
  {
    id: 'kon_skatt_skola', icon: '\u{1F3EB}', chain: true, kind: 'skatt',
    title: 'SKOLAN SOM SKATTEN BYGGDE',
    text: 'Två år efter skattestriden står en ny skola klar i {stad}, med idrottshall och ett skolkök som lagar maten från grunden. På fasaden står det med stora bokstäver att den är betald med skattepengar. Till invigningen kom rörmokaren med mustaschen. Han har tre barnbarn i skolan och höll ett kort tal om att det kanske ändå var värt det.',
    choices: [
      { text: 'BYGG FLER — I HELA LANDET', cost: { money: 800 }, perm: { qol: 2, welfare: 1 }, griev: -12, ind: { trustgov: 3 }, tip: 'Skatt som syns är skatt man vill betala.' },
      { text: 'BJUD IN RÖRMOKAREN TILL ETT SAMTAL', temp: { approval: 4, stability: 2 }, griev: -8, tip: 'Ni är oense om det mesta. Ni är överens om skolköket.' },
      { text: 'GÖR EN FILM OM SKOLAN', cost: { money: 100 }, temp: { approval: 3 }, griev: -6, tip: 'Barnen i skolköket blir landets mest sedda reklam.' },
    ],
  },

  // ===== SKOLKRISEN =====
  // Mätningen rasar → lärare, prov eller konkurrens → en gyllene eller en förlorad generation.
  {
    id: 'kon_skola', icon: '\u{1F4DA}', weight: 2, cooldown: 1400, kind: 'valfard',
    title: 'VAR FJÄRDE KAN INTE LÄSA TIDTABELLEN',
    text: 'Den nya skolmätningen är den sämsta i landets historia. Var fjärde femtonåring förstår inte en enkel text, och i matematik ligger landet efter alla grannländer. Lärarna i {stad} har trettiotvå elever i varje klass och lägger mer tid på blanketter än på undervisning. I helgen stod föräldrar med skyltar utanför utbildningsdepartementet.',
    when: (c) => c.day > 100 && (c.trend('pisa') < -8 || c.cut('education', 'school_choice')) && (c.ind.pupilteacher ?? 15) > 13,
    choices: [
      { text: 'ETT LÄRARLYFT — HÖGRE LÖN OCH MINDRE KLASSER', cost: { money: 800 }, perm: { qol: 1 }, temp: { approval: 3 }, griev: -8, next: ['kon_skola_larare', 'kon_skola_larare', 'kon_skola_langsamt'], tip: 'Bra lärare är det enda som fungerar. De kostar.' },
      { text: 'FLER PROV OCH HÅRDARE KONTROLL', cost: { pp: 15 }, law: ['education', 'strict'], temp: { stability: 1 }, griev: 2, next: ['kon_skola_prov', 'kon_skola_flykt'], tip: 'Det som mäts blir gjort. Det som inte mäts glöms bort.' },
      { text: 'LÅT FRISKOLORNA KONKURRERA', cost: { pp: 15 }, law: ['school_choice', 'vouchers'], temp: { gdp: 1 }, griev: 3, next: ['kon_skola_delad', 'kon_skola_larare'], tip: 'Konkurrens gör vissa skolor bättre. Andra gör den tomma.' },
      { text: 'SKYLL PÅ MÄTNINGEN', temp: { approval: -3 }, griev: 6, ind: { trustgov: -2 }, next: ['kon_skola_flykt', 'kon_skola_kull'], tip: 'Mätningen kan ha fel. Barnen har inte det.' },
    ],
  },
  {
    id: 'kon_skola_prov', icon: '\u{1F4DD}', chain: true, kind: 'valfard',
    title: 'PROVPLUGGET',
    text: 'Ett år efter de nya proven har resultaten blivit bättre, men lärarna i {stad} säger att eleverna mest lär sig att svara på provfrågor. Fusket har ökat, tioåringar har prestationsångest och skolsköterskorna har längre köer än någonsin. Samtidigt vet föräldrarna äntligen hur det går för deras barn, och många är tacksamma.',
    choices: [
      { text: 'BEHÅLL PROVEN — MEN FÄRRE OCH BÄTTRE', cost: { pp: 10 }, temp: { stability: 2 }, griev: -6, next: ['kon_skola_larare', null], tip: 'Proven mäter. Lärarna undervisar.' },
      { text: 'SKROTA PROVEN OCH LITA PÅ LÄRARNA', cost: { money: 300 }, law: ['education', 'balanced'], temp: { approval: 2, qol: 1 }, griev: -4, next: ['kon_skola_larare', 'kon_skola_langsamt'], tip: 'Lärarna jublar. Statistikerna gråter.' },
      { text: 'FLER PROV, OFTARE', temp: { statepower: 2, qol: -2 }, griev: 6, next: ['kon_skola_flykt', 'kon_skola_kull'], tip: 'Varje fredag är provdag. Barnen har slutat tycka om fredagar.' },
    ],
  },
  {
    id: 'kon_skola_langsamt', icon: '\u{23F3}', chain: true, kind: 'valfard',
    title: 'ÅRET DÅ INGET HÄNDE',
    text: 'Ett år efter lärarlyftet syns ingenting i statistiken. Mätningen är lika dålig som förra året, och oppositionen kallar satsningen "historiens dyraste fiasko". Men lärarna i {stad} säger något annat: färre har slutat, klasserna är mindre och ettorna läser bättre än någonsin. Det tar nio år innan de eleverna når mätningen.',
    choices: [
      { text: 'HÅLL KURSEN — SKOLAN ÄR ETT MARATON', temp: { approval: -3, stability: 1 }, griev: -4, next: ['kon_skola_larare', 'kon_skola_kull'], tip: 'Skolpolitik mäts i decennier. Val mäts i år.' },
      { text: 'LÄGG TILL LÄXHJÄLP OCH SOMMARSKOLA', cost: { money: 300 }, temp: { approval: 2, qol: 1 }, griev: -6, next: ['kon_skola_larare'], tip: 'Snabbare resultat för de äldre eleverna.' },
      { text: 'AVBRYT SATSNINGEN', res: { money: 400 }, temp: { approval: 2 }, perm: { qol: -1 }, griev: 8, next: ['kon_skola_flykt'], tip: 'Pengarna tillbaka i kassan. Lärarna tillbaka till platsannonserna.' },
    ],
  },
  {
    id: 'kon_skola_larare', icon: '\u{1F9D1}\u{200D}\u{1F3EB}', chain: true, kind: 'valfard',
    title: 'LÄRARNA SOM KOM TILLBAKA',
    text: 'Tre år efter skolkrisen har tolvtusen behöriga lärare som hade lämnat yrket kommit tillbaka. Den nya mätningen visar landets största förbättring någonsin, och skolan i {stad} som var sämst i landet ligger nu i mitten. Lärarutbildningen har fler sökande än platser. En elev skrev i en uppsats att hennes lärare "är som en superhjälte, fast med kaffekopp".',
    choices: [
      { text: 'LÅS FAST PENGARNA I TIO ÅR', cost: { money: 500 }, perm: { research: 1, qol: 1 }, mod: 'golden_generation', griev: -12, tip: 'En generation som kan läsa, räkna och tänka själv.' },
      { text: 'HYLLA LÄRARNA PÅ NATIONALDAGEN', temp: { approval: 4, stability: 2 }, griev: -8, tip: 'Medaljer till lärare. Det borde ha gjorts för länge sedan.' },
      { text: 'FLYTTA PENGARNA TILL NÅGOT ANNAT NU', res: { money: 300 }, temp: { approval: -2 }, griev: 6, next: ['kon_skola_flykt', null], tip: 'Det fungerade, så då behövs det väl inte längre?' },
    ],
  },
  {
    id: 'kon_skola_flykt', icon: '\u{1F6AA}', chain: true, kind: 'valfard',
    title: 'LÄRARFLYKTEN',
    text: 'Ett år efter skolkrisen har var femte lärare i {stad} sagt upp sig. Många har gått till bättre betalda jobb i näringslivet, andra är sjukskrivna. Skolorna anställer obehöriga vikarier, och i flera klasser har eleverna haft sju olika mattelärare på ett läsår. Föräldrar som har råd flyttar sina barn till privata skolor.',
    choices: [
      { text: 'NÖDSATSNING — LÖNER OCH STÖDPERSONAL', cost: { money: 900 }, perm: { qol: 1 }, temp: { approval: 3 }, griev: -12, next: ['kon_skola_larare', null], tip: 'Lärarna kommer tillbaka. Lite misstänksamma.' },
      { text: 'SNABBUTBILDA NYA LÄRARE PÅ ETT HALVÅR', cost: { money: 300 }, temp: { stability: 1 }, griev: -4, next: ['kon_skola_kull', null], tip: 'Nya lärare går fort. Bra lärare tar längre tid.' },
      { text: 'LÅT PRIVATSKOLORNA TA ÖVER', law: ['school_choice', 'feepaying'], temp: { gdp: 1, approval: -5 }, griev: 10, ind: { segreg: 3 }, next: ['kon_skola_delad', 'kon_skola_kull'], tip: 'De som har råd får en bra skola. De andra får en skola.' },
    ],
  },
  {
    id: 'kon_skola_delad', icon: '\u{1F3D8}\u{FE0F}', chain: true, kind: 'valfard',
    title: 'SKOLORNA DELAS UPP',
    text: 'Två år efter skolreformen har {stad} två sorters skolor. I villaområdena finns skolor med kö och nya datorer, i hyreshusområdena skolor där hälften av platserna står tomma och de bästa lärarna har gått. Barn som bor tre kilometer från varandra träffas aldrig. Skolinspektionen kallar det "den snabbaste uppdelningen i landets historia".',
    choices: [
      { text: 'SKOLPLATS EFTER NÄRHET OCH LOTTNING', cost: { pp: 20 }, law: ['school_choice', 'assigned'], temp: { approval: -3 }, griev: -6, ind: { segreg: -3 }, tip: 'Rättvist. Villaföräldrarna rasar.' },
      { text: 'EXTRA PENGAR TILL SKOLOR I UTSATTA OMRÅDEN', cost: { money: 600 }, perm: { qol: 1, integration: 1 }, griev: -8, ind: { segreg: -2 }, tip: 'De bästa lärarna söker sig dit när lönen är högst där.' },
      { text: 'FRIHETEN ATT VÄLJA ÄR VIKTIGAST', temp: { approval: 1 }, perm: { integration: -1 }, griev: 6, ind: { segreg: 3 }, next: ['kon_skola_kull'], tip: 'Alla får välja. Alla har inte samma val.' },
    ],
  },
  {
    id: 'kon_skola_kull', icon: '\u{1F393}', chain: true, kind: 'valfard',
    title: 'KULLEN SOM INTE KUNDE LÄSA',
    text: 'Fem år efter skolkrisen kommer den första kullen ut på arbetsmarknaden. Arbetsgivare i {stad} klagar på att unga sökande inte kan räkna procent eller skriva ett mejl. Ungdomsarbetslösheten har stigit, och armén har fått sänka kraven för att fylla sina platser. Ekonomerna räknar med att det kostar landet en procent av BNP om året i trettio år.',
    choices: [
      { text: 'ANDRA CHANSEN — VUXENUTBILDNING FÖR ALLA UNGA', cost: { money: 800 }, perm: { qol: 1 }, temp: { approval: 3 }, griev: -10, ind: { youthunemp: -2 }, tip: 'Det går att lära sig läsa ordentligt vid tjugo. Det är bara svårare.' },
      { text: 'LÄRLINGSJOBB MED SKATTEAVDRAG', cost: { money: 400 }, temp: { gdp: 1 }, griev: -6, ind: { youthunemp: -1.5 }, tip: 'Lära sig på jobbet, som förr.' },
      { text: 'DET ÄR FÖRÄLDRARNAS ANSVAR', mod: 'lost_generation', temp: { approval: -4 }, griev: 10, ind: { youthunemp: 2 }, tip: 'Föräldrarna gick i skolan förr. Det var en annan skola.' },
    ],
  },

  // ===== GÅVAN SOM SKULLE BETALAS =====
  // En generös familjereform → köer, en nota eller fler barn och fler i arbete.
  {
    id: 'kon_reform', icon: '\u{1F37C}', weight: 2, cooldown: 1200, kind: 'valfard', react: true,
    title: 'FÖRÄLDRARNA JUBLAR',
    text: 'Ändringen av {lag} har gällt i en månad, och föräldragrupperna i {stad} kallar det årets bästa nyhet. Förskolorna får nya ansökningar och arbetsgivare rapporterar att fler småbarnsföräldrar vill gå upp i arbetstid. Finansdepartementet har däremot börjat räkna, och siffrorna är större än vad som stod i propositionen.',
    when: (c) => c.raised('childcare', 'parental_leave', 'welfare') && c.day > 30,
    choices: [
      { text: 'FINANSIERA DET ORDENTLIGT — HÖJ SKATTEN LITE', cost: { pp: 15 }, perm: { welfare: 1 }, temp: { income: 2, approval: -1 }, griev: -4, next: ['kon_reform_boom', 'kon_reform_ko'], tip: 'Reformen blir bestående. Skattebetalarna märker det.' },
      { text: 'LÅNA TILL DET — DET LÖNAR SIG PÅ SIKT', temp: { approval: 3, income: -3 }, griev: -6, next: ['kon_reform_boom', 'kon_reform_nota', 'kon_reform_ko'], tip: 'Barn blir skattebetalare. Om tjugo år.' },
      { text: 'BYGG FÖRSKOLOR INNAN TRYCKET KOMMER', cost: { money: 500 }, perm: { qol: 1 }, griev: -6, next: ['kon_reform_boom', 'kon_reform_boom', null], tip: 'Lokaler först, köer sedan. Ovanligt klokt.' },
    ],
  },
  {
    id: 'kon_reform_ko', icon: '\u{1F6BC}', chain: true, kind: 'valfard',
    title: 'KÖN TILL FÖRSKOLAN',
    text: 'Ett halvår efter reformen har förskolorna i {stad} tre gånger så många sökande som platser. Föräldrar som räknat med att börja jobba igen sitter hemma, och de som fått plats har barngrupper med tjugotvå barn och två trötta pedagoger. Kommunen säger att staten lovade pengar som aldrig kom. Staten säger att pengarna kom, till fel konto.',
    choices: [
      { text: 'STATLIGA PENGAR TILL NYA FÖRSKOLOR', cost: { money: 600 }, perm: { welfare: 1, qol: 1 }, griev: -10, next: ['kon_reform_boom', null], tip: 'Byggkranar bredvid lekplatserna.' },
      { text: 'UTBILDA FLER FÖRSKOLLÄRARE', cost: { money: 300 }, perm: { welfare: 1 }, temp: { approval: -1 }, griev: -4, next: ['kon_reform_boom', null], tip: 'Det tar tre år. Barnen växer fortare än så.' },
      { text: 'BACKA ÄNDRINGEN AV {LAG}', undo: true, temp: { approval: -6 }, griev: 10, ind: { trustgov: -4 }, tip: 'Löftet dras tillbaka. Föräldrarna kommer ihåg det i valet.' },
    ],
  },
  {
    id: 'kon_reform_nota', icon: '\u{1F9EE}', chain: true, kind: 'valfard',
    title: 'NOTAN FÖR {LAG}',
    text: 'Ett år efter reformen har kostnaden för {lag} blivit dubbelt så hög som beräknat. Det beror på att fler använder den än någon räknade med, vilket i sig visar att den behövdes. Men lånen växer, kreditinstitutet har skrivit en orolig rapport och oppositionen har räknat ut vad varje barn kostar statskassan.',
    choices: [
      { text: 'BEHOVSPRÖVA STÖDET', cost: { pp: 15 }, temp: { income: 3, approval: -3 }, griev: 6, tip: 'De som behöver det mest får behålla det. De andra blir arga.' },
      { text: 'SPARA PÅ FÖRSVARET I STÄLLET', cost: { pp: 10 }, temp: { income: 2, milpower: -2, readiness: -2 }, griev: -2, tip: 'Försvaret får vänta. Generalerna är inte glada.' },
      { text: 'LÅNA VIDARE — BARNEN ÄR VÅR FRAMTID', temp: { income: -3, approval: 2 }, griev: -4, next: ['kon_reform_boom', null], tip: 'Det är de. Men de betalar inte skatt än.' },
    ],
  },
  {
    id: 'kon_reform_boom', icon: '\u{1F476}', chain: true, kind: 'valfard',
    title: 'BARNEN OCH JOBBEN',
    text: 'Två år efter ändringen av {lag} har två saker hänt samtidigt. Det föds fler barn än på femton år, och fler mammor och pappor jobbar heltid än någonsin. Skatteintäkterna har ökat mer än reformen kostade, och forskare från {land} kommer till {stad} för att studera hur det gick till. På BB har man fått köpa fler vaggor.',
    choices: [
      { text: 'GÖR REFORMEN PERMANENT I EN BRED UPPGÖRELSE', cost: { pp: 20 }, perm: { welfare: 2, qol: 1 }, griev: -10, ind: { happiness: 0.2 }, tip: 'Bra reformer överlever regeringen som gjorde dem.' },
      { text: 'BYGG UT BB OCH BARNAVÅRDSCENTRALERNA', cost: { money: 400 }, perm: { welfare: 1, hdi: 1 }, griev: -8, tip: 'Fler vaggor. Fler barnmorskor.' },
      { text: 'BERÄTTA FÖR VÄRLDEN OM SUCCÉN', temp: { approval: 4 }, rel: 4, griev: -6, tip: 'Två ministrar från andra länder kommer på studiebesök nästa vecka.' },
    ],
  },
];
