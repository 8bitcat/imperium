// IMPERIUM V5.20 MEDIERNA — HÄNDELSER: NYHETSKANALER, PUBLIC SERVICE OCH PRESSFRIHET.
// Henry önskade: "lägg även till nyhetskanaler, och public service som du själv bestämmer över".
// Spelaren styr nu i fliken MEDIA: public service (budget, hur fritt det är från regeringen,
// finansiering och innehåll) och landets nyhetskanaler (stöd, censur, stängning, uppköp, egna
// statskanaler och sändningstillstånd). Händelserna graderas på c.media: public service-bolagets
// budget, kontroll, räckvidd och förtroende (c.media.ps.*), antal kanaler, hur stor del av
// räckvidden som är kritisk, vänlig eller statsägd, censurerade och stängda kanaler, folkets
// förtroende för medierna, medieklimatet och presslagen (c.media.pressLevel 0 propaganda … 4 fri).
// Platshållare: {kanal} = landets största kritiska kanal (annars den största), {ps} = public
// service-bolagets namn. Valen kan stänga, censurera, stödja, frige eller köpa {kanal}
// (kanal: 'stang' | 'censur' | 'stod' | 'fri' | 'kop'), bevilja en ny kanal (nykanal: true) och
// flytta folkets förtroende för medierna (fortroende: N).
// Avsnitten:
//   granskningen      skandaler, läckor, visselblåsare, ministrar som ljugit
//   public service    budget, kostnad, partiskhet, galor, intervjuer, barnprogram, chefer,
//                     propaganda, nedläggning och beredskap
//   kanalerna         miljardärer, utländsk propaganda, falska nyheter, deepfakes, influencers,
//                     lokaltidningar, sändningstillstånd, konkurser, strejker, satir, presstöd
//   censur            journalister i förhör, källartidningar, utländsk radio, störsändare,
//                     exilkanaler, pressfrihetslistan, presslagen skärps eller mildras
//   fri press         priser, drev, kvällspress, smutskastning, kanaler som vägrar rätta sig
//   krig och kris     krigsrapportering, segrar som ingen såg, krisinformation
//   valet             slutdebatten, faktagranskningen, kanalerna tar ställning, valreklam
//   när det går bra   förtroendet stiger, unga läser nyheter, {ps} hyllas
//   kuriosa           kartfall, mikrofonen som var på, katten i studion, aprilskämtet
// Grundtanken: granskning svider i dag och lönar sig i morgon (förtroende, mindre korruption).
// Att tysta ner fungerar en stund men kostar frihet, förtroende och omvärldens respekt.
// Familjevänligt: ingen beskrivs skadad; "förd till förhör och släppt efter tre dagar" är gränsen.
export const EVENTS = [

  // ===== GRANSKNINGEN =====
  {
    id: 'md_granskning_mutor', icon: '\u{1F50D}', weight: 2, cooldown: 900, kind: 'frihet',
    title: '{KANAL} AVSLÖJAR MUTORNA',
    text: 'Efter ett halvårs grävande publicerar {kanal} kontoutdrag och sms som visar att en av dina ministrar tagit emot pengar från ett byggbolag som sedan vann tre statliga upphandlingar. Ministern säger att det var "ett lån mellan vänner". Redaktionen säger att de har mer. Klockan sju i morgon bitti vill de ha en kommentar.',
    when: (c) => c.media.channels >= 1 && c.media.critical > 20 && c.media.pressLevel >= 2 && c.day > 60,
    choices: [
      { text: 'STÅ TILL SVARS OCH TILLSÄTT EN UTREDNING', cost: { pp: 10 }, temp: { approval: -4 }, perm: { corruption: -2 }, ind: { trustgov: 2 }, fortroende: 4, next: 'md_granskning_utredning', tip: 'Det svider i en vecka. Sedan är det du som städade.' },
      { text: 'SPARKA MINISTERN I KVÄLL', cost: { pp: 6 }, temp: { approval: -2, stability: -1 }, perm: { corruption: -1 }, fortroende: 2, next: [null, 'md_granskning_ministern'], tip: 'Snabbt och snyggt. Frågan är vad hon säger när hon inte längre är minister.' },
      { text: 'TYSTA NER {KANAL}', kanal: 'censur', temp: { freedom: -4, approval: 1 }, griev: 8, ind: { pressfree: -5, trustgov: -2 }, fortroende: -5, mod: 'cover_up', next: 'md_granskning_lacka', tip: 'Artikeln försvinner. Kopiorna gör det inte.' },
      { text: 'KALLA DET FALSKA NYHETER', temp: { ideopower: 2 }, ind: { trustgov: -2 }, fortroende: -3, next: ['md_granskning_lacka', null], tip: 'Dina anhängare tror dig. Alla andra läser artikeln en gång till.' },
    ],
  },
  {
    id: 'md_granskning_utredning', icon: '\u{1F4D1}', chain: true, kind: 'frihet',
    title: 'UTREDNINGEN ÄR KLAR',
    text: 'Utredaren har gått igenom fyra års upphandlingar. Det var inte tre kontrakt, det var elva, och två tjänstemän på departementet visste om det. Rapporten är 212 sidor lång och ligger på ditt skrivbord. {kanal} har redan frågat när den blir offentlig.',
    choices: [
      { text: 'PUBLICERA ALLT, ÄVEN DET SOM SVIDER', temp: { approval: -3 }, perm: { corruption: -3, stability: 1 }, ind: { trustgov: 3 }, fortroende: 4, tip: 'Elva kontrakt i rubrikerna. Och ett land som ser att granskningen fungerar.' },
      { text: 'ÅTALA DE INBLANDADE OCH SKÄRP REGLERNA', cost: { pp: 15 }, law: ['anti_corruption', 'agency'], perm: { corruption: -4 }, ind: { trustgov: 2 }, fortroende: 2, tip: 'En egen myndighet mot korruption. Byggbolagen anställer fler jurister.' },
      { text: 'LÄGG RAPPORTEN I EN LÅDA', temp: { stability: 1 }, mod: 'cover_up', fortroende: -4, next: 'md_granskning_lacka', tip: 'Lådor har en tendens att öppnas av fel person.' },
    ],
  },
  {
    id: 'md_granskning_ministern', icon: '\u{1F4D6}', chain: true,
    title: 'DEN SPARKADE MINISTERN TALAR UT',
    text: 'Ministern du sparkade har gett en lång intervju i {kanal}. Hon säger att hon bara gjorde "som alla andra i regeringen" och att hon har sparat varenda mejl. Intervjun är den mest lästa artikeln på flera år. Oppositionen kräver att fler ministrar granskas.',
    choices: [
      { text: 'ÖPPNA ALLA MINISTRARS KALENDRAR OCH MEJL', cost: { pp: 12 }, temp: { approval: -2 }, perm: { corruption: -3 }, ind: { trustgov: 3 }, fortroende: 3, tip: 'Det mesta är lunchmöten och tandläkartider. Folk blir nästan besvikna.' },
      { text: 'KALLA HENNE EN BITTER FÖRLORARE', temp: { approval: -3, stability: -1 }, ind: { trustgov: -3 }, fortroende: -2, tip: 'Bittra förlorare säljer böcker. Hon har redan ett förlag.' },
      { text: 'ERBJUD HENNE EN AMBASSADÖRSPOST', cost: { pp: 8 }, temp: { stability: 1 }, perm: { corruption: 2 }, rel: -1, tip: 'Hon blir tyst och solbränd. Alla förstår varför.' },
    ],
  },
  {
    id: 'md_granskning_lacka', icon: '\u{1F4C1}', chain: true, kind: 'frihet',
    title: 'DE LÄCKTA DOKUMENTEN',
    text: 'Någon på departementet har skickat en hel mapp med interna promemorior till {kanal}. Där står svart på vitt att regeringen visste om pengarna och försökte dölja dem. Dokumenten ligger ute på nätet och har laddats ned en halv miljon gånger. Säkerhetspolisen vill veta vem som läckte.',
    choices: [
      { text: 'ERKÄNN OCH BE OM URSÄKT', cost: { pp: 10 }, temp: { approval: -5 }, perm: { corruption: -3 }, unmod: 'cover_up', ind: { trustgov: 2 }, fortroende: 5, tip: 'En ursäkt i direktsändning. Det svåraste en regering gör, och det enda som fungerar.' },
      { text: 'JAGA LÄCKAN', cost: { pp: 8 }, temp: { freedom: -2, statepower: 2 }, griev: 4, fortroende: -2, next: 'md_visselblasaren', tip: 'Tre tjänstemän förhörs. En av dem har redan pratat med en advokat.' },
      { text: 'STÄNG {KANAL}', kanal: 'stang', temp: { freedom: -6, unrest: 4 }, rel: -4, griev: 12, ind: { pressfree: -7, trustgov: -4 }, fortroende: -8, tip: 'Kanalen är borta. Dokumenten ligger kvar på nätet.' },
    ],
  },
  {
    id: 'md_visselblasaren', icon: '\u{1F4E3}', chain: true, kind: 'frihet',
    title: 'VISSELBLÅSAREN',
    text: 'Läckan var en 34-årig handläggare på departementet. I dag står hon fram med namn och bild och säger att hon försökte larma sin chef två gånger innan hon gick till journalisterna. Åklagaren kan åtala henne för att ha röjt hemliga handlingar. Utanför hennes hus i {stad} har folk lagt blommor.',
    choices: [
      { text: 'STIFTA EN LAG SOM SKYDDAR VISSELBLÅSARE', cost: { pp: 15 }, law: ['speech', 'whistleblower'], perm: { corruption: -3, freedom: 1 }, griev: -6, fortroende: 4, tip: 'Nästa gång någon ser något fel vet de att de får säga det.' },
      { text: 'LÄGG NER UTREDNINGEN MOT HENNE', temp: { approval: 2 }, griev: -3, ind: { trustgov: 1 }, fortroende: 2, tip: 'Hon får gå tillbaka till jobbet. Chefen hälsar inte i korridoren.' },
      { text: 'LÅT ÅKLAGAREN ÅTALA', temp: { freedom: -3, statepower: 2 }, griev: 8, mod: 'martyr', ind: { pressfree: -3 }, fortroende: -3, tip: 'Rättegången blir den mest bevakade på årtionden. Hon blir en symbol.' },
    ],
  },
  {
    id: 'md_sloseri', icon: '\u{1FA91}', weight: 2, cooldown: 800,
    title: 'DE GULDKANTADE KONTORSSTOLARNA',
    text: '{kanal} har granskat hur myndigheterna handlar. Ett ämbetsverk har köpt 400 kontorsstolar för fyra gånger marknadspriset, och en annan myndighet har betalat konsulter för att skriva en rapport om hur man sparar på konsulter. Inslaget har setts av vart tredje hushåll och skämten om stolarna har redan börjat.',
    when: (c) => c.media.channels >= 2 && c.media.critical > 15 && c.st.corruption > 10,
    choices: [
      { text: 'SKICKA REVISORER TILL ALLA MYNDIGHETER', cost: { money: 100 }, perm: { corruption: -2, income: 1 }, fortroende: 3, tip: 'Revisorerna hittar mer. Det är därför man har revisorer.' },
      { text: 'SÄLJ STOLARNA PÅ AUKTION I DIREKTSÄNDNING', res: { money: 40 }, temp: { approval: 3 }, fortroende: 2, tip: 'En stol går för dubbla priset till en samlare. Ingen förstår varför.' },
      { text: 'FÖRSVARA MYNDIGHETERNA', temp: { approval: -2 }, perm: { corruption: 1 }, ind: { trustgov: -2 }, fortroende: -1, tip: '"Ergonomi har ett värde." Det har den. Men inte det värdet.' },
    ],
  },
  {
    id: 'md_ministern_ljog', icon: '\u{1F399}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'MINISTERN SOM LJÖG I TALARSTOLEN',
    text: 'I parlamentet sa finansministern att hon "aldrig träffat" bankens styrelse före räddningspaketet. I kväll sänder {kanal} en ljudinspelning från en middag där hon gör just det, två dagar före beslutet. Inspelningen är kort och tydlig. Oppositionen har redan lämnat in en misstroendeförklaring.',
    when: (c) => c.media.channels >= 1 && c.media.critical > 25 && c.demo > 4 && c.day > 90,
    choices: [
      { text: 'BE HENNE AVGÅ', cost: { pp: 8 }, temp: { approval: -2, stability: -1 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, fortroende: 3, tip: 'Det var inte hennes första lögn. Bara den första som spelades in.' },
      { text: 'STÅ BAKOM HENNE', temp: { approval: -3 }, ind: { trustgov: -3 }, fortroende: -2, tip: 'Lojalitet är vackert. Väljarna har en annan uppfattning.',
        risk: { chance: 0.4,
          win: { text: 'Misstroendet faller med två röster. Hon stannar, försvagad men kvar.', temp: { stability: 1 } },
          lose: { text: 'Misstroendet går igenom. Hon faller och tar din auktoritet med sig.', temp: { approval: -3, polpower: -4 } } } },
      { text: 'FRÅGA HUR {KANAL} FICK TAG PÅ INSPELNINGEN', temp: { statepower: 1 }, ind: { trustgov: -2 }, fortroende: -3, tip: 'Det är fel fråga. Alla märker att det är fel fråga.' },
    ],
  },
  {
    id: 'md_skatteparadis', icon: '\u{1F3DD}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'PAPPREN FRÅN SKATTEPARADISET',
    text: 'Ett nätverk av journalister i flera länder har fått tag på elva miljoner dokument från en advokatbyrå i ett skatteparadis. {kanal} har gått igenom dem som rör {rike}: två av landets rikaste familjer, en fotbollsklubb och en tidigare statssekreterare har gömt pengar i brevlådeföretag. Alla säger att allt är lagligt.',
    when: (c) => c.media.channels >= 2 && c.media.critical > 10 && (c.ind.taxevasion ?? 10) > 6 && c.day > 150,
    choices: [
      { text: 'SKICKA SKATTEVERKET EFTER PENGARNA', cost: { pp: 10 }, res: { money: 300 }, perm: { corruption: -2 }, ind: { trustgov: 2 }, fortroende: 3, tip: 'Det tar tre år och hittar en tiondel. Det är mer än noll.' },
      { text: 'TÄPP TILL KRYPHÅLEN I LAGEN', cost: { pp: 15 }, perm: { corruption: -2, income: 1 }, temp: { gdp: -1 }, fortroende: 2, tip: 'Advokatbyrån flyttar till ett annat skatteparadis. Det finns gott om dem.' },
      { text: 'DET ÄR LAGLIGT, ALLTSÅ ÄR DET OKEJ', temp: { approval: -3 }, perm: { corruption: 1 }, ind: { trustgov: -3 }, tip: 'Lagligt och okej är två olika saker. Väljarna kan skillnaden.' },
    ],
  },

  // ===== PUBLIC SERVICE =====
  {
    id: 'md_ps_budget', icon: '\u{1F4FA}', weight: 2, cooldown: 800,
    title: '{PS} VILL HA MER PENGAR',
    text: 'Inflationen har ätit upp en sjättedel av budgeten för {ps} på tre år. Chefen varnar för att de regionala nyheterna i sju län måste läggas ner om inget händer, och att barnkanalen kan få gå över till repriser. Kritikerna säger att bolaget har för många chefer. Båda sidor har lite rätt.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.budget <= 3 && (c.ind.infl ?? 2) > 3 && c.day > 90,
    choices: [
      { text: 'RÄKNA UPP ANSLAGET MED INFLATIONEN', cost: { money: 250 }, temp: { approval: 1 }, fortroende: 3, tip: 'Ingen tackar för att något fortsätter som förut. Men länen behåller sina nyheter.' },
      { text: 'MER PENGAR MOT FÄRRE CHEFER', cost: { money: 120, pp: 6 }, perm: { corruption: -1 }, fortroende: 2, tip: 'Fyra mellanchefer blir reportrar igen. Två av dem trivs bättre.' },
      { text: 'FRYS ANSLAGET', res: { money: 60 }, temp: { qol: -1 }, fortroende: -3, tip: 'Regionalnyheterna i norr läggs ner. Där bor få väljare. Och de minns.' },
    ],
  },
  {
    id: 'md_ps_avgiften', icon: '\u{1F9FE}', weight: 2, cooldown: 900,
    title: 'VAD KOSTAR {PS} EGENTLIGEN?',
    text: 'En kvällstidning har räknat ut att {ps} kostar varje hushåll ungefär lika mycket som två pizzor i månaden. En pensionär i {stad} har skrivit ett upprört brev som delats hundratusen gånger: hon tittar bara på väderleksrapporten och tycker att den borde vara billigare. Ett parti vill halvera budgeten.',
    when: (c) => c.media.ps.budget >= 2 && c.media.ps.trust < 60 && (c.grievOf('skatt') > 5 || c.deficit),
    choices: [
      { text: 'FÖRSVARA {PS} OCH DESS UPPDRAG', cost: { pp: 6 }, temp: { approval: -1 }, fortroende: 3, tip: 'Nyheter, barnprogram, beredskap och väderleken. För två pizzor.' },
      { text: 'SÄNK KOSTNADEN MED EN TIONDEL', res: { money: 120 }, temp: { approval: 2 }, fortroende: -2, tip: 'Pensionären blir glad. Hon märker inte att väderleken flyttar till en senare tid.' },
      { text: 'GE PENSIONÄRERNA RABATT', cost: { money: 80 }, temp: { approval: 3 }, tip: 'Populärt och billigt. Studenterna vill också ha rabatt. Och lantbrukarna.' },
    ],
  },
  {
    id: 'md_ps_partisk', icon: '\u{2696}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'PARTISKT, SÄGER BÅDA SIDOR',
    text: 'Samma vecka anklagas {ps} för att gå vänsterns ärenden av ett parti och högerns ärenden av ett annat. Båda har räknat minuter i nyhetssändningarna och fått motsatta resultat. Granskningsnämnden har fått 900 anmälningar. Chefen säger att när alla är arga gör man nog något rätt.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control <= 1 && c.demo > 5 && c.day > 60,
    choices: [
      { text: 'LÅT GRANSKNINGSNÄMNDEN SKÖTA DET', temp: { stability: 1 }, fortroende: 2, tip: 'Nämnden fäller två inslag och friar 898. Ingen blir nöjd, men alla lugnar sig.' },
      { text: 'BESTÄLL EN OBEROENDE STUDIE', cost: { money: 60 }, ind: { trustgov: 1 }, fortroende: 3, tip: 'Forskarna mäter i ett år. Resultatet: ungefär mitt i. Båda sidor kallar studien partisk.' },
      { text: 'SÄTT IN EN POLITISKT TILLSATT KONTROLLANT', cost: { pp: 10 }, temp: { statepower: 2, freedom: -2 }, ind: { pressfree: -2 }, fortroende: -4, tip: 'Nu är det i alla fall någon som är partisk med flit.' },
    ],
  },
  {
    id: 'md_ps_nyarsgala', icon: '\u{1F386}', weight: 2, cooldown: 1000,
    title: 'REKORD FÖR NYÅRSGALAN',
    text: 'Nyårsgalan på {ps} sågs av sex av tio invånare, fler än någonsin. Det var dansbandet från {stad}, kören med tusen barn och den gamla skådespelaren som läste dikten vid tolvslaget som fick folk att stanna kvar. Dagen efter pratar alla om samma sak, på bussen och i fikarummet. Det har inte hänt på länge.',
    when: (c) => c.media.ps.budget >= 2 && c.media.ps.reach > 50 && c.media.ps.trust > 35,
    choices: [
      { text: 'GE {PS} ETT EXTRA ANSLAG FÖR KULTUR', cost: { money: 120 }, temp: { approval: 2, qol: 1 }, fortroende: 3, tip: 'Folket fick en kväll tillsammans. Det kostar mindre än en motorvägsbro.' },
      { text: 'SKICKA ETT TACK TILL ALLA SOM MEDVERKADE', temp: { approval: 2, stability: 1 }, fortroende: 1, tip: 'Kören med tusen barn får tusen tackkort. Det tog tre veckor att skriva dem.' },
      { text: 'SÄLJ GALAN TILL UTLANDET', res: { money: 80 }, temp: { approval: 1 }, tip: 'Dikten fungerar sämre på andra språk. Dansbandet fungerar överallt.' },
    ],
  },
  {
    id: 'md_ps_intervju', icon: '\u{1F3A4}', weight: 2, cooldown: 1000,
    title: 'DEN STORA INTERVJUN',
    text: 'Den mest fruktade intervjuaren på {ps} vill göra en timslång intervju med dig i direktsändning, utan frågor i förväg. Förra gången hon gjorde det lämnade en minister studion röd i ansiktet och avgick veckan efter. Dina rådgivare är oense. Oppositionsledaren har redan sagt ja.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control <= 1 && c.day > 120,
    choices: [
      { text: 'STÄLL UPP, OCH FÖRBERED DIG', cost: { pp: 5 }, tip: 'Tre kvällar med rådgivare som spelar elak journalist. En av dem är för bra på det.',
        risk: { chance: 0.6,
          win: { text: 'Du svarar lugnt och klart på allt, även det svåra. Tittarna är imponerade.', temp: { approval: 5 }, ind: { trustgov: 3 }, fortroende: 2 },
          lose: { text: 'Du tappar tråden när hon frågar om budgeten. Klippet går runt hela natten.', temp: { approval: -4 }, ind: { trustgov: -2 } } } },
      { text: 'KRÄV FRÅGORNA I FÖRVÄG', temp: { approval: -1 }, ind: { trustgov: -1 }, fortroende: -2, tip: 'Hon säger nej och berättar i sändningen att du frågade. Det blir intervjun.' },
      { text: 'SKICKA EN MINISTER I STÄLLET', temp: { approval: -2 }, ind: { trustgov: -1 }, tip: 'Ministern klarar sig bra. Rubriken handlar ändå om den som inte kom.' },
    ],
  },
  {
    id: 'md_ps_barnprogram', icon: '\u{1F952}', weight: 2, cooldown: 1100,
    title: 'GURKAN GÖSTA ERÖVRAR LANDET',
    text: 'Ett litet barnprogram på {ps} om en grön handdocka som heter Gurkan Gösta har blivit landets mest sedda program. Barnen sjunger hans sång om att tvätta händerna på varenda förskola, och föräldrarna kan den också, mot sin vilja. Leksaksbutikerna har slut på gurkdockor. Tre länder vill köpa programmet.',
    when: (c) => c.media.ps.budget >= 2 && c.media.ps.trust > 30 && c.day > 60,
    choices: [
      { text: 'BESTÄLL TVÅ NYA SÄSONGER', cost: { money: 100 }, temp: { approval: 2, qol: 1 }, fortroende: 2, next: 'md_ps_barnprogram_export', tip: 'Gösta får en kompis, Tomaten Tora. Föräldrarna suckar. Barnen jublar.' },
      { text: 'SÄLJ RÄTTIGHETERNA TILL UTLANDET', res: { money: 150 }, temp: { approval: 1 }, next: ['md_ps_barnprogram_export', null], tip: 'Gösta talar snart sju språk. Handtvättssången fungerar på alla.' },
      { text: 'LÅT HONOM VARA EN LITEN GURKA', temp: { qol: 1 }, fortroende: 1, tip: 'Ingen film, inga leksaker. Bara ett barnprogram, och det räcker gott.' },
    ],
  },
  {
    id: 'md_ps_barnprogram_export', icon: '\u{1F30D}', chain: true,
    title: 'GÖSTA PÅ VÄRLDSTURNÉ',
    text: 'Gurkan Gösta sänds nu i {land} och tjugo andra länder. Sången om att tvätta händerna har blivit en del av en hälsokampanj, och läkare säger att magsjukan på förskolorna har minskat. I {huvudstad} vill turisterna fotograferas med dockan. Ett stort utländskt filmbolag erbjuder sig att köpa hela figuren.',
    choices: [
      { text: 'BEHÅLL GÖSTA, HAN ÄR VÅR', temp: { approval: 3, stability: 1 }, rel: 2, fortroende: 2, tip: 'En gurka kan vara en nationalsymbol. Det visste ingen förrän nu.' },
      { text: 'SÄLJ HONOM FÖR EN FÖRMÖGENHET', res: { money: 500 }, temp: { approval: -2 }, tip: 'I filmen får Gösta en sportbil och en superkraft. Barnen tycker att han har förändrats.' },
      { text: 'GÖR HONOM TILL AMBASSADÖR FÖR {RIKE}', cost: { money: 40 }, rel: 4, ind: { tourists: 3 }, tip: 'Den enda diplomaten som aldrig gjort någon upprörd.' },
    ],
  },
  {
    id: 'md_ps_sport', icon: '\u{26BD}', weight: 2, cooldown: 1000,
    title: 'VEM FÅR SÄNDA FINALEN?',
    text: 'Landslaget är i final för första gången på trettio år. {ps} har alltid sänt landskamperna, men nu har {kanal} bjudit dubbelt så mycket för rättigheterna och vill visa matchen bara för betalande. Sju av tio vill se den. Hälften av dem har inget abonnemang. Förbundet vill ha besked i dag.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.reach > 30 && c.media.ps.trust > 25 && c.media.channels >= 2 && c.day > 100,
    choices: [
      { text: 'GE {PS} PENGAR ATT MATCHA BUDET', cost: { money: 250 }, temp: { approval: 4, stability: 1 }, fortroende: 2, tip: 'Hela landet ser matchen. Hela kvarteret skriker samtidigt vid målet.' },
      { text: 'STIFTA EN LAG OM FRI TV FÖR STORA MATCHER', cost: { pp: 12 }, temp: { approval: 3 }, fortroende: 1, tip: 'Förbundet blir surt. Folket får se finalen. Ett bra byte.' },
      { text: 'LÅT MARKNADEN AVGÖRA', temp: { approval: -3, qol: -1 }, fortroende: -1, tip: 'Sportbarerna gör sitt livs bästa kväll. Alla andra lyssnar på radio.' },
    ],
  },
  {
    id: 'md_ps_ny_chef', icon: '\u{1F454}', weight: 2, cooldown: 1200, kind: 'frihet',
    title: 'NY CHEF FÖR {PS}',
    text: 'Chefen för {ps} går i pension efter elva år. Enligt reglerna föreslår styrelsen en efterträdare, men regeringen har sista ordet. Styrelsens kandidat är en prisbelönt reporter som granskat tre regeringar. Partiets kandidat är en tidigare presschef som "förstår vad landet behöver".',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control <= 2 && c.media.ps.trust < 70 && c.day > 200,
    choices: [
      { text: 'GODKÄNN STYRELSENS KANDIDAT', temp: { freedom: 1 }, griev: -3, ind: { pressfree: 2 }, fortroende: 3, tip: 'Hon börjar med att granska dig. Det var väntat.' },
      { text: 'UTSE PARTIETS KANDIDAT', cost: { pp: 10 }, temp: { statepower: 3, freedom: -2 }, griev: 6, ind: { pressfree: -3, trustgov: -1 }, fortroende: -5, tip: 'Nyheterna blir vänligare. Tittarna märker det på en vecka.' },
      { text: 'LÅT EN OBEROENDE KOMMITTÉ VÄLJA FRAMÖVER', cost: { pp: 8 }, perm: { freedom: 1 }, griev: -4, ind: { pressfree: 3 }, fortroende: 4, tip: 'Du ger bort en makt du aldrig får tillbaka. Det är hela poängen.' },
    ],
  },
  {
    id: 'md_ps_granskar', icon: '\u{1F50E}', weight: 2, cooldown: 900, kind: 'frihet',
    title: '{PS} GRANSKAR REGERINGEN',
    text: 'Granskningsprogrammet på {ps} har ägnat tre avsnitt åt hur regeringen skött vårdköerna. Siffrorna är obekväma, och reportern har fått tag på ett internt mejl där en statssekreterare skriver "det här får inte komma ut". Dina partivänner frågar varför skattebetalarna ska betala för att regeringen kritiseras.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control <= 1 && c.st.corruption > -5 && c.day > 90,
    choices: [
      { text: 'STÅ TILL SVARS I PROGRAMMET', cost: { pp: 6 }, temp: { approval: -2 }, perm: { corruption: -1 }, ind: { trustgov: 2 }, fortroende: 3, tip: 'Det är därför de finns. Och därför landet litar på dem.' },
      { text: 'DRA IN EN DEL AV ANSLAGET', res: { money: 100 }, temp: { freedom: -3 }, griev: 7, ind: { pressfree: -3 }, fortroende: -5, tip: 'Alla förstår varför. Även de som aldrig såg programmet.' },
      { text: 'ANKLAGA DEM FÖR KAMPANJJOURNALISTIK', temp: { ideopower: 2 }, griev: 2, ind: { trustgov: -2 }, fortroende: -2, tip: 'Dina anhängare håller med. Programmet får rekordmånga tittare.' },
    ],
  },
  {
    id: 'md_ps_tittarflykt', icon: '\u{1F4C9}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'INGEN TITTAR PÅ {PS} LÄNGRE',
    text: 'Sedan regeringen började bestämma nyheterna på {ps} har tittarna försvunnit. Kvällsnyheterna ses av färre än en av tio, och unga vet knappt att kanalen finns. Folk söker sig till utländska kanaler och rykten på nätet i stället. Chefen ber om lov att ställa "åtminstone en kritisk fråga i veckan".',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control >= 2 && c.media.ps.reach < 60,
    choices: [
      { text: 'GE REDAKTIONEN FRIARE TYGLAR', cost: { pp: 10 }, temp: { statepower: -2, freedom: 2 }, griev: -5, ind: { pressfree: 3 }, fortroende: 4, tip: 'En kritisk fråga i veckan låter lite. Tittarna kommer tillbaka ändå.' },
      { text: 'SATSA PÅ UNDERHÅLLNING I STÄLLET', cost: { money: 150 }, temp: { approval: 1 }, fortroende: 1, tip: 'Folk tittar på frågesporten. Sedan byter de kanal när nyheterna börjar.' },
      { text: 'TVINGA KABELBOLAGEN ATT LÄGGA {PS} FÖRST', temp: { statepower: 2, freedom: -2 }, griev: 3, fortroende: -2, tip: 'Kanal ett på fjärrkontrollen. Kanal två är den alla byter till.' },
    ],
  },
  {
    id: 'md_ps_solsken', icon: '\u{2600}\u{FE0F}', weight: 1, cooldown: 1000,
    title: 'ALLTID SOL DÄR STATSCHEFEN ÄR',
    text: 'Folk har märkt att det enligt väderkartan på {ps} alltid är sol där statschefen befinner sig, även när det regnar sidledes. I {stad} står folk under paraplyer och skrattar åt kartan. På nätet har "statschefsväder" blivit ett ord. Ministeriet säger att det handlar om "en optimistisk prognosmodell".',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control >= 3,
    choices: [
      { text: 'LÅT METEOROLOGERNA VISA RIKTIGT VÄDER', temp: { approval: 2 }, ind: { trustgov: 1 }, fortroende: 3, tip: 'Det regnar på statschefen. Folk tycker att det är nästan rörande.' },
      { text: 'SKÄMTA OM DET I ETT TAL', cost: { pp: 4 }, temp: { approval: 3 }, tip: 'Självironi är den sällsyntaste resursen i ett propagandaministerium.' },
      { text: 'FÖRBJUD ORDET STATSCHEFSVÄDER', temp: { freedom: -2, approval: -2 }, fortroende: -3, tip: 'Nu säger alla "vädret vi inte får nämna". Det är längre, men roligare.' },
    ],
  },
  {
    id: 'md_ps_nedlagt', icon: '\u{1F4FB}', weight: 2, cooldown: 1000,
    title: 'TYST PÅ LANDSBYGDEN',
    text: 'Sedan public service lades ned finns det inga nyheter alls om stora delar av landet. Ingen bevakar kommunfullmäktige på de små orterna, och när skogsbranden närmade sig byarna norr om {stad} fick folk veta det av grannarna. Tidningarna i städerna har inga reportrar utanför tullarna. Landsbygdens förening kräver en lösning.',
    when: (c) => c.media.ps.budget === 0 && c.day > 60,
    choices: [
      { text: 'STÖD LOKALA RADIOSTATIONER', cost: { money: 180 }, nykanal: true, temp: { qol: 1 }, fortroende: 3, tip: 'En liten station i varje län. De sänder om kor, kommunbudgetar och väder.' },
      { text: 'LÅT KOMMUNERNA SKÖTA INFORMATIONEN', temp: { approval: -2 }, perm: { corruption: 1 }, fortroende: -2, tip: 'Kommunens nyhetsbrev granskar sällan kommunen.' },
      { text: 'MARKNADEN LÖSER DET', temp: { approval: -3, stability: -1 }, fortroende: -3, tip: 'Marknaden har räknat. Byarna är för små för att löna sig.' },
    ],
  },
  {
    id: 'md_ps_beredskap', icon: '\u{1F4E1}', weight: 2, cooldown: 1100,
    title: 'SÄNDARNA SOM SKA KLARA ETT KRIG',
    text: 'Försvaret och {ps} har övat vad som händer om elnätet slås ut. Resultatet är nedslående: reservsändarna i bergrummen är fyrtio år gamla, dieseln räcker två dygn och bara hälften av hushållen har en radio med batterier. Om något händer når budskapet inte fram.',
    when: (c) => c.media.ps.budget >= 1 && (c.atWar || c.st.readiness > 20 || c.mod('war_fever')),
    choices: [
      { text: 'BYGG NYA RESERVSÄNDARE', cost: { money: 300 }, perm: { readiness: 2, stability: 1 }, fortroende: 2, tip: 'De står i berget och gör ingenting. Förhoppningsvis för alltid.' },
      { text: 'DELA UT VEVRADIO TILL ALLA HUSHÅLL', cost: { money: 150 }, temp: { readiness: 2, approval: 2 }, tip: 'Folk vevar och lyssnar på musik. Barnen vevar och lyssnar på ingenting.' },
      { text: 'LITA PÅ MOBILNÄTET', temp: { readiness: -1 }, res: { money: 20 }, tip: 'Mobilnätet behöver också el. Det har ingen nämnt.' },
    ],
  },
  {
    id: 'md_ps_reklam', icon: '\u{1F4B8}', weight: 2, cooldown: 1000,
    title: 'REKLAM I {PS}?',
    text: 'Med statskassan i kris föreslår finansdepartementet att {ps} ska börja sälja reklam, åtminstone mellan programmen. Det skulle spara staten en femtedel av kostnaden. De privata kanalerna är rasande och säger att det tar deras annonsörer. Journalisterna undrar hur de ska granska en bank som köper reklamtid.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.budget <= 3 && (c.deficit || c.debt > 100),
    choices: [
      { text: 'TILLÅT REKLAM MELLAN PROGRAMMEN', res: { money: 250 }, temp: { qol: -1 }, fortroende: -3, tip: 'Pengarna kommer. Barnprogrammen avbryts av reklam för godis.' },
      { text: 'NEJ, {PS} SKA VARA REKLAMFRITT', temp: { approval: 1 }, ind: { trustgov: 1 }, fortroende: 2, tip: 'Kassan blir inte större. Men ingen undrar vem som betalar nyheterna.' },
      { text: 'BARA SPONSRAD SPORT', res: { money: 100 }, fortroende: -1, tip: 'Mittcirkeln får en bilfirmas logga. Det mesta annat är som förut.' },
    ],
  },
  {
    id: 'md_ps_dramaserie', icon: '\u{1F3AC}', weight: 2, cooldown: 1200,
    title: 'DRAMASERIEN SOM VANN VÄRLDEN',
    text: 'En dramaserie från {ps} om tre syskon som utvandrade från {stad} för hundra år sedan har vunnit det största priset på en internationell tv-festival. Serien sänds nu i fyrtio länder och turisterna har börjat leta efter gården där den spelades in. Regissören tackade "alla som betalar för {ps}" i sitt tal.',
    when: (c) => c.media.ps.budget >= 3 && c.media.ps.control <= 1,
    choices: [
      { text: 'GE {PS} PENGAR FÖR EN ANDRA SÄSONG', cost: { money: 150 }, temp: { approval: 2 }, rel: 2, ind: { tourists: 4 }, fortroende: 3, tip: 'Syskonen ska till ett nytt land. Tittarna gråter redan.' },
      { text: 'BJUD IN SKÅDESPELARNA TILL REGERINGEN', temp: { approval: 2, stability: 1 }, rel: 1, fortroende: 1, tip: 'Fotot blir fint. Skådespelaren som spelade skurken står längst bort.' },
      { text: 'MARKNADSFÖR {RIKE} MED SERIEN', cost: { money: 80 }, rel: 3, ind: { tourists: 6 }, tip: 'Turisterna kommer för gården och stannar för fikat.' },
    ],
  },
  {
    id: 'md_ps_skoltv', icon: '\u{1F3EB}', weight: 2, cooldown: 1100,
    title: 'SKOLAN FLYTTAR IN I TV:N',
    text: 'När skolorna stängdes under epidemin började {ps} sända lektioner varje förmiddag: matte klockan nio, läsning klockan tio och gympa i vardagsrummet klockan elva. Lärare i hela landet har hjälpt till. Föräldrarna säger att barnen lärt sig mer än väntat, och far- och morföräldrarna har börjat räkna mattetalen också.',
    when: (c) => c.media.ps.budget >= 2 && c.mod('epidemic'),
    choices: [
      { text: 'GÖR SKOL-TV TILL ETT FAST UPPDRAG', cost: { money: 120 }, perm: { qol: 1 }, temp: { research: 1 }, fortroende: 3, tip: 'Läxhjälp i tv varje eftermiddag. Barnen i glesbygden får samma lärare som i stan.' },
      { text: 'TACKA LÄRARNA I ETT TAL', temp: { approval: 2, stability: 1 }, fortroende: 1, tip: 'Lärarna blir glada. De hade hellre fått en lönehöjning.' },
      { text: 'SLUTA NÄR SKOLORNA ÖPPNAR IGEN', res: { money: 40 }, fortroende: -1, tip: 'Gympan i vardagsrummet saknas mest av far- och morföräldrarna.' },
    ],
  },
  {
    id: 'md_ps_samtalet', icon: '\u{260E}\u{FE0F}', weight: 2, cooldown: 1100, kind: 'frihet',
    title: 'SAMTALET TILL REDAKTIONEN',
    text: 'En statssekreterare ringde nyhetschefen på {ps} kvällen före en granskning av bostadsbidragen och sa att det "vore olyckligt" om inslaget sändes. Inslaget stoppades. Nu har samtalet läckt ut, och tjugo journalister på {ps} har skrivit ett öppet brev. Chefen för bolaget har inte sagt något än.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control >= 1 && c.media.ps.control <= 2 && c.day > 120,
    choices: [
      { text: 'SPARKA STATSSEKRETERAREN OCH BE OM URSÄKT', cost: { pp: 8 }, temp: { approval: -2 }, griev: -5, ind: { pressfree: 2 }, fortroende: 4, tip: 'Inslaget sänds en vecka senare. Ingen minns vad det handlade om, bara samtalet.' },
      { text: 'SÄG ATT DET VAR ETT VANLIGT SAMTAL', temp: { statepower: 1 }, griev: 4, ind: { trustgov: -2 }, fortroende: -3, next: 'md_ps_chefen_avgar', tip: 'Vanliga samtal brukar inte stoppa inslag.' },
      { text: 'KRÄV ATT DE SOM SKREV BREVET SÄGS UPP', cost: { pp: 10 }, temp: { statepower: 2, freedom: -3 }, griev: 9, ind: { pressfree: -4 }, fortroende: -5, next: 'md_ps_chefen_avgar', tip: 'Ett brev med tjugo namn blir ett med tvåhundra.' },
    ],
  },
  {
    id: 'md_ps_chefen_avgar', icon: '\u{1F6AA}', chain: true, kind: 'frihet',
    title: 'CHEFEN FÖR {PS} AVGÅR I PROTEST',
    text: 'Chefen för {ps} har avgått i direktsändning. Hon läste upp ett kort uttalande om att hon "inte kan leda ett bolag där nyheterna bestäms i regeringskansliet" och lämnade studion. Klippet har setts av halva landet. Nu vägrar journalisterna läsa nyheterna förrän regeringen lovar att inte lägga sig i.',
    choices: [
      { text: 'LOVA ATT ALDRIG RINGA REDAKTIONEN IGEN', cost: { pp: 12 }, temp: { statepower: -2 }, griev: -6, ind: { pressfree: 3, trustgov: 1 }, fortroende: 4, tip: 'Ett löfte i en lag vore bättre än ett i en intervju. Men det är en början.' },
      { text: 'LÅT DEM STREJKA', temp: { approval: -2 }, griev: 4, fortroende: -2, next: 'md_ps_strejken', tip: 'Kvällsnyheterna byts mot en naturfilm om sälar. Folk tittar på sälarna.' },
      { text: 'UTSE EN LOJAL CHEF OCH KÖR VIDARE', cost: { pp: 8 }, temp: { statepower: 3, freedom: -3 }, griev: 8, ind: { pressfree: -4 }, fortroende: -6, tip: 'Den nya chefen läser nyheterna själv. Ingen annan vill.' },
    ],
  },
  {
    id: 'md_ps_strejken', icon: '\u{1F9AD}', chain: true, kind: 'frihet',
    title: 'SÄLARNA PÅ KVÄLLSNYHETERNA',
    text: 'Tredje veckan i rad har kvällsnyheterna på {ps} ersatts av en naturfilm om sälar. Sälarna har fler tittare än nyheterna någonsin haft. Journalisterna står med plakat utanför tv-huset i {huvudstad} och får kaffe av förbipasserande. Men när en storm drog in över kusten i går kom varningen för sent.',
    choices: [
      { text: 'FÖRHANDLA FRAM ETT OBEROENDE I LAG', cost: { pp: 15 }, perm: { freedom: 1, stability: 1 }, griev: -8, ind: { pressfree: 4 }, fortroende: 5, tip: 'Journalisterna går tillbaka. Sälarna får en egen kanal.' },
      { text: 'ERSÄTT DEM MED PRAKTIKANTER', cost: { money: 60 }, temp: { freedom: -2, approval: -2 }, griev: 6, fortroende: -4, tip: 'Praktikanterna gör sitt bästa. Det syns.' },
      { text: 'VÄNTA UT DEM', temp: { approval: -3, stability: -1 }, griev: 5, fortroende: -3, tip: 'Strejkkassan räcker en månad till. Sälarna räcker längre.' },
    ],
  },

  // ===== KANALERNA =====
  {
    id: 'md_miljardar_kop', icon: '\u{1F4BC}', weight: 2, cooldown: 1100,
    title: 'MILJARDÄREN VILL KÖPA {KANAL}',
    text: 'Landets rikaste man, som äger gruvor, en flygplats och halva fastighetsbeståndet i {stad}, har lagt ett bud på {kanal}. Han lovar att "inte lägga sig i journalistiken". Samma kanal har granskat hans skatteupplägg tre gånger. Redaktionen har skrivit ett protestbrev, och konkurrensmyndigheten väntar på regeringens linje.',
    when: (c) => c.media.channels >= 2 && c.media.pressLevel >= 2 && c.media.critical > 10 && c.day > 90,
    choices: [
      { text: 'STOPPA AFFÄREN MED KONKURRENSLAGEN', cost: { pp: 12 }, temp: { gdp: -1 }, ind: { pressfree: 2 }, fortroende: 3, tip: 'Miljardären köper en fotbollsklubb i stället. Den granskar ingen.' },
      { text: 'LÅT AFFÄREN GÅ IGENOM', temp: { gdp: 1 }, fortroende: -2, next: 'md_miljardar_agare', tip: 'Han lovar att inte lägga sig i. Det brukar de lova.' },
      { text: 'KÖP KANALEN SJÄLV INNAN HAN GÖR DET', kanal: 'kop', cost: { money: 600 }, temp: { statepower: 2, freedom: -2 }, ind: { pressfree: -3 }, fortroende: -3, tip: 'Nu är det staten som lovar att inte lägga sig i.' },
    ],
  },
  {
    id: 'md_miljardar_agare', icon: '\u{1F3E2}', chain: true,
    title: 'DEN NYA ÄGAREN STÄDAR',
    text: 'Tre månader efter köpet har den nya ägaren bytt chefredaktör, lagt ned grävgruppen och "flyttat fokus till positiva nyheter". Hans egna bolag har inte nämnts sedan dess. Tolv av kanalens mest kända journalister har sagt upp sig samma dag. De vill starta något eget och behöver ett sändningstillstånd.',
    choices: [
      { text: 'GE DE AVHOPPADE ETT SÄNDNINGSTILLSTÅND', nykanal: true, temp: { freedom: 1 }, ind: { pressfree: 2 }, fortroende: 3, next: [null, 'md_miljardar_nystart'], tip: 'Tolv journalister och en hyrd källare. Så började de flesta bra redaktioner.' },
      { text: 'INFÖR REGLER OM ÄGARNAS INFLYTANDE', cost: { pp: 14 }, perm: { corruption: -1 }, ind: { pressfree: 2 }, fortroende: 2, tip: 'En redaktionell stadga i lag. Ägare får äga, men inte styra nyheterna.' },
      { text: 'DET ÄR HANS KANAL, HAN BESTÄMMER', temp: { gdp: 1 }, perm: { corruption: 1 }, fortroende: -3, tip: 'Positiva nyheter är trevliga. Det är bara inte nyheter.' },
    ],
  },
  {
    id: 'md_miljardar_nystart', icon: '\u{1F331}', chain: true,
    title: 'KÄLLARREDAKTIONEN VÄXER',
    text: 'Journalisterna som lämnade miljardärens kanal sänder nu från en före detta bilverkstad i {huvudstad}. De lever på 40 000 prenumeranter som betalar en slant i månaden, och deras första granskning, om ett bostadsbolags fuskbyggen, ledde till att två chefer fick gå. Unga tittare är överrepresenterade.',
    choices: [
      { text: 'GE ALLA NYA REDAKTIONER ETT STARTSTÖD', cost: { money: 120 }, perm: { freedom: 1 }, fortroende: 3, tip: 'Små redaktioner håller de stora vakna.' },
      { text: 'GRATULERA DEM OFFENTLIGT', temp: { approval: 1 }, fortroende: 2, tip: 'De tackar och börjar granska dig nästa vecka. Som sig bör.' },
      { text: 'GRANSKA DERAS FINANSIERING', cost: { pp: 6 }, temp: { statepower: 1 }, ind: { pressfree: -1 }, fortroende: -2, tip: 'Det är 40 000 vanliga människor. Det står snart i varenda tidning.' },
    ],
  },
  {
    id: 'md_utlandsk_propaganda', icon: '\u{1F4E1}', weight: 2, cooldown: 900,
    title: 'KANALEN FRÅN {GRANNE}',
    text: 'En kanal som betalas av regeringen i {granne} sänder dygnet runt på landets språk. Den är välgjord, gratis och full av påståenden om att {rike} håller på att falla samman: tomma butiker, köpta domare och upplopp som aldrig ägt rum. Var femte invånare tittar ibland. Säkerhetspolisen vill att den stängs av.',
    when: (c) => (c.st.stability < 0 || c.atWar) && c.media.trust < 60 && c.day > 60,
    choices: [
      { text: 'STÄNG AV SÄNDNINGARNA', cost: { pp: 8 }, temp: { freedom: -2, stability: 1 }, rel: -3, fortroende: -1, tip: 'Störsändare kostar. Och de som tittade undrar vad de inte får se.' },
      { text: 'SVARA MED FAKTA I {PS}', cost: { money: 120 }, temp: { stability: 1 }, fortroende: 3, tip: 'Tråkiga fakta mot spännande lögner. Det tar tid, men fakta har uthållighet.' },
      { text: 'LÄR ALLA SKOLBARN KÄLLKRITIK', cost: { money: 80 }, perm: { stability: 1 }, fortroende: 2, tip: 'Om tio år genomskådar en hel generation propaganda. Även din.' },
      { text: 'LÅT DEN SÄNDA', temp: { stability: -2 }, ind: { trustgov: -2 }, fortroende: -1, tip: 'Den som tittar på lögner varje kväll börjar till slut tro på några.' },
    ],
  },
  {
    id: 'md_falska_nyheter', icon: '\u{1F6B0}', weight: 2, cooldown: 900,
    title: 'RYKTET OM KRANVATTNET',
    text: 'Ett meddelande om att kranvattnet i {stad} är förgiftat har delats två miljoner gånger på en helg. Det är falskt: vattenverket mäter varje timme. Ändå är flaskvattnet slut i butikerna och några skolor har stängt kranarna. Samma dag sprids ett nytt rykte, om att bankerna ska stänga på måndag.',
    when: (c) => (c.ind.internet ?? 60) > 50 && c.media.trust < 45 && c.day > 30,
    choices: [
      { text: 'STARTA EN OBEROENDE FAKTAGRANSKNING', cost: { money: 120 }, temp: { stability: 1 }, fortroende: 4, next: [null, 'md_bankrykte'], tip: 'Faktagranskningen är långsammare än ryktet. Men den finns kvar när ryktet är glömt.' },
      { text: 'DRICK ETT GLAS KRANVATTEN I DIREKTSÄNDNING', next: ['md_bankrykte', null], tip: 'Ett glas vatten mot två miljoner delningar.',
        risk: { chance: 0.6,
          win: { text: 'Folk skrattar och lugnar sig. Skolorna öppnar kranarna igen.', temp: { stability: 2, approval: 2 }, fortroende: 2 },
          lose: { text: 'Nu säger ryktet att statschefen fick rent vatten i hemlighet.', temp: { stability: -1 }, fortroende: -2 } } },
      { text: 'FÖRBJUD FALSKA NYHETER I LAG', cost: { pp: 15 }, law: ['speech', 'fakenews'], temp: { freedom: -3, stability: 2 }, ind: { pressfree: -3 }, fortroende: -1, tip: 'Vem bestämmer vad som är falskt? Från och med nu: regeringen.' },
      { text: 'VÄNTA TILLS DET BLÅSER ÖVER', temp: { stability: -2 }, fortroende: -2, next: 'md_bankrykte', tip: 'Ryktet om bankerna har redan nått pensionärerna.' },
    ],
  },
  {
    id: 'md_bankrykte', icon: '\u{1F3E6}', chain: true,
    title: 'KÖERNA UTANFÖR BANKERNA',
    text: 'Ryktet om att bankerna ska stänga har fått tusentals människor att ställa sig i kö för att ta ut sina pengar. Bankerna är friska, säger centralbanken, men ingen bank klarar att alla vill ha sina pengar samma dag. I {stad} har ett kontor fått slut på sedlar. Nyhetskanalerna sänder direkt från köerna.',
    choices: [
      { text: 'LÅT CENTRALBANKSCHEFEN TALA I ALLA KANALER', cost: { pp: 8 }, temp: { stability: 2 }, ind: { stockcap: 2 }, fortroende: 3, tip: 'Ett lugnt ansikte och en tråkig graf. Precis vad som behövs.' },
      { text: 'GARANTERA ALLA INSÄTTNINGAR', cost: { money: 200 }, temp: { stability: 3, gdp: -1 }, ind: { stockcap: 3 }, fortroende: 1, tip: 'Folk går hem. Garantin syns i statens böcker i tio år.' },
      { text: 'BE KANALERNA SLUTA SÄNDA FRÅN KÖERNA', temp: { freedom: -2, stability: -1 }, ind: { stockcap: -4 }, fortroende: -3, tip: 'Nu tror alla att det är ännu värre än det ser ut.' },
    ],
  },
  {
    id: 'md_deepfake', icon: '\u{1F3AD}', weight: 2, cooldown: 1100,
    title: 'STATSCHEFEN SOM ALDRIG SA DET',
    text: 'En video där du verkar säga att semestern ska avskaffas och att {granne} "snart får vad de förtjänar" sprids över hela nätet. Den är falsk och gjord med AI, men rösten, händerna och leendet är perfekta. {kanal} har visat den med en varning. Ambassadören från {granne} har begärt ett möte.',
    when: (c) => (c.ind.internet ?? 60) > 60 && c.media.channels >= 1 && c.media.trust < 65 && c.day > 150,
    choices: [
      { text: 'VISA ORIGINALET OCH FÖRKLARA TEKNIKEN', cost: { pp: 6 }, rel: 1, fortroende: 3, next: [null, 'md_deepfake_upphov'], tip: 'En lektion i hur falska videor görs. Halva landet lär sig något.' },
      { text: 'RING REGERINGEN I {GRANNE} DIREKT', cost: { pp: 4 }, rel: 4, tip: 'Ett samtal på tio minuter. Sedan skrattar båda statscheferna, lite ansträngt.' },
      { text: 'KRÄV ATT {KANAL} TAR BORT INSLAGET', kanal: 'censur', temp: { freedom: -2 }, ind: { pressfree: -2 }, fortroende: -3, tip: 'Kanalen lyder. Videon finns kvar överallt där den inte visades med varning.' },
      { text: 'JAGA DEN SOM GJORDE DEN', cost: { money: 100 }, temp: { stability: 1 }, next: 'md_deepfake_upphov', tip: 'Polisens it-utredare tar fram förstoringsglaset. Det digitala.' },
    ],
  },
  {
    id: 'md_deepfake_upphov', icon: '\u{1F575}\u{FE0F}', chain: true,
    title: 'VEM GJORDE VIDEON?',
    text: 'Polisens it-utredare har hittat upphovet till den falska videon. Den gjordes inte av en främmande makt utan av en sextonåring i {stad} som ville "se om det gick". Det gick. Han har redan bett om ursäkt, och hans mamma har ringt regeringskansliet två gånger. Nu frågar alla vad straffet ska bli.',
    choices: [
      { text: 'ANSTÄLL HONOM SOM IT-SÄKERHETSEXPERT', cost: { money: 20 }, temp: { approval: 3 }, rel: 1, fortroende: 1, tip: 'Han får ett passerkort och en stol. Hans mamma är fortfarande arg.' },
      { text: 'LÅT DOMSTOLEN BESTÄMMA', temp: { stability: 1 }, ind: { trustgov: 1 }, fortroende: 1, tip: 'Han får samhällstjänst på ett bibliotek. Han börjar läsa.' },
      { text: 'STIFTA EN LAG MOT FALSKA VIDEOR', cost: { pp: 12 }, temp: { freedom: -1, stability: 1 }, fortroende: 2, tip: 'Lagen är bra. Satirprogrammen undrar om den gäller dem.' },
    ],
  },
  {
    id: 'md_influencern', icon: '\u{1F933}', weight: 2, cooldown: 1000,
    title: 'NITTONÅRINGEN SOM SLOG UT NYHETERNA',
    text: 'En nittonåring från {stad} som direktsänder från sitt pojkrum har fler tittare än alla landets nyhetsprogram tillsammans. Han blandar spel, frisyrtips och politik, och i går sa han att regeringens nya skolplan "är det dummaste jag hört". Tre miljoner såg det. Nyhetscheferna har kallat till krismöte.',
    when: (c) => (c.ind.internet ?? 60) > 70 && c.media.trust < 60 && c.day > 60,
    choices: [
      { text: 'BJUD IN HONOM TILL REGERINGSKANSLIET', cost: { pp: 4 }, temp: { approval: 3 }, tip: 'Han sänder direkt från kansliet. Han hittar sju saker som är dumma.' },
      { text: 'STÖD NYHETER SOM UNGA FAKTISKT SER', cost: { money: 120 }, fortroende: 3, tip: 'Korta, ärliga nyheter i telefonen. Det tar år, men de unga börjar lyssna.' },
      { text: 'KRÄV ÅLDERSKONTROLL PÅ NÄTET', cost: { pp: 10 }, law: ['internet', 'ageverify'], temp: { freedom: -2, approval: -2 }, fortroende: -1, tip: 'Nittonåringen är nitton. Hans tittare är tretton.' },
      { text: 'STRUNTA I HONOM', temp: { approval: -1 }, fortroende: -1, tip: 'Han gör ett avsnitt om att du struntar i honom. Det blir hans mest sedda.' },
    ],
  },
  {
    id: 'md_lokaltidningen', icon: '\u{1F4F0}', weight: 2, cooldown: 1000,
    title: 'SISTA NUMRET AV LOKALTIDNINGEN',
    text: 'Lokaltidningen i {stad} har kommit ut varje morgon i 140 år. I dag trycks det sista numret. Annonserna har flyttat till nätet och prenumeranterna har blivit gamla. Framsidan är en bild av redaktionen, sju personer, och rubriken "Tack och förlåt". Ingen kommer längre att bevaka kommunen, tingsrätten eller hockeylaget.',
    when: (c) => c.media.channels <= 6 && c.media.trust < 60 && (c.ind.internet ?? 60) > 40 && c.day > 100,
    choices: [
      { text: 'INFÖR ETT PRESSTÖD FÖR LOKALA NYHETER', cost: { money: 150 }, nykanal: true, fortroende: 3, next: [null, 'md_lokal_nystart'], tip: 'Ett litet stöd till de små. Billigare än vad korruptionen kostar.' },
      { text: 'BE {PS} ÖPPNA ETT LOKALKONTOR', cost: { money: 80 }, fortroende: 2, tip: 'En reporter och en bil. Hon täcker fyra kommuner. Bättre än ingen.' },
      { text: 'TIDEN HAR SPRUNGIT IFRÅN PAPPERET', temp: { qol: -1 }, fortroende: -2, next: 'md_lokaltidning_svart', tip: 'Det är sant. Det är också sant att ingen läser kommunens räkenskaper nu.' },
    ],
  },
  {
    id: 'md_lokaltidning_svart', icon: '\u{1F4B0}', chain: true,
    title: 'NÄR INGEN TITTADE',
    text: 'Ett år efter att lokaltidningen i {stad} lades ned visar en revision att kommunens ekonomichef har fört över pengar till sitt eget bolag i två år. Ingen märkte något. Fullmäktiges möten hade ingen publik och protokollen lästes inte av någon. Forskare kallar det "nyhetsöknar", och {stad} är inte den enda.',
    choices: [
      { text: 'STÖD LOKALA NYHETER I HELA LANDET', cost: { money: 200 }, nykanal: true, perm: { corruption: -2 }, fortroende: 3, tip: 'En reporter i fullmäktige kostar mindre än en ekonomichef med eget bolag.' },
      { text: 'SKÄRP REVISIONEN I ALLA KOMMUNER', cost: { pp: 10 }, perm: { corruption: -2 }, tip: 'Revisorerna gör jobbet. De är bara inte lika snabba som en nyfiken reporter.' },
      { text: 'ÅTALA EKONOMICHEFEN OCH GÅ VIDARE', temp: { approval: 1 }, perm: { corruption: 1 }, fortroende: -1, tip: 'En åtalas. I nästa kommun sitter någon och räknar på samma sak.' },
    ],
  },
  {
    id: 'md_lokal_nystart', icon: '\u{1F4FB}', chain: true,
    title: 'NYA LOKALNYHETER I {STAD}',
    text: 'Med hjälp av presstödet har tre av de gamla reportrarna startat en nyhetssajt i {stad}. De sänder fullmäktige direkt, skriver om skolorna och har ett eget radioprogram på lördagar. Efter ett halvår har de 9 000 betalande läsare. Den första granskningen gällde en badhusrenovering som blev dubbelt så dyr.',
    choices: [
      { text: 'GÖR STÖDET TILL LOKALA NYHETER PERMANENT', cost: { money: 100 }, perm: { corruption: -1 }, fortroende: 2, tip: 'Badhuset blev dyrt. Nästa badhus blir det kanske inte.' },
      { text: 'BESÖK REDAKTIONEN', temp: { approval: 1 }, fortroende: 1, tip: 'Du får kaffe och tre kritiska frågor. Det står i lördagens program.' },
      { text: 'LÅT STÖDET LÖPA UT', res: { money: 60 }, fortroende: -2, tip: 'Sajten klarar sig ett år till. Sedan blir det tyst igen.' },
    ],
  },
  {
    id: 'md_tillstandet', icon: '\u{1F4DD}', weight: 2, cooldown: 800, kind: 'frihet',
    title: 'EN NY KANAL SÖKER TILLSTÅND',
    text: 'En grupp journalister och en pensionerad tv-producent från {stad} har sökt sändningstillstånd för en ny nyhetskanal. De har pengar för två år, en studio i en gammal biograf och en idé om "nyheter utan skrik". Myndigheten har inget att invända, men tillståndet kräver regeringens underskrift.',
    when: (c) => c.media.channels <= 5 && c.media.pressLevel >= 2 && c.day > 60,
    choices: [
      { text: 'BEVILJA TILLSTÅNDET', nykanal: true, temp: { freedom: 1 }, griev: -2, fortroende: 2, tip: 'En kanal till. Den granskar dig redan första veckan.' },
      { text: 'BEVILJA MED VILLKOR OM BALANS', cost: { pp: 5 }, nykanal: true, temp: { statepower: 1 }, fortroende: 1, tip: 'Balans är bra. Vem som mäter den är en annan fråga.' },
      { text: 'AVSLÅ, DET FINNS KANALER NOG', temp: { statepower: 2, freedom: -1 }, griev: 4, ind: { pressfree: -1 }, fortroende: -2, tip: 'Biografen blir en bilhandel. Producenten skriver en bok om varför.' },
    ],
  },
  {
    id: 'md_kanal_konkurs', icon: '\u{1F4C9}', weight: 2, cooldown: 1000,
    title: '{KANAL} ÄR PÅ VÄG I KONKURS',
    text: 'Annonsörerna har dragit sig undan när ekonomin går sämre, och {kanal} har inte råd att betala lönerna nästa månad. 300 anställda kan förlora jobbet och landet en av sina största nyhetsredaktioner. Ägarna vill ha ett statligt lån. Konkurrenterna säger att staten inte ska rädda en kanal som inte går runt.',
    when: (c) => c.media.channels >= 2 && ((c.ind.gdpgrowth ?? 2) < 0.5 || c.mod('downturn')) && c.day > 60,
    choices: [
      { text: 'GE ETT TILLFÄLLIGT KRISSTÖD', kanal: 'stod', cost: { money: 250 }, temp: { approval: 1 }, fortroende: 1, tip: 'Kanalen klarar sig. Den blir lite vänligare mot dig. Det märks.' },
      { text: 'KÖP KANALEN BILLIGT', kanal: 'kop', cost: { money: 400 }, temp: { statepower: 2, freedom: -1 }, ind: { pressfree: -2 }, fortroende: -2, tip: 'Ett fynd. Journalisterna undrar vem som är deras chef nu.' },
      { text: 'LÅT MARKNADEN AVGÖRA', temp: { approval: -1 }, ind: { pressfree: -1, unemp: 0.1 }, fortroende: -1, tip: 'Kanalen klarar sig med nöd och näppe. Grävgruppen läggs ned först.' },
    ],
  },
  {
    id: 'md_journaliststrejk', icon: '\u{1FAA7}', weight: 2, cooldown: 1100,
    title: 'JOURNALISTERNA STREJKAR',
    text: 'Journalisterna har gått ut i strejk på landets fyra största nyhetsredaktioner efter att lönerna stått still i fem år medan priserna stigit. Kvällsnyheterna läses av en chef som inte läst nyheter sedan han var ung, och en av tidningarna har tryckt korsord på förstasidan. Förbundet vill att staten medlar.',
    when: (c) => c.media.channels >= 3 && c.media.pressLevel >= 2 && ((c.ind.infl ?? 2) > 4 || c.grievOf('kris') > 15),
    choices: [
      { text: 'SKICKA STATENS MEDLARE', cost: { pp: 6 }, temp: { stability: 1 }, fortroende: 2, tip: 'Tre nätter med kaffe och wienerbröd. Sedan ett avtal.' },
      { text: 'HÖJ PRESSTÖDET SÅ ATT ÄGARNA KAN BETALA', cost: { money: 150 }, temp: { approval: 1 }, fortroende: 2, tip: 'Pengarna hamnar i lönekuvertet. Ägarna tackar också, lite för mycket.' },
      { text: 'DET ÄR EN SAK FÖR PARTERNA', temp: { stability: -1 }, ind: { strikes: 10 }, fortroende: -2, tip: 'Korsorden blir populära. Nyheterna saknas mest när något händer.' },
    ],
  },
  {
    id: 'md_satiren', icon: '\u{1F921}', weight: 2, cooldown: 900,
    title: 'DOCKAN SOM SER UT SOM DU',
    text: 'Satirprogrammet på {kanal} har fått en ny huvudperson: en docka av statschefen med för stor näsa och en krona av papp, som varje fredag förklarar regeringens beslut för en förvirrad katt. Programmet är veckans mest sedda. Dina rådgivare tycker att det är förolämpande. Barnen i hela landet tycker att det är jätteroligt.',
    when: (c) => c.media.channels >= 1 && c.media.pressLevel >= 2 && c.st.approval < 25 && c.day > 60,
    choices: [
      { text: 'SKRATTA MED OCH GÄSTA PROGRAMMET', cost: { pp: 4 }, next: 'md_satir_gast', tip: 'Ingen kan göra narr av den som skrattar först. I teorin.' },
      { text: 'KRÄV EN URSÄKT', temp: { approval: -2 }, fortroende: -1, tip: 'Dockan ber om ursäkt nästa fredag. Till katten.' },
      { text: 'LÅT DET VARA', temp: { approval: 1 }, fortroende: 1, tip: 'En regering som tål satir verkar starkare än en som inte gör det.' },
      { text: 'STOPPA PROGRAMMET', kanal: 'censur', temp: { freedom: -3, approval: -2 }, ind: { pressfree: -3 }, fortroende: -4, tip: 'Dockan blir en martyr. Den säljs nu i alla leksaksaffärer.' },
    ],
  },
  {
    id: 'md_satir_gast', icon: '\u{1F3AD}', chain: true,
    title: 'STATSCHEFEN MÖTER SIN DOCKA',
    text: 'I kväll sitter du i studion bredvid dockan med pappkronan. Manuset har du inte fått se. Halva landet tittar, och programledaren har lovat att "ingen fråga är för dum". Dockan har redan frågat om du tänker ta med dig katten hem efteråt.',
    choices: [
      { text: 'IMPROVISERA OCH VAR DIG SJÄLV', tip: 'Humor går inte att förbereda. Det har ingen talskrivare förstått.',
        risk: { chance: 0.6,
          win: { text: 'Du får hela studion att skratta och dockan blir svarslös. Landet älskar det.', temp: { approval: 6, stability: 1 }, fortroende: 2 },
          lose: { text: 'Skämtet om skattetabellerna faller platt. Tystnaden i studion varar i fem sekunder.', temp: { approval: -3 } } } },
      { text: 'LÄS INNANTILL FRÅN ETT KORT', temp: { approval: 1 }, tip: 'Säkert och stelt. Dockan läser också från ett kort, för att vara snäll.' },
      { text: 'TA MED KATTEN HEM', temp: { approval: 4 }, fortroende: 1, tip: 'Katten heter numera Statsrådet. Den sover på ditt skrivbord.' },
    ],
  },
  {
    id: 'md_partikanalen', icon: '\u{1F4E2}', weight: 2, cooldown: 1000,
    title: 'FYRA TIMMAR OM KOMPOST',
    text: 'Den regeringsvänliga kanalen sände i går ditt tal om kommunal kompostering i sin helhet, i fyra timmar, följt av en panel där alla höll med. Tittarsiffran var lägre än antalet anställda. Kanalen får ändå mer statligt stöd varje år, och dess reportrar sitter alltid längst fram på dina pressträffar.',
    when: (c) => c.media.friendly > 30 && c.media.stateShare > 40,
    choices: [
      { text: 'DRA IN STÖDET TILL DE VÄNLIGA KANALERNA', res: { money: 100 }, temp: { statepower: -1 }, fortroende: 3, tip: 'Kanalen blir plötsligt intresserad av vad oppositionen tycker.' },
      { text: 'BE DEM ÅTMINSTONE KORTA SÄNDNINGARNA', temp: { approval: 1 }, fortroende: 1, tip: 'Nästa tal sänds i tre timmar och femtio minuter.' },
      { text: 'HÖJ STÖDET, DE ÄR VÅRA VÄNNER', cost: { money: 100 }, temp: { ideopower: 2, statepower: 1 }, fortroende: -2, tip: 'Vänner som ingen ser är dyra vänner.' },
    ],
  },
  {
    id: 'md_trons_kanal', icon: '\u{1F54A}\u{FE0F}', weight: 1, cooldown: 1200,
    title: 'TROSSAMFUNDEN VILL HA EN KANAL',
    text: 'Ett tiotal trossamfund har gått samman och söker tillstånd för en kanal med gudstjänster, körsång, samtal om livets stora frågor och en barntimme på söndagar. De vill ha samma villkor som andra kanaler. Sekulära föreningar varnar för att den kan bli en plattform för predikanter med hårda budskap.',
    when: (c) => (c.ind.believers ?? 60) > 60 && c.media.pressLevel >= 1 && c.is('religion', 'secularism', 'pluralism', 'established', 'statereligion') && c.day > 100,
    choices: [
      { text: 'BEVILJA, MED SAMMA REGLER SOM FÖR ALLA', nykanal: true, temp: { stability: 1 }, fortroende: 1, tip: 'Söndagskören får fler tittare än fotbollen. Ingen hade väntat sig det.' },
      { text: 'LÅT {PS} SÄNDA GUDSTJÄNSTER I STÄLLET', cost: { money: 60 }, temp: { approval: 1, stability: 1 }, tip: 'En gudstjänst i veckan, varannan gång från ett annat samfund.' },
      { text: 'AVSLÅ ANSÖKAN', temp: { approval: -2, freedom: -1 }, fortroende: -1, tip: 'De troende minns det. De har lång erfarenhet av att minnas.' },
    ],
  },
  {
    id: 'md_hotad_reporter', icon: '\u{1F6E1}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'REPORTERN SOM FICK HOT',
    text: 'En kriminalreporter på {kanal} har fått hot efter en serie om gängens penningtvätt i {stad}. Någon har skrivit hennes adress på en vägg utanför redaktionen. Hon vill fortsätta, men chefredaktören funderar på att lägga ned serien. Reportrar på andra redaktioner säger att de redan väljer bort de farligaste ämnena.',
    when: (c) => c.media.channels >= 1 && (c.ind.gangs ?? 50) > 90 && c.day > 60,
    choices: [
      { text: 'GE HENNE POLISSKYDD', cost: { money: 60 }, griev: -3, ind: { pressfree: 1 }, fortroende: 2, tip: 'Hon skriver färdigt serien med en polis i fikarummet.' },
      { text: 'GÖR HOT MOT JOURNALISTER TILL ETT GROVT BROTT', cost: { pp: 10 }, perm: { safety: 1 }, griev: -4, ind: { pressfree: 2 }, fortroende: 2, tip: 'Den som hotar en reporter hotar alla som vill veta. Nu säger lagen det också.' },
      { text: 'DET ÄR KANALENS ANSVAR', griev: 3, ind: { pressfree: -2 }, fortroende: -2, tip: 'Serien läggs ned. Gängen läste också nyheterna, och de förstod.' },
    ],
  },
  {
    id: 'md_annonsbojkott', icon: '\u{1F6AB}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'STATEN SLUTAR ANNONSERA I {KANAL}',
    text: 'Efter en månad av kritiska reportage har ett möte med statssekreterarna "rekommenderat" att myndigheter och statliga bolag annonserar någon annanstans än i {kanal}. Det handlar om en åttondel av kanalens intäkter. Beslutet har inte skrivits ned någonstans, men alla vet om det.',
    when: (c) => c.media.channels >= 1 && c.media.critical > 30 && c.media.climate < 0,
    choices: [
      { text: 'STOPPA BOJKOTTEN, ANNONSER GÅR EFTER RÄCKVIDD', temp: { statepower: -1 }, griev: -3, ind: { pressfree: 1 }, fortroende: 2, tip: 'Ett mejl till alla myndigheter. Fem minuter som räddar ditt rykte.' },
      { text: 'FORTSÄTT I TYSTHET', kanal: 'censur', temp: { freedom: -2 }, griev: 5, ind: { pressfree: -2 }, fortroende: -3, tip: 'Kanalen sparar och tonar ned granskningarna. Det var meningen.' },
      { text: 'FLYTTA PENGARNA TILL VÄNLIGA KANALER', cost: { money: 60 }, temp: { ideopower: 2, freedom: -2 }, griev: 6, ind: { pressfree: -3 }, fortroende: -4, tip: 'Nu finns det ett system. System brukar upptäckas.' },
    ],
  },
  {
    id: 'md_presstodet', icon: '\u{1F4B6}', weight: 2, cooldown: 900,
    title: 'PRESSTÖD, MEN TILL VEM?',
    text: 'Presstödet ska fördelas för nästa år. {kanal}, som är regeringens hårdaste granskare, har sökt mest. Dina rådgivare påpekar att den som får pengar av staten sällan biter handen som föder den. Oppositionen påpekar att det är precis därför fördelningen borde skötas av någon annan än regeringen.',
    when: (c) => c.media.channels >= 2 && c.media.critical > 20 && c.media.pressLevel >= 1,
    choices: [
      { text: 'LÅT EN OBEROENDE NÄMND FÖRDELA', cost: { pp: 8 }, perm: { freedom: 1 }, ind: { pressfree: 2 }, fortroende: 3, tip: 'Du förlorar en hävstång. Folket får nyheter som ingen har köpt.' },
      { text: 'GE {KANAL} ETT GENERÖST STÖD', kanal: 'stod', cost: { money: 150 }, temp: { approval: 1 }, fortroende: -1, tip: 'Granskningarna blir lite mjukare. Ingen har bett om det. Det blir så ändå.' },
      { text: 'GE PENGARNA TILL DE VÄNLIGA', cost: { money: 100 }, temp: { ideopower: 2 }, ind: { pressfree: -2 }, fortroende: -3, tip: 'Det kallas presstöd. Det borde kallas något annat.' },
      { text: 'DRA IN PRESSTÖDET HELT', res: { money: 100 }, ind: { pressfree: -1 }, fortroende: -2, tip: 'Staten sparar. Tre små tidningar på landsbygden gör det inte.' },
    ],
  },

  // ===== CENSUR OCH PRESSFRIHET =====
  {
    id: 'md_journalist_forhor', icon: '\u{1F6A8}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'JOURNALISTEN SOM FÖRDES TILL FÖRHÖR',
    text: 'En reporter på {kanal} som skrev om hur ministrarnas släktingar fått statliga jobb fördes i går till förhör av säkerhetspolisen. Hon släpptes efter tre dagar utan att åtalas, men hennes dator och telefon behölls. Hennes kollegor har samlats utanför polishuset i {huvudstad} med tejp över munnen.',
    when: (c) => c.media.pressLevel <= 1 && c.media.channels >= 1 && c.day > 60,
    choices: [
      { text: 'LÄMNA TILLBAKA DATORN OCH BE OM URSÄKT', cost: { pp: 8 }, temp: { statepower: -1 }, griev: -4, ind: { pressfree: 2 }, fortroende: 3, tip: 'En ursäkt från säkerhetspolisen. Det har aldrig hänt förut.' },
      { text: 'SÄG ATT DET VAR ETT VANLIGT FÖRHÖR', temp: { statepower: 1 }, griev: 4, ind: { pressfree: -2 }, fortroende: -2, next: ['md_journalist_varlden', null], tip: 'Vanliga förhör brukar inte ta tre dagar.' },
      { text: 'ÅTALA HENNE FÖR ATT HA RÖJT HEMLIGHETER', cost: { pp: 10 }, temp: { statepower: 2, freedom: -3 }, griev: 9, mod: 'martyr', ind: { pressfree: -4 }, fortroende: -4, next: 'md_journalist_varlden', tip: 'Ministrarnas släktingar blir landets mest kända. Inte på det sätt de ville.' },
    ],
  },
  {
    id: 'md_journalist_varlden', icon: '\u{1F310}', chain: true, kind: 'frihet',
    title: 'VÄRLDEN SKRIVER OM HENNE',
    text: 'Reportern från {kanal} har blivit ett namn i hela världen. Tidningar i {land} har hennes ansikte på förstasidan, ett trettiotal regeringar har krävt att hon lämnas i fred och en stor journalistorganisation har startat en kampanj. Ambassadörerna i {huvudstad} har bett om ett gemensamt möte med utrikesministern.',
    choices: [
      { text: 'LÅT HENNE RESA OCH TA EMOT HYLLNINGARNA', temp: { approval: 1 }, rel: 4, griev: -4, ind: { pressfree: 2 }, fortroende: 2, next: [null, 'md_journalist_pris'], tip: 'Hon kommer tillbaka. Det är det som skrämmer dina rådgivare mest.' },
      { text: 'BELÄGG HENNE MED RESEFÖRBUD', temp: { statepower: 2, freedom: -2 }, rel: -6, griev: 6, ind: { pressfree: -2 }, next: 'md_journalist_pris', tip: 'Hon får priset ändå. Stolen på scenen står tom.' },
      { text: 'ANKLAGA OMVÄRLDEN FÖR INBLANDNING', cost: { pp: 6 }, temp: { ideopower: 3 }, rel: -4, griev: 3, fortroende: -2, tip: 'Statstelevisionen gillar det. Ingen annan gör det.' },
    ],
  },
  {
    id: 'md_journalist_pris', icon: '\u{1F3C5}', chain: true, kind: 'frihet',
    title: 'PRISET OCH DEN TOMMA STOLEN',
    text: 'Reportern har fått ett av världens finaste pressfrihetspriser. På galan i {land} läste hon, eller en kollega i hennes ställe, upp ett tal om att "ett land som fruktar sina journalister fruktar sig självt". Talet har setts tolv miljoner gånger, också i {rike}, trots att det aldrig sändes här.',
    choices: [
      { text: 'GRATULERA HENNE OFFENTLIGT', cost: { pp: 8 }, temp: { approval: 2 }, rel: 3, griev: -5, ind: { pressfree: 3 }, fortroende: 3, tip: 'En gratulation från regeringen. Ingen visste att det var möjligt.' },
      { text: 'TIG', rel: -1, griev: 3, fortroende: -1, tip: 'Tystnaden sänds på alla utländska kanaler.' },
      { text: 'STOPPA TALET PÅ NÄTET', law: ['internet', 'censored'], temp: { freedom: -3, statepower: 2 }, rel: -4, griev: 7, ind: { pressfree: -3 }, fortroende: -3, tip: 'Ungdomarna lär sig kringgå spärren på en kväll. Sedan lär de sina föräldrar.' },
    ],
  },
  {
    id: 'md_underjordisk', icon: '\u{1F5DE}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'TIDNINGEN SOM TRYCKS I KÄLLAREN',
    text: 'I {stad} har en tidning börjat dyka upp i trappuppgångar och på pendeltåg. Den har fyra sidor, trycks på en gammal stencilapparat och innehåller allt som inte får stå i de vanliga kanalerna: stängda redaktioner, utländska nyheter och skämt om ministrarna. Den kallas Källarbladet. Folk läser den och lägger den vidare.',
    when: (c) => c.media.pressLevel <= 1 && (c.media.censored + c.media.banned) >= 1,
    choices: [
      { text: 'LÅT DEN VARA, DEN ÄR EN VENTIL', temp: { stability: 1 }, griev: -2, fortroende: 1, tip: 'Folk som skrattar i källaren gör sällan revolution på gatan.' },
      { text: 'SÖK EFTER TRYCKERIET', cost: { pp: 8 }, temp: { statepower: 2, freedom: -2 }, griev: 5, next: 'md_tryckeriet', tip: 'Polisen letar i fyra månader. Tidningen kommer ut varje vecka ändå.' },
      { text: 'LÄTTA PÅ CENSUREN SÅ ATT DEN BEHÖVS MINDRE', cost: { pp: 12 }, temp: { freedom: 2 }, griev: -6, ind: { pressfree: 3 }, fortroende: 3, tip: 'Den bästa medicinen mot tidningar i källaren är tidningar ovan jord.' },
    ],
  },
  {
    id: 'md_tryckeriet', icon: '\u{1F50D}', chain: true, kind: 'frihet',
    title: 'STENCILAPPARATEN I {STAD}',
    text: 'Polisen har hittat tryckeriet bakom Källarbladet: en stencilapparat i en församlingslokal i {stad}, skött av en pensionerad lärare, två studenter och en kantor. Läraren säger att hon gärna går i fängelse "om ni kan förklara varför för mina gamla elever". Hela kvarteret har samlats utanför.',
    choices: [
      { text: 'BESLAGTA APPARATEN MEN LÅT DEM GÅ', temp: { statepower: 1 }, griev: 2, fortroende: -1, tip: 'Nästa vecka kommer tidningen ut ändå. Nu skrivs den för hand.' },
      { text: 'ÅTALA ALLA FYRA', cost: { pp: 10 }, temp: { statepower: 2, freedom: -3 }, rel: -3, griev: 9, mod: 'martyr', ind: { pressfree: -3 }, fortroende: -3, tip: 'En pensionerad lärare i rätten. Bilden hamnar i historieböckerna.' },
      { text: 'GE DEM TILLSTÅND ATT GE UT TIDNINGEN', nykanal: true, temp: { freedom: 2 }, griev: -6, ind: { pressfree: 3 }, fortroende: 3, tip: 'Källarbladet flyttar upp till gatuplanet. Det blir genast lite tråkigare.' },
    ],
  },
  {
    id: 'md_utlandsk_radio', icon: '\u{1F4FB}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'RADION FRÅN {LAND} I SMYG',
    text: 'Varje kväll klockan nio drar familjer i hela landet för gardinerna och vrider på kortvågsradion. En radiostation i {land} sänder nyheter om {rike} på landets språk, och den har fler lyssnare än statens nyheter. Säkerhetspolisen tror att vart tredje hushåll lyssnar. Ett av dem är din egen kock.',
    when: (c) => c.media.pressLevel <= 1 && c.media.trust < 50,
    choices: [
      { text: 'BYGG STÖRSÄNDARE', cost: { money: 200 }, temp: { statepower: 2, freedom: -2 }, rel: -2, griev: 4, fortroende: -2, next: 'md_storsandare', tip: 'Ett brus över hela landet. Ett dyrt brus.' },
      { text: 'GÖR DET OLAGLIGT ATT LYSSNA', cost: { pp: 10 }, temp: { freedom: -4, unrest: 3 }, griev: 8, ind: { pressfree: -2 }, fortroende: -3, tip: 'Nu lyssnar man med hörlurar. Kocken också.' },
      { text: 'SLÄPP FRAM MER SANNING I DE EGNA NYHETERNA', cost: { pp: 8 }, temp: { freedom: 2 }, griev: -4, ind: { pressfree: 2 }, fortroende: 3, tip: 'Det enda som slår utländsk radio är inhemsk radio som folk tror på.' },
      { text: 'LÅTSAS INTE OM DET', temp: { stability: -1 }, ind: { trustgov: -2 }, fortroende: -1, tip: 'Klockan nio varje kväll blir landet lite tystare.' },
    ],
  },
  {
    id: 'md_storsandare', icon: '\u{1F4E2}', chain: true,
    title: 'BRUSET SOM STÖRDE ALLT',
    text: 'De nya störsändarna fungerar. De stör den utländska radion, men också flygledarnas radio i {huvudstad}, taxicentralen i {stad} och barnvaktsmonitorer i tre län. Flygbolagen har ställt in tolv avgångar. Och den utländska radiostationen har bytt frekvens två gånger på en vecka.',
    choices: [
      { text: 'STÄNG AV STÖRSÄNDARNA', temp: { approval: 2, statepower: -1 }, fortroende: 1, tip: 'Barnvaktsmonitorerna fungerar igen. Föräldrarna i tre län sover.' },
      { text: 'BYGG MER EXAKTA STÖRSÄNDARE', cost: { money: 250 }, temp: { statepower: 2 }, rel: -1, fortroende: -1, tip: 'Ingenjörerna behöver ett år. Radiostationen behöver en ny frekvens.' },
      { text: 'SKYLL PÅ SOLSTORMAR', temp: { approval: -2 }, ind: { trustgov: -2 }, fortroende: -2, tip: 'Solen får skulden. Den har inga advokater.' },
    ],
  },
  {
    id: 'md_censur_bakslag', icon: '\u{1F4A5}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'ARTIKELN SOM INTE FICK FINNAS',
    text: 'Censuren stoppade en artikel om att hälsoministern köpt en sommarvilla för en tredjedel av marknadspriset. Innan den stoppades hade den lästs av tvåtusen personer. I dag har den lästs av två miljoner, kopierats på hundratals sajter och översatts till fyra språk. Villan har blivit en turistattraktion.',
    when: (c) => c.media.censored >= 1 && c.media.channels >= 1,
    choices: [
      { text: 'HÄV CENSUREN OCH UTRED MINISTERN', kanal: 'fri', cost: { pp: 8 }, temp: { freedom: 2, approval: -1 }, perm: { corruption: -1 }, griev: -5, ind: { pressfree: 2 }, fortroende: 4, tip: 'Censuren gjorde en lokal nyhet till en världsnyhet. Lärdomen är gratis.' },
      { text: 'BLOCKERA ALLA SAJTER SOM HAR DEN', cost: { pp: 10 }, temp: { freedom: -3, statepower: 1 }, griev: 6, ind: { pressfree: -3 }, fortroende: -3, tip: 'Det tar tre veckor. Sedan finns den på tvåhundra nya sajter.' },
      { text: 'LÅT MINISTERN SÄLJA VILLAN', temp: { approval: 1 }, griev: -1, fortroende: -1, tip: 'Villan säljs till marknadspris. Folk undrar vem som köpte den.' },
    ],
  },
  {
    id: 'md_pressindex', icon: '\u{1F4CA}', weight: 2, cooldown: 1200, kind: 'frihet',
    title: 'NEDÅT I PRESSFRIHETSLISTAN',
    text: 'Den årliga internationella listan över pressfrihet har kommit, och {rike} har tappat elva platser. Rapporten nämner censur, stängda redaktioner och journalister som förts till förhör. Landet ligger nu mellan två länder som ingen minister brukar vilja jämföras med. Utländska investerare läser också listan.',
    when: (c) => c.media.pressLevel <= 2 && (c.media.censored + c.media.banned) >= 1 && c.day > 100,
    choices: [
      { text: 'GENOMFÖR RAPPORTENS FÖRSLAG', cost: { pp: 15 }, perm: { freedom: 1 }, rel: 4, griev: -5, ind: { pressfree: 4 }, fortroende: 3, tip: 'Nästa år klättrar landet sex platser. Det står inte i någon löpsedel här.' },
      { text: 'ANLITA EN PR-BYRÅ I UTLANDET', cost: { money: 150 }, rel: 1, tip: 'PR-byrån får betalt. Listan blir inte bättre.' },
      { text: 'KALLA LISTAN PARTISK', temp: { ideopower: 2, gdp: -1 }, rel: -3, griev: 2, tip: 'Investerarna läser din kommentar också.' },
    ],
  },
  {
    id: 'md_journalister_flyr', icon: '\u{2708}\u{FE0F}', weight: 2, cooldown: 1100, kind: 'frihet',
    title: 'JOURNALISTERNA LÄMNAR LANDET',
    text: 'Sedan kanalerna stängdes har ett femtiotal journalister lämnat {rike}. De flesta har hamnat i {land}, där de bor i små lägenheter och jobbar som översättare och diskare. Nu har de börjat prata om att starta en egen kanal i exil som sänder in i landet via satellit och nätet.',
    when: (c) => c.media.pressLevel <= 1 && c.media.banned >= 1,
    choices: [
      { text: 'ERBJUD DEM AMNESTI OM DE KOMMER HEM', cost: { pp: 10 }, temp: { freedom: 1 }, griev: -4, fortroende: 2, tip: 'Några kommer hem. De som stannar startar kanalen ändå.' },
      { text: 'DRA IN DERAS PASS', temp: { statepower: 2, freedom: -2 }, rel: -4, griev: 6, next: 'md_exilkanal', tip: 'Utan pass kan de inte resa hem. Det var inte dit de tänkte resa.' },
      { text: 'LÅT DEM GÅ, DE ÄR INTE VÅRT PROBLEM', temp: { stability: 1 }, griev: 2, next: [null, 'md_exilkanal'], tip: 'De är ditt problem. Bara från längre håll.' },
    ],
  },
  {
    id: 'md_exilkanal', icon: '\u{1F6F0}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'KANALEN I EXIL',
    text: 'Exiljournalisterna sänder nu varje kväll från en studio i {land}. Kanalen heter Fönstret och nås via parabolantenner och telefonappar. På tre månader har den fått två miljoner tittare i {rike}. Regeringen i {land} säger att den "inte tänker hindra fria journalister".',
    choices: [
      { text: 'BJUD IN DEM ATT SÄNDA HEMIFRÅN', cost: { pp: 12 }, nykanal: true, temp: { freedom: 2 }, rel: 2, griev: -6, ind: { pressfree: 3 }, fortroende: 3, tip: 'Fönstret flyttar hem. Det blir svårare att vara hjälte i din egen huvudstad.' },
      { text: 'FÖRBJUD PARABOLERNA', temp: { freedom: -3, unrest: 2 }, rel: -3, griev: 7, fortroende: -2, tip: 'Paraboler målas gröna och gömmer sig i träden.' },
      { text: 'PROTESTERA HOS REGERINGEN I {LAND}', cost: { pp: 5 }, temp: { ideopower: 1 }, rel: -3, tip: 'De tar emot protesten artigt och visar den i Fönstret samma kväll.' },
    ],
  },
  {
    id: 'md_stangd_protest', icon: '\u{1F56F}\u{FE0F}', weight: 2, cooldown: 900, kind: 'frihet',
    title: 'LJUSEN UTANFÖR DEN STÄNGDA KANALEN',
    text: 'Varje kväll sedan kanalen stängdes samlas folk utanför det mörka tv-huset i {huvudstad} med tända ljus. Först var de femtio, nu är de femtusen. De säger ingenting, de står bara där. Någon har ställt en gammal tv-apparat på trappan med ett papper där det står "Vi väntar". Polisen frågar vad de ska göra.',
    when: (c) => c.media.banned >= 1 && (c.cut('press', 'speech') || c.grievOf('frihet') > 15),
    choices: [
      { text: 'LÅT DEM STÅ', temp: { stability: -1 }, griev: -2, fortroende: 1, tip: 'Ljusen brinner ner. Folk kommer tillbaka nästa kväll med nya.' },
      { text: 'GE KANALEN NYTT TILLSTÅND MED NYA REGLER', cost: { pp: 12 }, nykanal: true, temp: { freedom: 2, statepower: -1 }, griev: -8, ind: { pressfree: 3 }, fortroende: 4, tip: 'Den sänder igen efter en månad. Första inslaget är en bild av ljusen.' },
      { text: 'SPÄRRA AV TRAPPAN', temp: { freedom: -3, unrest: 4 }, griev: 8, ind: { protests: 20 }, fortroende: -3, tip: 'Ljusen flyttar till trottoaren. Och till tolv andra städer.' },
    ],
  },
  {
    id: 'md_censurnamnden', icon: '\u{2702}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'CENSURNÄMNDEN STRYKER EN KAKA',
    text: 'Censurnämnden har stoppat ett matlagningsprogram eftersom en sockerkaka "på ett olämpligt sätt liknade regeringsbyggnaden när den sjönk ihop". Programledaren säger att det var ugnen. Klippet sprids på nätet under namnet "Den farliga kakan", och folk bakar nu sjunkna sockerkakor i protest.',
    when: (c) => c.is('press', 'censorboard', 'highstate', 'propaganda', 'state', 'licensed'),
    choices: [
      { text: 'SLÄPP KAKAN', temp: { approval: 2 }, griev: -2, fortroende: 2, tip: 'Programmet sänds. Kakan sjunker i direktsändning. Folk jublar.' },
      { text: 'GE NÄMNDEN TYDLIGARE REGLER', cost: { pp: 6 }, temp: { stability: 1 }, griev: -1, fortroende: 1, tip: 'Regel 14 b: bakverk får likna regeringsbyggnader så länge de håller formen.' },
      { text: 'FÖRBJUD SJUNKNA SOCKERKAKOR', temp: { approval: -3, freedom: -2 }, griev: 5, fortroende: -3, tip: 'Konditorierna säljer nu kakor som "inte är sjunkna, bara avslappnade".' },
    ],
  },
  {
    id: 'md_skrivmaskinerna', icon: '\u{2328}\u{FE0F}', weight: 1, cooldown: 1200, kind: 'frihet',
    title: 'VARJE SKRIVMASKIN SKA REGISTRERAS',
    text: 'Enligt presslagen måste varje skrivmaskin, skrivare och kopiator i landet registreras hos polisen med ett prov på sin stil. Kön till registreringen är tre månader lång. En pensionär i {stad} har kommit med sin mormors gamla skrivmaskin. Den har ett e som hoppar, och polisen tycker att det verkar misstänkt.',
    when: (c) => c.is('press', 'typewriters'),
    choices: [
      { text: 'ANSTÄLL FLER REGISTRATORER', cost: { money: 80 }, temp: { statepower: 2 }, griev: 2, tip: 'Kön blir kortare. Registret blir längre. Ingen blir gladare.' },
      { text: 'UNDANTA PENSIONÄRERNAS MASKINER', temp: { approval: 2 }, griev: -2, tip: 'Mormors skrivmaskin går fri. Barnbarnen börjar låna den.' },
      { text: 'LÄGG NED REGISTRET', cost: { pp: 10 }, law: ['press', 'licensed'], temp: { freedom: 2 }, griev: -5, fortroende: 2, tip: 'Polisen får tillbaka tre våningar i polishuset. De gör om dem till gym.' },
    ],
  },
  {
    id: 'md_presslagen_strams', icon: '\u{1F4DC}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'TOMMA FÖRSTASIDOR',
    text: 'Dagen efter att presslagen skärptes kom landets tidningar ut med helt vita förstasidor. På tv sände kvällsnyheterna en minuts tystnad. Chefredaktörerna har skrivit ett gemensamt brev om att den nya lagen gör det omöjligt att granska makten. Utländska ambassader följer det hela noga.',
    when: (c) => c.cut('press') && c.media.channels >= 1,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL PRESSLAGEN', cost: { pp: 15 }, undo: 'press', temp: { approval: -1 }, griev: -10, ind: { pressfree: 3 }, fortroende: 4, tip: 'Det kostar prestige. Mindre än en press som slutat lita på dig.' },
      { text: 'BJUD IN CHEFREDAKTÖRERNA TILL SAMTAL', cost: { pp: 6 }, griev: -3, fortroende: 1, next: [null, 'md_presslagen_upprop'], tip: 'De kommer. De går därifrån med samma åsikt och en kopp kaffe.' },
      { text: 'STÅ FAST VID LAGEN', temp: { statepower: 2 }, rel: -2, griev: 6, ind: { pressfree: -2 }, fortroende: -3, next: 'md_presslagen_upprop', tip: 'Vita förstasidor är vackra en dag. Andra dagen är de en rörelse.' },
    ],
  },
  {
    id: 'md_presslagen_upprop', icon: '\u{270D}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'UPPROPET MED HUNDRATUSEN NAMN',
    text: 'Ett upprop mot den nya presslagen har fått hundratusen namnunderskrifter på en vecka: författare, präster, idrottsstjärnor, lärare och två före detta statschefer. I {stad} och {huvudstad} har tiotusentals demonstrerat med tidningar i händerna. Oppositionen kräver en folkomröstning om lagen.',
    choices: [
      { text: 'UTLYS EN FOLKOMRÖSTNING', cost: { pp: 10 }, perm: { stability: 1 }, griev: -6, ind: { trustgov: 2 }, fortroende: 2, tip: 'Folket får avgöra. Det är riskabelt och rätt.',
        risk: { chance: 0.35,
          win: { text: 'Lagen får knapp majoritet. Den står kvar, nu med folkets stöd.', temp: { stability: 2 } },
          lose: { text: 'Folket röstar nej med stor majoritet. Presslagen återställs.', undo: 'press', ind: { pressfree: 3 } } } },
      { text: 'MILDRA DE HÅRDASTE PARAGRAFERNA', cost: { pp: 8 }, griev: -4, ind: { pressfree: 1 }, fortroende: 1, tip: 'En kompromiss som ingen gillar men de flesta kan leva med.' },
      { text: 'KALLA UPPROPET UTLANDSSTYRT', temp: { ideopower: 2, unrest: 3 }, griev: 7, ind: { trustgov: -3, protests: 15 }, fortroende: -3, tip: 'Det är svårt att kalla en kantor från {stad} utlandsstyrd. Du försöker ändå.' },
    ],
  },
  {
    id: 'md_presslagen_friare', icon: '\u{1F54A}\u{FE0F}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'DEN FÖRSTA FRIA VECKAN',
    text: 'Veckan efter att presslagen mildrades har redaktionerna publicerat mer kritik mot regeringen än under hela förra året. Det mesta är sant, en del är överdrivet och lite är rena fel. Tidningarna säljer slut. Dina ministrar klagar på att de aldrig blivit så granskade, och folk pratar politik på kaféerna igen.',
    when: (c) => c.raised('press') && c.day > 30,
    choices: [
      { text: 'LÅT DET VARA, DET HÄR ÄR FRIHET', temp: { approval: -2, freedom: 2 }, griev: -6, ind: { pressfree: 3, trustgov: 1 }, fortroende: 3, tip: 'Det blir bullrigt. Sedan blir det normalt. Så låter frihet.' },
      { text: 'INRÄTTA ETT PRESSETISKT RÅD', cost: { money: 50 }, temp: { stability: 1 }, griev: -3, fortroende: 4, tip: 'Pressen granskar sig själv. Det är mindre läskigt än att staten gör det.' },
      { text: 'BACKA, DET GÅR FÖR FORT', cost: { pp: 10 }, undo: 'press', temp: { statepower: 2 }, griev: 8, ind: { pressfree: -3 }, fortroende: -4, tip: 'En vecka av frihet. Den kommer folk att minnas.' },
    ],
  },
  {
    id: 'md_propaganda_skratt', icon: '\u{1F954}', weight: 2, cooldown: 1000,
    title: 'SKÖRDEN SOM BLEV 340 PROCENT',
    text: 'För fjärde året i rad meddelar statens nyheter att skörden blev 340 procent av planen. Samtidigt är potatisen slut i butikerna i {stad}. "340 procent" har blivit ett skämt som alla förstår: när bussen är sen säger folk att den kom 340 procent i tid. Även dina egna tjänstemän har börjat säga det.',
    when: (c) => c.media.pressLevel <= 1 && c.media.stateShare > 60,
    choices: [
      { text: 'BÖRJA REDOVISA RIKTIGA SIFFROR', cost: { pp: 8 }, temp: { approval: 1, statepower: -1 }, ind: { trustgov: 2 }, fortroende: 4, tip: 'Den riktiga siffran är 92 procent. Det är faktiskt ganska bra.' },
      { text: 'HÖJ SIFFRAN TILL 400 PROCENT', temp: { ideopower: 1, approval: -2 }, fortroende: -3, tip: 'Folk skrattar högre. Det var inte meningen.' },
      { text: 'SLUTA PRATA OM SKÖRDEN', temp: { stability: 1 }, fortroende: -1, tip: 'Nyheterna handlar om väder i stället. Det är alltid sol där statschefen är.' },
    ],
  },
  {
    id: 'md_vpn', icon: '\u{1F510}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'TONÅRINGARNA SOM KRINGGÅR SPÄRRARNA',
    text: 'En undersökning visar att sju av tio tonåringar i {rike} använder program som kringgår nätets spärrar. De läser utländska nyheter, ser förbjudna filmer och lär sina föräldrar hur man gör. Programmen är landets mest nedladdade, före väderappen. Säkerhetspolisen vill förbjuda dem.',
    when: (c) => c.media.pressLevel <= 1 && (c.ind.internet ?? 50) > 45 && c.is('internet', 'filtered', 'censored', 'shutdowns', 'firewall', 'realname'),
    choices: [
      { text: 'FÖRBJUD PROGRAMMEN', cost: { pp: 10 }, law: ['internet', 'firewall'], temp: { freedom: -3, statepower: 2 }, griev: 7, ind: { pressfree: -2 }, fortroende: -2, tip: 'Tonåringarna hittar ett nytt program på en eftermiddag.' },
      { text: 'ÖPPNA NÄTET', cost: { pp: 8 }, law: ['internet', 'open'], temp: { freedom: 3 }, griev: -6, ind: { pressfree: 2 }, fortroende: 2, tip: 'Programmen faller från topplistan. Väderappen är etta igen.' },
      { text: 'LÅTSAS INTE SE', temp: { statepower: -1 }, griev: -1, tip: 'Säkerhetspolisens egna barn använder också programmen.' },
    ],
  },

  // ===== FRI PRESS =====
  {
    id: 'md_pressindex_topp', icon: '\u{1F3C6}', weight: 2, cooldown: 1200,
    title: 'I TOPP PÅ PRESSFRIHETSLISTAN',
    text: 'Den årliga internationella listan över pressfrihet har kommit, och {rike} är bland de fem bästa i världen. Rapporten lyfter fram den starka presslagen, ett självständigt {ps} och lokala redaktioner som granskar kommunerna. Utrikesministern har fått gratulationer från tolv länder och en förfrågan om studiebesök från {land}.',
    when: (c) => c.media.pressLevel >= 3 && c.media.censored === 0 && c.media.banned === 0 && c.media.ps.budget >= 1 && c.media.ps.control <= 1 && c.media.trust > 40,
    choices: [
      { text: 'TA EMOT STUDIEBESÖKET', cost: { money: 30 }, rel: 4, fortroende: 1, tip: 'Delegationen från {land} skriver hundra sidor anteckningar. Och köper souvenirer.' },
      { text: 'SKRIV IN PRESSFRIHETEN I GRUNDLAGEN', cost: { pp: 15 }, perm: { freedom: 2, stability: 1 }, ind: { pressfree: 3 }, fortroende: 2, tip: 'Det som står i grundlagen tar en framtida regering inte bort på en eftermiddag.' },
      { text: 'FIRA I TYSTHET', temp: { approval: 2 }, tip: 'Den som är bäst behöver inte skryta. Utrikesministern skryter ändå lite.' },
    ],
  },
  {
    id: 'md_guldpennan', icon: '\u{1F58B}\u{FE0F}', weight: 2, cooldown: 1100,
    title: 'GRÄVET SOM VANN VÄRLDEN',
    text: 'Två reportrar på {kanal} har vunnit ett stort internationellt journalistpris för sin granskning av hur äldreboenden i {stad} sparade på maten. Granskningen ledde till nya regler och bättre mat i hela landet. På prisgalan sa en av dem att {rike} är "ett land där man faktiskt kan göra så här".',
    when: (c) => c.media.channels >= 1 && c.media.pressLevel >= 3 && c.media.trust > 45,
    choices: [
      { text: 'BJUD IN DEM OCH TACKA', temp: { approval: 2 }, rel: 1, fortroende: 2, tip: 'Det är inte varje dag en regering tackar för att den blivit granskad.' },
      { text: 'GE TILLSYNEN AV ÄLDREBOENDEN MER RESURSER', cost: { money: 150 }, perm: { qol: 1, welfare: 1 }, fortroende: 2, tip: 'Granskningen gjorde jobbet. Nu får tillsynen fortsätta det.' },
      { text: 'PÅPEKA ATT REGLERNA REDAN ÄNDRATS', temp: { approval: -1 }, tip: 'Det stämmer. Det låter ändå som att du vill ta åt dig äran.' },
    ],
  },
  {
    id: 'md_drevet', icon: '\u{1F36B}', weight: 2, cooldown: 1000,
    title: 'CHOKLADKAKAN PÅ STATENS KORT',
    text: 'Kulturministern köpte en chokladkaka och två blöjpaket med statens betalkort av misstag och betalade tillbaka samma dag. Det har inte hindrat {kanal} och tre andra kanaler från att ägna en hel vecka åt saken. Reportrar står utanför hennes hus varje morgon, och grannarna har börjat dra ned persiennerna.',
    when: (c) => c.media.channels >= 3 && c.media.pressLevel >= 3 && c.media.critical > 15,
    choices: [
      { text: 'LÅT HENNE AVGÅ', temp: { approval: 1, stability: -1 }, next: [null, 'md_drev_efterspel'], tip: 'Drevet har fått sitt byte. Det letar redan efter nästa.' },
      { text: 'STÅ BAKOM HENNE', temp: { approval: -1 }, ind: { trustgov: 1 }, fortroende: 1, tip: 'Hon gjorde ett misstag och rättade det. Det är vad man vill att ministrar gör.' },
      { text: 'KRITISERA DREVET OFFENTLIGT', cost: { pp: 6 }, temp: { approval: 2 }, fortroende: -2, next: 'md_drev_efterspel', tip: 'Hälften av landet håller med dig. Den andra hälften tycker att du låter som en diktator.' },
    ],
  },
  {
    id: 'md_drev_efterspel', icon: '\u{1FA9E}', chain: true,
    title: 'PRESSEN GRANSKAR SIG SJÄLV',
    text: 'Efter chokladkaksdrevet har det pressetiska rådet gjort något ovanligt: det har kritiserat fyra redaktioner för "en bevakning i proportion till ingenting". Flera journalister har skrivit självkritiska krönikor och {kanal} har bett om ursäkt. Kulturministern, som nu skriver en bok, säger att hon förlåter dem. Nästan.',
    choices: [
      { text: 'BERÖM PRESSENS SJÄLVRANNSAKAN', temp: { approval: 1 }, fortroende: 3, tip: 'Pressen granskar sig själv. Det är så det ska fungera.' },
      { text: 'FÖRESLÅ EN LAG MOT MEDIEDREV', cost: { pp: 10 }, temp: { freedom: -2, statepower: 1 }, ind: { pressfree: -2 }, fortroende: -3, tip: 'Pressen slutar granska sig själv och börjar granska lagförslaget.' },
      { text: 'GE KULTURMINISTERN JOBBET TILLBAKA', cost: { pp: 5 }, temp: { approval: 2 }, tip: 'Hon tackar ja. Hon betalar sina chokladkakor kontant nu.' },
    ],
  },
  {
    id: 'md_kvallspressen', icon: '\u{1F415}', weight: 2, cooldown: 900,
    title: 'STATSCHEFENS HUND I RUBRIKERNA',
    text: '"STATSCHEFENS HUND BET POSTBUDET" skriker kvällstidningarnas löpsedlar i hela landet. Hunden har i själva verket nafsat efter en brevlåda, och postbudet säger att hon varit med om värre. Men på tre dagar har det blivit fyra förstasidor, en expertpanel om hundraser och en enkät om huruvida hunden borde avgå.',
    when: (c) => c.media.pressLevel >= 2 && c.media.channels >= 4 && c.day > 30,
    choices: [
      { text: 'LÅT HUNDEN BE OM URSÄKT PÅ BILD', temp: { approval: 3 }, fortroende: 1, tip: 'En hund med en skylt där det står "förlåt". Årets mest delade bild.' },
      { text: 'BJUD POSTBUDET PÅ FIKA', cost: { money: 5 }, temp: { approval: 2 }, tip: 'Postbudet får kanelbullar. Hunden får inte.' },
      { text: 'KRITISERA KVÄLLSPRESSEN', temp: { approval: -1 }, fortroende: -1, tip: 'Nu handlar löpsedlarna om att statschefen är arg. Hunden får vila.' },
    ],
  },
  {
    id: 'md_smutskastning', icon: '\u{1F9F9}', weight: 2, cooldown: 1000,
    title: 'KAMPANJEN MOT OPPOSITIONSLEDAREN',
    text: 'En regeringsvänlig kanal har i tre veckor sänt inslag om oppositionsledaren: hans gamla skolbetyg, grannarnas klagomål på hans gräsmatta och ett anonymt påstående om att han "inte gillar barn". Nästan inget av det är sant. Hans opinionssiffror sjunker. Oppositionen säger att det är du som ligger bakom.',
    when: (c) => c.media.friendly > 25 && c.media.pressLevel >= 2 && c.demo > 3,
    choices: [
      { text: 'TA AVSTÅND FRÅN KAMPANJEN', temp: { approval: 1 }, ind: { trustgov: 2 }, fortroende: 2, tip: 'Oppositionsledaren tackar. Kanalen sänder ett inslag om hans tack.' },
      { text: 'LÅT KANALEN HÅLLA PÅ', temp: { polpower: 3 }, ind: { trustgov: -3 }, fortroende: -3, tip: 'Han sjunker i mätningarna. Förtroendet för politiken sjunker med honom.' },
      { text: 'STIFTA EN LAG OM RÄTT TILL RÄTTELSE', cost: { pp: 10 }, perm: { stability: 1 }, ind: { trustgov: 1 }, fortroende: 3, tip: 'Den som pekas ut får svara på samma plats. Även du, nästa gång.' },
    ],
  },
  {
    id: 'md_rattelsen', icon: '\u{274C}', weight: 2, cooldown: 1000,
    title: '{KANAL} VÄGRAR RÄTTA SIG',
    text: '{kanal} påstod förra veckan att regeringen ska stänga alla förlossningar på landsbygden. Det är fel: förslaget gällde en enda klinik som ska flytta tolv kilometer. Kanalen har fått se dokumenten men vägrar rätta sig och kallar dem "regeringens version". Blivande föräldrar i {stad} är oroliga.',
    when: (c) => c.media.channels >= 1 && c.media.pressLevel >= 3 && c.media.critical > 15 && c.media.trust < 60,
    choices: [
      { text: 'ANMÄL TILL DET PRESSETISKA RÅDET', cost: { pp: 4 }, fortroende: 2, next: [null, 'md_rattelse_domstol'], tip: 'Rådet tar tre månader. Klinikens flytt tar fyra.' },
      { text: 'PUBLICERA ALLA DOKUMENT', cost: { money: 20 }, temp: { approval: 2 }, ind: { trustgov: 2 }, fortroende: 1, tip: 'Alla kan läsa själva. Hälften gör det. Resten litar på {kanal}.' },
      { text: 'STÄM KANALEN FÖR FÖRTAL', cost: { pp: 8 }, temp: { freedom: -1 }, fortroende: -2, next: 'md_rattelse_domstol', tip: 'En regering som stämmer journalister. Det blir en egen nyhet.' },
      { text: 'LÅT DET PASSERA', temp: { approval: -2 }, fortroende: -2, tip: 'Ryktet om förlossningarna lever kvar i tio år.' },
    ],
  },
  {
    id: 'md_rattelse_domstol', icon: '\u{2696}\u{FE0F}', chain: true,
    title: 'BESKEDET OM DEN FELAKTIGA ARTIKELN',
    text: 'Fallet med artikeln om förlossningarna är avgjort. {kanal} fälls för att ha brutit mot god publicistisk sed och måste publicera en rättelse på samma plats som artikeln. Kanalen gör det, med ett litet typsnitt och en ledare om "statens tryck på fria medier". Debatten fortsätter.',
    choices: [
      { text: 'NÖJ DIG MED BESKEDET', temp: { approval: 1, stability: 1 }, fortroende: 2, tip: 'Rättelsen läses av få. Beslutet läses av alla redaktioner.' },
      { text: 'KRÄV SKADESTÅND', cost: { pp: 6 }, res: { money: 30 }, temp: { freedom: -1 }, fortroende: -2, tip: 'Pengarna är små. Bilden av en regering som kräver pengar av en kanal är stor.' },
      { text: 'BJUD IN CHEFREDAKTÖREN TILL SAMTAL', cost: { pp: 4 }, ind: { trustgov: 1 }, fortroende: 3, tip: 'Två timmar. Ingen ändrar åsikt. Båda förstår varandra lite bättre.' },
    ],
  },
  {
    id: 'md_statskanalen', icon: '\u{1F3DB}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'STJÄRNORNA PÅ STATSKANALEN',
    text: 'Statens nyhetskanal har värvat tre av landets mest kända programledare med löner som är fyra gånger högre än på {ps}. Tittarsiffrorna har stigit, men en av stjärnorna har redan frågat varför hon inte får intervjua oppositionsledaren. Kollegorna på de privata kanalerna kallar henne "guldfisken".',
    when: (c) => c.media.stateShare > 50 && c.media.friendly > 20 && c.media.pressLevel <= 2,
    choices: [
      { text: 'LÅT HENNE INTERVJUA OPPOSITIONSLEDAREN', temp: { freedom: 1, statepower: -1 }, ind: { pressfree: 1 }, fortroende: 3, tip: 'Intervjun blir hård och rättvis. Statskanalen får plötsligt nya tittare.' },
      { text: 'PÅMINN HENNE OM KONTRAKTET', temp: { statepower: 2 }, fortroende: -2, tip: 'Hon läser innantill i ett år. Sedan skriver hon en bok.' },
      { text: 'SÄNK LÖNERNA TILL SAMMA NIVÅ SOM PÅ {PS}', res: { money: 50 }, temp: { approval: 1 }, fortroende: 1, tip: 'Två av stjärnorna slutar. Den tredje stannar och blir lite friare.' },
    ],
  },

  // ===== KRIG OCH KRIS =====
  {
    id: 'md_krigsrapportering', icon: '\u{1F3A5}', weight: 2, cooldown: 900, kind: 'forsvar',
    title: 'REPORTRARNA VID FRONTEN',
    text: 'Reportrar från {kanal} och {ps} har tagit sig fram till frontlinjen och sänder varje kväll. Bilderna visar trötta soldater, leriga diken och tomma byar. Försvarsstaben vill att alla inslag granskas innan de sänds, eftersom de kan avslöja var trupperna står. Redaktionerna säger att folket har rätt att veta.',
    when: (c) => c.atWar && c.media.channels >= 1,
    choices: [
      { text: 'LÅT MILITÄREN GRANSKA ALLA INSLAG', cost: { pp: 6 }, temp: { readiness: 2, freedom: -2 }, ind: { pressfree: -2 }, fortroende: -2, tip: 'Inga positioner läcker. Inga obekväma sanningar heller.' },
      { text: 'LÅT REPORTRARNA FÖLJA TRUPPERNA UNDER REGLER', cost: { pp: 4 }, temp: { readiness: 1 }, fortroende: 2, next: [null, 'md_krig_bilderna'], tip: 'Reportrarna ser kriget. Soldaterna ser att någon där hemma bryr sig.' },
      { text: 'FRI RAPPORTERING', temp: { freedom: 1 }, griev: 4, fortroende: 3, next: 'md_krig_bilderna', tip: 'Folket ser allt. Det gör kriget svårare att fortsätta, och svårare att ljuga om.' },
      { text: 'STÄNG {KANAL} SÅ LÄNGE KRIGET VARAR', kanal: 'stang', temp: { freedom: -5, statepower: 3 }, rel: -3, griev: -3, ind: { pressfree: -5 }, fortroende: -6, tip: 'Kriget blir tystare i tv. Inte vid fronten.' },
    ],
  },
  {
    id: 'md_krig_bilderna', icon: '\u{1F4F7}', chain: true, kind: 'forsvar',
    title: 'BILDEN SOM ALLA SÅG',
    text: 'Ett fotografi från fronten har blivit krigets symbol: en ung soldat från {stad} som sover sittande mot ett hjul, med ett brev hemifrån i handen. Det har tryckts på varje förstasida. Hans mamma har hört av sig till {ps} och vill att sonen kommer hem. Tusentals föräldrar har skrivit under hennes brev.',
    choices: [
      { text: 'LÅT VÄRNPLIKTIGA ROTERA HEM OFTARE', cost: { man: 5 }, temp: { approval: 3, readiness: -1 }, griev: -6, fortroende: 1, tip: 'Han kommer hem på permission. Han sover i tre dygn.' },
      { text: 'ANVÄND BILDEN I EN KAMPANJ FÖR FÖRSVARET', cost: { money: 60 }, temp: { readiness: 2, ideopower: 2 }, griev: 4, fortroende: -2, tip: 'Hans mamma ser affischen på bussen. Hon blir inte glad.' },
      { text: 'BÖRJA FÖRHANDLA OM VAPENVILA', cost: { pp: 15 }, temp: { approval: 4, stability: 1 }, rel: 3, griev: -8, tip: 'Ett fotografi kan inte avsluta ett krig. Men det kan få någon att försöka.' },
      { text: 'KRIGET MÅSTE VINNAS FÖRST', temp: { readiness: 1, approval: -2 }, griev: 5, tip: 'Det är sant. Brevet i hans hand handlar om något annat.' },
    ],
  },
  {
    id: 'md_krig_segrar', icon: '\u{1F4E3}', weight: 2, cooldown: 900, kind: 'forsvar',
    title: 'SEGRARNA SOM INGEN SÅG',
    text: 'Statens kanaler rapporterar varje kväll om nya segrar vid fronten. Men soldaterna som kommer hem på permission berättar en annan historia, och familjerna jämför. I {stad} har en grupp föräldrar börjat föra en egen lista över vad som faktiskt hänt. Den sprids från hand till hand.',
    when: (c) => c.atWar && c.media.stateShare > 50 && c.media.pressLevel <= 2,
    choices: [
      { text: 'BERÄTTA SANNINGEN OM LÄGET', cost: { pp: 8 }, temp: { approval: -3, stability: 1 }, griev: -3, ind: { trustgov: 3 }, fortroende: 4, tip: 'Sanningen är tung. Folk bär den bättre än lögnen.' },
      { text: 'FORTSÄTT RAPPORTERA SEGRAR', temp: { ideopower: 2 }, griev: 5, ind: { trustgov: -3 }, fortroende: -4, tip: 'Varje seger på tv gör listan i {stad} lite längre.' },
      { text: 'FÖRBJUD LISTAN', temp: { freedom: -3, statepower: 2 }, griev: 7, fortroende: -3, tip: 'Listan går under jorden. Där blir den ännu mer trodd.' },
    ],
  },
  {
    id: 'md_ps_bergrummet', icon: '\u{26F0}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'forsvar',
    title: 'RADION FRÅN BERGRUMMET',
    text: 'Sedan kriget började sänder {ps} nyheter från ett bergrum utanför {huvudstad}, varje hel timme dygnet runt. Programledaren med den lugna rösten har blivit landets mest kända person: hon säger alltid "god natt, var rädda om varandra" innan hon lämnar över. I skyddsrummen lyssnar folk tillsammans.',
    when: (c) => c.atWar && c.media.ps.budget >= 1 && c.media.ps.control <= 2,
    choices: [
      { text: 'GE {PS} ALLT DET BEHÖVER', cost: { money: 120 }, temp: { stability: 2, readiness: 1 }, griev: -4, fortroende: 3, tip: 'Reservsändare, diesel och kaffe. Mest kaffe.' },
      { text: 'LÅT FÖRSVARET SKRIVA NYHETERNA', cost: { pp: 5 }, temp: { readiness: 2, freedom: -2 }, griev: 2, fortroende: -3, tip: 'Den lugna rösten läser nu militärens texter. Folk hör skillnaden.' },
      { text: 'TALA SJÄLV I RADION EN GÅNG I VECKAN', temp: { approval: 3, stability: 1 }, griev: -2, tip: 'Du låter mindre lugn än hon. Folk lyssnar ändå.' },
    ],
  },
  {
    id: 'md_krisinfo', icon: '\u{1F198}', weight: 2, cooldown: 800, kind: 'kris',
    title: '{PS} SÄNDER DYGNET RUNT',
    text: 'Sedan krisen bröt ut har {ps} sänt dygnet runt med besked om var man får hjälp, vad som är stängt och hur man skyddar sig. Folk i {stad} har lyssnat på bilradion i timmar. Räddningstjänsten säger att sändningarna gjort mer nytta än tusen flygblad. Personalen har jobbat i 72 timmar och börjar bli slut.',
    when: (c) => (c.mod('natural_disaster') || c.mod('epidemic')) && c.media.ps.budget >= 1 && c.media.ps.reach > 25,
    choices: [
      { text: 'GE {PS} ETT EXTRA KRISANSLAG', cost: { money: 100 }, temp: { stability: 2 }, griev: -4, fortroende: 3, tip: 'Avbytare, mat och sängar i källaren. Den lugna informationen fortsätter.' },
      { text: 'TA EGEN SÄNDNINGSTID VARJE KVÄLL', cost: { pp: 5 }, temp: { approval: 2, statepower: 1 }, fortroende: -1, tip: 'Folk vill höra från dig. De vill ännu hellre höra var vattnet delas ut.' },
      { text: 'TACKA PERSONALEN', temp: { approval: 1 }, griev: -1, fortroende: 2, tip: 'Tacket läses upp i sändningen. Klockan tre på natten, av en trött röst.' },
    ],
  },
  {
    id: 'md_kris_utan_ps', icon: '\u{1F4F5}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'INGEN BERÄTTAR VAD SOM HÄNDER',
    text: 'Krisen har slagit till och landet har inget public service som sänder besked. De privata kanalerna visar dramatiska bilder men ger inga råd, och på nätet sprids rykten om stängda vägar som är öppna och öppna sjukhus som är stängda. I {stad} har folk åkt till fel sjukhus. Räddningstjänsten ringer regeringskansliet.',
    when: (c) => (c.mod('natural_disaster') || c.mod('epidemic')) && c.media.ps.budget === 0,
    choices: [
      { text: 'KÖP SÄNDNINGSTID I ALLA KANALER', cost: { money: 150 }, temp: { stability: 2 }, griev: -4, fortroende: 1, tip: 'Statens besked mellan reklam för tvättmedel. Det fungerar ändå.' },
      { text: 'SKICKA SMS TILL ALLA TELEFONER', cost: { money: 40 }, temp: { stability: 1 }, griev: -2, tip: 'Snabbt och billigt. De som inte har telefon får fråga grannen.' },
      { text: 'LÅT KANALERNA SKÖTA DET', temp: { stability: -2, approval: -2 }, griev: 5, fortroende: -2, tip: 'Kanalerna sköter det som kanaler gör: med bilder, inte med råd.' },
    ],
  },

  // ===== VALET =====
  {
    id: 'md_tvdebatten', icon: '\u{1F5F3}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'SLUTDEBATTEN INFÖR VALET',
    text: 'Fem dagar före valet möts partiledarna i den stora slutdebatten i {ps}, och två miljoner väntas titta. Oppositionsledaren har tränat i veckor med en före detta skådespelare. Dina rådgivare har tagit fram fyrtio sidor svar, tre skämt och en lista över ord du inte får säga. Det är fem minuter kvar.',
    when: (c) => c.demo > 4.5 && c.media.ps.budget >= 1 && c.media.ps.control <= 2 && c.day > 150,
    choices: [
      { text: 'HÅLL DIG TILL MANUSET', temp: { approval: 1 }, next: [null, 'md_tvdebatt_efter'], tip: 'Säkert och tråkigt. Ingen minns vad du sa. Det kan vara en seger.' },
      { text: 'GÅ TILL ANFALL MOT OPPOSITIONEN', cost: { pp: 5 }, next: 'md_tvdebatt_efter', tip: 'Anfall är bästa försvar. Ibland är det bara anfall.',
        risk: { chance: 0.5,
          win: { text: 'Du sätter oppositionsledaren på plats om budgeten. Han tappar tråden.', temp: { approval: 5 } },
          lose: { text: 'Du låter elak. Klippet där du avbryter honom fem gånger sprids snabbt.', temp: { approval: -4 }, ind: { trustgov: -1 } } } },
      { text: 'VAR ÄRLIG OM DET SOM GÅTT DÅLIGT', next: 'md_tvdebatt_efter', tip: 'Väljarna är ovana vid politiker som erkänner fel.',
        risk: { chance: 0.6,
          win: { text: 'Ärligheten överraskar. Tittarna litade mest på dig av alla i studion.', temp: { approval: 4 }, ind: { trustgov: 3 }, fortroende: 1 },
          lose: { text: 'Oppositionen citerar dina erkännanden på varenda valaffisch resten av veckan.', temp: { approval: -3 } } } },
    ],
  },
  {
    id: 'md_tvdebatt_efter', icon: '\u{2705}', chain: true,
    title: 'FAKTAGRANSKNINGEN EFTER DEBATTEN',
    text: 'Dagen efter slutdebatten har {ps} gått igenom varje påstående. Oppositionsledaren hade fel tre gånger, och du hade fel en gång: siffran om nya sjuksköterskor var dubbelt så hög som den riktiga. Granskningen är det mest lästa på nätet i dag. Valet är om fyra dagar.',
    choices: [
      { text: 'RÄTTA DIG SJÄLV OFFENTLIGT', temp: { approval: 1 }, ind: { trustgov: 2 }, fortroende: 3, tip: 'Det är ovanligt att en politiker säger "jag hade fel". Det märks.' },
      { text: 'PRATA BARA OM MOTSTÅNDARENS TRE FEL', temp: { approval: 2 }, ind: { trustgov: -1 }, fortroende: -1, tip: 'Tre är fler än ett. Matematiken är på din sida, moralen mindre.' },
      { text: 'KALLA GRANSKNINGEN PARTISK', temp: { ideopower: 1, approval: -1 }, ind: { trustgov: -2 }, fortroende: -3, tip: 'Siffran om sjuksköterskorna blir veckans mest omtalade siffra.' },
    ],
  },
  {
    id: 'md_valstallning', icon: '\u{1F4F0}', weight: 2, cooldown: 1000,
    title: '{KANAL} VILL HA EN NY REGERING',
    text: 'Inför valet har {kanal}, landets största kritiska kanal, gjort något den aldrig gjort förut: sänt en ledare som uppmanar tittarna att rösta bort regeringen. De regeringsvänliga kanalerna svarade samma kväll med en timme om oppositionens misslyckanden. Valrörelsen har blivit en kamp mellan kanaler lika mycket som mellan partier.',
    when: (c) => c.demo > 4 && c.media.channels >= 2 && c.media.critical > 30 && c.day > 150,
    choices: [
      { text: 'SVARA MED POLITIK, INTE MED KANALER', temp: { approval: 1 }, fortroende: 2, tip: 'En valrörelse om skolor och vård i stället för om tv. Väljarna tackar.' },
      { text: 'KRÄV ATT KANALERNA ÄR NEUTRALA I VALET', cost: { pp: 10 }, temp: { freedom: -2, statepower: 1 }, ind: { pressfree: -2 }, fortroende: -2, tip: 'Neutralitet som regeringen bestämmer är sällan neutral.' },
      { text: 'LÅT DE VÄNLIGA KANALERNA SLÅ TILLBAKA', temp: { polpower: 2 }, ind: { trustgov: -2 }, fortroende: -3, tip: 'Två läger som bara tittar på sina egna kanaler. Det blir ett delat land.' },
    ],
  },
  {
    id: 'md_valreklamen', icon: '\u{1F4FA}', weight: 2, cooldown: 1100,
    title: 'POLITISK REKLAM I TV?',
    text: 'Inför valet vill de privata kanalerna sälja reklamtid till partierna. Det rikaste partiet har redan bokat varje reklampaus under fotbollssändningarna. De mindre partierna säger att valet då köps av den som har mest pengar, och kanalerna säger att de behöver intäkterna för att kunna betala sina reportrar.',
    when: (c) => c.demo > 5 && c.media.channels >= 3 && c.media.pressLevel >= 2 && c.day > 200,
    choices: [
      { text: 'FÖRBJUD POLITISK TV-REKLAM', cost: { pp: 10 }, perm: { stability: 1 }, ind: { trustgov: 2 }, fortroende: 1, tip: 'Valet avgörs i debatter i stället för i reklampauser. Kanalerna tjänar lite mindre.' },
      { text: 'TILLÅT, MED ETT TAK FÖR VARJE PARTI', cost: { pp: 6 }, ind: { trustgov: 1 }, fortroende: 1, tip: 'Alla får lika mycket tid. Det rikaste partiet köper affischer i stället.' },
      { text: 'FRITT FRAM', temp: { polpower: 2 }, perm: { corruption: 1 }, ind: { trustgov: -2 }, fortroende: -1, tip: 'Ditt parti har råd. Det är inte det som är problemet.' },
    ],
  },
  {
    id: 'md_valnatten', icon: '\u{1F4BB}', weight: 2, cooldown: 1200,
    title: 'VALVAKAN DÄR DATORN SOMNADE',
    text: 'Klockan nio på valkvällen, när de första siffrorna skulle visas i {ps}, kraschade grafikdatorn. I två timmar fick programledaren rita resultatet för hand på en whiteboard medan en statsvetare höll i pennorna. Tittarna älskade det. Siffrorna var rätt, staplarna lite sneda. Grafiksystemet kostade fyra miljoner.',
    when: (c) => c.demo > 4 && c.media.ps.budget >= 1 && c.st.stability < 30 && c.day > 300,
    choices: [
      { text: 'BEHÅLL WHITEBOARDEN TILL NÄSTA VAL', temp: { approval: 2 }, fortroende: 2, tip: 'Nu är det en tradition. Statsvetaren har köpt egna pennor.' },
      { text: 'UTRED VAD SOM HÄNDE', cost: { money: 20 }, temp: { stability: 1 }, fortroende: 1, tip: 'Utredningen hittar en kaffekopp på fel ställe. Det kostade fyra miljoner att ta reda på.' },
      { text: 'KRÄV PENGARNA TILLBAKA FRÅN {PS}', res: { money: 30 }, temp: { approval: -1 }, fortroende: -1, tip: 'Pengarna kommer tillbaka. Glädjen kommer inte tillbaka.' },
    ],
  },

  // ===== NÄR DET GÅR BRA =====
  {
    id: 'md_fortroendet_stiger', icon: '\u{1F4C8}', weight: 2, cooldown: 1200,
    title: 'FOLKET LITAR PÅ NYHETERNA IGEN',
    text: 'Den årliga mätningen visar att förtroendet för medierna har stigit för tredje året i rad. Sju av tio litar nu på nyheterna, och färre tror på rykten på nätet. Forskarna pekar på fri press, ett starkt {ps} och lokala redaktioner som syns. Förtroendet för regeringen har också stigit, lite grann.',
    when: (c) => c.media.trust > 65 && c.media.pressLevel >= 3 && c.media.ps.budget >= 1,
    choices: [
      { text: 'FÖRSTÄRK KÄLLKRITIKEN I SKOLAN', cost: { money: 80 }, perm: { stability: 1 }, fortroende: 2, tip: 'Det som byggts upp ska hålla även när nästa ryktesvåg kommer.' },
      { text: 'HÅLL ETT SEMINARIUM OM DEMOKRATI', cost: { money: 20 }, temp: { approval: 1, stability: 1 }, ind: { trustgov: 1 }, tip: 'Seminariet sänds i {ps}. Tittarsiffran är blygsam men stolt.' },
      { text: 'TA ÅT DIG ÄRAN', temp: { approval: 2 }, fortroende: -1, tip: 'Medierna rapporterar att regeringen tar åt sig äran. Med källhänvisning.' },
    ],
  },
  {
    id: 'md_unga_laser', icon: '\u{1F4F2}', weight: 2, cooldown: 1200,
    title: 'TONÅRINGARNA LÄSER NYHETER',
    text: 'För första gången på femton år ökar andelen unga som tar del av nyheter varje dag. Ett skolprojekt i {stad} där eleverna gjorde egna nyhetssändningar har spridit sig till hela landet, och {ps} har börjat med korta nyhetsklipp för telefonen. En sextonåring förklarar: "Man vill ju veta vad som händer, typ."',
    when: (c) => c.media.trust > 50 && c.media.pressLevel >= 2 && c.media.ps.budget >= 1 && c.media.ps.control <= 1,
    choices: [
      { text: 'STÖD SKOLPROJEKTET I HELA LANDET', cost: { money: 60 }, perm: { stability: 1 }, fortroende: 3, tip: 'Unga som gör nyheter blir vuxna som läser dem.' },
      { text: 'LÅT ELEVERNA INTERVJUA STATSCHEFEN', cost: { pp: 4 }, temp: { approval: 2 }, ind: { turnout: 1 }, fortroende: 1, tip: 'Första frågan: varför är skolmaten så dålig? En bra fråga.' },
      { text: 'GLÄDJ DIG ÅT DET', temp: { approval: 1 }, fortroende: 1, tip: 'Typ.' },
    ],
  },
  {
    id: 'md_ps_hyllas', icon: '\u{1F31F}', weight: 2, cooldown: 1200,
    title: '{PS} BLAND VÄRLDENS BÄSTA',
    text: 'En internationell undersökning har utsett {ps} till ett av världens tre bästa public service-bolag. Juryn lyfte fram självständigheten, barnprogrammen och den lokala bevakningen. Delegationer från {land} och {granne} vill komma på studiebesök. Folket i {rike} är förvånat och lite stolt, på sitt försiktiga sätt.',
    when: (c) => c.media.ps.trust > 70 && c.media.ps.control === 0 && c.media.ps.budget >= 2,
    choices: [
      { text: 'TA EMOT DELEGATIONERNA', cost: { money: 30 }, rel: 4, fortroende: 1, tip: 'De vill se barnprogrammen. Gurkdockan har ingen aning om vad som väntar.' },
      { text: 'LOVA {PS} ETT STABILT ANSLAG I TIO ÅR', cost: { money: 200 }, perm: { stability: 1 }, fortroende: 3, tip: 'Det som fungerar ska inte behöva tigga varje höst.' },
      { text: 'TACKA OCH GÅ VIDARE', temp: { approval: 2 }, tip: 'Stolt, men inte för stolt. Det är också en nationell egenskap.' },
    ],
  },

  // ===== KURIOSA =====
  {
    id: 'md_vaderkartan', icon: '\u{1F326}\u{FE0F}', weight: 1, cooldown: 1500, rare: true,
    title: 'VÄDERPRESENTATÖREN TAPPADE KARTAN',
    text: 'Under kvällens väderleksrapport på {ps} lossnade den stora kartan och föll ned över väderpresentatören. Han kröp fram, rättade till slipsen och sa: "Som ni ser väntas kraftigt kartfall i hela landet." Klippet har setts i över hundra länder. I {stad} säljs nu tröjor med texten KARTFALL.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.reach > 40 && c.st.approval < 40 && c.day > 200,
    choices: [
      { text: 'GE HONOM EN MEDALJ FÖR SINNESNÄRVARO', cost: { pp: 2 }, temp: { approval: 3 }, fortroende: 1, tip: 'Medaljen hänger i väderstudion. Fastskruvad.' },
      { text: 'KÖP EN NY KARTA TILL {PS}', cost: { money: 10 }, temp: { approval: 1 }, fortroende: 1, tip: 'Den nya kartan sitter fast med tolv skruvar. Han saknar den gamla.' },
      { text: 'SÄLJ TRÖJOR TILL FÖRMÅN FÖR VÄDERTJÄNSTEN', res: { money: 20 }, temp: { approval: 2 }, tip: 'Tröjan blir årets julklapp. Meteorologerna får nya instrument.' },
    ],
  },
  {
    id: 'md_mikrofonen', icon: '\u{1F399}\u{FE0F}', weight: 2, cooldown: 1000,
    title: 'MIKROFONEN VAR PÅ',
    text: 'Efter en presskonferens om budgeten trodde jordbruksministern att mikrofonerna var avstängda och sa till sin pressekreterare: "Den sista frågan var dum, men mitt svar var ännu dummare." Det sändes direkt i {kanal}. Meningen har blivit veckans mest citerade, och ministern är plötsligt populärare än någonsin.',
    when: (c) => c.media.channels >= 2 && c.st.approval < 15 && c.media.climate < 30 && c.day > 90,
    choices: [
      { text: 'LÅT HONOM SKÄMTA OM DET', temp: { approval: 2 }, fortroende: 1, tip: 'Han lovar att alltid ha mikrofonen på i fortsättningen. Folk gillar honom.' },
      { text: 'TVINGA HONOM ATT BE OM URSÄKT', temp: { approval: -1, stability: 1 }, tip: 'Ursäkten är stel och uppläst. Den första meningen var bättre.' },
      { text: 'BE {KANAL} ATT INTE SÄNDA KLIPPET IGEN', temp: { freedom: -1, approval: -1 }, fortroende: -2, tip: 'Klippet sänds nu på alla andra kanaler, med din begäran som extramaterial.' },
    ],
  },
  {
    id: 'md_studiokatten', icon: '\u{1F408}', weight: 1, cooldown: 1500, rare: true,
    title: 'KATTEN I NYHETSSTUDION',
    text: 'Mitt under kvällsnyheterna i {kanal} hoppade en grå katt upp på nyhetsdesken, satte sig på manuset och vägrade flytta på sig. Nyhetsuppläsaren läste resten av sändningen utantill med katten i famnen. Ingen vet var katten kom ifrån. Den har nu ett namn, ett eget presskort och fler följare än finansministern.',
    when: (c) => c.media.channels >= 3 && c.media.pressLevel >= 2 && c.day > 100,
    choices: [
      { text: 'GE KATTEN ETT PRESSKORT', temp: { approval: 2 }, fortroende: 1, tip: 'Katten går på regeringens pressträffar. Den ställer inga frågor men stirrar.' },
      { text: 'ADOPTERA KATTEN TILL REGERINGSKANSLIET', cost: { money: 5 }, temp: { approval: 3, stability: 1 }, tip: 'Katten sover på mötesbordet. Mötena blir kortare och lugnare.' },
      { text: 'KRÄV ATT DJUR HÅLLS UTANFÖR STUDIOR', temp: { approval: -2 }, fortroende: -1, tip: 'En hel nation tycker att du saknar hjärta. Och humor.' },
    ],
  },
  {
    id: 'md_aprilskamtet', icon: '\u{1F41F}', weight: 1, cooldown: 1500, rare: true,
    title: 'APRILSKÄMTET SOM GICK FÖR LÅNGT',
    text: 'Den första april meddelade {ps} att regeringen inför en tjugofemte timme på dygnet från och med maj, "så att alla hinner med". Inslaget var så trovärdigt att tusentals ringde sina chefer och frågade om lönen. Två kommuner började rita nya busstidtabeller. Oppositionen undrar varför ingen i regeringen dementerade.',
    when: (c) => c.media.ps.budget >= 1 && c.media.ps.control <= 1 && c.media.ps.trust > 40 && c.day > 100,
    choices: [
      { text: 'DEMENTERA MED ETT EGET SKÄMT', temp: { approval: 3 }, fortroende: 1, tip: 'Du meddelar att den tjugosjätte timmen kommer nästa år. Ingen tror dig. Bra.' },
      { text: 'KRÄV ATT {PS} SLUTAR MED APRILSKÄMT', temp: { approval: -2 }, fortroende: -1, tip: 'Nästa år sänder de ett aprilskämt om att de slutat med aprilskämt.' },
      { text: 'UTRED HUR MÅNGA SOM TRODDE PÅ DET', cost: { money: 15 }, temp: { research: 1, approval: 1 }, tip: 'Svaret: 31 procent. Forskarna kallar det tillit. Andra kallar det något annat.' },
    ],
  },
];
