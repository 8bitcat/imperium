// IMPERIUM V5.8 — VÄRLDSLÄGET: kalla krig, val och revolutioner.
//
// Världen ska inte bara vara krig. Stormakter som avskyr varandra ideologiskt
// hamnar i KALLT KRIG: spänningen stiger och sjunker med spionaffärer,
// kapprustning, rymdkapplöpning, ombudskrig och toppmöten — och bara sällan
// slår den över i öppet krig. Länder byter också ideologi och lagar lättare
// än förut: demokratier håller VAL där regeringen kan bytas, och där missnöjet
// är stort blir det REVOLUTION, som river upp lagarna på en gång.
//
// Modulen är ren logik. main.js skickar in ett api-objekt med världen och de
// funktioner som behövs för att visa, logga och verkställa det som händer.
import { IDEOLOGIES, ideologyDistance, preferredIndex } from './ideologies.js';
import { LAWS } from './laws.js';

export const COLD_WAR_GAP = 50;      // så ideologiskt främmande måste två makter vara
export const MAX_COLD_WARS = 5;      // fler än så samtidigt blir bara brus
export const COLD_WAR_END_GAP = 35;  // närmar sig ideologierna varandra tar det slut
export const REVOLUTION_MEMORY = 120; // dagar som räknas som "nyligen" (ett spelår)

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const clamp01 = (v) => clamp(v, 0, 1);
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function pickWeighted(list) {
  const total = list.reduce((a, x) => a + x.w, 0);
  let r = Math.random() * total;
  for (const x of list) { r -= x.w; if (r <= 0) return x; }
  return list[list.length - 1];
}

export function cwKey(a, b) { return a < b ? a + '|' + b : b + '|' + a; }
export function findColdWar(list, a, b) {
  const k = cwKey(a, b);
  return (list || []).find((c) => cwKey(c.a, c.b) === k) || null;
}
export function coldWarsOf(list, cid) { return (list || []).filter((c) => c.a === cid || c.b === cid); }
export function otherSide(cw, cid) { return cw.a === cid ? cw.b : cw.a; }

// Spänningen i ord — visas i VÄRLDSLÄGET
export function tensionLabel(t) {
  if (t >= 90) return 'RANDEN TILL KRIG';
  if (t >= 70) return 'ISKALLT';
  if (t >= 45) return 'FROSTIGT';
  if (t >= 20) return 'SVALT';
  return 'TÖVÄDER';
}

// ---------- incidenterna i ett kallt krig ----------
// d = hur mycket spänningen ändras. Kapprustning och rymdkapplöpning bygger
// faktiskt ut ländernas militär respektive rymdprogram.
export const CW_INCIDENTS = [
  { id: 'spion', w: 3, d: [6, 12], text: (A, B) => `\u{1F575}\u{FE0F} SPIONSKANDAL: ${A} AVSLÖJAR AGENTER FRÅN ${B}` },
  { id: 'kapprustning', w: 3, d: [4, 9], arms: true, text: (A, B) => `\u{1F680} KAPPRUSTNING: ${A} OCH ${B} BYGGER UT SINA ARSENALER` },
  { id: 'rymd', w: 2, d: [2, 6], space: true, text: (A, B) => `\u{1F6F0}\u{FE0F} RYMDKAPPLÖPNING: ${A} VILL FÖRE ${B} TILL MÅNEN` },
  { id: 'ombud', w: 2, d: [7, 14], proxy: true, text: (A, B, C) => `\u{1F4A3} OMBUDSKRIG: ${A} OCH ${B} STÖDJER VAR SIN SIDA I ${C}` },
  { id: 'embargo', w: 2, d: [5, 10], text: (A, B) => `\u{1F6AB} HANDELSEMBARGO: ${A} STOPPAR ALL HANDEL MED ${B}` },
  { id: 'propaganda', w: 2, d: [3, 7], text: (A, B) => `\u{1F4FB} PROPAGANDAKRIG: ${A} STÖR UT ${B}S RADIO` },
  { id: 'grans', w: 1, d: [10, 18], text: (A, B) => `\u{1F6A7} GRÄNSINCIDENT MELLAN ${A} OCH ${B}` },
  { id: 'avhopp', w: 2, d: [3, 8], text: (A, B) => `\u{1F3C3} AVHOPPARE: EN TOPPDIPLOMAT FRÅN ${B} FLYR TILL ${A}` },
  { id: 'ubåt', w: 1, d: [6, 12], text: (A, B) => `\u{1F6A2} UBÅTSJAKT: ${A}S UBÅT UPPTÄCKT VID ${B}S KUST` },
  { id: 'toppmote', w: 3, d: [-14, -6], text: (A, B) => `\u{1F91D} TOPPMÖTE: LEDARNA FÖR ${A} OCH ${B} SKAKAR HAND` },
  { id: 'nedrustning', w: 2, d: [-18, -8], text: (A, B) => `\u{1F54A}\u{FE0F} NEDRUSTNINGSAVTAL MELLAN ${A} OCH ${B}` },
  { id: 'hotline', w: 1, d: [-10, -4], text: (A, B) => `\u{260E}\u{FE0F} ${A} OCH ${B} ÖPPNAR EN HET LINJE FÖR ATT UNDVIKA MISSTAG` },
  { id: 'idrott', w: 1, d: [-8, -3], text: (A, B) => `\u{1F3D3} IDROTTSDIPLOMATI: LANDSLAG FRÅN ${A} BESÖKER ${B}` },
  { id: 'fangutbyte', w: 1, d: [-9, -4], text: (A, B) => `\u{1F309} FÅNGUTBYTE PÅ EN BRO MELLAN ${A} OCH ${B}` },
];

