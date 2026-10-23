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
S.setIndicatorData(JSON.parse(readFileSync(join(ROOT, 'v4/data/indicators.json'), 'utf8')),
  JSON.parse(readFileSync(join(ROOT, 'v4/data/facts.json'), 'utf8')));

const STAT_IDS = Object.keys(STATS);
const IND_IDS = new Set(S.INDICATORS.map((d) => d.id));
const RES_KEYS = new Set(['money', 'pp', 'rp', 'man']);
const CHOICE_KEYS = new Set(['text', 'tip', 'cost', 'res', 'temp', 'perm', 'mod', 'unmod', 'rel', 'law']);
const EVENT_KEYS = new Set(['id', 'icon', 'weight', 'cooldown', 'title', 'text', 'when', 'choices']);
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
  return {
    st: strictProxy(st, 'c.st', new Set(STAT_IDS)),
    day: Math.floor(rnd(1, 2500)),
    money: Math.floor(rnd(0, 4000)), pp: Math.floor(rnd(0, 400)), rp: Math.floor(rnd(0, 500)), man: Math.floor(rnd(0, 200)),
    ideo, doc: docs.length ? pick(docs) : null,
    harmony: Math.random(),
    law: (cat) => { if (!LAWS[cat]) unknown.add(`c.law('${cat}')`); return laws[cat]; },
    is: (cat, ...ids) => {
      if (!LAWS[cat]) unknown.add(`c.is('${cat}')`);
      else for (const id of ids) if (!LAWS[cat].options.some((o) => o.id === id)) unknown.add(`c.is('${cat}', '${id}')`);
      return ids.includes(laws[cat]);
    },
    atWar: Math.random() < 0.25, wars: Math.floor(rnd(0, 3)),
    claims: Math.floor(rnd(1, 15)), puppets: Math.floor(rnd(0, 3)), allies: Math.floor(rnd(0, 3)),
    res: (b) => { if (!RESEARCH[b]) unknown.add(`c.res('${b}')`); return research[b] || 0; },
    mod: (id) => { if (!MODIFIERS[id]) unknown.add(`c.mod('${id}')`); return Math.random() < 0.15; },
    ind: strictProxy(indRaw, 'c.ind', IND_IDS),
  };
}
const SAMPLES = Array.from({ length: 400 }, () => sampleCtx());
const EMPTY_IND = Array.from({ length: 40 }, () => sampleCtx(true));

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
  // villkoret
  if (typeof ev.when !== 'function') E('when saknas');
  else {
    unknown.clear();
    let hits = 0, crash = null;
    for (const c of SAMPLES) { try { if (ev.when(c)) hits++; } catch (e) { crash ||= e.message; } }
    for (const c of EMPTY_IND) { try { ev.when(c); } catch (e) { crash ||= `tom c.ind: ${e.message}`; } }
    if (crash) E(`when kraschar: ${crash}`);
    for (const u of unknown) E(`okänt namn i when: ${u}`);
    const pct = (hits / SAMPLES.length) * 100;
    if (pct === 0) E('when slår aldrig till (0 % av lägena)');
    else if (pct < 0.5) W(`when slår nästan aldrig till (${pct.toFixed(1)} %)`);
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
    for (const grp of ['cost', 'res']) {
      for (const [k, v] of Object.entries(c[grp] || {})) {
        if (!RES_KEYS.has(k)) E(`${P}: ${grp}.${k} finns inte (money/pp/rp/man)`);
        else if (!(v > 0) || v > CAPS[k]) E(`${P}: ${grp}.${k} = ${v} (1–${CAPS[k]})`);
      }
    }
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
    const isFree = !c.cost || Object.values(c.cost).every((v) => !v);
    if (isFree) free++;
    const hasEffect = ['cost', 'res', 'temp', 'perm', 'mod', 'unmod', 'rel', 'law'].some((k) => c[k] != null && (typeof c[k] !== 'object' || Array.isArray(c[k]) || Object.keys(c[k]).length));
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
console.log(`\n${errors ? '✗' : '✓'} ${total} händelser kontrollerade — ${errors} fel, ${warnings} varningar`);
process.exit(errors ? 1 : 0);
