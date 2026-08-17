// IMPERIUM — 3D-planeten (XCOM 2 Geoscape-anda).
//
// Handskriven WebGL, ingen 3D-motor: spelet laddar redan d3 + topojson + peerjs
// och ska starta snabbt på Henrys mobil, så en 600 kB motor för EN sfär vore
// dåligt köp. Vi behöver bara: en texturerad sfär med riktiga bergshöjder,
// sol/terminator, holografisk atmosfärsrand, ett molnlager och ett stjärnfält.
//
// Världskartan ritas av globe.js som en EKVIREKTANGULÄR textur — exakt samma
// ritkod som i pixelläget — och läggs här på klotet. Markörer (arméer, städer,
// etiketter) ritas fortfarande i 2D ovanpå via project(), så all pixelkonst är
// kvar precis som förut.

const SEG_X = 256;   // längdgrader
const SEG_Y = 128;   // breddgrader
const R_CLOUD = 1.018;
const R_ATMO = 1.16;
const FOV_Y = 32 * Math.PI / 180;
const RELIEF = 0.034;   // bergens höjd i klotradier

// ---------- liten matrisverktygslåda ----------
function mul(a, b) {
  const o = new Float32Array(16);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
  }
  return o;
}

function perspective(fovY, aspect, near, far) {
  const f = 1 / Math.tan(fovY / 2);
  const o = new Float32Array(16);
  o[0] = f / aspect; o[5] = f;
  o[10] = (far + near) / (near - far); o[11] = -1;
  o[14] = (2 * far * near) / (near - far);
  return o;
}

function lookAt(eye, up) {
  // målet är alltid origo (klotets mitt)
  const z = norm([eye[0], eye[1], eye[2]]);
  let x = norm(cross(up, z));
  if (!isFinite(x[0])) x = [1, 0, 0];
  const y = cross(z, x);
  const o = new Float32Array(16);
  o[0] = x[0]; o[4] = x[1]; o[8] = x[2]; o[12] = -dot(x, eye);
  o[1] = y[0]; o[5] = y[1]; o[9] = y[2]; o[13] = -dot(y, eye);
  o[2] = z[0]; o[6] = z[1]; o[10] = z[2]; o[14] = -dot(z, eye);
  o[15] = 1;
  return o;
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }

// lon/lat (grader) → punkt på enhetssfären. Samma orientering som texturens UV.
export function llToVec(lon, lat) {
  const a = lon * Math.PI / 180, b = lat * Math.PI / 180;
  const cb = Math.cos(b);
  return [cb * Math.sin(a), Math.sin(b), cb * Math.cos(a)];
}

function vecToLl(v) {
  const lat = Math.asin(Math.max(-1, Math.min(1, v[1]))) * 180 / Math.PI;
  const lon = Math.atan2(v[0], v[2]) * 180 / Math.PI;
  return [lon, lat];
}

// ---------- shaders (GLSL ES 1.00 — fungerar i både WebGL1 och WebGL2) ----------
const VS_GLOBE = `
attribute vec3 aPos;
attribute vec3 aNrm;
attribute vec2 aUV;
attribute float aH;
uniform mat4 uMVP;
uniform float uRelief;
varying vec2 vUV; varying vec3 vN; varying vec3 vP; varying float vH;
void main() {
  vec3 p = aPos * (1.0 + aH * uRelief);
  vUV = aUV; vN = aNrm; vP = p; vH = aH;
  gl_Position = uMVP * vec4(p, 1.0);
}`;

