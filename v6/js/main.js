// TRADE WARS (IMPERIUM V6) — infrastrukturspelet.
//
// Skillnaden mot V4/V5 i en mening: där byggde man en armé och tog land, här
// bygger man ett LAND och tar sig råd med en armé. Basinkomsten är identisk för
// alla och avsiktligt futtig; allt du vill göra kräver att du först drar el,
// sedan terminaler, sedan förbindelser — och varje sak du reser kostar
// underhåll varje dag.

import { Globe } from './globe.js';
import { loadWorld, loadCities, loadFacts } from './data6.js';
import { BASE, INF_COST, TANK_COST, AIR_COST, DEFENCE, POINTS, LINK, MAX_LINK_LEVEL,
  linkCost, linkIncome, upgradeCost, kmBetween } from './econ.js';
import { PLANTS, lineCost, lineDays, poweredCities, totalMW, plantUnlocked } from './power.js';
import { BUILDINGS, unlocked, tally } from './buildings6.js';
import { RESEARCH, TIER_COST, TIER_DAYS, researchMods, combatBonus,
  linkIncomeMult, linkSpeedMult } from './research6.js';
import { linkKey, makeLink, addCar, tickLink, payload, carPos, blockers,
  connectedToCapital } from './infra.js';
import { RESOURCES, resourcesOf, transportOptions, buildListings, freightCost } from './market.js';
import { IDEOLOGIES, ideologyMods, buildCostMult, upkeepMult, linkIncomeMult as ideoLinkMult } from './ideologies6.js';

export const VERSION = '6.0.0';
export const VERSION_NAME = 'TRADE WARS';
export const VERSION_DATE = '2026-08-20';

const $ = (q) => document.querySelector(q);
const globe = new Globe($('#globe'));

function hashId(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) { h ^= String(str).charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

const state = {
  countries: [], cities: {}, facts: {}, world: {},
  s: null,              // spelarens rike
  mode: null,
  build: null,          // pågående byggläge {kind, first}
  selCity: null,
  clock: { day: 1, acc: 0, paused: false },
};
window.TRADEWARS = state;
state.globe = globe;

const SOLO_COLOR = '#ff6b4a';
const DAY_MS = 2000;   // ett speldygn

// ---------- hjälpare ----------
const cityKey = (cid, i) => `${cid}:${i}`;
const splitKey = (k) => { const [cid, i] = k.split(':'); return { cid, i: +i }; };
function cityOf(key) { const { cid, i } = splitKey(key); return state.cities[cid]?.[i] || null; }
function cityName(key) { return (cityOf(key)?.n || '?').toUpperCase(); }
function cityLL(key) { return cityOf(key)?.ll || [0, 0]; }
function cname(cid) { return (globe.getCountry(cid)?.name || '?').toUpperCase(); }
function capitalKeyOf(cid) {
  const list = state.cities[cid] || [];
  const i = list.findIndex((c) => c.c);
  return cityKey(cid, i >= 0 ? i : 0);
}

// Ligger staden vid havet? Avgörs mot landpolygonen: en punkt strax utanför
// staden som INTE ligger i något land betyder öppet vatten.
function isCoastal(key) {
  const c = cityOf(key);
  if (!c) return false;
  if (c._coast != null) return c._coast;
  const [lon, lat] = c.ll;
  const step = 0.55;
  let sea = false;
  for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step], [step, step], [-step, -step]]) {
    if (!globe.countryAtLL([lon + dx, lat + dy])) { sea = true; break; }
  }
  c._coast = sea;
  return sea;
}

function toast(msg, cls = '', ms = 4200) {
  const el = document.createElement('div');
  el.className = 'toast ' + cls;
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), ms);
}
const warn = (m) => toast(m, 'red', 4200);

// ---------- riket ----------
function newRealm(home) {
  const s = {
    home,
    claims: { [home]: { color: SOLO_COLOR, name: 'DU' } },
    res: { money: 300, research: 0, pp: 20, man: 30 },
    nation: { ideology: 'socialdemocracy', research: {} },
    cityB: {},          // "cid:i" → [byggnadsnycklar]
    plants: [],         // {city, kind, done, left}
    lines: [],          // {a, b, done, left, km}
    links: {},          // key → link
    store: { qty: {}, cap: 0 },
    queue: [],          // byggkö {type, ...}
    army: { units: [] },
    defence: false,
    integ: {},
  };
  // Huvudstaden börjar med ett vindkraftverk — resten av landet är mörkt.
  const cap = capitalKeyOf(home);
  s.plants.push({ city: cap, kind: 'wind', done: true, left: 0 });
  state.s = s;
  return s;
}

// ---------- ekonomi ----------
function powered() {
  const s = state.s;
  return poweredCities(s.plants, s.lines);
}

function econSnapshot() {
  const s = state.s;
  const t = tally(s.cityB);
  const im = ideologyMods(s.nation.ideology);
  const rm = researchMods(s.nation.research);
  const up = (t.upkeep + s.plants.reduce((a, p) => a + (p.done ? PLANTS[p.kind].upkeep : 0), 0)
    + (s.defence ? DEFENCE.upkeep : 0)) * upkeepMult(s.nation.ideology) * (1 + (rm.upkeepPct || 0) / 100);
  const pct = (k) => 1 + (((im[k] || 0) + (rm[k + 'Pct'] || 0)) / 100);
  const inc = {
    money: (BASE.money + t.yield.money) * pct('money') - up,
    research: (BASE.research + t.yield.research) * pct('research'),
    pp: (BASE.pp + t.yield.pp) * pct('pp'),
    man: (BASE.man + t.yield.man) * pct('man'),
  };
  return { inc, upkeep: up, mw: t.mw, cap: totalMW(s.plants), capacity: t.capacity };
}

// ---------- dygnet ----------
function tickDay() {
  const s = state.s;
  if (!s) return;
  state.clock.day++;
  globe.setDayFloat(state.clock.day);   // driver sol, norrsken och nattljus
  const e = econSnapshot();
  for (const k of Object.keys(e.inc)) s.res[k] = Math.max(0, s.res[k] + e.inc[k]);

  // förbindelserna arbetar: varje leverans betalar
  const incMult = (kind) => linkIncomeMult(s.nation.research, kind) * ideoLinkMult(s.nation.ideology);
  let delivered = 0;
  for (const l of Object.values(s.links)) {
    const arrivals = tickLink(l, 1, linkSpeedMult(s.nation.research, l.kind));
    if (arrivals) {
      const pay = payload(l, incMult(l.kind)) * arrivals;
      s.res.money += pay;
      delivered += pay;
      // råvara som når huvudstaden hamnar i lagret
      depositResource(l);
    }
  }
  s._lastDelivered = delivered;

  // byggkön
  tickQueue();
  tickIntegration();
  // strömlöst? då står allt still och folk knorrar
  if (e.mw > e.cap) {
    if (state.clock.day % 12 === 0) warn(`\u{26A1} STRÖMBRIST: ${Math.round(e.mw)} MW BEHÖVS, ${e.cap} MW FINNS`);
  }
  if (s.res.money < 1 && e.inc.money < 0 && state.clock.day % 10 === 0) {
    warn('\u{1F4B8} KASSAN ÄR TOM OCH UNDERHÅLLET ÄTER DIG — RIV ELLER BYGG INKOMST');
  }
  aiTick();
  renderTop();
  if ($('#citypanel').style.display === 'block') renderCityPanel();
}

