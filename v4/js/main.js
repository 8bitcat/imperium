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
import { countryIncomeOf, armySizeOf, econOf, WEALTH_TIER } from './economy.js';
import { CASUS_BELLI, justifyDays, seizeAmount, FEDERATION_FORMS, HISTORICAL_EMPIRES, DYNAMIC_GOALS, formableEmpires, empireProgress } from './war.js';
import { FACTIONS } from './factions.js';
import { applyFaction } from './units.js';
import { pickLeader, leaderDesc } from './leaders.js';
import { RELIGIONS, religionOf, startPercent, PHASES, phaseOf, phaseIndex, pushCost, dailyRate } from './integration.js';
import { STANCES, stanceOf, setStance } from './stance.js';

const $ = (s) => document.querySelector(s);
const PLAYER_COLORS = ['#ff4f4f', '#4fa8ff', '#ffd24f', '#b06bff', '#ff9f3e', '#3ee6c8', '#ff6fd8', '#a4e34a'];
const SOLO_COLOR = '#ff4f4f';

const net = new Net();
// Version: höj vid varje release så alla ser vilken version de spelar
export const VERSION = '4.13.0';
export const VERSION_DATE = '2026-08-10';
export const VERSION_NAME = 'HÅLLNINGAR & LEVANDE VÄRLD';

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
state.debug = {
  aiTick: () => aiWorldTick(), arrivals: () => checkArrivals(), worldCtx: () => worldCtx(),
  updateMarkers: () => updateMovingMarkers(), updateCountryArmies: () => updateCountryArmyMarkers(),
  startInteg: (cid) => startIntegration(cid), tickDay: () => tickDay(), applyState: () => applyState(),
  aiCanReach: (w, a, t) => aiCanReach(w, a, t), aiDistanceTo: (w, a, t) => aiDistanceTo(w, a, t),
  aiReach: (w, c) => aiReach(w, c), warAlert: (a, t, w) => warAlert(a, t, w), saveGame: () => saveGame(), loadGame: () => loadGame(),
};

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
  // allt av betydelse hamnar också i världshistoriken (☰ uppe i hörnet)
  if (ms >= 4000) logEvent(msg, { war: cls === 'red', mine: isAboutMe(msg) });
}

// rör händelsen mitt eget rike? (styr historikens MITT RIKE-filter)
function isAboutMe(msg) {
  const s = state.solo;
  if (/\bDU\b|\bDITT\b|\bDINA\b|\bDIN\b|\bDIG\b/.test(msg)) return true;
  if (!s?.claims) return false;
  const up = msg.toUpperCase();
  for (const cid of Object.keys(s.claims)) {
    const n = globe.getCountry(cid)?.name;
    if (n && up.includes(n.toUpperCase())) return true;
  }
  return false;
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
    // har spelaren utropat ett rike visas rikets namn i stället för hemlandet
    const label = p.formation?.name
      ? `${p.formation.icon || ''} ${p.formation.name}`
      : (globe.getCountry(p.home)?.name || '?');
    home.textContent = p.home
      ? `— ${label} ${p.factionIcon || ''}${p.ideoIcon || IDEOLOGIES[countryIdeology(p.home).ideology].icon}${nClaims > 1 ? ` \u{1F30D}${nClaims}` : ''}${p.busy ? ' \u{2694}' : ''}`
      : '— väljer land…';
    row.append(chip, name, home);
    list.appendChild(row);
  }
  show($('#roster'), state.players.length > 0 && $('#roster').dataset.closed !== '1');
}

function renderTopbar() {
  $('#topleft').textContent = `IMPERIUM V${VERSION} // GEOSCAPE`;
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
  updateLabelOverrides();
  renderRoster();
  renderTopbar();
  refreshInfoPanel();
}

// Erövrade länder bär erövrarens namn på globen. Under integrationen visas
// hur långt den kommit, så man ser vilka provinser som fortfarande är oroliga.
function updateLabelOverrides() {
  const s = state.solo;
  const map = {};
  if (s?.home) {
    const homeName = globe.getCountry(s.home)?.name || '';
    for (const cid of Object.keys(s.claims || {})) {
      if (cid === s.home) continue;
      if (s.claims[cid].puppet) continue;      // lydstater behåller sitt namn
      const it = integOf(cid);
      map[cid] = !it || it.pct >= 100 ? homeName : `${homeName} ${Math.floor(Math.max(0, it.pct))}%`;
    }
  }
  // AI-imperier: kärnlandets namn på allt de äger
  const world = state.mode === 'tv' ? state.hostWorld : (s || state.aiWorldRemote);
  for (const [cid, conq] of Object.entries(world?.aiOwned || {})) {
    const emp = world.aiEmpires?.[conq];
    map[cid] = emp?.name || globe.getCountry(conq)?.name || '';
  }
  globe.setLabelOverride(map);
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

  // ideologi + doktrin + ledare på egna rader (för ALLA länder).
  // Egna länder speglar DIN nation direkt — även i multiplayer — och andra
  // spelares länder speglar deras senast synkade ideologi.
  const mine = state.solo?.claims[c.id] && (state.mode === 'solo' || state.mode === 'player');
  const ownerPlayer = state.mode !== 'solo' ? playerOwning(c.id) : null;
  let ideoObj, docName = '', leaderLine = '';
  if (mine && state.solo?.nation) {
    ideoObj = IDEOLOGIES[state.solo.nation.ideology];
    docName = state.solo.nation.doctrine && ideoObj?.doctrines?.[state.solo.nation.doctrine]?.name || '';
    if (state.solo.leader) leaderLine = `${state.solo.leader.n.toUpperCase()} — ${leaderDesc(state.solo.leader)}`;
  } else if (ownerPlayer?.ideoKey && IDEOLOGIES[ownerPlayer.ideoKey]) {
    ideoObj = IDEOLOGIES[ownerPlayer.ideoKey];
    docName = ownerPlayer.docKey && ideoObj?.doctrines?.[ownerPlayer.docKey]?.name || '';
    if (ownerPlayer.leader) leaderLine = `${ownerPlayer.leader.toUpperCase()}${ownerPlayer.leaderDesc ? ' — ' + ownerPlayer.leaderDesc : ''}`;
  } else {
    const wi = state.world?.[c.id] || countryIdeology(c.id);
    ideoObj = IDEOLOGIES[wi.ideology];
    docName = wi.doctrine && ideoObj?.doctrines?.[wi.doctrine]?.name || '';
    const wl = worldCtx().world?.leaders?.[c.id];
    if (wl) leaderLine = `${wl.n.toUpperCase()} — ${leaderDesc(wl)}`;
  }
  $('#fideo').innerHTML = ideoObj
    ? `<b>IDEOLOGI:</b> ${ideoObj.icon} ${ideoObj.name.toUpperCase()}`
    : '';
  $('#fdoc').innerHTML = docName ? `<b>DOKTRIN:</b> ${docName.toUpperCase()}` : '';
  // tillfällig ledare sitter till nästa val
  $('#fleader').innerHTML = leaderLine
    ? `<b>\u{1F3A9} LEDARE:</b> <span style="color:var(--amber)">${leaderLine}</span>`
    : '';
  const BIOME_ICON = { GRAS: '\u{1F33E}', SNO: '\u{2744}\u{FE0F}', OKEN: '\u{1F3DC}\u{FE0F}', DJUNGEL: '\u{1F334}' };
  const bio = biomeFor(c);
  $('#ftype').innerHTML = `<b>LANDSTYP:</b> ${BIOME_ICON[bio]} ${BIOMES[bio].name}`;
  const rel = religionFor(c.id);
  const stKey = stanceOf(worldCtx().world || {}, c.id);
  const st = STANCES[stKey] || STANCES.neutral;
  $('#freli').innerHTML = `<b>RELIGION:</b> ${RELIGIONS[rel]?.icon || ''} ${RELIGIONS[rel]?.name.toUpperCase() || '?'}`
    + `<br><b>HÅLLNING:</b> <span style="color:${st.color}">${st.icon} ${st.name}</span>`
    + `<br><span style="font-size:6px;color:var(--holo-dim)">${st.desc}</span>`;
  const inc = countryIncomeOf(fact.p, c.id);
  const mineInc = state.solo?.claims[c.id];
  const itg = integOf(c.id);
  const factor = itg ? phaseOf(itg.pct).income : 1;
  $('#finc').innerHTML = `<b>INKOMST:</b> ${mineInc ? '' : '+'}${Math.round(inc * (mineInc ? factor : 1))} \u{1F4B0}/DAG`
    + (mineInc ? (factor < 1 ? ` <span style="color:var(--red)">(AV ${inc} — EJ INTEGRERAT)</span>` : '')
      : ' <span style="color:var(--holo-dim)">VID ERÖVRING</span>');

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
  $('#finteg').innerHTML = '';
  show($('#finteg'), false);

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
      // pågående uppror i egen provins — slå ner det
      if (integOf(c.id)?.revolt) {
        $('#istatus').textContent = `\u{1F525} UPPROR — ${countryArmy(c.id).units.length} REBELLER`;
        $('#istatus').style.color = 'var(--red)';
        if (s.army?.units.length && !state.battle) {
          attackBtn.innerHTML = '\u{1F525} SLÅ NER UPPRORET';
          show(attackBtn, true);
        }
      } else {
        attackBtn.innerHTML = '\u{2694} ANFALL MED ARMÉN';
      }
      renderFactIntegration(c);
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
    // utropade riken syns för alla — även på TV:n och andra spelares skärmar
    const owner = playerOwning(c.id);
    const form = owner?.formation;
    $('#istatus').innerHTML = (mine ? 'DITT HEMLAND' : `TAGET AV ${claim.playerName.toUpperCase()}`)
      + (form ? `<br><span style="color:var(--amber)">${form.icon || ''} ${form.name.toUpperCase()}</span>` : '');
    $('#istatus').style.color = claim.color;
  } else {
    $('#istatus').textContent = 'FRITT TERRITORIUM';
    $('#istatus').style.color = '';
    claimBtn.textContent = 'GÖR TILL HEMLAND';
    show(claimBtn, state.mode === 'player');
  }
  show(panel, true);
}

