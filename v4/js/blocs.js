// IMPERIUM V5 — BLOCK (faktioner) och FLAGGOR.
// Ett block kan vara försvarspakt, frihandelsblock eller ideologiskt — eller
// flera på en gång. Flaggan byts när man utropar ett rike eller byter ideologi.

export const BLOC_RULES = {
  defense: { name: 'FÖRSVARSPAKT', icon: '\u{1F6E1}\u{FE0F}', desc: 'ALLA MEDLEMMAR FÖRSVARAR VARANDRA' },
  trade: { name: 'FRIHANDEL', icon: '\u{1F91D}', desc: 'FRI HANDEL OCH RÖRLIGHET MELLAN MEDLEMMARNA' },
  ideology: { name: 'IDEOLOGISKT', icon: '\u{1F5F3}\u{FE0F}', desc: 'BARA LÄNDER MED SAMMA IDEOLOGI SLÄPPS IN' },
};

export const BLOC_FOUND_COST = 120;   // political power för att grunda
export const BLOC_INVITE_COST = 30;   // political power per inbjudan

export const BLOC_NAMES = [
  'NORDPAKTEN', 'ATLANTFÖRBUNDET', 'SAMVÄLDET', 'UNIONEN', 'FÖRSVARSFÖRBUNDET',
  'HANDELSLIGAN', 'SOLIDARITETSPAKTEN', 'FRIHETSFÖRBUNDET', 'JÄRNPAKTEN', 'VÄRLDSRÅDET',
];

// Får landet gå med? Ideologiska block släpper bara in likasinnade.
export function canJoinBloc(bloc, ideo) {
  if (!bloc.rules.includes('ideology')) return true;
  return ideo === bloc.ideology;
}

// ---------- FLAGGOR ----------
// Utropar man ett historiskt rike eller byter ideologi kan flaggan bytas.
// Flaggorna ritas i spelets pixelstil: fält, band och en symbol.
export const IDEO_FLAGS = {
  communism: { bg: '#b5121b', band: null, sym: '\u{262D}', symColor: '#ffd700', name: 'RÖD FANA' },
  socialism: { bg: '#d2232a', band: null, sym: '\u{270A}', symColor: '#ffffff', name: 'ARBETARFANAN' },
  socialdemocracy: { bg: '#e3000f', band: '#ffffff', sym: '\u{1F339}', symColor: '#ffffff', name: 'ROSENFANAN' },
  fascism: { bg: '#2b2b2b', band: '#8a0303', sym: '\u{26A1}', symColor: '#ffffff', name: 'SVARTA FANAN' },
  natsoc: { bg: '#1a1a1a', band: '#7a0000', sym: '\u{2694}\u{FE0F}', symColor: '#dddddd', name: 'JÄRNFANAN' },
  nationalism: { bg: '#0b3d91', band: '#ffffff', sym: '\u{1F985}', symColor: '#ffd700', name: 'NATIONSFANAN' },
  imperialism: { bg: '#4b0f2a', band: '#d4af37', sym: '\u{1F451}', symColor: '#ffd700', name: 'KEJSARFANAN' },
  monarchism: { bg: '#2a1a5e', band: '#d4af37', sym: '\u{1F451}', symColor: '#ffd700', name: 'KUNGSFANAN' },
  theocracy: { bg: '#0d5c3a', band: '#ffffff', sym: '\u{262A}\u{FE0F}', symColor: '#ffffff', name: 'DEN HELIGA FANAN' },
  liberalism: { bg: '#f2b705', band: '#0a3d91', sym: '\u{1F54A}\u{FE0F}', symColor: '#ffffff', name: 'FRIHETSFANAN' },
  democracy: { bg: '#1b4f9c', band: '#ffffff', sym: '\u{1F5F3}\u{FE0F}', symColor: '#ffffff', name: 'FOLKFANAN' },
  conservatism: { bg: '#123a5c', band: '#c9a227', sym: '\u{1F3DB}\u{FE0F}', symColor: '#ffffff', name: 'TRADITIONSFANAN' },
  populism: { bg: '#c85a00', band: '#ffffff', sym: '\u{1F4E2}', symColor: '#ffffff', name: 'FOLKRESNINGENS FANA' },
  anarchism: { bg: '#1a1a1a', band: '#c0392b', sym: '\u{24B6}', symColor: '#ffffff', name: 'SVARTRÖDA FANAN' },
};

// Rikesflaggor för de historiska rikena (id matchar HISTORICAL_EMPIRES)
export const EMPIRE_FLAGS = {
  sovjet: { bg: '#cc0000', band: null, sym: '\u{262D}', symColor: '#ffd700', name: 'SOVJETUNIONENS FANA' },
  brittiska: { bg: '#012169', band: '#ffffff', sym: '\u{1F451}', symColor: '#ffd700', name: 'UNION JACK' },
  rom: { bg: '#7a1010', band: '#d4af37', sym: '\u{1F985}', symColor: '#ffd700', name: 'SPQR' },
  mongol: { bg: '#1560bd', band: '#ffffff', sym: '\u{1F3F9}', symColor: '#ffffff', name: 'DEN BLÅ HIMLENS FANA' },
  osman: { bg: '#c8102e', band: null, sym: '\u{262A}\u{FE0F}', symColor: '#ffffff', name: 'HALVMÅNEN' },
  stormakt: { bg: '#004b87', band: '#ffcd00', sym: '\u{1F981}', symColor: '#ffcd00', name: 'STORMAKTSFANAN' },
  kalmar: { bg: '#a51c30', band: '#ffffff', sym: '\u{1F451}', symColor: '#ffd700', name: 'KALMARUNIONENS FANA' },
  kejsardomet: { bg: '#000000', band: '#d4af37', sym: '\u{1F985}', symColor: '#ffd700', name: 'KEJSARÖRNEN' },
  persien: { bg: '#0f7b4f', band: '#ffffff', sym: '\u{1F981}', symColor: '#ffd700', name: 'LEJONFANAN' },
  napoleon: { bg: '#002395', band: '#ffffff', sym: '\u{1F41D}', symColor: '#ffd700', name: 'KEJSARDÖMETS ÖRN' },
};

// Ritar flaggan i en canvas (pixelstil, ingen bild att ladda)
export function drawFlag(ctx, flag, x, y, w, h) {
  if (!flag) return;
  ctx.fillStyle = flag.bg;
  ctx.fillRect(x, y, w, h);
  if (flag.band) {
    ctx.fillStyle = flag.band;
    ctx.fillRect(x, y + h * 0.42, w, h * 0.16);
  }
  ctx.fillStyle = '#00000055';
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y + h - 1, w, 1);
  if (flag.sym) {
    ctx.font = `${Math.round(h * 0.62)}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(flag.sym, x + w / 2, y + h / 2 + 1);
  }
}

// HTML-variant för paneler (ingen canvas behövs)
export function flagHtml(flag, w = 34, h = 22) {
  if (!flag) return '';
  const band = flag.band
    ? `<span style="position:absolute;left:0;right:0;top:42%;height:16%;background:${flag.band}"></span>` : '';
  return `<span style="position:relative;display:inline-block;width:${w}px;height:${h}px;`
    + `background:${flag.bg};border:1px solid rgba(255,255,255,0.7);vertical-align:middle">`
    + band
    + `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;`
    + `font-size:${Math.round(h * 0.6)}px;line-height:1">${flag.sym || ''}</span></span>`;
}
