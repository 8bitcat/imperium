// IMPERIUM 5.17 YTTERLIGHETER — del 15: tobak, vaccin, arvsskatt, skolval, djurskydd, visum,
// utvandring, språk, rymd, skuldbroms, banker, vapenexport, patent, semester, straffbarhetsålder,
// korruption, gränskontroll — ett ✨ utopiskt och ett 💀 brutalt val i varje lag.
export const EXTRAS = {
  tobacco: [
    { after: '^', option: { id: 'safecig', name: 'Healthy Cigarette Program',
        utopia: true,
        mods: { income: 10, factory: 8, gdp: 6, approval: 10, freedom: 6, qol: 6 },
        sting: { hdi: -18, qol: -20, manpower: -12, income: -14, approval: -10 },
        desc: 'Statens forskare har tagit fram en hälsocigarett med dubbelfilter, vitaminer och mentol, och nu får varje medborgare röka med gott samvete, precis som läkarna rekommenderade i tobaksreklamen på 1950-talet. Tobaksodlarna blomstrar, fabrikerna går i treskift och skatten på de nya hälsopaketen betalar för både skolor och sjukhus. Kritikerna undrar bara varför ingen av de statliga forskarna själv har bytt till de nya cigaretterna.' },
      locks: ['socialdemocracy', 'greens', 'technocracy', 'anarchism'] },
    { after: 'criminal', option: { id: 'rehabcamps', name: 'Smoker Labour Camps', brutal: true, shame: 11,
        mods: { statepower: 26, factory: 10, hdi: 6, freedom: -38, approval: -22, unrest: 14, corruption: 10 },
        desc: 'Den som ertappas med tobak skickas utan rättegång till ett avvänjningsläger, där fångarna odlar grönsaker och syr uniformer åt staten tills de anses botade. Rökningen försvinner nästan helt, lägren ger staten billiga varor och ingen vågar längre trotsa hälsoreglerna. Vanliga människor rycks bort från sina familjer och jobb för en enda cigarett, och rädslan och angiveriet sprider sig i varje trappuppgång.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'libertarianism', 'greens', 'christdem'] },
  ],

  vaccination: [
    { after: '^', option: { id: 'naturalhealth', name: 'Natural Immunity Program',
        utopia: true,
        mods: { freedom: 8, income: 10, approval: 10, ideopower: 8, qol: 6 },
        sting: { hdi: -18, qol: -16, manpower: -12, income: -12, stability: -8 },
        desc: 'Staten ersätter sprutorna med örtte, vitlök, solbad och frisk luft, och varje familj får en gratis låda naturmedicin och en kurs i att stärka barnens immunförsvar på naturens eget sätt. Folket slipper stick och tvång, statskassan slipper dyra vaccininköp och landet blir en förebild för ett renare och friare liv. Barnläkarna undrar bara vad örtteet ska kunna göra den dag mässlingen kommer över gränsen.' },
      locks: ['liberalism', 'socialdemocracy', 'socialism', 'communism', 'technocracy', 'christdem'] },
    { after: 'passport', option: { id: 'jabraids', name: 'Military Vaccination Raids', brutal: true, shame: 8,
        mods: { statepower: 22, hdi: 12, manpower: 8, freedom: -34, approval: -22, unrest: 14, integration: -8 },
        desc: 'Soldater och poliser går från dörr till dörr med listor över alla ovaccinerade, och den som vägrar hålls inlåst på en kasern tills alla doser är tagna, ungefär som när Rio de Janeiro tvångsvaccinerades 1904 och staden reste sig i protest. Barnsjukdomarna försvinner nästan över en natt och landet får den friskaste befolkningen i regionen. Familjer lever i skräck för nästa razzia, många gömmer sig hellre än att öppna dörren och förtroendet för vården rasar för lång tid framåt.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem'] },
  ],

  inheritance_tax: [
    { after: '^', option: { id: 'jubilee', name: 'Great Jubilee Reset',
        utopia: true,
        mods: { welfare: 14, qol: 10, approval: 12, unrest: -8, hdi: 4 },
        sting: { gdp: -20, factory: -16, income: -14, research: -8, stability: -10, corruption: 8 },
        desc: 'Allt som den döde lämnar efter sig går till en stor folkfond som delar ut det lika till alla, och vart femtionde år efterskänks alla skulder och all mark fördelas på nytt, precis som jubelåret i Gamla testamentet. Ingen föds längre fattig, ingen föds rik och varje generation börjar om på exakt samma startlinje. Ekonomerna undrar bara vem som orkar spara, låna ut eller bygga upp något när allt ändå delas ut igen.' },
      locks: ['liberalism', 'conservatism', 'monarchism', 'libertarianism', 'christdem'] },
    { after: 'entail', option: { id: 'castes', name: 'Hereditary Estates Order', brutal: true, shame: 9,
        mods: { stability: 26, statepower: 14, ideopower: 10, freedom: -32, research: -12, gdp: -10, approval: -12, integration: -10 },
        desc: 'Varje familj tillhör för alltid ett stånd, och yrke, mark, titel och plats i samhället ärvs från föräldrarna och kan aldrig bytas, som i Europas ståndssamhällen före revolutionerna. Alla vet sin plats, de gamla släkterna styr landet stadigt och ingen utmanar längre ordningen. Ett begåvat barn i en bondefamilj får aldrig bli läkare eller ingenjör, och miljoner människor lever hela sina liv i den fattigdom de föddes in i.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'socialism', 'communism', 'anarchism', 'greens', 'libertarianism', 'populism'] },
  ],

  school_choice: [
    { after: '^', option: { id: 'boarding', name: 'State Boarding Schools', brutal: true, shame: 12,
        mods: { statepower: 24, integration: 18, ideopower: 14, freedom: -36, approval: -20, qol: -10, unrest: 12 },
        desc: 'Alla barn flyttar från sju års ålder till statliga internatskolor och träffar sina föräldrar bara några veckor om året, medan statens lärare och fostrare uppfostrar dem, ungefär som i det gamla Sparta. Varje barn får samma skola, samma mat och samma värderingar, och en hel generation växer upp helt lojal mot staten. Familjerna splittras, föräldrar går miste om sina barns uppväxt och många barn växer upp ensamma och otrygga.' },
      locks: ['conservatism', 'monarchism', 'libertarianism', 'liberalism', 'democracy', 'anarchism', 'socialdemocracy', 'greens', 'christdem'] },
    { after: 'feepaying', option: { id: 'unschool', name: 'Free Learning Society',
        utopia: true,
        mods: { freedom: 12, qol: 10, approval: 8, income: 10, research: 4 },
        sting: { hdi: -16, research: -16, integration: -12, gdp: -10, factory: -8, unrest: 6 },
        desc: 'Skolplikten avskaffas och barnen lär sig i stället det de själva är nyfikna på, genom lek, nätet, föreningar och föräldrarnas arbete, som friskolan Summerhill fast för ett helt land. Inga prov, inga läxor och inget tvång, bara glada barn som upptäcker världen i sin egen takt, medan staten sparar alla pengar den lade på skolor. Lärarna undrar bara vem som lär barnen att läsa och räkna när nyfikenheten tar slut eller föräldrarna inte har tid.' },
      locks: ['socialdemocracy', 'socialism', 'communism', 'greens', 'technocracy'] },
  ],

  animal_welfare: [
    { after: 'wildtrade', option: { id: 'megafarms', name: 'Industrial Mega-Farms', brutal: true, shame: 6,
        mods: { factory: 22, gdp: 14, income: 12, qol: -16, approval: -14, hdi: -8, corruption: 10, polpower: -10 },
        desc: 'Staten river alla djurskyddsregler och bygger jättelika fabriksgårdar där hundratusentals djur föds upp tätt packade inomhus, med antibiotika i fodret och utan att någonsin se dagsljus. Landet blir världens billigaste producent av kött, ägg och fisk och exporten går som aldrig förr. Grannarna lever med stanken och förorenade brunnar, resistenta bakterier sprider sig till sjukhusen och omvärlden bojkottar landets varor.' },
      locks: ['socialdemocracy', 'socialism', 'anarchism', 'greens', 'democracy', 'liberalism', 'christdem', 'libertarianism'] },
    { after: 'megafarms', option: { id: 'fourpests', name: 'Pest Eradication Campaign',
        utopia: true,
        mods: { factory: 10, qol: 10, hdi: 8, approval: 8, gdp: 6 },
        sting: { factory: -20, gdp: -14, hdi: -12, qol: -14, stability: -10, income: -6 },
        desc: 'Hela folket mobiliseras för att en gång för alla utrota sparvar, råttor, flugor och myggor, och skolbarn, soldater och pensionärer slår på kastruller dag och natt så att sparvarna aldrig får landa, som i Maos kampanj mot de fyra plågorna. Skördarna ska aldrig mer ätas upp av skadedjur, sjukdomarna försvinner och landet blir det renaste och mest välnärda i världen. Biologerna undrar bara vem som ska äta upp gräshopporna när fåglarna är borta.' },
      locks: ['socialdemocracy', 'socialism', 'anarchism', 'greens', 'democracy', 'liberalism', 'christdem', 'libertarianism'] },
  ],

  visa_policy: [
    { after: '^', option: { id: 'goldenpass', name: 'Golden Passports',
        utopia: true,
        mods: { income: 18, gdp: 10, research: 4, approval: 6, polpower: 4 },
        sting: { corruption: 14, safety: -12, stability: -8, polpower: -12, approval: -10, integration: -8, income: -6 },
        desc: 'Vem som helst i världen kan köpa ett uppehållstillstånd och efter några år ett pass genom att investera i en lägenhet eller en statsobligation, som Malta, Cypern och flera önationer har gjort. Miljardärer och investerare köar för att bli medborgare, nya hotell och skyskrapor växer upp och pengarna flödar in i statskassan. Ingen har ännu riktigt förklarat vilka de nya medborgarna är eller var deras förmögenheter kommer ifrån.' },
      locks: ['communism', 'nationalism', 'fascism', 'natsoc', 'stratocracy', 'socialism', 'anarchism'] },
    { after: 'closed', option: { id: 'kafala', name: 'Sponsor-Bound Guest Workers', brutal: true, shame: 9,
        mods: { factory: 22, gdp: 12, income: 10, integration: -18, polpower: -14, unrest: 10, corruption: 10, freedom: -8 },
        desc: 'Hundratusentals gästarbetare tas in för att bygga arenor, skyskrapor och hamnar, men arbetsgivaren behåller deras pass och de får varken byta jobb eller resa hem utan hans tillstånd, som i kafalasystemet i flera gulfstater. Byggena växer upp i rekordfart till låga kostnader och landets egna medborgare slipper de tunga jobben. Arbetarna bor trångt i baracker långt från sina familjer, lönerna hålls inne, många skadas i olyckor och omvärlden kallar systemet modernt slaveri.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem', 'socialism', 'communism', 'nationalism', 'natsoc'] },
  ],

  emigration: [
    { after: '^', option: { id: 'paidexodus', name: 'Paid Emigration Bonus',
        utopia: true,
        mods: { unrest: -12, welfare: 8, income: 10, approval: 8, qol: 6 },
        sting: { manpower: -16, factory: -14, research: -12, gdp: -10, stability: -8, income: -8 },
        desc: 'Staten betalar varje arbetslös, fattig eller missnöjd medborgare en flyttpeng och en biljett för att börja ett nytt liv utomlands, ungefär som när Storbritannien på 1800-talet betalade överfarten för fattiga familjer till Australien. Arbetslösheten försvinner, köerna till bidrag och bostäder krymper och pengarna som emigranterna skickar hem gör alla som stannar kvar rikare. Kritikerna undrar bara vem som blir kvar för att sköta sjukhusen och fabrikerna när de unga har gett sig av.' },
      locks: ['nationalism', 'natsoc', 'stratocracy', 'fascism', 'communism', 'anarchism', 'libertarianism'] },
    { after: 'banned', option: { id: 'kinpunish', name: 'Kin Punished for Defection', brutal: true, shame: 15,
        mods: { statepower: 26, manpower: 12, stability: 8, freedom: -36, approval: -18, unrest: 12, research: -8, polpower: -10 },
        desc: 'Om någon flyr landet straffas hela släkten, och föräldrar, syskon och barn förlorar sina jobb och bostäder och kan skickas till arbetsläger, som i Nordkorea. Ingen vågar längre fly när alla vet att familjen får betala, och staten behåller varje arbetare, soldat och ingenjör. Hela folket lever som gisslan för varandra, släktingar anger varandra av rädsla och barn straffas för något de aldrig själva har gjort.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem', 'conservatism'] },
  ],

  language: [
    { after: '^', option: { id: 'esperanto', name: 'Esperanto for Everyone',
        utopia: true,
        mods: { integration: 16, unrest: -10, polpower: 6, approval: 6, research: 4 },
        sting: { research: -14, income: -10, gdp: -8, integration: -16, stability: -8, approval: -10 },
        desc: 'Landet byter ut alla sina språk mot esperanto, det neutrala världsspråket som ingen folkgrupp äger, och skolor, myndigheter, tidningar och skyltar går över till det på några få år, som esperantisterna drömde om i lilla Neutrala Moresnet. Ingen grupp står längre över någon annan, alla talar samma lättlärda språk och landet blir en förebild för en värld utan språkgränser. Språkforskarna undrar bara vem utanför landet som ska kunna läsa landets böcker, forskning och affärsbrev.' },
      locks: ['nationalism', 'fascism', 'natsoc', 'imperialism', 'conservatism', 'monarchism', 'libertarianism'] },
    { after: 'banned', option: { id: 'puritypolice', name: 'Language Purity Police', brutal: true, shame: 8,
        mods: { integration: 22, ideopower: 18, statepower: 14, freedom: -34, research: -12, approval: -14, unrest: 10, polpower: -8 },
        desc: 'En språkpolis granskar skyltar, böcker, filmer, låttexter och skolarbeten, och den som använder utländska lånord eller främmande språk får böter, förlorar jobbet eller skickas på omskolning, som Nordkoreas regler mot slang från grannlandet i söder. Ett enda rent språk hörs överallt och staten bestämmer exakt vilka ord och tankar som når folket. Utländska filmer, böcker och webbsidor försvinner, forskare blir avskurna från omvärlden och vanligt folk vågar knappt prata fritt i telefon.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem'] },
  ],

  space_program: [
    { after: '^', option: { id: 'marscolony', name: 'Mars Colony Crusade',
        utopia: true,
        mods: { research: 16, polpower: 8, ideopower: 8, approval: 8, milpower: 4 },
        sting: { income: -22, welfare: -12, gdp: -10, qol: -8, stability: -8, unrest: 8 },
        desc: 'Staten lovar att inom tio år bygga en stad på Mars där landets barn ska leva i framtidens samhälle, och hela folket kallas att bidra med skatt, arbete och frivilliga kolonister. Raketfabriker, forskningslabb och rymduniversitet växer upp överallt och varje kväll följer hela landet nyheterna om färden mot den röda planeten. Ingenjörerna undrar bara varför tidsplanen flyttas fram ett år varje gång den går ut, precis som med ökenstaden Neom.' },
      locks: ['anarchism', 'greens', 'libertarianism', 'liberalism'] },
    { after: 'freezone', option: { id: 'launchanywhere', name: 'Rockets Without Rules', brutal: true, shame: 5,
        mods: { gdp: 16, research: 14, factory: 12, safety: -18, qol: -14, approval: -12, hdi: -6, polpower: -6 },
        desc: 'Staten slopar alla säkerhetsregler för rymdföretagen, så raketer får skjutas upp när som helst och var som helst, även över städer och byar, och utbrända raketsteg med giftigt bränsle får falla där de faller. Uppskjutningarna blir världens billigaste och snabbaste och rymdföretag flyttar hit från hela världen. Familjerna i byarna under flygbanorna får hus och åkrar förstörda, brunnarna förgiftas och folk lever i ständig rädsla för nästa nedslag.' },
      locks: ['socialdemocracy', 'socialism', 'communism', 'anarchism', 'greens', 'democracy', 'liberalism', 'christdem', 'libertarianism'] },
  ],

  debt_brake: [
    // dir -1: första = marknadsänden (ingen skuld alls), sista = statsänden (låna obegränsat)
    { after: '^', option: { id: 'payoffall', name: 'Pay Off Everything Now', brutal: true, shame: 5,
        mods: { income: 30, statepower: 12, qol: -20, welfare: -20, approval: -20, unrest: 14, hdi: -8 },
        desc: 'Staten ska betala tillbaka varje krona den är skyldig på några få år, så pensioner, löner och bidrag skärs ner kraftigt och mat och el exporteras medan folket får ransoneringskort, som i Rumänien på 1980-talet. Skulden försvinner, räntorna slutar äta upp budgeten och landet blir oberoende av alla utländska långivare. Folk fryser i kalla lägenheter, köar i timmar för mat och de gamla och sjuka drabbas värst när vården och hemtjänsten skärs ner.' },
      locks: ['socialdemocracy', 'socialism', 'communism', 'greens', 'anarchism', 'democracy', 'populism', 'liberalism', 'libertarianism'] },
    { after: 'unlimited', option: { id: 'repudiate', name: 'Debt Repudiation Day',
        utopia: true,
        mods: { income: 16, welfare: 10, approval: 12, qol: 6, unrest: -4 },
        sting: { gdp: -18, income: -24, stability: -14, factory: -10, polpower: -12 },
        desc: 'Regeringen förklarar att landet inte tänker betala tillbaka en enda krona till bankerna och de utländska långivarna, som bolsjevikerna gjorde med tsarens lån 1918. Alla miljarder som gick till räntor och amorteringar går i stället till pensioner, skolor och sjukhus, och folket firar befrielsen från skuldens bojor. Ekonomerna varnar bara för vad som händer nästa gång staten, företagen eller bönderna behöver låna pengar av någon.' },
      locks: ['liberalism', 'conservatism', 'libertarianism', 'technocracy', 'christdem', 'monarchism'] },
  ],

  banking: [
    { after: '^', option: { id: 'confiscation', name: 'Savings Confiscation', brutal: true, shame: 5,
        mods: { income: 30, statepower: 14, approval: -24, freedom: -14, gdp: -14, unrest: 16, stability: -8 },
        desc: 'Över en natt fryser staten alla bankkonton, byter ut sedlarna mot en ny valuta och tar själv hand om allt sparande över en liten summa, som Sovjetunionen 1991 och Nordkorea 2009. Statskassan fylls på en enda dag och staten kan betala sina skulder, löner och projekt utan att låna. Familjer förlorar sina livsbesparingar, pensionärer blir utblottade och ingen litar någonsin mer på bankerna eller sedlarna.' },
      locks: ['liberalism', 'conservatism', 'anarchism', 'libertarianism', 'democracy', 'socialdemocracy', 'greens', 'christdem'] },
    { after: 'none', option: { id: 'cryptonation', name: 'Crypto Currency Nation',
        utopia: true,
        mods: { gdp: 12, freedom: 10, income: 8, research: 6, approval: 6 },
        sting: { stability: -16, income: -14, corruption: 12, gdp: -12, qol: -8, safety: -6 },
        desc: 'Den gamla valutan och centralbanken avskaffas, en kryptovaluta blir landets enda pengar och varje medborgare får gratis mynt i en app på mobilen, som El Salvador började med bitcoin 2021. Alla får ett konto utan banker och avgifter, teknikföretag och investerare från hela världen flyttar hit och landet hyllas som framtidens finanscentrum. Kritikerna undrar bara vad som händer med folkets löner och sparpengar den dag kursen rasar.' },
      locks: ['socialdemocracy', 'socialism', 'communism', 'greens', 'conservatism', 'monarchism'] },
  ],

  arms_exports: [
    { after: '^', option: { id: 'ploughshares', name: 'Swords into Ploughshares',
        utopia: true,
        mods: { approval: 10, qol: 8, factory: 10, income: 8, polpower: 6 },
        sting: { factory: -20, income: -12, milpower: -18, readiness: -12, research: -8 },
        desc: 'Alla vapenfabriker byggs om för fred, så att stridsvagnsfabriken gör traktorer, missilfabriken gör kylskåp och krutbruket gör fyrverkerier, och staten skänker bort sina vapen som skrot. Landet blir en förebild för hela världen, tusentals ingenjörer får fredliga uppgifter och pengarna som gick till krig går nu till folkets välfärd. Ekonomerna undrar bara vem som vill köpa kylskåp från en fabrik som bara kan bygga stridsvagnar, något de ryska vapenfabrikerna fick erfara efter kalla kriget.' },
      locks: ['communism', 'nationalism', 'fascism', 'natsoc', 'imperialism', 'libertarianism', 'stratocracy', 'monarchism'] },
    { after: 'anyone', option: { id: 'warsforhire', name: 'Mercenaries for Gold', brutal: true, shame: 14,
        mods: { income: 26, milpower: 14, factory: 10, polpower: -20, approval: -10, safety: -10, corruption: 14, stability: -6 },
        desc: 'Staten skickar vapen, instruktörer och legosoldater till inbördeskrig i andra länder och tar betalt i guld, diamanter och gruvrättigheter av den sida som betalar bäst, som privata legoarméer har gjort i flera afrikanska länder. Pengarna strömmar in, vapenfabrikerna går för fullt och armén får krigsvana soldater och nya baser utomlands. Krigen i de andra länderna drar ut på tiden, miljoner människor drivs från sina hem och vapnen och legosoldaterna hittar till slut tillbaka hem.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem', 'socialism'] },
  ],

  intellectual_property: [
    { after: '^', option: { id: 'sharashka', name: 'Prison Research Labs', brutal: true, shame: 10,
        mods: { research: 26, milpower: 12, statepower: 10, freedom: -30, approval: -14, unrest: 10, polpower: -10, qol: -6 },
        desc: 'Landets bästa forskare och ingenjörer grips och placeras i låsta forskningsfängelser där de måste uppfinna motorer, flygplan och vapen åt staten, och allt de skapar tillhör staten, som i Sovjetunionens sjarasjkor. Uppfinningarna kommer i rasande takt, utan patent, löner eller bråk om vem som äger idéerna. Forskarna lever åtskilda från sina familjer, unga talanger slutar söka sig till vetenskapen och många flyr utomlands innan de hinner bli upptäckta.' },
      locks: ['liberalism', 'conservatism', 'technocracy', 'democracy', 'socialdemocracy', 'anarchism', 'greens', 'libertarianism', 'christdem'] },
    { after: 'perpetual', option: { id: 'ownideas', name: 'Everything Is Patentable',
        utopia: true,
        mods: { research: 14, gdp: 10, income: 8, approval: 6, polpower: 4 },
        sting: { research: -20, gdp: -12, qol: -12, corruption: 10, justtime: 10, approval: -6 },
        desc: 'Varje medborgare kan ta patent på sina egna idéer, recept, melodier, ord och danssteg och få betalt varje gång någon annan använder dem, och patenten gäller för alltid och går i arv. Alla blir ägare till något, kreativiteten lönar sig äntligen och landet fylls av uppfinnare som lever gott på sina idéer. Juristerna undrar bara hur någon ska kunna laga mat, sjunga en sång eller skriva ett brev utan att bli stämd.' },
      locks: ['socialism', 'communism', 'anarchism', 'greens', 'socialdemocracy'] },
  ],

  vacation: [
    { after: '^', option: { id: 'halfyear', name: 'Half-Year Paid Holiday',
        utopia: true,
        mods: { qol: 18, approval: 14, hdi: 6, unrest: -8, stability: 4 },
        sting: { factory: -22, gdp: -16, income: -18, research: -8, readiness: -6, stability: -8 },
        desc: 'Varje medborgare får ett halvårs betald ledighet om året, så att man arbetar en vår eller en höst och har resten av året fritt för familj, resor, konst och vila. Ett utvilat och lyckligt folk blir friskare, kreativare och så produktivt att halva tiden räcker gott, lovar regeringens experter. Företagarna undrar bara vem som ska sköta sjukhusen, bagerierna och elnätet under det halvår då alla är lediga.' },
      locks: ['liberalism', 'libertarianism', 'technocracy', 'conservatism'] },
    { after: 'none', option: { id: 'nonstopweek', name: 'Continuous Work Week', brutal: true, shame: 6,
        mods: { factory: 30, gdp: 12, income: 8, qol: -24, approval: -18, hdi: -8, unrest: 12, stability: -6 },
        desc: 'Söndagar och helgdagar avskaffas, fabrikerna går alla dagar i veckan och varje arbetare får ett eget schema så att familjen sällan är ledig samma dag, som i Sovjetunionens rullande arbetsvecka från 1929. Maskinerna står aldrig stilla och produktionen ökar kraftigt redan första året. Familjer ses knappt, folk slits ut, olyckorna på jobbet ökar och ingen hinner längre fira högtider eller träffa sina vänner.' },
      locks: ['socialdemocracy', 'socialism', 'communism', 'anarchism', 'theocracy', 'greens', 'christdem', 'democracy', 'liberalism'] },
  ],

  juvenile_justice: [
    { after: '^', option: { id: 'age25', name: 'Responsibility at 25',
        utopia: true,
        mods: { integration: 10, welfare: 8, qol: 8, approval: 8, freedom: 8, income: 4 },
        sting: { safety: -24, stability: -12, approval: -14, unrest: 12, statepower: -10 },
        desc: 'Hjärnforskningen visar att hjärnan mognar först vid tjugofem, så ingen under den åldern kan längre dömas för brott, och varje ung som gör fel får i stället en egen mentor, terapi och en betald utbildning. Fängelserna töms, ungdomarna får en ny chans i stället för ett straff och landet visar världen hur ett verkligt mänskligt rättssystem ser ut. Polisen undrar bara vem gängen kommer att låta göra jobbet när alla under tjugofem går fria.' },
      locks: ['conservatism', 'populism', 'nationalism', 'fascism', 'natsoc', 'imperialism', 'stratocracy', 'monarchism', 'theocracy'] },
    { after: 'adults', option: { id: 'labourcolonies', name: 'Youth Labour Colonies', brutal: true, shame: 14,
        mods: { safety: 22, statepower: 16, factory: 8, freedom: -24, integration: -12, qol: -10, hdi: -8, polpower: -10, unrest: 8 },
        desc: 'Barn från tio år som döms för brott, och barn som bara ställer till bråk i skolan, skickas till slutna arbetskolonier långt hemifrån där de arbetar i verkstäder och på fält tills de fyllt arton, som Sovjetunionens arbetskolonier för minderåriga. Gatorna töms på ungdomsgäng och kolonierna levererar billiga varor till staten. Barnen växer upp utan familj och utan riktig skola, många kommer ut bittra och okunniga och FN fördömer landet för hur det behandlar sina barn.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'socialism', 'anarchism', 'greens', 'christdem', 'libertarianism'] },
  ],

  anti_corruption: [
    { after: '^', option: { id: 'aigov', name: 'Algorithm Government',
        utopia: true,
        mods: { corruption: -20, income: 8, gdp: 6, approval: 6, justtime: -8 },
        sting: { stability: -12, statepower: -12, corruption: 10, approval: -12, safety: -8, justtime: 10, polpower: -10 },
        desc: 'Alla tillstånd, upphandlingar, skatter och domar avgörs av ett datorprogram utan en enda människa inblandad, så det finns ingen tjänsteman kvar att muta och inget beslut som går att köpa. Byråkratin blir blixtsnabb, mutorna försvinner över en natt och landet hyllas som världens första helt rättvisa stat. Kritikerna undrar bara vem som ska rätta programmet när det gör fel, och vem det egentligen var som skrev det.' },
      locks: ['communism', 'fascism', 'natsoc', 'stratocracy', 'theocracy', 'monarchism'] },
    { after: 'patronage', option: { id: 'kleptocracy', name: 'Family Kleptocracy', brutal: true, shame: 7,
        mods: { statepower: 22, stability: 12, milpower: 8, corruption: 28, income: -14, gdp: -10, approval: -14, unrest: 10 },
        desc: 'Ledarens familj och närmaste vänner äger landets banker, gruvor, telefonbolag och hamnar, och varje statligt kontrakt måste betala en andel till dem, som i Mobutus Zaire. Generalerna, domarna och tjänstemännen får sin del av kakan och står därför helt lojala bakom ledningen. Vägar, skolor och sjukhus förfaller medan pengarna försvinner till palats och utländska konton, och vanligt folk blir allt fattigare.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'populism', 'greens', 'libertarianism', 'technocracy', 'christdem'] },
  ],

  border_control: [
    { after: '^', option: { id: 'peaceparks', name: 'Friendship Border Parks',
        utopia: true,
        mods: { gdp: 10, income: 8, polpower: 10, approval: 8, freedom: 8 },
        sting: { safety: -20, statepower: -14, corruption: 12, stability: -10, income: -12 },
        desc: 'Gränsstationerna rivs, gränsvakterna blir parkvakter och hela gränsen förvandlas till ett band av vänskapsparker där folk från båda sidor grillar, handlar och spelar fotboll, som fredsparken mellan USA och Kanada fast längs hela gränsen. Handeln flödar fritt, grannländerna blir landets bästa vänner och turisterna strömmar till de gröna gränsstråken. De gamla tulltjänstemännen undrar bara vem som ska märka något när lastbilarna utan skyltar börjar köra genom parkerna på natten.' },
      locks: ['conservatism', 'populism', 'nationalism', 'fascism', 'natsoc', 'imperialism', 'stratocracy'] },
    { after: 'militarized', option: { id: 'clearedzone', name: 'Cleared Zone & Checkpoints', brutal: true, shame: 9,
        mods: { statepower: 24, safety: 14, readiness: 10, freedom: -26, approval: -16, factory: -8, qol: -10, unrest: 10, gdp: -6 },
        desc: 'Alla byar inom tjugo kilometer från gränsen töms och invånarna flyttas till andra delar av landet, och vägspärrar med inrikespass delar landet i zoner som ingen får lämna utan tillstånd, som Östtysklands gränszon och Sovjetunionens inrikespass. Ingen kommer längre över gränsen och staten vet exakt var varje medborgare befinner sig. Hundratusentals familjer förlorar sina gårdar och hem, släktingar i olika zoner kan inte besöka varandra och handeln mellan landsdelarna stryps.' },
      locks: ['liberalism', 'socialdemocracy', 'democracy', 'anarchism', 'greens', 'libertarianism', 'christdem'] },
  ],
};

export const FX = {
  tobacco: {
    safecig: { smoking: ['+', 22], life: ['+', -3.5], lifemale: ['+', -4.2], ncd: ['+', 6.5], death: ['+', 1.1], adultmortm: ['*', 1.32], adultmortf: ['*', 1.24], healthx: ['+', 1.5], old: ['+', -2], smuggling: ['*', 0.5] },
    rehabcamps: { smoking: ['+', -20], life: ['+', 2.2], ncd: ['+', -5], prisoners: ['*', 1.9], detention: ['+', 10], smuggling: ['*', 3], bribery: ['+', 6], gangs: ['*', 1.4], policetrust: ['+', -12], demo_civ: ['~', 2, 0.6] },
  },
  vaccination: {
    naturalhealth: { measles: ['+', -45], dpt: ['+', -42], hepb: ['+', -55], u5mort: ['*', 2], infmort: ['*', 1.55], life: ['+', -4], tb: ['*', 1.7], commdeath: ['+', 12], death: ['+', 0.8], oop: ['+', 6], stunting: ['*', 1.15] },
    jabraids: { measles: ['+', 20], dpt: ['+', 20], hepb: ['+', 14], u5mort: ['*', 0.62], infmort: ['*', 0.76], life: ['+', 1.6], tb: ['*', 0.6], commdeath: ['+', -6], detention: ['+', 8], voice: ['+', -0.6], demo_civ: ['~', 2.5, 0.6], policetrust: ['+', -12] },
  },
  inheritance_tax: {
    jubilee: { gini: ['+', -14], top10: ['+', -9], bottom20: ['+', 2.5], savings: ['+', -8], stockcap: ['*', 0.3], newbiz: ['*', 0.5], fdi: ['+', -5], lendrate: ['+', 5], credit: ['+', -30], invest: ['+', -5], taxevasion: ['+', 10], gdpgrowth: ['+', -2.5] },
    castes: { gini: ['+', 10], top10: ['+', 8], bottom20: ['+', -2], newbiz: ['*', 0.5], tertiary: ['+', -8], bachelor: ['+', -4], poverty: ['*', 1.4], demo_civ: ['~', 2, 0.6], demo_part: ['~', 2, 0.5] },
  },
  school_choice: {
    boarding: { outofschool: ['*', 0.2], primary: ['+', 8], secondary: ['+', 10], youthlit: ['+', 5], segreg: ['+', -12], pupilteacher: ['*', 0.8], govspend: ['+', 4], fert: ['+', -0.4], mentalill: ['+', 4], demo_civ: ['~', 2, 0.6] },
    unschool: { outofschool: ['*', 3], primary: ['+', -15], secondary: ['+', -20], youthlit: ['+', -10], literacy: ['+', -6], schoolyears: ['+', -2.5], edux: ['+', -3], pisa: ['+', -40], learnpov: ['+', 15], neet: ['+', 8], hci: ['+', -0.08], internet: ['+', 3] },
  },
  animal_welfare: {
    megafarms: { animalcruelty: ['*', 3], methane: ['*', 1.5], aquaculture: ['*', 1.8], fishcatch: ['*', 1.5], thrfish: ['*', 1.3], envcrime: ['*', 2.5], agri: ['+', 2.5], overweight: ['+', 3], water: ['+', -4], agland: ['+', 4], forest: ['+', -4] },
    fourpests: { thrbirds: ['*', 2.5], thrmammals: ['*', 1.5], malaria: ['*', 0.6], cerealyield: ['*', 0.65], cerealprod: ['*', 0.7], undernourish: ['+', 12], stunting: ['*', 1.4], poaching: ['+', 30], protected: ['+', -10], foodprice: ['*', 1.6], forest: ['+', -4] },
  },
  visa_policy: {
    goldenpass: { fdi: ['+', 6], moneylaundering: ['+', 5], houseprice: ['*', 1.35], tourrcpt: ['*', 1.3], bribery: ['+', 4], forgery: ['*', 1.5], migrants: ['+', 2], services: ['+', 3], newcitizens: ['*', 3], taxevasion: ['+', 3], rentshare: ['+', 4] },
    kafala: { migrants: ['+', 12], trafficking: ['*', 2.5], vulnemp: ['+', 10], manuf: ['+', 3], migemp: ['+', 15], integ: ['+', -15], xenophobia: ['+', 6], demo_civ: ['~', 3.5, 0.4], injurydeath: ['+', 3], segreg: ['+', 10] },
  },
  emigration: {
    paidexodus: { emig: ['*', 3], netmig: ['%pop', -0.012], remit: ['+', 14], unemp: ['+', -5], youthunemp: ['+', -12], doctors: ['*', 0.55], nurses: ['*', 0.45], researchers: ['*', 0.5], old: ['+', 3.5], popgrowth: ['+', -1.2], labor: ['*', 0.75], fert: ['+', -0.2] },
    kinpunish: { emig: ['*', 0.03], netmig: ['*', 0.03], remit: ['*', 0.05], voice: ['+', -1.5], polprisoners: ['*', 4], demo_civ: ['~', 1, 0.7], demo_part: ['~', 1.5, 0.5], articles: ['*', 0.25], patents: ['*', 0.3], detention: ['+', 12], trustgov: ['+', -10], mentalill: ['+', 3] },
  },
  language: {
    esperanto: { literacy: ['+', -3], youthlit: ['+', -4], secondary: ['+', -4], outofschool: ['*', 1.2], ictserv: ['+', -3], tourists: ['*', 0.85], articles: ['*', 0.6], hatecrime: ['*', 0.8], integ: ['+', -2], govspend: ['+', 2], schoolyears: ['+', -0.4] },
    puritypolice: { literacy: ['+', -3], ictserv: ['+', -5], internet: ['+', -10], tourists: ['*', 0.7], articles: ['*', 0.6], hatecrime: ['*', 2], voice: ['+', -1], demo_civ: ['~', 2, 0.6], xenophobia: ['+', 8], polprisoners: ['*', 2.5], migrants: ['+', -3] },
  },
  space_program: {
    marscolony: { rnd: ['+', 2], researchers: ['*', 2], articles: ['*', 1.8], hitech: ['+', 8], debt: ['+', 25], govspend: ['+', 5], tertiary: ['+', 6], healthx: ['+', -1.5], poverty: ['*', 1.2], infl: ['+', 6], gdpgrowth: ['+', -1.5] },
    launchanywhere: { hitech: ['+', 7], patents: ['*', 1.5], fdi: ['+', 3], newbiz: ['*', 1.2], injurydeath: ['+', 3], pm25: ['*', 1.3], water: ['+', -3], protected: ['+', -6], trustgov: ['+', -6], manuf: ['+', 2] },
  },
  debt_brake: {
    payoffall: { debt: ['+', -50], budgetbal: ['~', 3, 0.8], govspend: ['+', -14], pensionx: ['+', -4], socialx: ['+', -6], poverty: ['*', 1.8], unemp: ['+', 5], gdpgrowth: ['+', -2.5], healthx: ['+', -2.5], extdebt: ['+', -40], reserves: ['*', 1.6], homeless: ['*', 1.5] },
    repudiate: { debt: ['*', 0.4], extdebt: ['*', 0.3], interestpay: ['*', 0.3], lendrate: ['+', 15], infl: ['+', 25], fdi: ['+', -6], rating: ['~', 7.5, 0.8], reserves: ['*', 0.3], imports: ['*', 0.7], gdpgrowth: ['+', -3], credit: ['+', -30] },
  },
  banking: {
    confiscation: { savings: ['+', -15], bankacc: ['+', -25], credit: ['+', -30], shadow: ['+', 12], gdpgrowth: ['+', -3], fdi: ['+', -6], trustgov: ['+', -15], invest: ['+', -5], poverty: ['*', 1.3], stockcap: ['*', 0.5], consumption: ['+', -6] },
    cryptonation: { bankacc: ['+', 10], fraud: ['*', 2.5], moneylaundering: ['+', 8], cybercrime: ['*', 2.5], idtheft: ['*', 1.6], infl: ['+', 10], reserves: ['*', 0.6], savings: ['+', -6], credit: ['+', -20], elprice: ['*', 1.3], ictserv: ['+', 2] },
  },
  arms_exports: {
    ploughshares: { armsexp: ['*', 0.01], armsimp: ['*', 2], milx: ['+', -1.5], manuf: ['+', -4], hitech: ['+', -6], empind: ['+', -3], unemp: ['+', 2.5], rnd: ['+', -0.3], polstab: ['+', 0.3], exports: ['*', 0.88] },
    warsforhire: { armsexp: ['*', 7], milx: ['+', 2], manuf: ['+', 4], hitech: ['+', 3], smuggling: ['*', 2], weapons: ['*', 1.6], bribery: ['+', 8], polstab: ['+', -0.8], voice: ['+', -0.6], fdi: ['+', -3], minrent: ['+', 3] },
  },
  intellectual_property: {
    sharashka: { rnd: ['+', 0.6], hitech: ['+', 4], milx: ['+', 0.5], armsexp: ['*', 1.4], articles: ['*', 0.6], researchers: ['*', 0.8], patents: ['*', 1.3], prisoners: ['*', 1.15], polprisoners: ['*', 2], voice: ['+', -0.8], demo_civ: ['~', 2, 0.6] },
    ownideas: { patents: ['*', 6], piracy: ['+', -25], counterfeit: ['*', 0.4], newbiz: ['*', 0.4], articles: ['*', 0.6], oop: ['+', 12], courtwait: ['*', 1.8], lawyers: ['*', 2], life: ['+', -1.5], stockcap: ['*', 1.5], gini: ['+', 4] },
  },
  vacation: {
    halfyear: { vacationdays: ['=', 50], productivity: ['*', 1.05], gdpgrowth: ['+', -2], unemp: ['+', 4], airpax: ['*', 1.8], tourspend: ['*', 2], consumption: ['+', 5], mentalill: ['+', -2], life: ['+', 1.5], debt: ['+', 15] },
    nonstopweek: { vacationdays: ['=', 0], workweek: ['~', 60, 0.8], productivity: ['*', 0.82], life: ['+', -2.5], mentalill: ['+', 3], sickleave: ['+', 2], fert: ['+', -0.25], adultmortm: ['*', 1.2], femlabor: ['+', -6], injurydeath: ['+', 2] },
  },
  juvenile_justice: {
    age25: { prisoners: ['*', 0.4], prisonocc: ['+', -50], recidivism: ['+', 12], gangs: ['*', 3], youthcrime: ['*', 1.8], theft: ['*', 1.6], robbery: ['*', 1.5], burglary: ['*', 1.4], clearance: ['+', -18], feelsafe: ['+', -16], policetrust: ['+', -10], detention: ['+', -8] },
    labourcolonies: { prisoners: ['*', 2.4], prisonocc: ['+', 90], recidivism: ['+', 20], youthcrime: ['*', 0.6], gangs: ['*', 0.45], childlabor: ['+', 8], outofschool: ['*', 1.6], neet: ['+', 8], detention: ['+', 12], policetrust: ['+', -10], demo_civ: ['~', 3, 0.5] },
  },
  anti_corruption: {
    aigov: { bribery: ['+', -15], corruptgov: ['+', 1.2], firmbribe: ['+', -15], goveff: ['+', -0.6], cybercrime: ['*', 2], idtheft: ['*', 1.8], trustgov: ['+', -8], courtwait: ['*', 1.5], unemp: ['+', 1.5], regq: ['+', 0.3] },
    kleptocracy: { bribery: ['+', 30], corruptgov: ['+', -1.8], embezzle: ['*', 2.5], moneylaundering: ['+', 8], taxevasion: ['+', 12], fdi: ['+', -5], gini: ['+', 6], top10: ['+', 6], trustgov: ['+', -12], demo_gov: ['~', 1.5, 0.6], firmbribe: ['+', 25], extortion: ['*', 2.2] },
  },
  border_control: {
    peaceparks: { smuggling: ['*', 3], trafficking: ['*', 2.2], drugcrime: ['*', 2], weapons: ['*', 2], cartheft: ['*', 1.8], counterfeit: ['*', 1.8], forgery: ['*', 1.4], tariff: ['~', 0, 0.8], exports: ['*', 1.3], imports: ['*', 1.35], tourists: ['*', 1.6], protected: ['+', 4] },
    clearedzone: { smuggling: ['*', 0.08], trafficking: ['*', 0.1], netmig: ['*', 0.05], tourists: ['*', 0.2], exports: ['*', 0.55], imports: ['*', 0.5], milx: ['+', 2.5], detention: ['+', 8], demo_civ: ['~', 2, 0.6], cctv: ['*', 3], commute: ['+', 15], lpi: ['+', -0.6] },
  },
};

export const NEW = {};