// ---------- revolutioner ----------
// Hur nära ett uppror står landet? 0..1 ur verkliga mått: politisk stabilitet
// väger tyngst, sedan ojämlikhet, arbetslöshet, inflation och kris i ekonomin.
export function revolutionRisk(base) {
  if (!base) return 0.15;
  const ps = base.polstab ?? 0;            // −2.5 … 2.5 (Världsbankens WGI)
  const gini = base.gini ?? 36;
  const un = base.unemp ?? 6;
  const inf = base.infl ?? 4;
  const gr = base.gdpgrowth ?? 2;
  return clamp01((0.6 - ps) / 3) * 0.55
    + clamp01((gini - 35) / 25) * 0.15
    + clamp01((un - 6) / 20) * 0.12
    + clamp01((inf - 8) / 40) * 0.10
    + clamp01(-gr / 6) * 0.08;
}

const DEMOCRATIC = ['democracy', 'liberalism', 'socialdemocracy', 'conservatism', 'greens', 'christdem', 'libertarianism', 'populism'];
const isDemocratic = (id) => DEMOCRATIC.includes(id);

function firstDoctrine(id) {
  return Object.keys(IDEOLOGIES[id]?.doctrines || {})[0] || null;
}

// Vad blir det av landet efter revolutionen? Diktaturer faller oftast för
// folkresningar som kräver demokrati — men ibland tar militären makten.
// Demokratier i kris drar åt populism, nationalism eller socialism, och
// ibland gör armén en kupp. Ett främmande lands ombud kan också styra utfallet.
export function revolutionOutcome(cur, base, push = null) {
  if (push && IDEOLOGIES[push] && push !== cur) return { ideology: push, kind: 'ombud' };
  const gini = base?.gini ?? 36;
  const un = base?.unemp ?? 6;
  let opts;
  if (!isDemocratic(cur)) {
    opts = [
      { id: 'democracy', w: 4, kind: 'folk' }, { id: 'liberalism', w: 2, kind: 'folk' },
      { id: 'socialdemocracy', w: 2, kind: 'folk' }, { id: 'christdem', w: 1, kind: 'folk' },
      { id: 'stratocracy', w: 2, kind: 'kupp' }, { id: 'nationalism', w: 1, kind: 'kupp' },
      { id: 'socialism', w: gini > 42 ? 2 : 1, kind: 'folk' }, { id: 'populism', w: 1, kind: 'folk' },
    ];
  } else {
    opts = [
      { id: 'populism', w: 3, kind: 'folk' },
      { id: 'nationalism', w: un > 9 ? 3 : 2, kind: 'folk' },
      { id: 'socialism', w: gini > 40 ? 3 : 1, kind: 'folk' },
      { id: 'communism', w: gini > 48 ? 2 : 0.5, kind: 'folk' },
      { id: 'stratocracy', w: 1.5, kind: 'kupp' },
      { id: 'technocracy', w: 1, kind: 'kupp' },
      { id: 'greens', w: 0.5, kind: 'folk' },
    ];
  }
  opts = opts.filter((o) => o.id !== cur && IDEOLOGIES[o.id]);
  const o = pickWeighted(opts);
  return { ideology: o.id, kind: o.kind };
}

