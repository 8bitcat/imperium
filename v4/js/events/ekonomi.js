// IMPERIUM V5.6 — HÄNDELSER: EKONOMI & FINANS.
// Inflation, arbetslöshet, skulder, bank- och valutakriser, bostäder, pensioner, skatter, handel och konjunktur — i rika och fattiga länder.
export const EVENTS = [

  // ================= INFLATION & PENGAPOLITIK =================
  {
    id: 'eko_hyperinflation', icon: '\u{1F4B8}', weight: 2, cooldown: 600,
    title: 'PRISERNA FÖRDUBBLAS VARJE MÅNAD',
    text: 'Folk bär sedlarna till affären i plastkassar och priserna skrivs om två gånger om dagen. Lönen är värd hälften när den väl kommer.',
    when: (c) => (c.ind.infl ?? 0) > 15 || (c.is('monetary', 'printing') && c.st.income < -20),
    choices: [
      { text: 'NY VALUTA — STRYK TRE NOLLOR', cost: { pp: 30, money: 500 }, law: ['monetary', 'tight'], temp: { approval: -6, gdp: -6 }, perm: { stability: 5 }, tip: 'Nya sedlar, gammal misstro. Förtroendet måste förtjänas.' },
      { text: 'KOPPLA VALUTAN TILL EN STARK UTLÄNDSK VALUTA', cost: { pp: 35 }, temp: { gdp: -4, statepower: -8 }, perm: { income: 6 }, rel: 4, tip: 'Lugnet kommer utifrån. Det gör besluten också.' },
      { text: 'BETALA LÖNERNA I MAT OCH BRÄNSLE', temp: { qol: -6, factory: -6, unrest: 8 }, mod: 'misery', tip: 'Byteshandel. Som på farfars tid.' },
      { text: 'FORTSÄTT TRYCKA — DET ÄR KRIS', res: { money: 900 }, temp: { unrest: 10, gdp: -10 }, mod: 'lost_faith', tip: 'Pengarna räcker i en vecka.' },
    ],
  },
  {
    id: 'eko_printing_press', icon: '\u{1F5A8}\u{FE0F}', weight: 2,
    title: 'SEDELPRESSEN GÅR DYGNET RUNT',
    text: 'Centralbanken trycker pengar för att betala statens räkningar. Sedeltryckeriet har infört nattskift och specialpapperet håller på att ta slut.',
    when: (c) => c.is('monetary', 'printing'),
    choices: [
      { text: 'TRYCK ÄNNU MER — FOLK BEHÖVER PENGAR', res: { money: 1000 }, temp: { approval: 4, unrest: 6 }, perm: { gdp: -4 }, tip: 'Det känns som pengar. Ett tag.' },
      { text: 'STÄNG AV PRESSARNA', law: ['monetary', 'independent'], cost: { pp: 25 }, temp: { gdp: -6, approval: -6 }, perm: { income: 4, stability: 3 }, tip: 'Abstinensen blir svår.' },
      { text: 'TRYCK MINDRE OCH LÅNA RESTEN', res: { money: 400 }, temp: { gdp: -2 }, perm: { income: -3 }, tip: 'Varken eller. Som vanligt.' },
    ],
  },
  {
    id: 'eko_gold_standard', icon: '\u{1FA99}', weight: 2,
    title: 'GULDET RÄCKER INTE TILL ALLA',
    text: 'Ekonomin växer snabbare än guldreserverna. Valutan stiger, exporten blir för dyr och bönderna kan inte betala tillbaka sina lån.',
    when: (c) => c.is('monetary', 'gold'),
    choices: [
      { text: 'KÖP MER GULD UTOMLANDS', cost: { money: 1000 }, temp: { gdp: 4 }, perm: { stability: 4 }, tip: 'Ett dyrt sätt att få mer metall i källaren.' },
      { text: 'ÖVERGE GULDMYNTFOTEN', law: ['monetary', 'loose'], cost: { pp: 25 }, temp: { gdp: 8, factory: 6, approval: -4 }, perm: { stability: -3 }, tip: 'Exporten jublar. Spararna sörjer.' },
      { text: 'HÅLL FAST VID GULDET', temp: { gdp: -8, factory: -6, unrest: 5 }, perm: { stability: 3 }, tip: 'Stabilt värde i en ostadig tid. Fråga bönderna.' },
    ],
  },
  {
    id: 'eko_deflation', icon: '\u{1F9CA}', weight: 2,
    title: 'PRISERNA SJUNKER — OCH INGEN KÖPER',
    text: 'Varorna blir billigare för varje månad, så alla väntar med att handla. Företagen sänker lönerna och skulderna blir tyngre att bära.',
    when: (c) => (c.ind.infl ?? 3) < 0.5 && c.st.gdp < 20,
    choices: [
      { text: 'SÄNK RÄNTAN TILL NOLL', law: ['monetary', 'loose'], cost: { pp: 15 }, temp: { gdp: 6, factory: 4 }, perm: { stability: -2 }, tip: 'Billiga pengar. Ingen vet riktigt vart de tar vägen.' },
      { text: 'STORA STATLIGA INVESTERINGAR', cost: { money: 900 }, temp: { gdp: 8, factory: 6, approval: 4 }, tip: 'Någon måste börja handla. Det blir du.' },
      { text: 'VÄNTA UT DET', temp: { gdp: -6, factory: -5, approval: -3 }, tip: 'Det går över, säger läroböckerna. Om tio år.' },
    ],
  },
  {
    id: 'eko_central_bank_no', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'CENTRALBANKEN SÄGER NEJ',
    text: 'Statskassan är tom och du vill att centralbanken köper statens obligationer. Centralbankschefen vägrar och har sagt det rakt ut i direktsänd tv.',
    when: (c) => c.is('monetary', 'independent', 'tight') && c.st.income < -15,
    choices: [
      { text: 'RESPEKTERA BESLUTET', temp: { approval: -4, income: -4 }, perm: { stability: 3 }, tip: 'Oberoende betyder att någon får säga nej till dig.' },
      { text: 'BYT UT CENTRALBANKSCHEFEN', law: ['monetary', 'loose'], cost: { pp: 30 }, res: { money: 800 }, perm: { corruption: 3 }, rel: -4, tip: 'Den nya chefen håller med dig om allt. Marknaden märker det.' },
      { text: 'LÅNA PÅ DEN ÖPPNA MARKNADEN', res: { money: 600 }, perm: { income: -4 }, tip: 'Räntan betalas av nästa regering. Och nästa.' },
    ],
  },
  {
    id: 'eko_bread_price', icon: '\u{1F956}', weight: 2,
    title: 'BRÖDET HAR BLIVIT DYRARE IGEN',
    text: 'Priset på mjöl har stigit för tredje gången i år. I de fattigaste kvarteren köper familjer bröd för dagen och hoppar över middagen.',
    when: (c) => (c.ind.infl ?? 0) > 7 && (c.ind.gdppc ?? 9610) < 6000,
    choices: [
      { text: 'SUBVENTIONERA BRÖDET', cost: { money: 600 }, temp: { unrest: -8, approval: 6 }, perm: { income: -3 }, tip: 'Billigt bröd är dyr politik.' },
      { text: 'PRISTAK PÅ MJÖL', cost: { pp: 15 }, temp: { qol: 5, factory: -5 }, perm: { corruption: 2 }, tip: 'Bagerierna säljer gärna till pristaket. Under disk.' },
      { text: 'LÅT PRISET STIGA', temp: { unrest: 10, approval: -8 }, perm: { income: 2 }, tip: 'Marknaden är rättvis. Den är bara inte snäll.' },
    ],
  },
  {
    id: 'eko_crypto_tender', icon: '\u{1F4BB}', weight: 2,
    title: 'KRYPTOVALUTA SOM LAGLIGT BETALMEDEL?',
    text: 'En grupp unga entreprenörer vill att landet gör en kryptovaluta till officiell valuta vid sidan av den vanliga. De lovar turister, investerare och ett slut på inflationen.',
    when: (c) => c.ideo !== 'libertarianism' && (c.ind.infl ?? 0) > 6 && (c.ind.gdppc ?? 9610) < 15000,
    choices: [
      { text: 'JA — OCH LÄGG EN DEL AV RESERVEN I DEN', cost: { money: 700 }, temp: { research: 6, gdp: 4 }, perm: { stability: -4 }, rel: -5, tip: 'Kursen kan gå åt två håll. Den gör båda.' },
      { text: 'FÖRBJUD ALL KRYPTOHANDEL', cost: { pp: 15 }, temp: { freedom: -4 }, perm: { stability: 2 }, tip: 'Handeln flyttar in i telefonerna. Där den redan var.' },
      { text: 'VÄNTA OCH SE HUR DET GÅR FÖR ANDRA', temp: { approval: -2, research: -2 }, tip: 'Någon annan får vara först. Och sist.' },
    ],
  },
  {
    id: 'eko_crypto_mania', icon: '\u{1F4C8}', weight: 2,
    title: 'ALLA HAR KÖPT DIGITALA MYNT',
    text: 'Busschaufförer, pensionärer och tonåringar handlar kryptovalutor i mobilen. Nya mynt dyker upp varje vecka, och flera av dem visar sig vara rena bedrägerier.',
    when: (c) => (c.ind.internet ?? 60) > 85 && c.st.gdp > 0,
    choices: [
      { text: 'REGLERA HANDELN HÅRT', cost: { pp: 20 }, temp: { gdp: -3 }, perm: { safety: 3, corruption: -2 }, tip: 'Bedragarna flyttar utomlands. Kunderna följer efter.' },
      { text: 'BESKATTA VINSTERNA', res: { money: 500 }, temp: { approval: -5 }, tip: 'Staten vill ha sin del av festen. Förlusterna får ni behålla.' },
      { text: 'BJUD IN DATAHALLARNA MED BILLIG EL', cost: { money: 400 }, mod: 'foreign_investment', temp: { qol: -4 }, perm: { research: 2 }, tip: 'Servrarna surrar dygnet runt. Elräkningen också.' },
      { text: 'LÅT FOLK GÖRA SOM DE VILL', temp: { approval: 3 }, perm: { stability: -3 }, tip: 'Vuxna människor. Med sina sparpengar.' },
    ],
  },

  // ================= BANKER, BÖRS & SKULDER =================
  {
    id: 'eko_bank_run', icon: '\u{1F3E6}', weight: 2,
    title: 'RUSNING MOT BANKERNA',
    text: 'Ett rykte om att landets näst största bank är på fallrepet sprids i sociala medier. Köerna utanför kontoren växer för varje timme och bankomaterna töms.',
    when: (c) => ((c.ind.infl ?? 0) > 6 && c.st.stability < 0) || (c.mod('capital_flight') && c.st.stability < -20),
    choices: [
      { text: 'STATEN GARANTERAR ALLA INSÄTTNINGAR', cost: { money: 900 }, temp: { stability: 6, approval: 4 }, tip: 'Lugnet köps kontant.' },
      { text: 'STÄNG BANKERNA I TRE DAGAR', temp: { unrest: 8, gdp: -5 }, mod: 'capital_flight', tip: 'Ingen kan ta ut något. Ingen glömmer det heller.' },
      { text: 'LÅT BANKEN GÅ OMKULL', temp: { approval: -8, gdp: -8 }, perm: { corruption: -3 }, tip: 'Marknaden får ha sin gång.' },
    ],
  },
  {
    id: 'eko_too_big_to_fail', icon: '\u{1F3B0}', weight: 2,
    title: 'STORBANKEN HAR SPELAT BORT ALLT',
    text: 'Landets största bank har förlorat enorma summor på riskabla affärer utomlands. Utan hjälp går den i konkurs på måndag, och med den hälften av landets företagslån.',
    when: (c) => (c.ind.gdppc ?? 9610) > 25000 && c.st.gdp < 10 && c.day > 150,
    choices: [
      { text: 'SKATTEBETALARNA RÄDDAR BANKEN', cost: { money: 1500 }, temp: { gdp: 6, approval: -10 }, perm: { corruption: 3 }, tip: 'Vinsterna var privata. Förlusterna blev allas.' },
      { text: 'STATEN TAR ÖVER BANKEN', cost: { pp: 30, money: 600 }, temp: { gdp: -4 }, perm: { statepower: 6, income: 3 }, tip: 'Grattis, du är bankdirektör.' },
      { text: 'LÅT DEN GÅ I KONKURS', temp: { gdp: -12, unrest: 6 }, perm: { corruption: -4 }, mod: 'downturn', tip: 'Ett lärorikt exempel. För alla utom de drabbade.' },
    ],
  },
  {
    id: 'eko_stock_bubble', icon: '\u{1F388}', weight: 2,
    title: 'BÖRSEN STIGER OCH STIGER',
    text: 'Aktiekurserna har stigit tre år i rad. Ett teknikbolag som aldrig gått med vinst är nu värt mer än hela stålindustrin, och alla pratar om sina aktier på jobbet.',
    when: (c) => c.st.gdp > 25 && (c.ind.gdppc ?? 9610) > 15000,
    choices: [
      { text: 'VARNA OFFENTLIGT FÖR EN BUBBLA', cost: { pp: 15 }, temp: { gdp: -4, approval: -3 }, perm: { stability: 4 }, tip: 'Ingen gillar den som stänger av musiken.' },
      { text: 'SÄLJ STATENS AKTIER MEDAN PRISET ÄR HÖGT', res: { money: 1100 }, perm: { statepower: -4 }, tip: 'Köp billigt, sälj dyrt. Staten lär sig.' },
      { text: 'LÅT FESTEN FORTSÄTTA', temp: { gdp: 6, approval: 5 }, perm: { stability: -5 }, tip: 'Det har aldrig gått dåligt förut. Inte sedan förra gången.' },
    ],
  },
  {
    id: 'eko_debt_mountain', icon: '\u{1F9FE}', weight: 2,
    title: 'SKULDEN ÄR STÖRRE ÄN HELA EKONOMIN',
    text: 'Statsskulden har passerat ett helt års produktion. Var femte skattekrona går nu till räntor, och kreditvärderingsinstituten har satt landet under bevakning.',
    when: (c) => (c.ind.debt ?? 57) > 100,
    choices: [
      { text: 'HÖJ SKATTERNA OCH BETALA AV', cost: { pp: 25 }, temp: { approval: -8, gdp: -5 }, perm: { income: 6 }, tip: 'Ansvarsfullt. Ingen tackar dig.' },
      { text: 'INFLATERA BORT SKULDEN', law: ['monetary', 'loose'], cost: { pp: 20 }, temp: { qol: -6, approval: -4 }, perm: { income: 4 }, tip: 'Spararna betalar, utan att någon har frågat dem.' },
      { text: 'LÅNA MER — RÄNTAN ÄR LÅG JUST NU', res: { money: 900 }, perm: { income: -5 }, tip: 'Just nu.' },
      { text: 'SÄLJ STATLIG MARK OCH FASTIGHETER', res: { money: 700 }, temp: { approval: -3 }, perm: { statepower: -4 }, tip: 'Familjesilvret går bara att sälja en gång.' },
    ],
  },
  {
    id: 'eko_imf_terms', icon: '\u{1F91D}', weight: 2,
    title: 'VALUTAFONDEN STÄLLER VILLKOR',
    text: 'Den internationella valutafonden erbjuder ett nödlån som räddar statskassan. I gengäld kräver de lägre bidrag, högre moms och att subventionerna på bränsle tas bort.',
    when: (c) => ((c.ind.debt ?? 57) > 70 || c.mod('fiscal_collapse')) && (c.ind.gdppc ?? 9610) < 12000,
    choices: [
      { text: 'GODTA ALLA VILLKOR', res: { money: 1500 }, temp: { welfare: -10, unrest: 10, approval: -8 }, unmod: 'fiscal_collapse', rel: 6, tip: 'Kassan fylls. Gatorna också.' },
      { text: 'FÖRHANDLA FRAM MILDARE VILLKOR', cost: { pp: 30 }, res: { money: 800 }, temp: { welfare: -4, unrest: 4 }, tip: 'Hälften av pengarna, hälften av ilskan.' },
      { text: 'TACKA NEJ', temp: { approval: 8, gdp: -8 }, perm: { income: -3 }, rel: -5, tip: 'Stolt och pank.' },
    ],
  },
  {
    id: 'eko_austerity_streets', icon: '\u{2702}\u{FE0F}', weight: 2,
    title: 'NEDSKÄRNINGARNA NÅR GATAN',
    text: 'Bibliotek stänger, bussar dras in och sjukhusen säger upp personal. Lärare och sjuksköterskor marscherar sida vid sida genom huvudstaden.',
    when: (c) => c.mod('fiscal_collapse') && c.st.unrest > -10,
    choices: [
      { text: 'STOPPA NEDSKÄRNINGARNA', cost: { money: 900 }, temp: { unrest: -10, approval: 6 }, perm: { income: -3 }, tip: 'Krisen skjuts upp. Den försvinner inte.' },
      { text: 'FORTSÄTT — KASSAN MÅSTE I BALANS', temp: { unrest: 10, approval: -8, welfare: -6 }, perm: { income: 5 }, unmod: 'fiscal_collapse', tip: 'Siffrorna blir svarta. Stämningen också.' },
      { text: 'SKÄR I FÖRSVARET I STÄLLET', cost: { pp: 20 }, temp: { unrest: -6, milpower: -10, readiness: -8 }, tip: 'Generalerna har inga plakat. Än.' },
    ],
  },
  {
    id: 'eko_currency_crash', icon: '\u{1F4B1}', weight: 2,
    title: 'VALUTAN TAPPAR EN TREDJEDEL PÅ EN VECKA',
    text: 'Spekulanter har satsat mot valutan och centralbanken har bränt halva reserven på att försvara den. Importvarorna blir dyrare för varje dag.',
    when: (c) => ((c.ind.infl ?? 0) > 8 && (c.ind.tradebal ?? 0) < -10) || (c.mod('capital_flight') && (c.ind.debt ?? 57) > 80),
    choices: [
      { text: 'FÖRSVARA VALUTAN MED RESTEN AV RESERVEN', cost: { money: 1200 }, temp: { stability: 5 }, perm: { income: -2 }, tip: 'Antingen ger spekulanterna upp, eller så tar pengarna slut.' },
      { text: 'LÅT VALUTAN FLYTA', temp: { qol: -6, approval: -4 }, perm: { factory: 4 }, tip: 'Exporten blir billig. Allt annat blir dyrt.' },
      { text: 'INFÖR KAPITALKONTROLLER', cost: { pp: 25 }, temp: { freedom: -5, gdp: -4 }, rel: -4, tip: 'Gränserna stängs. För pengar.' },
    ],
  },
  {
    id: 'eko_capital_flight', icon: '\u{1F9F3}', weight: 2,
    title: 'KAPITALET FLYR LANDET',
    text: 'Stora summor flyttas varje dag till banker utomlands. Valutan försvagas, räntorna stiger och de rikaste familjerna har redan köpt hus i andra länder.',
    when: (c) => c.mod('capital_flight'),
    choices: [
      { text: 'INFÖR VALUTAKONTROLLER', cost: { pp: 25 }, unmod: 'capital_flight', temp: { freedom: -6, gdp: -4 }, rel: -4, tip: 'Pengarna stannar. Det gör inte förtroendet.' },
      { text: 'HÖJ RÄNTAN KRAFTIGT', cost: { pp: 15 }, unmod: 'capital_flight', temp: { gdp: -10, factory: -6 }, tip: 'Kapitalet stannar för att det lönar sig. Fabrikerna stänger av samma skäl.' },
      { text: 'LÅT DEM GÅ — VI KLARAR OSS UTAN', temp: { gdp: -6, income: -5, approval: 3 }, tip: 'Stolta ord. Tunnare kassa.' },
    ],
  },

  // ================= ARBETE & LÖNER =================
  {
    id: 'eko_youth_jobless', icon: '\u{1F392}', weight: 2,
    title: 'EN GENERATION UTAN JOBB',
    text: 'Var fjärde ung människa står utan arbete. De utbildade flyttar utomlands, de andra hänger på torgen och väntar på något som aldrig kommer.',
    when: (c) => (c.ind.youthunemp ?? 14) > 25,
    choices: [
      { text: 'STATLIGA UNGDOMSJOBB', cost: { money: 900 }, temp: { unrest: -8, approval: 6 }, perm: { income: -3 }, tip: 'Någon måste kratta parkerna. Nu är det någon.' },
      { text: 'LÄRLINGSPLATSER I INDUSTRIN', cost: { money: 400, pp: 15 }, temp: { unrest: -4 }, perm: { factory: 4, research: 2 }, tip: 'Långsamt. Fungerar.' },
      { text: 'SÄNKTA INGÅNGSLÖNER FÖR UNGA', cost: { pp: 20 }, temp: { qol: -4, approval: -5 }, perm: { gdp: 3 }, tip: 'Fler jobb. Sämre jobb.' },
      { text: 'DE FÅR KLARA SIG SJÄLVA', temp: { unrest: 5 }, mod: 'lost_generation', tip: 'De minns vem som inte hjälpte dem.' },
    ],
  },
  {
    id: 'eko_mass_unemployment', icon: '\u{1F4CB}', weight: 2,
    title: 'VAR SJÄTTE STÅR UTAN ARBETE',
    text: 'Arbetslösheten är den högsta på en generation. Arbetsförmedlingarna har köer runt kvarteret och i flera industriorter saknar halva befolkningen jobb.',
    when: (c) => (c.ind.unemp ?? 5) > 12,
    choices: [
      { text: 'STORA OFFENTLIGA BYGGPROJEKT', cost: { money: 1200 }, temp: { factory: 8, unrest: -8, approval: 6 }, tip: 'Vägar, broar och jobb. I den ordningen.' },
      { text: 'SÄNK ARBETSGIVARAVGIFTERNA', cost: { pp: 20 }, temp: { income: -8, gdp: 6 }, perm: { factory: 2 }, tip: 'Företagen anställer. Statskassan krymper.' },
      { text: 'KRÄV MOTPRESTATION FÖR ERSÄTTNINGEN', temp: { unrest: 6, freedom: -3 }, perm: { income: 3 }, tip: 'Ingen ersättning utan arbete. Och inget arbete att få.' },
    ],
  },
  {
    id: 'eko_factory_closure', icon: '\u{1F3ED}', weight: 2,
    title: 'FABRIKEN SOM BAR STADEN STÄNGER',
    text: 'Ägarna flyttar produktionen till ett land med lägre löner. Fyratusen människor förlorar jobbet på en dag och en hel stad står utan sin största arbetsgivare.',
    when: (c) => (c.ind.manuf ?? 10) > 12 && (c.ind.gdppc ?? 9610) > 15000,
    choices: [
      { text: 'STATEN KÖPER FABRIKEN', cost: { money: 1000 }, temp: { income: -4, approval: 6 }, perm: { statepower: 3, factory: 3 }, tip: 'Jobben räddas. Förlusterna också.' },
      { text: 'LOCKA HIT ETT NYTT FÖRETAG', cost: { money: 600, pp: 10 }, temp: { unrest: -4 }, perm: { research: 2 }, tip: 'Ett nytt bolag och en ny skylt på samma hus.' },
      { text: 'LÅT DEN STÄNGA', temp: { unrest: 8, approval: -6 }, perm: { gdp: 2 }, tip: 'Ekonomin blir effektivare. Staden blir tommare.' },
    ],
  },
  {
    id: 'eko_living_wage', icon: '\u{1FAA7}', weight: 2,
    title: 'FACKET KRÄVER EN LÖN ATT LEVA PÅ',
    text: 'Städare och lagerarbetare har två jobb och har ändå inte råd med hyran. Facket samlar namnunderskrifter för en lagstadgad minimilön som räcker till ett liv.',
    when: (c) => c.is('minimum_wage', 'low', 'none') && c.st.qol < 20,
    choices: [
      { text: 'HÖJ MINIMILÖNEN', law: ['minimum_wage', 'moderate'], cost: { pp: 20 }, temp: { approval: 8, qol: 4, gdp: -4 }, tip: 'Bättre lön. Färre timmar för vissa.' },
      { text: 'SKATTELÄTTNAD FÖR LÅGINKOMSTTAGARE', cost: { money: 600 }, temp: { qol: 5, approval: 4 }, perm: { income: -2 }, tip: 'Staten betalar mellanskillnaden. Arbetsgivarna tackar.' },
      { text: 'NEJ — LÅGA LÖNER GER FLER JOBB', temp: { unrest: 6, approval: -4 }, perm: { factory: 2 }, tip: 'Det finns jobb. Det finns bara ingen lön.' },
    ],
  },
  {
    id: 'eko_min_wage_cafes', icon: '\u{2615}', weight: 2,
    title: 'KAFÉERNA HAR INTE RÅD ATT ANSTÄLLA',
    text: 'Sedan minimilönen höjdes har småföretagen slutat anställa unga. Restaurangerna inför självbetjäning och sommarjobben har försvunnit.',
    when: (c) => c.is('minimum_wage', 'veryhigh', 'high') && (c.ind.youthunemp ?? 14) > 12,
    choices: [
      { text: 'SÄNK MINIMILÖNEN', law: ['minimum_wage', 'moderate'], cost: { pp: 25 }, temp: { approval: -6, gdp: 4 }, perm: { factory: 2 }, tip: 'Facket glömmer inte det här.' },
      { text: 'LÖNEBIDRAG FÖR DET FÖRSTA JOBBET', cost: { money: 700 }, temp: { unrest: -4, gdp: 3 }, tip: 'Staten betalar halva lönen. Kaféerna resten.' },
      { text: 'STÅ FAST VID LÖNEN', temp: { gdp: -4 }, perm: { qol: 2 }, tip: 'De som har jobb har det bra.' },
    ],
  },
  {
    id: 'eko_dock_strike', icon: '\u{2693}', weight: 2,
    title: 'HAMNARNA STÅR STILLA',
    text: 'Hamnarbetarnas fack har gått ut i strejk mot de nya självkörande kranarna. Containrar staplas på kajerna och exportföretagen kan inte leverera.',
    when: (c) => c.is('unions', 'mandatory', 'strong') && (c.ind.exports ?? 40) > 30,
    choices: [
      { text: 'GE HAMNARBETARNA VAD DE VILL', cost: { money: 700 }, temp: { unrest: -6 }, perm: { factory: -2 }, tip: 'Kranarna får vänta. Lönerna gör det inte.' },
      { text: 'TVÅNGSMEDLA I KONFLIKTEN', cost: { pp: 25 }, temp: { freedom: -4, approval: -4, factory: 4 }, tip: 'Ett avtal som ingen gillar. Därför håller det.' },
      { text: 'LÅT KONFLIKTEN PÅGÅ', temp: { gdp: -8, factory: -8 }, tip: 'Någon ger sig till slut. Förmodligen exporten.' },
    ],
  },
  {
    id: 'eko_union_underground', icon: '\u{1F56F}\u{FE0F}', weight: 2,
    title: 'FACKET ORGANISERAR SIG I SMYG',
    text: 'Arbetarna i textilfabrikerna håller hemliga möten i källare och föreningslokaler. De kräver kortare arbetsdagar och rätt att förhandla om lönen.',
    when: (c) => c.is('unions', 'banned', 'weak') && c.st.unrest > 0,
    choices: [
      { text: 'TILLÅT FACKET ATT FÖRHANDLA', law: ['unions', 'balanced'], cost: { pp: 20 }, temp: { unrest: -8, factory: -3 }, perm: { freedom: 3 }, tip: 'Förhandlingar i stället för källarmöten.' },
      { text: 'GRIP LEDARNA', cost: { pp: 20 }, temp: { unrest: 8, freedom: -8 }, mod: 'martyr', tip: 'Ledarna försvinner. Mötena gör det inte.' },
      { text: 'KÖP LUGNET MED BONUSAR', cost: { money: 500 }, temp: { unrest: -5 }, perm: { corruption: 2 }, tip: 'Lojalitet per kuvert.' },
      { text: 'LÅTSAS INTE SE DET', temp: { unrest: 5, statepower: -4 }, tip: 'Det som inte syns finns inte. En stund.' },
    ],
  },
  {
    id: 'eko_general_strike_week', icon: '\u{1F6AB}', weight: 3,
    title: 'GENERALSTREJKEN GÅR IN PÅ ANDRA VECKAN',
    text: 'Tåg, bussar, sophämtning och skolor står still. Strejkledningen säger att landet kan stå still hur länge som helst, och opinionen är fortfarande på deras sida.',
    when: (c) => c.mod('general_strike'),
    choices: [
      { text: 'GE EFTER PÅ ALLA KRAV', cost: { money: 1200 }, unmod: 'general_strike', temp: { approval: 6 }, perm: { income: -4 }, tip: 'Dyrt. Men tågen går imorgon.' },
      { text: 'FÖRHANDLA FRAM EN KOMPROMISS', cost: { pp: 30 }, unmod: 'general_strike', temp: { unrest: -4, statepower: -4 }, tip: 'Ingen är nöjd. Det är själva definitionen av en kompromiss.' },
      { text: 'FÖRBJUD STREJKEN', law: ['unions', 'weak'], cost: { pp: 35 }, unmod: 'general_strike', temp: { freedom: -10, unrest: 12, approval: -8 }, tip: 'Strejken slutar. Ilskan börjar.' },
      { text: 'VÄNTA UT DEM', temp: { gdp: -8, factory: -10, unrest: 4 }, tip: 'Någons strejkkassa tar slut först. Förhoppningsvis deras.' },
    ],
  },

  // ================= ÄGANDE & PENSIONER =================
  {
    id: 'eko_privatize_jewels', icon: '\u{1F48E}', weight: 2,
    title: 'STATENS JUVELER TILL SALU',
    text: 'Statskassan går med underskott och investerarna står i kö. Flygbolaget, telenätet och elbolaget kan säljas på en eftermiddag till högstbjudande.',
    when: (c) => c.is('ownership', 'nationalized', 'strategic') && c.st.income < 0,
    choices: [
      { text: 'SÄLJ ALLT TILL HÖGSTBJUDANDE', law: ['ownership', 'privatized'], res: { money: 1500 }, temp: { unrest: 6 }, perm: { corruption: 4, statepower: -6 }, tip: 'Rekordsnabb försäljning. Till rekordlåga priser, säger kritikerna.' },
      { text: 'SÄLJ EN MINORITETSPOST PÅ BÖRSEN', res: { money: 600 }, perm: { statepower: -2, gdp: 2 }, tip: 'Staten behåller nyckeln. Folket får köpa aktier.' },
      { text: 'BEHÅLL ALLT', temp: { income: -6 }, perm: { statepower: 3 }, tip: 'Det är folkets bolag. Folket får betala underskottet.' },
    ],
  },
  {
    id: 'eko_nationalize_mines', icon: '\u{26CF}\u{FE0F}', weight: 2,
    title: 'GRUVBOLAGEN TAR UT ALL VINST',
    text: 'Utländska gruvbolag bryter landets koppar och skickar vinsterna hem. Byarna runt gruvorna har fortfarande inget rinnande vatten.',
    when: (c) => c.is('ownership', 'privatized', 'full') && (c.ind.gdppc ?? 9610) < 15000,
    choices: [
      { text: 'FÖRSTATLIGA GRUVORNA', law: ['ownership', 'strategic'], cost: { pp: 30 }, perm: { income: 8 }, mod: 'capital_flight', rel: -8, tip: 'Gruvorna är era nu. Kunderna och maskinerna var deras.' },
      { text: 'HÖJ AVGIFTERNA PÅ MALMEN', cost: { pp: 15 }, temp: { gdp: -3 }, perm: { income: 5 }, rel: -3, tip: 'Bolagen klagar men stannar. Tills vidare.' },
      { text: 'KRÄV SKOLOR OCH VATTEN I BYARNA', cost: { pp: 10 }, temp: { factory: -2 }, perm: { qol: 3, hdi: 2 }, tip: 'Bolaget bygger en skola och sätter sin logga på den.' },
      { text: 'LÅT DEM GRÄVA', temp: { approval: -6 }, perm: { gdp: 2 }, tip: 'Investerarna är nöjda. Byarna har vant sig.' },
    ],
  },
  {
    id: 'eko_pension_funds_drop', icon: '\u{1F4C9}', weight: 2,
    title: 'PENSIONSSPARANDET HAR KRYMPT',
    text: 'Börsfallet har ätit upp en fjärdedel av folks pensionspengar. Den som skulle gå i pension i år får skjuta på det, och de som redan slutat jobba får mindre varje månad.',
    when: (c) => (c.is('pensions', 'private') && c.st.gdp < 10) || (c.is('pensions', 'mixed') && c.mod('downturn')),
    choices: [
      { text: 'STATEN GARANTERAR EN LÄGSTA NIVÅ', cost: { money: 900 }, temp: { approval: 6 }, perm: { welfare: 3, income: -2 }, tip: 'Ett golv under fallet. Golvet kostar.' },
      { text: 'TILLBAKA TILL ALLMÄN PENSION', law: ['pensions', 'public'], cost: { pp: 25 }, perm: { welfare: 4, income: -4 }, tip: 'Tryggare. Dyrare. Långsammare.' },
      { text: 'BÖRSEN KOMMER TILLBAKA', temp: { approval: -6, qol: -4 }, tip: 'Den gör alltid det. Frågan är bara när.' },
    ],
  },
  {
    id: 'eko_pensioner_majority', icon: '\u{1F474}', weight: 2,
    title: 'FLER PENSIONÄRER ÄN NÅGONSIN',
    text: 'Var femte invånare är över sextiofem och pensionerna är generösa. Varje år går en större del av statsbudgeten till pensioner, och de unga undrar vad som blir kvar åt dem.',
    when: (c) => c.is('pensions', 'generous', 'public') && (c.ind.old ?? 9) > 14,
    choices: [
      { text: 'INFÖR EN PREMIEPENSION', law: ['pensions', 'mixed'], cost: { pp: 25 }, temp: { approval: -6 }, perm: { income: 5 }, tip: 'Morgondagens pensionärer får spara själva. Dagens får behålla allt.' },
      { text: 'HÖJ AVGIFTEN PÅ LÖNERNA', cost: { pp: 15 }, temp: { approval: -3 }, perm: { welfare: 3, factory: -3 }, tip: 'De unga betalar för de gamla. Som alltid.' },
      { text: 'LOCKA HIT UNGA SKATTEBETALARE', cost: { pp: 20 }, temp: { integration: -3 }, perm: { immigration: 5, income: 3 }, tip: 'Någon måste betala pensionerna. Gärna någon ung.' },
      { text: 'GÖR INGENTING', perm: { income: -4 }, tip: 'Pensionärerna röstar. Barnen gör det inte.' },
    ],
  },
  {
    id: 'eko_no_pension', icon: '\u{1F9D3}', weight: 2,
    title: 'MORMOR STÅR FORTFARANDE I KASSAN',
    text: 'Utan allmän pension arbetar många långt upp i åttioårsåldern. En undersökning visar att var tredje gammal människa är helt beroende av sina barn.',
    when: (c) => c.is('pensions', 'none'),
    choices: [
      { text: 'INFÖR EN GRUNDPENSION', law: ['pensions', 'public'], cost: { pp: 25 }, temp: { approval: 8 }, perm: { welfare: 6, income: -5 }, tip: 'Ett litet belopp. En stor skillnad.' },
      { text: 'STATLIGT STÖD TILL PENSIONSSPARANDE', law: ['pensions', 'private'], cost: { money: 400 }, temp: { gdp: 3 }, perm: { welfare: 2 }, tip: 'Bra för den som har något att spara.' },
      { text: 'FAMILJEN FÅR TA ANSVAR', temp: { qol: -4 }, perm: { stability: 2 }, tip: 'Det har alltid fungerat. Säger de som har en familj.' },
    ],
  },

  // ================= BOSTÄDER =================
  {
    id: 'eko_housing_bubble', icon: '\u{1F3E0}', weight: 2,
    title: 'BOSTADSPRISERNA HAR FÖRDUBBLATS',
    text: 'En vanlig lägenhet i huvudstaden kostar nu tjugo årslöner. Bankerna lånar ut som aldrig förr och unga familjer tar lån som deras barnbarn ska betala.',
    when: (c) => (c.is('housing', 'market', 'deregulated') && (c.ind.gdppc ?? 9610) > 8000) || (c.mod('boom') && (c.ind.gdppc ?? 9610) > 30000),
    choices: [
      { text: 'INFÖR AMORTERINGSKRAV', cost: { pp: 20 }, temp: { gdp: -4, approval: -4 }, perm: { stability: 4 }, tip: 'Bubblan läcker luft långsamt. Mäklarna ringer och klagar.' },
      { text: 'BYGG BORT BRISTEN', cost: { money: 1000 }, perm: { qol: 4, factory: 3 }, tip: 'Fler bostäder, lägre priser. Om tio år.' },
      { text: 'LÅT PRISERNA STIGA', temp: { gdp: 5, approval: 3 }, perm: { stability: -5 }, tip: 'Alla som äger känner sig rika. Tills de ska sälja.' },
    ],
  },
  {
    id: 'eko_rent_queue', icon: '\u{1F3D8}\u{FE0F}', weight: 2,
    title: 'BOSTADSKÖN ÄR TJUGO ÅR LÅNG',
    text: 'Hyrorna är reglerade och låga, men ingen flyttar och ingen bygger nytt. Unga bor kvar hemma till trettio och förstahandskontrakt säljs svart för stora summor.',
    when: (c) => c.ideo !== 'socialism' && c.is('housing', 'rentcontrol') || (c.is('housing', 'public') && c.st.qol < 0),
    choices: [
      { text: 'FRIA HYROR I NYBYGGDA HUS', law: ['housing', 'mixed'], cost: { pp: 20 }, temp: { approval: -5 }, perm: { factory: 3, gdp: 2 }, tip: 'Byggkranarna kommer. Hyrorna följer med.' },
      { text: 'STATLIGT BYGGPROGRAM', cost: { money: 1100 }, temp: { factory: 3 }, perm: { qol: 5 }, tip: 'Staten bygger det som marknaden inte vill bygga.' },
      { text: 'JAGA DE SVARTA KONTRAKTEN', cost: { pp: 10 }, temp: { approval: -2 }, perm: { corruption: -3 }, tip: 'Kön blir rättvisare. Inte kortare.' },
      { text: 'LÅT KÖN VARA', temp: { qol: -3 }, perm: { corruption: 2 }, tip: 'Den som väntar på något gott. Och väntar.' },
    ],
  },
  {
    id: 'eko_shanty_towns', icon: '\u{1F3DA}\u{FE0F}', weight: 2,
    title: 'KÅKSTÄDERNA VÄXER RUNT HUVUDSTADEN',
    text: 'Varje vecka flyttar tusentals från landsbygden till staden för att hitta arbete. De bygger hus av plåt och brädor på mark som ingen äger, utan vatten eller el.',
    when: (c) => (c.ind.gdppc ?? 9610) < 5000 && (c.ind.popgrowth ?? 1) > 1.8,
    choices: [
      { text: 'GE DE BOENDE LAGFART PÅ SINA TOMTER', cost: { pp: 20 }, perm: { gdp: 3, qol: 3, corruption: -2 }, tip: 'Den som äger sitt hus bygger ut det.' },
      { text: 'DRA IN VATTEN OCH EL', cost: { money: 700 }, perm: { hdi: 4, qol: 4 }, tip: 'Enklast och viktigast. Det tar fem år.' },
      { text: 'RIV OCH BYGG NYTT', cost: { money: 1000 }, temp: { unrest: 8 }, perm: { qol: 5 }, tip: 'Nya hus. De gamla invånarna har flyttat till nästa kåkstad.' },
      { text: 'LÅT DET VÄXA', temp: { safety: -5, qol: -3 }, perm: { factory: 2 }, tip: 'Billig arbetskraft till fabrikerna. Ett problem för nästa regering.' },
    ],
  },

  // ================= SKATTER =================
  {
    id: 'eko_tax_haven_offer', icon: '\u{1F334}', weight: 2,
    title: 'SKA VI BLI ETT SKATTEPARADIS?',
    text: 'En grupp utländska advokater föreslår en lag som gör det skattefritt att registrera bolag här. Tusentals brevlådeföretag skulle betala avgifter till statskassan utan att någon behöver flytta hit.',
    when: (c) => ((c.ind.pop ?? 7000000) < 1000000 || c.is('taxes', 't0', 't10')) && c.st.income < 5,
    choices: [
      { text: 'JA — ÖPPNA FÖR BREVLÅDEFÖRETAGEN', res: { money: 900 }, perm: { corruption: 6 }, rel: -8, tip: 'Pengarna kommer. Frågorna också.' },
      { text: 'BARA FÖR FÖRETAG MED RIKTIG VERKSAMHET', cost: { pp: 15 }, mod: 'foreign_investment', perm: { corruption: 1 }, tip: 'Färre bolag, men de anställer folk.' },
      { text: 'NEJ TACK', temp: { income: -3 }, perm: { corruption: -2 }, rel: 2, tip: 'Fattig men hederlig.' },
    ],
  },
  {
    id: 'eko_low_tax_state', icon: '\u{1F573}\u{FE0F}', weight: 2,
    title: 'LÅGSKATTESTATEN HAR TOMMA KASSOR',
    text: 'Skatterna är bland de lägsta i världen och företagen älskar det. Men vägarna har hål, lärarna slutar och polisen har inte råd med bensin till bilarna.',
    when: (c) => c.is('taxes', 't0', 't10') && c.st.income < 20,
    choices: [
      { text: 'HÖJ SKATTERNA TILL EN MÅTTLIG NIVÅ', law: ['taxes', 'balanced'], cost: { pp: 25 }, temp: { approval: -6, gdp: -3 }, perm: { income: 6, safety: 2 }, tip: 'Vägarna lagas. Företagarna muttrar.' },
      { text: 'AVGIFTER I STÄLLET FÖR SKATT', temp: { qol: -5, approval: -3 }, perm: { income: 3 }, tip: 'Tull på vägen, avgift i skolan. Det heter inte skatt.' },
      { text: 'LÅT PRIVATA FÖRETAG SKÖTA DET', cost: { pp: 15 }, perm: { safety: -2, corruption: 3, income: 2 }, tip: 'Vakter i stället för poliser. För den som betalar.' },
    ],
  },
  {
    id: 'eko_wealth_gap', icon: '\u{1F3A9}', weight: 2,
    title: 'DEN RIKASTE PROCENTEN ÄGER HÄLFTEN',
    text: 'En ny rapport visar att den rikaste hundradelen äger hälften av landets förmögenheter. Rapporten delas miljontals gånger och oppositionen kräver handling.',
    when: (c) => (c.ind.gini ?? 34) > 42,
    choices: [
      { text: 'INFÖR FÖRMÖGENHETSSKATT', cost: { pp: 25 }, temp: { approval: 6, gdp: -5 }, perm: { income: 5 }, tip: 'Några av de rika betalar. Andra flyttar.' },
      { text: 'HÖJ SKATTEN PÅ STORA ARV', cost: { pp: 20 }, temp: { approval: 2 }, perm: { income: 3, welfare: 2 }, tip: 'De döda klagar inte. Deras barn gör det.' },
      { text: 'SATSA PÅ SKOLOR I FATTIGA OMRÅDEN', cost: { money: 800 }, perm: { hdi: 3, qol: 2 }, tip: 'Klyftorna minskar. Om en generation.' },
      { text: 'DET ÄR FRAMGÅNG, INTE ORÄTTVISA', temp: { unrest: 6, approval: -4 }, perm: { gdp: 2 }, tip: 'Det sipprar ner. Sägs det.' },
    ],
  },
  {
    id: 'eko_no_one_pays_tax', icon: '\u{1F9EE}', weight: 2,
    title: 'NÄSTAN INGEN BETALAR SKATT',
    text: 'Mindre än en av tio vuxna betalar inkomstskatt. Den mesta handeln sker kontant på marknader och gator, utan kvitto och utan att staten ser den.',
    when: (c) => (c.ind.tax ?? 16) < 11 && (c.ind.gdppc ?? 9610) < 8000,
    choices: [
      { text: 'SKATTEINBETALNING MED MOBILEN', cost: { money: 500, rp: 30 }, perm: { income: 6, corruption: -3 }, tip: 'Det är svårare att muta en app.' },
      { text: 'MOMS PÅ ALLT', cost: { pp: 20 }, temp: { qol: -5, approval: -6 }, perm: { income: 5 }, tip: 'Alla betalar. De fattiga mest.' },
      { text: 'ANLITA PRIVATA SKATTEINDRIVARE', temp: { unrest: 4 }, perm: { income: 4, corruption: 5 }, tip: 'Effektivt. Indrivarna tar sin del först.' },
      { text: 'LÅT DEN SVARTA EKONOMIN VARA', temp: { gdp: 3 }, perm: { corruption: 2 }, tip: 'Den fungerar ju. Bara inte för staten.' },
    ],
  },

  // ================= HANDEL & RÅVAROR =================
  {
    id: 'eko_farmers_trade_deal', icon: '\u{1F69C}', weight: 2,
    title: 'BÖNDERNA BLOCKERAR MOTORVÄGARNA',
    text: 'Ett nytt frihandelsavtal öppnar marknaden för billigt kött och spannmål från andra sidan jorden. Tusentals traktorer har parkerat på motorvägarna in mot huvudstaden.',
    when: (c) => c.is('globalism', 'major', 'big', 'partner') && (c.ind.agri ?? 6) > 3,
    choices: [
      { text: 'SKRIV UNDER AVTALET ÄNDÅ', temp: { unrest: 8, approval: -4 }, perm: { gdp: 4 }, rel: 6, tip: 'Billigare mat i butikerna. Tomma gårdar på landet.' },
      { text: 'UNDANTAG FÖR JORDBRUKET', cost: { pp: 20 }, temp: { unrest: -6 }, rel: -4, tip: 'Avtalet blir halvt. Bönderna åker hem.' },
      { text: 'STÖDPAKET TILL BÖNDERNA', cost: { money: 800 }, temp: { unrest: -8, approval: 4 }, perm: { gdp: 2 }, rel: 3, tip: 'Frihandel med statligt stöd. En klassiker.' },
    ],
  },
  {
    id: 'eko_coffee_crash', icon: '\u{1F33E}', weight: 2,
    title: 'KAFFEPRISET HAR RASAT',
    text: 'Priset på landets viktigaste exportgröda har halverats på världsmarknaden på ett halvår. Miljoner småbönder säljer sin skörd med förlust.',
    when: (c) => (c.ind.agri ?? 6) > 18 && (c.ind.gdppc ?? 9610) < 6000,
    choices: [
      { text: 'STATEN KÖPER UPP SKÖRDEN', cost: { money: 800 }, temp: { unrest: -6, approval: 4 }, perm: { income: -2 }, tip: 'Lagren fylls. Priset stiger inte för det.' },
      { text: 'BYGG EGNA ROSTERIER', cost: { money: 500, rp: 20 }, perm: { factory: 4, gdp: 3 }, tip: 'Sälj färdigt kaffe i stället för råa bönor.' },
      { text: 'HJÄLP BÖNDERNA ATT BYTA GRÖDA', cost: { pp: 15 }, temp: { qol: -3 }, perm: { gdp: 2 }, tip: 'Det tar tre år innan de nya träden bär frukt.' },
      { text: 'DE FÅR KLARA SIG', temp: { unrest: 8, qol: -6 }, tip: 'Världsmarknaden är inte din sak. Bönderna tycker annorlunda.' },
    ],
  },
  {
    id: 'eko_tariff_war', icon: '\u{1F6A7}', weight: 2,
    title: 'TULLKRIGET TRAPPAS UPP',
    text: 'Dina tullar har besvarats med motåtgärder. Stora handelspartner har lagt höga tullar på landets viktigaste exportvaror och fabrikerna börjar varsla.',
    when: (c) => c.is('globalism', 'protectionism', 'disengagement', 'isolationist') && (c.ind.exports ?? 40) > 25,
    choices: [
      { text: 'SVARA MED ÄNNU HÖGRE TULLAR', cost: { pp: 15 }, temp: { factory: 4, gdp: -6 }, rel: -8, tip: 'Ingen vinner ett tullkrig. Men någon förlorar mest.' },
      { text: 'FÖRHANDLA FRAM EN UPPGÖRELSE', law: ['globalism', 'balanced'], cost: { pp: 25 }, temp: { gdp: 4 }, rel: 6, tip: 'Tullarna sänks. Stoltheten också.' },
      { text: 'HITTA NYA MARKNADER', cost: { money: 600 }, temp: { gdp: 2 }, perm: { factory: 2 }, rel: 3, tip: 'Det finns andra kunder. De bor bara längre bort.' },
      { text: 'HÅLL UT', temp: { gdp: -6, factory: -6, approval: 2 }, tip: 'Tullarna skyddar oss. Mest från exportintäkter.' },
    ],
  },
  {
    id: 'eko_oil_spike', icon: '\u{26FD}', weight: 2,
    title: 'OLJEPRISET HAR FÖRDUBBLATS',
    text: 'Krig och produktionsstopp i fjärran länder har fått oljepriset att rusa. Bensin, frakter och el blir dyrare, och åkerierna hotar att blockera städerna.',
    when: (c) => c.is('energy', 'fossil') || (c.is('energy', 'mixed') && (c.ind.imports ?? 47) > 70),
    choices: [
      { text: 'SÄNK SKATTEN PÅ BRÄNSLE', cost: { money: 700 }, temp: { approval: 6, unrest: -4 }, perm: { income: -2 }, tip: 'Billigare bensin. Dyrare budget.' },
      { text: 'SATSA PÅ ELBILAR OCH TÅG', law: ['energy', 'green'], cost: { money: 600, pp: 15 }, temp: { factory: -4 }, perm: { qol: 2 }, tip: 'Rätt väg. Lång väg.' },
      { text: 'TÖM DE STRATEGISKA LAGREN', temp: { gdp: 3, readiness: -6 }, tip: 'Lagren var till för krig. Det här känns som ett.' },
      { text: 'LÅT PRISET SLÅ IGENOM', temp: { unrest: 8, gdp: -6 }, tip: 'Folk kör mindre. Och röstar annorlunda.' },
    ],
  },
  {
    id: 'eko_oil_crash', icon: '\u{1F6E2}\u{FE0F}', weight: 2,
    title: 'OLJEPRISET HAR KRASCHAT',
    text: 'Världsmarknaden svämmar över av olja och priset har fallit till en tredjedel. Statsbudgeten bygger på oljeintäkter som plötsligt inte finns.',
    when: (c) => ((c.ind.co2 ?? 3) > 9 && (c.ind.gdppc ?? 9610) > 8000) || (c.is('energy', 'fossil') && (c.ind.exports ?? 40) > 45),
    choices: [
      { text: 'SKÄR NER I STATSBUDGETEN', temp: { welfare: -8, approval: -6 }, perm: { income: 3 }, tip: 'Bensinsubventionerna går först. Sedan lugnet.' },
      { text: 'TA AV OLJEFONDEN', cost: { money: 1000 }, temp: { stability: 5, approval: 4 }, tip: 'Det var ju det den var till för.' },
      { text: 'BYGG UPP NYA NÄRINGAR', cost: { money: 700, rp: 30 }, temp: { income: -4 }, perm: { factory: 3, research: 3 }, tip: 'Turism, teknik, finans. Allt utom olja.' },
    ],
  },
  {
    id: 'eko_remittances', icon: '\u{2708}\u{FE0F}', weight: 2,
    title: 'PENGARNA FRÅN DEM SOM REST',
    text: 'Miljoner landsmän arbetar utomlands och skickar hem en del av lönen varje månad. Pengarna är mer värda än all export, men bankerna tar stora avgifter på varje överföring.',
    when: (c) => (c.ind.netmig ?? 0) < -15000 && (c.ind.gdppc ?? 9610) < 10000,
    choices: [
      { text: 'BILLIGA ÖVERFÖRINGAR VIA MOBILEN', cost: { money: 400, rp: 20 }, perm: { gdp: 3, qol: 2 }, tip: 'Mer pengar når fram. Bankerna tycker inte om det.' },
      { text: 'SÄLJ OBLIGATIONER TILL LANDSMÄNNEN', res: { money: 900 }, perm: { income: -3 }, tip: 'Landsmännen utomlands lånar ut till hemlandet. De vill ha tillbaka pengarna.' },
      { text: 'BESKATTA ÖVERFÖRINGARNA', res: { money: 500 }, temp: { approval: -6 }, perm: { corruption: 2 }, tip: 'Folk skickar pengarna med vänner i stället.' },
      { text: 'LOCKA HEM DEM SOM REST', cost: { money: 600 }, temp: { gdp: -2 }, perm: { research: 2, factory: 2 }, tip: 'Några kommer. Med kunskap och nya idéer.' },
    ],
  },

  // ================= KONJUNKTUR & FÖRETAG =================
  {
    id: 'eko_overheating', icon: '\u{1F321}\u{FE0F}', weight: 2,
    title: 'EKONOMIN GÅR FÖR VARMT',
    text: 'Högkonjunkturen har pågått i flera år. Byggkranarna står tätt, företagen bjuder över varandra på personal och priserna stiger snabbare än lönerna.',
    when: (c) => c.mod('boom') && c.st.gdp > -10,
    choices: [
      { text: 'STRAMA ÅT BUDGETEN', cost: { pp: 20 }, unmod: 'boom', perm: { income: 5, stability: 3 }, tip: 'Du bär ut bålen innan festen spårar ur.' },
      { text: 'FYLL STATSKASSAN MEDAN DET GÅR BRA', res: { money: 900 }, temp: { approval: -4 }, tip: 'Spara i ladorna. Folk vill hellre ha fest.' },
      { text: 'SÄNK SKATTEN — FOLK HAR FÖRTJÄNAT DET', temp: { approval: 10, gdp: 6 }, perm: { income: -4, stability: -3 }, tip: 'Ved på en brasa som redan brinner.' },
    ],
  },
  {
    id: 'eko_layoff_wave', icon: '\u{1F53B}', weight: 2,
    title: 'VARSELVÅGEN',
    text: 'Lågkonjunkturen biter. Varje dag kommer nya besked om uppsägningar från verkstäder, butiker och byggföretag, och hushållen har slutat handla.',
    when: (c) => c.mod('downturn') || ((c.ind.gdpgrowth ?? 3) < 0 && c.st.gdp < 0),
    choices: [
      { text: 'KRISPAKET TILL NÄRINGSLIVET', cost: { money: 1000 }, unmod: 'downturn', temp: { gdp: 4 }, perm: { income: -2 }, tip: 'Staten köper sig ur krisen. På kredit.' },
      { text: 'KORTTIDSARBETE MED STATLIGT STÖD', cost: { money: 500 }, temp: { unrest: -5, factory: -2 }, tip: 'Ingen blir av med jobbet. Alla jobbar lite mindre.' },
      { text: 'LÅT KRISEN RENSA UT DE SVAGA', temp: { unrest: 8, gdp: -6 }, perm: { factory: 3 }, tip: 'Det som överlever blir starkare. Resten blir arbetslöst.' },
    ],
  },
  {
    id: 'eko_miracle_share', icon: '\u{2728}', weight: 2,
    title: 'ARBETARNA VILL HA SIN DEL AV UNDRET',
    text: 'Ekonomin växer snabbare än nästan någon annanstans i världen. Men i fabrikerna har lönerna stått still, och arbetarna börjar fråga vart alla pengar tar vägen.',
    when: (c) => c.mod('economic_miracle'),
    choices: [
      { text: 'GE ALLA EN ENGÅNGSBONUS', cost: { money: 900 }, temp: { approval: 10, unrest: -6 }, tip: 'En gång. De kommer att fråga igen.' },
      { text: 'HÖJ MINIMILÖNEN', law: ['minimum_wage', 'high'], cost: { pp: 20 }, temp: { gdp: -4, approval: 8 }, perm: { qol: 3 }, tip: 'Undret blir lite långsammare och lite rättvisare.' },
      { text: 'VINSTERNA SKA ÅTERINVESTERAS', temp: { unrest: 8, approval: -4 }, perm: { factory: 4 }, tip: 'Fler fabriker i dag, högre löner i morgon. Kanske.' },
    ],
  },
  {
    id: 'eko_car_plant', icon: '\u{1F697}', weight: 2,
    title: 'EN BILJÄTTE VILL BYGGA HÄR',
    text: 'En av världens största biltillverkare vill bygga en fabrik med tiotusen anställda. Tre andra länder tävlar om samma fabrik och bolaget vill ha besked inom en månad.',
    when: (c) => c.mod('foreign_investment') || ((c.ind.fdi ?? 2) > 6 && c.st.stability > 0),
    choices: [
      { text: 'GE DEM ALLT DE BER OM', temp: { income: -8 }, perm: { factory: 6, gdp: 4, corruption: 2 }, tip: 'Skattefrihet, gratis mark och en egen motorväg. Fabriken kommer.' },
      { text: 'KRÄV LOKALA UNDERLEVERANTÖRER', cost: { pp: 20 }, perm: { factory: 4, research: 2 }, tip: 'Svårare förhandling. Mer stannar i landet.' },
      { text: 'KRÄV KOLLEKTIVAVTAL OCH MILJÖHÄNSYN', cost: { pp: 10 }, temp: { factory: 2 }, perm: { qol: 2 }, tip: 'Bolaget funderar. Kanske bygger det ändå.' },
    ],
  },
  {
    id: 'eko_labor_shortage', icon: '\u{1F6E0}\u{FE0F}', weight: 2,
    title: 'FABRIKERNA HITTAR INGEN PERSONAL',
    text: 'Orderböckerna är fulla, men det finns ingen att anställa. Svetsare, elektriker och lastbilsförare saknas överallt och lönerna rusar.',
    when: (c) => c.mod('industrial_boom') || ((c.ind.unemp ?? 5) < 3 && (c.ind.manuf ?? 10) > 12),
    choices: [
      { text: 'ÖPPNA FÖR ARBETSKRAFTSINVANDRING', law: ['immigration', 'points'], cost: { pp: 20 }, temp: { integration: -4 }, perm: { immigration: 6, factory: 4 }, tip: 'Svetsare från hela världen. Med familjer.' },
      { text: 'YRKESUTBILDNING I STOR SKALA', cost: { money: 700 }, perm: { factory: 3, hdi: 2 }, tip: 'Om tre år finns svetsarna. Om ordrarna finns kvar då.' },
      { text: 'AUTOMATISERA', cost: { money: 800, rp: 40 }, perm: { factory: 6, research: 2 }, tip: 'Robotar söker inte jobb hos konkurrenten.' },
      { text: 'LÅT LÖNERNA STIGA', temp: { qol: 4, factory: -4 }, tip: 'Marknaden sköter det. I marknadens takt.' },
    ],
  },
  {
    id: 'eko_conglomerate', icon: '\u{1F419}', weight: 2,
    title: 'ETT ENDA BOLAG ÄGER HALVA LANDET',
    text: 'Samma familjeföretag äger bankerna, tidningarna, cementfabrikerna och flygbolaget. Ingen konkurrent överlever länge och avgående ministrar får gärna plats i styrelsen.',
    when: (c) => c.st.corruption > 15 && (c.ind.regq ?? 0) < 0 && !c.is('ownership', 'nationalized'),
    choices: [
      { text: 'STYCKA KONGLOMERATET', cost: { pp: 35 }, temp: { stability: -5 }, perm: { corruption: -6, gdp: 3 }, tip: 'Familjen har vänner. Nu har du fiender.' },
      { text: 'EN KONKURRENSMYNDIGHET MED TÄNDER', cost: { money: 500, pp: 10 }, perm: { corruption: -4 }, tip: 'Långsamt. Familjens advokater är många.' },
      { text: 'SAMARBETA MED FAMILJEN', res: { money: 800 }, perm: { corruption: 6, statepower: -3 }, tip: 'De har alltid varit generösa mot sina vänner.' },
    ],
  },
];