function tickQueue() {
  const s = state.s;
  for (const job of [...s.queue]) {
    job.left -= 1;
    if (job.left > 0) continue;
    s.queue = s.queue.filter((x) => x !== job);
    if (job.type === 'building') {
      (s.cityB[job.city] ||= []).push(job.key);
      const b = BUILDINGS[job.key];
      if (b.capacity) s.store.cap += b.capacity;
      toast(`${b.icon} ${b.name} KLAR I ${cityName(job.city)}`, 'amber', 5000);
    } else if (job.type === 'plant') {
      const p = s.plants.find((x) => x.id === job.id);
      if (p) { p.done = true; toast(`${PLANTS[p.kind].icon} ${PLANTS[p.kind].name} I DRIFT — ${PLANTS[p.kind].mw} MW`, 'amber', 6000); }
    } else if (job.type === 'line') {
      const l = s.lines.find((x) => x.id === job.id);
      if (l) { l.done = true; toast(`\u{26A1} ELLEDNING KLAR: ${cityName(l.a)} \u{2192} ${cityName(l.b)}`, 'amber', 5000); }
    } else if (job.type === 'research') {
      s.nation.research[job.branch] = job.tier;
      toast(`\u{1F52C} ${job.name.toUpperCase()} KLAR`, 'amber', 6000);
    } else if (job.type === 'buy') {
      s.store.qty[job.res] = (s.store.qty[job.res] || 0) + 1;
      toast(`${RESOURCES[job.res].icon} ${RESOURCES[job.res].name} HAR ANLÄNT TILL LAGRET`, 'amber', 5000);
    } else if (job.type === 'unit') {
      s.army.units.push({ type: job.unit, hp: 10 });
      toast(`\u{2694}\u{FE0F} ${job.unit} FÄRDIGT`, 'amber', 5000);
    }
    renderTop();
  }
}

// Råvaran följer med lasten in till huvudstaden — men bara om lagret finns.
function depositResource(l) {
  const s = state.s;
  if (!s.store.cap) return;
  const cap = capitalKeyOf(s.home);
  const from = [l.a, l.b].find((k) => k !== cap);
  if (!from || (l.a !== cap && l.b !== cap)) return;
  const res = cityResource(from);
  if (!res) return;
  const have = Object.values(s.store.qty).reduce((a, b) => a + b, 0);
  if (have >= s.store.cap) return;
  s.store.qty[res] = (s.store.qty[res] || 0) + 1;
}

// Vilken råvara ligger i staden? Stabilt per stad.
function cityResource(key) {
  const { cid, i } = splitKey(key);
  const h = hashId(key);
  if (h % 5 !== 0) return null;          // bara var femte stad har något
  const list = resourcesOf(cid, hashId);
  return list[h % list.length];
}

// ---------- byggande ----------
function costOf(base) { return Math.round(base * buildCostMult(state.s.nation.ideology)); }

function canBuild(key, cityK) {
  const s = state.s;
  const b = BUILDINGS[key];
  const { cid } = splitKey(cityK);
  if (!s.claims[cid]) return 'INTE DITT LAND';
  if (!unlocked(key, s.nation.research)) return 'KRÄVER FORSKNING';
  if (b.coastal && !isCoastal(cityK)) return 'KRÄVER KUSTSTAD';
  if (b.capital && cityK !== capitalKeyOf(cid)) return 'BARA I HUVUDSTADEN';
  if (!b.repeatable && (s.cityB[cityK] || []).includes(key)) return 'REDAN BYGGD';
  if (!powered().has(cityK)) return 'KRÄVER EL';
  if (s.res.money < costOf(b.cost)) return `KRÄVER ${costOf(b.cost)} \u{1F4B0}`;
  return null;
}

function buildBuilding(key, cityK) {
  const s = state.s;
  const why = canBuild(key, cityK);
  if (why) { warn(why); return; }
  const b = BUILDINGS[key];
  s.res.money -= costOf(b.cost);
  s.queue.push({ type: 'building', key, city: cityK, left: b.days, total: b.days });
  toast(`${b.icon} ${b.name} PÅBÖRJAD — KLAR OM ${b.days} DAGAR`, '', 4500);
  renderTop(); renderCityPanel();
}

function buildPlant(kind, cityK) {
  const s = state.s;
  const P = PLANTS[kind];
  const { cid } = splitKey(cityK);
  if (!s.claims[cid]) { warn('INTE DITT LAND'); return; }
  if (!plantUnlocked(kind, s.nation.research)) { warn('KRÄVER FORSKNING'); return; }
  if (s.res.money < costOf(P.cost)) { warn(`KRÄVER ${costOf(P.cost)} \u{1F4B0}`); return; }
  s.res.money -= costOf(P.cost);
  const id = 'p' + Date.now() + Math.floor(Math.random() * 999);
  s.plants.push({ id, city: cityK, kind, done: false, left: P.days });
  s.queue.push({ type: 'plant', id, left: P.days, total: P.days });
  toast(`${P.icon} ${P.name} PÅBÖRJAD I ${cityName(cityK)} — ${P.days} DAGAR`, '', 5000);
  renderTop(); renderCityPanel();
}

// ---------- byggläge: klicka stad A, sedan stad B ----------
function startBuildMode(kind) {
  state.build = { kind, first: null };
  $('#buildbar').style.display = 'flex';
  updateBuildBar();
}

function cancelBuildMode() {
  state.build = null;
  $('#buildbar').style.display = 'none';
  globe.setPenPath(null);
}

function updateBuildBar() {
  const bm = state.build;
  if (!bm) return;
  const label = bm.kind === 'line' ? '\u{26A1} ELLEDNING' : `${LINK[bm.kind].icon} ${LINK[bm.kind].name}`;
  $('#buildhint').innerHTML = bm.first
    ? `${label}: FRÅN <b>${cityName(bm.first)}</b> — VÄLJ MÅLSTAD`
    : `${label}: VÄLJ FÖRSTA STADEN`;
}

function onCityClicked(city) {
  const cid = city.country;
  const key = cityKey(cid, city.idx);
  const bm = state.build;
  if (!bm) { state.selCity = key; openCityPanel(key); return; }
  if (!state.s.claims[cid]) { warn('DU KONTROLLERAR INTE DET LANDET'); return; }
  if (!bm.first) { bm.first = key; updateBuildBar(); return; }
  if (bm.first === key) { warn('VÄLJ EN ANNAN STAD'); return; }
  if (bm.kind === 'line') finishLine(bm.first, key);
  else finishLink(bm.kind, bm.first, key);
}

