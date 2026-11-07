// IMPERIUM V5.20 — FLAGGSKAPAREN (Henrys önskemål: "utveckla flaggorna man kan välja … mycket mycket mer").
// En egen flagga beskrivs av en spec och ritas som SVG — skarp i alla storlekar, inget att ladda:
//   { layout, colors: [c0, c1, c2, c3], sym, symColor, symPos, symSize, symCount, ratio, name }
// layout = en av LAYOUTS (26 mallar: trefärgade, nordiska kors, stjärnbaner, sol, halvmåne …),
// sym = en form ur SHAPES (färgas med symColor) eller en bild ur EMOJI (har egna färger),
// symPos center | hoist | canton, symSize 1–3, symCount 1 | 3 | 5 | 12 (rad, båge, ring),
// ratio '3:2' | '2:1' | '1:1'.
// main.js sparar den som state.solo.flag = { type: 'custom', spec } och ritar den överallt där
// flaggan syns: landsfakta, NATION-rubriken, passet och arméns banér på globen.

export const PALETTE = [
  '#c8102e', '#8a0303', '#dc143c', '#ff8200', '#ffcd00', '#fedf00', '#f2e6c2', '#ffffff',
  '#009b3a', '#046a38', '#00a3a3', '#74acdf', '#00a1de', '#0039a6', '#012169', '#1b1b4f',
  '#6a0dad', '#7a1010', '#7b4a12', '#ff8fb1', '#8a8d8f', '#3a3a3a', '#000000', '#d4af37',
];

// [id, namn] — ritas i flagSvg
export const LAYOUTS = [
  ['solid', 'ENFÄRGAD'], ['h2', 'TVÅ BAND'], ['h3', 'TRE BAND'], ['v2', 'TVÅ FÄLT'], ['v3', 'TRIKOLOR'],
  ['h3wide', 'BRETT MITTBAND'], ['hband', 'SMALT MITTBAND'], ['hstripes', 'RANDIG'], ['stars', 'STJÄRNBANER'],
  ['nordic', 'NORDISKT KORS'], ['nordic2', 'DUBBELKORS'], ['cross', 'KORS'], ['saltire', 'ANDREASKORS'],
  ['union', 'UNIONSKORS'], ['canton', 'HÖRNFÄLT'], ['vband', 'STÅNGBAND'], ['triangle', 'TRIANGEL'],
  ['chevron', 'VINKEL'], ['bend', 'SNEDBAND'], ['perbend', 'DELAD SNETT'], ['quartered', 'KVADRERAD'],
  ['pall', 'GAFFELKORS'], ['border', 'BÅRD'], ['disk', 'SKIVA'], ['rays', 'SOLSTRÅLAR'], ['diamond', 'ROMB'],
];

// former som färgas — ritade i en ruta 100×100 med mitten i 50,50
export const SHAPES = {
  star5: 'STJÄRNA', star6: 'SEXUDD', star8: 'ÅTTAUDD', crescent: 'HALVMÅNE', crescentstar: 'MÅNE OCH STJÄRNA',
  circle: 'CIRKEL', ring: 'RING', sun: 'SOL', cross: 'KORS', plus: 'PLUS', diamond: 'ROMB', triangle: 'TRIANGEL',
  wheel: 'HJUL', crown: 'KRONA', shield: 'SKÖLD', tree: 'TRÄD', mountain: 'BERG', wave: 'VÅG', hammer: 'HAMMARE OCH SKÄRA',
  leaf: 'LÖV', key: 'NYCKEL', sword: 'SVÄRD',
};
export const EMOJI = ['\u{1F985}', '\u{1F981}', '\u{1F409}', '\u{1F43B}', '\u{1F43A}', '\u{1F418}', '\u{1F40D}', '\u{1F98C}',
  '\u{1F332}', '\u{1F341}', '\u{1F339}', '\u{1F338}', '\u{1F33E}', '\u{1F340}', '\u{2694}\u{FE0F}', '\u{1F5E1}\u{FE0F}',
  '\u{1F6E1}\u{FE0F}', '\u{1F451}', '\u{1F525}', '\u{2693}', '\u{1F3D4}\u{FE0F}', '\u{1F30A}', '\u{1F30D}', '\u{2699}\u{FE0F}',
  '\u{1F54A}\u{FE0F}', '\u{270A}', '\u{1F3DB}\u{FE0F}', '\u{1F531}', '\u{269C}\u{FE0F}', '\u{1F984}', '\u{1F41F}', '\u{1F426}',
  '\u{1F31F}', '\u{1F319}', '\u{2600}\u{FE0F}', '\u{1F4DA}', '\u{1F680}', '\u{1F52C}', '\u{1F3F0}', '\u{1F48E}'];

