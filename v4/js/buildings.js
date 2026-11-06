// IMPERIUM v4 — stadsbyggnader: produktion, poäng, råvaror och handel. Allt är data.
// unlocksUnit = gör enhetstypen byggbar i landet där byggnaden står.
// daily = daglig avkastning. resource = landet producerar råvaran. tradeSlot = +1 handelsavtal.
//
// V5.17 BYGGBOOM (Henrys önskemål): 30 nya byggnader, 15 platser per stad och bygge i
// många städer på en gång. Nya fält:
//   cat        avdelning i byggmenyn (BUILD_CATS)
//   drift      driftkostnad i % av rikets dagsinkomst när VARJE stad har byggnaden — varje
//              byggnad kostar sin stads andel av folket. driftFix = % per byggnad (en per land)
//   upkeep     fast driftkostnad per dag (bara det gamla integrationskontoret)
//   stats      nationsvärden när VARJE stad i riket har byggnaden — täckningen räknas
//              på befolkningen, så storstäderna väger tyngst (coverageMods)
//   perCountry högst så många i varje land (börsen, rymdcentret)
//   needs      råvaror som riket måste ha (kärnkraftverket behöver uran)
import { money, people } from './real.js';

export const BUILD_CATS = {
  mil: 'MILITÄRT', eko: 'EKONOMI & HANDEL', kun: 'KUNSKAP', val: 'VÄLFÄRD',
  sam: 'SAMHÄLLE & KULTUR', kon: 'ORDNING & KONTROLL', eng: 'ENERGI', rav: 'RÅVAROR',
};