function finishLine(a, b) {
  const s = state.s;
  const km = kmBetween(cityLL(a), cityLL(b));
  const rm = researchMods(s.nation.research);
  const cost = Math.round(costOf(lineCost(km)) * (1 + (rm.lineCost || 0) / 100));
  if (s.res.money < cost) { warn(`ELLEDNINGEN KOSTAR ${cost} \u{1F4B0} — DU HAR ${Math.floor(s.res.money)}`); return; }
  if (s.lines.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a))) { warn('LEDNINGEN FINNS REDAN'); return; }
  s.res.money -= cost;
  const id = 'l' + Date.now();
  const days = lineDays(km);
  s.lines.push({ id, a, b, km, done: false, left: days });
  s.queue.push({ type: 'line', id, left: days, total: days });
  toast(`\u{26A1} ELLEDNING PÅBÖRJAD ${cityName(a)} \u{2192} ${cityName(b)} — ${km} KM, ${cost} \u{1F4B0}, ${days} DAGAR`, '', 6000);
  cancelBuildMode(); renderTop(); pushInfra();
}

function finishLink(kind, a, b) {
  const s = state.s;
  const km = kmBetween(cityLL(a), cityLL(b));
  const key = linkKey(kind, a, b);
  if (s.links[key]) { warn('FÖRBINDELSEN FINNS REDAN — UPPGRADERA DEN I STÄLLET'); return; }
  for (const k of [a, b]) {
    const why = canLinkCountry(splitKey(k).cid);
    if (why) { warn(why); return; }
  }
  const ctx = { powered: powered(), cityBuildings: s.cityB, nameOf: cityName, isCoastal };
  const bl = blockers(kind, a, b, ctx);
  if (bl.length) { warn(bl[0]); return; }
  const cost = costOf(linkCost(kind, km));
  if (s.res.money < cost) { warn(`KRÄVER ${cost} \u{1F4B0} — DU HAR ${Math.floor(s.res.money)}`); return; }
  s.res.money -= cost;
  s.links[key] = makeLink(kind, a, b, cityLL(a), cityLL(b));
  const inc = payload(s.links[key], linkIncomeMult(s.nation.research, kind) * ideoLinkMult(s.nation.ideology));
  toast(`${LINK[kind].icon} ${LINK[kind].name} BYGGD: ${cityName(a)} \u{2194} ${cityName(b)} — ${km} KM, ${inc} \u{1F4B0} PER LEVERANS`, 'amber', 7000);
  cancelBuildMode(); renderTop(); pushInfra();
}

function upgradeLink(key) {
  const s = state.s;
  const l = s.links[key];
  if (!l || l.level >= MAX_LINK_LEVEL) { warn('REDAN PÅ HÖGSTA NIVÅ'); return; }
  const cost = costOf(upgradeCost(l.kind, l.km, l.level));
  if (s.res.money < cost) { warn(`UPPGRADERINGEN KOSTAR ${cost} \u{1F4B0}`); return; }
  s.res.money -= cost;
  addCar(l);
  toast(`${LINK[l.kind].icon} ${LINK[l.kind].name} UPPGRADERAD TILL NIVÅ ${l.level} — ${l.level} FORDON`, 'amber', 6000);
  renderTop(); pushInfra(); renderCityPanel();
}

// ---------- kartan ----------
function pushInfra() {
  const s = state.s;
  if (!s) return;
  const links = Object.values(s.links).map((l) => ({
    kind: l.kind, a: cityLL(l.a), b: cityLL(l.b), level: l.level,
    cars: l.cars.map(carPos),
  }));
  const lines = s.lines.map((l) => ({ a: cityLL(l.a), b: cityLL(l.b), done: l.done }));
  // AI-ländernas nät ritas också — dämpat, men synligt
  const t = performance.now();
  for (const al of state.world.aiLinks || []) {
    const cyc = al.kind === 'rail' ? 14000 : 22000;
    links.push({ kind: al.kind, a: al.a, b: al.b, level: 1, ai: true,
      cars: [((t / cyc) + al.phase) % 1] });
  }
  const plants = s.plants.map((p) => ({ ll: cityLL(p.city), done: p.done }));
  globe.setInfra(links, lines, plants);
}

function applyState() {
  const s = state.s;
  globe.setClaims(Object.fromEntries(Object.entries(s?.claims || {}).map(([k, v]) => [k, { color: v.color }])));
  pushInfra();
}

// ---------- UI ----------
function renderTop() {
  const s = state.s;
  if (!s) return;
  const e = econSnapshot();
  const f = (n) => (n >= 0 ? '+' : '') + n.toFixed(1);
  if (!$('#resbar')) return;
  $('#topleft').innerHTML = `TRADE WARS V${VERSION} <span style="color:var(--holo-dim)">// DAG ${state.clock.day}</span>`;
  $('#resbar').innerHTML = [
    `\u{1F4B0} ${Math.floor(s.res.money)} <small>${f(e.inc.money)}</small>`,
    `\u{1F52C} ${Math.floor(s.res.research)} <small>${f(e.inc.research)}</small>`,
    `\u{2696}\u{FE0F} ${Math.floor(s.res.pp)} <small>${f(e.inc.pp)}</small>`,
    `\u{1F9CD} ${Math.floor(s.res.man)} <small>${f(e.inc.man)}</small>`,
    `\u{26A1} <span style="color:${e.mw > e.cap ? 'var(--red)' : 'var(--holo)'}">${Math.round(e.mw)}/${e.cap} MW</span>`,
  ].join(' &nbsp; ');
}

function openCityPanel(key) {
  state.selCity = key;
  $('#citypanel').style.display = 'block';
  renderCityPanel();
}

