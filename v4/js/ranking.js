// IMPERIUM V5 — VÄRLDSRANKNING. Varje land placeras som i verkligheten, efter
// militär styrka, ekonomi, yta, befolkning, stabilitet, livskvalitet och HDI.
import { econOf, WEALTH_TIER } from './economy.js';

export const RANK_WEIGHTS = {
  military: 0.24, economy: 0.22, size: 0.10, population: 0.14,
  stability: 0.10, qol: 0.10, hdi: 0.10,
};

// Delpoäng 0–100 för ett land. `extra` kan innehålla spelarens verkliga värden.
export function scoreCountry({ pop = 5e6, cid = '', areaRank = 0.3, army = 0, stats = null }) {
  const tier = WEALTH_TIER[cid] || 1;
  const econ = econOf(pop, cid);
  const clamp = (v) => Math.max(0, Math.min(100, v));
  const parts = {
    military: clamp(army * 4.5),
    economy: clamp(econ * 2.4),
    size: clamp(areaRank * 100),
    population: clamp((Math.log10(Math.max(1, pop)) - 5) * 26),
    stability: clamp(50 + (stats?.stability?.total ?? 0) * 0.5),
    qol: clamp(stats ? 50 + stats.qol.total * 0.5 : 30 + tier * 14),
    hdi: clamp(stats ? 50 + stats.hdi.total * 0.5 : 28 + tier * 15),
  };
  let total = 0;
  for (const [k, w] of Object.entries(RANK_WEIGHTS)) total += (parts[k] || 0) * w;
  return { total: Math.round(total * 10) / 10, parts };
}

export function medalFor(place) {
  return place === 1 ? '\u{1F947}' : place === 2 ? '\u{1F948}' : place === 3 ? '\u{1F949}' : '';
}
