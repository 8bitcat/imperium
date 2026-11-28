// Bygger app/www/ – webbspelet v4 som det ligger i iPhone-appen (Capacitor). Samma upplägg som Smartphone Empire
// (mobilfabriken/app/build.mjs). Webbspelet ändras inte: allt app-eget görs här och i app/www-app/.
//   - v4/index.html, js/, data/, assets/ kopieras som de är
//   - allt som webben hämtar från CDN:er (d3, topojson, peerjs, qrcode, världskartan, typsnittet, flaggorna) läggs
//     lokalt från app/vendor/ (låst med sha256 i app/vendor/lås.json, hämtas med tools/hamta-vendor.mjs), så att
//     appen startar utan nät. Bara rummen (PeerJS) behöver nät.
//   - krigsbilderna byts mot Carls egna Blender-renderingar (tools/sprites.py): webbens sprites är CC BY-NC-SA
//     och får inte ligga i en app som säljer något
//   - 3D-planeten är på från första starten, butiken och reklamen kommer från app/www-app/
//   node build.mjs            (körs av "npm run build" / "npm run sync" och i codemagic.yaml)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const APP = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(APP, '..');
const V4 = path.join(ROOT, 'v4');
const WWW = path.join(APP, 'www');
const VENDOR = path.join(APP, 'vendor');
const PKG = JSON.parse(fs.readFileSync(path.join(APP, 'package.json'), 'utf8'));
const CFG = PKG.imperium;
if (!CFG?.bundle) throw new Error('app/package.json saknar "imperium.bundle"');

const fel = (m) => { throw new Error(m); };
fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });
for (const f of ['index.html', 'js', 'data', 'assets']) {
  if (!fs.existsSync(path.join(V4, f))) fel(`saknas i webbspelet: v4/${f}`);
  fs.cpSync(path.join(V4, f), path.join(WWW, f), { recursive: true });
}

// ---- vendor: kontrollera låset och kopiera ----
const las = JSON.parse(fs.readFileSync(path.join(VENDOR, 'lås.json'), 'utf8'));
for (const [rel, sha] of Object.entries(las)) {
  const buf = fs.readFileSync(path.join(VENDOR, rel));
  const h = crypto.createHash('sha256').update(buf).digest('hex');
  if (h !== sha) fel(`app/vendor/${rel} har fel hash – kör tools/hamta-vendor.mjs igen och granska ändringen`);
  if (rel.startsWith('sprites/')) continue;
  const dst = path.join(WWW, 'vendor', rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, buf);
}

// ---- egna krigsbilder: varje webbsprite måste ha en ersättare ----
const SPR = path.join(WWW, 'assets', 'sprites');
for (const f of fs.readdirSync(SPR)) {
  const egen = path.join(VENDOR, 'sprites', f);
  if (!las['sprites/' + f]) fel(`assets/sprites/${f} saknar egen bild i app/vendor/sprites (kör tools/sprites.py + hamta-vendor.mjs)`);
  fs.copyFileSync(egen, path.join(SPR, f));
}

// ---- index.html ----
const idx = path.join(WWW, 'index.html');
let html = fs.readFileSync(idx, 'utf8');
const byt = (fran, till) => {
  const n = html.split(fran).length - 1;
  if (n !== 1) fel(`index.html: hittade ${n} av «${fran.slice(0, 70)}» (väntade 1) – uppdatera app/build.mjs`);
  html = html.replace(fran, till);
};
byt('<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>', '<script src="vendor/d3.min.js"></script>');
byt('<script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>', '<script src="vendor/topojson-client.min.js"></script>');
byt('<script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>', '<script src="vendor/peerjs.min.js"></script>');
byt('<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>', '<script src="vendor/qrcode.min.js"></script>');
byt('<link rel="preconnect" href="https://fonts.googleapis.com">\n', '');
byt('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n', '');
byt('<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">',
  '<link href="vendor/fonts/press-start-2p.css" rel="stylesheet">\n<link href="app/app.css" rel="stylesheet">');
// krediteringen: webbens sprites finns inte i appen
byt('SPRITES: BERKLEYTORENO &amp; UMREX (NEWGROUNDS) — CC BY-NC-SA 3.0<br>', '');
byt('TILES: KENNEY.NL — CC0 &nbsp;&#8226;&nbsp; INOFFICIELLT FANVERK', 'TILES: KENNEY.NL — CC0');
// 3D från första starten + appens inställningar, före main.js
const appCfg = { bundle: CFG.bundle, admob: CFG.admob || {} };
byt('<script type="module" src="js/main.js"></script>',
  `<script>
  window.IM_APP = ${JSON.stringify(appCfg)};
  try { if (localStorage.getItem('imperium.mode3d') === null) localStorage.setItem('imperium.mode3d', '1'); } catch (e) { /* privat läge */ }
</script>
<script type="module" src="js/main.js"></script>
<script src="app/app.js"></script>`);
fs.writeFileSync(idx, html);
fs.cpSync(path.join(APP, 'www-app'), path.join(WWW, 'app'), { recursive: true });

// ---- js: världskartan och flaggorna lokalt ----
const js = (rel, f) => { const p = path.join(WWW, 'js', rel); fs.writeFileSync(p, f(fs.readFileSync(p, 'utf8'))); };
js('data.js', (t) => {
  for (const s of ['110m', '50m']) {
    const u = `'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-${s}.json'`;
    if (!t.includes(u)) fel(`js/data.js: hittade inte ${u}`);
    t = t.replace(u, `'vendor/countries-${s}.json'`);
  }
  return t;
});
let flaggor = 0;
(function ga(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { ga(p); continue; }
    if (!e.name.endsWith('.js')) continue;
    const t = fs.readFileSync(p, 'utf8');
    if (!t.includes('https://flagcdn.com/')) continue;
    flaggor += t.split('https://flagcdn.com/').length - 1;
    fs.writeFileSync(p, t.replaceAll('https://flagcdn.com/', 'vendor/flags/'));
  }
})(path.join(WWW, 'js'));

// ---- inget får hämtas från en CDN längre ----
const CDN = /https?:\/\/(cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|flagcdn\.com|cdnjs\.cloudflare\.com)/;
const kvar = [];
(function ga(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (p !== path.join(WWW, 'vendor')) ga(p); continue; }
    if (!/\.(js|css|html|json)$/.test(e.name)) continue;
    const t = fs.readFileSync(p, 'utf8');
    const m = t.match(CDN);
    if (m) kvar.push(`${path.relative(WWW, p)}: ${m[0]}`);
  }
})(WWW);
if (kvar.length) fel('appen hämtar fortfarande från CDN:\n' + kvar.join('\n'));

const antal = (function rakna(dir) { let k = 0; for (const e of fs.readdirSync(dir, { withFileTypes: true })) k += e.isDirectory() ? rakna(path.join(dir, e.name)) : 1; return k; })(WWW);
const ver = fs.readFileSync(path.join(V4, 'js', 'main.js'), 'utf8').match(/VERSION\s*=\s*'([^']+)'/)?.[1] || '?';
console.log(`app/www: webbspelet v${ver} – ${antal} filer, ${flaggor} flagglänkar lokala, egna krigsbilder, 3D från start, reklam ${CFG.admob?.test === false ? 'SKARP' : 'TEST'}`);