function renderCityPanel() {
  const key = state.selCity;
  if (!key) return;
  const s = state.s;
  const { cid } = splitKey(key);
  const c = cityOf(key);
  const isCap = key === capitalKeyOf(cid);
  const pw = powered();
  const has = s.cityB[key] || [];
  const res = cityResource(key);
  const e = econSnapshot();

  $('#cpname').innerHTML = `${isCap ? '\u{2B50} ' : ''}${(c.n || '?').toUpperCase()}`
    + `<div style="font-size:6px;color:var(--holo-dim);line-height:2">${cname(cid)}`
    + ` \u{2022} ${(c.p / 1000).toFixed(0)}K INV`
    + ` \u{2022} ${pw.has(key) ? '<span style="color:#4ae37a">\u{26A1} EL</span>' : '<span style="color:var(--red)">\u{26A1} SAKNAR EL</span>'}`
    + (isCoastal(key) ? ' \u{2022} \u{2693} KUST' : '')
    + (res ? ` \u{2022} ${RESOURCES[res].icon} ${RESOURCES[res].name}` : '')
    + '</div>';

  const body = $('#cpbody');
  body.innerHTML = '';

  if (!s.claims[cid]) {
    body.innerHTML = '<div class="dim">DU KONTROLLERAR INTE DET HÄR LANDET.</div>';
    return;
  }

  // befintliga byggnader
  if (has.length) {
    const g = document.createElement('div');
    g.innerHTML = '<div class="sub">BYGGT HÄR</div>';
    for (const k of has) {
      const b = BUILDINGS[k];
      g.innerHTML += `<div class="brow"><span>${b.icon} ${b.name}</span>`
        + `<span class="dim">${b.upkeep} \u{1F4B0}/DAG \u{2022} ${b.mw} MW</span></div>`;
    }
    body.appendChild(g);
  }

  // kraftverk i staden
  const mine = s.plants.filter((p) => p.city === key);
  if (mine.length) {
    const g = document.createElement('div');
    g.innerHTML = '<div class="sub">KRAFT</div>';
    for (const p of mine) {
      const P = PLANTS[p.kind];
      g.innerHTML += `<div class="brow"><span>${P.icon} ${P.name}</span>`
        + `<span class="dim">${p.done ? P.mw + ' MW' : 'BYGGS — ' + p.left + ' DAGAR'}</span></div>`;
    }
    body.appendChild(g);
  }

  // förbindelser som rör staden
  const linked = Object.entries(s.links).filter(([, l]) => l.a === key || l.b === key);
  if (linked.length) {
    const g = document.createElement('div');
    g.innerHTML = '<div class="sub">FÖRBINDELSER</div>';
    body.appendChild(g);
    for (const [lk, l] of linked) {
      const other = l.a === key ? l.b : l.a;
      const inc = payload(l, linkIncomeMult(s.nation.research, l.kind) * ideoLinkMult(s.nation.ideology));
      const row = document.createElement('div');
      row.className = 'brow';
      row.innerHTML = `<span>${LINK[l.kind].icon} ${cityName(other)} <span class="dim">NIVÅ ${l.level}</span></span>`
        + `<span class="dim">${l.km} KM \u{2022} ${inc} \u{1F4B0}/LEV</span>`;
      g.appendChild(row);
      if (l.level < MAX_LINK_LEVEL) {
        const up = document.createElement('button');
        up.className = 'minibtn';
        up.textContent = `UPPGRADERA TILL NIVÅ ${l.level + 1} — ${costOf(upgradeCost(l.kind, l.km, l.level))} \u{1F4B0}`;
        up.onclick = () => upgradeLink(lk);
        g.appendChild(up);
      }
    }
  }

  // bygg kraft
  const pg = document.createElement('div');
  pg.innerHTML = '<div class="sub">BYGG KRAFT</div>';
  for (const [k, P] of Object.entries(PLANTS)) {
    if (!plantUnlocked(k, s.nation.research)) continue;
    const btn = document.createElement('button');
    btn.className = 'bbtn';
    btn.innerHTML = `${P.icon} ${P.name} <span class="dim">${P.mw} MW \u{2022} ${costOf(P.cost)} \u{1F4B0} \u{2022} ${P.days} D \u{2022} ${P.upkeep}/DAG</span>`
      + `<div class="bdesc">${P.desc}</div>`;
    btn.onclick = () => buildPlant(k, key);
    pg.appendChild(btn);
  }
  body.appendChild(pg);

  // bygg byggnader
  const bg = document.createElement('div');
  bg.innerHTML = '<div class="sub">BYGG</div>';
  for (const [k, b] of Object.entries(BUILDINGS)) {
    if (!unlocked(k, s.nation.research)) continue;
    if (b.capital && !isCap) continue;
    if (b.coastal && !isCoastal(key)) continue;
    if (!b.repeatable && has.includes(k)) continue;
    const why = canBuild(k, key);
    const btn = document.createElement('button');
    btn.className = 'bbtn' + (why ? ' off' : '');
    const y = Object.entries(b.yield || {}).map(([kk, v]) => `${POINTS[kk].icon}+${v}`).join(' ');
    btn.innerHTML = `${b.icon} ${b.name} <span class="dim">${costOf(b.cost)} \u{1F4B0} \u{2022} ${b.days} D \u{2022} ${b.upkeep}/DAG \u{2022} ${b.mw} MW ${y}</span>`
      + `<div class="bdesc">${why ? '<span style="color:var(--red)">' + why + '</span> \u{2022} ' : ''}${b.desc}</div>`;
    btn.onclick = () => buildBuilding(k, key);
    bg.appendChild(btn);
  }
  body.appendChild(bg);
}

// ---------- NATIONSPANELEN ----------
let natTab = 'forskning';

function openNation(tab) {
  if (tab) natTab = tab;
  $('#nation').classList.add('show');
  renderNation();
}

function renderNation() {
  const s = state.s;
  if (!s) return;
  for (const b of document.querySelectorAll('.nattab')) b.classList.toggle('on', b.dataset.tab === natTab);
  const body = $('#natbody');
  body.innerHTML = '';
  if (natTab === 'stader') renderCitiesTab(body);
  else if (natTab === 'oversikt') renderOverviewTab(body);
  else if (natTab === 'ideologi') renderIdeologyTab(body);
  else if (natTab === 'forskning') renderResearchTab(body);
  else if (natTab === 'lager') renderStoreTab(body);
  else if (natTab === 'marknad') renderMarketTab(body);
  else renderDefenceTab(body);
}

// --- FORSKNING ---
function renderResearchTab(body) {
  const s = state.s;
  const active = s.queue.find((q) => q.type === 'research');
  body.innerHTML = `<div class="dim" style="line-height:2;margin-bottom:8px">`
    + `FORSKNING KOMMER FRÅN SKOLOR OCH UNIVERSITET. BYGG DEM FÖRST — UTAN BYGGNADER`
    + ` TICKAR DET IN ${BASE.research} \u{1F52C} PER DAG OCH INGENTING HÄNDER.</div>`
    + (active ? `<div class="sub">PÅGÅR</div><div class="brow"><span>${active.name}</span>`
      + `<span class="dim">${active.left} DAGAR KVAR</span></div>` : '');

  const groups = { infra: 'INFRASTRUKTUR & ENERGI', civil: 'CIVILT', mil: 'MILITÄRT' };
  for (const [g, label] of Object.entries(groups)) {
    const head = document.createElement('div');
    head.className = 'sub';
    head.textContent = label;
    body.appendChild(head);
    for (const [bid, def] of Object.entries(RESEARCH)) {
      if (def.group !== g) continue;
      const done = s.nation.research[bid] || 0;
      const row = document.createElement('div');
      row.style.cssText = 'margin:7px 0';
      row.innerHTML = `<div style="font-size:7px;color:var(--holo)">${def.icon} ${def.name.toUpperCase()}`
        + ` <span class="dim">NIVÅ ${done}/${def.tiers.length}</span></div>`;
      body.appendChild(row);
      const next = def.tiers[done];
      if (!next) {
        row.innerHTML += '<div class="dim">FULLT UTFORSKAD</div>';
        continue;
      }
      const cost = TIER_COST[done], days = TIER_DAYS[done];
      const btn = document.createElement('button');
      const can = s.res.research >= cost && !active;
      btn.className = 'bbtn' + (can ? '' : ' off');
      btn.innerHTML = `${next.name} <span class="dim">${cost} \u{1F52C} \u{2022} ${days} DAGAR</span>`
        + `<div class="bdesc">${next.desc || ''}</div>`;
      btn.onclick = () => {
        if (active) { warn('EN FORSKNING I TAGET'); return; }
        if (s.res.research < cost) { warn(`KRÄVER ${cost} \u{1F52C} — DU HAR ${Math.floor(s.res.research)}`); return; }
        s.res.research -= cost;
        s.queue.push({ type: 'research', branch: bid, tier: done + 1, name: next.name, left: days, total: days });
        toast(`\u{1F52C} ${next.name.toUpperCase()} PÅBÖRJAD — ${days} DAGAR`, '', 5000);
        renderTop(); renderNation();
      };
      row.appendChild(btn);
    }
  }
}

