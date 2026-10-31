// IMPERIUM v5 — forskningsträd: 27 grenar × 9 namngivna nivåer (satelliter 10)
// och sedan OÄNDLIGT många nivåer till (V5.15, `tierOf`). Allt är data.
// Kostnad i forskningspoäng; varje nivå kräver föregående. mods = permanenta
// effekter på nationsvärden. unlock = specialförmågor (t.ex. kärnvapen).
// combat = extra stridsskada per enhetstyp (INF/TANK/FLYG).
// unit (V5.15) = förbandens egenskaper per typ: hp (% mer hälsa), rng (rutor
// räckvidd), mv (rutor rörlighet), heal (hälsa tillbaka varje tur).
// NEEDS (V5.15) = förkunskaper i andra grenar.
//
// VIKTIGT: nycklarna i `mods` MÅSTE finnas i STATS (stats.js). Nivå 5–6 använde
// tidigare påhittade nycklar (healthcare, lifespan, education, climate, logistics,
// combat) som tyst föll bort i computeStats — de är omskrivna till riktiga stats.

// Tio nivåer: de fyra sista är sena spelets forskning och kostar därefter.
export const TIER_COST = [50, 120, 250, 500, 900, 1500, 2400, 3800, 5600, 8000];

// Forskningstid i dagar per nivå (index = tier−1).
export const TIER_DAYS = [6, 10, 15, 20, 26, 34, 44, 56, 70, 88];

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
      { name: 'Eternal Mandate Doctrine', desc: 'STATEN ÖVERLEVER VARJE REGERINGSKRIS', mods: { polpower: 42, statepower: 34, stability: 18, freedom: -8 } },
      { name: 'Machinery of State', desc: 'BYRÅKRATIN STYR SIG SJÄLV — INGEN LEDARE BEHÖVS', mods: { polpower: 54, statepower: 44, stability: 24, ideopower: 10 } },
      { name: 'The Immortal Republic', desc: 'INGEN INRE KRAFT KAN LÄNGRE VÄLTA STATEN', mods: { polpower: 70, statepower: 58, stability: 32, ideopower: 18, approval: 8 } },
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
      { name: 'Continental Trade Hegemony', desc: 'DINA VILLKOR BLIR VÄRLDENS VILLKOR', mods: { income: 54, gdp: 42, factory: 22 } },
      { name: 'Algorithmic Command Economy', desc: 'MASKINER FÖRDELAR KAPITALET — SVINNET FÖRSVINNER', mods: { income: 70, gdp: 54, factory: 30, corruption: -12 } },
      { name: 'Post-Scarcity Abundance', desc: 'BRIST ÄR INTE LÄNGRE ETT EKONOMISKT PROBLEM', mods: { income: 92, gdp: 74, factory: 40, qol: 15 } },
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
      { name: 'Zero-Trust State Architecture', desc: 'INGEN TJÄNSTEMAN KAN AGERA UTAN ATT DET SYNS', mods: { corruption: -68, approval: 22, income: 12, stability: 12 } },
      { name: 'Total Fiscal Transparency', desc: 'VARJE KRONA I STATEN ÄR SPÅRBAR I REALTID', mods: { corruption: -82, approval: 28, income: 18, stability: 16 } },
      { name: 'The Unbribable State', desc: 'KORRUPTION ÄR PRAKTISKT TAGET UTROTAD', mods: { corruption: -100, approval: 34, income: 24, stability: 22, gdp: 10 } },
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
      { name: 'Neural Consent Engineering', desc: 'MISSNÖJET DÄMPAS INNAN DET HINNER FORMULERAS', mods: { unrest: -42, stability: 20, freedom: -16, statepower: 8 } },
      { name: 'Pacified Society Protocol', desc: 'PROTESTER UPPSTÅR HELT ENKELT INTE LÄNGRE', mods: { unrest: -54, stability: 26, approval: 12, freedom: -10 } },
      { name: 'The Contented Nation', desc: 'ETT FOLK SOM INTE VILL RESA SIG', mods: { unrest: -70, stability: 34, approval: 20, qol: 12 } },
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
      { name: 'Total Domestic Awareness', desc: 'INGET BROTT BEGÅS UTAN ATT STATEN VET OM DET', mods: { safety: 42, unrest: -18, freedom: -12 } },
      { name: 'Autonomous Guardian Grid', desc: 'MASKINER SKYDDAR GATORNA DYGNET RUNT', mods: { safety: 54, unrest: -24, approval: 10 } },
      { name: 'A Nation Without Crime', desc: 'BROTTSLIGHETEN ÄR EN HISTORISK PARENTES', mods: { safety: 70, unrest: -30, approval: 18, qol: 15 } },
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
      { name: 'Continental Free Movement', desc: 'HELA VÄRLDSDELEN RÖR SIG FRITT GENOM DITT LAND', mods: { immigration: 38, gdp: 26, research: 15, manpower: 10, unrest: 6 } },
      { name: 'Global Settlement Compact', desc: 'VÄRLDENS BEGÅVNINGAR SÖKER SIG HIT FÖRST', mods: { immigration: 50, gdp: 35, research: 21, manpower: 16, integration: 8 } },
      { name: 'The Nation of All Nations', desc: 'ETT LAND BYGGT AV HELA VÄRLDEN', mods: { immigration: 64, gdp: 46, research: 28, manpower: 22, integration: 15, hdi: 10 } },
    ],
  },
  healthcare: {
    name: 'Healthcare', icon: '\u{1FA7A}', group: 'civil',
    tiers: [
      { name: 'Public Health Clinics', mods: { qol: 5, hdi: 3 } },
      { name: 'National Health Insurance', mods: { qol: 8, hdi: 6, approval: 5 } },
      { name: 'Bio-Medical Research Grants', mods: { qol: 10, hdi: 8, manpower: 5 } },
      { name: 'Gene Therapy & Longevity', mods: { qol: 15, hdi: 12, manpower: 10 } },
      { name: 'Genomic Medicine Program', mods: { qol: 22, hdi: 16, manpower: 12, welfare: 8 } },
      { name: 'Universal Longevity Care', mods: { qol: 32, hdi: 24, manpower: 18, welfare: 14 } },
      { name: 'Cellular Regeneration Clinics', desc: 'ÅLDRANDET BROMSAS — FOLKET ARBETAR LÄNGRE', mods: { qol: 42, hdi: 32, manpower: 24, welfare: 18 } },
      { name: 'Synthetic Organ Foundries', desc: 'ORGANBRIST ÄR ETT LÖST PROBLEM', mods: { qol: 54, hdi: 42, manpower: 30, welfare: 24, approval: 10 } },
      { name: 'The Ageless Population', desc: 'ETT FOLK SOM KNAPPT DÖR I FÖRTID', mods: { qol: 68, hdi: 55, manpower: 38, welfare: 30, approval: 18 } },
    ],
  },
  education: {
    name: 'Education', icon: '\u{1F393}', group: 'civil',
    tiers: [
      { name: 'School Reform', mods: { research: 6, hdi: 4 } },
      { name: 'STEM & University Grants', mods: { research: 10, gdp: 4 } },
      { name: 'National Think Tanks', mods: { research: 14, polpower: 4 } },
      { name: 'AI-Integrated Learning', mods: { research: 25, hdi: 8 } },
      { name: 'National Research Academies', mods: { research: 34, hdi: 14, gdp: 8 } },
      { name: 'Universal Higher Learning', mods: { research: 46, hdi: 22, gdp: 14, qol: 8 } },
      { name: 'Cognitive Augmentation Programs', desc: 'INLÄRNINGEN SNABBAS UPP PÅ BIOLOGISK NIVÅ', mods: { research: 60, hdi: 30, gdp: 20, polpower: 8 } },
      { name: 'National Genius Cultivation', desc: 'VARJE BEGÅVNING HITTAS OCH SLIPAS', mods: { research: 76, hdi: 40, gdp: 28, qol: 12 } },
      { name: 'The Enlightened Nation', desc: 'HELA BEFOLKNINGEN ÄR EN FORSKNINGSRESURS', mods: { research: 95, hdi: 52, gdp: 36, qol: 18, approval: 10 } },
    ],
  },
  logistics: {
    name: 'Logistik', icon: '\u{1F69B}', group: 'militar',
    tiers: [
      { name: 'Fältkök & förrådslinjer', mods: { readiness: 3 } },
      { name: 'Järnvägslogistik', mods: { readiness: 5, manpower: 3 }, unit: { TANK: { mv: 1 } } },
      { name: 'Lufttransport & konvojer', mods: { readiness: 8, manpower: 5 } },
      { name: 'Automatiserad försörjningskedja', mods: { readiness: 12, manpower: 8 }, unit: { INF: { heal: 1 }, TANK: { heal: 1 } } },
      { name: 'Continental Rail Backbone', mods: { readiness: 18, income: 10, factory: 8 } },
      { name: 'Strategic Airlift Command', mods: { readiness: 26, milpower: 12, income: 15 }, unit: { INF: { mv: 1 } } },
      { name: 'Orbital Drop Logistics', desc: 'FÖRSÖRJNING FRÅN OMLOPPSBANA — RÄCKVIDDEN EXPLODERAR', mods: { readiness: 34, milpower: 18, income: 20, factory: 12 } },
      { name: 'Autonomous Supply Swarms', desc: 'FÖRRÅDEN FLYTTAR SIG SJÄLVA TILL FRONTEN', mods: { readiness: 44, milpower: 24, income: 26, manpower: 12 }, unit: { INF: { heal: 1 }, TANK: { heal: 1 }, FLYG: { heal: 1 } } },
      { name: 'The Unbroken Chain', desc: 'DINA ARMÉER KAN ALDRIG SVÄLTAS UT', mods: { readiness: 56, milpower: 32, income: 34, factory: 20, manpower: 18 }, unit: { INF: { mv: 1 }, TANK: { mv: 1 }, FLYG: { mv: 1 } } },
    ],
  },
  climate: {
    name: 'Climate', icon: '\u{1F331}', group: 'civil',
    tiers: [
      { name: 'Clean Energy Subsidies', mods: { qol: 4, income: -3 } },
      { name: 'Emission Cap-and-Trade', mods: { income: 6, qol: 5 } },
      { name: 'Geo-Engineering & Carbon Capture', mods: { qol: 8, hdi: 5, stability: 4 } },
      { name: 'Fusion Energy Infrastructure', mods: { income: 15, factory: 15, qol: 10 } },
      { name: 'Carbon Capture Grid', mods: { qol: 20, hdi: 10, stability: 8 } },
      { name: 'Fusion Power Rollout', mods: { qol: 28, income: 22, factory: 18, hdi: 14 } },
      { name: 'Planetary Climate Control', desc: 'VÄDRET ÄR INTE LÄNGRE EN RISK FÖR SKÖRDEN', mods: { qol: 38, income: 28, factory: 24, hdi: 20, stability: 10 } },
      { name: 'Terraforming Initiative', desc: 'ÖKNAR OCH TUNDROR GÖRS ODLINGSBARA', mods: { qol: 48, income: 36, factory: 30, hdi: 26, gdp: 15 } },
      { name: 'A World Restored', desc: 'MILJÖSKULDEN ÄR ÅTERBETALD', mods: { qol: 62, income: 46, factory: 38, hdi: 34, gdp: 22, approval: 12 } },
    ],
  },
  infantry: {
    name: 'Infantry', icon: '\u{1FA96}', group: 'militar',
    tiers: [
      { name: 'Small Arms & Body Armor', mods: { milpower: 5 }, combat: { INF: 1 }, unit: { INF: { hp: 10 } } },
      { name: 'Mechanized Battalions', mods: { milpower: 8, readiness: 5 }, combat: { INF: 2 }, unit: { INF: { mv: 1 } } },
      { name: 'Special Operations Force', mods: { milpower: 10, readiness: 8 }, combat: { INF: 3 }, unit: { INF: { hp: 5 } } },
      { name: 'Exoskeletons & Combat Drones', mods: { milpower: 15, readiness: 10 }, combat: { INF: 5 }, unit: { INF: { rng: 1 } } },
      { name: 'Powered Exosuits', mods: { milpower: 20, readiness: 12 }, combat: { INF: 7 }, unit: { INF: { hp: 20 } } },
      { name: 'Autonomous Infantry Squads', mods: { milpower: 30, readiness: 15 }, combat: { INF: 10 }, unit: { INF: { heal: 1 } } },
      { name: 'Neural-Linked Squads', desc: 'HELA KOMPANIET TÄNKER SOM EN ENDA SOLDAT', mods: { milpower: 40, readiness: 20 }, combat: { INF: 14 }, unit: { INF: { mv: 1, hp: 10 } } },
      { name: 'Augmented Shock Troopers', desc: 'BIOLOGISKT FÖRSTÄRKT INFANTERI', mods: { milpower: 52, readiness: 26, manpower: 10 }, combat: { INF: 19 }, unit: { INF: { hp: 25, heal: 1 } } },
      { name: 'The Unbreakable Line', desc: 'DITT INFANTERI VIKER INTE — NÅGONSIN', mods: { milpower: 68, readiness: 34, manpower: 18 }, combat: { INF: 26 }, unit: { INF: { hp: 30, rng: 1 } } },
    ],
  },
  navy: {
    name: 'Navy', icon: '\u{1F6A2}', group: 'militar',
    tiers: [
      { name: 'Coastal Guard Patrols', mods: { milpower: 4, safety: 3 } },
      { name: 'Destroyers & Submarines', mods: { milpower: 8 } },
      { name: 'Supercarrier Strike Groups', mods: { milpower: 14, readiness: 6 } },
      { name: 'Stealth Drone Fleets', mods: { milpower: 20, readiness: 10 } },
      { name: 'Nuclear Carrier Groups', mods: { milpower: 26, readiness: 12 }, combat: { INF: 2, TANK: 2 }, unit: { FLYG: { mv: 1 } } },
      { name: 'Blue-Water Supremacy', mods: { milpower: 36, readiness: 16, income: 8 }, combat: { INF: 4, TANK: 4 } },
      { name: 'Submerged Arsenal Ships', desc: 'HELA FLOTTAN KAN GÖMMA SIG UNDER YTAN', mods: { milpower: 48, readiness: 22, income: 12 }, combat: { INF: 6, TANK: 6 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 } } },
      { name: 'Autonomous Wolfpacks', desc: 'OBEMANNADE UBÅTSFLOCKAR JAGAR SJÄLVSTÄNDIGT', mods: { milpower: 62, readiness: 28, income: 18 }, combat: { INF: 8, TANK: 8, FLYG: 4 } },
      { name: 'Command of Every Ocean', desc: 'INGEN SEGLAR NÅGONSTANS UTAN DITT MEDGIVANDE', mods: { milpower: 80, readiness: 36, income: 26, statepower: 12 }, combat: { INF: 11, TANK: 11, FLYG: 7 }, unit: { INF: { rng: 1 }, TANK: { rng: 1 } } },
    ],
  },
  tanks: {
    name: 'Tanks', icon: '\u{1F6E1}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'MBT Modernization', mods: { milpower: 5 }, combat: { TANK: 1 }, unit: { TANK: { hp: 10 } } },
      { name: 'Active Protection Systems', mods: { milpower: 8 }, combat: { TANK: 2 }, unit: { TANK: { hp: 15 } } },
      { name: 'Unmanned Ground Vehicles', mods: { milpower: 12, manpower: 5 }, combat: { TANK: 3 }, unit: { TANK: { mv: 1 } } },
      { name: 'Electromagnetic Rail-Tanks', mods: { milpower: 18 }, combat: { TANK: 5 }, unit: { TANK: { rng: 1 } } },
      { name: 'Active Protection Armour', mods: { milpower: 24, readiness: 8 }, combat: { TANK: 7 }, unit: { TANK: { hp: 20 } } },
      { name: 'Autonomous Armour Divisions', mods: { milpower: 34, readiness: 12, manpower: 8 }, combat: { TANK: 10 }, unit: { TANK: { mv: 1 } } },
      { name: 'Reactive Nanoplate Hulls', desc: 'PANSARET LÄKER SIG SJÄLVT MELLAN TRÄFFAR', mods: { milpower: 46, readiness: 16 }, combat: { TANK: 14 }, unit: { TANK: { heal: 2 } } },
      { name: 'Walker Assault Platforms', desc: 'BEPANSRADE GÅENDE PLATTFORMAR TAR VILKEN TERRÄNG SOM HELST', mods: { milpower: 60, readiness: 22, manpower: 12 }, combat: { TANK: 19 }, unit: { TANK: { mv: 1, hp: 15 } } },
      { name: 'The Iron Tide', desc: 'INGEN FRONT HÅLLER MOT DITT PANSAR', mods: { milpower: 78, readiness: 30, manpower: 18 }, combat: { TANK: 26 }, unit: { TANK: { hp: 30, rng: 1 } } },
    ],
  },
  aircraft: {
    name: 'Aircraft', icon: '\u{2708}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Jet Fighter Fleets', mods: { milpower: 5 }, combat: { FLYG: 1 }, unit: { FLYG: { hp: 5 } } },
      { name: 'Stealth Fighters & Bombers', mods: { milpower: 9 }, combat: { FLYG: 2 }, unit: { FLYG: { hp: 15 } } },
      { name: 'Combat Drone Swarms', mods: { milpower: 13, manpower: 4 }, combat: { FLYG: 3 }, unit: { FLYG: { rng: 1 } } },
      { name: 'Hypersonic Strike Aircraft', mods: { milpower: 18 }, combat: { FLYG: 5 }, unit: { FLYG: { mv: 2 } } },
      { name: 'Stealth Air Superiority', mods: { milpower: 26, readiness: 8 }, combat: { FLYG: 8 }, unit: { FLYG: { hp: 20 } } },
      { name: 'Hypersonic Strike Wing', mods: { milpower: 38, readiness: 12 }, combat: { FLYG: 11 }, unit: { FLYG: { rng: 1 } } },
      { name: 'Orbital Bombardment Wing', desc: 'ANFALL FRÅN RYMDEN — INGEN LUFTVÄRN NÅR DIT', mods: { milpower: 50, readiness: 18 }, combat: { FLYG: 15 }, unit: { FLYG: { rng: 1 } } },
      { name: 'Autonomous Air Fleets', desc: 'PILOTLÖSA VINGAR SOM ALDRIG TRÖTTNAR', mods: { milpower: 64, readiness: 24, manpower: 12 }, combat: { FLYG: 20 }, unit: { FLYG: { heal: 1, mv: 1 } } },
      { name: 'Total Air Supremacy', desc: 'INGENTING FIENTLIGT LYFTER FRÅN MARKEN', mods: { milpower: 82, readiness: 32, manpower: 18 }, combat: { FLYG: 27 }, unit: { FLYG: { hp: 30 } } },
    ],
  },
  nuclear: {
    name: 'Nuclear & Missiles', icon: '\u{2622}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Ballistic Missile Systems', mods: { milpower: 8, justtime: -5 } },
      { name: 'Nuclear Enrichment Program', mods: { milpower: 12 }, unlock: 'nuke' },
      { name: 'ICBM Silos & Sub Launchers', mods: { milpower: 18 } },
      { name: 'Hypersonic Glide & Shield', mods: { milpower: 25, statepower: 8 } },
      { name: 'Thermonuclear Arsenal', mods: { milpower: 32, statepower: 12 }, unlock: 'nuke' },
      { name: 'Second-Strike Triad', mods: { milpower: 44, statepower: 20, stability: 8 }, unlock: 'nuke' },
      { name: 'Orbital Nuclear Platforms', desc: 'VAPNEN VÄNTAR I OMLOPPSBANA — MINUTER FRÅN MÅLET', mods: { milpower: 58, statepower: 28, stability: 10, justtime: -10 }, unlock: 'nuke' },
      { name: 'Continental Missile Shield', desc: 'FIENDENS FÖRSTASLAG STOPPAS INNAN DET LANDAR', mods: { milpower: 74, statepower: 36, stability: 16, safety: 15 }, unlock: 'nuke' },
      { name: 'Doctrine of Mutual Ruin', desc: 'INGEN VÅGAR SLÅ FÖRST MOT DIG', mods: { milpower: 95, statepower: 48, stability: 24, justtime: -18 }, unlock: 'nuke' },
    ],
  },
  satellites: {
    name: 'Satellitcoverage', icon: '\u{1F6F0}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Spaningssatelliter', desc: 'SER FRÄMMANDE ARMÉER TVÅ LÄNDER BORT', mods: { research: 3 } },
      { name: 'Satellitkonstellation', desc: 'SER ARMÉER FEM LÄNDER BORT', mods: { research: 5, milpower: 3 } },
      { name: 'Regional täckning', desc: '40% AV JORDEN BEVAKAS FRÅN HEMLANDET', mods: { research: 8, milpower: 5 }, unit: { FLYG: { rng: 1 } } },
      { name: 'Interkontinental täckning', desc: '70% AV JORDEN BEVAKAS', mods: { research: 10, milpower: 7 } },
      { name: 'Globalt satellitnätverk', desc: 'TOTAL TÄCKNING — HELA JORDEN BEVAKAS', mods: { research: 14, milpower: 10 } },
      { name: 'Orbitalt varningssystem', desc: 'FRÄMMANDE ANFALL SYNS INNAN DE STARTAR', mods: { research: 18, milpower: 14, safety: 6 }, unit: { INF: { hp: 5 }, TANK: { hp: 5 }, FLYG: { hp: 5 } } },
      { name: 'Djuprymdsnätverk', desc: 'TOTAL TÄCKNING + FORSKNINGSSPRÅNG', mods: { research: 26, milpower: 18 } },
      { name: 'Orbital vapenplattform', desc: 'SATELLITERNA KAN SLÅ TILLBAKA SJÄLVA', mods: { research: 34, milpower: 26, safety: 10 }, unit: { INF: { rng: 1 }, TANK: { rng: 1 }, FLYG: { rng: 1 } } },
      { name: 'Månbas & fjärranalys', desc: 'EN BAS UTANFÖR JORDEN — INGEN KAN SLÅ UT DEN', mods: { research: 44, milpower: 34, statepower: 12, stability: 8 } },
      { name: 'Allseende nätverket', desc: 'VARJE RÖRELSE PÅ JORDEN SYNS I REALTID', mods: { research: 58, milpower: 44, statepower: 20, safety: 18 } },
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
      { name: 'Gemensam identitet', desc: 'ERÖVRADE FOLK SLUTAR SE SIG SOM ERÖVRADE', mods: { integration: 50, unrest: -26, stability: 24, approval: 8 } },
      { name: 'Imperiets medborgarskap', desc: 'ALLA UNDER DIN FANA ÄR LIKA INFÖR STATEN', mods: { integration: 64, unrest: -32, stability: 30, approval: 14, hdi: 8 } },
      { name: 'Ett enda folk', desc: 'MOTSTÅNDSTIDEN ÄR I PRINCIP BORTA', mods: { integration: 80, unrest: -40, stability: 38, approval: 20, ideopower: 12 } },
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
      { name: 'Aktiva åtgärder', desc: 'DINA AGENTER PÅVERKAR ANDRA LÄNDERS BESLUT', mods: { safety: 28, research: 20, polpower: 12, statepower: 10 } },
      { name: 'Kaderinfiltration', desc: 'DU HAR FOLK I VARJE FIENTLIG REGERING', mods: { safety: 36, research: 27, polpower: 18, statepower: 16, justtime: -10 } },
      { name: 'Osynliga handen', desc: 'VÄRLDEN STYRS AV BESLUT DU REDAN HAR FATTAT', mods: { safety: 46, research: 36, polpower: 26, statepower: 24, ideopower: 15 } },
    ],
  },

  // ===== V5.15: NIO NYA GRENAR =====
  energy: {
    name: 'Energy', icon: '\u{26A1}', group: 'civil',
    tiers: [
      { name: 'Grid Modernization', mods: { income: 4, factory: 4 } },
      { name: 'Wind & Solar Farms', mods: { factory: 5, income: 3, qol: 4 } },
      { name: 'Nuclear Power Plants', desc: 'STABIL BASKRAFT — KRÄVER UTBILDADE INGENJÖRER', mods: { factory: 10, income: 6, stability: 2 } },
      { name: 'Smart Grid', mods: { factory: 10, income: 10, stability: 4 } },
      { name: 'Grid-Scale Batteries', mods: { factory: 16, income: 14, qol: 6 } },
      { name: 'Thorium Reactors', desc: 'SÄKRARE KÄRNKRAFT SOM KNAPPT GER AVFALL', mods: { factory: 22, income: 20, milpower: 6 } },
      { name: 'Fusion Ignition', desc: 'SOLENS ELD I EN REAKTOR — ELEN BLIR NÄSTAN GRATIS', mods: { factory: 30, income: 28, qol: 10 } },
      { name: 'Orbital Solar Arrays', desc: 'SOLPANELER I OMLOPPSBANA STRÅLAR NER ENERGI DYGNET RUNT', mods: { factory: 38, income: 36, research: 10 } },
      { name: 'Limitless Energy', desc: 'ENERGIBRIST ÄR ETT ORD UR HISTORIEBÖCKERNA', mods: { factory: 50, income: 48, qol: 18, gdp: 20 } },
    ],
  },
  computing: {
    name: 'Computing & AI', icon: '\u{1F4BB}', group: 'civil',
    tiers: [
      { name: 'National Broadband', mods: { research: 4, gdp: 3 } },
      { name: 'Supercomputer Centers', mods: { research: 8, factory: 2 } },
      { name: 'E-Government', desc: 'MYNDIGHETERNA FLYTTAR IN I DATORN', mods: { research: 6, polpower: 4, corruption: -6 } },
      { name: 'Machine Learning Labs', mods: { research: 14, factory: 6 } },
      { name: 'Quantum Computing', desc: 'RÄKNAR UT PÅ SEKUNDER VAD SOM TOG ÅRHUNDRADEN', mods: { research: 22, safety: 6, gdp: 6 } },
      { name: 'General AI Assistants', mods: { research: 30, gdp: 14, factory: 10 } },
      { name: 'Autonomous Economy', desc: 'MASKINERNA SKÖTER PRODUKTIONEN — OCH VISSA JOBB FÖRSVINNER', mods: { research: 38, gdp: 22, factory: 16, unrest: 6 } },
      { name: 'Machine Superintelligence', desc: 'EN TANKE SNABBARE ÄN HELA MÄNSKLIGHETEN', mods: { research: 50, gdp: 30, statepower: 12 } },
      { name: 'The Thinking State', desc: 'STATEN LÄR SIG AV VARJE BESLUT DEN FATTAR', mods: { research: 66, gdp: 40, polpower: 14, corruption: -14 } },
    ],
  },
  agriculture: {
    name: 'Agriculture', icon: '\u{1F33E}', group: 'civil',
    tiers: [
      { name: 'Irrigation Networks', mods: { qol: 3, stability: 3 } },
      { name: 'Fertilizer & Mechanization', mods: { qol: 5, manpower: 4, gdp: 3 } },
      { name: 'Green Revolution Crops', mods: { qol: 8, stability: 5, approval: 4 } },
      { name: 'Precision Farming', mods: { qol: 10, gdp: 6, factory: 4 } },
      { name: 'Vertical Farms', mods: { qol: 16, stability: 8, income: 6 } },
      { name: 'Lab-Grown Food', desc: 'KÖTT OCH MJÖLK UR TANKAR — UTAN EN ENDA KO', mods: { qol: 22, welfare: 8, income: 10 } },
      { name: 'Climate-Proof Harvests', desc: 'GRÖDOR SOM TÅL TORKA, FROST OCH ÖVERSVÄMNING', mods: { qol: 28, stability: 12, income: 14 } },
      { name: 'Food Abundance', mods: { qol: 36, approval: 14, manpower: 10 } },
      { name: 'Hunger Abolished', desc: 'INGEN I RIKET GÅR HUNGRIG — NÅGONSIN', mods: { qol: 46, hdi: 20, approval: 20, stability: 16 } },
    ],
  },
  space: {
    name: 'Space', icon: '\u{1F680}', group: 'civil',
    tiers: [
      { name: 'Sounding Rockets', mods: { research: 3, ideopower: 3 } },
      { name: 'Satellite Launchers', desc: 'EGNA RAKETER — EGNA SATELLITER', mods: { research: 6, income: 3 } },
      { name: 'Crewed Spaceflight', mods: { research: 10, approval: 6, ideopower: 6 } },
      { name: 'Space Station', mods: { research: 16, statepower: 6 } },
      { name: 'Moon Landing', desc: 'DIN FLAGGA PÅ MÅNEN — HELA VÄRLDEN TITTAR', mods: { research: 22, approval: 12, ideopower: 12 } },
      { name: 'Lunar Mining', mods: { research: 20, income: 20, factory: 14 } },
      { name: 'Mars Expedition', desc: 'MÄNNISKOR PÅ EN ANNAN PLANET', mods: { research: 32, approval: 16, ideopower: 16 } },
      { name: 'Asteroid Industry', desc: 'ETT ENDA KLOT AV JÄRN ÄR VÄRT MER ÄN HELA JORDENS GRUVOR', mods: { income: 36, factory: 30, gdp: 20 } },
      { name: 'Interplanetary Nation', desc: 'RIKET SLUTAR INTE VID ATMOSFÄREN', mods: { research: 48, income: 46, ideopower: 24, approval: 20 } },
    ],
  },
  infrastructure: {
    name: 'Infrastructure', icon: '\u{1F3D7}\u{FE0F}', group: 'civil',
    tiers: [
      { name: 'Paved Highways', mods: { income: 4, readiness: 2 } },
      { name: 'National Rail Network', mods: { income: 6, factory: 4, manpower: 3 } },
      { name: 'Deep-Water Ports', mods: { income: 10, gdp: 5 } },
      { name: 'High-Speed Rail', mods: { income: 12, qol: 6, gdp: 6 } },
      { name: 'Smart Cities', desc: 'TRAFIKLJUS, SOPOR OCH EL STYRS AV SENSORER', mods: { income: 16, qol: 14, safety: 6 } },
      { name: 'Maglev Corridors', mods: { income: 22, gdp: 14, readiness: 8 } },
      { name: 'Hyperloop Network', desc: 'HUVUDSTAD TILL GRÄNS PÅ EN KVART', mods: { income: 28, gdp: 20, qol: 10 } },
      { name: 'Self-Building Cities', desc: 'ROBOTAR BYGGER, LAGAR OCH RIVER — DYGNET RUNT', mods: { income: 36, qol: 18, factory: 20 } },
      { name: 'The Seamless Nation', desc: 'ALLT I RIKET ÄR NÄRA ALLT ANNAT', mods: { income: 46, gdp: 30, qol: 24, stability: 12 } },
    ],
  },
  artillery: {
    name: 'Artillery & Rockets', icon: '\u{1F4A5}', group: 'militar',
    tiers: [
      { name: 'Towed Howitzers', mods: { milpower: 4 }, combat: { INF: 1 } },
      { name: 'Self-Propelled Guns', mods: { milpower: 7 }, combat: { INF: 1, TANK: 1 } },
      { name: 'Multiple Rocket Launchers', desc: 'INFANTERIET KAN KALLA IN ELD PÅ AVSTÅND', mods: { milpower: 10, readiness: 3 }, combat: { INF: 2 }, unit: { INF: { rng: 1 } } },
      { name: 'Precision-Guided Shells', mods: { milpower: 14 }, combat: { INF: 2, TANK: 2 } },
      { name: 'Counter-Battery Radar', mods: { milpower: 18, readiness: 6 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 } } },
      { name: 'Loitering Munitions', desc: 'DRÖNARE SOM VÄNTAR OVANFÖR FRONTEN', mods: { milpower: 24 }, combat: { INF: 3, TANK: 3 }, unit: { TANK: { rng: 1 } } },
      { name: 'Hypersonic Artillery', mods: { milpower: 32, readiness: 10 }, combat: { INF: 4, TANK: 4, FLYG: 2 } },
      { name: 'Railgun Batteries', desc: 'PROJEKTILER I SJU GÅNGER LJUDETS HASTIGHET', mods: { milpower: 42 }, unit: { INF: { rng: 1 }, TANK: { rng: 1 } } },
      { name: 'Rain of Steel', desc: 'INGEN FIENDE STÅR KVAR DÄR DITT ARTILLERI SIKTAR', mods: { milpower: 56, readiness: 16 }, combat: { INF: 6, TANK: 6, FLYG: 4 } },
    ],
  },
  airdefense: {
    name: 'Air Defense', icon: '\u{1F3AF}', group: 'militar',
    tiers: [
      { name: 'Anti-Aircraft Guns', mods: { milpower: 3, safety: 3 }, unit: { INF: { hp: 5 } } },
      { name: 'Radar Network', mods: { milpower: 5, safety: 4 }, unit: { FLYG: { hp: 10 } } },
      { name: 'SAM Batteries', mods: { milpower: 8 }, unit: { INF: { hp: 5 }, TANK: { hp: 5 } } },
      { name: 'Integrated Air Defense', mods: { milpower: 12, safety: 6 }, unit: { FLYG: { rng: 1 } } },
      { name: 'Missile Shield', mods: { milpower: 16, stability: 4 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 }, FLYG: { hp: 10 } } },
      { name: 'Laser Point Defense', desc: 'LASRAR SKJUTER NER GRANATER I LUFTEN', mods: { milpower: 22, safety: 8 }, unit: { TANK: { hp: 15 } } },
      { name: 'Drone Interceptor Swarms', mods: { milpower: 28 }, combat: { FLYG: 3 }, unit: { FLYG: { hp: 20 } } },
      { name: 'Space-Based Interceptors', desc: 'ROBOTAR STOPPAS REDAN I RYMDEN', mods: { milpower: 36, safety: 12 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 }, FLYG: { hp: 10 } } },
      { name: 'Impenetrable Sky', desc: 'INGENTING FIENTLIGT TAR SIG IGENOM DIN HIMMEL', mods: { milpower: 46, safety: 18, stability: 8 }, unit: { INF: { hp: 15 }, TANK: { hp: 15 }, FLYG: { hp: 15, heal: 1 } } },
    ],
  },
  medicine: {
    name: 'Combat Medicine', icon: '\u{26D1}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Field Medics', desc: 'INFANTERIET LÄKER LITE VARJE TUR', mods: { manpower: 3 }, unit: { INF: { heal: 1 } } },
      { name: 'Field Hospitals', mods: { manpower: 5, approval: 2 }, unit: { INF: { hp: 5 } } },
      { name: 'Medevac Helicopters', mods: { manpower: 6 }, unit: { TANK: { heal: 1 } } },
      { name: 'Trauma Nanogel', mods: { manpower: 8, qol: 2 }, unit: { INF: { heal: 1, hp: 5 } } },
      { name: 'Battlefield Surgery Robots', mods: { manpower: 10 }, unit: { TANK: { heal: 1 }, FLYG: { heal: 1 } } },
      { name: 'Combat Stimulants', mods: { manpower: 12, readiness: 6 }, unit: { INF: { hp: 10 } } },
      { name: 'Regenerative Armor', desc: 'RUSTNINGEN LAGAR BÅDE SIG SJÄLV OCH SOLDATEN', mods: { manpower: 14 }, unit: { INF: { heal: 1 }, TANK: { heal: 1 }, FLYG: { heal: 1 } } },
      { name: 'Cellular Field Repair', mods: { manpower: 18 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 }, FLYG: { hp: 10 } } },
      { name: 'No Soldier Left Behind', desc: 'ALLA KOMMER HEM', mods: { manpower: 24, approval: 10 }, unit: { INF: { heal: 2 }, TANK: { heal: 2 }, FLYG: { heal: 2 } } },
    ],
  },
  engineering: {
    name: 'Combat Engineers', icon: '\u{1F6E0}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Pontoon Bridges', mods: { readiness: 2 }, unit: { INF: { mv: 1 } } },
      { name: 'Field Fortifications', mods: { readiness: 4 }, unit: { INF: { hp: 10 } } },
      { name: 'Mine Clearing', mods: { readiness: 5, milpower: 4 }, unit: { TANK: { mv: 1 } } },
      { name: 'Rapid Airfields', mods: { readiness: 7 }, unit: { FLYG: { mv: 1 } } },
      { name: 'Bunker Networks', mods: { readiness: 9, stability: 3 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 } } },
      { name: 'Mobile Bridging Systems', mods: { readiness: 12 }, unit: { INF: { mv: 1 }, TANK: { mv: 1 } } },
      { name: 'Terrain Shaping', mods: { readiness: 16, milpower: 8 }, unit: { INF: { hp: 10 }, TANK: { hp: 10 }, FLYG: { hp: 10 } } },
      { name: 'Self-Building Bases', mods: { readiness: 20, milpower: 12 }, unit: { INF: { heal: 1 }, TANK: { heal: 1 }, FLYG: { heal: 1 } } },
      { name: 'No Obstacle Stands', desc: 'BERG, FLODER OCH MINFÄLT — INGET STOPPAR DIG', mods: { readiness: 26, milpower: 18 }, unit: { INF: { mv: 1 }, TANK: { mv: 1 }, FLYG: { mv: 1 } } },
    ],
  },
};

