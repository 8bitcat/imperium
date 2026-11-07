// Kontrollerar händelsefiler (v4/js/events/*.js och v4/js/events.js).
//   node tools/check-events.mjs                  alla filer
//   node tools/check-events.mjs v4/js/events/x.js   en fil (dubbletter kollas ändå mot alla)
// Slutkod 0 = inga fel. Varningar stoppar inte men ska läsas.
//
// En händelse måste:
//  - ha unikt id (a-z0-9_), titel i VERSALER (≤ 40 tecken), brödtext 40–420 tecken
//  - ha ett when-villkor som aldrig kraschar och som slår till i 0,5–60 % av
//    slumpade lägen (400 lägen byggda på riktiga länders statistik)
//  - ha 2–5 val, val-texten i VERSALER, minst ETT val utan kostnad (annars kan
//    spelaren fastna) och varje val minst en effekt
//  - bara använda nationsvärden, lagar, modifierare, forskningsgrenar och
//    statistikmått som finns (felstavningar fångas här)
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const JS = join(ROOT, 'v4/js');
const imp = (p) => import(pathToFileURL(p).href);
const { STATS } = await imp(join(JS, 'stats.js'));
const { LAWS } = await imp(join(JS, 'laws.js'));
const { MODIFIERS } = await imp(join(JS, 'modifiers.js'));
const { IDEOLOGIES } = await imp(join(JS, 'ideologies.js'));
const { RESEARCH } = await imp(join(JS, 'research.js'));
const S = await imp(join(JS, 'statistics.js'));
const R = await imp(join(JS, 'realism.js'));   // V5.16
S.setIndicatorData(JSON.parse(readFileSync(join(ROOT, 'v4/data/indicators.json'), 'utf8')),
  JSON.parse(readFileSync(join(ROOT, 'v4/data/facts.json'), 'utf8')));

const STAT_IDS = Object.keys(STATS);
// V5.16: de nya måtten — rimliga värden om statistics.js ännu inte räknar dem
const FAKE_516 = { demo: [0.5, 9.8], regime: [0, 3], demo_el: [0, 10], demo_gov: [0, 10], demo_part: [1, 10], demo_cult: [1, 10],
  demo_civ: [0.5, 10], turnout: [35, 90], trustgov: [8, 80], trustparl: [8, 75], trustcourt: [10, 85], griev: [0, 100],
  protests: [0, 3000], strikes: [0, 400], polprisoners: [0, 5000], parties: [1, 12], unionrate: [2, 70],
  treasury: [-2e11, 5e11], budgetbal: [-12, 5], deficitusd: [-2e11, 5e10], revenue: [8, 55], debtusd: [0, 5e12], debtpc: [0, 1e5],
  rating: [0, 8], bondrate: [0.5, 25], interestusd: [0, 2e11], pensionx: [1, 15], socialx: [2, 25], corptax: [0, 40],
  incometax: [0, 60], vat: [0, 27], immig: [1e3, 1.5e6], emig: [1e3, 1e6], asylum: [0, 3e5],
  newcitizens: [0, 8e5], migemp: [30, 80], integ: [10, 90], segreg: [10, 80], exclusion: [0, 15], xenophobia: [5, 60],
  secondgen: [0, 30], migstock: [1e4, 5e7], medinc: [500, 60000], wage: [100, 7000], minwage: [0, 3500], houseprice: [3, 15],
  rentshare: [15, 50], homeless: [1e3, 2e6], housingshort: [0, 2e6], foodprice: [80, 220], fuelprice: [0.2, 2.5], elprice: [0.04, 0.5],
  hhdebt: [10, 220], retireage: [50, 72], workweek: [30, 52], vacationdays: [0, 40], parentalweeks: [0, 70], cars: [10, 850],
  commute: [15, 90], carewait: [5, 200], sickleave: [1, 10], mentalill: [5, 25], suicide: [1, 30], govhealth: [0.5, 10],
  pisa: [330, 560], learnpov: [3, 95], tertfem: [2, 130],
  depositrate: [0, 15], firmbribe: [0, 50], femown: [5, 60], fossilelec: [0, 100], gaselec: [0, 100],
  poverty365: [0, 80], poverty685: [0, 95], natpov: [3, 70] };
