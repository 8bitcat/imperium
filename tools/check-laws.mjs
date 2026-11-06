// IMPERIUM — kontroll av lagarna (V5.17). Kör: node tools/check-laws.mjs [--alla]
// Utan flagga granskas de nya delarna (laws511/part12–17.js) noga och hela lagboken
// översiktligt. Slutkod 1 = fel.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const R = (f) => pathToFileURL(resolve('v4/js', f)).href;
const { LAWS } = await import(R('laws.js'));
const { IDEOLOGIES, preferredIndex } = await import(R('ideologies.js'));
const { STATS } = await import(R('stats.js'));
const { IND, LAW_EFFECTS } = await import(R('statistics.js'));
const { LAW_KIND, LAW_SV, GRIEV_IDS } = await import(R('realism.js'));

const PARTS = [12, 13, 14, 15, 16, 17];
const errs = [], warns = [];
const E = (m) => errs.push(m), W = (m) => warns.push(m);
const IDEOS = new Set(Object.keys(IDEOLOGIES));
const OPS = new Set(['+', '*', '=', '~', '%pop']);
// goodness: positivt = bra för landet (inverted-värden räknas baklänges)
const good = (k, v) => (STATS[k]?.inverted ? -v : v);

function checkMods(where, mods, min = 5) {
  if (!mods || typeof mods !== 'object') { E(`${where}: mods saknas`); return; }
  const keys = Object.keys(mods);
  if (keys.length < min) E(`${where}: bara ${keys.length} nationsvärden i mods (minst ${min})`);
  for (const [k, v] of Object.entries(mods)) {
    if (!STATS[k]) E(`${where}: okänt nationsvärde "${k}"`);
    if (!Number.isFinite(v)) E(`${where}: ${k} är inte ett tal`);
    else if (Math.abs(v) > 60) E(`${where}: ${k} = ${v} är orimligt stort (högst ±60)`);
  }
}

function checkFx(where, fx, min = 5) {
  if (!fx) { E(`${where}: inga statistikeffekter (FX/effects)`); return; }
  const keys = Object.keys(fx);
  if (keys.length < min) E(`${where}: bara ${keys.length} statistikmått (minst ${min})`);
  for (const [id, arr] of Object.entries(fx)) {
    const d = IND[id];
    if (!d) { E(`${where}: okänt statistikmått "${id}"`); continue; }
    if (d.agg === 'derived') E(`${where}: "${id}" är härlett och kan inte styras direkt`);
    if (!Array.isArray(arr) || !OPS.has(arr[0]) || !Number.isFinite(arr[1])) { E(`${where}: ${id} har fel form ${JSON.stringify(arr)}`); continue; }
    const [op, n, k] = arr;
    if (op === '*' && (n <= 0 || n > 20)) E(`${where}: ${id} × ${n} utanför 0…20`);
    if (op === '~' && (k != null && (!(k > 0) || k > 1))) E(`${where}: ${id} '~' styrka ${k} utanför 0…1`);
    if ((op === '=' || op === '~') && ((d.min != null && n < d.min) || (d.max != null && n > d.max))) E(`${where}: ${id} nivå ${n} utanför [${d.min}, ${d.max}]`);
  }
}

function checkDesc(where, desc) {
  if (typeof desc !== 'string') { E(`${where}: desc saknas`); return; }
  if (desc.length < 220) E(`${where}: desc för kort (${desc.length} tecken)`);
  if (desc.length > 760) W(`${where}: desc lång (${desc.length} tecken)`);
  const sentences = desc.split(/[.!?](\s|$)/).filter((s) => s && s.trim().length > 3).length;
  if (sentences < 3) E(`${where}: desc har ${sentences} meningar (minst 3)`);
  if (/−/.test(desc)) E(`${where}: desc innehåller U+2212 (pixelfonten saknar tecknet)`);
}