// V5.15: forskningen tar aldrig slut. Efter grenens sista namngivna nivå kommer
// nivåer i all oändlighet — varje ger ungefär en sjättedel av sista nivåns
// goda effekter till, dyrare och dyrare.
export const ENDLESS_NAME = {
  political: 'Statecraft Mastery', economy: 'Economic Breakthrough', corruption: 'Integrity Doctrine',
  unrest: 'Social Harmony', safety: 'Public Safety Advance', immigration: 'Talent Magnet',
  healthcare: 'Medical Breakthrough', education: 'Knowledge Frontier', logistics: 'Logistics Perfection',
  climate: 'Planetary Stewardship', infantry: 'Infantry Doctrine', navy: 'Naval Doctrine',
  tanks: 'Armour Doctrine', aircraft: 'Air Doctrine', nuclear: 'Strategic Deterrence',
  satellites: 'Orbital Network', integration: 'Unity Doctrine', espionage: 'Intelligence Edge',
  energy: 'Energy Frontier', computing: 'Compute Scaling', agriculture: 'Harvest Science',
  space: 'Deep Space Program', infrastructure: 'Mega-Projects', artillery: 'Fire Doctrine',
  airdefense: 'Sky Shield', medicine: 'Field Medicine', engineering: 'Engineering Doctrine',
};