export const BUILDINGS = {
  kasern: { cat: 'mil', name: 'KASERN', icon: '\u{1F396}\u{FE0F}', money: 120, days: 4, unlocksUnit: 'INF', desc: 'GÖR INFANTERI BYGGBART I LANDET' },
  fabrik: { cat: 'mil', name: 'STRIDSVAGNSFABRIK', icon: '\u{1F3ED}', money: 260, days: 6, unlocksUnit: 'TANK', research: ['tanks', 1], desc: 'GÖR STRIDSVAGNAR BYGGBARA I LANDET' },
  flygbas: { cat: 'mil', name: 'FLYGBAS', icon: '\u{1F6EB}', money: 340, days: 8, unlocksUnit: 'FLYG', research: ['aircraft', 1], desc: 'GÖR FLYG BYGGBART I LANDET' },
  universitet: { cat: 'kun', name: 'UNIVERSITET', icon: '\u{1F393}', money: 220, days: 5, daily: { rp: 2 }, desc: 'FORSKNING VARJE DAG' },
  bank: { cat: 'eko', name: 'BANK', icon: '\u{1F3E6}', money: 220, days: 5, daily: { money: 8 }, desc: 'PENGAR VARJE DAG' },
  rekryt: { cat: 'mil', name: 'REKRYTERINGSKONTOR', icon: '\u{1F9CD}', money: 150, days: 4, daily: { man: 1 }, desc: 'REKRYTER VARJE DAG' },
  marknad: { cat: 'eko', name: 'HANDELSMARKNAD', icon: '\u{1F91D}', money: 200, days: 5, tradeSlot: 1, desc: '+1 HANDELSAVTAL' },
  integration: { cat: 'sam', name: 'INTEGRATIONSKONTOR', icon: '\u{1F3DB}\u{FE0F}', money: 260, days: 6, upkeep: 6, office: true, desc: 'INTEGRERAR LANDET SNABBARE' },
  gruva: { cat: 'rav', name: 'GRUVA', icon: '\u{26CF}\u{FE0F}', money: 240, days: 6, resource: 'JARN', research: ['economy', 1], desc: 'PRODUCERAR JÄRN' },
  raffinaderi: { cat: 'rav', name: 'RAFFINADERI', icon: '\u{1F6E2}\u{FE0F}', money: 320, days: 7, resource: 'OLJA', research: ['economy', 2], desc: 'PRODUCERAR OLJA' },

  // ---------- V5.17: 30 nya ----------
  akademi: { cat: 'mil', name: 'MILITÄRAKADEMI', icon: '\u{1F3AF}', money: 420, days: 9, drift: 3, research: ['infantry', 1],
    stats: { readiness: 10, milpower: 8 }, desc: 'OFFICERARE SOM KAN SITT HANTVERK' },
  bors: { cat: 'eko', name: 'BÖRS', icon: '\u{1F4C8}', money: 650, days: 12, perCountry: 1, research: ['economy', 2],
    daily: { money: 16 }, stats: { gdp: 4, corruption: 3 }, desc: 'KAPITALET SAMLAS — EN PER LAND' },
  hamn: { cat: 'eko', name: 'HAMN', icon: '\u{2693}', money: 380, days: 9, research: ['logistics', 1], tradeSlot: 1,
    daily: { money: 4 }, stats: { gdp: 3, factory: 3 }, desc: 'CONTAINRAR UT I VÄRLDEN, +1 HANDELSAVTAL' },
  flygplats: { cat: 'eko', name: 'FLYGPLATS', icon: '\u{2708}\u{FE0F}', money: 520, days: 12, drift: 2, research: ['logistics', 1],
    daily: { money: 6 }, stats: { gdp: 4, income: 3, immigration: 4 }, desc: 'TURISTER, AFFÄRSRESOR OCH NYA INVÅNARE' },
  jarnvag: { cat: 'eko', name: 'JÄRNVÄGSSTATION', icon: '\u{1F689}', money: 260, days: 6, drift: 2,
    stats: { factory: 6, gdp: 3, income: 2 }, desc: 'GODS OCH PENDLARE PÅ RÄLS' },
  hotell: { cat: 'eko', name: 'TURISTHOTELL', icon: '\u{1F3E8}', money: 240, days: 5,
    daily: { money: 5 }, stats: { gdp: 2, qol: 1 }, desc: 'TURISTERNA LÄMNAR PENGAR EFTER SIG' },
  datacenter: { cat: 'eko', name: 'DATACENTER', icon: '\u{1F4BE}', money: 720, days: 12, drift: 2, research: ['computing', 2],
    daily: { rp: 3, money: 5 }, stats: { research: 4, gdp: 2 }, desc: 'SERVRAR SOM ALDRIG SOVER' },
  skola: { cat: 'kun', name: 'SKOLA', icon: '\u{1F3EB}', money: 150, days: 4, drift: 5,
    stats: { hdi: 8, research: 4, integration: 3 }, desc: 'ALLA BARN LÄR SIG LÄSA OCH RÄKNA' },
  institut: { cat: 'kun', name: 'FORSKNINGSINSTITUT', icon: '\u{1F9EA}', money: 480, days: 10, drift: 2, research: ['education', 2],
    daily: { rp: 4 }, stats: { research: 5 }, desc: 'SPETSFORSKNING PÅ HELTID' },
  rymdcenter: { cat: 'kun', name: 'RYMDCENTER', icon: '\u{1F680}', money: 1600, days: 30, driftFix: 4, perCountry: 1, research: ['space', 2],
    daily: { rp: 8 }, stats: { research: 6, ideopower: 4, approval: 3 }, desc: 'RAKETER MOT STJÄRNORNA — ETT PER LAND' },
  sjukhus: { cat: 'val', name: 'SJUKHUS', icon: '\u{1F3E5}', money: 280, days: 7, drift: 7,
    stats: { qol: 8, hdi: 6, manpower: 3, approval: 3 }, desc: 'AKUT, OPERATION OCH FÖRLOSSNING' },
  aldreboende: { cat: 'val', name: 'ÄLDREBOENDE', icon: '\u{1F9D3}', money: 220, days: 5, drift: 4,
    stats: { welfare: 7, approval: 3, qol: 2 }, desc: 'EN TRYGG ÅLDERDOM' },
  bostader: { cat: 'val', name: 'BOSTADSOMRÅDE', icon: '\u{1F3D8}\u{FE0F}', money: 200, days: 5,
    stats: { qol: 6, approval: 3, integration: 2, unrest: -2 }, desc: 'TAK ÖVER HUVUDET ÅT FLER' },
  vattenverk: { cat: 'val', name: 'VATTENVERK', icon: '\u{1F4A7}', money: 230, days: 6, drift: 2,
    stats: { hdi: 5, qol: 3, manpower: 2 }, desc: 'RENT VATTEN UR KRANEN' },
  stadion: { cat: 'sam', name: 'STADION', icon: '\u{1F3DF}\u{FE0F}', money: 420, days: 10, drift: 2,
    stats: { approval: 7, unrest: -4, qol: 2 }, desc: 'BRÖD OCH SKÅDESPEL' },
  teater: { cat: 'sam', name: 'TEATER & MUSEUM', icon: '\u{1F3AD}', money: 240, days: 6, drift: 2,
    daily: { money: 1 }, stats: { qol: 4, ideopower: 3, integration: 2 }, desc: 'KULTUREN BINDER IHOP LANDET' },
  gudshus: { cat: 'sam', name: 'GUDSHUS', icon: '\u{1F6D5}', money: 180, days: 5,
    stats: { stability: 5, unrest: -3, ideopower: 2, freedom: -1 }, desc: 'TRO, TRÖST OCH TRADITION' },
  polis: { cat: 'kon', name: 'POLISSTATION', icon: '\u{1F693}', money: 160, days: 4, drift: 3,
    stats: { safety: 10, stability: 3, corruption: -2, freedom: -2 }, desc: 'POLISER NÄRA FOLK' },
  fangelse: { cat: 'kon', name: 'FÄNGELSE', icon: '\u{26D3}\u{FE0F}', money: 220, days: 6, drift: 3,
    stats: { safety: 6, unrest: -5, freedom: -4, approval: -2 }, desc: 'BAKOM LÅS OCH BOM' },
  tvstation: { cat: 'kon', name: 'TV-STATION', icon: '\u{1F4FA}', money: 300, days: 6, drift: 2,
    stats: { ideopower: 7, approval: 3, statepower: 3, freedom: -2 }, desc: 'BUDSKAPET NÅR VARJE VARDAGSRUM' },
  overvakning: { cat: 'kon', name: 'ÖVERVAKNINGSCENTRAL', icon: '\u{1F4F9}', money: 380, days: 7, drift: 3, research: ['espionage', 1],
    stats: { safety: 6, statepower: 7, unrest: -5, freedom: -7, approval: -3 }, desc: 'KAMEROR I VARJE GATHÖRN' },
  kolkraft: { cat: 'eng', name: 'KOLKRAFTVERK', icon: '\u{1F3ED}', money: 300, days: 7,
    daily: { money: 3 }, stats: { factory: 10, income: 4, qol: -5, hdi: -2 }, desc: 'BILLIG EL — OCH SOT' },
  vindkraft: { cat: 'eng', name: 'VINDKRAFTPARK', icon: '\u{1F32C}\u{FE0F}', money: 360, days: 8, research: ['energy', 1],
    daily: { money: 2 }, stats: { factory: 6, income: 2, qol: 2 }, desc: 'REN EL NÄR DET BLÅSER' },
  karnkraft: { cat: 'eng', name: 'KÄRNKRAFTVERK', icon: '\u{269B}\u{FE0F}', money: 950, days: 18, drift: 3, research: ['energy', 3], needs: ['URAN'],
    daily: { money: 6 }, stats: { factory: 16, income: 6, research: 3 }, desc: 'ENORMT MED EL — KRÄVER URAN' },
  lantbruk: { cat: 'rav', name: 'LANTBRUK', icon: '\u{1F33E}', money: 140, days: 4, resource: 'SPANNMAL',
    daily: { money: 1 }, desc: 'PRODUCERAR SPANNMÅL' },
  sagverk: { cat: 'rav', name: 'SÅGVERK', icon: '\u{1FA9A}', money: 160, days: 4, resource: 'TIMMER',
    daily: { money: 2 }, desc: 'PRODUCERAR TIMMER' },
  fiskehamn: { cat: 'rav', name: 'FISKEHAMN', icon: '\u{1F41F}', money: 150, days: 4, resource: 'FISK',
    daily: { money: 2 }, desc: 'PRODUCERAR FISK' },
  guldgruva: { cat: 'rav', name: 'GULDGRUVA', icon: '\u{1FA99}', money: 420, days: 9, resource: 'GULD', research: ['economy', 2],
    daily: { money: 5 }, desc: 'PRODUCERAR GULD' },
  urangruva: { cat: 'rav', name: 'URANGRUVA', icon: '\u{2622}\u{FE0F}', money: 600, days: 12, resource: 'URAN', research: ['economy', 3],
    desc: 'PRODUCERAR URAN' },
  diamantgruva: { cat: 'rav', name: 'DIAMANTGRUVA', icon: '\u{1F48E}', money: 520, days: 10, resource: 'DIAMANT', research: ['economy', 2],
    daily: { money: 5 }, desc: 'PRODUCERAR DIAMANTER' },
};

