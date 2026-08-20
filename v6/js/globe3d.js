// IMPERIUM — 3D-planeten (XCOM 2 Geoscape-anda).
//
// Handskriven WebGL, ingen 3D-motor: spelet laddar redan d3 + topojson + peerjs
// och ska starta snabbt på Henrys mobil, så en 600 kB motor för EN sfär vore
// dåligt köp. Vi behöver bara: en texturerad sfär med riktiga bergshöjder,
// sol/terminator, holografisk atmosfärsrand, ett molnlager och ett stjärnfält.
//
// Världskartan ritas av globe.js som en EKVIREKTANGULÄR textur — exakt samma
// ritkod som i pixelläget — och läggs här på klotet. Allt annat i världen är
// också riktig 3D: stadsljus som punkter på terränghöjden, norrsken som
// böljande draperier, rutter som bågar i rummet, satelliter i bana, månen som
// en belyst klotskiva. Bara spelgränssnittet — armébanér, etiketter, flaggor —
// ligger kvar som skarpa 2D-markörer ovanpå.

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

// STÄDER — riktiga ljuspunkter på klotet. De ligger på terränghöjden och
// döljs av djuptestet när de hamnar på baksidan, precis som allt annat i 3D.
const VS_CITY = `
attribute vec3 aPos;
attribute float aTier;
attribute float aCap;
uniform mat4 uMVP;
uniform vec3 uSun;
uniform float uScreenR;
uniform float uTime;
varying float vNight; varying float vCap;
void main() {
  vec3 N = normalize(aPos);
  vNight = 1.0 - smoothstep(-0.14, 0.16, dot(N, uSun));
  vCap = aCap;
  gl_Position = uMVP * vec4(aPos, 1.0);
  float base = aCap > 0.5 ? 5.0 : (4.2 - aTier * 0.7);
  float s = base * max(0.85, uScreenR / 170.0);
  s *= 0.88 + 0.12 * sin(uTime * 2.0 + aPos.x * 37.0 + aPos.z * 17.0);  // stadsljusen flimrar
  gl_PointSize = clamp(s, 2.2, 34.0);
}`;

const FS_CITY = `
precision mediump float;
varying float vNight; varying float vCap;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float core = smoothstep(0.5, 0.0, r);
  float halo = smoothstep(1.0, 0.0, r);
  vec3 warm = vCap > 0.5 ? vec3(1.0, 0.90, 0.60) : vec3(1.0, 0.82, 0.48);
  vec3 col = mix(vec3(0.80, 0.94, 1.0), warm, vNight);
  float a = (core * 1.0 + halo * 0.75 * vNight) * (0.34 + 0.86 * vNight);
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}`;

// NORRSKEN — draperier som står UT från klotet och böljar runt polerna.
// Samma vågformel som pixelläget använde, fast nu i tre dimensioner.
const VS_AUR = `
attribute float aLon;
attribute float aV;
attribute float aPole;
uniform mat4 uMVP;
uniform vec3 uSun;
uniform float uTime;
varying float vV; varying float vNight; varying float vLon;
void main() {
  float baseLat = aPole > 0.0 ? 67.0 : -65.0;
  float lat = baseLat + 3.5 * sin(aLon * 0.09 + uTime * 0.9) + 1.5 * sin(aLon * 0.23 - uTime * 1.4);
  float a = radians(aLon), b = radians(lat);
  vec3 dir = vec3(cos(b) * sin(a), sin(b), cos(b) * cos(a));
  vNight = 1.0 - smoothstep(-0.24, 0.04, dot(dir, uSun));
  vV = aV; vLon = aLon;
  gl_Position = uMVP * vec4(dir * (1.004 + aV * 0.085), 1.0);
}`;

const FS_AUR = `
precision mediump float;
uniform highp float uTime;
varying float vV; varying float vNight; varying float vLon;
void main() {
  float shimmer = 0.45 + 0.55 * sin(vLon * 0.42 + uTime * 2.1);
  float ray = 0.55 + 0.45 * sin(vLon * 1.7 - uTime * 0.8);
  vec3 col = mix(vec3(0.30, 1.0, 0.60), vec3(0.72, 0.55, 1.0), smoothstep(0.30, 1.0, vV) * 0.9);
  float a = (1.0 - vV) * (0.30 + 0.70 * shimmer) * ray * vNight * 0.55;
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a);
}`;