// V5.15: förkunskaper mellan grenar — man bygger inte drönarsvärmar utan datorer.
// 'gren:nivå' (1-baserat) → { annan gren: nivå som krävs }
export const NEEDS = {
  'nuclear:2': { education: 3 }, 'nuclear:5': { energy: 3 },
  'satellites:1': { education: 2 }, 'satellites:2': { space: 2 },
  'aircraft:3': { computing: 2 }, 'aircraft:7': { space: 4 },
  'tanks:3': { computing: 3 }, 'tanks:4': { energy: 4 },
  'infantry:4': { computing: 2 }, 'infantry:6': { computing: 5 },
  'navy:8': { computing: 6 }, 'logistics:7': { space: 5 },
  'healthcare:4': { education: 3 }, 'healthcare:7': { computing: 5 },
  'economy:8': { computing: 6 }, 'climate:4': { energy: 4 },
  'espionage:5': { computing: 4 }, 'safety:4': { computing: 4 }, 'unrest:7': { computing: 6 },
  'computing:5': { education: 4 }, 'space:3': { education: 3 }, 'space:5': { computing: 3 },
  'energy:3': { education: 2 }, 'energy:7': { education: 6 }, 'energy:8': { space: 6 },
  'artillery:6': { computing: 4 }, 'artillery:8': { energy: 6 },
  'airdefense:6': { energy: 5 }, 'airdefense:8': { space: 5 },
  'medicine:4': { healthcare: 3 }, 'medicine:8': { healthcare: 7 },
  'agriculture:6': { education: 5 }, 'agriculture:7': { climate: 4 },
  'infrastructure:5': { computing: 4 }, 'infrastructure:7': { energy: 6 },
};