// Hur ofta en rörelse vinner val — de stora folkrörelserna oftare än småpartierna
const ELECTORAL_WEIGHT = {
  socialdemocracy: 3, conservatism: 3, liberalism: 2.5, christdem: 2, democracy: 2,
  populism: 2, greens: 0.8, libertarianism: 0.6,
};

// Val i en demokrati: regeringen byts mot en närliggande rörelse
export function electionWinner(cur) {
  if (!isDemocratic(cur)) return null;
  const me = { ideology: cur, doctrine: firstDoctrine(cur) };
  const cands = DEMOCRATIC
    .filter((id) => id !== cur && IDEOLOGIES[id])
    .map((id) => ({ id, d: ideologyDistance(me, { ideology: id, doctrine: firstDoctrine(id) }) }))
    .filter((x) => x.d <= 45)
    .map((x) => ({ id: x.id, w: (50 - x.d) * (ELECTORAL_WEIGHT[x.id] || 1) }));
  return cands.length ? pickWeighted(cands).id : null;
}

// Flytta lagarna mot den nya ideologins önskeläge. steps = hur många steg varje
// lag får flytta, maxCats = hur många lagar som rivs upp på en gång.
export function reformLaws(nation, steps = 2, maxCats = 99) {
  const changes = [];
  const cats = Object.keys(LAWS).sort(() => Math.random() - 0.5);
  for (const cat of cats) {
    if (changes.length >= maxCats) break;
    const opts = LAWS[cat].options;
    const want = preferredIndex(nation, cat);
    if (want == null) continue;
    const found = opts.findIndex((o) => o.id === nation.laws?.[cat]);
    const cur = found >= 0 ? found : Math.max(0, opts.findIndex((o) => o.default));
    if (cur === want) continue;
    const next = cur + clamp(want - cur, -steps, steps);
    nation.laws[cat] = opts[next].id;
    changes.push({ cat, from: opts[cur].id, to: opts[next].id });
  }
  return changes;
}

// ---------- världens politiska tick ----------
// api: {
//   world, day, blocked:Set, playerHome, playerNation,
//   powers(): [{ id, power }]        — stormakterna, starkast först
//   ideoOf(cid), nationOf(cid)        — nationOf ger AI-landets { ideology, doctrine, laws } att ändra
//   base(cid)                         — verkliga mått (rå data)
//   candidates()                      — länder som kan få val/revolution (inte spelarens)
//   atWar(a, b)                       — har de ett varmt krig?
//   allied(a, b)
//   near(cid, n)                      — närmaste länder
//   arms(cid), space(cid)             — kapprustning / rymdsatsning
//   hotWar(att, target)               — kalla kriget slår över
//   regimeChanged(cid, from, to, kind, changes)
//   say(text, kind, ms), log(text, opts), name(cid)
// }
export function tickGeopolitics(api) {
  const w = api.world;
  w.coldWars ||= [];
  w.revolutions ||= [];
  tickColdWars(api);
  maybeStartColdWar(api);
  tickRegimes(api);
}

function involvesPlayer(api, cw) {
  return !!api.playerHome && (cw.a === api.playerHome || cw.b === api.playerHome);
}

