// IMPERIUM V5.16 — HÄNDELSER: REAKTIONER.
// Folkets svar på lagarna du ändrar. Tar du bort något folket tycker om kommer
// protesterna, namninsamlingarna, strejkerna, stämningarna och avgångarna — och
// den som kan flyttar utomlands eller handlar svart. Ger du folket något kommer
// tacksamheten, men också oron för vad det kostar, för budgeten och för priserna.
// Nästan alla händelser är reaktioner (react: true) och har ett slag (kind) så att
// valen påverkar rätt sorts missnöje. Nästan alla har ett val som backar beslutet
// (undo) och ett som står fast — med sitt pris. Kedjorna (chain: true) avgör om
// en protest lugnar sig eller eskalerar.

// lagarna av varje slag (realism.js LAW_KIND) — för de allmänna händelserna med {lag}
const VALFARD = ['welfare', 'healthcare', 'healthcare_quality', 'pensions', 'retirement_age', 'minimum_wage', 'workhours',
  'vacation', 'parental_leave', 'childcare', 'education', 'school_choice', 'housing', 'unions', 'water'];
const SKATT = ['taxes', 'corporate_tax', 'inheritance_tax', 'alcohol_policy', 'tobacco', 'price_controls', 'cash'];
const FRIHET = ['press', 'speech', 'protest', 'civil_rights', 'surveillance', 'internet', 'elections', 'government',
  'party_loyalty', 'voting_age', 'trials', 'punishments', 'death_penalty', 'policing', 'rehabilitation', 'juvenile_justice',
  'firearms', 'drugs', 'religion', 'culture', 'language', 'marriage', 'equality', 'emigration', 'lobbying',
  'anti_corruption', 'vaccination', 'popgrowth'];
const MIGRATION = ['immigration', 'border_control', 'visa_policy', 'citizenship'];
const MILJO = ['environment', 'energy', 'forestry', 'mining', 'fishing', 'hunting', 'animal_welfare', 'transport',
  'urban_planning', 'road_safety', 'agriculture'];
const EKONOMI = ['economic_system', 'ownership', 'monetary', 'banking', 'globalism', 'industrial_subsidies', 'antitrust',
  'debt_brake', 'consumer_protection', 'ai_regulation', 'intellectual_property', 'science_funding', 'space_program', 'sports'];
const FORSVAR = ['military_service', 'defense_budget', 'nuclear_doctrine', 'arms_exports', 'un', 'foreign_aid'];

