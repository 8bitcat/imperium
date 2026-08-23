// IMPERIUM v5 — lagar/policies. Allt är data: justera siffrorna fritt.
// mods = påverkan på nationsvärden (läggs ihop över alla lagar).
// desc = 2–3 meningar om vad lagen faktiskt innebär om du aktiverar den.
//        Visas i förhandsgranskningen när du hovrar över alternativet.
// Alternativet med default: true är startläget (mixed/balanced enligt spec).
// Kostnad att byta: LAW_STEP_COST × antal steg mellan nuvarande och nytt alternativ.

export const LAW_STEP_COST = 15; // Political power per steg

export const LAWS = {
  military_service: {
    name: 'Military service', icon: '\u{1FA96}',
    options: [
      { id: 'none', name: 'None', mods: { manpower: -40, milpower: -25, readiness: -20, income: 10, approval: 8, freedom: 5 },
        desc: 'Ingen värnplikt alls — försvaret bygger helt på frivilliga yrkessoldater i en liten stående styrka. Skattepengarna går till annat och folket slipper avbrott i sina liv, vilket märks direkt på nöjdheten. Men rekryteringen sinar och armén krymper till en storlek som knappt räcker till gränsförsvar.' },
      { id: 'small', name: 'Small', mods: { manpower: -15, milpower: -10, readiness: -5, income: 5 },
        desc: 'En liten yrkesarmé med begränsad rekrytering och kort utbildning. Kostnaden hålls nere och samhället påverkas nästan inte alls. Räcker mot inre oro och små gränsincidenter, men inte mot en riktig granne som vill något.' },
      { id: 'mixed', name: 'Mixed', default: true, mods: {},
        desc: 'Yrkessoldater i kärnan, med värnpliktiga som fyller ut och en reserv att kalla in. Varken billigt eller dyrt, varken starkt eller svagt — det läge de flesta länder faktiskt befinner sig i. Ett neutralt utgångsläge du kan flytta åt båda hållen senare.' },
      { id: 'high', name: 'High', mods: { manpower: 20, milpower: 15, readiness: 10, income: -8, approval: -5, factory: -5 },
        desc: 'Bred värnplikt där de flesta unga tjänstgör en period. Armén växer snabbt och beredskapen blir hög, vilket gör dig svår att överraska. Priset är att arbetskraft dras ur industrin och att familjer ogillar att förlora sina ungdomar i ett år.' },
      { id: 'mandatory', name: 'Mandatory', mods: { manpower: 40, milpower: 25, readiness: 20, income: -15, approval: -12, freedom: -10, factory: -10 },
        desc: 'Allmän och obligatorisk värnplikt utan undantag — hela årskullar in i det militära. Du får den största armé din befolkning tillåter och en beredskap som gör anfall mot dig riskabla. I gengäld tappar industrin folk, statskassan blöder och befolkningen upplever det som tvång.' },
    ],
  },
  press: {
    name: 'Press regulations', icon: '\u{1F4F0}',
    options: [
      { id: 'full', name: 'Full press', mods: { freedom: 20, approval: 10, corruption: -10, unrest: 5, statepower: -15, ideopower: -10 },
        desc: 'Fullständig pressfrihet utan censur, med rätt att granska allt inklusive regeringen själv. Korruptionen får svårt att överleva när journalister kan gräva fritt, och folket uppskattar öppenheten. Nackdelen är att varje skandal blir offentlig och att staten tappar greppet om berättelsen.' },
      { id: 'free', name: 'Free press', mods: { freedom: 12, approval: 6, corruption: -6, statepower: -8, ideopower: -5 },
        desc: 'Fri press med bara de mest grundläggande begränsningarna, som förtal och rikets säkerhet. Granskningen håller tjänstemännen ärliga utan att helt sätta staten på undantag. Ett läge som fungerar väl i lugna tider men gör kriser svårare att hantera.' },
      { id: 'laxed', name: 'Laxed', mods: { freedom: 6, approval: 3, corruption: -3, statepower: -3 },
        desc: 'Pressen är i huvudsak fri men lever med mjuka påtryckningar och självcensur. Redaktörerna vet var gränsen går utan att någon behöver dra den. Ger viss granskning utan att staten tappar kontrollen helt.' },
      { id: 'mixed', name: 'Mixed', default: true, mods: {},
        desc: 'Blandad mediemarknad med både statliga och privata kanaler som balanserar varandra. Ingen sida dominerar helt vilket ger stabilitet men få tydliga fördelar. Startläget för de flesta länder.' },
      { id: 'state', name: 'State focus', mods: { freedom: -10, statepower: 10, ideopower: 8, unrest: -5, corruption: 5, approval: -4 },
        desc: 'Statliga medier dominerar och sätter dagordningen, medan privata kanaler får leva i skuggan. Oron dämpas eftersom regeringen kontrollerar vilka historier som får luft. Priset är att korruption kan gömma sig och att folk märker att de inte får hela bilden.' },
      { id: 'highstate', name: 'High state focus', mods: { freedom: -20, statepower: 18, ideopower: 15, unrest: -10, corruption: 10, approval: -8, research: -5 },
        desc: 'Nästan all nyhetsförmedling går genom staten och oberoende röster trängs ut. Din ideologi når hela befolkningen utan motargument, och missnöje kvävs innan det sprids. Men forskningen lider när fri debatt försvinner och tjänstemännen slutar frukta granskning.' },
      { id: 'propaganda', name: 'Propaganda only', mods: { freedom: -35, statepower: 28, ideopower: 30, unrest: -18, corruption: 18, approval: -15, research: -12, hdi: -8 },
        desc: 'All media är statlig propaganda — det finns ingen annan version av verkligheten att få tag på. Ideologins grepp om samhället blir totalt och protester slutar organisera sig eftersom ingen kan sprida ett budskap. Samtidigt ruttnar förvaltningen inifrån när ingen kan avslöja den, och landet halkar efter i kunskap.' },
    ],
  },
  party_loyalty: {
    name: 'Party loyalty', icon: '\u{1F3AD}',
    options: [
      { id: 'none', name: 'None', mods: { freedom: 8, polpower: -8, statepower: -8 },
        desc: 'Inga krav på partitillhörighet någonstans i staten — tjänstemän anställs på meriter allena. Friheten ökar och kompetensen med den, men regeringen kan inte räkna med lojalitet när det gäller. Beslut går trögt eftersom förvaltningen inte automatiskt drar åt ditt håll.' },
      { id: 'minimum', name: 'Minimum', mods: { freedom: 4, polpower: -4 },
        desc: 'Partitillhörighet spelar nästan ingen roll för karriären i staten. Ett öppet system som kostar dig lite politisk styrfart. Fungerar bäst när du redan har brett stöd.' },
      { id: 'low', name: 'Low', mods: { freedom: 2, polpower: -2 },
        desc: 'Svaga förväntningar på partilojalitet, mest på de allra högsta posterna. Marginell effekt åt båda håll. Ett nästan neutralt läge något åt det öppna hållet.' },
      { id: 'mixed', name: 'Mixed', default: true, mods: {},
        desc: 'Politiska utnämningar på toppen, meritokrati längre ned i förvaltningen. Vanligast i verkliga länder och ger varken bonus eller straff. Utgångsläget.' },
      { id: 'high', name: 'High', mods: { polpower: 5, statepower: 5, freedom: -5, ideopower: 5 },
        desc: 'Partiboken väger tungt vid tillsättningar genom hela statsapparaten. Dina beslut möter mindre motstånd på vägen ner genom systemet. Kompetenta men fel-färgade tjänstemän sorteras bort, vilket märks i friheten.' },
      { id: 'maximum', name: 'Maximum', mods: { polpower: 10, statepower: 10, freedom: -12, ideopower: 10, approval: -5 },
        desc: 'Praktiskt taget alla offentliga tjänster kräver partitillhörighet. Staten blir ett förlängt parti som verkställer din vilja utan invändningar. Priset är att duglighet får stå tillbaka för lojalitet och att utomstående känner sig utestängda.' },
      { id: 'onlyrep', name: 'Only representative', mods: { polpower: 15, statepower: 18, freedom: -20, ideopower: 18, approval: -10, corruption: 8 },
        desc: 'Bara partiets egna representanter får inneha någon form av offentligt uppdrag — andra är utestängda per definition. Statsapparaten blir ett perfekt verktyg för din politik utan inre friktion. Samtidigt växer korruptionen fritt eftersom den enda kontrollinstansen är partiet självt.' },
    ],
  },
  healthcare: {
    name: 'Healthcare', icon: '\u{1FA7A}',
    options: [
      { id: 'fullyfree', name: 'Fully free', mods: { welfare: 18, qol: 15, hdi: 12, approval: 12, income: -18, manpower: 5 },
        desc: 'All vård är helt kostnadsfri för alla, från förkylning till avancerad kirurgi. Livskvaliteten och den mänskliga utvecklingen stiger märkbart och folket älskar dig för det. Notan är enorm och äter en stor del av statens intäkter varje dag.' },
      { id: 'free', name: 'Free', mods: { welfare: 12, qol: 10, hdi: 8, approval: 8, income: -10, manpower: 3 },
        desc: 'Vården är gratis vid behov, med små avgifter för sådant som inte är akut. Nästan alla fördelar med fri vård till ungefär halva kostnaden. Ett populärt och hållbart läge för ett välmående land.' },
      { id: 'mixedprices', name: 'Mixed prices', default: true, mods: {},
        desc: 'Blandning av offentligt och privat, med patientavgifter som täcker en del av kostnaden. Varken generöst eller hårt — vård finns för den som söker den. Startläget för de flesta länder.' },
      { id: 'mostlyunfree', name: 'Mostly unfree', mods: { income: 8, welfare: -10, qol: -8, hdi: -6, approval: -6 },
        desc: 'Vården är i huvudsak avgiftsbelagd och den som inte kan betala får vänta. Statskassan mår bra av det. Folkhälsan och nöjdheten sjunker i takt med att fler avstår från att söka hjälp.' },
      { id: 'unfree', name: 'Entirely unfree', mods: { income: 15, welfare: -20, qol: -15, hdi: -12, approval: -12, unrest: 6 },
        desc: 'All vård är helt privat och kostar fullt pris — staten betalar ingenting. Du sparar stora summor varje dag och kan lägga dem på annat. Men de fattiga får ingen vård alls, folkhälsan rasar och missnöjet börjar jäsa.' },
    ],
  },
  healthcare_quality: {
    name: 'Healthcare quality', icon: '\u{2695}\u{FE0F}',
    options: [
      { id: 'minimal', name: 'Minimal', mods: { income: 12, qol: -15, hdi: -12, manpower: -8, unrest: 5 },
        desc: 'Vården håller absolut lägsta tänkbara standard — gammal utrustning, underbemanning och långa köer. Det är billigt och frigör mycket pengar till annat. Befolkningen blir sjukare, dör tidigare och färre är friska nog att bära vapen.' },
      { id: 'low', name: 'Low', mods: { income: 6, qol: -8, hdi: -6, manpower: -4 },
        desc: 'Enkel men fungerande vård utan modern utrustning eller specialister. Sparar pengar till priset av sämre utfall. Ett nedskärningsläge som märks men inte omedelbart förstör något.' },
      { id: 'good', name: 'Balanced/good', default: true, mods: {},
        desc: 'God vårdstandard i nivå med ett normalt utvecklat land. Varken bonus eller straff. Utgångsläget.' },
      { id: 'modern', name: 'Modern', mods: { income: -8, qol: 10, hdi: 8, manpower: 4, research: 3 },
        desc: 'Modern utrustning, specialistvård och kort väntetid över hela landet. Folk lever längre och friskare, och sjukvården driver på forskningen. Kostar en tydlig men hanterbar summa varje dag.' },
      { id: 'extra', name: 'Extraordinary', mods: { income: -18, qol: 18, hdi: 15, manpower: 8, research: 5, approval: 8 },
        desc: 'Vård i världsklass — det bästa som finns tillgängligt för alla, överallt. Din befolkning blir en av världens friskaste, forskningen lyfter och folket vet vem de har att tacka. Detta är den dyraste vårdpolitik som går att föra.' },
    ],
  },
  welfare: {
    name: 'Welfare', icon: '\u{1F91D}',
    options: [
      // BUFF (V5): extreme coverage ger nu verklig utväxling — nöjdhet, HDI och
      // lugn i samhället — i utbyte mot en fortsatt tung men inte förlamande nota.
      { id: 'extreme', name: 'Extreme coverage', mods: { welfare: 45, qol: 28, approval: 25, hdi: 18, unrest: -20, stability: 12, manpower: 6, income: -26, factory: -8 },
        desc: 'Ett heltäckande trygghetssystem som fångar upp varje medborgare i varje livssituation — arbetslöshet, sjukdom, ålderdom, föräldraskap, bostad. Fattigdomen försvinner i praktiken, missnöjet dör ut och samhället blir märkbart lugnare och mer sammanhållet. Kostnaden är enorm och kräver en stark ekonomi i botten för att inte tömma statskassan.' },
      { id: 'huge', name: 'Huge coverage', mods: { welfare: 20, qol: 10, approval: 10, income: -18, factory: -5, unrest: -5 },
        desc: 'Mycket generösa bidrag och försäkringar som täcker de flesta livssituationer. Folk känner sig trygga och nöjda, och oron håller sig nere. Notan är tung men inte omöjlig för ett fungerande land.' },
      { id: 'coverage', name: 'Coverage', mods: { welfare: 10, qol: 5, approval: 5, income: -8, unrest: -3 },
        desc: 'Ett tydligt skyddsnät för dem som verkligen behöver det. Ger märkbar trygghet till en rimlig kostnad. Ett tryggt mellanläge åt det generösa hållet.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Grundläggande välfärd med behovsprövning — hjälp finns men den söks och prövas. Varken bonus eller straff. Utgångsläget.' },
      { id: 'little', name: 'Little coverage', mods: { income: 8, welfare: -12, qol: -6, unrest: 5 },
        desc: 'Minimalt skyddsnät som bara fångar de allra mest utsatta. Frigör pengar till statskassan. De som faller igenom blir arga och oron stiger.' },
      { id: 'none', name: 'No coverage', mods: { income: 15, welfare: -25, qol: -12, approval: -8, unrest: 12 },
        desc: 'Staten betalar ingenting till någon — den som inte klarar sig själv får klara sig ändå. Du sparar stora belopp varje dag. Fattigdomen exploderar, folket vänder sig mot dig och gatorna blir oroliga.' },
      { id: 'independent', name: 'Independent', mods: { income: 10, freedom: 8, welfare: -18, qol: -8, unrest: 8 },
        desc: 'Trygghet är den enskildes eget ansvar via privata försäkringar och familj — staten håller sig utanför helt. Friheten ökar och skatterna kan hållas låga. Den som drabbas av otur har ingenstans att vända sig, och det skapar oro.' },
    ],
  },
  taxes: {
    name: 'Taxes', icon: '\u{1F9FE}',
    options: [
      { id: 't0', name: '0–10%', mods: { income: -30, gdp: 15, factory: 10, approval: 12, welfare: -12, unrest: -3 },
        desc: 'Nästan ingen beskattning alls — medborgare och företag behåller i princip allt de tjänar. Ekonomin blomstrar, industrin investerar och folket är förtjusta. Men statskassan svälter och all offentlig verksamhet får skäras ned.' },
      { id: 't10', name: '10–20%', mods: { income: -15, gdp: 8, factory: 5, approval: 6, welfare: -6 },
        desc: 'Låg beskattning som lämnar mycket kvar i privata händer. Tillväxten går bra och skattebetalarna är nöjda. Statens utrymme att göra något är begränsat.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Måttlig beskattning kring 20–30 % som varken kväver ekonomin eller svälter staten. Varken bonus eller straff. Utgångsläget.' },
      { id: 't30', name: '30–40%', mods: { income: 12, gdp: -5, approval: -5, welfare: 5 },
        desc: 'Höga skatter som ger staten ordentligt handlingsutrymme. Välfärden kan byggas ut och kassan fylls varje dag. Tillväxten dämpas något och skattebetalarna knorrar.' },
      { id: 't40', name: '40–50%', mods: { income: 22, gdp: -10, factory: -5, approval: -10, welfare: 10, unrest: 5 },
        desc: 'Mycket höga skatter — nästan halva inkomsten går till staten. Du får stora resurser att bygga samhälle för. Ekonomin bromsar in, industrin investerar mindre och missnöjet är påtagligt.' },
      { id: 't60', name: '60–80%', mods: { income: 35, gdp: -20, factory: -12, approval: -20, welfare: 15, unrest: 14, corruption: 5 },
        desc: 'Konfiskatorisk beskattning där staten tar merparten av allt som produceras. Statskassan flödar över och kan finansiera vad som helst. I gengäld kollapsar incitamenten, pengar göms undan, folket rasar och oron blir farlig.' },
    ],
  },
  un: {
    name: 'UN membership', icon: '\u{1F310}',
    options: [
      { id: 'none', name: 'None member', mods: { statepower: 5, justtime: -15, approval: -5, income: -5 },
        desc: 'Ditt land står helt utanför FN och erkänner inga internationella beslut. Du kan rättfärdiga krig betydligt snabbare eftersom ingen instans behöver övertygas. Priset är diplomatisk isolering, sämre handel och ett folk som känner sig utfryst från världen.' },
      { id: 'partner', name: 'Partner', mods: { justtime: -5 },
        desc: 'Samarbetspartner utan fullt medlemskap — du deltar när det passar dig. Något friare händer i krigsfrågor. Nästan neutralt i övrigt.' },
      { id: 'member', name: 'Member', default: true, mods: {},
        desc: 'Vanligt medlemskap med rösträtt och skyldigheter. Varken bonus eller straff. Utgångsläget.' },
      { id: 'important', name: 'Important member', mods: { income: 5, approval: 5, justtime: 8, polpower: 3 },
        desc: 'Du är en tongivande röst som andra länder lyssnar på och söker stöd hos. Handeln går lättare och din regering får internationell tyngd. Å andra sidan tar det längre tid att rättfärdiga ett krig när världen tittar på dig.' },
      { id: 'head', name: 'Head member', mods: { income: 10, approval: 8, justtime: 15, polpower: 6, statepower: 5 },
        desc: 'Ditt land leder världssamfundet och sätter dagordningen i de stora frågorna. Handel, anseende och politisk styrka stärks kraftigt. Men varje krigsförberedelse granskas i detalj, vilket gör militär expansion mycket långsam.' },
    ],
  },
  immigration: {
    name: 'Immigration', icon: '\u{1F6C2}',
    options: [
      { id: 'noborders', name: 'No borders', mods: { immigration: 35, manpower: 12, gdp: 5, integration: -20, safety: -12, unrest: 10, welfare: -8 },
        desc: 'Gränserna är helt öppna — vem som helst får komma och stanna utan tillstånd. Befolkningen växer snabbt och du får arbetskraft och rekryter i mängd. Men ingen hinner integreras, tryggheten sjunker och trygghetssystemen belastas hårt.' },
      { id: 'open', name: 'Open', mods: { immigration: 22, manpower: 8, gdp: 4, integration: -10, safety: -5, unrest: 5 },
        desc: 'Generös invandringspolitik där de flesta som söker sig hit får komma. Ekonomin och befolkningen växer. Integrationen hinner inte riktigt med, vilket märks i sammanhållningen.' },
      { id: 'relaxed', name: 'Relaxed', mods: { immigration: 12, manpower: 4, integration: -4 },
        desc: 'Uppmuntrande men reglerad invandring med enkla tillstånd. Ger tillväxt utan större påfrestningar. Ett måttligt öppet läge.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Reglerad invandring i takt med vad samhället bedöms klara av. Varken bonus eller straff. Utgångsläget.' },
      { id: 'managed', name: 'Managed', mods: { immigration: -8, integration: 8, safety: 3 },
        desc: 'Styrd invandring där kompetens och behov avgör vem som får komma. De som kommer integreras väl och tryggheten stärks. Inflödet blir mindre än annars.' },
      { id: 'restricted', name: 'Restricted', mods: { immigration: -18, integration: 12, safety: 5, manpower: -5, gdp: -3 },
        desc: 'Hård reglering där endast få får uppehållstillstånd. Sammanhållningen och tryggheten stärks tydligt. Arbetskraften krymper och ekonomin tappar fart.' },
      { id: 'closed', name: 'Closed', mods: { immigration: -30, integration: 15, safety: 6, manpower: -10, gdp: -8, approval: -5 },
        desc: 'Gränserna är stängda — praktiskt taget ingen släpps in. Landet blir homogent, tryggt och enkelt att styra. Befolkningen slutar växa, ekonomin krymper och omvärlden ser dig som en främling.' },
      // BUFF (V5): massdeportation levererar nu det den lovar — sammanhållning,
      // trygghet och statskontroll — men till ett fortsatt högt mänskligt pris.
      { id: 'deportation', name: 'Mass deportation', mods: { immigration: -55, integration: 25, safety: 18, statepower: 15, ideopower: 12, welfare: 10, manpower: -8, gdp: -6, approval: -8, unrest: 12, freedom: -18 },
        desc: 'Staten utvisar systematiskt stora grupper som inte anses höra hemma i landet. Samhället blir snabbt enhetligt: integrationsproblemen försvinner, brottsligheten faller och trygghetssystemen räcker till fler av dem som är kvar. Statsapparaten växer sig stark på uppgiften, men friheten stryps hårt, omvärlden fördömer dig och gatorna blir oroliga.' },
    ],
  },
  culture: {
    name: 'Culture', icon: '\u{1F3FA}',
    options: [
      { id: 'multi', name: 'Multi-Culture', mods: { immigration: 10, freedom: 8, integration: -8, ideopower: -5 },
        desc: 'Staten uppmuntrar aktivt att olika kulturer lever sida vid sida på egna villkor. Landet blir attraktivt att flytta till och friheten är stor. Priset är att den gemensamma identiteten försvagas och att din ideologi får svårare att nå alla.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Staten tar inte ställning — kulturer möts och blandas av sig själva. Varken bonus eller straff. Utgångsläget.' },
      // BUFF (V5): monokultur ger nu stark sammanhållning, lugn och ideologiskt
      // grepp — det är själva poängen med att välja den.
      { id: 'mono', name: 'Mono-Culture', mods: { integration: 28, ideopower: 20, stability: 14, unrest: -8, safety: 6, immigration: -15, freedom: -10 },
        desc: 'En enda nationell kultur bärs fram av staten genom skola, medier och offentliga rum — alla förväntas dela den. Sammanhållningen blir mycket stark, nykomlingar assimileras snabbt och din ideologi når fram utan konkurrens. I gengäld begränsas den personliga friheten och landet blir mindre lockande för omvärlden.' },
    ],
  },
  religion: {
    name: 'Religious emphasis', icon: '\u{26EA}',
    options: [
      { id: 'atheism', name: 'Atheism', mods: { research: 5, freedom: 3, ideopower: 5, approval: -5, unrest: 3 },
        desc: 'Staten är uttalat ateistisk och religion trängs tillbaka ur det offentliga livet. Forskningen får fritt spelrum och den statliga ideologin fyller tomrummet. De troende känner sig påhoppade, vilket kostar i nöjdhet och skapar viss oro.' },
      { id: 'secularism', name: 'Secularism', default: true, mods: {},
        desc: 'Tydlig åtskillnad mellan stat och religion — tro är en privatsak. Varken bonus eller straff. Utgångsläget.' },
      // BUFF (V5): statsreligion ger nu verklig kraft — sammanhållning, lugn och
      // ett folk som känner igen sig i staten.
      { id: 'statereligion', name: 'State religion', mods: { ideopower: 28, stability: 20, approval: 14, unrest: -10, integration: 15, welfare: 8, freedom: -12, research: -8 },
        desc: 'En officiell statsreligion genomsyrar lagar, skola och offentligt liv, och kyrkan blir en gren av staten. Sammanhållningen och lugnet blir mycket stort: folket delar en gemensam berättelse, församlingarna bär en del av omsorgen och din ideologi vilar på helig grund. Priset är att oliktänkande trängs undan och att vetenskapen får väja för läran.' },
    ],
  },
  elections: {
    name: 'Elections', icon: '\u{1F5F3}\u{FE0F}',
    options: [
      { id: 'entirelyfree', name: 'Entirely free', mods: { freedom: 18, approval: 12, statepower: -12, polpower: -8, corruption: -8 },
        desc: 'Helt fria och rättvisa val med oberoende valmyndighet och full insyn. Legitimiteten är total och korruptionen får svårt att fästa. Du kan förlora makten, och statsapparaten lyder valresultatet snarare än dig.' },
      { id: 'free', name: 'Free', mods: { freedom: 12, approval: 8, statepower: -6, corruption: -5 },
        desc: 'Fria val med mindre brister som inte påverkar utfallet. Folket litar på systemet och makten har verklig förankring. Din handlingsfrihet begränsas av att du måste vinna igen.' },
      { id: 'mostlyfree', name: 'Mostly free', mods: { freedom: 6, approval: 4, statepower: -3 },
        desc: 'I huvudsak fria val, men med vissa fördelar för den som sitter vid makten. Ger legitimitet utan att helt binda händerna. Ett mellanläge åt det demokratiska hållet.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Val hålls regelbundet och räknas korrekt, men spelplanen lutar något. Varken bonus eller straff. Utgångsläget.' },
      { id: 'hybrid', name: 'Hybrid', mods: { statepower: 6, freedom: -6, approval: -3, corruption: 4 },
        desc: 'Val hålls men villkoren gynnar systematiskt makthavaren genom mediautrymme och regler. Du sitter säkrare och staten lyder dig mer. Folket ser vad som pågår och tilliten sjunker.' },
      { id: 'unfair', name: 'Unfair', mods: { statepower: 12, polpower: 8, freedom: -15, approval: -10, corruption: 10, unrest: 6 },
        desc: 'Valen är riggade — oppositionen hindras, rösterna räknas som det passar. Din maktbas blir mycket stabil och statsapparaten helt din. Legitimiteten går förlorad, korruptionen frodas och oron växer.' },
      { id: 'no', name: 'No elections', mods: { statepower: 22, polpower: 15, freedom: -25, approval: -18, corruption: 15, unrest: 12, ideopower: 10 },
        desc: 'Inga val hålls överhuvudtaget — makten byts inte genom röstning. Du får maximal handlingsfrihet och en statsapparat utan invändningar. Priset är att varje missnöje samlas upp utan ventil och till slut måste ta sig ut på annat sätt.' },
    ],
  },
  government: {
    name: 'Form of government', icon: '\u{1F3DB}\u{FE0F}',
    options: [
      { id: 'directdemo', name: 'Direct democracy', mods: { freedom: 20, approval: 15, polpower: -18, statepower: -15, justtime: 15, unrest: -5 },
        desc: 'Folket röstar direkt om sakfrågor istället för att välja företrädare. Legitimiteten och friheten är oöverträffad och folket känner verkligt ägarskap. Men varje beslut tar tid, staten blir svag och krig är nästan omöjliga att få igenom.' },
      { id: 'strongdemo', name: 'Strong democracy', mods: { freedom: 14, approval: 10, polpower: -10, statepower: -8, justtime: 10 },
        desc: 'Stark parlamentarisk demokrati med verklig maktdelning och starka institutioner. Friheten är stor och regeringen har brett stöd. Handlingskraften begränsas av att allt måste förankras.' },
      { id: 'democracy', name: 'Democracy', mods: { freedom: 8, approval: 6, polpower: -5, justtime: 5 },
        desc: 'Vanlig representativ demokrati med regelbundna maktskiften. Ger frihet och stöd till ett måttligt pris i handlingskraft. Ett stabilt och beprövat styrelseskick.' },
      { id: 'mixed', name: 'Mixed', default: true, mods: {},
        desc: 'Blandform med både folkvalda och icke-valda maktcentra. Varken bonus eller straff. Utgångsläget.' },
      { id: 'hybrid', name: 'Hybrid', mods: { polpower: 6, statepower: 6, freedom: -6, justtime: -5 },
        desc: 'Formellt demokratiskt men med en stark verkställande makt som dominerar. Beslut går snabbare och staten lyder dig mer. Friheten krymper märkbart.' },
      // BUFF (V5): auktoritärt styre ger nu verklig handlingskraft — snabba
      // beslut, snabb krigsrättfärdigande och en armé som lyder direkt.
      { id: 'authoritarian', name: 'Authoritarian', mods: { polpower: 24, statepower: 26, freedom: -18, approval: -6, justtime: -20, unrest: 5, milpower: 14, readiness: 10, stability: 8, ideopower: 8 },
        desc: 'Makten är samlad hos en stark ledning som styr utan att behöva förankra sina beslut. Du får enorm handlingskraft: lagar går igenom direkt, militären lyder omedelbart och krig kan rättfärdigas på kort tid. Priset är att friheten stryps och att missnöje inte längre har någon laglig väg ut.' },
      // BUFF (V5): totalitärt styre är nu det mäktigaste styrelseskicket i spelet
      // — allt går din väg, till priset av ett samhälle utan andrum.
      { id: 'totalitarian', name: 'Totalitarianism', mods: { polpower: 38, statepower: 45, freedom: -35, approval: -12, justtime: -32, unrest: 10, milpower: 24, readiness: 18, ideopower: 28, stability: 15, factory: 12, corruption: 8 },
        desc: 'Staten kontrollerar samhällets alla delar — politik, ekonomi, kultur och privatliv. Ingenting står i vägen för din vilja: industrin ställs om på order, armén mobiliseras utan debatt, krig rättfärdigas nästan omedelbart och ideologin når varje medborgare. I gengäld är friheten i praktiken borttagen, korruptionen växer i skuggan och missnöjet trycks ihop tills det brister.' },
    ],
  },
  civil_rights: {
    name: 'Civil rights', icon: '\u{270A}',
    options: [
      { id: 'extremelyhigh', name: 'Extremely high', mods: { freedom: 22, qol: 10, approval: 10, statepower: -12, safety: -5, justtime: 10 },
        desc: 'Omfattande och okränkbara rättigheter med starkt domstolsskydd mot staten. Friheten och livskvaliteten når toppnivå och folket står bakom dig. Polis och militär binds hårt, vilket märks i tryggheten och gör krigsförberedelser långsamma.' },
      { id: 'veryhigh', name: 'Very high', mods: { freedom: 14, qol: 6, approval: 6, statepower: -6 },
        desc: 'Starka rättigheter som skyddas i praktiken, inte bara på papperet. Ger stor frihet och nöjdhet. Statens verktyg begränsas något.' },
      { id: 'high', name: 'High', mods: { freedom: 8, qol: 3, approval: 3 },
        desc: 'Goda rättigheter i nivå med ett utvecklat rättssamhälle. Ger frihet utan påtagliga nackdelar. Ett tryggt läge åt det liberala hållet.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Grundläggande rättigheter som kan inskränkas när staten anser det nödvändigt. Varken bonus eller straff. Utgångsläget.' },
      { id: 'limited', name: 'Limited', mods: { statepower: 8, safety: 4, freedom: -10, approval: -4 },
        desc: 'Rättigheterna är villkorade och staten kan åsidosätta dem vid behov. Ordningsmakten får fria händer och tryggheten stiger. Friheten krymper märkbart.' },
      { id: 'verylimited', name: 'Very limited', mods: { statepower: 15, safety: 6, freedom: -20, approval: -8, unrest: 8 },
        desc: 'Få verkliga rättigheter — staten avgör vad som gäller från fall till fall. Ordningen upprätthålls effektivt och statsapparaten blir stark. Folket förstår att de saknar skydd, och oron stiger.' },
      { id: 'norights', name: 'No rights', mods: { statepower: 25, safety: 5, freedom: -40, approval: -15, unrest: 18, qol: -12 },
        desc: 'Medborgarna har inga rättigheter gentemot staten överhuvudtaget. Din makt över samhället blir total och inget kan överklagas. Livskvaliteten kollapsar och oron når nivåer som hotar hela styret.' },
    ],
  },
  economic_system: {
    name: 'Economic system', icon: '\u{2699}\u{FE0F}',
    options: [
      { id: 'central', name: 'Central', mods: { statepower: 15, factory: 8, welfare: 8, gdp: -12, income: -5, corruption: 8, freedom: -10 },
        desc: 'Staten äger och styr produktionsmedlen centralt enligt plan. Industrin kan ställas om på order och välfärden byggs ut utan marknadens motstånd. Effektiviteten sjunker, välståndet stagnerar och planapparaten göder korruption.' },
      // BUFF (V5): tredje ståndpunkten är nu ett eget starkt spår — industriell
      // kraft och ideologisk enhet utan planekonomins svinn.
      { id: 'thirdpos', name: 'Third position', mods: { statepower: 22, factory: 22, ideopower: 20, milpower: 10, income: 12, stability: 10, welfare: 8, gdp: -4, freedom: -10 },
        desc: 'Varken marknad eller planekonomi: privat ägande behålls men underordnas nationens intresse genom korporativa förbund av stat, företag och arbetare. Industrin går för högtryck mot statens mål, konflikter mellan arbete och kapital upphör och ekonomin blir ett verktyg för din politik. Priset är att den ekonomiska friheten begränsas och att välståndet per person växer långsammare än i en fri marknad.' },
      { id: 'planned', name: 'Planned', mods: { statepower: 8, factory: 5, welfare: 5, gdp: -6, freedom: -5 },
        desc: 'Marknaden finns kvar men staten styr investeringar och nyckelsektorer enligt plan. Ger viss industriell kraft och trygghet. Tillväxten och friheten dämpas.' },
      { id: 'market', name: 'Market', default: true, mods: {},
        desc: 'Fungerande marknadsekonomi med statlig reglering. Varken bonus eller straff. Utgångsläget.' },
      { id: 'plain', name: 'Plain', mods: { gdp: 10, income: 5, freedom: 8, welfare: -8, statepower: -8, corruption: -3 },
        desc: 'Oreglerad marknad där staten håller sig undan nästan helt. Välståndet och friheten växer och korruptionen får mindre att gripa tag i. Trygghetssystemen tunnas ut och staten tappar sina ekonomiska verktyg.' },
    ],
  },
  education: {
    name: 'Education', icon: '\u{1F393}',
    options: [
      { id: 'nonecomp', name: 'None compulsory', mods: { freedom: 10, research: -20, hdi: -12, gdp: -8, income: 5 },
        desc: 'Ingen skolplikt — familjer avgör själva om barnen ska utbildas. Friheten är stor och staten sparar pengar. Forskningen kollapsar, den mänskliga utvecklingen faller och ekonomin tappar kompetens.' },
      { id: 'freewill', name: 'Free will', mods: { freedom: 6, research: -10, hdi: -6 },
        desc: 'Skolan finns men deltagandet är frivilligt och innehållet fritt. Ger valfrihet till priset av kunskapsnivån. Ett tydligt bakslag för forskning och utveckling.' },
      { id: 'free', name: 'Free', mods: { research: 5, hdi: 5, income: -5 },
        desc: 'Avgiftsfri utbildning för alla, hela vägen upp. Kunskapsnivån och forskningen stiger. Kostar staten pengar varje dag.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Allmän skolplikt med en läroplan i nivå med ett normalt utvecklat land. Varken bonus eller straff. Utgångsläget.' },
      { id: 'strict', name: 'Strict', mods: { research: 8, hdi: 4, freedom: -5, approval: -3 },
        desc: 'Hårda krav, prov och disciplin i skolan med tydliga resultatmål. Kunskapsnivån och forskningen lyfter. Eleverna pressas och friheten i klassrummet försvinner.' },
      { id: 'verystrict', name: 'Very strict', mods: { research: 12, hdi: 6, freedom: -10, approval: -6, unrest: 4 },
        desc: 'Mycket hård skola med utslagning, gallring och sträng disciplin. Ger en välutbildad elit och stark forskning. Pressen skapar missnöje och oro bland unga och deras familjer.' },
      { id: 'authority', name: 'School authority', mods: { research: 15, ideopower: 10, statepower: 8, freedom: -15, approval: -8, unrest: 6 },
        desc: 'Skolan är ett statligt fostringsinstrument där läroplanen bär din ideologi. Varje generation formas efter statens behov och forskningen styrs dit du vill. Friheten stryps och familjer som tänker annorlunda blir motståndare.' },
    ],
  },
  trials: {
    name: 'Trials', icon: '\u{2696}\u{FE0F}',
    options: [
      { id: 'long', name: 'Long', mods: { freedom: 8, safety: -3, corruption: -8, income: -5, justtime: 8 },
        desc: 'Grundliga rättegångar med full bevisprövning och alla överklagandemöjligheter. Rättssäkerheten är hög och korruption avslöjas i domstol. Processerna är dyra, långsamma och släpper ut misstänkta under tiden.' },
      { id: 'extended', name: 'Extended', mods: { freedom: 4, corruption: -4, income: -3 },
        desc: 'Utförliga processer med god rättssäkerhet men utan överdriven långsamhet. Håller korruptionen nere. Kostar tid och pengar.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Normala rättegångar med rimlig handläggningstid. Varken bonus eller straff. Utgångsläget.' },
      { id: 'speedup', name: 'Speed up', mods: { safety: 4, income: 3, freedom: -5, corruption: 4 },
        desc: 'Förenklade och snabbare processer med färre överklaganden. Brottslingar hamnar snabbt bakom lås och tryggheten stiger. Rättssäkerheten urholkas och felaktiga domar blir vanligare.' },
      { id: 'quick', name: 'Quick', mods: { safety: 6, income: 5, statepower: 5, freedom: -10, corruption: 8 },
        desc: 'Snabbrättegångar där skuldfrågan avgörs på timmar utan reell prövning. Rättsväsendet blir billigt, effektivt och ett verktyg för staten. Oskyldiga döms regelbundet och domstolarna blir korrumperade.' },
    ],
  },
  punishments: {
    name: 'Punishments', icon: '\u{1F517}',
    options: [
      { id: 'minimal', name: 'Minimal', mods: { freedom: 8, approval: 4, safety: -8, unrest: 4 },
        desc: 'Mycket milda straff med fokus på villkorlighet och böter. Samhället uppfattas som humant och friheten är stor. Avskräckningen försvinner, brottsligheten stiger och oron med den.' },
      { id: 'low', name: 'Low', mods: { freedom: 4, safety: -4 },
        desc: 'Låga straffnivåer där frihetsberövande är sista utvägen. Humant men märks i tryggheten. Ett mjukt läge.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Straff som står i proportion till brottet enligt normal praxis. Varken bonus eller straff. Utgångsläget.' },
      { id: 'harsh', name: 'Harsh', mods: { safety: 8, statepower: 5, freedom: -8, approval: -4, unrest: 3 },
        desc: 'Stränga straff med långa fängelsetider även för medelsvåra brott. Avskräckningen fungerar och gatorna blir tryggare. Friheten krymper och en växande fångbefolkning skapar missnöje.' },
      { id: 'veryharsh', name: 'Very harsh', mods: { safety: 12, statepower: 10, freedom: -15, approval: -8, unrest: 6, qol: -5 },
        desc: 'Extremt stränga straff där även mindre förseelser ger hårda påföljder. Brottsligheten trycks ned kraftigt och staten visar sin styrka. Livskvaliteten sjunker, familjer splittras och oron växer.' },
    ],
  },
  rehabilitation: {
    name: 'Rehabilitation', icon: '\u{1F331}',
    options: [
      { id: 'veryhigh', name: 'Very high', mods: { safety: 10, qol: 8, welfare: 6, income: -10, unrest: -5 },
        desc: 'Omfattande program med utbildning, terapi och stöd ut i samhället efter avtjänat straff. Återfallen minskar kraftigt vilket gör landet varaktigt tryggare och lugnare. Programmen är dyra och belastar statskassan.' },
      { id: 'high', name: 'High', mods: { safety: 6, qol: 5, welfare: 4, income: -6, unrest: -3 },
        desc: 'Väl utbyggd rehabilitering som fungerar för de flesta intagna. Färre återfall och tryggare samhälle. Kostar pengar varje dag.' },
      { id: 'extended', name: 'Extended', mods: { safety: 3, qol: 2, income: -3 },
        desc: 'Utökade insatser utöver det grundläggande. Ger måttlig effekt till måttlig kostnad. Ett steg åt det humana hållet.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Grundläggande rehabilitering inom kriminalvården. Varken bonus eller straff. Utgångsläget.' },
      { id: 'shortened', name: 'Shortened', mods: { income: 3, safety: -3 },
        desc: 'Nedskuren rehabilitering med minimala program. Sparar pengar. Fler återfaller i brott efter frigivning.' },
      { id: 'unavailable', name: 'Unavailable', mods: { income: 6, safety: -8, unrest: 5, qol: -4 },
        desc: 'Ingen rehabilitering erbjuds — fängelset förvarar bara. Billigt att driva. Nästan alla återfaller, brottsligheten cementeras och samhället blir otryggare.' },
      { id: 'nonexistent', name: 'Non-existent', mods: { income: 8, safety: -12, unrest: 8, qol: -8, approval: -5 },
        desc: 'Systemet saknar helt insatser för dem som ska ut igen — de släpps rakt ut utan något. Kriminalvården blir den billigaste tänkbara. En permanent brottslig underklass växer fram och drar ner hela samhället.' },
    ],
  },
  death_penalty: {
    name: 'Death penalty', icon: '\u{1F480}',
    options: [
      { id: 'notinuse', name: 'Not in use', default: true, mods: {},
        desc: 'Dödsstraffet är avskaffat och används inte i något fall. Varken bonus eller straff. Utgångsläget.' },
      { id: 'exceptional', name: 'Exceptional case', mods: { safety: 3, statepower: 3, freedom: -3, approval: -2 },
        desc: 'Dödsstraff finns kvar i lagen men tillämpas endast vid landsförräderi eller krig. Signalvärdet ger viss avskräckning. Marginell kostnad i frihet och nöjdhet.' },
      { id: 'balanced', name: 'Balanced', mods: { safety: 5, statepower: 5, freedom: -6, approval: -4, unrest: 2 },
        desc: 'Dödsstraff används vid de grövsta brotten efter full prövning. Ger tydlig avskräckning och visar statens allvar. Delar befolkningen och kostar i frihet.' },
      { id: 'inuse', name: 'In use', mods: { safety: 8, statepower: 8, freedom: -10, approval: -6, unrest: 4 },
        desc: 'Dödsstraffet är ett normalt inslag i rättsväsendet för allvarliga brott. Brottsligheten trycks ned och staten framstår som obeveklig. Friheten krymper och oppositionen får en fråga att samlas kring.' },
      { id: 'highlyinuse', name: 'Highly in use', mods: { safety: 10, statepower: 12, freedom: -16, approval: -10, unrest: 8, hdi: -5 },
        desc: 'Avrättningar är vanliga och används även för brott som inte är dödliga. Statens makt över liv och död blir ett styrmedel. Samhällets utveckling skadas, folket fruktar rättsväsendet och oron stiger.' },
      { id: 'majority', name: 'Majority used', mods: { safety: 10, statepower: 16, freedom: -25, approval: -15, unrest: 12, hdi: -10, qol: -8 },
        desc: 'Dödsstraff är den vanligaste påföljden för allvarliga brott och verkställs snabbt. Statsapparatens grepp blir järnhårt. Landet blir en plats folk fruktar att leva i — livskvaliteten faller och oron blir farlig.' },
    ],
  },
  globalism: {
    name: 'Globalism', icon: '\u{1F30D}',
    options: [
      { id: 'major', name: 'Major global partner', mods: { income: 15, gdp: 12, immigration: 8, research: 6, statepower: -8, ideopower: -6 },
        desc: 'Ditt land är djupt integrerat i världsekonomin med frihandel, öppna kapitalflöden och internationellt forskningssamarbete. Handeln blomstrar, välståndet växer och kunskap flödar in. Priset är beroende av omvärlden och att din egen ideologi späds ut av utländskt inflytande.' },
      { id: 'big', name: 'Big global partner', mods: { income: 10, gdp: 8, immigration: 5, research: 4, statepower: -5 },
        desc: 'Omfattande internationellt samarbete och handel utan att helt lämna över kontrollen. Ekonomin och forskningen går bra. Staten tappar en del av sitt handlingsutrymme.' },
      { id: 'partner', name: 'Partner', mods: { income: 5, gdp: 4, research: 2 },
        desc: 'Normalt handels- och forskningsutbyte med omvärlden. Ger måttlig ekonomisk vinst utan nämnvärda nackdelar. Ett tryggt öppet läge.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Öppen för handel men försiktig med beroenden. Varken bonus eller straff. Utgångsläget.' },
      { id: 'protectionism', name: 'Selective protectionism', mods: { factory: 6, statepower: 5, income: -5, gdp: -4 },
        desc: 'Tullar och regler skyddar utvalda inhemska branscher från utländsk konkurrens. Den egna industrin växer sig starkare och staten får kontroll. Handelsinkomsterna och välståndet minskar.' },
      { id: 'disengagement', name: 'Diplomatic disengagement', mods: { factory: 8, statepower: 8, income: -12, gdp: -10, research: -5, justtime: -8 },
        desc: 'Ditt land drar sig medvetet tillbaka från internationella sammanhang och avtal. Industrin blir självförsörjande och du binds inte av andras åsikter — krig blir lättare att motivera. Ekonomin och forskningen tar tydlig skada.' },
      { id: 'isolationist', name: 'Isolationist', mods: { factory: 10, statepower: 12, ideopower: 8, income: -20, gdp: -15, research: -10, immigration: -20, justtime: -12 },
        desc: 'Landet sluter sig helt: minimal handel, inga allianser, stängda gränser. Du blir omöjlig att påverka utifrån, ideologin står oemotsagd och industrin bygger allt själv. Priset är fattigdom, teknisk eftersläpning och en befolkning avskuren från världen.' },
    ],
  },
  popgrowth: {
    name: 'Population growth', icon: '\u{1F476}',
    options: [
      { id: 'none', name: 'None compulsory', mods: { freedom: 8, qol: 5, manpower: -12 },
        desc: 'Staten lägger sig inte i familjebildning på något sätt och erbjuder inga särskilda stöd. Friheten och livskvaliteten är hög. Födelsetalen sjunker och rekryteringsunderlaget till armén krymper.' },
      { id: 'discouraged', name: 'Not encouraged', mods: { freedom: 4, qol: 3, manpower: -6 },
        desc: 'Inga familjestöd och en tyst hållning om att färre barn är bättre. Ger frihet och resurser till annat. Befolkningen åldras och armén får svårare att fyllas på.' },
      { id: 'balanced', name: 'Balanced', default: true, mods: {},
        desc: 'Normala familjestöd utan att staten styr åt något håll. Varken bonus eller straff. Utgångsläget.' },
      { id: 'encouraged', name: 'Encouraged', mods: { manpower: 8, income: -4, welfare: 4 },
        desc: 'Barnbidrag, föräldraledighet och bostadsstöd uppmuntrar större familjer. Befolkningen växer och armén får rekryter. Kostar statskassan pengar varje dag.' },
      { id: 'mandatory', name: 'Mandatory', mods: { manpower: 18, freedom: -15, qol: -8, unrest: 8, income: -8 },
        desc: 'Staten ställer krav på barnafödande med kraftiga förmåner för den som lyder och nackdelar för den som inte gör det. Befolkningen växer snabbt och rekryteringen till armén blir aldrig ett problem. Intrånget i privatlivet är stort, livskvaliteten sjunker och missnöjet växer.' },
    ],
  },
  workhours: {
    name: 'Working hours', icon: '\u{23F1}\u{FE0F}',
    options: [
      { id: 'minimum', name: 'Minimum', mods: { qol: 12, hdi: 6, freedom: 5, factory: -12, income: -8 },
        desc: 'Kraftigt förkortad arbetsvecka med mycket ledighet och semester. Livskvaliteten och den mänskliga utvecklingen stiger tydligt. Industriproduktionen och skatteintäkterna faller märkbart.' },
      { id: 'limited', name: 'Limited', mods: { qol: 6, hdi: 3, factory: -5, income: -3 },
        desc: 'Begränsad arbetstid med god ledighet och skydd mot övertid. Folk mår bättre. Produktionen tappar något.' },
      { id: 'mixed', name: 'Mixed', default: true, mods: {},
        desc: 'Normal arbetsvecka med reglerad övertid. Varken bonus eller straff. Utgångsläget.' },
      { id: 'extended', name: 'Extended', mods: { factory: 8, income: 6, qol: -6, unrest: 4 },
        desc: 'Längre arbetsdagar och mer tillåten övertid. Industrin producerar mer och skatteintäkterna stiger. Livskvaliteten sjunker och arbetsplatserna blir oroliga.' },
      { id: 'maximum', name: 'Maximum', mods: { factory: 18, income: 12, qol: -15, hdi: -8, unrest: 12, approval: -8 },
        desc: 'Maximal arbetstid med minimal ledighet — allt underordnas produktionen. Industrin går för högtryck och statskassan fylls snabbt. Utbrändhet, sjukdom och vrede sprider sig genom arbetarklassen och oron blir farlig.' },
    ],
  },
};

export function defaultLaws() {
  const laws = {};
  for (const [cat, def] of Object.entries(LAWS)) {
    laws[cat] = def.options.find((o) => o.default)?.id || def.options[Math.floor(def.options.length / 2)].id;
  }
  return laws;
}

export function lawOption(cat, optId) {
  return LAWS[cat]?.options.find((o) => o.id === optId) || null;
}

// summera alla lageffekter → { statId: delta }
export function lawMods(laws) {
  const sum = {};
  for (const [cat, optId] of Object.entries(laws || {})) {
    const opt = lawOption(cat, optId);
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.mods)) sum[k] = (sum[k] || 0) + v;
  }
  return sum;
}

export function lawChangeCost(cat, fromId, toId) {
  const opts = LAWS[cat]?.options || [];
  const a = opts.findIndex((o) => o.id === fromId);
  const b = opts.findIndex((o) => o.id === toId);
  if (a < 0 || b < 0) return 999;
  return Math.abs(a - b) * LAW_STEP_COST;
}
