// IMPERIUM V5.19 — BUFFAR OCH DEBUFFAR (Henrys önskemål).
// Ett lager ovanpå lagarna och ideologierna. Varje utpekat val får en nivå som skalar
//   1) nationsvärdena: det bra (good) och det dåliga (bad) var för sig,
//   2) statistikeffekterna: '+' och '*' åt rätt håll enligt måttets `better`,
//   3) hur fort valet slår igenom (speed, tickPolicyPhase i main.js),
//   4) vad det kostar i ⚖️ att anta (cost).
// Utopierna (✨) och de brutala valen (💀) får alla nivån sin egen, och utopiernas
// spricka kommer senare och långsammare. Källan för kontrollerna i check-laws.mjs är
// värdena som de skrevs (`mods0`), så att reglerna för ✨/💀 gäller datat och inte lagret.
//
// V5.20 (Henry): "en utopi är det bästa av det bästa … ungefär 5–20 gånger starkare" än en
// vanlig lag, buffad eller inte, men den kan spricka. Och de brutala valen är revolutionerande:
// 5–20 gånger mer effektiva och aggressiva, de slår igenom på några dagar, och de drabbar mycket
// mer än sin egen lag. Därför räknas kraften per lag (powerOf): målet är tio gånger ett vanligt
// val i samma lag och minst två och en halv gånger det starkaste buffade valet där.
// De brutala valen får också spridning (RIPPLE): nationsvärden och statistikmått som valet inte
// redan rör läggs till efter lagens slag, innan kraften skalas.
import { STATS } from './stats.js';
import { LAW_KIND } from './realism.js';

export const TIERS = {
  // indSpeed = hur många gånger fortare statistikmåtten som valet rör flyttar sig (tickIndLag)
  buff2:   { tag: '\u{2191}\u{2191}', name: 'MYCKET STARKARE', good: 1.8, bad: 0.55, speed: 3, cost: 0.5, indSpeed: 4 },
  buff:    { tag: '\u{2191}', name: 'STARKARE', good: 1.4, bad: 0.75, speed: 2, cost: 0.7, indSpeed: 2 },
  debuff:  { tag: '\u{2193}', name: 'SVAGARE', good: 0.7, bad: 1.3, speed: 0.7, cost: 1.3, indSpeed: 0.75 },
  debuff2: { tag: '\u{2193}\u{2193}', name: 'MYCKET SVAGARE', good: 0.45, bad: 1.6, speed: 0.5, cost: 1.6, indSpeed: 0.5 },
  // alla ✨: det bästa av det bästa — sprickan är en risk som växer med tiden (main.js: crackChance)
  utopia:  { tag: '\u{2728}', name: 'UTOPI', speed: 3, cost: 0.7, indSpeed: 3, stingStart: 50, stingDays: 240, honeyFade: 0.35 },
  // alla 💀: revolutionerande — slår igenom på några dagar och drabbar mycket mer än sin lag
  brutal:  { tag: '\u{1F480}', name: 'REVOLUTIONERANDE', speed: 10, cost: 0.7, indSpeed: 30 },
};

// Hur starka ✨ och 💀 blir jämfört med lagens vanliga val (powerOf)
export const POWER = {
  target: 10,       // gånger ett typiskt vanligt val i samma lag
  vsBest: 2.5,      // gånger det starkaste vanliga valet (buffat) i samma lag
  min: 2.5, max: 12,
  cap: 220,         // största värdet per nationsvärde (vanliga val: CAP)
  brutalBad: 0.45,  // de brutala valens kostnader växer med kraften × detta (minst 1)
};
// Statistiken: '+' gånger fx, '*' upphöjt till exp, '~' drar starkare
export const FX_POWER = { fx: 5, exp: 4, pull: 2.5, lo: 0.01, hi: 12 };

// 💀 Spridning: det här drabbas också av ett brutalt val (bara det valet inte redan rör).
// Värdena är i en vanlig lags storlek — kraften skalar dem sedan.
const RIPPLE_ALL = { statepower: 4, freedom: -4, approval: -3, research: -2, unrest: 2 };
const RIPPLE_KIND = {
  migration: { integration: 4, manpower: -4, factory: -3, gdp: -2, safety: 2 },
  frihet: { stability: 3, ideopower: 3, corruption: 3, qol: -2, hdi: -1 },
  valfard: { income: 4, welfare: -4, qol: -3, hdi: -2 },
  skatt: { income: 5, qol: -3, gdp: -2 },
  ekonomi: { factory: 4, income: 3, welfare: -3, corruption: 3, qol: -2 },
  miljo: { factory: 4, income: 3, qol: -3, hdi: -2, safety: -1 },
  forsvar: { milpower: 5, readiness: 4, manpower: 3, income: -3, qol: -2 },
  trygghet: { safety: 4, stability: 2 },
};
const FX_RIPPLE_ALL = { tourists: ['*', 0.85], fdi: ['+', -1], voice: ['+', -0.1], trustgov: ['+', -3], protests: ['*', 1.3],
  emig: ['*', 1.25], researchers: ['*', 0.95], demo_civ: ['+', -0.3], stockcap: ['*', 0.92], airpax: ['*', 0.9] };
