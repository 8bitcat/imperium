// IMPERIUM v3 — pixelerad jordglob med städer, skarpa etiketter, levande handel
// och arméer som markörer med truppsammansättning + antal.
import { drawUnit } from './units.js';

const LAND_SHADES = ['#123f4c', '#15464f', '#0f3a49', '#174b52', '#113844', '#1a4f57'];
const OCEAN = '#07243a';
const SPACE = '#030711';
const BORDER = '#2b8fae';
const RIM = '#39d7ff';
const STAR_COLORS = ['#ffffff', '#9fd8ff', '#6fc3e8', '#ffe9c4'];

function hashId(id) {
  let h = 0;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const SATELLITES = [
  { inc: 38, spdLon: 0.011, spdLat: 0.0016, phase: 0 },
  { inc: 62, spdLon: -0.008, spdLat: 0.0011, phase: 140 },
  { inc: 20, spdLon: 0.016, spdLat: 0.0021, phase: 260 },
];

export class Globe {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.buf = document.createElement('canvas');
    this.bctx = this.buf.getContext('2d');
    this.scene = document.createElement('canvas');
    this.sctx = this.scene.getContext('2d');

    this.rot = [-15, -30];
    this.zoom = 1;
    this.minZoom = 0.85;
    this.maxZoom = 80;

    this.countries = [];
    this.byId = new Map();
    this.cities = [];         // platt lista {n, ll, p, c, country, tier}
    this.routes = [];         // {interp, mid, color, dur, phase, intl}
    this.claims = {};
    this.selectedId = null;
    this.autoRotate = false;
    this.onSelect = null;

    this.showCities = true;
    this.showTrade = true;

    this.sceneDirty = true;
    this.anim = null;
    this.pixelSize = 3;

    this.proj = d3.geoOrthographic().clipAngle(90);
    this.mpath = d3.geoPath(this.proj);
    this.grat = d3.geoGraticule10();
    this.stars = [];
    this._labels = [];        // {x, y, text, kind} i buffertkoordinater (byggs per scen)
    this._visCities = [];     // städer synliga i senaste scenen {x, y, city}

    this._pointers = new Map();
    this._pinchDist = 0;
    this._down = null;

    this._bindInput();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    requestAnimationFrame((t) => this._frame(t));
  }

  // ---------- publikt API ----------
  setCountries(list) {
    this.countries = list;
    this.byId = new Map(list.map((c) => [c.id, c]));
    this.sceneDirty = true;
  }

  getCountry(id) { return this.byId.get(id) || null; }

  setCities(byCountry) {
    this.cities = [];
    for (const [country, list] of Object.entries(byCountry)) {
      for (const c of list) {
        this.cities.push({
          ...c, country,
          tier: c.c ? 0 : (c.p >= 3e6 ? 0 : c.p >= 800e3 ? 1 : 2),
        });
      }
    }
    this.cities.sort((a, b) => b.p - a.p);
    this.sceneDirty = true;
  }

  // routes: {a, b, kind: 'road'|'rail'|'land'|'sea'|'air', color, dur, phase, intl}
  setRoutes(routes) {
    this.routes = routes.map((r) => ({
      ...r,
      interp: d3.geoInterpolate(r.a, r.b),
      mid: d3.geoInterpolate(r.a, r.b)(0.5),
    }));
    this.refreshRouteLines();
  }

  // bygger MultiLineString per ruttyp så hela nätet ritas med ett fåtal path-anrop
  refreshRouteLines() {
    const byKind = {};
    for (const r of this.routes) {
      (byKind[r.kind || 'road'] ||= []).push([r.a, r.b]);
    }
    this._routeLines = {};
    for (const [kind, coords] of Object.entries(byKind)) {
      this._routeLines[kind] = { type: 'MultiLineString', coordinates: coords };
    }
    this.sceneDirty = true;
  }

  // vilket land ligger en lon/lat i? (används också för sjöruttklassning)
  countryAtLL(ll) {
    const [lon, lat] = ll;
    const e = 0.2;
    for (const c of this.countries) {
      const [[x0, y0], [x1, y1]] = c.bounds;
      if (lat < y0 - e || lat > y1 + e) continue;
      const lonIn = x0 <= x1
        ? (lon >= x0 - e && lon <= x1 + e)
        : (lon >= x0 - e || lon <= x1 + e);
      if (!lonIn) continue;
      if (d3.geoContains(c.feature, ll)) return c;
    }
    return null;
  }

  setClaims(claims) { this.claims = claims || {}; this.sceneDirty = true; }
  select(id) { this.selectedId = id; this.sceneDirty = true; }
  setArmy(army) { this.army = army; } // {ll:[lon,lat], comp:{INF,TANK,FLYG}, color} | null

  // marscherande AI-arméer: {fromLL, toLL, start, dur, color, name, units}
  setMovingArmies(list) {
    this.movingArmies = (list || []).map((m) => ({ ...m, interp: d3.geoInterpolate(m.fromLL, m.toLL) }));
  }
  setShowCities(on) { this.showCities = on; this.sceneDirty = true; }
  setShowTrade(on) { this.showTrade = on; }

  animateTo(lonlat, zoom, dur = 1600, cb = null) {
    const from = [this.rot[0], this.rot[1], this.zoom];
    let tl = -lonlat[0];
    const dl = ((tl - from[0] + 540) % 360) - 180;
    tl = from[0] + dl;
    const tp = Math.max(-89, Math.min(89, -lonlat[1]));
    this.anim = { from, to: [tl, tp, zoom], t0: null, dur, cb };
  }

  // ---------- geometri ----------
  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.pixelSize = Math.max(2, Math.floor(Math.min(w, h) / 220));
    this.buf.width = Math.max(96, Math.ceil(w / this.pixelSize));
    this.buf.height = Math.max(96, Math.ceil(h / this.pixelSize));
    this.scene.width = this.buf.width;
    this.scene.height = this.buf.height;
    this.spath = d3.geoPath(this.proj, this.sctx);
    this.bpath = d3.geoPath(this.proj, this.bctx);
    this._makeStars();
    this._applyProjection();
  }

  _applyProjection() {
    const r = Math.min(this.buf.width, this.buf.height) / 2 - 4;
    this.proj
      .rotate([this.rot[0], this.rot[1], 0])
      .scale(Math.max(10, r * this.zoom))
      .translate([this.buf.width / 2, this.buf.height / 2]);
    this.sceneDirty = true;
  }

  _makeStars() {
    this.stars = [];
    const n = Math.round((this.buf.width * this.buf.height) / 900);
    for (let i = 0; i < n; i++) {
      this.stars.push({
        x: Math.floor(Math.random() * this.buf.width),
        y: Math.floor(Math.random() * this.buf.height),
        s: Math.random() < 0.12 ? 2 : 1,
        c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }
  }

  _viewCenter() { return [-this.rot[0], -this.rot[1]]; }

  _front(ll, slack = 1.45) { return d3.geoDistance(ll, this._viewCenter()) < slack; }

  _project(ll) {
    if (!this._front(ll, 1.55)) return null;
    return this.proj(ll);
  }

  _zoomBy(f) {
    this.anim = null;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * f));
    this._applyProjection();
  }

  _rotateByPx(dx, dy) {
    this.anim = null;
    const k = 57 / this.proj.scale();
    this.rot[0] += dx * k;
    this.rot[1] = Math.max(-89, Math.min(89, this.rot[1] - dy * k));
    this._applyProjection();
  }

  pickAt(screenX, screenY) {
    const bx = screenX / this.pixelSize;
    const by = screenY / this.pixelSize;
    const ll = this.proj.invert([bx, by]);
    if (!ll || !isFinite(ll[0]) || !isFinite(ll[1])) return null;
    const rp = this.proj(ll);
    if (!rp || Math.hypot(rp[0] - bx, rp[1] - by) > 1.5) return null;
    return this.countryAtLL(ll);
  }

  // ---------- input ----------
  _bindInput() {
    const cv = this.canvas;
    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId);
      this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this._pointers.size === 1) {
        this._down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
      } else if (this._pointers.size === 2) {
        const [a, b] = [...this._pointers.values()];
        this._pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
        this._down = null;
      }
    });
    cv.addEventListener('pointermove', (e) => {
      const p = this._pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (this._pointers.size === 1) {
        if (this._down) this._down.moved += Math.abs(dx) + Math.abs(dy);
        this._rotateByPx(dx / this.pixelSize, dy / this.pixelSize);
      } else if (this._pointers.size === 2) {
        const [a, b] = [...this._pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (this._pinchDist > 0) this._zoomBy(d / this._pinchDist);
        this._pinchDist = d;
      }
    });
    const up = (e) => {
      this._pointers.delete(e.pointerId);
      if (this._pointers.size < 2) this._pinchDist = 0;
      if (this._down && this._pointers.size === 0) {
        const dt = performance.now() - this._down.t;
        if (this._down.moved < 10 && dt < 600) {
          const rect = cv.getBoundingClientRect();
          const px = e.clientX - rect.left, py = e.clientY - rect.top;
          // marscherande arméer har klickprioritet (genskjutning)
          const hit = (this._movingHits || []).find((h) => Math.hypot(h.x - px, h.y - py) < 16);
          if (hit && this.onSelectArmy) {
            this.onSelectArmy(hit.m);
          } else {
            const c = this.pickAt(px, py);
            this.select(c ? c.id : null);
            this.onSelect?.(c);
          }
        }
        this._down = null;
      }
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      this._zoomBy(Math.exp(-e.deltaY * 0.0012));
    }, { passive: false });
  }

  // ---------- rendering ----------
  _frame(t) {
    if (this.anim) {
      if (this.anim.t0 == null) this.anim.t0 = t;
      const a = this.anim;
      const k = easeInOut(Math.min(1, (t - a.t0) / a.dur));
      this.rot[0] = a.from[0] + (a.to[0] - a.from[0]) * k;
      this.rot[1] = a.from[1] + (a.to[1] - a.from[1]) * k;
      this.zoom = a.from[2] + (a.to[2] - a.from[2]) * k;
      this._applyProjection();
      if (k >= 1) { const cb = a.cb; this.anim = null; cb?.(); }
    } else if (this.autoRotate && this._pointers.size === 0) {
      this.rot[0] += 0.045;
      this._applyProjection();
    }

    if (this.sceneDirty) { this._renderScene(); this.sceneDirty = false; }

    const b = this.bctx;
    b.clearRect(0, 0, this.buf.width, this.buf.height);
    b.drawImage(this.scene, 0, 0);

    if (this.showTrade && this.routes.length) this._drawTrade(b, t);
    if (this.showCities) this._drawCityLife(b, t);
    this._drawSatellites(b, t);

    if (this.selectedId) {
      const c = this.byId.get(this.selectedId);
      if (c) {
        const pulse = 0.35 + 0.3 * Math.sin(t / 180);
        b.beginPath();
        this.bpath(c.feature);
        b.fillStyle = `rgba(255,176,46,${0.18 + 0.12 * Math.sin(t / 180)})`;
        b.fill();
        b.strokeStyle = `rgba(255,176,46,${0.6 + pulse * 0.4})`;
        b.lineWidth = 1.2;
        b.stroke();
      }
    }

    const x = this.ctx;
    x.imageSmoothingEnabled = false;
    x.clearRect(0, 0, this.canvas.width, this.canvas.height);
    x.drawImage(this.buf, 0, 0, this.buf.width, this.buf.height, 0, 0, this.canvas.width, this.canvas.height);

    this._drawLabels(x);
    if (this.army) this._drawArmy(x, t);
    this._drawMovingArmies(x, t);

    requestAnimationFrame((tt) => this._frame(tt));
  }

  // marscherande arméer: färgad markör som rör sig längs storcirkeln
  _drawMovingArmies(x, t) {
    this._movingHits = [];
    const ps = this.pixelSize;
    for (const m of this.movingArmies || []) {
      const k = Math.max(0, Math.min(1, (performance.now() - m.start) / m.dur));
      const ll = m.interp(k);
      if (!this._front(ll, 1.5)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      const sx = p[0] * ps, sy = p[1] * ps;
      // riktningsstreck mot målet
      const p2 = this.proj(m.interp(Math.min(1, k + 0.06)));
      if (p2) {
        x.strokeStyle = 'rgba(255,255,255,0.35)';
        x.lineWidth = 1;
        x.beginPath(); x.moveTo(sx, sy); x.lineTo(p2[0] * ps, p2[1] * ps); x.stroke();
      }
      x.fillStyle = '#10151c';
      x.fillRect(sx - 6, sy - 6, 12, 12);
      x.fillStyle = m.color;
      x.fillRect(sx - 4, sy - 4, 8, 8);
      if (Math.floor(t / 400) % 2 === 0) {
        x.font = '10px monospace';
        x.textAlign = 'center';
        x.fillText('\u{2694}', sx, sy - 10);
      }
      this._movingHits.push({ x: sx, y: sy, m });
    }
  }

  // Armémarkör: pulserande ring + banér som visar truppslag och antal
  _drawArmy(x, t) {
    const a = this.army;
    if (!this._front(a.ll, 1.5)) return;
    const p = this.proj(a.ll);
    if (!p) return;
    const ps = this.pixelSize;
    const sx = p[0] * ps, sy = p[1] * ps;

    const pulse = 5 + 2.5 * Math.sin(t / 260);
    x.beginPath();
    x.arc(sx, sy, pulse + 4, 0, Math.PI * 2);
    x.strokeStyle = `rgba(255,79,79,${0.55 + 0.3 * Math.sin(t / 260)})`;
    x.lineWidth = 2;
    x.stroke();
    x.fillStyle = a.color;
    x.fillRect(sx - 3, sy - 3, 6, 6);

    // banér ovanför
    const parts = Object.entries(a.comp).filter(([, n]) => n > 0);
    const w = parts.length * 48 + 10;
    const bx = sx - w / 2, by = sy - 54;
    x.fillStyle = 'rgba(6,12,20,0.92)';
    x.fillRect(bx, by, w, 32);
    x.strokeStyle = a.color;
    x.lineWidth = 2;
    x.strokeRect(bx, by, w, 32);
    x.beginPath(); x.moveTo(sx, by + 32); x.lineTo(sx, sy - 8); x.strokeStyle = a.color; x.stroke();
    let ox = bx + 5;
    for (const [type, n] of parts) {
      drawUnit(x, type, a.color, ox, by + 6, 1.5, 1);
      x.font = '9px "Press Start 2P", monospace';
      x.textAlign = 'left';
      x.textBaseline = 'middle';
      x.fillStyle = '#fff';
      x.fillText(String(n), ox + 28, by + 17);
      ox += 48;
    }
  }

  // Flödande resurspartiklar längs handelsrutterna ("fram och tillbaka")
  // Vid utzoomad vy visas bara internationella rutter — inrikesrutterna dyker
  // upp när man zoomar in, annars dränks kartan i partiklar.
  _drawTrade(b, t) {
    const showDomestic = this.zoom >= 1.8;
    for (const r of this.routes) {
      if ((r.kind === 'road' || r.kind === 'rail') && !showDomestic) continue;
      if (!this._front(r.mid, 1.9) && !this._front(r.a, 1.6) && !this._front(r.b, 1.6)) continue;
      const frac = ((t + r.phase) % r.dur) / r.dur;
      const positions = r.intl
        ? [[frac, 1], [1 - frac, 0.55]]   // internationella rutter: trafik åt båda håll
        : [[frac, 1]];
      for (const [f, alpha] of positions) {
        const ll = r.interp(f);
        if (!this._front(ll)) continue;
        const p = this.proj(ll);
        if (!p) continue;
        b.globalAlpha = alpha;
        b.fillStyle = r.kind === 'air' ? '#f2fbff' : r.color;
        b.fillRect(Math.round(p[0]), Math.round(p[1]), 1, 1);
        // liten svans
        const ll2 = r.interp(Math.max(0, Math.min(1, f - 0.025 * (r.intl && alpha < 1 ? -1 : 1))));
        const p2 = this._front(ll2) ? this.proj(ll2) : null;
        if (p2) { b.globalAlpha = alpha * 0.35; b.fillRect(Math.round(p2[0]), Math.round(p2[1]), 1, 1); }
      }
    }
    b.globalAlpha = 1;
  }

  // Blinkande stadsljus + radar-ping på någon storstad
  _drawCityLife(b, t) {
    const slot = Math.floor(t / 300);
    for (let i = 0; i < this._visCities.length; i++) {
      const v = this._visCities[i];
      if ((hashId(i + '' + slot) % 19) === 0) {
        b.fillStyle = v.city.c ? '#fff3c4' : '#e8fbff';
        b.fillRect(v.x, v.y, 1, 1);
      }
    }
    // ping-ripple: en slumpad synlig storstad var 3,6:e sekund
    if (this._visCities.length) {
      const cyc = 3600;
      const idx = hashId('ping' + Math.floor(t / cyc)) % this._visCities.length;
      const v = this._visCities[idx];
      const k = (t % cyc) / cyc;
      if (k < 0.4 && v.city.tier === 0) {
        b.beginPath();
        b.arc(v.x + 0.5, v.y + 0.5, 1 + k * 16, 0, Math.PI * 2);
        b.strokeStyle = `rgba(55,224,255,${0.5 * (1 - k / 0.4)})`;
        b.lineWidth = 1;
        b.stroke();
      }
    }
  }

  _drawSatellites(b, t) {
    for (const s of SATELLITES) {
      const lon = ((t * s.spdLon + s.phase) % 360 + 540) % 360 - 180;
      const lat = s.inc * Math.sin(t * s.spdLat + s.phase);
      const ll = [lon, lat];
      if (!this._front(ll, 1.35)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      const blink = Math.floor(t / 500) % 3 !== 0;
      b.fillStyle = blink ? '#ffffff' : '#39d7ff';
      b.fillRect(Math.round(p[0]), Math.round(p[1]) - 2, 1, 1); // strax "ovanför" ytan
    }
  }

  // Skarpa etiketter i skärmupplösning ovanpå den pixelerade globen
  _drawLabels(x) {
    if (!this._labels.length) return;
    const ps = this.pixelSize;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    for (const L of this._labels) {
      const sx = L.x * ps, sy = L.y * ps;
      if (L.kind === 'country') {
        x.font = '10px "Press Start 2P", monospace';
        x.lineWidth = 4;
        x.strokeStyle = 'rgba(2,10,16,0.9)';
        x.strokeText(L.text, sx, sy);
        x.fillStyle = L.claimed ? '#ffe9c4' : '#d8f4ff';
        x.fillText(L.text, sx, sy);
      } else {
        x.font = '8px "Press Start 2P", monospace';
        x.lineWidth = 3;
        x.strokeStyle = 'rgba(2,10,16,0.9)';
        x.strokeText(L.text, sx, sy - 6);
        x.fillStyle = L.capital ? '#ffd24f' : '#bfeaff';
        x.fillText(L.text, sx, sy - 6);
      }
    }
  }

  _renderScene() {
    const s = this.sctx;
    const W = this.scene.width, H = this.scene.height;
    s.fillStyle = SPACE;
    s.fillRect(0, 0, W, H);
    for (const st of this.stars) { s.fillStyle = st.c; s.fillRect(st.x, st.y, st.s, st.s); }

    s.beginPath(); this.spath({ type: 'Sphere' });
    s.fillStyle = OCEAN; s.fill();
    s.strokeStyle = 'rgba(57,215,255,0.22)'; s.lineWidth = 3; s.stroke();
    s.beginPath(); this.spath({ type: 'Sphere' });
    s.strokeStyle = RIM; s.lineWidth = 1; s.stroke();

    s.beginPath(); this.spath(this.grat);
    s.strokeStyle = 'rgba(45,140,170,0.20)'; s.lineWidth = 0.5; s.stroke();

    for (const c of this.countries) {
      const claim = this.claims[c.id];
      s.beginPath(); this.spath(c.feature);
      if (claim) {
        s.fillStyle = shade(claim.color, 0.45);
        s.fill();
        s.strokeStyle = claim.color; s.lineWidth = 1; s.stroke();
      } else {
        s.fillStyle = LAND_SHADES[hashId(c.id) % LAND_SHADES.length];
        s.fill();
        s.strokeStyle = BORDER; s.lineWidth = 0.55; s.stroke();
      }
    }

    // transportnätet: vägar, järnvägar, sjörutter, flygrutter
    if (this.showTrade && this._routeLines) {
      const L = this._routeLines;
      const domestic = this.zoom >= 1.8;
      const stroke = (geo, color, width, dash) => {
        if (!geo) return;
        s.beginPath();
        this.spath(geo);
        s.strokeStyle = color;
        s.lineWidth = width;
        s.setLineDash(dash || []);
        s.stroke();
        s.setLineDash([]);
      };
      if (domestic) {
        stroke(L.road, 'rgba(201,179,137,0.5)', 0.55);
        // järnväg: mörk banvall + ljusa "slipers" (tvåfärgad streckning)
        stroke(L.rail, '#39424e', 0.9);
        stroke(L.rail, '#c9d2dc', 0.5, [2, 2]);
      }
      stroke(L.land, 'rgba(201,179,137,0.35)', 0.5);
      stroke(L.sea, 'rgba(90,180,230,0.45)', 0.55, [3, 3]);
      stroke(L.air, 'rgba(232,246,255,0.20)', 0.5, [1, 3]);
    }

    // städer (prickar i scenen; ljus/blink sker i kompositpasset)
    this._visCities = [];
    if (this.showCities) {
      const maxTier = this.zoom < 1.6 ? 0 : this.zoom < 3 ? 1 : 2;
      for (const city of this.cities) {
        if (city.tier > maxTier && !city.c) continue;
        if (!this._front(city.ll, 1.5)) continue;
        const p = this.proj(city.ll);
        if (!p || p[0] < -4 || p[1] < -4 || p[0] > W + 4 || p[1] > H + 4) continue;
        const px = Math.round(p[0]), py = Math.round(p[1]);
        this._visCities.push({ x: px, y: py, city });
        if (city.c) {
          s.fillStyle = '#2a1a05';
          s.fillRect(px - 1, py - 1, 3, 3);
          s.fillStyle = '#ffd24f';
          s.fillRect(px, py, 1, 1);
        } else if (city.tier === 0) {
          s.fillStyle = '#0a2531';
          s.fillRect(px - 1, py - 1, 3, 3);
          s.fillStyle = '#ffe9a8';
          s.fillRect(px, py, 1, 1);
        } else {
          s.fillStyle = '#d8c98a';
          s.fillRect(px, py, 1, 1);
        }
      }
    }

    // etikettlistan (ritas skarpt i skärmupplösning i kompositpasset)
    this._labels = [];
    const entries = [];
    for (const c of this.countries) {
      const area = this.mpath.area(c.feature);
      if (area < 550) continue;
      const p = this.proj(c.centroid);
      if (!p) continue;
      const rp = this.proj(this.proj.invert(p));
      if (!rp || Math.hypot(rp[0] - p[0], rp[1] - p[1]) > 1.5) continue;
      entries.push({ area, x: p[0], y: p[1], text: c.name.toUpperCase(), kind: 'country', claimed: !!this.claims[c.id] });
    }
    entries.sort((a, b) => b.area - a.area);
    this._labels = entries.slice(0, 22);

    if (this.showCities && this.zoom >= 2.2) {
      let count = 0;
      for (const v of this._visCities) {
        if (count >= 28) break;
        if (v.city.tier === 2 && this.zoom < 5) continue;
        this._labels.push({ x: v.x, y: v.y, text: v.city.n.toUpperCase(), kind: 'city', capital: !!v.city.c });
        count++;
      }
    }
  }
}