const FS_GLOBE = `
precision mediump float;
uniform sampler2D uDay;
uniform sampler2D uSel;
uniform vec3 uSun;
uniform vec3 uEye;
uniform float uSelA;
uniform float uTime;
varying vec2 vUV; varying vec3 vN; varying vec3 vP; varying float vH;
void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(uEye - vP);
  vec3 tex = texture2D(uDay, vUV).rgb;
  float lam = dot(N, uSun);
  float day = smoothstep(-0.16, 0.26, lam);
  // nattsidan behåller konturerna svagt — stadsljusen ritas i 2D-lagret ovanpå
  vec3 night = tex * 0.36 + vec3(0.012, 0.035, 0.075);
  vec3 col = mix(night, tex, day);
  // gryning/skymning i varm ton längs terminatorn
  float dusk = exp(-pow((lam + 0.02) * 11.0, 2.0));
  col += vec3(0.30, 0.13, 0.04) * dusk * 0.5;
  // bergen fångar dagsljuset
  // bergen: ljusfångande sluttningar och snö på de högsta topparna
  col += vec3(0.58, 0.60, 0.64) * vH * (0.25 + 0.75 * day) * 0.40;
  float snow = smoothstep(0.62, 0.98, vH);
  col = mix(col, vec3(0.90, 0.95, 1.0) * (0.30 + 0.70 * day), snow * 0.55);
  // holografisk kantglöd — geoscape-känslan
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  col += vec3(0.18, 0.70, 1.0) * fres * (0.30 + 0.50 * day);
  // svaga scanlines
  col *= 0.968 + 0.032 * sin(vUV.y * 820.0 + uTime * 0.5);
  // markerat land pulserar bärnstensgult
  float sel = texture2D(uSel, vUV).a;
  col = mix(col, vec3(1.0, 0.72, 0.24), sel * uSelA * 0.62);
  gl_FragColor = vec4(col, 1.0);
}`;

const VS_SIMPLE = `
attribute vec3 aPos;
attribute vec3 aNrm;
attribute vec2 aUV;
uniform mat4 uMVP;
uniform float uScale;
varying vec2 vUV; varying vec3 vN; varying vec3 vP;
void main() {
  vec3 p = aPos * uScale;
  vUV = aUV; vN = normalize(aPos); vP = p;
  gl_Position = uMVP * vec4(p, 1.0);
}`;

const FS_ATMO = `
precision mediump float;
uniform vec3 uSun; uniform vec3 uEye;
varying vec2 vUV; varying vec3 vN; varying vec3 vP;
void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(uEye - vP);
  // starkast där skalet ses kant-i-kant, dvs precis utanför planetranden
  float rim = pow(1.0 - abs(dot(N, V)), 3.2);
  float sun = clamp(dot(N, uSun) + 0.42, 0.0, 1.0);
  vec3 col = mix(vec3(0.05, 0.35, 0.75), vec3(0.35, 0.85, 1.0), sun);
  gl_FragColor = vec4(col * rim * (0.30 + 0.85 * sun), 1.0);
}`;

const FS_CLOUD = `
precision mediump float;
uniform sampler2D uTex;
uniform vec3 uSun; uniform float uDrift;
varying vec2 vUV; varying vec3 vN; varying vec3 vP;
void main() {
  vec3 N = normalize(vN);
  float lam = dot(N, uSun);
  float day = smoothstep(-0.12, 0.30, lam);
  float a = texture2D(uTex, vec2(vUV.x + uDrift, vUV.y)).a;
  vec3 col = mix(vec3(0.10, 0.16, 0.26), vec3(0.92, 0.96, 1.0), day);
  gl_FragColor = vec4(col, a * (0.06 + 0.22 * day));
}`;

const VS_STARS = `
attribute vec2 aXY;
varying vec2 vNdc;
void main() { vNdc = aXY; gl_Position = vec4(aXY, 0.999, 1.0); }`;

