// IMPERIUM V5.19 — BUFFAR OCH DEBUFFAR (Henrys önskemål).
// Ett lager ovanpå lagarna och ideologierna. Varje utpekat val får en nivå som skalar
//   1) nationsvärdena: det bra (good) och det dåliga (bad) var för sig,
//   2) statistikeffekterna: '+' och '*' åt rätt håll enligt måttets `better`,
//   3) hur fort valet slår igenom (speed, tickPolicyPhase i main.js),
//   4) vad det kostar i ⚖️ att anta (cost).
// Utopierna (✨) och de brutala valen (💀) får alla nivån sin egen, och utopiernas
// spricka kommer senare och långsammare. Källan för kontrollerna i check-laws.mjs är
// värdena som de skrevs (`mods0`), så att reglerna för ✨/💀 gäller datat och inte lagret.
import { STATS } from './stats.js';

export const TIERS = {
  buff2:   { tag: '\u{2191}\u{2191}', name: 'MYCKET STARKARE', good: 1.8, bad: 0.55, speed: 3, cost: 0.5 },
  buff:    { tag: '\u{2191}', name: 'STARKARE', good: 1.4, bad: 0.75, speed: 2, cost: 0.7 },
  debuff:  { tag: '\u{2193}', name: 'SVAGARE', good: 0.7, bad: 1.3, speed: 0.7, cost: 1.3 },
  debuff2: { tag: '\u{2193}\u{2193}', name: 'MYCKET SVAGARE', good: 0.45, bad: 1.6, speed: 0.5, cost: 1.6 },
  // alla ✨: lockelsen växer och sprickan kommer senare och långsammare (stinget är detsamma)
  utopia:  { tag: '\u{2191}', name: 'STARKARE UTOPI', good: 1.4, bad: 1, speed: 2, cost: 0.7, stingStart: 50, stingDays: 330, honeyFade: 0.35 },
  // alla 💀: vinsterna växer, kostnaderna krymper lite, omvärldens fördömande är detsamma
  brutal:  { tag: '\u{2191}', name: 'STARKARE BRUTALT', good: 1.4, bad: 0.9, speed: 2, cost: 0.7 },
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

export function tuneMods(mods, t) {
  const out = {};
  for (const [k, v] of Object.entries(mods || {})) {
    if (!v || NEUTRAL.has(k) || !STATS[k]) { out[k] = v; continue; }
    const good = STATS[k].inverted ? v < 0 : v > 0;
    // heltal som förut, men aldrig så att ett värde försvinner helt
    const n = Math.round(v * (good ? t.good : t.bad)) || Math.sign(v);
    out[k] = Math.max(-CAP, Math.min(CAP, n));
  }
  return out;
}

function tierOfOption(cat, o) {
  const id = LAW_TUNE[`${cat}.${o.id}`];
  if (id) return id;
  if (o.utopia) return 'utopia';
  if (o.brutal) return 'brutal';
  return null;
}

// körs sist i laws.js, när alla val är inlagda
export function applyLawTuning(LAWS) {
  for (const [cat, L] of Object.entries(LAWS)) {
    for (const o of L.options) {
      const tid = tierOfOption(cat, o);
      if (!tid || o.tune) continue;
      const t = TIERS[tid];
      o.mods0 = o.mods;
      o.mods = tuneMods(o.mods, t);
      o.tune = { tier: tid, ...t };
      if (t.stingStart) { o.stingStart = t.stingStart; o.stingDays = t.stingDays; o.honeyFade = t.honeyFade; }
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
  for (const [cat, L] of Object.entries(LAWS)) {
    for (const o of L.options) {
      const t = o.tune;
      const fx = t && LAW_EFFECTS[cat]?.[o.id];
      if (!fx) continue;
      const out = {};
      for (const [id, arr] of Object.entries(fx)) {
        const better = IND[id]?.better;
        const [op, n] = arr;
        if (!better || (op !== '+' && op !== '*')) { out[id] = arr; continue; }
        const up = op === '+' ? n > 0 : n > 1;
        const good = better === 'high' ? up : !up;
        const f = good ? t.good : t.bad;
        out[id] = op === '+'
          ? ['+', Math.round(n * f * 1000) / 1000]
          : ['*', Math.max(0.001, Math.min(20, Math.round(Math.exp(Math.log(n) * f) * 1000) / 1000))];
      }
      LAW_EFFECTS[cat][o.id] = out;
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
export function tuneNote(t) {
  if (!t) return '';
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
