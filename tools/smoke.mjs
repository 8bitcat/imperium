// Röktest för IMPERIUM V5 (som bor i mappen v4/). Spelar ett solo-parti i en
// riktig webbläsare: meny → hemland → faktion → 120 dagar + AI-världen →
// alla NATION-flikar → alla kartlager + 3D → spara och fortsätt. Tar
// skärmbilder i varje steg. Körs före VARJE release och efter push.
//
//   node tools/smoke.mjs           lokal kod (startar egen server på 8481)
//   node tools/smoke.mjs --live    8bitcat.github.io (efter push)
//
// Slutkod 0 = ALLT GRÖNT. Slutkod 1 = raderna med ✗ säger vad som gick fel.
// Skärmbilderna hamnar i .smoke/ (git-ignorerad) — titta på dem, en tom
// konsol betyder inte att det ser rätt ut.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LIVE = process.argv.includes('--live');
const PORT = 8481;
const BASE = LIVE ? 'https://8bitcat.github.io/imperium' : `http://localhost:${PORT}`;
const OUT = join(ROOT, '.smoke');
const DAYS = 120;
const HOME = '752'; // Sverige

// Playwright finns inte i det här repot (ingen build, inga beroenden) —
// lånas från QISY-frontenden. PLAYWRIGHT_DIR pekar om det.
function loadPlaywright() {
  const req = createRequire(import.meta.url);
  const dirs = [process.env.PLAYWRIGHT_DIR, 'D:/Qisy/QISYFrontend/QISYFrontend-1/node_modules/playwright'];
  for (const d of dirs.filter(Boolean)) {
    try { return req(d); } catch { /* nästa */ }
  }
  console.error('✗ Hittar inte Playwright. Sätt PLAYWRIGHT_DIR till en node_modules/playwright-mapp.');
  process.exit(1);
}

const VERSION = readFileSync(join(ROOT, 'v4/js/main.js'), 'utf8').match(/export const VERSION = '([^']+)'/)[1];
const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function startServer() {
  const srv = spawn(process.execPath, ['dev-server.js', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`${BASE}/v4/`)).ok) return srv; } catch { /* inte uppe än */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error(`dev-servern svarar inte på port ${PORT} (upptagen?)`);
}

