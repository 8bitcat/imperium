// IMPERIUM — huvudflöde: meny, TV-läge (värd), spelarläge (QR/kod), utforskarläge
import { Net } from './net.js';
import { loadWorld } from './data.js';
import { Globe } from './globe.js';
import { flagEmoji } from './names.js';

const $ = (s) => document.querySelector(s);
const PLAYER_COLORS = ['#ff4f4f', '#4fa8ff', '#ffd24f', '#b06bff', '#ff9f3e', '#3ee6c8', '#ff6fd8', '#a4e34a'];

const net = new Net();
const globe = new Globe($('#globe'));

const state = {
  mode: null,          // 'tv' | 'player' | 'solo'
  players: [],         // [{id, name, color, home}]
  me: null,            // {id, name, color, home} (spelarläge)
  mapLevel: null,
  tvTimer: null,
};

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

function claimsFromPlayers() {
  const claims = {};
  for (const p of state.players) if (p.home) claims[p.home] = { color: p.color, playerName: p.name };
  return claims;
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
    home.textContent = p.home ? '— ' + (globe.getCountry(p.home)?.name || '?') : '— väljer land…';
    row.append(chip, name, home);
    list.appendChild(row);
  }
  show($('#roster'), state.players.length > 0);
}

function renderTopbar() {
  const el = $('#topright');
  if (state.mode === 'tv') el.textContent = `RUM ${net.code} • ${state.players.length} SPELARE`;
  else if (state.mode === 'player') el.textContent = `${state.me?.name || ''} • RUM ${net.code || ''}`;
  else el.textContent = 'UTFORSKARLÄGE';
}

function applyState() {
  globe.setClaims(claimsFromPlayers());
  renderRoster();
  renderTopbar();
  if (state.mode === 'player') refreshInfoPanel();
}

// ---------- landsinfo-panelen ----------
let selectedCountry = null;

function refreshInfoPanel() {
  const panel = $('#infopanel');
  if (!selectedCountry) { show(panel, false); return; }
  const c = selectedCountry;
  $('#iname').textContent = `${flagEmoji(c.id)} ${c.name}`.trim().toUpperCase();
  const claim = claimsFromPlayers()[c.id];
  const btn = $('#claimbtn');
  if (claim) {
    const mine = state.me && state.me.home === c.id;
    $('#istatus').textContent = mine ? 'DITT HEMLAND' : `TAGET AV ${claim.playerName.toUpperCase()}`;
    $('#istatus').style.color = claim.color;
    show(btn, false);
  } else {
    $('#istatus').textContent = 'FRITT TERRITORIUM';
    $('#istatus').style.color = '';
    show(btn, state.mode === 'player');
  }
  show(panel, true);
}

globe.onSelect = (c) => {
  selectedCountry = c;
  refreshInfoPanel();
};

$('#claimbtn').addEventListener('click', () => {
  if (!selectedCountry || state.mode !== 'player') return;
  $('#claimbtn').disabled = true;
  setTimeout(() => { $('#claimbtn').disabled = false; }, 1500);
  net.send('claim', { country: selectedCountry.id });
});

// ---------- kartdata ----------
function startWorldLoad() {
  overlay('#loading', true);
  loadWorld((countries, level) => {
    state.mapLevel = level;
    globe.setCountries(countries);
    globe.setClaims(claimsFromPlayers());
    if (level === '110m') {
      overlay('#loading', false);
      show($('#topbar'));
      show($('#hint'));
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

// TV:n flyger till landet som just valdes, visar banner, och återgår sen till översikt
function tvHighlight(country, player) {
  clearTimeout(state.tvTimer);
  globe.autoRotate = false;
  const [[x0, y0], [x1, y1]] = country.bounds;
  const span = Math.max(x1 < x0 ? x1 + 360 - x0 : x1 - x0, y1 - y0, 4);
  const z = Math.min(6, Math.max(1.8, 60 / span));
  globe.select(country.id);
  globe.animateTo(country.centroid, z, 1800, () => {
    toast(`${player.name.toUpperCase()} HAR VALT ${country.name.toUpperCase()}!`, 'amber', 4500);
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

// ---------- utforskarläge ----------
function startSolo() {
  state.mode = 'solo';
  overlay('#menu', false);
  startWorldLoad();
  renderTopbar();
}

// ---------- meny + start ----------
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

// QR-länk: ?room=KOD → hoppa direkt till anslutningsformuläret
const roomParam = new URLSearchParams(location.search).get('room');
if (roomParam && roomParam.length === 4) {
  overlay('#menu', false);
  overlay('#join', true);
  $('#joincode').value = roomParam.toUpperCase();
  setTimeout(() => $('#joinname').focus(), 50);
}