const FX_RIPPLE_KIND = {
  migration: { xenophobia: ['+', 3], hatecrime: ['*', 1.25], migemp: ['+', -2], labor: ['*', 0.97] },
  frihet: { demo_el: ['+', -0.3], trustparl: ['+', -3], turnout: ['+', -4], polstab: ['+', 0.05] },
  valfard: { poverty: ['*', 1.15], gini: ['+', 2], homeless: ['*', 1.2], life: ['+', -0.3] },
  skatt: { gdpgrowth: ['+', -0.4], gini: ['+', 1] },
  ekonomi: { gini: ['+', 2], strikes: ['*', 1.4] },
  miljo: { co2: ['*', 1.15], forest: ['+', -1] },
  forsvar: { milx: ['+', 0.8] },
  trygghet: { prisoners: ['*', 1.2], feelsafe: ['+', 2] },
};

// lag.val → nivå (alla ✨ och 💀 får 'utopia'/'brutal' automatiskt)
export const LAW_TUNE = {
  // buffa mycket
  'immigration.deportation': 'buff2',
  'government.totalitarian': 'buff2',
  'punishments.veryharsh': 'buff2',
  'death_penalty.majority': 'buff2',
  'press.propaganda': 'buff2',
  'elections.no': 'buff2',
  'popgrowth.mandatory': 'buff2',
  'economic_system.market': 'buff2',
  'economic_system.plain': 'buff2',
  'economic_system.liberal': 'buff2',
  'party_loyalty.onlyrep': 'buff2',
  'healthcare.fullyfree': 'buff2',
  'welfare.extreme': 'buff2',
  // buffa
  'government.authoritarian': 'buff',
  'press.highstate': 'buff',
  'press.state': 'buff',
  'elections.hybrid': 'buff',
  'government.hybrid': 'buff',
  'equality.traditional': 'buff',   // "patriarchy" — de traditionella könsrollerna
  // debuffa
  'press.laxed': 'debuff',
  'press.free': 'debuff',
  'welfare.independent': 'debuff',
  'taxes.t60': 'debuff',
  'immigration.relaxed': 'debuff',
  'immigration.humanitarian': 'debuff',
  // debuffa mycket
  'immigration.open': 'debuff2',
  'immigration.noborders': 'debuff2',
  'healthcare_quality.minimal': 'debuff2',
  'economic_system.communal': 'debuff2',
};

// ideologi eller ideologi.doktrin → nivå
export const IDEO_TUNE = {
  fascism: 'buff2',
  natsoc: 'buff2',
  socialdemocracy: 'buff2',
  'nationalism.ethno': 'buff2',
  communism: 'buff2',
  socialism: 'buff2',
  conservatism: 'buff',
  imperialism: 'debuff',
  anarchism: 'debuff2',
  greens: 'debuff2',
  'populism.left': 'debuff2',
  'nationalism.left': 'debuff2',
};

// Invandringen är varken bra eller dålig i sig — den är det valet gör (massutvisning
// ska fortfarande stänga gränsen), så den skalas aldrig.
const NEUTRAL = new Set(['immigration']);
const CAP = 60;

export function tuneMods(mods, t, cap = CAP) {
  const out = {};
  for (const [k, v] of Object.entries(mods || {})) {
    if (!v || NEUTRAL.has(k) || !STATS[k]) { out[k] = v; continue; }
    const good = STATS[k].inverted ? v < 0 : v > 0;
    // heltal som förut, men aldrig så att ett värde försvinner helt
    const n = Math.round(v * (good ? t.good : t.bad)) || Math.sign(v);
    out[k] = Math.max(-cap, Math.min(cap, n));
  }
  return out;
}

// summan av det som är bra (eller dåligt) för landet i ett vals nationsvärden
export function goodSum(mods, bad = false) {
  let g = 0;
  for (const [k, v] of Object.entries(mods || {})) {
    if (!v || NEUTRAL.has(k) || !STATS[k]) continue;
    const gd = STATS[k].inverted ? -v : v;
    if (bad ? gd < 0 : gd > 0) g += Math.abs(v);
  }
  return g;
}