function endColdWar(api, cw, why) {
  const w = api.world;
  w.coldWars = w.coldWars.filter((x) => x !== cw);
  const A = api.name(cw.a), B = api.name(cw.b);
  const text = `\u{2600}\u{FE0F} DET KALLA KRIGET MELLAN ${A} OCH ${B} ÄR ÖVER${why ? ' — ' + why : ''}`;
  api.say(text, 'amber', 8000);
  api.log(text, { mine: involvesPlayer(api, cw) });
}

function tickColdWars(api) {
  const w = api.world;
  for (const cw of [...w.coldWars]) {
    // länder som försvunnit (erövrats) kan inte föra kallt krig
    if (!api.exists(cw.a) || !api.exists(cw.b)) { w.coldWars = w.coldWars.filter((x) => x !== cw); continue; }
    if (api.atWar(cw.a, cw.b)) continue;   // redan varmt — väntar ut kriget
    const gap = ideologyDistance(api.ideoOf(cw.a), api.ideoOf(cw.b));
    if (gap < COLD_WAR_END_GAP) { endColdWar(api, cw, 'IDEOLOGIERNA HAR NÄRMAT SIG'); continue; }
    const A = api.name(cw.a), B = api.name(cw.b);
    const mine = involvesPlayer(api, cw);
    // en kris som byggts upp avgörs nu: oftast drar sig båda tillbaka
    if (cw.crisis) {
      cw.crisis = false;
      if (Math.random() < 0.18) {
        cw.tension = 70;
        const text = `\u{1F525} DET KALLA KRIGET BLIR VARMT: ${A} MOT ${B}!`;
        api.say(text, 'red', 10000);
        api.log(text, { war: true, mine });
        api.hotWar(cw);
        continue;
      }
      cw.tension = 58;
      const text = `\u{1F54A}\u{FE0F} KRISEN MELLAN ${A} OCH ${B} AVVÄRJS I SISTA STUND`;
      api.say(text, 'amber', 7000);
      api.log(text, { mine });
      continue;
    }
    // spänningen söker sig mot ett naturligt läge som avståndet bestämmer
    const natural = clamp(gap - 15, 15, 75);
    cw.tension += (natural - cw.tension) * 0.08;
    if (Math.random() < 0.4) {
      // hög spänning gör båda sidor mer benägna att söka avspänning
      const list = CW_INCIDENTS.map((x) => ({ ...x, w: x.w * (x.d[1] < 0 ? 0.6 + cw.tension / 60 : 1.4 - cw.tension / 160) }));
      const inc = pickWeighted(list);
      let C = '';
      if (inc.proxy) {
        const third = api.proxyTarget(cw);
        if (!third) continue;
        C = api.name(third);
        // ombudskriget kan störta regimen i landet där det utkämpas — men bara
        // i ett instabilt land vars regim verkligen skiljer sig från sponsorns
        const sponsor = Math.random() < 0.5 ? cw.a : cw.b;
        const unlike = ideologyDistance(api.ideoOf(third), api.ideoOf(sponsor)) >= 40;
        if (unlike && Math.random() < 0.15 + revolutionRisk(api.base(third)) * 0.6) {
          revolution(api, third, api.ideoOf(sponsor).ideology, sponsor);
        }
      }
      const [lo, hi] = inc.d;
      cw.tension = clamp(cw.tension + rnd(lo, hi), 0, 100);
      if (inc.arms) { api.arms(cw.a); api.arms(cw.b); }
      if (inc.space) { api.space(cw.a); api.space(cw.b); }
      const text = inc.text(A, B, C);
      cw.last = text;
      api.log(text, { mine, war: inc.d[0] > 8 });
      if (mine) api.say(text, inc.d[0] > 0 ? 'red' : 'amber', 6000);
      if (mine && api.relChange) api.relChange(otherSide(cw, api.playerHome), inc.d[0] > 0 ? -2 : 3);
    }
    if (cw.tension >= 95) {
      cw.crisis = true;
      const text = `\u{2622}\u{FE0F} KRIS MELLAN ${A} OCH ${B} — VÄRLDEN HÅLLER ANDAN`;
      api.say(text, 'red', 9000);
      api.log(text, { war: true, mine });
    }
    cw.calm = cw.tension <= 10 ? (cw.calm || 0) + 1 : 0;
    if (cw.calm >= 3) endColdWar(api, cw, 'TÖVÄDER');
  }
}

