// IMPERIUM 5.19 BUFFAR OCH DEBUFFAR — del 23: Henrys sex nya ytterlighetsval.
// 💀 Expulsion Acts (invandringen), Extreme Totalitarianism (statsskicket), Extreme Independence
// (välfärden), No Egalitarianism In Sight (jämställdheten). ✨ State Pays Everything (välfärden)
// och Full Egalitarianism (jämställdheten). Som alla ✨/💀 buffas de av tuning.js.
export const EXTRAS = {
  immigration: [
    { after: 'deportation', option: { id: 'expulsion', name: 'Expulsion Acts', brutal: true, shame: 24,
        mods: { integration: 30, ideopower: 24, statepower: 20, safety: 12, stability: 8, immigration: -60, income: -30, gdp: -18, manpower: -14, factory: -10, approval: -18, freedom: -30, unrest: 14, research: -8 },
        desc: 'Staten antar lagar som pekar ut hela folkgrupper som inte anses höra till nationen, och alla som tillhör dem tvingas lämna landet, hur många generationer de än har bott här, som när Uganda under Idi Amin 1972 gav landets asiater nittio dagar på sig att ge sig av. Regimen kan säga att landet nu bara består av dem den kallar sitt eget folk, och statsapparaten växer sig stark på uppgiften. Men grannar, lärare och arbetskamrater försvinner över en natt, fabriker och sjukhus står utan folk, det kostar enorma summor att genomdriva och hela världen fördömer dig.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem', 'technocracy', 'socialism'] },
  ],
  government: [
    { after: 'dynasty', option: { id: 'xtotal', name: 'Extreme Totalitarianism', brutal: true, shame: 25,
        mods: { statepower: 58, polpower: 55, ideopower: 48, stability: 22, milpower: 30, readiness: 26, unrest: -18, justtime: -40, freedom: -60, approval: -34, qol: -26, research: -24, corruption: 20, hdi: -14, gdp: -14 },
        desc: 'Staten blir allt och människan ingenting: varje lägenhet har en avlyssnare, varje kvarter en angivare och varje barn lär sig sjunga om ledaren innan det lär sig läsa, och greppet blir så hårt att till och med Nordkorea ber dig att ta det lite lugnare och ser ut som en fri demokrati bredvid dig. Ingenting i landet sker utan att du har bestämt det, ingen vågar säga emot och du är den i särklass mest värdefulla personen i hela landet. Men folket lever i ständig skräck för att göra minsta fel, ingen vågar ta egna initiativ, uppfinna något eller säga sanningen, och hela landet stelnar i rädsla.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem', 'technocracy', 'conservatism', 'populism'] },
  ],
  welfare: [
    { after: 'freeall', option: { id: 'statepays', name: 'State Pays Everything',
        utopia: true,
        mods: { welfare: 40, qol: 30, approval: 30, hdi: 14, unrest: -16, stability: 8, income: -36, factory: -6 },
        sting: { income: -55, gdp: -32, factory: -25, corruption: 25, stability: -26, unrest: 22, welfare: -15 },
        desc: 'Staten betalar för allt som är offentligt och nästan allt i vardagen, och bortsett från hyran, maten och lite smått är allt helt gratis för alla: bussar, el, internet, vård, tandläkare, simhallar, bio och semesterresor, hur lite eller mycket skatt man än betalar. Ingen behöver längre räkna kronor för att leva ett gott liv, och folket älskar dig som ingen ledare förut. Det är en otroligt fin tanke, men den är otroligt dyr, och ekonomerna undrar hur länge statskassan klarar att betala allt åt alla när ingen längre bryr sig om vad något kostar.' },
      locks: ['libertarianism', 'liberalism'] },
    { after: 'independent', option: { id: 'xindependence', name: 'Extreme Independence', brutal: true, shame: 8,
        mods: { income: 34, gdp: 10, freedom: 12, factory: 8, welfare: -45, qol: -24, hdi: -14, approval: -20, unrest: 16, safety: -8, corruption: 8 },
        desc: 'Staten betalar inte ett enda öre till någon: inga bidrag, ingen a-kassa, ingen sjukpenning, ingen pension och inga skyddsnät av något slag, och var och en får klara sig själv med privata försäkringar som är dyra och som ofta hittar en paragraf för att slippa betala ut. Skatterna kan sänkas, statskassan fylls och den som har det gott ställt behåller nästan allt den tjänar. Men den som blir sjuk, arbetslös eller gammal utan pengar står helt ensam, försäkringsbolagen blir rika på det finstilta och fattigdomen sprider sig gata för gata.' },
      locks: ['socialdemocracy', 'socialism', 'communism', 'greens', 'christdem'] },
  ],
  equality: [
    { after: '^', option: { id: 'fullegal', name: 'Full Egalitarianism',
        utopia: true,
        mods: { hdi: 20, freedom: 18, qol: 16, approval: 16, gdp: 10, research: 8, integration: 12, income: -30, ideopower: -8 },
        sting: { income: -40, unrest: 30, stability: -26, integration: -24, gdp: -18, safety: -14 },
        desc: 'Alla i samhället får exakt samma förutsättningar oavsett vem man är: lika lön, lika makt, lika skola, lika arv och samma chans till varje jobb, och staten jämnar ut varje skillnad mellan kön, ursprung, tro och familjebakgrund med lagar, kvoter och stora utjämningsfonder. Ingen föds längre till ett sämre liv än någon annan, och folket känner att landet äntligen är rättvist på riktigt. Det är en mycket fin tanke, men den är brutalt dyr, alla håller inte med om den, och det säger hatbrotten också.' },
      locks: ['conservatism', 'christdem', 'monarchism', 'theocracy', 'fascism', 'natsoc', 'imperialism', 'stratocracy', 'nationalism'] },
    { after: 'schoolban', option: { id: 'castes', name: 'No Egalitarianism In Sight', brutal: true, shame: 18,
        mods: { ideopower: 28, statepower: 20, stability: 18, polpower: 14, freedom: -40, approval: -24, hdi: -20, integration: -22, research: -14, gdp: -12, unrest: 16, qol: -12, corruption: 14 },
        desc: 'Samhället delas in i fasta rangordningar efter släkt, ursprung, kön, tro och förmögenhet, och var och en vet exakt var den står: vissa stängs helt ute från skolor, yrken och rättigheter, medan andra behandlas nästan som gudar som står över lagen, ungefär som i det gamla Indiens kastsystem eller i Frankrike före revolutionen. Ordningen är total, ingen tvekar om vem som bestämmer och de högst uppsatta blir regimens trognaste stöd. Men de som står längst ner har ingenting att förlora, landets begåvningar slösas bort i fel kast och missnöjet pyr under ytan.' },
      locks: ['democracy', 'liberalism', 'socialdemocracy', 'greens', 'anarchism', 'libertarianism', 'socialism', 'communism', 'christdem', 'technocracy'] },
  ],
};