// svarar på allt spelet kan fråga om så partiet inte står still
const ANSWER_DIALOGS = () => {
  const on = (id) => document.querySelector(id)?.classList.contains('show');
  let n = 0;
  if (on('#eventovl')) { document.querySelector('#evchoices .evchoice:not([disabled])')?.click(); n++; }
  if (on('#modovl')) { [...document.querySelectorAll('#modchoices .evchoice')].pop()?.click(); n++; }
  if (on('#blocask')) { document.querySelector('#blocNo').click(); n++; }
  if (on('#flagpick')) { document.querySelector('#flagNo').click(); n++; }
  if (document.querySelector('#waralert')?.classList.contains('show')) { document.querySelector('#waok').click(); n++; }
  return n;
};

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const srv = LIVE ? null : await startServer();
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.stack || e.message));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  // 120 dagar på några sekunder staplar notiserna över hela skärmen — de
  // rensas så skärmbilden visar spelet (i riktigt spel hinner de tona ut)
  const shot = async (name) => {
    await page.evaluate(() => document.querySelectorAll('.toast').forEach((t) => t.remove()));
    await page.screenshot({ path: join(OUT, name + '.png') });
  };
  const visible = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    return !!el && getComputedStyle(el).display !== 'none' && el.offsetParent !== null;
  }, sel);

  try {
    console.log(`IMPERIUM röktest — ${BASE}/v4/ — förväntad version ${VERSION}\n`);

    // 1. menyn och versionen
    await page.goto(`${BASE}/v4/`, { waitUntil: 'domcontentloaded' });
    const menuVer = await page.locator('#menuversion').innerText();
    check('menyn visar rätt version', menuVer.includes(VERSION), menuVer.replace(/\s+/g, ' ')
      + (LIVE && !menuVer.includes(VERSION) ? ' (Pages cachar upp till 10 min — vänta och kör igen)' : ''));
    await shot('01-meny');

    // 2. soloparti, världen laddas
    await page.click('#btnSolo');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#topbar')).display !== 'none', null, { timeout: 45000 });
    await page.waitForFunction(() => Object.keys(window.IMPERIUM.cities || {}).length > 0, null, { timeout: 45000 });
    check('världen laddades', true, `${await page.evaluate(() => Object.keys(window.IMPERIUM.cities).length)} länder med städer`);
    await shot('02-glob');

    // 3. hemland + faktion
    await page.evaluate((id) => {
      const g = window.IMPERIUM.globe;
      const c = g.getCountry(id) || g.getCountry(Number(id));
      g.select(c.id);
      g.onSelect(c);
    }, HOME);
    await page.click('#claimbtn');
    await page.waitForSelector('#factionpick.show');
    await page.click('#factionlist .cbcard');
    const start = await page.evaluate(() => ({ home: window.IMPERIUM.solo.home, faction: window.IMPERIUM.solo.faction }));
    check('hemland och faktion valda', String(start.home) === HOME && !!start.faction, `hemland ${start.home}, faktion ${start.faction}`);
    await shot('03-hemland');

    // 4. spela: dagar + AI-världen, svara på allt som dyker upp
    let answered = 0;
    const tickErrors = [];
    for (let d = 0; d < DAYS; d++) {
      const err = await page.evaluate(() => {
        try { window.IMPERIUM.debug.tickDay(); return null; } catch (e) { return e.stack || String(e); }
      });
      if (err) tickErrors.push(err);
      if (d % 4 === 0) {
        const aiErr = await page.evaluate(() => {
          try { window.IMPERIUM.debug.aiTick(); return null; } catch (e) { return e.stack || String(e); }
        });
        if (aiErr) tickErrors.push(aiErr);
      }
      answered += await page.evaluate(ANSWER_DIALOGS);
    }
    const day = await page.evaluate(() => window.IMPERIUM.solo.clock.day);
    check(`${DAYS} speldagar utan krasch`, tickErrors.length === 0 && day > DAYS,
      `dag ${day}, ${answered} rutor besvarade${tickErrors.length ? `, ${tickErrors.length} fel:\n    ${tickErrors[0].split('\n').slice(0, 4).join('\n    ')}` : ''}`);
    await page.evaluate(ANSWER_DIALOGS);
    await shot('04-efter-120-dagar');

    // 5. NATION-panelen, varje flik
    await page.click('#nationbtn');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#nation')).display !== 'none');
    const tabs = await page.$$eval('.nattab', (els) => els.map((e) => e.dataset.tab));
    const before = pageErrors.length;
    for (const t of tabs) {
      await page.click(`.nattab[data-tab="${t}"]`);
      await page.waitForTimeout(150);
      await shot(`05-nation-${t}`);
    }
    check('alla NATION-flikar öppnas', pageErrors.length === before && tabs.length >= 7, tabs.join(', '));
    await page.click('#natclose');

    // 6. kartlagren av/på, sedan 3D-planeten
    const layerErrs = pageErrors.length;
    for (const id of ['tgCities', 'tgTerrain', 'tgInfra', 'tgTrade', 'tgLegend']) {
      if (!(await visible('#' + id))) continue;
      await page.click('#' + id);
      await page.waitForTimeout(250);
      await page.click('#' + id);
    }
    check('kartlagren växlar', pageErrors.length === layerErrs);
    await page.click('#tg3d');
    await page.waitForTimeout(2500);
    const is3d = await page.evaluate(() => !!window.IMPERIUM.globe.mode3d || localStorage.getItem('imperium.mode3d') === '1');
    await shot('06-3d');
    await page.click('#tg3d');
    await page.waitForTimeout(500);
    check('3D-läget går att slå på och av', pageErrors.length === layerErrs, is3d ? '' : 'WebGL saknas i testwebbläsaren — se skärmbilden');

    // 7. spara, ladda om, fortsätt
    const saved = await page.evaluate(() => { window.IMPERIUM.debug.saveGame(); return window.IMPERIUM.solo.clock.day; });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#btnContinue', { state: 'visible', timeout: 15000 });
    await page.click('#btnContinue');
    await page.waitForFunction(() => window.IMPERIUM.solo?.clock?.day, null, { timeout: 45000 });
    const back = await page.evaluate(() => ({ day: window.IMPERIUM.solo.clock.day, home: window.IMPERIUM.solo.home }));
    check('sparat parti fortsätter', back.day >= saved && String(back.home) === HOME, `sparat dag ${saved}, tillbaka på dag ${back.day}`);
    await page.waitForTimeout(1500);
    await page.evaluate(ANSWER_DIALOGS);
    await shot('07-fortsatt');

    // 8. konsolen
    const resourceNoise = consoleErrors.filter((t) => /Failed to load resource|net::ERR_/.test(t));
    const realConsole = consoleErrors.filter((t) => !resourceNoise.includes(t));
    check('inga JavaScript-fel', pageErrors.length === 0, pageErrors.length ? '\n    ' + pageErrors.slice(0, 3).map((e) => e.split('\n').slice(0, 3).join('\n    ')).join('\n    ') : '');
    check('inga fel i konsolen', realConsole.length === 0, realConsole.slice(0, 5).join('\n    '));
    if (resourceNoise.length) console.log(`  (${resourceNoise.length} nätverksmissar, t.ex. flaggbilder — räknas inte som fel)`);
  } catch (e) {
    check('testet körde klart', false, e.message.split('\n')[0]);
    await shot('99-krasch').catch(() => {});
  } finally {
    await browser.close();
    srv?.kill();
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\nSkärmbilder: ${OUT}`);
  console.log(failed ? `\n✗ ${failed} FEL — släpp inte` : '\n✓ ALLT GRÖNT');
  process.exit(failed ? 1 : 0);
}

main();