function tierOfOption(cat, o) {
  const id = LAW_TUNE[`${cat}.${o.id}`];
  if (id) return id;
  if (o.utopia) return 'utopia';
  if (o.brutal) return 'brutal';
  return null;
}

// V5.20: kraften för lagens ✨/💀 — tio gånger ett typiskt vanligt val i lagen och minst
// två och en halv gånger det starkaste buffade valet, men aldrig under 2,5 eller över 12 gånger
// det som skrevs. Typiskt = medianen av de vanliga valens nytta (startläget räknas inte).
function powerOf(L, o, g0) {
  const plain = L.options.filter((x) => !x.utopia && !x.brutal && !x.default);
  const goods = plain.map((x) => goodSum(x.mods0 || x.mods)).filter((x) => x > 0).sort((a, b) => a - b);
  const med = goods.length ? goods[Math.floor(goods.length / 2)] : 12;
  const best = Math.max(0, ...plain.map((x) => goodSum(x.mods)));
  const want = Math.max(POWER.target * med, POWER.vsBest * best);
  return { F: Math.max(POWER.min, Math.min(POWER.max, want / Math.max(1, g0))), med };
}

// 💀 spridningen läggs till som om valet skrivits så
function withRipple(cat, mods) {
  const out = { ...mods };
  for (const src of [RIPPLE_ALL, RIPPLE_KIND[LAW_KIND[cat]] || {}]) {
    for (const [k, v] of Object.entries(src)) if (!(k in out)) out[k] = v;
  }
  return out;
}

// körs sist i laws.js, när alla val är inlagda
export function applyLawTuning(LAWS) {
  // först de vanliga valen (buffarna), sedan ✨/💀 som mäts mot dem
  for (const pass of [0, 1]) {
    for (const [cat, L] of Object.entries(LAWS)) {
      for (const o of L.options) {
        const tid = tierOfOption(cat, o);
        if (!tid || o.tune) continue;
        const ext = tid === 'utopia' || tid === 'brutal';
        if (ext !== (pass === 1)) continue;
        const t = TIERS[tid];
        o.mods0 = o.mods;
        if (!ext) {
          o.mods = tuneMods(o.mods, t);
          o.tune = { tier: tid, ...t };
          continue;
        }
        const base = tid === 'brutal' ? withRipple(cat, o.mods) : o.mods;
        const { F, med } = powerOf(L, o, goodSum(base));
        // ✨: lockelsen × kraften, stinget lika mycket (så sprickan svider i samma storlek);
        // 💀: vinsterna × kraften och kostnaderna växer också, men långsammare
        const bad = tid === 'brutal' ? Math.max(1, F * POWER.brutalBad) : 1;
        o.mods = tuneMods(base, { good: F, bad }, POWER.cap);
        if (tid === 'brutal') o.ripple = Object.keys(base).filter((k) => !(k in o.mods0));
        if (o.sting) { o.sting0 = o.sting; o.sting = tuneMods(o.sting, { good: F, bad: F }, POWER.cap); }
        // F = skalan på det som skrevs · power = gånger ett typiskt vanligt val i lagen (det spelaren ser)
        o.tune = { tier: tid, ...t, good: F, bad, F: Math.round(F * 10) / 10, power: Math.round(goodSum(o.mods) / med * 10) / 10 };
        if (t.stingStart) { o.stingStart = t.stingStart; o.stingDays = t.stingDays; o.honeyFade = t.honeyFade; }
      }
    }
  }
}

// körs sist i ideologies.js
export function applyIdeoTuning(IDEOLOGIES) {
  for (const [key, tid] of Object.entries(IDEO_TUNE)) {
    const [iid, did] = key.split('.');
    const ideo = IDEOLOGIES[iid];
    const obj = did ? ideo?.doctrines?.[did] : ideo;
    if (!obj || obj.tune) continue;
    const t = TIERS[tid];
    obj.mods0 = obj.mods;
    obj.mods = tuneMods(obj.mods, t);
    obj.tune = { tier: tid, ...t };
  }
}

