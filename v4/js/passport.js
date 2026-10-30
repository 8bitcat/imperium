// IMPERIUM V5.13 — NYTT NAMN: landets identitet (officiellt namn, kortnamn,
// förkortning) och passet som ritas av den. Ren rendering: main.js äger
// tillståndet (state.solo.ident) och sätter det en gång när landet byter namn.
import { OFFICIAL } from './country-data.js';

export const PASS_COVERS = ['#6b1d2a', '#8b1d1d', '#1f2e4f', '#23408e', '#1f4d2b', '#1d4d4f', '#3d2352', '#5a3a22', '#1a1a1a'];
export const PASS_EMBLEMS = ['\u{1F451}', '\u{1F985}', '\u{1F981}', '\u{269C}\u{FE0F}', '\u{2600}\u{FE0F}', '\u{2B50}', '\u{1F319}', '\u{2693}',
  '\u{1F409}', '\u{1F332}', '\u{2744}\u{FE0F}', '\u{2694}\u{FE0F}', '\u{1F43B}', '\u{1F338}', '\u{1F3D4}\u{FE0F}', '\u{1F525}'];

const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

// Passet: omslaget och datasidan bredvid varandra.
// p = { off, short, code, cover, word, emblem, flag (html), holder, issued, no }
export function passportHtml(p) {
  const [l1, l2] = mrzLines(p);
  const word = esc(p.word || 'PASSPORT');
  const emblem = p.emblem
    ? `<span class="pp-emb">${esc(p.emblem)}</span>`
    : `<span class="pp-embflag">${p.flag || ''}</span>`;
  return `<div class="passport">
    <div class="pp-cover" style="--pp:${esc(p.cover || PASS_COVERS[0])}">
      <div class="pp-off">${esc(String(p.off || '').toUpperCase())}</div>
      <div class="pp-ring">${emblem}</div>
      <div class="pp-word">${word}${word !== 'PASSPORT' ? '<br><small>PASSPORT</small>' : ''}</div>
      <div class="pp-chip"></div>
    </div>
    <div class="pp-page">
      <div class="pp-head">${esc(String(p.off || '').toUpperCase())}<span>${word}</span></div>
      <div class="pp-grid">
        <div class="pp-photo"><svg viewBox="0 0 16 18" shape-rendering="crispEdges"><rect width="16" height="18" fill="#cfd8e0"/><rect x="5" y="3" width="6" height="7" fill="#e8b98e"/><rect x="4" y="2" width="8" height="2" fill="#5a3a22"/><rect x="4" y="4" width="1" height="3" fill="#5a3a22"/><rect x="11" y="4" width="1" height="3" fill="#5a3a22"/><rect x="6" y="6" width="1" height="1" fill="#222"/><rect x="9" y="6" width="1" height="1" fill="#222"/><rect x="7" y="8" width="2" height="1" fill="#a0533a"/><rect x="3" y="11" width="10" height="7" fill="${esc(p.cover || '#1f2e4f')}"/><rect x="7" y="11" width="2" height="3" fill="#fff"/></svg></div>
        <div class="pp-fields">
          <div><i>TYP / TYPE</i>P</div>
          <div><i>LANDSKOD / CODE</i>${esc(mrzText(p.code).replace(/</g, '').slice(0, 3))}</div>
          <div><i>PASSNR / No</i>${esc(p.no || passNumber(p.code + p.short))}</div>
          <div class="w"><i>INNEHAVARE / HOLDER</i>${esc(String(p.holder || 'MEDBORGARE').toUpperCase())}</div>
          <div class="w"><i>MEDBORGARSKAP / NATIONALITY</i>${esc(String(p.short || '').toUpperCase())}</div>
          <div><i>UTFÄRDAT / ISSUED</i>${esc(p.issued || '')}</div>
          <div><i>GILTIGT / EXPIRY</i>10 ÅR</div>
        </div>
      </div>
      <div class="pp-mrz">${esc(l1)}<br>${esc(l2)}</div>
    </div>
  </div>`;
}
