// IMPERIUM V5.11 — LAGARNAS MAKT (Henrys önskemål): tre nya val i varje lag,
// fyra helt nya lagar, och starka statistikeffekter för VARJE alternativ.
// Innehållet ligger i laws511/part1–6.js (en del per lagområde) och läses av:
//   EXTRAS_511 → laws-extra.js (nya val, samma format som LAW_EXTRAS)
//   NEW_511    → laws-more.js  (nya lagar, samma format som NEW_LAWS)
//   FX_511     → statistics.js (läggs sist, så de ersätter äldre värden per mått)
import * as p1 from './laws511/part1.js';
import * as p2 from './laws511/part2.js';
import * as p3 from './laws511/part3.js';
import * as p4 from './laws511/part4.js';
import * as p5 from './laws511/part5.js';
import * as p6 from './laws511/part6.js';
import * as p7 from './laws511/part7.js';   // V5.13: fem nya lagar (skuldbroms, banker, vapenexport, patent, semester)
import * as p8 from './laws511/part8.js';   // V5.14: brott och rätt
import * as p9 from './laws511/part9.js';   // V5.14: ekonomi
import * as p10 from './laws511/part10.js'; // V5.14: natur och råvaror
import * as p11 from './laws511/part11.js'; // V5.14: samhälle
// V5.17 YTTERLIGHETER: ett ✨ utopiskt och ett 💀 brutalt val i varje lag (del 12–16)
// och åtta nya lagar (del 17). Valen bär `utopia`+`sting` eller `brutal`+`shame`.
import * as p12 from './laws511/part12.js';
import * as p13 from './laws511/part13.js';
import * as p14 from './laws511/part14.js';
import * as p15 from './laws511/part15.js';
import * as p16 from './laws511/part16.js';
import * as p17 from './laws511/part17.js';

export const EXTRAS_511 = {};
export const FX_511 = {};
export const NEW_511 = {};
for (const p of [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17]) {
  // samma lag kan få val från flera delar — listorna läggs efter varandra
  for (const [cat, list] of Object.entries(p.EXTRAS || {})) (EXTRAS_511[cat] ||= []).push(...list);
  Object.assign(NEW_511, p.NEW || {});
  for (const [cat, opts] of Object.entries(p.FX || {})) Object.assign((FX_511[cat] ||= {}), opts);
}