const RATIOS = { '3:2': [60, 40], '2:1': [60, 30], '1:1': [40, 40] };
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safeColor = (c, d) => (/^#[0-9a-fA-F]{3,8}$/.test(String(c || '')) || /^hsl\(/.test(String(c || '')) ? c : d);

// ---------- formerna (100×100, mitten 50,50) ----------
function starPts(n, outer, inner, cx = 50, cy = 50, rot = -90) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (rot + (i * 180) / n) * Math.PI / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}
export function shapeSvg(id, c, bg) {
  switch (id) {
    case 'star5': return `<polygon points="${starPts(5, 48, 19)}" fill="${c}"/>`;
    case 'star6': return `<polygon points="${starPts(6, 48, 26)}" fill="${c}"/>`;
    case 'star8': return `<polygon points="${starPts(8, 48, 28)}" fill="${c}"/>`;
    case 'crescent': return `<circle cx="46" cy="50" r="40" fill="${c}"/><circle cx="58" cy="50" r="33" fill="${bg}"/>`;
    case 'crescentstar': return `<circle cx="40" cy="50" r="38" fill="${c}"/><circle cx="51" cy="50" r="31" fill="${bg}"/><polygon points="${starPts(5, 17, 7, 72, 50)}" fill="${c}"/>`;
    case 'circle': return `<circle cx="50" cy="50" r="40" fill="${c}"/>`;
    case 'ring': return `<circle cx="50" cy="50" r="36" fill="none" stroke="${c}" stroke-width="12"/>`;
    case 'sun': return `<polygon points="${starPts(16, 49, 34)}" fill="${c}"/><circle cx="50" cy="50" r="26" fill="${c}"/>`;
    case 'cross': return `<rect x="42" y="6" width="16" height="88" fill="${c}"/><rect x="18" y="26" width="64" height="16" fill="${c}"/>`;
    case 'plus': return `<rect x="38" y="10" width="24" height="80" fill="${c}"/><rect x="10" y="38" width="80" height="24" fill="${c}"/>`;
    case 'diamond': return `<polygon points="50,4 84,50 50,96 16,50" fill="${c}"/>`;
    case 'triangle': return `<polygon points="50,8 94,88 6,88" fill="${c}"/>`;
    case 'wheel': {
      let sp = '';
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; sp += `<line x1="50" y1="50" x2="${(50 + 40 * Math.cos(a)).toFixed(1)}" y2="${(50 + 40 * Math.sin(a)).toFixed(1)}" stroke="${c}" stroke-width="5"/>`; }
      return `<circle cx="50" cy="50" r="40" fill="none" stroke="${c}" stroke-width="8"/>${sp}<circle cx="50" cy="50" r="9" fill="${c}"/>`;
    }
    case 'crown': return `<polygon points="10,78 14,30 32,52 50,20 68,52 86,30 90,78" fill="${c}"/><rect x="10" y="80" width="80" height="12" fill="${c}"/>`;
    case 'shield': return `<path d="M14 10 H86 V48 C86 74 66 88 50 96 C34 88 14 74 14 48 Z" fill="${c}"/>`;
    case 'tree': return `<polygon points="50,4 82,48 64,48 88,80 12,80 36,48 18,48" fill="${c}"/><rect x="43" y="80" width="14" height="16" fill="${c}"/>`;
    case 'mountain': return `<polygon points="4,90 36,30 52,56 66,38 96,90" fill="${c}"/>`;
    case 'wave': return `<path d="M4 44 Q 20 28 36 44 T 68 44 T 100 44 V58 Q 84 42 68 58 T 36 58 T 4 58 Z" fill="${c}"/><path d="M4 70 Q 20 54 36 70 T 68 70 T 100 70 V82 Q 84 66 68 82 T 36 82 T 4 82 Z" fill="${c}"/>`;
    case 'hammer': return `<path d="M58 14 A 36 36 0 1 1 18 66 L 28 60 A 26 26 0 1 0 58 24 Z" fill="${c}"/><rect x="12" y="70" width="20" height="10" transform="rotate(-40 22 75)" fill="${c}"/><rect x="38" y="30" width="9" height="60" transform="rotate(-45 42 60)" fill="${c}"/><rect x="24" y="14" width="32" height="14" transform="rotate(-45 40 21)" fill="${c}"/>`;
    case 'leaf': return `<path d="M50 4 L58 26 L76 18 L70 40 L92 40 L76 56 L86 70 L58 64 L54 94 L46 94 L42 64 L14 70 L24 56 L8 40 L30 40 L24 18 L42 26 Z" fill="${c}"/>`;
    case 'key': return `<circle cx="34" cy="50" r="20" fill="none" stroke="${c}" stroke-width="10"/><rect x="50" y="45" width="44" height="10" fill="${c}"/><rect x="78" y="55" width="8" height="16" fill="${c}"/><rect x="64" y="55" width="8" height="12" fill="${c}"/>`;
    case 'sword': return `<polygon points="50,2 57,14 57,66 43,66 43,14" fill="${c}"/><rect x="26" y="66" width="48" height="8" fill="${c}"/><rect x="45" y="74" width="10" height="16" fill="${c}"/><circle cx="50" cy="94" r="5" fill="${c}"/>`;
    default: return '';
  }
}

