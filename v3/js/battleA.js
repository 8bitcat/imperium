// IMPERIUM v3 — PROTOTYP A: turbaserad taktikstrid à la Advance Wars
// Rutnät 13×8, flytta + anfall, klinch-skärm med två paneler där antalet
// sprites speglar HP (som GBA-versionen). Siffror på varje enhet.
import { UNIT_TYPES, attackDamage, drawUnit, drawHpBadge, BIOMES } from './units.js';

const COLS = 13, ROWS = 8, TILE = 32;
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

export class BattleA {
  // opts: {canvas, klinchCanvas, klinchEl, biome, atk, def, seed, onEnd, setStatus}
  constructor(opts) {
    this.o = opts;
    this.canvas = opts.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.kcv = opts.klinchCanvas;
    this.kctx = this.kcv.getContext('2d');
    this.biome = BIOMES[opts.biome];
    this.canvas.width = COLS * TILE;
    this.canvas.height = ROWS * TILE;
    this.kcv.width = 340; this.kcv.height = 150;

    const rnd = mulberry(opts.seed || 7);
    this.terr = [];
    for (let y = 0; y < ROWS; y++) {
      const row = [];
      for (let x = 0; x < COLS; x++) {
        const v = rnd();
        row.push(x < 2 || x > COLS - 3 ? 0 : v < 0.16 ? 1 : v < 0.24 ? 2 : 0); // 1 skog, 2 berg
      }
      this.terr.push(row);
    }

    this.units = [];
    opts.atk.forEach((u, i) => this.units.push({ ...u, side: 0, tx: i % 2, ty: 1 + Math.floor(i / 2) * 2 % (ROWS - 1), moved: false }));
    opts.def.forEach((u, i) => this.units.push({ ...u, side: 1, tx: COLS - 1 - (i % 2), ty: 1 + Math.floor(i / 2) * 2 % (ROWS - 1), moved: false }));
    // se till att ingen delar ruta
    const seen = new Set();
    for (const u of this.units) {
      while (seen.has(u.tx + ',' + u.ty)) u.ty = (u.ty + 1) % ROWS;
      seen.add(u.tx + ',' + u.ty);
    }

    this.turn = 0;
    this.sel = null;
    this.reach = new Map();     // "x,y" -> sant
    this.attackFrom = new Map(); // enhetsobjekt -> {tx,ty}
    this.klinch = null;
    this.busy = false;
    this.done = false;
    this.floats = [];           // flytande skadetext på kartan

    this.canvas.addEventListener('pointerdown', (e) => {
      const r = this.canvas.getBoundingClientRect();
      const tx = Math.floor((e.clientX - r.left) / r.width * COLS);
      const ty = Math.floor((e.clientY - r.top) / r.height * ROWS);
      this.tapTile(tx, ty);
    });

    this._status('DIN TUR — TRYCK PÅ EN ENHET');
    this._raf = requestAnimationFrame((t) => this._frame(t));
  }

  destroy() { this.done = true; cancelAnimationFrame(this._raf); }
  _status(s) { this.o.setStatus?.(s); }
  unitAt(tx, ty) { return this.units.find((u) => u.tx === tx && u.ty === ty && u.hp > 0); }
  terrDef(u) { return u.type === 'FLYG' ? 0 : this.terr[u.ty][u.tx]; }

  moveCost(type, terr) {
    if (type === 'FLYG') return 1;
    if (terr === 2) return type === 'TANK' ? Infinity : 2;
    if (terr === 1) return type === 'TANK' ? 2 : 1;
    return 1;
  }