function maybeStartColdWar(api) {
  const w = api.world;
  if (w.coldWars.length >= MAX_COLD_WARS || Math.random() > 0.1) return;
  const powers = api.powers().slice(0, 16);
  const pairs = [];
  for (let i = 0; i < powers.length; i++) {
    for (let j = i + 1; j < powers.length; j++) {
      const a = powers[i].id, b = powers[j].id;
      if (findColdWar(w.coldWars, a, b) || api.atWar(a, b) || api.allied(a, b)) continue;
      if (coldWarsOf(w.coldWars, a).length >= 2 || coldWarsOf(w.coldWars, b).length >= 2) continue;
      const gap = ideologyDistance(api.ideoOf(a), api.ideoOf(b));
      if (gap < COLD_WAR_GAP) continue;
      // kalla krig mot dig blir lite vanligare än din storlek ensam motiverar
      const you = api.playerHome && (a === api.playerHome || b === api.playerHome) ? 3 : 1;
      pairs.push({ a, b, gap, w: (gap - COLD_WAR_GAP + 10) * Math.sqrt(powers[i].power * powers[j].power) * you });
    }
  }
  if (!pairs.length) return;
  const p = pickWeighted(pairs);
  const cw = { a: p.a, b: p.b, since: api.day, tension: rnd(35, 50), last: '' };
  w.coldWars.push(cw);
  const mine = involvesPlayer(api, cw);
  const text = mine
    ? `\u{2744}\u{FE0F} KALLT KRIG: ${api.name(otherSide(cw, api.playerHome))} SER DIG SOM SIN HUVUDFIENDE`
    : `\u{2744}\u{FE0F} KALLT KRIG BRYTER UT MELLAN ${api.name(p.a)} OCH ${api.name(p.b)}`;
  api.say(text, mine ? 'red' : '', mine ? 9000 : 6000);
  api.log(text, { mine });
}

// En revolution: ny ideologi och lagarna rivs upp på en gång
function revolution(api, cid, push = null, sponsor = null) {
  const n = api.nationOf(cid);
  if (!n) return false;
  const from = n.ideology;
  const out = revolutionOutcome(from, api.base(cid), push);
  if (!out || out.ideology === from) return false;
  n.ideology = out.ideology;
  n.doctrine = firstDoctrine(out.ideology);
  const changes = reformLaws(n, 3);
  api.world.revolutions.unshift({ cid, day: api.day, from, to: out.ideology, kind: out.kind, sponsor });
  if (api.world.revolutions.length > 40) api.world.revolutions.length = 40;
  api.regimeChanged(cid, from, out.ideology, out.kind, changes, sponsor);
  return true;
}

function tickRegimes(api) {
  const cands = api.candidates();
  if (!cands.length) return;
  for (let i = 0; i < 6; i++) {
    const cid = pick(cands);
    const n = api.nationOf(cid);
    if (!n) continue;
    // revolution: sällsynt, men mycket vanligare där missnöjet är stort
    if (Math.random() < 0.003 + revolutionRisk(api.base(cid)) * 0.03) {
      revolution(api, cid);
      continue;
    }
    // val: demokratier byter regering då och då
    if (isDemocratic(n.ideology) && Math.random() < 0.035) {
      const win = electionWinner(n.ideology);
      if (!win) continue;
      const from = n.ideology;
      n.ideology = win;
      n.doctrine = firstDoctrine(win);
      const changes = reformLaws(n, 1, 4);
      api.regimeChanged(cid, from, win, 'val', changes, null);
      continue;
    }
    // reformer: lagarna glider mot det regeringen vill
    if (Math.random() < 0.25) {
      const changes = reformLaws(n, 1, 2);
      if (changes.length) api.reformed(cid, changes);
    }
  }
}

// Revolutioner det senaste spelåret — läses av händelserna (c.worldRevolutions)
export function recentRevolutions(world, day) {
  return (world?.revolutions || []).filter((r) => day - r.day <= REVOLUTION_MEMORY).length;
}