// Integrationspanelen: mätare, faser och möjligheten att köpa på integrationen
function renderFactIntegration(c) {
  const s = state.solo;
  const el = $('#finteg');
  const it = integOf(c.id);
  el.innerHTML = '';
  if (!it || !s?.nation) { show(el, false); return; }
  const pct = it.pct;
  const idx = phaseIndex(pct);
  const ph = PHASES[idx];
  const tier = s.nation.research?.integration || 0;
  const cost = pushCost(state.facts[c.id]?.p, pct, tier);
  const myRel = religionFor(s.home), theirRel = religionFor(c.id);
  const theirIdeo = (state.world?.[c.id] || countryIdeology(c.id)).ideology;

  const head = document.createElement('div');
  head.className = 'ihead';
  head.innerHTML = pct >= 100
    ? `\u{2705} FULLT INTEGRERAT — 100%`
    : `\u{1F91D} INTEGRATION ${Math.floor(pct)}% \u{2022} FAS ${idx + 1} AV 3: ${ph.name}`;
  el.appendChild(head);

  const bar = document.createElement('div');
  bar.className = 'ibar';
  const fill = document.createElement('div');
  if (pct < 0) { fill.className = 'ineg'; fill.style.width = `${Math.min(100, -pct)}%`; }
  else { fill.className = 'ifill'; fill.style.width = `${pct}%`; }
  bar.appendChild(fill);
  el.appendChild(bar);

  const phs = document.createElement('div');
  phs.className = 'iphases';
  PHASES.slice(0, 3).forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'iph' + (i < idx ? ' done' : i === idx ? ' cur' : '');
    d.innerHTML = `FAS ${i + 1}<br>${p.name}<br>${p.at}%`;
    phs.appendChild(d);
  });
  el.appendChild(phs);

  const sub = document.createElement('div');
  sub.className = 'isub';
  const adj = isAdjacentToRealm(c.id);
  const bonuses = [];
  if (forcesIn(c.id)) bonuses.push('\u{2694} TRUPP +0.4%/DAG');
  if (hasOfficeIn(c.id)) bonuses.push('\u{1F3DB}\u{FE0F} KONTOR +0.5%/DAG');
  if (tier) bonuses.push(`\u{1F52C} FORSKNING +${(0.15 * tier).toFixed(2)}%/DAG`);
  sub.innerHTML = `${ph.desc}<br>`
    + `IDEOLOGI: ${IDEOLOGIES[theirIdeo]?.name.toUpperCase() || '?'} MOT DIN ${IDEOLOGIES[s.nation.ideology]?.name.toUpperCase() || '?'}<br>`
    + `RELIGION: ${RELIGIONS[theirRel]?.icon || ''} ${RELIGIONS[theirRel]?.name.toUpperCase() || '?'} MOT DIN ${RELIGIONS[myRel]?.icon || ''} ${RELIGIONS[myRel]?.name.toUpperCase() || '?'}<br>`
    + (adj ? '' : `<span style="color:var(--red)">\u{2757} INGEN LANDGRÄNS TILL DITT RIKE — STÖRSTA HINDRET (TAKTEN \u{2212}60%)</span><br>`)
    + (bonuses.length ? bonuses.join(' \u{2022} ') : 'INGA BONUSAR — BYGG \u{1F3DB}\u{FE0F} INTEGRATIONSKONTOR ELLER SKICKA TRUPP')
    + (ph.unrest >= 30 ? `<br><span style="color:var(--red)">\u{26A0}\u{FE0F} OROLIGT — ${it.unrestDays}/${forcesIn(c.id) ? 26 : 14} DAGAR TILL UPPROR</span>` : '');
  el.appendChild(sub);

  if (pct >= 100) { show(el, true); return; }
  const btn = document.createElement('button');
  btn.className = 'btn amber';
  btn.style.marginTop = '5px';
  btn.innerHTML = `\u{1F91D} INTEGRERA SNABBARE (+${cost.gain}%)<br>${cost.money} \u{1F4B0} + ${cost.pp} \u{2696}\u{FE0F}`;
  const blocked = s.res.money < cost.money ? 'FÖR LITE PENGAR'
    : s.res.pp < cost.pp ? 'FÖR LITE POLITICAL POWER' : null;
  if (blocked) { btn.disabled = true; btn.title = blocked; }
  btn.addEventListener('click', () => {
    if (blocked) { warn(blocked); return; }
    if (s.res.money < cost.money || s.res.pp < cost.pp) { warn('RESURSERNA RÄCKER INTE LÄNGRE'); refreshInfoPanel(); return; }
    s.res.money -= cost.money;
    s.res.pp -= cost.pp;
    it.pct = Math.min(100, it.pct + cost.gain);
    it.unrestDays = Math.max(0, it.unrestDays - 3);
    renderResbar();
    if (it.pct >= 100) toast(`\u{1F389} ${c.name.toUpperCase()} ÄR FULLT INTEGRERAT!`, 'amber', 8000);
    else toast(`\u{1F91D} INTEGRATIONEN AV ${c.name.toUpperCase()} DRIVS PÅ — ${Math.floor(it.pct)}%`, 'amber', 5000);
    applyState();
    refreshInfoPanel();
  });
  el.appendChild(btn);
  show(el, true);
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

// ---------- VÄRLDSHISTORIK: allt som händer loggas och går att bläddra i ----------
function logEvent(text, opts = {}) {
  state.history ||= [];
  const clean = String(text).replace(/<[^>]*>/g, '');
  // samma händelse loggas inte två gånger (toast + explicit anrop)
  if (state.history[0]?.text === clean) {
    if (opts.mine) state.history[0].mine = true;
    if (opts.war) state.history[0].war = true;
    return;
  }
  state.history.unshift({
    day: state.solo?.clock?.day || state.hostDay || 0,
    text: clean,
    mine: !!opts.mine,
    war: !!opts.war,
  });
  if (state.history.length > 300) state.history.length = 300;
  if ($('#histpanel').classList.contains('show')) renderHistory();
}

let histFilter = 'all';
function renderHistory() {
  const list = $('#histlist');
  const rows = (state.history || []).filter((h) =>
    histFilter === 'all' || (histFilter === 'mine' && h.mine) || (histFilter === 'war' && h.war));
  list.innerHTML = rows.length
    ? rows.map((h) => `<div class="hrow${h.mine ? ' mine' : ''}${h.war ? ' war' : ''}"><span class="hday">DAG ${h.day}</span> — ${h.text}</div>`).join('')
    : '<div class="hrow" style="color:var(--holo-dim)">INGET HAR HÄNT ÄN</div>';
}

$('#histbtn').addEventListener('click', () => {
  const el = $('#histpanel');
  const open = !el.classList.contains('show');
  el.classList.toggle('show', open);
  if (open) renderHistory();
});
$('#histclose').addEventListener('click', () => $('#histpanel').classList.remove('show'));
document.querySelectorAll('.htab').forEach((b) => b.addEventListener('click', () => {
  histFilter = b.dataset.h;
  document.querySelectorAll('.htab').forEach((x) => x.classList.toggle('on', x === b));
  renderHistory();
}));

// ---------- KRIGSVARNING: omöjlig att missa när någon går mot DIG ----------
function warAlert(attId, targetId, why) {
  const s = state.solo;
  const a2 = (cid) => state.facts[cid]?.a2;
  const flag = (cid) => (a2(cid) ? `<img src="https://flagcdn.com/w40/${a2(cid).toLowerCase()}.png" alt="">` : '');
  $('#watitle').textContent = 'KRIGSFÖRKLARING MOT DIG';
  $('#wavs').innerHTML = `${flag(attId)} ${cname(attId)} <span style="color:var(--red)">VS</span> ${cname(targetId)} ${flag(targetId)}`;
  $('#watext').innerHTML = `${why || 'RÄTTFÄRDIGAR KRIG MOT DITT RIKE'}<br>FÖRBERED FÖRSVARET — BYGG TRUPP OCH BEVAKA DERAS ARMÉER`;
  $('#waralert').classList.add('show');
  logEvent(`\u{2694} ${cname(attId)} RÄTTFÄRDIGAR KRIG MOT ${cname(targetId)}`, { mine: true, war: true });
  if (s?.clock) s.clock.paused = true; // pausa så man hinner reagera
}
$('#waok').addEventListener('click', () => {
  $('#waralert').classList.remove('show');
  const s = state.solo;
  if (s?.clock) { s.clock.paused = false; renderResbar(); }
});

// ---------- INTEGRATION av erövrade länder ----------
// Ett nytt land är oroligt, kostar pengar och ger inget förrän det integrerats.
function religionFor(cid) {
  return religionOf(cid, globe.getCountry(cid)?.centroid);
}

// gränsar landet till resten av riket? (en exklav är mycket svårare att hålla)
function isAdjacentToRealm(cid) {
  const s = state.solo;
  if (!s) return true;
  const mine = Object.keys(s.claims || {}).filter((x) => x !== cid);
  if (!mine.length) return true;
  return globe.bordersAny(cid, mine);
}

function startIntegration(cid) {
  const s = state.solo;
  if (!s || !cid || cid === s.home) return;
  s.integ ||= {};
  if (s.integ[cid]) return;
  const theirIdeo = (state.world?.[cid] || countryIdeology(cid)).ideology;
  const adj = isAdjacentToRealm(cid);
  const pct = startPercent(s.nation?.ideology, theirIdeo, religionFor(s.home), religionFor(cid), adj);
  if (!adj) toast(`\u{2757} ${cname(cid)} SAKNAR LANDGRÄNS TILL DITT RIKE — INTEGRATIONEN BLIR MYCKET SVÅR`, 'red', 9000);
  s.integ[cid] = { pct, unrestDays: 0 };
  const p = phaseOf(pct);
  toast(`\u{1F6A9} ${cname(cid)} ÄR ERÖVRAT — ${p.name}: ${p.desc} (INTEGRATION ${Math.floor(pct)}%)`, 'red', 9000);
}

function integOf(cid) { return state.solo?.integ?.[cid] || null; }

// har jag trupp i landet? (armén på plats eller en garnison)
function forcesIn(cid) {
  const s = state.solo;
  if (!s) return false;
  if (s.army?.units.length && s.army.at === cid && !s.armyMoving) return true;
  return (s.garrisons?.[cid] || []).length > 0;
}

function hasOfficeIn(cid) { return cityBuildingsIn(cid).includes('integration'); }

// daglig integration + oro + risk för uppror
function tickIntegration() {
  const s = state.solo;
  if (!s?.integ) return;
  const tier = s.nation?.research?.integration || 0;
  for (const [cid, it] of Object.entries(s.integ)) {
    if (!s.claims[cid]) { delete s.integ[cid]; continue; }
    if (it.pct >= 100) continue;
    const theirIdeo = (state.world?.[cid] || countryIdeology(cid)).ideology;
    it.pct = Math.min(100, it.pct + dailyRate({
      researchTier: tier,
      office: hasOfficeIn(cid),
      armyHere: forcesIn(cid),
      sameIdeo: theirIdeo === s.nation?.ideology,
      adjacent: isAdjacentToRealm(cid),
    }));
    if (it.pct >= 100) {
      toast(`\u{1F389} ${cname(cid)} ÄR FULLT INTEGRERAT — FULL INKOMST`, 'amber', 9000);
      applyState();
      continue;
    }
    // djupt ockuperad provins: bryter sig ur om oron får pyra för länge
    if (it.pct < 20) {
      it.unrestDays++;
      const calm = forcesIn(cid) ? 45 : 25;   // trupp på plats håller ordning längre
      if (it.unrestDays >= Math.floor(calm * 0.6) && !it.warned) {
        it.warned = true;
        toast(`\u{26A0}\u{FE0F} ORON VÄXER I ${cname(cid)} — INTEGRERA ELLER SKICKA TRUPP!`, 'red', 9000);
        logEvent(`\u{26A0}\u{FE0F} ORO I ${cname(cid)} — UPPROR HOTAR`, { mine: true });
      }
      if (it.unrestDays >= calm) revolt(cid);
    } else {
      it.unrestDays = Math.max(0, it.unrestDays - 1);
      if (it.unrestDays === 0) it.warned = false;
    }
  }
}

