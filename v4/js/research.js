// IMPERIUM v4 — forskningsträd: 18 grenar × 6 nivåer (satelliter 7). Allt är data.
// Kostnad i forskningspoäng; varje nivå kräver föregående. mods = permanenta
// effekter på nationsvärden. unlock = specialförmågor (t.ex. kärnvapen).

// Sju nivåer: de två sista är sena spelets forskning och kostar därefter.
export const TIER_COST = [50, 120, 250, 500, 900, 1500, 2400];

export const RESEARCH = {
  political: {
    name: 'Political', icon: '\u{1F3DB}\u{FE0F}', group: 'civil',
    tiers: [
      { name: 'Local Governance Reform', mods: { polpower: 5 } },
      { name: 'Parliamentary Restructuring', mods: { polpower: 8, stability: 5 } },
      { name: 'Executive Authority Protocols', mods: { polpower: 10, statepower: 8 } },
      { name: 'Total State Doctrine', mods: { polpower: 15, statepower: 15, freedom: -10 } },
      { name: 'Permanent Council Mandate', mods: { polpower: 22, statepower: 20, stability: 6 } },
      { name: 'Constitutional Supremacy', mods: { polpower: 32, statepower: 26, stability: 12 } },
    ],
  },
  economy: {
    name: 'Economy', icon: '\u{1F4B0}', group: 'civil',
    tiers: [
      { name: 'Tax System Modernization', mods: { income: 8 } },
      { name: 'Central Bank Regulation', mods: { income: 10, gdp: 5 } },
      { name: 'Free Trade & Subsidies', mods: { income: 12, gdp: 10, factory: 5 } },
      { name: 'Global Reserve Currency', mods: { income: 20, gdp: 15 } },
      { name: 'Sovereign Wealth Fund', mods: { income: 28, gdp: 22, factory: 8 } },
      { name: 'Post-Scarcity Logistics', mods: { income: 40, gdp: 32, factory: 15 } },
    ],
  },
  corruption: {
    name: 'Corruption', icon: '\u{1F50E}', group: 'civil',
    tiers: [
      { name: 'Whistleblower Protection Act', mods: { corruption: -6 } },
      { name: 'Independent Anti-Graft Agency', mods: { corruption: -10, approval: 4 } },
      { name: 'Deep State Audit Taskforce', mods: { corruption: -15, income: 5 } },
      { name: 'Institutional Transparency Matrix', mods: { corruption: -30, approval: 8 } },
      { name: 'Automated Public Ledger', mods: { corruption: -40, approval: 12, income: 8 } },
      { name: 'Incorruptible Civil Service', mods: { corruption: -55, approval: 18, stability: 10 } },
    ],
  },
  unrest: {
    name: 'Unrest', icon: '\u{1F525}', group: 'civil',
    tiers: [
      { name: 'Community Outreach Programs', mods: { unrest: -5 } },
      { name: 'Public Broadcast Censorship', mods: { unrest: -8, freedom: -5 } },
      { name: 'Martial Law Protocols', mods: { unrest: -12, freedom: -8, statepower: 5 } },
      { name: 'Algorithmic Social Credit', mods: { unrest: -20, freedom: -15, statepower: 10 } },
      { name: 'Predictive Policing Grid', mods: { unrest: -20, safety: 8, freedom: -10 } },
      { name: 'Total Civic Harmony', mods: { unrest: -32, stability: 15, approval: 10 } },
    ],
  },
  safety: {
    name: 'Safety', icon: '\u{1F6E1}\u{FE0F}', group: 'civil',
    tiers: [
      { name: 'Community Policing', mods: { safety: 6 } },
      { name: 'Automated Surveillance Grid', mods: { safety: 10, freedom: -4 } },
      { name: 'Counter-Terrorism Bureau', mods: { safety: 14, stability: 5 } },
      { name: 'Predictive Crime AI', mods: { safety: 25, freedom: -8 } },
      { name: 'Integrated Response Network', mods: { safety: 20, unrest: -8 } },
      { name: 'Zero-Incident Doctrine', mods: { safety: 32, unrest: -14, approval: 8 } },
    ],
  },
  immigration: {
    name: 'Immigration', icon: '\u{1F6C2}', group: 'civil',
    tiers: [
      { name: 'Visa & Border Checkpoints', mods: { integration: 4 } },
      { name: 'Talent Attraction Visas', mods: { integration: 6, gdp: 5, research: 4 } },
      { name: 'Smart Border Networks', mods: { integration: 8, safety: 5 } },
      { name: 'Naturalization / Enclosure', mods: { integration: 12, manpower: 8 } },
      { name: 'Global Talent Pipeline', mods: { immigration: 18, gdp: 10, research: 6 } },
      { name: 'Open Borders Compact', mods: { immigration: 28, gdp: 18, research: 10, unrest: 5 } },
    ],
  },
  healthcare: {
    name: 'Healthcare', icon: '\u{1FA7A}', group: 'civil',
    tiers: [
      { name: 'Public Health Clinics', mods: { qol: 5, hdi: 3 } },
      { name: 'National Health Insurance', mods: { qol: 8, hdi: 6, approval: 5 } },
      { name: 'Bio-Medical Research Grants', mods: { qol: 10, hdi: 8, manpower: 5 } },
      { name: 'Gene Therapy & Longevity', mods: { qol: 15, hdi: 12, manpower: 10 } },
      { name: 'Genomic Medicine Program', mods: { healthcare: 22, hdi: 12, lifespan: 8 } },
      { name: 'Universal Longevity Care', mods: { healthcare: 35, hdi: 20, lifespan: 15 } },
    ],
  },
  education: {
    name: 'Education', icon: '\u{1F393}', group: 'civil',
    tiers: [
      { name: 'School Reform', mods: { research: 6, hdi: 4 } },
      { name: 'STEM & University Grants', mods: { research: 10, gdp: 4 } },
      { name: 'National Think Tanks', mods: { research: 14, polpower: 4 } },
      { name: 'AI-Integrated Learning', mods: { research: 25, hdi: 8 } },
      { name: 'National Research Academies', mods: { education: 22, research: 15, hdi: 8 } },
      { name: 'Universal Higher Learning', mods: { education: 35, research: 25, hdi: 15 } },
    ],
  },
  logistics: {
    name: 'Logistik', icon: '\u{1F69B}', group: 'militar',
    tiers: [
      { name: 'Fältkök & förrådslinjer', mods: { readiness: 3 } },
      { name: 'Järnvägslogistik', mods: { readiness: 5, manpower: 3 } },
      { name: 'Lufttransport & konvojer', mods: { readiness: 8, manpower: 5 } },
      { name: 'Automatiserad försörjningskedja', mods: { readiness: 12, manpower: 8 } },
      { name: 'Continental Rail Backbone', mods: { logistics: 22, income: 10, factory: 8 } },
      { name: 'Strategic Airlift Command', mods: { logistics: 35, milpower: 12, income: 15 } },
    ],
  },
  climate: {
    name: 'Climate', icon: '\u{1F331}', group: 'civil',
    tiers: [
      { name: 'Clean Energy Subsidies', mods: { qol: 4, income: -3 } },
      { name: 'Emission Cap-and-Trade', mods: { income: 6, qol: 5 } },
      { name: 'Geo-Engineering & Carbon Capture', mods: { qol: 8, hdi: 5, stability: 4 } },
      { name: 'Fusion Energy Infrastructure', mods: { income: 15, factory: 15, qol: 10 } },
      { name: 'Carbon Capture Grid', mods: { climate: 22, hdi: 6 } },
      { name: 'Fusion Power Rollout', mods: { climate: 35, income: 18, factory: 12 } },
    ],
  },
  infantry: {
    name: 'Infantry', icon: '\u{1FA96}', group: 'militar',
    tiers: [
      { name: 'Small Arms & Body Armor', mods: { milpower: 5 }, combat: { INF: 1 } },
      { name: 'Mechanized Battalions', mods: { milpower: 8, readiness: 5 }, combat: { INF: 2 } },
      { name: 'Special Operations Force', mods: { milpower: 10, readiness: 8 }, combat: { INF: 3 } },
      { name: 'Exoskeletons & Combat Drones', mods: { milpower: 15, readiness: 10 }, combat: { INF: 5 } },
      { name: 'Powered Exosuits', mods: { milpower: 20, combat: 8 } },
      { name: 'Autonomous Infantry Squads', mods: { milpower: 30, combat: 14 } },
    ],
  },
  navy: {
    name: 'Navy', icon: '\u{1F6A2}', group: 'militar',
    tiers: [
      { name: 'Coastal Guard Patrols', mods: { milpower: 4, safety: 3 } },
      { name: 'Destroyers & Submarines', mods: { milpower: 8 } },
      { name: 'Supercarrier Strike Groups', mods: { milpower: 14, readiness: 6 } },
      { name: 'Stealth Drone Fleets', mods: { milpower: 20, readiness: 10 } },
      { name: 'Nuclear Carrier Groups', mods: { milpower: 20, combat: 6 } },
      { name: 'Blue-Water Supremacy', mods: { milpower: 30, combat: 12, logistics: 8 } },
    ],
  },
  tanks: {
    name: 'Tanks', icon: '\u{1F6E1}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'MBT Modernization', mods: { milpower: 5 }, combat: { TANK: 1 } },
      { name: 'Active Protection Systems', mods: { milpower: 8 }, combat: { TANK: 2 } },
      { name: 'Unmanned Ground Vehicles', mods: { milpower: 12, manpower: 5 }, combat: { TANK: 3 } },
      { name: 'Electromagnetic Rail-Tanks', mods: { milpower: 18 }, combat: { TANK: 5 } },
      { name: 'Active Protection Armour', mods: { milpower: 20, combat: 8 } },
      { name: 'Autonomous Armour Divisions', mods: { milpower: 32, combat: 15 } },
    ],
  },
  aircraft: {
    name: 'Aircraft', icon: '\u{2708}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Jet Fighter Fleets', mods: { milpower: 5 }, combat: { FLYG: 1 } },
      { name: 'Stealth Fighters & Bombers', mods: { milpower: 9 }, combat: { FLYG: 2 } },
      { name: 'Combat Drone Swarms', mods: { milpower: 13, manpower: 4 }, combat: { FLYG: 3 } },
      { name: 'Hypersonic Strike Aircraft', mods: { milpower: 18 }, combat: { FLYG: 5 } },
      { name: 'Stealth Air Superiority', mods: { milpower: 22, combat: 9 } },
      { name: 'Hypersonic Strike Wing', mods: { milpower: 34, combat: 16 } },
    ],
  },
  nuclear: {
    name: 'Nuclear & Missiles', icon: '\u{2622}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Ballistic Missile Systems', mods: { milpower: 8, justtime: -5 } },
      { name: 'Nuclear Enrichment Program', mods: { milpower: 12 }, unlock: 'nuke' },
      { name: 'ICBM Silos & Sub Launchers', mods: { milpower: 18 } },
      { name: 'Hypersonic Glide & Shield', mods: { milpower: 25, statepower: 8 } },
      { name: 'Thermonuclear Arsenal', mods: { milpower: 26, statepower: 10 }, unlock: 'nuke' },
      { name: 'Second-Strike Triad', mods: { milpower: 40, statepower: 18, stability: 6 }, unlock: 'nuke' },
    ],
  },
  satellites: {
    name: 'Satellitcoverage', icon: '\u{1F6F0}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Spaningssatelliter', desc: 'SER FRÄMMANDE ARMÉER TVÅ LÄNDER BORT', mods: { research: 3 } },
      { name: 'Satellitkonstellation', desc: 'SER ARMÉER FEM LÄNDER BORT', mods: { research: 5, milpower: 3 } },
      { name: 'Regional täckning', desc: '40% AV JORDEN BEVAKAS FRÅN HEMLANDET', mods: { research: 8, milpower: 5 } },
      { name: 'Interkontinental täckning', desc: '70% AV JORDEN BEVAKAS', mods: { research: 10, milpower: 7 } },
      { name: 'Globalt satellitnätverk', desc: 'TOTAL TÄCKNING — HELA JORDEN BEVAKAS', mods: { research: 14, milpower: 10 } },
      { name: 'Orbitalt varningssystem', desc: 'FRÄMMANDE ANFALL SYNS INNAN DE STARTAR', mods: { research: 18, milpower: 14, safety: 6 } },
      { name: 'Djuprymdsnätverk', desc: 'TOTAL TÄCKNING + FORSKNINGSSPRÅNG', mods: { research: 26, milpower: 18 } },
    ],
  },
  integration: {
    name: 'Integration', icon: '\u{1F91D}', group: 'civil',
    tiers: [
      { name: 'Språkreform', desc: 'EROVRADE LÄNDER INTEGRERAS SNABBARE OCH BILLIGARE', mods: { integration: 5 } },
      { name: 'Medborgarskapsprogram', desc: 'SNABBARE INTEGRATION + LÄGRE KOSTNAD', mods: { integration: 8, stability: 4 } },
      { name: 'Kulturell assimilering', desc: 'ÄNNU SNABBARE INTEGRATION', mods: { integration: 12, unrest: -6 } },
      { name: 'Enad nation', desc: 'MAXIMAL INTEGRATIONSTAKT', mods: { integration: 18, unrest: -10, stability: 8 } },
      { name: 'Gemensamt medborgarskap', desc: 'EROVRADE LÄNDER INTEGRERAS DUBBELT SÅ SNABBT', mods: { integration: 26, unrest: -14, stability: 12 } },
      { name: 'Ett folk, ett rike', desc: 'NÄSTAN INGEN MOTSTÅNDSTID KVAR', mods: { integration: 38, unrest: -20, stability: 18 } },
    ],
  },
  espionage: {
    name: 'Espionage & Intelligence', icon: '\u{1F575}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Signalspaning', desc: 'AVSLÖJAR VART FRÄMMANDE ARMÉER ÄR PÅ VÄG', mods: { safety: 3 } },
      { name: 'Agentnätverk', desc: 'AVSLÖJAR VEMS ARMÉN ÄR (NATIONALITET + FLAGGA)', mods: { safety: 5, polpower: 3 } },
      { name: 'Underrättelsebyrå', desc: 'AVSLÖJAR HUR MÅNGA ENHETER ARMÉN HAR', mods: { safety: 8, milpower: 4 } },
      { name: 'Total informationsöverlägsenhet', desc: 'AVSLÖJAR EXAKT VILKA ENHETER ARMÉN HAR', mods: { safety: 10, milpower: 8 } },
      { name: 'Djupinfiltration', desc: 'SER FIENDENS FORSKNING OCH PLANER', mods: { safety: 12, research: 8 } },
      { name: 'Total underrättelsedominans', desc: 'INGET I VÄRLDEN ÄR DOLT FÖR DIG', mods: { safety: 20, research: 14, milpower: 8 } },
    ],
  },
};

