// IMPERIUM V5.8 — HÄNDELSER: NYA LAGAR, KALLA KRIG & REVOLUTIONER.
// De sex lagarna från V5.7 (alkohol, transport, jordbruk, medborgarskap, barnomsorg, polis) och livet i ett kallt krig och en värld där regimer faller.
export const EVENTS = [

  // ================= ALKOHOLPOLITIK =================
  {
    id: 'kk_alk_spritbatar', icon: '\u{1F6A4}', weight: 2,
    title: 'SPRITBÅTARNA LÄGGER TILL I NATT',
    text: 'Sedan spriten blev nästan omöjlig att köpa lagligt går snabba motorbåtar varje natt över från grannlandet, lastade med dunkar och lådor. I kustbyarna vet alla vem som hämtar lasten, och flera av tullarna har köpt nya bilar.',
    when: (c) => c.is('alcohol_policy', 'prohibition', 'restricted') && c.st.corruption > -20,
    choices: [
      { text: 'RUSTA KUSTBEVAKNINGEN MED SNABBA BÅTAR', cost: { money: 600 }, temp: { safety: 5 }, perm: { corruption: -3 }, tip: 'Smugglarna köper snabbare båtar. Kapprustning till sjöss.' },
      { text: 'GÖR RAZZIA MOT TULLEN FÖRST', cost: { pp: 20 }, perm: { corruption: -6 }, temp: { stability: -4, statepower: 3 }, tip: 'Svårt att stoppa båtarna när de som ska stoppa dem står och vinkar.' },
      { text: 'TILLÅT LAGLIG FÖRSÄLJNING IGEN', law: ['alcohol_policy', 'regulated'], temp: { approval: 6, safety: -3 }, tip: 'Smugglarna blir grossister över en natt.' },
    ],
  },
  {
    id: 'kk_alk_hembrant', icon: '\u{2697}\u{FE0F}', weight: 2,
    title: 'HEMBRÄNT GJORDE ETT HELT KVARTER SJUKT',
    text: 'Över hundra personer har förts till sjukhus efter att ha druckit hembränd sprit från samma källare. Läkarna misstänker träsprit, och flera av de drabbade riskerar att förlora synen.',
    when: (c) => c.is('alcohol_policy', 'prohibition') || (c.is('alcohol_policy', 'restricted') && c.st.qol < 0),
    choices: [
      { text: 'GRATIS BEHANDLING OCH VARNINGAR I ALLA KANALER', cost: { money: 400 }, temp: { approval: 4, qol: 3 }, tip: 'Sjukhusen hinner med. Hembrännarna gör det också.' },
      { text: 'HÅRDARE STRAFF FÖR HEMBRÄNNING', cost: { pp: 15 }, temp: { safety: 4, freedom: -4, unrest: 3 }, tip: 'Pannorna flyttar längre in i skogen.' },
      { text: 'LÅT STATENS BUTIKER SÄLJA RIKTIG SPRIT IGEN', law: ['alcohol_policy', 'monopoly'], temp: { qol: 3, ideopower: -3 }, tip: 'Statens flaskor är dyra, men man ser i alla fall klart efteråt.' },
    ],
  },
  {
    id: 'kk_alk_monopol_handel', icon: '\u{1F3EA}', weight: 2,
    title: 'HANDELSPARTNERNA VILL KNÄCKA MONOPOLET',
    text: 'Dina största handelspartner kallar statens spritmonopol för ett dolt handelshinder. Om butikerna inte öppnas för utländska bryggerier och vinhandlare hotar de med tullar på er export.',
    when: (c) => c.is('alcohol_policy', 'monopoly') && c.is('globalism', 'union', 'major', 'big', 'partner', 'balanced'),
    choices: [
      { text: 'FÖRSVARA MONOPOLET I HANDELSDOMSTOLEN', cost: { pp: 20, money: 300 }, temp: { qol: 3, ideopower: 3 }, rel: -6, tip: 'Juristerna vinner tid. Folkhälsan vinner ett par år.' },
      { text: 'AVSKAFFA MONOPOLET OCH SÄLJ BUTIKERNA', law: ['alcohol_policy', 'licensed'], res: { money: 500 }, temp: { qol: -3 }, rel: 8, tip: 'Butikerna säljs en gång. Kostnaderna kommer varje helg.' },
      { text: 'LÅT UTLÄNDSKA VINER SÄLJAS I MONOPOLETS BUTIKER', cost: { pp: 10 }, temp: { income: -2 }, rel: 4, tip: 'En kompromiss som ingen gillar men alla kan leva med.' },
    ],
  },
  {
    id: 'kk_alk_olreklam', icon: '\u{1F37A}', weight: 2,
    title: 'ÖLREKLAM PÅ BARNENS FOTBOLLSTRÖJOR',
    text: 'Sedan alkoholreglerna släpptes sponsrar bryggerierna allt från knattelag till skolfester, och deras loggor syns på tioåringarnas matchtröjor. Barnläkarna är upprörda, men klubbarna säger att de inte klarar sig utan pengarna.',
    when: (c) => c.is('alcohol_policy', 'free', 'licensed') && c.st.qol < 30,
    choices: [
      { text: 'FÖRBJUD ALL ALKOHOLREKLAM', cost: { pp: 15 }, temp: { qol: 3, freedom: -2, approval: 2 }, tip: 'Klubbarna får leta nya sponsorer. Snabbmatskedjorna står redan i kö.' },
      { text: 'STATEN SPONSRAR UNGDOMSIDROTTEN I STÄLLET', cost: { money: 400 }, temp: { qol: 4, approval: 4 }, tip: 'Tröjorna får statens vapen. Ingen tioåring vill ha den tröjan.' },
      { text: 'LÅT KLUBBARNA BESTÄMMA SJÄLVA', temp: { income: 2, qol: -3 }, tip: 'Marknaden har talat, med skum på läppen.' },
    ],
  },
  {
    id: 'kk_alk_nykterhet', icon: '\u{1F4E3}', weight: 2,
    title: 'NYKTERHETSRÖRELSEN VILL HA TOTALFÖRBUD',
    text: 'Landets nykterhetsföreningar har samlat en halv miljon namnunderskrifter för ett totalförbud mot alkohol. De pekar på misshandeln, trafikolyckorna och de trasiga familjerna, och kräver en folkomröstning.',
    when: (c) => (c.ind.alcohol ?? 5) > 7 && !c.is('alcohol_policy', 'prohibition', 'restricted') && (c.st.qol < 0 || c.is('religion', 'established', 'statereligion', 'religiouslaw') || ['theocracy', 'christdem'].includes(c.ideo)),
    choices: [
      { text: 'HÅLL FOLKOMRÖSTNING — OCH FÖLJ SVARET', cost: { pp: 20 }, law: ['alcohol_policy', 'prohibition'], temp: { safety: 3, approval: -4 }, tip: 'Ja-sidan vinner knappt. Smugglarna firar med något de inte får sälja.' },
      { text: 'KOMPROMISS: ETT STATLIGT MONOPOL', cost: { pp: 10 }, law: ['alcohol_policy', 'monopoly'], temp: { qol: 2 }, tip: 'Ingen fick som de ville, så det är förmodligen rätt.' },
      { text: 'AVVISA KRAVET', temp: { approval: -3, freedom: 2 }, tip: 'Föreningarna lovar att komma tillbaka. Det brukar de göra.' },
    ],
  },

  // ================= TRANSPORT =================
  {
    id: 'kk_tra_trangselskatt', icon: '\u{1F697}', weight: 2,
    title: 'BILKÖERNA RÄCKER TILL GRANNSTADEN',
    text: 'Det tar en och en halv timme att köra in till huvudstaden en vanlig morgon, och luften i innerstan är den sämsta på decennier. Trafikverket föreslår en trängselskatt för varje bil som passerar stadsgränsen.',
    when: (c) => c.is('transport', 'mixed', 'roads', 'carnation') && (c.ind.urban ?? 60) > 70 && c.st.qol < 20,
    choices: [
      { text: 'INFÖR TRÄNGSELSKATT', res: { money: 400 }, temp: { approval: -6, qol: 4 }, tip: 'Hatad första året. Efter fem år vill ingen ta bort den.' },
      { text: 'BYGG EN RINGLED RUNT STADEN', cost: { money: 900 }, temp: { gdp: 4, factory: 3, qol: -2 }, tip: 'Köerna försvinner i tre år. Sedan har bilisterna hittat ringleden.' },
      { text: 'SATSA PÅ PENDELTÅG I STÄLLET', cost: { money: 700, pp: 10 }, law: ['transport', 'transitfirst'], temp: { qol: 3 }, tip: 'Tåget är snabbare. Det kommer bara inte förrän om sju år.' },
    ],
  },
  {
    id: 'kk_tra_gratisbussar', icon: '\u{1F68C}', weight: 2,
    title: 'GRATISBUSSARNA ÄR PROPPFULLA',
    text: 'Sedan kollektivtrafiken blev gratis har resandet ökat med en tredjedel. Pendlarna står tätt som sillar i rusningstid, och vagnparken är för gammal för att klara trycket.',
    when: (c) => c.is('transport', 'freetransit') && c.st.income < 40,
    choices: [
      { text: 'KÖP NYA TÅG OCH BUSSAR', cost: { money: 900 }, temp: { qol: 5, approval: 4 }, tip: 'Dyrt, men det är vad gratis kostar.' },
      { text: 'INFÖR EN LITEN AVGIFT IGEN', law: ['transport', 'transitfirst'], res: { money: 300 }, temp: { approval: -5 }, tip: 'En symbolisk avgift med en ganska verklig ilska.' },
      { text: 'GLES UT TURERNA PÅ LANDSBYGDEN', temp: { qol: 2, stability: -3, approval: -2 }, tip: 'Staden får bussarna. Byarna får en tidtabell med stora luckor.' },
    ],
  },
  {
    id: 'kk_tra_snabbtag', icon: '\u{1F684}', weight: 2,
    title: 'SNABBTÅGSBANAN KOSTAR DET DUBBLA',
    text: 'Den nya snabbtågsbanan mellan landets största städer skulle stå klar om fem år. Nu säger konsulterna att den blir dubbelt så dyr och sju år sen, och halva sträckan har ännu inte fått sina tillstånd.',
    when: (c) => c.is('transport', 'transitfirst', 'freetransit') && c.st.income < 20,
    choices: [
      { text: 'BYGG FÄRDIGT, VAD DET ÄN KOSTAR', cost: { money: 1200 }, perm: { gdp: 4, qol: 3 }, tip: 'Om trettio år minns ingen notan. Om tre år minns alla den.' },
      { text: 'BYGG BARA DEN FÖRSTA ETAPPEN', cost: { money: 500 }, perm: { gdp: 2 }, temp: { approval: -2 }, tip: 'Ett snabbtåg till ingenstans, men ett snabbt sådant.' },
      { text: 'LÄGG NER PROJEKTET', perm: { income: 2 }, temp: { approval: -5, factory: -3 }, tip: 'De halvfärdiga broarna blir turistmål.' },
    ],
  },
  {
    id: 'kk_tra_vagtullar', icon: '\u{1F69A}', weight: 2,
    title: 'LASTBILARNA BLOCKERAR TULLSTATIONERNA',
    text: 'Åkerierna har ställt hundratals lastbilar tvärs över motorvägarna i protest mot de privata vägbolagens avgifter. Butikerna börjar få slut på färskvaror, och bolagen vägrar sänka priset.',
    when: (c) => c.is('transport', 'private') && c.st.unrest > -20,
    choices: [
      { text: 'KÖP TILLBAKA DE VIKTIGASTE VÄGARNA', cost: { money: 1000 }, law: ['transport', 'roads'], temp: { approval: 6, unrest: -5 }, tip: 'Staten äger vägarna igen. Och underhållet.' },
      { text: 'TAKPRIS PÅ AVGIFTERNA', cost: { pp: 20 }, temp: { unrest: -4, income: -3 }, rel: -3, tip: 'Bolagens utländska ägare ringer sina ambassader.' },
      { text: 'LÅT POLISEN FLYTTA LASTBILARNA', temp: { unrest: 6, approval: -4, safety: 2 }, tip: 'Vägen blir fri. Ilskan hittar en annan väg.' },
    ],
  },
  {
    id: 'kk_tra_trafikdod', icon: '\u{1F6A7}', weight: 2,
    title: 'TRAFIKDÖDEN HAR SLAGIT NYTT REKORD',
    text: 'Fler än någonsin har omkommit på vägarna i år. Vägarna byggs för fart, rattfyllan är vanlig och få bilar skulle klara en besiktning, men bilklubbarna vill inte höra talas om lägre hastigheter.',
    when: (c) => c.is('transport', 'carnation', 'roads', 'mixed') && (c.ind.traffic ?? 13) > 20,
    choices: [
      { text: 'NOLLVISION: MITTRÄCKEN, KAMEROR OCH BESIKTNING', cost: { money: 700 }, perm: { safety: 5 }, temp: { approval: -2 }, tip: 'Tråkiga vägar räddar liv. Det är hela poängen.' },
      { text: 'SÄNK HASTIGHETERNA ÖVERALLT', cost: { pp: 15 }, temp: { safety: 5, gdp: -2, approval: -4 }, tip: 'Alla kommer fram lite senare. Fler kommer fram.' },
      { text: 'FÖRARNA FÅR TA ANSVAR SJÄLVA', temp: { safety: -3, freedom: 2 }, tip: 'Friheten bakom ratten har ett pris. Det betalas oftast av andra.' },
    ],
  },

  // ================= JORDBRUK =================
  {
    id: 'kk_jor_traktorer', icon: '\u{1F69C}', weight: 2,
    title: 'TRAKTORERNA RULLAR IN I HUVUDSTADEN',
    text: 'Tusentals bönder har kört sina traktorer till regeringskvarteret och tippat gödsel utanför jordbruksministeriet. De säger att nya miljöregler, billig import och dyr diesel gör det omöjligt att leva på jorden.',
    when: (c) => c.is('agriculture', 'freemarket', 'organic', 'balanced') && c.st.unrest > 10 && (c.ind.agri ?? 5) > 1.5 && c.st.approval < 30,
    choices: [
      { text: 'SÄNK DIESELSKATTEN FÖR JORDBRUKET', cost: { money: 500 }, temp: { unrest: -6, approval: 4 }, tip: 'Bönderna kör hem. Miljöministern går hem tidigt.' },
      { text: 'INFÖR STORA JORDBRUKSSTÖD', cost: { pp: 20 }, law: ['agriculture', 'subsidized'], temp: { unrest: -8 }, tip: 'Landsbygden är räddad. Budgeten har fått en trogen utgiftspost.' },
      { text: 'STÅ FAST VID REFORMERNA', temp: { unrest: 6, approval: -4, gdp: 2 }, tip: 'Gödseln städas bort. Missnöjet stannar kvar.' },
    ],
  },
  {
    id: 'kk_jor_kollektiv_kvot', icon: '\u{1F33E}', weight: 2,
    title: 'KOLLEKTIVEN HAR MISSAT SKÖRDEKVOTEN',
    text: 'Planen krävde rekordskörd men kollektivjordbruken levererade knappt två tredjedelar. Brödköerna växer i städerna, och rapporterna från landsbygden talar om traktorer utan reservdelar och arbetare som slutat bry sig.',
    when: (c) => c.is('agriculture', 'collective'),
    choices: [
      { text: 'KÖP SPANNMÅL FRÅN UTLANDET', cost: { money: 800 }, temp: { unrest: -5, ideopower: -4 }, tip: 'Brödet kommer från fienden. Det smakar likadant.' },
      { text: 'LÅT VARJE FAMILJ ODLA EN EGEN TÄPPA', temp: { qol: 5, gdp: 3, ideopower: -6 }, tip: 'Täpporna är en procent av jorden och ger en fjärdedel av maten.' },
      { text: 'SKYLL PÅ SABOTÖRER OCH SKÄRP KVOTERNA', cost: { pp: 15 }, temp: { statepower: 5, unrest: 6, freedom: -5 }, perm: { gdp: -2 }, tip: 'Skyldiga går alltid att hitta. Säd gör det inte.' },
      { text: 'AVVECKLA KOLLEKTIVEN', cost: { pp: 30 }, law: ['agriculture', 'balanced'], temp: { stability: -5 }, tip: 'Jorden går tillbaka till bönderna, och bönderna tillbaka till arbetet.' },
    ],
  },
  {
    id: 'kk_jor_ekologisk', icon: '\u{1F955}', weight: 2,
    title: 'DEN EKOLOGISKA MATEN BLEV DYR',
    text: 'Två år efter omställningen till ekologiskt jordbruk är åarna renare och fåglarna tillbaka, men skördarna har sjunkit med en femtedel. Matpriserna stiger snabbare än lönerna och lågprisbutikerna fylls av importvaror.',
    when: (c) => c.is('agriculture', 'organic') && (c.ind.infl ?? 3) > 1,
    choices: [
      { text: 'MATCHECKAR TILL HUSHÅLL MED LÅGA INKOMSTER', cost: { money: 600 }, temp: { welfare: 4, approval: 3 }, tip: 'Ekologiskt för alla, på statens bekostnad.' },
      { text: 'TILLÅT KONSTGÖDSEL IGEN', law: ['agriculture', 'balanced'], temp: { qol: -3, gdp: 3 }, tip: 'Skördarna kommer tillbaka. Algerna i sjöarna också.' },
      { text: 'HÅLL FAST VID OMSTÄLLNINGEN', perm: { qol: 2 }, temp: { approval: -5, unrest: 3 }, tip: 'Jorden mår bättre. Plånböckerna gör det inte.' },
    ],
  },
  {
    id: 'kk_jor_golfbana', icon: '\u{1F4B8}', weight: 2,
    title: 'JORDBRUKSSTÖDET GICK TILL EN GOLFBANA',
    text: 'En granskning visar att de största jordbruksbidragen inte går till bönder utan till godsägare, banker och en golfklubb som klassar sina greener som betesmark. Småbönderna får smulorna.',
    when: (c) => c.is('agriculture', 'subsidized') && c.st.corruption > -20,
    choices: [
      { text: 'TAK FÖR STÖDET PER MOTTAGARE', cost: { pp: 20 }, perm: { corruption: -4 }, temp: { approval: 4 }, tip: 'Godsägarna delar upp sina gods på kusinerna. Det tar dem ett år.' },
      { text: 'GÖR OM STÖDET TILL MILJÖERSÄTTNING', cost: { pp: 15 }, law: ['agriculture', 'organic'], temp: { qol: 2 }, tip: 'Pengarna går nu till den som har blommor på ängen.' },
      { text: 'KRÄV TILLBAKA PENGARNA', res: { money: 400 }, temp: { stability: -4, approval: 3 }, tip: 'Advokaterna blir rikare än golfklubben någonsin var.' },
    ],
  },
  {
    id: 'kk_jor_jordkop', icon: '\u{1F5FA}\u{FE0F}', weight: 2,
    title: 'ETT UTLÄNDSKT BOLAG VILL KÖPA JORDEN',
    text: 'Ett utländskt jordbruksbolag vill köpa ett område stort som en hel provins för att odla soja och palmolja för export. Byarna där har brukat jorden i generationer men saknar papper på det.',
    when: (c) => c.is('agriculture', 'agribusiness', 'freemarket') && (c.ind.agri ?? 5) > 5,
    choices: [
      { text: 'SÄLJ OCH TA EMOT INVESTERINGEN', res: { money: 900 }, mod: 'foreign_investment', temp: { unrest: 8, qol: -3 }, tip: 'Exporten växer. Byborna blir lantarbetare på sin egen mark.' },
      { text: 'ARRENDERA UT JORDEN I TRETTIO ÅR', res: { money: 400 }, temp: { gdp: 3, unrest: 3 }, tip: 'Halva pengarna, halva problemen. Kanske.' },
      { text: 'GE BYARNA LAGFART PÅ SIN MARK', cost: { money: 300, pp: 15 }, perm: { freedom: 3 }, temp: { approval: 5 }, rel: -4, tip: 'Lantmätarna jobbar i ett år. Bolaget letar efter ett annat land.' },
    ],
  },

  // ================= MEDBORGARSKAP =================
  {
    id: 'kk_med_provet', icon: '\u{1F4DD}', weight: 2,
    title: 'MEDBORGARSKAPSPROVET ÄR FÖR SVÅRT',
    text: 'En tidning lät hundra infödda parlamentsledamöter skriva det nya medborgarskapsprovet. Mer än hälften blev underkända på frågor om gamla fältslag, grundlagsparagrafer och nationalträdets latinska namn.',
    when: (c) => c.is('citizenship', 'testsoath'),
    choices: [
      { text: 'SKRIV OM PROVET SÅ ATT DET MÄTER VARDAGSKUNSKAP', cost: { pp: 10 }, temp: { integration: 4, approval: 2 }, tip: 'Nu frågar provet om sopsortering och hyresavtal. Mer användbart.' },
      { text: 'BEHÅLL PROVET — DET SKA VARA SVÅRT', temp: { ideopower: 4, integration: -3, approval: -2 }, tip: 'Ledamöterna får plugga till nästa år.' },
      { text: 'GÖR PROVET OBLIGATORISKT FÖR ALLA SKOLBARN', cost: { money: 300 }, perm: { integration: 2 }, temp: { approval: -3 }, tip: 'Niondeklassarna har fått ett nytt hatämne.' },
    ],
  },
  {
    id: 'kk_med_ceremoni', icon: '\u{1F389}', weight: 2,
    title: 'TIOTUSEN NYA MEDBORGARE PÅ EN DAG',
    text: 'Tack vare de enkla reglerna blir rekordmånga nya medborgare i år. Kommunerna föreslår en stor ceremoni på nationaldagen med tal, flaggor och tårta, men en del tycker att medborgarskapet har blivit för billigt.',
    when: (c) => c.is('citizenship', 'easy', 'birthright') && c.st.integration > -10,
    choices: [
      { text: 'STOR CEREMONI PÅ NATIONALDAGEN', cost: { money: 300 }, temp: { integration: 6, approval: 3 }, tip: 'Folk gråter av glädje. Tårtan räcker inte.' },
      { text: 'INFÖR EN ED OCH ETT SPRÅKPROV', cost: { pp: 15 }, law: ['citizenship', 'testsoath'], temp: { ideopower: 3 }, tip: 'Medborgarskapet blir svårare att få och lättare att vara stolt över.' },
      { text: 'SKICKA BEVISEN MED POSTEN SOM VANLIGT', temp: { integration: -2, income: 2 }, tip: 'Ett kuvert, en blankett, grattis.' },
    ],
  },
  {
    id: 'kk_med_statslosa', icon: '\u{1FAAA}', weight: 2,
    title: 'STATSLÖSA I TREDJE GENERATIONEN',
    text: 'Över hundratusen människor som är födda och uppvuxna i landet saknar medborgarskap eftersom deras farföräldrar kom från ett annat land. De kan inte rösta, inte få pass och inte bli lärare eller poliser.',
    when: (c) => c.is('citizenship', 'bloodline') || (c.is('citizenship', 'standard') && c.st.integration < -30),
    choices: [
      { text: 'MEDBORGARSKAP TILL ALLA SOM ÄR FÖDDA HÄR', cost: { pp: 25 }, law: ['citizenship', 'birthright'], temp: { ideopower: -4 }, tip: 'Hundratusen nya väljare. Oppositionen räknar redan på hur de röstar.' },
      { text: 'ETT SÄRSKILT UPPEHÅLLSKORT', cost: { money: 300 }, temp: { integration: 3, freedom: 2 }, tip: 'Ett papper som säger att de får finnas. Ett steg.' },
      { text: 'REGLERNA ÄR REGLERNA', temp: { integration: -4, unrest: 4, ideopower: 3 }, tip: 'Deras barn blir statslösa i fjärde generationen.' },
    ],
  },
  {
    id: 'kk_med_passet', icon: '\u{1F6C2}', weight: 2,
    title: 'LANDSLAGSSTJÄRNAN FÖRLORAR SITT PASS',
    text: 'Landets mest kända fotbollsspelare kritiserade regeringen i en intervju och har nu fått beskedet att hon inte längre är medborgare enligt lojalitetslagen. Hon är mitt i en landskamp utomlands och kan inte resa hem.',
    when: (c) => c.is('citizenship', 'loyalty'),
    choices: [
      { text: 'STÅ FAST — INGEN ÄR STÖRRE ÄN STATEN', temp: { statepower: 5, approval: -6, unrest: 4 }, rel: -5, tip: 'Landslaget förlorar sin bästa spelare och sin publik.' },
      { text: 'GE TILLBAKA PASSET MOT EN OFFENTLIG URSÄKT', cost: { pp: 15 }, temp: { statepower: 2, approval: -2 }, tip: 'Hon ber om ursäkt. Ingen tror att hon menar det.' },
      { text: 'AVSKAFFA LOJALITETSLAGEN', cost: { pp: 30 }, law: ['citizenship', 'standard'], temp: { freedom: 5, approval: 5, statepower: -5 }, tip: 'Tusentals ansökningar om att få tillbaka sina pass kommer samma dag.' },
    ],
  },
  {
    id: 'kk_med_guldpass', icon: '\u{1F48E}', weight: 2,
    title: 'PASS TILL SALU FÖR RIKA UTLÄNNINGAR',
    text: 'Finansministeriet föreslår ett gyllene pass: den som investerar en stor summa i landet får medborgarskap utan krav på att bo här. Flera små länder tjänar bra på det, men grannländerna varnar för penningtvätt.',
    when: (c) => c.is('citizenship', 'standard', 'easy', 'testsoath') && c.st.income < -20,
    choices: [
      { text: 'SÄLJ PASSEN', res: { money: 1000 }, perm: { corruption: 5 }, rel: -8, tip: 'Kassan fylls. Köparna är inte alltid sådana man vill ha på middag.' },
      { text: 'SÄLJ PASSEN MED NOGGRANN BAKGRUNDSKOLL', cost: { pp: 15 }, res: { money: 500 }, perm: { corruption: 2 }, tip: 'Hälften så många köpare, hälften så många skandaler.' },
      { text: 'MEDBORGARSKAP SÄLJS INTE', temp: { ideopower: 3, approval: 2 }, tip: 'Principfast och fortfarande lika pank.' },
    ],
  },

  // ================= BARNOMSORG =================
  {
    id: 'kk_barn_forskolekon', icon: '\u{1F9F8}', weight: 2,
    title: 'RÄTT TILL FÖRSKOLA — MEN INGA PLATSER',
    text: 'Lagen lovar alla barn en förskoleplats inom fyra månader, men i de växande förorterna är kön över ett år. Föräldrar som inte kan gå tillbaka till jobbet har börjat stämma kommunerna.',
    when: (c) => c.is('childcare', 'free', 'subsidized') && c.st.income < 10,
    choices: [
      { text: 'BYGG FÖRSKOLOR I REKORDTAKT', cost: { money: 800 }, temp: { approval: 5, welfare: 3 }, tip: 'Paviljonger på parkeringsplatser. Inte vackert, men varmt.' },
      { text: 'STÖRRE BARNGRUPPER I DE FÖRSKOLOR SOM FINNS', temp: { welfare: -3, qol: -2 }, tip: 'Pedagogerna räknar huvuden hela dagen och kommer alltid fram till olika svar.' },
      { text: 'BETALA FÖRÄLDRAR SOM VÄNTAR', cost: { money: 400 }, temp: { approval: 3, gdp: -2 }, tip: 'Kön blir inte kortare, bara mindre arg.' },
    ],
  },
  {
    id: 'kk_barn_forskollarare', icon: '\u{1F476}', weight: 2,
    title: 'FÖRSKOLLÄRARNA LÄMNAR YRKET',
    text: 'Var femte förskollärare har sagt upp sig på två år. De som är kvar har grupper på över tjugo barn och vikarier som byts varje vecka, och facket varslar om strejk om inte lönerna och grupperna förändras.',
    when: (c) => c.is('childcare', 'free', 'subsidized', 'mixed') && c.st.welfare < -10 && c.st.unrest > 0,
    choices: [
      { text: 'HÖJ LÖNERNA OCH HALVERA BARNGRUPPERNA', cost: { money: 900 }, perm: { welfare: 4 }, temp: { approval: 4 }, tip: 'Rätt svar och dyrt svar är ibland samma svar.' },
      { text: 'SNABBUTBILDA BARNSKÖTARE PÅ TRE MÅNADER', cost: { money: 300 }, temp: { welfare: 2, qol: -2 }, tip: 'Fler vuxna i rummet. Alla vet inte vad de gör där.' },
      { text: 'FÖRBJUD STREJKER I SAMHÄLLSVIKTIG VERKSAMHET', temp: { freedom: -5, unrest: 6, statepower: 3 }, tip: 'Ingen strejk. Bara uppsägningar.' },
    ],
  },
  {
    id: 'kk_barn_vardnadsbidrag', icon: '\u{1F37C}', weight: 2,
    title: 'BIDRAGET SOM HÅLLER MAMMORNA HEMMA',
    text: 'Hemmavårdsbidraget är populärt, men ny statistik visar att nio av tio som tar det är mammor och att många aldrig kommer tillbaka till arbetslivet. Barnen som stannar hemma kan sämre språk när de börjar skolan.',
    when: (c) => c.is('childcare', 'familycash'),
    choices: [
      { text: 'DELA BIDRAGET LIKA MELLAN FÖRÄLDRARNA', cost: { pp: 15 }, temp: { gdp: 2, integration: 2, approval: -3 }, tip: 'Papporna har plötsligt väldigt mycket att göra på jobbet.' },
      { text: 'ERSÄTT BIDRAGET MED BILLIG FÖRSKOLA', cost: { pp: 25 }, law: ['childcare', 'subsidized'], temp: { stability: -3 }, tip: 'Fler mammor i arbete, färre familjer som känner sig sedda.' },
      { text: 'BEHÅLL BIDRAGET — FAMILJERNA VET BÄST', temp: { ideopower: 4, gdp: -2 }, tip: 'Statistiken får vänta på nästa regering.' },
    ],
  },
  {
    id: 'kk_barn_avgifter', icon: '\u{1F45B}', weight: 2,
    title: 'FÖRSKOLAN KOSTAR MER ÄN HYRAN',
    text: 'De få förskolor som finns är privata, och en plats kostar nu mer än en månadshyra. Allt fler unga föräldrar säger upp sig, och mor- och farföräldrar har blivit landets största barnomsorg.',
    when: (c) => c.is('childcare', 'private', 'none') && c.st.welfare < 20,
    choices: [
      { text: 'INFÖR MAXTAXA MED STATLIGT STÖD', cost: { money: 500, pp: 10 }, law: ['childcare', 'subsidized'], temp: { approval: 4 }, tip: 'Avgiften halveras. Statsbudgeten har fått en ny stor post.' },
      { text: 'SKATTEAVDRAG FÖR BARNOMSORG', cost: { money: 300 }, temp: { gdp: 2, welfare: 2 }, tip: 'Hjälper mest dem som redan har råd. Men det hjälper.' },
      { text: 'FAMILJEN HAR ALLTID SKÖTT BARNEN', temp: { gdp: -3, ideopower: 3 }, tip: 'Mormor tar hand om barnen. Vem tar hand om mormor?' },
    ],
  },
  {
    id: 'kk_barn_sprak', icon: '\u{1F58D}\u{FE0F}', weight: 2,
    title: 'SEXÅRINGARNA KAN INTE SPRÅKET',
    text: 'Lärarna larmar om att var tredje sexåring i vissa förorter börjar skolan utan att kunna tala landets språk. De flesta har aldrig gått i förskola, eftersom familjerna inte har råd eller inte vill.',
    when: (c) => c.st.integration < -10 && c.st.immigration > 0 && c.is('childcare', 'mixed', 'familycash', 'private', 'none'),
    choices: [
      { text: 'OBLIGATORISK SPRÅKFÖRSKOLA FRÅN TRE ÅRS ÅLDER', cost: { money: 600, pp: 15 }, perm: { integration: 5 }, temp: { freedom: -2 }, tip: 'Barnen lär sig snabbt. Några föräldrar känner sig överkörda.' },
      { text: 'SPRÅKCOACHER SOM BESÖKER FAMILJERNA', cost: { money: 300 }, temp: { integration: 3 }, tip: 'Försiktigt och vänligt. Och långsamt.' },
      { text: 'SKOLAN FÅR LÖSA DET', temp: { integration: -3, qol: -2 }, tip: 'Problemet flyttar upp en klass varje år.' },
    ],
  },

  // ================= POLISEN =================
  {
    id: 'kk_pol_pansar', icon: '\u{1F6E1}\u{FE0F}', weight: 2,
    title: 'PANSARFORDON MOT DEMONSTRANTERNA',
    text: 'Polisens nya pansarfordon rullade i går in mot en fredlig demonstration. En tonåring skadades allvarligt av en gasgranat, och bilderna från tv-kamerorna har visats i hela världen.',
    when: (c) => c.is('policing', 'militarized') && c.st.unrest > -10,
    choices: [
      { text: 'OBEROENDE UTREDNING AV INSATSEN', cost: { pp: 15 }, temp: { approval: 4, unrest: -4, statepower: -3 }, tip: 'Polisledningen protesterar. Gatan lugnar sig något.' },
      { text: 'TA BORT DEN MILITÄRA UTRUSTNINGEN', cost: { pp: 25 }, law: ['policing', 'standard'], temp: { unrest: -6, safety: -3 }, tip: 'Pansarfordonen ställs i ett garage. Armén frågar om den får låna dem.' },
      { text: 'POLISEN AGERADE KORREKT', temp: { unrest: 8, approval: -6, statepower: 4 }, rel: -4, tip: 'Officiellt korrekt. Utanför sjukhuset tänder folk ljus.' },
    ],
  },
  {
    id: 'kk_pol_obevapnad', icon: '\u{1F46E}', weight: 2,
    title: 'POLISERNA VILL BÄRA VAPEN',
    text: 'En obeväpnad polispatrull blev beskjuten under ett rån i en förort, och en konstapel ligger på sjukhus. Polisfacket kräver att alla poliser i tjänst ska få bära pistol, men många i kåren vill behålla traditionen.',
    when: (c) => c.is('policing', 'unarmed') && c.st.safety < 20,
    choices: [
      { text: 'BEVÄPNA ALLA POLISER', cost: { pp: 15 }, law: ['policing', 'standard'], temp: { safety: 3, approval: -2 }, tip: 'Tryggare poliser. Lite mindre avslappnade medborgare.' },
      { text: 'FLER BEVÄPNADE INSATSSTYRKOR I BEREDSKAP', cost: { money: 500 }, temp: { safety: 5 }, tip: 'Hjälpen kommer beväpnad. Bara lite senare.' },
      { text: 'BEHÅLL TRADITIONEN', temp: { safety: -3, approval: 3, freedom: 2 }, tip: 'En polis med bara batong ser ut som en vän. Det är poängen, och risken.' },
    ],
  },
  {
    id: 'kk_pol_narpolis', icon: '\u{1F6B2}', weight: 2,
    title: 'NÄRPOLISEN SOM KAN ALLA BARNENS NAMN',
    text: 'Kvarterspolisen i en av de mest utsatta stadsdelarna har blivit en lokal hjälte: inbrotten har halverats och ungdomarna spelar fotboll med henne på fredagar. Nu vill andra kommuner ha likadant, men det kräver tusentals nya poliser.',
    when: (c) => c.is('policing', 'community') && c.st.safety > -30,
    choices: [
      { text: 'ANSTÄLL TUSENTALS NYA KVARTERSPOLISER', cost: { money: 800 }, perm: { safety: 4 }, temp: { integration: 3, approval: 3 }, tip: 'Fem år att utbilda dem. Tio år att lära känna kvarteren.' },
      { text: 'GE HENNE EN MEDALJ OCH SKRIV EN BOK OM METODEN', cost: { money: 100 }, temp: { approval: 3 }, tip: 'Alla läser boken. Ingen har tid att göra som det står.' },
      { text: 'FLYTTA RESURSERNA TILL UTREDNINGAR', temp: { safety: 2, integration: -3 }, tip: 'Fler fall löses. Färre barn vet vad polisen heter.' },
    ],
  },
  {
    id: 'kk_pol_angivare', icon: '\u{1F441}\u{FE0F}', weight: 2,
    title: 'GRANNARNA ANGER VARANDRA',
    text: 'Den hemliga polisen får så många anonyma tips att arkivet inte räcker till. Det mesta handlar om grannfejder, arvstvister och avundsjuka, men varje tips leder till förhör.',
    when: (c) => c.is('policing', 'secretpolice'),
    choices: [
      { text: 'KRÄV BEVIS INNAN NÅGON GRIPS', cost: { pp: 15 }, temp: { freedom: 4, statepower: -4, approval: 3 }, tip: 'Hälften av utredarna har plötsligt ingenting att göra.' },
      { text: 'BELÖNA DE BÄSTA TIPSEN', cost: { money: 300 }, temp: { statepower: 6, freedom: -6, unrest: -3 }, perm: { corruption: 3 }, tip: 'Ett nytt yrke uppstår: professionell angivare.' },
      { text: 'BYGG ETT STÖRRE ARKIV', temp: { statepower: 3, freedom: -3, approval: -3 }, tip: 'Kartoteket fyller nu tre våningar. Ingen vet vad som står i det.' },
      { text: 'LÄGG NER DEN HEMLIGA POLISEN', cost: { pp: 30 }, law: ['policing', 'standard'], temp: { freedom: 8, statepower: -8, unrest: 4 }, tip: 'Arkiven öppnas. Många vill läsa vad grannen skrev.' },
    ],
  },
  {
    id: 'kk_pol_nolltolerans', icon: '\u{1F693}', weight: 2,
    title: 'FÄNGELSERNA ÄR FULLA AV KLOTTRARE',
    text: 'Nolltoleransen har fått brotten att minska, men fängelserna är överfulla av unga som dömts för klotter, snatteri och fylla. Kriminalvården har fått lägga tre fångar i varje cell och varnar för att de små brottslingarna lär sig av de stora.',
    when: (c) => c.is('policing', 'tough', 'militarized') && (c.ind.prisoners ?? 100) > 100,
    choices: [
      { text: 'BYGG NYA FÄNGELSER', cost: { money: 900 }, temp: { safety: 3 }, perm: { welfare: -2 }, tip: 'Varje ny plats fylls innan färgen har torkat.' },
      { text: 'SAMHÄLLSTJÄNST FÖR SMÅBROTT', cost: { pp: 15 }, temp: { safety: -2, qol: 3, integration: 2 }, tip: 'Klottrarna får tvätta väggarna de målade. Några blir duktiga på det.' },
      { text: 'TRÄNG IHOP DEM MER', temp: { safety: -3, unrest: 4 }, tip: 'Fängelserna blir skolor. Fel sorts skolor.' },
    ],
  },

  // ================= KALLA KRIGET =================
  {
    id: 'kk_kall_avhoppare', icon: '\u{1F575}\u{FE0F}', weight: 2,
    title: 'EN AVHOPPAD SPION KNACKAR PÅ',
    text: 'En överste från fiendens underrättelsetjänst har tagit sig in på ett av era konsulat och ber om asyl. Han har med sig listor över agenter i ditt land, och hans regering kräver honom tillbaka inom ett dygn.',
    when: (c) => c.coldWar && c.st.freedom > -40,
    choices: [
      { text: 'GE HONOM ASYL OCH ETT NYTT NAMN', cost: { money: 300 }, res: { rp: 40 }, temp: { safety: 5 }, rel: -6, tip: 'Listorna stämmer. Det mesta av dem.' },
      { text: 'BYT HONOM MOT VÅRA EGNA FÅNGAR', cost: { pp: 15 }, temp: { approval: 5, readiness: 2 }, tip: 'Tre av era agenter kommer hem. Listorna åker tillbaka med honom.' },
      { text: 'LÄMNA TILLBAKA HONOM', temp: { statepower: -3, approval: -4 }, rel: 6, tip: 'Fienden uppskattar gesten. Det gör inte han.' },
    ],
  },
  {
    id: 'kk_kall_ubat', icon: '\u{1F30A}', weight: 2,
    title: 'FRÄMMANDE UBÅT I SKÄRGÅRDEN',
    text: 'Marinen har ekolodskontakt med en okänd ubåt bara några kilometer från en av landets största örlogsbaser. Allt tyder på att den kommer från landet ni ligger i kallt krig med, och pressen står redan på kajen.',
    when: (c) => c.coldWar && c.st.readiness > -30,
    choices: [
      { text: 'JAGA UPP DEN MED VARNINGSSKOTT', cost: { man: 4, money: 300 }, temp: { readiness: 6, approval: 5 }, rel: -4, tip: 'Ubåten försvinner. Eller så gör den inte det.' },
      { text: 'BYGG UT UBÅTSSKYDDET', cost: { money: 700, rp: 30 }, perm: { readiness: 4 }, tip: 'Lyssnarbojar i varje sund. Nästa gång vet ni först.' },
      { text: 'BJUD IN PRESSEN OCH VISA KARTORNA', cost: { pp: 10 }, temp: { ideopower: 6, unrest: 3 }, rel: -6, tip: 'Hela landet följer jakten i direktsändning.' },
      { text: 'DIPLOMATISK PROTEST OCH TYSTNAD', temp: { approval: -3, statepower: -2 }, rel: 2, tip: 'Protesten tas emot artigt och läggs i en låda.' },
    ],
  },
  {
    id: 'kk_kall_robotar', icon: '\u{1F680}', weight: 2,
    title: 'FIENDEN HAR FÅTT NYA ROBOTAR',
    text: 'Underrättelsetjänsten bekräftar att ert rivaliserande land har placerat nya medeldistansrobotar som kan nå huvudstaden på minuter. Generalerna vill ha egna, fredsrörelsen vill ha förhandlingar, och båda samlar folk på gatorna.',
    when: (c) => c.coldWar && c.st.milpower < 30,
    choices: [
      { text: 'PLACERA EGNA ROBOTAR SOM SVAR', cost: { money: 1000 }, perm: { milpower: 6 }, temp: { unrest: 5, readiness: 4 }, rel: -6, tip: 'Balansen är återställd, på en högre och dyrare nivå.' },
      { text: 'FÖRESLÅ ETT NEDRUSTNINGSAVTAL', cost: { pp: 25 }, temp: { approval: 4, milpower: -2 }, rel: 10, tip: 'Förhandlarna träffas i ett grått hotell i fem år.' },
      { text: 'SATSA PÅ ROBOTFÖRSVAR', cost: { rp: 60, money: 400 }, perm: { readiness: 4 }, tip: 'Att träffa en kula med en annan kula. Forskarna älskar det.' },
      { text: 'GÖR INGENTING OCH HOPPAS', temp: { approval: -4, readiness: -3 }, tip: 'Hopp är billigt. Det är också allt det är.' },
    ],
  },
  {
    id: 'kk_kall_toppmote', icon: '\u{1F91D}', weight: 2,
    title: 'TOPPMÖTE PÅ NEUTRAL MARK',
    text: 'Efter månader av hemliga kontakter går fiendens ledare med på att träffa dig i ett neutralt land. Världspressen kallar det årets möte, och dina rådgivare är oense om vad du ska be om och vad du kan ge.',
    when: (c) => c.coldWar && c.st.stability > -20,
    choices: [
      { text: 'TECKNA ETT AVSPÄNNINGSAVTAL', cost: { pp: 20 }, temp: { approval: 5, milpower: -3, ideopower: -3 }, rel: 12, tip: 'Ett handslag på trappan. Hökarna hemma ser inte glada ut.' },
      { text: 'KRÄV ATT DE FRIGER POLITISKA FÅNGAR', cost: { pp: 10 }, temp: { freedom: 3, ideopower: 5 }, rel: -3, tip: 'Mötet slutar utan avtal men med bra bilder.' },
      { text: 'SKICKA UTRIKESMINISTERN I STÄLLET', temp: { stability: 2, approval: -2 }, rel: -2, tip: 'En nedgradering som alla förstår och ingen nämner.' },
    ],
  },
  {
    id: 'kk_kall_falsklarm', icon: '\u{1F4E1}', weight: 2,
    title: 'RADARN VISAR ROBOTAR PÅ VÄG',
    text: 'Mitt i natten larmar varningssystemet om fem fientliga robotar på väg mot landet. Den vakthavande officeren tror inte att det är på riktigt och väntar, och tjugo minuter senare visar det sig vara solreflexer i molnen.',
    when: (c) => c.coldWar && c.st.readiness > 0,
    choices: [
      { text: 'DRA EN DIREKTLINJE TILL FIENDENS LEDARE', cost: { pp: 15 }, temp: { stability: 4 }, rel: 8, tip: 'En röd telefon som förhoppningsvis aldrig ringer.' },
      { text: 'MODERNISERA VARNINGSSYSTEMET', cost: { rp: 50, money: 300 }, perm: { readiness: 3 }, tip: 'Nästa gång vet datorn skillnaden mellan robotar och moln.' },
      { text: 'BEFORDRA OFFICEREN OFFENTLIGT', cost: { pp: 10 }, temp: { approval: 4, readiness: -2 }, tip: 'En hjälte som inte gjorde något. Det var precis rätt sak att göra.' },
      { text: 'HÅLL HÄNDELSEN HEMLIG', temp: { statepower: 3 }, mod: 'cover_up', tip: 'Officeren får ingen medalj. Han får tystnadsplikt.' },
    ],
  },
  {
    id: 'kk_kall_radio', icon: '\u{1F4FB}', weight: 2,
    title: 'FIENDENS RADIO SÄNDER PÅ VÅRT SPRÅK',
    text: 'En ny radiokanal från andra sidan gränsen sänder nyheter, popmusik och kritik mot din regering på ert eget språk. Ungdomarna lyssnar i smyg, och programledarna verkar veta saker som inte står i era tidningar.',
    when: (c) => c.coldWar && c.st.freedom < 20,
    choices: [
      { text: 'STÖRSÄNDARE LÄNGS HELA GRÄNSEN', cost: { money: 400 }, temp: { freedom: -5, statepower: 4, approval: -3 }, tip: 'Brus på alla kanaler. Ungdomarna bygger egna antenner.' },
      { text: 'STARTA EN EGEN KANAL SOM SÄNDER TILL DEM', cost: { money: 500, pp: 10 }, temp: { ideopower: 6 }, rel: -5, tip: 'Nu brusar det i båda riktningarna.' },
      { text: 'LÅT FOLK LYSSNA — VI HAR INGET ATT DÖLJA', temp: { freedom: 5, ideopower: -5, approval: 2 }, tip: 'Det mest omstörtande programmet visar sig vara topplistan.' },
    ],
  },
  {
    id: 'kk_kall_os_bojkott', icon: '\u{1F3C5}', weight: 2, cooldown: 1000,
    title: 'SKA VI BOJKOTTA OS?',
    text: 'Sommarens olympiska spel hålls i det land ni ligger i kallt krig med. Flera länder har redan bestämt sig för att stanna hemma, och dina idrottare har tränat i fyra år för just de här tävlingarna.',
    when: (c) => c.coldWar && c.day > 100,
    choices: [
      { text: 'BOJKOTTA SPELEN', temp: { ideopower: 5, approval: -5 }, rel: -4, tip: 'En markering som idrottarna får betala för.' },
      { text: 'ÅK DIT OCH VINN PÅ DERAS HEMMAPLAN', cost: { money: 400 }, temp: { approval: 5, ideopower: 3 }, rel: 3, tip: 'Varje guld blir en liten seger i kalla kriget.' },
      { text: 'ÅK, MEN UNDER DEN OLYMPISKA FLAGGAN', cost: { pp: 10 }, temp: { approval: 2 }, rel: 4, tip: 'Idrottarna tävlar. Nationalsången spelas inte.' },
    ],
  },
  {
    id: 'kk_kall_satellit', icon: '\u{1F6F0}\u{FE0F}', weight: 2,
    title: 'FIENDENS SATELLIT PASSERAR ÖVER OSS',
    text: 'Det rivaliserande landet har skjutit upp en satellit som syns som en lysande prick på himlen varje kväll. Tidningarna frågar hur ni kunde hamna så långt efter, och föräldrar undrar vad barnen egentligen lär sig i skolan.',
    when: (c) => c.coldWar && c.res('satellites') <= 3,
    choices: [
      { text: 'STARTA ETT EGET RYMDPROGRAM', cost: { money: 1000, rp: 60 }, perm: { research: 5 }, temp: { ideopower: 5 }, tip: 'Tio år och tusentals ingenjörer senare har ni en egen prick på himlen.' },
      { text: 'SATSA PÅ MATTE OCH NATURVETENSKAP I SKOLAN', cost: { money: 600 }, perm: { research: 3, hdi: 2 }, tip: 'Effekten kommer om femton år, men den håller i femtio.' },
      { text: 'EN SATELLIT ÄR BARA EN DYR LEKSAK', temp: { approval: -3, ideopower: -3 }, tip: 'Den piper varje gång den passerar. Alla lyssnar.' },
    ],
  },
  {
    id: 'kk_kall_schack', icon: '\u{265F}\u{FE0F}', weight: 2,
    title: 'SCHACKMATCHEN MOT FIENDEN',
    text: 'Landets främsta schackspelare har kvalificerat sig till en VM-match mot fiendens regerande mästare. Hela världen följer partierna som om de vore en krigsskådeplats, och vår spelare ställer krav på spelplats, belysning och stolar.',
    when: (c) => c.coldWar && c.st.research > -20,
    choices: [
      { text: 'BETALA FÖR ETT HELT TRÄNARLAG', cost: { money: 300 }, temp: { ideopower: 5, approval: 4 }, tip: 'Sekundanterna analyserar varje öppning dygnet runt.' },
      { text: 'FÖRHANDLA FRAM ALLA KRAV ÅT SPELAREN', cost: { pp: 10 }, temp: { ideopower: 3, research: 2 }, tip: 'Stolen byts ut tre gånger. Det tredje partiet vinner vi.' },
      { text: 'DET ÄR BARA ETT BRÄDSPEL', temp: { ideopower: -3 }, tip: 'Pressen håller inte med. Inte en enda tidning.' },
    ],
  },
  {
    id: 'kk_kall_luftbro', icon: '\u{2708}\u{FE0F}', weight: 2,
    title: 'FIENDEN HAR STÄNGT VÄGEN TILL STADEN',
    text: 'En av era städer ligger som en ö inne på fiendens område, och i natt stängdes alla vägar och järnvägar dit. Två miljoner invånare har mat för några veckor, och fienden säger att vägarna öppnas när ni lämnar staden.',
    when: (c) => c.coldWar && c.claims >= 4,
    choices: [
      { text: 'LUFTBRO: FLYG IN ALLT DE BEHÖVER', cost: { money: 1000, man: 5 }, temp: { approval: 8, ideopower: 6 }, rel: 8, tip: 'Ett plan landar var tredje minut. Världen ser vem som håller ut.' },
      { text: 'FÖRHANDLA OM EN KOMPROMISS', cost: { pp: 20 }, temp: { stability: 3, ideopower: -4 }, rel: 4, tip: 'Vägarna öppnas. Staden glömmer inte att den nästan lämnades.' },
      { text: 'BRYT IGENOM MED EN PANSARKOLONN', cost: { man: 10 }, temp: { readiness: 5, stability: -6 }, rel: -12, tip: 'Ett högt spel. Båda sidor har fingret nära knappen.' },
      { text: 'LÄMNA STADEN', temp: { approval: -10, ideopower: -8 }, rel: -4, tip: 'Vägarna öppnas, för dem som vill flytta.' },
    ],
  },
  {
    id: 'kk_kall_ombudskrig', icon: '\u{1F30D}', weight: 2,
    title: 'OMBUDSKRIGET I ETT FJÄRRAN LAND',
    text: 'I ett inbördeskrig på en annan kontinent har fienden börjat skicka vapen och rådgivare till regeringssidan. Rebellerna ber dig om luftvärnsrobotar och lovar att aldrig glömma vem som hjälpte dem.',
    when: (c) => c.coldWar && !c.atWar,
    choices: [
      { text: 'SKICKA VAPEN I HEMLIGHET', cost: { money: 600 }, temp: { ideopower: 4 }, rel: -6, tip: 'Fienden blöder pengar. Vapnen dyker upp på fel ställen om tio år.' },
      { text: 'SKICKA MILITÄRA RÅDGIVARE', cost: { man: 5, money: 300 }, temp: { readiness: 5, approval: -3 }, rel: -8, tip: 'Rådgivarna ska bara ge råd. Det brukar börja så.' },
      { text: 'HUMANITÄR HJÄLP TILL BÅDA SIDOR', cost: { money: 300 }, temp: { approval: 2 }, rel: 6, tip: 'Ingen vinner, men fler klarar sig.' },
      { text: 'HÅLL ER UTANFÖR', temp: { ideopower: -3 }, tip: 'Fienden får en ny vänskapsstat. Ni får lugn och ro.' },
    ],
  },
  {
    id: 'kk_kall_skyddsrum', icon: '\u{2622}\u{FE0F}', weight: 2,
    title: 'BEFOLKNINGEN KRÄVER SKYDDSRUM',
    text: 'Efter månader av hotfulla tal från båda sidor har oroliga familjer börjat gräva egna skyddsrum i trädgårdarna. Butikerna har slut på konserver, och barnen har mardrömmar efter skolans övningar.',
    when: (c) => c.coldWar && c.st.safety < 20,
    choices: [
      { text: 'SKYDDSRUM I VARJE NYTT HUS', cost: { money: 800 }, perm: { safety: 4, readiness: 2 }, tip: 'Källarna blir djupare och cykelförråden bättre.' },
      { text: 'EN BROSCHYR TILL VARJE HUSHÅLL: OM KRISEN KOMMER', cost: { money: 100 }, temp: { readiness: 3, safety: 2 }, tip: 'Vatten, radio, tändstickor. Lugnet sprids med posten.' },
      { text: 'SÄG ATT DET INTE FINNS NÅGON FARA', temp: { approval: -4, unrest: 3 }, tip: 'Ingenting gör folk så oroliga som det.' },
    ],
  },
  {
    id: 'kk_kall_frasarna', icon: '\u{2699}\u{FE0F}', weight: 2,
    title: 'MASKINERNA SOM HAMNADE HOS FIENDEN',
    text: 'Ett av landets största verkstadsbolag har i hemlighet sålt precisionsfräsar till fienden, som använt dem för att göra sina ubåtar tystare. Era handelspartner är rasande och hotar att stoppa all teknikhandel med er.',
    when: (c) => c.coldWar && c.st.factory > 0,
    choices: [
      { text: 'ÅTALA BOLAGETS LEDNING', cost: { pp: 15 }, temp: { factory: -3, approval: 3 }, perm: { corruption: -3 }, rel: 8, tip: 'Direktörerna döms. Aktiekursen också.' },
      { text: 'INFÖR STRÄNG EXPORTKONTROLL', cost: { money: 300 }, temp: { factory: -4, gdp: -2 }, rel: 6, tip: 'Varje skruv behöver nu ett intyg.' },
      { text: 'FÖRNEKA ATT DET HAR HÄNT', temp: { factory: 2 }, perm: { corruption: 3 }, rel: -10, tip: 'Exporten fortsätter. Inbjudningarna till toppmötena slutar komma.' },
    ],
  },
  {
    id: 'kk_kall_muren', icon: '\u{1F9F1}', weight: 2,
    title: 'TUSENTALS FLYR TILL FIENDEN VARJE DAG',
    text: 'Läkare, ingenjörer och unga familjer lämnar landet över gränsen till den sida ni ligger i kallt krig med, där lönerna är högre och friheten större. Säkerhetstjänsten föreslår att gränsen stängs med en mur.',
    when: (c) => c.coldWar && c.st.freedom < -20,
    choices: [
      { text: 'BYGG MUREN', cost: { money: 700, pp: 20 }, temp: { stability: 5 }, perm: { freedom: -6 }, rel: -12, tip: 'Flykten stoppas. Bilden av muren går jorden runt i fyrtio år.' },
      { text: 'HÖJ LÖNERNA FÖR LÄKARE OCH INGENJÖRER', cost: { money: 600 }, temp: { qol: 3, research: 2 }, tip: 'Några stannar. De andra tar med sig pengarna.' },
      { text: 'LÅT DEM GÅ — OCH BÖRJA REFORMERA', temp: { freedom: 5, ideopower: -5 }, mod: 'brain_drain', tip: 'Ett land man får lämna är ett land fler vill stanna i. Med tiden.' },
    ],
  },
  {
    id: 'kk_kall_sympatisorer', icon: '\u{1F50D}', weight: 2,
    title: 'JAKTEN PÅ FIENDENS SYMPATISÖRER',
    text: 'En parlamentarisk kommitté vill förhöra författare, lärare och filmskapare som misstänks sympatisera med fienden. Ordföranden säger sig ha en lista med två hundra namn, men vägrar visa den.',
    when: (c) => c.coldWar && c.st.freedom > -10,
    choices: [
      { text: 'STÖD KOMMITTÉN', temp: { statepower: 5, ideopower: 5, freedom: -8 }, tip: 'Svartlistor blir en karriärväg, för dem som skriver dem.' },
      { text: 'KRÄV ATT LISTAN VISAS', cost: { pp: 15 }, temp: { freedom: 4, approval: 3, ideopower: -3 }, tip: 'Listan visar sig vara telefonkatalogens första sidor.' },
      { text: 'LÅT SÄKERHETSPOLISEN SKÖTA DET I TYSTHET', cost: { pp: 10 }, temp: { safety: 3, freedom: -3 }, tip: 'Mindre teater, samma kartotek.' },
    ],
  },
  {
    id: 'kk_kall_basen', icon: '\u{1F3AF}', weight: 2,
    title: 'STORMAKTEN VILL HA EN BAS HOS OSS',
    text: 'Din mäktigaste allierade vill placera robotar och flygplan på en bas i ditt land, som svar på fiendens upprustning. Det ger trygghet och pengar, men gör er också till första målet om något skulle hända.',
    when: (c) => c.coldWar && c.allies > 0,
    choices: [
      { text: 'SÄG JA TILL BASEN', res: { money: 500 }, temp: { milpower: 8, readiness: 4, unrest: 4 }, rel: 4, tip: 'Hyran betalas i tid. Fredsrörelsen tältar vid stängslet.' },
      { text: 'BARA FLYGPLAN, INGA ROBOTAR', cost: { pp: 15 }, temp: { milpower: 4 }, tip: 'En kompromiss som alla tycker är fel på olika sätt.' },
      { text: 'NEJ TILL FRÄMMANDE TRUPPER', temp: { ideopower: 4, milpower: -3 }, rel: -6, tip: 'Självständigheten består. Det gör hotet också.' },
    ],
  },
  {
    id: 'kk_kall_ny_ledare', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'FIENDENS NYA LEDARE VILL HA FRED',
    text: 'Landet ni legat i kallt krig med har fått en ny ledare som talar om öppenhet, nedrustning och handel. Hon föreslår att båda sidor skrotar en tredjedel av sina vapen, men dina generaler tror att det är ett trick.',
    when: (c) => c.coldWar && c.st.stability > 0 && c.day > 300,
    choices: [
      { text: 'SKROTA VAPNEN TILLSAMMANS', cost: { pp: 25 }, temp: { milpower: -6, approval: 6, income: 4 }, rel: 15, tip: 'Fredsutdelningen kommer. Generalerna går i pension med sura miner.' },
      { text: 'TESTA HENNE MED ETT MINDRE AVTAL', cost: { pp: 10 }, temp: { stability: 3 }, rel: 6, tip: 'Förtroende byggs en robot i taget.' },
      { text: 'LITA ALDRIG PÅ FIENDEN', temp: { milpower: 3, ideopower: 3, approval: -3 }, rel: -6, tip: 'Kalla kriget fortsätter. Någon måste ju få rätt till slut.' },
    ],
  },

  // ================= REVOLUTIONER =================
  {
    id: 'kk_rev_smittar', icon: '\u{1F525}', weight: 2,
    title: 'REVOLUTIONEN SPRIDER SIG ÖVER GRÄNSEN',
    text: 'Bara veckor efter att en regim föll i grannskapet samlas folk på torgen i dina städer med samma flaggor och samma slagord. Demonstranterna säger att det som gick där kan gå här också.',
    when: (c) => (c.worldRevolutions ?? 0) >= 1 && c.st.unrest > 20,
    choices: [
      { text: 'MÖT DEM MED REFORMER', cost: { pp: 25 }, temp: { unrest: -10, freedom: 5, statepower: -5 }, tip: 'Den som ger efter i tid behöver inte ge efter för allt.' },
      { text: 'SLÅ NED PROTESTERNA', cost: { pp: 15 }, temp: { unrest: -8, freedom: -8, approval: -8 }, tip: 'Torgen töms. Slagorden flyttar in i köken.' },
      { text: 'STÄNG GRÄNSEN MOT GRANNSKAPET', temp: { unrest: -3, gdp: -3 }, mod: 'border_crisis', tip: 'Idéer behöver inga pass, men det tar dem lite längre tid.' },
      { text: 'LÅT DEM DEMONSTRERA', temp: { unrest: 4, freedom: 3 }, tip: 'Torgen är fulla. Det är också fönstren mot dem.' },
    ],
  },
  {
    id: 'kk_rev_eliten', icon: '\u{1F4BC}', weight: 2,
    title: 'DEN AVSATTA ELITEN LANDAR HOS OSS',
    text: 'Ett privatplan har landat med ministrar och bankirer från en regim som just störtats av en revolution. De har med sig resväskor fulla av guld och vill ha asyl, och den nya regimen kräver dem utlämnade för förskingring.',
    when: (c) => (c.worldRevolutions ?? 0) >= 2 && c.st.corruption > 0 && c.st.freedom < 20,
    choices: [
      { text: 'GE DEM ASYL — OCH TA HAND OM GULDET', res: { money: 800 }, perm: { corruption: 5 }, rel: -8, tip: 'Guldet hamnar i era banker. Historien hamnar i världspressen.' },
      { text: 'FRYS GULDET TILLS EN DOMSTOL AVGÖR', cost: { pp: 15 }, perm: { corruption: -2 }, rel: 4, tip: 'Advokater i båda länderna får arbete i tio år.' },
      { text: 'LÄMNA UT DEM TILL DEN NYA REGIMEN', temp: { approval: 3, freedom: -2 }, rel: 6, tip: 'Rättvisa enligt den nya regimen. Ingen vet riktigt vad det betyder.' },
    ],
  },
  {
    id: 'kk_rev_erkannande', icon: '\u{1F3F3}\u{FE0F}', weight: 2,
    title: 'SKA VI ERKÄNNA DEN NYA REGIMEN?',
    text: 'Revolutionärerna har tagit makten i ett land som ni handlar mycket med och ber om diplomatiskt erkännande. Den gamla regeringen sitter kvar i en provins och påstår att den fortfarande är den lagliga.',
    when: (c) => (c.worldRevolutions ?? 0) >= 1 && c.st.stability > 15 && !c.is('un', 'none'),
    choices: [
      { text: 'ERKÄNN DEN NYA REGIMEN DIREKT', temp: { income: 3 }, rel: -4, tip: 'Först in genom dörren får de bästa kontrakten. Och flest fiender.' },
      { text: 'VÄNTA TILLS FN HAR TAGIT STÄLLNING', temp: { stability: 2 }, rel: 3, tip: 'Försiktigt. Ingen tackar er, ingen fördömer er.' },
      { text: 'STÖD DEN GAMLA REGERINGEN', cost: { money: 400 }, temp: { ideopower: 4 }, rel: -6, tip: 'Den gamla regeringen lovar mycket. Den har bara en provins att lova med.' },
    ],
  },
  {
    id: 'kk_rev_exilregering', icon: '\u{1F3DB}\u{FE0F}', weight: 2,
    title: 'EXILREGERINGEN SÖKER SKYDD',
    text: 'Den valda regeringen i ett land som drabbats av en revolution har flytt och vill bilda exilregering i din huvudstad. De ber om ett hus, en radiosändare och ett erkännande, och revolutionärerna hotar med följder.',
    when: (c) => (c.worldRevolutions ?? 0) >= 2 && c.st.freedom > 10,
    choices: [
      { text: 'GE DEM EN VILLA OCH EN SÄNDARE', cost: { money: 300 }, temp: { freedom: 3, ideopower: 4 }, rel: -4, tip: 'Exilministrarna håller presskonferens varje måndag i tjugo år.' },
      { text: 'ASYL, MEN INGEN POLITISK VERKSAMHET', cost: { pp: 10 }, temp: { freedom: -2 }, rel: 3, tip: 'De får bo här så länge de är tysta. De är inte tysta.' },
      { text: 'NEKA DEM', temp: { freedom: -3, approval: -3 }, rel: 4, tip: 'Revolutionärerna skickar ett tackbrev. Det gör ingen annan.' },
    ],
  },
  {
    id: 'kk_rev_har', icon: '\u{270A}', weight: 2, cooldown: 800,
    title: 'REVOLUTIONEN HAR BÖRJAT HÄR',
    text: 'Generalstrejk, ockuperade ministerier och barrikader runt parlamentet. Efter revolutionerna i omvärlden tror demonstranterna att det är din tur att gå, och delar av polisen har slutat lyda order.',
    when: (c) => (c.worldRevolutions ?? 0) >= 1 && c.st.unrest > 35 && c.st.approval < 10,
    choices: [
      { text: 'UTLYS FRIA NYVAL', cost: { pp: 30 }, law: ['elections', 'free'], temp: { unrest: -15, statepower: -8 }, tip: 'Du kan förlora valet. Du förlorar i alla fall inte landet.' },
      { text: 'BJUD IN OPPOSITIONEN TILL RUNDABORDSSAMTAL', cost: { pp: 15 }, temp: { unrest: -8, stability: 4, ideopower: -6 }, tip: 'Ett runt bord har ingen kortände. Det är hela poängen.' },
      { text: 'KALLA IN ARMÉN', cost: { man: 8 }, temp: { unrest: -10, freedom: -12, approval: -10 }, mod: 'police_state', tip: 'Barrikaderna rivs. Grunden till nästa revolution läggs.' },
      { text: 'VÄNTA UT DEM', temp: { unrest: 8, stability: -8 }, mod: 'boiling_over', tip: 'Oftast är det vintern som vinner. Ibland är det revolutionärerna.' },
    ],
  },
  {
    id: 'kk_rev_studenter', icon: '\u{1F393}', weight: 2,
    title: 'STUDENTERNA SJUNGER REVOLUTIONSSÅNGER',
    text: 'På universiteten bär studenterna symbolerna från revolutionerna utomlands och sjunger sångerna från deras torg. De flesta har varken jobb eller bostad efter examen, och studentkåren kräver ett möte med dig.',
    when: (c) => (c.worldRevolutions ?? 0) >= 2 && (c.ind.youthunemp ?? 14) > 15,
    choices: [
      { text: 'TRÄFFA STUDENTERNA OCH LYSSNA', cost: { pp: 10 }, temp: { unrest: -4, approval: 4 }, tip: 'De vill ha mycket. Mest av allt ville de bli lyssnade på.' },
      { text: 'ETT JOBBPAKET FÖR UNGA AKADEMIKER', cost: { money: 600 }, temp: { unrest: -6, gdp: 2 }, tip: 'Svårt att bygga barrikader när man har en praktikplats.' },
      { text: 'STÄNG UNIVERSITETEN EN TERMIN', temp: { unrest: 3, research: -6, freedom: -4 }, tip: 'Studenterna har plötsligt väldigt mycket tid över.' },
    ],
  },
  {
    id: 'kk_rev_forstatligat', icon: '\u{1F3ED}', weight: 2,
    title: 'REVOLUTIONEN TOG VÅRA FÖRETAG',
    text: 'Den nya revolutionära regimen i ett råvaruland har förstatligat gruvor och fabriker som ägs av bolag från ditt land, utan ersättning. Bolagen kräver att regeringen agerar, och pensionsfonderna har förlorat stora summor.',
    when: (c) => (c.worldRevolutions ?? 0) >= 2 && (c.ind.gdppc ?? 9000) > 20000,
    choices: [
      { text: 'FRYS DERAS TILLGÅNGAR HÄR', cost: { pp: 15 }, res: { money: 400 }, rel: -6, tip: 'Ett fartyg med deras kaffe beslagtas i hamnen. Det är något.' },
      { text: 'FÖRHANDLA OM ERSÄTTNING', cost: { pp: 10 }, temp: { income: 2 }, rel: 3, tip: 'Ni får tjugo öre på kronan, utbetalt på trettio år.' },
      { text: 'INFÖR HANDELSEMBARGO', temp: { gdp: -3, ideopower: 4 }, rel: -4, tip: 'Embargot träffar dem. Det träffar era exportörer också.' },
    ],
  },
  {
    id: 'kk_rev_rebeller', icon: '\u{1F4E6}', weight: 2,
    title: 'REBELLERNA I GRANNLANDET BER OM HJÄLP',
    text: 'En upprorsrörelse i ett grannland har tagit flera städer och ber om vapen för att störta diktatorn. De lovar fria val och goda grannrelationer, men ingen vet vilka av rebellerna som tar över om de vinner.',
    when: (c) => (c.worldRevolutions ?? 0) >= 1 && c.st.milpower > 10 && !c.atWar,
    choices: [
      { text: 'SKICKA VAPEN OCH INSTRUKTÖRER', cost: { money: 500, man: 4 }, temp: { ideopower: 5, readiness: 2 }, rel: -8, tip: 'Vinner de har ni en vän. Förlorar de har ni en fiende till.' },
      { text: 'SKICKA BARA SJUKVÅRD OCH MAT', cost: { money: 300 }, temp: { approval: 2 }, rel: 4, tip: 'Hjälpen når fram. Diktatorn noterar vem som skickade den.' },
      { text: 'HÅLL ER NEUTRALA', temp: { ideopower: -2 }, rel: 2, tip: 'Den som vinner kommer ihåg att ni inte gjorde något.' },
    ],
  },
  {
    id: 'kk_rev_kungen', icon: '\u{1F451}', weight: 2,
    title: 'DEN AVSATTA KUNGEN BER OM HJÄLP',
    text: 'En monark som störtats av en revolution har sökt skydd i ditt land. Han vill att du hjälper honom tillbaka till tronen med pengar och legosoldater, och lovar förmånliga oljeavtal när han väl sitter där igen.',
    when: (c) => (c.worldRevolutions ?? 0) >= 1 && ['monarchism', 'conservatism', 'christdem', 'imperialism', 'stratocracy'].includes(c.ideo),
    choices: [
      { text: 'FINANSIERA EN KONTRAREVOLUTION', cost: { money: 900 }, temp: { ideopower: 5, income: 3 }, rel: -12, tip: 'Kontrarevolutioner är dyra, långsamma och sällan lyckade. Men oljan lockar.' },
      { text: 'GE HONOM ETT SLOTT ATT BO I', cost: { money: 200 }, temp: { approval: 2 }, rel: -2, tip: 'Han bor fint. Han slutar aldrig prata om sitt land.' },
      { text: 'BE HONOM RESA VIDARE', temp: { ideopower: -3 }, rel: 5, tip: 'Den nya regimen noterar det. Kungen också.' },
    ],
  },
  {
    id: 'kk_rev_vagen', icon: '\u{1F32A}\u{FE0F}', weight: 2,
    title: 'REGIMERNA FALLER EN EFTER EN',
    text: 'En revolutionsvåg sveper genom världen och flera regeringar har störtats på ett år. Dina rådgivare skriver promemorior om vad de fallna hade gemensamt: höga matpriser, unga utan jobb och en armé som slutade lyda.',
    when: (c) => (c.worldRevolutions ?? 0) >= 3 && c.st.stability < 30,
    choices: [
      { text: 'SUBVENTIONERA BRÖD OCH BRÄNSLE', cost: { money: 700 }, temp: { unrest: -8, approval: 4, income: -3 }, tip: 'Revolutioner börjar sällan med mätta magar.' },
      { text: 'HÖJ OFFICERARNAS LÖNER', cost: { money: 500 }, temp: { statepower: 6, milpower: 3 }, perm: { corruption: 2 }, tip: 'En nöjd armé byter inte sida. Det är den viktigaste lärdomen.' },
      { text: 'GÖR REFORMER INNAN NÅGON KRÄVER DEM', cost: { pp: 25 }, temp: { freedom: 6, stability: 4, statepower: -4 }, tip: 'Svårt att göra revolution mot någon som redan har gett efter.' },
      { text: 'DET HÄNDER INTE HÄR', temp: { stability: -3 }, tip: 'Det sa de andra också.' },
    ],
  },
  {
    id: 'kk_rev_ambassad', icon: '\u{1F3E2}', weight: 2,
    title: 'VÅR AMBASSAD ÄR OCKUPERAD',
    text: 'I revolutionens huvudstad har studenter tagit sig in på er ambassad och hindrar femton diplomater från att lämna den. De kräver att ni lämnar ut landets förre ledare, som får vård på ett av era sjukhus.',
    when: (c) => (c.worldRevolutions ?? 0) >= 2 && c.st.freedom > 0 && c.st.stability > -10,
    choices: [
      { text: 'FÖRHANDLA GENOM ETT NEUTRALT LAND', cost: { pp: 20 }, temp: { approval: 3 }, rel: 4, tip: 'Det tar ett år. Alla femton kommer hem.' },
      { text: 'RÄDDNINGSAKTION MED SPECIALFÖRBAND', cost: { man: 5, money: 400 }, temp: { readiness: 4, approval: 4 }, rel: -8, tip: 'Ett djärvt försök. Allt hänger på att ingenting går fel.' },
      { text: 'LÄMNA UT DEN FÖRRE LEDAREN', temp: { approval: -4, freedom: -3 }, rel: -4, tip: 'Diplomaterna kommer hem. Ingen landsflyktig vågar längre söka vård hos er.' },
    ],
  },
  {
    id: 'kk_rev_oljan', icon: '\u{1F6E2}\u{FE0F}', weight: 2,
    title: 'REVOLUTIONEN HAR STRYPT OLJAN',
    text: 'En revolution i ett av världens största oljeländer har stoppat exporten. Oljepriset har fördubblats på en månad, bensinstationerna ransonerar och fabrikerna varnar för att de måste dra ner på skiften.',
    when: (c) => (c.worldRevolutions ?? 0) >= 1 && c.is('energy', 'fossil', 'gasbridge', 'mixed') && c.st.factory > 10,
    choices: [
      { text: 'RANSONERA BENSINEN', cost: { pp: 15 }, temp: { gdp: -3, approval: -3, safety: 2 }, tip: 'Bilfria söndagar. Barnen cyklar på motorvägen.' },
      { text: 'BYGG BORT OLJEBEROENDET MED KÄRNKRAFT', cost: { money: 800, pp: 15 }, law: ['energy', 'nuclear'], temp: { gdp: -2 }, tip: 'Om tio år skrattar ni åt oljepriset. Fram till dess gör ni inte det.' },
      { text: 'SLÄPP DE STRATEGISKA LAGREN', temp: { gdp: 2, readiness: -4 }, tip: 'Krisen dämpas i ett halvår. Kommer nästa är lagren tomma.' },
    ],
  },
  {
    id: 'kk_rev_fiendens_hand', icon: '\u{1F5DE}\u{FE0F}', weight: 2,
    title: 'FIENDEN STOD BAKOM REVOLUTIONEN',
    text: 'Den nya regimen i ett land som var er vän står öppet på fiendens sida i kalla kriget. Era underrättelserapporter visar att fienden finansierade revolutionen, och nu vill regimen säga upp era handelsavtal.',
    when: (c) => c.coldWar && (c.worldRevolutions ?? 0) >= 1,
    choices: [
      { text: 'STÖD DEN BEVÄPNADE OPPOSITIONEN', cost: { money: 600 }, temp: { ideopower: 4, milpower: -2 }, rel: -8, tip: 'Svaret på ett ombudskrig är ett annat ombudskrig.' },
      { text: 'ERBJUD DEN NYA REGIMEN BÄTTRE AVTAL', cost: { money: 400 }, temp: { income: 2 }, rel: 4, tip: 'Vänner går att köpa tillbaka. De blir bara dyrare för varje gång.' },
      { text: 'GE UPP LANDET OCH SATSA PÅ ANDRA', temp: { ideopower: -4, income: -2 }, tip: 'En dominobricka faller. Rådgivarna ritar kartor med pilar.' },
    ],
  },
];
