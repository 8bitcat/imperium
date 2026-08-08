// IMPERIUM — pixelerad jordglob (ortografisk projektion via d3-geo)
// Renderar till en lågupplöst buffert som skalas upp med image-rendering: pixelated.
// Scenen (hav, länder, gränser, etiketter) cachas i en egen canvas och ritas bara
// om när vyn eller datat ändras; selektions-pulsen kompositeras billigt varje frame.

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

export class Globe {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.buf = document.createElement('canvas');
    this.bctx = this.buf.getContext('2d');
    this.scene = document.createElement('canvas');
    this.sctx = this.scene.getContext('2d');

    this.rot = [-15, -30];    // startvy: Europa/Afrika
    this.zoom = 1;
    this.minZoom = 0.85;
    this.maxZoom = 80;

    this.countries = [];
    this.byId = new Map();
    this.claims = {};         // countryId -> { color, playerName }
    this.selectedId = null;
    this.autoRotate = false;
    this.onSelect = null;

    this.sceneDirty = true;
    this.anim = null;
    this.pixelSize = 3;

    this.proj = d3.geoOrthographic().clipAngle(90);
    this.mpath = d3.geoPath(this.proj);   // utan context: mäter area/centroid
    this.grat = d3.geoGraticule10();
    this.stars = [];

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

  setClaims(claims) { this.claims = claims || {}; this.sceneDirty = true; }

  select(id) { this.selectedId = id; this.sceneDirty = true; }

  // Flyg mjukt till [lon,lat] med given zoom (används av TV:n vid highlights)
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

  _zoomBy(f, keepAnim = false) {
    if (!keepAnim) this.anim = null;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * f));
    this._applyProjection();
  }

  _rotateByPx(dx, dy) {
    this.anim = null;
    const k = 57 / this.proj.scale(); // grader per buffert-pixel
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
    if (!rp || Math.hypot(rp[0] - bx, rp[1] - by) > 1.5) return null; // utanför klotet
    const [lon, lat] = ll;
    const e = 0.2;
    for (const c of this.countries) {
      const [[x0, y0], [x1, y1]] = c.bounds;
      if (lat < y0 - e || lat > y1 + e) continue;
      const lonIn = x0 <= x1
        ? (lon >= x0 - e && lon <= x1 + e)
        : (lon >= x0 - e || lon <= x1 + e); // korsar antimeridianen
      if (!lonIn) continue;
      if (d3.geoContains(c.feature, ll)) return c;
    }
    return null;
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
          const c = this.pickAt(e.clientX - rect.left, e.clientY - rect.top);
          this.select(c ? c.id : null);
          this.onSelect?.(c);
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

    // komposit: scen + selektionspuls, uppskalat utan utjämning
    const b = this.bctx;
    b.clearRect(0, 0, this.buf.width, this.buf.height);
    b.drawImage(this.scene, 0, 0);
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

    requestAnimationFrame((tt) => this._frame(tt));
  }

  _renderScene() {
    const s = this.sctx;
    const W = this.scene.width, H = this.scene.height;
    s.fillStyle = SPACE;
    s.fillRect(0, 0, W, H);
    for (const st of this.stars) { s.fillStyle = st.c; s.fillRect(st.x, st.y, st.s, st.s); }

    // klotet (hav) + glöd
    s.beginPath(); this.spath({ type: 'Sphere' });
    s.fillStyle = OCEAN; s.fill();
    s.strokeStyle = 'rgba(57,215,255,0.22)'; s.lineWidth = 3; s.stroke();
    s.beginPath(); this.spath({ type: 'Sphere' });
    s.strokeStyle = RIM; s.lineWidth = 1; s.stroke();

    // gradnät
    s.beginPath(); this.spath(this.grat);
    s.strokeStyle = 'rgba(45,140,170,0.20)'; s.lineWidth = 0.5; s.stroke();

    // länder
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

    // etiketter på länder som är stora nog på skärmen just nu
    const minArea = 750;
    s.font = '6px monospace';
    s.textAlign = 'center'; s.textBaseline = 'middle';
    for (const c of this.countries) {
      const area = this.mpath.area(c.feature);
      if (area < minArea) continue;
      const p = this.proj(c.centroid);
      if (!p) continue;
      const rp = this.proj(this.proj.invert(p));
      if (!rp || Math.hypot(rp[0] - p[0], rp[1] - p[1]) > 1.5) continue;
      const label = c.name.toUpperCase();
      s.fillStyle = '#03141d';
      for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) s.fillText(label, p[0] + ox, p[1] + oy);
      s.fillStyle = this.claims[c.id] ? '#ffe9c4' : '#bfeaff';
      s.fillText(label, p[0], p[1]);
    }
  }
}