const IND_IDS = new Set([...S.INDICATORS.map((d) => d.id), ...Object.keys(FAKE_516)]);
const RES_KEYS = new Set(['money', 'pp', 'rp', 'man']);
const CHOICE_KEYS = new Set(['text', 'tip', 'cost', 'res', 'temp', 'perm', 'mod', 'unmod', 'rel', 'law', 'risk', 'next', 'undo', 'griev', 'ind', 'kanal', 'nykanal', 'fortroende']);   // V5.20: + medierna
const EVENT_KEYS = new Set(['id', 'icon', 'weight', 'cooldown', 'title', 'text', 'when', 'choices', 'rare', 'chain', 'kind', 'react']);
// V5.15: utfallen i ett chansval (risk.win / risk.lose)
const OUTCOME_KEYS = new Set(['text', 'res', 'temp', 'perm', 'mod', 'unmod', 'rel', 'law', 'undo', 'griev', 'ind', 'kanal', 'nykanal', 'fortroende']);   // V5.16: + undo/griev/ind
const EFFECT_KEYS = ['res', 'temp', 'perm', 'mod', 'unmod', 'rel', 'law', 'undo', 'griev', 'ind', 'kanal', 'nykanal', 'fortroende'];
const PLACEHOLDERS = new Set(['rike', 'granne', 'land', 'stad', 'huvudstad', 'lag', 'utopi', 'utopilag', 'brutal', 'brutallag', 'kanal', 'ps']);   // V5.20: + kanal/ps   // V5.17: + utopi/brutal
const nextRefs = [];   // [var, id] — kontrolleras när alla filer är lästa
const CAPS = { money: 2500, pp: 60, rp: 150, man: 25 };