function checkFlags(where, o) {
  if (o.utopia) {
    if (o.utopia !== true) E(`${where}: utopia ska vara true`);
    if (o.brutal) E(`${where}: kan inte vara både utopia och brutal`);
    const st = o.sting;
    if (!st || Object.keys(st).length < 4) { E(`${where}: utopi utan sting (minst 4 nationsvärden)`); return; }
    for (const [k, v] of Object.entries(st)) {
      if (!STATS[k]) E(`${where}: sting har okänt nationsvärde "${k}"`);
      if (!Number.isFinite(v) || Math.abs(v) > 60) E(`${where}: sting ${k} = ${v}`);
    }
    const honey = Object.entries(o.mods).reduce((a, [k, v]) => a + Math.max(0, good(k, v)), 0);
    const pain = Object.entries(st).reduce((a, [k, v]) => a + Math.max(0, -good(k, v)), 0);
    const stingGood = Object.entries(st).reduce((a, [k, v]) => a + Math.max(0, good(k, v)), 0);
    if (honey < 25) E(`${where}: utopin lockar för lite (positivt ${honey}, minst 25)`);
    if (pain < honey * 1.3) E(`${where}: stinget (${pain}) ska vara minst 1,3 × lockelsen (${honey})`);
    if (stingGood > 0) W(`${where}: stinget har positiva delar (${stingGood})`);
  }
  if (o.brutal) {
    if (o.brutal !== true) E(`${where}: brutal ska vara true`);
    if (!Number.isInteger(o.shame) || o.shame < 4 || o.shame > 25) E(`${where}: shame ska vara ett heltal 4–25 (är ${o.shame})`);
    const gain = Object.entries(o.mods).reduce((a, [k, v]) => a + Math.max(0, good(k, v)), 0);
    const cost = Object.entries(o.mods).reduce((a, [k, v]) => a + Math.max(0, -good(k, v)), 0);
    if (gain < 30) E(`${where}: brutalt val vinner för lite (positivt ${gain}, minst 30)`);
    if (cost < 45) E(`${where}: brutalt val kostar för lite (negativt ${cost}, minst 45)`);
  } else if (o.shame != null) E(`${where}: shame utan brutal`);
  if (o.sting && !o.utopia) E(`${where}: sting utan utopia`);
}

const fxOf = (cat, id) => LAW_EFFECTS[cat]?.[id];

// ---------- de nya delarna ----------
const newIds = new Set();
for (const p of PARTS) {
  let mod;
  try { mod = await import(R(`laws511/part${p}.js`)); } catch (e) { E(`part${p}.js: ${e.message}`); continue; }
  const extras = mod.EXTRAS || {}, fxs = mod.FX || {}, news = mod.NEW || {};
  for (const [cat, list] of Object.entries(extras)) {
    const L = LAWS[cat];
    if (!L) { E(`part${p}: okänd lag "${cat}"`); continue; }
    let u = 0, b = 0;
    for (const e of list) {
      const o = e.option, where = `part${p} ${cat}.${o?.id}`;
      if (!o?.id || !/^[a-z0-9_]+$/.test(o.id)) { E(`${where}: ogiltigt id`); continue; }
      newIds.add(cat + '.' + o.id);
      if (L.options.filter((x) => x.id === o.id).length !== 1) E(`${where}: id:t finns inte exakt en gång i lagen (krock?)`);
      if (e.after !== '^' && !L.options.some((x) => x.id === e.after)) E(`${where}: after "${e.after}" finns inte`);
      if (!o.name || /[åäöÅÄÖ]/.test(o.name)) E(`${where}: name ska vara engelska`);
      if (o.default) E(`${where}: ett nytt val får inte vara default`);
      checkMods(where, o.mods);
      checkDesc(where, o.desc);
      checkFlags(where, o);
      for (const id of e.locks || []) if (!IDEOS.has(id)) E(`${where}: okänd ideologi i locks "${id}"`);
      if (!fxs[cat]?.[o.id]) E(`${where}: saknar FX`);
      checkFx(where, fxOf(cat, o.id));
      if (o.utopia) u++; if (o.brutal) b++;
    }
    if (u < 1 || b < 1) W(`part${p} ${cat}: ${u} utopier och ${b} brutala val (väntat minst 1 av varje)`);
  }
  for (const [cat, opts] of Object.entries(fxs)) {
    for (const id of Object.keys(opts)) if (!LAWS[cat]?.options.some((o) => o.id === id)) E(`part${p} FX ${cat}.${id}: valet finns inte`);
  }
  for (const [cat, L] of Object.entries(news)) {
    const where = `part${p} NY LAG ${cat}`;
    if (!/^[a-z_]+$/.test(cat)) E(`${where}: ogiltigt id`);
    if (!LAWS[cat] || LAWS[cat].options !== L.options) E(`${where}: krockar med en befintlig lag`);
    if (!['auth', 'econ'].includes(L.axis) || ![1, -1].includes(L.dir)) E(`${where}: axis/dir fel`);
    if (!L.name || /[åäöÅÄÖ]/.test(L.name)) E(`${where}: name ska vara engelska`);
    if (!L.icon) E(`${where}: icon saknas`);
    if (!GRIEV_IDS.includes(L.kind)) E(`${where}: kind "${L.kind}" ska vara ett av ${GRIEV_IDS.join(', ')}`);
    if (!L.sv || typeof L.sv !== 'string') E(`${where}: sv (svensk bestämd form, t.ex. "personkulten") saknas`);
    if (LAW_KIND[cat] !== L.kind || LAW_SV[cat] !== L.sv) E(`${where}: kind/sv har inte kommit in i realism.js`);
    const opts = L.options || [];
    if (opts.length < 9) E(`${where}: bara ${opts.length} val (minst 9)`);
    const defs = opts.filter((o) => o.default);
    if (defs.length !== 1) E(`${where}: ${defs.length} default (exakt ett)`);
    else if (Object.keys(defs[0].mods || {}).length) E(`${where}: default ska ha mods {}`);
    const ids = new Set();
    let u = 0, b = 0;
    for (const o of opts) {
      const w = `${where}.${o.id}`;
      if (ids.has(o.id)) E(`${w}: dubblett`); ids.add(o.id);
      newIds.add(cat + '.' + o.id);
      if (!o.name || /[åäöÅÄÖ]/.test(o.name)) E(`${w}: name ska vara engelska`);
      checkDesc(w, o.desc);
      if (o.default) continue;
      checkMods(w, o.mods);
      checkFlags(w, o);
      checkFx(w, fxOf(cat, o.id));
      if (o.utopia) u++; if (o.brutal) b++;
    }
    if (u < 1 || b < 1) E(`${where}: ${u} utopier och ${b} brutala val (minst 1 av varje)`);
    for (const [ideo, list] of Object.entries(L.locks || {})) {
      if (!IDEOS.has(ideo)) E(`${where}: okänd ideologi i locks "${ideo}"`);
      for (const o of list) if (!ids.has(o)) E(`${where}: locks ${ideo} pekar på okänt val "${o}"`);
    }
  }
}