// ---------- V5.15: OÄNDLIGA NIVÅER ----------
// Kostnad och tid för nivå i (0-baserat). Efter tabellen växer priset nästan
// linjärt (ca +2 600 per nivå) och tiden med 8 dagar — ett exponentiellt pris
// hade blivit ett tak i praktiken, och taket är det Henry vill bli av med.
export function tierCost(i) {
  if (i < TIER_COST.length) return TIER_COST[i];
  const n = i - TIER_COST.length + 1;
  return Math.round((TIER_COST[TIER_COST.length - 1] + 2600 * n * (1 + 0.04 * n)) / 100) * 100;
}
export function tierDays(i) {
  if (i < TIER_DAYS.length) return TIER_DAYS[i];
  return TIER_DAYS[TIER_DAYS.length - 1] + 8 * (i - TIER_DAYS.length + 1);
}

const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
export function roman(n) {
  let out = '';
  for (const [v, r] of ROMAN) while (n >= v) { out += r; n -= v; }
  return out;
}

// höjda värden som är BRA (oro och korruption är bra när de sjunker)
const INVERTED = new Set(['corruption', 'unrest', 'justtime']);
const UNIT_TYPES3 = ['INF', 'TANK', 'FLYG'];
const _endless = new Map();

// Nivå i (0-baserat) i en gren — namngiven eller oändlig.
export function tierOf(bid, i) {
  const def = RESEARCH[bid];
  if (!def || i < 0) return null;
  if (i < def.tiers.length) return def.tiers[i];
  const n = i - def.tiers.length + 1;          // 1, 2, 3 … bortom kartan
  const key = bid + ':' + n;
  if (_endless.has(key)) return _endless.get(key);
  const last = def.tiers[def.tiers.length - 1];
  // bara de goda effekterna följer med — oändlig forskning gör aldrig landet sämre
  const mods = {};
  for (const [k, v] of Object.entries(last.mods || {})) {
    if ((v > 0) === INVERTED.has(k)) continue;
    mods[k] = Math.sign(v) * Math.max(1, Math.round(Math.abs(v) * 0.16));
  }
  // militära grenar: förbanden blir starkare i all oändlighet
  const touched = new Set();
  for (const t of def.tiers) for (const k of [...Object.keys(t.combat || {}), ...Object.keys(t.unit || {})]) touched.add(k);
  const combat = {}, unit = {};
  for (const T of UNIT_TYPES3) {
    if (!touched.has(T)) continue;
    const lastAtk = [...def.tiers].reverse().find((t) => t.combat?.[T])?.combat[T] || 0;
    if (lastAtk) combat[T] = Math.max(1, Math.round(lastAtk * 0.15));
    const u = { hp: 6 };
    if (n % 3 === 0) u.heal = 1;
    if (n % 4 === 0) u.mv = 1;
    if (n % 5 === 0) u.rng = 1;
    unit[T] = u;
  }
  const t = {
    name: `${ENDLESS_NAME[bid] || def.name} ${roman(n)}`,
    desc: `OÄNDLIG FORSKNING — NIVÅ ${i + 1}`,
    mods, endless: n,
    ...(Object.keys(combat).length ? { combat } : {}),
    ...(Object.keys(unit).length ? { unit } : {}),
  };
  _endless.set(key, t);
  return t;
}

