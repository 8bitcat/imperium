// IMPERIUM v3 — huvudflöde: erövringsläge med armé + två stridsprototyper
// (TV-läge och spelarläge fungerar som i v2 — arméerna är än så länge solo-prototyp)
import { Net } from './net.js';
import { loadWorld, loadCities, loadFacts } from './data.js';
import { Globe } from './globe.js';
import { RESOURCES, RECIPES, resourcesOf } from './resources.js';
import { STARTER_ARMY, defenderArmy, compOf, autoResolve, biomeFor, BIOMES, mkUnit } from './units.js';
import { BattleA } from './battleA.js';
import { BattleB } from './battleB.js';

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

document.fonts?.load('10px "Press Start 2P"').then(() => { globe.sceneDirty = true; }).catch(() => {});

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

function claimsMap() {
  if (state.mode === 'solo') return state.solo?.claims || {};
  const claims = {};
  for (const p of state.players) if (p.home) claims[p.home] = { color: p.color, playerName: p.name };
  return claims;
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
    home.textContent = p.home
      ? `— ${globe.getCountry(p.home)?.name || '?'} ${resIcons(p.home)}`
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
    el.textContent = n ? `ERÖVRADE LÄNDER: ${n}` : 'ERÖVRINGSLÄGE';
  }
}

function applyState() {
  globe.setClaims(claimsMap());
  renderRoster();
  renderTopbar();
  refreshInfoPanel();
}

// ---------- armé (solo-prototypen) ----------
function spawnArmy(countryId) {
  state.solo.army = { units: STARTER_ARMY(), ll: capitalLL(countryId), at: countryId };
  updateArmyMarker();
}

function updateArmyMarker() {
  const a = state.solo?.army;
  globe.setArmy(a ? { ll: a.ll, comp: compOf(a.units), color: SOLO_COLOR } : null);
}