// ---------- slumpade lägen ----------
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const countries = Object.keys(JSON.parse(readFileSync(join(ROOT, 'v4/data/indicators.json'), 'utf8')));
const unknown = new Set();
function strictProxy(obj, kind, allowed) {
  return new Proxy(obj, {
    get(t, k) {
      if (typeof k === 'string' && !allowed.has(k) && k !== 'toJSON' && k !== 'then') unknown.add(`${kind}.${k}`);
      return t[k];
    },
  });
}
function sampleCtx(emptyInd = false) {
  const st = {};
  for (const id of STAT_IDS) st[id] = Math.round(rnd(-60, 60) * (Math.random() < 0.3 ? 0.3 : 1));
  const laws = {};
  for (const [cat, L] of Object.entries(LAWS)) laws[cat] = Math.random() < 0.45 ? (L.options.find((o) => o.default) || L.options[0]).id : pick(L.options).id;
  const ideo = pick(Object.keys(IDEOLOGIES));
  const docs = Object.keys(IDEOLOGIES[ideo].doctrines || {});
  const research = {};
  for (const b of Object.keys(RESEARCH)) research[b] = Math.floor(rnd(0, 7));
  const cid = pick(countries);
  const indRaw = emptyInd ? {} : (S.realmIndicators([{ cid }], {}) || {});
  if (!emptyInd) for (const [k, [lo, hi]] of Object.entries(FAKE_516)) if (!Number.isFinite(indRaw[k])) indRaw[k] = rnd(lo, hi);
  // V5.16: missnöje, lagändringar, statskassa, bank, invandring, demokrati
  const griev = {};
  for (const k of R.GRIEV_IDS) griev[k] = Math.random() < 0.55 ? 0 : Math.round(rnd(0, 70) * Math.random());
  const lawCheck = (name, cats) => {
    for (const cat of cats) if (!LAWS[cat]) unknown.add('c.' + name + "('" + cat + "')");
    if (!cats.length) unknown.add('c.' + name + '() utan lag');
  };
  const money = Math.floor(rnd(-1500, 4000));
  const rIdx = Math.min(8, Math.floor(Math.random() ** 1.6 * 9));
  return {
    st: strictProxy(st, 'c.st', new Set(STAT_IDS)),
    day: Math.floor(rnd(1, 2500)),
    money, pp: Math.floor(rnd(0, 400)), rp: Math.floor(rnd(0, 500)), man: Math.floor(rnd(0, 200)),
    ideo, doc: docs.length ? pick(docs) : null,
    harmony: Math.random(),
    law: (cat) => { if (!LAWS[cat]) unknown.add(`c.law('${cat}')`); return laws[cat]; },
    is: (cat, ...ids) => {
      if (!LAWS[cat]) unknown.add(`c.is('${cat}')`);
      else for (const id of ids) if (!LAWS[cat].options.some((o) => o.id === id)) unknown.add(`c.is('${cat}', '${id}')`);
      return ids.includes(laws[cat]);
    },
    atWar: Math.random() < 0.25, wars: Math.floor(rnd(0, 3)),
    coldWar: Math.random() < 0.2, worldRevolutions: Math.floor(rnd(0, 4)),   // V5.8
    claims: Math.floor(rnd(1, 15)), puppets: Math.floor(rnd(0, 3)), allies: Math.floor(rnd(0, 3)),
    res: (b) => { if (!RESEARCH[b]) unknown.add(`c.res('${b}')`); return research[b] || 0; },
    mod: (id) => { if (!MODIFIERS[id]) unknown.add(`c.mod('${id}')`); return Math.random() < 0.15; },
    ind: strictProxy(indRaw, 'c.ind', IND_IDS),
    griev: Math.min(100, Object.values(griev).reduce((a, b) => a + b, 0)),
    grievOf: (k) => { if (!R.GRIEV_KINDS[k]) unknown.add("c.grievOf('" + k + "')"); return griev[k] || 0; },
    cut: (...cats) => { lawCheck('cut', cats); return Math.random() < 0.15; },
    raised: (...cats) => { lawCheck('raised', cats); return Math.random() < 0.12; },
    changed: (...cats) => { lawCheck('changed', cats); return Math.random() < 0.2; },
    deficit: money < 0, spend: Math.max(0, money + 2000),
    debt: Math.round(rnd(5, 220)), rating: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'D'][rIdx], ratingIdx: rIdx,
    migRate: Math.random() < 0.5 ? rnd(-0.5, 0.8) : rnd(0, 4) * Math.random(),
    demo: Number.isFinite(indRaw.demo) ? indRaw.demo : rnd(0.5, 9.8),
    trend: (id) => { if (!IND_IDS.has(id)) unknown.add("c.trend('" + id + "')"); return (Math.random() - 0.5) * 2 * Math.abs(indRaw[id] || 1) * 0.08; },
    // V5.17 YTTERLIGHETER
    ...(() => {
      const u = Math.random() < 0.3 ? Math.ceil(rnd(0, 3)) : 0, b = Math.random() < 0.3 ? Math.ceil(rnd(0, 3)) : 0;
      return { utopias: u, utopiaCrack: u ? Math.min(1, Math.random() * 1.2) : 0, utopiaAge: u ? Math.floor(rnd(0, 500)) : 0,
        brutals: b, brutalAge: b ? Math.floor(rnd(0, 400)) : 0, shame: b ? Math.round(rnd(4, 20) * b) : 0 };
    })(),
    // V5.18 LAG OCH ORDNING: hur mycket brottsligheten ändrats sedan start (1 = som förut)
    crimeRise: Math.random() < 0.5 ? rnd(0.85, 1.1) : rnd(0.6, 1.8),
    // V5.20 MEDIERNA
    media: (() => {
      const ctl = Math.floor(rnd(0, 4)), bud = Math.floor(rnd(0, 5)), n = Math.floor(rnd(0, 9));
      const crit = n ? Math.round(rnd(0, 70) * Math.random()) : 0, fr = n ? Math.round(rnd(0, 80) * Math.random()) : 0;
      return strictProxy({
        ps: strictProxy({ budget: bud, control: ctl, reach: bud ? Math.round(rnd(15, 95)) : 0, trust: Math.round(rnd(10, 90)) }, 'c.media.ps', new Set(['budget', 'control', 'reach', 'trust'])),
        channels: n, critical: crit, friendly: fr, stateShare: Math.round(rnd(0, 100)),
        censored: Math.random() < 0.2 ? Math.floor(rnd(1, 4)) : 0, banned: Math.random() < 0.15 ? Math.floor(rnd(1, 5)) : 0,
        trust: Math.round(rnd(10, 85)), climate: Math.round(rnd(-80, 80)), pressLevel: Math.floor(rnd(0, 5)),
      }, 'c.media', new Set(['ps', 'channels', 'critical', 'friendly', 'stateShare', 'censored', 'banned', 'trust', 'climate', 'pressLevel']));
    })(),
  };
}
const SAMPLES = Array.from({ length: 400 }, () => sampleCtx());
const EMPTY_IND = Array.from({ length: 40 }, () => sampleCtx(true));

