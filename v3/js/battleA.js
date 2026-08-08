// IMPERIUM v3 — PROTOTYP A: turbaserad taktikstrid à la Advance Wars
// Karta med vägar (snabb förflyttning), flod med bro, skog/berg/städer
// (försvarsbonus), klinch-skärm där antalet sprites speglar HP.
import { UNIT_TYPES, attackDamage, drawUnit, drawHpBadge, BIOMES, drawTree, drawHouse, drawMountain, tint, lighten, warSprite } from './units.js';

const COLS = 13, ROWS = 8, TILE = 32;
const P_COL = '#ff4f4f', E_COL = '#4fa8ff';

// terrängkoder: 0 slätt, 1 skog, 2 berg, 3 väg, 4 flod, 5 bro, 6 stad
const DEF_BONUS = { 0: 0, 1: 1, 2: 2, 3: 0, 4: 0, 5: 0, 6: 3 };
const TERR_NAME = { 0: 'SLÄTT', 1: 'SKOG', 2: 'BERG', 3: 'VÄG', 4: 'FLOD', 5: 'BRO', 6: 'STAD' };

function mulberry(seed) {
  let a = seed | 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function tileHash(x, y) { return Math.abs((x * 73856093) ^ (y * 19349663)) % 997; }

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
    this.kcv.width = 420; this.kcv.height = 170;

    this._genMap(mulberry(opts.seed || 7));

    this.units = [];
    opts.atk.forEach((u, i) => this.units.push({ ...u, side: 0, tx: i % 2, ty: 1 + Math.floor(i / 2) * 2 % (ROWS - 1), moved: false }));
    opts.def.forEach((u, i) => this.units.push({ ...u, side: 1, tx: COLS - 1 - (i % 2), ty: 1 + Math.floor(i / 2) * 2 % (ROWS - 1), moved: false }));
    const seen = new Set();
    for (const u of this.units) {
      while (seen.has(u.tx + ',' + u.ty) || this.terr[u.ty][u.tx] === 2 || this.terr[u.ty][u.tx] === 4) u.ty = (u.ty + 1) % ROWS;
      seen.add(u.tx + ',' + u.ty);
    }

    this.turn = 0;
    this.sel = null;
    this.reach = new Map();
    this.attackFrom = new Map();
    this.klinch = null;
    this.busy = false;
    this.done = false;
    this.floats = [];

    this.canvas.addEventListener('pointerdown', (e) => {
      const r = this.canvas.getBoundingClientRect();
      const tx = Math.floor((e.clientX - r.left) / r.width * COLS);
      const ty = Math.floor((e.clientY - r.top) / r.height * ROWS);
      this.tapTile(tx, ty);
    });

    this._status('DIN TUR — TRYCK PÅ EN ENHET');
    this._raf = requestAnimationFrame((t) => this._frame(t));
  }

  _genMap(rnd) {
    this.terr = [];
    for (let y = 0; y < ROWS; y++) {
      const row = [];
      for (let x = 0; x < COLS; x++) {
        const v = rnd();
        row.push(x < 2 || x > COLS - 3 ? 0 : v < 0.16 ? 1 : v < 0.24 ? 2 : 0);
      }
      this.terr.push(row);
    }
    // flod uppifrån och ner med drift
    let rx = 5 + Math.floor(rnd() * 3);
    for (let y = 0; y < ROWS; y++) {
      this.terr[y][rx] = 4;
      if (rnd() < 0.45) rx = Math.max(4, Math.min(8, rx + (rnd() < 0.5 ? -1 : 1)));
    }
    // väg tvärs över med drift; över floden blir det bro
    const road = (x, y) => { this.terr[y][x] = this.terr[y][x] === 4 ? 5 : 3; };
    let ry = 2 + Math.floor(rnd() * 4);
    for (let x = 0; x < COLS; x++) {
      road(x, ry);
      if (x < COLS - 1 && rnd() < 0.3) {
        const ny = Math.max(1, Math.min(ROWS - 2, ry + (rnd() < 0.5 ? -1 : 1)));
        if (ny !== ry) { road(x, ny); ry = ny; }
      }
    }
    // städer på lediga slätter
    let cities = 0;
    for (let tries = 0; tries < 30 && cities < 3; tries++) {
      const x = 2 + Math.floor(rnd() * (COLS - 4));
      const y = Math.floor(rnd() * ROWS);
      if (this.terr[y][x] === 0) { this.terr[y][x] = 6; cities++; }
    }
  }

  destroy() { this.done = true; cancelAnimationFrame(this._raf); }
  _status(s) { this.o.setStatus?.(s); }
  unitAt(tx, ty) { return this.units.find((u) => u.tx === tx && u.ty === ty && u.hp > 0); }
  terrDef(u) { return u.type === 'FLYG' ? 0 : DEF_BONUS[this.terr[u.ty][u.tx]]; }

  moveCost(type, terr) {
    if (type === 'FLYG') return 1;
    switch (terr) {
      case 1: return type === 'TANK' ? 2 : 1;
      case 2: return type === 'TANK' ? Infinity : 2;
      case 3: case 5: return type === 'TANK' ? 0.5 : 1;
      case 4: return type === 'TANK' ? Infinity : 2;
      default: return 1;
    }
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
        this._selStatus(target);
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
      this._selStatus(target);
    }
  }

  _selStatus(u) {
    const t = TERR_NAME[this.terr[u.ty][u.tx]];
    const d = this.terrDef(u);
    this._status(`${UNIT_TYPES[u.type].name} HP ${u.hp} • ${t}${d ? ` (FÖRSVAR +${d})` : ''} — VÄLJ RUTA/FIENDE`);
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
    const boost = this.o.atkBoost || {};
    const dA = Math.min(10, attackDamage(att, def, this.terrDef(def)) + (att.side === 0 ? (boost[att.type] || 0) : 0));
    const hpAfter = def.hp - dA;
    const adjacent = Math.abs(att.tx - def.tx) + Math.abs(att.ty - def.ty) === 1;
    const dD = hpAfter > 0 && adjacent
      ? Math.min(10, attackDamage({ ...def, hp: hpAfter }, att, this.terrDef(att)) + (def.side === 0 ? (boost[def.type] || 0) : 0))
      : 0;
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

  // ---------- klinch-skärmen ----------
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

    // himmel + moln + mark
    c.fillStyle = B.sky; c.fillRect(0, 0, W, H);
    c.fillStyle = lighten(B.sky, 0.5);
    c.fillRect(30, 22, 34, 7); c.fillRect(44, 16, 18, 7);
    c.fillRect(W - 90, 30, 40, 8); c.fillRect(W - 76, 24, 20, 7);
    c.fillStyle = lighten(B.ground, 0.15); c.fillRect(0, H - 46, W, 6);
    c.fillStyle = B.ground; c.fillRect(0, H - 40, W, 40);
    c.fillStyle = tint(B.ground, 0.8);
    for (let i = 0; i < 12; i++) c.fillRect((i * 37 + 12) % W, H - 34 + (i % 3) * 9, 7, 2);
    c.fillStyle = '#0a0f16'; c.fillRect(W / 2 - 2, 0, 4, H);

    const phase1 = Math.max(0, Math.min(1, (el - 500) / 900));
    const phase2 = k.dD ? Math.max(0, Math.min(1, (el - 1900) / 900)) : 0;
    const attackerFiring = phase1 > 0 && phase1 < 1;
    const defenderFiring = phase2 > 0 && phase2 < 1;

    // Spelaren står ALLTID till vänster (röd), fienden till höger (blå).
    // Vem som skjuter först styrs av vem som anfaller — på fiendens tur
    // skjuter fienden först och dina trupper tar skadan först.
    const hpOf = (u) => (u === k.att
      ? u.hp - Math.round((k.dD || 0) * phase2)
      : u.hp - Math.round(k.dA * phase1));
    const firingNow = (u) => (u === k.att ? attackerFiring : defenderFiring);
    const flashingNow = (u) => (u === k.att ? defenderFiring : attackerFiring);
    const leftU = k.att.side === 0 ? k.att : k.def;
    const rightU = leftU === k.att ? k.def : k.att;

    const panel = (u, hpShown, x0, facing, color, flashing, firing) => {
      const ws = warSprite(u.type, u.side, facing);
      if (ws) {
        // riktiga sprites (BerkleyToreno): 1–3 fordon beroende på HP
        const n2 = Math.max(hpShown > 0 ? 1 : 0, Math.min(3, Math.ceil(hpShown / 4)));
        const sc = 1.15;
        const offs = [[16, 0], [78, -22], [44, 12]];
        for (let i = n2 - 1; i >= 0; i--) {
          const recoil = firing ? facing * (Math.floor(t / 90) % 2 ? 2 : 0) : 0;
          const dw = Math.round(ws.width * sc), dh = Math.round(ws.height * sc);
          const px = x0 + (facing === 1 ? offs[i][0] : W / 2 - offs[i][0] - dw) + recoil;
          const py = H - 44 - dh + offs[i][1];
          if (flashing && Math.floor(t / 60) % 2 === 0) c.globalAlpha = 0.5;
          c.drawImage(ws, px, py, dw, dh);
          c.globalAlpha = 1;
        }
      } else {
        const n = Math.max(hpShown > 0 ? 1 : 0, Math.ceil(hpShown / 2));
        for (let i = 0; i < n; i++) {
          const recoil = firing && i < 3 ? facing * (Math.floor(t / 90) % 2 ? 2 : 0) : 0;
          const px = x0 + (i % 3) * 52 + (facing === 1 ? 8 : 16) + recoil;
          const py = H - 96 + Math.floor(i / 3) * 34 + (i % 2) * 4;
          if (flashing && Math.floor(t / 60) % 2 === 0) c.globalAlpha = 0.5;
          drawUnit(c, u.type, color, px, py, 4, facing);
          c.globalAlpha = 1;
        }
      }
      c.font = '16px "Press Start 2P", monospace';
      c.textAlign = facing === 1 ? 'left' : 'right';
      c.textBaseline = 'top';
      c.fillStyle = '#0a0f16';
      c.fillText(String(Math.max(0, hpShown)), x0 + (facing === 1 ? 10 : 192) + 2, 12 + 2);
      c.fillStyle = hpShown > 6 ? '#fff' : hpShown > 3 ? '#ffd24f' : '#ff6b5e';
      c.fillText(String(Math.max(0, hpShown)), x0 + (facing === 1 ? 10 : 192), 12);
      c.font = '7px "Press Start 2P", monospace';
      c.fillStyle = '#0a0f16';
      c.fillText(UNIT_TYPES[u.type].name, x0 + (facing === 1 ? 10 : 192) + 1, 35);
      c.fillStyle = color;
      c.fillText(UNIT_TYPES[u.type].name, x0 + (facing === 1 ? 10 : 192), 34);
    };

    panel(leftU, hpOf(leftU), 0, 1, leftU.side === 0 ? P_COL : E_COL, flashingNow(leftU), firingNow(leftU));
    panel(rightU, hpOf(rightU), W / 2, -1, rightU.side === 0 ? P_COL : E_COL, flashingNow(rightU), firingNow(rightU));

    const flash = (x, y) => {
      c.fillStyle = Math.floor(t / 50) % 2 ? '#fff' : '#ffd24f';
      c.fillRect(x, y, 8, 5);
      c.fillRect(x + 6, y - 4, 5, 4);
      c.fillRect(x + 3, y + 4, 4, 3);
    };
    if (firingNow(leftU)) flash(W / 2 - 34, H - 78);
    if (firingNow(rightU)) flash(W / 2 + 26, H - 78);

    // skadesiffran visas över den som TAR skadan
    const sideX = (u) => (u === leftU ? W * 0.25 : W * 0.75);
    if (phase1 > 0.1) {
      c.font = '12px "Press Start 2P", monospace';
      c.fillStyle = '#ff6b5e';
      c.textAlign = 'center';
      c.fillText('-' + k.dA, sideX(k.def), 60 - phase1 * 16);
    }
    if (phase2 > 0.1) {
      c.font = '12px "Press Start 2P", monospace';
      c.fillStyle = '#ff6b5e';
      c.textAlign = 'center';
      c.fillText('-' + k.dD, sideX(k.att), 60 - phase2 * 16);
    }

    if (el >= k.dur) {
      this.o.klinchEl.style.display = 'none';
      const r = k.resolve;
      this.klinch = null;
      r();
    }
  }

  // ---------- kartritning ----------
  _frame(t) {
    if (this.done) { this._draw(t); return; }
    this._draw(t);
    if (this.klinch) this._drawKlinch(t);
    this._raf = requestAnimationFrame((tt) => this._frame(tt));
  }

  _roadish(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    return this.terr[y][x] === 3 || this.terr[y][x] === 5;
  }
  _waterish(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
    return this.terr[y][x] === 4 || this.terr[y][x] === 5;
  }

  _drawTile(c, x, y, t) {
    const B = this.biome;
    const px = x * TILE, py = y * TILE;
    const h = tileHash(x, y);

    if (t === 4 || t === 5) {
      // vatten med vågor + mörkare strandkanter
      c.fillStyle = B.water;
      c.fillRect(px, py, TILE, TILE);
      c.fillStyle = B.water2;
      c.fillRect(px + 4 + h % 9, py + 6 + h % 5, 7, 2);
      c.fillRect(px + 14 - h % 6, py + 20 + h % 4, 8, 2);
      const bank = tint(B.water, 0.6);
      c.fillStyle = bank;
      if (!this._waterish(x - 1, y)) c.fillRect(px, py, 2, TILE);
      if (!this._waterish(x + 1, y)) c.fillRect(px + TILE - 2, py, 2, TILE);
      if (!this._waterish(x, y - 1)) c.fillRect(px, py, TILE, 2);
      if (!this._waterish(x, y + 1)) c.fillRect(px, py + TILE - 2, TILE, 2);
    } else {
      c.fillStyle = (x + y) % 2 ? B.ground : B.ground2;
      c.fillRect(px, py, TILE, TILE);
      if (t === 0) {
        c.fillStyle = B.tuft;
        c.fillRect(px + 4 + h % 8, py + 5 + h % 9, 3, 1);
        c.fillRect(px + 18 + h % 6, py + 14 + h % 7, 3, 1);
        c.fillRect(px + 9 + h % 5, py + 22 + h % 5, 3, 1);
      }
    }

    if (t === 3 || t === 5) {
      const E = this._roadish(x + 1, y), Wn = this._roadish(x - 1, y);
      const N = this._roadish(x, y - 1), S = this._roadish(x, y + 1);
      const horiz = E || Wn || (!N && !S);
      const vert = N || S;
      c.fillStyle = B.roadEdge;
      if (horiz) c.fillRect(px, py + 8, TILE, 16);
      if (vert) c.fillRect(px + 8, py, 16, TILE);
      c.fillStyle = B.road;
      if (horiz) c.fillRect(px, py + 10, TILE, 12);
      if (vert) c.fillRect(px + 10, py, 12, TILE);
      if (t === 5) {
        // broplankor + räcke
        c.fillStyle = tint(B.road, 0.7);
        if (horiz) for (let i = 0; i < 5; i++) c.fillRect(px + 2 + i * 7, py + 10, 2, 12);
        else for (let i = 0; i < 5; i++) c.fillRect(px + 10, py + 2 + i * 7, 12, 2);
        c.fillStyle = '#39424e';
        if (horiz) { c.fillRect(px, py + 8, TILE, 2); c.fillRect(px, py + 22, TILE, 2); }
        else { c.fillRect(px + 8, py, 2, TILE); c.fillRect(px + 22, py, 2, TILE); }
      }
    } else if (t === 1) {
      c.fillStyle = tint(B.ground2, 0.85);
      c.fillRect(px + 2, py + 24, 26, 5);
      drawTree(c, B, px + 1, py + 14, 1.1);
      drawTree(c, B, px + 16, py + 4, 1.1);
    } else if (t === 2) {
      drawMountain(c, B, px + 2, py + 2, 1.8);
    } else if (t === 6) {
      drawHouse(c, B, px + 3, py + 4, 1.6);
      c.fillStyle = tint(B.wall, 0.6);
      c.fillRect(px + 26, py + 22, 5, 8);
      c.fillStyle = B.roof;
      c.fillRect(px + 25, py + 20, 7, 3);
    }
  }

  _draw(t) {
    const c = this.ctx;
    c.imageSmoothingEnabled = false;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) this._drawTile(c, x, y, this.terr[y][x]);

    c.strokeStyle = 'rgba(0,0,0,0.13)';
    c.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { c.beginPath(); c.moveTo(x * TILE, 0); c.lineTo(x * TILE, ROWS * TILE); c.stroke(); }
    for (let y = 0; y <= ROWS; y++) { c.beginPath(); c.moveTo(0, y * TILE); c.lineTo(COLS * TILE, y * TILE); c.stroke(); }

    if (this.sel) {
      c.fillStyle = 'rgba(120,220,255,0.30)';
      for (const key of this.reach.keys()) {
        const [x, y] = key.split(',').map(Number);
        c.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }

    for (const u of this.units) {
      const px = u.tx * TILE, py = u.ty * TILE + 2;
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
    if (this.sel) {
      for (const e of this.attackFrom.keys()) {
        c.strokeStyle = Math.floor(t / 180) % 2 ? '#ff4f4f' : '#ffb02e';
        c.lineWidth = 2;
        c.strokeRect(e.tx * TILE + 2, e.ty * TILE + 2, TILE - 4, TILE - 4);
      }
    }
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