// Saknade förkunskaper för nivå i (0-baserat) — [{ branch, tier }]
export function missingNeeds(nation, bid, i) {
  const need = NEEDS[`${bid}:${i + 1}`];
  if (!need) return [];
  return Object.entries(need)
    .filter(([b, t]) => (nation?.research?.[b] || 0) < t)
    .map(([branch, tier]) => ({ branch, tier }));
}

// nation.research = { grenId: högsta klara tier } — utan övre gräns (V5.15)
export function researchMods(nation) {
  const sum = {};
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    if (!RESEARCH[branch]) continue;
    for (let i = 0; i < tier; i++) {
      for (const [k, v] of Object.entries(tierOf(branch, i).mods || {})) sum[k] = (sum[k] || 0) + v;
    }
  }
  return sum;
}

// stridbonus per enhetstyp (extra skada) från militärforskning
export function combatBonus(nation) {
  const bonus = { INF: 0, TANK: 0, FLYG: 0 };
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    if (!RESEARCH[branch]) continue;
    for (let i = 0; i < tier; i++) {
      for (const [k, v] of Object.entries(tierOf(branch, i).combat || {})) bonus[k] += v;
    }
  }
  return bonus;
}

// V5.15: förbandens egenskaper ur forskningen, per typ:
// atk (extra skada), hp (% mer hälsa), rng (extra rutor räckvidd),
// mv (extra rutor rörlighet), heal (hälsa tillbaka varje tur)
export const UNIT_STATS = [
  { k: 'atk', name: 'ATTACK', icon: '\u{2694}\u{FE0F}', fmt: (v) => `+${v}` },
  { k: 'hp', name: 'HÄLSA', icon: '\u{2764}\u{FE0F}', fmt: (v) => `+${v} %` },
  { k: 'rng', name: 'RÄCKVIDD', icon: '\u{1F3AF}', fmt: (v) => `${1 + v} RUT${v ? 'OR' : 'A'}` },
  { k: 'mv', name: 'RÖRLIGHET', icon: '\u{1F463}', fmt: (v) => `+${v}` },
  { k: 'heal', name: 'LÄKNING', icon: '\u{271A}', fmt: (v) => `+${v}/TUR` },
];
export function unitUpgrades(nation) {
  const atk = combatBonus(nation);
  const up = {};
  for (const T of UNIT_TYPES3) up[T] = { atk: atk[T] || 0, hp: 0, rng: 0, mv: 0, heal: 0 };
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    if (!RESEARCH[branch]) continue;
    for (let i = 0; i < tier; i++) {
      for (const [T, u] of Object.entries(tierOf(branch, i).unit || {})) {
        for (const [k, v] of Object.entries(u)) up[T][k] += v;
      }
    }
  }
  return up;
}

// försörjningsräckvidd i radianer från eget territorium — logistikforskning
// förlänger den. Bas ≈ två grannländer bort; varje tier ≈ ett land till.
export function logisticsRange(nation) {
  return 0.30 + 0.14 * (nation?.research?.logistics || 0);
}

// satellittäckning i radianer från hemlandets huvudstad.
// Bas = grannländerna; T1 ≈ 2 länder bort; T2 ≈ 5 länder bort;
// T3 = 40% av jordytan; T4 = 70%; T5+ = total täckning.
export function satCoverage(nation) {
  const t = nation?.research?.satellites || 0;
  return [0.25, 0.5, 0.9, 1.3694, 1.9823, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity][Math.min(t, 10)];
}

// spionagenivå: 1 = destination, 2 = nationalitet, 3 = antal, 4 = sammansättning
export function espionageTier(nation) {
  return nation?.research?.espionage || 0;
}

export function hasUnlock(nation, key) {
  for (const [branch, tier] of Object.entries(nation?.research || {})) {
    const def = RESEARCH[branch];
    if (!def) continue;
    for (let i = 0; i < Math.min(tier, def.tiers.length); i++) {
      if (def.tiers[i].unlock === key) return true;
    }
  }
  return false;
}