// --- LAGER ---
function renderStoreTab(body) {
  const s = state.s;
  const cap = capitalKeyOf(s.home);
  const held = Object.entries(s.store.qty).filter(([, q]) => q > 0);
  const used = held.reduce((a, [, q]) => a + q, 0);
  body.innerHTML = `<div class="dim" style="line-height:2;margin-bottom:8px">`
    + `RÅVAROR SAMLAS BARA I HUVUDSTADEN (${cityName(cap)}). EN STAD MED RÅVARA MÅSTE`
    + ` VARA KOPPLAD DIT MED EN FÖRBINDELSE — DÅ BÄR VARJE LEVERANS MED SIG RÅVARAN.</div>`
    + `<div class="sub">LAGER ${used} / ${s.store.cap}</div>`;
  if (!s.store.cap) {
    body.innerHTML += '<div class="dim">DU HAR INGET RÅVARULAGER. BYGG ETT I HUVUDSTADEN.</div>';
  } else if (!held.length) {
    body.innerHTML += '<div class="dim">TOMT. KOPPLA IHOP EN RÅVARUSTAD MED HUVUDSTADEN.</div>';
  } else {
    for (const [r, q] of held) {
      body.innerHTML += `<div class="brow"><span>${RESOURCES[r].icon} ${RESOURCES[r].name}</span>`
        + `<span class="dim">${q} ENHETER</span></div>`;
    }
  }

  // vilka av dina städer har råvaror, och är de kopplade?
  const head = document.createElement('div');
  head.className = 'sub';
  head.textContent = 'RÅVAROR I DITT RIKE';
  body.appendChild(head);
  let any = false;
  for (const cid of Object.keys(s.claims)) {
    (state.cities[cid] || []).forEach((c, i) => {
      const k = cityKey(cid, i);
      const r = cityResource(k);
      if (!r) return;
      any = true;
      const linked = connectedToCapital(s.links, k, cap);
      const row = document.createElement('div');
      row.className = 'brow';
      row.innerHTML = `<span>${RESOURCES[r].icon} ${cityName(k)}</span>`
        + `<span style="color:${linked ? 'var(--green)' : 'var(--red)'}">${linked ? 'KOPPLAD' : 'EJ KOPPLAD'}</span>`;
      body.appendChild(row);
    });
  }
  if (!any) body.innerHTML += '<div class="dim">INGA RÅVARUSTÄDER FUNNA ÄNNU.</div>';
}

// --- MARKNAD ---
function renderMarketTab(body) {
  const s = state.s;
  const cap = capitalKeyOf(s.home);
  const capLL = cityLL(cap);
  // sjöfart går bara att välja om du har en hamnstad kopplad till huvudstaden
  const seaOk = Object.values(s.links).some((l) => l.kind === 'sea')
    || Object.keys(s.cityB).some((k) => (s.cityB[k] || []).includes('harbour') && connectedToCapital(s.links, k, cap));
  const listings = buildListings(state.world, hashId).slice(0, 40);
  body.innerHTML = `<div class="dim" style="line-height:2;margin-bottom:8px">`
    + `KÖPER DU EN RÅVARA BETALAR DU SÄLJARENS PRIS <b>PLUS FRAKTEN</b> — OCH FRAKTEN ÄR`
    + ` EXAKT DEN INTÄKT TRANSPORTEN HADE GETT DIG ÅT ANDRA HÅLLET. FLYG GÅR ALLTID.`
    + ` SJÖFART KRÄVER EN HAMN SOM HÄNGER IHOP MED HUVUDSTADEN.</div>`
    + `<div class="sub">UTBUD (${listings.length})</div>`;
  if (!listings.length) {
    body.innerHTML += '<div class="dim">INGET LAND HAR NÅGOT ATT SÄLJA ÄNNU. VÄRLDEN BYGGER FORTFARANDE UPP SIG.</div>';
    return;
  }
  if (!s.store.cap) {
    body.innerHTML += '<div style="color:var(--red);font-size:7px;line-height:2">DU BEHÖVER ETT RÅVARULAGER FÖR ATT KUNNA TA EMOT KÖP.</div>';
  }
  for (const L of listings) {
    const km = kmBetween(capLL, L.ll);
    const opts = transportOptions(km, { seaOk, landOk: false });
    const row = document.createElement('div');
    row.style.cssText = 'margin:8px 0;border-left:2px solid rgba(255,176,46,0.5);padding-left:7px';
    row.innerHTML = `<div style="font-size:7px">${RESOURCES[L.res].icon} <b>${RESOURCES[L.res].name}</b>`
      + ` <span class="dim">FRÅN ${cname(L.cid)} \u{2022} ${L.qty} ENH \u{2022} ${L.ask} \u{1F4B0}/ENH \u{2022} ${km} KM</span></div>`;
    for (const o of opts) {
      const total = L.ask + o.cost;
      const btn = document.createElement('button');
      btn.className = 'minibtn';
      btn.innerHTML = `${LINK[o.kind].icon} ${LINK[o.kind].name}: ${total} \u{1F4B0} `
        + `<span class="dim">(${L.ask} PRIS + ${o.cost} FRAKT) \u{2022} ${o.days} DAGAR</span>`;
      btn.onclick = () => buyResource(L, o, total);
      row.appendChild(btn);
    }
    body.appendChild(row);
  }
}

function buyResource(listing, opt, total) {
  const s = state.s;
  if (!s.store.cap) { warn('DU SAKNAR RÅVARULAGER'); return; }
  const used = Object.values(s.store.qty).reduce((a, b) => a + b, 0);
  if (used >= s.store.cap) { warn('LAGRET ÄR FULLT — BYGG UT DET'); return; }
  if (s.res.money < total) { warn(`KRÄVER ${total} \u{1F4B0} — DU HAR ${Math.floor(s.res.money)}`); return; }
  s.res.money -= total;
  const st = state.world.stores[listing.cid];
  if (st) st.qty[listing.res] = Math.max(0, (st.qty[listing.res] || 0) - 1);
  // leveransen tar tid — den landar i lagret när frakten är framme
  s.queue.push({ type: 'buy', res: listing.res, left: opt.days, total: opt.days });
  toast(`${LINK[opt.kind].icon} ${RESOURCES[listing.res].name} KÖPT FRÅN ${cname(listing.cid)} — FRAMME OM ${opt.days} DAGAR`, 'amber', 6000);
  renderTop(); renderNation();
}

