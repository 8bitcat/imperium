// IMPERIUM V5.16 VERKLIGHETEN (Henrys önskemål): saker tar tid, folket minns vad
// du tar ifrån dem, och staten kan gå med underskott tills du rättar till det.
//
// 1) TIDEN — statistiken rör sig i verklig takt. Varje mått har en halveringstid
//    (hur många spelår det tar att komma halvvägs mot det läge politiken pekar ut)
//    och ibland ett tak för hur mycket det kan röra sig på ett år. Invandrarandelen
//    ändras bara så fort folk faktiskt flyttar hit, BNP per capita några procent om
//    året och livslängden några månader. Ett spelår = 120 dagar.
// 2) LAGARNA träder i kraft gradvis — nationsvärdena glider mot den nya lagen
//    under ungefär en månad i stället för att hoppa dit samma dag.
// 3) MISSNÖJET — varje lagändring får ett betyg ur folkets ögon (lawPopularity).
//    Tar du bort något folket tycker om blir det missnöje av ett visst slag
//    (LAW_KIND), som ger oro, protester och strejker tills det klingar av eller
//    rättas till. Underskott, kris i ekonomin och invandring som går fortare än
//    integrationen fyller också på.
// 4) UNDERSKOTTET — statskassan får gå under noll (banken lånar ut) så länge
//    Income är DEFICIT_FLOOR eller högre.
//
// Ren logik och data — main.js håller tillståndet och kopplar in det.
import { NEW_511 } from './laws-511.js';

export const YEAR_DAYS = 120;
export const DEFICIT_FLOOR = -70;     // Income under detta: inga nya utgifter på kredit
export const LAW_PHASE_DAYS = 30;     // ungefär så lång tid tar en lag att slå igenom helt
export const RECENT_DAYS = 120;       // "nyligen" för händelserna = senaste spelåret

// ---------- missnöjets orsaker ----------
export const GRIEV_KINDS = {
  valfard: { name: 'VÄLFÄRDEN', icon: '\u{1F91D}', desc: 'nedskärningar i vård, skola, pensioner och trygghet' },
  skatt: { name: 'SKATTERNA', icon: '\u{1F4B8}', desc: 'höjda skatter och avgifter' },
  frihet: { name: 'FRIHETEN', icon: '\u{1F54A}\u{FE0F}', desc: 'inskränkt demokrati, press och rättigheter' },
  migration: { name: 'INVANDRINGEN', icon: '\u{1F6C2}', desc: 'invandring som går fortare än integrationen, eller hårda tag mot invandrare' },
  miljo: { name: 'MILJÖN', icon: '\u{1F333}', desc: 'försämrat miljöskydd och dyrare energi' },
  ekonomi: { name: 'EKONOMIN', icon: '\u{1F3ED}', desc: 'ingrepp i ekonomin, banker och handel' },
  forsvar: { name: 'FÖRSVARET', icon: '\u{1F396}\u{FE0F}', desc: 'värnplikt, krig och kärnvapen' },
  underskott: { name: 'TOM STATSKASSA', icon: '\u{1F3E6}', desc: 'löner och bidrag som betalas sent när kassan är under noll' },
  kris: { name: 'KRISEN', icon: '\u{1F4C9}', desc: 'arbetslöshet, inflation och fattigdom' },
  trygghet: { name: 'TRYGGHETEN', icon: '\u{1F6A8}', desc: 'brott, skjutningar och gäng som växer, eller polis och straff som rivs ner' },   // V5.18
};
export const GRIEV_IDS = Object.keys(GRIEV_KINDS);