// EFFEKTLAGRET — allt rörligt i världen (handelspartiklar, satelliter och deras
// banor, raketer, fyrverkerier, blixtar, fartygsljus, krigsrök, stjärnfall och
// månen) ritas som glödande 3D-punkter och linjer. Inget av det är pixlar
// längre: de ligger i rummet, döljs av klotet när de hamnar bakom det och
// följer med när man vrider.
const VS_FX_PT = `
attribute vec3 aPos;
attribute float aSize;
attribute vec4 aCol;
attribute float aKind;
uniform mat4 uMVP;
varying vec4 vCol; varying float vKind;
void main() {
  vCol = aCol; vKind = aKind;
  gl_Position = uMVP * vec4(aPos, 1.0);
  gl_PointSize = clamp(aSize, 1.0, 96.0);
}`;

const FS_FX_PT = `
precision mediump float;
uniform vec3 uSun;
varying vec4 vCol; varying float vKind;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float a;
  if (vKind > 1.5) {
    // månen: en liten BELYST klotskiva med riktig fas, inte en suddig prick
    float z = sqrt(max(0.0, 1.0 - r * r));
    vec3 n = normalize(vec3(d.x * 2.0, -d.y * 2.0, z));
    float lit = clamp(dot(n, normalize(vec3(uSun.x, uSun.y, 0.55))) * 1.3 + 0.10, 0.0, 1.0);
    a = smoothstep(1.0, 0.86, r) * (0.10 + 0.90 * lit);
  } else if (vKind > 0.5) {
    a = smoothstep(1.0, 0.0, r);          // mjuk puff: rök och glöd
  } else {
    a = smoothstep(0.55, 0.0, r) * 0.95 + smoothstep(1.0, 0.0, r) * 0.35;
  }
  gl_FragColor = vec4(vCol.rgb, vCol.a * a);
}`;

const VS_FX_LN = `
attribute vec3 aPos;
attribute vec4 aCol;
uniform mat4 uMVP;
varying vec4 vCol;
void main() { vCol = aCol; gl_Position = uMVP * vec4(aPos, 1.0); }`;