  _computeReach(u) {
    this.reach.clear();
    this.attackFrom.clear();
    const mv = UNIT_TYPES[u.type].mv;
    const dist = new Map([[u.tx + ',' + u.ty, 0]]);
    const q = [[u.tx, u.ty, 0]];
    while (q.length) {
      const [x, y, d] = q.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        const occ = this.unitAt(nx, ny);
        if (occ && occ !== u) continue;
        const nd = d + this.moveCost(u.type, this.terr[ny][nx]);
        if (nd > mv) continue;
        const key = nx + ',' + ny;
        if (dist.has(key) && dist.get(key) <= nd) continue;
        dist.set(key, nd);
        q.push([nx, ny, nd]);
      }
    }
    for (const key of dist.keys()) this.reach.set(key, true);
    // vilka fiender kan nås (angränsande till någon nåbar ruta)?
    for (const e of this.units) {
      if (e.side === u.side || e.hp <= 0) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const fx = e.tx + dx, fy = e.ty + dy;
        const key = fx + ',' + fy;
        if (!this.reach.has(key)) continue;
        const occ = this.unitAt(fx, fy);
        if (occ && occ !== u) continue;
        const prev = this.attackFrom.get(e);
        const better = !prev || (Math.abs(fx - u.tx) + Math.abs(fy - u.ty)) < (Math.abs(prev.tx - u.tx) + Math.abs(prev.ty - u.ty));
        if (better) this.attackFrom.set(e, { tx: fx, ty: fy });
      }
    }
  }

  async tapTile(tx, ty) {
    if (this.busy || this.done || this.turn !== 0) return;
    const target = this.unitAt(tx, ty);
    if (this.sel) {
      if (target && target.side === 1 && this.attackFrom.has(target)) {
        const from = this.attackFrom.get(target);
        this.sel.tx = from.tx; this.sel.ty = from.ty;
        await this._attack(this.sel, target);
        this._deselect();
        this._checkAllMoved();
        return;
      }
      if (target && target.side === 0 && !target.moved && target !== this.sel) {
        this.sel = target; this._computeReach(target);
        this._status(`${UNIT_TYPES[target.type].name} — VÄLJ RUTA ELLER FIENDE`);
        return;
      }
      if (!target && this.reach.has(tx + ',' + ty)) {
        this.sel.tx = tx; this.sel.ty = ty;
        this.sel.moved = true;
        this._deselect();
        this._checkAllMoved();
        return;
      }
      this._deselect();
      return;
    }
    if (target && target.side === 0 && !target.moved) {
      this.sel = target;
      this._computeReach(target);
      this._status(`${UNIT_TYPES[target.type].name} HP ${target.hp} — VÄLJ RUTA ELLER FIENDE`);
    }
  }

  _deselect() { this.sel = null; this.reach.clear(); this.attackFrom.clear(); if (this.turn === 0) this._status('DIN TUR'); }

  _checkAllMoved() {
    if (this.units.every((u) => u.side !== 0 || u.hp <= 0 || u.moved)) this.endTurn();
  }

  endTurn() {
    if (this.busy || this.done || this.turn !== 0) return;
    this._deselect();
    this.turn = 1;
    this._status('FIENDENS TUR…');
    this._enemyTurn();
  }

  async _attack(att, def) {
    this.busy = true;
    att.moved = true;
    const dA = attackDamage(att, def, this.terrDef(def));
    const hpAfter = def.hp - dA;
    const adjacent = Math.abs(att.tx - def.tx) + Math.abs(att.ty - def.ty) === 1;
    const dD = hpAfter > 0 && adjacent ? attackDamage({ ...def, hp: hpAfter }, att, this.terrDef(att)) : 0;
    await this._playKlinch(att, def, dA, dD);
    def.hp = Math.max(0, def.hp - dA);
    if (def.hp > 0 && dD) att.hp = Math.max(0, att.hp - dD);
    this.floats.push({ x: def.tx, y: def.ty, txt: '-' + dA, ttl: 1100 });
    if (dD) this.floats.push({ x: att.tx, y: att.ty, txt: '-' + dD, ttl: 1100 });
    this.units = this.units.filter((u) => u.hp > 0);
    this.busy = false;
    this._checkEnd();
  }

  _checkEnd() {
    if (this.done) return true;
    const a = this.units.some((u) => u.side === 0);
    const d = this.units.some((u) => u.side === 1);
    if (a && d) return false;
    this.done = true;
    this.o.onEnd?.({ winner: a ? 0 : 1, survivors: this.units.filter((u) => u.side === 0).map(({ type, hp }) => ({ type, hp })) });
    return true;
  }

  retreat() {
    if (this.done) return;
    this.done = true;
    this.o.onEnd?.({ winner: 1, retreat: true, survivors: this.units.filter((u) => u.side === 0).map(({ type, hp }) => ({ type, hp })) });
  }

  async _enemyTurn() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    await sleep(500);
    for (const u of [...this.units]) {
      if (this.done) return;
      if (u.side !== 1 || u.hp <= 0) continue;
      this._computeReach(u);
      // anfall den spelare som tar mest skada, annars gå mot närmaste
      let best = null, bestDmg = -1;
      for (const [enemy, from] of this.attackFrom) {
        const d = attackDamage(u, enemy, this.terrDef(enemy));
        if (d > bestDmg) { bestDmg = d; best = { enemy, from }; }
      }
      if (best) {
        u.tx = best.from.tx; u.ty = best.from.ty;
        await this._attack(u, best.enemy);
      } else {
        const targets = this.units.filter((x) => x.side === 0);
        if (targets.length) {
          const t = targets.reduce((m, x) => (Math.abs(x.tx - u.tx) + Math.abs(x.ty - u.ty) < Math.abs(m.tx - u.tx) + Math.abs(m.ty - u.ty) ? x : m));
          let bt = null, bd = 1e9;
          for (const key of this.reach.keys()) {
            const [x, y] = key.split(',').map(Number);
            if (this.unitAt(x, y) && this.unitAt(x, y) !== u) continue;
            const d = Math.abs(x - t.tx) + Math.abs(y - t.ty);
            if (d < bd) { bd = d; bt = [x, y]; }
          }
          if (bt) { u.tx = bt[0]; u.ty = bt[1]; }
        }
      }
      this.reach.clear(); this.attackFrom.clear();
      await sleep(320);
      if (this._checkEnd()) return;
    }
    this.turn = 0;
    for (const u of this.units) u.moved = false;
    this._status('DIN TUR');
  }

  // ---------- klinch-skärmen (två paneler, sprites = HP som i Advance Wars) ----------
  _playKlinch(att, def, dA, dD) {
    return new Promise((resolve) => {
      this.o.klinchEl.style.display = 'flex';
      this.klinch = { att, def, dA, dD, t0: null, dur: dD ? 3000 : 2100, resolve };
    });
  }

  _drawKlinch(t) {
    const k = this.klinch;
    if (!k) return;
    if (k.t0 == null) k.t0 = t;
    const el = t - k.t0;
    const c = this.kctx, W = this.kcv.width, H = this.kcv.height;
    const B = this.biome;
    c.imageSmoothingEnabled = false;
    // paneler
    c.fillStyle = B.sky; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(255,255,255,0.06)'; c.fillRect(0, 0, W / 2 - 1, H);
    c.fillStyle = B.ground; c.fillRect(0, H - 34, W, 34);
    c.fillStyle = '#0a0f16'; c.fillRect(W / 2 - 2, 0, 4, H);

    const phase1 = Math.max(0, Math.min(1, (el - 500) / 900));    // anfallet
    const phase2 = k.dD ? Math.max(0, Math.min(1, (el - 1900) / 900)) : 0; // motanfallet
    const defHpShown = k.def.hp - Math.round(k.dA * phase1);
    const attHpShown = k.att.hp - Math.round((k.dD || 0) * phase2);

    const panel = (u, hpShown, x0, facing, color, flashing) => {
      const n = Math.max(hpShown > 0 ? 1 : 0, Math.ceil(hpShown / 2));
      for (let i = 0; i < n; i++) {
        const px = x0 + (i % 3) * 46 + (facing === 1 ? 6 : 14);
        const py = H - 76 + Math.floor(i / 3) * 30 + (i % 2) * 4;
        if (flashing && Math.floor(t / 60) % 2 === 0) {
          c.globalAlpha = 0.55;
        }
        drawUnit(c, u.type, color, px, py, 4, facing);
        c.globalAlpha = 1;
      }
      // stor HP-siffra
      c.font = '16px "Press Start 2P", monospace';
      c.textAlign = facing === 1 ? 'left' : 'right';
      c.textBaseline = 'top';
      c.fillStyle = '#0a0f16';
      c.fillText(String(Math.max(0, hpShown)), x0 + (facing === 1 ? 10 : 152) + 2, 12 + 2);
      c.fillStyle = hpShown > 6 ? '#fff' : hpShown > 3 ? '#ffd24f' : '#ff6b5e';
      c.fillText(String(Math.max(0, hpShown)), x0 + (facing === 1 ? 10 : 152), 12);
      c.font = '7px "Press Start 2P", monospace';
      c.fillStyle = color;
      c.fillText(UNIT_TYPES[u.type].name, x0 + (facing === 1 ? 10 : 152), 34);
    };

    const attackerFlashing = phase2 > 0 && phase2 < 1;
    const defenderFlashing = phase1 > 0 && phase1 < 1;
    panel(k.att, attHpShown, 0, 1, P_COL, attackerFlashing);
    panel(k.def, defHpShown, W / 2, -1, E_COL, defenderFlashing);

    // mynningsflammor
    const flash = (x, y) => {
      c.fillStyle = Math.floor(t / 50) % 2 ? '#fff' : '#ffd24f';
      c.fillRect(x, y, 6, 4);
      c.fillRect(x + 4, y - 3, 4, 3);
    };
    if (defenderFlashing) flash(W / 2 - 26, H - 62);
    if (attackerFlashing) flash(W / 2 + 20, H - 62);

    // skadetext
    if (phase1 > 0.1) {
      c.font = '11px "Press Start 2P", monospace';
      c.fillStyle = '#ff6b5e';
      c.textAlign = 'center';
      c.fillText('-' + k.dA, W * 0.75, 56 - phase1 * 14);
    }
    if (phase2 > 0.1) {
      c.font = '11px "Press Start 2P", monospace';
      c.fillStyle = '#ff6b5e';
      c.textAlign = 'center';
      c.fillText('-' + k.dD, W * 0.25, 56 - phase2 * 14);
    }

    if (el >= k.dur) {
      this.o.klinchEl.style.display = 'none';
      const r = k.resolve;
      this.klinch = null;
      r();
    }
  }

  // ---------- ritning ----------
  _frame(t) {
    if (this.done) { this._draw(t); return; }
    this._draw(t);
    if (this.klinch) this._drawKlinch(t);
    this._raf = requestAnimationFrame((tt) => this._frame(tt));
  }

  _draw(t) {
    const c = this.ctx, B = this.biome;
    c.imageSmoothingEnabled = false;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = x * TILE, py = y * TILE;
        c.fillStyle = (x + y) % 2 ? B.ground : B.alt2;
        c.fillRect(px, py, TILE, TILE);
        const terr = this.terr[y][x];
        if (terr === 1) { // skog
          c.fillStyle = B.forest;
          c.fillRect(px + 4, py + 10, 10, 14); c.fillRect(px + 17, py + 6, 10, 18);
          c.fillRect(px + 7, py + 4, 4, 8); c.fillRect(px + 20, py + 2, 4, 6);
        } else if (terr === 2) { // berg
          c.fillStyle = B.mount;
          c.fillRect(px + 6, py + 14, 20, 12); c.fillRect(px + 10, py + 8, 12, 8);
          c.fillStyle = '#e8eef4'; c.fillRect(px + 13, py + 8, 6, 3);
        }
      }
    }
    // rutnät
    c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { c.beginPath(); c.moveTo(x * TILE, 0); c.lineTo(x * TILE, ROWS * TILE); c.stroke(); }
    for (let y = 0; y <= ROWS; y++) { c.beginPath(); c.moveTo(0, y * TILE); c.lineTo(COLS * TILE, y * TILE); c.stroke(); }

    // räckvidd
    if (this.sel) {
      c.fillStyle = 'rgba(120,220,255,0.28)';
      for (const key of this.reach.keys()) {
        const [x, y] = key.split(',').map(Number);
        c.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }

    // enheter
    for (const u of this.units) {
      const px = u.tx * TILE + 4, py = u.ty * TILE + 3;
      if (u.side === 0 && u.moved && this.turn === 0) c.globalAlpha = 0.5;
      drawUnit(c, u.type, u.side === 0 ? P_COL : E_COL, px, py, 2, u.side === 0 ? 1 : -1);
      c.globalAlpha = 1;
      drawHpBadge(c, u.hp, u.tx * TILE + TILE - 12, u.ty * TILE + TILE - 10, 1);
      if (u === this.sel) {
        c.strokeStyle = Math.floor(t / 250) % 2 ? '#fff' : '#ffd24f';
        c.lineWidth = 2;
        c.strokeRect(u.tx * TILE + 1, u.ty * TILE + 1, TILE - 2, TILE - 2);
      }
    }
    // anfallsmål
    if (this.sel) {
      for (const e of this.attackFrom.keys()) {
        c.strokeStyle = Math.floor(t / 180) % 2 ? '#ff4f4f' : '#ffb02e';
        c.lineWidth = 2;
        c.strokeRect(e.tx * TILE + 2, e.ty * TILE + 2, TILE - 4, TILE - 4);
      }
    }
    // flytande skadetext
    for (const f of this.floats) {
      f.ttl -= 16;
      c.font = '9px "Press Start 2P", monospace';
      c.textAlign = 'center';
      c.fillStyle = '#ff6b5e';
      c.fillText(f.txt, f.x * TILE + TILE / 2, f.y * TILE - 2 - (1100 - f.ttl) / 90);
    }
    this.floats = this.floats.filter((f) => f.ttl > 0);
  }
}