// vilken sorts missnöje en lag väcker när den ändras till det sämre
export const LAW_KIND = {
  welfare: 'valfard', healthcare: 'valfard', healthcare_quality: 'valfard', pensions: 'valfard',
  retirement_age: 'valfard', minimum_wage: 'valfard', workhours: 'valfard', vacation: 'valfard',
  parental_leave: 'valfard', childcare: 'valfard', education: 'valfard', school_choice: 'valfard',
  housing: 'valfard', unions: 'valfard', water: 'valfard',
  taxes: 'skatt', corporate_tax: 'skatt', inheritance_tax: 'skatt', alcohol_policy: 'skatt', tobacco: 'skatt',
  price_controls: 'skatt', cash: 'skatt',
  press: 'frihet', speech: 'frihet', protest: 'frihet', civil_rights: 'frihet', surveillance: 'frihet',
  internet: 'frihet', elections: 'frihet', government: 'frihet', party_loyalty: 'frihet', voting_age: 'frihet',
  trials: 'frihet', punishments: 'frihet', death_penalty: 'frihet', policing: 'frihet', rehabilitation: 'frihet',
  juvenile_justice: 'frihet', firearms: 'frihet', drugs: 'frihet', religion: 'frihet', culture: 'frihet',
  language: 'frihet', marriage: 'frihet', equality: 'frihet', emigration: 'frihet', lobbying: 'frihet',
  anti_corruption: 'frihet', vaccination: 'frihet', popgrowth: 'frihet',
  immigration: 'migration', border_control: 'migration', visa_policy: 'migration', citizenship: 'migration',
  environment: 'miljo', energy: 'miljo', forestry: 'miljo', mining: 'miljo', fishing: 'miljo', hunting: 'miljo',
  animal_welfare: 'miljo', transport: 'miljo', urban_planning: 'miljo', road_safety: 'miljo', agriculture: 'miljo',
  economic_system: 'ekonomi', ownership: 'ekonomi', monetary: 'ekonomi', banking: 'ekonomi', globalism: 'ekonomi',
  industrial_subsidies: 'ekonomi', antitrust: 'ekonomi', debt_brake: 'ekonomi', consumer_protection: 'ekonomi',
  ai_regulation: 'ekonomi', intellectual_property: 'ekonomi', science_funding: 'ekonomi', space_program: 'ekonomi',
  sports: 'ekonomi',
  military_service: 'forsvar', defense_budget: 'forsvar', nuclear_doctrine: 'forsvar', arms_exports: 'forsvar',
  un: 'forsvar', foreign_aid: 'forsvar',
};

// lagarnas namn på svenska, i bestämd form — platshållaren {lag} i händelserna
export const LAW_SV = {
  military_service: 'värnplikten', press: 'presslagarna', party_loyalty: 'partilojaliteten', healthcare: 'sjukvården',
  healthcare_quality: 'vårdens kvalitet', welfare: 'välfärden', taxes: 'skatterna', un: 'FN-medlemskapet',
  immigration: 'invandringen', culture: 'kulturpolitiken', religion: 'religionspolitiken', elections: 'valen',
  government: 'statsskicket', civil_rights: 'medborgarrätten', economic_system: 'det ekonomiska systemet',
  education: 'skolan', trials: 'rättegångarna', punishments: 'straffen', rehabilitation: 'kriminalvården',
  death_penalty: 'dödsstraffet', globalism: 'handelspolitiken', popgrowth: 'befolkningspolitiken',
  workhours: 'arbetstiden', minimum_wage: 'minimilönen', pensions: 'pensionerna', environment: 'miljöskyddet',
  energy: 'energipolitiken', surveillance: 'övervakningen', firearms: 'vapenlagarna', drugs: 'narkotikapolitiken',
  unions: 'facken', ownership: 'ägandet av industrin', monetary: 'penningpolitiken', internet: 'internet',
  housing: 'bostadspolitiken', equality: 'jämställdheten', alcohol_policy: 'alkoholpolitiken',
  transport: 'trafikpolitiken', agriculture: 'jordbrukspolitiken', citizenship: 'medborgarskapet',
  childcare: 'barnomsorgen', policing: 'polisen', speech: 'yttrandefriheten', protest: 'demonstrationsrätten',
  corporate_tax: 'bolagsskatten', foreign_aid: 'biståndet', nuclear_doctrine: 'kärnvapendoktrinen',
  ai_regulation: 'AI-lagarna', parental_leave: 'föräldraledigheten', retirement_age: 'pensionsåldern',
  voting_age: 'rösträttsåldern', tobacco: 'tobakslagarna', vaccination: 'vaccinationerna',
  inheritance_tax: 'arvsskatten', school_choice: 'skolvalet', animal_welfare: 'djurskyddet',
  visa_policy: 'visumreglerna', emigration: 'rätten att utvandra', language: 'språkpolitiken',
  space_program: 'rymdprogrammet', debt_brake: 'skuldbromsen', banking: 'bankreglerna',
  arms_exports: 'vapenexporten', intellectual_property: 'upphovsrätten', vacation: 'semestern',
  juvenile_justice: 'straffbarhetsåldern', anti_corruption: 'korruptionsbekämpningen',
  border_control: 'gränskontrollen', lobbying: 'partifinansieringen', consumer_protection: 'konsumentskyddet',
  cash: 'kontanterna', price_controls: 'priskontrollerna', antitrust: 'konkurrenslagarna',
  industrial_subsidies: 'industristöden', science_funding: 'forskningsanslagen', water: 'vattnet',
  fishing: 'fiskekvoterna', hunting: 'jakten', forestry: 'skogsbruket', mining: 'gruvorna',
  road_safety: 'trafiksäkerheten', urban_planning: 'stadsplaneringen', marriage: 'äktenskapslagarna',
  sports: 'idrottspolitiken', defense_budget: 'försvarsbudgeten',
};
// V5.17: nya lagar bär sitt missnöjesslag (kind) och sitt svenska namn (sv) själva
for (const [cat, L] of Object.entries(NEW_511)) {
  if (L.kind && !LAW_KIND[cat]) LAW_KIND[cat] = L.kind;
  if (L.sv && !LAW_SV[cat]) LAW_SV[cat] = L.sv;
}

