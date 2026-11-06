// IMPERIUM V5.16 VERKLIGHETEN — HÄNDELSER: PROTESTER.
// Protestmaskinen. Här styr inte en enskild lag utan hur mycket missnöje som byggts
// upp (c.griev, c.grievOf(slag)). Nivåerna följer verkligheten:
//   15–30  namnlistor, protestvisor, kampanjer på nätet, små lördagsdemonstrationer
//   30–60  stora demonstrationer, ockupationer, strejker i vård, skola, hamn och tåg
//   60+    generalstrejk, kravaller, hungerstrejker, civil olydnad, regeringskris
//   80+    landet står still
// Varje slag av missnöje har egna protester (kind + react på färska lagändringar).
// Statsskicket spelar roll: i demokratier (c.demo > 6) är protesterna öppna och polisens
// taktik, medlare och förhandlingar avgör. I auktoritära stater (c.demo < 4) går
// protesten under jorden: flygblad, hemliga strejker, exilgrupper och tillslag som
// kostar demokrati och anseende. Och när missnöjet lägger sig märks också det.
// Hårda tag lugnar nu men ger ofta en räkning senare (next: 'pro_eftersmak').
export const EVENTS = [

  // ===== DE FÖRSTA TECKNEN (missnöje 15–30) =====
  {
    id: 'pro_namninsamling', icon: '\u{1F4DD}', weight: 2, cooldown: 600,
    title: 'NAMNLISTAN MED 200 000 NAMN',
    text: 'Tre pensionerade lärare har burit fyrtio flyttkartonger uppför trappan till parlamentet i {huvudstad}. I kartongerna ligger 200 000 underskrifter mot regeringens senaste beslut. Det är ingen storm än, men det är fler namn än någon namninsamling fått ihop på tio år, och tidningarna har redan fotograferat kartongerna.',
    when: (c) => c.griev >= 15 && c.griev < 30 && c.day > 40,
    choices: [
      { text: 'TA EMOT LISTAN PERSONLIGEN PÅ TRAPPAN', cost: { pp: 5 }, temp: { approval: 3 }, griev: -4, ind: { trustgov: 2 }, tip: 'Tio minuter på en trappa kan spara tio månader av bråk.' },
      { text: 'LÅT EN TJÄNSTEMAN KVITTERA KARTONGERNA', temp: { approval: -2 }, griev: 3, tip: 'Kartongerna hamnar i ett förråd. Fotona hamnar på förstasidan.' },
      { text: 'BJUD IN TILL ETT RIKTIGT SAMRÅD', cost: { pp: 12 }, temp: { unrest: -3 }, griev: -7, perm: { freedom: 1 }, tip: 'Samråd tar tid. Men det känns som att någon lyssnar.' },
    ],
  },
  {
    id: 'pro_protestvisa', icon: '\u{1F3B5}', weight: 2, cooldown: 900,
    title: 'PROTESTVISAN TOPPAR LISTAN',
    text: 'En okänd folksångerska från {stad} har spelat in en visa om "herrarna i {huvudstad} som aldrig har åkt buss". Den har spelats fyra miljoner gånger på en vecka och sjungs nu på skolgårdar och på fotbollsläktare. Refrängen handlar, enligt de flesta som lyssnat, ganska tydligt om dig.',
    when: (c) => c.griev >= 15 && c.griev < 40 && c.demo > 4,
    choices: [
      { text: 'SKRATTA MED OCH BJUD IN HENNE', cost: { pp: 5 }, tip: 'Humor är ett vapen. Det kan peka åt båda hållen.',
        risk: { chance: 0.6,
          win: { text: 'Hon kommer, sjunger visan för dig och ni skrattar båda i direktsänd tv.', temp: { approval: 5 }, griev: -3 },
          lose: { text: 'Hon tackar nej offentligt. Visan får en ny vers om inbjudan.', temp: { approval: -3 }, griev: 2 } } },
      { text: 'LYSSNA PÅ TEXTEN OCH ÄNDRA NÅGOT', cost: { money: 120 }, griev: -6, temp: { approval: 3 }, tip: 'Det är inte varje dag en schlager blir ett utredningsdirektiv.' },
      { text: 'BE RADIOKANALERNA ATT LÅTA BLI ATT SPELA DEN', temp: { freedom: -3, approval: -4 }, griev: 5, ind: { pressfree: -2 }, tip: 'Inget gör en låt mer populär än ett förbud.' },
    ],
  },
  {
    id: 'pro_hashtag', icon: '\u{1F4F1}', weight: 2, cooldown: 800,
    title: 'KAMPANJEN SOM TOG ÖVER NÄTET',
    text: 'En hashtagg som började med en tonårings video om föräldrarnas räkningar har blivit den mest delade i landets historia. Tusentals berättar om vårdköer, hyror och löften som inte hölls. Influerare med miljoner följare har hakat på, och flera annonsörer har tyst dragit sig ur reklamen kring regeringens egna kanaler.',
    when: (c) => c.griev >= 15 && c.griev < 40 && (c.ind.internet ?? 60) > 50 && c.demo > 3,
    choices: [
      { text: 'SVARA PÅ HISTORIERNA I EN LÅNG DIREKTSÄNDNING', cost: { pp: 8 }, temp: { approval: 3 }, griev: -5, ind: { trustgov: 2 }, tip: 'Tre timmar, inga manus. Pressavdelningen har inte sovit.' },
      { text: 'STARTA EN MOTKAMPANJ MED SIFFROR OCH LÖFTEN', cost: { money: 150 },
        risk: { chance: 0.5,
          win: { text: 'Siffrorna går hem. Många säger att de inte kände till reformerna.', temp: { approval: 4 }, griev: -4 },
          lose: { text: 'Motkampanjen hånas som betald reklam. Hashtaggen får nytt liv.', temp: { approval: -3 }, griev: 3 } } },
      { text: 'KALLA DET EN UTLÄNDSK PÅVERKANSKAMPANJ', temp: { approval: -4, freedom: -2 }, griev: 5, rel: -2, ind: { trustgov: -3 }, tip: 'Tonåringen från {stad} blir oväntat berömd i {land}.' },
    ],
  },
  {
    id: 'pro_lordag', icon: '\u{1FAA7}', weight: 2, cooldown: 1000,
    title: 'TREDJE LÖRDAGEN PÅ TORGET',
    text: 'Det är ingen massrörelse än. Ett par tusen människor med hemgjorda skyltar står på stora torget i {huvudstad}, och talarna har fått låna högtalare av korvkiosken. Men polisen noterar att det är tredje lördagen i rad, att de blir fler varje gång och att skyltarna har börjat handla om dig personligen.',
    when: (c) => c.griev >= 18 && c.griev < 40 && c.demo > 5,
    choices: [
      { text: 'SKICKA EN MINISTER ATT LYSSNA PÅ PLATS', cost: { pp: 6 }, temp: { unrest: -2, approval: 2 }, griev: -4, next: [null, 'pro_lordag_dialog'], tip: 'Att stå i blåsten med dem säger mer än ett tal.' },
      { text: 'LÅT DEM HÅLLA PÅ — DET GÅR ÖVER', temp: { approval: -2 }, griev: 3, next: ['pro_lordag_vaxer', null], tip: 'Ibland går det över. Ibland blir de fler.' },
      { text: 'FLYTTA DEMONSTRATIONERNA TILL EN PARK UTANFÖR CENTRUM', temp: { freedom: -2, stability: 2 }, griev: 5, ind: { trustgov: -2 }, next: 'pro_lordag_vaxer', tip: 'Ingen gillar att bli bortflyttad. Minst av allt de som protesterar.' },
    ],
  },
  {
    id: 'pro_lordag_vaxer', icon: '\u{270A}', chain: true,
    title: 'FYRTIOTUSEN EN LÖRDAG',
    text: 'Lördagsrörelsen har vuxit. I dag fyllde fyrtiotusen människor gatorna från torget ner till hamnen, med barnvagnar, fackföreningsfanor och en blåsorkester från {stad}. Arrangörerna har nu ett namn, en hemsida och tre krav. Det första är att du ska lyssna. De två andra kostar pengar.',
    choices: [
      { text: 'BJUD IN ARRANGÖRERNA TILL FÖRHANDLINGAR', cost: { pp: 12 }, temp: { unrest: -3 }, next: 'pro_lordag_dialog', tip: 'Sitter de vid bordet står de inte på torget.' },
      { text: 'GÅ MED PÅ DE TRE KRAVEN DIREKT', cost: { money: 600, pp: 10 }, griev: -15, temp: { approval: 5, unrest: -5 }, tip: 'Dyrt, snabbt och effektivt. Andra grupper har noterat metoden.' },
      { text: 'SÄTT UPP KRAVALLSTAKET RUNT TORGET', temp: { unrest: 5, freedom: -3, stability: 2 }, griev: 8, ind: { trustgov: -4, protests: 30 }, next: ['pro_eftersmak', null], tip: 'Staket är bra på att hålla folk ute. Och på att samla dem utanför.' },
    ],
  },
  {
    id: 'pro_lordag_dialog', icon: '\u{1F91D}', chain: true,
    title: 'FÖRHANDLINGEN I FOLKETS HUS',
    text: 'Klockan är två på natten i Folkets hus i {huvudstad}. Lördagsrörelsens talespersoner, en undersköterska, en student och en pensionerad lokförare, sitter mitt emot dina förhandlare med kall pizza och en whiteboard full av siffror. De vill ha något på papper före morgonnyheterna.',
    choices: [
      { text: 'SKRIV UNDER ETT FEMPUNKTSPROGRAM', cost: { money: 350, pp: 8 }, griev: -16, temp: { unrest: -6, approval: 4 }, ind: { trustgov: 4, protests: -40 }, tip: 'Fem punkter, tre år, en underskrift. Lördagarna blir lediga igen.' },
      { text: 'LOVA EN UTREDNING', cost: { pp: 5 }, griev: -5, next: [null, 'pro_lordag_vaxer'], tip: 'Utredningar är politikens snoozeknapp.' },
      { text: 'LÄGG ETT SLUTBUD OCH GÅ HEM',
        risk: { chance: 0.5,
          win: { text: 'De accepterar. Inte glada, men trötta. Torget töms till helgen.', griev: -8, temp: { unrest: -3 } },
          lose: { text: 'De lämnar rummet och går direkt till tv-studion.', griev: 8, temp: { unrest: 5, approval: -3 } } } },
    ],
  },

  // ===== VÄLFÄRDEN =====
  {
    id: 'pro_vard_upprop', icon: '\u{1F3E5}', cooldown: 900, kind: 'valfard', react: true,
    title: 'SJUKSKÖTERSKORNA SÄGER IFRÅN',
    text: 'Sedan beslutet om {lag} har sjuksköterskorna på akuten i {stad} gått dubbla pass i sex veckor. I dag lämnade fyrahundra av dem in ett gemensamt brev: fler kollegor och bättre villkor, annars vägrar de övertid från första maj. Facket säger att det inte är ett hot. Alla vet att det är ett hot.',
    when: (c) => c.cut('healthcare', 'healthcare_quality', 'welfare') && c.grievOf('valfard') > 10,
    choices: [
      { text: 'BACKA BESLUTET OM {LAG}', cost: { pp: 20 }, undo: true, griev: -18, temp: { approval: 4 }, tip: 'Att backa kostar prestige. Att inte backa kostar sjuksköterskor.' },
      { text: 'GE VÅRDEN ETT EXTRA ANSLAG I ÅR', cost: { money: 450 }, griev: -7, temp: { unrest: -2 }, next: [null, 'pro_vard_strejk'], tip: 'Pengarna köper ett halvår. Frågan är vad som händer sedan.' },
      { text: 'SÄG ATT LÖNERNA ÄR EN SAK FÖR PARTERNA', griev: 6, temp: { unrest: 3 }, ind: { trustgov: -2 }, next: 'pro_vard_strejk', tip: 'Formellt helt korrekt. Det brukar inte hjälpa.' },
    ],
  },
  {
    id: 'pro_vard_strejk', icon: '\u{1FA7A}', chain: true, kind: 'valfard',
    title: 'VÅRDSTREJKEN HAR BÖRJAT',
    text: 'Klockan sju i morse gick trettiotusen sjuksköterskor ut i strejk. Akutmottagningarna har skyddsbemanning, men planerade operationer ställs in: höftleder, gråstarr, bråck. Väntetiden i vården, som redan var lång, växer för varje dag. Mätningarna är tydliga: sju av tio står på sjuksköterskornas sida.',
    choices: [
      { text: 'GÅ MED PÅ KRAVEN', cost: { money: 900 }, griev: -20, temp: { approval: 5, unrest: -5 }, perm: { welfare: 1 }, ind: { strikes: -40 }, tip: 'Dyrt. Men höftlederna blir opererade.' },
      { text: 'TILLSÄTT EN MEDLARE', cost: { pp: 10 }, temp: { unrest: 2 }, ind: { strikes: 30 }, next: ['pro_vard_avtal', 'pro_vard_flykt'], tip: 'Medlare hittar mitten. Den kan ligga långt bort.' },
      { text: 'KALLA IN MILITÄRENS SJUKVÅRDARE', temp: { unrest: 6, approval: -6, readiness: -3 }, griev: 10, ind: { trustgov: -5 }, next: 'pro_vard_flykt', tip: 'Fältsjukvårdare kan mycket. Gråstarr är inte en av sakerna.' },
    ],
  },
  {
    id: 'pro_vard_avtal', icon: '\u{1F91D}', chain: true, kind: 'valfard',
    title: 'AVTALET SOM RÄDDADE VÅRDEN',
    text: 'Efter nio dygn hos medlaren ligger ett bud på bordet: högre lön för nattpass, tak för övertiden och fyratusen nya utbildningsplatser. Sjuksköterskorna har röstat, och sex av tio säger ja. På akuten i {stad} har någon redan hängt upp en banderoll: "VI KOMMER TILLBAKA. TACK FÖR ATT NI LYSSNADE."',
    choices: [
      { text: 'SKRIV UNDER OCH FINANSIERA FULLT UT', cost: { money: 600 }, griev: -18, temp: { approval: 5, qol: 2 }, perm: { welfare: 1 }, ind: { strikes: -50, trustgov: 3 }, tip: 'Det dyraste avtalet på tio år. Och det billigaste alternativet.' },
      { text: 'SKRIV UNDER MEN BETALA AV PÅ FEM ÅR', cost: { money: 250 }, griev: -10, temp: { approval: 2 }, ind: { strikes: -30 }, tip: 'Avbetalning. Även på fred.' },
      { text: 'FÖRSÖK PRESSA BUDET I SISTA STUND',
        risk: { chance: 0.4,
          win: { text: 'Facket viker sig på en punkt. Du sparar pengar, de räddar ansiktet.', res: { money: 200 }, griev: -6 },
          lose: { text: 'Förhandlingen kollapsar. Strejken fortsätter en vecka till.', griev: 8, temp: { unrest: 4, approval: -3 } } } },
    ],
  },
  {
    id: 'pro_vard_flykt', icon: '\u{1F9F3}', chain: true, kind: 'valfard',
    title: 'SJUKSKÖTERSKORNA FLYTTAR TILL {GRANNE}',
    text: 'Rekryterare från {granne} har hyrt en konferenssal i {stad} och erbjuder sjuksköterskor dubbla lönen, betald flytt och en lägenhet. Fyrahundra har redan skrivit på. Akuten där de arbetade har stängt nattetid, och ambulanserna kör nu fyrtio minuter längre till närmaste sjukhus.',
    choices: [
      { text: 'MATCHA LÖNERNA FÖR ATT FÅ DEM ATT STANNA', cost: { money: 800 }, griev: -12, temp: { welfare: 3, approval: 3 }, tip: 'Lönekrig med grannlandet. Bara sjuksköterskorna vinner.' },
      { text: 'REKRYTERA SJUKSKÖTERSKOR FRÅN ANDRA LÄNDER', cost: { money: 300 }, temp: { welfare: 1, integration: -2 }, griev: -4, rel: 2, tip: 'Någon annans vård får täppa till hålet i din.' },
      { text: 'LÅT DEM GÅ', temp: { welfare: -5, qol: -3 }, perm: { welfare: -1 }, griev: 8, ind: { life: -0.1 }, tip: 'Vårdköerna blir landets nya folksjukdom.' },
    ],
  },
  {
    id: 'pro_pension_marsch', icon: '\u{1F475}', cooldown: 900, kind: 'valfard', react: true,
    title: 'RULLATORMARSCHEN',
    text: 'Sedan ändringen av {lag} har pensionärsförbunden mobiliserat som aldrig förr. I dag gick sextiotusen pensionärer genom {huvudstad}, många med rullator och termos, och tåget tog fyra timmar längre än planerat. Den största banderollen sa: "Vi har röstat i femtio år. Vi tänker rösta i tio till."',
    when: (c) => c.cut('pensions', 'retirement_age') && c.grievOf('valfard') > 8,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 18 }, undo: true, griev: -20, temp: { approval: 5 }, tip: 'Pensionärer röstar. Det vet alla.' },
      { text: 'ETT EXTRA TILLÄGG TILL DE FATTIGASTE PENSIONÄRERNA', cost: { money: 350 }, griev: -7, temp: { approval: 2 }, next: [null, 'pro_pension_talt'], tip: 'Riktat, rättvist och lite för lite.' },
      { text: 'FÖRKLARA ATT SYSTEMET MÅSTE HÅLLA FÖR DE UNGA', griev: 5, temp: { approval: -3 }, perm: { income: 1 }, next: ['pro_pension_talt', null], tip: 'Ekonomerna nickar. Pensionärerna slår upp tält.' },
    ],
  },
  {
    id: 'pro_pension_talt', icon: '\u{26FA}', chain: true, kind: 'valfard',
    title: 'TÄLTLÄGRET UTANFÖR PARLAMENTET',
    text: 'Tre veckor efter marschen står fyrtio tält på gräsmattan utanför parlamentet. Pensionärerna sover där i skift, barnbarnen kommer med varm soppa och en präst håller andakt varje kväll klockan sex. Utländska tidningar skriver om "landet där pensionärerna bor på gatan".',
    choices: [
      { text: 'GÅ UT OCH FÖRHANDLA PÅ GRÄSMATTAN', cost: { pp: 12 }, griev: -10, temp: { approval: 4, unrest: -3 }, ind: { trustgov: 3 }, tip: 'En minister på en campingstol blir veckans bild.' },
      { text: 'LÅT POLISEN TA BORT TÄLTEN I GRYNINGEN', temp: { unrest: 5, approval: -8 }, griev: 10, ind: { trustgov: -6 }, mod: 'martyr', tip: 'Bilden av en åttioåring som bärs bort av två poliser glömmer ingen.' },
      { text: 'VÄNTA. VINTERN KOMMER SNART', temp: { approval: -2 }, griev: 4, next: 'pro_pension_hunger', tip: 'Vintern brukar vinna. Men de här har varma sovsäckar.' },
    ],
  },
  {
    id: 'pro_pension_hunger', icon: '\u{1F37D}\u{FE0F}', chain: true, kind: 'valfard',
    title: 'SJUTTIOFYRAÅRINGEN SOM SLUTADE ÄTA',
    text: 'En sjuttiofyraårig före detta fackordförande har inte ätit på elva dagar. Han sitter i rullstol vid tältlägret med en filt över knäna och svarar på journalisternas frågor med allt svagare röst. Läkarna säger att det är allvarligt. Han säger att han äter den dag beslutet om {lag} är rivet.',
    choices: [
      { text: 'RIV BESLUTET OCH BESÖK HONOM SJÄLV', cost: { pp: 15 }, undo: true, griev: -22, temp: { approval: 6, unrest: -6 }, tip: 'Han äter en smörgås framför kamerorna. Du ser lättad ut. Det är du.' },
      { text: 'TILLSÄTT EN PENSIONSKOMMISSION MED HONOM SOM LEDAMOT', cost: { pp: 10, money: 100 }, griev: -10, temp: { approval: 3 }, tip: 'Han slutar svälta och börjar sammanträda. Det är också tufft.' },
      { text: 'STÅ FAST',
        risk: { chance: 0.5,
          win: { text: 'Han avbryter strejken på läkarnas inrådan. Lägret packar ihop i tysthet.', griev: 4, temp: { stability: 2 } },
          lose: { text: 'Han förs till sjukhus i ambulans. Hela landet följer hans tillstånd.', griev: 14, temp: { unrest: 8, approval: -6 }, mod: 'martyr' } } },
    ],
  },
  {
    id: 'pro_barnvagn', icon: '\u{1F476}', cooldown: 900, kind: 'valfard', react: true,
    title: 'BARNVAGNSPROTESTEN',
    text: 'Ändringen av {lag} har fått småbarnsföräldrarna att göra något ingen trodde att de hade tid med: protestera. I morse rullade åttatusen barnvagnar genom {stad} i ett tåg som var tre kilometer långt. Det blev den tystaste demonstrationen i stadens historia, eftersom de flesta barnen somnade efter tio minuter.',
    when: (c) => c.cut('childcare', 'parental_leave', 'school_choice') && c.grievOf('valfard') > 5,
    choices: [
      { text: 'BACKA ÄNDRINGEN AV {LAG}', cost: { pp: 15 }, undo: true, griev: -16, temp: { approval: 4 }, tip: 'Föräldrarna rullar hem. Några av barnen vaknar.' },
      { text: 'ERBJUD ETT BARNTILLÄGG UNDER ÖVERGÅNGEN', cost: { money: 300 }, griev: -6, temp: { approval: 2 }, tip: 'Föräldrar räknar noga. De har inte tid med något annat.' },
      { text: 'SÄG ATT FÖRÄNDRINGEN ÄR NÖDVÄNDIG', griev: 5, temp: { approval: -3 }, ind: { turnout: 2 }, tip: 'Småbarnsföräldrar röstar sällan. Den här gången kommer de att göra det.' },
    ],
  },
  {
    id: 'pro_hyresstrejk', icon: '\u{1F3E0}', weight: 2, cooldown: 900, kind: 'valfard',
    title: 'HYRESSTREJKEN I {STAD}',
    text: 'I tre höghus i {stad} har hyresgästerna slutat betala hyran och sätter i stället in pengarna på ett spärrat konto. Hyran äter nu mer än en tredjedel av inkomsten för många, och bostadskön är elva år lång. Hyresgästföreningen säger att pengarna betalas när någon lyssnar. Fastighetsägaren vill att de vräks.',
    when: (c) => ((c.ind.rentshare ?? 25) > 33 || c.cut('housing')) && c.grievOf('valfard') > 12,
    choices: [
      { text: 'BYGG HYRESRÄTTER I STATLIG REGI', cost: { money: 800 }, griev: -10, temp: { qol: 2, approval: 3 }, ind: { homeless: -8 }, tip: 'Fem år tills någon flyttar in. Men nu finns en byggplan.' },
      { text: 'INFÖR ETT TILLFÄLLIGT HYRESTAK', cost: { pp: 15 }, law: ['housing', 'rentcontrol'], griev: -8, temp: { approval: 3, gdp: -1 }, tip: 'Hyrorna fryser. Byggkranarna också.' },
      { text: 'LÅT FASTIGHETSÄGAREN VRÄKA DEM', temp: { unrest: 5, approval: -4 }, griev: 8, ind: { homeless: 5 }, tip: 'Hundra familjer på hotell. Notan hamnar hos kommunen.' },
    ],
  },
  {
    id: 'pro_facken', icon: '\u{1F6A9}', cooldown: 900, kind: 'valfard', react: true,
    title: 'FACKEN SAMLAR HUNDRATUSEN',
    text: 'Ändringen av {lag} har fått alla fackförbund att för en gångs skull stå på samma scen. Hundratusen medlemmar fyllde arenan i {huvudstad}, och ordförandena läste en gemensam förklaring: blir beslutet kvar blir höstens avtalsrörelse "den tuffaste i mannaminne". Arbetsgivarna har ställt in sina semestrar.',
    when: (c) => c.cut('unions', 'minimum_wage', 'workhours', 'vacation') && c.grievOf('valfard') > 10 && c.demo > 4,
    choices: [
      { text: 'BACKA {LAG} OCH BJUD IN TILL SAMTAL', cost: { pp: 20 }, undo: true, griev: -18, temp: { approval: 4, stability: 2 }, ind: { strikes: -30 }, tip: 'Arbetsfred är värd en del prestige.' },
      { text: 'ERBJUD LÄGRE SKATT PÅ LÖN SOM KOMPENSATION', cost: { money: 500 }, griev: -8, temp: { approval: 2, income: -2 }, tip: 'Facken räknar på det. Det tar dem en eftermiddag.' },
      { text: 'LÅT AVTALSRÖRELSEN AVGÖRA', griev: 6, temp: { unrest: 3, factory: -2 }, ind: { strikes: 40 }, tip: 'Hösten blir lång. Och dyr för alla.' },
    ],
  },
  {
    id: 'pro_lararstrejk', icon: '\u{1F3EB}', weight: 2, cooldown: 1000, kind: 'valfard',
    title: 'LÄRARNA LÄGGER NER KRITAN',
    text: 'Klockan åtta i morse stod tusentals klassrum tomma. Lärarna strejkar för första gången på tjugo år, efter år av större klasser, frusna löner och en flod av nya blanketter. Föräldrar ordnar barnpassning på kontoren, och gymnasieeleverna i {stad} har gått med i protesten med egna plakat: "VI VILL HA VÅRA LÄRARE".',
    when: (c) => c.grievOf('valfard') > 20 && c.griev >= 30 && c.griev < 75 && c.demo > 4,
    choices: [
      { text: 'HÖJ LÄRARLÖNERNA', cost: { money: 700 }, griev: -15, temp: { approval: 4 }, perm: { research: 1 }, ind: { strikes: -40 }, tip: 'Fler vill bli lärare. Om fem år syns det i resultaten.' },
      { text: 'HALVERA BLANKETTERNA I STÄLLET', cost: { pp: 12 }, griev: -7, temp: { approval: 2 }, tip: 'Billigt och klokt, men lite för lite. Lärarna skrattar för första gången på länge.' },
      { text: 'KRÄV ATT SKOLORNA HÅLLS ÖPPNA ENLIGT LAG', temp: { unrest: 4, approval: -4 }, griev: 7, ind: { trustgov: -3, strikes: 30 }, tip: 'Lagen säger en sak. Lärarna säger en annan.' },
    ],
  },

  // ===== SKATTERNA =====
  {
    id: 'pro_skatt_vagran', icon: '\u{1F437}', cooldown: 1000, kind: 'skatt', react: true,
    title: 'SMÅFÖRETAGARNA SLUTAR BETALA',
    text: 'Efter beslutet om {lag} har en rörelse av småföretagare i {stad} slutat betala in sin preliminärskatt. Frisörer, rörmokare och kaféägare sätter pengarna på ett gemensamt konto och lovar att betala "när skatterna blir rimliga". Rörelsen kallar sig Spargrisarna och växer med hundra medlemmar om dagen.',
    when: (c) => c.cut('taxes', 'corporate_tax', 'inheritance_tax') && c.grievOf('skatt') > 8,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -18, temp: { approval: 3, income: -2 }, tip: 'Spargrisarna töms. Det vill säga: de betalar.' },
      { text: 'SÄNK SKATTEN FÖR DE MINSTA FÖRETAGEN', cost: { money: 300 }, griev: -8, temp: { gdp: 1, income: -2 }, tip: 'Frisörerna nöjda. Revisorerna har ett nytt avdrag att lära sig.' },
      { text: 'SKICKA SKATTEVERKET PÅ DEM', temp: { income: 2, approval: -3 }, griev: 6, next: ['pro_skatt_bojkott', null], tip: 'Lagen är på din sida. Opinionen kanske inte är det.' },
    ],
  },
  {
    id: 'pro_skatt_bojkott', icon: '\u{1F437}', chain: true, kind: 'skatt',
    title: 'SPARGRISARNA ÄR FYRTIOTUSEN',
    text: 'Skatteverkets razzior gjorde Spargrisarna kända i hela landet. Nu är de fyrtiotusen företag, och en känd tv-kock har ställt en rosa plastgris i sitt restaurangfönster. Skatteintäkterna för kvartalet ligger under budget, och oppositionen frågar om regeringen fortfarande styr landets ekonomi.',
    choices: [
      { text: 'FÖRHANDLA FRAM EN SKATTEREFORM MED FÖRETAGARNA', cost: { pp: 15 }, griev: -14, temp: { approval: 3, income: -2 }, ind: { trustgov: 3 }, tip: 'Första skatteavtalet i historien som förhandlats med en plastgris.' },
      { text: 'AMNESTI FÖR DEN SOM BETALAR FÖRE MÅNADSSKIFTET', cost: { pp: 8 }, res: { money: 300 }, griev: -6, tip: 'Morot och kalender. Två tredjedelar betalar.' },
      { text: 'FRYS DERAS BANKKONTON', temp: { income: 3, freedom: -3, unrest: 4 }, griev: 10, ind: { trustgov: -4, stockcap: -3 }, next: 'pro_eftersmak', tip: 'Pengarna kommer in. Förtroendet går ut.' },
    ],
  },
  {
    id: 'pro_matkorg', icon: '\u{1F6D2}', cooldown: 900, kind: 'skatt', react: true,
    title: 'MATKASSARNA PÅ TRAPPAN',
    text: 'Sedan ändringen av {lag} har priset på mjölk, bröd och potatis stigit märkbart. I dag ställde hundratals föräldrar sina halvtomma matkassar på trappan till finansdepartementet i {huvudstad}, med kvittona tejpade på utsidan. En lapp i en av kassarna sa bara: "Räkna själv."',
    when: (c) => c.cut('taxes', 'price_controls') && c.grievOf('skatt') > 6,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -16, temp: { approval: 4, income: -2 }, tip: 'Kvittona blir kortare igen.' },
      { text: 'SÄNK MOMSEN PÅ MAT TILLFÄLLIGT', cost: { money: 400 }, griev: -9, temp: { approval: 3, qol: 1 }, tip: 'Tillfälliga sänkningar är de mest permanenta som finns.' },
      { text: 'HÄNVISA TILL VÄRLDSMARKNADSPRISERNA', griev: 5, temp: { approval: -3 }, ind: { trustgov: -2 }, tip: 'Det är delvis sant. Det är också precis vad alla regeringar säger.' },
    ],
  },
  {
    id: 'pro_krogar', icon: '\u{1F377}', cooldown: 900, kind: 'skatt', react: true,
    title: 'KROGARNA SLÄCKER LJUSET',
    text: 'Efter beslutet om {lag} har landets restauranger och barer gjort gemensam sak. Klockan åtta i kväll släcktes ljuset på fyratusen krogar samtidigt, och personalen ställde sig på trottoaren med tända ljus. Branschen säger att var tionde krog kan slå igen före jul. Bryggeriet i {stad} har redan varslat.',
    when: (c) => c.cut('alcohol_policy', 'tobacco', 'cash') && c.grievOf('skatt') > 4,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -14, temp: { approval: 3 }, tip: 'Lamporna tänds igen. Folkhälsoexperterna släcker sina.' },
      { text: 'GE RESTAURANGERNA ETT ÖVERGÅNGSSTÖD', cost: { money: 250 }, griev: -6, temp: { qol: 1 }, tip: 'Krogarna överlever vintern. Sedan får vi se.' },
      { text: 'FOLKHÄLSAN GÅR FÖRE KROGARNAS KASSA', griev: 5, temp: { approval: -2, qol: -1 }, perm: { hdi: 1 }, ind: { unemp: 0.1 }, tip: 'Rätt i sak. Fel i kväll.' },
    ],
  },
  {
    id: 'pro_skattemarsch', icon: '\u{1F4B8}', weight: 2, cooldown: 1000, kind: 'skatt',
    title: 'SKATTEMARSCHEN',
    text: 'Missnöjet med skatterna har vuxit hela året, och i dag samlade det hundratusen människor i {huvudstad}. Det är en ovanlig blandning: bönder i traktorer, pensionärer med hemgjorda skyltar, unga familjer och småföretagare i kostym. Talarna kräver lägre skatt på arbete, och de flesta i publiken vet exakt vad de betalade förra året.',
    when: (c) => c.grievOf('skatt') > 25 && c.griev >= 30 && c.demo > 5,
    choices: [
      { text: 'LÄGG FRAM EN SKATTEREFORM', cost: { pp: 20 }, griev: -14, temp: { approval: 4, income: -3 }, tip: 'Lägre skatt nu, svårare budget sedan.' },
      { text: 'VISA VAD SKATTERNA BETALAR', cost: { money: 120 },
        risk: { chance: 0.5,
          win: { text: 'Kampanjen med lärare, brandmän och barnmorskor går hem. Ilskan svalnar.', griev: -8, temp: { approval: 3 } },
          lose: { text: 'Kampanjen kallas propaganda för skattebetalarnas pengar. Ironin går inte att missa.', griev: 5, temp: { approval: -3 } } } },
      { text: 'IGNORERA DET — BUDGETEN MÅSTE GÅ IHOP', griev: 6, temp: { approval: -4, income: 2 }, tip: 'Kassan är nöjd. Gatan är det inte.' },
    ],
  },

  // ===== FRIHETEN =====
  {
    id: 'pro_journalister', icon: '\u{1F4F0}', cooldown: 900, kind: 'frihet', react: true,
    title: 'JOURNALISTERNA PÅ TRAPPAN',
    text: 'Ändringen av {lag} fick tvåhundra journalister att lämna redaktionerna mitt på dagen. De står nu tysta på trappan till parlamentet i {huvudstad}, var och en med en tom förstasida i händerna. Tidningarna kom i morse ut med vita fält där ledarna brukar stå, och radions nyheter började med en minuts tystnad.',
    when: (c) => c.cut('press', 'speech') && c.grievOf('frihet') > 8 && c.demo > 4,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -16, temp: { freedom: 3, approval: 3 }, ind: { pressfree: 3 }, tip: 'Redaktionerna fyller de vita fälten igen. Delvis med dig.' },
      { text: 'LOVA ATT LAGEN BARA SKA ANVÄNDAS I UNDANTAGSFALL', cost: { pp: 6 }, griev: -4, ind: { trustgov: -1 }, tip: 'Undantagsfall har en förmåga att bli fler.' },
      { text: 'LÅT DEM STÅ DÄR', griev: 7, temp: { freedom: -2, approval: -3 }, rel: -3, ind: { pressfree: -3 }, tip: 'Bilden av tvåhundra tomma förstasidor går jorden runt.' },
    ],
  },
  {
    id: 'pro_natet', icon: '\u{1F310}', cooldown: 900, kind: 'frihet', react: true,
    title: 'NÄTET STRYPS — UNGDOMARNA VAKNAR',
    text: 'Sedan beslutet om {lag} har landets tonåringar upptäckt politiken. Skolelever i {stad} lär varandra krypterade tjänster på rasterna, och i går samlades femtontusen unga utanför telemyndigheten med mobilerna lysande i mörkret. Föräldrarna står bredvid och ser mer förvånade än arga ut.',
    when: (c) => c.cut('internet', 'surveillance') && c.grievOf('frihet') > 6,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -15, temp: { freedom: 3, approval: 2 }, tip: 'Tonåringarna går hem. Några av dem har fått smak för politik.' },
      { text: 'BJUD IN ELEVRÅDEN TILL ETT SAMTAL', cost: { pp: 6 }, griev: -5, temp: { approval: 2 }, ind: { turnout: 1 }, tip: 'Sextonåringar förhandlar bättre än man tror. De har övat på sina föräldrar.' },
      { text: 'STRYP DE KRYPTERADE TJÄNSTERNA OCKSÅ', temp: { freedom: -4, statepower: 3 }, griev: 8, ind: { demo: -0.1, trustgov: -3 }, next: ['pro_eftersmak', null], tip: 'Varje stängd dörr lär dem öppna ett fönster.' },
    ],
  },
  {
    id: 'pro_demoratt', icon: '\u{1F4E2}', cooldown: 900, kind: 'frihet', react: true,
    title: 'DEMONSTRATION MOT DEMONSTRATIONSREGLERNA',
    text: 'Ändringen av {lag} har gett landet en filosofisk huvudvärk. I {stad} har tiotusen människor samlats för att protestera mot de nya reglerna för protester, och polisen vet inte om demonstrationen själv är tillåten. Juristerna i tv är oense. Arrangörerna läser högt ur grundlagen i megafon.',
    when: (c) => c.cut('protest', 'civil_rights') && c.grievOf('frihet') > 6 && c.demo > 3,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -15, temp: { freedom: 3 }, ind: { demo: 0.1 }, tip: 'Megafonen tystnar. Grundlagen läggs tillbaka i hyllan.' },
      { text: 'LÅT DEN PÅGÅ OCH HÄNVISA TILL DOMSTOLARNA', cost: { pp: 5 }, griev: -4, temp: { freedom: 1 }, tip: 'Domstolarna tar ett år på sig. Under tiden får alla demonstrera om saken.' },
      { text: 'TILLÄMPA DE NYA REGLERNA FULLT UT', temp: { unrest: -3, freedom: -4 }, griev: 9, ind: { demo: -0.2, protests: -20 }, next: 'pro_eftersmak', tip: 'Lugnt på gatan i dag. Lugnet har en räkning.' },
    ],
  },
  {
    id: 'pro_val_protest', icon: '\u{1F5F3}\u{FE0F}', cooldown: 1200, kind: 'frihet', react: true,
    title: 'VALET SOM INGEN LITAR PÅ',
    text: 'Sedan ändringen av {lag} har oppositionen talat om ett riggat val, och i kväll gick tvåhundratusen människor ut på gatorna i {huvudstad}. Valobservatörerna från {land} har rest hem i protest, och på torget har studenter byggt en scen av lastpallar. Ingen vet vem som kan få dem att gå hem.',
    when: (c) => c.cut('elections', 'government', 'voting_age') && c.grievOf('frihet') > 10 && c.demo > 3,
    choices: [
      { text: 'BACKA {LAG} OCH BJUD IN OBSERVATÖRERNA IGEN', cost: { pp: 25 }, undo: true, griev: -20, rel: 6, ind: { demo: 0.3, trustgov: 4 }, tip: 'Ett val som alla litar på är värt mer än ett som du vinner.' },
      { text: 'ERBJUD EN OBEROENDE VALKOMMISSION', cost: { pp: 12 }, griev: -8, temp: { unrest: -2 }, next: [null, 'pro_val_torget'], tip: 'En kommission köper tid. Torget avgör om tiden räcker.' },
      { text: 'KALLA DEMONSTRANTERNA FÖR STÖRANDE ELEMENT', temp: { statepower: 3, approval: -5 }, griev: 9, ind: { trustgov: -5 }, next: 'pro_val_torget', tip: 'Ord som "element" brukar hamna på t-tröjor.' },
    ],
  },
  {
    id: 'pro_val_torget', icon: '\u{26FA}', chain: true, kind: 'frihet',
    title: 'TORGET I {HUVUDSTAD} GER SIG INTE',
    text: 'Tolfte dygnet på torget. Demonstranterna har byggt fältkök, en sjukvårdsstation och en tältskola för barnen. Flera tusen sover där varje natt trots minusgraderna, och en del poliser har börjat dela ut kaffe i stället för order. Utländska tv-bolag sänder dygnet runt från en balkong ovanför.',
    choices: [
      { text: 'GE EFTER OCH UTLYS NYVAL MED OBSERVATÖRER', cost: { pp: 30 }, griev: -25, temp: { unrest: -8, stability: -3, freedom: 4 }, rel: 10, ind: { demo: 0.4, trustgov: 5 }, tip: 'Du kan förlora valet. Men landet vinner det.' },
      { text: 'FÖRHANDLA OM EN ÖVERGÅNGSREGERING', cost: { pp: 18 },
        risk: { chance: 0.5,
          win: { text: 'Oppositionen får tre ministerposter. Torget töms under jubel.', griev: -15, temp: { unrest: -6, polpower: -3 } },
          lose: { text: 'Förhandlarna lämnar bordet. Torget växer för varje timme.', griev: 6, temp: { unrest: 5 } } } },
      { text: 'RENSA TORGET MED KRAVALLPOLIS', next: ['pro_val_krossad', 'pro_omvarlden'],
        risk: { chance: 0.4,
          win: { text: 'Torget är tomt före gryningen. Landet är tyst. Det är en tung tystnad.', temp: { stability: 4, unrest: -5 }, griev: 10, ind: { demo: -0.4 } },
          lose: { text: 'Folk vägrar flytta sig. Bilderna från torget går jorden runt.', temp: { unrest: 12, approval: -8 }, griev: 15, mod: 'martyr', ind: { demo: -0.5 } } } },
    ],
  },
  {
    id: 'pro_val_krossad', icon: '\u{1F940}', chain: true, kind: 'frihet',
    title: 'EFTER TORGET',
    text: 'Torget är tomt och tvättat, och blommorna som folk lägger vid statyn plockas bort varje morgon. Men varje morgon ligger det nya där. Ledarna för protesterna är häktade eller har flytt till {granne}, varifrån de ger intervjuer varje kväll. Under ytan har rörelsen bara bytt form.',
    choices: [
      { text: 'SLÄPP DE HÄKTADE OCH ÖPPNA FÖR SAMTAL', cost: { pp: 20 }, griev: -12, rel: 5, temp: { stability: -2 }, ind: { demo: 0.2 }, tip: 'Sent, men kanske inte för sent.' },
      { text: 'LÅT BLOMMORNA LIGGA', griev: -4, temp: { approval: 2, statepower: -2 }, tip: 'Ibland är den klokaste politiken att inte städa.' },
      { text: 'FÖRBJUD ALLA SAMMANKOMSTER PÅ TORGET', law: ['protest', 'restricted'], temp: { freedom: -4, statepower: 3 }, griev: 8, rel: -5, ind: { demo: -0.3 }, tip: 'Torget blir landets mest bevakade plats. Och den mest omtalade.' },
    ],
  },
  {
    id: 'pro_kameror', icon: '\u{1F4F9}', cooldown: 900, kind: 'frihet', react: true,
    title: 'SOPSÄCKAR ÖVER KAMEROR',
    text: 'Ändringen av {lag} har fått ett oväntat svar. Under natten har någon trätt svarta sopsäckar över hundratals nya övervakningskameror i {stad}, och på varje säck sitter en lapp med ett citat ur grundlagen. Ingen har gripits. Kamerorna, påpekar en krönikör, såg ingenting.',
    when: (c) => c.cut('surveillance', 'civil_rights', 'policing') && c.grievOf('frihet') > 5,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -14, temp: { freedom: 3 }, ind: { trustgov: 2 }, tip: 'Säckarna tas ner. Kamerorna också.' },
      { text: 'INFÖR EN OBEROENDE TILLSYN AV KAMERORNA', cost: { money: 150, pp: 5 }, griev: -6, perm: { freedom: 1 }, tip: 'Kamerorna sitter kvar. Nu tittar någon på dem som tittar.' },
      { text: 'SÄTT UPP KAMEROR SOM BEVAKAR KAMERORNA', temp: { statepower: 2, freedom: -3 }, griev: 6, ind: { trustgov: -2 }, tip: 'Satiren skriver sig själv.' },
    ],
  },

  // ===== INVANDRINGEN =====
  {
    id: 'pro_mig_tva', icon: '\u{1F6A7}', cooldown: 1000, kind: 'migration', react: true,
    title: 'TVÅ DEMONSTRATIONER SAMMA LÖRDAG',
    text: 'Invandringen har ökat fortare än bostäderna och språkkurserna hunnit med, och nu har två grupper bokat samma torg i {stad} samma lördag. Den ena kräver stopp för nya mottagningsplatser, den andra vill välkomna fler. Polisen har dragit ett avspärrningsband mitt över torget. Båda sidor lovar att komma i tusental.',
    when: (c) => c.migRate > 1.2 && c.grievOf('migration') > 12 && c.demo > 4,
    choices: [
      { text: 'MER POLIS OCH TYDLIGA AVSPÄRRNINGAR', cost: { money: 150 }, temp: { safety: 2, unrest: -2 }, next: [null, 'pro_mig_brak'], tip: 'Avspärrningsband är billiga. Poliser på övertid är det inte.' },
      { text: 'BJUD IN BÅDA ARRANGÖRERNA TILL SAMMA BORD', cost: { pp: 10 }, next: ['pro_mig_handslag', 'pro_mig_brak'], tip: 'Samma torg, samma bord. Det kan gå.' },
      { text: 'LÅT DEM SKÖTA SIG SJÄLVA',
        risk: { chance: 0.5,
          win: { text: 'Det blir högljutt men lugnt. Båda sidor hinner hem till middagen.', griev: -3, temp: { approval: 1 } },
          lose: { text: 'Det blir handgemäng vid avspärrningen. Kvällens nyheter handlar bara om det.', griev: 8, temp: { unrest: 6 }, ind: { xenophobia: 2 } } } },
    ],
  },
  {
    id: 'pro_mig_handslag', icon: '\u{1F91D}', chain: true, kind: 'migration',
    title: 'HANDSLAGET PÅ TORGET',
    text: 'Mötet var spänt i fyra timmar. Sedan upptäckte de två arrangörerna, en pensionerad busschaufför och en sjuksköterska som själv kom som flykting för tjugo år sedan, att de bor i samma kvarter i {stad}. På lördagen gick de upp på scenen tillsammans och krävde fler lärare i språkskolan och fler bostäder åt alla.',
    choices: [
      { text: 'FINANSIERA KRAVEN: SPRÅKLÄRARE OCH BOSTÄDER', cost: { money: 500 }, griev: -14, temp: { integration: 4, approval: 3 }, ind: { xenophobia: -2, segreg: -1 }, tip: 'Det hjälper både dem som kommer och dem som redan bor där.' },
      { text: 'GÖR HANDSLAGET TILL EN NATIONELL KAMPANJ', cost: { money: 150 }, griev: -7, temp: { integration: 2, stability: 2 }, tip: 'Två vanliga människor säger mer än tio ministrar.' },
      { text: 'TACKA DEM OCH LÅT KOMMUNEN TA DET VIDARE', griev: -3, temp: { approval: 1 }, tip: 'Kommunen tackar för förtroendet. Och undrar var pengarna är.' },
    ],
  },
  {
    id: 'pro_mig_brak', icon: '\u{1F6A8}', chain: true, kind: 'migration',
    title: 'BRÅKET VID AVSPÄRRNINGEN',
    text: 'Det började med glåpord och en kastad flaska. Det slutade med trettio gripna, en brinnande sopcontainer och filmer som delats miljontals gånger. Båda sidor skyller på den andra, och i {stad} är stämningen så spänd att föräldrar hämtar barnen i skolan i stället för att låta dem gå hem själva.',
    choices: [
      { text: 'ÅTALA ALLA SOM VAR VÅLDSAMMA, OAVSETT SIDA', cost: { pp: 8 }, griev: -6, temp: { safety: 3 }, ind: { feelsafe: 2 }, tip: 'Lika inför lagen. Ingen sida blir nöjd, och det är ett gott tecken.' },
      { text: 'SATSA PÅ FRITIDSGÅRDAR OCH KVARTERSPOLIS', cost: { money: 400 }, griev: -10, temp: { integration: 3, safety: 2 }, ind: { xenophobia: -2 }, tip: 'Långsamt och tråkigt. Det är så det fungerar.' },
      { text: 'FÖRBJUD DEMONSTRATIONER OM INVANDRING ETT HALVÅR', temp: { freedom: -4, unrest: -3 }, griev: 8, ind: { demo: -0.2 }, next: 'pro_eftersmak', tip: 'Frågan försvinner inte. Den flyttar in i köken.' },
    ],
  },
  {
    id: 'pro_mig_kommuner', icon: '\u{1F3DB}\u{FE0F}', cooldown: 900, kind: 'migration', react: true,
    title: 'KOMMUNERNA SÄGER STOPP',
    text: 'Fyrtio kommunalråd har skrivit under ett brev med rubriken "Vi klarar inte fler just nu". Invandringen har på ett år gått fortare än skolor, vårdcentraler och bostadsbolag hinner växa. I {stad} väntar nyanlända tio månader på en plats i språkskolan, och gymnastiksalen har varit tillfälligt boende sedan i våras.',
    when: (c) => c.migRate > 1.4 && c.st.integration < 10 && c.grievOf('migration') > 8,
    choices: [
      { text: 'GE KOMMUNERNA ETT KRAFTIGT STATSBIDRAG', cost: { money: 700 }, griev: -12, temp: { integration: 3, welfare: 2 }, ind: { segreg: -1 }, tip: 'Pengarna når fram om ett halvår. Gymnastiksalen töms om ett år.' },
      { text: 'STRAMA ÅT INVANDRINGEN TILLFÄLLIGT', cost: { pp: 20 }, law: ['immigration', 'managed'], griev: -8, temp: { immigration: -4 }, tip: 'Färre kommer. De som redan är här behöver fortfarande språkkursen.' },
      { text: 'SÄG ATT DET ÄR KOMMUNERNAS ANSVAR', griev: 7, temp: { integration: -3, approval: -3 }, ind: { xenophobia: 2 }, tip: 'Kommunalråden har numret till varje lokaltidning.' },
    ],
  },
  {
    id: 'pro_mig_klasskamrat', icon: '\u{1F392}', cooldown: 900, kind: 'migration', react: true,
    title: 'KLASSKAMRATERNA SOM VÄGRADE',
    text: 'Efter ändringen av {lag} ska en fjortonårig flicka som bott i {stad} sedan hon var tre utvisas med sin familj. Hela hennes klass har vägrat gå in i skolan på en vecka, och nu sitter de på trappan till migrationsverket med lärarna bredvid sig. Hennes fotbollslag har tryckt hennes namn på sina tröjor.',
    when: (c) => c.changed('immigration', 'citizenship', 'border_control') && c.demo > 3 && (c.is('immigration', 'restricted', 'closed', 'exitban', 'deportation') || c.is('citizenship', 'bloodline', 'loyalty', 'denaturalize')),
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -14, temp: { approval: 3, integration: 2 }, tip: 'Klassen går in i skolan igen. Med flickan.' },
      { text: 'GE FAMILJEN UPPEHÅLLSTILLSTÅND AV HUMANITÄRA SKÄL', cost: { pp: 8 }, griev: -7, temp: { approval: 3 }, tip: 'En familj stannar. Hundra andra frågar varför inte de.' },
      { text: 'LAGEN GÄLLER ALLA', temp: { statepower: 2, approval: -4 }, griev: 7, rel: -2, ind: { trustgov: -2 }, tip: 'Rättssäkert. Och mycket svårt att förklara för fjortonåringar.' },
    ],
  },
  {
    id: 'pro_mig_gastarbetare', icon: '\u{1F3D7}\u{FE0F}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'GÄSTARBETARNA LÄGGER NER VERKTYGEN',
    text: 'På byggena i {stad} står kranarna stilla. Gästarbetarna, som bygger hälften av landets nya bostäder, strejkar mot löner under avtalet och baracker utan värme. De har inget fack och ingen rösträtt, men de har mobiltelefoner, och filmerna från barackerna har setts av en miljon människor.',
    when: (c) => (c.is('immigration', 'guestworker', 'freemove') || c.migRate > 1) && c.grievOf('migration') + c.grievOf('valfard') > 20 && c.griev >= 25,
    choices: [
      { text: 'KRÄV SAMMA VILLKOR SOM FÖR ALLA ANDRA', cost: { pp: 12 }, griev: -10, temp: { integration: 3, factory: -1 }, ind: { strikes: -30 }, tip: 'Byggena blir dyrare. Och lagliga.' },
      { text: 'SKICKA YRKESINSPEKTIONEN TILL BARACKERNA', cost: { money: 120 }, griev: -5, temp: { safety: 2 }, tip: 'Inspektörerna hittar mer än de letade efter.' },
      { text: 'HOTA STREJKARNA MED UTVISNING', temp: { factory: 2, freedom: -3 }, griev: 9, rel: -4, ind: { xenophobia: 2, trustgov: -2 }, next: ['pro_eftersmak', null], tip: 'Kranarna snurrar igen. Ryktet om landet snurrar också.' },
    ],
  },

  // ===== MILJÖN =====
  {
    id: 'pro_klimat_skolstrejk', icon: '\u{1F30D}', cooldown: 1000, kind: 'miljo', react: true,
    title: 'SKOLSTREJK FÖR KLIMATET',
    text: 'Sedan ändringen av {lag} sitter en femtonårig flicka varje fredag utanför parlamentet med en handmålad skylt. Första veckan satt hon ensam. I dag satt tjugotusen skolelever på gatorna i {huvudstad}, i {stad} och i fyrtio andra städer. Rektorerna vet inte om de ska ge dem frånvaro eller beröm.',
    when: (c) => c.cut('environment', 'energy', 'forestry') && c.grievOf('miljo') > 6,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -15, temp: { approval: 3, qol: 1 }, tip: 'På måndag är eleverna tillbaka i skolan. Det mesta av dem.' },
      { text: 'BJUD IN HENNE TILL ETT MÖTE', cost: { pp: 5 },
        risk: { chance: 0.5,
          win: { text: 'Hon ställer svåra frågor och du svarar ärligt. Båda växer i opinionen.', griev: -6, temp: { approval: 3 } },
          lose: { text: 'Hon säger i tv att mötet bara var en fotografering. Många håller med.', griev: 4, temp: { approval: -3 } } } },
      { text: 'SÄG ATT BARNEN BORDE VARA I SKOLAN', griev: 6, temp: { approval: -3 }, next: ['pro_klimat_blockad', null], tip: 'De är i skolan. På fredagarna är skolan gatan.' },
    ],
  },
  {
    id: 'pro_klimat_blockad', icon: '\u{1F6E3}\u{FE0F}', chain: true, kind: 'miljo',
    title: 'AKTIVISTERNA LIMMADE FAST SIG',
    text: 'Klimatrörelsen har radikaliserats. I morse limmade fyrtio aktivister fast sig på motorvägen in till {huvudstad} mitt i rusningstrafiken. Köerna blev tjugo kilometer långa, en ambulans fick köra på cykelbanan och arga bilister drog undan flera av demonstranterna. Resten av rörelsen är djupt oense om metoden.',
    choices: [
      { text: 'ÅTALA FÖR TRAFIKSTÖRNING MEN LYSSNA PÅ SAKFRÅGAN', cost: { pp: 10 }, griev: -6, temp: { safety: 2 }, tip: 'Både lag och lyhördhet. Ingen blir riktigt nöjd.' },
      { text: 'SKÄRP STRAFFEN FÖR BLOCKADER', temp: { safety: 2, freedom: -2 }, griev: 6, ind: { protests: -15 }, tip: 'Färre blockader. Fler martyrer.' },
      { text: 'INFÖR EN STOR KLIMATSATSNING', cost: { money: 900 }, griev: -16, temp: { approval: 3 }, perm: { qol: 1 }, ind: { trustgov: 2 }, tip: 'Aktivisterna lossnar från asfalten. De flesta.' },
    ],
  },
  {
    id: 'pro_reflex', icon: '\u{1F9BA}', cooldown: 1000, kind: 'miljo', react: true,
    title: 'REFLEXVÄSTARNA',
    text: 'Ändringen av {lag} har gjort bensin och diesel dyrare, och på landsbygden har folk fått nog. Över hela landet står människor i gula reflexvästar i rondellerna och delar ut flygblad till bilisterna. Det är snickare, undersköterskor och pensionärer som kör trettio kilometer till jobbet eller apoteket varje dag.',
    when: (c) => c.cut('energy', 'transport') && c.grievOf('miljo') > 8,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -18, temp: { approval: 4 }, tip: 'Västarna hängs tillbaka i bilarna. Där ska de ju vara.' },
      { text: 'GE ETT RESEAVDRAG TILL DEM SOM BOR PÅ LANDET', cost: { money: 400 }, griev: -9, temp: { approval: 2, income: -1 }, tip: 'Rättvist. Men varje avdrag har en ekonom som suckar.' },
      { text: 'KLIMATET KAN INTE VÄNTA', griev: 6, temp: { approval: -3 }, perm: { qol: 1 }, next: ['pro_reflex_rondell', null], tip: 'Sant. Men rondellen i {stad} kan inte heller vänta.' },
    ],
  },
  {
    id: 'pro_reflex_rondell', icon: '\u{1F9BA}', chain: true, kind: 'miljo',
    title: 'VARJE RONDELL ÄR OCKUPERAD',
    text: 'Reflexvästarna har blivit en folkrörelse utan ledare. Varje helg står hundratusentals människor i rondeller och vid bensinstationer, och i {huvudstad} slutade lördagens marsch med krossade skyltfönster och tårgas. Ingen kan förhandla med rörelsen, eftersom ingen har mandat att tala för den.',
    choices: [
      { text: 'HÅLL EN STOR DEBATT I VARJE KOMMUN', cost: { pp: 20, money: 200 }, griev: -14, temp: { unrest: -5, approval: 3 }, ind: { trustgov: 3 }, tip: 'Tusentals möten i skolaulor. Folk vill mest bli hörda.' },
      { text: 'FRYS BRÄNSLESKATTEN OCH BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -20, temp: { unrest: -6, income: -2 }, tip: 'Rörelsen tappar luften. Klimatmålen också.' },
      { text: 'POLIS I VARJE RONDELL', temp: { unrest: -3, freedom: -3, safety: 2 }, griev: 8, ind: { trustgov: -4, policetrust: -3 }, next: 'pro_eftersmak', tip: 'Det finns fler rondeller än poliser. Det vet båda sidor.' },
    ],
  },
  {
    id: 'pro_traktor', icon: '\u{1F69C}', cooldown: 1000, kind: 'miljo', react: true,
    title: 'TRAKTORERNA RULLAR MOT {HUVUDSTAD}',
    text: 'Ändringen av {lag} har fått bönderna att lämna gårdarna mitt i skördetiden. Tusentals traktorer kör i snigelfart på motorvägarna mot {huvudstad}, med halmbalar och skyltar på frontlastarna: "Utan bönder, ingen mat." Lastbilarna står i kö bakom dem, och livsmedelskedjorna varnar för tomma hyllor.',
    when: (c) => c.changed('agriculture', 'environment', 'fishing', 'animal_welfare') && c.grievOf('miljo') + c.grievOf('ekonomi') > 12,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -16, temp: { approval: 3 }, tip: 'Traktorerna vänder. Skörden väntar.' },
      { text: 'ERBJUD ETT STÖD FÖR OMSTÄLLNINGEN', cost: { money: 500 }, griev: -10, temp: { approval: 2 }, tip: 'Bönderna tar pengarna och kör hem. Till nästa gång.' },
      { text: 'LÅT DEM STÅ I KÖN', griev: 7, temp: { gdp: -1, approval: -2 }, next: 'pro_traktor_blockad', tip: 'Det är svårt att vinna mot någon som har en traktor.' },
    ],
  },
  {
    id: 'pro_traktor_blockad', icon: '\u{1F69C}', chain: true, kind: 'miljo',
    title: 'GÖDSEL UTANFÖR DEPARTEMENTET',
    text: 'Böndernas protest har eskalerat. I natt tippade de fyrtio ton gödsel utanför jordbruksdepartementet, och traktorerna blockerar nu alla infarter till {huvudstad}. Mackarna har slut på diesel, mjölken når inte mejerierna och priset på grönsaker har stigit en femtedel på en vecka.',
    choices: [
      { text: 'FÖRHANDLA MED BÖNDERNAS FÖRBUND', cost: { pp: 15, money: 300 }, griev: -16, temp: { unrest: -5, approval: 2 }, ind: { trustgov: 2 }, tip: 'Kompromissen luktar inte gott. Men den fungerar.' },
      { text: 'BACKA {LAG} HELT', cost: { pp: 12 }, undo: true, griev: -20, temp: { unrest: -6 }, tip: 'Traktorerna vänder hemåt. Miljörörelsen vänder sig mot dig.' },
      { text: 'BÄRGA TRAKTORERNA', temp: { unrest: 6, approval: -5 }, griev: 10, ind: { infl: 0.4, trustgov: -3 }, next: 'pro_eftersmak', tip: 'Det finns inte många bärgningsbilar som klarar en traktor.' },
    ],
  },
  {
    id: 'pro_urskog', icon: '\u{1F332}', cooldown: 900, kind: 'miljo', react: true,
    title: 'MÄNNISKOKEDJAN I URSKOGEN',
    text: 'Efter beslutet om {lag} har ett skogsbolag börjat avverka i den gamla urskogen norr om {stad}. I morse stod tvåhundra människor, från ortens jägare till pensionerade lärare, i en kedja mellan skogsmaskinerna och träden. Några har sovit i tallarna i tre nätter. Maskinförarna har stängt av motorerna och väntar.',
    when: (c) => c.cut('forestry', 'mining', 'environment') && c.grievOf('miljo') > 5 && c.demo > 3,
    choices: [
      { text: 'BACKA {LAG} OCH SKYDDA SKOGEN', cost: { pp: 15 }, undo: true, griev: -15, temp: { approval: 3, qol: 1 }, tip: 'Tallarna står kvar. Klätterfolket kommer ner.' },
      { text: 'GÖR JUST DEN HÄR SKOGEN TILL NATURRESERVAT', cost: { money: 300 }, griev: -7, temp: { approval: 2 }, tip: 'En skog räddad. Resten av landet ritar nya kartor.' },
      { text: 'LÅT POLISEN BÄRA BORT DEM', temp: { unrest: 3, factory: 1 }, griev: 7, ind: { trustgov: -2 }, tip: 'Tallarna faller. Bilderna av dem gör det inte.' },
    ],
  },
  {
    id: 'pro_vindkraft', icon: '\u{1F32C}\u{FE0F}', weight: 2, cooldown: 900, kind: 'miljo', react: true,
    title: 'BYN SOM SA NEJ TILL VINDKRAFTEN',
    text: 'Den nya energipolitiken har fått oväntade motståndare. I en by utanför {stad} ska fyrtio vindkraftverk resas, och nu har sexhundra invånare, som annars röstar på alla möjliga partier, gått samman. De vill ha ren el, säger de, men inte tvåhundra meter höga snurror i bärskogen. Och de vill ha något tillbaka.',
    when: (c) => c.changed('energy', 'environment') && c.is('energy', 'renewable', 'green', 'carbontax'),
    choices: [
      { text: 'GE BYN EN DEL AV ELINTÄKTERNA', cost: { money: 200 }, griev: -8, temp: { approval: 2 }, tip: 'Med en procent av intäkterna blir snurrorna plötsligt vackra.' },
      { text: 'FLYTTA PARKEN UT TILL HAVS', cost: { money: 500 }, griev: -10, temp: { qol: 1 }, tip: 'Dyrare, längre bort och utan grannar. Fiskarna har inte yttrat sig.' },
      { text: 'BYGG ÄNDÅ — LANDET BEHÖVER ELEN', griev: 5, temp: { approval: -2, factory: 1 }, ind: { trustgov: -1 }, tip: 'Elen kommer. Byn röstar annorlunda nästa gång.' },
    ],
  },

  // ===== EKONOMIN =====
  {
    id: 'pro_jarnvag', icon: '\u{1F686}', cooldown: 1000, kind: 'ekonomi', react: true,
    title: 'JÄRNVÄGEN ÄR INTE TILL SALU',
    text: 'Ändringen av {lag} innebär att statens järnväg, posten och elnätet ska säljas. I dag gick lokförare, brevbärare och elmontörer i samma tåg genom {huvudstad}, under en enda banderoll: "DET HÄR ÄR VÅRT". Mätningarna visar att två av tre är emot försäljningen, även bland dem som röstade på dig.',
    when: (c) => c.changed('ownership', 'economic_system') && c.is('ownership', 'ppp', 'privatized', 'full', 'oligarch'),
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -15, temp: { approval: 3 }, tip: 'Tågen fortsätter vara försenade. Men de är dina.' },
      { text: 'BEHÅLL JÄRNVÄGEN OCH ELNÄTET I STATENS ÄGO', cost: { pp: 10 }, griev: -8, temp: { approval: 2, income: -1 }, tip: 'En halv privatisering. Ingen blir riktigt glad, men tågen går.' },
      { text: 'SÄLJ ALLT — PENGARNA BEHÖVS', res: { money: 600 }, griev: 8, temp: { approval: -4 }, ind: { trustgov: -3, stockcap: 4 }, tip: 'Kassan fylls en gång. Missnöjet fylls på varje gång ett tåg är sent.' },
    ],
  },
  {
    id: 'pro_bruk', icon: '\u{1F3ED}', cooldown: 1000, kind: 'ekonomi', react: true,
    title: 'BRUKET I {STAD} SKA LÄGGAS NER',
    text: 'Efter beslutet om {lag} har ägarna till det hundraåriga bruket i {stad} meddelat att de stänger i vår. Tolvhundra jobb försvinner i en ort med fjortontusen invånare. I kväll fylldes kyrkan av arbetare och deras familjer, och fackklubbens ordförande sa det alla tänkte: "Utan bruket finns ingen stad."',
    when: (c) => c.cut('industrial_subsidies', 'ownership', 'globalism') && c.grievOf('ekonomi') > 6,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -14, temp: { factory: 1, approval: 2 }, tip: 'Bruket får ett år till. Kanske fler.' },
      { text: 'ERBJUD ETT RÄDDNINGSPAKET TILL BRUKET', cost: { money: 600 }, griev: -10, temp: { factory: 2, approval: 2 }, tip: 'Bruket överlever. Frågan är hur länge, och på vems bekostnad.' },
      { text: 'MARKNADEN FÅR AVGÖRA', griev: 6, temp: { approval: -3 }, ind: { unemp: 0.1 }, next: 'pro_bruk_ockupation', tip: 'Marknaden har talat. Arbetarna har också något att säga.' },
    ],
  },
  {
    id: 'pro_bruk_ockupation', icon: '\u{1F527}', chain: true, kind: 'ekonomi',
    title: 'ARBETARNA OCKUPERAR BRUKET',
    text: 'Dagen efter beskedet vägrade nattskiftet gå hem. Nu har arbetarna i {stad} ockuperat bruket i två veckor, och maskinerna går fortfarande. De säljer till gamla kunder och betalar sig själva lön ur en kartong i matsalen. Ägarna kräver att polisen avhyser dem. Ortens bagare levererar frukost gratis.',
    choices: [
      { text: 'HJÄLP ARBETARNA KÖPA BRUKET SOM KOOPERATIV', cost: { money: 500 }, griev: -14, temp: { factory: 2, approval: 4 }, next: 'pro_bruk_kooperativ', tip: 'Ett djärvt experiment. Bruket har aldrig ägts av dem som kan det bäst.' },
      { text: 'TILLSÄTT EN MEDLARE MELLAN ÄGARE OCH ARBETARE', cost: { pp: 10 },
        risk: { chance: 0.5,
          win: { text: 'En ny ägare köper bruket och behåller de flesta jobben.', griev: -10, temp: { factory: 1 } },
          lose: { text: 'Ingen köpare hittas. Bruket stänger ändå, efter en månads förhandlingar.', griev: 6, ind: { unemp: 0.1 } } } },
      { text: 'AVHYS OCKUPANTERNA', temp: { unrest: 5, approval: -5 }, griev: 10, ind: { unemp: 0.1, trustgov: -3 }, next: 'pro_eftersmak', tip: 'Lagen är tydlig. Bilderna från bruksgrinden också.' },
    ],
  },
  {
    id: 'pro_bruk_kooperativ', icon: '\u{1F4C8}', chain: true, kind: 'ekonomi',
    title: 'BRUKET GÅR MED VINST',
    text: 'Ett år efter ockupationen har kooperativet i {stad} gjort sin första vinst. Arbetarna har sänkt sina egna löner, sålt ledningens tjänstebilar och hittat nya kunder i {land}. Ekonomer från tre universitet har kommit på studiebesök. Fackklubbens ordförande, numera vd, säger att det svåraste var kalkylarken.',
    choices: [
      { text: 'GÖR DET TILL EN MODELL FÖR ANDRA ORTER', cost: { money: 300 }, griev: -8, perm: { factory: 1 }, temp: { approval: 3 }, tip: 'Tre andra bruk vill göra samma sak. Alla har inte lika bra bagare.' },
      { text: 'BESÖK BRUKET OCH FIRA MED ARBETARNA', cost: { pp: 5 }, griev: -5, temp: { approval: 4, stability: 2 }, tip: 'Kaffe och tårta i matsalen. Lönekartongen står på hedersplats.' },
      { text: 'LÅT DEM KLARA SIG SJÄLVA NU', griev: -3, temp: { gdp: 1 }, tip: 'Det har de visat att de kan.' },
    ],
  },
  {
    id: 'pro_robotbilar', icon: '\u{1F916}', cooldown: 1000, kind: 'ekonomi', react: true,
    title: 'TAXICHAUFFÖRERNA MOT ROBOTBILARNA',
    text: 'Sedan ändringen av {lag} rullar förarlösa taxibilar i {huvudstad}, och priserna har halverats. I dag körde fyratusen taxi- och lastbilsförare i kortege runt parlamentet och tutade i en timme. Många har tjugo år kvar till pensionen och lån på bilarna. "Vem omskolar oss?" stod det på en motorhuv.',
    when: (c) => c.changed('ai_regulation') && c.is('ai_regulation', 'sandbox', 'light', 'free', 'automation') && c.grievOf('ekonomi') + c.grievOf('kris') > 3,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -12, temp: { approval: 2, research: -1 }, tip: 'Robotbilarna parkeras. Uppfinnarna flyttar till {land}.' },
      { text: 'BETALA OMSKOLNING FÖR DE DRABBADE', cost: { money: 400 }, griev: -9, temp: { approval: 3 }, ind: { unemp: -0.1 }, tip: 'Taxichaufförer blir elektriker. Det tar två år och många kaffekoppar.' },
      { text: 'FRAMTIDEN GÅR INTE ATT STOPPA', griev: 6, temp: { gdp: 1, approval: -3 }, ind: { unemp: 0.2 }, tip: 'Sant. Men den går att planera.' },
    ],
  },

  // ===== FÖRSVARET =====
  {
    id: 'pro_monstring', icon: '\u{1F4E8}', cooldown: 1000, kind: 'forsvar', react: true,
    title: 'MÖNSTRINGSKALLELSERNA BRINNER',
    text: 'Ändringen av {lag} har gett nittontusen artonåringar en kallelse i brevlådan. I kväll samlades tusentals av dem på stora torget i {stad} och eldade upp kallelserna i en järntunna, under applåder från en del föräldrar och tystnad från andra. Polisen stod bredvid och höll koll på brandsäkerheten.',
    when: (c) => c.cut('military_service') && c.grievOf('forsvar') > 4,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -14, temp: { approval: 3, manpower: -2 }, tip: 'Artonåringarna firar. Generalerna räknar om.' },
      { text: 'INFÖR VAPENFRI TJÄNST SOM ALTERNATIV', cost: { pp: 8 }, griev: -7, temp: { approval: 2, freedom: 1 }, tip: 'Civilplikt i räddningstjänst och äldrevård. Båda behöver folk.' },
      { text: 'DEN SOM VÄGRAR FÅR BÖTER', temp: { manpower: 2, freedom: -2 }, griev: 7, ind: { trustgov: -2 }, tip: 'Böterna betalas. Av föräldrarna. Under protest.' },
    ],
  },
  {
    id: 'pro_fredsmarsch', icon: '\u{1F54A}\u{FE0F}', weight: 2, cooldown: 900, kind: 'forsvar',
    title: 'FÖRÄLDRARNAS FREDSMARSCH',
    text: 'Kriget har pågått i månader, och nu går tiotusentals föräldrar och morföräldrar till soldater genom {huvudstad} med fotografier av sina barn. De är inte emot försvaret, säger talespersonen, men de vill veta när det tar slut och varför det började. Marschen går i total tystnad.',
    when: (c) => c.atWar && c.grievOf('forsvar') > 10 && c.demo > 3,
    choices: [
      { text: 'TRÄFFA FAMILJERNA OCH REDOVISA KRIGSMÅLEN', cost: { pp: 10 }, griev: -8, temp: { approval: 3 }, ind: { trustgov: 3 }, tip: 'Ärlighet om ett krig är sällsynt. Därför väger den tungt.' },
      { text: 'INLED FREDSSAMTAL VIA EN MEDLARE', cost: { pp: 25 }, griev: -15, temp: { approval: 4, readiness: -3 }, rel: 5, tip: 'Generalerna muttrar. Familjerna andas ut.' },
      { text: 'KALLA DET ATT SVIKA SOLDATERNA', temp: { readiness: 2, approval: -5 }, griev: 9, ind: { trustgov: -4 }, mod: 'war_weariness', tip: 'Familjerna har barn vid fronten. De glömmer inte vad du sa.' },
    ],
  },
  {
    id: 'pro_manniskokedja', icon: '\u{2622}\u{FE0F}', cooldown: 1000, kind: 'forsvar', react: true,
    title: 'MÄNNISKOKEDJAN RUNT BASEN',
    text: 'Efter ändringen av {lag} har femtiotusen människor hållit varandra i händerna i en kedja som sträcker sig tjugo kilometer runt flygbasen utanför {stad}. Fredsrörelsen, kyrkorna och en ovanligt stor skara pensionerade officerare står sida vid sida. Barn har knutit pappersfjärilar i stängslet.',
    when: (c) => c.changed('nuclear_doctrine', 'arms_exports', 'defense_budget') && c.demo > 4 && (c.is('nuclear_doctrine', 'sharing', 'deterrence', 'firststrike', 'brinkmanship') || c.is('arms_exports', 'promotion', 'influence', 'anyone')),
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 18 }, undo: true, griev: -15, temp: { approval: 3 }, rel: 3, tip: 'Kedjan släpper taget. Fjärilarna sitter kvar.' },
      { text: 'BJUD IN FREDSRÖRELSEN TILL EN DIALOG', cost: { pp: 8 }, griev: -6, temp: { stability: 1 }, tip: 'Fredsrörelsen och generalerna vid samma bord. Kaffet tar slut först.' },
      { text: 'FÖRSVARET STYRS INTE AV OPINIONSMÄTNINGAR', griev: 6, temp: { approval: -3, milpower: 1 }, tip: 'Sant. Men det betalas av dem som svarar på dem.' },
    ],
  },
  {
    id: 'pro_veteraner', icon: '\u{1F396}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'forsvar',
    title: 'VETERANERNA LÄMNAR TILLBAKA MEDALJERNA',
    text: 'Utanför försvarsdepartementet i {huvudstad} står en lång kö av män och kvinnor i gamla uniformer. En efter en lägger de sina medaljer i en låda. Krigströttheten har vuxit i månader, och veteranerna säger att hemvändande soldater lämnas ensamma: inga jobb, ingen vård för de osynliga skadorna och ingen som lyssnar.',
    when: (c) => (c.mod('war_weariness') || c.atWar) && c.grievOf('forsvar') > 8 && c.day > 100,
    choices: [
      { text: 'BYGG UT VETERANVÅRDEN', cost: { money: 500 }, griev: -12, temp: { approval: 3, readiness: 2 }, tip: 'Psykologer, rehabilitering och ett jobbprogram. Det borde ha funnits innan.' },
      { text: 'BÄR IN LÅDAN SJÄLV OCH BE OM URSÄKT', cost: { pp: 10 }, griev: -7, temp: { approval: 4 }, ind: { trustgov: 2 }, tip: 'En ursäkt kostar inget. En bra ursäkt kostar prestige.' },
      { text: 'LÅT FÖRSVARSMAKTEN SVARA', griev: 6, temp: { readiness: -2, approval: -2 }, tip: 'Försvarsmakten svarar med ett pressmeddelande. Kön blir längre.' },
    ],
  },

  // ===== TOM STATSKASSA =====
  {
    id: 'pro_lon_sen', icon: '\u{1F3E6}', cooldown: 900, kind: 'underskott', react: true,
    title: 'LÖNEN KOM INTE I DAG',
    text: 'Den tjugofemte i månaden, och för första gången på trettio år har statens anställda inte fått sin lön. Statskassan är tom och banken lånar bara ut till räntor som finansministern kallar "förolämpande". Lärare, poliser och busschaufförer i {stad} står i kö vid bankomaterna och stirrar på sina saldon.',
    when: (c) => c.deficit && c.grievOf('underskott') > 6,
    choices: [
      { text: 'LÅNA TILL VARJE PRIS OCH BETALA I MORGON', cost: { pp: 10 }, griev: -8, temp: { income: -3 }, tip: 'Lönerna betalas. Räntan också, i många år.' },
      { text: 'BETALA HALVA LÖNEN NU OCH RESTEN NÄSTA MÅNAD', griev: 4, temp: { approval: -3 }, next: [null, 'pro_lon_strejk'], tip: 'Halva lönen betalar halva hyran.' },
      { text: 'BETALA MINISTRARNA SIST', cost: { pp: 5 }, griev: -3, temp: { approval: 3 }, next: ['pro_lon_strejk', null], tip: 'Symboliskt. Ministrarnas löner betalar inga skolor.' },
    ],
  },
  {
    id: 'pro_lon_strejk', icon: '\u{1F5D1}\u{FE0F}', chain: true, kind: 'underskott',
    title: 'DE OFFENTLIGANSTÄLLDA STREJKAR',
    text: 'Tredje månaden med sena löner fick bägaren att rinna över. Lärare, sophämtare, busschaufförer och myndighetspersonal har gått ut i en gemensam strejk. Soporna växer på gatorna i {huvudstad}, skolorna är stängda och passkontoren har satt upp lappar: "Stängt tills staten betalar."',
    choices: [
      { text: 'SÄLJ STATLIGA TILLGÅNGAR FÖR ATT BETALA LÖNERNA', res: { money: 500 }, griev: -10, perm: { income: -1 }, temp: { unrest: -4 }, next: 'pro_lon_uppgorelse', tip: 'Skogar och hotell säljs, lönerna betalas. Nästa år finns inget att sälja.' },
      { text: 'HÖJ SKATTERNA TILLFÄLLIGT', cost: { pp: 15 }, griev: -8, temp: { income: 4, approval: -3 }, next: 'pro_lon_uppgorelse', tip: 'Pengar till lönerna. Och missnöje av ett annat slag.' },
      { text: 'SÄG ATT STAT OCH FOLK MÅSTE DELA BÖRDAN', griev: 8, temp: { unrest: 5, factory: -2 }, ind: { strikes: 50, trustgov: -4 }, tip: 'Folk undrar varför bördan alltid hamnar hos dem som jobbar.' },
    ],
  },
  {
    id: 'pro_lon_uppgorelse', icon: '\u{1F91D}', chain: true, kind: 'underskott',
    title: 'UPPGÖRELSEN OM LÖNERNA',
    text: 'Efter två veckors strejk har regeringen och facken enats om en betalningsplan: lönerna betalas i tid från nästa månad, och den som fått vänta får ränta på de sena pengarna. Soporna hämtas i {huvudstad} igen. Facket säger att förtroendet tar längre tid att få tillbaka än pengarna.',
    choices: [
      { text: 'SKRIV IN LÖNERNA FÖRST I BUDGETEN', cost: { pp: 10 }, griev: -14, temp: { approval: 3, stability: 2 }, ind: { strikes: -50, trustgov: 3 }, tip: 'Löner först, monument sedan. En ovanlig ordning.' },
      { text: 'BE OM URSÄKT I TV', griev: -6, temp: { approval: 2 }, ind: { trustgov: 2 }, tip: 'En ursäkt betalar ingen hyra, men den får folk att lyssna.' },
      { text: 'INFÖR EN SKULDBROMS SÅ ATT DET INTE HÄNDER IGEN', cost: { pp: 20 }, law: ['debt_brake', 'rules'], griev: -10, perm: { stability: 1 }, tip: 'Regler hjälper bara om de följs. Men det är en början.' },
    ],
  },
  {
    id: 'pro_atstramning', icon: '\u{2702}\u{FE0F}', cooldown: 900, kind: 'underskott', react: true,
    title: 'ÅTSTRAMNINGEN MÖTER GATAN',
    text: 'Kreditbetyget har sänkts igen och räntan på statens lån har stuckit iväg. Regeringens sparpaket, med färre bussturer, stängda bibliotek och frysta bidrag, presenterades i går. I dag stod tvåhundratusen människor utanför finansdepartementet i {huvudstad}, och facken har gett regeringen en vecka på sig.',
    when: (c) => c.deficit && c.ratingIdx >= 4 && c.grievOf('underskott') > 10,
    choices: [
      { text: 'FÖRDELA SPARANDET JÄMNARE — DE RIKA BETALAR MER', cost: { pp: 15 }, griev: -10, temp: { approval: 3, income: 2 }, ind: { stockcap: -3 }, tip: 'Rättvisare. Men kapitalet kan rösta med fötterna.' },
      { text: 'SKJUT UPP SPARPAKETET ETT ÅR', griev: -8, temp: { approval: 2, income: -3 }, tip: 'Gatan lugnar sig. Långivarna gör det inte.' },
      { text: 'GENOMFÖR ALLT SOM PLANERAT', temp: { income: 3, approval: -5, unrest: 5 }, griev: 10, ind: { strikes: 40, protests: 40 }, tip: 'Kassan mår bättre om ett år. Folket om fem.' },
    ],
  },
  {
    id: 'pro_langivare', icon: '\u{1F4DC}', cooldown: 1200, kind: 'underskott', react: true,
    title: 'LÅNGIVARNAS VILLKOR',
    text: 'Med kreditbetyget nere i skräpklass har långivarna i {land} ställt villkor för nästa lån: pensionerna ska sänkas, tusentals statsanställda sägas upp och statliga bolag säljas inom ett år. Avtalet läckte i går. I kväll brinner bilar i {huvudstad}, och facken har utlyst strejk till fredag.',
    when: (c) => c.deficit && c.ratingIdx >= 5 && c.grievOf('underskott') > 8,
    choices: [
      { text: 'SKRIV UNDER — LANDET BEHÖVER PENGARNA', res: { money: 1500 }, griev: 15, temp: { unrest: 8, approval: -8 }, ind: { trustgov: -6, strikes: 50 }, tip: 'Pengarna räddar statskassan. Inte nödvändigtvis regeringen.' },
      { text: 'FÖRHANDLA OM MILDARE VILLKOR', cost: { pp: 25 },
        risk: { chance: 0.5,
          win: { text: 'Långivarna går med på längre tid. Pensionerna klarar sig.', res: { money: 1000 }, griev: 4, temp: { unrest: 2 } },
          lose: { text: 'Förhandlingarna drar ut på tiden. Kassan är fortfarande tom.', griev: 8, temp: { unrest: 5 } } } },
      { text: 'SÄG NEJ OCH UTLYS EN FOLKOMRÖSTNING', griev: -10, temp: { approval: 5, stability: -4 }, rel: -6, ind: { stockcap: -10 }, mod: 'capital_flight', tip: 'Folket säger nej med stor majoritet. Bankerna säger samma sak.' },
    ],
  },

  // ===== KRISEN =====
  {
    id: 'pro_jobbmarsch', icon: '\u{1F97E}', cooldown: 1200, kind: 'kris',
    title: 'MARSCHEN FRÅN {STAD}',
    text: 'Tvåhundra arbetslösa har börjat gå de trettio milen från {stad} till {huvudstad}. Arbetslösheten där har stigit i ett år, och nu bär de en namnlista i en träkista som deras farfäder byggde till en liknande marsch för länge sedan. Byarna längs vägen ställer fram soppa och sängplatser i församlingshemmen.',
    when: (c) => (c.ind.unemp ?? 6) > 9 && c.grievOf('kris') > 12 && c.demo > 3,
    choices: [
      { text: 'MÖT DEM HALVVÄGS', cost: { pp: 8 }, griev: -6, temp: { approval: 4 }, next: [null, 'pro_jobbmarsch_framme'], tip: 'Halva vägen till {stad}. Hela vägen in i deras förtroende.' },
      { text: 'LOVA ETT JOBBPAKET FÖR REGIONEN', cost: { money: 600 }, griev: -12, temp: { approval: 3 }, ind: { unemp: -0.2 }, tip: 'Vägbyggen, renoverade skolor och en ny station. Om två år.' },
      { text: 'LÅT DEM GÅ', griev: 4, temp: { approval: -2 }, next: 'pro_jobbmarsch_framme', tip: 'Trettio mil ger tid att tänka. För båda sidor.' },
    ],
  },
  {
    id: 'pro_jobbmarsch_framme', icon: '\u{1F4E6}', chain: true, kind: 'kris',
    title: 'MARSCHEN ÄR FRAMME',
    text: 'Efter tre veckor till fots kommer marschen fram till {huvudstad}, och den är inte längre tvåhundra människor. Den är fyrtiotusen. Folk har anslutit från varje stad längs vägen, och nu står de med skavsår utanför parlamentet. Kistan med namnlistan bärs uppför trappan av sex pensionerade gruvarbetare.',
    choices: [
      { text: 'TA EMOT KISTAN OCH LÄGG FRAM ETT KRISPAKET', cost: { money: 800, pp: 10 }, griev: -18, temp: { approval: 5, unrest: -5 }, ind: { unemp: -0.3, trustgov: 4 }, tip: 'Det dyraste du gjort i år. Folk kommer att minnas det.' },
      { text: 'TA EMOT KISTAN OCH LOVA EN UTREDNING', cost: { pp: 5 }, griev: -4, temp: { approval: 1 }, tip: 'Kistan ställs i en korridor. Fotograferna fotograferar korridoren.' },
      { text: 'LÅT KISTAN STÅ KVAR PÅ TRAPPAN', griev: 10, temp: { approval: -6, unrest: 5 }, ind: { trustgov: -5 }, tip: 'Kistan står där i en vecka. Folk lägger blommor på den.' },
    ],
  },
  {
    id: 'pro_kastruller', icon: '\u{1F373}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'KASTRULLERNA SKRAMLAR',
    text: 'Klockan åtta varje kväll öppnar människor fönstren i {huvudstad} och slår på kastruller med slevar. Det började i ett enda kvarter när inflationen passerade åtta procent och priserna på mat och el steg varje vecka. Nu skramlar det i hela landet i en kvart, och hundarna har slutat bry sig.',
    when: (c) => (c.ind.infl ?? 3) > 7 && c.grievOf('kris') > 8,
    choices: [
      { text: 'FRYS PRISERNA PÅ BASVAROR', cost: { pp: 15 }, law: ['price_controls', 'caps'], griev: -10, temp: { approval: 3, gdp: -1 }, tip: 'Priserna står still. Hyllorna kan bli tomma i stället.' },
      { text: 'GE ETT INFLATIONSSTÖD TILL HUSHÅLLEN', cost: { money: 500 }, griev: -8, temp: { approval: 2 }, ind: { infl: 0.2 }, tip: 'Pengar mot inflation. Ekonomerna drar efter andan.' },
      { text: 'LÅT CENTRALBANKEN HÖJA RÄNTAN', griev: 4, temp: { gdp: -2, approval: -2 }, ind: { infl: -0.8, unemp: 0.2 }, tip: 'Det fungerar. Långsamt, och på bekostnad av jobben.' },
    ],
  },
  {
    id: 'pro_generation', icon: '\u{231B}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'GENERATION VÄNTAN',
    text: 'Var fjärde ung människa saknar jobb, och nu har de unga själva gett sig ett namn: "Generation väntan". De väntar på jobb, på lägenhet och på att få flytta hemifrån. I helgen ockuperade tiotusen av dem en nedlagd köpgalleria i {stad} och öppnade en egen arbetsförmedling där företagen fick komma och söka dem.',
    when: (c) => (c.ind.youthunemp ?? 15) > 22 && c.grievOf('kris') > 8 && c.demo > 3,
    choices: [
      { text: 'INFÖR EN UNGDOMSGARANTI: JOBB ELLER STUDIER', cost: { money: 700 }, griev: -14, temp: { approval: 4 }, ind: { youthunemp: -1.5 }, tip: 'Dyrt och byråkratiskt. Men varje ung människa får ett datum.' },
      { text: 'SÄNK ARBETSGIVARAVGIFTEN FÖR UNGA', cost: { pp: 12 }, griev: -7, temp: { income: -2 }, ind: { youthunemp: -0.8 }, tip: 'Företagen anställer. En del av dem hade gjort det ändå.' },
      { text: 'SÄG ATT DE FÅR FLYTTA DIT JOBBEN FINNS', griev: 7, temp: { approval: -4 }, ind: { trustgov: -3 }, tip: 'Jobben finns i {huvudstad}. Det gör inte lägenheterna.' },
    ],
  },
  {
    id: 'pro_taltstad', icon: '\u{26FA}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'TÄLTSTADEN I PARKEN',
    text: 'Bostadspriser och hyror har dragit ifrån lönerna i flera år. Nu står tvåhundra tält i stadsparken i {stad}: familjer som vräkts, studenter utan kontrakt och en busschaufför som sover där mellan passen. De har en gemensam soppgryta, en anslagstavla och en skylt vid grinden: "VI ARBETAR. VI BOR HÄR."',
    when: (c) => ((c.ind.rentshare ?? 25) > 35 || (c.ind.houseprice ?? 6) > 11) && c.grievOf('kris') + c.grievOf('valfard') > 18,
    choices: [
      { text: 'ÖPPNA TOMMA STATLIGA HUS SOM BOSTÄDER', cost: { money: 300 }, griev: -9, temp: { qol: 1, approval: 3 }, ind: { homeless: -6 }, tip: 'Gamla kaserner och kontor blir hem. Inte vackra, men varma.' },
      { text: 'STARTA ETT STORT BOSTADSPROGRAM', cost: { money: 1000, pp: 10 }, griev: -15, temp: { approval: 4 }, ind: { homeless: -10, houseprice: -3 }, tip: 'Hundratusen bostäder på fem år. Om allt går enligt plan.' },
      { text: 'LÅT KOMMUNEN RIVA LÄGRET', temp: { unrest: 4, approval: -4 }, griev: 8, ind: { homeless: 4 }, next: ['pro_eftersmak', null], tip: 'Tälten försvinner från parken. Människorna försvinner inte.' },
    ],
  },

  // ===== DE STORA STREJKERNA (missnöje 30–60) =====
  {
    id: 'pro_lokforare', icon: '\u{1F682}', weight: 2, cooldown: 1000,
    title: 'LOKFÖRARNA KLIVER AV',
    text: 'Klockan fyra i morse körde lokförarna in tågen i depåerna och klev av. Missnöjet har jäst i ett år, och nu står hela järnvägsnätet still. Pendlare från {stad} samåker med främlingar, cykelaffärerna sålde slut före lunch och godståg med timmer och stål står parkerade på sidospåren.',
    when: (c) => c.griev >= 30 && c.griev < 70 && (c.ind.unionrate ?? 30) > 20 && c.demo > 5,
    choices: [
      { text: 'GÅ MED PÅ LÖNEKRAVEN DIREKT', cost: { money: 400 }, griev: -10, temp: { unrest: -3 }, ind: { strikes: -30 }, tip: 'Tågen går i morgon. Andra yrken har sett hur snabbt det gick.' },
      { text: 'KALLA IN RIKSMEDLAREN', cost: { pp: 8 }, ind: { strikes: 20 }, next: ['pro_tag_avtal', 'pro_tag_vecka2'], tip: 'Medlaren tar med sig sovsäck. Det säger något.' },
      { text: 'VÄNTA UT DEM', temp: { factory: -2, approval: -2 }, griev: 5, ind: { strikes: 40, gdpgrowth: -0.1 }, next: 'pro_tag_vecka2', tip: 'Lokförare är få. Det gör dem starka, inte svaga.' },
    ],
  },
  {
    id: 'pro_tag_vecka2', icon: '\u{1F682}', chain: true,
    title: 'ANDRA VECKAN UTAN TÅG',
    text: 'Järnvägsstrejken har gått in på sin andra vecka. Stålverket i {stad} har stoppat en masugn eftersom malmen inte kommer fram, och matbutikerna får sina varor med lastbilar som inte räcker till. Vägarna in till {huvudstad} är igenkorkade varje morgon. Opinionen svänger, men inte till din fördel.',
    choices: [
      { text: 'LAGSTIFTA BORT STREJKEN', cost: { pp: 20 }, temp: { factory: 2, freedom: -3 }, griev: 8, ind: { strikes: -50, trustgov: -4, demo: -0.1 }, next: ['pro_eftersmak', null], tip: 'Tågen går. Lokförarna kör dem med en mycket speciell min.' },
      { text: 'ACCEPTERA MEDLARENS BUD', cost: { money: 500 }, griev: -12, temp: { unrest: -4 }, ind: { strikes: -40 }, tip: 'Dyrare än för två veckor sedan. Sådan är prislistan.' },
      { text: 'VÄNTA ÄNNU LÄNGRE', griev: 5, temp: { factory: -3, approval: -3 }, ind: { gdpgrowth: -0.2 }, tip: 'Bussarna är fulla. Tålamodet är slut.' },
    ],
  },
  {
    id: 'pro_tag_avtal', icon: '\u{1F950}', chain: true,
    title: 'TÅGEN GÅR IGEN',
    text: 'Efter fyra dygn hos medlaren blev det ett avtal: högre lön för nattskift, fler lokförare på långa sträckor och ett nytt schema som facket fått vara med och rita. Vid sextiden i morse rullade det första tåget ut från {huvudstad}, och pendlarna applåderade när det kom in i {stad} bara sju minuter sent.',
    choices: [
      { text: 'BJUD LOKFÖRARNA PÅ FRUKOST PÅ STATIONEN', cost: { money: 30 }, griev: -6, temp: { approval: 3 }, ind: { strikes: -40 }, tip: 'Kanelbullar och ett handslag. Årets billigaste fredsfördrag.' },
      { text: 'INFÖR SAMRÅD OM SCHEMAN I ALLA STATLIGA BOLAG', cost: { pp: 10 }, griev: -8, perm: { stability: 1 }, ind: { strikes: -30 }, tip: 'Den som får rita schemat strejkar sällan mot det.' },
      { text: 'SÄG ATT AVTALET VAR FÖR DYRT', griev: 4, temp: { income: 1, approval: -2 }, tip: 'Det kan vara sant. Det var fel dag att säga det.' },
    ],
  },
  {
    id: 'pro_hamn', icon: '\u{2693}', weight: 2, cooldown: 1000,
    title: 'HAMNEN I {STAD} STÄNGER',
    text: 'Hamnarbetarna i {stad} har lagt ner arbetet efter åtta månader utan nytt avtal. Containerfartygen ankrar på redden och väntar, kylcontainrar med frukt surrar på kajen och exportföretagen ringer departementet var tionde minut. Nästan en tredjedel av landets export går genom hamnen.',
    when: (c) => c.griev >= 30 && c.griev < 70 && (c.ind.exports ?? 30) > 20 && (c.ind.unionrate ?? 30) > 15,
    choices: [
      { text: 'PRESSA ARBETSGIVARNA TILL ETT BUD', cost: { pp: 10 }, griev: -8, temp: { gdp: -1 }, ind: { strikes: -20 }, tip: 'Arbetsgivarna muttrar. Kranarna börjar röra sig.' },
      { text: 'LÅT PARTERNA LÖSA DET SJÄLVA', griev: 3, temp: { gdp: -2 }, ind: { strikes: 30, gdpgrowth: -0.2 }, next: ['pro_hamn_ko', null], tip: 'Parterna brukar lösa det själva. Efter ett tag.' },
      { text: 'LÅT MILITÄREN LOSSA FARTYGEN', cost: { man: 6 }, temp: { unrest: 5, freedom: -2 }, griev: 8, ind: { trustgov: -3 }, next: 'pro_hamn_ko', tip: 'Soldater kör inte containerkranar särskilt bra.' },
    ],
  },
  {
    id: 'pro_hamn_ko', icon: '\u{1F6A2}', chain: true,
    title: 'TVÅHUNDRA FARTYG PÅ REDDEN',
    text: 'Konflikten har spridit sig till två andra hamnar, och nu ligger tvåhundra fartyg för ankar utanför kusten. Bilfabriken i {stad} har stoppat bandet i brist på delar, apoteken varnar för brist på vissa mediciner och rederierna har börjat styra om till hamnar i {granne}.',
    choices: [
      { text: 'TVINGA FRAM ETT AVTAL MED STATLIGA PENGAR', cost: { money: 700 }, griev: -12, temp: { gdp: 2 }, ind: { strikes: -50, gdpgrowth: 0.2 }, tip: 'Staten betalar mellanskillnaden. Hamnen öppnar i morgon.' },
      { text: 'GÖR STREJKEN OLAGLIG MED EN NÖDLAG', cost: { pp: 20 }, temp: { factory: 2, freedom: -4 }, griev: 10, ind: { strikes: -60, demo: -0.2, trustgov: -4 }, next: 'pro_eftersmak', tip: 'Lagen är snabb. Arbetarna glömmer långsamt.' },
      { text: 'VÄNTA TILLS STREJKKASSAN ÄR TOM', griev: 6, temp: { gdp: -3, factory: -2 }, rel: -2, ind: { gdpgrowth: -0.3 }, tip: 'Strejkkassan är tom om en månad. Rederierna har redan bestämt sig.' },
    ],
  },
  {
    id: 'pro_student', icon: '\u{1F393}', weight: 2, cooldown: 1000,
    title: 'STUDENTERNA OCKUPERAR AULAN',
    text: 'Fyrahundra studenter har ockuperat universitetets aula i {stad} och vägrar gå därifrån. Det började med terminsavgifterna men har blivit något större: nu vill de ha en ny regering. Bakom talarstolen hänger en jättelik banderoll, och flera professorer har börjat hålla sina föreläsningar i aulan i stället.',
    when: (c) => c.griev >= 30 && (c.grievOf('frihet') > 12 || c.grievOf('valfard') > 18) && c.demo > 4,
    choices: [
      { text: 'BESÖK AULAN OCH DEBATTERA MED DEM', cost: { pp: 8 }, next: [null, 'pro_student_rorelse'],
        risk: { chance: 0.5,
          win: { text: 'Du står i tre timmar och svarar på frågor. Även motståndarna säger att du lyssnade.', griev: -8, temp: { approval: 4 } },
          lose: { text: 'Du blir utbuad från första minuten. Filmen sprids överallt.', griev: 4, temp: { approval: -4 } } } },
      { text: 'GÅ MED PÅ KRAVET OM AVGIFTERNA', cost: { money: 300 }, griev: -8, temp: { approval: 2, research: 1 }, tip: 'Avgifterna försvinner. Banderollen sitter kvar.' },
      { text: 'LÅT REKTORN RINGA POLISEN', temp: { unrest: 4, freedom: -2 }, griev: 7, ind: { trustgov: -3 }, next: ['pro_student_rorelse', 'pro_eftersmak'], tip: 'Polis i aulan. Det har inte hänt sedan farfars tid.' },
    ],
  },
  {
    id: 'pro_student_rorelse', icon: '\u{1F393}', chain: true,
    title: 'UNIVERSITETEN STÄNGER, ETT EFTER ETT',
    text: 'Ockupationen i {stad} har smittat av sig. Nu är tolv lärosäten ockuperade, och gymnasieelever går ut ur lektionerna för att ansluta. Studenterna har bildat ett nationellt råd med en tjugotvååring som talesperson. Hon är lugn, påläst och mycket bra i tv. Hennes föräldrar är båda poliser.',
    choices: [
      { text: 'BJUD IN STUDENTRÅDET TILL FÖRHANDLINGAR', cost: { pp: 15 }, griev: -12, temp: { unrest: -4, approval: 3 }, ind: { trustgov: 3 }, tip: 'Första förhandlingen i historien där motparten antecknar på surfplatta.' },
      { text: 'STÄNG UNIVERSITETEN TERMINEN UT', temp: { research: -4, unrest: 3 }, perm: { research: -1 }, griev: 8, tip: 'Ingen ockuperar en stängd byggnad. Ingen forskar i den heller.' },
      { text: 'GE EFTER PÅ STUDENTERNAS STÖRSTA KRAV', cost: { money: 400, pp: 10 }, griev: -16, temp: { approval: 4, unrest: -5 }, tip: 'Studenterna vinner. De kommer att påminna dig om det i trettio år.' },
    ],
  },
  {
    id: 'pro_motdemo', icon: '\u{1F465}', weight: 2, cooldown: 900,
    title: 'MOTDEMONSTRATIONEN',
    text: 'Efter månader av protester har regeringens anhängare tröttnat på att vara tysta. I helgen samlades sextiotusen i {huvudstad} under parollen "Ge reformerna en chans". Samtidigt marscherade lika många från andra hållet. Polisen höll de två tågen två kvarter ifrån varandra, och det gick. Nästan.',
    when: (c) => c.griev >= 30 && c.griev < 75 && c.st.approval > 0 && c.demo > 5,
    choices: [
      { text: 'TALA PÅ DINA ANHÄNGARES MÖTE', cost: { pp: 5 }, temp: { approval: 4, unrest: 3 }, griev: 4, tip: 'Applåderna värmer. Klyftan i landet blir djupare.' },
      { text: 'TACKA DEM MEN HÅLL DIG BORTA', griev: -3, temp: { stability: 2 }, tip: 'En ledare för alla står inte på någons scen.' },
      { text: 'BJUD IN BÅDA SIDOR TILL ETT MEDBORGARRÅD', cost: { pp: 12, money: 100 }, griev: -8, temp: { unrest: -3, stability: 2 }, ind: { trustgov: 2 }, tip: 'Hundra slumpvis utvalda medborgare. De blir oväntat överens.' },
    ],
  },

  // ===== NÄR LANDET KOKAR (missnöje 60+) =====
  {
    id: 'pro_gs_hot', icon: '\u{1F6D1}', cooldown: 1200,
    title: 'FACKEN HOTAR MED GENERALSTREJK',
    text: 'Missnöjet har nått en nivå som landet inte sett på en generation. I kväll meddelade alla fackliga centralorganisationer gemensamt att de utlyser generalstrejk om en vecka, om inte regeringen kommer till förhandlingsbordet. Arbetsgivarna har begärt ett krismöte, och börsen föll fyra procent på en timme.',
    when: (c) => c.griev >= 60 && (c.ind.unionrate ?? 30) > 20 && c.demo > 4 && c.day > 60 && !c.mod('general_strike'),
    choices: [
      { text: 'KALLA TILL TREPARTSSAMTAL PÅ EN GÅNG', cost: { pp: 20 }, griev: -6, temp: { unrest: -3 }, next: 'pro_trepart', tip: 'Fack, arbetsgivare och regering i samma rum. Det har hänt förut. Sällan.' },
      { text: 'GE EFTER PÅ DE STÖRSTA KRAVEN', cost: { money: 900, pp: 15 }, griev: -22, temp: { approval: 4, unrest: -6, income: -3 }, ind: { stockcap: 3 }, tip: 'Strejken avblåses. Budgeten får ett hål som syns i flera år.' },
      { text: 'SYNA BLUFFEN', griev: 6, temp: { stability: -2 }, ind: { stockcap: -4 }, next: ['pro_generalstrejk', 'pro_generalstrejk', null], tip: 'Ibland bluffar facken. Ibland gör de det inte.' },
    ],
  },
  {
    id: 'pro_generalstrejk', icon: '\u{1F6D1}', chain: true,
    title: 'GENERALSTREJK',
    text: 'Klockan sex i morse stannade landet. Bussar, tåg och färjor står still, fabrikerna är tysta, skolorna stängda och sjukhusen har skyddsbemanning. Två miljoner människor deltar. I {huvudstad} fylls gatorna av folk som inte har något annat att göra än att demonstrera, och de gör det med blåsorkestrar och termosar.',
    choices: [
      { text: 'FÖRHANDLA DYGNET RUNT', cost: { pp: 15 }, mod: 'general_strike', ind: { strikes: 60 }, next: ['pro_trepart', 'pro_gs_dag6'], tip: 'Ingen sover. Det är bäst så.' },
      { text: 'GE EFTER NU, INNAN SKADAN BLIR STOR', cost: { money: 1000, pp: 15 }, griev: -25, temp: { approval: 3, unrest: -8, income: -3 }, tip: 'Ett dyrt nederlag. Men bara en dags generalstrejk.' },
      { text: 'LÅT MILITÄREN HÅLLA IGÅNG SAMHÄLLET', mod: 'general_strike', temp: { unrest: 8, freedom: -4, approval: -6 }, griev: 12, ind: { demo: -0.3, trustgov: -6, strikes: 80 }, next: ['pro_gs_dag6', 'pro_eftersmak'], tip: 'Soldater kan köra bussar. De kan inte få folk att kliva på.' },
    ],
  },
  {
    id: 'pro_gs_dag6', icon: '\u{23F8}\u{FE0F}', chain: true,
    title: 'SJÄTTE DAGEN — LANDET STÅR STILL',
    text: 'Generalstrejken har pågått i sex dagar. Matbutikerna i {stad} har tomma hyllor, bensinstationerna är stängda och de stora exportföretagen har förlorat kontrakt till konkurrenter i {granne}. Varje dag kostar landet en bit av årets tillväxt. Strejkledarna säger att de kan hålla på i en månad.',
    choices: [
      { text: 'SKRIV UNDER FACKENS PROGRAM', cost: { money: 1200, pp: 20 }, griev: -28, unmod: 'general_strike', temp: { unrest: -10, income: -4 }, ind: { strikes: -60, gdpgrowth: -0.5 }, tip: 'Landet startar om. Det tar en månad innan allt rullar igen.' },
      { text: 'UTLYS NYVAL OCH LÅT FOLKET AVGÖRA', cost: { pp: 25 }, griev: -15, unmod: 'general_strike', temp: { stability: -6, approval: -2 }, ind: { turnout: 6, gdpgrowth: -0.4 }, tip: 'Strejken avbryts för valrörelsen. Du kan vinna. Eller inte.' },
      { text: 'HÅLL UT EN VECKA TILL', griev: 10, temp: { unrest: 8, factory: -6, approval: -6 }, ind: { gdpgrowth: -1, unemp: 0.4, trustgov: -5 }, next: 'pro_regeringskris', tip: 'Varje dag blir dyrare för alla. Också för dig.' },
    ],
  },
  {
    id: 'pro_trepart', icon: '\u{1F3F0}', chain: true,
    title: 'TREPARTSSAMTALEN PÅ SLOTTET',
    text: 'Fackledarna, arbetsgivarnas ordförande och tre ministrar har suttit inlåsta på ett gammalt slott utanför {huvudstad} i fyra dygn. Pressen campar vid grindarna. Läckor säger att man är nära ett stort samhällskontrakt: löner, pensioner, bostäder och arbetsfred i fem år. Det sista steget kräver att staten betalar.',
    choices: [
      { text: 'BETALA OCH SKRIV UNDER SAMHÄLLSKONTRAKTET', cost: { money: 900, pp: 15 }, griev: -30, mod: 'national_unity', unmod: 'general_strike', temp: { approval: 6, stability: 4 }, ind: { strikes: -70, trustgov: 6 }, tip: 'Fem år av arbetsfred. Det har ett pris, och det är värt det.' },
      { text: 'ETT MINDRE AVTAL OM BARA LÖNERNA', cost: { money: 400 }, griev: -14, unmod: 'general_strike', temp: { unrest: -5 }, ind: { strikes: -40 }, tip: 'Mindre, billigare och kortare. Nästa kris kommer tidigare.' },
      { text: 'LÄMNA SLOTTET OCH SKYLL PÅ FACKEN', griev: 12, temp: { unrest: 6, approval: -5 }, ind: { trustgov: -5, strikes: 50 }, next: ['pro_gs_dag6', null], tip: 'Grindarna öppnas. Kamerorna väntar.' },
    ],
  },
  {
    id: 'pro_kravall', icon: '\u{1F525}', weight: 2, cooldown: 1200,
    title: 'KRAVALLNATTEN I {STAD}',
    text: 'Det började när polisen grep en sjuttonåring utanför en pizzeria i {stad}. Ryktet att han skadats spred sig snabbare än sanningen, och vid midnatt brann bilar i tre stadsdelar. Ungdomar kastade sten mot brandkåren. Missnöjet har pyrt i månader, och arbetslösheten bland de unga i området är dubbelt så hög som i resten av landet.',
    when: (c) => c.griev >= 55 && c.st.unrest > 10 && (c.ind.youthunemp ?? 15) > 12,
    choices: [
      { text: 'SKICKA UT FÖRÄLDRAR, LEDARE OCH TRÄNARE PÅ GATORNA', cost: { pp: 8 }, griev: -6, temp: { unrest: -3 }, next: [null, 'pro_kravall_natt2'], tip: 'Vuxna i gula västar på varje gathörn. De gör mer än kravallpolisen.' },
      { text: 'INFÖR UTEGÅNGSFÖRBUD', temp: { unrest: -5, freedom: -4 }, griev: 8, ind: { demo: -0.1, policetrust: -3 }, next: ['pro_kravall_natt2', 'pro_eftersmak'], tip: 'Gatorna töms. Ilskan flyttar inomhus.' },
      { text: 'LÅT EN OBEROENDE UTREDARE GRANSKA GRIPANDET', cost: { pp: 12 }, griev: -8, ind: { policetrust: 2, trustgov: 2 }, next: 'pro_kravall_utredning', tip: 'Sanningen tar tid. Men den lugnar mer än tårgas.' },
    ],
  },
  {
    id: 'pro_kravall_natt2', icon: '\u{1F9F9}', chain: true,
    title: 'OROLIGHETERNA SPRIDS',
    text: 'Den andra natten spred sig oroligheterna till sex städer. En skola och två bibliotek har fått rutorna krossade, och brandkåren kräver polisskydd vid varje utryckning. Samtidigt gick tusentals boende i de drabbade områdena ut med sopsäckar och kvastar i morse för att städa. De vill inte att någon ska tro att de står bakom.',
    choices: [
      { text: 'SATSA STORT PÅ DE DRABBADE OMRÅDENA', cost: { money: 800 }, griev: -12, temp: { safety: 3, integration: 3 }, ind: { youthunemp: -0.5, segreg: -1 }, tip: 'Fritidsgårdar, sommarjobb och lärare. Det syns om fem år, inte i morgon.' },
      { text: 'SKICKA KRAVALLPOLIS TILL ALLA SEX STÄDERNA', cost: { money: 200 }, temp: { unrest: -6, safety: 2, freedom: -2 }, griev: 6, ind: { policetrust: -3, crimeidx: -3 }, next: ['pro_eftersmak', null], tip: 'Lugnt efter tre nätter. Ingenting är löst.' },
      { text: 'TACKA DEM SOM STÄDADE I ETT TAL TILL NATIONEN', griev: -5, temp: { stability: 2, approval: 3 }, tip: 'Kvastarna blir symbolen. Det är bättre än bränderna.' },
    ],
  },
  {
    id: 'pro_kravall_utredning', icon: '\u{1F4D1}', chain: true,
    title: 'UTREDNINGEN EFTER KRAVALLERNA',
    text: 'Utredaren har lagt fram sin rapport. Sjuttonåringen skadades inte, men gripandet var onödigt hårdhänt och förklarades aldrig för familjen. Rapporten pekar också på det som pyrt i åratal: inga jobb, inga fritidsgårdar och en polis som bara syns när något hänt. Familjen i {stad} har tagit emot rapporten och bett om lugn.',
    choices: [
      { text: 'GENOMFÖR ALLA REKOMMENDATIONER', cost: { money: 600, pp: 10 }, griev: -16, temp: { safety: 3, integration: 3 }, ind: { policetrust: 4, trustgov: 3 }, tip: 'Kvarterspoliser, fritidsgårdar och jobbprogram. Tråkigt och effektivt.' },
      { text: 'BE FAMILJEN OM URSÄKT OFFENTLIGT', cost: { pp: 5 }, griev: -7, temp: { unrest: -3 }, ind: { policetrust: 2 }, tip: 'En ursäkt till rätt människor i rätt tid.' },
      { text: 'LÄGG RAPPORTEN I EN LÅDA', griev: 8, temp: { unrest: 4 }, ind: { policetrust: -3, trustgov: -2 }, tip: 'Lådor har en förmåga att läcka.' },
    ],
  },
  {
    id: 'pro_hungerstrejk', icon: '\u{1F4A7}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'HUNGERSTREJKEN VID DOMSTOLEN',
    text: 'Tolv aktivister har inte ätit på tjugo dagar. De sitter på filtar utanför högsta domstolen i {huvudstad} och dricker bara vatten och te. Kraven gäller de rättigheter som inskränkts under året. Varje morgon kommer fler och sätter sig bredvid dem en dag i solidaritet. I går var de femhundra.',
    when: (c) => c.griev >= 55 && c.grievOf('frihet') > 18 && c.demo > 3,
    choices: [
      { text: 'TRÄFFA DEM OCH GÅ MED PÅ ETT AV KRAVEN', cost: { pp: 15 }, griev: -12, temp: { freedom: 2, approval: 3 }, ind: { demo: 0.1 }, tip: 'De äter. Du får behålla resten av dina lagar. För tillfället.' },
      { text: 'SKICKA LÄKARE OCH VÄNTA', cost: { money: 50 }, griev: 3, temp: { approval: -1 }, tip: 'Läkarna kollar deras blodtryck. Pressen kollar ditt.' },
      { text: 'TVÅNGSFÖR DEM TILL SJUKHUS', temp: { unrest: 5, freedom: -3 }, griev: 10, rel: -3, ind: { demo: -0.2, trustgov: -4 }, mod: 'martyr', tip: 'Tolv människor på bår. Femhundra på filtarna i morgon.' },
    ],
  },
  {
    id: 'pro_olydnad', icon: '\u{1F6B7}', weight: 2, cooldown: 1000,
    title: 'HUNDRATUSEN VÄGRAR LYDA',
    text: 'En rörelse för civil olydnad sveper över landet. Hundratusentals vägrar betala de nya avgifterna, fyller i blanketterna fel med flit och sätter sig på trottoarerna utanför myndigheterna varje tisdag. De bryter lagen öppet och tar sitt straff, och häktena i {stad} har redan slut på platser.',
    when: (c) => c.griev >= 60 && c.demo > 4 && c.grievOf('frihet') + c.grievOf('skatt') > 25,
    choices: [
      { text: 'TA BORT DET SOM RÖRELSEN PROTESTERAR MOT', cost: { pp: 25 }, griev: -20, temp: { approval: 4, statepower: -3 }, tip: 'Olydnaden vann. Också det är demokrati.' },
      { text: 'GE AMNESTI OCH BÖRJA FÖRHANDLA', cost: { pp: 12 }, griev: -10, temp: { unrest: -3 }, ind: { trustgov: 2 }, tip: 'De som satt inne kommer ut. De flesta går direkt till förhandlingsbordet.' },
      { text: 'DÖM ALLA ENLIGT LAGEN', temp: { statepower: 3, unrest: 4 }, griev: 10, ind: { demo: -0.2, trustgov: -4 }, next: 'pro_eftersmak', tip: 'Hundratusen domar. Domstolarna är upptagna i tio år.' },
    ],
  },
  {
    id: 'pro_misstroende', icon: '\u{1F3DB}\u{FE0F}', cooldown: 1200,
    title: 'MISSTROENDEFÖRKLARINGEN',
    text: 'Oppositionen har lämnat in en misstroendeförklaring mot regeringen, och för första gången ser den ut att kunna gå igenom. Missnöjet på gatorna har nått parlamentet: två ledamöter från ditt eget parti säger att de "överväger sin röst". Omröstningen är om tre dagar, och telefonerna på ditt kansli har inte slutat ringa.',
    when: (c) => c.griev >= 60 && c.demo > 6 && c.st.approval < 15,
    choices: [
      { text: 'RING VARJE TVEKSAM LEDAMOT PERSONLIGEN', cost: { pp: 20 }, temp: { polpower: -3 }, next: 'pro_votering', tip: 'Lovar du för mycket nu får du betala senare.' },
      { text: 'GÖR EN STOR ETTERGIFT TILL OPPOSITIONEN', cost: { money: 400, pp: 10 }, griev: -12, temp: { approval: 3, polpower: -4 }, tip: 'Oppositionen tar emot gåvan. Och tänker på nästa gång.' },
      { text: 'LÅT OMRÖSTNINGEN GÅ SOM DEN GÅR', griev: 2, temp: { stability: -2 }, next: 'pro_votering', tip: 'Demokrati är när man inte vet hur det går.' },
    ],
  },
  {
    id: 'pro_votering', icon: '\u{1F5F3}\u{FE0F}', chain: true,
    title: 'VOTERINGEN',
    text: 'Kammaren är fullsatt och läktarna också. Tv sänder direkt, och utanför parlamentet står fyrtiotusen människor och tittar på storbildsskärmar. Talmannen läser upp namnen ett efter ett. Det kommer att avgöras med en eller två röster, och ingen vet åt vilket håll.',
    choices: [
      { text: 'HÅLL ETT SISTA TAL I KAMMAREN', cost: { pp: 10 },
        risk: { chance: 0.5,
          win: { text: 'Talet vänder två röster. Regeringen överlever med en rösts marginal.', griev: -6, temp: { stability: 3, approval: 3 } },
          lose: { text: 'Talet ändrar ingenting. Misstroendet går igenom med två röster.', griev: -4, temp: { stability: -8, approval: -4, polpower: -6 }, ind: { trustgov: -3 } } } },
      { text: 'ERBJUD OPPOSITIONEN EN SAMLINGSREGERING', temp: { polpower: -3 }, griev: -6, next: 'pro_samlingsregering', tip: 'Den som var motståndare i går är kollega i morgon.' },
      { text: 'UPPLÖS PARLAMENTET OCH UTLYS NYVAL', cost: { pp: 20 }, griev: -12, temp: { stability: -5 }, ind: { turnout: 5 }, tip: 'Folket får avgöra. Det är vad gatan har krävt.' },
    ],
  },
  {
    id: 'pro_samlingsregering', icon: '\u{1F91D}', chain: true,
    title: 'SAMLINGSREGERINGEN',
    text: 'För första gången på femtio år sitter de största partierna i samma regering. Ministrarna kallar det "ett förnuftsäktenskap", och de första mötena sägs ha varit mycket tysta. Men på gatorna har det märkbart lugnat sig, och i {stad} har de sista demonstranterna rullat ihop sina banderoller.',
    choices: [
      { text: 'DELA MAKTEN PÅ RIKTIGT', cost: { pp: 20 }, griev: -18, mod: 'national_unity', temp: { stability: 5, polpower: -5 }, ind: { trustgov: 5 }, tip: 'Du bestämmer mindre. Landet sover bättre.' },
      { text: 'LÅT DEN SKÖTA KRISEN MEN BEHÅLL BUDGETEN', cost: { pp: 10 }, griev: -10, temp: { stability: 3 }, tip: 'En halv samling. Den håller ett år.' },
      { text: 'SPELA UT PARTNERNA MOT VARANDRA', temp: { polpower: 4, stability: -3 }, griev: 6, ind: { trustgov: -3 }, tip: 'Klokt på kort sikt. Alla märker det till slut.' },
    ],
  },
  {
    id: 'pro_regeringskris', icon: '\u{1F4A5}', chain: true,
    title: 'REGERINGEN SPRICKER',
    text: 'Kvart över tio i kväll meddelade regeringens största samarbetsparti att det lämnar koalitionen. "Vi kan inte längre försvara den här politiken inför väljarna", sa partiledaren på en presskonferens i {huvudstad}. Regeringen saknar nu majoritet i parlamentet, och tre ministrar har redan tömt sina skrivbord.',
    choices: [
      { text: 'BILDA EN MINORITETSREGERING', cost: { pp: 15 }, griev: -3, temp: { polpower: -5, stability: -3 }, tip: 'Varje lag blir en förhandling. Varje förhandling ett pris.' },
      { text: 'UTLYS NYVAL', cost: { pp: 10 }, griev: -12, temp: { stability: -6 }, ind: { turnout: 5, trustgov: 2 }, tip: 'Folket får säga sitt. Det är vad de har krävt på gatorna.' },
      { text: 'BJUD IN OPPOSITIONEN I EN SAMLINGSREGERING', griev: -5, temp: { polpower: -3 }, next: 'pro_samlingsregering', tip: 'Gårdagens motståndare är morgondagens kollegor.' },
    ],
  },
  {
    id: 'pro_minister_avgar', icon: '\u{1F4E4}', weight: 2, cooldown: 1000,
    title: 'MINISTERN AVGÅR I PROTEST',
    text: 'Din socialminister har lämnat in sin avskedsansökan med ett brev som publicerats i sin helhet på förstasidorna. "Jag kan inte längre företräda en politik som människorna på gatan så tydligt säger nej till", skriver hon. Hon är en av landets mest omtyckta politiker, och tre partier har redan ringt henne.',
    when: (c) => c.griev >= 60 && c.demo > 5 && c.day > 100,
    choices: [
      { text: 'BE HENNE STANNA OCH FORMA EN NY POLITIK', cost: { pp: 15 }, griev: -10, temp: { approval: 4, polpower: -3 }, tip: 'Hon stannar. Hon kommer att påminna dig om varför.' },
      { text: 'TACKA FÖR INSATSEN OCH UTSE EN EFTERTRÄDARE', cost: { pp: 5 }, griev: 3, temp: { stability: -2 }, tip: 'Efterträdaren är lojal. Det sägs om alla efterträdare.' },
      { text: 'SÄG ATT HON HAR SVIKIT REGERINGEN', griev: 6, temp: { approval: -5, stability: -3 }, ind: { trustgov: -4 }, next: ['pro_regeringskris', null], tip: 'Hon har fler följare än du. Det kommer du att märka.' },
    ],
  },

  // ===== LANDET STÅR STILL (missnöje 80+) =====
  {
    id: 'pro_stilla', icon: '\u{1F6A8}', cooldown: 1500,
    title: 'LANDET STÅR STILL',
    text: 'Ingenting fungerar längre som det ska. Strejkerna går in i varandra, demonstrationerna avlöser varandra dag och natt och de flesta myndigheter har stängt. I {huvudstad} byter folk mat med varandra på torgen. Utländska företag evakuerar sin personal, och ambassaderna ber sina medborgare stanna inomhus.',
    when: (c) => c.griev >= 85 && c.st.unrest > 15 && c.day > 100,
    choices: [
      { text: 'BILDA EN NATIONELL SAMLINGSREGERING', cost: { pp: 40 }, griev: -25, mod: 'national_unity', temp: { stability: 6, polpower: -8 }, ind: { trustgov: 6 }, tip: 'Alla partier i samma båt. Den måste ro åt samma håll.' },
      { text: 'GE EFTER PÅ ALLT SOM GÅR ATT GE EFTER PÅ', cost: { money: 1500, pp: 20 }, griev: -35, temp: { income: -6, unrest: -10 }, tip: 'Kassan töms. Landet startar. Det tar ett år att betala.' },
      { text: 'INFÖR UNDANTAGSTILLSTÅND', law: ['civil_rights', 'emergency'], temp: { unrest: -8, freedom: -8, statepower: 6 }, griev: 12, rel: -8, ind: { demo: -0.8, trustgov: -8 }, next: 'pro_eftersmak', tip: 'Det blir tyst. Det är inte samma sak som lugnt.' },
    ],
  },
  {
    id: 'pro_miljonen', icon: '\u{1F4F1}', cooldown: 1500,
    title: 'EN MILJON I {HUVUDSTAD}',
    text: 'Det är den största demonstrationen i landets historia. En miljon människor fyller varje gata, bro och park i {huvudstad}, och tåget tar aldrig slut. Inga stenar, inga bränder, bara en enorm tyst massa med tända mobiler. Den enda parollen är ditt namn, med ordet "avgå" efter.',
    when: (c) => c.griev >= 80 && c.demo > 5 && c.st.approval < 10,
    choices: [
      { text: 'MÖT FOLKET PÅ TORGET OCH LOVA NYVAL', cost: { pp: 30 }, griev: -25, rel: 5, temp: { stability: -5, unrest: -10 }, ind: { trustgov: 5, turnout: 8 }, tip: 'Du kan förlora makten. Landet vinner tillbaka sig självt.' },
      { text: 'BYT UT HALVA REGERINGEN', cost: { pp: 20 }, griev: -12, temp: { approval: 4, polpower: -4 }, tip: 'Nya ansikten. Samma politik? Det avgörs nästa vecka.' },
      { text: 'TALA OM ATT ETT LAND INTE STYRS FRÅN GATAN', griev: 12, temp: { unrest: 8, approval: -8 }, ind: { trustgov: -8 }, next: ['pro_regeringskris', null], tip: 'En miljon människor hör talet. Ingen av dem går hem.' },
    ],
  },
  {
    id: 'pro_undantag', icon: '\u{1FA96}', cooldown: 1500,
    title: 'GENERALERNA VILL HA UNDANTAGSTILLSTÅND',
    text: 'Överbefälhavaren har begärt ett möte i kväll. Med sig har hon två generaler och en färdigskriven förordning om undantagstillstånd: utegångsförbud, förbud mot sammankomster och militär i städerna. Landet håller på att gå sönder, säger hon. Det kan vara sant. Det kan också vara början på något annat.',
    when: (c) => c.griev >= 80 && c.st.stability < 5 && c.st.unrest > 10,
    choices: [
      { text: 'AVVISA FÖRSLAGET OCH TALA TILL NATIONEN', cost: { pp: 20 }, griev: -8, temp: { stability: -3, approval: 4 }, perm: { freedom: 1 }, ind: { trustgov: 3 }, tip: 'Demokratin klarade natten. Generalerna gick hem, lite förvånade.' },
      { text: 'SKRIV UNDER, MEN BARA FÖR TRETTIO DAGAR', law: ['civil_rights', 'emergency'], temp: { unrest: -10, freedom: -6, statepower: 5 }, griev: 10, rel: -6, ind: { demo: -0.6, trustgov: -5 }, next: 'pro_eftersmak', tip: 'Trettio dagar blir ofta trettio månader.' },
      { text: 'GE MILITÄREN FRIA HÄNDER', law: ['civil_rights', 'verylimited'], temp: { unrest: -14, freedom: -12, statepower: 10 }, griev: 18, rel: -15, ind: { demo: -1.2, trustgov: -10 }, next: 'pro_omvarlden', tip: 'Du har räddat ordningen. Frågan är vem som har den nu.' },
    ],
  },

  // ===== UNDER JORDEN (auktoritära stater) =====
  {
    id: 'pro_flygblad', icon: '\u{1F4C3}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'FLYGBLADEN I TRAPPUPPGÅNGARNA',
    text: 'Varje morgon i en vecka har det legat flygblad i trappuppgångarna i {stad}. De är tryckta på en gammal stencilapparat, osignerade, och innehåller samma sak: priser, löner och namnen på dem som gripits det senaste året. Folk läser dem snabbt, viker ihop dem och stoppar dem i fickan. Ingen slänger dem.',
    when: (c) => c.demo < 4 && c.griev >= 15,
    choices: [
      { text: 'LÅT DET VARA — DET ÄR BARA PAPPER', griev: -2, temp: { statepower: -2 }, next: [null, 'pro_hemlig_strejk'], tip: 'Papper har fällt fler regimer än kanoner.' },
      { text: 'LETA REDA PÅ TRYCKERIET', cost: { pp: 8 }, griev: 5, temp: { statepower: 3, freedom: -2 }, ind: { demo: -0.1 }, next: ['pro_hemlig_strejk', 'pro_gryningsrad'], tip: 'En stencilapparat är lätt att gömma. Och lätt att ersätta.' },
      { text: 'LÄS DEM OCH ÄNDRA NÅGOT AV DET SOM STÅR', cost: { money: 200 }, griev: -8, temp: { approval: 3 }, tip: 'Ett tyst svar på en tyst protest. Folk märker det.' },
    ],
  },
  {
    id: 'pro_hemlig_strejk', icon: '\u{1F40C}', chain: true, kind: 'frihet',
    title: 'STREJKEN SOM INGEN FÅR NÄMNA',
    text: 'Strejker är förbjudna, men i fabrikerna i {stad} går maskinerna allt långsammare. Arbetarna kommer i tid, sitter vid sina platser och arbetar i halv takt. Produktionen har fallit en tredjedel på en månad. Ingen säger ordet strejk, och ingen behöver göra det. Statstelevisionen har inte nämnt saken med ett ord.',
    choices: [
      { text: 'HÖJ LÖNERNA I TYSTHET', cost: { money: 400 }, griev: -10, temp: { factory: 3 }, tip: 'Maskinerna går fortare igen. Ingen säger varför.' },
      { text: 'GRIP DE MISSTÄNKTA LEDARNA', griev: 10, temp: { factory: 1, statepower: 3, freedom: -3 }, ind: { demo: -0.2 }, next: ['pro_gryningsrad', 'pro_exilkongress'], tip: 'Varje gripen ledare har en efterträdare.' },
      { text: 'BJUD IN ARBETARNAS FÖRTROENDEMÄN TILL SAMTAL', cost: { pp: 12 }, griev: -8, temp: { factory: 2 }, perm: { freedom: 1 }, tip: 'Det första samtalet på trettio år mellan staten och dem som jobbar.' },
    ],
  },
  {
    id: 'pro_gryningsrad', icon: '\u{1F319}', chain: true, kind: 'frihet',
    title: 'GRYNINGSRÄDEN',
    text: 'Klockan fem i morse slog säkerhetspolisen till mot tjugo adresser i {stad}. Trettio personer greps, bland dem en lärare, en pensionerad journalist och två studenter. En stencilapparat bars ut i en plastsäck inför grannarnas ögon. På kvällen kom nya flygblad, med de gripnas namn och fotografier.',
    choices: [
      { text: 'VISA RÄTTEGÅNGARNA I TV', griev: 10, rel: -6, temp: { statepower: 4, freedom: -4 }, ind: { demo: -0.3 }, next: ['pro_omvarlden', null], tip: 'Tittarna ser de anklagade. De ser också hur unga de är.' },
      { text: 'SLÄPP DE FLESTA MED EN VARNING', cost: { pp: 8 }, griev: -4, temp: { statepower: -1 }, tip: 'Vissa kallar det svaghet. Andra kallar det nåd.' },
      { text: 'FÖRVISA LEDARNA TILL {GRANNE}', cost: { pp: 5 }, griev: 3, rel: -3, temp: { statepower: 2 }, next: 'pro_exilkongress', tip: 'Ut ur landet, ut ur tankarna. Det fungerar sällan.' },
    ],
  },
  {
    id: 'pro_exilkongress', icon: '\u{1F4FB}', chain: true, kind: 'frihet',
    title: 'EXILKONGRESSEN I {GRANNE}',
    text: 'I en konferenssal i {granne} har trehundra landsflyktiga samlats till kongress. De har valt en exilregering, antagit ett program och startat en radiostation som sänder över gränsen varje kväll. Längst applåder fick en åttioårig poet som suttit fängslad i tre år. Hemma hör man om kongressen via kortvåg.',
    choices: [
      { text: 'BJUD IN EXILLEDARNA TILL SAMTAL', cost: { pp: 20 }, griev: -14, rel: 8, temp: { statepower: -3 }, ind: { demo: 0.3 }, tip: 'Ett samtal är ingen kapitulation. Det är ett första steg.' },
      { text: 'STÖR RADIOSÄNDNINGARNA', cost: { money: 200 }, griev: 5, temp: { statepower: 2 }, ind: { pressfree: -2 }, tip: 'Störsändarna tjuter. Folk köper bättre antenner.' },
      { text: 'KRÄV ATT {GRANNE} UTVISAR DEM', rel: -8, griev: 4, temp: { statepower: 2, ideopower: 2 }, tip: 'Grannlandet vägrar. Kongressen blir ännu mer omtalad.' },
    ],
  },
  {
    id: 'pro_ljus', icon: '\u{1F56F}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'LJUS I FÖNSTREN',
    text: 'Ingen vet vem som började. Men i kväll klockan nio stod ett tänt ljus i vartannat fönster i {huvudstad}. Det är inte förbjudet att tända ljus, och inte att stå vid sitt fönster. Polisen har kört runt i kvarteren hela kvällen utan att veta vad den ska göra, och i morgon kväll blir det fler ljus.',
    when: (c) => c.demo < 4 && c.griev >= 20,
    choices: [
      { text: 'TÄND ETT LJUS I DITT EGET FÖNSTER', cost: { pp: 10 },
        risk: { chance: 0.5,
          win: { text: 'Gesten tolkas som att du lyssnar. Ljusen får en ny betydelse.', griev: -10, temp: { approval: 5 } },
          lose: { text: 'Folk ser det som hån. Nästa kväll brinner dubbelt så många ljus.', griev: 5, temp: { approval: -3 } } } },
      { text: 'FÖRBJUD LJUS I FÖNSTREN EFTER KLOCKAN NIO', griev: 8, rel: -4, temp: { statepower: 2, freedom: -3 }, ind: { demo: -0.1 }, tip: 'Förbudet blir världens mest citerade lag i en vecka.' },
      { text: 'SLÄPP NÅGRA POLITISKA FÅNGAR', cost: { pp: 12 }, griev: -8, rel: 4, temp: { freedom: 2 }, ind: { demo: 0.1 }, tip: 'Ljusen slocknar inte. Men de fladdrar lite mindre argt.' },
    ],
  },
  {
    id: 'pro_begravning', icon: '\u{26B0}\u{FE0F}', cooldown: 1500, kind: 'frihet',
    title: 'BEGRAVNINGEN SOM BLEV EN DEMONSTRATION',
    text: 'Landets mest kända poet, som suttit i husarrest i tio år, dog i fredags. I dag följde hundratusen människor kistan genom {huvudstad}. Ingen bar skyltar och ingen ropade slagord. Men när kistan passerade regeringsbyggnaden stannade alla, vände sig om och stod tysta i fem minuter. Det har aldrig hänt förut.',
    when: (c) => c.demo < 4 && c.griev >= 35 && c.day > 120,
    choices: [
      { text: 'GÅ SJÄLV PÅ BEGRAVNINGEN', cost: { pp: 15 },
        risk: { chance: 0.4,
          win: { text: 'Folk tolkar det som en försoning, den första på årtionden.', griev: -14, temp: { approval: 5 }, ind: { demo: 0.2 } },
          lose: { text: 'Folk vänder dig ryggen, bokstavligen. Bilden går ut i hela världen.', griev: 6, rel: -3, temp: { approval: -5 } } } },
      { text: 'LÅT BEGRAVNINGEN PASSERA I FRED', griev: -3, temp: { statepower: -2 }, tip: 'Att hålla tillbaka är också ett beslut. Ett svårt sådant.' },
      { text: 'STOPPA TÅGET VID REGERINGSBYGGNADEN', griev: 14, temp: { unrest: 8, statepower: 3, freedom: -4 }, ind: { demo: -0.3 }, mod: 'martyr', next: 'pro_omvarlden', tip: 'Poeten blir en martyr. Det var hon kanske redan.' },
    ],
  },
  {
    id: 'pro_modrarna', icon: '\u{1F469}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'MÖDRARNA PÅ TORGET',
    text: 'Varje torsdag klockan tre går ett trettiotal kvinnor i vita sjalar långsamt runt torget framför regeringsbyggnaden i {huvudstad}. De säger ingenting. Var och en bär ett fotografi av en son eller dotter som sitter fängslad av politiska skäl. Det har pågått i två år, och varje torsdag är de några fler.',
    when: (c) => c.demo < 4 && (c.ind.polprisoners ?? 100) > 300 && c.griev >= 15,
    choices: [
      { text: 'TA EMOT MÖDRARNA OCH GRANSKA FALLEN', cost: { pp: 15 }, griev: -12, rel: 6, temp: { freedom: 2 }, ind: { demo: 0.2 }, tip: 'Varje frigiven son är en mor som slutar gå runt torget.' },
      { text: 'SLÄPP DE ÄLDSTA OCH SJUKASTE FÅNGARNA', cost: { pp: 8 }, griev: -6, rel: 3, temp: { approval: 2 }, tip: 'En gest. Mödrarna fortsätter gå, med lite lättare steg.' },
      { text: 'SPÄRRA AV TORGET PÅ TORSDAGAR', griev: 8, rel: -6, temp: { statepower: 2, freedom: -3 }, ind: { demo: -0.1 }, next: ['pro_omvarlden', null], tip: 'De går runt avspärrningen i stället. Det ser ännu värre ut.' },
    ],
  },
  {
    id: 'pro_rostraknare', icon: '\u{1F9EE}', cooldown: 1200, kind: 'frihet',
    title: 'RÖSTRÄKNARNA SOM SA NEJ',
    text: 'I {stad} har fyrtio röstmottagare vägrat skriva under protokollet från valet. De säger att antalet röster på regeringspartiet inte stämmer med hur många väljare som faktiskt kom till vallokalerna. Lokaltidningen har publicerat deras uttalande med namn och bild. Det kräver mod i ett land som ditt.',
    when: (c) => c.demo >= 3 && c.demo < 6 && c.grievOf('frihet') > 10,
    choices: [
      { text: 'BESTÄLL EN OBEROENDE OMRÄKNING', cost: { pp: 15 }, griev: -12, rel: 5, ind: { demo: 0.3, trustgov: 3 }, tip: 'Stämmer siffrorna har du vunnit. Stämmer de inte har landet vunnit.' },
      { text: 'TACKA DEM OCH BYT UT DEM TILL NÄSTA VAL', griev: 5, temp: { statepower: 2 }, ind: { demo: -0.1 }, tip: 'Nästa omgång röstmottagare har sett vad som hände med de förra.' },
      { text: 'ÅTALA DEM FÖR ATT HA SPRIDIT FALSKA UPPGIFTER', griev: 10, rel: -6, temp: { statepower: 3, freedom: -3 }, ind: { demo: -0.3, trustgov: -4 }, next: ['pro_omvarlden', 'pro_eftersmak'], tip: 'Fyrtio vanliga människor åtalade. Hela landet lär sig deras namn.' },
    ],
  },

  // ===== POLISEN, MEDLARNA OCH FÖRHANDLINGARNA (demokratier) =====
  {
    id: 'pro_polistaktik', icon: '\u{1F46E}', weight: 2, cooldown: 1200,
    title: 'POLISCHEFEN VILL HA NY TAKTIK',
    text: 'Efter ett år med fler demonstrationer än någonsin har rikspolischefen lagt fram två förslag. Det ena: dialogpoliser i blå västar som pratar med arrangörerna före och under varje demonstration. Det andra: fler kravallpoliser, vattenkanoner och snabbare gripanden. Hon säger att båda fungerar, men på olika sätt.',
    when: (c) => c.demo > 6 && (c.ind.protests ?? 200) > 800 && c.griev >= 25,
    choices: [
      { text: 'SATSA PÅ DIALOGPOLISER', cost: { money: 200 }, griev: -6, temp: { safety: 1, freedom: 1 }, ind: { policetrust: 4, protests: -10 }, tip: 'Långsamt och tålmodigt. Kravallerna blir färre, demonstrationerna inte.' },
      { text: 'SATSA PÅ KRAVALLPOLIS OCH VATTENKANONER', cost: { money: 300 }, griev: 5, temp: { safety: 2, freedom: -2, unrest: -3 }, ind: { policetrust: -3 }, tip: 'Effektivt på kort sikt. Vattenkanoner gör sig dåligt i tv.' },
      { text: 'KROPPSKAMEROR PÅ ALLA POLISER', cost: { money: 100 }, griev: -4, ind: { policetrust: 3, trustgov: 1 }, tip: 'Alla beter sig bättre när någon filmar. Även demonstranterna.' },
      { text: 'LÅT VARJE POLISREGION BESTÄMMA SJÄLV', griev: 2, temp: { safety: -1 }, ind: { policetrust: -1 }, tip: 'Tjugo regioner, tjugo taktiker. Demonstranterna lär sig snabbt skillnaden.' },
    ],
  },
  {
    id: 'pro_riksmedlare', icon: '\u{2696}\u{FE0F}', weight: 2, cooldown: 1200,
    title: 'RIKSMEDLAREN RINGER',
    text: 'Strejkdagarna är fler än på trettio år, och riksmedlaren har bett om ett möte. Hon föreslår en samordnad förhandling där alla avtal görs på en gång, med ett gemensamt märke för löneökningarna. Facken är intresserade. Arbetsgivarna också. Det som saknas är att staten lovar att ta notan för det som inte går ihop.',
    when: (c) => c.demo > 6 && ((c.ind.strikes ?? 50) > 90 || c.mod('general_strike')) && c.griev >= 25,
    choices: [
      { text: 'STÖD FÖRSLAGET MED STATLIGA PENGAR', cost: { money: 600 }, griev: -14, temp: { stability: 3 }, ind: { strikes: -50 }, tip: 'Ett gemensamt märke för hela landet. Det har fungerat förr.' },
      { text: 'STÖD FÖRSLAGET UTAN PENGAR', cost: { pp: 10 },
        risk: { chance: 0.5,
          win: { text: 'Parterna enas ändå. Ingen vill vara den som sa nej.', griev: -10, ind: { strikes: -40 } },
          lose: { text: 'Utan pengar faller förslaget. Strejkerna fortsätter.', griev: 4, ind: { strikes: 20 } } } },
      { text: 'LÅT VARJE BRANSCH FÖRHANDLA SJÄLV', griev: 3, temp: { factory: -1 }, ind: { strikes: 20 }, tip: 'Frihet för parterna. Och en lång höst.' },
    ],
  },
  {
    id: 'pro_folkomrostning', icon: '\u{1F5F3}\u{FE0F}', cooldown: 1200, kind: 'valfard', react: true,
    title: 'FOLKOMRÖSTNING OM {LAG}?',
    text: 'Missnöjet efter beslutet om {lag} har gett en namninsamling med en halv miljon underskrifter som kräver folkomröstning. Grundlagen kräver det inte, men oppositionen och flera tidningar gör det. Mätningarna visar att frågan kan gå åt båda hållen. Det är ovanligt att en regering frivilligt låter folket avgöra.',
    when: (c) => c.cut('welfare', 'healthcare', 'pensions', 'retirement_age', 'education', 'housing', 'unions') && c.demo > 6 && c.grievOf('valfard') > 8,
    choices: [
      { text: 'UTLYS FOLKOMRÖSTNINGEN', cost: { money: 200 },
        risk: { chance: 0.5,
          win: { text: 'Folket röstar för regeringens linje. Beslutet har nu folkets stöd.', griev: -16, temp: { stability: 3 }, ind: { trustgov: 4, turnout: 3 } },
          lose: { text: 'Folket röstar nej. Beslutet rivs, och du får backa offentligt.', undo: true, griev: -18, temp: { approval: -3 }, ind: { trustgov: 2 } } } },
      { text: 'BACKA {LAG} I STÄLLET', cost: { pp: 15 }, undo: true, griev: -14, temp: { approval: 2 }, tip: 'Ingen folkomröstning behövs om frågan försvinner.' },
      { text: 'SÄG NEJ — PARLAMENTET HAR BESLUTAT', griev: 6, temp: { approval: -3 }, ind: { trustgov: -2 }, tip: 'Formellt helt rätt. Det säger alla regeringar.' },
    ],
  },

  // ===== NÄR MISSNÖJET LÄGGER SIG =====
  {
    id: 'pro_tackdemo', icon: '\u{1F338}', weight: 2, cooldown: 1200,
    title: 'TACKDEMONSTRATIONEN',
    text: 'Det har varit ett lugnt år. Missnöjet som fyllde gatorna har lagt sig, och i dag hände något ovanligt: ett par tusen människor samlades på torget i {stad}, inte för att protestera utan för att tacka. Sjuksköterskor, pensionärer och lokförare som demonstrerade förra året stod på samma scen. Det var mest kaffe och bullar.',
    when: (c) => c.griev < 20 && (c.trend('griev') < -8 || c.mod('civil_peace') || c.mod('national_unity')) && c.demo > 4,
    choices: [
      { text: 'GÅ DIT OCH TACKA TILLBAKA', cost: { pp: 5 }, temp: { approval: 5, stability: 2 }, ind: { trustgov: 3 }, tip: 'En sällsynt dag. Njut av den.' },
      { text: 'BJUD PÅ KAFFE OCH BULLAR', cost: { money: 50 }, griev: -3, temp: { approval: 3, qol: 1 }, tip: 'Årets billigaste politiska seger.' },
      { text: 'SKICKA ETT VARMT TACKBREV', griev: -2, temp: { approval: 2 }, tip: 'Brevet läses upp från scenen. Det blir applåder.' },
    ],
  },
  {
    id: 'pro_overenskommelse', icon: '\u{1F58B}\u{FE0F}', cooldown: 1500,
    title: 'DEN STORA ÖVERENSKOMMELSEN',
    text: 'Efter strejkerna och protesterna har facken och arbetsgivarna gjort något historiskt. På ett hotell i {stad} har de skrivit under en överenskommelse om hur konflikter ska lösas i framtiden: förhandling först, medlare sedan, strejk sist. Nu vill de att regeringen ska stå som garant för avtalet.',
    when: (c) => c.griev < 25 && (c.trend('griev') < -8 || c.mod('national_unity') || c.mod('civil_peace')) && ((c.ind.unionrate ?? 30) > 10 || c.is('unions', 'mandatory', 'ghent', 'strong', 'codetermination')),
    choices: [
      { text: 'STÅ SOM GARANT OCH BYGG ETT MEDLINGSINSTITUT', cost: { money: 200, pp: 10 }, griev: -8, temp: { stability: 3 }, perm: { stability: 1 }, ind: { strikes: -40 }, tip: 'Arbetsfred i en generation, kanske. Historikerna kommer att skriva om det.' },
      { text: 'GRATULERA PARTERNA', griev: -3, temp: { approval: 2, stability: 1 }, ind: { strikes: -20 }, tip: 'Det är deras avtal. Det är det som gör det starkt.' },
      { text: 'KRÄV ATT STATEN FÅR SISTA ORDET', cost: { pp: 5 }, griev: 3, temp: { statepower: 2 }, ind: { trustgov: -1 }, tip: 'Parterna skriver under ändå. Men utan dig.' },
    ],
  },
  {
    id: 'pro_blommor_vard', icon: '\u{1F490}', cooldown: 900, kind: 'valfard', react: true,
    title: 'BLOMMOR TILL VÅRDCENTRALEN',
    text: 'Sedan ändringen av {lag} har köerna på vårdcentralen i {stad} krympt för första gången på åratal. Personalen har fått blommor, tackkort och en tårta från pensionärsföreningen. En distriktssköterska säger i lokalradion att hon för första gången på länge har tid att prata med sina patienter.',
    when: (c) => c.raised('healthcare', 'healthcare_quality', 'welfare', 'pensions', 'childcare') && c.grievOf('valfard') < 25,
    choices: [
      { text: 'BESÖK VÅRDCENTRALEN', cost: { pp: 4 }, griev: -5, temp: { approval: 4 }, ind: { trustgov: 2 }, tip: 'Ett foto med tårtan. Sköterskan har bättre saker för sig, men hon ler.' },
      { text: 'BYGG VIDARE PÅ REFORMEN', cost: { money: 400 }, griev: -8, temp: { welfare: 2, qol: 1 }, tip: 'Det som fungerar ska man göra mer av.' },
      { text: 'TACKA PERSONALEN I ETT TAL', griev: -3, temp: { approval: 2 }, tip: 'Tacket når fram. Tårtan är redan uppäten.' },
    ],
  },
  {
    id: 'pro_pressfest', icon: '\u{1F3C6}', cooldown: 1200, kind: 'frihet', react: true,
    title: 'PRESSFRIHETENS DAG',
    text: 'Efter beslutet om {lag} har landet klättrat på de internationella listorna över fria medier, och i dag firar journalistförbundet med en fest i {huvudstad}. Grävande reportrar som tidigare hotats berättar om sitt arbete, och en internationell organisation delar ut ett pris till landet. Även oppositionen applåderar.',
    when: (c) => c.raised('press', 'speech', 'internet', 'protest', 'civil_rights') && c.demo > 4,
    choices: [
      { text: 'TA EMOT PRISET MED ETT TAL OM FRIHET', cost: { pp: 5 }, griev: -4, rel: 4, temp: { approval: 3, freedom: 2 }, ind: { pressfree: 2 }, tip: 'Talet citeras i hela världen. Även de självkritiska delarna.' },
      { text: 'LÅT JOURNALISTERNA TA EMOT PRISET SJÄLVA', griev: -5, rel: 3, temp: { freedom: 1 }, ind: { trustgov: 2 }, tip: 'Klokt. Ett pris för pressfrihet ska inte tas emot av makten.' },
      { text: 'INRÄTTA ETT STÖD TILL LOKAL JOURNALISTIK', cost: { money: 200 }, griev: -6, perm: { freedom: 1 }, ind: { pressfree: 3 }, tip: 'Lokaltidningar är demokratins vardagsrum.' },
    ],
  },
  {
    id: 'pro_skattesankning', icon: '\u{1F950}', cooldown: 1000, kind: 'skatt', react: true,
    title: 'SKATTESÄNKNINGEN SOM MÄRKS',
    text: 'Ändringen av {lag} syns nu på lönebeskeden, och för många familjer blir det några hundralappar mer i månaden. I {stad} har en bagare satt upp en skylt: "Tack för sänkningen. Kanelbullarna är billigare i dag." Ekonomerna varnar för hålet i budgeten. Folket är för tillfället mest nöjt.',
    when: (c) => c.raised('taxes', 'corporate_tax', 'inheritance_tax', 'price_controls') && c.grievOf('skatt') < 20,
    choices: [
      { text: 'KÖP EN KANELBULLE AV BAGAREN', cost: { money: 5 }, griev: -4, temp: { approval: 3 }, tip: 'Årets billigaste pressbild. Kanelbullen var god.' },
      { text: 'LÄGG UNDAN EN DEL I EN BUFFERT', cost: { pp: 8 }, griev: -2, temp: { stability: 2, income: 2 }, tip: 'Ekonomerna slutar varna. Lite grann.' },
      { text: 'LOVA FLER SÄNKNINGAR', griev: -5, temp: { approval: 3, income: -2 }, tip: 'Löften är lätta att ge. Svårare att betala.' },
    ],
  },
  {
    id: 'pro_tradplantering', icon: '\u{1F331}', cooldown: 1000, kind: 'miljo', react: true,
    title: 'BARNEN SOM PLANTERADE EN SKOG',
    text: 'Efter beslutet om {lag} har landets skolor tagit saken i egna händer. I helgen planterade hundratusen skolbarn och deras föräldrar en miljon träd på gamla kalhyggen runt {stad}. En femtonåring som brukar skolstrejka för klimatet höll ett kort tal och tackade för att någon äntligen lyssnat.',
    when: (c) => c.raised('environment', 'energy', 'forestry', 'transport') && c.grievOf('miljo') < 20,
    choices: [
      { text: 'PLANTERA ETT TRÄD MED DEM', cost: { pp: 4 }, griev: -5, temp: { approval: 4 }, tip: 'Spaden är tyngre än du trodde. Bilden blir fin ändå.' },
      { text: 'GE VARJE SKOLA EN EGEN SKOGSDUNGE', cost: { money: 200 }, griev: -6, perm: { qol: 1 }, temp: { approval: 2 }, tip: 'Om trettio år går barnbarnen i skolans skog.' },
      { text: 'SKICKA EN HÄLSNING', griev: -2, temp: { approval: 1 }, tip: 'En hälsning är fin. En spade hade varit finare.' },
    ],
  },
  {
    id: 'pro_forsoningsfest', icon: '\u{1F389}', cooldown: 1200,
    title: 'FÖRSONINGSFESTEN I {STAD}',
    text: 'Ett år efter oroligheterna har {stad} ordnat en fest för hela staden. På torget där det var avspärrningar och tårgas står nu långbord, och de som demonstrerade mot varandra delar på maten. Polisen spelar fotboll mot ungdomarna från området. Polisen förlorade med fyra mål, och ingen klagade.',
    when: (c) => c.griev < 25 && (c.trend('griev') < -8 || c.mod('civil_peace') || c.mod('national_unity')) && c.st.unrest < 10,
    choices: [
      { text: 'KOM SJÄLV OCH SÄTT DIG VID LÅNGBORDET', cost: { pp: 5 }, griev: -4, temp: { approval: 4, stability: 2 }, ind: { policetrust: 2 }, tip: 'Inga tal, inga kameror. Bara du, en tallrik och en lång kväll.' },
      { text: 'GÖR FESTEN TILL EN ÅRLIG HÖGTID', cost: { money: 150 }, griev: -5, temp: { stability: 2 }, perm: { stability: 1 }, tip: 'En ny tradition. Fotbollsmatchen blir det viktigaste.' },
      { text: 'SKICKA EN MINISTER', griev: -2, temp: { approval: 1 }, tip: 'Ministern förlorar en straffläggning mot en tolvåring.' },
    ],
  },
  {
    id: 'pro_tovader', icon: '\u{2600}\u{FE0F}', cooldown: 1200,
    title: 'TÖVÄDER',
    text: 'Något har förändrats. Pressen skriver lite friare, ett par politiska fångar har släppts och för första gången på flera år fick en demonstration i {stad} pågå utan att polisen ingrep. Folk pratar öppnare på kaféerna. Det är inte demokrati än, men det är något, och omvärlden har lagt märke till det.',
    when: (c) => c.demo < 5 && c.trend('demo') > 0.15 && c.griev < 45,
    choices: [
      { text: 'FORTSÄTT ÖPPNA UPP', cost: { pp: 15 }, griev: -10, rel: 6, perm: { freedom: 1 }, ind: { demo: 0.3, pressfree: 2 }, tip: 'Öppnade dörrar är svåra att stänga. Det är både faran och poängen.' },
      { text: 'BEHÅLL DET SOM DET ÄR NU', griev: -2, rel: 2, temp: { stability: 2 }, tip: 'Ett halvöppet fönster. Det drar lite.' },
      { text: 'STRAMA ÅT IGEN INNAN DET GÅR FÖR LÅNGT', griev: 10, rel: -6, temp: { statepower: 3, freedom: -3 }, ind: { demo: -0.3 }, next: ['pro_eftersmak', null], tip: 'Tövädret blir köldknäpp. Folk minns hur våren kändes.' },
    ],
  },
  {
    id: 'pro_fotbollslaget', icon: '\u{26BD}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'FOTBOLLSLAGET SOM ENADE {STAD}',
    text: 'Lokallaget i {stad} har elva nationaliteter i truppen, och i söndags vann det cupfinalen på straffar. Halva staden firade på torget, med flaggor från alla håll. Målvakten, som kom hit som tolvåring och lärde sig språket på en fritidsgård, säger i tv att laget är "det bästa integrationsprogram som finns".',
    when: (c) => c.migRate > 0.5 && c.st.integration > 5 && c.grievOf('migration') < 15,
    choices: [
      { text: 'BJUD IN LAGET TILL EN MOTTAGNING', cost: { pp: 4 }, griev: -4, temp: { approval: 3, integration: 2 }, ind: { xenophobia: -1 }, tip: 'Målvakten håller ett tal. Det är bättre än ditt.' },
      { text: 'SATSA PÅ FÖRENINGSLIVET I HELA LANDET', cost: { money: 300 }, griev: -6, temp: { integration: 3, qol: 1 }, ind: { segreg: -1 }, tip: 'Bollplaner, tränare och matchställ. Billigt och effektivt.' },
      { text: 'GRATULERA I SOCIALA MEDIER', griev: -2, temp: { approval: 1, integration: 1 }, tip: 'Klicket tar en sekund. Laget har tränat i tio år.' },
    ],
  },
  {
    id: 'pro_valdeltagande', icon: '\u{1F5F3}\u{FE0F}', cooldown: 1200,
    title: 'REKORDHÖGT VALDELTAGANDE',
    text: 'Ilskan från protesterna har hittat en ny väg. I lokalvalen röstade fler än någonsin, och i {stad} ringlade köerna till vallokalerna ut på trottoaren. Unga som aldrig röstat förut säger att demonstrationerna fick dem att förstå att det spelar roll. Partierna har fått tusentals nya medlemmar.',
    when: (c) => c.demo > 6 && c.griev < 40 && (c.trend('griev') < -6 || c.mod('national_unity')),
    choices: [
      { text: 'BJUD IN DE NYA VÄLJARNA TILL MEDBORGARDIALOGER', cost: { pp: 8 }, griev: -6, temp: { approval: 3, stability: 2 }, ind: { trustgov: 3 }, tip: 'Den som röstar vill bli lyssnad på även mellan valen.' },
      { text: 'SÄNK RÖSTRÄTTSÅLDERN I LOKALVALEN', cost: { pp: 15 }, law: ['voting_age', 'local16'], griev: -4, temp: { freedom: 2 }, ind: { turnout: 3 }, tip: 'Sextonåringarna demonstrerade. Nu får de rösta också.' },
      { text: 'HYLLA DEMOKRATIN I ETT TAL', griev: -2, temp: { approval: 2 }, ind: { turnout: 1 }, tip: 'Talet är fint. Köerna var finare.' },
    ],
  },

  // ===== EFTERSPELET (följder av hårda tag) =====
  {
    id: 'pro_eftersmak', icon: '\u{1F507}', chain: true,
    title: 'TYSTNADEN EFTER TILLSLAGET',
    text: 'Det har varit lugnt på gatorna i en månad sedan staten tog i med hårdhandskarna. Men lugnet är tunt. Förtroendet för regeringen har sjunkit i varje mätning, de gripna har blivit kända namn, och i fackmöten och föreningslokaler talar man nu om när det blir en nästa gång, inte om.',
    choices: [
      { text: 'GE AMNESTI ÅT DE GRIPNA', cost: { pp: 12 }, griev: -8, temp: { unrest: -3, approval: 2 }, perm: { freedom: 1 }, tip: 'Att släppa folk visar styrka. Det låter fel men stämmer.' },
      { text: 'LÅT EN OBEROENDE KOMMISSION GRANSKA POLISEN', cost: { money: 150, pp: 6 }, griev: -6, ind: { trustgov: 3, policetrust: 2 }, tip: 'Granskningen blir obekväm. Det är meningen.' },
      { text: 'HÅLL TRYCKET UPPE', temp: { stability: 2, freedom: -3 }, griev: 10, ind: { demo: -0.2, trustgov: -3 }, tip: 'Det som pressas ner kommer upp någon annanstans.' },
    ],
  },
  {
    id: 'pro_omvarlden', icon: '\u{1F30D}', chain: true, kind: 'frihet',
    title: 'OMVÄRLDEN SÅG BILDERNA',
    text: 'Filmerna från tillslaget smugglades ut på ett minneskort och visas nu i nyhetssändningar över hela världen. Ambassadörer kallas upp, en stor fotbollsklubb ställer in sitt träningsläger i landet och biståndsgivare i {land} pausar sina utbetalningar. Hemma har nästan ingen sett filmerna. Men alla har hört talas om dem.',
    choices: [
      { text: 'SLÄPP DE GRIPNA OCH LOVA EN UTREDNING', cost: { pp: 15 }, griev: -8, rel: 8, temp: { stability: -2 }, ind: { demo: 0.2 }, tip: 'Omvärlden andas ut. Hemma tolkas det som svaghet eller som hopp.' },
      { text: 'ANLITA EN UTLÄNDSK PR-BYRÅ', cost: { money: 400 }, rel: 3, temp: { ideopower: 2 }, tip: 'Glada turistfilmer på storbildsskärmar i tre huvudstäder.' },
      { text: 'KALLA DET INBLANDNING I INRE ANGELÄGENHETER', rel: -10, temp: { statepower: 3, ideopower: 2 }, griev: 6, ind: { tourists: -15 }, tip: 'Hemma låter det starkt. Utomlands låter det som ett erkännande.' },
    ],
  },
];