const FS_FX_LN = `
precision mediump float;
varying vec4 vCol;
void main() { gl_FragColor = vCol; }`;

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
    this.progCity = this._program(VS_CITY, FS_CITY);
    this.progAur = this._program(VS_AUR, FS_AUR);
    this.progFxPt = this._program(VS_FX_PT, FS_FX_PT);
    this.progFxLn = this._program(VS_FX_LN, FS_FX_LN);

    this._buildSphere(null);
    this._quad = this._buffer(new Float32Array([-1, -1, 3, -1, -1, 3]));

    this.dayTex = this._texture();
    this.selTex = this._texture();
    this.cloudTex = this._texture(this._makeCloudCanvas());
    this._buildAurora();
    this.nCity = 0;
    this.nFxPt = 0;
    this.nFxLn = 0;
    this.nStaticLn = 0;
    this.staticCount = -1;
    this.showCities = true;
    this.showAurora = true;

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

  // Norrskensdraperierna: en ring runt varje pol, uppdelad i längdgrader och
  // några rader på höjden. Vågformen räknas i vertexshadern så bandet böljar.
  _buildAurora() {
    const M = 200, ROWS = 4;
    const lon = [], vv = [], pole = [], idx = [];
    let base = 0;
    for (const pl of [1, -1]) {
      for (let j = 0; j <= ROWS; j++) {
        for (let i = 0; i <= M; i++) {
          lon.push(-180 + (i / M) * 360);
          vv.push(j / ROWS);
          pole.push(pl);
        }
      }
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < M; i++) {
          const a = base + j * (M + 1) + i, b = a + 1, c = a + M + 1, d = c + 1;
          idx.push(a, c, b, b, c, d);
        }
      }
      base += (ROWS + 1) * (M + 1);
    }
    this.auLon = this._buffer(new Float32Array(lon));
    this.auV = this._buffer(new Float32Array(vv));
    this.auPole = this._buffer(new Float32Array(pole));
    this.auIdx = this._buffer(new Uint16Array(idx), this.gl.ELEMENT_ARRAY_BUFFER);
    this.nAur = idx.length;
  }

  // ---------- publikt API ----------

  // Städerna som ljuspunkter. list = [{ll, tier, cap, h}] där h är terränghöjden
  // (0–1) så staden hamnar PÅ berget i stället för inuti det.
  setCities(list) {
    if (!this.ok) return;
    const n = list.length;
    const pos = new Float32Array(n * 3);
    const tier = new Float32Array(n);
    const cap = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const c = list[i];
      const v = llToVec(c.ll[0], c.ll[1]);
      const r = 1 + (c.h || 0) * RELIEF + 0.0015;
      pos[i * 3] = v[0] * r; pos[i * 3 + 1] = v[1] * r; pos[i * 3 + 2] = v[2] * r;
      tier[i] = c.tier || 0;
      cap[i] = c.cap ? 1 : 0;
    }
    const gl = this.gl;
    if (this.cPos) { gl.deleteBuffer(this.cPos); gl.deleteBuffer(this.cTier); gl.deleteBuffer(this.cCap); }
    this.cPos = this._buffer(pos);
    this.cTier = this._buffer(tier);
    this.cCap = this._buffer(cap);
    this.nCity = n;
  }

  setLayers(opts) {
    if (opts.cities != null) this.showCities = opts.cities;
    if (opts.aurora != null) this.showAurora = opts.aurora;
  }

  // Effekterna byggs om varje bildruta i globe.js och laddas upp här.
  // pts: [x,y,z, size, r,g,b,a, kind] per punkt (stride 9)
  // lns: [x,y,z, r,g,b,a] per linjeände (stride 7, två per segment)
  setFx(pts, lns) {
    if (!this.ok) return;
    const gl = this.gl;
    this.nFxPt = pts.length / 9;
    this.nFxLn = lns.length / 7;
    if (this.nFxPt) {
      this.fxPtBuf ||= gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fxPtBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pts, gl.DYNAMIC_DRAW);
    }
    if (this.nFxLn) {
      this.fxLnBuf ||= gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fxLnBuf);
      gl.bufferData(gl.ARRAY_BUFFER, lns, gl.DYNAMIC_DRAW);
    }
  }

  // Rutterna (väg/järnväg/sjö/flyg) ändras sällan — de ligger i en egen,
  // statisk buffert i stället för att laddas upp varje bildruta.
  setFxStatic(lns) {
    if (!this.ok) return;
    const gl = this.gl;
    this.nStaticLn = lns ? lns.length / 7 : 0;
    if (!this.nStaticLn) return;
    this.fxStaticBuf ||= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fxStaticBuf);
    gl.bufferData(gl.ARRAY_BUFFER, lns, gl.STATIC_DRAW);
    this.staticCount = -1;
  }

  // -1 = rita alla; annars bara de N första ändarna (de internationella)
  setFxStaticCount(n) { this.staticCount = n; }

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

    // 3) stadsljusen — additivt så de glöder mot nattsidan
    if (this.showCities && this.nCity) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.depthMask(false);
      gl.useProgram(this.progCity);
      const pc = this.progCity;
      const bind = (buf, name, size) => {
        const loc = pc.a[name];
        if (loc == null || loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      bind(this.cPos, 'aPos', 3);
      bind(this.cTier, 'aTier', 1);
      bind(this.cCap, 'aCap', 1);
      gl.uniformMatrix4fv(pc.u.uMVP, false, mvp);
      gl.uniform3fv(pc.u.uSun, this.sun);
      gl.uniform1f(pc.u.uScreenR, this.screenRadius());
      gl.uniform1f(pc.u.uTime, t);
      gl.drawArrays(gl.POINTS, 0, this.nCity);
      gl.depthMask(true);
    }

    // 4) norrskenet — draperier som står ut från klotet runt polerna
    if (this.showAurora) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.depthMask(false);
      gl.disable(gl.CULL_FACE);          // draperierna ses från båda hållen
      gl.useProgram(this.progAur);
      const pa = this.progAur;
      const bindA = (buf, name) => {
        const loc = pa.a[name];
        if (loc == null || loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, 0, 0);
      };
      bindA(this.auLon, 'aLon');
      bindA(this.auV, 'aV');
      bindA(this.auPole, 'aPole');
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.auIdx);
      gl.uniformMatrix4fv(pa.u.uMVP, false, mvp);
      gl.uniform3fv(pa.u.uSun, this.sun);
      gl.uniform1f(pa.u.uTime, t);
      gl.drawElements(gl.TRIANGLES, this.nAur, gl.UNSIGNED_SHORT, 0);
      gl.enable(gl.CULL_FACE);
      gl.depthMask(true);
    }

    // 5) molnlagret
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

    // 6) atmosfären: skalets baksida, additivt → glödande rand
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.cullFace(gl.FRONT);
    gl.useProgram(this.progAtmo);
    this._bindAttribs(this.progAtmo, false);
    gl.uniformMatrix4fv(this.progAtmo.u.uMVP, false, mvp);
    gl.uniform1f(this.progAtmo.u.uScale, R_ATMO);
    gl.uniform3fv(this.progAtmo.u.uSun, this.sun);
    gl.uniform3fv(this.progAtmo.u.uEye, this.eye);
    gl.drawElements(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0);

    // 7) effekterna: handel, satelliter, raketer, månen, rök — allt i rummet
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.cullFace(gl.BACK);
    if (this.nStaticLn) {
      gl.useProgram(this.progFxLn);
      const p = this.progFxLn;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fxStaticBuf);
      gl.enableVertexAttribArray(p.a.aPos);
      gl.vertexAttribPointer(p.a.aPos, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(p.a.aCol);
      gl.vertexAttribPointer(p.a.aCol, 4, gl.FLOAT, false, 28, 12);
      gl.uniformMatrix4fv(p.u.uMVP, false, mvp);
      const cnt = this.staticCount < 0 ? this.nStaticLn : Math.min(this.nStaticLn, this.staticCount);
      if (cnt > 0) gl.drawArrays(gl.LINES, 0, cnt);
    }
    if (this.nFxLn) {
      gl.useProgram(this.progFxLn);
      const p = this.progFxLn;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fxLnBuf);
      gl.enableVertexAttribArray(p.a.aPos);
      gl.vertexAttribPointer(p.a.aPos, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(p.a.aCol);
      gl.vertexAttribPointer(p.a.aCol, 4, gl.FLOAT, false, 28, 12);
      gl.uniformMatrix4fv(p.u.uMVP, false, mvp);
      gl.drawArrays(gl.LINES, 0, this.nFxLn);
    }
    if (this.nFxPt) {
      gl.useProgram(this.progFxPt);
      const p = this.progFxPt;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fxPtBuf);
      gl.enableVertexAttribArray(p.a.aPos);
      gl.vertexAttribPointer(p.a.aPos, 3, gl.FLOAT, false, 36, 0);
      gl.enableVertexAttribArray(p.a.aSize);
      gl.vertexAttribPointer(p.a.aSize, 1, gl.FLOAT, false, 36, 12);
      gl.enableVertexAttribArray(p.a.aCol);
      gl.vertexAttribPointer(p.a.aCol, 4, gl.FLOAT, false, 36, 16);
      gl.enableVertexAttribArray(p.a.aKind);
      gl.vertexAttribPointer(p.a.aKind, 1, gl.FLOAT, false, 36, 32);
      gl.uniformMatrix4fv(p.u.uMVP, false, mvp);
      gl.uniform3fv(p.u.uSun, this.sun);
      gl.drawArrays(gl.POINTS, 0, this.nFxPt);
    }

    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
}
