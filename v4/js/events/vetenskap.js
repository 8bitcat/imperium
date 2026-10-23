// IMPERIUM V5.6 — HÄNDELSER: VETENSKAP, TEKNIK & UTBILDNING.
// Rymd, AI, medicin, patent, forskningsbudget, universitet, skola, kunskapsflykt, internet, cyberhot och forskningsetik.
export const EVENTS = [

  // ================= RYMDEN =================
  {
    id: 'vet_first_satellite', icon: '\u{1F6F0}\u{FE0F}', weight: 2,
    title: 'VÅR FÖRSTA EGNA SATELLIT',
    text: 'Ingenjörerna vid det nationella rymdinstitutet har byggt landets första satellit. Den står färdig i en hangar och väntar bara på en raket - och på ett beslut från dig.',
    when: (c) => c.res('satellites') >= 2 && c.st.research > 10 && (c.ind.hitech ?? 0) > 2,
    choices: [
      { text: 'SKJUT UPP DEN MED EN EGEN RAKET', cost: { money: 1200, rp: 60 }, perm: { research: 8, ideopower: 6 }, temp: { approval: 6 }, tip: 'Om den exploderar på rampen sänds det i direkt-tv.' },
      { text: 'KÖP EN PLATS PÅ EN UTLÄNDSK RAKET', cost: { money: 500 }, perm: { research: 5 }, rel: 4, tip: 'Billigare. Flaggan på raketen är någon annans.' },
      { text: 'GÖR DEN TILL EN SPANINGSSATELLIT', cost: { money: 800, pp: 15 }, perm: { milpower: 6, readiness: 5 }, rel: -6, tip: 'Grannarna undrar varför kameran pekar mot dem.' },
      { text: 'STÄLL DEN PÅ MUSEUM', perm: { research: -3 }, temp: { approval: -3 }, tip: 'Den är vacker att titta på. Den gör ingenting.' },
    ],
  },
  {
    id: 'vet_moon_mission', icon: '\u{1F315}', weight: 1, cooldown: 900,
    title: 'MÅNEN ÄR INOM RÄCKHÅLL',
    text: 'Rymdstyrelsen lägger fram en plan för en landning på månen inom tio år. Ingenjörerna säger att det går. Finansministern säger att det inte gör det.',
    when: (c) => c.res('satellites') >= 5 && c.st.research > 25 && c.money > 1200,
    choices: [
      { text: 'BEMANNAD LANDNING - VI SKA DIT SJÄLVA', cost: { money: 2200, rp: 120 }, perm: { research: 12, ideopower: 10 }, mod: 'national_unity', tip: 'Hela landet kommer att sitta uppe den natten.' },
      { text: 'SKICKA EN OBEMANNAD LANDARE', cost: { money: 900, rp: 50 }, perm: { research: 8 }, temp: { approval: 4 }, tip: 'En robot får äran. Robotar klagar inte.' },
      { text: 'GÅ MED I ETT INTERNATIONELLT MÅNPROGRAM', cost: { money: 500 }, perm: { research: 5, statepower: -2 }, rel: 10, tip: 'Vår astronaut får sitta längst bak.' },
      { text: 'MÅNEN FÅR VÄNTA', perm: { research: -2 }, temp: { approval: -3 }, tip: 'Den har väntat i fyra miljarder år.' },
    ],
  },
  {
    id: 'vet_gps_jamming', icon: '\u{1F4E1}', weight: 2,
    title: 'NÅGON STÖR VÅR SATELLITNAVIGERING',
    text: 'Flygplan och fartyg rapporterar att deras positionssystem visar fel. Signalerna störs från andra sidan gränsen, och piloterna landar med papperskartor i knät.',
    when: (c) => (c.atWar || c.st.safety < -25) && c.res('satellites') >= 3,
    choices: [
      { text: 'BYGG ETT EGET NAVIGATIONSSYSTEM', cost: { money: 1400, rp: 60 }, perm: { readiness: 6, safety: 4, research: 3 }, tip: 'Ingen ska kunna släcka våra kartor igen.' },
      { text: 'STÖR TILLBAKA', cost: { rp: 30, pp: 10 }, temp: { readiness: 5 }, rel: -8, tip: 'Nu vet ingen var någon är.' },
      { text: 'ANMÄL STÖRNINGEN TILL FN', cost: { pp: 10 }, temp: { safety: -3 }, rel: 5, tip: 'En resolution har sällan löst ett radioproblem.' },
      { text: 'LÄR PILOTERNA ATT NAVIGERA SOM FÖRR', temp: { safety: -5, factory: -3 }, tip: 'Kompass och klocka. Det fungerade på farfars tid.' },
    ],
  },

  // ================= AI, ROBOTAR & AUTOMATISERING =================
  {
    id: 'vet_ai_teachers', icon: '\u{1F916}', weight: 2,
    title: 'EN AI-LÄRARE I VARJE KLASSRUM',
    text: 'Ett teknikbolag erbjuder en AI som kan undervisa varje elev i sin egen takt. Lärarfacket kallar det ett hot mot yrket. Föräldrarna är splittrade.',
    when: (c) => (c.ind.internet ?? 0) > 85 && c.res('education') >= 3,
    choices: [
      { text: 'INFÖR DEN I HELA SKOLAN', cost: { money: 800, rp: 40 }, perm: { research: 5, hdi: 3 }, temp: { unrest: 5 }, tip: 'Eleverna lär sig snabbare. Lärarna demonstrerar långsamt.' },
      { text: 'LÅT LÄRARNA STYRA HUR AI:N ANVÄNDS', cost: { money: 500, pp: 10 }, perm: { hdi: 3, research: 2 }, tip: 'Mindre revolution, mer samarbete.' },
      { text: 'BÖRJA MED ETT FÖRSÖK I TIO SKOLOR', cost: { money: 250 }, perm: { research: 2 }, tip: 'Utvärderingen blir klar om tre år.' },
      { text: 'FÖRBJUD AI I KLASSRUMMEN', perm: { research: -3 }, temp: { approval: 3 }, tip: 'Krita och tavla har aldrig kraschat.' },
    ],
  },
  {
    id: 'vet_driverless_trucks', icon: '\u{1F69A}', weight: 2,
    title: 'FÖRARLÖSA LASTBILAR PÅ MOTORVÄGEN',
    text: 'Det första åkeriet vill köra helt förarlösa lastbilar mellan hamnen och huvudstaden. Chaufförernas fack hotar att blockera vägarna om du säger ja.',
    when: (c) => c.res('logistics') >= 4 && (c.ind.gdppc ?? 0) > 12000,
    choices: [
      { text: 'SÄG JA - FRAMTIDEN VÄNTAR INTE', perm: { factory: 8, gdp: 4 }, temp: { unrest: 8, approval: -4 }, tip: 'Varorna kommer fram. Chaufförerna kommer till torget.' },
      { text: 'JA, MEN MED EN FÖRARE I HYTTEN I TIO ÅR', cost: { pp: 15 }, perm: { factory: 3 }, temp: { unrest: 2 }, tip: 'En människa som tittar på en dator som kör.' },
      { text: 'OMSKOLNINGSFOND FÖR CHAUFFÖRERNA', cost: { money: 700 }, perm: { factory: 6, gdp: 2 }, temp: { approval: 3 }, tip: 'De flesta blir något annat. Några blir arga ändå.' },
      { text: 'FÖRBJUD FÖRARLÖSA FORDON', perm: { factory: -3, research: -3 }, temp: { approval: 4 }, tip: 'Facket jublar. Grannlandet tar över trafiken.' },
    ],
  },
  {
    id: 'vet_deepfake_election', icon: '\u{1F3AD}', weight: 2,
    title: 'FALSKA FILMER INFÖR VALET',
    text: 'En film där oppositionsledaren erkänner mutbrott sprids i miljontals telefoner. Den är helt påhittad och gjord med AI, men hälften av väljarna tror redan på den.',
    when: (c) => (c.ind.internet ?? 0) > 70 && c.st.unrest > 10 && !c.is('elections', 'no'),
    choices: [
      { text: 'KRÄV MÄRKNING AV ALL AI-FILM', cost: { pp: 20 }, perm: { safety: 3, freedom: -1 }, tip: 'Lagen kommer. Filmerna kom igår.' },
      { text: 'TA NER ALLT SOM VERKAR FALSKT', cost: { pp: 15 }, temp: { freedom: -8, stability: 5 }, tip: 'Filtret tar ner satiren också. Och väderprognosen.' },
      { text: 'KAMPANJ FÖR KÄLLKRITIK I SKOLAN', cost: { money: 400 }, perm: { hdi: 2 }, temp: { stability: 3 }, tip: 'Nästa generation genomskådar det. Den här gör det inte.' },
      { text: 'SÄG INGENTING - DET GYNNAR OSS', perm: { freedom: -2 }, temp: { stability: -6, approval: 3 }, tip: 'Sanningen var aldrig vår bästa valarbetare.' },
    ],
  },
  {
    id: 'vet_killer_drones', icon: '\u{1F6E9}\u{FE0F}', weight: 2,
    title: 'GENERALERNA VILL HA SJÄLVSTYRANDE VAPEN',
    text: 'Försvarsforskarna har tagit fram drönare som själva väljer sina mål. Generalerna vill ha tusentals. Hundratals forskare har skrivit på ett upprop emot.',
    when: (c) => c.res('aircraft') >= 4 && (c.atWar || c.st.milpower > 20),
    choices: [
      { text: 'BYGG DEM I STOR SKALA', cost: { money: 1200, rp: 60 }, perm: { milpower: 12, readiness: 5 }, rel: -10, tip: 'Ingen människa behöver trycka på knappen. Det är just problemet.' },
      { text: 'EN MÄNNISKA MÅSTE ALLTID FATTA BESLUTET', cost: { money: 600 }, perm: { milpower: 6, safety: 2 }, tip: 'Långsammare. Någon kan ställas till svars.' },
      { text: 'STÖD ETT INTERNATIONELLT FÖRBUD', perm: { milpower: -3 }, temp: { approval: 3 }, rel: 10, tip: 'Bra för samvetet. Fienden har inte skrivit på.' },
    ],
  },
  {
    id: 'vet_ai_startup_sale', icon: '\u{1F4BB}', weight: 2,
    title: 'TEKNIKJÄTTEN VILL KÖPA VÅRT AI-BOLAG',
    text: 'Landets mest lovande AI-bolag har fått ett bud från en utländsk teknikjätte. Grundarna vill sälja. Säkerhetstjänsten vill att du stoppar affären.',
    when: (c) => c.res('economy') >= 3 && (c.ind.hitech ?? 0) > 8 && c.st.research > -10,
    choices: [
      { text: 'GODKÄNN AFFÄREN', res: { money: 900 }, perm: { research: -4 }, rel: 5, tip: 'Kontoret blir kvar. Hjärnorna flyttar till huvudkontoret.' },
      { text: 'STOPPA AFFÄREN OCH INVESTERA SJÄLV', cost: { money: 1100 }, perm: { research: 4, gdp: 2 }, mod: 'tech_breakthrough', rel: -4, tip: 'Staten blir delägare i något den inte riktigt förstår.' },
      { text: 'NATIONALISERA BOLAGET', cost: { pp: 30 }, perm: { statepower: 6, research: 2 }, mod: 'capital_flight', rel: -10, tip: 'Varje investerare i världen såg det.' },
    ],
  },

  // ================= NOBELPRIS & MEDICIN =================
  {
    id: 'vet_nobel_prize', icon: '\u{1F3C5}', weight: 1, cooldown: 800,
    title: 'NOBELPRIS TILL EN AV VÅRA FORSKARE',
    text: 'En kemist från landets största universitet har tilldelats Nobelpriset för en upptäckt hon gjorde för trettio år sedan. Hela landet firar - och undrar varför hennes labb alltid fått så lite stöd.',
    when: (c) => c.st.research > 25 && (c.ind.rnd ?? 0) > 0.5 && c.st.freedom > -20,
    choices: [
      { text: 'BYGG ETT INSTITUT I HENNES NAMN', cost: { money: 900 }, perm: { research: 8 }, temp: { approval: 4 }, tip: 'Trettio år för sent, men med fin fasad.' },
      { text: 'HÖJ ALLA FORSKNINGSANSLAG', cost: { money: 1500 }, perm: { research: 12, hdi: 2 }, tip: 'Nästa pris kommer om trettio år. Kanske tjugo.' },
      { text: 'GÖR HENNE TILL EN NATIONELL SYMBOL', cost: { pp: 10 }, temp: { ideopower: 6, approval: 6 }, tip: 'Hennes ansikte på frimärken. Hennes labb fortfarande trångt.' },
      { text: 'SKICKA ETT GRATULATIONSTELEGRAM', temp: { approval: 2 }, tip: 'Billigt och artigt.' },
    ],
  },
  {
    id: 'vet_nobel_critic', icon: '\u{1F399}\u{FE0F}', weight: 2,
    title: 'NOBELPRISTAGAREN ANGRIPER REGERINGEN',
    text: 'I sitt nobeltal ägnar landets nya pristagare tio minuter åt att kritisera hur du styr landet. Talet sänds över hela världen och delas flitigt hemma.',
    when: (c) => c.st.research > 10 && c.st.freedom < -10,
    choices: [
      { text: 'BJUD IN HENNE TILL ETT SAMTAL', cost: { pp: 15 }, temp: { approval: 4, freedom: 4 }, rel: 5, tip: 'Hon kommer. Hon ändrar sig inte.' },
      { text: 'TYSTA NER TALET I VÅRA MEDIER', cost: { pp: 10 }, temp: { freedom: -5, statepower: 4 }, rel: -6, tip: 'Resten av världen såg det ändå.' },
      { text: 'DRA IN HENNES FORSKNINGSANSLAG', perm: { research: -6 }, temp: { statepower: 3 }, mod: 'brain_drain', rel: -8, tip: 'Hennes kolleger börjar söka tjänster utomlands.' },
      { text: 'LÅTSAS ATT DU INTE HÖRDE', temp: { approval: -3 }, tip: 'Alla andra hörde.' },
    ],
  },
  {
    id: 'vet_malaria_vaccine', icon: '\u{1F489}', weight: 2,
    title: 'VACCINET FUNGERAR',
    text: 'Ett statligt laboratorium har utvecklat ett vaccin mot en tropisk sjukdom som varje år tar livet av tiotusentals barn. Studierna är klara och resultaten är bättre än någon vågat hoppas.',
    when: (c) => c.res('healthcare') >= 3 && (c.ind.u5mort ?? 0) > 25,
    choices: [
      { text: 'VACCINERA ALLA BARN GRATIS', cost: { money: 1200 }, perm: { hdi: 8, qol: 4 }, temp: { approval: 6 }, tip: 'Det dyraste du gjort. Och det bästa.' },
      { text: 'DELA RECEPTET FRITT MED VÄRLDEN', cost: { money: 400 }, perm: { hdi: 5 }, rel: 15, tip: 'Ingen patentinkomst. Väldigt många tackbrev.' },
      { text: 'SÄLJ PATENTET TILL ETT LÄKEMEDELSBOLAG', res: { money: 1500 }, perm: { hdi: 2 }, rel: -4, tip: 'Vaccinet kommer ut. Priset bestämmer någon annan.' },
    ],
  },
  {
    id: 'vet_antibiotics_fail', icon: '\u{1F48A}', weight: 2,
    title: 'ANTIBIOTIKAN SLUTAR VERKA',
    text: 'Sjukhusen rapporterar allt fler infektioner som inga mediciner biter på. Läkarna varnar för att vanliga operationer snart kan bli livsfarliga igen.',
    when: (c) => c.day > 200 && c.res('healthcare') <= 1 && c.st.research < 15,
    choices: [
      { text: 'FÖRBJUD ANTIBIOTIKA I DJURUPPFÖDNINGEN', cost: { pp: 20 }, perm: { hdi: 4, safety: 2 }, temp: { factory: -4 }, tip: 'Bönderna rasar. Bakterierna märker skillnad.' },
      { text: 'FINANSIERA JAKTEN PÅ NYA LÄKEMEDEL', cost: { money: 900, rp: 40 }, perm: { hdi: 5, research: 3 }, tip: 'Ingen helt ny sort har tagits fram på decennier. Lycka till.' },
      { text: 'STRÄNGARE REGLER FÖR RECEPTEN', perm: { hdi: 2 }, temp: { qol: -3, approval: -2 }, tip: 'Patienterna går hem utan piller men med en broschyr.' },
    ],
  },
  {
    id: 'vet_gene_edited_babies', icon: '\u{1F9EC}', weight: 1,
    title: 'GENMODIFIERADE TVILLINGAR HAR FÖTTS',
    text: 'En forskare meddelar att han har ändrat arvsmassan hos två embryon för att göra barnen immuna mot en sjukdom. Tvillingarna är friska. Världens forskare är chockade.',
    when: (c) => c.st.research > 15 && c.res('healthcare') >= 3,
    choices: [
      { text: 'ÅTALA HONOM OCH FÖRBJUD METODEN', perm: { research: -3, safety: 2 }, rel: 6, tip: 'Gränsen är dragen. Någon annan kommer att korsa den.' },
      { text: 'TILLSÄTT EN ETISK KOMMISSION', cost: { pp: 15 }, perm: { research: 2 }, temp: { stability: 2 }, tip: 'Den kommer att vara oenig i fyra år.' },
      { text: 'GÖR DET TILL ETT STATLIGT PROGRAM', cost: { money: 1000, rp: 60 }, perm: { research: 8, hdi: 3 }, temp: { unrest: 6 }, rel: -12, tip: 'Först i världen. Världen är inte imponerad.' },
    ],
  },
  {
    id: 'vet_cancer_drug_price', icon: '\u{1F9EA}', weight: 2,
    title: 'MIRAKELMEDICINEN KOSTAR EN FÖRMÖGENHET',
    text: 'Ett nytt läkemedel botar en form av blodcancer i nio fall av tio. En enda behandling kostar lika mycket som ett hus, och tillverkaren vägrar sänka priset.',
    when: (c) => c.res('healthcare') >= 4 && (c.ind.gdppc ?? 0) > 8000,
    choices: [
      { text: 'BETALA - ALLA SOM BEHÖVER SKA FÅ DEN', cost: { money: 1500 }, perm: { qol: 4, hdi: 3 }, temp: { approval: 5 }, tip: 'Vårdbudgeten gråter. Patienterna gör det inte.' },
      { text: 'TVÅNGSLICENS - VI TILLVERKAR DEN SJÄLVA', cost: { pp: 25, rp: 30 }, perm: { qol: 3, hdi: 2 }, rel: -8, tip: 'Lagligt enligt avtalen. Tillverkaren håller inte med.' },
      { text: 'BARA FÖR DEM SOM KAN BETALA', perm: { qol: 1 }, temp: { approval: -6, unrest: 4 }, tip: 'Marknaden har talat. Den talar för de rika.' },
    ],
  },

  // ================= PATENT & UPPFINNINGAR =================
  {
    id: 'vet_patent_war', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'PATENTKRIG MED EN UTLÄNDSK JÄTTE',
    text: 'En utländsk koncern stämmer landets största teknikföretag för patentintrång och kräver att försäljningen stoppas i hela världen. Tiotusentals jobb står på spel.',
    when: (c) => (c.ind.patents ?? 0) > 400 && c.st.factory > -10,
    choices: [
      { text: 'STATEN BETALAR RÄTTEGÅNGEN', cost: { money: 600 }, perm: { research: 3 }, rel: -3, tip: 'Advokaterna är de enda som säkert vinner.' },
      { text: 'TA UPP DET I HANDELSSAMTALEN', cost: { pp: 20 }, temp: { factory: 3 }, rel: -5, tip: 'Patent blev plötsligt utrikespolitik.' },
      { text: 'LÅT FÖRETAGET KLARA SIG SJÄLV', perm: { factory: -4, gdp: -2 }, rel: 3, tip: 'De förlorar, betalar och flyttar forskningen.' },
    ],
  },
  {
    id: 'vet_garage_inventor', icon: '\u{1F4A1}', weight: 2,
    title: 'SEXTONÅRINGEN SOM RENAR VATTEN',
    text: 'En gymnasieelev har uppfunnit ett vattenfilter av lera och sågspån som nästan inte kostar något att tillverka. Utländska bolag ringer redan till hennes föräldrar.',
    when: (c) => (c.ind.water ?? 100) < 60 && c.st.research > -15 && c.res('education') >= 2,
    choices: [
      { text: 'STATEN KÖPER PATENTET OCH DELAR UT FILTREN', cost: { money: 600 }, perm: { qol: 5, hdi: 4 }, tip: 'Hon blir rik. Byarna blir friska. Ovanligt bra affär.' },
      { text: 'STARTKAPITAL TILL HENNES FÖRETAG', cost: { money: 250 }, perm: { gdp: 2, research: 2 }, temp: { approval: 3 }, tip: 'Om tio år är hon landets största arbetsgivare. Eller i konkurs.' },
      { text: 'LÅT HENNE SÄLJA TILL HÖGSTBJUDANDE', perm: { research: -2 }, temp: { hdi: 1 }, rel: 2, tip: 'Filtret säljs tillbaka till oss med en annan logga.' },
    ],
  },
  {
    id: 'vet_industrial_espionage', icon: '\u{1F575}\u{FE0F}', weight: 2,
    title: 'SPIONER I VÅRA LABORATORIER',
    text: 'Säkerhetstjänsten har avslöjat att en främmande stat i flera år har stulit ritningar från landets ledande teknikföretag. Ingenjörerna känner igen sina egna produkter i utländska butiker.',
    when: (c) => (c.ind.hitech ?? 0) > 10 && c.res('espionage') <= 3,
    choices: [
      { text: 'UTVISA DERAS DIPLOMATER', cost: { pp: 15 }, perm: { safety: 3 }, rel: -10, tip: 'Tio diplomater åker hem. Tjugo nya kommer om ett år.' },
      { text: 'BYGG UPP KONTRASPIONAGET', cost: { money: 800, rp: 30 }, perm: { safety: 5, research: 2 }, tip: 'Nu misstänker alla alla. Bra för säkerheten, sämre för fikat.' },
      { text: 'STJÄL TILLBAKA', cost: { rp: 40, pp: 15 }, perm: { research: 6 }, rel: -6, tip: 'Det heter inte spionage om man kallar det omvänd ingenjörskonst.' },
      { text: 'TÄT LÄCKAN I TYSTHET', perm: { research: -3, factory: -2 }, tip: 'Ingen skandal. Inga ritningar heller.' },
    ],
  },

  // ================= FORSKNINGSBUDGET =================
  {
    id: 'vet_research_cuts', icon: '\u{2702}\u{FE0F}', weight: 2,
    title: 'FINANSMINISTERN VILL SKÄRA I FORSKNINGEN',
    text: 'Statskassan går med underskott och finansministern har hittat en post som ingen väljare märker på kort sikt: forskningsanslagen. Universiteten varnar för en förlorad generation forskare.',
    when: (c) => c.st.income < -10 && (c.ind.rnd ?? 0) > 0.4,
    choices: [
      { text: 'SKÄR NER MED EN TREDJEDEL', res: { money: 800 }, perm: { research: -8 }, temp: { unrest: 3 }, tip: 'Budgeten går ihop. Om tio år undrar någon varför inget händer.' },
      { text: 'SKYDDA FORSKNINGEN - SKÄR NÅGON ANNANSTANS', cost: { pp: 15 }, temp: { welfare: -4, approval: -3 }, tip: 'Någon annan får skrika i stället.' },
      { text: 'ÖKA FORSKNINGEN - DET ÄR EN INVESTERING', cost: { money: 900 }, perm: { research: 8, gdp: 2 }, tip: 'Finansministern begär att få sin reservation till protokollet.' },
    ],
  },
  {
    id: 'vet_three_percent', icon: '\u{1F4C8}', weight: 2,
    title: 'TRE PROCENT AV BNP TILL FORSKNING',
    text: 'Forskningsrådet föreslår att landet ska satsa tre procent av BNP på forskning, som de mest innovativa länderna i världen. Både staten och företagen skulle behöva nästan fördubbla sina satsningar.',
    when: (c) => (c.ind.rnd ?? 0) < 1.5 && (c.ind.gdppc ?? 0) > 15000 && c.st.research < 20,
    choices: [
      { text: 'ANTA MÅLET FULLT UT', cost: { money: 1600 }, perm: { research: 12, gdp: 3 }, temp: { income: -5 }, tip: 'Ambitiöst. Revisorerna kommer att följa varje krona.' },
      { text: 'SKATTEAVDRAG FÖR FÖRETAGENS FORSKNING', cost: { pp: 15 }, perm: { research: 6 }, temp: { income: -4 }, tip: 'Företagen döper om sina marknadsavdelningar till forskning.' },
      { text: 'HALVA VÄGEN RÄCKER', cost: { money: 600 }, perm: { research: 5 }, tip: 'Ett mål som ingen kommer ihåg om fem år.' },
      { text: 'AVSLÅ - VI HAR ANDRA BEHOV', perm: { research: -2 }, temp: { qol: 2 }, tip: 'Vägarna lagas. Laboratorierna får vänta.' },
    ],
  },
  {
    id: 'vet_grants_politics', icon: '\u{1F4DC}', weight: 2,
    title: 'IDEOLOGIN STYR FORSKNINGSANSLAGEN',
    text: 'Forskningsrådet har fått nya ledamöter från partiet, och anslagen går nu till projekt som bekräftar den officiella linjen. Flera framstående forskare har redan avgått i protest.',
    when: (c) => c.st.ideopower > 20 && c.st.freedom < 0,
    choices: [
      { text: 'ÅTERSTÄLL FORSKNINGSRÅDETS OBEROENDE', cost: { pp: 20 }, perm: { research: 5, freedom: 3 }, temp: { ideopower: -5 }, tip: 'Forskarna jublar. Partiet för protokoll.' },
      { text: 'LÅT IDEOLOGIN GÅ FÖRST', perm: { ideopower: 6, research: -6 }, tip: 'Resultaten blir alltid de rätta. Det är det som är problemet.' },
      { text: 'KRÄV LOJALITETSEDER AV ALLA PROFESSORER', cost: { pp: 10 }, perm: { statepower: 5 }, mod: 'brain_drain', tip: 'De som skriver under stannar. De bästa gör det inte.' },
    ],
  },

  // ================= UNIVERSITET & HÖGSKOLOR =================
  {
    id: 'vet_university_ranking', icon: '\u{1F393}', weight: 2,
    title: 'INGET UNIVERSITET BLAND DE 500 BÄSTA',
    text: 'Den årliga världsrankningen av universitet är publicerad, och för första gången finns inget av landets lärosäten med på listan. Tidningarna kallar det en nationell förnedring.',
    when: (c) => (c.ind.tertiary ?? 0) > 35 && c.st.research < 0 && (c.ind.gdppc ?? 0) > 5000,
    choices: [
      { text: 'SLÅ IHOP UNIVERSITETEN TILL ETT ELITLÄROSÄTE', cost: { money: 800, pp: 15 }, perm: { research: 7 }, temp: { unrest: 4 }, tip: 'Ett universitet i världsklass och nio orter utan högskola.' },
      { text: 'REKRYTERA PROFESSORER FRÅN UTLANDET', cost: { money: 600 }, perm: { research: 5, immigration: 2 }, tip: 'Föreläsningarna blir på engelska. Studenterna klagar på engelska.' },
      { text: 'RANKNINGARNA MÄTER FEL SAKER', perm: { research: -1 }, temp: { approval: -2 }, tip: 'Det kan vara sant. Det låter ändå som en ursäkt.' },
    ],
  },
  {
    id: 'vet_free_tuition', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'STUDENTERNA KRÄVER AVGIFTSFRI HÖGSKOLA',
    text: 'Tiotusentals studenter marscherar mot parlamentet. De har lånat till sina utbildningar och kommer att betala av lånen tills de fyller femtio. Nu vill de att staten tar notan.',
    when: (c) => (c.ind.tertiary ?? 0) > 15 && (c.ind.tertiary ?? 0) < 65 && c.st.unrest > 10 && (c.ind.youthunemp ?? 0) > 10,
    choices: [
      { text: 'GÖR HÖGSKOLAN AVGIFTSFRI', cost: { money: 1300 }, perm: { hdi: 5, research: 4 }, temp: { approval: 6, unrest: -6 }, tip: 'Utbildning för alla. Notan för skattebetalarna.' },
      { text: 'SKRIV AV EN DEL AV STUDIELÅNEN', cost: { money: 600 }, temp: { approval: 5, unrest: -4 }, tip: 'De som redan betalat av känner sig lurade.' },
      { text: 'STATLIGA STIPENDIER TILL DE BÄSTA', cost: { money: 350 }, perm: { research: 3 }, temp: { unrest: 2 }, tip: 'Meritokrati för de få. Ilska för de många.' },
      { text: 'NEJ - DEN SOM STUDERAR TJÄNAR PÅ DET', temp: { unrest: 6, approval: -4 }, tip: 'Ekonomiskt korrekt. Politiskt farligt.' },
    ],
  },
  {
    id: 'vet_graduates_jobless', icon: '\u{1F4BC}', weight: 2,
    title: 'EXAMEN MEN INGET JOBB',
    text: 'Var fjärde nyexaminerad akademiker går arbetslös ett år efter examen. Statsvetare kör taxi och biologer står i kassan, medan industrin skriker efter tekniker och svetsare.',
    when: (c) => (c.ind.tertiary ?? 0) > 45 && (c.ind.youthunemp ?? 0) > 18,
    choices: [
      { text: 'FLYTTA PLATSER TILL YRKESUTBILDNINGAR', cost: { pp: 15 }, perm: { factory: 5, research: -2 }, temp: { unrest: 3 }, tip: 'Universiteten protesterar. Svetsarna får jobb dagen efter examen.' },
      { text: 'STATLIGA TRAINEEPLATSER FÖR UNGA AKADEMIKER', cost: { money: 800 }, perm: { statepower: 2 }, temp: { unrest: -6, approval: 4 }, tip: 'Staten anställer folk den inte riktigt behöver.' },
      { text: 'LÅT DEM SÖKA LYCKAN UTOMLANDS', temp: { unrest: -4 }, mod: 'brain_drain', tip: 'Arbetslösheten sjunker. Det gör även landets kompetens.' },
    ],
  },

  // ================= SKOLAN & LÄSKUNNIGHETEN =================
  {
    id: 'vet_literacy_campaign', icon: '\u{1F4D6}', weight: 2,
    title: 'HALVA BYARNA KAN INTE LÄSA',
    text: 'En ny folkräkning visar att stora delar av landsbygden fortfarande inte kan läsa eller skriva. Utan läskunnighet fungerar varken skolor, vårdupplysning eller val.',
    when: (c) => (c.ind.literacy ?? 100) < 80,
    choices: [
      { text: 'LÄSKAMPANJ MED STUDENTER SOM LÄRARE', cost: { money: 700, man: 5 }, perm: { hdi: 6, research: 2 }, temp: { approval: 4 }, tip: 'Varje student får en by. Om ett år kan byarna läsa protokollen.' },
      { text: 'SKOLRADIO I VARJE BY', cost: { money: 300 }, perm: { hdi: 3 }, tip: 'Billigt. Fungerar där det finns batterier.' },
      { text: 'BÖRJA MED STÄDERNA', perm: { hdi: 2 }, temp: { unrest: 3 }, tip: 'Landsbygden får vänta. Den är van.' },
    ],
  },
  {
    id: 'vet_teacher_shortage', icon: '\u{1F3EB}', weight: 2,
    title: 'VARANNAN LÄRARE SAKNAR UTBILDNING',
    text: 'Skolinspektionen rapporterar att hälften av lärarna saknar lärarexamen. Lönerna är låga, klasserna stora och de bästa lärarna byter yrke efter några år.',
    when: (c) => (c.ind.edux ?? 5) < 4 && c.st.hdi < 0,
    choices: [
      { text: 'HÖJ LÄRARLÖNERNA KRAFTIGT', cost: { money: 900 }, perm: { hdi: 5, qol: 1 }, tip: 'Yrket blir attraktivt igen. Om fem år märks det i klassrummen.' },
      { text: 'SNABBUTBILDNING FÖR OBEHÖRIGA LÄRARE', cost: { money: 300 }, perm: { hdi: 2 }, tip: 'Sommarkurs i pedagogik. Bättre än inget.' },
      { text: 'REKRYTERA LÄRARE FRÅN UTLANDET', cost: { money: 400, pp: 10 }, perm: { hdi: 3, immigration: 2 }, temp: { integration: -2 }, tip: 'Duktiga lärare som eleverna inte alltid förstår.' },
      { text: 'STÖRRE KLASSER, FÄRRE LÄRARE', res: { money: 300 }, perm: { hdi: -3 }, tip: 'Fyrtio elever per klass. Läraren lär sig deras namn i maj.' },
    ],
  },
  {
    id: 'vet_phones_in_school', icon: '\u{1F4F1}', weight: 2,
    title: 'MOBILFÖRBUD I SKOLAN?',
    text: 'Lärarna vittnar om elever som inte kan koncentrera sig och som filmar varandra på rasterna. Ett förslag om att samla in alla telefoner när skoldagen börjar delar landet.',
    when: (c) => (c.ind.mobile ?? 0) > 115 && c.st.qol > 0 && c.st.freedom > -30,
    choices: [
      { text: 'FÖRBJUD MOBILER UNDER HELA SKOLDAGEN', cost: { pp: 10 }, perm: { hdi: 2 }, temp: { freedom: -2 }, tip: 'Rasterna blir högljudda igen. Lärarna kallar det framsteg.' },
      { text: 'TVÄRTOM - EN SURFPLATTA TILL VARJE ELEV', cost: { money: 500 }, perm: { research: 3, hdi: -1 }, tip: 'Digitala läromedel. Analoga koncentrationsproblem.' },
      { text: 'LÅT VARJE SKOLA BESTÄMMA SJÄLV', perm: { hdi: 1 }, temp: { approval: -1 }, tip: 'Hälften förbjuder, hälften inte. Alla klagar.' },
    ],
  },
  {
    id: 'vet_pisa_shock', icon: '\u{1F4C9}', weight: 2,
    title: 'PISA-CHOCKEN',
    text: 'Den internationella kunskapsmätningen visar att landets femtonåringar har rasat i matematik och läsförståelse. Vi ligger nu under nästan alla grannländer.',
    when: (c) => (c.ind.schoolyears ?? 0) > 9 && c.st.hdi < 0 && c.st.research < 10,
    choices: [
      { text: 'MER MATTE OCH LÄSNING, FÄRRE PROJEKT', cost: { pp: 10 }, perm: { hdi: 3 }, temp: { approval: -1 }, tip: 'Tillbaka till grunderna. Rektorerna suckar.' },
      { text: 'INFÖR STRÄNG DISCIPLIN OCH NATIONELLA PROV', cost: { pp: 20 }, law: ['education', 'strict'], perm: { hdi: 3, freedom: -2 }, tip: 'Ordning i klassrummet. Lite mindre lust att lära.' },
      { text: 'MER PENGAR TILL SKOLAN', cost: { money: 800 }, perm: { hdi: 4 }, tip: 'Pengar löser inte allt. Men det löser en del.' },
      { text: 'TESTET MÄTER FEL SAKER', perm: { hdi: -2 }, temp: { approval: 2 }, tip: 'Bekvämt att tro. Nästa mätning kommer om tre år.' },
    ],
  },
  {
    id: 'vet_girls_schooling', icon: '\u{1F467}', weight: 2,
    title: 'FLICKORNA SLUTAR SKOLAN FÖR TIDIGT',
    text: 'I stora delar av landet tas flickor ur skolan när de fyller tolv, för att hjälpa till hemma. FN:s organ erbjuder stöd om landet förbinder sig att ändra på det.',
    when: (c) => (c.is('equality', 'traditional', 'restricted') || (c.ind.gii ?? 0) > 0.45) && (c.ind.literacy ?? 100) < 85,
    choices: [
      { text: 'SKOLPLIKT FÖR ALLA BARN TILL SEXTON ÅR', cost: { pp: 20 }, perm: { hdi: 6, gdp: 2 }, temp: { unrest: 5 }, tip: 'Byäldste protesterar. Om tjugo år har landet dubbelt så många läkare.' },
      { text: 'BETALA FAMILJERNA OM FLICKORNA GÅR KVAR', cost: { money: 500 }, perm: { hdi: 4 }, rel: 5, tip: 'Ett litet bidrag i månaden. Det fungerar förvånansvärt bra.' },
      { text: 'RESPEKTERA FAMILJERNAS VAL', perm: { hdi: -2, ideopower: 2 }, rel: -4, tip: 'Traditionen består. Halva begåvningen i landet förblir outnyttjad.' },
    ],
  },

  // ================= KUNSKAPSFLYKT & GYLLENE GENERATIONER =================
  {
    id: 'vet_brain_drain', icon: '\u{1F6EB}', weight: 2,
    title: 'LÄKARNA OCH INGENJÖRERNA FLYTTAR',
    text: 'Varje vecka lämnar hundratals utbildade unga landet för bättre löner utomlands. Sjukhusen saknar läkare vars utbildning staten själv har bekostat.',
    when: (c) => (c.ind.gdppc ?? 0) < 15000 && (c.ind.tertiary ?? 0) > 20 && c.st.qol < 0 && !c.mod('brain_drain'),
    choices: [
      { text: 'HÖJ LÖNERNA FÖR AKADEMIKER I STATEN', cost: { money: 900 }, perm: { research: 3, qol: 2 }, temp: { unrest: 2 }, tip: 'Sjuksköterskorna undrar varför inte de.' },
      { text: 'KRÄV FEM ÅRS TJÄNST HEMMA EFTER EXAMEN', cost: { pp: 20 }, perm: { research: 2, freedom: -4 }, temp: { unrest: 4 }, tip: 'De stannar. De söker visum dagen efter det femte året.' },
      { text: 'LÅT DEM GÅ - DE SKICKAR HEM PENGAR', res: { money: 400 }, mod: 'brain_drain', tip: 'Familjerna får pengar. Landet förlorar sina bästa.' },
    ],
  },
  {
    id: 'vet_diaspora_return', icon: '\u{1F3E0}', weight: 2,
    title: 'FORSKARNA I UTLANDET VILL KOMMA HEM',
    text: 'En grupp framgångsrika forskare som utvandrade för tjugo år sedan säger att de kan tänka sig att flytta hem, med familjer och laboratorier. De vill ha garantier.',
    when: (c) => c.mod('brain_drain') || ((c.ind.netmig ?? 0) < -15000 && c.st.research > 15),
    choices: [
      { text: 'ÅTERVÄNDARPROGRAM MED LABB OCH LÖN', cost: { money: 900 }, perm: { research: 6 }, unmod: 'brain_drain', tip: 'De kommer hem. De kommer att klaga på byråkratin.' },
      { text: 'SKATTEFRIHET I FEM ÅR', cost: { pp: 15 }, perm: { research: 4, income: -2 }, unmod: 'brain_drain', tip: 'Grannarna som aldrig flyttade betalar full skatt.' },
      { text: 'VI HAR KLARAT OSS UTAN DEM', perm: { research: -2 }, temp: { approval: 2 }, tip: 'Stolt. Och lite dumt.' },
    ],
  },
  {
    id: 'vet_golden_generation', icon: '\u{1F31F}', weight: 1,
    title: 'GULD I MATEMATIKOLYMPIADEN',
    text: 'Landets lag har tagit fyra guldmedaljer i den internationella matematikolympiaden, fler än något annat land. Lärarna talar om den bästa årskull de någonsin sett.',
    when: (c) => (c.ind.literacy ?? 0) > 95 && c.res('education') >= 4 && c.st.hdi > 0 && !c.mod('golden_generation'),
    choices: [
      { text: 'ELITPROGRAM FÖR HELA ÅRSKULLEN', cost: { money: 700, rp: 30 }, mod: 'golden_generation', tip: 'De bästa får de bästa lärarna. Resten får läsa om det.' },
      { text: 'STIPENDIER TILL VÄRLDENS BÄSTA UNIVERSITET', cost: { money: 400 }, perm: { research: 4 }, rel: 3, tip: 'De studerar utomlands. Förhoppningsvis kommer de tillbaka.' },
      { text: 'FIRA DEM MED EN MOTTAGNING', temp: { approval: 3, ideopower: 2 }, tip: 'Tårta och fotografering. Sedan tillbaka till vanliga lektioner.' },
    ],
  },
  {
    id: 'vet_scientists_flock', icon: '\u{1F52D}', weight: 1,
    title: 'VÄRLDENS FORSKARE VILL HIT',
    text: 'Landets laboratorier har blivit så framgångsrika att forskare från hela världen söker tjänster här. Migrationsverket hinner inte behandla alla ansökningar.',
    when: (c) => c.st.research > 35 && c.res('education') >= 4 && !c.mod('scientific_superpower'),
    choices: [
      { text: 'SNABBSPÅR FÖR FORSKARVISUM', cost: { money: 700, pp: 20 }, perm: { immigration: 3 }, mod: 'scientific_superpower', tip: 'På fem år blir landet världens laboratorium.' },
      { text: 'TIDSBEGRÄNSADE KONTRAKT', cost: { money: 300 }, perm: { research: 4 }, tip: 'De kommer, forskar och åker hem med patenten.' },
      { text: 'VÅRA EGNA FORSKARE FÖRST', perm: { research: 2 }, temp: { ideopower: 3 }, rel: -3, tip: 'Tryggt. Lite provinsiellt.' },
    ],
  },
  {
    id: 'vet_breakthrough_industry', icon: '\u{1F3ED}', weight: 2,
    title: 'GENOMBROTTET SKA BLI EN INDUSTRI',
    text: 'Forskarnas nya upptäckt kan bli grunden för en helt ny exportindustri. Riskkapitalet tvekar, och utländska bolag står redan i kö för att köpa licenser.',
    when: (c) => c.mod('tech_breakthrough') || ((c.ind.patents ?? 0) > 1800 && c.st.research > 15),
    choices: [
      { text: 'STATLIG RISKKAPITALFOND', cost: { money: 1100 }, perm: { factory: 6, gdp: 3 }, mod: 'industrial_boom', tip: 'Staten tar risken. Staten tar också äran om det går vägen.' },
      { text: 'LÅT FORSKARNA FORTSÄTTA I LUGN OCH RO', cost: { rp: 30 }, perm: { research: 6 }, tip: 'Grundforskning är aldrig bortkastad. Bara långsam.' },
      { text: 'SÄLJ LICENSER TILL UTLANDET', res: { money: 900 }, perm: { research: -2 }, rel: 4, tip: 'Snabba pengar. Fabrikerna byggs någon annanstans.' },
    ],
  },

  // ================= INTERNET, SOCIALA MEDIER & DESINFORMATION =================
  {
    id: 'vet_social_media_kids', icon: '\u{1F634}', weight: 2,
    title: 'BARNEN HAR SLUTAT SOVA',
    text: 'Barnläkarna larmar om tonåringar som scrollar sociala medier halva nätterna. Ångest och sömnbrist har fördubblats på tio år, och plattformarna vägrar ändra sina algoritmer.',
    when: (c) => (c.ind.internet ?? 0) > 80 && (c.ind.mobile ?? 0) > 120 && c.st.freedom > -10,
    choices: [
      { text: 'ÅLDERSGRÄNS FEMTON ÅR MED ID-KONTROLL', cost: { pp: 20 }, perm: { qol: 3, freedom: -3 }, tip: 'Femtonåringarna lär sig låna sina föräldrars legitimation.' },
      { text: 'TVINGA PLATTFORMARNA ATT STÄNGA FLÖDET NATTETID', cost: { pp: 15 }, perm: { qol: 2 }, rel: -4, tip: 'Teknikjättarna hotar att lämna landet. De gör det inte.' },
      { text: 'DET ÄR FÖRÄLDRARNAS ANSVAR', perm: { qol: -2 }, temp: { approval: -2 }, tip: 'Föräldrarna scrollar också.' },
    ],
  },
  {
    id: 'vet_troll_factory', icon: '\u{1F4AC}', weight: 2,
    title: 'EN FLOD AV FALSKA KONTON',
    text: 'Forskare har kartlagt ett nätverk av tiotusentals falska konton som sprider lögner om vaccin, val och invandring. Spåren leder till en främmande makt.',
    when: (c) => (c.ind.internet ?? 0) > 60 && c.is('internet', 'free', 'open', 'filtered') && c.st.stability < -5,
    choices: [
      { text: 'INRÄTTA EN MYNDIGHET MOT DESINFORMATION', cost: { money: 500 }, perm: { safety: 2 }, temp: { stability: 4 }, tip: 'Bra idé, tills nästa regering bestämmer vad som är sant.' },
      { text: 'TVINGA PLATTFORMARNA ATT RADERA KONTONA', cost: { pp: 20 }, temp: { stability: 6, freedom: -3 }, tip: 'De raderas. Nya skapas samma kväll.' },
      { text: 'PEKA UT LANDET BAKOM KAMPANJEN', cost: { pp: 10 }, temp: { stability: 3, ideopower: 3 }, rel: -8, tip: 'Det känns bra. Det ändrar ingenting.' },
      { text: 'LITA PÅ ATT FOLK GENOMSKÅDAR DET', temp: { stability: -5, approval: -2 }, tip: 'Optimistiskt.' },
    ],
  },
  {
    id: 'vet_rural_broadband', icon: '\u{1F310}', weight: 2,
    title: 'LANDSBYGDEN ÄR UTAN NÄT',
    text: 'I städerna har nästan alla snabbt internet, men på landsbygden saknar hälften uppkoppling. Bönder, småföretag och skolelever halkar efter för varje år.',
    when: (c) => (c.ind.internet ?? 100) < 75 && (c.ind.internet ?? 100) > 30 && (c.ind.urban ?? 100) < 70,
    choices: [
      { text: 'STATLIGT FIBERNÄT TILL VARJE BY', cost: { money: 1200 }, perm: { gdp: 3, hdi: 3, qol: 2 }, tip: 'Sista byn kopplas in om fyra år. Om den inte har flyttat.' },
      { text: 'KÖP SATELLITUPPKOPPLING AV ETT UTLÄNDSKT BOLAG', cost: { money: 400 }, perm: { hdi: 2, statepower: -2 }, tip: 'Snabbt och billigt. Någon annan äger kranen.' },
      { text: 'MARKNADEN FÅR BYGGA DÄR DET LÖNAR SIG', perm: { gdp: 1 }, temp: { unrest: 3 }, tip: 'Det lönar sig i städerna.' },
    ],
  },

  // ================= MOBILNÄT & 5G =================
  {
    id: 'vet_5g_supplier', icon: '\u{1F4F6}', weight: 2,
    title: 'VEM SKA BYGGA 5G-NÄTET?',
    text: 'Det billigaste anbudet för landets nya 5G-nät kommer från ett utländskt bolag med nära band till en främmande regering. Säkerhetstjänsten avråder bestämt.',
    when: (c) => (c.ind.mobile ?? 0) > 100 && c.st.factory > 0 && c.res('espionage') <= 4,
    choices: [
      { text: 'TA DET BILLIGASTE ANBUDET', res: { money: 400 }, perm: { factory: 3 }, temp: { safety: -6 }, tip: 'Nätet blir snabbt. Frågan är vem som lyssnar.' },
      { text: 'VÄLJ EN LEVERANTÖR FRÅN EN ALLIERAD', cost: { money: 900 }, perm: { safety: 4, factory: 2 }, rel: 3, tip: 'Dyrare. Du vet åtminstone vem som lyssnar.' },
      { text: 'DELA UPP NÄTET MELLAN FLERA LEVERANTÖRER', cost: { money: 500, pp: 10 }, perm: { safety: 2, factory: 1 }, tip: 'Ingen får hela nätet. Alla får lite.' },
    ],
  },
  {
    id: 'vet_mobile_money', icon: '\u{1F4F2}', weight: 2,
    title: 'MOBILEN HAR BLIVIT PLÅNBOKEN',
    text: 'Miljontals människor som aldrig haft ett bankkonto betalar nu allt med mobilen. Telekombolaget som äger tjänsten hanterar mer pengar än landets största bank.',
    when: (c) => (c.ind.mobile ?? 0) > 90 && (c.ind.gdppc ?? 0) < 5000,
    choices: [
      { text: 'REGLERA DET SOM EN BANK', cost: { pp: 15 }, perm: { corruption: -3, gdp: 2 }, tip: 'Tryggare pengar. Telekombolaget tycker att det är krångligt.' },
      { text: 'STATENS EGEN DIGITALA VALUTA', cost: { money: 600, rp: 30 }, perm: { statepower: 4, corruption: -2 }, temp: { freedom: -2 }, tip: 'Varje köp syns i statens register. Det är både poängen och problemet.' },
      { text: 'BESKATTA VARJE ÖVERFÖRING', res: { money: 500 }, perm: { gdp: -1 }, temp: { approval: -4 }, tip: 'De fattigaste betalar mest. Statskassan märker det direkt.' },
    ],
  },

  // ================= CYBERHOT =================
  {
    id: 'vet_hospital_ransomware', icon: '\u{1F3E5}', weight: 2,
    title: 'HACKARE HAR TAGIT SJUKHUSEN SOM GISSLAN',
    text: 'Utpressare har krypterat journalsystemen på landets största sjukhus. Operationer ställs in och ambulanser leds om. De kräver betalning i kryptovaluta.',
    when: (c) => (c.ind.internet ?? 0) > 70 && c.res('espionage') <= 3 && c.st.safety < 10,
    choices: [
      { text: 'BETALA LÖSENSUMMAN', cost: { money: 500 }, perm: { safety: -3 }, temp: { qol: -2 }, tip: 'Systemen är igång i morgon. Utpressarna har fått ett nytt favoritland.' },
      { text: 'INRÄTTA ETT NATIONELLT CYBERFÖRSVAR', cost: { money: 900, rp: 40 }, perm: { safety: 6 }, temp: { qol: -3 }, tip: 'För sent för det här sjukhuset. I tid för nästa.' },
      { text: 'VÄGRA OCH BYGG UPP SYSTEMEN FRÅN NOLL', temp: { qol: -6, hdi: -3, approval: -3 }, tip: 'Tre veckor med papper och penna. Ingen betalade någon.' },
    ],
  },
  {
    id: 'vet_grid_hack', icon: '\u{26A1}', weight: 2,
    title: 'HACKARE SLÄCKTE ELNÄTET',
    text: 'Mitt i natten slocknade strömmen i tre regioner. Elbolagets styrsystem hade tagits över utifrån, och angriparna lämnade ett meddelande på skärmarna i kontrollrummet.',
    when: (c) => c.atWar && (c.ind.elec ?? 0) > 85,
    choices: [
      { text: 'SLÅ TILLBAKA MOT DERAS NÄT', cost: { rp: 40, pp: 15 }, temp: { readiness: 5, approval: 4 }, rel: -6, tip: 'Nu är det mörkt i två länder.' },
      { text: 'KOPPLA BORT STYRSYSTEMEN FRÅN INTERNET', cost: { money: 700 }, perm: { safety: 5 }, temp: { factory: -3 }, tip: 'Som på åttiotalet. Med vakter vid varje ställverk.' },
      { text: 'BE DE ALLIERADE OM HJÄLP', cost: { pp: 10 }, perm: { safety: 3, statepower: -2 }, rel: 4, tip: 'Deras experter hjälper gärna. De tittar sig också omkring.' },
      { text: 'REPARERA OCH HOPPAS', temp: { factory: -8, qol: -5 }, tip: 'De kommer tillbaka. Det stod på skärmen.' },
    ],
  },
  {
    id: 'vet_teen_hacker', icon: '\u{1F9D1}\u{200D}\u{1F4BB}', weight: 2,
    title: 'SJUTTONÅRING HACKADE FÖRSVARET',
    text: 'En sjuttonåring har tagit sig in i försvarsdepartementets e-post och lagt ut skärmdumpar på nätet. Han säger att han bara ville visa hur dåligt skyddet var.',
    when: (c) => (c.ind.internet ?? 0) > 75 && c.res('espionage') <= 3 && c.st.milpower > 0,
    choices: [
      { text: 'ANSTÄLL HONOM', cost: { pp: 10 }, perm: { safety: 3, milpower: 2 }, temp: { approval: -2 }, tip: 'Han får en tjänstebil innan han har körkort.' },
      { text: 'BELÖNING TILL ALLA SOM HITTAR SÄKERHETSHÅL', cost: { money: 300 }, perm: { safety: 4, research: 1 }, tip: 'Hackarna jobbar för dig i stället. För småpengar.' },
      { text: 'ÅTALA HONOM MED FULL KRAFT', perm: { research: -1 }, temp: { safety: 2, freedom: -2 }, tip: 'Ett avskräckande exempel. Hans kompisar blir bara försiktigare.' },
    ],
  },

  // ================= LABORATORIER & FORSKNINGENS GRÄNSER =================
  {
    id: 'vet_lab_leak', icon: '\u{2623}\u{FE0F}', weight: 2,
    title: 'OLYCKA I SMITTSKYDDSLABBET',
    text: 'En laboratorietekniker vid landets högsäkerhetslabb har smittats av ett virus som forskarna studerade. Ingen annan verkar ha smittats - än så länge.',
    when: (c) => c.res('healthcare') >= 4 && c.st.safety < 0,
    choices: [
      { text: 'FULL ÖPPENHET OCH KARANTÄN', cost: { pp: 15 }, perm: { safety: 3 }, temp: { approval: -3 }, rel: 4, tip: 'Världen litar på dig. Inrikespressen ägnar en vecka åt saken.' },
      { text: 'HANTERA DET I TYSTHET', temp: { safety: -3 }, mod: 'cover_up', tip: 'Om det sprids blir det den största skandalen i landets historia.' },
      { text: 'STÄNG ALLA SÅDANA LABB', perm: { research: -5, safety: 4 }, temp: { approval: 3 }, tip: 'Inga farliga labb, inga olyckor. Och inga nya vacciner heller.' },
    ],
  },
  {
    id: 'vet_animal_testing', icon: '\u{1F401}', weight: 2,
    title: 'DJURFÖRSÖKEN SKA BORT',
    text: 'Ett medborgarförslag med en miljon underskrifter kräver förbud mot alla djurförsök. Forskarna säger att halva läkemedelsforskningen då måste flytta utomlands.',
    when: (c) => c.res('healthcare') >= 3 && c.st.freedom > 10,
    choices: [
      { text: 'FÖRBJUD ALLA DJURFÖRSÖK', cost: { pp: 15 }, perm: { research: -6 }, temp: { approval: 5 }, tip: 'Mössen jublar tyst. Läkemedelsbolagen packar.' },
      { text: 'SATSA PÅ ALTERNATIVA METODER', cost: { money: 500, rp: 20 }, perm: { research: 2 }, temp: { approval: 3 }, tip: 'Celler i provrör i stället för möss. Långsamt men på väg.' },
      { text: 'BEHÅLL REGLERNA SOM DE ÄR', temp: { approval: -3, unrest: 2 }, tip: 'Forskningen fortsätter. Debatten också.' },
    ],
  },
  {
    id: 'vet_scientists_refuse', icon: '\u{270B}', weight: 2,
    title: 'FORSKARNA VÄGRAR BYGGA VAPEN',
    text: 'Flera universitet har beslutat att inte ta emot uppdrag från försvaret. Tusentals forskare har skrivit på ett upprop och vägrar arbeta med vapenteknik.',
    when: (c) => (c.atWar || c.st.milpower > 25) && c.st.freedom > 0,
    choices: [
      { text: 'BYGG ETT EGET FÖRSVARSINSTITUT', cost: { money: 1000 }, perm: { milpower: 6, research: 2 }, tip: 'Egna forskare, egna laboratorier, egna hemligheter.' },
      { text: 'KNYT ANSLAGEN TILL SAMARBETE MED FÖRSVARET', cost: { pp: 20 }, perm: { milpower: 5, research: -3, freedom: -3 }, tip: 'De som behöver pengarna samarbetar. De bästa slutar.' },
      { text: 'RESPEKTERA DERAS SAMVETE', perm: { milpower: -3, freedom: 2 }, temp: { approval: 2 }, tip: 'Försvaret får köpa tekniken utomlands. Dyrt.' },
    ],
  },

  // ================= HÖGTEKNOLOGISK INDUSTRI =================
  {
    id: 'vet_chip_export_record', icon: '\u{1F6A2}', weight: 2,
    title: 'CHIPSEXPORTEN SLÅR REKORD',
    text: 'Landets halvledarfabriker säljer mer än någonsin, och högteknologi står nu för en stor del av exporten. Andra länder har börjat se oss som en strategisk leverantör.',
    when: (c) => (c.ind.hitech ?? 0) > 20 && (c.ind.exports ?? 0) > 30,
    choices: [
      { text: 'BYGG EN NY FABRIK MED STATLIGT STÖD', cost: { money: 1500 }, perm: { factory: 6, research: 3 }, mod: 'industrial_boom', tip: 'Den största investeringen i landets historia. Den drar mycket vatten.' },
      { text: 'EXPORTKONTROLL MOT RIVALERNA', cost: { pp: 15 }, perm: { milpower: 3, statepower: 2 }, rel: -5, tip: 'Viktiga för våra vänner, besvärliga för alla andra.' },
      { text: 'TA UT EN EXTRASKATT PÅ VINSTERNA', res: { money: 900 }, temp: { factory: -4 }, tip: 'Bolagen hotar att flytta. De har redan tittat på tomter.' },
    ],
  },
  {
    id: 'vet_chip_shortage', icon: '\u{23F3}', weight: 2,
    title: 'CHIPSBRISTEN STOPPAR FABRIKERNA',
    text: 'Bilfabrikerna står still i väntan på mikrochips som tillverkas på andra sidan jorden. Tusentals arbetare har permitterats och leveranstiderna räknas i år.',
    when: (c) => (c.ind.manuf ?? 0) > 13 && (c.ind.hitech ?? 0) < 10,
    choices: [
      { text: 'SUBVENTIONERA EN EGEN CHIPSFABRIK', cost: { money: 1800 }, perm: { factory: 6, research: 3 }, tip: 'Klar om fem år. Bristen tar slut om två.' },
      { text: 'FÖRHANDLA FRAM ETT AVTAL MED EN ALLIERAD', cost: { pp: 15 }, temp: { factory: 4 }, rel: 5, tip: 'Vi får förtur. De får något tillbaka. Vad framgår senare.' },
      { text: 'VÄNTA UT KRISEN', temp: { factory: -8, gdp: -4, unrest: 3 }, tip: 'Arbetarna väntar också. Hemma.' },
    ],
  },
];
