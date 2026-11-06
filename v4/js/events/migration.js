// IMPERIUM V5.16 — HÄNDELSER: MIGRATION & INTEGRATION.
// Invandring och utvandring som de ser ut i verkligheten: arbetskraft som behövs,
// företagare, läkare och idrottsstjärnor — och vad som händer när flödet går fortare
// än integrationen: bostadsbrist, fulla skolor, köer till språkkurserna, segregation,
// utanförskap och ett främlingsfientligt parti som växer. Vid ett extremt flöde
// (c.migRate > 2,5 och integrationen under noll) kan det bli riktigt kaos i flera steg.
// Hårda tag har också ett pris: arbetskraftsbrist, kritik från omvärlden, splittrade
// familjer. Och när folk i stället lämnar landet: kunskapstapp och tomma byar.
// Ingen grupp är skurken — händelserna visar både möjligheterna och problemen.
//
// Signaler: c.migRate, c.ind.migrants, c.trend('migrants'), c.st.integration,
// c.st.immigration, c.grievOf('migration'), måtten migemp integ segreg exclusion
// xenophobia asylum newcitizens, och lagarna immigration citizenship border_control
// visa_policy (slaget migration) samt language culture emigration (slaget frihet —
// där pekar undo ut lagen med namn i stället för {lag}).
export const EVENTS = [

  // ===== ARBETSKRAFT SOM BEHÖVS =====
  {
    id: 'mgr_sjukskoterskor', icon: '\u{1F3E5}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'SJUKSKÖTERSKORNA FRÅN {LAND}',
    text: 'Sjukhuset i {stad} har stängt var femte vårdplats i brist på sjuksköterskor, och kön till operation är nu åtta månader lång. Regionen har hittat fyrtio färdigutbildade sjuksköterskor i {land} som gärna kommer hit. Problemet: det tar två år att få legitimationen godkänd, och språkkravet är högt.',
    when: (c) => (c.ind.old ?? 10) > 12 && c.st.welfare < 25 && c.day > 60 && !c.is('immigration', 'closed', 'exitban', 'deportation'),
    choices: [
      { text: 'SNABBSPÅR: LEGITIMATION OCH SPRÅKKURS PÅ ETT HALVÅR', cost: { money: 350 }, temp: { welfare: 4, qol: 2 }, perm: { integration: 1 }, next: ['mgr_sjuk_stannar', 'mgr_sjuk_lockas'], tip: 'Fyrtio sjuksköterskor på ett halvår. Fler om det fungerar.' },
      { text: 'ANSTÄLL DEM SOM UNDERSKÖTERSKOR UNDER TIDEN', cost: { money: 120 }, temp: { welfare: 2 }, next: ['mgr_sjuk_lockas', null], tip: 'De gör jobbet. De får lönen för ett annat.' },
      { text: 'INGA GENVÄGAR - SAMMA KRAV FÖR ALLA', temp: { welfare: -2, safety: 1 }, ind: { trustgov: -1 }, tip: 'Patientsäkerheten går först. Kön går också först.' },
    ],
  },
  {
    id: 'mgr_sjuk_stannar', icon: '\u{1F469}\u{200D}\u{2695}\u{FE0F}', chain: true, kind: 'migration',
    title: 'SJUKSKÖTERSKORNA STANNADE',
    text: 'Ett år senare arbetar trettiosex av de fyrtio sjuksköterskorna kvar i {stad}. Två av dem leder varsin avdelning, flera har fått hit sina familjer och barnen går i den lokala skolan. Väntetiden till operation har halverats, och tre andra regioner ringer och vill veta hur det gick till.',
    choices: [
      { text: 'GÖR DET TILL ETT NATIONELLT PROGRAM', cost: { money: 500 }, perm: { welfare: 3, integration: 2 }, temp: { approval: 3 }, tip: 'Det som fungerar i en stad kan fungera i tjugo.' },
      { text: 'LÅT REGIONERNA SKÖTA RESTEN SJÄLVA', temp: { approval: 2, welfare: 1 }, griev: -5, tip: 'Några gör det. Andra väntar på pengar från staten.' },
      { text: 'BJUD IN DEM TILL REGERINGEN OCH TACKA DEM', cost: { pp: 5 }, temp: { approval: 4, integration: 2 }, ind: { xenophobia: -1 }, tip: 'Fotot på trappan blir årets mest delade.' },
    ],
  },
  {
    id: 'mgr_sjuk_lockas', icon: '\u{1F4B6}', chain: true, kind: 'migration',
    title: '{GRANNE} LOCKAR MED DUBBEL LÖN',
    text: 'Sjukhusen i {granne} har upptäckt att det finns utbildade sjuksköterskor i {stad} som talar två språk och redan har lärt sig ett nytt land. Nu erbjuder de dubbel lön, gratis bostad och flyttbidrag. Elva har sagt upp sig, och fler läser annonsen på rasten.',
    choices: [
      { text: 'HÖJ LÖNERNA FÖR ALLA SJUKSKÖTERSKOR', cost: { money: 600 }, perm: { welfare: 2 }, temp: { approval: 3 }, ind: { strikes: -15 }, tip: 'Dyrt. Men billigare än en stängd avdelning.' },
      { text: 'BINDNINGSTID: DEN SOM UTBILDATS HÄR STANNAR TRE ÅR', cost: { pp: 10 }, temp: { welfare: 1, freedom: -2 }, tip: 'De stannar. Glada blir de inte.' },
      { text: 'LÅT DEM GÅ - DET ÄR ETT FRITT LAND', temp: { welfare: -3, qol: -1 }, tip: 'Grannlandets sjukhus tackar för utbildningen.' },
    ],
  },
  {
    id: 'mgr_ingenjorer', icon: '\u{1F4BB}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'TECHBOLAGEN SAKNAR INGENJÖRER',
    text: 'Landets tre största techbolag har skrivit en gemensam debattartikel: de har fyratusen lediga tjänster för ingenjörer och programmerare som inte går att fylla. Ett av dem säger rakt ut att nästa utvecklingskontor hamnar i {land} om det inte blir lättare att anställa från utlandet.',
    when: (c) => (c.ind.gdppc ?? 0) > 12000 && c.st.research > -10 && (c.ind.unemp ?? 6) < 9 && c.day > 80,
    choices: [
      { text: 'SNABBA ARBETSTILLSTÅND FÖR BRISTYRKEN', cost: { pp: 15 }, temp: { research: 4, gdp: 3, immigration: 3 }, ind: { gdpgrowth: 0.2 }, tip: 'Två veckor i stället för nio månader.' },
      { text: 'INFÖR ETT POÄNGSYSTEM FÖR ARBETSKRAFTSINVANDRING', cost: { pp: 25 }, law: ['immigration', 'points'], temp: { research: 2 }, tip: 'Utbildning, språk och ålder ger poäng. Byråkraterna älskar det.' },
      { text: 'UTBILDA VÅRA EGNA I STÄLLET', cost: { money: 400 }, perm: { research: 2 }, temp: { gdp: -2 }, tip: 'Klart om fem år. Bolagen har inte fem år.' },
      { text: 'DÅ FÅR BOLAGEN BETALA BÄTTRE LÖNER', temp: { gdp: -2, research: -2 }, ind: { stockcap: -3 }, tip: 'Lönerna stiger. Kontoret i det andra landet byggs ändå.' },
    ],
  },
  {
    id: 'mgr_sasongsarbetare', icon: '\u{1F353}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'JORDGUBBARNA MÅSTE PLOCKAS',
    text: 'Om tre veckor är jordgubbarna och grönsakerna i odlingsbygden runt {stad} mogna, men bönderna har bara hälften av plockarna de behöver. Arbetslösa har erbjudits jobben, men få vill bo i baracker och plocka tolv timmar om dagen. I {land} står tusentals säsongsarbetare redo att komma.',
    when: (c) => (c.ind.agri ?? 3) > 2 && (c.ind.unemp ?? 6) < 10 && c.st.immigration < 20 && c.day > 40 && !c.is('immigration', 'closed', 'exitban', 'deportation'),
    choices: [
      { text: 'SÄSONGSVISUM MED SCHYSSTA VILLKOR OCH INSPEKTIONER', cost: { money: 150 }, temp: { gdp: 2, factory: 2, immigration: 2 }, tip: 'Bären plockas, och någon kollar att lönen betalas.' },
      { text: 'SÄSONGSVISUM - BÖNDERNA ORDNAR BOENDET', temp: { gdp: 3, factory: 2 }, next: ['mgr_plockare_lager', null], tip: 'Billigt och snabbt. Ingen tittar i barackerna.' },
      { text: 'BETALA ARBETSLÖSA EXTRA FÖR ATT PLOCKA', cost: { money: 300 }, temp: { approval: 2 }, ind: { unemp: -0.1 }, tip: 'Några kommer. De flesta har ont i ryggen efter två dagar.' },
      { text: 'BÖNDERNA FÅR LÖSA DET SJÄLVA', temp: { gdp: -2, approval: -2 }, ind: { infl: 0.2 }, tip: 'Jordgubbar till dubbla priset. Det blir en lång sommar.' },
    ],
  },
  {
    id: 'mgr_plockare_lager', icon: '\u{1F3DA}\u{FE0F}', chain: true, kind: 'migration',
    title: 'PLOCKARNA I BARACKERNA',
    text: 'En tv-reporter har tagit sig in i plockarnas läger utanför {stad}. Tolv personer delar på en dusch, passen har samlats in "för säkerhets skull" och lönen dras för hyra, mat och resor tills nästan ingenting återstår. Bönderna säger att de inte visste vad bemanningsföretaget höll på med.',
    choices: [
      { text: 'ARBETSMILJÖINSPEKTION OCH ÅTAL MOT FÖRETAGET', cost: { pp: 10 }, perm: { corruption: -2 }, temp: { approval: 3 }, rel: 3, tip: 'Bemanningsföretaget byter namn. Åklagaren hittar det ändå.' },
      { text: 'SAMMA LÖN OCH VILLKOR SOM ALLA ANDRA - I LAG', cost: { money: 200 }, perm: { integration: 1 }, temp: { gdp: -1, approval: 2 }, ind: { trustgov: 2 }, tip: 'Jordgubbarna blir lite dyrare. Samvetet lite lättare.' },
      { text: 'DET ÄR ETT PRIVAT AVTAL MELLAN TVÅ PARTER', temp: { approval: -4 }, perm: { corruption: 1 }, rel: -4, ind: { trustgov: -2 }, tip: 'Reportaget visas i fyra länder. Det privata avtalet också.' },
    ],
  },
  {
    id: 'mgr_entreprenor', icon: '\u{1F950}', weight: 2, cooldown: 1100, kind: 'migration',
    title: 'BAGERIET SOM BLEV EN KEDJA',
    text: 'Hon kom till {stad} som flykting för tolv år sedan med två barn och en receptbok. I dag har hennes bageri tjugo filialer, 340 anställda och ett eget bageri för frysta bröd. Nu vill hon växa utomlands, men banken tycker att hon saknar "kreditvärdig historik i landet".',
    when: (c) => (c.ind.migrants ?? 0) > 4 && c.st.integration > -5 && c.st.gdp > -15 && c.day > 120,
    choices: [
      { text: 'STATLIG KREDITGARANTI FÖR HENNES EXPANSION', cost: { money: 300 }, temp: { gdp: 2 }, next: ['mgr_entre_bors', null], tip: 'Staten satsar på surdeg.' },
      { text: 'GÖR HENNE TILL ANSIKTET FÖR NYFÖRETAGANDE', cost: { pp: 5 }, temp: { approval: 2, integration: 3 }, ind: { xenophobia: -1 }, tip: 'Hennes ansikte på affischer i hela landet. Hon är inte förtjust.' },
      { text: 'BANKEN BESTÄMMER SJÄLV', temp: { gdp: -1 }, next: ['mgr_entre_flyttar', null], tip: 'Banken har bestämt. Andra länder har banker också.' },
    ],
  },
  {
    id: 'mgr_entre_bors', icon: '\u{1F4C8}', chain: true, kind: 'migration',
    title: 'BAGERIET GÅR TILL BÖRSEN',
    text: 'Bagerikedjan från {stad} noterades i dag på börsen och värderas till mer än landets största bryggeri. Hälften av de anställda har själva invandrat, och grundaren har lovat att vart tionde nytt jobb ska gå till någon som varit arbetslös i mer än ett år.',
    choices: [
      { text: 'GE HENNE ÅRETS FÖRETAGARPRIS', temp: { approval: 3, integration: 2 }, ind: { stockcap: 2, xenophobia: -1 }, tip: 'Hon tar emot priset i bagarförkläde.' },
      { text: 'STARTA ETT LÄRLINGSPROGRAM TILLSAMMANS', cost: { money: 200 }, perm: { integration: 2 }, temp: { gdp: 1 }, ind: { unemp: -0.1 }, tip: 'Tvåhundra lärlingar. Alla luktar kardemumma.' },
      { text: 'SKATTA VINSTEN OCH TACKA FÖR BIDRAGET', res: { money: 250 }, temp: { approval: -1 }, tip: 'Kassan blir glad. Hon blir det inte.' },
    ],
  },
  {
    id: 'mgr_entre_flyttar', icon: '\u{1F69A}', chain: true, kind: 'migration',
    title: 'BAGERIET FLYTTAR TILL {GRANNE}',
    text: 'Utan lån här hemma fick bagerikedjan ett erbjudande från {granne}: billig mark, en kreditgaranti och ett ministerbesök med kameror. Den nya fabriken byggs där i stället. Grundaren säger i en intervju att hon fortfarande älskar {stad}, men att bröd inte bakas av kärlek allena.',
    choices: [
      { text: 'LOCKA TILLBAKA DEM MED SKATTELÄTTNAD', cost: { pp: 15 }, perm: { income: -1 }, temp: { gdp: 2 }, tip: 'Hon kommer tillbaka. Med en advokat.' },
      { text: 'STARTA EN STATLIG FOND FÖR NYA FÖRETAGARE', cost: { money: 400 }, perm: { gdp: 1, integration: 1 }, tip: 'Nästa bagare ska slippa banken.' },
      { text: 'LYCKA TILL I {GRANNE}', temp: { gdp: -2, approval: -1 }, ind: { unemp: 0.1 }, tip: 'Tvåhundra jobb rullar över gränsen.' },
    ],
  },
  {
    id: 'mgr_lakare_utland', icon: '\u{1F695}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'LÄKAREN SOM KÖR TAXI',
    text: 'En barnläkare med tjugo års erfarenhet från {land} kör nattaxi i {huvudstad} medan hon väntar på att hennes examen ska prövas. Hon har väntat i tre år. Enligt läkarförbundet finns över tusen utbildade läkare i landet som inte får arbeta som läkare, samtidigt som vårdcentralerna saknar folk.',
    when: (c) => (c.ind.migemp ?? 60) < 65 && (c.ind.doctors ?? 3) < 4 && (c.ind.migrants ?? 0) > 5 && c.day > 60,
    choices: [
      { text: 'KORTA PRÖVNINGEN TILL SEX MÅNADER MED HANDLEDARE', cost: { money: 300 }, temp: { welfare: 3 }, perm: { integration: 2 }, next: ['mgr_validering_klar', null], tip: 'Kunskapen fanns redan. Nu får den användas.' },
      { text: 'PROVANSTÄLLNING PÅ SJUKHUS UNDER PRÖVNINGEN', cost: { money: 150 }, temp: { welfare: 2, integration: 1 }, tip: 'Hon får jobba. Taxin får klara sig utan henne.' },
      { text: 'VÅRDEN KRÄVER FULL KONTROLL - DET FÅR TA TID', temp: { welfare: -1, safety: 1 }, ind: { trustgov: -1 }, griev: 3, tip: 'Grundligt. Och långsamt.' },
    ],
  },
  {
    id: 'mgr_validering_klar', icon: '\u{1FA7A}', chain: true, kind: 'migration',
    title: 'TUSEN NYA LÄKARE PÅ ETT ÅR',
    text: 'Snabbprövningen har gjort det: drygt tusen läkare med utländsk examen arbetar nu i vården, de flesta på vårdcentraler utanför storstäderna. Väntetiden till läkare har gått ner för första gången på åtta år, och nattaxichauffören från {land} är numera överläkare på barnkliniken i {stad}.',
    choices: [
      { text: 'UTVIDGA TILL TANDLÄKARE, LÄRARE OCH INGENJÖRER', cost: { money: 400 }, perm: { integration: 3, research: 1 }, temp: { welfare: 2 }, tip: 'Det finns fler som väntar i fel jobb.' },
      { text: 'FIRA, MEN HÅLL HÅRT I KVALITETSKONTROLLEN', temp: { approval: 3, welfare: 2, safety: 1 }, tip: 'Snabbt och säkert. Det går att kombinera.' },
      { text: 'NÖJ DIG MED LÄKARNA', temp: { welfare: 2 }, griev: -5, tip: 'En reform i taget.' },
    ],
  },
  {
    id: 'mgr_matfestival', icon: '\u{1F35C}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'GATUMATSFESTIVALEN I {STAD}',
    text: 'Det som började som sex matstånd på en parkeringsplats i {stad} har blivit landets största matfestival. Tvåhundra stånd lagar mat från fyrtio länder, och i år kom en kvarts miljon besökare. Matkritikerna skriver att landets matkultur förändrats mer på tio år än på hundra.',
    when: (c) => (c.ind.migrants ?? 0) > 7 && c.st.integration > -10 && c.st.unrest < 25,
    choices: [
      { text: 'GÖR DEN TILL NATIONELL FESTIVAL MED STATLIGT STÖD', cost: { money: 200 }, temp: { qol: 3, approval: 2, integration: 2 }, ind: { tourists: 5 }, tip: 'Turisterna kommer för maten. Och stannar för maten.' },
      { text: 'LÅT STADEN OCH STÅNDEN SKÖTA DET', temp: { qol: 2, integration: 1 }, ind: { xenophobia: -1 }, tip: 'Det fungerade utan staten förut också.' },
      { text: 'KRÄV TILLSTÅND OCH HYGIENKONTROLL AV VARJE STÅND', temp: { safety: 1, qol: -1, approval: -1 }, tip: 'Festivalen överlever. Halva ståndsägarna gör det inte.' },
    ],
  },
  {
    id: 'mgr_landslaget', icon: '\u{26BD}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'MÅLEN SOM ENADE LANDET',
    text: 'Landslagets nya anfallare, född i ett flyktingläger i {land} och uppvuxen i {stad}, avgjorde kvalet med två mål i sista kvarten. Hela nationen sjunger hennes namn och skolbarn i alla delar av landet bär hennes tröja. Hennes gamla förortsklubb har fått trehundra nya medlemmar på en vecka.',
    when: (c) => (c.ind.migrants ?? 0) > 5 && c.st.integration > -15 && c.day > 100 && !c.mod('olympic_glory'),
    choices: [
      { text: 'BYGG NYA KONSTGRÄSPLANER I FÖRORTERNA', cost: { money: 300 }, perm: { qol: 1, integration: 2 }, temp: { approval: 3 }, tip: 'Nästa stjärna tränar redan. På grus.' },
      { text: 'TA EMOT LANDSLAGET MED FEST PÅ STORA TORGET', cost: { money: 150 }, mod: 'olympic_glory', ind: { xenophobia: -1 }, tip: 'Hela landet vill vara med på bilden.' },
      { text: 'GRATULERA OCH LÅT SPORTEN VARA SPORT', temp: { approval: 1, integration: 1 }, tip: 'Hon gjorde målen. Resten är politik.' },
    ],
  },
  {
    id: 'mgr_forskarpris', icon: '\u{1F52C}', weight: 1, cooldown: 1500, kind: 'migration',
    title: 'VÄRLDENS FINASTE PRIS',
    text: 'En forskare som kom hit från {land} som doktorand för femton år sedan har tilldelats världens mest prestigefyllda pris i medicin, för en upptäckt hon gjorde på universitetet i {stad}. Hon säger i sitt tacktal att hon aldrig hade blivit forskare om hon inte fått stanna här efter examen.',
    when: (c) => c.st.research > 5 && (c.ind.migrants ?? 0) > 3 && c.day > 200,
    choices: [
      { text: 'FORSKARVISUM PÅ EN VECKA FÖR DOKTORANDER', cost: { pp: 10 }, perm: { research: 2 }, temp: { immigration: 2 }, tip: 'Nästa pristagare kanske redan söker.' },
      { text: 'NYTT FORSKNINGSINSTITUT I HENNES NAMN', cost: { money: 600 }, perm: { research: 3 }, temp: { approval: 2 }, tip: 'Hon vill hellre ha fler doktorander än en skylt.' },
      { text: 'HYLLA HENNE I TAL OCH PÅ FRIMÄRKE', temp: { approval: 2, research: 1 }, tip: 'Frimärket blir en samlarsak.' },
    ],
  },
  {
    id: 'mgr_medborgarceremoni', icon: '\u{1F393}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'TIOTUSEN NYA MEDBORGARE',
    text: 'På nationaldagen hålls landets största medborgarceremoni hittills: tiotusen människor från över hundra länder får sina medborgarbevis i {huvudstad}. En nittioårig man från {land} har väntat i trettio år, och en sjuårig flicka läser en dikt på sitt nya lands språk. Ingen i publiken har torra ögon.',
    when: (c) => ((c.ind.newcitizens ?? 0) > 20000 || c.is('citizenship', 'easy', 'residency', 'birthright', 'testsoath')) && c.st.integration > 0 && c.day > 100,
    choices: [
      { text: 'HÅLL TALET SJÄLV OCH SÄND DET I TV', cost: { pp: 5 }, temp: { approval: 3, integration: 3 }, ind: { xenophobia: -1 }, griev: -4, tip: 'Det bästa tal du hållit. Flickans dikt var bättre.' },
      { text: 'GÖR CEREMONIN ÅRLIG I VARJE KOMMUN', cost: { money: 150 }, perm: { integration: 2 }, tip: 'Ett löfte, en blomma och kaffe i stadshuset.' },
      { text: 'EN ENKEL CEREMONI PÅ MYNDIGHETEN RÄCKER', temp: { integration: 1, approval: -1 }, tip: 'Ett papper i en kö. Det är också ett sätt att välkomna.' },
    ],
  },
  {
    id: 'mgr_bussforare', icon: '\u{1F68C}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'BUSSARNA STÅR STILLA I {STAD}',
    text: 'Kollektivtrafiken i {stad} har ställt in var sjätte tur. Det saknas trehundra busschaufförer, och medelåldern bland dem som finns kvar är femtioåtta. För tio år sedan var hälften av de nyanställda födda utomlands, men sedan invandringen minskade har ingen tagit deras plats.',
    when: (c) => (c.ind.old ?? 10) > 13 && (c.st.immigration < 0 || c.migRate < 0.2) && (c.ind.unemp ?? 6) < 9,
    choices: [
      { text: 'ARBETSTILLSTÅND FÖR BRISTYRKEN', cost: { pp: 15 }, temp: { immigration: 3, qol: 2, gdp: 1 }, tip: 'Chaufförer från tre länder. Bussarna går igen.' },
      { text: 'GRATIS BUSSKÖRKORT FÖR ARBETSLÖSA UNGA', cost: { money: 300 }, temp: { qol: 1 }, ind: { youthunemp: -0.3 }, tip: 'Det tar ett år. Pensionärerna väntar vid hållplatsen.' },
      { text: 'HÖJ LÖNERNA OCH TA PENGARNA FRÅN BILJETTERNA', temp: { qol: -1, approval: -2 }, ind: { infl: 0.1 }, tip: 'Dyrare biljetter, fler chaufförer, färre resenärer.' },
    ],
  },
  {
    id: 'mgr_aldreomsorg', icon: '\u{1F475}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'VEM SKA TA HAND OM FARMOR?',
    text: 'På äldreboendena i {stad} är sex av tio undersköterskor födda utomlands. När kommunen gjorde en enkät svarade de boende att personalen är det bästa med hela boendet, men att det ibland är svårt att förstå varandra. Om tio år behövs dubbelt så många händer.',
    when: (c) => (c.ind.old ?? 10) > 15 && (c.ind.migrants ?? 0) > 6 && c.day > 60,
    choices: [
      { text: 'BETALD SPRÅKUTBILDNING PÅ ARBETSTID', cost: { money: 250 }, perm: { welfare: 1, integration: 2 }, temp: { qol: 1 }, tip: 'Farmor lär sig också ett och annat ord.' },
      { text: 'UTBILDA TIOTUSEN NYA UNDERSKÖTERSKOR', cost: { money: 500 }, perm: { welfare: 2 }, ind: { unemp: -0.1 }, tip: 'Från alla bakgrunder. Med lön under utbildningen.' },
      { text: 'KRÄV SPRÅKTEST FÖR ALL VÅRDPERSONAL', temp: { welfare: -3, integration: 1, safety: 1 }, griev: 4, tip: 'Var femte i personalen får sluta. Farmor får vänta på kaffet.' },
    ],
  },
  {
    id: 'mgr_bygdeskolan', icon: '\u{1F3EB}', weight: 2, cooldown: 1100, kind: 'migration',
    title: 'BYSKOLAN SOM RÄDDADES',
    text: 'Byskolan i en avfolkad dal utanför {stad} skulle läggas ner med elva elever kvar. Sedan flyttade sex familjer från {land} in i de tomma husen. Nu har skolan trettiotvå elever, affären har öppnat igen och fotbollsklubben har ett juniorlag för första gången på tjugo år.',
    when: (c) => (c.ind.migrants ?? 0) > 3 && c.st.integration > -10 && (c.ind.urban ?? 60) > 45 && c.day > 80,
    choices: [
      { text: 'FLYTTSTÖD FÖR DEN SOM VILL BO PÅ LANDSBYGDEN', cost: { money: 300 }, perm: { integration: 2 }, temp: { qol: 1, approval: 2 }, ind: { segreg: -1 }, tip: 'Tomma hus, lediga jobb och plats för fler.' },
      { text: 'GÖR BYN TILL ETT EXEMPEL FÖR HELA LANDET', cost: { pp: 5 }, temp: { approval: 2, integration: 2 }, ind: { xenophobia: -1 }, tip: 'Byborna får vänja sig vid tv-kameror.' },
      { text: 'BRA FÖR BYN - INGET FÖR STATEN ATT LÄGGA SIG I', temp: { integration: 1, qol: 1 }, tip: 'Det bästa händer ibland av sig självt.' },
    ],
  },
  {
    id: 'mgr_mentorer', icon: '\u{1F91D}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'MENTORERNA GÖR SKILLNAD',
    text: 'Ett frivilligt program i {stad} kopplar ihop nyanlända med pensionerade yrkesfolk: snickare, ekonomer, sjuksköterskor. Efter tre år har sju av tio deltagare jobb, mot tre av tio bland dem som inte var med. Forskarna som utvärderat programmet kallar det "det billigaste som fungerat på länge".',
    when: (c) => c.st.integration > 5 && (c.res('integration') >= 2 || c.st.qol > 10) && (c.ind.migrants ?? 0) > 4,
    choices: [
      { text: 'FINANSIERA PROGRAMMET I HELA LANDET', cost: { money: 350 }, perm: { integration: 3 }, ind: { unemp: -0.1 }, griev: -6, tip: 'Tiotusen pensionärer får något att göra på tisdagar.' },
      { text: 'SKATTEAVDRAG FÖR MENTORERNA', cost: { pp: 10 }, perm: { integration: 2 }, temp: { income: -2 }, tip: 'Pensionärerna gör det inte för pengarna. Men de tackar inte nej.' },
      { text: 'LÅT DET VÄXA AV SIG SJÄLVT', temp: { integration: 1, approval: 1 }, tip: 'Det växer. Långsamt.' },
    ],
  },
  {
    id: 'mgr_berom', icon: '\u{1F30D}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'ETT EXEMPEL FÖR VÄRLDEN',
    text: 'En stor internationell jämförelse har rankat landet bland de tre bästa i världen på att få nyanlända i arbete och utbildning. Delegationer från {land} och {granne} har bokat studiebesök, och utrikesministern fick applåder på ett möte där landet brukar få kritik.',
    when: (c) => (c.ind.integ ?? 45) > 55 && c.st.integration > 10 && (c.ind.migrants ?? 0) > 5,
    choices: [
      { text: 'ARRANGERA EN INTERNATIONELL KONFERENS', cost: { money: 200 }, rel: 6, temp: { approval: 2 }, tip: 'Tre dagar av powerpoints och god mat.' },
      { text: 'EXPORTERA MODELLEN SOM BISTÅNDSPROJEKT', cost: { money: 300 }, rel: 8, temp: { research: 1 }, tip: 'Det som fungerar här kanske fungerar där.' },
      { text: 'TACKA OCH FORTSÄTT ARBETA', temp: { approval: 2, integration: 1 }, griev: -4, tip: 'Rankningar kommer och går. Jobben stannar.' },
    ],
  },
  {
    id: 'mgr_andra_gen', icon: '\u{1F4DA}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'ANDRA GENERATIONEN TAR PLATS',
    text: 'Årets statistik visar att barn till föräldrar som invandrat nu går vidare till universitetet lika ofta som andra barn, och på läkarlinjen och ingenjörsprogrammen är de fler. Rektorn på gymnasiet i {stad} säger att den största skillnaden gjordes i förskolan för femton år sedan.',
    when: (c) => (c.ind.pisa ?? 470) > 470 && (c.ind.migrants ?? 0) > 7 && c.st.integration > 0 && c.day > 200,
    choices: [
      { text: 'SATSA MER PÅ FÖRSKOLAN I UTSATTA OMRÅDEN', cost: { money: 400 }, perm: { integration: 2, research: 1 }, tip: 'Femton år till nästa skörd.' },
      { text: 'STIPENDIER TILL DE FÖRSTA I FAMILJEN SOM PLUGGAR', cost: { money: 250 }, perm: { research: 1, integration: 1 }, tip: 'Mammor i hela landet ringer släkten.' },
      { text: 'BERÄTTA OM DET I VARJE VALTAL', temp: { approval: 3 }, ind: { xenophobia: -1 }, tip: 'Siffror är bra. Siffror som går att visa är bättre.' },
    ],
  },
  {
    id: 'mgr_sprakcenter', icon: '\u{1F5E3}\u{FE0F}', weight: 2, cooldown: 1100, kind: 'migration',
    title: 'TRETTIO SPRÅK UNDER ETT TAK',
    text: 'Ett internationellt resebolag har valt {stad} för sin nya kundtjänst för hela kontinenten. Skälet: här går det att anställa folk som talar trettio språk, från arabiska och polska till tigrinja och portugisiska. Åttahundra jobb, och var tredje går till någon som varit arbetslös.',
    when: (c) => (c.ind.migrants ?? 0) > 8 && c.st.integration > 0 && c.st.gdp > -20,
    choices: [
      { text: 'ERBJUD LOKALER OCH UTBILDNING', cost: { money: 250 }, temp: { gdp: 2, integration: 2 }, ind: { unemp: -0.1 }, tip: 'Flerspråkighet blir en merit i stället för ett hinder.' },
      { text: 'MARKNADSFÖR STADEN SOM FLERSPRÅKIG', cost: { pp: 5 }, temp: { gdp: 1, approval: 2 }, mod: 'foreign_investment', tip: 'Tre bolag till hör av sig inom en månad.' },
      { text: 'TREVLIGT, MEN INGET STATEN BEHÖVER GÖRA', temp: { gdp: 1, integration: 1 }, tip: 'Jobben kommer ändå. Några färre bara.' },
    ],
  },

  // ===== NÄR FLÖDET GÅR FORTARE ÄN INTEGRATIONEN =====
  {
    id: 'mgr_bostadsbrist', icon: '\u{1F3E0}', weight: 3, cooldown: 700, kind: 'migration',
    title: 'INGENSTANS ATT BO',
    text: 'Kommunerna har tagit emot fler nyanlända på ett år än de brukar på fem. I {stad} bor familjer på vandrarhem, i ombyggda kontor och i en nedlagd skola. Bostadskön är nu tolv år lång, och de som stått i kö sedan barndomen undrar högt varför de nyanlända går före.',
    when: (c) => c.migRate > 1.2 && c.st.integration < 10 && c.day > 40,
    choices: [
      { text: 'BYGG TIOTUSEN MODULBOSTÄDER PÅ ETT ÅR', cost: { money: 800 }, temp: { integration: 3, qol: 1 }, ind: { homeless: -5 }, next: ['mgr_bostad_tillfallig', null], tip: 'Snabbt, fult och bättre än ett vandrarhem.' },
      { text: 'FÖRDELA NYANLÄNDA JÄMNT ÖVER ALLA KOMMUNER', cost: { pp: 20 }, temp: { integration: 2, approval: -2 }, ind: { segreg: -1 }, griev: -4, tip: 'Även de kommuner som aldrig velat. Särskilt dem.' },
      { text: 'INGEN FÖRTUR - ALLA STÅR I SAMMA KÖ', temp: { integration: -4, approval: 2 }, ind: { homeless: 6 }, next: ['mgr_bostad_trangbodd', null], tip: 'Rättvist på papperet. Trångt i verkligheten.' },
    ],
  },
  {
    id: 'mgr_bostad_trangbodd', icon: '\u{1F6AA}', chain: true, kind: 'migration',
    title: 'NIO PERSONER I TVÅ RUM',
    text: 'En granskning visar att hundratals familjer i {stad} hyr lägenheter i andra hand till ockerpriser, ofta nio eller tio personer i två rum. Barnen gör läxorna i trappuppgången. Hyresvärdarna tar betalt kontant och lovar att ordna folkbokföring mot en extra avgift.',
    choices: [
      { text: 'SLÅ TILL MOT DE SVARTA HYRESKONTRAKTEN', cost: { pp: 10 }, perm: { corruption: -1 }, temp: { safety: 2 }, ind: { homeless: 4 }, tip: 'Ockrarna åker fast. Familjerna står på gatan.' },
      { text: 'BOSTADSBIDRAG MOT ETT RIKTIGT KONTRAKT', cost: { money: 400 }, temp: { integration: 3, welfare: 1 }, ind: { homeless: -4 }, tip: 'Dyrt, men barnen får ett eget skrivbord.' },
      { text: 'SNABBA BYGGLOV FÖR NYA HYRESHUS', cost: { pp: 15 }, perm: { qol: 1 }, temp: { integration: 1 }, ind: { houseprice: -2 }, tip: 'Husen står klara om tre år.' },
      { text: 'MARKNADEN FÅR LÖSA DET', temp: { integration: -3, safety: -2 }, ind: { segreg: 2 }, tip: 'Marknaden har redan löst det. Det var det som var problemet.' },
    ],
  },
  {
    id: 'mgr_bostad_tillfallig', icon: '\u{1F3D7}\u{FE0F}', chain: true, kind: 'migration',
    title: 'DE TILLFÄLLIGA HUSEN BLEV KVAR',
    text: 'Modulhusen i utkanten av {stad} skulle stå i tre år. Nu har det gått fem, och området har fått en egen förskola, en kiosk och ett rykte. Nästan alla som bor där har invandrat, bussen går två gånger i timmen och närmaste arbetsplats ligger fyra kilometer bort.',
    choices: [
      { text: 'BLANDA: BYGG BOSTADSRÄTTER OCH EN SKOLA BREDVID', cost: { money: 600 }, perm: { integration: 2 }, ind: { segreg: -2 }, tip: 'Ett område blir en stadsdel.' },
      { text: 'FLYTTA FAMILJERNA TILL VANLIGA BOSTÄDER', cost: { money: 400, pp: 10 }, temp: { integration: 3 }, ind: { segreg: -1, homeless: 3 }, tip: 'Grannarna i de vanliga bostäderna får nya grannar.' },
      { text: 'BÄTTRE BUSSAR, RESTEN FÅR VÄNTA', cost: { money: 100 }, temp: { integration: 1, qol: 1 }, tip: 'Bussen går var tionde minut. Problemen är kvar.' },
      { text: 'DET FUNGERAR - LÅT DET VARA', temp: { integration: -2 }, ind: { segreg: 2 }, tip: 'Tillfälliga lösningar är de mest permanenta.' },
    ],
  },
  {
    id: 'mgr_skolor_fulla', icon: '\u{1F392}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'TRETTIOSEX ELEVER I KLASSEN',
    text: 'Skolorna i {stad} har tagit emot fyrahundra nya elever sedan sommaren, många utan något gemensamt språk med läraren. Klasserna har vuxit till trettiosex elever, och lärarna skriver i ett öppet brev att varken de nya eller de gamla eleverna får den hjälp de behöver.',
    when: (c) => c.migRate > 1 && c.st.integration < 15 && (c.ind.kids ?? 18) > 12,
    choices: [
      { text: 'FÖRBEREDELSEKLASSER OCH MODERSMÅLSLÄRARE', cost: { money: 400 }, perm: { integration: 2 }, temp: { welfare: 1 }, tip: 'Ett år för att lära sig språket. Sedan in i vanlig klass.' },
      { text: 'ANSTÄLL LÄRARASSISTENTER OCH TOLKAR', cost: { money: 250 }, temp: { integration: 2, welfare: 1 }, tip: 'Fler vuxna i klassrummet. Samma klassrum.' },
      { text: 'BUSSA ELEVER TILL SKOLOR SOM HAR PLATS', cost: { pp: 10 }, temp: { integration: 1, approval: -2 }, ind: { segreg: -1 }, tip: 'Fyrtio minuter i buss varje morgon. Men en plats i klassen.' },
      { text: 'STÖRRE KLASSER FÅR DET BLI', temp: { integration: -3, welfare: -2 }, griev: 4, tip: 'Lärarna söker andra jobb. Klasserna blir ännu större.' },
    ],
  },
  {
    id: 'mgr_sfi_ko', icon: '\u{23F3}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'ETT ÅR I KÖ TILL SPRÅKKURSEN',
    text: 'Kön till språkundervisningen för vuxna har vuxit till fjorton månader. Tiotusentals nyanlända sitter hemma och väntar, och arbetsgivarna säger att de inte kan anställa någon de inte kan prata med. En lärare i {stad} undervisar sextio elever i ett rum byggt för tjugofem.',
    when: (c) => c.migRate > 0.8 && c.st.integration < 10 && c.day > 50,
    choices: [
      { text: 'FÖRDUBBLA LÄRARNA OCH KÖR KVÄLLSKURSER', cost: { money: 450 }, temp: { integration: 3 }, next: ['mgr_sfi_resultat', null], tip: 'Kön krymper. Kassan också.' },
      { text: 'SPRÅK PÅ JOBBET: PRAKTIK FRÅN FÖRSTA MÅNADEN', cost: { pp: 15 }, temp: { integration: 2, gdp: 1 }, next: ['mgr_sfi_resultat', 'mgr_sfi_fusk'], tip: 'Man lär sig fortast när man måste fråga var kaffet står.' },
      { text: 'DIGITALA KURSER I MOBILEN', cost: { rp: 15 }, temp: { integration: 1 }, next: ['mgr_sfi_fusk', null], tip: 'Billigt. Frågan är vem som faktiskt lyssnar.' },
      { text: 'KÖN FÅR VARA KÖ', temp: { integration: -3 }, ind: { unemp: 0.1 }, griev: 3, tip: 'Fjorton månader. Sedan sexton.' },
    ],
  },
  {
    id: 'mgr_sfi_resultat', icon: '\u{1F4AC}', chain: true, kind: 'migration',
    title: 'NU PRATAR DE SPRÅKET',
    text: 'Ett år senare har kön till språkkurserna krympt till sex veckor. Arbetsförmedlingen i {stad} rapporterar att andelen nyanlända som fått jobb inom två år har stigit från tre till fem av tio. På kaféet i centrum kan man numera beställa på fem språk, och landets eget går bäst.',
    choices: [
      { text: 'GÖR SPRÅKKURSEN TILL EN RÄTTIGHET I LAG', cost: { pp: 15 }, perm: { integration: 3 }, griev: -6, tip: 'Den som kommer hit ska få lära sig språket. Punkt.' },
      { text: 'SPARA IN NU NÄR KÖN ÄR BORTA', res: { money: 200 }, temp: { integration: -1 }, tip: 'Kön kommer tillbaka. Den gör alltid det.' },
      { text: 'BERÖM LÄRARNA I NATIONALDAGSTALET', temp: { approval: 2, integration: 1 }, griev: -5, tip: 'Lärarna hade hellre tagit en löneförhöjning.' },
    ],
  },
  {
    id: 'mgr_sfi_fusk', icon: '\u{1F575}\u{FE0F}', chain: true, kind: 'migration',
    title: 'SPRÅKSKOLAN SOM INTE FANNS',
    text: 'Ett privat utbildningsföretag har fått betalt för fyratusen kursplatser i språkundervisning. När journalister besökte adressen i {stad} hittade de ett tomt kontor och en skylt. Eleverna fick intyg utan att ha haft en enda lektion, och ägaren har lämnat landet.',
    choices: [
      { text: 'KRÄV TILLBAKA PENGARNA OCH ÅTALA', cost: { pp: 10 }, perm: { corruption: -2 }, temp: { approval: 2 }, tip: 'Pengarna är borta. Principen är räddad.' },
      { text: 'BARA OFFENTLIGA SKOLOR FÅR UNDERVISA', cost: { money: 300 }, perm: { integration: 1, corruption: -1 }, tip: 'Tråkigare, dyrare och mycket svårare att fuska med.' },
      { text: 'ETT ENSTAKA FALL - GÅ VIDARE', perm: { corruption: 2 }, temp: { approval: -3 }, ind: { trustgov: -2 }, tip: 'Det fanns fyra till. Det visar sig i höst.' },
    ],
  },
  {
    id: 'mgr_arbetslosa_nyanlanda', icon: '\u{1F4C9}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'SJU AV TIO UTAN JOBB',
    text: 'Ny statistik visar att bara tre av tio som kommit hit de senaste tre åren har ett arbete. Många har utbildningar från hemlandet som inte räknas här, andra har aldrig gått i skolan. Samtidigt står restauranger, byggen och lager i {stad} utan personal.',
    when: (c) => (c.ind.migemp ?? 60) < 50 && (c.ind.migrants ?? 0) > 4 && c.day > 60,
    choices: [
      { text: 'INSTEGSJOBB: STATEN BETALAR HALVA LÖNEN I TVÅ ÅR', cost: { money: 500 }, temp: { integration: 4, gdp: 1 }, ind: { unemp: -0.2 }, griev: -5, tip: 'Det första jobbet är det svåraste att få.' },
      { text: 'KORTA YRKESUTBILDNINGAR PÅ SEX MÅNADER', cost: { money: 300 }, perm: { integration: 2 }, tip: 'Svetsare, busschaufför, undersköterska.' },
      { text: 'BIDRAG BARA MOT HELTIDSAKTIVITET', cost: { pp: 10 }, temp: { integration: 2, welfare: -2 }, griev: -3, tip: 'Fler går till kursen. Några försvinner ur statistiken.' },
      { text: 'LÅT DET TA DEN TID DET TAR', temp: { integration: -2 }, ind: { unemp: 0.1 }, griev: 3, tip: 'Det tar tid. Det tar mer tid om ingen gör något.' },
    ],
  },
  {
    id: 'mgr_segregation', icon: '\u{1F3D9}\u{FE0F}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'TVÅ STÄDER I EN',
    text: 'En ny kartläggning visar att {stad} i praktiken är två städer. I de södra stadsdelarna är åtta av tio invånare födda utomlands, i de norra en av tio. Barnen träffar nästan aldrig varandra, och skolorna i söder har tre gånger så många obehöriga lärare.',
    when: (c) => (c.ind.segreg ?? 40) > 46 && (c.ind.migrants ?? 0) > 6,
    choices: [
      { text: 'BLANDADE UPPLÅTELSEFORMER I ALLA NYA OMRÅDEN', cost: { pp: 15 }, perm: { integration: 2 }, ind: { segreg: -2 }, tip: 'Hyresrätter i villaområden. Bostadsrätter i höghusen.' },
      { text: 'DUBBEL LÄRARLÖN I SKOLOR SOM HAR DET SVÅRAST', cost: { money: 400 }, perm: { integration: 2 }, temp: { welfare: 1 }, tip: 'De bästa lärarna där de behövs mest.' },
      { text: 'NY SPÅRVÄG SOM BINDER IHOP STADEN', cost: { money: 900 }, perm: { integration: 2, qol: 1 }, ind: { segreg: -2 }, tip: 'Tolv minuter från söder till centrum. Det märks.' },
      { text: 'FOLK BOR DÄR DE VILL', temp: { integration: -2, freedom: 1 }, ind: { segreg: 1 }, tip: 'Eller där de har råd.' },
    ],
  },
  {
    id: 'mgr_utanforskap', icon: '\u{1F693}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'OMRÅDET SOM AMBULANSEN VÄNTAR VID',
    text: 'Polisen har klassat ett bostadsområde i {stad} som särskilt utsatt. Två kriminella nätverk slåss om narkotikahandeln, ambulanspersonalen väntar in polis innan de går in, och de flesta som bor där - som bara vill leva i lugn och ro - har slutat gå ut på kvällarna.',
    when: (c) => (c.ind.exclusion ?? 3) > 4 && c.st.safety < 15 && (c.ind.migrants ?? 0) > 4,
    choices: [
      { text: 'FLER POLISER SOM STANNAR I OMRÅDET I ÅRATAL', cost: { money: 400 }, temp: { safety: 3 }, ind: { feelsafe: 2, policetrust: 2 }, next: ['mgr_utanf_vand', 'mgr_utanf_gang'], tip: 'En polis som kan barnens namn är värd tio i kravallutrustning.' },
      { text: 'FRITIDSGÅRDAR, SOMMARJOBB OCH FÄLTARBETARE', cost: { money: 300 }, perm: { integration: 1 }, ind: { youthunemp: -0.5 }, next: ['mgr_utanf_vand', 'mgr_utanf_gang', null], tip: 'Den som har ett sommarjobb har mindre tid för gänget.' },
      { text: 'VISITATIONSZON OCH ÖVERVAKNINGSKAMEROR', cost: { pp: 10 }, temp: { safety: 4, freedom: -3 }, ind: { policetrust: -2 }, next: ['mgr_utanf_gang', 'mgr_utanf_kravall'], tip: 'Snabba resultat. Långa minnen.' },
      { text: 'KOMMUNEN FÅR LÖSA SINA PROBLEM', temp: { safety: -2 }, ind: { crimeidx: 4 }, next: ['mgr_utanf_gang'], tip: 'Kommunen har redan försökt. Därför ringde de dig.' },
    ],
  },
  {
    id: 'mgr_utanf_gang', icon: '\u{1F6A8}', chain: true, kind: 'migration',
    title: 'SKOTTLOSSNINGEN I {STAD}',
    text: 'En sen kväll sköts en tjugoårig man i benet utanför en pizzeria i området. Han överlevde. Polisen tror att det var en hämnd mellan nätverken och att nästa redan planeras. Föräldrarna i området har startat en grupp som går nattvandringar i gula västar.',
    choices: [
      { text: 'STÖD NATTVANDRARNA OCH FÖRENINGARNA', cost: { money: 150 }, temp: { safety: 2, integration: 2 }, ind: { feelsafe: 1 }, tip: 'Gula västar, termos och mod.' },
      { text: 'SÄRSKILD POLISINSATS MOT NÄTVERKEN', cost: { money: 500 }, temp: { safety: 5 }, ind: { homicide: -5, crimeidx: -4 }, next: ['mgr_utanf_vand', null], tip: 'Ledarna åker in. Frågan är vem som tar över.' },
      { text: 'HÅRDARE STRAFF FÖR VAPENBROTT', cost: { pp: 15 }, temp: { safety: 2, freedom: -1 }, ind: { crimeidx: -2 }, tip: 'Längre straff. Fängelserna blir fulla.' },
      { text: 'DET ÄR GÄNGEN SOM SKJUTER PÅ GÄNGEN', temp: { safety: -3, approval: -2 }, ind: { homicide: 8, feelsafe: -2 }, next: ['mgr_utanf_kravall', null], tip: 'Kulorna läser inte polisens statistik.' },
    ],
  },
  {
    id: 'mgr_utanf_kravall', icon: '\u{1F525}', chain: true, kind: 'migration',
    title: 'BILAR BRINNER I {STAD}',
    text: 'Efter ett gripande som filmades och spreds i sociala medier samlades hundratals ungdomar i området. Under natten brann tolv bilar och en skola fick krossade rutor. Polisen kallade in förstärkning från tre regioner. Ingen skadades allvarligt, men hela landet såg bilderna.',
    choices: [
      { text: 'DIALOG MED FÖRÄLDRAR, FÖRENINGAR OCH TROSSAMFUND', cost: { pp: 10 }, temp: { unrest: -4, integration: 2 }, tip: 'Nästa kväll står föräldrarna ute på gatan i stället.' },
      { text: 'MASSIV POLISNÄRVARO TILLS DET ÄR LUGNT', cost: { money: 300 }, temp: { safety: 3, unrest: -2, freedom: -2 }, ind: { policetrust: -2 }, tip: 'Lugnt i två veckor. Sedan?' },
      { text: 'OBEROENDE UTREDNING AV GRIPANDET', cost: { pp: 5 }, temp: { unrest: -2, freedom: 2 }, ind: { policetrust: 2 }, tip: 'Om polisen gjorde rätt tål det att granskas.' },
      { text: 'NOLLTOLERANS OCH SNABBA DOMAR', temp: { safety: 2, unrest: 3 }, ind: { xenophobia: 1, crimeidx: -2 }, griev: 4, tip: 'Snabba domar. Långa avstånd.' },
    ],
  },
  {
    id: 'mgr_utanf_vand', icon: '\u{1F331}', chain: true, kind: 'migration',
    title: 'VÄNDNINGEN I {STAD}',
    text: 'Två år efter insatserna har området i {stad} plockats bort från polisens lista. Skottlossningarna har upphört, fritidsgården har kö och den gamla parkeringen har blivit en fotbollsplan. Bostadspriserna stiger - och en del av de gamla hyresgästerna oroar sig nu för att inte ha råd att bo kvar.',
    choices: [
      { text: 'GARANTERA HYRESRÄTTER MED RIMLIG HYRA', cost: { money: 300 }, perm: { integration: 2, welfare: 1 }, ind: { segreg: -1 }, tip: 'De som vände området ska få bo kvar i det.' },
      { text: 'BJUD IN HELA LANDET ATT SE RESULTATET', temp: { approval: 4 }, ind: { feelsafe: 2, xenophobia: -1 }, griev: -6, tip: 'Rubrikerna blir för en gångs skull goda.' },
      { text: 'NU KAN POLISEN FLYTTAS NÅGON ANNANSTANS', res: { money: 150 }, temp: { safety: -1 }, tip: 'Det tog tio år att bygga upp. Det tar ett att riva.' },
    ],
  },
  {
    id: 'mgr_parti_vaxer', icon: '\u{1F4E3}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'INVANDRINGSKRITIKERNA RUSAR',
    text: 'Ett parti som vill stoppa nästan all invandring har på ett år gått från fyra till nitton procent i opinionen. Dess väljare oroar sig mest för bostäder, skolor och brott. Partiledaren är skicklig i tv, och de etablerade partierna vet inte om de ska ta debatten eller vända ryggen till.',
    when: (c) => (c.grievOf('migration') > 15 || (c.ind.xenophobia ?? 20) > 36) && c.st.integration < 5 && c.demo > 4,
    choices: [
      { text: 'TA DEBATTEN: VISA SIFFRORNA OCH VAD SOM GÖRS', cost: { pp: 10 }, temp: { approval: 1 }, griev: -4, next: ['mgr_parti_val', null], tip: 'Fakta mot känslor. Ibland vinner fakta.' },
      { text: 'LÅNA DERAS POLITIK - SKÄRP REGLERNA LITE', cost: { pp: 20 }, law: ['immigration', 'managed'], temp: { integration: 2, freedom: -1 }, griev: -8, next: ['mgr_parti_val', null], tip: 'Väljarna väljer ofta originalet framför kopian.' },
      { text: 'KALLA DEM EXTREMISTER OCH VÄGRA SAMARBETA', temp: { ideopower: 2 }, ind: { xenophobia: 1 }, next: ['mgr_parti_val', 'mgr_parti_val', 'mgr_parti_hatbrott'], tip: 'Deras väljare känner sig utpekade. Och röstar.' },
    ],
  },
  {
    id: 'mgr_parti_val', icon: '\u{1F5F3}\u{FE0F}', chain: true, kind: 'migration',
    title: 'VALNATTENS JORDSKRED',
    text: 'Det invandringskritiska partiet fick tjugotre procent i valet och är nu landets näst största. Ingen regering kan bildas utan att antingen samarbeta med dem eller bilda en bred koalition över blockgränsen. Partiledaren kräver ett invandringsstopp som villkor för sitt stöd.',
    choices: [
      { text: 'BRED KOALITION ÖVER BLOCKGRÄNSEN', cost: { pp: 30 }, temp: { stability: 3, polpower: -4 }, ind: { trustgov: -2 }, tip: 'Gamla fiender i samma regering. Middagarna blir stela.' },
      { text: 'SAMARBETA - MOT KRAV PÅ STÖRRE INTEGRATIONSSATSNINGAR', cost: { pp: 15 }, law: ['immigration', 'restricted'], perm: { integration: 2 }, griev: -10, rel: -3, tip: 'Färre kommer. De som kommer får mer hjälp.' },
      { text: 'GE DEM INVANDRINGSSTOPPET', law: ['immigration', 'closed'], temp: { gdp: -3 }, rel: -6, griev: -12, ind: { xenophobia: 1 }, tip: 'Lugnet kommer. Bristen på arbetskraft också.' },
      { text: 'REGERA I MINORITET OCH HOPPAS', temp: { stability: -4, polpower: -3 }, next: ['mgr_parti_hatbrott', null], tip: 'Varje omröstning blir ett lotteri.' },
    ],
  },
  {
    id: 'mgr_parti_hatbrott', icon: '\u{1F56F}\u{FE0F}', chain: true, kind: 'migration',
    title: 'BRANDEN PÅ ASYLBOENDET',
    text: 'I natt tände någon eld vid entrén till ett asylboende i {stad}. Sextio personer, varav tjugo barn, väcktes av brandlarmet och tog sig ut i tid. Ingen skadades. På morgonen kom hundratals grannar med filtar, kaffe och leksaker. Polisen utreder det som ett hatbrott.',
    choices: [
      { text: 'BESÖK BOENDET OCH FÖRDÖM DÅDET I TV', cost: { pp: 5 }, temp: { approval: 2, integration: 2, unrest: -2 }, ind: { xenophobia: -1 }, tip: 'Landet ser vem som står bredvid vem.' },
      { text: 'SÄRSKILD UTREDARGRUPP FÖR HATBROTT', cost: { money: 200 }, temp: { safety: 3 }, ind: { crimeidx: -2 }, tip: 'Gärningsmännen grips inom en månad.' },
      { text: 'VAKTER VID ALLA ASYLBOENDEN', cost: { money: 150 }, temp: { safety: 2 }, tip: 'Tryggare boenden. Dyrare också.' },
      { text: 'LÅT POLISEN SKÖTA DET I TYSTHET', temp: { integration: -2, unrest: 2 }, ind: { xenophobia: 1 }, tip: 'Tystnaden tolkas. Inte till din fördel.' },
    ],
  },
  {
    id: 'mgr_hatbrott', icon: '\u{1F494}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'HATBROTTEN ÖKAR',
    text: 'Anmälningarna om hatbrott har ökat med en tredjedel på ett år. En busschaufför med slöja får glåpord varje vecka, en synagoga har klottrats ner och en restaurangägare från {land} har fått sina rutor krossade tre gånger. Brottsofferjouren i {stad} hinner inte svara i telefon.',
    when: (c) => ((c.ind.xenophobia ?? 20) > 33 || c.trend('xenophobia') > 1.5) && (c.ind.migrants ?? 0) > 3 && c.st.safety < 30,
    choices: [
      { text: 'SKÄRPTA STRAFF FÖR BROTT MED HATMOTIV', cost: { pp: 15 }, temp: { safety: 2, integration: 2, freedom: -1 }, tip: 'Signalen är tydlig. Bevisen är svåra.' },
      { text: 'SKOLPROGRAM MOT FÖRDOMAR', cost: { money: 250 }, perm: { integration: 1 }, ind: { xenophobia: -2 }, tip: 'Tar tio år. Fungerar.' },
      { text: 'MER PENGAR TILL BROTTSOFFERJOURERNA', cost: { money: 100 }, temp: { welfare: 1, integration: 1 }, tip: 'Någon svarar i telefon igen.' },
      { text: 'YTTRANDEFRIHETEN GÄLLER ALLA', temp: { freedom: 1, integration: -3 }, ind: { xenophobia: 2 }, griev: 4, tip: 'Glåpord är inte brott. Krossade rutor är det.' },
    ],
  },
  {
    id: 'mgr_lonedumpning', icon: '\u{1F477}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'FACKET LARMAR OM LÖNEDUMPNING',
    text: 'På byggena i {huvudstad} arbetar tusentals utländska byggnadsarbetare för halva avtalslönen via underentreprenörer i fyra led. Facket har blockerat ett av de största bostadsbyggena, och arbetsgivarna säger att utan dem står hälften av bostadsprojekten still.',
    when: (c) => c.is('immigration', 'guestworker', 'freemove', 'open', 'noborders', 'relaxed') && (c.ind.unemp ?? 6) > 4,
    choices: [
      { text: 'SAMMA LÖN FÖR SAMMA JOBB - I LAG', cost: { pp: 15 }, temp: { gdp: -2, integration: 2, approval: 2 }, ind: { strikes: -20 }, tip: 'Byggena blir dyrare. Bråket blir mindre.' },
      { text: 'FLER INSPEKTÖRER PÅ BYGGENA', cost: { money: 200 }, perm: { corruption: -1 }, temp: { safety: 1 }, tip: 'Fyra led blir två. Två led blir ett.' },
      { text: 'LÅT FACK OCH ARBETSGIVARE FÖRHANDLA',
        risk: { chance: 0.5,
          win: { text: 'Ett nytt avtal ger alla samma minimilön. Byggena rullar vidare.', temp: { integration: 2, gdp: 1 } },
          lose: { text: 'Blockaden sprider sig till fem nya byggen. Bostäderna blir försenade.', temp: { gdp: -3, unrest: 3 }, ind: { strikes: 30 } } } },
    ],
  },
  {
    id: 'mgr_kommuner_konkurs', icon: '\u{1F4B8}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'KOMMUNERNA HAR SLUT PÅ PENGAR',
    text: 'Mottagandet har kostat mer än någon räknade med. Fjorton kommuner har höjt skatten, och {stad} har stängt två simhallar och ett bibliotek för att få ihop budgeten. Kommunalråden kräver att staten tar hela kostnaden för de första tre åren.',
    when: (c) => c.migRate > 1.3 && (c.deficit || c.st.income < 5) && c.day > 60,
    choices: [
      { text: 'STATEN BETALAR DE TRE FÖRSTA ÅREN', cost: { money: 900 }, temp: { approval: 2, welfare: 1 }, griev: -10, tip: 'Simhallarna öppnar igen. Statskassan simmar inte.' },
      { text: 'TVÅ ÅR, INTE TRE', cost: { money: 500 }, temp: { welfare: -1 }, griev: -5, tip: 'En kompromiss. Ingen är nöjd, alla klarar sig.' },
      { text: 'KOMMUNERNA FÅR PRIORITERA', temp: { welfare: -3, qol: -2, integration: -2 }, ind: { trustgov: -2 }, griev: 6, tip: 'Bibliotekarierna i {stad} får gott om tid att läsa.' },
    ],
  },
  {
    id: 'mgr_simlektionen', icon: '\u{1F3CA}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'BRÅKET OM SIMLEKTIONEN',
    text: 'Några föräldrar på en skola i {stad} vill inte att deras döttrar ska ha simundervisning tillsammans med pojkar. Rektorn har gett vissa elever ledigt, och nu protesterar andra föräldrar - flera av dem själva invandrade - som tycker att skolan sviker flickorna. Debatten har nått riksmedia.',
    when: (c) => (c.ind.migrants ?? 0) > 6 && c.st.integration < 15 && c.is('religion', 'secularism', 'atheism', 'pluralism') && c.day > 80,
    choices: [
      { text: 'SIMNING ÄR OBLIGATORISKT - FÖR ALLA', cost: { pp: 5 }, temp: { integration: 2, freedom: -1 }, tip: 'Simkunnighet är inte en åsikt. Heltäckande baddräkt är tillåten.' },
      { text: 'EGNA OMKLÄDNINGSRUM, GEMENSAM LEKTION', cost: { money: 100 }, temp: { integration: 3 }, tip: 'Ett skynke och en dialog. Alla flickor simmar.' },
      { text: 'LÅT VARJE SKOLA BESTÄMMA SJÄLV', temp: { integration: -2, freedom: 1 }, tip: 'Tvåhundra skolor, tvåhundra regler.' },
    ],
  },
  {
    id: 'mgr_cv_namn', icon: '\u{1F4C4}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'SAMMA CV, OLIKA NAMN',
    text: 'Forskare vid universitetet i {stad} skickade tvåtusen fejkade jobbansökningar med exakt samma meriter. Den enda skillnaden var namnet. Sökande med namn som lät utländska fick hälften så många svar. Flera av arbetsgivarna som testades har själva skrivit under på mångfaldslöften.',
    when: (c) => (c.ind.migemp ?? 60) < 62 && (c.ind.migrants ?? 0) > 5 && c.st.freedom > -20,
    choices: [
      { text: 'ANONYMA ANSÖKNINGAR I DEN OFFENTLIGA SEKTORN', cost: { pp: 10 }, perm: { integration: 1 }, temp: { approval: 1 }, tip: 'Staten går först. Om det fungerar följer andra.' },
      { text: 'KÄNNBARA BÖTER FÖR DISKRIMINERING', cost: { pp: 15 }, perm: { integration: 2 }, temp: { gdp: -1 }, tip: 'Svårt att bevisa. Lätt att avskräcka.' },
      { text: 'ARBETSGIVARNA ANSTÄLLER VEM DE VILL', temp: { integration: -2, freedom: 1 }, griev: 3, tip: 'Ahmed byter namn till Anders. Han får jobbet.' },
    ],
  },
  {
    id: 'mgr_ryktet', icon: '\u{1F4F1}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'RYKTET SOM SPREDS',
    text: 'En video påstår att asylsökande i {stad} får nya bilar och gratis lägenheter med havsutsikt. Den är påhittad från början till slut, men har visats fyra miljoner gånger på tre dagar. Kommunens telefonväxel är nedringd, och en kvinna på asylboendet har slutat våga gå till affären.',
    when: (c) => (c.ind.xenophobia ?? 20) > 25 && c.st.immigration > 0 && (c.ind.internet ?? 60) > 40,
    choices: [
      { text: 'SVARA MED FAKTA I ALLA KANALER', cost: { pp: 5 }, temp: { approval: 1, integration: 1 }, ind: { xenophobia: -1 }, tip: 'Sanningen tar på sig skorna. Lögnen har redan sprungit tre varv.' },
      { text: 'KRÄV ATT PLATTFORMARNA TAR BORT VIDEON', cost: { pp: 15 }, temp: { integration: 1, freedom: -2 }, ind: { pressfree: -1 }, tip: 'Videon försvinner. Tio kopior dyker upp.' },
      { text: 'IGNORERA DET - DET BLÅSER ÖVER', temp: { integration: -2, unrest: 2 }, ind: { xenophobia: 2 }, tip: 'Det blåser över. Efter att ha blåst upp.' },
    ],
  },

  // ===== KAOSET: NÄR FLÖDET SKENAR =====
  // Startar bara vid ett extremt flöde (c.migRate över 2 och integrationen under noll).
  // Kedjan kan eskalera från överfulla mottagningar till kravaller, regeringskris och
  // undantagstillstånd — eller lugnas ner till en försoning. Varje steg har en väg ut.
  {
    id: 'mgr_kaos_ankomst', icon: '\u{1F6C2}', weight: 3, cooldown: 800, kind: 'migration', react: true,
    title: 'TIOTUSEN I VECKAN',
    text: 'Det kommer nu över tiotusen asylsökande i veckan. Mottagningscentralen i {stad} är byggd för tvåhundra och har åttahundra som sover på golvet. Migrationsmyndigheten har slutat svara i telefon, kommunerna har inga lägenheter kvar och frivilliga delar ut mat på tågstationen dygnet runt.',
    when: (c) => c.migRate > 2.5 && c.st.integration < 0,
    choices: [
      { text: 'NATIONELL KRISLEDNING OCH ARMÉNS TÄLT SOM NÖDBOENDEN', cost: { money: 700, man: 5 }, temp: { stability: 2, integration: -2 }, next: ['mgr_kaos_talt', 'mgr_kaos_kommuner'], tip: 'Tak över huvudet i natt. Resten får vänta till i morgon.' },
      { text: 'TILLFÄLLIG GRÄNSKONTROLL MED ID-KRAV', cost: { pp: 20 }, law: ['border_control', 'biometric'], temp: { freedom: -2 }, ind: { migrants: -0.3 }, griev: -6, next: ['mgr_kaos_grans', 'mgr_kaos_kommuner'], tip: 'Flödet bromsar in. Pendlarna också.' },
      { text: 'BE OMVÄRLDEN OM HJÄLP ATT FÖRDELA', cost: { pp: 10 }, rel: 4, next: ['mgr_kaos_kommuner', null],
        risk: { chance: 0.4,
          win: { text: 'Fyra länder lovar att ta emot var sin del. Trycket lättar något.', temp: { unrest: -3 }, ind: { migrants: -0.4 } },
          lose: { text: 'Alla lovar att titta på saken. Ingen gör det.', temp: { unrest: 3, approval: -2 } } } },
      { text: 'DET LUGNAR SIG - FORTSÄTT SOM VANLIGT', temp: { unrest: 6, approval: -5 }, griev: 12, next: ['mgr_kaos_talt', 'mgr_kaos_kravall', 'mgr_kaos_milis'], tip: 'Det lugnar sig inte.' },
    ],
  },
  {
    id: 'mgr_kaos_talt', icon: '\u{26FA}', chain: true, kind: 'migration',
    title: 'TÄLTLÄGRET I FROSTEN',
    text: 'Frosten har kommit och fyratusen människor bor fortfarande i tält på en fotbollsplan utanför {stad}. Barn har fått lunginflammation, och en internationell hjälporganisation har satt upp ett fältsjukhus. Bilderna visas på kvällsnyheterna i {land} och {granne}, och FN har ringt två gånger.',
    choices: [
      { text: 'TA ÖVER HOTELL OCH KONFERENSANLÄGGNINGAR', cost: { money: 800 }, temp: { integration: 2, welfare: -1 }, rel: 4, griev: -6, tip: 'Hotellägarna får betalt. Turisterna får bo någon annanstans.' },
      { text: 'ARMÉN BYGGER VINTERBARACKER PÅ TVÅ VECKOR', cost: { man: 8, money: 300 }, temp: { stability: 2 }, rel: 2, tip: 'Soldaterna bygger fort. De har övat på värre.' },
      { text: 'LÅT HJÄLPORGANISATIONERNA SKÖTA DET', temp: { approval: -4, integration: -3 }, rel: -6, griev: 6, next: ['mgr_kaos_kravall', null], tip: 'De gör ett bra jobb. Det är just det som syns.' },
    ],
  },
  {
    id: 'mgr_kaos_kommuner', icon: '\u{1F3DB}\u{FE0F}', chain: true, kind: 'migration',
    title: 'KOMMUNERNA SÄGER NEJ',
    text: 'Fyrtio kommuner har skickat ett gemensamt brev: de tar inte emot en enda person till förrän staten betalar och skickar personal. Kommunalrådet i {stad} säger i radio att hennes socialtjänst har arbetat dubbla pass i fyra månader och att tre av tio nu är sjukskrivna.',
    choices: [
      { text: 'STATEN TAR HELA KOSTNADEN I ETT ÅR', cost: { money: 1200 }, temp: { stability: 3 }, griev: -12, tip: 'Kommunerna andas ut. Finansministern andas in.' },
      { text: 'TVINGA KOMMUNERNA ATT TA EMOT ENLIGT LAG', cost: { pp: 25 }, temp: { statepower: 3, approval: -4, integration: 1 }, next: ['mgr_kaos_regeringskris', null], tip: 'Lagen tvingar dem. Den bygger inga bostäder.' },
      { text: 'PAUSA ANVISNINGARNA - FOLK FÅR VÄNTA I CENTRALERNA', temp: { unrest: 5, integration: -4 }, griev: 6, next: ['mgr_kaos_talt', 'mgr_kaos_kravall'], tip: 'Centralerna var fulla redan förra veckan.' },
    ],
  },
  {
    id: 'mgr_kaos_grans', icon: '\u{1F6A7}', chain: true, kind: 'migration',
    title: 'KÖERNA VID GRÄNSEN',
    text: 'Den nya gränskontrollen fungerar - flödet har halverats. Men pendlarna från {granne} står två timmar i kö varje morgon, lastbilarna med frukt och reservdelar har fastnat och regeringen i {granne} anklagar landet för att skjuta över hela ansvaret på dem.',
    choices: [
      { text: 'SNABBFIL FÖR PENDLARE OCH GODS', cost: { money: 300 }, temp: { gdp: 1 }, rel: 2, tip: 'Lastbilarna rullar. Kontrollen finns kvar.' },
      { text: 'GEMENSAM KONTROLL MED {GRANNE}', cost: { pp: 15 }, rel: 6, temp: { stability: 2 }, ind: { migrants: -0.2 }, tip: 'Två länder, ett problem, en lösning.' },
      { text: 'STÄNG GRÄNSEN HELT', law: ['border_control', 'fences'], temp: { gdp: -4, safety: 2 }, rel: -10, ind: { migrants: -0.4 }, griev: -4, tip: 'Stängt är stängt. Även för apelsinerna.' },
    ],
  },
  {
    id: 'mgr_kaos_kravall', icon: '\u{1F525}', chain: true, kind: 'migration',
    title: 'KRAVALLER I {STAD}',
    text: 'Ett slagsmål mellan unga män vid mottagningscentralen spred sig under natten. Stenar kastades, en motdemonstration samlade tusen personer och polisen fick hålla isär grupperna med hästar och sköldar. Fyrtio greps, och sjukhuset tog emot ett dussin lättare skadade.',
    choices: [
      { text: 'UTEGÅNGSFÖRBUD I STADEN EN VECKA', cost: { pp: 10 }, temp: { safety: 3, freedom: -3 }, next: ['mgr_kaos_nodlage', 'mgr_kaos_forsoning'], tip: 'Gatorna töms. Ilskan gör det inte.' },
      { text: 'MEDLARE, FÖRENINGAR OCH NATTVANDRARE', cost: { money: 200 }, temp: { unrest: -3, integration: 2 }, next: ['mgr_kaos_forsoning', null], tip: 'De som bor där vet bäst hur man lugnar det.' },
      { text: 'HÅRDA TAG OCH SNABBA UTVISNINGAR', temp: { safety: 3, freedom: -3 }, rel: -4, ind: { xenophobia: 2, protests: 40 }, griev: 5, next: ['mgr_kaos_nodlage', 'mgr_kaos_milis'], tip: 'Det låter handlingskraftigt. Det blir sällan lugnare.' },
    ],
  },
  {
    id: 'mgr_kaos_milis', icon: '\u{1F526}', chain: true, kind: 'migration',
    title: 'MEDBORGARGARDET PATRULLERAR',
    text: 'Ett nätverk av män i svarta jackor har börjat patrullera tågstationen i {stad} "eftersom staten inte gör det". De filmar asylsökande och lägger ut klippen på nätet. Polisen säger att de inte bryter mot någon lag än, men att stämningen blir farligare för varje kväll.',
    choices: [
      { text: 'FÖRBJUD PRIVATA PATRULLER', cost: { pp: 15 }, temp: { safety: 2, freedom: -1 }, ind: { xenophobia: -1 }, tip: 'Våldsmonopolet är statens. Det är hela poängen.' },
      { text: 'FLER POLISER PÅ STATIONEN SÅ GARDET BLIR ONÖDIGT', cost: { money: 300 }, temp: { safety: 3 }, ind: { feelsafe: 2 }, tip: 'Svårt att leka polis när den riktiga står bredvid.' },
      { text: 'DE GÖR JU INGET OLAGLIGT', temp: { safety: -3, unrest: 4 }, ind: { xenophobia: 3 }, griev: 6, next: ['mgr_kaos_kravall', null], tip: 'Än.' },
    ],
  },
  {
    id: 'mgr_kaos_regeringskris', icon: '\u{1F3DB}\u{FE0F}', chain: true, kind: 'migration',
    title: 'REGERINGEN SPRICKER',
    text: 'Ett av regeringspartierna har lämnat koalitionen i protest mot hur flyktingkrisen hanteras. Ett annat hotar att följa efter om inte gränsen stängs inom en vecka. Oppositionen har begärt misstroendeomröstning, och räntan på statens lån steg en halv procentenhet på en dag.',
    choices: [
      { text: 'STÄNG GRÄNSEN OCH RÄDDA REGERINGEN', law: ['immigration', 'closed'], temp: { stability: 4, gdp: -3 }, rel: -8, ind: { migrants: -0.5 }, griev: -10, tip: 'Regeringen överlever. Arbetsmarknaden får lida senare.' },
      { text: 'FÖRHANDLA FRAM EN BRED UPPGÖRELSE', cost: { pp: 35 }, law: ['immigration', 'managed'], temp: { stability: 5, approval: 2 }, griev: -8, tip: 'Alla får något. Ingen får allt. Så ser fungerande politik ut.' },
      { text: 'UTLYS NYVAL', cost: { money: 400 },
        risk: { chance: 0.5,
          win: { text: 'Väljarna ger dig ett starkare mandat att lösa krisen.', temp: { approval: 6, stability: 4 } },
          lose: { text: 'Valet ger ett splittrat parlament. Ingen kan bilda regering på månader.', temp: { stability: -8, polpower: -6 } } } },
      { text: 'SITT KVAR I MINORITET', temp: { stability: -6, polpower: -5 }, ind: { trustgov: -4 }, tip: 'Varje dag en ny omröstning. Varje dag en ny kris.' },
    ],
  },
  {
    id: 'mgr_kaos_nodlage', icon: '\u{1F6A8}', chain: true, kind: 'migration',
    title: 'LANDET BRINNER',
    text: 'Oroligheterna har spridit sig till sex städer. Asylboenden har attackerats, butiker har plundrats och unga i förorterna har svarat med egna upplopp. Militären har satts i beredskap, utländska ambassader avråder från resor hit och börsen föll sju procent på två dagar.',
    choices: [
      { text: 'UNDANTAGSTILLSTÅND OCH MILITÄR PÅ GATORNA', cost: { pp: 30 }, temp: { safety: 6, unrest: -6, freedom: -8 }, perm: { freedom: -2 }, rel: -8, ind: { demo: -0.4, pressfree: -3 }, next: ['mgr_kaos_forsoning', null], tip: 'Gatorna blir lugna. Demokratin får ett ärr.' },
      { text: 'FÖRSONINGSTAL OCH KRISFOND FÖR STÄDERNA', cost: { money: 1500, pp: 20 }, temp: { unrest: -8, approval: 3 }, mod: 'national_unity', griev: -15, next: ['mgr_kaos_forsoning'], tip: 'Ett tal och en check. Båda behövs.' },
      { text: 'STÄNG GRÄNSEN OCH UTVISA ALLA UTAN PAPPER', law: ['immigration', 'deportation'], temp: { unrest: -3, freedom: -5 }, rel: -15, ind: { migrants: -1, xenophobia: 3 }, griev: -10, tip: 'Lugnet kommer. Notan betalas i många år.' },
      { text: 'POLISEN ÅTERTAR GATORNA STAD FÖR STAD',
        risk: { chance: 0.5,
          win: { text: 'Det tar tre veckor, men städerna lugnar sig en efter en.', temp: { safety: 4, unrest: -5 } },
          lose: { text: 'Varje ingripande föder nya kravaller. Det blir en lång sommar.', temp: { unrest: 10, stability: -6 }, ind: { homicide: 10, tourists: -20, stockcap: -5 } } } },
    ],
  },
  {
    id: 'mgr_kaos_forsoning', icon: '\u{1F54A}\u{FE0F}', chain: true, kind: 'migration',
    title: 'EFTER STORMEN',
    text: 'Det har varit lugnt i två månader. Flödet har minskat, tälten är borta och i {stad} har grannar från båda sidor av gatan börjat bygga upp det som förstördes. En lärare och en före detta kravallpolis har startat en förening som heter "Vi som bor här". Landet är trött men helt.',
    choices: [
      { text: 'STOR SATSNING PÅ DE DRABBADE STÄDERNA', cost: { money: 900 }, perm: { integration: 3, stability: 2 }, griev: -12, tip: 'Skolor, jobb och bussar. Det tråkiga som fungerar.' },
      { text: 'SANNINGSKOMMISSION OM VAD SOM GICK FEL', cost: { pp: 15 }, perm: { integration: 1 }, temp: { freedom: 2 }, ind: { trustgov: 3 }, tip: 'Rapporten blir obekväm. Det är meningen.' },
      { text: 'TACKA ALLA OCH GÅ VIDARE', temp: { approval: 2, integration: 1 }, griev: -5, tip: 'Föreningen "Vi som bor här" får ett diplom.' },
    ],
  },
  {
    id: 'mgr_kaos_vard', icon: '\u{1F691}', weight: 2, cooldown: 700, kind: 'migration', react: true,
    title: 'AKUTEN I {STAD} ÄR FULL',
    text: 'På akuten i {stad} väntar patienterna nu i genomsnitt nio timmar. Många av de nya patienterna är nyanlända som ännu inte har någon vårdcentral, och personalen har inte haft semester på ett år. Sjuksköterskorna hotar att säga upp sig kollektivt den första nästa månad.',
    when: (c) => c.migRate > 2 && c.st.integration < 0 && c.st.welfare < 20,
    choices: [
      { text: 'NÖDBEMANNING FRÅN ARMÉNS FÄLTSJUKVÅRD', cost: { man: 5, money: 200 }, temp: { welfare: 2 }, tip: 'Militärläkare på akuten. De har sett värre.' },
      { text: 'TILLFÄLLIGA VÅRDCENTRALER VID BOENDENA', cost: { money: 500 }, temp: { welfare: 3, integration: 2 }, griev: -5, tip: 'Akuten slipper hosta och skrubbsår.' },
      { text: 'HÖJ LÖNEN FÖR AKUTPERSONALEN', cost: { money: 400 }, temp: { welfare: 2 }, ind: { strikes: -20 }, tip: 'Uppsägningarna dras tillbaka. Köerna står kvar.' },
      { text: 'BARA AKUT VÅRD FÖR ASYLSÖKANDE', temp: { welfare: 1, freedom: -2, hdi: -1 }, rel: -3, griev: 5, tip: 'Det som inte är akut i dag blir akut i morgon.' },
    ],
  },
  {
    id: 'mgr_kaos_skola', icon: '\u{1F3EB}', weight: 2, cooldown: 700, kind: 'migration', react: true,
    title: 'TREHUNDRA NYA ELEVER PÅ EN MÅNAD',
    text: 'Skolorna i {stad} fick trehundra nya elever på en månad. Gymnastiksalarna har gjorts om till klassrum, lärarna undervisar i skift och på en skola går eleverna bara halva dagen. Föräldrar från alla håll har börjat flytta sina barn till skolor i grannkommunen.',
    when: (c) => c.migRate > 2 && c.st.integration < -5 && (c.ind.kids ?? 18) > 10,
    choices: [
      { text: 'PENSIONERADE LÄRARE TILLBAKA MED DUBBEL LÖN', cost: { money: 500 }, temp: { integration: 2, welfare: 1 }, tip: 'Fröken Berg, 71, är tillbaka. Hon har saknat det.' },
      { text: 'PAVILJONGER OCH LEKTIONER I TRE SKIFT', cost: { money: 300 }, temp: { integration: 1, qol: -1 }, tip: 'Matte klockan sju på kvällen. Ingen är pigg.' },
      { text: 'FÖRDELA ELEVERNA ÖVER HELA REGIONEN', cost: { pp: 10 }, temp: { integration: 1, approval: -2 }, ind: { segreg: -1 }, tip: 'Skolbussarna går i skytteltrafik.' },
      { text: 'SKOLPLIKTEN FÅR VÄNTA FÖR DE NYA', temp: { integration: -5, hdi: -1 }, rel: -2, griev: 5, tip: 'Ett år utan skola. Det syns i statistiken om tjugo år.' },
    ],
  },
  {
    id: 'mgr_kaos_opinion', icon: '\u{1F4CA}', weight: 2, cooldown: 700, kind: 'migration', react: true,
    title: 'TRE AV FYRA VILL HA EN PAUS',
    text: 'En ny mätning visar att tre av fyra väljare vill ha ett tillfälligt stopp för asylinvandringen tills mottagandet fungerar igen. Samma mätning visar att två av tre själva har hjälpt till - skänkt kläder, kört bil eller öppnat sitt hem. Landet är både generöst och slutkört.',
    when: (c) => c.migRate > 1.8 && c.st.integration < -5 && c.st.unrest > -10,
    choices: [
      { text: 'TILLFÄLLIGT ASYLSTOPP I SEX MÅNADER', law: ['immigration', 'restricted'], rel: -5, ind: { migrants: -0.3 }, griev: -12, tip: 'Mottagandet hinner ikapp. Grannländerna får ta smällen.' },
      { text: 'KVOTER: VI TAR EMOT SÅ MÅNGA VI KAN INTEGRERA', cost: { pp: 15 }, law: ['immigration', 'managed'], temp: { integration: 3 }, griev: -8, tip: 'Ett tal som går att planera efter.' },
      { text: 'HÅLL LINJEN OCH BYGG UT MOTTAGANDET', cost: { money: 800 }, temp: { integration: 2 }, rel: 5, griev: 5, tip: 'Omvärlden applåderar. Väljarna gör det inte.' },
    ],
  },

  // ===== INTEGRATIONSPOLITIKEN =====
  {
    id: 'mgr_r_sprakkrav', icon: '\u{1F4DD}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'SPRÅKPROVET DELAR LANDET',
    text: 'Sedan språkpolitiken skärptes krävs språkprov för allt fler saker: bidrag, bostadskö, medborgarskap och vissa jobb. Kurserna är överfulla, äldre invandrare som arbetat här i trettio år har fått brev om indraget stöd, och minoritetsföreningarna kallar ändringen ett övergrepp.',
    when: (c) => c.changed('language') && c.is('language', 'langtests', 'publiconly', 'assimilation', 'banned'),
    choices: [
      { text: 'BACKA ÄNDRINGEN AV SPRÅKPOLITIKEN', cost: { pp: 15 }, undo: 'language', temp: { freedom: 2 }, griev: -15, tip: 'Föreningarna firar. Språkkurserna står kvar.' },
      { text: 'UNDANTAG FÖR ÄLDRE OCH GRATIS KURSER FÖR ALLA', cost: { money: 400 }, temp: { integration: 2 }, griev: -8, tip: 'Den som ska klara ett prov ska få chansen att plugga.' },
      { text: 'STÅ FAST - SPRÅKET ÄR NYCKELN', temp: { integration: 2, unrest: 3 }, griev: 6, tip: 'Nyckeln fungerar. För dem som hinner få den.' },
    ],
  },
  {
    id: 'mgr_modersmal', icon: '\u{1F4D6}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'MODERSMÅLET I SKOLAN',
    text: 'Efter den nya språkpolitiken har barn rätt till undervisning i sitt modersmål. I {stad} har föräldrar från tjugo länder anmält sina barn. Forskarna säger att barn som behärskar sitt första språk lär sig det andra snabbare, men rektorerna undrar var de ska hitta lärare i fyrtio språk.',
    when: (c) => c.raised('language') && c.is('language', 'manyofficial', 'mothertongue', 'regional'),
    choices: [
      { text: 'FJÄRRUNDERVISNING FÖR DE MINDRE SPRÅKEN', cost: { rp: 15 }, perm: { integration: 1 }, temp: { approval: 1 }, tip: 'En lärare på skärmen, tolv barn i tolv städer.' },
      { text: 'UTBILDA MODERSMÅLSLÄRARE', cost: { money: 300 }, perm: { integration: 2 }, griev: -4, tip: 'Många av dem finns redan. De kör taxi.' },
      { text: 'KOMMUNERNA FÅR ORDNA DET MED DE PENGAR DE HAR', temp: { integration: -1, approval: -1, income: 1 }, tip: 'En rättighet utan pengar är ett löfte.' },
    ],
  },
  {
    id: 'mgr_medborgarprov', icon: '\u{1F4CB}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'HALVA REDAKTIONEN KUGGADE',
    text: 'En tidning lät tjugo av sina journalister, alla födda i landet, göra det nya medborgarprovet. Elva kuggade - de visste inte vilket år grundlagen skrevs eller hur många ledamöter parlamentet har. Samtidigt klarar nio av tio sökande provet på första försöket.',
    when: (c) => c.is('citizenship', 'testsoath', 'loyalty') && c.day > 60,
    choices: [
      { text: 'GÖR PROVET OBLIGATORISKT I GYMNASIET', cost: { money: 100 }, temp: { ideopower: 2, research: 1 }, tip: 'Rättvisan kräver att alla lider lika.' },
      { text: 'SKRIV OM PROVET: FÄRRE ÅRTAL, MER VARDAG', cost: { pp: 5 }, temp: { integration: 2, approval: 1 }, tip: 'Hur sorterar man soporna? Det är medborgarkunskap.' },
      { text: 'SKRATTA MED OCH GÅ VIDARE', temp: { approval: 2 }, ind: { trustgov: 1 }, tip: 'Chefredaktören klarade sig. Med nöd och näppe.' },
    ],
  },
  {
    id: 'mgr_r_medborgarskap_latt', icon: '\u{1FAAA}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'MEDBORGARE EFTER TRE ÅR',
    text: 'Efter beslutet om {lag} kan den som bott här i några år bli medborgare. Kön till medborgarceremonierna växer och föreningarna jublar: den som får rösta engagerar sig, och den som engagerar sig stannar. Kritikerna säger att medborgarskapet har blivit en blankett i stället för ett löfte.',
    when: (c) => c.changed('citizenship') && c.is('citizenship', 'residency', 'birthright', 'easy'),
    choices: [
      { text: 'FIRA MED CEREMONIER I VARJE KOMMUN', cost: { money: 150 }, temp: { integration: 3, approval: 1 }, ind: { turnout: 1 }, tip: 'En blomma, ett löfte och en flagga.' },
      { text: 'LÄGG TILL ETT ENKELT SPRÅKKRAV', cost: { pp: 10 }, temp: { integration: 2, approval: 1 }, griev: -4, tip: 'Lätt att bli medborgare. Inte helt utan ansträngning.' },
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 15 }, undo: true, temp: { integration: -2, ideopower: 2 }, tip: 'De som hann bli medborgare får behålla det. Resten får vänta.' },
      { text: 'LÅT REFORMEN VERKA', temp: { integration: 1, immigration: 1 }, tip: 'Effekten syns om några år. Eller vid nästa val.' },
    ],
  },
  {
    id: 'mgr_r_denaturalisering', icon: '\u{1F6AB}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'MEDBORGARSKAPET KAN TAS IFRÅN DIG',
    text: 'Efter beslutet om {lag} kan staten dra in medborgarskapet för den som "visat bristande lojalitet". Det första beslutet gäller en journalist från {stad} som kritiserat regeringen. Hon är född här och har inget annat medborgarskap. Advokatsamfundet varnar för att hon blir statslös.',
    when: (c) => c.changed('citizenship') && c.is('citizenship', 'loyalty', 'denaturalize'),
    choices: [
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 20 }, undo: true, temp: { freedom: 3 }, ind: { demo: 0.2 }, griev: -15, tip: 'Ett pass är inte en belöning för gott uppförande.' },
      { text: 'UNDANTA ALLA SOM ÄR FÖDDA HÄR', cost: { pp: 10 }, temp: { freedom: 1 }, griev: -5, tip: 'Journalisten får behålla sitt pass. Hennes kollega från {land} får det inte.' },
      { text: 'LAGEN ÄR LAGEN', temp: { statepower: 3, freedom: -3 }, rel: -5, ind: { demo: -0.2, pressfree: -2 }, next: ['mgr_statslos', null], tip: 'Kritiska journalister blir plötsligt mycket försiktiga.' },
    ],
  },
  {
    id: 'mgr_statslos', icon: '\u{1F4F0}', chain: true, kind: 'migration',
    title: 'STATSLÖS I SITT EGET LAND',
    text: 'Journalisten från {stad} har förlorat sitt medborgarskap och därmed sitt pass, sin rösträtt och sitt jobb. Hon bor kvar i en lägenhet hon inte längre har rätt att hyra och skriver krönikor som publiceras i tidningar i {land} och {granne}. FN:s flyktingorgan har tagit upp fallet.',
    choices: [
      { text: 'ÅTERGE HENNE MEDBORGARSKAPET I TYSTHET', cost: { pp: 10 }, temp: { freedom: 2 }, rel: 4, griev: -5, tip: 'Tyst och snabbt. Hon skriver om det ändå.' },
      { text: 'GE HENNE ETT ENKELRESEDOKUMENT TILL {LAND}', temp: { statepower: 2, freedom: -4 }, rel: -10, ind: { pressfree: -4, demo: -0.2 }, tip: 'Hennes krönikor blir ännu läsvärdare på avstånd.' },
      { text: 'LÅT HÖGSTA DOMSTOLEN AVGÖRA',
        risk: { chance: 0.5,
          win: { text: 'Högsta domstolen river upp beslutet. Hon får tillbaka sitt pass.', temp: { freedom: 3 }, ind: { demo: 0.2 } },
          lose: { text: 'Domstolen ger staten rätt. Fler fall väntar redan i kön.', temp: { freedom: -3 }, rel: -4 } } },
    ],
  },
  {
    id: 'mgr_r_assimilering', icon: '\u{1F3AD}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'EN KULTUR, ETT FOLK?',
    text: 'Den nya kulturpolitiken har dragit in stödet till invandrarföreningar, minskat modersmålsundervisningen och ålagt skolorna att fira de nationella högtiderna "på traditionellt sätt". En fotbollsklubb i {stad} har förlorat lokalen där den haft läxhjälp i femton år.',
    when: (c) => c.changed('culture') && c.is('culture', 'assimilation', 'mono', 'corecult'),
    choices: [
      { text: 'BACKA ÄNDRINGEN AV KULTURPOLITIKEN', cost: { pp: 15 }, undo: 'culture', temp: { freedom: 2, integration: -1 }, griev: -12, tip: 'Föreningarna får tillbaka sina lokaler.' },
      { text: 'BEHÅLL STÖDET TILL LÄXHJÄLP OCH IDROTT', cost: { money: 200 }, temp: { integration: 2 }, griev: -6, tip: 'Det var ju just det som fungerade.' },
      { text: 'STÅ FAST', temp: { ideopower: 3, unrest: 3 }, rel: -2, ind: { xenophobia: 1 }, griev: 5, tip: 'Läxhjälpen flyttar in i en källare. Barnen följer med.' },
    ],
  },
  {
    id: 'mgr_spridning', icon: '\u{1F5FA}\u{FE0F}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'ALLA VILL BO I TRE STÄDER',
    text: 'Nio av tio nyanlända flyttar inom ett år till de tre största städerna, där bostäderna redan är slut. På landsbygden står hus tomma och fabriker söker folk. Ett förslag ligger på bordet: den som vill ha etableringsstöd ska bo där staten anvisar de första två åren.',
    when: (c) => c.migRate > 0.7 && (c.ind.segreg ?? 40) > 40 && (c.ind.urban ?? 60) > 50,
    choices: [
      { text: 'ANVISA BOSTAD - STÖDET FÖLJER MED', cost: { pp: 15 }, temp: { integration: 3, freedom: -2 }, ind: { segreg: -2 }, tip: 'Hälften stannar där de anvisats. Hälften flyttar ändå.' },
      { text: 'LOCKA MED JOBB OCH BILLIGA HUS PÅ LANDET', cost: { money: 400 }, perm: { integration: 2 }, ind: { segreg: -1 }, tip: 'Morot i stället för piska. Dyrare morot.' },
      { text: 'FRITT VAL AV BOSTADSORT', temp: { freedom: 1, integration: -2 }, ind: { segreg: 1, houseprice: 2 }, tip: 'Alla väljer samma tre städer. Det är också ett val.' },
    ],
  },
  {
    id: 'mgr_integrationsforskning', icon: '\u{1F4D1}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'VAD SOM FAKTISKT FUNGERAR',
    text: 'Integrationsforskarna vid universitetet i {stad} har följt tjugotusen nyanlända i tio år. Slutsatsen är tydlig: tidig språkundervisning, ett jobb inom två år och en bostad utanför de mest utsatta områdena betyder mer än allt annat tillsammans. Rapporten ligger på regeringens bord.',
    when: (c) => c.res('integration') >= 3 && c.st.integration > 0,
    choices: [
      { text: 'BYGG OM HELA MOTTAGANDET EFTER RAPPORTEN', cost: { money: 500, pp: 10 }, perm: { integration: 4 }, griev: -6, tip: 'Tio års forskning, ett års reform, tjugo års effekt.' },
      { text: 'GÖR DET SOM ÄR BILLIGT FÖRST', cost: { money: 150 }, perm: { integration: 2 }, tip: 'Det billiga är ofta det viktiga.' },
      { text: 'TACKA OCH LÄGG DEN I EN LÅDA', temp: { research: 1 }, tip: 'Tio års arbete. En låda.' },
    ],
  },
  {
    id: 'mgr_utredning_kostnad', icon: '\u{1F9EE}', weight: 1, cooldown: 1200, kind: 'migration',
    title: 'VAD KOSTAR INVANDRINGEN?',
    text: 'Finansdepartementets ekonomer har räknat på invandringens effekt på statens budget. Svaret: det beror nästan helt på hur snabbt folk får jobb. Den som arbetar inom två år ger ett överskott över livet, den som står utanför i tio år kostar. Rapporten kan användas av alla sidor i debatten.',
    when: (c) => (c.ind.migrants ?? 0) > 6 && c.day > 150 && c.st.freedom > -30,
    choices: [
      { text: 'PUBLICERA ALLT, MED RÅDATA', temp: { freedom: 2, approval: 1 }, ind: { trustgov: 2 }, tip: 'Båda sidor citerar den. Var sin halva.' },
      { text: 'GÖR JOBBEN TILL HUVUDMÅLET FÖR MOTTAGANDET', cost: { pp: 15 }, perm: { integration: 2, gdp: 1 }, griev: -4, tip: 'Det som mäts blir gjort.' },
      { text: 'HEMLIGSTÄMPLA RAPPORTEN', temp: { freedom: -2 }, mod: 'cover_up', ind: { trustgov: -2 }, tip: 'Den läcker inom en vecka. Med en sämre rubrik.' },
    ],
  },
  {
    id: 'mgr_r_flode_okar', icon: '\u{1F4C8}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'FLER ÄN NÅGONSIN PÅ ETT ÅR',
    text: 'Andelen invånare födda utomlands har ökat mer det senaste året än under flera år tidigare tillsammans. Prognoserna slog fel: kommunerna har för få bostäder, skolorna för få lärare och myndigheterna för få handläggare. Alla väntar på besked från regeringen.',
    when: (c) => c.trend('migrants') > 0.6 && c.st.integration < 10,
    choices: [
      { text: 'EXTRA ANSLAG TILL KOMMUNERNA DIREKT', cost: { money: 600 }, temp: { integration: 2 }, griev: -10, tip: 'Pengarna kommer fram innan bostäderna gör det.' },
      { text: 'SKÄRP REGLERNA TILLS SYSTEMET HINNER IKAPP', cost: { pp: 10 }, law: ['immigration', 'managed'], temp: { integration: 2, gdp: -1 }, griev: -8, tip: 'Ett andrum. Inte en lösning.' },
      { text: 'DET ÄR BRA FÖR EKONOMIN PÅ SIKT', temp: { gdp: 2, integration: -3 }, ind: { xenophobia: 1 }, griev: 8, tip: 'På sikt. Väljarna röstar på kort sikt.' },
    ],
  },

  // ===== REAKTIONER PÅ ÄNDRADE INVANDRINGSLAGAR =====
  {
    id: 'mgr_r_oppnat', icon: '\u{1F6AA}', weight: 2, cooldown: 500, kind: 'migration', react: true,
    title: 'GRÄNSERNA ÖPPNAS',
    text: 'Efter beslutet om {lag} har ansökningarna fördubblats på tre månader. Arbetsgivarna jublar och hjälporganisationerna kallar landet ett föredöme. Kommunerna i {stad} och tre andra städer har redan begärt krismöte: de har bostäder till en tiondel av dem som väntas.',
    when: (c) => c.changed('immigration') && c.is('immigration', 'noborders', 'open', 'humanitarian'),
    choices: [
      { text: 'SKJUT TILL PENGAR SÅ ATT MOTTAGANDET FUNGERAR', cost: { money: 700 }, temp: { integration: 3 }, griev: -8, tip: 'En öppen dörr behöver ett rum innanför.' },
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 15 }, undo: true, temp: { approval: -1 }, rel: -2, griev: -10, tip: 'Dörren stängs igen. De som redan är på väg är på väg.' },
      { text: 'HÅLL KURSEN', temp: { gdp: 2, integration: -3 }, ind: { migrants: 0.3 }, griev: 6, tip: 'Ekonomin gillar det. Bostadskön gör det inte.' },
    ],
  },
  {
    id: 'mgr_r_stangt', icon: '\u{1F512}', weight: 2, cooldown: 500, kind: 'migration', react: true,
    title: 'NÄR GRÄNSEN STÄNGDES',
    text: 'Sedan beslutet om {lag} har ansökningarna nästan upphört. Arbetsgivarna varnar för brist på vårdpersonal och byggarbetare, universiteten tappar doktorander och några församlingar har börjat gömma familjer som fått avslag. Grannländerna anklagar landet för att lämpa över ansvaret.',
    when: (c) => c.changed('immigration') && c.is('immigration', 'closed', 'deportation', 'exitban'),
    choices: [
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 20 }, undo: true, temp: { gdp: 1 }, rel: 5, griev: -15, tip: 'Bristyrkena andas ut. Hälften av väljarna andas in.' },
      { text: 'UNDANTAG FÖR VÅRD, BYGG OCH FORSKNING', cost: { pp: 10 }, temp: { gdp: 2, research: 1 }, griev: -5, tip: 'Stängt, men med en dörr för de som behövs.' },
      { text: 'STÅ FAST', temp: { safety: 2, gdp: -2 }, rel: -5, ind: { xenophobia: 1 }, griev: 6, tip: 'Lugnt vid gränsen. Tomt på sjukhuset.' },
    ],
  },
  {
    id: 'mgr_r_poang', icon: '\u{1F3AF}', weight: 2, cooldown: 500, kind: 'migration', react: true,
    title: 'DE NYA REGLERNA BÖRJAR VERKA',
    text: 'Efter beslutet om {lag} kommer färre, men fler av dem som kommer har ett jobberbjudande eller en utbildning som efterfrågas. Arbetsgivarna är nöjda med de första siffrorna. Kritikerna påpekar att flyktingar utan examen men med stora behov hamnar längst bak i kön.',
    when: (c) => c.changed('immigration') && c.is('immigration', 'points', 'managed', 'restricted'),
    choices: [
      { text: 'HUMANITÄRT UNDANTAG FÖR DE MEST UTSATTA', cost: { pp: 10 }, temp: { hdi: 1, integration: 1 }, rel: 3, griev: -5, tip: 'Systemet får ett hjärta. Och en kö.' },
      { text: 'DIGITAL MATCHNING MOT LEDIGA JOBB', cost: { rp: 20 }, temp: { gdp: 2, integration: 2 }, tip: 'Rätt svetsare till rätt varv på tre veckor.' },
      { text: 'LÅT REGLERNA VERKA', temp: { integration: 2, immigration: -2 }, tip: 'Färre men fler i jobb. Siffrorna talar.' },
    ],
  },
  {
    id: 'mgr_r_gastarbetare', icon: '\u{1F3ED}', weight: 2, cooldown: 500, kind: 'migration', react: true,
    title: 'ARBETSKRAFTEN STRÖMMAR IN',
    text: 'Efter beslutet om {lag} har fabriker och byggen i {stad} fått tusentals nya arbetare på ett halvår. Produktionen ökar och bristen på svetsare är plötsligt borta. Men facket rapporterar om arbetare som bor tolv i en lägenhet och om lönebesked som inte stämmer.',
    when: (c) => c.changed('immigration') && c.is('immigration', 'guestworker', 'freemove', 'relaxed'),
    choices: [
      { text: 'FLER ARBETSMILJÖINSPEKTÖRER', cost: { money: 200 }, perm: { corruption: -1 }, temp: { integration: 1 }, tip: 'Tolv i en lägenhet blir fyra. Hyran blir högre.' },
      { text: 'RÄTT ATT BYTA ARBETSGIVARE FRITT', cost: { pp: 10 }, temp: { freedom: 2, integration: 2, gdp: -1 }, tip: 'Den som kan säga upp sig blir sällan lurad.' },
      { text: 'ARBETSGIVARNA VET BÄST', temp: { gdp: 3, integration: -2 }, ind: { strikes: 20 }, griev: 4, tip: 'Produktionen ökar. Det gör missnöjet också.' },
    ],
  },
  {
    id: 'mgr_r_guldvisum', icon: '\u{1F4B0}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'PASS TILL SALU',
    text: 'Den som investerar tillräckligt kan nu köpa sig uppehållstillstånd eller medborgarskap. Under första kvartalet kom fyrahundra miljonärer, de flesta från {land}. Lägenhetspriserna i {huvudstad} har stigit tio procent, och en av köparna visade sig vara efterlyst för penningtvätt.',
    when: (c) => c.changed('immigration', 'citizenship') && (c.is('immigration', 'goldenvisa') || c.is('citizenship', 'investment')),
    choices: [
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 15 }, undo: true, temp: { income: -3 }, perm: { corruption: -1 }, griev: -8, tip: 'Miljonärerna får behålla sina lägenheter. Inga nya pass.' },
      { text: 'GRANSKA VARJE KÖPARE NOGGRANT', cost: { money: 150 }, perm: { corruption: -1 }, temp: { income: 2 }, tip: 'Hälften drar tillbaka sin ansökan. Det säger något.' },
      { text: 'PENGAR LUKTAR INTE', res: { money: 600 }, perm: { corruption: 3 }, rel: -4, ind: { houseprice: 4 }, tip: 'De gör det. Men först om några år.' },
    ],
  },
  {
    id: 'mgr_r_mur', icon: '\u{1F9F1}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'STÄNGSLET LÄNGS GRÄNSEN',
    text: 'Efter beslutet om {lag} reser sig fyra meter höga stängsel längs gränsen mot {granne}. Bygget kostar mer än planerat och går genom naturreservat och betesmarker. Antalet olagliga gränspassager har halverats, men smugglarna tar nu dubbelt betalt för vägen runt.',
    when: (c) => c.changed('border_control') && c.is('border_control', 'fences', 'wall', 'militarized'),
    choices: [
      { text: 'BYGG FÄRDIGT - KOSTA VAD DET KOSTA VILL', cost: { money: 900 }, temp: { safety: 3, statepower: 2 }, ind: { migrants: -0.2 }, next: ['mgr_mur_smugglare', null], tip: 'Ett stängsel är aldrig färdigt. Det ska underhållas.' },
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 15 }, undo: true, rel: 4, griev: -10, tip: 'Halva stängslet står kvar som ett monument över något.' },
      { text: 'BYGG I DEN TAKT BUDGETEN TILLÅTER', temp: { safety: 1, income: -1 }, next: ['mgr_mur_smugglare', 'mgr_mur_granne'], tip: 'Ett halvt stängsel. Smugglarna tackar.' },
    ],
  },
  {
    id: 'mgr_mur_smugglare', icon: '\u{1F69B}', chain: true, kind: 'migration',
    title: 'SMUGGLARNA HITTAR NYA VÄGAR',
    text: 'Gränspolisen har hittat en tunnel under stängslet och en lastbil med trettio personer gömda bakom lådor med apelsiner. Alla klarade sig, men flera var uttorkade. Smugglarna tar nu fem gånger så mycket betalt som innan stängslet byggdes, och nätverken har blivit mer organiserade.',
    choices: [
      { text: 'SPECIALENHET MOT MÄNNISKOSMUGGLING', cost: { money: 300 }, temp: { safety: 3 }, perm: { corruption: -1 }, tip: 'Smugglarna fruktar utredare mer än stängsel.' },
      { text: 'SÄKRA OCH LAGLIGA VÄGAR FÖR FLYKTINGAR', cost: { pp: 15 }, temp: { hdi: 1, safety: 1 }, rel: 4, ind: { migrants: 0.2 }, tip: 'Den som kan ta flyget betalar ingen smugglare.' },
      { text: 'HÖJ STRAFFEN OCH BYGG HÖGRE', temp: { safety: 1, freedom: -1 }, ind: { crimeidx: 3 }, tip: 'Fem meter. Sedan sex. Smugglarna köper längre stegar.' },
    ],
  },
  {
    id: 'mgr_mur_granne', icon: '\u{1F3F3}\u{FE0F}', chain: true, kind: 'migration',
    title: '{GRANNE} PROTESTERAR',
    text: 'Regeringen i {granne} har kallat hem sin ambassadör. De säger att stängslet skär av byar från sina åkrar, delar familjer och gör deras land till ett väntrum. Handeln över gränsen har minskat med en femtedel, och lastbilschaufförerna står i timslånga köer.',
    choices: [
      { text: 'ÖPPNA FLER GRÄNSÖVERGÅNGAR', cost: { money: 300 }, rel: 6, temp: { gdp: 2 }, tip: 'Stängsel med grindar. Det kallas gräns.' },
      { text: 'GEMENSAM GRÄNSKOMMISSION', cost: { pp: 15 }, rel: 8, temp: { stability: 1 }, tip: 'Två länder, ett bord, många möten.' },
      { text: 'VÅR GRÄNS, VÅRT BESLUT', rel: -8, temp: { ideopower: 2, gdp: -2 }, tip: 'Ambassadören stannar hemma. Handeln också.' },
    ],
  },
  {
    id: 'mgr_r_visumfritt', icon: '\u{2708}\u{FE0F}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'TURISTERNA VÄLLER IN',
    text: 'Sedan beslutet om {lag} har turisterna från {land} fördubblats. Hotellen i {huvudstad} är fullbokade, souvenirbutikerna har slut på magneter och tre nya flyglinjer har öppnat. Polisen rapporterar samtidigt att fler stannar kvar efter att visumtiden gått ut.',
    when: (c) => c.changed('visa_policy') && c.is('visa_policy', 'visafree', 'onarrival', 'evisa'),
    choices: [
      { text: 'SATSA PÅ TURISMEN MED EN KAMPANJ', cost: { money: 200 }, temp: { gdp: 3, income: 2 }, ind: { tourists: 10 }, griev: -3, tip: 'Magneterna tar slut igen.' },
      { text: 'DIGITAL KONTROLL AV IN- OCH UTRESOR', cost: { money: 150 }, temp: { safety: 2, gdp: 1 }, tip: 'Den som stannar för länge får ett mejl. Sedan ett besök.' },
      { text: 'LÅT DET RULLA', temp: { gdp: 2, safety: -1 }, ind: { tourists: 6 }, tip: 'Turister, studenter och en och annan som aldrig åker hem.' },
    ],
  },
  {
    id: 'mgr_r_visum_stangt', icon: '\u{1F6C4}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'KONFERENSERNA FLYTTAR',
    text: 'Efter beslutet om {lag} har tre internationella konferenser flyttats till {granne}, ett forskningssamarbete med {land} lagts ner och hotellen i {huvudstad} har halverat sina bokningar. Utländska forskare skriver att de inte tänker vänta åtta månader på att få besöka ett seminarium.',
    when: (c) => c.changed('visa_policy') && c.is('visa_policy', 'closed', 'guided', 'alliesonly', 'invitation'),
    choices: [
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 15 }, undo: true, temp: { gdp: 2 }, griev: -8, tip: 'Konferenserna kommer tillbaka. Om ett par år.' },
      { text: 'SNABBVISUM FÖR FORSKARE OCH AFFÄRSFOLK', cost: { pp: 10 }, temp: { research: 2, gdp: 1 }, tip: 'Viktiga människor får komma. Andra får titta på bilder.' },
      { text: 'VI KLARAR OSS UTAN DEM', temp: { research: -2, gdp: -2 }, rel: -3, ind: { tourists: -15 }, tip: 'Hotellen i {huvudstad} klarar sig inte.' },
    ],
  },
  {
    id: 'mgr_r_protest_lag', icon: '\u{270A}', weight: 2, cooldown: 600, kind: 'migration', react: true,
    title: 'MARSCHEN MOT BESLUTET',
    text: 'Hundratusen människor har samlats i {huvudstad} i protest mot beslutet om {lag}. Bland dem finns lärare, präster, fotbollssupportrar och pensionärer som aldrig demonstrerat förut. Talarna kräver att beslutet rivs upp - och en motdemonstration på andra sidan floden är nästan lika stor.',
    when: (c) => c.changed('immigration', 'border_control', 'visa_policy', 'citizenship') && c.grievOf('migration') > 20,
    choices: [
      { text: 'RIV UPP BESLUTET OM {LAG}', cost: { pp: 15 }, undo: true, temp: { unrest: -4, approval: 1 }, griev: -20, tip: 'Den ena demonstrationen jublar. Den andra börjar planera nästa.' },
      { text: 'BJUD IN BÅDA SIDOR TILL SAMTAL', cost: { pp: 10 }, temp: { unrest: -3 }, griev: -8, tip: 'Ett långt bord, två sidor och mycket kaffe.' },
      { text: 'BESLUTET STÅR FAST', temp: { unrest: 5, statepower: 2 }, ind: { protests: 30 }, griev: 6, tip: 'Nästa helg kommer dubbelt så många.' },
    ],
  },
  {
    id: 'mgr_r_lugnet', icon: '\u{2600}\u{FE0F}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'INVANDRINGEN ÄR INTE LÄNGRE VALFRÅGAN',
    text: 'För första gången på femton år hamnar invandringen inte bland väljarnas fem viktigaste frågor. Mätningarna visar att de flesta tycker att mottagandet fungerar, och debattprogrammen har börjat prata om tandvård och tågförseningar i stället. Integrationsministern har hunnit ta semester.',
    when: (c) => c.grievOf('migration') < 3 && c.st.integration > 10 && (c.ind.migrants ?? 0) > 5 && c.day > 200,
    choices: [
      { text: 'SATSA DET SOM BLEV ÖVER PÅ SKOLAN', cost: { money: 300 }, perm: { integration: 1, research: 1 }, tip: 'Det som fungerar ska få fortsätta fungera.' },
      { text: 'BEHÅLL TRYCKET - DET ÄR NU MAN BYGGER FRAMTIDEN', cost: { pp: 10 }, perm: { integration: 2 }, tip: 'Det lugna läget är den bästa tiden att reformera.' },
      { text: 'NJUT AV LUGNET', temp: { approval: 2, stability: 1 }, griev: -3, tip: 'Det har du förtjänat.' },
    ],
  },

  // ===== HÅRDA TAG OCH DERAS PRIS =====
  {
    id: 'mgr_utvisning_familj', icon: '\u{1F9D2}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'KLASSKAMRATERNA PROTESTERAR',
    text: 'Sara är tolv år, född i {stad} och bäst i klassen i matematik. Nu ska hon och hennes föräldrar utvisas till {land}, ett land hon aldrig har besökt, eftersom pappans arbetstillstånd löpte ut efter ett fel på en blankett. Hela klassen har gått ut i protest, och namninsamlingen har nått hundratusen namn.',
    when: (c) => c.is('immigration', 'deportation', 'closed', 'restricted', 'managed') && c.st.freedom > -30 && c.day > 60,
    choices: [
      { text: 'BEVILJA FAMILJEN UPPEHÅLLSTILLSTÅND', cost: { pp: 10 }, temp: { approval: 3, freedom: 1 }, griev: -6, tip: 'En familj räddad. Tusen andra fall väntar på samma tidning.' },
      { text: 'BARN SOM VUXIT UPP HÄR FÅR STANNA - I LAG', cost: { pp: 20 }, perm: { integration: 1 }, temp: { approval: 2 }, griev: -10, tip: 'Ett fel på en blankett ska inte avgöra ett barns liv.' },
      { text: 'LAGEN GÄLLER ALLA', temp: { statepower: 2, approval: -3 }, griev: 6, next: ['mgr_kyrkoasyl', 'mgr_utvisning_dom'], tip: 'Konsekvent. Och mycket impopulärt i klass 6B.' },
    ],
  },
  {
    id: 'mgr_kyrkoasyl', icon: '\u{26EA}', chain: true, kind: 'migration',
    title: 'GÖMDA I KYRKAN',
    text: 'Familjen som skulle utvisas har tagit skydd i en kyrka i {stad}. Prästen säger att hon inte tänker öppna dörren för polisen, och varje kväll står hundratals grannar med levande ljus utanför. Polischefen frågar regeringen hur långt han ska gå.',
    choices: [
      { text: 'GE UPP - FAMILJEN FÅR STANNA', cost: { pp: 10 }, temp: { approval: 3, statepower: -2 }, griev: -8, tip: 'Prästen bjuder polisen på kaffe. Det blir en lång fika.' },
      { text: 'HÄMTA DEM I GRYNINGEN',
        risk: { chance: 0.5,
          win: { text: 'Polisen hämtar familjen under tystnad. Landet är upprört, men det lägger sig.', temp: { statepower: 3, approval: -4 } },
          lose: { text: 'Bilderna på barnet i polisbilen går jorden runt. Protesterna sprider sig.', temp: { unrest: 8, approval: -6 }, rel: -6, ind: { protests: 40 } } } },
      { text: 'VÄNTA UT DEM', temp: { statepower: -2, approval: 1 }, next: ['mgr_utvisning_dom', null], tip: 'Kyrkor har lång erfarenhet av att vänta.' },
    ],
  },
  {
    id: 'mgr_utvisning_dom', icon: '\u{2696}\u{FE0F}', chain: true, kind: 'migration',
    title: 'MÄNNISKORÄTTSDOMSTOLEN DÖMER',
    text: 'Den internationella människorättsdomstolen har slagit fast att utvisningen av barn som vuxit upp i landet bryter mot barnets rättigheter. Domen gäller familjen från {stad}, men advokaterna säger att tusentals andra fall nu kan prövas om. Regeringen har sex månader på sig att svara.',
    choices: [
      { text: 'FÖLJ DOMEN OCH ÄNDRA LAGEN', cost: { pp: 20 }, temp: { freedom: 3 }, rel: 8, ind: { demo: 0.1 }, griev: -10, tip: 'En rättsstat lyder sina domstolar. Även de obekväma.' },
      { text: 'FÖLJ DOMEN I DET HÄR FALLET, BARA', cost: { pp: 5 }, rel: 2, temp: { approval: 1 }, tip: 'Tusen nya fall står i kö till samma domstol.' },
      { text: 'STRUNTA I DOMSTOLEN', temp: { statepower: 3, freedom: -3 }, rel: -12, ind: { demo: -0.3 }, tip: 'Andra länder har gjort så. Ingen vill jämföras med dem.' },
    ],
  },
  {
    id: 'mgr_skordar', icon: '\u{1F34E}', weight: 2, cooldown: 800, kind: 'migration',
    title: 'SKÖRDEN RUTTNAR PÅ FÄLTEN',
    text: 'Sedan invandringsreglerna stramades åt har bönderna inte fått tag i säsongsarbetare. Äpplena ligger på marken i fruktodlingarna runt {stad}, grönsakerna plöjs ner och mejeriet saknar en tredjedel av personalen. Bondeförbundet, som röstade för åtstramningen, kräver nu undantag.',
    when: (c) => c.is('immigration', 'closed', 'deportation', 'exitban', 'restricted') && (c.ind.agri ?? 3) > 1 && c.day > 40,
    choices: [
      { text: 'SÄSONGSVISUM FÖR JORDBRUKET', cost: { pp: 10 }, temp: { gdp: 2, factory: 1, immigration: 1 }, griev: -4, tip: 'Stängt för alla utom dem som plockar äpplen.' },
      { text: 'SKICKA VÄRNPLIKTIGA ATT PLOCKA', cost: { man: 6 }, temp: { gdp: 1, approval: -1 }, tip: 'Soldaterna lär sig mycket om äpplen. Armén lär sig ingenting.' },
      { text: 'BÖNDERNA FÅR HÖJA LÖNERNA', temp: { gdp: -2, approval: -1 }, ind: { infl: 0.3 }, tip: 'Äpplena plockas. De kostar som apelsiner.' },
    ],
  },
  {
    id: 'mgr_fn_kritik', icon: '\u{1F310}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'FN KRITISERAR LANDET',
    text: 'FN:s råd för mänskliga rättigheter pekar i en ny rapport ut landet för hur asylsökande behandlas: barn i förvar, utvisningar till länder i krig och gränsvakter som skickar tillbaka folk utan prövning. Tre länder har ställt in ministerbesök, och {land} har begärt en förklaring.',
    when: (c) => (c.is('immigration', 'deportation', 'closed', 'exitban') || c.is('border_control', 'militarized', 'wall')) && c.day > 80,
    choices: [
      { text: 'BJUD IN FN:S GRANSKARE', cost: { pp: 10 }, rel: 6, temp: { freedom: 1 }, griev: -4, tip: 'Den som inte har något att dölja kan öppna dörren.' },
      { text: 'MILDRA REGLERNA FÖR BARNFAMILJER', cost: { pp: 15 }, rel: 5, temp: { approval: 1, integration: 1 }, griev: -6, tip: 'Hårt mot systemet, mjukt mot barnen.' },
      { text: 'KALLA RAPPORTEN POLITISK', temp: { ideopower: 2 }, rel: -8, tip: 'Rapporten är politisk. Det är din politik som står i den.' },
    ],
  },
  {
    id: 'mgr_forvar', icon: '\u{1F3E2}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'BARNEN I FÖRVARET',
    text: 'I förvaret utanför {stad} sitter fyrahundra personer som väntar på att utvisas, sextio av dem barn. Byggnaden är gjord för hälften så många. En sjuksköterska som slutat berättar för pressen om barn som inte sover och vuxna som hungerstrejkar. Förvarschefen ber om fler platser.',
    when: (c) => c.is('immigration', 'deportation', 'closed', 'restricted') && c.st.statepower > -10 && (c.ind.migrants ?? 0) > 2,
    choices: [
      { text: 'INGA BARN I FÖRVAR - ANMÄLNINGSPLIKT I STÄLLET', cost: { pp: 10 }, temp: { freedom: 2, approval: 2 }, rel: 3, griev: -6, tip: 'Familjerna anmäler sig varje måndag. Nästan alla kommer.' },
      { text: 'NYTT FÖRVAR MED SKOLA OCH LEKPLATS', cost: { money: 500 }, temp: { statepower: 2 }, rel: 1, tip: 'Ett bättre förvar. Fortfarande ett förvar.' },
      { text: 'FLER PLATSER, SNABBARE UTVISNINGAR', temp: { statepower: 3, freedom: -3 }, rel: -5, griev: 6, tip: 'Effektivt. Sjuksköterskan skriver en bok.' },
    ],
  },
  {
    id: 'mgr_razzior', icon: '\u{1F37D}\u{FE0F}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'RAZZIAN PÅ RESTAURANGERNA',
    text: 'Polisen har gjort razzior mot tjugo restauranger och byggarbetsplatser i {stad} och gripit åttio personer utan uppehållstillstånd. Flera av dem har bott här i tio år och betalat skatt under lånade identiteter. Arbetsgivarna fick böter. Arbetarna får lämna landet.',
    when: (c) => c.is('immigration', 'deportation', 'closed', 'restricted') || (c.is('policing', 'tough', 'militarized') && c.st.immigration > 0),
    choices: [
      { text: 'HÅRDARE STRAFF FÖR ARBETSGIVARNA, INTE ARBETARNA', cost: { pp: 10 }, perm: { corruption: -1 }, temp: { approval: 2 }, griev: -4, tip: 'Den som tjänar pengarna får betala notan.' },
      { text: 'AMNESTI FÖR DEM SOM ARBETAT OCH BETALT SKATT LÄNGE', cost: { pp: 20 }, temp: { income: 2, integration: 2 }, ind: { migrants: 0.1 }, tip: 'De betalade redan skatt. Nu under sitt eget namn.' },
      { text: 'FORTSÄTT RAZZIORNA I HELA LANDET', temp: { safety: 2, gdp: -1 }, ind: { xenophobia: 1 }, griev: 5, tip: 'Restaurangerna stänger tidigare. Kockarna är borta.' },
    ],
  },
  {
    id: 'mgr_foretag_flyttar', icon: '\u{1F9EA}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'FORSKNINGEN FLYTTAR TILL {LAND}',
    text: 'Landets största läkemedelsbolag flyttar hela sin forskningsavdelning till {land}. Skälet, säger vd:n, är att det tar nio månader att få arbetstillstånd för en kemist från ett annat land och att de bästa sökande inte ens bryr sig om att söka hit längre. Sexhundra jobb försvinner.',
    when: (c) => (c.is('immigration', 'closed', 'restricted', 'deportation', 'exitban') || c.is('visa_policy', 'closed', 'guided', 'alliesonly')) && c.st.research > -5,
    choices: [
      { text: 'SNABBSPÅR FÖR FORSKARE OCH SPECIALISTER', cost: { pp: 15 }, temp: { research: 2, gdp: 1 }, griev: -3, tip: 'Bolaget stannar. Det andra landet får ett kontor i stället.' },
      { text: 'SKATTELÄTTNAD FÖR FORSKNING SOM STANNAR', cost: { money: 500 }, temp: { research: 1, gdp: 1 }, tip: 'Pengar köper tid. Inte kemister.' },
      { text: 'DÅ FÅR DE GÅ', temp: { research: -3, gdp: -2 }, ind: { stockcap: -4 }, tip: 'Sexhundra jobb, och en hel bransch som funderar.' },
    ],
  },
  {
    id: 'mgr_gransolycka', icon: '\u{1F976}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'FAMILJEN VID STÄNGSLET',
    text: 'En gränspatrull hittade i gryningen en familj med tre barn som tillbringat natten i kylan vid stängslet mot {granne}. De var svårt nedkylda men överlevde efter en ambulansfärd till {stad}. Bilden av den femåriga flickan inlindad i gränsvaktens jacka har delats miljontals gånger.',
    when: (c) => c.is('border_control', 'fences', 'wall', 'militarized') && c.day > 60,
    choices: [
      { text: 'HUMANITÄR ÖVERGÅNG VID STÄNGSLET', cost: { pp: 15 }, temp: { hdi: 1, approval: 2 }, rel: 5, griev: -5, tip: 'En grind med en tjänsteman. Ingen behöver sova i snön.' },
      { text: 'FLER RÄDDNINGSPATRULLER LÄNGS GRÄNSEN', cost: { money: 200 }, temp: { safety: 1, approval: 1 }, rel: 2, tip: 'Gränsvakterna får filtar och termosar i bilarna.' },
      { text: 'ANSVARET LIGGER HOS SMUGGLARNA', temp: { statepower: 2, approval: -3 }, rel: -5, next: ['mgr_grans_utredning', null], tip: 'Det stämmer. Bilden på flickan visar något annat.' },
    ],
  },
  {
    id: 'mgr_grans_utredning', icon: '\u{1F4E2}', chain: true, kind: 'migration',
    title: 'GRÄNSVAKTERNA VITTNAR',
    text: 'Tre gränsvakter har berättat anonymt för en tidning att de fått order att skicka tillbaka människor över gränsen utan att ta emot deras asylansökningar. En av dem säger att han inte längre kan sova. Juristerna är eniga: om uppgifterna stämmer är det ett brott mot internationell rätt.',
    choices: [
      { text: 'TILLSÄTT EN OBEROENDE UTREDNING', cost: { pp: 15 }, temp: { freedom: 2 }, rel: 5, ind: { trustgov: 2 }, tip: 'Sanningen kommer fram. Den brukar göra det.' },
      { text: 'SKYDDA VISSELBLÅSARNA', cost: { pp: 5 }, temp: { freedom: 2 }, ind: { pressfree: 2 }, tip: 'Den som säger ifrån ska inte straffas för det.' },
      { text: 'ÅTALA DEM FÖR LÄCKAN', temp: { statepower: 3, freedom: -3 }, rel: -6, ind: { pressfree: -4 }, tip: 'Läckan täpps till. Förtroendet rinner ut.' },
    ],
  },
  {
    id: 'mgr_familjeaterforening', icon: '\u{1F46A}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'PAPPA PÅ ANDRA SIDAN JORDEN',
    text: 'Sedan reglerna skärptes kan den som fått skydd här inte längre ta hit sin familj. En taxichaufför i {stad} har inte sett sina barn på fyra år och pratar med dem i telefon varje kväll. Psykologerna varnar för att oron gör det svårare att lära sig språket och få ett jobb.',
    when: (c) => c.is('immigration', 'restricted', 'closed', 'deportation', 'goldenvisa') && c.st.freedom > -20 && c.day > 60,
    choices: [
      { text: 'ÅTERINFÖR FAMILJEÅTERFÖRENING FÖR BARN', cost: { pp: 15 }, temp: { integration: 3, approval: 1 }, ind: { migrants: 0.1 }, griev: -6, tip: 'Den som har sin familj här har en anledning att lyckas här.' },
      { text: 'FAMILJEN FÅR KOMMA OM MAN HAR JOBB OCH BOSTAD', cost: { pp: 5 }, temp: { integration: 2 }, griev: -3, tip: 'Ett krav som går att uppfylla. För vissa.' },
      { text: 'REGLERNA GÄLLER', temp: { integration: -2, statepower: 1 }, griev: 3, tip: 'Telefonräkningarna blir långa.' },
    ],
  },
  {
    id: 'mgr_angiveri', icon: '\u{1FA7A}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'LÄKARNA VÄGRAR ANGE',
    text: 'En ny instruktion kräver att sjukhus och skolor rapporterar personer som saknar uppehållstillstånd till polisen. Läkarförbundet och lärarfacket vägrar: sjuka människor slutar söka vård och barn hålls hemma från skolan. På sjukhuset i {stad} har de första läkarna sagt upp sig i protest.',
    when: (c) => (c.is('immigration', 'deportation') || c.is('surveillance', 'informant', 'total', 'mass')) && c.st.immigration < 15,
    choices: [
      { text: 'DRA TILLBAKA INSTRUKTIONEN', cost: { pp: 10 }, temp: { welfare: 1, freedom: 2 }, griev: -6, tip: 'Läkare ska bota. Lärare ska undervisa. Polisen kan sköta resten.' },
      { text: 'UNDANTA VÅRD OCH SKOLA', cost: { pp: 5 }, temp: { welfare: 1, freedom: 1, statepower: -1 }, tip: 'En kompromiss som alla förstår.' },
      { text: 'DEN SOM VÄGRAR FÅR SPARKEN', temp: { statepower: 3, welfare: -3, freedom: -3 }, ind: { strikes: 30 }, griev: 5, tip: 'Det finns redan för få läkare. Nu finns det ännu färre.' },
    ],
  },

  // ===== UTVANDRING OCH KUNSKAPSTAPP =====
  {
    id: 'mgr_ungdomen', icon: '\u{1F9F3}', weight: 2, cooldown: 900, kind: 'kris',
    title: 'UNGDOMEN PACKAR VÄSKORNA',
    text: 'Var femte tjugoåring säger i en enkät att de planerar att flytta utomlands inom fem år. Enkelbiljetterna till {granne} och {land} är slutsålda hela augusti. I {stad} har tre av fyra i förra årets avgångsklass redan flyttat, och fotbollsklubben har inte längre något A-lag.',
    when: (c) => c.migRate < 0.1 && ((c.ind.youthunemp ?? 15) > 15 || c.st.qol < -5),
    choices: [
      { text: 'JOBBGARANTI FÖR ALLA UNDER 25', cost: { money: 700 }, temp: { approval: 3 }, ind: { youthunemp: -1 }, griev: -6, tip: 'Ett jobb hemma slår ett osäkert jobb borta. Ibland.' },
      { text: 'BILLIGA BOSTÄDER OCH STARTLÅN FÖR UNGA', cost: { money: 400 }, temp: { qol: 2, approval: 2 }, tip: 'Den som har en egen lägenhet stannar oftare.' },
      { text: 'LÅT DEM PRÖVA VINGARNA - DE KOMMER TILLBAKA', temp: { gdp: -1, research: -1 }, tip: 'En del gör det. Med barn som talar ett annat språk.' },
    ],
  },
  {
    id: 'mgr_lakare_flyr', icon: '\u{1F3E5}', weight: 2, cooldown: 1000, kind: 'valfard',
    title: 'LÄKARNA FLYTTAR TILL {GRANNE}',
    text: 'Sedan sjukhusen i {granne} började erbjuda tre gånger så hög lön har tvåhundra läkare lämnat landet på ett år. På sjukhuset i {stad} finns nu en enda narkosläkare, och operationer ställs in varje vecka. De som är kvar jobbar dubbla pass och funderar på att följa efter.',
    when: (c) => c.migRate < 0.3 && c.st.qol < 5 && (c.ind.gdppc ?? 10000) < 40000,
    choices: [
      { text: 'HÖJ LÄKARLÖNERNA MED HÄLFTEN', cost: { money: 700 }, temp: { welfare: 3 }, next: ['mgr_lakare_tillbaka', null], tip: 'Fortfarande sämre än i grannlandet. Men nära nog.' },
      { text: 'BINDNINGSTID FÖR DEM SOM UTBILDATS GRATIS', cost: { pp: 15 }, temp: { welfare: 1, freedom: -2 }, next: ['mgr_lakare_avdelning', null], tip: 'De stannar fem år. Sedan flyttar de, och berättar varför.' },
      { text: 'REKRYTERA LÄKARE FRÅN {LAND}', cost: { money: 300 }, temp: { welfare: 2, immigration: 2 }, tip: 'Läkarflykten går i en kedja. Nu är {land} sist i kedjan.' },
      { text: 'VI KAN INTE KONKURRERA', temp: { welfare: -3, qol: -2 }, griev: 5, next: ['mgr_lakare_avdelning'], tip: 'Ärligt. Och dyrt på ett annat sätt.' },
    ],
  },
  {
    id: 'mgr_lakare_avdelning', icon: '\u{1F476}', chain: true, kind: 'valfard',
    title: 'FÖRLOSSNINGEN I {STAD} STÄNGER',
    text: 'Förlossningen på sjukhuset i {stad} stänger eftersom det inte finns läkare nog att bemanna den dygnet runt. Den som ska föda barn får nu åka nio mil till närmaste sjukhus. En barnmorska som arbetat där i trettio år har startat ett upprop som fått tvåhundratusen namn.',
    choices: [
      { text: 'NÖDBEMANNA MED INHYRDA LÄKARE', cost: { money: 500 }, temp: { welfare: 2 }, griev: -6, tip: 'Hyrläkare kostar tre gånger mer. Förlossningen öppnar.' },
      { text: 'ÖPPET PÅ DAGTID, AMBULANSFLYG PÅ NATTEN', cost: { money: 250 }, temp: { welfare: 1, safety: 1 }, tip: 'Barn föds helst på natten. Helikoptern får gott om jobb.' },
      { text: 'SAMLA VÅRDEN I STORSTÄDERNA', temp: { welfare: -2, approval: -4 }, ind: { trustgov: -3 }, griev: 6, tip: 'Effektivt på papperet. Nio mil på vintervägar.' },
    ],
  },
  {
    id: 'mgr_lakare_tillbaka', icon: '\u{1F3E1}', chain: true, kind: 'valfard',
    title: 'LÄKARNA KOMMER HEM',
    text: 'Efter lönelyftet har sextio av läkarna som flyttade till {granne} kommit tillbaka. Flera har med sig nya specialistkunskaper, och en hjärtkirurg har startat en ny klinik i {stad}. Väntetiderna har börjat krympa för första gången på flera år.',
    choices: [
      { text: 'ÅTERVÄNDARBIDRAG ÄVEN FÖR ANDRA YRKEN', cost: { money: 300 }, perm: { research: 1, welfare: 1 }, tip: 'Ingenjörer och lärare har också flyttat.' },
      { text: 'MEDALJ OCH MIDDAG FÖR ÅTERVÄNDARNA', cost: { pp: 3 }, temp: { approval: 2, welfare: 1 }, griev: -4, tip: 'Hjärtkirurgen håller tal. Det blir långt.' },
      { text: 'BRA - NU KAN LÖNERNA SÄNKAS IGEN', res: { money: 250 }, temp: { welfare: -2 }, next: ['mgr_lakare_avdelning', null], tip: 'De som kom hem kan flytta igen. De vet vägen nu.' },
    ],
  },
  {
    id: 'mgr_hjarnflykt', icon: '\u{1F393}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'FORSKARNA LÄMNAR LANDET',
    text: 'Tre av landets mest citerade forskare har på en månad tackat ja till tjänster i {land}. De säger att det inte handlar om lönen utan om friheten att forska och publicera vad de vill, och om att deras doktorander redan har flyttat. Universitetet i {stad} förlorar sitt största forskningsanslag.',
    when: (c) => (c.migRate < 0 || c.st.freedom < -20) && c.st.research > 0 && c.day > 100,
    choices: [
      { text: 'GARANTERA DEN AKADEMISKA FRIHETEN I LAG', cost: { pp: 20 }, temp: { research: 2, freedom: 2 }, ind: { pressfree: 2 }, griev: -5, tip: 'Forskare går dit där frågorna är fria.' },
      { text: 'MATCHA LÖNERNA FÖR TOPPFORSKARNA', cost: { money: 600 }, temp: { research: 2 }, tip: 'Två av tre stannar. Den tredje ville faktiskt bara bort.' },
      { text: 'ALLA ÄR ERSÄTTLIGA', temp: { research: -3 }, perm: { research: -1 }, tip: 'Det är de inte. Men det märks först om tio år.' },
    ],
  },
  {
    id: 'mgr_tomma_byar', icon: '\u{1F3DA}\u{FE0F}', weight: 2, cooldown: 1000, kind: 'kris',
    title: 'BYN DÄR BARA DE GAMLA BOR KVAR',
    text: 'I byarna runt {stad} har varannan ung människa flyttat utomlands under det senaste decenniet. Skolan har stängt, bussen går två gånger i veckan och pensionärerna hjälper varandra att skotta snö. Pengarna som barnen skickar hem håller den sista affären vid liv.',
    when: (c) => c.migRate < 0 && (c.ind.urban ?? 60) < 75,
    choices: [
      { text: 'BREDBAND OCH KONTORSHOTELL FÖR DISTANSARBETE', cost: { money: 400 }, temp: { qol: 2, gdp: 1 }, tip: 'Den som kan jobba var som helst kan jobba här.' },
      { text: 'LOCKA INFLYTTARE TILL DE TOMMA HUSEN', cost: { pp: 10 }, temp: { immigration: 2, qol: 1 }, ind: { migrants: 0.1 }, tip: 'Tomma hus för en krona. Byn får nya grannar.' },
      { text: 'HEMTJÄNST OCH BUSS - DET STATEN KAN GE', cost: { money: 150 }, temp: { welfare: 1 }, griev: -3, tip: 'De gamla klarar sig. Byn gör det inte.' },
      { text: 'FOLK FLYTTAR DIT JOBBEN FINNS', temp: { qol: -2, approval: -1 }, tip: 'Sant. Och byn blir ett minne.' },
    ],
  },
  {
    id: 'mgr_r_utreseforbud', icon: '\u{1F6C2}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'UTRESA KRÄVER TILLSTÅND',
    text: 'Sedan rätten att utvandra inskränktes krävs statens tillstånd för att resa ut. Köerna till passkontoren i {huvudstad} är kilometerlånga, flygbolagen ställer in avgångar och familjer med släktingar i {land} vet inte när de ses igen. Utrikesministrarna i tre länder har protesterat.',
    when: (c) => c.changed('emigration') && c.is('emigration', 'exitvisa', 'approved', 'banned'),
    choices: [
      { text: 'BACKA ÄNDRINGEN AV UTRESEREGLERNA', cost: { pp: 20 }, undo: 'emigration', temp: { freedom: 3 }, rel: 5, griev: -15, tip: 'Den som får gå vill oftare stanna.' },
      { text: 'UNDANTAG FÖR STUDIER, ARBETE OCH FAMILJ', cost: { pp: 10 }, temp: { freedom: 1 }, griev: -6, tip: 'Nästan alla har ett skäl som passar.' },
      { text: 'STÅ FAST - VI BEHÖVER VÅRT FOLK HÄR', temp: { statepower: 3, freedom: -2 }, rel: -6, ind: { demo: -0.2 }, next: ['mgr_flykt_over_gransen', null], tip: 'Ett land man inte får lämna är ett land folk vill lämna.' },
    ],
  },
  {
    id: 'mgr_flykt_over_gransen', icon: '\u{26F0}\u{FE0F}', chain: true, kind: 'frihet',
    title: 'FLYKTEN ÖVER BERGEN',
    text: 'Gränspolisen har gripit en grupp på tjugo personer - läkare, ingenjörer och en känd pianist - som försökte ta sig över bergen till {granne} till fots. De har fått sina pass indragna. I {granne} har en hjälporganisation börjat ta emot dem som lyckas, och deras berättelser sprids över hela världen.',
    choices: [
      { text: 'SLÄPP DEM OCH LÄTTA PÅ REGLERNA', cost: { pp: 15 }, undo: 'emigration', temp: { freedom: 3 }, rel: 4, griev: -10, tip: 'Pianisten ger en konsert i {huvudstad}. Den blir utsåld.' },
      { text: 'BEVAKA GRÄNSEN HÅRDARE', cost: { money: 300 }, temp: { statepower: 3, freedom: -3 }, ind: { demo: -0.2 }, next: ['mgr_utresa_sanktioner', null], tip: 'Fler vakter i bergen. Fler berättelser i tidningarna.' },
      { text: 'LÅT DEM SOM VILL GÅ - MEN UTAN NÅGONTING', temp: { freedom: 1, research: -2 }, rel: -2, tip: 'Pianot får stanna. Pianisten går.' },
    ],
  },
  {
    id: 'mgr_utresa_sanktioner', icon: '\u{1F6AB}', chain: true, kind: 'frihet',
    title: 'SANKTIONER MOT UTRESEFÖRBUDET',
    text: 'Tre stora handelspartner har infört sanktioner mot landets ledning som svar på utresereglerna. Ministrarnas konton utomlands har frysts, ett handelsavtal med {land} har pausats och landets idrottare får inte tävla under egen flagga i nästa stora mästerskap.',
    choices: [
      { text: 'HÄV FÖRBUDET OCH FÖRHANDLA', cost: { pp: 20 }, undo: 'emigration', rel: 10, temp: { approval: 2 }, griev: -8, tip: 'Sanktionerna lyfts. Idrottarna får sin flagga tillbaka.' },
      { text: 'MOTSANKTIONER', temp: { ideopower: 3, gdp: -3 }, rel: -8, tip: 'Båda sidor förlorar. Den mindre ekonomin förlorar mest.' },
      { text: 'SÖK NYA VÄNNER SOM INTE BRYR SIG', cost: { pp: 10 }, temp: { gdp: -1, statepower: 2 }, rel: -3, tip: 'Sådana vänner finns. De kräver något tillbaka.' },
    ],
  },
  {
    id: 'mgr_diaspora', icon: '\u{1F4E1}', weight: 2, cooldown: 1000, kind: 'frihet',
    title: 'DIASPORAN MOBILISERAR',
    text: 'Hundratusentals landsmän som flyttat utomlands har bildat en rörelse för förändring hemma. De samlar in pengar, driver en tv-kanal från {land} och arrangerar demonstrationer utanför landets ambassader. Många av dem har fortfarande rösträtt, och de har slutat vara tysta.',
    when: (c) => (c.st.freedom < -15 || c.demo < 4.5) && c.migRate < 0.4 && c.day > 100,
    choices: [
      { text: 'BJUD IN TILL DIALOG OCH LÅT DEM RÖSTA UTOMLANDS', cost: { pp: 15 }, temp: { freedom: 2, approval: 2 }, ind: { turnout: 2 }, griev: -5, tip: 'De vill ha ett land att komma hem till.' },
      { text: 'DUBBELT MEDBORGARSKAP - GÖR DEM TILL EN BRO', cost: { pp: 15 }, law: ['emigration', 'dualcitizen'], temp: { freedom: 2 }, rel: 3, tip: 'En diaspora kan vara ett hot eller en ambassad.' },
      { text: 'KALLA DEM FÖRRÄDARE', temp: { ideopower: 3, freedom: -2 }, rel: -4, ind: { pressfree: -2 }, griev: 4, tip: 'Tv-kanalen får fler tittare än någonsin.' },
    ],
  },
  {
    id: 'mgr_r_utreseskatt', icon: '\u{1F9FE}', weight: 2, cooldown: 600, kind: 'frihet', react: true,
    title: 'NOTAN FÖR UTBILDNINGEN',
    text: 'Den nya utreseregeln innebär att den som lämnar landet inom några år efter examen ska betala tillbaka sin utbildning. En nyutexaminerad läkare från {stad} har fått en räkning på tre årslöner. Studenterna protesterar, men flykten av unga läkare har faktiskt bromsat in.',
    when: (c) => c.changed('emigration') && c.is('emigration', 'exittax', 'bonded'),
    choices: [
      { text: 'BACKA ÄNDRINGEN AV UTRESEREGLERNA', cost: { pp: 10 }, undo: 'emigration', temp: { freedom: 2 }, griev: -10, tip: 'Studenterna jublar. Sjukhusen suckar.' },
      { text: 'AVSKRIV SKULDEN FÖR DEN SOM KOMMER TILLBAKA', cost: { money: 200 }, temp: { welfare: 1, research: 1 }, griev: -4, tip: 'Gå om du vill, men kom hem så är vi kvitt.' },
      { text: 'BEHÅLL REGELN', temp: { welfare: 1, freedom: -1 }, griev: 4, tip: 'Läkarna stannar. Glada är de inte.' },
    ],
  },
  {
    id: 'mgr_dubbelt', icon: '\u{1F517}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'DUBBLA PASS, DUBBLA BAND',
    text: 'Reglerna om dubbelt medborgarskap har gjort att tiotusentals utvandrare ansökt om att få tillbaka sina gamla pass. Flera har börjat investera hemma, och en ingenjör i {land} som flyttade för tjugo år sedan har öppnat ett utvecklingskontor i {stad} med fyrtio anställda.',
    when: (c) => c.is('emigration', 'dualcitizen') && c.migRate < 1 && c.day > 100,
    choices: [
      { text: 'INVESTERINGSFOND FÖR UTLANDSBOR', cost: { money: 300 }, temp: { gdp: 2, research: 1 }, mod: 'foreign_investment', tip: 'Pengarna har hittat hem.' },
      { text: 'RÖSTRÄTT FRÅN UTLANDET', cost: { pp: 10 }, temp: { freedom: 2 }, ind: { turnout: 2 }, tip: 'Valdagen blir en världsomspännande affär.' },
      { text: 'VÄLKOMNA, MEN INGA SÄRSKILDA FÖRMÅNER', temp: { gdp: 1, approval: 1 }, tip: 'Ett pass räcker långt.' },
    ],
  },
  {
    id: 'mgr_aldrande', icon: '\u{1F474}', weight: 2, cooldown: 1200, kind: 'kris',
    title: 'FÖR FÅ SOM ARBETAR',
    text: 'Utvandringen av unga och den låga invandringen gör att det snart går två pensionärer på tre personer i arbetsför ålder. Pensionsfonden varnar för att pengarna tar slut om femton år. Ekonomerna ser tre vägar: arbeta längre, ta hit fler som arbetar, eller sänka pensionerna.',
    when: (c) => c.migRate < 0.15 && (c.ind.old ?? 10) > 16,
    choices: [
      { text: 'ÖPPNA FÖR ARBETSKRAFTSINVANDRING', cost: { pp: 20 }, law: ['immigration', 'points'], temp: { gdp: 2 }, ind: { migrants: 0.2 }, tip: 'Unga arbetare som betalar pensionerna. Och som själva blir gamla.' },
      { text: 'HÖJ PENSIONSÅLDERN', law: ['retirement_age', 'age67'], temp: { approval: -4, income: 2 }, tip: 'Två år till på jobbet. Ingen jublar.' },
      { text: 'BARNBIDRAG OCH FÖRÄLDRALEDIGHET FÖR FLER BARN', cost: { money: 600 }, temp: { approval: 3 }, tip: 'Barnen som föds i år börjar arbeta om tjugo år.' },
    ],
  },
  {
    id: 'mgr_atervandare', icon: '\u{1F3E0}', weight: 2, cooldown: 1200, kind: 'migration',
    title: 'DE SOM FLYTTADE KOMMER HEM',
    text: 'För första gången på tjugo år flyttar fler hem än ut. Ingenjörer från {land}, sjuksköterskor från {granne} och kockar från hela världen kommer tillbaka med nya språk, nya idéer och barn som tycker att mormors mat är konstig. Arbetsförmedlingen har öppnat en egen disk för återvändare.',
    when: (c) => c.st.qol > 15 && c.st.gdp > 5 && c.day > 200,
    choices: [
      { text: 'ÅTERVÄNDARPAKET: HJÄLP MED JOBB, SKOLA OCH BOSTAD', cost: { money: 300 }, temp: { gdp: 2, research: 1, integration: 1 }, tip: 'Det är inte bara de nya som behöver hjälp att komma in.' },
      { text: 'SKATTELÄTTNAD I FEM ÅR FÖR ÅTERVÄNDARE', cost: { pp: 10 }, temp: { gdp: 2, income: -1 }, tip: 'Grannarna som aldrig flyttade undrar var deras rabatt är.' },
      { text: 'NÄMN DET I NATIONALDAGSTALET', temp: { approval: 2 }, griev: -3, tip: 'Det bästa betyget ett land kan få.' },
    ],
  },

  // ===== FLYKTINGVÅGOR =====
  {
    id: 'mgr_flykt_granne', icon: '\u{1F3C3}', weight: 1, cooldown: 1500, kind: 'migration',
    title: 'KRIGET I {GRANNE}',
    text: 'Kriget i {granne} har drivit en miljon människor på flykt. Vid gränsövergången står köerna fem kilometer långa: barnfamiljer med resväskor, pensionärer i rullstol och studenter med datorer i ryggsäcken. Gränsvakterna frågar vad de ska göra med alla som söker skydd.',
    when: (c) => c.day > 150 && c.st.stability > -40 && !c.atWar && (c.st.immigration > 10 || c.migRate > 1),
    choices: [
      { text: 'ÖPPNA GRÄNSEN - TILLFÄLLIGT SKYDD FÖR ALLA', cost: { money: 500 }, rel: 8, temp: { hdi: 2 }, ind: { migrants: 0.6 }, next: ['mgr_flykt_volontarer', 'mgr_flykt_lager'], tip: 'Grannar hjälper grannar. Frågan är för hur länge.' },
      { text: 'TA EMOT EN KVOT - DELA RESTEN MED ANDRA LÄNDER', cost: { pp: 15 }, rel: 4, ind: { migrants: 0.3 }, next: ['mgr_flykt_lager', 'mgr_flykt_freden', null], tip: 'Ett ansvar delat på tio blir möjligt att bära.' },
      { text: 'STÄNG GRÄNSEN', law: ['border_control', 'fences'], temp: { safety: 2 }, rel: -10, next: ['mgr_flykt_bussar', null], tip: 'Kön står kvar. Nu på andra sidan stängslet.' },
    ],
  },
  {
    id: 'mgr_flykt_volontarer', icon: '\u{1F49B}', chain: true, kind: 'migration',
    title: 'HELA LANDET HJÄLPER TILL',
    text: 'Tusentals människor har anmält sig som volontärer. I {stad} har pensionärer öppnat sina gästrum, fotbollsklubbar ordnar träningar för flyktingbarnen och en bilfirma lånar ut tjugo minibussar. Kriget i {granne} är långt ifrån över, men mottagandet har fått ett ansikte.',
    choices: [
      { text: 'STÖD VOLONTÄRERNA MED PENGAR OCH SAMORDNING', cost: { money: 300 }, perm: { integration: 2 }, temp: { approval: 3 }, mod: 'national_unity', tip: 'Ett land som hjälper till blir ett land som håller ihop.' },
      { text: 'LÅT CIVILSAMHÄLLET SKÖTA DET', temp: { integration: 1, approval: 2 }, griev: -4, tip: 'De gör det bra. Tills de blir trötta.' },
      { text: 'STATEN TAR ÖVER - INGA AMATÖRER', cost: { money: 400 }, temp: { statepower: 2, integration: 1, approval: -1 }, tip: 'Proffsigt, och lite kallare.' },
    ],
  },
  {
    id: 'mgr_flykt_lager', icon: '\u{26FA}', chain: true, kind: 'migration',
    title: 'LÄGRET VID GRÄNSEN',
    text: 'Transitlägret utanför {stad} skulle vara tillfälligt. Efter ett halvår bor där tjugotusen människor, med en skola i ett tält och en marknad där det säljs allt från telefonkort till hemlagad mat. Lägrets egna läkare, lärare och ingenjörer har börjat organisera driften själva.',
    choices: [
      { text: 'FLYTTA UT FAMILJERNA TILL KOMMUNERNA', cost: { money: 600 }, temp: { integration: 3 }, ind: { segreg: -1 }, next: ['mgr_flykt_freden', null], tip: 'Ett läger blir tjugo kommuner med nya grannar.' },
      { text: 'GE DEM RÄTT ATT ARBETA DIREKT', cost: { pp: 10 }, temp: { gdp: 2, integration: 3 }, griev: -4, tip: 'Läkarna i lägret får arbeta på sjukhuset bredvid.' },
      { text: 'BEHÅLL LÄGRET TILLS KRIGET ÄR SLUT', temp: { integration: -3, safety: -1 }, next: ['mgr_flykt_freden', null], tip: 'Krig brukar inte ta slut när man vill.' },
    ],
  },
  {
    id: 'mgr_flykt_bussar', icon: '\u{1F68D}', chain: true, kind: 'migration',
    title: '{LAND} SKICKAR BUSSARNA',
    text: 'Regeringen i {land}, dit många flydde först, har börjat köra flyktingar i bussar ända fram till landets gräns och släppa av dem vid stängslet. Tusentals sitter nu fast mellan två gränsposter. Journalister från hela världen filmar, och en präst delar ut vatten genom stängslet.',
    choices: [
      { text: 'ÖPPNA EN HUMANITÄR KORRIDOR', cost: { pp: 10 }, rel: 6, temp: { hdi: 1 }, ind: { migrants: 0.2 }, tip: 'Mellanlandet slutar vara ett väntrum.' },
      { text: 'FÖRHANDLA FRAM ETT AVTAL MED {LAND}', cost: { money: 500 }, rel: 3, temp: { stability: 2 }, griev: -3, tip: 'Pengar mot att de tar hand om flyktingarna. Ingen är stolt.' },
      { text: 'HÅLL GRÄNSEN STÄNGD', temp: { statepower: 2, approval: -2 }, rel: -8, griev: 4, tip: 'Bilderna från ingenmansland visas i hela världen.' },
    ],
  },
  {
    id: 'mgr_flykt_freden', icon: '\u{1F54A}\u{FE0F}', chain: true, kind: 'migration',
    title: 'FRED I {GRANNE}',
    text: 'Ett fredsavtal har undertecknats i {granne}. Hälften av flyktingarna vill åka hem och bygga upp sina städer igen. Resten har hittat jobb och skolor här, och barnen pratar redan landets språk bättre än sina föräldrar. Regeringen i {granne} ber om hjälp med återuppbyggnaden.',
    choices: [
      { text: 'ÅTERVÄNDARPROGRAM OCH BISTÅND TILL ÅTERUPPBYGGNADEN', cost: { money: 600 }, rel: 10, ind: { migrants: -0.3 }, tip: 'De som åker hem tar med sig något härifrån.' },
      { text: 'DE SOM VILL STANNA FÅR STANNA', cost: { pp: 10 }, perm: { integration: 2 }, temp: { gdp: 1 }, griev: -3, tip: 'Tillfälligt blev permanent. Så går det ofta.' },
      { text: 'TILLFÄLLIGT SKYDD BETYDER TILLFÄLLIGT', temp: { integration: -2, safety: 1 }, rel: -2, ind: { migrants: -0.5 }, griev: 4, tip: 'Barnen som pratar landets språk får lära sig ett annat igen.' },
    ],
  },
  {
    id: 'mgr_batolycka', icon: '\u{1F6DF}', weight: 1, cooldown: 1200, kind: 'migration',
    title: 'BÅTEN UTANFÖR KUSTEN',
    text: 'Kustbevakningen har larmats om en överlastad fiskebåt med tvåhundra människor ombord som driver med trasig motor tolv sjömil ut. Vädret blir sämre för varje timme. En hjälporganisations fartyg är på väg men behöver sex timmar. Kustbevakningen kan vara där om en.',
    when: (c) => c.day > 100 && c.st.immigration > -15 && c.migRate > 0.6,
    choices: [
      { text: 'RÄDDA ALLA OCH TA DEM IN I HAMN', cost: { money: 150 }, temp: { hdi: 1, approval: 2 }, rel: 5, tip: 'Ingen ska drunkna utanför vår kust. Det är inte ens en fråga.' },
      { text: 'RÄDDA DEM OCH LÄMNA ÖVER TILL {GRANNE}', cost: { pp: 10 }, temp: { approval: 1 }, rel: -2, tip: 'Räddade, men någon annans ansvar.' },
      { text: 'LÅT HJÄLPORGANISATIONEN TA DET',
        risk: { chance: 0.6,
          win: { text: 'Fartyget hinner fram i tid och alla räddas. Landet slipper ansvaret den här gången.', temp: { approval: -1 } },
          lose: { text: 'Båten tar in vatten. Ett handelsfartyg räddar alla i sista stund, och landet får hård kritik.', temp: { approval: -6 }, rel: -10, ind: { trustgov: -4 } } } },
    ],
  },
  {
    id: 'mgr_kvotflyktingar', icon: '\u{1F3D5}\u{FE0F}', weight: 1, cooldown: 1200, kind: 'migration',
    title: 'FN BER OM HJÄLP',
    text: 'FN:s flyktingorgan ber landet ta emot tretusen kvotflyktingar från ett överfullt läger i {land}: mest kvinnor med barn, sjuka och personer som inte kan återvända. De har väntat i genomsnitt elva år. Kvotflyktingar kan förberedas innan de kommer, och integrationen brukar gå bra.',
    when: (c) => !c.is('un', 'pariah', 'none') && c.st.immigration < 25 && c.migRate < 1.5 && c.st.integration > 0 && c.day > 80,
    choices: [
      { text: 'TA EMOT ALLA TRETUSEN', cost: { money: 400 }, rel: 8, temp: { hdi: 1 }, tip: 'Elva år i ett tält. Nu en lägenhet och en skola.' },
      { text: 'TA EMOT TUSEN', cost: { money: 150 }, rel: 3, temp: { approval: 1 }, tip: 'En tredjedel av det som behövs. Bättre än inget.' },
      { text: 'VI HAR GJORT VÅR DEL', rel: -4, temp: { approval: 1 }, tip: 'Lägret står kvar. Andra länder får frågan.' },
    ],
  },
  {
    id: 'mgr_klimatflykt', icon: '\u{1F3DC}\u{FE0F}', weight: 1, cooldown: 1500, kind: 'migration',
    title: 'NÄR REGNET UTEBLEV I {LAND}',
    text: 'Fjärde året i rad utan regn har gjort hela provinser i {land} obeboeliga. Hundratusentals människor har gett sig av därifrån. De räknas inte som flyktingar enligt konventionen, eftersom ingen förföljer dem - det är jorden som inte längre bär. Frågan är vad landet gör när de knackar på.',
    when: (c) => c.day > 400 && c.st.immigration > -10 && (c.ind.co2 ?? 5) > 3,
    choices: [
      { text: 'NY SKYDDSSTATUS FÖR KLIMATFLYKTINGAR', cost: { pp: 20 }, rel: 6, temp: { hdi: 1 }, ind: { migrants: 0.3 }, tip: 'Först i världen. Inte sist.' },
      { text: 'BISTÅND TILL BEVATTNING OCH TORKTÅLIGA GRÖDOR', cost: { money: 700 }, rel: 8, tip: 'Den som kan bo kvar flyttar inte.' },
      { text: 'KONVENTIONEN ÄR TYDLIG', rel: -4, temp: { statepower: 1 }, tip: 'Juridiskt korrekt. Torkan läser inte konventioner.' },
    ],
  },
  {
    id: 'mgr_asylko', icon: '\u{1F4C2}', weight: 2, cooldown: 900, kind: 'migration',
    title: 'TVÅ ÅR I VÄNTAN PÅ BESKED',
    text: 'Migrationsmyndigheten har tvåhundratusen ärenden i kö, och den genomsnittliga väntetiden är två år. Under tiden får de sökande inte arbeta. En ingenjör från {land} har lärt sig språket helt på egen hand och är volontär i tre föreningar - men har fortfarande inget besked.',
    when: (c) => c.migRate > 1 && c.st.statepower < 20 && c.st.integration < 25,
    choices: [
      { text: 'FÖRDUBBLA ANTALET HANDLÄGGARE', cost: { money: 500 }, temp: { integration: 2, statepower: 1 }, griev: -4, tip: 'Kön krymper. Besked, ja eller nej, kommer snabbare.' },
      { text: 'RÄTT ATT ARBETA UNDER VÄNTETIDEN', cost: { pp: 10 }, temp: { integration: 3, gdp: 1 }, tip: 'Ingenjören har jobb på måndag.' },
      { text: 'SNABBSPÅR FÖR UPPENBART OGRUNDADE ANSÖKNINGAR', cost: { pp: 5 }, temp: { statepower: 2, integration: 1 }, rel: -1, tip: 'Snabbt nej till några, snabbare ja till andra.' },
      { text: 'KÖN FÅR TA SIN TID', temp: { integration: -3 }, griev: 4, tip: 'Två år. Sedan tre.' },
    ],
  },
  {
    id: 'mgr_ensamkommande', icon: '\u{1F466}', weight: 2, cooldown: 1000, kind: 'migration',
    title: 'BARNEN SOM KOM ENSAMMA',
    text: 'Fyratusen barn och tonåringar har kommit utan föräldrar det senaste året. Socialtjänsten i {stad} har för få familjehem, och vissa bor på hotell med en vuxen på tjugo barn. Samtidigt pågår en het debatt om hur man ska avgöra hur gamla de egentligen är.',
    when: (c) => c.migRate > 1 && c.st.welfare > -20 && (c.ind.migrants ?? 0) > 2,
    choices: [
      { text: 'FLER FAMILJEHEM MED UTBILDNING OCH ERSÄTTNING', cost: { money: 400 }, perm: { integration: 2 }, temp: { welfare: 1 }, tip: 'En vuxen som bryr sig är det bästa ett barn kan få.' },
      { text: 'MEDICINSKA ÅLDERSBEDÖMNINGAR', cost: { money: 150 }, temp: { safety: 1, approval: 1, freedom: -1 }, griev: -3, tip: 'Läkarna säger att metoden är osäker. Politikerna säger att den behövs.' },
      { text: 'GODE MÄN OCH SKOLSTART DIREKT', cost: { money: 200 }, temp: { integration: 2 }, tip: 'Skola dag ett. Det bästa skyddet som finns.' },
      { text: 'BOENDEN MED SÅ LITE PERSONAL SOM MÖJLIGT', temp: { integration: -3, welfare: -1 }, griev: 3, tip: 'Billigt i dag. Dyrt om tio år.' },
    ],
  },
];