// upproret: har du trupp i landet måste du slå upprorsarmén, annars är landet förlorat
function revolt(cid) {
  const s = state.solo;
  const c = globe.getCountry(cid);
  if (!c) return;
  const n = Math.max(3, armySizeOf(state.facts[cid]?.p, cid) - 2);
  const rebels = Array.from({ length: n }, (_, i) => mkUnit(i % 3 === 2 ? 'TANK' : 'INF', 1));
  countryArmy(cid).units = rebels;
  if (forcesIn(cid)) {
    // trupp på plats → provinsen är i öppet uppror tills du slagit ner det.
    // Integrationen står stilla och landet ger fortsatt ingenting.
    const it = s.integ[cid];
    if (it) { it.pct = Math.min(it.pct, 5); it.unrestDays = 0; it.warned = false; it.revolt = true; }
    toast(`\u{1F525} UPPROR I ${c.name.toUpperCase()}! SLÅ NER DET — TRYCK PÅ LANDET OCH ANFALL`, 'red', 12000);
    logEvent(`\u{1F525} UPPROR I ${cname(cid)} — DINA TRUPPER MÅSTE SLÅ NER DET`, { mine: true, war: true });
  } else {
    delete s.claims[cid];
    delete s.integ[cid];
    delete s.wars[cid];
    for (const k of Object.keys(s.cityB || {})) if (k.startsWith(cid + ':')) delete s.cityB[k];
    if (s.garrisons) delete s.garrisons[cid];
    s.trade = (s.trade || []).filter((d) => d.cid !== cid);
    toast(`\u{1F4A5} ${c.name.toUpperCase()} HAR BRUTIT SIG UR DITT RIKE — INGEN TRUPP FANNS PÅ PLATS`, 'red', 12000);
    logEvent(`\u{1F4A5} ${cname(cid)} BRÖT SIG UR DITT RIKE`, { mine: true, war: true });
    applyState();
  }
  refreshInfoPanel();
}

// slå ner ett pågående uppror i en egen provins
function crushRevolt(cid) {
  const s = state.solo;
  const c = globe.getCountry(cid);
  if (!c || !s?.army?.units.length || state.battle) return;
  state.pendingTarget = c;
  s.prevAt = s.army.at;
  s.revoltTarget = cid;
  startBattle('A');
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
  // varje ägt land bidrar efter sin ekonomiska tyngd — MEN erövrade länder ger
  // inget förrän de integrerats: i ockupationsfasen kostar de i stället.
  let occUnrest = 0;
  for (const cid of Object.keys(s.claims)) {
    const base = countryIncomeOf(state.facts[cid]?.p, cid);
    const it = integOf(cid);
    if (!it) { s.res.money += base; continue; }
    const ph = phaseOf(it.pct);
    s.res.money += Math.round(base * ph.income);
    if (ph.pp < 0) s.res.pp += Math.round(2 * ph.pp);   // ockupation kostar pol. makt
    occUnrest += ph.unrest * 0.25;                      // oron RÄKNAS OM varje dag
  }
  tickIntegration();
  // integrationskontorens upkeep
  const offices = allBuildings().filter((b) => BUILDINGS[b]?.upkeep).length;
  s.res.money -= offices * 6;
  // ockupationsoron sätts (inte ackumuleras) och saldon får aldrig gå under noll
  if (occUnrest > 0) s.occUnrest = Math.min(45, occUnrest); else delete s.occUnrest;
  s.res.money = Math.max(0, s.res.money);
  s.res.pp = Math.max(0, s.res.pp);
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
  if (!rows.length) { el.style.display = 'none'; state.bcHidden = false; return; }
  // stängd av spelaren? håll den stängd tills något NYTT läggs i kön
  if (rows.length > (state.bcRows || 0)) state.bcHidden = false;
  state.bcRows = rows.length;
  if (state.bcHidden) { el.style.display = 'none'; return; }
  const scroll = el.scrollTop; // panelen byggs om varje speldag — behåll skrollningen
  el.innerHTML = `<div class="ptitle">&#9654; PÅGÅR <button class="pclose" id="bcclose">&#10005;</button></div>${rows.join('')}`;
  $('#bcclose').addEventListener('click', () => { state.bcHidden = true; el.style.display = 'none'; });
  el.style.display = 'block';
  el.scrollTop = scroll;
}

// AI-världen lever: lagbyten, historiska riken som återuppstår, granninvasioner
const AI_COLORS = ['#7f5fa0', '#5f8fa0', '#a08f5f', '#5fa06f', '#a05f6f', '#8f6f4f'];

// AI-imperier får ALDRIG en färg som liknar en spelares (eller ett annat imperiums) —
// annars går det inte att se vems länder som är vems på globen
const AI_FALLBACK_COLORS = ['#7f5fa0', '#5f8fa0', '#a08f5f', '#5fa06f', '#8f6f4f', '#4f7f7f', '#6f5f8f', '#7f7f4f', '#5f6f8f', '#8f7f9f'];
function colorDist(a, b) {
  if (!a || !b || a[0] !== '#' || b[0] !== '#') return 999;
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
}
function distinctEmpireColor(want, world) {
  const taken = [
    ...(state.mode === 'solo' ? [SOLO_COLOR] : state.players.map((p) => p.color)),
    ...Object.values(world.aiEmpires || {}).map((e) => e.color),
  ].filter(Boolean);
  const ok = (c) => taken.every((t) => colorDist(c, t) > 110);
  if (ok(want)) return want;
  for (const c of AI_FALLBACK_COLORS) if (ok(c)) return c;
  return AI_FALLBACK_COLORS[Math.floor(Math.random() * AI_FALLBACK_COLORS.length)];
}

// Världskontext: solo kör AI-världen lokalt, TV:n kör den för hela rummet
function worldCtx() {
  if (state.mode === 'tv') {
    const blocked = new Set();
    for (const p of state.players) {
      for (const c of (p.claims || (p.home ? [p.home] : []))) blocked.add(c);
    }
    return { world: state.hostWorld, blocked };
  }
  // state.solo saknas innan hemlandet valts (och efter eliminering) — då finns ingen värld
  const s = state.solo;
  if (!s) return { world: state.aiWorldRemote || { aiOwned: {}, aiEmpires: {}, moving: [], aiWars: [], votes: [], leaders: {} }, blocked: new Set() };
  return { world: s, blocked: new Set([...Object.keys(s.claims || {}), s.home].filter(Boolean)) };
}

