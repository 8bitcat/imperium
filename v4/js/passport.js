// IMPERIUM V5.13 — NYTT NAMN: landets identitet (officiellt namn, kortnamn,
// förkortning) och passet som ritas av den. Ren rendering: main.js äger
// tillståndet (state.solo.ident) och sätter det en gång när landet byter namn.
//
// V5.20 (Henry: "utveckla … pass skapningen och sånt mycket mycket mer"): passet designas när
// som helst — omslagets färg och mönster, tryckfärgen, emblemet (flaggan, statsvapnet, en form
// eller en bild), datasidans färg och ett pixelfoto av innehavaren som man bygger själv.
// Passet har tre sidor: omslaget, datasidan och visumsidan med stämplar från länderna man
// kan resa till utan visum, och passets styrka jämfört med världens (PASSETS STYRKA).
// Rikets symboler bor också här: statsvapnet (armsSvg), valspråket, nationalsången,
// nationaldagen, nationaldjuret, valutan och statschefens titel.
import { OFFICIAL } from './country-data.js';
import { SHAPES, EMOJI, shapeSvg } from './flagmaker.js';

export const PASS_COVERS = ['#6b1d2a', '#8b1d1d', '#1f2e4f', '#23408e', '#1f4d2b', '#1d4d4f', '#3d2352', '#5a3a22', '#1a1a1a',
  '#0e5a8a', '#7a5c12', '#4a4a4a', '#2b5e1e', '#5c1a4a', '#8a3a12', '#0d3b2e'];
export const PASS_EMBLEMS = ['\u{1F451}', '\u{1F985}', '\u{1F981}', '\u{269C}\u{FE0F}', '\u{2600}\u{FE0F}', '\u{2B50}', '\u{1F319}', '\u{2693}',
  '\u{1F409}', '\u{1F332}', '\u{2744}\u{FE0F}', '\u{2694}\u{FE0F}', '\u{1F43B}', '\u{1F338}', '\u{1F3D4}\u{FE0F}', '\u{1F525}'];
// tryckfärgen på omslaget
export const PASS_INKS = { gold: ['GULD', '#e2c26a'], silver: ['SILVER', '#d8dde3'], white: ['VIT', '#f4f4f4'], black: ['SVART', '#1a1a1a'], copper: ['KOPPAR', '#d08a54'] };
// omslagets mönster (ovanpå färgen)
export const PASS_PATTERNS = {
  plain: ['SLÄT', ''],
  leather: ['LÄDER', 'repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,0.10) 0 1px, transparent 1px 3px), repeating-radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px),'],
  lines: ['RANDIGT', 'repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 6px),'],
  grid: ['RUTIGT', 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 8px),'],
  dots: ['PRICKAT', 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.5px) 0 0 / 7px 7px,'],
  waves: ['VÅGOR', 'repeating-radial-gradient(circle at 50% 120%, rgba(255,255,255,0.07) 0 2px, transparent 2px 9px),'],
  diamond: ['ROMBER', 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 9px),'],
};
// pixelfotot
export const AVATAR = {
  skin: ['#f6dcc6', '#f1c9a5', '#e8b98e', '#c68a5a', '#a46a43', '#7a4a2c', '#4f2f1c'],
  hairColor: ['#1b1b1b', '#3b2416', '#5a3a22', '#8a5a2b', '#c49a50', '#e8d28a', '#b3471d', '#9aa0a6', '#f2f2f2', '#3a6ad8', '#d84a9a'],
  hair: ['KORT', 'LÅNGT', 'FLINT', 'TOFS', 'LOCKIGT', 'MOHIKAN', 'SIDBENA', 'KNUT'],
  eyes: ['#222222', '#3a6ad8', '#2f8a4a', '#7a4a2c'],
  beard: ['INGET', 'SKÄGGSTUBB', 'HELSKÄGG', 'MUSTASCH'],
  glasses: ['INGA', 'GLASÖGON', 'SOLGLASÖGON'],
  hat: ['INGEN', 'KRONA', 'KEPS', 'BASKER', 'HJÄLM', 'SJAL', 'HÖG HATT', 'MÖSSA'],
};
export const DEFAULT_AVATAR = { skin: 2, hairColor: 2, hair: 0, eyes: 0, beard: 0, glasses: 0, hat: 0, shirt: null };
// statschefens titel
export const TITLES = ['PRESIDENT', 'KUNG', 'DROTTNING', 'KEJSARE', 'KEJSARINNA', 'STORHERTIG', 'FURSTE', 'PREMIÄRMINISTER',
  'KANSLER', 'ORDFÖRANDE', 'GENERALSEKRETERARE', 'LEDARE', 'DIKTATOR', 'SULTAN', 'EMIR', 'SHAH', 'TSAR', 'FARAO', 'KONSUL', 'GUVERNÖR'];