// ---------- bakgrunden ----------
function layoutSvg(L, cs, W, H) {
  const [a, b, c, d] = cs;
  const r = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
  const p = (pts, f) => `<polygon points="${pts}" fill="${f}"/>`;
  const t = Math.round(H * 0.2), cx = Math.round(W * 0.36);
  switch (L) {
    case 'solid': return r(0, 0, W, H, a);
    case 'h2': return r(0, 0, W, H / 2, a) + r(0, H / 2, W, H / 2, b);
    case 'h3': return r(0, 0, W, H / 3 + 0.5, a) + r(0, H / 3, W, H / 3 + 0.5, b) + r(0, 2 * H / 3, W, H / 3, c);
    case 'v2': return r(0, 0, W / 2, H, a) + r(W / 2, 0, W / 2, H, b);
    case 'v3': return r(0, 0, W / 3 + 0.5, H, a) + r(W / 3, 0, W / 3 + 0.5, H, b) + r(2 * W / 3, 0, W / 3, H, c);
    case 'h3wide': return r(0, 0, W, H, a) + r(0, H / 4, W, H / 2, b);
    case 'hband': return r(0, 0, W, H, a) + r(0, H * 0.3, W, H * 0.4, c) + r(0, H * 0.38, W, H * 0.24, b);
    case 'hstripes': { let o = ''; for (let i = 0; i < 9; i++) o += r(0, (H * i) / 9, W, H / 9 + 0.5, i % 2 ? b : a); return o; }
    case 'stars': { let o = ''; for (let i = 0; i < 13; i++) o += r(0, (H * i) / 13, W, H / 13 + 0.5, i % 2 ? b : a); return o + r(0, 0, W * 0.42, H * 7 / 13, c); }
    case 'nordic': return r(0, 0, W, H, a) + r(cx - t / 2, 0, t, H, b) + r(0, H / 2 - t / 2, W, t, b);
    case 'nordic2': return r(0, 0, W, H, a) + r(cx - t * 0.8, 0, t * 1.6, H, b) + r(0, H / 2 - t * 0.8, W, t * 1.6, b) + r(cx - t * 0.4, 0, t * 0.8, H, c) + r(0, H / 2 - t * 0.4, W, t * 0.8, c);
    case 'cross': return r(0, 0, W, H, a) + r(W / 2 - t / 2, 0, t, H, b) + r(0, H / 2 - t / 2, W, t, b);
    case 'saltire': return r(0, 0, W, H, a) + `<path d="M0 0 L${W} ${H} M${W} 0 L0 ${H}" stroke="${b}" stroke-width="${t}"/>`;
    case 'union': return r(0, 0, W, H, a) + `<path d="M0 0 L${W} ${H} M${W} 0 L0 ${H}" stroke="${b}" stroke-width="${t * 0.8}"/>` + r(W / 2 - t * 0.6, 0, t * 1.2, H, c) + r(0, H / 2 - t * 0.6, W, t * 1.2, c);
    case 'canton': return r(0, 0, W, H, a) + r(0, 0, W / 2, H / 2, b);
    case 'vband': return r(0, 0, W, H / 3 + 0.5, a) + r(0, H / 3, W, H / 3 + 0.5, b) + r(0, 2 * H / 3, W, H / 3, c) + r(0, 0, W * 0.26, H, d);
    case 'triangle': return r(0, 0, W, H / 2, a) + r(0, H / 2, W, H / 2, b) + p(`0,0 ${W * 0.45},${H / 2} 0,${H}`, c);
    case 'chevron': return r(0, 0, W, H / 3 + 0.5, a) + r(0, H / 3, W, H / 3 + 0.5, b) + r(0, 2 * H / 3, W, H / 3, c) + p(`0,0 ${W * 0.33},${H / 2} 0,${H}`, d);
    case 'bend': return r(0, 0, W, H, a) + p(`0,${H} 0,${H * 0.72} ${W * 0.86},0 ${W},0 ${W},${H * 0.28} ${W * 0.14},${H}`, b);
    case 'perbend': return p(`0,0 ${W},0 0,${H}`, a) + p(`${W},0 ${W},${H} 0,${H}`, b);
    case 'quartered': return r(0, 0, W / 2, H / 2, a) + r(W / 2, 0, W / 2, H / 2, b) + r(0, H / 2, W / 2, H / 2, b) + r(W / 2, H / 2, W / 2, H / 2, a);
    case 'pall': return r(0, 0, W, H / 2, a) + r(0, H / 2, W, H / 2, b) + `<path d="M0 0 L${W * 0.4} ${H / 2} L0 ${H} M${W * 0.4} ${H / 2} H${W}" stroke="${c}" stroke-width="${H * 0.22}" fill="none"/>` + p(`0,${H * 0.14} ${W * 0.26},${H / 2} 0,${H * 0.86}`, d);
    case 'border': { const k = H * 0.12; return r(0, 0, W, H, b) + r(k, k, W - 2 * k, H - 2 * k, a); }
    case 'disk': return r(0, 0, W, H, a) + `<circle cx="${W / 2}" cy="${H / 2}" r="${H * 0.3}" fill="${b}"/>`;
    case 'rays': {
      let o = r(0, 0, W, H, a);
      for (let i = 0; i < 16; i += 2) {
        const a1 = (i * Math.PI) / 8, a2 = ((i + 1) * Math.PI) / 8, R = W;
        o += p(`${W / 2},${H / 2} ${(W / 2 + R * Math.cos(a1)).toFixed(1)},${(H / 2 + R * Math.sin(a1)).toFixed(1)} ${(W / 2 + R * Math.cos(a2)).toFixed(1)},${(H / 2 + R * Math.sin(a2)).toFixed(1)}`, b);
      }
      return o + `<circle cx="${W / 2}" cy="${H / 2}" r="${H * 0.2}" fill="${c}"/>`;
    }
    case 'diamond': return r(0, 0, W, H, a) + p(`${W / 2},${H * 0.06} ${W * 0.94},${H / 2} ${W / 2},${H * 0.94} ${W * 0.06},${H / 2}`, b);
    default: return r(0, 0, W, H, a);
  }
}

