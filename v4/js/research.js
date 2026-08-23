// IMPERIUM v5 — forskningsträd: 18 grenar × 9 nivåer (satelliter 10). Allt är data.
// Kostnad i forskningspoäng; varje nivå kräver föregående. mods = permanenta
// effekter på nationsvärden. unlock = specialförmågor (t.ex. kärnvapen).
// combat = extra stridsskada per enhetstyp (INF/TANK/FLYG).
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
      { name: 'Järnvägslogistik', mods: { readiness: 5, manpower: 3 } },
      { name: 'Lufttransport & konvojer', mods: { readiness: 8, manpower: 5 } },
      { name: 'Automatiserad försörjningskedja', mods: { readiness: 12, manpower: 8 } },
      { name: 'Continental Rail Backbone', mods: { readiness: 18, income: 10, factory: 8 } },
      { name: 'Strategic Airlift Command', mods: { readiness: 26, milpower: 12, income: 15 } },
      { name: 'Orbital Drop Logistics', desc: 'FÖRSÖRJNING FRÅN OMLOPPSBANA — RÄCKVIDDEN EXPLODERAR', mods: { readiness: 34, milpower: 18, income: 20, factory: 12 } },
      { name: 'Autonomous Supply Swarms', desc: 'FÖRRÅDEN FLYTTAR SIG SJÄLVA TILL FRONTEN', mods: { readiness: 44, milpower: 24, income: 26, manpower: 12 } },
      { name: 'The Unbroken Chain', desc: 'DINA ARMÉER KAN ALDRIG SVÄLTAS UT', mods: { readiness: 56, milpower: 32, income: 34, factory: 20, manpower: 18 } },
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
      { name: 'Small Arms & Body Armor', mods: { milpower: 5 }, combat: { INF: 1 } },
      { name: 'Mechanized Battalions', mods: { milpower: 8, readiness: 5 }, combat: { INF: 2 } },
      { name: 'Special Operations Force', mods: { milpower: 10, readiness: 8 }, combat: { INF: 3 } },
      { name: 'Exoskeletons & Combat Drones', mods: { milpower: 15, readiness: 10 }, combat: { INF: 5 } },
      { name: 'Powered Exosuits', mods: { milpower: 20, readiness: 12 }, combat: { INF: 7 } },
      { name: 'Autonomous Infantry Squads', mods: { milpower: 30, readiness: 15 }, combat: { INF: 10 } },
      { name: 'Neural-Linked Squads', desc: 'HELA KOMPANIET TÄNKER SOM EN ENDA SOLDAT', mods: { milpower: 40, readiness: 20 }, combat: { INF: 14 } },
      { name: 'Augmented Shock Troopers', desc: 'BIOLOGISKT FÖRSTÄRKT INFANTERI', mods: { milpower: 52, readiness: 26, manpower: 10 }, combat: { INF: 19 } },
      { name: 'The Unbreakable Line', desc: 'DITT INFANTERI VIKER INTE — NÅGONSIN', mods: { milpower: 68, readiness: 34, manpower: 18 }, combat: { INF: 26 } },
    ],
  },
  navy: {
    name: 'Navy', icon: '\u{1F6A2}', group: 'militar',
    tiers: [
      { name: 'Coastal Guard Patrols', mods: { milpower: 4, safety: 3 } },
      { name: 'Destroyers & Submarines', mods: { milpower: 8 } },
      { name: 'Supercarrier Strike Groups', mods: { milpower: 14, readiness: 6 } },
      { name: 'Stealth Drone Fleets', mods: { milpower: 20, readiness: 10 } },
      { name: 'Nuclear Carrier Groups', mods: { milpower: 26, readiness: 12 }, combat: { INF: 2, TANK: 2 } },
      { name: 'Blue-Water Supremacy', mods: { milpower: 36, readiness: 16, income: 8 }, combat: { INF: 4, TANK: 4 } },
      { name: 'Submerged Arsenal Ships', desc: 'HELA FLOTTAN KAN GÖMMA SIG UNDER YTAN', mods: { milpower: 48, readiness: 22, income: 12 }, combat: { INF: 6, TANK: 6 } },
      { name: 'Autonomous Wolfpacks', desc: 'OBEMANNADE UBÅTSFLOCKAR JAGAR SJÄLVSTÄNDIGT', mods: { milpower: 62, readiness: 28, income: 18 }, combat: { INF: 8, TANK: 8, FLYG: 4 } },
      { name: 'Command of Every Ocean', desc: 'INGEN SEGLAR NÅGONSTANS UTAN DITT MEDGIVANDE', mods: { milpower: 80, readiness: 36, income: 26, statepower: 12 }, combat: { INF: 11, TANK: 11, FLYG: 7 } },
    ],
  },
  tanks: {
    name: 'Tanks', icon: '\u{1F6E1}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'MBT Modernization', mods: { milpower: 5 }, combat: { TANK: 1 } },
      { name: 'Active Protection Systems', mods: { milpower: 8 }, combat: { TANK: 2 } },
      { name: 'Unmanned Ground Vehicles', mods: { milpower: 12, manpower: 5 }, combat: { TANK: 3 } },
      { name: 'Electromagnetic Rail-Tanks', mods: { milpower: 18 }, combat: { TANK: 5 } },
      { name: 'Active Protection Armour', mods: { milpower: 24, readiness: 8 }, combat: { TANK: 7 } },
      { name: 'Autonomous Armour Divisions', mods: { milpower: 34, readiness: 12, manpower: 8 }, combat: { TANK: 10 } },
      { name: 'Reactive Nanoplate Hulls', desc: 'PANSARET LÄKER SIG SJÄLVT MELLAN TRÄFFAR', mods: { milpower: 46, readiness: 16 }, combat: { TANK: 14 } },
      { name: 'Walker Assault Platforms', desc: 'BEPANSRADE GÅENDE PLATTFORMAR TAR VILKEN TERRÄNG SOM HELST', mods: { milpower: 60, readiness: 22, manpower: 12 }, combat: { TANK: 19 } },
      { name: 'The Iron Tide', desc: 'INGEN FRONT HÅLLER MOT DITT PANSAR', mods: { milpower: 78, readiness: 30, manpower: 18 }, combat: { TANK: 26 } },
    ],
  },
  aircraft: {
    name: 'Aircraft', icon: '\u{2708}\u{FE0F}', group: 'militar',
    tiers: [
      { name: 'Jet Fighter Fleets', mods: { milpower: 5 }, combat: { FLYG: 1 } },
      { name: 'Stealth Fighters & Bombers', mods: { milpower: 9 }, combat: { FLYG: 2 } },
      { name: 'Combat Drone Swarms', mods: { milpower: 13, manpower: 4 }, combat: { FLYG: 3 } },
      { name: 'Hypersonic Strike Aircraft', mods: { milpower: 18 }, combat: { FLYG: 5 } },
      { name: 'Stealth Air Superiority', mods: { milpower: 26, readiness: 8 }, combat: { FLYG: 8 } },
      { name: 'Hypersonic Strike Wing', mods: { milpower: 38, readiness: 12 }, combat: { FLYG: 11 } },
      { name: 'Orbital Bombardment Wing', desc: 'ANFALL FRÅN RYMDEN — INGEN LUFTVÄRN NÅR DIT', mods: { milpower: 50, readiness: 18 }, combat: { FLYG: 15 } },
      { name: 'Autonomous Air Fleets', desc: 'PILOTLÖSA VINGAR SOM ALDRIG TRÖTTNAR', mods: { milpower: 64, readiness: 24, manpower: 12 }, combat: { FLYG: 20 } },
      { name: 'Total Air Supremacy', desc: 'INGENTING FIENTLIGT LYFTER FRÅN MARKEN', mods: { milpower: 82, readiness: 32, manpower: 18 }, combat: { FLYG: 27 } },
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
      { name: 'Regional täckning', desc: '40% AV JORDEN BEVAKAS FRÅN HEMLANDET', mods: { research: 8, milpower: 5 } },
      { name: 'Interkontinental täckning', desc: '70% AV JORDEN BEVAKAS', mods: { research: 10, milpower: 7 } },
      { name: 'Globalt satellitnätverk', desc: 'TOTAL TÄCKNING — HELA JORDEN BEVAKAS', mods: { research: 14, milpower: 10 } },
      { name: 'Orbitalt varningssystem', desc: 'FRÄMMANDE ANFALL SYNS INNAN DE STARTAR', mods: { research: 18, milpower: 14, safety: 6 } },
      { name: 'Djuprymdsnätverk', desc: 'TOTAL TÄCKNING + FORSKNINGSSPRÅNG', mods: { research: 26, milpower: 18 } },
      { name: 'Orbital vapenplattform', desc: 'SATELLITERNA KAN SLÅ TILLBAKA SJÄLVA', mods: { research: 34, milpower: 26, safety: 10 } },
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
};

// nation.research = { grenId: högsta klara tier }
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
    for (let i = 0; i < tier && i < def.tiers.length; i++) {
      if (def.tiers[i].unlock === key) return true;
    }
  }
  return false;
}