// ---------- effekter (ett val eller ett chansutfall) ----------
function effects(c, P, E) {
  for (const grp of ['temp', 'perm']) {
    for (const [k, v] of Object.entries(c[grp] || {})) {
      if (!STATS[k]) E(`${P}: ${grp}.${k} är inget nationsvärde`);
      else if (!Number.isInteger(v) || Math.abs(v) > (grp === 'perm' ? 20 : 30) || v === 0) E(`${P}: ${grp}.${k} = ${v} (heltal, ±${grp === 'perm' ? 20 : 30})`);
    }
  }
  if (c.mod != null && !MODIFIERS[c.mod]) E(`${P}: modifieraren "${c.mod}" finns inte`);
  if (c.unmod != null && !MODIFIERS[c.unmod]) E(`${P}: modifieraren "${c.unmod}" finns inte`);
  if (c.rel != null && (!Number.isInteger(c.rel) || Math.abs(c.rel) > 30)) E(`${P}: rel heltal ±30`);
  if (c.law != null) {
    const [cat, opt] = Array.isArray(c.law) ? c.law : [];
    if (!LAWS[cat]?.options.some((o) => o.id === opt)) E(`${P}: law ['${cat}', '${opt}'] finns inte`);
  }
  // V5.16
  if (c.undo != null && c.undo !== true && c.undo !== 'utopi' && c.undo !== 'brutal' && !LAWS[c.undo]) E(P + ": undo = true, 'utopi', 'brutal' eller en lagkategori");
  if (c.griev != null && (!Number.isInteger(c.griev) || !c.griev || Math.abs(c.griev) > 40)) E(P + ': griev heltal ±40 (inte 0)');
  // V5.20 MEDIERNA
  if (c.kanal != null && !['stang', 'censur', 'stod', 'fri', 'kop'].includes(c.kanal)) E(P + ": kanal = 'stang' | 'censur' | 'stod' | 'fri' | 'kop'");
  if (c.nykanal != null && c.nykanal !== true) E(P + ': nykanal = true eller utelämnas');
  if (c.fortroende != null && (!Number.isInteger(c.fortroende) || !c.fortroende || Math.abs(c.fortroende) > 20)) E(P + ': fortroende heltal ±20 (inte 0)');
  if (c.ind != null) {
    if (typeof c.ind !== 'object' || !Object.keys(c.ind).length) E(P + ': ind = { mått: tal }');
    for (const [k, v] of Object.entries(c.ind || {})) {
      const sh = R.SHOCKS[k];
      if (!sh) E(P + ': ind.' + k + ' går inte att chocka (finns: ' + Object.keys(R.SHOCKS).join(' ') + ')');
      else if (!Number.isFinite(v) || !v || Math.abs(v) > sh.max) E(P + ': ind.' + k + ' = ' + v + ' (högst ±' + sh.max + ' ' + sh.unit + ')');
    }
  }
}