function ensureAiEmpire(world, coreId, hist) {
  let h = 7;
  for (const ch of String(coreId)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return (world.aiEmpires[coreId] ||= {
    name: globe.getCountry(coreId)?.name || '?',
    color: distinctEmpireColor(hist?.color || AI_COLORS[Math.abs(h) % AI_COLORS.length], world),
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

// AI-imperier vågar sig också på SPELARENS länder när de blivit starka nog.
// Då slår den stora krigsvarningen till så man hinner förbereda försvaret.
function maybeAttackPlayer(ctx) {
  const { world } = ctx;
  const mine = state.mode === 'tv'
    ? state.players.flatMap((p) => (p.claims || []).map((cid) => ({ cid, who: p.name })))
    : Object.keys(state.solo?.claims || {}).map((cid) => ({ cid, who: 'DU' }));
  if (!mine.length) return;
  // bara imperier med militär tyngd och något att vinna
  const cands = Object.keys(world.aiEmpires || {}).filter((cid) => (world.dev?.[cid]?.mil || 0) >= 2);
  if (!cands.length) return;
  const att = cands[Math.floor(Math.random() * cands.length)];
  if (world.aiWars.some((w) => w.att === att) || world.moving.some((m) => m.att === att)) return;
  const reachable = mine.filter((m) => aiCanReach(world, att, m.cid));
  if (!reachable.length) return;
  const tgt = reachable[Math.floor(Math.random() * reachable.length)];
  if (world.aiWars.some((w) => w.target === tgt.cid)) return;
  world.aiWars.push({ att, target: tgt.cid, ticks: 3 + Math.floor(Math.random() * 3), vsPlayer: true });
  markKnown(att, tgt.cid);
  if (state.mode !== 'tv') warAlert(att, tgt.cid, `${cname(att)} VILL LÄGGA ${cname(tgt.cid)} UNDER SIG`);
  else toast(`\u{2620}\u{FE0F} ${cname(att)} FÖRKLARAR KRIG MOT ${tgt.who.toUpperCase()} (${cname(tgt.cid)})`, 'red', 10000);
  logEvent(`\u{2620}\u{FE0F} ${cname(att)} FÖRKLARAR KRIG MOT ${cname(tgt.cid)}`, { mine: true, war: true });
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
  if (Math.random() < 0.08) maybeAttackPlayer(ctx);
  tickAiWars(ctx);
  tickDefenses(ctx);
  tickAiIntegration(ctx);
  aiMergeArmies(ctx);
  updateSpaceNations();
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
// ---------- HÅLLNING: hur landet ser på världen, och hur den smittar ----------
function shiftStance(world, cid, next, why) {
  const ch = setStance(world, cid, next);
  if (!ch) return;
  const st = STANCES[next];
  toast(`${st.icon} ${cname(cid)} BLIR ${st.name}${why ? ' — ' + why : ''}`, next === 'ultra' ? 'red' : '', 7000);
  logEvent(`${st.icon} ${cname(cid)} BLIR ${st.name}`, { war: next === 'aggressive' || next === 'ultra' });
  if (selectedCountry?.id === cid) refreshInfoPanel();
}

// Aggressiva grannar tvingar fram upprustning runt omkring
function spreadDefensive(world, cid) {
  const c = globe.getCountry(cid);
  if (!c) return;
  for (const n of nearestCountryIds(c, 4, worldCtx()) || []) {
    if (stanceOf(world, n) === 'neutral') shiftStance(world, n, 'defensive', `HOTAS AV ${cname(cid)}`);
  }
}

// Varje land har en egen dröm: militärmakt, rikedom, välfärd eller rymden.
// Doktrinen lottas en gång per land så att alla inte jagar samma sak.
const AI_DREAMS = ['mil', 'eco', 'wel', 'space'];
function aiDream(world, cid) {
  world.dream ||= {};
  if (!world.dream[cid]) {
    const ideo = (state.world?.[cid] || countryIdeology(cid)).ideology;
    const bias = MIL_IDEOLOGIES.has(ideo) ? ['mil', 'mil', 'eco', 'space']
      : ideo === 'socialdemocracy' || ideo === 'socialism' ? ['wel', 'wel', 'eco', 'space']
      : ['eco', 'wel', 'space', 'mil'];
    world.dream[cid] = bias[Math.floor(Math.random() * bias.length)];
  }
  return world.dream[cid];
}

function aiDevTick(ctx) {
  const { blocked } = ctx;
  const world = ctx.world;
  const all = globe.countries.filter((c) => !blocked.has(c.id));
  // Utvecklingen KONCENTRERAS: oftast fortsätter ett land som redan satsat.
  // Annars fastnar alla på nivå 1 och ingen når rymden eller moderna arméer.
  const started = all.filter((c) => world.dev[c.id]);
  const others = started.length >= 8 && Math.random() < 0.7 ? started : all;
  const c = others[Math.floor(Math.random() * others.length)];
  if (!c) return;
  const ideo = (state.world?.[c.id] || countryIdeology(c.id)).ideology;
  const hasGoal = !!world.aiGoals[c.id];
  const dream = aiDream(world, c.id);
  const st = STANCES[stanceOf(world, c.id)] || STANCES.neutral;
  // hållningen avgör hur ofta satsningen går till militären
  const threatened = world.aiWars.some((w) => w.target === c.id) || (world.moving || []).some((m) => m.target === c.id);
  if (threatened && stanceOf(world, c.id) === 'neutral') shiftStance(world, c.id, 'defensive', 'HOTAS AV KRIG');
  const focus = hasGoal || threatened || Math.random() < st.focusMil ? 'mil'
    : Math.random() < 0.7 ? dream
    : AI_DREAMS[Math.floor(Math.random() * AI_DREAMS.length)];
  const d = (world.dev[c.id] ||= { mil: 0, eco: 0, wel: 0, space: 0 });
  if ((d[focus] || 0) >= 4) { aiIdeologyShift(world, c.id); return; }
  d[focus] = (d[focus] || 0) + 1;
  const label = { mil: 'KRIGSINDUSTRI', eco: 'EKONOMI', wel: 'VÄLFÄRD', space: 'RYMDPROGRAM' }[focus];
  toast(`\u{1F52C} ${c.name.toUpperCase()} SATSAR PÅ ${label} — NIVÅ ${d[focus]}`, '', 5000);
  logEvent(`\u{1F52C} ${cname(c.id)} SATSAR PÅ ${label} (NIVÅ ${d[focus]})`);
  if (focus === 'mil') {
    // Hållningen avgör antal vs kvalitet: aggressiva bygger MÅNGA förband,
    // defensiva bygger färre men moderniserar dem hårt.
    const ca = countryArmy(c.id);
    const tech = d.mil + (st.tech >= 2 ? 2 : st.tech >= 1 ? 0 : -1);
    const add = Math.min(armyCap(c.id) - ca.units.length, Math.max(0, Math.round((1 + d.mil) * st.units)));
    for (let i = 0; i < add; i++) {
      ca.units.push(mkUnit(tech >= 3 && i % 3 === 0 ? 'FLYG' : tech >= 2 ? 'TANK' : (i % 2 ? 'TANK' : 'INF'), 1));
    }
    // defensiva länder moderniserar sina gamla förband varje satsning
    const upgrades = st.tech >= 2 ? 2 : tech >= 3 ? 1 : 0;
    for (let i = 0; i < upgrades; i++) {
      const old = ca.units.find((u) => u.type === 'INF') || (st.tech >= 2 ? ca.units.find((u) => u.type === 'TANK') : null);
      if (old) old.type = old.type === 'INF' ? 'TANK' : 'FLYG';
    }
  }
  // rymdprogrammet i mål → landet skjuter upp satelliter som syns på globen
  if (focus === 'space' && d.space >= 2) {
    world.spaceNations ||= [];
    if (!world.spaceNations.includes(c.id)) {
      world.spaceNations.push(c.id);
      toast(`\u{1F680} ${c.name.toUpperCase()} HAR SKJUTIT UPP SIN FÖRSTA SATELLIT!`, 'amber', 8000);
      logEvent(`\u{1F680} ${cname(c.id)} SKJUTER UPP SIN FÖRSTA SATELLIT`);
      updateSpaceNations();
    }
  }
}

// Länder byter ideologi när de kört fast — för att låsa upp nya fördelar
function aiIdeologyShift(world, cid) {
  if (Math.random() > 0.25) return;
  const wstate = (state.world ||= {});
  const wn = (wstate[cid] ||= { laws: defaultLaws(), ...countryIdeology(cid) });
  const dream = aiDream(world, cid);
  const wanted = {
    mil: ['nationalism', 'imperialism', 'fascism', 'monarchism'],
    eco: ['liberalism', 'conservatism', 'democracy'],
    wel: ['socialdemocracy', 'socialism', 'democracy'],
    space: ['democracy', 'liberalism', 'communism', 'socialdemocracy'],
  }[dream];
  const next = wanted[Math.floor(Math.random() * wanted.length)];
  if (!IDEOLOGIES[next] || next === wn.ideology) return;
  const old = IDEOLOGIES[wn.ideology]?.name || '?';
  wn.ideology = next;
  wn.doctrine = Object.keys(IDEOLOGIES[next].doctrines || {})[0] || wn.doctrine;
  toast(`\u{1F5F3}\u{FE0F} ${cname(cid)} BYTER IDEOLOGI: ${old.toUpperCase()} \u{2192} ${IDEOLOGIES[next].name.toUpperCase()}`, '', 7000);
  logEvent(`\u{1F5F3}\u{FE0F} ${cname(cid)} BYTER IDEOLOGI TILL ${IDEOLOGIES[next].name.toUpperCase()}`);
  if (selectedCountry?.id === cid) refreshInfoPanel();
}

// satellitnationernas banor ritas på globen (syns i TV-läget och för spelare
// med tillräcklig satellittäckning)
function updateSpaceNations() {
  const world = worldCtx().world;
  const list = (world?.spaceNations || []).map((cid) => ({
    cid, ll: capitalLL(cid), color: world.aiEmpires?.[cid]?.color || '#cfe8ff',
  }));
  globe.setSpaceNations(list);
}

// AI-arméer slår ihop sig när en större styrka hotar i närheten
function aiMergeArmies(ctx) {
  const { world } = ctx;
  const empires = Object.keys(world.aiEmpires || {});
  for (const core of empires) {
    const emp = world.aiEmpires[core];
    if (!emp?.owned?.length) continue;
    // hittar imperiet ett hot inom räckhåll drar det ihop trupperna till det landet
    const lands = [core, ...emp.owned];
    const threat = (world.moving || []).find((m) => lands.includes(m.target) && !m.defensive);
    if (!threat) continue;
    const dest = countryArmy(threat.target);
    if (dest.units.length >= armyCap(threat.target)) continue;
    for (const cid of lands) {
      if (cid === threat.target) continue;
      const src = countryArmy(cid);
      if (src.units.length <= 3) continue;
      const move = src.units.splice(0, Math.min(3, src.units.length - 3));
      if (!move.length) continue;
      dest.units.push(...move);
      toast(`\u{1F91D} ${emp.name.toUpperCase()} SLÅR IHOP SINA ARMÉER I ${cname(threat.target)} (${dest.units.length} ENHETER)`, 'red', 6000);
      logEvent(`\u{1F91D} ${emp.name.toUpperCase()} SAMLAR SINA ARMÉER I ${cname(threat.target)}`, { war: true });
      break;
    }
  }
}

// AI-imperiernas provinser har egna integrationsmätare — och gör uppror
function tickAiIntegration(ctx) {
  const { world } = ctx;
  world.aiInteg ||= {};
  for (const [cid, conq] of Object.entries(world.aiOwned || {})) {
    const it = (world.aiInteg[cid] ||= {
      pct: startPercent(
        (state.world?.[conq] || countryIdeology(conq)).ideology,
        (state.world?.[cid] || countryIdeology(cid)).ideology,
        religionFor(conq), religionFor(cid)),
      unrestDays: 0,
    });
    if (it.pct >= 100) continue;
    it.pct = Math.min(100, it.pct + 0.35 + 0.05 * (world.dev?.[conq]?.eco || 0));
    if (it.pct < 40) {
      it.unrestDays++;
      if (it.unrestDays > 30 + Math.floor(Math.random() * 20)) {
        // provinsen sliter sig loss ur imperiet
        delete world.aiOwned[cid];
        delete world.aiInteg[cid];
        const emp = world.aiEmpires[conq];
        if (emp) emp.owned = emp.owned.filter((x) => x !== cid);
        countryArmy(cid).units = Array.from({ length: 4 }, (_, i) => mkUnit(i === 3 ? 'TANK' : 'INF', 1));
        toast(`\u{1F525} ${cname(cid)} GÖR UPPROR OCH BRYTER SIG UR ${(emp?.name || cname(conq)).toUpperCase()}!`, 'amber', 9000);
        logEvent(`\u{1F525} ${cname(cid)} BRÖT SIG UR ${(emp?.name || cname(conq)).toUpperCase()}`, { war: true });
        worldChanged();
      }
    } else {
      it.unrestDays = 0;
    }
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
    // spionageforskningen avgör hur mycket brickan avslöjar (TV:n ser allt)
    const esp = state.mode === 'tv' ? 4 : espionageTier(state.solo?.nation);
    list.push({
      ll,
      // erövrade länders arméer byggs av imperiet → imperiets flagga, inte landets
      a2: esp >= 2 ? (state.facts[conq || cid]?.a2 || null) : null,
      color: conq ? (world.aiEmpires[conq]?.color || '#7f8c8d') : '#8a97a5',
      comp: esp >= 4 ? compOf(world.countryArmies[cid].units) : null,
      n: esp >= 3 ? n : null,
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
      logEvent(`\u{2705} ${cname(v.cid)} SIKTAR PÅ ${v.name.toUpperCase()}`, { war: true });
      // ett land som röstat för erövring blir expansivt — och grannarna rustar
      // världsherravälde/kontinental dominans = ultra, historiska riken = aggressiv
      shiftStance(world, v.cid, v.empireId ? 'aggressive' : 'ultra', v.name.toUpperCase());
      spreadDefensive(world, v.cid);
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
  // smart målval: bara mål inom logistisk räckvidd, svagaste först
  const free = goal.targets.filter((t) => countryFree(t, ctx));
  const reachable = free.filter((t) => aiCanReach(world, cid, t));
  reachable.sort((a, b) => {
    const da = aiDistanceTo(world, cid, a), db = aiDistanceTo(world, cid, b);
    return (forceValue(countryArmy(a).units) + da * 6) - (forceValue(countryArmy(b).units) + db * 6);
  });
  const next = reachable[0];
  if (!next && free.length) {
    // målen finns kvar men ligger utanför räckhåll — vänta tills riket vuxit närmare
    return;
  }
  if (!next) {
    delete world.aiGoals[cid];
    toast(`\u{1F3C1} ${cname(cid)} HAR FULLBORDAT ${goal.name.toUpperCase()}`, 'amber', 6000);
    return;
  }
  world.aiWars.push({ att: cid, target: next, ticks: 2 + Math.floor(Math.random() * 3), goal });
  logEvent(`\u{2696}\u{FE0F} ${cname(cid)} RÄTTFÄRDIGAR KRIG MOT ${cname(next)} (${goal.name.toUpperCase()})`, { war: true });
  markKnown(cid, next);
  toast(`\u{2696}\u{FE0F} ${cname(cid)} RÄTTFÄRDIGAR KRIG MOT ${cname(next)} (${goal.name.toUpperCase()})`, 'red', 7000);
}

// ---------- AI:ns fältherrekunskap ----------
const UNIT_W = { INF: 1, TANK: 1.9, FLYG: 2.5 };
function forceValue(units) {
  return (units || []).reduce((a, u) => a + (UNIT_W[u.type] || 1) * ((u.hp || 10) / 10), 0);
}

// Styrkan sätts ihop för att KONTRA försvararen: stridsvagnar mot infanteri,
// flyg mot pansar, alltid en kärna infanteri. Bara utvecklade länder har flyg.
function craftForce(budget, defUnits, cid) {
  const d = compOf(defUnits || []);
  const tier = WEALTH_TIER[cid] || 1;
  const res = resourcesOf(cid);
  const canFly = tier >= 2 || res.includes('GULD');
  const canTank = tier >= 1.3 || res.includes('JARN') || res.includes('OLJA');
  const units = [mkUnit('INF', 1), mkUnit('INF', 1)];
  let val = 2;
  const push = (t) => { units.push(mkUnit(t, 1)); val += UNIT_W[t]; };
  let guard = 0;
  while (val < budget && units.length < 16 && guard++ < 80) {
    const nAir = units.filter((u) => u.type === 'FLYG').length;
    const nTank = units.filter((u) => u.type === 'TANK').length;
    if (canFly && d.TANK > 0 && nAir < Math.ceil(d.TANK / 2)) push('FLYG');
    else if (canTank && d.INF > 0 && nTank < Math.ceil(d.INF / 2)) push('TANK');
    else if (canTank && units.length % 3 === 2) push('TANK');
    else push('INF');
  }
  return units;
}

// AI:ns logistiska räckvidd: mätt från NÄRMASTE eget territorium (kolonier och
// erövringar räknas som baser) och begränsad av landets militära utveckling.
// Storbritannien marscherar alltså inte till Sydafrika utan baser på vägen.
function aiReach(world, cid) {
  const mil = world.dev?.[cid]?.mil || 0;
  return 0.34 + 0.13 * mil;              // ~2 grannländer, upp till halva jorden vid nivå 4
}

function aiDistanceTo(world, cid, targetId) {
  const to = capitalLL(targetId);
  const bases = [cid, ...(world.aiEmpires?.[cid]?.owned || [])];
  let min = Infinity;
  for (const b of bases) min = Math.min(min, d3.geoDistance(capitalLL(b), to));
  return min;
}

function aiCanReach(world, cid, targetId) {
  return aiDistanceTo(world, cid, targetId) <= aiReach(world, cid);
}

// AI:n ger upp ett mål som visat sig för hårt och går vidare till nästa
function abandonTarget(world, att, target, msg) {
  const g = world.aiGoals?.[att];
  if (g) g.targets = g.targets.filter((t) => t !== target);
  if (msg) toast(msg, '', 6000);
}

// Rättfärdigande klart → AI:n MOBILISERAR tills styrkan räcker, sedan marscherar
// den synligt (och kan genskjutas). Den kastar inte längre bort armé efter armé.
function tickAiWars(ctx) {
  const { world } = ctx;
  world.fails ||= {};
  for (const w of [...world.aiWars]) {
    if (--w.ticks > 0) continue;
    if (!countryFree(w.target, worldCtx())) { world.aiWars = world.aiWars.filter((x) => x !== w); continue; }
    const key = w.att + '>' + w.target;
    const fails = world.fails[key] || 0;
    const pop = state.facts[w.att]?.p || 10e6;
    const econ = econOf(pop, w.att);
    // krav: försvarets styrka + marginal som VÄXER för varje misslyckat försök
    const need = Math.max(4, forceValue(countryArmy(w.target).units) * (1.5 + fails * 0.4));
    const cap = Math.max(6, econ * 1.6);          // vad landet realistiskt orkar resa
    const perTick = Math.max(1.2, econ / 5);      // mobiliseringstakt
    w.mob = (w.mob || perTick * 2) + perTick;
    w.waits = (w.waits || 0) + 1;
    if (w.mob < Math.min(need, cap) && w.waits < 14) {
      w.ticks = 2; // fortsätt bygga upp och invänta rätt läge
      if (w.waits === 1) toast(`\u{1F3ED} ${cname(w.att)} MOBILISERAR MOT ${cname(w.target)} — FÖRSVARET ÄR STARKT`, '', 6000);
      continue;
    }
    world.aiWars = world.aiWars.filter((x) => x !== w);
    if (w.mob < need * 0.75) {
      // orkar inte bygga tillräckligt — hellre backa än offra armén igen
      world.fails[key] = fails + 1;
      abandonTarget(world, w.att, w.target, `\u{1F6AB} ${cname(w.att)} AVSTÅR FRÅN ATT ANFALLA ${cname(w.target)} — FÖRSVARET ÄR FÖR STARKT`);
      continue;
    }
    // hann målet hamna utanför räckhåll (bas förlorad)? blås av fälttåget
    if (!aiCanReach(world, w.att, w.target)) {
      abandonTarget(world, w.att, w.target, `\u{1F69B} ${cname(w.att)} BLÅSER AV FÄLTTÅGET MOT ${cname(w.target)} — FÖR LÅNGT FRÅN FÖRSÖRJNINGEN`);
      continue;
    }
    const units = craftForce(w.mob, countryArmy(w.target).units, w.att);
    // marscher nära räckviddsgränsen kostar trupp i svinn
    const stretch = aiDistanceTo(world, w.att, w.target) / aiReach(world, w.att);
    if (stretch > 0.75) {
      const lose = Math.min(units.length - 2, Math.round((stretch - 0.75) * 8));
      if (lose > 0) units.splice(0, lose);
    }
    const from = capitalLL(w.att), to = capitalLL(w.target);
    const dist = d3.geoDistance(from, to);
    world.moving.push({
      id: Math.random().toString(36).slice(2, 8),
      att: w.att, target: w.target, goal: w.goal, units,
      fromLL: from, toLL: to,
      start: performance.now(), dur: 10000 + dist * 120000,
    });
    markKnown(w.att, w.target);
    const comp = compOf(units);
    toast(`\u{1F6A9} ${cname(w.att)}S ARMÉ (\u{1FA96}${comp.INF} \u{1F6E1}\u{FE0F}${comp.TANK} \u{2708}\u{FE0F}${comp.FLYG}) MARSCHERAR MOT ${cname(w.target)}`, 'red', 7000);
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
    // invasion av SPELARENS land: garnisonen försvarar, annars faller landet
    const s = state.solo;
    if (s?.claims[m.target]) {
      const gar = s.garrisons?.[m.target] || [];
      const home = s.army?.units.length && s.army.at === m.target && !s.armyMoving ? s.army.units : [];
      const defenders = [...gar, ...home].map((u) => ({ ...u, side: 1 }));
      const r0 = autoResolve(m.units, defenders);
      if (r0.winner === 0) {
        delete s.claims[m.target];
        delete s.integ?.[m.target];
        if (gar.length) delete s.garrisons[m.target];
        if (home.length) { s.army.units = []; }
        countryArmy(m.target).units = r0.survivorsA.map((u) => ({ ...u, side: 1 }));
        (world.aiOwned ||= {})[m.target] = m.att;
        ensureAiEmpire(world, m.att).owned.push(m.target);
        toast(`\u{1F4A5} ${cname(m.att)} HAR TAGIT ${cname(m.target)} FRÅN DIG!`, 'red', 12000);
        logEvent(`\u{1F4A5} ${cname(m.att)} EROVRADE ${cname(m.target)} FRÅN DIG`, { mine: true, war: true });
      } else {
        const left = r0.survivorsD.map(({ type, hp }) => ({ type, hp }));
        if (home.length) s.army.units = left.slice(0, home.length);
        if (gar.length) s.garrisons[m.target] = left.slice(home.length);
        toast(`\u{1F6E1}\u{FE0F} DITT FÖRSVAR SLOG TILLBAKA ${cname(m.att)}S INVASION AV ${cname(m.target)}!`, 'amber', 10000);
        logEvent(`\u{1F6E1}\u{FE0F} DU SLOG TILLBAKA ${cname(m.att)} I ${cname(m.target)}`, { mine: true, war: true });
      }
      updateArmyMarker();
      applyState();
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
      // AI:n lär sig: nästa försök kräver en större styrka — och efter tre
      // misslyckanden ger den upp målet i stället för att mala på i evighet
      world.fails ||= {};
      const key = m.att + '>' + m.target;
      world.fails[key] = (world.fails[key] || 0) + 1;
      if (world.fails[key] >= 3) {
        abandonTarget(world, m.att, m.target, `\u{1F3F3}\u{FE0F} ${attName} GER UPP FÖRSÖKEN ATT TA ${cname(m.target)}`);
      }
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
  const q = s.researchQueue || [];
  body.innerHTML = `<div style="font-size:7px;color:var(--holo-dim);margin-bottom:8px">DU HAR <span style="color:var(--amber)">${s.res.rp} \u{1F52C}</span> FORSKNINGSPOÄNG — RESEARCH OUTPUT GER FLER PER DAG</div>`;
  // FORSKNINGSKÖN högst upp: vad som pågår och vad som står på tur
  const qbox = document.createElement('div');
  qbox.id = 'resqueue';
  qbox.innerHTML = q.length
    ? `<div class="qhead">\u{1F52C} FORSKNINGSKÖ (${q.length})</div>` + q.map((r, i) => {
      const pct = i === 0 ? Math.round(((r.total - r.left) / r.total) * 100) : 0;
      return `<div class="qrow">
        <div class="qname">${i === 0 ? '\u{25B6} ' : `${i + 1}. `}${r.name.toUpperCase()}</div>
        <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
        <div class="qsub">${i === 0 ? `${Math.max(0, r.left)} DAGAR KVAR` : `I KÖ — ${r.total} DAGAR`}</div>
      </div>`;
    }).join('')
    : '<div class="qhead" style="color:var(--holo-dim)">INGEN FORSKNING PÅGÅR — VÄLJ NEDAN (FLERA KAN KÖAS)</div>';
  body.appendChild(qbox);
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
      const inQueue = q.filter((r) => r.branch === bid).length; // köade nivåer i grenen
      branch.tiers.forEach((t, i) => {
        const qi = q.findIndex((r) => r.branch === bid && r.tier === i + 1);
        const active = qi === 0;
        const queued = qi > 0;
        const canQueue = i === done + inQueue;    // nästa nivå som går att köa
        const box = document.createElement('button');
        box.className = 'tierbox ' + (i < done ? 'done' : (active || queued || canQueue) ? 'avail' : 'locked');
        box.innerHTML = active
          ? `T${i + 1} \u{25B6} PÅGÅR (${q[0].left}d)<br>${t.name}`
          : queued
          ? `T${i + 1} \u{23F3} I KÖ (${qi + 1}:A)<br>${t.name}`
          : `T${i + 1} ${i < done ? '\u{2713}' : `(${TIER_COST[i]} \u{1F52C})`}<br>${t.name}`;
        box.addEventListener('mouseenter', () => {
          const extra = (t.unlock === 'nuke' ? ' <span class="dn">\u{2622}\u{FE0F} LÅSER UPP KÄRNVAPEN</span>' : '')
            + (t.desc ? ` <span class="desc">${t.desc}</span>` : '');
          setPreview(`<span class="dc">T${i + 1} ${t.name.toUpperCase()} — ${TIER_COST[i]} \u{1F52C}</span> &nbsp; ` + deltaHtml(t.mods || {}) + extra);
        });
        box.addEventListener('mouseleave', () => setPreview());
        box.addEventListener('click', () => {
          if (i < done || active || queued) return;
          if (!canQueue) { warn('KRÄVER FÖREGÅENDE NIVÅ'); return; }
          if (q.length >= 6) { warn('MAX 6 PROJEKT I KÖN'); return; }
          if (s.res.rp < TIER_COST[i]) { warn(`KRÄVER ${TIER_COST[i]} \u{1F52C} — DU HAR ${s.res.rp}`); return; }
          s.res.rp -= TIER_COST[i];
          const days = [6, 10, 15, 20, 26][i];
          (s.researchQueue ||= []).push({ branch: bid, tier: i + 1, name: t.name, left: days, total: days, unlock: t.unlock });
          renderBuildCorner(); renderResbar(); renderNationTab();
          toast(q.length
            ? `\u{1F52C} ${t.name.toUpperCase()} LAGD I FORSKNINGSKÖN (PLATS ${q.length + 1})`
            : `\u{1F52C} FORSKNING STARTAD: ${t.name.toUpperCase()} — KLAR OM ${days} DAGAR`, 'amber', 5000);
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
      startIntegration(target.id);
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
      startIntegration(target.id);
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
  // jorden kan snurra av sig själv — eller stå helt stilla
  const tgS = $('#tgSpin');
  tgS.classList.toggle('on', !!globe.autoRotate);
  tgS.addEventListener('click', () => {
    globe.autoRotate = !globe.autoRotate;
    tgS.classList.toggle('on', globe.autoRotate);
    toast(globe.autoRotate ? '\u{1F504} JORDEN SNURRAR' : '\u{23F8} JORDEN STÅR STILL', '', 2500);
  });
  // varje fönster går att stänga med krysset
  for (const btn of document.querySelectorAll('.pclose[data-close]')) {
    btn.addEventListener('click', () => {
      const el = $(btn.dataset.close);
      el.dataset.closed = '1'; // stängd tills spelaren själv öppnar igen
      show(el, false);
    });
  }
  $('#infoclose').addEventListener('click', () => {
    selectedCountry = null;
    state.pendingIntercept = null;
    globe.select(null);
    show($('#infopanel'), false);
  });
  $('#legendclose').addEventListener('click', () => {
    show($('#legendpanel'), false);
    tgL.classList.remove('on');
    globe.setResourceMarkers(null);
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
function startTV(wantCode) {
  state.mode = 'tv';
  state.hostWorld = { aiOwned: {}, aiEmpires: {}, countryArmies: {}, aiWars: [], moving: [], aiGoals: {}, votes: [] };
  state.battles = { active: [], queued: [] };
  overlay('#menu', false);
  startWorldLoad();
  announceVersion();
  globe.autoRotate = true;
  $('#tgSpin').classList.add('on'); // TV:n snurrar från start — knappen ska visa det
  // AI-världen lever på TV:n i multiplayer
  setInterval(() => { if (state.mode === 'tv' && globe.countries.length) aiWorldTick(); }, 9000);
  setInterval(() => { if (state.mode === 'tv') checkArrivals(); }, 1000);
  // TV:n har ingen spelklocka — dag/natt + årstider drivs av väggklockan (2 s = 1 dag)
  const tvEpoch = performance.now();
  setInterval(() => { if (state.mode === 'tv') globe.setDayFloat((performance.now() - tvEpoch) / 2000); }, 250);

  net.host((code) => {
    renderTopbar();
    saveGame();
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
      $('#qrcopy').style.display = 'block';
      $('#qrcopy').onclick = () => {
        navigator.clipboard?.writeText(url)
          .then(() => toast('\u{1F4CB} LÄNKEN KOPIERAD', 'amber', 3000))
          .catch(() => {
            const r = document.createRange();
            r.selectNodeContents($('#qrurl'));
            const sel = window.getSelection();
            sel.removeAllRanges(); sel.addRange(r);
            toast('MARKERAD — TRYCK KOPIERA', '', 4000);
          });
      };
    } else {
      $('#qrimg').textContent = 'Deploya spelet för att kunna skanna QR';
    }
    show($('#qrpanel'));
    toast('RUM SKAPAT — SKANNA QR MED MOBILEN', 'amber', 6000);
  }, wantCode);

  net.on({
    peerOpen: () => {},
    peerLeave: (peerId) => {
      const p = state.players.find((x) => x.id === peerId);
      // ordningen spelar roll: rensa kön och markera spelaren FÖRST, avgör
      // den pågående striden SIST (finalizePvp kör kön i sitt sista steg)
      state.battles.queued = state.battles.queued.filter((e) => e.att !== peerId && e.def !== peerId);
      if (p && (p.claims || []).length) {
        // platsen sparas så länderna inte blir fria — spelaren kan återuppta sin session
        p.offline = true; p.busy = false; p.busyAt = '';
        toast(`${p.name.toUpperCase()} TAPPADE ANSLUTNINGEN — PLATSEN SPARAS`, 'red', 7000);
      } else {
        state.players = state.players.filter((x) => x.id !== peerId);
        if (p) toast(`${p.name.toUpperCase()} LÄMNADE`, 'red');
      }
      // avgör en pågående PvP-strid automatiskt om någon av parterna försvann
      if (state.pvpPending && (state.pvpPending.att === peerId || state.pvpPending.def === peerId)) {
        finalizePvp(state.pvpPending.id, null);
      }
      broadcastState();
      applyState();
    },
    msg: (peerId, t, d) => {
      if (t === 'hello') {
        const name = String(d?.name || '').trim().slice(0, 12) || 'SPELARE';
        // samma namn som en frånkopplad spelare → återuppta den platsen
        const prev = state.players.find((p) => p.offline && p.name === name);
        if (prev) {
          const oldId = prev.id;
          prev.id = peerId;
          prev.offline = false;
          for (const e of state.battles.queued) {
            if (e.att === oldId) e.att = peerId;
            if (e.def === oldId) e.def = peerId;
          }
          net.sendTo(peerId, 'welcome', { you: prev, players: state.players, resume: true });
          broadcastState();
          applyState();
          toast(`\u{21BB} ${name.toUpperCase()} ÄR TILLBAKA — SESSIONEN ÅTERUPPTAS`, 'amber', 6000);
          return;
        }
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
        player.ideoKey = d?.ideoKey || '';
        player.docKey = d?.docKey || '';
        player.leader = String(d?.leader || '').slice(0, 40);
        player.leaderDesc = String(d?.leaderDesc || '').slice(0, 60);
        // utropat rike ska synas för ALLA — på TV:n, i rostern och i landsfakta
        player.formation = d?.formation && d.formation.name
          ? { name: String(d.formation.name).slice(0, 40), icon: String(d.formation.icon || '').slice(0, 4) }
          : null;
        player.factionIcon = d?.faction || '';
        player.boost = d?.boost && typeof d.boost === 'object' ? d.boost : {};
        player.kenneyRow = Number(d?.kenneyRow) || 8;
        player.units = Array.isArray(d?.units) ? d.units.slice(0, 40) : [];
        renderRoster();
        broadcastState(); // så alla ser uppdaterad ideologi/ledare i landkortet
        if (selectedCountry) refreshInfoPanel();
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
        // en pågående PvP-strid styrs av värden — klientens busy-flagga får inte nolla den
        if (state.pvpPending && (state.pvpPending.att === peerId || state.pvpPending.def === peerId)) return;
        player.busy = !!d?.busy;
        player.busyAt = d?.target || '';
        rebuildActiveBattles();
        if (!player.busy) processBattleQueue();
        broadcastState();
      } else if (t === 'pvpact') {
        // spegla ett drag till motståndaren i den pågående striden
        const P = state.pvpPending;
        if (!P || P.id !== d?.battleId) return;
        const other = P.att === peerId ? P.def : (P.def === peerId ? P.att : null);
        if (!other) return;
        net.sendTo(other, 'pvpact', { battleId: P.id, act: d.act });
        (P.acts ||= []).push(d.act);
        if (state.spectate) state.battle?.applyRemote?.(d.act); // TV:n tittar på
      } else if (t === 'pvpdone') {
        // striden är spelad — bara ANFALLAREN rapporterar utfallet
        if (state.pvpPending?.att !== peerId || state.pvpPending?.id !== d?.battleId) return;
        finalizePvp(d.battleId, d);
      } else if (t === 'pvp') {
        // anfall mot en annan spelares land — köa om försvararen strider
        const att = state.players.find((p) => p.id === peerId);
        const id = String(d?.target || '');
        const def = playerOwning(id);
        if (!att || !def || def.id === att.id) return;
        const entry = { att: att.id, def: def.id, target: id };
        // en PvP-strid i taget — annars kapar nästa par den pågående striden
        if (state.pvpPending || def.busy || att.busy) {
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
  if (state.pvpPending) return; // en PvP-strid i taget
  const ready = state.battles.queued.findIndex((e) => {
    const a = state.players.find((p) => p.id === e.att);
    const d = state.players.find((p) => p.id === e.def);
    return a && d && !a.busy && !d.busy;
  });
  if (ready < 0) return;
  const [entry] = state.battles.queued.splice(ready, 1);
  resolvePvp(entry);
}

// PvP spelas som en RIKTIG taktikstrid hos anfallaren — värden håller i domen,
// markerar båda spelarna upptagna och verkställer resultatet när striden är över.
function resolvePvp(entry) {
  const A = state.players.find((p) => p.id === entry.att);
  const D = state.players.find((p) => p.id === entry.def);
  const c = globe.getCountry(entry.target);
  if (!A || !D || !c) { processBattleQueue(); return; }
  // landet kan ha bytt ägare medan ordern låg i kön — då är striden inte längre giltig
  if (playerOwning(entry.target)?.id !== D.id) {
    net.sendTo(A.id, 'pvpresult', { target: entry.target, win: false, survivors: A.units || [], foe: D.name, stale: true });
    processBattleQueue();
    return;
  }
  const battleId = Math.random().toString(36).slice(2, 9);
  A.busy = true; A.busyAt = c.name;
  D.busy = true; D.busyAt = c.name;
  // BÅDA spelarna får samma strid på sin skärm och styr sin EGEN sida.
  // Samma enhetslistor + samma seed ger identiska kartor och identisk utgång.
  const atkUnits = (A.units || []).map(({ type, hp }) => ({ type, hp }));
  const defUnits = (D.units || []).map(({ type, hp }) => ({ type, hp }));
  const common = {
    battleId, target: entry.target,
    atkUnits, defUnits,
    attName: A.name, defName: D.name,
    atkBoost: A.boost || {}, defBoost: D.boost || {},
    atkRow: A.kenneyRow ?? 8, defRow: D.kenneyRow ?? 7,
  };
  // TV:n sparar hela striden så den kan visas upp och spelas om från början
  state.pvpPending = { id: battleId, att: A.id, def: D.id, target: entry.target, ...common, acts: [] };
  net.sendTo(A.id, 'pvpbattle', { ...common, role: 'att' });
  net.sendTo(D.id, 'pvpbattle', { ...common, role: 'def' });
  toast(`\u{2694}\u{FE0F} ${A.name.toUpperCase()} ANFALLER ${D.name.toUpperCase()} I ${c.name.toUpperCase()} — STRIDEN PÅGÅR`, 'red', 7000);
  broadcastState();
  // säkerhetsnät: tappar anfallaren kontakten avgörs striden automatiskt
  clearTimeout(state.pvpTimer);
  state.pvpTimer = setTimeout(() => finalizePvp(battleId, null), 300000);
}

// tillåt bara rimliga enhetslistor från klienten
function sanitizeUnits(list, side) {
  return (Array.isArray(list) ? list : []).slice(0, 40)
    .filter((u) => UNIT_TYPES[u?.type])
    .map((u) => ({ type: u.type, hp: Math.max(1, Math.min(20, Math.floor(Number(u.hp) || 1))), side }));
}

function finalizePvp(battleId, result) {
  const P = state.pvpPending;
  if (!P || P.id !== battleId) return;
  state.pvpPending = null;
  if (state.spectate) closeSpectate();
  clearTimeout(state.pvpTimer);
  const A = state.players.find((p) => p.id === P.att);
  const D = state.players.find((p) => p.id === P.def);
  const c = globe.getCountry(P.target);
  if (A) { A.busy = false; A.busyAt = ''; }
  if (D) { D.busy = false; D.busyAt = ''; }
  if (!A || !D || !c) { broadcastState(); processBattleQueue(); return; }

  let attWon, aUnits, dUnits;
  if (result) {
    attWon = result.winner === 0 && !result.retreat;
    aUnits = sanitizeUnits(expandUnits(result.survivors || []), 0);
    dUnits = sanitizeUnits(expandUnits(result.defSurvivors || []), 1);
  } else {
    // anfallaren svarar inte — avgör med tärningsmodellen
    const r = autoResolve(
      (A.units || []).map((u) => ({ ...u, side: 0 })),
      (D.units || []).map((u) => ({ ...u, side: 1 })));
    attWon = r.winner === 0;
    aUnits = sanitizeUnits(r.survivorsA, 0);
    dUnits = sanitizeUnits(r.survivorsD, 1);
  }
  A.units = aUnits.map(({ type, hp }) => ({ type, hp }));
  D.units = dUnits.map(({ type, hp }) => ({ type, hp }));
  if (attWon) {
    D.claims = D.claims.filter((x) => x !== P.target);
    D.puppets = (D.puppets || []).filter((x) => x !== P.target);
    if (!A.claims.includes(P.target)) A.claims.push(P.target);
    if (D.home === P.target) D.home = D.claims[0] || null;
  }
  net.sendTo(A.id, 'pvpresult', { target: P.target, win: attWon, survivors: A.units, foe: D.name });
  net.sendTo(D.id, 'pvpresult', { target: P.target, win: !attWon, survivors: D.units, foe: A.name, defended: true });
  // förlorar man ALLA sina länder åker man tillbaka till lobbyn
  if (!D.claims.length) {
    D.home = null;
    D.units = [];
    // en utslagen spelare har inga strider kvar att utkämpa
    state.battles.queued = state.battles.queued.filter((e) => e.att !== D.id && e.def !== D.id);
    net.sendTo(D.id, 'eliminated', { by: A.name });
    toast(`\u{1F480} ${D.name.toUpperCase()} ÄR UTSLAGEN — TILLBAKA TILL LOBBYN`, 'red', 8000);
  }
  broadcastState();
  applyState();
  toast(attWon
    ? `\u{2694}\u{FE0F} ${A.name.toUpperCase()} HAR ERÖVRAT ${c.name.toUpperCase()} FRÅN ${D.name.toUpperCase()}!`
    : `\u{1F6E1}\u{FE0F} ${D.name.toUpperCase()} FÖRSVARADE ${c.name.toUpperCase()} MOT ${A.name.toUpperCase()}!`, 'amber', 7000);
  tvHighlight(c, attWon ? A : D);
  processBattleQueue();
}

// (gamla direktavgörandet finns kvar som referens i finalizePvp:s autoResolve-gren)
function resolvePvpAuto(entry) {
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
        state.resuming = !!d.resume;
        overlay('#join', false);
        overlay('#menu', false);
        startWorldLoad();
        announceVersion();
        applyState();
        toast(d.resume
          ? '\u{21BB} DU ÄR TILLBAKA — DIN SESSION ÅTERUPPTAS'
          : 'ANSLUTEN! VÄLJ DITT HEMLAND PÅ GLOBEN', 'amber', 5000);
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
            garrisons: {}, cityB: {}, trade: [], buildQueue: [], researchQueue: [],
          };
          // återupptagen session? bygg upp nationen igen i stället för att börja om
          const snap = state.resuming ? loadSession() : null;
          if (snap && restoreSession(snap, me.home)) {
            toast('\u{21BB} NATIONEN ÅTERSTÄLLD — DU FORTSÄTTER DÄR DU SLUTADE', 'amber', 7000);
          } else {
            initNation(me.home);
            spawnArmy(me.home);
            openFactionPick();
          }
          state.resuming = false;
          startNationSync();
        }
        // spegla mina länder från värden så solo-vägarna funkar (bygge, riken, fakta)
        if (state.solo && me) {
          state.solo.claims = {};
          for (const cid of (me.claims || [])) {
            const isPuppet = me.puppets?.includes(cid);
            state.solo.claims[cid] = { color: me.color, playerName: 'DU', puppet: isPuppet };
            // nyvunnet land (även via PvP) ska integreras — lydstater styr sig själva
            if (cid !== state.solo.home && !isPuppet && !state.solo.integ?.[cid]) startIntegration(cid);
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
      } else if (t === 'pvpbattle') {
        startPvpBattle(d);
      } else if (t === 'pvpact') {
        // motståndarens drag i den pågående striden
        if (state.pvpBattleId === d.battleId) state.battle?.applyRemote?.(d.act);
      } else if (t === 'eliminated') {
        backToLobby(d?.by);
      } else if (t === 'deny') {
        toast('LANDET ÄR REDAN TAGET!', 'red');
      }
    },
    hostLost: () => toast('TAPPADE KONTAKTEN MED TV:N', 'red', 8000),
  });
}

// PvP: värden startar striden hos anfallaren — samma taktikkarta som mot AI
function startPvpBattle(d) {
  const s = state.solo;
  const target = globe.getCountry(d.target);
  const iAmAtt = d.role !== 'def';
  // kan vi inte strida (utslagen, kartan inte klar) MÅSTE värden få veta det —
  // annars står hela stridskön still tills timeouten löser ut
  if (!s || !target) {
    if (iAmAtt) {
      net.send('pvpdone', {
        battleId: d.battleId, winner: 1, retreat: true,
        survivors: [], defSurvivors: d.defUnits || [],
      });
    }
    return;
  }
  if (state.battle) { state.battle.destroy?.(); state.battle = null; }
  // BÅDA sidorna byggs från värdens listor → identiska kartor och enhetsordning
  const atk = consolidate(sanitizeUnits(d.atkUnits, 0));
  const def = consolidate(sanitizeUnits(d.defUnits, 1));
  if (!atk.length) atk.push(mkUnit('INF', 0));
  if (!def.length) def.push(mkUnit('INF', 1));
  state.pvpBattleId = d.battleId;
  state.pvpRole = d.role || 'att';
  state.pendingTarget = target;
  const foe = String((iAmAtt ? d.defName : d.attName) || '').toUpperCase();
  $('#battle').classList.add('show');
  $('#btitle').textContent = `\u{2694} ${foe} — ${target.name.toUpperCase()}`;
  show($('#bEndTurn'), true);
  show($('#bSelAll'), false);
  toast(iAmAtt
    ? `\u{2694}\u{FE0F} DU ANFALLER ${foe} OM ${target.name.toUpperCase()}!`
    : `\u{1F6E1}\u{FE0F} ${foe} ANFALLER — FÖRSVARA ${target.name.toUpperCase()}!`, 'red', 7000);
  state.battle = new BattleA({
    canvas: $('#bcanvas'),
    klinchCanvas: $('#kcanvas'),
    klinchEl: $('#klinch'),
    biome: biomeFor(target),
    atk,
    def,
    seed: seedFrom(target.id),
    atkBoost: d.atkBoost || {},
    defBoost: d.defBoost || {},
    kenneyRow: (iAmAtt ? d.atkRow : d.defRow) ?? 8,
    pvp: {
      role: iAmAtt ? 'att' : 'def',
      send: (act) => net.send('pvpact', { battleId: d.battleId, act }),
    },
    setStatus: (t) => { $('#bstatus').textContent = t; },
    setTerrain: renderTerrBadge,
    onEnd: (result) => finishPvpBattle(result),
  });
}

function finishPvpBattle(result) {
  const iAmAtt = state.pvpRole !== 'def';
  state.battle?.destroy?.();
  state.battle = null;
  $('#battle').classList.remove('show');
  $('#klinch').style.display = 'none';
  const s = state.solo;
  // mina överlevare är min sidas lista
  if (s?.army) {
    s.army.units = expandUnits((iAmAtt ? result.survivors : result.defSurvivors) || []);
    updateArmyMarker();
  }
  // bara anfallaren rapporterar utfallet till värden (annars dubbla domar)
  if (iAmAtt) {
    net.send('pvpdone', {
      battleId: state.pvpBattleId,
      winner: result.winner,
      retreat: !!result.retreat,
      survivors: (result.survivors || []).map(({ type, hp }) => ({ type, hp })),
      defSurvivors: (result.defSurvivors || []).map(({ type, hp }) => ({ type, hp })),
    });
  } else {
    toast('STRIDEN ÄR ÖVER — TV:N RÄKNAR SAMMAN', '', 4000);
  }
  state.pvpBattleId = null;
  state.pvpRole = null;
  applyState();
}

// utslagen ur spelet — tillbaka till lobbyn för att välja nytt hemland
function backToLobby(by) {
  state.solo = null;
  state.battle?.destroy?.();
  state.battle = null;
  selectedCountry = null;
  globe.select(null);
  globe.setArmy(null);
  globe.setGarrisons([]);
  globe.setPlayerLaunch(null);
  globe.setSatCoverage(null);
  globe.setWarZones([]);
  globe.setCountryArmies([]);
  $('#battle').classList.remove('show');
  $('#nation').classList.remove('show');
  $('#citypanel').classList.remove('show');
  $('#resbar').style.display = 'none';
  $('#buildcorner').style.display = 'none';
  show($('#infopanel'), false);
  overlay('#bresult', false);
  toast(`\u{1F480} DU ÄR UTSLAGEN${by ? ' AV ' + String(by).toUpperCase() : ''} — VÄLJ ETT NYTT HEMLAND PÅ GLOBEN`, 'red', 10000);
  applyState();
}

// ---------- SPARAT SPEL: ett pågående parti överlever en omladdning ----------
const GAME_KEY = 'imperium.game';
function saveGame() {
  try {
    if (state.mode === 'solo' && state.solo?.nation) {
      const s = state.solo;
      localStorage.setItem(GAME_KEY, JSON.stringify({
        mode: 'solo', at: Date.now(), day: s.clock?.day || 1, version: VERSION,
        solo: {
          claims: s.claims, home: s.home, army: s.army, wars: s.wars, reparations: s.reparations,
          aiOwned: s.aiOwned, aiEmpires: s.aiEmpires, permMods: s.permMods, nation: s.nation,
          res: s.res, extra: s.extra, faction: s.faction, factionMods: s.factionMods,
          leader: s.leader, leaderMods: s.leaderMods, buildQueue: s.buildQueue,
          researchQueue: s.researchQueue, garrisons: s.garrisons, cityB: s.cityB, trade: s.trade,
          integ: s.integ, countryArmies: s.countryArmies, aiWars: s.aiWars, aiGoals: s.aiGoals,
          dev: s.dev, dream: s.dream, spaceNations: s.spaceNations, aiInteg: s.aiInteg,
          known: [...(s.known || [])],
        },
        world: state.world || {},
        history: (state.history || []).slice(0, 120),
      }));
    } else if (state.mode === 'tv') {
      const w = state.hostWorld;
      localStorage.setItem(GAME_KEY, JSON.stringify({
        mode: 'tv', at: Date.now(), code: net.code, version: VERSION,
        players: state.players.map(({ ...p }) => ({ ...p, offline: true })),
        hostWorld: {
          aiOwned: w.aiOwned, aiEmpires: w.aiEmpires, countryArmies: w.countryArmies,
          aiWars: w.aiWars, aiGoals: w.aiGoals, dev: w.dev, dream: w.dream, leaders: w.leaders,
          spaceNations: w.spaceNations, aiInteg: w.aiInteg, fails: w.fails, known: [...(w.known || [])],
        },
        world: state.world || {},
        history: (state.history || []).slice(0, 120),
      }));
    }
  } catch (e) { /* fullt lager */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const g = JSON.parse(raw);
    return g && Date.now() - (g.at || 0) < 24 * 3600e3 ? g : null;
  } catch (e) { return null; }
}

// ---------- sessionsminne: tappar man kontakten kan man återuppta sitt spel ----------
const SESS_KEY = 'imperium.session';
function saveSession() {
  const s = state.solo;
  if (state.mode !== 'player' || !s?.nation || !net.code) return;
  try {
    localStorage.setItem(SESS_KEY, JSON.stringify({
      room: net.code, name: state.me?.name || '', at: Date.now(),
      home: s.home, nation: s.nation, res: s.res, extra: s.extra, permMods: s.permMods,
      faction: s.faction, factionMods: s.factionMods, leader: s.leader, leaderMods: s.leaderMods,
      cityB: s.cityB, trade: s.trade, buildQueue: s.buildQueue, researchQueue: s.researchQueue,
      garrisons: s.garrisons, army: s.army, integ: s.integ, wars: s.wars, day: s.clock?.day || 1,
    }));
  } catch (e) { /* privat läge / fullt lager — strunt samma */ }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESS_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw);
    // en session är giltig i 12 timmar
    return snap && Date.now() - (snap.at || 0) < 12 * 3600e3 ? snap : null;
  } catch (e) { return null; }
}

// bygg upp nationen igen från ögonblicksbilden i stället för att börja om
function restoreSession(snap, home) {
  const s = state.solo;
  if (!s || !snap || snap.home !== home) return false;
  s.nation = snap.nation;
  s.res = snap.res || { money: 500, man: 20, rp: 0, pp: 100 };
  s.extra = snap.extra || {};
  s.permMods = snap.permMods || {};
  s.faction = snap.faction;
  s.factionMods = snap.factionMods || {};
  s.leader = snap.leader || null;
  s.leaderMods = snap.leaderMods || {};
  s.cityB = snap.cityB || {};
  s.trade = snap.trade || [];
  s.buildQueue = snap.buildQueue || [];
  s.researchQueue = snap.researchQueue || [];
  s.garrisons = snap.garrisons || {};
  s.integ = snap.integ || {};
  s.wars = snap.wars || {};
  s.army = snap.army || { units: [], ll: capitalLL(home), at: home };
  s.clock = { day: snap.day || 1, paused: false, acc: 0, msPerDay: 2000 };
  if (s.faction) applyFaction(FACTIONS[s.faction]);
  recomputeNation();
  $('#resbar').style.display = 'flex';
  renderResbar();
  renderBuildCorner();
  updateArmyMarker();
  applyState();
  return true;
}

// skicka nationssummering till TV:n (ideologi, faktion, armé) med jämna mellanrum
function startNationSync() {
  const send = () => {
    const s = state.solo;
    if (state.mode !== 'player' || !s?.nation) return;
    saveSession();
    net.send('nation', {
      ideo: IDEOLOGIES[s.nation.ideology]?.icon || '',
      ideoKey: s.nation.ideology,
      docKey: s.nation.doctrine || '',
      leader: s.leader?.n || '',
      leaderDesc: s.leader ? leaderDesc(s.leader) : '',
      formation: s.nation.formation ? { name: s.nation.formation.name, icon: s.nation.formation.icon } : null,
      faction: FACTIONS[s.faction]?.icon || '',
      boost: battleBoost(),                       // stridsbonus, så PvP blir rättvist
      kenneyRow: FACTIONS[s.faction]?.kenneyRow ?? 8,
      units: (s.army?.units || []).map(({ type, hp }) => ({ type, hp })),
    });
  };
  send();
  setInterval(send, 5000);
}

function renderBattleFeed(battles) {
  const feed = $('#battlefeed');
  const list = $('#battlefeedlist');
  list.innerHTML = '';
  let n = 0;
  const P = state.pvpPending;
  // pågående spelarstrid — på TV:n går den att klicka fram och titta på
  if (state.mode === 'tv' && P) {
    const an = state.players.find((p) => p.id === P.att)?.name || '?';
    const dn = state.players.find((p) => p.id === P.def)?.name || '?';
    const row = document.createElement('button');
    row.className = 'feedrow live' + (state.spectate ? ' on' : '');
    row.innerHTML = `\u{2694} ${an.toUpperCase()} vs ${dn.toUpperCase()}<br><small>${(globe.getCountry(P.target)?.name || '').toUpperCase()} — ${state.spectate ? 'DÖLJ STRIDEN' : 'VISA STRIDEN'}</small>`;
    row.addEventListener('click', () => toggleSpectate());
    list.appendChild(row);
    n++;
  }
  for (const a of battles?.active || []) {
    if (P && state.mode === 'tv') break; // redan visad som klickbar rad
    const d = document.createElement('div');
    d.className = 'feedrow';
    d.style.color = 'var(--amber)';
    d.textContent = `\u{2694} ${a.name.toUpperCase()}${a.target ? ': ' + a.target.toUpperCase() : ''} — PÅGÅR`;
    list.appendChild(d);
    n++;
  }
  for (const q of battles?.queued || []) {
    const an = state.players.find((p) => p.id === q.att)?.name || '?';
    const dn = state.players.find((p) => p.id === q.def)?.name || '?';
    const d = document.createElement('div');
    d.className = 'feedrow';
    d.style.color = 'var(--holo-dim)';
    d.textContent = `\u{23F3} ${an.toUpperCase()} \u{2694} ${dn.toUpperCase()} — KÖAD`;
    list.appendChild(d);
    n++;
  }
  show(feed, n > 0 && feed.dataset.closed !== '1');
}

// ---------- TV:n tittar på en pågående spelarstrid ----------
function toggleSpectate() {
  if (state.spectate) { closeSpectate(); return; }
  const P = state.pvpPending;
  const target = P && globe.getCountry(P.target);
  if (!P || !target) return;
  state.spectate = true;
  $('#battle').classList.add('show');
  const an = state.players.find((p) => p.id === P.att)?.name || '?';
  const dn = state.players.find((p) => p.id === P.def)?.name || '?';
  $('#btitle').textContent = `\u{1F4FA} ${an.toUpperCase()} vs ${dn.toUpperCase()} — ${target.name.toUpperCase()}`;
  show($('#bEndTurn'), false);
  show($('#bSelAll'), false);
  show($('#bRetreat'), false);
  show($('#bClose'), true); // TV:n stänger stridsvyn med krysset
  state.battle = new BattleA({
    canvas: $('#bcanvas'),
    klinchCanvas: $('#kcanvas'),
    klinchEl: $('#klinch'),
    biome: biomeFor(target),
    atk: consolidate(sanitizeUnits(P.atkUnits, 0)),
    def: consolidate(sanitizeUnits(P.defUnits, 1)),
    seed: seedFrom(P.target),
    atkBoost: P.atkBoost || {},
    defBoost: P.defBoost || {},
    kenneyRow: P.atkRow ?? 8,
    pvp: { role: 'spec', send: () => {} }, // åskådare: styr ingenting
    setStatus: (t) => { $('#bstatus').textContent = t; },
    setTerrain: renderTerrBadge,
    onEnd: () => closeSpectate(),
  });
  // spela upp de drag som redan hunnit ske
  for (const act of P.acts || []) state.battle.applyRemote(act);
  renderBattleFeed(state.battles);
}

function closeSpectate() {
  state.spectate = false;
  state.battle?.destroy?.();
  state.battle = null;
  $('#battle').classList.remove('show');
  $('#klinch').style.display = 'none';
  show($('#bRetreat'), true);
  show($('#bClose'), false);
  renderBattleFeed(state.battles);
}

$('#bClose').addEventListener('click', () => closeSpectate());

// Återuppta ett pågående parti efter omladdning (nya versionen behåller spelet)
function resumeGame(g) {
  if (!g) return false;
  if (g.mode === 'solo') {
    startSolo(true);
    const pending = () => {
      if (!globe.countries.length) { setTimeout(pending, 400); return; }
      const s = state.solo;
      Object.assign(s, g.solo, {
        known: new Set(g.solo.known || []),
        clock: { day: g.day || 1, paused: false, acc: 0, msPerDay: 2000 },
        moving: [], votes: [],           // marscher går på wall-clock och kan inte sparas
      });
      state.world = g.world || {};
      state.history = g.history || [];
      if (s.faction) applyFaction(FACTIONS[s.faction]);
      recomputeNation();
      $('#resbar').style.display = 'flex';
      renderResbar();
      renderBuildCorner();
      updateArmyMarker();
      applyState();
      toast(`\u{21BB} SPELET ÅTERUPPTAGET — DAG ${s.clock.day}, ${Object.keys(s.claims).length} LÄNDER`, 'amber', 8000);
    };
    pending();
    return true;
  }
  if (g.mode === 'tv') {
    startTV(g.code);
    const pending = () => {
      if (!globe.countries.length) { setTimeout(pending, 400); return; }
      Object.assign(state.hostWorld, g.hostWorld, { known: new Set(g.hostWorld?.known || []), moving: [], votes: [], defenses: [] });
      state.players = g.players || [];
      state.world = g.world || {};
      state.history = g.history || [];
      applyState();
      broadcastState();
      toast(`\u{21BB} SPELET ÅTERUPPTAGET — SPELARNA KAN ANSLUTA MED SAMMA NAMN`, 'amber', 10000);
    };
    pending();
    return true;
  }
  return false;
}

// ---------- erövringsläge (solo-prototyp) ----------
function startSolo(resuming) {
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
  announceVersion();
  if (!resuming) toast('VÄLJ DITT HEMLAND — KLICKA PÅ ETT LAND', 'amber', 6000);
}

// ---------- meny + start ----------
$('#menuversion').innerHTML = `VERSION ${VERSION} \u{2022} ${VERSION_DATE}<br><span class="vname">${VERSION_NAME}</span>`;
// versionen syns också när partiet startar, så alla kan jämföra på TV och mobil
function announceVersion() {
  toast(`\u{1F4E6} IMPERIUM V${VERSION} — ${VERSION_NAME}`, 'amber', 6000);
}

wireToggles();
renderLegend();

$('#btnTV').addEventListener('click', () => startTV());
$('#btnSolo').addEventListener('click', () => startSolo());

// pågående parti? erbjud att fortsätta där man var
const savedGame = loadGame();
if (savedGame) {
  const b = $('#btnContinue');
  b.innerHTML = savedGame.mode === 'tv'
    ? `&#8635; FORTSÄTT TV-SPELET (RUM ${savedGame.code || '?'})`
    : `&#8635; FORTSÄTT SPELET (DAG ${savedGame.day || 1})`;
  b.style.display = 'block';
  b.addEventListener('click', () => resumeGame(savedGame));
}
// spara partiet regelbundet så en omladdning aldrig kostar spelet
setInterval(saveGame, 8000);
// har man en sparad session erbjuds den direkt i anslutningsrutan
function refreshResumeBtn() {
  const snap = loadSession();
  const rb = $('#btnResume');
  if (snap?.room && snap?.name) {
    rb.innerHTML = `&#8635; FORTSÄTT SOM ${snap.name.toUpperCase()} I RUM ${snap.room}`;
    rb.style.display = 'block';
    rb.onclick = () => {
      $('#joinname').value = snap.name;
      $('#joincode').value = snap.room;
      $('#btnJoinGo').click();
    };
  } else {
    rb.style.display = 'none';
  }
}

$('#btnJoin').addEventListener('click', () => {
  overlay('#menu', false);
  overlay('#join', true);
  refreshResumeBtn();
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
  refreshResumeBtn();
  setTimeout(() => $('#joinname').focus(), 50);
}