// nation.research = { grenId: högsta klara tier (1-4) }
export function researchMods(nation) {
  const sum = {};
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    const def = RESEARCH[branch];
    if (!def) continue;
    for (let i = 0; i < tier && i < def.tiers.length; i++) {
      for (const [k, v] of Object.entries(def.tiers[i].mods || {})) sum[k] = (sum[k] || 0) + v;
    }
  }
  return sum;
}

// stridbonus per enhetstyp (extra skada) från militärforskning
export function combatBonus(nation) {
  const bonus = { INF: 0, TANK: 0, FLYG: 0 };
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    const def = RESEARCH[branch];
    if (!def) continue;
    for (let i = 0; i < tier && i < def.tiers.length; i++) {
      for (const [k, v] of Object.entries(def.tiers[i].combat || {})) bonus[k] += v;
    }
  }
  return bonus;
}

// försörjningsräckvidd i radianer från eget territorium — logistikforskning
// förlänger den. Bas ≈ två grannländer bort; varje tier ≈ ett land till.
export function logisticsRange(nation) {
  return 0.30 + 0.14 * (nation?.research?.logistics || 0);
}

// satellittäckning i radianer från hemlandets huvudstad.
// Bas = grannländerna; T1 ≈ 2 länder bort; T2 ≈ 5 länder bort;
// T3 = 40% av jordytan; T4 = 70%; T5 = total täckning.
export function satCoverage(nation) {
  const t = nation?.research?.satellites || 0;
  return [0.25, 0.5, 0.9, 1.3694, 1.9823, Infinity, Infinity, Infinity][Math.min(t, 7)];
}

// spionagenivå: 1 = destination, 2 = nationalitet, 3 = antal, 4 = sammansättning
export function espionageTier(nation) {
  return nation?.research?.espionage || 0;
}

export function hasUnlock(nation, key) {
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    const def = RESEARCH[branch];
    if (!def) continue;
    for (let i = 0; i < tier && i < def.tiers.length; i++) {
      if (def.tiers[i].unlock === key) return true;
    }
  }
  return false;
}
