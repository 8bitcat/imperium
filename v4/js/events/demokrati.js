// IMPERIUM V5.16 — HÄNDELSER: DEMOKRATI.
// Val och valdeltagande, valobservatörer, omstridda resultat och omräkningar, den årliga
// demokratirapporten (The Economists skala 0–10: över 8 full demokrati, 6–8 bristfällig
// demokrati, 4–6 hybridregim, under 4 auktoritär regim), domstolar och grundlag under tryck,
// grävande journalistik, korruption och lobbyism, oppositionen och civilsamhället,
// folkomröstningar, omvärldens reaktioner, kupper och kupprykten, auktoritära stater som
// öppnar sig och lågt förtroende (proteströster, populism, konspirationsteorier).
// Grundtanken: demokrati lönar sig på lång sikt (stabilitet, förtroende, investeringar,
// relationer till omvärlden). Hårda tag ger lugn i dag till ett högt pris i morgon.
// Signaler: c.demo, c.trend('demo'), c.ind.demo_* (delindex), turnout, trustgov, trustparl,
// trustcourt, pressfree, polprisoners, c.grievOf('frihet') och ändringar av frihetslagarna.
export const EVENTS = [

  // ===== VALEN =====
  {
    id: 'dmk_valdag_koer', icon: '\u{1F5F3}\u{FE0F}', weight: 2, cooldown: 700, kind: 'frihet',
    title: 'KÖERNA RINGLAR SIG RUNT SKOLORNA',
    text: 'Det är valdag och vallokalerna i {stad} har inte varit så fulla på trettio år. Klockan sju på kvällen står fortfarande hundratals människor i kö utanför gymnastiksalarna, med termosar och hopfällbara stolar. Valförrättarna ringer valmyndigheten och frågar om de får hålla öppet tills alla har röstat.',
    when: (c) => c.demo > 5.5 && (c.ind.turnout ?? 65) > 72 && c.day > 90,
    choices: [
      { text: 'ALLA SOM STÅR I KÖ KLOCKAN ÅTTA FÅR RÖSTA', cost: { money: 60 }, temp: { approval: 3 }, ind: { turnout: 2, trustgov: 2 }, tip: 'Valförrättarna får övertid. Demokratin får en bra kväll.' },
      { text: 'SKICKA FLER VALFÖRRÄTTARE OCH VALURNOR', cost: { money: 150 }, perm: { stability: 1 }, ind: { turnout: 3, trustgov: 3 }, tip: 'Nästa gång går det fortare. Folk minns sådant.' },
      { text: 'REGLERNA SÄGER ATT VI STÄNGER KLOCKAN ÅTTA', temp: { approval: -3, unrest: 2 }, ind: { turnout: -2, trustgov: -3 }, tip: 'Paragrafen följdes. Tretusen väljare gick hem.' },
    ],
  },
  {
    id: 'dmk_lagt_valdeltagande', icon: '\u{1F4C9}', weight: 2, cooldown: 800, kind: 'frihet',
    title: 'VALDELTAGANDET HAR ALDRIG VARIT LÄGRE',
    text: 'Valdeltagandet blev det lägsta sedan allmän rösträtt infördes. I förorterna till {huvudstad} röstade knappt var tredje. Statsvetarna talar om en tyst skilsmässa mellan folket och politiken, och den nya regeringen har stöd av en minoritet av de röstberättigade.',
    when: (c) => (c.ind.turnout ?? 65) < 50 && c.demo > 3 && c.day > 90,
    choices: [
      { text: 'RÖSTA-KAMPANJ I SKOLOR, PÅ BUSSAR OCH I APPAR', cost: { money: 150 }, ind: { turnout: 3, trustgov: 1 }, tip: 'Affischer fixar inte förtroende. Men de påminner.' },
      { text: 'FÖRTIDSRÖSTNING I BIBLIOTEK OCH MATAFFÄRER', cost: { money: 120, pp: 10 }, perm: { stability: 1 }, ind: { turnout: 4 }, tip: 'Rösta mellan mjölken och brödet. Det fungerar, visar forskningen.' },
      { text: 'INFÖR RÖSTPLIKT MED BÖTER', cost: { pp: 25 }, law: ['elections', 'compulsory'], temp: { approval: -4 }, ind: { turnout: 8 }, tip: 'Alla röstar. Inte alla gillar det.' },
      { text: 'ETT MANDAT ÄR ETT MANDAT', temp: { polpower: 3 }, perm: { stability: -1 }, ind: { trustgov: -3 }, tip: 'Formellt helt rätt. Politiskt en tickande bomb.' },
    ],
  },
  {
    id: 'dmk_valobservatorer', icon: '\u{1F50E}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'VALOBSERVATÖRERNA VILL KOMMA',
    text: 'En internationell organisation vill skicka 300 valobservatörer till valet om två månader. De vill besöka vallokaler på landsbygden, granska röstlängderna och se när rösterna räknas i {stad}. Inrikesministeriet varnar för att de kommer att "hitta det de letar efter".',
    when: (c) => c.demo > 3.5 && c.demo < 7 && c.day > 150,
    choices: [
      { text: 'VÄLKOMNA DEM. DE FÅR ÅKA VART DE VILL', cost: { pp: 5 }, perm: { stability: 1 }, rel: 5, ind: { trustgov: 2, demo: 0.2 }, tip: 'Den som inte har något att dölja bjuder in granskare.' },
      { text: 'SLÄPP IN DEM MEN STYR VILKA VALLOKALER DE SER', temp: { statepower: 2 }, rel: -2, ind: { demo: -0.1 }, tip: 'Observatörer märker sådant. Det står i rapporten.' },
      { text: 'NEKA DEM VISUM', temp: { statepower: 3, freedom: -2 }, rel: -8, ind: { demo: -0.3, trustgov: -2 }, tip: 'Ett val utan vittnen. Omvärlden drar sina slutsatser.' },
    ],
  },
  {
    id: 'dmk_valobs_rapport', icon: '\u{1F4CB}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'OBSERVATÖRERNAS RAPPORT SVIDER',
    text: 'Valobservatörerna har lämnat sin slutrapport: valet var "välorganiserat men inte rättvist". De pekar på statstelevisionens ensidiga bevakning, röstlängder med avlidna väljare och oppositionskandidater som stoppades på tekniska grunder. Rapporten läses nu i varje huvudstad som lånar ut pengar till {rike}.',
    when: (c) => c.demo > 2 && c.demo < 6.5 && (c.ind.demo_el ?? 5) < 6 && c.day > 150,
    choices: [
      { text: 'GENOMFÖR ALLA TJUGO REKOMMENDATIONER', cost: { pp: 25 }, temp: { polpower: -4 }, perm: { stability: 2, freedom: 2 }, rel: 6, ind: { demo: 0.5, trustgov: 3 }, tip: 'Nästa val blir svårare att vinna. Och lättare att lita på.' },
      { text: 'RENSA RÖSTLÄNGDERNA OCH GE OPPOSITIONEN SÄNDNINGSTID', cost: { money: 150 }, rel: 3, ind: { demo: 0.3, pressfree: 2 }, tip: 'Två av tjugo. Men de två som syntes mest.' },
      { text: 'KALLA RAPPORTEN PARTISK', temp: { ideopower: 3 }, rel: -6, ind: { trustgov: -2 }, tip: 'Hemma tror vissa på dig. Långivarna gör det inte.' },
    ],
  },
  {
    id: 'dmk_valhack', icon: '\u{1F4BB}', weight: 2, cooldown: 900,
    title: 'INTRÅNG I VALMYNDIGHETENS SYSTEM',
    text: 'Två veckor före valet upptäcker valmyndigheten att någon har varit inne i systemet för röstlängderna. Inga röster är ändrade, säger teknikerna, men loggarna pekar mot en server i {land}. Om det läcker ut kommer hälften av väljarna att tvivla på resultatet, vad det än blir.',
    when: (c) => c.demo > 5 && (c.ind.internet ?? 60) > 70 && c.st.stability < 40 && c.day > 200,
    choices: [
      { text: 'BERÄTTA ALLT OCH RÄKNA RÖSTERNA FÖR HAND', cost: { money: 250 }, temp: { approval: 2 }, perm: { stability: 1 }, ind: { trustgov: 3 }, tip: 'Långsamt, dyrt och omöjligt att hacka.' },
      { text: 'PEKA UT ANGRIPAREN INFÖR HELA VÄRLDEN', cost: { pp: 10 }, temp: { approval: 4, ideopower: 2 }, rel: -4, ind: { trustgov: 1 }, tip: 'Ett gemensamt hot samlar väljarna. För en tid.' },
      { text: 'TÄPP TILL HÅLET I TYSTHET', temp: { stability: 2 }, mod: 'cover_up', tip: 'Ingen vet. Tills någon vet.' },
    ],
  },

  // ===== DE UNGA VÄLJARNA (kedja) =====
  {
    id: 'dmk_forstagangsvaljare', icon: '\u{1F393}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'REKORDMÅNGA FÖRSTAGÅNGSVÄLJARE',
    text: 'Gymnasieeleverna i {stad} gick till vallokalen i samlad tropp efter sista lektionen, och i hela landet röstade fler förstagångsväljare än någonsin. Bostäder, klimat och jobb toppade deras lista. På sociala medier sprids bilder av valsedlar med texten "nu får ni lyssna på oss".',
    when: (c) => c.demo > 5 && (c.ind.youth ?? 14) > 13 && c.day > 100,
    choices: [
      { text: 'SKOLVAL OCH DEBATTER PÅ VARJE GYMNASIUM', cost: { money: 100 }, perm: { stability: 1 }, ind: { turnout: 2 }, next: ['dmk_unga_parti', null], tip: 'Den som röstar som ung röstar ofta hela livet.' },
      { text: 'SÄNK RÖSTRÄTTSÅLDERN TILL 16', cost: { pp: 30 }, law: ['voting_age', 'age16'], temp: { approval: 2 }, ind: { turnout: 2 }, next: 'dmk_unga_parti', tip: 'Ännu fler unga röster. Ännu fler krav.' },
      { text: 'GLÄDJ DIG I TYSTHET', temp: { approval: 1 }, next: ['dmk_unga_parti', null], tip: 'De märkte att du inte sa något.' },
    ],
  },
  {
    id: 'dmk_unga_parti', icon: '\u{1F4F1}', chain: true, kind: 'frihet',
    title: 'PARTIET SOM STARTADE I EN GRUPPCHATT',
    text: 'Tre studenter från {stad} startade ett parti i en gruppchatt i våras. Nu har det sex procent i mätningarna, nästan bara bland väljare under trettio. Partiledaren är 22 år, svarar på frågor i direktsändning varje kväll och har lovat att "aldrig bli som de gamla".',
    choices: [
      { text: 'BJUD IN DEM TILL SAMTAL OM BOSTÄDER OCH KLIMAT', cost: { pp: 10 }, temp: { approval: 3 }, ind: { trustgov: 2, turnout: 1 }, tip: 'De kom med en lista på fyrtio punkter. Och kanelbullar.' },
      { text: 'ANTA TVÅ AV DERAS FÖRSLAG', cost: { pp: 20 }, temp: { polpower: -3 }, perm: { stability: 1, freedom: 1 }, ind: { turnout: 2, trustgov: 2 }, tip: 'De unga märker att rösten gjorde skillnad. Det håller i decennier.' },
      { text: 'AVFÄRDA DEM SOM SKOLBARN', temp: { unrest: 3, approval: -2 }, ind: { trustgov: -3 }, tip: 'Sex procent blev tio. Tack för reklamen.' },
    ],
  },

  // ===== DET OMSTRIDDA VALET (kedja) =====
  {
    id: 'dmk_val_omtvistat', icon: '\u{2696}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'VALRESULTATET ÄR FÖR JÄMNT',
    text: 'När den sista valkretsen är räknad skiljer det 0,3 procent mellan regeringen och oppositionen. Oppositionsledaren har redan utropat sig till segrare och säger att tusentals röster i {stad} "försvunnit på vägen". Valmyndigheten ber om arbetsro. Gatorna i {huvudstad} fylls av flaggor från båda sidor.',
    when: (c) => c.demo > 3.5 && c.demo < 8.5 && c.st.approval < 10 && c.day > 200,
    choices: [
      { text: 'BEGÄR OMRÄKNING AV VARJE RÖST', cost: { money: 250 }, ind: { trustgov: 1 }, next: 'dmk_val_omrakning', tip: 'Tre veckor av räknande. Ingen sover.' },
      { text: 'LÅT VALDOMSTOLEN AVGÖRA', cost: { pp: 10 }, ind: { trustgov: 2 }, next: ['dmk_val_omrakning', 'dmk_val_gatorna'], tip: 'Domstolen är långsam. Gatan är det inte.' },
      { text: 'UTROPA DIG TILL SEGRARE I KVÄLL', temp: { statepower: 4 }, ind: { trustgov: -5, demo: -0.3 }, next: ['dmk_val_gatorna', null], tip: 'Först till mikrofonen vinner. Ibland.' },
    ],
  },
  {
    id: 'dmk_val_omrakning', icon: '\u{1F9EE}', chain: true, kind: 'frihet',
    title: 'OMRÄKNINGEN I {STAD}',
    text: 'I en idrottshall i {stad} sitter 400 valförrättare vid långbord och räknar valsedlar för hand, under ögonen på ombud från alla partier. Varje omstridd valsedel läggs i en egen låda. Efter tolv dagar ringer valmyndighetens chef: resultatet kommer i morgon, och hon vill veta om regeringen tänker godta det.',
    choices: [
      { text: 'VI GODTAR RESULTATET, VAD DET ÄN BLIR', tip: 'Att förlora ett val snyggt är också en seger. För landet.',
        risk: { chance: 0.55,
          win: { text: 'Regeringen vann med 4 112 röster. Oppositionen gratulerar, surt men tydligt.', temp: { approval: 5, stability: 4 }, ind: { trustgov: 4 } },
          lose: { text: 'Oppositionen vann med 112 röster. Nu får du regera i koalition med dem.', temp: { polpower: -10, stability: -2 }, ind: { demo: 0.3, trustgov: 4 } } } },
      { text: 'BJUD IN UTLÄNDSKA GRANSKARE TILL SISTA DYGNET', cost: { money: 120 }, perm: { stability: 1 }, rel: 5, ind: { trustgov: 3 }, tip: 'Med vittnen från fem länder bråkar ingen om en enda valsedel.' },
      { text: 'STOPPA OMRÄKNINGEN HALVVÄGS', temp: { statepower: 4, unrest: 6 }, ind: { trustgov: -6, demo: -0.5 }, next: 'dmk_val_gatorna', tip: 'De halvräknade lådorna blir en symbol. Någon fotograferar dem.' },
    ],
  },
  {
    id: 'dmk_val_gatorna', icon: '\u{26FA}', chain: true, kind: 'frihet',
    title: 'TÄLTLÄGRET I {HUVUDSTAD}',
    text: 'Tiotusentals oppositionsanhängare har slagit upp tält på stora torget i {huvudstad} och säger att de stannar tills valet görs om. Det finns soppkök, en scen och en generator som surrar hela natten. Butikerna runt torget har stängt och polisen frågar hur länge den ska stå och titta på.',
    choices: [
      { text: 'FÖRHANDLA FRAM OMVAL I DE OMSTRIDDA KRETSARNA', cost: { pp: 25 }, temp: { unrest: -6, stability: -2 }, ind: { demo: 0.3, trustgov: 3 }, next: ['dmk_val_forlikning', null], tip: 'Ingen vinner på kvällen. Alla vinner på sikt.' },
      { text: 'KRAVALLPOLIS IN I GRYNINGEN', next: ['dmk_val_kravall', null], tip: 'Snabbt eller katastrofalt. Sällan något mittemellan.',
        risk: { chance: 0.5,
          win: { text: 'Torget tömdes på en timme. Tälten lastades på flak och kördes bort.', temp: { stability: 4, statepower: 4 }, ind: { demo: -0.3 } },
          lose: { text: 'Bilderna av sköldar mot sovsäckar går jorden runt.', temp: { unrest: 10, approval: -5 }, mod: 'martyr', ind: { demo: -0.5, trustgov: -5 } } } },
      { text: 'VÄNTA UT DEM', temp: { unrest: 4, approval: -3 }, next: ['dmk_val_forlikning', 'dmk_val_kravall', null], tip: 'Tält blir kalla i november. Ilska blir det inte.' },
    ],
  },
  {
    id: 'dmk_val_forlikning', icon: '\u{1F91D}', chain: true, kind: 'frihet',
    title: 'FÖRLIKNINGEN EFTER VALET',
    text: 'Efter fem nätter av samtal i talmannens bibliotek finns ett utkast till överenskommelse. Oppositionen erkänner resultatet om valsystemet görs om före nästa val. Båda sidor behöver kunna gå ut till sina anhängare och säga att de vann.',
    choices: [
      { text: 'EN OBEROENDE VALMYNDIGHET OCH NYA VALREGLER', cost: { pp: 20 }, law: ['elections', 'free'], perm: { stability: 2 }, rel: 4, ind: { demo: 0.5, trustgov: 4 }, tip: 'Nästa val blir det första som båda sidor litar på.' },
      { text: 'EN SAMLINGSREGERING FRAM TILL NÄSTA VAL', cost: { pp: 15 }, temp: { unrest: -8, polpower: -6 }, ind: { trustgov: 5 }, tip: 'Två rivaler runt samma bord. Varje tisdag.' },
      { text: 'SKRIV UNDER OCH GLÖM BORT DET', temp: { unrest: -4 }, perm: { corruption: 1 }, ind: { trustgov: -3 }, next: ['dmk_val_kravall', null], tip: 'Ett löfte på papper håller tills någon läser det.' },
    ],
  },
  {
    id: 'dmk_val_kravall', icon: '\u{1F6A8}', chain: true, kind: 'frihet',
    title: 'KRAVALLERNA EFTER VALET',
    text: 'Det som började som fredliga protester har blivit nätter av kravaller i {stad} och {huvudstad}. Bilar brinner, fönster krossas och båda sidor anklagar varandra. Polischefen säger att hon inte har folk nog att hålla ordning i mer än en vecka till. Utländska ambassader ber sina medborgare stanna inomhus.',
    choices: [
      { text: 'NYVAL INOM 90 DAGAR', cost: { pp: 30 }, temp: { stability: -4, polpower: -8, unrest: -6 }, ind: { demo: 0.4, trustgov: 4 }, tip: 'Ett nytt val är det enda båda sidor kan gå med på.' },
      { text: 'UNDANTAGSTILLSTÅND', law: ['civil_rights', 'emergency'], temp: { stability: 6, unrest: -8, freedom: -6 }, rel: -6, ind: { demo: -0.8, pressfree: -4 }, griev: 8, tip: 'Lugnt på gatorna. Tyst i tidningarna. Kallt från omvärlden.' },
      { text: 'UTEGÅNGSFÖRBUD NATTETID I TVÅ VECKOR', temp: { unrest: -5, freedom: -3 }, ind: { demo: -0.3, protests: -30 }, tip: 'Kravallerna flyttar till eftermiddagen.' },
    ],
  },

  // ===== VALFUSKET (kedja) =====
  {
    id: 'dmk_valfusk_video', icon: '\u{1F4F9}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'FILMEN FRÅN VALLOKAL 14',
    text: 'En mobilfilm från en vallokal i {stad} har setts av två miljoner människor. Den visar två valförrättare som stoppar en bunt valsedlar i urnan när lokalen är tom. Filmen är suddig men klockan på väggen syns tydligt. Ditt partis lokalavdelning säger att det är ett montage.',
    when: (c) => c.demo > 2 && c.demo < 7.5 && c.st.corruption > 10 && (c.ind.demo_el ?? 5) < 7 && c.day > 100,
    choices: [
      { text: 'TILLSÄTT EN OBEROENDE UTREDNING', cost: { pp: 15 }, ind: { trustgov: 2 }, next: 'dmk_fusk_utredning', tip: 'Utredare som inte valts av dig. Det är poängen.' },
      { text: 'GRIP VALFÖRRÄTTARNA OCH GÖR OM VALET I LOKALEN', cost: { money: 100 }, perm: { corruption: -1 }, ind: { trustgov: 3, demo: 0.2 }, tip: 'Snabbt och tydligt. Men var det bara en lokal?' },
      { text: 'KALLA FILMEN ETT MONTAGE', mod: 'cover_up', ind: { trustgov: -4, pressfree: -2 }, next: ['dmk_fusk_tystnad', null], tip: 'Två miljoner tittare har nu en åsikt om montage.' },
    ],
  },
  {
    id: 'dmk_fusk_utredning', icon: '\u{1F4C2}', chain: true, kind: 'frihet',
    title: 'DET VAR INTE BARA EN VALLOKAL',
    text: 'Utredarna har gått igenom 900 vallokaler. I 41 av dem stämmer inte antalet valsedlar med antalet väljare, och spåren leder till samma regionkontor för ditt parti. Ingen tror att det ändrade valets utgång, men rapporten är 300 sidor lång och journalisterna har redan fått den.',
    choices: [
      { text: 'OFFENTLIGGÖR ALLT OCH LÅT PARTISEKRETERAREN GÅ', cost: { pp: 20 }, temp: { approval: -4, polpower: -5 }, perm: { corruption: -3 }, rel: 5, ind: { demo: 0.5, trustgov: 5 }, tip: 'Det gör ont i en månad. Sedan är det du som städade.' },
      { text: 'NYVAL I DE DRABBADE KRETSARNA', cost: { money: 300 }, temp: { stability: -2 }, ind: { demo: 0.4, trustgov: 4 }, tip: 'Fyrtioen vallokaler öppnar igen. Med dubbel bemanning.' },
      { text: 'PUBLICERA EN SAMMANFATTNING PÅ TRE SIDOR', perm: { corruption: 1 }, mod: 'cover_up', ind: { trustgov: -2 }, tip: 'De övriga 297 sidorna läcker på måndag.' },
    ],
  },
  {
    id: 'dmk_fusk_tystnad', icon: '\u{1F4E8}', chain: true, kind: 'frihet',
    title: 'VISSELBLÅSAREN PÅ VALMYNDIGHETEN',
    text: 'En handläggare på valmyndigheten har skickat interna mejl till en utländsk tidning. De visar att filmen från {stad} var äkta och att myndighetens ledning fick order att inte utreda. Hon har tagit ledigt och bor hos en väninna. Tidningen publicerar del två på söndag.',
    choices: [
      { text: 'SKYDDA HENNE OCH ERKÄNN FELET', cost: { pp: 20 }, law: ['anti_corruption', 'whistle'], temp: { approval: -4 }, rel: 6, ind: { demo: 0.4, trustgov: 3 }, tip: 'Visselblåsare som skyddas blir fler. Det är meningen.' },
      { text: 'KÖP HENNES TYSTNAD', cost: { money: 400 },
        risk: { chance: 0.5,
          win: { text: 'Hon tar pengarna och ett jobb utomlands. Del två publiceras aldrig.', temp: { stability: 2 }, perm: { corruption: 3 } },
          lose: { text: 'Hon publicerar erbjudandet också. Nu finns det en del tre.', mod: 'scandal', rel: -5, ind: { trustgov: -6 } } } },
      { text: 'ÅTALA HENNE FÖR LÄCKAN', mod: 'martyr', rel: -8, ind: { pressfree: -4, demo: -0.4 }, griev: 6, tip: 'Rättegången blir den bästa reklamen hennes mejl kunde få.' },
    ],
  },

  // ===== RÖSTRÄTTEN OCH VALLAGEN =====
  {
    id: 'dmk_rostratt_inskrankt', icon: '\u{1F6AB}', weight: 2, kind: 'frihet', react: true,
    title: 'DE SOM INTE FÅR RÖSTA LÄNGRE',
    text: 'Sedan ändringen av {lag} står hundratusentals människor utan rösträtt i nästa val. Studenter, pensionärer och unga arbetare köar på valmyndighetens kontor i {stad} med sina id-kort för att protestera. Juristerna säger att ändringen kan prövas mot grundlagen.',
    when: (c) => c.cut('voting_age') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -20, ind: { demo: 0.4, trustgov: 3 }, tip: 'Lika rösträtt är svår att ta ifrån folk. Det fick du se.' },
      { text: 'LOVA EN PARLAMENTARISK UTREDNING', cost: { pp: 10 }, temp: { polpower: -2 }, griev: -6, ind: { trustgov: 1 }, tip: 'Utredningar köper tid. Ungefär två år.' },
      { text: 'STÅ FAST', temp: { unrest: 4 }, griev: 8, ind: { demo: -0.4, turnout: -3 }, tip: 'Färre väljare. Argare väljare.' },
    ],
  },
  {
    id: 'dmk_rostratt_utvidgad', icon: '\u{1F389}', weight: 2, kind: 'frihet', react: true,
    title: 'DE NYA VÄLJARNA',
    text: 'Efter ändringen av {lag} får tusentals nya väljare rösta för första gången. På skolor och i föreningslokaler i {stad} hålls informationsmöten om hur man röstar, och partierna har plötsligt börjat skriva valprogram för en grupp de aldrig brytt sig om tidigare.',
    when: (c) => c.raised('voting_age') && c.day > 30,
    choices: [
      { text: 'STÖD STUDIEFÖRBUNDENS VALSKOLOR', cost: { money: 100 }, perm: { stability: 1 }, ind: { turnout: 3, trustgov: 2 }, tip: 'En kväll om valsedlar. Ett liv som väljare.' },
      { text: 'SKICKA ETT BREV TILL VARJE NY VÄLJARE', cost: { money: 50 }, temp: { approval: 2 }, ind: { turnout: 2 }, tip: 'Med ditt namn under. Det märks.' },
      { text: 'LÅT PARTIERNA SKÖTA INFORMATIONEN', temp: { polpower: 2 }, ind: { turnout: 1 }, tip: 'Partierna informerar gärna. Mest om sig själva.' },
    ],
  },
  {
    id: 'dmk_valen_inskrankta', icon: '\u{1F5F3}\u{FE0F}', weight: 2, kind: 'frihet', react: true,
    title: 'VALEN ÄR INTE LÄNGRE FRIA, SÄGER DE',
    text: 'Sedan ändringen av {lag} säger oppositionen att valen inte längre är fria. Statsvetare, biskopar och fackföreningar har skrivit ett gemensamt upprop, och i söndags stod 30 000 människor framför parlamentet med valsedlar i händerna. Utländska valexperter har börjat ringa.',
    when: (c) => c.cut('elections', 'government') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 25 }, undo: true, griev: -25, rel: 4, ind: { demo: 0.6, trustgov: 4 }, tip: 'Det kostar prestige. Det sparar demokratin.' },
      { text: 'TILLSÄTT EN GRUNDLAGSKOMMITTÉ MED ALLA PARTIER', cost: { pp: 10 }, temp: { polpower: -3 }, griev: -8, ind: { trustgov: 2 }, tip: 'Alla får sitta vid bordet. Det lugnar mer än man tror.' },
      { text: 'STÅ FAST', temp: { unrest: 5 }, griev: 10, rel: -4, ind: { demo: -0.5, trustgov: -5 }, tip: 'Nästa val vinner du. Frågan är vad segern är värd.' },
    ],
  },
  {
    id: 'dmk_tv_debatt', icon: '\u{1F4FA}', weight: 2, cooldown: 700,
    title: 'SLUTDEBATTEN I TV',
    text: 'Kvällen före valet möts alla partiledare i statstelevisionens slutdebatt. Tre miljoner tittare väntas. Dina rådgivare är oeniga: några vill att du går till attack, andra att du ska vara lugn och lite tråkig. Oppositionsledaren har tränat med en före detta skådespelare i tre veckor.',
    when: (c) => c.demo > 5.5 && c.st.approval < 35 && c.st.approval > -25 && c.day > 120,
    choices: [
      { text: 'GÅ TILL ATTACK', tip: 'Den som vinner debatten vinner inte alltid valet.',
        risk: { chance: 0.5,
          win: { text: 'Du vinner varje replikskifte. Klippen delas i miljoner.', temp: { approval: 6, polpower: 3 } },
          lose: { text: 'Du låter elak. Mätningarna faller tre procent över natten.', temp: { approval: -5 } } } },
      { text: 'VAR LUGN, SAKLIG OCH LITE TRÅKIG', temp: { approval: 2 }, ind: { trustgov: 2 }, tip: 'Ingen minns debatten. Alla minns att du verkade vuxen.' },
      { text: 'SKICKA FINANSMINISTERN I DITT STÄLLE', temp: { approval: -3, polpower: 2 }, tip: 'Den tomma stolen blev kvällens mest omtalade deltagare.' },
    ],
  },
  {
    id: 'dmk_rekorddeltagande', icon: '\u{1F4C8}', weight: 2, cooldown: 800,
    title: 'REKORDHÖGT VALDELTAGANDE',
    text: 'Fler gick och röstade i år än i något val i modern tid. Valdeltagandet steg mest i de områden där det tidigare varit lägst, och kön till vallokalen i {stad} gick runt kvarteret två gånger. Statsvetarna kallar det ett friskhetstecken. Oppositionen kallar det ett mandat för förändring.',
    when: (c) => c.trend('turnout') > 3 && c.demo > 4.5,
    choices: [
      { text: 'TACKA VÄLJARNA I ETT TAL TILL NATIONEN', temp: { approval: 3 }, ind: { trustgov: 2 }, tip: 'Det kostar ingenting att säga tack. Det glöms ofta ändå.' },
      { text: 'ANVÄND MANDATET TILL EN STOR REFORM', cost: { pp: 10 }, temp: { polpower: 8, approval: 1 }, tip: 'Ett starkt mandat är en färskvara.' },
      { text: 'STARTA MEDBORGARRÅD FÖR DE NYA VÄLJARNA', cost: { money: 150 }, perm: { stability: 1 }, ind: { trustgov: 3, turnout: 1 }, tip: 'Den som får vara med en gång vill vara med igen.' },
    ],
  },
  {
    id: 'dmk_tryckfel', icon: '\u{1F5A8}\u{FE0F}', cooldown: 1200, rare: true,
    title: 'TRYCKFELET PÅ VALSEDELN',
    text: 'Tryckeriet har stavat fel på ett av de mindre partiernas namn på två miljoner valsedlar. Framtidspartiet heter nu Framtidspratiet, och partiledaren säger i radio att det är "ett symboliskt övergrepp mot hela vår rörelse". Valmyndigheten har fem dagar på sig att göra något.',
    when: (c) => c.demo > 6.5 && c.day > 200,
    choices: [
      { text: 'TRYCK OM ALLT PÅ FEM DAGAR', cost: { money: 150 }, temp: { approval: 2 }, ind: { trustgov: 1 }, tip: 'Tryckeriet jobbar dygnet runt. Och läser korrektur tre gånger.' },
      { text: 'DELA UT RÄTTELSEKLISTERMÄRKEN', cost: { money: 30 }, temp: { approval: 1 }, tip: 'Två miljoner klistermärken. Några hamnar på fel parti.' },
      { text: 'DET SYNS JU VILKET PARTI DET ÄR', temp: { approval: -1 }, ind: { trustgov: -2 }, tip: 'Framtidspratiet får två procent och stämmer staten.' },
    ],
  },
  {
    id: 'dmk_rostkop', icon: '\u{1F6CD}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'RÖSTKÖP I {STAD}',
    text: 'Lokala journalister har filmat hur partiarbetare delar ut matkassar, mobilkort och kontanter utanför vallokalerna i de fattigaste kvarteren i {stad}. "Kom ihåg vem som hjälpte dig", står det på kassarna. Det är ditt parti som står bakom, men ingen i partiledningen vill veta något.',
    when: (c) => c.demo > 2 && c.demo < 7 && (c.ind.poverty ?? 5) > 3 && c.day > 100,
    choices: [
      { text: 'POLISANMÄL DINA EGNA PARTIARBETARE', cost: { pp: 15 }, temp: { polpower: -3 }, perm: { corruption: -2 }, ind: { trustgov: 3, demo: 0.2 }, tip: 'Partiet är förbannat. Väljarna är imponerade.' },
      { text: 'HÅRDARE STRAFF FÖR RÖSTKÖP FRAMÖVER', cost: { pp: 10 }, perm: { corruption: -1 }, ind: { demo: 0.1, trustgov: 1 }, tip: 'Framöver. Det här valet är redan köpt.' },
      { text: 'SÅ GÅR DET TILL ÖVERALLT', temp: { polpower: 3 }, perm: { corruption: 2 }, ind: { trustgov: -3, demo: -0.2 }, tip: 'En matkasse i dag. En väljare som inte tror på något i morgon.' },
    ],
  },
  {
    id: 'dmk_val_uppskjutet', icon: '\u{231B}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'SKA VALET SKJUTAS UPP?',
    text: 'Valet ska hållas om sex veckor, men krisen gör att hälften av vallokalerna inte kan bemannas. Inrikesministern föreslår att valet skjuts upp. Oppositionen säger att det är just så demokratier dör: inte med en kupp, utan med ett pressmeddelande om "praktiska skäl".',
    when: (c) => (c.atWar || c.mod('epidemic') || c.mod('natural_disaster')) && c.demo > 3.5 && c.day > 150,
    choices: [
      { text: 'HÅLL VALET ÄNDÅ MED BREVRÖSTER OCH FÄLTVALLOKALER', cost: { money: 300 }, perm: { stability: 1 }, ind: { demo: 0.3, trustgov: 4 }, tip: 'Andra länder har röstat under värre förhållanden. Och klarat det.' },
      { text: 'SKJUT UPP DET SEX MÅNADER MED OPPOSITIONENS STÖD', cost: { pp: 15 }, temp: { stability: 2 }, ind: { trustgov: -1 }, tip: 'Med ett datum och oppositionens namnteckning går det att försvara.' },
      { text: 'SKJUT UPP DET TILLS KRISEN ÄR ÖVER', temp: { statepower: 5 }, rel: -6, griev: 8, ind: { demo: -0.8, trustgov: -6 }, tip: 'Krisen tar slut en dag. Frågan är om valet kommer tillbaka.' },
    ],
  },

  // ===== DEMOKRATIRAPPORTEN =====
  // Indexet kommer en gång om året. Händelserna reagerar när landet passerar en gräns
  // (8, 6, 4) eller när det rört sig mycket under året (c.trend('demo')).
  {
    id: 'dmk_rapport_full', icon: '\u{1F31F}', weight: 3, cooldown: 600,
    title: '{RIKE} RÄKNAS NU SOM FULL DEMOKRATI',
    text: 'Årets demokratiindex är här, och för första gången hamnar {rike} över gränsen på 8,0. Fria val, oberoende domstolar och en levande press lyfts fram. Utrikesministeriet fick sju gratulationstelegram före lunch, och två stora pensionsfonder har ringt och frågat om investeringar.',
    when: (c) => c.demo > 8 && c.trend('demo') > 0.08 && c.demo - c.trend('demo') <= 8.05,
    choices: [
      { text: 'BJUD IN INVESTERARNA TILL HUVUDSTADEN', cost: { money: 100 }, mod: 'foreign_investment', rel: 4, tip: 'Pensionsfonder älskar tråkiga länder med fungerande domstolar.' },
      { text: 'FIRA MED EN DEMOKRATINS DAG', cost: { money: 150 }, temp: { approval: 5, stability: 3 }, ind: { turnout: 2, trustgov: 2 }, tip: 'Flaggor, kaffe och öppet hus i parlamentet. Köerna är långa.' },
      { text: 'INGET STOJ. FORTSÄTT ARBETET', perm: { stability: 1 }, rel: 2, ind: { trustgov: 1 }, tip: 'Den som inte skryter blir trodd.' },
    ],
  },
  {
    id: 'dmk_rapport_ur_full', icon: '\u{1F4C9}', weight: 3, cooldown: 600, kind: 'frihet',
    title: 'INTE LÄNGRE EN FULL DEMOKRATI',
    text: 'I årets demokratiindex faller {rike} under 8,0 och räknas nu bara som en begränsad demokrati. Rapporten nämner krympande pressfrihet, lägre förtroende för regeringen och beslut som fattats utan att parlamentet fått säga sitt. Löpsedlarna är mycket stora i dag.',
    when: (c) => c.demo <= 8 && c.demo > 6 && c.demo - c.trend('demo') > 8,
    choices: [
      { text: 'TILLSÄTT EN DEMOKRATIUTREDNING MED ALLA PARTIER', cost: { pp: 15 }, perm: { stability: 1 }, ind: { demo: 0.3, trustgov: 2 }, tip: 'Utredningar är tråkiga. Det är också det som är bra med dem.' },
      { text: 'STÄRK PRESSEN OCH PARLAMENTETS GRANSKNING', cost: { pp: 25 }, temp: { polpower: -5 }, rel: 4, ind: { demo: 0.5, pressfree: 3 }, tip: 'Mer granskning av dig själv. Ett ovanligt men klokt köp.' },
      { text: 'ETT INDEX FRÅN EN UTLÄNDSK TIDNING', temp: { ideopower: 2 }, rel: -3, griev: 4, ind: { trustgov: -2 }, tip: 'Indexet bryr sig inte om vad du tycker om det.' },
    ],
  },
  {
    id: 'dmk_rapport_upp_bristfallig', icon: '\u{1F4C8}', weight: 3, cooldown: 600,
    title: 'FRÅN HYBRIDREGIM TILL DEMOKRATI',
    text: 'Årets demokratiindex lyfter {rike} ur gränslandet mot hybridregimerna och in bland de svaga demokratierna. Rapporten nämner friare val och en mer självständig press, men varnar för svaga domstolar och låg tillit. I {huvudstad} dansar studenter på trappan till universitetet.',
    when: (c) => c.demo > 6 && c.trend('demo') > 0.1 && c.demo - c.trend('demo') <= 6.15,
    choices: [
      { text: 'FORTSÄTT. DOMSTOLARNA ÄR NÄSTA REFORM', cost: { pp: 20 }, temp: { statepower: -3 }, perm: { stability: 2 }, rel: 4, ind: { demo: 0.3 }, tip: 'Det som byggs nu håller i generationer.' },
      { text: 'ANSÖK OM HANDELSAVTAL MED DEMOKRATIERNA', cost: { pp: 10 }, rel: 6, mod: 'foreign_investment', tip: 'Dörrar som var stängda står plötsligt på glänt.' },
      { text: 'TACKA STUDENTERNA OCH VILA PÅ LAGERN', temp: { approval: 3 }, ind: { trustgov: 2 }, tip: 'Lagrar vissnar fort. Men i dag doftar de gott.' },
    ],
  },
  {
    id: 'dmk_rapport_hybrid', icon: '\u{26A0}\u{FE0F}', weight: 3, cooldown: 600, kind: 'frihet',
    title: 'NEDGRADERAD TILL HYBRIDREGIM',
    text: 'I årets demokratiindex sjunker {rike} ur gränslandet och hamnar tydligt bland hybridregimerna, i samma grupp som länder där valen hålls men sällan avgör något. Rapporten pekar på trakasserier av oppositionen och en press som rättar in sig i ledet. Två utländska banker har satt landet under särskild bevakning.',
    when: (c) => c.demo <= 6 && c.demo > 4 && c.trend('demo') < -0.08 && c.demo - c.trend('demo') > 5.6,
    choices: [
      { text: 'LÄGG FRAM ETT PAKET MED DEMOKRATIREFORMER', cost: { pp: 25 }, temp: { statepower: -4 }, rel: 5, griev: -8, ind: { demo: 0.5, trustgov: 3 }, tip: 'Det tog ett år att falla. Det tar längre tid att klättra.' },
      { text: 'BJUD IN RAPPORTENS FÖRFATTARE TILL SAMTAL', cost: { pp: 5 }, rel: 2, ind: { demo: 0.1 }, tip: 'De kommer. De skriver ner allt du säger.' },
      { text: 'FÖRBJUD RAPPORTEN I SKOLORNA', temp: { ideopower: 3 }, rel: -5, griev: 6, ind: { pressfree: -3, demo: -0.2 }, tip: 'Ingen ungdom har någonsin läst en rapport så noga som den här.' },
    ],
  },
  {
    id: 'dmk_rapport_auktoritar', icon: '\u{1F512}', weight: 3, cooldown: 600, kind: 'frihet',
    title: 'RAPPORTEN: EN AUKTORITÄR REGIM',
    text: 'Årets demokratiindex sänker {rike} ännu en gång, och landet placeras under 4,0 bland världens auktoritära regimer. Rapporten beskriver politiska fångar, kontrollerade val och en press som bara får skriva det regeringen godkänt. Tre länder har kallat hem sina ambassadörer för konsultationer och resebyråerna rapporterar avbokningar.',
    when: (c) => c.demo <= 4 && c.demo > 1 && c.trend('demo') < -0.1,
    choices: [
      { text: 'SLÄPP FÅNGARNA OCH LOVA FRIA VAL', cost: { pp: 30 }, temp: { statepower: -6, unrest: 4 }, rel: 8, griev: -12, ind: { demo: 0.6 }, tip: 'Ett första steg. Omvärlden väntar på det andra.' },
      { text: 'BJUD IN UTLÄNDSKA JOURNALISTER UNDER UPPSIKT', cost: { money: 100 }, rel: 2, ind: { pressfree: 1 }, tip: 'De ser det du visar. De skriver om det du inte visar.' },
      { text: 'VI ÄR STABILA. DE ÄR AVUNDSJUKA', temp: { ideopower: 4, stability: 2 }, rel: -6, ind: { tourists: -15 }, tip: 'Stabilt som en isbit i april.' },
    ],
  },
  {
    id: 'dmk_rapport_upp_hybrid', icon: '\u{1F305}', weight: 3, cooldown: 600,
    title: 'RAPPORTEN SER EN VÄNDNING',
    text: 'För första gången på länge klättrar {rike} i demokratiindexet. Landet ligger fortfarande i gränslandet mellan auktoritär regim och hybridregim, men rapporten talar om "en tydlig vändning": oppositionen får ställa upp och några tidningar granskar regeringen. Exilpolitiker i {land} funderar på att köpa biljett hem.',
    when: (c) => c.demo > 3.2 && c.demo < 4.8 && c.trend('demo') > 0.15,
    choices: [
      { text: 'BJUD HEM EXILPOLITIKERNA', cost: { pp: 15 }, temp: { unrest: 2 }, rel: 5, ind: { demo: 0.3 }, tip: 'De kommer hem med resväskor fulla av åsikter.' },
      { text: 'BE OMVÄRLDEN OM STÖD TILL REFORMERNA', cost: { pp: 10 }, rel: 6, res: { money: 300 }, tip: 'Biståndsgivare gillar en vändning. De gillar två ännu mer.' },
      { text: 'VÄNDNINGEN RÄCKER SÅ HÄR', temp: { statepower: 2, stability: 1 }, tip: 'Ett halvöppet fönster drar mest.' },
    ],
  },
  {
    id: 'dmk_rapport_ras', icon: '\u{1F4C9}', weight: 2, cooldown: 700, kind: 'frihet',
    title: 'STÖRSTA RASET I ÅRETS RAPPORT',
    text: 'Inget land i världen föll mer än {rike} i årets demokratiindex. Rapportens författare skriver att "få länder har rört sig så snabbt åt fel håll". Kartan i rapporten har färgat landet en nyans mörkare, och utlandspressen ringer utrikesministeriet var tionde minut.',
    when: (c) => c.trend('demo') < -0.55 && c.demo > 2,
    choices: [
      { text: 'TILLSÄTT EN GRANSKNINGSKOMMISSION', cost: { pp: 20 }, perm: { stability: 1 }, griev: -6, ind: { demo: 0.3, trustgov: 2 }, tip: 'En kommission med verkliga befogenheter. Det märks utomlands.' },
      { text: 'FÖRKLARA DIG I EN INTERVJU MED UTLANDSPRESSEN', cost: { pp: 5 },
        risk: { chance: 0.5,
          win: { text: 'Du låter eftertänksam och ärlig. Flera tidningar mjuknar.', rel: 4 },
          lose: { text: 'Intervjun blir en utfrågning. Klippet sprids överallt.', rel: -3, temp: { approval: -3 } } } },
      { text: 'RAPPORTEN ÄR SKRIVEN AV VÅRA FIENDER', temp: { ideopower: 3 }, rel: -5, griev: 4, ind: { pressfree: -2 }, tip: 'Fienderna har i så fall mycket noggranna fotnoter.' },
    ],
  },
  {
    id: 'dmk_rapport_pekar_ut', icon: '\u{1F449}', weight: 2, kind: 'frihet', react: true,
    title: 'RAPPORTEN PEKAR UT {LAG}',
    text: 'Årets demokratiindex sänker {rike} ordentligt, och författarna är tydliga med varför: ändringen av {lag} är "det enskilt största skälet till nedgången". Kapitlet om landet citeras i alla nyhetssändningar, och ditt eget partis ungdomsförbund kräver att beslutet rivs upp.',
    when: (c) => c.trend('demo') < -0.3 && c.cut('press', 'speech', 'protest', 'civil_rights', 'surveillance', 'internet', 'elections', 'government', 'trials', 'party_loyalty'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -15, rel: 5, ind: { demo: 0.5 }, tip: 'Nästa års rapport får ett nytt kapitel. Ett vänligare.' },
      { text: 'MILDRA LAGEN MED EN TIDSGRÄNS', cost: { pp: 10 }, griev: -6, rel: 2, ind: { demo: 0.2 }, tip: 'En lag med utgångsdatum är lättare att svälja.' },
      { text: 'STÅ FAST', temp: { ideopower: 2 }, griev: 6, rel: -4, ind: { trustgov: -2 }, tip: 'Ungdomsförbundet skriver en debattartikel. Sedan en till.' },
    ],
  },
  {
    id: 'dmk_rapport_berom', icon: '\u{1F44F}', weight: 2, cooldown: 700,
    title: 'RAPPORTEN BERÖMMER {RIKE}',
    text: 'Årets demokratiindex lyfter {rike} mer än nästan något annat land. Rapporten nämner fler partier i valen, en mer oberoende valmyndighet och domstolar som vågar säga emot regeringen. Två stora utländska företag har bett om möten nästa vecka.',
    when: (c) => c.trend('demo') > 0.4 && c.demo > 2,
    choices: [
      { text: 'BJUD IN INVESTERARNA', cost: { money: 100 }, temp: { gdp: 2 }, mod: 'foreign_investment', tip: 'Förtroende är en valuta. Nu har du lite mer av den.' },
      { text: 'TACKA DE SOM GJORDE DET MÖJLIGT', temp: { approval: 3 }, ind: { trustgov: 2 }, tip: 'Valförrättare, domare och journalister. Sällan tackade.' },
      { text: 'KANDIDERA TILL FN:S MÄNNISKORÄTTSRÅD', cost: { pp: 15 }, temp: { ideopower: 2 }, rel: 8, tip: 'En plats vid bordet där andra granskas. Och du själv.' },
    ],
  },

  // ===== DELINDEXEN =====
  {
    id: 'dmk_delindex_civ', icon: '\u{1F6E1}\u{FE0F}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'FRIA VAL, MEN INGA FRIA MÄNNISKOR',
    text: 'I demokratirapportens delindex får {rike} godkänt för valen men underkänt för medborgerliga fri- och rättigheter. Folk får rösta, men den som kritiserar polisen i sociala medier förhörs, och domstolarna godkänner nästan alla husrannsakningar. En människorättsorganisation kallar det "en demokrati på söndagar".',
    when: (c) => (c.ind.demo_civ ?? 5) < 6 && (c.ind.demo_el ?? 5) - (c.ind.demo_civ ?? 5) > 2 && c.day > 100,
    choices: [
      { text: 'STÄRK MEDBORGARRÄTTEN I LAG', cost: { pp: 25 }, law: ['civil_rights', 'high'], temp: { statepower: -3 }, perm: { freedom: 2 }, rel: 4, griev: -10, ind: { demo: 0.4 }, tip: 'Rättigheter på vardagar också.' },
      { text: 'INRÄTTA EN JUSTITIEOMBUDSMAN', cost: { money: 200 }, law: ['civil_rights', 'ombudsman'], griev: -6, ind: { demo: 0.3, policetrust: 3 }, tip: 'En myndighet vars enda jobb är att klaga på andra myndigheter.' },
      { text: 'FOLKET RÖSTADE FÖR ORDNING', temp: { stability: 2 }, rel: -3, griev: 4, tip: 'Folket röstade. Det betyder inte att de röstade för det här.' },
    ],
  },
  {
    id: 'dmk_delindex_gov', icon: '\u{1F3DB}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'REGERINGEN SOM INTE KAN REGERA',
    text: 'Demokratirapporten ger {rike} lägsta betyg för regeringens funktion. Lagförslag fastnar i utskotten i åratal, ministerier tolkar besluten som de vill och de viktigaste besluten fattas i praktiken av ett fåtal personer utanför parlamentet. Folk röstar, men ingenting händer.',
    when: (c) => (c.ind.demo_gov ?? 5) < 4 && c.demo > 3.5 && c.day > 100,
    choices: [
      { text: 'REFORMERA FÖRVALTNINGEN FRÅN GRUNDEN', cost: { money: 400 }, perm: { corruption: -2, stability: 1 }, ind: { demo: 0.3, trustgov: 2 }, tip: 'Tråkigt, dyrt och det enda som fungerar.' },
      { text: 'BJUD IN OPPOSITIONEN TILL BREDA UPPGÖRELSER', cost: { pp: 15 }, temp: { polpower: -3 }, perm: { stability: 1 }, ind: { trustgov: 3 }, tip: 'Beslut som båda sidor står bakom överlever ett regeringsskifte.' },
      { text: 'STYR MED DEKRET TILLS VIDARE', temp: { polpower: 6, statepower: 4 }, ind: { demo: -0.4, trustgov: -2 }, tip: 'Snabbt. Effektivt. Precis vad rapporten varnade för.' },
    ],
  },
  {
    id: 'dmk_delindex_cult', icon: '\u{1F4CA}', weight: 2, cooldown: 900,
    title: 'HÄLFTEN VILL HA EN STARK LEDARE',
    text: 'En stor undersökning visar att 52 procent av invånarna skulle föredra "en stark ledare som inte behöver bry sig om parlamentet och val". Bland de unga är andelen ännu högre. Demokratirapporten ger landets politiska kultur lågt betyg, och kommentatorerna undrar vem den starka ledaren i så fall skulle vara.',
    when: (c) => (c.ind.demo_cult ?? 5) < 4.5 && c.demo > 3 && c.day > 100,
    choices: [
      { text: 'MEDBORGARKUNSKAP I VARJE SKOLA', cost: { money: 200 }, perm: { stability: 1 }, ind: { demo: 0.2 }, tip: 'Det tar en generation. Det är därför man börjar nu.' },
      { text: 'STARTA MEDBORGARRÅD I VARJE KOMMUN', cost: { money: 120, pp: 10 }, ind: { trustgov: 3, demo: 0.3, turnout: 1 }, tip: 'Den som får bestämma om sin busslinje bryr sig om valet.' },
      { text: 'GE DEM DEN STARKA LEDAREN. DIG', temp: { polpower: 6, ideopower: 4 }, rel: -3, ind: { demo: -0.5 }, tip: 'Starka ledare är populära. Tills de inte är det. Sedan är de kvar.' },
    ],
  },
  {
    id: 'dmk_delindex_part', icon: '\u{1FA91}', weight: 2, cooldown: 900,
    title: 'INGEN VILL STÄLLA UPP I KOMMUNVALET',
    text: 'I var femte kommun finns det inte tillräckligt många kandidater för att fylla platserna i fullmäktige. Partierna har tappat hälften av sina medlemmar på tio år och demokratirapporten ger det politiska deltagandet underkänt. I {stad} blev en pensionerad busschaufför kommunstyrelsens ordförande eftersom ingen annan ville.',
    when: (c) => (c.ind.demo_part ?? 5) < 4.5 && c.demo > 3 && c.day > 100,
    choices: [
      { text: 'STÖD FÖRENINGSLIV OCH STUDIEFÖRBUND', cost: { money: 150 }, perm: { stability: 1 }, ind: { turnout: 2 }, tip: 'Den som lärt sig sköta en förening kan sköta en kommun.' },
      { text: 'ARVODEN OCH LEDIGHET FÖR FRITIDSPOLITIKER', cost: { money: 200 }, temp: { approval: 2 }, ind: { turnout: 1, trustgov: 2 }, tip: 'Ett kvällsmöte i veckan ska inte kosta en halv lön.' },
      { text: 'DE SOM BRYR SIG, BRYR SIG', temp: { polpower: 3 }, ind: { turnout: -2, trustgov: -1 }, tip: 'Busschauffören gör ett utmärkt jobb. Men han är ensam.' },
    ],
  },

  // ===== DOMSTOLARNA OCH GRUNDLAGEN (kedja) =====
  {
    id: 'dmk_domstol_nej', icon: '\u{2696}\u{FE0F}', weight: 2, cooldown: 900, kind: 'frihet', react: true,
    title: 'GRUNDLAGSDOMSTOLEN SÄGER NEJ',
    text: 'Sedan ändringen av {lag} har tre människorättsorganisationer stämt staten. I dag kom domen från högsta instans: ändringen strider mot grundlagen och får inte tillämpas. Domstolens ordförande läste upp domen med darrande röst. Nu väntar hela landet på vad regeringen gör.',
    when: (c) => c.cut('press', 'speech', 'protest', 'civil_rights', 'surveillance', 'internet', 'trials') && c.demo > 4,
    choices: [
      { text: 'RESPEKTERA DOMEN OCH BACKA {LAG}', undo: true, griev: -15, temp: { polpower: -4 }, ind: { demo: 0.4, trustgov: 3 }, next: ['dmk_domstol_respekt', null], tip: 'Att förlora i domstol är inget nederlag i en rättsstat.' },
      { text: 'FYLL DOMSTOLEN MED NYA DOMARE', cost: { pp: 30 }, temp: { statepower: 6 }, griev: 6, ind: { demo: -0.6, trustgov: -3 }, next: 'dmk_domstol_nya_domare', tip: 'Tolv nya domare. Alla med rätt åsikter.' },
      { text: 'IGNORERA DOMEN', griev: 10, rel: -6, ind: { demo: -0.8, trustgov: -4 }, next: 'dmk_konst_kris', tip: 'En dom som ingen följer är bara papper. Frågan är vem som följer dig.' },
    ],
  },
  {
    id: 'dmk_domstol_respekt', icon: '\u{1F3DB}\u{FE0F}', chain: true,
    title: 'RÄTTSSTATEN HÖLL',
    text: 'Utländska tidningar skriver att {rike} klarade ett prov som många demokratier har misslyckats med: regeringen förlorade i domstol och rättade sig efter domen. Räntan på statsobligationerna sjönk en tiondel, och domstolens ordförande har fått blommor från hela landet.',
    choices: [
      { text: 'SKRIV IN DOMSTOLARNAS OBEROENDE I GRUNDLAGEN', cost: { pp: 25 }, perm: { stability: 3 }, rel: 5, ind: { demo: 0.4 }, tip: 'Det som står i grundlagen tar nästa regering inte bort i en handvändning.' },
      { text: 'GÖR EN NY VERSION AV LAGEN SOM HÅLLER', cost: { pp: 15 }, temp: { statepower: 3 }, ind: { trustgov: 1 }, tip: 'Samma mål, lagliga medel. Juristerna har mycket att göra.' },
      { text: 'TA ÅT DIG ÄRAN', temp: { approval: 4 }, ind: { trustgov: 2 }, tip: 'Du förlorade målet och vann opinionen. Politik är märkligt.' },
    ],
  },
  {
    id: 'dmk_konst_kris', icon: '\u{1F4DC}', chain: true, kind: 'frihet',
    title: 'KONSTITUTIONELL KRIS',
    text: 'Domstolen säger att regeringen bryter mot grundlagen. Regeringen säger att domstolen saknar mandat. Rikspolischefen har skrivit till båda och frågat vems order hon ska följa. Talmannen har kallat parlamentet till extra session i natt, och utanför står tusentals människor med tända ljus.',
    choices: [
      { text: 'BÖJ DIG OCH LÅT DOMSTOLEN AVGÖRA', cost: { pp: 20 }, undo: true, griev: -15, temp: { approval: -4, polpower: -6 }, ind: { demo: 0.3, trustgov: 2 }, tip: 'Det svider i dag. Om tio år kallas det statsmannaskap.' },
      { text: 'UTLYS NYVAL OM GRUNDLAGSFRÅGAN', cost: { money: 300 }, temp: { stability: -3, polpower: -8 }, ind: { demo: 0.4, trustgov: 4 }, tip: 'Låt väljarna avgöra. Det är ju deras grundlag.' },
      { text: 'BEORDRA POLISEN ATT LYDA REGERINGEN', griev: 10, tip: 'Allt hänger på en enda person och hennes samvete.',
        risk: { chance: 0.5,
          win: { text: 'Polisen lyder. Domstolen står ensam. Landet har fått en ny ordning.', temp: { statepower: 8, stability: 3 }, ind: { demo: -1 } },
          lose: { text: 'Rikspolischefen vägrar i direktsändning. Regeringen står naken.', temp: { stability: -8, unrest: 8, polpower: -6 }, ind: { trustgov: -8 } } } },
    ],
  },
  {
    id: 'dmk_domstol_nya_domare', icon: '\u{1F468}\u{200D}\u{2696}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'DE NYA DOMARNA',
    text: 'Tolv nya domare har svurits in i högsta domstolen, alla utvalda av regeringen. De har dömt till regeringens fördel fjorton gånger i rad. Advokatsamfundet har brutit kontakten med domstolen, juriststudenter bär svarta band och de utländska domarföreningarna har uteslutit landets domarförbund.',
    choices: [
      { text: 'ÅTERINSÄTT DE AVSATTA DOMARNA', cost: { pp: 25 }, temp: { polpower: -5 }, rel: 5, griev: -12, ind: { demo: 0.5, trustgov: 4 }, tip: 'Att erkänna ett misstag är billigare än att leva med det.' },
      { text: 'NYA DOMARE SKA KRÄVA TVÅ TREDJEDELARS MAJORITET', cost: { pp: 15 }, perm: { stability: 1 }, rel: 3, griev: -5, ind: { demo: 0.3 }, tip: 'Då måste nästa regering också fråga oppositionen.' },
      { text: 'LÅT DOMARNA SITTA', temp: { statepower: 4 }, perm: { corruption: 2 }, rel: -6, griev: 5, ind: { demo: -0.4, trustgov: -3 }, tip: 'En domstol som alltid håller med dig skyddar dig inte från något.' },
    ],
  },

  // ===== INSTITUTIONER UNDER TRYCK =====
  {
    id: 'dmk_minister_folkfiender', icon: '\u{1F4E2}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'MINISTERN KALLADE DOMARNA FOLKFIENDER',
    text: 'Efter att domstolen stoppat ett av regeringens byggprojekt sa justitieministern i en radiointervju att domarna är "folkfiender i svarta kappor". Klippet har spelats en miljon gånger. Domarförbundet kräver en ursäkt, och flera domare har fått hotbrev hem till sina adresser.',
    when: (c) => c.demo > 4 && c.demo < 8.5 && (c.ind.trustcourt ?? 30) > 30 && c.st.statepower > 0 && c.day > 100,
    choices: [
      { text: 'AVSKEDA MINISTERN', cost: { pp: 20 }, temp: { approval: 2, polpower: -3 }, perm: { stability: 1 }, ind: { trustgov: 2, demo: 0.1 }, tip: 'En minister mindre. En rättsstat kvar.' },
      { text: 'TVINGA MINISTERN ATT BE OM URSÄKT', cost: { pp: 10 }, temp: { polpower: -2 }, ind: { trustgov: 1 }, tip: 'Ursäkten låter som en gisslanvideo. Men den kom.' },
      { text: 'HÅLL MED MINISTERN', temp: { ideopower: 3, approval: 2 }, rel: -3, griev: 6, ind: { demo: -0.3, trustgov: -2 }, tip: 'Dina anhängare jublar. Domarna låser sina dörrar.' },
    ],
  },
  {
    id: 'dmk_snabbrattegangar', icon: '\u{23F1}\u{FE0F}', weight: 2, kind: 'frihet', react: true,
    title: 'RÄTTEGÅNGAR PÅ TJUGO MINUTER',
    text: 'Sedan ändringen av {lag} döms människor i {stad} på tjugo minuter, ofta utan försvarare. Domstolarna betar av högarna, men en advokatbyrå har samlat 300 domar där de dömda inte förstod vad de anklagades för. Två av dem visade sig ha varit utomlands när brotten begicks.',
    when: (c) => c.cut('trials') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -18, ind: { demo: 0.4, policetrust: 2 }, tip: 'Rättssäkerhet tar tid. Det är det som är poängen.' },
      { text: 'RÄTT TILL FÖRSVARARE OCH ÖVERKLAGANDE', cost: { pp: 10 }, griev: -6, ind: { demo: 0.2, trustgov: 1 }, tip: 'Snabbt men inte blint. En rimlig kompromiss.' },
      { text: 'STÅ FAST', temp: { safety: 3 }, rel: -3, griev: 8, ind: { demo: -0.4 }, tip: 'Köerna i domstolarna är borta. Det är rättssäkerheten också.' },
    ],
  },
  {
    id: 'dmk_parlament_lamslaget', icon: '\u{1F9F1}', weight: 2, cooldown: 900,
    title: 'PARLAMENTET KAN INTE ENAS',
    text: 'För tredje gången i år har budgeten röstats ned. Tre partier vägrar sitta i samma regering, två vägrar sitta med det fjärde och det femte vill bara diskutera fiskekvoter. Myndigheterna arbetar på förra årets budget och statsvetarna börjar prata om ett systemfel.',
    when: (c) => c.demo > 5 && c.st.polpower < -5 && c.day > 150,
    choices: [
      { text: 'EXTRAVAL', cost: { money: 250 }, tip: 'Väljarna är inte alltid sugna på att lösa politikernas problem.',
        risk: { chance: 0.5,
          win: { text: 'Väljarna ger dig en tydlig majoritet. Budgeten går igenom.', temp: { polpower: 10, approval: 3, stability: 2 } },
          lose: { text: 'Parlamentet blir ännu mer splittrat. Nu är det sju partier.', temp: { polpower: -5, stability: -3 } } } },
      { text: 'BRED MITTENKOALITION', cost: { pp: 20 }, temp: { ideopower: -4 }, perm: { stability: 2 }, ind: { trustgov: 2 }, tip: 'Ingen får allt. Alla får något. Landet får en budget.' },
      { text: 'MINORITETSREGERING MED HOPPANDE MAJORITETER', temp: { polpower: -3, stability: -1 }, ind: { trustgov: -1 }, tip: 'Varje lag blir ett eget förhandlingsmaraton.' },
    ],
  },
  {
    id: 'dmk_undantag_forlangs', icon: '\u{1F6A7}', weight: 2, cooldown: 700, kind: 'frihet',
    title: 'UNDANTAGSTILLSTÅNDET FÖRLÄNGS IGEN',
    text: 'Undantagstillståndet infördes för att hantera en akut kris. Nu ska det förlängas för femte gången. Polisen kan gripa utan domstolsbeslut, demonstrationer kräver militärens tillstånd och parlamentet har inte röstat om saken på ett år. Krisen som det infördes för minns knappt någon.',
    when: (c) => c.is('civil_rights', 'emergency', 'verylimited') && c.day > 200,
    choices: [
      { text: 'HÄV UNDANTAGSTILLSTÅNDET', cost: { pp: 15 }, law: ['civil_rights', 'balanced'], temp: { safety: -2 }, griev: -12, ind: { demo: 0.6, trustgov: 3 }, tip: 'Det som var tillfälligt får äntligen vara det.' },
      { text: 'LÅT PARLAMENTET RÖSTA OM DET VARJE MÅNAD', cost: { pp: 10 }, griev: -5, ind: { demo: 0.2, trustgov: 2 }, tip: 'En månad i taget. Med ledamöternas namn under.' },
      { text: 'FÖRLÄNG MED SEX MÅNADER', temp: { stability: 2, statepower: 3 }, rel: -3, griev: 6, ind: { demo: -0.3 }, tip: 'Ingenting är så permanent som en tillfällig lösning.' },
    ],
  },
  {
    id: 'dmk_tredje_perioden', icon: '\u{1F504}', weight: 1, cooldown: 1500, kind: 'frihet',
    title: 'EN TREDJE MANDATPERIOD?',
    text: 'Grundlagen säger att landets ledare får sitta två mandatperioder. Ditt parti har ett förslag: en "teknisk justering" som nollställer räkningen. Opinionsmätningarna är goda, oppositionen är splittrad och juristerna i justitiedepartementet har hittat ett kryphål. Frågan är bara om du vill använda det.',
    when: (c) => c.demo > 3 && c.demo < 7.5 && c.st.approval > 0 && c.day > 500,
    choices: [
      { text: 'NEJ. TVÅ PERIODER RÄCKER', temp: { polpower: -6 }, perm: { stability: 3 }, rel: 6, ind: { demo: 0.4, trustgov: 4 }, tip: 'Partiet suckar. Historieböckerna nickar.' },
      { text: 'FOLKOMRÖSTA OM SAKEN', cost: { money: 250 }, tip: 'Folket kan ge dig makten. Det kan också ta den.',
        risk: { chance: 0.55,
          win: { text: 'Folket säger ja. Du har ett mandat som ingen kan ifrågasätta.', temp: { polpower: 8, approval: 3 }, ind: { demo: -0.2 } },
          lose: { text: 'Folket säger nej. Det blir din sista period, och landet respekterar dig för det.', temp: { polpower: -8 }, perm: { stability: 2 }, ind: { demo: 0.3, trustgov: 3 } } } },
      { text: 'ÄNDRA GRUNDLAGEN', cost: { pp: 30 }, temp: { polpower: 8, statepower: 5 }, rel: -5, griev: 8, ind: { demo: -0.6, trustgov: -4 }, tip: 'Det är lagligt. Det är det som är problemet.' },
    ],
  },
  {
    id: 'dmk_ombudsman', icon: '\u{1F4D1}', weight: 2, cooldown: 900,
    title: 'OMBUDSMANNENS ÅRSRAPPORT',
    text: 'Justitieombudsmannen har lagt fram sin årsrapport. Den beskriver poliser som raderat filmer, myndigheter som struntat i att svara på klagomål och en kommun i {stad} som avlyssnat sina egna anställda. Rapporten är nedslående, men den finns, och det är just det utländska bedömare berömmer.',
    when: (c) => (c.is('civil_rights', 'ombudsman', 'high', 'veryhigh', 'extremelyhigh') || c.is('policing', 'oversight', 'community')) && c.day > 100,
    choices: [
      { text: 'GENOMFÖR ALLA REKOMMENDATIONER', cost: { money: 200 }, ind: { policetrust: 4, trustgov: 2, demo: 0.2 }, tip: 'Den som rättar sina fel får fler chanser.' },
      { text: 'GE OMBUDSMANNEN FLER UTREDARE', cost: { money: 120 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, tip: 'Fler som letar betyder färre som fuskar.' },
      { text: 'KALLA RAPPORTEN ÖVERDRIVEN', temp: { statepower: 2 }, ind: { trustgov: -2, policetrust: -2 }, tip: 'Poliserna som raderade filmer är mycket nöjda med ditt uttalande.' },
    ],
  },
  {
    id: 'dmk_partipiska', icon: '\u{1F465}', weight: 2, kind: 'frihet', react: true,
    title: 'LEDAMÖTERNA FÅR INTE TÄNKA SJÄLVA',
    text: 'Sedan ändringen av {lag} kan en ledamot som röstar mot partilinjen förlora sin plats i parlamentet. I går röstade alla ledamöter exakt som deras partier sa, för första gången i landets historia. En äldre ledamot från {stad} höll ett tal om samvetet och blev ombedd att sätta sig.',
    when: (c) => c.cut('party_loyalty') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -15, ind: { demo: 0.4, trustgov: 2 }, tip: 'Ett parlament där alla håller med är ett dyrt sätt att trycka på en knapp.' },
      { text: 'TILLÅT SAMVETSRÖSTER I ETISKA FRÅGOR', cost: { pp: 5 }, griev: -6, ind: { demo: 0.1 }, tip: 'Samvetet får komma tillbaka. På deltid.' },
      { text: 'STÅ FAST', temp: { polpower: 4 }, griev: 6, ind: { demo: -0.3, trustgov: -2 }, tip: 'Lagarna går igenom snabbare. Ingen läser dem längre.' },
    ],
  },

  // ===== GRÄVANDE JOURNALISTIK (kedja) =====
  {
    id: 'dmk_grav_konto', icon: '\u{1F4F0}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'TIDNINGEN HAR HITTAT KONTOT',
    text: 'Efter ett års grävande publicerar en tidning i {stad} bevis för att en minister har ett hemligt bankkonto i {land}. Dit har det kommit pengar från tre byggbolag som fått statliga kontrakt. Ministern säger att hon "aldrig hört talas om kontot". Tidningen har kontoutdragen.',
    when: (c) => c.st.corruption > 5 && (c.ind.pressfree ?? 50) > 40 && c.day > 80,
    choices: [
      { text: 'LÅT ÅKLAGAREN UTREDA FRITT', cost: { pp: 10 }, ind: { trustgov: 2 }, next: 'dmk_grav_atal', tip: 'Den som låter rättvisan arbeta behöver sällan försvara sig.' },
      { text: 'STÄM TIDNINGEN FÖR FÖRTAL', cost: { money: 100 }, temp: { approval: -3 }, ind: { pressfree: -4 }, next: ['dmk_grav_hot', 'dmk_grav_atal'], tip: 'Rättegången blir en andra publicering. Med bilagor.' },
      { text: 'DRA IN STATENS ANNONSER FRÅN TIDNINGEN', mod: 'cover_up', griev: 4, ind: { pressfree: -5, demo: -0.2 }, next: ['dmk_grav_hot', null], tip: 'Tidningen får färre annonser och fler prenumeranter.' },
    ],
  },
  {
    id: 'dmk_grav_atal', icon: '\u{2696}\u{FE0F}', chain: true,
    title: 'MINISTERN ÄR ÅTALAD',
    text: 'Åklagaren har väckt åtal mot ministern för grovt tagande av muta. Rättegången börjar om en månad och ska sändas i radio. Ministern har avgått men sitter kvar i parlamentet. Hennes advokat antyder att hon kan ha mer att berätta, om fler personer i regeringen.',
    choices: [
      { text: 'LÅT RÄTTEN HA SIN GÅNG', temp: { approval: -3 }, perm: { corruption: -3 }, ind: { trustgov: 4, demo: 0.2 }, next: ['dmk_grav_pris', null], tip: 'Det blir pinsamt i tre veckor. Sedan är det historia.' },
      { text: 'INRÄTTA EN SJÄLVSTÄNDIG KORRUPTIONSBYRÅ', cost: { money: 300 }, law: ['anti_corruption', 'agency'], perm: { corruption: -4 }, ind: { trustgov: 3 }, tip: 'Nästa minister med ett konto i utlandet blir upptäckt fortare.' },
      { text: 'BENÅDA HENNE FÖRE RÄTTEGÅNGEN', cost: { pp: 20 }, perm: { corruption: 3 }, mod: 'scandal', ind: { trustgov: -6, demo: -0.3 }, tip: 'Hon tystnar. Alla förstår varför.' },
    ],
  },
  {
    id: 'dmk_grav_hot', icon: '\u{1F6A8}', chain: true, kind: 'frihet',
    title: 'JOURNALISTEN ÄR HOTAD',
    text: 'Reportern bakom avslöjandet har fått bilens däck sönderskurna och hotbrev i brevlådan. En ledamot från ditt parti kallade henne "landsförrädare" i tv. Redaktören har flyttat henne och barnen till ett hotell. Journalistförbund i tolv länder har skrivit ett gemensamt brev till dig.',
    choices: [
      { text: 'POLISSKYDD OCH ETT TYDLIGT FÖRDÖMANDE', cost: { money: 80 }, rel: 3, ind: { pressfree: 3, trustgov: 2 }, next: ['dmk_grav_pris', null], tip: 'Ett hot mot en journalist är ett hot mot alla läsare.' },
      { text: 'TIG', rel: -3, griev: 4, ind: { pressfree: -4, demo: -0.2 }, tip: 'Tystnad är också ett svar. Alla hör det.' },
      { text: 'GRIP HENNE FÖR SPIONAGE', temp: { statepower: 3 }, mod: 'martyr', rel: -10, griev: 10, ind: { pressfree: -8, demo: -0.6 }, next: 'dmk_grav_pris', tip: 'Nu vet hela världen vad hon heter.' },
    ],
  },
  {
    id: 'dmk_grav_pris', icon: '\u{1F3C6}', chain: true,
    title: 'HON FICK ETT INTERNATIONELLT PRIS',
    text: 'Reportern från {stad} har fått ett av världens mest kända journalistpriser för sitt avslöjande. Hon tar emot det i {land} inför 600 gäster och tackar "alla som vågade prata". Galan sänds i landets tv, även i statskanalen, som först inte ville.',
    choices: [
      { text: 'GRATULERA HENNE OFFENTLIGT', rel: 5, ind: { pressfree: 2, trustgov: 1 }, tip: 'Det kostar en mening. Den mest citerade du sagt i år.' },
      { text: 'INRÄTTA ETT STÖD TILL GRÄVANDE LOKALJOURNALISTIK', cost: { money: 200 }, perm: { corruption: -1 }, ind: { pressfree: 4, demo: 0.2 }, tip: 'Fler reportrar som gräver. Fler ministrar som sover sämre.' },
      { text: 'BOJKOTTA GALAN', temp: { ideopower: 2 }, rel: -5, ind: { pressfree: -1 }, tip: 'Den tomma ambassadörsstolen syns tydligt i tv-bilden.' },
    ],
  },

  // ===== PRESSEN =====
  {
    id: 'dmk_press_react', icon: '\u{1F5DE}\u{FE0F}', weight: 2, kind: 'frihet', react: true,
    title: 'REDAKTIONERNA SLÄCKER LJUSET',
    text: 'Sedan ändringen av {lag} har två tidningar lagt ned och en tredje publicerar bara recept och sport. Journalisterna säger att de inte längre vet vad som är lagligt att skriva, så de skriver ingenting. Morgonradion läste i dag väderleksrapporten och sedan en minuts tystnad.',
    when: (c) => c.cut('press', 'speech', 'internet') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -20, ind: { pressfree: 5, demo: 0.4 }, tip: 'Tidningarna kommer tillbaka. Recepten flyttar till söndagsbilagan.' },
      { text: 'GE PRESSTÖD TILL DE SOM ÄR KVAR', cost: { money: 200 }, griev: -6, ind: { pressfree: 2 }, tip: 'Pengar hjälper. Rädsla försvinner inte av pengar.' },
      { text: 'STÅ FAST', temp: { statepower: 3 }, rel: -4, griev: 8, ind: { pressfree: -4, demo: -0.3 }, tip: 'Tystnaden i radion blir landets mest delade ljudklipp.' },
    ],
  },
  {
    id: 'dmk_sista_lokaltidningen', icon: '\u{1F4EA}', weight: 2, cooldown: 1000,
    title: 'DEN SISTA LOKALTIDNINGEN I {STAD}',
    text: 'Lokaltidningen i {stad} har kommit ut i 140 år. På fredag kommer det sista numret. Annonsörerna har flyttat till nätet och prenumeranterna har blivit för gamla. Forskning visar att korruptionen ökar i kommuner utan lokal granskning, och kommunalråden har redan slutat svara på frågor.',
    when: (c) => c.day > 150 && (c.ind.internet ?? 60) > 75 && c.demo > 5,
    choices: [
      { text: 'PRESSTÖD TILL LOKALA NYHETER', cost: { money: 150 }, perm: { corruption: -1 }, ind: { pressfree: 2 }, tip: 'Någon måste sitta på kommunfullmäktiges läktare.' },
      { text: 'STÖD EN IDEELL NYHETSSAJT', cost: { money: 60 }, ind: { pressfree: 1, trustgov: 1 }, tip: 'Tre pensionerade journalister och en praktikant. Det räcker långt.' },
      { text: 'MARKNADEN HAR TALAT', perm: { corruption: 1 }, ind: { pressfree: -1 }, tip: 'Kommunalråden har det lugnare nu. Det är problemet.' },
    ],
  },
  {
    id: 'dmk_public_service', icon: '\u{1F4E1}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'PUBLIC SERVICE GRANSKAR REGERINGEN',
    text: 'Statstelevisionens granskande program har ägnat tre avsnitt i rad åt regeringens upphandlingar. Ditt parti är rasande och flera ministrar vägrar ställa upp på intervjuer. Samtidigt visar mätningarna att programmet är landets mest betrodda, och ett av få ställen där alla politiska läger tittar.',
    when: (c) => c.is('press', 'publicservice', 'free', 'full', 'transparency') && c.day > 100,
    choices: [
      { text: 'TÅL DET. DET ÄR DERAS JOBB', temp: { approval: -2 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, tip: 'En stat som tål granskning är en stat som går att lita på.' },
      { text: 'SKÄR I ANSLAGEN', res: { money: 150 }, griev: 4, ind: { pressfree: -3, demo: -0.2 }, tip: 'Sparpaketet drabbar konstigt nog bara granskningsredaktionen.' },
      { text: 'BYT UT STYRELSEN MOT LOJALA', cost: { pp: 20 }, temp: { statepower: 3 }, rel: -2, griev: 6, ind: { pressfree: -5, demo: -0.3 }, tip: 'Tittarna märker skillnaden på en vecka. Och byter kanal.' },
    ],
  },
  {
    id: 'dmk_satiren', icon: '\u{1F3AD}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'SATIRPROGRAMMET OM DIG',
    text: 'Landets populäraste satirprogram har en ny figur: en docka med din frisyr som inte kan öppna dörrar och talar om sig själv i tredje person. Klippen sprids i skolorna och barnen härmar repliken "ledaren vet bäst". Dina rådgivare tycker inte att det är roligt.',
    when: (c) => (c.ind.pressfree ?? 50) > 45 && c.demo > 5 && c.st.approval < 15 && c.day > 100,
    choices: [
      { text: 'SKRATTA MED', tip: 'Humor är det enda vapnet som inte går att förbjuda.',
        risk: { chance: 0.6,
          win: { text: 'Du skämtar om dockan i ett tal. Folk skrattar med dig, inte åt dig.', temp: { approval: 4 }, ind: { trustgov: 2 } },
          lose: { text: 'Ditt skämt faller platt och blir veckans bästa sketch.', temp: { approval: -2 } } } },
      { text: 'GÄSTSPELA I PROGRAMMET SJÄLV', cost: { pp: 5 },
        risk: { chance: 0.5,
          win: { text: 'Du och dockan sjunger duett. Tittarsiffrorna slår rekord.', temp: { approval: 6 } },
          lose: { text: 'Det blir mycket pinsamt. Dockan vinner.', temp: { approval: -4, polpower: -2 } } } },
      { text: 'STÄNG NED PROGRAMMET', temp: { approval: -4, unrest: 3 }, griev: 8, ind: { pressfree: -6, demo: -0.3 }, tip: 'Dockan flyttar till nätet. Där har den tre gånger så många tittare.' },
    ],
  },
  {
    id: 'dmk_journalist_fangslad', icon: '\u{26D3}\u{FE0F}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'JOURNALISTEN SOM SUTTIT INNE 400 DAGAR',
    text: 'En journalist har suttit häktad i 400 dagar utan dom, anklagad för att ha "spridit falsk information" om en gruvolycka. Hennes mamma står varje dag med en skylt utanför justitiedepartementet. En utländsk regering har erbjudit sig att ta emot henne, och hennes artiklar har översatts till tjugo språk.',
    when: (c) => (c.ind.pressfree ?? 50) < 40 && c.demo < 6 && c.day > 100,
    choices: [
      { text: 'FRIGE HENNE OCH LÄGG NED ÅTALET', cost: { pp: 15 }, temp: { statepower: -2 }, rel: 6, griev: -8, ind: { pressfree: 4, demo: 0.2 }, tip: 'En fri journalist skriver om dig. En fängslad skriver om dig i tjugo länder.' },
      { text: 'LÅT HENNE LÄMNA LANDET', cost: { pp: 5 }, rel: 3, ind: { pressfree: 1 }, tip: 'Hon är fri. Hon skriver vidare. Från utlandet.' },
      { text: 'HÅLL HENNE KVAR', temp: { statepower: 2 }, rel: -5, griev: 4, ind: { pressfree: -1 }, tip: 'Mamman med skylten får sällskap. Varje dag lite fler.' },
    ],
  },
  {
    id: 'dmk_falska_nyheter', icon: '\u{1F925}', weight: 2, cooldown: 900,
    title: 'FALSKA NYHETSSAJTER INFÖR VALET',
    text: 'Tre veckor före valet har det dykt upp femtio nyhetssajter som ser ut som riktiga lokaltidningar. De publicerar påhittade artiklar om kandidater från alla partier. Forskare har spårat dem till samma reklambyrå, men ingen vet vem som betalar. I {stad} tror var tredje väljare på minst en av historierna.',
    when: (c) => c.demo > 4.5 && (c.ind.internet ?? 60) > 60 && c.st.stability < 20 && c.day > 100,
    choices: [
      { text: 'FINANSIERA OBEROENDE FAKTAGRANSKARE', cost: { money: 150 }, ind: { trustgov: 2, pressfree: 1 }, tip: 'Sanningen är långsammare än lögnen. Men den håller längre.' },
      { text: 'LAG MOT FALSKA NYHETER', cost: { pp: 20 }, law: ['speech', 'fakenews'], temp: { stability: 2 }, ind: { pressfree: -3, demo: -0.2 }, tip: 'Vem som avgör vad som är falskt blir nästa stora fråga.' },
      { text: 'VÄLJARNA KAN TÄNKA SJÄLVA', temp: { unrest: 2 }, ind: { trustgov: -2 }, tip: 'De kan. Om de hinner före valet.' },
    ],
  },

  // ===== LOBBYISTEN (kedja) =====
  {
    id: 'dmk_lobby_mejlen', icon: '\u{1F4E7}', weight: 2, cooldown: 1000,
    title: 'MEJLEN FRÅN LOBBYISTEN',
    text: 'Ett läckt mejlutbyte visar att ett stort energibolag skrev hela paragrafer i regeringens nya energilag, som sedan antogs ordagrant. Lobbyisten var tidigare statssekreterare i samma departement. I ett av mejlen tackar hon för "trevlig middag och smidigt samarbete".',
    when: (c) => c.is('lobbying', 'standard', 'revolving', 'anonymous', 'superpac', 'unlimited') && c.demo > 4 && c.st.corruption > 0 && c.day > 100,
    choices: [
      { text: 'LÄGG FRAM ALLA MEJL', cost: { pp: 10 }, perm: { corruption: -1 }, ind: { trustgov: 1 }, next: 'dmk_lobby_forhor', tip: 'Allt på bordet. Även middagsnotan.' },
      { text: 'RIV UPP LAGEN SOM DE SKREV', cost: { pp: 15 }, temp: { gdp: -2 }, perm: { corruption: -1 }, ind: { trustgov: 3 }, tip: 'Energibolaget är inte glatt. Väljarna är det.' },
      { text: 'FÖRNEKA ALLT', mod: 'cover_up', ind: { trustgov: -3 }, next: ['dmk_lobby_forhor', null], tip: 'Mejlen finns. Det enda som inte finns är ditt alibi.' },
    ],
  },
  {
    id: 'dmk_lobby_forhor', icon: '\u{1F399}\u{FE0F}', chain: true,
    title: 'FÖRHÖRET I KONSTITUTIONSUTSKOTTET',
    text: 'Konstitutionsutskottet har kallat tre ministrar till öppet förhör om lobbyistens mejl. Förhören sänds direkt och har högre tittarsiffror än fotbollen. En statssekreterare har redan sagt att "alla gör så här", vilket gjorde saken värre.',
    choices: [
      { text: 'INFÖR ETT OFFENTLIGT LOBBYREGISTER', cost: { pp: 20 }, law: ['lobbying', 'register'], perm: { corruption: -3 }, ind: { trustgov: 4, demo: 0.2 }, next: ['dmk_lobby_partikassan', null], tip: 'Vem som träffar vem syns nu på nätet. Middagarna blir färre.' },
      { text: 'OFFRA STATSSEKRETERAREN', temp: { approval: 2, polpower: -2 }, ind: { trustgov: 1 }, tip: 'Han sa sanningen. Det var hans misstag.' },
      { text: 'VÄGRA VITTNA', mod: 'scandal', ind: { trustgov: -5, demo: -0.2 }, tip: 'Den tomma stolen i förhörssalen blir veckans bild.' },
    ],
  },
  {
    id: 'dmk_lobby_partikassan', icon: '\u{1F4B8}', chain: true,
    title: 'PARTIKASSORNA ÄR TOMMA',
    text: 'Lobbyregistret fungerar: företagen har slutat bjuda på middagar och slutat ge pengar till partierna. Nu har partierna inte råd med valaffischer. Partisekreterarna föreslår statligt partistöd, och skattebetalarnas förening har redan räknat ut vad det kostar per invånare.',
    choices: [
      { text: 'STATLIGT PARTISTÖD OCH INGA PRIVATA PENGAR', cost: { money: 300 }, law: ['lobbying', 'publiconly'], temp: { approval: -2 }, perm: { corruption: -2 }, ind: { trustgov: 2 }, tip: 'Tre kronor per invånare. Billigare än en köpt lag.' },
      { text: 'STATEN MATCHAR SMÅ GÅVOR FRÅN MEDBORGARE', cost: { money: 150 }, law: ['lobbying', 'smallmatch'], ind: { turnout: 1, trustgov: 2 }, tip: 'Hundra kronor från en väljare blir tvåhundra. Partierna börjar knacka dörr.' },
      { text: 'PARTIERNA FÅR KLARA SIG SJÄLVA', temp: { polpower: -3 }, ind: { turnout: -1 }, tip: 'Valaffischerna blir handritade. Charmigt, faktiskt.' },
    ],
  },

  // ===== KORRUPTION =====
  {
    id: 'dmk_pengarna_stromar', icon: '\u{1F4B0}', weight: 2, kind: 'frihet', react: true,
    title: 'PENGARNA STRÖMMAR IN I POLITIKEN',
    text: 'Sedan ändringen av {lag} har tre av landets rikaste personer bildat egna kampanjfonder. Valreklamen i tv har tredubblats och en okänd kandidat i {stad} har plötsligt råd med en helikopter. Mätningar visar att sju av tio tror att politiken nu går att köpa.',
    when: (c) => c.cut('lobbying', 'anti_corruption') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -15, perm: { corruption: -1 }, ind: { trustgov: 3 }, tip: 'Helikoptern säljs. Kandidaten åker buss igen.' },
      { text: 'TAK FÖR GÅVOR TILL KAMPANJER', cost: { pp: 10 }, griev: -6, ind: { trustgov: 1 }, tip: 'Ett tak går att klättra över. Men det tar längre tid.' },
      { text: 'STÅ FAST', temp: { polpower: 3 }, perm: { corruption: 2 }, griev: 6, ind: { trustgov: -3 }, tip: 'Den som betalar bestämmer. Väljarna har förstått.' },
    ],
  },
  {
    id: 'dmk_bygglov', icon: '\u{1F3D7}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'BYGGLOVEN I {STAD}',
    text: 'En granskning visar att byggföretag som gett pengar till kommunalrådets stiftelse fått bygglov på sex veckor. Alla andra väntar i två år. Kommunalrådet tillhör ditt parti och har vunnit fem val i rad. Hans försvar: "Jag har byggt fler bostäder än någon annan i landet."',
    when: (c) => c.st.corruption > 15 && c.day > 60,
    choices: [
      { text: 'STATLIG GRANSKNING AV KOMMUNEN', cost: { money: 150 }, perm: { corruption: -2 }, ind: { trustgov: 2 }, tip: 'Granskarna hittar fler stiftelser. Det gör de alltid.' },
      { text: 'TILLGÅNGSDEKLARATION FÖR ALLA FOLKVALDA', cost: { pp: 20 }, law: ['anti_corruption', 'assetdecl'], temp: { polpower: -3 }, perm: { corruption: -3 }, ind: { trustgov: 3 }, tip: 'Plötsligt säljer många folkvalda sina sommarhus till sina svågrar.' },
      { text: 'DET ÄR EN KOMMUNAL FRÅGA', temp: { polpower: 2 }, perm: { corruption: 1 }, ind: { trustgov: -2 }, tip: 'Kommunalrådet vinner sitt sjätte val. Med helikopter.' },
    ],
  },
  {
    id: 'dmk_ren_stat', icon: '\u{2728}', weight: 2, cooldown: 1200,
    title: 'NÄSTAN INGEN TAR MUTOR LÄNGRE',
    text: 'En ny mätning visar att mindre än en procent av invånarna har blivit ombedda att betala en muta det senaste året. För tio år sedan var det var femte. Korruptionsbyrån har fällt två ministrar, en domare och en fotbollsordförande. Utländska företag börjar kalla {rike} "ett tryggt land att göra affärer i".',
    when: (c) => c.is('anti_corruption', 'agency', 'opengov', 'whistle', 'assetdecl') && c.st.corruption < 5 && c.day > 300,
    choices: [
      { text: 'BERÄTTA DET FÖR VÄRLDEN', cost: { pp: 5 }, rel: 5, mod: 'foreign_investment', tip: 'Ärlighet är en exportvara. Den säljer sig själv.' },
      { text: 'GE BYRÅN MER RESURSER', cost: { money: 200 }, perm: { corruption: -2 }, ind: { trustgov: 2 }, tip: 'Det som fungerar ska man inte svälta.' },
      { text: 'NU KAN VI SÄNKA BEVAKNINGEN', res: { money: 150 }, perm: { corruption: 1 }, tip: 'Korruption är som ogräs. Den väntar på att du slutar rensa.' },
    ],
  },
  {
    id: 'dmk_utlandska_pengar', icon: '\u{1F30D}', weight: 2, cooldown: 1000,
    title: 'PARTIET FICK PENGAR FRÅN {LAND}',
    text: 'Granskande journalister har kartlagt hur ett bolag med ägare i {land} har betalat för ditt partis valkampanj via tre mellanhänder. Summan motsvarar en tredjedel av kampanjbudgeten. Ingen lag har brutits, eftersom ingen lag förbjuder det, men alla tv-soffor frågar vad {land} vill ha i gengäld.',
    when: (c) => c.demo > 4 && c.st.corruption > 10 && c.day > 120,
    choices: [
      { text: 'BETALA TILLBAKA OCH REDOVISA ALLT', cost: { money: 200 }, perm: { corruption: -1 }, ind: { trustgov: 3 }, tip: 'Dyrt. Men billigare än att låta frågan hänga kvar.' },
      { text: 'FÖRBJUD FÖRETAGSBIDRAG TILL PARTIER', cost: { pp: 15 }, law: ['lobbying', 'nocorporate'], perm: { corruption: -2 }, rel: -2, ind: { trustgov: 2 }, tip: 'Inga bolag, varken härifrån eller därifrån. Rent och tydligt.' },
      { text: 'BEHÅLL PENGARNA', temp: { polpower: 4 }, mod: 'scandal', ind: { trustgov: -4 }, tip: 'Kampanjen blir snygg. Frågorna blir fler.' },
    ],
  },

  // ===== OPPOSITIONSLEDAREN (kedja) =====
  {
    id: 'dmk_opp_gripen', icon: '\u{1F46E}', weight: 2, cooldown: 1200, kind: 'frihet',
    title: 'OPPOSITIONSLEDAREN ÄR GRIPEN',
    text: 'Oppositionsledaren greps på flygplatsen när hon kom hem från {land}, misstänkt för skattebrott för tio år sedan. Valet är om fyra månader och hon leder i två mätningar av tre. Hennes anhängare samlas utanför häktet i {huvudstad}, och utländska ambassader frågar om hon får träffa en advokat.',
    when: (c) => c.demo > 1.5 && c.demo < 6.5 && c.st.statepower > 0 && c.day > 100,
    choices: [
      { text: 'SLÄPP HENNE OCH LÅT HENNE KAMPANJA', cost: { pp: 15 }, temp: { polpower: -5 }, rel: 5, griev: -6, ind: { demo: 0.4, trustgov: 3 }, next: ['dmk_opp_kampanj', null], tip: 'En motståndare på torget är bättre än en martyr i en cell.' },
      { text: 'LÅT RÄTTEGÅNGEN GÅ', rel: -4, griev: 4, ind: { demo: -0.3 }, next: ['dmk_opp_rattegang', 'dmk_opp_hungerstrejk'], tip: 'Domstolen får avgöra. Frågan är hur fri den är.' },
      { text: 'HUSARREST TILL EFTER VALET', temp: { statepower: 3 }, rel: -6, griev: 8, ind: { demo: -0.5 }, next: ['dmk_opp_hungerstrejk', null], tip: 'Valet blir lättare att vinna. Och omöjligt att försvara.' },
    ],
  },
  {
    id: 'dmk_opp_rattegang', icon: '\u{2696}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'RÄTTEGÅNGEN MOT OPPOSITIONSLEDAREN',
    text: 'Rättegången hålls i en liten sal där bara tjugo åskådare får plats. Åklagarens viktigaste vittne har tagit tillbaka sitt vittnesmål, och försvaret har visat att de påstådda skattebrotten redan prövades och lades ned för sju år sedan. Domaren har bett om en veckas betänketid.',
    choices: [
      { text: 'LÅT DOMSTOLEN DÖMA FRITT', temp: { polpower: -4 }, rel: 4, ind: { trustgov: 3, demo: 0.3 }, next: 'dmk_opp_kampanj', tip: 'Domaren läser lagen. Inte telefonmeddelanden.' },
      { text: 'ERBJUD HENNE FRIHET MOT EXIL', cost: { pp: 10 }, temp: { unrest: -2 }, rel: -2, ind: { demo: -0.2 }, tip: 'Hon blir en röst från utlandet. De rösterna brukar bli starkare.' },
      { text: 'SE TILL ATT HON FÄLLS', cost: { pp: 15 }, temp: { statepower: 4 }, mod: 'martyr', rel: -8, griev: 10, ind: { demo: -0.6 }, next: ['dmk_opp_hungerstrejk', null], tip: 'En fällande dom som ingen tror på. Den värsta sorten.' },
    ],
  },
  {
    id: 'dmk_opp_hungerstrejk', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'HON HAR INTE ÄTIT PÅ 23 DAGAR',
    text: 'Oppositionsledaren hungerstrejkar i fängelset. Hennes läkare säger att hon är mycket svag. Varje kväll tänder tusentals människor ljus utanför fängelset i {stad}, och kyrkorna ringer i klockorna klockan nio. Hennes dotter har talat inför ett utländskt parlament.',
    choices: [
      { text: 'FRIGE HENNE AV HUMANITÄRA SKÄL', cost: { pp: 10 }, temp: { unrest: -5, polpower: -4 }, rel: 6, griev: -10, ind: { demo: 0.4 }, next: 'dmk_opp_kampanj', tip: 'Humanitära skäl är det bästa sättet att backa utan att säga att man backar.' },
      { text: 'LÅT LÄKARNA TA HAND OM HENNE I FÄNGELSET', temp: { unrest: 5 }, mod: 'martyr', rel: -6, griev: 6, tip: 'Ljusen utanför fängelset blir fler för varje kväll.' },
      { text: 'FLYTTA HENNE TILL ETT FÄNGELSE LÅNGT BORT', temp: { unrest: 7, statepower: 2 }, rel: -8, griev: 10, ind: { demo: -0.3 }, tip: 'Ljusen flyttar efter henne. Det tar bara längre tid.' },
    ],
  },
  {
    id: 'dmk_opp_kampanj', icon: '\u{1F4E3}', chain: true,
    title: 'HENNES MÖTEN SAMLAR TIOTUSENTALS',
    text: 'Oppositionsledaren är fri och hennes valmöten fyller torg i hela landet. I {stad} kom 60 000 människor, fler än till något möte på decennier. Hon talar om korruption, om ungdomsarbetslösheten och om dig. Mätningarna visar ett dött lopp.',
    choices: [
      { text: 'MÖT HENNE I EN TV-DEBATT', tip: 'Det är så det ska gå till. Även när det gör ont.',
        risk: { chance: 0.5,
          win: { text: 'Du är påläst och lugn. Hon blir arg. Du vinner debatten.', temp: { approval: 5 }, ind: { trustgov: 2 } },
          lose: { text: 'Hon är bättre förberedd. Klippet där du tappar tråden sprids.', temp: { approval: -6, polpower: -4 } } } },
      { text: 'LÅT HENNE VARA. DET ÄR DEMOKRATI', temp: { polpower: -3 }, perm: { stability: 1 }, ind: { demo: 0.3, trustgov: 2 }, tip: 'Ett land där oppositionen får tala är ett land som håller.' },
      { text: 'BJUD IN HENNE TILL EN SAMLINGSREGERING', cost: { pp: 20 }, temp: { unrest: -6, polpower: -6 }, perm: { stability: 2 }, ind: { trustgov: 4 }, tip: 'Den farligaste motståndaren är den som får dela ansvaret.' },
    ],
  },

  // ===== LAGEN OM UTLÄNDSKA AGENTER (kedja) =====
  {
    id: 'dmk_agentlagen', icon: '\u{1F3F7}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'LAGEN OM UTLÄNDSKA AGENTER',
    text: 'Organisationer som får mer än en femtedel av sina pengar från utlandet ska nu registrera sig som "utländska agenter" och märka allt de publicerar. Det gäller miljögrupper, en matbank, en förening för döva barn och landets största människorättsorganisation. Registreringen ska vara klar inom ett år.',
    when: (c) => c.is('speech', 'foreignagent', 'criminalized') && c.demo < 8 && c.day > 30,
    choices: [
      { text: 'STRYK LAGEN', cost: { pp: 20 }, law: ['speech', 'balanced'], rel: 5, griev: -8, ind: { demo: 0.4 }, tip: 'Föreningen för döva barn behöver inte längre kalla sig agent.' },
      { text: 'GE DEM ETT ÅR ATT REGISTRERA SIG', rel: -3, ind: { demo: -0.1 }, next: ['dmk_agent_matbanken', 'dmk_agent_vagrar'], tip: 'Ett år går fort. Särskilt för den som måste välja.' },
      { text: 'STÄNG DE STÖRSTA DIREKT', temp: { statepower: 4 }, rel: -8, griev: 8, ind: { demo: -0.5, pressfree: -3 }, next: 'dmk_agent_matbanken', tip: 'De största är också de som hjälper flest.' },
    ],
  },
  {
    id: 'dmk_agent_matbanken', icon: '\u{1F96B}', chain: true, kind: 'frihet',
    title: 'MATBANKEN I {STAD} HAR STÄNGT',
    text: 'Matbanken i {stad} fick pengar från en stiftelse i {land} och vägrade kalla sig agent. I dag är dörrarna låsta. Fyratusen familjer som hämtade mat varje vecka står utanför, och en rättshjälpsbyrå i samma hus har också stängt. Volontärerna delar ut smörgåsar från en husvagn.',
    choices: [
      { text: 'STATEN TAR ÖVER MATBANKEN', cost: { money: 250 }, temp: { qol: 2, unrest: -2 }, ind: { trustgov: 1 }, tip: 'Samma mat, nya blanketter. Volontärerna går hem.' },
      { text: 'UNDANTAG FÖR HJÄLPORGANISATIONER', cost: { pp: 10 }, temp: { approval: 2 }, rel: 3, griev: -6, ind: { demo: 0.2 }, tip: 'Lagen gäller nu bara de organisationer som inte delar ut mat.' },
      { text: 'DE FÅR SKYLLA SIG SJÄLVA', temp: { qol: -3, unrest: 4 }, rel: -4, griev: 8, ind: { trustgov: -2 }, tip: 'Husvagnen med smörgåsar blir en symbol för hela landet.' },
    ],
  },
  {
    id: 'dmk_agent_vagrar', icon: '\u{270B}', chain: true, kind: 'frihet',
    title: 'FYRTIO ORGANISATIONER VÄGRAR',
    text: 'Fyrtio organisationer har meddelat att de inte tänker registrera sig. "Vi är inte agenter för någon annan än dem vi hjälper", skriver de i ett brev som undertecknats av en ärkebiskop, två före detta domare och fotbollslandslagets kapten. Deras ledare säger: "Grip oss om ni vill."',
    choices: [
      { text: 'GE UPP OCH SKROTA LAGEN', cost: { pp: 15 }, law: ['speech', 'balanced'], temp: { polpower: -4 }, rel: 4, griev: -12, ind: { demo: 0.4 }, tip: 'Det går att förlora mot en ärkebiskop med heder.' },
      { text: 'BÖTFÄLL DEM', temp: { statepower: 2, unrest: 3 }, rel: -4, griev: 6, ind: { demo: -0.2 }, tip: 'Böterna betalas av en insamling på tre timmar.' },
      { text: 'GRIP LEDARNA', temp: { unrest: 6 }, mod: 'martyr', rel: -10, griev: 12, ind: { demo: -0.6 }, tip: 'Att gripa landslagskaptenen var ett taktiskt misstag.' },
    ],
  },

  // ===== CIVILSAMHÄLLET =====
  {
    id: 'dmk_demokraticafe', icon: '\u{2615}', weight: 2, cooldown: 900,
    title: 'DEMOKRATIKAFÉERNA',
    text: 'I bibliotek, församlingshem och idrottsklubbar över hela landet har frivilliga börjat ordna "demokratikaféer": en kväll i månaden då grannar dricker kaffe och diskuterar en politisk fråga med en lokalpolitiker. I {stad} kom 300 personer för att prata om busslinjer. Ingen bråkade.',
    when: (c) => c.demo > 6 && c.st.qol > 0 && c.day > 100,
    choices: [
      { text: 'STÖD DEM MED LOKALER OCH KAFFE', cost: { money: 80 }, ind: { trustgov: 2, turnout: 2 }, tip: 'Kaffe är demokratins billigaste smörjmedel.' },
      { text: 'TACKA DEM I ETT TAL', temp: { approval: 2 }, ind: { trustgov: 1 }, tip: 'De blev glada. Och lite förvånade.' },
      { text: 'GÖR DET TILL ETT STATLIGT PROGRAM', cost: { money: 250 }, temp: { ideopower: 2 }, ind: { turnout: 1 }, tip: 'Med blanketter och projektledare. De frivilliga börjar tröttna.' },
    ],
  },
  {
    id: 'dmk_demonstrationsforbud', icon: '\u{1FAA7}', weight: 2, kind: 'frihet', react: true,
    title: 'DEMONSTRATIONSFÖRBUDET PRÖVAS',
    text: 'Sedan ändringen av {lag} krävs polisens tillstånd för att fler än tjugo personer ska få samlas. I dag stod 20 000 människor ändå på torget i {huvudstad}, tysta och med tomma skyltar. Polisen står i kravallutrustning runt torget och väntar på order.',
    when: (c) => c.cut('protest') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -20, ind: { demo: 0.4, trustgov: 2 }, tip: 'Tomma skyltar säger mer än fulla. Det fick du lära dig.' },
      { text: 'LÅT DEM STÅ DÄR I DAG', temp: { statepower: -3 }, griev: -5, ind: { policetrust: 2 }, tip: 'Polisen tar av sig hjälmarna. Någon bjuder på kaffe.' },
      { text: 'SKINGRA FOLKMASSAN', griev: 10, tip: 'Tomma skyltar är svåra att anklaga för något.',
        risk: { chance: 0.5,
          win: { text: 'Torget töms under tystnad. Inga skador, men många filmar.', temp: { stability: 3, statepower: 3 }, ind: { demo: -0.3 } },
          lose: { text: 'Bilderna på poliser mot tomma skyltar sprids över hela världen.', temp: { unrest: 10 }, mod: 'martyr', rel: -5, ind: { demo: -0.5, trustgov: -5 } } } },
    ],
  },
  {
    id: 'dmk_oppositionen_fick_tala', icon: '\u{1F3A4}', weight: 2, cooldown: 900,
    title: 'OPPOSITIONEN FICK HÅLLA SITT MÖTE',
    text: 'För första gången på åtta år fick oppositionen tillstånd att hålla ett valmöte på stora torget i {huvudstad}. Polisen dirigerade trafiken i stället för att gripa folk. 80 000 människor kom, och mötet slutade i tid med att alla sjöng nationalsången. Utlandspressen skriver om "ett tö".',
    when: (c) => c.demo > 3 && c.demo < 6.5 && c.st.statepower < 25 && c.day > 100,
    choices: [
      { text: 'GE OPPOSITIONEN SÄNDNINGSTID I STATS-TV', cost: { pp: 10 }, rel: 3, ind: { demo: 0.3, pressfree: 2 }, tip: 'Tittarna får se en debatt. Den första på länge.' },
      { text: 'LÅT DET STANNA VID DETTA', temp: { stability: 1 }, rel: 1, ind: { trustgov: 1 }, tip: 'Ett möte är ett möte. Nästa ansökan ligger redan på bordet.' },
      { text: 'SKICKA IN PROVOKATÖRER NÄSTA GÅNG', tip: 'Provokatörer har en tendens att bli igenkända.',
        risk: { chance: 0.4,
          win: { text: 'Bråket blir oppositionens fel i alla tidningar.', temp: { statepower: 4, approval: 2 } },
          lose: { text: 'En provokatör känns igen som polis. Skandalen är ett faktum.', mod: 'scandal', rel: -5, ind: { demo: -0.3 } } } },
    ],
  },
  {
    id: 'dmk_medborgarforslag', icon: '\u{270D}\u{FE0F}', weight: 1, cooldown: 900,
    title: 'HUNDRATUSEN NAMN FÖR EN NY LAG',
    text: 'En undersköterska från {stad} har samlat in hundratusen namnunderskrifter för gratis kollektivtrafik för pensionärer. Grundlagen säger att parlamentet "får" ta upp sådana förslag, men det har aldrig hänt. Hon har bokat en buss till {huvudstad} för att lämna över namnen personligen.',
    when: (c) => c.demo > 6 && c.st.approval < 20 && c.day > 100,
    choices: [
      { text: 'TA UPP FÖRSLAGET I PARLAMENTET', cost: { pp: 10 }, ind: { trustgov: 3, turnout: 1 }, tip: 'Förslaget röstas kanske ned. Men det blev hört.' },
      { text: 'INFÖR MEDBORGARINITIATIV I GRUNDLAGEN', cost: { pp: 20 }, perm: { stability: 1, freedom: 1 }, ind: { demo: 0.2, trustgov: 2 }, tip: 'Hundratusen namn ska betyda något. Nu gör de det.' },
      { text: 'TACKA OCH ARKIVERA', temp: { approval: -2 }, ind: { trustgov: -2 }, tip: 'Bussen kör hem tom. Hon lovar att komma tillbaka med fler namn.' },
    ],
  },
  {
    id: 'dmk_partiforbud', icon: '\u{26D4}', weight: 1, cooldown: 1200, kind: 'frihet',
    title: 'ÅKLAGAREN VILL FÖRBJUDA ETT PARTI',
    text: 'Riksåklagaren vill förbjuda ett litet men växande parti. Partiets ledare har sagt att "valen bara är en väg till makten, inte ett mål", och ungdomsförbundet övar marsch i skogen. Partiet har fyra procent i mätningarna och säger att ett förbud bevisar allt de sagt om systemet.',
    when: (c) => c.demo > 4 && c.demo < 8.5 && c.st.unrest > 5 && c.day > 200,
    choices: [
      { text: 'LÅT GRUNDLAGSDOMSTOLEN AVGÖRA', cost: { pp: 10 }, tip: 'Den långsamma vägen. Den enda som håller i längden.',
        risk: { chance: 0.5,
          win: { text: 'Domstolen förbjuder partiet med tydliga skäl. Få protesterar.', temp: { stability: 3 }, ind: { trustgov: 2 } },
          lose: { text: 'Domstolen säger nej. Partiet firar och växer till sju procent.', temp: { stability: -2, polpower: -3 } } } },
      { text: 'MÖT DEM I DEBATTEN', temp: { polpower: -2 }, ind: { demo: 0.1, trustgov: 1 }, tip: 'Långsammare än ett förbud. Mer hållbart.' },
      { text: 'FÖRBJUD PARTIET MED DEKRET', temp: { stability: 2, unrest: 4 }, rel: -3, griev: 6, ind: { demo: -0.5 }, tip: 'Den som förbjuder partier med dekret liknar plötsligt det han förbjöd.' },
    ],
  },

  // ===== FOLKOMRÖSTNINGEN (kedja) =====
  {
    id: 'dmk_folk_krav', icon: '\u{1F4DD}', weight: 2, kind: 'frihet', react: true,
    title: 'FOLKET VILL RÖSTA OM {LAG}',
    text: 'Efter ändringen av {lag} har en bred rörelse samlat in 600 000 namnunderskrifter på sex veckor. De kräver en folkomröstning. Kyrkor, fackföreningar och två oppositionspartier står bakom kravet. Grundlagen tvingar dig inte, men för varje dag utan svar blir kön till namninsamlingen längre.',
    when: (c) => c.changed('government', 'elections', 'civil_rights', 'surveillance', 'speech') && c.demo > 4.5 && c.day > 30,
    choices: [
      { text: 'UTLYS FOLKOMRÖSTNING', cost: { money: 200 }, ind: { trustgov: 2, turnout: 2 }, next: 'dmk_folk_kampanj', tip: 'Folket får sista ordet. Du får vänta på det.' },
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, temp: { polpower: -3 }, griev: -15, tip: 'Snabbare än en omröstning. Och billigare.' },
      { text: 'AVFÄRDA KRAVET', griev: 6, ind: { trustgov: -3, demo: -0.1 }, tip: 'Sexhundratusen namn i en låda. De vet var lådan står.' },
    ],
  },
  {
    id: 'dmk_folk_kampanj', icon: '\u{1F3AA}', chain: true, kind: 'frihet',
    title: 'VALSTUGORNA ÄR UPPE',
    text: 'Folkomröstningen är om tre veckor. Ja-sidan och nej-sidan har valstugor på varje torg, och i {stad} har en familj delat sitt hus på mitten med en ja-skylt i ena fönstret och en nej-skylt i det andra. Statstelevisionen frågar om regeringen tänker göra reklam för sin linje med skattepengar.',
    choices: [
      { text: 'KAMPANJA FÖR DIN LINJE MED PARTIETS PENGAR', cost: { pp: 10 }, temp: { ideopower: 2, polpower: 2 }, next: 'dmk_folk_resultat', tip: 'Partiets pengar, partiets risk. Helt i sin ordning.' },
      { text: 'HÅLL STATEN HELT NEUTRAL', ind: { trustgov: 2, demo: 0.1 }, next: 'dmk_folk_resultat', tip: 'Ett resultat som ingen kan kalla riggat.' },
      { text: 'LÅT STATS-TV GÖRA REKLAM FÖR DIN SIDA', ind: { pressfree: -3, demo: -0.3, trustgov: -2 }, next: 'dmk_folk_resultat', tip: 'Den andra sidan har nu ett argument till.' },
    ],
  },
  {
    id: 'dmk_folk_resultat', icon: '\u{1F5F3}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'FOLKOMRÖSTNINGENS RESULTAT',
    text: 'Vallokalerna har stängt och valdeltagandet blev högt. Rösterna räknas under natten i alla kommuner samtidigt, och klockan tre står det klart att det blir jämnt. Grundlagen säger att omröstningen bara är rådgivande. Alla vet att den inte är det.',
    choices: [
      { text: 'VI FÖLJER RESULTATET, VAD DET ÄN BLIR', tip: 'Den som frågar folket måste kunna leva med svaret.',
        risk: { chance: 0.5,
          win: { text: 'Ja till din linje med 53 procent. Beslutet står fast, nu med folkets stöd.', temp: { approval: 5, stability: 3 }, ind: { trustgov: 4 } },
          lose: { text: 'Nej-sidan vann med 54 procent. Ändringen rivs upp i morgon bitti.', undo: true, griev: -20, ind: { demo: 0.3, trustgov: 3 } } } },
      { text: 'KALLA OMRÖSTNINGEN RÅDGIVANDE', temp: { polpower: 3 }, griev: 12, ind: { trustgov: -6, demo: -0.4 }, tip: 'Formellt korrekt. Ingen kommer att glömma det.' },
      { text: 'GÖR OM OMRÖSTNINGEN OM ETT ÅR', cost: { pp: 15 }, temp: { unrest: 3 }, ind: { trustgov: -3 }, tip: 'Man röstar tills det blir rätt. Väljarna har ett ord för det.' },
    ],
  },
  {
    id: 'dmk_byn_rostade', icon: '\u{1F3EB}', weight: 1, cooldown: 1000,
    title: 'BYN SOM RÖSTADE OM SIN SKOLA',
    text: 'I en by utanför {stad} höll kommunen sin första lokala folkomröstning, om byskolan skulle läggas ned. 91 procent röstade, fler än i något riksdagsval. Skolan blev kvar, föräldrarna lovade att måla den själva och kommunen sparar in pengarna på annat håll. Nu vill tjugo andra kommuner göra likadant.',
    when: (c) => c.demo > 6 && c.st.stability > 0 && c.day > 200,
    choices: [
      { text: 'LAGSTIFTA OM LOKALA FOLKOMRÖSTNINGAR', cost: { pp: 15 }, perm: { stability: 1 }, ind: { turnout: 2, trustgov: 2 }, tip: 'Små frågor, stora valdeltaganden. Och färre arga insändare.' },
      { text: 'GE KOMMUNERNA ETT BIDRAG FÖR ATT PRÖVA', cost: { money: 100 }, temp: { approval: 2 }, ind: { trustgov: 2 }, tip: 'Tjugo kommuner, tjugo folkomröstningar, tjugo målade skolor.' },
      { text: 'SÅDANT SKÖTER KOMMUNERNA SJÄLVA', temp: { approval: 1 }, ind: { turnout: 1 }, tip: 'Det gör de. Och ganska bra, visar det sig.' },
    ],
  },

  // ===== OMVÄRLDEN: BISTÅNDET (kedja) =====
  {
    id: 'dmk_bistand_fryst', icon: '\u{1F9CA}', weight: 3, cooldown: 900, kind: 'frihet',
    title: 'BISTÅNDET FRYSER',
    text: 'Tre av landets största givare har fryst sitt bistånd i väntan på "tydliga steg tillbaka mot demokratin". Pengarna betalade en tredjedel av vaccinationsprogrammet och nästan alla nya brunnar på landsbygden. Givarnas ambassadörer har lämnat över en lista med fem krav.',
    when: (c) => c.trend('demo') < -0.25 && c.demo < 7 && (c.ind.gdppc ?? 10000) < 20000,
    choices: [
      { text: 'GENOMFÖR GIVARNAS FEM KRAV', cost: { pp: 20 }, res: { money: 400 }, rel: 6, griev: -6, ind: { demo: 0.4 }, next: ['dmk_bistand_granskning', null], tip: 'Pengarna kommer tillbaka. Granskarna också.' },
      { text: 'VÄND DIG TILL EN NY LÅNGIVARE', temp: { statepower: 3 }, rel: -6, next: 'dmk_bistand_nya_vanner', tip: 'Det finns alltid någon som lånar ut utan frågor. Frågorna kommer senare.' },
      { text: 'STRAMA ÅT BUDGETEN OCH KLARA OSS SJÄLVA', temp: { income: -3, approval: -3, ideopower: 4 }, ind: { gdpgrowth: -0.5 }, tip: 'Stolt, självständigt och utan nya brunnar.' },
    ],
  },
  {
    id: 'dmk_bistand_granskning', icon: '\u{1F575}\u{FE0F}', chain: true,
    title: 'GIVARNA VILL SE RESULTAT',
    text: 'Ett år efter att biståndet återupptogs kommer givarnas granskare för att se om reformerna är på riktigt. De vill träffa oppositionen, besöka ett fängelse och läsa domar. Inrikesministeriet har förberett ett program med en skolinvigning och två fabriksbesök.',
    choices: [
      { text: 'LÅT DEM GRANSKA FRITT', res: { money: 300 }, rel: 4, ind: { demo: 0.2 }, tip: 'Det de hittar är inte perfekt. Men det är på riktigt.' },
      { text: 'VISA DEM PROGRAMMET MED SKOLINVIGNINGEN', tip: 'Granskare är vana vid skolinvigningar.',
        risk: { chance: 0.5,
          win: { text: 'Granskarna är nöjda med skolan. Pengarna fortsätter komma.', res: { money: 300 } },
          lose: { text: 'En granskare smiter iväg till fängelset på egen hand. Biståndet stoppas.', rel: -10, ind: { trustgov: -2 } } } },
      { text: 'TACKA NEJ TILL VILLKOREN', temp: { ideopower: 3 }, rel: -4, tip: 'Stolthet är gratis. Brunnar är det inte.' },
    ],
  },
  {
    id: 'dmk_bistand_nya_vanner', icon: '\u{2693}', chain: true,
    title: 'LÅNET FRÅN {LAND} HAR VILLKOR',
    text: 'En regering i {land} som aldrig frågar om val eller pressfrihet erbjuder ett stort lån till låg ränta. Villkoren står på sidan 46: deras bolag ska få driva hamnen i 99 år och sätta upp övervakningskameror i {huvudstad}. Lånet kan betalas ut på fredag.',
    choices: [
      { text: 'TA LÅNET', res: { money: 600 }, law: ['surveillance', 'facial'], temp: { statepower: 3 }, perm: { corruption: 2 }, rel: -4, tip: 'Pengar på fredag. Kameror på måndag. Hamnen i 99 år.' },
      { text: 'FÖRHANDLA BORT HAMNEN OCH KAMERORNA', cost: { pp: 15 }, res: { money: 350 }, rel: -1, tip: 'Hälften av pengarna, ingen av fällorna.' },
      { text: 'AVSTÅ OCH GÅ TILLBAKA TILL DE GAMLA GIVARNA', cost: { pp: 20 }, temp: { statepower: -2 }, rel: 4, ind: { demo: 0.3 }, tip: 'De gamla givarna är jobbiga. Men de vill inte äga hamnen.' },
    ],
  },

  // ===== OMVÄRLDEN REAGERAR =====
  {
    id: 'dmk_sanktioner', icon: '\u{1F6C2}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'SANKTIONER EFTER VALET',
    text: 'Efter ett val som omvärlden kallar "varken fritt eller rättvist" har tolv länder infört sanktioner: inreseförbud för fyrtio ministrar och domare, frysta konton och stopp för vissa exportlicenser. Flygbolagen har ställt in direktlinjen till {huvudstad} och centralbanken säger att valutan är under tryck.',
    when: (c) => c.demo < 4 && c.trend('demo') < -0.1 && c.day > 150,
    choices: [
      { text: 'SLÄPP DE POLITISKA FÅNGARNA SOM EN GEST', cost: { pp: 20 }, temp: { statepower: -3 }, rel: 8, griev: -8, ind: { demo: 0.4 }, tip: 'En gest räcker inte. Men den öppnar en dörr.' },
      { text: 'KÖP DET VI BEHÖVER VIA MELLANHÄNDER', cost: { money: 200 }, temp: { gdp: 2 }, perm: { corruption: 2 }, tip: 'Mellanhänderna blir mycket rika. Ingen annan.' },
      { text: 'SVARA MED EGNA SANKTIONER', temp: { ideopower: 4, gdp: -2 }, rel: -6, ind: { stockcap: -8 }, tip: 'De köper inte våra varor. Vi köper inte deras. Alla blir fattigare.' },
    ],
  },
  {
    id: 'dmk_ambassadorernas_brev', icon: '\u{1F4E9}', weight: 2, kind: 'frihet', react: true,
    title: 'AMBASSADÖRERNAS GEMENSAMMA BREV',
    text: 'Fjorton ambassadörer har skrivit under ett öppet brev om ändringen av {lag}. De skriver "med oro" att den riskerar landets internationella åtaganden och ber regeringen att "ompröva beslutet". Brevet publicerades på en söndag, när tidningarna har som mest plats.',
    when: (c) => c.cut('press', 'speech', 'protest', 'civil_rights', 'elections', 'trials', 'internet', 'government') && c.demo > 3,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 15 }, undo: true, griev: -10, rel: 8, tip: 'Fjorton ambassader andas ut. Dina allierade också.' },
      { text: 'BJUD IN TILL DIALOG OM LAGEN', cost: { pp: 10 }, griev: -3, rel: 3, tip: 'Dialog betyder att alla får säga sitt. Och sedan händer inget.' },
      { text: 'KALLA UPP AMBASSADÖRERNA OCH TILLRÄTTAVISA DEM', temp: { ideopower: 4, approval: 2 }, rel: -8, tip: 'Det låter bra på kvällsnyheterna. Mindre bra i handelsförhandlingarna.' },
    ],
  },
  {
    id: 'dmk_reform_berom', icon: '\u{1F54A}\u{FE0F}', weight: 2, kind: 'frihet', react: true,
    title: 'BERÖM FRÅN HELA VÄRLDEN',
    text: 'Ändringen av {lag} har gjort {rike} till en nyhet i utlandet, för en gångs skull en positiv. FN:s människorättskommissionär kallar beslutet "modigt", tre länder vill förhandla om nya handelsavtal och en stor tidning har skickat en reporter för att skriva om "landet som valde öppenhet".',
    when: (c) => c.raised('press', 'speech', 'protest', 'civil_rights', 'elections', 'trials', 'internet', 'government') && c.demo < 8.5,
    choices: [
      { text: 'TA EMOT DELEGATIONERNA', cost: { money: 100 }, rel: 8, mod: 'foreign_investment', tip: 'Handelsdelegationer, journalister och en och annan turist.' },
      { text: 'GÅ VIDARE MED NÄSTA REFORM', cost: { pp: 20 }, temp: { statepower: -3 }, perm: { freedom: 2 }, griev: -6, ind: { demo: 0.4 }, tip: 'Medvind är till för att segla i.' },
      { text: 'DET ÄR VÅRT EGET BESLUT', temp: { ideopower: 3 }, rel: 3, tip: 'Sant, och dessutom populärt hemma.' },
    ],
  },
  {
    id: 'dmk_toppmote_inbjuden', icon: '\u{1F310}', weight: 1, cooldown: 1200,
    title: 'INBJUDNA TILL DEMOKRATITOPPMÖTET',
    text: '{rike} har bjudits in att tala på det stora demokratitoppmötet i {land}. Arrangörerna vill att du berättar om valen, pressfriheten och hur landet behållit sina institutioner när andra har vacklat. Det är tre minuter i talarstolen, men tre minuter som hela världen tittar på.',
    when: (c) => c.demo > 7.5 && c.day > 200,
    choices: [
      { text: 'TALA OM FRAMTIDEN, INTE OM OSS SJÄLVA', cost: { pp: 5 }, temp: { ideopower: 2 }, rel: 6, tip: 'Ödmjukhet i talarstolen är ovanligt. Därför minns man den.' },
      { text: 'LOVA PENGAR TILL VALOBSERVATÖRER I ANDRA LÄNDER', cost: { money: 200 }, temp: { approval: 2 }, rel: 10, tip: 'Fria val på andra ställen gör grannskapet tryggare.' },
      { text: 'SKICKA UTRIKESMINISTERN', rel: 2, tip: 'Tre minuter är tre minuter. Hon gör det bra.' },
    ],
  },
  {
    id: 'dmk_toppmote_utesluten', icon: '\u{1F6AA}', weight: 1, cooldown: 1200, kind: 'frihet',
    title: 'INTE INBJUDNA TILL TOPPMÖTET',
    text: 'Hundra länder har bjudits in till demokratitoppmötet i {land}. {rike} står inte på listan, men två av grannländerna gör det. Utrikesministern har läst listan tre gånger. Statstelevisionen kallar toppmötet "ointressant", medan unga delar bilder av listan med texten "varför inte vi?".',
    when: (c) => c.demo > 2 && c.demo < 5 && c.day > 200,
    choices: [
      { text: 'LOVA REFORMER OCH BE OM EN PLATS NÄSTA ÅR', cost: { pp: 15 }, rel: 4, griev: -4, ind: { demo: 0.2 }, tip: 'Nästa år står ni kanske på listan. Om löftena hålls.' },
      { text: 'HÅLL ETT EGET TOPPMÖTE FÖR "STABILA LÄNDER"', cost: { money: 200 }, temp: { ideopower: 4 }, rel: -3, tip: 'Sju länder kommer. Ingen av dem har haft ett fritt val på länge.' },
      { text: 'VI BEHÖVER INTE DERAS GODKÄNNANDE', temp: { ideopower: 2 }, griev: 3, ind: { trustgov: -1 }, tip: 'De unga håller inte med. De har bara inte röstat än.' },
    ],
  },
  {
    id: 'dmk_fondbolaget', icon: '\u{1F3E6}', weight: 2, cooldown: 900,
    title: 'FONDBOLAGET LÄMNAR {RIKE}',
    text: 'En av världens största pensionsfonder säljer alla sina statsobligationer och aktier i {rike}. I pressmeddelandet står det att "rättsstatens försvagning gör att vi inte längre kan bedöma riskerna". Börsen föll fyra procent på förmiddagen. Två andra fonder säger att de "följer utvecklingen noga".',
    when: (c) => c.trend('demo') < -0.35 && (c.ind.stockcap ?? 30) > 15,
    choices: [
      { text: 'GARANTERA DOMSTOLARNAS OBEROENDE I LAG', cost: { pp: 15 }, rel: 3, ind: { stockcap: 5, demo: 0.2 }, tip: 'Investerare läser lagtexter. Noggrannare än väljarna.' },
      { text: 'STATLIGA FONDER KÖPER DET SOM SÄLJS', cost: { money: 400 }, temp: { gdp: 1 }, perm: { corruption: 1 }, ind: { stockcap: 3 }, tip: 'Kursen räddas. Frågan om varför de sålde finns kvar.' },
      { text: 'LÅT DEM GÅ', mod: 'capital_flight', ind: { stockcap: -10 }, tip: 'De två andra fonderna följer utvecklingen. Och sedan efter.' },
    ],
  },
  {
    id: 'dmk_bilfabriken', icon: '\u{1F3ED}', weight: 2, cooldown: 1200,
    title: 'BILFABRIKEN VALDE {RIKE}',
    text: 'En stor biltillverkare har valt att bygga sin nya elbilsfabrik i {stad} och inte i två billigare länder. Koncernchefen förklarar: "Era domstolar är oberoende och era kontrakt gäller. Det är värt mer än lägre löner." Fabriken ska ge 4 000 jobb.',
    when: (c) => c.demo > 7.5 && (c.ind.trustcourt ?? 40) > 40 && c.day > 100,
    choices: [
      { text: 'BYGG VÄG OCH JÄRNVÄG TILL FABRIKEN', cost: { money: 300 }, temp: { gdp: 3, approval: 2 }, mod: 'foreign_investment', tip: 'Fyratusen jobb och en ny pendeltågslinje.' },
      { text: 'SAMMA VILLKOR SOM FÖR ALLA ANDRA', temp: { gdp: 2 }, perm: { corruption: -1 }, tip: 'Inga specialavtal. Just därför kom de.' },
      { text: 'KRÄV ATT HÄLFTEN AV JOBBEN GÅR TILL UNGA', cost: { pp: 10 }, temp: { approval: 3 }, ind: { youthunemp: -0.8 }, tip: 'Biltillverkaren går med på det. Unga lär sig fort.' },
    ],
  },

  // ===== KUPPEN (kedja) =====
  {
    id: 'dmk_kupp_rykte', icon: '\u{1FA96}', weight: 2, cooldown: 1200,
    title: 'RYKTEN OM EN KUPP',
    text: 'Säkerhetstjänsten rapporterar att fyra överstar har träffats tre nätter i rad i ett jaktslott utanför {stad}. De pratar om "landets räddning" och har kontaktat befälhavaren för pansarbrigaden. Ingen vet hur långt planerna har gått. Ryktena har redan nått kvällstidningarna.',
    when: (c) => c.demo > 2 && c.demo < 6 && (c.st.unrest > 15 || c.st.stability < -10) && c.day > 120,
    choices: [
      { text: 'BYT UT ARMÉLEDNINGEN I NATT', cost: { pp: 20 }, temp: { statepower: 4, milpower: -3 }, next: ['dmk_kupp_natten', null], tip: 'Den som slår först slipper ofta slå alls. Ofta.' },
      { text: 'HÖJ OFFICERSLÖNERNA', cost: { money: 300 }, temp: { stability: 2, readiness: 3 }, perm: { corruption: 1 }, tip: 'Nöjda överstar konspirerar mindre. De flesta.' },
      { text: 'BE FOLKET FÖRSVARA DEMOKRATIN', temp: { approval: 2 }, ind: { trustgov: 3, demo: 0.2 }, next: ['dmk_kupp_natten', null], tip: 'Kupper behöver tomma gator. Det här ger dem fulla.' },
      { text: 'IGNORERA RYKTENA', temp: { stability: -1 }, next: ['dmk_kupp_natten', 'dmk_kupp_natten', null], tip: 'Det mesta som står i kvällstidningarna är fel. Det mesta.' },
    ],
  },
  {
    id: 'dmk_kupp_natten', icon: '\u{1F319}', chain: true,
    title: 'STRIDSVAGNAR VID STATSRADION',
    text: 'Klockan tre i natt rullade stridsvagnar fram till statsradion och parlamentet i {huvudstad}. En överste läser upp ett uttalande om att "armén tagit ansvar för nationen". Mobilnätet fungerar fortfarande. Dina livvakter har en helikopter redo, och tre regementen har ännu inte bestämt sig.',
    choices: [
      { text: 'MOBILISERA FOLKET VIA MOBILEN', next: 'dmk_kupp_morgon', tip: 'En selfie från ett hemligt rum kan stoppa en stridsvagn. Ibland.',
        risk: { chance: 0.55,
          win: { text: 'Hundratusentals fyller gatorna. Soldaterna sänker vapnen.', temp: { stability: 5 }, mod: 'national_unity', ind: { demo: 0.3, trustgov: 6 } },
          lose: { text: 'Kuppmakarna stänger nätet. Natten blir lång och kaotisk.', temp: { stability: -15, statepower: -10 }, ind: { demo: -1 } } } },
      { text: 'LOJALA FÖRBAND SLÅR TILLBAKA', cost: { man: 10 }, next: 'dmk_kupp_morgon', tip: 'Soldater mot soldater. Ingen vinner på det, men någon vinner.',
        risk: { chance: 0.6,
          win: { text: 'Kuppmakarna ger upp före gryningen. Ingen skadas allvarligt.', temp: { statepower: 6, stability: 3 } },
          lose: { text: 'Striderna drar ut på tiden. Landet är delat i två läger.', temp: { stability: -10, milpower: -6, unrest: 8 } } } },
      { text: 'FÖRHANDLA MED ÖVERSTARNA', cost: { pp: 25 }, temp: { statepower: -8 }, perm: { stability: -2 }, ind: { demo: -0.6 }, next: 'dmk_kupp_morgon', tip: 'Överstarna går tillbaka till kasernen. Med en lista på villkor.' },
    ],
  },
  {
    id: 'dmk_kupp_morgon', icon: '\u{1F305}', chain: true, kind: 'frihet',
    title: 'MORGONEN EFTER KUPPNATTEN',
    text: 'När solen går upp är det över. Överstarna är gripna eller har flytt över gränsen till {granne}. Men landet är skakat: säkerhetstjänsten har en lista med 3 000 namn på officerare, domare och lärare som "kan ha vetat". Ditt parti vill ha hämnd. Oppositionen vill ha rättssäkerhet.',
    choices: [
      { text: 'RÄTTVISA RÄTTEGÅNGAR FÖR LEDARNA', cost: { pp: 15 }, perm: { stability: 2 }, rel: 5, ind: { demo: 0.4, trustgov: 3 }, tip: 'Kuppmakarna får det de förnekade andra: en rättvis rättegång.' },
      { text: 'AMNESTI FÖR MENIGA SOLDATER', cost: { pp: 10 }, temp: { unrest: -5, milpower: 2, stability: 2 }, tip: 'Den som lydde order ska inte straffas som den som gav dem.' },
      { text: 'RENSA UT ALLA PÅ LISTAN', temp: { statepower: 8 }, mod: 'purge_aftermath', rel: -6, griev: 15, ind: { demo: -0.8, pressfree: -4 }, tip: 'Tre tusen namn. Några av dem visste säkert något.' },
    ],
  },

  // ===== KUPPER OCH MILITÄRSTYRE =====
  {
    id: 'dmk_juntan_granne', icon: '\u{1F396}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'JUNTAN I {GRANNE} VILL BLI ERKÄND',
    text: 'Militären i {granne} har tagit makten och lovar val "när ordningen är återställd". Juntans utrikesminister har skrivit och bett {rike} om ett erkännande. I gengäld erbjuds billigare gas och ett handelsavtal. Flyktingar från {granne} har redan börjat komma över gränsen.',
    when: (c) => c.demo > 3 && c.st.stability > 0 && c.day > 200,
    choices: [
      { text: 'ERKÄNN JUNTAN OCH TA GASEN', temp: { gdp: 2, income: 2 }, rel: -5, tip: 'Billig gas. Dyrt rykte.' },
      { text: 'VÄGRA OCH KRÄV VAL INOM ETT ÅR', cost: { pp: 10 }, temp: { ideopower: 2 }, rel: 6, tip: 'Juntan blir sur. Demokratierna minns vem som stod upp.' },
      { text: 'TA EMOT FLYKTINGARNA OCH OPPOSITIONEN', cost: { money: 200 }, temp: { integration: -2, approval: -2 }, rel: 8, tip: 'Exilregeringen flyttar in i ett kontor i huvudstaden.' },
    ],
  },
  {
    id: 'dmk_militarstyre', icon: '\u{1FA96}', weight: 2, kind: 'frihet', react: true,
    title: 'GENERALERNA I REGERINGEN',
    text: 'Sedan ändringen av {lag} sitter fem generaler i regeringen och parlamentet har skickats hem "tills vidare". Gatorna är lugna och tågen går i tid. Men tre universitetsrektorer har avgått, landets största tidning har slutat skriva ledare och biståndsgivarna har ställt in alla möten.',
    when: (c) => c.changed('government') && c.is('government', 'junta', 'authoritarian', 'totalitarian', 'partystate'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL {LAG}', cost: { pp: 30 }, undo: true, temp: { stability: -3 }, rel: 8, griev: -25, ind: { demo: 1 }, tip: 'Generalerna går tillbaka till kasernerna. Med en viss lättnad.' },
      { text: 'LOVA FRIA VAL INOM TRE ÅR', cost: { pp: 15 }, rel: 3, griev: -8, ind: { trustgov: 2 }, tip: 'Tre år är lång tid. Folk kommer att räkna dagarna.' },
      { text: 'STÅ FAST', temp: { stability: 3, statepower: 5 }, rel: -10, griev: 12, ind: { demo: -0.5 }, tip: 'Tågen går i tid. Det har alltid varit diktaturens bästa argument.' },
    ],
  },
  {
    id: 'dmk_officerarnas_brev', icon: '\u{1F4DC}', weight: 2, cooldown: 1000,
    title: 'OFFICERARNAS ÖPPNA BREV',
    text: 'Tjugo pensionerade generaler och fem aktiva överstar har publicerat ett öppet brev. De skriver att regeringen "tappat kontrollen över gatorna" och att armén "inte kommer att se på när landet går under". Brevet nämner inte ordet kupp. Det behövs inte.',
    when: (c) => c.demo > 4 && c.demo < 8 && c.st.unrest > 20 && c.day > 100,
    choices: [
      { text: 'AVSKEDA DE AKTIVA OFFICERARE SOM SKREV UNDER', cost: { pp: 10 }, temp: { statepower: 3, milpower: -2 }, ind: { demo: 0.1 }, tip: 'Armén lyder de folkvalda. Det är hela poängen med en armé.' },
      { text: 'LYSSNA PÅ DEM OCH SKÄRP TONEN MOT OROLIGHETERNA', temp: { milpower: 2, unrest: -3, freedom: -2 }, ind: { demo: -0.2 }, tip: 'Generalerna nickar nöjt. Det är det som är oroande.' },
      { text: 'ÅTALA ALLA FÖR UPPVIGLING', tip: 'Ett åtal är ett tydligt besked. Men till vem?',
        risk: { chance: 0.5,
          win: { text: 'Generalerna backar och ber om ursäkt. Brevet glöms bort.', temp: { statepower: 4 } },
          lose: { text: 'Fler officerare skriver under. Nu är de tvåhundra.', temp: { stability: -6, milpower: -4 } } } },
    ],
  },

  // ===== TÖVÄDRET: EN DIKTATUR ÖPPNAR SIG (kedja) =====
  {
    id: 'dmk_tovadret', icon: '\u{1F327}\u{FE0F}', weight: 2, cooldown: 1200, kind: 'frihet',
    title: 'TÖVÄDRET',
    text: 'Den reformvänliga falangen i regeringen föreslår att 200 politiska fångar släpps, att en oberoende tidning tillåts och att oppositionen får ställa upp i kommunvalen. Säkerhetstjänstens chef varnar för att "ett litet hål i dammen blir en flodvåg". Ekonomerna säger att utländska investerare väntar på just detta.',
    when: (c) => c.demo < 4 && (c.st.approval < 15 || c.st.unrest > 10) && c.day > 200,
    choices: [
      { text: 'GENOMFÖR ALLA TRE REFORMERNA', cost: { pp: 25 }, temp: { unrest: 4 }, rel: 8, griev: -10, ind: { demo: 0.6, pressfree: 5 }, next: ['dmk_to_krav', 'dmk_to_hardforarna'], tip: 'Fönstret är öppnat. Nu kommer vinden.' },
      { text: 'BÖRJA MED FÅNGARNA', cost: { pp: 10 }, rel: 4, griev: -5, ind: { demo: 0.3 }, next: ['dmk_to_krav', null], tip: 'Ett steg i taget. De frigivna har mycket att berätta.' },
      { text: 'AVFÄRDA REFORMVINGEN', temp: { statepower: 4, ideopower: 2 }, rel: -3, griev: 4, ind: { trustgov: -2 }, tip: 'Dammen håller. Trycket bakom den växer.' },
    ],
  },
  {
    id: 'dmk_to_krav', icon: '\u{1F490}', chain: true, kind: 'frihet',
    title: 'DE VILL HA MER',
    text: 'Reformerna har gett folk mod. Åttiotusen studenter, lärare och fabriksarbetare har samlats i {huvudstad} och kräver fria val till parlamentet. De sjunger gamla folkvisor och delar ut blommor till poliserna. Den oberoende tidningen trycker en extraupplaga varje dag och säljer slut före lunch.',
    choices: [
      { text: 'UTLYS FRIA VAL', cost: { pp: 40 }, law: ['elections', 'free'], temp: { stability: -6, polpower: -10 }, rel: 12, griev: -15, ind: { demo: 1.2 }, next: 'dmk_to_valet', tip: 'Det största beslutet en ledare kan fatta: att låta andra bestämma.' },
      { text: 'NY GRUNDLAG MED FLERPARTISYSTEM OM TRE ÅR', cost: { pp: 20 }, temp: { unrest: -4 }, rel: 5, griev: -6, ind: { demo: 0.5 }, next: ['dmk_to_valet', null], tip: 'Tre år ger tid att bygga institutioner. Och tid att ångra sig.' },
      { text: 'SLÅ TILLBAKA', griev: 15, tip: 'Blommor mot sköldar. Bilderna kommer att leva längre än du.',
        risk: { chance: 0.5,
          win: { text: 'Gatorna töms. Tövädret är över, och det blir kallt igen.', temp: { stability: 6, statepower: 6 }, rel: -10, ind: { demo: -0.8 } },
          lose: { text: 'Soldaterna vägrar gå mot studenterna. Regimen skakar.', temp: { stability: -12, statepower: -8 }, rel: -6 } } },
    ],
  },
  {
    id: 'dmk_to_hardforarna', icon: '\u{1F9CA}', chain: true, kind: 'frihet',
    title: 'HÅRDFÖRARNA SLÅR TILLBAKA',
    text: 'Den gamla garden i partiet och säkerhetstjänsten har fått nog. De har låtit gripa den oberoende tidningens chefredaktör, och i partiets egen tidning står det att reformerna är "ett utländskt projekt". Två reformministrar har fått order att inte lämna sina hem. Allt hänger på vad du gör nu.',
    choices: [
      { text: 'AVSKEDA SÄKERHETSTJÄNSTENS CHEF', cost: { pp: 20 }, temp: { statepower: -4 }, rel: 4, ind: { demo: 0.3, pressfree: 2 }, next: ['dmk_to_krav', null], tip: 'Den som avskedar säkerhetstjänstens chef sover lite sämre ett tag.' },
      { text: 'VÄND DIG DIREKT TILL FOLKET I TV', tip: 'Ett tal kan vinna en maktkamp. Om sändningen håller.',
        risk: { chance: 0.5,
          win: { text: 'Folket ställer sig bakom dig. Hårdförarna backar.', temp: { approval: 6 }, ind: { trustgov: 6, demo: 0.3 } },
          lose: { text: 'Sändningen bryts mitt i talet. Nu vet alla att du inte bestämmer.', temp: { stability: -8, unrest: 6, statepower: -4 } } } },
      { text: 'KOMPROMISSA. REFORMERNA PAUSAS', temp: { stability: 3 }, rel: -3, griev: 8, ind: { demo: -0.3 }, tip: 'En paus blir ofta ett stopp. Alla vet det.' },
    ],
  },
  {
    id: 'dmk_to_valet', icon: '\u{1F5F3}\u{FE0F}', chain: true,
    title: 'DET FÖRSTA FRIA VALET PÅ 40 ÅR',
    text: 'Folk har köat sedan klockan fem på morgonen. Gamla kvinnor har tagit på sig sina finaste kläder och unga män bär flaggan som en mantel. Valdeltagandet blir 84 procent. När rösterna räknas står observatörer från tjugo länder vid borden. Ditt parti kan vinna. Det kan också förlora.',
    choices: [
      { text: 'ERKÄNN RESULTATET, VAD DET ÄN BLIR', tip: 'Det här ögonblicket står i historieböckerna, vad som än händer.',
        risk: { chance: 0.5,
          win: { text: 'Ditt reformparti vinner. För första gången har du ett riktigt mandat.', temp: { approval: 10, stability: 6 }, ind: { trustgov: 8, demo: 0.5 } },
          lose: { text: 'Oppositionen vinner. Du blir ihågkommen som den som lämnade över i fred.', temp: { polpower: -15, stability: 3 }, rel: 12, ind: { demo: 1 } } } },
      { text: 'DELA MAKTEN I EN ÖVERGÅNGSREGERING', cost: { pp: 20 }, temp: { polpower: -6 }, perm: { stability: 3 }, ind: { demo: 0.6, trustgov: 5 }, tip: 'Ingen förlorar allt. Landet vinner tid.' },
      { text: 'SKJUT UPP RÄKNINGEN', temp: { unrest: 12 }, rel: -15, ind: { demo: -1.2, trustgov: -10 }, tip: 'Valurnorna står kvar i en lagerlokal. Hela världen tittar på dörren.' },
    ],
  },

  // ===== AUKTORITÄRA STATER SOM ÖPPNAR SIG =====
  {
    id: 'dmk_amnesti_fangar', icon: '\u{1F513}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'AMNESTI FÖR DE POLITISKA FÅNGARNA?',
    text: 'Fängelserna rymmer hundratals människor som dömts för sina åsikter: bloggare, fackföreningsledare, en poet och en 74-årig präst. En amnesti skulle ge stort beröm utomlands. Säkerhetstjänsten varnar för att de frigivna kommer att "tala till folket", vilket är precis vad de tänker göra.',
    when: (c) => (c.ind.polprisoners ?? 0) > 300 && c.demo < 5 && c.day > 100,
    choices: [
      { text: 'FULL AMNESTI', cost: { pp: 20 }, temp: { unrest: 3, stability: -2 }, rel: 8, griev: -12, ind: { demo: 0.4 }, tip: 'Poeten skriver en dikt om dig. Den är inte helt elak.' },
      { text: 'SLÄPP DE GAMLA OCH SJUKA', cost: { pp: 5 }, rel: 3, griev: -3, ind: { demo: 0.1 }, tip: 'Prästen går ut genom grinden och välsignar vakterna.' },
      { text: 'DET FINNS INGA POLITISKA FÅNGAR HÄR', temp: { statepower: 2 }, rel: -5, griev: 4, tip: 'Det tror ingen. Inte ens vakterna.' },
    ],
  },
  {
    id: 'dmk_brandvaggen', icon: '\u{1F9F1}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'UNGDOMARNA TAR SIG FÖRBI BRANDVÄGGEN',
    text: 'Fyra av tio ungdomar använder VPN-appar för att komma åt utländska sajter, enligt säkerhetstjänstens egen mätning. De ser på film, pluggar till utländska universitet och läser om sitt eget land i utländska tidningar. IT-företagen klagar på att de inte kan anställa programmerare som vill stanna.',
    when: (c) => c.is('internet', 'censored', 'shutdowns', 'firewall', 'intranet') && c.day > 60,
    choices: [
      { text: 'ÖPPNA NÄTET STEG FÖR STEG', cost: { pp: 20 }, law: ['internet', 'filtered'], temp: { unrest: 2 }, rel: 4, griev: -8, ind: { demo: 0.3, gdpgrowth: 0.3 }, tip: 'Programmerarna stannar. Och börjar skriva på bloggar.' },
      { text: 'LÅT DET VARA. DET ÄR EN VENTIL', temp: { unrest: -2, statepower: -2 }, ind: { happiness: 0.1 }, tip: 'En brandvägg med hål. Alla låtsas att den är hel.' },
      { text: 'FÖRBJUD VPN-APPARNA', temp: { statepower: 3, research: -2 }, griev: 6, ind: { demo: -0.2, happiness: -0.1 }, tip: 'Nya appar dyker upp på en vecka. Med bättre namn.' },
    ],
  },
  {
    id: 'dmk_investerarna_atervander', icon: '\u{1F4BC}', weight: 2, cooldown: 900,
    title: 'INVESTERARNA KOMMER TILLBAKA',
    text: 'Sedan reformerna inleddes har utländska företag börjat återvända till {rike}. Ett hotell i {huvudstad} är fullbokat av affärsresenärer och handelskammaren har öppnat sitt kontor igen. Det är små steg, men centralbanken rapporterar att valutareserven växer för första gången på fem år.',
    when: (c) => c.trend('demo') > 0.15 && c.demo < 6.5,
    choices: [
      { text: 'SAMMA REGLER FÖR ALLA FÖRETAG', cost: { pp: 10 }, perm: { corruption: -1 }, mod: 'foreign_investment', tip: 'Förutsägbarhet är det investerare vill ha. Mer än skattelättnader.' },
      { text: 'GE DE STÖRSTA SÄRSKILDA AVTAL', cost: { money: 150 }, temp: { gdp: 3 }, perm: { corruption: 2 }, tip: 'Snabba pengar nu. Gamla vanor tillbaka.' },
      { text: 'VÄLKOMNA DEM I ETT TAL', temp: { approval: 2, gdp: 1 }, rel: 2, tip: 'Ett tal kostar inget. Och hotellet säljer middagar.' },
    ],
  },
  {
    id: 'dmk_frihet_fore_institutioner', icon: '\u{1F3DA}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'FRIHETEN KOM FÖRE INSTITUTIONERNA',
    text: 'Reformerna har gett folk frihet, men ännu inte fungerande institutioner. Nya partier bildas varje vecka, brottsligheten i {stad} har ökat och de gamla korrupta tjänstemännen sitter kvar och tar betalt i nya former. Många äldre säger att det var lugnare förr. Det var det också.',
    when: (c) => c.trend('demo') > 0.25 && c.demo < 7 && c.st.safety < 10,
    choices: [
      { text: 'BYGG UPP POLIS OCH DOMSTOLAR PÅ RIKTIGT', cost: { money: 400 }, perm: { corruption: -2, safety: 2 }, ind: { demo: 0.2, policetrust: 3 }, tip: 'Frihet behöver ett skelett. Det här är skelettet.' },
      { text: 'TÅLAMOD. DEMOKRATI TAR TID', temp: { unrest: 3 }, perm: { stability: 1 }, tip: 'Det tog andra länder ett halvsekel. Ni har haft ett år.' },
      { text: 'STRAMA ÅT IGEN', temp: { safety: 4, statepower: 3 }, rel: -4, ind: { demo: -0.4 }, tip: 'Lugnare gator. Tystare människor.' },
    ],
  },
  {
    id: 'dmk_lugnet_bedrar', icon: '\u{1F636}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'LUGNET ÄR BEDRÄGLIGT',
    text: 'På ytan är landet lugnt: inga demonstrationer, inga strejker och statens tv visar glada skördefester. Men säkerhetstjänstens hemliga rapport talar om något annat. Var tredje ung med universitetsexamen har sökt jobb utomlands, folk säger en sak hemma och en annan på jobbet och ingen litar på någon.',
    when: (c) => c.demo < 4 && c.st.unrest < 5 && c.day > 300,
    choices: [
      { text: 'LÄTTA PÅ TRYCKET MED FLER FRI- OCH RÄTTIGHETER', cost: { pp: 20 }, temp: { statepower: -3, unrest: 2 }, rel: 3, griev: -8, ind: { demo: 0.3, trustgov: 3 }, tip: 'Lite oro på ytan. Mindre tryck under den.' },
      { text: 'STIPENDIER FÖR DEM SOM KOMMER HEM', cost: { money: 300 }, temp: { approval: 2 }, perm: { research: 2 }, tip: 'Några kommer hem. De tar med sig utländska idéer.' },
      { text: 'STÄNG GRÄNSEN FÖR UNGA MED EXAMEN', law: ['emigration', 'exitvisa'], temp: { research: -4 }, rel: -4, griev: 8, ind: { trustgov: -3, demo: -0.2 }, tip: 'De som inte kan lämna landet slutar inte vilja det.' },
    ],
  },

  // ===== LÅGT FÖRTROENDE =====
  {
    id: 'dmk_protestpartiet', icon: '\u{1F620}', weight: 2, cooldown: 1000,
    title: 'PROTESTPARTIET FICK 22 PROCENT',
    text: 'Ett parti som bildades för två år sedan och vars enda vallöfte var att "sparka ut alla" fick 22 procent i valet. Dess väljare säger i intervjuer att de inte tror på partiet heller, men att de ville att någon skulle lyssna. Förtroendet för regeringen är lägre än någonsin.',
    when: (c) => (c.ind.trustgov ?? 30) < 22 && c.demo > 4 && c.day > 100,
    choices: [
      { text: 'LYSSNA PÅ DERAS VÄLJARE. TURNÉ I HELA LANDET', cost: { pp: 15 }, temp: { approval: 3 }, perm: { stability: 1 }, ind: { trustgov: 3 }, tip: 'De flesta ville bara bli hörda. Det går att ordna.' },
      { text: 'SAMARBETA MED DEM I PARLAMENTET', cost: { pp: 10 }, temp: { polpower: 5, ideopower: -3 }, ind: { trustgov: 1, demo: -0.1 }, tip: 'Protestpartiet i regeringskorridorerna. Ingen vet riktigt vad som händer.' },
      { text: 'BYGG EN MUR AV ALLA ANDRA PARTIER', temp: { polpower: -2 }, ind: { trustgov: -2 }, tip: 'Vid nästa val får de 30 procent. Muren gör dem till martyrer.' },
    ],
  },
  {
    id: 'dmk_tv_stjarnan', icon: '\u{1F31F}', weight: 2, cooldown: 1000,
    title: 'TV-STJÄRNAN SOM VILL LEDA LANDET',
    text: 'Programledaren för landets populäraste frågesport har startat ett parti. Han har inget program, men fyra miljoner följare och en slogan: "Jag är inte politiker". I mätningarna har han redan gått om två gamla partier. Han säger att han ska "rensa ut korruptionen på hundra dagar".',
    when: (c) => (c.ind.trustparl ?? 30) < 22 && c.demo > 4.5 && c.day > 100,
    choices: [
      { text: 'GRANSKA HANS LÖFTEN PUNKT FÖR PUNKT', cost: { pp: 10 }, tip: 'Fakta mot underhållning. Det är aldrig en rättvis match.',
        risk: { chance: 0.5,
          win: { text: 'Granskningen visar att han inte vet vad en budget är. Stödet faller.', temp: { approval: 3 }, ind: { trustgov: 2 } },
          lose: { text: 'Granskningen ser ut som mobbning. Hans stöd ökar.', temp: { approval: -3, polpower: -3 } } } },
      { text: 'BE HONOM LEDA EN ANTIKORRUPTIONSKOMMISSION', cost: { pp: 15 }, temp: { approval: 4, polpower: -4 }, perm: { corruption: -1 }, tip: 'Han får hundra dagar. Och en budget han måste läsa.' },
      { text: 'IGNORERA HONOM', temp: { polpower: -2 }, ind: { trustgov: -1 }, tip: 'Han har sett ditt pressmeddelande. Han läste upp det i sitt program.' },
    ],
  },
  {
    id: 'dmk_valmaskinerna', icon: '\u{1F916}', weight: 2, cooldown: 1000,
    title: 'RYKTET OM VALMASKINERNA',
    text: 'En video som påstår att valmyndighetens röstmaskiner "är programmerade att byta röster" har setts sju miljoner gånger. Mannen i videon kallar sig expert men har aldrig sett en maskin. Valmyndighetens svar har en tiondel så många visningar. Var fjärde väljare säger att de inte tänker lita på valresultatet.',
    when: (c) => (c.ind.trustgov ?? 30) < 25 && (c.ind.internet ?? 60) > 50 && c.demo > 4 && c.day > 100,
    choices: [
      { text: 'ÖPPEN GRANSKNING. VEM SOM HELST FÅR TITTA', cost: { money: 150 }, ind: { trustgov: 3 }, next: ['dmk_valmaskiner_valdag', null], tip: 'Den som får se inuti maskinen slutar ofta vara rädd för den.' },
      { text: 'GÅ TILLBAKA TILL PAPPERSVALSEDLAR', cost: { money: 200 }, ind: { trustgov: 2, turnout: 1 }, tip: 'Papper, penna och en låda. Svårt att hacka.' },
      { text: 'STÄNG KONTONA SOM SPRIDER VIDEON', ind: { pressfree: -2, demo: -0.2 }, next: 'dmk_valmaskiner_valdag', tip: 'Videon får en ny titel: "De försöker tysta oss".' },
      { text: 'IGNORERA DET', ind: { trustgov: -2 }, next: ['dmk_valmaskiner_valdag', null], tip: 'Ett rykte som ingen bemöter blir en sanning för många.' },
    ],
  },
  {
    id: 'dmk_valmaskiner_valdag', icon: '\u{1F4F8}', chain: true,
    title: 'DE FILMAR VALFÖRRÄTTARNA',
    text: 'På valdagen står självutnämnda "valvakter" utanför vallokalerna i {stad} och filmar valförrättarna och väljarna. En pensionerad lärare som arbetat som valförrättare i trettio år har sagt upp sig efter att hennes adress publicerades. I tre lokaler har polisen fått ingripa.',
    choices: [
      { text: 'POLIS VID ALLA VALLOKALER', cost: { money: 100 }, temp: { safety: 2 }, ind: { trustgov: 1, turnout: -1 }, tip: 'Tryggare för valförrättarna. Lite obekvämt för väljarna.' },
      { text: 'BJUD IN DEM ATT SITTA MED NÄR RÖSTERNA RÄKNAS', cost: { pp: 10 }, tip: 'Den som räknar själv kan inte gärna klaga.',
        risk: { chance: 0.6,
          win: { text: 'De sitter med hela natten och hittar ingenting. Några ber om ursäkt.', ind: { trustgov: 4 } },
          lose: { text: 'De påstår att de såg fusk ändå. Nu finns en ny video.', temp: { unrest: 3 }, ind: { trustgov: -3 } } } },
      { text: 'LAG MOT TRAKASSERIER AV VALFÖRRÄTTARE', cost: { pp: 15 }, perm: { stability: 1 }, ind: { turnout: 1 }, tip: 'Den som räknar rösterna ska inte behöva vara modig.' },
      { text: 'VALFÖRRÄTTARNA FÅR KLARA SIG SJÄLVA', ind: { trustgov: -2, turnout: -1 }, tip: 'Till nästa val saknas fyratusen valförrättare.' },
    ],
  },
  {
    id: 'dmk_fortroende_rasar', icon: '\u{1F4C9}', weight: 2, cooldown: 900,
    title: 'FÖRTROENDET FÖR REGERINGEN RASAR',
    text: 'Förtroendet för regeringen har fallit snabbare det senaste året än under något år sedan mätningarna började. Folk säger att löftena inte hålls, att besluten fattas över deras huvuden och att ingen tar ansvar. Var tredje tror inte längre att det spelar någon roll vem som vinner valet.',
    when: (c) => c.trend('trustgov') < -2 && c.demo > 4,
    choices: [
      { text: 'ALLA BESLUTSUNDERLAG PÅ NÄTET', cost: { pp: 15 }, law: ['anti_corruption', 'opengov'], perm: { corruption: -1 }, ind: { trustgov: 4 }, tip: 'Öppenhet är långsam medicin. Men den verkar.' },
      { text: 'BYT UT HALVA REGERINGEN', cost: { pp: 20 }, temp: { approval: 4, polpower: -4 }, ind: { trustgov: 3 }, tip: 'Nya ansikten köper tid. Inte förtroende.' },
      { text: 'FÖRTROENDE KOMMER OCH GÅR', perm: { stability: -1 }, ind: { trustgov: -1 }, tip: 'Det kommer långsamt och går fort.' },
    ],
  },

  // ===== FRIHETSRÖRELSEN (kedja) =====
  {
    id: 'dmk_frihetsmarschen', icon: '\u{270A}', weight: 3, cooldown: 700, kind: 'frihet',
    title: 'TUSENTALS MARSCHERAR FÖR FRIHETEN',
    text: 'Missnöjet med inskränkningarna har kokat i månader. I dag gick 150 000 människor genom {huvudstad} med plakat om yttrandefrihet, fria val och oberoende domstolar. Tåget var fem kilometer långt. Arrangörerna är studenter, men i tåget gick också präster, sjuksköterskor och pensionerade domare.',
    when: (c) => c.grievOf('frihet') > 30 && c.day > 60,
    choices: [
      { text: 'BJUD IN ARRANGÖRERNA TILL SAMTAL', cost: { pp: 20 }, griev: -12, ind: { demo: 0.2, trustgov: 2 }, tip: 'Studenterna kommer med en lista. Den är kortare än du trodde.' },
      { text: 'LOVA REFORMER INOM HUNDRA DAGAR', cost: { pp: 10 }, temp: { unrest: -4 }, griev: -10, next: 'dmk_frihet_lofte', tip: 'Ett löfte med datum. Folk har kalendrar.' },
      { text: 'KRAVALLPOLIS OCH GRIPANDEN', temp: { unrest: -6, stability: 3 }, rel: -5, griev: 10, ind: { demo: -0.5, protests: -20 }, tip: 'Lugnt i dag. Dubbelt så många nästa gång.' },
    ],
  },
  {
    id: 'dmk_frihet_lofte', icon: '\u{23F0}', chain: true, kind: 'frihet',
    title: 'HUNDRA DAGAR HAR GÅTT',
    text: 'Det har gått hundra dagar sedan du lovade demonstranterna reformer. Studenterna har satt upp en stor klocka på torget i {huvudstad} som räknat ned timmarna. I dag visar den noll. Alla väntar på vad du ska säga i kvällens tal.',
    choices: [
      { text: 'HÅLL LÖFTET. NY LAG OM DEMONSTRATIONSRÄTTEN', cost: { pp: 25 }, law: ['protest', 'free'], rel: 5, griev: -20, ind: { demo: 0.6, pressfree: 4, trustgov: 5 }, tip: 'Klockan på torget får en ny skylt: "Löftet hölls".' },
      { text: 'BE OM MER TID', temp: { unrest: 3 }, griev: 6, ind: { trustgov: -3 }, tip: 'Studenterna ställer om klockan. Trettio dagar till.' },
      { text: 'BRYT LÖFTET', temp: { unrest: 8 }, griev: 15, ind: { trustgov: -8, demo: -0.3 }, tip: 'Klockan på torget börjar räkna igen. Nu räknar den något annat.' },
    ],
  },
  {
    id: 'dmk_generalstrejk', icon: '\u{1F6D1}', weight: 3, cooldown: 900, kind: 'frihet',
    title: 'GENERALSTREJK FÖR DEMOKRATIN',
    text: 'Fackföreningarna har gått samman med studenterna och utlyst generalstrejk tills "demokratin är återställd". Hamnarna står stilla, bussarna går inte och kraftverken kör med nödbemanning. Varje strejkdag kostar landet en procent av månadens produktion. Arbetsgivarna ber regeringen göra något, vad som helst.',
    when: (c) => c.grievOf('frihet') > 35 && c.st.unrest > 10 && c.day > 100,
    choices: [
      { text: 'RUNDABORDSSAMTAL MED FACKEN OCH OPPOSITIONEN', cost: { pp: 30 }, temp: { polpower: -6 }, griev: -20, ind: { demo: 0.4, strikes: -40, trustgov: 3 }, tip: 'Ett runt bord har ingen kortsida. Det är poängen.' },
      { text: 'MILITÄR TILL HAMNARNA OCH KRAFTVERKEN', temp: { stability: 4, unrest: -4, freedom: -5 }, rel: -6, griev: 12, ind: { demo: -0.6, strikes: -30 }, tip: 'Soldater kan köra en kran. De kan inte få folk att vilja jobba.' },
      { text: 'VÄNTA UT DEM', temp: { gdp: -4 }, mod: 'general_strike', griev: 4, tip: 'Strejkkassor tar slut. Det gör tålamodet också.' },
    ],
  },

  // ===== DEMOKRATIN LÖNAR SIG =====
  {
    id: 'dmk_demokrati_lonar', icon: '\u{1F3DB}\u{FE0F}', weight: 2, cooldown: 1500,
    title: 'TRETTIO ÅR AV FREDLIGA MAKTSKIFTEN',
    text: 'I år är det trettio år sedan {rike} hade ett omstritt val. Sedan dess har makten bytt händer sju gånger utan att någon behövt gå ut på gatan. Ett internationellt kreditinstitut nämner "institutionell stabilitet" som huvudskälet till landets låga räntor. Historikerna kallar det tråkigt. Ekonomerna kallar det guld.',
    when: (c) => c.demo > 8 && c.st.stability > 5 && c.day > 900,
    choices: [
      { text: 'FIRA MED EN DAG FÖR DEMOKRATIN', cost: { money: 100 }, temp: { approval: 3 }, ind: { turnout: 1, trustgov: 2 }, tip: 'Tårta i parlamentet. Valförrättarna får hedersmedaljer.' },
      { text: 'STÖD DEMOKRATIRÖRELSER I ANDRA LÄNDER', cost: { money: 200 }, temp: { ideopower: 2 }, rel: 8, tip: 'Det som fungerat här kan fungera på andra ställen.' },
      { text: 'FORTSÄTT VARA TRÅKIGA', perm: { stability: 1 }, mod: 'foreign_investment', tip: 'Tråkigt är en underskattad exportvara.' },
    ],
  },
  {
    id: 'dmk_medborgarrad', icon: '\u{1F91D}', weight: 2, cooldown: 1200,
    title: 'MEDBORGARRÅDET LÖSTE KNUTEN',
    text: 'Parlamentet hade bråkat i tio år om var det nya slutförvaret för kärnavfall skulle ligga. Till slut fick 150 slumpvis utvalda medborgare, bland dem en bonde, en tandläkare och en busschaufför, sitta ned under sex helger. De kom fram till ett förslag som 70 procent av befolkningen ställer sig bakom.',
    when: (c) => c.demo > 6.5 && c.st.stability > 0 && c.grievOf('frihet') < 25 && c.day > 300,
    choices: [
      { text: 'GENOMFÖR FÖRSLAGET SOM DET ÄR', cost: { pp: 10 }, temp: { approval: 3 }, perm: { stability: 1 }, ind: { trustgov: 4 }, tip: 'Tio års bråk löst av 150 vanliga människor och mycket kaffe.' },
      { text: 'GÖR MEDBORGARRÅD TILL EN FAST DEL AV POLITIKEN', cost: { money: 150 }, ind: { demo: 0.2, trustgov: 3, turnout: 1 }, tip: 'Nästa svåra fråga får också ett råd. Partierna är lite nervösa.' },
      { text: 'TACKA DEM OCH LÅT EXPERTERNA FINJUSTERA', temp: { polpower: 2 }, ind: { trustgov: -1 }, tip: 'Finjusteringen tar bort det viktigaste. Medborgarna märker det.' },
    ],
  },
];
