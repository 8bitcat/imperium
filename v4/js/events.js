// IMPERIUM V5 — HÄNDELSER.
import { money, people } from './real.js';
//
// En händelse är något som inträffar I ditt land och som du måste svara på.
// Varje händelse har 2–5 val, och varje val har konsekvenser.
//
// Händelser är INTE slumpmässiga strösslade. Varje händelse har ett `when`-villkor
// och dyker bara upp om landet faktiskt befinner sig i den situationen: hög
// korruption ger korruptionshändelser, krig ger krigshändelser, fascism ger
// fascismhändelser, en viss lag ger händelser som hör till den lagen. Flera olika
// händelser kan höra till samma sak — man ser inte samma text varje gång.
//
// VILLKORSOBJEKTET c:
//   c.st.unrest ...   nationsvärden (totaler, −100…100)
//   c.day             speldag
//   c.money/pp/rp/man resurser
//   c.ideo, c.doc     ideologi + doktrin
//   c.harmony         0..1, ideologisk harmoni
//   c.is(cat, ...ids) är någon av lagarna vald?
//   c.law(cat)        vilket alternativ är valt
//   c.atWar, c.wars   krig
//   c.claims, c.puppets, c.allies
//   c.res(branch)     forskningsnivå i en gren
//   c.mod(id)         har landet en viss modifierare
//   c.ind.infl …      V5.6: rikets verkliga statistik (statistics.js, t.ex.
//                     infl, unemp, homicide, gdppc, life, co2). Kan vara tom
//                     innan datat laddats — skriv alltid (c.ind.infl ?? 0).
//
// VALENS EFFEKTER:
//   cost { money, pp, rp, man }   krävs och dras — går inte att välja utan
//   res  { money, pp, rp, man }   ges
//   temp { stat: delta }          tillfällig effekt som klingar av
//   perm { stat: delta }          permanent effekt
//   mod  'modifierare-id'         ger en modifierare
//   unmod 'modifierare-id'        tar bort en modifierare
//   rel  tal                      förändrar relationen till hela omvärlden
//   law  ['kategori', 'alternativ'] byter en lag (inte om ideologin förbjuder den)
//
// V5.6: över 500 nya händelser ligger i events/<tema>.js och läggs till efter
// de ursprungliga. Kontrollera nya med  node tools/check-events.mjs

import { EVENTS as EKONOMI } from './events/ekonomi.js';
import { EVENTS as HALSA } from './events/halsa.js';
import { EVENTS as MILJO } from './events/miljo.js';
import { EVENTS as RATT } from './events/ratt.js';
import { EVENTS as POLITIK } from './events/politik.js';
import { EVENTS as IDEOLOGI } from './events/ideologi.js';
import { EVENTS as NYA_IDEOLOGIER } from './events/nyaideologier.js';
import { EVENTS as MILITAR } from './events/militar.js';
import { EVENTS as VETENSKAP } from './events/vetenskap.js';
import { EVENTS as SAMHALLE } from './events/samhalle.js';
import { EVENTS as OMVARLD } from './events/omvarld.js';

