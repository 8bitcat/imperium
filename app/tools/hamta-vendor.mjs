// Hämtar allt webbspelet laddar från nätet till app/vendor/, så att appen startar utan CDN:er (App Review ser
// aldrig en tom karta, och spelet går att spela offline utom rummen). Körs EN gång när en version ska bytas –
// filerna checkas in och app/vendor/lås.json låser dem med sha256, som build.mjs kontrollerar.
//   node app/tools/hamta-vendor.mjs
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = path.join(APP, 'vendor');
const ROOT = path.resolve(APP, '..');

// samma bibliotek som v4/index.html, låsta till exakta versioner
const LIB = {
  'd3.min.js': 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
  'topojson-client.min.js': 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js',
  'peerjs.min.js': 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js',
  'qrcode.min.js': 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js',
  'countries-110m.json': 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json',
  'countries-50m.json': 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json',
};

const hamta = async (url, opts) => {
  for (let f = 0; f < 3; f++) {
    try {
      const r = await fetch(url, opts);
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      if (r.status === 404) return null;
    } catch { /* försök igen */ }
    await new Promise((ok) => setTimeout(ok, 800 * (f + 1)));
  }
  throw new Error('kunde inte hämta ' + url);
};

fs.mkdirSync(V, { recursive: true });
const las = {};
const skriv = (rel, buf) => {
  const p = path.join(V, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  las[rel.replace(/\\/g, '/')] = crypto.createHash('sha256').update(buf).digest('hex');
};

for (const [fil, url] of Object.entries(LIB)) { skriv(fil, await hamta(url)); console.log('lib', fil); }

// Press Start 2P (SIL Open Font License) – Google Fonts CSS med en modern webbläsare ger woff2
const css = (await hamta('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap', {
  headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' },
})).toString('utf8');
const block = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]+)}/g)];
let ff = '';
for (const [, del, kropp] of block) {
  const url = kropp.match(/url\((https:[^)]+)\)/)[1];
  const fil = `fonts/press-start-2p-${del}.woff2`;
  skriv(fil, await hamta(url));
  ff += `/* ${del} */\n@font-face {${kropp.replace(url, fil.replace('fonts/', ''))}}\n`;
}
skriv('fonts/press-start-2p.css', Buffer.from(ff));
console.log('typsnitt', block.length, 'delar');

// flaggorna (flagcdn.com, w20/w40/w80) för alla länder spelet känner
const facts = JSON.parse(fs.readFileSync(path.join(ROOT, 'v4', 'data', 'facts.json'), 'utf8'));
const koder = new Set(Object.values(facts).map((f) => String(f.a2 || '').toLowerCase()).filter((k) => /^[a-z]{2}$/.test(k)));
for (const m of fs.readFileSync(path.join(ROOT, 'v4', 'js', 'country-data.js'), 'utf8').matchAll(/a2:\s*'([A-Za-z]{2})'/g)) koder.add(m[1].toLowerCase());
let n = 0, borta = [];
const lista = [...koder].sort();
for (let i = 0; i < lista.length; i += 12) {
  await Promise.all(lista.slice(i, i + 12).flatMap((k) => ['w20', 'w40', 'w80'].map(async (w) => {
    const b = await hamta(`https://flagcdn.com/${w}/${k}.png`);
    if (b) { skriv(`flags/${w}/${k}.png`, b); n++; } else borta.push(`${w}/${k}`);
  })));
}
console.log('flaggor', n, borta.length ? `(saknas hos flagcdn: ${borta.join(' ')})` : '');

// spriterna (app/tools/sprites.py) låses också
const sp = path.join(V, 'sprites');
if (fs.existsSync(sp)) for (const f of fs.readdirSync(sp)) las['sprites/' + f] = crypto.createHash('sha256').update(fs.readFileSync(path.join(sp, f))).digest('hex');

const sorterat = Object.fromEntries(Object.entries(las).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(path.join(V, 'lås.json'), JSON.stringify(sorterat, null, 1) + '\n');
console.log('app/vendor/lås.json:', Object.keys(sorterat).length, 'filer');
