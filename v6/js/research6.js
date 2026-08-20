// TRADE WARS — forskningsträdet.
//
// Forskningen är omlagd kring infrastruktur. De militära grenarna finns kvar
// men bonusarna är KRAFTIGT nedskruvade jämfört med V5 — där kunde forskning
// ensam avgöra en strid, här ska ekonomin och logistiken avgöra kriget.

export const TIER_COST = [40, 110, 260, 560, 1100, 2100, 3800];
export const TIER_DAYS = [8, 14, 22, 32, 46, 64, 90];

export const RESEARCH = {
  // ---------- LOGISTIK ----------
  logistics: {
    name: 'Logistik', icon: '\u{1F4E6}', group: 'infra',
    tiers: [
      { name: 'Lastpallar', desc: 'ALLA FÖRBINDELSER GER +6% INKOMST', mods: { linkIncome: 6 } },
      { name: 'Lagerhållning', desc: 'LÅSER UPP LAGERUTBYGGNAD', mods: { linkIncome: 10 } },
      { name: 'Containerisering', desc: 'FÖRBINDELSER GER +18% INKOMST', mods: { linkIncome: 18 } },
      { name: 'Just-in-time', desc: 'FORDONEN RÖR SIG 15% SNABBARE', mods: { linkIncome: 24, linkSpeed: 15 } },
      { name: 'Automatiserade nav', desc: 'BYGGKOSTNAD FÖR TERMINALER −20%', mods: { linkIncome: 32, terminalCost: -20 } },
      { name: 'Global försörjningskedja', desc: '+45% INKOMST PÅ ALLA FÖRBINDELSER', mods: { linkIncome: 45, linkSpeed: 25 } },
    ],
  },
  trucking: {
    name: 'Lastbilar', icon: '\u{1F69B}', group: 'infra',
    tiers: [
      { name: 'Tyngre lastbilar', desc: 'VÄGAR GER +12% INKOMST', mods: { roadIncome: 12 } },
      { name: 'Motorvägar', desc: 'LASTBILAR KÖR 20% SNABBARE', mods: { roadIncome: 18, roadSpeed: 20 } },
      { name: 'Släpfordon', desc: 'VÄGAR GER +30% INKOMST', mods: { roadIncome: 30 } },
      { name: 'Kylkedja', desc: 'VÄGAR GER +45% INKOMST', mods: { roadIncome: 45 } },
      { name: 'Självkörande konvojer', desc: 'DUBBEL HASTIGHET PÅ VÄG', mods: { roadIncome: 60, roadSpeed: 90 } },
    ],
  },
  rail: {
    name: 'Järnväg', icon: '\u{1F686}', group: 'infra',
    tiers: [
      { name: 'Rälsbyggnad', desc: 'LÅSER UPP TÅGSTATION OCH JÄRNVÄG', mods: {} },
      { name: 'Elektrifierad räls', desc: 'TÅG GER +20% INKOMST', mods: { railIncome: 20 } },
      { name: 'Godsvagnar i dubbel höjd', desc: 'TÅG GER +35% INKOMST', mods: { railIncome: 35 } },
      { name: 'Höghastighetsbana', desc: 'TÅG KÖR 35% SNABBARE', mods: { railIncome: 45, railSpeed: 35 } },
      { name: 'Maglev-frakt', desc: 'TÅG BLIR RIKETS RYGGRAD', mods: { railIncome: 70, railSpeed: 70 } },
    ],
  },
  shipping: {
    name: 'Sjöfart', icon: '\u{1F6A2}', group: 'infra',
    tiers: [
      { name: 'Hamnanläggning', desc: 'LÅSER UPP HAMN OCH SJÖFART', mods: {} },
      { name: 'Containerfartyg', desc: 'SJÖFART GER +25% INKOMST', mods: { seaIncome: 25 } },
      { name: 'Djuphamnar', desc: 'SJÖFART GER +40% INKOMST', mods: { seaIncome: 40 } },
      { name: 'Panamax-klass', desc: 'FARTYGEN LASTAR DUBBELT', mods: { seaIncome: 60 } },
      { name: 'Autonoma fraktfartyg', desc: 'SJÖFART GER +85% OCH GÅR SNABBARE', mods: { seaIncome: 85, seaSpeed: 30 } },
    ],
  },
  aviation: {
    name: 'Flyg', icon: '\u{2708}\u{FE0F}', group: 'infra',
    tiers: [
      { name: 'Landningsbanor', desc: 'LÅSER UPP FLYGPLATS OCH FLYGFRAKT', mods: {} },
      { name: 'Fraktflygplan', desc: 'FLYG GER +25% INKOMST', mods: { airIncome: 25 } },
      { name: 'Nattflyg', desc: 'FLYG GER +40% INKOMST', mods: { airIncome: 40 } },
      { name: 'Långdistansfrakt', desc: 'FLYG NÅR VART SOM HELST SNABBARE', mods: { airIncome: 55, airSpeed: 30 } },
      { name: 'Överljudsfrakt', desc: 'DUBBEL HASTIGHET I LUFTEN', mods: { airIncome: 80, airSpeed: 100 } },
    ],
  },
  // ---------- EL ----------
  power: {
    name: 'Energi', icon: '\u{26A1}', group: 'infra',
    tiers: [
      { name: 'Solceller', desc: 'LÅSER UPP SOLPANELSPARK', mods: {} },
      { name: 'Högre torn', desc: 'LÅSER UPP HÖGVINDVERK', mods: {} },
      { name: 'Koncentrerad solkraft', desc: 'LÅSER UPP SPEGELKRAFTVERK', mods: {} },
      { name: 'Kärnteknik', desc: 'LÅSER UPP KÄRNREAKTOR', mods: {} },
      { name: 'Djupborrning', desc: 'LÅSER UPP GEOTERMISK ANLÄGGNING', mods: {} },
      { name: 'Inneslutet plasma', desc: 'LÅSER UPP FUSIONSREAKTOR — MYCKET DYR, MYCKET LÅNG TID', mods: {} },
      { name: 'Supraledande nät', desc: 'ELLEDNINGAR KOSTAR 40% MINDRE', mods: { lineCost: -40 } },
    ],
  },
  // ---------- CIVILT ----------
  economy: {
    name: 'Ekonomi', icon: '\u{1F4B0}', group: 'civil',
    tiers: [
      { name: 'Bankväsende', desc: 'LÅSER UPP BANK', mods: { money: 2 } },
      { name: 'Kreditmarknad', desc: 'ALLA BYGGNADER GER +8% PENGAR', mods: { moneyPct: 8 } },
      { name: 'Kapitalmarknad', desc: 'LÅSER UPP BÖRS', mods: { moneyPct: 14 } },
      { name: 'Skatteeffektivitet', desc: 'UNDERHÅLL −12%', mods: { upkeepPct: -12 } },
      { name: 'Handelsimperium', desc: 'MARKNADSPLATSEN GER BÄTTRE PRISER', mods: { moneyPct: 22, tradePrice: 15 } },
    ],
  },
  education: {
    name: 'Utbildning', icon: '\u{1F393}', group: 'civil',
    tiers: [
      { name: 'Läroplan', desc: 'LÅSER UPP UNIVERSITET', mods: { research: 0.4 } },
      { name: 'Lärarutbildning', desc: 'ALLA BYGGNADER GER +10% FORSKNING', mods: { researchPct: 10 } },
      { name: 'Forskningsråd', desc: 'LÅSER UPP FORSKNINGSPARK', mods: { researchPct: 18 } },
      { name: 'Akademiskt nätverk', desc: 'FORSKNING +28%', mods: { researchPct: 28 } },
      { name: 'Arkologisk planering', desc: 'LÅSER UPP ARKOLOGI', mods: { researchPct: 35 } },
    ],
  },
  political: {
    name: 'Statskonst', icon: '\u{1F3DB}\u{FE0F}', group: 'civil',
    tiers: [
      { name: 'Kommunalt styre', desc: 'RÅDHUS GER MER', mods: { pp: 0.3 } },
      { name: 'Departement', desc: 'LÅSER UPP MINISTERIUM', mods: { ppPct: 12 } },
      { name: 'Central förvaltning', desc: 'LÅSER UPP FÖRVALTNINGSCENTRUM', mods: { ppPct: 20 } },
      { name: 'Statsapparat', desc: 'POLITISK MAKT +30%', mods: { ppPct: 30 } },
    ],
  },
  healthcare: {
    name: 'Sjukvård', icon: '\u{1F3E5}', group: 'civil',
    tiers: [
      { name: 'Folkhälsa', desc: 'LÅSER UPP SJUKHUS', mods: { man: 0.4 } },
      { name: 'Vaccinationsprogram', desc: 'MANSKAP +12%', mods: { manPct: 12 } },
      { name: 'Specialistvård', desc: 'MANSKAP +22%', mods: { manPct: 22 } },
      { name: 'Livslängdsforskning', desc: 'MANSKAP +35%', mods: { manPct: 35 } },
    ],
  },
  // ---------- MILITÄRT (kraftigt nedskruvat mot V5) ----------
  infantry: {
    name: 'Infanteri', icon: '\u{1F9CD}', group: 'mil',
    tiers: [
      { name: 'Grundutbildning', desc: 'INFANTERI +2% I STRID', mods: { combat: 2 } },
      { name: 'Automatvapen', desc: 'INFANTERI +4%', mods: { combat: 4 } },
      { name: 'Mekaniserat infanteri', desc: 'INFANTERI +6%', mods: { combat: 6 } },
      { name: 'Nattstrid', desc: 'INFANTERI +8%', mods: { combat: 8 } },
      { name: 'Exoskelett', desc: 'INFANTERI +11%', mods: { combat: 11 } },
    ],
  },
  armour: {
    name: 'Pansar', icon: '\u{1F6E1}\u{FE0F}', group: 'mil',
    tiers: [
      { name: 'Pansarvagnar', desc: 'LÅSER UPP STRIDSVAGNAR', mods: { combat: 2 } },
      { name: 'Kompositpansar', desc: 'PANSAR +4%', mods: { combat: 4 } },
      { name: 'Reaktivt pansar', desc: 'PANSAR +7%', mods: { combat: 7 } },
      { name: 'Aktivt skydd', desc: 'PANSAR +10%', mods: { combat: 10 } },
    ],
  },
  airforce: {
    name: 'Flygvapen', icon: '\u{1F6E9}\u{FE0F}', group: 'mil',
    tiers: [
      { name: 'Flygplan', desc: 'LÅSER UPP FLYGPLAN', mods: { combat: 2 } },
      { name: 'Jaktflyg', desc: 'FLYG +5%', mods: { combat: 5 } },
      { name: 'Smygteknik', desc: 'FLYG +8%', mods: { combat: 8 } },
      { name: 'Luftherravälde', desc: 'FLYG +12%', mods: { combat: 12 } },
    ],
  },
};