export const BASE_EVENTS = [

  // ================= KORRUPTION & SKANDAL =================
  {
    id: 'guilty_politician', icon: '\u{2696}\u{FE0F}', weight: 3,
    title: 'EN AV VÅRA EGNA',
    text: 'En känd politiker från ditt eget parti har befunnits skyldig till avskyvärda brott. Bevisningen är övertygande och pressen har redan fått tag i den. Vad gör du?',
    when: (c) => c.st.corruption > 5 || c.day > 60,
    choices: [
      { text: 'LÅT HONOM FÅ VAD HAN FÖRTJÄNAR', temp: { stability: -2, approval: 5 }, perm: { corruption: -3 }, tip: 'Rättvisan går före partiet.' },
      { text: 'MÖRKLÄGG DET', temp: { stability: 2 }, mod: 'cover_up', tip: 'Problemet försvinner. Priset kommer senare.' },
      { text: 'OFFRA HONOM OFFENTLIGT OCH HÖGLJUTT', cost: { pp: 15 }, temp: { approval: 12, statepower: 6 }, mod: 'scandal', tip: 'Skandalen blir din uppvisning i handlingskraft.' },
    ],
  },
  {
    id: 'bribe_offer', icon: '\u{1F4B0}', weight: 2,
    title: 'ETT KUVERT PÅ SKRIVBORDET',
    text: 'Ett utländskt bolag erbjuder en mycket stor summa för att få ett kontrakt utan upphandling. Ingen skulle behöva få veta.',
    when: (c) => c.st.corruption > 10,
    choices: [
      { text: 'TA PENGARNA', res: { money: 1200 }, perm: { corruption: 8 }, tip: 'Kassan fylls. Något är sålt.' },
      { text: 'AVVISA OCH ANMÄL', perm: { corruption: -6, approval: 4 }, temp: { income: -4 }, tip: 'Rent samvete, tomma fickor.' },
      { text: 'TA PENGARNA — OCH GE KONTRAKTET TILL NÅGON ANNAN', res: { money: 1200 }, perm: { corruption: 12 }, rel: -8, tip: 'Girigt, och de kommer att minnas det.' },
    ],
  },
  {
    id: 'auditor_killed', icon: '\u{1F576}\u{FE0F}', weight: 2,
    title: 'REVISORN HITTADES DÖD',
    text: 'Den statliga revisor som granskade försvarsupphandlingarna har hittats död. Polisen kallar det en olycka. Ingen tror på det.',
    when: (c) => c.st.corruption > 30,
    choices: [
      { text: 'OBEROENDE UTREDNING', cost: { pp: 25 }, perm: { corruption: -10, approval: 6 }, temp: { stability: -5 }, tip: 'Sanningen kommer fram. Den gör ont.' },
      { text: 'DET VAR EN OLYCKA. PUNKT.', temp: { unrest: 10, freedom: -8 }, mod: 'cover_up', tip: 'Alla vet. Ingen säger något.' },
      { text: 'ANKLAGA ETT FRÄMMANDE LAND', cost: { pp: 20 }, temp: { unrest: -5, ideopower: 8 }, rel: -12, tip: 'Riktar ilskan utåt i stället.' },
    ],
  },
  {
    id: 'ghost_payroll', icon: '\u{1F47B}', weight: 2,
    title: 'SPÖKANSTÄLLDA',
    text: 'Granskningen visar att en tiondel av statens löner går till personer som inte finns.',
    when: (c) => c.st.corruption > 25,
    choices: [
      { text: 'DIGITALISERA HELA LÖNESYSTEMET', cost: { money: 800, rp: 40 }, perm: { corruption: -14, income: 8 }, tip: 'Dyrt en gång, tätt för alltid.' },
      { text: 'RENSA LISTORNA UTAN ATT SÄGA VARFÖR', cost: { pp: 20 }, perm: { corruption: -6 }, temp: { unrest: 5 }, tip: 'Halva effekten, inga rubriker.' },
      { text: 'GÖR INGENTING — DE RÖSTAR PÅ OSS', perm: { corruption: 6, approval: 3 }, tip: 'Spökena är lojala.' },
    ],
  },
  {
    id: 'nepotism', icon: '\u{1F46A}', weight: 2,
    title: 'SLÄKTEN FÖRST',
    text: 'Din närmaste krets har fyllt förvaltningen med sina egna barn och kusiner. Kompetensen är därefter.',
    when: (c) => c.st.corruption > 20 || c.is('party_loyalty', 'maximum', 'onlyrep'),
    choices: [
      { text: 'INFÖR MERITKRAV UTAN UNDANTAG', cost: { pp: 30 }, perm: { corruption: -10, research: 6, gdp: 5 }, temp: { stability: -6 }, tip: 'Du gör dig ovän med din egen krets.' },
      { text: 'LÅT DET VARA — LOJALITET ÄR OCKSÅ EN MERIT', perm: { corruption: 6, statepower: 6, research: -5 }, tip: 'Trygg, dum förvaltning.' },
    ],
  },
  {
    id: 'leaked_accounts', icon: '\u{1F4C1}', weight: 2,
    title: 'KONTONA HAR LÄCKT',
    text: 'En journalist har fått tag på hela regeringens interna bokföring och publicerar den i delar, varje dag.',
    when: (c) => c.st.corruption > 30 && c.st.freedom > -30,
    choices: [
      { text: 'ERKÄNN ALLT OCH LOVA BÄTTRING', temp: { approval: -8 }, perm: { corruption: -12, freedom: 4 }, tip: 'Kortsiktigt smärtsamt, långsiktigt renande.' },
      { text: 'STÄNG NER TIDNINGEN', cost: { pp: 25 }, temp: { unrest: 12, freedom: -12, statepower: 8 }, tip: 'Läckan tystnar. Det gör inte ryktet.' },
      { text: 'KÖP TIDNINGEN', cost: { money: 1500 }, temp: { freedom: -6, statepower: 6 }, mod: 'cover_up', tip: 'Nu är den din.' },
    ],
  },

  // ================= ORO, PROTESTER, UPPROR =================
  {
    id: 'mass_protest', icon: '\u{1F4E2}', weight: 3,
    title: 'HUNDRATUSENDEN PÅ GATAN',
    text: 'Den största demonstrationen i landets historia fyller huvudstaden. De kräver att du lyssnar.',
    when: (c) => c.st.unrest > 25,
    choices: [
      { text: 'GÅ UT OCH TALA MED DEM', cost: { pp: 15 }, temp: { unrest: -12, approval: 10, statepower: -5 }, tip: 'Modigt. Det avväpnar dem.' },
      { text: 'SKINGRA MED VÅLD', cost: { pp: 20 }, temp: { unrest: -18, freedom: -12, approval: -12 }, tip: 'Gatan töms. Ilskan gör det inte.' },
      { text: 'IGNORERA DEM HELT', temp: { unrest: 8, approval: -6 }, tip: 'De går hem. De kommer tillbaka.' },
      { text: 'GE EFTER FÖR ETT AV KRAVEN', cost: { money: 500 }, temp: { unrest: -15, approval: 8, ideopower: -6 }, tip: 'Köper lugn, kostar auktoritet.' },
    ],
  },
  {
    id: 'strike_wave', icon: '\u{270A}', weight: 3,
    title: 'STREJKVÅG I INDUSTRIN',
    text: 'Fackföreningarna har lagt ner arbetet i tre nyckelbranscher samtidigt. Produktionen står still.',
    when: (c) => c.st.unrest > 20 && (c.st.qol < 10 || c.is('workhours', 'extended', 'maximum')),
    choices: [
      { text: 'FÖRHANDLA OCH HÖJ LÖNERNA', cost: { money: 900 }, temp: { unrest: -15, approval: 10, income: -8 }, tip: 'Dyrt. Fungerar.' },
      { text: 'FÖRBJUD STREJKEN', cost: { pp: 30 }, temp: { factory: 10, freedom: -15, unrest: 12 }, tip: 'Hjulen snurrar igen. Under protest.' },
      { text: 'LÅT DEM STREJKA UT', mod: 'general_strike', tip: 'Gratis nu. Mycket dyrt sedan.' },
      { text: 'ERSÄTT DEM MED MILITÄR PERSONAL', cost: { pp: 25, man: 10 }, temp: { factory: 6, unrest: 8, milpower: -6 }, tip: 'Halvmesyr som irriterar alla.' },
    ],
  },
  {
    id: 'student_uprising', icon: '\u{1F393}', weight: 2,
    title: 'STUDENTERNA HAR OCKUPERAT UNIVERSITETEN',
    text: 'Landets studenter har tagit över lärosätena och vägrar lämna förrän du avgår.',
    when: (c) => c.st.unrest > 25 && c.st.freedom < 10,
    choices: [
      { text: 'STORMA CAMPUS', cost: { pp: 25 }, temp: { unrest: -10, freedom: -15, research: -10 }, mod: 'martyr', tip: 'Det slutar aldrig bra.' },
      { text: 'MÖT DERAS LEDARE', cost: { pp: 20 }, temp: { unrest: -14, freedom: 8, approval: 6 }, tip: 'Erkänner dem som motpart.' },
      { text: 'STÄNG UNIVERSITETEN PÅ OBESTÄMD TID', temp: { unrest: -8, research: -18, hdi: -8 }, tip: 'Problemet upphör att existera. Så gör utbildningen.' },
    ],
  },
  {
    id: 'separatists', icon: '\u{1F5FA}\u{FE0F}', weight: 2,
    title: 'EN REGION VILL BRYTA SIG LOSS',
    text: 'En provins har utlyst en egen folkomröstning om självständighet. Centralmakten har förklarat den olaglig.',
    when: (c) => c.st.stability < 0 && c.st.unrest > 20,
    choices: [
      { text: 'SKICKA IN ARMÉN', cost: { pp: 35 }, temp: { stability: 10, unrest: 18, freedom: -12, approval: -10 }, tip: 'Håller ihop landet med våld.' },
      { text: 'GE DEM SJÄLVSTYRE', cost: { pp: 25 }, temp: { unrest: -15, stability: -8, statepower: -10, approval: 8 }, tip: 'Lugn nu, svagare stat sedan.' },
      { text: 'LÅT DEM RÖSTA — OCH VINN OMRÖSTNINGEN', cost: { money: 1000, pp: 20 }, temp: { unrest: -10, approval: 12, freedom: 8 }, tip: 'Riskabelt. Legitimt om det går vägen.' },
    ],
  },
  {
    id: 'riot_night', icon: '\u{1F525}', weight: 3,
    title: 'TREDJE NATTEN AV KRAVALLER',
    text: 'Förorterna brinner för tredje natten i rad. Polisen har tappat kontrollen över flera stadsdelar.',
    when: (c) => c.st.unrest > 35,
    choices: [
      { text: 'UTEGÅNGSFÖRBUD', cost: { pp: 20 }, temp: { unrest: -14, freedom: -12, safety: 8 }, tip: 'Effektivt och impopulärt.' },
      { text: 'AKUTPAKET TILL DE DRABBADE OMRÅDENA', cost: { money: 1000 }, temp: { unrest: -12, qol: 8, approval: 8 }, tip: 'Adresserar orsaken, inte symptomet.' },
      { text: 'SÄTT IN MILITÄREN', cost: { pp: 30 }, temp: { unrest: -20, freedom: -18, approval: -12 }, mod: 'martyr', tip: 'Det tar slut i natt. Det får följder i åratal.' },
    ],
  },
  {
    id: 'coup_rumor', icon: '\u{1F5E1}\u{FE0F}', weight: 2,
    title: 'RYKTEN OM EN KUPP',
    text: 'Underrättelsetjänsten rapporterar att delar av officerskåren planerar att avsätta dig.',
    when: (c) => c.st.stability < -10 && c.st.milpower > 10,
    choices: [
      { text: 'ARRESTERA HELA GENERALSTABEN', cost: { pp: 40 }, temp: { milpower: -18, statepower: 15, readiness: -12 }, mod: 'purge_aftermath', tip: 'Du överlever. Armén blir aldrig densamma.' },
      { text: 'KÖP DEM MED BEFORDRINGAR OCH BUDGET', cost: { money: 1500 }, temp: { milpower: 10, corruption: 10, stability: 8 }, tip: 'Lojalitet till salu, som allt annat.' },
      { text: 'LÅTSAS INTE VETA — OCH VÄNTA', temp: { stability: -10 }, tip: 'Kanske är det inget. Kanske är det allt.' },
      { text: 'GÅ UT OFFENTLIGT MED HOTET', cost: { pp: 25 }, temp: { approval: 12, unrest: 8, milpower: -8 }, mod: 'national_unity', tip: 'Folket samlas bakom dig mot generalerna.' },
    ],
  },
  {
    id: 'hunger_marches', icon: '\u{1F35E}', weight: 2,
    title: 'HUNGERMARSCHER',
    text: 'Folk går till fots mot huvudstaden för att de inte har råd med mat. Bilderna sprids överallt.',
    when: (c) => c.st.qol < -15 || c.st.welfare < -20,
    choices: [
      { text: 'PRISTAK PÅ BASVAROR', cost: { money: 800 }, temp: { qol: 12, approval: 10, income: -10, factory: -6 }, tip: 'Fyller magar, tömmer kassan.' },
      { text: 'DELA UT MAT UR MILITÄRENS FÖRRÅD', cost: { man: 15 }, temp: { qol: 8, approval: 8, readiness: -10 }, tip: 'Snabbt. Armén betalar.' },
      { text: 'STOPPA MARSCHEN VID STADSGRÄNSEN', cost: { pp: 20 }, temp: { unrest: 14, approval: -12, freedom: -10 }, tip: 'De syns inte längre.' },
    ],
  },
  {
    id: 'terror_attack', icon: '\u{1F4A5}', weight: 2,
    title: 'ATTENTAT I HUVUDSTADEN',
    text: 'En bomb har detonerat mitt i rusningstrafiken. Många döda. Landet är i chock.',
    when: (c) => c.st.safety < 10 || c.st.unrest > 25,
    choices: [
      { text: 'TERRORLAGSTIFTNING OCH ÖVERVAKNING', cost: { pp: 30 }, perm: { safety: 10, freedom: -12 }, temp: { approval: 8 }, tip: 'Folket vill ha det nu. De ångrar sig senare.' },
      { text: 'SORGEHÖGTID OCH ENIGHET', cost: { pp: 10 }, mod: 'national_unity', tip: 'Landet håller ihop.' },
      { text: 'SLÅ TILLBAKA MOT DEM SOM STÖDDE DÅDET', cost: { pp: 25, money: 600 }, temp: { milpower: 8, safety: 6 }, rel: -15, tip: 'Utåtriktad vrede. Omvärlden ogillar.' },
    ],
  },

  // ================= EKONOMI =================
  {
    id: 'oil_discovery', icon: '\u{1F6E2}\u{FE0F}', weight: 2,
    title: 'STOR FYND UNDER MARKEN',
    text: 'Geologerna har hittat en fyndighet som kan förändra landets ekonomi. Frågan är vem som ska äga den.',
    when: (c) => c.day > 100,
    choices: [
      { text: 'STATLIGT BOLAG TAR HAND OM DET', cost: { money: 900 }, perm: { income: 15, statepower: 8, gdp: 6 }, tip: 'Långsam start, all vinst blir din.' },
      { text: 'SÄLJ KONCESSIONEN TILL UTLÄNDSKA BOLAG', res: { money: 2000 }, perm: { income: 6, gdp: 8, statepower: -6 }, tip: 'Pengar direkt, mindre på sikt.' },
      { text: 'DELA UT ANDELAR TILL MEDBORGARNA', cost: { money: 500 }, perm: { approval: 12, qol: 8, income: 5 }, tip: 'Folket blir delägare i landet.' },
      { text: 'LÅT DEN LIGGA — MILJÖN GÅR FÖRE', perm: { qol: 8, hdi: 5, income: -3 }, tip: 'Principfast. Dyrt.' },
    ],
  },
  {
    id: 'market_crash', icon: '\u{1F4C9}', weight: 3,
    title: 'BÖRSEN HAR RASAT',
    text: 'En finanskris har utraderat en tredjedel av landets börsvärde på tre dagar. Bankerna vacklar.',
    when: (c) => c.day > 120 && c.st.gdp > -20,
    choices: [
      { text: 'RÄDDA BANKERNA', cost: { money: 2000 }, temp: { gdp: 10, income: -8, approval: -12, corruption: 8 }, tip: 'Systemet överlever. Folket ser vem du räddade.' },
      { text: 'LÅT DEM FALLA', temp: { gdp: -20, factory: -12, unrest: 10, approval: 6 }, mod: 'capital_flight', tip: 'Rättvist. Brutalt.' },
      { text: 'FÖRSTATLIGA DE KRASCHADE BANKERNA', cost: { pp: 40 }, perm: { statepower: 12, income: 8, gdp: -6 }, temp: { unrest: 6 }, tip: 'Staten blir bankägare.' },
      { text: 'STIMULANSPAKET TILL HUSHÅLLEN', cost: { money: 1500 }, temp: { gdp: 8, qol: 10, approval: 14, income: -10 }, tip: 'Pengarna går nedåt i stället för uppåt.' },
    ],
  },
  {
    id: 'trade_boom', icon: '\u{1F4E6}', weight: 2,
    title: 'EXPORTEN SLÅR REKORD',
    text: 'Landets varor är plötsligt eftertraktade över hela världen. Hamnarna går för fullt.',
    when: (c) => c.st.factory > 10 && c.st.income > 0,
    choices: [
      { text: 'INVESTERA VINSTEN I INDUSTRIN', cost: { money: 600 }, mod: 'industrial_boom', tip: 'Bygger varaktig kapacitet.' },
      { text: 'LÄGG VINSTEN I STATSKASSAN', res: { money: 1800 }, tip: 'Pengar nu.' },
      { text: 'SÄNK SKATTEN FÖR ALLA', temp: { approval: 15, gdp: 10, income: -12 }, tip: 'Populärt.' },
    ],
  },
  {
    id: 'inflation', icon: '\u{1F4B5}', weight: 2,
    title: 'PRISERNA SKENAR',
    text: 'Inflationen har nått nivåer där folk handlar mat samma dag de får lön.',
    when: (c) => c.st.income < 0 && c.st.gdp < 10,
    choices: [
      { text: 'HÖJ RÄNTAN KRAFTIGT', cost: { pp: 20 }, temp: { gdp: -12, factory: -8, income: 12, approval: -8 }, tip: 'Bromsar. Gör ont.' },
      { text: 'PRISKONTROLLER', cost: { pp: 25 }, temp: { qol: 8, approval: 10, factory: -12, gdp: -10 }, tip: 'Populärt och ekonomiskt destruktivt.' },
      { text: 'TRYCK MER PENGAR', res: { money: 1200 }, temp: { gdp: -15, approval: -10, unrest: 8 }, tip: 'Löser dagens problem genom att förvärra morgondagens.' },
    ],
  },
  {
    id: 'infrastructure_choice', icon: '\u{1F309}', weight: 2,
    title: 'ETT STORT BYGGPROJEKT',
    text: 'Ingenjörerna lägger fram ett förslag som skulle förändra landets infrastruktur i grunden. Det kostar därefter.',
    when: (c) => c.money > 1200,
    choices: [
      { text: 'BYGG DET — HELA VÄGEN', cost: { money: 2200 }, perm: { factory: 12, income: 10, gdp: 8, qol: 6 }, tip: 'Största möjliga effekt, största möjliga nota.' },
      { text: 'BYGG EN BILLIGARE VERSION', cost: { money: 900 }, perm: { factory: 6, income: 4 }, tip: 'Halva effekten till en tredjedel av priset.' },
      { text: 'SKJUT UPP DET', tip: 'Gratis. Ingenting händer.' },
    ],
  },
  {
    id: 'tax_evasion_ring', icon: '\u{1F3DD}\u{FE0F}', weight: 2,
    title: 'DE RIKA BETALAR INTE',
    text: 'En läcka visar att landets förmögnaste systematiskt gömmer sina tillgångar utomlands.',
    when: (c) => c.is('taxes', 't30', 't40', 't60') || c.st.corruption > 15,
    choices: [
      { text: 'JAGA DEM MED ALLA MEDEL', cost: { pp: 30 }, perm: { income: 12, corruption: -8 }, temp: { gdp: -8, approval: 12 }, tip: 'Pengarna kommer hem. Så gör inte kapitalet.' },
      { text: 'AMNESTI MOT ATT DE TAR HEM PENGARNA', res: { money: 1600 }, perm: { corruption: 8, approval: -8 }, tip: 'Stor engångssumma. Signalen är förödande.' },
      { text: 'GÖR INGENTING', perm: { corruption: 5, income: -4, approval: -6 }, tip: 'Alla ser att du inte gör något.' },
    ],
  },
  {
    id: 'automation_wave', icon: '\u{1F916}', weight: 2,
    title: 'MASKINERNA TAR JOBBEN',
    text: 'Automatiseringen har nått industrin på allvar. Produktiviteten stiger — och arbetslösheten med den.',
    when: (c) => c.st.research > 15 || c.res('economy') >= 3,
    choices: [
      { text: 'OMSKOLNINGSPROGRAM I STOR SKALA', cost: { money: 1200 }, perm: { factory: 10, research: 8, hdi: 6 }, tip: 'Dyrt, men landet följer med.' },
      { text: 'BESKATTA MASKINERNA', cost: { pp: 25 }, perm: { income: 10, factory: -6, approval: 8 }, tip: 'Bromsar omställningen och finansierar den.' },
      { text: 'LÅT MARKNADEN LÖSA DET', perm: { factory: 14, gdp: 8, qol: -8, unrest: 8 }, tip: 'Effektivt. Hårt.' },
    ],
  },
  {
    id: 'sovereign_default', icon: '\u{1F3E6}', weight: 2,
    title: 'LÅNGIVARNA KRÄVER BETALT',
    text: 'Statsskulden förfaller och kassan räcker inte. Långivarna vill ha besked idag.',
    when: (c) => c.st.income < -20 || c.money < 200,
    choices: [
      { text: 'BETALA — KOSTA VAD DET KOSTA VILL', cost: { money: 1500 }, temp: { welfare: -12, qol: -8, approval: -10 }, perm: { income: 6 }, tip: 'Förtroendet består.' },
      { text: 'STÄLL IN BETALNINGARNA', temp: { income: 15, gdp: -20, statepower: 8 }, mod: 'capital_flight', rel: -18, tip: 'Ni behåller pengarna. Ingen lånar ut igen.' },
      { text: 'OMFÖRHANDLA MED LÅNGIVARNA', cost: { pp: 35 }, temp: { income: 6, gdp: -6, statepower: -8 }, tip: 'Villkoren blir sämre men ni står kvar.' },
    ],
  },

  // ================= KRIG & MILITÄR =================
  {
    id: 'war_atrocity', icon: '\u{1F480}', weight: 3,
    title: 'VÅRA SOLDATER HAR GJORT NÅGOT FRUKTANSVÄRT',
    text: 'En enhet har begått en massaker mot civila i det ockuperade området. Bilderna finns.',
    when: (c) => c.atWar,
    choices: [
      { text: 'STÄLL DEM INFÖR KRIGSRÄTT', cost: { pp: 20 }, temp: { milpower: -8, readiness: -6, approval: 8 }, perm: { freedom: 4 }, rel: 10, tip: 'Rätt. Armén hatar dig för det.' },
      { text: 'FÖRNEKA ALLT', temp: { stability: 4 }, mod: 'cover_up', rel: -10, tip: 'Ingen tror dig.' },
      { text: 'FÖRSVARA DEM OFFENTLIGT', cost: { pp: 15 }, temp: { milpower: 10, readiness: 8, approval: -12, freedom: -8 }, rel: -20, tip: 'Armén älskar dig. Världen inte.' },
    ],
  },
  {
    id: 'war_volunteers', icon: '\u{1FA96}', weight: 2,
    title: 'FRIVILLIGA KÖAR UTANFÖR KASERNERNA',
    text: 'Kriget har väckt något i befolkningen. Fler vill ta värvning än ni kan utbilda.',
    when: (c) => c.atWar && c.st.approval > -10,
    choices: [
      { text: 'TA EMOT ALLA', cost: { money: 800 }, res: { man: 40 }, mod: 'war_fever', tip: 'Armén sväller.' },
      { text: 'TA BARA DE BÄSTA', res: { man: 15 }, temp: { milpower: 10, readiness: 10 }, tip: 'Färre men bättre.' },
      { text: 'SKICKA HEM DEM — DETTA ÄR YRKESMILITÄRENS KRIG', temp: { approval: -8, readiness: 6 }, tip: 'Kallt. Professionellt.' },
    ],
  },
  {
    id: 'peace_offer', icon: '\u{1F54A}\u{FE0F}', weight: 3,
    title: 'FIENDEN ERBJUDER FRED',
    text: 'Motståndaren har skickat ett fredsbud genom en tredje part. Villkoren är rimliga men inte generösa.',
    when: (c) => c.atWar && c.day > 60,
    choices: [
      { text: 'ACCEPTERA FREDEN', cost: { pp: 20 }, temp: { unrest: -12, approval: 10, milpower: -6 }, rel: 20, tip: 'Kriget tar slut.' },
      { text: 'AVVISA — VI VINNER DETTA', cost: { pp: 15 }, temp: { readiness: 8, milpower: 6, approval: -6 }, mod: 'war_fever', tip: 'Allt eller inget.' },
      { text: 'KRÄV MER OCH FÖRHANDLA VIDARE', cost: { pp: 30 }, temp: { statepower: 8, unrest: 5 }, tip: 'Riskabelt. De kan dra tillbaka budet.' },
    ],
  },
  {
    id: 'draft_dodging', icon: '\u{1F6AA}', weight: 2,
    title: 'DE UNGA FLYR VÄRNPLIKTEN',
    text: 'Tusentals unga har lämnat landet eller gömt sig för att slippa inkallelsen.',
    when: (c) => c.is('military_service', 'high', 'mandatory'),
    choices: [
      { text: 'HÅRDA STRAFF FÖR DESERTÖRER', cost: { pp: 25 }, temp: { manpower: 12, freedom: -12, unrest: 10, approval: -10 }, tip: 'Fyller leden med olyckliga soldater.' },
      { text: 'INFÖR CIVILPLIKT SOM ALTERNATIV', cost: { pp: 20 }, temp: { manpower: -6, approval: 10, qol: 6, unrest: -8 }, tip: 'Färre soldater, lugnare land.' },
      { text: 'AMNESTI FÖR ALLA SOM ÅTERVÄNDER', temp: { manpower: 6, approval: 8, milpower: -5 }, tip: 'Många kommer tillbaka.' },
    ],
  },
  {
    id: 'weapons_offer', icon: '\u{1F4A3}', weight: 2,
    title: 'EN VAPENAFFÄR',
    text: 'En stormakt erbjuder modern materiel till kraftigt rabatterat pris. Det finns villkor i det finstilta.',
    when: (c) => c.day > 90,
    choices: [
      { text: 'KÖP — VI BEHÖVER DEM', cost: { money: 1400 }, perm: { milpower: 15, readiness: 10, statepower: -8 }, tip: 'Stark armé, bunden utrikespolitik.' },
      { text: 'TACKA NEJ OCH BYGG SJÄLVA', cost: { rp: 60 }, perm: { milpower: 8, factory: 8, research: 5 }, tip: 'Långsammare, men det blir ditt.' },
      { text: 'KÖP OCH BRYT VILLKOREN SEDAN', cost: { money: 1400 }, perm: { milpower: 15, readiness: 10 }, rel: -25, tip: 'Fräckt. De glömmer inte.' },
    ],
  },
  {
    id: 'general_demands', icon: '\u{1F396}\u{FE0F}', weight: 2,
    title: 'GENERALERNA VILL HA MER',
    text: 'Försvarsledningen kräver en kraftigt utökad budget och hotar med kollektiv avgång.',
    when: (c) => c.st.milpower > 0 && c.day > 80,
    choices: [
      { text: 'GE DEM VAD DE BEGÄR', cost: { money: 1500 }, perm: { milpower: 14, readiness: 10, income: -8 }, tip: 'Lojala generaler är inte gratis.' },
      { text: 'AVSLÅ OCH BYT UT LEDNINGEN', cost: { pp: 35 }, temp: { milpower: -12, readiness: -10, statepower: 10 }, tip: 'Du visar vem som bestämmer.' },
      { text: 'GE DEM HÄLFTEN', cost: { money: 700 }, perm: { milpower: 6, readiness: 4 }, temp: { stability: -4 }, tip: 'Ingen blir nöjd. Alla stannar.' },
    ],
  },
  {
    id: 'nuclear_test', icon: '\u{2622}\u{FE0F}', weight: 2,
    title: 'FÖRSTA PROVSPRÄNGNINGEN',
    text: 'Forskarna är redo att demonstrera vad landet nu kan. Världen kommer att se det.',
    when: (c) => c.res('nuclear') >= 2,
    choices: [
      { text: 'SPRÄNG — LÅT VÄRLDEN SE', cost: { money: 800 }, perm: { milpower: 15, statepower: 12, ideopower: 8 }, rel: -25, tip: 'Ingen ignorerar dig igen.' },
      { text: 'TESTA I HEMLIGHET', cost: { money: 1200, rp: 40 }, perm: { milpower: 12, statepower: 6 }, rel: -5, tip: 'Dyrare, tystare.' },
      { text: 'AVBRYT PROGRAMMET', res: { money: 600 }, perm: { milpower: -6 }, rel: 20, tip: 'Världen andas ut.' },
    ],
  },
  {
    id: 'veterans_forgotten', icon: '\u{1F396}\u{FE0F}', weight: 2,
    title: 'VETERANERNA HAR GLÖMTS BORT',
    text: 'De som stred åt dig lever i fattigdom. Journalister har börjat skriva om det.',
    when: (c) => c.day > 150 && (c.wars > 0 || c.claims > 1),
    choices: [
      { text: 'VETERANPROGRAM MED PENSION OCH VÅRD', cost: { money: 1000 }, perm: { approval: 10, welfare: 6, manpower: 6 }, tip: 'Rätt sak. Kostar.' },
      { text: 'SYMBOLISKA MEDALJER', cost: { money: 100 }, temp: { approval: 4, ideopower: 4 }, tip: 'Billigt. Genomskådas.' },
      { text: 'IGNORERA', temp: { approval: -8, manpower: -6, unrest: 5 }, tip: 'Nästa generation noterar det.' },
    ],
  },

  // ================= IDEOLOGISPECIFIKT =================
  {
    id: 'purge_demand', icon: '\u{1FA93}', weight: 3,
    title: 'PARTIET KRÄVER EN UTRENSNING',
    text: 'De hårdaste inom rörelsen menar att staten är full av förrädare och kräver att du agerar.',
    when: (c) => ['fascism', 'natsoc', 'communism'].includes(c.ideo),
    choices: [
      { text: 'GENOMFÖR UTRENSNINGEN', cost: { pp: 40 }, mod: 'purge_aftermath', tip: 'Total lojalitet. Tömd kompetens.' },
      { text: 'EN SYMBOLISK UTRENSNING PÅ TOPPEN', cost: { pp: 20 }, temp: { statepower: 8, ideopower: 6, research: -4 }, tip: 'Räcker för att blidka dem.' },
      { text: 'VÄGRA — VI BEHÖVER DE DUGLIGA', cost: { pp: 25 }, temp: { ideopower: -12, research: 8, stability: -8 }, tip: 'Rörelsen börjar tvivla på dig.' },
    ],
  },
  {
    id: 'cult_offer', icon: '\u{1F5FF}', weight: 2,
    title: 'DE VILL RESA STATYER AV DIG',
    text: 'Partiapparaten föreslår att ditt porträtt ska hänga i varje offentlig lokal och att din födelsedag blir helgdag.',
    when: (c) => ['fascism', 'natsoc', 'communism', 'imperialism'].includes(c.ideo) && c.st.ideopower > 20,
    choices: [
      { text: 'LÅT DEM GÖRA DET', cost: { money: 900, pp: 30 }, mod: 'cult_of_personality', tip: 'Odödlighet i utbyte mot allt annat.' },
      { text: 'AVBÖJ MED ÖDMJUKHET', temp: { approval: 10, ideopower: -6 }, tip: 'Folket uppskattar det. Partiet inte.' },
    ],
  },
  {
    id: 'democratic_test', icon: '\u{1F5F3}\u{FE0F}', weight: 3,
    title: 'DU HÅLLER PÅ ATT FÖRLORA VALET',
    text: 'Opinionsmätningarna visar att oppositionen leder. Valet är om några veckor.',
    when: (c) => ['democracy', 'liberalism', 'socialdemocracy'].includes(c.ideo) && c.st.approval < 5,
    choices: [
      { text: 'ACCEPTERA UTFALLET, VAD DET ÄN BLIR', perm: { freedom: 8, approval: 10, corruption: -6 }, temp: { polpower: -15 }, tip: 'Demokrati kostar makt.' },
      { text: 'GENERÖSA VALLÖFTEN', cost: { money: 1500 }, temp: { approval: 18, income: -12 }, tip: 'Köp rösterna lagligt.' },
      { text: 'JUSTERA VALKRETSARNA', cost: { pp: 35 }, temp: { polpower: 15, freedom: -12, corruption: 10, approval: -8 }, tip: 'Fortfarande val. Knappast fria.' },
      { text: 'SKJUT UPP VALET', cost: { pp: 50 }, temp: { polpower: 20, freedom: -20, unrest: 15, approval: -15 }, tip: 'Nu är du inte längre det du kallar dig.' },
    ],
  },
  {
    id: 'red_purity', icon: '\u{262D}', weight: 2,
    title: 'REVISIONISM I LEDNINGEN',
    text: 'En falang i partiet vill öppna för marknadsreformer. De kallar det nödvändigt. Andra kallar det förräderi.',
    when: (c) => c.ideo === 'communism' || c.ideo === 'socialism',
    choices: [
      { text: 'TILLÅT REFORMERNA', cost: { pp: 30 }, perm: { gdp: 12, income: 10, ideopower: -12 }, tip: 'Ekonomin lyfter. Läran urholkas.' },
      { text: 'KROSSA FALANGEN', cost: { pp: 35 }, perm: { ideopower: 12, statepower: 10, gdp: -8, research: -6 }, tip: 'Renlärigt och fattigt.' },
      { text: 'LÅT DEM DEBATTERA ÖPPET', cost: { pp: 15 }, temp: { freedom: 8, stability: -8, ideopower: -6 }, tip: 'Ovanligt för en enpartistat.' },
    ],
  },
  {
    id: 'clergy_demands', icon: '\u{26EA}', weight: 2,
    title: 'PRÄSTERSKAPET STÄLLER KRAV',
    text: 'De religiösa ledarna kräver större inflytande över lagstiftning och skola.',
    when: (c) => c.ideo === 'theocracy' || c.is('religion', 'statereligion'),
    choices: [
      { text: 'GE DEM VETO ÖVER LAGSTIFTNINGEN', cost: { pp: 25 }, perm: { ideopower: 15, stability: 10, freedom: -12, research: -10 }, tip: 'Trosgemenskapen blir orubblig.' },
      { text: 'GE DEM SKOLAN', cost: { pp: 20 }, perm: { ideopower: 10, integration: 8, research: -8 }, tip: 'Nästa generation blir deras.' },
      { text: 'AVSLÅ ALLT', cost: { pp: 30 }, temp: { ideopower: -12, unrest: 12, stability: -8 }, tip: 'De vänder sig mot dig.' },
    ],
  },
  {
    id: 'monarch_marriage', icon: '\u{1F451}', weight: 2,
    title: 'ETT DYNASTISKT GIFTERMÅL',
    text: 'Ett äktenskap med en utländsk kungafamilj föreslås. Det skulle knyta banden — och binda händerna.',
    when: (c) => c.ideo === 'monarchism',
    choices: [
      { text: 'ARRANGERA GIFTERMÅLET', cost: { money: 1200 }, perm: { stability: 10, income: 8 }, rel: 20, tip: 'Familjen växer, alliansen med den.' },
      { text: 'LÅT DEM GIFTA SIG AV KÄRLEK', temp: { approval: 15, stability: -5 }, tip: 'Folket älskar det. Diplomaterna inte.' },
      { text: 'AVBÖJ — VI BINDER OSS INTE', temp: { statepower: 6 }, rel: -10, tip: 'Fria händer.' },
    ],
  },
  {
    id: 'anarchist_dilemma', icon: '\u{24B6}', weight: 2,
    title: 'NÅGON HAR BÖRJAT BESTÄMMA',
    text: 'En federation av kommuner har utsett en samordnare med verklig makt. Många kallar det förräderi mot rörelsen.',
    when: (c) => c.ideo === 'anarchism',
    choices: [
      { text: 'UPPLÖS SAMORDNINGEN', cost: { pp: 20 }, perm: { freedom: 10, ideopower: 8, stability: -10, income: -6 }, tip: 'Renlärigt kaos.' },
      { text: 'ACCEPTERA DEN SOM PRAKTISK NÖDVÄNDIGHET', cost: { pp: 15 }, perm: { stability: 12, income: 8, freedom: -8, ideopower: -10 }, tip: 'Det fungerar. Det är inte längre anarki.' },
    ],
  },
  {
    id: 'nationalist_diaspora', icon: '\u{1F6A9}', weight: 2,
    title: 'VÅRA LANDSMÄN I GRANNLANDET',
    text: 'En folkgrupp som talar ditt språk sägs vara förtryckt på andra sidan gränsen. Rörelsen kräver att du agerar.',
    when: (c) => ['nationalism', 'fascism', 'natsoc', 'imperialism'].includes(c.ideo),
    choices: [
      { text: 'KRÄV ATT DE FÅR SJÄLVSTYRE', cost: { pp: 25 }, temp: { ideopower: 12, justtime: -10 }, rel: -18, tip: 'Ett steg mot något större.' },
      { text: 'STÖD DEM I HEMLIGHET', cost: { money: 800 }, temp: { ideopower: 8, justtime: -8, corruption: 6 }, rel: -8, tip: 'Ingen kan bevisa något.' },
      { text: 'LÅT DET VARA', temp: { ideopower: -10, approval: -6 }, tip: 'Rörelsen ser dig som svag.' },
    ],
  },
  {
    id: 'populist_promise', icon: '\u{1F4E3}', weight: 2,
    title: 'DU LOVADE NÅGOT OMÖJLIGT',
    text: 'Ett av dina största vallöften visar sig kosta tre gånger mer än du sa. Nu vill folk se det infriat.',
    when: (c) => c.ideo === 'populism',
    choices: [
      { text: 'INFRIA DET — KOSTA VAD DET KOSTA VILL', cost: { money: 2000 }, temp: { approval: 20, income: -15 }, tip: 'Trovärdigheten är värd pengar.' },
      { text: 'SKYLL PÅ ETABLISSEMANGET', cost: { pp: 15 }, temp: { approval: 8, corruption: 6, stability: -6 }, tip: 'Fungerar en gång till.' },
      { text: 'ERKÄNN ATT DET INTE GÅR', temp: { approval: -18, freedom: 5, stability: 6 }, tip: 'Ovanligt ärligt. Dyrt i opinionen.' },
    ],
  },
  {
    id: 'liberal_paradox', icon: '\u{1F54A}\u{FE0F}', weight: 2,
    title: 'DE ANVÄNDER FRIHETEN MOT FRIHETEN',
    text: 'En rörelse som öppet vill avskaffa demokratin växer snabbt — helt lagligt.',
    when: (c) => ['liberalism', 'democracy', 'socialdemocracy'].includes(c.ideo) && c.st.freedom > 10,
    choices: [
      { text: 'FÖRBJUD DEM', cost: { pp: 30 }, temp: { stability: 10, freedom: -15, ideopower: -8 }, tip: 'Du räddar systemet genom att bryta mot det.' },
      { text: 'MÖT DEM I DEBATTEN', cost: { pp: 20 }, temp: { freedom: 8, approval: 6, stability: -6 }, tip: 'Principfast. Riskabelt.' },
      { text: 'ADRESSERA DET SOM DRIVER DEM', cost: { money: 1200 }, temp: { qol: 10, unrest: -12, approval: 10, income: -8 }, tip: 'Dyrast. Verkar bäst.' },
    ],
  },
  {
    id: 'conservative_change', icon: '\u{1F3F0}', weight: 2,
    title: 'TIDEN SPRINGER IFRÅN OSS',
    text: 'En ung generation kräver förändringar som går rakt emot allt partiet står för.',
    when: (c) => c.ideo === 'conservatism',
    choices: [
      { text: 'ANPASSA PARTIET', cost: { pp: 25 }, perm: { approval: 10, research: 6, freedom: 6, ideopower: -8 }, tip: 'Överlever genom att förändras.' },
      { text: 'STÅ FAST', perm: { ideopower: 10, stability: 8, approval: -8, research: -5 }, tip: 'Det du bevarar är värt att bevara.' },
      { text: 'DELA PARTIET I TVÅ', cost: { pp: 40 }, temp: { polpower: -15, stability: -12, freedom: 8 }, tip: 'Båda linjerna får leva. Ingen vinner.' },
    ],
  },
  {
    id: 'imperial_burden', icon: '\u{1F451}', weight: 2,
    title: 'IMPERIET KOSTAR MER ÄN DET GER',
    text: 'Räkenskaperna visar att de erövrade områdena kostar mer att hålla än de betalar tillbaka.',
    when: (c) => c.claims >= 3,
    choices: [
      { text: 'HÅRDARE BESKATTNING AV PROVINSERNA', cost: { pp: 25 }, perm: { income: 12 }, temp: { unrest: 12, integration: -8 }, tip: 'Pengar in, motstånd upp.' },
      { text: 'INVESTERA I PROVINSERNA', cost: { money: 1500 }, perm: { integration: 12, income: 6, qol: 5 }, tip: 'Dyrt nu, lönsamt sedan.' },
      { text: 'GE ETT OMRÅDE SJÄLVSTYRE', cost: { pp: 20 }, temp: { income: -6, unrest: -12, approval: 8, statepower: -8 }, tip: 'Mindre imperium, mindre problem.' },
    ],
  },

  // ================= LAGSTYRDA HÄNDELSER =================
  {
    id: 'deportation_backlash', icon: '\u{1F6C2}', weight: 3,
    title: 'BILDERNA FRÅN DEPORTATIONERNA',
    text: 'Foton från utvisningarna har spridits över hela världen. Omvärldens reaktion är omedelbar.',
    when: (c) => c.is('immigration', 'deportation'),
    choices: [
      { text: 'FORTSÄTT — VI SVARAR INTE INFÖR NÅGON', cost: { pp: 20 }, temp: { ideopower: 12, statepower: 10 }, rel: -25, tip: 'Linjen håller. Isoleringen ökar.' },
      { text: 'PAUSA OCH LÅT INSPEKTÖRER KOMMA', cost: { pp: 25 }, temp: { freedom: 8, ideopower: -10, income: 8 }, rel: 15, tip: 'Trycket lättar.' },
      { text: 'SKYLL PÅ ENSKILDA TJÄNSTEMÄN', cost: { pp: 15 }, temp: { stability: 4, corruption: 6 }, rel: -8, tip: 'Några får ta smällen.' },
    ],
  },
  {
    id: 'propaganda_slip', icon: '\u{1F4FA}', weight: 2,
    title: 'SÄNDNINGEN GICK FEL',
    text: 'En statlig nyhetsuppläsare sa fel i direktsändning och avslöjade något som inte skulle sägas.',
    when: (c) => c.is('press', 'highstate', 'propaganda'),
    choices: [
      { text: 'ARRESTERA HELA REDAKTIONEN', cost: { pp: 20 }, temp: { statepower: 8, freedom: -10, unrest: 6 }, tip: 'Ingen säger fel igen.' },
      { text: 'SÄND EN RÄTTELSE SOM OM INGET HÄNT', temp: { ideopower: -6, corruption: 4 }, tip: 'De flesta glömmer.' },
      { text: 'LÅT DET STÅ — GÖR DET TILL VÅR SANNING', cost: { pp: 25 }, temp: { ideopower: 10, freedom: -8 }, tip: 'Om vi sa det, då är det sant.' },
    ],
  },
  {
    id: 'death_penalty_error', icon: '\u{1F480}', weight: 2,
    title: 'VI AVRÄTTADE FEL MAN',
    text: 'Nya bevis visar att en person som avrättades förra året var oskyldig.',
    when: (c) => !c.is('death_penalty', 'notinuse'),
    choices: [
      { text: 'AVSKAFFA DÖDSSTRAFFET', cost: { pp: 35 }, perm: { freedom: 10, approval: 8, safety: -5 }, law: ['death_penalty', 'notinuse'], tip: 'Lagen ändras här och nu.' },
      { text: 'BE OM URSÄKT OCH BETALA FAMILJEN', cost: { money: 600 }, temp: { approval: 6, freedom: 4 }, tip: 'Erkänner felet utan att ändra systemet.' },
      { text: 'BESTRID DE NYA BEVISEN', cost: { pp: 20 }, temp: { statepower: 6, approval: -10, freedom: -6 }, mod: 'cover_up', tip: 'Systemet får inte ha fel.' },
    ],
  },
  {
    id: 'free_healthcare_bill', icon: '\u{1FA7A}', weight: 2,
    title: 'VÅRDNOTAN HAR EXPLODERAT',
    text: 'Den fria vården kostar dubbelt så mycket som beräknat. Finansdepartementet är blekt.',
    when: (c) => c.is('healthcare', 'fullyfree', 'free'),
    choices: [
      { text: 'BEHÅLL DEN — SKÄR NÅGON ANNANSTANS', cost: { pp: 20 }, temp: { approval: 10, milpower: -8, factory: -6 }, tip: 'Vården är helig.' },
      { text: 'INFÖR PATIENTAVGIFTER', cost: { pp: 25 }, temp: { income: 12, approval: -12, qol: -6 }, tip: 'Kassan räddas. Löftet bryts.' },
      { text: 'EFFEKTIVISERA MED TEKNIK', cost: { money: 900, rp: 50 }, perm: { income: 8, qol: 5 }, tip: 'Dyrt en gång. Håller.' },
    ],
  },
  {
    id: 'no_welfare_crisis', icon: '\u{1F573}\u{FE0F}', weight: 2,
    title: 'DE HEMLÖSA HAR BLIVIT ETT PROBLEM',
    text: 'Tältläger har vuxit fram i varje storstad. Turisterna fotograferar dem.',
    when: (c) => c.is('welfare', 'none', 'little', 'independent'),
    choices: [
      { text: 'BYGG NÖDBOSTÄDER', cost: { money: 1000 }, temp: { qol: 10, approval: 8, welfare: 8, income: -8 }, tip: 'Löser det synliga problemet.' },
      { text: 'RIV LÄGREN', cost: { pp: 20 }, temp: { unrest: 14, approval: -10, safety: -6 }, tip: 'De flyttar. De försvinner inte.' },
      { text: 'LÅT VÄLGÖRENHETEN TA HAND OM DET', temp: { welfare: 4, approval: -4, qol: -4 }, tip: 'Gratis. Otillräckligt.' },
    ],
  },
  {
    id: 'mono_culture_purge', icon: '\u{1F3FA}', weight: 2,
    title: 'VAD RÄKNAS SOM VÅR KULTUR?',
    text: 'Kulturrådet har lagt fram en lista över vad som är nationellt och vad som ska bort ur det offentliga rummet.',
    when: (c) => c.is('culture', 'mono'),
    choices: [
      { text: 'GODKÄNN LISTAN I SIN HELHET', cost: { pp: 25 }, perm: { ideopower: 14, integration: 10, freedom: -12, research: -6 }, tip: 'Enhetlighet, med tvång.' },
      { text: 'GODKÄNN EN MILDARE VERSION', cost: { pp: 15 }, perm: { ideopower: 6, integration: 5, freedom: -5 }, tip: 'Halva vägen.' },
      { text: 'AVVISA LISTAN', cost: { pp: 20 }, temp: { ideopower: -10, freedom: 8, stability: -5 }, tip: 'Rörelsen blir förvirrad.' },
    ],
  },
  {
    id: 'max_workhours_deaths', icon: '\u{23F1}\u{FE0F}', weight: 2,
    title: 'DE DÖR PÅ ARBETSPLATSERNA',
    text: 'Antalet dödsfall kopplade till utmattning har tredubblats sedan arbetstidsreformen.',
    when: (c) => c.is('workhours', 'extended', 'maximum'),
    choices: [
      { text: 'INFÖR VILOTIDSREGLER', cost: { pp: 25 }, temp: { factory: -8, qol: 12, approval: 10, unrest: -10 }, tip: 'Produktionen tappar. Folk lever.' },
      { text: 'FÖRBJUD STATISTIKEN', cost: { pp: 20 }, temp: { freedom: -12, corruption: 8, unrest: 8 }, mod: 'cover_up', tip: 'Problemet upphör att mätas.' },
      { text: 'INGENTING — DE ÄR UTBYTBARA', temp: { factory: 6, qol: -10, unrest: 12, approval: -12 }, tip: 'Ärligt, åtminstone.' },
    ],
  },
  {
    id: 'atheism_backlash', icon: '\u{26EA}', weight: 2,
    title: 'DE TROENDE MÖTS I HEMLIGHET',
    text: 'Trots förbudet samlas församlingar i källare och skogar. Antalet växer.',
    when: (c) => c.is('religion', 'atheism'),
    choices: [
      { text: 'SLÅ TILL MOT SAMLINGARNA', cost: { pp: 25 }, temp: { ideopower: 8, freedom: -12, unrest: 14 }, mod: 'martyr', tip: 'Förföljelse skapar övertygelse.' },
      { text: 'TILLÅT PRIVAT UTÖVNING', cost: { pp: 15 }, temp: { freedom: 10, unrest: -12, approval: 8, ideopower: -6 }, tip: 'Trycket släpper.' },
      { text: 'INFILTRERA OCH ÖVERVAKA', cost: { money: 700 }, temp: { safety: 6, freedom: -8, statepower: 8 }, tip: 'Du vet allt. De vet att du vet.' },
    ],
  },
  {
    id: 'open_borders_town', icon: '\u{1F3D8}\u{FE0F}', weight: 2,
    title: 'EN STAD HAR FÖRÄNDRATS HELT',
    text: 'I en medelstor stad är nu majoriteten nyanlända. Både gamla och nya invånare är oroliga.',
    when: (c) => c.is('immigration', 'noborders', 'open'),
    choices: [
      { text: 'STORT INTEGRATIONSPROGRAM', cost: { money: 1200 }, perm: { integration: 14, qol: 6, unrest: -8 }, tip: 'Det enda som faktiskt fungerar.' },
      { text: 'SPRID UT NYANLÄNDA ÖVER LANDET', cost: { pp: 25 }, temp: { integration: 8, unrest: 6, freedom: -6 }, tip: 'Problemet fördelas.' },
      { text: 'STOPPA INFLÖDET TILL DEN STADEN', cost: { pp: 20 }, temp: { integration: 5, immigration: -8, freedom: -8 }, tip: 'Lokal lösning, nationell signal.' },
      { text: 'GÖR INGENTING', temp: { integration: -10, unrest: 10, safety: -6 }, tip: 'Det löser sig. Eller inte.' },
    ],
  },
  {
    id: 'high_tax_flight', icon: '\u{1F6EB}', weight: 2,
    title: 'DE RIKA LÄMNAR LANDET',
    text: 'Efter skattehöjningen har ett tjugotal av landets största företag flyttat sitt säte utomlands.',
    when: (c) => c.is('taxes', 't40', 't60'),
    choices: [
      { text: 'INFÖR UTFLYTTNINGSSKATT', cost: { pp: 30 }, temp: { income: 10, gdp: -10, freedom: -8 }, tip: 'Låser in kapitalet.' },
      { text: 'SÄNK SKATTEN IGEN', cost: { pp: 20 }, temp: { income: -12, gdp: 12, approval: -6 }, tip: 'Erkänner att det gick för långt.' },
      { text: 'FÖRSTATLIGA DE SOM FLYTTAR', cost: { pp: 40 }, temp: { statepower: 15, factory: 8, gdp: -15 }, mod: 'capital_flight', rel: -20, tip: 'Radikalt. Konsekvenserna är det också.' },
    ],
  },
  {
    id: 'no_elections_pressure', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'DE KRÄVER ATT FÅ RÖSTA',
    text: 'En växande rörelse kräver att val återinförs. Den har stöd även inom statsapparaten.',
    when: (c) => c.is('elections', 'no', 'unfair'),
    choices: [
      { text: 'UTLYS ETT KONTROLLERAT VAL', cost: { pp: 35 }, temp: { freedom: 10, approval: 12, unrest: -12, statepower: -10 }, law: ['elections', 'hybrid'], tip: 'Ventilen öppnas en aning.' },
      { text: 'KROSSA RÖRELSEN', cost: { pp: 30 }, temp: { statepower: 12, freedom: -15, unrest: 15 }, mod: 'martyr', tip: 'Den försvinner inte, den går under jorden.' },
      { text: 'LOVA VAL — SEN', cost: { pp: 10 }, temp: { unrest: -8, approval: 5, corruption: 5 }, tip: 'Köper tid. En gång.' },
    ],
  },
  {
    id: 'school_authority_result', icon: '\u{1F393}', weight: 2,
    title: 'FÖRSTA ÅRSKULLEN ÄR FÄRDIG',
    text: 'Den första generationen som gått hela vägen genom den nya skolan träder ut i samhället.',
    when: (c) => c.is('education', 'authority', 'verystrict') && c.day > 200,
    choices: [
      { text: 'REKRYTERA DEM TILL STATSAPPARATEN', cost: { pp: 25 }, perm: { statepower: 12, ideopower: 12, polpower: 8, research: -5 }, tip: 'En lojal generation tjänstemän.' },
      { text: 'SKICKA DEM TILL INDUSTRIN', perm: { factory: 12, research: 8, gdp: 6 }, tip: 'Kunniga och disciplinerade arbetare.' },
      { text: 'DE ÄR VÅR ARMÉ', perm: { milpower: 12, manpower: 12, readiness: 8 }, tip: 'Uppfostrade för detta.' },
    ],
  },

  // ================= FORSKNING & TEKNIK =================
  {
    id: 'breakthrough_lab', icon: '\u{1F52C}', weight: 2,
    title: 'ETT OVÄNTAT GENOMBROTT',
    text: 'Ett litet forskarlag har snubblat över något som kan bli mycket stort. De behöver resurser nu.',
    when: (c) => c.st.research > 0,
    choices: [
      { text: 'FULL FINANSIERING', cost: { money: 1200, rp: 50 }, mod: 'tech_breakthrough', tip: 'Satsa allt.' },
      { text: 'MÅTTLIGT STÖD', cost: { money: 400 }, perm: { research: 5 }, tip: 'Försiktigt.' },
      { text: 'SÄLJ UPPTÄCKTEN UTOMLANDS', res: { money: 1800 }, perm: { research: -5 }, rel: 10, tip: 'Pengar nu. Någon annan får glädjen.' },
      { text: 'KLASSA DEN SOM MILITÄR HEMLIGHET', cost: { pp: 25 }, perm: { milpower: 10, research: 4, freedom: -6 }, tip: 'Ingen annan får den.' },
    ],
  },
  {
    id: 'ai_regulation', icon: '\u{1F916}', weight: 2,
    title: 'MASKINERNA HAR BLIVIT FÖR BRA',
    text: 'De nya systemen fattar beslut ingen längre kan förklara. Forskarna själva ber om reglering.',
    when: (c) => c.res('education') >= 4 || c.st.research > 30,
    choices: [
      { text: 'HÅRD REGLERING', cost: { pp: 25 }, perm: { safety: 8, research: -8, freedom: 5 }, tip: 'Bromsar. Tryggt.' },
      { text: 'INGEN REGLERING ALLS', perm: { research: 14, factory: 10, safety: -10, unrest: 6 }, tip: 'Först i mål eller först i diket.' },
      { text: 'LÅT STATEN ÄGA TEKNIKEN', cost: { money: 1400, pp: 30 }, perm: { statepower: 15, research: 8, freedom: -10 }, tip: 'Kraften blir din ensam.' },
    ],
  },
  {
    id: 'space_program', icon: '\u{1F680}', weight: 2,
    title: 'SKA VI TILL RYMDEN?',
    text: 'Ett rymdprogram skulle kosta enormt och ge lite på kort sikt. Det skulle också säga något om vilka vi är.',
    when: (c) => c.st.research > 15 && c.money > 1500,
    choices: [
      { text: 'BYGG PROGRAMMET', cost: { money: 2500, rp: 80 }, perm: { research: 15, ideopower: 12, approval: 10, milpower: 6 }, tip: 'Dyrt. Odödligt.' },
      { text: 'SAMARBETA MED ANDRA LÄNDER', cost: { money: 900 }, perm: { research: 10, statepower: -5 }, rel: 15, tip: 'Billigare, delad ära.' },
      { text: 'LÄGG PENGARNA PÅ JORDEN I STÄLLET', perm: { qol: 10, hdi: 8, welfare: 6 }, tip: 'Praktiskt.' },
    ],
  },
  {
    id: 'plague_research', icon: '\u{1F9A0}', weight: 2,
    title: 'EN NY SJUKDOM',
    text: 'Ett okänt smittämne har dykt upp i en av landsändarna. Det sprids snabbt.',
    when: (c) => c.day > 100,
    choices: [
      { text: 'FULLSTÄNDIG NEDSTÄNGNING', cost: { pp: 35 }, temp: { qol: -8, factory: -15, income: -12, freedom: -12 }, tip: 'Stoppar smittan. Stoppar allt annat också.' },
      { text: 'KRISPAKET TILL VÅRDEN', cost: { money: 1500 }, temp: { qol: 6, manpower: -5 }, tip: 'Bär genom det utan att stänga.' },
      { text: 'LÅT DEN GÅ GENOM BEFOLKNINGEN', mod: 'epidemic', tip: 'Gratis. Kostsamt.' },
      { text: 'FORSKA FRAM ETT VACCIN', cost: { rp: 100, money: 900 }, perm: { research: 8, qol: 6, hdi: 5 }, tip: 'Tar tid, löser det för alltid.' },
    ],
  },
  {
    id: 'scientist_defects', icon: '\u{1F468}\u{200D}\u{1F52C}', weight: 2,
    title: 'VÅR FRÄMSTE FORSKARE VILL LÄMNA',
    text: 'Landets mest kända vetenskapsman har fått ett erbjudande utomlands och tänker tacka ja.',
    when: (c) => c.st.research > 5,
    choices: [
      { text: 'ERBJUD HONOM VAD SOM HELST', cost: { money: 1400 }, perm: { research: 10, gdp: 5 }, tip: 'Han stannar. Alla andra ser priset.' },
      { text: 'FÖRBJUD HONOM ATT RESA', cost: { pp: 25 }, perm: { research: 4, freedom: -12, immigration: -8 }, tip: 'Han stannar. Motvilligt.' },
      { text: 'LÅT HONOM GÅ', perm: { research: -8 }, temp: { freedom: 5 }, tip: 'Fria människor rör sig fritt.' },
    ],
  },
  {
    id: 'lost_archive', icon: '\u{1F4DA}', weight: 1,
    title: 'NATIONALARKIVET BRINNER',
    text: 'En brand har förstört stora delar av landets historiska samlingar.',
    when: (c) => c.day > 80,
    choices: [
      { text: 'ÅTERSTÄLL VAD SOM GÅR', cost: { money: 800, rp: 30 }, temp: { hdi: 5, ideopower: 5 }, tip: 'Man räddar det man kan.' },
      { text: 'SKRIV HISTORIEN PÅ NYTT', cost: { pp: 30 }, perm: { ideopower: 14, research: -6, freedom: -8 }, tip: 'Det som brann var ändå obekvämt.' },
      { text: 'GÖR PLATSEN TILL ETT MINNESMÄRKE', cost: { money: 300 }, temp: { approval: 6, hdi: 3 }, tip: 'Sorgen får en plats.' },
    ],
  },

  // ================= DIPLOMATI & OMVÄRLD =================
  {
    id: 'refugee_wave', icon: '\u{1F6F6}', weight: 2,
    title: 'FLYKTINGAR VID GRÄNSEN',
    text: 'Ett krig i grannskapet har drivit hundratusentals mot din gräns. De står där nu.',
    when: (c) => c.day > 100,
    choices: [
      { text: 'SLÄPP IN ALLA', cost: { money: 1200 }, temp: { immigration: 20, manpower: 10, welfare: -10, unrest: 8 }, rel: 20, tip: 'Humant. Dyrt. Beundrat.' },
      { text: 'STÄNG GRÄNSEN HELT', cost: { pp: 20 }, temp: { safety: 8, integration: 8, approval: -6 }, rel: -18, tip: 'Problemet blir någon annans.' },
      { text: 'SLÄPP IN ETT BEGRÄNSAT ANTAL', cost: { money: 500 }, temp: { immigration: 8, manpower: 4, unrest: 3 }, rel: 8, tip: 'Kompromiss som ingen älskar.' },
      { text: 'BETALA GRANNLANDET ATT BEHÅLLA DEM', cost: { money: 1800 }, temp: { integration: 6, approval: -4 }, rel: -8, tip: 'Ur syne, ur sinne.' },
    ],
  },
  {
    id: 'foreign_ultimatum', icon: '\u{1F4DC}', weight: 2,
    title: 'ETT ULTIMATUM',
    text: 'En stormakt kräver att du ändrar din politik inom trettio dagar — annars följer sanktioner.',
    when: (c) => c.st.freedom < -20 || c.st.milpower > 25,
    choices: [
      { text: 'GE EFTER', cost: { pp: 25 }, temp: { ideopower: -12, statepower: -10, income: 10 }, rel: 20, tip: 'Trycket lättar. Så gör din auktoritet.' },
      { text: 'AVVISA ULTIMATUMET', cost: { pp: 20 }, temp: { ideopower: 14, approval: 8, income: -12 }, rel: -22, tip: 'Stolt. Dyrt.' },
      { text: 'FÖRHANDLA I DET TYSTA', cost: { money: 1000, pp: 15 }, temp: { income: 5, corruption: 6 }, rel: 8, tip: 'Ingen behöver förlora ansiktet.' },
      { text: 'SÖK STÖD HOS DERAS RIVALER', cost: { pp: 30 }, temp: { statepower: 8, milpower: 6 }, rel: -12, tip: 'Byter en beroendeställning mot en annan.' },
    ],
  },
  {
    id: 'summit_invite', icon: '\u{1F310}', weight: 2,
    title: 'INBJUDAN TILL TOPPMÖTET',
    text: 'Världens ledare samlas och du är inbjuden. Det finns saker att vinna och saker att förlora.',
    when: (c) => c.day > 120,
    choices: [
      { text: 'ÅK OCH SAMARBETA', cost: { money: 400 }, temp: { income: 10, research: 8, statepower: -5 }, rel: 18, tip: 'Öppnar dörrar.' },
      { text: 'ÅK OCH PROVOCERA', cost: { pp: 20 }, temp: { ideopower: 14, approval: 10 }, rel: -20, tip: 'Alla pratar om dig.' },
      { text: 'STANNA HEMMA', temp: { statepower: 5 }, rel: -8, tip: 'Ingen saknar dig.' },
    ],
  },
  {
    id: 'spy_caught', icon: '\u{1F575}\u{FE0F}', weight: 2,
    title: 'EN SPION HAR GRIPITS',
    text: 'En utländsk agent har gripits med dokument från försvarsdepartementet.',
    when: (c) => c.res('espionage') >= 1 || c.day > 130,
    choices: [
      { text: 'OFFENTLIG RÄTTEGÅNG', cost: { pp: 20 }, temp: { approval: 10, ideopower: 8, safety: 5 }, rel: -15, tip: 'Uppvisning i styrka.' },
      { text: 'BYT HONOM MOT VÅR EGEN AGENT', cost: { pp: 15 }, temp: { safety: 4 }, rel: 10, tip: 'Diskret och praktiskt.' },
      { text: 'VÄND HONOM MOT SIN EGEN SIDA', cost: { money: 800 }, perm: { research: 6, milpower: 5 }, tip: 'Nu arbetar han för dig.' },
    ],
  },
  {
    id: 'ally_calls', icon: '\u{1F91D}', weight: 2,
    title: 'EN ALLIERAD BER OM HJÄLP',
    text: 'Ett land ni har avtal med har blivit angripet och åberopar er allians.',
    when: (c) => c.allies > 0,
    choices: [
      { text: 'SKICKA TRUPPER', cost: { man: 25, money: 900 }, temp: { milpower: -8, readiness: -8, ideopower: 8 }, rel: 25, tip: 'Ni står vid ert ord.' },
      { text: 'SKICKA PENGAR OCH MATERIEL', cost: { money: 1500 }, rel: 12, tip: 'Hjälp utan blod.' },
      { text: 'SVIK DEM', temp: { milpower: 5, approval: -10, ideopower: -12 }, rel: -30, tip: 'Ingen litar på dig igen.' },
    ],
  },
  {
    id: 'trade_bloc_offer', icon: '\u{1F4E6}', weight: 2,
    title: 'ERBJUDANDE OM FRIHANDEL',
    text: 'Ett handelsblock vill ha med er. Villkoren innebär att ni ger upp kontroll över vissa regler.',
    when: (c) => c.day > 140,
    choices: [
      { text: 'GÅ MED', cost: { pp: 25 }, perm: { income: 14, gdp: 12, statepower: -10, ideopower: -6 }, rel: 18, tip: 'Rikare och mindre fri.' },
      { text: 'FÖRHANDLA FRAM UNDANTAG', cost: { pp: 40, money: 600 }, perm: { income: 8, gdp: 6, statepower: -3 }, rel: 10, tip: 'Det bästa av båda, dyrt köpt.' },
      { text: 'AVSTÅ', perm: { statepower: 6, factory: 5 }, rel: -8, tip: 'Ni står fria och utanför.' },
    ],
  },
  {
    id: 'foreign_meddling', icon: '\u{1F5F3}\u{FE0F}', weight: 2,
    title: 'NÅGON PÅVERKAR VÅRA VAL',
    text: 'Underrättelsetjänsten har hittat storskalig utländsk påverkan i den inhemska debatten.',
    when: (c) => !c.is('elections', 'no') && c.day > 140,
    choices: [
      { text: 'GÅ UT OFFENTLIGT MED DET', cost: { pp: 20 }, temp: { approval: 10, freedom: 5 }, mod: 'national_unity', rel: -15, tip: 'Sanningen samlar landet.' },
      { text: 'STÄNG NER DE UTLÄNDSKA KANALERNA', cost: { pp: 25 }, temp: { statepower: 10, freedom: -12, safety: 6 }, tip: 'Effektivt och farligt.' },
      { text: 'GÖR SAMMA SAK MOT DEM', cost: { money: 1200 }, perm: { statepower: 8 }, rel: -20, tip: 'Nu är ni likadana.' },
    ],
  },
  {
    id: 'humanitarian_call', icon: '\u{1F30D}', weight: 1,
    title: 'VÄRLDEN BER OM HJÄLP',
    text: 'En katastrof har drabbat ett annat land. Ni har resurser att skicka.',
    when: (c) => c.money > 800,
    choices: [
      { text: 'SKICKA ETT STORT BISTÅND', cost: { money: 1200 }, temp: { approval: 8, ideopower: 6 }, rel: 22, tip: 'Vänner köps inte, men de minns.' },
      { text: 'SKICKA EN SYMBOLISK SUMMA', cost: { money: 200 }, rel: 6, tip: 'Bättre än inget.' },
      { text: 'VI HAR EGNA PROBLEM', temp: { approval: -4 }, rel: -10, tip: 'Ärligt.' },
    ],
  },

  // ================= KATASTROF & NATUR =================
  {
    id: 'earthquake', icon: '\u{1F30B}', weight: 2,
    title: 'JORDBÄVNING',
    text: 'En kraftig skalvvåg har jämnat delar av en storstad med marken.',
    when: () => true,
    choices: [
      { text: 'MOBILISERA ALLT', cost: { money: 1500, man: 20 }, temp: { approval: 14, qol: -6, income: -8 }, tip: 'Folket ser att staten finns när det gäller.' },
      { text: 'BEGÄR INTERNATIONELL HJÄLP', cost: { pp: 20 }, temp: { qol: -4, statepower: -8 }, rel: 15, tip: 'Hjälpen kommer. Så gör kamerorna.' },
      { text: 'GÖR VAD BUDGETEN TILLÅTER', cost: { money: 400 }, temp: { approval: -10, unrest: 10, qol: -10 }, mod: 'natural_disaster', tip: 'Otillräckligt, och alla vet det.' },
    ],
  },
  {
    id: 'harvest_fail', icon: '\u{1F33E}', weight: 2,
    title: 'SKÖRDEN SLOG FEL',
    text: 'Torkan har förstört merparten av årets skörd. Lagren räcker till våren.',
    when: () => true,
    choices: [
      { text: 'KÖP MAT PÅ VÄRLDSMARKNADEN', cost: { money: 1600 }, temp: { qol: 4 }, tip: 'Dyrt. Ingen svälter.' },
      { text: 'RANSONERA', cost: { pp: 25 }, temp: { qol: -10, unrest: 10, freedom: -8, income: 8 }, tip: 'Rättvis brist.' },
      { text: 'BESLAGTA BÖNDERNAS LAGER', cost: { pp: 30 }, temp: { qol: -4, factory: -8, unrest: 15, statepower: 10 }, tip: 'Fungerar en gång.' },
      { text: 'BYGG BEVATTNING FÖR FRAMTIDEN', cost: { money: 1200, rp: 40 }, temp: { qol: -8, unrest: 8 }, perm: { factory: 8, qol: 5 }, tip: 'Löser nästa år, inte detta.' },
    ],
  },
  {
    id: 'industrial_accident', icon: '\u{2622}\u{FE0F}', weight: 2,
    title: 'OLYCKAN I ANLÄGGNINGEN',
    text: 'En allvarlig olycka i en av landets största anläggningar. Området är avspärrat.',
    when: (c) => c.st.factory > 5,
    choices: [
      { text: 'FULL ÖPPENHET OCH EVAKUERING', cost: { money: 1200 }, temp: { approval: 8, factory: -12, freedom: 6 }, tip: 'Dyrt, ärligt, rätt.' },
      { text: 'TONA NER DET', cost: { pp: 20 }, temp: { factory: -4, qol: -10, unrest: 8 }, mod: 'cover_up', tip: 'Kostar mindre nu.' },
      { text: 'SKYLL PÅ SABOTAGE', cost: { pp: 25 }, temp: { unrest: -6, ideopower: 8, freedom: -10 }, rel: -12, tip: 'Ilskan riktas utåt.' },
    ],
  },
  {
    id: 'flood', icon: '\u{1F30A}', weight: 2,
    title: 'ÖVERSVÄMNINGAR',
    text: 'Floderna har svämmat över och satt hela landsändar under vatten.',
    when: () => true,
    choices: [
      { text: 'BYGG PERMANENTA SKYDDSVALLAR', cost: { money: 1800 }, perm: { qol: 6, factory: 5 }, temp: { income: -10 }, tip: 'Sista gången det händer.' },
      { text: 'AKUT NÖDHJÄLP', cost: { money: 700 }, temp: { approval: 8, qol: -5 }, tip: 'Räddar liv nu.' },
      { text: 'FLYTTA BEFOLKNINGEN', cost: { pp: 30, money: 900 }, temp: { unrest: 10, qol: -6, approval: -8 }, tip: 'Ingen vill lämna sitt hem.' },
    ],
  },
  {
    id: 'blackout', icon: '\u{1F50C}', weight: 1,
    title: 'HELA LANDET ÄR MÖRKLAGT',
    text: 'Elnätet har kollapsat. Ingen vet säkert varför.',
    when: (c) => c.st.factory > -10,
    choices: [
      { text: 'BYGG UT NÄTET ORDENTLIGT', cost: { money: 1600 }, perm: { factory: 10, income: 6, qol: 5 }, tip: 'Löser grundproblemet.' },
      { text: 'NÖDREPARATIONER', cost: { money: 500 }, temp: { factory: -6 }, tip: 'Lampor på. Nästa gång kommer.' },
      { text: 'PÅSTÅ ATT DET VAR ETT ANGREPP', cost: { pp: 20 }, temp: { milpower: 6, ideopower: 8, freedom: -6 }, rel: -12, tip: 'Ett mörker kan användas.' },
    ],
  },
  {
    id: 'winter_crisis', icon: '\u{2744}\u{FE0F}', weight: 1,
    title: 'DEN VÄRSTA VINTERN PÅ HUNDRA ÅR',
    text: 'Kylan har slagit ut transporter och uppvärmning. Folk fryser i sina hem.',
    when: () => true,
    choices: [
      { text: 'ÖPPNA OFFENTLIGA BYGGNADER SOM VÄRMESTUGOR', cost: { money: 400 }, temp: { qol: 8, approval: 10 }, tip: 'Billigt och mänskligt.' },
      { text: 'SUBVENTIONERA UPPVÄRMNING', cost: { money: 1300 }, temp: { qol: 12, approval: 12, income: -12 }, tip: 'Ingen fryser.' },
      { text: 'FOLK FÅR KLARA SIG SJÄLVA', temp: { qol: -12, approval: -12, unrest: 10, manpower: -6 }, tip: 'Vintern tar sitt.' },
    ],
  },

  // ================= SAMHÄLLE & KULTUR =================
  {
    id: 'national_artist', icon: '\u{1F3A8}', weight: 1,
    title: 'ETT KONSTVERK SOM DELAR LANDET',
    text: 'En hyllad konstnär har skapat något som halva landet kallar mästerverk och andra halvan hädelse.',
    when: (c) => c.day > 90,
    choices: [
      { text: 'STÄLL UT DET I NATIONALGALLERIET', cost: { pp: 10 }, temp: { freedom: 8, ideopower: -5, unrest: 5 }, tip: 'Konsten får plats.' },
      { text: 'FÖRBJUD DET', cost: { pp: 15 }, temp: { ideopower: 8, freedom: -10, research: -4 }, tip: 'Nu vill alla se det.' },
      { text: 'KÖP DET OCH LÅT DET FÖRSVINNA', cost: { money: 700 }, temp: { stability: 4, freedom: -5 }, tip: 'Diskret.' },
    ],
  },
  {
    id: 'sports_triumph', icon: '\u{1F3C6}', weight: 1,
    title: 'VI VANN',
    text: 'Landslaget har vunnit den största turneringen som finns. Gatorna är fulla av firande.',
    when: (c) => c.day > 100,
    choices: [
      { text: 'NATIONELL FIRANDEDAG', cost: { money: 300 }, mod: 'olympic_glory', tip: 'Låt dem fira.' },
      { text: 'ANVÄND SEGERN POLITISKT', cost: { pp: 15 }, temp: { ideopower: 12, approval: 10 }, tip: 'Segern blir din.' },
      { text: 'INVESTERA I UNGDOMSIDROTT', cost: { money: 800 }, perm: { qol: 6, hdi: 5, manpower: 5 }, tip: 'Fler segrar sedan.' },
    ],
  },
  {
    id: 'language_debate', icon: '\u{1F5E3}\u{FE0F}', weight: 1,
    title: 'VILKET SPRÅK SKA SKOLAN HA?',
    text: 'Minoritetsspråken i landet kräver egen undervisning. Frågan har blivit större än den ser ut.',
    when: (c) => c.st.integration < 20,
    choices: [
      { text: 'ETT SPRÅK FÖR ALLA', cost: { pp: 20 }, perm: { integration: 12, ideopower: 8, freedom: -8, unrest: 6 }, tip: 'Enhet med tvång.' },
      { text: 'TVÅSPRÅKIG UNDERVISNING', cost: { money: 800 }, perm: { integration: 6, freedom: 8, hdi: 5 }, tip: 'Dyrare, mjukare.' },
      { text: 'LÅT REGIONERNA BESTÄMMA', perm: { freedom: 6, integration: -5, statepower: -6 }, tip: 'Ingen central linje alls.' },
    ],
  },
  {
    id: 'birth_rate_crisis', icon: '\u{1F476}', weight: 2,
    title: 'INGEN FÅR BARN LÄNGRE',
    text: 'Födelsetalen har fallit till en nivå där befolkningen kommer att halveras inom två generationer.',
    when: (c) => c.st.manpower < 10 || c.is('popgrowth', 'none', 'discouraged'),
    choices: [
      { text: 'GENERÖSA FAMILJESTÖD', cost: { money: 1400 }, perm: { manpower: 12, welfare: 8, qol: 5, income: -8 }, tip: 'Fungerar, långsamt.' },
      { text: 'ÖPPNA FÖR ARBETSKRAFTSINVANDRING', cost: { pp: 20 }, perm: { immigration: 15, manpower: 10, gdp: 8, integration: -8 }, tip: 'Snabbaste lösningen.' },
      { text: 'KAMPANJ OM NATIONENS FRAMTID', cost: { money: 400, pp: 15 }, temp: { manpower: 6, ideopower: 8 }, tip: 'Billigt. Verkningslöst i längden.' },
      { text: 'ACCEPTERA EN MINDRE BEFOLKNING', perm: { qol: 8, manpower: -8, gdp: -5 }, tip: 'Färre människor, bättre liv för dem.' },
    ],
  },
  {
    id: 'youth_exodus', icon: '\u{1F6EB}', weight: 2,
    title: 'DE UNGA LÄMNAR',
    text: 'En hel generation flyttar utomlands för att de inte ser någon framtid här.',
    when: (c) => c.st.qol < 0 && c.st.gdp < 10,
    choices: [
      { text: 'STORT UNGDOMSPAKET: BOSTÄDER OCH JOBB', cost: { money: 1600 }, perm: { qol: 10, manpower: 10, gdp: 6, income: -8 }, tip: 'Ger dem ett skäl att stanna.' },
      { text: 'GÖR DET SVÅRT ATT FLYTTA', cost: { pp: 30 }, perm: { manpower: 8, freedom: -15, approval: -10 }, tip: 'De stannar. Motvilligt.' },
      { text: 'UPPMUNTRA DEM ATT ÅTERVÄNDA SENARE', cost: { money: 500 }, temp: { manpower: 4, research: 4 }, tip: 'Vissa kommer tillbaka.' },
    ],
  },
  {
    id: 'organized_crime', icon: '\u{1F52B}', weight: 2,
    title: 'DEN ORGANISERADE BROTTSLIGHETEN VÄXER',
    text: 'Kriminella nätverk har tagit över hela branscher och köpt sig in i politiken.',
    when: (c) => c.st.safety < 5 || c.st.corruption > 20,
    choices: [
      { text: 'SÄRSKILD INSATSSTYRKA', cost: { money: 1200, pp: 20 }, perm: { safety: 14, corruption: -10 }, temp: { unrest: 8 }, tip: 'Dyrt och effektivt.' },
      { text: 'LEGALISERA DERAS VERKSAMHET', cost: { pp: 30 }, perm: { income: 12, safety: 6, corruption: 8, approval: -8 }, tip: 'Tar ifrån dem marknaden.' },
      { text: 'GÖR UPP MED DEM', cost: { pp: 15 }, perm: { safety: 8, corruption: 15, statepower: -8 }, tip: 'Lugnt. Ruttet.' },
      { text: 'INGENTING', perm: { safety: -10, corruption: 8, gdp: -6 }, tip: 'De växer.' },
    ],
  },
  {
    id: 'monument_question', icon: '\u{1F5FF}', weight: 1,
    title: 'STATYN MÅSTE BORT — ELLER STÅ KVAR',
    text: 'En staty över en historisk gestalt har blivit stridsfråga. Båda sidor är högljudda.',
    when: (c) => c.day > 110,
    choices: [
      { text: 'RIV DEN', cost: { pp: 15 }, temp: { freedom: 6, approval: 4, ideopower: -6, unrest: 6 }, tip: 'En sida jublar.' },
      { text: 'LÅT DEN STÅ', cost: { pp: 15 }, temp: { ideopower: 8, stability: 5, unrest: 6 }, tip: 'Den andra sidan jublar.' },
      { text: 'FLYTTA DEN TILL ETT MUSEUM MED FÖRKLARANDE TEXT', cost: { money: 300, pp: 10 }, temp: { hdi: 5, unrest: -6, approval: 5 }, tip: 'Ingen jublar. Alla kan leva med det.' },
    ],
  },
  {
    id: 'pension_crisis', icon: '\u{1F475}', weight: 2,
    title: 'PENSIONERNA RÄCKER INTE',
    text: 'Pensionssystemet går back och de äldsta får allt mindre att leva på.',
    when: (c) => c.day > 160,
    choices: [
      { text: 'HÖJ PENSIONSÅLDERN', cost: { pp: 30 }, perm: { income: 12, manpower: 6, approval: -14, unrest: 8 }, tip: 'Matematiskt riktigt, politiskt dyrt.' },
      { text: 'HÖJ AVGIFTERNA', cost: { pp: 20 }, perm: { welfare: 8, income: -8, approval: -6 }, tip: 'De arbetande får betala.' },
      { text: 'SKÄR I PENSIONERNA', perm: { income: 15, welfare: -12, approval: -16, qol: -8 }, tip: 'De som byggt landet får ta smällen.' },
      { text: 'LÅNA TILL DET', cost: { money: 1500 }, temp: { welfare: 8, approval: 8 }, perm: { income: -6 }, tip: 'Skjuter problemet framåt.' },
    ],
  },
  // ================= DE STORA VÄGSKÄLEN (fem vägar) =================
  // Sällsynta händelser där hela landets riktning står på spel.
  {
    id: 'crossroads_state', icon: '\u{1F5FA}\u{FE0F}', weight: 1, cooldown: 900,
    title: 'VAD SKA DETTA LAND VARA?',
    text: 'En författningskommission har arbetat i åratal och lägger nu fram fem vägar framåt. Valet kommer att prägla landet i generationer.',
    when: (c) => c.day > 200 && c.pp > 40,
    choices: [
      { text: 'EN FRI REPUBLIK', cost: { pp: 40 }, perm: { freedom: 15, approval: 12, corruption: -8, statepower: -12 }, tip: 'Rättigheter först, makt sedan.' },
      { text: 'EN STARK STAT', cost: { pp: 40 }, perm: { statepower: 18, polpower: 12, stability: 10, freedom: -15 }, tip: 'Ordning först, allt annat sedan.' },
      { text: 'ETT VÄLFÄRDSSAMHÄLLE', cost: { pp: 40, money: 1200 }, perm: { welfare: 18, qol: 14, hdi: 10, income: -12 }, tip: 'Trygghet först.' },
      { text: 'EN HANDELSNATION', cost: { pp: 40 }, perm: { income: 16, gdp: 14, factory: 10, statepower: -8, ideopower: -8 }, tip: 'Välstånd först.' },
      { text: 'EN MILITÄRMAKT', cost: { pp: 40, money: 900 }, perm: { milpower: 18, readiness: 14, manpower: 10, qol: -8, freedom: -10 }, tip: 'Styrka först.' },
    ],
  },
  {
    id: 'crossroads_crisis', icon: '\u{26A1}', weight: 2, cooldown: 500,
    title: 'ALLT HÄNDER SAMTIDIGT',
    text: 'Ekonomin viker, gatorna är oroliga och omvärlden ställer krav. Ditt kansli lägger fram fem sätt att ta sig ur det. Du kan bara välja ett.',
    when: (c) => c.st.unrest > 20 && c.st.income < 5,
    choices: [
      { text: 'SATSA ALLT PÅ EKONOMIN', cost: { pp: 30 }, temp: { income: 18, gdp: 14, unrest: 8, welfare: -8 }, tip: 'Pengarna först — oron får vänta.' },
      { text: 'KÖP LUGN MED VÄLFÄRD', cost: { money: 1400 }, temp: { unrest: -18, approval: 15, income: -12 }, tip: 'Gatorna tystnar. Kassan blöder.' },
      { text: 'SLÅ NER ORON MED HÅRD HAND', cost: { pp: 35 }, temp: { unrest: -20, freedom: -18, approval: -12, statepower: 12 }, tip: 'Snabbast. Fulast.' },
      { text: 'BÖJ DIG FÖR OMVÄRLDEN OCH FÅ HJÄLP', cost: { pp: 25 }, res: { money: 1600 }, temp: { statepower: -12, ideopower: -10 }, rel: 20, tip: 'Pengar och andrum, mot självständighet.' },
      { text: 'SKYLL ALLT PÅ EN YTTRE FIENDE', cost: { pp: 20 }, temp: { unrest: -10, ideopower: 14, approval: 8 }, mod: 'war_fever', rel: -22, tip: 'Samlar landet. Mot något.' },
    ],
  },
  {
    id: 'crossroads_succession', icon: '\u{1F451}', weight: 1, cooldown: 700,
    title: 'VEM TAR ÖVER EFTER DIG?',
    text: 'Frågan går inte längre att skjuta upp. Hur makten ska föras vidare avgör vad landet blir.',
    when: (c) => c.day > 260,
    choices: [
      { text: 'GENOM FRIA VAL', cost: { pp: 30 }, perm: { freedom: 12, approval: 12, stability: 8, polpower: -10 }, tip: 'Folket avgör.' },
      { text: 'GENOM PARTIET', cost: { pp: 30 }, perm: { ideopower: 14, statepower: 10, polpower: 8, freedom: -10 }, tip: 'Rörelsen avgör.' },
      { text: 'GENOM ARV', cost: { pp: 30 }, perm: { stability: 15, ideopower: 8, freedom: -12, approval: -6 }, tip: 'Blodet avgör.' },
      { text: 'GENOM MILITÄREN', cost: { pp: 30 }, perm: { milpower: 14, statepower: 12, freedom: -15, unrest: 8 }, tip: 'Vapnen avgör.' },
      { text: 'INGEN EFTERTRÄDARE — JAG STANNAR', cost: { pp: 50 }, perm: { polpower: 15, statepower: 12, stability: -12, unrest: 10 }, tip: 'Frågan skjuts upp. Igen.' },
    ],
  },
  {
    id: 'crossroads_windfall', icon: '\u{1F4B0}', weight: 1, cooldown: 600,
    title: 'EN OVÄNTAD FÖRMÖGENHET',
    text: 'En enorm summa har landat i statskassan. Alla departement har en åsikt om vad den ska gå till.',
    when: (c) => c.money > 2500,
    choices: [
      { text: 'INDUSTRIN', cost: { money: 2200 }, mod: 'industrial_boom', tip: 'Bygger varaktig kapacitet.' },
      { text: 'FORSKNINGEN', cost: { money: 2200 }, mod: 'tech_breakthrough', res: { rp: 150 }, tip: 'Kunskap som håller.' },
      { text: 'FOLKET', cost: { money: 2200 }, perm: { qol: 12, welfare: 10, approval: 15 }, tip: 'De märker det direkt.' },
      { text: 'ARMÉN', cost: { money: 2200 }, perm: { milpower: 16, readiness: 12, manpower: 8 }, tip: 'Ingen ifrågasätter dig igen.' },
      { text: 'SKOLAN', cost: { money: 2200 }, mod: 'golden_generation', tip: 'Effekten kommer om tjugo år. Den kommer.' },
    ],
  },
  {
    id: 'crossroads_verdict', icon: '\u{2696}\u{FE0F}', weight: 1, cooldown: 600,
    title: 'DOMEN MOT DEN FÖRRA REGERINGEN',
    text: 'De som styrde före dig står nu inför rätta. Hur du hanterar dem säger allt om vad slags stat du leder.',
    when: (c) => c.day > 220,
    choices: [
      { text: 'RÄTTVIS RÄTTEGÅNG, VAD DEN ÄN LEDER TILL', cost: { pp: 25 }, perm: { freedom: 10, corruption: -10, approval: 8 }, tip: 'Lagen gäller alla.' },
      { text: 'AMNESTI FÖR FÖRSONINGENS SKULL', cost: { pp: 20 }, perm: { stability: 12, unrest: -10, corruption: 6 }, tip: 'Landet går vidare. Ingen får upprättelse.' },
      { text: 'AVRÄTTA DEM', cost: { pp: 30 }, perm: { statepower: 15, ideopower: 12, freedom: -15, approval: -8 }, temp: { unrest: 10 }, tip: 'Ingen väg tillbaka — för någon.' },
      { text: 'LANDSFÖRVISNING', cost: { pp: 20 }, perm: { stability: 8, statepower: 6 }, rel: -10, tip: 'Ur landet, ur historien.' },
      { text: 'ERBJUD DEM PLATSER I DIN REGERING', cost: { pp: 35 }, perm: { polpower: 12, corruption: 12, stability: 10, approval: -12 }, tip: 'Cyniskt, effektivt, genomskådat.' },
    ],
  },
];