// var symbolen sitter och hur stor den är: [mitt x, mitt y, storlek]
function symBox(spec, W, H) {
  const k = [0.42, 0.56, 0.72][(spec.symSize || 2) - 1] ?? 0.56;
  const pos = spec.symPos || 'center';
  if (pos === 'canton' || spec.layout === 'stars') {
    // hörnfältet: korsens övre vänstra ruta, stjärnbanerets blå fält, annars en fjärdedel
    const t = H * 0.2;
    const [cw, ch] = spec.layout === 'stars' ? [W * 0.42, H * 7 / 13]
      : ['nordic', 'nordic2'].includes(spec.layout) ? [W * 0.36 - t * (spec.layout === 'nordic2' ? 0.8 : 0.5), H / 2 - t * (spec.layout === 'nordic2' ? 0.8 : 0.5)]
        : ['cross', 'union', 'saltire'].includes(spec.layout) ? [W / 2 - t * 0.6, H / 2 - t * 0.6] : [W / 2, H / 2];
    return [cw / 2, ch / 2, Math.min(cw, ch) * k * 1.15];
  }
  if (pos === 'hoist') {
    const hx = ['triangle', 'chevron', 'pall'].includes(spec.layout) ? W * 0.14 : ['nordic', 'nordic2'].includes(spec.layout) ? W * 0.18 : spec.layout === 'vband' ? W * 0.13 : W * 0.2;
    return [hx, H / 2, H * k * 0.75];
  }
  return [W / 2, H / 2, H * k];
}
// var symbolens bakgrund är (för halvmånens "urgröpning")
function bgAt(spec, cs) {
  const L = spec.layout, pos = spec.symPos || 'center';
  if (pos === 'canton' || L === 'stars') return L === 'stars' ? cs[2] : L === 'canton' ? cs[1] : cs[0];
  if (pos === 'hoist') return ['triangle'].includes(L) ? cs[2] : ['chevron', 'vband', 'pall'].includes(L) ? cs[3] : cs[0];
  if (['h3', 'v3', 'h3wide', 'hband', 'diamond'].includes(L)) return cs[1];
  if (L === 'disk') return cs[1];
  if (L === 'rays') return cs[2];
  return cs[0];
}