// Hur mycket folket gillar ett lagalternativ (ur dess nationsvärden). Högre = populärare.
export function lawPopularity(mods) {
  const m = mods || {};
  return (m.approval || 0) + 0.6 * (m.qol || 0) + 0.5 * (m.welfare || 0) + 0.4 * (m.freedom || 0)
    + 0.2 * (m.safety || 0) + 0.2 * (m.hdi || 0) - 0.3 * (m.unrest || 0);
}

// En lagändring → { kind, amt, delta }. amt > 0 = nytt missnöje, amt < 0 = lättnad.
// Att ta bort något bra (välfärd) svider mer än att ge något nytt gläder.
export function grievFromChange(cat, oldMods, newMods) {
  const kind = LAW_KIND[cat] || 'ekonomi';
  const delta = lawPopularity(newMods) - lawPopularity(oldMods);
  if (Math.abs(delta) < 2) return { kind, amt: 0, delta };
  const amt = delta < 0
    ? Math.min(55, -delta * (kind === 'valfard' ? 1.5 : 1.15))
    : -Math.min(40, delta * 0.8);
  return { kind, amt: Math.round(amt), delta };
}

// Missnöjet i nationsvärden (egen källa i computeStats). P = samlat missnöje 0–100.
// Över 50 börjar folk strejka — fabrikerna står och pengarna uteblir.
export function protestMods(P) {
  if (!(P > 0.5)) return {};
  const strike = Math.max(0, P - 50);
  const r = (n) => Math.round(n);
  const out = { unrest: r(P * 0.4), approval: r(-P * 0.3), stability: r(-P * 0.18), factory: r(-strike * 0.35), income: r(-strike * 0.2) };
  for (const k of Object.keys(out)) if (!out[k]) delete out[k];
  return out;
}
export const grievTotal = (g) => Math.min(100, GRIEV_IDS.reduce((s, k) => s + (g?.[k] || 0), 0));

// ---------- chocker i statistiken (händelsernas ind: { … }) ----------
// En chock flyttar måttet direkt, sedan glider det tillbaka mot det läge politiken
// pekar ut i måttets egen takt. unit: 'pp' procentenheter, '%' procent av värdet,
// 'pts' poäng i måttets skala, 'yrs' år.
export const SHOCKS = {
  unemp: { unit: 'pp', max: 4 }, youthunemp: { unit: 'pp', max: 8 }, infl: { unit: 'pp', max: 10 },
  gdpgrowth: { unit: 'pp', max: 4 }, gdppc: { unit: '%', max: 8 }, feelsafe: { unit: 'pp', max: 10 },
  policetrust: { unit: 'pp', max: 10 }, trustgov: { unit: 'pp', max: 15 }, happiness: { unit: 'pts', max: 0.6 },
  pressfree: { unit: 'pts', max: 10 }, migrants: { unit: 'pp', max: 1.5 }, demo: { unit: 'pts', max: 1.5 },
  crimeidx: { unit: '%', max: 20 }, tourists: { unit: '%', max: 40 }, stockcap: { unit: '%', max: 30 },
  life: { unit: 'yrs', max: 1 }, turnout: { unit: 'pp', max: 10 }, strikes: { unit: '%', max: 80 },
  protests: { unit: '%', max: 80 }, homeless: { unit: '%', max: 30 }, houseprice: { unit: '%', max: 25 },
  xenophobia: { unit: 'pp', max: 8 }, segreg: { unit: 'pts', max: 8 }, homicide: { unit: '%', max: 30 },
  // V5.18 LAG OCH ORDNING: brotten
  shootings: { unit: '%', max: 40 }, bombings: { unit: '%', max: 50 }, gangs: { unit: '%', max: 25 },
  knifecrime: { unit: '%', max: 30 }, burglary: { unit: '%', max: 25 }, robbery: { unit: '%', max: 25 }, fraud: { unit: '%', max: 25 },
  elderfraud: { unit: '%', max: 30 }, hacking: { unit: '%', max: 35 }, drugcrime: { unit: '%', max: 30 },
  drugdeaths: { unit: '%', max: 30 }, druguse: { unit: 'pp', max: 2 }, clearance: { unit: 'pp', max: 6 },
  murdersolved: { unit: 'pp', max: 10 }, darkfigure: { unit: 'pp', max: 6 }, prisonocc: { unit: '%', max: 20 },
};
export const DEMO_SUBS = ['demo_el', 'demo_gov', 'demo_part', 'demo_cult', 'demo_civ'];