export const CITY_SLOTS = 15;   // V5.17: 3 → 15

// V5.17: pengar, forskning och rekryter per byggnad är som förut i landets första
// YIELD_FULL städer — sedan mättas marknaden och varje ny ger lite mindre.
export const YIELD_FULL = 14;
export const yieldWeight = (i) => (i < YIELD_FULL ? 1 : 1 / (1 + (i - YIELD_FULL + 1) / 8));

// Byggnadernas nationsvärden: `cover` = { byggnad: andel av rikets befolkning (0..1)
// som bor i en stad med byggnaden }. Full effekt först när hela riket har den.
export function coverageMods(cover) {
  const out = {};
  for (const [b, share] of Object.entries(cover || {})) {
    const st = BUILDINGS[b]?.stats;
    if (!st || !(share > 0)) continue;
    for (const [k, v] of Object.entries(st)) out[k] = (out[k] || 0) + v * Math.min(1, share);
  }
  for (const k of Object.keys(out)) { out[k] = Math.round(out[k]); if (!out[k]) delete out[k]; }
  return out;
}

// vad byggnaden gör, i klartext (byggmenyn)
export function buildingEffects(B, STATS) {
  const bits = [];
  if (B.daily?.money) bits.push(`+${money(B.daily.money)}/DAG`);
  if (B.daily?.rp) bits.push(`+${B.daily.rp} \u{1F52C}/DAG`);
  if (B.daily?.man) bits.push(`+${people(B.daily.man)} \u{1F9CD}/DAG`);
  for (const [k, v] of Object.entries(B.stats || {})) bits.push(`${v > 0 ? '+' : ''}${v} ${STATS[k]?.name.toUpperCase() || k}`);
  if (B.upkeep) bits.push(`DRIFT ${money(B.upkeep)}/DAG`);
  if (B.drift) bits.push(`DRIFT ${B.drift} % AV INKOMSTEN I HELA RIKET`);
  if (B.driftFix) bits.push(`DRIFT ${B.driftFix} % AV INKOMSTEN`);
  return bits;
}

// vilken byggnad krävs (någonstans i landet) för att bygga enhetstypen där
export const UNIT_NEEDS_BUILDING = { INF: 'kasern', TANK: 'fabrik', FLYG: 'flygbas' };

// handelspriser per råvara: [engångskostnad, daglig kostnad]
export const TRADE_PRICES = {
  URAN: [120, 6], DIAMANT: [120, 6],
  OLJA: [90, 4], GULD: [90, 4],
  JARN: [70, 3], TIMMER: [60, 3], SPANNMAL: [60, 3], FISK: [50, 2],
};
export const TRADE_DEFAULT = [60, 3];
