// IMPERIUM v3 — PROTOTYP B: realtidsstrid à la Red Alert (utan basbygge)
// Slagfält i landets biom med väg, skogsdungar (sänker farten), stenar och hus.
// Markera enheter (tryck/dragruta), tryck på mark = flytta, på fiende = anfall.
import { UNIT_TYPES, attackDamage, drawUnit, drawHpBadge, BIOMES, drawTree, drawHouse, tint, lighten } from './units.js';

const W = 480, H = 270;
const P_COL = '#ff4f4f', E_COL = '#4fa8ff';

function mulberry(seed) {
  let a = seed | 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class BattleB {
  // opts: {canvas, biome, atk, def, seed, onEnd, setStatus}
  constructor(opts) {
    this.o = opts;
    this.canvas = opts.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = W;
    this.canvas.height = H;
    this.biome = BIOMES[opts.biome];

    const rnd = mulberry(opts.seed || 11);
    // markstruktur
    this.dots = [];
    for (let i = 0; i < 70; i++) this.dots.push({ x: rnd() * W, y: rnd() * H, w: 2 + rnd() * 4, d: rnd() < 0.5 });
    // väg tvärs över (visuell) med drift
    this.road = [];
    let ry = 90 + rnd() * 90;
    for (let x = 0; x < W; x += 24) {
      this.road.push({ x, y: ry });
      ry = Math.max(50, Math.min(H - 60, ry + (rnd() - 0.5) * 22));
    }
    // skogsdungar (sänker farten), stenar, hus — undvik spawnzonerna
    this.forests = [];
    for (let i = 0; i < 5; i++) {
      const fx = 120 + rnd() * (W - 240), fy = 16 + rnd() * (H - 70);
      const fw = 40 + rnd() * 50, fh = 30 + rnd() * 30;
      const trees = [];
      for (let j = 0; j < 3 + Math.floor(rnd() * 4); j++) trees.push({ x: fx + rnd() * (fw - 16), y: fy + rnd() * (fh - 20) });
      trees.sort((a, b) => a.y - b.y);
      this.forests.push({ x: fx, y: fy, w: fw, h: fh, trees });
    }
    this.rocks = [];
    for (let i = 0; i < 6; i++) this.rocks.push({ x: 110 + rnd() * (W - 220), y: 12 + rnd() * (H - 30), s: 4 + rnd() * 6 });
    this.houses = [
      { x: 118 + rnd() * 60, y: 14 + rnd() * 40 },
      { x: W - 190 + rnd() * 50, y: H - 60 - rnd() * 40 },
    ];

    this.units = [];
    opts.atk.forEach((u, i) => this.units.push({
      ...u, side: 0, x: 36 + (i % 2) * 28, y: 44 + Math.floor(i / 2) * 46 + (i % 2) * 10,
      order: null, ox: 0, oy: 0, target: null, sel: false, cd: 0, face: 1,
    }));
    opts.def.forEach((u, i) => this.units.push({
      ...u, side: 1, x: W - 36 - (i % 2) * 28, y: 44 + Math.floor(i / 2) * 46 + (i % 2) * 10,
      order: null, ox: 0, oy: 0, target: null, sel: false, cd: 0, face: -1,
    }));

    this.tracers = [];
    this.booms = [];
    this.box = null;
    this.done = false;
    this.aiT = 0;
    this.lastT = null;

    this._bindInput();
    this._status('MARKERA ENHETER — TRYCK PÅ MARK/FIENDE FÖR ORDER');
    this._raf = requestAnimationFrame((t) => this._frame(t));
  }

  destroy() { this.done = true; cancelAnimationFrame(this._raf); }
  _status(s) { this.o.setStatus?.(s); }

  _toWorld(e) {
    const r = this.canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H];
  }

  _bindInput() {
    const cv = this.canvas;
    let downPos = null, dragging = false;
    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId);
      downPos = this._toWorld(e);
      dragging = false;
    });
    cv.addEventListener('pointermove', (e) => {
      if (!downPos) return;
      const p = this._toWorld(e);
      if (Math.hypot(p[0] - downPos[0], p[1] - downPos[1]) > 7) {
        dragging = true;
        this.box = { x0: downPos[0], y0: downPos[1], x1: p[0], y1: p[1] };
      }
    });
    cv.addEventListener('pointerup', (e) => {
      const p = this._toWorld(e);
      if (dragging && this.box) {
        const { x0, y0, x1, y1 } = this.box;
        const [lx, hx] = [Math.min(x0, x1), Math.max(x0, x1)];
        const [ly, hy] = [Math.min(y0, y1), Math.max(y0, y1)];
        for (const u of this.units) if (u.side === 0) u.sel = u.x >= lx - 8 && u.x <= hx + 8 && u.y >= ly - 8 && u.y <= hy + 8;
        this._selStatus();
      } else if (downPos) {
        this._tap(p[0], p[1]);
      }
      this.box = null; downPos = null; dragging = false;
    });
  }

  _selStatus() {
    const n = this.units.filter((u) => u.side === 0 && u.sel).length;
    this._status(n ? `${n} ENHETER VALDA — TRYCK PÅ MARK ELLER FIENDE` : 'MARKERA ENHETER');
  }

  _tap(x, y) {
    const hit = this.units.find((u) => u.hp > 0 && Math.hypot(u.x - x, u.y - y) < 15);
    const sel = this.units.filter((u) => u.side === 0 && u.sel);
    if (hit && hit.side === 0) {
      hit.sel = !hit.sel;
      this._selStatus();
      return;
    }
    if (!sel.length) return;
    if (hit && hit.side === 1) {
      for (const u of sel) { u.target = hit; u.order = 'attack'; }
      this._status('ANFALL!');
      return;
    }
    const cols = Math.ceil(Math.sqrt(sel.length));
    sel.forEach((u, i) => {
      u.order = 'move';
      u.target = null;
      u.ox = x + (i % cols - (cols - 1) / 2) * 18;
      u.oy = y + (Math.floor(i / cols) - (sel.length / cols - 1) / 2) * 18;
    });
    this._status('FRAMÅT!');
  }

  selectAll() {
    for (const u of this.units) if (u.side === 0) u.sel = true;
    this._selStatus();
  }

  retreat() {
    if (this.done) return;
    this.done = true;
    this.o.onEnd?.({ winner: 1, retreat: true, survivors: this.units.filter((u) => u.side === 0 && u.hp > 0).map(({ type, hp }) => ({ type, hp: Math.ceil(hp) })) });
  }

  _inForest(u) {
    if (u.type === 'FLYG') return false;
    return this.forests.some((f) => u.x > f.x - 6 && u.x < f.x + f.w + 6 && u.y > f.y - 6 && u.y < f.y + f.h + 6);
  }

  _step(dt) {
    const alive = (s) => this.units.filter((u) => u.side === s && u.hp > 0);
    this.aiT -= dt;
    if (this.aiT <= 0) {
      this.aiT = 1500;
      const mine = alive(0);
      if (mine.length) {
        const cx = mine.reduce((s, u) => s + u.x, 0) / mine.length;
        const cy = mine.reduce((s, u) => s + u.y, 0) / mine.length;
        for (const u of alive(1)) {
          if (!u.target || u.target.hp <= 0) { u.order = 'move'; u.ox = cx; u.oy = cy; }
        }
      }
    }

    for (const u of this.units) {
      if (u.hp <= 0) continue;
      if (u.target && u.target.hp <= 0) { u.target = null; if (u.order === 'attack') u.order = null; }
      if (!u.target) {
        const foes = alive(1 - u.side);
        let best = null, bd = UNIT_TYPES[u.type].aggro;
        for (const f of foes) {
          const d = Math.hypot(f.x - u.x, f.y - u.y);
          if (d < bd) { bd = d; best = f; }
        }
        if (best) u.target = best;
      }
      const T = UNIT_TYPES[u.type];
      let vx = 0, vy = 0;
      if (u.target) {
        const d = Math.hypot(u.target.x - u.x, u.target.y - u.y);
        if (d > T.range) {
          vx = (u.target.x - u.x) / d; vy = (u.target.y - u.y) / d;
        } else {
          u.face = u.target.x >= u.x ? 1 : -1;
          u.cd -= dt;
          if (u.cd <= 0) {
            u.cd = 800;
            const loss = attackDamage(u, u.target, this._inForest(u.target) ? 1 : 0) / 2.4;
            u.target.hp -= loss;
            this.tracers.push({ x0: u.x + u.face * 12, y0: u.y - 4, x1: u.target.x, y1: u.target.y - 3, ttl: 120 });
            if (u.target.hp <= 0) {
              this.booms.push({ x: u.target.x, y: u.target.y, ttl: 500 });
              u.target = null;
            }
          }
        }
      } else if (u.order === 'move') {
        const d = Math.hypot(u.ox - u.x, u.oy - u.y);
        if (d < 4) { u.order = null; }
        else { vx = (u.ox - u.x) / d; vy = (u.oy - u.y) / d; }
      }
      if (vx || vy) {
        const slow = this._inForest(u) ? 0.6 : 1;
        u.x += vx * T.spd * slow * dt / 1000;
        u.y += vy * T.spd * slow * dt / 1000;
        u.face = vx >= 0 ? 1 : -1;
        u.x = Math.max(10, Math.min(W - 10, u.x));
        u.y = Math.max(12, Math.min(H - 8, u.y));
      }
    }
    const live = this.units.filter((u) => u.hp > 0);
    for (let i = 0; i < live.length; i++) {
      for (let j = i + 1; j < live.length; j++) {
        const a = live[i], b = live[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < 13) {
          const push = (13 - d) / 2 / d;
          a.x -= dx * push; a.y -= dy * push;
          b.x += dx * push; b.y += dy * push;
        }
      }
    }
    this.units = this.units.filter((u) => u.hp > 0);

    const a = this.units.some((u) => u.side === 0);
    const d = this.units.some((u) => u.side === 1);
    if ((!a || !d) && !this.done) {
      this.done = true;
      setTimeout(() => this.o.onEnd?.({
        winner: a ? 0 : 1,
        survivors: this.units.filter((u) => u.side === 0).map(({ type, hp }) => ({ type, hp: Math.ceil(hp) })),
      }), 600);
    }
  }

  _frame(t) {
    if (this.lastT == null) this.lastT = t;
    const dt = Math.min(45, t - this.lastT);
    this.lastT = t;
    if (!this.done) this._step(dt);
    this._draw(t);
    if (!this.done || this.booms.length) this._raf = requestAnimationFrame((tt) => this._frame(tt));
  }

  _draw(t) {
    const c = this.ctx, B = this.biome;
    c.imageSmoothingEnabled = false;
    c.fillStyle = B.ground;
    c.fillRect(0, 0, W, H);
    for (const d of this.dots) {
      c.fillStyle = d.d ? B.ground2 : B.tuft;
      c.fillRect(Math.round(d.x), Math.round(d.y), Math.round(d.w), 2);
    }
    // väg
    for (let i = 0; i < this.road.length - 1; i++) {
      const a = this.road[i], b = this.road[i + 1];
      c.fillStyle = B.roadEdge;
      c.fillRect(a.x, Math.min(a.y, b.y) - 9, 25, Math.abs(a.y - b.y) + 18);
      c.fillStyle = B.road;
      c.fillRect(a.x, Math.min(a.y, b.y) - 6, 25, Math.abs(a.y - b.y) + 12);
    }
    // stenar
    for (const r of this.rocks) {
      c.fillStyle = B.mountShade;
      c.fillRect(r.x - r.s / 2 + 1, r.y - r.s / 2 + 1, r.s, r.s);
      c.fillStyle = B.mount;
      c.fillRect(r.x - r.s / 2, r.y - r.s / 2, r.s, r.s);
      c.fillStyle = B.mount2;
      c.fillRect(r.x - r.s / 2, r.y - r.s / 2, Math.max(2, r.s / 2), 2);
    }
    // skogsdungar
    for (const f of this.forests) {
      c.fillStyle = tint(B.ground2, 0.9);
      c.fillRect(Math.round(f.x) - 4, Math.round(f.y) - 2, Math.round(f.w) + 8, Math.round(f.h) + 6);
      for (const tr of f.trees) drawTree(c, B, Math.round(tr.x), Math.round(tr.y), 1.3);
    }
    // hus
    for (const hHouse of this.houses) drawHouse(c, B, Math.round(hHouse.x), Math.round(hHouse.y), 1.5);

    for (const u of this.units) {
      if (u.side === 0 && u.sel && u.order === 'move') {
        c.strokeStyle = 'rgba(255,255,255,0.35)';
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(u.x, u.y); c.lineTo(u.ox, u.oy); c.stroke();
      }
    }

    const sorted = [...this.units].filter((u) => u.hp > 0).sort((a, b) => a.y - b.y);
    for (const u of sorted) {
      const px = Math.round(u.x) - 16, py = Math.round(u.y) - 14;
      if (u.sel) {
        c.strokeStyle = '#fff';
        c.lineWidth = 1;
        c.strokeRect(px - 2, py - 2, 36, 32);
      }
      if (u.type === 'FLYG') {
        c.fillStyle = 'rgba(0,0,0,0.25)';
        c.fillRect(px + 8, py + 20, 16, 3);
      }
      drawUnit(c, u.type, u.side === 0 ? P_COL : E_COL, px, u.type === 'FLYG' ? py - 10 : py, 2, u.face);
      drawHpBadge(c, u.hp, px + 20, py + 16, 1);
    }

    for (const tr of this.tracers) {
      tr.ttl -= 16;
      c.strokeStyle = Math.floor(t / 40) % 2 ? '#ffd24f' : '#fff';
      c.lineWidth = 1;
      c.beginPath(); c.moveTo(tr.x0, tr.y0); c.lineTo(tr.x1, tr.y1); c.stroke();
    }
    this.tracers = this.tracers.filter((x) => x.ttl > 0);
    for (const bm of this.booms) {
      bm.ttl -= 16;
      const k = 1 - bm.ttl / 500;
      c.fillStyle = k < 0.4 ? '#ffd24f' : k < 0.7 ? '#ff9f3e' : '#5a5a5a';
      for (let i = 0; i < 6; i++) {
        const ang = i * 1.05 + k * 2;
        c.fillRect(Math.round(bm.x + Math.cos(ang) * k * 14), Math.round(bm.y + Math.sin(ang) * k * 14), 3, 3);
      }
    }
    this.booms = this.booms.filter((x) => x.ttl > 0);

    if (this.box) {
      c.strokeStyle = '#fff';
      c.lineWidth = 1;
      c.strokeRect(Math.min(this.box.x0, this.box.x1), Math.min(this.box.y0, this.box.y1),
        Math.abs(this.box.x1 - this.box.x0), Math.abs(this.box.y1 - this.box.y0));
    }
  }
}