// --- TOTALFÖRSVAR ---
function renderDefenceTab(body) {
  const s = state.s;
  const e = econSnapshot();
  body.innerHTML = `<div class="dim" style="line-height:2;margin-bottom:8px">`
    + `TOTALFÖRSVAR ERSÄTTER KASERNER. DET ÄR ETT LANDSOMFATTANDE PROGRAM MED DAGLIGT`
    + ` UNDERHÅLL — DET GÅR INTE ATT STARTA I BÖRJAN, UTAN FÖRST NÄR EKONOMIN BÄR DET.</div>`
    + `<div class="brow"><span>NETTOINKOMST</span><span class="${e.inc.money >= DEFENCE.minIncome ? 'dim' : ''}"`
    + ` style="color:${e.inc.money >= DEFENCE.minIncome ? 'var(--green)' : 'var(--red)'}">`
    + `${e.inc.money.toFixed(1)} / ${DEFENCE.minIncome} \u{1F4B0} PER DAG</span></div>`
    + `<div class="brow"><span>KOSTNAD</span><span class="dim">${DEFENCE.upkeep} \u{1F4B0}/DAG</span></div>`
    + `<div class="brow"><span>GER</span><span class="dim">+${DEFENCE.manPerDay} \u{1F9CD}/DAG \u{2022} +${DEFENCE.readiness}% I STRID</span></div>`;
  const btn = document.createElement('button');
  btn.className = 'btn amber';
  if (s.defence) {
    btn.textContent = '\u{1F6D1} LÄGG NER TOTALFÖRSVARET';
    btn.onclick = () => { s.defence = false; toast('TOTALFÖRSVARET AVVECKLAT', '', 5000); renderTop(); renderNation(); };
  } else {
    const ok = e.inc.money >= DEFENCE.minIncome;
    btn.className = 'btn amber' + (ok ? '' : ' off');
    btn.textContent = ok ? '\u{1F6E1}\u{FE0F} STARTA TOTALFÖRSVARET' : 'EKONOMIN BÄR DET INTE ÄNNU';
    btn.onclick = () => {
      if (e.inc.money < DEFENCE.minIncome) {
        warn(`KRÄVER ${DEFENCE.minIncome} \u{1F4B0}/DAG I NETTO — DU HAR ${e.inc.money.toFixed(1)}`);
        return;
      }
      s.defence = true;
      toast('\u{1F6E1}\u{FE0F} TOTALFÖRSVARET ÄR I GÅNG', 'amber', 7000);
      renderTop(); renderNation();
    };
  }
  body.appendChild(btn);

  // enheter går att bygga när manskapet räcker
  const ug = document.createElement('div');
  ug.innerHTML = '<div class="sub">VÄRVA FÖRBAND</div>';
  for (const [unit, c] of [['INFANTERI', INF_COST], ['STRIDSVAGN', TANK_COST], ['FLYGPLAN', AIR_COST]]) {
    const b2 = document.createElement('button');
    const ok = s.res.money >= c.money && s.res.man >= c.man;
    b2.className = 'bbtn' + (ok ? '' : ' off');
    b2.innerHTML = `${unit} <span class="dim">${c.money} \u{1F4B0} \u{2022} ${c.man} \u{1F9CD}</span>`;
    b2.onclick = () => {
      if (s.res.money < c.money || s.res.man < c.man) { warn('RÄCKER INTE'); return; }
      s.res.money -= c.money; s.res.man -= c.man;
      s.queue.push({ type: 'unit', unit, left: 20, total: 20 });
      toast(`\u{2694}\u{FE0F} ${unit} PÅBÖRJAT — 20 DAGAR`, '', 5000);
      renderTop(); renderNation();
    };
    ug.appendChild(b2);
  }
  body.appendChild(ug);
}


// --- ÖVERSIKT: rikets läge på en skärm ---
function renderOverviewTab(body) {
  const s = state.s;
  const e = econSnapshot();
  const pw = powered();
  const cities = (state.cities[s.home] || []).length;
  const built = Object.values(s.cityB).reduce((a, x) => a + x.length, 0);
  const row = (k, v, col) => '<div class="brow"><span>' + k + '</span>'
    + '<span style="color:' + (col || 'var(--holo-dim)') + '">' + v + '</span></div>';
  body.innerHTML = '<div class="sub">' + cname(s.home) + '</div>'
    + row('DAG', state.clock.day)
    + row('IDEOLOGI', IDEOLOGIES[s.nation.ideology].icon + ' ' + IDEOLOGIES[s.nation.ideology].name.toUpperCase(), 'var(--amber)')
    + row('STÄDER', pw.size + ' MED EL AV ' + cities)
    + row('BYGGNADER', built)
    + row('FÖRBINDELSER', Object.keys(s.links).length)
    + row('ELNÄT', s.lines.filter((l) => l.done).length + ' LEDNINGAR')
    + '<div class="sub">DAGLIGT</div>'
    + row('PENGAR', e.inc.money.toFixed(1), e.inc.money >= 0 ? 'var(--green)' : 'var(--red)')
    + row('UNDERHÅLL', '-' + e.upkeep.toFixed(1), 'var(--red)')
    + row('FORSKNING', '+' + e.inc.research.toFixed(1))
    + row('POLITISK MAKT', '+' + e.inc.pp.toFixed(1))
    + row('MANSKAP', '+' + e.inc.man.toFixed(1))
    + row('STRÖM', Math.round(e.mw) + ' / ' + e.cap + ' MW', e.mw > e.cap ? 'var(--red)' : 'var(--green)')
    + '<div class="sub">BYGGKÖ (' + s.queue.length + ')</div>';
  if (!s.queue.length) body.innerHTML += '<div class="dim">INGET PÅGÅR.</div>';
  for (const j of s.queue.slice(0, 12)) {
    const name = j.type === 'building' ? BUILDINGS[j.key].name
      : j.type === 'plant' ? 'KRAFTVERK'
        : j.type === 'line' ? 'ELLEDNING'
          : j.type === 'research' ? j.name
            : j.type === 'buy' ? 'LEVERANS ' + RESOURCES[j.res].name : j.unit;
    body.innerHTML += '<div class="brow"><span>' + name + '</span>'
      + '<span class="dim">' + j.left + ' / ' + j.total + ' DAGAR</span></div>';
  }
}

