// IMPERIUM V5.22 STOLTHETEN — händelser om flaggan, passet, ambassaderna, helgdagarna, monumenten och ordnarna (prefix idn_).
// Carl 2026-11-22: «utöka spelets realism kraftigt … grejer man kan göra med flaggan, passet alltså symboler och allt möjligt».
// Händelserna graderas på c.idn (se identity.js och tools/check-events.mjs): stoltheten (pride, prideD), flaggan
// (flagCustom, flagScore, flagYears, attach, recog, flagLaw, occFlag, referendum, halfmast, tragedy), sången (anthemRule),
// passet (passSec, passFee, golden, goldenSold, exitVisa, dissidentPass, visaFree, passRank, waivers, bans),
// ambassaderna (embassies, embassiesD), helgdagarna (holidays, holidaysD, holidayCut), monumenten (monuments,
// hasMonument(id), building, cult), ordnarna (orders, awards, soldHonours, prestige), sedlarna (notes), frimärkena
// (stampDays) och krigen (wins, losses).
// Platshållare: {flagga} (står alltid först i meningen), {monument} (kräver c.idn.monuments), {orden} (kräver
// c.idn.orders), {ambassadland} (kräver c.idn.embassies), {sang} och {valuta}.
// Valen kan ha idn: { pride, recog, attach, prestige, topple, tragedy, golden: 'off', flagLaw, anthemRule,
// exitVisa: false, dissidentPass: false }.
// Avsnitten:
//   flaggan        flaggbränning och flagglagen (Texas v. Johnson 1989, tyska §90a), flaggan upp och ner, den nya
//                  flaggan som hånas eller älskas, vexillologerna, folkomröstningen (Nya Zeeland 2015-16), flaggans
//                  dag, flaggan i erövrade länder, flaggförsäljningen, kännedomen, förväxlingen, jätteflaggstången,
//                  halv stång, flaggan som saknas på mobilen
//   sången         knäfallet, laget som inte sjunger, stå upp på bion (Indien 2016-18), skolorna, texten,
//                  arvingarna, fel sång på matchen, en ny sång, popversionen, barnkören
//   passet         förfalskarna, handskrivna pass, chipet som knäcks, fingeravtrycken, köerna, avgiften, gyllene
//                  pass (Cypern 2020, Malta, Vanuatu 2022), utresevisum, indragna pass, dubbelt medborgarskap,
//                  passindex, visumfrihet och turism, inreseförbud och vedergällning, ömsesidighet, passets färg
//   ambassaderna   belägringen, ambassadörens miss, spionen, gästen som stannade i sju år (London 2012-19),
//                  gisslan (Lima 1996), konsulär hjälp efter en katastrof (2004), nedläggningar, nyöppning,
//                  parkeringsböterna, mottagningen, hemkallelsen
//   helgdagarna    Store Bededag (Danmark 2023), nya helgdagar, klämdagar, minoriteternas högtider, paraden,
//                  segerdagen, ledarens födelsedag
//   monumenten     statyn som rivs, kostnaderna, arkitekten, klottret, turisterna, världsarvet, den okände
//                  soldaten, selfies på minnesmärket, statyn som får blank näsa, gåvostatyn, förflyttningen
//   ordnarna       ordnar mot pengar (Storbritannien 2006), den som tackar nej, ordern som dras in, den utländske
//                  ledaren, ordnar som godis, hjältarna, stölden, veteranerna
//   sedlar, frimärken  falska sedlar, ledarens porträtt, designtävlingen, kontantlöst, hjälten med ett mörkt
//                  förflutet, ny monark, feltrycket (Inverted Jenny 1918), samlarna, auktionen, posten
//   stoltheten     chauvinism, stoltheten som rasar, idrottsframgången, utlandsmedborgarna, integrationen,
//                  ungdomarna, mätningen, flaggreklamen, efter ett förlorat och ett vunnet krig
// Grundtanken: symboler betyder något för folk. Att tvinga fram dem kostar frihet och omvärldens respekt, att
// slarva med dem kostar stolthet, och att sälja dem kostar förtroende. Chockerna i stoltheten är små (±2-6).
// Familjevänligt: ingen beskrivs skadad; den som grips förs till förhör och släpps.
export const EVENTS = [

  // ===== FLAGGAN: BRÄNNING OCH FLAGGLAGEN =====
  {
    id: 'idn_flagga_brann_fri', icon: '\u{1F525}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'FLAGGAN BRANN PÅ TORGET',
    text: 'Under en demonstration mot regeringen i {stad} satte en grupp ungdomar eld på flaggan framför stadshuset. Bilderna sprids över hela landet. Lagen är tydlig: att bränna en flagga är en åsikt, inte ett brott, precis som USA:s högsta domstol slog fast 1989. Men veteranförbundet kräver en ny lag, och flera ministrar håller med.',
    when: (c) => c.idn.flagLaw === 'free' && c.st.unrest > 5 && c.day > 60,
    choices: [
      { text: 'FÖRSVARA YTTRANDEFRIHETEN', temp: { freedom: 1, approval: -1 }, idn: { pride: -1 }, griev: -2, tip: 'Den som bränner flaggan har rätt till sin åsikt. Den som blir arg har rätt till sin.' },
      { text: 'INFÖR BÖTER FÖR ATT SKÄNDA FLAGGAN', cost: { pp: 10 }, idn: { flagLaw: 'protected', pride: 2 }, temp: { freedom: -1 }, griev: 4, tip: 'Som i Tyskland: böter, inte fängelse. Ungdomarna gör nya plakat i stället.' },
      { text: 'DELA UT NYA FLAGGOR PÅ TORGET', cost: { money: 40 }, idn: { pride: 2, attach: 0.05 }, temp: { approval: 1 }, tip: 'Nästa morgon vajar tvåhundra flaggor där en brann. Det blir en bättre bild.' },
    ],
  },
  {
    id: 'idn_flagga_boter', icon: '\u{1F6A9}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'BÖTER FÖR EN FLAGGA',
    text: 'En konstnär i {stad} har gjort en tavla där flaggan är sydd av gamla plastpåsar. Polisen har gett henne böter enligt lagen om att skända statens symboler, ungefär som den tyska paragraf 90a. Konstvärlden protesterar, utställningen får rekordmånga besökare och en domstol ska nu avgöra var gränsen mellan konst och skändning går.',
    when: (c) => c.idn.flagLaw === 'protected' && c.st.freedom > -20 && c.day > 60,
    choices: [
      { text: 'LÅT DOMSTOLEN AVGÖRA', temp: { stability: 1 }, ind: { trustgov: 1 }, tip: 'Domstolen friar henne. Konst är konst, även när den är gjord av plastpåsar.' },
      { text: 'AVSKAFFA FLAGGLAGEN', cost: { pp: 8 }, idn: { flagLaw: 'free', pride: -1 }, temp: { freedom: 2 }, griev: -3, tip: 'Flaggan tål en plastpåse. Det gör landet också.' },
      { text: 'SKÄRP LAGEN TILL FÄNGELSE', cost: { pp: 14 }, idn: { flagLaw: 'sacred', pride: 2 }, temp: { freedom: -3, statepower: 2 }, rel: -2, griev: 6, tip: 'Konstnärer runt om i världen gör plastpåseflaggor i solidaritet.' },
    ],
  },
  {
    id: 'idn_flagga_studenten', icon: '\u{26D3}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'STUDENTEN SOM BRÄNDE FLAGGAN',
    text: 'En 19-årig student i {stad} har dömts till sex månaders fängelse för att ha bränt en flagga på sitt eget studentrum och lagt upp en film på nätet. Lagen säger att flaggan är helig. Utländska regeringar och människorättsgrupper kräver att hon släpps, och hennes mamma har börjat sitta utanför fängelset varje morgon.',
    when: (c) => c.idn.flagLaw === 'sacred' && c.day > 60,
    choices: [
      { text: 'BENÅDA HENNE OCH MILDRA LAGEN', cost: { pp: 10 }, idn: { flagLaw: 'protected' }, temp: { freedom: 2 }, rel: 2, griev: -4, tip: 'Böter i stället för fängelse. Hon får gå hem till mamma.' },
      { text: 'LAGEN ÄR LAGEN', temp: { statepower: 2 }, idn: { pride: 1 }, rel: -3, griev: 5, ind: { pressfree: -2 }, next: 'idn_flagga_studenten_symbol', tip: 'Ett straff som ska avskräcka. Det brukar fungera precis tvärtom.' },
      { text: 'BENÅDA HENNE I TYSTHET', cost: { pp: 4 }, temp: { stability: 1 }, rel: 1, griev: -2, tip: 'Hon släpps en tisdag utan pressmeddelande. Lagen står kvar.' },
    ],
  },
  {
    id: 'idn_flagga_studenten_symbol', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'STUDENTEN HAR BLIVIT EN SYMBOL',
    text: 'Studentens ansikte finns nu på t-tröjor i tjugo länder. En känd musiker har skrivit en sång om henne, och vid en idrottsgala utomlands höll publiken upp brända pappersflaggor. Inne i landet säger allt fler att lagen gjort mer skada på flaggan än studenten någonsin kunde.',
    choices: [
      { text: 'SLÄPP HENNE OCH AVSKAFFA FÄNGELSESTRAFFET', cost: { pp: 12 }, idn: { flagLaw: 'protected', recog: 2 }, temp: { freedom: 2, approval: 1 }, rel: 3, griev: -6, tip: 'Hon kommer ut till kameror från hela världen. Hon tackar sin mamma.' },
      { text: 'HÅLL FAST VID STRAFFET', temp: { statepower: 1, unrest: 2 }, rel: -4, mod: 'martyr', griev: 6, tip: 'Martyrer blir starkare för varje dag de sitter inne.' },
      { text: 'BYT HENNE MOT EN DIPLOMATISK TJÄNST', cost: { pp: 6 }, rel: 2, temp: { stability: -1 }, tip: 'Hon släpps om hon lämnar landet. Hon gör det, och talar sedan i alla kanaler.' },
    ],
  },

  // ===== FLAGGAN: MISSAR OCH KÄNNEDOM =====
  {
    id: 'idn_flagga_upp_och_ner', icon: '\u{1F643}', weight: 2, cooldown: 1000,
    title: 'FLAGGAN HÄNGDE UPP OCH NER',
    text: 'Vid toppmötet i grannlandet {granne} hängde arrangörerna din flagga upp och ner bakom talarstolen. Ingen märkte det förrän en tioåring skrev om det på nätet. Bilden av din ledare framför den vända flaggan är nu världens mest delade. Värdlandet ber om ursäkt, men oppositionen hemma undrar varför din egen delegation inte sa något.',
    when: (c) => c.idn.recog < 40 && c.allies >= 1 && c.day > 30,
    choices: [
      { text: 'SKRATTA ÅT DET', temp: { approval: 1 }, idn: { recog: 2 }, tip: 'Ledaren lägger upp en bild där hon står på händer. Alla skrattar med.' },
      { text: 'KRÄV EN FORMELL URSÄKT', cost: { pp: 4 }, idn: { pride: 1 }, rel: -1, tip: 'Ursäkten kommer på fyra språk. Ingen minns den om en vecka.' },
      { text: 'SKICKA FLAGGMANUALER TILL ALLA AMBASSADER', cost: { money: 30 }, idn: { recog: 3 }, tip: 'Med en pil som visar vad som är upp. Den används flitigt.' },
    ],
  },
  {
    id: 'idn_flagga_fel_farg', icon: '\u{1F3ED}', weight: 2, cooldown: 1000,
    title: 'TIOTUSEN FLAGGOR I FEL FÄRG',
    text: 'Inför nationaldagen beställde staten tiotusen exemplar av den nya flaggan från en fabrik utomlands. När lådorna öppnades i {huvudstad} var färgerna fel: det som skulle vara mörkt var ljust och tvärtom. Det är nio dagar kvar till firandet, och leverantören säger att det var din egen fil som var fel.',
    when: (c) => c.idn.flagCustom && c.idn.flagYears < 3,
    choices: [
      { text: 'BESTÄLL OM MED EXPRESSFRAKT', cost: { money: 60 }, idn: { pride: 1 }, tip: 'Flaggorna kommer i tid, med flyg. Firandet blir som det var tänkt.' },
      { text: 'ANVÄND DE FELTRYCKTA', temp: { approval: -1 }, idn: { attach: -0.05 }, tip: 'Halva landet viftar med fel flagga. Det blir en egen tradition.' },
      { text: 'LÅT SKOLBARNEN MÅLA FLAGGOR', cost: { money: 10 }, idn: { pride: 2, attach: 0.05 }, temp: { qol: 1 }, tip: 'Ingen flagga är lik den andra. Alla är rätt.' },
    ],
  },
  {
    id: 'idn_flagga_ny_hanad', icon: '\u{1F602}', weight: 2, cooldown: 900,
    title: 'HELA NÄTET SKRATTAR ÅT FLAGGAN',
    text: 'Den nya flaggan har blivit ett skämt. Folk säger att den ser ut som en handduk, en kaka eller ett felaktigt testmönster på tv. En komiker har sålt hundratusen tröjor med texten «Jag röstade inte på den här». {flagga} vajar fortfarande över regeringshuset, men allt fler hissar den gamla på balkongerna.',
    when: (c) => c.idn.flagCustom && c.idn.flagScore < 50 && c.idn.flagYears < 6,
    choices: [
      { text: 'STÅ KVAR VID DEN NYA FLAGGAN', temp: { approval: -2 }, idn: { pride: -2 }, tip: 'Folk vänjer sig. Det tar bara en generation eller två.' },
      { text: 'UTLYS EN TÄVLING OM EN BÄTTRE', cost: { pp: 6, money: 30 }, idn: { pride: 1 }, temp: { approval: 1 }, tip: 'Rita en ny flagga i fliken LANDET. Den här gången frågar du folket först.' },
      { text: 'SKÄMTA OM DET SJÄLV', temp: { approval: 1 }, idn: { attach: 0.05 }, tip: 'Ledaren bär komikerns tröja i en intervju. Det hjälper faktiskt.' },
    ],
  },
  {
    id: 'idn_flagga_ny_alskad', icon: '\u{2764}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'FOLKET HAR TAGIT FLAGGAN TILL SIG',
    text: 'Det gick fortare än någon trodde. Den nya flaggan syns på cyklar, kaffekoppar och nyfödda barns mössor. Barn i {stad} ritar den utan att titta, och en butik har sålt slut på flaggor tre gånger på en månad. {flagga} har blivit landets mest omtyckta symbol enligt en ny mätning.',
    when: (c) => c.idn.flagCustom && c.idn.flagScore >= 75 && c.idn.flagYears < 6,
    choices: [
      { text: 'GÖR EN DAG TILL FLAGGANS DAG', cost: { pp: 4 }, idn: { pride: 2, attach: 0.08 }, temp: { approval: 1 }, tip: 'En flaggdag läggs till i helgdagarna i fliken LANDET.' },
      { text: 'LÅT FLAGGAN VARA FOLKETS', idn: { attach: 0.05 }, temp: { stability: 1 }, tip: 'Ingen kampanj, inga affischer. Det är det som gör den äkta.' },
      { text: 'SÄLJ FLAGGAN SOM VARUMÄRKE UTOMLANDS', res: { money: 40 }, idn: { recog: 3 }, tip: 'Flaggan finns på sneakers i fyra världsdelar. Lite mindre äkta, lite mer känd.' },
    ],
  },
  {
    id: 'idn_flagga_vexillologer', icon: '\u{1F4D0}', weight: 2, cooldown: 1000,
    title: 'EXPERTERNA SÅGAR FLAGGAN',
    text: 'Den internationella föreningen för flaggforskare har rankat världens flaggor, och din nya flagga hamnar bland de tio sämsta. «För många detaljer, för många färger, och den går inte att rita ur minnet», skriver de. Reglerna är fem: håll den enkel, ge den mening, två eller tre färger, inga sigill och sticka ut. Tidningarna har redan rubrikerna klara.',
    when: (c) => c.idn.flagCustom && c.idn.flagScore < 45,
    choices: [
      { text: 'BJUD IN EXPERTERNA ATT RITA OM DEN', cost: { pp: 4, money: 20 }, idn: { recog: 1 }, tip: 'De kommer med ritningar. Gör om flaggan i fliken LANDET om du vill.' },
      { text: 'VAD VET UTLÄNNINGAR OM VÅR FLAGGA', idn: { pride: 1 }, temp: { approval: -1 }, rel: -1, tip: 'Den som bor här tycker om den. Det är vad som räknas, säger du.' },
      { text: 'ERKÄNN ATT DEN BLEV PLOTTRIG', temp: { approval: -1 }, idn: { attach: -0.05 }, ind: { trustgov: 1 }, tip: 'Ärlighet uppskattas. Flaggan blir inte vackrare av det.' },
    ],
  },
  {
    id: 'idn_flagga_vexillologer_bast', icon: '\u{1F3C6}', weight: 2, cooldown: 1000,
    title: 'VÄRLDENS BÄSTA FLAGGA',
    text: 'Flaggforskarnas stora rankning är klar, och din nya flagga hamnar i toppen. «Enkel, meningsfull och omöjlig att förväxla», skriver juryn. En formgivare i {huvudstad} som var med och tog fram den intervjuas i tjugo länder, och turistbyrån märker redan att fler söker på landets namn.',
    when: (c) => c.idn.flagCustom && c.idn.flagScore >= 85,
    choices: [
      { text: 'FIRA MED FOLKET', cost: { money: 30 }, idn: { pride: 3, recog: 3 }, temp: { approval: 2 }, tip: 'Stora flaggor på varje torg. Den här gången kan alla rita den.' },
      { text: 'HEDRA FORMGIVAREN', idn: { pride: 2 }, temp: { qol: 1 }, tip: 'Formgivaren får sitt porträtt på ett frimärke. Han ritar det själv.' },
      { text: 'ANVÄND FLAGGAN I TURISTREKLAMEN', cost: { money: 50 }, idn: { recog: 4 }, ind: { tourists: 6 }, tip: 'Flaggan blir landets ansikte utåt. Den gör det bra.' },
    ],
  },
  {
    id: 'idn_flagga_nostalgi', icon: '\u{1F570}\u{FE0F}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'DE SAKNAR DEN GAMLA FLAGGAN',
    text: 'I fotbollsklacken, på bröllop och vid begravningar dyker den gamla flaggan upp igen. Äldre människor säger att den nya inte känns som deras, och en förening som vill ha tillbaka den gamla har samlat fyrahundratusen namn. Vid nationaldagens firande i {stad} var det fler gamla flaggor än nya.',
    when: (c) => c.idn.flagCustom && c.idn.attach < 0.35 && c.idn.flagYears < 10,
    choices: [
      { text: 'TILLÅT DEN GAMLA FLAGGAN VID SIDAN AV', temp: { approval: 2 }, idn: { pride: 1, attach: -0.05 }, griev: -3, tip: 'Två flaggor, som när Sydafrika bytte. Folk får välja.' },
      { text: 'HÅLL FAST VID DEN NYA', idn: { attach: 0.05 }, temp: { approval: -2 }, griev: 3, tip: 'Det tar tid. Den gamla flaggan var ny en gång den också.' },
      { text: 'LOVA EN FOLKOMRÖSTNING', cost: { pp: 6 }, temp: { approval: 2, stability: 1 }, griev: -4, tip: 'Starta den i fliken LANDET. Folket bestämmer, som i Nya Zeeland.' },
    ],
  },
  {
    id: 'idn_flagga_folkomrostning', icon: '\u{1F5F3}\u{FE0F}', weight: 3, cooldown: 400,
    title: 'STRIDEN OM FLAGGAN',
    text: 'Folkomröstningen om flaggan närmar sig, och landet är delat. Ja-sidan har kändisar och formgivare, nej-sidan har veteraner och mormödrar. Mätningarna visar dött lopp. I Nya Zeeland 2016 vann nej-sidan med 57 procent trots att regeringen ville byta, och oppositionen påminner om det varje dag.',
    when: (c) => c.idn.referendum,
    choices: [
      { text: 'KAMPANJA FÖR DEN NYA FLAGGAN', cost: { money: 80, pp: 4 }, temp: { approval: -1 }, idn: { attach: -0.1 }, tip: 'Affischer i varje stad. Det lockar fler ja-röster, och några arga.' },
      { text: 'HÅLL REGERINGEN NEUTRAL', temp: { stability: 1 }, ind: { trustgov: 1 }, tip: 'Folket avgör. Hur det än går är beslutet deras.' },
      { text: 'ORDNA EN TV-DEBATT', cost: { money: 20 }, ind: { turnout: 4 }, tip: 'Fler röstar. Debatten handlar mest om vad flaggor egentligen betyder.' },
    ],
  },
  {
    id: 'idn_flagga_laserkiwi', icon: '\u{1F95D}', weight: 2, cooldown: 600,
    title: 'SKÄMTFLAGGAN LEDER',
    text: 'Inför folkomröstningen fick folket skicka in egna förslag, och tiotusen kom in. Det mest populära är en flagga med en arg uggla som skjuter laser ur ögonen. I Nya Zeeland 2015 hände nästan samma sak med en kiwifågel. Juryn vill stryka den, men nätet kräver att den kommer med på röstsedeln.',
    when: (c) => c.idn.referendum,
    choices: [
      { text: 'STRYK SKÄMTFLAGGAN', temp: { approval: -1 }, tip: 'Juryn är nöjd. Nätet gör en egen röstsedel.' },
      { text: 'LÅT DEN KOMMA MED', temp: { approval: 2, qol: 1 }, idn: { recog: 2 }, ind: { turnout: 3 }, tip: 'Den får fyra procent. Folk pratar om omröstningen i hela världen.' },
      { text: 'GÖR UGGLAN TILL MASKOT I STÄLLET', cost: { money: 15 }, temp: { approval: 1 }, idn: { pride: 1 }, tip: 'Den arga ugglan blir landslagets maskot. Alla är nöjda.' },
    ],
  },
  {
    id: 'idn_flaggans_dag', icon: '\u{1F6A9}', weight: 2, cooldown: 600,
    title: 'FLAGGANS DAG',
    text: 'I dag är det flaggans dag, och i {huvudstad} samlas tusentals människor på stadion. Skolbarn har övat på att vika flaggan, veteraner har putsat sina medaljer och en kör ska sjunga {sang}. Arrangörerna frågar hur stort regeringen vill att firandet ska bli i år.',
    when: (c) => c.idn.attach > 0.6 && c.idn.pride > 40,
    choices: [
      { text: 'STORT FIRANDE MED FYRVERKERIER', cost: { money: 60 }, idn: { pride: 3, attach: 0.03 }, temp: { approval: 2 }, tip: 'Hela himlen i flaggans färger. Hundarna gömmer sig under sängarna.' },
      { text: 'EN ENKEL CEREMONI', idn: { pride: 1 }, temp: { stability: 1 }, tip: 'Flaggan hissas, kören sjunger, alla går hem och fikar.' },
      { text: 'GE VARJE NYBLIVEN MEDBORGARE EN FLAGGA', cost: { money: 20 }, idn: { pride: 1 }, temp: { integration: 2 }, tip: 'De nya medborgarna får sin flagga i handen. Många av dem gråter.' },
    ],
  },
  {
    id: 'idn_flagga_ockuperad_egen', icon: '\u{1FA96}', weight: 2, cooldown: 800, kind: 'forsvar',
    title: 'MOTSTÅND MOT FLAGGAN',
    text: 'I de erövrade länderna vajar din flagga på varje stadshus. Varje morgon är flera av dem nedrivna, och i natt byttes flaggan på en skola i {land} mot den gamla nationella. Förvaltningen rapporterar att lärare, präster och fotbollsklubbar vägrar hissa din flagga, och motståndet har fått en symbol.',
    when: (c) => c.idn.occFlag === 'own' && c.idn.wins >= 1,
    choices: [
      { text: 'LÅT DEM HISSA BÅDA FLAGGORNA', cost: { pp: 4 }, temp: { unrest: -3 }, idn: { pride: -1 }, tip: 'Byt till BÅDA FLAGGORNA i fliken LANDET. Oron lägger sig.' },
      { text: 'SKICKA FLER SOLDATER TILL STADSHUSEN', cost: { man: 4 }, temp: { statepower: 2, unrest: 2 }, rel: -2, tip: 'Flaggorna sitter kvar. Folket ser soldaterna varje dag.' },
      { text: 'STRUNTA I DET', temp: { unrest: 1 }, tip: 'Flaggor är bara tyg, säger generalen. Det är inte vad folket i {land} tycker.' },
    ],
  },
  {
    id: 'idn_flagga_ockuperad_lokal', icon: '\u{1F3F3}\u{FE0F}', weight: 2, cooldown: 800,
    title: 'DE FICK BEHÅLLA SIN FLAGGA',
    text: 'I de erövrade länderna vajar folkets egna flaggor kvar, och borgmästarna tackar för att deras symboler respekteras. Lugnet har kommit fortare än väntat. Men hemma är nationalisterna arga: «Vi vann kriget och nu syns inte ens vår flagga?» En general kräver att din flagga hissas överallt i {land}.',
    when: (c) => c.idn.occFlag === 'local' && c.idn.wins >= 1,
    choices: [
      { text: 'BEHÅLL FREDEN, BEHÅLL DERAS FLAGGOR', temp: { stability: 1, approval: -1 }, rel: 1, tip: 'Det går långsammare att göra dem till en del av riket. Men det går lugnt.' },
      { text: 'HISSA DIN FLAGGA BREDVID', cost: { pp: 4 }, idn: { pride: 1 }, temp: { unrest: 1 }, tip: 'Byt till BÅDA FLAGGORNA i fliken LANDET. Generalen är nöjd. Nästan.' },
      { text: 'HÅLL ETT TAL OM RESPEKT', temp: { approval: 1 }, idn: { recog: 1 }, tip: 'Talet citeras i utländska tidningar som ett exempel på klokskap.' },
    ],
  },
  {
    id: 'idn_flagga_ockuperad_bada', icon: '\u{1F91D}', weight: 2, cooldown: 900,
    title: 'TVÅ FLAGGOR PÅ SAMMA STÅNG',
    text: 'En borgmästare i {land} har hissat sin stads flagga en decimeter högre än din. Förvaltningen vill ge honom en varning, borgmästaren säger att stången böjde sig av vinden, och lokaltidningen har mätt flaggstången med tumstock. Frågan om vilken flagga som ska sitta högst har nått din skrivbordslåda.',
    when: (c) => c.idn.occFlag === 'both' && c.idn.wins >= 1,
    choices: [
      { text: 'LÅT DECIMETERN VARA', temp: { unrest: -2 }, tip: 'Borgmästaren blir en lokal hjälte för en decimeter. Det kostar inget.' },
      { text: 'KRÄV LIKA HÖJD PÅ MILLIMETERN', cost: { pp: 2 }, idn: { pride: 1 }, temp: { unrest: 1 }, tip: 'En inspektör med vattenpass åker runt i landet. Han får ett smeknamn.' },
      { text: 'BYT BORGMÄSTARE', cost: { pp: 6 }, temp: { statepower: 2, unrest: 3 }, tip: 'Den nya borgmästaren mäter noga. Folket mäter honom ännu noggrannare.' },
    ],
  },
  {
    id: 'idn_flagga_forsaljning', icon: '\u{1F6CD}\u{FE0F}', weight: 2, cooldown: 700,
    title: 'FLAGGORNA SÅLDA SLUT',
    text: 'Efter landslagets seger i kvällens stora final är varenda flagga i landet slutsåld. Fabriken i {stad} kör tre skift, och folk målar flaggan på bilar, hundar och kinder. Handlarna vill att staten tillfälligt tar bort tullen på importerade flaggor, och vissa butiker har höjt priset till det femdubbla.',
    when: (c) => c.idn.prideD > 3 && c.st.approval > 0,
    choices: [
      { text: 'TA BORT TULLEN PÅ FLAGGOR', temp: { approval: 1, income: -1 }, idn: { pride: 1 }, tip: 'Billigare flaggor. Alla vill ha en, nu kan alla få en.' },
      { text: 'STOPPA ÖVERPRISERNA', cost: { pp: 4 }, temp: { approval: 2 }, perm: { corruption: -1 }, tip: 'Konsumentverket ringer runt. Priset sjunker till det dubbla.' },
      { text: 'LÅT MARKNADEN STYRA', temp: { gdp: 1 }, tip: 'Fabriken i {stad} anställer femtio personer till. Glädjen räcker för alla.' },
    ],
  },
  {
    id: 'idn_flagga_kand', icon: '\u{1F30D}', weight: 2, cooldown: 1000,
    title: 'FLAGGAN SOM ALLA KÄNNER IGEN',
    text: 'I en ny undersökning bland skolbarn i tjugo länder känner nästan alla igen din flagga. Den syns på idrottsevenemang, i filmer och på klistermärken på resväskor. En reklambyrå säger att flaggan är värd miljarder i gratis marknadsföring för landets företag.',
    when: (c) => c.idn.recog > 75,
    choices: [
      { text: 'SATSA PÅ «MADE IN» MED FLAGGAN', cost: { money: 40 }, temp: { gdp: 1, factory: 1 }, idn: { pride: 1 }, tip: 'Flaggan på varje låda som går på export. Köparna litar på den.' },
      { text: 'SKYDDA FLAGGAN MOT FUSKVAROR', cost: { pp: 4 }, perm: { corruption: -1 }, tip: 'Den som sätter flaggan på billiga kopior får böter.' },
      { text: 'NJUT AV ÄRAN', idn: { pride: 2 }, tip: 'Folket blir lite stoltare när de ser flaggan utomlands.' },
    ],
  },
  {
    id: 'idn_flagga_forvaxlad', icon: '\u{1F500}', weight: 2, cooldown: 1000,
    title: 'FEL FLAGGA VID PRISUTDELNINGEN',
    text: 'När {rike} vann guld i ett stort mästerskap hissades fel flagga. Arrangörerna tog grannlandets, som har nästan samma färger. Det har hänt förr i världen: Tchad och Rumänien, Indonesien och Monaco. Guldmedaljören stod och tittade på fel flagga under hela sången, och bilden har setts av hundra miljoner.',
    when: (c) => !c.idn.flagCustom && c.idn.recog < 40 && c.day > 120,
    choices: [
      { text: 'KRÄV EN NY CEREMONI', cost: { pp: 4 }, idn: { pride: 2, recog: 2 }, tip: 'En ny prisutdelning med rätt flagga. Den här gången tittar alla.' },
      { text: 'SKRATTA OCH SKICKA FLAGGOR TILL ARRANGÖREN', cost: { money: 10 }, idn: { recog: 3 }, temp: { approval: 1 }, tip: 'Ett paket med hundra flaggor. Och en karta.' },
      { text: 'FUNDERA PÅ EN EGEN FLAGGA', idn: { attach: -0.05 }, tip: 'Rita en ny flagga i fliken LANDET. Den gamla har ju varit med länge.' },
    ],
  },
  {
    id: 'idn_flagga_jattestang', icon: '\u{1F4CF}', weight: 2, cooldown: 1200,
    title: 'VÄRLDENS HÖGSTA FLAGGSTÅNG',
    text: 'En byggherre vill resa världens högsta flaggstång i {huvudstad}, 175 meter hög med en flagga lika stor som en fotbollsplan. Andra länder har gjort samma sak, och rekordet slås ungefär vart femte år. Arkitekter varnar för att flaggan väger lika mycket som en buss och slits sönder av stormarna. Folket tycker att idén är fantastisk.',
    when: (c) => c.idn.pride > 55 && c.st.statepower > 5,
    choices: [
      { text: 'BYGG STÅNGEN', cost: { money: 150 }, idn: { pride: 3, recog: 2 }, temp: { approval: 2 }, next: 'idn_flagga_jattestang_storm', tip: 'Den syns från alla håll i staden. Även när det blåser.' },
      { text: 'EN VANLIG STÅNG I VARJE SKOLA I STÄLLET', cost: { money: 60 }, idn: { pride: 2, attach: 0.05 }, tip: 'Tiotusen små flaggor i stället för en jättelik.' },
      { text: 'NEJ TACK', temp: { approval: -1 }, tip: 'Rekordet får ett annat land ha.' },
    ],
  },
  {
    id: 'idn_flagga_jattestang_storm', icon: '\u{1F32C}\u{FE0F}', chain: true,
    title: 'STORMEN TOG JÄTTEFLAGGAN',
    text: 'Världens högsta flaggstång står kvar, men stormen i natt slet sönder flaggan. Bitar av tyg ligger över halva {huvudstad}, och barn samlar dem som souvenirer. En ny flagga kostar som tio vanliga lärarlöner per år, och den håller ungefär tre månader. Kommunen undrar vem som betalar.',
    choices: [
      { text: 'SY EN NY OCH STARKARE', cost: { money: 40 }, idn: { pride: 1 }, tip: 'Den nya är av segelduk och håller ett halvår. Kanske.' },
      { text: 'HISSA FLAGGAN BARA PÅ HELGDAGAR', temp: { approval: -1 }, tip: 'Stången står tom på vardagarna. Den ser lite ensam ut.' },
      { text: 'SÄLJ BITARNA TILL SAMLARE', res: { money: 20 }, idn: { attach: 0.03 }, tip: 'Varje bit kommer med ett intyg. De säljer slut på en dag.' },
    ],
  },
  {
    id: 'idn_halvstang_forfattaren', icon: '\u{1F56F}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'NATIONENS BERÄTTARE ÄR BORTA',
    text: 'Landets mest älskade författare har somnat in, 97 år gammal. Hennes böcker om de två syskonen och deras häst har lästs av varje barn i {rike} i tre generationer. Folk lägger blommor och böcker utanför hennes hus i {stad}. Hennes förlag frågar om flaggorna ska gå på halv stång.',
    when: (c) => !c.idn.halfmast && c.idn.tragedy > 60 && c.st.qol > 5 && c.day > 120,
    choices: [
      { text: 'FLAGGORNA PÅ HALV STÅNG I HELA LANDET', idn: { tragedy: true, pride: 2 }, temp: { stability: 1 }, tip: 'Hela landet sörjer tillsammans. Det gör det lite lättare.' },
      { text: 'EN MINNESSTUND I SKOLORNA', cost: { money: 10 }, idn: { pride: 1 }, temp: { qol: 1 }, tip: 'Varje klass läser första kapitlet högt. Det blir tyst i hela landet.' },
      { text: 'ETT STIPENDIUM I HENNES NAMN', cost: { money: 40 }, perm: { hdi: 1 }, idn: { pride: 1 }, tip: 'Unga författare får skriva i ett år. Den första boken handlar om en häst.' },
    ],
  },
  {
    id: 'idn_halvstang_lange', icon: '\u{1F6A9}', weight: 2, cooldown: 600,
    title: 'HUR LÄNGE SKA FLAGGAN HÄNGA LÅGT',
    text: 'Flaggorna har hängt på halv stång i flera veckor. Sorgen är verklig, men handlare i {stad} säger att stämningen är tung, en idrottsklubb har skjutit upp sin säsongspremiär och barnen frågar varför flaggan är trasig. Protokollet säger inget om när sorgen ska ta slut.',
    when: (c) => c.idn.halfmast,
    choices: [
      { text: 'HISSA FLAGGORNA I TOPP MED EN CEREMONI', cost: { money: 15 }, idn: { pride: 2 }, temp: { stability: 1 }, tip: 'En minut av tystnad, sedan hissas flaggorna. Livet går vidare.' },
      { text: 'LÅT SORGEN TA DEN TID DEN TAR', temp: { approval: -1, qol: -1 }, tip: 'Flaggorna hänger lågt en vecka till.' },
      { text: 'SKRIV ETT PROTOKOLL FÖR FRAMTIDEN', cost: { pp: 2 }, temp: { stability: 1 }, tip: 'Från och med nu: halv stång i tre dagar, sedan topp. Alla vet.' },
    ],
  },
  {
    id: 'idn_flagga_emoji', icon: '\u{1F4F1}', weight: 1, cooldown: 1000,
    title: 'FLAGGAN SAKNAS I MOBILEN',
    text: 'Den nya flaggan finns inte bland flaggorna i telefonernas tangentbord. När folk vill skicka flaggan till varandra får de den gamla, och ungdomarna har börjat använda den gamla av ren vana. Konsortiet som bestämmer över alla bildtecken i världen säger att en ändring tar minst två år.',
    when: (c) => c.idn.flagCustom && c.idn.flagYears < 8,
    choices: [
      { text: 'SKICKA EN ANSÖKAN OCH VÄNTA', cost: { pp: 2 }, idn: { recog: 1 }, tip: 'Två år senare kommer den. Under tiden lever den gamla vidare i telefonerna.' },
      { text: 'GÖR EN EGEN FLAGGAPP', cost: { money: 15 }, idn: { attach: 0.05 }, tip: 'Appen laddas ner en miljon gånger. Den har också en dansande flagga.' },
      { text: 'STRUNTA I DET', idn: { attach: -0.03 }, tip: 'Folk skickar hjärtan i stället.' },
    ],
  },
  {
    id: 'idn_flagga_barnritning', icon: '\u{1F58D}\u{FE0F}', weight: 1, cooldown: 1000,
    title: 'BARNEN KAN INTE RITA FLAGGAN',
    text: 'En lärare i {stad} bad sin klass rita landets flagga. Inte ett enda barn klarade det: detaljerna var för många och färgerna för svåra. Bilden på teckningarna har spridits över landet. «En flagga ska ett barn kunna rita ur minnet», säger en flaggforskare i morgonsofforna.',
    when: (c) => c.idn.flagCustom && c.idn.flagScore >= 45 && c.idn.flagScore < 60,
    choices: [
      { text: 'FÖRENKLA FLAGGAN', cost: { pp: 4 }, idn: { attach: -0.05 }, tip: 'Rita om den i fliken LANDET: färre detaljer, samma själ.' },
      { text: 'FLAGGRITNING PÅ SCHEMAT', cost: { money: 10 }, idn: { attach: 0.05, pride: 1 }, tip: 'En timme i veckan. Barnen blir bra på detaljer.' },
      { text: 'HÄNG UPP BARNENS TECKNINGAR I RIKSDAGEN', temp: { approval: 1, qol: 1 }, tip: 'Det blir landets mest besökta utställning.' },
    ],
  },

  // ===== NATIONALSÅNGEN =====
  {
    id: 'idn_sang_knafall', icon: '\u{1F9CE}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'HAN KNÄFÖLL UNDER SÅNGEN',
    text: 'Landslagets stjärna gick ner på ett knä när {sang} spelades före kvällens match. Han säger att han protesterar mot orättvisor i landet, inte mot flaggan. Halva arenan buade, andra halvan applåderade. I morgon vill sportministern veta om förbundet ska straffa honom eller låta honom vara.',
    when: (c) => c.idn.anthemRule !== 'mandatory' && c.demo >= 5 && c.st.unrest > 0,
    choices: [
      { text: 'HAN HAR RÄTT ATT PROTESTERA', temp: { freedom: 1, approval: -1 }, idn: { pride: -1 }, griev: -3, tip: 'Det är vad friheten betyder, även när det känns obekvämt.' },
      { text: 'BJUD IN HONOM TILL ETT SAMTAL', cost: { pp: 2 }, temp: { approval: 1, stability: 1 }, griev: -2, tip: 'De pratar i två timmar. Han fortsätter knäfalla, men nu vet alla varför.' },
      { text: 'KRÄV ATT FÖRBUNDET STÄNGER AV HONOM', cost: { pp: 6 }, idn: { pride: 1 }, temp: { freedom: -2, unrest: 2 }, griev: 5, tip: 'Han blir avstängd. Nästa match knäfaller hela laget.' },
    ],
  },
  {
    id: 'idn_sang_tyst_lag', icon: '\u{1F910}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'LAGET SOM INTE SJÖNG',
    text: 'Vid världsmästerskapet stod hela landslaget tyst när {sang} spelades. Det var en protest mot regeringen, säger spelarna inte rakt ut, men alla förstod. Bilden har gått jorden runt. Hemma har tusentals människor gått ut på gatorna för att visa sitt stöd för laget, och några har sjungit sången baklänges.',
    when: (c) => c.st.freedom < 0 && c.st.unrest > 10 && c.day > 90,
    choices: [
      { text: 'LYSSNA PÅ VAD DE VILL SÄGA', cost: { pp: 6 }, temp: { unrest: -3, approval: 1 }, griev: -5, tip: 'Spelarna får träffa ministrar. Det blir en början.' },
      { text: 'LÅT DET PASSERA', temp: { unrest: 1 }, idn: { pride: -2 }, tip: 'Nästa match sjunger de. Lite tyst, men de sjunger.' },
      { text: 'HOTA SPELARNA MED STRAFF', temp: { statepower: 2, unrest: 3 }, rel: -3, idn: { pride: -2 }, griev: 8, tip: 'Spelarna sjunger nästa match med blicken i marken. Hela världen ser.' },
    ],
  },
  {
    id: 'idn_sang_bio', icon: '\u{1F3AC}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'STÅ UPP INNAN FILMEN BÖRJAR',
    text: 'Sedan lagen kräver att alla står upp när {sang} spelas har en biograf i {stad} anmälts för att en man satt kvar. Han har ett brutet ben och kryckor bredvid sig. Polisen har förhört honom och släppt honom. Som i Indien 2016-2018 diskuterar nu hela landet om sången på bion gör folk stoltare eller bara tröttare.',
    when: (c) => c.idn.anthemRule === 'mandatory' && c.day > 60,
    choices: [
      { text: 'GÖR SÅNGEN FRIVILLIG PÅ BION', cost: { pp: 6 }, idn: { anthemRule: 'schools', pride: -1 }, temp: { freedom: 2 }, griev: -4, tip: 'Den sjungs kvar i skolorna. Biografen får visa film i fred.' },
      { text: 'UNDANTAG FÖR DEN SOM INTE KAN STÅ', cost: { pp: 2 }, temp: { approval: 1 }, griev: -2, tip: 'En liten ändring i lagen. Det borde ha stått där från början.' },
      { text: 'LAGEN GÄLLER ALLA', temp: { statepower: 1, approval: -2 }, idn: { pride: 1 }, griev: 4, tip: 'Mannen med kryckor blir känd i hela landet. Inte på det sätt du hoppades.' },
    ],
  },
  {
    id: 'idn_sang_mormor', icon: '\u{1F475}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'MORMOR FICK BÖTER',
    text: 'En 84-årig kvinna i {stad} har fått böter för att hon inte reste sig när {sang} spelades på torget. Hon säger att hon inte hörde den, och att hon har stått upp för sitt land i åttio år. Filmen på henne när hon tar emot boten har setts av halva befolkningen, och en insamling till boten har samlat in hundra gånger beloppet.',
    when: (c) => c.idn.anthemRule === 'mandatory' && c.st.freedom > -15,
    choices: [
      { text: 'RIV BOTEN OCH BE OM URSÄKT', temp: { approval: 2 }, griev: -3, tip: 'Polischefen lämnar blommor. Mormor bjuder på kaffe.' },
      { text: 'GÖR SÅNGEN FRIVILLIG IGEN', cost: { pp: 8 }, idn: { anthemRule: 'free', pride: -1 }, temp: { freedom: 3, approval: 1 }, griev: -6, tip: 'Den som vill sjunger. Fler gör det än man tror.' },
      { text: 'LAGEN ÄR LAGEN', temp: { statepower: 1, approval: -3 }, griev: 5, tip: 'Pengarna från insamlingen går till ett äldreboende. Det blir en bra rubrik, men inte för dig.' },
    ],
  },
  {
    id: 'idn_sang_skolor', icon: '\u{1F3EB}', weight: 2, cooldown: 900,
    title: 'SÅNGEN VARJE MORGON',
    text: 'Sedan skolorna börjat sjunga {sang} varje morgon har föräldrar i {stad} skrivit ett upprop. Några tycker att det tar tid från matten, andra att det är fint att barnen lär sig sången. En rektor har låtit eleverna sjunga den i rap-version på fredagarna, och nu vill ministern veta om det är tillåtet.',
    when: (c) => c.idn.anthemRule === 'schools',
    choices: [
      { text: 'RAP-VERSIONEN ÄR OKEJ', temp: { qol: 1 }, idn: { pride: 1, attach: 0.03 }, tip: 'Barnen sjunger högre än någonsin. Rektorn blir ett kändisskap.' },
      { text: 'BARA ORIGINALET', idn: { pride: 1 }, temp: { approval: -1 }, tip: 'Sången sjungs som den skrevs. Utan rytm, men med respekt.' },
      { text: 'LÅT VARJE SKOLA BESTÄMMA', cost: { pp: 4 }, idn: { anthemRule: 'free' }, temp: { freedom: 1 }, tip: 'Hälften av skolorna fortsätter sjunga. De andra börjar räkna.' },
    ],
  },
  {
    id: 'idn_sang_texten', icon: '\u{1F4DD}', weight: 2, cooldown: 1100,
    title: 'STRIDEN OM EN RAD I SÅNGEN',
    text: 'En rad i {sang} talar bara om «söner» och «fäder». En grupp riksdagsledamöter vill ändra den så att den gäller alla, som Kanada gjorde 2018 och Österrike 2012. Kompositörens förening säger att man inte ändrar ett konstverk. Mätningarna visar att folket är exakt delat, och en känd sångerska har redan sjungit den nya raden på tv.',
    when: (c) => c.demo >= 6 && c.st.freedom > 5,
    choices: [
      { text: 'ÄNDRA RADEN', cost: { pp: 8 }, temp: { approval: 1, freedom: 1 }, idn: { attach: -0.03 }, tip: 'Den nya raden sjungs för första gången på nationaldagen. Det låter bra.' },
      { text: 'BEHÅLL SÅNGEN SOM DEN ÄR', idn: { pride: 1 }, temp: { approval: -1 }, tip: 'Traditionen vinner. Sångerskan sjunger sin version ändå.' },
      { text: 'LÅT FOLK SJUNGA DEN VERSION DE VILL', temp: { stability: 1 }, tip: 'På matcherna hörs båda raderna samtidigt. Ingen märker skillnaden.' },
    ],
  },
  {
    id: 'idn_sang_arvingar', icon: '\u{1F3BC}', weight: 2, cooldown: 1200,
    title: 'ARVINGARNA VILL HA BETALT',
    text: 'Barnbarnen till kompositören av {sang} har upptäckt att upphovsrätten fortfarande gäller i fem år till. De kräver ersättning varje gång sången spelas på tv, på matcher och i skolorna. Advokaten har skickat en räkning till staten, och den är lång. Juristerna på kulturdepartementet säger att arvingarna kan ha rätt.',
    when: (c) => c.idn.anthemRule === 'free' && c.day > 200 && c.st.income > 0,
    choices: [
      { text: 'KÖP RÄTTIGHETERNA', cost: { money: 100 }, idn: { pride: 1 }, tip: 'Sången blir folkets för alltid. Barnbarnen åker på en lång semester.' },
      { text: 'ERBJUD DEM EN HEDERSPLATS PÅ NATIONALDAGEN', cost: { pp: 4 }, temp: { approval: 1 }, tip: 'De tackar ja och drar tillbaka kravet. Ära är också en valuta.' },
      { text: 'LÅT DOMSTOLEN AVGÖRA', temp: { approval: -1 }, risk: { chance: 0.6,
        win: { text: 'Domstolen säger att en nationalsång tillhör folket. Arvingarna får inget.', idn: { pride: 1 } },
        lose: { text: 'Arvingarna vinner. Staten betalar, och tidningarna räknar varje krona.', temp: { income: -2 } } } },
    ],
  },
  {
    id: 'idn_sang_fel_match', icon: '\u{26BD}', weight: 2, cooldown: 1000,
    title: 'FEL SÅNG PÅ MATCHEN',
    text: 'När landslaget skulle spela i {granne} spelade arenans dj en parodi på {sang} från en gammal komedifilm i stället för den riktiga. Spelarna stod med handen på hjärtat och tittade förvirrat på varandra. Något liknande hände Kazakstan 2012. Värdlandet ber om ursäkt, och filmen på spelarnas ansikten är redan ett skämt över hela världen.',
    when: (c) => c.idn.recog < 35 && c.day > 90,
    choices: [
      { text: 'KRÄV EN OFFICIELL URSÄKT', cost: { pp: 2 }, idn: { pride: 1 }, rel: -1, tip: 'Ursäkten kommer. Den spelas upp till fel musik.' },
      { text: 'SKRATTA MED', idn: { recog: 3 }, temp: { approval: 1 }, tip: 'Laget gör en film där de sjunger parodin. Den ses av miljoner.' },
      { text: 'SKICKA EN SKIVA TILL ALLA ARENOR', cost: { money: 10 }, idn: { recog: 2 }, tip: 'Med texten RÄTT SÅNG på omslaget. I stora bokstäver.' },
    ],
  },
  {
    id: 'idn_sang_ny', icon: '\u{1F3B5}', weight: 2, cooldown: 1200,
    title: 'EN NY NATIONALSÅNG',
    text: 'I en mätning säger bara var tredje att de känner sig berörda av {sang}. Den är svår att sjunga, texten handlar om ett krig ingen minns och melodin går för högt för de flesta. Kulturministern föreslår en tävling om en ny sång, men traditionalisterna varnar för att man inte byter sång som man byter skjorta.',
    when: (c) => c.idn.pride < 35 && c.st.approval < 20,
    choices: [
      { text: 'UTLYS EN TÄVLING', cost: { money: 40, pp: 4 }, idn: { attach: -0.05 }, next: 'idn_sang_ny_vinnare', tip: 'Alla får skicka in. Juryn får lyssna på allt.' },
      { text: 'BEHÅLL DEN GAMLA', idn: { pride: 1 }, tip: 'Den har överlevt två kungar och tre kriser. Den överlever en mätning.' },
      { text: 'SÄNK TONARTEN', cost: { money: 5 }, temp: { approval: 1 }, idn: { pride: 1 }, tip: 'Samma sång, lite lägre. Plötsligt kan alla sjunga med.' },
    ],
  },
  {
    id: 'idn_sang_ny_vinnare', icon: '\u{1F3A4}', chain: true,
    title: 'VINNAREN AV SÅNGTÄVLINGEN',
    text: 'Tolvtusen bidrag kom in. Juryn har valt tre finalister: en stillsam psalm av en kantor i {stad}, en marsch av en pensionerad militärmusiker och en glad poplåt av en 16-åring som blivit viral. Folket röstar i en tv-gala. Poplåten leder stort, och traditionalisterna är oroliga.',
    choices: [
      { text: 'LÅT FOLKET VÄLJA POPLÅTEN', idn: { pride: 2, attach: -0.1 }, temp: { approval: 2 }, tip: 'Landet får en nationalsång man kan dansa till. Äldre suckar.' },
      { text: 'JURYN VÄLJER PSALMEN', idn: { pride: 1 }, temp: { stability: 1, approval: -1 }, tip: 'Vacker, stilla och lätt att sjunga. Tonåringen blir ändå känd.' },
      { text: 'BEHÅLL DEN GAMLA ÄNDÅ', temp: { approval: -2 }, tip: 'Tolvtusen bidrag i en låda. Ett av dem blir en hit ändå.' },
    ],
  },
  {
    id: 'idn_sang_popversion', icon: '\u{1F3A4}', weight: 2, cooldown: 1000,
    title: 'POPSTJÄRNANS VERSION',
    text: 'Landets största popstjärna har spelat in {sang} med trummor, elgitarr och en kör av skolbarn. Låten ligger etta på topplistorna i fyra länder, och ungdomar som aldrig sjungit sången kan plötsligt texten. Kritikerna kallar det respektlöst. Popstjärnan vill att den nya versionen spelas på nationaldagen.',
    when: (c) => c.idn.anthemRule !== 'mandatory' && c.idn.pride > 30 && c.st.qol > 0,
    choices: [
      { text: 'SPELA DEN PÅ NATIONALDAGEN', idn: { pride: 3, recog: 2 }, temp: { approval: 1 }, tip: 'Ungdomarna sjunger med. Veteranerna nickar, till slut.' },
      { text: 'TACKA, MEN SPELA ORIGINALET', idn: { pride: 1 }, temp: { stability: 1 }, tip: 'Popversionen lever vidare på radio. Originalet får sin dag.' },
      { text: 'FÖRBJUD ALLA VERSIONER', cost: { pp: 4 }, temp: { freedom: -1, approval: -2 }, tip: 'Förbudet gör låten ännu mer populär. Så brukar det bli.' },
    ],
  },
  {
    id: 'idn_sang_barnkor', icon: '\u{1F467}', weight: 1, cooldown: 1200,
    title: 'BARNKÖREN SOM RÖRDE VÄRLDEN',
    text: 'En barnkör från en liten skola i {stad} sjöng {sang} när ett stort mästerskap invigdes. Den minsta sångerskan, sju år, tappade texten och fortsatte sjunga på eget språk med hela arenan som publik. Filmen har setts av femtio miljoner, och kören har fått inbjudningar från tolv länder.',
    when: (c) => c.idn.pride > 50 && c.idn.recog > 40 && c.st.qol > 10,
    choices: [
      { text: 'BJUD KÖREN TILL REGERINGSHUSET', cost: { money: 10 }, idn: { pride: 2 }, temp: { approval: 2 }, tip: 'Den minsta sångerskan frågar ledaren varför hon har så många rum.' },
      { text: 'SKICKA KÖREN PÅ TURNÉ', cost: { money: 30 }, idn: { recog: 3 }, rel: 2, tip: 'Tolv länder på två somrar. Skolan får en ny buss.' },
      { text: 'LÅT BARNEN VARA BARN', temp: { qol: 1 }, idn: { pride: 1 }, tip: 'Inga turnéer. De får glass och sommarlov.' },
    ],
  },
  {
    id: 'idn_sang_tvang_utland', icon: '\u{1F4F0}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'VÄRLDEN SKRATTAR ÅT SÅNGLAGEN',
    text: 'En utländsk satirserie har gjort ett avsnitt om lagen som tvingar alla i {rike} att stå upp när {sang} spelas. I avsnittet spelas sången hela tiden, i hissar, på toaletter och i tandläkarstolen. Det har setts av tiotals miljoner, och turistbyrån får frågor om turister måste lära sig texten.',
    when: (c) => c.idn.anthemRule === 'mandatory' && c.idn.recog > 50,
    choices: [
      { text: 'MILDRA LAGEN', cost: { pp: 6 }, idn: { anthemRule: 'schools' }, temp: { freedom: 2 }, rel: 2, griev: -3, tip: 'Sången sjungs i skolorna. Hissarna får vara tysta.' },
      { text: 'PROTESTERA MOT SATIREN', cost: { pp: 2 }, idn: { pride: 1 }, rel: -1, tip: 'Protesten blir ett eget avsnitt.' },
      { text: 'IGNORERA DET', ind: { tourists: -4 }, tip: 'Några turister stannar hemma. De flesta skrattar och kommer ändå.' },
    ],
  },

  // ===== PASSET =====
  {
    id: 'idn_pass_forfalskning', icon: '\u{1F575}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'PASSFABRIKEN I KÄLLAREN',
    text: 'Polisen har hittat en källare i {stad} med skrivare, stämplar och tusentals tomma passhäften. Ett nätverk har sålt falska pass från {rike} i flera år, och de har gått att använda eftersom passen saknar chip. Grannländerna har börjat granska varje pass från landet extra noga, och köerna vid gränsen är timslånga.',
    when: (c) => c.idn.passSec <= 1 && c.st.corruption > 0,
    choices: [
      { text: 'BYT TILL PASS MED CHIP', cost: { money: 200 }, idn: { recog: 1 }, perm: { safety: 1 }, rel: 2, tip: 'Det tar tre månader och kostar mycket. Sedan slutar källarna att löna sig.' },
      { text: 'SLÅ TILL MOT NÄTVERKET', cost: { pp: 6 }, perm: { corruption: -1 }, ind: { fraud: -5 }, tip: 'Tolv gripna. Stämplarna blir museiföremål.' },
      { text: 'TYST, DET SKADAR LANDETS RYKTE', perm: { corruption: 1 }, rel: -2, tip: 'Källaren stängs, och en ny öppnar i en annan stad.' },
    ],
  },
  {
    id: 'idn_pass_handskrivet', icon: '\u{1F4DD}', weight: 2, cooldown: 1000,
    title: 'PASSEN GODKÄNNS INTE',
    text: 'Flygbolagen har börjat neka passagerare från {rike} att gå ombord. Passen är fortfarande skrivna för hand, med ett foto som klistras in, och de går inte att läsa i maskinerna på flygplatserna. En idrottsklubb fastnade på en flygplats i två dygn på väg till en turnering. Världens passmyndigheter ändrade reglerna för många år sedan.',
    when: (c) => c.idn.passSec === 0 && c.day > 60,
    choices: [
      { text: 'INFÖR MASKINLÄSBARA PASS', cost: { money: 80 }, idn: { pride: 1 }, rel: 1, tip: 'Höj passets säkerhet i fliken LANDET. Ett steg in i nutiden.' },
      { text: 'GÅ DIREKT TILL PASS MED CHIP', cost: { money: 180 }, idn: { pride: 2, recog: 1 }, rel: 2, tip: 'Hoppa över ett steg. Dyrt, men passet blir som alla andras.' },
      { text: 'SKICKA FOLK MED BREV FRÅN AMBASSADEN', temp: { approval: -2 }, tip: 'Ett brev med stämpel. Det fungerar ibland.' },
    ],
  },
  {
    id: 'idn_pass_chiphack', icon: '\u{1F4F6}', weight: 2, cooldown: 1100,
    title: 'PASSCHIPET HAR KNÄCKTS',
    text: 'En grupp forskare vid universitetet i {stad} har visat att chipet i landets pass kan läsas av på en meters avstånd med en billig apparat från nätet. Namn, födelsedatum och foto kan kopieras utan att innehavaren märker något. Forskarna har väntat i tre månader på svar från passmyndigheten innan de publicerade.',
    when: (c) => c.idn.passSec >= 2 && c.res('computing') < 4 && c.day > 120,
    choices: [
      { text: 'TACKA FORSKARNA OCH LAGA FELET', cost: { money: 90 }, perm: { safety: 1 }, ind: { hacking: -5, trustgov: 1 }, tip: 'En ny programvara i alla nya pass. Forskarna får en medalj.' },
      { text: 'DELA UT SKYDDSFODRAL TILL ALLA', cost: { money: 30 }, temp: { approval: 1 }, tip: 'Ett fodral av metallfolie. Det fungerar, och det ser lite fånigt ut.' },
      { text: 'ÅTALA FORSKARNA', temp: { freedom: -2, research: -2 }, ind: { hacking: 5 }, tip: 'Hålet finns kvar. Nu är det bara de som inte är forskare som letar.' },
    ],
  },
  {
    id: 'idn_pass_fingeravtryck', icon: '\u{1F590}\u{FE0F}', weight: 2, cooldown: 1100, kind: 'frihet',
    title: 'REGISTRET MED ALLAS FINGRAR',
    text: 'Med de nya passen sparas allas fingeravtryck i ett centralt register. Polisen vill få använda registret för att lösa brott, säkerhetstjänsten vill kunna söka i det fritt och en dataskyddsjurist har gått till domstol. Varje vuxen i landet finns nu där, även de som aldrig gjort något fel.',
    when: (c) => c.idn.passSec === 3 && c.demo >= 4,
    choices: [
      { text: 'BARA FÖR PASSET, INGET ANNAT', cost: { pp: 6 }, temp: { freedom: 2 }, griev: -4, tip: 'Fingeravtrycken stannar i passen. Registret raderas efter kontrollen.' },
      { text: 'POLISEN FÅR SÖKA MED DOMSTOLSBESLUT', cost: { pp: 4 }, temp: { safety: 1 }, ind: { clearance: 2 }, tip: 'En kompromiss. Domarna får mycket att läsa.' },
      { text: 'FRITT FÖR ALLA MYNDIGHETER', temp: { safety: 2, freedom: -3, statepower: 2 }, griev: 6, ind: { clearance: 4 }, tip: 'Brott löses snabbare. Folk lämnar färre fingeravtryck på allt annat.' },
    ],
  },
  {
    id: 'idn_pass_ko', icon: '\u{23F3}', weight: 2, cooldown: 800,
    title: 'KÖN TILL PASSKONTORET',
    text: 'Inför sommaren står folk i kö utanför passkontoret i {huvudstad} redan klockan fyra på morgonen. Det finns inga lediga tider på fyra månader, och resebyråerna säger att tusentals semestrar kan bli inställda. En man har sålt sin plats i kön för motsvarande en månadslön, och en annan har tagit med sig ett tält.',
    when: (c) => c.idn.passSec >= 2 && c.idn.visaFree > 100 && c.st.welfare < 10,
    choices: [
      { text: 'ÖPPNA PASSKONTOR PÅ KVÄLLAR OCH HELGER', cost: { money: 60 }, temp: { approval: 2 }, tip: 'Kön är borta på tre veckor. Personalen vill ha övertid.' },
      { text: 'TILLFÄLLIGA PASS PÅ FLYGPLATSEN', cost: { money: 20 }, temp: { approval: 1 }, perm: { safety: -1 }, tip: 'Snabbt och enkelt. Lite för enkelt, tycker polisen.' },
      { text: 'DET ÄR FOLKS EGET ANSVAR', temp: { approval: -3 }, tip: 'Tältmannen blir känd i hela landet. Han startar ett parti.' },
    ],
  },
  {
    id: 'idn_pass_avgift', icon: '\u{1F4B8}', weight: 2, cooldown: 900, kind: 'valfard',
    title: 'ETT PASS KOSTAR EN MÅNADSLÖN',
    text: 'Med den höga avgiften kostar ett pass nu ungefär en månadslön för en undersköterska. Familjer med tre barn har inte råd att resa till släktingar utomlands, och studenter missar utbyten. En organisation för låginkomsttagare säger att passet blivit en klassfråga: de rika reser, de andra stannar hemma.',
    when: (c) => c.idn.passFee >= 3 && (c.ind.gdppc ?? 10000) < 20000,
    choices: [
      { text: 'GRATIS PASS FÖR BARN OCH STUDENTER', cost: { money: 40 }, temp: { approval: 2 }, griev: -4, tip: 'Familjerna kan resa igen. Kassan märker det knappt.' },
      { text: 'SÄNK AVGIFTEN', temp: { approval: 2, income: -1 }, griev: -3, tip: 'Sänk passavgiften i fliken LANDET.' },
      { text: 'PASSET ÄR EN LYX, INTE EN RÄTTIGHET', temp: { approval: -2 }, griev: 4, tip: 'Pengarna kommer in. Arga brev också.' },
    ],
  },
  {
    id: 'idn_pass_gratis', icon: '\u{1F193}', weight: 2, cooldown: 1000,
    title: 'GRATISPASSEN SOM FÖRSVANN',
    text: 'Sedan passen blev gratis har ansökningarna tredubblats. Många skaffar ett pass för säkerhets skull, och några tappar bort det för att ett nytt inte kostar något. Passmyndigheten har slut på passhäften, och polisen misstänker att en del av de «borttappade» passen säljs vidare till folk som inte är medborgare.',
    when: (c) => c.idn.passFee === 0 && c.day > 90,
    choices: [
      { text: 'AVGIFT FÖR ETT NYTT PASS OM DET TAPPAS', cost: { pp: 2 }, perm: { safety: 1 }, tip: 'Det första är gratis. Det andra kostar. Folk blir rädda om sina pass.' },
      { text: 'INFÖR EN LÅG AVGIFT FÖR ALLA', temp: { approval: -1, income: 1 }, tip: 'Höj passavgiften till LÅG i fliken LANDET.' },
      { text: 'TRYCK FLER PASS', cost: { money: 30 }, temp: { approval: 1 }, perm: { corruption: 1 }, tip: 'Alla får sitt pass. Några får flera.' },
    ],
  },
  {
    id: 'idn_gyllene_varning', icon: '\u{1F4B3}', weight: 3, cooldown: 900, kind: 'ekonomi',
    title: 'OMVÄRLDEN VARNAR FÖR GULDPASSEN',
    text: 'Grannländernas regeringar har skickat ett gemensamt brev: de gyllene passen från {rike} öppnar deras gränser för vem som helst med en miljon dollar. Som när EU gick till domstol mot Malta, hotar de att kräva visum av alla med landets pass. Programmet har dragit in stora summor, och finansministern vill inte släppa det.',
    when: (c) => c.idn.golden === 'citizenship',
    choices: [
      { text: 'AVSLUTA PROGRAMMET', cost: { pp: 4 }, idn: { golden: 'off' }, rel: 4, perm: { corruption: -1 }, tip: 'Pengarna slutar komma. Passet blir värt mer igen.' },
      { text: 'SKÄRP KONTROLLEN AV KÖPARNA', cost: { money: 40 }, perm: { corruption: -1 }, rel: 1, tip: 'Varje köpare granskas av en revisor. Färre köpare, bättre köpare.' },
      { text: 'DET ÄR VÅRT EGET BESLUT', rel: -4, perm: { corruption: 1 }, next: ['idn_gyllene_visum_indraget', null], tip: 'Grannarna förbereder sina visumregler.' },
    ],
  },
  {
    id: 'idn_gyllene_visum_indraget', icon: '\u{1F6AB}', chain: true, kind: 'ekonomi',
    title: 'VISUMFRIHETEN ÄR BORTA',
    text: 'Grannländerna har gjort som de sa. Alla med pass från {rike} måste nu söka visum, som när EU drog in visumfriheten för Vanuatu 2022. Turister, studenter och affärsresenärer står i kö på ambassaderna, och de som köpte gyllene pass vill ha tillbaka pengarna. Folk som aldrig köpt något undrar varför de straffas.',
    choices: [
      { text: 'AVSLUTA GULDPASSEN OCH FÖRHANDLA', cost: { pp: 10 }, idn: { golden: 'off', pride: 1 }, rel: 5, perm: { corruption: -1 }, tip: 'Det tar ett halvår att få tillbaka visumfriheten. Men den kommer.' },
      { text: 'HÅLL FAST VID PROGRAMMET', temp: { approval: -3, gdp: -1 }, idn: { pride: -2 }, rel: -2, tip: 'De rika köparna har sina pass. Alla andra har köer.' },
    ],
  },
  {
    id: 'idn_gyllene_brottsling', icon: '\u{1F575}\u{FE0F}', weight: 2, cooldown: 900, kind: 'ekonomi',
    title: 'HAN KÖPTE ETT PASS',
    text: 'Journalister har avslöjat att en man som är efterlyst för miljardbedrägerier i tre länder har köpt ett gyllene pass från {rike}. Han bor nu i en villa vid havet utanför {stad} och kan inte utlämnas. Som vid avslöjandet om Cypern 2020 visar dolda filmer att tjänstemän lovat att «se mellan fingrarna».',
    when: (c) => c.idn.golden !== 'off' && c.idn.goldenSold > 100,
    choices: [
      { text: 'DRA IN HANS PASS OCH STÄNG PROGRAMMET', cost: { pp: 8 }, idn: { golden: 'off' }, perm: { corruption: -2 }, rel: 3, next: 'idn_gyllene_utredning', tip: 'Han utlämnas. Villan står tom, och programmet stängs.' },
      { text: 'DRA IN HANS PASS, BEHÅLL PROGRAMMET', cost: { pp: 4 }, perm: { corruption: -1 }, rel: 1, tip: 'En köpare mindre. Hur många fler finns det?' },
      { text: 'HAN HAR BETALAT, HAN FÅR STANNA', perm: { corruption: 2 }, rel: -4, ind: { trustgov: -3 }, tip: 'Villan får en ny pool. Grannländerna slutar lita på landets pass.' },
    ],
  },
  {
    id: 'idn_gyllene_utredning', icon: '\u{1F4C1}', chain: true,
    title: 'GRANSKNINGEN AV GULDPASSEN',
    text: 'Utredningen har gått igenom alla gyllene pass som sålts. Var tionde köpare borde aldrig ha fått ett, och tre tjänstemän tog emot gåvor. Rapporten föreslår att alla tvivelaktiga pass dras in. Köparnas advokater säger att de stämmer staten om det sker.',
    choices: [
      { text: 'DRA IN ALLA TVIVELAKTIGA PASS', cost: { pp: 8 }, perm: { corruption: -2 }, rel: 3, ind: { trustgov: 2 }, tip: 'Advokaterna stämmer. Domstolarna ger staten rätt i nio fall av tio.' },
      { text: 'ÅTALA TJÄNSTEMÄNNEN', cost: { pp: 4 }, perm: { corruption: -1 }, ind: { trustgov: 1 }, tip: 'Tre rättegångar. Köparna får behålla sina pass.' },
      { text: 'LÄGG RAPPORTEN I EN LÅDA', mod: 'cover_up', perm: { corruption: 1 }, tip: 'Lådan är full av sådana rapporter.' },
    ],
  },
  {
    id: 'idn_gyllene_bostader', icon: '\u{1F3E0}', weight: 2, cooldown: 1000,
    title: 'GULDVISUMEN DRIVER UPP HYRORNA',
    text: 'Utlänningar som köper en bostad för en halv miljon dollar får uppehållstillstånd, och i centrala {huvudstad} har priserna stigit med en tredjedel på två år. Lägenheter står tomma större delen av året medan unga familjer flyttar ut. Portugal och Spanien stängde liknande program 2023-2025 av samma skäl.',
    when: (c) => c.idn.golden === 'residence',
    choices: [
      { text: 'STÄNG PROGRAMMET', cost: { pp: 4 }, idn: { golden: 'off' }, temp: { approval: 2 }, ind: { houseprice: -5 }, tip: 'Priserna slutar stiga. Mäklarna är besvikna.' },
      { text: 'BARA UTANFÖR STORSTÄDERNA', cost: { pp: 2 }, temp: { approval: 1 }, ind: { houseprice: -2 }, tip: 'Köparna flyttar till landsbygden. Där är husen billiga och utsikten fin.' },
      { text: 'PENGARNA BEHÖVS', res: { money: 60 }, temp: { approval: -2 }, ind: { houseprice: 4 }, tip: 'Investeringarna fortsätter. Hyrorna också.' },
    ],
  },
  {
    id: 'idn_utresevisum_flykt', icon: '\u{1F6AA}', weight: 3, cooldown: 700, kind: 'frihet',
    title: 'LÄKARNA SOM FLYDDE',
    text: 'Trots utresevisumet har fyrtio läkare från sjukhuset i {stad} tagit sig över gränsen till fots, med barnen på ryggen. De säger att de inte fått resa på konferenser på fem år. I grannlandet får de jobb på en vecka. Sjukhuset har nu halva personalen kvar, och kön till operationer växer.',
    when: (c) => c.idn.exitVisa && c.day > 30,
    choices: [
      { text: 'AVSKAFFA UTRESEVISUMET', cost: { pp: 10 }, idn: { exitVisa: false, pride: 1 }, temp: { freedom: 3 }, rel: 3, griev: -8, tip: 'Några fler reser. De flesta kommer tillbaka när de vet att de får.' },
      { text: 'HÖJ LÖNERNA I VÅRDEN', cost: { money: 120 }, perm: { welfare: 1 }, temp: { approval: 1 }, tip: 'De som är kvar stannar. Några av de som flydde funderar på att komma hem.' },
      { text: 'BEVAKA GRÄNSEN HÅRDARE', temp: { statepower: 2, freedom: -2 }, mod: 'brain_drain', rel: -3, griev: 6, tip: 'Muren blir högre. Längtan efter att komma ut också.' },
    ],
  },
  {
    id: 'idn_utresevisum_idrott', icon: '\u{1F3C3}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'STJÄRNAN STANNADE UTOMLANDS',
    text: 'Landets bästa löpare vann guld i ett mästerskap utomlands och gick sedan inte på planet hem. Hon har sökt asyl och säger att hon inte vill behöva söka tillstånd varje gång hon ska tävla. Hela landet såg guldloppet på tv. Nyheten om att hon stannat har bara nått de som lyssnar på utländsk radio.',
    when: (c) => c.idn.exitVisa && c.day > 60,
    choices: [
      { text: 'ÖNSKA HENNE LYCKA TILL', idn: { exitVisa: false }, cost: { pp: 6 }, temp: { freedom: 2 }, rel: 2, griev: -4, tip: 'Utresevisumet avskaffas. Hon tävlar för landet igen nästa år.' },
      { text: 'KALLA HENNE EN FÖRRÄDARE', idn: { pride: -2 }, temp: { statepower: 1, approval: -2 }, rel: -2, griev: 4, tip: 'Hennes guldbild hänger kvar i varje skola. Folk minns loppet.' },
      { text: 'TYST, TAL OM NÅGOT ANNAT', temp: { stability: -1 }, ind: { pressfree: -2 }, tip: 'Nyheten sprids ändå. Det tar bara en vecka längre.' },
    ],
  },
  {
    id: 'idn_pass_journalist', icon: '\u{1F4F5}', weight: 3, cooldown: 700, kind: 'frihet',
    title: 'JOURNALISTEN FICK INTE RESA',
    text: 'En känd journalist skulle ta emot ett internationellt pris för sin granskning av korruption. På flygplatsen i {huvudstad} fick hon veta att hennes pass dragits in. Hon sitter nu på en bänk i avgångshallen med prisets tal i handen. Filmen från hallen sänds i tv-kanaler över hela världen, och tre länder har kallat upp dina ambassadörer.',
    when: (c) => c.idn.dissidentPass,
    choices: [
      { text: 'GE TILLBAKA ALLA KRITIKERS PASS', cost: { pp: 10 }, idn: { dissidentPass: false, recog: 1 }, temp: { freedom: 3 }, rel: 4, griev: -8, ind: { pressfree: 3 }, tip: 'Hon hinner till galan. Talet handlar om vad som hände på flygplatsen.' },
      { text: 'BARA HENNES PASS', cost: { pp: 4 }, rel: 1, griev: -2, tip: 'Ett undantag. De andra kritikerna sitter kvar hemma.' },
      { text: 'HON FÅR STANNA HEMMA', temp: { statepower: 2 }, rel: -4, griev: 6, ind: { pressfree: -3 }, mod: 'martyr', tip: 'Priset delas ut till en tom stol. Bilden blir ikonisk.' },
    ],
  },
  {
    id: 'idn_pass_tom_stol', icon: '\u{1F3C5}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'FREDSPRISET OCH DEN TOMMA STOLEN',
    text: 'En författare från {rike} har fått ett stort fredspris, men hennes pass är indraget sedan tre år. Prisutdelningen i en annan huvudstad sänds direkt, och arrangörerna har ställt fram en tom stol med hennes namn. Tidigare har bara ett fåtal länder hindrat sina pristagare från att resa, och ingen av dem nämns med beröm i historieböckerna.',
    when: (c) => c.idn.dissidentPass && c.day > 90,
    choices: [
      { text: 'LÅT HENNE RESA', cost: { pp: 6 }, idn: { dissidentPass: false, pride: 2 }, rel: 5, griev: -5, tip: 'Hon reser, tar emot priset och kommer hem. Hela landet ser talet.' },
      { text: 'HON FÅR RESA, MEN INTE KOMMA TILLBAKA', temp: { statepower: 1 }, rel: -2, griev: 5, tip: 'Hon tar emot priset i exil. Hennes böcker säljs som aldrig förr.' },
      { text: 'PRISET ÄR EN UTLÄNDSK KOMPLOTT', idn: { pride: -1 }, rel: -5, ind: { pressfree: -2 }, tip: 'Den tomma stolen står på alla förstasidor i hela världen.' },
    ],
  },
  {
    id: 'idn_dubbelt_medborgarskap', icon: '\u{1F310}', weight: 2, cooldown: 1100, kind: 'migration',
    title: 'UTLANDSMEDBORGARNA VILL HA TVÅ PASS',
    text: 'Hundratusentals medborgare som bor utomlands har skrivit ett upprop. För att få jobb och rösta i sina nya länder måste de bli medborgare där, och då förlorar de sitt pass från {rike}. «Vi är fortfarande era, även om vi bor i {land}», skriver de. Många av dem skickar hem pengar varje månad.',
    when: (c) => c.idn.pride > 50 && c.demo >= 4 && (c.ind.emig ?? 0) > 50000,
    choices: [
      { text: 'TILLÅT DUBBELT MEDBORGARSKAP', cost: { pp: 8 }, idn: { pride: 2 }, temp: { gdp: 1 }, rel: 2, tip: 'Utlandsmedborgarna firar. Några av dem flyttar hem med kunskap och pengar.' },
      { text: 'BARA FÖR LÄNDER VI HAR AVTAL MED', cost: { pp: 4 }, idn: { pride: 1 }, tip: 'En kompromiss som juristerna älskar och alla andra tycker är krånglig.' },
      { text: 'EN MEDBORGARE, ETT PASS', idn: { pride: -1 }, temp: { approval: -1 }, tip: 'Lojaliteten ska vara odelad, säger du. Utlandsmedborgarna tycker annorlunda.' },
    ],
  },
  {
    id: 'idn_pass_starkt', icon: '\u{1F4D8}', weight: 2, cooldown: 1000,
    title: 'ETT AV VÄRLDENS STARKASTE PASS',
    text: 'Det nya passindexet är klart, och passet från {rike} är bland de femton starkaste i världen. Med det kan man resa till över hundra länder utan visum. I resebyråerna i {stad} märker de att folk bokar resor till platser de aldrig tänkt på förut, och utlandsstudenterna har blivit fler.',
    when: (c) => c.idn.passRank <= 15,
    choices: [
      { text: 'FIRA MED EN KAMPANJ OM PASSET', cost: { money: 20 }, idn: { pride: 2, recog: 1 }, tip: 'Affischer på flygplatsen: VÄLKOMMEN HEM TILL ETT AV VÄRLDENS BÄSTA PASS.' },
      { text: 'DELA MED OSS AV VISUMFRIHETEN', rel: 2, ind: { tourists: 5 }, tip: 'Ge fler länder visumfrihet i fliken LANDET. Det som går runt kommer runt.' },
      { text: 'NJUT I TYSTHET', idn: { pride: 1 }, tip: 'Ett starkt pass märks bäst när man inte behöver tänka på det.' },
    ],
  },
  {
    id: 'idn_pass_svagt', icon: '\u{1F9F3}', weight: 2, cooldown: 1000,
    title: 'TIMMAR I VISUMKÖN',
    text: 'En student från {stad} har fått ett stipendium vid ett universitet utomlands, men hon har väntat i tre månader på visum och riskerar att missa terminsstarten. Passet från {rike} är ett av världens svagaste: nästan alla länder kräver visum, intyg om lön och ett returflyg. Hennes berättelse delas av tusentals som känner igen sig.',
    when: (c) => c.idn.passRank > 80,
    choices: [
      { text: 'FÖRHANDLA OM VISUMFRIHET', cost: { pp: 8 }, rel: 2, idn: { pride: 1 }, tip: 'Ett land i taget. Ambassaderna gör jobbet, se fliken LANDET.' },
      { text: 'HJÄLP STUDENTEN VIA AMBASSADEN', cost: { pp: 2 }, temp: { approval: 1 }, tip: 'Hon får sitt visum på en vecka. De tusentals andra väntar kvar.' },
      { text: 'DET ÄR DE ANDRA LÄNDERNAS FEL', idn: { pride: -1 }, rel: -1, tip: 'Det stämmer delvis. Det hjälper ingen att resa.' },
    ],
  },
  {
    id: 'idn_visum_turistboom', icon: '\u{1F3D6}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'TURISTERNA STRÖMMAR IN',
    text: 'Sedan visumkraven slopats för flera länder har turisterna blivit många fler. Hotellen i {stad} är fullbokade, restaurangerna anställer och en liten fiskeby har fått sin första souvenirbutik. Men i {huvudstad} klagar de boende på kö till bussarna och resväskor som skramlar på gatorna hela natten.',
    when: (c) => c.idn.waivers >= 1 && c.st.qol > -10,
    choices: [
      { text: 'MER TURISTER, MER PENGAR', temp: { gdp: 1, income: 1 }, ind: { tourists: 10 }, tip: 'Fiskebyn får sin andra souvenirbutik.' },
      { text: 'INFÖR EN TURISTSKATT', cost: { pp: 2 }, res: { money: 30 }, ind: { tourists: 4 }, tip: 'En liten avgift per natt. Pengarna går till bussarna.' },
      { text: 'SPRID TURISTERNA ÖVER LANDET', cost: { money: 30 }, temp: { qol: 1 }, ind: { tourists: 7 }, tip: 'Reklam för landsbygden. Huvudstaden andas ut.' },
    ],
  },
  {
    id: 'idn_visum_overstay', icon: '\u{2708}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'DE SOM STANNADE KVAR',
    text: 'Gränspolisen har räknat: tusentals av dem som kom visumfritt som turister har stannat kvar efter tre månader och arbetar svart på byggen och restauranger. Arbetsgivarna säger att de behöver folket. Facket säger att lönerna pressas. Oppositionen kräver att visumfriheten dras in för de länder där flest stannat.',
    when: (c) => c.idn.waivers >= 3 && c.st.immigration > 0,
    choices: [
      { text: 'GE DEM ARBETSTILLSTÅND', cost: { pp: 6 }, temp: { gdp: 1, integration: 1 }, griev: 3, tip: 'De betalar skatt från och med nästa månad.' },
      { text: 'KONTROLLERA ARBETSPLATSERNA', cost: { money: 40 }, perm: { corruption: -1 }, griev: -2, tip: 'Böter till arbetsgivarna. De som stannat åker hem eller söker tillstånd.' },
      { text: 'DRA IN VISUMFRIHETEN', rel: -3, griev: -3, ind: { tourists: -8 }, tip: 'Ta bort visumfriheten i fliken LANDET. Turisterna försvinner med dem.' },
    ],
  },
  {
    id: 'idn_inreseforbud_hamnd', icon: '\u{1F6AB}', weight: 2, cooldown: 900,
    title: 'DE STÄNGER SINA GRÄNSER FÖR OSS',
    text: 'Som svar på ditt inreseförbud har landet du stängt ute infört samma förbud mot alla med pass från {rike}. Fyratusen medborgare som bor där får frist på en månad att lämna, och studenter mitt i sina examina vet inte vad de ska göra. Familjer som har släktingar på båda sidor ringer till ambassaden dygnet runt.',
    when: (c) => c.idn.bans >= 1 && c.day > 30,
    choices: [
      { text: 'HÄV FÖRBUDET MOT DEM', cost: { pp: 6 }, rel: 3, temp: { approval: 1 }, tip: 'Häv det i fliken LANDET. Studenterna får skriva sina tentor.' },
      { text: 'UNDANTAG FÖR STUDENTER OCH FAMILJER', cost: { pp: 4 }, rel: 1, temp: { approval: 1 }, tip: 'Båda sidor kan gå med på det. Det tar tre veckor att förhandla.' },
      { text: 'VI BACKAR INTE', idn: { pride: 1 }, rel: -2, temp: { approval: -1 }, tip: 'Ambassaden ordnar charterflyg hem. Det blir trångt.' },
    ],
  },
  {
    id: 'idn_inreseforbud_idrott', icon: '\u{1F3C5}', weight: 2, cooldown: 1000,
    title: 'LAGET FÅR INTE KOMMA',
    text: 'Ditt land ska vara värd för ett stort mästerskap, men ett av de kvalificerade lagen kommer från ett land under inreseförbud. Det internationella förbundet hotar att flytta hela mästerskapet om laget inte får komma. Hotellen är bokade och biljetterna sålda, och spelarna själva säger att de bara vill spela.',
    when: (c) => c.idn.bans >= 1 && c.idn.pride > 40,
    choices: [
      { text: 'UNDANTAG FÖR LAGET', cost: { pp: 4 }, rel: 2, temp: { approval: 1 }, tip: 'De spelar, förlorar i kvartsfinalen och får stående applåder.' },
      { text: 'LÅT FÖRBUNDET FLYTTA MÄSTERSKAPET', idn: { pride: -2 }, temp: { income: -2 }, ind: { tourists: -10 }, tip: 'Mästerskapet flyttar till ett grannland. Hotellen ringer och klagar.' },
      { text: 'HÄV FÖRBUDET HELT', cost: { pp: 8 }, rel: 3, idn: { pride: 1 }, tip: 'Häv det i fliken LANDET. Idrotten öppnade dörren.' },
    ],
  },
  {
    id: 'idn_visum_indraget', icon: '\u{1F6C2}', weight: 2, cooldown: 1000,
    title: 'NU KRÄVER DE VISUM AV OSS',
    text: 'Ett av landets viktigaste grannländer kräver från och med nästa månad visum av alla med pass från {rike}. De pekar på de nya lagarna och på pass som sålts till fel personer. Affärsresenärer och familjer som brukat åka över gränsen på helgerna står plötsligt i kö på ambassaden.',
    when: (c) => (c.brutals >= 1 || c.idn.golden === 'citizenship') && c.idn.visaFree > 60,
    choices: [
      { text: 'SKICKA EN DIPLOMAT FÖR ATT FÖRHANDLA', cost: { pp: 6 }, rel: 2, tip: 'Det tar månader. Under tiden får alla vänta.' },
      { text: 'KRÄV VISUM AV DEM OCKSÅ', idn: { pride: 1 }, rel: -3, ind: { tourists: -6 }, tip: 'Ömsesidigheten är rättvis. Den är också dyr för båda.' },
      { text: 'ACCEPTERA DET', idn: { pride: -2 }, temp: { approval: -1 }, tip: 'Passet blir lite svagare. Folk märker det vid gränsen.' },
    ],
  },
  {
    id: 'idn_visum_omsesidighet', icon: '\u{2696}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'DE VILL HA ÖMSESIDIGHET',
    text: 'Ett land där medborgare från {rike} får resa visumfritt har tröttnat: deras medborgare måste söka visum hos dig, med bankutdrag och intyg. Utrikesministern där säger att visumfriheten dras in om ett halvår om inget händer. Turistnäringen hos dig säger att de gärna tar emot fler besökare därifrån.',
    when: (c) => c.idn.waivers === 0 && c.idn.visaFree > 100,
    choices: [
      { text: 'GE DEM VISUMFRIHET', cost: { pp: 4 }, rel: 3, ind: { tourists: 5 }, tip: 'Ge visumfrihet i fliken LANDET. Det som är rättvist håller längst.' },
      { text: 'FÖRHANDLA OM ETT ENKLARE VISUM', cost: { pp: 2 }, rel: 1, tip: 'Visum på nätet på en dag. De går med på det, för den här gången.' },
      { text: 'VÅRA REGLER ÄR VÅRA', rel: -2, idn: { pride: -1 }, tip: 'Om ett halvår står dina medborgare i kö hos dem.' },
    ],
  },
  {
    id: 'idn_pass_fargen', icon: '\u{1F4D5}', weight: 1, cooldown: 1200,
    title: 'STRIDEN OM PASSETS FÄRG',
    text: 'En kampanj vill att passet byter färg till den gamla, «den riktiga», som när Storbritannien gick tillbaka till blått pass 2020. Motståndarna påpekar att färgen inte gör passet starkare. Debatten har pågått i tre veckor i riksdagen, och tv-kanalerna har haft panelsamtal om pantonekoder.',
    when: (c) => c.idn.pride > 60 && c.idn.prideD > 2,
    choices: [
      { text: 'BYT FÄRG', cost: { money: 40 }, idn: { pride: 2, attach: 0.03 }, temp: { approval: 1 }, tip: 'Välj passets färg i fliken LANDET. De nya passen trycks utomlands.' },
      { text: 'BEHÅLL FÄRGEN', temp: { approval: -1 }, tip: 'Passet ser likadant ut. Riksdagen kan diskutera något annat.' },
      { text: 'LÅT FOLKET RÖSTA PÅ NÄTET', cost: { pp: 2 }, temp: { approval: 1 }, idn: { pride: 1 }, tip: 'Hundratusentals röstar. En grön skämtfärg vinner nästan.' },
    ],
  },

  // ===== AMBASSADERNA =====
  {
    id: 'idn_amb_belagring', icon: '\u{1F4E2}', weight: 2, cooldown: 900,
    title: 'DEMONSTRANTER UTANFÖR AMBASSADEN',
    text: 'Tusentals demonstranter har samlats utanför din ambassad i {ambassadland}. De bränner bildockor av din ledare och kastar ägg mot fasaden, och personalen har låst in sig på övervåningen. Den lokala polisen har kommit, men sakta. Ambassadören ringer och frågar om hon ska stänga ambassaden och evakuera personalen.',
    when: (c) => c.idn.embassies >= 30 && (c.atWar || c.brutals >= 1) && c.day > 60,
    choices: [
      { text: 'EVAKUERA PERSONALEN', cost: { money: 20 }, rel: -1, tip: 'Personalen flygs hem. Ambassaden står tom ett tag.' },
      { text: 'KRÄV ATT VÄRDLANDET SKYDDAR AMBASSADEN', cost: { pp: 4 }, rel: -2, idn: { pride: 1 }, tip: 'Värdlandet är skyldigt det enligt Wienkonventionen. Polisen kommer fortare.' },
      { text: 'BJUD IN DEMONSTRANTERNAS LEDARE PÅ TE', temp: { approval: -1 }, rel: 2, risk: { chance: 0.5,
        win: { text: 'De pratar i tre timmar. Demonstrationen går hem, och några kommer tillbaka på kaffe.', rel: 3 },
        lose: { text: 'Ledarna vägrar och filmar inbjudan. Den blir ett skämt i deras medier.', rel: -2 } } },
    ],
  },
  {
    id: 'idn_amb_gaffe', icon: '\u{1F399}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'AMBASSADÖREN SA FÖR MYCKET',
    text: 'Din ambassadör i {ambassadland} trodde att mikrofonen var avstängd när han kallade värdlandets mat «det tråkigaste jag ätit» i en direktsänd talkshow. Klippet har setts av halva landet där, och en kockförening har startat en kampanj mot dina varor. Värdlandets utrikesministerium har kallat upp honom.',
    when: (c) => c.idn.embassies >= 50 && c.st.corruption > 10 && c.day > 90,
    choices: [
      { text: 'KALLA HEM AMBASSADÖREN', cost: { pp: 4 }, rel: 2, tip: 'En ny ambassadör, med bättre smaklökar.' },
      { text: 'LÅT HONOM ÄTA UPP SINA ORD', cost: { money: 5 }, rel: 3, temp: { approval: 1 }, tip: 'Han lagar landets nationalrätt i samma talkshow. Det blir en hit.' },
      { text: 'STÅ BAKOM HONOM', idn: { pride: 1 }, rel: -3, tip: 'Hemma skrattar folk. Där borta gör de inte det.' },
    ],
  },
  {
    id: 'idn_amb_spion', icon: '\u{1F576}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'DIPLOMATEN SOM VAR SPION',
    text: 'Säkerhetstjänsten i {ambassadland} har utvisat en av dina diplomater. De säger att han samlat in uppgifter om deras försvar på en klubb för frimärkssamlare. Han har 48 timmar på sig att lämna landet. Din säkerhetstjänst säger, utan att förneka något, att han var «en mycket skicklig samlare».',
    when: (c) => c.idn.embassies >= 40 && c.res('espionage') >= 4,
    choices: [
      { text: 'UTVISA EN AV DERAS DIPLOMATER', idn: { pride: 1 }, rel: -3, tip: 'Det är så det brukar gå till. Ett namn för ett namn.' },
      { text: 'TA EMOT HONOM I TYSTHET', rel: -1, temp: { research: 1 }, tip: 'Han har med sig en väska. Det står frimärken på den.' },
      { text: 'BE OM URSÄKT', cost: { pp: 4 }, rel: 2, temp: { approval: -1 }, tip: 'Relationen räddas. Spionerna i resten av världen blir mer försiktiga.' },
    ],
  },
  {
    id: 'idn_amb_gast', icon: '\u{1F6CB}\u{FE0F}', weight: 2, cooldown: 1100,
    title: 'GÄSTEN SOM INTE VILL GÅ',
    text: 'En känd regimkritiker från {ambassadland} har sprungit in i din ambassad där och bett om asyl. Hennes eget land vill gripa henne. Polisen står nu utanför ambassadens dörrar dygnet runt, och hon sover på en soffa i konferensrummet. Som när en grundare av en läckwebbplats bodde sju år på en ambassad i London.',
    when: (c) => c.idn.embassies >= 40 && c.demo >= 6 && c.st.freedom > 0,
    choices: [
      { text: 'GE HENNE ASYL', cost: { pp: 6 }, rel: -3, idn: { recog: 2 }, temp: { freedom: 1 }, next: 'idn_amb_gast_ar', tip: 'Hon får stanna. Hur länge vet ingen.' },
      { text: 'FÖRHANDLA OM ATT HON FÅR LÄMNA LANDET', cost: { pp: 8 }, rel: 1, risk: { chance: 0.5,
        win: { text: 'Värdlandet går med på det. Hon flygs ut i en diplomatbil och landar i frihet.', idn: { pride: 2 }, rel: 1 },
        lose: { text: 'Förhandlingen spricker. Hon får bo kvar på soffan.', rel: -2 } } },
      { text: 'BE HENNE GÅ', rel: 2, temp: { freedom: -2, approval: -2 }, tip: 'Hon grips på trappan. Bilden går jorden runt.' },
    ],
  },
  {
    id: 'idn_amb_gast_ar', icon: '\u{1F408}', chain: true,
    title: 'HON HAR BOTT DÄR I ETT ÅR',
    text: 'Regimkritikern har nu bott ett år på din ambassad i {ambassadland}. Hon har skaffat en katt, startat en podd och spelar badminton i korridoren. Personalen är trött, polisbilarna utanför kostar värdlandet en förmögenhet och katten har rivit sönder ambassadörens gardiner. Någonting måste hända.',
    choices: [
      { text: 'FÖRHANDLA FRAM EN FRI LEJDE', cost: { pp: 10 }, rel: 3, idn: { pride: 2 }, tip: 'Hon lämnar ambassaden med katten i en bur. Det blir en lång presskonferens.' },
      { text: 'BYGG HENNE ETT RIKTIGT RUM', cost: { money: 20 }, temp: { freedom: 1 }, rel: -1, tip: 'Hon stannar kvar. Katten får ett klösträd.' },
      { text: 'DRA TILLBAKA ASYLEN', rel: 2, temp: { approval: -3 }, idn: { recog: -2 }, tip: 'Hon förs ut av polis. Katten adopteras av ambassadören.' },
    ],
  },
  {
    id: 'idn_amb_gisslan', icon: '\u{1F198}', weight: 2, cooldown: 1200,
    title: 'AMBASSADEN ÄR OCKUPERAD',
    text: 'En beväpnad grupp har tagit sig in i din ambassad i {ambassadland} under en mottagning och håller trettio gäster och diplomater som gisslan. De kräver att fångar släpps i ett tredje land. Gisslan är oskadd, säger en diplomat i ett kort telefonsamtal. Värdlandets polis väntar på ditt besked. Liknande hände i Lima 1996.',
    when: (c) => c.idn.embassies >= 50 && c.worldRevolutions >= 2 && c.day > 150,
    choices: [
      { text: 'FÖRHANDLA, HUR LÅNG TID DET ÄN TAR', cost: { pp: 8 }, rel: 2, temp: { stability: 1 }, tip: 'Det tar fem veckor. Alla kommer ut, trötta men oskadda.' },
      { text: 'LÅT VÄRDLANDETS SPECIALSTYRKA GÅ IN', temp: { approval: 1 }, risk: { chance: 0.7,
        win: { text: 'Fritagningen går på tolv minuter. Alla gisslan kommer ut oskadda.', idn: { pride: 3 }, rel: 2 },
        lose: { text: 'Fritagningen misslyckas och gruppen flyr med två gisslan. De släpps efter en vecka.', idn: { pride: -3 }, temp: { stability: -2 } } } },
      { text: 'BETALA LÖSEN I HEMLIGHET', cost: { money: 200 }, perm: { corruption: 1 }, rel: -1, tip: 'Alla kommer ut. Gruppen köper fler vapen.' },
    ],
  },
  {
    id: 'idn_amb_katastrof', icon: '\u{1F30A}', weight: 2, cooldown: 900,
    title: 'MEDBORGARE I NÖD UTOMLANDS',
    text: 'En stor flodvåg har slagit mot en kust på andra sidan jorden, där tusentals medborgare från {rike} var på semester. Anhöriga ringer till utrikesministeriet i {huvudstad} men kommer inte fram. Efter flodvågen 2004 kritiserades flera länder för att ha reagerat för sent. Ambassaden på plats har fem anställda.',
    when: (c) => c.idn.embassies >= 50 && c.idn.visaFree > 120 && c.day > 120,
    choices: [
      { text: 'SKICKA PLAN, LÄKARE OCH KONSULER', cost: { money: 120 }, idn: { pride: 3 }, temp: { approval: 3 }, rel: 2, tip: 'Planen är där på ett dygn. Alla som vill hem kommer hem.' },
      { text: 'ÖPPNA EN TELEFONLINJE DYGNET RUNT', cost: { money: 20 }, temp: { approval: 1 }, tip: 'Folk kommer fram. Det hjälper mer än man tror.' },
      { text: 'LÅT FLYGBOLAGEN SKÖTA DET', temp: { approval: -4 }, idn: { pride: -2 }, ind: { trustgov: -3 }, tip: 'De som kommer hem på egen hand minns vem som inte kom.' },
    ],
  },
  {
    id: 'idn_amb_spara', icon: '\u{2702}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'LÄGG NER TIO AMBASSADER',
    text: 'Finansministern har en lista: tio ambassader i små länder som kostar mer än de ger. «Ingen märker om vi stänger i de här länderna», säger han. Utrikesministern säger att man märker det först när något går fel, och att varje stängd ambassad är en dörr som är svår att öppna igen.',
    when: (c) => c.deficit && c.idn.embassies >= 30,
    choices: [
      { text: 'STÄNG DE TIO', res: { money: 40 }, rel: -2, tip: 'Stäng dem i fliken LANDET. Pengarna går till annat.' },
      { text: 'SAMARBETA MED GRANNLÄNDERNA', cost: { pp: 4 }, res: { money: 20 }, rel: 1, tip: 'Delade ambassadhus, som de nordiska länderna i Berlin.' },
      { text: 'BEHÅLL ALLA', temp: { income: -1 }, rel: 1, tip: 'Dörrarna står öppna. Det kostar.' },
    ],
  },
  {
    id: 'idn_amb_stangd', icon: '\u{1F4DE}', weight: 2, cooldown: 900,
    title: 'INGEN AMBASSAD ATT RINGA',
    text: 'En familj från {stad} har blivit bestulen på pass och pengar i ett land där din ambassad nyligen stängdes. Närmaste ambassad ligger i ett annat land, tolv timmars resa bort. Familjen sitter på en flygplats med två små barn, och deras berättelse har blivit en följetong i kvällspressen.',
    when: (c) => c.idn.embassiesD <= -3,
    choices: [
      { text: 'SKICKA EN KONSUL MED NÖDPASS', cost: { money: 10 }, temp: { approval: 1 }, tip: 'Familjen kommer hem dagen efter. Barnen har ritat konsuln.' },
      { text: 'ÖPPNA AMBASSADEN IGEN', cost: { money: 60, pp: 3 }, temp: { approval: 2 }, rel: 1, tip: 'Öppna den i fliken LANDET. Nästa familj har någon att ringa.' },
      { text: 'HÄNVISA TILL GRANNLANDETS AMBASSAD', temp: { approval: -2 }, idn: { pride: -1 }, tip: 'Grannlandet hjälper till, med en lång blankett.' },
    ],
  },
  {
    id: 'idn_amb_invigning', icon: '\u{1F942}', weight: 2, cooldown: 900,
    title: 'DEN NYA AMBASSADEN ÖPPNAR',
    text: 'Din nya ambassad i {ambassadland} invigs i dag. Det är landets första diplomatiska närvaro där, och värdlandets utrikesminister kommer till mottagningen. Lokala företag vill redan veta hur man handlar med {rike}, och en skola vill starta en språkkurs i ditt språk.',
    when: (c) => c.idn.embassies >= 10 && c.idn.embassiesD >= 3,
    choices: [
      { text: 'STOR MOTTAGNING MED LANDETS MAT', cost: { money: 20 }, rel: 3, idn: { recog: 2 }, tip: 'Värdlandets ministrar äter tre portioner. Relationen börjar bra.' },
      { text: 'EN ENKEL INVIGNING', rel: 1, tip: 'Ett band klipps, ett tal hålls, en flagga hissas.' },
      { text: 'BETALA SPRÅKKURSEN', cost: { money: 10 }, rel: 2, idn: { recog: 1 }, tip: 'Trettio elever lär sig ditt språk. Två av dem blir diplomater.' },
    ],
  },
  {
    id: 'idn_amb_parkering', icon: '\u{1F17F}\u{FE0F}', weight: 1, cooldown: 1000,
    title: 'DIPLOMATERNAS PARKERINGSBÖTER',
    text: 'Stadsstyrelsen i {ambassadland} har publicerat en lista över ambassader med obetalda parkeringsböter, och din ambassad ligger trea. Diplomater har immunitet och kan inte tvingas betala, men skulden motsvarar nu en ny bil. Tidningen där har tagit en bild på ambassadens bil parkerad på en busshållplats.',
    when: (c) => c.idn.embassies >= 60 && c.st.corruption > 10,
    choices: [
      { text: 'BETALA ALLA BÖTER', cost: { money: 10 }, rel: 2, perm: { corruption: -1 }, tip: 'Ambassaden kommer ner från listan. Personalen börjar ta tunnelbanan.' },
      { text: 'HÄNVISA TILL IMMUNITETEN', rel: -2, tip: 'Lagligt. Inte populärt.' },
      { text: 'GE AMBASSADEN CYKLAR', cost: { money: 5 }, rel: 1, temp: { qol: 1 }, tip: 'Diplomaterna på cykel blir en lokal sevärdhet.' },
    ],
  },
  {
    id: 'idn_amb_nationaldag', icon: '\u{1F389}', weight: 2, cooldown: 800,
    title: 'NATIONALDAGEN PÅ AMBASSADEN',
    text: 'Din ambassad i {ambassadland} vill fira nationaldagen med en stor fest i trädgården. Tusentals medborgare som bor där vill komma, och värdlandets ministrar har tackat ja. Ambassadören föreslår en orkester, landets mat och fyrverkerier över ambassadens tak, men budgeten räcker bara till smörgåsar.',
    when: (c) => c.idn.embassies >= 15 && c.idn.pride > 50 && c.st.income > 0,
    choices: [
      { text: 'STOR FEST', cost: { money: 15 }, rel: 2, idn: { pride: 2, recog: 1 }, tip: 'Orkestern spelar {sang} och fyrverkerierna lyser upp hela kvarteret.' },
      { text: 'SMÖRGÅSAR RÄCKER', idn: { pride: 1 }, tip: 'Det blir trevligt ändå. Smörgåsarna tar slut först.' },
      { text: 'BJUD IN ALLA I GRANNSKAPET', cost: { money: 10 }, rel: 3, tip: 'Grannarna kommer med egna rätter. Det blir en folkfest.' },
    ],
  },
  {
    id: 'idn_amb_hemkallad', icon: '\u{1F4E8}', weight: 2, cooldown: 900,
    title: 'DE KALLAR HEM SIN AMBASSADÖR',
    text: 'Efter dina senaste lagar har tre länder kallat hem sina ambassadörer från {huvudstad} «för konsultationer». Det är diplomatins sätt att säga att de är mycket missnöjda. Deras ambassader är kvar, men utan chefer. Utrikesministern säger att fler länder kan följa efter om inget ändras.',
    when: (c) => c.idn.embassies >= 20 && c.shame >= 10,
    choices: [
      { text: 'KALLA HEM VÅRA OCKSÅ', idn: { pride: 1 }, rel: -3, tip: 'Det är rättvist. Det är också så kalla krig börjar.' },
      { text: 'BJUD IN DEM TILL SAMTAL', cost: { pp: 6 }, rel: 3, tip: 'Samtalen leder ingenstans, men ambassadörerna kommer tillbaka.' },
      { text: 'LÅT DEM GÅ', rel: -1, temp: { statepower: 1 }, tip: 'Ingen saknar dem på mottagningarna.' },
    ],
  },
  {
    id: 'idn_amb_fa', icon: '\u{1F3DB}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'BARA EN HANDFULL AMBASSADER',
    text: '{rike} har ambassader i bara ett tjugotal länder. När en affärskvinna från {stad} ville göra en stor affär i ett land utan ambassad fick hon ingen hjälp, och kontraktet gick till ett grannlands företag. Exportföretagen säger att varje ambassad betalar sig själv, och utrikesministern håller med.',
    when: (c) => c.idn.embassies < 25,
    choices: [
      { text: 'ÖPPNA NYA AMBASSADER', cost: { money: 60 }, rel: 2, tip: 'Öppna dem i fliken LANDET. En i taget.' },
      { text: 'HANDELSRÅD I STÄLLET FÖR AMBASSADER', cost: { money: 20 }, temp: { gdp: 1 }, tip: 'Små kontor som bara gör affärer. Billigare och nästan lika bra.' },
      { text: 'VI KLARAR OSS', temp: { income: 1 }, rel: -1, tip: 'Pengarna sparas. Affärerna görs av andra.' },
    ],
  },

  // ===== HELGDAGARNA =====
  {
    id: 'idn_helg_strejk', icon: '\u{270A}', weight: 3, cooldown: 600, kind: 'valfard',
    title: 'STREJK FÖR DEN STRUKNA HELGDAGEN',
    text: 'Facken har kallat till den största demonstrationen på årtionden. Över hundratusen människor fyller torget framför riksdagen i {huvudstad} i protest mot att en helgdag strukits. När Danmark strök Store Bededag 2023 för att betala för försvaret var det likadant. Facken hotar med strejk på den dag som tidigare var ledig.',
    when: (c) => c.idn.holidayCut < 60,
    choices: [
      { text: 'GE TILLBAKA HELGDAGEN', cost: { pp: 8 }, temp: { approval: 3, income: -1 }, griev: -10, tip: 'Lägg tillbaka den i fliken LANDET. Facken firar, på den lediga dagen.' },
      { text: 'FÖRHANDLA MED FACKEN', cost: { pp: 4 }, griev: -4, next: 'idn_helg_strejk_avtal', tip: 'Kanske en extra semesterdag i stället. Eller en högre lön.' },
      { text: 'STÅ FAST', temp: { approval: -3, unrest: 2 }, griev: 4, ind: { strikes: 30 }, tip: 'Pengarna behövs. Den strukna dagen blir den mest omtalade arbetsdagen på år.' },
    ],
  },
  {
    id: 'idn_helg_strejk_avtal', icon: '\u{1F91D}', chain: true, kind: 'valfard',
    title: 'AVTALET OM DEN LEDIGA DAGEN',
    text: 'Efter tre veckors förhandlingar har facken ett förslag: helgdagen stryks, men alla får en extra semesterdag att ta när de vill, och arbetsgivarna betalar en halv procent högre lön. Arbetsgivarna säger att det äter upp hela vinsten med reformen. Facken säger att det är deras sista bud.',
    choices: [
      { text: 'GÅ MED PÅ AVTALET', temp: { approval: 2, gdp: -1 }, griev: -6, tip: 'Alla får sin dag, när de vill. Kalendern blir lite friare.' },
      { text: 'BARA SEMESTERDAGEN, INTE LÖNEN', cost: { pp: 4 }, temp: { approval: 1 }, griev: -3, tip: 'Facken skriver under, motvilligt.' },
      { text: 'AVSLÅ', temp: { unrest: 3 }, griev: 5, ind: { strikes: 40 }, tip: 'Strejken blir av. Den kostar mer än en helgdag.' },
    ],
  },
  {
    id: 'idn_helg_kyrkan', icon: '\u{26EA}', weight: 2, cooldown: 900,
    title: 'PRÄSTERNA RINGER I KLOCKORNA',
    text: 'Efter att en helgdag strukits ringer kyrkklockorna i hela landet en kvart klockan tolv, varje dag i en vecka. Biskoparna skriver att dagen var en av få stunder då familjer samlades. Ateisterna håller med om att dagen var skön. Ingen verkar riktigt veta vad dagen handlade om, men alla saknar den.',
    when: (c) => c.idn.holidayCut < 120 && c.st.ideopower > -20,
    choices: [
      { text: 'GE KYRKAN EN SÖNDAG I STÄLLET', cost: { pp: 2 }, temp: { stability: 1 }, tip: 'En söndag med extra gudstjänst. Klockorna tystnar.' },
      { text: 'LYSSNA OCH ÅNGRA DIG', cost: { pp: 6 }, temp: { approval: 2 }, tip: 'Lägg tillbaka helgdagen i fliken LANDET.' },
      { text: 'KLOCKORNA FÅR RINGA', temp: { approval: -1 }, tip: 'Efter en vecka tystnar de. Grannarna till kyrkorna andas ut.' },
    ],
  },
  {
    id: 'idn_helg_bnp', icon: '\u{1F4CA}', weight: 2, cooldown: 1000,
    title: 'VAD GAV DEN EXTRA ARBETSDAGEN',
    text: 'Ekonomerna har räknat på den helgdag som ströks. Statskassan fick ungefär det som utlovades, en tiondels procent av BNP. Men sjukskrivningarna steg lite, och en mätning visar att folk känner sig mer stressade. Oppositionen kallar det «en dag i veckan av mindre lycka». Regeringen kallar det ansvar.',
    when: (c) => c.idn.holidayCut >= 60 && c.idn.holidayCut < 140,
    choices: [
      { text: 'PENGARNA TILL FÖRSVARET SOM UTLOVAT', temp: { readiness: 2 }, tip: 'Pengarna går dit de skulle. Det var löftet.' },
      { text: 'PENGARNA TILL VÅRDEN', temp: { welfare: 1, approval: 1 }, tip: 'Folket gillar det bättre än de trodde.' },
      { text: 'GE TILLBAKA DAGEN', cost: { pp: 6 }, temp: { approval: 2, qol: 1 }, tip: 'Lägg tillbaka den i fliken LANDET. Ekonomerna suckar.' },
    ],
  },
  {
    id: 'idn_helg_ny', icon: '\u{1F4C5}', weight: 2, cooldown: 1000,
    title: 'FOLKET VILL HA EN HELGDAG TILL',
    text: 'Ett medborgarförslag om en ny helgdag har samlat en miljon namn på en månad. Landet har färre lediga dagar än nästan alla grannländer. Arbetsgivarna räknar med att en ny helgdag kostar en tiondels procent av BNP. Förslagsställarna säger att lycka också är en ekonomisk tillgång, och de har en undersökning som visar det.',
    when: (c) => c.idn.holidays < 11 && c.st.qol > -10,
    choices: [
      { text: 'INFÖR EN NY HELGDAG', cost: { pp: 4 }, temp: { approval: 3, qol: 1 }, idn: { pride: 1 }, tip: 'Välj den i fliken LANDET. Den första blir den bäst firade.' },
      { text: 'FLYTTA EN BEFINTLIG TILL EN FREDAG', temp: { approval: 1 }, tip: 'Ingen ny ledig dag, men en lång helg. Det är nästan lika bra.' },
      { text: 'NEJ, LANDET BEHÖVER ARBETA', temp: { approval: -2, gdp: 1 }, tip: 'Miljonen namn får ett brev från statsrådsberedningen.' },
    ],
  },
  {
    id: 'idn_helg_klamdag', icon: '\u{1F309}', weight: 2, cooldown: 800,
    title: 'KLÄMDAGARNA TÖMMER KONTOREN',
    text: 'I maj ligger fyra helgdagar så att den som tar ut två semesterdagar får elva dagar ledigt. Kontoren i {huvudstad} är tomma, fabrikerna går på halvfart och en minister kunde inte hitta någon att hålla en presskonferens med. Arbetsgivarna kallar det månaden då landet stannar.',
    when: (c) => c.idn.holidays >= 15 && c.st.gdp < 20,
    choices: [
      { text: 'FLYTTA EN HELGDAG TILL HÖSTEN', cost: { pp: 4 }, temp: { gdp: 1, approval: -1 }, tip: 'Maj blir lite mer produktiv. November lite mer uthärdlig.' },
      { text: 'LÅT FOLK VILA', temp: { qol: 1 }, ind: { happiness: 0.1 }, tip: 'Det kommer en ny vår. Kontoren klarar sig.' },
      { text: 'STRYK EN HELGDAG', temp: { approval: -3, gdp: 1 }, tip: 'Stryk den i fliken LANDET. Var beredd på protester.' },
    ],
  },
  {
    id: 'idn_helg_for_manga', icon: '\u{1F634}', weight: 2, cooldown: 900,
    title: 'FÖRETAGEN: FÖR MÅNGA LEDIGA DAGAR',
    text: 'Sedan de nya helgdagarna infördes säger industrin att leveranstiderna blivit längre och att utländska kunder börjat titta på andra länder. Turistnäringen och restaurangerna däremot har haft sitt bästa år. Arbetsgivarförbundet vill att regeringen stryker minst en dag. Facket svarar med en bild på en hängmatta.',
    when: (c) => c.idn.holidaysD >= 3,
    choices: [
      { text: 'BEHÅLL DAGARNA', temp: { qol: 1, factory: -1 }, tip: 'Hängmattan vinner.' },
      { text: 'STRYK EN DAG', temp: { approval: -2, factory: 1 }, tip: 'Stryk den i fliken LANDET. Industrin nöjd, facket inte.' },
      { text: 'LÅT FÖRETAGEN BYTA DAGAR MED DE ANSTÄLLDA', cost: { pp: 2 }, temp: { gdp: 1 }, tip: 'Den som vill jobba på helgdagen får ledigt en annan dag.' },
    ],
  },
  {
    id: 'idn_helg_minoritet', icon: '\u{1F54C}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'DE VILL FIRA SIN HÖGTID',
    text: 'En stor religiös minoritet vill att deras viktigaste högtid blir en skoldag utan prov, så att barnen inte behöver välja mellan familjen och skolan. Som i New York, där Diwali blev skollov 2023. Några partier säger att det är en självklarhet, andra att landets helgdagar ska bygga på landets traditioner.',
    when: (c) => c.migRate > 0.5 && c.st.freedom > -20 && c.st.integration > -30,
    choices: [
      { text: 'INGA PROV DEN DAGEN', cost: { pp: 2 }, temp: { integration: 2 }, griev: -2, tip: 'En liten ändring i kalendern. Familjerna märker den.' },
      { text: 'GÖR DEN TILL HELGDAG FÖR ALLA', cost: { pp: 6 }, temp: { integration: 3, approval: -1 }, griev: 3, ind: { xenophobia: 1 }, tip: 'Välj den i fliken LANDET. Alla får en ledig dag till, och några blir arga.' },
      { text: 'LANDETS HELGDAGAR GÄLLER', temp: { integration: -2 }, idn: { pride: 1 }, griev: 2, ind: { segreg: 1 }, tip: 'Barnen får välja. Många väljer familjen.' },
    ],
  },
  {
    id: 'idn_parad_miss', icon: '\u{1F40E}', weight: 2, cooldown: 900,
    title: 'PARADEN SOM GICK SNETT',
    text: 'På nationaldagens parad i {huvudstad} stannade en stridsvagn mitt framför tribunen och vägrade starta igen. Sedan rymde en häst från kavalleriet och sprang in i en glassbutik. Hundratusentals människor såg det i direktsändning, och klippen med hästen har setts av fler än själva paraden.',
    when: (c) => c.idn.pride > 30 && c.st.milpower > 10,
    choices: [
      { text: 'SKRATTA MED FOLKET', temp: { approval: 2 }, idn: { pride: 1 }, tip: 'Hästen blir landets mest kända. Den får en egen staty, i choklad.' },
      { text: 'UTRED STRIDSVAGNEN', cost: { money: 20 }, temp: { readiness: 1 }, tip: 'Felet var en lös kabel. Alla stridsvagnar kontrolleras.' },
      { text: 'FÖRBJUD KLIPPEN', temp: { freedom: -1, approval: -2 }, ind: { pressfree: -1 }, tip: 'Klippen blir ännu populärare. Så brukar det bli.' },
    ],
  },
  {
    id: 'idn_segerdagen', icon: '\u{1F396}\u{FE0F}', weight: 2, cooldown: 800, kind: 'forsvar',
    title: 'SEGERDAGEN',
    text: 'Det har gått ett år sedan segern, och veteranerna vill marschera genom {huvudstad}. Generalerna vill visa upp de nya vapnen, och barnen vill se flygplanen. Fredsrörelsen vill att dagen ägnas åt dem som förlorade allt i kriget, på båda sidor. Ceremonimästaren frågar vilken sorts dag det ska bli.',
    when: (c) => c.idn.wins >= 1 && !c.atWar,
    choices: [
      { text: 'EN STOR MILITÄRPARAD', cost: { money: 60 }, idn: { pride: 4 }, temp: { readiness: 2 }, rel: -2, tip: 'Flygplanen dånar över staden. Grannländerna ser det också.' },
      { text: 'EN MINNESDAG FÖR ALLA SOM LED', idn: { pride: 2 }, temp: { stability: 2 }, rel: 2, tip: 'En tyst minut. Veteraner från båda sidor lägger blommor tillsammans.' },
      { text: 'EN FOLKFEST', cost: { money: 30 }, idn: { pride: 3 }, temp: { approval: 2 }, tip: 'Musik, mat och lekar i parkerna. Veteranerna får gå först.' },
    ],
  },
  {
    id: 'idn_helg_sondag', icon: '\u{1F4C5}', weight: 1, cooldown: 1000, kind: 'valfard',
    title: 'NATIONALDAGEN PÅ EN SÖNDAG',
    text: 'I år infaller nationaldagen och två andra helgdagar på en lördag eller söndag. Facket vill att de flyttas till måndagar, som i Storbritannien och Spanien. Arbetsgivarna säger att en ledig dag är en ledig dag, oavsett vilken veckodag den råkar falla på. Folket har en tydlig åsikt.',
    when: (c) => c.idn.holidays >= 10 && c.st.welfare > 10,
    choices: [
      { text: 'FLYTTA DEM TILL MÅNDAGEN', cost: { pp: 4 }, temp: { approval: 2, gdp: -1 }, griev: -2, tip: 'Långhelger hela året. Folket jublar.' },
      { text: 'SÖNDAG ÄR SÖNDAG', temp: { approval: -1 }, tip: 'Det jämnar ut sig. Nästa år hamnar de på vardagar.' },
      { text: 'BARA NATIONALDAGEN', cost: { pp: 2 }, temp: { approval: 1 }, idn: { pride: 1 }, tip: 'En kompromiss. Nationaldagen blir lite extra speciell.' },
    ],
  },
  {
    id: 'idn_helg_ledare', icon: '\u{1F382}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'ALLA MÅSTE FIRA LEDAREN',
    text: 'Ledarens födelsedag närmar sig, och partiet har bestämt att varje hushåll ska ha en tårta och en bild på ledaren i fönstret. Bagerierna har slut på mjöl och folk köper tårtor på svarta marknaden. En lärare i {stad} glömde bilden i klassrummet och har kallats till förhör. Hon har släppts.',
    when: (c) => c.idn.cult && c.day > 60,
    choices: [
      { text: 'GÖR TÅRTAN FRIVILLIG', cost: { pp: 4 }, temp: { approval: 1, freedom: 1 }, tip: 'Hälften köper tårta ändå. Den var ju god.' },
      { text: 'DELA UT TÅRTOR GRATIS', cost: { money: 40 }, idn: { pride: 1 }, temp: { approval: 2 }, tip: 'Alla får tårta. Bagerierna jobbar hela natten.' },
      { text: 'KONTROLLERA FÖNSTREN', temp: { statepower: 2, unrest: 2, freedom: -2 }, rel: -1, tip: 'Partiets inspektörer går runt med listor. Bilderna sitter i fönstren.' },
    ],
  },
  {
    id: 'idn_helg_fa', icon: '\u{1F62B}', weight: 2, cooldown: 1000, kind: 'valfard',
    title: 'ETT LAND SOM ALDRIG VILAR',
    text: 'Med bara en handfull helgdagar om året har landet färst lediga dagar i hela regionen. En undersökning visar att utbrändheten ökar, och läkarna i {stad} säger att väntrummen är fulla av människor som inte orkar mer. Facken föreslår två nya helgdagar, och de har förslag på vilka.',
    when: (c) => c.idn.holidays <= 8,
    choices: [
      { text: 'INFÖR TVÅ NYA HELGDAGAR', cost: { pp: 6 }, temp: { qol: 2, approval: 2, gdp: -1 }, griev: -4, tip: 'Välj dem i fliken LANDET. Väntrummen blir lite tommare.' },
      { text: 'EN DAG TILL, INTE TVÅ', cost: { pp: 3 }, temp: { qol: 1, approval: 1 }, griev: -2, tip: 'Välj en i fliken LANDET. Facken tar det de får.' },
      { text: 'ARBETE ÄR STOLTHET', temp: { approval: -2, factory: 1 }, griev: 3, tip: 'Fabrikerna går dygnet runt. Det gör inte folket.' },
    ],
  },

  // ===== MONUMENTEN =====
  {
    id: 'idn_monument_rivs', icon: '\u{1F5FF}', weight: 3, cooldown: 700,
    title: 'FOLKMASSAN VID MONUMENTET',
    text: 'Tusentals arga människor har samlats vid {monument} i {huvudstad}. De har rep med sig och en traktor från en bondgård i närheten. Monumentet har blivit en symbol för allt de är trötta på: personkulten, löftena och tårtorna på ledarens födelsedag. Polisen frågar om de ska ingripa.',
    when: (c) => c.idn.cult && c.idn.monuments >= 1 && c.st.unrest > 10,
    choices: [
      { text: 'LÅT DEM RIVA DET', idn: { topple: true, pride: -2 }, temp: { unrest: -5, statepower: -2 }, tip: 'Monumentet faller med ett brak. Folket jublar, och sedan går de hem.' },
      { text: 'FLYTTA DET TILL ETT MUSEUM I NATT', cost: { money: 30 }, idn: { topple: true }, temp: { unrest: -3 }, tip: 'Det försvinner med lastbil före gryningen. Folkmassan hittar en tom sockel.' },
      { text: 'SKYDDA MONUMENTET', cost: { man: 2 }, temp: { statepower: 2, unrest: 4 }, rel: -2, tip: 'Polisen bildar en kedja runt det. Folkmassan blir större för varje timme.' },
    ],
  },
  {
    id: 'idn_monument_omstritt', icon: '\u{1F4DC}', weight: 2, cooldown: 1000,
    title: 'MONUMENTET SOM DELAR LANDET',
    text: 'Historiker har gått igenom arkiven och skriver att {monument} hyllar en period som många familjer minns med sorg. En grupp studenter vill att det tas bort, som när en staty av en slavhandlare i Bristol hamnade i hamnen 2020. Andra säger att man inte ska riva historien utan lära sig av den.',
    when: (c) => c.idn.monuments >= 1 && c.demo >= 6 && c.st.unrest > 0,
    choices: [
      { text: 'SÄTT UPP EN SKYLT MED HELA HISTORIEN', cost: { money: 5 }, temp: { stability: 1 }, tip: 'Monumentet står kvar, med en skylt som berättar allt.' },
      { text: 'FLYTTA DET TILL ETT MUSEUM', cost: { money: 30 }, idn: { topple: true, pride: -1 }, temp: { approval: 1 }, tip: 'Det får en egen sal med historien runt omkring.' },
      { text: 'MONUMENTET STÅR KVAR', idn: { pride: 1 }, temp: { unrest: 1 }, tip: 'Det står kvar. Debatten också.' },
    ],
  },
  {
    id: 'idn_monument_kostnad', icon: '\u{1F3D7}\u{FE0F}', weight: 2, cooldown: 800, kind: 'ekonomi',
    title: 'MONUMENTET BLIR DUBBELT SÅ DYRT',
    text: 'Bygget av det nya monumentet har stött på problem: marken var sankare än väntat, marmorn från utlandet har blivit dyrare och arkitekten vill lägga till en trappa. Kostnaden har fördubblats, och revisorerna undrar varför ingen räknade på marken först. Byggledaren vill ha besked i dag.',
    when: (c) => c.idn.building >= 1,
    choices: [
      { text: 'BETALA, DET SKA BLI RÄTT', cost: { money: 120 }, idn: { pride: 1 }, tip: 'Monumentet blir som det var tänkt. Med trappa.' },
      { text: 'BYGG ENKLARE', cost: { money: 40 }, idn: { pride: -1 }, tip: 'Inhemsk sten i stället för marmor, och ingen trappa.' },
      { text: 'PAUSA BYGGET', temp: { approval: -1 }, idn: { pride: -1 }, tip: 'En byggarbetsplats mitt i staden i ett år till. Duvorna trivs.' },
    ],
  },
  {
    id: 'idn_monument_arkitekt', icon: '\u{1F4D0}', weight: 2, cooldown: 1000,
    title: 'ARKITEKTEN KOPIERADE RITNINGEN',
    text: 'En arkitektstudent har upptäckt att ritningarna till det nya monumentet nästan exakt liknar ett minnesmärke i ett annat land från 1960-talet. Den kände arkitekten säger att det är en «hyllning». Samtidigt visar det sig att hans bolag fick uppdraget utan upphandling, och att han är kusin med en minister.',
    when: (c) => c.idn.building >= 1 && c.st.corruption > 5,
    choices: [
      { text: 'SPARKA ARKITEKTEN OCH UPPHANDLA IGEN', cost: { money: 40, pp: 4 }, perm: { corruption: -1 }, tip: 'Studenten vinner den nya tävlingen. Det blir en bra berättelse.' },
      { text: 'BEHÅLL HONOM, BYGGET ÄR IGÅNG', perm: { corruption: 1 }, temp: { approval: -2 }, tip: 'Monumentet blir klart. Det blir känt som kopian.' },
      { text: 'GE STUDENTEN UPPDRAGET', cost: { money: 20 }, temp: { approval: 2 }, idn: { pride: 1 }, tip: 'En 24-åring ritar nationens monument. Folket älskar det.' },
    ],
  },
  {
    id: 'idn_monument_klotter', icon: '\u{1F3A8}', weight: 2, cooldown: 800,
    title: 'KLOTTER PÅ MONUMENTET',
    text: 'I natt har någon målat stora röda bokstäver på {monument}. Texten är en protest mot regeringen och syns från andra sidan torget. Saneringsfirman säger att färgen har gått in i stenen och att det kan ta veckor att få bort den. Turister tar redan selfies framför klottret.',
    when: (c) => c.idn.monuments >= 1 && c.st.unrest > 5,
    choices: [
      { text: 'TVÄTTA BORT DET', cost: { money: 15 }, idn: { pride: 1 }, tip: 'Det tar tre veckor. Stenen blir renare än den var.' },
      { text: 'LÅT DET VARA EN VECKA', temp: { freedom: 1, approval: -1 }, tip: 'Folk läser protesten. Sedan tvättas den bort.' },
      { text: 'KAMEROR VID ALLA MONUMENT', cost: { money: 30 }, temp: { safety: 1, freedom: -1 }, tip: 'Inget mer klotter. Duvorna filmas dygnet runt.' },
    ],
  },
  {
    id: 'idn_monument_turister', icon: '\u{1F4F8}', weight: 2, cooldown: 900,
    title: 'KÖ TILL MONUMENTET',
    text: 'En känd influencer har filmat sig själv vid {monument} i solnedgången, och sedan dess är kön lång varje kväll. Hotellen i {huvudstad} är fullbokade och kaféerna runt torget har aldrig sålt så mycket. De som bor i kvarteret klagar på buller och på turister som sitter i deras trappor.',
    when: (c) => c.idn.monuments >= 2 && c.st.safety > -10,
    choices: [
      { text: 'ENTRÉAVGIFT FÖR TURISTER', cost: { pp: 2 }, res: { money: 30 }, ind: { tourists: 4 }, tip: 'Pengarna går till underhållet. Kön blir kortare.' },
      { text: 'BYGG ETT BESÖKSCENTER', cost: { money: 60 }, ind: { tourists: 10 }, idn: { recog: 2 }, tip: 'Med kafé, toaletter och en butik. Turisterna sitter i rätt trappor.' },
      { text: 'LÅT DET VARA SOM DET ÄR', ind: { tourists: 6 }, temp: { qol: -1 }, tip: 'Turisterna kommer. Grannarna köper öronproppar.' },
    ],
  },
  {
    id: 'idn_monument_varldsarv', icon: '\u{1F3DB}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'MONUMENTET BLIR VÄRLDSARV',
    text: 'FN:s organisation för kultur har beslutat att {monument} ska bli världsarv. Det är ett av få moderna monument som fått den äran. Turistbyrån räknar med att besökarna fördubblas, men världsarvet kommer med regler: ingenting runt omkring får byggas om utan tillstånd, inte ens den nya busshållplatsen.',
    when: (c) => c.idn.monuments >= 3 && c.idn.recog > 40,
    rare: true,
    choices: [
      { text: 'FIRA MED EN STOR CEREMONI', cost: { money: 30 }, idn: { pride: 4, recog: 4 }, ind: { tourists: 12 }, tip: 'Hela världen ser ceremonin. Busshållplatsen får vänta.' },
      { text: 'TA EMOT ÄRAN I TYSTHET', idn: { pride: 2, recog: 2 }, ind: { tourists: 8 }, tip: 'Ett diplom på väggen. Turisterna hittar dit ändå.' },
    ],
  },
  {
    id: 'idn_okand_soldat', icon: '\u{1F525}', weight: 2, cooldown: 900, kind: 'forsvar',
    title: 'VID DEN OKÄNDE SOLDATENS GRAV',
    text: 'En utländsk statschef är på besök och vill lägga en krans vid den okände soldatens grav, där elden brinner dygnet runt. Hennes land var på andra sidan i kriget. Veteranförbundet är splittrat: några säger att det är ett tecken på försoning, andra att det är för tidigt. Ceremonin är i morgon.',
    when: (c) => c.idn.hasMonument('okand'),
    choices: [
      { text: 'STÅ BREDVID HENNE VID GRAVEN', cost: { pp: 4 }, rel: 4, idn: { pride: 1 }, temp: { stability: 1 }, tip: 'Två ledare, en tyst minut. Bilden hamnar i historieböckerna.' },
      { text: 'LÅT HENNE GÅ DIT ENSAM', rel: 2, tip: 'Hon lägger kransen själv. Det betyder något ändå.' },
      { text: 'SÄG ATT DET ÄR FÖR TIDIGT', idn: { pride: 1 }, rel: -3, tip: 'Besöket fortsätter utan graven. Hon besöker ett museum i stället.' },
    ],
  },
  {
    id: 'idn_monument_selfie', icon: '\u{1F933}', weight: 2, cooldown: 900,
    title: 'DANSVIDEON PÅ MINNESMÄRKET',
    text: 'Två unga turister har filmat en dansvideo på minnesmärket över de stupade och lagt upp den med en glad låt. Den har fått miljontals visningar, och veteranerna är rasande. Turisterna har bett om ursäkt och säger att de inte förstod vad platsen var. Det fanns ingen skylt på deras språk.',
    when: (c) => c.idn.hasMonument('krigsminne') || c.idn.hasMonument('offer') || c.idn.hasMonument('okand'),
    choices: [
      { text: 'SKYLTAR PÅ TIO SPRÅK', cost: { money: 5 }, idn: { pride: 1 }, tip: 'Nu vet alla vad platsen är. De flesta blir tysta av sig själva.' },
      { text: 'BÖTER FÖR RESPEKTLÖSHET', cost: { pp: 2 }, temp: { freedom: -1 }, idn: { pride: 1 }, tip: 'Böter för dans. Det fungerar, men det blir en egen dansvideo om det.' },
      { text: 'BJUD IN DEM TILL EN GUIDNING', temp: { approval: 1 }, rel: 1, tip: 'De kommer tillbaka och gör en ny film. Den här gången om historien.' },
    ],
  },
  {
    id: 'idn_monument_nasa', icon: '\u{1F44C}', weight: 1, cooldown: 1200,
    title: 'STATYNS BLANKA NÄSA',
    text: 'Någon på nätet skrev att den som klappar näsan på en av figurerna vid {monument} får tur i kärlek. Nu står turister i kö för att klappa den, och näsan har blivit blank och guldglänsande medan resten är mörk. Konservatorerna säger att den nöts bort. Som Julias staty i Verona, som fick bytas ut 2014.',
    when: (c) => c.idn.monuments >= 1 && c.st.qol > 0,
    choices: [
      { text: 'SÄTT UPP ETT STAKET', cost: { money: 5 }, temp: { approval: -1 }, tip: 'Näsan räddas. Turisterna klappar staketet i stället.' },
      { text: 'GÖR EN KOPIA SOM FÅR KLAPPAS', cost: { money: 15 }, ind: { tourists: 4 }, tip: 'En kopia vid sidan av. Den nöts också, men den kan bytas.' },
      { text: 'LÅT DEM KLAPPA', ind: { tourists: 5 }, temp: { qol: 1 }, tip: 'Näsan glänser. Det har blivit stadens symbol.' },
    ],
  },
  {
    id: 'idn_monument_jattestaty', icon: '\u{1F5FF}', weight: 2, cooldown: 1100, kind: 'ekonomi',
    title: 'VÄRLDENS STÖRSTA STATY AV LEDAREN',
    text: 'Partiets kommitté har ritat en staty av ledaren som ska bli högre än alla i världen, av förgyllt stål och med en arm som pekar mot framtiden. Den ska vrida sig efter solen, som en staty i Asjchabad gjorde i flera år. Ekonomerna säger att den kostar lika mycket som tjugo sjukhus.',
    when: (c) => c.idn.cult && c.st.statepower > 10,
    choices: [
      { text: 'BYGG DEN', cost: { money: 300 }, idn: { pride: 2 }, temp: { statepower: 3, approval: -2 }, rel: -2, tip: 'Den syns från rymden, säger partiet. Det gör den inte.' },
      { text: 'EN MINDRE STATY OCH TVÅ SJUKHUS', cost: { money: 120 }, temp: { welfare: 1, approval: 2 }, tip: 'Statyn blir lagom stor. Sjukhusen blir fulla av folk som tackar.' },
      { text: 'INGEN STATY', temp: { approval: 1, statepower: -1 }, tip: 'Kommittén ritar något annat. En fontän, kanske.' },
    ],
  },
  {
    id: 'idn_mausoleum_ko', icon: '\u{26B1}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'KÖN TILL MAUSOLEET',
    text: 'Mausoleet i {huvudstad} har öppet tre timmar om dagen, och kön är en kilometer lång. Skolklasser åker dit från hela landet, och vakterna ser till att ingen pratar högt. Underhållet kostar mer varje år, och en ung minister har föreslagit att öppettiderna halveras för att spara pengar.',
    when: (c) => c.idn.hasMonument('mausoleum'),
    choices: [
      { text: 'LÄNGRE ÖPPETTIDER', cost: { money: 20 }, idn: { pride: 2 }, temp: { ideopower: 1 }, tip: 'Kön blir kortare. Vakterna jobbar dubbelt.' },
      { text: 'HALVERA ÖPPETTIDERNA', res: { money: 10 }, temp: { ideopower: -1 }, tip: 'Kön blir dubbelt så lång. Ministern får ett samtal.' },
      { text: 'GÖR DET TILL ETT MUSEUM OM HISTORIEN', cost: { money: 40 }, temp: { freedom: 1, ideopower: -2 }, tip: 'Hela historien berättas, även de svåra delarna.' },
    ],
  },
  {
    id: 'idn_triumfbagen', icon: '\u{1F3DB}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'TRAFIKEN RUNT TRIUMFBÅGEN',
    text: 'Triumfbågen i {huvudstad} står mitt i en rondell med tolv filer, och varje dag krockar ett tiotal bilar när förarna tittar upp på den. Försäkringsbolagen har räknat ut att det är landets farligaste plats för plåtskador. Turisterna springer över gatan för att ta bilder, och polisen har gett upp.',
    when: (c) => c.idn.hasMonument('triumf'),
    choices: [
      { text: 'EN TUNNEL TILL TRIUMFBÅGEN', cost: { money: 80 }, perm: { safety: 1 }, ind: { tourists: 4 }, tip: 'Turisterna går under gatan. Förarna tittar på vägen.' },
      { text: 'GÅGATA RUNT BÅGEN', cost: { money: 40, pp: 4 }, temp: { qol: 1, approval: -1 }, tip: 'Bilisterna är arga. Alla andra fikar i solen.' },
      { text: 'DET ÄR EN DEL AV CHARMEN', temp: { safety: -1 }, idn: { recog: 1 }, tip: 'Rondellen blir världsberömd. Inte för det man hoppades.' },
    ],
  },
  {
    id: 'idn_monument_gava', icon: '\u{1F381}', weight: 2, cooldown: 1100,
    title: 'EN STATY SOM GÅVA',
    text: 'Folket i {ambassadland} vill ge {rike} en staty i present, som när Frankrike gav Frihetsgudinnan till USA 1886. Den föreställer två händer som möts och är nio meter hög. Den kommer i delar med båt. Frågan är bara var den ska stå: i {huvudstad}, i en hamnstad eller vid gränsen.',
    when: (c) => c.idn.embassies >= 30 && c.idn.monuments <= 1 && c.demo >= 6,
    choices: [
      { text: 'MITT I HUVUDSTADEN', cost: { money: 20 }, rel: 4, idn: { pride: 2, recog: 1 }, tip: 'Den syns från hela centrum. Givarna kommer till invigningen.' },
      { text: 'I HAMNEN DÄR BÅTARNA KOMMER IN', cost: { money: 15 }, rel: 3, ind: { tourists: 5 }, tip: 'Den hälsar alla som kommer sjövägen. Precis som förebilden.' },
      { text: 'TACKA NEJ ARTIGT', rel: -2, tip: 'Statyn hamnar i ett annat land. Där blir den mycket omtyckt.' },
    ],
  },
  {
    id: 'idn_forsoning', icon: '\u{1F54A}\u{FE0F}', weight: 1, cooldown: 1100,
    title: 'FÖRSONINGEN VID MONUMENTET',
    text: 'Vid försoningsmonumentet har familjer från båda sidor av den gamla konflikten mötts för första gången. De har lagat mat tillsammans, och barnen har spelat fotboll på gräsmattan. En historiker säger att det är så här en nation läker: inte genom tal, utan genom middagar. Arrangörerna vill göra det varje år.',
    when: (c) => c.idn.hasMonument('forsoning'),
    choices: [
      { text: 'GÖR DET TILL EN ÅRLIG DAG', cost: { money: 10 }, temp: { stability: 2, unrest: -2 }, idn: { pride: 1 }, tip: 'Försoningens middag blir en tradition.' },
      { text: 'LÅT DET VARA FOLKETS INITIATIV', temp: { stability: 1 }, tip: 'Det fortsätter av sig självt. Det är bäst så.' },
    ],
  },
  {
    id: 'idn_monument_flytta', icon: '\u{1F68B}', weight: 2, cooldown: 1000,
    title: 'SPÅRVAGNEN OCH MONUMENTET',
    text: 'Den nya spårvägen i {huvudstad} måste dras rakt igenom platsen där {monument} står. Planerarna vill flytta monumentet tvåhundra meter, vilket kostar mycket och tar ett år. Alternativet är en omväg som gör hela linjen tio minuter långsammare. Stadens invånare har två starka åsikter.',
    when: (c) => c.idn.monuments >= 1 && c.st.gdp > 0 && c.day > 150,
    choices: [
      { text: 'FLYTTA MONUMENTET', cost: { money: 60 }, temp: { qol: 1 }, tip: 'Det flyttas sten för sten. Den nya platsen är faktiskt finare.' },
      { text: 'DRA SPÅRVAGNEN RUNT', temp: { qol: -1 }, idn: { pride: 1 }, tip: 'Tio minuter längre. Monumentet står där det alltid stått.' },
      { text: 'EN HÅLLPLATS VID MONUMENTET', cost: { money: 20 }, ind: { tourists: 3 }, tip: 'Spårvagnen stannar precis framför. Turisterna älskar det.' },
    ],
  },
  {
    id: 'idn_monument_tavling', icon: '\u{1F986}', weight: 1, cooldown: 1100,
    title: 'FÖRSLAGET MED GUMMIANKAN',
    text: 'Staten bad folket föreslå hur det nya monumentet ska se ut. Det mest populära förslaget är en tolv meter hög gummianka i flaggans färger, och det har fått tre gånger fler röster än tvåa. Arkitekterna är förfärade. Initiativtagaren säger att ankan står för glädje, och att landet behöver mer av den saken.',
    when: (c) => c.idn.building >= 1 && c.demo >= 4,
    choices: [
      { text: 'BYGG ANKAN BREDVID', cost: { money: 30 }, temp: { approval: 2, qol: 1 }, ind: { tourists: 6 }, tip: 'Den blir landets mest fotograferade sak. Arkitekterna tittar bort.' },
      { text: 'HÅLL FAST VID RITNINGEN', temp: { approval: -1 }, tip: 'Monumentet blir som tänkt. Ankan säljs som leksak i stället.' },
      { text: 'ANKAN BLIR BARNENS LEKPLATS', cost: { money: 15 }, temp: { qol: 1 }, tip: 'En anka att klättra i. Barnen i {stad} har aldrig varit gladare.' },
    ],
  },

  // ===== ORDNARNA =====
  {
    id: 'idn_orden_kopta', icon: '\u{1F4B0}', weight: 3, cooldown: 600, kind: 'ekonomi',
    title: 'ORDNAR MOT PENGAR',
    text: 'En tidning har avslöjat att flera rika affärsmän fått {orden} efter stora gåvor till partiet. Det finns mejl där en rådgivare skriver att «ett kors kostar fem miljoner». Som i Storbritannien 2006, när polisen förhörde premiärministern om hedersutmärkelser mot lån. Riktiga mottagare, sjuksköterskor och forskare, skäms nu över sina ordnar.',
    when: (c) => c.idn.soldHonours >= 1 && c.idn.orders >= 1,
    choices: [
      { text: 'SLUTA SÄLJA OCH BE OM URSÄKT', cost: { pp: 8 }, idn: { prestige: 10 }, perm: { corruption: -1 }, temp: { approval: -2 }, tip: 'Det svider. Men ordnarna börjar betyda något igen.' },
      { text: 'LÅT POLISEN UTREDA', cost: { pp: 4 }, perm: { corruption: -2 }, idn: { prestige: 5 }, next: 'idn_orden_kopta_dom', tip: 'Polisen förhör rådgivarna. En av dem har sparat allt.' },
      { text: 'DET VAR GÅVOR, INTE KÖP', perm: { corruption: 2 }, idn: { prestige: -15 }, ind: { trustgov: -3 }, tip: 'Ingen tror på det. Ordnarna blir ett skämt.' },
    ],
  },
  {
    id: 'idn_orden_kopta_dom', icon: '\u{2696}\u{FE0F}', chain: true,
    title: 'DOMEN I ORDENSMÅLET',
    text: 'Domstolen har dömt två rådgivare för att ha sålt {orden} mot pengar. Affärsmännen som köpte ordnarna friades, men domaren skrev att de «borde ha förstått». Tidningarna kräver att alla köpta ordnar dras in. Några av affärsmännen har redan skickat tillbaka sina kors med posten.',
    choices: [
      { text: 'DRA IN ALLA KÖPTA ORDNAR', cost: { pp: 4 }, idn: { prestige: 15 }, perm: { corruption: -1 }, tip: 'Korsen samlas in. De riktiga mottagarna känner sig hedrade igen.' },
      { text: 'LÅT DEM BEHÅLLA DEM', idn: { prestige: -8 }, temp: { approval: -1 }, tip: 'Saken är avslutad, säger du. Folket håller inte med.' },
    ],
  },
  {
    id: 'idn_orden_nej_tack', icon: '\u{1F645}', weight: 2, cooldown: 1000,
    title: 'HON TACKADE NEJ TILL ORDEN',
    text: 'Landets mest kända tonsättare har tackat nej till {orden}. «Musik ska inte ha medaljer», skriver hon i ett kort brev som publicerats i alla tidningar. Hon är inte den första: filosofer, rockstjärnor och författare har tackat nej till utmärkelser förut. Nu undrar journalisterna om fler kommer att följa efter.',
    when: (c) => c.idn.orders >= 1 && c.idn.awards >= 1,
    choices: [
      { text: 'RESPEKTERA HENNES BESLUT', temp: { freedom: 1 }, idn: { prestige: 2 }, tip: 'Ett nej som respekteras gör ett ja värt mer.' },
      { text: 'GE HENNE EN KONSERT I STÄLLET', cost: { money: 15 }, temp: { qol: 1, approval: 1 }, tip: 'Hon tackar ja till konserten. Den är slutsåld på en timme.' },
      { text: 'KALLA HENNE OTACKSAM', idn: { prestige: -3 }, temp: { approval: -2 }, tip: 'Hennes skivor säljer som aldrig förr.' },
    ],
  },
  {
    id: 'idn_orden_indragen', icon: '\u{1F4C9}', weight: 2, cooldown: 1000,
    title: 'HAN HAR FORTFARANDE SIN ORDEN',
    text: 'En bankdirektör som fick {orden} för tre år sedan har dömts för att ha lurat tusentals pensionärer på deras sparpengar. Han bär fortfarande korset på bilder från rättegången. Pensionärerna kräver att utmärkelsen dras in, men ordensstadgarna säger ingenting om vad som händer när en mottagare döms.',
    when: (c) => c.idn.orders >= 1 && c.st.corruption > 5,
    choices: [
      { text: 'DRA IN ORDEN', cost: { pp: 2 }, idn: { prestige: 6 }, temp: { approval: 2 }, tip: 'Korset ska lämnas tillbaka inom en månad. Det kommer i ett vadderat kuvert.' },
      { text: 'SKRIV NYA STADGAR FÖR FRAMTIDEN', cost: { pp: 4 }, idn: { prestige: 4 }, perm: { corruption: -1 }, tip: 'Den som döms förlorar sin orden. Det gäller från och med nu.' },
      { text: 'EN ORDEN ÄR EN ORDEN', idn: { prestige: -6 }, temp: { approval: -2 }, tip: 'Han behåller korset. Pensionärerna behåller sin ilska.' },
    ],
  },
  {
    id: 'idn_orden_diktator', icon: '\u{1F935}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'ORDEN TILL EN DIKTATOR',
    text: 'Utrikesministeriet vill ge {orden} till en besökande ledare från ett land med hårt styre och stora gasfyndigheter. «Det öppnar dörrar för våra företag», säger ministern. Människorättsgrupper påminner om hans fångläger. Flera tidigare mottagare säger att de lämnar tillbaka sina ordnar om han får den.',
    when: (c) => c.idn.orders >= 1 && c.demo >= 6,
    choices: [
      { text: 'GE HONOM ORDEN', idn: { prestige: -12 }, temp: { gdp: 1, approval: -2 }, rel: 1, tip: 'Gasavtalet skrivs under. Tre tidigare mottagare skickar tillbaka sina kors.' },
      { text: 'EN MIDDAG, MEN INGEN ORDEN', rel: -1, idn: { prestige: 3 }, tip: 'Han får god mat och en handskakning. Avtalet blir mindre.' },
      { text: 'TACKA NEJ TILL BESÖKET', rel: -3, temp: { freedom: 1 }, idn: { prestige: 4 }, tip: 'Han åker till ett annat land och får en annan orden.' },
    ],
  },
  {
    id: 'idn_orden_godis', icon: '\u{1F36C}', weight: 2, cooldown: 900,
    title: 'ORDNAR SOM GODIS',
    text: 'En granskning visar att {orden} delats ut till hundratals personer det senaste året, bland annat till en minister för att hon kom i tid till ett möte och till en hel kontorsavdelning på en gång. «Ordnarna delas ut som godis», skriver en krönikör. Den som verkligen förtjänar en undrar om det är värt något längre.',
    when: (c) => c.idn.orders >= 1 && c.idn.prestige < 40,
    choices: [
      { text: 'HÖGST TIO OM ÅRET', cost: { pp: 4 }, idn: { prestige: 15 }, tip: 'Färre ordnar, var och en värd mer.' },
      { text: 'EN NÄMND SOM PRÖVAR VARJE NAMN', cost: { pp: 6 }, idn: { prestige: 20 }, perm: { corruption: -1 }, tip: 'Ministrarna får inte längre välja själva. Det svider i kabinettet.' },
      { text: 'ALLA ÄR VÄRDA EN ORDEN', idn: { prestige: -5 }, temp: { approval: 1 }, tip: 'Fler glada mottagare. Korset blir en vanlig sak i byrålådan.' },
    ],
  },
  {
    id: 'idn_orden_hjaltar', icon: '\u{1F9B8}', weight: 2, cooldown: 900,
    title: 'HJÄLTARNA PÅ SLOTTET',
    text: 'I dag får en barnmorska, en brandman och en lärare från en liten by {orden} på en ceremoni i {huvudstad}. Barnmorskan har tagit emot fyratusen barn, brandmannen räddade en hel skolklass ur en buss som fastnat i snön och läraren har undervisat i samma klassrum i fyrtio år. Hela landet ser ceremonin.',
    when: (c) => c.idn.orders >= 1 && c.idn.awards >= 2 && c.idn.prestige > 60,
    choices: [
      { text: 'HÅLL ETT TAL OM VARDAGENS HJÄLTAR', idn: { pride: 3, prestige: 3 }, temp: { approval: 2 }, tip: 'Talet handlar inte om dig. Det är därför det blir bra.' },
      { text: 'BJUD IN HELA BYN', cost: { money: 10 }, idn: { pride: 2 }, temp: { qol: 1 }, tip: 'Två bussar med byborna kommer till slottet. De har med sig kakor.' },
      { text: 'GE DEM ETT STIPENDIUM OCKSÅ', cost: { money: 20 }, idn: { pride: 2 }, perm: { welfare: 1 }, tip: 'Pengar till byns skola, brandstation och förlossning.' },
    ],
  },
  {
    id: 'idn_orden_stold', icon: '\u{1F48E}', weight: 1, cooldown: 1100,
    title: 'ORDENSKEDJAN ÄR STULEN',
    text: 'I natt bröt sig tjuvar in på museet i {huvudstad} och stal den första ordenskedjan i {orden}, av guld och emalj med tolv ädelstenar. Larmet var avstängt för service. Polisen tror att kedjan beställts av en samlare utomlands, och museichefen har inte sovit sedan dess.',
    when: (c) => c.idn.orders >= 1 && c.crimeRise > 1.1,
    choices: [
      { text: 'SÄTT IN DE BÄSTA SPANARNA', cost: { money: 20 }, risk: { chance: 0.5,
        win: { text: 'Kedjan hittas i en bil på väg mot gränsen. Den är oskadd.', idn: { pride: 2, prestige: 3 } },
        lose: { text: 'Kedjan är borta. Museet visar en tom monter med en skylt.', idn: { prestige: -3 } } } },
      { text: 'UTLYS EN BELÖNING', cost: { money: 30 }, idn: { prestige: 2 }, tip: 'Ett anonymt tips leder till ett förråd i {stad}. Kedjan ligger i en skokartong.' },
      { text: 'GÖR EN KOPIA', idn: { prestige: -2 }, tip: 'Ingen ser skillnaden. Utom de som vet.' },
    ],
  },
  {
    id: 'idn_orden_veteraner', icon: '\u{1F396}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'forsvar',
    title: 'VETERANERNA VILL HA EN MEDALJ',
    text: 'Veteranerna från det senaste kriget har uppvaktat regeringen. De säger att de aldrig fått något erkännande, bara ett tack i ett tal. De vill ha en medalj, en dag och en plats där deras kamrater minns. Några av dem har haft svårt att komma tillbaka till vardagen, och det har ingen pratat om.',
    when: (c) => (c.idn.wins + c.idn.losses) >= 1 && c.idn.orders >= 1,
    choices: [
      { text: 'EN MEDALJ OCH STÖD FÖR VETERANERNA', cost: { money: 40 }, idn: { pride: 2, prestige: 2 }, temp: { readiness: 2 }, perm: { welfare: 1 }, tip: 'Medaljen delas ut på torget. Stödet når dem som behöver det mest.' },
      { text: 'BARA MEDALJEN', idn: { pride: 1 }, temp: { readiness: 1 }, tip: 'En medalj på bröstet. Ett samtal som inte blev av.' },
      { text: 'INTE NU', idn: { pride: -2 }, temp: { readiness: -2 }, tip: 'Veteranerna går hem. De glömmer inte.' },
    ],
  },
  {
    id: 'idn_orden_eftertraktad', icon: '\u{1F451}', weight: 1, cooldown: 1100,
    title: 'ALLA VILL HA ORDEN',
    text: '{orden} har blivit en av de mest eftertraktade utmärkelserna i världen. Den delas ut sällan och bara för verkliga insatser. Nu har en känd utländsk prins låtit förstå att han gärna skulle ta emot den, och två stora företag erbjuder sig att sponsra ceremonin. Ordenskanslern säger att det är just därför man ska vara försiktig.',
    when: (c) => c.idn.orders >= 1 && c.idn.prestige > 85,
    choices: [
      { text: 'INTE TILL SALU, INTE TILL PRINSAR', idn: { prestige: 5, pride: 1 }, tip: 'Prinsen får ett artigt brev. Ordens rykte växer.' },
      { text: 'GE PRINSEN ORDEN', idn: { prestige: -5 }, rel: 3, tip: 'Relationen till hans land blir bättre. Ordenskanslern suckar.' },
      { text: 'TA SPONSORPENGARNA TILL ETT STIPENDIUM', res: { money: 30 }, idn: { prestige: -3 }, tip: 'Ett stipendium i ordens namn, med företagens loggor. Lite mindre fint.' },
    ],
  },

  // ===== SEDLARNA =====
  {
    id: 'idn_sedlar_falska', icon: '\u{1F4B5}', weight: 2, cooldown: 900, kind: 'ekonomi',
    title: 'FALSKA SEDLAR I OMLOPP',
    text: 'Butiker i {stad} har börjat vägra ta emot de största sedlarna i {valuta}. Centralbanken har hittat tusentals falska sedlar, så bra gjorda att de klarar de flesta kontroller. En liten bagare har fått tre falska sedlar på en vecka och förlorat en hel dagskassa. Folk har börjat hålla upp varje sedel mot ljuset.',
    when: (c) => c.st.corruption > 10 && c.res('computing') < 3 && c.day > 90,
    choices: [
      { text: 'EN NY SEDELSERIE MED HOLOGRAM', cost: { money: 120 }, perm: { safety: 1 }, ind: { fraud: -6 }, tip: 'Hologram, säkerhetstråd och ett osynligt mönster. Förfalskarna får börja om.' },
      { text: 'DRA IN DEN STÖRSTA SEDELN', temp: { approval: -1 }, ind: { fraud: -3 }, tip: 'Folk får byta på banken i tre månader. Köerna blir långa.' },
      { text: 'SLÅ TILL MOT TRYCKERIET', cost: { pp: 6 }, perm: { corruption: -1 }, risk: { chance: 0.6,
        win: { text: 'Polisen hittar tryckeriet i en lada. Pressarna stängs.', ind: { fraud: -8 } },
        lose: { text: 'Tryckeriet har flyttat. De falska sedlarna fortsätter komma.', temp: { approval: -1 } } } },
    ],
  },
  {
    id: 'idn_sedlar_ledare_demokrati', icon: '\u{1F935}', weight: 3, cooldown: 700, kind: 'frihet',
    title: 'LEDAREN PÅ SEDLARNA',
    text: 'De nya sedlarna med ledarens porträtt har nått plånböckerna, och reaktionen är kraftig. «Det gör man i diktaturer», skriver en ledarsida. Oppositionen har lagt fram ett förslag om att förbjuda levande personer på sedlarna, och en konstnär har ritat mustasch på tusen sedlar och delat ut dem på torget i {huvudstad}.',
    when: (c) => c.idn.notes === 'leader' && c.demo >= 5,
    choices: [
      { text: 'BYT TILL NATIONENS STORA', cost: { money: 40 }, temp: { approval: 3 }, tip: 'Välj sedlarnas motiv i fliken LANDET. Konstnärer och forskare i stället.' },
      { text: 'DET ÄR EN HEDER, INTE EN KULT', temp: { approval: -3 }, idn: { pride: -1 }, griev: 4, tip: 'Mustascherna blir fler. Den första blir ett samlarobjekt.' },
      { text: 'ÅTALA KONSTNÄREN', cost: { pp: 4 }, temp: { freedom: -2, approval: -3 }, griev: 6, ind: { pressfree: -1 }, tip: 'Rättegången blir den roligaste i landets historia. För alla utom dig.' },
    ],
  },
  {
    id: 'idn_sedlar_ledare_vikt', icon: '\u{1F4B4}', weight: 2, cooldown: 1000,
    title: 'DET VIKTA ANSIKTET',
    text: 'Folk har kommit på att om man viker sedeln med ledarens porträtt på ett visst sätt ser han ut som en grisunge. Tricket sprids från hand till hand på marknaderna, och barnen i {stad} viker sedlar i skolan. I Kanada gjorde folk samma sak med en gammal sedel. Polisen frågar om vikta sedlar ska räknas som skändning.',
    when: (c) => c.idn.notes === 'leader' && c.demo < 5,
    choices: [
      { text: 'SKRATTA ÅT DET', temp: { approval: 2, statepower: -1 }, tip: 'Ledaren viker själv en sedel på tv. Grisen blir hans maskot.' },
      { text: 'FÖRBJUD VIKTA SEDLAR', temp: { statepower: 2, approval: -2 }, griev: 3, tip: 'Alla sedlar blir lite vikta ändå. Det är så pengar fungerar.' },
      { text: 'TRYCK OM SEDLARNA', cost: { money: 60 }, tip: 'Ett nytt porträtt som inte går att vika till en gris. Folk letar efter ett nytt djur.' },
    ],
  },
  {
    id: 'idn_sedlar_tavling', icon: '\u{1F3A8}', weight: 2, cooldown: 1100,
    title: 'VEM SKA PÅ DEN NYA SEDELN',
    text: 'Centralbanken ska ta fram en ny sedel och låter folket föreslå vem eller vad som ska vara med. Förslagen har strömmat in: en uppfinnare av ett känt kexrecept, en olympisk simmerska, nationaldjuret och en ko som en gång rymde och simmade över en fjord. Kon leder i omröstningen.',
    when: (c) => (c.idn.notes === 'heroes' || c.idn.notes === 'nature') && c.st.qol > 0,
    choices: [
      { text: 'LÅT KON VINNA', cost: { money: 20 }, idn: { pride: 2 }, temp: { approval: 2 }, tip: 'Sedeln med kon blir världens mest omtyckta. Turister tar den med hem.' },
      { text: 'SIMMERSKAN', cost: { money: 20 }, idn: { pride: 2 }, temp: { qol: 1 }, tip: 'Hon kommer till lanseringen med sina medaljer. Kon får ett frimärke.' },
      { text: 'JURYN AVGÖR', idn: { pride: 1 }, tip: 'Juryn väljer en bro. Den är vacker, men ingen ko.' },
    ],
  },
  {
    id: 'idn_kontantlost', icon: '\u{1F4B3}', weight: 2, cooldown: 1100, kind: 'ekonomi',
    title: 'ETT LAND UTAN KONTANTER',
    text: 'Nästan ingen betalar längre med sedlar och mynt. Bankerna vill sluta hantera kontanter helt, som i Sverige där bara var tionde köp görs med kontanter. Men pensionärer, turister och de som saknar bankkonto står utan. Försvaret varnar för att ett strömavbrott kan göra hela landet oförmöget att handla.',
    when: (c) => (c.ind.gdppc ?? 10000) > 30000 && c.res('computing') >= 3,
    choices: [
      { text: 'KRÄV ATT BUTIKER TAR KONTANTER', cost: { pp: 4 }, temp: { approval: 1 }, perm: { safety: 1 }, tip: 'Mjölk och bröd ska alltid gå att köpa med sedlar.' },
      { text: 'LÅT KONTANTERNA FÖRSVINNA', temp: { gdp: 1, approval: -2 }, ind: { fraud: 3 }, tip: 'Snabbt och billigt. Bedragarna flyttar till nätet.' },
      { text: 'EN STATLIG DIGITAL {VALUTA}', cost: { money: 80 }, temp: { research: 1 }, perm: { corruption: -1 }, tip: 'Centralbankens egna pengar i telefonen. Ett tiotal länder provar samma sak.' },
    ],
  },
  {
    id: 'idn_sedlar_hjalte', icon: '\u{1F4DA}', weight: 2, cooldown: 1100,
    title: 'HJÄLTEN PÅ SEDELN HADE EN SKUGGSIDA',
    text: 'En ny biografi visar att uppfinnaren på den största sedeln tjänade sina första pengar på att sälja vapen till båda sidor i ett krig. Historiker säger att det var välkänt bland forskare men inte bland folk. Nu kräver en grupp ungdomar att han byts ut, och hans barnbarnsbarn försvarar honom i morgon-tv.',
    when: (c) => c.idn.notes === 'heroes' && c.demo >= 6,
    choices: [
      { text: 'BYT UT HONOM VID NÄSTA SERIE', cost: { money: 20 }, temp: { approval: 1 }, tip: 'Han finns kvar tills de gamla sedlarna slits ut. Sedan någon annan.' },
      { text: 'BEHÅLL HONOM, HISTORIEN ÄR KOMPLICERAD', temp: { stability: 1 }, tip: 'Biografin säljer bra. Sedeln också.' },
      { text: 'EN UTSTÄLLNING OM HELA HANS LIV', cost: { money: 15 }, temp: { qol: 1 }, idn: { pride: 1 }, tip: 'Nationalmuseet visar allt. Det blir den mest besökta utställningen på åratal.' },
    ],
  },
  {
    id: 'idn_sedlar_monark', icon: '\u{1F451}', weight: 2, cooldown: 1100,
    title: 'DEN NYA MONARKEN PÅ SEDLARNA',
    text: 'Den gamla monarken har abdikerat efter femtio år, och nu ska alla sedlar och mynt bytas. Som när Storbritannien bytte efter drottning Elizabeth 2022 tar det flera år. Centralbanken undrar om den nya monarken ska avbildas från vänster eller höger, vilket är en gammal tradition, och om de gamla sedlarna får gälla så länge.',
    when: (c) => c.idn.notes === 'monarch' && c.day > 120,
    choices: [
      { text: 'BYT ALLA SEDLAR PÅ ETT ÅR', cost: { money: 80 }, idn: { pride: 2 }, temp: { stability: 1 }, tip: 'De nya sedlarna kommer snabbt. Samlarna köper upp de gamla.' },
      { text: 'LÅT DE GAMLA GÄLLA TILLS DE ÄR SLITNA', idn: { pride: 1 }, tip: 'Båda monarkerna i plånboken samtidigt. Folk tycker det är fint.' },
      { text: 'BYT TILL NATUREN I STÄLLET', cost: { money: 40 }, temp: { approval: -1, stability: -1 }, tip: 'Republikanerna jublar. Kungahuset är tyst.' },
    ],
  },

  // ===== FRIMÄRKENA =====
  {
    id: 'idn_frimarke_feltryck', icon: '\u{2708}\u{FE0F}', weight: 3, cooldown: 600,
    title: 'FRIMÄRKET SOM BLEV FEL',
    text: 'Ett ark med hundra frimärken från det senaste trycket har sålts på ett postkontor i {stad} med motivet upp och ner. Som Inverted Jenny från USA 1918, där flygplanet flög upp och ner och ett enda frimärke såldes för två miljoner dollar. Samlare från hela världen ringer postkontoret, och mannen som köpte arket vill inte säga vem han är.',
    when: (c) => c.idn.stampDays < 30,
    choices: [
      { text: 'LÅT FRIMÄRKENA VARA EN RARITET', idn: { recog: 2, pride: 1 }, next: 'idn_frimarke_auktion', tip: 'Ett feltryck är en lycka för samlarna. Och för landets rykte.' },
      { text: 'TRYCK EN STOR UPPLAGA AV FELTRYCKET', res: { money: 20 }, idn: { recog: 1 }, tip: 'Som USA gjorde 1962. Samlarna är rasande, alla andra får en raritet.' },
      { text: 'DRA IN ALLA FRIMÄRKEN', cost: { money: 5 }, temp: { approval: -1 }, tip: 'De flesta lämnas in. Inte arket i {stad}.' },
    ],
  },
  {
    id: 'idn_frimarke_auktion', icon: '\u{1F528}', chain: true,
    title: 'AUKTIONEN PÅ FELTRYCKET',
    text: 'Ett av de felvända frimärkena ska säljas på auktion i en annan huvudstad, och utropspriset är som ett hus. Köparen är den som stod i kön på postkontoret, och han vill skänka hälften av pengarna till en skola i {stad}. Postverket undrar om staten ska försöka köpa tillbaka ett exemplar till museet.',
    choices: [
      { text: 'KÖP ETT EXEMPLAR TILL POSTMUSEET', cost: { money: 60 }, idn: { pride: 2, recog: 2 }, ind: { tourists: 3 }, tip: 'Frimärket får en egen monter. Det har kö varje helg.' },
      { text: 'LÅT SAMLARNA BUDA', idn: { recog: 2 }, temp: { qol: 1 }, tip: 'Frimärket går till en samlare utomlands. Skolan får en ny gymnastiksal.' },
    ],
  },
  {
    id: 'idn_frimarke_samlare', icon: '\u{2709}\u{FE0F}', weight: 1, cooldown: 1100,
    title: 'SAMLARNA SAKNAR NYA FRIMÄRKEN',
    text: 'Frimärkssamlarnas riksförbund har skrivit ett brev till regeringen: landet har inte gett ut ett nytt frimärke på månader. Förbundet har sextiotusen medlemmar, de flesta över sjuttio. «Ett land som inte ger ut frimärken har slutat berätta om sig själv», skriver ordföranden. Brevet är förstås frankerat med ett gammalt märke.',
    when: (c) => c.idn.stampDays > 200 && c.st.qol > 0,
    choices: [
      { text: 'GE UT EN SERIE OM LANDETS DJUR', cost: { money: 10 }, idn: { pride: 1, recog: 1 }, tip: 'Ge ut den i fliken LANDET. Samlarna köper hela serien på en dag.' },
      { text: 'BJUD IN SAMLARNA ATT VÄLJA MOTIV', idn: { pride: 1 }, temp: { approval: 1 }, tip: 'De väljer gamla fyrar. Det blir en mycket vacker serie.' },
      { text: 'FRIMÄRKEN ÄR HISTORIA', temp: { approval: -1 }, tip: 'Brevet arkiveras. Det är värt mer än många nya frimärken.' },
    ],
  },
  {
    id: 'idn_frimarke_ledare', icon: '\u{1F4EE}', weight: 2, cooldown: 1100,
    title: 'STÄMPELN MITT I ANSIKTET',
    text: 'Det nya frimärket med ledarens porträtt har ett problem: poststämpeln hamnar alltid mitt i hans ansikte. Brevbärare har börjat stämpla försiktigt i hörnet, och folk lägger brev på lådan med märket upp och ner. Partiet kräver att posten stämplar med respekt. Posten säger att maskinerna inte kan det.',
    when: (c) => c.idn.cult && c.idn.stampDays < 60,
    choices: [
      { text: 'FLYTTA PORTRÄTTET TILL KANTEN', cost: { money: 10 }, tip: 'Ett nytt märke med ledaren i hörnet. Han ser ut att titta in i brevet.' },
      { text: 'STÄMPLA FÖR HAND', cost: { money: 20 }, temp: { statepower: 1 }, tip: 'Tusen nya brevbärare stämplar försiktigt. Posten blir långsam.' },
      { text: 'BYT MOTIV TILL NATIONALDJURET', temp: { approval: 1, ideopower: -1 }, tip: 'Djuret tål stämplar. Partiet är tyst.' },
    ],
  },
  {
    id: 'idn_frimarke_rekord', icon: '\u{1F4B0}', weight: 1, cooldown: 1200,
    title: 'LANDETS DYRASTE FRIMÄRKE',
    text: 'En familj i {stad} har hittat ett gammalt brev på vinden med ett av landets allra första frimärken, ett med fel färg som bara finns i två exemplar. Som när ett svenskt treskillingsfrimärke i gul färg såldes för miljoner. Experterna har bekräftat att det är äkta. Familjen undrar om staten vill köpa det.',
    when: (c) => c.day > 300 && c.idn.recog > 50 && c.idn.stampDays < 120,
    choices: [
      { text: 'KÖP DET TILL NATIONEN', cost: { money: 80 }, idn: { pride: 2, recog: 2 }, tip: 'Familjen får ett hus. Museet får sin stjärna.' },
      { text: 'LÅT DET GÅ PÅ AUKTION', idn: { recog: 2 }, temp: { qol: 1 }, tip: 'Det säljs till en samlare. Landet blir känt i en helt ny krets.' },
      { text: 'KRÄV ATT DET STANNAR I LANDET', cost: { pp: 4 }, idn: { pride: 1 }, temp: { freedom: -1 }, tip: 'Ett exportförbud. Familjen får sälja, men bara till någon här.' },
    ],
  },
  {
    id: 'idn_posten', icon: '\u{1F4EE}', weight: 2, cooldown: 1100, kind: 'valfard',
    title: 'POSTEN VILL SLUTA DELA UT BREV',
    text: 'Posten delar nu bara ut brev varannan dag, och snart kanske bara en gång i veckan. Som i Danmark, där den statliga posten slutade med brev 2025. Folk skickar nästan bara paket och mejl. Men på landsbygden väntar äldre på sina räkningar, och frimärkssamlarna undrar vad som händer med frimärkena.',
    when: (c) => c.res('computing') >= 5 && c.day > 200,
    choices: [
      { text: 'BEHÅLL BREVEN MED STATLIGT STÖD', cost: { money: 50 }, temp: { approval: 1 }, griev: -2, tip: 'Brevbäraren kommer som vanligt. Det kostar, men det betyder något.' },
      { text: 'LÅT POSTEN BESTÄMMA', res: { money: 20 }, temp: { approval: -1 }, griev: 2, tip: 'Breven blir färre. Frimärkena blir samlarobjekt.' },
      { text: 'DIGITAL POST FÖR ALLA, PAPPER FÖR DEM SOM VILL', cost: { money: 20 }, temp: { qol: 1 }, tip: 'Den som vill ha papper får papper. Ingen blir utan.' },
    ],
  },

  // ===== STOLTHETEN =====
  {
    id: 'idn_chauvinism', icon: '\u{1F4E3}', weight: 3, cooldown: 600, kind: 'migration',
    title: 'NÄR STOLTHETEN BLIR TILL HAT',
    text: 'Stoltheten över landet har stigit kraftigt, men nu händer något annat. I {stad} har utländska studenter fått höra att de ska «åka hem», och en restaurang med utländsk mat har fått sina fönster nedklottrade med flaggan. Forskare som studerar nationalism säger att gränsen mellan stolthet och förakt är tunn.',
    when: (c) => c.idn.prideD > 8 && c.migRate > 0.3,
    choices: [
      { text: 'TALA TILL NATIONEN OM VAD STOLTHET ÄR', cost: { pp: 4 }, idn: { pride: -1 }, temp: { integration: 2 }, griev: -3, ind: { xenophobia: -2 }, tip: '«Det finns ingen stolthet i att få någon att känna sig ovälkommen.»' },
      { text: 'SKÄRP STRAFFEN FÖR HATBROTT', cost: { pp: 6 }, temp: { safety: 1, integration: 1 }, ind: { xenophobia: -1 }, tip: 'Polisen får fler utredare. Restaurangen får nya fönster.' },
      { text: 'DET ÄR BARA NÅGRA FÅ', temp: { integration: -2 }, griev: 4, ind: { xenophobia: 2 }, tip: 'De få blir fler när ingen säger emot.' },
    ],
  },
  {
    id: 'idn_stolthet_rasar', icon: '\u{1F622}', weight: 3, cooldown: 600, kind: 'kris',
    title: 'STOLTHETEN RASAR',
    text: 'En ny mätning visar att andelen som är mycket stolta över att vara medborgare har sjunkit kraftigt. Unga säger att de inte ser någon framtid, äldre att landet de kände har försvunnit. Hälften av de unga i {stad} skulle flytta utomlands om de kunde. Opinionsforskarna har inte sett ett sådant ras på decennier.',
    when: (c) => c.idn.prideD < -8,
    choices: [
      { text: 'LYSSNA: EN STOR MEDBORGARDIALOG', cost: { pp: 8 }, idn: { pride: 2 }, temp: { approval: 1, stability: 1 }, griev: -4, tip: 'Tusen möten i hela landet. Folk vill bli tagna på allvar.' },
      { text: 'EN KAMPANJ OM LANDETS STYRKOR', cost: { money: 60 }, idn: { pride: 2 }, ind: { trustgov: -1 }, tip: 'Affischer med glada människor. Några tycker att det är lite magstarkt.' },
      { text: 'SATSA PÅ DET SOM FOLKET KLAGAR PÅ', cost: { money: 120 }, perm: { welfare: 1 }, idn: { pride: 3 }, griev: -6, tip: 'Stolthet går inte att beställa. Den kommer när saker fungerar.' },
      { text: 'DET GÅR ÖVER', idn: { pride: -1 }, temp: { approval: -1 }, tip: 'Mätningar går upp och ner. Den här gick mest ner.' },
    ],
  },
  {
    id: 'idn_stolthet_vm', icon: '\u{1F3C6}', weight: 2, cooldown: 800,
    title: 'LANDSLAGET ÄR I FINALEN',
    text: 'För första gången i historien har landslaget tagit sig till final i världsmästerskapet. Hela landet har flaggor i fönstren, skolor släpper eleverna tidigt och storbildsskärmar ställs upp på torgen i {huvudstad} och {stad}. Förbundskaptenen vill att regeringen kommer till finalen. Matchen är på söndag.',
    when: (c) => c.idn.pride > 30 && c.st.qol > 0 && c.day > 100,
    choices: [
      { text: 'ÅK TILL FINALEN', cost: { money: 10 }, risk: { chance: 0.45,
        win: { text: 'Laget vinner på straffar! Hela landet dansar på gatorna till morgonen.', idn: { pride: 6, recog: 4 }, temp: { approval: 4 } },
        lose: { text: 'Laget förlorar med ett mål. Folket är ledset men stolt, och laget hyllas hemma.', idn: { pride: 2 }, temp: { approval: 1 } } } },
      { text: 'TITTA MED FOLKET PÅ TORGET', risk: { chance: 0.45,
        win: { text: 'Laget vinner! Ledaren kramar främlingar på torget, och bilden blir legendarisk.', idn: { pride: 6 }, temp: { approval: 5 } },
        lose: { text: 'Förlust, men en stolt förlust. Ledaren tröstar barn som gråter på torget.', idn: { pride: 2 }, temp: { approval: 2 } } } },
      { text: 'GE ALLA LEDIGT PÅ MÅNDAGEN', cost: { pp: 2 }, temp: { approval: 2, gdp: -1 }, idn: { pride: 2 }, tip: 'Vinst eller förlust, alla behöver sova.' },
    ],
  },
  {
    id: 'idn_utlandsmedborgare', icon: '\u{1F30F}', weight: 2, cooldown: 900,
    title: 'DE FIRAR LANDET LÅNGT HEMIFRÅN',
    text: 'I {ambassadland} har tiotusentals medborgare som bor där samlats till landets största firande utanför landets gränser. De dansar landets danser, äter landets mat och sjunger {sang} med barn som aldrig varit i {rike}. De vill att regeringen skickar en minister nästa år, och de vill ha en skola i landets språk.',
    when: (c) => c.idn.embassies >= 20 && c.idn.pride > 45 && c.idn.passRank < 60,
    choices: [
      { text: 'STARTA EN SKOLA I LANDETS SPRÅK', cost: { money: 30 }, idn: { pride: 2, recog: 1 }, tip: 'Barnen lär sig språket. Några av dem flyttar hem en dag.' },
      { text: 'SKICKA EN MINISTER NÄSTA ÅR', cost: { pp: 2 }, idn: { pride: 1 }, rel: 1, tip: 'Ministern dansar, dåligt. Alla älskar det.' },
      { text: 'TACKA DEM I ETT TAL', idn: { pride: 1 }, tip: 'Talet spelas på storbildsskärm nästa år.' },
    ],
  },
  {
    id: 'idn_stolthet_integration', icon: '\u{1F91D}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'VEM FÅR VARA STOLT',
    text: 'En ung kvinna som kom till landet som barn vann en stor tävling och höll upp flaggan på prispallen. Bilden har både hyllats och hånats: några skriver att hon inte är «en riktig» medborgare. Hon svarar i en intervju att hon aldrig känt sig så hemma som när hon höll i flaggan. Hela landet diskuterar vem flaggan tillhör.',
    when: (c) => c.idn.pride > 60 && c.st.integration < 0 && c.migRate > 0.2,
    choices: [
      { text: 'BJUD IN HENNE ATT HISSA FLAGGAN', idn: { pride: 2 }, temp: { integration: 3 }, griev: -3, ind: { xenophobia: -2 }, tip: 'Hon hissar flaggan på nationaldagen. Hela landet ser.' },
      { text: 'EN KAMPANJ: FLAGGAN ÄR ALLAS', cost: { money: 30 }, temp: { integration: 2 }, idn: { pride: 1 }, tip: 'Ansikten från hela landet under samma flagga.' },
      { text: 'HÅLL DIG UTANFÖR', temp: { integration: -1 }, tip: 'Debatten tar slut av sig själv. Sårena gör det inte.' },
    ],
  },
  {
    id: 'idn_stolthet_unga', icon: '\u{1F9D1}\u{200D}\u{1F393}', weight: 2, cooldown: 1000,
    title: 'UNGDOMARNA ÄR INTE STOLTA',
    text: 'Bara var femte ungdom säger att de är mycket stolta över sitt land, enligt den stora internationella värderingsundersökningen. «Stolt över vad?», frågar en gymnasieelev i {stad}. Forskarna säger att unga i många rika länder svarar likadant, och att det inte betyder att de inte bryr sig: de är stolta över andra saker.',
    when: (c) => c.idn.pride < 30,
    choices: [
      { text: 'LÅT UNGA VARA MED OCH BESTÄMMA', cost: { pp: 4 }, idn: { pride: 2 }, temp: { approval: 1 }, tip: 'Ett ungdomsråd som regeringen faktiskt lyssnar på.' },
      { text: 'MER HISTORIA I SKOLAN', cost: { money: 20 }, idn: { pride: 1 }, temp: { hdi: 1 }, tip: 'Det fungerar bättre när historien är ärlig.' },
      { text: 'DET ÄR HELT NORMALT', temp: { freedom: 1 }, tip: 'Stolthet ska inte tvingas fram. Den kommer av sig själv, eller inte.' },
    ],
  },
  {
    id: 'idn_stolthet_matning', icon: '\u{1F4CA}', weight: 1, cooldown: 1100,
    title: 'VÄRLDENS STOLTASTE FOLK',
    text: 'I den nya internationella mätningen är folket i {rike} bland de allra stoltaste i världen. Nästan alla säger att de är mycket stolta över sitt land. I andra länder skrivs det om «stolthetens hemlighet», och utländska journalister kommer till {stad} för att intervjua folk på gatan. De flesta svarar att det är maten.',
    when: (c) => c.idn.pride > 80,
    choices: [
      { text: 'NJUT AV DET', idn: { recog: 2 }, temp: { stability: 1 }, tip: 'Det är maten. Och kanske lite annat.' },
      { text: 'ANVÄND DET I TURISTREKLAMEN', cost: { money: 30 }, ind: { tourists: 6 }, idn: { recog: 2 }, tip: 'KOM OCH SE VARFÖR VI ÄR SÅ STOLTA. Det fungerar.' },
      { text: 'PÅMINN OM ÖDMJUKHETEN', idn: { pride: -1 }, temp: { integration: 1 }, rel: 1, tip: 'Ett stolt folk som är ödmjukt. Det blir en bra kombination.' },
    ],
  },
  {
    id: 'idn_flaggreklam', icon: '\u{1F3F7}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'FLAGGAN PÅ ALLT',
    text: 'Företagen har märkt att stoltheten säljer. Flaggan finns nu på smörpaket, tandkräm, toalettpapper och en hundmat som heter «Fosterlandets bästa». Mycket av det är tillverkat utomlands. Konsumentorganisationerna kräver regler för när flaggan får användas, och veteranerna är upprörda över toalettpapperet.',
    when: (c) => c.idn.prideD > 4,
    choices: [
      { text: 'FLAGGAN BARA PÅ VAROR FRÅN LANDET', cost: { pp: 4 }, temp: { factory: 1 }, idn: { attach: 0.03 }, tip: 'Smöret får behålla flaggan. Tandkrämen från utlandet får inte.' },
      { text: 'FÖRBJUD FLAGGAN PÅ TOALETTPAPPER', cost: { pp: 2 }, idn: { pride: 1 }, tip: 'Veteranerna är nöjda. Det är toalettpappersfabriken inte.' },
      { text: 'LÅT MARKNADEN STYRA', temp: { gdp: 1 }, idn: { attach: -0.03 }, tip: 'Flaggan blir lite vardaglig. Det kan vara bra eller dåligt.' },
    ],
  },
  {
    id: 'idn_efter_forlusten', icon: '\u{1F54A}\u{FE0F}', weight: 2, cooldown: 900, kind: 'forsvar',
    title: 'ETT LAND SOM FÖRLORADE',
    text: 'Kriget är förlorat, och stoltheten med det. Veteranerna kommer hem till tysta gator, och barnen i skolan vet inte vad de ska säga. Några kräver hämnd, andra vill aldrig mer kriga. Historiker säger att det är nu landets berättelse om sig självt skrivs, och att ledarens ord i dag kommer att citeras i hundra år.',
    when: (c) => c.idn.losses >= 1 && c.idn.prideD < 0,
    choices: [
      { text: 'ETT TAL OM ATT BYGGA UPP IGEN', idn: { pride: 3 }, temp: { stability: 2 }, tip: 'Det blir inte som förut. Det kan bli bättre.' },
      { text: 'EN MINNESDAG FÖR DE SOM LED', cost: { money: 20 }, idn: { pride: 2 }, temp: { approval: 1 }, rel: 1, tip: 'Landet sörjer tillsammans. Det är början på läkningen.' },
      { text: 'LOVA REVANSCH', idn: { pride: 4 }, temp: { readiness: 3, unrest: 2 }, rel: -4, tip: 'Folket reser sig. Grannländerna rustar.' },
    ],
  },
  {
    id: 'idn_efter_segern', icon: '\u{1F396}\u{FE0F}', weight: 2, cooldown: 900, kind: 'forsvar',
    title: 'SEGERRUSET',
    text: 'Efter flera segrar i krig är stämningen i landet nästan berusad. Tidningarna kallar armén oövervinnlig, barnen leker krig på rasterna och ett parti kräver att landet tar ännu mer. Gamla generaler varnar för att segerrus har fått många riken att gå för långt, och några av dem har skrivit en bok om det.',
    when: (c) => c.idn.wins >= 2 && c.idn.prideD > 2,
    choices: [
      { text: 'DÄMPA STÄMNINGEN', idn: { pride: -1 }, temp: { stability: 2 }, rel: 2, tip: 'Ett tal om fred. Generalernas bok blir en bästsäljare.' },
      { text: 'RID PÅ VÅGEN', idn: { pride: 3 }, temp: { readiness: 3, approval: 2 }, rel: -3, tip: 'Folket älskar dig. Grannländerna är rädda för dig.' },
      { text: 'BYGG ETT MINNESMÄRKE ÖVER BÅDA SIDOR', cost: { money: 40 }, idn: { pride: 1 }, rel: 4, temp: { stability: 1 }, tip: 'En stor seger kan vara generös. Det blir ihågkommet.' },
    ],
  },
];
