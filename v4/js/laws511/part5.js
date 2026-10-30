// IMPERIUM 5.11 — policing, speech, protest, corporate_tax, foreign_aid, nuclear_doctrine, ai_regulation, parental_leave, retirement_age, voting_age
export const EXTRAS = {
  policing: [
    { after: '^', option: { id: 'abolished', name: 'Police abolished', mods: { freedom: 14, income: 6, integration: 2, safety: -14, statepower: -14, stability: -5, approval: -3 },
        desc: 'Polisen läggs ner och ersätts av medlare, socialarbetare och grannskapsgrupper som löser konflikter i sina egna kvarter, en idé som växte fram efter protesterna i USA 2020. Staten sparar stora summor och ingen behöver längre vara rädd för polisen. Men ingen utreder grova brott, gängen tar över gator där ingen vågar säga emot och den som blir rånad får klara sig själv.' },
      locks: ['conservatism', 'nationalism', 'fascism', 'natsoc', 'imperialism', 'theocracy', 'stratocracy', 'communism', 'monarchism'] },
    { after: 'community', option: { id: 'oversight', name: 'Accountable policing', mods: { freedom: 4, approval: 3, corruption: -4, integration: 2, income: -2, statepower: -2 },
        desc: 'Varje polis bär kroppskamera, och en fristående myndighet utreder alla klagomål och alla fall där polisen använt våld, som Nordirlands polisombudsman. Förtroendet för polisen växer, mutor och övergrepp avslöjas och fler vittnen vågar tala. Men pappersarbetet tar tid från gatan, kamerorna kostar pengar och en del poliser tvekar att ingripa.' } },
    { after: 'militarized', option: { id: 'predictive', name: 'Predictive policing', mods: { safety: 12, statepower: 14, unrest: -4, research: 2, freedom: -17, approval: -7, income: -5 },
        desc: 'Kameror med ansiktsigenkänning sitter i varje gathörn och ett datorsystem räknar ut var och av vem nästa brott sannolikt kommer att begås, så att polisen kan vara där först. Fickstölder, rån och gängbrott blir sällsynta och nästan varje brott klaras upp. Men alla vet att de ständigt är iakttagna, oskyldiga stoppas för att datorn pekat ut dem och fängelserna fylls.' },
      locks: ['liberalism', 'democracy', 'anarchism', 'libertarianism'] },
  ],
  speech: [
    { after: 'broad', option: { id: 'whistleblower', name: 'Whistleblower shield', mods: { freedom: 5, corruption: -7, approval: 2, statepower: -4, polpower: -3 },
        desc: 'Den som avslöjar fusk, mutor eller fara på sin arbetsplats eller i en myndighet får inte straffas eller sparkas och kan gå direkt till medierna, som enligt EU:s visselblåsarregler. Korruptionen får svårt att gömma sig och förvaltningen blir ärligare. Men hemligheter läcker lättare, ledningen får svårare att styra i det tysta och en del anklagelser visar sig vara obefogade.' },
      locks: ['fascism', 'natsoc', 'stratocracy'] },
    { after: 'hatelaws', option: { id: 'fakenews', name: 'Fake news law', mods: { stability: 4, statepower: 6, unrest: -3, freedom: -8, research: -2, approval: -3 },
        desc: 'En myndighet får beordra att inlägg och artiklar som den anser vara falska ska rättas eller tas bort, som i Singapore. Lögner och bedrägerier sprids långsammare och samhällsdebatten blir lugnare. Men det är staten som avgör vad som är sant, och kritiker av regeringen märker att just deras inlägg oftast stämplas som falska.' },
      locks: ['anarchism', 'libertarianism'] },
    { after: 'lesemajeste', option: { id: 'foreignagent', name: 'Foreign agent law', mods: { statepower: 12, ideopower: 9, polpower: 4, unrest: -4, freedom: -18, approval: -7, research: -4, corruption: 5 },
        desc: 'Föreningar, tidningar och forskare som får pengar från utlandet måste registrera sig som utländska agenter och märka allt de publicerar, som i Ryssland. Regeringen får full koll på vem som försöker påverka landet och oppositionen tappar sina bidragsgivare. Men oberoende medier och hjälporganisationer stänger, utländska givare och företag drar sig undan och forskarna isoleras från omvärlden.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism'] },
  ],
  protest: [
    { after: '^', option: { id: 'disobedience', name: 'Disobedience tolerated', mods: { freedom: 15, approval: 4, unrest: 9, statepower: -14, stability: -6, safety: -3 },
        desc: 'Fredliga sittstrejker, blockader och ockupationer av torg och byggnader är tillåtna, och polisen ingriper bara om någon använder våld. Folkrörelser får en enorm kraft och makthavarna tvingas lyssna snabbt. Men vägar och arbetsplatser blockeras ofta, turisterna uteblir och den som inte håller med demonstranterna kommer ibland inte fram till sitt jobb.' },
      locks: ['fascism', 'natsoc', 'communism', 'stratocracy', 'theocracy', 'imperialism', 'nationalism'] },
    { after: 'zones', option: { id: 'liability', name: 'Organizer liability', mods: { statepower: 6, unrest: -4, income: 2, freedom: -8, approval: -4 },
        desc: 'Den som anordnar en demonstration blir personligen ansvarig för alla skador och får betala för polisens extra arbete, och den som blockerar en väg kan få stora böter, ungefär som i Spaniens omstridda ordningslag. Gatorna blir lugnare och skadegörelsen minskar. Men få vågar längre stå som arrangör, och små grupper utan pengar får i praktiken ingen röst.' },
      locks: ['anarchism'] },
    { after: 'banned', option: { id: 'staterallies', name: 'State rallies only', mods: { statepower: 18, ideopower: 12, unrest: -10, freedom: -26, approval: -14, qol: -5, income: -3 },
        desc: 'Alla egna demonstrationer är förbjudna, och de enda folkmassor som syns är statens egna parader och hyllningsmöten dit skolor och arbetsplatser förväntas skicka sitt folk. Staten visar upp ett enat folk och ideologin hörs överallt. Men ingen kan visa vad den egentligen tycker, missnöjet gror i det tysta och de ständiga mötena tar tid och pengar från vardagen.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem'] },
  ],
  corporate_tax: [
    { after: '^', option: { id: 'excess', name: 'Excess profits tax', mods: { income: 22, approval: 4, gdp: -15, factory: -13, research: -6, corruption: 3 },
        desc: 'All vinst över en rimlig avkastning går till staten, som när USA och Storbritannien tog upp till nittiofem procent av övervinsterna under andra världskriget. Statskassan fylls snabbt och ingen kan bli rik på kriser eller monopol. Men företagen slutar satsa när extra vinst ändå försvinner, kapitalet flyr utomlands och nya företag startas knappt alls.' },
      locks: ['libertarianism', 'liberalism'] },
    { after: 'standard', option: { id: 'patentbox', name: 'Patent box', mods: { research: 5, gdp: 2, factory: 1, income: -3, corruption: 2 },
        desc: 'Vanlig bolagsskatt gäller, men vinster från patent och egen forskning beskattas bara med några procent, som i Storbritannien och Nederländerna. Teknikföretag och forskningsavdelningar flyttar hit och antalet patent ökar snabbt. Statskassan tappar en del intäkter, och stora koncerner lär sig flytta vinster till sina patentbolag fast forskningen görs någon annanstans.' } },
    { after: 'low', option: { id: 'payout', name: 'Tax only on payouts', mods: { gdp: 5, factory: 5, research: 1, income: -7, approval: -1 },
        desc: 'Bolagen betalar ingen skatt så länge vinsten stannar i företaget, utan först när den delas ut till ägarna, som i Estland och Lettland. Företagen återinvesterar sina vinster och växer snabbt, och det blir enkelt att starta eget. Statskassan får in mindre och mer oregelbundet, och de rika kan låta pengarna växa i sina bolag i många år utan att betala skatt.' },
      locks: ['communism'] },
  ],
  foreign_aid: [
    { after: '^', option: { id: 'solidarity', name: 'Global solidarity', mods: { polpower: 9, justtime: 12, approval: 2, income: -16, gdp: -2, factory: -2 },
        desc: 'Landet ger två procent av sin ekonomi i bistånd, efterskänker fattiga länders skulder och betalar det med en avgift på flygresor och finansaffärer, som Frankrike gjort i mindre skala. Landet blir en moralisk stormakt med vänner i hela världen och tar inte längre emot något bistånd självt. Kostnaden är enorm, flygresorna blir dyrare och många invånare undrar varför pengarna inte stannar hemma.' },
      locks: ['nationalism', 'fascism', 'natsoc', 'imperialism', 'libertarianism'] },
    { after: 'reduced', option: { id: 'loans', name: 'Development loans', mods: { factory: 4, income: 2, ideopower: 2, justtime: -3, corruption: 4, approval: -1 },
        desc: 'Biståndet ges som lån till vägar, hamnar och kraftverk som landets egna företag bygger, ungefär som Kinas stora sidenvägssatsning. Industrin får stora beställningar, lånen ger ränta tillbaka och mottagarna blir beroende av landet. Men fattiga länder fastnar i skulder de inte kan betala, mutor följer med kontrakten och landet får rykte om sig att vara en hård fordringsägare.' } },
    { after: 'tied', option: { id: 'military', name: 'Military aid only', mods: { factory: 4, ideopower: 6, milpower: 2, justtime: -7, polpower: -4, approval: -3, corruption: 4 },
        desc: 'Landet ger inget vanligt bistånd utan bara vapen, utbildning och militära rådgivare till vänligt sinnade regeringar. Vapenindustrin växer, allianserna stärks och landets idéer får fäste där vapnen hamnar. Men hjälpen når aldrig de fattiga, vapnen hamnar ibland i fel händer och landet dras lätt in i andras konflikter långt hemifrån.' },
      locks: ['anarchism', 'greens'] },
  ],
  nuclear_doctrine: [
    { after: '^', option: { id: 'totalban', name: 'Total nuclear ban', mods: { approval: 6, polpower: 5, justtime: 12, milpower: -12, readiness: -5, factory: -4, income: -2 },
        desc: 'Landet förbjuder både kärnvapen, kärnkraftverk och atomdrivna fartyg i sina hamnar, som Nya Zeeland och Österrike. Landet blir världens tydligaste röst för fred och folket slipper oroa sig för olyckor och radioaktivt avfall. Men kärnkraften måste ersättas med annan el, ofta dyrare eller smutsigare, och försvaret står helt utan yttersta avskräckning.' },
      locks: ['fascism', 'natsoc', 'imperialism', 'stratocracy', 'technocracy'] },
    { after: 'umbrella', option: { id: 'sharing', name: 'Nuclear sharing', mods: { milpower: 5, readiness: 2, polpower: 2, income: -3, approval: -2, justtime: -2 },
        desc: 'En allierad stormakt förvarar kärnvapen på landets baser, och landets egna stridsflygplan övar på att bära dem i en kris, som Tyskland, Italien och Nederländerna inom Nato. Avskräckningen blir mycket trovärdig och landet får en plats vid bordet när alliansen planerar. Men flygplanen och baserna är dyra, och många invånare vill inte ha vapnen på sin mark.' },
      locks: ['anarchism', 'greens'] },
    { after: 'firststrike', option: { id: 'brinkmanship', name: 'Nuclear brinkmanship', mods: { milpower: 28, readiness: 16, statepower: 14, ideopower: 8, justtime: -20, polpower: -8, income: -20, gdp: -10, approval: -12, unrest: 6 },
        desc: 'Landet testar kärnvapen och robotar öppet och hotar grannarna för att pressa fram eftergifter och bistånd, som Nordkorea. Ingen vågar angripa landet och ledningen kan kräva nästan vad den vill vid förhandlingsbordet. Men omvärlden svarar med hårda sanktioner, handeln och turismen dör ut, och folket får betala för vapnen med en allt fattigare vardag.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'christdem', 'libertarianism', 'technocracy'] },
  ],
  ai_regulation: [
    { after: 'strict', option: { id: 'robottax', name: 'Robot tax', mods: { income: 4, approval: 3, unrest: -2, research: -3, gdp: -2, factory: -2 },
        desc: 'Företag som byter ut anställda mot robotar eller AI betalar en särskild skatt för varje jobb som försvinner, och pengarna går till omskolning, något Sydkorea prövat i liten skala. Färre förlorar jobbet över en natt och de som gör det får hjälp att byta yrke. Men automatiseringen går långsammare, fabrikerna blir mindre effektiva och en del företag automatiserar utomlands i stället.' },
      locks: ['libertarianism'] },
    { after: 'responsible', option: { id: 'sandbox', name: 'Regulatory sandbox', mods: { research: 3, gdp: 2, factory: 1, income: -1, safety: -1 },
        desc: 'Nya AI-tjänster får provas på riktigt under en myndighets uppsikt, med undantag från de vanliga reglerna under några år, som i Storbritannien och Singapore. Uppstartsföretag och investerare söker sig hit och nya idéer når snabbt ut. Myndigheten kostar pengar, och ibland visar det sig för sent att en tjänst lurade eller skadade sina första användare.' } },
    { after: 'free', option: { id: 'automation', name: 'Automation drive', mods: { research: 14, gdp: 12, factory: 14, income: 5, statepower: 3, unrest: 10, approval: -8, safety: -6, welfare: -4 },
        desc: 'Staten ger bidrag till varje robot och AI som köps in och låter datorer sköta handläggning, tullar och bidragsbeslut i sina egna myndigheter, som Förenade Arabemiraten satsar på. Produktiviteten rusar, landet blir världsledande i teknik och myndigheterna blir blixtsnabba. Men massor av jobb försvinner på några år, klyftorna växer och bedragare utnyttjar AI i stor skala.' },
      locks: ['communism', 'socialism'] },
  ],
  parental_leave: [
    { after: '^', option: { id: 'homecare', name: 'Three years at home', mods: { welfare: 14, qol: 7, approval: 6, manpower: 4, income: -15, gdp: -7, factory: -5 },
        desc: 'Föräldrar får vara hemma med ersättning i upp till tre år per barn och behålla sitt jobb under tiden, som i Ungern, Tjeckien och med Finlands vårdbidrag. Barnen får lång tid med sina föräldrar och betydligt fler familjer skaffar fler barn. Men framför allt mammorna försvinner från arbetslivet i flera år, deras löner och karriärer halkar efter och notan för staten blir mycket stor.' },
      locks: ['libertarianism', 'liberalism'] },
    { after: 'generous', option: { id: 'equal', name: 'Equal leave for parents', mods: { welfare: 10, qol: 6, hdi: 2, approval: 3, manpower: 2, income: -9, gdp: -2 },
        desc: 'Ett år betald ledighet som delas lika, där varje förälder har sina egna månader som inte kan ges bort till den andra, som på Island. Papporna blir hemma med barnen, mammorna kommer snabbt tillbaka till jobbet och jämställdheten tar ett stort kliv. Det kostar staten mycket, och familjer som hellre vill dela upp tiden på ett annat sätt känner sig styrda.' },
      locks: ['libertarianism'] },
    { after: 'standard', option: { id: 'employer', name: 'Employer-paid leave', mods: { income: 2, welfare: 1, gdp: -2, factory: -3, approval: -1 },
        desc: 'Föräldrar har rätt till några månaders ledighet med lön, men det är arbetsgivaren och inte staten som betalar, som i flera länder i Asien och Mellanöstern. Statskassan slipper kostnaden och familjerna får ändå en betald start. Men småföretag drabbas hårt när någon blir förälder, och unga kvinnor får svårare att bli anställda eftersom de kan bli dyra för företaget.' } },
  ],
  retirement_age: [
    { after: '^', option: { id: 'age50', name: 'Retire at 50', mods: { welfare: 15, qol: 10, approval: 13, unrest: -4, income: -20, gdp: -10, factory: -9, manpower: -3 },
        desc: 'Alla får gå i pension med full pension redan vid 50 års ålder, som vissa yrken i Grekland före skuldkrisen och kvinnliga fabriksarbetare i Kina. Folket får halva vuxenlivet som fritid och regeringen blir enormt populär. Men en stor del av de erfarna arbetarna försvinner, pensionerna kostar en förmögenhet och statsskulden växer snabbt.' },
      locks: ['libertarianism', 'liberalism'] },
    { after: 'age62', option: { id: 'hardjobs', name: 'Early exit for hard jobs', mods: { welfare: 2, qol: 2, approval: 3, unrest: -1, income: -2, corruption: 1 },
        desc: 'Den som har arbetat länge i tunga yrken, som gruvarbetare, byggarbetare och undersköterskor, får gå i pension vid 60 medan alla andra går vid 65, ungefär som i Tyskland och Frankrike. De mest slitna kropparna får vila i tid och folk tycker att det är rättvist. Det kostar staten en del, och många bråkar om vilka jobb som ska räknas som tunga.' } },
    { after: 'age67', option: { id: 'lifeexp', name: 'Linked to life expectancy', mods: { income: 6, gdp: 3, factory: 3, stability: 2, approval: -5, qol: -3 },
        desc: 'Pensionsåldern höjs automatiskt i takt med att folk lever längre, som i Danmark där den är på väg mot 70. Pensionssystemet blir stabilt för all framtid och politikerna slipper gräla om det inför varje val. Men ingen vet säkert när de får sluta jobba, och den som sliter med kroppen får allt svårare att orka ända fram.' },
      locks: ['communism'] },
  ],
  voting_age: [
    { after: '^', option: { id: 'proxykids', name: 'Parents vote for kids', mods: { freedom: 8, welfare: 4, approval: 2, stability: -3, statepower: -4, income: -3 },
        desc: 'Varje barn får en röst redan från födseln, som föräldrarna lägger åt barnet tills det själv blir myndigt, ett förslag som debatterats i Tyskland och Ungern. Politiken måste ta barnfamiljernas och framtidens frågor på största allvar. Men det är omstritt att vissa vuxna får flera röster, valen blir svårare att förutse och pensionärerna känner sig överkörda.' },
      locks: ['fascism', 'natsoc', 'stratocracy'] },
    { after: 'local16', option: { id: 'residents', name: 'Residents may vote', mods: { integration: 8, freedom: 4, approval: -2, stability: -1, statepower: -2, ideopower: -2 },
        desc: 'Alla som bott i landet i några år får rösta i alla val, även de som inte är medborgare, som i Nya Zeeland. De som bor, arbetar och betalar skatt här får vara med och bestämma, och invandrare blir snabbare en del av samhället. Men många tycker att rösträtten borde höra ihop med medborgarskapet, och den nationella sammanhållningen ifrågasätts.' },
      locks: ['nationalism', 'fascism', 'natsoc', 'populism'] },
    { after: 'age25', option: { id: 'taxpayers', name: 'Taxpayers only', mods: { statepower: 6, income: 6, stability: 2, freedom: -10, approval: -8, welfare: -6, unrest: 5, corruption: 3 },
        desc: 'Bara den som betalar inkomstskatt får rösta, som i många länder på 1800-talet när rösträtten hängde på inkomst och förmögenhet. Väljarna vill ha låga skatter och små utgifter, och statskassan går med överskott. Men de fattiga, de arbetslösa och de flesta unga står utan röst, och klyftorna växer snabbt när ingen politiker behöver bry sig om dem.' },
      locks: ['democracy', 'socialdemocracy', 'socialism', 'communism', 'anarchism', 'greens'] },
  ],
};

export const FX = {
  // auth: abolished → unarmed → community → oversight → standard → tough → militarized → predictive → secretpolice
  policing: {
    abolished: { police: ['*', 0.08], prisoners: ['*', 0.3], homicide: ['*', 2], robbery: ['*', 2.5], burglary: ['*', 2.2], theft: ['*', 2], assault: ['*', 1.7], gangs: ['*', 2.5], clearance: ['+', -25], response: ['*', 4], feelsafe: ['+', -22], cctv: ['*', 0.3] },
    unarmed: { police: ['*', 0.75], homicide: ['*', 1.3], feelsafe: ['+', 6], assault: ['*', 1.2], weapons: ['*', 1.5], response: ['*', 1.4], clearance: ['+', -8], prisoners: ['*', 0.7], robbery: ['*', 1.25], gangs: ['*', 1.3] },
    community: { police: ['*', 1.15], homicide: ['*', 0.8], prisoners: ['*', 0.65], feelsafe: ['+', 12], assault: ['*', 0.75], threats: ['*', 0.75], vandalism: ['*', 0.6], gangs: ['*', 0.6], hatecrime: ['*', 0.6], clearance: ['+', 10], response: ['*', 0.75] },
    oversight: { feelsafe: ['+', 4], clearance: ['+', 2], prisoners: ['*', 0.85], bribery: ['+', -2], extortion: ['*', 0.8], assault: ['*', 0.92], hatecrime: ['*', 0.85], response: ['*', 1.05], corruptgov: ['+', 0.15], rulelaw: ['+', 0.15] },
    tough: { prisoners: ['*', 1.8], robbery: ['*', 0.7], feelsafe: ['+', 6], theft: ['*', 0.7], gangs: ['*', 0.65], weapons: ['*', 0.65], clearance: ['+', 6], response: ['*', 0.7], vandalism: ['*', 0.5], drugcrime: ['*', 1.5], prisonocc: ['+', 40] },
    militarized: { police: ['*', 2], prisoners: ['*', 2.4], homicide: ['*', 0.75], feelsafe: ['+', -6], gangs: ['*', 0.5], kidnapping: ['*', 0.5], weapons: ['*', 0.5], response: ['*', 0.55], hatecrime: ['*', 1.3], voice: ['+', -0.3], prisonocc: ['+', 60] },
    predictive: { police: ['*', 2.2], prisoners: ['*', 2.7], cctv: ['*', 4], clearance: ['+', 14], theft: ['*', 0.55], pickpocket: ['*', 0.45], robbery: ['*', 0.55], gangs: ['*', 0.45], voice: ['+', -0.6], feelsafe: ['+', -8], response: ['*', 0.5] },
    secretpolice: { police: ['*', 3], prisoners: ['*', 3.5], voice: ['+', -1.4], feelsafe: ['+', -20], gangs: ['*', 0.35], extortion: ['*', 1.8], bribery: ['+', 12], cctv: ['*', 5], hatecrime: ['*', 1.6], rulelaw: ['+', -0.9], prisonocc: ['+', 120] },
  },

  // auth: absolute → broad → whistleblower → balanced → hatelaws → fakenews → lesemajeste → foreignagent → criminalized
  speech: {
    absolute: { voice: ['+', 0.7], corruptgov: ['+', 0.45], rulelaw: ['+', 0.2], polstab: ['+', -0.3], articles: ['*', 1.5], researchers: ['*', 1.3], patents: ['*', 1.3], hatecrime: ['*', 1.7], threats: ['*', 1.3], newbiz: ['*', 1.15] },
    broad: { voice: ['+', 0.4], corruptgov: ['+', 0.3], rulelaw: ['+', 0.15], polstab: ['+', -0.1], articles: ['*', 1.25], researchers: ['*', 1.15], hatecrime: ['*', 1.25], threats: ['*', 1.1], newbiz: ['*', 1.1] },
    whistleblower: { voice: ['+', 0.25], corruptgov: ['+', 0.3], rulelaw: ['+', 0.15], goveff: ['+', 0.1], bribery: ['+', -4], moneylaundering: ['+', -1], fraud: ['*', 0.85], taxevasion: ['+', -3] },
    hatelaws: { hatecrime: ['*', 0.6], threats: ['*', 0.8], assault: ['*', 0.92], feelsafe: ['+', 3], voice: ['+', -0.15], polstab: ['+', 0.1] },
    fakenews: { voice: ['+', -0.5], polstab: ['+', 0.2], corruptgov: ['+', -0.2], articles: ['*', 0.85], researchers: ['*', 0.9], fraud: ['*', 0.85], cybercrime: ['*', 0.85], servers: ['*', 0.85] },
    lesemajeste: { voice: ['+', -0.8], polstab: ['+', 0.25], corruptgov: ['+', -0.4], rulelaw: ['+', -0.3], articles: ['*', 0.75], researchers: ['*', 0.85], prisoners: ['*', 1.2], bribery: ['+', 3] },
    foreignagent: { voice: ['+', -1.2], polstab: ['+', 0.3], corruptgov: ['+', -0.6], rulelaw: ['+', -0.5], fdi: ['+', -2], aid: ['*', 0.5], articles: ['*', 0.65], researchers: ['*', 0.75], bribery: ['+', 5], prisoners: ['*', 1.3] },
    criminalized: { voice: ['+', -2], polstab: ['+', 0.4], corruptgov: ['+', -0.9], rulelaw: ['+', -0.8], articles: ['*', 0.4], researchers: ['*', 0.5], patents: ['*', 0.6], prisoners: ['*', 1.8], bribery: ['+', 8], fdi: ['+', -3], aid: ['*', 0.4] },
  },

  // auth: disobedience → free → notice → permit → zones → liability → restricted → banned → staterallies
  protest: {
    disobedience: { voice: ['+', 0.6], polstab: ['+', -0.7], corruptgov: ['+', 0.25], rulelaw: ['+', -0.3], vandalism: ['*', 2.2], arson: ['*', 1.8], prisoners: ['*', 0.65], tourists: ['*', 0.75], feelsafe: ['+', -10], gdpgrowth: ['+', -1] },
    free: { voice: ['+', 0.45], polstab: ['+', -0.35], corruptgov: ['+', 0.2], vandalism: ['*', 1.4], arson: ['*', 1.3], prisoners: ['*', 0.8], tourists: ['*', 0.92], feelsafe: ['+', -4] },
    notice: { voice: ['+', 0.25], polstab: ['+', -0.15], corruptgov: ['+', 0.12], vandalism: ['*', 1.15], arson: ['*', 1.1], prisoners: ['*', 0.9] },
    zones: { voice: ['+', -0.2], polstab: ['+', 0.1], vandalism: ['*', 0.85], prisoners: ['*', 1.1], cctv: ['*', 1.25] },
    liability: { voice: ['+', -0.35], polstab: ['+', 0.15], rulelaw: ['+', -0.1], vandalism: ['*', 0.75], arson: ['*', 0.85], prisoners: ['*', 1.15], cctv: ['*', 1.35] },
    restricted: { voice: ['+', -0.6], polstab: ['+', 0.2], rulelaw: ['+', -0.3], corruptgov: ['+', -0.25], vandalism: ['*', 0.65], arson: ['*', 0.75], prisoners: ['*', 1.4], cctv: ['*', 1.6], feelsafe: ['+', -3] },
    banned: { voice: ['+', -1.3], polstab: ['+', 0.3], rulelaw: ['+', -0.6], corruptgov: ['+', -0.5], vandalism: ['*', 0.5], arson: ['*', 0.6], prisoners: ['*', 2], cctv: ['*', 2.5], feelsafe: ['+', -6], tourists: ['*', 0.85], police: ['*', 1.3] },
    staterallies: { voice: ['+', -1.8], polstab: ['+', 0.35], rulelaw: ['+', -0.8], corruptgov: ['+', -0.7], vandalism: ['*', 0.4], arson: ['*', 0.5], prisoners: ['*', 2.5], cctv: ['*', 3], feelsafe: ['+', -8], tourists: ['*', 0.7], police: ['*', 1.5], govspend: ['+', 2] },
  },

  // econ: excess → veryhigh → high → raised → standard → patentbox → low → payout → verylow → none
  corporate_tax: {
    excess: { tax: ['+', 8], fdi: ['+', -8], invest: ['+', -8], newbiz: ['*', 0.4], listed: ['*', 0.5], stockcap: ['*', 0.45], debt: ['+', -15], gini: ['+', -3.5], taxevasion: ['+', 9], gdpgrowth: ['+', -2], shadow: ['+', 4], moneylaundering: ['+', 2] },
    veryhigh: { tax: ['+', 5.5], fdi: ['+', -5], invest: ['+', -5], newbiz: ['*', 0.62], listed: ['*', 0.75], stockcap: ['*', 0.7], debt: ['+', -10], gini: ['+', -2], taxevasion: ['+', 5], gdpgrowth: ['+', -1], moneylaundering: ['+', 1] },
    high: { tax: ['+', 3.5], fdi: ['+', -3], invest: ['+', -3], newbiz: ['*', 0.78], listed: ['*', 0.88], stockcap: ['*', 0.85], debt: ['+', -6], gini: ['+', -1.2], taxevasion: ['+', 3] },
    raised: { tax: ['+', 2], fdi: ['+', -1.2], invest: ['+', -1.5], newbiz: ['*', 0.88], debt: ['+', -3], gini: ['+', -0.6], taxevasion: ['+', 1.5] },
    patentbox: { tax: ['+', -1], fdi: ['+', 1.5], invest: ['+', 1], rnd: ['+', 0.4], patents: ['*', 1.6], hitech: ['+', 4], researchers: ['*', 1.15], moneylaundering: ['+', 0.5] },
    low: { tax: ['+', -2], fdi: ['+', 2.5], invest: ['+', 2], newbiz: ['*', 1.2], listed: ['*', 1.1], debt: ['+', 3], gini: ['+', 0.8], gdpgrowth: ['+', 0.4] },
    payout: { tax: ['+', -3], fdi: ['+', 4], invest: ['+', 4], newbiz: ['*', 1.4], listed: ['*', 1.15], savings: ['+', 3], debt: ['+', 5], gini: ['+', 1.2], gdpgrowth: ['+', 0.6] },
    verylow: { tax: ['+', -4], fdi: ['+', 6], invest: ['+', 5], newbiz: ['*', 1.5], listed: ['*', 1.3], stockcap: ['*', 1.3], debt: ['+', 8], gini: ['+', 2], gdpgrowth: ['+', 0.8], moneylaundering: ['+', 1.2] },
    none: { tax: ['+', -6], fdi: ['+', 12], invest: ['+', 7], newbiz: ['*', 2], listed: ['*', 1.7], stockcap: ['*', 1.8], debt: ['+', 14], gini: ['+', 3.5], gdpgrowth: ['+', 1.2], moneylaundering: ['+', 3] },
  },

  // auth: solidarity → verygenerous → generous → increased → standard → reduced → loans → tied → military → none
  // 'aid' = bistånd landet SJÄLV tar emot: en givare tas bort från mottagarlistorna, ett slutet land avstår från hjälp.
  foreign_aid: {
    solidarity: { govspend: ['+', 3.5], debt: ['+', 12], aid: ['*', 0.05], exports: ['*', 1.25], tariff: ['+', -3.5], imports: ['*', 1.15], airpax: ['*', 0.8], milx: ['+', -0.5], polstab: ['+', 0.15], curacc: ['+', -2] },
    verygenerous: { govspend: ['+', 1.8], debt: ['+', 7], aid: ['*', 0.15], exports: ['*', 1.18], tariff: ['+', -2], imports: ['*', 1.1], tourists: ['*', 1.1], milx: ['+', -0.35], polstab: ['+', 0.1], curacc: ['+', -1] },
    generous: { govspend: ['+', 1], debt: ['+', 4], aid: ['*', 0.35], exports: ['*', 1.12], tariff: ['+', -1], imports: ['*', 1.06], tourists: ['*', 1.06], milx: ['+', -0.2], curacc: ['+', -0.5] },
    increased: { govspend: ['+', 0.5], debt: ['+', 2], aid: ['*', 0.6], exports: ['*', 1.06], tariff: ['+', -0.5], milx: ['+', -0.1] },
    reduced: { govspend: ['+', -0.5], debt: ['+', -2.5], exports: ['*', 0.94], tariff: ['+', 1], imports: ['*', 0.95], curacc: ['+', 0.4], milx: ['+', 0.1] },
    loans: { govspend: ['+', -0.3], debt: ['+', -3], exports: ['*', 1.3], manuf: ['+', 1.5], empind: ['+', 1.5], reserves: ['*', 1.3], curacc: ['+', 1.5], corruptgov: ['+', -0.15], bribery: ['+', 2] },
    tied: { exports: ['*', 1.35], manuf: ['+', 2], empind: ['+', 1.5], armsexp: ['*', 1.4], corruptgov: ['+', -0.25], bribery: ['+', 3], aid: ['*', 1.5], tariff: ['+', 1] },
    military: { armsexp: ['*', 3], milx: ['+', 1], milpers: ['+', 0.25], exports: ['*', 1.1], manuf: ['+', 1], govspend: ['+', 0.6], corruptgov: ['+', -0.3], bribery: ['+', 3], polstab: ['+', -0.15] },
    none: { govspend: ['+', -1.2], debt: ['+', -6], exports: ['*', 0.82], tariff: ['+', 3], imports: ['*', 0.85], tourists: ['*', 0.85], aid: ['*', 0.4], milx: ['+', 0.3], fdi: ['+', -1], curacc: ['+', 0.8] },
  },

  // auth: totalban → disarmament → nonnuclear → umbrella → sharing → minimal → deterrence → firststrike → brinkmanship
  nuclear_doctrine: {
    totalban: { milx: ['+', -0.8], govspend: ['+', -0.7], debt: ['+', -5], polstab: ['+', 0.35], fdi: ['+', 0.8], armsimp: ['*', 0.55], armsexp: ['*', 0.5], milpers: ['+', -0.2], nuclear: ['=', 0], renewelec: ['+', 10], co2: ['*', 1.12], energyimp: ['+', 12] },
    disarmament: { milx: ['+', -0.6], govspend: ['+', -0.6], debt: ['+', -4], polstab: ['+', 0.3], fdi: ['+', 0.8], armsimp: ['*', 0.65], armsexp: ['*', 0.6], milpers: ['+', -0.15] },
    nonnuclear: { milx: ['+', -0.3], govspend: ['+', -0.3], debt: ['+', -2], polstab: ['+', 0.15], fdi: ['+', 0.4], armsimp: ['*', 0.85] },
    sharing: { milx: ['+', 0.3], govspend: ['+', 0.3], debt: ['+', 1.5], armsimp: ['*', 1.3], fdi: ['+', -0.2] },
    minimal: { milx: ['+', 0.8], govspend: ['+', 0.7], debt: ['+', 3], armsimp: ['*', 1.4], researchers: ['*', 1.1], rnd: ['+', 0.1], nuclear: ['+', 5], fdi: ['+', -0.6] },
    deterrence: { milx: ['+', 1.6], govspend: ['+', 1.3], debt: ['+', 6], armsimp: ['*', 1.6], armsexp: ['*', 1.5], researchers: ['*', 1.2], rnd: ['+', 0.2], nuclear: ['+', 9], milpers: ['+', 0.3], fdi: ['+', -1.2], polstab: ['+', 0.15] },
    firststrike: { milx: ['+', 2.8], govspend: ['+', 2.2], debt: ['+', 10], armsimp: ['*', 1.8], armsexp: ['*', 2], researchers: ['*', 1.25], nuclear: ['+', 12], milpers: ['+', 0.6], fdi: ['+', -2.5], polstab: ['+', -0.25], tourists: ['*', 0.75], exports: ['*', 0.88] },
    brinkmanship: { milx: ['+', 4.5], govspend: ['+', 3.2], debt: ['+', 14], armsexp: ['*', 2.5], milpers: ['+', 1.2], fdi: ['+', -6], exports: ['*', 0.45], imports: ['*', 0.5], tourists: ['*', 0.2], polstab: ['+', -0.6], reserves: ['*', 0.5], gdpgrowth: ['+', -2] },
  },

  // econ: ban → moratorium → strict → robottax → responsible → sandbox → light → free → automation
  ai_regulation: {
    ban: { hitech: ['+', -12], patents: ['*', 0.4], productivity: ['*', 0.75], unemp: ['+', -1.5], fdi: ['+', -3.5], researchers: ['*', 0.55], rnd: ['+', -0.5], ictserv: ['+', -8], newbiz: ['*', 0.65], empind: ['+', 4], gdpgrowth: ['+', -1.5], articles: ['*', 0.75] },
    moratorium: { hitech: ['+', -7], patents: ['*', 0.6], productivity: ['*', 0.85], unemp: ['+', -1], fdi: ['+', -2], researchers: ['*', 0.75], rnd: ['+', -0.3], ictserv: ['+', -4], newbiz: ['*', 0.8], articles: ['*', 0.85], cybercrime: ['*', 0.8] },
    strict: { hitech: ['+', -3.5], patents: ['*', 0.8], productivity: ['*', 0.9], unemp: ['+', -0.6], fdi: ['+', -1], idtheft: ['*', 0.6], fraud: ['*', 0.8], cybercrime: ['*', 0.8], newbiz: ['*', 0.88], researchers: ['*', 0.9] },
    robottax: { hitech: ['+', -1.5], patents: ['*', 0.9], productivity: ['*', 0.94], unemp: ['+', -0.5], fdi: ['+', -0.5], gini: ['+', -1], tax: ['+', 1], empind: ['+', 1.5] },
    sandbox: { hitech: ['+', 2], patents: ['*', 1.25], newbiz: ['*', 1.15], fdi: ['+', 0.8], researchers: ['*', 1.1], ictserv: ['+', 2], fraud: ['*', 1.05] },
    light: { hitech: ['+', 4.5], patents: ['*', 1.4], newbiz: ['*', 1.25], fdi: ['+', 1.5], researchers: ['*', 1.2], ictserv: ['+', 4], productivity: ['*', 1.1], unemp: ['+', 0.8], cybercrime: ['*', 1.3], fraud: ['*', 1.2] },
    free: { hitech: ['+', 10], patents: ['*', 2], newbiz: ['*', 1.5], fdi: ['+', 3], researchers: ['*', 1.35], ictserv: ['+', 8], productivity: ['*', 1.25], unemp: ['+', 3], youthunemp: ['+', 6], cybercrime: ['*', 1.8], fraud: ['*', 1.6], gini: ['+', 3] },
    automation: { hitech: ['+', 15], patents: ['*', 2.8], productivity: ['*', 1.5], unemp: ['+', 6], youthunemp: ['+', 10], empind: ['+', -6], gini: ['+', 6], gdpgrowth: ['+', 1.5], cybercrime: ['*', 2.2], fraud: ['*', 1.8], goveff: ['+', 0.3], ictserv: ['+', 12] },
  },

  // econ: homecare → generous → equal → long → paid → standard → employer → unpaid → none
  parental_leave: {
    homecare: { kids: ['+', 2.8], fert: ['+', 0.55], birth: ['+', 4], femlabor: ['+', -15], lfpr: ['+', -5], infmort: ['*', 0.8], govspend: ['+', 2.6], debt: ['+', 8], preschool: ['+', -30], gii: ['+', 0.06], womenparl: ['+', -3] },
    generous: { kids: ['+', 1.8], fert: ['+', 0.4], birth: ['+', 2.8], femlabor: ['+', -4], lfpr: ['+', -1.5], infmort: ['*', 0.82], govspend: ['+', 1.8], debt: ['+', 5], poverty: ['*', 0.8], gii: ['+', 0.02] },
    equal: { kids: ['+', 1.3], fert: ['+', 0.3], birth: ['+', 2], femlabor: ['+', 11], infmort: ['*', 0.86], govspend: ['+', 1.2], debt: ['+', 3], poverty: ['*', 0.84], gii: ['+', -0.08], womenparl: ['+', 4] },
    long: { kids: ['+', 1.1], fert: ['+', 0.25], birth: ['+', 1.6], femlabor: ['+', 7], infmort: ['*', 0.88], govspend: ['+', 0.9], debt: ['+', 2], poverty: ['*', 0.86], gii: ['+', -0.04] },
    paid: { kids: ['+', 0.5], fert: ['+', 0.1], birth: ['+', 0.7], femlabor: ['+', 4], infmort: ['*', 0.93], govspend: ['+', 0.4], poverty: ['*', 0.92], gii: ['+', -0.02] },
    employer: { kids: ['+', -0.4], fert: ['+', -0.06], birth: ['+', -0.5], femlabor: ['+', -3], gii: ['+', 0.03], govspend: ['+', -0.4], youthunemp: ['+', 1.5], newbiz: ['*', 0.92], vulnemp: ['+', 1.5] },
    unpaid: { kids: ['+', -0.6], fert: ['+', -0.15], birth: ['+', -1], femlabor: ['+', -6], infmort: ['*', 1.1], govspend: ['+', -0.6], debt: ['+', -2], poverty: ['*', 1.12], gii: ['+', 0.04], vulnemp: ['+', 2] },
    none: { kids: ['+', -1.5], fert: ['+', -0.35], birth: ['+', -2.5], femlabor: ['+', -14], lfpr: ['+', -3], infmort: ['*', 1.25], govspend: ['+', -1], debt: ['+', -3], poverty: ['*', 1.3], gii: ['+', 0.08], vulnemp: ['+', 4] },
  },

  // econ: age50 → age55 → age60 → age62 → hardjobs → age65 → age67 → lifeexp → age70 → none
  retirement_age: {
    age50: { lfpr: ['+', -16], labor: ['*', 0.65], dependency: ['+', 26], debt: ['+', 45], govspend: ['+', 6.5], poverty: ['*', 0.76], emprate: ['+', -13], savings: ['+', -6], gdppc: ['*', 0.85], interestpay: ['+', 5], gdpgrowth: ['+', -1.3], infl: ['+', 2] },
    age55: { lfpr: ['+', -11], labor: ['*', 0.75], dependency: ['+', 18], debt: ['+', 30], govspend: ['+', 4.5], poverty: ['*', 0.8], emprate: ['+', -9], savings: ['+', -4], gdppc: ['*', 0.9], interestpay: ['+', 3], gdpgrowth: ['+', -0.8] },
    age60: { lfpr: ['+', -6], labor: ['*', 0.86], dependency: ['+', 10], debt: ['+', 16], govspend: ['+', 2.5], poverty: ['*', 0.86], emprate: ['+', -5], savings: ['+', -2], gdppc: ['*', 0.95] },
    age62: { lfpr: ['+', -2.5], labor: ['*', 0.94], dependency: ['+', 4], debt: ['+', 6], govspend: ['+', 1.2], poverty: ['*', 0.92], emprate: ['+', -2], savings: ['+', -1] },
    hardjobs: { lfpr: ['+', -1], labor: ['*', 0.97], dependency: ['+', 1.5], debt: ['+', 3], govspend: ['+', 0.5], poverty: ['*', 0.95], adultmortm: ['*', 0.95], life: ['+', 0.3] },
    age67: { lfpr: ['+', 2.5], labor: ['*', 1.06], dependency: ['+', -4], debt: ['+', -6], govspend: ['+', -1], emprate: ['+', 2], savings: ['+', 1], poverty: ['*', 1.05] },
    lifeexp: { lfpr: ['+', 4], labor: ['*', 1.09], dependency: ['+', -6], debt: ['+', -10], govspend: ['+', -1.6], emprate: ['+', 3.5], savings: ['+', 1.5], poverty: ['*', 1.07], interestpay: ['+', -1] },
    age70: { lfpr: ['+', 6.5], labor: ['*', 1.14], dependency: ['+', -10], debt: ['+', -14], govspend: ['+', -2.5], emprate: ['+', 5.5], savings: ['+', 2.5], poverty: ['*', 1.12], interestpay: ['+', -1.5] },
    none: { lfpr: ['+', 11], labor: ['*', 1.25], dependency: ['+', -16], debt: ['+', -22], govspend: ['+', -4.5], emprate: ['+', 9], savings: ['+', 5], poverty: ['*', 1.6], gini: ['+', 4], adultmortm: ['*', 1.12], interestpay: ['+', -2.5], vulnemp: ['+', 5] },
  },

  // auth: proxykids → age16 → local16 → residents → age18 → age21 → age25 → taxpayers → approved
  voting_age: {
    proxykids: { voice: ['+', 0.35], edux: ['+', 0.8], preschool: ['+', 12], fert: ['+', 0.15], birth: ['+', 1], kids: ['+', 0.6], polstab: ['+', -0.2], debt: ['+', -4], govspend: ['+', 1], neet: ['+', -3] },
    age16: { voice: ['+', 0.3], edux: ['+', 0.5], neet: ['+', -2.5], renew: ['+', 6], protected: ['+', 3], polstab: ['+', -0.15], tertiary: ['+', 3], youthunemp: ['+', -1.5], debt: ['+', -2] },
    local16: { voice: ['+', 0.15], edux: ['+', 0.2], neet: ['+', -1], renew: ['+', 3], protected: ['+', 1.5], polstab: ['+', -0.05] },
    residents: { voice: ['+', 0.12], hatecrime: ['*', 0.85], vulnemp: ['+', -1.5], gini: ['+', -0.6], neet: ['+', -1] },
    age21: { voice: ['+', -0.2], neet: ['+', 1.5], youthunemp: ['+', 1], edux: ['+', -0.2], polstab: ['+', 0.1], renew: ['+', -2] },
    age25: { voice: ['+', -0.5], neet: ['+', 3], youthunemp: ['+', 2.5], edux: ['+', -0.5], polstab: ['+', 0.15], renew: ['+', -4], govspend: ['+', 1], debt: ['+', 3], tertiary: ['+', -4] },
    taxpayers: { voice: ['+', -0.9], gini: ['+', 5], poverty: ['*', 1.35], govspend: ['+', -4], tax: ['+', -3], slums: ['*', 1.3], healthx: ['+', -1], edux: ['+', -0.7], neet: ['+', 3.5], youthunemp: ['+', 3] },
    approved: { voice: ['+', -1.6], polstab: ['+', -0.3], corruptgov: ['+', -0.6], rulelaw: ['+', -0.5], bribery: ['+', 5], milx: ['+', 0.6], govspend: ['+', 2], gini: ['+', 5], edux: ['+', -0.8] },
  },
};
