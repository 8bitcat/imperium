// IMPERIUM V5.21 — kontrollerar myndigheterna (v4/js/agencies.js + agencies-data.js).
// Varje bebott land har minst tio myndigheter med de sex grundslagen, alla slag, bilder och stilar
// finns, namn och förkortningar är rena, varje slags effekter pekar på nationsvärden och statistikmått
// som finns, och loggorna ritas utan fel. Kör: node tools/check-agencies.mjs
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const JS = join(ROOT, 'v4/js');
const imp = (p) => import(pathToFileURL(p).href);
const AG = await imp(join(JS, 'agencies.js'));
const { AGENCIES } = await imp(join(JS, 'agencies-data.js'));
const { STATS } = await imp(join(JS, 'stats.js'));
const S = await imp(join(JS, 'statistics.js'));
const R = await imp(join(JS, 'realism.js'));
const facts = JSON.parse(readFileSync(join(ROOT, 'v4/data/facts.json'), 'utf8'));
const IND = new Set(S.INDICATORS.map((d) => d.id));

const err = [];
const E = (m) => err.push(m);

// ---------- slagen ----------
for (const [k, K] of Object.entries(AG.KINDS)) {
  for (const f of ['name', 'icon', 'gen', 'base', 'desc', 'st', 'em']) if (!K[f]) E(`slaget ${k}: ${f} saknas`);
  if (!(K.drift > 0 && K.drift <= 3)) E(`slaget ${k}: drift ${K.drift} (0–3 % av dagsinkomsten)`);
  if (!AG.LOGO_STYLES[K.st]) E(`slaget ${k}: stilen ${K.st} finns inte`);
  if (!AG.EMBLEMS.includes(K.em)) E(`slaget ${k}: bilden ${K.em} finns inte`);
  if (!Array.isArray(K.col) || K.col.length !== 2) E(`slaget ${k}: col = [bakgrund, förgrund]`);
  if (K.griev && !R.GRIEV_KINDS[K.griev]) E(`slaget ${k}: missnöjet ${K.griev} finns inte`);
  if (!Object.keys(K.mods || {}).length) E(`slaget ${k}: mods saknas — budgeten måste göra något`);
  for (const f of ['mods', 'big', 'cut']) for (const [s, v] of Object.entries(K[f] || {})) {
    if (!STATS[s]) E(`slaget ${k}: ${f}.${s} är inget nationsvärde`);
    if (!Number.isFinite(v) || Math.abs(v) > 6) E(`slaget ${k}: ${f}.${s} = ${v} (högst ±6 per steg)`);
  }
  for (const f of ['add', 'bigAdd', 'cutAdd', 'mul', 'bigMul', 'cutMul']) for (const [s, v] of Object.entries(K[f] || {})) {
    if (!IND.has(s)) E(`slaget ${k}: ${f}.${s} är inget statistikmått`);
    if (!Number.isFinite(v) || !v) E(`slaget ${k}: ${f}.${s} = ${v}`);
    if (f.includes('ul') && Math.abs(v) > 0.5) E(`slaget ${k}: ${f}.${s} = ${v} (en faktor per steg, högst ±0,5)`);
  }
  if ((K.rev || K.cutRev) && !(K.rev > 0 && K.cutRev >= 0)) E(`slaget ${k}: rev/cutRev`);
}
for (const k of AG.CORE_KINDS) if (!AG.KINDS[k]) E(`grundslaget ${k} finns inte`);

