// IMPERIUM V5.8 — HÄNDELSER: DE SEX NYA LAGARNA I V5.8.
// Yttrandefrihet, demonstrationsrätt, bolagsskatt, bistånd, kärnvapendoktrin och AI — fem händelser per lag.
export const EVENTS = [

  // ================= YTTRANDEFRIHET =================
  {
    id: 'nl58_tal_komikern', icon: '\u{1F3AD}', weight: 2,
    title: 'KOMIKERN SOM HÅNADE LEDAREN ÄR GRIPEN',
    text: 'En populär komiker har gripits efter en sketch där hon härmade din röst och ditt sätt att gå. Klippet har setts av halva landet sedan gripandet, och utländska tidningar skriver om ett land där man inte får skratta åt makten.',
    when: (c) => c.is('speech', 'lesemajeste'),
    choices: [
      { text: 'SLÄPP HENNE OCH AVSKAFFA LAGEN', cost: { pp: 20 }, law: ['speech', 'balanced'], temp: { approval: 5, statepower: -4 }, rel: 4, tip: 'Hon gör en ny sketch om dig nästa vecka. Den är ännu roligare.' },
      { text: 'BENÅDA HENNE I TYSTHET', cost: { pp: 10 }, temp: { approval: 2, statepower: -2 }, tip: 'Lagen finns kvar. Alla vet att den kan användas igen.' },
      { text: 'LÅT RÄTTEGÅNGEN HA SIN GÅNG', temp: { statepower: 4, freedom: -4, approval: -5 }, rel: -6, tip: 'Hon döms. Sketchen blir landets mest sedda video någonsin.' },
    ],
  },
  {
    id: 'nl58_tal_hatkampanj', icon: '\u{1F4E2}', weight: 2,
    title: 'HATKAMPANJEN GÅR INTE ATT STOPPA',
    text: 'En liten extremgrupp sprider affischer och filmer som pekar ut en minoritet som landets fiende. Polisen konstaterar att inget av det är olagligt, och minoritetens föreningar säger att deras barn är rädda att gå till skolan.',
    when: (c) => c.is('speech', 'absolute', 'broad') && c.st.integration < 10,
    choices: [
      { text: 'INFÖR EN STRÄNG LAG MOT HATBROTT', cost: { pp: 20 }, law: ['speech', 'hatelaws'], temp: { integration: 3 }, tip: 'Affischerna försvinner. Gruppen kallar sig nu förföljd.' },
      { text: 'FINANSIERA EN MOTKAMPANJ', cost: { money: 400 }, temp: { integration: 4, approval: 2 }, tip: 'Fler affischer på väggarna, men nu med ett annat budskap.' },
      { text: 'FÖRSVARA PRINCIPEN — ÄVEN DÅLIGA ORD ÄR FRIA', temp: { freedom: 3, integration: -5, unrest: 3 }, tip: 'Principen står kvar. Förtroendet för principen gör det inte.' },
    ],
  },
  {
    id: 'nl58_tal_skamtet', icon: '\u{1F4AC}', weight: 2,
    title: 'PENSIONÄREN SOM ÅTALADES FÖR ETT SKÄMT',
    text: 'En åttioårig man har åtalats för ett skämt i en sluten grupp på nätet, enligt den nya lagen mot hatiska uttalanden. Plattformarna tar bort allt som kan missförstås, och nu raderas även recept och fågelbilder för säkerhets skull.',
    when: (c) => c.is('speech', 'hatelaws'),
    choices: [
      { text: 'SKRIV EN TYDLIGARE LAG', cost: { pp: 15 }, temp: { freedom: 3, integration: -1 }, tip: 'Juristerna jobbar ett år. Fåglarna får komma tillbaka.' },
      { text: 'GÅ TILLBAKA TILL DE VANLIGA REGLERNA', law: ['speech', 'balanced'], temp: { approval: 3, integration: -3 }, tip: 'Skämten kommer tillbaka. Inte alla är lika roliga.' },
      { text: 'LAGEN GÄLLER ALLA, ÄVEN PENSIONÄRER', temp: { integration: 2, freedom: -3, approval: -4 }, tip: 'Konsekvent och strikt. Hela pensionärsförbundet byter parti.' },
    ],
  },
  {
    id: 'nl58_tal_dammen', icon: '\u{1F30A}', weight: 2,
    title: 'INGEN VÅGADE SÄGA ATT DAMMEN SPRACK',
    text: 'En stor kraftverksdamm har börjat läcka, och nedströms måste två städer utrymmas. Det visar sig att ingenjörerna såg sprickorna för ett år sedan men aldrig rapporterade det, eftersom kritik mot ett statligt prestigeprojekt är ett brott.',
    when: (c) => c.is('speech', 'criminalized'),
    choices: [
      { text: 'AMNESTI FÖR ALLA SOM RAPPORTERAR FEL', cost: { pp: 20 }, temp: { freedom: 4, safety: 4, statepower: -4 }, perm: { corruption: -2 }, tip: 'Ett hav av rapporter väller in. De flesta är sanna.' },
      { text: 'STRAFFA PROJEKTETS LEDNING', cost: { pp: 10 }, temp: { statepower: 4, approval: 2 }, tip: 'Cheferna får skulden. Ingenjörerna lär sig att tiga ännu bättre.' },
      { text: 'DET VAR ETT NATURFENOMEN', temp: { statepower: 3, approval: -4, safety: -3 }, mod: 'cover_up', tip: 'Tidningarna skriver om ovanligt mycket regn. De har inget val.' },
    ],
  },
  {
    id: 'nl58_tal_sanningsmyndighet', icon: '\u{1F50E}', weight: 2,
    title: 'EN MYNDIGHET FÖR SANNINGEN?',
    text: 'Efter en våg av falska nyheter från utlandet föreslår säkerhetstjänsten en statlig myndighet som ska märka osanna inlägg och kunna kräva att de tas bort. Journalisterna varnar för att staten då bestämmer vad som är sant.',
    when: (c) => c.is('speech', 'balanced', 'broad', 'absolute') && (c.coldWar || c.atWar) && c.st.statepower < 20,
    choices: [
      { text: 'INRÄTTA MYNDIGHETEN', cost: { money: 400 }, temp: { safety: 4, statepower: 4, freedom: -5 }, tip: 'Den första veckan märker den en satirtidning som falsk.' },
      { text: 'STÖD FRISTÅENDE FAKTAGRANSKARE', cost: { money: 200 }, temp: { safety: 2, freedom: 1 }, tip: 'Långsammare än lögnerna, men den som läser får veta.' },
      { text: 'LITA PÅ ATT MEDBORGARNA SER SKILLNAD', temp: { freedom: 3, safety: -3 }, tip: 'De flesta gör det. De andra delar allt.' },
    ],
  },

  // ================= DEMONSTRATIONSRÄTT =================
  {
    id: 'nl58_dem_bron', icon: '\u{1F309}', weight: 2,
    title: 'AKTIVISTERNA HAR LIMMAT FAST SIG PÅ BRON',
    text: 'För tredje veckan i rad sitter klimataktivister fastlimmade på huvudstadens största bro varje morgon. Lagen ger dem rätt att protestera, men pendlarna sitter i kö i timmar och en ambulans fick köra en omväg på tjugo minuter.',
    when: (c) => c.is('protest', 'free', 'notice') && c.st.unrest > 0,
    choices: [
      { text: 'ANVISA EN ANNAN PLATS, MITT I CENTRUM', cost: { pp: 10 }, temp: { unrest: -3, approval: 2 }, tip: 'Torget är större än bron. Kameraljuset är lika starkt.' },
      { text: 'KRÄV ANMÄLAN OCH BEGRÄNSA BLOCKADER', cost: { pp: 15 }, law: ['protest', 'permit'], temp: { unrest: -4, freedom: -3 }, tip: 'Bron blir fri. Aktivisterna flyttar till flygplatsen.' },
      { text: 'LÅT DEM SITTA', temp: { gdp: -2, approval: -4, freedom: 2 }, tip: 'Demokratin är ibland en bilkö.' },
    ],
  },
  {
    id: 'nl58_dem_zonen', icon: '\u{1F6A7}', weight: 2,
    title: 'PROTESTZONEN LIGGER VID SOPTIPPEN',
    text: 'Den enda tillåtna demonstrationsplatsen i huvudstaden ligger två mil utanför centrum, mellan en soptipp och en motorvägsavfart. Fackförbunden har stämt staten, och högsta domstolen ska avgöra om zonen alls är en plats för att bli hörd.',
    when: (c) => c.is('protest', 'zones'),
    choices: [
      { text: 'FLYTTA ZONEN TILL STADSPARKEN', cost: { money: 200 }, temp: { approval: 4, unrest: 2, freedom: 2 }, tip: 'Nu hörs ropen från regeringsfönstren. Det var väl det som var poängen.' },
      { text: 'AVSKAFFA ZONERNA', cost: { pp: 15 }, law: ['protest', 'permit'], temp: { approval: 3, statepower: -3 }, tip: 'Domstolen slipper avgöra. Gatorna får sina demonstrationer igen.' },
      { text: 'LÅT DOMSTOLEN BESTÄMMA', temp: { stability: 2, approval: -3 }, tip: 'Det tar två år. Soptippen hinner få en egen talarstol.' },
    ],
  },
  {
    id: 'nl58_dem_applader', icon: '\u{1F44F}', weight: 2,
    title: 'NU ÄR DET FÖRBJUDET ATT APPLÅDERA',
    text: 'Eftersom demonstrationer inte är tillåtna samlas folk varje onsdag på torgen och applåderar tyst i en minut. Polisen har börjat gripa människor för att klappa händer, och en åttioårig krigsveteran har fått böter för att ha klappat.',
    when: (c) => c.is('protest', 'restricted', 'banned') && c.st.unrest > -20,
    choices: [
      { text: 'TILLÅT DE TYSTA SAMLINGARNA', cost: { pp: 15 }, temp: { unrest: -3, freedom: 3, statepower: -4 }, tip: 'Applåderna fortsätter. Nu hörs de lite bättre.' },
      { text: 'RIV UPP VETERANENS BÖTER OCH BE OM URSÄKT', cost: { pp: 10 }, temp: { approval: 3 }, tip: 'Ursäkten är fin. Förbudet ligger kvar.' },
      { text: 'FÖRBJUD ALLA SAMLINGAR PÅ TORGEN', temp: { statepower: 5, approval: -6, unrest: 4 }, tip: 'Torgen töms. Nu applåderar folk från balkongerna.' },
    ],
  },
  {
    id: 'nl58_dem_tva_marscher', icon: '\u{1F6A9}', weight: 2,
    title: 'TVÅ DEMONSTRATIONER PÅ SAMMA TORG',
    text: 'En extremgrupp och en stor motdemonstration har båda anmält samma torg samma lördag. Polisen räknar med tiotusentals människor och vill ha besked om man ska dela torget, flytta den ena gruppen eller förbjuda båda.',
    when: (c) => c.is('protest', 'free', 'notice', 'permit') && c.st.unrest > 15 && c.st.integration < 0,
    choices: [
      { text: 'DELA TORGET MED KRAVALLSTAKET', cost: { money: 300 }, temp: { safety: 3, freedom: 2 }, tip: 'Två läger, ett staket och tusen poliser. Lördagen går lugnt.' },
      { text: 'FLYTTA EXTREMGRUPPEN TILL EN ANNAN DAG', cost: { pp: 10 }, temp: { integration: 2, freedom: -2 }, tip: 'De klagar på särbehandling. På en tisdag kommer färre.' },
      { text: 'FÖRBJUD BÅDA', temp: { safety: 2, freedom: -4, approval: -3 }, tip: 'Ingen fick demonstrera. Båda sidor demonstrerar mot det.' },
    ],
  },
  {
    id: 'nl58_dem_nej', icon: '\u{1F6AB}', weight: 2,
    title: 'POLISEN SA NEJ TILL DEMONSTRATIONEN',
    text: 'Polisen har vägrat tillstånd för en stor demonstration mot regeringens budget med hänvisning till trafiken. Arrangörerna menar att det handlar om politik, och tusentals säger att de tänker gå ändå.',
    when: (c) => c.is('protest', 'permit', 'zones') && c.st.statepower > 10 && c.st.freedom < 20,
    choices: [
      { text: 'BE POLISEN ÄNDRA SITT BESLUT', cost: { pp: 10 }, temp: { approval: 3, statepower: -2 }, tip: 'Tåget går som planerat. Trafiken överlever.' },
      { text: 'GÖR ANMÄLAN TILLRÄCKLIG I FRAMTIDEN', cost: { pp: 20 }, law: ['protest', 'notice'], temp: { freedom: 3, approval: 2 }, tip: 'Polisen förlorar en makt. Folket vinner en rättighet.' },
      { text: 'STÖD POLISENS BESLUT', temp: { statepower: 3, unrest: 5, approval: -3 }, tip: 'De går ändå. Nu är det en olaglig demonstration.' },
    ],
  },

  // ================= BOLAGSSKATT =================
  {
    id: 'nl58_bol_huvudkontor', icon: '\u{1F3E2}', weight: 2,
    title: 'STORBOLAGET FLYTTAR HUVUDKONTORET',
    text: 'Landets största industribolag meddelar att huvudkontoret flyttar till ett land med hälften så hög bolagsskatt. Fabrikerna blir kvar tills vidare, men tusen tjänstemän och hela forskningsavdelningen följer med.',
    when: (c) => c.is('corporate_tax', 'veryhigh', 'high'),
    choices: [
      { text: 'SÄNK BOLAGSSKATTEN', cost: { pp: 15 }, law: ['corporate_tax', 'raised'], temp: { gdp: 2 }, tip: 'Bolaget stannar. Nästa bolag har redan ringt om samma sak.' },
      { text: 'ERBJUD FORSKNINGSAVDRAG FÖR ATT BEHÅLLA LABBET', cost: { money: 500 }, temp: { research: 3 }, tip: 'Huvudkontoret går, forskarna stannar. Halva segern.' },
      { text: 'LÅT DEM GÅ', temp: { research: -3, approval: 3, factory: -2 }, tip: 'Folket gillar att du står emot. Kontorsfastigheten står tom.' },
    ],
  },
  {
    id: 'nl58_bol_skatteparadis', icon: '\u{1F3DD}\u{FE0F}', weight: 2,
    title: 'GRANNLÄNDERNA KRÄVER EN MINIMISKATT',
    text: 'Tusentals bolag har bara en brevlåda i ditt land, men vinsterna från hela regionen bokförs här. Grannländerna kräver att du inför den globala minimiskatten och hotar att svartlista ditt finanscentrum.',
    when: (c) => c.is('corporate_tax', 'verylow', 'none') && !c.is('globalism', 'isolationist'),
    choices: [
      { text: 'INFÖR DEN GLOBALA MINIMISKATTEN', law: ['corporate_tax', 'low'], res: { money: 300 }, temp: { gdp: -3 }, rel: 10, tip: 'Brevlådorna töms. Grannarna skickar blommor.' },
      { text: 'FÖRHANDLA FRAM ETT UNDANTAG', cost: { pp: 20 }, temp: { income: 2 }, rel: -2, tip: 'Ett undantag på fyrtio sidor. Juristerna älskar det.' },
      { text: 'VÄGRA — VÅR SKATT, VÅRT BESLUT', temp: { gdp: 3, ideopower: 3 }, perm: { corruption: 2 }, rel: -10, tip: 'Pengarna stannar. Det gör inte inbjudningarna till toppmötena.' },
    ],
  },
  {
    id: 'nl58_bol_royalty', icon: '\u{1F4BB}', weight: 2,
    title: 'TEKNIKJÄTTEN BETALADE NÄSTAN INGEN SKATT',
    text: 'En granskning visar att en av världens största teknikkoncerner har tjänat enormt på dina medborgare men betalat mindre skatt än en kiosk. Vinsten går som licensavgifter till ett dotterbolag på en liten ö.',
    when: (c) => c.is('corporate_tax', 'standard', 'raised', 'high', 'veryhigh') && (c.ind.gdppc ?? 9000) > 15000 && c.st.income < 10,
    choices: [
      { text: 'INFÖR EN DIGITAL SKATT PÅ OMSÄTTNINGEN', cost: { pp: 15 }, res: { money: 500 }, rel: -6, tip: 'Koncernen hotar att stänga tjänsten. Den gör det inte.' },
      { text: 'DRIV ETT SKATTEMÅL I DOMSTOL', cost: { money: 300 }, temp: { approval: 4 }, perm: { corruption: -2 }, tip: 'Det tar sju år. Ni vinner kanske.' },
      { text: 'ACCEPTERA DET — DE SKAPAR JOBB', temp: { approval: -4, gdp: 2 }, tip: 'Tre hundra jobb och en mycket liten skattsedel.' },
    ],
  },
  {
    id: 'nl58_bol_extraskatt', icon: '\u{26A1}', weight: 2,
    title: 'RAKETVINSTER MITT I KRISEN',
    text: 'Medan hushållen kämpar med stigande priser redovisar energi- och livsmedelsbolagen de största vinsterna i sin historia. Oppositionen kräver en tillfällig extraskatt på övervinsterna, och bolagen varnar för att investeringarna då uteblir.',
    when: (c) => c.is('corporate_tax', 'standard', 'raised', 'low', 'verylow') && (c.ind.infl ?? 3) > 6,
    choices: [
      { text: 'EN TILLFÄLLIG SKATT PÅ ÖVERVINSTER', res: { money: 600 }, temp: { approval: 5, factory: -3 }, tip: 'Tillfällig betyder i politiken ungefär tio år.' },
      { text: 'HÖJ BOLAGSSKATTEN FÖR GOTT', cost: { pp: 20 }, law: ['corporate_tax', 'high'], temp: { approval: 3 }, tip: 'Krisen tar slut. Skatten gör det inte.' },
      { text: 'LÅT VINSTERNA LIGGA KVAR I BOLAGEN', temp: { approval: -5, factory: 2 }, tip: 'Aktieägarna tackar. Hushållen gör det inte.' },
    ],
  },
  {
    id: 'nl58_bol_batterifabrik', icon: '\u{1F50B}', weight: 2,
    title: 'BATTERIFABRIKEN VILL SLIPPA SKATT',
    text: 'En utländsk koncern vill bygga en jättefabrik för batterier som skulle ge tusentals jobb i en region med hög arbetslöshet. Villkoret är att de slipper bolagsskatt i tio år, och två grannländer har redan lagt bud.',
    when: (c) => c.is('corporate_tax', 'standard', 'raised', 'low') && (c.ind.unemp ?? 5) > 8,
    choices: [
      { text: 'GE DEM TIO SKATTEFRIA ÅR', temp: { factory: 6, gdp: 3, income: -4 }, mod: 'foreign_investment', tip: 'Fabriken byggs. Lokala företag undrar varför de betalar skatt.' },
      { text: 'ERBJUD MARK OCH BILLIG EL I STÄLLET', cost: { money: 600 }, temp: { factory: 4, gdp: 2 }, tip: 'Samma fabrik, annan förpackning. Skatten blir kvar.' },
      { text: 'ALLA BOLAG BETALAR SAMMA SKATT', temp: { approval: -2, ideopower: 2 }, tip: 'Fabriken byggs i grannlandet. Pendlarbussen går dit.' },
    ],
  },

  // ================= BISTÅND =================
  {
    id: 'nl58_bis_villan', icon: '\u{1F3E1}', weight: 2,
    title: 'BISTÅNDET BLEV EN MINISTERVILLA',
    text: 'Revisorer har upptäckt att pengar som skulle ha gått till skolor i ett mottagarland i stället har byggt en villa med pool åt landets utbildningsminister. Oppositionen hemma kräver att allt bistånd fryses.',
    when: (c) => c.is('foreign_aid', 'verygenerous', 'generous', 'increased') && c.st.approval < 40,
    choices: [
      { text: 'KRÄV TILLBAKA PENGARNA OCH SKÄRP KONTROLLEN', cost: { pp: 15 }, perm: { corruption: -2 }, temp: { approval: 3 }, tip: 'Villan säljs. Skolorna byggs, ett par år för sent.' },
      { text: 'GE BISTÅNDET VIA FN OCH FRIVILLIGORGANISATIONER', cost: { money: 200 }, temp: { approval: 2 }, rel: 4, tip: 'Längre kedja, färre villor.' },
      { text: 'FRYS ALLT BISTÅND TILL LANDET', temp: { approval: 4, income: 2 }, rel: -5, tip: 'Ministern behåller villan. Barnen förlorar skolorna.' },
    ],
  },
  {
    id: 'nl58_bis_ubatar', icon: '\u{1F6A2}', weight: 2,
    title: 'BISTÅNDET KÖPTE KRIGSFARTYG',
    text: 'Ett allierat land har använt biståndet, som måste läggas på era egna varor, till att köpa två patrullbåtar från era varv. Båtarna ligger oanvända i hamnen, medan landets sjukhus saknar el.',
    when: (c) => c.is('foreign_aid', 'tied'),
    choices: [
      { text: 'KRÄV ATT PENGARNA GÅR TILL VÅRD OCH SKOLOR', cost: { pp: 15 }, temp: { factory: -2, approval: 2 }, rel: 4, tip: 'Varven förlorar en kund. Sjukhusen får el.' },
      { text: 'GÅ ÖVER TILL VANLIGT BISTÅND', cost: { pp: 20 }, law: ['foreign_aid', 'standard'], perm: { corruption: -2 }, tip: 'Mindre beställningar till industrin, mer hjälp till de fattiga.' },
      { text: 'VÄNNER VÄLJER SJÄLVA', temp: { factory: 3, ideopower: 2 }, perm: { corruption: 2 }, rel: -4, tip: 'Varven är nöjda. Det är de enda.' },
    ],
  },
  {
    id: 'nl58_bis_jordbavning', icon: '\u{1F3DA}\u{FE0F}', weight: 2,
    title: 'JORDBÄVNINGEN SOM VI INTE SVARAR PÅ',
    text: 'En kraftig jordbävning har förstört en stad i ett fattigt land. Grannländerna skickar räddningshundar och fältsjukhus, och världens tidningar har börjat räkna upp vilka länder som inte har skickat något alls.',
    when: (c) => c.is('foreign_aid', 'none', 'reduced'),
    choices: [
      { text: 'SKICKA ETT RÄDDNINGSTEAM DIREKT', cost: { man: 3, money: 200 }, temp: { approval: 3 }, rel: 8, tip: 'Hundarna hittar folk under rasmassorna. Det blir årets bild.' },
      { text: 'SKÄNK PENGAR VIA RÖDA KORSET', cost: { money: 400 }, rel: 5, tip: 'Ingen bild, men hjälpen kommer fram.' },
      { text: 'VI GER INTE BISTÅND', temp: { ideopower: 2 }, rel: -8, tip: 'Principfast. Det kommer att minnas länge.' },
    ],
  },
  {
    id: 'nl58_bis_vardkoerna', icon: '\u{1F4B6}', weight: 2,
    title: 'HJÄLPEN BÖRJAR HEMMA, SÄGER OPPOSITIONEN',
    text: 'Medan köerna i vården blir längre ger landet mer bistånd än nästan alla andra. Oppositionen har gjort det till sin stora fråga och vill flytta hela biståndsbudgeten till sjukhusen, och opinionen börjar svänga.',
    when: (c) => c.is('foreign_aid', 'verygenerous', 'generous') && c.st.welfare < 0,
    choices: [
      { text: 'SKÄR NER BISTÅNDET TILL NORMAL NIVÅ', law: ['foreign_aid', 'standard'], res: { money: 300 }, rel: -5, tip: 'Sjukhusen får mer pengar. Hälften av dem försvinner i administrationen.' },
      { text: 'HÖJ SKATTEN OCH BEHÅLL BÅDA', cost: { pp: 20 }, temp: { welfare: 3, approval: -3 }, tip: 'Rätt i sak, dyrt i opinionen.' },
      { text: 'FÖRSVARA BISTÅNDET', temp: { approval: -4 }, rel: 3, tip: 'Du förklarar att det är en promille av budgeten. Ingen lyssnar på siffror.' },
    ],
  },
  {
    id: 'nl58_bis_sjukdomen', icon: '\u{1F489}', weight: 2,
    title: 'SISTA STEGET MOT EN UTROTAD SJUKDOM',
    text: 'En sjukdom som förlamat miljoner barn finns kvar i bara två länder. WHO säger att en sista vaccinationskampanj skulle utrota den för alltid, men den saknar pengar och ber ditt land om ett stort bidrag.',
    when: (c) => c.is('foreign_aid', 'standard', 'increased', 'generous', 'verygenerous') && c.st.income > 20,
    choices: [
      { text: 'BETALA STÖRSTA DELEN AV KAMPANJEN', cost: { money: 800 }, temp: { approval: 4, ideopower: 3 }, rel: 12, tip: 'Om tio år finns sjukdomen bara i läroböckerna.' },
      { text: 'BIDRA MED VÅR DEL', cost: { money: 300 }, rel: 5, tip: 'En av många givare. Det räcker kanske.' },
      { text: 'ANDRA LÄNDER FÅR BETALA', temp: { income: 2 }, rel: -4, tip: 'Kampanjen dröjer ett år. Sjukdomen väntar inte.' },
    ],
  },

  // ================= KÄRNVAPENDOKTRIN =================
  {
    id: 'nl58_karn_forstaslag', icon: '\u{2622}\u{FE0F}', weight: 2,
    title: 'FOLKET ÄR RÄDDA FÖR VÅR EGEN DOKTRIN',
    text: 'Sedan landet tog in rätten att använda kärnvapen först har en läkarrörelse mot kärnvapenkrig samlat hundratusentals människor. Barn ritar svampmoln i skolan, och grannländerna har börjat öva evakuering.',
    when: (c) => c.is('nuclear_doctrine', 'firststrike'),
    choices: [
      { text: 'GÅ TILLBAKA TILL REN AVSKRÄCKNING', cost: { pp: 20 }, law: ['nuclear_doctrine', 'deterrence'], temp: { unrest: -4 }, rel: 6, tip: 'Vapnen finns kvar. Bara löftet ändras, och det räcker för de flesta.' },
      { text: 'TAL TILL NATIONEN OM VARFÖR DOKTRINEN BEHÖVS', cost: { pp: 10 }, temp: { unrest: -2, ideopower: 3 }, tip: 'Talet är bra. Sömnen blir inte bättre.' },
      { text: 'KALLA LÄKARRÖRELSEN FÖR FIENDENS HANTLANGARE', temp: { statepower: 4, freedom: -5, unrest: 4 }, rel: -4, tip: 'Läkarna får inte sina tillstånd förnyade. De fortsätter ändå.' },
    ],
  },
  {
    id: 'nl58_karn_vakterna', icon: '\u{1F510}', weight: 2,
    title: 'VAKTERNA VID KÄRNVAPENFÖRRÅDET SOV',
    text: 'En intern granskning visar att soldaterna som vaktar landets kärnvapen fuskat på sina prov, sovit på passet och lämnat en dörr olåst i flera dygn. Ingenting saknas, men det vet man bara för att någon räknade efteråt.',
    when: (c) => c.is('nuclear_doctrine', 'minimal', 'deterrence', 'firststrike') && c.st.corruption > 0,
    choices: [
      { text: 'BYT UT HELA LEDNINGEN', cost: { pp: 15 }, temp: { readiness: 4, milpower: -2 }, perm: { corruption: -2 }, tip: 'Nya chefer, nya lås, nya prov utan facit.' },
      { text: 'INVESTERA I NYA SÄKERHETSSYSTEM', cost: { money: 600, rp: 30 }, perm: { readiness: 3, safety: 2 }, tip: 'Kameror, sensorer och dubbla lås. Och fortfarande en vakt som kan somna.' },
      { text: 'HÅLL RAPPORTEN HEMLIG', temp: { statepower: 2 }, mod: 'cover_up', tip: 'Ingen fick veta. Det är just det som är problemet.' },
    ],
  },
  {
    id: 'nl58_karn_paraplyet', icon: '\u{2602}\u{FE0F}', weight: 2,
    title: 'HÅLLER STORMAKTENS PARAPLY?',
    text: 'Den stormakt vars kärnvapen ska skydda landet har fått en ny president som säger att allierade får klara sig själva om de inte betalar mer. Generalerna föreslår för första gången öppet att landet skaffar egna kärnvapen.',
    when: (c) => c.is('nuclear_doctrine', 'umbrella') && c.st.milpower < -10,
    choices: [
      { text: 'BYGG EN LITEN EGEN STYRKA', cost: { money: 900, pp: 20 }, law: ['nuclear_doctrine', 'minimal'], rel: -8, tip: 'Tio år, en hel ingenjörsgeneration och en mycket orolig omvärld.' },
      { text: 'BETALA MER FÖR SKYDDET', cost: { money: 500 }, temp: { milpower: 4, readiness: 2 }, rel: 4, tip: 'Paraplyet är kvar. Det har bara fått en hyra.' },
      { text: 'SATSA PÅ ETT VANLIGT FÖRSVAR I STÄLLET', cost: { man: 5 }, temp: { readiness: 5, milpower: 3 }, tip: 'Fler soldater, inga svampmoln.' },
      { text: 'LITA PÅ ATT DE HÅLLER SITT ORD', temp: { stability: -3 }, tip: 'Löften mellan stormakter brukar hålla. Nästan alltid.' },
    ],
  },
  {
    id: 'nl58_karn_hotet', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'EN KÄRNVAPENMAKT HOTAR OSS',
    text: 'En kärnvapenbeväpnad granne har låtit förstå att den inte utesluter att använda sina vapen om landet går emot dess intressen. Din kärnvapenfria linje har applåderats i världen, men nu frågar folk vad den är värd.',
    when: (c) => c.is('nuclear_doctrine', 'disarmament', 'nonnuclear') && (c.atWar || c.coldWar || c.st.milpower < -20),
    choices: [
      { text: 'BE FN OM SÄKERHETSGARANTIER', cost: { pp: 20 }, temp: { stability: 3 }, rel: 10, tip: 'Garantier på papper. Hela världen ser vem som hotade vem.' },
      { text: 'SÖK SKYDD UNDER EN ALLIERADS PARAPLY', cost: { pp: 15 }, law: ['nuclear_doctrine', 'umbrella'], temp: { milpower: 4 }, tip: 'Principerna får ge vika. Tryggheten får en adress.' },
      { text: 'STÅ FAST VID LINJEN', temp: { ideopower: 4, readiness: -2, approval: 2 }, rel: 4, tip: 'Hoten har inte fungerat på er förut. Förhoppningsvis inte nu heller.' },
    ],
  },
  {
    id: 'nl58_karn_forbudet', icon: '\u{1F4DC}', weight: 2,
    title: 'SKA VI SKRIVA UNDER KÄRNVAPENFÖRBUDET?',
    text: 'FN:s konvention om ett totalförbud mot kärnvapen har fått tillräckligt många underskrifter för att börja gälla. Fredsrörelsen har samlat en miljon namn för att landet ska skriva under, men allierade varnar för att det skadar samarbetet.',
    when: (c) => c.is('nuclear_doctrine', 'umbrella', 'nonnuclear', 'minimal') && !c.is('un', 'none') && c.st.approval > 20,
    choices: [
      { text: 'SKRIV UNDER OCH NEDRUSTA', cost: { pp: 25 }, law: ['nuclear_doctrine', 'disarmament'], temp: { approval: 4 }, tip: 'Landet blir en fredens röst. Generalerna får ett kärvt möte.' },
      { text: 'DELTA SOM OBSERVATÖR', cost: { pp: 10 }, temp: { approval: 2 }, rel: 3, tip: 'Man sitter med vid bordet utan att lova något.' },
      { text: 'STÅ UTANFÖR', temp: { approval: -3, milpower: 2 }, tip: 'Allierade nickar nöjt. Fredsrörelsen tältar utanför regeringen.' },
    ],
  },

  // ================= AI OCH AUTOMATION =================
  {
    id: 'nl58_ai_smyg', icon: '\u{1F916}', weight: 2,
    title: 'FÖRETAGEN ANVÄNDER AI I SMYG',
    text: 'Trots förbudet visar en undersökning att vart tredje större företag kör AI-system via servrar utomlands. De som följer lagen tappar kunder till dem som bryter den, och de unga programmerarna flyttar till grannlandet.',
    when: (c) => c.is('ai_regulation', 'ban', 'moratorium'),
    choices: [
      { text: 'GÖR RAZZIOR OCH DELA UT BÖTER', cost: { pp: 15 }, temp: { statepower: 3, gdp: -2 }, res: { money: 200 }, tip: 'Böterna är mindre än vinsten. Företagen räknar och fortsätter.' },
      { text: 'TILLÅT AI UNDER STRÄNGA REGLER', cost: { pp: 20 }, law: ['ai_regulation', 'strict'], temp: { research: 3 }, tip: 'Det som var olagligt blir tillståndspliktigt. Köerna börjar.' },
      { text: 'BLUNDA FÖR DET', perm: { corruption: 2 }, temp: { gdp: 2 }, tip: 'Lagen gäller på papperet. Det är där den bor.' },
    ],
  },
  {
    id: 'nl58_ai_rostbedrageri', icon: '\u{1F4DE}', weight: 2,
    title: 'BARNBARNETS RÖST VAR EN MASKIN',
    text: 'Tusentals pensionärer har lurats att föra över sina sparpengar efter samtal där en AI härmade deras barnbarns röst. Bankerna säger att kunderna själva godkänt överföringarna, och polisen har inte en enda misstänkt.',
    when: (c) => c.is('ai_regulation', 'free', 'light') && (c.ind.old ?? 8) > 8,
    choices: [
      { text: 'BANKERNA MÅSTE ERSÄTTA OFFREN', cost: { pp: 15 }, temp: { approval: 5, gdp: -2 }, tip: 'Bankerna inför plötsligt mycket bättre spärrar. Det gick tydligen.' },
      { text: 'KRÄV VATTENMÄRKEN PÅ ALLA AI-RÖSTER', cost: { pp: 10 }, law: ['ai_regulation', 'responsible'], temp: { safety: 3 }, tip: 'Seriösa bolag följer det. Bedragarna gör det inte.' },
      { text: 'EN STOR KAMPANJ: RING TILLBAKA', cost: { money: 200 }, temp: { safety: 2 }, tip: 'Pensionärerna lär sig ett kodord med familjen.' },
      { text: 'VAR OCH EN FÅR SE UPP', temp: { approval: -5, safety: -2 }, tip: 'Pensionärerna ser upp. De röstar också.' },
    ],
  },
  {
    id: 'nl58_ai_godkannandekon', icon: '\u{231B}', weight: 2,
    title: 'AI SOM HITTAR CANCER STÅR I KÖ',
    text: 'Ett program utvecklat i landet hittar tidig cancer på röntgenbilder bättre än erfarna läkare, och används redan i grannländerna. Hos AI-myndigheten är kön för godkännande två år, och cancerföreningen har startat en namninsamling.',
    when: (c) => c.is('ai_regulation', 'strict'),
    choices: [
      { text: 'SNABBSPÅR FÖR AI INOM VÅRDEN', cost: { pp: 15 }, temp: { welfare: 3, research: 2 }, tip: 'Vården får programmet i år. Andra branscher kräver också snabbspår.' },
      { text: 'DUBBLA MYNDIGHETENS PERSONAL', cost: { money: 500 }, temp: { research: 3 }, tip: 'Kön halveras. Kraven ligger kvar.' },
      { text: 'REGLERNA FINNS AV ETT SKÄL', temp: { safety: 2, approval: -4 }, tip: 'Programmet godkänns om två år. Väntan har ett pris.' },
    ],
  },
  {
    id: 'nl58_ai_bussen', icon: '\u{1F68D}', weight: 2,
    title: 'DEN FÖRARLÖSA BUSSEN KÖRDE I DIKET',
    text: 'En självkörande buss med tjugo passagerare gled av vägen i snöovädret, och fyra fick åka till sjukhus med lindriga skador. Tillverkaren säger att vägverket inte plogat, vägverket säger att bussen körde för fort, och passagerarna vet inte vem de ska stämma.',
    when: (c) => c.is('ai_regulation', 'responsible', 'light', 'free') && (c.ind.gdppc ?? 9000) > 20000 && c.res('logistics') >= 2,
    choices: [
      { text: 'TILLVERKAREN BÄR ALLTID ANSVARET', cost: { pp: 15 }, temp: { safety: 3, factory: -2 }, tip: 'Bussarna blir säkrare och dyrare. Ingen behöver längre gissa.' },
      { text: 'STOPPA ALLA FÖRARLÖSA FORDON VINTERTID', temp: { safety: 2, qol: -2 }, tip: 'Halva året är bussarna smarta. Andra halvan behöver de en chaufför.' },
      { text: 'EN STATLIG HAVERIKOMMISSION FÖR AI', cost: { money: 300 }, temp: { safety: 2, research: 2 }, tip: 'Varje olycka utreds på riktigt. Varje rapport blir en lärobok.' },
    ],
  },
  {
    id: 'nl58_ai_datacenter', icon: '\u{1F5A5}\u{FE0F}', weight: 2,
    title: 'AI-LABBET VILL HA EN HEL STADS EL',
    text: 'Ett av världens största AI-bolag vill bygga ett datacenter i landet som skulle dra lika mycket el som en storstad. Det ger investeringar och forskare, men elpriset i regionen väntas stiga för alla hushåll.',
    when: (c) => c.is('ai_regulation', 'free', 'light', 'responsible') && c.st.research > 10 && c.st.income > -20,
    choices: [
      { text: 'SÄG JA OCH BYGG UT ELNÄTET', cost: { money: 700 }, temp: { research: 5, gdp: 3 }, mod: 'foreign_investment', tip: 'Labbet kommer. Kraftledningarna också, rakt genom skogen.' },
      { text: 'JA, MEN BOLAGET BYGGER SIN EGEN KRAFT', cost: { pp: 15 }, temp: { research: 3, factory: 2 }, tip: 'Ett vindkraftverk per serverhall. Bolaget suckar och skriver på.' },
      { text: 'NEJ, ELEN BEHÖVS TILL HUSHÅLLEN', temp: { qol: 2, research: -2 }, tip: 'Elpriset står still. Labbet byggs i grannlandet.' },
    ],
  },
];