// --- IDEOLOGI: bonusarna är satta efter vad systemen faktiskt gör ---
function renderIdeologyTab(body) {
  const s = state.s;
  body.innerHTML = '<div class="dim" style="line-height:2;margin-bottom:8px">'
    + 'IDEOLOGIN STYR BASPOÄNGEN, BYGGKOSTNADEN OCH UNDERHÅLLET. BYTE KOSTAR 60 POLITISK MAKT.</div>';
  for (const [id, io] of Object.entries(IDEOLOGIES)) {
    const cur = id === s.nation.ideology;
    const mods = Object.entries(io.mods)
      .map(([k, v]) => (POINTS[k] ? POINTS[k].icon : k.toUpperCase()) + ' ' + (v > 0 ? '+' : '') + v + '%')
      .join('  ');
    const btn = document.createElement('button');
    btn.className = 'bbtn' + (cur ? '' : '');
    btn.style.borderColor = cur ? 'var(--amber)' : '';
    btn.innerHTML = io.icon + ' <b>' + io.name.toUpperCase() + '</b>'
      + (cur ? ' <span style="color:var(--amber)">NUVARANDE</span>' : '')
      + '<div class="bdesc">' + io.desc + '</div>'
      + '<div class="bdesc" style="color:var(--holo)">' + mods + '</div>';
    btn.onclick = () => {
      if (cur) return;
      if (s.res.pp < 60) { warn('KRÄVER 60 POLITISK MAKT'); return; }
      s.res.pp -= 60;
      s.nation.ideology = id;
      toast(io.icon + ' ' + io.name.toUpperCase() + ' INFÖRD', 'amber', 6000);
      renderTop(); renderNation();
    };
    body.appendChild(btn);
  }
}


// --- STÄDER: hela riket i en lista, med väg in i varje stads byggmeny ---
// Det gick tidigare bara att öppna en stad genom att pricka den på klotet.
// Här ligger alla, sorterade så de som saknar el ligger överst — det är de
// som blockerar dig.
function renderCitiesTab(body) {
  const s = state.s;
  const pw = powered();
  const cap = capitalKeyOf(s.home);
  body.innerHTML = '<div class="dim" style="line-height:2;margin-bottom:8px">'
    + 'KLICKA EN STAD FÖR ATT ÖPPNA DESS BYGGMENY. STÄDER UTAN EL LIGGER ÖVERST —'
    + ' DET ÄR DE SOM STOPPAR DIG. DRA ELLEDNING DIT FÖRST.</div>';

  for (const cid of Object.keys(s.claims)) {
    const list = state.cities[cid] || [];
    const rows = list.map((c, i) => {
      const k = cityKey(cid, i);
      return {
        k, c,
        el: pw.has(k),
        cap: k === cap,
        n: (s.cityB[k] || []).length,
        res: cityResource(k),
        links: Object.values(s.links).filter((l) => l.a === k || l.b === k).length,
      };
    });
    // utan el först, sedan huvudstaden, sedan de mest utbyggda
    rows.sort((a, b) => (a.el ? 1 : 0) - (b.el ? 1 : 0)
      || (b.cap ? 1 : 0) - (a.cap ? 1 : 0) || b.n - a.n);

    const head = document.createElement('div');
    head.className = 'sub';
    head.textContent = cname(cid) + ' — ' + rows.filter((r) => r.el).length + ' AV ' + rows.length + ' MED EL';
    body.appendChild(head);

    for (const r of rows) {
      const btn = document.createElement('button');
      btn.className = 'bbtn';
      const tags = [];
      if (r.cap) tags.push('\u{2B50} HUVUDSTAD');
      if (!r.el) tags.push('<span style="color:var(--red)">\u{26A1} SAKNAR EL</span>');
      else tags.push('<span style="color:var(--green)">\u{26A1} EL</span>');
      if (r.n) tags.push(r.n + ' BYGGNADER');
      if (r.links) tags.push(r.links + ' FÖRBINDELSER');
      if (r.res) tags.push(RESOURCES[r.res].icon + ' ' + RESOURCES[r.res].name);
      if (isCoastal(r.k)) tags.push('\u{2693} KUST');
      btn.innerHTML = '<b>' + (r.c.n || '?').toUpperCase() + '</b>'
        + '<div class="bdesc">' + tags.join(' \u{2022} ') + '</div>';
      btn.onclick = () => {
        openCityPanel(r.k);
        globe.animateTo(r.c.ll, Math.max(globe.zoom, 4), 900);
      };
      body.appendChild(btn);
    }
  }
}

// ---------- AI: bygger upp sitt eget land ----------
function aiTick() {
  const w = state.world;
  w.dev ||= {};
  if (state.clock.day % 6 !== 0) return;
  const pool = globe.countries.filter((c) => !state.s.claims[c.id]);
  if (!pool.length) return;
  // några länder i taget skruvar upp sin utveckling — det driver deras
  // priser på marknaden och hur mycket de har att sälja
  w.aiLinks ||= [];
  for (let i = 0; i < 3; i++) {
    const c = pool[Math.floor(Math.random() * pool.length)];
    const d = (w.dev[c.id] ||= { level: 0, power: 0, links: 0 });
    const r = Math.random();
    if (r < 0.4) {
      d.power++;
    } else if (r < 0.8) {
      d.links++;
      aiBuildLink(c.id, d);      // AI:ns nät ska SYNAS, inte bara vara en siffra
    } else {
      d.level++;
    }
  }
  // deras lager fylls på i takt med utvecklingen
  // Lagren fylls hos de länder som FAKTISKT byggt nät — inte hos de fyrtio
  // första i listan, vilket gjorde marknaden slumpmässigt tom.
  w.stores ||= {};
  for (const [cid, d] of Object.entries(w.dev)) {
    if (!d || d.links < 2 || state.s.claims[cid]) continue;
    const c = globe.getCountry(cid);
    if (!c) continue;
    const st = (w.stores[c.id] ||= { qty: {}, dev: 0.5, ll: c.centroid });
    st.dev = Math.min(1.6, 0.4 + d.level * 0.08);
    const list = resourcesOf(c.id, hashId);
    const res = list[state.clock.day % list.length];
    st.qty[res] = Math.min(60, (st.qty[res] || 0) + 1);
  }
}

// AI-länderna drar sina egna linjer mellan sina största städer. De ritas
// dämpade på kartan så man ser vilka riken som faktiskt byggt upp sig — och
// vem det därför är värt att handla med.
function aiBuildLink(cid, d) {
  const w = state.world;
  const list = state.cities[cid] || [];
  if (list.length < 4) return;
  if (w.aiLinks.filter((l) => l.cid === cid).length >= 6) return;
  // huvudstaden är navet; nya linjer går ut till de största städerna
  const capI = Math.max(0, list.findIndex((c) => c.c));
  const order = list.map((c, i) => ({ c, i })).filter((x) => x.i !== capI)
    .sort((a, b) => b.c.p - a.c.p);
  const pick = order[w.aiLinks.filter((l) => l.cid === cid).length];
  if (!pick) return;
  const kind = d.links > 4 ? 'rail' : 'road';
  w.aiLinks.push({ cid, kind, a: list[capI].ll, b: pick.c.ll, level: 1, phase: Math.random() });
}

// ---------- erövrade länder ----------
// Ett erövrat land får inte kopplas in i handelsnätet förrän det är HELT
// integrerat. Fram till dess är det ockuperat område, inte en del av riket.
function integrationOf(cid) {
  const s = state.s;
  if (cid === s.home) return 100;
  return Math.floor(s.integ?.[cid]?.pct ?? 0);
}