export const EVENTS = [
  ...BASE_EVENTS, ...EKONOMI, ...HALSA, ...MILJO, ...RATT, ...POLITIK, ...IDEOLOGI,
  ...NYA_IDEOLOGIER, ...MILITAR, ...VETENSKAP, ...SAMHALLE, ...OMVARLD,
];

// ---------- MOTOR ----------

// Vilka händelser kan inträffa just nu? (villkoret sant + inte redan sedd nyligen)
export function eligible(c, seen = {}) {
  return EVENTS.filter((e) => {
    if (seen[e.id] && c.day - seen[e.id] < (e.cooldown || 400)) return false;
    try { return !e.when || !!e.when(c); } catch (err) { return false; }
  });
}

// Väg och lotta fram en händelse. Returnerar null om ingenting passar.
export function pickEvent(c, seen = {}) {
  const pool = eligible(c, seen);
  if (!pool.length) return null;
  const total = pool.reduce((a, e) => a + (e.weight || 1), 0);
  let r = Math.random() * total;
  for (const e of pool) {
    r -= (e.weight || 1);
    if (r <= 0) return e;
  }
  return pool[pool.length - 1];
}

// Går valet att välja med nuvarande resurser?
export function affordable(choice, c) {
  const need = choice.cost || {};
  if ((need.money || 0) > c.money) return `KRÄVER ${money(need.money)}`;
  if ((need.pp || 0) > c.pp) return `KRÄVER ${need.pp} \u{2696}\u{FE0F}`;
  if ((need.rp || 0) > c.rp) return `KRÄVER ${need.rp} \u{1F52C}`;
  if ((need.man || 0) > c.man) return `KRÄVER ${people(need.man)} \u{1FA96}`;
  return null;
}

export const EVENT_COUNT = EVENTS.length;
