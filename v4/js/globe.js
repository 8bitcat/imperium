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

// Större bergskedjor som polylines (lon/lat) — ger terrängläget höjd och djup.
// snow = vita toppar, big = bredare massiv.
const MOUNTAIN_RANGES = [
  { pts: [[-72, -40], [-70, -33], [-68, -27], [-66, -20], [-70, -14], [-75, -9], [-78, -2], [-77, 4]], snow: true, big: true },  // Anderna
  { pts: [[-114, 49], [-111, 44], [-107, 39], [-105, 35]], snow: true, big: true },   // Klippiga bergen
  { pts: [[-152, 63], [-146, 62], [-141, 61]], snow: true },                          // Alaska Range
  { pts: [[-106, 28], [-103, 23], [-99, 19]] },                                       // Sierra Madre
  { pts: [[-79, 36], [-76, 39], [-73, 43]] },                                         // Appalacherna
  { pts: [[7, 60], [12, 64], [16, 67], [20, 69]], snow: true },                       // Skanderna
  { pts: [[6, 45.5], [8, 46], [10, 46.5], [13, 47]], snow: true, big: true },         // Alperna
  { pts: [[-1, 42.8], [1, 42.6]] },                                                   // Pyrenéerna
  { pts: [[22, 49], [25, 47.5], [26, 46]] },                                          // Karpaterna
  { pts: [[16, 44], [19, 43], [21, 42]] },                                            // Dinariderna
  { pts: [[41, 43.5], [44, 43], [47, 42.5]], snow: true },                            // Kaukasus
  { pts: [[59, 66], [59, 61], [58, 56], [59, 52]] },                                  // Ural
  { pts: [[30, 37.5], [34, 37.5], [38, 38.5]] },                                      // Taurus/Anatolien
  { pts: [[45, 37], [48, 34], [51, 31], [54, 29]] },                                  // Zagros
  { pts: [[65, 36], [68, 35.5], [71, 36]], snow: true },                              // Hindukush
  { pts: [[74, 35], [78, 33], [82, 29.5], [86, 28.5], [90, 28], [95, 29]], snow: true, big: true }, // Himalaya
  { pts: [[80, 32], [84, 33], [88, 32], [92, 32]], snow: true, big: true },           // Tibetanska platån
  { pts: [[72, 42], [76, 42], [80, 42.5], [84, 43]], snow: true },                    // Tien Shan
  { pts: [[86, 49], [90, 48.5], [94, 48]] },                                          // Altai
  { pts: [[128, 66], [132, 64], [136, 62]] },                                         // Verchojansk
  { pts: [[158, 54], [160, 56]] },                                                    // Kamtjatka
  { pts: [[137.5, 36], [138.5, 35.2]] },                                              // Japanska alperna
  { pts: [[-7, 31], [-4, 32.5], [0, 34], [5, 35.5]] },                                // Atlas
  { pts: [[37, 8], [39, 10], [38, 12]] },                                             // Etiopiska höglandet
  { pts: [[35, -3], [33, -8]] },                                                      // Östafrikanska riften
  { pts: [[28, -30], [29.5, -28.5]] },                                                // Drakensberg
  { pts: [[148, -37], [150, -33], [152, -28]] },                                      // Great Dividing Range
  { pts: [[138, -4], [142, -5], [145, -6]] },                                         // Nya Guineas högland
  { pts: [[168, -45], [170.5, -43.5]], snow: true },                                  // Sydalperna NZ
  { pts: [[-44, -20], [-42, -22]] },                                                  // Brasilianska höglandet
];

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
          tier: c.tier ?? (c.c ? 0 : (c.p >= 3e6 ? 0 : c.p >= 800e3 ? 1 : 2)),
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

  setClaims(claims) { this.claims = claims || {}; this._rebuildBorderMesh(); this.sceneDirty = true; }

  // cid → namn som ska visas i stället för landets eget (erövrade provinser)
  setLabelOverride(map) {
    const sig = JSON.stringify(map || {});
    if (sig === this._lblSig) return;
    this._lblSig = sig;
    this.labelOverride = map || {};
    this.sceneDirty = true;
  }

  setTopology(topo) {
    this.topology = topo;
    this._meshSig = null;
    this._buildNeighbors();
    this._rebuildBorderMesh();
    this.sceneDirty = true;
  }

  // vilka länder delar landgräns? (topojson.neighbors, byggs en gång per karta)
  _buildNeighbors() {
    this.neighbors = {};
    if (!this.topology || typeof topojson === 'undefined') return;
    const geoms = this.topology.objects.countries.geometries;
    const ids = geoms.map((g) => String(g.id ?? g.properties?.name ?? ''));
    const nb = topojson.neighbors(geoms);
    ids.forEach((id, i) => {
      if (!id) return;
      this.neighbors[id] = new Set((nb[i] || []).map((j) => ids[j]).filter(Boolean));
    });
  }

  // gränsar landet till något av dessa länder?
  bordersAny(cid, others) {
    const set = this.neighbors?.[cid];
    if (!set) return false;
    for (const o of others) if (set.has(o)) return true;
    return false;
  }

  // Gränser mellan länder med SAMMA ägare suddas ut — riket blir ett enda område.
  // Basmeshen innehåller kuster + gränser mellan olika ägare; per ägare byggs en
  // yttre kontur som ritas i ägarens färg. Meshbygget är dyrt — signaturkontrollen
  // ser till att det bara sker när ägandet faktiskt ändrats, inte varje AI-tick.
  _rebuildBorderMesh() {
    if (!this.topology || typeof topojson === 'undefined') {
      this._borderMesh = null;
      this._ownerMeshes = [];
      return;
    }
    const sig = Object.entries(this.claims).map(([k, v]) => k + ':' + v.color).sort().join(',');
    if (sig === this._meshSig) return;
    this._meshSig = sig;
    this._borderMesh = null;
    this._ownerMeshes = [];
    const obj = this.topology.objects.countries;
    const owner = (g) => {
      // samma id-härledning som data.js — vissa länder (Kosovo m.fl.) saknar id och identifieras via namn
      const id = String(g.id ?? g.properties?.name ?? '');
      return this.claims[id]?.color || 'free:' + id;
    };
    this._borderMesh = topojson.mesh(this.topology, obj, (a, b) => a === b || owner(a) !== owner(b));
    const colors = [...new Set(Object.values(this.claims).map((c) => c.color))];
    for (const col of colors) {
      const mine = (g) => owner(g) === col;
      const geoms = obj.geometries.filter(mine);
      this._ownerMeshes.push({
        color: col,
        mesh: topojson.mesh(this.topology, obj, (a, b) => (a === b ? mine(a) : mine(a) !== mine(b))),
        // rikets landmassa som EN yta — då finns ingen söm mellan provinserna
        fill: geoms.length ? topojson.merge(this.topology, geoms) : null,
        ids: geoms.map((g) => String(g.id ?? g.properties?.name ?? '')),
      });
    }
  }
  select(id) { this.selectedId = id; this.sceneDirty = true; }
  setArmy(army) { this.army = army; } // {ll:[lon,lat], comp:{INF,TANK,FLYG}, color} | null

  // marscherande AI-arméer: {fromLL, toLL, start, dur, color, name, units, a2}
  setMovingArmies(list) {
    this.movingArmies = (list || []).map((m) => ({ ...m, interp: d3.geoInterpolate(m.fromLL, m.toLL) }));
  }

  setGarrisons(list) { this.garrisons = list || []; }
  setGarrison(g) { this.garrisons = g ? [g] : []; } // bakåtkompatibelt
  setCountryArmies(list) { this.countryArmies = list || []; }
  setWarZones(list) { this.warZones = list || []; } // {ll} — krigsrök över anfallna länder
  setPlayerLaunch(ll) { this.playerLaunch = ll; } // spelarens ramp när rymdforskning finns
  setSatCoverage(c) { this.satCov = c; } // {center, ang (rad), tier 0-5} — satellitforskningen
  setSpaceNations(list) { this.spaceNations = list || []; } // AI-länder med rymdprogram

  // fyrverkerier över en punkt (valsegrar, rikesutrop)
  addFireworks(ll, durMs = 6000) {
    (this._fireworks ||= []).push({ ll, until: performance.now() + durMs, born: performance.now() });
  }

  // Årstider: snötäcket vandrar med kalendern (1 spelår = 120 dagar, dag 0 = midvinter)
  setDayFloat(f) {
    this.dayFloat = f;
    const YEAR = 120;
    const phase = ((f % YEAR) + YEAR) % YEAR / YEAR;
    const wN = 0.5 + 0.5 * Math.cos(phase * Math.PI * 2); // 1 = midvinter i norr
    const snowN = 68 - 26 * wN;
    const snowS = -68 + 26 * (1 - wN);
    if (this._snowN == null || Math.abs(snowN - this._snowN) > 0.75) {
      this._snowN = snowN;
      this._snowS = snowS;
      this.sceneDirty = true;
    }
  }

  _flagImg(a2) {
    if (!a2) return null;
    this._flags ||= {};
    if (!this._flags[a2]) {
      const img = new Image();
      img.src = `https://flagcdn.com/w20/${a2.toLowerCase()}.png`;
      this._flags[a2] = img;
    }
    const img = this._flags[a2];
    return img.complete && img.naturalWidth ? img : null;
  }
  setShowCities(on) { this.showCities = on; this.sceneDirty = true; }
  setShowTrade(on) { this.showTrade = on; }
  setShowTerrain(on) { this.showTerrain = on; this.sceneDirty = true; }
  setTerrainColors(map) { this.terrainColors = map || {}; this.sceneDirty = true; } // cid → naturfärg
  setResourceMarkers(list) { this.resourceMarkers = list || []; } // {ll, icons} — tillgångar på kartan

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
          // egen armé har högsta klickprioritet (välj armé → genskjut)
          const ah = this._armyHit;
          const hit = (this._movingHits || []).find((h) => Math.hypot(h.x - px, h.y - py) < 16);
          if (ah && !hit && Math.hypot(ah.x - px, ah.y - py) < 18 && this.onSelectOwnArmy) {
            this.onSelectOwnArmy();
          } else if (hit && this.onSelectArmy) {
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

    this._drawWarSmoke(b, t);
    this._drawClouds(b, t);
    this._drawNight(b);
    this._drawAurora(b, t);
    this._drawShootingStars(b, t);
    this._drawMoon(b, t);
    this._drawLightning(b, t);
    this._drawShipLights(b, t);
    this._drawRockets(b, t);
    this._drawFireworks(b, t);
    this._drawSatCoverage(b, t);
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
    if (this.resourceMarkers?.length) this._drawResourceMarkers(x);
    this._armyHit = null;
    if (this.army) this._drawArmy(x, t);
    if (this.garrisons?.length) this._drawGarrisons(x, t);
    this._drawCountryArmies(x);
    this._drawMovingArmies(x, t);

    requestAnimationFrame((tt) => this._frame(tt));
  }

  // garnisoner: banér med landets flagga + enhet + antal vid huvudstaden
  _drawGarrisons(x, t) {
    const ps = this.pixelSize;
    for (const g of this.garrisons) {
      if (!this._front(g.ll, 1.5)) continue;
      const p = this.proj(g.ll);
      if (!p) continue;
      const sx = p[0] * ps, sy = p[1] * ps + 18;
      const n = Object.values(g.comp).reduce((a, b) => a + b, 0);
      const w = 52, h = 18;
      x.fillStyle = 'rgba(10,16,24,0.92)';
      x.fillRect(sx - w / 2, sy - h / 2, w, h);
      x.strokeStyle = g.color;
      x.lineWidth = 1;
      x.strokeRect(sx - w / 2, sy - h / 2, w, h);
      const flag = this._flagImg(g.a2);
      if (flag) {
        x.imageSmoothingEnabled = false;
        x.drawImage(flag, sx - w / 2 + 3, sy - 4, 12, 8);
      }
      drawUnit(x, 'INF', g.color, sx - w / 2 + 18, sy - 7, 1, 1);
      x.font = '8px "Press Start 2P", monospace';
      x.textAlign = 'left';
      x.textBaseline = 'middle';
      x.fillStyle = '#fff';
      x.fillText(`\u{1F3E0}${n}`, sx + 4, sy + 1);
    }
  }

  // Ritar en armés sammansättning: en liten figur + antal per truppslag,
  // så man ser om det är infanteri, pansar eller flyg — inte bara en siffra.
  _drawComp(x, comp, color, sx, sy) {
    const parts = ['INF', 'TANK', 'FLYG'].filter((t) => (comp?.[t] || 0) > 0);
    let ox = sx;
    x.font = '7px "Press Start 2P", monospace';
    x.textAlign = 'left';
    x.textBaseline = 'middle';
    for (const t of parts) {
      drawUnit(x, t, color, ox, sy - 6, 0.85, 1);
      x.fillStyle = '#fff';
      x.fillText(String(comp[t]), ox + 13, sy + 1);
      ox += 13 + String(comp[t]).length * 7 + 4;
    }
    return ox - sx;
  }

  _compWidth(comp) {
    const parts = ['INF', 'TANK', 'FLYG'].filter((t) => (comp?.[t] || 0) > 0);
    return parts.reduce((w, t) => w + 13 + String(comp[t]).length * 7 + 4, 0);
  }

  // stående arméer i kända länder: flagga + vilka truppslag som står där
  _drawCountryArmies(x) {
    if (this.zoom < 1.2) return;
    const ps = this.pixelSize;
    for (const a of this.countryArmies || []) {
      if (!this._front(a.ll, 1.5)) continue;
      const p = this.proj(a.ll);
      if (!p) continue;
      // utan spionage T4 syns ingen sammansättning — bara en figur och antal (eller ?)
      const comp = a.comp;
      const w = comp ? Math.max(34, 20 + this._compWidth(comp)) : 40;
      const sx = p[0] * ps, sy = p[1] * ps - 14;
      x.fillStyle = 'rgba(10,16,24,0.92)';
      x.fillRect(sx - w / 2, sy - 9, w, 18);
      x.strokeStyle = a.color;
      x.lineWidth = 1;
      x.strokeRect(sx - w / 2, sy - 9, w, 18);
      const flag = this._flagImg(a.a2);
      x.font = '8px "Press Start 2P", monospace';
      x.textAlign = 'left';
      x.textBaseline = 'middle';
      if (flag) {
        x.imageSmoothingEnabled = false;
        x.drawImage(flag, sx - w / 2 + 3, sy - 4, 12, 8);
      } else {
        x.fillStyle = '#8a97a5';
        x.fillText('?', sx - w / 2 + 6, sy + 1);
      }
      if (comp) {
        this._drawComp(x, comp, a.color, sx - w / 2 + 18, sy);
      } else {
        drawUnit(x, 'INF', a.color, sx - w / 2 + 18, sy - 6, 0.85, 1);
        x.fillStyle = '#fff';
        x.fillText(a.n == null ? '?' : String(a.n), sx - w / 2 + 31, sy + 1);
      }
    }
  }

  // marscherande arméer: banér med landets FLAGGA + armébild + antal
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
      const mcomp = m.comp || (m.units || []).reduce((a, u) => (a[u.type] = (a[u.type] || 0) + 1, a), {});
      const w = Math.max(52, 24 + this._compWidth(mcomp)), h = 20;
      x.fillStyle = '#10151c';
      x.fillRect(sx - w / 2 - 1, sy - h / 2 - 1, w + 2, h + 2);
      x.fillStyle = 'rgba(10,16,24,0.95)';
      x.fillRect(sx - w / 2, sy - h / 2, w, h);
      x.strokeStyle = m.color;
      x.lineWidth = 2;
      x.strokeRect(sx - w / 2, sy - h / 2, w, h);
      const flag = this._flagImg(m.a2);
      if (flag) {
        x.imageSmoothingEnabled = false;
        x.drawImage(flag, sx - w / 2 + 3, sy - 5, 15, 10);
      } else if (m.intel && !m.intel.nat) {
        // okänd nationalitet utan spionage T2
        x.font = '9px "Press Start 2P", monospace';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillStyle = '#8a97a5';
        x.fillText('?', sx - w / 2 + 10, sy + 1);
      }
      // med spionage T4 syns exakt sammansättning, annars bara antal (eller ?)
      if (!m.intel || m.intel.comp) {
        this._drawComp(x, mcomp, m.color, sx - w / 2 + 21, sy);
      } else {
        drawUnit(x, 'INF', m.color, sx - w / 2 + 21, sy - 7, 1, 1);
        x.font = '9px "Press Start 2P", monospace';
        x.textAlign = 'left';
        x.textBaseline = 'middle';
        x.fillStyle = '#fff';
        x.fillText(m.intel.num ? String(m.units?.length ?? '') : '?', sx - w / 2 + 36, sy + 1);
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

    this._armyHit = { x: sx, y: sy };
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
    if (a.warn) {
      const blink = Math.floor(t / 350) % 2 === 0;
      x.font = '8px "Press Start 2P", monospace';
      x.textAlign = 'center';
      x.fillStyle = blink ? '#ff4f4f' : '#7a2020';
      x.fillText('\u{26A0} LOGISTIK!', sx, by - 8);
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
        const dir = r.intl && alpha < 1 ? -1 : 1;
        if (r.kind === 'air') {
          // contrail: avtagande kondensstrimma bakom planet
          for (let j = 1; j <= 4; j++) {
            const llc = r.interp(Math.max(0, Math.min(1, f - 0.016 * j * dir)));
            const pc = this._front(llc) ? this.proj(llc) : null;
            if (!pc) break;
            b.globalAlpha = alpha * 0.5 * (1 - j / 5);
            b.fillStyle = '#dff4ff';
            b.fillRect(Math.round(pc[0]), Math.round(pc[1]), 1, 1);
          }
        } else {
          // liten svans
          const ll2 = r.interp(Math.max(0, Math.min(1, f - 0.025 * dir)));
          const p2 = this._front(ll2) ? this.proj(ll2) : null;
          if (p2) { b.globalAlpha = alpha * 0.35; b.fillRect(Math.round(p2[0]), Math.round(p2[1]), 1, 1); }
        }
      }
    }
    b.globalAlpha = 1;
  }

  // Dag & natt: solen vandrar runt globen med speltiden — natthalvan mörknar
  _drawNight(b) {
    if (this.dayFloat == null) return;
    const SUN_LAP_DAYS = 10; // ett soldygn = 10 speldagar (~20 sek)
    const sunLon = -((this.dayFloat / SUN_LAP_DAYS) % 1) * 360 + 180;
    this._sun = [sunLon, 0];
    const center = this._viewCenter();
    const cp = this.proj(center);
    if (!cp) return;
    const toward = d3.geoInterpolate(center, this._sun)(0.12);
    const tp = this.proj(toward);
    if (!tp) return;
    let dx = cp[0] - tp[0], dy = cp[1] - tp[1]; // bort från solen
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const R = this.proj.scale();
    const lit = Math.cos(d3.geoDistance(center, this._sun)); // 1 = mitt på dagen
    const off = -lit * R;
    const g = b.createLinearGradient(
      cp[0] + dx * (off - R * 0.45), cp[1] + dy * (off - R * 0.45),
      cp[0] + dx * (off + R * 0.45), cp[1] + dy * (off + R * 0.45));
    g.addColorStop(0, 'rgba(1,4,12,0)');
    g.addColorStop(1, 'rgba(1,4,12,0.66)');
    b.save();
    b.beginPath();
    b.arc(cp[0], cp[1], R + 2, 0, Math.PI * 2);
    b.clip();
    b.fillStyle = g;
    b.fillRect(0, 0, this.buf.width, this.buf.height);
    // sol-glint: varmt sken där solen träffar klotet
    if (this._front(this._sun, 1.4)) {
      const sp = this.proj(this._sun);
      if (sp) {
        const g2 = b.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], R * 0.5);
        g2.addColorStop(0, 'rgba(255,238,190,0.20)');
        g2.addColorStop(1, 'rgba(255,238,190,0)');
        b.fillStyle = g2;
        b.fillRect(0, 0, this.buf.width, this.buf.height);
      }
    }
    b.restore();
  }

  _isNight(ll) {
    return this._sun ? Math.cos(d3.geoDistance(ll, this._sun)) < -0.03 : false;
  }

  // Drivande pixelmoln som sakta vandrar västerut över klotet
  _drawClouds(b, t) {
    if (!this._clouds) {
      this._clouds = [];
      for (let i = 0; i < 26; i++) {
        const h = hashId('cl' + i);
        const blobs = [];
        const nb = 4 + (h % 4);
        for (let j = 0; j < nb; j++) {
          const hj = hashId('cb' + i + '_' + j);
          blobs.push([(hj % 7) - 3, ((hj >> 3) % 3) - 1, 1 + ((hj >> 5) % 2)]);
        }
        this._clouds.push({
          lat: ((h % 120) - 60) * 0.9,
          lon0: (h >> 2) % 360,
          spd: 0.00025 + ((h >> 4) % 10) * 0.00004,
          blobs,
        });
      }
    }
    for (const c of this._clouds) {
      const lon = ((c.lon0 - t * c.spd) % 360 + 540) % 360 - 180;
      const ll = [lon, c.lat];
      if (!this._front(ll)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      const night = this._isNight(ll);
      b.globalAlpha = night ? 0.18 : 0.45;
      b.fillStyle = '#f2f8ff';
      for (const [dx, dy, w] of c.blobs) b.fillRect(Math.round(p[0]) + dx, Math.round(p[1]) + dy, w + 1, 1);
    }
    b.globalAlpha = 1;
  }

  // Norrsken & sydsken: vajande gröna band på natthalvans höga breddgrader
  _drawAurora(b, t) {
    if (this.dayFloat == null) return;
    for (const baseLat of [67, -65]) {
      for (let lon = -180; lon < 180; lon += 3) {
        const lat = baseLat + 3.5 * Math.sin(lon * 0.09 + t / 1100) + 1.5 * Math.sin(lon * 0.23 - t / 700);
        const ll = [lon, lat];
        if (!this._front(ll) || !this._isNight(ll)) continue;
        const p = this.proj(ll);
        if (!p) continue;
        const a = 0.3 + 0.25 * (0.5 + 0.5 * Math.sin(lon * 0.4 + t / 480));
        b.globalAlpha = a;
        b.fillStyle = (lon / 3 | 0) % 5 === 0 ? '#b48cff' : '#59ffa8';
        b.fillRect(Math.round(p[0]), Math.round(p[1]), 1, 3);
        b.globalAlpha = a * 0.4;
        b.fillRect(Math.round(p[0]), Math.round(p[1]) - 2, 1, 2);
      }
    }
    b.globalAlpha = 1;
  }

  // Stjärnfall i rymden runt klotet, ungefär var 7:e sekund
  _drawShootingStars(b, t) {
    const cyc = 7200, life = 750;
    const idx = Math.floor(t / cyc);
    const k = (t % cyc) / life;
    if (k > 1) return;
    const h = hashId('ss' + idx);
    const W = this.buf.width, H = this.buf.height;
    const [cx, cy] = this.proj.translate();
    const R = this.proj.scale();
    const x0 = h % W, y0 = (h >> 4) % Math.max(20, H >> 2);
    const dx = 1 + ((h >> 7) % 2), dy = 0.5 + ((h >> 9) % 2) * 0.4;
    for (let i = 0; i < 5; i++) {
      const px = x0 + (k * 34 - i * 2.2) * dx, py = y0 + (k * 34 - i * 2.2) * dy;
      if (Math.hypot(px - cx, py - cy) < R + 5) continue; // aldrig framför klotet
      b.globalAlpha = (1 - k) * (1 - i / 5);
      b.fillStyle = i === 0 ? '#ffffff' : '#bfe8ff';
      b.fillRect(Math.round(px), Math.round(py), 1, 1);
    }
    b.globalAlpha = 1;
  }

  // Månen kretsar sakta runt klotet ute i rymden
  _drawMoon(b, t) {
    const [cx, cy] = this.proj.translate();
    const R = this.proj.scale();
    const ang = t / 42000;
    const mx = cx + Math.cos(ang) * (R + 13), my = cy + Math.sin(ang) * (R + 13) * 0.92;
    if (mx < 2 || my < 2 || mx > this.buf.width - 2 || my > this.buf.height - 2) return;
    b.fillStyle = '#d8d8cf';
    b.fillRect(Math.round(mx) - 1, Math.round(my) - 2, 3, 1);
    b.fillRect(Math.round(mx) - 2, Math.round(my) - 1, 5, 3);
    b.fillRect(Math.round(mx) - 1, Math.round(my) + 2, 3, 1);
    b.fillStyle = '#a9aa9f';
    b.fillRect(Math.round(mx), Math.round(my), 1, 1);
    b.fillRect(Math.round(mx) - 1, Math.round(my) + 1, 1, 1);
  }

  // Raketuppskjutningar: rymdnationernas ramper + spelarens (vid rymdforskning)
  _drawRockets(b, t) {
    const SITES = [
      [-80.6, 28.5],  // Cape Canaveral
      [63.3, 45.9],   // Bajkonur
      [100.3, 41.1],  // Jiuquan
      [80.2, 13.7],   // Sriharikota
      [131.0, 30.4],  // Tanegashima
      [-52.8, 5.2],   // Kourou
      [21.1, 67.9],   // Esrange
    ];
    const cyc = 26000, dur = 4200;
    const idx = Math.floor(t / cyc);
    const k = (t % cyc) / dur;
    if (k > 1) return;
    // rampvalet fryses per cykel så en pågående raket aldrig byter plats
    if (this._rk?.idx !== idx) {
      const sites = this.playerLaunch ? [...SITES, this.playerLaunch] : SITES;
      this._rk = { idx, site: sites[hashId('rk' + idx) % sites.length] };
    }
    const site = this._rk.site;
    if (!this._front(site, 1.15)) return;
    const p = this.proj(site);
    if (!p) return;
    const [cx, cy] = this.proj.translate();
    let dx = p[0] - cx, dy = p[1] - cy; // radiellt utåt = "uppåt"
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const ease = k * k * (3 - 2 * k);
    const h = ease * 17;
    const rx = p[0] + dx * h, ry = p[1] + dy * h;
    // rökpelare kvar på rampen + bakom raketen
    for (let i = 1; i <= 3; i++) {
      const hh = Math.max(0, h - i * 2.4);
      b.globalAlpha = 0.4 * (1 - k) * (1 - i / 4);
      b.fillStyle = '#c9cdd4';
      b.fillRect(Math.round(p[0] + dx * hh), Math.round(p[1] + dy * hh), 1, 1);
    }
    // raket + flamma
    b.globalAlpha = k > 0.85 ? (1 - k) / 0.15 : 1;
    b.fillStyle = '#ffffff';
    b.fillRect(Math.round(rx), Math.round(ry), 1, 2);
    b.fillStyle = Math.floor(t / 90) % 2 ? '#ff9b3d' : '#ffd23d';
    b.fillRect(Math.round(rx - dx * 2), Math.round(ry - dy * 2), 1, 1);
    b.globalAlpha = 1;
  }

  // Fyrverkerier: expanderande färgringar över huvudstaden vid segrar och utrop
  _drawFireworks(b, t) {
    if (!this._fireworks?.length) return;
    this._fireworks = this._fireworks.filter((f) => t < f.until);
    for (const f of this._fireworks) {
      if (!this._front(f.ll, 1.2)) continue;
      const p = this.proj(f.ll);
      if (!p) continue;
      // två samtidiga skurar med olika fas och offset
      for (let s = 0; s < 2; s++) {
        const cyc = 800;
        const local = (t - f.born + s * 400) % cyc;
        const burst = Math.floor((t - f.born + s * 400) / cyc);
        const k = local / cyc;
        const bh = hashId('fw' + burst + '_' + s);
        const ox = (bh % 11) - 5, oy = ((bh >> 3) % 7) - 6;
        const r = 1 + k * 7;
        const colors = ['#ffd23d', '#ff5a7a', '#59ffa8', '#6db4ff', '#ffffff'];
        b.globalAlpha = (1 - k) * 0.95;
        b.fillStyle = colors[bh % colors.length];
        const n = 12;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + (bh % 10) / 10;
          b.fillRect(Math.round(p[0] + ox + Math.cos(a) * r), Math.round(p[1] + oy - 5 + Math.sin(a) * r), 1, 1);
        }
        if (k < 0.25) { // ljus kärna i explosionsögonblicket
          b.globalAlpha = 1 - k * 4;
          b.fillStyle = '#ffffff';
          b.fillRect(Math.round(p[0] + ox) - 1, Math.round(p[1] + oy - 5) - 1, 2, 2);
        }
      }
    }
    b.globalAlpha = 1;
  }

  // Åskväder: korta dubbelblixtar i tropikbandet
  _drawLightning(b, t) {
    const cyc = 3400;
    const idx = Math.floor(t / cyc);
    const local = t % cyc;
    if (local > 320) return;
    const on = local < 90 || (local > 150 && local < 260);
    if (!on) return;
    const h = hashId('li' + idx);
    const ll = [(h % 360) - 180, ((h >> 5) % 36) - 18];
    if (!this._front(ll, 1.1)) return;
    const p = this.proj(ll);
    if (!p) return;
    const bx = Math.round(p[0]), by = Math.round(p[1]);
    b.globalAlpha = 0.35;
    b.fillStyle = '#9db8ff';
    b.fillRect(bx - 2, by - 2, 5, 5);
    b.globalAlpha = 0.95;
    b.fillStyle = '#ffffff';
    b.fillRect(bx, by - 1, 1, 3);
    b.fillRect(bx - 1, by, 3, 1);
    b.globalAlpha = 1;
  }

  // Fartygsljus: varma punkter som glider längs sjörutterna på natthalvan
  _drawShipLights(b, t) {
    if (this.dayFloat == null || !this.routes?.length) return;
    for (const r of this.routes) {
      if (r.kind !== 'sea') continue;
      const frac = ((t / 70000) + (r.phase % 1000) / 1000) % 1;
      const ll = r.interp(frac);
      if (!this._front(ll) || !this._isNight(ll)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      b.globalAlpha = 0.85;
      b.fillStyle = '#ffd9a0';
      b.fillRect(Math.round(p[0]), Math.round(p[1]), 1, 1);
      const ll2 = r.interp(Math.max(0, frac - 0.02));
      const p2 = this._front(ll2) ? this.proj(ll2) : null;
      if (p2) { b.globalAlpha = 0.3; b.fillRect(Math.round(p2[0]), Math.round(p2[1]), 1, 1); }
    }
    b.globalAlpha = 1;
  }

  // Satellittäckningens gräns: diskret streckad cirkel runt hemlandet
  _drawSatCoverage(b, t) {
    const c = this.satCov;
    if (!c || !c.tier || c.ang === Infinity || !c.center) return;
    // LineString, inte Polygon — annars stänger d3:s clipping ringen med
    // falska bågar längs globkanten när cirkeln korsar horisonten
    const ring0 = d3.geoCircle().center(c.center).radius(c.ang * 180 / Math.PI)().coordinates[0];
    const ring = { type: 'LineString', coordinates: ring0 };
    b.save();
    b.setLineDash([3, 4]);
    b.lineDashOffset = -(t / 200) % 7;
    b.beginPath();
    this.bpath(ring);
    b.strokeStyle = 'rgba(57,215,255,0.5)';
    b.lineWidth = 1;
    b.stroke();
    b.restore();

    // dina egna satelliter patrullerar längs täckningsgränsen
    const path = ring0 || [];
    if (path.length > 3) {
      const n = Math.min(8, 2 + c.tier * 2);
      for (let i = 0; i < n; i++) {
        const k = ((t / 26000) + i / n) % 1;
        const pt = path[Math.floor(k * path.length) % path.length];
        if (!pt || !this._front(pt, 1.2)) continue;
        const p = this.proj(pt);
        if (!p) continue;
        b.fillStyle = Math.floor(t / 300 + i) % 4 ? '#cfe8ff' : '#39d7ff';
        b.fillRect(Math.round(p[0]), Math.round(p[1]), 1, 1);
        b.globalAlpha = 0.4;
        b.fillRect(Math.round(p[0]) - 1, Math.round(p[1]), 1, 1);
        b.globalAlpha = 1;
      }
    }
  }

  // Krigsrök: stigande rökpuffar + eldflimmer över länder som invaderas
  _drawWarSmoke(b, t) {
    for (const z of this.warZones || []) {
      if (!this._front(z.ll, 1.2)) continue;
      const p = this.proj(z.ll);
      if (!p) continue;
      const bx = Math.round(p[0]), by = Math.round(p[1]);
      for (let i = 0; i < 4; i++) {
        const ph = ((t / 1400) + i / 4) % 1;
        b.globalAlpha = 0.65 * (1 - ph);
        b.fillStyle = '#aab0b8';
        b.fillRect(bx + (i - 1) - (ph > 0.5 ? 1 : 0), by - 1 - Math.round(ph * 8), ph > 0.35 ? 3 : 2, 1);
      }
      if (Math.floor(t / 180) % 3 !== 0) {
        b.globalAlpha = 0.95;
        b.fillStyle = Math.floor(t / 180) % 2 ? '#ff9b3d' : '#ffd23d';
        b.fillRect(bx - 1, by, 2, 1);
        b.globalAlpha = 0.4;
        b.fillStyle = '#ff5a2d';
        b.fillRect(bx - 2, by - 1, 4, 2);
      }
    }
    b.globalAlpha = 1;
  }

  // Blinkande stadsljus + NATTLJUS på mörka sidan + radar-ping
  _drawCityLife(b, t) {
    const slot = Math.floor(t / 300);
    for (let i = 0; i < this._visCities.length; i++) {
      const v = this._visCities[i];
      if (this._isNight(v.city.ll)) {
        b.fillStyle = v.city.c ? '#ffe9a8' : '#ffd98a';
        b.fillRect(v.x, v.y, 1, 1);
        if (v.city.tier === 0) {
          b.fillStyle = 'rgba(255,217,138,0.4)';
          b.fillRect(v.x - 1, v.y, 3, 1);
          b.fillRect(v.x, v.y - 1, 1, 3);
        }
        continue;
      }
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
    // extra spaningssatelliter per forskningsnivå
    const tier = this.satCov?.tier || 0;
    for (let i = 0; i < tier * 2 && tier < 5; i++) {
      const inc = 24 + ((i * 37) % 50);
      const dir = i % 2 ? 1 : -1;
      const lon = ((t * (0.006 + (i % 5) * 0.002) * dir + i * 47) % 360 + 540) % 360 - 180;
      const lat = inc * Math.sin(t * 0.0013 + i * 1.7);
      const ll = [lon, lat];
      if (!this._front(ll, 1.35)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      b.fillStyle = Math.floor(t / 400 + i) % 3 ? '#cfe8ff' : '#39d7ff';
      b.fillRect(Math.round(p[0]), Math.round(p[1]) - 2, 1, 1);
    }
    // T5: globalt satellitnätverk — en kedja i bana runt hela jorden
    if (tier >= 5) {
      const N = 12, inc = 53 * Math.PI / 180, node = t * 0.0045;
      const pts = [];
      for (let k = 0; k < N; k++) {
        const u = t * 0.0011 + (k / N) * Math.PI * 2;
        const lat = Math.asin(Math.sin(inc) * Math.sin(u)) * 180 / Math.PI;
        const lon = ((node + Math.atan2(Math.cos(inc) * Math.sin(u), Math.cos(u)) * 180 / Math.PI) % 360 + 540) % 360 - 180;
        const ll = [lon, lat];
        pts.push(this._front(ll, 1.3) ? this.proj(ll) : null);
      }
      b.strokeStyle = 'rgba(57,215,255,0.22)';
      b.lineWidth = 0.5;
      for (let k = 0; k < N; k++) {
        const a = pts[k], c = pts[(k + 1) % N];
        if (a && c && Math.hypot(a[0] - c[0], a[1] - c[1]) < this.buf.width / 2) {
          b.beginPath(); b.moveTo(a[0], a[1] - 2); b.lineTo(c[0], c[1] - 2); b.stroke();
        }
        if (a) {
          b.fillStyle = Math.floor(t / 300 + k) % 4 ? '#e8f7ff' : '#39d7ff';
          b.fillRect(Math.round(a[0]), Math.round(a[1]) - 2, 1, 1);
        }
      }
    }
    // rymdnationernas egna satelliter — en per land, i landets färg
    for (let i = 0; i < (this.spaceNations?.length || 0); i++) {
      const sn = this.spaceNations[i];
      const inc = Math.abs(sn.ll?.[1] || 30) + 8;
      const lon = ((t * (0.007 + (i % 4) * 0.002) + i * 83) % 360 + 540) % 360 - 180;
      const lat = inc * Math.sin(t * 0.0009 + i);
      const ll = [lon, Math.max(-80, Math.min(80, lat))];
      if (!this._front(ll, 1.35)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      b.fillStyle = Math.floor(t / 350 + i) % 4 ? sn.color : '#ffffff';
      b.fillRect(Math.round(p[0]), Math.round(p[1]) - 3, 1, 1);
      b.globalAlpha = 0.35;
      b.fillRect(Math.round(p[0]) - 1, Math.round(p[1]) - 3, 1, 1);
      b.globalAlpha = 1;
    }
    // ISS: snabb flyover med cyan släpljus
    const issAt = (tt) => [((tt * 0.011) % 360 + 540) % 360 - 180, 51.6 * Math.sin(tt * 0.00045)];
    for (let i = 5; i >= 0; i--) {
      const ll = issAt(t - i * 300);
      if (!this._front(ll, 1.35)) continue;
      const p = this.proj(ll);
      if (!p) continue;
      if (i === 0) {
        b.globalAlpha = 1;
        b.fillStyle = '#ffffff';
        b.fillRect(Math.round(p[0]), Math.round(p[1]) - 2, 2, 1);
      } else {
        b.globalAlpha = 0.55 * (1 - i / 6);
        b.fillStyle = '#7fe8ff';
        b.fillRect(Math.round(p[0]), Math.round(p[1]) - 2, 1, 1);
      }
    }
    b.globalAlpha = 1;
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

  // liten repeterbar brusplatta för landstruktur i terrängläget
  _makeTerrainPattern(ctx) {
    const c = document.createElement('canvas');
    c.width = 48; c.height = 48;
    const g = c.getContext('2d');
    for (let y = 0; y < 48; y++) {
      for (let x = 0; x < 48; x++) {
        const h = hashId('tp' + (((x * 73856093) ^ (y * 19349663)) >>> 0).toString(36));
        if (h % 100 < 10) { g.fillStyle = 'rgba(18,24,16,0.18)'; g.fillRect(x, y, 1, 1); }
        else if (h % 100 < 18) { g.fillStyle = 'rgba(255,252,238,0.09)'; g.fillRect(x, y, 1, 1); }
      }
    }
    return ctx.createPattern(c, 'repeat');
  }

  // Bergskedjor med hillshade: mörk skugga i sydost, ljus kant i nordväst, snötoppar
  _drawRelief(s) {
    if (!this._reliefPts) {
      this._reliefPts = [];
      for (const r of MOUNTAIN_RANGES) {
        for (let i = 0; i < r.pts.length - 1; i++) {
          const [a, b] = [r.pts[i], r.pts[i + 1]];
          const segLen = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const n = Math.max(2, Math.ceil(segLen / 1.1));
          for (let j = 0; j < n; j++) {
            const k = j / n;
            const h = hashId('mt' + r.pts[0][0] + '_' + i + '_' + j);
            this._reliefPts.push({
              ll: [
                a[0] + (b[0] - a[0]) * k + ((h % 9) - 4) * 0.11,
                a[1] + (b[1] - a[1]) * k + (((h >> 4) % 9) - 4) * 0.11,
              ],
              big: r.big && h % 3 === 0,
              snow: r.snow && h % 2 === 0,
            });
          }
        }
      }
    }
    for (const pt of this._reliefPts) {
      const p = this.proj(pt.ll);
      if (!p) continue;
      const px = Math.round(p[0]), py = Math.round(p[1]);
      const w = pt.big ? 2 : 1;
      s.globalAlpha = 0.45;
      s.fillStyle = '#2e2a1e';
      s.fillRect(px + 1, py + 1, w, 1);          // skugga (SO)
      s.globalAlpha = 0.85;
      s.fillStyle = pt.snow ? '#ded9c8' : '#8f8266';
      s.fillRect(px, py, w, 1);                  // massivet
      s.globalAlpha = 0.4;
      s.fillStyle = '#fdf6e3';
      s.fillRect(px - 1, py - 1, 1, 1);          // ljuskant (NV)
      if (pt.snow) {
        s.globalAlpha = 0.9;
        s.fillStyle = '#ffffff';
        s.fillRect(px, py - 1, 1, 1);            // snötopp
      }
    }
    s.globalAlpha = 1;
  }

  // Tillgångsikoner på respektive land (TILLGÅNGAR-toggeln) — skarpa i skärmupplösning
  _drawResourceMarkers(x) {
    const ps = this.pixelSize;
    const iconPx = this.zoom >= 2 ? 13 : 10;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.font = `${iconPx}px "Segoe UI Emoji", sans-serif`;
    for (const m of this.resourceMarkers) {
      if (!this._front(m.ll, 1.02)) continue;
      const p = this.proj(m.ll);
      if (!p) continue;
      const sx = p[0] * ps, sy = p[1] * ps + 14;
      if (sx < -30 || sy < -30 || sx > this.canvas.width + 30 || sy > this.canvas.height + 30) continue;
      x.lineWidth = 3;
      x.strokeStyle = 'rgba(2,10,16,0.8)';
      x.strokeText(m.icons, sx, sy);
      x.fillStyle = '#ffffff';
      x.fillText(m.icons, sx, sy);
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

    const useMesh = !!this._borderMesh;
    for (const c of this.countries) {
      const claim = this.claims[c.id];
      const terr = this.showTerrain ? this.terrainColors?.[c.id] : null;
      s.beginPath(); this.spath(c.feature);
      if (claim) {
        if (terr) {
          // terrängläge: naturfärg i botten + halvgenomskinlig ägartint ovanpå
          s.fillStyle = terr; s.fill();
          s.globalAlpha = 0.32;
          s.fillStyle = claim.color; s.fill();
          s.globalAlpha = 1;
        } else {
          s.fillStyle = shade(claim.color, 0.45);
          s.fill();
        }
        // med mesh fylls hela riket som EN yta efteråt (se _ownerMeshes.fill),
        // så inga inre gränser eller sömmar syns mellan provinserna
        if (!useMesh) { s.strokeStyle = claim.color; s.lineWidth = 1; s.stroke(); }
      } else {
        s.fillStyle = terr || LAND_SHADES[hashId(c.id) % LAND_SHADES.length];
        s.fill();
        if (!useMesh) { s.strokeStyle = BORDER; s.lineWidth = 0.55; s.stroke(); }
      }
      // terrängläge: subtil bruskstruktur ger landmassorna djup
      if (terr) {
        s.fillStyle = (this._terrPattern ||= this._makeTerrainPattern(s));
        s.fill();
      }
      // säsongssnö: länder norr/söder om snögränsen får ett vitt täcke
      if (this._snowN != null) {
        const lat = c.centroid[1];
        let a = 0;
        if (lat > this._snowN) a = Math.min(0.55, ((lat - this._snowN) / 18) * 0.55 + 0.12);
        else if (lat < this._snowS) a = Math.min(0.55, ((this._snowS - lat) / 18) * 0.55 + 0.12);
        if (a > 0.03) { s.fillStyle = `rgba(235,244,252,${a})`; s.fill(); }
      }
    }

    // gränsmesh: kuster + gränser mellan OLIKA ägare (inre gränser är utsuddade),
    // sedan varje ägares yttre kontur i ägarfärgen
    if (useMesh) {
      // rikets landmassa fylls som EN sammanhängande yta → sömlöst inuti
      for (const om of this._ownerMeshes) {
        if (!om.fill) continue;
        s.beginPath(); this.spath(om.fill);
        if (this.showTerrain) {
          s.globalAlpha = 0.32;
          s.fillStyle = om.color; s.fill();
          s.globalAlpha = 1;
        } else {
          s.fillStyle = shade(om.color, 0.45); s.fill();
        }
      }
      s.beginPath(); this.spath(this._borderMesh);
      s.strokeStyle = BORDER; s.lineWidth = 0.55; s.stroke();
      for (const om of this._ownerMeshes) {
        s.beginPath(); this.spath(om.mesh);
        s.strokeStyle = om.color; s.lineWidth = 1.1; s.stroke();
      }
    }

    // bergskedjor med hillshade ovanpå naturfärgerna
    if (this.showTerrain) this._drawRelief(s);

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
      const maxTier = this.zoom < 1.6 ? 0 : this.zoom < 2.6 ? 1 : this.zoom < 3.8 ? 2 : 3;
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
        } else if (city.tier === 3) {
          s.globalAlpha = 0.7;
          s.fillStyle = '#b3a878';
          s.fillRect(px, py, 1, 1);
          s.globalAlpha = 1;
        } else {
          s.fillStyle = '#d8c98a';
          s.fillRect(px, py, 1, 1);
        }
      }
    }

    // etikettlistan (ritas skarpt i skärmupplösning i kompositpasset).
    // Bara länder vars mittpunkt faktiskt SYNS på skärmen kandiderar — annars
    // äter jättar utanför bild upp alla platser och inzoomade vyer blir namnlösa.
    this._labels = [];
    const entries = [];
    const LW = this.buf.width, LH = this.buf.height;
    for (const c of this.countries) {
      const area = this.mpath.area(c.feature);
      if (area < 550) continue;
      const p = this.proj(c.centroid);
      if (!p) continue;
      if (p[0] < -6 || p[1] < -6 || p[0] > LW + 6 || p[1] > LH + 6) continue;
      const rp = this.proj(this.proj.invert(p));
      if (!rp || Math.hypot(rp[0] - p[0], rp[1] - p[1]) > 1.5) continue;
      // erövrade länder bär erövrarens namn — under integrationen visas hur långt den kommit
      const lbl = this.labelOverride?.[c.id];
      entries.push({
        area, x: p[0], y: p[1],
        text: (lbl || c.name).toUpperCase(),
        kind: 'country', claimed: !!this.claims[c.id],
      });
    }
    entries.sort((a, b) => b.area - a.area);
    this._labels = entries.slice(0, 28);

    if (this.showCities && this.zoom >= 2.2) {
      let count = 0;
      for (const v of this._visCities) {
        if (count >= 28) break;
        if (v.city.tier === 2 && this.zoom < 5) continue;
        if (v.city.tier === 3 && this.zoom < 6.5) continue;
        this._labels.push({ x: v.x, y: v.y, text: v.city.n.toUpperCase(), kind: 'city', capital: !!v.city.c });
        count++;
      }
    }
  }
}