// Summerar forskningens effekter.
export function researchMods(research) {
  const out = {};
  for (const [branch, tier] of Object.entries(research || {})) {
    const def = RESEARCH[branch];
    if (!def) continue;
    for (let i = 0; i < Math.min(tier, def.tiers.length); i++) {
      for (const [k, v] of Object.entries(def.tiers[i].mods || {})) {
        out[k] = (out[k] || 0) + v;
      }
    }
  }
  return out;
}

// Stridsbonus. Taket är MEDVETET lågt: i TRADE WARS vinner man med ekonomi.
export function combatBonus(research) {
  return Math.min(28, researchMods(research).combat || 0);
}

// Inkomstfaktor för en förbindelse av given sort.
export function linkIncomeMult(research, kind) {
  const m = researchMods(research);
  const perKind = { road: m.roadIncome, rail: m.railIncome, sea: m.seaIncome, air: m.airIncome };
  return 1 + ((m.linkIncome || 0) + (perKind[kind] || 0)) / 100;
}

export function linkSpeedMult(research, kind) {
  const m = researchMods(research);
  const perKind = { road: m.roadSpeed, rail: m.railSpeed, sea: m.seaSpeed, air: m.airSpeed };
  return 1 + ((m.linkSpeed || 0) + (perKind[kind] || 0)) / 100;
}
