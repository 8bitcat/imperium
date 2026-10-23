// IMPERIUM V5.6 — HÄNDELSER: KULTUR, RELIGION & SAMHÄLLE.
// Idrott, fester, film och musik, språk- och kulturstrider, tro, jämställdhet, invandring, ungdomen, landsbygden, turism och sammanhållning.
export const EVENTS = [

  // ================= IDROTT =================
  {
    id: 'sam_olympics_bid', icon: '\u{1F3C5}', weight: 1, cooldown: 1200,
    title: 'VI KAN FÅ ARRANGERA OS',
    text: 'Olympiska kommittén har låtit förstå att ditt land har goda chanser om ni lägger ett bud. Idrottsförbunden jublar, ekonomerna räknar och huvudstadens invånare undrar vem som ska använda alla nya arenor efteråt.',
    when: (c) => (c.ind.gdppc ?? 0) > 20000 && c.st.stability > 0 && c.day > 200,
    choices: [
      { text: 'LÄGG ETT STORT BUD MED NYA ARENOR', cost: { money: 1600 }, temp: { approval: 10, gdp: 6 }, perm: { income: -3 }, mod: 'olympic_glory', tip: 'Två veckor av fest. Tjugo år av underhåll.' },
      { text: 'LÄGG ETT SPARSAMT BUD MED BEFINTLIGA ANLÄGGNINGAR', cost: { money: 600 }, temp: { approval: 5, gdp: 3 }, rel: 5, tip: 'Kommittén älskar sparsamhet. På papperet.' },
      { text: 'TACKA NEJ', temp: { approval: -5, ideopower: -3 }, tip: 'Kassan tackar. Idrottsrörelsen gör det inte.' },
    ],
  },
  {
    id: 'sam_olympic_gold', icon: '\u{1F947}', weight: 1,
    title: 'GULD I OLYMPISKA SPELEN',
    text: 'En okänd löpare från en liten bruksort har tagit landets första olympiska guld på tjugo år. Halva nationen satt uppe mitt i natten och såg loppet, och nu vill alla veta vad du tänker göra.',
    when: (c) => c.st.qol > 5 && c.st.hdi > -10 && c.day > 120 && !c.mod('olympic_glory'),
    choices: [
      { text: 'HJÄLTEVÄLKOMNANDE PÅ STORA TORGET', cost: { money: 300 }, mod: 'olympic_glory', tip: 'Hela landet vill vara med på bilden.' },
      { text: 'SATSA PÅ ELITIDROTTEN INFÖR NÄSTA SPEL', cost: { money: 900 }, perm: { qol: 3, manpower: 3 }, temp: { approval: 5 }, tip: 'Fler medaljer. Färre pengar till motionsspåren.' },
      { text: 'GRATULERA KORT OCH GÅ VIDARE', temp: { approval: 2, ideopower: -2 }, tip: 'Hon förtjänade mer än ett pressmeddelande.' },
    ],
  },
  {
    id: 'sam_doping_scandal', icon: '\u{1F489}', weight: 2,
    title: 'DOPNINGSSKANDALEN',
    text: 'Antidopingbyrån har hittat förbjudna medel hos halva friidrottslandslaget. Läckta mejl tyder på att förbundet visste om det och att statliga pengar betalade preparaten.',
    when: (c) => (c.mod('olympic_glory') && c.st.corruption > 0) || (c.st.corruption > 35 && c.day > 150),
    choices: [
      { text: 'ERKÄNN, BE OM URSÄKT OCH TA STRAFFET', temp: { approval: -6 }, perm: { corruption: -4 }, unmod: 'olympic_glory', rel: 6, tip: 'Medaljerna lämnas tillbaka. Hedern stannar kvar.' },
      { text: 'FÖRNEKA ALLT OCH TALA OM EN KONSPIRATION', cost: { pp: 15 }, temp: { ideopower: 6, approval: 3 }, rel: -12, mod: 'cover_up', tip: 'Hemma tror man på dig. Ingen annanstans.' },
      { text: 'BYGG ETT OBEROENDE ANTIDOPINGLABB', cost: { money: 500, rp: 20 }, perm: { corruption: -6, research: 2 }, temp: { approval: -2 }, rel: 8, tip: 'Ett dyrt sätt att bli trovärdig igen.' },
    ],
  },
  {
    id: 'sam_national_arena', icon: '\u{1F3DF}\u{FE0F}', weight: 2, cooldown: 900,
    title: 'NATIONALARENAN HÅLLER INTE LÄNGRE',
    text: 'Den gamla nationalarenan klarar inte de internationella kraven. Utan en ny får landslaget spela sina hemmamatcher utomlands, och förbundet har redan ritningarna klara.',
    when: (c) => (c.ind.gdppc ?? 0) > 6000 && c.day > 300 && c.st.income > -10 && c.st.qol > 0,
    choices: [
      { text: 'STATEN BYGGER OCH ÄGER ARENAN', cost: { money: 1300 }, temp: { approval: 8, gdp: 3 }, perm: { qol: 3 }, tip: 'En katedral för fotboll. Med statlig driftbudget.' },
      { text: 'LÅT ETT PRIVAT BOLAG BYGGA MOT NAMNRÄTTEN', cost: { pp: 15 }, temp: { gdp: 4, approval: 2 }, perm: { corruption: 3 }, tip: 'Arenan får heta som en energidryck.' },
      { text: 'RENOVERA DEN GAMLA SÅ GOTT DET GÅR', cost: { money: 400 }, temp: { approval: 3 }, tip: 'Fungerar. Ingen blir imponerad.' },
      { text: 'INGA SKATTEPENGAR TILL IDROTTSPALATS', temp: { approval: -6, ideopower: -2 }, tip: 'Landslaget spelar hemmamatcherna i grannlandet.' },
    ],
  },
  {
    id: 'sam_world_cup_run', icon: '\u{26BD}', weight: 1,
    title: 'LANDSLAGET ÄR I VM-SEMIFINAL',
    text: 'För första gången någonsin har fotbollslandslaget gått till semifinal i världsmästerskapet. Matchen spelas en vardag mitt på dagen, och arbetsgivarna har redan gett upp.',
    when: (c) => c.day > 100 && c.st.unrest < 20 && c.st.stability > -15 && c.st.qol > 0 && c.st.approval > -20 && !c.mod('olympic_glory'),
    choices: [
      { text: 'GÖR MATCHDAGEN TILL HELGDAG', cost: { pp: 15 }, temp: { gdp: -3 }, mod: 'national_unity', tip: 'Produktionen står still i nittio minuter plus förlängning.' },
      { text: 'STORBILDSSKÄRMAR PÅ VARJE TORG', cost: { money: 300 }, temp: { approval: 5, unrest: -4, integration: 3 }, tip: 'Hela landet kramar främlingar. Även efter förlusten.' },
      { text: 'ARBETE SOM VANLIGT', temp: { approval: -5, factory: 2 }, tip: 'Ingen arbetar ändå. Men nu har de dåligt samvete.' },
    ],
  },
  {
    id: 'sam_esports_champions', icon: '\u{1F3AE}', weight: 1,
    title: 'VÄRLDSMÄSTARE I E-SPORT',
    text: 'Fem tonåringar från landet har vunnit världsmästerskapet i ett datorspel inför trettio miljoner tittare på nätet. Föräldrarna förstår ingenting, men barnen har plötsligt nya idoler.',
    when: (c) => (c.ind.internet ?? 0) > 88 && c.st.research > -10 && c.day > 100,
    choices: [
      { text: 'ERKÄNN E-SPORT SOM IDROTT MED STATLIGT STÖD', cost: { money: 300 }, temp: { research: 3, qol: 3, approval: 3 }, tip: 'Idrottsförbundet protesterar. Ungdomarna jublar.' },
      { text: 'ARRANGERA NÄSTA VÄRLDSMÄSTERSKAP', cost: { money: 700 }, temp: { gdp: 4, approval: 4 }, rel: 5, tip: 'Hotellen fylls av gäster som aldrig går ut.' },
      { text: 'DET ÄR BARA SPEL', temp: { approval: -3, research: -2 }, tip: 'Talangerna flyttar till länder som tar dem på allvar.' },
    ],
  },

  // ================= FESTER, HÖGTIDER & KULTURARV =================
  {
    id: 'sam_national_day', icon: '\u{1F389}', weight: 2, cooldown: 700,
    title: 'HUR SKA NATIONALDAGEN FIRAS?',
    text: 'Nationaldagen närmar sig och i år är det jubileum. Försvarsmakten vill ha parad, kommunerna vill ha folkfest och de flesta skattebetalare vill helst ha en ledig dag.',
    when: (c) => c.st.stability > 5 && c.st.unrest < 20 && c.st.ideopower > 0 && c.day > 60,
    choices: [
      { text: 'STOR MILITÄRPARAD GENOM HUVUDSTADEN', cost: { money: 500 }, temp: { readiness: 4, milpower: 3, ideopower: 8, freedom: -2 }, rel: -3, tip: 'Grannländerna räknar stridsvagnarna.' },
      { text: 'FOLKFEST I VARJE KOMMUN', cost: { money: 400 }, temp: { approval: 6, integration: 4, qol: 3 }, tip: 'Korv, körsång och regn.' },
      { text: 'EN ARBETSDAG SOM ALLA ANDRA', temp: { income: 3, approval: -5, ideopower: -4 }, tip: 'Ekonomerna är nöjda. Ingen annan.' },
    ],
  },
  {
    id: 'sam_festival_overgrown', icon: '\u{1F3B8}', weight: 2,
    title: 'FESTIVALEN SOM VÄXTE FÖR FORT',
    text: 'Sommarens musikfestival har sålt dubbelt så många biljetter som förra året. Polisen varnar för trängseln, grannarna klagar på ljudet och turistnäringen gnuggar händerna.',
    when: (c) => c.st.freedom > 10 && c.st.qol > 5 && c.day > 90,
    choices: [
      { text: 'STATLIGT STÖD TILL SÄKERHET OCH SJUKVÅRD', cost: { money: 400 }, temp: { safety: 5, qol: 4, gdp: 3 }, tip: 'Ordnat, säkert och lite tråkigare.' },
      { text: 'LÅT ARRANGÖRERNA SKÖTA ALLT', temp: { gdp: 3, qol: 2, safety: -6 }, tip: 'Det går bra. Ända tills det inte gör det.' },
      { text: 'HALVERA PUBLIKEN GENOM KRAV PÅ TILLSTÅND', cost: { pp: 10 }, temp: { safety: 4, freedom: -3, approval: -3 }, tip: 'Ungdomarna åker till grannlandets festival i stället.' },
    ],
  },
  {
    id: 'sam_world_heritage', icon: '\u{1F3DB}\u{FE0F}', weight: 1, cooldown: 1500,
    title: 'GAMLA STADEN KAN BLI VÄRLDSARV',
    text: 'FN:s kulturorgan vill föra in huvudstadens gamla stadskärna på världsarvslistan. Det lockar turister, men byggbolagen som planerat ett nytt affärskvarter där tycker inte om tanken.',
    when: (c) => c.is('un', 'member', 'important', 'head') && c.day > 150 && (c.ind.tourists ?? 0) > 300000 && c.st.hdi > 5,
    choices: [
      { text: 'TACKA JA OCH SKYDDA STADSKÄRNAN', cost: { pp: 10 }, temp: { factory: -3, gdp: 3 }, perm: { qol: 3 }, rel: 6, tip: 'Inga nya skyskrapor. Väldigt många nya souvenirbutiker.' },
      { text: 'TACKA JA MEN BYGG AFFÄRSKVARTERET I KANTEN', cost: { money: 400 }, temp: { gdp: 5 }, perm: { corruption: 2 }, rel: -3, tip: 'Organisationen hotar att stryka er från listan igen.' },
      { text: 'TACKA NEJ - STADEN SKA FÅ VÄXA', temp: { gdp: 4, factory: 3, ideopower: -3 }, rel: -4, tip: 'Kranarna snurrar. Kulturarvet blir parkeringshus.' },
    ],
  },

  // ================= FILM & MUSIK =================
  {
    id: 'sam_film_world_hit', icon: '\u{1F3AC}', weight: 1,
    title: 'VÅR FILM HAR ERÖVRAT VÄRLDEN',
    text: 'En lågbudgetfilm inspelad i landets småstäder har vunnit huvudpriset på världens största filmfestival. Biograferna utomlands är fulla och turister börjar fråga efter inspelningsplatserna.',
    when: (c) => c.st.freedom > 15 && (c.ind.gdppc ?? 0) > 3000 && c.day > 150,
    choices: [
      { text: 'DUBBLA ANSLAGET TILL FILMINSTITUTET', cost: { money: 500 }, perm: { qol: 2, hdi: 2 }, temp: { approval: 3 }, rel: 5, tip: 'Nästa film blir säkert lika bra. Kanske.' },
      { text: 'GÖR INSPELNINGSPLATSERNA TILL TURISTMÅL', cost: { money: 300 }, temp: { gdp: 5, income: 3 }, rel: 3, tip: 'Bybornas trädgårdar blir selfiekulisser.' },
      { text: 'GRATULERA OCH LÅT FILMEN TALA FÖR SIG SJÄLV', temp: { approval: 2 }, rel: 2, tip: 'Billigt, och regissören slipper bli statens maskot.' },
    ],
  },
  {
    id: 'sam_director_critic', icon: '\u{1F3A5}', weight: 2,
    title: 'FILMEN SOM STATEN INTE GILLAR',
    text: 'En prisbelönt regissör har gjort en film om korruptionen i landets förvaltning. Den visas på festivaler över hela världen, men hemma har den fortfarande inte fått visningstillstånd.',
    when: (c) => (c.st.freedom < 0 || c.is('press', 'state', 'highstate', 'propaganda')) && c.st.corruption > 10 && c.day > 100,
    choices: [
      { text: 'GE VISNINGSTILLSTÅND UTAN STRYKNINGAR', cost: { pp: 15 }, temp: { freedom: 8, approval: -4 }, perm: { corruption: -2 }, rel: 8, tip: 'Folket ser filmen. Några ministrar känner igen sig själva.' },
      { text: 'FÖRBJUD FILMEN', temp: { freedom: -8, statepower: 4 }, rel: -8, tip: 'Den sprids på nätet inom en vecka. Med bättre undertexter.' },
      { text: 'BETALA FÖR EN EGEN FILM MED DEN RIKTIGA HISTORIEN', cost: { money: 600 }, temp: { ideopower: 8, freedom: -3 }, rel: -2, tip: 'Statens film får sämre recensioner än en tandläkarbroschyr.' },
    ],
  },
  {
    id: 'sam_song_contest', icon: '\u{1F3A4}', weight: 1, cooldown: 1000,
    title: 'VI VANN SÅNGTÄVLINGEN',
    text: 'Landets bidrag har vunnit den stora internationella sångtävlingen med en låt om en ensam fyrvaktare. Enligt reglerna ska ni nu arrangera nästa års final, med hela kontinenten som publik.',
    when: (c) => c.day > 120 && c.st.freedom > 5 && c.st.qol > 0 && (c.ind.internet ?? 0) > 60,
    choices: [
      { text: 'ARRANGERA EN GIGANTISK FINAL', cost: { money: 900 }, temp: { gdp: 5, approval: 6, qol: 3 }, rel: 8, tip: 'Glitter, pyroteknik och tre veckor av trafikkaos.' },
      { text: 'ARRANGERA DEN BILLIGT I EN MÄSSHALL', cost: { money: 300 }, temp: { approval: 3 }, rel: 3, tip: 'Kommentatorerna kallar det charmigt. De menar snålt.' },
      { text: 'LÅT NÅGON ANNAN ARRANGERA', temp: { approval: -5, ideopower: -3 }, rel: -4, tip: 'Fyrvaktarlåten får firas utomlands.' },
    ],
  },

  // ================= SPRÅK & KULTURSTRIDER =================
  {
    id: 'sam_minority_language', icon: '\u{1F4DC}', weight: 2,
    title: 'MINORITETSSPRÅKET VILL BLI OFFICIELLT',
    text: 'I en gränsregion talar de flesta ett annat språk än resten av landet. Regionfullmäktige kräver att det blir officiellt där, med skyltar, myndighetsbrev och domstolar på båda språken.',
    when: (c) => c.is('culture', 'balanced') && c.st.integration < 15 && c.st.unrest > 10 && c.day > 80,
    choices: [
      { text: 'OFFICIELLT SPRÅK I REGIONEN', cost: { money: 400 }, perm: { integration: 5, freedom: 3 }, temp: { unrest: -6, ideopower: -3 }, tip: 'Vägskyltarna blir dubbelt så långa. Grälen hälften så långa.' },
      { text: 'GÖR HELA LANDET OFFICIELLT FLERSPRÅKIGT', cost: { pp: 25 }, law: ['culture', 'multi'], perm: { integration: 6, freedom: 4 }, temp: { ideopower: -6, unrest: -4 }, tip: 'En stor gest som nationalisterna aldrig glömmer.' },
      { text: 'ETT LAND, ETT SPRÅK', temp: { unrest: 7, integration: -4, ideopower: 4 }, tip: 'Regionen börjar prata om ett annat land. På sitt eget språk.' },
    ],
  },
  {
    id: 'sam_one_culture_demand', icon: '\u{1F3F3}\u{FE0F}', weight: 2,
    title: 'EN NATION, EN KULTUR',
    text: 'En växande rörelse kräver att staten slutar stödja minoriteternas föreningar och skolor och i stället satsar allt på den nationella kulturen. Demonstrationståget är det största på flera år.',
    when: (c) => c.is('culture', 'multi', 'balanced') && (c.st.integration < -15 || ['nationalism', 'populism', 'fascism', 'stratocracy'].includes(c.ideo)) && c.st.unrest > 5,
    choices: [
      { text: 'INFÖR EN ENHETLIG NATIONELL KULTURPOLITIK', cost: { pp: 30 }, law: ['culture', 'mono'], perm: { ideopower: 6, freedom: -5 }, temp: { unrest: -6 }, rel: -5, tip: 'Rörelsen går hem nöjd. Minoriteterna går inte hem alls.' },
      { text: 'MER PENGAR TILL NATIONELL KULTUR UTAN ATT DRA NER PÅ NÅGOT', cost: { money: 500 }, temp: { ideopower: 5, unrest: -5 }, tip: 'Alla får mer. Statskassan får mindre.' },
      { text: 'AVVISA KRAVEN', temp: { unrest: 6, freedom: 3, ideopower: -4 }, tip: 'Principfast. Tåget går igen nästa helg.' },
    ],
  },
  {
    id: 'sam_english_takeover', icon: '\u{1F524}', weight: 2,
    title: 'ENGELSKAN TAR ÖVER',
    text: 'Språkrådet larmar: hälften av reklamskyltarna i huvudstaden är på engelska och tonåringar byter språk mitt i meningen. Högskolorna har slutat undervisa på nationalspråket i flera ämnen.',
    when: (c) => (c.ind.internet ?? 0) > 80 && !c.is('culture', 'multi') && c.is('globalism', 'major', 'big', 'partner'),
    choices: [
      { text: 'SPRÅKLAG: NATIONALSPRÅKET FÖRST I REKLAM OCH SKOLA', cost: { pp: 15 }, perm: { ideopower: 4, integration: 2 }, temp: { freedom: -3, research: -2 }, tip: 'Reklambyråerna hittar på nya ord. På engelska.' },
      { text: 'SATSA PÅ LÄROMEDEL OCH LITTERATUR PÅ VÅRT SPRÅK', cost: { money: 400 }, perm: { hdi: 2, ideopower: 2 }, temp: { qol: 2 }, tip: 'Långsamt och dyrt, som allt som fungerar.' },
      { text: 'LÅT SPRÅKET LEVA SITT EGET LIV', temp: { research: 3, ideopower: -4 }, rel: 2, tip: 'Språkrådet skriver ett argt brev. Ingen läser det.' },
    ],
  },

  // ================= RELIGION =================
  {
    id: 'sam_revival', icon: '\u{1F56F}\u{FE0F}', weight: 2,
    title: 'VÄCKELSEN SPRIDER SIG',
    text: 'I de fattiga fabriksstäderna fylls bönehusen för första gången på flera generationer. De nya församlingarna delar ut mat och hjälper missbrukare, och kräver allt högljuddare att få ett ord med i politiken.',
    when: (c) => !c.is('religion', 'atheism') && c.st.qol < -10 && c.st.welfare < 10 && !c.mod('religious_revival'),
    choices: [
      { text: 'LÅT RÖRELSEN VÄXA FRITT', mod: 'religious_revival', temp: { welfare: 3 }, tip: 'Soppköken är gratis. Inflytandet kostar senare.' },
      { text: 'STATSBIDRAG TILL FÖRSAMLINGARNAS SOCIALA ARBETE', cost: { money: 400 }, mod: 'religious_revival', temp: { welfare: 5, qol: 3, unrest: -5 }, tip: 'Staten betalar. Pastorerna får äran.' },
      { text: 'BYGG UT DEN STATLIGA VÄLFÄRDEN I STÄLLET', cost: { money: 800 }, perm: { welfare: 4 }, temp: { qol: 3, ideopower: -3 }, tip: 'Bönehusen töms igen. Långsamt.' },
    ],
  },
  {
    id: 'sam_church_state_split', icon: '\u{26EA}', weight: 2,
    title: 'SKILJ KYRKAN FRÅN STATEN',
    text: 'En bred koalition av liberaler, minoritetssamfund och unga präster vill avskaffa statskyrkan. Biskoparna varnar för att landet tappar sin själ, och ekonomerna noterar att kyrkoskatten försvinner.',
    when: (c) => c.is('religion', 'statereligion') && c.st.freedom > 0,
    choices: [
      { text: 'GENOMFÖR SKILSMÄSSAN', cost: { pp: 25 }, law: ['religion', 'secularism'], perm: { freedom: 4 }, temp: { ideopower: -6, stability: -3 }, tip: 'Kyrkan blir fri. Staten blir fri. Ingen är riktigt glad.' },
      { text: 'BEHÅLL STATSKYRKAN MEN GE ANDRA SAMFUND LIKA STÖD', cost: { money: 400 }, perm: { integration: 3, freedom: 2 }, temp: { ideopower: -2 }, tip: 'En kompromiss som kräver en ny myndighet.' },
      { text: 'TRADITIONEN STÅR FAST', temp: { ideopower: 4, freedom: -3, approval: -3 }, tip: 'Biskoparna tackar dig i söndagens predikan.' },
    ],
  },
  {
    id: 'sam_faith_defenders', icon: '\u{1F64F}', weight: 2,
    title: 'TRONS FÖRSVARARE',
    text: 'Väckelsen har blivit en politisk kraft. En miljon namnunderskrifter kräver att landets gamla tro blir statsreligion igen, med plats i skolan och i grundlagen.',
    when: (c) => c.is('religion', 'secularism') && (c.mod('religious_revival') || ['theocracy', 'christdem'].includes(c.ideo) || c.doc === 'traditionalism'),
    choices: [
      { text: 'INFÖR STATSRELIGION', cost: { pp: 30 }, law: ['religion', 'statereligion'], perm: { ideopower: 6, stability: 3, freedom: -4 }, tip: 'Söndagsmässan blir en statsangelägenhet.' },
      { text: 'GE TROSSAMFUNDEN SKATTELÄTTNADER OCH SKOLSTÖD', cost: { money: 500 }, temp: { ideopower: 4, approval: 4, income: -3 }, tip: 'Ett halvt ja, som räcker ett tag.' },
      { text: 'EN SEKULÄR STAT ÄR EN SEKULÄR STAT', temp: { unrest: 6, freedom: 3, approval: -3 }, tip: 'Underskrifterna arkiveras. Rörelsen gör det inte.' },
    ],
  },
  {
    id: 'sam_house_of_worship', icon: '\u{1F6D0}', weight: 2,
    title: 'BYGGLOVET FÖR BÖNELOKALEN',
    text: 'En liten församling av nyinflyttade vill bygga en egen gudstjänstlokal i en mindre stad. Kommunen har sagt nej med hänvisning till parkeringsplatserna, men alla vet att det handlar om något annat.',
    when: (c) => !c.is('religion', 'atheism') && c.st.immigration > 10 && c.st.integration < 10,
    choices: [
      { text: 'STATEN GARANTERAR RELIGIONSFRIHETEN - BYGGET BLIR AV', cost: { pp: 15 }, perm: { freedom: 3, integration: 4 }, temp: { unrest: 4, approval: -3 }, tip: 'Grundlagen vinner. Kommunen förlorar ansiktet.' },
      { text: 'MEDLA FRAM EN GEMENSAM LOKAL FÖR FLERA SAMFUND', cost: { money: 300 }, perm: { integration: 5 }, temp: { unrest: -2 }, tip: 'Tre samfund, ett schema och väldigt mycket kaffe.' },
      { text: 'LÅT KOMMUNEN BESTÄMMA', temp: { integration: -5, unrest: -2, freedom: -2 }, tip: 'Lokalt självstyre, som det heter när man inte vill välja.' },
    ],
  },
  {
    id: 'sam_empty_churches', icon: '\u{1F514}', weight: 2,
    title: 'KYRKORNA STÅR TOMMA',
    text: 'Sekulariseringen har gått så långt att hundratals kyrkor och bönehus har färre än tio besökare i veckan. Församlingarna har inte råd att värma upp dem och vill sälja.',
    when: (c) => c.is('religion', 'secularism', 'atheism') && (c.ind.hdi ?? 0.7) > 0.88 && !c.mod('religious_revival'),
    choices: [
      { text: 'KULTURMÄRK DEM - STATEN BETALAR UPPVÄRMNINGEN', cost: { money: 500 }, perm: { qol: 2 }, temp: { ideopower: 2 }, tip: 'Världens dyraste tomma rum.' },
      { text: 'TILLÅT FÖRSÄLJNING OCH OMBYGGNAD', res: { money: 200 }, temp: { ideopower: -4, approval: -2 }, tip: 'Klättervägg i koret, lägenheter i tornet.' },
      { text: 'GÖR DEM TILL BIBLIOTEK OCH KULTURHUS', cost: { money: 300 }, temp: { qol: 3, hdi: 2, integration: 2 }, tip: 'Klockorna ringer in barnteatern.' },
    ],
  },

  // ================= JÄMSTÄLLDHET =================
  {
    id: 'sam_pay_gap', icon: '\u{2696}\u{FE0F}', weight: 2,
    title: 'LÖNEGAPET',
    text: 'En ny rapport visar att kvinnor i samma yrken som män tjänar en femtedel mindre, och att gapet inte har minskat på tio år. Facken kräver en lag, arbetsgivarna kräver arbetsro.',
    when: (c) => (c.ind.femlabor ?? 50) > 45 && c.is('equality', 'legal', 'traditional') && c.st.freedom > 5 && c.is('unions', 'mandatory', 'strong', 'balanced'),
    choices: [
      { text: 'LAG OM LÖNEKARTLÄGGNING OCH LIKA LÖN', cost: { pp: 20 }, law: ['equality', 'strong'], perm: { qol: 3, freedom: 2 }, temp: { gdp: -2 }, tip: 'Varje arbetsgivare får ett nytt kalkylblad att fylla i.' },
      { text: 'HÖJ LÖNERNA I DE KVINNODOMINERADE VÅRDYRKENA', cost: { money: 800 }, perm: { welfare: 3, qol: 3 }, temp: { approval: 5 }, tip: 'Undersköterskorna jublar. Finansministern suckar.' },
      { text: 'DET ÄR PARTERNAS SAK', temp: { approval: -4, unrest: 3 }, tip: 'Parterna har haft tio år på sig.' },
    ],
  },
  {
    id: 'sam_parliament_men', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'NÄSTAN BARA MÄN I PARLAMENTET',
    text: 'Efter valet är färre än var sjätte ledamot en kvinna. Internationella observatörer kommenterar saken, och en ung kvinnlig kandidat som förlorade har blivit landets mest omtalade person på nätet.',
    when: (c) => (c.ind.womenparl ?? 25) < 16 && !c.is('elections', 'no'),
    choices: [
      { text: 'INFÖR KÖNSKVOTERING PÅ VALLISTORNA', cost: { pp: 25 }, perm: { freedom: 2, hdi: 2 }, temp: { ideopower: -3, approval: -2 }, tip: 'Partierna letar febrilt efter kandidater de aldrig frågat förut.' },
      { text: 'STATLIGT STÖD TILL KVINNORS POLITISKA NÄTVERK', cost: { money: 300 }, perm: { hdi: 2 }, temp: { approval: 3, freedom: 2 }, tip: 'Mentorer, talträning och barnvakt på varje möte.' },
      { text: 'VÄLJARNA HAR VALT', temp: { approval: -2 }, rel: -3, tip: 'Observatörerna skriver ännu en rapport.' },
    ],
  },
  {
    id: 'sam_women_workforce', icon: '\u{1F469}\u{200D}\u{1F4BC}', weight: 2,
    title: 'KVINNORNA VILL UT I ARBETSLIVET',
    text: 'Allt fler kvinnor med utbildning står utanför arbetsmarknaden, och en ny studie visar att landet går miste om en stor del av sin tillväxt. Bristen på barnomsorg och gamla seder håller dem hemma.',
    when: (c) => ((c.ind.femlabor ?? 50) < 40 || (c.ind.gii ?? 0.3) > 0.55) && !c.is('equality', 'full', 'strong') && c.day > 60,
    choices: [
      { text: 'BYGG UT BILLIG BARNOMSORG I HELA LANDET', cost: { money: 900 }, perm: { gdp: 4, welfare: 3, qol: 2 }, tip: 'Förskolan är världens bästa tillväxtpolitik. Och dyraste.' },
      { text: 'SKÄRP JÄMSTÄLLDHETSLAGARNA KRAFTIGT', cost: { pp: 25 }, law: ['equality', 'strong'], perm: { gdp: 2, freedom: 2 }, temp: { ideopower: -4, unrest: 3 }, tip: 'Rätt sak, men traditionen protesterar högljutt.' },
      { text: 'LÅT FAMILJERNA SJÄLVA BESTÄMMA', temp: { ideopower: 3 }, perm: { gdp: -2 }, tip: 'Halva begåvningen i landet sitter hemma och väntar.' },
    ],
  },
  {
    id: 'sam_equality_backlash', icon: '\u{1F504}', weight: 2,
    title: 'MOTREAKTIONEN MOT JÄMSTÄLLDHETSLAGARNA',
    text: 'Konservativa och religiösa grupper har samlat sig mot de nya jämställdhetsreglerna. De menar att staten lägger sig i familjelivet, och flera småföretagare vägrar fylla i blanketterna.',
    when: (c) => c.is('equality', 'full', 'strong') && (['conservatism', 'christdem', 'theocracy', 'populism', 'nationalism', 'monarchism'].includes(c.ideo) || c.mod('religious_revival') || c.st.unrest > 25),
    choices: [
      { text: 'STÅ FAST VID LAGARNA', temp: { unrest: 5, approval: -3 }, tip: 'Reformen överlever. Opinionen skakar.' },
      { text: 'FÖRENKLA REGLERNA FÖR SMÅFÖRETAG', cost: { pp: 10 }, temp: { unrest: -4, gdp: 2 }, tip: 'Blanketten krymper från tolv sidor till två.' },
      { text: 'BACKA TILL LIKA RÄTT I LAGEN UTAN KRAV', cost: { pp: 20 }, law: ['equality', 'legal'], temp: { unrest: -6, approval: 3, freedom: -2 }, tip: 'Kritikerna jublar. Kvinnoförbunden marscherar.' },
      { text: 'INFORMERA OM VAD LAGEN FAKTISKT SÄGER', cost: { money: 300 }, temp: { unrest: -3, ideopower: 2 }, tip: 'Ryktet om att staten vill förbjuda förkläden dementeras.' },
    ],
  },
  {
    id: 'sam_parental_leave', icon: '\u{1F37C}', weight: 2,
    title: 'PAPPORNA STANNAR PÅ JOBBET',
    text: 'Statistiken visar att mammorna tar nästan all föräldraledighet, och att det är därför deras löner och pensioner halkar efter. Samtidigt föds det färre barn än någonsin.',
    when: (c) => (c.ind.gii ?? 0.3) < 0.2 && (c.ind.fert ?? 2) < 1.7 && c.is('welfare', 'extreme', 'huge', 'coverage', 'balanced'),
    choices: [
      { text: 'ÖRONMÄRK TRE MÅNADER TILL VARDERA FÖRÄLDERN', cost: { money: 600 }, perm: { qol: 3, manpower: 2, hdi: 2 }, temp: { approval: -2 }, tip: 'Papporna klagar i två veckor. Sedan vill de inte gå tillbaka.' },
      { text: 'HÖJ FÖRÄLDRAPENNINGEN FÖR ALLA', cost: { money: 900 }, perm: { welfare: 3, manpower: 3 }, temp: { approval: 4 }, tip: 'Fler barn, kanske. Fler utgifter, säkert.' },
      { text: 'FAMILJERNA FÅR BESTÄMMA SJÄLVA', temp: { approval: 2 }, perm: { manpower: -2 }, tip: 'Valfrihet, som slutar likadant varje gång.' },
    ],
  },

  // ================= INVANDRING, ASYL & INTEGRATION =================
  {
    id: 'sam_points_system', icon: '\u{1F4CB}', weight: 2,
    title: 'ARBETSGIVARNA SKRIKER EFTER FOLK',
    text: 'Sjukhusen saknar sköterskor, byggena saknar ingenjörer och de lediga programmerarna går att räkna på ena handens fingrar. Näringslivet vill ha ett poängsystem som släpper in den som har rätt utbildning och ett jobb att gå till.',
    when: (c) => c.is('immigration', 'balanced', 'managed', 'restricted') && (c.ind.unemp ?? 6) < 5 && (c.ind.gdppc ?? 0) > 8000,
    choices: [
      { text: 'INFÖR ETT POÄNGSYSTEM FÖR INVANDRING', cost: { pp: 25 }, law: ['immigration', 'points'], perm: { gdp: 4, research: 3 }, temp: { approval: -2 }, tip: 'Sköterskorna kommer. Byråkraterna räknar poäng.' },
      { text: 'TILLFÄLLIGA ARBETSTILLSTÅND FÖR BRISTYRKEN', cost: { pp: 10 }, temp: { gdp: 3, immigration: 4, integration: -2 }, tip: 'De kommer, jobbar och får sedan veta att de ska åka hem.' },
      { text: 'UTBILDA DE EGNA I STÄLLET', cost: { money: 700 }, perm: { hdi: 2, research: 2 }, temp: { gdp: -2 }, tip: 'Rätt i längden. I längden har patienterna redan gått hem.' },
      { text: 'INGEN MER INVANDRING', temp: { gdp: -4, ideopower: 2 }, tip: 'Väntetiden på akuten blir en nationalsport.' },
    ],
  },
  {
    id: 'sam_humanitarian_demand', icon: '\u{1F91D}', weight: 2,
    title: 'KRAV PÅ EN HUMANARE ASYLPOLITIK',
    text: 'Efter en uppmärksammad utvisning av en familj som bott i landet i åtta år har hjälporganisationer, trossamfund och skolelever gått samman. De kräver att humanitära skäl ska väga tyngst i asylprövningen.',
    when: (c) => c.is('immigration', 'balanced', 'managed', 'restricted', 'points') && c.st.freedom > 15 && c.st.welfare > 0,
    choices: [
      { text: 'INFÖR EN HUMANITÄR ASYLLAG', cost: { pp: 25 }, law: ['immigration', 'humanitarian'], perm: { freedom: 3 }, temp: { immigration: 6, welfare: -3 }, rel: 8, tip: 'Familjen får stanna. Många fler kommer att söka.' },
      { text: 'LÅT FAMILJEN STANNA MEN BEHÅLL LAGEN', cost: { pp: 10 }, temp: { approval: 4 }, tip: 'Ett undantag är billigare än en reform.' },
      { text: 'TA EMOT FLER KVOTFLYKTINGAR VIA FN', cost: { money: 500 }, temp: { immigration: 4, integration: 2 }, rel: 6, tip: 'Rätt människor, i rätt ordning, med rätt papper.' },
      { text: 'LAGEN GÄLLER LIKA FÖR ALLA', temp: { approval: -3, freedom: -2 }, rel: -3, tip: 'Skoleleverna skriver brev. Varje dag.' },
    ],
  },
  {
    id: 'sam_asylum_chaos', icon: '\u{1F6A7}', weight: 2,
    title: 'KAOS PÅ MIGRATIONSVERKET',
    text: 'Asylansökningarna har tredubblats på ett halvår och väntetiden för ett besked är nu över två år. Förläggningarna är överfulla och ett tältläger växer upp utanför gränsstationen.',
    when: (c) => c.mod('border_crisis') || (c.is('immigration', 'noborders', 'open', 'humanitarian', 'relaxed') && c.st.immigration > 15),
    choices: [
      { text: 'ANSTÄLL TUSENTALS NYA HANDLÄGGARE', cost: { money: 800 }, unmod: 'border_crisis', temp: { integration: 4, unrest: -3 }, tip: 'Köerna krymper. Myndigheten blir landets största arbetsgivare.' },
      { text: 'STÄNG GRÄNSEN TILLFÄLLIGT', cost: { pp: 20 }, unmod: 'border_crisis', temp: { immigration: -10, freedom: -4 }, rel: -8, tip: 'Tältlägret flyttar till andra sidan gränsen.' },
      { text: 'LÅT SYSTEMET BETA AV KÖN I SIN TAKT', mod: 'border_crisis', temp: { unrest: 5, integration: -4 }, tip: 'Två års väntan är två år utan jobb.' },
    ],
  },
  {
    id: 'sam_language_queues', icon: '\u{1F4D6}', weight: 2,
    title: 'KÖERNA TILL SPRÅKKURSERNA',
    text: 'Tusentals nyanlända väntar på att få börja läsa landets språk, och utan språket får de inget jobb. Kommunerna säger att lärarna inte räcker och arbetsgivarna säger att de inte kan vänta.',
    when: (c) => c.st.immigration > 5 && c.st.integration < 0,
    choices: [
      { text: 'DUBBLA ANTALET SPRÅKLÄRARE', cost: { money: 600 }, perm: { integration: 6 }, temp: { gdp: 2 }, tip: 'Det tråkigaste svaret. Också det som fungerar.' },
      { text: 'SPRÅK PÅ JOBBET - STATEN BETALAR HALVA LÖNEN', cost: { money: 800 }, perm: { integration: 5, gdp: 2 }, temp: { unrest: -2 }, tip: 'Ordet för skiftnyckel lär man sig fortare än grammatiken.' },
      { text: 'DIGITAL SPRÅKSKOLA I MOBILEN', cost: { rp: 40 }, perm: { integration: 3 }, tip: 'Billigt, och bra för den som redan är motiverad.' },
      { text: 'KRAV PÅ SPRÅKTEST FÖR UPPEHÅLLSTILLSTÅND', perm: { integration: 2 }, temp: { freedom: -3, unrest: 3 }, tip: 'Samma kö, men nu med hot om utvisning.' },
    ],
  },
  {
    id: 'sam_village_refugees', icon: '\u{1F3E1}', weight: 2,
    title: 'BYN SOM VILL HA FLYKTINGAR',
    text: 'En avfolkningsbygd har fått sin skola, sin butik och sin vårdcentral räddade av nyanlända familjer. Nu vill tio grannkommuner göra likadant och ber staten om hjälp med bostäder.',
    when: (c) => (c.ind.urban ?? 60) > 65 && c.st.immigration > 0 && c.st.integration > -10,
    choices: [
      { text: 'STÖD BOSTADSBYGGET I GLESBYGDEN', cost: { money: 600 }, perm: { integration: 5, qol: 2 }, temp: { approval: 3 }, tip: 'Byns fotbollslag har plötsligt ett andralag.' },
      { text: 'GÖR DET TILL EN NATIONELL MODELL', cost: { money: 900, pp: 15 }, perm: { integration: 7, gdp: 2 }, temp: { unrest: 2 }, tip: 'Det som fungerar i en by fungerar i tio. Kanske.' },
      { text: 'LÅT KOMMUNERNA LÖSA DET SJÄLVA', temp: { integration: 2, approval: -2 }, tip: 'En by lyckas. Nio väntar på besked.' },
    ],
  },
  {
    id: 'sam_new_generation', icon: '\u{1F331}', weight: 2,
    title: 'DEN NYA GENERATIONEN TAR PLATS',
    text: 'Barnen till dem som kom hit för tjugo år sedan har blivit läkare, företagare och landslagsspelare. En av dem är nu landets populäraste programledare, och debatten handlar plötsligt om framgång i stället för problem.',
    when: (c) => c.st.integration > 20 && c.st.immigration > 0 && c.day > 300,
    choices: [
      { text: 'MENTORSPROGRAM SÅ ATT FLER FÖLJER EFTER', cost: { money: 400 }, perm: { integration: 4, hdi: 2 }, tip: 'Förebilder fungerar bättre än broschyrer.' },
      { text: 'LYFT FRAM DEM I DITT TAL TILL NATIONEN', cost: { pp: 10 }, temp: { integration: 4, approval: 3, ideopower: 2 }, tip: 'Ditt tal hamnar i läroböckerna.' },
      { text: 'INGET BEHÖVS - DET GÅR JU BRA', temp: { integration: 2, ideopower: -2 }, tip: 'Framgång kräver inget program. Nästa generation kanske gör det.' },
    ],
  },

  // ================= UNGDOMEN, SKOLAN & GENERATIONERNA =================
  {
    id: 'sam_pisa_drop', icon: '\u{1F4C9}', weight: 2,
    title: 'SKOLRESULTATEN RASAR',
    text: 'Den internationella kunskapsmätningen visar att landets femtonåringar har halkat ned till bottenskiktet i både läsning och matematik. Lärarförbundet skyller på lönerna, oppositionen skyller på dig.',
    when: (c) => (c.ind.edux ?? 4) < 4.5 && c.st.hdi < 0 && (c.ind.tertiary ?? 40) > 20,
    choices: [
      { text: 'HÖJ LÄRARLÖNERNA KRAFTIGT', cost: { money: 900 }, perm: { hdi: 3, research: 2 }, temp: { approval: 3 }, tip: 'De bästa studenterna börjar söka till lärarutbildningen igen.' },
      { text: 'MER PROV, BETYG OCH KONTROLL', cost: { pp: 15 }, perm: { hdi: 2 }, temp: { freedom: -2, qol: -2 }, tip: 'Eleverna lär sig provteknik. Kanske även något annat.' },
      { text: 'GE FRISKOLORNA FRIARE TYGLAR', cost: { pp: 10 }, temp: { gdp: 2, hdi: 2 }, perm: { corruption: 2 }, tip: 'Konkurrensen höjer kvaliteten. Och vinstmarginalerna.' },
      { text: 'MÄTNINGAR SÄGER INTE ALLT', temp: { approval: -4 }, perm: { hdi: -2 }, tip: 'Särskilt inte när de säger något obekvämt.' },
    ],
  },
  {
    id: 'sam_generation_gap', icon: '\u{1F474}', weight: 2,
    title: 'DE GAMLA MOT DE UNGA',
    text: 'Pensionärernas förbund kräver höjda pensioner, samtidigt som de unga inte har råd med en egen bostad. Det har blivit valets stora fråga, och debatten mellan generationerna är bitter.',
    when: (c) => (c.ind.old ?? 9) > 16 && ((c.ind.youthunemp ?? 14) > 12 || c.is('housing', 'market', 'deregulated', 'rentcontrol')),
    choices: [
      { text: 'HÖJ PENSIONERNA', cost: { money: 700 }, temp: { approval: 4, welfare: 3 }, perm: { income: -2 }, tip: 'Pensionärerna röstar. Det gör inte alltid de unga.' },
      { text: 'STORT BOSTADSPROGRAM FÖR UNGA', cost: { money: 900 }, perm: { qol: 3, manpower: 2 }, temp: { approval: 2 }, tip: 'Byggkranarna står över stan. Pensionärerna klagar på bullret.' },
      { text: 'FLYTTA SKATT FRÅN ARBETE TILL ÄRVDA FÖRMÖGENHETER', cost: { pp: 25 }, perm: { qol: 2 }, temp: { approval: -3, gdp: 2 }, tip: 'Ingen blir glad, men ingen blir bortglömd.' },
      { text: 'GENERATIONERNA FÅR TALA UT SJÄLVA', temp: { unrest: 4, approval: -2 }, tip: 'Familjemiddagarna blir kortare.' },
    ],
  },

  // ================= LANDSBYGD & TURISM =================
  {
    id: 'sam_rural_forgotten', icon: '\u{1F69C}', weight: 2,
    title: 'LANDSBYGDEN KÄNNER SIG BORTGLÖMD',
    text: 'Polisstationen, banken och den sista vårdcentralen har stängt i hundratals småorter. Bönder har kört sina traktorer till huvudstaden och kräver att de som bor utanför städerna också ska räknas.',
    when: (c) => (c.ind.urban ?? 60) > 50 && (c.ind.urban ?? 60) < 90 && c.st.approval < 0 && c.st.welfare < 15,
    choices: [
      { text: 'FLYTTA STATLIGA MYNDIGHETER TILL LANDSBYGDEN', cost: { money: 700 }, perm: { qol: 2, approval: 2 }, temp: { statepower: -3 }, tip: 'Tjänstemännen säger hellre upp sig än flyttar.' },
      { text: 'SERVICEPUNKTER I VARJE KOMMUN', cost: { money: 500 }, perm: { welfare: 2, qol: 2 }, temp: { approval: 3 }, tip: 'Apotek, post och bank vid samma disk.' },
      { text: 'SÄNKT BRÄNSLESKATT FÖR GLESBYGDEN', cost: { pp: 15 }, temp: { approval: 5, income: -3 }, tip: 'Traktorerna åker hem nöjda. Miljörörelsen gör det inte.' },
      { text: 'FRAMTIDEN FINNS I STÄDERNA', temp: { approval: -5, unrest: 4, gdp: 2 }, tip: 'Ekonomiskt rätt. Politiskt farligt.' },
    ],
  },
  {
    id: 'sam_overtourism', icon: '\u{1F9F3}', weight: 2,
    title: 'TURISTERNA HAR TAGIT ÖVER',
    text: 'Kryssningsfartygen lägger till fem åt gången och gamla stadens gränder är fyllda av turistgrupper. Hyrorna har stigit så att de som bor där inte längre har råd, och invånarna protesterar med vattenpistoler.',
    when: (c) => (c.ind.tourists ?? 0) > 8000000 || ((c.ind.tourists ?? 0) > 1500000 && (c.ind.pop ?? 1e7) < 2000000),
    choices: [
      { text: 'INFÖR EN TURISTSKATT PÅ VARJE ÖVERNATTNING', cost: { pp: 10 }, res: { money: 400 }, temp: { gdp: -2, approval: 2 }, tip: 'Turisterna betalar. De kommer ändå.' },
      { text: 'BEGRÄNSA KRYSSNINGSFARTYG OCH KORTTIDSUTHYRNING', cost: { pp: 15 }, perm: { qol: 3 }, temp: { gdp: -4, approval: 4 }, tip: 'Invånarna får tillbaka sin stad. Souvenirbutikerna stänger.' },
      { text: 'SPRID TURISTERNA TILL ANDRA DELAR AV LANDET', cost: { money: 500 }, temp: { gdp: 4, qol: 2 }, tip: 'Landsbygden får äntligen trafikstockningar.' },
      { text: 'TURISMEN BETALAR VÅRA LÖNER', temp: { gdp: 3, qol: -3, unrest: 3 }, tip: 'Vattenpistolerna blir fler.' },
    ],
  },
  {
    id: 'sam_tourism_campaign', icon: '\u{1F4F8}', weight: 2,
    title: 'INGEN VET VAR VI LIGGER',
    text: 'Landet har stränder, berg och ett kök i världsklass, men nästan inga utländska besökare. En reklambyrå föreslår en stor kampanj och turistnäringen vill dessutom ha visumfrihet och fler flyglinjer.',
    when: (c) => (c.ind.tourists ?? 1e6) < 500000 && c.st.safety > -10 && c.st.stability > -10,
    choices: [
      { text: 'STOR INTERNATIONELL REKLAMKAMPANJ', cost: { money: 500 }, temp: { gdp: 4, income: 2 }, rel: 4, tip: 'Filmen med solnedgången går viralt. Hotellen är inte klara.' },
      { text: 'VISUMFRIHET OCH NYA FLYGAVTAL', cost: { pp: 15 }, temp: { gdp: 5, safety: -2 }, rel: 6, tip: 'Turisterna kommer. Tullen får mer att göra.' },
      { text: 'SUBVENTIONERA NYA HOTELL', cost: { money: 800 }, perm: { gdp: 3, corruption: 2 }, tip: 'Byggherrarna är förtjusta. Flera av dem är släkt med någon.' },
      { text: 'VI ÄR NÖJDA MED ATT FÅ VARA IFRED', temp: { qol: 2, gdp: -2 }, tip: 'Stränderna förblir tomma. Och vackra.' },
    ],
  },

  // ================= LYCKA, NÄTET & KÄNDISAR =================
  {
    id: 'sam_happiest_country', icon: '\u{1F60A}', weight: 2,
    title: 'ETT AV VÄRLDENS LYCKLIGASTE LAND',
    text: 'Den årliga undersökningen om livskvalitet placerar ditt land bland de allra lyckligaste i världen. Utländska journalister vill förstå hemligheten och regeringskansliet får frågor om allt från fikaraster till föräldraledighet.',
    when: (c) => (c.ind.happiness ?? 5) > 6.6 && c.st.qol > -10,
    choices: [
      { text: 'BJUD IN VÄRLDEN TILL LYCKOTURISM OCH KONFERENSER', cost: { money: 400 }, temp: { gdp: 4 }, rel: 6, tip: 'Turisterna kommer för att titta på lyckliga människor.' },
      { text: 'INFÖR ETT NATIONELLT LYCKOMÅTT I BUDGETEN', cost: { pp: 15 }, perm: { qol: 3, welfare: 2 }, temp: { gdp: -2 }, tip: 'Finansdepartementet får börja mäta leenden.' },
      { text: 'TACKA OCH FORTSÄTT SOM VANLIGT', temp: { approval: 3, ideopower: -2 }, tip: 'Det bästa sättet att behålla en titel är att inte bry sig om den.' },
    ],
  },
  {
    id: 'sam_unhappy_nation', icon: '\u{1F327}\u{FE0F}', weight: 2,
    title: 'ETT OLYCKLIGT FOLK',
    text: 'Landet hamnar nära botten i den internationella mätningen av hur nöjda människor är med sina liv. Ensamhet, oro för framtiden och misstro mot myndigheterna toppar svaren.',
    when: (c) => (c.ind.happiness ?? 5.3) < 4.3 && c.st.qol < 10 && c.day > 60,
    choices: [
      { text: 'NATIONELL SATSNING PÅ PSYKISK HÄLSA', cost: { money: 600 }, perm: { qol: 3, hdi: 2 }, temp: { approval: 2 }, tip: 'Väntetiden till psykologen halveras. Den var lång.' },
      { text: 'BYGG MÖTESPLATSER: PARKER, BIBLIOTEK OCH IDROTTSHALLAR', cost: { money: 800 }, perm: { qol: 4 }, temp: { unrest: -3 }, tip: 'Lycka går inte att köpa. Fotbollsplaner går det.' },
      { text: 'MÄTNINGEN ÄR VINKLAD', temp: { ideopower: 2, approval: -3 }, tip: 'Folket håller inte med, vilket bevisar poängen.' },
    ],
  },
  {
    id: 'sam_viral_challenge', icon: '\u{1F4F1}', weight: 2,
    title: 'DEN FARLIGA UTMANINGEN',
    text: 'En utmaning som sprids i sociala medier får tonåringar att filma sig själva när de klättrar på tågvagnar och broräcken. Flera har hamnat på sjukhus och föräldrarna kräver att plattformarna stoppas.',
    when: (c) => (c.ind.internet ?? 0) > 75 && (c.ind.kids ?? 20) > 14 && c.st.safety < 0 && c.is('internet', 'free', 'open', 'filtered'),
    choices: [
      { text: 'TVINGA PLATTFORMARNA ATT TA BORT INNEHÅLLET', cost: { pp: 15 }, temp: { safety: 5, freedom: -3 }, rel: -2, tip: 'Bolagen lyder. Utmaningen flyttar till en ny app.' },
      { text: 'ÅLDERSGRÄNS FÖR SOCIALA MEDIER', cost: { pp: 20 }, perm: { qol: 2, safety: 2 }, temp: { freedom: -4 }, tip: 'Tolvåringarna lär sig ljuga om sin ålder på rekordtid.' },
      { text: 'INFORMATIONSKAMPANJ I SKOLORNA', cost: { money: 200 }, temp: { safety: 3 }, tip: 'Kampanjfilmen blir själv en utmaning. Det var inte meningen.' },
      { text: 'DET ÄR FÖRÄLDRARNAS ANSVAR', temp: { safety: -3, approval: -3 }, tip: 'Föräldrarna håller inte med.' },
    ],
  },
  {
    id: 'sam_celebrity_party', icon: '\u{2B50}', weight: 2,
    title: 'KÄNDISEN STARTAR ETT PARTI',
    text: 'Landets mest kända tv-profil har startat ett eget parti utan program men med fem miljoner följare. Opinionsmätningarna visar att det kan bli näst störst i nästa val.',
    when: (c) => c.is('elections', 'entirelyfree', 'free', 'mostlyfree', 'balanced') && c.st.approval < -5 && (c.ind.internet ?? 0) > 60,
    choices: [
      { text: 'BJUD IN KÄNDISEN TILL REGERINGEN', cost: { pp: 20 }, temp: { approval: 8, statepower: -4 }, perm: { corruption: 2 }, tip: 'Kulturdepartementet får sin första influencer.' },
      { text: 'GRANSKA PARTIETS FINANSIERING', cost: { pp: 15 }, temp: { approval: -2, freedom: -2 }, perm: { corruption: -2 }, tip: 'Allt är i ordning. Nästan.' },
      { text: 'TÄVLA PÅ DERAS VILLKOR - GÅ UT PÅ SOCIALA MEDIER', cost: { money: 300 }, temp: { approval: 5, ideopower: -3 }, tip: 'Din dansvideo får fler visningar än din budget.' },
      { text: 'IGNORERA DEM', temp: { approval: -4, stability: -2 }, tip: 'Partier utan program brukar ta slut. Ibland tar de makten först.' },
    ],
  },

  // ================= SYMBOLER, MINORITETER & SAMMANHÅLLNING =================
  {
    id: 'sam_new_flag', icon: '\u{1F6A9}', weight: 1, cooldown: 1500,
    title: 'EN NY FLAGGA?',
    text: 'En designtävling om en ny nationsflagga har fått hundratusentals bidrag. Förslaget som vann omröstningen på nätet är en tecknad katt, och historikerna har förklarat krig mot internet.',
    when: (c) => c.day > 200 && c.harmony < 0.5 && c.st.freedom > 0 && c.st.ideopower < 5,
    choices: [
      { text: 'BEHÅLL DEN GAMLA FLAGGAN', temp: { ideopower: 2, approval: -2 }, tip: 'Traditionen segrar. Katten blir ett skämt på nätet i stället.' },
      { text: 'ANTA EN NY FLAGGA RITAD AV EXPERTER', cost: { money: 300, pp: 10 }, temp: { ideopower: 4, unrest: 3 }, tip: 'En stilren flagga som ingen kan rita ur minnet.' },
      { text: 'KATTEN VANN. KATTEN BLIR FLAGGA.', cost: { pp: 20 }, temp: { approval: 6, freedom: 3, ideopower: -5 }, rel: 4, tip: 'Världen skrattar med er. Och ganska mycket åt er.' },
    ],
  },
  {
    id: 'sam_indigenous_land', icon: '\u{1F98C}', weight: 2,
    title: 'URFOLKETS MARK',
    text: 'Ett gruvbolag har fått tillstånd att bryta metall på mark där urfolket i norr har haft sina betesmarker i tusen år. Ursprungsbefolkningen har gått till domstol och protestlägret växer.',
    when: (c) => (c.ind.area ?? 0) > 150000 && (c.ind.forest ?? 0) > 20 && !c.is('culture', 'mono') && c.day > 120,
    choices: [
      { text: 'STOPPA GRUVAN OCH ERKÄNN MARKRÄTTEN', cost: { pp: 20 }, perm: { freedom: 3, integration: 4 }, temp: { factory: -4, gdp: -2 }, rel: 6, tip: 'Metallen ligger kvar. Renarna också.' },
      { text: 'TVINGA FRAM ETT AVTAL MED VINSTDELNING', cost: { money: 400 }, temp: { factory: 3, integration: 2, unrest: -2 }, tip: 'Ingen är nöjd, vilket är kännetecknet på en kompromiss.' },
      { text: 'GRUVAN ÄR AV NATIONELLT INTRESSE', temp: { factory: 5, gdp: 3, unrest: 4 }, perm: { integration: -3 }, rel: -5, tip: 'Gruvan får sin metall. Staten får en granskning från FN.' },
    ],
  },
  {
    id: 'sam_national_dialogue', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'LANDET HAR SLUTAT LYSSNA PÅ VARANDRA',
    text: 'Efter månader av demonstrationer och motdemonstrationer föreslår trossamfund, fack och näringsliv en nationell dialog. Alla parter ska sitta vid samma bord tills de har kommit överens om något.',
    when: (c) => c.st.unrest > 15 && c.harmony < 0.5 && !c.mod('civil_peace'),
    choices: [
      { text: 'LED DIALOGEN PERSONLIGEN', cost: { pp: 30 }, temp: { unrest: -14, approval: 4, statepower: -3 }, tip: 'Månader av möten. Sedan ett handslag som alla minns.' },
      { text: 'LÅT EN NEUTRAL MEDLARE LEDA SAMTALEN', cost: { money: 400 }, temp: { unrest: -8, approval: 2 }, tip: 'Medlaren får äran. Du får lugnet.' },
      { text: 'DIALOG MED VEM? VI VANN VALET', temp: { unrest: 6, ideopower: 3 }, tip: 'Gatorna hörs ända in i regeringskansliet.' },
    ],
  },
  {
    id: 'sam_peace_tested', icon: '\u{1F6E1}\u{FE0F}', weight: 2,
    title: 'SAMHÄLLSFREDEN SÄTTS PÅ PROV',
    text: 'Landet har inte sett ett upplopp på många år. Nu har en liten extremistisk grupp fått tillstånd att marschera genom huvudstaden, och tusentals planerar en motdemonstration samma dag.',
    when: (c) => (c.mod('civil_peace') && c.st.unrest < -10) || c.st.unrest < -35,
    choices: [
      { text: 'LÅT BÅDA SIDOR DEMONSTRERA MED STORT POLISUPPBÅD', cost: { money: 300 }, temp: { safety: 3, freedom: 2 }, tip: 'Två tåg, tre rader kravallstaket och en lång dag för polisen.' },
      { text: 'DRA IN TILLSTÅNDET', cost: { pp: 10 }, temp: { freedom: -4, unrest: -2 }, tip: 'Gruppen får mer uppmärksamhet av förbudet än av marschen.' },
      { text: 'ORDNA EN STOR FOLKFEST PÅ ANDRA SIDAN STAN', cost: { money: 400 }, temp: { unrest: -5, integration: 3, approval: 3 }, tip: 'Marschen går genom tomma gator. Festen fyller torget.' },
      { text: 'LÅT DET HA SIN GÅNG', temp: { unrest: 7, safety: -3 }, tip: 'Freden har klarat värre. Kanske.' },
    ],
  },
  {
    id: 'sam_unity_after_disaster', icon: '\u{2764}\u{FE0F}', weight: 2,
    title: 'LANDET SLUTER UPP',
    text: 'Efter katastrofen strömmar frivilliga till de drabbade orterna från hela landet. Främlingar öppnar sina hem, företag skänker förnödenheter och de politiska grälen har tystnat, åtminstone för en tid.',
    when: (c) => (c.mod('natural_disaster') || c.mod('epidemic')) && c.st.stability > -20,
    choices: [
      { text: 'RES ETT MINNESMONUMENT OCH HYLLA DE FRIVILLIGA', cost: { money: 400 }, mod: 'national_unity', tip: 'Monumentet blir platsen där landet samlas varje år.' },
      { text: 'GÖR DE FRIVILLIGA TILL EN PERMANENT BEREDSKAPSKÅR', cost: { money: 600, man: 5 }, perm: { safety: 4 }, temp: { approval: 3 }, tip: 'Nästa gång finns de redan på plats.' },
      { text: 'TACKA OCH ÅTERGÅ TILL VARDAGEN', temp: { approval: 2, stability: 2 }, tip: 'Sammanhållningen bleknar. Minnet stannar.' },
    ],
  },
];