// lagarnas statistikeffekter: '+' och '*' skalas åt det håll som är bra eller dåligt
// för måttet ('~', '=' och '%pop' sätter nivåer och lämnas som de är)
export function applyFxTuning(LAW_EFFECTS, LAWS, IND) {
  const r3 = (x) => Math.round(x * 1000) / 1000;
  for (const [cat, L] of Object.entries(LAWS)) {
    for (const o of L.options) {
      const t = o.tune;
      if (!t) continue;
      const ext = t.tier === 'utopia' || t.tier === 'brutal';
      let fx = LAW_EFFECTS[cat]?.[o.id];
      // V5.20: 💀 drabbar mycket mer än sin lag — måtten den inte redan rör läggs till
      if (t.tier === 'brutal') {
        fx = { ...(fx || {}) };
        for (const src of [FX_RIPPLE_ALL, FX_RIPPLE_KIND[LAW_KIND[cat]] || {}]) {
          for (const [id, arr] of Object.entries(src)) if (IND[id] && !(id in fx)) fx[id] = arr;
        }
      }
      if (!fx) continue;
      const out = {};
      for (const [id, arr] of Object.entries(fx)) {
        const better = IND[id]?.better;
        const [op, n, k] = arr;
        if (ext) {
          // ✨: det bra 5–20 gånger starkare, verkligheten (det dåliga) som den skrevs.
          // 💀: allt — åt båda hållen — slår mycket hårdare.
          if (op === '~') { out[id] = ['~', n, Math.min(1, (k ?? 0.6) * FX_POWER.pull)]; continue; }
          if (op !== '+' && op !== '*') { out[id] = arr; continue; }
          const up = op === '+' ? n > 0 : n > 1;
          const good = !better ? t.tier === 'brutal' : (better === 'high' ? up : !up);
          if (!good && t.tier === 'utopia') { out[id] = arr; continue; }
          out[id] = op === '+'
            ? ['+', r3(n * FX_POWER.fx)]
            : ['*', Math.max(FX_POWER.lo, Math.min(FX_POWER.hi, r3(Math.exp(Math.log(n) * FX_POWER.exp))))];
          continue;
        }
        if (!better || (op !== '+' && op !== '*')) { out[id] = arr; continue; }
        const up = op === '+' ? n > 0 : n > 1;
        const good = better === 'high' ? up : !up;
        const f = good ? t.good : t.bad;
        out[id] = op === '+'
          ? ['+', r3(n * f)]
          : ['*', Math.max(0.001, Math.min(20, r3(Math.exp(Math.log(n) * f))))];
      }
      (LAW_EFFECTS[cat] ||= {})[o.id] = out;
    }
  }
}

// ideologins takt och pris: doktrinens nivå om den har en, annars ideologins
export function ideoTune(IDEOLOGIES, ideology, doctrine) {
  const ideo = IDEOLOGIES[ideology];
  return (doctrine && ideo?.doctrines?.[doctrine]?.tune) || ideo?.tune || null;
}

// raden i förhandsrutan
const fx = (x) => String(x).replace('.', ',');
export function tuneNote(t, o = null) {
  if (!t) return '';
  // V5.20: ✨ och 💀 mäts mot lagens vanliga val
  if (t.tier === 'utopia' || t.tier === 'brutal') {
    const parts = [
      `${fx(t.power)} GÅNGER STARKARE ÄN LAGENS VANLIGA VAL`,
      t.tier === 'brutal' ? `SLÅR IGENOM PÅ NÅGRA DAGAR, STATISTIKEN ${t.indSpeed} GÅNGER FORTARE` : `SLÅR IGENOM ${fx(t.speed)} GÅNGER FORTARE`,
      t.cost < 1 ? `${Math.round((1 - t.cost) * 100)} % BILLIGARE` : '',
      t.tier === 'brutal' && o?.ripple?.length ? `DRABBAR OCKSÅ ${o.ripple.map((k) => (STATS[k]?.name || k).toUpperCase()).join(', ')}` : '',
    ].filter(Boolean);
    return `<span class="lawx ${t.tier === 'brutal' ? 'brutal' : 'utopia'}">${t.tag} ${t.name}: ${parts.join(' · ')}</span>`;
  }
  const buff = t.good >= 1;
  const parts = [
    t.good !== 1 ? `DET BRA \u{00D7}${fx(t.good)}` : '',
    t.bad !== 1 ? `DET DÅLIGA \u{00D7}${fx(t.bad)}` : '',
    t.speed > 1 ? `SLÅR IGENOM ${fx(t.speed)} GÅNGER FORTARE` : t.speed < 1 ? `SLÅR IGENOM ${fx(Math.round(10 / t.speed) / 10)} GÅNGER LÅNGSAMMARE` : '',
    t.cost < 1 ? `${Math.round((1 - t.cost) * 100)} % BILLIGARE` : t.cost > 1 ? `${Math.round((t.cost - 1) * 100)} % DYRARE` : '',
    t.stingStart ? 'SPRICKER SENARE OCH LÅNGSAMMARE' : '',
  ].filter(Boolean);
  return `<span class="lawx ${buff ? 'buff' : 'debuff'}">${t.tag} ${buff ? 'BUFFAD' : 'DEBUFFAD'} — ${t.name}: ${parts.join(' · ')}</span>`;
}
