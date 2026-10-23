// IMPERIUM V5.6 — HÄNDELSER: BROTT, RÄTT & SÄKERHET.
// Gängvåld, organiserad brottslighet, narkotika, vapen, övervakning, fängelser, domstolar, polis och terrorhot.
export const EVENTS = [

  // ================= GÄNG & SKJUTNINGAR =================
  {
    id: 'rat_shooting_wave', icon: '\u{1F6A8}', weight: 2,
    title: 'SKJUTNINGARNA ÖKAR FÖR VARJE MÅNAD',
    text: 'Två kriminella nätverk är i öppen konflikt om narkotikamarknaden i huvudstadens förorter. Polisen har registrerat fler skjutningar i år än under hela förra decenniet.',
    when: (c) => (c.ind.homicide ?? 2) > 12 || (c.st.safety < -35 && c.st.unrest > 10),
    choices: [
      { text: 'VISITATIONSZONER OCH DUBBLA STRAFF FÖR VAPENBROTT', cost: { pp: 25 }, perm: { safety: 8 }, temp: { freedom: -8, approval: 4 }, tip: 'Polisen får visitera vem som helst i zonen. Det gör de också.' },
      { text: 'SOCIALA INSATSER I DE UTSATTA OMRÅDENA', cost: { money: 900 }, perm: { safety: 6, integration: 5 }, temp: { safety: -4 }, tip: 'Verkar på sikt. Skjutningarna fortsätter under tiden.' },
      { text: 'DET ÄR GÄNGEN SOM SKJUTER VARANDRA', temp: { safety: -8, approval: -6 }, tip: 'Ett uttalande som kommer att citeras i åratal.' },
    ],
  },
  {
    id: 'rat_gang_recruits_kids', icon: '\u{1F9D2}', weight: 2,
    title: 'GÄNGEN REKRYTERAR BARN',
    text: 'Socialtjänsten larmar om att kriminella nätverk lockar tolvåringar med märkeskläder och kontanter för att springa ärenden åt dem. Barnen är för unga för att dömas, och det vet gängen.',
    when: (c) => ((c.ind.youthunemp ?? 10) > 20 || (c.ind.homicide ?? 2) > 6) && c.st.safety < 15 && c.st.integration < 10,
    choices: [
      { text: 'FRITIDSGÅRDAR, SOMMARJOBB OCH FLER SOCIALSEKRETERARE', cost: { money: 800 }, perm: { safety: 4, integration: 4, qol: 3 }, tip: 'Billigare än en fängelseplats. Syns sämre på en presskonferens.' },
      { text: 'SÄNK STRAFFMYNDIGHETSÅLDERN', cost: { pp: 20 }, perm: { safety: 3 }, temp: { freedom: -6, approval: 4 }, rel: -3, tip: 'Gängen rekryterar elvaåringar i stället.' },
      { text: 'ANSVARET LIGGER HOS FÖRÄLDRARNA', temp: { safety: -6, integration: -4 }, tip: 'Föräldrarna håller med. De vet inte heller vad de ska göra.' },
    ],
  },
  {
    id: 'rat_gang_truce', icon: '\u{1F91D}', weight: 1, cooldown: 800,
    title: 'GÄNGLEDARNA ERBJUDER VAPENVILA',
    text: 'Ledarna för landets två största kriminella nätverk erbjuder genom en advokat att stoppa skjutningarna. I gengäld vill de att polisen drar ner på razziorna i deras kvarter.',
    when: (c) => ((c.ind.homicide ?? 2) > 12 || c.mod('lawless')) && c.st.safety < 20,
    choices: [
      { text: 'ACCEPTERA I HEMLIGHET', temp: { safety: 12 }, perm: { corruption: 8, statepower: -6 }, mod: 'cover_up', tip: 'Mordtalen sjunker. Någon kommer att fråga varför.' },
      { text: 'VI FÖRHANDLAR INTE MED BROTTSLINGAR', cost: { pp: 15 }, temp: { safety: -6, statepower: 6, approval: 5 }, tip: 'Principfast. Skjutningarna fortsätter tills vidare.' },
      { text: 'SPELA MED OCH GRIP LEDARNA PÅ MÖTET', cost: { pp: 20, money: 400 }, perm: { safety: 6, corruption: -3 }, temp: { unrest: 6, safety: -6 }, tip: 'Ett ögonblick av triumf, sedan en arvsstrid.' },
    ],
  },
  {
    id: 'rat_witness_silence', icon: '\u{1F910}', weight: 2,
    title: 'INGEN VÅGAR VITTNA',
    text: 'Ett mord begicks mitt på dagen på ett fullsatt torg, men inte en enda person vill vittna. Åklagaren tvingas lägga ner fallet i brist på bevis.',
    when: (c) => c.st.safety < -10 && (c.ind.rulelaw ?? 0) < 0.3,
    choices: [
      { text: 'ANONYMA VITTNEN I DOMSTOL', cost: { pp: 20 }, perm: { safety: 5, freedom: -4 }, tip: 'Den åtalade får aldrig veta vem som pekar ut honom.' },
      { text: 'BYGG UT VITTNESSKYDDET', cost: { money: 700 }, perm: { safety: 4 }, temp: { approval: 3 }, tip: 'Nytt namn, ny stad, nytt liv. Dyrt per person.' },
      { text: 'KRONVITTNEN - STRAFFRABATT FÖR DEN SOM BERÄTTAR', perm: { safety: 3, corruption: 3 }, temp: { approval: -4 }, tip: 'Den som anger flest kommer ut först.' },
    ],
  },

  // ================= ORGANISERAD BROTTSLIGHET & NARKOTIKA =================
  {
    id: 'rat_cocaine_port', icon: '\u{1F6A2}', weight: 2,
    title: 'KOKAINET KOMMER VIA HAMNEN',
    text: 'Tullen hittar narkotika gömd i bananlådor i landets största hamn för tredje gången på en månad. Utredarna misstänker att flera hamnarbetare och en tulltjänsteman är köpta.',
    when: (c) => c.st.corruption > 15 && !c.is('drugs', 'legal') && (c.ind.exports ?? 30) > 25,
    choices: [
      { text: 'SKANNRAR OCH NARKOTIKAHUNDAR I VARJE HAMN', cost: { money: 800 }, perm: { safety: 5, corruption: -3 }, temp: { income: -3 }, tip: 'Containrarna går långsammare. Det gör knarket också.' },
      { text: 'RENSA UT DE KÖPTA TJÄNSTEMÄNNEN', cost: { pp: 20 }, perm: { corruption: -6 }, temp: { stability: -3 }, tip: 'Facket protesterar mot misstankarna. Några av dem med rätta.' },
      { text: 'HANDELN FÅR INTE STANNA', perm: { corruption: 5, safety: -5 }, temp: { gdp: 2 }, tip: 'Exporten går som smord. Bokstavligen.' },
    ],
  },
  {
    id: 'rat_drug_war_toll', icon: '\u{1F48A}', weight: 2,
    title: 'KRIGET MOT KNARKET GÅR INTE ATT VINNA',
    text: 'Efter år av militära razzior mot kartellerna är fängelserna fulla och kokainet billigare än någonsin. En statlig utredning konstaterar att priset på gatan aldrig har varit lägre.',
    when: (c) => c.is('drugs', 'war'),
    choices: [
      { text: 'BYT TILL REGLERAD NARKOTIKAPOLITIK', cost: { pp: 30 }, law: ['drugs', 'regulated'], temp: { approval: -4 }, tip: 'Ett erkännande av att kriget är förlorat.' },
      { text: 'TRAPPA UPP - SKICKA IN ARMÉN', cost: { pp: 20, man: 8 }, temp: { safety: 6, freedom: -10, unrest: 6 }, perm: { corruption: 3 }, tip: 'Fler soldater, fler beslag, fler nya karteller.' },
      { text: 'FORTSÄTT SOM FÖRUT', temp: { safety: -4, income: -4 }, perm: { corruption: 3 }, tip: 'Det har inte fungerat hittills, men det känns tryggt.' },
    ],
  },
  {
    id: 'rat_drug_tourists', icon: '\u{1F68C}', weight: 2,
    title: 'DROGTURISTERNA STRÖMMAR IN',
    text: 'Sedan narkotikan blev laglig kommer bussar fulla med unga turister från grannländerna varje helg. Stadens invånare klagar på stöket, och grannländernas regeringar klagar på dig.',
    when: (c) => c.is('drugs', 'legal'),
    choices: [
      { text: 'BARA MEDBORGARE FÅR KÖPA', cost: { pp: 15 }, temp: { income: -4, approval: 5 }, perm: { safety: -2 }, rel: 5, tip: 'Turisterna försvinner. Langarna vid gränsen tar över.' },
      { text: 'BESKATTA TURISTERNA HÅRT', res: { money: 600 }, temp: { safety: -4 }, rel: -6, tip: 'Varje besökare är en skattebetalare. Och ett grannlandsproblem.' },
      { text: 'GÖR DET TILL EN TURISTNÄRING', res: { money: 400 }, temp: { gdp: 4 }, perm: { hdi: -2, safety: -3 }, rel: -10, tip: 'Kaféerna blomstrar. Diplomaterna gör det inte.' },
    ],
  },
  {
    id: 'rat_decrim_results', icon: '\u{1F4CB}', weight: 2,
    title: 'ETT ÅR UTAN STRAFF FÖR EGET BRUK',
    text: 'Första utvärderingen av avkriminaliseringen är klar. Fler missbrukare söker vård och färre hamnar i fängelse, men köerna till beroendevården har blivit månader långa.',
    when: (c) => c.is('drugs', 'decriminalized'),
    choices: [
      { text: 'DUBBLERA BEROENDEVÅRDEN', cost: { money: 800 }, perm: { hdi: 3, welfare: 3, safety: 3 }, tip: 'Köerna försvinner. Det gör pengarna också.' },
      { text: 'GÅ TILLBAKA TILL FÖRBUDET', cost: { pp: 25 }, law: ['drugs', 'regulated'], temp: { freedom: -4, approval: 3 }, tip: 'Ett år av data i papperskorgen.' },
      { text: 'LÅT DET GÅ SIN GÅNG', temp: { qol: -3, approval: -3 }, tip: 'Reformen var bra. Genomförandet mindre bra.' },
    ],
  },
  {
    id: 'rat_overdose_wave', icon: '\u{1F691}', weight: 2,
    title: 'VÅG AV ÖVERDOSER',
    text: 'Ett nytt syntetiskt preparat som är många gånger starkare än heroin har nått gatorna. Akutmottagningarna i tre städer har fått in fler fall på en vecka än under ett normalt år.',
    when: (c) => !c.is('drugs', 'war') && (c.ind.gdppc ?? 9000) > 12000 && c.st.qol < 5,
    choices: [
      { text: 'MOTGIFT PÅ VARJE APOTEK OCH I VARJE SKOLA', cost: { money: 600 }, perm: { hdi: 3 }, temp: { qol: 3 }, tip: 'Räddar liv. Löser ingenting annat.' },
      { text: 'ÖPPNA ÖVERVAKADE INJEKTIONSRUM', cost: { pp: 20 }, perm: { hdi: 4 }, temp: { approval: -6, freedom: 3 }, tip: 'Effektivt enligt forskarna. Grannarna håller inte med.' },
      { text: 'HÅRDARE STRAFF FÖR LANGNING', perm: { safety: 3, hdi: -3 }, temp: { statepower: 4 }, tip: 'Langarna byter till ännu starkare preparat. De är lättare att smuggla.' },
    ],
  },
  {
    id: 'rat_cannabis_vote', icon: '\u{1F33F}', weight: 2,
    title: 'FOLKET VILL LEGALISERA CANNABIS',
    text: 'Ett medborgarförslag om att legalisera cannabis har fått en miljon underskrifter. Opinionsmätningarna visar en knapp majoritet för, och frågan splittrar ditt eget parti.',
    when: (c) => c.is('drugs', 'regulated', 'strict') && c.st.freedom > 20 && !c.is('elections', 'unfair', 'no'),
    choices: [
      { text: 'LEGALISERA OCH BESKATTA', cost: { pp: 30 }, law: ['drugs', 'legal'], temp: { approval: 5 }, tip: 'Staten blir landets största langare. Med kvitto.' },
      { text: 'AVKRIMINALISERA EGET BRUK', cost: { pp: 20 }, law: ['drugs', 'decriminalized'], temp: { approval: 3 }, tip: 'En kompromiss som ingen sida är nöjd med.' },
      { text: 'SÄG NEJ', temp: { approval: -6, unrest: 4, statepower: 3 }, tip: 'Frågan försvinner inte. Den kommer tillbaka vid nästa val.' },
    ],
  },

  // ================= VAPEN =================
  {
    id: 'rat_school_weapon', icon: '\u{1F3EB}', weight: 2,
    title: 'SKOLAN EVAKUERADES EFTER VAPENLARM',
    text: 'En elev tog med sig sin fars pistol till skolan. Ingen skadades, men bilderna på barn som leds ut med händerna över huvudet har setts av hela landet.',
    when: (c) => c.is('firearms', 'free', 'licensed'),
    choices: [
      { text: 'SKÄRP VAPENLAGEN', cost: { pp: 30 }, law: ['firearms', 'strict'], temp: { approval: 4, freedom: -3 }, tip: 'Vapenägarna glömmer inte. Det gör inte föräldrarna heller.' },
      { text: 'KRAV PÅ VAPENSKÅP I VARJE HEM', cost: { pp: 15 }, perm: { safety: 3 }, temp: { freedom: -2 }, tip: 'Ett kassaskåp för varje gevär. Kontrolleras av ingen.' },
      { text: 'METALLDETEKTORER VID SKOLENTRÉERNA', cost: { money: 700 }, temp: { safety: 5 }, perm: { qol: -2 }, tip: 'Skolorna ser ut som flygplatser. Eleverna köar varje morgon.' },
      { text: 'INGEN ÄNDRING - DET VAR ETT ENSTAKA FALL', temp: { approval: -5, safety: -3 }, tip: 'Statistiken håller med dig. Föräldrarna gör det inte.' },
    ],
  },
  {
    id: 'rat_gun_amnesty', icon: '\u{1F52B}', weight: 2,
    title: 'TUSENTALS ILLEGALA VAPEN I OMLOPP',
    text: 'Polisen uppskattar att det finns tiotusentals illegala skjutvapen i landet, många insmugglade från tidigare krigszoner. Vapnen hyrs ut mellan kriminella för en kväll i taget.',
    when: (c) => (c.ind.homicide ?? 2) > 5 && !c.is('firearms', 'free') && c.st.safety < 10,
    choices: [
      { text: 'VAPENAMNESTI MED ERSÄTTNING', cost: { money: 600 }, perm: { safety: 4 }, tip: 'Mest gamla jaktgevär från farmors vind. Men också några av de andra.' },
      { text: 'TIO ÅRS FÄNGELSE FÖR ILLEGALT VAPENINNEHAV', cost: { pp: 20 }, perm: { safety: 5 }, temp: { freedom: -3, unrest: 3 }, tip: 'Fängelserna fylls. Vapnen blir dyrare, inte färre.' },
      { text: 'ÖVERLÅT DET TILL POLISEN', temp: { safety: -5 }, tip: 'Polisen har haft det överlåtet till sig i tio år.' },
    ],
  },
  {
    id: 'rat_hunters_protest', icon: '\u{1F98C}', weight: 2,
    title: 'JÄGARNA MARSCHERAR MOT VAPENFÖRBUDET',
    text: 'Tiotusentals jägare och sportskyttar demonstrerar i huvudstaden mot att deras gevär ska lämnas in. På landsbygden växer viltstammarna okontrollerat sedan jakten nästan upphörde.',
    when: (c) => c.is('firearms', 'ban', 'stateonly'),
    choices: [
      { text: 'UNDANTAG FÖR LICENSIERADE JÄGARE', cost: { pp: 20 }, law: ['firearms', 'strict'], temp: { approval: 5 }, tip: 'Geväret tillbaka i garderoben. Med papper.' },
      { text: 'STATLIGA JAKTLAG SKÖTER VILTVÅRDEN', cost: { money: 400 }, temp: { statepower: 3, approval: -2 }, tip: 'Älgjakt med tjänstevapen och reseräkning.' },
      { text: 'FÖRBUDET STÅR FAST', temp: { unrest: 6, approval: -5 }, tip: 'Landsbygden röstade inte på dig ändå. Nu vet du varför.' },
    ],
  },
  {
    id: 'rat_gun_lobby', icon: '\u{1F4E3}', weight: 2,
    title: 'KRAV PÅ RÄTT ATT BÄRA VAPEN',
    text: 'En växande rörelse kräver rätten att bära vapen för självförsvar. De har samlat in miljontals underskrifter och pekar på att polisen ändå inte hinner fram när man ringer.',
    when: (c) => c.is('firearms', 'strict') && c.st.safety < -10 && c.st.freedom > 0,
    choices: [
      { text: 'FRIA VAPEN FÖR ALLA VUXNA', cost: { pp: 30 }, law: ['firearms', 'free'], temp: { approval: 6 }, tip: 'Varje medborgare en polis. Varje gräl en risk.' },
      { text: 'ENKLARE LICENS FÖR SJÄLVFÖRSVAR', cost: { pp: 20 }, law: ['firearms', 'licensed'], temp: { approval: 3 }, tip: 'Halvvägs till vilda västern.' },
      { text: 'FLER POLISER I STÄLLET', cost: { money: 700 }, perm: { safety: 4 }, tip: 'Ett svar som alla gillar och ingen tror på.' },
      { text: 'SÄG NEJ', temp: { approval: -4, unrest: 3 }, tip: 'Rörelsen växer. Den har god tid.' },
    ],
  },

  // ================= ÖVERVAKNING & INTEGRITET =================
  {
    id: 'rat_whistleblower', icon: '\u{1F4C2}', weight: 2,
    title: 'VISSELBLÅSAREN AVSLÖJAR AVLYSSNINGEN',
    text: 'En anställd vid säkerhetstjänsten har lämnat ut tusentals dokument som visar att staten sparar alla medborgares samtal och sökningar. Hon har flytt utomlands.',
    when: (c) => c.is('surveillance', 'mass', 'total') && c.st.freedom > -40,
    choices: [
      { text: 'BEGÄR HENNE UTLÄMNAD FÖR SPIONAGE', cost: { pp: 20 }, temp: { statepower: 5, freedom: -6 }, rel: -6, tip: 'Hon blir en hjälte överallt utom här.' },
      { text: 'BEGRÄNSA ÖVERVAKNINGEN TILL MISSTÄNKTA', cost: { pp: 30 }, law: ['surveillance', 'targeted'], temp: { approval: 6 }, tip: 'Det som redan sparats raderas. Påstås det.' },
      { text: 'FÖRNEKA ALLT', temp: { approval: -5 }, mod: 'cover_up', tip: 'Dokumenten finns på nätet. Förnekandet också.' },
    ],
  },
  {
    id: 'rat_face_recognition', icon: '\u{1F4F9}', weight: 2,
    title: 'KAMEROR SOM KÄNNER IGEN ANSIKTEN',
    text: 'Polisen vill koppla huvudstadens alla övervakningskameror till ett system för ansiktsigenkänning. I testerna hittade systemet efterlysta personer på några minuter, men pekade också ut fel människor.',
    when: (c) => c.is('surveillance', 'targeted', 'warrant') && c.st.safety < -5 && (c.ind.internet ?? 60) > 70,
    choices: [
      { text: 'INFÖR DET I HELA LANDET', cost: { pp: 30, money: 500 }, law: ['surveillance', 'mass'], tip: 'Ingen efterlyst kan gå på stan längre. Ingen annan heller, osedd.' },
      { text: 'TESTA I EN STAD UNDER ETT ÅR', cost: { money: 400 }, temp: { safety: 4, freedom: -2 }, tip: 'Ett försök som aldrig riktigt avslutas.' },
      { text: 'NEJ - ANSIKTEN ÄR INTE POLISENS', temp: { freedom: 4, safety: -3 }, tip: 'Integriteten vinner. Polisen surar.' },
    ],
  },
  {
    id: 'rat_encryption', icon: '\u{1F510}', weight: 2,
    title: 'POLISEN VILL LÄSA KRYPTERADE CHATTAR',
    text: 'De kriminella nätverken planerar allt i krypterade appar som polisen inte kan läsa. Rikspolischefen kräver att apparna tvingas bygga in en bakdörr för myndigheterna.',
    when: (c) => (c.ind.internet ?? 60) > 85 && c.st.safety < 0 && !c.is('surveillance', 'total'),
    choices: [
      { text: 'LAGSTIFTA OM BAKDÖRRAR', cost: { pp: 25 }, perm: { safety: 4, freedom: -6 }, rel: -4, tip: 'En bakdörr för polisen är en dörr för alla som hittar den.' },
      { text: 'HACKA DE KRIMINELLAS APPAR I HEMLIGHET', cost: { rp: 60 }, perm: { safety: 5 }, temp: { freedom: -2 }, tip: 'En gång fungerar det. Sedan byter de app.' },
      { text: 'KRYPTERING ÄR EN RÄTTIGHET', temp: { freedom: 4, safety: -4 }, tip: 'Teknikbranschen jublar. Polisen gör det inte.' },
    ],
  },
  {
    id: 'rat_wiretapped_press', icon: '\u{1F4DE}', weight: 2,
    title: 'JOURNALISTERNA VAR AVLYSSNADE',
    text: 'Det har avslöjats att säkerhetstjänsten i två år avlyssnat reportrar på landets största tidning för att hitta deras källor. Tidningen publicerar nu utskrifter av sina egna samtal.',
    when: (c) => (c.is('surveillance', 'mass', 'total') || c.mod('police_state')) && !c.is('press', 'state', 'highstate', 'propaganda') && c.st.freedom > -20,
    choices: [
      { text: 'AVSKEDA SÄKERHETSCHEFEN', cost: { pp: 20 }, temp: { approval: 4, statepower: -4 }, perm: { freedom: 3 }, tip: 'Chefen går. Inspelningarna ligger kvar i arkivet.' },
      { text: 'OBEROENDE GRANSKNING AV SÄKERHETSTJÄNSTEN', cost: { pp: 25, money: 300 }, perm: { freedom: 5, corruption: -3 }, temp: { statepower: -6 }, tip: 'Granskarna hittar mer än någon ville veta.' },
      { text: 'DET VAR NÖDVÄNDIGT FÖR RIKETS SÄKERHET', temp: { freedom: -5, approval: -6, statepower: 4 }, tip: 'En mening som har använts förr. Den fungerade inte då heller.' },
    ],
  },

  // ================= FÄNGELSER =================
  {
    id: 'rat_prisons_full', icon: '\u{1F6CF}\u{FE0F}', weight: 2,
    title: 'FÄNGELSERNA ÄR ÖVERFULLA',
    text: 'Landets anstalter har fler intagna än platser, och fångar sover på madrasser i gymnastiksalar. Kriminalvården varnar för att nyanställda vakter slutar efter några veckor.',
    when: (c) => c.is('punishments', 'harsh', 'veryharsh') || ((c.ind.homicide ?? 2) > 15 && c.is('trials', 'speedup', 'quick')),
    choices: [
      { text: 'BYGG TRE NYA ANSTALTER', cost: { money: 1200 }, perm: { safety: 4 }, tip: 'Klara om sex år. Fulla om sju.' },
      { text: 'HYR FÄNGELSEPLATSER I ETT ANNAT LAND', cost: { money: 700 }, temp: { safety: 3, freedom: -3 }, rel: 3, tip: 'Fångarna exporteras. Kritiken importeras.' },
      { text: 'TIDIGARE VILLKORLIG FRIGIVNING', temp: { safety: -6, approval: -4 }, tip: 'Platserna blir lediga. Grannarna blir oroliga.' },
    ],
  },
  {
    id: 'rat_prison_riot', icon: '\u{26D3}\u{FE0F}', weight: 2,
    title: 'UPPLOPP PÅ ANSTALTEN',
    text: 'Intagna på en av landets största anstalter har tagit kontroll över två avdelningar och håller tre vakter som gisslan. De kräver bättre mat, fler besökstider och att isoleringscellerna stängs.',
    when: (c) => (c.is('rehabilitation', 'shortened', 'unavailable', 'nonexistent') || c.is('punishments', 'veryharsh')) && c.st.unrest > 0,
    choices: [
      { text: 'FÖRHANDLA OM VAKTERNAS FRIHET', cost: { pp: 15 }, temp: { unrest: -4, statepower: -4, approval: 3 }, tip: 'Vakterna kommer hem. Fångarna får sina besökstider.' },
      { text: 'SKICKA IN INSATSSTYRKAN', cost: { man: 5 }, temp: { statepower: 6, freedom: -4, unrest: 4 }, tip: 'Avdelningarna återtas på en timme. Utredningen tar ett år.' },
      { text: 'SPÄRRA AV OCH VÄNTA', temp: { unrest: 5, approval: -4 }, tip: 'Fångarna har inget annat för sig. Inte du heller, tydligen.' },
    ],
  },
  {
    id: 'rat_prison_gangs', icon: '\u{1F4F1}', weight: 2,
    title: 'GÄNGEN STYR FÄNGELSET',
    text: 'En granskning visar att kriminella nätverk i praktiken styr flera avdelningar på landets anstalter. Därifrån beordrar de brott ute i samhället via insmugglade mobiltelefoner och drönare.',
    when: (c) => (c.ind.rulelaw ?? 0) < -0.5 && c.st.safety < 5,
    choices: [
      { text: 'STÖRSÄNDARE OCH DRÖNARSKYDD', cost: { money: 600, rp: 20 }, perm: { safety: 4 }, tip: 'Mobilerna tystnar. Brevduvorna gör comeback.' },
      { text: 'SPRID LEDARNA TILL OLIKA ANSTALTER', cost: { pp: 15 }, temp: { safety: 3, unrest: 3 }, tip: 'Nätverket sprids över hela landet. Det var kanske inte meningen.' },
      { text: 'LÅT DEM HÅLLA ORDNING', perm: { corruption: 4, safety: -4 }, temp: { statepower: -4 }, tip: 'Fängelset blir lugnt. Gängen blir starkare.' },
    ],
  },
  {
    id: 'rat_rehab_success', icon: '\u{1F331}', weight: 2,
    title: 'ÅTERFALLEN I BROTT HAR HALVERATS',
    text: 'En internationell studie visar att dina rehabiliteringsprogram ger några av världens lägsta återfallssiffror. Delegationer från andra länder står i kö för att besöka anstalterna.',
    when: (c) => c.is('rehabilitation', 'veryhigh', 'high', 'extended'),
    choices: [
      { text: 'BYGG UT PROGRAMMEN YTTERLIGARE', cost: { money: 600 }, perm: { safety: 4, qol: 2 }, tip: 'Vården går före straffet. Kostnaden går före budgeten.' },
      { text: 'SÄLJ METODEN TILL ANDRA LÄNDER', cost: { pp: 10 }, res: { money: 300 }, rel: 6, tip: 'Kriminalvård som exportvara. Vem kunde ana.' },
      { text: 'SPARA PENGAR NU NÄR DET FUNGERAR', law: ['rehabilitation', 'balanced'], res: { money: 500 }, temp: { approval: -2 }, tip: 'Ett klassiskt misstag med ett klassiskt resultat.' },
    ],
  },

  // ================= DOMSTOLAR =================
  {
    id: 'rat_court_backlog', icon: '\u{1F4DA}', weight: 2,
    title: 'DOMSTOLARNA HINNER INTE MED',
    text: 'Över hundratusen mål väntar på att tas upp i domstol. Misstänkta släpps i väntan på rättegång, och vittnen hinner glömma vad de såg.',
    when: (c) => (c.is('trials', 'long', 'extended') && c.st.safety < 20) || ((c.ind.goveff ?? 0) < -0.8 && c.st.safety < -10),
    choices: [
      { text: 'ANSTÄLL HUNDRATALS NYA DOMARE', cost: { money: 900 }, perm: { safety: 3, corruption: -2 }, tip: 'Det tar fem år att utbilda en domare. Kön väntar.' },
      { text: 'SNABBARE PROCESSER MED FÄRRE ÖVERKLAGANDEN', cost: { pp: 25 }, law: ['trials', 'speedup'], tip: 'Kön försvinner. Ett och annat justitiemord också.' },
      { text: 'UPPGÖRELSER UTANFÖR RÄTTEN', perm: { corruption: 3 }, temp: { safety: 2, approval: -3 }, tip: 'Den som erkänner snabbt får rabatt. Även den oskyldige.' },
    ],
  },
  {
    id: 'rat_fast_court_error', icon: '\u{23F1}\u{FE0F}', weight: 2,
    title: 'SNABBDOMSTOLEN DÖMDE FEL',
    text: 'En man som dömdes på tjugo minuter till fem års fängelse visar sig ha legat på ett sjukhus i en annan stad när brottet begicks. Han har redan suttit inne i två år.',
    when: (c) => c.is('trials', 'speedup', 'quick'),
    choices: [
      { text: 'ÅTERINFÖR FULLA RÄTTEGÅNGAR', cost: { pp: 25 }, law: ['trials', 'balanced'], temp: { approval: 4 }, tip: 'Rättssäkerheten tillbaka. Kön också.' },
      { text: 'SKADESTÅND OCH EN URSÄKT', cost: { money: 400 }, temp: { approval: 3 }, tip: 'Två år av ett liv, ersatta med en check.' },
      { text: 'ETT ENSTAKA MISSTAG', temp: { approval: -6, freedom: -3 }, perm: { corruption: 2 }, tip: 'Det finns fler. Journalisterna letar redan.' },
    ],
  },
  {
    id: 'rat_judge_bribed', icon: '\u{1F4BC}', weight: 2,
    title: 'DOMAREN TOG EMOT MUTOR',
    text: 'En hovrättsdomare har avslöjats med en väska kontanter från en åtalad företagsledare. Försvarsadvokater begär nu att hundratals av hans tidigare domar ska prövas om.',
    when: (c) => c.st.corruption > 15 && (c.ind.rulelaw ?? 0) < 0.5,
    choices: [
      { text: 'PRÖVA OM ALLA HANS DOMAR', cost: { money: 500, pp: 10 }, perm: { corruption: -5 }, temp: { safety: -3 }, tip: 'Rättvisan kostar. Det har den alltid gjort.' },
      { text: 'NYA REGLER OM DOMARES EKONOMI', cost: { pp: 20 }, perm: { corruption: -4 }, tip: 'Varje domare redovisar sina tillgångar. Utom de som inte gör det.' },
      { text: 'ÅTALA HONOM OCH GÅ VIDARE', perm: { corruption: -2 }, temp: { approval: -2 }, tip: 'En köpt domare är en enskild händelse. Två är ett system.' },
    ],
  },
  {
    id: 'rat_court_packing', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'PARTIET VILL BYTA UT DOMARNA',
    text: 'Högsta domstolen har stoppat tre av regeringens lagar. Ditt partis ledning kräver att du sänker domarnas pensionsålder och tillsätter nya, lojala domare.',
    when: (c) => (c.is('government', 'hybrid', 'authoritarian') || c.is('party_loyalty', 'high', 'maximum')) && c.st.freedom < 15,
    choices: [
      { text: 'BYT UT DOMARNA', cost: { pp: 30 }, perm: { statepower: 8, freedom: -8, corruption: 4 }, rel: -8, tip: 'Lagarna går igenom. Rättsstaten går sönder.' },
      { text: 'SKRIV OM LAGARNA SÅ ATT DE HÅLLER', cost: { pp: 15 }, perm: { corruption: -2 }, temp: { statepower: 2 }, tip: 'Det tråkiga, rätta svaret.' },
      { text: 'RESPEKTERA DOMSTOLEN', temp: { statepower: -4, polpower: -5, approval: 3 }, tip: 'Partiet muttrar. Domstolen fortsätter att vara obekväm.' },
    ],
  },
  {
    id: 'rat_mafia_trial', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'MAFIARÄTTEGÅNGEN BÖRJAR',
    text: 'Över trehundra misstänkta medlemmar av samma kriminella nätverk ställs inför rätta samtidigt i en specialbyggd rättssal. Rättegången väntas pågå i över ett år.',
    when: (c) => c.st.safety < 0 && c.st.corruption > 10 && (c.ind.rulelaw ?? 0) > -1,
    choices: [
      { text: 'FULL FINANSIERING OCH SKYDD FÖR ÅKLAGARNA', cost: { money: 900 }, perm: { safety: 6, corruption: -5 }, tip: 'Dyrt, långsamt och det enda som någonsin har fungerat.' },
      { text: 'SÄND RÄTTEGÅNGEN I TV', cost: { pp: 10 }, temp: { approval: 6, safety: 3 }, tip: 'Folket följer den som en tv-serie. Vittnena önskar att de inte gjorde det.' },
      { text: 'DELA UPP DET I SMÅ MÅL', perm: { safety: 2, corruption: 2 }, tip: 'Billigare. Men ingen ser längre helheten.' },
    ],
  },
  {
    id: 'rat_clemency', icon: '\u{1F58B}\u{FE0F}', weight: 2,
    title: 'NÅDEANSÖKAN PÅ DITT BORD',
    text: 'En dödsdömd man har suttit i tjugo år och blivit en uppskattad författare i fängelset. Hans nådeansökan har fått stöd från hela världen, och beslutet måste fattas inom en vecka.',
    when: (c) => c.is('death_penalty', 'inuse', 'highlyinuse', 'majority') && c.st.freedom > -30,
    choices: [
      { text: 'BEVILJA NÅD', cost: { pp: 15 }, temp: { statepower: -3 }, rel: 6, tip: 'Världen applåderar. Dina anhängare gör det inte.' },
      { text: 'AVSLÅ', temp: { statepower: 4 }, rel: -8, tip: 'Lagen är lagen. Omvärlden minns.' },
      { text: 'STOPPA DÖDSSTRAFFET I FREDSTID', cost: { pp: 30 }, law: ['death_penalty', 'exceptional'], temp: { safety: -2 }, rel: 10, tip: 'Lagen finns kvar på papperet. Den används inte.' },
    ],
  },
  {
    id: 'rat_death_penalty_demand', icon: '\u{1F4DC}', weight: 2,
    title: 'KRAV PÅ ATT ÅTERINFÖRA DÖDSSTRAFFET',
    text: 'Efter en serie uppmärksammade mord har ett upprop om att återinföra dödsstraffet fått över en miljon namnunderskrifter. Ditt eget parti är splittrat i frågan.',
    when: (c) => c.is('death_penalty', 'notinuse') && ((c.ind.homicide ?? 2) > 10 || c.st.safety < -35),
    choices: [
      { text: 'DÖDSSTRAFF FÖR DE GROVASTE BROTTEN', cost: { pp: 30 }, law: ['death_penalty', 'balanced'], temp: { approval: 6 }, rel: -8, tip: 'Uppropet vinner. Diplomaterna förlorar.' },
      { text: 'LIVSTID UTAN MÖJLIGHET TILL FRIGIVNING', cost: { pp: 15 }, perm: { safety: 2 }, temp: { approval: 3, freedom: -2 }, tip: 'Hårt nog för uppropet. Nästan.' },
      { text: 'NEJ - STATEN DÖDAR INTE', temp: { approval: -5 }, perm: { freedom: 2 }, rel: 3, tip: 'Principen står fast. Opinionen tycker annorlunda.' },
    ],
  },

  // ================= POLISEN =================
  {
    id: 'rat_police_video', icon: '\u{1F4F2}', weight: 2,
    title: 'FILMEN PÅ POLISINGRIPANDET',
    text: 'En mobilfilm visar hur poliser håller ner en obeväpnad tonåring mot asfalten långt efter att han slutat göra motstånd. Filmen har setts tio miljoner gånger på ett dygn.',
    when: (c) => c.st.freedom > -25 && c.st.statepower > 20 && (c.ind.internet ?? 60) > 60,
    choices: [
      { text: 'ÅTALA POLISERNA', cost: { pp: 15 }, temp: { approval: 5, statepower: -4 }, tip: 'Polisfacket protesterar. Gatan lugnar sig.' },
      { text: 'KROPPSKAMEROR PÅ ALLA POLISER', cost: { money: 500 }, perm: { freedom: 3, safety: 2 }, tip: 'Nästa gång finns filmen redan. Från rätt håll.' },
      { text: 'STÖTTA POLISEN OFFENTLIGT', temp: { unrest: 8, approval: -4, statepower: 4 }, tip: 'Polisen tackar dig. Ingen annan gör det.' },
    ],
  },
  {
    id: 'rat_police_payroll', icon: '\u{1F4B5}', weight: 2,
    title: 'POLISER PÅ GÄNGENS LÖNELISTA',
    text: 'En internutredning visar att ett tiotal poliser har sålt uppgifter ur polisens register till kriminella nätverk. Flera pågående utredningar har läckt till de misstänkta.',
    when: (c) => c.st.corruption > 20 && c.st.safety < 15,
    choices: [
      { text: 'STOR RENSNING INOM KÅREN', cost: { pp: 20 }, perm: { corruption: -6 }, temp: { statepower: -3, safety: -2 }, tip: 'De ärliga poliserna känner sig misstänkta. Det är de också.' },
      { text: 'HÖJ POLISLÖNERNA', cost: { money: 700 }, perm: { corruption: -4, safety: 2 }, tip: 'Svårare att köpa den som redan har råd.' },
      { text: 'HANTERA DET TYST INTERNT', perm: { corruption: 3 }, mod: 'cover_up', tip: 'Inget läcker om läckorna. Den här gången.' },
    ],
  },

  // ================= CYBERBROTT & BEDRÄGERIER =================
  {
    id: 'rat_ransomware', icon: '\u{1F4BB}', weight: 2,
    title: 'HACKARE UTPRESSAR SJUKHUSEN',
    text: 'En utpressningsattack har låst datorerna på sjukhusen i tre regioner. Planerade operationer skjuts upp och journaler går inte att läsa. Hackarna kräver betalt i kryptovaluta inom två dygn.',
    when: (c) => (c.ind.internet ?? 60) > 85 && c.res('espionage') < 3,
    choices: [
      { text: 'BETALA LÖSENSUMMAN', cost: { money: 600 }, temp: { qol: 3 }, perm: { safety: -3 }, tip: 'Datorerna låses upp. Hackarna antecknar ditt namn.' },
      { text: 'BYGG OM SYSTEMEN FRÅN GRUNDEN', cost: { money: 700, rp: 30 }, temp: { qol: -5 }, perm: { safety: 3 }, tip: 'En vecka med papper och penna. Sedan är systemen säkrare.' },
      { text: 'VÄGRA OCH VÄNTA', temp: { qol: -8, hdi: -3, approval: -5 }, tip: 'Personalen skriver journaler för hand. Hackarna försöker igen.' },
    ],
  },
  {
    id: 'rat_phone_scams', icon: '\u{260E}\u{FE0F}', weight: 2,
    title: 'BEDRAGARE TÖMMER PENSIONÄRERNAS KONTON',
    text: 'Kriminella ringer äldre människor och utger sig för att vara deras bank. På ett år har pensionärer lurats på stora summor, och de flesta pengarna går aldrig att få tillbaka.',
    when: (c) => (c.ind.old ?? 8) > 15 && (c.ind.internet ?? 60) > 70 && c.st.safety < 20,
    choices: [
      { text: 'BANKERNA SKA ERSÄTTA DE DRABBADE', cost: { pp: 20 }, perm: { safety: 3 }, temp: { gdp: -2 }, tip: 'Bankerna bygger plötsligt mycket bättre spärrar.' },
      { text: 'EN NATIONELL BEDRÄGERIENHET', cost: { money: 500 }, perm: { safety: 3 }, tip: 'Bedragarna sitter i ett annat land. Enheten vet åtminstone vilket.' },
      { text: 'INFORMATIONSKAMPANJ I TV', temp: { safety: 2, approval: -3 }, tip: 'Lägg på luren. Så enkelt, och så svårt.' },
    ],
  },

  // ================= SMUGGLING & MÄNNISKOHANDEL =================
  {
    id: 'rat_smuggled_people', icon: '\u{1F69A}', weight: 2,
    title: 'MÄNNISKOSMUGGLARE STOPPAS VID GRÄNSEN',
    text: 'Gränspolisen har hittat fyrtio människor gömda i en lastbil med kylaggregat. Alla klarade sig, men smugglarna tar betalt för resan med skulder som tar år att arbeta av.',
    when: (c) => (c.is('immigration', 'restricted', 'closed', 'deportation') || c.mod('border_crisis')) && c.st.immigration > -20,
    choices: [
      { text: 'KROSSA SMUGGLARNÄTVERKEN MED GRANNLÄNDERNA', cost: { pp: 15, money: 300 }, perm: { safety: 3 }, rel: 5, tip: 'Ett nätverk faller. Ett nytt tar över rutten.' },
      { text: 'ÖPPNA LAGLIGA VÄGAR IN FÖR FLYKTINGAR', cost: { pp: 25 }, law: ['immigration', 'humanitarian'], perm: { safety: 2 }, tip: 'Smugglarna förlorar sina kunder. Gränsen får nya besökare.' },
      { text: 'SKICKA TILLBAKA ALLA', temp: { immigration: -6, approval: 2 }, rel: -6, tip: 'Lastbilen töms. Smugglarna fyller en ny.' },
    ],
  },
  {
    id: 'rat_forced_labor', icon: '\u{1F3D7}\u{FE0F}', weight: 2,
    title: 'TVÅNGSARBETE PÅ BYGGARBETSPLATSERNA',
    text: 'Arbetsmiljöinspektörer har hittat utländska byggarbetare som bor i containrar, saknar pass och inte fått lön på månader. Byggbolaget hyrde dem via tre led av underentreprenörer.',
    when: (c) => (c.is('minimum_wage', 'low', 'none') || (c.is('unions', 'weak', 'banned') && c.st.immigration > 10)) && c.st.corruption > -10,
    choices: [
      { text: 'BESTÄLLAREN ANSVARAR FÖR HELA KEDJAN', cost: { pp: 20 }, perm: { corruption: -4 }, temp: { factory: -3 }, tip: 'Byggpriserna stiger. Containrarna töms.' },
      { text: 'RAZZIOR PÅ BYGGARBETSPLATSERNA', cost: { money: 400 }, perm: { safety: 2 }, temp: { factory: -2, immigration: -3 }, tip: 'Arbetarna utvisas. Byggbolaget hittar nya.' },
      { text: 'DET ÄR EN FRÅGA FÖR FACKET', perm: { corruption: 3 }, temp: { integration: -3 }, tip: 'Facket har inga medlemmar där. Det är lite poängen.' },
    ],
  },
  {
    id: 'rat_cigarette_smuggling', icon: '\u{1F6AC}', weight: 2,
    title: 'SMUGGELCIGARETTER SÄLJS ÖPPET',
    text: 'Var fjärde cigarett som röks i landet är insmugglad. De säljs på torgen för halva priset, och skatten går i stället till kriminella nätverk som också smugglar vapen.',
    when: (c) => (c.ind.smoking ?? 18) > 22 && (c.is('taxes', 't40', 't60') || c.st.corruption > 15),
    choices: [
      { text: 'SÄNK TOBAKSSKATTEN', temp: { income: -4 }, perm: { safety: 2, hdi: -1 }, tip: 'Smugglarna förlorar marknaden. Lungorna förlorar också.' },
      { text: 'FLER TULLARE VID GRÄNSEN', cost: { money: 500 }, perm: { safety: 2, income: 2 }, tip: 'Beslagen ökar. Priserna på torget också.' },
      { text: 'LÅT DET VARA', perm: { corruption: 2 }, temp: { income: -3 }, tip: 'Det är bara cigaretter. Tills det inte är det.' },
    ],
  },
  {
    id: 'rat_arms_from_war', icon: '\u{1F4E6}', weight: 2,
    title: 'VAPEN SMUGGLAS IN FRÅN KRIGSZONEN',
    text: 'Automatvapen och handgranater från ett krig i en närliggande region dyker upp hos landets kriminella. De säljs för en bråkdel av vad en ny mobiltelefon kostar.',
    when: (c) => (c.atWar && c.st.safety < 15) || ((c.ind.polstab ?? 0) < -1 && c.st.corruption > 0),
    choices: [
      { text: 'STÄNG GRÄNSEN FÖR ALL LASTTRAFIK', cost: { pp: 20 }, temp: { safety: 5, gdp: -6 }, tip: 'Inga vapen kommer in. Inga varor heller.' },
      { text: 'SPECIALENHET MOT VAPENSMUGGLING', cost: { money: 300, man: 5 }, perm: { safety: 4 }, tip: 'Den stoppar en lastbil av tio. Det är ändå en lastbil.' },
      { text: 'DET ÄR GRANNLANDETS PROBLEM', perm: { safety: -5 }, tip: 'Vapnen bryr sig inte om gränser.' },
    ],
  },

  // ================= UPPLOPP & OLUGN =================
  {
    id: 'rat_police_shooting_riot', icon: '\u{1F525}', weight: 2,
    title: 'DÖDSSKOTTET SOM TÄNDE FÖRORTEN',
    text: 'En polis har skjutit en nittonåring vid en trafikkontroll, och vittnen säger att han var obeväpnad. Sedan dess har ungdomar i förorten bränt bilar och kastat sten mot polisen i två nätter.',
    when: (c) => c.st.unrest > 15 && c.st.integration < -5,
    choices: [
      { text: 'OBEROENDE UTREDNING AV SKOTTET', cost: { pp: 15 }, temp: { unrest: -8, statepower: -3 }, tip: 'Polisfacket rasar. Gatan väntar på resultatet.' },
      { text: 'SAMTAL MED FÖRORTENS FÖRENINGAR', cost: { money: 400 }, temp: { unrest: -6 }, perm: { integration: 3 }, tip: 'De lokala ledarna får en röst. Och en budget.' },
      { text: 'NOLLTOLERANS MOT KRAVALLERNA', temp: { safety: 4, unrest: 6, freedom: -4 }, tip: 'Många gripna stenkastare. Ingen fråga besvarad.' },
    ],
  },
  {
    id: 'rat_hooligans', icon: '\u{26BD}', weight: 2,
    title: 'HULIGANERNA DRABBADE SAMMAN',
    text: 'Hundratals supportrar från två rivaliserande fotbollsklubbar slogs i centrum inför derbyt. Polisen fick spärra av halva staden, och matchen spelades inför tomma läktare.',
    when: (c) => c.st.unrest > 10 && c.st.safety < 10 && c.st.statepower < 30,
    choices: [
      { text: 'LEGITIMATIONSKRAV OCH ARENAFÖRBUD', cost: { pp: 15 }, perm: { safety: 2 }, temp: { freedom: -3 }, tip: 'Biljetten kräver legitimation. Klacken sjunger nidvisor om dig.' },
      { text: 'KLUBBARNA FÅR BETALA POLISINSATSERNA', res: { money: 300 }, temp: { unrest: 3, approval: -2 }, tip: 'Klubbarna höjer biljettpriserna. Alla supportrar betalar.' },
      { text: 'DERBYN SPELAS UTAN PUBLIK', temp: { safety: 3, approval: -5 }, tip: 'Lugnt på stan. Tyst på arenan.' },
    ],
  },

  // ================= TERRORHOT =================
  {
    id: 'rat_plot_foiled', icon: '\u{1F575}\u{FE0F}', weight: 2,
    title: 'ATTENTATSPLANER HAR AVVÄRJTS',
    text: 'Säkerhetstjänsten har gripit fyra personer som planerade ett attentat mot en konsert i huvudstaden. Tipset kom från en utländsk underrättelsetjänst, bara dagar före konserten.',
    when: (c) => c.is('surveillance', 'warrant', 'targeted') && c.st.safety < 0 && (c.st.unrest > 15 || c.atWar),
    choices: [
      { text: 'BERÄTTA ALLT FÖR ALLMÄNHETEN', temp: { approval: 6, qol: -3 }, tip: 'Folket litar på säkerhetstjänsten. Och slutar gå på konserter.' },
      { text: 'UTÖKADE BEFOGENHETER FÖR SÄKERHETSTJÄNSTEN', cost: { pp: 25 }, law: ['surveillance', 'mass'], temp: { approval: 3 }, tip: 'Den här gången räckte det gamla. Nästa gång kanske inte.' },
      { text: 'FÖRDJUPA SAMARBETET MED DEN UTLÄNDSKA TJÄNSTEN', cost: { pp: 10 }, temp: { safety: 3 }, rel: 6, tip: 'Ett samarbete som byggs i det tysta.' },
    ],
  },
  {
    id: 'rat_threat_level', icon: '\u{26A0}\u{FE0F}', weight: 2,
    title: 'TERRORHOTNIVÅN HÖJS TILL DEN HÖGSTA',
    text: 'Säkerhetstjänsten bedömer att ett attentat kan vara nära förestående och höjer hotnivån för första gången i landets historia. Nationaldagsfirandet ska hållas på landets största torg om tre dagar.',
    when: (c) => (c.atWar && c.st.unrest > 0) || (c.st.unrest > 30 && c.st.safety < 0),
    choices: [
      { text: 'SOLDATER PÅ GATORNA', cost: { man: 6 }, temp: { safety: 6, freedom: -4, qol: -2 }, tip: 'Tryggt och skrämmande på samma gång.' },
      { text: 'STÄLL IN FIRANDET', temp: { safety: 3, approval: -5, ideopower: -3 }, tip: 'Ingenting hände. Ingen vet om det var därför.' },
      { text: 'FIRA SOM VANLIGT - VI LÅTER OSS INTE SKRÄMMAS', cost: { pp: 15 }, temp: { approval: 6, stability: 3, safety: -3 }, tip: 'Ett modigt tal på ett fullsatt torg. Säkerhetschefen sover inte.' },
    ],
  },
  {
    id: 'rat_radicalization', icon: '\u{1F4AC}', weight: 2,
    title: 'UNGA RADIKALISERAS PÅ NÄTET',
    text: 'Säkerhetstjänsten varnar för att allt yngre personer dras in i våldsbejakande extremism via slutna chattgrupper. Den yngsta som gripits i år var fjorton år gammal.',
    when: (c) => (c.ind.internet ?? 60) > 80 && c.st.integration < -10 && c.is('internet', 'free', 'open', 'filtered'),
    choices: [
      { text: 'STÄNG NER FORUMEN', cost: { pp: 20 }, perm: { freedom: -4, safety: 3 }, tip: 'Forumen flyttar. Censuren stannar.' },
      { text: 'FÖREBYGGANDE ARBETE I SKOLORNA', cost: { money: 500 }, perm: { integration: 3, safety: 2 }, tip: 'Lärare som kan prata om det svåra. De är svåra att hitta.' },
      { text: 'LÅT SÄKERHETSTJÄNSTEN SKÖTA DET', perm: { freedom: -3 }, temp: { safety: 2 }, tip: 'Fler namn på listorna. Färre som frågar varför.' },
    ],
  },

  // ================= LAGLÖSHET & POLISSTAT =================
  {
    id: 'rat_lawless_district', icon: '\u{1F3DA}\u{FE0F}', weight: 2,
    title: 'POLISEN HAR LÄMNAT STADSDELEN',
    text: 'I en stor förort kör polisen bara in med flera bilar samtidigt, och ambulanser väntar på eskort. Ett kriminellt nätverk tar ut egna avgifter av butikerna och sätter upp egna regler.',
    when: (c) => c.mod('lawless') || (c.st.safety < -35 && c.st.statepower < 10),
    choices: [
      { text: 'ÅTERTA STADSDELEN MED EN STOR POLISINSATS', cost: { money: 800, man: 6 }, perm: { safety: 6 }, temp: { unrest: 6 }, unmod: 'lawless', tip: 'Polisen är tillbaka. Frågan är hur länge.' },
      { text: 'NÄRPOLIS, SKOLA OCH VÅRDCENTRAL', cost: { money: 1000 }, perm: { safety: 4, integration: 4 }, tip: 'Långsamt och rätt. Gängen ser det också.' },
      { text: 'LÅT DE LOKALA LEDARNA STYRA', perm: { statepower: -5, corruption: 3 }, mod: 'lawless', tip: 'Lugnt på ytan. Staten slutar vid motorvägen.' },
    ],
  },
  {
    id: 'rat_informers', icon: '\u{1F442}', weight: 2,
    title: 'GRANNARNA ANGER VARANDRA',
    text: 'Antalet anmälningar till säkerhetspolisen har tiodubblats sedan en belöning infördes. Många handlar om grannfejder och arvstvister, men varje anmälan måste utredas.',
    when: (c) => c.ideo !== 'fascism' && c.mod('police_state') || c.is('surveillance', 'total'),
    choices: [
      { text: 'AVSKAFFA BELÖNINGARNA OCH ANGIVARREGISTRET', cost: { pp: 25 }, temp: { statepower: -6, approval: 4 }, unmod: 'police_state', tip: 'Folk börjar hälsa på varandra igen.' },
      { text: 'STRAFFA FALSKA ANMÄLNINGAR', cost: { pp: 10 }, perm: { corruption: -2 }, temp: { freedom: 2 }, tip: 'Det räcker med att veta att någon har anmält någon.' },
      { text: 'LÅT ANMÄLNINGARNA STRÖMMA IN', temp: { statepower: 5, freedom: -6, approval: -4 }, mod: 'police_state', tip: 'Ingen vet vem som har skrivit om vem. Det är hela poängen.' },
    ],
  },
  {
    id: 'rat_secret_police', icon: '\u{1F576}\u{FE0F}', weight: 2,
    title: 'SÄKERHETSPOLISEN GRIPER EN MINISTER',
    text: 'Säkerhetspolisen har gripit din egen handelsminister för samröre med fientliga makter, utan att fråga dig först. Bevisen är tunna, och säkerhetschefen har plötsligt blivit landets mäktigaste person.',
    when: (c) => c.mod('police_state') || (c.is('government', 'authoritarian', 'totalitarian', 'junta') && c.is('surveillance', 'mass', 'total')),
    choices: [
      { text: 'AVSKEDA SÄKERHETSCHEFEN', cost: { pp: 30 }, temp: { statepower: -6, stability: -4 }, perm: { freedom: 3 }, tip: 'Han lämnar sitt kontor med en mapp under armen. Vad står det i den?' },
      { text: 'SLÄPP MINISTERN OCH TYST NER SAKEN', cost: { pp: 15 }, temp: { stability: 3 }, mod: 'cover_up', tip: 'Två makthavare som vet för mycket om varandra.' },
      { text: 'LÅT RÄTTVISAN HA SIN GÅNG', perm: { statepower: 4, freedom: -5 }, temp: { approval: -3 }, tip: 'Ministern döms. Ingen minister vågar säga emot längre.' },
    ],
  },

  // ================= TRYGGHET =================
  {
    id: 'rat_safest_city', icon: '\u{1F3C6}', weight: 1,
    title: 'VÄRLDENS TRYGGASTE HUVUDSTAD',
    text: 'En internationell jämförelse rankar din huvudstad som den tryggaste i världen. Turistbyråerna jublar, och finansministern frågar om polisbudgeten verkligen behöver vara så stor.',
    when: (c) => c.st.safety > 30 && (c.ind.homicide ?? 3) < 2.5,
    choices: [
      { text: 'MARKNADSFÖR LANDET FÖR TURISTER', cost: { money: 300 }, temp: { gdp: 4, approval: 3 }, rel: 4, tip: 'Trygghet säljer. Bättre än stränder ibland.' },
      { text: 'SKÄR I POLISBUDGETEN', res: { money: 500 }, perm: { safety: -4 }, tip: 'Tryggheten var aldrig gratis. Nu får vi se vad den kostade.' },
      { text: 'TACKA POLISEN OCH GÅ VIDARE', temp: { approval: 3, statepower: 2 }, tip: 'Ett pressmeddelande och en tårta.' },
    ],
  },
  {
    id: 'rat_vigilantes', icon: '\u{1F526}', weight: 2,
    title: 'MEDBORGARGARDEN PATRULLERAR GATORNA',
    text: 'Grupper av beväpnade frivilliga har börjat patrullera bostadsområden på nätterna, eftersom polisen sällan kommer när man ringer. Några av dem har redan gripit personer på egen hand.',
    when: (c) => c.st.safety < -15 && (c.is('firearms', 'free', 'licensed') || c.st.statepower < -15),
    choices: [
      { text: 'FÖRBJUD PATRULLERNA', cost: { pp: 15 }, temp: { statepower: 4, approval: -3, safety: -2 }, tip: 'De går hem. Vapnen tar de med sig.' },
      { text: 'GÖR DEM TILL UTBILDADE ORDNINGSVAKTER', cost: { money: 500 }, perm: { safety: 4, statepower: 2 }, tip: 'Med uniform och regler blir de nästan poliser.' },
      { text: 'LÅT DEM HÅLLA PÅ', temp: { safety: 3 }, perm: { statepower: -4, freedom: -2 }, tip: 'Rättvisan har fått nya utövare. Utan utbildning.' },
    ],
  },
  {
    id: 'rat_protection_racket', icon: '\u{1F37D}\u{FE0F}', weight: 2,
    title: 'KROGARNA BETALAR BESKYDDARPENGAR',
    text: 'Restaurangägare i flera städer berättar att de tvingas betala en månadsavgift till kriminella för att få vara i fred. De som vägrar får sina fönsterrutor krossade.',
    when: (c) => c.st.safety < -5 && c.st.corruption > 5,
    choices: [
      { text: 'HEMLIG UTREDNINGSGRUPP', cost: { money: 500 }, perm: { safety: 4, corruption: -3 }, tip: 'Ägarna vågar inte vittna. Men de vågar svara i telefon.' },
      { text: 'STATEN ERSÄTTER SKADORNA', cost: { money: 300 }, temp: { approval: 4, gdp: 2 }, tip: 'Staten betalar de krossade rutorna. Gängen ser ingen anledning att sluta.' },
      { text: 'UPPMANA DEM ATT ANMÄLA', temp: { safety: -3, approval: -3 }, tip: 'Anmälningar kräver modiga anmälare.' },
    ],
  },
];