const FS_STARS = `
precision highp float;
uniform vec3 uRight; uniform vec3 uUp; uniform vec3 uFwd;
uniform float uTanH; uniform float uAspect; uniform float uTime;
varying vec2 vNdc;
float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
void main() {
  vec3 d = normalize(uFwd + uRight * (vNdc.x * uTanH * uAspect) + uUp * (vNdc.y * uTanH));
  vec3 col = vec3(0.004, 0.010, 0.022);
  // svag nebulosa så rymden inte blir platt svart
  col += vec3(0.02, 0.05, 0.10) * pow(max(0.0, d.y * 0.5 + 0.5), 2.0) * 0.5;
  vec3 g = d * 55.0;
  vec3 cell = floor(g);
  for (int i = -1; i <= 0; i++) {
    for (int j = -1; j <= 0; j++) {
      for (int k = -1; k <= 0; k++) {
        vec3 c = cell + vec3(float(i), float(j), float(k));
        float h = hash(c);
        if (h < 0.955) continue;
        vec3 sp = c + vec3(hash(c + 1.0), hash(c + 2.0), hash(c + 3.0));
        float dist = length(normalize(sp) - d) * 55.0;
        float tw = 0.70 + 0.30 * sin(uTime * 1.6 + h * 40.0);
        float b = smoothstep(0.085, 0.0, dist) * tw;
        vec3 tint = mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.92, 0.78), hash(c + 7.0));
        col += tint * b * 1.15;
      }
    }
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export class Globe3D {
  constructor(canvas) {
    this.canvas = canvas;
    const opts = { antialias: true, alpha: false, depth: true, powerPreference: 'high-performance' };
    this.gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts)
      || canvas.getContext('experimental-webgl', opts);
    this.ok = !!this.gl;
    if (!this.ok) return;

    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.004, 0.010, 0.020, 1);

    this.progGlobe = this._program(VS_GLOBE, FS_GLOBE);
    this.progAtmo = this._program(VS_SIMPLE, FS_ATMO);
    this.progCloud = this._program(VS_SIMPLE, FS_CLOUD);
    this.progStars = this._program(VS_STARS, FS_STARS);

    this._buildSphere(null);
    this._quad = this._buffer(new Float32Array([-1, -1, 3, -1, -1, 3]));

    this.dayTex = this._texture();
    this.selTex = this._texture();
    this.cloudTex = this._texture(this._makeCloudCanvas());

    // 4K-textur där hårdvaran klarar det — annars blir inzoomade vyer suddiga
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
    this.texSize = (maxTex >= 4096 && Math.min(screen.width, screen.height) > 700) ? 4096 : 2048;
    this.sun = [1, 0, 0];
    this.relief = RELIEF;
    this.selAlpha = 0;
    this.eye = [0, 0, 3];
    this.dist = 3;
    this.center = [0, 0];
    this.bufW = 1; this.bufH = 1;
  }

  // ---------- uppsättning ----------
  _program(vsSrc, fsSrc) {
    const gl = this.gl;
    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('shader:', gl.getShaderInfoLog(s), src.slice(0, 120));
      }
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, mk(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error('link:', gl.getProgramInfoLog(p));
    // slå upp allt en gång — uniformLocation-anrop per frame är onödigt dyrt
    p.u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      p.u[info.name] = gl.getUniformLocation(p, info.name);
    }
    p.a = {};
    const m = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < m; i++) {
      const info = gl.getActiveAttrib(p, i);
      p.a[info.name] = gl.getAttribLocation(p, info.name);
    }
    return p;
  }

  _buffer(data, target) {
    const gl = this.gl;
    const t = target || gl.ARRAY_BUFFER;
    const b = gl.createBuffer();
    gl.bindBuffer(t, b);
    gl.bufferData(t, data, gl.STATIC_DRAW);
    return b;
  }

  _texture(source) {
    const gl = this.gl;
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (source) this._upload(t, source);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    return t;
  }

  _upload(tex, canvas) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    const pot = (n) => (n & (n - 1)) === 0;
    if (pot(canvas.width) && pot(canvas.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
  }

  // Sfärnät med UV och (valfria) bergshöjder. Höjdfältet kommer som en
  // gråskalecanvas i ekvirektangulär projektion — samma bergskedjor som
  // terrängläget ritar, så 2D och 3D visar samma värld.
  _buildSphere(heightCanvas) {
    const gl = this.gl;
    const nx = SEG_X, ny = SEG_Y;
    const nv = (nx + 1) * (ny + 1);
    const pos = new Float32Array(nv * 3);
    const uv = new Float32Array(nv * 2);
    const hgt = new Float32Array(nv);
    const nrm = new Float32Array(nv * 3);

    let H = null, HW = 0, HH = 0;
    if (heightCanvas) {
      const hc = heightCanvas.getContext('2d');
      HW = heightCanvas.width; HH = heightCanvas.height;
      H = hc.getImageData(0, 0, HW, HH).data;
    }
    const sampleH = (u, v) => {
      if (!H) return 0;
      const x = Math.min(HW - 1, Math.max(0, Math.round(u * (HW - 1))));
      const y = Math.min(HH - 1, Math.max(0, Math.round(v * (HH - 1))));
      return H[(y * HW + x) * 4] / 255;
    };

    for (let j = 0; j <= ny; j++) {
      const v = j / ny;
      const lat = 90 - v * 180;
      for (let i = 0; i <= nx; i++) {
        const u = i / nx;
        const lon = -180 + u * 360;
        const k = j * (nx + 1) + i;
        const p = llToVec(lon, lat);
        pos[k * 3] = p[0]; pos[k * 3 + 1] = p[1]; pos[k * 3 + 2] = p[2];
        uv[k * 2] = u; uv[k * 2 + 1] = v;
        hgt[k] = sampleH(u, v);
      }
    }

    const idx = new Uint16Array(nx * ny * 6);
    let o = 0;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
        idx[o++] = a; idx[o++] = c; idx[o++] = b;
        idx[o++] = b; idx[o++] = c; idx[o++] = d;
      }
    }

    // normaler ur den FÖRSKJUTNA geometrin, annars ser bergen platta ut
    const dp = new Float32Array(nv * 3);
    for (let k = 0; k < nv; k++) {
      const s = 1 + hgt[k] * RELIEF;
      dp[k * 3] = pos[k * 3] * s; dp[k * 3 + 1] = pos[k * 3 + 1] * s; dp[k * 3 + 2] = pos[k * 3 + 2] * s;
    }
    for (let t = 0; t < idx.length; t += 3) {
      const i0 = idx[t] * 3, i1 = idx[t + 1] * 3, i2 = idx[t + 2] * 3;
      const ux = dp[i1] - dp[i0], uy = dp[i1 + 1] - dp[i0 + 1], uz = dp[i1 + 2] - dp[i0 + 2];
      const vx = dp[i2] - dp[i0], vy = dp[i2 + 1] - dp[i0 + 1], vz = dp[i2 + 2] - dp[i0 + 2];
      const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
      for (const b of [i0, i1, i2]) { nrm[b] += cx; nrm[b + 1] += cy; nrm[b + 2] += cz; }
    }
    for (let k = 0; k < nv; k++) {
      const l = Math.hypot(nrm[k * 3], nrm[k * 3 + 1], nrm[k * 3 + 2]) || 1;
      nrm[k * 3] /= l; nrm[k * 3 + 1] /= l; nrm[k * 3 + 2] /= l;
    }

    if (this.bPos) { gl.deleteBuffer(this.bPos); gl.deleteBuffer(this.bUV); gl.deleteBuffer(this.bH); gl.deleteBuffer(this.bNrm); gl.deleteBuffer(this.bIdx); }
    this.bPos = this._buffer(pos);
    this.bUV = this._buffer(uv);
    this.bH = this._buffer(hgt);
    this.bNrm = this._buffer(nrm);
    this.bIdx = this._buffer(idx, gl.ELEMENT_ARRAY_BUFFER);
    this.nIdx = idx.length;
    this._heights = hgt;
  }

  // Molnen: flerlagrigt värdebrus som sluter runt längdgraderna, en gång vid start
  _makeCloudCanvas() {
    const W = 1024, H = 512;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(W, H);
    const hash = (x, y, s) => {
      const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
      return n - Math.floor(n);
    };
    const noise = (x, y, per, s) => {
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
      const w = (a, b) => ((a % per) + per) % per;
      const h00 = hash(w(xi, per), yi, s), h10 = hash(w(xi + 1, per), yi, s);
      const h01 = hash(w(xi, per), yi + 1, s), h11 = hash(w(xi + 1, per), yi + 1, s);
      return (h00 * (1 - sx) + h10 * sx) * (1 - sy) + (h01 * (1 - sx) + h11 * sx) * sy;
    };
    for (let y = 0; y < H; y++) {
      const lat = 90 - (y / H) * 180;
      // molnbandet följer jordens verkliga zoner: mycket vid ekvatorn och
      // i västvindsbältena, torrt över subtroperna och polerna
      const a0 = Math.abs(lat);
      const itcz = Math.exp(-Math.pow((a0 - 2) / 10, 2)) * 0.55;      // ekvatorns regnbälte
      const front = Math.exp(-Math.pow((a0 - 54) / 14, 2)) * 0.45;    // västvindsbältet
      const zone = Math.min(1, 0.16 + itcz + front) * (1 - Math.pow(a0 / 93, 6));
      for (let x = 0; x < W; x++) {
        let v = 0, amp = 0.5, per = 16, fx = (x / W) * 16, fy = (y / H) * 8;
        for (let oct = 0; oct < 5; oct++) {
          v += noise(fx, fy, per, oct) * amp;
          amp *= 0.5; per *= 2; fx *= 2; fy *= 2;
        }
        const a = Math.max(0, v * zone - 0.44) * 2.6;
        const i = (y * W + x) * 4;
        img.data[i] = 255; img.data[i + 1] = 255; img.data[i + 2] = 255;
        img.data[i + 3] = Math.min(255, Math.round(a * 255));
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  // ---------- publikt API ----------
  setHeightField(canvas) { if (this.ok) this._buildSphere(canvas); }
  setDayTexture(canvas) { if (this.ok) this._upload(this.dayTex, canvas); }
  setSelTexture(canvas) { if (this.ok) this._upload(this.selTex, canvas); }
  setSelAlpha(a) { this.selAlpha = a; }
  setSun(ll) { this.sun = llToVec(ll[0], ll[1]); }

  resize(w, h, bufW, bufH) {
    if (!this.ok) return;
    this.canvas.width = w; this.canvas.height = h;
    this.bufW = bufW; this.bufH = bufH;
    this._vp = null;
    this.gl.viewport(0, 0, w, h);
  }

  // Kameran speglar 2D-lägets rot/zoom: samma vy, bara med djup.
  // targetR = klotets önskade radie i BUFFERTPIXLAR (som d3:s proj.scale()).
  setCamera(centerLon, centerLat, targetR) {
    this.center = [centerLon, centerLat];
    const halfH = this.bufH / 2;
    const k = Math.max(0.02, (targetR / halfH) * Math.tan(FOV_Y / 2));
    this.dist = Math.max(1.035, 1 / Math.sin(Math.atan(k)));
    const d = llToVec(centerLon, centerLat);
    this.eye = [d[0] * this.dist, d[1] * this.dist, d[2] * this.dist];
    this._vp = null;
  }

  _matrices() {
    if (this._vp) return this._vp;
    const aspect = this.canvas.width / Math.max(1, this.canvas.height);
    const far = this.dist + 2.5;
    const near = Math.max(0.01, this.dist - 1.4);
    const proj = perspective(FOV_Y, aspect, near, far);
    const dir = norm(this.eye);
    // nära polerna duger inte +Y som upp-vektor
    const up = Math.abs(dir[1]) > 0.999 ? [0, 0, dir[1] > 0 ? -1 : 1] : [0, 1, 0];
    const view = lookAt(this.eye, up);
    this._vp = { mvp: mul(proj, view), view, proj, up, aspect };
    return this._vp;
  }

  // Är punkten på den synliga kalotten? Horisonten ligger vid dot = 1/dist.
  visible(ll, slack = 1.45) {
    const p = llToVec(ll[0], ll[1]);
    const d = norm(this.eye);
    const c = dot(p, d);
    const horizon = 1 / this.dist;
    const ang = Math.acos(Math.max(-1, Math.min(1, c)));
    const maxAng = Math.min(slack, Math.acos(Math.max(-1, Math.min(1, horizon))) + 0.02);
    return ang < maxAng;
  }

  // lon/lat → buffertkoordinater (samma rymd som d3-projektionen gav)
  project(ll) {
    if (!this.ok) return null;
    const p = llToVec(ll[0], ll[1]);
    const d = norm(this.eye);
    if (dot(p, d) <= 1 / this.dist - 0.006) return null;   // bakom horisonten
    const { mvp } = this._matrices();
    const x = mvp[0] * p[0] + mvp[4] * p[1] + mvp[8] * p[2] + mvp[12];
    const y = mvp[1] * p[0] + mvp[5] * p[1] + mvp[9] * p[2] + mvp[13];
    const w = mvp[3] * p[0] + mvp[7] * p[1] + mvp[11] * p[2] + mvp[15];
    if (!(w > 0)) return null;
    return [(x / w * 0.5 + 0.5) * this.bufW, (0.5 - y / w * 0.5) * this.bufH];
  }

  // buffertkoordinater → lon/lat (stråle mot sfären)
  unproject(bx, by) {
    if (!this.ok) return null;
    const { up, aspect } = this._matrices();
    const ndcX = (bx / this.bufW) * 2 - 1;
    const ndcY = 1 - (by / this.bufH) * 2;
    const fwd = norm([-this.eye[0], -this.eye[1], -this.eye[2]]);
    const right = norm(cross(fwd, up));
    const realUp = cross(right, fwd);
    const tanH = Math.tan(FOV_Y / 2);
    const dir = norm([
      fwd[0] + right[0] * ndcX * tanH * aspect + realUp[0] * ndcY * tanH,
      fwd[1] + right[1] * ndcX * tanH * aspect + realUp[1] * ndcY * tanH,
      fwd[2] + right[2] * ndcX * tanH * aspect + realUp[2] * ndcY * tanH,
    ]);
    // |eye + t·dir|² = 1
    const b = 2 * dot(this.eye, dir);
    const c = dot(this.eye, this.eye) - 1;
    const disc = b * b - 4 * c;
    if (disc < 0) return null;
    const t = (-b - Math.sqrt(disc)) / 2;
    if (t < 0) return null;
    return vecToLl(norm([this.eye[0] + dir[0] * t, this.eye[1] + dir[1] * t, this.eye[2] + dir[2] * t]));
  }

  // klotets radie i buffertpixlar — effekter som skalar mot klotet frågar den här
  screenRadius() {
    const ang = Math.asin(Math.min(1, 1 / this.dist));
    return (this.bufH / 2) * Math.tan(ang) / Math.tan(FOV_Y / 2);
  }

  _bindAttribs(prog, withH) {
    const gl = this.gl;
    const set = (buf, name, size) => {
      const loc = prog.a[name];
      if (loc == null || loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    set(this.bPos, 'aPos', 3);
    set(this.bNrm, 'aNrm', 3);
    set(this.bUV, 'aUV', 2);
    if (withH) set(this.bH, 'aH', 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIdx);
  }

  render(timeMs) {
    if (!this.ok) return;
    const gl = this.gl;
    const t = timeMs / 1000;
    const { mvp, up, aspect } = this._matrices();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 1) stjärnfältet (fyller bakgrunden, skriver inget djup)
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(this.progStars);
    const fwd = norm([-this.eye[0], -this.eye[1], -this.eye[2]]);
    const right = norm(cross(fwd, up));
    const realUp = cross(right, fwd);
    gl.uniform3fv(this.progStars.u.uRight, right);
    gl.uniform3fv(this.progStars.u.uUp, realUp);
    gl.uniform3fv(this.progStars.u.uFwd, fwd);
    gl.uniform1f(this.progStars.u.uTanH, Math.tan(FOV_Y / 2));
    gl.uniform1f(this.progStars.u.uAspect, aspect);
    gl.uniform1f(this.progStars.u.uTime, t);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quad);
    gl.enableVertexAttribArray(this.progStars.a.aXY);
    gl.vertexAttribPointer(this.progStars.a.aXY, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.CULL_FACE);
    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);

    // 2) planeten
    gl.disable(gl.BLEND);
    gl.cullFace(gl.BACK);
    gl.useProgram(this.progGlobe);
    this._bindAttribs(this.progGlobe, true);
    gl.uniformMatrix4fv(this.progGlobe.u.uMVP, false, mvp);
    gl.uniform1f(this.progGlobe.u.uRelief, this.relief);
    gl.uniform3fv(this.progGlobe.u.uSun, this.sun);
    gl.uniform3fv(this.progGlobe.u.uEye, this.eye);
    gl.uniform1f(this.progGlobe.u.uSelA, this.selAlpha);
    gl.uniform1f(this.progGlobe.u.uTime, t);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.dayTex);
    gl.uniform1i(this.progGlobe.u.uDay, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.selTex);
    gl.uniform1i(this.progGlobe.u.uSel, 1);
    gl.drawElements(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0);

    // 3) molnlagret
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.useProgram(this.progCloud);
    this._bindAttribs(this.progCloud, false);
    gl.uniformMatrix4fv(this.progCloud.u.uMVP, false, mvp);
    gl.uniform1f(this.progCloud.u.uScale, R_CLOUD);
    gl.uniform3fv(this.progCloud.u.uSun, this.sun);
    gl.uniform1f(this.progCloud.u.uDrift, (t / 420) % 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.cloudTex);
    gl.uniform1i(this.progCloud.u.uTex, 0);
    gl.drawElements(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0);

    // 4) atmosfären: skalets baksida, additivt → glödande rand
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.cullFace(gl.FRONT);
    gl.useProgram(this.progAtmo);
    this._bindAttribs(this.progAtmo, false);
    gl.uniformMatrix4fv(this.progAtmo.u.uMVP, false, mvp);
    gl.uniform1f(this.progAtmo.u.uScale, R_ATMO);
    gl.uniform3fv(this.progAtmo.u.uSun, this.sun);
    gl.uniform3fv(this.progAtmo.u.uEye, this.eye);
    gl.drawElements(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0);

    gl.cullFace(gl.BACK);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
}
