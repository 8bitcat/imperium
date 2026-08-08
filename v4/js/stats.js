// IMPERIUM v4 — nationsvärden (22 st) + beräkningsmotor
// Varje värde = bas + lagar + ideologi + forskning, klampat till −100…+100.
// inverted: true betyder att HÖGT värde är DÅLIGT (oro, korruption, långsam
// krigsrättfärdigande) — styr färgsättningen i panelen.

export const STAT_GROUPS = [
  { id: 'ekonomi', name: 'EKONOMI' },
  { id: 'samhalle', name: 'SAMHÄLLE' },
  { id: 'politik', name: 'STABILITET & POLITIK' },
  { id: 'militar', name: 'MILITÄR' },
];

export const STATS = {
  income:      { name: 'Income',            group: 'ekonomi',  icon: '\u{1F4B0}', desc: 'Statens inkomster per dag' },
  gdp:         { name: 'GDP per capita',    group: 'ekonomi',  icon: '\u{1F4C8}', desc: 'Ekonomiskt välstånd per invånare' },
  factory:     { name: 'Factory output',    group: 'ekonomi',  icon: '\u{1F3ED}', desc: 'Industri- och resursproduktion' },
  research:    { name: 'Research output',   group: 'ekonomi',  icon: '\u{1F52C}', desc: 'Forskningspoäng per dag' },
  corruption:  { name: 'Corruption',        group: 'ekonomi',  icon: '\u{1F4B8}', desc: 'Svinn i stat och ekonomi', inverted: true },

  welfare:     { name: 'Welfare',           group: 'samhalle', icon: '\u{1F91D}', desc: 'Trygghetssystemens styrka' },
  qol:         { name: 'Quality of life',   group: 'samhalle', icon: '\u{1F33B}', desc: 'Medborgarnas livskvalitet' },
  hdi:         { name: 'HDI',               group: 'samhalle', icon: '\u{1F4CA}', desc: 'Mänsklig utvecklingsnivå' },
  safety:      { name: 'Safety',            group: 'samhalle', icon: '\u{1F6E1}️', desc: 'Skydd mot brott och olyckor' },
  freedom:     { name: 'Freedom',           group: 'samhalle', icon: '\u{1F54A}️', desc: 'Personlig och politisk frihet' },
  immigration: { name: 'Immigration',       group: 'samhalle', icon: '\u{1F6C2}', desc: 'Inflöde av nya medborgare' },
  integration: { name: 'Integration',       group: 'samhalle', icon: '\u{1F517}', desc: 'Hur väl nya medborgare kommer in i samhället' },

  stability:   { name: 'Base stability',    group: 'politik',  icon: '\u{1F3DB}️', desc: 'Statens grundstabilitet' },
  unrest:      { name: 'Unrest',            group: 'politik',  icon: '\u{1F525}', desc: 'Oro, protester och upprorsrisk', inverted: true },
  approval:    { name: 'Approval rate',     group: 'politik',  icon: '\u{1F44D}', desc: 'Folkets stöd för ledningen' },
  polpower:    { name: 'Political power',   group: 'politik',  icon: '\u{2696}️', desc: 'Genereras per dag — spenderas på lagar & ideologi' },
  ideopower:   { name: 'Ideology power',    group: 'politik',  icon: '\u{1F9ED}', desc: 'Ideologins grepp om samhället' },
  statepower:  { name: 'State power',       group: 'politik',  icon: '\u{1F5FC}', desc: 'Statens kontroll över institutionerna' },
  justtime:    { name: 'Justification time', group: 'politik', icon: '\u{23F3}', desc: 'Tid att rättfärdiga krig — högt är långsamt', inverted: true },

  milpower:    { name: 'Military power',    group: 'militar',  icon: '\u{2694}️', desc: 'Samlad militär styrka' },
  readiness:   { name: 'Military readiness', group: 'militar', icon: '\u{1F396}️', desc: 'Beredskap — ger stridsbonus' },
  manpower:    { name: 'Manpower increase', group: 'militar',  icon: '\u{1FA96}', desc: 'Rekryteringstakt till armén' },
};

export const STAT_IDS = Object.keys(STATS);

// Neutralt basvärde: hela världen startar balanserat (per spec).
// Basen kan senare färgas av landsprofiler.
export function baseStats() {
  const s = {};
  for (const id of STAT_IDS) s[id] = 0;
  return s;
}

// nation = { laws: {kategori: alternativ-id}, ideology, doctrine, research: {gren: tier} }
// modifierkällor fylls på i M2 (lagar), M3 (ideologi), M5 (forskning).
export function computeStats(nation, sources = {}) {
  const breakdown = {};
  const base = baseStats();
  for (const id of STAT_IDS) {
    const b = base[id];
    const law = sources.laws?.[id] || 0;
    const ideo = sources.ideology?.[id] || 0;
    const res = sources.research?.[id] || 0;
    const total = Math.max(-100, Math.min(100, b + law + ideo + res));
    breakdown[id] = { base: b, laws: law, ideology: ideo, research: res, total };
  }
  return breakdown;
}

export function freshNation() {
  return { laws: {}, ideology: null, doctrine: null, research: {} };
}

// Är värdet bra (grönt) eller dåligt (rött) för spelaren?
export function statGoodness(id, value) {
  if (value === 0) return 0;
  const inv = STATS[id].inverted ? -1 : 1;
  return Math.sign(value) * inv;
}
