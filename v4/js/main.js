// IMPERIUM v4 — huvudflöde: nationssystem (stats/lagar/ideologi/forskning) + erövringsläge
import { Net } from './net.js';
import { loadWorld, loadCities, loadFacts } from './data.js';
import { Globe } from './globe.js';
import { RESOURCES, RECIPES, resourcesOf } from './resources.js';
import { STARTER_ARMY, defenderArmy, compOf, autoResolve, biomeFor, BIOMES, mkUnit, loadWarSprites, UNIT_TYPES, consolidate, expandUnits } from './units.js';
import { BattleA } from './battleA.js';
import { BattleB } from './battleB.js';
import { STATS, STAT_GROUPS, computeStats, statGoodness } from './stats.js';
import { LAWS, defaultLaws, lawMods, lawChangeCost, lawOption } from './laws.js';
import { IDEOLOGIES, countryIdeology, ideologyMods, lawLockedBy, enforceRequirements, IDEOLOGY_COST, DOCTRINE_COST } from './ideologies.js';
import { RESEARCH, TIER_COST, researchMods, combatBonus, hasUnlock, logisticsRange, satCoverage, espionageTier } from './research.js';
import { BUILDINGS, CITY_SLOTS, UNIT_NEEDS_BUILDING, TRADE_PRICES, TRADE_DEFAULT } from './buildings.js';
import { countryIncomeOf, armySizeOf } from './economy.js';
import { CASUS_BELLI, justifyDays, seizeAmount, FEDERATION_FORMS, HISTORICAL_EMPIRES, DYNAMIC_GOALS, formableEmpires, empireProgress } from './war.js';
import { FACTIONS } from './factions.js';
import { applyFaction } from './units.js';
import { pickLeader, leaderDesc } from './leaders.js';

const $ = (s) => document.querySelector(s);
const PLAYER_COLORS = ['#ff4f4f', '#4fa8ff', '#ffd24f', '#b06bff', '#ff9f3e', '#3ee6c8', '#ff6fd8', '#a4e34a'];
const SOLO_COLOR = '#ff4f4f';

const net = new Net();
const globe = new Globe($('#globe'));

const state = {
  mode: null,          // 'tv' | 'player' | 'solo'
  players: [],
  me: null,
  cities: {},
  facts: {},
  mapLevel: null,
  tvTimer: null,
  solo: null,          // {claims:{}, home, army:{units,ll,at}, prevAt}
  battle: null,
  pendingTarget: null,
};

window.IMPERIUM = state; // för test/debug
state.globe = globe;
state.debug = { aiTick: () => aiWorldTick(), arrivals: () => checkArrivals(), worldCtx: () => worldCtx(), updateMarkers: () => updateMovingMarkers(), updateCountryArmies: () => updateCountryArmyMarkers() };

document.fonts?.load('10px "Press Start 2P"').then(() => { globe.sceneDirty = true; }).catch(() => {});
loadWarSprites();

// ---------- hjälpare ----------
function show(el, on = true) { el.style.display = on ? 'block' : 'none'; }
function overlay(id, on) { $(id).classList.toggle('show', on); }

function toast(msg, cls = '', ms = 3500) {
  const el = document.createElement('div');
  el.className = 'toast ' + cls;
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 450); }, ms);
}

function fmtPop(p) {
  if (!p) return 'OKÄNT';
  if (p >= 1e6) return (p / 1e6).toFixed(1).replace('.', ',') + ' MILJONER';
  return p.toLocaleString('sv-SE');
}

function resIcons(countryId) {
  return resourcesOf(countryId).map((r) => RESOURCES[r].icon).join('');
}

function mergeMods(a, b) {
  const out = { ...(a || {}) };
  for (const [k, v] of Object.entries(b || {})) out[k] = (out[k] || 0) + v;
  return out;
}

function aiClaimsInto(m, world) {
  if (!world) return m;
  for (const [cid, conq] of Object.entries(world.aiOwned || {})) {
    if (m[cid]) continue;
    const emp = world.aiEmpires?.[conq];
    m[cid] = { color: emp?.color || '#7f8c8d', playerName: emp?.name || (globe.getCountry(conq)?.name ?? 'AI') };
  }
  for (const [conq, emp] of Object.entries(world.aiEmpires || {})) {
    if (emp.owned.length && !m[conq]) m[conq] = { color: emp.color, playerName: emp.name };
  }
  return m;
}

function claimsMap() {
  if (state.mode === 'solo') {
    return aiClaimsInto({ ...(state.solo?.claims || {}) }, state.solo);
  }
  // multiplayer: alla spelares välden + AI-världen från värden
  const claims = {};
  for (const p of state.players) {
    for (const cid of (p.claims || (p.home ? [p.home] : []))) {
      claims[cid] = { color: p.color, playerName: p.name, puppet: p.puppets?.includes(cid) };
    }
  }
  return aiClaimsInto(claims, state.mode === 'tv' ? state.hostWorld : state.aiWorldRemote);
}

// vilken spelare äger ett land? (multiplayer)
function playerOwning(cid) {
  return state.players.find((p) => (p.claims || (p.home ? [p.home] : [])).includes(cid)) || null;
}

function capitalLL(countryId) {
  const cap = (state.cities[countryId] || []).find((c) => c.c);
  return cap ? cap.ll : globe.getCountry(countryId)?.centroid || [0, 0];
}

function renderRoster() {
  const list = $('#rosterlist');
  list.innerHTML = '';
  for (const p of state.players) {
    const row = document.createElement('div');
    row.className = 'row';
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.style.background = p.color;
    const name = document.createElement('span');
    name.textContent = p.name;
    const home = document.createElement('span');
    home.className = 'home';
    const nClaims = (p.claims || []).length;
    home.textContent = p.home
      ? `— ${globe.getCountry(p.home)?.name || '?'} ${p.factionIcon || ''}${p.ideoIcon || IDEOLOGIES[countryIdeology(p.home).ideology].icon}${nClaims > 1 ? ` \u{1F30D}${nClaims}` : ''}${p.busy ? ' \u{2694}' : ''}`
      : '— väljer land…';
    row.append(chip, name, home);
    list.appendChild(row);
  }
  show($('#roster'), state.players.length > 0);
}

function renderTopbar() {
  const el = $('#topright');
  if (state.mode === 'tv') el.textContent = `RUM ${net.code} • ${state.players.length} SPELARE`;
  else if (state.mode === 'player') el.textContent = `${state.me?.name || ''} • RUM ${net.code || ''}`;
  else if (state.mode === 'solo') {
    const n = Object.keys(state.solo?.claims || {}).length;
    const form = state.solo?.nation?.formation;
    el.textContent = form ? `${form.name.toUpperCase()} • ${n} LÄNDER` : (n ? `ERÖVRADE LÄNDER: ${n}` : 'ERÖVRINGSLÄGE');
  }
}

function applyState() {
  globe.setClaims(claimsMap());
  renderRoster();
  renderTopbar();
  refreshInfoPanel();
}

// ---------- armé (solo-prototypen) ----------
// Ingen gratisarmé — den börjar TOM och byggs enhet för enhet i NATION-panelen
function spawnArmy(countryId) {
  state.solo.army = { units: [], ll: capitalLL(countryId), at: countryId };
  updateArmyMarker();
}

function updateArmyMarker() {
  const s = state.solo;
  const a = s?.army;
  globe.setArmy(a && a.units.length
    ? { ll: a.ll, comp: compOf(a.units), color: SOLO_COLOR, warn: !!s.supplyBad }
    : null);
  // garnisoner i alla länder man bygger i — banér med BYGGARENS flagga (ditt hemland)
  const homeA2 = s?.home ? state.facts[s.home]?.a2 || null : null;
  const gl = Object.entries(s?.garrisons || {})
    .filter(([, units]) => units.length)
    .map(([cid, units]) => ({ ll: capitalLL(cid), comp: compOf(units), color: '#ff9f8a', a2: homeA2 }));
  globe.setGarrisons(gl);
}

// avstånd (radianer) från armén till närmaste eget territorium.
// Står armén INUTI ett eget land är försörjningen alltid tryggad (0).
function supplyDistance() {
  const s = state.solo;
  if (!s?.army) return 0;
  const inside = globe.countryAtLL(s.army.ll);
  if (inside && (s.claims[inside.id] || inside.id === s.home)) return 0;
  let min = Infinity;
  for (const cid of [s.home, ...Object.keys(s.claims)]) {
    const c = globe.getCountry(cid);
    if (!c) continue;
    min = Math.min(min, d3.geoDistance(s.army.ll, c.centroid), d3.geoDistance(s.army.ll, capitalLL(cid)));
  }
  return min === Infinity ? 0 : min;
}

// långt hemifrån utan logistik → trupperna börjar långsamt dö
function supplyTick() {
  const s = state.solo;
  if (!s?.army?.units.length) { s.supplyBad = 0; return; }
  const dist = supplyDistance();
  const range = logisticsRange(s.nation);
  if (dist <= range) {
    if (s.supplyBad) { toast('\u{2705} FÖRSÖRJNINGSLINJERNA ÅTERUPPRÄTTADE', 'amber', 4000); }
    s.supplyBad = 0;
    return;
  }
  s.supplyBad = (s.supplyBad || 0) + 1;
  if (s.supplyBad === 1) {
    toast('\u{26A0}\u{FE0F} LOGISTIKEN SVIKTAR — TRUPPERNA BÖRJAR LÅNGSAMT DÖ. VÄND OM ELLER FORSKA LOGISTIK!', 'red', 9000);
  }
  // max 2 HP/dag — man hinner alltid vända om, men det KOSTAR
  const excess = dist - range;
  const dmg = Math.min(2, 0.4 + excess * 2);
  for (const u of s.army.units) u.hp -= dmg;
  const before = s.army.units.length;
  s.army.units = s.army.units.filter((u) => u.hp > 0);
  const lost = before - s.army.units.length;
  if (lost > 0) toast(`\u{1F480} ${lost} ENHET${lost > 1 ? 'ER' : ''} FÖRLORAD${lost > 1 ? 'E' : ''} I FÄLT — LOGISTIKEN RÄCKER INTE`, 'red', 6000);
  if (!s.army.units.length) toast('ARMÉN HAR SVULTIT IHJÄL — EN NY MÅSTE BYGGAS HEMMA', 'red', 8000);
  updateArmyMarker();
}

// Arméer marscherar långsamt — restiden beror på avståndet
function armyFlyTo(targetLL, _ms, done) {
  const s = state.solo;
  const a = s.army;
  const dist = d3.geoDistance(a.ll, targetLL);
  const ms = 4000 + dist * 60000; // grannland ≈ 10 s, andra sidan jorden ≈ minuter
  const interp = d3.geoInterpolate(a.ll, targetLL);
  const t0 = performance.now();
  const token = (s._marchId = (s._marchId || 0) + 1);
  s.chase = null; // en ny marschorder avbryter en pågående genskjutning
  s.armyMoving = true;
  toast(`ARMÉN MARSCHERAR — FRAMME OM ~${Math.round(ms / 1000)} SEK`, '', 4000);
  const step = (t) => {
    if (s._marchId !== token) return; // avbruten av nyare order
    const k = Math.min(1, (t - t0) / ms);
    a.ll = interp(k);
    updateArmyMarker();
    if (k < 1) requestAnimationFrame(step);
    else { s.armyMoving = false; done?.(); }
  };
  requestAnimationFrame(step);
}

// ---------- landsfakta-panelen ----------
let selectedCountry = null;

function refreshInfoPanel() {
  const panel = $('#infopanel');
  if (!selectedCountry) { show(panel, false); return; }
  const c = selectedCountry;
  const fact = state.facts[c.id] || {};
  $('#iname').textContent = c.name.toUpperCase();

  const flag = $('#fflag');
  if (fact.a2) {
    flag.src = `https://flagcdn.com/w80/${fact.a2.toLowerCase()}.png`;
    flag.style.display = 'block';
  } else {
    flag.style.display = 'none';
  }

  $('#fpop').innerHTML = `<b>INVÅNARE:</b> ${fmtPop(fact.p)}`;
  $('#fcap').innerHTML = fact.c ? `<b>HUVUDSTAD:</b> ${fact.c.toUpperCase()}` : '';
  const nCities = (state.cities[c.id] || []).length;
  $('#fcity').innerHTML = nCities ? `<b>STÄDER:</b> ${nCities}` : '';

  // ideologi + doktrin och landstyp på egna rader (för ALLA länder)
  const isMineSolo = state.mode === 'solo' && state.solo?.claims[c.id];
  let ideoObj, docName = '';
  if (isMineSolo && state.solo?.nation) {
    ideoObj = IDEOLOGIES[state.solo.nation.ideology];
    docName = state.solo.nation.doctrine && ideoObj?.doctrines?.[state.solo.nation.doctrine]?.name || '';
  } else {
    const wi = state.world?.[c.id] || countryIdeology(c.id);
    ideoObj = IDEOLOGIES[wi.ideology];
    docName = wi.doctrine && ideoObj?.doctrines?.[wi.doctrine]?.name || '';
  }
  $('#fideo').innerHTML = ideoObj
    ? `<b>IDEOLOGI:</b> ${ideoObj.icon} ${ideoObj.name.toUpperCase()}`
    : '';
  $('#fdoc').innerHTML = docName ? `<b>DOKTRIN:</b> ${docName.toUpperCase()}` : '';
  const BIOME_ICON = { GRAS: '\u{1F33E}', SNO: '\u{2744}\u{FE0F}', OKEN: '\u{1F3DC}\u{FE0F}', DJUNGEL: '\u{1F334}' };
  const bio = biomeFor(c);
  $('#ftype').innerHTML = `<b>LANDSTYP:</b> ${BIOME_ICON[bio]} ${BIOMES[bio].name}`;
  const inc = countryIncomeOf(fact.p, c.id);
  const mineInc = state.mode === 'solo' && state.solo?.claims[c.id];
  $('#finc').innerHTML = `<b>INKOMST:</b> +${inc} \u{1F4B0}/DAG${mineInc ? '' : ' <span style="color:var(--holo-dim)">VID ERÖVRING</span>'}`;

  const fres = $('#fres');
  fres.innerHTML = '';
  for (const r of resourcesOf(c.id)) {
    const chipEl = document.createElement('span');
    chipEl.className = 'reschip';
    chipEl.style.borderColor = RESOURCES[r].color;
    chipEl.textContent = `${RESOURCES[r].icon} ${RESOURCES[r].name.toUpperCase()}`;
    fres.appendChild(chipEl);
  }

  const claim = claimsMap()[c.id];
  const claimBtn = $('#claimbtn');
  const attackBtn = $('#attackbtn');
  const nationBtn = $('#nationbtn');
  const justifyBtn = $('#justifybtn');
  const wpBtn = $('#wpbtn');
  show(claimBtn, false);
  show(attackBtn, false);
  show(nationBtn, false);
  show(justifyBtn, false);
  show(wpBtn, false);
  show($('#nukebtn'), false);
  show($('#interceptbtn'), false);
  show($('#movebtn'), false);
  const fb = $('#fbuild');
  fb.innerHTML = '';
  show(fb, false);
  const ftr = $('#ftrade');
  ftr.innerHTML = '';
  show(ftr, false);

  if (state.mode === 'solo' || (state.mode === 'player' && state.solo)) {
    const s = state.solo;
    if (s.claims[c.id]) {
      $('#istatus').textContent = s.claims[c.id].puppet ? 'DIN LYDSTAT' : 'DITT TERRITORIUM';
      $('#istatus').style.color = SOLO_COLOR;
      show(nationBtn, !!s.nation);
      if (s.army?.units.length && s.army.at !== c.id && !state.battle) {
        $('#movebtn').innerHTML = `\u{1F6A9} FLYTTA ARMÉN HIT${s.garrisons?.[c.id]?.length ? ' (SLÅ IHOP MED GARNISONEN)' : ''}`;
        show($('#movebtn'), true);
      }
      renderFactBuild(c);
    } else if (!s.home) {
      $('#istatus').textContent = 'FRITT TERRITORIUM';
      $('#istatus').style.color = '';
      claimBtn.textContent = 'GÖR TILL HEMLAND';
      show(claimBtn, true);
    } else {
      const defN = state.mode === 'solo' ? countryArmy(c.id).units.length : defenderArmy(c, state.facts[c.id]).length;
      const ownerP = state.mode === 'player' ? playerOwning(c.id) : null;
      const world = state.mode === 'player' ? (state.aiWorldRemote || {}) : s;
      const conq = world.aiOwned?.[c.id];
      let conqTxt = ownerP ? ` • TILLHÖR ${ownerP.name.toUpperCase()}`
        : conq ? ` • DEL AV ${(world.aiEmpires?.[conq]?.name || globe.getCountry(conq)?.name || '?').toUpperCase()}` : '';
      const threat = (world.aiWars || []).find((w) => w.target === c.id) || (world.moving || []).find((m) => m.target === c.id);
      if (threat) conqTxt += ` • \u{26A0}\u{FE0F} HOTAS AV ${cname(threat.att)}`;
      const war = s.wars[c.id];
      if (!war) {
        $('#istatus').textContent = `FÖRSVAR: ${defN} ENHETER${conqTxt}`;
        $('#istatus').style.color = '';
        if (s.army?.units.length && !state.battle) show(justifyBtn, true);
        renderFactTrade(c);
      } else if (war.status === 'justifying') {
        $('#istatus').textContent = `RÄTTFÄRDIGAR KRIG (${CASUS_BELLI[war.cb].name.toUpperCase()}) — ${war.days} DAGAR KVAR${conqTxt}`;
        $('#istatus').style.color = 'var(--amber)';
        show(wpBtn, true);
        renderFactTrade(c, true); // aktiva avtal ska kunna sägas upp även under krig
      } else {
        $('#istatus').textContent = `KRIG RÄTTFÄRDIGAT: ${CASUS_BELLI[war.cb].name.toUpperCase()} — REDO ATT ANFALLA${conqTxt}`;
        $('#istatus').style.color = 'var(--red)';
        if (s.army?.units.length && !state.battle) show(attackBtn, true);
        if (!state.battle && hasUnlock(s.nation, 'nuke')) show($('#nukebtn'), true);
        show(wpBtn, true);
        renderFactTrade(c, true);
      }
    }
  } else if (claim) {
    const mine = state.me && state.me.home === c.id;
    $('#istatus').textContent = mine ? 'DITT HEMLAND' : `TAGET AV ${claim.playerName.toUpperCase()}`;
    $('#istatus').style.color = claim.color;
  } else {
    $('#istatus').textContent = 'FRITT TERRITORIUM';
    $('#istatus').style.color = '';
    claimBtn.textContent = 'GÖR TILL HEMLAND';
    show(claimBtn, state.mode === 'player');
  }
  show(panel, true);
}