// ---------- TIDEN: hur fort varje mått rör sig ----------
// [halveringstid i spelår, största ändring per spelår (eller null), true = taket är en andel av värdet]
const SPEED = {
  gdppc: [3, 0.07, true], gdppcppp: [3, 0.07, true], gnipc: [3, 0.07, true], productivity: [3, 0.07, true],
  healthpc: [3, 0.08, true], gdpgrowth: [0.75], unemp: [1, 4], youthunemp: [1, 8], unempfem: [1, 4],
  unempmale: [1, 4], unempedu: [1, 4], infl: [0.5], lendrate: [0.75], realrate: [0.75], stockcap: [0.5],
  fdi: [1], tourists: [1, 0.35, true], airpax: [1, 0.35, true], exports: [2, 0.15, true], imports: [2, 0.15, true],
  tax: [2, 3], govspend: [2, 3], healthx: [3, 1], edux: [3, 0.8], milx: [1, 1.5],
  netmig: [1], popgrowth: [3, 0.4], birth: [5, 1.2], death: [5, 0.6], fert: [6, 0.08],
  life: [6, 0.35], lifefem: [6, 0.35], lifemale: [6, 0.35],
  infmort: [5, 0.08, true], u5mort: [5, 0.08, true], neonatal: [5, 0.08, true], matmort: [5, 0.1, true],
  literacy: [8, 1.2], youthlit: [6, 1.5], litfem: [8, 1.2], schoolyears: [10, 0.12],
  tertiary: [6, 2], bachelor: [8, 1], secondary: [5, 3], preschool: [4, 4], primary: [5, 2],
  urban: [10, 0.6], kids: [10, 0.35], old: [10, 0.35], female: [20, 0.1],
  forest: [15, 0.4], renew: [6, 2.5], renewelec: [6, 3], co2: [5, 0.06, true], co2total: [5, 0.06, true],
  ghg: [5, 0.06, true], methane: [5, 0.06, true], elec: [6, 3], water: [6, 3], sanitation: [6, 3],
  hdi: [6, 0.012], happiness: [1.5, 0.5], pressfree: [1], feelsafe: [1.5, 6],
  voice: [2, 0.35], polstab: [1.5, 0.5], goveff: [3, 0.25], rulelaw: [3, 0.25], corruptgov: [3, 0.25], regq: [3, 0.3],
  demo_el: [1, 2], demo_gov: [1.5, 1.5], demo_part: [2, 1.2], demo_cult: [4, 0.8], demo_civ: [1.5, 1.6],
  prisoners: [2, 0.2, true], gini: [5, 1.2], poverty: [3, 0.15, true], top10: [5, 1], bottom20: [5, 0.4],
  doctors: [6, 0.05, true], nurses: [6, 0.05, true], beds: [6, 0.04, true], researchers: [5, 0.06, true],
  patents: [3, 0.12, true], articles: [4, 0.08, true], rail: [10, 0.03, true], eleccons: [5, 0.05, true],
  // V5.16 nya mått
  trustgov: [0.75], trustparl: [1], trustcourt: [2], turnout: [2, 6], protests: [0.4], strikes: [0.4],
  polprisoners: [1], unionrate: [5, 2], xenophobia: [2, 4], segreg: [6, 2], integ: [4, 3], migemp: [3, 3],
  exclusion: [6, 1], homeless: [2, 0.25, true], houseprice: [2, 0.12, true], rentshare: [3, 2], hhdebt: [3, 6],
  medinc: [3, 0.07, true], wage: [3, 0.07, true], minwage: [1], foodprice: [1], fuelprice: [0.5], elprice: [0.75],
  carewait: [2], pisa: [6, 4], housingshort: [3, 0.15, true], sickleave: [2, 1], mentalill: [4, 1],
};
// halveringstid per grupp för allt som inte står ovan
const GROUP_HL = { eko: 2, arb: 1.5, hal: 5, jor: 4, bef: 6, dem: 8, rel: 12, kun: 6, sam: 2, brt: 2, ekb: 2,
  rtt: 3, inf: 5, nat: 6, fvr: 1, dmk: 1.5, fin: 0, mig: 3, var: 2 };