export const EVENTS = [

  // ===== PENSIONERNA =====
  {
    id: 'rea_pens_marsch', icon: '\u{1F9D3}', weight: 3, cooldown: 900,
    kind: 'valfard', react: true,
    title: 'PENSIONÄRERNA TÅGAR MOT {HUVUDSTAD}',
    text: 'Sedan pensionerna skars ned har pensionärsförbundet tagit fram rullatorerna. I morse gick fyrtiotusen äldre från järnvägsstationen till regeringsbyggnaden i {huvudstad}, med skyltar som "VI BYGGDE LANDET - NU RIVER NI OSS". Många har räknat ut att de förlorar en veckas matkasse varje månad.',
    when: (c) => c.cut('pensions') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL PENSIONERNA', cost: { pp: 15 }, undo: 'pensions', griev: -25, temp: { approval: 5, polpower: -4 }, tip: 'Rullatorerna rullar hem. Budgethålet stannar kvar.' },
      { text: 'BJUD IN FÖRBUNDET TILL SAMTAL', cost: { pp: 5 }, griev: -6, temp: { unrest: -2 }, next: ['rea_pens_forlik', 'rea_pens_ockup'], tip: 'Kaffe och wienerbröd. De har gott om tid.' },
      { text: 'STÅ FAST: KASSAN RÄCKER INTE', griev: 8, temp: { unrest: 5, approval: -4 }, ind: { trustgov: -4, protests: 30 }, next: ['rea_pens_ockup', null], tip: 'Pensionärer röstar. Alla. Varje gång.' },
    ],
  },
  {
    id: 'rea_pens_ockup', icon: '\u{1F9F6}', chain: true, kind: 'valfard',
    title: 'PENSIONÄRERNA SITTER KVAR',
    text: 'Ett hundratal pensionärer har satt sig på trappan till pensionsmyndigheten i {huvudstad} och vägrar gå hem. De har med sig termosar, filtar och stickning. Barnbarnen turas om att komma med mat, tv sänder direkt, och polisen vill inte bära ut en åttioårig före detta sjuksköterska inför kamerorna.',
    choices: [
      { text: 'GE MED: PENSIONERNA ÅTERSTÄLLS', undo: 'pensions', griev: -30, temp: { approval: 3, polpower: -6 }, tip: 'Halsduken blev klar i alla fall.' },
      { text: 'GARANTIPENSION FÖR DE FATTIGASTE', cost: { money: 500 }, griev: -15, temp: { unrest: -4, approval: 3 }, tip: 'De som har minst får tillbaka mest. Resten får vänta.' },
      { text: 'LÅT POLISEN TÖMMA TRAPPAN', griev: 12, temp: { unrest: 8, approval: -7, freedom: -2 }, ind: { trustgov: -6, protests: 50 }, mod: 'martyr', tip: 'Bilden av rullatorn i snön blir årets pressbild.' },
    ],
  },
  {
    id: 'rea_pens_forlik', icon: '\u{1F91D}', chain: true, kind: 'valfard',
    title: 'PENSIONSFÖRLIKNINGEN',
    text: 'Efter tre veckor i ett sammanträdesrum med alldeles för få fönster finns en skiss: nedskärningen fasas in på åtta år i stället för direkt, och de med lägst pension slipper helt. Förbundets ordförande, en före detta busschaufför, kallar det "inte bra, men ärligt".',
    choices: [
      { text: 'SKRIV UNDER FÖRLIKNINGEN', cost: { money: 300 }, griev: -20, temp: { approval: 4, unrest: -4, stability: 2 }, tip: 'Ingen jublar. Alla kan leva med det.' },
      { text: 'PRUTA LITE TILL', tip: 'Busschaufförer har tålamod. Till en gräns.',
        risk: { chance: 0.5,
          win: { text: 'Förbundet suckar och går med på det. Kassan tackar.', res: { money: 200 }, griev: -10 },
          lose: { text: 'Ordföranden reser sig och går. På lördag tågar de igen.', griev: 10, temp: { unrest: 5 } } } },
    ],
  },
  {
    id: 'rea_pens_lyft', icon: '\u{1F4B5}', weight: 2,
    kind: 'valfard', react: true,
    title: 'PENSIONSLYFTET',
    text: 'De höjda pensionerna har börjat betalas ut. På kaféerna i {stad} bjuder pensionärer varandra på bakelser och i kyrkorna tackar man i kollekten. Men finansdepartementets ekonomer har räknat på hur många fler som blir pensionärer de närmaste tio åren, och siffran ligger i en mapp med röd lapp på.',
    when: (c) => c.raised('pensions'),
    choices: [
      { text: 'FIRA - DE HAR FÖRTJÄNAT DET', griev: -10, temp: { approval: 5, qol: 2 }, perm: { income: -1 }, tip: 'Bakelser i dag. Räkningen om tjugo år.' },
      { text: 'FINANSIERA MED EN BUFFERTFOND', cost: { money: 600 }, griev: -6, perm: { stability: 2 }, temp: { approval: 2 }, tip: 'Tråkigt, klokt och osynligt i valrörelsen.' },
      { text: 'KNYT PENSIONERNA TILL LIVSLÄNGDEN', cost: { pp: 15 }, perm: { income: 2 }, temp: { approval: -3 }, griev: 4, tip: 'Rättvist mellan generationerna. Impopulärt hos alla.' },
    ],
  },

  // ===== PENSIONSÅLDERN =====
  {
    id: 'rea_pensald_tunga', icon: '\u{1F9F1}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'TRE ÅR TILL MED TUNGA LYFT',
    text: 'Den höjda pensionsåldern slår hårdast mot dem med tunga jobb. Undersköterskor i hemtjänsten, murare och städare har startat uppropet "Kroppen läser inte kalkylarket". Facket visar röntgenbilder av slitna axlar, och läkare varnar för att sjukskrivningarna bland 60-åringar kommer att öka.',
    when: (c) => c.cut('retirement_age'),
    choices: [
      { text: 'BACKA: PENSIONSÅLDERN BLIR SOM FÖRR', cost: { pp: 15 }, undo: 'retirement_age', griev: -25, temp: { approval: 4, polpower: -3 }, tip: 'Folk jublar. Ekonomerna drar efter andan.' },
      { text: 'UNDANTAG FÖR TUNGA YRKEN', cost: { money: 400, pp: 10 }, griev: -14, temp: { approval: 3 }, perm: { welfare: 1 }, tip: 'Nu börjar grälet om vilka yrken som är tunga nog.' },
      { text: 'STÅ FAST: VI LEVER LÄNGRE', griev: 8, temp: { unrest: 4, approval: -3 }, perm: { income: 1 }, ind: { strikes: 25 }, tip: 'Det gör vi. Men axlarna gör det inte.' },
    ],
  },
  {
    id: 'rea_pensald_sank', icon: '\u{26F3}', weight: 2,
    kind: 'valfard', react: true,
    title: 'ALLA GÅR I PENSION SAMTIDIGT',
    text: 'Den sänkta pensionsåldern var populär - kanske för populär. På ett halvår har var tredje lokförare och var fjärde distriktsläkare i {stad} meddelat att de slutar. Pensionärerna köar till golfbanorna, och arbetsgivarna köar till regeringen.',
    when: (c) => c.raised('retirement_age'),
    choices: [
      { text: 'LOCKA TILLBAKA DE NYBLIVNA PENSIONÄRERNA', cost: { money: 400 }, temp: { factory: 2, approval: 2 }, griev: -5, tip: 'Pension och lön samtidigt. Mycket populärt bland 66-åringar.' },
      { text: 'HÖJ ÅLDERN IGEN', cost: { pp: 10 }, undo: 'retirement_age', griev: 10, temp: { approval: -4 }, perm: { income: 1 }, tip: 'Det man har gett är svårt att ta tillbaka.' },
      { text: 'LÅT DET VARA, DE UNGA BEHÖVER JOBBEN', temp: { qol: 3, factory: -3 }, griev: -6, ind: { youthunemp: -1 }, tip: 'Ungdomsarbetslösheten sjunker. Tågen går mer sällan.' },
    ],
  },

  // ===== SJUKVÅRDEN =====
  {
    id: 'rea_vard_avgift', icon: '\u{1F3E5}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'TOMT I VÄNTRUMMET',
    text: 'Sedan sjukvården blev dyrare för patienterna är väntrummet på vårdcentralen i {stad} märkligt tomt. Det låter som en framgång tills distriktssköterskan förklarar: folk kommer inte förrän det är akut. Akutmottagningen har fått dubbelt så många lunginflammationer som borde ha upptäckts i tid.',
    when: (c) => c.cut('healthcare'),
    choices: [
      { text: 'ÅTERSTÄLL SJUKVÅRDEN', cost: { pp: 15 }, undo: 'healthcare', griev: -22, temp: { approval: 4, polpower: -3 }, tip: 'Väntrummet fylls. Det var meningen.' },
      { text: 'HÖGKOSTNADSSKYDD FÖR DE SJUKASTE', cost: { money: 450 }, griev: -10, perm: { hdi: 1 }, temp: { qol: 2 }, tip: 'Den som är riktigt sjuk betalar bara de första besöken.' },
      { text: 'AVGIFTERNA STANNAR', res: { money: 150 }, griev: 7, temp: { qol: -3, approval: -3 }, tip: 'Kassan blir lite fetare. Befolkningen lite hostigare.' },
    ],
  },
  {
    id: 'rea_vard_forsakring', icon: '\u{1F4C4}', weight: 2, cooldown: 900,
    kind: 'valfard', react: true,
    title: 'FÖRSÄKRINGSSÄLJARNA KNACKAR PÅ',
    text: 'Sedan sjukvården slutade vara gratis har försäkringsbolagen anställt tusen dörrknackare. En sjukförsäkring kostar lika mycket som en billeasing. Den som har jobb får en via arbetsgivaren, men den som blir uppsagd förlorar vården samtidigt. En fattigdomsforskare kallar det "en trygghet som försvinner när man behöver den".',
    when: (c) => c.cut('healthcare') && c.is('healthcare', 'employer', 'savings', 'mostlyunfree', 'unfree'),
    choices: [
      { text: 'ÅTERSTÄLL SJUKVÅRDEN', cost: { pp: 15 }, undo: 'healthcare', griev: -22, temp: { approval: 4 }, tip: 'Dörrknackarna får knacka på annat.' },
      { text: 'STATLIG GRUNDFÖRSÄKRING FÖR ARBETSLÖSA', cost: { money: 500 }, griev: -10, perm: { welfare: 2 }, temp: { income: -2 }, tip: 'Ett skyddsnät under skyddsnätet.' },
      { text: 'MARKNADEN SKÖTER DET', griev: 8, temp: { gdp: 2, qol: -4 }, tip: 'Försäkringsbolagens aktier stiger. Det gör febern också.' },
    ],
  },
  {
    id: 'rea_vard_strejk', icon: '\u{1F469}\u{200D}\u{2695}\u{FE0F}', weight: 3, cooldown: 1000,
    kind: 'valfard', react: true,
    title: 'SJUKSKÖTERSKORNA LÄGGER NER ARBETET',
    text: 'Neddragningarna i vården har gjort att varje sjuksköterska på länssjukhuset i {stad} har fjorton patienter i stället för åtta. I natt gick förbundet ut i strejk. Akuten och intensiven bemannas av skyddsarbetare, men alla planerade operationer är inställda och höftpatienterna får vänta.',
    when: (c) => c.cut('healthcare_quality') && c.grievOf('valfard') > 10,
    choices: [
      { text: 'BACKA NEDSKÄRNINGEN I VÅRDEN', cost: { pp: 15 }, undo: 'healthcare_quality', griev: -25, temp: { approval: 4 }, tip: 'Strejken är över i kväll. Budgeten får lösas på annat sätt.' },
      { text: 'FÖRHANDLA OM LÖNERNA', cost: { money: 600 }, griev: -12, temp: { unrest: -3 }, next: ['rea_vard_strejk_avtal', null], tip: 'Pengar löser mycket. Inte allt.' },
      { text: 'HYR IN PERSONAL FRÅN {GRANNE}', cost: { money: 300 }, griev: 6, temp: { approval: -3, unrest: 3 }, next: ['rea_vard_strejk_akut', 'rea_vard_strejk_avtal'], tip: 'Bemanningsbolaget tar tre gånger timlönen. Strejken fortsätter.' },
      { text: 'STÅ FAST OCH VÄNTA UT DEM', griev: 9, temp: { unrest: 5, qol: -3 }, ind: { strikes: 60, trustgov: -4 }, next: ['rea_vard_strejk_akut', null], tip: 'Sjuksköterskor är envisa. Det är därför de klarar jobbet.' },
    ],
  },
  {
    id: 'rea_vard_strejk_akut', icon: '\u{1F691}', chain: true, kind: 'valfard',
    title: 'AKUTEN I {STAD} STÄNGER',
    text: 'Strejken går på fjärde veckan. Skyddsarbetarna har jobbat dubbla pass sedan starten, och i natt sa överläkaren stopp: akuten i {stad} tar inte emot fler patienter. Ambulanserna kör nu nittio kilometer till grannlänet, och en barnmorska berättar i radio att hon förlöst ett barn på motorvägen.',
    choices: [
      { text: 'GE FÖRBUNDET VAD DET VILL HA', cost: { money: 900 }, undo: 'healthcare_quality', griev: -30, temp: { unrest: -6, approval: 3 }, tip: 'Dyrt. Men barnen föds på BB igen.' },
      { text: 'SKICKA IN MILITÄRENS SJUKVÅRDARE', cost: { man: 6 }, temp: { readiness: -4, stability: 2 }, griev: 10, ind: { trustgov: -5 }, tip: 'Fältsjukvård är bra på mycket. Förlossningar är inte en av sakerna.' },
      { text: 'TVÅNGSLAG: STREJKEN ÄR OLAGLIG', temp: { freedom: -4, unrest: 8, approval: -6 }, griev: 14, perm: { statepower: 2 }, ind: { trustgov: -7, protests: 40 }, tip: 'De går tillbaka till jobbet. Med uppsägningen i fickan.' },
    ],
  },
  {
    id: 'rea_vard_strejk_avtal', icon: '\u{1F382}', chain: true, kind: 'valfard',
    title: 'VÅRDAVTALET ÄR KLART',
    text: 'Klockan fyra i morse skakade förbundets ordförande hand med statens förhandlare. Avtalet ger högre lön för nattpass och ett tak på tio patienter per sjuksköterska. Operationsköerna är långa efter strejken, men på sjukhuset i {stad} bakar personalen tårta åt patienterna.',
    choices: [
      { text: 'GODKÄNN AVTALET', cost: { money: 400 }, griev: -18, temp: { approval: 4, qol: 2 }, perm: { welfare: 1 }, tip: 'Tårtan är god. Avtalet är bättre.' },
      { text: 'GODKÄNN, MEN STRYK PATIENTTAKET', griev: -6, temp: { approval: 1 }, res: { money: 100 }, next: ['rea_vard_strejk_akut', null], tip: 'Halva avtalet. Halva tårtan. Kanske en ny strejk.' },
    ],
  },
  {
    id: 'rea_vard_koer', icon: '\u{23F3}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'KÖN TILL HÖFTOPERATIONEN',
    text: 'Sedan vårdens kvalitet sänktes har väntetiden för en ny höft gått från tre månader till över ett år. Pensionärer i {stad} åker på bussresor till privatkliniker i {granne}, där operationen kostar en halv årspension. Patientföreningen samlar in pengar till dem som inte har råd.',
    when: (c) => c.cut('healthcare_quality') && (c.ind.carewait ?? 30) > 20,
    choices: [
      { text: 'ÅTERSTÄLL VÅRDENS KVALITET', cost: { pp: 15 }, undo: 'healthcare_quality', griev: -22, temp: { approval: 4 }, tip: 'Köerna krymper. Långsamt, men de krymper.' },
      { text: 'VÅRDGARANTI: STATEN BETALAR RESAN', cost: { money: 500 }, griev: -10, temp: { qol: 2 }, rel: 2, tip: 'Pengarna hamnar i {granne}. Höfterna hamnar på plats.' },
      { text: 'KÖERNA ÄR PRISET FÖR EN BUDGET I BALANS', griev: 7, temp: { qol: -3, approval: -3 }, res: { money: 150 }, tip: 'Pensionärerna har räknat. De är inte imponerade.' },
    ],
  },
  {
    id: 'rea_vard_lakare', icon: '\u{2708}\u{FE0F}', weight: 2, cooldown: 1000,
    kind: 'valfard', react: true,
    title: 'LÄKARNA FLYTTAR TILL {GRANNE}',
    text: 'Rekryterare från {granne} har hyrt en konferenssal på ett hotell i {huvudstad} och erbjuder dubbel lön, flyttbidrag och hjälp med bostad. Sedan neddragningarna i vården har över trehundra läkare och barnmorskor tackat ja. I småstäderna står mottagningar tomma på måndagarna.',
    when: (c) => c.cut('healthcare_quality') && c.st.qol < 25,
    choices: [
      { text: 'BACKA NEDDRAGNINGEN', cost: { pp: 15 }, undo: 'healthcare_quality', griev: -20, temp: { approval: 3 }, tip: 'Några kommer hem igen. De flesta har redan köpt soffa.' },
      { text: 'LÖNETILLÄGG FÖR LÄKARE PÅ LANDET', cost: { money: 500 }, griev: -8, temp: { qol: 2 }, perm: { hdi: 1 }, tip: 'Dyrt. Men det är dyrare att inte ha någon läkare alls.' },
      { text: 'LÅT DEM GÅ - VI UTBILDAR NYA', griev: 6, temp: { qol: -4, hdi: -2 }, tip: 'Utbildningen tar elva år. Resväskan tar en kväll.' },
    ],
  },
  {
    id: 'rea_vard_tack', icon: '\u{1F49A}', weight: 2,
    kind: 'valfard', react: true,
    title: 'TACK FRÅN BARNAVDELNINGEN',
    text: 'Sedan vården fick mer resurser har köerna börjat krympa, och barnavdelningen i {stad} har öppnat sex nya vårdplatser. En sjuårig flicka har ritat sjukhuset med en regnbåge över, och teckningen hänger nu i regeringskansliet. Landstingens ekonomer påpekar försiktigt att pengarna måste komma varje år, inte bara i år.',
    when: (c) => c.raised('healthcare', 'healthcare_quality'),
    choices: [
      { text: 'BJUD IN PERSONALEN TILL EN MOTTAGNING', cost: { money: 100 }, griev: -10, temp: { approval: 5, stability: 2 }, tip: 'Smörgåstårta i kanslihuset. Billigaste reformen hittills.' },
      { text: 'SKRIV IN PENGARNA I EN LÅNGTIDSBUDGET', cost: { pp: 10 }, perm: { welfare: 2, hdi: 1, income: -1 }, griev: -6, tip: 'Tråkigt för journalisterna. Underbart för sjukhusen.' },
      { text: 'TA ÄRAN I EN STOR KAMPANJ', temp: { approval: 6, ideopower: 2 }, griev: -4, tip: 'Affischen visar dig. Teckningen var bättre.' },
    ],
  },

  // ===== VÄLFÄRDEN OCH TRYGGHETEN =====
  {
    id: 'rea_valf_matbank', icon: '\u{1F96B}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'KÖN UTANFÖR MATBANKEN',
    text: 'Sedan välfärden skars ned har kön utanför kyrkans matbank i {stad} blivit två kvarter lång. Där står ensamstående mammor, en före detta lärare och studenter som inte längre får bostadsbidrag. Socialsekreterarna har fyra månaders väntetid och har börjat skriva insändare i lokaltidningen.',
    when: (c) => c.cut('welfare'),
    choices: [
      { text: 'ÅTERSTÄLL VÄLFÄRDEN', cost: { pp: 15 }, undo: 'welfare', griev: -24, temp: { approval: 4, polpower: -3 }, tip: 'Kön krymper. Matbanken behövs fortfarande, men mindre.' },
      { text: 'STATSBIDRAG TILL MATBANKERNA', cost: { money: 250 }, griev: -8, temp: { qol: 2 }, tip: 'Staten betalar för att hjälpa dem som staten slutat hjälpa.' },
      { text: 'FLER JOBBCOACHER, INTE BIDRAG', griev: 7, temp: { qol: -3, approval: -2 }, ind: { homeless: 8 }, tip: 'Coacherna är duktiga. Jobben finns bara inte i {stad}.' },
    ],
  },
  {
    id: 'rea_valf_hunger', icon: '\u{1F4E2}', weight: 3, cooldown: 1200,
    kind: 'valfard', react: true,
    title: 'HUNGERMARSCHEN',
    text: 'Missnöjet efter beslutet om {lag} har fått ett ansikte. Från de nedlagda bruksorterna går tusentals människor till fots mot {huvudstad}, tre veckor längs landsvägen. Bönder ställer ut kaffe och bullar vid vägkanten, och varje kväll är tåget längre än kvällen innan.',
    when: (c) => c.cut('welfare', 'pensions', 'healthcare', 'healthcare_quality', 'unions', 'minimum_wage') && c.grievOf('valfard') > 20,
    choices: [
      { text: 'MÖT DEM PÅ TORGET OCH ÅTERSTÄLL {LAG}', cost: { pp: 20 }, undo: true, griev: -28, temp: { approval: 6, polpower: -5 }, tip: 'En ledare som lyssnar. Eller en som viker sig. Beror på tidningen.' },
      { text: 'LOVA ETT KRISPAKET FÖR BRUKSORTERNA', cost: { money: 700 }, griev: -10, temp: { unrest: -3 }, next: ['rea_valf_hunger_pakt', null], tip: 'Löftet måste hållas. Marschen har gott minne.' },
      { text: 'STÄNG VÄGARNA IN TILL {HUVUDSTAD}', temp: { unrest: 8, freedom: -3, approval: -5 }, griev: 12, ind: { protests: 60, trustgov: -5 }, next: ['rea_valf_hunger_kravall', 'rea_valf_hunger_pakt'], tip: 'De går över åkrarna i stället. Kamerorna följer med.' },
    ],
  },
  {
    id: 'rea_valf_hunger_kravall', icon: '\u{1F525}', chain: true, kind: 'valfard',
    title: 'KRAVALLER I {HUVUDSTAD}',
    text: 'När marschen stoppades vid stadsgränsen kokade det över. Under natten krossades skyltfönster längs huvudgatan och tre bussar sattes i brand. De flesta i marschen hade redan gått hem - det var andra som tog över. På morgonen sopar marschens egna deltagare upp glaset och säger i tv att det inte var så här de ville ha det.',
    choices: [
      { text: 'BACKA {LAG} OCH TILLSÄTT EN KOMMISSION', cost: { pp: 20 }, undo: true, griev: -25, temp: { unrest: -6, statepower: -3 }, tip: 'Kommissionen arbetar i två år. Gatorna lugnar sig i två dagar.' },
      { text: 'UTEGÅNGSFÖRBUD OCH KRAVALLPOLIS', cost: { money: 200 }, temp: { safety: 3, freedom: -4, unrest: 4 }, griev: 10, ind: { trustgov: -4, policetrust: -4 }, tip: 'Det blir tyst. Inte lugnt, men tyst.' },
      { text: 'BJUD IN MARSCHLEDARNA TILL SAMTAL', griev: -10, temp: { unrest: -3, approval: 2 }, next: 'rea_valf_hunger_pakt', tip: 'Skilj på dem som gick och dem som kastade sten.' },
    ],
  },
  {
    id: 'rea_valf_hunger_pakt', icon: '\u{1F4DC}', chain: true, kind: 'valfard',
    title: 'DET SOCIALA FÖRDRAGET',
    text: 'Marschledarna, facken, kommunerna och regeringen har suttit i tio dagar på en kursgård utanför {huvudstad}. Resultatet kallas fördraget från {stad}: en jobbsatsning i bruksorterna, ett golv i försörjningsstödet och en lovad översyn av {lag}. Marschen tar tåget hem - biljetterna betalade av staten.',
    choices: [
      { text: 'SKRIV UNDER FÖRDRAGET', cost: { money: 600 }, griev: -22, temp: { stability: 4, unrest: -5, approval: 4 }, ind: { trustgov: 4 }, tip: 'En sällsynt sak i politiken: alla fick något.' },
      { text: 'SKRIV UNDER - OCH GLÖM ÖVERSYNEN', griev: -8, temp: { approval: 2 }, next: ['rea_valf_hunger_kravall', null], tip: 'Löften som glöms brukar påminna om sig själva.' },
    ],
  },
  {
    id: 'rea_valf_hojd', icon: '\u{1F9FE}', weight: 2,
    kind: 'valfard', react: true,
    title: 'BIDRAGEN HÖJS - VEM BETALAR?',
    text: 'Den utbyggda välfärden har tagits emot med lättnad i landets hyreshus. Barnfamiljer har råd med vinterskor igen och socialkontoren har kortare köer. Men centralbanken varnar för att mer pengar i omlopp kan driva upp priserna, och det finanspolitiska rådet undrar i en rapport var de nya miljarderna ska komma ifrån.',
    when: (c) => c.raised('welfare'),
    choices: [
      { text: 'HÖJ SKATTEN FÖR DE RIKASTE', cost: { pp: 15 }, perm: { income: 2 }, griev: -8, temp: { gdp: -1 }, tip: 'De rika har revisorer. Revisorerna har idéer.' },
      { text: 'LÅNA - TILLVÄXTEN BETALAR SENARE', temp: { qol: 3, approval: 3 }, perm: { income: -2 }, ind: { infl: 0.5 }, griev: -6, tip: 'Senare kommer alltid. Det är det enda säkra med senare.' },
      { text: 'INFÖR ETT TAK FÖR BIDRAGEN', temp: { approval: -2 }, perm: { income: 1 }, griev: 4, tip: 'Lagom generöst. Lagom populärt.' },
    ],
  },

  // ===== MINIMILÖNEN =====
  {
    id: 'rea_minlon_golv', icon: '\u{1F9F9}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'STÄDARNA STÄLLER UNDAN KVASTEN',
    text: 'Efter att minimilönen sänktes har städare, diskare och lagerarbetare i {huvudstad} gått ut i vild strejk. Kontorshusen luktar sopor efter tre dagar, restaurangerna har stängt och lagren skickar inga paket. "Vi kan inte leva på mindre", säger en diskare som jobbat på samma restaurang i nitton år.',
    when: (c) => c.cut('minimum_wage'),
    choices: [
      { text: 'ÅTERSTÄLL MINIMILÖNEN', cost: { pp: 15 }, undo: 'minimum_wage', griev: -24, temp: { approval: 4 }, tip: 'Soporna töms i morgon bitti.' },
      { text: 'SKATTELÄTTNAD FÖR LÅGINKOMSTTAGARE', cost: { money: 400 }, griev: -10, temp: { qol: 2 }, perm: { income: -1 }, tip: 'Lönen är lägre, skatten också. Ungefär jämnt.' },
      { text: 'STÅ FAST: FLER UNGA FÅR JOBB', griev: 9, temp: { unrest: 5, approval: -3 }, ind: { strikes: 50, youthunemp: -0.5 }, tip: 'Fler jobb. Sämre jobb. Statistiken visar bara det första.' },
    ],
  },
  {
    id: 'rea_minlon_hojd', icon: '\u{2615}', weight: 2,
    kind: 'valfard', react: true,
    title: 'KAFÉÄGARNA RÄKNAR',
    text: 'Den höjda minimilönen har gett lagerarbetare och vårdbiträden ett lyft de märker i plånboken. Men på kaféet vid torget i {stad} har ägaren satt upp en lapp: "Vi tar inga sommarjobbare i år." Småföretagarnas förening räknar med att många unga blir utan sitt första jobb.',
    when: (c) => c.raised('minimum_wage'),
    choices: [
      { text: 'LÖNESTÖD FÖR UNGAS FÖRSTA JOBB', cost: { money: 400 }, temp: { approval: 3 }, griev: -6, ind: { youthunemp: -1 }, tip: 'Staten betalar halva lönen första året. Kaféet tar tre sommarjobbare.' },
      { text: 'LÅT LÖNERNA STIGA', temp: { qol: 3, gdp: -1 }, griev: -8, ind: { youthunemp: 1, infl: 0.3 }, tip: 'Kanelbullen kostar en krona mer. Diskaren har råd med den.' },
      { text: 'INFÖR EN LÄGRE LÖN FÖR UNGDOMAR', cost: { pp: 10 }, law: ['minimum_wage', 'youth'], griev: 6, temp: { approval: -2 }, ind: { youthunemp: -1.5 }, tip: 'Samma jobb, lägre lön, för att man är nitton. Ungdomarna är inte förtjusta.' },
    ],
  },

  // ===== SEMESTERN =====
  {
    id: 'rea_semester_bort', icon: '\u{26FA}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'SOMMAREN SOM KRYMPTE',
    text: 'Sedan semestern kortades är campingplatserna längs kusten halvtomma i juli. Stuguthyrare går back, glasskiosken i hamnen i {stad} har stängt och föräldrar pusslar med barnvakter för att få ihop sommarlovet. Facket har startat en kampanj: "Ge oss sommaren tillbaka".',
    when: (c) => c.cut('vacation'),
    choices: [
      { text: 'ÅTERSTÄLL SEMESTERN', cost: { pp: 12 }, undo: 'vacation', griev: -22, temp: { approval: 4, qol: 2 }, tip: 'Glasskiosken öppnar igen. Lagom till regnet.' },
      { text: 'EN EXTRA HELGDAG SOM PLÅSTER', cost: { money: 150 }, griev: -8, temp: { qol: 2, factory: -1 }, tip: 'Folk tackar och tar tre dagar ledigt runt den.' },
      { text: 'STÅ FAST: FABRIKERNA BEHÖVER FOLKET', griev: 8, temp: { factory: 2, qol: -3, approval: -3 }, ind: { happiness: -0.1 }, tip: 'Produktionen ökar. Humöret gör det inte.' },
    ],
  },
  {
    id: 'rea_semester_mer', icon: '\u{1F3D6}\u{FE0F}', weight: 2,
    kind: 'valfard', react: true,
    title: 'DEN FEMTE SEMESTERVECKAN',
    text: 'Den längre semestern har gjort landet ovanligt glatt. Resebyråerna slår rekord, stugbyarna är fullbokade och sjukskrivningarna i augusti har minskat. Exportföretagen är mindre glada: en stor order från {land} får vänta medan halva fabriken badar.',
    when: (c) => c.raised('vacation'),
    choices: [
      { text: 'NJUT AV DET', griev: -10, temp: { qol: 4, approval: 3, factory: -2 }, ind: { happiness: 0.1 }, tip: 'Landet har aldrig varit så solbränt.' },
      { text: 'LÅT FÖRETAGEN SPRIDA UT LEDIGHETEN', cost: { pp: 8 }, temp: { qol: 2, factory: 1 }, griev: -5, tip: 'Semester i november. Folk är skeptiska men tacksamma.' },
      { text: 'SKATTEAVDRAG FÖR EXPORTFÖRETAGEN', cost: { money: 300 }, temp: { factory: 2, gdp: 1 }, griev: -4, tip: 'Ordern från {land} hinner i tid. Med en dags marginal.' },
    ],
  },

  // ===== ARBETSTIDEN =====
  {
    id: 'rea_arbtid_lang', icon: '\u{23F0}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'LÄNGRE DAGAR, KORTARE KVÄLLAR',
    text: 'Sedan arbetstiden förlängdes hämtas barnen på förskolan i {stad} allt senare, och personalen där jobbar själv längre. Läkare rapporterar fler utbrända patienter och tågbolaget har fått klagomål om trötta förare. Arbetsgivarna pekar på att produktionen ökat med fyra procent.',
    when: (c) => c.cut('workhours'),
    choices: [
      { text: 'ÅTERSTÄLL ARBETSTIDEN', cost: { pp: 12 }, undo: 'workhours', griev: -20, temp: { approval: 3 }, tip: 'Middagen hemma klockan sex igen.' },
      { text: 'RÄTT ATT TACKA NEJ TILL ÖVERTID', cost: { pp: 8 }, griev: -8, temp: { qol: 2, factory: -1 }, tip: 'De flesta tackar ja ändå. Men de fick välja.' },
      { text: 'STÅ FAST: VI BEHÖVER PRODUKTIONEN', griev: 8, temp: { factory: 3, qol: -4, approval: -2 }, ind: { strikes: 30 }, tip: 'Fyra procent mer produktion. Hundra procent tröttare folk.' },
    ],
  },
  {
    id: 'rea_arbtid_kort', icon: '\u{1F4C5}', weight: 2,
    kind: 'valfard', react: true,
    title: 'FREDAGAR UTAN JOBB',
    text: 'Den kortare arbetsveckan har gjort fredagen till landets nya favoritdag. Föräldrar hämtar barnen tidigt, idrottsföreningarna har fått fler ledare och sjukskrivningarna sjunker. Men vårdcentralerna och bussbolagen måste anställa fler för att hålla öppet, och de som ska anställas finns inte.',
    when: (c) => c.raised('workhours'),
    choices: [
      { text: 'UTBILDA FLER BUSSFÖRARE OCH UNDERSKÖTERSKOR', cost: { money: 400 }, temp: { qol: 3 }, perm: { welfare: 1 }, griev: -8, tip: 'Om ett år finns de. Fram till dess går bussen varannan timme.' },
      { text: 'UNDANTAG FÖR VÅRD OCH KOLLEKTIVTRAFIK', cost: { pp: 8 }, temp: { qol: 2, approval: -1 }, griev: -3, tip: 'Alla får kortare vecka utom de som redan har tyngst jobb.' },
      { text: 'LÅT PRODUKTIVITETEN LÖSA DET', temp: { qol: 4, factory: -3 }, griev: -6, ind: { happiness: 0.15 }, tip: 'Utvilade människor jobbar bättre. Hoppas ekonomerna.' },
    ],
  },

  // ===== FÖRÄLDRALEDIGHETEN OCH BARNOMSORGEN =====
  {
    id: 'rea_foraldr_vagn', icon: '\u{1F476}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'BARNVAGNSMARSCHEN',
    text: 'Sedan föräldraledigheten kortades har tusentals föräldrar rullat barnvagnar genom {huvudstad} i en tyst marsch. Många har räknat ut att en av dem måste tillbaka till jobbet när barnet är fyra månader, och förskolorna tar inte emot så små barn. Barnmorskor och barnläkare går först i tåget.',
    when: (c) => c.cut('parental_leave'),
    choices: [
      { text: 'ÅTERSTÄLL FÖRÄLDRALEDIGHETEN', cost: { pp: 12 }, undo: 'parental_leave', griev: -22, temp: { approval: 4 }, tip: 'Barnvagnarna rullar hem. Några somnade redan på vägen.' },
      { text: 'BYGG FLER SPÄDBARNSPLATSER I FÖRSKOLAN', cost: { money: 450 }, griev: -8, perm: { welfare: 1 }, temp: { qol: 1 }, tip: 'Fyramånadersbebisar på förskola. Ingen är riktigt glad.' },
      { text: 'STÅ FAST: ARBETSMARKNADEN BEHÖVER DEM', griev: 8, temp: { factory: 2, approval: -3, qol: -2 }, ind: { protests: 20 }, tip: 'Statistikerna märker det senare: färre barn föds.' },
    ],
  },
  {
    id: 'rea_foraldr_pappa', icon: '\u{1F37C}', weight: 2,
    kind: 'valfard', react: true,
    title: 'PAPPORNA I PARKEN',
    text: 'Den utbyggda föräldraledigheten syns i parkerna: på tisdagsförmiddagarna är det nu lika många pappor som mammor vid sandlådorna i {stad}. Barnmorskorna är nöjda, men småföretagare klagar på att det är svårt att hitta vikarier, och försäkringskassan har fått beställa nya datorer för att hinna med.',
    when: (c) => c.raised('parental_leave'),
    choices: [
      { text: 'VIKARIESTÖD TILL SMÅFÖRETAGEN', cost: { money: 300 }, griev: -8, temp: { approval: 3, gdp: 1 }, tip: 'Bageriet får en vikarie. Bagaren får byta blöjor.' },
      { text: 'FIRA MED EN BARNFESTIVAL', cost: { money: 100 }, temp: { approval: 4, qol: 2 }, griev: -6, tip: 'Ballonger, korv och fyrtiotusen trötta föräldrar.' },
      { text: 'LÅT FÖRETAGEN LÖSA DET SJÄLVA', temp: { qol: 3, factory: -2 }, griev: -5, ind: { happiness: 0.1 }, tip: 'De löser det. Med en del suckar.' },
    ],
  },
  {
    id: 'rea_barnoms_stang', icon: '\u{1F9F8}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'FÖRSKOLAN STÄNGER KLOCKAN TRE',
    text: 'Efter nedskärningarna i barnomsorgen har förskolorna i {stad} kortat öppettiderna och slagit ihop grupper: tjugofyra barn på tre vuxna. Föräldrar som jobbar i vården och i butiker kan inte hämta klockan tre, så mor- och farföräldrar får rycka in. Flera undersköterskor går ner på deltid för att få ihop vardagen.',
    when: (c) => c.cut('childcare'),
    choices: [
      { text: 'ÅTERSTÄLL BARNOMSORGEN', cost: { pp: 12 }, undo: 'childcare', griev: -22, temp: { approval: 4 }, tip: 'Farmor får sina eftermiddagar tillbaka.' },
      { text: 'KVÄLLSÖPPNA FÖRSKOLOR FÖR VÅRDPERSONAL', cost: { money: 300 }, griev: -8, temp: { qol: 1, factory: 1 }, tip: 'Nattsjuksköterskornas barn sover på förskolan. Det fungerar.' },
      { text: 'FAMILJERNA FÅR LÖSA DET', griev: 8, temp: { factory: -2, qol: -3 }, tip: 'Familjerna löser det. Arbetsmarknaden förlorar en deltid i taget.' },
    ],
  },
  {
    id: 'rea_barnoms_gratis', icon: '\u{1F3A8}', weight: 2,
    kind: 'valfard', react: true,
    title: 'FÖRSKOLA I BANKHALLEN',
    text: 'Den utbyggda barnomsorgen har gjort att tusentals föräldrar, mest mammor, kunnat gå upp till heltid. Men köerna växer snabbare än lokalerna: i {stad} har kommunen öppnat förskola i en gammal bankhall, och förskollärare är nu det mest eftersökta yrket i platsannonserna.',
    when: (c) => c.raised('childcare'),
    choices: [
      { text: 'BYGG FÖRSKOLOR OCH UTBILDA PERSONAL', cost: { money: 600 }, perm: { welfare: 2, factory: 1 }, griev: -10, tip: 'Om två år finns platserna. Bankvalvet blir lekrum under tiden.' },
      { text: 'TA IN OUTBILDADE VIKARIER UNDER TIDEN', temp: { factory: 2, qol: 1 }, griev: -4, tip: 'Snälla vuxna. Inte alltid pedagoger.' },
      { text: 'HÖJ AVGIFTEN FÖR DE RIKASTE FAMILJERNA', cost: { pp: 8 }, perm: { income: 1 }, griev: -3, tip: 'De rikaste klagar. De har också råd att klaga.' },
    ],
  },

  // ===== SKOLAN =====
  {
    id: 'rea_skola_strejk', icon: '\u{1F4DA}', weight: 3, cooldown: 1000,
    kind: 'valfard', react: true,
    title: 'LÄRARNA GÅR UT I STREJK',
    text: 'Nedskärningen i skolan betyder större klasser och färre speciallärare. Lärarförbundet har sagt nej till att undervisa trettiofem elever i varje klassrum och lagt ned arbetet på skolorna i {stad} och {huvudstad}. Föräldrarna tar med barnen till jobbet, och eleverna i nian oroar sig för betygen.',
    when: (c) => c.cut('education') && c.day > 30,
    choices: [
      { text: 'ÅTERSTÄLL SKOLAN', cost: { pp: 15 }, undo: 'education', griev: -24, temp: { approval: 4 }, tip: 'Lärarna går tillbaka på måndag. Eleverna är nästan besvikna.' },
      { text: 'ERBJUD ETT LÖNELYFT, MEN KLASSERNA BLIR STORA', cost: { money: 500 }, griev: -8, next: ['rea_skola_avtal', 'rea_skola_stangd'], tip: 'Lärarna vill ha tid, inte bara pengar. Kanske.' },
      { text: 'STÅ FAST: STREJKEN ÄR LÄRARNAS ANSVAR', griev: 9, temp: { unrest: 4, approval: -4 }, ind: { strikes: 50, trustgov: -3 }, next: ['rea_skola_stangd', null], tip: 'Föräldrarna håller inte med. De har barnen hemma.' },
    ],
  },
  {
    id: 'rea_skola_stangd', icon: '\u{1F3EB}', chain: true, kind: 'valfard',
    title: 'SKOLORNA HAR VARIT STÄNGDA I SEX VECKOR',
    text: 'Lärarstrejken har pågått i sex veckor. Niondeklassarna i {stad} har startat egna studiecirklar på biblioteket, pensionerade lärare undervisar gratis i församlingshemmen och en grupp föräldrar har stämt staten för brott mot skolplikten. Oppositionen kräver att utbildningsministern avgår.',
    choices: [
      { text: 'GE LÄRARNA DERAS KRAV', cost: { money: 700 }, undo: 'education', griev: -28, temp: { approval: 3, unrest: -5 }, tip: 'Dyrt och sent. Men skolorna öppnar.' },
      { text: 'LÅT UTBILDNINGSMINISTERN AVGÅ', cost: { pp: 15 }, griev: -12, temp: { approval: 4, stability: -2 }, next: ['rea_skola_avtal', null], tip: 'En ny minister, samma budget. Men en ny ton.' },
      { text: 'TVÅNGSLAG OM ATT ÖPPNA SKOLORNA', griev: 14, temp: { freedom: -3, unrest: 7 }, perm: { research: -1 }, ind: { trustgov: -6 }, tip: 'Lärarna kommer tillbaka. Lusten gör det inte.' },
    ],
  },
  {
    id: 'rea_skola_avtal', icon: '\u{270F}\u{FE0F}', chain: true, kind: 'valfard',
    title: 'SKOLFREDEN',
    text: 'Lärarförbundet och staten har kommit överens: lärarlönerna höjs i tre steg och varje skola får en extra speciallärare, men klasserna blir större än förr. Skolorna i {stad} öppnar på måndag. Niorna får extra lektioner på lördagar fram till sommaren, vilket de tar emot med blandade känslor.',
    choices: [
      { text: 'GODKÄNN SKOLFREDEN', cost: { money: 400 }, griev: -18, temp: { approval: 3, stability: 2 }, perm: { research: 1 }, tip: 'Lördagslektioner. Niorna kommer att minnas dig.' },
      { text: 'GODKÄNN, MEN UTAN SPECIALLÄRARNA', griev: -6, res: { money: 100 }, temp: { approval: -1 }, tip: 'De elever som behövde mest får minst. Igen.' },
    ],
  },
  {
    id: 'rea_skola_lyft', icon: '\u{1F393}', weight: 2,
    kind: 'valfard', react: true,
    title: 'FÄRRE ELEVER PER LÄRARE',
    text: 'Sedan skolan fick mer resurser har klasserna krympt, varje skola i {stad} har fått en skolsköterska på heltid och lärare som lämnat yrket har börjat söka sig tillbaka. Resultaten i matematik har ännu inte rört sig - forskarna säger att det tar flera år - men skolkandet har minskat.',
    when: (c) => c.raised('education'),
    choices: [
      { text: 'LOVA ATT HÅLLA I SATSNINGEN I TIO ÅR', cost: { pp: 10 }, perm: { research: 1, hdi: 1, income: -1 }, griev: -8, tip: 'Skolan behöver ro mer än den behöver reformer.' },
      { text: 'MÄT RESULTATEN MED NATIONELLA PROV', cost: { money: 100 }, temp: { research: 1 }, griev: -4, tip: 'Mätningar visar sanningen. Även när den dröjer.' },
      { text: 'BERÄTTA OM DET I VALRÖRELSEN', temp: { approval: 4 }, griev: -5, tip: 'Skolsköterskan i {stad} blir affischnamn mot sin vilja.' },
    ],
  },

  // ===== BOSTÄDERNA =====
  {
    id: 'rea_bostad_hyra', icon: '\u{1F3E2}', weight: 2, cooldown: 800,
    kind: 'valfard', react: true,
    title: 'HYRESSTREJKEN I {STAD}',
    text: 'Sedan bostadspolitiken ändrades har hyrorna i de gamla hyreshusen i {stad} höjts med en tredjedel efter "renoveringar" som mest bestod av nya kranar. Nu har sexhundra hushåll slutat betala hyran och sätter i stället in pengarna på ett konto hos hyresgästföreningen. Fastighetsbolaget har stämt dem alla.',
    when: (c) => c.cut('housing'),
    choices: [
      { text: 'ÅTERSTÄLL BOSTADSPOLITIKEN', cost: { pp: 15 }, undo: 'housing', griev: -22, temp: { approval: 4 }, tip: 'Kranarna får sitta kvar. Hyran går tillbaka.' },
      { text: 'TAK FÖR HYRESHÖJNINGAR VID RENOVERING', cost: { pp: 8 }, griev: -10, temp: { qol: 2, gdp: -1 }, tip: 'Fastighetsbolaget renoverar mindre. Hyresgästerna sover bättre.' },
      { text: 'LÅT DOMSTOLEN AVGÖRA', griev: 8, temp: { unrest: 4 }, ind: { homeless: 10 }, tip: 'Domstolen tar två år. Vräkningarna tar två veckor.' },
    ],
  },
  {
    id: 'rea_bostad_lyft', icon: '\u{1F3D7}\u{FE0F}', weight: 2,
    kind: 'valfard', react: true,
    title: 'KRANARNA ÄR TILLBAKA',
    text: 'Sedan bostadspolitiken lades om står byggkranarna tätt i {stad}. Kommunen har sålt mark billigt för hyresrätter och bostadskön har för första gången på femton år blivit kortare. Byggföretagen jublar, men grannarna i villaområdet bredvid samlar namn mot "betongklossarna" som skymmer kvällssolen.',
    when: (c) => c.raised('housing'),
    choices: [
      { text: 'BYGG VIDARE - FOLK BEHÖVER BOSTÄDER', temp: { qol: 3, gdp: 2, approval: 1 }, griev: -8, ind: { houseprice: -3 }, tip: 'Kvällssolen flyttar. Unga familjer flyttar in.' },
      { text: 'LYSSNA PÅ GRANNARNA OCH BYGG LÄGRE', cost: { pp: 5 }, temp: { approval: 3 }, griev: -4, tip: 'Tre våningar i stället för åtta. Kön krymper långsammare.' },
      { text: 'STARTLÅN TILL UNGA SOM KÖPER FÖRSTA BOSTADEN', cost: { money: 500 }, perm: { qol: 2 }, griev: -8, ind: { homeless: -8 }, tip: 'Den första nyckeln är den viktigaste.' },
    ],
  },

  // ===== FACKEN =====
  {
    id: 'rea_fack_svar', icon: '\u{270A}', weight: 3, cooldown: 1200,
    kind: 'valfard', react: true,
    title: 'FACKEN SVARAR',
    text: 'Beslutet om facken har fått landsorganisationen att kalla till krismöte. I kväll fattade styrelsen ett beslut som inte tagits på fyrtio år: alla förbund förbereder strejk. Hamnarbetarna i {stad} har redan lagt ned arbetet, och lokförarna meddelar att de följer efter på måndag.',
    when: (c) => c.cut('unions'),
    choices: [
      { text: 'BACKA: FACKENS RÄTTIGHETER ÅTERSTÄLLS', cost: { pp: 15 }, undo: 'unions', griev: -25, temp: { approval: 3, polpower: -4 }, tip: 'Hamnen öppnar i morgon. Arbetsgivarna suckar - av lättnad och av ilska.' },
      { text: 'KALLA TILL TREPARTSSAMTAL', cost: { pp: 8 }, griev: -8, next: ['rea_fack_uppgor', 'rea_fack_general'], tip: 'Facken, arbetsgivarna och staten vid samma bord. Det har hänt förr.' },
      { text: 'LÅT DEM STREJKA - LAGEN GÄLLER', griev: 12, temp: { unrest: 6, factory: -3 }, ind: { strikes: 70, trustgov: -4 }, next: ['rea_fack_general', null], tip: 'Lagen gäller. Det gör strejkkassorna också.' },
    ],
  },
  {
    id: 'rea_fack_general', icon: '\u{1F6D1}', chain: true, kind: 'valfard',
    title: 'GENERALSTREJKEN',
    text: 'Klockan sex i morse stannade landet. Inga tåg, inga bussar, inga lastbilar i hamnarna. Butikerna har chefer bakom kassorna och sjukhusen kör med skyddsbemanning. På stortorget i {huvudstad} står hundratusen människor i regnet. Strejkkassorna räcker i sex veckor, säger facket. Statskassan förlorar en förmögenhet varje dag.',
    choices: [
      { text: 'GE UPP: FACKLAGARNA ÅTERSTÄLLS', undo: 'unions', griev: -30, temp: { approval: 2, polpower: -8, statepower: -3 }, tip: 'Landet startar igen i morgon. Din auktoritet startar senare.' },
      { text: 'FÖRHANDLA OM EN MELLANVÄG', cost: { pp: 15, money: 300 }, griev: -12, temp: { unrest: -4 }, next: 'rea_fack_uppgor', tip: 'Ingen vinner en generalstrejk. Någon måste avsluta den.' },
      { text: 'MILITÄREN KÖR TÅGEN', cost: { man: 8 }, mod: 'general_strike', griev: 15, temp: { freedom: -4, unrest: 8, approval: -6 }, ind: { trustgov: -8, strikes: 80, gdpgrowth: -0.6 }, tip: 'Soldaterna kan köra tåg. De kan inte få folk att åka med dem.' },
    ],
  },
  {
    id: 'rea_fack_uppgor', icon: '\u{1F91D}', chain: true, kind: 'valfard',
    title: 'UPPGÖRELSEN I {HUVUDSTAD}',
    text: 'Efter fyra nätter på ett hotell i {huvudstad} har arbetsgivarna, facken och regeringen en uppgörelse. Strejkrätten finns kvar men varslen ska komma tidigare, och lönerna ska följa exportindustrins avtal. Ingen sida är nöjd, vilket enligt de gamla förhandlarna är det säkraste tecknet på ett bra avtal.',
    choices: [
      { text: 'SKRIV UNDER UPPGÖRELSEN', cost: { pp: 10 }, griev: -20, temp: { stability: 5, factory: 2, unrest: -4 }, perm: { stability: 1 }, ind: { strikes: -40 }, tip: 'Den gamla modellen. Den håller oftare än man tror.' },
      { text: 'LÅT ARBETSGIVARNA FÅ SISTA ORDET', griev: -5, temp: { factory: 3, approval: -2 }, next: ['rea_fack_general', null], tip: 'Facket skriver under. Med en knuten näve i fickan.' },
    ],
  },
  {
    id: 'rea_fack_starka', icon: '\u{1F3ED}', weight: 2,
    kind: 'valfard', react: true,
    title: 'FACKET FÅR EN PLATS I STYRELSEN',
    text: 'Sedan facken fick starkare ställning har medlemsantalet ökat med en fjärdedel. Arbetarna på verkstaden i {stad} har för första gången en plats i styrelsen. Arbetsgivarnas förbund varnar för att utländska ägare tvekar inför nya investeringar, och har bjudit in finansministern på lunch.',
    when: (c) => c.raised('unions'),
    choices: [
      { text: 'GÅ PÅ LUNCHEN OCH LUGNA INVESTERARNA', cost: { pp: 5 }, temp: { gdp: 1, approval: -1 }, griev: -4, ind: { stockcap: 3 }, tip: 'Laxen var god. Investerarna lugnare.' },
      { text: 'LÅT FACKEN OCH ÄGARNA HITTA TONEN', temp: { qol: 2, stability: 2 }, griev: -8, tip: 'Det tar ett år och fyra konflikter. Sedan fungerar det.' },
      { text: 'UTBILDA DE NYA FACKLIGA STYRELSELEDAMÖTERNA', cost: { money: 150 }, perm: { stability: 1 }, griev: -6, tip: 'En svetsare som läser balansräkningar. Ägarna blir förvånade.' },
    ],
  },

  // ===== VÄLFÄRDEN: ALLMÄNNA REAKTIONER =====
  {
    id: 'rea_v_namn', icon: '\u{270D}\u{FE0F}', weight: 2, cooldown: 700,
    kind: 'valfard', react: true,
    title: 'TREHUNDRATUSEN NAMN',
    text: 'En namninsamling mot ändringen av {lag} har på tre veckor fått trehundratusen underskrifter. Den startades av en undersköterska i {stad} vid köksbordet en söndagskväll. I dag bär hon själv in kartongerna till regeringskansliet, med sina tre barn och ett tjugotal journalister i släptåg.',
    when: (c) => c.cut(...VALFARD),
    choices: [
      { text: 'TA EMOT HENNE OCH BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -22, temp: { approval: 5 }, tip: 'Köksbordet vann. Det händer oftare än man tror.' },
      { text: 'TA EMOT KARTONGERNA OCH LOVA EN UTREDNING', cost: { pp: 5 }, griev: -6, temp: { approval: 1 }, tip: 'Utredningar är politikens kylskåp.' },
      { text: 'LÅT EN TJÄNSTEMAN KVITTERA DEM', griev: 6, temp: { approval: -3 }, tip: 'Bilden på kartongerna i entrén säger mer än tusen ord.' },
    ],
  },
  {
    id: 'rea_v_avgang', icon: '\u{1F4BC}', weight: 2, cooldown: 900,
    kind: 'valfard', react: true,
    title: 'GENERALDIREKTÖREN AVGÅR',
    text: 'Chefen för myndigheten som ska genomföra beslutet om {lag} har lämnat in sin avskedsansökan. I ett brev som läckt till pressen skriver hon att hon "inte kan genomföra något som skadar de människor vi finns till för". Två avdelningschefer har följt efter, och personalen applåderade när hon gick.',
    when: (c) => c.cut(...VALFARD) && c.grievOf('valfard') > 5,
    choices: [
      { text: 'BACKA {LAG} OCH BE HENNE STANNA', cost: { pp: 15 }, undo: true, griev: -20, temp: { stability: 2, approval: 3 }, tip: 'Hon stannar. Med ett starkare mandat än du.' },
      { text: 'TILLSÄTT EN LOJAL ERSÄTTARE', cost: { pp: 8 }, temp: { statepower: 3, approval: -2 }, griev: 4, tip: 'Den nya chefen säger ja till allt. Det är problemet.' },
      { text: 'TACKA FÖR INSATSEN OCH GÅ VIDARE', griev: 5, temp: { stability: -2 }, tip: 'Hennes brev ramas in på fler kontor än ditt porträtt.' },
    ],
  },
  {
    id: 'rea_v_stamning', icon: '\u{2696}\u{FE0F}', weight: 2, cooldown: 900,
    kind: 'valfard', react: true,
    title: 'STATEN STÄMS',
    text: 'En organisation för personer med funktionsnedsättning har stämt staten för ändringen av {lag}. De menar att beslutet bryter mot grundlagens skydd för den enskildes trygghet och mot konventioner landet skrivit under. Justitiedepartementets jurister bedömer chanserna som jämna. Rättegången börjar om en månad.',
    when: (c) => c.cut(...VALFARD),
    choices: [
      { text: 'FÖRLIKAS OCH BACKA {LAG}', cost: { pp: 10 }, undo: true, griev: -18, temp: { approval: 2 }, tip: 'Ingen dom, ingen förlust. Bara ett tyst nederlag.' },
      { text: 'GÅ TILL RÄTTEGÅNG', tip: 'Domstolen är oberoende. Det är det som är tanken.',
        risk: { chance: 0.5,
          win: { text: 'Domstolen ger staten rätt. Beslutet står sig, men det svider.', griev: 6, temp: { statepower: 2 } },
          lose: { text: 'Domstolen river upp beslutet. Lagen återställs och regeringen får hård kritik.', undo: true, griev: -15, temp: { approval: -4 }, ind: { trustgov: -4 } } } },
      { text: 'BYT UT DOMARNA I MÅLET', cost: { pp: 25 }, griev: 10, temp: { freedom: -5, statepower: 4 }, ind: { demo: -0.3, trustgov: -5 }, tip: 'Du vinner målet. Rättsstaten förlorar.' },
    ],
  },
  {
    id: 'rea_v_kampanj', icon: '\u{1F4E3}', weight: 2, cooldown: 900,
    kind: 'valfard', react: true,
    title: 'RÄDDA {LAG}!',
    text: 'Oppositionen har gjort ändringen av {lag} till sin stora fråga. Affischer med texten "RÄDDA {LAG}" sitter på varje busskur, och oppositionsledaren åker runt landet i en gammal folkabuss. I den senaste mätningen leder oppositionen med åtta procentenheter, och flera av dina egna ledamöter har börjat tala om att "lyssna".',
    when: (c) => c.cut(...VALFARD) && c.grievOf('valfard') > 8 && c.day > 60,
    choices: [
      { text: 'TA ÖVER FRÅGAN OCH BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -22, temp: { approval: 5, ideopower: -2 }, tip: 'Oppositionen står plötsligt utan valfråga. Och utan folkabuss.' },
      { text: 'MOTKAMPANJ: VI SÄKRAR FRAMTIDEN', cost: { money: 300 }, temp: { approval: 2 }, griev: -4, tip: 'Dina affischer har grafer. Deras har en gammal dam med katt.' },
      { text: 'LÅT DEM HÅLLA PÅ - VALET ÄR LÅNGT BORT', griev: 6, temp: { approval: -4, polpower: -2 }, tip: 'Valet är alltid närmare än man tror.' },
    ],
  },
  {
    id: 'rea_v_flytt', icon: '\u{1F9F3}', weight: 2, cooldown: 900,
    kind: 'valfard', react: true,
    title: 'FAMILJERNA FLYTTAR TILL {GRANNE}',
    text: 'Sedan beslutet om {lag} har flyttfirmorna i {stad} fullt upp. Unga familjer flyttar till {granne}, där tryggheten är bättre och lönerna högre. Det är sjuksköterskor, ingenjörer och snickare - precis de som behövs här. Kommunen har tappat tvåhundra skattebetalare på ett år.',
    when: (c) => c.cut(...VALFARD) && c.grievOf('valfard') > 10,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -18, temp: { approval: 3 }, tip: 'Några ångrar flytten. De flesta har redan börjat på nya jobb.' },
      { text: 'FLYTTBIDRAG FÖR DEM SOM KOMMER HEM', cost: { money: 400 }, temp: { gdp: 1, approval: 2 }, griev: -6, tip: 'Hemlängtan plus ett bidrag. En stark kombination.' },
      { text: 'DEN SOM VILL GÅ FÅR GÅ', griev: 5, temp: { gdp: -2, research: -1 }, tip: 'De går. Och de tar sina skattepengar med sig.' },
    ],
  },
  {
    id: 'rea_v_tack', icon: '\u{1F48C}', weight: 2, cooldown: 700,
    kind: 'valfard', react: true,
    title: 'BREVET FRÅN {STAD}',
    text: 'Ett handskrivet brev har kommit till regeringskansliet från en ensamstående mamma i {stad}. Hon skriver att beslutet om {lag} gjort att hon för första gången på flera år inte ligger vaken och räknar pengar. Brevet har lästs upp i morgonradion och delats en halv miljon gånger. Kritikerna undrar högljutt vad det kostar.',
    when: (c) => c.raised(...VALFARD),
    choices: [
      { text: 'SVARA HENNE MED ETT EGET BREV', temp: { approval: 4 }, griev: -8, tip: 'Handskrivet. Med stavfel. Folk älskar det.' },
      { text: 'VISA KRITIKERNA HUR DET FINANSIERAS', cost: { pp: 8 }, temp: { stability: 2, approval: 2 }, griev: -5, tip: 'Ett kalkylark mot ett brev. Brevet vinner, men kalkylarket behövs.' },
      { text: 'BJUD IN HENNE TILL EN PRESSKONFERENS', cost: { money: 50 }, tip: 'Människor är inte rekvisita. Ibland märks det.',
        risk: { chance: 0.6,
          win: { text: 'Hon är rolig, rak och rörande. Mätningarna stiger.', temp: { approval: 6 }, griev: -6 },
          lose: { text: 'Hon känner sig utnyttjad och säger det i tv. Pinsamt.', temp: { approval: -4 } } } },
    ],
  },
  {
    id: 'rea_v_lugn', icon: '\u{1F305}', weight: 1, cooldown: 1200,
    kind: 'valfard', react: true,
    title: 'PROTESTERNA HAR TYSTNAT',
    text: 'Det är länge sedan någon demonstrerade mot beslutet om {lag}. Folk har vant sig, och de värsta farhågorna besannades inte. På ledarsidorna talar man om regeringen som stod emot stormen. Men i de mindre orterna finns bitterheten kvar, och den kommer att märkas i nästa val.',
    when: (c) => c.cut(...VALFARD) && c.grievOf('valfard') < 4 && c.day > 150,
    choices: [
      { text: 'RÄCK UT HANDEN TILL DE BITTRA', cost: { money: 300 }, griev: -6, temp: { approval: 3, stability: 2 }, tip: 'En ny busslinje och en ny vårdcentral. Små saker som märks.' },
      { text: 'TA LUGNET SOM ETT KVITTO', temp: { polpower: 3, stability: 2 }, tip: 'Tystnad är inte alltid samtycke. Men den är skön.' },
    ],
  },

  // ===== SKATTERNA =====
  {
    id: 'rea_skatt_uppror', icon: '\u{1F4B8}', weight: 3, cooldown: 1000,
    kind: 'skatt', react: true,
    title: 'SKATTEUPPRORET',
    text: 'De höjda skatterna har fått småföretagare, bönder och tjänstemän att göra gemensam sak. Tiotusen människor har samlats framför skatteverket i {huvudstad} med traktorer, skåpbilar och hemmagjorda skyltar: "VI JOBBAR TILL JUNI FÖR STATEN". En rörelse som kallar sig Skattebetalarnas front uppmanar folk att skjuta upp sina inbetalningar.',
    when: (c) => c.changed('taxes') && c.is('taxes', 'progressive', 't30', 't40', 't60'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL SKATTERNA', cost: { pp: 15 }, undo: 'taxes', griev: -24, temp: { approval: 4, polpower: -3 }, tip: 'Traktorerna åker hem. Välfärdsbudgeten får ett hål.' },
      { text: 'SÄNK SKATTEN FÖR SMÅFÖRETAGEN', cost: { pp: 10 }, griev: -10, temp: { gdp: 1 }, perm: { income: -1 }, next: ['rea_skatt_fred', null], tip: 'Bagerierna jublar. Tjänstemännen räknar på att starta bageri.' },
      { text: 'STÅ FAST: VÄLFÄRDEN MÅSTE BETALAS', griev: 9, temp: { unrest: 4, approval: -3 }, next: ['rea_skatt_vagra', null], tip: 'Någon måste betala. Ingen vill vara någon.' },
    ],
  },
  {
    id: 'rea_skatt_vagra', icon: '\u{1F6AB}', chain: true, kind: 'skatt',
    title: 'DE SLUTAR BETALA',
    text: 'Skattebetalarnas front har gått från ord till handling. Fyratusen företag har slutat betala in moms och sätter pengarna på ett spärrat konto, och rörelsens ledare - en åkeriägare från {stad} - säger att de betalar "när staten lyssnar". Samtidigt flyttar förmögna familjer sina konton till banker i {granne}.',
    choices: [
      { text: 'GE MED OCH ÅTERSTÄLL SKATTERNA', undo: 'taxes', griev: -25, temp: { approval: 2, statepower: -4 }, tip: 'Kontot låses upp. Din auktoritet låses in.' },
      { text: 'SKATTEVERKET DRIVER IN VARJE KRONA', cost: { money: 200 }, tip: 'Lagen är på din sida. Opinionen kanske inte.',
        risk: { chance: 0.6,
          win: { text: 'Fronten spricker när de första företagen får betalningsföreläggande.', res: { money: 400 }, temp: { statepower: 3 }, griev: 4 },
          lose: { text: 'Indrivningen blir en rättsfars. Fronten växer med varje brev från myndigheten.', griev: 10, temp: { unrest: 5, income: -3 }, mod: 'capital_flight' } } },
      { text: 'AMNESTI FÖR DEN SOM BETALAR I TID', cost: { pp: 10 }, griev: -8, res: { money: 300 }, next: 'rea_skatt_fred', tip: 'Ingen straffavgift om ni betalar före månadens slut. De flesta gör det.' },
    ],
  },
  {
    id: 'rea_skatt_fred', icon: '\u{1F4CA}', chain: true, kind: 'skatt',
    title: 'SKATTEFREDEN',
    text: 'Efter två månaders bråk har regeringen och företagarnas organisationer enats om en skattereform: enklare regler, färre avdrag och ett skattetak för de minsta företagen. Skattebetalarnas front har upplösts, och åkeriägaren från {stad} har fått en plats i skatteutredningen. Han säger att han tänker vara jobbig där också.',
    choices: [
      { text: 'GENOMFÖR SKATTEREFORMEN', cost: { pp: 10 }, griev: -18, temp: { stability: 3, gdp: 1 }, tip: 'Blanketten krymper från tolv sidor till fyra. Ett litet under.' },
      { text: 'LÅT UTREDNINGEN TA SIN TID', griev: -4, temp: { approval: -1 }, next: ['rea_skatt_vagra', null], tip: 'Åkeriägaren tar tiden. Han klockar den.' },
    ],
  },
  {
    id: 'rea_skatt_sankt', icon: '\u{1F6CD}\u{FE0F}', weight: 2,
    kind: 'skatt', react: true,
    title: 'MER I PLÅNBOKEN',
    text: 'Skattesänkningen syns på lönebeskedet, och köpcentren i {stad} rapporterar sin bästa månad på åratal. Men landstingen har redan fått veta att statsbidragen krymper, och kreditvärderingsinstitutet har skickat ett vänligt mejl med frågan hur hålet i budgeten ska täckas.',
    when: (c) => c.changed('taxes') && c.is('taxes', 'haven', 't0', 't10', 'flat', 'consumption'),
    choices: [
      { text: 'SKÄR I STATENS ADMINISTRATION', cost: { pp: 10 }, perm: { income: 1, corruption: -1 }, temp: { approval: -1 }, griev: -6, tip: 'Tre myndigheter blir en. Ingen märker skillnaden, utom de som jobbade där.' },
      { text: 'LÅNA OCH LITA PÅ TILLVÄXTEN', temp: { gdp: 2, approval: 3 }, perm: { income: -1 }, griev: -8, ind: { infl: 0.4 }, tip: 'Tillväxten kommer. Räntorna också.' },
      { text: 'HÖJ MOMSEN LITE I STÄLLET', griev: 4, perm: { income: 1 }, temp: { qol: -1 }, tip: 'Det som gavs med ena handen tas med den andra.' },
    ],
  },
  {
    id: 'rea_bolag_flytt', icon: '\u{1F3E6}', weight: 2, cooldown: 900,
    kind: 'skatt', react: true,
    title: 'HUVUDKONTORET FLYTTAR',
    text: 'Landets största verkstadsbolag har meddelat att huvudkontoret flyttar till {granne} efter höjningen av bolagsskatten. Fabriken i {stad} blir kvar, säger vd:n, "i nuläget". Börsen föll tre procent på nyheten, och två andra storbolag har anlitat samma skatterådgivare.',
    when: (c) => c.changed('corporate_tax') && c.is('corporate_tax', 'excess', 'veryhigh', 'high', 'raised'),
    choices: [
      { text: 'BACKA BOLAGSSKATTEN', cost: { pp: 15 }, undo: 'corporate_tax', griev: -20, temp: { gdp: 1 }, ind: { stockcap: 4 }, tip: 'Huvudkontoret stannar. Skatteintäkterna gör det inte.' },
      { text: 'AVDRAG FÖR FORSKNING OCH NYA FABRIKER', cost: { pp: 8 }, temp: { research: 1, factory: 1 }, perm: { income: -1 }, griev: -8, tip: 'Den som investerar här betalar mindre. Rimligt, tycker alla utom revisorerna.' },
      { text: 'LÅT DEM FLYTTA - SKATTEN STANNAR', griev: 6, temp: { gdp: -2, approval: 2 }, ind: { stockcap: -6 }, tip: 'Folket gillar det. Pensionsfonderna gör det inte.' },
    ],
  },
  {
    id: 'rea_bolag_sankt', icon: '\u{1F4C8}', weight: 2,
    kind: 'skatt', react: true,
    title: 'BÖRSFEST OCH SURA MINER',
    text: 'Den sänkta bolagsskatten har fått börsen att stiga, och två utländska koncerner har lagt sina regionkontor i {huvudstad}. Samtidigt har vinsterna i flera storbolag gått raka vägen till aktieutdelningar. "Bolagen får sänkt skatt, vi får sänkt bemanning", skriver en undersköterska i en debattartikel som delas flitigt.',
    when: (c) => c.changed('corporate_tax') && c.is('corporate_tax', 'patentbox', 'low', 'payout', 'verylow', 'none'),
    choices: [
      { text: 'KRÄV ATT VINSTERNA INVESTERAS', cost: { pp: 10 }, temp: { factory: 2, approval: 2 }, griev: -6, tip: 'Bolagen bygger en ny fabrik och kallar det sin idé.' },
      { text: 'VÄLKOMNA INVESTERINGARNA', mod: 'foreign_investment', temp: { approval: -2 }, griev: 3, tip: 'Pengarna kommer. Undersköterskan är inte övertygad.' },
      { text: 'ÅTERSTÄLL BOLAGSSKATTEN', cost: { pp: 10 }, undo: 'corporate_tax', temp: { approval: 3 }, griev: -4, ind: { stockcap: -5 }, tip: 'Börsen suckar. Debattsidorna jublar.' },
    ],
  },
  {
    id: 'rea_arv_gard', icon: '\u{1F69C}', weight: 2, cooldown: 900,
    kind: 'skatt', react: true,
    title: 'GÅRDEN SOM INTE GICK ATT ÄRVA',
    text: 'Efter höjningen av arvsskatten har syskonen på en mjölkgård utanför {stad} fått en skattesedel som är större än gårdens årsomsättning. De måste sälja korna för att behålla marken. Bönderna och familjeföretagarna har bildat en gemensam front, och en ärvd snickerifabrik med fyrtio anställda är redan till salu.',
    when: (c) => c.changed('inheritance_tax') && c.is('inheritance_tax', 'forall', 'veryhigh', 'high', 'raised'),
    choices: [
      { text: 'BACKA ARVSSKATTEN', cost: { pp: 12 }, undo: 'inheritance_tax', griev: -20, temp: { approval: 2 }, tip: 'Korna får stanna. De verkar lättade.' },
      { text: 'UNDANTAG FÖR GÅRDAR OCH FAMILJEFÖRETAG', cost: { pp: 8 }, griev: -12, perm: { income: -1 }, temp: { approval: 3 }, tip: 'Rimligt. Och från och med i morgon är alla rika familjer bönder.' },
      { text: 'STÅ FAST: ÄRVD RIKEDOM SKA BESKATTAS', griev: 7, temp: { approval: -2, factory: -1 }, perm: { income: 1 }, tip: 'Principen är tydlig. Mjölkbilen kommer inte mer.' },
    ],
  },
  {
    id: 'rea_arv_bort', icon: '\u{1F48E}', weight: 2,
    kind: 'skatt', react: true,
    title: 'FÖDELSELOTTERIET',
    text: 'Sedan arvsskatten försvann får landets rikaste familjer behålla förmögenheter som annars hade gått till staten. Mäklarna säljer fler herrgårdar än någonsin. En ekonom visar i tv att den rikaste procenten nu äger mer än den fattigaste hälften, och ungdomsförbunden talar om ett "födelselotteri".',
    when: (c) => c.changed('inheritance_tax') && c.is('inheritance_tax', 'abolished', 'none', 'trusts', 'entail'),
    choices: [
      { text: 'ÅTERSTÄLL ARVSSKATTEN', cost: { pp: 10 }, undo: 'inheritance_tax', griev: 5, temp: { approval: 2 }, tip: 'De rika är inte glada. De är få, men de har bra advokater.' },
      { text: 'STIPENDIEFOND FÖR UNGA FRÅN FATTIGA HEM', cost: { money: 400 }, perm: { hdi: 1 }, temp: { approval: 3 }, griev: -4, tip: 'Lotteriet får fler vinnare.' },
      { text: 'RÄTTEN ATT ÄRVA ÄR EN RÄTTIGHET', temp: { gdp: 1, approval: -2 }, perm: { corruption: 1 }, griev: -3, tip: 'Herrgårdarna får nya ägare. Samma efternamn som de gamla.' },
    ],
  },
  {
    id: 'rea_sprit_smuggel', icon: '\u{1F6A4}', weight: 2, cooldown: 900,
    kind: 'skatt', react: true,
    title: 'SPRITBÅTARNA FRÅN {GRANNE}',
    text: 'Sedan alkohollagarna skärptes lägger nattliga båtar från {granne} till i små hamnar längs kusten. Hembränt säljs i garage i {stad}, och akuten har behandlat tre personer som blivit sjuka av dåligt tillverkad sprit. Krögarna säger att halva omsättningen försvunnit på ett kvartal.',
    when: (c) => c.changed('alcohol_policy') && c.is('alcohol_policy', 'restricted', 'rationing', 'prohibition', 'monopoly'),
    choices: [
      { text: 'BACKA ALKOHOLPOLITIKEN', cost: { pp: 10 }, undo: 'alcohol_policy', griev: -18, temp: { approval: 3 }, tip: 'Båtarna slutar komma. Krögarna slutar gråta.' },
      { text: 'FLER TULLARE OCH KUSTBEVAKNING', cost: { money: 300 }, temp: { safety: 3, approval: -1 }, griev: 3, ind: { crimeidx: -3 }, tip: 'Tullen får nya båtar. Smugglarna skaffar snabbare.' },
      { text: 'STÅ FAST: FOLKHÄLSAN GÅR FÖRST', griev: 7, temp: { safety: -2, corruption: 2 }, ind: { crimeidx: 5 }, tip: 'Mindre sprit i butiken. Mer i garaget.' },
    ],
  },
  {
    id: 'rea_sprit_fri', icon: '\u{1F37B}', weight: 2,
    kind: 'skatt', react: true,
    title: 'FREDAGSNATT PÅ AKUTEN',
    text: 'De friare alkohollagarna har gjort uteserveringarna i {stad} fullsatta och turisterna fler. Men akutsjuksköterskorna har börjat kalla fredagsnatten för "fullmånen", polisen får fler samtal om bråk och ett nykterhetsförbund har lämnat in sextiotusen namn till regeringen.',
    when: (c) => c.changed('alcohol_policy') && c.is('alcohol_policy', 'dutyfree', 'free', 'licensed'),
    choices: [
      { text: 'BACKA ALKOHOLPOLITIKEN', cost: { pp: 10 }, undo: 'alcohol_policy', griev: 4, temp: { safety: 2, approval: -2 }, tip: 'Uteserveringarna töms. Akuten andas ut.' },
      { text: 'STÄNG BARERNA VID MIDNATT', cost: { pp: 5 }, temp: { safety: 2 }, griev: 2, ind: { crimeidx: -2 }, tip: 'Festen tar slut tidigare. Bråken också.' },
      { text: 'FLER NATTVANDRARE OCH FÄLTSJUKSKÖTERSKOR', cost: { money: 200 }, temp: { safety: 2, qol: 1 }, griev: -3, tip: 'Gula västar, termoskaffe och mycket tålamod.' },
      { text: 'TURISTPENGARNA ÄR VÄRDA DET', temp: { gdp: 1, safety: -2 }, griev: -4, ind: { tourists: 6 }, tip: 'Krögarna älskar dig. Sjuksköterskorna har andra ord.' },
    ],
  },
  {
    id: 'rea_tobak_svart', icon: '\u{1F6AC}', weight: 2, cooldown: 900,
    kind: 'skatt', react: true,
    title: 'CIGARETTER UNDER DISKEN',
    text: 'Sedan tobakslagarna skärptes säljs smuggelcigaretter i påsar på torget i {stad}, till halva priset och utan varningstext. Tullen har beslagtagit en långtradare full med paket från {land}. Samtidigt har antalet unga som börjar röka minskat, och lungläkarna kallar lagen det bästa som hänt folkhälsan på trettio år.',
    when: (c) => c.changed('tobacco') && c.is('tobacco', 'tough', 'smokefree', 'banned', 'criminal'),
    choices: [
      { text: 'BACKA TOBAKSLAGARNA', cost: { pp: 8 }, undo: 'tobacco', griev: -15, temp: { approval: 2 }, ind: { crimeidx: -2 }, tip: 'Torghandeln upphör. Lungläkarna suckar.' },
      { text: 'SLUTA-RÖKA-HJÄLP OCH FLER TULLARE', cost: { money: 300 }, perm: { hdi: 1 }, temp: { safety: 1 }, griev: -5, tip: 'Nikotinplåster gratis på apoteket. Kön är lång men lugn.' },
      { text: 'STÅ FAST: LUNGORNA TACKAR', griev: 5, perm: { hdi: 1 }, temp: { corruption: 2 }, ind: { crimeidx: 3 }, tip: 'Om trettio år tackar alla. Nu tackar bara smugglarna.' },
    ],
  },

  // ===== SKATTERNA: ALLMÄNNA REAKTIONER =====
  {
    id: 'rea_s_grans', icon: '\u{1F6D2}', weight: 2, cooldown: 800,
    kind: 'skatt', react: true,
    title: 'BUSSARNA TILL {GRANNE}',
    text: 'Sedan beslutet om {lag} går det chartrade bussar varje lördag från {stad} till gränshandeln i {granne}. Där köper folk kaffe, godis, öl och bildäck för en hel månad. Köpmännen på hemmaplan har tappat en femtedel av omsättningen, och två butiker i centrum har satt upp skyltar om utförsäljning.',
    when: (c) => c.cut(...SKATT),
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -18, temp: { approval: 2, gdp: 1 }, tip: 'Bussarna står still. Köpmännen tänder ljus i skyltfönstren.' },
      { text: 'SÄNK MOMSEN I GRÄNSKOMMUNERNA', cost: { pp: 8 }, perm: { income: -1 }, temp: { gdp: 1 }, griev: -6, tip: 'Nu åker folk från resten av landet till gränskommunerna i stället.' },
      { text: 'FOLK FÅR HANDLA VAR DE VILL', griev: 4, temp: { gdp: -1, income: -2 }, rel: 2, tip: 'Köpmännen i {granne} skickar ett tackkort.' },
    ],
  },
  {
    id: 'rea_s_svart', icon: '\u{1F576}\u{FE0F}', weight: 2, cooldown: 800,
    kind: 'skatt', react: true,
    title: 'MED ELLER UTAN KVITTO?',
    text: 'Ändringen av {lag} har fått hantverkare, städfirmor och frisörer att hitta nya sätt att ta betalt. "Med eller utan kvitto?" har blivit en vanlig fråga i {stad}. Skattemyndigheten uppskattar att svartjobben ökat med en femtedel, och de seriösa företagen säger att de inte kan konkurrera med dem som fuskar.',
    when: (c) => c.cut(...SKATT) && c.st.corruption > -20,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -16, temp: { approval: 2 }, tip: 'Kvittona kommer tillbaka. Nästan alla.' },
      { text: 'AVDRAG FÖR VITA HANTVERKSTJÄNSTER', cost: { money: 250 }, perm: { corruption: -1 }, griev: -6, temp: { income: -1 }, tip: 'Den som tar kvitto får tillbaka hälften. Kvittot blir populärt.' },
      { text: 'RAZZIOR MOT SVARTA FIRMOR', temp: { statepower: 2, corruption: -2, approval: -2 }, griev: 4, tip: 'Skattemyndigheten knackar på. Rörmokarna går under jorden.' },
    ],
  },
  {
    id: 'rea_s_kalkyl', icon: '\u{1F9EE}', weight: 2, cooldown: 800,
    kind: 'skatt', react: true,
    title: 'KÖKSBORDSKALKYLEN',
    text: 'Dagstidningen i {stad} har räknat ut vad beslutet om {lag} betyder för en vanlig familj: en undersköterska och en busschaufför med två barn får mindre kvar varje månad. Kalkylen har spridits överallt. Regeringens egna siffror visar något annat, men ingen läser regeringens egna siffror.',
    when: (c) => c.cut(...SKATT) && c.grievOf('skatt') > 5,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -18, temp: { approval: 3 }, tip: 'Köksbordet vann igen.' },
      { text: 'SKATTEÅTERBÄRING TILL BARNFAMILJER', cost: { money: 350 }, griev: -8, temp: { approval: 3 }, tip: 'Pengarna kommer i juni. Precis lagom till sommarlovet.' },
      { text: 'FÖRKLARA DINA SIFFROR I TV', tip: 'Siffror i tv är som väder i tv. Folk litar på sina egna fönster.',
        risk: { chance: 0.45,
          win: { text: 'Du förklarar lugnt och pedagogiskt. Folk förstår.', griev: -6, temp: { approval: 3 } },
          lose: { text: 'Du stakar dig på frågan om vad mjölken kostar. Klippet sprids överallt.', griev: 6, temp: { approval: -5 } } } },
    ],
  },
  {
    id: 'rea_s_tack', icon: '\u{1F4B0}', weight: 2,
    kind: 'skatt', react: true,
    title: 'LÄTTNAD - OCH ETT HÅL I KASSAN',
    text: 'Beslutet om {lag} har tagits emot väl. Handlarna i {stad} säger att kunderna kommer tillbaka och opinionsmätningarna är de bästa på länge. Men på finansdepartementet har tjänstemännen börjat räkna på vad det kostar, och den kalkylen ser inte lika glad ut.',
    when: (c) => c.raised(...SKATT),
    choices: [
      { text: 'NJUT AV OPINIONEN', temp: { approval: 4 }, perm: { income: -1 }, griev: -8, tip: 'Det är trevligt att vara omtyckt. Det brukar inte vara länge.' },
      { text: 'SPARA IN MOTSVARANDE I STATSBUDGETEN', cost: { pp: 10 }, perm: { income: 1 }, temp: { qol: -1 }, griev: -4, tip: 'Ansvarsfullt. Ingen skriver en låt om det.' },
      { text: 'GÖR DET TILL VALLÖFTE OCH LÅNA', temp: { approval: 5, stability: -1 }, perm: { income: -2 }, griev: -8, ind: { infl: 0.3 }, tip: 'Banken säger ja. Banken säger alltid ja, tills den säger nej.' },
    ],
  },

  // ===== PRESSEN OCH YTTRANDEFRIHETEN =====
  {
    id: 'rea_press_svart', icon: '\u{1F4F0}', weight: 3, cooldown: 1000,
    kind: 'frihet', react: true,
    title: 'SVARTA FÖRSTASIDOR',
    text: 'I morse kom landets alla stora tidningar ut med helt svarta förstasidor. Bara en rad står i mitten: "Så här ser nyheterna ut när presslagarna ändras." Journalistförbundet har kallat till demonstration utanför regeringskansliet i {huvudstad}, och utländska medier ringer för att fråga vad som händer.',
    when: (c) => c.cut('press'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL PRESSLAGARNA', cost: { pp: 15 }, undo: 'press', griev: -24, temp: { freedom: 3, approval: 3 }, ind: { pressfree: 3 }, tip: 'I morgon har tidningarna färg igen. Och en ny förstasida om dig.' },
      { text: 'BJUD IN CHEFREDAKTÖRERNA TILL SAMTAL', cost: { pp: 5 }, griev: -6, next: ['rea_press_namnd', 'rea_press_utland'], tip: 'Chefredaktörer är vana vid att ställa frågor. Inte vid att få svar.' },
      { text: 'KALLA DET POLITISK TEATER', griev: 10, temp: { freedom: -2, approval: -3 }, ind: { pressfree: -4, trustgov: -3 }, next: ['rea_press_utland', null], tip: 'Teater har publik. Den här hade hela landet.' },
    ],
  },
  {
    id: 'rea_press_utland', icon: '\u{1F30D}', chain: true, kind: 'frihet',
    title: 'VÄRLDEN TITTAR PÅ {RIKE}',
    text: 'Den internationella organisationen för pressfrihet har flyttat ner {rike} tolv platser på sin lista, och tre ambassadörer har begärt möte med utrikesministern. En prisbelönt reporter har lämnat landet och skriver nu sina reportage från {land}. Konferensarrangörer har börjat avboka hotellen i {huvudstad}.',
    choices: [
      { text: 'GE MED: PRESSFRIHETEN ÅTERSTÄLLS', undo: 'press', griev: -25, rel: 5, temp: { freedom: 3, polpower: -4 }, ind: { pressfree: 4 }, tip: 'Reportern kommer hem. Med en bok.' },
      { text: 'BJUD IN EN INTERNATIONELL GRANSKNING', cost: { pp: 10 }, rel: 3, griev: -8, temp: { freedom: 1 }, tip: 'Granskarna kommer med block och pennor. Och många frågor.' },
      { text: 'UTVISA DE UTLÄNDSKA KORRESPONDENTERNA', cost: { pp: 10 }, rel: -10, griev: 12, temp: { freedom: -4, statepower: 3 }, ind: { pressfree: -6, demo: -0.3, tourists: -10 }, tip: 'Nu skriver de om dig från grannlandet. Med större rubriker.' },
    ],
  },
  {
    id: 'rea_press_namnd', icon: '\u{1F58B}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'PRESSETISKA NÄMNDEN',
    text: 'Chefredaktörerna och regeringen har kommit fram till en kompromiss: lagändringen dras tillbaka och ersätts av en oberoende pressetisk nämnd som tidningarna själva betalar. Den som anser sig ha blivit felbehandlad kan anmäla. Nämndens första ordförande blir en pensionerad domare som är känd för att vara sträng mot alla.',
    choices: [
      { text: 'GODKÄNN NÄMNDEN', undo: 'press', griev: -20, temp: { freedom: 3, stability: 2 }, ind: { pressfree: 3, trustgov: 2 }, tip: 'Domaren fäller sin första tidning efter en vecka. Det är ett gott tecken.' },
      { text: 'GODKÄNN, MEN BEHÅLL DELAR AV LAGEN', cost: { pp: 10 }, griev: -8, temp: { statepower: 2 }, next: ['rea_press_utland', null], tip: 'En halv kompromiss är en hel kompromiss med en hake.' },
    ],
  },
  {
    id: 'rea_yttr_standup', icon: '\u{1F3A4}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'KOMIKERN SOM BLEV ANMÄLD',
    text: 'Sedan yttrandefriheten inskränktes har en populär ståuppkomiker från {stad} anmälts för ett skämt om regeringen. Hennes föreställningar är utsålda ett år framåt, och tusentals människor har lagt upp filmer där de berättar exakt samma skämt. Polisen har fått fyrtiotusen anmälningar från folk som anmäler sig själva.',
    when: (c) => c.cut('speech'),
    choices: [
      { text: 'BACKA YTTRANDEFRIHETEN', cost: { pp: 12 }, undo: 'speech', griev: -22, temp: { freedom: 3, approval: 3 }, tip: 'Skämtet var inte ens så roligt. Det är det som är poängen.' },
      { text: 'LÄGG NER ANMÄLAN MOT KOMIKERN', cost: { pp: 5 }, griev: -6, temp: { approval: 2 }, tip: 'Lagen står kvar. Skämtet också.' },
      { text: 'LAGEN ÄR LAGEN - ÅTAL', griev: 12, temp: { freedom: -3, approval: -5 }, ind: { pressfree: -3, protests: 40, trustgov: -4 }, mod: 'martyr', tip: 'Rättegången blir hennes bästa föreställning hittills.' },
    ],
  },
  {
    id: 'rea_demo_tyst', icon: '\u{1F92B}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'DEN TYSTA PROMENADEN',
    text: 'Sedan demonstrationsrätten inskränktes har en ny sorts protest spridit sig i {huvudstad}. Varje torsdag klockan sex går tusentals människor längs huvudgatan - utan skyltar, utan slagord, utan att säga ett ord. Det är ingen demonstration, säger de, bara en promenad. Polisen vet inte riktigt vad de ska göra.',
    when: (c) => c.cut('protest'),
    choices: [
      { text: 'ÅTERSTÄLL DEMONSTRATIONSRÄTTEN', cost: { pp: 12 }, undo: 'protest', griev: -22, temp: { freedom: 3 }, tip: 'Nu får de ta med skyltarna igen. Några saknar tystnaden.' },
      { text: 'LÅT DEM PROMENERA', griev: -4, temp: { statepower: -2, freedom: 1 }, tip: 'Det är svårt att förbjuda en promenad. Det är bra att det är svårt.' },
      { text: 'GRIP DEM SOM GÅR FÖRST', cost: { money: 100 }, griev: 12, temp: { freedom: -4, unrest: 6 }, ind: { protests: 50, policetrust: -5, demo: -0.2 }, mod: 'martyr', tip: 'Nästa torsdag går tre gånger så många.' },
    ],
  },

  // ===== VALEN OCH STATSSKICKET =====
  {
    id: 'rea_val_obs', icon: '\u{1F5F3}\u{FE0F}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'VALOBSERVATÖRERNA OROAR SIG',
    text: 'Efter ändringarna av valen har en internationell valobservationsmission begärt att få följa nästa val på plats. Deras förhandsrapport talar om "allvarliga brister i oberoendet". Tre oppositionspartier överväger att bojkotta valet, och chefen för valmyndigheten har sagt upp sig i protest.',
    when: (c) => c.cut('elections'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL VALEN', cost: { pp: 15 }, undo: 'elections', griev: -25, rel: 4, temp: { freedom: 3 }, ind: { demo: 0.3 }, tip: 'Valet blir fritt. Det är det fina och det läskiga med fria val.' },
      { text: 'SLÄPP IN OBSERVATÖRERNA', cost: { pp: 5 }, rel: 4, griev: -8, temp: { freedom: 1 }, ind: { turnout: 2 }, tip: 'De räknar rösterna med dig. Och skriver ner allt.' },
      { text: 'NEKA OBSERVATÖRERNA INRESA', rel: -8, griev: 10, temp: { statepower: 3, freedom: -3 }, ind: { demo: -0.4, turnout: -4, trustgov: -4 }, tip: 'Den som inte har något att dölja brukar inte stänga dörren.' },
    ],
  },
  {
    id: 'rea_styre_torg', icon: '\u{1F3DB}\u{FE0F}', weight: 3, cooldown: 1200,
    kind: 'frihet', react: true,
    title: 'GRUNDLAGEN PÅ TORGET',
    text: 'Ändringen av statsskicket har väckt något som ingen sett på länge. Hundratusen människor har samlats framför parlamentet i {huvudstad}, många med grundlagen i händerna. Juristprofessorer läser högt ur den från ett lastbilsflak. Tre ministrar har låtit meddela att de "överväger sin ställning".',
    when: (c) => c.cut('government') && c.day > 30,
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL STATSSKICKET', cost: { pp: 20 }, undo: 'government', griev: -28, temp: { freedom: 4, stability: 2, polpower: -5 }, ind: { demo: 0.3, trustgov: 3 }, tip: 'Grundlagen vann. Den brukar göra det i längden.' },
      { text: 'BJUD IN TILL ETT RUNDABORDSSAMTAL', cost: { pp: 10 }, griev: -10, next: ['rea_styre_runda', 'rea_styre_ljus'], tip: 'Ett runt bord har ingen ände. Det är tanken.' },
      { text: 'FÖRKLARA TORGET STÄNGT', griev: 14, temp: { unrest: 8, freedom: -4 }, ind: { protests: 70, demo: -0.4, trustgov: -6 }, next: ['rea_styre_ljus', null], tip: 'Torget stängs. Gatorna runt omkring gör det inte.' },
    ],
  },
  {
    id: 'rea_styre_ljus', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'EN MILJON LJUS',
    text: 'Protesterna mot det nya statsskicket har spridit sig till varje stad. I kväll stod människor med tända ljus längs vägarna från {stad} till {huvudstad}, en kedja som enligt arrangörerna är fyrtio mil lång. Polisfacket har meddelat att poliserna inte kommer att använda våld mot fredliga medborgare. Två generaler har bett om ett möte.',
    choices: [
      { text: 'GE MED OCH ÅTERSTÄLL STATSSKICKET', undo: 'government', griev: -30, temp: { freedom: 5, polpower: -8, stability: -2 }, ind: { demo: 0.5, trustgov: 5 }, tip: 'Ljusen blåses ut ett efter ett. Det blir en lång natt, men en lugn.' },
      { text: 'UTLYS NYVAL', cost: { pp: 20 }, griev: -15, temp: { stability: -3, freedom: 3 }, ind: { turnout: 6 }, tip: 'Folket får säga sitt. Det kan sluta med att du får gå.' },
      { text: 'UNDANTAGSTILLSTÅND', cost: { pp: 25 }, griev: 18, temp: { statepower: 6, freedom: -8, unrest: 10, approval: -8 }, rel: -12, ind: { demo: -1, trustgov: -10, pressfree: -6 }, tip: 'Generalerna lyssnar. Frågan är vem de lyssnar på i morgon.' },
    ],
  },
  {
    id: 'rea_styre_runda', icon: '\u{1FA91}', chain: true, kind: 'frihet',
    title: 'RUNDA BORDET',
    text: 'Regeringen, oppositionen, kyrkorna och facken har suttit runt samma bord i två veckor. Förslaget är en kompromiss: ändringen av statsskicket står kvar, men parlamentet får vetorätt och en ny författningsdomstol ska granska alla lagar. Torget i {huvudstad} har tömts, men tälten står kvar.',
    choices: [
      { text: 'SKRIV UNDER KOMPROMISSEN', cost: { pp: 10 }, griev: -18, temp: { stability: 4, freedom: 2, statepower: -3 }, ind: { demo: 0.3, trustgov: 3 }, tip: 'Tälten fälls. Domstolen får sin första dag i morgon.' },
      { text: 'ÅTERSTÄLL STATSSKICKET HELT', undo: 'government', griev: -22, temp: { freedom: 3, polpower: -4 }, ind: { demo: 0.4 }, tip: 'Mer än kompromissen. Torget applåderar, dina allierade gör det inte.' },
      { text: 'LÄMNA BORDET', griev: 10, temp: { unrest: 6 }, ind: { trustgov: -4 }, next: 'rea_styre_ljus', tip: 'Stolen står tom. Alla tittar på den.' },
    ],
  },

  // ===== RÄTTIGHETERNA =====
  {
    id: 'rea_medb_advokat', icon: '\u{1F4D6}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'ADVOKATERNA I SVART',
    text: 'Efter inskränkningen av medborgarrätten har advokatsamfundet gjort något unikt: tvåtusen advokater i svarta kappor har tågat från domstolen till justitiedepartementet i {huvudstad}. De menar att de nya reglerna låter staten hålla människor utan rättegång. Domstolarna har fått tusentals överklaganden på en vecka.',
    when: (c) => c.cut('civil_rights'),
    choices: [
      { text: 'ÅTERSTÄLL MEDBORGARRÄTTEN', cost: { pp: 15 }, undo: 'civil_rights', griev: -22, temp: { freedom: 4 }, ind: { demo: 0.2 }, tip: 'Kapporna hängs in i garderoben. Tills nästa gång.' },
      { text: 'LÅT EN OBEROENDE KOMMISSION GRANSKA', cost: { pp: 8 }, griev: -8, temp: { freedom: 1, stability: 1 }, tip: 'Kommissionen har advokater i sig. De vet vad de tycker.' },
      { text: 'STÅ FAST: SÄKERHETEN KRÄVER DET', griev: 10, temp: { safety: 2, freedom: -3 }, ind: { demo: -0.3, trustgov: -4 }, tip: 'Säkerheten ökar lite. Rättssäkerheten minskar mycket.' },
    ],
  },
  {
    id: 'rea_overv_mask', icon: '\u{1F4F7}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'MÖNSTREN SOM LURAR KAMERORNA',
    text: 'Sedan övervakningen byggdes ut sitter ansiktsigenkänningskameror vid varje station i {huvudstad}. Nu bär tusentals unga halsdukar och kepsar med mönster som förvirrar kamerorna, och krypterade chattappar är de mest nedladdade i landet. Två utländska teknikbolag har meddelat att de flyttar sina utvecklingskontor.',
    when: (c) => c.cut('surveillance') && c.is('surveillance', 'retention', 'facial', 'mass', 'total', 'informant'),
    choices: [
      { text: 'BACKA ÖVERVAKNINGEN', cost: { pp: 12 }, undo: 'surveillance', griev: -22, temp: { freedom: 3 }, tip: 'Kamerorna monteras ner. Mönstren blir mode ändå.' },
      { text: 'DOMSTOLSKONTROLL AV KAMERORNA', cost: { pp: 8 }, griev: -10, temp: { freedom: 2, safety: -1 }, tip: 'En domare måste säga ja innan någon tittar. Det tar tid, det är meningen.' },
      { text: 'FÖRBJUD DE LURANDE MÖNSTREN', griev: 10, temp: { freedom: -3, safety: 2, research: -1 }, ind: { demo: -0.2, protests: 30 }, tip: 'Ett förbud mot rutiga kepsar. Historieböckerna kommer att älska det.' },
    ],
  },
  {
    id: 'rea_net_vpn', icon: '\u{1F310}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'ALLA HAR SKAFFAT VPN',
    text: 'Efter ändringen av internetlagarna är VPN-tjänster det mest sålda i landets elektronikbutiker. Uppstartsföretagen i {huvudstad} flyttar servrar och personal till {granne}, och en känd spelutvecklare har utlyst en tävling om bästa sättet att ta sig förbi spärrarna. Gymnasieelever är bättre på det än polisen.',
    when: (c) => c.cut('internet') && c.is('internet', 'ageverify', 'realname', 'censored', 'shutdowns', 'firewall', 'intranet'),
    choices: [
      { text: 'BACKA INTERNETLAGARNA', cost: { pp: 12 }, undo: 'internet', griev: -20, temp: { freedom: 3, research: 1 }, tip: 'Uppstartsbolagen packar upp flyttlådorna igen. Några av dem.' },
      { text: 'LÄTTA PÅ SPÄRRARNA FÖR FÖRETAG', cost: { pp: 6 }, temp: { research: 1, gdp: 1 }, griev: -6, tip: 'Företagen får fritt internet. Gymnasieeleverna startar företag.' },
      { text: 'FÖRBJUD VPN OCKSÅ', griev: 10, temp: { freedom: -3, research: -2 }, ind: { pressfree: -3, demo: -0.2 }, tip: 'Ett förbud mot sätt att kringgå förbud. Eleverna har redan ett svar.' },
    ],
  },
  {
    id: 'rea_relig_kallare', icon: '\u{1F54A}\u{FE0F}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'GUDSTJÄNST I KÄLLAREN',
    text: 'Ändringen av religionspolitiken har slagit hårt mot dem som inte delar statens linje. I {stad} samlas en församling numera i en källare under en cykelaffär, och i {huvudstad} har präster, imamer och rabbiner för första gången skrivit ett gemensamt brev till regeringen. De ber om samma sak: att få tro i fred.',
    when: (c) => c.changed('religion') && c.is('religion', 'banned', 'atheism', 'statereligion', 'religiouslaw', 'clergyrule'),
    choices: [
      { text: 'ÅTERSTÄLL RELIGIONSPOLITIKEN', cost: { pp: 15 }, undo: 'religion', griev: -22, temp: { freedom: 3, stability: 1 }, tip: 'Cykelaffären får tillbaka sin källare. Församlingen saknar den nästan.' },
      { text: 'TA EMOT DE RELIGIÖSA LEDARNA', cost: { pp: 5 }, griev: -8, temp: { stability: 2 }, rel: 2, tip: 'Tre trossamfund i samma rum. De är överens om mer än du trodde.' },
      { text: 'STATEN BESTÄMMER - STÅ FAST', griev: 10, temp: { freedom: -3, unrest: 4 }, rel: -5, ind: { demo: -0.2 }, tip: 'Tro låter sig sällan beordras. Den flyttar bara ner i källaren.' },
    ],
  },
  {
    id: 'rea_dod_infort', icon: '\u{1F56F}\u{FE0F}', weight: 2, cooldown: 1000,
    kind: 'frihet', react: true,
    title: 'LJUSVAKA UTANFÖR FÄNGELSET',
    text: 'Sedan dödsstraffet började användas igen står människor med ljus utanför fängelset i {stad} varje natt. Advokatsamfundet, kyrkorna och läkarförbundet har sagt att de inte tänker medverka. Tre länder har kallat hem sina ambassadörer för samråd, och en dömd mans mamma vädjar om nåd i tv.',
    when: (c) => c.changed('death_penalty') && c.is('death_penalty', 'inuse', 'mandatory', 'highlyinuse', 'majority'),
    choices: [
      { text: 'BACKA: DÖDSSTRAFFET AVSKAFFAS IGEN', cost: { pp: 15 }, undo: 'death_penalty', griev: -22, rel: 6, temp: { freedom: 2 }, tip: 'Ambassadörerna kommer tillbaka. Ljusen brinner ut.' },
      { text: 'NÅDA ALLA SOM REDAN DÖMTS', cost: { pp: 8 }, griev: -8, rel: 3, temp: { approval: -1 }, tip: 'Lagen står kvar, men ingen avrättas. En märklig sorts kompromiss.' },
      { text: 'STÅ FAST: RÄTTVISAN KRÄVER DET', griev: 8, rel: -8, temp: { safety: 1, approval: 2 }, tip: 'Många håller med dig. Omvärlden gör det inte.' },
    ],
  },
  {
    id: 'rea_dod_avskaff', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    kind: 'frihet', react: true,
    title: 'DÖDSSTRAFFET ÄR HISTORIA',
    text: 'Sedan dödsstraffet avskaffades har {rike} fått gratulationer från fyrtio länder och en inbjudan att tala i FN. Men hemma är inte alla nöjda. En förening för brottsoffers anhöriga samlar namn för en folkomröstning, och kvällstidningarna skriver om "de farligaste fångarna som nu får leva".',
    when: (c) => c.changed('death_penalty') && c.is('death_penalty', 'nolife', 'constban'),
    choices: [
      { text: 'SATSA PÅ STÖD TILL BROTTSOFFER', cost: { money: 300 }, griev: -8, temp: { approval: 3, safety: 1 }, rel: 3, tip: 'Rättvisa är också att ta hand om dem som drabbats.' },
      { text: 'TA EMOT INBJUDAN TILL FN', cost: { pp: 5 }, rel: 8, temp: { ideopower: 2 }, griev: -4, tip: 'Ett tal i New York. Applåder från länder du aldrig besökt.' },
      { text: 'LÅT DET AVGÖRAS I EN FOLKOMRÖSTNING', tip: 'Folket bestämmer. Det är ju det demokrati betyder.',
        risk: { chance: 0.55,
          win: { text: 'Folket röstar för att behålla förbudet. Frågan är avgjord för en generation.', temp: { stability: 4, freedom: 2 }, griev: -8 },
          lose: { text: 'Folket röstar för dödsstraff i undantagsfall. Du är bunden av resultatet.', law: ['death_penalty', 'exceptional'], griev: 6, rel: -6 } } },
    ],
  },
  {
    id: 'rea_polis_hard', icon: '\u{1F46E}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'PANSARBILAR I FÖRORTEN',
    text: 'Sedan polisen fick hårdare tag rullar pansarfordon genom förorterna runt {huvudstad} på kvällarna. Brotten i centrum har minskat något, men i förorterna låter föräldrar inte längre tonåringarna gå ut efter mörkrets inbrott, av rädsla för stopp och visitationer. Fritidsledarna säger att förtroendet de byggt i tio år är borta.',
    when: (c) => c.changed('policing') && c.is('policing', 'tough', 'militarized', 'predictive', 'secretpolice'),
    choices: [
      { text: 'BACKA TILL VANLIG POLIS', cost: { pp: 12 }, undo: 'policing', griev: -20, temp: { freedom: 2 }, ind: { policetrust: 4 }, tip: 'Pansarbilarna parkeras. Fritidsgården öppnar igen.' },
      { text: 'KVARTERSPOLISER OCH FRITIDSGÅRDAR', cost: { money: 400 }, griev: -10, temp: { safety: 2, qol: 1 }, ind: { policetrust: 3 }, tip: 'En polis som kan namnen på ungdomarna. Det fungerar bättre än pansar.' },
      { text: 'STÅ FAST: BROTTEN MINSKAR', griev: 8, temp: { safety: 3, freedom: -3 }, ind: { policetrust: -5, crimeidx: -4 }, tip: 'Brotten minskar. Tilliten minskar mer.' },
    ],
  },
  {
    id: 'rea_polis_cykel', icon: '\u{1F6B2}', weight: 2,
    kind: 'frihet', react: true,
    title: 'POLISEN PÅ CYKEL',
    text: 'Den nya polisen syns på cykel, i fotbollströja på skolgårdarna och på fikat i församlingshemmet. Förtroendet i förorterna har ökat, och i {stad} har ungdomar själva tipsat om ett gäng som sålde stöldgods. Men butiksägarna i centrum oroar sig för att det tar längre tid innan någon kommer när larmet går.',
    when: (c) => c.changed('policing') && c.is('policing', 'abolished', 'unarmed', 'community', 'oversight'),
    choices: [
      { text: 'FLER POLISER, SAMMA STIL', cost: { money: 300 }, temp: { safety: 2, approval: 2 }, griev: -6, ind: { policetrust: 3 }, tip: 'Fler cyklar, fler fikor, färre inbrott.' },
      { text: 'EN SNABBINSATSSTYRKA FÖR LARMEN', cost: { money: 200 }, temp: { safety: 2 }, griev: -3, tip: 'Butiksägarna får sin snabba bil. Ungdomarna får behålla sin cykelpolis.' },
      { text: 'LÅT DEN NYA STILEN SÄTTA SIG', griev: -5, temp: { qol: 1 }, ind: { policetrust: 4, feelsafe: -2 }, tip: 'Förtroende byggs långsamt. Rädsla byggs snabbt.' },
    ],
  },

  // ===== FRIHETEN: ALLMÄNNA REAKTIONER =====
  {
    id: 'rea_f_professorer', icon: '\u{1F4DD}', weight: 2, cooldown: 800,
    kind: 'frihet', react: true,
    title: 'TUSEN PROFESSORER SKRIVER UNDER',
    text: 'Ett upprop mot ändringen av {lag} har skrivits under av tusen forskare, bland dem två nobelpristagare. De varnar för att landet glider mot "en ordning där makten granskar folket i stället för tvärtom". Studenterna på universitetet i {stad} har ockuperat aulan och håller öppna föreläsningar om grundlagen dygnet runt.',
    when: (c) => c.cut(...FRIHET),
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, griev: -22, temp: { freedom: 3, research: 1 }, tip: 'Professorerna går tillbaka till sina laboratorier. Nöjda, för en gångs skull.' },
      { text: 'BEMÖT UPPROPET I EN DEBATTARTIKEL', tip: 'Att debattera med tusen professorer kräver mod. Eller dåligt omdöme.',
        risk: { chance: 0.4,
          win: { text: 'Artikeln är skarp och väl skriven. Debatten svänger något.', temp: { approval: 3 }, griev: -4 },
          lose: { text: 'Professorerna svarar med fotnoter. Du förlorar debatten på poäng.', temp: { approval: -3 }, griev: 5 } } },
      { text: 'DRA IN ANSLAGEN TILL DE MEST HÖGLJUDDA', cost: { pp: 10 }, griev: 10, temp: { research: -2, freedom: -3 }, ind: { demo: -0.2 }, tip: 'Forskarna flyttar till {granne}. Där får de både anslag och åsikter.' },
    ],
  },
  {
    id: 'rea_f_ambassad', icon: '\u{1F4E8}', weight: 2, cooldown: 900,
    kind: 'frihet', react: true,
    title: 'BREV FRÅN AMBASSADERNA',
    text: 'Ambassadörerna från tolv demokratier har skickat ett gemensamt brev om ändringen av {lag}. Orden är artiga - "djup oro", "nära vänskap", "gemensamma värderingar" - men budskapet är tydligt. {granne} har skjutit upp ett handelsavtal, och en internationell utvecklingsbank vill "diskutera villkoren" för ett lån.',
    when: (c) => c.cut(...FRIHET) && c.day > 60,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 15 }, undo: true, rel: 6, griev: -18, temp: { freedom: 2 }, tip: 'Handelsavtalet skrivs under nästa vecka. Med en artig kommentar.' },
      { text: 'SKICKA UTRIKESMINISTERN PÅ CHARMOFFENSIV', cost: { money: 200 }, rel: 4, griev: -3, tip: 'Tolv huvudstäder på tio dagar. Hon kommer hem med jetlag och halva svaret.' },
      { text: 'INRIKES ANGELÄGENHETER - SVARA KORT', rel: -8, griev: 6, temp: { statepower: 2, ideopower: 2 }, tip: 'Ett kort svar läses alltid som ett långt.' },
    ],
  },
  {
    id: 'rea_f_var', icon: '\u{1F338}', weight: 2,
    kind: 'frihet', react: true,
    title: 'FRIHETENS VÅR',
    text: 'Beslutet om {lag} har firats med fest på gatorna i {huvudstad}. Människorättsorganisationer skickar gratulationer, utländska tidningar skriver om landet som öppnar sig, och studenterna har hängt banderoller från universitetet. Säkerhetstjänstens chef varnar i en intern promemoria för att friheten också gäller dem som vill landet illa.',
    when: (c) => c.raised(...FRIHET),
    choices: [
      { text: 'BJUD IN TILL FOLKFEST', cost: { money: 150 }, temp: { approval: 4, freedom: 2 }, griev: -8, rel: 4, tip: 'Dragspel, korv och grundlagen uppläst. Folk stannar till midnatt.' },
      { text: 'ÖKA ANSLAGEN TILL SÄKERHETSTJÄNSTEN', cost: { money: 200 }, temp: { safety: 2, statepower: 1 }, griev: -3, tip: 'Frihet och säkerhet behöver inte vara fiender. De behöver budget.' },
      { text: 'LÅT FIRANDET TALA FÖR SIG SJÄLVT', griev: -6, rel: 3, tip: 'Den som inte tar äran får den ofta ändå.' },
    ],
  },

  // ===== INVANDRINGEN =====
  {
    id: 'rea_inv_utvis', icon: '\u{1F46A}', weight: 3, cooldown: 1000,
    kind: 'migration', react: true,
    title: 'FAMILJEN SOM SKA UTVISAS',
    text: 'Efter skärpningen av invandringen ska familjen på Lindgatan i {stad} utvisas. Pappan kör buss, mamman är undersköterska och dottern är bäst i klassen i matematik. Hela kvarteret har samlats utanför deras port, busschaufförerna har parkerat bussarna i protest och lokaltidningen har startat en insamling till advokaten.',
    when: (c) => c.changed('immigration') && c.is('immigration', 'restricted', 'closed', 'deportation'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL INVANDRINGSLAGEN', cost: { pp: 15 }, undo: 'immigration', griev: -20, temp: { approval: 2, freedom: 1 }, tip: 'Familjen stannar. Debatten om lagen gör det också.' },
      { text: 'GE FAMILJEN UPPEHÅLLSTILLSTÅND AV HUMANITÄRA SKÄL', cost: { pp: 5 }, griev: -8, temp: { approval: 3 }, next: ['rea_inv_utvis_lugn', null], tip: 'En familj räddad. Tusen andra har inga kameror.' },
      { text: 'LAGEN GÄLLER ALLA', griev: 10, temp: { approval: -3, safety: 1 }, ind: { trustgov: -3, protests: 30 }, next: ['rea_inv_utvis_kyrka', null], tip: 'Bussarna står still i {stad} i morgon också.' },
    ],
  },
  {
    id: 'rea_inv_utvis_kyrka', icon: '\u{26EA}', chain: true, kind: 'migration',
    title: 'KYRKAN ÖPPNAR DÖRRARNA',
    text: 'Kyrkoherden i {stad} har låtit familjen bo i församlingshemmet, och polisen har inte velat gå in. Nu har fyrtio församlingar runt om i landet öppnat sina dörrar för människor som ska utvisas. Biskoparna säger i ett gemensamt uttalande att samvetet går före förordningarna, och opinionen är djupt splittrad.',
    choices: [
      { text: 'BACKA LAGEN', undo: 'immigration', griev: -18, temp: { approval: 1, stability: 2 }, tip: 'Församlingshemmen blir församlingshem igen.' },
      { text: 'AMNESTI FÖR DEM SOM VARIT HÄR LÄNGE', cost: { pp: 12 }, griev: -12, temp: { approval: 2 }, next: 'rea_inv_utvis_lugn', tip: 'Ett kompromissförslag som ingen älskar och de flesta godtar.' },
      { text: 'POLISEN GÅR IN I KYRKORNA', cost: { money: 100 }, griev: 14, temp: { unrest: 7, approval: -5, freedom: -3 }, ind: { trustgov: -5, protests: 50, policetrust: -5 }, mod: 'martyr', tip: 'Bilderna från kyrktrappan kommer att visas i många år.' },
    ],
  },
  {
    id: 'rea_inv_utvis_lugn', icon: '\u{1F31F}', chain: true, kind: 'migration',
    title: 'SPÅRBYTET',
    text: 'Den nya regeln är enkel: den som har haft jobb i två år och klarat språkprovet får stanna. Det kallas spårbytet. Arbetsgivarna i {stad} är nöjda, bussbolaget får behålla sina förare och kyrkorna har stängt sina dörrar igen. De som ville ha hårdare tag är missnöjda, men lugnet har återvänt.',
    choices: [
      { text: 'GÖR SPÅRBYTET PERMANENT', cost: { pp: 8 }, griev: -15, temp: { stability: 3, gdp: 1 }, perm: { integration: 2 }, tip: 'Jobb och språk som väg in. Svårt att vara emot.' },
      { text: 'BEGRÄNSA DET TILL BRISTYRKEN', griev: -6, temp: { gdp: 1 }, perm: { integration: 1 }, tip: 'Busschaufförer och undersköterskor får stanna. Frisörer får det inte.' },
    ],
  },
  {
    id: 'rea_inv_brist', icon: '\u{1F353}', weight: 2, cooldown: 900,
    kind: 'migration', react: true,
    title: 'JORDGUBBARNA RUTTNAR PÅ FÄLTEN',
    text: 'Den stängda invandringen märks först på landet. Bärodlarna utanför {stad} har inte fått några säsongsarbetare i år, och jordgubbarna ruttnar på fälten. Äldreboendena saknar undersköterskor och restaurangerna diskare. Arbetsgivarna kallar det en självförvållad brist på arbetskraft, och priserna i butikerna stiger.',
    when: (c) => c.changed('immigration') && c.is('immigration', 'restricted', 'closed', 'exitban', 'deportation'),
    choices: [
      { text: 'BACKA INVANDRINGSLAGEN', cost: { pp: 12 }, undo: 'immigration', griev: -15, temp: { gdp: 1 }, tip: 'Nästa sommar kommer plockarna tillbaka. Den här är förlorad.' },
      { text: 'TILLFÄLLIGA ARBETSTILLSTÅND FÖR SÄSONGSARBETARE', cost: { pp: 8 }, temp: { gdp: 1, factory: 1 }, griev: -6, tip: 'Sex månader, sedan hem. Jordgubbarna bryr sig inte om visum.' },
      { text: 'LÅT DE ARBETSLÖSA PLOCKA BÄR', temp: { gdp: -1, approval: -2 }, griev: 4, ind: { infl: 0.3 }, tip: 'Två dagar senare har hälften slutat. Bär plockar sig inte själva.' },
    ],
  },
  {
    id: 'rea_inv_oppen', icon: '\u{1F3D8}\u{FE0F}', weight: 2, cooldown: 900,
    kind: 'migration', react: true,
    title: 'KOMMUNEN I {STAD} LARMAR',
    text: 'Sedan invandringen öppnades kommer det fler nya invånare till {stad} än kommunen hinner ta emot. Det saknas lägenheter, språklärare och förskoleplatser. Frivilliga från idrottsföreningarna och kyrkorna ordnar läxhjälp och fotboll, men kommunalrådet har skrivit till regeringen: "Vi vill göra det här bra, men vi behöver hjälp."',
    when: (c) => c.changed('immigration') && c.is('immigration', 'noborders', 'open', 'humanitarian', 'freemove'),
    choices: [
      { text: 'STATLIGT STÖD TILL MOTTAGANDET', cost: { money: 600 }, griev: -12, perm: { integration: 2 }, temp: { approval: 1 }, tip: 'Språklärare, bostäder och förskolor. Det kostar nu och lönar sig sedan.' },
      { text: 'FÖRDELA DE NYANLÄNDA ÖVER HELA LANDET', cost: { pp: 10 }, griev: -8, perm: { integration: 1 }, temp: { approval: -1 }, ind: { segreg: -2 }, tip: 'Varje kommun tar sin del. Alla kommuner klagar lika mycket.' },
      { text: 'BACKA OCH STRAMA ÅT INVANDRINGEN', cost: { pp: 10 }, undo: 'immigration', griev: -6, temp: { freedom: -1 }, tip: 'Tempot sjunker. De som redan kommit behöver fortfarande lägenheter.' },
      { text: 'KOMMUNEN FÅR LÖSA DET', griev: 8, temp: { unrest: 3, safety: -1 }, ind: { segreg: 2, xenophobia: 2 }, tip: 'Kommunen löser det så gott den kan. Det syns om tio år.' },
    ],
  },
  {
    id: 'rea_inv_gast', icon: '\u{1F477}', weight: 2, cooldown: 900,
    kind: 'migration', react: true,
    title: 'GÄSTARBETARNA OCH FACKET',
    text: 'Det nya systemet för arbetskraftsinvandring har gjort att byggföretagen i {huvudstad} anställt hundratals snickare och betongarbetare från {land}. Byggena går snabbare än någonsin. Men byggfacket har avslöjat att flera av dem bor tolv i en trea och får halva avtalslönen, och kallar det "lönedumpning med statens välsignelse".',
    when: (c) => c.changed('immigration') && c.is('immigration', 'guestworker', 'managed', 'points', 'goldenvisa'),
    choices: [
      { text: 'KRAV PÅ AVTALSLÖN FÖR ARBETSTILLSTÅND', cost: { pp: 8 }, griev: -10, temp: { qol: 1, gdp: -1 }, tip: 'Samma lön för samma jobb. Byggena går lite långsammare.' },
      { text: 'FLER KONTROLLER PÅ BYGGARBETSPLATSERNA', cost: { money: 200 }, griev: -6, temp: { corruption: -2 }, tip: 'Inspektörerna hittar fler fusk än de hade trott.' },
      { text: 'BYGGENA ÄR DET VIKTIGA', griev: 6, temp: { gdp: 2, factory: 1 }, ind: { strikes: 20 }, tip: 'Huset blir klart i tid. Ingen frågar vem som byggde det.' },
    ],
  },
  {
    id: 'rea_medb_prov', icon: '\u{1F4C3}', weight: 2, cooldown: 900,
    kind: 'migration', react: true,
    title: 'TRETTIO ÅR I LANDET - OCH OSÄKER',
    text: 'Efter ändringen av medborgarskapet har brev skickats till tiotusentals invånare som bott i landet i årtionden. En pensionerad sjuksköterska i {stad}, född i {land} men här sedan hon var sju år, har fått veta att hon måste göra om sin ansökan. Hon gråter i lokal-tv. Hennes grannar har startat en namninsamling.',
    when: (c) => c.changed('citizenship') && c.is('citizenship', 'testsoath', 'bloodline', 'loyalty', 'denaturalize'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL MEDBORGARSKAPET', cost: { pp: 12 }, undo: 'citizenship', griev: -20, temp: { freedom: 1, approval: 2 }, tip: 'Breven var ett misstag. Det säger du i alla fall nu.' },
      { text: 'UNDANTAG FÖR DEM SOM BOTT HÄR I TIO ÅR', cost: { pp: 6 }, griev: -12, temp: { approval: 2 }, tip: 'Sjuksköterskan får behålla sitt pass. Hon skickar en kaka till ministern.' },
      { text: 'REGLERNA GÄLLER ALLA', griev: 10, temp: { freedom: -2, unrest: 3 }, perm: { integration: -1 }, ind: { trustgov: -3, xenophobia: 1 }, tip: 'Den som inte känner sig välkommen slutar försöka.' },
    ],
  },
  {
    id: 'rea_medb_cerem', icon: '\u{1F38A}', weight: 2,
    kind: 'migration', react: true,
    title: 'MEDBORGARSKAPSCEREMONIN',
    text: 'Den första medborgarskapsceremonin efter de nya reglerna hölls i stadshuset i {stad}. Åttahundra nya medborgare sjöng nationalsången, många med tårar i ögonen, och en nittioårig man från {land} som väntat i fyrtio år fick sitt intyg först. Kritiker menar att medborgarskapet blivit för lätt att få och tappat sitt värde.',
    when: (c) => c.changed('citizenship') && c.is('citizenship', 'residency', 'birthright', 'easy'),
    choices: [
      { text: 'GÖR CEREMONIN TILL EN NATIONELL FEST', cost: { money: 150 }, temp: { approval: 3, stability: 2 }, perm: { integration: 1 }, griev: -6, tip: 'Tårta, flaggor och en kör. Den nittioårige dansar.' },
      { text: 'ERBJUD EN KURS OM SAMHÄLLET', cost: { money: 100 }, perm: { integration: 2 }, griev: -4, tip: 'Frivillig, gratis och med kaffe. Nästan alla går.' },
      { text: 'LÅT RESULTATEN SVARA KRITIKERNA', temp: { approval: -1 }, perm: { integration: 1 }, griev: 2, tip: 'Medborgare röstar, betalar skatt och engagerar sig. Det tar några år att se.' },
    ],
  },
  {
    id: 'rea_grans_mur', icon: '\u{1F6A7}', weight: 2, cooldown: 900,
    kind: 'migration', react: true,
    title: 'KÖN VID GRÄNSEN TILL {GRANNE}',
    text: 'Sedan gränskontrollen skärptes står lastbilarna i två mil långa köer vid gränsen till {granne}. Pendlare som jobbar på andra sidan förlorar två timmar om dagen, och fiskhandlarna säger att varorna hinner bli dåliga. På båda sidor av stängslet finns släktingar som nu bara ses en gång i månaden.',
    when: (c) => c.changed('border_control') && c.is('border_control', 'scanning', 'fences', 'wall', 'militarized'),
    choices: [
      { text: 'BACKA GRÄNSKONTROLLEN', cost: { pp: 10 }, undo: 'border_control', griev: -16, rel: 4, temp: { gdp: 1 }, tip: 'Köerna försvinner på en eftermiddag. Stängslet står kvar ett tag.' },
      { text: 'SNABBFIL FÖR PENDLARE OCH LASTBILAR', cost: { money: 300 }, griev: -8, temp: { gdp: 1 }, rel: 2, tip: 'Ett pendlarkort och en egen fil. Fisken kommer fram färsk.' },
      { text: 'SÄKERHETEN FÖRST', griev: 6, temp: { safety: 2, gdp: -2 }, rel: -4, ind: { tourists: -10 }, tip: 'Säkrare gräns. Längre köer. Färre turister.' },
    ],
  },
  {
    id: 'rea_grans_oppen', icon: '\u{1F309}', weight: 2,
    kind: 'migration', react: true,
    title: 'BRON UTAN BOMMAR',
    text: 'Sedan gränskontrollerna togs bort pendlar tusentals människor varje dag mellan {stad} och {granne} utan att stanna. Handeln har ökat och den gamla tullstationen har blivit kafé. Men tullen rapporterar att smugglingen av cigaretter och stöldgods ökat, och polisen på båda sidor vill ha ett gemensamt register.',
    when: (c) => c.changed('border_control') && c.is('border_control', 'none', 'openunion', 'spot'),
    choices: [
      { text: 'GEMENSAM POLISPATRULL MED {GRANNE}', cost: { money: 200 }, rel: 5, temp: { safety: 2 }, griev: -6, tip: 'Två länders poliser i samma bil. De delar på kaffet.' },
      { text: 'STICKPROV VID GRÄNSEN IGEN', cost: { pp: 5 }, law: ['border_control', 'spot'], temp: { safety: 1 }, griev: 2, tip: 'En bil av hundra stoppas. Smugglarna räknar på oddsen.' },
      { text: 'NJUT AV ÖPPENHETEN', temp: { gdp: 2, safety: -1 }, rel: 3, griev: -4, ind: { crimeidx: 3 }, tip: 'Kaféet i tullstationen säljer slut på kanelbullar varje dag.' },
    ],
  },
  {
    id: 'rea_m_middag', icon: '\u{1F37D}\u{FE0F}', weight: 2, cooldown: 800,
    kind: 'migration', react: true,
    title: 'GRÄLET VID SÖNDAGSMIDDAGEN',
    text: 'Beslutet om {lag} har blivit landets mest omdebatterade fråga. Var tredje familj säger att de bråkat om det vid middagsbordet. I {stad} har två grannar som inte pratat på tjugo år hamnat på samma sida. Främlingsfientliga grupper försöker utnyttja frågan, och många invandrare säger att de känner sig ovälkomna.',
    when: (c) => c.changed(...MIGRATION) && c.grievOf('migration') > 5,
    choices: [
      { text: 'MEDBORGARMÖTEN I VARJE KOMMUN', cost: { money: 200 }, griev: -8, temp: { stability: 2 }, tip: 'Folk som pratar med varandra slutar ofta skrika på varandra.' },
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -12, temp: { approval: 1 }, tip: 'Middagarna blir lugnare. Frågan försvinner inte.' },
      { text: 'HÅLL FAST VID BESLUTET OCH FÖRKLARA DET', griev: 4, temp: { ideopower: 2 }, tip: 'Tydligt ledarskap. Eller envishet. Beror på vem som sitter vid bordet.' },
    ],
  },

  // ===== MILJÖN OCH ENERGIN =====
  {
    id: 'rea_miljo_kedja', icon: '\u{1F332}', weight: 3, cooldown: 1000,
    kind: 'miljo', react: true,
    title: 'FASTKEDJADE VID TRÄDEN',
    text: 'Sedan miljöskyddet sänktes har avverkningsmaskinerna rullat in i den gamla skogen ovanför {stad}. I gryningen hade tjugo aktivister kedjat fast sig vid träden och maskinerna. Bland dem finns en pensionerad biologilärare, två scouter och ortens kyrkoherde. Skogsbolaget har ringt polisen. Polisen har ringt regeringen.',
    when: (c) => c.cut('environment'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL MILJÖSKYDDET', cost: { pp: 12 }, undo: 'environment', griev: -20, temp: { qol: 2, approval: 2 }, tip: 'Maskinerna backar ut ur skogen. Scouterna får ett märke.' },
      { text: 'SKYDDA JUST DEN HÄR SKOGEN', cost: { money: 300 }, griev: -8, next: ['rea_miljo_avtal', null], tip: 'En skog räddad. Hundra andra står på tur.' },
      { text: 'POLISEN KLIPPER KEDJORNA', griev: 10, temp: { unrest: 4, approval: -3 }, ind: { protests: 40 }, next: ['rea_miljo_lager', null], tip: 'Kyrkoherden bärs bort med psalmboken i handen. Fotograferna är på plats.' },
    ],
  },
  {
    id: 'rea_miljo_lager', icon: '\u{1F3D5}\u{FE0F}', chain: true, kind: 'miljo',
    title: 'TÄLTLÄGRET I SKOGEN',
    text: 'Bilderna på kyrkoherden som bars bort av polisen har spridits över hela landet. Nu bor tvåtusen människor i ett tältläger i skogen ovanför {stad}, skolklasser åker dit på studiebesök och en känd artist har hållit gratiskonsert bland granarna. Skogsbolaget förlorar pengar för varje dag maskinerna står stilla.',
    choices: [
      { text: 'GE MED: ÅTERSTÄLL MILJÖSKYDDET', undo: 'environment', griev: -24, temp: { approval: 3, qol: 2 }, tip: 'Tälten packas ihop. Artisten släpper en låt om det.' },
      { text: 'KÖP UT SKOGSBOLAGET UR AVTALET', cost: { money: 600 }, griev: -12, temp: { approval: 2 }, perm: { qol: 1 }, next: 'rea_miljo_avtal', tip: 'Dyrt för en skog. Billigt för en nationalpark.' },
      { text: 'RENSA LÄGRET', cost: { money: 150 }, griev: 14, temp: { unrest: 7, approval: -5, freedom: -2 }, ind: { protests: 60, trustgov: -4 }, mod: 'martyr', tip: 'Lägret är borta på en dag. Minnet av det försvinner aldrig.' },
    ],
  },
  {
    id: 'rea_miljo_avtal', icon: '\u{1F343}', chain: true, kind: 'miljo',
    title: 'SKOGSAVTALET',
    text: 'Skogsbolaget, aktivisterna och kommunen i {stad} har kommit överens: den äldsta delen av skogen blir naturreservat, och resten avverkas varsamt utan kalhyggen. Biologiläraren har fått uppdraget att leda guidade turer i reservatet. Skogsbolaget har redan börjat använda avtalet i sin reklam.',
    choices: [
      { text: 'GÖR AVTALET TILL EN NATIONELL MODELL', cost: { pp: 10 }, griev: -15, perm: { qol: 1 }, temp: { approval: 3, stability: 2 }, tip: 'Hyggesfritt i hela landet. Skogsbolagen gnäller och anpassar sig.' },
      { text: 'NÖJ DIG MED ETT AVTAL', griev: -6, temp: { approval: 2 }, tip: 'En skog räddad, en lärdom vunnen.' },
    ],
  },
  {
    id: 'rea_miljo_traktor', icon: '\u{1F33E}', weight: 2, cooldown: 900,
    kind: 'miljo', react: true,
    title: 'TRAKTORERNA PÅ MOTORVÄGEN',
    text: 'De skärpta miljöreglerna har fått bönderna att se rött. Tvåhundra traktorer kör i snigelfart på motorvägen mot {huvudstad}, och köerna är tre mil långa. Bönderna säger att de nya reglerna om gödsel, diken och skyddszoner gör att gårdarna inte går runt. Miljöorganisationerna kallar reglerna trettio år försenade.',
    when: (c) => c.changed('environment') && c.is('environment', 'rightsofnature', 'strict', 'thirty', 'strong'),
    choices: [
      { text: 'BACKA MILJÖREGLERNA', cost: { pp: 10 }, undo: 'environment', griev: -10, temp: { qol: -1, factory: 1 }, tip: 'Traktorerna vänder hem. Miljöorganisationerna parkerar sina cyklar framför kansliet.' },
      { text: 'OMSTÄLLNINGSSTÖD TILL BÖNDERNA', cost: { money: 500 }, griev: -10, temp: { approval: 2 }, perm: { qol: 1 }, tip: 'Reglerna står kvar, men nu finns pengar att följa dem.' },
      { text: 'STÅ FAST: NATUREN KAN INTE VÄNTA', griev: 8, temp: { unrest: 3, factory: -1 }, ind: { protests: 30, infl: 0.2 }, tip: 'Naturen kan inte vänta. Bilisterna på motorvägen kan inte heller.' },
    ],
  },
  {
    id: 'rea_energi_vastar', icon: '\u{26FD}', weight: 3, cooldown: 900,
    kind: 'miljo', react: true,
    title: 'VÄSTARNA PÅ RONDELLERNA',
    text: 'Sedan energipolitiken lades om har bensinpriset stigit med en femtedel och elräkningen i vinter blev dubbelt så hög. På rondellerna utanför {stad} står pendlare, hantverkare och lastbilschaufförer i reflexvästar varje lördag. "Ni i {huvudstad} kan ta tunnelbanan, det kan inte vi", står det på en skylt.',
    when: (c) => c.changed('energy') && c.is('energy', 'rationing', 'renewable', 'green', 'carbontax'),
    choices: [
      { text: 'BACKA ENERGIPOLITIKEN', cost: { pp: 12 }, undo: 'energy', griev: -20, temp: { approval: 3 }, ind: { infl: -0.3 }, tip: 'Bensinpriset sjunker. Klimatmålen också.' },
      { text: 'PENDLARBIDRAG FÖR LANDSBYGDEN', cost: { money: 400 }, griev: -10, temp: { approval: 2 }, perm: { income: -1 }, tip: 'Den som måste köra bil får hjälp. Den som kan låta bli får ingenting.' },
      { text: 'STÅ FAST: KLIMATET KAN INTE VÄNTA', griev: 9, temp: { unrest: 4, qol: -2 }, ind: { protests: 40, infl: 0.4 }, tip: 'Västarna lyser i mörkret. Varje lördag.' },
    ],
  },
  {
    id: 'rea_energi_skolstrejk', icon: '\u{1F9D2}', weight: 2, cooldown: 900,
    kind: 'miljo', react: true,
    title: 'SKOLSTREJK FÖR KLIMATET',
    text: 'Satsningen på olja, gas och kol har fått landets skolelever att lämna klassrummen varje fredag. I {huvudstad} sitter tiotusen barn och ungdomar utanför parlamentet med handmålade skyltar. En femtonåring från {stad} har talat inför FN, och talet har setts fyrtio miljoner gånger. Lärarna vet inte om de ska ge frånvaro eller beröm.',
    when: (c) => c.changed('energy') && c.is('energy', 'gasbridge', 'fossil', 'fuelsubsidy', 'dominance'),
    choices: [
      { text: 'BACKA ENERGIPOLITIKEN', cost: { pp: 12 }, undo: 'energy', griev: -20, rel: 4, temp: { approval: 2, gdp: -1 }, tip: 'Eleverna går tillbaka till lektionerna. Med nya kunskaper i samhällskunskap.' },
      { text: 'BJUD IN ELEVERNA TILL ETT KLIMATRÅD', cost: { pp: 5 }, griev: -8, temp: { approval: 2 }, tip: 'Femtonåringen har förberett sig bättre än dina rådgivare.' },
      { text: 'BILLIG ENERGI GER JOBB', griev: 8, temp: { gdp: 2, factory: 2 }, rel: -4, ind: { protests: 30 }, tip: 'Jobb i dag. Barnen frågar om i morgon.' },
    ],
  },
  {
    id: 'rea_trafik_land', icon: '\u{1F697}', weight: 2, cooldown: 900,
    kind: 'miljo', react: true,
    title: 'BILISTERNA PÅ LANDET RASAR',
    text: 'Den nya trafikpolitiken har gjort det dyrt och krångligt att köra bil. I {huvudstad} är luften renare och cykelbanorna fulla. Men på landsbygden runt {stad}, där bussen går två gånger om dagen, känner sig folk straffade. En undersköterska i hemtjänsten säger att hon nu betalar mer för bilen än hon fick i lönelyft.',
    when: (c) => c.changed('transport') && c.is('transport', 'carfree', 'transitfirst'),
    choices: [
      { text: 'BACKA TRAFIKPOLITIKEN', cost: { pp: 10 }, undo: 'transport', griev: -16, temp: { approval: 2 }, tip: 'Bilarna rullar in i stan igen. Cyklisterna suckar.' },
      { text: 'FLER BUSSAR PÅ LANDSBYGDEN', cost: { money: 400 }, griev: -10, perm: { qol: 1 }, tip: 'Bussen går varje timme. Det är en revolution på landet.' },
      { text: 'STADEN FÅR GÅ FÖRE', griev: 7, temp: { qol: 1, approval: -3 }, tip: 'Klyftan mellan stad och land blir lite djupare.' },
    ],
  },
  {
    id: 'rea_trafik_gratis', icon: '\u{1F68C}', weight: 2,
    kind: 'miljo', react: true,
    title: 'GRATIS BUSS OCH FULLA VAGNAR',
    text: 'Sedan kollektivtrafiken blev gratis har resandet i {stad} ökat med fyrtio procent. Pensionärer åker in till stan för att fika, ungdomar tar sig till jobb och träning och bilköerna har krympt. Men bussarna är så fulla i rusningstid att folk får stå kvar på hållplatsen, och chaufförerna talar om att strejka.',
    when: (c) => c.changed('transport') && c.is('transport', 'freetransit', 'highspeed'),
    choices: [
      { text: 'KÖP FLER BUSSAR OCH ANSTÄLL FÖRARE', cost: { money: 500 }, griev: -10, temp: { qol: 3, approval: 2 }, tip: 'Femtio nya bussar. Fyrtio nya förare. Tio bussar väntar på förare.' },
      { text: 'AVGIFT I RUSNINGSTID', cost: { pp: 5 }, temp: { qol: 1 }, griev: 2, perm: { income: 1 }, tip: 'Gratis, utom när man behöver det mest. Logiskt, men inte populärt.' },
      { text: 'LÅT TRÄNGSELN REGLERA SIG SJÄLV', temp: { qol: 1, approval: -1 }, griev: -3, ind: { strikes: 15 }, tip: 'Den som inte får plats tar cykeln. Eller blir arg.' },
    ],
  },
  {
    id: 'rea_mi_forskare', icon: '\u{1F52C}', weight: 2, cooldown: 800,
    kind: 'miljo', react: true,
    title: 'FORSKARNA VARNAR',
    text: 'Fyrahundra miljöforskare har i ett öppet brev varnat för följderna av beslutet om {lag}. De har mätt vattnet, luften och fågelbestånden i trettio år och skriver att landet riskerar att på tio år förlora det som tog femtio år att bygga upp. Brevet har publicerats i den största morgontidningen, och turistnäringen i {stad} är orolig.',
    when: (c) => c.cut(...MILJO),
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -18, temp: { qol: 2 }, rel: 2, tip: 'Forskarna mäter vidare. Kurvorna planar ut.' },
      { text: 'BESTÄLL EN OBEROENDE MILJÖRAPPORT', cost: { money: 150 }, temp: { research: 1 }, griev: -5, tip: 'Rapporten kommer om ett år. Den säger samma sak som brevet, med fler diagram.' },
      { text: 'EKONOMIN GÅR FÖRE', griev: 7, temp: { gdp: 1, qol: -2 }, ind: { tourists: -5 }, tip: 'Fåglarna röstar inte. Turisterna gör det med plånboken.' },
    ],
  },

  // ===== EKONOMIN =====
  {
    id: 'rea_eko_plan', icon: '\u{1F35E}', weight: 2, cooldown: 900,
    kind: 'ekonomi', react: true,
    title: 'KÖERNA UTANFÖR BAGERIET',
    text: 'Övergången till det nya ekonomiska systemet har inte gått smärtfritt. I {stad} står folk i kö utanför bageriet klockan sex på morgonen, eftersom priserna nu sätts av en statlig nämnd och mjölleveranserna är oregelbundna. Företagare säljer sina firmor och flyttar till {granne}. Planeringsministeriet lovar att leveranserna snart är i fas.',
    when: (c) => c.changed('economic_system') && c.is('economic_system', 'communal', 'central', 'thirdpos', 'planned'),
    choices: [
      { text: 'BACKA OCH ÅTERSTÄLL DET EKONOMISKA SYSTEMET', cost: { pp: 20 }, undo: 'economic_system', griev: -22, temp: { gdp: 2 }, tip: 'Bageriet sätter sina egna priser igen. Kön försvinner på en vecka.' },
      { text: 'TILLÅT SMÅFÖRETAG OCH TORGHANDEL', cost: { pp: 8 }, griev: -10, temp: { gdp: 1, qol: 1 }, tip: 'Planen för det stora, marknaden för brödet. Det har prövats förr.' },
      { text: 'STÅ FAST: PLANEN BEHÖVER TID', griev: 10, temp: { qol: -3, gdp: -2 }, mod: 'capital_flight', ind: { stockcap: -10 }, tip: 'Planen behöver tid. Brödet behövs i morgon.' },
    ],
  },
  {
    id: 'rea_ag_stamning', icon: '\u{1F4D1}', weight: 2, cooldown: 1000,
    kind: 'ekonomi', react: true,
    title: 'DE UTLÄNDSKA ÄGARNA STÄMMER',
    text: 'Förstatligandet av industrin har fått de utländska ägarna att slå tillbaka. Ett gruvbolag från {land} har stämt staten vid en internationell skiljedomstol och kräver ersättning motsvarande en tiondel av statsbudgeten. Kreditvärderingsinstituten har satt landet under bevakning, och två planerade fabriksbyggen i {stad} är pausade.',
    when: (c) => c.changed('ownership') && c.is('ownership', 'total', 'nationalized', 'strategic'),
    choices: [
      { text: 'BACKA FÖRSTATLIGANDET', cost: { pp: 15 }, undo: 'ownership', griev: -18, rel: 5, ind: { stockcap: 5 }, tip: 'Gruvbolaget drar tillbaka stämningen. Med ett leende.' },
      { text: 'FÖRHANDLA OM ERSÄTTNING', cost: { money: 800 }, griev: -10, rel: 4, temp: { stability: 1 }, tip: 'Dyrt, men billigare än en förlorad skiljedom.' },
      { text: 'VI BETALAR INTE FÖR DET SOM ÄR VÅRT', griev: 8, rel: -8, mod: 'capital_flight', next: ['rea_ag_dom', null], tip: 'Ett starkt slagord. Domstolen i {land} läser inte slagord.' },
    ],
  },
  {
    id: 'rea_ag_dom', icon: '\u{2696}\u{FE0F}', chain: true, kind: 'ekonomi',
    title: 'SKILJEDOMEN',
    text: 'Den internationella skiljedomstolen har fällt sitt avgörande: staten ska betala full ersättning till gruvbolaget från {land}, plus ränta. Om staten vägrar kan bolaget lägga beslag på statens tillgångar utomlands - fartyg, flygplan och konton. Ett fraktfartyg under landets flagg ligger redan kvarhållet i en hamn i {land}.',
    choices: [
      { text: 'BETALA', cost: { money: 1200 }, griev: -6, rel: 6, temp: { stability: 2 }, tip: 'Fartyget släpps. Statskassan får en ordentlig smäll.' },
      { text: 'GÖR UPP: AKTIER I STATSBOLAGET I STÄLLET', cost: { pp: 15 }, griev: -4, rel: 3, temp: { income: -2 }, tip: 'Gruvbolaget blir delägare i det som skulle vara folkets. Ironiskt.' },
      { text: 'VÄGRA BETALA', griev: 6, rel: -12, temp: { gdp: -2, income: -3 }, ind: { stockcap: -8 }, tip: 'Fartyget blir kvar i {land}. Snart har de ett flygplan också.' },
    ],
  },
  {
    id: 'rea_bank_rusning', icon: '\u{1F3E7}', weight: 2, cooldown: 1000,
    kind: 'ekonomi', react: true,
    title: 'KÖERNA VID BANKOMATERNA',
    text: 'Efter att bankreglerna luckrades upp har en av landets större banker förlorat stort på riskabla fastighetslån. Ryktet spred sig på en kväll, och i morse ringlade köerna vid bankomaterna i {stad} runt kvarteren. Banken säger att pengarna är säkra. Folk tar ut dem ändå.',
    when: (c) => c.changed('banking') && c.is('banking', 'light', 'secrecy', 'offshore', 'none'),
    choices: [
      { text: 'STATEN GARANTERAR ALLA INSÄTTNINGAR', cost: { money: 700 }, griev: -15, temp: { stability: 3 }, ind: { stockcap: 4 }, tip: 'Köerna försvinner på en timme. Räkningen kommer senare.' },
      { text: 'BACKA BANKREGLERNA', cost: { pp: 12 }, undo: 'banking', griev: -12, temp: { stability: 2 }, tip: 'Bankerna får hårdare tag. Nästa gång blir det inte så här.' },
      { text: 'LÅT BANKEN GÅ OMKULL', tip: 'Marknaden straffar dåliga banker. Ibland straffar den alla andra också.',
        risk: { chance: 0.5,
          win: { text: 'Konkursen blir smärtsam men begränsad. Andra banker tar över kunderna.', griev: 4, temp: { gdp: -2 } },
          lose: { text: 'Paniken sprider sig till tre andra banker. Kreditmarknaden fryser.', griev: 12, temp: { gdp: -5, unrest: 4 }, mod: 'downturn', ind: { stockcap: -15, unemp: 0.5 } } } },
    ],
  },
  {
    id: 'rea_penn_guld', icon: '\u{1F4B1}', weight: 2, cooldown: 900,
    kind: 'ekonomi', react: true,
    title: 'PENSIONÄRERNA KÖPER GULD',
    text: 'Sedan penningpolitiken lades om har sedelpressarna gått varmt. Priserna i mataffärerna har stigit märkbart på ett kvartal, och pensionärer i {stad} som sparat hela livet ser pengarna tappa i värde. Guldsmederna har aldrig sålt så mycket, och folk har börjat ta betalt i utländsk valuta för begagnade bilar.',
    when: (c) => c.changed('monetary') && c.is('monetary', 'printing', 'repression', 'qe', 'loose'),
    choices: [
      { text: 'BACKA: CENTRALBANKEN FÅR SITT OBEROENDE', cost: { pp: 15 }, undo: 'monetary', griev: -18, ind: { infl: -0.8 }, tip: 'Centralbankschefen höjer räntan samma eftermiddag. Hon har väntat länge.' },
      { text: 'INDEXERA PENSIONERNA MOT PRISERNA', cost: { money: 400 }, griev: -10, temp: { approval: 2 }, perm: { income: -1 }, tip: 'Pensionärerna klarar sig. De som sparat på banken gör det inte.' },
      { text: 'LITE INFLATION SMÖRJER EKONOMIN', griev: 8, temp: { gdp: 2 }, ind: { infl: 1.2 }, tip: 'Lite inflation, ja. Frågan är när det slutar vara lite.' },
    ],
  },
  {
    id: 'rea_e_borsen', icon: '\u{1F4C9}', weight: 2, cooldown: 800,
    kind: 'ekonomi', react: true,
    title: 'BÖRSEN RASAR PÅ BESKEDET',
    text: 'Beskedet om {lag} fick börsen att falla sex procent på en dag, det största raset på flera år. Utländska fonder säljer, valutan försvagas och en känd investerare säger i tv att landet inte längre är förutsägbart. För de flesta är det bara siffror på en skärm - men i pensionsfonderna är det deras framtid.',
    when: (c) => c.changed(...EKONOMI) && c.grievOf('ekonomi') > 5,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -14, ind: { stockcap: 6 }, tip: 'Börsen studsar upp. Din trovärdighet studsar inte lika högt.' },
      { text: 'LUGNA MARKNADEN MED EN TYDLIG PLAN', cost: { pp: 8 }, griev: -6, temp: { stability: 2 }, ind: { stockcap: 3 }, tip: 'Marknaden hatar osäkerhet mer än den hatar dåliga besked.' },
      { text: 'BÖRSEN ÄR INTE LANDET', griev: 4, temp: { gdp: -1, approval: 1 }, ind: { stockcap: -6 }, tip: 'Sant. Men landets pensioner ligger på börsen.' },
    ],
  },

  // ===== VÄRNPLIKTEN =====
  {
    id: 'rea_varn_vagran', icon: '\u{1F4E9}', weight: 3, cooldown: 1000,
    kind: 'forsvar', react: true,
    title: 'DE VÄGRAR MÖNSTRA',
    text: 'Den utökade värnplikten har gjort att tiotusentals artonåringar fått sina inkallelser samtidigt. Nu har tvåtusen av dem rivit sönder breven offentligt på torget i {huvudstad}. Föräldrar, präster och fredsföreningar stöttar dem. Andra unga har börjat söka studieplatser i {granne} för att slippa.',
    when: (c) => c.changed('military_service') && c.is('military_service', 'high', 'nationalservice', 'mandatory', 'lifelong'),
    choices: [
      { text: 'BACKA VÄRNPLIKTEN', cost: { pp: 12 }, undo: 'military_service', griev: -20, temp: { approval: 3, readiness: -2 }, tip: 'Artonåringarna firar. Generalerna gör det inte.' },
      { text: 'INFÖR EN CIVIL PLIKT SOM ALTERNATIV', cost: { money: 300 }, griev: -10, temp: { qol: 1 }, next: ['rea_varn_civil', null], tip: 'Ett år för landet, med eller utan gevär.' },
      { text: 'VÄGRA BETYDER FÄNGELSE', griev: 12, temp: { freedom: -3, unrest: 5, readiness: 2 }, ind: { protests: 40, trustgov: -3 }, next: ['rea_varn_fangelse', null], tip: 'Lagen är tydlig. Artonåringar är envisa.' },
    ],
  },
  {
    id: 'rea_varn_fangelse', icon: '\u{1F512}', chain: true, kind: 'forsvar',
    title: 'VAPENVÄGRARNA I FÄNGELSET',
    text: 'Tvåhundra vapenvägrare sitter nu i fängelse, och deras föräldrar står utanför varje söndag med termos och plakat. En av dem, en nittonårig fiolstudent från {stad}, har blivit hela rörelsens ansikte och får brev från hela världen. Fängelserna är fulla, och kriminalvården klagar på att de inte är byggda för musiker.',
    choices: [
      { text: 'SLÄPP DEM OCH BACKA VÄRNPLIKTEN', undo: 'military_service', griev: -22, temp: { freedom: 2, readiness: -2 }, tip: 'Fiolstudenten ger en konsert på fängelsetrappan. Det blir en skiva.' },
      { text: 'SAMHÄLLSTJÄNST I STÄLLET FÖR FÄNGELSE', cost: { pp: 8 }, griev: -10, temp: { qol: 1 }, next: 'rea_varn_civil', tip: 'De vägrar gevär. De vägrar inte att hjälpa till.' },
      { text: 'SKÄRP STRAFFEN', cost: { pp: 10 }, griev: 14, temp: { readiness: 2, freedom: -4 }, rel: -4, ind: { demo: -0.2, protests: 50 }, mod: 'martyr', tip: 'Fler i fängelse, fler brev från världen.' },
    ],
  },
  {
    id: 'rea_varn_civil', icon: '\u{1F692}', chain: true, kind: 'forsvar',
    title: 'DEN CIVILA PLIKTEN',
    text: 'Den civila plikten har kommit igång. Artonåringar som inte vill bära vapen jobbar ett år i räddningstjänsten, hemtjänsten eller som brandvakter i skogarna. I {stad} har de byggt om en nedlagd skola till fritidsgård. Många säger att det var det bästa året i deras liv, och de frivilliga till de stridande förbanden har faktiskt blivit fler.',
    choices: [
      { text: 'GÖR DEN CIVILA PLIKTEN PERMANENT', cost: { money: 300 }, griev: -15, perm: { qol: 1, stability: 1 }, temp: { approval: 3 }, tip: 'En generation som vet hur man släcker en skogsbrand. Inte dumt.' },
      { text: 'LÅT DEN VARA ETT FÖRSÖK', griev: -6, temp: { approval: 2 }, tip: 'Ett lyckat försök. De brukar bli permanenta av sig själva.' },
    ],
  },

  // ===== FÖRSVARSBUDGETEN OCH KÄRNVAPNEN =====
  {
    id: 'rea_fbudget_ned', icon: '\u{2693}', weight: 2, cooldown: 900,
    kind: 'forsvar', react: true,
    title: 'FLOTTAN SÄLJER SINA FARTYG',
    text: 'Den sänkta försvarsbudgeten gör att flottan ska sälja tre av sina fem korvetter till {land}. Varvsarbetarna i {stad} som byggde dem för tjugo år sedan står på kajen och ser dem gå. Officersförbundet varnar för att kusten nu bevakas "med kikare och god vilja". I skolorna och vården är man däremot nöjd med de nya pengarna.',
    when: (c) => c.changed('defense_budget') && c.is('defense_budget', 'disarmed', 'minimal', 'peacedividend'),
    choices: [
      { text: 'BACKA FÖRSVARSBUDGETEN', cost: { pp: 12 }, undo: 'defense_budget', griev: -16, temp: { readiness: 2, approval: -1 }, tip: 'Korvetterna stannar. Skolorna får vänta.' },
      { text: 'BILLIG KUSTBEVAKNING MED DRÖNARE', cost: { money: 300, rp: 20 }, griev: -8, temp: { readiness: 1, milpower: 2 }, tip: 'Drönare är billiga. Det är också deras svaghet.' },
      { text: 'PENGARNA GÖR MER NYTTA I SKOLAN', griev: 6, temp: { qol: 2, milpower: -3 }, perm: { welfare: 1 }, tip: 'Fred är billigast så länge den varar.' },
    ],
  },
  {
    id: 'rea_fbudget_upp', icon: '\u{1F6E1}\u{FE0F}', weight: 2, cooldown: 900,
    kind: 'forsvar', react: true,
    title: 'KANONER ELLER SMÖR?',
    text: 'Den kraftigt höjda försvarsbudgeten har gett vapenfabriken i {stad} order för tio år framåt och tusen nya jobb. Men pengarna tas från någonstans. Sjukhusen får mindre i år, och en debattartikel med rubriken "Kanoner eller smör?" har delats över hela landet. Grannländerna följer upprustningen med visst intresse.',
    when: (c) => c.changed('defense_budget') && c.is('defense_budget', 'rearm', 'high', 'fortress', 'garrison', 'wareconomy'),
    choices: [
      { text: 'BACKA FÖRSVARSBUDGETEN', cost: { pp: 12 }, undo: 'defense_budget', griev: -14, temp: { qol: 1 }, tip: 'Sjukhusen får sina pengar. Fabriken i {stad} varslar.' },
      { text: 'FINANSIERA MED EN SÄRSKILD FÖRSVARSSKATT', cost: { pp: 10 }, griev: -6, perm: { income: 1 }, temp: { approval: -2 }, tip: 'Ärligt: försvaret kostar, så här mycket. Folk uppskattar ärligheten. Inte skatten.' },
      { text: 'TRYGGHET KOSTAR', griev: 6, temp: { factory: 2, milpower: 3 }, rel: -3, ind: { unemp: -0.2 }, tip: 'Smöret får vänta. Kanonerna är redan beställda.' },
    ],
  },
  {
    id: 'rea_karn_fackla', icon: '\u{2622}\u{FE0F}', weight: 2, cooldown: 1000,
    kind: 'forsvar', react: true,
    title: 'FREDSRÖRELSEN VAKNAR',
    text: 'Den nya kärnvapendoktrinen har väckt en fredsrörelse som legat i dvala sedan kalla kriget. Hundratusen människor har gått i fackeltåg i {huvudstad}, grannländerna har kallat till krismöte och barn ritar fredsduvor på skolgårdarna. Generalerna säger att doktrinen avskräcker. Föräldrarna i fackeltåget säger att den skrämmer.',
    when: (c) => c.changed('nuclear_doctrine') && c.is('nuclear_doctrine', 'deterrence', 'firststrike', 'brinkmanship'),
    choices: [
      { text: 'BACKA KÄRNVAPENDOKTRINEN', cost: { pp: 15 }, undo: 'nuclear_doctrine', griev: -22, rel: 8, tip: 'Grannländerna andas ut. Generalerna andas in.' },
      { text: 'LOVA ATT ALDRIG ANVÄNDA DEM FÖRST', cost: { pp: 8 }, griev: -10, rel: 4, temp: { milpower: -1 }, tip: 'Ett löfte som bara är värt något om det aldrig prövas.' },
      { text: 'AVSKRÄCKNING HÅLLER FREDEN', griev: 10, rel: -8, temp: { milpower: 3, readiness: 2 }, ind: { protests: 40 }, tip: 'Det har fungerat förr. Det har också nästan slutat illa förr.' },
    ],
  },
  {
    id: 'rea_karn_fred', icon: '\u{1F30F}', weight: 2,
    kind: 'forsvar', react: true,
    title: 'FREDSPRISETS LAND',
    text: 'Nedrustningen av kärnvapnen har gett {rike} rubriker över hela världen och en nominering till fredspriset. Fredsrörelsen firar på torget i {huvudstad}. Men generalerna har begärt ett möte om hur landet ska skydda sig om {granne} beter sig illa, och försvarsindustrin i {stad} varslar trehundra ingenjörer.',
    when: (c) => c.changed('nuclear_doctrine') && c.is('nuclear_doctrine', 'totalban', 'disarmament', 'nonnuclear'),
    choices: [
      { text: 'STARKARE KONVENTIONELLT FÖRSVAR', cost: { money: 500 }, griev: -6, temp: { milpower: 3, readiness: 2 }, tip: 'Ingenjörerna bygger luftvärn i stället. De är lika glada.' },
      { text: 'SÖK SKYDD I EN FÖRSVARSALLIANS', cost: { pp: 12 }, rel: 6, griev: -4, temp: { stability: 2 }, tip: 'Andras kärnvapen skyddar dig. Det är en sorts nedrustning.' },
      { text: 'FIRA MED FOLKET', griev: -8, rel: 6, temp: { approval: 4, milpower: -2 }, tip: 'En kväll med fackeltåg av den glada sorten.' },
    ],
  },

  // ===== FÖRSVARET: ALLMÄN REAKTION =====
  {
    id: 'rea_fo_veteran', icon: '\u{1F396}\u{FE0F}', weight: 2, cooldown: 800,
    kind: 'forsvar', react: true,
    title: 'VETERANERNA SÄGER IFRÅN',
    text: 'Veteranförbundet har skrivit ett ovanligt skarpt uttalande om beslutet om {lag}. De gamla soldaterna, många med tjänst i fredsbevarande insatser, menar att beslutet fattats utan att fråga dem som vet vad det kostar. Uttalandet har lästs upp på regementena, och några höga officerare har tackat för det öppet.',
    when: (c) => c.changed(...FORSVAR) && c.grievOf('forsvar') > 5,
    choices: [
      { text: 'BACKA {LAG}', cost: { pp: 12 }, undo: true, griev: -16, temp: { readiness: 1 }, tip: 'Veteranerna nickar. De är inte vana vid att bli lyssnade på.' },
      { text: 'BJUD IN VETERANERNA TILL ETT SAMRÅD', cost: { pp: 5 }, griev: -8, temp: { stability: 1 }, tip: 'Kaffe, bullar och fyrtio års erfarenhet runt samma bord.' },
      { text: 'POLITIKEN STYR FÖRSVARET, INTE TVÄRTOM', griev: 6, temp: { statepower: 2, readiness: -1 }, tip: 'Sant i en demokrati. Men officerarna minns tonen.' },
    ],
  },
];
