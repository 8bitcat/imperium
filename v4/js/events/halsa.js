// IMPERIUM V5.6 — HÄNDELSER: VÄLFÄRD, HÄLSA & BEFOLKNING.
// Epidemier, vården och dess köer, livslängd, åldrande, födelsetal, fattigdom, bostäder, beroenden, vatten och hunger - i rika och fattiga länder.
export const EVENTS = [

  // ================= EPIDEMIER OCH SMITTA =================
  {
    id: 'hal_pandemic', icon: '\u{1F637}', weight: 2, cooldown: 900,
    title: 'PANDEMIN HAR NÅTT OSS',
    text: 'Ett nytt luftvägsvirus sprider sig över världen och de första fallen har bekräftats vid flygplatsen i huvudstaden. Smittskyddsläkarna vill ha besked i dag, inte i morgon.',
    when: (c) => c.day > 200 && !c.mod('epidemic') && (c.ind.tourists ?? 900000) > 3000000,
    choices: [
      { text: 'STÄNG NER SAMHÄLLET I SEX VECKOR', cost: { pp: 30 }, temp: { factory: -12, income: -10, freedom: -8, qol: -5 }, tip: 'Smittan stannar. Det gör allt annat också.' },
      { text: 'TESTA, SPÅRA OCH ISOLERA', cost: { money: 900, rp: 30 }, temp: { income: -4, safety: 4 }, tip: 'Dyrt och mödosamt. Fungerar om alla håller i.' },
      { text: 'STÄNG GRÄNSERNA FÖR ALLA RESENÄRER', cost: { pp: 15 }, temp: { immigration: -12, gdp: -6, approval: 4 }, rel: -5, tip: 'Viruset är troligen redan här. Turisterna är det inte.' },
      { text: 'HÅLL ÖPPET OCH LITA PÅ FOLKETS OMDÖME', temp: { approval: 3 }, mod: 'epidemic', tip: 'Ekonomin rullar. Sjukhusen får se hur det går.' },
    ],
  },
  {
    id: 'hal_hospitals_full', icon: '\u{1F3E5}', weight: 3,
    title: 'SJUKHUSEN ÄR FULLA',
    text: 'Intensivvårdsplatserna är slut och patienter flygs mellan regionerna. Personalen har arbetat dubbla pass i veckor och de första läkarna har börjat sjukskriva sig.',
    when: (c) => c.mod('epidemic'),
    choices: [
      { text: 'BYGG FÄLTSJUKHUS MED HJÄLP AV ARMÉN', cost: { money: 700, man: 8 }, temp: { qol: 6, approval: 6, readiness: -8 }, tip: 'Tälten står uppe på tre dagar. Övningarna får vänta.' },
      { text: 'SKJUT UPP ALLA PLANERADE OPERATIONER', temp: { qol: -8, hdi: -3 }, tip: 'Höftlederna får vänta. Igen.' },
      { text: 'BE GRANNLÄNDERNA TA EMOT PATIENTER', cost: { pp: 15 }, temp: { qol: 4, approval: -3 }, rel: -3, tip: 'Solidaritet har ett pris. Det heter tacksamhetsskuld.' },
      { text: 'KALLA IN PENSIONERADE SJUKSKÖTERSKOR', cost: { money: 400 }, temp: { qol: 4, welfare: 2 }, tip: 'De kommer. De vet precis vad som väntar.' },
    ],
  },
  {
    id: 'hal_vaccine_ready', icon: '\u{1F489}', weight: 3,
    title: 'VACCINET ÄR KLART',
    text: 'Landets forskare har tagit fram ett vaccin som klarat alla prövningar. Fabrikerna kan börja fylla doser i morgon - men inte till alla på en gång.',
    when: (c) => c.mod('epidemic') && c.res('healthcare') >= 3,
    choices: [
      { text: 'GRATIS VACCIN TILL ALLA, ÄLDST FÖRST', cost: { money: 900 }, unmod: 'epidemic', temp: { approval: 10, qol: 5 }, tip: 'Ordning, kö och ett litet stick i armen.' },
      { text: 'GÖR VACCINATIONEN OBLIGATORISK', cost: { pp: 25 }, unmod: 'epidemic', temp: { freedom: -10, unrest: 6 }, tip: 'Snabbast. Inte populärast.' },
      { text: 'DELA RECEPTET FRITT MED HELA VÄRLDEN', cost: { money: 900 }, unmod: 'epidemic', temp: { income: -5 }, rel: 12, tip: 'Inga licensintäkter, men väldigt många nya vänner.' },
      { text: 'SÄLJ DOSERNA TILL HÖGSTBJUDANDE LAND', res: { money: 1400 }, temp: { approval: -12 }, rel: -6, tip: 'Kassan sväller. Smittan stannar kvar hemma.' },
    ],
  },
  {
    id: 'hal_vaccine_doubt', icon: '\u{1F4F1}', weight: 2,
    title: 'VACCINMOTSTÅNDET VÄXER',
    text: 'Allt färre föräldrar låter vaccinera sina barn. I sociala medier sprids filmer om farliga sprutor, och barnläkarna varnar för att gamla barnsjukdomar kan komma tillbaka.',
    when: (c) => (c.ind.internet ?? 80) > 80 && c.st.approval < -10,
    choices: [
      { text: 'GÖR VACCIN TILL ETT KRAV FÖR FÖRSKOLEPLATS', cost: { pp: 20 }, perm: { hdi: 3 }, temp: { freedom: -6, unrest: 5 }, tip: 'Effektivt. Upprör de som redan var upprörda.' },
      { text: 'SKICKA SJUKSKÖTERSKOR HEM TILL FAMILJERNA', cost: { money: 500 }, perm: { hdi: 2 }, temp: { approval: 3 }, tip: 'Långsamt, vänligt och förvånansvärt effektivt.' },
      { text: 'TVINGA PLATTFORMARNA ATT TA BORT FILMERNA', cost: { pp: 15 }, temp: { freedom: -8, safety: 3 }, tip: 'Filmerna försvinner. Misstron flyttar till nästa app.' },
      { text: 'DET ÄR FÖRÄLDRARNAS VAL', temp: { freedom: 4 }, mod: 'epidemic', tip: 'Friheten består. Det gör mässlingen också.' },
    ],
  },
  {
    id: 'hal_cholera', icon: '\u{1F9A0}', weight: 2,
    title: 'KOLERA I KÅKSTÄDERNA',
    text: 'Efter regnperioden har kolera brutit ut i kåkstäderna runt huvudstaden. Brunnarna ligger för nära latrinerna och sjukstugorna har slut på vätskeersättning.',
    when: (c) => (c.ind.water ?? 70) < 50 && c.st.welfare < 10,
    choices: [
      { text: 'KLORERA BRUNNARNA OCH DELA UT VÄTSKEERSÄTTNING', cost: { money: 500 }, temp: { qol: 5, approval: 5 }, tip: 'Billigt, snabbt och livräddande.' },
      { text: 'BYGG ETT RIKTIGT AVLOPPSNÄT', cost: { money: 1400 }, perm: { qol: 6, hdi: 4 }, temp: { income: -4 }, tip: 'Ett decennium av grävande. Sedan aldrig mer.' },
      { text: 'BE INTERNATIONELLA HJÄLPORGANISATIONER KOMMA', cost: { pp: 10 }, temp: { qol: 3, statepower: -4 }, rel: 4, tip: 'Hjälpen kommer. Med egna flaggor på bilarna.' },
      { text: 'SPÄRRA AV DE DRABBADE OMRÅDENA', temp: { unrest: 8, freedom: -6 }, mod: 'epidemic', tip: 'Smittan ska stanna innanför. Det gör den sällan.' },
    ],
  },
  {
    id: 'hal_malaria', icon: '\u{1F99F}', weight: 2,
    title: 'MALARIASÄSONGEN HAR BÖRJAT',
    text: 'Regnen har kommit och med dem myggorna. Barnavdelningarna fylls av febersjuka barn, och apoteken på landsbygden har slut på malariamedicin.',
    when: (c) => (c.ind.u5mort ?? 13) > 40,
    choices: [
      { text: 'DELA UT MYGGNÄT TILL VARJE HUSHÅLL', cost: { money: 400 }, perm: { hdi: 3, qol: 2 }, tip: 'Ett av världens billigaste sätt att rädda liv.' },
      { text: 'BESPRUTA SUMPMARKERNA', cost: { money: 700 }, temp: { qol: 6, approval: 4 }, tip: 'Fungerar i år. Myggorna vänjer sig.' },
      { text: 'DELTA I DEN STORA VACCINSTUDIEN', cost: { rp: 40 }, perm: { research: 3, hdi: 2 }, rel: 4, tip: 'Framtidens medicin prövas på dina kliniker.' },
      { text: 'VÄNTA UT REGNPERIODEN', temp: { qol: -6, manpower: -4 }, tip: 'Den tar slut. Om några månader.' },
    ],
  },
  {
    id: 'hal_antibiotics', icon: '\u{1F9EB}', weight: 1,
    title: 'ANTIBIOTIKAN BITER INTE LÄNGRE',
    text: 'Sjukhusen rapporterar allt fler infektioner som inga antibiotika rår på. Bakterierna har lärt sig, och läkemedelsbolagen tycker inte att nya preparat lönar sig.',
    when: (c) => c.day > 200 && c.res('healthcare') >= 2 && (c.ind.beds ?? 2.5) > 4,
    choices: [
      { text: 'BETALA BOLAGEN FÖR ATT FORSKA FRAM NYA', cost: { money: 800, rp: 40 }, perm: { research: 4, hdi: 2 }, tip: 'Staten köper en försäkring den hoppas aldrig behöva.' },
      { text: 'STRÄNGA REGLER FÖR FÖRSKRIVNING', cost: { pp: 15 }, perm: { hdi: 3 }, temp: { approval: -4 }, tip: 'Halsflussen får gå över av sig själv.' },
      { text: 'FÖRBJUD ANTIBIOTIKA I DJURFODER', cost: { pp: 20 }, perm: { hdi: 3 }, temp: { factory: -6 }, tip: 'Bönderna rasar. Bakterierna också, fast tyst.' },
      { text: 'DET ÄR ETT PROBLEM FÖR FRAMTIDEN', perm: { hdi: -3 }, tip: 'Framtiden kommer alltid tidigare än man tror.' },
    ],
  },

  // ================= VÅRDEN, LÄKARNA OCH KÖERNA =================
  {
    id: 'hal_care_queues', icon: '\u{23F3}', weight: 2,
    title: 'VÅRDKÖERNA VÄXER',
    text: 'Väntetiden för en höftoperation har passerat ett år, och akutmottagningarna har patienter i väntrummet över natten. Vården är gratis, men den kommer inte i tid.',
    when: (c) => c.is('healthcare', 'fullyfree', 'free') && (c.ind.old ?? 9) > 10,
    choices: [
      { text: 'BETALA REGIONERNA FÖR KORTARE KÖER', cost: { money: 1000 }, temp: { qol: 8, approval: 8, income: -4 }, tip: 'Köerna krymper. Statistiken blir snyggare än verkligheten.' },
      { text: 'LÅT PRIVATA KLINIKER TA HAND OM KÖERNA', cost: { pp: 20 }, law: ['healthcare', 'mixedprices'], temp: { qol: 5, approval: -6 }, tip: 'Snabbare vård för den som har en försäkring.' },
      { text: 'PRIORITERA EFTER BEHOV, INTE EFTER KÖPLATS', cost: { pp: 10 }, temp: { qol: 3, approval: -4 }, tip: 'Rättvist. Den som väntar längst blir inte gladare.' },
      { text: 'LÅT KÖERNA VARA', temp: { approval: -6, qol: -4 }, tip: 'Gratis vård. Någon gång.' },
    ],
  },
  {
    id: 'hal_doctor_shortage', icon: '\u{1FA7A}', weight: 2,
    title: 'LÄKARNA RÄCKER INTE TILL',
    text: 'På landsbygden går det en läkare på flera tiotusen invånare. Gravida kvinnor reser i dagar för att nå närmaste sjukhus, och de få läkare som finns arbetar i huvudstaden.',
    when: (c) => (c.ind.doctors ?? 2) < 0.4,
    choices: [
      { text: 'STARTA TRE NYA LÄKARUTBILDNINGAR', cost: { money: 1000, rp: 30 }, perm: { hdi: 5, qol: 3 }, tip: 'Den första kullen är klar om sex år.' },
      { text: 'UTBILDA BYAHÄLSOARBETARE PÅ SEX MÅNADER', cost: { money: 400 }, perm: { qol: 3, hdi: 2 }, tip: 'Inte läkare, men nästan alltid bättre än ingenting.' },
      { text: 'HYR IN LÄKARE FRÅN ETT VÄNSKAPLIGT LAND', cost: { pp: 15 }, temp: { qol: 5, approval: 3 }, rel: 3, tip: 'De är skickliga. Och de skriver rapporter hem.' },
      { text: 'DEN SOM VILL HA VÅRD FÅR ÅKA TILL STADEN', temp: { qol: -4, approval: -4 }, tip: 'En bussbiljett är billigare än ett sjukhus.' },
    ],
  },
  {
    id: 'hal_nurse_strike', icon: '\u{1F469}\u{200D}\u{2695}\u{FE0F}', weight: 2,
    title: 'SJUKSKÖTERSKORNA STREJKAR',
    text: 'Sjuksköterskornas fackförbund har gått ut i strejk på alla sjukhus. De kräver högre lön och ett slut på de ofrivilliga dubbelpassen. Bara akutvården hålls igång.',
    when: (c) => c.is('unions', 'strong', 'mandatory') && c.st.qol < 20,
    choices: [
      { text: 'GE DEM VAD DE KRÄVER', cost: { money: 1000 }, temp: { qol: 5, approval: 6, income: -5 }, tip: 'Dyrt. Och alla andra fackförbund har sett det.' },
      { text: 'TVÅNGSLAGSTIFTA BORT STREJKEN', cost: { pp: 30 }, perm: { hdi: -2 }, temp: { freedom: -8, unrest: 8 }, tip: 'Strejken är över. Uppsägningarna har börjat.' },
      { text: 'ERBJUD HALVA KRAVET OCH VÄNTA UT DEM', cost: { money: 400 }, temp: { qol: -4, approval: -3 }, tip: 'Båda sidor förlorar lite. Det kallas kompromiss.' },
      { text: 'LÅT STREJKEN PÅGÅ', temp: { qol: -10, approval: -8 }, tip: 'Varje dag syns i statistiken.' },
    ],
  },
  {
    id: 'hal_rural_clinic', icon: '\u{1F691}', weight: 2,
    title: 'BYARNA SAKNAR VÅRD',
    text: 'I bergsbyarna stängde den sista vårdcentralen förra året. Närmaste sjukhus ligger en halv dags resa bort, och barnmorskan kommer bara en gång i månaden.',
    when: (c) => (c.ind.urban ?? 60) < 45 && c.st.welfare < 20,
    choices: [
      { text: 'MOBILA KLINIKER SOM ÅKER RUNT', cost: { money: 600 }, perm: { qol: 3, hdi: 2 }, tip: 'En lastbil med läkare och vaccin, varannan vecka.' },
      { text: 'TELEFONLÄKARE VIA MOBILNÄTET', cost: { money: 300, rp: 40 }, perm: { qol: 2, hdi: 3 }, tip: 'Fungerar utmärkt där det finns täckning.' },
      { text: 'BYGG EN VÅRDCENTRAL I VARJE KOMMUN', cost: { money: 1300 }, perm: { qol: 5, hdi: 4, welfare: 3 }, temp: { income: -5 }, tip: 'Byggnaderna är enkla. Att få läkare att flytta dit är inte det.' },
      { text: 'STÄDERNA FÅR GÅ FÖRST', temp: { approval: -5, unrest: 4 }, tip: 'Där bor väljarna. Och läkarna.' },
    ],
  },
  {
    id: 'hal_private_chains', icon: '\u{1F3E2}', weight: 2,
    title: 'SJUKHUSKEDJORNA VILL IN',
    text: 'Ett utländskt riskkapitalbolag vill köpa upp hälften av landets vårdcentraler. De lovar kortare köer och nya lokaler, och räknar med en god vinst.',
    when: (c) => c.is('healthcare', 'fullyfree', 'free', 'mixedprices') && c.is('economic_system', 'market', 'plain') && (c.ind.gdppc ?? 9600) > 8000 && c.st.welfare < 30,
    choices: [
      { text: 'SÄLJ - KONKURRENS GER BÄTTRE VÅRD', res: { money: 900 }, perm: { welfare: -4 }, temp: { qol: 3, approval: -4 }, mod: 'foreign_investment', tip: 'Köerna kortas där vinsten är som störst.' },
      { text: 'TILLÅT, MEN FÖRBJUD VINSTUTTAG', cost: { pp: 20 }, perm: { qol: 2, corruption: -2 }, tip: 'Bolaget tackar nej. Två mindre bolag tackar ja.' },
      { text: 'NEJ, VÅRDEN ÄR INGEN MARKNAD', temp: { approval: 3 }, rel: -3, tip: 'Ideologiskt rent. Köerna står kvar.' },
    ],
  },
  {
    id: 'hal_insulin', icon: '\u{1F48A}', weight: 2,
    title: 'MEDICINERNA ÄR FÖR DYRA',
    text: 'Priset på insulin har tredubblats på två år. Diabetiker börjar ransonera sina doser, och apotekskedjorna skyller på tillverkarna som skyller på apoteken.',
    when: (c) => (c.is('healthcare', 'mostlyunfree', 'unfree') && c.st.welfare < 20) || (c.ind.infl ?? 3) > 20,
    choices: [
      { text: 'PRISTAK PÅ LIVSVIKTIGA LÄKEMEDEL', cost: { pp: 25 }, temp: { qol: 6, approval: 8, factory: -4 }, rel: -3, tip: 'Tillverkarna hotar att sluta leverera. Ingen vet om de menar det.' },
      { text: 'STATEN KÖPER IN OCH DELAR UT GRATIS', cost: { money: 900 }, perm: { welfare: 3 }, temp: { qol: 6, approval: 6 }, tip: 'Ingen ransonerar längre. Budgeten gör det i stället.' },
      { text: 'BYGG EN STATLIG LÄKEMEDELSFABRIK', cost: { money: 1200, rp: 40 }, perm: { qol: 4, factory: 3, income: -2 }, tip: 'Tar tre år. Sedan är priset ditt eget.' },
      { text: 'MARKNADEN HITTAR ETT RIMLIGT PRIS', temp: { qol: -6, approval: -6 }, tip: 'Jämvikten ligger strax ovanför vad folk har råd med.' },
    ],
  },
  {
    id: 'hal_corridor_care', icon: '\u{1F6CF}\u{FE0F}', weight: 2,
    title: 'PATIENTERNA LIGGER I KORRIDOREN',
    text: 'Patienter ligger på bårar i korridorerna och anhöriga tar med egna lakan till sjukhuset. Röntgenapparaten har varit trasig sedan i våras.',
    when: (c) => c.day > 60 && c.is('healthcare_quality', 'minimal', 'low'),
    choices: [
      { text: 'HÖJ VÅRDENS STANDARD I HELA LANDET', cost: { money: 1100, pp: 15 }, law: ['healthcare_quality', 'good'], temp: { approval: 6 }, tip: 'Nya maskiner, fler sängar och högre löpande kostnader.' },
      { text: 'LAGA DET MEST AKUTA', cost: { money: 400 }, temp: { qol: 3 }, tip: 'Röntgen fungerar igen. Taket läcker fortfarande.' },
      { text: 'LÅT DE ANHÖRIGA SKÖTA OMVÅRDNADEN', temp: { qol: -5, approval: -5 }, tip: 'Familjen är världens äldsta vårdsystem.' },
    ],
  },
  {
    id: 'hal_dental', icon: '\u{1F9B7}', weight: 2,
    title: 'TÄNDERNA AVSLÖJAR PLÅNBOKEN',
    text: 'En ny rapport visar att man kan se en människas inkomst på hennes tänder. Var femte vuxen har avstått från tandläkaren det senaste året för att det kostade för mycket.',
    when: (c) => c.is('healthcare', 'mixedprices', 'mostlyunfree', 'unfree') && (c.ind.gdppc ?? 9600) > 20000 && (c.ind.gini ?? 34) > 30,
    choices: [
      { text: 'TANDVÅRDEN IN I HÖGKOSTNADSSKYDDET', cost: { money: 900 }, perm: { qol: 4, welfare: 3 }, temp: { income: -4 }, tip: 'Leendet blir en del av välfärden.' },
      { text: 'GRATIS TANDVÅRD UPP TILL TJUGOFEM ÅR', cost: { money: 500 }, perm: { qol: 2, hdi: 1 }, tip: 'De unga ler. De äldre undrar varför de inte fick.' },
      { text: 'TANDBORSTKAMPANJ I SKOLORNA', cost: { money: 200 }, perm: { hdi: 1 }, temp: { approval: -2 }, tip: 'Förebygger mycket. Hjälper inte den som redan har hål.' },
      { text: 'TÄNDER ÄR ETT EGET ANSVAR', perm: { qol: -2 }, temp: { approval: -4 }, tip: 'Och ansvaret syns när man ler.' },
    ],
  },

  // ================= LIVSLÄNGD OCH BARNADÖDLIGHET =================
  {
    id: 'hal_infant_deaths', icon: '\u{1F37C}', weight: 2,
    title: 'FÖR MÅNGA SPÄDBARN DÖR',
    text: 'Alldeles för många barn i landet dör före sin första födelsedag. De flesta dödsfallen går att förebygga: förlossningar utan barnmorska, diarré och lunginflammation.',
    when: (c) => (c.ind.infmort ?? 11) > 30,
    choices: [
      { text: 'UTBILDA EN BARNMORSKA TILL VARJE BY', cost: { money: 800 }, perm: { hdi: 4, qol: 2 }, tip: 'Den bästa investering ett fattigt land kan göra.' },
      { text: 'GRATIS MÖDRAVÅRD OCH VACCIN FÖR ALLA BARN', cost: { money: 1100 }, perm: { hdi: 6, welfare: 4 }, temp: { income: -5 }, tip: 'Dyrt, varaktigt och fullt av glada mormödrar.' },
      { text: 'BETALA MAMMOR SOM FÖDER PÅ KLINIK', cost: { money: 500 }, perm: { hdi: 3 }, temp: { welfare: 3 }, tip: 'Ett litet kontantbidrag flyttar förlossningen till kliniken.' },
      { text: 'VÄNTA PÅ ATT EKONOMIN VÄXER', perm: { hdi: -1 }, temp: { approval: -4 }, tip: 'Rikare länder har friskare barn. Så småningom.' },
    ],
  },
  {
    id: 'hal_life_record', icon: '\u{1F382}', weight: 1,
    title: 'VI LEVER LÄNGST I VÄRLDEN',
    text: 'Den nya statistiken är klar: ett barn som föds i ditt land i dag kan räkna med att leva längre än nästan någon annanstans på jorden. Pensionsmyndigheten firar inte.',
    when: (c) => (c.ind.life ?? 75) > 82,
    choices: [
      { text: 'FIRA MED EN NATIONELL FOLKHÄLSODAG', cost: { money: 300 }, temp: { approval: 6, qol: 3 }, tip: 'Tårta till alla. Sockerfri, förstås.' },
      { text: 'KOPPLA PENSIONSÅLDERN TILL LIVSLÄNGDEN', cost: { pp: 25 }, perm: { income: 6, manpower: 3 }, temp: { approval: -8 }, tip: 'Logiskt. Ingen vill höra logik om sin egen pension.' },
      { text: 'SATSA PÅ FORSKNING OM ÅLDRANDE', cost: { money: 400, rp: 50 }, perm: { research: 4, hdi: 2 }, tip: 'Varför sluta vid åttiotre?' },
      { text: 'LÅT ALLT VARA SOM DET ÄR', perm: { income: -3 }, temp: { approval: 3 }, tip: 'Längre liv betyder längre pensionsutbetalningar.' },
    ],
  },
  {
    id: 'hal_men_die_early', icon: '\u{1F943}', weight: 2,
    title: 'MÄNNEN DÖR I FÖRTID',
    text: 'Männen i landet dör i genomsnitt mer än tio år före kvinnorna. Läkarna pekar på spriten, cigaretterna och ensamheten efter att fabrikerna stängde.',
    when: (c) => (c.ind.alcohol ?? 5) > 9 && c.st.qol < 10,
    choices: [
      { text: 'HÖJ SPRITSKATTEN KRAFTIGT', res: { money: 400 }, perm: { hdi: 2 }, temp: { approval: -6 }, tip: 'Folkhälsan och statskassan vinner. Hembränningen också.' },
      { text: 'ÖPPNA HÄLSOCENTRALER FÖR MEDELÅLDERS MÄN', cost: { money: 600 }, perm: { hdi: 3, qol: 2 }, tip: 'Första steget är att få dem att gå dit.' },
      { text: 'SÄLJ SPRIT BARA I STATLIGA BUTIKER', cost: { pp: 25 }, perm: { hdi: 3, freedom: -2 }, temp: { income: 4 }, tip: 'Butiken har stängt. Kom tillbaka på måndag.' },
    ],
  },
  {
    id: 'hal_generic_drugs', icon: '\u{1F9EA}', weight: 2,
    title: 'BROMSMEDICINEN ÄR FÖR DYR',
    text: 'Hundratusentals människor behöver bromsmedicin mot en kronisk virussjukdom, men patenterade läkemedel kostar mer än en årslön. En inhemsk fabrik kan tillverka kopior för en bråkdel av priset.',
    when: (c) => (c.ind.life ?? 75) < 66 && (c.ind.gdppc ?? 9600) < 8000,
    choices: [
      { text: 'TILLVERKA KOPIOR TROTS PATENTEN', cost: { pp: 20 }, perm: { hdi: 5, qol: 3 }, rel: -8, tip: 'Läkemedelsbolagen stämmer. Patienterna överlever rättegången.' },
      { text: 'FÖRHANDLA FRAM ETT LÄGRE PRIS', cost: { money: 900 }, perm: { hdi: 3 }, rel: 2, tip: 'Rabatten är stor. Priset är fortfarande högt.' },
      { text: 'ANSÖK OM STÖD FRÅN GLOBALA HÄLSOFONDER', cost: { pp: 10 }, perm: { hdi: 2 }, temp: { statepower: -4 }, rel: 4, tip: 'Medicinen kommer. Villkoren följer med.' },
      { text: 'AVVAKTA TILLS PATENTEN GÅR UT', temp: { approval: -6, qol: -4 }, tip: 'Om åtta år blir allt billigt.' },
    ],
  },

  // ================= ÅLDRANDE OCH PENSIONER =================
  {
    id: 'hal_aging', icon: '\u{1F475}', weight: 2,
    title: 'DE GAMLA BLIR FLER ÄN DE UNGA',
    text: 'För varje pensionär finns snart bara två personer i arbetsför ålder. Äldreomsorgen behöver tiotusentals nya undersköterskor, och ingen vet var de ska komma ifrån.',
    when: (c) => (c.ind.old ?? 9) > 18,
    choices: [
      { text: 'ROBOTAR OCH SENSORER I HEMTJÄNSTEN', cost: { money: 700, rp: 60 }, perm: { qol: 2, factory: 2, research: 2 }, tip: 'Robotar lyfter bättre än de lyssnar.' },
      { text: 'REKRYTERA VÅRDPERSONAL UTOMLANDS', cost: { pp: 20 }, perm: { immigration: 8, manpower: 4, integration: -3 }, tip: 'Vården räddas. Språkkurserna blir många.' },
      { text: 'BETALA FAMILJER SOM VÅRDAR HEMMA', cost: { money: 600 }, perm: { welfare: 3 }, temp: { factory: -2 }, tip: 'Billigare än ett äldreboende. Dyrare för den som stannar hemma.' },
      { text: 'LÅT ANHÖRIGA TA HAND OM SINA ÄLDRE', perm: { welfare: -3 }, temp: { qol: -4, factory: -4 }, tip: 'Döttrarna går ner i arbetstid. Statistiken kallar det frivilligt.' },
    ],
  },
  {
    id: 'hal_pension_funds', icon: '\u{1F4C9}', weight: 2,
    title: 'PENSIONSFONDERNA HAR RASAT',
    text: 'Börsfallet har ätit upp en stor del av de privata pensionsfonderna. Den som gick i pension i år får betydligt mindre än grannen som gick förra året.',
    when: (c) => c.is('pensions', 'private') && (c.st.gdp < 10 || c.mod('downturn')),
    choices: [
      { text: 'STATEN GARANTERAR EN LÄGSTA PENSION', cost: { money: 1000 }, perm: { welfare: 4, income: -3 }, temp: { approval: 8 }, tip: 'Golvet håller. Taket betalar alla skattebetalare.' },
      { text: 'INFÖR ETT ALLMÄNT PENSIONSSYSTEM', cost: { pp: 30 }, law: ['pensions', 'public'], temp: { approval: 5 }, tip: 'Nu bär staten risken. Och kostnaden.' },
      { text: 'BÖRSEN KOMMER TILLBAKA', temp: { approval: -8, qol: -4 }, tip: 'Det gör den. Pensionärerna har bara inte tid att vänta.' },
    ],
  },
  {
    id: 'hal_no_pension', icon: '\u{1F474}', weight: 2,
    title: 'INGEN PENSION, INGEN VILA',
    text: 'Utan någon allmän pension arbetar många äldre tills kroppen tar slut. På marknaderna säljer sjuttioåringar grönsaker från gryningen, och de som saknar barn har ingen att bo hos.',
    when: (c) => c.is('pensions', 'none') || (c.is('pensions', 'private') && (c.ind.poverty ?? 2) > 10),
    choices: [
      { text: 'INFÖR EN ENKEL GRUNDPENSION', cost: { money: 700, pp: 20 }, law: ['pensions', 'mixed'], temp: { approval: 8 }, tip: 'Lite till alla. Ett system som går att bygga vidare på.' },
      { text: 'ÄLDREPENG TILL DE ALLRA FATTIGASTE', cost: { money: 500 }, perm: { welfare: 3, qol: 2 }, tip: 'Inte mycket, men det räcker till ris och medicin.' },
      { text: 'FAMILJEN ÄR PENSIONEN', perm: { qol: -2 }, temp: { approval: -5 }, tip: 'Ett system som bygger på att barnen aldrig flyttar.' },
    ],
  },
  {
    id: 'hal_pensioner_party', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'PENSIONÄRSPARTIET RUSAR',
    text: 'Ett nytt parti som bara driver pensionärernas frågor ligger tvåa i opinionen. Deras krav: högre pensioner, gratis kollektivtrafik för äldre och inga nedskärningar i äldreomsorgen.',
    when: (c) => (c.ind.old ?? 9) > 15 && c.is('elections', 'entirelyfree', 'free', 'mostlyfree', 'balanced'),
    choices: [
      { text: 'TA ÖVER DERAS FRÅGOR', cost: { money: 800 }, perm: { welfare: 3, income: -3 }, temp: { approval: 8 }, tip: 'Partiet tappar väljare. Budgeten tappar mer.' },
      { text: 'GÖR DEM TILL REGERINGSPARTNER', cost: { pp: 25 }, perm: { welfare: 2 }, temp: { stability: 6, polpower: -6 }, tip: 'Stabilt. Varje budget börjar med pensionerna.' },
      { text: 'SATSA PÅ DE UNGA I STÄLLET', perm: { research: 2 }, temp: { approval: -6, unrest: 3 }, tip: 'De unga röstar sällan. De gamla röstar alltid.' },
    ],
  },
  {
    id: 'hal_elder_care_scandal', icon: '\u{1F4F9}', weight: 2,
    title: 'VANVÅRD PÅ ÄLDREBOENDET',
    text: 'Dolda kameror visar hur de boende på ett äldreboende lämnas ensamma i timmar utan mat eller hjälp till toaletten. Bolaget som driver boendet har just redovisat rekordvinst.',
    when: (c) => c.day > 100 && (c.ind.old ?? 9) > 15 && c.st.welfare < 25,
    choices: [
      { text: 'BEMANNINGSKRAV I HELA ÄLDREOMSORGEN', cost: { money: 900 }, perm: { welfare: 4, qol: 3 }, temp: { income: -4 }, tip: 'Fler händer på varje avdelning. Fler kostnader i varje budget.' },
      { text: 'TA ÖVER BOENDET I STATLIG REGI', cost: { money: 500, pp: 15 }, perm: { welfare: 2 }, temp: { approval: 6 }, tip: 'Ett boende räddat. Tusen kvar att granska.' },
      { text: 'ÅTALA BOLAGETS LEDNING', cost: { pp: 20 }, perm: { corruption: -3 }, temp: { approval: 5 }, tip: 'Rättegången blir lång. Rubrikerna blir många.' },
      { text: 'TILLSÄTT EN UTREDNING', temp: { approval: -5 }, tip: 'Den blir klar om två år. Kamerorna sitter kvar.' },
    ],
  },

  // ================= FÖDELSETAL OCH FAMILJER =================
  {
    id: 'hal_baby_boom', icon: '\u{1F476}', weight: 2,
    title: 'BABYBOOM',
    text: 'Familjestöden har fått effekt: förlossningsavdelningarna är överfulla och kön till förskolan växer för varje månad. Om sex år behövs dubbelt så många lågstadielärare.',
    when: (c) => c.is('popgrowth', 'encouraged', 'mandatory') && c.st.qol > 0,
    choices: [
      { text: 'BYGG FÖRSKOLOR I REKORDFART', cost: { money: 1000 }, perm: { qol: 3, welfare: 3, manpower: 4 }, tip: 'Byggkranar och barnvagnar överallt.' },
      { text: 'UTBILDA LÄRARE REDAN NU', cost: { money: 600, rp: 30 }, perm: { hdi: 3, research: 2 }, tip: 'Klassrummen är klara när barnen är det.' },
      { text: 'DRA NER PÅ STÖDEN NU NÄR DET RÄCKER', law: ['popgrowth', 'balanced'], temp: { approval: -4 }, tip: 'Boomen planar ut. Förlossningsavdelningarna andas ut.' },
      { text: 'LÅT FÖRÄLDRARNA LÖSA BARNOMSORGEN', temp: { qol: -5, factory: -4 }, tip: 'Någon får stanna hemma. Gissa vem.' },
    ],
  },
  {
    id: 'hal_high_fertility', icon: '\u{1F46A}', weight: 2,
    title: 'BEFOLKNINGEN FÖRDUBBLAS',
    text: 'Befolkningen fördubblas på mindre än trettio år. Skolorna har femtio elever per klass, och varje år kommer fler unga ut på en arbetsmarknad som inte har jobb åt dem.',
    when: (c) => (c.ind.fert ?? 1.9) > 4,
    choices: [
      { text: 'GRATIS PREVENTIVMEDEL OCH FAMILJEPLANERING', cost: { money: 500 }, perm: { hdi: 3, qol: 2 }, temp: { approval: -3 }, tip: 'Effektivt. Alla i byrådet är inte förtjusta.' },
      { text: 'HÅLL FLICKORNA KVAR I SKOLAN', cost: { money: 800 }, perm: { hdi: 5, qol: 2 }, tip: 'Världens mest effektiva familjeplanering heter gymnasium.' },
      { text: 'INFÖR EN GRÄNS FÖR ANTALET BARN', cost: { pp: 30 }, law: ['popgrowth', 'discouraged'], perm: { freedom: -6 }, temp: { unrest: 8 }, tip: 'Effektivt på papperet. Familjerna hittar vägar runt.' },
      { text: 'MÅNGA BARN ÄR VÅR STYRKA', perm: { manpower: 6 }, temp: { qol: -4 }, tip: 'Generalerna ser fram emot det. Skolorna gör det inte.' },
    ],
  },
  {
    id: 'hal_birth_quota', icon: '\u{1F4CB}', weight: 2,
    title: 'FAMILJERNA GÖMMER SINA BARN',
    text: 'Barnbegränsningen har fått familjer att sluta registrera sina yngsta. I folkbokföringen saknas hundratusentals barn, som varken får gå i skolan eller få vård.',
    when: (c) => c.is('popgrowth', 'none', 'discouraged') && (c.ind.fert ?? 1.9) > 2.3,
    choices: [
      { text: 'AMNESTI: REGISTRERA ALLA BARN UTAN STRAFF', cost: { pp: 15 }, perm: { hdi: 3 }, temp: { approval: 5, statepower: -4 }, tip: 'Hundratusentals nya elever på en dag.' },
      { text: 'SKÄRP KONTROLLERNA', cost: { pp: 25 }, perm: { freedom: -4 }, temp: { statepower: 6, unrest: 8 }, tip: 'Fler inspektörer. Fler gömda barn.' },
      { text: 'AVSKAFFA BARNGRÄNSEN', law: ['popgrowth', 'balanced'], temp: { approval: 8, ideopower: -5 }, tip: 'Folket jublar. Planerarna räknar om allt.' },
    ],
  },

  // ================= FATTIGDOM OCH OJÄMLIKHET =================
  {
    id: 'hal_extreme_poverty', icon: '\u{1FA99}', weight: 2,
    title: 'MILJONER LEVER PÅ NÄSTAN INGENTING',
    text: 'En ny undersökning visar att en stor del av befolkningen lever i extrem fattigdom. Barn går hungriga till skolan, om de går dit alls, och en dålig skörd räcker för att en familj ska förlora allt.',
    when: (c) => (c.ind.poverty ?? 2) > 25,
    choices: [
      { text: 'DIREKTA KONTANTBIDRAG TILL MÖDRARNA', cost: { money: 900 }, perm: { qol: 4, welfare: 4, hdi: 2 }, tip: 'Pengarna går till mat, skolavgifter och en och annan get.' },
      { text: 'SUBVENTIONERA MAJS OCH RIS', cost: { money: 700 }, temp: { qol: 6, approval: 6, income: -5 }, tip: 'Alla får billigare mat, även de som inte behöver.' },
      { text: 'MIKROLÅN TILL SMÅFÖRETAGARE', cost: { money: 400 }, perm: { gdp: 3, qol: 1 }, tip: 'Några blomstrar. Några skuldsätts för livet.' },
      { text: 'TILLVÄXTEN LYFTER ALLA BÅTAR', temp: { approval: -5 }, tip: 'Även dem som saknar båt. På sikt.' },
    ],
  },
  {
    id: 'hal_child_poverty', icon: '\u{1F392}', weight: 2,
    title: 'BARNFATTIGDOMEN ÖKAR',
    text: 'Vart sjätte barn i landet växer upp i en familj som inte har råd med vinterskor eller klassresor. Lärarna märker det på måndagarna: en del barn har inte ätit ordentligt sedan fredagens skollunch.',
    when: (c) => (c.ind.gdppc ?? 9600) > 20000 && (c.ind.gini ?? 34) > 32 && c.st.welfare < 20,
    choices: [
      { text: 'HÖJ BARNBIDRAGET', cost: { money: 800 }, perm: { welfare: 4, qol: 3 }, temp: { income: -3 }, tip: 'Går till alla. Gör mest skillnad för de fattigaste.' },
      { text: 'GRATIS FRUKOST OCH LOVAKTIVITETER I SKOLAN', cost: { money: 400 }, perm: { qol: 2, hdi: 2 }, tip: 'Ingen behöver ansöka. Ingen behöver skämmas.' },
      { text: 'FÖRÄLDRARNA FÅR ARBETA MER', temp: { approval: -5 }, tip: 'Arbetslinjen. Barnen får vänta.' },
    ],
  },
  {
    id: 'hal_slums', icon: '\u{1F3DA}\u{FE0F}', weight: 2,
    title: 'KÅKSTADEN VÄXER',
    text: 'Varje dag flyttar tusentals människor från landsbygden till huvudstaden. De bygger sina hus av plåt och kartong på mark de inte äger, utan avlopp, el eller gator.',
    when: (c) => (c.ind.gdppc ?? 9600) < 6000 && (c.ind.popgrowth ?? 0.9) > 1.8 && (c.ind.urban ?? 60) > 30,
    choices: [
      { text: 'GE DE BOENDE LAGFART PÅ SINA TOMTER', cost: { pp: 20 }, perm: { qol: 3, gdp: 2 }, tip: 'Ett papper gör ett skjul till en tillgång.' },
      { text: 'DRA FRAM VATTEN OCH EL', cost: { money: 1000 }, perm: { qol: 4, hdi: 3 }, tip: 'Kåkstaden blir en stadsdel. Långsamt.' },
      { text: 'RIV KÅKSTADEN OCH BYGG HÖGHUS', cost: { money: 1300, pp: 15 }, perm: { qol: 2 }, temp: { unrest: 10, approval: -4 }, tip: 'Husen blir fina. De som bodde där har flyttat till nästa kåkstad.' },
      { text: 'LÅT STADEN VÄXA SOM DEN VILL', perm: { qol: -2 }, temp: { safety: -4 }, tip: 'Staden planerar sig själv. Det syns.' },
    ],
  },

  // ================= VÄLFÄRDEN =================
  {
    id: 'hal_welfare_fraud', icon: '\u{1F50D}', weight: 2,
    title: 'BIDRAGSFUSKET AVSLÖJAT',
    text: 'Granskande journalister har avslöjat ligor som tar ut assistansersättning och sjukpenning för personer som inte finns eller inte är sjuka. Brotten har pågått i flera år.',
    when: (c) => c.is('welfare', 'extreme', 'huge', 'coverage') && c.st.corruption > 10,
    choices: [
      { text: 'SAMKÖR ALLA MYNDIGHETERS REGISTER', cost: { money: 500, rp: 30 }, perm: { corruption: -5 }, temp: { freedom: -3 }, tip: 'Datorerna hittar fuskarna. Och vet nu allt om alla.' },
      { text: 'SKÄRP KONTROLLERNA FÖR ALLA SOM FÅR STÖD', cost: { pp: 15 }, perm: { corruption: -3, welfare: -3 }, temp: { approval: -3 }, tip: 'Fuskarna stoppas. Även några som inte fuskade.' },
      { text: 'SÄNK ERSÄTTNINGARNA OCH SPARA', law: ['welfare', 'balanced'], res: { money: 600 }, temp: { approval: -6 }, tip: 'Alla får betala för några få.' },
      { text: 'DET ÄR ENSKILDA FALL', perm: { corruption: 3 }, tip: 'Enskilda fall med väl organiserade bokföringar.' },
    ],
  },
  {
    id: 'hal_imf_cuts', icon: '\u{1F3E6}', weight: 2,
    title: 'LÅNGIVARNA KRÄVER NEDSKÄRNINGAR',
    text: 'Den internationella valutafonden erbjuder ett nödlån, men villkoren är tydliga: sänkta pensioner, avgifter i vården och färre offentligt anställda. Utan lånet kan staten inte betala lönerna nästa månad.',
    when: (c) => ((c.ind.debt ?? 57) > 100 || c.mod('fiscal_collapse')) && c.is('welfare', 'extreme', 'huge', 'coverage', 'balanced'),
    choices: [
      { text: 'GÅ MED PÅ VILLKOREN', res: { money: 1500 }, law: ['welfare', 'little'], temp: { unrest: 10, approval: -10 }, tip: 'Statskassan räddas. Gatorna fylls.' },
      { text: 'FÖRHANDLA FRAM EN MJUKARE VARIANT', cost: { pp: 30 }, res: { money: 800 }, perm: { welfare: -3 }, temp: { approval: -3 }, tip: 'Halva lånet, halva nedskärningarna, dubbla mötena.' },
      { text: 'SÄG NEJ OCH STÅ PÅ EGNA BEN', temp: { stability: -6, approval: 6 }, mod: 'fiscal_collapse', tip: 'Värdigheten är intakt. Kassan är tom.' },
    ],
  },

  // ================= BOSTÄDER =================
  {
    id: 'hal_rent_surge', icon: '\u{1F3E0}', weight: 2,
    title: 'HYRORNA HAR FÖRDUBBLATS',
    text: 'Hyrorna i storstäderna har fördubblats på fem år. Sjuksköterskor och poliser pendlar två timmar om dagen eftersom de inte har råd att bo där de arbetar.',
    when: (c) => c.is('housing', 'market', 'deregulated') && (c.ind.urban ?? 60) > 65,
    choices: [
      { text: 'INFÖR HYRESTAK', cost: { pp: 25 }, law: ['housing', 'rentcontrol'], temp: { approval: 8 }, tip: 'Hyrorna fryses. Nybyggandet också.' },
      { text: 'BOSTADSBIDRAG TILL SAMHÄLLSVIKTIGA YRKEN', cost: { money: 700 }, temp: { qol: 4, approval: 4 }, tip: 'Bidraget hamnar till slut hos hyresvärden.' },
      { text: 'BESKATTA TOMMA LÄGENHETER OCH KORTTIDSUTHYRNING', cost: { pp: 15 }, res: { money: 300 }, temp: { qol: 2 }, tip: 'Turistlägenheterna blir bostäder igen. Några av dem.' },
      { text: 'MARKNADEN LÖSER DET', perm: { gdp: 2 }, temp: { qol: -5, approval: -4 }, tip: 'Den löser det åt dem som har råd.' },
    ],
  },
  {
    id: 'hal_homeless_cold', icon: '\u{2744}\u{FE0F}', weight: 2,
    title: 'KÖLDEN OCH DE HEMLÖSA',
    text: 'En köldknäpp har slagit till och härbärgena är fulla redan tidigt på kvällen. Hjälporganisationerna varnar för att människor som sover ute kan dö av kylan i natt.',
    when: (c) => (c.st.welfare < -20 || c.is('housing', 'market', 'deregulated')) && (c.ind.gdppc ?? 9600) > 10000,
    choices: [
      { text: 'ÖPPNA SKOLOR OCH IDROTTSHALLAR I NATT', cost: { money: 300 }, temp: { approval: 5, qol: 2 }, tip: 'Akut och nödvändigt. Löser bara natten.' },
      { text: 'BOSTAD FÖRST: EN EGEN LÄGENHET UTAN VILLKOR', cost: { money: 1100 }, perm: { qol: 4, welfare: 4, safety: 2 }, tip: 'Låter dyrt. Är billigare än akuten varje vinter.' },
      { text: 'FÖRBJUD ATT SOVA PÅ GATAN', cost: { pp: 15 }, temp: { safety: 3, freedom: -6, approval: -5 }, tip: 'Problemet flyttar till parkerna i grannkommunen.' },
      { text: 'LÅT FRIVILLIGORGANISATIONERNA SKÖTA DET', temp: { approval: -6, qol: -3 }, tip: 'Soppköket gör vad det kan. Det räcker inte.' },
    ],
  },

  // ================= TOBAK, ALKOHOL OCH NARKOTIKA =================
  {
    id: 'hal_smoking', icon: '\u{1F6AC}', weight: 2,
    title: 'HALVA LANDET RÖKER',
    text: 'Var tredje vuxen röker, och lungcancer är den vanligaste dödsorsaken bland medelålders män. Tobaksbolagen sponsrar både fotbollsligan och sommarens musikfestivaler.',
    when: (c) => (c.ind.smoking ?? 20) > 27,
    choices: [
      { text: 'RÖKFÖRBUD PÅ RESTAURANGER OCH ARBETSPLATSER', cost: { pp: 20 }, perm: { hdi: 3 }, temp: { approval: -4 }, tip: 'Krogarna blir luktfria. Trottoarerna gör det inte.' },
      { text: 'HÖJ TOBAKSSKATTEN KRAFTIGT', res: { money: 500 }, perm: { hdi: 2 }, temp: { approval: -5, safety: -2 }, tip: 'Smugglarna gnuggar händerna.' },
      { text: 'FÖRBJUD TOBAKSREKLAM OCH SPONSRING', cost: { pp: 15 }, perm: { hdi: 2 }, temp: { approval: -3, income: -2 }, tip: 'Fotbollsligan behöver en ny huvudsponsor.' },
      { text: 'VUXNA FÅR BESTÄMMA SJÄLVA', perm: { hdi: -2 }, temp: { freedom: 3 }, tip: 'Tobaksbolagen tackar. Sjukhusen får notan om tjugo år.' },
    ],
  },
  {
    id: 'hal_alcohol', icon: '\u{1F37A}', weight: 2,
    title: 'SPRITEN FLÖDAR',
    text: 'Alkoholkonsumtionen hör till de högsta i världen. Många misshandelsfall och trafikolyckor sker under påverkan, och billig sprit säljs dygnet runt i varje kiosk.',
    when: (c) => (c.ind.alcohol ?? 5) > 10 || (c.is('drugs', 'legal') && c.st.safety < 0),
    choices: [
      { text: 'STATLIGT MONOPOL PÅ FÖRSÄLJNINGEN', cost: { pp: 25 }, res: { money: 300 }, perm: { hdi: 3, safety: 3, freedom: -2 }, tip: 'Kiosken säljer läsk. Staten säljer resten.' },
      { text: 'MINIMIPRIS PÅ ALKOHOL', cost: { pp: 15 }, perm: { hdi: 2, safety: 2 }, temp: { approval: -4 }, tip: 'Den billigaste spriten försvinner. De dyra märkena tackar.' },
      { text: 'FÖRBJUD ALKOHOL HELT', cost: { pp: 30 }, perm: { hdi: 2 }, temp: { unrest: 10, approval: -10 }, mod: 'lawless', tip: 'Det har prövats förut. Smugglarna minns det med glädje.' },
      { text: 'LÅT FOLK DRICKA', perm: { hdi: -2 }, temp: { approval: 3 }, tip: 'Skål. Akutmottagningen får ta hand om resten.' },
    ],
  },
  {
    id: 'hal_opioids', icon: '\u{1F48A}', weight: 2,
    title: 'OPIOIDKRISEN',
    text: 'Starka smärtstillande tabletter som skrivits ut i miljontal har skapat ett beroende som sprider sig från småstäderna. Överdoser har blivit en av de vanligaste dödsorsakerna bland unga vuxna.',
    when: (c) => (c.is('drugs', 'legal', 'decriminalized') || c.is('healthcare', 'mostlyunfree', 'unfree')) && (c.ind.gdppc ?? 9600) > 15000,
    choices: [
      { text: 'STÄM LÄKEMEDELSBOLAGEN', cost: { pp: 20 }, res: { money: 800 }, perm: { corruption: -2 }, tip: 'Förlikningen blir stor. Den kommer om sju år.' },
      { text: 'GRATIS BEHANDLING OCH MOTGIFT ÖVERALLT', cost: { money: 900 }, perm: { hdi: 3, welfare: 2, safety: 2 }, tip: 'Motgiftet räddar liv i dag. Behandlingen räddar resten.' },
      { text: 'KRIG MOT NARKOTIKAN', cost: { pp: 25 }, law: ['drugs', 'war'], temp: { safety: 4, freedom: -6 }, tip: 'Fängelserna fylls. Tabletterna byts mot något värre.' },
      { text: 'STRYP FÖRSKRIVNINGEN', perm: { hdi: 2 }, temp: { approval: -3, qol: -2 }, tip: 'Läkarna slutar skriva ut. Patienterna hittar andra källor.' },
    ],
  },

  // ================= FETMA, PSYKISK OHÄLSA OCH FOLKHÄLSA =================
  {
    id: 'hal_obesity', icon: '\u{1F354}', weight: 2,
    title: 'LANDET LIDER AV FETMA',
    text: 'Var tredje vuxen har fetma och typ 2-diabetes ökar snabbast bland barn. Läsk är billigare än vatten i skolkafeterian, och färre än hälften av eleverna rör på sig varje dag.',
    when: (c) => (c.ind.gdppc ?? 9600) > 12000 && (c.ind.urban ?? 60) > 70 && c.st.qol > -20,
    choices: [
      { text: 'INFÖR SOCKERSKATT PÅ LÄSK', res: { money: 400 }, perm: { hdi: 2 }, temp: { approval: -5 }, tip: 'Flaskorna krymper. Tillverkarna rasar.' },
      { text: 'DAGLIG IDROTT PÅ SCHEMAT', cost: { money: 500 }, perm: { hdi: 3, qol: 1 }, tip: 'Trettio minuter om dagen. Gymnastiklärarna är lyriska.' },
      { text: 'TYDLIGA VARNINGAR PÅ FÖRPACKNINGARNA', cost: { pp: 10 }, perm: { hdi: 1 }, tip: 'Folk läser varningen. Folk äter ändå.' },
      { text: 'VAR OCH EN ANSVARAR FÖR SIN KROPP', perm: { hdi: -2 }, temp: { freedom: 2 }, tip: 'Och vårdkostnaderna ansvarar för sig själva.' },
    ],
  },
  {
    id: 'hal_youth_mental', icon: '\u{1F9E0}', weight: 2,
    title: 'DE UNGA MÅR SÄMRE',
    text: 'Allt fler tonåringar söker vård för ångest och nedstämdhet, och kön till barn- och ungdomspsykiatrin är längre än ett halvår. Skolkuratorerna hinner bara med de mest akuta fallen.',
    when: (c) => (c.ind.internet ?? 80) > 85 && (c.ind.youthunemp ?? 14) > 12,
    choices: [
      { text: 'DUBBLA BARN- OCH UNGDOMSPSYKIATRIN', cost: { money: 900 }, perm: { qol: 4, hdi: 2 }, tip: 'Köerna halveras. Behovet gör det inte.' },
      { text: 'MOBILFÖRBUD I ALLA SKOLOR', cost: { pp: 15 }, perm: { qol: 2 }, temp: { approval: -2, freedom: -2 }, tip: 'Rasterna blir högljudda igen. Föräldrarna jublar.' },
      { text: 'SAMTALSSTÖD VIA APPAR OCH CHATT', cost: { money: 300, rp: 30 }, temp: { qol: 3 }, tip: 'Tillgängligt dygnet runt. Svarar ibland lite konstigt.' },
      { text: 'DET ÄR EN FAS', perm: { qol: -2 }, temp: { approval: -4 }, tip: 'En fas som varar en hel generation.' },
    ],
  },
  {
    id: 'hal_health_campaign', icon: '\u{1F3C3}', weight: 2,
    title: 'HELA LANDET SKA RÖRA PÅ SIG',
    text: 'Folkhälsomyndigheten vill starta en nationell kampanj för att få landet att röra på sig: stegtävlingar mellan arbetsplatser, nya cykelbanor och gratis motionspass. Kritikerna kallar det förmynderi.',
    when: (c) => c.st.qol > 0 && (c.ind.gdppc ?? 9600) > 8000 && c.is('healthcare_quality', 'good', 'modern', 'extra'),
    choices: [
      { text: 'KÖR KAMPANJEN FULLT UT', cost: { money: 500 }, perm: { hdi: 2, qol: 2 }, tip: 'Stegräknarna går varma. Ministrarna går till jobbet.' },
      { text: 'BYGG CYKELBANOR I STÄLLET FÖR REKLAM', cost: { money: 900 }, perm: { qol: 3, hdi: 2 }, tip: 'Reklamen glöms. Cykelbanorna ligger kvar.' },
      { text: 'STRYK KAMPANJEN', res: { money: 200 }, temp: { approval: -2 }, tip: 'Pengarna sparas. Soffan vinner.' },
    ],
  },

  // ================= VATTEN OCH HUNGER =================
  {
    id: 'hal_water_villages', icon: '\u{1F4A7}', weight: 2,
    title: 'VATTNET I BYN GÖR BARNEN SJUKA',
    text: 'Kvinnor och flickor i byarna går flera timmar varje dag för att hämta vatten från floden. Vattnet gör barnen sjuka, och flickorna hinner inte gå i skolan.',
    when: (c) => (c.ind.water ?? 70) < 40 && (c.ind.urban ?? 60) < 60,
    choices: [
      { text: 'BORRA BRUNNAR I VARJE BY', cost: { money: 800 }, perm: { qol: 4, hdi: 4 }, tip: 'Rent vatten och fler flickor i skolan, i samma veva.' },
      { text: 'DELA UT VATTENFILTER TILL HUSHÅLLEN', cost: { money: 300 }, perm: { hdi: 2 }, temp: { qol: 2 }, tip: 'Billigt och snabbt. Promenaden till floden finns kvar.' },
      { text: 'LÅT ETT UTLÄNDSKT BOLAG BYGGA OCH TA BETALT', perm: { qol: 2 }, temp: { approval: -5 }, mod: 'foreign_investment', tip: 'Vattnet kommer. Räkningen också.' },
    ],
  },
  {
    id: 'hal_famine', icon: '\u{1F33E}', weight: 2,
    title: 'HUNGERSNÖD HOTAR',
    text: 'Två regnperioder i rad har uteblivit och FN varnar för hungersnöd i landets torraste provinser. Bönderna har redan börjat äta upp utsädet.',
    when: (c) => (c.ind.agri ?? 6) > 20 && (c.ind.poverty ?? 2) > 15,
    choices: [
      { text: 'ÖPPNA DE STATLIGA SPANNMÅLSLAGREN', cost: { money: 600 }, temp: { qol: 5, approval: 6 }, tip: 'Lagren töms. Nästa torka får lösa sig själv.' },
      { text: 'BE OM INTERNATIONELL LIVSMEDELSHJÄLP', cost: { pp: 10 }, temp: { qol: 6, statepower: -5 }, rel: 5, tip: 'Säckarna kommer, med givarländernas flaggor på.' },
      { text: 'DELA UT TORKTÅLIGT UTSÄDE', cost: { money: 500, rp: 30 }, perm: { factory: 2, qol: 2 }, tip: 'Hjälper nästa skörd. Den här är redan förlorad.' },
      { text: 'FÖRBJUD EXPORT AV MAT', temp: { qol: 3, income: -6 }, rel: -6, tip: 'Det blir mat hemma. Grannarna blir hungriga och sura.' },
    ],
  },
  {
    id: 'hal_school_meals', icon: '\u{1F35A}', weight: 2,
    title: 'HUNGRIGA BARN LÄR SIG INTE LÄSA',
    text: 'Hälften av barnen i landsbygdens skolor kommer till lektionerna utan frukost, och många slutar efter några år för att hjälpa till hemma. Lärarna säger att hungriga barn inte lär sig läsa.',
    when: (c) => (c.ind.u5mort ?? 13) > 30 && c.st.qol < 15,
    choices: [
      { text: 'GRATIS SKOLLUNCH I VARJE SKOLA', cost: { money: 800 }, perm: { hdi: 4, qol: 3 }, temp: { income: -3 }, tip: 'Närvaron stiger direkt. Föräldrarna skickar fler syskon.' },
      { text: 'KÖP SKOLMATEN AV LOKALA BÖNDER', cost: { money: 1000 }, perm: { hdi: 4, qol: 2, factory: 2 }, tip: 'Barnen äter, bönderna säljer. Dyrare, men pengarna stannar.' },
      { text: 'TA EMOT LIVSMEDELSBISTÅND', perm: { hdi: 2 }, temp: { statepower: -3 }, rel: 3, tip: 'Gratis gröt i dag. Inga egna skolkök i morgon.' },
    ],
  },

  // ================= LANDSBYGD OCH STAD =================
  {
    id: 'hal_rural_exodus', icon: '\u{1F69C}', weight: 2,
    title: 'BYARNA TÖMS',
    text: 'Ungdomarna flyttar till storstäderna och byarna töms. Skolan, affären och bensinmacken har stängt, och de som bor kvar är mest pensionärer.',
    when: (c) => (c.ind.urban ?? 60) > 45 && (c.ind.urban ?? 60) < 80 && (c.ind.popgrowth ?? 0.9) < 0.3,
    choices: [
      { text: 'FLYTTA STATLIGA MYNDIGHETER TILL LANDSBYGDEN', cost: { money: 700, pp: 15 }, perm: { qol: 2, stability: 2 }, temp: { statepower: -3 }, tip: 'Myndigheten flyttar. Hälften av personalen säger upp sig.' },
      { text: 'BREDBAND TILL VARJE BY', cost: { money: 900 }, perm: { qol: 3, gdp: 2 }, tip: 'Distansarbetarna kommer. Några av dem.' },
      { text: 'SKATTELÄTTNAD FÖR DEN SOM BOR PÅ LANDET', cost: { pp: 15 }, perm: { qol: 2 }, temp: { income: -5 }, tip: 'Folkbokföringen på landet ökar. Folket på landet mindre.' },
      { text: 'LÅT URBANISERINGEN HA SIN GÅNG', perm: { gdp: 2 }, temp: { approval: -6 }, tip: 'Staden växer. Landsbygden röstar på oppositionen.' },
    ],
  },
];