// Bygg armé i valfritt eget land — kostar pengar + manpower + råvaror,
// enheterna hamnar i det landets garnison (eller ansluter armén om den står där)
function renderFactBuild(c) {
  const s = state.solo;
  if (!s?.nation) return;
  const fb = $('#fbuild');
  fb.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'font-size:7px;color:var(--holo-dim);margin:6px 0 2px';
  title.textContent = `\u{1F3ED} BYGG ARMÉ I ${c.name.toUpperCase()}`;
  fb.appendChild(title);
  const row = document.createElement('div');
  row.className = 'armybuild';
  const owned = ownedResources();
  for (const [type, b] of Object.entries(UNIT_BUILD)) {
    const missing = b.needs.filter((r) => !owned.has(r));
    const fCost = Math.round(b.money * (FACTIONS[s.faction]?.cost?.[type] ?? 1));
    const uName = UNIT_TYPES[type].name;
    const btn = document.createElement('button');
    btn.className = 'armybtn';
    btn.innerHTML = `${uName}<br>${fCost} \u{1F4B0} + ${b.man} \u{1F9CD}${b.needs.length ? '<br>KRÄVER ' + b.needs.map((r) => RESOURCES[r].icon).join('') : ''}`;
    const resReq = b.research && (s.nation.research[b.research[0]] || 0) < b.research[1]
      ? `KRÄVER FORSKNING: ${RESEARCH[b.research[0]].name.toUpperCase()} T${b.research[1]}` : null;
    const blocked = unitBuildingBlocked(c.id, type)
      || resReq
      || (missing.length ? 'SAKNAR ' + missing.map((r) => RESOURCES[r].name.toUpperCase()).join(', ')
      : s.res.money < fCost ? 'FÖR LITE PENGAR'
      : s.res.man < b.man ? 'FÖR LITE MANPOWER' : null);
    if (blocked) { btn.disabled = true; btn.title = blocked; }
    btn.addEventListener('click', () => {
      if (blocked) { warn(blocked); return; }
      s.res.money -= fCost;
      s.res.man -= b.man;
      s.buildQueue ||= [];
      s.buildQueue.push({ type, name: uName, left: b.days, total: b.days, dest: c.id });
      renderBuildCorner();
      renderResbar();
      toast(`\u{1F528} ${uName} PÅBÖRJAD I ${c.name.toUpperCase()} — KLAR OM ${b.days} DAGAR`, 'amber');
      refreshInfoPanel();
    });
    row.appendChild(btn);
  }
  fb.appendChild(row);
  const cbtn = document.createElement('button');
  cbtn.className = 'btn';
  cbtn.style.marginTop = '6px';
  cbtn.innerHTML = `\u{1F3D9} STÄDER & BYGGNADER (${(state.cities[c.id] || []).length})`;
  cbtn.addEventListener('click', () => openCityPanel(c.id));
  fb.appendChild(cbtn);
  show(fb, true);
}

// ---------- stadspanelen: byggnader per stad ----------
function openCityPanel(cid) {
  state.cityPanelCid = cid;
  state.cityPanelExpand = null;
  $('#citypanel').classList.add('show');
  renderCityPanel(cid);
}

function renderCityPanel(cid) {
  const s = state.solo;
  const c = globe.getCountry(cid);
  $('#cptitle').textContent = `\u{1F3D9} ${c?.name.toUpperCase() || ''} — STÄDER & BYGGNADER`;
  const body = $('#cpbody');
  body.innerHTML = '';
  const cities = state.cities[cid] || [];
  const idx = cities.map((city, i) => ({ city, i }));
  // huvudstaden ALLTID överst — den har gratis-kasernen och får aldrig sorteras bort
  idx.sort((a, b) => (b.city.c ? 1 : 0) - (a.city.c ? 1 : 0)
    || (a.city.tier ?? 2) - (b.city.tier ?? 2)
    || (b.city.p || 0) - (a.city.p || 0));
  const rows = idx.slice(0, 14);
  if (!rows.length) {
    body.innerHTML = '<div style="font-size:8px;color:var(--holo-dim)">INGA STÄDER REGISTRERADE</div>';
    return;
  }
  const info = document.createElement('div');
  info.style.cssText = 'font-size:7px;color:var(--holo-dim);margin-bottom:8px;line-height:1.8';
  info.textContent = `VARJE STAD HAR ${CITY_SLOTS} BYGGPLATSER. KASERN/FABRIK/FLYGBAS GÖR ENHETER BYGGBARA I LANDET — ANDRA GER POÄNG, RÅVAROR OCH HANDEL.`;
  body.appendChild(info);
  for (const { city, i } of rows) {
    const key = cid + ':' + i;
    const built = s.cityB?.[key] || [];
    const queued = (s.buildQueue || []).filter((q) => q.cityKey === key);
    const row = document.createElement('div');
    row.className = 'cityrow';
    const name = document.createElement('div');
    name.className = 'cityname';
    name.innerHTML = `${city.c ? '\u{2B50} ' : ''}${city.n.toUpperCase()}${city.c ? ' <small>(HUVUDSTAD)</small>' : (city.tier ?? 2) === 3 ? ' <small>(SMÅSTAD)</small>' : ''}`;
    row.appendChild(name);
    const slots = document.createElement('div');
    slots.className = 'cityslots';
    for (let sl = 0; sl < CITY_SLOTS; sl++) {
      const el = document.createElement('button');
      el.className = 'cityslot';
      if (built[sl]) {
        const B = BUILDINGS[built[sl]];
        el.innerHTML = `${B.icon} ${B.name}`;
        el.classList.add('built');
        el.title = B.desc;
      } else if (sl < built.length + queued.length) {
        const q = queued[sl - built.length];
        el.innerHTML = `\u{23F3} ${BUILDINGS[q.building].name} (${q.left}D)`;
        el.classList.add('queued');
      } else if (sl === built.length + queued.length) {
        el.innerHTML = '+ BYGG';
        el.addEventListener('click', () => {
          state.cityPanelExpand = state.cityPanelExpand === key ? null : key;
          renderCityPanel(cid);
        });
      } else {
        el.innerHTML = '\u{00B7}';
        el.disabled = true;
      }
      slots.appendChild(el);
    }
    row.appendChild(slots);
    body.appendChild(row);
    if (state.cityPanelExpand === key) {
      const chooser = document.createElement('div');
      chooser.className = 'citychooser';
      for (const [bid, B] of Object.entries(BUILDINGS)) {
        const btn = document.createElement('button');
        btn.className = 'armybtn';
        btn.innerHTML = `${B.icon} ${B.name}<br>${B.money} \u{1F4B0} \u{2022} ${B.days}D<br><small>${B.desc}</small>`;
        const resReq = B.research && (s.nation.research[B.research[0]] || 0) < B.research[1]
          ? `KRÄVER FORSKNING: ${RESEARCH[B.research[0]].name.toUpperCase()} T${B.research[1]}` : null;
        const dupe = built.includes(bid) || queued.some((q) => q.building === bid) ? 'FINNS REDAN I STADEN' : null;
        const blocked = dupe || resReq || (s.res.money < B.money ? 'FÖR LITE PENGAR' : null);
        if (blocked) { btn.disabled = true; btn.title = blocked; }
        btn.addEventListener('click', () => {
          if (blocked) { warn(blocked); return; }
          // omkontroll vid klicket — saldot kan ha ändrats sedan panelen ritades
          if (s.res.money < B.money) { warn('FÖR LITE PENGAR'); renderCityPanel(cid); return; }
          if (!s.claims[cid]) { warn('LANDET ÄR INTE LÄNGRE DITT'); $('#citypanel').classList.remove('show'); return; }
          s.res.money -= B.money;
          (s.buildQueue ||= []).push({ building: bid, cityKey: key, cityName: city.n, name: `${B.icon} ${B.name}`, left: B.days, total: B.days, dest: cid });
          state.cityPanelExpand = null;
          renderBuildCorner();
          renderResbar();
          renderCityPanel(cid);
          toast(`\u{1F528} ${B.name} PÅBÖRJAD I ${city.n.toUpperCase()} — KLAR OM ${B.days} DAGAR`, 'amber');
        });
        chooser.appendChild(btn);
      }
      body.appendChild(chooser);
    }
  }
}

// ---------- handel: råvaruavtal med andra länder ----------
// dealsOnly = true under krig: bara AVBRYT-knappar, inga nya köp
function renderFactTrade(c, dealsOnly = false) {
  const s = state.solo;
  if (!s?.nation) return;
  const ft = $('#ftrade');
  ft.innerHTML = '';
  const deals = (s.trade || []).filter((d) => d.cid === c.id);
  const owned = ownedResources();
  const theirs = dealsOnly ? [] : resourcesOf(c.id).filter((r) => !owned.has(r));
  if (!deals.length && !theirs.length) return;
  const title = document.createElement('div');
  title.style.cssText = 'font-size:7px;color:var(--holo-dim);margin:6px 0 2px';
  title.textContent = `\u{1F91D} HANDEL (${(s.trade || []).length}/${tradeSlots()} AVTAL)`;
  ft.appendChild(title);
  const row = document.createElement('div');
  row.className = 'armybuild';
  for (const d of deals) {
    const btn = document.createElement('button');
    btn.className = 'armybtn';
    btn.innerHTML = `AVBRYT: ${RESOURCES[d.res].icon} ${RESOURCES[d.res].name.toUpperCase()}<br>(${d.upkeep} \u{1F4B0}/DAG)`;
    btn.addEventListener('click', () => {
      s.trade = s.trade.filter((x) => x !== d);
      toast(`AVTALET OM ${RESOURCES[d.res].name.toUpperCase()} AVSLUTAT`, '', 4000);
      renderResbar();
      refreshInfoPanel();
    });
    row.appendChild(btn);
  }
  for (const r of theirs) {
    const [price, upkeep] = TRADE_PRICES[r] || TRADE_DEFAULT;
    const btn = document.createElement('button');
    btn.className = 'armybtn';
    btn.innerHTML = `KÖP ${RESOURCES[r].icon} ${RESOURCES[r].name.toUpperCase()}<br>${price} \u{1F4B0} + ${upkeep} \u{1F4B0}/DAG`;
    const blocked = (s.trade || []).length >= tradeSlots()
      ? `MAX ${tradeSlots()} AVTAL — BYGG \u{1F91D} HANDELSMARKNAD I EN STAD`
      : s.res.money < price ? 'FÖR LITE PENGAR' : null;
    if (blocked) { btn.disabled = true; btn.title = blocked; }
    btn.addEventListener('click', () => {
      if (blocked) { warn(blocked); return; }
      // omkontroll vid klicket — saldo och slots kan ha ändrats sedan render
      if (s.res.money < price) { warn('FÖR LITE PENGAR'); refreshInfoPanel(); return; }
      if ((s.trade || []).length >= tradeSlots()) { warn('AVTALSPLATSERNA ÄR FULLA'); refreshInfoPanel(); return; }
      s.res.money -= price;
      (s.trade ||= []).push({ res: r, cid: c.id, upkeep });
      toast(`\u{1F91D} HANDELSAVTAL: ${RESOURCES[r].icon} ${RESOURCES[r].name.toUpperCase()} FRÅN ${c.name.toUpperCase()}`, 'amber', 6000);
      renderResbar();
      refreshInfoPanel();
    });
    row.appendChild(btn);
  }
  ft.appendChild(row);
  show(ft, true);
}

globe.onSelect = (c) => {
  selectedCountry = c;
  refreshInfoPanel();
};

// klick på en marscherande armé → visa + möjlighet att genskjuta
globe.onSelectArmy = (m) => {
  // har man redan valt sin egen armé → jakten börjar direkt
  if (state.armSelected && state.mode === 'solo' && state.solo?.army?.units.length && !state.battle && !state.solo.chase) {
    state.armSelected = false;
    startChase(m);
    return;
  }
  selectedCountry = null;
  const panel = $('#infopanel');
  const world = worldCtx().world;
  const pct = Math.round(Math.min(1, (performance.now() - m.start) / m.dur) * 100);
  // spionageforskningen avgör vad man vet: 1=destination, 2=nationalitet, 3=antal, 4=sammansättning
  const esp = state.mode === 'tv' ? 4 : espionageTier(state.solo?.nation);
  $('#fflag').style.display = 'none';
  $('#iname').textContent = esp >= 2 ? `\u{2694} ARMÉ PÅ MARSCH` : `\u{2694} OKÄND ARMÉ PÅ MARSCH`;
  $('#fpop').innerHTML = (esp >= 2 ? `<b>FRÅN:</b> ${cname(m.att)}` : `<b>FRÅN:</b> OKÄNT <span style="color:var(--holo-dim)">(KRÄVER SPIONAGE T2)</span>`)
    + (esp >= 1 ? ` <b>MOT:</b> ${cname(m.target)}` : ` <b>MOT:</b> ? <span style="color:var(--holo-dim)">(T1)</span>`);
  $('#fcap').innerHTML = esp >= 3
    ? `<b>STYRKA:</b> ${m.units.length} ENHETER`
    : `<b>STYRKA:</b> OKÄND <span style="color:var(--holo-dim)">(KRÄVER SPIONAGE T3)</span>`;
  $('#fcity').innerHTML = esp >= 1 ? `<b>FRAMME:</b> ${pct}% AV VÄGEN` : '';
  if (esp >= 4) {
    const mc = compOf(m.units);
    $('#fideo').innerHTML = `<b>ENHETER:</b> \u{1FA96}${mc.INF} \u{1F6E1}\u{FE0F}${mc.TANK} \u{2708}\u{FE0F}${mc.FLYG}`;
  } else {
    $('#fideo').innerHTML = m.goal && esp >= 2 ? `<b>MÅL:</b> ${m.goal.icon} ${m.goal.name.toUpperCase()}` : '';
  }
  $('#fdoc').innerHTML = '';
  $('#ftype').innerHTML = '';
  $('#fres').innerHTML = '';
  $('#istatus').textContent = '';
  for (const id of ['claimbtn', 'attackbtn', 'nukebtn', 'justifybtn', 'wpbtn', 'nationbtn', 'fbuild', 'movebtn', 'ftrade']) show($('#' + id), false);
  const ib = $('#interceptbtn');
  show(ib, state.mode === 'solo' && !!state.solo?.army?.units.length && !state.battle && !state.solo?.chase);
  state.pendingIntercept = m;
  show(panel, true);
};

// klick på egen armé → välj den för genskjutning ("välj din armé, klicka sen på deras")
globe.onSelectOwnArmy = () => {
  const s = state.solo;
  if (state.mode !== 'solo' || !s?.army?.units.length || state.battle) return;
  if (s.chase) { warn('ARMÉN GENSKJUTER REDAN'); return; }
  state.armSelected = true;
  toast('\u{2694} DIN ARMÉ ÄR VALD — KLICKA PÅ EN FIENTLIG ARMÉ FÖR ATT GENSKJUTA', 'amber', 6000);
};

$('#interceptbtn').addEventListener('click', () => {
  const m = state.pendingIntercept;
  if (!m || !state.solo?.army?.units.length || state.battle || state.solo.chase) return;
  startChase(m);
});