function canLinkCountry(cid) {
  const s = state.s;
  if (!s.claims[cid]) return 'DU KONTROLLERAR INTE LANDET';
  if (cid !== s.home && integrationOf(cid) < 100) {
    return `${cname(cid)} ÄR BARA ${integrationOf(cid)}% INTEGRERAT — HANDELSNÄTET KRÄVER 100%`;
  }
  return null;
}

function tickIntegration() {
  const s = state.s;
  for (const cid of Object.keys(s.claims)) {
    if (cid === s.home) continue;
    const it = (s.integ[cid] ||= { pct: 0 });
    if (it.pct >= 100) continue;
    it.pct = Math.min(100, it.pct + 0.35);
    if (it.pct >= 100) {
      toast(`\u{1F3F3}\u{FE0F} ${cname(cid)} ÄR HELT INTEGRERAT — NU GÅR DET ATT KOPPLA IN I HANDELSNÄTET`, 'amber', 9000);
    }
  }
}

// ---------- start ----------
async function boot() {
  $('#loading').textContent = 'LADDAR VÄRLDEN...';
  await loadWorld((countries, level, topo) => {
    state.countries = countries;
    globe.setCountries(countries);
    if (topo) globe.setTopology(topo);
  });
  state.cities = await loadCities();
  state.facts = await loadFacts();
  // städerna får sitt land inbakat så klick kan härleda nyckeln
  for (const [cid, list] of Object.entries(state.cities)) {
    for (const c of list) c.country = cid;
  }
  globe.setCities(state.cities);
  globe.onSelectCity = onCityClicked;
  globe.onSelect = (c) => showCountry(c);   // landsfaktan ska alltid svara på klick
  // V6 körs alltid i 3D — pixelläget finns inte här
  if (globe.setMode3D(true) !== true) {
    $('#loading').textContent = 'DIN WEBBLÄSARE SAKNAR WEBGL — TRADE WARS KRÄVER 3D';
    return;
  }
  $('#loading').style.display = 'none';
  $('#menu').classList.add('show');
}

$('#btnSolo')?.addEventListener('click', () => {
  $('#menu').classList.remove('show');
  if ($('#hud')) $('#hud').style.display = 'block';
  $('#toggles').style.display = 'flex';
  toast('VÄLJ DITT HEMLAND — KLICKA ETT LAND OCH TRYCK GÖR TILL HEMLAND', 'amber', 12000);
  globe.onSelect = (c) => showCountry(c);
});

// Landsfaktan: samma flöde som i V5 — klicka ett land, läs fakta, välj det.
function showCountry(c) {
  const panel = $('#infopanel');
  if (!c) { panel.style.display = 'none'; return; }
  state.selCountry = c.id;
  panel.style.display = 'block';
  $('#iname').textContent = c.name.toUpperCase();
  const f = state.facts[c.id] || {};
  const flag = $('#fflag');
  if (f.a2) {
    flag.src = 'https://flagcdn.com/w80/' + f.a2.toLowerCase() + '.png';
    flag.style.display = 'block';
  } else {
    flag.style.display = 'none';
  }
  const nCities = (state.cities[c.id] || []).length;
  $('#fpop').innerHTML = f.p ? '<b>INVÅNARE:</b> ' + (f.p / 1e6).toFixed(1) + ' MILJONER' : '';
  $('#fcap').innerHTML = f.c ? '<b>HUVUDSTAD:</b> ' + String(f.c).toUpperCase() : '';
  $('#fcity').innerHTML = '<b>STÄDER:</b> ' + nCities;
  const mine = state.s?.claims[c.id];
  $('#istatus').textContent = !state.s ? 'VÄLJ SOM HEMLAND'
    : mine ? (c.id === state.s.home ? 'DITT HEMLAND' : 'DITT — ' + integrationOf(c.id) + '% INTEGRERAT')
      : 'FRÄMMANDE LAND';
  const cb = $('#claimbtn');
  cb.style.display = state.s ? 'none' : 'block';
  cb.textContent = 'GÖR TILL HEMLAND';
  cb.onclick = () => { if (!state.s) startGame(c.id); };
  const fb = $('#fbuild');
  if (fb) fb.style.display = 'none';
  // NATION-knappen bor i landsfaktan — den MÅSTE visas för egna länder,
  // annars finns ingen väg in i menyerna alls
  const nb = $('#nationbtn');
  if (nb) {
    nb.style.display = mine ? 'block' : 'none';
    nb.onclick = () => openNation();
  }
}

function startGame(home) {
  newRealm(home);
  state.mode = 'solo';
  globe.onSelect = (c) => showCountry(c);
  applyState();
  if ($('#hud')) $('#hud').style.display = 'block';
  $('#toggles').style.display = 'flex';
  if ($('#claimbtn')) $('#claimbtn').style.display = 'none';

  globe.setDayFloat(state.clock.day);
  globe.animateTo(capitalLLOf(home), 3.2, 1600);
  renderTop();
  toast(`\u{1F3D7}\u{FE0F} ${cname(home)} — HUVUDSTADEN HAR ETT VINDKRAFTVERK. DRA EL TILL FLER STÄDER.`, 'amber', 12000);
  startClock();
}

function capitalLLOf(cid) { return cityLL(capitalKeyOf(cid)); }

function startClock() {
  setInterval(() => {
    if (state.clock.paused || !state.s) return;
    state.clock.acc += 250;
    if (state.clock.acc >= DAY_MS) { state.clock.acc = 0; tickDay(); }
    pushInfra();
  }, 250);
}

// byggknappar
for (const kind of ['road', 'rail', 'sea', 'air']) {
  $(`#bm_${kind}`)?.addEventListener('click', () => startBuildMode(kind));
}
$('#bm_line')?.addEventListener('click', () => startBuildMode('line'));
$('#bmcancel')?.addEventListener('click', cancelBuildMode);
$('#cpclose')?.addEventListener('click', () => { $('#citypanel').style.display = 'none'; });
$('#nationbtn')?.addEventListener('click', () => openNation());
$('#btnRiket')?.addEventListener('click', () => openNation());
$('#iclose')?.addEventListener('click', () => { if ($('#infopanel')) $('#infopanel').style.display = 'none'; });
$('#natclose')?.addEventListener('click', () => { $('#nation').classList.remove('show'); });
for (const b of document.querySelectorAll('.nattab')) {
  b.addEventListener('click', () => { natTab = b.dataset.tab; renderNation(); });
}

boot();

// för test och felsökning
state.debug = {
  tickDay: () => tickDay(), econ: () => econSnapshot(), powered: () => [...powered()],
  cityKey, capitalKeyOf, buildBuilding, buildPlant, finishLine, finishLink, openNation,
  integrationOf, canLinkCountry, aiTick: () => aiTick(),
  upgradeLink, startBuildMode, cityResource, startGame,
  BUILDINGS, PLANTS, LINK, RESEARCH,
};