// ---------- hela lagboken ----------
let total = 0;
for (const [cat, L] of Object.entries(LAWS)) {
  total += L.options.length;
  const defs = L.options.filter((o) => o.default).length;
  if (defs !== 1) E(`${cat}: ${defs} default`);
  const seen = new Set();
  for (const o of L.options) { if (seen.has(o.id)) E(`${cat}: dubblett ${o.id}`); seen.add(o.id); }
  if (!LAW_KIND[cat]) E(`${cat}: saknar missnöjesslag i LAW_KIND (realism.js)`);
  if (!LAW_SV[cat]) E(`${cat}: saknar svenskt namn i LAW_SV (realism.js)`);
}
// partiets önskade val måste vara ett som partiet tillåter
for (const [k, I] of Object.entries(IDEOLOGIES)) {
  for (const [cat, req] of Object.entries(I.requires || {})) {
    const i = preferredIndex({ ideology: k, laws: {} }, cat);
    const o = LAWS[cat]?.options[i]?.id;
    if (!req.includes(o)) E(`${k} vill ha ${cat}.${o} men kräver ${req.join('/')}`);
  }
  for (const [cat, lk] of Object.entries(I.locks || {})) {
    for (const o of lk) if (!LAWS[cat]?.options.some((x) => x.id === o)) W(`${k} spärrar okänt ${cat}.${o}`);
  }
}

const nU = Object.values(LAWS).flatMap((L) => L.options).filter((o) => o.utopia).length;
const nB = Object.values(LAWS).flatMap((L) => L.options).filter((o) => o.brutal).length;
console.log(`${Object.keys(LAWS).length} lagar, ${total} val (${newIds.size} nya i del 12–17: ${nU} utopier, ${nB} brutala)`);
if (warns.length) console.log(`\n${warns.length} varningar:\n` + warns.slice(0, 40).map((w) => '  ! ' + w).join('\n'));
if (errs.length) { console.log(`\n✗ ${errs.length} fel:\n` + errs.slice(0, 80).map((e) => '  ✗ ' + e).join('\n')); process.exit(1); }
console.log('✓ lagarna är hela');