// ---------- länderna ----------
let n = 0, x = 0;
for (const [cid, rows] of Object.entries(AGENCIES)) {
  const a2 = facts[cid]?.a2 || cid;
  if (!facts[cid]) E(`${cid}: inget land med det id:t`);
  if (rows.length < 10) E(`${a2}: bara ${rows.length} myndigheter (minst 10)`);
  const list = AG.agencyListFor(cid, a2);
  for (const k of AG.CORE_KINDS) if (!list.some((e) => e.k === k)) E(`${a2}: saknar ${k}`);
  const names = new Set();
  for (const e of list) {
    n++; if (e.x) x++;
    const P = `${a2} ${e.n}`;
    if (!AG.KINDS[e.k]) E(`${P}: slaget ${e.k} finns inte`);
    if (!AG.EMBLEMS.includes(e.e)) E(`${P}: bilden ${e.e} finns inte`);
    if (e.st && !AG.LOGO_STYLES[e.st]) E(`${P}: stilen ${e.st} finns inte`);
    if (!e.n || !e.sv || !e.a) E(`${P}: namn, svenska eller förkortning saknas`);
    if (/[<>"&]/.test(e.n + e.sv + e.a + (e.t || ''))) E(`${P}: otillåtna tecken`);
    if (!/^[A-Z0-9ÅÄÖ.\-&]{1,6}$/.test(e.a)) E(`${P}: förkortningen "${e.a}"`);
    if (!e.c.every((c) => /^#[0-9a-f]{6}$/.test(c || ''))) E(`${P}: färgerna ${e.c}`);
    if (/[^\u0000-ɏḀ-ỿ‘-‟–—]/.test(e.n) && !e.t) E(`${P}: annan skrift än latinsk men inget t`);
    if (names.has(e.n)) E(`${P}: dubbelt namn`);
    names.add(e.n);
    const svg = AG.logoSvg(AG.defaultLogo(e), 40);
    if (!svg.startsWith('<svg') || /undefined|NaN/.test(svg)) E(`${P}: loggan ritas fel`);
  }
}
const inhabited = Object.entries(facts).filter(([, f]) => f.p > 0).map(([id]) => id);
const without = inhabited.filter((id) => !AGENCIES[id]);
// länder utan data får tio påhittade av slagen — de måste också duga
for (const id of [...without, '010']) {
  const list = AG.agencyListFor(id, facts[id]?.a2 || 'X');
  if (list.length < 10) E(`${id}: reservlistan har bara ${list.length}`);
}

// ---------- loggorna ----------
for (const st of Object.keys(AG.LOGO_STYLES)) for (const em of AG.EMBLEMS) {
  const svg = AG.logoSvg({ st, em, bg: '#123456', fg: '#ffffff', tx: 'ABC' }, 40);
  if (/undefined|NaN/.test(svg)) E(`loggan ${st}/${em} ritas fel`);
}
for (const em of AG.EMBLEMS) if (!AG.emblemSvg(em, '#fff', '#000')) E(`bilden ${em} är tom`);

// ---------- verkan ----------
const st = AG.initAgencies('752', 'SVERIGE', 'test', 1);
if (Object.keys(AG.agencyMods(st)).length || Math.abs(AG.agencyCostPct(st)) > 1e-9) E('NORMAL budget ska inte göra något och inte kosta något');
for (const a of st.list) a.lvl = 6;
const big = AG.agencyMods(st);
for (const a of st.list) a.lvl = 0;
const none = AG.agencyMods(st);
if (!(AG.agencyCostPct(st) > 0)) E('att lägga ner allt ska kosta (skatteverket tar inte in pengarna)');
if (!(big.safety > 0 && none.safety < 0)) E('polisen ska ge trygghet med stor budget och ta den nedlagd');

console.log(`${Object.keys(AGENCIES).length} länder och territorier med riktiga myndigheter, ${n} myndigheter (${x} påhittade), ${AG.KIND_IDS.length} slag, ${AG.EMBLEMS.length} bilder, ${Object.keys(AG.LOGO_STYLES).length} stilar`);
console.log(`bebodda utan data (får tio påhittade): ${without.map((id) => facts[id].a2).join(' ') || 'inga'}`);
if (err.length) { console.log(`\n✗ ${err.length} fel:\n` + err.slice(0, 60).join('\n')); process.exit(1); }
console.log('✓ myndigheterna är hela');