function symbolsSvg(spec, cs, W, H) {
  const sym = spec.sym;
  if (!sym || spec.symPos === 'none') return '';
  const [x, y, size] = symBox(spec, W, H);
  const n = [1, 3, 5, 12].includes(spec.symCount) ? spec.symCount : 1;
  const col = safeColor(spec.symColor, '#ffffff');
  const bg = bgAt(spec, cs);
  // flera: rad (3), båge (5) eller ring (12) — varje symbol mindre
  const spots = n === 1 ? [[x, y, size]]
    : n === 3 ? [-1, 0, 1].map((i) => [x + i * size * 0.62, y, size * 0.5])
      : n === 5 ? [-2, -1, 0, 1, 2].map((i) => [x + i * size * 0.4, y - Math.cos(i * 0.5) * size * 0.25 + size * 0.1, size * 0.36])
        : Array.from({ length: 12 }, (_, i) => [x + Math.cos(i * Math.PI / 6) * size * 0.42, y + Math.sin(i * Math.PI / 6) * size * 0.42, size * 0.18]);
  return spots.map(([sx, sy, sz]) => {
    if (SHAPES[sym]) {
      const s = sz / 100;
      return `<g transform="translate(${(sx - sz / 2).toFixed(2)} ${(sy - sz / 2).toFixed(2)}) scale(${s.toFixed(4)})">${shapeSvg(sym, col, bg)}</g>`;
    }
    return `<text x="${sx.toFixed(2)}" y="${(sy + sz * 0.05).toFixed(2)}" font-size="${(sz * 0.82).toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-family="'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif">${esc(sym)}</text>`;
  }).join('');
}

export function ratioOf(spec) { return RATIOS[spec?.ratio] || RATIOS['3:2']; }

// Flaggan som en SVG-sträng i pixelstorlek w × h (h räknas ur formatet om det saknas)
export function flagSvg(spec, w = 60, h = null) {
  if (!spec) return '';
  const [W, H] = ratioOf(spec);
  const hh = h ?? Math.round(w * H / W);
  const cs = [0, 1, 2, 3].map((i) => safeColor(spec.colors?.[i], ['#0039a6', '#ffcd00', '#c8102e', '#ffffff'][i]));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${w}" height="${hh}" preserveAspectRatio="none" style="display:block">`
    + layoutSvg(spec.layout || 'h3', cs, W, H) + symbolsSvg(spec, cs, W, H)
    + `<rect x="0.25" y="0.25" width="${W - 0.5}" height="${H - 0.5}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/></svg>`;
}
export function flagDataUrl(spec, w = 60) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(flagSvg(spec, w));
}