// följer migranterna själva (flödet) — se migrantCap
const RELIGION_SPEED = [12, 0.6];
// räknas fram ur andra mått efter trögheten — glider inte själva
export const NO_LAG = new Set(['pop', 'area', 'density', 'gdp', 'gdpppp', 'taxrev', 'milbudget', 'tradebal', 'soldiers',
  'reserve', 'births', 'deaths', 'popchange', 'demo', 'regime', 'urbanpop', 'ruralpop', 'households', 'kidsn', 'oldn',
  'workage', 'pop25', 'doubling', 'griev', 'treasury', 'deficitusd', 'debtusd', 'debtpc', 'rating', 'bondrate',
  'interestusd', 'budgetbal', 'crimetotal', 'crimecount', 'convicted']);

export function speedOf(id, group) {
  if (SPEED[id]) return SPEED[id];
  if (id.startsWith('r_')) return RELIGION_SPEED;
  return [GROUP_HL[group] ?? 3];
}

// Ett dagssteg för ett mått. cur/want = avstånd från "utan politik" (plain), base = plain.
// migCap = största ändring per år för Födda utomlands (följer flödet).
export function lagStep(id, group, cur, want, base, migCap) {
  const d = want - cur;
  if (!d) return want;
  const [hl, max, rel] = speedOf(id, group);
  if (!hl) return want;
  let step = d * (1 - 0.5 ** (1 / (hl * YEAR_DAYS)));
  let cap = id === 'migrants' ? migCap : max;
  if (cap != null) {
    if (rel) cap *= Math.abs(base + cur);
    const perDay = cap / YEAR_DAYS;
    step = Math.max(-perDay, Math.min(perDay, step));
  }
  // det sista lilla biten tar inte en evighet
  if (Math.abs(d) < Math.abs(want) * 0.001 + 1e-9) return want;
  return cur + step;
}

// Ett lands invandrarandel kan inte växa fortare än folk faktiskt flyttar dit:
// nettoinvandringen i procent av befolkningen per år, plus lite marginal.
export function migrantCap(netmig, pop) {
  const rate = pop > 0 ? Math.abs(netmig || 0) / pop * 100 : 0;
  return Math.max(0.15, rate * 1.1);
}

// ---------- demokratiindexet (EIU-skalan) ----------
export function regimeOf(score) {
  if (!Number.isFinite(score)) return null;
  if (score > 8) return { id: 3, name: 'FULL DEMOKRATI', color: '#4ae37a' };
  if (score > 6) return { id: 2, name: 'BRISTFÄLLIG DEMOKRATI', color: '#9fe34a' };
  if (score > 4) return { id: 1, name: 'HYBRIDREGIM', color: '#ffb02e' };
  return { id: 0, name: 'AUKTORITÄR REGIM', color: '#ff6b5e' };
}

// ---------- V5.17 YTTERLIGHETER: utopier och brutala lagar ----------
// ✨ En utopi (option.utopia) lockar med sina mods, men verkligheten (option.sting)
// kommer ikapp: från dag STING_START efter att lagen antogs växer stinget linjärt
// till fullt efter STING_DAYS till, samtidigt som lockelsens positiva delar halveras.
// 💀 Ett brutalt val (option.brutal) fungerar direkt men omvärlden fördömer det
// (option.shame): relationerna glider nedåt så länge lagen gäller, mest hos fria länder.
export const STING_START = 20;
export const STING_DAYS = 220;
export const HONEY_FADE = 0.5;
// V5.19: en buffad utopi (tuning.js) bär egna stingStart/stingDays/honeyFade
export function stingFactor(age, option) {
  return Math.max(0, Math.min(1, ((age || 0) - (option?.stingStart ?? STING_START)) / (option?.stingDays ?? STING_DAYS)));
}
// inverted = nationsvärden där högt är dåligt (oro, korruption, krigstid)
export function utopiaFx(option, f, inverted) {
  const out = {};
  if (!(f > 0) || !option?.utopia) return out;
  for (const [k, v] of Object.entries(option.mods || {})) {
    const good = inverted.has(k) ? -v : v;
    if (good > 0) out[k] = (out[k] || 0) - v * (option.honeyFade ?? HONEY_FADE) * f;
  }
  for (const [k, v] of Object.entries(option.sting || {})) out[k] = (out[k] || 0) + v * f;
  return out;
}
// hur mycket ett land bryr sig om dina brutala lagar: fria länder mest, diktaturer knappt
export function shameWeight(auth) {
  return Math.max(0.2, Math.min(1.5, 1.6 - (auth ?? 40) / 55));
}