function armyFlyTo(targetLL, ms, done) {
  const a = state.solo.army;
  const interp = d3.geoInterpolate(a.ll, targetLL);
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    a.ll = interp(k);
    updateArmyMarker();
    if (k < 1) requestAnimationFrame(step);
    else done?.();
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
  show(claimBtn, false);
  show(attackBtn, false);

  if (state.mode === 'solo') {
    const s = state.solo;
    if (claim) {
      $('#istatus').textContent = 'DITT TERRITORIUM';
      $('#istatus').style.color = SOLO_COLOR;
    } else if (!s.home) {
      $('#istatus').textContent = 'FRITT TERRITORIUM';
      $('#istatus').style.color = '';
      claimBtn.textContent = 'GÖR TILL HEMLAND';
      show(claimBtn, true);
    } else {
      const def = defenderArmy(c, state.facts[c.id]);
      $('#istatus').textContent = `FÖRSVAR: ${def.length} ENHETER • BIOM: ${BIOMES[biomeFor(c)].name}`;
      $('#istatus').style.color = '';
      if (s.army && !state.battle) show(attackBtn, true);
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

globe.onSelect = (c) => {
  selectedCountry = c;
  refreshInfoPanel();
};

$('#claimbtn').addEventListener('click', () => {
  if (!selectedCountry) return;
  if (state.mode === 'solo') {
    const s = state.solo;
    if (s.home) return;
    s.home = selectedCountry.id;
    s.claims[selectedCountry.id] = { color: SOLO_COLOR, playerName: 'DU' };
    spawnArmy(selectedCountry.id);
    applyState();
    toast(`${selectedCountry.name.toUpperCase()} ÄR DITT HEMLAND — DIN ARMÉ ÄR MOBILISERAD`, 'amber', 5000);
    toast('VÄLJ ETT GRANNLAND OCH TRYCK ANFALL', '', 5000);
    return;
  }
  if (state.mode !== 'player') return;
  $('#claimbtn').disabled = true;
  setTimeout(() => { $('#claimbtn').disabled = false; }, 1500);
  net.send('claim', { country: selectedCountry.id });
});

// ---------- anfall + stridsval ----------
$('#attackbtn').addEventListener('click', () => {
  if (!selectedCountry || state.mode !== 'solo' || !state.solo.army || state.battle) return;
  const target = selectedCountry;
  state.pendingTarget = target;
  state.solo.prevAt = state.solo.army.at;
  show($('#attackbtn'), false);
  const dest = capitalLL(target.id);
  toast(`ARMÉN RYCKER FRAM MOT ${target.name.toUpperCase()}…`, 'amber', 2500);
  globe.animateTo(dest, Math.max(2, globe.zoom), 1500);
  armyFlyTo(dest, 1500, () => {
    state.solo.army.at = target.id;
    $('#chooserTarget').textContent = `ANFALL MOT ${target.name.toUpperCase()}`;
    overlay('#chooser', true);
  });
});

function closeChooser() { overlay('#chooser', false); }

$('#chCancel').addEventListener('click', () => {
  closeChooser();
  refreshInfoPanel();
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
  const def = defenderArmy(target, state.facts[target.id]);
  const atk = state.solo.army.units.map((u) => ({ ...u }));
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
    setStatus: (s) => { $('#bstatus').textContent = s; },
    onEnd: (result) => finishBattle(result),
  };
  state.battle = kind === 'A' ? new BattleA(opts) : new BattleB(opts);
}

function finishBattle(result) {
  const target = state.pendingTarget;
  const s = state.solo;
  state.battle?.destroy?.();
  state.battle = null;
  $('#battle').classList.remove('show');
  $('#klinch').style.display = 'none';

  const victory = result.winner === 0;
  if (victory) {
    s.claims[target.id] = { color: SOLO_COLOR, playerName: 'DU' };
    s.army.units = result.survivors.map((u) => ({ ...u }));
    s.army.units.push(mkUnit('INF', 0)); // förstärkning från det erövrade landet
    s.army.at = target.id;
    s.army.ll = capitalLL(target.id);
    const res = resourcesOf(target.id).map((r) => `${RESOURCES[r].icon} ${RESOURCES[r].name.toUpperCase()}`).join(' + ');
    $('#bresTitle').textContent = 'SEGER!';
    $('#bresTitle').style.color = 'var(--amber)';
    $('#bresText').innerHTML = `${target.name.toUpperCase()} ÄR ERÖVRAT${result.auto ? ` (AUTO, ${result.rounds} RONDER)` : ''}<br>NYA TILLGÅNGAR: ${res}<br>+1 INFANTERI I FÖRSTÄRKNING`;
  } else if (result.retreat) {
    s.army.units = result.survivors.map((u) => ({ ...u }));
    s.army.at = s.prevAt;
    s.army.ll = capitalLL(s.prevAt);
    $('#bresTitle').textContent = 'RETRÄTT';
    $('#bresTitle').style.color = 'var(--holo)';
    $('#bresText').textContent = 'ARMÉN DRAR SIG TILLBAKA MED ÖVERLEVANDE ENHETER.';
  } else {
    spawnArmy(s.home);
    $('#bresTitle').textContent = 'NEDERLAG';
    $('#bresTitle').style.color = 'var(--red)';
    $('#bresText').textContent = `ARMÉN KROSSADES${result.auto ? ` (AUTO, ${result.defLeft} FIENDER KVAR)` : ''} — EN NY ARMÉ MOBILISERAS I HEMLANDET.`;
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
function wireToggles() {
  const tgC = $('#tgCities'), tgT = $('#tgTrade'), tgL = $('#tgLegend');
  tgC.addEventListener('click', () => {
    const on = !globe.showCities;
    globe.setShowCities(on);
    tgC.classList.toggle('on', on);
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

// ---------- handelsrutter ----------
function buildRoutes(citiesByCountry) {
  const routes = [];
  const capitals = [];
  for (const [cid, list] of Object.entries(citiesByCountry)) {
    if (!list.length) continue;
    const cap = list.find((c) => c.c) || list[0];
    capitals.push({ cid, ll: cap.ll });
    const res = resourcesOf(cid);
    list.forEach((city, i) => {
      if (city === cap) return;
      routes.push({
        a: cap.ll, b: city.ll,
        color: RESOURCES[res[i % res.length]].color,
        dur: 5000 + Math.random() * 4000,
        phase: Math.random() * 9000,
        intl: false,
      });
    });
  }
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
        a: c.ll, b: o.ll,
        color: RESOURCES[res[0]].color,
        dur: 7000 + d * 5000 + Math.random() * 3000,
        phase: Math.random() * 12000,
        intl: true,
      });
    }
  }
  return routes;
}

// ---------- kartdata ----------
function startWorldLoad() {
  overlay('#loading', true);
  Promise.all([loadCities(), loadFacts()]).then(([cities, facts]) => {
    state.cities = cities;
    state.facts = facts;
    globe.setCities(cities);
    globe.setRoutes(buildRoutes(cities));
    if (selectedCountry) refreshInfoPanel();
  }).catch((e) => console.warn('städer kunde inte laddas', e));

  loadWorld((countries, level) => {
    state.mapLevel = level;
    globe.setCountries(countries);
    globe.setClaims(claimsMap());
    if (level === '110m') {
      overlay('#loading', false);
      show($('#topbar'));
      show($('#hint'));
      $('#toggles').style.display = 'flex';
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
  overlay('#menu', false);
  startWorldLoad();
  globe.autoRotate = true;

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
        const player = { id: peerId, name, color, home: null };
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
        if (state.players.some((p) => p.home === id && p.id !== peerId)) {
          net.sendTo(peerId, 'deny', { reason: 'taken' });
          return;
        }
        player.home = id;
        broadcastState();
        applyState();
        tvHighlight(c, player);
      }
    },
    netError: (type) => toast('NÄTVERKSFEL: ' + type, 'red'),
  });
}

function broadcastState() {
  net.broadcast('state', { players: state.players });
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
        const me = state.players.find((p) => p.id === net.myId);
        if (me) state.me = me;
        applyState();
      } else if (t === 'deny') {
        toast('LANDET ÄR REDAN TAGET!', 'red');
      }
    },
    hostLost: () => toast('TAPPADE KONTAKTEN MED TV:N', 'red', 8000),
  });
}

// ---------- erövringsläge (solo-prototyp) ----------
function startSolo() {
  state.mode = 'solo';
  state.solo = { claims: {}, home: null, army: null, prevAt: null };
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
