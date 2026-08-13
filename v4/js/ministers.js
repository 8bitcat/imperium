// IMPERIUM V5 — MINISTRAR. Varje post har en egen innehavare med egen ideologi.
// Krockar den med din leder det till oro; med hög partilojalitet, auktoritärt
// styre eller hårda pressregler blir ministrarna linjetrogna.
import { IDEOLOGIES, IDEOLOGY_TRACKS, trackOf } from './ideologies.js';

export const POSTS = {
  health: { name: 'SJUKVÅRDSMINISTER', icon: '\u{1FA7A}', mods: { qol: 6, hdi: 4 } },
  migration: { name: 'MIGRATIONSMINISTER', icon: '\u{1F6C2}', mods: { integration: 6, safety: 3 } },
  education: { name: 'UTBILDNINGSMINISTER', icon: '\u{1F393}', mods: { research: 6, hdi: 3 } },
  finance: { name: 'FINANSMINISTER', icon: '\u{1F4B0}', mods: { income: 7, gdp: 4 } },
  defence: { name: 'FÖRSVARSMINISTER', icon: '\u{1F396}\u{FE0F}', mods: { milpower: 7, readiness: 4 } },
};

export const MINISTER_COST = 40;    // political power för att tillsätta

const FIRST = ['Alva', 'Gustav', 'Elsa', 'Nils', 'Signe', 'Otto', 'Vera', 'Hugo', 'Maja', 'Folke',
  'Ines', 'Ragnar', 'Tyra', 'Sixten', 'Alma', 'Valdemar', 'Ester', 'Konrad'];
const LAST = ['Lindqvist', 'Berg', 'Ahlström', 'Wikner', 'Sandell', 'Rydberg', 'Hallgren',
  'Öberg', 'Falk', 'Norling', 'Ekdahl', 'Stjärna', 'Holm', 'Vinter'];

// Hur linjetrogen blir kabinettet? Auktoritärt styre ger ministrar med din egen linje.
export function loyaltyLevel(nation) {
  const loyal = nation?.laws?.partyloyalty;
  const gov = nation?.laws?.government;
  const press = nation?.laws?.press;
  let v = 0;
  if (['high', 'maximum', 'onlyrep'].includes(loyal)) v += 2;
  if (['authoritarian', 'totalitarianism'].includes(gov)) v += 2;
  if (['highstate', 'propaganda'].includes(press)) v += 1;
  return v;                      // 0 = fritt, 5 = helt linjetroget
}

// Slumpa fram en kandidat till en post
export function makeCandidate(nation, seedn = Math.random()) {
  const r = (n) => Math.floor((seedn * 9301 + n * 49297) % 233280 / 233280 * n * 7919) % n;
  const name = `${FIRST[r(FIRST.length)]} ${LAST[r(LAST.length)]}`;
  const loyalty = loyaltyLevel(nation);
  let ideo = nation?.ideology;
  if (loyalty < 4) {
    // fria system ger kandidater ur närliggande ideologier
    const t = trackOf(nation?.ideology);
    const pool = t ? IDEOLOGY_TRACKS[t.track].ids : Object.keys(IDEOLOGIES);
    const near = pool.filter((x) => x !== nation?.ideology);
    if (near.length && Math.random() < (loyalty >= 2 ? 0.35 : 0.7)) {
      ideo = near[Math.floor(Math.random() * near.length)];
    }
  }
  return { n: name, ideo };
}

// Krockar ministern med regeringens linje?
export function clashOf(nation, minister) {
  if (!minister || minister.ideo === nation?.ideology) return 0;
  const a = trackOf(nation?.ideology), b = trackOf(minister.ideo);
  if (!a || !b) return 1;
  return a.track === b.track ? Math.abs(a.step - b.step) : 3;
}

// Samlade effekter av kabinettet
export function cabinetMods(nation) {
  const out = {};
  const add = (k, v) => { out[k] = (out[k] || 0) + v; };
  for (const [post, m] of Object.entries(nation?.cabinet || {})) {
    const def = POSTS[post];
    if (!def || !m) continue;
    const clash = clashOf(nation, m);
    const eff = clash === 0 ? 1 : clash === 1 ? 0.75 : clash === 2 ? 0.4 : 0;
    for (const [k, v] of Object.entries(def.mods)) add(k, Math.round(v * eff));
    if (clash >= 2) add('unrest', clash * 2);      // en minister på tvärs skapar oro
  }
  return out;
}
