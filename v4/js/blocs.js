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

// ---------- NATIONSFÄRGER ----------
// När ett land byter ideologi ska den nya fanan kännas igen som DERAS fana.
// Sverige som blir kommunistiskt får inte en generisk röd duk — det blir blått,
// gult, blått med hammaren och skäran i mitten. Därför behövs de verkliga
// flaggfärgerna per land, nyckel = ISO alpha-2.
export const FLAG_COLORS = {
  SE: ['#006AA7', '#FECC00'], NO: ['#BA0C2F', '#00205B'], DK: ['#C8102E', '#FFFFFF'],
  FI: ['#FFFFFF', '#002F6C'], IS: ['#02529C', '#DC1E35'], GB: ['#012169', '#C8102E'],
  IE: ['#169B62', '#FF883E'], FR: ['#002395', '#ED2939'], DE: ['#000000', '#DD0000', '#FFCE00'],
  NL: ['#AE1C28', '#21468B'], BE: ['#000000', '#FDDA24'], LU: ['#00A1DE', '#ED2939'],
  ES: ['#AA151B', '#F1BF00'], PT: ['#046A38', '#DA291C'], IT: ['#008C45', '#CD212A'],
  CH: ['#DA291C', '#FFFFFF'], AT: ['#ED2939', '#FFFFFF'], PL: ['#DC143C', '#FFFFFF'],
  CZ: ['#11457E', '#D7141A'], SK: ['#0B4EA2', '#EE1C25'], HU: ['#477050', '#CE2939'],
  RO: ['#002B7F', '#FCD116'], BG: ['#00966E', '#D62612'], GR: ['#0D5EAF', '#FFFFFF'],
  HR: ['#171796', '#FF0000'], RS: ['#C6363C', '#0C4076'], UA: ['#005BBB', '#FFD500'],
  RU: ['#0039A6', '#D52B1E'], BY: ['#C8313E', '#4AA657'], LT: ['#FDB913', '#006A44'],
  LV: ['#9E3039', '#FFFFFF'], EE: ['#0072CE', '#000000'], TR: ['#E30A17', '#FFFFFF'],
  US: ['#3C3B6E', '#B22234'], CA: ['#D80621', '#FFFFFF'], MX: ['#006847', '#CE1126'],
  BR: ['#009B3A', '#FEDF00'], AR: ['#74ACDF', '#FCBF49'], CL: ['#0039A6', '#D52B1E'],
  CO: ['#FCD116', '#003893'], PE: ['#D91023', '#FFFFFF'], VE: ['#FCD116', '#00247D'],
  CN: ['#DE2910', '#FFDE00'], JP: ['#FFFFFF', '#BC002D'], KR: ['#FFFFFF', '#003478'],
  KP: ['#024FA2', '#ED1C27'], IN: ['#FF9933', '#138808'], PK: ['#01411C', '#FFFFFF'],
  BD: ['#006A4E', '#F42A41'], ID: ['#FF0000', '#FFFFFF'], TH: ['#A51931', '#2D2A4A'],
  VN: ['#DA251D', '#FFFF00'], PH: ['#0038A8', '#CE1126'], MY: ['#010066', '#CC0001'],
  SG: ['#EF3340', '#FFFFFF'], AU: ['#00247D', '#FF0000'], NZ: ['#00247D', '#CC142B'],
  ZA: ['#007A4D', '#FFB612'], EG: ['#CE1126', '#000000'], NG: ['#008751', '#FFFFFF'],
  KE: ['#006600', '#BB0000'], ET: ['#078930', '#FCDD09'], MA: ['#C1272D', '#006233'],
  DZ: ['#006233', '#FFFFFF'], SA: ['#006C35', '#FFFFFF'], IR: ['#239F40', '#DA0000'],
  IQ: ['#CE1126', '#000000'], IL: ['#0038B8', '#FFFFFF'], AE: ['#00732F', '#FF0000'],
  KZ: ['#00AFCA', '#FEC50C'], UZ: ['#0099B5', '#1EB53A'], MN: ['#0066B3', '#DA2032'],
  AF: ['#000000', '#D32011'], MM: ['#FECB00', '#34B233'], LK: ['#8D2029', '#FFBE29'],
  CU: ['#002A8F', '#CF142B'], CD: ['#007FFF', '#F7D618'], AO: ['#CE1126', '#000000'],
  SD: ['#D21034', '#007229'], TZ: ['#1EB53A', '#00A3DD'], GH: ['#CE1126', '#FCD116'],
};

const NEUTRAL = ['#2c4a63', '#c9a227'];

// Landets färger — okända länder får en stabil, dämpad palett ur sitt id
// i stället för slumpfärger, så samma land alltid ser likadant ut.
export function nationColors(a2, seed = 0) {
  const c = FLAG_COLORS[String(a2 || '').toUpperCase()];
  if (c) return c;
  const h = (Math.abs(seed) * 47) % 360;
  return [`hsl(${h},42%,32%)`, `hsl(${(h + 47) % 360},58%,55%)`];
}

// Ideologins fana i landets egna färger: tre band där ytterbanden är landets
// huvudfärg och mittbandet den andra, med ideologins symbol över mitten.
export function ideologyFlagFor(colors, ideoId) {
  const base = IDEO_FLAGS[ideoId];
  if (!base) return null;
  const [c0, c1] = colors;
  return {
    stripes: [c0, c1, c0],
    bg: c0,
    band: null,
    sym: base.sym,
    symColor: base.symColor,
    name: base.name,
  };
}

// Ritar flaggan i en canvas (pixelstil, ingen bild att ladda)
export function drawFlag(ctx, flag, x, y, w, h) {
  if (!flag) return;
  ctx.fillStyle = flag.bg;
  ctx.fillRect(x, y, w, h);
  // trebandsfana i nationens egna färger (ideologibyten)
  if (flag.stripes) {
    const n = flag.stripes.length;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = flag.stripes[i];
      ctx.fillRect(x, y + Math.round((h * i) / n), w, Math.ceil(h / n));
    }
  }
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
  let band = flag.band
    ? `<span style="position:absolute;left:0;right:0;top:42%;height:16%;background:${flag.band}"></span>` : '';
  if (flag.stripes) {
    const n = flag.stripes.length;
    band = flag.stripes.map((c, i) => `<span style="position:absolute;left:0;right:0;`
      + `top:${(100 * i) / n}%;height:${100 / n}%;background:${c}"></span>`).join('');
  }
  return `<span style="position:relative;display:inline-block;width:${w}px;height:${h}px;`
    + `background:${flag.bg};border:1px solid rgba(255,255,255,0.7);vertical-align:middle">`
    + band
    + `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;`
    + `font-size:${Math.round(h * 0.6)}px;line-height:1">${flag.sym || ''}</span></span>`;
}
