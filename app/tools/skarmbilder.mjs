// App Store-skärmbilderna till Imperium: app/www körs i telefonens/plattans riktiga storlek och fotas rakt av.
//   iphone  6,3" liggande 2622×1206 (874×402 @3x) med iPhonens skärmkanter (notch 59 px, hemindikator 21 px)
//   ipad    13"  liggande 2752×2064 (1376×1032 @2x)
//   node app/tools/skarmbilder.mjs [iphone|ipad|alla]   (kör node app/build.mjs först)
//     → app/store/skarmbilder/<enhet>-<nr>-<id>.png   (ordningen = ordningen i App Store)
// Spelet är på svenska, så bilderna används till både sv och en-US (asc-app.mjs bilder).
// Playwright lånas från QISY-frontendens node_modules; three.js/WebGL ritas med SwiftShader (ingen GPU).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WWW = path.join(APP, 'www');
const OUT = path.join(APP, 'store', 'skarmbilder');
const PW = process.env.PLAYWRIGHT || 'D:/Qisy/QISYFrontend/QISYFrontend-1/node_modules/playwright';
const { chromium } = createRequire(import.meta.url)(PW);
const val = process.argv[2] || 'alla';
const ENHETER = {
  iphone: { vp: [874, 402], dsf: 3, safe: ['0px', '59px', '21px', '59px'] },
  ipad: { vp: [1376, 1032], dsf: 2, safe: ['24px', '0px', '20px', '0px'] },
};
if (!fs.existsSync(path.join(WWW, 'index.html'))) throw new Error('app/www saknas – kör node app/build.mjs');
fs.mkdirSync(OUT, { recursive: true });

const TYP = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, s) => {
  const p = path.join(WWW, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(path.normalize(WWW)) || !fs.existsSync(p)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': TYP[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(s);
});
await new Promise((r) => srv.listen(0, r));
const BAS = `http://localhost:${srv.address().port}`;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

async function enhet(namn, E) {
  const ctx = await browser.newContext({ viewport: { width: E.vp[0], height: E.vp[1] }, deviceScaleFactor: E.dsf, isMobile: true, hasTouch: true });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(BAS) ? r.continue() : r.abort()));
  const page = await ctx.newPage();
  const fel = [];
  page.on('pageerror', (e) => fel.push(e.message));
  await page.goto(BAS + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((s) => { const st = document.documentElement.style; ['--sat', '--sar', '--sab', '--sal'].forEach((k, i) => st.setProperty(k, s[i])); }, E.safe);
  await page.waitForTimeout(2500);
  let nr = 0;
  // rensar notiserna och tar bilden när WebGL hunnit rita
  const foto = async (id) => {
    await page.evaluate(() => { document.querySelectorAll('#toasts .toast').forEach((t) => t.remove()); document.querySelector('#appmsg')?.classList.remove('show'); });
    await page.waitForTimeout(1200);
    const fil = path.join(OUT, `${namn}-${++nr}-${id}.png`);
    await page.screenshot({ path: fil });
    console.log(' ', path.relative(APP, fil));
  };
  const tryck = (sel, text) => page.evaluate(([sel, text]) => {
    const b = [...document.querySelectorAll(sel)].find((x) => x.offsetParent && x.textContent.replace(/\s+/g, ' ').includes(text));
    if (!b) throw new Error(`hittar ingen knapp «${text}» i ${sel}`);
    b.click();
  }, [sel, text]);

  // solospelet: Sverige som hemland, Järngardet
  await page.click('#btnSolo');
  await page.waitForFunction(() => Object.keys(window.IMPERIUM.cities || {}).length > 0, null, { timeout: 90000 });
  await page.waitForTimeout(2500);
  await page.evaluate(() => { const g = window.__imperium.globe; const c = g.getCountry('752'); g.select(c.id); g.onSelect(c); });
  await page.waitForTimeout(800);
  await page.click('#claimbtn');
  await page.waitForSelector('#factionpick.show');
  await page.click('#factionlist .cbcard');
  await page.waitForTimeout(1500);
  // några dagar in, pausat, så att världen hunnit röra sig
  await page.evaluate(() => { const I = window.__imperium; for (let i = 0; i < 20; i++) I.tickDay(); });
  await page.evaluate(() => { const s = window.IMPERIUM; if (s.solo?.clock) s.solo.clock.paused = true; });
  await page.waitForTimeout(1500);
  // händelserna som dök upp under dagarna stängs, så att de inte ligger över bilderna
  await page.evaluate(() => ['#eventovl', '#modovl'].forEach((o) => document.querySelector(o)?.classList.remove('show')));

  // skrollar det som skrollar i nationspanelen (lagarna ligger under rubrikerna)
  const skrolla = (y) => page.evaluate((y) => { document.querySelectorAll('#natwrap *').forEach((e) => { if (e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible') e.scrollTop = y; }); }, y);
  await page.evaluate(() => document.querySelector('#infoclose')?.click());
  await foto('klotet');
  await page.evaluate(() => { const I = window.__imperium; const ev = I.EVENTS.find((e) => /skandal|egna/i.test(e.title || e.name || '')) || I.EVENTS[0]; I.openEventDialog(I.eventInstance ? I.eventInstance(ev) : ev); });
  await foto('handelsen');
  await page.evaluate(() => document.querySelector('#eventovl')?.classList.remove('show'));
  await page.evaluate(() => { const g = window.__imperium.globe; const c = g.getCountry('752'); g.select(c.id); g.onSelect(c); });
  await page.waitForTimeout(600);
  await tryck('button', 'NATION');
  await page.waitForTimeout(800);
  await foto('nationen');
  await tryck('#nation button', 'LAGAR');
  await page.waitForTimeout(500);
  await skrolla(E.vp[1] < 600 ? 230 : 120);
  await foto('lagarna');
  // ideologiträdet bara på iPhone: på plattans höga skärm syns hela trädet, med diktaturerna längst ner – inget för
  // en App Store-bild
  if (E.vp[1] < 600) {
    await tryck('#nation button', 'IDEOLOGI');
    await skrolla(0);
    await foto('ideologin');
  }
  await tryck('#nation button', 'STÄNG');
  await page.evaluate(() => document.querySelector('#infoclose')?.click());
  await page.evaluate(() => window.__imperium.openCityPanel('752'));
  await foto('staderna');
  if (fel.length) console.log('  sidfel:', fel.slice(0, 5).join(' | '));
  await ctx.close();
}

for (const [namn, E] of Object.entries(ENHETER)) {
  if (val !== 'alla' && val !== namn) continue;
  for (const f of fs.readdirSync(OUT).filter((f) => f.startsWith(namn + '-'))) fs.unlinkSync(path.join(OUT, f));
  console.log(namn);
  await enhet(namn, E);
}
await browser.close();
srv.close();