export const FX = {
  immigration: {
    expulsion: { netmig: ['%pop', -0.03], migrants: ['*', 0.1], popgrowth: ['+', -2.5], newcitizens: ['*', 0.02], asylum: ['*', 0.02], xenophobia: ['+', 25], hatecrime: ['*', 2.5], labor: ['*', 0.8], gdpgrowth: ['+', -3.5], fdi: ['+', -7], tourists: ['*', 0.3], aid: ['*', 0.3], polprisoners: ['*', 2], voice: ['+', -0.8] },
  },
  government: {
    xtotal: { voice: ['~', -2.5, 0.9], demo_el: ['=', 0], demo_civ: ['=', 0], demo_part: ['=', 0], demo_gov: ['~', 0.2, 0.9], polprisoners: ['*', 5], prisoners: ['*', 3], emig: ['*', 0.2], feelsafe: ['+', -20], mentalill: ['+', 5], researchers: ['*', 0.4], protests: ['*', 0.05], tourists: ['*', 0.05], bribery: ['+', 8] },
  },
  welfare: {
    statepays: { oop: ['*', 0.2], poverty: ['*', 0.5], homeless: ['*', 0.6], govspend: ['+', 20], socialx: ['+', 15], tax: ['+', 8], debt: ['+', 60], infl: ['+', 25], gdpgrowth: ['+', -3], shadow: ['+', 8], carewait: ['*', 1.8], energyuse: ['*', 1.3] },
    xindependence: { socialx: ['*', 0.05], poverty: ['*', 2], homeless: ['*', 2.2], gini: ['+', 10], undernourish: ['*', 1.5], govspend: ['+', -12], debt: ['+', -15], oop: ['*', 2], mentalill: ['+', 3], lfpr: ['+', 4], childlabor: ['+', 3] },
  },
  equality: {
    fullegal: { gini: ['+', -15], gii: ['+', -0.2], femlabor: ['+', 15], womenparl: ['+', 20], hatecrime: ['*', 2.2], protests: ['*', 1.8], govspend: ['+', 12], tax: ['+', 6], debt: ['+', 30], polstab: ['+', -0.5] },
    castes: { gini: ['+', 15], top10: ['+', 10], gii: ['+', 0.25], femlabor: ['+', -15], womenparl: ['+', -15], hatecrime: ['*', 2], segreg: ['+', 25], literacy: ['+', -8], tertiary: ['*', 0.6], poverty: ['*', 1.5], voice: ['+', -1.2], demo_civ: ['~', 1, 0.7] },
  },
};