// ---------- förslag ----------
const pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length)];
// En slumpad flagga — oftast i landets egna färger så den känns som deras
export function randomSpec(nationColors = null) {
  const pal = nationColors?.length ? [...nationColors, ...PALETTE] : PALETTE;
  const cols = [];
  while (cols.length < 4) {
    const c = pick(cols.length < 2 && nationColors?.length ? nationColors : pal);
    if (!cols.includes(c) || cols.length >= 3) cols.push(c);
  }
  const shapeIds = Object.keys(SHAPES);
  const useShape = Math.random() < 0.7;
  return {
    layout: pick(LAYOUTS)[0], colors: cols,
    sym: Math.random() < 0.15 ? null : useShape ? pick(shapeIds) : pick(EMOJI),
    symColor: pick(['#ffffff', '#ffcd00', '#000000', cols[0], cols[1]]),
    symPos: pick(['center', 'center', 'hoist', 'canton']), symSize: pick([1, 2, 2, 3]),
    symCount: Math.random() < 0.15 ? pick([3, 5, 12]) : 1, ratio: pick(['3:2', '3:2', '2:1', '1:1']), name: '',
  };
}
// Färdiga mallar att börja från, i landets färger
export function presetSpecs(nc) {
  const [a, b] = nc?.length ? nc : ['#0039a6', '#ffcd00'];
  const c = nc?.[2] || '#ffffff';
  return [
    { name: 'TRIKOLOREN', layout: 'v3', colors: [a, '#ffffff', b, a], sym: null, symPos: 'center', symSize: 2, symCount: 1, ratio: '3:2' },
    { name: 'NORDISKA KORSET', layout: 'nordic', colors: [a, b, c, a], sym: null, symPos: 'center', symSize: 2, symCount: 1, ratio: '3:2' },
    { name: 'STJÄRNBANERET', layout: 'stars', colors: [a, '#ffffff', b, a], sym: 'star5', symColor: '#ffffff', symPos: 'canton', symSize: 2, symCount: 12, ratio: '2:1' },
    { name: 'SOLFLAGGAN', layout: 'rays', colors: ['#ffffff', a, b, a], sym: null, symPos: 'center', symSize: 2, symCount: 1, ratio: '3:2' },
    { name: 'HALVMÅNEN', layout: 'solid', colors: [a, b, c, a], sym: 'crescentstar', symColor: '#ffffff', symPos: 'center', symSize: 2, symCount: 1, ratio: '3:2' },
    { name: 'UNIONEN', layout: 'union', colors: [a, '#ffffff', b, a], sym: null, symPos: 'center', symSize: 2, symCount: 1, ratio: '2:1' },
    { name: 'STJÄRNRINGEN', layout: 'solid', colors: [a, b, c, a], sym: 'star5', symColor: b, symPos: 'center', symSize: 3, symCount: 12, ratio: '3:2' },
    { name: 'STÅNGTRIANGELN', layout: 'triangle', colors: [a, '#ffffff', b, a], sym: 'star5', symColor: '#ffffff', symPos: 'hoist', symSize: 1, symCount: 1, ratio: '2:1' },
  ];
}
// En gammal fana (ideologi- eller rikesfana i blocs.js-format) som spec — så att den går att bygga vidare på
export function specFromFlag(f) {
  if (!f) return null;
  const stripes = f.stripes || null;
  return {
    name: f.name || '',
    layout: stripes ? (stripes.length >= 7 ? 'stars' : stripes.length === 2 ? 'h2' : 'h3') : f.band ? 'hband' : 'solid',
    colors: stripes ? [stripes[0], stripes[1] || f.bg, stripes[2] || stripes[0], f.cornerBg || f.bg] : [f.bg, f.band || f.bg, f.band || f.bg, f.bg],
    sym: f.sym || null, symColor: f.symColor || '#ffffff', symPos: f.corner ? 'canton' : 'center', symSize: 2, symCount: 1, ratio: '3:2',
  };
}
// städa en spec som kommer från ett sparat parti eller ett annat rum
export function cleanSpec(x) {
  if (!x || typeof x !== 'object') return null;
  return {
    layout: LAYOUTS.some(([id]) => id === x.layout) ? x.layout : 'h3',
    colors: [0, 1, 2, 3].map((i) => safeColor(x.colors?.[i], PALETTE[i])),
    sym: x.sym && (SHAPES[x.sym] || EMOJI.includes(x.sym)) ? x.sym : null,
    symColor: safeColor(x.symColor, '#ffffff'),
    symPos: ['center', 'hoist', 'canton', 'none'].includes(x.symPos) ? x.symPos : 'center',
    symSize: [1, 2, 3].includes(x.symSize) ? x.symSize : 2,
    symCount: [1, 3, 5, 12].includes(x.symCount) ? x.symCount : 1,
    ratio: RATIOS[x.ratio] ? x.ratio : '3:2',
    name: String(x.name || '').replace(/[<>"&]/g, '').slice(0, 28),
  };
}