export const MONTHS = ['JANUARI', 'FEBRUARI', 'MARS', 'APRIL', 'MAJ', 'JUNI', 'JULI', 'AUGUSTI', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DECEMBER'];
export const ANIMALS = ['\u{1F985}', '\u{1F981}', '\u{1F43B}', '\u{1F43A}', '\u{1F98C}', '\u{1F409}', '\u{1F418}', '\u{1F42F}', '\u{1F98A}',
  '\u{1F40E}', '\u{1F42C}', '\u{1F989}', '\u{1F99A}', '\u{1F426}', '\u{1F43C}', '\u{1F998}', '\u{1F42B}', '\u{1F40A}', '\u{1F98B}', '\u{1F984}'];
export const SHIELDS = { heater: 'KLASSISK', round: 'RUND', square: 'RAK', swiss: 'SPETSIG', oval: 'OVAL' };
export const DIVISIONS = { none: 'HEL', pale: 'KLUVEN', fess: 'DELAD', quarter: 'KVADRERAD', bend: 'SNEDDELAD' };

const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const colorOk = (c, d) => (/^#[0-9a-fA-F]{3,8}$/.test(String(c || '')) ? c : d);

// bokstäver som MRZ-raden tål: A–Z, siffror och <
export function mrzText(t) {
  return String(t || '').toUpperCase()
    .replace(/[ÅÄÀÁÂÃ]/g, 'A').replace(/[ÖØÒÓÔÕ]/g, 'O').replace(/[ÉÈÊË]/g, 'E').replace(/[ÜÙÚÛ]/g, 'U')
    .replace(/[ÍÌÎÏ]/g, 'I').replace(/Ç/g, 'C').replace(/Ñ/g, 'N').replace(/ß/g, 'SS')
    .replace(/[^A-Z0-9]+/g, '<').replace(/^<+|<+$/g, '');
}

// ICAO 9303: kontrollsiffra med vikterna 7-3-1
function check(s) {
  const val = (c) => (c === '<' ? 0 : /\d/.test(c) ? +c : c.charCodeAt(0) - 55);
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += val(s[i]) * [7, 3, 1][i % 3];
  return String(sum % 10);
}
const pad = (s, n) => (s + '<'.repeat(n)).slice(0, n);

// passnummer som alltid blir detsamma för samma land och namn
export function passNumber(seed) {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const A = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  let out = A[(h >>> 0) % A.length];
  for (let i = 0; i < 8; i++) { h = Math.imul(h ^ (i + 7), 2654435761); out += String((h >>> 0) % 10); }
  return out;
}

// De två maskinläsbara raderna längst ned på passets datasida (44 tecken var)
export function mrzLines(p) {
  const code = pad(mrzText(p.code).replace(/</g, ''), 3);
  const [given, ...rest] = String(p.holder || 'MEDBORGARE').trim().split(/\s+/);
  const sur = rest.length ? rest.join(' ') : given;
  const names = mrzText(sur) + '<<' + (rest.length ? mrzText(given) : '');
  const l1 = pad('P<' + code + names, 44);
  const no = pad(p.no || passNumber(p.code + p.short), 9);
  const birth = '000101', exp = String(p.expires || '350101');
  const body = no + check(no) + code + birth + check(birth) + 'X' + exp + check(exp) + pad('', 14);
  const l2 = body + check('<'.repeat(14)) + check(no + check(no) + birth + check(birth) + exp + check(exp) + pad('', 14) + check('<'.repeat(14)));
  return [l1, l2.slice(0, 44)];
}

// Startidentiteten för ett land: verkligt officiellt namn, landskod och passfärg
export function defaultIdent(cid, shortName) {
  const o = OFFICIAL[cid] || {};
  return {
    off: o.off || shortName || '',
    short: shortName || o.off || '',
    code: o.a3 || mrzText(shortName).replace(/</g, '').slice(0, 3) || 'XXX',
    cover: o.cover || PASS_COVERS[0],
    word: o.word || 'PASSPORT',
    emblem: null,
  };
}

// ---------- pixelfotot (16 × 18) ----------
export function avatarSvg(a0 = {}, shirt = '#1f2e4f') {
  const a = { ...DEFAULT_AVATAR, ...a0 };
  const sk = AVATAR.skin[a.skin] || AVATAR.skin[2];
  const hc = AVATAR.hairColor[a.hairColor] || AVATAR.hairColor[2];
  const ey = AVATAR.eyes[a.eyes] || AVATAR.eyes[0];
  const sh = colorOk(a.shirt, shirt);
  const R = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
  let o = R(0, 0, 16, 18, '#cfd8e0');
  // hår bakom (långt, knut, sjal)
  if (a.hair === 1) o += R(3, 3, 10, 9, hc);
  if (a.hat === 5) o += R(3, 2, 10, 12, '#5a6a8a');
  o += R(3, 11, 10, 7, sh) + R(7, 11, 2, 3, '#ffffff');   // tröjan och kragen
  o += R(5, 3, 6, 7, sk) + R(7, 10, 2, 1, sk);             // ansiktet och halsen
  // frisyren
  const H = a.hair;
  if (H === 0) o += R(4, 2, 8, 2, hc) + R(4, 4, 1, 3, hc) + R(11, 4, 1, 3, hc);
  else if (H === 1) o += R(4, 2, 8, 2, hc) + R(4, 4, 1, 5, hc) + R(11, 4, 1, 5, hc);
  else if (H === 2) o += R(5, 3, 6, 1, sk);
  else if (H === 3) o += R(4, 2, 8, 2, hc) + R(12, 3, 2, 4, hc);
  else if (H === 4) o += R(4, 1, 8, 3, hc) + R(3, 3, 2, 4, hc) + R(11, 3, 2, 4, hc) + R(5, 1, 1, 1, sk) + R(9, 1, 1, 1, sk);
  else if (H === 5) o += R(7, 0, 2, 4, hc);
  else if (H === 6) o += R(4, 2, 8, 2, hc) + R(4, 3, 4, 2, hc) + R(4, 4, 1, 3, hc);
  else if (H === 7) o += R(4, 2, 8, 2, hc) + R(6, 0, 4, 2, hc) + R(4, 4, 1, 2, hc) + R(11, 4, 1, 2, hc);
  // ögon, mun, skägg och glasögon
  o += R(6, 6, 1, 1, ey) + R(9, 6, 1, 1, ey) + R(7, 8, 2, 1, '#a0533a');
  if (a.beard === 1) o += `<rect x="5" y="8" width="6" height="2" fill="${hc}" opacity="0.35"/>`;
  else if (a.beard === 2) o += R(5, 8, 1, 2, hc) + R(10, 8, 1, 2, hc) + R(5, 9, 6, 2, hc) + R(7, 8, 2, 1, '#a0533a');
  else if (a.beard === 3) o += R(6, 7, 4, 1, hc);
  if (a.glasses === 1) o += `<rect x="5.5" y="5.5" width="2" height="2" fill="none" stroke="#222" stroke-width="0.6"/><rect x="8.5" y="5.5" width="2" height="2" fill="none" stroke="#222" stroke-width="0.6"/>`;
  else if (a.glasses === 2) o += R(5, 5, 3, 2, '#111') + R(8, 5, 3, 2, '#111') + R(8, 6, 0.5, 0.5, '#111');
  // huvudbonaden
  if (a.hat === 1) o += R(4, 1, 8, 2, '#e2c26a') + R(4, 0, 1, 1, '#e2c26a') + R(7, 0, 2, 1, '#e2c26a') + R(11, 0, 1, 1, '#e2c26a') + R(7, 1, 2, 1, '#c8102e');
  else if (a.hat === 2) o += R(4, 1, 8, 2, '#c8102e') + R(10, 3, 4, 1, '#c8102e');
  else if (a.hat === 3) o += R(3, 1, 10, 2, '#2b2b2b') + R(7, 0, 1, 1, '#2b2b2b');
  else if (a.hat === 4) o += R(3, 1, 10, 3, '#4b5320') + R(3, 4, 1, 2, '#4b5320') + R(12, 4, 1, 2, '#4b5320');
  else if (a.hat === 5) o += R(4, 2, 8, 1, '#5a6a8a') + R(4, 3, 1, 6, '#5a6a8a') + R(11, 3, 1, 6, '#5a6a8a');
  else if (a.hat === 6) o += R(5, 0, 6, 3, '#1a1a1a') + R(3, 3, 10, 1, '#1a1a1a');
  else if (a.hat === 7) o += R(4, 1, 8, 3, '#2f6fbf') + R(7, 0, 2, 1, '#ffffff');
  return `<svg viewBox="0 0 16 18" shape-rendering="crispEdges">${o}</svg>`;
}

// ---------- statsvapnet ----------
// arms = { shield, field, field2, div, charge (form-id eller emoji), chargeColor, crown }
export const DEFAULT_ARMS = { shield: 'heater', field: '#1f4f9c', field2: '#ffcd00', div: 'none', charge: 'crown', chargeColor: '#ffcd00', crown: true };
const SHIELD_PATH = {
  heater: 'M10 18 H90 V52 C90 78 70 92 50 100 C30 92 10 78 10 52 Z',
  round: 'M10 18 H90 V60 A40 40 0 0 1 10 60 Z',
  square: 'M12 18 H88 V96 H12 Z',
  swiss: 'M10 18 H90 V54 L50 102 L10 54 Z',
  oval: 'M50 16 C78 16 90 38 90 60 C90 84 72 102 50 102 C28 102 10 84 10 60 C10 38 22 16 50 16 Z',
};
export function armsSvg(arms0, size = 60) {
  const a = { ...DEFAULT_ARMS, ...(arms0 || {}) };
  const path = SHIELD_PATH[a.shield] || SHIELD_PATH.heater;
  const f1 = colorOk(a.field, DEFAULT_ARMS.field), f2 = colorOk(a.field2, DEFAULT_ARMS.field2);
  const div = {
    none: '',
    pale: `<rect x="50" y="0" width="60" height="110" fill="${f2}"/>`,
    fess: `<rect x="0" y="58" width="100" height="60" fill="${f2}"/>`,
    quarter: `<rect x="50" y="0" width="60" height="58" fill="${f2}"/><rect x="0" y="58" width="50" height="60" fill="${f2}"/>`,
    bend: `<polygon points="10,18 90,100 10,100" fill="${f2}"/>`,
  }[a.div] || '';
  const cc = colorOk(a.chargeColor, '#ffcd00');
  const charge = SHAPES[a.charge]
    ? `<g transform="translate(26 36) scale(0.48)">${shapeSvg(a.charge, cc, f1)}</g>`
    : a.charge ? `<text x="50" y="62" font-size="40" text-anchor="middle" dominant-baseline="central" font-family="'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif">${esc(a.charge)}</text>` : '';
  const crown = a.crown ? '<polygon points="26,16 28,2 38,10 50,0 62,10 72,2 74,16" fill="#e2c26a" stroke="#8a6a1a" stroke-width="1"/><circle cx="50" cy="3" r="2.5" fill="#c8102e"/>' : '';
  const id = 'sh' + Math.random().toString(36).slice(2, 8);
  return `<svg viewBox="0 -4 100 110" width="${size}" height="${Math.round(size * 1.1)}" style="display:block">
    <defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs>
    <g clip-path="url(#${id})"><rect x="0" y="0" width="100" height="110" fill="${f1}"/>${div}${charge}</g>
    <path d="${path}" fill="none" stroke="#e2c26a" stroke-width="3"/>${crown}</svg>`;
}

// ---------- passet ----------
// Omslaget, datasidan och visumsidan.
// p = { off, short, code, cover, word, emblem, flag (html), holder, issued, no, — V5.20: pattern, ink,
//   emblemKind ('flag'|'arms'|'shape'|'emoji'), shape, arms, pageHue, avatar, motto, title, capital,
//   stamps [{name, a2, day, color, rot}], strength { count, of, rank, ranks } }
function coverHtml(p) {
  const ink = PASS_INKS[p.ink]?.[1] || PASS_INKS.gold[1];
  const pat = PASS_PATTERNS[p.pattern]?.[1] || '';
  const word = esc(p.word || 'PASSPORT');
  const kind = p.emblemKind || (p.emblem ? 'emoji' : 'flag');
  const emblem = kind === 'arms' ? `<span class="pp-arms">${armsSvg(p.arms, 44)}</span>`
    : kind === 'shape' && SHAPES[p.shape] ? `<svg viewBox="0 0 100 100" width="40" height="40">${shapeSvg(p.shape, ink, colorOk(p.cover, '#1f2e4f'))}</svg>`
      : kind === 'emoji' && p.emblem ? `<span class="pp-emb">${esc(p.emblem)}</span>`
        : `<span class="pp-embflag">${p.flag || ''}</span>`;
  return `<div class="pp-cover" style="--pp:${esc(colorOk(p.cover, PASS_COVERS[0]))};--ink:${ink};${pat ? `background:linear-gradient(90deg, rgba(0,0,0,0.35) 0 7px, transparent 7px), ${pat} var(--pp)` : ''}">
      <div class="pp-off">${esc(String(p.off || '').toUpperCase())}</div>
      <div class="pp-ring">${emblem}</div>
      <div class="pp-word">${word}${word !== 'PASSPORT' ? '<br><small>PASSPORT</small>' : ''}</div>
      <div class="pp-chip"></div>
    </div>`;
}
function dataHtml(p) {
  const [l1, l2] = mrzLines(p);
  const word = esc(p.word || 'PASSPORT');
  const hue = Number.isFinite(p.pageHue) ? p.pageHue : 210;
  return `<div class="pp-page" style="--ph:${hue}">
      <div class="pp-head">${esc(String(p.off || '').toUpperCase())}<span>${word}</span></div>
      <div class="pp-grid">
        <div class="pp-photo">${avatarSvg(p.avatar, colorOk(p.cover, '#1f2e4f'))}<div class="pp-sign">${esc(p.holder || '')}</div></div>
        <div class="pp-fields">
          <div><i>TYP / TYPE</i>P</div>
          <div><i>LANDSKOD / CODE</i>${esc(mrzText(p.code).replace(/</g, '').slice(0, 3))}</div>
          <div><i>PASSNR / No</i>${esc(p.no || passNumber(p.code + p.short))}</div>
          <div class="w"><i>INNEHAVARE / HOLDER</i>${esc(String(p.holder || 'MEDBORGARE').toUpperCase())}</div>
          <div class="w"><i>MEDBORGARSKAP / NATIONALITY</i>${esc(String(p.short || '').toUpperCase())}</div>
          ${p.capital ? `<div class="w"><i>FÖDELSEORT / PLACE OF BIRTH</i>${esc(String(p.capital).toUpperCase())}</div>` : ''}
          <div><i>UTFÄRDAT / ISSUED</i>${esc(p.issued || '')}</div>
          <div><i>GILTIGT / EXPIRY</i>10 ÅR</div>
        </div>
      </div>
      ${p.motto ? `<div class="pp-motto">\u{201C}${esc(String(p.motto).toUpperCase())}\u{201D}</div>` : ''}
      <div class="pp-mrz">${esc(l1)}<br>${esc(l2)}</div>
    </div>`;
}
function visaHtml(p) {
  const st = p.strength;
  const stamps = (p.stamps || []).slice(0, 9).map((x) => `<div class="pp-stamp" style="--c:${esc(x.color)};transform:rotate(${x.rot || 0}deg)">`
    + `${x.a2 ? `<img src="https://flagcdn.com/w20/${esc(String(x.a2).toLowerCase())}.png" alt="">` : ''}<b>${esc(String(x.name).toUpperCase())}</b><small>${esc(x.label || 'INRESA')} \u{2022} DAG ${esc(x.day)}</small></div>`).join('');
  return `<div class="pp-page pp-visa" style="--ph:${Number.isFinite(p.pageHue) ? p.pageHue : 210}">
      <div class="pp-head">VISUM / VISAS<span>${st ? `PASSETS STYRKA: ${st.count} LÄNDER` : ''}</span></div>
      ${st ? `<div class="pp-power"><b>${st.count}</b> LÄNDER UTAN VISUM \u{2022} PLATS <b>${st.rank}</b> AV ${st.of} I VÄRLDEN</div>` : ''}
      <div class="pp-stamps">${stamps || '<div class="pp-empty">INGA STÄMPLAR ÄNNU — GODA RELATIONER, ALLIANSER OCH BLOCK GER VISUMFRIHET</div>'}</div>
      ${p.title ? `<div class="pp-issuer">UTFÄRDAT I ${esc(String(p.title).toUpperCase())}NS NAMN</div>` : ''}
    </div>`;
}
export function passportHtml(p, pages = ['cover', 'data']) {
  const parts = { cover: coverHtml, data: dataHtml, visa: visaHtml };
  return `<div class="passport">${pages.map((k) => parts[k]?.(p) || '').join('')}</div>`;
}
// städa ett pass eller statsvapen som kommer utifrån (sparfil, annan spelare)
export function cleanPass(x) {
  const o = x && typeof x === 'object' ? x : {};
  const av = o.avatar && typeof o.avatar === 'object' ? o.avatar : {};
  const num = (v, n) => (Number.isInteger(v) && v >= 0 && v < n ? v : 0);
  return {
    pattern: PASS_PATTERNS[o.pattern] ? o.pattern : 'plain',
    ink: PASS_INKS[o.ink] ? o.ink : 'gold',
    emblemKind: ['flag', 'arms', 'shape', 'emoji'].includes(o.emblemKind) ? o.emblemKind : null,
    shape: SHAPES[o.shape] ? o.shape : null,
    pageHue: Number.isFinite(o.pageHue) ? Math.max(0, Math.min(360, Math.round(o.pageHue))) : 210,
    avatar: {
      skin: num(av.skin, AVATAR.skin.length), hairColor: num(av.hairColor, AVATAR.hairColor.length), hair: num(av.hair, AVATAR.hair.length),
      eyes: num(av.eyes, AVATAR.eyes.length), beard: num(av.beard, AVATAR.beard.length), glasses: num(av.glasses, AVATAR.glasses.length),
      hat: num(av.hat, AVATAR.hat.length), shirt: colorOk(av.shirt, null),
    },
  };
}
export function cleanArms(x) {
  const o = x && typeof x === 'object' ? x : {};
  return {
    shield: SHIELD_PATH[o.shield] ? o.shield : 'heater',
    field: colorOk(o.field, DEFAULT_ARMS.field), field2: colorOk(o.field2, DEFAULT_ARMS.field2),
    div: DIVISIONS[o.div] ? o.div : 'none',
    charge: o.charge && (SHAPES[o.charge] || EMOJI.includes(o.charge) || PASS_EMBLEMS.includes(o.charge)) ? o.charge : null,
    chargeColor: colorOk(o.chargeColor, '#ffcd00'), crown: !!o.crown,
  };
}
