// IMPERIUM v4 — lagar/policies (M2). Allt är data: justera siffrorna fritt.
// mods = påverkan på nationsvärden (läggs ihop över alla lagar).
// Alternativet med default: true är startläget (mixed/balanced enligt spec).
// Kostnad att byta: LAW_STEP_COST × antal steg mellan nuvarande och nytt alternativ.

export const LAW_STEP_COST = 15; // Political power per steg

export const LAWS = {
  military_service: {
    name: 'Military service', icon: '\u{1FA96}',
    options: [
      { id: 'none', name: 'None', mods: { manpower: -40, milpower: -25, readiness: -20, income: 10, approval: 8, freedom: 5 } },
      { id: 'small', name: 'Small', mods: { manpower: -15, milpower: -10, readiness: -5, income: 5 } },
      { id: 'mixed', name: 'Mixed', default: true, mods: {} },
      { id: 'high', name: 'High', mods: { manpower: 20, milpower: 15, readiness: 10, income: -8, approval: -5, factory: -5 } },
      { id: 'mandatory', name: 'Mandatory', mods: { manpower: 40, milpower: 25, readiness: 20, income: -15, approval: -12, freedom: -10, factory: -10 } },
    ],
  },
  press: {
    name: 'Press regulations', icon: '\u{1F4F0}',
    options: [
      { id: 'full', name: 'Full press', mods: { freedom: 20, approval: 10, corruption: -10, unrest: 5, statepower: -15, ideopower: -10 } },
      { id: 'free', name: 'Free press', mods: { freedom: 12, approval: 6, corruption: -6, statepower: -8, ideopower: -5 } },
      { id: 'laxed', name: 'Laxed', mods: { freedom: 6, approval: 3, corruption: -3, statepower: -3 } },
      { id: 'mixed', name: 'Mixed', default: true, mods: {} },
      { id: 'state', name: 'State focus', mods: { freedom: -10, statepower: 10, ideopower: 8, unrest: -5, corruption: 5, approval: -4 } },
      { id: 'highstate', name: 'High state focus', mods: { freedom: -20, statepower: 18, ideopower: 15, unrest: -10, corruption: 10, approval: -8, research: -5 } },
      { id: 'propaganda', name: 'Propaganda only', mods: { freedom: -35, statepower: 28, ideopower: 30, unrest: -18, corruption: 18, approval: -15, research: -12, hdi: -8 } },
    ],
  },
  party_loyalty: {
    name: 'Party loyalty', icon: '\u{1F3AD}',
    options: [
      { id: 'none', name: 'None', mods: { freedom: 8, polpower: -8, statepower: -8 } },
      { id: 'minimum', name: 'Minimum', mods: { freedom: 4, polpower: -4 } },
      { id: 'low', name: 'Low', mods: { freedom: 2, polpower: -2 } },
      { id: 'mixed', name: 'Mixed', default: true, mods: {} },
      { id: 'high', name: 'High', mods: { polpower: 5, statepower: 5, freedom: -5, ideopower: 5 } },
      { id: 'maximum', name: 'Maximum', mods: { polpower: 10, statepower: 10, freedom: -12, ideopower: 10, approval: -5 } },
      { id: 'onlyrep', name: 'Only representative', mods: { polpower: 15, statepower: 18, freedom: -20, ideopower: 18, approval: -10, corruption: 8 } },
    ],
  },
  healthcare: {
    name: 'Healthcare', icon: '\u{1FA7A}',
    options: [
      { id: 'fullyfree', name: 'Fully free', mods: { welfare: 18, qol: 15, hdi: 12, approval: 12, income: -18, manpower: 5 } },
      { id: 'free', name: 'Free', mods: { welfare: 12, qol: 10, hdi: 8, approval: 8, income: -10, manpower: 3 } },
      { id: 'mixedprices', name: 'Mixed prices', default: true, mods: {} },
      { id: 'mostlyunfree', name: 'Mostly unfree', mods: { income: 8, welfare: -10, qol: -8, hdi: -6, approval: -6 } },
      { id: 'unfree', name: 'Entirely unfree', mods: { income: 15, welfare: -20, qol: -15, hdi: -12, approval: -12, unrest: 6 } },
    ],
  },
  healthcare_quality: {
    name: 'Healthcare quality', icon: '\u{2695}\u{FE0F}',
    options: [
      { id: 'minimal', name: 'Minimal', mods: { income: 12, qol: -15, hdi: -12, manpower: -8, unrest: 5 } },
      { id: 'low', name: 'Low', mods: { income: 6, qol: -8, hdi: -6, manpower: -4 } },
      { id: 'good', name: 'Balanced/good', default: true, mods: {} },
      { id: 'modern', name: 'Modern', mods: { income: -8, qol: 10, hdi: 8, manpower: 4, research: 3 } },
      { id: 'extra', name: 'Extraordinary', mods: { income: -18, qol: 18, hdi: 15, manpower: 8, research: 5, approval: 8 } },
    ],
  },
  welfare: {
    name: 'Welfare', icon: '\u{1F91D}',
    options: [
      { id: 'extreme', name: 'Extreme coverage', mods: { welfare: 30, qol: 15, approval: 15, income: -30, factory: -10, unrest: -8 } },
      { id: 'huge', name: 'Huge coverage', mods: { welfare: 20, qol: 10, approval: 10, income: -18, factory: -5, unrest: -5 } },
      { id: 'coverage', name: 'Coverage', mods: { welfare: 10, qol: 5, approval: 5, income: -8, unrest: -3 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'little', name: 'Little coverage', mods: { income: 8, welfare: -12, qol: -6, unrest: 5 } },
      { id: 'none', name: 'No coverage', mods: { income: 15, welfare: -25, qol: -12, approval: -8, unrest: 12 } },
      { id: 'independent', name: 'Independent', mods: { income: 10, freedom: 8, welfare: -18, qol: -8, unrest: 8 } },
    ],
  },
  taxes: {
    name: 'Taxes', icon: '\u{1F9FE}',
    options: [
      { id: 't0', name: '0–10%', mods: { income: -30, gdp: 15, factory: 10, approval: 12, welfare: -12, unrest: -3 } },
      { id: 't10', name: '10–20%', mods: { income: -15, gdp: 8, factory: 5, approval: 6, welfare: -6 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 't30', name: '30–40%', mods: { income: 12, gdp: -5, approval: -5, welfare: 5 } },
      { id: 't40', name: '40–50%', mods: { income: 22, gdp: -10, factory: -5, approval: -10, welfare: 10, unrest: 5 } },
      { id: 't60', name: '60–80%', mods: { income: 35, gdp: -20, factory: -12, approval: -20, welfare: 15, unrest: 14, corruption: 5 } },
    ],
  },
  un: {
    name: 'UN membership', icon: '\u{1F310}',
    options: [
      { id: 'none', name: 'None member', mods: { statepower: 5, justtime: -15, approval: -5, income: -5 } },
      { id: 'partner', name: 'Partner', mods: { justtime: -5 } },
      { id: 'member', name: 'Member', default: true, mods: {} },
      { id: 'important', name: 'Important member', mods: { income: 5, approval: 5, justtime: 8, polpower: 3 } },
      { id: 'head', name: 'Head member', mods: { income: 10, approval: 8, justtime: 15, polpower: 6, statepower: 5 } },
    ],
  },
  immigration: {
    name: 'Immigration', icon: '\u{1F6C2}',
    options: [
      { id: 'noborders', name: 'No borders', mods: { immigration: 35, manpower: 12, gdp: 5, integration: -20, safety: -12, unrest: 10, welfare: -8 } },
      { id: 'open', name: 'Open', mods: { immigration: 22, manpower: 8, gdp: 4, integration: -10, safety: -5, unrest: 5 } },
      { id: 'relaxed', name: 'Relaxed', mods: { immigration: 12, manpower: 4, integration: -4 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'managed', name: 'Managed', mods: { immigration: -8, integration: 8, safety: 3 } },
      { id: 'restricted', name: 'Restricted', mods: { immigration: -18, integration: 12, safety: 5, manpower: -5, gdp: -3 } },
      { id: 'closed', name: 'Closed', mods: { immigration: -30, integration: 15, safety: 6, manpower: -10, gdp: -8, approval: -5 } },
      { id: 'deportation', name: 'Mass deportation', mods: { immigration: -45, integration: -10, safety: -5, manpower: -15, gdp: -12, approval: -12, unrest: 15, freedom: -15 } },
    ],
  },
  culture: {
    name: 'Culture', icon: '\u{1F3FA}',
    options: [
      { id: 'multi', name: 'Multi-Culture', mods: { immigration: 10, freedom: 8, integration: -8, ideopower: -5 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'mono', name: 'Mono-Culture', mods: { integration: 12, ideopower: 8, immigration: -12, freedom: -8 } },
    ],
  },
  religion: {
    name: 'Religious emphasis', icon: '\u{26EA}',
    options: [
      { id: 'atheism', name: 'Atheism', mods: { research: 5, freedom: 3, ideopower: 5, approval: -5, unrest: 3 } },
      { id: 'secularism', name: 'Secularism', default: true, mods: {} },
      { id: 'statereligion', name: 'State religion', mods: { ideopower: 15, stability: 8, approval: 5, freedom: -12, research: -8, integration: 5 } },
    ],
  },
  elections: {
    name: 'Elections', icon: '\u{1F5F3}\u{FE0F}',
    options: [
      { id: 'entirelyfree', name: 'Entirely free', mods: { freedom: 18, approval: 12, statepower: -12, polpower: -8, corruption: -8 } },
      { id: 'free', name: 'Free', mods: { freedom: 12, approval: 8, statepower: -6, corruption: -5 } },
      { id: 'mostlyfree', name: 'Mostly free', mods: { freedom: 6, approval: 4, statepower: -3 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'hybrid', name: 'Hybrid', mods: { statepower: 6, freedom: -6, approval: -3, corruption: 4 } },
      { id: 'unfair', name: 'Unfair', mods: { statepower: 12, polpower: 8, freedom: -15, approval: -10, corruption: 10, unrest: 6 } },
      { id: 'no', name: 'No elections', mods: { statepower: 22, polpower: 15, freedom: -25, approval: -18, corruption: 15, unrest: 12, ideopower: 10 } },
    ],
  },
  government: {
    name: 'Form of government', icon: '\u{1F3DB}\u{FE0F}',
    options: [
      { id: 'directdemo', name: 'Direct democracy', mods: { freedom: 20, approval: 15, polpower: -18, statepower: -15, justtime: 15, unrest: -5 } },
      { id: 'strongdemo', name: 'Strong democracy', mods: { freedom: 14, approval: 10, polpower: -10, statepower: -8, justtime: 10 } },
      { id: 'democracy', name: 'Democracy', mods: { freedom: 8, approval: 6, polpower: -5, justtime: 5 } },
      { id: 'mixed', name: 'Mixed', default: true, mods: {} },
      { id: 'hybrid', name: 'Hybrid', mods: { polpower: 6, statepower: 6, freedom: -6, justtime: -5 } },
      { id: 'authoritarian', name: 'Authoritarian', mods: { polpower: 14, statepower: 15, freedom: -18, approval: -8, justtime: -12, unrest: 8, milpower: 5 } },
      { id: 'totalitarian', name: 'Totalitarianism', mods: { polpower: 22, statepower: 28, freedom: -35, approval: -15, justtime: -20, unrest: 15, milpower: 10, ideopower: 15, corruption: 10 } },
    ],
  },
  civil_rights: {
    name: 'Civil rights', icon: '\u{270A}',
    options: [
      { id: 'extremelyhigh', name: 'Extremely high', mods: { freedom: 22, qol: 10, approval: 10, statepower: -12, safety: -5, justtime: 10 } },
      { id: 'veryhigh', name: 'Very high', mods: { freedom: 14, qol: 6, approval: 6, statepower: -6 } },
      { id: 'high', name: 'High', mods: { freedom: 8, qol: 3, approval: 3 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'limited', name: 'Limited', mods: { statepower: 8, safety: 4, freedom: -10, approval: -4 } },
      { id: 'verylimited', name: 'Very limited', mods: { statepower: 15, safety: 6, freedom: -20, approval: -8, unrest: 8 } },
      { id: 'norights', name: 'No rights', mods: { statepower: 25, safety: 5, freedom: -40, approval: -15, unrest: 18, qol: -12 } },
    ],
  },
  economic_system: {
    name: 'Economic system', icon: '\u{2699}\u{FE0F}',
    options: [
      { id: 'central', name: 'Central', mods: { statepower: 15, factory: 8, welfare: 8, gdp: -12, income: -5, corruption: 8, freedom: -10 } },
      { id: 'thirdpos', name: 'Third position', mods: { statepower: 10, factory: 5, ideopower: 8, gdp: -5, freedom: -8 } },
      { id: 'planned', name: 'Planned', mods: { statepower: 8, factory: 5, welfare: 5, gdp: -6, freedom: -5 } },
      { id: 'market', name: 'Market', default: true, mods: {} },
      { id: 'plain', name: 'Plain', mods: { gdp: 10, income: 5, freedom: 8, welfare: -8, statepower: -8, corruption: -3 } },
    ],
  },
  education: {
    name: 'Education', icon: '\u{1F393}',
    options: [
      { id: 'nonecomp', name: 'None compulsory', mods: { freedom: 10, research: -20, hdi: -12, gdp: -8, income: 5 } },
      { id: 'freewill', name: 'Free will', mods: { freedom: 6, research: -10, hdi: -6 } },
      { id: 'free', name: 'Free', mods: { research: 5, hdi: 5, income: -5 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'strict', name: 'Strict', mods: { research: 8, hdi: 4, freedom: -5, approval: -3 } },
      { id: 'verystrict', name: 'Very strict', mods: { research: 12, hdi: 6, freedom: -10, approval: -6, unrest: 4 } },
      { id: 'authority', name: 'School authority', mods: { research: 15, ideopower: 10, statepower: 8, freedom: -15, approval: -8, unrest: 6 } },
    ],
  },
  trials: {
    name: 'Trials', icon: '\u{2696}\u{FE0F}',
    options: [
      { id: 'long', name: 'Long', mods: { freedom: 8, safety: -3, corruption: -8, income: -5, justtime: 8 } },
      { id: 'extended', name: 'Extended', mods: { freedom: 4, corruption: -4, income: -3 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'speedup', name: 'Speed up', mods: { safety: 4, income: 3, freedom: -5, corruption: 4 } },
      { id: 'quick', name: 'Quick', mods: { safety: 6, income: 5, statepower: 5, freedom: -10, corruption: 8 } },
    ],
  },
  punishments: {
    name: 'Punishments', icon: '\u{1F517}',
    options: [
      { id: 'minimal', name: 'Minimal', mods: { freedom: 8, approval: 4, safety: -8, unrest: 4 } },
      { id: 'low', name: 'Low', mods: { freedom: 4, safety: -4 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'harsh', name: 'Harsh', mods: { safety: 8, statepower: 5, freedom: -8, approval: -4, unrest: 3 } },
      { id: 'veryharsh', name: 'Very harsh', mods: { safety: 12, statepower: 10, freedom: -15, approval: -8, unrest: 6, qol: -5 } },
    ],
  },
  rehabilitation: {
    name: 'Rehabilitation', icon: '\u{1F331}',
    options: [
      { id: 'veryhigh', name: 'Very high', mods: { safety: 10, qol: 8, welfare: 6, income: -10, unrest: -5 } },
      { id: 'high', name: 'High', mods: { safety: 6, qol: 5, welfare: 4, income: -6, unrest: -3 } },
      { id: 'extended', name: 'Extended', mods: { safety: 3, qol: 2, income: -3 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'shortened', name: 'Shortened', mods: { income: 3, safety: -3 } },
      { id: 'unavailable', name: 'Unavailable', mods: { income: 6, safety: -8, unrest: 5, qol: -4 } },
      { id: 'nonexistent', name: 'Non-existent', mods: { income: 8, safety: -12, unrest: 8, qol: -8, approval: -5 } },
    ],
  },
  death_penalty: {
    name: 'Death penalty', icon: '\u{1F480}',
    options: [
      { id: 'notinuse', name: 'Not in use', default: true, mods: {} },
      { id: 'exceptional', name: 'Exceptional case', mods: { safety: 3, statepower: 3, freedom: -3, approval: -2 } },
      { id: 'balanced', name: 'Balanced', mods: { safety: 5, statepower: 5, freedom: -6, approval: -4, unrest: 2 } },
      { id: 'inuse', name: 'In use', mods: { safety: 8, statepower: 8, freedom: -10, approval: -6, unrest: 4 } },
      { id: 'highlyinuse', name: 'Highly in use', mods: { safety: 10, statepower: 12, freedom: -16, approval: -10, unrest: 8, hdi: -5 } },
      { id: 'majority', name: 'Majority used', mods: { safety: 10, statepower: 16, freedom: -25, approval: -15, unrest: 12, hdi: -10, qol: -8 } },
    ],
  },
  globalism: {
    name: 'Globalism', icon: '\u{1F30D}',
    options: [
      { id: 'major', name: 'Major global partner', mods: { income: 15, gdp: 12, immigration: 8, research: 6, statepower: -8, ideopower: -6 } },
      { id: 'big', name: 'Big global partner', mods: { income: 10, gdp: 8, immigration: 5, research: 4, statepower: -5 } },
      { id: 'partner', name: 'Partner', mods: { income: 5, gdp: 4, research: 2 } },
      { id: 'balanced', name: 'Balanced', default: true, mods: {} },
      { id: 'protectionism', name: 'Selective protectionism', mods: { factory: 6, statepower: 5, income: -5, gdp: -4 } },
      { id: 'disengagement', name: 'Diplomatic disengagement', mods: { factory: 8, statepower: 8, income: -12, gdp: -10, research: -5, justtime: -8 } },
      { id: 'isolationist', name: 'Isolationist', mods: { factory: 10, statepower: 12, ideopower: 8, income: -20, gdp: -15, research: -10, immigration: -20, justtime: -12 } },
    ],
  },
};

export function defaultLaws() {
  const laws = {};
  for (const [cat, def] of Object.entries(LAWS)) {
    laws[cat] = def.options.find((o) => o.default)?.id || def.options[Math.floor(def.options.length / 2)].id;
  }
  return laws;
}

export function lawOption(cat, optId) {
  return LAWS[cat]?.options.find((o) => o.id === optId) || null;
}

// summera alla lageffekter → { statId: delta }
export function lawMods(laws) {
  const sum = {};
  for (const [cat, optId] of Object.entries(laws || {})) {
    const opt = lawOption(cat, optId);
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.mods)) sum[k] = (sum[k] || 0) + v;
  }
  return sum;
}

export function lawChangeCost(cat, fromId, toId) {
  const opts = LAWS[cat]?.options || [];
  const a = opts.findIndex((o) => o.id === fromId);
  const b = opts.findIndex((o) => o.id === toId);
  if (a < 0 || b < 0) return 999;
  return Math.abs(a - b) * LAW_STEP_COST;
}