// Genskjutning är en MARSCH: armén går mot fiendens armé i realtid.
// Hinner vi ifatt → mötesstrid. Hinner fienden fram till sitt mål först → vi vänder tillbaka.
function startChase(m) {
  const s = state.solo;
  s.chase = { id: m.id };
  s._marchId = (s._marchId || 0) + 1; // avbryt ev. pågående vanlig marsch
  s.armyMoving = true;
  const from = s.army.at;
  const src = (worldCtx().world.moving || []).find((x) => x.id === m.id) || m;
  toast(`\u{2694} GENSKJUTNING — ARMÉN MARSCHERAR MOT ${cname(src.att)}S ARMÉ`, 'amber', 6000);
  const SPEED = 1 / 45000; // radianer/ms — lite snabbare än AI:ns marsch så jakten kan lyckas
  let last = performance.now();
  const step = (t) => {
    if (!s.chase || s.chase.id !== m.id) return;
    const dt = t - last; last = t;
    if (!s.army?.units.length) { s.chase = null; s.armyMoving = false; return; }
    const world = worldCtx().world;
    const mm = (world.moving || []).find((x) => x.id === m.id);
    if (!mm) {
      // fienden hann fram och invasionen avgjordes — vänd om
      s.chase = null;
      toast('\u{26A0}\u{FE0F} FIENDEN NÅDDE FRAM FÖRE OSS — ARMÉN VÄNDER TILLBAKA', 'red', 7000);
      armyFlyTo(capitalLL(from), 0, () => { s.army.at = from; updateArmyMarker(); refreshInfoPanel(); });
      return;
    }
    if (state.battle) { requestAnimationFrame(step); return; }
    const k = Math.max(0, Math.min(1, (performance.now() - mm.start) / mm.dur));
    const e = d3.geoInterpolate(mm.fromLL, mm.toLL)(k);
    const rem = d3.geoDistance(s.army.ll, e);
    if (rem < 0.02) {
      s.chase = null;
      s.armyMoving = false;
      openInterceptBattle(mm);
      return;
    }
    s.army.ll = d3.geoInterpolate(s.army.ll, e)(Math.min(1, (SPEED * dt) / rem));
    updateArmyMarker();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function openInterceptBattle(m) {
  const targetC = globe.getCountry(m.target);
  const biome = targetC ? biomeFor(targetC) : 'GRAS';
  $('#battle').classList.add('show');
  $('#btitle').textContent = `GENSKJUTNING — ${cname(m.att)}S ARMÉ`;
  show($('#bEndTurn'), true);
  show($('#bSelAll'), false);
  const opts = {
    canvas: $('#bcanvas'),
    klinchCanvas: $('#kcanvas'),
    klinchEl: $('#klinch'),
    biome,
    atk: consolidate(state.solo.army.units.map((u) => ({ ...u }))),
    def: consolidate(m.units.map((u) => ({ ...u }))),
    seed: seedFrom(m.att),
    atkBoost: battleBoost(),
    kenneyRow: FACTIONS[state.solo.faction]?.kenneyRow ?? 8,
    setStatus: (s) => { $('#bstatus').textContent = s; },
    setTerrain: renderTerrBadge,
    onEnd: (result) => finishIntercept(m, result),
  };
  state.battle = new BattleA(opts);
}

function finishIntercept(m, result) {
  state.battle?.destroy?.();
  state.battle = null;
  $('#battle').classList.remove('show');
  $('#klinch').style.display = 'none';
  const s = state.solo;
  const world = worldCtx().world;
  if (result.winner === 0) {
    world.moving = world.moving.filter((x) => x.id !== m.id);
    s.army.units = expandUnits(result.survivors);
    s.res.money += 100;
    $('#bresTitle').textContent = 'GENSKJUTNING LYCKAD!';
    $('#bresTitle').style.color = 'var(--amber)';
    $('#bresText').innerHTML = `${cname(m.att)}S INVASION AV ${cname(m.target)} ÄR STOPPAD<br>+100 \u{1F4B0} KRIGSBYTE`;
  } else if (result.retreat) {
    s.army.units = expandUnits(result.survivors);
    $('#bresTitle').textContent = 'RETRÄTT';
    $('#bresTitle').style.color = 'var(--holo)';
    $('#bresText').textContent = 'DU DROG DIG UR — INVASIONEN FORTSÄTTER.';
  } else {
    spawnArmy(s.home);
    $('#bresTitle').textContent = 'NEDERLAG';
    $('#bresTitle').style.color = 'var(--red)';
    $('#bresText').textContent = 'DIN ARMÉ KROSSADES — INVASIONEN FORTSÄTTER. NY ARMÉ MOBILISERAS.';
  }
  updateArmyMarker();
  updateMovingMarkers();
  applyState();
  renderResbar();
  overlay('#bresult', true);
  state.pendingIntercept = null;
}

$('#claimbtn').addEventListener('click', () => {
  if (!selectedCountry) return;
  if (state.mode === 'solo') {
    const s = state.solo;
    if (s.home) return;
    s.home = selectedCountry.id;
    s.claims[selectedCountry.id] = { color: SOLO_COLOR, playerName: 'DU' };
    initNation(selectedCountry.id);
    spawnArmy(selectedCountry.id);
    applyState();
    toast(`${selectedCountry.name.toUpperCase()} ÄR DITT HEMLAND`, 'amber', 5000);
    openFactionPick();
    return;
  }
  if (state.mode !== 'player') return;
  $('#claimbtn').disabled = true;
  setTimeout(() => { $('#claimbtn').disabled = false; }, 1500);
  net.send('claim', { country: selectedCountry.id });
});

// ---------- nationsmotorn: init, beräkning, resurser, tid ----------
const UNIT_BUILD = {
  INF: { name: 'INFANTERI', man: 3, money: 50, days: 3, needs: [] },
  TANK: { name: 'STRIDSVAGN', man: 5, money: 120, days: 6, needs: ['JARN', 'OLJA'], research: ['tanks', 1] },
  FLYG: { name: 'FLYGPLAN', man: 4, money: 200, days: 8, needs: ['JARN', 'OLJA', 'GULD'], research: ['aircraft', 1] },
};

// ---------- stående arméer: varje land har en armé som växer och tar stryk ----------
function countryArmy(cid) {
  const world = worldCtx().world;
  world.countryArmies ||= {};
  if (!world.countryArmies[cid]) {
    const c = globe.getCountry(cid);
    world.countryArmies[cid] = { units: c ? defenderArmy(c, state.facts[cid]) : [] };
  }
  return world.countryArmies[cid];
}

function armyCap(cid) {
  return armySizeOf(state.facts[cid]?.p || 5e6, cid);
}

function initNation(countryId) {
  const s = state.solo;
  const start = countryIdeology(countryId);
  s.nation = { laws: defaultLaws(), ideology: start.ideology, doctrine: start.doctrine, research: {} };
  enforceRequirements(s.nation);
  s.res = { money: 500, man: 20, rp: 0, pp: 100 };
  s.extra = {};
  s.clock = { day: 1, paused: false, acc: 0, msPerDay: 2000 };
  // huvudstaden startar med en gratis kasern — utan den kan inget infanteri byggas
  const capIdx = Math.max(0, (state.cities[countryId] || []).findIndex((x) => x.c));
  s.cityB = { [countryId + ':' + capIdx]: ['kasern'] };
  s.trade = [];
  recomputeNation();
  $('#resbar').style.display = 'flex';
  renderResbar();
  const ideo = IDEOLOGIES[s.nation.ideology];
  toast(`GRUNDIDEOLOGI: ${ideo.icon} ${ideo.name.toUpperCase()}`, '', 5000);
}

function recomputeNation() {
  const s = state.solo;
  if (!s?.nation) return;
  s.nationSources = {
    laws: lawMods(s.nation.laws),
    ideology: ideologyMods(s.nation),
    research: researchMods(s.nation),
    extra: mergeMods(mergeMods(mergeMods(s.extra, s.permMods), s.factionMods), s.leaderMods),
  };
  s.stats = computeStats(s.nation, s.nationSources);
}

function ownedResources() {
  const set = new Set();
  for (const cid of Object.keys(state.solo?.claims || {})) for (const r of resourcesOf(cid)) set.add(r);
  for (const b of allBuildings()) if (BUILDINGS[b]?.resource) set.add(BUILDINGS[b].resource);
  for (const d of state.solo?.trade || []) set.add(d.res);
  return set;
}

// ---------- stadsbyggnader: hjälpare ----------
// bara byggnader i länder man FORTFARANDE äger räknas (förlorade länder ger inget)
function allBuildings() {
  const s = state.solo;
  const out = [];
  for (const [k, arr] of Object.entries(s?.cityB || {})) {
    if (s.claims[k.split(':')[0]]) out.push(...arr);
  }
  return out;
}

function cityBuildingsIn(cid) {
  const out = [];
  for (const [k, arr] of Object.entries(state.solo?.cityB || {})) {
    if (k.startsWith(cid + ':')) out.push(...arr);
  }
  return out;
}

// enhetsproduktion kräver rätt byggnad någonstans i landet man bygger i
function unitBuildingBlocked(cid, type) {
  const need = UNIT_NEEDS_BUILDING[type];
  if (!need) return null;
  if (cityBuildingsIn(cid).includes(need)) return null;
  return `KRÄVER ${BUILDINGS[need].icon} ${BUILDINGS[need].name} I LANDET`;
}

function tradeSlots() {
  return 1 + allBuildings().filter((b) => BUILDINGS[b]?.tradeSlot).length;
}

function battleBoost() {
  const s = state.solo;
  if (!s?.stats) return { INF: 0, TANK: 0, FLYG: 0 };
  const cb = combatBonus(s.nation);
  const fc = FACTIONS[s.faction]?.combat || {};
  const r = Math.round(Math.max(0, s.stats.readiness.total) / 25);
  return {
    INF: cb.INF + r + (fc.INF || 0),
    TANK: cb.TANK + r + (fc.TANK || 0),
    FLYG: cb.FLYG + r + (fc.FLYG || 0),
  };
}

function renderResbar() {
  const s = state.solo;
  if (!s?.res) return;
  $('#rday').textContent = 'DAG ' + s.clock.day;
  $('#rmoney').textContent = s.res.money;
  $('#rman').textContent = s.res.man;
  $('#rrp').textContent = s.res.rp;
  $('#rpp').textContent = s.res.pp;
  $('#pausebtn').innerHTML = s.clock.paused ? '&#9654; SPELA' : '&#9208; PAUS';
  // resursraden inne i NATION-panelen — så beslut kan fattas utan att stänga
  $('#natres').innerHTML = `<span>DAG <b>${s.clock.day}</b></span>` +
    `<span>\u{1F4B0} <b>${s.res.money}</b></span>` +
    `<span>\u{1F9CD} <b>${s.res.man}</b></span>` +
    `<span>\u{1F52C} <b>${s.res.rp}</b></span>` +
    `<span>\u{2696}\u{FE0F} <b>${s.res.pp}</b></span>`;
}

// Förhandsvisning högst upp i panelen: förändring MOT IDAG, +grönt / −rött
function setPreview(html) {
  $('#natpreview').innerHTML = html || 'HOVRA ÖVER ETT ALTERNATIV FÖR ATT SE FÖRÄNDRINGEN MOT IDAG';
}

// Fel i panelen: toast + rött i förhandsraden (toasts låg tidigare under panelen)
function warn(msg) {
  toast(msg, 'red');
  setPreview(`<span class="dn">\u{26A0}\u{FE0F} ${msg}</span>`);
}

// Visar varje förändring i relation till DAGENS värde: "FACTORY OUTPUT 0 → −10"
function deltaHtml(deltaMods) {
  const stats = state.solo?.stats;
  const parts = [];
  for (const [k, d] of Object.entries(deltaMods)) {
    if (!d) continue;
    const good = statGoodness(k, d) > 0;
    const cur = stats?.[k]?.total ?? 0;
    const next = Math.max(-100, Math.min(100, cur + d));
    parts.push(`<span class="${good ? 'dp' : 'dn'}">${(STATS[k]?.name || k).toUpperCase()} ${cur} \u{2192} ${next}</span>`);
  }
  return parts.join(' &nbsp;') || '<span class="dc">INGEN FÖRÄNDRING</span>';
}

function diffMods(newMods, curMods) {
  const keys = new Set([...Object.keys(newMods || {}), ...Object.keys(curMods || {})]);
  const out = {};
  for (const k of keys) out[k] = (newMods?.[k] || 0) - (curMods?.[k] || 0);
  return out;
}

function tickDay() {
  const s = state.solo;
  s.clock.day++;
  const st = s.stats;
  s.res.money = Math.max(0, s.res.money + Math.round(10 + st.income.total * 0.3));
  // varje ägt land bidrar med inkomst efter sin ekonomiska tyngd — rika länder är feta byten
  for (const cid of Object.keys(s.claims)) {
    s.res.money += countryIncomeOf(state.facts[cid]?.p, cid);
  }
  s.res.man += Math.max(0, Math.round(2 + st.manpower.total * 0.06));
  s.res.rp += Math.max(0, Math.round(1 + Math.max(0, st.research.total) * 0.08));
  s.res.pp += Math.max(0, Math.round(2 + st.polpower.total * 0.04));

  // stadsbyggnadernas dagliga avkastning
  for (const b of allBuildings()) {
    const d = BUILDINGS[b]?.daily;
    if (!d) continue;
    s.res.money += d.money || 0;
    s.res.rp += d.rp || 0;
    s.res.man += d.man || 0;
  }
  // handelsavtalens dagliga kostnad — utan pengar spricker avtalet.
  // Erövrar man avtalslandet äger man råvaran själv → avtalet upplöses gratis.
  for (const deal of [...(s.trade || [])]) {
    if (s.claims[deal.cid]) {
      s.trade = s.trade.filter((x) => x !== deal);
      toast(`\u{1F91D} ${cname(deal.cid)} ÄR NU DITT — AVTALET OM ${RESOURCES[deal.res].name.toUpperCase()} BEHÖVS INTE LÄNGRE`, '', 5000);
    } else if (s.res.money >= deal.upkeep) {
      s.res.money -= deal.upkeep;
    } else {
      s.trade = s.trade.filter((x) => x !== deal);
      toast(`\u{1F91D} AVTALET OM ${RESOURCES[deal.res].name.toUpperCase()} MED ${cname(deal.cid)} HAR SPRUCKIT — PENGARNA TOG SLUT`, 'red', 6000);
    }
  }

  // tillfälliga effekter (händelser, atomslag) klingar av
  let decayed = false;
  for (const k of Object.keys(s.extra)) {
    s.extra[k] -= Math.sign(s.extra[k]) * 0.5;
    if (Math.abs(s.extra[k]) < 0.5) delete s.extra[k];
    decayed = true;
  }
  if (decayed) recomputeNation();

  // oro får konsekvenser
  if (st.unrest.total > 40 && s.clock.day % 12 === 0) {
    s.res.money = Math.max(0, s.res.money - 120);
    toast('STREJKER! ORON KOSTAR 120 \u{1F4B0}', 'red', 5000);
  }
  // val (om landet har rimligt fria val)
  if (['entirelyfree', 'free', 'mostlyfree', 'balanced'].includes(s.nation.laws.elections) && s.clock.day % 90 === 0) {
    if (st.approval.total >= -5) {
      s.res.pp += 30;
      toast(`VALSEGER! +30 \u{2696}\u{FE0F}`, 'amber', 5000);
      globe.addFireworks(capitalLL(s.home), 6000);
      // ibland tar en historisk gestalt ledningen och ger sin buff
      if (Math.random() < 0.6) {
        const l = pickLeader(s.home);
        s.leader = l;
        s.leaderMods = { ...l.m };
        recomputeNation();
        toast(`\u{1F3A9} ${l.n.toUpperCase()} LEDER NU LANDET — ${leaderDesc(l)}`, 'amber', 8000);
      }
    } else {
      s.res.pp = Math.max(0, s.res.pp - 40);
      if (s.leader) { toast(`${s.leader.n.toUpperCase()} AVGÅR EFTER VALFÖRLUSTEN`, 'red', 5000); s.leader = null; s.leaderMods = {}; recomputeNation(); }
      toast(`VALFÖRLUST... \u{2212}40 \u{2696}\u{FE0F}`, 'red', 5000);
    }
  }
  // krigsrättfärdiganden tickar ner
  for (const [tid, w] of Object.entries(s.wars)) {
    if (w.status === 'justifying' && --w.days <= 0) {
      w.status = 'ready';
      toast(`KRIG MOT ${(globe.getCountry(tid)?.name || '?').toUpperCase()} RÄTTFÄRDIGAT — REDO ATT ANFALLA`, 'red', 6000);
      if (selectedCountry?.id === tid) refreshInfoPanel();
    }
  }
  renderBuildCorner();
  // krigsskadestånd flödar in
  for (const rep of s.reparations) { s.res.money += rep.daily; rep.days--; }
  s.reparations = s.reparations.filter((r) => {
    if (r.days > 0) return true;
    toast(`SKADESTÅNDET FRÅN ${r.from.toUpperCase()} HAR LÖPT UT`, '', 4000);
    return false;
  });
  // lydstater gör uppror om din stabilitet är för låg (under "40%")
  const puppetIds = Object.keys(s.claims).filter((cid) => s.claims[cid].puppet);
  if (puppetIds.length && st.stability.total < -20 && s.clock.day % 15 === 0 && Math.random() < 0.5) {
    const cid = puppetIds[Math.floor(Math.random() * puppetIds.length)];
    delete s.claims[cid];
    for (const k of Object.keys(s.cityB || {})) if (k.startsWith(cid + ':')) delete s.cityB[k];
    toast(`SJÄLVSTÄNDIGHETSUPPROR! ${(globe.getCountry(cid)?.name || '?').toUpperCase()} LÄMNAR DITT VÄLDE`, 'red', 7000);
    applyState();
  }

  // byggkön: en enhet i taget, tar dagar att färdigställa.
  // Är armén hemma ansluter enheten direkt — annars bildas en GARNISON hemma.
  if (s.buildQueue?.length) {
    const b = s.buildQueue[0];
    if (--b.left <= 0) {
      s.buildQueue.shift();
      const dest = b.dest || s.home;
      if (b.building) {
        // stadsbyggnad färdig
        ((s.cityB ||= {})[b.cityKey] ||= []).push(b.building);
        toast(`\u{2705} ${BUILDINGS[b.building].icon} ${BUILDINGS[b.building].name} FÄRDIG I ${b.cityName?.toUpperCase() || cname(dest)}`, 'amber', 6000);
        if ($('#citypanel').classList.contains('show')) renderCityPanel(state.cityPanelCid);
        if (selectedCountry?.id === dest) refreshInfoPanel();
      } else if (s.army && s.army.at === dest && !s.armyMoving && !s.chase) {
        // en marscherande armé kan inte ta emot nya enheter — de blir garnison i huvudstaden
        s.army.units.push(mkUnit(b.type, 0));
        toast(`\u{2705} ${b.name} FÄRDIGBYGGD — ANSLUTER TILL ARMÉN`, 'amber', 4500);
      } else {
        ((s.garrisons ||= {})[dest] ||= []).push(mkUnit(b.type, 0));
        toast(`\u{2705} ${b.name} KLAR I ${cname(dest)} — FLYTTA ARMÉN DIT FÖR ATT SLÅ IHOP`, 'amber', 6000);
      }
      updateArmyMarker();
    }
    renderBuildCorner();
  }

  // forskning tar tid — en åt gången
  if (s.researchQueue?.length) {
    const rq = s.researchQueue[0];
    if (--rq.left <= 0) {
      s.researchQueue.shift();
      s.nation.research[rq.branch] = rq.tier;
      recomputeNation();
      toast(`\u{1F52C} FORSKNING KLAR: ${rq.name.toUpperCase()}`, 'amber', 5000);
      if (rq.unlock === 'nuke') toast('\u{2622}\u{FE0F} KÄRNVAPEN UPPLÅST — NY KNAPP VID RÄTTFÄRDIGAT KRIG', 'red', 7000);
    }
    renderBuildCorner();
  }

  // försörjningskontroll varje dag
  supplyTick();

  // ländernas stående arméer växer med tiden
  if (s.clock.day % 20 === 0) {
    for (let i = 0; i < 3; i++) {
      const c = globe.countries[Math.floor(Math.random() * globe.countries.length)];
      if (!c || s.claims[c.id]) continue;
      const ca = countryArmy(c.id);
      if (ca.units.length < armyCap(c.id)) ca.units.push(mkUnit(Math.random() < 0.3 ? 'TANK' : 'INF', 1));
    }
  }

  // AI-världen körs lokalt i solo; i multiplayer sköter TV:n den
  if (state.mode === 'solo' && s.clock.day % 4 === 0) aiWorldTick();
}

// ---------- byggkö-widgeten i hörnet ----------
// samlad progress-kö: byggen + forskning + krigsrättfärdiganden
function renderBuildCorner() {
  const s = state.solo;
  const el = $('#buildcorner');
  if (!s) { el.style.display = 'none'; return; }
  const row = (icon, name, left, total, active) => {
    const pct = active ? Math.round(((total - left) / total) * 100) : 0;
    const sub = active ? `${Math.max(0, left)} DAGAR KVAR` : `I KÖ (${total} DAGAR)`;
    return `<div style="margin-bottom:7px">
      <div style="font-size:8px">${icon} ${name}</div>
      <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
      <div style="font-size:7px;color:var(--holo-dim)">${sub}</div>
    </div>`;
  };
  const rows = [];
  (s.buildQueue || []).forEach((b, i) => rows.push(row('\u{1F528}', b.name, b.left, b.total, i === 0)));
  (s.researchQueue || []).forEach((r, i) => rows.push(row('\u{1F52C}', r.name, r.left, r.total, i === 0)));
  for (const [tid, w] of Object.entries(s.wars || {})) {
    if (w.status === 'justifying') rows.push(row('\u{2696}\u{FE0F}', `KRIG: ${cname(tid)}`, w.days, w.total || w.days, true));
  }
  if (!rows.length) { el.style.display = 'none'; return; }
  el.innerHTML = `<div class="ptitle">&#9654; PÅGÅR</div>${rows.join('')}`;
  el.style.display = 'block';
}

// AI-världen lever: lagbyten, historiska riken som återuppstår, granninvasioner
const AI_COLORS = ['#7f5fa0', '#5f8fa0', '#a08f5f', '#5fa06f', '#a05f6f', '#8f6f4f'];

// Världskontext: solo kör AI-världen lokalt, TV:n kör den för hela rummet
function worldCtx() {
  if (state.mode === 'tv') {
    const blocked = new Set();
    for (const p of state.players) {
      for (const c of (p.claims || (p.home ? [p.home] : []))) blocked.add(c);
    }
    return { world: state.hostWorld, blocked };
  }
  const s = state.solo;
  return { world: s, blocked: new Set([...Object.keys(s.claims), s.home].filter(Boolean)) };
}

function ensureAiEmpire(world, coreId, hist) {
  let h = 7;
  for (const ch of String(coreId)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return (world.aiEmpires[coreId] ||= {
    name: globe.getCountry(coreId)?.name || '?',
    color: hist?.color || AI_COLORS[Math.abs(h) % AI_COLORS.length],
    owned: [], empireId: null,
  });
}

function countryFree(cid, ctx) {
  const { world, blocked } = ctx;
  return !!globe.getCountry(cid) && !blocked.has(cid) && !world.aiOwned[cid]
    && !(world.aiEmpires[cid]?.owned.length);
}

function cname(cid) { return (globe.getCountry(cid)?.name || '?').toUpperCase(); }

function nearestCountryIds(c, n, ctx) {
  return globe.countries
    .filter((o) => o.id !== c.id && countryFree(o.id, ctx))
    .map((o) => ({ id: o.id, d: d3.geoDistance(c.centroid, o.centroid) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.id);
}

function aiWorldTick() {
  const ctx = worldCtx();
  const { world, blocked } = ctx;
  world.aiWars ||= []; world.moving ||= []; world.aiGoals ||= {}; world.votes ||= [];
  world.leaders ||= {}; world.dev ||= {}; world.known ||= new Set();
  const r = Math.random();
  if (r < 0.12) {
    aiElectLeader(ctx);
  } else if (r < 0.24) {
    aiDevTick(ctx);
  } else if (r < 0.42) {
    // lagdrift utifrån ländernas verkliga grundideologier
    const others = globe.countries.filter((c) => !blocked.has(c.id));
    if (others.length) {
      const c = others[Math.floor(Math.random() * others.length)];
      const cats = Object.keys(LAWS);
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const wstate = (state.world ||= {});
      const wn = (wstate[c.id] ||= { laws: defaultLaws(), ...countryIdeology(c.id) });
      const opts = LAWS[cat].options;
      const cur = opts.findIndex((o) => o.id === wn.laws[cat]);
      const next = Math.max(0, Math.min(opts.length - 1, cur + (Math.random() < 0.5 ? -1 : 1)));
      if (next !== cur) {
        wn.laws[cat] = opts[next].id;
        toast(`${c.name.toUpperCase()}: ${LAWS[cat].name.toUpperCase()} \u{2192} ${opts[next].name.toUpperCase()}`, '', 4000);
      }
    }
  } else if (r < 0.62) {
    maybeStartVote(ctx);
  } else {
    advanceGoals(ctx);
  }
  tickVotes(ctx);
  tickAiWars(ctx);
  tickDefenses(ctx);
  updateCountryArmyMarkers();
}

// AI-länder väljer historiska ledare som ger dem buffar
function aiElectLeader(ctx) {
  const { blocked } = ctx;
  const world = ctx.world;
  const others = globe.countries.filter((c) => !blocked.has(c.id));
  const c = others[Math.floor(Math.random() * others.length)];
  if (!c || (world.leaders[c.id] && Math.random() < 0.7)) return;
  const l = pickLeader(c.id);
  world.leaders[c.id] = l;
  toast(`\u{1F3A9} ${c.name.toUpperCase()} HAR VALT ${l.n.toUpperCase()} — ${leaderDesc(l)}`, '', 7000);
}

// varje land har en miniekonomi och forskar utifrån sin läggning
const MIL_IDEOLOGIES = new Set(['nationalism', 'fascism', 'imperialism', 'communism', 'natsoc', 'monarchism']);
function aiDevTick(ctx) {
  const { blocked } = ctx;
  const world = ctx.world;
  const others = globe.countries.filter((c) => !blocked.has(c.id));
  const c = others[Math.floor(Math.random() * others.length)];
  if (!c) return;
  const ideo = (state.world?.[c.id] || countryIdeology(c.id)).ideology;
  const hasGoal = !!world.aiGoals[c.id];
  const focus = hasGoal || MIL_IDEOLOGIES.has(ideo) ? 'mil'
    : (ideo === 'socialdemocracy' || ideo === 'socialism') ? (Math.random() < 0.6 ? 'wel' : 'eco')
    : (Math.random() < 0.6 ? 'eco' : 'wel');
  const d = (world.dev[c.id] ||= { mil: 0, eco: 0, wel: 0 });
  if (d[focus] >= 4) return;
  d[focus]++;
  const label = { mil: 'KRIGSINDUSTRI', eco: 'EKONOMI', wel: 'VÄLFÄRD' }[focus];
  toast(`\u{1F52C} ${c.name.toUpperCase()} SATSAR PÅ ${label} — NIVÅ ${d[focus]}`, '', 5000);
  if (focus === 'mil') {
    const ca = countryArmy(c.id);
    if (ca.units.length < armyCap(c.id)) ca.units.push(mkUnit(d.mil >= 2 ? 'TANK' : 'INF', 1));
  }
}

// synliga stående arméer i länder man känner till (krig, marscher, imperier)
function markKnown(...cids) {
  const world = worldCtx().world;
  world.known ||= new Set();
  for (const cid of cids) if (cid) world.known.add(cid);
}

function updateCountryArmyMarkers() {
  const world = worldCtx().world;
  if (!world?.known) { globe.setCountryArmies([]); return; }
  // satellittäckning avgör vilka länders arméer man ser (TV:n ser allt)
  const tv = state.mode === 'tv';
  const cov = tv ? Infinity : satCoverage(state.solo?.nation);
  const homeLL = !tv && state.solo?.home ? capitalLL(state.solo.home) : null;
  const list = [];
  for (const cid of world.known) {
    if (state.solo?.claims[cid]) continue;
    const c = globe.getCountry(cid);
    if (!c) continue;
    const ll = capitalLL(cid);
    if (homeLL && cov !== Infinity && d3.geoDistance(homeLL, ll) > cov) continue;
    const n = (world.countryArmies?.[cid]?.units || []).length;
    if (!n) continue;
    const conq = world.aiOwned[cid];
    list.push({
      ll,
      // erövrade länders arméer byggs av imperiet → imperiets flagga, inte landets
      a2: state.facts[conq || cid]?.a2 || null,
      color: conq ? (world.aiEmpires[conq]?.color || '#7f8c8d') : '#8a97a5',
      n,
    });
    if (list.length >= 40) break;
  }
  globe.setCountryArmies(list);
}

// AI-länder RÖSTAR om sina ambitioner — historiska riken eller helt egna mål
function maybeStartVote(ctx) {
  const { world, blocked } = ctx;
  if (Object.keys(world.aiGoals).length >= 4 || world.votes.length) return;
  let cand = null;
  const hist = HISTORICAL_EMPIRES.filter((e) =>
    !world.aiGoals[e.core] && !blocked.has(e.core) && !world.aiOwned[e.core]
    && e.lands.some((l) => countryFree(l, ctx)) && Math.random() < e.aiChance);
  if (hist.length) {
    const e = hist[Math.floor(Math.random() * hist.length)];
    cand = { cid: e.core, name: e.name, icon: e.icon, targets: [...e.lands], empireId: e.id };
  } else if (Math.random() < DYNAMIC_GOALS.VARLDSHERRAVALDE.chance) {
    const bigs = globe.countries.filter((c) => (state.facts[c.id]?.p || 0) > 60e6 && !blocked.has(c.id) && !world.aiGoals[c.id]);
    const c = bigs[Math.floor(Math.random() * bigs.length)];
    if (c) cand = { cid: c.id, name: 'VÄRLDSHERRAVÄLDE', icon: '\u{1F30D}', targets: nearestCountryIds(c, 40, ctx) };
  } else if (Math.random() < DYNAMIC_GOALS.KONTINENT.chance * 3) {
    const cands = globe.countries.filter((c) => (state.facts[c.id]?.p || 0) > 2e6 && !blocked.has(c.id) && !world.aiGoals[c.id] && !world.aiOwned[c.id]);
    const c = cands[Math.floor(Math.random() * cands.length)];
    if (c) cand = { cid: c.id, name: 'KONTINENTAL DOMINANS', icon: '\u{1F5FA}\u{FE0F}', targets: nearestCountryIds(c, 8, ctx) };
  }
  if (!cand || !cand.targets.length) return;
  world.votes.push({ ...cand, ticks: 2 });
  toast(`\u{1F5F3}\u{FE0F} ${cname(cand.cid)} RÖSTAR OM: ${cand.name.toUpperCase()}…`, '', 7000);
}

function tickVotes(ctx) {
  const { world } = ctx;
  for (const v of [...world.votes]) {
    if (--v.ticks > 0) continue;
    world.votes = world.votes.filter((x) => x !== v);
    if (Math.random() < 0.65) {
      world.aiGoals[v.cid] = v;
      toast(`\u{2705} ${cname(v.cid)} HAR RÖSTAT JA — MÅLET ÄR ${v.icon} ${v.name.toUpperCase()}!`, 'amber', 8000);
      globe.addFireworks(capitalLL(v.cid), 7000);
    } else {
      toast(`\u{274C} ${cname(v.cid)} RÖSTADE NEJ OM ${v.name.toUpperCase()}`, '', 5000);
    }
  }
}

// aktivt mål → rättfärdiga krig ÖPPET mot nästa land i planen
function advanceGoals(ctx) {
  const { world } = ctx;
  const cids = Object.keys(world.aiGoals);
  if (!cids.length) return;
  const cid = cids[Math.floor(Math.random() * cids.length)];
  const goal = world.aiGoals[cid];
  if (world.aiOwned[cid]) { delete world.aiGoals[cid]; return; }
  if (world.aiWars.some((w) => w.att === cid) || world.moving.some((m) => m.att === cid)) return;
  const next = goal.targets.find((t) => countryFree(t, ctx));
  if (!next) {
    delete world.aiGoals[cid];
    toast(`\u{1F3C1} ${cname(cid)} HAR FULLBORDAT ${goal.name.toUpperCase()}`, 'amber', 6000);
    return;
  }
  world.aiWars.push({ att: cid, target: next, ticks: 2 + Math.floor(Math.random() * 3), goal });
  markKnown(cid, next);
  toast(`\u{2696}\u{FE0F} ${cname(cid)} RÄTTFÄRDIGAR KRIG MOT ${cname(next)} (${goal.name.toUpperCase()})`, 'red', 7000);
}

// rättfärdigande klart → armén MARSCHERAR synligt (och kan genskjutas)
function tickAiWars(ctx) {
  const { world } = ctx;
  for (const w of [...world.aiWars]) {
    if (--w.ticks > 0) continue;
    world.aiWars = world.aiWars.filter((x) => x !== w);
    if (!countryFree(w.target, worldCtx())) continue;
    const from = capitalLL(w.att), to = capitalLL(w.target);
    const pop = state.facts[w.att]?.p || 10e6;
    const n = Math.min(10, 4 + Math.floor(pop / 40e6));
    const units = Array.from({ length: n }, (_, i) => mkUnit(i % 3 === 2 ? 'TANK' : 'INF', 1));
    const dist = d3.geoDistance(from, to);
    world.moving.push({
      id: Math.random().toString(36).slice(2, 8),
      att: w.att, target: w.target, goal: w.goal, units,
      fromLL: from, toLL: to,
      start: performance.now(), dur: 10000 + dist * 120000,
    });
    markKnown(w.att, w.target);
    toast(`\u{1F6A9} ${cname(w.att)}S ARMÉ (${n} ENHETER) MARSCHERAR MOT ${cname(w.target)}`, 'red', 7000);
    updateMovingMarkers();
  }
}

// framme vid målet → strid mot landets STÅENDE armé
function checkArrivals() {
  const ctx = worldCtx();
  const world = ctx.world;
  if (!world?.moving?.length) return;
  const now = performance.now();
  for (const m of [...world.moving]) {
    if (now < m.start + m.dur) continue;
    world.moving = world.moving.filter((x) => x !== m);
    // försvarsvågor: förstärk garnisonen om landet fortfarande är imperiets
    if (m.defensive) {
      const stillHeld = world.aiOwned[m.target] === m.att || m.target === m.att;
      if (stillHeld) {
        const ca = countryArmy(m.target);
        ca.units.push(...m.units.slice(0, Math.max(0, 14 - ca.units.length)));
        toast(`\u{1F6E1}\u{FE0F} FÖRSTÄRKNINGAR FRAMME I ${cname(m.target)} — FÖRSVARET NU ${ca.units.length} ENHETER`, 'red', 6000);
        if (selectedCountry?.id === m.target) refreshInfoPanel();
      }
      updateMovingMarkers();
      continue;
    }
    if (!countryFree(m.target, worldCtx())) { updateMovingMarkers(); continue; }
    const defA = countryArmy(m.target);
    const r = autoResolve(m.units, defA.units);
    const attName = world.aiEmpires[m.att]?.empireId ? world.aiEmpires[m.att].name.toUpperCase() : cname(m.att);
    if (r.winner === 0) {
      const histE = m.goal?.empireId ? HISTORICAL_EMPIRES.find((e) => e.id === m.goal.empireId) : null;
      const emp = ensureAiEmpire(world, m.att, histE);
      world.aiOwned[m.target] = m.att;
      emp.owned.push(m.target);
      defA.units = r.survivorsA.map((u) => ({ ...u, side: 1 })); // ockupationsstyrka
      toast(`\u{1F525} ${attName} HAR ERÖVRAT ${cname(m.target)}!`, 'red', 7000);
      if (histE && !emp.empireId && emp.owned.length >= histE.need) {
        emp.empireId = histE.id; emp.name = histE.name; emp.color = histE.color;
        toast(`${histE.icon} ${histE.name.toUpperCase()} HAR ÅTERUPPSTÅTT!`, 'amber', 9000);
      }
      if (m.goal && !m.goal.empireId && emp.owned.length === 5) {
        toast(`${m.goal.icon} ${attName} DOMINERAR SIN REGION!`, 'amber', 8000);
      }
      worldChanged();
    } else {
      defA.units = r.survivorsD;
      toast(`\u{1F6E1}\u{FE0F} ${cname(m.target)} SLOG TILLBAKA ${attName}S INVASION!`, 'amber', 7000);
    }
    updateMovingMarkers();
  }
}

function updateMovingMarkers() {
  const world = worldCtx().world;
  // spionage avgör hur mycket man vet om främmande arméer (TV:n vet allt)
  const esp = state.mode === 'tv' ? 4 : espionageTier(state.solo?.nation);
  globe.setMovingArmies((world?.moving || []).map((m) => ({
    ...m,
    color: world.aiEmpires?.[m.att]?.color || '#c0392b',
    name: globe.getCountry(m.att)?.name || '?',
    a2: esp >= 2 ? (state.facts[m.att]?.a2 || null) : null,
    intel: { dir: esp >= 1, nat: esp >= 2, num: esp >= 3, comp: esp >= 4 },
  })));
  // krigsrök över länder som just nu invaderas eller är i öppet krig med spelaren
  const zones = new Set((world?.moving || []).map((m) => m.target));
  for (const [tid, w] of Object.entries(state.solo?.wars || {})) {
    if (w.status && w.status !== 'justifying') zones.add(tid);
  }
  globe.setWarZones([...zones].map((cid) => ({ ll: capitalLL(cid) })));
}

// efter AI-världsförändring: rita om + (TV) broadcasta till alla spelare
function worldChanged() {
  applyState();
  if (state.mode === 'tv') broadcastState();
}

setInterval(() => {
  const s = state.solo;
  if (!s?.clock || s.clock.paused || state.battle || document.hidden) return;
  if (state.mode === 'solo') checkArrivals();
  s.clock.acc += 250;
  let ticked = false;
  while (s.clock.acc >= s.clock.msPerDay) {
    s.clock.acc -= s.clock.msPerDay;
    tickDay();
    ticked = true;
  }
  if (ticked) renderResbar();
  globe.setDayFloat(s.clock.day + s.clock.acc / s.clock.msPerDay);
  // raketramp i hemlandet när rymdnära forskning finns
  const r = s.nation?.research || {};
  globe.setPlayerLaunch((r.aircraft >= 3 || r.nuclear >= 1 || r.satellites >= 1) ? capitalLL(s.home) : null);
  // satellitnätverket på globen speglar forskningen
  globe.setSatCoverage(s.home ? { center: capitalLL(s.home), ang: satCoverage(s.nation), tier: r.satellites || 0 } : null);
}, 250);

$('#pausebtn').addEventListener('click', () => {
  const s = state.solo;
  if (!s?.clock) return;
  s.clock.paused = !s.clock.paused;
  renderResbar();
});

// ---------- NATION-panelen ----------
let natTab = 'oversikt';
let natIdeoPick = null;   // förhandsvald ideologi (bekräftas i rutan längst ner)

function openNation() {
  const s = state.solo;
  if (!s?.nation || !s.home) return;
  const home = globe.getCountry(s.home);
  const fact = state.facts[s.home] || {};
  const form = s.nation.formation;
  $('#natname').textContent = form
    ? `${form.icon} ${form.name.toUpperCase()} — ${home?.name.toUpperCase() || ''}`
    : `DIN NATION — ${home?.name.toUpperCase() || ''}`;
  const flag = $('#natflag');
  if (fact.a2) { flag.src = `https://flagcdn.com/w80/${fact.a2.toLowerCase()}.png`; flag.style.display = 'block'; }
  else flag.style.display = 'none';
  renderNationTab();
  $('#nation').classList.add('show');
}

function modSummary(mods, max = 4) {
  return Object.entries(mods).slice(0, max)
    .map(([k, v]) => `${STATS[k]?.name || k} ${v > 0 ? '+' : ''}${v}`)
    .join(', ');
}

function renderNationTab() {
  const body = $('#natbody');
  document.querySelectorAll('.nattab').forEach((el) => el.classList.toggle('on', el.dataset.tab === natTab));
  recomputeNation();
  if (natTab === 'lagar') return renderLawsTab(body);
  if (natTab === 'ideologi') return renderIdeologyTab(body);
  if (natTab === 'forskning') return renderResearchTab(body);
  const stats = state.solo.stats;
  body.innerHTML = '';

  // ARMÉ-sektionen: bygg enheter med pengar + manpower + tillgångskrav
  const s = state.solo;
  const armyDiv = document.createElement('div');
  armyDiv.className = 'natgroup';
  const at = document.createElement('div');
  at.className = 'gtitle';
  at.textContent = '▸ ARMÉ & PRODUKTION';
  armyDiv.appendChild(at);
  const owned = ownedResources();
  const comp = s.army ? compOf(s.army.units) : null;
  const info = document.createElement('div');
  info.style.cssText = 'font-size:7px;color:var(--holo-dim);margin-bottom:4px;line-height:1.8';
  info.innerHTML = (s.army
    ? `NUVARANDE STYRKA: \u{1FA96}${comp.INF} \u{1F6E1}\u{FE0F}${comp.TANK} \u{2708}\u{FE0F}${comp.FLYG} &nbsp;•&nbsp; DINA TILLGÅNGAR: ${[...owned].map((r) => RESOURCES[r].icon).join(' ') || '–'}`
    : 'INGEN ARMÉ — EN NY MOBILISERAS EFTER NEDERLAG')
    + (s.leader ? `<br>\u{1F3A9} LEDARE: ${s.leader.n.toUpperCase()} (${leaderDesc(s.leader)})` : '');
  armyDiv.appendChild(info);
  const build = document.createElement('div');
  build.className = 'armybuild';
  for (const [type, b] of Object.entries(UNIT_BUILD)) {
    const missing = b.needs.filter((r) => !owned.has(r));
    const fCost = Math.round(b.money * (FACTIONS[s.faction]?.cost?.[type] ?? 1));
    const uName = UNIT_TYPES[type].name; // faktionens namn efter applyFaction
    const btn = document.createElement('button');
    btn.className = 'armybtn';
    btn.innerHTML = `${uName}<br>${fCost} \u{1F4B0} + ${b.man} \u{1F9CD}${b.needs.length ? '<br>KRÄVER ' + b.needs.map((r) => RESOURCES[r].icon).join('') : ''}`;
    const resReq = b.research && (s.nation.research[b.research[0]] || 0) < b.research[1]
      ? `KRÄVER FORSKNING: ${RESEARCH[b.research[0]].name.toUpperCase()} T${b.research[1]}` : null;
    const blocked = !s.army ? 'INGEN ARMÉ'
      : unitBuildingBlocked(s.home, type)
      || resReq
      || (missing.length ? 'SAKNAR ' + missing.map((r) => RESOURCES[r].name.toUpperCase()).join(', ')
      : s.res.money < fCost ? 'FÖR LITE PENGAR'
      : s.res.man < b.man ? 'FÖR LITE MANPOWER' : null);
    if (blocked) { btn.disabled = true; btn.title = blocked; }
    btn.addEventListener('click', () => {
      if (blocked) { warn(blocked); return; }
      s.res.money -= fCost;
      s.res.man -= b.man;
      s.buildQueue ||= [];
      s.buildQueue.push({ type, name: uName, left: b.days, total: b.days });
      renderBuildCorner();
      renderResbar();
      renderNationTab();
      toast(`\u{1F528} ${uName} PÅBÖRJAD — KLAR OM ${b.days} DAGAR`, 'amber');
    });
    build.appendChild(btn);
  }
  armyDiv.appendChild(build);
  body.appendChild(armyDiv);

  // RIKEN & STATSFÖRBUND: utropa historiska riken (kräver grundlandet + territorier)
  // eller bilda union/konfederation/federation/imperium av dina länder
  const ownedIds = Object.keys(s.claims);
  if (ownedIds.length >= 2) {
    const fDiv = document.createElement('div');
    fDiv.className = 'natgroup';
    const ft = document.createElement('div');
    ft.className = 'gtitle';
    ft.textContent = '▸ RIKEN & STATSFÖRBUND';
    fDiv.appendChild(ft);
    if (s.nation.formation) {
      const curLine = document.createElement('div');
      curLine.style.cssText = 'font-size:8px;color:var(--amber);margin-bottom:6px';
      curLine.textContent = `NUVARANDE: ${s.nation.formation.icon} ${s.nation.formation.name.toUpperCase()}`;
      fDiv.appendChild(curLine);
    }
    const formRow = (label, sub, cost, canForm, onForm, hoverMods) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:7px;margin:4px 0;line-height:1.8';
      const txt = document.createElement('span');
      txt.style.flex = '1';
      txt.innerHTML = `${label} <span style="color:var(--holo-dim)">${sub}</span>`;
      row.appendChild(txt);
      if (canForm) {
        const b = document.createElement('button');
        b.className = 'lawopt';
        b.textContent = `UTROPA (${cost} \u{2696}\u{FE0F})`;
        b.addEventListener('mouseenter', () => setPreview(`<span class="dc">${label} — ${cost} \u{2696}\u{FE0F}</span> &nbsp; ` + deltaHtml(hoverMods)));
        b.addEventListener('mouseleave', () => setPreview());
        b.addEventListener('click', onForm);
        row.appendChild(b);
      }
      fDiv.appendChild(row);
    };
    for (const e of HISTORICAL_EMPIRES) {
      const prog = empireProgress(e, ownedIds);
      if (!prog.hasCore) continue;
      const formable = prog.have >= e.need && s.nation.formation?.id !== e.id;
      formRow(`${e.icon} ${e.name.toUpperCase()}`, `${prog.have}/${e.need} HISTORISKA LÄNDER`, 120, formable, () => {
        if (s.res.pp < 120) { warn('KRÄVER 120 \u{2696}\u{FE0F} POLITICAL POWER'); return; }
        s.res.pp -= 120;
        s.nation.formation = { type: 'empire', id: e.id, name: e.name, icon: e.icon };
        s.permMods = { ...e.mods };
        recomputeNation(); renderResbar(); renderNationTab(); renderTopbar();
        toast(`${e.icon} ${e.name.toUpperCase()} HAR UTROPATS!`, 'amber', 8000);
        globe.addFireworks(capitalLL(s.home), 9000);
      }, e.mods);
    }
    for (const f of FEDERATION_FORMS) {
      if (ownedIds.length < f.min) continue;
      if (f.req.ideologies && !f.req.ideologies.includes(s.nation.ideology)) continue;
      if (s.nation.formation?.id === f.id) continue;
      formRow(`${f.icon} ${f.name.toUpperCase()}`, f.desc, f.ppCost, true, () => {
        if (s.res.pp < f.ppCost) { warn(`KRÄVER ${f.ppCost} \u{2696}\u{FE0F} POLITICAL POWER`); return; }
        s.res.pp -= f.ppCost;
        s.nation.formation = { type: 'federation', id: f.id, name: f.name, icon: f.icon };
        s.permMods = { ...f.mods };
        recomputeNation(); renderResbar(); renderNationTab(); renderTopbar();
        toast(`${f.icon} ${f.name.toUpperCase()} HAR BILDATS!`, 'amber', 7000);
        globe.addFireworks(capitalLL(s.home), 8000);
      }, f.mods);
    }
    body.appendChild(fDiv);
  }

  for (const g of STAT_GROUPS) {
    const div = document.createElement('div');
    div.className = 'natgroup';
    const title = document.createElement('div');
    title.className = 'gtitle';
    title.textContent = '▸ ' + g.name;
    div.appendChild(title);
    for (const [id, def] of Object.entries(STATS)) {
      if (def.group !== g.id) continue;
      const v = stats[id].total;
      const good = statGoodness(id, v);
      const row = document.createElement('div');
      row.className = 'statrow';
      const name = document.createElement('div');
      name.className = 'sname';
      name.innerHTML = `${def.icon} ${def.name.toUpperCase()}<small>${def.desc}</small>`;
      const bar = document.createElement('div');
      bar.className = 'sbar';
      if (v !== 0) {
        const fill = document.createElement('div');
        fill.className = 'sfill';
        fill.style.background = good > 0 ? '#4ae37a' : '#ff6b5e';
        const half = Math.abs(v) / 2;
        if (v > 0) { fill.style.left = '50%'; fill.style.width = half + '%'; }
        else { fill.style.left = (50 - half) + '%'; fill.style.width = half + '%'; }
        bar.appendChild(fill);
      }
      const val = document.createElement('div');
      val.className = 'sval ' + (v === 0 ? 'zero' : good > 0 ? 'pos' : 'neg');
      val.textContent = v > 0 ? '+' + v : String(v);
      row.append(name, bar, val);
      div.appendChild(row);
    }
    body.appendChild(div);
  }
}

// ---------- LAGAR-fliken ----------
function renderLawsTab(body) {
  const s = state.solo;
  body.innerHTML = `<div style="font-size:7px;color:var(--holo-dim);margin-bottom:10px">BYTE KOSTAR 15 \u{2696}\u{FE0F} PER STEG • DU HAR <span style="color:var(--amber)">${s.res.pp} \u{2696}\u{FE0F}</span> • L\u{00C5}STA ALTERNATIV BLOCKERAS AV DIN IDEOLOGI</div>`;
  // vald lag väntar på godkännande: grön bock / rött kryss högst upp
  const pend = state.pendingLaw;
  if (pend) {
    const pDef = LAWS[pend.cat];
    const pOpt = pDef.options.find((o) => o.id === pend.oid);
    const row = document.createElement('div');
    row.id = 'lawconfirm';
    row.innerHTML = `<span class="lctxt">${pDef.icon} ${pDef.name.toUpperCase()} \u{2192} <b>${pOpt.name.toUpperCase()}</b> — ${pend.cost} \u{2696}\u{FE0F}</span>`;
    const ok = document.createElement('button');
    ok.className = 'lcbtn ok';
    ok.textContent = '\u{2705} GODKÄNN LAGEN';
    ok.addEventListener('click', () => {
      if (s.res.pp < pend.cost) { warn(`KRÄVER ${pend.cost} \u{2696}\u{FE0F} — DU HAR ${s.res.pp}`); return; }
      s.res.pp -= pend.cost;
      s.nation.laws[pend.cat] = pend.oid;
      state.pendingLaw = null;
      recomputeNation();
      renderResbar();
      renderNationTab();
      toast(`${pDef.name.toUpperCase()}: ${pOpt.name.toUpperCase()} (\u{2212}${pend.cost} \u{2696}\u{FE0F})`, 'amber');
    });
    const no = document.createElement('button');
    no.className = 'lcbtn no';
    no.textContent = '\u{274C} GE TILLBAKA';
    no.addEventListener('click', () => {
      state.pendingLaw = null;
      renderNationTab();
      toast('LAGFÖRSLAGET DROGS TILLBAKA', '', 3000);
    });
    row.appendChild(ok);
    row.appendChild(no);
    body.appendChild(row);
  }
  for (const [cat, def] of Object.entries(LAWS)) {
    const div = document.createElement('div');
    div.className = 'lawcat';
    const cur = lawOption(cat, s.nation.laws[cat]);
    const ln = document.createElement('div');
    ln.className = 'lname';
    ln.innerHTML = `${def.icon} ${def.name.toUpperCase()} <small>— ${cur?.name.toUpperCase() || ''}</small>`;
    div.appendChild(ln);
    const opts = document.createElement('div');
    opts.className = 'lawopts';
    for (const o of def.options) {
      const btn = document.createElement('button');
      btn.className = 'lawopt';
      const isCur = s.nation.laws[cat] === o.id;
      const locked = !isCur && lawLockedBy(s.nation, cat, o.id);
      if (isCur) btn.classList.add('cur');
      if (locked) btn.classList.add('locked');
      if (pend && pend.cat === cat && pend.oid === o.id) btn.classList.add('pend');
      const cost = lawChangeCost(cat, s.nation.laws[cat], o.id);
      btn.textContent = (locked ? '\u{1F512} ' : '') + o.name.toUpperCase();
      btn.addEventListener('mouseenter', () => {
        if (locked) { setPreview(`<span class="dn">\u{1F512} ${locked.toUpperCase()}</span>`); return; }
        if (isCur) { setPreview(`<span class="dc">${o.name.toUpperCase()} — NUVARANDE LAG</span>`); return; }
        setPreview(`<span class="dc">${def.name.toUpperCase()} \u{2192} ${o.name.toUpperCase()} — KOSTAR ${cost} \u{2696}\u{FE0F}</span> &nbsp; ` + deltaHtml(diffMods(o.mods, cur?.mods)));
      });
      btn.addEventListener('mouseleave', () => setPreview());
      btn.addEventListener('click', () => {
        if (isCur) { state.pendingLaw = null; renderNationTab(); return; }
        if (locked) { toast(locked.toUpperCase(), 'red', 4000); return; }
        if (s.res.pp < cost) { warn(`KRÄVER ${cost} \u{2696}\u{FE0F} POLITICAL POWER — DU HAR ${s.res.pp}`); return; }
        // lagen träder inte i kraft direkt — den väntar på godkännande högst upp
        state.pendingLaw = { cat, oid: o.id, cost };
        renderNationTab();
        $('#natbody').scrollTop = 0;
      });
      opts.appendChild(btn);
    }
    div.appendChild(opts);
    body.appendChild(div);
  }
}

// ---------- IDEOLOGI-fliken ----------
function renderIdeologyTab(body) {
  const s = state.solo;
  const cur = IDEOLOGIES[s.nation.ideology];
  body.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'natgroup';
  head.innerHTML = `<div class="gtitle">▸ NUVARANDE: ${cur.icon} ${cur.name.toUpperCase()}${s.nation.doctrine && cur.doctrines ? ' — ' + cur.doctrines[s.nation.doctrine]?.name.toUpperCase() : ''}</div>
    <div style="font-size:7px;color:var(--holo-dim);line-height:1.9">${modSummary(ideologyMods(s.nation), 10) || 'inga effekter'}</div>`;
  if (cur.doctrines) {
    const dr = document.createElement('div');
    dr.className = 'docrow';
    for (const [did, d] of Object.entries(cur.doctrines)) {
      const b = document.createElement('button');
      b.className = 'lawopt' + (s.nation.doctrine === did ? ' cur' : '');
      b.textContent = d.name.toUpperCase();
      b.addEventListener('mouseenter', () => {
        const curDoc = s.nation.doctrine && cur.doctrines?.[s.nation.doctrine];
        setPreview(`<span class="dc">DOKTRIN ${d.name.toUpperCase()} — ${DOCTRINE_COST} \u{2696}\u{FE0F}</span> &nbsp; ` + deltaHtml(diffMods(d.mods, curDoc?.mods)));
      });
      b.addEventListener('mouseleave', () => setPreview());
      b.addEventListener('click', () => {
        if (s.nation.doctrine === did) return;
        if (s.res.pp < DOCTRINE_COST) { warn(`KRÄVER ${DOCTRINE_COST} \u{2696}\u{FE0F} POLITICAL POWER`); return; }
        s.res.pp -= DOCTRINE_COST;
        s.nation.doctrine = did;
        recomputeNation(); renderResbar(); renderNationTab();
        toast(`DOKTRIN: ${d.name.toUpperCase()}`, 'amber');
      });
      dr.appendChild(b);
    }
    head.appendChild(dr);
  }
  body.appendChild(head);

  const gt = document.createElement('div');
  gt.className = 'gtitle';
  gt.textContent = `▸ BYT IDEOLOGI (${IDEOLOGY_COST} \u{2696}\u{FE0F} + TILLFÄLLIG ORO)`;
  body.appendChild(gt);
  const grid = document.createElement('div');
  grid.className = 'ideogrid';
  for (const [iid, ideo] of Object.entries(IDEOLOGIES)) {
    const card = document.createElement('div');
    card.className = 'ideocard' + (s.nation.ideology === iid ? ' cur' : '');
    card.innerHTML = `<div class="iname">${ideo.icon} ${ideo.name.toUpperCase()}</div><div class="imods">${modSummary(ideo.mods, 4)}</div>`;
    card.addEventListener('mouseenter', () => {
      if (s.nation.ideology === iid) { setPreview('<span class="dc">NUVARANDE IDEOLOGI</span>'); return; }
      setPreview(`<span class="dc">${ideo.name.toUpperCase()} — ${IDEOLOGY_COST} \u{2696}\u{FE0F} + TILLFÄLLIG ORO</span> &nbsp; ` + deltaHtml(diffMods(ideo.mods, ideologyMods(s.nation))));
    });
    card.addEventListener('mouseleave', () => setPreview());
    // klick = FÖRHANDSGRANSKA — bekräftelsen sker i rutan längst ner
    card.addEventListener('click', () => {
      if (s.nation.ideology === iid) return;
      natIdeoPick = natIdeoPick === iid ? null : iid;
      renderNationTab();
    });
    if (natIdeoPick === iid) card.style.borderColor = 'var(--amber)';
    grid.appendChild(card);
  }
  body.appendChild(grid);

  // bekräftelserutan längst ner
  if (natIdeoPick && natIdeoPick !== s.nation.ideology) {
    const pick = IDEOLOGIES[natIdeoPick];
    const box = document.createElement('div');
    box.style.cssText = 'margin-top:12px;padding:12px;border:1px solid rgba(255,176,46,0.5);background:rgba(30,20,4,0.5);font-size:7px;line-height:2';
    const reqTxt = pick.requires
      ? '<br><span style="color:var(--red)">TVINGAR OM LAGAR: ' + Object.keys(pick.requires).map((c) => LAWS[c].name.toUpperCase()).join(', ') + '</span>'
      : '';
    box.innerHTML = `<div style="font-size:9px;color:var(--amber);margin-bottom:4px">${pick.icon} BYT TILL ${pick.name.toUpperCase()}?</div>
      <div>SÅ PÅVERKAS DINA VÄRDEN: ${deltaHtml(diffMods(pick.mods, ideologyMods(s.nation)))}</div>
      <div style="color:var(--holo-dim)">KOSTAR ${IDEOLOGY_COST} \u{2696}\u{FE0F} (DU HAR ${s.res.pp}) + 30 TILLFÄLLIG ORO${reqTxt}</div>`;
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;margin-top:8px';
    const okBtn = document.createElement('button');
    okBtn.className = 'btn amber';
    okBtn.style.margin = '0';
    okBtn.textContent = 'BEKRÄFTA BYTET';
    okBtn.addEventListener('click', () => {
      if (s.res.pp < IDEOLOGY_COST) { warn(`KRÄVER ${IDEOLOGY_COST} \u{2696}\u{FE0F} POLITICAL POWER — DU HAR ${s.res.pp}`); return; }
      s.res.pp -= IDEOLOGY_COST;
      s.nation.ideology = natIdeoPick;
      s.nation.doctrine = pick.doctrines ? Object.keys(pick.doctrines)[0] : null;
      const forced = enforceRequirements(s.nation);
      s.extra.unrest = (s.extra.unrest || 0) + 30;
      natIdeoPick = null;
      recomputeNation(); renderResbar(); renderNationTab();
      toast(`NY IDEOLOGI: ${pick.icon} ${pick.name.toUpperCase()} (+30 ORO ETT TAG)`, 'amber', 5000);
      if (forced.length) toast('LAGAR TVINGADES OM: ' + forced.map((c) => LAWS[c].name.toUpperCase()).join(', '), 'red', 6000);
    });
    const noBtn = document.createElement('button');
    noBtn.className = 'btn';
    noBtn.style.margin = '0';
    noBtn.textContent = 'ÅNGRA';
    noBtn.addEventListener('click', () => { natIdeoPick = null; renderNationTab(); });
    btnRow.append(okBtn, noBtn);
    box.appendChild(btnRow);
    body.appendChild(box);
    box.scrollIntoView({ block: 'nearest' });
  }
}

// ---------- FORSKNING-fliken ----------
function renderResearchTab(body) {
  const s = state.solo;
  body.innerHTML = `<div style="font-size:7px;color:var(--holo-dim);margin-bottom:10px">DU HAR <span style="color:var(--amber)">${s.res.rp} \u{1F52C}</span> FORSKNINGSPOÄNG — RESEARCH OUTPUT GER FLER PER DAG</div>`;
  for (const [gname, gid] of [['CIVIL FORSKNING', 'civil'], ['MILITÄR FORSKNING', 'militar']]) {
    const gt = document.createElement('div');
    gt.className = 'gtitle';
    gt.textContent = '▸ ' + gname;
    body.appendChild(gt);
    for (const [bid, branch] of Object.entries(RESEARCH)) {
      if (branch.group !== gid) continue;
      const row = document.createElement('div');
      row.className = 'resrow';
      const nm = document.createElement('div');
      nm.className = 'rname';
      nm.textContent = `${branch.icon} ${branch.name.toUpperCase()}`;
      row.appendChild(nm);
      const done = s.nation.research[bid] || 0;
      branch.tiers.forEach((t, i) => {
        const active = (s.researchQueue || []).find((r) => r.branch === bid && r.tier === i + 1);
        const box = document.createElement('button');
        box.className = 'tierbox ' + (i < done ? 'done' : i === done ? 'avail' : 'locked');
        box.innerHTML = active
          ? `T${i + 1} \u{23F3} PÅGÅR (${active.left}d)<br>${t.name}`
          : `T${i + 1} ${i < done ? '\u{2713}' : `(${TIER_COST[i]} \u{1F52C})`}<br>${t.name}`;
        box.addEventListener('mouseenter', () => {
          const extra = (t.unlock === 'nuke' ? ' <span class="dn">\u{2622}\u{FE0F} LÅSER UPP KÄRNVAPEN</span>' : '')
            + (t.desc ? ` <span class="desc">${t.desc}</span>` : '');
          setPreview(`<span class="dc">T${i + 1} ${t.name.toUpperCase()} — ${TIER_COST[i]} \u{1F52C}</span> &nbsp; ` + deltaHtml(t.mods || {}) + extra);
        });
        box.addEventListener('mouseleave', () => setPreview());
        box.addEventListener('click', () => {
          if (i < done || active) return;
          if (i > done) { warn('KRÄVER FÖREGÅENDE NIVÅ'); return; }
          if (s.researchQueue?.length) { warn('ETT FORSKNINGSPROJEKT I TAGET — SE KÖN I HÖRNET'); return; }
          if (s.res.rp < TIER_COST[i]) { warn(`KRÄVER ${TIER_COST[i]} \u{1F52C} — DU HAR ${s.res.rp}`); return; }
          s.res.rp -= TIER_COST[i];
          const days = [6, 10, 15, 20, 26][i];
          (s.researchQueue ||= []).push({ branch: bid, tier: i + 1, name: t.name, left: days, total: days, unlock: t.unlock });
          renderBuildCorner(); renderResbar(); renderNationTab();
          toast(`\u{1F52C} FORSKNING STARTAD: ${t.name.toUpperCase()} — KLAR OM ${days} DAGAR`, 'amber', 5000);
        });
        row.appendChild(box);
      });
      body.appendChild(row);
    }
  }
}

$('#nationbtn').addEventListener('click', openNation);
$('#natclose').addEventListener('click', () => $('#nation').classList.remove('show'));
$('#cpclose').addEventListener('click', () => $('#citypanel').classList.remove('show'));
document.querySelectorAll('.nattab').forEach((el) => el.addEventListener('click', () => {
  natTab = el.dataset.tab;
  renderNationTab();
}));

// ---------- faktionsvalet (M9) ----------
function openFactionPick() {
  const list = $('#factionlist');
  list.innerHTML = '';
  for (const [fid, f] of Object.entries(FACTIONS)) {
    const card = document.createElement('div');
    card.className = 'cbcard';
    const mods = Object.entries(f.mods).map(([k, v]) => `${STATS[k]?.name || k} ${v > 0 ? '+' : ''}${v}`).join(', ');
    card.innerHTML = `<div class="cbn">${f.icon} ${f.name}</div>
      <div>${f.desc}</div>
      <div class="cbu">ENHETER: ${Object.values(f.unitNames).join(' · ')}</div>
      <div class="cbu">BONUS: ${mods}</div>`;
    card.addEventListener('click', () => {
      const s = state.solo;
      s.faction = fid;
      s.factionMods = { ...f.mods };
      applyFaction(f);
      recomputeNation();
      renderResbar();
      overlay('#factionpick', false);
      toast(`${f.icon} ${f.name} — DIN FAKTION`, 'amber', 5000);
      toast('BYGG DIN ARMÉ I \u{1F3DB}\u{FE0F} NATION-PANELEN — SEN KAN DU RÄTTFÄRDIGA KRIG', '', 6000);
    });
    list.appendChild(card);
  }
  overlay('#factionpick', true);
}

// flytta armén till eget territorium (reträtt/omgruppering); hemma slås
// garnisonen ihop med armén — "två arméer blir en"
$('#movebtn').addEventListener('click', () => {
  const s = state.solo;
  if (!selectedCountry || !s?.army?.units.length || state.battle) return;
  const dest = selectedCountry.id;
  show($('#movebtn'), false);
  armyFlyTo(capitalLL(dest), 0, () => {
    s.army.at = dest;
    const g = s.garrisons?.[dest];
    if (g?.length) {
      const n = g.length;
      s.army.units.push(...g);
      delete s.garrisons[dest];
      toast(`\u{1F91D} ARMÉERNA SAMMANSLAGNA — +${n} ENHETER FRÅN GARNISONEN I ${cname(dest)}`, 'amber', 6000);
    } else {
      toast(`ARMÉN HAR OMGRUPPERAT TILL ${cname(dest)}`, '', 4000);
    }
    updateArmyMarker();
    refreshInfoPanel();
  });
});

// hotade AI-imperier mobiliserar: bygger och skickar förstärkningar från sina länder
function empireDefense(targetId) {
  const world = worldCtx().world;
  const conq = world.aiOwned[targetId] || (world.aiEmpires[targetId]?.owned.length ? targetId : null);
  if (!conq) return;
  const emp = world.aiEmpires[conq];
  if (!emp || !emp.owned.length) return;
  world.defenses ||= [];
  if (world.defenses.some((d) => d.target === targetId)) return;
  world.defenses.push({ empire: conq, target: targetId, waves: Math.min(3, emp.owned.length + 1), ticks: 1 });
  toast(`\u{1F6A8} ${emp.name.toUpperCase()} MOBILISERAR SITT FÖRSVAR — FÖRSTÄRKNINGAR ÄR PÅ VÄG!`, 'red', 8000);
}

function tickDefenses(ctx) {
  const { world } = ctx;
  for (const d of [...(world.defenses || [])]) {
    if (--d.ticks > 0) continue;
    const emp = world.aiEmpires[d.empire];
    const stillHeld = world.aiOwned[d.target] === d.empire || d.target === d.empire;
    if (!emp || !stillHeld || d.waves <= 0) {
      world.defenses = world.defenses.filter((x) => x !== d);
      continue;
    }
    // bygg upp i imperiets länder + skicka en våg mot det hotade landet
    const sources = [d.empire, ...emp.owned].filter((cid) => cid !== d.target && (world.aiOwned[cid] === d.empire || cid === d.empire));
    const src = sources[Math.floor(Math.random() * sources.length)];
    if (src) {
      const ca = countryArmy(src);
      if (ca.units.length > 2) {
        const units = ca.units.splice(0, Math.min(4, ca.units.length - 1)).map((u) => ({ ...u, side: 1 }));
        const from = capitalLL(src), to = capitalLL(d.target);
        world.moving.push({
          id: Math.random().toString(36).slice(2, 8),
          att: d.empire, target: d.target, units, defensive: true,
          fromLL: from, toLL: to,
          start: performance.now(), dur: 8000 + d3.geoDistance(from, to) * 120000,
        });
        toast(`\u{1F6A9} ${emp.name.toUpperCase()} SKICKAR FÖRSTÄRKNINGAR (${units.length} ENHETER) MOT ${cname(d.target)}`, 'red', 6000);
        updateMovingMarkers();
      } else {
        ca.units.push(mkUnit('INF', 1), mkUnit('TANK', 1)); // bygger nytt inför nästa våg
      }
    }
    d.waves--;
    d.ticks = 2;
  }
}

// ---------- krigsrättfärdigande (M8) ----------
$('#justifybtn').addEventListener('click', () => {
  if (!selectedCountry || !state.solo?.nation) return;
  const s = state.solo;
  const days = justifyDays(s.stats.justtime.total);
  $('#cbTarget').textContent = `MOT ${selectedCountry.name.toUpperCase()} — TAR ${days} DAGAR`;
  const list = $('#cblist');
  list.innerHTML = '';
  for (const [key, cb] of Object.entries(CASUS_BELLI)) {
    const card = document.createElement('div');
    card.className = 'cbcard';
    card.innerHTML = `<div class="cbn">${cb.icon} ${cb.name.toUpperCase()} — ${cb.ppCost} \u{2696}\u{FE0F}</div>
      <div>${cb.desc}</div>
      <div class="cbu">LÅSER UPP: ${cb.unlocks}</div>
      <div class="cbx">KAN INTE: ${cb.cannot}</div>`;
    card.addEventListener('click', () => {
      if (s.res.pp < cb.ppCost) { toast(`KRÄVER ${cb.ppCost} \u{2696}\u{FE0F} POLITICAL POWER`, 'red'); return; }
      s.res.pp -= cb.ppCost;
      s.wars[selectedCountry.id] = { cb: key, status: 'justifying', days, total: days };
      renderBuildCorner();
      overlay('#cbchooser', false);
      renderResbar();
      refreshInfoPanel();
      toast(`RÄTTFÄRDIGAR ${cb.name.toUpperCase()} MOT ${selectedCountry.name.toUpperCase()} — ${days} DAGAR`, 'amber', 5000);
      if (state.mode === 'solo') {
        markKnown(selectedCountry.id);
        empireDefense(selectedCountry.id);
        updateCountryArmyMarkers();
      }
    });
    list.appendChild(card);
  }
  overlay('#cbchooser', true);
});
$('#cbCancel').addEventListener('click', () => overlay('#cbchooser', false));

$('#wpbtn').addEventListener('click', () => {
  if (!selectedCountry || !state.solo) return;
  delete state.solo.wars[selectedCountry.id];
  toast(`VIT FRED — KONFLIKTEN MED ${selectedCountry.name.toUpperCase()} AVSLUTAD`, '', 4500);
  refreshInfoPanel();
});

// terrängbrickan uppe i stridshörnet: ikon + försvarsbonus för rutan man tryckt på
const TERR_META = {
  0: { icon: '\u{1F33E}', name: 'SLÄTT', def: 0 },
  1: { icon: '\u{1F332}', name: 'SKOG', def: 1 },
  2: { icon: '\u{26F0}\u{FE0F}', name: 'BERG', def: 2 },
  3: { icon: '\u{1F6E3}\u{FE0F}', name: 'VÄG', def: 0 },
  4: { icon: '\u{1F30A}', name: 'VATTEN', def: 0, note: 'ENDAST FLYG' },
  5: { icon: '\u{1F309}', name: 'BRO', def: 0 },
  6: { icon: '\u{1F3D9}\u{FE0F}', name: 'STAD', def: 3 },
};

function renderTerrBadge(t) {
  const m = TERR_META[t];
  const el = $('#terrbadge');
  if (!m) { el.style.display = 'none'; return; }
  el.innerHTML = `<div style="font-size:14px;text-align:center">${m.icon}</div>
    <div style="font-size:8px;text-align:center">${m.name}</div>
    ${m.def ? `<div style="font-size:7px;color:var(--green,#3ee6c8);text-align:center">FÖRSVAR +${m.def} ${'\u{2605}'.repeat(m.def)}</div>` : ''}
    ${m.note ? `<div style="font-size:6px;color:var(--holo-dim);text-align:center">${m.note}</div>` : ''}`;
  el.style.display = 'block';
}

// ---------- kravskärmen efter seger ----------
let demandState = null; // {target, cbKey, result, choices}

function openDemands(target, cbKey, result) {
  const s = state.solo;
  const cb = CASUS_BELLI[cbKey];
  const pop = state.facts[target.id]?.p || 5e6;
  demandState = { target, cbKey, result, choices: { seize: 0.5 } };
  $('#demTarget').textContent = `${cb.icon} ${cb.name.toUpperCase()} AV ${target.name.toUpperCase()}`;
  const list = $('#demlist');
  list.innerHTML = '';
  const addCheck = (id, label, sub, checked) => {
    const row = document.createElement('label');
    row.className = 'demrow';
    row.innerHTML = `<input type="checkbox" id="dem_${id}" ${checked ? 'checked' : ''}><span>${label}<div class="dd">${sub}</div></span>`;
    list.appendChild(row);
  };
  if (cb.demands.annex) addCheck('annex', 'ANNEKTERA LANDET', 'Territoriet blir ditt', true);
  if (cb.demands.puppet) addCheck('puppet', 'GÖR TILL LYDSTAT', 'Behåller självstyre men följer dig — du måste försvara den', true);
  if (cb.demands.ideology) addCheck('ideology', 'TVINGA DIN IDEOLOGI', 'Lydstaten tar din ideologi', false);
  if (cb.demands.laws) addCheck('laws', 'TVINGA DINA LAGAR', 'Lydstaten tar dina lagar', false);
  if (cb.demands.liberate) {
    const holdings = Object.entries(s.aiOwned).filter(([, conq]) => conq === target.id).length;
    addCheck('liberate', `BEFRIA ALLA LÄNDER UNDER DESS STYRE (${holdings} ST)`, 'Imperiet upplöses — länderna blir fria', true);
  }
  if (cb.demands.seize) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div style="font-size:8px;margin-top:8px">BESLAGTA PENGAR & RESURSER:</div>`;
    const opts = document.createElement('div');
    opts.className = 'seizeopt';
    for (const pct of [0.1, 0.5, 0.9]) {
      const b = document.createElement('button');
      b.className = 'lawopt' + (pct === 0.5 ? ' cur' : '');
      b.textContent = `${pct * 100}% (+${seizeAmount(pop, pct)} \u{1F4B0})`;
      b.addEventListener('click', () => {
        demandState.choices.seize = pct;
        opts.querySelectorAll('.lawopt').forEach((x) => x.classList.remove('cur'));
        b.classList.add('cur');
      });
      opts.appendChild(b);
    }
    wrap.appendChild(opts);
    list.appendChild(wrap);
  }
  if (cb.demands.reparations) {
    demandState.choices.repPct = 0.15;
    demandState.choices.repYears = 5;
    addCheck('reparations', 'KRIGSSKADESTÅND', '', false);
    const wrap = document.createElement('div');
    const info = document.createElement('div');
    info.style.cssText = 'font-size:7px;color:var(--holo-dim);margin:4px 0';
    const repDaily = () => Math.max(1, Math.round((pop / 4e6) * (demandState.choices.repPct / 0.15)));
    const updInfo = () => {
      info.textContent = `${demandState.choices.repPct * 100}% I ${demandState.choices.repYears} ÅR → +${repDaily()} \u{1F4B0}/DAG I ${demandState.choices.repYears * 30} DAGAR`;
    };
    const mkRow = (values, key, fmt) => {
      const row = document.createElement('div');
      row.className = 'seizeopt';
      for (const v of values) {
        const b = document.createElement('button');
        b.className = 'lawopt' + (demandState.choices[key] === v ? ' cur' : '');
        b.textContent = fmt(v);
        b.addEventListener('click', () => {
          demandState.choices[key] = v;
          row.querySelectorAll('.lawopt').forEach((x) => x.classList.remove('cur'));
          b.classList.add('cur');
          updInfo();
          document.querySelector('#dem_reparations').checked = true;
        });
        row.appendChild(b);
      }
      return row;
    };
    wrap.appendChild(mkRow([0.05, 0.15, 0.25], 'repPct', (v) => `${v * 100}%`));
    wrap.appendChild(mkRow([2, 5, 10], 'repYears', (v) => `${v} ÅR`));
    wrap.appendChild(info);
    updInfo();
    list.appendChild(wrap);
  }
  overlay('#demands', true);
}

$('#demConfirm').addEventListener('click', () => {
  if (!demandState) return;
  const { target, cbKey, result, choices } = demandState;
  const s = state.solo;
  const cb = CASUS_BELLI[cbKey];
  const pop = state.facts[target.id]?.p || 5e6;
  const got = [];
  const checked = (id) => document.querySelector('#dem_' + id)?.checked;

  if (state.mode === 'player') {
    // i multiplayer verkställer TV:n världsförändringen
    net.send('conquer', {
      country: target.id,
      puppet: !!(cb.demands.puppet && checked('puppet')),
      liberate: !!(cb.demands.liberate && checked('liberate')),
    });
    if (cb.demands.annex && checked('annex')) got.push('ANNEKTERAT');
    if (cb.demands.puppet && checked('puppet')) got.push('LYDSTAT');
    if (cb.demands.liberate && checked('liberate')) got.push('IMPERIET UPPLÖST');
  } else {
    const wasHeldBy = s.aiOwned[target.id];
    delete s.aiOwned[target.id];
    if (wasHeldBy) {
      const emp = s.aiEmpires[wasHeldBy];
      if (emp) emp.owned = emp.owned.filter((x) => x !== target.id);
    }

    if (cb.demands.annex && checked('annex')) {
      s.claims[target.id] = { color: SOLO_COLOR, playerName: 'DU' };
      got.push('ANNEKTERAT');
    }
    if (cb.demands.puppet && checked('puppet')) {
      s.claims[target.id] = { color: '#ff9f8a', playerName: 'DIN LYDSTAT', puppet: true };
      got.push('LYDSTAT');
      if (checked('ideology')) {
        (state.world ||= {})[target.id] = { ...(state.world?.[target.id] || countryIdeology(target.id)), ideology: s.nation.ideology, doctrine: s.nation.doctrine };
        got.push('IDEOLOGI TVINGAD');
      }
      if (checked('laws')) got.push('LAGAR TVINGADE');
    }
    if (cb.demands.liberate && checked('liberate')) {
      let freed = 0;
      for (const [cid, conq] of Object.entries({ ...s.aiOwned })) {
        if (conq === target.id) { delete s.aiOwned[cid]; freed++; }
      }
      const emp = s.aiEmpires[target.id];
      if (emp) emp.owned = [];
      s.claims[target.id] = { color: SOLO_COLOR, playerName: 'DU' };
      got.push(`${freed} LÄNDER BEFRIADE`);
    }
  }
  if (cb.demands.seize && choices.seize) {
    const amt = seizeAmount(pop, choices.seize);
    s.res.money += amt;
    got.push(`+${amt} \u{1F4B0} BESLAGTAGET`);
  }
  if (cb.demands.reparations && checked('reparations')) {
    const daily = Math.max(1, Math.round((pop / 4e6) * (choices.repPct / 0.15)));
    const days = choices.repYears * 30;
    s.reparations.push({ from: target.name, daily, days });
    got.push(`SKADESTÅND ${choices.repPct * 100}% I ${choices.repYears} ÅR (+${daily} \u{1F4B0}/DAG)`);
  }

  delete s.wars[target.id];
  s.army.units = expandUnits(result.survivors);
  s.army.units.push(mkUnit('INF', 0));
  s.army.at = target.id;
  s.army.ll = capitalLL(target.id);
  updateArmyMarker();
  applyState();
  renderResbar();
  overlay('#demands', false);
  demandState = null;

  const res = resourcesOf(target.id).map((r) => `${RESOURCES[r].icon} ${RESOURCES[r].name.toUpperCase()}`).join(' + ');
  $('#bresTitle').textContent = result.nuke ? '\u{2622}\u{FE0F} ATOMSLAG' : 'SEGER!';
  $('#bresTitle').style.color = result.nuke ? 'var(--red)' : 'var(--amber)';
  $('#bresText').innerHTML = `${target.name.toUpperCase()}: ${got.join(' · ')}<br>TILLGÅNGAR: ${res}<br>+1 INFANTERI I FÖRSTÄRKNING${result.nuke ? '<br><span style="color:var(--red)">VÄRLDEN FÖRDÖMER DIG: APPROVAL −25, ORO +25</span>' : ''}`;
  overlay('#bresult', true);
});

// ---------- anfall + stridsval ----------
$('#attackbtn').addEventListener('click', () => {
  if (!selectedCountry || !state.solo?.army || state.battle) return;
  if (state.mode !== 'solo' && state.mode !== 'player') return;
  const target = selectedCountry;
  // PvP: målet ägs av en annan spelare → värden avgör (och köar om upptagen)
  if (state.mode === 'player') {
    const ownerP = playerOwning(target.id);
    if (ownerP && ownerP.id !== net.myId) {
      net.send('pvp', { target: target.id });
      toast(`ANFALLSORDER MOT ${target.name.toUpperCase()} SKICKAD — TV:N AVGÖR (KÖAS OM ${ownerP.name.toUpperCase()} STRIDER)`, 'amber', 6000);
      show($('#attackbtn'), false);
      return;
    }
  }
  state.pendingTarget = target;
  state.solo.prevAt = state.solo.army.at;
  show($('#attackbtn'), false);
  const dest = capitalLL(target.id);
  toast(`ARMÉN RYCKER FRAM MOT ${target.name.toUpperCase()}…`, 'amber', 2500);
  globe.animateTo(dest, Math.max(2, globe.zoom), 1500);
  armyFlyTo(dest, 1500, () => {
    state.solo.army.at = target.id;
    startBattle('A'); // krig är alltid taktikstriden
  });
});

function closeChooser() { overlay('#chooser', false); }

$('#chCancel').addEventListener('click', () => {
  closeChooser();
  refreshInfoPanel();
});
$('#nukebtn').addEventListener('click', () => {
  const s = state.solo;
  if (!selectedCountry || !s?.nation) return;
  if (s.res.money < 500) { warn('KRÄVER 500 \u{1F4B0}'); return; }
  state.pendingTarget = selectedCountry;
  s.prevAt = s.army?.at;
  s.res.money -= 500;
  s.extra.approval = (s.extra.approval || 0) - 25;
  s.extra.unrest = (s.extra.unrest || 0) + 25;
  recomputeNation();
  renderResbar();
  finishBattle({
    winner: 0,
    survivors: s.army.units.map(({ type, hp }) => ({ type, hp })),
    nuke: true,
  });
});
$('#chA').addEventListener('click', () => { closeChooser(); startBattle('A'); });
$('#chB').addEventListener('click', () => { closeChooser(); startBattle('B'); });
$('#chAuto').addEventListener('click', () => {
  closeChooser();
  const target = state.pendingTarget;
  const def = defenderArmy(target, state.facts[target.id]);
  const r = autoResolve(state.solo.army.units, def);
  finishBattle({
    winner: r.winner,
    survivors: r.survivorsA.map(({ type, hp }) => ({ type, hp })),
    auto: true, rounds: r.rounds, defLeft: r.survivorsD.length,
  });
});

function seedFrom(id) {
  let h = 3;
  for (const ch of String(id)) h = (h * 33 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function startBattle(kind) {
  const target = state.pendingTarget;
  // stora arméer slås ihop till dubbelenheter (hp ≤ 20) så kartan aldrig svämmar över
  const def = consolidate((state.mode === 'solo' ? countryArmy(target.id).units : defenderArmy(target, state.facts[target.id])).map((u) => ({ ...u })));
  if (!def.length) def.push(mkUnit('INF', 1)); // sista garnisonen
  const atk = consolidate(state.solo.army.units.map((u) => ({ ...u })));
  const biome = biomeFor(target);
  $('#battle').classList.add('show');
  $('#btitle').textContent = `PROTOTYP ${kind} — ${kind === 'A' ? 'TAKTIK' : 'REALTID'} • ${target.name.toUpperCase()}`;
  show($('#bEndTurn'), kind === 'A');
  show($('#bSelAll'), kind === 'B');
  const opts = {
    canvas: $('#bcanvas'),
    klinchCanvas: $('#kcanvas'),
    klinchEl: $('#klinch'),
    biome,
    atk,
    def,
    seed: seedFrom(target.id),
    atkBoost: battleBoost(),
    kenneyRow: FACTIONS[state.solo.faction]?.kenneyRow ?? 8,
    setStatus: (s) => { $('#bstatus').textContent = s; },
    setTerrain: renderTerrBadge,
    onEnd: (result) => finishBattle(result),
  };
  state.battle = kind === 'A' ? new BattleA(opts) : new BattleB(opts);
  if (state.mode === 'player') net.send('battle', { busy: true, target: target.name });
}

function finishBattle(result) {
  const target = state.pendingTarget;
  const s = state.solo;
  state.battle?.destroy?.();
  state.battle = null;
  $('#battle').classList.remove('show');
  $('#klinch').style.display = 'none';

  if (state.mode === 'player') net.send('battle', { busy: false });

  // försvararens förluster består — den stående armén tar stryk
  if (state.mode === 'solo' && result.defSurvivors) {
    countryArmy(target.id).units = expandUnits(result.defSurvivors).map((u) => ({ ...u, side: 1 }));
  }

  const victory = result.winner === 0;
  if (victory) {
    // segern ger KRAVSKÄRMEN — vad du får styrs av ditt casus belli
    const war = s.wars[target.id];
    openDemands(target, war?.cb || 'annexation', result);
    return;
  } else if (result.retreat) {
    s.army.units = expandUnits(result.survivors);
    s.army.at = s.prevAt;
    s.army.ll = capitalLL(s.prevAt);
    $('#bresTitle').textContent = 'RETRÄTT';
    $('#bresTitle').style.color = 'var(--holo)';
    $('#bresText').textContent = 'ARMÉN DRAR SIG TILLBAKA MED ÖVERLEVANDE ENHETER.';
  } else {
    spawnArmy(s.home);
    // förloraren betalar: motståndaren "vänder på steken"
    const penalty = Math.round(s.res.money * 0.15);
    s.res.money -= penalty;
    delete s.wars[target.id];
    $('#bresTitle').textContent = 'NEDERLAG';
    $('#bresTitle').style.color = 'var(--red)';
    $('#bresText').innerHTML = `ARMÉN KROSSADES${result.auto ? ` (AUTO, ${result.defLeft} FIENDER KVAR)` : ''} — EN NY ARMÉ MOBILISERAS I HEMLANDET.<br>${target.name.toUpperCase()} KRÄVER SKADESTÅND: \u{2212}${penalty} \u{1F4B0}`;
  }
  updateArmyMarker();
  applyState();
  overlay('#bresult', true);
}

$('#bresBtn').addEventListener('click', () => {
  overlay('#bresult', false);
  state.pendingTarget = null;
  refreshInfoPanel();
});
$('#bEndTurn').addEventListener('click', () => state.battle?.endTurn?.());
$('#bSelAll').addEventListener('click', () => state.battle?.selectAll?.());
$('#bRetreat').addEventListener('click', () => state.battle?.retreat?.());

// ---------- togglar + legend ----------
// terrängläge: globen färgas som en riktig jordglob — öken gul, djungel grön, polerna vita
let resourceMarkerList = null;
function buildResourceMarkers() {
  const list = [];
  for (const c of globe.countries) {
    const rs = resourcesOf(c.id);
    if (!rs.length) continue;
    list.push({ ll: c.centroid, icons: rs.map((r) => RESOURCES[r].icon).join('') });
  }
  return list;
}

let terrainColorMap = null;
function buildTerrainColors() {
  const BIOME_COLORS = {
    GRAS: ['#6b9e57', '#749c54', '#5f9351', '#7ba35e'],
    SNO: ['#e6ecf2', '#dde6ee', '#d3dfe8'],
    OKEN: ['#d9c078', '#d4b96c', '#cdb670', '#e0c983'],
    DJUNGEL: ['#3f8a4f', '#37814a', '#468f52'],
  };
  const map = {};
  for (const c of globe.countries) {
    const shades = BIOME_COLORS[biomeFor(c)] || BIOME_COLORS.GRAS;
    map[c.id] = shades[(parseInt(c.id, 10) || 0) % shades.length];
  }
  return map;
}

function wireToggles() {
  const tgC = $('#tgCities'), tgT = $('#tgTrade'), tgL = $('#tgLegend');
  tgC.addEventListener('click', () => {
    const on = !globe.showCities;
    globe.setShowCities(on);
    tgC.classList.toggle('on', on);
  });
  const tgTe = $('#tgTerrain');
  tgTe.addEventListener('click', () => {
    const on = !globe.showTerrain;
    if (on) globe.setTerrainColors(terrainColorMap ||= buildTerrainColors());
    globe.setShowTerrain(on);
    tgTe.classList.toggle('on', on);
  });
  tgT.addEventListener('click', () => {
    const on = !globe.showTrade;
    globe.setShowTrade(on);
    tgT.classList.toggle('on', on);
  });
  tgL.addEventListener('click', () => {
    const open = $('#legendpanel').style.display !== 'block';
    show($('#legendpanel'), open);
    tgL.classList.toggle('on', open);
    // tillgångarna ritas på respektive land — inte bara i hörnpanelen
    globe.setResourceMarkers(open ? (resourceMarkerList ||= buildResourceMarkers()) : null);
  });
}

function renderLegend() {
  const el = $('#legendlist');
  el.innerHTML = '';
  for (const [, r] of Object.entries(RESOURCES)) {
    const row = document.createElement('div');
    row.className = 'lrow';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = r.color;
    const txt = document.createElement('span');
    txt.textContent = `${r.icon} ${r.name.toUpperCase()}`;
    row.append(dot, txt);
    el.appendChild(row);
  }
  const sub = document.createElement('div');
  sub.className = 'sub';
  sub.textContent = '▶ KRÄVS FÖR ATT BYGGA';
  el.appendChild(sub);
  for (const rec of RECIPES) {
    const row = document.createElement('div');
    row.className = 'lrow';
    const txt = document.createElement('span');
    txt.innerHTML = `${rec.icon} ${rec.name} <span class="needs">= ${rec.needs.map((n) => RESOURCES[n].icon + ' ' + RESOURCES[n].name).join(' + ')}</span>`;
    row.appendChild(txt);
    el.appendChild(row);
  }
}

// ---------- transportnätet: vägar, järnvägar, sjörutter, flygrutter ----------
function buildRoutes(citiesByCountry) {
  const routes = [];
  const capitals = [];
  for (const [cid, list] of Object.entries(citiesByCountry)) {
    if (!list.length) continue;
    const cap = list.find((c) => c.c) || list[0];
    capitals.push({ cid, ll: cap.ll, pop: state.facts[cid]?.p || 0 });
    const res = resourcesOf(cid);
    const col = (i) => RESOURCES[res[i % res.length]].color;

    // VÄGNÄT: varje stad kopplas till sin närmaste grannstad i landet
    const seenPair = new Set();
    list.forEach((city, i) => {
      let best = null, bj = -1, bd = 1e9;
      list.forEach((o, j) => {
        if (o === city) return;
        const d = d3.geoDistance(city.ll, o.ll);
        if (d < bd) { bd = d; best = o; bj = j; }
      });
      if (!best) return;
      const key = Math.min(i, bj) + '-' + Math.max(i, bj);
      if (seenPair.has(key)) return;
      seenPair.add(key);
      routes.push({
        a: city.ll, b: best.ll, kind: 'road',
        color: col(i),
        dur: 5000 + bd * 40000 + Math.random() * 2000,
        phase: Math.random() * 9000,
        intl: false,
      });
    });

    // JÄRNVÄG: huvudstaden ↔ de två största övriga städerna
    list.filter((c) => c !== cap).slice(0, 2).forEach((city, i) => {
      routes.push({
        a: cap.ll, b: city.ll, kind: 'rail',
        color: col(i + 1),
        dur: 3500 + d3.geoDistance(cap.ll, city.ll) * 25000,
        phase: Math.random() * 7000,
        intl: false,
      });
    });
  }

  // INTERNATIONELLT: huvudstad ↔ 2 närmaste utländska huvudstäder
  // (kind 'land' tills sjöklassningen konstaterat att rutten går över hav)
  const seen = new Set();
  for (const c of capitals) {
    const near = capitals
      .filter((o) => o.cid !== c.cid)
      .map((o) => ({ o, d: d3.geoDistance(c.ll, o.ll) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { o, d } of near) {
      const key = [c.cid, o.cid].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      const res = resourcesOf(c.cid);
      routes.push({
        a: c.ll, b: o.ll, kind: 'land',
        color: RESOURCES[res[0]].color,
        dur: 7000 + d * 5000 + Math.random() * 3000,
        phase: Math.random() * 12000,
        intl: true,
      });
    }
  }

  // FLYGRUTTER: stora länder (>30M) ↔ 2 närmaste stora länder längre bort än ~20°
  const bigs = capitals.filter((c) => c.pop > 30e6);
  const seenAir = new Set();
  for (const c of bigs) {
    const partners = bigs
      .filter((o) => o.cid !== c.cid)
      .map((o) => ({ o, d: d3.geoDistance(c.ll, o.ll) }))
      .filter((x) => x.d > 0.35)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { o, d } of partners) {
      const key = [c.cid, o.cid].sort().join('|');
      if (seenAir.has(key)) continue;
      seenAir.add(key);
      routes.push({
        a: c.ll, b: o.ll, kind: 'air',
        color: '#f2fbff',
        dur: 2500 + d * 2500,
        phase: Math.random() * 6000,
        intl: true,
      });
    }
  }
  return routes;
}

// Klassar internationella rutter som sjörutter genom att sampla storcirkeln:
// går merparten av rutten utanför alla länder är det hav → skepp istället för väg.
// Körs i småbitar för att inte hacka till renderingen.
function classifySeaRoutes() {
  if (state.seaClassified || !globe.countries.length || !globe.routes.length) return;
  state.seaClassified = true;
  const landRoutes = globe.routes.filter((r) => r.kind === 'land');
  let i = 0;
  const chunk = () => {
    const t0 = performance.now();
    while (i < landRoutes.length && performance.now() - t0 < 8) {
      const r = landRoutes[i++];
      let onLand = 0;
      const samples = 8;
      for (let s = 1; s <= samples; s++) {
        if (globe.countryAtLL(r.interp(s / (samples + 1)))) onLand++;
      }
      if (onLand / samples <= 0.4) r.kind = 'sea';
    }
    if (i < landRoutes.length) setTimeout(chunk, 30);
    else globe.refreshRouteLines();
  };
  setTimeout(chunk, 200);
}

// ---------- kartdata ----------
// ---------- småstäder: mångdubbla städerna, pop-skalat per land ----------
const TOWN_SYL = ['ka', 've', 'lin', 'mor', 'sa', 'tor', 'bel', 'ran', 'os', 'vi', 'del', 'nar', 'ke', 'lu', 'gra', 'fen'];
function townName(h, lat, lon) {
  const a = TOWN_SYL[h % 16], b = TOWN_SYL[(h >> 4) % 16];
  let suf;
  if (lat > 40 && lon > -30 && lon < 60) suf = ['burg', 'stad', 'berg', 'dorf', 'vik'][(h >> 8) % 5];
  else if (lat > 5 && lon >= 60) suf = ['pur', 'abad', 'ang', 'shan', 'pore'][(h >> 8) % 5];
  else if (lon <= -30) suf = ['ton', 'ville', 'field', 'burgo', 'ita'][(h >> 8) % 5];
  else suf = ['ba', 'ala', 'ombe', 'esh', 'ara'][(h >> 8) % 5];
  const name = a + b + suf;
  return name[0].toUpperCase() + name.slice(1);
}

let townsDone = false;
function generateTowns() {
  if (townsDone) return;
  if (!globe.countries.length || !state.cities || !Object.keys(state.facts || {}).length) {
    setTimeout(generateTowns, 600);
    return;
  }
  townsDone = true;
  const list = [...globe.countries];
  let i = 0, total = 0;
  const step = () => {
    const t0 = performance.now();
    while (i < list.length && performance.now() - t0 < 24) {
      const c = list[i++];
      const pop = state.facts[c.id]?.p || 3e6;
      const n = Math.max(2, Math.min(90, Math.round(pop / 2.2e6)));
      let h = ((parseInt(c.id, 10) || 7) * 2654435761) % 2147483647;
      const rnd = () => { h = (h * 1103515245 + 12345) % 2147483648; return h / 2147483648; };
      const [[x0, y0], [x1, y1]] = c.bounds;
      const wrap = x1 < x0 ? 360 : 0;
      const towns = [];
      let tries = 0;
      while (towns.length < n && tries < n * 10) {
        tries++;
        let lon = x0 + rnd() * (x1 + wrap - x0);
        if (lon > 180) lon -= 360;
        const lat = y0 + rnd() * (y1 - y0);
        if (!d3.geoContains(c.feature, [lon, lat])) continue;
        towns.push({ n: townName(h, lat, lon), ll: [lon, lat], p: 20e3 + Math.round(rnd() * 350e3), tier: 3 });
      }
      if (towns.length) (state.cities[c.id] ||= []).push(...towns);
      total += towns.length;
    }
    if (i < list.length) setTimeout(step, 0);
    else {
      globe.setCities(state.cities);
      if (selectedCountry) refreshInfoPanel();
      console.log(`IMPERIUM: ${total} småstäder genererade`);
    }
  };
  step();
}

function startWorldLoad() {
  overlay('#loading', true);
  Promise.all([loadCities(), loadFacts()]).then(([cities, facts]) => {
    state.cities = cities;
    state.facts = facts;
    globe.setCities(cities);
    globe.setRoutes(buildRoutes(cities));
    classifySeaRoutes();
    if (selectedCountry) refreshInfoPanel();
  }).catch((e) => console.warn('städer kunde inte laddas', e));

  loadWorld((countries, level, topo) => {
    state.mapLevel = level;
    globe.setCountries(countries);
    globe.setTopology(topo);
    globe.setClaims(claimsMap());
    if (level === '110m') {
      overlay('#loading', false);
      show($('#topbar'));
      show($('#hint'));
      $('#toggles').style.display = 'flex';
      classifySeaRoutes();
      generateTowns();
    } else {
      toast('KARTDETALJ: HÖG UPPLÖSNING', '', 2500);
      if (selectedCountry) selectedCountry = globe.getCountry(selectedCountry.id);
    }
  }).catch((e) => {
    console.error(e);
    $('#loadingtxt').textContent = 'KUNDE INTE HÄMTA KARTAN — KOLLA INTERNET';
  });
}

// ---------- TV-läge (värd) ----------
function startTV() {
  state.mode = 'tv';
  state.hostWorld = { aiOwned: {}, aiEmpires: {}, countryArmies: {}, aiWars: [], moving: [], aiGoals: {}, votes: [] };
  state.battles = { active: [], queued: [] };
  overlay('#menu', false);
  startWorldLoad();
  globe.autoRotate = true;
  // AI-världen lever på TV:n i multiplayer
  setInterval(() => { if (state.mode === 'tv' && globe.countries.length) aiWorldTick(); }, 9000);
  setInterval(() => { if (state.mode === 'tv') checkArrivals(); }, 1000);
  // TV:n har ingen spelklocka — dag/natt + årstider drivs av väggklockan (2 s = 1 dag)
  const tvEpoch = performance.now();
  setInterval(() => { if (state.mode === 'tv') globe.setDayFloat((performance.now() - tvEpoch) / 2000); }, 250);

  net.host((code) => {
    renderTopbar();
    const url = location.protocol === 'file:'
      ? null
      : location.origin + location.pathname + '?room=' + code;
    $('#qrcodeTxt').textContent = code;
    if (url) {
      const qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      const img = new Image();
      img.src = qr.createDataURL(5, 2);
      img.width = 150; img.height = 150;
      $('#qrimg').replaceChildren(img);
      $('#qrurl').textContent = url.replace(/^https?:\/\//, '');
    } else {
      $('#qrimg').textContent = 'Deploya spelet för att kunna skanna QR';
    }
    show($('#qrpanel'));
    toast('RUM SKAPAT — SKANNA QR MED MOBILEN', 'amber', 6000);
  });

  net.on({
    peerOpen: () => {},
    peerLeave: (peerId) => {
      const p = state.players.find((x) => x.id === peerId);
      state.players = state.players.filter((x) => x.id !== peerId);
      broadcastState();
      applyState();
      if (p) toast(`${p.name.toUpperCase()} LÄMNADE`, 'red');
    },
    msg: (peerId, t, d) => {
      if (t === 'hello') {
        const name = String(d?.name || '').trim().slice(0, 12) || 'SPELARE';
        const used = new Set(state.players.map((p) => p.color));
        const color = PLAYER_COLORS.find((c) => !used.has(c)) || PLAYER_COLORS[state.players.length % PLAYER_COLORS.length];
        const player = { id: peerId, name, color, home: null, claims: [], puppets: [], busy: false, busyAt: '', units: [], ideoIcon: '', factionIcon: '' };
        state.players.push(player);
        net.sendTo(peerId, 'welcome', { you: player, players: state.players });
        broadcastState();
        applyState();
        toast(`${name.toUpperCase()} ANSLÖT TILL KRIGSRUMMET`, 'amber');
      } else if (t === 'claim') {
        const player = state.players.find((p) => p.id === peerId);
        const id = String(d?.country || '');
        const c = globe.getCountry(id);
        if (!player || !c) return;
        if (playerOwning(id) || state.hostWorld.aiOwned[id]) {
          net.sendTo(peerId, 'deny', { reason: 'taken' });
          return;
        }
        player.home = id;
        player.claims = [id];
        broadcastState();
        applyState();
        tvHighlight(c, player);
      } else if (t === 'nation') {
        // periodisk nationssummering från spelarens mobil
        const player = state.players.find((p) => p.id === peerId);
        if (!player) return;
        player.ideoIcon = d?.ideo || '';
        player.factionIcon = d?.faction || '';
        player.units = Array.isArray(d?.units) ? d.units.slice(0, 40) : [];
        renderRoster();
      } else if (t === 'conquer') {
        // spelaren vann mot ett AI-land — verkställ kraven i världen
        const player = state.players.find((p) => p.id === peerId);
        const id = String(d?.country || '');
        const c = globe.getCountry(id);
        if (!player || !c || playerOwning(id)) return;
        const conq = state.hostWorld.aiOwned[id];
        delete state.hostWorld.aiOwned[id];
        if (conq) {
          const emp = state.hostWorld.aiEmpires[conq];
          if (emp) emp.owned = emp.owned.filter((x) => x !== id);
        }
        if (d?.liberate) {
          for (const [cid, cq] of Object.entries({ ...state.hostWorld.aiOwned })) {
            if (cq === id) delete state.hostWorld.aiOwned[cid];
          }
          const emp = state.hostWorld.aiEmpires[id];
          if (emp) emp.owned = [];
        }
        if (!player.claims.includes(id)) player.claims.push(id);
        if (d?.puppet) player.puppets.push(id);
        broadcastState();
        applyState();
        toast(`${player.name.toUpperCase()} HAR ${d?.puppet ? 'UNDERKUVAT' : 'ERÖVRAT'} ${c.name.toUpperCase()}!`, 'amber', 6000);
        tvHighlight(c, player);
      } else if (t === 'battle') {
        // spelaren gick in i/ur strid → kör kön
        const player = state.players.find((p) => p.id === peerId);
        if (!player) return;
        player.busy = !!d?.busy;
        player.busyAt = d?.target || '';
        rebuildActiveBattles();
        if (!player.busy) processBattleQueue();
        broadcastState();
      } else if (t === 'pvp') {
        // anfall mot en annan spelares land — köa om försvararen strider
        const att = state.players.find((p) => p.id === peerId);
        const id = String(d?.target || '');
        const def = playerOwning(id);
        if (!att || !def || def.id === att.id) return;
        const entry = { att: att.id, def: def.id, target: id };
        if (def.busy || att.busy) {
          state.battles.queued.push(entry);
          toast(`\u{23F3} ${att.name.toUpperCase()} \u{2694} ${def.name.toUpperCase()} — KÖAD (${(globe.getCountry(id)?.name || '').toUpperCase()})`, '', 6000);
          broadcastState();
        } else {
          resolvePvp(entry);
        }
      }
    },
    netError: (type) => toast('NÄTVERKSFEL: ' + type, 'red'),
  });
}

function rebuildActiveBattles() {
  state.battles.active = state.players
    .filter((p) => p.busy)
    .map((p) => ({ name: p.name, target: p.busyAt }));
}

function processBattleQueue() {
  const ready = state.battles.queued.findIndex((e) => {
    const a = state.players.find((p) => p.id === e.att);
    const d = state.players.find((p) => p.id === e.def);
    return a && d && !a.busy && !d.busy;
  });
  if (ready < 0) return;
  const [entry] = state.battles.queued.splice(ready, 1);
  resolvePvp(entry);
}

// PvP avgörs på värden med båda arméernas sammansättning (tärningsmodellen)
function resolvePvp(entry) {
  const A = state.players.find((p) => p.id === entry.att);
  const D = state.players.find((p) => p.id === entry.def);
  const c = globe.getCountry(entry.target);
  if (!A || !D || !c) return;
  const r = autoResolve(
    (A.units || []).map((u) => ({ ...u, side: 0 })),
    (D.units || []).map((u) => ({ ...u, side: 1 })),
  );
  const attWon = r.winner === 0;
  if (attWon) {
    D.claims = D.claims.filter((x) => x !== entry.target);
    D.puppets = D.puppets.filter((x) => x !== entry.target);
    if (!A.claims.includes(entry.target)) A.claims.push(entry.target);
  }
  A.units = r.survivorsA.map(({ type, hp }) => ({ type, hp }));
  D.units = r.survivorsD.map(({ type, hp }) => ({ type, hp }));
  net.sendTo(A.id, 'pvpresult', { target: entry.target, win: attWon, survivors: A.units, foe: D.name });
  net.sendTo(D.id, 'pvpresult', { target: entry.target, win: !attWon, survivors: D.units, foe: A.name, defended: true });
  broadcastState();
  applyState();
  toast(attWon
    ? `\u{2694}\u{FE0F} ${A.name.toUpperCase()} HAR ERÖVRAT ${c.name.toUpperCase()} FRÅN ${D.name.toUpperCase()}!`
    : `\u{1F6E1}\u{FE0F} ${D.name.toUpperCase()} FÖRSVARADE ${c.name.toUpperCase()} MOT ${A.name.toUpperCase()}!`, 'amber', 7000);
  tvHighlight(c, attWon ? A : D);
}

function aiWorldSummary() {
  return {
    aiOwned: state.hostWorld.aiOwned,
    aiEmpires: Object.fromEntries(Object.entries(state.hostWorld.aiEmpires)
      .map(([k, e]) => [k, { name: e.name, color: e.color, owned: e.owned, empireId: e.empireId }])),
  };
}

function broadcastState() {
  if (state.mode !== 'tv') return;
  rebuildActiveBattles();
  net.broadcast('state', {
    players: state.players.map(({ units, ...p }) => p), // arméernas detaljer stannar hos värden
    aiWorld: aiWorldSummary(),
    battles: state.battles,
  });
  renderBattleFeed(state.battles);
}

function tvHighlight(country, player) {
  clearTimeout(state.tvTimer);
  globe.autoRotate = false;
  const [[x0, y0], [x1, y1]] = country.bounds;
  const span = Math.max(x1 < x0 ? x1 + 360 - x0 : x1 - x0, y1 - y0, 4);
  const z = Math.min(6, Math.max(1.8, 60 / span));
  globe.select(country.id);
  globe.animateTo(country.centroid, z, 1800, () => {
    const res = resourcesOf(country.id).map((r) => RESOURCES[r].icon + ' ' + RESOURCES[r].name.toUpperCase()).join(' + ');
    toast(`${player.name.toUpperCase()} HAR VALT ${country.name.toUpperCase()}!`, 'amber', 4500);
    toast(`TILLGÅNGAR: ${res}`, '', 4500);
    state.tvTimer = setTimeout(() => {
      globe.select(null);
      globe.animateTo([country.centroid[0], 20], 1, 1400, () => { globe.autoRotate = true; });
    }, 3200);
  });
}

// ---------- spelarläge ----------
function startPlayer(name, code) {
  $('#joinerr').textContent = '';
  net.join(code, () => {
    net.send('hello', { name });
    net.code = code.toUpperCase();
  }, (why) => {
    const msgs = {
      'timeout': 'HITTADE INGET RUM — KOLLA KODEN',
      'peer-unavailable': 'HITTADE INGET RUM MED DEN KODEN',
      'connect': 'KUNDE INTE ANSLUTA',
      'network': 'NÄTVERKSFEL — KOLLA INTERNET',
      'server-error': 'SERVERFEL — FÖRSÖK IGEN',
    };
    $('#joinerr').textContent = msgs[why] || 'ANSLUTNING MISSLYCKADES';
  });

  net.on({
    msg: (_from, t, d) => {
      if (t === 'welcome') {
        state.mode = 'player';
        state.me = d.you;
        state.players = d.players;
        overlay('#join', false);
        overlay('#menu', false);
        startWorldLoad();
        applyState();
        toast('ANSLUTEN! VÄLJ DITT HEMLAND PÅ GLOBEN', 'amber', 5000);
      } else if (t === 'state') {
        state.players = d.players;
        state.aiWorldRemote = d.aiWorld || null;
        const me = state.players.find((p) => p.id === net.myId);
        if (me) state.me = me;
        // första gången mitt hemland bekräftas: starta nationssystemet på mobilen
        if (me?.home && !state.solo) {
          state.solo = {
            claims: {}, home: me.home, army: null, prevAt: null,
            wars: {}, reparations: [], aiOwned: {}, aiEmpires: {}, permMods: {},
          };
          initNation(me.home);
          spawnArmy(me.home);
          openFactionPick();
          startNationSync();
        }
        // spegla mina länder från värden så solo-vägarna funkar (bygge, riken, fakta)
        if (state.solo && me) {
          state.solo.claims = {};
          for (const cid of (me.claims || [])) {
            state.solo.claims[cid] = { color: me.color, playerName: 'DU', puppet: me.puppets?.includes(cid) };
          }
        }
        if (d.battles) renderBattleFeed(d.battles);
        applyState();
      } else if (t === 'pvpresult') {
        const s = state.solo;
        const c = globe.getCountry(d.target);
        if (s?.army) {
          s.army.units = (d.survivors || []).map((u) => ({ ...u }));
          updateArmyMarker();
        }
        if (s) delete s.wars[d.target];
        if (d.defended) {
          toast(d.win
            ? `\u{1F6E1}\u{FE0F} DU FÖRSVARADE ${c?.name.toUpperCase()} MOT ${d.foe.toUpperCase()}!`
            : `\u{1F4A5} ${d.foe.toUpperCase()} TOG ${c?.name.toUpperCase()} FRÅN DIG!`, d.win ? 'amber' : 'red', 7000);
        } else {
          toast(d.win
            ? `\u{2694}\u{FE0F} SEGER! ${c?.name.toUpperCase()} ÄR DITT`
            : `NEDERLAG MOT ${d.foe.toUpperCase()}...`, d.win ? 'amber' : 'red', 7000);
        }
        refreshInfoPanel();
      } else if (t === 'deny') {
        toast('LANDET ÄR REDAN TAGET!', 'red');
      }
    },
    hostLost: () => toast('TAPPADE KONTAKTEN MED TV:N', 'red', 8000),
  });
}

// skicka nationssummering till TV:n (ideologi, faktion, armé) med jämna mellanrum
function startNationSync() {
  const send = () => {
    const s = state.solo;
    if (state.mode !== 'player' || !s?.nation) return;
    net.send('nation', {
      ideo: IDEOLOGIES[s.nation.ideology]?.icon || '',
      faction: FACTIONS[s.faction]?.icon || '',
      units: (s.army?.units || []).map(({ type, hp }) => ({ type, hp })),
    });
  };
  send();
  setInterval(send, 5000);
}

function renderBattleFeed(battles) {
  const feed = $('#battlefeed');
  const list = $('#battlefeedlist');
  const rows = [];
  for (const a of battles?.active || []) {
    rows.push(`<div style="font-size:7px;color:var(--amber);margin:3px 0">\u{2694} ${a.name.toUpperCase()}${a.target ? ': ' + a.target.toUpperCase() : ''} — PÅGÅR</div>`);
  }
  for (const q of battles?.queued || []) {
    const an = state.players.find((p) => p.id === q.att)?.name || '?';
    const dn = state.players.find((p) => p.id === q.def)?.name || '?';
    rows.push(`<div style="font-size:7px;color:var(--holo-dim);margin:3px 0">\u{23F3} ${an.toUpperCase()} \u{2694} ${dn.toUpperCase()} — KÖAD</div>`);
  }
  list.innerHTML = rows.join('');
  show(feed, rows.length > 0);
}

// ---------- erövringsläge (solo-prototyp) ----------
function startSolo() {
  state.mode = 'solo';
  state.solo = {
    claims: {}, home: null, army: null, prevAt: null,
    wars: {},          // targetId -> {cb, status: 'justifying'|'ready', days}
    reparations: [],   // {from, daily, days}
    aiOwned: {},       // countryId -> erövrar-landets id
    aiEmpires: {},     // conquerorId -> {name, color, owned: [], empireId}
    permMods: {},      // permanenta effekter (riken/förbund)
    buildQueue: [],    // {type, name, left, total}
    researchQueue: [], // {branch, tier, name, left, total}
    garrisons: {},     // countryId -> byggda enheter som väntar där
    cityB: {},         // "cid:cityIdx" -> [byggnadsId] — byggnader per stad
    trade: [],         // {res, cid, upkeep} — aktiva handelsavtal
    countryArmies: {}, // stående arméer per land
    aiWars: [], moving: [], aiGoals: {}, votes: [],
  };
  overlay('#menu', false);
  startWorldLoad();
  renderTopbar();
  toast('VÄLJ DITT HEMLAND — KLICKA PÅ ETT LAND', 'amber', 6000);
}

// ---------- meny + start ----------
wireToggles();
renderLegend();

$('#btnTV').addEventListener('click', startTV);
$('#btnSolo').addEventListener('click', startSolo);
$('#btnJoin').addEventListener('click', () => {
  overlay('#menu', false);
  overlay('#join', true);
  $('#joinname').focus();
});
$('#btnJoinBack').addEventListener('click', () => {
  overlay('#join', false);
  overlay('#menu', true);
});
$('#btnJoinGo').addEventListener('click', () => {
  const name = $('#joinname').value.trim();
  const code = $('#joincode').value.trim().toUpperCase();
  if (!name) { $('#joinerr').textContent = 'SKRIV DITT NAMN'; return; }
  if (code.length !== 4) { $('#joinerr').textContent = 'KODEN ÄR 4 TECKEN'; return; }
  $('#joinerr').textContent = 'ANSLUTER…';
  startPlayer(name, code);
});
[$('#joinname'), $('#joincode')].forEach((el) => el.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('#btnJoinGo').click();
}));

const roomParam = new URLSearchParams(location.search).get('room');
if (roomParam && roomParam.length === 4) {
  overlay('#menu', false);
  overlay('#join', true);
  $('#joincode').value = roomParam.toUpperCase();
  setTimeout(() => $('#joinname').focus(), 50);
}
