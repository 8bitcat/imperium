// IMPERIUM V5.6 — HÄNDELSER: OMVÄRLD, DIPLOMATI & RIKE.
// Statsbesök, FN, handel och sanktioner, allianser och bistånd — och riket som växer: provinser, lydstater och imperiets pris.
export const EVENTS = [

  // ================= DIPLOMATI =================
  {
    id: 'omv_state_visit', icon: '\u{1F6EC}', weight: 2,
    title: 'STATSBESÖK FRÅN EN STORMAKT',
    text: 'En av världens mäktigaste presidenter landar i morgon för ett tre dagar långt statsbesök. Protokollet vill veta hur stor mottagningen ska bli, och oppositionen undrar om du tänker ta upp de fängslade journalisterna i hans land.',
    when: (c) => c.st.stability > 10 && !c.mod('pariah') && c.is('un', 'member', 'important', 'head'),
    choices: [
      { text: 'RÖDA MATTAN, KORTEGE OCH GALAMIDDAG', cost: { money: 500 }, temp: { approval: 3, income: 6 }, rel: 12, tip: 'Han gillar kortegen. Affärerna följer efter.' },
      { text: 'TA UPP MÄNNISKORÄTTERNA PÅ PRESSKONFERENSEN', temp: { freedom: 4, approval: 5, income: -4 }, rel: -6, tip: 'Rätt sak att säga. Fel ställe att säga den på, tycker han.' },
      { text: 'TECKNA ETT FÖRSVARSSAMARBETE UNDER BESÖKET', cost: { pp: 20 }, temp: { milpower: 8, readiness: 5, statepower: -4 }, rel: 6, tip: 'Skyddet kommer med ett telefonnummer du inte kan låta bli att svara i.' },
    ],
  },
  {
    id: 'omv_embassy_storm', icon: '\u{1F6A8}', weight: 2,
    title: 'DEMONSTRANTER HAR STORMAT AMBASSADEN',
    text: 'En arg folkmassa har tagit sig in på en utländsk ambassad i huvudstaden och bränt flaggan på gården. Personalen har låst in sig i källaren och deras regering kräver att du ingriper nu.',
    when: (c) => c.st.unrest > 25 && c.st.safety < 10,
    choices: [
      { text: 'SKICKA IN KRAVALLPOLISEN DIREKT', cost: { pp: 15 }, temp: { unrest: 6, safety: 4, approval: -4 }, rel: 10, tip: 'Konventionerna är tydliga. Gatan är det också.' },
      { text: 'BE OM URSÄKT OCH BETALA SKADORNA', cost: { money: 400 }, temp: { ideopower: -6, approval: -3 }, rel: 12, tip: 'Fönster är billiga. Stolthet är dyrare.' },
      { text: 'LÅT FOLKET SÄGA SITT EN STUND TILL', temp: { ideopower: 8, unrest: -4 }, rel: -18, tip: 'Hemma ser det ut som styrka. Utomlands ser det ut som ett hot.' },
    ],
  },
  {
    id: 'omv_diplomats_expelled', icon: '\u{1F4E8}', weight: 2,
    title: 'VÅRA DIPLOMATER UTVISAS',
    text: 'Ett grannland har förklarat fyra av dina diplomater som icke önskvärda och gett dem två dygn att lämna landet. Officiellt handlar det om spionage, och ärligt talat har de inte helt fel.',
    when: (c) => c.res('espionage') >= 4 && c.st.freedom < 0,
    choices: [
      { text: 'UTVISA DUBBELT SÅ MÅNGA AV DERAS', cost: { pp: 10 }, temp: { ideopower: 6, approval: 4, income: -3 }, rel: -10, tip: 'Öga för öga, med ränta.' },
      { text: 'ACCEPTERA TYST OCH BYGG UPP NÄTVERKET IGEN', cost: { money: 500 }, perm: { statepower: 3 }, temp: { safety: 3 }, tip: 'Nya ansikten, samma uppdrag.' },
      { text: 'FÖRNEKA ALLT OCH LÄGG NER OPERATIONERNA', temp: { statepower: -5, safety: -4 }, rel: 6, tip: 'Grannarna lugnar sig. Underrättelsetjänsten surar.' },
    ],
  },
  {
    id: 'omv_un_resolution', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'RÖSTNINGEN I GENERALFÖRSAMLINGEN',
    text: 'FN ska rösta om en resolution som fördömer en av dina allierade för övergrepp i ett gränskrig. Båda sidor räknar med din röst, och ambassadören behöver besked före lunch.',
    when: (c) => c.is('un', 'member', 'important', 'head') && c.allies > 0 && c.st.ideopower > 10,
    choices: [
      { text: 'RÖSTA FÖR RESOLUTIONEN', temp: { freedom: 3, milpower: -4 }, rel: 10, tip: 'Världen applåderar. Den allierade ringer inte på ett tag.' },
      { text: 'RÖSTA EMOT', cost: { pp: 10 }, temp: { milpower: 4, ideopower: 4 }, rel: -10, tip: 'Lojalitet kostar trovärdighet.' },
      { text: 'LÄGG NER RÖSTEN', temp: { approval: -2 }, rel: -3, tip: 'Den diplomatiska motsvarigheten till att titta i taket.' },
    ],
  },
  {
    id: 'omv_un_seat', icon: '\u{1F4BA}', weight: 1,
    title: 'EN PLATS I SÄKERHETSRÅDET',
    text: 'Din regionala grupp föreslår att landet kandiderar till en av de roterande platserna i FN:s säkerhetsråd. Det betyder två år av inflytande, och två år av att behöva ta ställning i varje kris.',
    when: (c) => (c.is('un', 'important') || (c.is('un', 'member') && c.st.ideopower > 30)) && c.st.stability > -10,
    choices: [
      { text: 'KANDIDERA OCH KAMPANJA ÖVER HELA VÄRLDEN', cost: { money: 800, pp: 20 }, law: ['un', 'head'], rel: 10, tip: 'Röster i FN köps med biståndsprojekt och långa middagar.' },
      { text: 'STÖD GRANNLANDETS KANDIDATUR I STÄLLET', temp: { statepower: -2 }, rel: 8, tip: 'En tjänst nu, en gentjänst sedan.' },
      { text: 'TACKA NEJ', temp: { statepower: 3 }, rel: -4, tip: 'Ingen behöver veta vad du tycker. Det är skönt.' },
    ],
  },
  {
    id: 'omv_un_exit_demand', icon: '\u{1F6AA}', weight: 2,
    title: 'KRAVET: LÄMNA FN',
    text: 'En växande rörelse menar att FN bara binder landets händer och kräver att ni lämnar organisationen. Deras namninsamling har passerat en miljon underskrifter, och ditt eget parti lyssnar.',
    when: (c) => c.is('un', 'partner', 'member') && ['nationalism', 'populism', 'fascism', 'imperialism', 'stratocracy', 'natsoc'].includes(c.ideo),
    choices: [
      { text: 'LÄMNA FN', cost: { pp: 30 }, law: ['un', 'none'], temp: { ideopower: 8 }, rel: -15, tip: 'Ingen kan längre fördöma dig. Ingen vill heller handla med dig.' },
      { text: 'STANNA KVAR MEN BOJKOTTA MÖTENA', law: ['un', 'partner'], temp: { ideopower: 4, approval: 3 }, rel: -5, tip: 'Halvvägs ut genom dörren.' },
      { text: 'FÖRSVARA MEDLEMSKAPET OFFENTLIGT', cost: { pp: 15 }, temp: { ideopower: -6, stability: 4 }, rel: 6, tip: 'Du förklarar varför världen behövs. Rörelsen förklarar varför du inte gör det.' },
    ],
  },
  {
    id: 'omv_un_peacekeepers', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'FN BER OM FREDSBEVARARE',
    text: 'Ett inbördeskrig på en annan kontinent har äntligen fått ett eldupphör, och FN behöver blå baskrar som kan hålla det. Generalsekreteraren frågar om ditt land kan ställa upp med en bataljon.',
    when: (c) => c.is('un', 'member', 'important', 'head') && !c.atWar && c.st.readiness > 0 && c.st.milpower > 0,
    choices: [
      { text: 'SKICKA EN BATALJON', cost: { man: 8, money: 400 }, temp: { readiness: 6, approval: 3 }, rel: 14, tip: 'Soldaterna lär sig mycket. Allt vill du inte höra om.' },
      { text: 'SKICKA LÄKARE OCH INGENJÖRER', cost: { money: 600 }, temp: { approval: 2 }, rel: 8, tip: 'Mindre farligt, mindre synligt.' },
      { text: 'VI BEHÖVER VÅRA SOLDATER HEMMA', temp: { milpower: 2 }, rel: -6, tip: 'Freden får bevara sig själv.' },
    ],
  },
  {
    id: 'omv_nuclear_inspectors', icon: '\u{2622}\u{FE0F}', weight: 2,
    title: 'INSPEKTÖRERNA STÅR VID GRINDEN',
    text: 'Atomenergiorganet har skickat inspektörer efter uppgifter om att anrikningen gått längre än avtalat. De står vid grinden till anläggningen med kameror och mätinstrument.',
    when: (c) => c.res('nuclear') >= 4 && !c.is('un', 'none') && c.st.freedom < 10,
    choices: [
      { text: 'SLÄPP IN DEM OCH VISA ALLT', temp: { statepower: -5, milpower: -3 }, rel: 12, tip: 'Inget att dölja. Eller inget kvar att dölja.' },
      { text: 'VISA DEM DE RENA HALLARNA', cost: { pp: 20 }, temp: { milpower: 3 }, mod: 'cover_up', rel: 2, tip: 'Rundturen är noga planerad. Kartan också.' },
      { text: 'NEKA DEM TILLTRÄDE', temp: { ideopower: 8, milpower: 6, income: -6 }, rel: -18, tip: 'Grinden förblir stängd. Handeln stängs också.' },
    ],
  },
  {
    id: 'omv_citizen_detained', icon: '\u{26D3}\u{FE0F}', weight: 2,
    title: 'EN AV VÅRA MEDBORGARE ÄR GRIPEN',
    text: 'En ung forskare från ditt land har gripits utomlands under en konferensresa och anklagas för spionage. Alla vet att hon är en bricka i ett spel, och hennes föräldrar står utanför ditt kansli varje morgon.',
    when: (c) => c.st.freedom > 20 && c.st.milpower < 0,
    choices: [
      { text: 'GÅ MED PÅ ETT FÅNGUTBYTE', cost: { pp: 20 }, temp: { approval: 8, safety: -4 }, rel: -3, tip: 'Hon kommer hem. Andra lär sig vad en medborgare är värd.' },
      { text: 'TYST DIPLOMATI, HUR LÄNGE DET ÄN TAR', temp: { approval: -5 }, rel: 4, tip: 'Rätt metod. Fruktansvärt långsam.' },
      { text: 'GÅ UT OFFENTLIGT OCH KRÄV HENNE FRI', cost: { pp: 10 }, temp: { approval: 5, freedom: 3, income: -3 }, rel: -6, tip: 'Mikrofonen är ditt enda vapen.' },
    ],
  },
  {
    id: 'omv_border_posts', icon: '\u{1F6A7}', weight: 2,
    title: 'GRÄNSSTOLPARNA HAR FLYTTATS',
    text: 'En morgon står grannlandets gränsstolpar trehundra meter in på din sida, mitt i en bondes betesmark. Deras soldater säger att kartorna från förra seklet är fel.',
    when: (c) => c.claims <= 4 && c.st.milpower < 10 && !c.atWar,
    choices: [
      { text: 'SKICKA SOLDATER OCH FLYTTA TILLBAKA DEM', cost: { man: 4, pp: 10 }, temp: { readiness: 4, ideopower: 6 }, rel: -8, tip: 'Stolparna flyttas. Spänningen stannar kvar.' },
      { text: 'DRA FRÅGAN INFÖR INTERNATIONELL DOMSTOL', cost: { money: 300 }, temp: { statepower: -3 }, rel: 8, tip: 'Domen kommer om sju år. Bonden hinner gå i pension.' },
      { text: 'LÅT DET VARA, DET ÄR BARA EN BETESMARK', temp: { approval: -6, ideopower: -5, justtime: -5 }, tip: 'Trehundra meter i dag. Hur mycket i morgon?' },
    ],
  },
  {
    id: 'omv_river_dam', icon: '\u{1F30A}', weight: 2,
    title: 'DAMMEN UPPSTRÖMS',
    text: 'Grannlandet har börjat fylla en jättelik damm vid floden som rinner genom ditt land. Vattennivån nedströms sjunker redan och bönderna i dalgången oroar sig för skörden.',
    when: (c) => (c.ind.agri ?? 5) > 10 && !c.atWar && c.st.milpower < 20,
    choices: [
      { text: 'FÖRHANDLA FRAM ETT VATTENAVTAL', cost: { pp: 15, money: 300 }, temp: { factory: -3 }, rel: 8, tip: 'Ni delar floden. Och elen från dammen, mot betalning.' },
      { text: 'HOTA MED MILITÄRA KONSEKVENSER', cost: { pp: 20 }, temp: { ideopower: 6, readiness: 5, justtime: -8 }, rel: -12, tip: 'Floder har startat krig förr.' },
      { text: 'BYGG BEVATTNING OCH BYT GRÖDOR', cost: { money: 700 }, perm: { factory: 2 }, temp: { gdp: -2 }, tip: 'Mindre vatten, smartare fält.' },
      { text: 'LÅT BÖNDERNA KLARA SIG SJÄLVA', temp: { gdp: -5, approval: -5, unrest: 4 }, tip: 'Floden var aldrig din. Det märks nu.' },
    ],
  },
  {
    id: 'omv_disputed_islet', icon: '\u{1F3DD}\u{FE0F}', weight: 2,
    title: 'ÖN SOM BÅDA LÄNDERNA ÄGER',
    text: 'Kustbevakningen har bordat en främmande fiskebåt vid den lilla ön som både du och grannlandet gör anspråk på. Deras flotta har skickat ett fartyg för att hämta hem besättningen.',
    when: (c) => c.res('navy') >= 3 && c.st.milpower > 0 && !c.atWar,
    choices: [
      { text: 'STÅ PÅ DIG OCH STÄLL BESÄTTNINGEN INFÖR RÄTTA', cost: { pp: 15 }, temp: { ideopower: 8, approval: 4, readiness: 4 }, rel: -12, tip: 'Ön är vår. Det kostar att säga det högt.' },
      { text: 'SLÄPP DEM MED EN VARNING', temp: { ideopower: -4 }, rel: 6, tip: 'Ingen vann, ingen förlorade, alla fiskar vidare.' },
      { text: 'FÖRESLÅ GEMENSAM FÖRVALTNING AV FISKET', cost: { pp: 20, money: 300 }, temp: { income: 4, statepower: -3 }, rel: 12, tip: 'Fisken bryr sig inte om flaggor.' },
    ],
  },

  // ================= ALLIANSER =================
  {
    id: 'omv_alliance_dues', icon: '\u{1F6E1}\u{FE0F}', weight: 2,
    title: 'ALLIANSEN VILL SE PENGARNA',
    text: 'På försvarsalliansens toppmöte pekar de andra medlemmarna ut ditt land. Ni lägger mindre på försvaret än ni har lovat och åker snålskjuts på deras skydd.',
    when: (c) => c.allies > 0 && (c.ind.milx ?? 2) < 1.4,
    choices: [
      { text: 'HÖJ FÖRSVARSBUDGETEN KRAFTIGT', cost: { money: 1000 }, perm: { milpower: 6, readiness: 4 }, temp: { welfare: -3 }, rel: 10, tip: 'Generalerna jublar. Skolorna mindre.' },
      { text: 'LOVA MER, MEN SENARE', cost: { pp: 10 }, temp: { statepower: -2 }, rel: 2, tip: 'Det äldsta tricket i alliansboken.' },
      { text: 'VI BIDRAR PÅ ANDRA SÄTT', temp: { ideopower: 3 }, rel: -8, tip: 'Ni har tydligen skickat väldigt många broschyrer.' },
    ],
  },
  {
    id: 'omv_alliance_offer', icon: '\u{1F4DD}', weight: 2,
    title: 'ETT FÖRSVARSFÖRBUND KNACKAR PÅ',
    text: 'Ett regionalt försvarsförbund erbjuder ditt land medlemskap. Ni skulle få skydd av större arméer, men också lova att försvara länder ni knappt har handlat med.',
    when: (c) => c.allies === 0 && c.st.milpower < 10 && !c.is('globalism', 'isolationist'),
    choices: [
      { text: 'ANSÖK OM MEDLEMSKAP', cost: { pp: 25 }, perm: { milpower: 6 }, temp: { statepower: -4, justtime: 6 }, rel: 12, tip: 'Ni får vänner med stridsvagnar. Och deras fiender.' },
      { text: 'FÖRDJUPA SAMARBETET UTAN ATT GÅ MED', cost: { pp: 10 }, temp: { milpower: 3, readiness: 3 }, rel: 5, tip: 'Gemensamma övningar, separata garantier.' },
      { text: 'BEHÅLL NEUTRALITETEN', temp: { statepower: 3, ideopower: 3 }, tip: 'Ingen kan dra in er i något. Ingen kommer heller.' },
    ],
  },
  {
    id: 'omv_ally_spying', icon: '\u{1F4E1}', weight: 2,
    title: 'VÅR ALLIERADE AVLYSSNADE OSS',
    text: 'Läckta dokument visar att er närmaste allierade i flera år har avlyssnat dina ministrars telefoner. Deras ambassadör säger att det handlade om att skydda er.',
    when: (c) => c.allies > 0 && c.res('espionage') >= 3 && c.st.safety > 0,
    choices: [
      { text: 'KRÄV EN OFFENTLIG URSÄKT', cost: { pp: 15 }, temp: { ideopower: 6, approval: 5, milpower: -2 }, rel: -6, tip: 'Ursäkten kommer. Avlyssningen fortsätter nog.' },
      { text: 'BYGG EGNA KRYPTERADE NÄT', cost: { money: 600, rp: 40 }, perm: { safety: 4, statepower: 3 }, tip: 'Ingen lyssnar längre. Inte ens ni själva, i början.' },
      { text: 'LÅTSAS ATT INGET HAR HÄNT', temp: { approval: -5, freedom: -2 }, rel: 4, tip: 'Alla spionerar på alla. Ni är bara sämre på det.' },
    ],
  },

  // ================= HANDEL & GLOBALISM =================
  {
    id: 'omv_tariff_war', icon: '\u{1F4C9}', weight: 2,
    title: 'HANDELSKRIGET ÄR HÄR',
    text: 'Din största handelspartner har infört tullar på allt ni exporterar och kallar det ett svar på era egna handelshinder. Fabrikerna i exportorterna har redan börjat varsla.',
    when: (c) => c.is('globalism', 'protectionism', 'disengagement') || ((c.ind.tradebal ?? 0) > 12 && c.is('globalism', 'balanced', 'partner')),
    choices: [
      { text: 'SVARA MED LIKA HÖGA TULLAR', cost: { pp: 15 }, temp: { factory: 5, gdp: -6, income: -5, ideopower: 6 }, rel: -10, tip: 'Båda förlorar. Ni förlorar med flaggan i topp.' },
      { text: 'SÖK NYA MARKNADER', cost: { money: 600, pp: 10 }, temp: { income: -3 }, perm: { gdp: 2 }, rel: 4, tip: 'Säljarna packar väskorna. Det tar år.' },
      { text: 'GE EFTER OCH SÄNK ERA EGNA TULLAR', law: ['globalism', 'partner'], temp: { factory: -6, approval: -4 }, rel: 8, tip: 'Handeln återvänder. Fabriksägarna glömmer inte.' },
    ],
  },
  {
    id: 'omv_steel_dumping', icon: '\u{1F3ED}', weight: 2,
    title: 'BILLIGT STÅL VÄLLER IN',
    text: 'Ett utländskt stålverk säljer nu stål i ditt land billigare än det kostar att tillverka det. Kunderna jublar, men landets sista egna stålverk säger att det stänger före jul.',
    when: (c) => c.is('globalism', 'major', 'big', 'partner') && (c.ind.manuf ?? 10) > 10,
    choices: [
      { text: 'INFÖR ANTIDUMPNINGSTULLAR', cost: { pp: 15 }, temp: { factory: 6, income: -3 }, rel: -6, tip: 'Verket räddas. Bilarna blir lite dyrare.' },
      { text: 'KÖP IN STÅLVERKET I STATEN', cost: { money: 900 }, perm: { factory: 4 }, temp: { corruption: 3 }, tip: 'Nu äger ni ett stålverk. Grattis.' },
      { text: 'LÅT MARKNADEN AVGÖRA', temp: { factory: -8, unrest: 5, gdp: 3 }, tip: 'Billigt stål. Dyr arbetslöshet.' },
    ],
  },
  {
    id: 'omv_farmers_block_fta', icon: '\u{1F69C}', weight: 2,
    title: 'TRAKTORERNA BLOCKERAR MOTORVÄGEN',
    text: 'Frihandelsavtalet med ett stort jordbruksland ska ratificeras nästa vecka. Tusentals bönder har kört in i huvudstaden med sina traktorer och säger att billigt importkött kommer att knäcka dem.',
    when: (c) => c.is('globalism', 'major', 'big', 'partner') && (c.ind.agri ?? 5) > 4,
    choices: [
      { text: 'RATIFICERA AVTALET ÄNDÅ', temp: { gdp: 5, income: 4, unrest: 8, approval: -5 }, rel: 8, tip: 'Konsumenterna vinner lite. Bönderna förlorar mycket.' },
      { text: 'KÖP LUGN MED NYTT JORDBRUKSSTÖD', cost: { money: 800 }, temp: { gdp: 3, unrest: -3, income: -3 }, rel: 6, tip: 'Avtalet går igenom. Bönderna får betalt för att tycka om det.' },
      { text: 'SKJUT UPP RATIFICERINGEN', cost: { pp: 15 }, temp: { approval: 4 }, rel: -8, tip: 'Traktorerna åker hem. Förhandlarna gör det också, sura.' },
    ],
  },
  {
    id: 'omv_empty_shelves', icon: '\u{1F48A}', weight: 2,
    title: 'APOTEKEN HAR SLUT PÅ MEDICIN',
    text: 'Efter åren av avskildhet från omvärlden saknar apoteken insulin och antibiotika, och sjukhusens röntgenapparater står still i väntan på reservdelar. Sjukhusen ransonerar och svarta marknaden växer.',
    when: (c) => c.is('globalism', 'disengagement', 'isolationist') && c.day > 60,
    choices: [
      { text: 'ÖPPNA FÖR IMPORT AV MEDICIN', law: ['globalism', 'protectionism'], temp: { ideopower: -6, qol: 4 }, rel: 6, tip: 'Isoleringen får ett litet hål. Insulinet kommer in genom det.' },
      { text: 'BYGG EN EGEN LÄKEMEDELSINDUSTRI', cost: { money: 1200, rp: 60 }, perm: { factory: 3, hdi: 2 }, temp: { qol: -4 }, tip: 'Om några år har ni egen medicin. Fram till dess har ni tålamod.' },
      { text: 'SMUGGLA IN DET VIA ETT TREDJE LAND', cost: { money: 600 }, temp: { qol: 3, corruption: 5 }, tip: 'Mellanhänderna tar bra betalt för sin diskretion.' },
    ],
  },
  {
    id: 'omv_smugglers_border', icon: '\u{1F4B8}', weight: 2,
    title: 'SMUGGLARNA STYR GRÄNSORTERNA',
    text: 'Tullarna har gjort bränsle, cigaretter och elektronik så dyra att halva gränstrakten lever på smuggling. Tulltjänstemännen tar emot mutor öppet, och ligorna bygger sportplaner åt kommunerna.',
    when: (c) => c.is('globalism', 'protectionism', 'disengagement', 'isolationist') && c.st.corruption > 10,
    choices: [
      { text: 'SÄNK TULLARNA SÅ ATT SMUGGLINGEN INTE LÖNAR SIG', law: ['globalism', 'balanced'], temp: { factory: -4, corruption: -3 }, tip: 'Den bästa tullpolisen är ett lägre pris.' },
      { text: 'SKICKA IN GRÄNSPOLIS OCH MILITÄR', cost: { pp: 20, man: 5 }, temp: { safety: 6, unrest: 5, corruption: -5 }, tip: 'Ligorna flyttar några kilometer. Mutorna blir dyrare.' },
      { text: 'LÅT DET VARA, GRÄNSTRAKTEN HAR JOBB', temp: { corruption: 6, income: -4, approval: 2 }, tip: 'Den informella sektorn tackar för förtroendet.' },
    ],
  },
  {
    id: 'omv_trade_court', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'HANDELSDOMSTOLEN DÖMER MOT OSS',
    text: 'Världshandelsorganisationen har slagit fast att statens stöd till era stora bolag är otillåtna subventioner. Andra länder får nu lägga strafftullar på er export tills stöden tas bort.',
    when: (c) => c.is('ownership', 'nationalized', 'strategic') && !c.is('globalism', 'disengagement', 'isolationist') && (c.ind.exports ?? 30) > 25,
    choices: [
      { text: 'TA BORT STÖDEN', cost: { pp: 15 }, temp: { factory: -5, income: 3 }, rel: 8, tip: 'Konkurrensen blir rättvis. Era bolag gillar inte rättvisa.' },
      { text: 'BYT NAMN PÅ STÖDEN', cost: { money: 300 }, temp: { corruption: 3 }, rel: -3, tip: 'Det heter nu regionalt utvecklingsbidrag. Ingen luras.' },
      { text: 'STRUNTA I DOMEN', temp: { income: -6, statepower: 4 }, rel: -10, tip: 'Strafftullarna kommer. Stoltheten är kvar.' },
    ],
  },
  {
    id: 'omv_port_for_sale', icon: '\u{2693}', weight: 2,
    title: 'NÅGON VILL KÖPA HAMNEN',
    text: 'Ett statligt bolag från en stormakt vill köpa landets största hamn och bygga ut den till regionens viktigaste. Statsskulden skulle krympa direkt, men hamnen ligger mitt emot marinbasen.',
    when: (c) => (c.ind.debt ?? 57) > 70 && !c.is('ownership', 'nationalized'),
    choices: [
      { text: 'SÄLJ HAMNEN', res: { money: 1500 }, perm: { statepower: -5 }, temp: { milpower: -4 }, mod: 'foreign_investment', rel: 4, tip: 'Skulden krymper. Utsikten från marinbasen förändras.' },
      { text: 'HYR UT DEN PÅ NITTIONIO ÅR', res: { money: 700 }, perm: { statepower: -2 }, temp: { income: 4 }, tip: 'Hundra år är ingen evighet. Bara nästan.' },
      { text: 'SÄG NEJ OCH BYGG UT DEN SJÄLVA', cost: { money: 1000 }, perm: { income: 4, factory: 2 }, tip: 'Er hamn, er skuld.' },
    ],
  },

  // ================= SANKTIONER & PARIASTAT =================
  {
    id: 'omv_sanctions_bite', icon: '\u{1F6AB}', weight: 2,
    title: 'SANKTIONERNA BITER',
    text: 'Omvärldens sanktioner har stängt ute dina banker från det internationella betalsystemet. Importerade varor blir dyrare för varje vecka och flygbolaget kan inte längre köpa reservdelar.',
    when: (c) => c.ideo !== 'stratocracy' && c.mod('pariah') || (c.st.freedom < -40 && c.st.milpower > 20),
    choices: [
      { text: 'BYGG EN SKUGGEKONOMI MED VÄNLIGA REGIMER', cost: { money: 600, pp: 15 }, temp: { income: 5, corruption: 6 }, tip: 'Nya vänner, nya valutor, nya mellanhänder.' },
      { text: 'MÖT VÄRLDENS KRAV', cost: { pp: 30 }, unmod: 'pariah', temp: { ideopower: -10, statepower: -6 }, perm: { freedom: 3 }, rel: 15, tip: 'Sanktionerna lyfts. Hemma ser det ut som en kapitulation.' },
      { text: 'UTHÄRDA', temp: { qol: -6, income: -8, ideopower: 8, approval: 3 }, tip: 'Folket sluter upp. Hyllorna gör det inte.' },
    ],
  },
  {
    id: 'omv_image_lobbyists', icon: '\u{1F454}', weight: 2,
    title: 'EN PR-BYRÅ ERBJUDER SINA TJÄNSTER',
    text: 'En exklusiv utländsk PR-byrå erbjuder sig att tvätta landets rykte med artiklar i stora tidningar, betalda influerare och ett stort mästerskap som får världen att titta på något annat.',
    when: (c) => c.mod('pariah') || (c.st.freedom < -30 && (c.ind.voice ?? 0) < -0.8),
    choices: [
      { text: 'KÖP HELA PAKETET MED MÄSTERSKAP', cost: { money: 1500 }, temp: { approval: 6, ideopower: 5 }, rel: 10, tip: 'Världen tittar på arenan. Inte på fängelserna bakom den.' },
      { text: 'KÖP BARA ARTIKLARNA', cost: { money: 500 }, rel: 4, tip: 'Några kolumner. Lite mindre fientliga rubriker.' },
      { text: 'VI BEHÖVER INGEN VÄRLD SOM ÄLSKAR OSS', temp: { ideopower: 6 }, rel: -3, tip: 'Billigt. Och ärligt, på sitt sätt.' },
    ],
  },
  {
    id: 'omv_shadow_fleet', icon: '\u{1F6E2}\u{FE0F}', weight: 2,
    title: 'SKUGGFLOTTAN',
    text: 'Ett nätverk av rederier i skatteparadis erbjuder sig att frakta din export förbi sanktionerna i gamla tankfartyg utan försäkring. Det fungerar, men fartygen är i uselt skick.',
    when: (c) => c.mod('pariah') && (c.ind.exports ?? 30) > 20,
    choices: [
      { text: 'ANLITA SKUGGFLOTTAN', res: { money: 900 }, temp: { corruption: 5 }, rel: -8, tip: 'Pengarna kommer hem. Ett läckande fartyg är bara en tidsfråga.' },
      { text: 'KÖP EGNA FARTYG UNDER FRÄMMANDE FLAGG', cost: { money: 1000 }, perm: { income: 5 }, rel: -4, tip: 'Dyrare, säkrare och precis lika olagligt.' },
      { text: 'SÄLJ TILL GRANNARNA TILL REAPRIS', temp: { income: -4, gdp: -3 }, rel: 2, tip: 'Grannarna gör en kanonaffär. Ni gör en förlust.' },
    ],
  },
  {
    id: 'omv_join_sanctions', icon: '\u{1F4CB}', weight: 2,
    title: 'SKA VI SANKTIONERA GRANNEN?',
    text: 'Dina allierade inför hårda sanktioner mot ett grannland som har invaderat en tredje stat och kräver att ni är med. Problemet är att grannen är er största kund och levererar det mesta av er energi.',
    when: (c) => c.allies > 0 && c.is('un', 'member', 'important', 'head') && (c.ind.exports ?? 30) > 45,
    choices: [
      { text: 'INFÖR FULLA SANKTIONER', temp: { income: -10, gdp: -5, ideopower: 5 }, rel: 14, tip: 'Rätt sida av historien. Fel sida av elräkningen.' },
      { text: 'SANKTIONER MED UNDANTAG FÖR ENERGI', cost: { pp: 15 }, temp: { income: -4 }, rel: 4, tip: 'Alla förstår. Ingen är imponerad.' },
      { text: 'STÅ UTANFÖR', cost: { pp: 10 }, temp: { income: 4, statepower: 3 }, rel: -14, tip: 'Affärerna rullar på. Allianskamraterna antecknar.' },
    ],
  },

  // ================= INVESTERINGAR =================
  {
    id: 'omv_factory_bid', icon: '\u{1F3D7}\u{FE0F}', weight: 2,
    title: 'FABRIKEN SOM ALLA VILL HA',
    text: 'En utländsk batteritillverkare ska bygga regionens största fabrik och väljer mellan ditt land och grannlandet. Bolaget vill ha billig el, skattelättnader och snabba bygglov.',
    when: (c) => (c.ind.fdi ?? 2) > 3 && c.st.stability > 0,
    choices: [
      { text: 'GE DEM ALLT DE BER OM', cost: { money: 1200 }, mod: 'foreign_investment', temp: { factory: 6, income: -4 }, tip: 'Fabriken kommer. Så gör räkningen för subventionerna.' },
      { text: 'ERBJUD SNABBA BYGGLOV, MEN INGA PENGAR', cost: { pp: 15 }, temp: { factory: 3, corruption: 2 }, tip: 'Handläggarna får jobba nätter. Kanske räcker det.' },
      { text: 'LÅT GRANNEN TA DEN', temp: { approval: -4 }, tip: 'Ni sparade pengarna. Grannarna fick jobben.' },
    ],
  },
  {
    id: 'omv_investors_leave', icon: '\u{1F3C3}', weight: 2,
    title: 'INVESTERARNA PACKAR',
    text: 'Tre stora utländska bolag har på en vecka meddelat att de lämnar landet. De talar om osäkra regler och om att staten har börjat ta över företag, och fler sägs stå på tur.',
    when: (c) => (c.is('ownership', 'nationalized', 'strategic') || c.st.stability < -25) && (c.ind.fdi ?? 2) > 1.5,
    choices: [
      { text: 'GARANTERA ATT INGA FLER BOLAG TAS ÖVER', cost: { pp: 25 }, temp: { statepower: -5, income: 3 }, unmod: 'capital_flight', tip: 'Ett löfte på papper. Investerare läser det finstilta.' },
      { text: 'ERBJUD SKATTELÄTTNADER TILL DEM SOM STANNAR', cost: { money: 800 }, temp: { income: -3, gdp: 3 }, tip: 'De stannar. Och de vet nu att det lönar sig att hota.' },
      { text: 'LÅT DEM GÅ, VI KLARAR OSS SJÄLVA', mod: 'capital_flight', temp: { ideopower: 5, statepower: 4 }, tip: 'Det blir väldigt tyst i finanskvarteren.' },
    ],
  },
  {
    id: 'omv_sovereign_fund', icon: '\u{1F4B9}', weight: 2,
    title: 'EN STATSFOND VILL KÖPA TELEBOLAGET',
    text: 'En utländsk statlig investeringsfond vill köpa en stor del av landets största telebolag och betalar långt över börskursen. Säkerhetspolisen ber om ett möte innan du svarar.',
    when: (c) => c.is('ownership', 'mixed', 'privatized', 'full') && (c.ind.gdppc ?? 9600) > 20000 && c.res('espionage') >= 1,
    choices: [
      { text: 'GODKÄNN AFFÄREN', mod: 'foreign_investment', temp: { safety: -6, income: 4 }, tip: 'Bra pris. Någon annan har nu nycklarna till era samtal.' },
      { text: 'STOPPA AFFÄREN EFTER EN SÄKERHETSPRÖVNING', cost: { pp: 15 }, temp: { safety: 3 }, rel: -6, tip: 'Kronjuvelerna stannar hemma. Fonden investerar hos grannen.' },
      { text: 'LÅT STATEN KÖPA ANDELEN SJÄLV', cost: { money: 1200 }, perm: { statepower: 4, income: 2 }, tip: 'Ni bjuder över en stormakt. Med skattebetalarnas pengar.' },
    ],
  },

  // ================= BISTÅND & FLYKTINGAR =================
  {
    id: 'omv_famine_abroad', icon: '\u{1F33E}', weight: 2,
    title: 'SVÄLT PÅ ANDRA SIDAN JORDEN',
    text: 'Torka och inbördeskrig har lett till svält i ett fattigt land på en annan kontinent. Bilderna på uttorkade brunnar och köer till nödutdelningen visas i varje nyhetssändning.',
    when: (c) => (c.ind.gdppc ?? 9600) > 25000 && c.money > 600 && c.day > 150,
    choices: [
      { text: 'FLYG IN NÖDHJÄLP DIREKT', cost: { money: 900, man: 3 }, temp: { approval: 5 }, rel: 16, tip: 'Dyrt, snabbt och synligt från rymden.' },
      { text: 'SKÄNK ÖVERSKOTTET FRÅN VÅRA LAGER', cost: { money: 300 }, temp: { gdp: 1 }, rel: 8, tip: 'Era bönder får avsättning. Deras bönder får konkurrens.' },
      { text: 'HÖJ BISTÅNDSBUDGETEN PERMANENT', cost: { pp: 20 }, perm: { income: -3 }, temp: { ideopower: 3 }, rel: 12, tip: 'Färre rubriker, längre verkan.' },
      { text: 'DET ÄR INTE VÅRT ANSVAR', temp: { approval: -3 }, rel: -8, tip: 'Statsbudgeten tackar. Ingen annan gör det.' },
    ],
  },
  {
    id: 'omv_aid_conditions', icon: '\u{1F4B5}', weight: 2,
    title: 'BISTÅNDET KOMMER MED VILLKOR',
    text: 'Givarländerna som betalar en stor del av din sjukvård och dina skolor har skrivit ett gemensamt brev. Fortsatt stöd förutsätter fria val, oberoende domstolar och fullt lika rättigheter för kvinnor.',
    when: (c) => (c.ind.gdppc ?? 9600) < 6000 && (c.st.freedom < 0 || c.is('equality', 'traditional', 'restricted')),
    choices: [
      { text: 'GENOMFÖR REFORMERNA', cost: { pp: 30 }, res: { money: 800 }, perm: { freedom: 5, corruption: -3 }, temp: { statepower: -6, stability: -3 }, rel: 10, tip: 'Pengarna fortsätter komma. Makten sprids ut.' },
      { text: 'LOVA REFORMER OCH SKJUT PÅ DEM', cost: { pp: 10 }, res: { money: 400 }, temp: { corruption: 3 }, rel: -3, tip: 'Givarna känner igen tricket. De betalar ändå en gång till.' },
      { text: 'TACKA NEJ TILL PENGARNA', temp: { welfare: -8, hdi: -4, ideopower: 8 }, rel: -6, tip: 'Stolt och fattigare.' },
    ],
  },
  {
    id: 'omv_migrants_as_weapon', icon: '\u{26FA}', weight: 2,
    title: 'GRANNEN SKICKAR BUSSAR MOT GRÄNSEN',
    text: 'Grannlandets regim har flugit in tusentals migranter från andra kontinenter och kör dem i bussar till din gräns. Budskapet är tydligt: ge efter i den pågående tvisten, annars kommer fler.',
    when: (c) => c.is('immigration', 'managed', 'points', 'restricted', 'closed', 'deportation') && c.day > 200 && c.st.stability < 20,
    choices: [
      { text: 'BYGG STÄNGSEL OCH SKICKA SOLDATER', cost: { money: 700, man: 5 }, temp: { safety: 5, approval: 4, freedom: -3 }, rel: -6, tip: 'Gränsen håller. Bilderna från den gör det inte.' },
      { text: 'TA EMOT DEM OCH PRÖVA VARJE ASYLSKÄL', cost: { money: 600 }, temp: { immigration: 8, unrest: 4 }, rel: 8, tip: 'Ni vägrar spela med i spelet. Det kostar ändå.' },
      { text: 'GE EFTER I TVISTEN', cost: { pp: 20 }, temp: { ideopower: -8, statepower: -5 }, tip: 'Bussarna vänder. Grannen har lärt sig något.' },
      { text: 'LÅT DET VÄRKA UT', mod: 'border_crisis', temp: { unrest: 5 }, rel: -4, tip: 'Människor fastnar i ingenmansland medan vintern kommer.' },
    ],
  },
  {
    id: 'omv_refugee_quota', icon: '\u{1F9F3}', weight: 2,
    title: 'FN BER OSS TA EMOT KVOTFLYKTINGAR',
    text: 'FN:s flyktingorgan har tusentals människor i läger som aldrig kan återvända hem och ber ditt land ta emot en andel. Kommunerna har redan börjat räkna på bostäder och skolplatser.',
    when: (c) => c.is('un', 'member', 'important', 'head') && c.is('immigration', 'humanitarian', 'open', 'relaxed', 'balanced') && c.st.integration > 5,
    choices: [
      { text: 'TA EMOT EN STOR KVOT', cost: { money: 700 }, temp: { immigration: 10, integration: -4, manpower: 3 }, rel: 12, tip: 'Ni gör mer än er del. Bostadskön blir längre.' },
      { text: 'TA EMOT EN LITEN KVOT', cost: { money: 250 }, temp: { immigration: 3 }, rel: 4, tip: 'Lagom mycket solidaritet.' },
      { text: 'BETALA FÖR LÄGREN I STÄLLET', cost: { money: 500 }, temp: { welfare: -1 }, rel: 6, tip: 'Hjälpen gör nytta. På behörigt avstånd.' },
      { text: 'SÄG NEJ DEN HÄR GÅNGEN', temp: { integration: 2 }, rel: -6, tip: 'Kommunerna andas ut. FN antecknar.' },
    ],
  },
  {
    id: 'omv_exiled_scholars', icon: '\u{1F4DA}', weight: 2,
    title: 'FORSKARE PÅ FLYKT SÖKER SKYDD',
    text: 'Efter en kupp i ett land långt borta har hundratals forskare och läkare sparkats från sina universitet. Många söker asyl, och flera av dem är världsledande inom sina fält.',
    when: (c) => c.st.freedom > 20 && c.st.research > 0,
    choices: [
      { text: 'ERBJUD DEM ALLA ASYL OCH EN TJÄNST', cost: { money: 600 }, perm: { research: 4 }, temp: { immigration: 3 }, rel: 4, tip: 'Deras förlust blir er vinst. Kuppmakarna är inte glada.' },
      { text: 'ERBJUD ASYL, MEN INGA SÄRSKILDA TJÄNSTER', temp: { immigration: 2, research: 2 }, rel: 2, tip: 'Världsledande kemister kör nu taxi.' },
      { text: 'HÅLL DÖRREN STÄNGD', temp: { statepower: 2 }, rel: -4, tip: 'Grannlandet tar dem. Och deras patent.' },
    ],
  },

  // ================= RIKET: PROVINSERNA =================
  {
    id: 'omv_province_autonomy', icon: '\u{1F4DC}', weight: 2,
    title: 'PROVINSERNA VILL STYRA SIG SJÄLVA',
    text: 'Ledarna i de erövrade provinserna har gått samman och kräver ett eget parlament, egen polis och rätt att behålla hälften av skatterna. Annars, säger de, kan de inte garantera lugnet.',
    when: (c) => c.claims >= 3 && c.st.integration < -10 && c.st.unrest > 0,
    choices: [
      { text: 'GE DEM ETT EGET PARLAMENT', cost: { pp: 25 }, perm: { integration: 6 }, temp: { statepower: -8, unrest: -8 }, tip: 'Lugnet köps med makt. Makt kommer sällan tillbaka.' },
      { text: 'ERBJUD MER PENGAR I STÄLLET FÖR MER MAKT', cost: { money: 900 }, temp: { unrest: -5, integration: 3, income: -3 }, tip: 'De tar pengarna. Och frågar igen nästa år.' },
      { text: 'AVVISA KRAVET', temp: { statepower: 5, unrest: 8, integration: -5 }, tip: 'Riket förblir odelat. På papperet.' },
    ],
  },
  {
    id: 'omv_province_uprising', icon: '\u{1F3F4}', weight: 2,
    title: 'UPPROR I DEN ERÖVRADE PROVINSEN',
    text: 'Beväpnade grupper har tagit kontroll över flera städer i en av provinserna du erövrade. Guvernören har flytt till huvudstaden och upprorets ledare har utropat en egen republik.',
    when: (c) => c.claims >= 6 && c.st.unrest > 25 && c.st.integration < 10,
    choices: [
      { text: 'SLÅ NER UPPRORET', cost: { man: 10, pp: 20 }, temp: { unrest: -10, freedom: -6, milpower: -5, approval: -3 }, rel: -8, tip: 'Städerna återtas. Sympatierna gör det inte.' },
      { text: 'FÖRHANDLA MED UPPRORETS LEDARE', cost: { pp: 25 }, temp: { unrest: -8, statepower: -8 }, perm: { integration: 4 }, tip: 'Du gör en rebell till en politiker. Ibland fungerar det.' },
      { text: 'DRA TILLBAKA OCH LÅT PROVINSEN STYRA SIG SJÄLV', temp: { statepower: -12, approval: -6, unrest: -6, ideopower: -8 }, perm: { income: -3 }, rel: 6, tip: 'Flaggan sitter kvar på kartan. Inte på rådhuset.' },
    ],
  },
  {
    id: 'omv_province_language', icon: '\u{1F5E3}\u{FE0F}', weight: 2,
    title: 'PROVINSERNA VILL BEHÅLLA SITT SPRÅK',
    text: 'I provinserna du har lagt under dig talar de flesta ett annat språk än i huvudstaden. Nu vägrar lärarna där att undervisa på rikets språk, och föräldrarna står bakom dem.',
    when: (c) => c.claims >= 5 && c.st.integration < -10 && !c.is('culture', 'multi'),
    choices: [
      { text: 'GÖR DERAS SPRÅK OFFICIELLT I PROVINSEN', cost: { pp: 15 }, perm: { integration: 5 }, temp: { ideopower: -5, statepower: -3 }, tip: 'Två språk på varje skylt. Ett rike som rymmer båda.' },
      { text: 'TVÅSPRÅKIGA SKOLOR MED STATLIGA PENGAR', cost: { money: 700 }, perm: { integration: 4 }, temp: { unrest: -3 }, tip: 'Barnen lär sig båda. Föräldrarna grälar om vilket som kommer först.' },
      { text: 'RIKETS SPRÅK GÄLLER ÖVERALLT', temp: { unrest: 8, integration: -6, ideopower: 6 }, tip: 'Ett språk, ett rike. Och en hel generation som minns det.' },
    ],
  },
  {
    id: 'omv_realm_too_big', icon: '\u{1F9ED}', weight: 2,
    title: 'RIKET ÄR FÖR STORT ATT STYRA',
    text: 'Det tar veckor för besluten från huvudstaden att nå de yttersta provinserna, och vägarna dit är så dåliga att varor och tjänstemän fastnar på vägen. Lokala chefer har börjat fatta egna beslut.',
    when: (c) => c.claims >= 10 && c.res('logistics') < 3,
    choices: [
      { text: 'BYGG VÄGAR OCH JÄRNVÄGAR GENOM HELA RIKET', cost: { money: 1500 }, perm: { integration: 4, factory: 3, statepower: 3 }, tip: 'Tåget tar dig hela vägen. Om tio år.' },
      { text: 'DELA RIKET I REGIONER MED EGNA GUVERNÖRER', cost: { pp: 20 }, perm: { statepower: -4 }, temp: { stability: 5, corruption: 4 }, tip: 'Snabbare beslut. Fler som fattar dem för egen räkning.' },
      { text: 'DIGITALISERA FÖRVALTNINGEN', cost: { money: 600, rp: 50 }, perm: { corruption: -3, statepower: 3 }, tip: 'Ett formulär på nätet når de yttersta öarna. Där det finns nät.' },
      { text: 'LÅT PROVINSERNA SKÖTA SIG SJÄLVA', temp: { statepower: -6, corruption: 5 }, tip: 'Riket ser stort ut på kartan. I verkligheten hänger det löst.' },
    ],
  },
  {
    id: 'omv_governor_king', icon: '\u{1F934}', weight: 2,
    title: 'GUVERNÖREN HAR BLIVIT KUNG',
    text: 'Guvernören i en avlägsen provins har fyllt alla poster med sina släktingar, behåller tullintäkterna själv och har låtit resa en staty av sig själv på torget. Han svarar inte längre i telefon.',
    when: (c) => c.claims >= 6 && c.st.corruption > 15,
    choices: [
      { text: 'AVSÄTT HONOM OCH SKICKA EN REVISOR', cost: { pp: 20 }, perm: { corruption: -4, statepower: 3 }, temp: { unrest: 4 }, tip: 'Den nya guvernören svarar i telefon. Än så länge.' },
      { text: 'LÅT HONOM BEHÅLLA POSTEN MOT EN ANDEL', res: { money: 500 }, perm: { corruption: 5 }, temp: { statepower: -3 }, tip: 'Han betalar för sin frihet. Andra guvernörer tar efter.' },
      { text: 'SKICKA ARMÉN OCH STÄLL HONOM INFÖR RÄTTA', cost: { man: 6, pp: 15 }, perm: { corruption: -6 }, temp: { unrest: 6, stability: -3 }, tip: 'Ett exempel som syns i alla provinser.' },
    ],
  },

  // ================= RIKET: LYDSTATERNA =================
  {
    id: 'omv_puppet_wants_freedom', icon: '\u{1F513}', weight: 2,
    title: 'LYDSTATEN VILL BLI FRI',
    text: 'Parlamentet i en av dina lydstater har röstat för att säga upp avtalet med ditt rike. De vill ha egen utrikespolitik, egen armé och slippa betala tribut, och gatorna där är fulla av flaggor.',
    when: (c) => c.puppets > 0 && c.st.milpower < 0 && c.st.ideopower < 10,
    choices: [
      { text: 'KRÄV ATT BESLUTET RIVS UPP', cost: { pp: 20 }, temp: { statepower: 5, ideopower: 4 }, rel: -8, tip: 'De backar. Den här gången.' },
      { text: 'FÖRHANDLA FRAM ETT NYTT AVTAL MED MER SJÄLVSTYRE', cost: { pp: 15 }, temp: { income: -4, statepower: -3 }, rel: 6, tip: 'Mindre tribut, mer vänskap. Kanske.' },
      { text: 'SKICKA TRUPPER TILL GRÄNSEN', cost: { man: 8, money: 400 }, temp: { milpower: 3, readiness: 4, unrest: 3 }, rel: -14, tip: 'Ett budskap utan ord. Alla förstår det.' },
      { text: 'LÅT DEM GÅ I FRED', temp: { statepower: -8, ideopower: -6, income: -5 }, rel: 10, tip: 'Ni förlorar en lydstat och vinner kanske en granne.' },
    ],
  },
  {
    id: 'omv_puppet_protection', icon: '\u{1F4B0}', weight: 2,
    title: 'LYDSTATENS LEDARE VILL KÖPA SKYDD',
    text: 'Ledaren för en av dina lydstater erbjuder dubbel tribut om du lovar att hålla honom kvar vid makten. Oppositionen har vunnit valet där, och han tänker inte lämna ifrån sig nycklarna.',
    when: (c) => c.puppets > 0 && c.st.milpower > 10 && c.st.freedom < 20,
    choices: [
      { text: 'TA PENGARNA OCH HÅLL HONOM KVAR', res: { money: 1000 }, temp: { freedom: -3, corruption: 4 }, rel: -10, tip: 'Lydstaten blir lydigare. Och fattigare på demokrati.' },
      { text: 'LÅT VALRESULTATET GÄLLA', temp: { statepower: -4, income: -3 }, rel: 10, tip: 'Den nya ledaren minns vem som höll sig undan. Kanske tacksamt.' },
      { text: 'ERSÄTT HONOM MED NÅGON SOM VI VÄLJER', cost: { pp: 25 }, temp: { statepower: 5, ideopower: 3 }, rel: -6, tip: 'Varken han eller väljarna fick som de ville. Det fick du.' },
    ],
  },
  {
    id: 'omv_puppet_tax', icon: '\u{1F4E5}', weight: 2,
    title: 'LYDSTATERNA FÅR BETALA MER',
    text: 'Skattkammaren föreslår att tributen från lydstaterna höjs kraftigt för att betala rikets försvar. Deras regeringar vågar inte säga nej, men på deras gator har de första protesterna börjat.',
    when: (c) => c.puppets >= 2 && c.st.income < 0,
    choices: [
      { text: 'HÖJ TRIBUTEN KRAFTIGT', perm: { income: 6 }, temp: { unrest: 4, ideopower: -3 }, rel: -10, tip: 'Pengarna kommer in. Hatet också.' },
      { text: 'HÖJ DEN LITE, MOT HANDELSFÖRDELAR', cost: { pp: 15 }, perm: { income: 3 }, temp: { gdp: 2 }, rel: -3, tip: 'Alla förlorar lite och vinner lite. Det kallas diplomati.' },
      { text: 'INVESTERA I LYDSTATERNA I STÄLLET', cost: { money: 800 }, perm: { income: 2 }, temp: { statepower: 3 }, rel: 8, tip: 'Rikare lydstater betalar mer. Om tio år.' },
    ],
  },

  // ================= RIKET: HISTORIA, SYMBOLER & OMVÄRLDEN =================
  {
    id: 'omv_colonial_reckoning', icon: '\u{1F5BC}\u{FE0F}', weight: 2,
    title: 'DE KRÄVER UPPRÄTTELSE',
    text: 'Historiker har grävt fram hur ditt rike plundrade de erövrade områdena förr i tiden. Nu kräver provinsernas företrädare en officiell ursäkt, ersättning och att museets skatter skickas tillbaka.',
    when: (c) => (c.claims >= 6 || c.puppets >= 2) && c.st.freedom > 20,
    choices: [
      { text: 'BE OM URSÄKT OCH BETALA ERSÄTTNING', cost: { money: 1000 }, perm: { integration: 6 }, temp: { ideopower: -5 }, rel: 10, tip: 'Ett dyrt ord. Det kanske läker något.' },
      { text: 'SKICKA TILLBAKA SKATTERNA FRÅN MUSEET', cost: { pp: 15 }, perm: { integration: 3 }, temp: { approval: -2 }, rel: 6, tip: 'Montrarna står tomma. Någon annanstans fylls de.' },
      { text: 'DET FÖRFLUTNA ÄR FÖRFLUTET', temp: { integration: -5, ideopower: 4, unrest: 3 }, rel: -6, tip: 'Historien glömmer inte bara för att du gör det.' },
    ],
  },
  {
    id: 'omv_divided_land', icon: '\u{1F9E9}', weight: 2,
    title: 'DEN ANDRA HALVAN VILL ÅTERFÖRENAS',
    text: 'Landet du delade vid erövringen lever kvar som en självständig rest på andra sidan den nya gränsen. Dess regering kräver att de båda delarna får återförenas, och folket i din del håller med.',
    when: (c) => c.claims >= 2 && c.claims <= 6 && c.st.stability > 0 && c.day > 200,
    choices: [
      { text: 'ERBJUD DEM ATT ÅTERFÖRENAS UNDER DIN FLAGGA', cost: { pp: 30 }, temp: { ideopower: 6, integration: 4, justtime: -6 }, rel: -10, tip: 'Återförening, fast åt fel håll, tycker de.' },
      { text: 'ÖPPNA GRÄNSEN FÖR FRI RÖRLIGHET', cost: { money: 500 }, perm: { integration: 4 }, temp: { safety: -3 }, rel: 6, tip: 'Familjer kan äntligen fira högtiderna ihop. Smugglarna också.' },
      { text: 'STÄNG GRÄNSEN HÅRDARE', cost: { man: 4 }, temp: { safety: 4, unrest: 6, integration: -6 }, rel: -6, tip: 'En mur löser problemet i trettio år. Ungefär.' },
      { text: 'IGNORERA KRAVET', temp: { integration: -4, unrest: 3 }, tip: 'Tystnad är också ett svar. Ett dåligt.' },
    ],
  },
  {
    id: 'omv_imperial_capital', icon: '\u{1F3F0}', weight: 1,
    title: 'EN NY HUVUDSTAD FÖR RIKET?',
    text: 'Den gamla huvudstaden ligger långt ut i ena hörnet av ett rike som har vuxit åt alla håll. Arkitekterna föreslår en helt ny huvudstad mitt i riket, byggd från grunden på obebyggd mark.',
    when: (c) => c.claims >= 8 && c.st.statepower > 10,
    choices: [
      { text: 'BYGG DEN NYA HUVUDSTADEN', cost: { money: 2000, pp: 20 }, perm: { integration: 6, statepower: 6 }, temp: { approval: -4 }, tip: 'Breda avenyer, tomma kontor och ett rike med en ny mittpunkt.' },
      { text: 'FLYTTA NÅGRA MYNDIGHETER TILL PROVINSERNA', cost: { money: 600 }, perm: { integration: 3 }, temp: { statepower: -2 }, tip: 'Ämbetsmännen klagar. Provinserna får jobb.' },
      { text: 'HUVUDSTADEN LIGGER DÄR DEN ALLTID HAR LEGAT', temp: { integration: -3, ideopower: 3 }, tip: 'Traditionen vinner. Provinserna får fortsätta resa långt.' },
    ],
  },
  {
    id: 'omv_imperial_flag', icon: '\u{1F3BA}', weight: 2,
    title: 'RIKETS FLAGGA OCH NATIONALSÅNG',
    text: 'Provinserna har aldrig känt sig hemma under huvudstadens flagga och sjunger inte med i nationalsången. En kommission föreslår nya rikssymboler där varje provins får ett eget fält och en egen vers.',
    when: (c) => c.claims >= 5 && c.st.integration < 0 && c.harmony > 0.4,
    choices: [
      { text: 'NY FLAGGA OCH NY SÅNG FÖR HELA RIKET', cost: { pp: 20 }, perm: { integration: 6 }, temp: { ideopower: -4, approval: -3 }, tip: 'Provinserna sjunger med. De äldre i huvudstaden gör det inte.' },
      { text: 'BEHÅLL FLAGGAN, LÄGG TILL PROVINSERNAS VAPEN', cost: { money: 300 }, perm: { integration: 3 }, tip: 'Lite mer plats på flaggan. Lite mer plats i riket.' },
      { text: 'EN FLAGGA, ETT FOLK', temp: { ideopower: 6, integration: -4 }, tip: 'Samma tyg som alltid. Samma tystnad i provinserna.' },
    ],
  },
  {
    id: 'omv_imperial_census', icon: '\u{1F4CA}', weight: 2,
    title: 'FOLKRÄKNINGEN VISAR EN NY MAJORITET',
    text: 'Rikets första stora folkräkning visar att de som talar huvudstadens språk nu är en minoritet i sitt eget rike. Siffrorna har läckt ut, och debatten om vem riket egentligen tillhör har börjat.',
    when: (c) => c.claims >= 10 && c.st.integration < 0,
    choices: [
      { text: 'GE PROVINSERNA FLER PLATSER I PARLAMENTET', cost: { pp: 25 }, perm: { integration: 6, freedom: 2 }, temp: { statepower: -5, approval: -4 }, tip: 'Riket ser ut som sitt folk. Den gamla eliten ser sur ut.' },
      { text: 'HEMLIGSTÄMPLA RAPPORTEN', mod: 'cover_up', temp: { statepower: 3, freedom: -2 }, tip: 'Ingen vet. Alla vet.' },
      { text: 'UPPMUNTRA INFLYTTNING FRÅN KÄRNLANDET', cost: { money: 800 }, temp: { integration: -5, unrest: 5, ideopower: 5 }, rel: -6, tip: 'Ett beprövat imperiegrepp. Det har aldrig gjort någon älskad.' },
    ],
  },
  {
    id: 'omv_coalition_against', icon: '\u{26A0}\u{FE0F}', weight: 2,
    title: 'GRANNARNA SLUTER SIG SAMMAN',
    text: 'Ditt rike har vuxit så snabbt att grannländerna har undertecknat en gemensam försvarspakt riktad mot dig. Deras arméer övar nu tillsammans längs dina gränser.',
    when: (c) => c.claims >= 8 && c.st.milpower > 10,
    choices: [
      { text: 'LUGNA DEM MED ETT FÖRDRAG OM ICKE-ANGREPP', cost: { pp: 25 }, temp: { justtime: 10, ideopower: -4 }, rel: 14, tip: 'Pakten blir kvar. Övningarna blir färre.' },
      { text: 'SPLITTRA KOALITIONEN MED HANDELSAVTAL', cost: { money: 1000 }, temp: { income: 3 }, rel: 8, tip: 'Den svagaste länken säljer sig billigast.' },
      { text: 'RUSTA UPP VID GRÄNSERNA', cost: { money: 800, man: 6 }, temp: { milpower: 8, readiness: 8 }, rel: -10, tip: 'Rustning mot rustning. Historien känner igen mönstret.' },
      { text: 'VISA ATT VI INTE BRYR OSS', temp: { ideopower: 5, readiness: -3 }, rel: -6, tip: 'De övar vidare. Du låtsas att du inte tittar.' },
    ],
  },
  {
    id: 'omv_provincial_elite', icon: '\u{1F3A9}', weight: 2,
    title: 'PROVINSENS GAMLA ELIT ERBJUDER LOJALITET',
    text: 'De gamla mäktiga familjerna i en erövrad provins erbjuder sig att stödja ditt styre och hålla ordning bland sina egna. I gengäld vill de behålla sina gods, sina domstolar och få platser i rikets regering.',
    when: (c) => c.claims >= 3 && c.st.integration < 5 && c.st.statepower > 0 && c.st.stability > -10,
    choices: [
      { text: 'GE DEM PLATSER I REGERINGEN', cost: { pp: 20 }, perm: { integration: 5 }, temp: { corruption: 4, unrest: -5 }, tip: 'De styr provinsen åt dig. Och åt sig själva.' },
      { text: 'TA EMOT STÖDET, MEN BEHÅLL DOMSTOLARNA', cost: { pp: 10 }, perm: { integration: 3 }, temp: { unrest: -2 }, tip: 'Halva makten åt dem, halva lojaliteten åt dig.' },
      { text: 'VI BEHÖVER INGA GAMLA FAMILJER', temp: { integration: -3, statepower: 3, freedom: 2 }, tip: 'Rättvist. De letar upp någon annan att stödja.' },
    ],
  },
  {
    id: 'omv_annexation_unrecognized', icon: '\u{1F5FA}\u{FE0F}', weight: 2,
    title: 'VÄRLDEN ERKÄNNER INTE ERÖVRINGEN',
    text: 'FN:s generalförsamling har med stor majoritet röstat för att inte erkänna dina senaste erövringar. Kartor i andra länder visar fortfarande de gamla gränserna och flygbolagen undviker de nya provinserna.',
    when: (c) => c.claims >= 3 && c.atWar && !c.is('un', 'none'),
    choices: [
      { text: 'HÅLL EN FOLKOMRÖSTNING I PROVINSERNA', cost: { money: 600, pp: 15 }, temp: { integration: 3, corruption: 3 }, rel: 2, tip: 'Valurnorna bevakas av soldater. Resultatet blir därefter.' },
      { text: 'ERBJUD EN FN-ÖVERVAKAD ÖVERGÅNGSFÖRVALTNING', cost: { pp: 25 }, temp: { statepower: -6, ideopower: -5 }, rel: 14, tip: 'Legitimitet lånad av andra. På deras villkor.' },
      { text: 'KARTOR ÄR BARA PAPPER', temp: { ideopower: 5, income: -4 }, rel: -10, tip: 'Gränserna står där de står. Turisterna kommer inte.' },
    ],
  },
];
