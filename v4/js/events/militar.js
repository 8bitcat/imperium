// IMPERIUM V5.6 — HÄNDELSER: FÖRSVAR & KRIG.
// Värnplikt, generaler och juntor, krigsindustri, försvarsbudget, veteraner, livet under krig, spionage, kärnvapen, cyberkrig, baser, allianser och beredskap.
export const EVENTS = [

  // ================= VÄRNPLIKTEN =================
  {
    id: 'for_conscientious_objector', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'SAMVETSVÄGRARE INFÖR RÄTTA',
    text: 'En ung pacifist vägrar ta på sig uniformen och riskerar fängelse. Rättegången direktsänds, och hundratals unga har skrivit under ett upprop om att de tänker göra likadant.',
    when: (c) => c.is('military_service', 'high', 'mandatory') && c.st.freedom > 0,
    choices: [
      { text: 'INFÖR VAPENFRI TJÄNST SOM ALTERNATIV', cost: { pp: 20 }, temp: { manpower: -5, approval: 6 }, perm: { freedom: 3 }, tip: 'Han får bära sandsäckar i stället. Nästan alla är nöjda.' },
      { text: 'LAGEN ÄR LAGEN — FÄNGELSE', temp: { manpower: 4, freedom: -6, unrest: 6, approval: -4 }, tip: 'Ett straff, och plötsligt en hel rörelse.' },
      { text: 'BEVILJA TYST UNDANTAG FÖR ALLA SOM SÖKER', temp: { manpower: -10, approval: 4, readiness: -4 }, tip: 'Förvånansvärt många upptäcker att de har ett samvete.' },
    ],
  },
  {
    id: 'for_unfit_conscripts', icon: '\u{1FA7A}', weight: 2,
    title: 'VAR TREDJE MÖNSTRANDE UNDERKÄNNS',
    text: 'Mönstringskontoret slår larm: en tredjedel av årets artonåringar klarar inte de fysiska proven. Övervikt, dålig kondition och för lite sömn toppar listan.',
    when: (c) => c.is('military_service', 'mixed', 'high', 'mandatory') && (c.ind.gdppc ?? 9600) > 25000 && c.st.welfare < 20,
    choices: [
      { text: 'IDROTT VARJE DAG I ALLA SKOLOR', cost: { money: 600 }, perm: { qol: 4, manpower: 4, hdi: 2 }, tip: 'Om tio år har du en vältränad armé. Och gnälliga föräldrar.' },
      { text: 'SÄNK KRAVEN VID MÖNSTRINGEN', temp: { manpower: 6, readiness: -6 }, tip: 'Siffrorna ser bättre ut. Marschen blir längre.' },
      { text: 'TRÄNINGSLÄGER FÖR DE UNDERKÄNDA', cost: { money: 400 }, temp: { manpower: 4, readiness: 3, approval: -3 }, tip: 'Tre månaders uppladdning innan den riktiga tjänstgöringen.' },
    ],
  },
  {
    id: 'for_equal_conscription', icon: '\u{1F469}', weight: 2,
    title: 'SKA KVINNORNA OCKSÅ MÖNSTRA?',
    text: 'Jämställdhetsombudsmannen påpekar att värnplikten i praktiken bara gäller män, trots att lagen säger att könen ska behandlas lika. Försvaret tar gärna emot fler, men utbildningsplatserna räcker inte.',
    when: (c) => c.is('military_service', 'mixed', 'high', 'mandatory') && c.is('equality', 'full', 'strong'),
    choices: [
      { text: 'KÖNSNEUTRAL VÄRNPLIKT FRÅN NÄSTA ÅR', cost: { money: 500 }, perm: { manpower: 8, freedom: 2 }, temp: { approval: -3 }, tip: 'Dubbelt så många att välja bland. Dubbelt så många logement att bygga.' },
      { text: 'FRIVILLIG MÖNSTRING FÖR KVINNOR', cost: { pp: 10 }, temp: { manpower: 4, approval: 3 }, tip: 'De som kommer vill verkligen vara där.' },
      { text: 'BEHÅLL DAGENS ORDNING', temp: { approval: -4, ideopower: -3 }, tip: 'Lagen säger en sak, kasernen en annan.' },
    ],
  },
  {
    id: 'for_recruitment_crisis', icon: '\u{1F4CB}', weight: 2,
    title: 'FÖRSVARET FÅR INTE TAG I FOLK',
    text: 'Med låg arbetslöshet väljer de unga hellre bättre betalda jobb än yrkesarmén. Var femte tjänst på regementena står tom, och reklamkampanjerna har inte hjälpt.',
    when: (c) => c.is('military_service', 'none', 'small') && (c.ind.unemp ?? 5.3) < 6,
    choices: [
      { text: 'HÖJ SOLDATLÖNERNA KRAFTIGT', cost: { money: 900 }, perm: { manpower: 6, readiness: 4 }, tip: 'Lojaliteten har ett pris, och det har just höjts.' },
      { text: 'ÅTERINFÖR VÄRNPLIKTEN', cost: { pp: 30 }, law: ['military_service', 'mixed'], temp: { approval: -6, unrest: 4 }, tip: 'Problemet löst med ett penndrag. Tonåringarna är inte förtjusta.' },
      { text: 'MEDBORGARSKAP FÖR UTLÄNDSKA REKRYTER', temp: { manpower: 5, approval: -4 }, perm: { immigration: 3 }, tip: 'Ett pass mot tre års tjänst. Gammalt knep, fortfarande effektivt.' },
    ],
  },
  {
    id: 'for_draft_exemptions', icon: '\u{1F4B0}', weight: 2,
    title: 'DE RIKAS BARN SLIPPER UNDAN',
    text: 'En granskning visar att barn till rika och inflytelserika familjer får läkarintyg som befriar dem från värnplikten tio gånger oftare än andra. Intygen kommer ofta från samma tre kliniker.',
    when: (c) => c.is('military_service', 'high', 'mandatory') && c.st.corruption > 10,
    choices: [
      { text: 'GRANSKA ALLA INTYG TIO ÅR TILLBAKA', cost: { pp: 25 }, perm: { corruption: -6 }, temp: { approval: 8, manpower: 4, stability: -3 }, tip: 'Plötsligt blir många förvånansvärt friska.' },
      { text: 'STÄNG DE TRE KLINIKERNA', cost: { pp: 10 }, perm: { corruption: -3 }, temp: { approval: 3 }, tip: 'Det finns fler kliniker.' },
      { text: 'LÅT DET VARA', perm: { corruption: 4 }, temp: { approval: -6, unrest: 4 }, tip: 'Alla är lika inför lagen. Vissa är bara lite sjukare.' },
    ],
  },

  // ================= GENERALER & JUNTA =================
  {
    id: 'for_general_on_tv', icon: '\u{1F4FA}', weight: 2,
    title: 'GENERALEN SOM SÄGER EMOT',
    text: 'En populär general kallar öppet regeringens försvarspolitik naiv i en tv-intervju. Han säger att politikerna inte förstår vad en armé behöver, och halva landet håller med honom.',
    when: (c) => c.st.milpower > 20 && c.st.approval < 0 && c.st.freedom > -30,
    choices: [
      { text: 'AVSKEDA HONOM', cost: { pp: 25 }, temp: { statepower: 6, milpower: -6, approval: -4 }, tip: 'Civil kontroll över militären. Och en ny folkhjälte.' },
      { text: 'BJUD IN HONOM TILL FÖRSVARSBEREDNINGEN', cost: { pp: 10 }, temp: { readiness: 5, approval: 4, statepower: -4 }, tip: 'Håll dina kritiker nära. Helst vid samma bord.' },
      { text: 'LÅT DET PASSERA', temp: { approval: -5, statepower: -4 }, tip: 'Nästa general vet nu att det går bra att prata.' },
    ],
  },
  {
    id: 'for_general_candidate', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'GENERALEN STÄLLER UPP I VALET',
    text: 'En nyss pensionerad överbefälhavare har bildat ett eget parti och leder redan i flera opinionsmätningar. Hans löfte är enkelt: ordning, disciplin och ett starkare försvar.',
    when: (c) => c.is('elections', 'entirelyfree', 'free', 'mostlyfree', 'balanced') && c.st.milpower > 15 && c.day > 200,
    choices: [
      { text: 'ERBJUD HONOM POSTEN SOM FÖRSVARSMINISTER', cost: { pp: 20 }, perm: { milpower: 5, readiness: 4 }, temp: { statepower: -5 }, tip: 'Han får en titel. Du slipper en motståndare.' },
      { text: 'MÖT HONOM I VALDEBATTERNA', temp: { approval: -4, stability: -3, freedom: 3 }, tip: 'Demokratin fungerar. Det är just det som oroar dig.' },
      { text: 'FÖRBJUD OFFICERARE ATT KANDIDERA', cost: { pp: 30 }, temp: { freedom: -8, stability: 4, approval: -5 }, rel: -3, tip: 'Ett lagförslag skrivet med exakt en person i åtanke.' },
    ],
  },
  {
    id: 'for_junta_rift', icon: '\u{2B50}', weight: 2,
    title: 'JUNTAN ÄR OENIG',
    text: 'Militärrådet som styr landet har delat sig i två läger. Flygvapnets chef vill satsa på ekonomin, arméchefen vill ha fler soldater, och ingen av dem tänker ge sig.',
    when: (c) => c.is('government', 'junta') || c.ideo === 'stratocracy',
    choices: [
      { text: 'STÖD ARMÉCHEFEN', temp: { milpower: 8, manpower: 6, income: -5, statepower: 3 }, tip: 'Fler soldater, färre skolor. Klassiskt.' },
      { text: 'STÖD FLYGVAPNETS CHEF', temp: { gdp: 6, factory: 5, milpower: -4, stability: -3 }, tip: 'Ekonomin vinner. Armén börjar räkna sina vänner.' },
      { text: 'PENSIONERA BÅDA MED GULDKANT', cost: { money: 800 }, temp: { stability: 8, statepower: 6, corruption: 4 }, tip: 'Två villor vid kusten är billigare än en maktkamp.' },
    ],
  },
  {
    id: 'for_junta_civilian', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'FOLKET KRÄVER CIVILT STYRE',
    text: 'Fackförbund, studenter och trossamfund har gått samman i en rörelse som kräver att militären lämnar makten och utlyser val. Utländska ambassader följer läget noga.',
    when: (c) => (c.is('government', 'junta') || c.ideo === 'stratocracy') && (c.st.unrest > 0 || c.st.approval < -10),
    choices: [
      { text: 'LOVA VAL INOM TVÅ ÅR', cost: { pp: 25 }, temp: { unrest: -12, approval: 8, statepower: -6 }, rel: 8, tip: 'Ett datum i kalendern lugnar gatan. Datum kan flyttas.' },
      { text: 'LÄMNA ÖVER TILL EN ÖVERGÅNGSREGERING', cost: { pp: 40 }, law: ['government', 'mixed'], temp: { unrest: -18, stability: -6, milpower: -6 }, perm: { freedom: 6 }, rel: 15, tip: 'Historien minns dig vänligt. Dina kollegor gör det kanske inte.' },
      { text: 'UTLYS UNDANTAGSTILLSTÅND', temp: { unrest: -6, freedom: -12, approval: -8 }, rel: -8, tip: 'Lugnt på gatorna. Mycket oroligt bakom fönstren.' },
    ],
  },
  {
    id: 'for_young_colonels', icon: '\u{1F396}\u{FE0F}', weight: 2,
    title: 'DE UNGA ÖVERSTARNA',
    text: 'En grupp yngre officerare har skickat ett brev till dig. De kräver reformer, slut på korruptionen i försvaret och fria val, annars tänker de "ta sitt ansvar". Brevet har läckt till pressen.',
    when: (c) => c.is('government', 'authoritarian', 'totalitarian', 'junta', 'hybrid') && c.st.approval < -15 && c.st.milpower > -20,
    choices: [
      { text: 'MÖT DERAS KRAV PÅ REFORMER', cost: { pp: 30 }, perm: { corruption: -5, freedom: 4 }, temp: { statepower: -8, stability: 4 }, tip: 'Du gav efter. Eller så ledde du. Det beror på vem som skriver historien.' },
      { text: 'FÖRFLYTTA DEM TILL AVLÄGSNA GARNISONER', cost: { pp: 15 }, temp: { readiness: -5, stability: 3, unrest: 3 }, tip: 'Utspridda överstar är svårare att samla. Men de har telefoner.' },
      { text: 'LÅTSAS ATT BREVET ALDRIG KOM', temp: { stability: -10, milpower: -4 }, tip: 'Brev som inte besvaras brukar följas av besök.' },
    ],
  },

  // ================= KRIGSINDUSTRI & VAPENEXPORT =================
  {
    id: 'for_arms_to_regime', icon: '\u{1F3ED}', weight: 2,
    title: 'VAPENAFFÄR MED EN OROLIG REGIM',
    text: 'Ett land vars regering just har slagit ner stora protester vill köpa pansarfordon från era fabriker. Ordern skulle säkra tusentals jobb i flera år, och konkurrenterna står redo att ta den.',
    when: (c) => c.st.factory > 15 && c.res('tanks') + c.res('aircraft') >= 6,
    choices: [
      { text: 'SÄLJ — JOBBEN GÅR FÖRST', res: { money: 1200 }, temp: { factory: 6, approval: -3 }, rel: -8, tip: 'Exportsiffrorna glänser. Det gör inte nyhetsbilderna.' },
      { text: 'SÄLJ MED VILLKOR OM HUR DE FÅR ANVÄNDAS', cost: { pp: 15 }, res: { money: 700 }, rel: -2, tip: 'Villkoren är bindande. Ingen kontrollerar dem.' },
      { text: 'STOPPA AFFÄREN', temp: { factory: -5, income: -4, approval: 3 }, rel: 6, tip: 'Rena händer, tysta löpande band.' },
    ],
  },
  {
    id: 'for_war_factories', icon: '\u{2699}\u{FE0F}', weight: 2,
    title: 'BILFABRIKERNA SKA BYGGA PANSAR',
    text: 'Försvarsledningen vill att landets fordonsindustri ställer om till krigsproduktion. Företagen vill ha garantier och betalt i förskott, och facket vill veta vad som händer med lönerna.',
    when: (c) => c.atWar && (c.ind.manuf ?? 10) > 10,
    choices: [
      { text: 'STATEN TAR ÖVER FABRIKERNA UNDER KRIGET', cost: { pp: 30 }, temp: { milpower: 12, factory: 8, gdp: -6, freedom: -5 }, tip: 'Staten bygger stridsvagnar. Nya bilar blir en lyx.' },
      { text: 'BETALA FÖR OMSTÄLLNINGEN', cost: { money: 1200 }, temp: { milpower: 10, factory: 6, readiness: 4 }, tip: 'Snabbt och fredligt. Och dyrt.' },
      { text: 'LÅT MARKNADEN STYRA', temp: { milpower: 3, gdp: 3, readiness: -4 }, tip: 'Fabrikerna bygger det som lönar sig. Det är sällan granater.' },
    ],
  },
  {
    id: 'for_procurement_scandal', icon: '\u{1F6A2}', weight: 2,
    title: 'UBÅTARNA BLEV DUBBELT SÅ DYRA',
    text: 'Den nya ubåtsserien är fyra år försenad och kostar dubbelt så mycket som utlovat. Det visar sig att varvet anlitat underleverantörer som ägs av höga officerares släktingar.',
    when: (c) => c.st.corruption > 20 && (c.ind.milx ?? 2) > 1.5,
    choices: [
      { text: 'SÄG UPP KONTRAKTET OCH BÖRJA OM', cost: { pp: 20 }, perm: { corruption: -6 }, temp: { milpower: -6, readiness: -4 }, tip: 'Rätt beslut. Flottan får vänta några år till.' },
      { text: 'BETALA OCH TA EMOT UBÅTARNA', cost: { money: 1300 }, perm: { milpower: 8, corruption: 3 }, tip: 'Två ubåtar till priset av fyra. De flyter i alla fall.' },
      { text: 'TYSTA NER SAKEN', perm: { corruption: 5 }, mod: 'cover_up', tip: 'Ubåtar är ju gjorda för att hålla sig under ytan.' },
    ],
  },
  {
    id: 'for_fighter_deal', icon: '\u{2708}\u{FE0F}', weight: 2,
    title: 'STRIDSFLYGPLANSAFFÄREN',
    text: 'Flygvapnets gamla plan måste ersättas. På bordet ligger tre anbud: ett beprövat plan från en stormakt, ett billigare från ett grannland och ett eget som ännu bara finns på ritbordet.',
    when: (c) => c.res('aircraft') >= 2 && (c.ind.milbudget ?? 0) > 1e9 && !c.atWar && c.st.readiness < 20,
    choices: [
      { text: 'KÖP STORMAKTENS PLAN', cost: { money: 1600 }, perm: { milpower: 12, readiness: 8, statepower: -4 }, rel: 5, tip: 'Bäst i klassen. Reservdelarna kommer med en direktlinje till deras regering.' },
      { text: 'KÖP GRANNLANDETS PLAN', cost: { money: 900 }, perm: { milpower: 7, readiness: 5 }, rel: 4, tip: 'Lagom bra, lagom dyrt, lagom politiskt.' },
      { text: 'BYGG ETT EGET', cost: { money: 1000, rp: 60 }, perm: { milpower: 6, factory: 6, research: 5 }, tip: 'Tio år av förseningar. Sedan är det ditt.' },
      { text: 'FLYG DE GAMLA ETT TAG TILL', temp: { readiness: -6, milpower: -4 }, tip: 'De har flugit i trettio år. Vad är fem till?' },
    ],
  },
  {
    id: 'for_drone_startup', icon: '\u{1F681}', weight: 2,
    title: 'DRÖNARE FRÅN ETT GARAGE',
    text: 'Tre ingenjörsstudenter har byggt en drönare som gör samma jobb som försvarets dyra spaningsplan, till en hundradel av priset. Generalstaben är skeptisk. Utländska köpare är det inte.',
    when: (c) => c.res('aircraft') >= 3 && c.st.research > 10,
    choices: [
      { text: 'BESTÄLL TUSENTALS TILL FÖRSVARET', cost: { money: 700 }, perm: { milpower: 6, readiness: 4 }, tip: 'Billigt i stora mängder. Generalerna vänjer sig.' },
      { text: 'LÅT DEM SÄLJA UTOMLANDS', res: { money: 500 }, temp: { gdp: 4 }, rel: -3, tip: 'Exportsuccé. Ni får se era drönare på nyheterna, i andras konflikter.' },
      { text: 'KÖP UPP FÖRETAGET TILL STATEN', cost: { money: 1000 }, perm: { milpower: 5, research: 5, factory: 3 }, tip: 'Statligt ägt, statligt tempo.' },
    ],
  },

  // ================= FÖRSVARSBUDGETEN =================
  {
    id: 'for_two_percent', icon: '\u{1F4CA}', weight: 2,
    title: 'ALLIANSEN KRÄVER MER AV OSS',
    text: 'På allianstoppmötet får ni hård kritik: ni lägger mindre på försvaret än nästan alla andra medlemmar. Partnerna kräver en plan för att nå två procent av BNP.',
    when: (c) => c.allies > 0 && (c.ind.milx ?? 2) < 1.5,
    choices: [
      { text: 'HÖJ ANSLAGEN REDAN I ÅR', cost: { money: 1000 }, perm: { milpower: 8, readiness: 6 }, rel: 8, tip: 'Pengarna kan inte läggas på något annat. Det märks.' },
      { text: 'LOVA, OCH HOPPAS ATT DE GLÖMMER', cost: { pp: 10 }, temp: { approval: 2 }, rel: -6, tip: 'De glömmer inte. De har kalkylblad.' },
      { text: 'VÄGRA — VI HAR ANDRA PRIORITERINGAR', temp: { welfare: 4, approval: 3, readiness: -4 }, rel: -10, tip: 'Skolor före stridsvagnar. Och allierade som tittar bort.' },
    ],
  },
  {
    id: 'for_defence_cuts', icon: '\u{1F4C9}', weight: 2,
    title: 'FINANSMINISTERN VILL SPARA PÅ FÖRSVARET',
    text: 'Statsskulden växer och finansministern har pekat ut försvaret som den största posten att skära i. Försvarsministern hotar att avgå om förslaget går igenom.',
    when: (c) => (c.ind.debt ?? 57) > 80 && (c.ind.milx ?? 2) > 1.8 && !c.atWar,
    choices: [
      { text: 'SKÄR EN FJÄRDEDEL AV BUDGETEN', res: { money: 1000 }, perm: { milpower: -8, readiness: -6 }, tip: 'Budgeten går ihop. Övningarna gör det inte.' },
      { text: 'SKÄR I ALLT UTOM FÖRSVARET', temp: { welfare: -6, qol: -4, approval: -5 }, tip: 'Försvarsministern stannar. Sjuksköterskorna börjar räkna.' },
      { text: 'INFÖR EN SÄRSKILD FÖRSVARSSKATT', cost: { pp: 20 }, temp: { income: 6, gdp: -3, approval: -6 }, tip: 'Ärligt. Ingen tackar dig för det.' },
    ],
  },
  {
    id: 'for_peace_dividend', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'FREDSUTDELNINGEN',
    text: 'Landet har inte varit i krig på många år, och parlamentet vill ta ut en fredsutdelning: stänga regementen, sälja kaserner och flytta pengarna till skolor och vård.',
    when: (c) => !c.atWar && c.wars === 0 && c.day > 400 && (c.ind.milx ?? 2) > 2.5,
    choices: [
      { text: 'STÄNG TRE REGEMENTEN', res: { money: 900 }, perm: { welfare: 4, milpower: -8, readiness: -6 }, tip: 'Kasernerna blir studentbostäder. Dyrt att ändra tillbaka.' },
      { text: 'SÄLJ BARA DET ÖVERFLÖDIGA', cost: { pp: 10 }, res: { money: 400 }, perm: { readiness: -2 }, tip: 'Gamla förråd och en golfbana för officerare.' },
      { text: 'BEHÅLL FÖRSVARET SOM DET ÄR', temp: { approval: -5, readiness: 3 }, tip: 'Freden är ingen garanti, säger du. Ingen lyssnar.' },
    ],
  },

  // ================= VETERANER & DESERTERING =================
  {
    id: 'for_veteran_care', icon: '\u{1F3E5}', weight: 2,
    title: 'KÖN TILL VETERANVÅRDEN',
    text: 'Tusentals soldater som tjänstgjort i era krig väntar över ett år på behandling för skador och psykisk ohälsa. Veteranförbundet samlar namnunderskrifter utanför regeringsbyggnaden.',
    when: (c) => c.wars >= 2 && c.st.welfare < 0,
    choices: [
      { text: 'EGEN VÅRDGARANTI FÖR VETERANER', cost: { money: 900 }, perm: { welfare: 4, manpower: 5, approval: 5 }, tip: 'Rätt sak. Andra patienter undrar varför de får vänta.' },
      { text: 'KÖP VÅRD AV PRIVATA KLINIKER', cost: { money: 500 }, temp: { approval: 4, manpower: 3, corruption: 3 }, tip: 'Kön blir kortare. Fakturorna blir längre.' },
      { text: 'HÄNVISA TILL DEN VANLIGA VÅRDEN', temp: { approval: -6, manpower: -5, readiness: -3 }, tip: 'Lika för alla. Ingen rekryt tycker att det låter lockande.' },
    ],
  },
  {
    id: 'for_desertion', icon: '\u{1F6AA}', weight: 2,
    title: 'SOLDATER LÄMNAR SINA FÖRBAND',
    text: 'Allt fler soldater lämnar sina förband vid fronten och tar sig hem. Militärpolisen hinner inte med, och i flera byar gömmer grannarna dem.',
    when: (c) => c.atWar && (c.st.approval < -10 || c.mod('war_weariness')),
    choices: [
      { text: 'AMNESTI FÖR DEN SOM ÅTERVÄNDER INOM EN MÅNAD', temp: { manpower: 4, milpower: -3, approval: 4 }, tip: 'Hälften kommer tillbaka. Resten vet nu att det går att stanna hemma.' },
      { text: 'HÅRDA STRAFF OCH MILITÄRPOLIS I BYARNA', cost: { pp: 25 }, temp: { readiness: 6, freedom: -10, unrest: 8, approval: -6 }, tip: 'Leden fylls. Byarna minns.' },
      { text: 'BÖRJA ROTERA HEM TRUPPERNA', cost: { man: 12 }, temp: { milpower: -8, approval: 5, unrest: -6 }, unmod: 'war_weariness', tip: 'Färre vid fronten, fler som orkar.' },
    ],
  },
  {
    id: 'for_pilot_defects', icon: '\u{1F6E9}\u{FE0F}', weight: 2,
    title: 'EN PILOT HAR FLUGIT ÖVER GRÄNSEN',
    text: 'Under en rutinövning bröt en stridspilot formationen och landade på en flygbas i grannlandet. Där har han begärt asyl och berättar gärna för journalister om hur landet styrs.',
    when: (c) => c.res('aircraft') >= 2 && c.st.freedom < -20,
    choices: [
      { text: 'KRÄV TILLBAKA PLANET OCH PILOTEN', cost: { pp: 15 }, temp: { statepower: 4 }, rel: -6, tip: 'Planet kanske. Piloten knappast.' },
      { text: 'SKÄRP KONTROLLEN ÖVER ALLA PILOTER', temp: { readiness: -6, milpower: -3, statepower: 5, freedom: -4 }, tip: 'Ingen flyger iväg. Knappt någon flyger alls.' },
      { text: 'LÄTTA PÅ TRYCKET I FÖRSVARET', cost: { pp: 20 }, perm: { freedom: 4 }, temp: { readiness: 3, statepower: -4 }, tip: 'Kanske var det inte flygplanet som var problemet.' },
    ],
  },

  // ================= KRIGSTRÖTTHET & KRIGSYRA =================
  {
    id: 'for_families_vigil', icon: '\u{1F56F}\u{FE0F}', weight: 2,
    title: 'ANHÖRIGA TÄNDER LJUS PÅ TORGET',
    text: 'Varje kväll samlas föräldrar och partner till soldater vid fronten framför regeringsbyggnaden. De står tysta med tända ljus och kräver bara en sak: att få hem sina anhöriga.',
    when: (c) => c.atWar && (c.mod('war_weariness') || c.st.unrest > 20),
    choices: [
      { text: 'TRÄFFA DEM OCH LOVA ROTATION', cost: { pp: 15 }, temp: { approval: 8, unrest: -8, readiness: -4 }, tip: 'Ett löfte du nu måste hålla.' },
      { text: 'FÖRBJUD SAMMANKOMSTERNA', cost: { pp: 20 }, temp: { freedom: -10, approval: -10, unrest: 6 }, tip: 'Ljusen släcks. Bilderna finns kvar.' },
      { text: 'LÅT DEM STÅ', temp: { approval: -4, readiness: -3 }, mod: 'war_weariness', tip: 'Torget fylls lite mer för varje kväll.' },
    ],
  },
  {
    id: 'for_war_fever_crowds', icon: '\u{1F4E3}', weight: 2,
    title: 'FOLKMASSORNA VILL HA MER',
    text: 'Krigsyran har tagit tag i landet. Flaggor hänger från varje balkong, frivilliga köar vid kasernerna och tidningarna kräver att armén ska gå längre än regeringen har sagt.',
    when: (c) => c.mod('war_fever') || (c.atWar && c.st.ideopower > 30),
    choices: [
      { text: 'RID PÅ VÅGEN', res: { man: 15 }, temp: { approval: 8, ideopower: 6, justtime: -8 }, rel: -6, tip: 'Folket marscherar före dig. Det är svårt att svänga.' },
      { text: 'DÄMPA TONEN', cost: { pp: 20 }, unmod: 'war_fever', temp: { approval: -4, stability: 4 }, tip: 'Du kyler av landet. Några kallar dig svag.' },
      { text: 'KANALISERA DEN TILL INSAMLINGAR', res: { money: 500 }, temp: { ideopower: 4, readiness: -2 }, tip: 'Entusiasm är bra. Entusiasm med kontonummer är bättre.' },
    ],
  },

  // ================= LIVET UNDER KRIG =================
  {
    id: 'for_rationing', icon: '\u{1F35E}', weight: 2,
    title: 'RANSONERINGSKORTEN DELAS UT',
    text: 'Kriget slukar bränsle, mat och reservdelar. Hyllorna i butikerna har börjat gapa tomma, och priserna på det som finns kvar stiger varje vecka.',
    when: (c) => c.atWar && (c.wars >= 2 || c.st.factory < -10),
    choices: [
      { text: 'INFÖR RANSONERING AV MAT OCH BRÄNSLE', cost: { pp: 20 }, temp: { unrest: -4, qol: -6, readiness: 6, stability: 4 }, tip: 'Alla får lika lite. Det är ändå något.' },
      { text: 'LÅT PRISERNA STIGA', temp: { qol: -8, unrest: 8, gdp: 3 }, tip: 'De rika handlar som vanligt. Resten står i kö.' },
      { text: 'KÖP UPP LIVSMEDEL UTOMLANDS', cost: { money: 1100 }, temp: { qol: 4, approval: 4 }, tip: 'Fartygen måste bara ta sig fram.' },
    ],
  },
  {
    id: 'for_war_bonds', icon: '\u{1F4DC}', weight: 2,
    title: 'KÖP KRIGSOBLIGATIONER!',
    text: 'Statskassan krymper för varje vecka kriget pågår. Finansdepartementet föreslår krigsobligationer: medborgarna lånar ut sina besparingar till staten mot ränta och en affisch i varje busskur.',
    when: (c) => c.atWar && c.money < 1500,
    choices: [
      { text: 'STOR KAMPANJ MED FILMSTJÄRNOR', cost: { pp: 15 }, res: { money: 1200 }, temp: { ideopower: 6 }, tip: 'Patriotism med årlig avkastning.' },
      { text: 'TVINGANDE LÅN FRÅN ALLA LÖNER', res: { money: 1500 }, temp: { approval: -10, unrest: 6, freedom: -4 }, tip: 'Frivilligt, fast inte riktigt.' },
      { text: 'LÅNA HELLRE UTOMLANDS', res: { money: 800 }, temp: { statepower: -4 }, perm: { income: -3 }, tip: 'Pengar nu, räntor sedan, till någon annan.' },
    ],
  },
  {
    id: 'for_pow_camp', icon: '\u{26D3}\u{FE0F}', weight: 2,
    title: 'FÅNGLÄGREN ÄR FULLA',
    text: 'Antalet tillfångatagna fiendesoldater har tredubblats på några månader. Lägren är överfulla, och Röda korset begär att få inspektera förhållandena.',
    when: (c) => c.atWar && c.claims > 2,
    choices: [
      { text: 'SLÄPP IN INSPEKTÖRERNA OCH BYGG UT', cost: { money: 700 }, temp: { approval: 2 }, rel: 10, tip: 'Krigets regler gäller. Även när de är dyra.' },
      { text: 'FÖRESLÅ ETT FÅNGUTBYTE', cost: { pp: 20 }, temp: { approval: 8, manpower: 4 }, rel: 6, tip: 'Era egna kommer hem. Deras också.' },
      { text: 'NEKA ALLA INSPEKTIONER', temp: { statepower: 3 }, rel: -15, tip: 'Det som inte syns finns inte. Det tycker i alla fall du.' },
    ],
  },
  {
    id: 'for_war_film', icon: '\u{1F3AC}', weight: 2,
    title: 'PROPAGANDAFILMEN',
    text: 'Informationsministeriet har spelat in en storfilm om krigets hjältar. Den är pampig och rörande, och har bara ett litet problem: nästan inget i den har hänt.',
    when: (c) => c.atWar && (c.is('press', 'state', 'highstate', 'propaganda') || c.st.freedom < -20),
    choices: [
      { text: 'VISA DEN PÅ ALLA BIOGRAFER', cost: { money: 300 }, temp: { ideopower: 10, approval: 5, freedom: -3 }, tip: 'Publiken gråter i salongen. Veteranerna skrattar i foajén.' },
      { text: 'KLIPP OM DEN SÅ ATT DEN STÄMMER', cost: { pp: 10 }, temp: { ideopower: 4, approval: 3 }, tip: 'Kortare, sannare, tråkigare.' },
      { text: 'LÄGG DEN I ARKIVET', temp: { ideopower: -4, freedom: 2 }, tip: 'Regissören är förolämpad. Kriget fortsätter utan filmmusik.' },
    ],
  },
  {
    id: 'for_front_report', icon: '\u{1F4F0}', weight: 2,
    title: 'FRONTRAPPORTERNA STÄMMER INTE',
    text: 'En reporter har besökt fronten och skriver att läget är betydligt sämre än vad generalstaben rapporterar till dig. Generalerna kallar reportaget för fiendens propaganda.',
    when: (c) => c.atWar && c.st.freedom > 0,
    choices: [
      { text: 'SKICKA EN EGEN OBSERVATÖR TILL FRONTEN', cost: { pp: 15 }, temp: { readiness: 6, statepower: 4, approval: 3 }, tip: 'Nu vet du hur det ligger till. Det var inte trevlig läsning.' },
      { text: 'STÄLL DIG BAKOM GENERALERNA', temp: { milpower: 4, approval: -6, freedom: -3 }, tip: 'Optimism är en strategi. Inte den bästa.' },
      { text: 'INFÖR MILITÄR CENSUR AV FRONTNYHETER', cost: { pp: 20 }, temp: { freedom: -8, ideopower: 6, unrest: -3 }, tip: 'Inga dåliga nyheter. Inga nyheter alls, faktiskt.' },
    ],
  },
  {
    id: 'for_mediator', icon: '\u{1F310}', weight: 2,
    title: 'ETT NEUTRALT LAND VILL MEDLA',
    text: 'En neutral stat erbjuder sig att stå värd för samtal mellan er och fienden på ett hotell vid en lugn sjö. Det är inget fredsavtal, bara ett första möte, men hela världen tittar.',
    when: (c) => c.atWar && c.is('un', 'member', 'important', 'head'),
    choices: [
      { text: 'SKICKA UTRIKESMINISTERN', cost: { pp: 20 }, temp: { unrest: -6, approval: 4, readiness: -3 }, rel: 12, tip: 'Samtal är inte fred. Men de är inte heller krig.' },
      { text: 'SKICKA EN LÅGT RANKAD DIPLOMAT', cost: { pp: 5 }, rel: 4, tip: 'Ni är där. Ni lyssnar. Ni lovar ingenting.' },
      { text: 'AVBÖJ — VI FÖRHANDLAR INTE NU', temp: { ideopower: 5, readiness: 4 }, rel: -8, tip: 'Fienden ser det som ett tecken. Det gör alla andra också.' },
    ],
  },
  {
    id: 'for_women_factories', icon: '\u{1F527}', weight: 2,
    title: 'KVINNORNA TAR ÖVER FABRIKERNA',
    text: 'Med så många män vid fronten står fabrikerna halvtomma. Tusentals kvinnor har sökt jobben, men lagen begränsar fortfarande vilka yrken de får ha, och fabriksägarna vill veta vad som gäller.',
    when: (c) => c.atWar && c.is('equality', 'traditional', 'restricted'),
    choices: [
      { text: 'ÖPPNA ALLA YRKEN FÖR KVINNOR', cost: { pp: 20 }, law: ['equality', 'legal'], perm: { factory: 6, gdp: 4 }, tip: 'Det var tänkt som tillfälligt. Det blir det aldrig.' },
      { text: 'TILLÅT DET BARA UNDER KRIGET', temp: { factory: 8, gdp: 4, unrest: 3 }, tip: 'Efter kriget ska allt bli som förut. Ingen tror riktigt på det.' },
      { text: 'BEHÅLL REGLERNA', temp: { factory: -8, milpower: -4 }, tip: 'Principerna är intakta. De löpande banden står still.' },
    ],
  },

  // ================= SPIONAGE & KONTRASPIONAGE =================
  {
    id: 'for_mole_hunt', icon: '\u{1F575}\u{FE0F}', weight: 2,
    title: 'EN MULLVAD I GENERALSTABEN',
    text: 'Kontraspionaget är säkert på sin sak: någon i försvarsledningen har i flera år lämnat ut planer till en främmande makt. Det finns fem misstänkta, och alla fem har höga befattningar.',
    when: (c) => c.res('espionage') >= 4 && c.st.milpower > 0,
    choices: [
      { text: 'TYST UTREDNING I FLERA MÅNADER', cost: { rp: 40 }, temp: { safety: 6, statepower: 4 }, tip: 'Mullvaden märker ingenting. Förhoppningsvis.' },
      { text: 'STÄNG AV ALLA FEM', temp: { readiness: -10, milpower: -5, safety: 4 }, tip: 'Mullvaden är borta. Det är fyra oskyldiga också.' },
      { text: 'MATA MULLVADEN MED FALSKA PLANER', cost: { pp: 20 }, perm: { milpower: 4 }, temp: { readiness: 4 }, rel: -3, tip: 'Låt fienden förbereda sig för ett krig som aldrig kommer.' },
    ],
  },
  {
    id: 'for_embassy_spies', icon: '\u{1F3E2}', weight: 2,
    title: 'AMBASSADEN ÄR ETT SPIONNÄSTE',
    text: 'Säkerhetspolisen har kartlagt en stormakts ambassad. Tolv av de anställda diplomaterna är i själva verket underrättelseofficerare, och några har kontakter i ert försvarsdepartement.',
    when: (c) => c.res('espionage') >= 3 && c.st.safety > 10,
    choices: [
      { text: 'UTVISA ALLA TOLV', cost: { pp: 15 }, temp: { safety: 6, approval: 5 }, rel: -10, tip: 'De utvisar tolv av era. Diplomatisk matematik.' },
      { text: 'UTVISA TRE OCH BEVAKA RESTEN', cost: { rp: 30 }, temp: { safety: 4, statepower: 3 }, rel: -3, tip: 'Låt dem tro att de vet vad ni vet.' },
      { text: 'LÅT DEM VARA — VI VET VILKA DE ÄR', temp: { safety: -4 }, rel: 2, tip: 'En känd spion är bättre än en okänd. I teorin.' },
    ],
  },
  {
    id: 'for_satellite_buildup', icon: '\u{1F6F0}\u{FE0F}', weight: 2,
    title: 'TRUPPER SAMLAS VID GRÄNSEN',
    text: 'Era satelliter visar att grannlandet flyttar pansarförband och bränsledepåer allt närmare gränsen. Deras regering säger att det rör sig om en helt vanlig övning.',
    when: (c) => c.res('satellites') >= 4 && !c.atWar && c.st.readiness < 10,
    choices: [
      { text: 'HÖJ BEREDSKAPEN OCH FLYTTA FÖRBAND', cost: { money: 600 }, temp: { readiness: 12, milpower: 4, unrest: 3 }, rel: -4, tip: 'Om det var en övning är ni nu med i den.' },
      { text: 'PUBLICERA BILDERNA FÖR HELA VÄRLDEN', cost: { pp: 15 }, temp: { readiness: 4, approval: 4 }, rel: 6, tip: 'Svårt att överraska någon när alla redan tittar.' },
      { text: 'TA DEM PÅ ORDET', temp: { readiness: -4, unrest: -2 }, tip: 'Kanske är det en övning. Kanske är det generalrepetitionen.' },
    ],
  },

  // ================= KÄRNVAPEN =================
  {
    id: 'for_nuclear_doctrine', icon: '\u{2622}\u{FE0F}', weight: 2,
    title: 'VEM FÅR TRYCKA PÅ KNAPPEN?',
    text: 'Kärnvapenprogrammet har kommit så långt att generalstaben vill ha en skriftlig doktrin. Frågan är enkel och svår på samma gång: när, och av vem, får vapnen någonsin användas?',
    when: (c) => c.res('nuclear') >= 4 && c.st.milpower > 10,
    choices: [
      { text: 'ALDRIG FÖRST — ENDAST SOM SVAR', cost: { pp: 15 }, perm: { stability: 4 }, rel: 10, tip: 'Avskräckning med säkerhetsspärr.' },
      { text: 'MEDVETEN OTYDLIGHET', temp: { milpower: 6, statepower: 4 }, rel: -4, tip: 'Ingen vet vad ni skulle göra. Inte ni heller.' },
      { text: 'SKRIV IN RÄTTEN ATT SLÅ FÖRST', cost: { pp: 25 }, perm: { milpower: 10 }, temp: { readiness: 6 }, rel: -20, tip: 'Ni blir fruktade. Och väldigt ensamma på toppmötena.' },
    ],
  },
  {
    id: 'for_nuclear_inspectors', icon: '\u{1F50D}', weight: 2,
    title: 'INSPEKTÖRERNA VID PORTEN',
    text: 'FN:s atomenergiorgan vill inspektera era anläggningar efter uppgifter om anrikning långt bortom det civila behovet. Inspektörerna har landat och väntar vid grinden till forskningscentret.',
    when: (c) => c.res('nuclear') >= 3 && c.is('un', 'member', 'important', 'head') && c.st.freedom < 0,
    choices: [
      { text: 'SLÄPP IN DEM ÖVERALLT', perm: { milpower: -4 }, temp: { statepower: -4 }, rel: 15, tip: 'Allt ligger öppet. Även det som var tänkt att vara hemligt.' },
      { text: 'VISA BARA DE CIVILA DELARNA', cost: { pp: 20 }, temp: { statepower: 3 }, rel: -4, tip: 'Rundturen var trevlig. Inspektörerna noterade vilka dörrar som var låsta.' },
      { text: 'NEKA DEM TILLTRÄDE', temp: { ideopower: 6, statepower: 5 }, rel: -18, tip: 'Hela världen drar sina egna slutsatser.' },
    ],
  },
  {
    id: 'for_nuclear_protest', icon: '\u{262E}\u{FE0F}', weight: 2,
    title: 'FREDSRÖRELSEN MOT BOMBEN',
    text: 'Hundratusentals människor bildar en mänsklig kedja från huvudstaden till landets robotbas. De kräver att landet skriver under FN:s förbud mot kärnvapen.',
    when: (c) => c.res('nuclear') >= 4 && c.st.freedom > 10,
    choices: [
      { text: 'SKRIV UNDER FÖRBUDET', cost: { pp: 30 }, perm: { milpower: -12, freedom: 3 }, temp: { approval: 8 }, rel: 20, tip: 'Världen applåderar. Generalerna gör det inte.' },
      { text: 'STOPPA NYA ROBOTAR, BEHÅLL DE GAMLA', cost: { pp: 15 }, temp: { approval: 4, unrest: -6 }, rel: 6, tip: 'En kompromiss som ingen marscherar för.' },
      { text: 'AVSKRÄCKNINGEN BEVARAR FREDEN', temp: { approval: -4, unrest: 6 }, tip: 'Du har en poäng. De har en tre mil lång kedja.' },
    ],
  },

  // ================= CYBERKRIG =================
  {
    id: 'for_cyber_attack', icon: '\u{1F4BB}', weight: 2,
    title: 'HACKARE HAR SLAGIT UT MYNDIGHETERNA',
    text: 'En samordnad attack har lamslagit datorerna hos skattemyndigheten, sjukhusen och järnvägen. Spåren pekar mot en grupp som ofta gör ärenden åt en främmande stat, men bevisen är inte vattentäta.',
    when: (c) => (c.ind.internet ?? 80) > 85 && c.res('espionage') < 3,
    choices: [
      { text: 'BYGG ETT NATIONELLT CYBERFÖRSVAR', cost: { money: 800, rp: 40 }, perm: { safety: 5, readiness: 4 }, tip: 'Dyrt skydd mot något som ingen ser.' },
      { text: 'PEKA UT STATEN BAKOM ANGREPPET', cost: { pp: 15 }, temp: { approval: 5, ideopower: 4 }, rel: -8, tip: 'De förnekar allt. Alla vet. Ingenting händer.' },
      { text: 'STARTA OM FRÅN PAPPERSKOPIOR', temp: { gdp: -6, income: -5, approval: -3 }, tip: 'Faxen är tillbaka. Ingen har saknat den.' },
    ],
  },
  {
    id: 'for_cyber_command', icon: '\u{1F5A5}\u{FE0F}', weight: 2,
    title: 'CYBERFÖRSVARET SÖKER HACKARE',
    text: 'Försvarets nya cyberkommando har svårt att hitta folk. Bästa kandidaten är en tjugoåring som just dömts för att ha tagit sig in i försvarsdepartementets nätverk, bara för att visa att det gick.',
    when: (c) => c.res('espionage') >= 3 && (c.ind.internet ?? 80) > 70 && c.st.research > 0,
    choices: [
      { text: 'BENÅDA OCH ANSTÄLL HONOM', cost: { pp: 15 }, perm: { research: 3 }, temp: { readiness: 5, approval: -3 }, tip: 'Den som har brutit sig in vet var låset sitter.' },
      { text: 'STARTA EN CYBERSKOLA FÖR UNGA', cost: { money: 700, rp: 30 }, perm: { research: 5, readiness: 5 }, tip: 'Lagligt, långsamt, långsiktigt.' },
      { text: 'LÅT HONOM AVTJÄNA STRAFFET', temp: { readiness: -3, safety: 2 }, tip: 'Rättvisan segrar. Cyberkommandot fortsätter att leta.' },
    ],
  },

  // ================= ÖVNINGAR & BEREDSKAP =================
  {
    id: 'for_big_exercise', icon: '\u{1F3AF}', weight: 2,
    title: 'DEN STORA ÖVNINGEN',
    text: 'Er försvarsmakt och allierade trupper planerar årets största övning med fyrtiotusen soldater, några mil från gränsen. Grannlandet kallar det en provokation och hotar med motåtgärder.',
    when: (c) => c.allies > 0 && c.st.readiness > 10 && !c.atWar,
    choices: [
      { text: 'GENOMFÖR ÖVNINGEN SOM PLANERAT', cost: { money: 500 }, temp: { readiness: 10, milpower: 4 }, rel: -6, tip: 'Ni visar vad ni kan. Grannen antecknar allt.' },
      { text: 'FLYTTA ÖVNINGEN LÄNGRE IN I LANDET', cost: { money: 300 }, temp: { readiness: 6 }, rel: 2, tip: 'Samma övning, mindre rubriker.' },
      { text: 'STÄLL IN', temp: { readiness: -6, statepower: -3 }, rel: 3, tip: 'Grannen lugnar sig. De allierade höjer på ögonbrynen.' },
    ],
  },
  {
    id: 'for_snap_inspection', icon: '\u{1F6A8}', weight: 2,
    title: 'HÄLFTEN AV FORDONEN STARTAR INTE',
    text: 'En oanmäld beredskapskontroll visar att hälften av fordonen inte startar, att ammunitionsförråden är halvtomma och att ett regemente inte hittar nycklarna till sitt eget vapenförråd.',
    when: (c) => c.st.readiness < -15 && !c.atWar && c.st.milpower > -30,
    choices: [
      { text: 'AVSKEDA DE ANSVARIGA CHEFERNA', cost: { pp: 20 }, temp: { readiness: 6, milpower: -3, statepower: 4 }, tip: 'Nya chefer, samma fordon.' },
      { text: 'STORT UNDERHÅLLSPAKET', cost: { money: 900 }, perm: { readiness: 8, milpower: 3 }, tip: 'Fordonen startar. Kassan står still.' },
      { text: 'HEMLIGSTÄMPLA RAPPORTEN', temp: { readiness: -3 }, mod: 'cover_up', tip: 'Fienden behöver inte veta. Väljarna inte heller.' },
    ],
  },
  {
    id: 'for_stockpile', icon: '\u{1F4E6}', weight: 2,
    title: 'BEREDSKAPSLAGREN ÄR TOMMA',
    text: 'En utredning visar att landets beredskapslager av mat, bränsle och mediciner såldes ut för länge sedan. Vid en blockad skulle butikerna vara tomma inom två veckor.',
    when: (c) => c.st.readiness < -10 && !c.atWar && (c.ind.imports ?? 47) > 40,
    choices: [
      { text: 'BYGG UPP LAGREN IGEN', cost: { money: 1000 }, perm: { readiness: 6, stability: 3, safety: 3 }, tip: 'Tusentals ton konserver som du hoppas aldrig ska ätas.' },
      { text: 'AVTAL MED BUTIKSKEDJORNA OM BUFFERTLAGER', cost: { pp: 15 }, perm: { readiness: 3 }, temp: { gdp: -2 }, tip: 'Lagren finns, i teorin. Butikerna lovar.' },
      { text: 'LITA PÅ HANDELN', temp: { readiness: -4, stability: -2 }, tip: 'Lastbilarna har alltid kommit fram. Hittills.' },
    ],
  },
  {
    id: 'for_home_guard', icon: '\u{1F3E0}', weight: 2,
    title: 'HEMVÄRNET VILL BLI FLER',
    text: 'Det frivilliga hemvärnet har fått rekordmånga ansökningar efter oroliga nyheter från omvärlden. Det finns bara uniformer och utrustning till hälften av de nya.',
    when: (c) => c.is('military_service', 'none', 'small', 'mixed') && c.st.readiness < 0 && c.st.approval > 0,
    choices: [
      { text: 'UTRUSTA ALLA SOM VILL', cost: { money: 700 }, perm: { readiness: 6, manpower: 4 }, tip: 'Lokalt försvar, med lokalt kaffe efter varje övning.' },
      { text: 'TA BARA DE MED MILITÄR BAKGRUND', temp: { readiness: 3, approval: -3 }, tip: 'Färre, äldre, kunnigare.' },
      { text: 'STÄNG ANTAGNINGEN — DET ÄR ARMÉNS JOBB', temp: { approval: -5, readiness: -2 }, tip: 'Folk ville hjälpa till. Nu vet de att de inte behövs.' },
    ],
  },

  // ================= BASER & ALLIANSER =================
  {
    id: 'for_foreign_base', icon: '\u{1F6E1}\u{FE0F}', weight: 2,
    title: 'STORMAKTEN VILL HA EN BAS HÄR',
    text: 'Er mäktigaste allierade vill bygga en permanent flygbas på er mark, med tusentals soldater och moderna luftvärnssystem. Kommunen där basen ska ligga är splittrad: nya jobb eller buller dygnet runt.',
    when: (c) => c.allies > 0 && c.claims < 4 && !c.atWar,
    choices: [
      { text: 'SÄG JA TILL BASEN', perm: { readiness: 8, milpower: 6, statepower: -6 }, temp: { approval: -3 }, rel: 6, tip: 'Ni är säkrare. Och lite mindre suveräna.' },
      { text: 'JA, MOT HYRA OCH INFLYTANDE', cost: { pp: 20 }, res: { money: 600 }, perm: { readiness: 6, statepower: -3 }, tip: 'Vill de vara här kan de betala för det.' },
      { text: 'NEJ, VI FÖRSVARAR OSS SJÄLVA', temp: { ideopower: 5, approval: 3, readiness: -4 }, rel: -4, tip: 'Suveränt. Och ganska ensamt.' },
    ],
  },
  {
    id: 'for_base_abroad', icon: '\u{1F5FA}\u{FE0F}', weight: 2,
    title: 'VÅR BAS UTOMLANDS IFRÅGASÄTTS',
    text: 'Parlamentet i landet där ni har er största utlandsbas har röstat för att era trupper ska lämna landet inom ett år. Basen är nyckeln till er närvaro i hela regionen.',
    when: (c) => (c.puppets > 0 || c.allies >= 2) && c.st.milpower > 20,
    choices: [
      { text: 'FÖRHANDLA FRAM ETT NYTT AVTAL', cost: { money: 800 }, temp: { statepower: 3 }, rel: 4, tip: 'Mer hyra, färre soldater, samma flagga.' },
      { text: 'LÄMNA BASEN MED HEDER', temp: { milpower: -8, readiness: -6 }, rel: 10, tip: 'En ceremoni, en flaggnedhalning och ett tomrum som någon annan fyller.' },
      { text: 'STANNA KVAR ÄNDÅ', cost: { pp: 20 }, temp: { milpower: 4, statepower: 4 }, rel: -15, tip: 'Avtal är avtal. Utom när de inte är det.' },
    ],
  },
  {
    id: 'for_alliance_invite', icon: '\u{1F91D}', weight: 2,
    title: 'INBJUDAN TILL FÖRSVARSALLIANSEN',
    text: 'En stor försvarsallians erbjuder er medlemskap. Det betyder skydd om ni angrips, men också löften om att ställa upp för de andra och att anpassa försvarsbudgeten efter deras krav.',
    when: (c) => c.allies === 0 && !c.atWar && c.st.readiness > -10,
    choices: [
      { text: 'GÅ MED', cost: { pp: 25 }, perm: { readiness: 8, milpower: 6, statepower: -4 }, rel: 10, tip: 'Ni är inte ensamma längre. Ni är inte heller fria att stå utanför.' },
      { text: 'SAMARBETA MEN STÅ UTANFÖR', cost: { pp: 10 }, perm: { readiness: 3 }, rel: 4, tip: 'Partner, inte medlem. Det fungerar tills det verkligen gäller.' },
      { text: 'BEHÅLL NEUTRALITETEN', temp: { ideopower: 5, stability: 3, readiness: -3 }, tip: 'Neutralitet har räddat länder. Den har också svikit dem.' },
    ],
  },
  {
    id: 'for_ally_secret_talks', icon: '\u{1F4DE}', weight: 2,
    title: 'EN ALLIERAD PRATAR MED FIENDEN',
    text: 'Underrättelsetjänsten har uppgifter om att en av era närmaste allierade i hemlighet förhandlar om ett separat avtal med fienden. Om det stämmer står ni snart ensamma vid fronten.',
    when: (c) => c.atWar && c.allies > 0,
    choices: [
      { text: 'KONFRONTERA DEM ÖPPET', cost: { pp: 20 }, temp: { ideopower: 5, approval: 4 }, rel: -8, tip: 'De förnekar. Vänskapen blir aldrig riktigt densamma.' },
      { text: 'ERBJUD DEM MER FÖR ATT STANNA', cost: { money: 1000 }, temp: { readiness: 4 }, rel: 6, tip: 'Lojalitet, betald kvartalsvis.' },
      { text: 'FÖRBERED ER PÅ ATT STÅ ENSAMMA', temp: { readiness: 6, manpower: 4, stability: -3 }, tip: 'Hoppas på det bästa, planera för resten.' },
    ],
  },

  // ================= FÖRSVARSLÖS & SUPERMAKT =================
  {
    id: 'for_defenceless', icon: '\u{1F3F3}\u{FE0F}', weight: 2,
    title: 'ETT LAND UTAN FÖRSVAR',
    text: 'En internationell analys rankar ert försvar bland världens svagaste. Grannländernas tidningar diskuterar öppet vem som skulle "skydda" er om det blev oroligt, och utländska investerare blir nervösa.',
    when: (c) => c.mod('defenceless') || (c.st.milpower < -40 && c.st.readiness < 0),
    choices: [
      { text: 'KRISPROGRAM FÖR FÖRSVARET', cost: { money: 1500, pp: 20 }, perm: { milpower: 10, readiness: 6 }, unmod: 'defenceless', tip: 'Tio års försummelse ska lagas på två. Det blir dyrt.' },
      { text: 'SÖK SKYDD HOS EN STORMAKT', cost: { pp: 20 }, perm: { readiness: 6, statepower: -6 }, tip: 'Någon annan försvarar er. Någon annan bestämmer också lite.' },
      { text: 'FÖRKLARA ER PERMANENT NEUTRALA', temp: { ideopower: 4, stability: 3 }, rel: 8, tip: 'Ett papper som skyddar så länge alla andra respekterar papper.' },
    ],
  },
  {
    id: 'for_superpower', icon: '\u{1F985}', weight: 2,
    title: 'VÄRLDENS STARKASTE ARMÉ',
    text: 'Internationella bedömare kallar nu er försvarsmakt världens starkaste. Små länder ber om skydd, stora länder bildar allianser mot er och era generaler har börjat tala om "ansvar".',
    when: (c) => c.mod('military_superpower') || c.st.milpower > 45,
    choices: [
      { text: 'BLI VÄRLDENS POLIS', cost: { money: 1000, man: 10 }, temp: { ideopower: 8, statepower: 6, readiness: -4 }, rel: -6, tip: 'Alla vill ha ert skydd. Ingen vill ha er närvaro.' },
      { text: 'HÅLL EN STOR MILITÄRPARAD', cost: { money: 400 }, temp: { approval: 6, ideopower: 8 }, rel: -6, tip: 'Stridsvagnar på huvudgatan. Asfalten får lagas sedan.' },
      { text: 'AVSKRÄCKA, INTE IMPONERA', temp: { milpower: -3, stability: 3 }, rel: 8, tip: 'Stark nog att aldrig behöva visa det. Förhoppningsvis.' },
    ],
  },
];
