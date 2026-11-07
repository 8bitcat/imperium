// IMPERIUM V5.18 LAG OCH ORDNING — HÄNDELSER: BROTT, POLIS OCH RÄTTVISA.
// Henry önskade: "utveckla brottsstatistiken ordentligt". Statistiken har nu 16 nya brotts-
// och rättsmått (skjutningar, sprängningar, knivbrott, gängmord, narkotikabruk och narkotika-
// döda, dataintrång, utpressningsattacker, bedrägerier mot äldre, välfärdsfusk, arbetslivs-
// kriminalitet, mörkertal, uppklarade mord, strafftid, rymningar och väktare), och brotten
// följer sina orsaker: arbetslöshet, klyftor, utanförskap, gäng, polis, uppklaring, alkohol
// och droger. Händelserna graderas på måtten (c.ind.X), på c.crimeRise (brottsligheten nu
// delat med den vid start, 1 = som förut) och på det nya missnöjet 🚨 TRYGGHETEN
// (kind: 'trygghet', c.grievOf('trygghet')).
// Avsnitten:
//   gängen         konflikter, skjutningsvågor, sprängningar, värvning, vittnen, razzior
//   narkotikan     beslag, nya droger, överdoser, sprutbyte, avkriminalisering
//   nätet          telefonbedragare, utpressningsprogram, hackade banker, falska fakturor
//   ekobrotten     bidragsfusk, svartjobb, penningtvätt, mutor
// (Rättsväsendet, vardagsbrotten, kuriosa och folkets reaktioner kan bli egna avsnitt senare;
// brottskrönikan i fliken BROTT täcker vardagsbrotten så länge.)
// Varje val är en avvägning: hårdare straff kostar fängelseplatser och frihet, fler poliser
// kostar pengar, förebyggande är billigt men långsamt, kameror tar friheten, avkriminalisering
// är en risk och att låta bli ger missnöje. Inget våld beskrivs i detalj.
export const EVENTS = [

  // ===== GÄNGEN =====
  {
    id: 'br_gang_konflikt', icon: '\u{1F6A8}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'GÄNGKONFLIKTEN I {STAD}',
    text: 'Två kriminella nätverk i {stad} har börjat bråka om narkotikahandeln i samma stadsdel. Det har varit tre skottlossningar på två veckor, och i går kväll skadades en man utanför en pizzeria. Polisen säger att konflikten kan trappas upp och ber om förstärkning. Föräldrarna i området har börjat hämta tonåringarna vid bussen.',
    when: (c) => (c.ind.gangs ?? 60) > 110 && (c.ind.shootings ?? 1) > 2 && c.day > 30,
    choices: [
      { text: 'SKICKA NATIONELLA INSATSSTYRKAN', cost: { money: 250 }, temp: { safety: 4, freedom: -1 }, griev: -4, ind: { shootings: -12 }, next: ['br_gang_konflikt_tyst', 'br_gang_konflikt_hamnd'], tip: 'Fyrtio poliser i skyddsväst lugnar gatan. Frågan är vad som händer när de åker hem.' },
      { text: 'SÄTT IN SOCIALTJÄNST OCH FÄLTARBETARE', cost: { money: 120 }, temp: { safety: 1, integration: 2 }, griev: -1, next: [null, 'br_gang_konflikt_hamnd'], tip: 'Långsamt och osynligt. Precis som det mesta som brukar fungera.' },
      { text: 'LÅT DEN LOKALA POLISEN SKÖTA DET', temp: { safety: -3, approval: -2 }, griev: 5, ind: { shootings: 10, feelsafe: -2 }, next: 'br_gang_konflikt_hamnd', tip: 'Den lokala polisen är elva personer. Två av dem har semester.' },
    ],
  },
  {
    id: 'br_gang_konflikt_hamnd', icon: '\u{1F525}', chain: true, kind: 'trygghet',
    title: 'HÄMNDEN I {STAD}',
    text: 'Konflikten i {stad} har blossat upp igen. I natt hördes skott i ett bostadsområde, men ingen skadades, och på morgonen brann två bilar på en parkering. Ungdomar berättar för lokaltidningen att alla vet vilka som ligger bakom, men ingen säger något högt. Polisen vill få rätt att visitera vem som helst i området under två veckor.',
    choices: [
      { text: 'INFÖR EN VISITATIONSZON I TVÅ VECKOR', cost: { pp: 10 }, temp: { safety: 4, freedom: -3 }, griev: -5, ind: { shootings: -15, feelsafe: 2 }, next: [null, 'br_gang_konflikt_fred'], tip: 'Alla i området visiteras. Även de som bara ska köpa mjölk.' },
      { text: 'ANLITA FÖRE DETTA GÄNGMEDLEMMAR SOM MEDLARE', cost: { money: 150 }, next: [null, 'br_gang_konflikt_fred'], tip: 'Ingen kan gängens språk bättre än de som har lämnat dem.',
        risk: { chance: 0.55,
          win: { text: 'Medlarna får de två ledarna att träffas. Skotten tystnar för första gången på månader.', griev: -6, ind: { shootings: -20 } },
          lose: { text: 'Medlingen sprack efter en vecka. En av medlarna har själv fått hot.', griev: 4, ind: { shootings: 8 } } } },
      { text: 'BE INVÅNARNA OM TÅLAMOD', temp: { approval: -3 }, griev: 6, ind: { feelsafe: -3 }, tip: 'Tålamod är lätt att be om från ett kontor i {huvudstad}.' },
    ],
  },
  {
    id: 'br_gang_konflikt_tyst', icon: '\u{1F319}', chain: true, kind: 'trygghet',
    title: 'TYST I {STAD}, MEN HUR LÄNGE?',
    text: 'Sju veckor har gått sedan insatsstyrkan kom till {stad}, och det har inte hörts ett enda skott. Pizzerian har öppet till midnatt igen och fotbollsplanen är full på kvällarna. Men insatsstyrkan behövs i en annan stad nästa månad, och de boende frågar vad som händer när de sista polisbilarna kör därifrån.',
    choices: [
      { text: 'ÖPPNA EN FAST POLISSTATION I STADSDELEN', cost: { money: 250 }, perm: { safety: 2 }, griev: -6, ind: { policetrust: 3, feelsafe: 3 }, tip: 'Poliser som stannar lär sig vem som är vem. Det tar ett år och lönar sig i tio.' },
      { text: 'LÅT FRITIDSGÅRDEN TA ÖVER EFTER POLISEN', cost: { money: 100 }, temp: { safety: 1, integration: 2 }, perm: { qol: 1 }, griev: -3, tip: 'Billigare än poliser. Ungdomarna föredrar dessutom pingisbordet.' },
      { text: 'DRA TILLBAKA STYRKAN ENLIGT PLAN', temp: { safety: -1 }, griev: 3, next: [null, 'br_gang_konflikt_hamnd'], tip: 'Planen skrevs innan någon visste att den fungerade.' },
    ],
  },
  {
    id: 'br_gang_konflikt_fred', icon: '\u{1F9BA}', chain: true, kind: 'trygghet',
    title: 'FÖRÄLDRARNA SOM STOPPADE KRIGET',
    text: 'Det som till slut fick skotten att tystna i {stad} var en grupp föräldrar. Varje kväll i två månader har de gått runt i stadsdelen i gula västar, pratat med tonåringarna och bjudit på kaffe vid kiosken. Polisen säger att rekryteringen har stannat av. Föräldragruppen vill ha en lokal, ett bidrag och att någon i {huvudstad} lyssnar.',
    choices: [
      { text: 'GE DEM EN LOKAL OCH ETT FAST BIDRAG', cost: { money: 80 }, perm: { safety: 1, integration: 1 }, griev: -6, ind: { feelsafe: 3, gangs: -5 }, tip: 'Den billigaste polisinsatsen i landets historia. Den har inga blåljus.' },
      { text: 'BJUD IN DEM TILL REGERINGEN', cost: { pp: 5 }, temp: { approval: 4 }, griev: -4, ind: { trustgov: 2 }, tip: 'De kommer i gula västar. Protokollchefen får andnöd.' },
      { text: 'TACKA DEM I ETT PRESSMEDDELANDE', temp: { approval: 1 }, griev: -1, tip: 'Ett pressmeddelande värmer ungefär som en gul väst i januari.' },
    ],
  },
  {
    id: 'br_skjutvag', icon: '\u{1F4CD}', weight: 2, cooldown: 700, kind: 'trygghet', react: true,
    title: 'SKJUTNINGSVÅGEN',
    text: 'Fyra skottlossningar på sju dagar, i tre olika städer. Polisen tror att det hänger ihop: ett nätverk som splittrades när ledaren greps i våras. Två personer har skadats, och nyhetssändningarna börjar varje kväll med en karta full av röda prickar. Rikspolischefen vill ha extra pengar till övertid och spaning.',
    when: (c) => (c.ind.shootings ?? 1) > 3 && c.trend('shootings') > 0.1,
    choices: [
      { text: 'BEVILJA ÖVERTID OCH SPANING', cost: { money: 300 }, temp: { safety: 3 }, griev: -5, ind: { shootings: -15, murdersolved: 3 }, tip: 'Poliser på övertid griper folk. Poliser på övertid i ett år säger upp sig.' },
      { text: 'LÅT POLISEN SPARA ALLAS TELEFONTRAFIK', cost: { pp: 12 }, law: ['surveillance', 'retention'], temp: { safety: 3, freedom: -3 }, griev: -6, ind: { shootings: -18 }, tip: 'Det fungerar. Det är också exakt vad kritikerna sa att det skulle användas till.' },
      { text: 'UPPMANA ALLMÄNHETEN ATT TIPSA', temp: { approval: -1 }, griev: 4, ind: { feelsafe: -3 }, tip: 'Tipstelefonen ringer i ett. Hälften av samtalen gäller grannens hund.' },
    ],
  },
  {
    id: 'br_sprangning_trapphus', icon: '\u{1F4A5}', weight: 2, cooldown: 700, kind: 'trygghet',
    title: 'SPRÄNGNINGEN I TRAPPHUSET',
    text: 'En kraftig smäll väckte ett helt kvarter i {stad} strax efter tre i natt. Någon hade placerat en sprängladdning vid en lägenhetsdörr. Ingen skadades, men fönster krossades i tre hus och fyrtio personer fick sova i en skolmatsal. Det var fel dörr, tror polisen. Det är den femte sprängningen i landet sedan nyår.',
    when: (c) => (c.ind.bombings ?? 0.1) > 0.4 && c.day > 20,
    choices: [
      { text: 'BYGG UT BOMBTEKNIKERNA OCH SPÅRSÄKRINGEN', cost: { money: 250 }, temp: { safety: 2 }, griev: -4, ind: { bombings: -20, murdersolved: 2 }, tip: 'Teknikerna hittar spår i glassplittret. De är bara sju stycken.' },
      { text: 'STRAMA ÅT FÖRSÄLJNINGEN AV SPRÄNGÄMNEN', cost: { pp: 8 }, temp: { safety: 2, factory: -1 }, griev: -3, ind: { bombings: -15 }, tip: 'Stenbrotten får fylla i tre nya blanketter. De älskar blanketter.' },
      { text: 'BETALA GLAS OCH HOTELLNÄTTER ÅT DE BOENDE', cost: { money: 60 }, temp: { approval: 2 }, griev: -2, tip: 'Nya fönster lagar inte rädslan, men det blir mindre kallt.' },
      { text: 'SÄG ATT DET ÄR EN UPPGÖRELSE MELLAN KRIMINELLA', temp: { approval: -2 }, griev: 5, ind: { feelsafe: -3 }, tip: 'De som sov i skolmatsalen var inte kriminella.' },
    ],
  },
  {
    id: 'br_sprangning_centrum', icon: '\u{1F3DA}\u{FE0F}', weight: 1, cooldown: 1000, kind: 'trygghet',
    title: 'SMÄLLEN I {HUVUDSTAD}',
    text: 'I natt exploderade en laddning vid entrén till en restaurang i centrala {huvudstad}, några kvarter från regeringskansliet. Ingen var på plats och ingen skadades, men bilderna på den trasiga fasaden har visats i {land} och {granne}. Två länder har ändrat sina reseråd. Ägaren har vägrat betala "hyra" till ett gäng i ett halvår.',
    when: (c) => (c.ind.bombings ?? 0.1) > 0.9 || ((c.ind.bombings ?? 0.1) > 0.5 && (c.ind.extortion ?? 5) > 15),
    choices: [
      { text: 'GÖR UTPRESSNING AV FÖRETAG TILL ETT GROVT BROTT', cost: { pp: 10 }, temp: { safety: 2 }, griev: -5, ind: { bombings: -15 }, tip: 'Krögarna får en lag på sin sida. De skulle också vilja ha en polis.' },
      { text: 'BEVAKA DE UTSATTA RESTAURANGERNA', cost: { money: 200 }, temp: { safety: 3 }, griev: -4, ind: { bombings: -20, tourists: 2 }, tip: 'Turisterna tycker att poliser utanför restaurangen är pittoreskt.' },
      { text: 'TONA NER DET FÖR TURISMENS SKULL', temp: { approval: -2 }, rel: -1, griev: 4, ind: { tourists: -8 }, tip: 'Bilderna finns redan på nätet. Där hörs inte tonen.' },
    ],
  },
  {
    id: 'br_tonar_varvning', icon: '\u{1F4F1}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'GÄNGEN VÄRVAR I CHATTEN',
    text: 'Socialtjänsten i {stad} slår larm: gängen värvar tonåringar i chattappar. De erbjuder pengar för "enkla jobb" som att förvara en väska eller cykla med ett paket, och betalar med märkeskläder. Flera av dem som tackat ja är bara femton år. Fältarbetarna säger att det som saknas är sommarjobb, inte fler varningar.',
    when: (c) => (c.ind.gangs ?? 60) > 70 && (c.ind.youthunemp ?? 10) > 12,
    choices: [
      { text: 'SOMMARJOBB TILL ALLA FEMTONÅRINGAR I UTSATTA OMRÅDEN', cost: { money: 200 }, temp: { integration: 2 }, griev: -2, ind: { youthunemp: -1 }, next: 'br_tonar_sommar', tip: 'Ett sommarjobb betalar sämre än gänget. Men ingen blir hotad i en park.' },
      { text: 'SÄNK STRAFFBARHETSÅLDERN TILL TOLV', cost: { pp: 12 }, law: ['juvenile_justice', 'age12'], temp: { safety: 1, freedom: -2 }, griev: -4, tip: 'Gängen börjar fråga elvaåringar i stället. Det säger i alla fall polisen.' },
      { text: 'KRÄV ATT APPFÖRETAGEN STÄNGER KONTONA', rel: -1, temp: { safety: 1 }, ind: { gangs: -2 }, tip: 'Kontona stängs på fredag. På lördag finns det nya.' },
    ],
  },
  {
    id: 'br_tonar_sommar', icon: '\u{2600}\u{FE0F}', chain: true, kind: 'trygghet',
    title: 'SOMMAREN UTAN VÄSKOR',
    text: 'Tretusen tonåringar i {stad} och grannkommunerna har jobbat i parker, på äldreboenden och i fotbollsklubbar i sommar. Polisen ser färre unga i de kända gängen, och flera chefer vill anställa sina sommarjobbare igen. Kommunen undrar om pengarna kommer nästa år också, eller om det var en engångssatsning inför valet.',
    choices: [
      { text: 'GÖR SOMMARJOBBEN PERMANENTA I HELA LANDET', cost: { money: 250 }, perm: { safety: 1, integration: 1 }, griev: -4, ind: { gangs: -5, youthunemp: -1 }, tip: 'Inget band klipps, ingen tv filmar. Det syns först i statistiken om fem år.' },
      { text: 'FORTSÄTT BARA I {STAD}', cost: { money: 80 }, temp: { safety: 1 }, griev: -1, ind: { gangs: -2 }, tip: 'Grannkommunen undrar varför deras femtonåringar är mindre värda.' },
      { text: 'LÅT SATSNINGEN TA SLUT', res: { money: 60 }, griev: 4, ind: { gangs: 3 }, tip: 'Gänget har inget budgetår. Det anställer året runt.' },
    ],
  },
  {
    id: 'br_mamman', icon: '\u{1F469}', weight: 2, cooldown: 1100, kind: 'trygghet',
    title: 'MAMMAN SOM VÅGADE VITTNA',
    text: 'En mamma i {stad} har bestämt sig för att vittna om skottlossningen utanför hennes port. Hon såg allt från balkongen, och hon är den första i stadsdelen på två år som säger något. Åklagaren säger att målet står och faller med henne. Hon och hennes familj behöver skydd, och nya hot har redan kommit i brevlådan.',
    when: (c) => (c.ind.gangs ?? 50) > 120 && (c.ind.murdersolved ?? 50) < 60 && c.day > 40,
    choices: [
      { text: 'GE FAMILJEN FULLT VITTNESSKYDD', cost: { money: 180 }, griev: -3, ind: { murdersolved: 3 }, next: 'br_mamman_domen', tip: 'Ny adress, nytt namn, ny skola åt barnen. Ett helt liv att börja om.' },
      { text: 'LÅT HENNE VITTNA ANONYMT BAKOM EN SKÄRM', cost: { pp: 8 }, temp: { freedom: -1 }, tip: 'Rättssäkerheten och vittnets säkerhet drar åt olika håll.',
        risk: { chance: 0.6,
          win: { text: 'Hon vittnar bakom skärmen. Försvaret protesterar, men domstolen tillåter det.', griev: -3, ind: { murdersolved: 3 } },
          lose: { text: 'Försvaret räknar ut vem hon är. Hon drar tillbaka sitt vittnesmål.', griev: 4, ind: { feelsafe: -2 } } } },
      { text: 'STANDARDSKYDDET FÅR RÄCKA', tip: 'Standardskyddet är ett telefonnummer och en broschyr.',
        risk: { chance: 0.4,
          win: { text: 'Hon vittnar ändå. Hela stadsdelen talar om hennes mod.', griev: -2, ind: { murdersolved: 2 } },
          lose: { text: 'Hoten blev för många. Hon flyttar och vittnar inte.', griev: 5, ind: { feelsafe: -3, murdersolved: -2 } } } },
    ],
  },
  {
    id: 'br_mamman_domen', icon: '\u{2696}\u{FE0F}', chain: true, kind: 'trygghet',
    title: 'DOMEN EFTER VITTNESMÅLET',
    text: 'Tre unga män har dömts för skottlossningen i {stad}, och domstolen skriver att mammans vittnesmål var avgörande. Sedan domen har fyra vittnen i andra mål hört av sig till polisen. Kvällstidningarna kallar henne "kvinnan på balkongen". Själv vill hon helst inte kallas något alls, bara få bo i fred.',
    choices: [
      { text: 'GÖR VITTNESSKYDDET TILL EN EGEN MYNDIGHET', cost: { money: 300 }, perm: { safety: 2 }, griev: -5, ind: { murdersolved: 6, darkfigure: -2 }, tip: 'Det modigaste vittnet ska inte behöva vara ensamt. Det kostar en myndighet.' },
      { text: 'GE HENNE EN MEDALJ I TYSTHET', cost: { pp: 4 }, temp: { approval: 2 }, griev: -3, ind: { policetrust: 2 }, tip: 'Medaljen ligger i en byrålåda på en adress som ingen känner till.' },
      { text: 'LÅT HENNE VARA I FRED', temp: { stability: 1 }, griev: -2, ind: { murdersolved: 2 }, tip: 'Ibland är det finaste en stat kan göra att glömma ett namn.' },
    ],
  },
  {
    id: 'br_kronvittnet', icon: '\u{1F451}', weight: 1, cooldown: 1500, kind: 'trygghet',
    title: 'KRONVITTNET',
    text: 'En av de högsta i ett av landets största kriminella nätverk har kontaktat åklagaren. Han erbjuder sig att berätta allt: vilka som beställt skjutningarna, var pengarna finns och vilka poliser som läcker. I gengäld vill han ha kraftig strafflindring och en ny identitet utomlands. Landet har aldrig haft en lag om kronvittnen.',
    when: (c) => ((c.ind.gangs ?? 50) > 110 || (c.ind.gangmurders ?? 20) > 45) && (c.ind.murdersolved ?? 50) < 75 && c.day > 100,
    choices: [
      { text: 'GÅ MED PÅ AVTALET', cost: { pp: 15 }, temp: { approval: -2 }, griev: -3, ind: { murdersolved: 6, gangs: -6 }, next: 'br_kronvittnet_rattegang', tip: 'Han slipper undan med det han gjort. Tjugo andra gör det inte.' },
      { text: 'STIFTA EN LAG OM KRONVITTNEN FÖRST', cost: { pp: 25 }, perm: { freedom: -1 }, griev: -4, ind: { murdersolved: 8 }, next: [null, 'br_kronvittnet_rattegang'], tip: 'Lagen tar ett år. Han är kanske inte kvar om ett år.' },
      { text: 'INGA AVTAL MED GÄNGLEDARE', temp: { approval: 2 }, griev: 2, ind: { murdersolved: -2 }, tip: 'Principer är dyra. Den här betalas med ouppklarade mord.' },
    ],
  },
  {
    id: 'br_kronvittnet_rattegang', icon: '\u{1F3DB}\u{FE0F}', chain: true, kind: 'trygghet',
    title: 'DEN STORA GÄNGRÄTTEGÅNGEN',
    text: 'Trettioen åtalade, sextio advokater och ett kronvittne som vittnar via länk från en hemlig plats. Rättegången i {huvudstad} ska pågå i fem månader och hållas i en ombyggd idrottshall med skottsäkert glas. Försvaret säger att kronvittnet ljuger för att rädda sig själv. Hela landet följer målet.',
    choices: [
      { text: 'BYGG EN SÄKER RÄTTSSAL OCH GE MÅLET ALLT DET BEHÖVER', cost: { money: 400 }, tip: 'Bra säkerhet ändrar inte vad ett vittne minns.',
        risk: { chance: 0.7,
          win: { text: 'Tjugosex av trettioen döms. Nätverket är i praktiken krossat.', griev: -8, temp: { safety: 4 }, ind: { gangs: -15, shootings: -15 } },
          lose: { text: 'Kronvittnet motsäger sig själv. Hälften av de åtalade frias.', griev: 6, ind: { policetrust: -4 } } } },
      { text: 'KÖR MÅLET I EN VANLIG TINGSRÄTT', tip: 'Tingsrätten i {huvudstad} har ett kafé och en bakdörr.',
        risk: { chance: 0.45,
          win: { text: 'Domstolen dömer de flesta. Det gick, mot alla odds.', griev: -6, ind: { gangs: -10 } },
          lose: { text: 'Två åtalade försvinner under en paus. Målet faller ihop.', griev: 8, temp: { safety: -3 }, ind: { policetrust: -5 } } } },
    ],
  },
  {
    id: 'br_razzia', icon: '\u{1F681}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'STORRAZZIAN',
    text: 'Polisen har spanat på ett nätverk i {stad} i ett år och vill nu slå till mot sjutton adresser samtidigt: lägenheter, en bilverkstad och ett lager. Det kräver fyrahundra poliser från hela landet, en helikopter och hundar. Om något läcker ut i förväg är ett års arbete förstört. Rikspolischefen behöver ditt besked i dag.',
    when: (c) => (c.ind.gangs ?? 50) > 80 && (c.ind.drugcrime ?? 30) > 30,
    choices: [
      { text: 'GÅ PÅ ALLA SJUTTON ADRESSER', cost: { money: 200, pp: 6 }, next: 'br_razzia_efter', tip: 'Fyrahundra poliser som vet samma hemlighet. Vad kan gå fel?',
        risk: { chance: 0.65,
          win: { text: 'Fyrtio gripna, tolv vapen och tre miljoner i kontanter. Bilderna går runt jorden.', griev: -8, temp: { safety: 3 }, ind: { gangs: -12, drugcrime: -10 } },
          lose: { text: 'Hälften av lägenheterna var tomma. Någon hade varnat dem kvällen innan.', griev: 3, ind: { policetrust: -4 } } } },
      { text: 'SLÅ TILL MOT DE FYRA VIKTIGASTE ADRESSERNA', cost: { money: 80 }, griev: -3, ind: { gangs: -5, drugcrime: -5 }, next: [null, 'br_razzia_efter'], tip: 'Mindre glans, mindre risk. Ledarna bor sällan på de viktigaste adresserna.' },
      { text: 'VÄNTA OCH SPANA VIDARE', temp: { safety: -1 }, griev: 2, ind: { murdersolved: 2 }, tip: 'Ett år till av spaning. Ett år till av skottlossningar.' },
    ],
  },
  {
    id: 'br_razzia_efter', icon: '\u{1F4CB}', chain: true, kind: 'trygghet',
    title: 'ETT HALVÅR EFTER RAZZIAN',
    text: 'Polisens uppföljning är klar. Efter tillslaget i {stad} blev det lugnare i några månader, men nu har nätverket fyllts på med yngre förmågor som tar de gripnas platser. "Vi tog toppen, men pyramiden står kvar", säger en polischef. Socialtjänsten vill satsa på de yngsta innan de hinner värvas.',
    choices: [
      { text: 'SATSA PÅ DE YNGSTA: SKOLA, FRITID OCH FAMILJESTÖD', cost: { money: 250 }, perm: { safety: 1, integration: 1 }, griev: -2, ind: { gangs: -6 }, tip: 'Det är svårt att gripa en pyramid. Det går att låta bli att bygga den.' },
      { text: 'GÅ VIDARE MED NÄSTA RAZZIA', cost: { money: 150 }, temp: { safety: 2 }, griev: -3, ind: { gangs: -5 }, tip: 'Razzior är som gräsklippning. Det ser fint ut i två veckor.' },
      { text: 'BESLAGTA GÄNGENS PENGAR OCH BILAR', cost: { pp: 10 }, res: { money: 120 }, griev: -4, ind: { gangs: -4 }, tip: 'En förlorad bil svider mer än ett år i fängelse, säger forskarna.' },
      { text: 'LÅT POLISEN ARBETA SOM VANLIGT', griev: 2, ind: { gangs: 3 }, tip: 'Pyramiden tackar för förtroendet.' },
    ],
  },
  {
    id: 'br_utlandsledare', icon: '\u{1F3D6}\u{FE0F}', weight: 1, cooldown: 1200, kind: 'trygghet',
    title: 'LEDAREN SOM STYR FRÅN {LAND}',
    text: 'Polisen vet vem som beställer skjutningarna i {stad}: en trettiofyraåring som bor i en villa med pool i {land}. Han styr sina unga följare via krypterade appar och betalar dem i kryptovaluta. {land} har inget utlämningsavtal med {rike}, och han lägger ut bilder från sin balkong med solglasögon och kaffe.',
    when: (c) => (c.ind.gangs ?? 50) > 130 && (c.ind.shootings ?? 1) > 3,
    choices: [
      { text: 'BETALA FÖR ETT UTLÄMNINGSAVTAL MED {LAND}', cost: { money: 400 }, rel: 2, griev: -6, ind: { shootings: -15, gangs: -6 }, next: 'br_utlandsledare_hem', tip: 'Avtalet kostar ett vägbygge i {land}. Han kostar mer.' },
      { text: 'FRYS HANS TILLGÅNGAR OCH SPÄRRA HANS PASS', cost: { pp: 8 }, griev: -2, ind: { gangs: -3 }, tip: 'Han har tre pass. Ett av dem är äkta.' },
      { text: 'KRÄV OFFENTLIGT ATT {LAND} LÄMNAR UT HONOM', rel: -3, temp: { approval: 2 }, griev: -1, tip: 'Diplomater ogillar megafoner. Väljare gillar dem.' },
    ],
  },
  {
    id: 'br_utlandsledare_hem', icon: '\u{2708}\u{FE0F}', chain: true, kind: 'trygghet',
    title: 'UTLÄMNAD',
    text: 'Planet från {land} landade i {huvudstad} strax efter midnatt. Mannen som styrt skjutningarna i {stad} från sin balkong kom ut i handfängsel, utan solglasögon. Polisen säger att hans nätverk redan bråkar om vem som ska ta över. Åklagaren vill ha ett år på sig och fler utredare för att få fram alla bevis.',
    choices: [
      { text: 'GE ÅKLAGAREN ALLT DEN BEHÖVER', cost: { money: 150 }, griev: -5, ind: { murdersolved: 6, gangs: -6 }, tip: 'Målet kommer att läsas på juristutbildningen. Gör det till ett bra exempel.' },
      { text: 'BEVAKA ARVSKRIGET I NÄTVERKET', cost: { money: 100 }, temp: { safety: 2 }, ind: { shootings: -8 }, tip: 'Ett nätverk utan ledare är farligast de första veckorna.' },
      { text: 'HÅLL PRESSKONFERENS PÅ FLYGPLATSEN', temp: { approval: 4 }, griev: -3, ind: { shootings: 5 }, tip: 'Segerminen retar efterträdarna. De vill också synas.' },
    ],
  },
  {
    id: 'br_smastad', icon: '\u{1F3D8}\u{FE0F}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'SMÄLLEN I SMÅSTADEN',
    text: 'I en småstad med elvatusen invånare, där ingen brukar låsa cykeln, har det smällt två gånger på en månad. Polisen tror att ett nätverk från en större stad har börjat sälja narkotika där, eftersom konkurrensen är mindre. Närmaste polisstation ligger fyra mil bort och har öppet på vardagar mellan tio och tre.',
    when: (c) => (c.ind.gangs ?? 50) > 60 && c.crimeRise > 1.08,
    choices: [
      { text: 'ÖPPNA POLISSTATIONEN I STADEN IGEN', cost: { money: 220 }, perm: { safety: 1 }, griev: -6, ind: { policetrust: 3, feelsafe: 3 }, tip: 'Stationen som stängdes för sex år sedan står tom. Skylten sitter kvar.' },
      { text: 'SKICKA EN MOBIL POLISENHET', cost: { money: 90 }, temp: { safety: 2 }, griev: -3, ind: { drugcrime: -5 }, tip: 'En polisbuss på torget varannan tisdag. Langarna kan också läsa ett schema.' },
      { text: 'LÅT KOMMUNEN ANSTÄLLA VÄKTARE', temp: { approval: -2 }, griev: 4, ind: { feelsafe: -2 }, tip: 'Väktarna får inte gripa någon. De får titta strängt.' },
    ],
  },
  {
    id: 'br_gang_fred_marknad', icon: '\u{1F914}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'VARFÖR TYSTNADE SKOTTEN?',
    text: 'Skjutningarna har minskat kraftigt det senaste året, och regeringen tar gärna åt sig äran. Men polisens underrättelsetjänst har en annan förklaring: de stora nätverken har delat upp marknaden mellan sig. De skjuter inte längre på varandra, men narkotikan säljs som förut och de tjänar mer än någonsin.',
    when: (c) => (c.ind.gangs ?? 50) > 60 && c.trend('shootings') < -0.1,
    choices: [
      { text: 'ANVÄND LUGNET TILL ATT ANGRIPA DERAS PENGAR', cost: { money: 200 }, griev: -3, ind: { gangs: -8, drugcrime: -8 }, tip: 'Gäng som inte skjuter har tid att räkna pengar. Det har skattemyndigheten också.' },
      { text: 'TA ÅT DIG ÄRAN', temp: { approval: 4 }, griev: -2, ind: { trustgov: 2 }, tip: 'Statistiken har aldrig frågat vem som förtjänade den.' },
      { text: 'VARNA FÖR ATT FREDEN ÄR SKÖR', cost: { pp: 3 }, temp: { stability: 2 }, ind: { trustgov: 1 }, tip: 'Den ärligaste presskonferensen på länge. Ingen lyssnade efter första minuten.' },
    ],
  },
  {
    id: 'br_vapen_tullen', icon: '\u{1F69A}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'VAPNEN I LASTBILENS DÄCK',
    text: 'Tullen i {stad} stoppade i går en lastbil från {land}. I reservdäcken låg fyrtio automatvapen och ammunition, inslagna i plast. Föraren säger att han inte visste något. Tullen gissar att de stoppar en av tio sådana transporter och vill ha röntgenscanners vid alla gränsstationer.',
    when: (c) => (c.ind.weapons ?? 20) > 60 && (c.ind.shootings ?? 1) > 2,
    choices: [
      { text: 'KÖP RÖNTGENSCANNERS TILL ALLA GRÄNSSTATIONER', cost: { money: 300 }, temp: { safety: 2 }, griev: -3, ind: { shootings: -10 }, tip: 'Scannern ser genom däck, lådor och lögner. Inte genom mutor.' },
      { text: 'GEMENSAM GRÄNSKONTROLL MED {LAND}', cost: { pp: 10 }, rel: 3, griev: -2, ind: { shootings: -6 }, tip: '{land} säger ja. Det gör de alltid i början.' },
      { text: 'HYLLA TULLEN OFFENTLIGT', temp: { approval: 2 }, ind: { shootings: -2 }, tip: 'Tullarna blir glada. De nio andra lastbilarna också.' },
    ],
  },
  {
    id: 'br_bygge_utpressning', icon: '\u{1F3D7}\u{FE0F}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'GÄNGET VILL HA EN DEL AV BYGGET',
    text: 'Ett byggföretag som bygger ett nytt sjukhus i {stad} har fått besök av två män som erbjöd "skydd" för bygget. Veckan efter brann tre arbetsmaskiner. Nu vägrar två underentreprenörer att fortsätta, och bygget ligger fyra månader efter. Företaget vill att staten sätter in polis på bygget och ersätter förlusterna.',
    when: (c) => (c.ind.extortion ?? 5) > 8 && (c.ind.laborcrime ?? 6) > 8,
    choices: [
      { text: 'SÄTT IN POLIS OCH VÄKTARE PÅ BYGGET', cost: { money: 150 }, temp: { safety: 2 }, griev: -3, tip: 'Sjukhuset blir landets bäst bevakade bygge. Det är ingen merit.' },
      { text: 'KRÄV ID-KORT OCH KONTROLLER PÅ ALLA BYGGEN', cost: { pp: 8 }, temp: { safety: 1, income: 1 }, griev: -2, ind: { gangs: -3 }, tip: 'De två männen hade inga id-kort. Det hade ingen annan heller förut.' },
      { text: 'LÅT FÖRETAGET LÖSA DET SJÄLVT', temp: { qol: -1 }, griev: 4, ind: { gangs: 3 }, tip: 'Företaget löser det. Frågan är hur.' },
    ],
  },
  {
    id: 'br_avhoppare', icon: '\u{1F6AA}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'FYRTIO VILL HOPPA AV',
    text: 'En ideell förening i {stad} har kontakt med fyrtio unga män som vill lämna sina gäng. De behöver en lägenhet i en annan stad, hjälp med skulder och tatueringar och någon som hjälper dem till ett jobb. Föreningen ber om pengar till ett avhopparprogram. Oppositionen kallar det att belöna kriminella.',
    when: (c) => (c.ind.gangs ?? 50) > 90 && c.st.welfare > -30 && c.day > 60,
    choices: [
      { text: 'FINANSIERA AVHOPPARPROGRAMMET', cost: { money: 160 }, temp: { approval: -1 }, griev: -2, ind: { gangs: -5 }, next: 'br_avhoppare_ar', tip: 'Varje avhoppare är en mindre som kan bli skjuten, och en mindre som skjuter.' },
      { text: 'BARA FÖR DEM SOM VITTNAR MOT SINA GAMLA GÄNG', cost: { pp: 6 }, griev: -2, ind: { gangs: -2, murdersolved: 3 }, tip: 'Det blir färre avhoppare, men de som kommer pratar.' },
      { text: 'INGA PENGAR TILL KRIMINELLA', temp: { approval: 1 }, griev: -1, ind: { gangs: 3 }, tip: 'Applåder i debatten. Gänget behåller fyrtio medlemmar.' },
    ],
  },
  {
    id: 'br_avhoppare_ar', icon: '\u{26BD}', chain: true, kind: 'trygghet',
    title: 'ETT ÅR MED AVHOPPARNA',
    text: 'Utvärderingen av avhopparprogrammet är klar. Trettioen av de fyrtio har inte återfallit i brott, nitton har jobb och en av dem tränar ett pojklag i fotboll i sin nya stad. Sju är tillbaka i sina gamla gäng. Forskarna kallar det ett ovanligt bra resultat, och föreningen vill göra programmet nationellt.',
    choices: [
      { text: 'GÖR PROGRAMMET NATIONELLT', cost: { money: 300 }, perm: { safety: 1 }, griev: -3, ind: { gangs: -8 }, tip: 'Trettioen av fyrtio. De flesta fängelser drömmer om sådana siffror.' },
      { text: 'BEHÅLL DET SOM DET ÄR', cost: { money: 60 }, griev: -1, ind: { gangs: -2 }, tip: 'Ett lyckat försök som förblir ett försök. En klassiker.' },
      { text: 'LÄGG NER DET, SJU ÅTERFALL ÄR FÖR MÅNGA', res: { money: 80 }, griev: 2, ind: { gangs: 4 }, tip: '"Sju tillbaka i gänget" säljer bättre än "trettioen kvar i jobbet".' },
    ],
  },
  {
    id: 'br_krypto_appen', icon: '\u{1F513}', rare: true, cooldown: 1500, kind: 'trygghet',
    title: 'POLISEN KNÄCKTE APPEN',
    text: 'Polisen i {land} har knäckt en krypterad chattapp som kriminella i flera länder trodde var omöjlig att avlyssna. {rike} har fått tillgång till tre miljoner meddelanden om beställda skjutningar, narkotikaleveranser och mutor, med namn och klockslag. Polisen räknar med över trehundra misstänkta. Det är mer än domstolarna klarar på flera år.',
    when: (c) => (c.ind.gangs ?? 50) > 80 && (c.ind.internet ?? 60) > 50 && c.day > 150,
    choices: [
      { text: 'PRIORITERA ALLA MÅL, KOSTA VAD DET VILL', cost: { money: 400 }, griev: -8, ind: { murdersolved: 8, gangs: -12, shootings: -15 }, next: 'br_appen_domstolar', tip: 'Tre miljoner meddelanden, och alla skrev som om ingen läste.' },
      { text: 'TA DE GROVASTE MÅLEN FÖRST', cost: { money: 120 }, griev: -4, ind: { murdersolved: 4, gangs: -5 }, tip: 'Resten preskriberas i lugn och ro.' },
      { text: 'VÄNTA PÅ BESKED OM BEVISEN HÅLLER', temp: { freedom: 1 }, griev: 3, ind: { murdersolved: 1 }, tip: 'Försvaret säger att avlyssningen var olaglig. Svaret tar två år.' },
    ],
  },
  {
    id: 'br_appen_domstolar', icon: '\u{1F4DA}', chain: true, kind: 'trygghet',
    title: 'DOMSTOLARNA DRUNKNAR',
    text: 'Trehundrafyrtio åtal på ett halvår. Tingsrätterna har skjutit upp tvistemål och skilsmässor för att hinna med, och häktena är fulla av män som väntar på sina rättegångar. Domarna säger att de inte kan döma snabbare utan att döma fel. Advokaterna varnar för att det redan går för fort.',
    choices: [
      { text: 'ANSTÄLL SEXTIO DOMARE OCH ÅKLAGARE', cost: { money: 350 }, temp: { stability: 2 }, griev: -4, ind: { prisonocc: 5 }, tip: 'Domare växer inte på träd. De växer på juristprogrammet, i fem år.' },
      { text: 'INFÖR SNABBARE RÄTTEGÅNGAR', cost: { pp: 12 }, law: ['trials', 'speedup'], temp: { freedom: -2 }, griev: -3, tip: 'Fler domar per dag. Hovrätten får ta hand om resten.' },
      { text: 'LÅT KÖERNA VÄXA', temp: { qol: -1 }, griev: 4, ind: { prisonocc: 8 }, tip: 'Skilsmässorna får vänta. Paren tackar inte.' },
    ],
  },
  {
    id: 'br_gangmord_rapport', icon: '\u{1F4CA}', weight: 2, cooldown: 1200, kind: 'trygghet',
    title: 'HÄLFTEN AV MORDEN ÄR GÄNGRELATERADE',
    text: 'Brottsforskarnas årsrapport har kommit: nästan hälften av alla mord i {rike} har en koppling till kriminella nätverk. För tjugo år sedan var det ett av tio. Rapporten visar också att offren oftast är unga män från några få stadsdelar, och att de flesta gärningsmän är under tjugofem.',
    when: (c) => (c.ind.gangmurders ?? 20) > 48 && (c.ind.homicide ?? 1) > 1,
    choices: [
      { text: 'UTSE EN NATIONELL SAMORDNARE MOT GÄNGVÅLDET', cost: { pp: 10 }, temp: { stability: 2 }, griev: -5, ind: { trustgov: 2, murdersolved: 3 }, tip: 'Samordnaren får ett kontor, en titel och fyrtio myndigheter som inte vill samordnas.' },
      { text: 'SATSA PÅ DE FÅ STADSDELARNA', cost: { money: 300 }, perm: { integration: 1, safety: 1 }, griev: -3, ind: { gangs: -5 }, tip: 'Problemet bor på några få adresser. Det gör lösningen också.' },
      { text: 'SKYLL PÅ FÖREGÅENDE REGERING', temp: { approval: 1 }, griev: 4, ind: { trustgov: -2 }, tip: 'Tjugo år av rapporter, och alla har haft en föregående regering.' },
    ],
  },
  {
    id: 'br_folj_pengarna', icon: '\u{1F4B0}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'FÖLJ PENGARNA',
    text: 'En ny rapport från finanspolisen visar att gängen i {rike} tvättar miljarder genom pizzerior, bilfirmor, växlingskontor och fastigheter. Ledarna äger nästan ingenting i sitt eget namn. Polisen vill få rätt att beslagta egendom när ägaren inte kan förklara hur den köpts, utan att först bevisa ett brott.',
    when: (c) => (c.ind.gangs ?? 50) > 90 && (c.ind.moneylaundering ?? 2) > 3.5,
    choices: [
      { text: 'INFÖR BESLAG AV OFÖRKLARAD EGENDOM', cost: { pp: 14 }, temp: { freedom: -2 }, res: { money: 200 }, griev: -6, ind: { gangs: -8 }, tip: 'Den som kör lyxbil på en lagerarbetarlön får förklara sig.' },
      { text: 'GE FINANSPOLISEN FLER UTREDARE', cost: { money: 180 }, griev: -3, ind: { gangs: -5 }, tip: 'Ekonomer som jagar ekonomer. Gängens ekonomer har bättre lön.' },
      { text: 'RUCKA INTE PÅ RÄTTSSÄKERHETEN', temp: { freedom: 1 }, griev: 2, ind: { gangs: 2 }, tip: 'Bevisbördan är en hörnsten i rättsstaten. Gängens revisorer vet det.' },
    ],
  },
  {
    id: 'br_bilbrander', icon: '\u{1F692}', weight: 2, cooldown: 800, kind: 'trygghet',
    title: 'BILBRÄNDERNA I {STAD}',
    text: 'Fjorton bilar brann i natt i en stadsdel i {stad}. Brandkåren fick vänta på polisskydd innan den kunde släcka, eftersom en grupp tonåringar kastade sten. Ingen skadades. Bilarna tillhörde mest grannar som åker till jobbet med dem. En av ungdomarna säger till en reporter att ingen bryr sig om dem ändå.',
    when: (c) => (c.ind.exclusion ?? 2) > 2.5 && (c.ind.youthunemp ?? 10) > 12,
    choices: [
      { text: 'ERSÄTT BILÄGARNA OCH ÖPPNA EN FRITIDSGÅRD', cost: { money: 150 }, temp: { integration: 2 }, griev: -3, ind: { segreg: -1 }, tip: 'Grannarna får nya bilar och tonåringarna en lokal. Båda behövdes.' },
      { text: 'GE BRANDKÅREN POLISSKYDD VID VARJE LARM', cost: { money: 80 }, temp: { safety: 2, integration: -1 }, griev: -2, tip: 'Brandmännen vill släcka bränder, inte stå mitt i en konflikt.' },
      { text: 'KALLA DET BUSSTRECK', temp: { approval: -2 }, griev: 4, ind: { feelsafe: -2 }, tip: 'Grannarna åker till jobbet i morgon. Två timmar med buss.' },
    ],
  },

  // ===== NARKOTIKAN =====
  {
    id: 'br_hamnbeslag', icon: '\u{1F6A2}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'REKORDBESLAGET I HAMNEN',
    text: 'Tullen i {stad} hittade i natt nästan två ton kokain gömt bland banankartonger i en container från {land}. Det är det största beslaget i landets historia. Tullens chef berättar stolt att de undersöker en av hundra containrar. Hon säger också, lite tystare, att det betyder att nittionio går igenom.',
    when: (c) => (c.ind.drugcrime ?? 30) > 55 && (c.ind.druguse ?? 3) > 2.5,
    choices: [
      { text: 'KÖP FLER SCANNERS OCH ANSTÄLL TULLARE', cost: { money: 250 }, temp: { safety: 1 }, griev: -3, ind: { drugcrime: -10, druguse: -0.2 }, tip: 'Två av hundra i stället för en av hundra. Det låter bättre i budgetdebatten än i hamnen.' },
      { text: 'GRANSKA HAMNARBETARNA', cost: { pp: 8 }, temp: { corruption: -2 }, ind: { drugcrime: -5 }, next: 'br_hamn_insider', tip: 'Två ton tar sig inte igenom en hamn av sig själva.' },
      { text: 'VISA UPP BESLAGET PÅ EN PRESSKONFERENS', temp: { approval: 3 }, ind: { drugcrime: -2 }, next: [null, 'br_hamn_insider'], tip: 'Paketen på bordet blir årets mest delade bild.' },
    ],
  },
  {
    id: 'br_hamn_insider', icon: '\u{1F69B}', chain: true, kind: 'trygghet',
    title: 'HAMNARBETARNA PÅ LÖNELISTAN',
    text: 'Utredningen efter rekordbeslaget visar att tolv anställda i hamnen i {stad} har fått betalt för att flytta vissa containrar förbi kontrollen, ändra i datorsystemet och se åt andra hållet. En truckförare har tjänat mer på ett år än hamnchefen. Facket säger att de flesta hamnarbetare är ärliga och nu känner sig misstänkta.',
    choices: [
      { text: 'BAKGRUNDSKONTROLL FÖR ALLA SOM JOBBAR I HAMNARNA', cost: { money: 150, pp: 5 }, perm: { corruption: -2 }, griev: -3, ind: { drugcrime: -8 }, tip: 'De ärliga fyller i ett formulär. De oärliga betalar någon för att göra det åt dem.' },
      { text: 'SAMARBETA MED FACKET OM VISSELBLÅSARE', cost: { pp: 6 }, temp: { stability: 1 }, griev: -2, ind: { drugcrime: -5, policetrust: 2 }, tip: 'Ingen vet mer om vad som händer i en hamn än de som jobbar där.' },
      { text: 'ÅTALA DE TOLV OCH GÅ VIDARE', temp: { corruption: -1 }, griev: -1, ind: { drugcrime: -3 }, tip: 'Tolv platser blir lediga. Kartellen har redan börjat intervjua sökande.' },
    ],
  },
  {
    id: 'br_ny_drog', icon: '\u{1F48A}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'DEN NYA DROGEN',
    text: 'Sjukhusen i {stad} och {huvudstad} har på två veckor fått in ett tjugotal patienter som tagit en ny syntetisk drog, mångfalt starkare än heroin. Den säljs på nätet som "lugnande tabletter" och ser ut som vanlig medicin. Läkarna vill att alla poliser och ambulanser ska bära motgift och att drogen narkotikaklassas omedelbart.',
    when: (c) => (c.ind.druguse ?? 3) > 4.5 && (c.ind.drugdeaths ?? 1) > 2.5 && (c.ind.internet ?? 60) > 50,
    choices: [
      { text: 'NARKOTIKAKLASSA DROGEN I DAG', cost: { pp: 6 }, griev: -2, ind: { drugdeaths: -6 }, tip: 'Kemisterna byter ut en atom och säljer en ny drog nästa månad.' },
      { text: 'MOTGIFT TILL ALLA POLISER OCH AMBULANSER', cost: { money: 120 }, griev: -3, ind: { drugdeaths: -15 }, tip: 'En liten nässpray i varje uniformsficka. Den räddar fler än något tal.' },
      { text: 'VARNA PÅ NÄTET OCH I SKOLORNA', temp: { approval: 1 }, ind: { drugdeaths: -3 }, next: [null, 'br_overdoser_stad'], tip: 'Varningar läses mest av dem som redan var försiktiga.' },
    ],
  },
  {
    id: 'br_overdoser_stad', icon: '\u{1F691}', chain: true, kind: 'trygghet',
    title: 'ÖVERDOSERNA I {STAD}',
    text: 'Elva dödsfall på tre veckor. Den nya drogen har spridit sig från nätet till gatorna i {stad}, och socialarbetarna hittar den i samma påsar som annat. Ambulanserna i centrum hinner inte med på helgerna. Läkare, poliser och mammor till unga missbrukare har skrivit ett gemensamt upprop: gör något nu.',
    choices: [
      { text: 'MOTGIFT, SPRUTBYTE OCH FLER BEHANDLINGSPLATSER', cost: { money: 220 }, griev: -5, ind: { drugdeaths: -20 }, tip: 'Det kostar som en ny motorvägsbro. Det räddar fler liv än tio sådana.' },
      { text: 'SLÅ TILL MOT FÖRSÄLJARNA PÅ NÄTET', cost: { pp: 10 }, temp: { safety: 1 }, griev: -3, ind: { drugcrime: -10, drugdeaths: -6 }, tip: 'Sajterna stängs. Nya öppnar i ett annat land.' },
      { text: 'ANSVARET LIGGER HOS DEM SOM TAR DROGER', temp: { approval: -3 }, griev: 6, ind: { drugdeaths: 10 }, tip: 'Mammorna som skrev uppropet håller inte med.' },
    ],
  },
  {
    id: 'br_sprutbyte', icon: '\u{1F489}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'SPRUTBYTET SOM DELAR STADEN',
    text: 'Kommunen i {stad} vill öppna ett sprutbyte i en gammal vårdcentral, där missbrukare kan få rena sprutor, motgift och en väg in i vården. Läkarna säger att det minskar både dödsfall och smitta. Grannarna har samlat fyratusen namn emot. "Inte i vårt kvarter", står det på deras skyltar.',
    when: (c) => (c.ind.drugdeaths ?? 1) > 2.8 && !c.is('drugs', 'war', 'deathpenalty', 'detoxcamps'),
    choices: [
      { text: 'ÖPPNA SPRUTBYTET ENLIGT PLANEN', cost: { money: 80 }, griev: 3, ind: { drugdeaths: -10 }, tip: 'Läkarna jublar. Grannarna bjuder inte in dig till sommarfesten.' },
      { text: 'GÖR DET TILL EN BUSS SOM BYTER PLATS', cost: { money: 120 }, griev: -1, ind: { drugdeaths: -6 }, tip: 'En kompromiss på hjul. Ingen gillar den, alla accepterar den.' },
      { text: 'SÄG NEJ TILL SPRUTBYTET', temp: { approval: 1 }, griev: -2, ind: { drugdeaths: 6 }, tip: 'Grannarna är nöjda. De som skulle ha använt sprutbytet röstar sällan.' },
    ],
  },
  {
    id: 'br_tunneln', icon: '\u{1F345}', rare: true, cooldown: 1500, kind: 'trygghet',
    title: 'TUNNELN UNDER GRÄNSEN',
    text: 'Gränspolisen har hittat en fyrahundra meter lång tunnel under gränsen mot {granne}, med el, ventilation och små räls för vagnar. Den slutar i ett växthus för tomater på vår sida. Ingen vet hur länge den har använts. Tomatodlingen har enligt bokföringen gått med vinst i sju år utan att sälja en enda tomat.',
    when: (c) => (c.ind.drugcrime ?? 30) > 40 && (c.ind.smuggling ?? 5) > 6,
    choices: [
      { text: 'BEVAKA TUNNELN I HEMLIGHET', tip: 'Den som ser vem som går in vet vem som skickar.',
        risk: { chance: 0.5,
          win: { text: 'Spaningen avslöjar hela nätverket på båda sidor om gränsen.', griev: -6, ind: { drugcrime: -20, gangs: -8 } },
          lose: { text: 'De märker spaningen. Tunneln töms och växthuset står tomt nästa morgon.', griev: 3, ind: { drugcrime: 5 } } } },
      { text: 'GEMENSAM UTREDNING MED {GRANNE}', cost: { pp: 10 }, rel: 3, griev: -3, ind: { drugcrime: -10 }, tip: '{granne} har också en tunnelöppning att förklara.' },
      { text: 'GJUT IGEN DEN INFÖR KAMEROR', cost: { money: 60 }, temp: { approval: 3 }, griev: -2, ind: { drugcrime: -4 }, tip: 'Betongbilen blir kvällens tv. Tomaterna blir en följetong.' },
    ],
  },
  {
    id: 'br_kandisen', icon: '\u{1F4FA}', weight: 1, cooldown: 1200, kind: 'trygghet',
    title: 'KÄNDISEN SOM ÅKTE FAST',
    text: 'En av landets mest omtyckta programledare greps i natt på en krog i {huvudstad} med kokain i kavajfickan. Bilderna från gripandet finns överallt. Polisen påpekar torrt att det han köpte för en kväll har passerat genom samma nätverk som skjuter i förorterna. Hans tv-kanal har redan stängt av honom.',
    when: (c) => (c.ind.druguse ?? 3) > 3.8 && (c.ind.gangs ?? 50) > 50,
    choices: [
      { text: 'STARTA EN KAMPANJ OM KÖPARNAS ANSVAR', cost: { money: 60 }, griev: -2, ind: { druguse: -0.3 }, tip: 'Affischen visar en fin middag och ett trapphus. Mer behöver inte sägas.' },
      { text: 'SAMMA LAG FÖR ALLA, ÄVEN FÖR KÄNDISAR', temp: { approval: 2 }, ind: { policetrust: 2 }, tip: 'Han får dagsböter som alla andra. Hans comeback får rekordtittare.' },
      { text: 'HÅRDARE STRAFF FÖR ALLA SOM KÖPER', cost: { pp: 8 }, temp: { freedom: -1, safety: 1 }, griev: -2, ind: { druguse: -0.4, prisonocc: 3 }, tip: 'Fler köpare i domstolarna. Färre kändisar på krogarna, i en månad.' },
    ],
  },
  {
    id: 'br_avkrim_debatt', icon: '\u{1F33F}', weight: 2, cooldown: 1200, kind: 'trygghet',
    title: 'SKA EGET BRUK AVKRIMINALISERAS?',
    text: 'Narkotikabruket har ökat i tio år trots hårdare tag, och nu föreslår en statlig utredning att eget bruk inte längre ska vara ett brott. Pengarna ska i stället gå till vård. Läkarförbundet är för, polisförbundet emot. Utredningen pekar på länder där dödsfallen sjönk, kritikerna på städer där gatorna blev otryggare.',
    when: (c) => (c.ind.druguse ?? 3) > 4 && c.is('drugs', 'regulated', 'compulsory', 'strict', 'war'),
    choices: [
      { text: 'AVKRIMINALISERA EGET BRUK', cost: { pp: 15 }, law: ['drugs', 'decriminalized'], temp: { freedom: 2 }, griev: 4, ind: { drugdeaths: -8, prisonocc: -4 }, tip: 'Ett stort experiment. Hela världen tittar, och oppositionen räknar.' },
      { text: 'SATSA PÅ SKADEREDUCERING MEN BEHÅLL FÖRBUDET', cost: { pp: 8 }, law: ['drugs', 'harmreduction'], griev: 1, ind: { drugdeaths: -6 }, tip: 'Mittenvägen. Den är sällan bred men alltid välbesökt.' },
      { text: 'BEHÅLL LAGEN SOM DEN ÄR', temp: { stability: 1 }, griev: -2, ind: { druguse: 0.2 }, tip: 'Utredningen läggs i en byrålåda. Den får sällskap av tre tidigare.' },
    ],
  },
  {
    id: 'br_knark_hemkorning', icon: '\u{1F6F4}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'NARKOTIKA MED HEMKÖRNING',
    text: 'Polisen i {huvudstad} varnar för en ny sorts handel: narkotika beställs i en app med bilder och kundbetyg och levereras till dörren på trettio minuter av unga bud på elsparkcyklar. Budet vet ofta inte vad som ligger i paketet. Kunderna är mest vanliga människor med vanliga jobb, och de betalar med kort.',
    when: (c) => (c.ind.druguse ?? 3) > 4.2 && (c.ind.internet ?? 60) > 75,
    choices: [
      { text: 'INFILTRERA APPEN', cost: { money: 150 }, griev: -3, ind: { drugcrime: -8, druguse: -0.2 }, tip: 'En polis beställer, en polis levererar och en polis skriver kundbetyget.' },
      { text: 'KRÄV NAMN OCH LEGITIMATION I ALLA APPAR', cost: { pp: 10 }, law: ['internet', 'realname'], temp: { freedom: -2 }, griev: -2, ind: { drugcrime: -6 }, tip: 'Alla måste visa leg för att beställa pizza. Langarna byter till en utländsk app.' },
      { text: 'GÅ EFTER BUDEN PÅ GATAN', temp: { safety: 1 }, griev: 1, ind: { drugcrime: -2 }, tip: 'Buden är femton år och lätta att ersätta. Det vet appen också.' },
    ],
  },
  {
    id: 'br_behandlingskon', icon: '\u{1F3E5}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'KÖN TILL BEHANDLINGEN',
    text: 'Sexhundra personer står i kö till missbruksvården i {stad}, och väntetiden är fyra månader. "När någon äntligen säger att de vill sluta har vi ingen plats att ge dem", säger en socialsekreterare. Under tiden har tre personer i kön dött av överdoser. Regionen och kommunen skyller på varandra.',
    when: (c) => (c.ind.drugdeaths ?? 1) > 2.5 && c.st.welfare < 30,
    choices: [
      { text: 'FINANSIERA TVÅHUNDRA NYA BEHANDLINGSPLATSER', cost: { money: 300 }, perm: { welfare: 1 }, griev: -5, ind: { drugdeaths: -12, druguse: -0.3 }, tip: 'Hjälp samma dag som någon ber om den. Fyra månader senare kan det vara för sent.' },
      { text: 'INFÖR TVÅNGSVÅRD FÖR TUNGA MISSBRUKARE', cost: { pp: 10 }, law: ['drugs', 'compulsory'], temp: { freedom: -2 }, griev: -2, ind: { drugdeaths: -6 }, tip: 'Platserna räckte inte till de frivilliga. Nu ska de räcka till fler.' },
      { text: 'LÅT REGIONEN OCH KOMMUNEN LÖSA DET', griev: 4, ind: { drugdeaths: 6 }, tip: 'De har löst det i tolv år, i form av tolv rapporter.' },
    ],
  },
  {
    id: 'br_drogkriget_fangelser', icon: '\u{26D3}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'FÄNGELSERNA FYLLS AV NARKOTIKADOMAR',
    text: 'Kriminalvården har räknat: nästan hälften av alla fångar sitter för narkotikabrott, de flesta för att ha sålt eller burit små mängder. Varje plats kostar staten lika mycket som en sjuksköterskas lön. Samtidigt säljs det lika mycket som förut på gatorna. "Vi fyller cellerna med dem som är lättast att ersätta", säger en anstaltschef.',
    when: (c) => c.is('drugs', 'war', 'strict', 'deathpenalty', 'detoxcamps') && (c.ind.prisonocc ?? 100) > 110,
    choices: [
      { text: 'BYT TILL SKADEREDUCERING', cost: { pp: 12 }, law: ['drugs', 'harmreduction'], griev: 3, ind: { prisonocc: -10, drugdeaths: -6 }, tip: 'Cellerna töms långsamt. Langarna märker ingen skillnad, missbrukarna gör det.' },
      { text: 'BYGG ETT NYTT FÄNGELSE', cost: { money: 600 }, temp: { safety: 1 }, griev: -2, ind: { prisonocc: -12 }, tip: 'Det nya fängelset är fullt om två år. Det vet arkitekterna redan.' },
      { text: 'FORTSÄTT KRIGET', temp: { income: -2 }, griev: -1, ind: { prisonocc: 6 }, tip: 'Det finns alltid fler att gripa. Det är just det som är problemet.' },
    ],
  },

  // ===== NÄTET: BEDRAGARE OCH HACKARE =====
  {
    id: 'br_bankbedragare', icon: '\u{1F4DE}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'SAMTALET FRÅN "BANKEN"',
    text: 'Över tvåtusen pensionärer har den senaste månaden blivit uppringda av "bankens säkerhetsavdelning". Rösten är vänlig och vet deras namn och adress. Den ber dem logga in för att stoppa ett pågående bedrägeri. Fyrahundra har gjort det och förlorat sammanlagt nittio miljoner. En åttiotvåårig änka i {stad} förlorade hela sitt sparkapital.',
    when: (c) => (c.ind.elderfraud ?? 50) > 150 && (c.ind.old ?? 10) > 8,
    choices: [
      { text: 'TVINGA BANKERNA ATT ERSÄTTA OCH FÖRDRÖJA STORA ÖVERFÖRINGAR', cost: { pp: 10 }, temp: { gdp: -1 }, griev: -6, ind: { elderfraud: -20 }, tip: 'Bankerna ringer och klagar. Det är i alla fall ett samtal man kan lita på.' },
      { text: 'KAMPANJ MED PENSIONÄRSFÖRENINGARNA', cost: { money: 60 }, griev: -2, ind: { elderfraud: -8 }, next: 'br_bedragarna_callcenter', tip: '"Banken ringer aldrig." Tre ord på tvåhundratusen kylskåpsmagneter.' },
      { text: 'LÅT BANKERNA SKÖTA DET', griev: 4, ind: { elderfraud: 8 }, next: [null, 'br_bedragarna_callcenter'], tip: 'Bankerna skickar ett sms om att man aldrig ska lita på sms.' },
    ],
  },
  {
    id: 'br_bedragarna_callcenter', icon: '\u{1F3A7}', chain: true, kind: 'trygghet',
    title: 'CALLCENTRET I {LAND}',
    text: 'Polisen har spårat samtalen till ett callcenter i {land} med åttio anställda som läser manus på vårt språk, i skift dygnet runt. Manusen är skrivna av någon som vet precis vad pensionärer är rädda för. Polisen i {land} är vänlig men har annat att göra. Callcentrets ägare äger enligt uppgift också tre hotell.',
    choices: [
      { text: 'GEMENSAM RAZZIA MED POLISEN I {LAND}', cost: { pp: 10 }, rel: 2, tip: 'En razzia i ett annat land kräver vänner där. Och tur.',
        risk: { chance: 0.6,
          win: { text: 'Razzian lyckas: åttio datorer, tre ägare och listor med tiotusen namn.', griev: -6, ind: { elderfraud: -25, fraud: -8 } },
          lose: { text: 'Callcentret var tomt. Det har flyttat till en ny adress, med samma manus.', griev: 2, ind: { elderfraud: -5 } } } },
      { text: 'BETALA FÖR EN UTREDARE PÅ PLATS', cost: { money: 150 }, rel: 1, griev: -3, ind: { elderfraud: -12 }, tip: 'En polis på ambassaden i {land}. Hans första kontor med fönster.' },
      { text: 'LÅT TELEBOLAGEN SPÄRRA FALSKA NUMMER', griev: -2, ind: { elderfraud: -6 }, tip: 'Bedragarna byter till sms. Sedan till brev. Sedan tillbaka.' },
    ],
  },
  {
    id: 'br_kommunen_last', icon: '\u{1F512}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'KOMMUNENS DATORER ÄR LÅSTA',
    text: 'Ett utpressningsprogram har låst alla datorer i {stad} kommun: skolornas scheman, hemtjänstens körlistor och hela bygglovsarkivet. På varje skärm står samma meddelande: fyrtio miljoner i kryptovaluta inom sjuttiotvå timmar, annars publiceras invånarnas uppgifter. Hemtjänsten kör nu efter handskrivna listor.',
    when: (c) => (c.ind.ransomware ?? 2) > 4.5 && (c.ind.internet ?? 60) > 70,
    choices: [
      { text: 'BETALA LÖSENSUMMAN', cost: { money: 400 }, next: [null, 'br_utpressarna_igen'], tip: 'Utpressare är ovanligt pålitliga när de vill få betalt igen.',
        risk: { chance: 0.65,
          win: { text: 'Nycklarna fungerar. Datorerna är igång igen efter två dagar.', temp: { qol: 1 } },
          lose: { text: 'Nycklarna låser bara upp hälften. Resten av arkivet är borta.', temp: { qol: -2 }, griev: 3 } } },
      { text: 'VÄGRA OCH BYGG UPP SYSTEMEN IGEN', cost: { money: 250 }, temp: { qol: -1 }, griev: -1, ind: { hacking: -5 }, tip: 'Tre veckor med papperslistor. Hemtjänsten har aldrig varit så punktlig.' },
      { text: 'BYGG ETT NATIONELLT CYBERCENTER', cost: { money: 500 }, perm: { research: 1 }, griev: -3, ind: { hacking: -15 }, tip: 'Nästa kommun ringer centret i stället för att betala. Om den hinner.' },
      { text: 'LÅT KOMMUNEN KLARA SIG SJÄLV', temp: { qol: -2 }, griev: 4, ind: { hacking: 5 }, tip: 'Kommunens it-avdelning är två personer och en skrivare som också är låst.' },
    ],
  },
  {
    id: 'br_utpressarna_igen', icon: '\u{1F4E9}', chain: true, kind: 'trygghet',
    title: 'UTPRESSARNA KOMMER TILLBAKA',
    text: 'Samma grupp som låste datorerna i {stad} har nu slagit till mot två kommuner till och ett regionsjukhus. I sitt meddelande skriver de att {rike} "är känt för att betala". Säkerhetsexperter säger att landet har hamnat på en lista som säljs mellan utpressare. Kommunerna vill veta vad regeringen tänker göra.',
    choices: [
      { text: 'FÖRBJUD ALLA OFFENTLIGA LÖSENSUMMOR', cost: { pp: 10 }, temp: { qol: -1 }, griev: 2, ind: { hacking: -15 }, tip: 'Nästa angrepp blir dyrare. Angreppet efter det blir mer sällsynt.' },
      { text: 'SÄKERHETSKOPIOR OCH ÖVNINGAR I ALLA KOMMUNER', cost: { money: 350 }, griev: -4, ind: { hacking: -12 }, tip: 'En säkerhetskopia på en hylla är tråkig. Utpressare hatar tråkiga kommuner.' },
      { text: 'BETALA FALL FÖR FALL NÄR DET BEHÖVS', temp: { stability: 1 }, griev: 3, ind: { hacking: 10 }, tip: 'Utpressarna skickar ett tackkort. Det är också låst.' },
    ],
  },
  {
    id: 'br_bankappen', icon: '\u{1F3E6}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'BANKENS APP ÄR HACKAD',
    text: 'Under tre timmar i natt kunde kunderna i en av landets största banker se andra kunders konton i appen. Hackare hade tagit sig in via en underleverantör. Inga pengar har försvunnit, enligt banken, men uppgifter om två miljoner kunder kan ha kopierats. Bankens aktie föll med tolv procent på morgonen.',
    when: (c) => (c.ind.hacking ?? 20) > 55 && (c.ind.internet ?? 60) > 75 && (c.ind.bankacc ?? 70) > 70,
    choices: [
      { text: 'SKÄRP SÄKERHETSKRAVEN PÅ ALLA BANKER', cost: { pp: 8 }, griev: -3, ind: { hacking: -10, stockcap: -2 }, tip: 'Bankerna klagar på kostnaderna. Hackarna klagar inte.' },
      { text: 'KRÄV ATT BANKEN ERSÄTTER ALLA KUNDER', temp: { approval: 3 }, griev: -2, ind: { stockcap: -4 }, tip: 'Kunderna får ett litet belopp och ett mycket långt brev med ursäkter.' },
      { text: 'LÅT FINANSTILLSYNEN UTREDA I LUGN OCH RO', temp: { stability: 1 }, griev: 2, ind: { fraud: 3 }, tip: 'Utredningen blir klar om arton månader. Uppgifterna säljs i morgon.' },
    ],
  },
  {
    id: 'br_tonarshackaren', icon: '\u{1F431}', rare: true, cooldown: 1500, kind: 'trygghet',
    title: 'SEXTONÅRINGEN SOM HACKADE PARLAMENTET',
    text: 'En sextonåring i {stad} tog sig i helgen in på parlamentets hemsida och bytte ut alla bilder på ledamöterna mot bilder på katter. Han lämnade en artig lapp om att säkerheten var "pinsamt dålig" och en lista med elva hål som borde lagas. Inga uppgifter är stulna. Hans mamma har tagit hans dator, och halva landet skrattar.',
    when: (c) => (c.ind.hacking ?? 20) > 55 && (c.ind.internet ?? 60) > 85,
    choices: [
      { text: 'ERBJUD HONOM PRAKTIK PÅ CYBERMYNDIGHETEN', cost: { money: 20 }, temp: { research: 2, approval: 2 }, ind: { hacking: -3 }, tip: 'Han börjar på måndag. Mamma skjutsar.' },
      { text: 'ÅTALA HONOM SOM VILKEN HACKARE SOM HELST', temp: { approval: -2, safety: 1 }, ind: { hacking: -1 }, tip: 'Katterna blir martyrer. Hans lista används ändå.' },
      { text: 'LAGA DE ELVA HÅLEN OCH TACKA I TYSTHET', cost: { money: 40 }, temp: { stability: 1 }, ind: { hacking: -5 }, tip: 'Den bästa säkerhetsgranskningen på tio år. Gratis, och med katter.' },
    ],
  },
  {
    id: 'br_falska_fakturor', icon: '\u{1F9FE}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'FAKTUROR SOM INGEN HAR BESTÄLLT',
    text: 'Trettiotusen småföretag har fått fakturor för "registrering i näringslivsregistret", med logga, kontonummer och en vänlig påminnelse efter två veckor. Registret finns inte. Var tionde företagare har betalat, ofta frisörer, rörmokare och bönder som inte hinner kontrollera allt. Totalt rör det sig om tvåhundra miljoner.',
    when: (c) => (c.ind.fraud ?? 150) > 300 && (c.ind.internet ?? 60) > 60,
    choices: [
      { text: 'GÖR DET OLAGLIGT ATT SKICKA OBESTÄLLDA FAKTUROR', cost: { pp: 6 }, griev: -3, ind: { fraud: -10 }, tip: 'Bedragarna skickar "erbjudanden" i stället, med samma kontonummer.' },
      { text: 'LÅT BANKERNA STOPPA KÄNDA BEDRAGARKONTON', cost: { money: 50 }, griev: -2, ind: { fraud: -8 }, tip: 'Kontona stängs på en dag. Nya öppnas på en halv.' },
      { text: 'UPPMANA FÖRETAGARNA ATT VARA VAKSAMMA', temp: { approval: -1 }, griev: 2, ind: { fraud: 4 }, tip: 'Rörmokaren läser varningen mellan två jobb. Sedan betalar han fakturan.' },
    ],
  },
  {
    id: 'br_identitetsstolder', icon: '\u{1FAAA}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'NÅGON ANNAN ÄR DU',
    text: 'Efter ett dataintrång hos ett stort försäkringsbolag säljs uppgifter om tvåhundratusen invånare på nätet: namn, adress, personnummer och kopior av körkort. Hundratals har redan fått brev om lån och mobilabonnemang de aldrig tecknat. En lärare i {stad} har fått tre inkassokrav för en bil hon inte äger.',
    when: (c) => (c.ind.idtheft ?? 30) > 100 && (c.ind.hacking ?? 20) > 25,
    choices: [
      { text: 'GRATIS KREDITSPÄRR FÖR ALLA SOM DRABBATS', cost: { money: 150 }, griev: -4, ind: { fraud: -8 }, tip: 'Ingen kan låna i ditt namn. Inte du heller, men det vill du nog inte just nu.' },
      { text: 'BÖTFÄLL FÖRSÄKRINGSBOLAGET', cost: { pp: 6 }, res: { money: 150 }, griev: -3, ind: { stockcap: -2 }, tip: 'Boten räcker till kreditspärrarna. Det är nästan rättvist.' },
      { text: 'LÅT VAR OCH EN SKYDDA SIG SJÄLV', griev: 4, ind: { fraud: 6 }, tip: 'Läraren i {stad} ringer inkassobolaget för fjärde gången.' },
    ],
  },
  {
    id: 'br_karleksbedragaren', icon: '\u{1F48C}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'KÄRLEKSBEDRAGAREN',
    text: 'En sjuttiofyraårig änkling i {stad} har skickat två miljoner till en kvinna han lärt känna på nätet. Hon sa att hon var läkare på ett fältsjukhus i {land} och behövde pengar för att komma hem. Hon fanns inte. Polisen säger att hundratals äldre har lurats på samma sätt i år, och att de flesta skäms för mycket för att anmäla.',
    when: (c) => (c.ind.elderfraud ?? 50) > 120 && (c.ind.darkfigure ?? 60) > 60 && (c.ind.internet ?? 60) > 50,
    choices: [
      { text: 'LÅT BANKERNA STOPPA OVANLIGA ÖVERFÖRINGAR UTOMLANDS', cost: { pp: 8 }, temp: { gdp: -1 }, griev: -4, ind: { elderfraud: -15 }, tip: 'Banken ringer och frågar om du verkligen vill. Ofta räcker det.' },
      { text: 'STARTA EN STÖDLINJE FÖR DEM SOM LURATS', cost: { money: 40 }, griev: -2, ind: { darkfigure: -2, elderfraud: -4 }, tip: 'Den förste som ringer pratar i två timmar. Sedan anmäler han.' },
      { text: 'DET ÄR EN PRIVATSAK', griev: 3, ind: { elderfraud: 5 }, tip: 'Det tycker bedragarna också.' },
    ],
  },
  {
    id: 'br_qr_parkering', icon: '\u{1F17F}\u{FE0F}', weight: 1, cooldown: 1200, kind: 'trygghet',
    title: 'DE FALSKA PARKERINGSKODERNA',
    text: 'Någon har klistrat falska QR-koder på nästan alla parkeringsautomater i {huvudstad}. Bilisterna har betalat parkeringen till ett okänt konto i tre veckor och sedan fått böter från kommunen ändå. Parkeringsvakterna har inte märkt något, eftersom de själva aldrig parkerar. Kommunen vill stänga av alla automater.',
    when: (c) => (c.ind.fraud ?? 150) > 180 && (c.ind.cars ?? 300) > 300 && (c.ind.internet ?? 60) > 70,
    choices: [
      { text: 'BYT TILL EN KOMMUNAL PARKERINGSAPP', cost: { money: 50 }, temp: { qol: 1 }, ind: { fraud: -3 }, tip: 'Appen kräver tre lösenord och ett körkortsnummer. Ingen kan förfalska den.' },
      { text: 'MAKULERA BÖTERNA FÖR ALLA SOM LURATS', cost: { money: 30 }, temp: { approval: 3 }, griev: -2, tip: 'Det kostar kommunen en slant. Den tjänar in den i välvilja.' },
      { text: 'SKRAPA BORT KODERNA OCH SÄTT UPP SKYLTAR', temp: { approval: -1 }, ind: { fraud: -1 }, tip: 'Skylten varnar för falska koder. Någon har satt en QR-kod på skylten.' },
    ],
  },
  {
    id: 'br_cyberforsvaret', icon: '\u{1F6E1}\u{FE0F}', weight: 2, cooldown: 1100, kind: 'trygghet',
    title: 'CYBERFÖRSVARET SAKNAR FOLK',
    text: 'Den nationella myndigheten för it-säkerhet har tvåhundra lediga tjänster och fick fyra ansökningar förra månaden. Privata företag betalar dubbelt så mycket. Samtidigt har dataintrången hos myndigheter och företag ökat för tredje året i rad, och chefen varnar för att nästa angrepp kan slå ut elnätet eller sjukhusen.',
    when: (c) => (c.ind.hacking ?? 20) > 40 && c.res('computing') >= 2,
    choices: [
      { text: 'HÖJ LÖNERNA TILL MARKNADSNIVÅ', cost: { money: 350 }, perm: { research: 1 }, griev: -2, ind: { hacking: -15 }, tip: 'Myndighetens chef tjänar nu mindre än sina anställda. Han är förvånansvärt glad.' },
      { text: 'LÅT IT-VÄRNPLIKTIGA GÖRA SIN TJÄNST DÄR', cost: { pp: 10 }, temp: { freedom: -1, readiness: 1 }, ind: { hacking: -10 }, tip: 'Nittonåringar som kan mer än cheferna. Det är inte första gången.' },
      { text: 'KÖP TJÄNSTERNA AV PRIVATA FÖRETAG', temp: { income: -1 }, ind: { hacking: -4 }, tip: 'Samma experter, dubbla priset och ett avtal på tvåhundra sidor.' },
    ],
  },
  {
    id: 'br_deepfake_vd', icon: '\u{1F3AD}', weight: 2, cooldown: 1100, kind: 'trygghet',
    title: 'CHEFEN SOM INTE VAR CHEFEN',
    text: 'Ekonomichefen på ett stort verkstadsföretag i {stad} fick ett videosamtal från sin vd, som bad honom föra över tjugofem miljoner till en leverantör före helgen. Det var vd:ns ansikte och vd:ns röst. Det var inte vd:n. Polisen säger att bedragare har börjat använda AI för att efterlikna chefer, och att det kommer att bli fler.',
    when: (c) => (c.ind.fraud ?? 150) > 250 && c.res('computing') >= 3,
    choices: [
      { text: 'KRÄV MÄRKNING AV ALLA AI-SKAPADE FILMER', cost: { pp: 8 }, griev: -2, ind: { fraud: -6 }, tip: 'Bedragarna märker inte sina filmer. Men nu är det ett brott till.' },
      { text: 'GE POLISEN EN ENHET FÖR AI-BROTT', cost: { money: 150 }, griev: -3, ind: { fraud: -8, hacking: -5 }, tip: 'Enheten består av tre poliser och en tjugotreåring från spelbranschen.' },
      { text: 'LÅT FÖRETAGEN INFÖRA KODORD', temp: { stability: 1 }, ind: { fraud: -2 }, tip: 'Ekonomichefen och vd:n har nu ett kodord. Det är namnet på vd:ns katt.' },
    ],
  },

  // ===== EKOBROTTEN =====
  {
    id: 'br_bidragsfusk', icon: '\u{1F4B8}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'MILJONERNA SOM FÖRSVANN I ASSISTANSEN',
    text: 'Revisorerna har granskat ersättningen för personlig assistans och hittat ett nätverk av företag i {stad} som tagit ut trehundra miljoner för hjälp som aldrig gavs. Flera av ägarna har kopplingar till kriminella nätverk. Pengarna kommer ur samma budget som ska hjälpa människor med svåra funktionsnedsättningar.',
    when: (c) => (c.ind.welfarefraud ?? 6) > 9.5 && c.st.welfare > -10,
    choices: [
      { text: 'STOPPA UTBETALNINGARNA TILLS ALLA ÄR KONTROLLERADE', cost: { pp: 10 }, temp: { income: 2 }, griev: -2, ind: { fraud: -10 }, next: 'br_kontrollerna_drabbar', tip: 'Fusket stoppas på en dag. Det gör hjälpen också.' },
      { text: 'BYGG UPP EN KONTROLLMYNDIGHET', cost: { money: 250 }, perm: { corruption: -1 }, griev: -4, ind: { fraud: -8 }, tip: 'Kontrollanter kostar pengar. Fusk kostar mer, men syns mindre.' },
      { text: 'ÅTALA DE ANSVARIGA OCH LÅT SYSTEMET VARA', griev: 2, ind: { fraud: -2 }, tip: 'Fem ägare åtalas. Tjugo nya företag registreras samma vecka.' },
    ],
  },
  {
    id: 'br_kontrollerna_drabbar', icon: '\u{267F}', chain: true, kind: 'valfard',
    title: 'KONTROLLERNA DRABBAR FEL',
    text: 'Utbetalningsstoppet har stoppat fusket, men också hjälpen till tusentals ärliga. En mamma i {stad} med en vuxen son som behöver hjälp dygnet runt har inte fått ersättning på sju veckor och har slutat jobba för att ta hand om honom själv. Funktionsrättsförbunden demonstrerar utanför departementet. Fuskarna har redan startat nya företag.',
    choices: [
      { text: 'BETALA UT DIREKT TILL DEM SOM ÄR KONTROLLERADE', cost: { money: 200 }, temp: { approval: 3 }, griev: -8, tip: 'Kontrollen fortsätter, men inte på de ärligas bekostnad.' },
      { text: 'HÄV STOPPET OCH KONTROLLERA I EFTERHAND', temp: { approval: 2 }, griev: -5, ind: { fraud: 5 }, tip: 'De ärliga får sina pengar. Fuskarna också, ett tag till.' },
      { text: 'HÅLL FAST VID STOPPET', temp: { approval: -4 }, griev: 8, ind: { fraud: -4 }, tip: 'Statistiken ser bra ut. Mamman i {stad} har slutat läsa statistik.' },
    ],
  },
  {
    id: 'br_svartbygget', icon: '\u{1F477}', weight: 2, cooldown: 900, kind: 'trygghet',
    title: 'RAZZIAN PÅ BYGGET I {STAD}',
    text: 'En gemensam kontroll av polis, skattemyndighet och arbetsmiljöinspektion på ett stort bostadsbygge i {stad} hittade sextio arbetare utan papper. Flera fick en tiondel av avtalslönen och bodde i containrar på bygget. Huvudentreprenören säger att den inte visste något, eftersom arbetarna var anställda i femte ledet av underentreprenörer.',
    when: (c) => (c.ind.laborcrime ?? 6) > 10 && (c.ind.shadow ?? 20) > 15,
    choices: [
      { text: 'GÖR HUVUDENTREPRENÖREN ANSVARIG FÖR HELA KEDJAN', cost: { pp: 8 }, temp: { income: 1, gdp: -1 }, griev: -3, tip: 'Femte ledet blir plötsligt intressant för den som står i det första.' },
      { text: 'SKYDDA ARBETARNA OM DE VITTNAR', cost: { money: 60 }, temp: { integration: 1 }, griev: -2, ind: { trustgov: 1 }, tip: 'Den som vittnar mot sin arbetsgivare riskerar att utvisas. Det vet arbetsgivaren.' },
      { text: 'UTVISA ARBETARNA OCH GÅ VIDARE', temp: { approval: 1, integration: -1 }, griev: 2, tip: 'Arbetarna åker hem. Underentreprenören hyr in nya på måndag.' },
    ],
  },
  {
    id: 'br_frisorerna', icon: '\u{1F487}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'FRISÖRERNA SOM INTE KLIPPER',
    text: 'På en enda gata i {stad} finns fjorton frisörsalonger, sex nagelsalonger och fyra biltvättar. Skattemyndigheten har räknat ut att de tillsammans redovisar intäkter som motsvarar tvåhundra klippningar i timmen, dygnet runt. Kunderna är få. Polisen misstänker att salongerna tvättar gängens pengar, inte någons hår.',
    when: (c) => (c.ind.moneylaundering ?? 2) > 3.6 && (c.ind.gangs ?? 50) > 80,
    choices: [
      { text: 'BEGRÄNSA STORA KONTANTBETALNINGAR', cost: { pp: 8 }, law: ['cash', 'limits'], temp: { freedom: -1 }, griev: -3, ind: { gangs: -4, fraud: -4 }, tip: 'Salongerna börjar ta kort. Intäkterna rasar med nittio procent.' },
      { text: 'SKICKA SKATTEREVISORER TILL GATAN', cost: { money: 100 }, griev: -3, ind: { gangs: -3 }, next: [null, 'br_frisorerna_igen'], tip: 'Revisorerna klipper sig på alla fjorton salonger. Det tar en vecka.' },
      { text: 'DET ÄR INTE OLAGLIGT ATT HA FÅ KUNDER', temp: { stability: 1 }, griev: 2, ind: { gangs: 2 }, tip: 'Nej. Men det är ovanligt att tjäna miljoner på dem.' },
    ],
  },
  {
    id: 'br_frisorerna_igen', icon: '\u{2702}\u{FE0F}', chain: true, kind: 'trygghet',
    title: 'SALONGERNA ÖPPNADE IGEN',
    text: 'Efter revisorernas besök stängde elva av salongerna på gatan i {stad}. Tre veckor senare har nio öppnat igen, med nya namn, nya ägare och samma möbler. En av de nya ägarna är nitton år och har aldrig klippt någon. Lokaltidningen har döpt gatan till "Tvättgatan", och turister kommer för att fotografera skyltarna.',
    choices: [
      { text: 'GÖR DET OLAGLIGT ATT VARA BULVAN', cost: { pp: 10 }, griev: -3, ind: { gangs: -5, fraud: -4 }, tip: 'Nittonåringen kommer att få förklara varför han äger nio salonger.' },
      { text: 'KRÄV GODKÄNNANDE AV ALLA NYA ÄGARE', cost: { money: 80 }, temp: { gdp: -1 }, griev: -2, ind: { gangs: -3 }, tip: 'Även den som vill öppna en riktig salong får vänta i tre månader.' },
      { text: 'BOKA EN KLIPPNING', temp: { approval: 2 }, ind: { gangs: 1 }, tip: 'Den första riktiga kunden på månader. Frisören är nervös.' },
    ],
  },
  {
    id: 'br_bygglovet', icon: '\u{1F4DD}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'BYGGLOVET SOM KOSTADE EXTRA',
    text: 'En tjänsteman på stadsbyggnadskontoret i {stad} har i fem år tagit emot pengar för att skynda på bygglov åt vissa företag. Några av dem har kopplingar till kriminella nätverk. Granskningen började när en villaägare som väntat i två år upptäckte att grannens tillbyggnad hade godkänts på en vecka.',
    when: (c) => (c.ind.bribery ?? 10) > 25 && (c.ind.gangs ?? 50) > 40,
    choices: [
      { text: 'INFÖR SKYDD FÖR VISSELBLÅSARE', cost: { pp: 10 }, law: ['anti_corruption', 'whistle'], temp: { corruption: -2 }, griev: -3, tip: 'Den som anmäler sin chef ska inte behöva byta stad.' },
      { text: 'GRANSKA ALLA BYGGLOV FRÅN DE SENASTE FEM ÅREN', cost: { money: 120 }, temp: { corruption: -2, gdp: -1 }, griev: -2, tip: 'Fyrahundra bygglov granskas igen. Byggbranschen andas tungt.' },
      { text: 'ÅTALA TJÄNSTEMANNEN OCH STÄNG ÄRENDET', temp: { corruption: -1 }, griev: 1, tip: 'Ett ruttet äpple mindre. Korgen ställs tillbaka på hyllan.' },
    ],
  },
  {
    id: 'br_skatteparadiset', icon: '\u{1F3DD}\u{FE0F}', weight: 1, cooldown: 1300, kind: 'trygghet',
    title: 'MILJARDERNA I {LAND}',
    text: 'En läcka från en advokatbyrå i {land} visar att trehundra av landets rikaste invånare har gömt pengar i brevlådeföretag där. Bland namnen finns en före detta minister, två fotbollsspelare och ägaren till landets största matkedja. Skattemyndigheten tror att staten har gått miste om flera miljarder i skatt.',
    when: (c) => (c.ind.taxevasion ?? 15) > 30 && (c.ind.gini ?? 35) > 30,
    choices: [
      { text: 'ÅTALA ALLA, OAVSETT NAMN', cost: { pp: 12 }, res: { money: 300 }, temp: { approval: 4, corruption: -2 }, griev: -3, ind: { stockcap: -3 }, tip: 'Ministern, fotbollsspelarna och matkungen har samma advokat.' },
      { text: 'ERBJUD AMNESTI OM DE BETALAR NU', res: { money: 500 }, temp: { approval: -2 }, griev: 2, tip: 'Pengarna kommer hem. Ärligheten gör det inte riktigt.' },
      { text: 'TECKNA ETT SKATTEAVTAL MED {LAND}', cost: { pp: 8 }, rel: 2, res: { money: 150 }, ind: { trustgov: 2 }, tip: 'Nästa gång syns pengarna i båda länderna. Då hittar de ett tredje.' },
    ],
  },
  {
    id: 'br_momskarusellen', icon: '\u{1F3A0}', weight: 2, cooldown: 1000, kind: 'trygghet',
    title: 'MOMSKARUSELLEN',
    text: 'Ett nätverk av bolag i {rike} och {granne} har köpt och sålt samma containrar med mobiltelefoner mellan varandra i ett år, och vid varje varv har staten betalat tillbaka moms som aldrig betalats in. Skattemyndigheten uppskattar förlusten till åttahundra miljoner. Telefonerna står fortfarande i samma lager i en hamn.',
    when: (c) => (c.ind.fraud ?? 150) > 290 && (c.ind.vat ?? 15) >= 15,
    choices: [
      { text: 'ÄNDRA MOMSREGLERNA FÖR ELEKTRONIK', cost: { pp: 6 }, temp: { income: 2 }, griev: -1, ind: { fraud: -8 }, tip: 'Köparen betalar momsen själv. Karusellen stannar med ett gnissel.' },
      { text: 'GEMENSAM UTREDNING MED {GRANNE}', cost: { money: 100 }, rel: 2, ind: { fraud: -6 }, tip: 'Hälften av bolagen finns i {granne}. Den andra hälften finns inte alls.' },
      { text: 'SKRIV AV FÖRLUSTEN', temp: { income: -2 }, griev: 2, ind: { fraud: 4 }, tip: 'Karusellen snurrar vidare. Den har fått ny musik.' },
    ],
  },
  {
    id: 'br_banken_tvattade', icon: '\u{1F9FC}', weight: 1, cooldown: 1300, kind: 'trygghet',
    title: 'BANKEN SOM TVÄTTADE PENGAR',
    text: 'En granskning visar att en av landets största banker lät tjugo miljarder i misstänkta pengar passera genom sitt kontor i {granne} under sju år. De anställdas varningar lades i en mapp som ingen läste. Bankens vd säger att han inte kände till något. Aktien har fallit med en femtedel på två dagar.',
    when: (c) => (c.ind.moneylaundering ?? 2) > 3.6 && (c.ind.stockcap ?? 50) > 30,
    choices: [
      { text: 'DÖM UT EN REKORDBOT', res: { money: 600 }, temp: { gdp: -1 }, griev: -3, ind: { stockcap: -5 }, tip: 'Boten är lika stor som bankens vinst på tre månader. Den är ändå rekord.' },
      { text: 'KRÄV ATT LEDNINGEN AVGÅR', cost: { pp: 6 }, temp: { corruption: -2, approval: 2 }, ind: { stockcap: -2 }, tip: 'Vd:n avgår med ett avgångsvederlag som skulle få en bankrånare att rodna.' },
      { text: 'GÖR EN TYST UPPGÖRELSE', mod: 'cover_up', temp: { corruption: 2, stability: 1 }, ind: { stockcap: 2 }, tip: 'Banken är tacksam. Den har lång erfarenhet av tysta uppgörelser.' },
    ],
  },
];