// ---------- kontroll av en händelse ----------
function checkEvent(ev, where) {
  const err = [], warn = [];
  const E = (m) => err.push(`${where} ${ev?.id || '?'}: ${m}`);
  const W = (m) => warn.push(`${where} ${ev?.id || '?'}: ${m}`);
  if (!ev || typeof ev !== 'object') { E('inte ett objekt'); return { err, warn }; }
  for (const k of Object.keys(ev)) if (!EVENT_KEYS.has(k)) E(`okänt fält "${k}"`);
  if (!/^[a-z0-9_]+$/.test(ev.id || '')) E('id måste vara a-z0-9_');
  if (!ev.icon || typeof ev.icon !== 'string') E('icon saknas');
  if (ev.weight != null && ![1, 2, 3].includes(ev.weight)) E('weight måste vara 1, 2 eller 3');
  if (ev.cooldown != null && (ev.cooldown < 200 || ev.cooldown > 1500)) E('cooldown 200–1500');
  if (typeof ev.title !== 'string' || ev.title !== ev.title.toUpperCase() || ev.title.length < 3 || ev.title.length > 40) E('titel: VERSALER, 3–40 tecken');
  if (typeof ev.text !== 'string' || ev.text.length < 40 || ev.text.length > 420) E(`text 40–420 tecken (har ${ev.text?.length})`);
  else if (ev.text === ev.text.toUpperCase()) E('texten ska vara vanlig skrift, inte versaler');
  if (/\bundefined\b|\bNaN\b/.test(JSON.stringify(ev))) E('innehåller undefined/NaN');
  for (const m of JSON.stringify(ev).matchAll(/\{(\w*)\}/g)) if (!PLACEHOLDERS.has(m[1].toLowerCase()) || (m[1] !== m[1].toLowerCase() && m[1] !== m[1].toUpperCase())) E(`okänd platshållare {${m[1]}} (finns: ${[...PLACEHOLDERS].join(', ')})`);
  if (ev.rare != null && ev.rare !== true) E('rare ska vara true eller utelämnas');
  if (ev.react != null && ev.react !== true) E('react ska vara true eller utelämnas');
  if (ev.kind != null && !R.GRIEV_KINDS[ev.kind]) E('kind "' + ev.kind + '" finns inte (' + R.GRIEV_IDS.join(', ') + ')');
  // {lag} och undo: true betyder "lagen som just ändrats" — då måste villkoret fråga efter en ändring
  const undoTrue = (o) => o?.undo === true;
  const usesLag = /\{lag\}/i.test(JSON.stringify(ev)) || (ev.choices || []).some((c) => undoTrue(c) || undoTrue(c.risk?.win) || undoTrue(c.risk?.lose));
  if (usesLag && !ev.chain && !/c\.(cut|raised|changed)\(/.test(String(ev.when))) E('{lag} / undo: true kräver att when frågar c.cut(…), c.raised(…) eller c.changed(…)');
  // V5.17: {utopi}/undo: 'utopi' kräver en utopi, {brutal}/undo: 'brutal' en brutal lag
  for (const [kind, field] of [['utopi', 'utopias'], ['brutal', 'brutals']]) {
    const und = (o) => o?.undo === kind;
    const uses = new RegExp('\\{' + kind + '(lag)?\\}', 'i').test(JSON.stringify(ev))
      || (ev.choices || []).some((c) => und(c) || und(c.risk?.win) || und(c.risk?.lose));
    if (uses && !ev.chain && !new RegExp('c\\.' + field + '\\b').test(String(ev.when))) E(`{${kind}} / undo: '${kind}' kräver att when frågar c.${field}`);
  }
  // V5.20: {kanal} och kanal: '…' gäller en kanal som finns — villkoret måste fråga c.media.channels
  const usesKanal = /{kanal}/i.test(JSON.stringify(ev)) || (ev.choices || []).some((c) => c.kanal || c.risk?.win?.kanal || c.risk?.lose?.kanal);
  if (usesKanal && !ev.chain && !/c.media.channels/.test(String(ev.when))) E('{kanal} / kanal: kräver att when frågar c.media.channels (t.ex. c.media.channels >= 1)');
  if (ev.chain != null && ev.chain !== true) E('chain ska vara true eller utelämnas');
  // villkoret (en kedjehändelse lottas aldrig — den behöver inget villkor)
  if (ev.chain) {
    if (ev.when != null) E('en kedjehändelse (chain: true) ska inte ha when — den kommer bara via next');
    if (ev.weight != null || ev.rare) E('en kedjehändelse ska inte ha weight/rare');
  } else if (typeof ev.when !== 'function') E('when saknas');
  else {
    unknown.clear();
    let hits = 0, crash = null;
    for (const c of SAMPLES) { try { if (ev.when(c)) hits++; } catch (e) { crash ||= e.message; } }
    for (const c of EMPTY_IND) { try { ev.when(c); } catch (e) { crash ||= `tom c.ind: ${e.message}`; } }
    if (crash) E(`when kraschar: ${crash}`);
    for (const u of unknown) E(`okänt namn i when: ${u}`);
    const pct = (hits / SAMPLES.length) * 100;
    if (pct === 0) E('when slår aldrig till (0 % av lägena)');
    else if (pct < 0.5 && !ev.rare) W(`when slår nästan aldrig till (${pct.toFixed(1)} %)`);
    else if (pct > 60) E(`when slår till nästan alltid (${pct.toFixed(0)} %) — snäva in villkoret`);
  }
  // valen
  const ch = ev.choices;
  if (!Array.isArray(ch) || ch.length < 2 || ch.length > 5) { E('2–5 val krävs'); return { err, warn }; }
  let free = 0;
  ch.forEach((c, i) => {
    const P = `val ${i + 1}`;
    for (const k of Object.keys(c)) if (!CHOICE_KEYS.has(k)) E(`${P}: okänt fält "${k}"`);
    if (typeof c.text !== 'string' || c.text !== c.text.toUpperCase() || c.text.length < 3 || c.text.length > 70) E(`${P}: text i VERSALER, 3–70 tecken`);
    if (c.tip != null && (typeof c.tip !== 'string' || c.tip.length > 100)) E(`${P}: tip ≤ 100 tecken`);
    for (const [grp, src] of [['cost', c.cost], ['res', c.res], ['risk.win.res', c.risk?.win?.res], ['risk.lose.res', c.risk?.lose?.res]]) {
      for (const [k, v] of Object.entries(src || {})) {
        if (!RES_KEYS.has(k)) E(`${P}: ${grp}.${k} finns inte (money/pp/rp/man)`);
        else if (!(v > 0) || v > CAPS[k]) E(`${P}: ${grp}.${k} = ${v} (1–${CAPS[k]})`);
      }
    }
    effects(c, P, E);
    // V5.15: chansval — utfallet lottas när man väljer
    if (c.risk != null) {
      const r = c.risk;
      if (typeof r !== 'object' || !(r.chance >= 0.1 && r.chance <= 0.9)) E(`${P}: risk.chance 0.1–0.9`);
      for (const side of ['win', 'lose']) {
        const o = r?.[side];
        if (!o || typeof o !== 'object') { E(`${P}: risk.${side} saknas`); continue; }
        for (const k of Object.keys(o)) if (!OUTCOME_KEYS.has(k)) E(`${P}: risk.${side}: okänt fält "${k}" (cost går inte i ett utfall)`);
        if (typeof o.text !== 'string' || o.text.length < 10 || o.text.length > 120) E(`${P}: risk.${side}.text 10–120 tecken`);
        else if (o.text === o.text.toUpperCase()) E(`${P}: risk.${side}.text ska vara vanlig skrift`);
        effects(o, `${P} risk.${side}`, E);
        if (!EFFECT_KEYS.some((k) => o[k] != null)) E(`${P}: risk.${side} gör ingenting`);
      }
      for (const k of Object.keys(r || {})) if (!['chance', 'win', 'lose'].includes(k)) E(`${P}: risk: okänt fält "${k}"`);
    }
    if (c.next != null) {
      const list = Array.isArray(c.next) ? c.next : [c.next];
      if (!list.length || list.some((x) => x !== null && typeof x !== 'string')) E(`${P}: next = 'id' eller ['id', null, …]`);
      for (const id of list) if (id) nextRefs.push([`${where} ${ev.id} ${P}`, id]);
    }
    const isFree = !c.cost || Object.values(c.cost).every((v) => !v);
    if (isFree) free++;
    const hasEffect = ['cost', 'risk', 'next', ...EFFECT_KEYS].some((k) => c[k] != null && (typeof c[k] !== 'object' || Array.isArray(c[k]) || Object.keys(c[k]).length));
    if (!hasEffect) E(`${P}: valet gör ingenting`);
  });
  if (!free) E('inget val är gratis — spelaren kan fastna');
  return { err, warn };
}

// ---------- vilka filer ----------
const dir = join(JS, 'events');
let themeFiles = [];
try { themeFiles = readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => join(dir, f)); } catch { /* ingen mapp än */ }
// de ursprungliga 87 händelserna (events.js) läses bara för dubblettkollen —
// med --alla granskas även de
const args = process.argv.slice(2);
const all = args.includes('--alla');
const only = args.find((a) => !a.startsWith('--')) ? resolve(args.find((a) => !a.startsWith('--'))) : null;
const files = [join(JS, 'events.js'), ...themeFiles];
const seen = new Map();
let errors = 0, warnings = 0, total = 0;
for (const f of files) {
  let list;
  try {
    const m = await imp(f);
    list = f.endsWith('events.js') && !f.includes('events\\') && !f.includes('events/') ? m.BASE_EVENTS || m.EVENTS : m.EVENTS;
  } catch (e) {
    // en ANNAN fil som håller på att skrivas räknas inte mot den som kontrolleras
    if (!only || resolve(f) === only) { console.log(`✗ ${f}: kan inte läsas: ${e.message.split('\n')[0]}`); errors++; }
    continue;
  }
  if (!Array.isArray(list)) { console.log(`✗ ${f}: exporterar ingen EVENTS-lista`); errors++; continue; }
  const short = f.replace(ROOT, '').replace(/\\/g, '/');
  const isBase = resolve(f) === resolve(join(JS, 'events.js'));
  const report = only ? resolve(f) === only : (!isBase || all);
  let fe = 0, fw = 0;
  for (const ev of list) {
    if (seen.has(ev.id)) { if (report) console.log(`✗ ${short} ${ev.id}: id finns redan i ${seen.get(ev.id)}`); fe++; }
    seen.set(ev.id, short);
    if (!report) continue;
    const { err, warn } = checkEvent(ev, short);
    err.forEach((m) => console.log('✗ ' + m));
    warn.forEach((m) => console.log('! ' + m));
    fe += err.length; fw += warn.length;
  }
  if (report) console.log(`${fe ? '✗' : '✓'} ${short}: ${list.length} händelser, ${fe} fel, ${fw} varningar`);
  if (report) { errors += fe; warnings += fw; total += list.length; }
}
// V5.15: följdhändelser måste finnas, och en kedjehändelse måste nås av något val
const allEv = new Map();
for (const f of files) { try { const m = await imp(f); for (const e of (m.EVENTS || [])) allEv.set(e.id, e); } catch { /* redan rapporterat */ } }
const reached = new Set();
for (const [w, id] of nextRefs) {
  if (!seen.has(id)) { console.log(`✗ ${w}: next '${id}' finns inte`); errors++; }
  else if (!allEv.get(id)?.chain) { console.log(`! ${w}: next '${id}' är ingen kedjehändelse (chain: true) — den kan också lottas fram av sig själv`); warnings++; }
  reached.add(id);
}
for (const [id, e] of allEv) {
  if (!e.chain || reached.has(id)) continue;
  const f = seen.get(id) || '';
  if (!only || resolve(join(ROOT, f)) === only) { console.log(`✗ ${f} ${id}: kedjehändelsen nås aldrig — inget val har next: '${id}'`); errors++; }
}
console.log(`\n${errors ? '✗' : '✓'} ${total} händelser kontrollerade — ${errors} fel, ${warnings} varningar`);
process.exit(errors ? 1 : 0);
