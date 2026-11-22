// IMPERIUM v4 — stadsbyggnader: produktion, poäng, råvaror och handel. Allt är data.
// unlocksUnit = gör enhetstypen byggbar i landet där byggnaden står.
// daily = daglig avkastning. resource = landet producerar råvaran. tradeSlot = +1 handelsavtal.
//
// V5.17 BYGGBOOM (Henrys önskemål): 30 nya byggnader, 15 platser per stad och bygge i
// många städer på en gång. V5.23 TILLVÄXTEN: 20 till (60 st) och 30 platser per stad. Nya fält:
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

  // ---------- V5.23 TILLVÄXTEN: 20 nya ----------
  industripark: { cat: 'eko', name: 'INDUSTRIPARK', icon: '\u{1F3D7}\u{FE0F}', money: 340, days: 8, drift: 1,
    daily: { money: 4 }, stats: { factory: 9, gdp: 5, income: 3 }, desc: 'FABRIKER, LAGER OCH TUSENTALS JOBB' },
  kopcentrum: { cat: 'eko', name: 'KÖPCENTRUM', icon: '\u{1F6CD}\u{FE0F}', money: 260, days: 6,
    daily: { money: 5 }, stats: { gdp: 3, income: 3, qol: 2 }, desc: 'HANDEL, CAFÉER OCH BIOGRAF UNDER ETT TAK' },
  logistik: { cat: 'eko', name: 'LOGISTIKCENTER', icon: '\u{1F4E6}', money: 380, days: 8, research: ['logistics', 2],
    daily: { money: 4 }, stats: { factory: 6, gdp: 4, readiness: 3 }, desc: 'VARORNA FRAM I TID — I FRED OCH KRIG' },
  teknikpark: { cat: 'eko', name: 'TEKNIKPARK', icon: '\u{1F4A1}', money: 640, days: 12, drift: 1, research: ['computing', 3],
    daily: { rp: 3, money: 6 }, stats: { research: 6, gdp: 6, income: 3 }, desc: 'NYSTARTADE BOLAG BREDVID UNIVERSITETET' },
  frizon: { cat: 'eko', name: 'FRIHANDELSZON', icon: '\u{1F6A2}', money: 900, days: 16, perCountry: 1, research: ['economy', 3], tradeSlot: 1,
    daily: { money: 18 }, stats: { gdp: 6, income: 5, factory: 4, corruption: 1 }, desc: 'TULLFRITT FÖR UTLÄNDSKA FÖRETAG — EN PER LAND' },
  varv: { cat: 'eko', name: 'SKEPPSVARV', icon: '\u{1F6E5}\u{FE0F}', money: 480, days: 10, drift: 1, research: ['navy', 1],
    daily: { money: 5 }, stats: { factory: 7, milpower: 4, gdp: 2 }, desc: 'FRAKTFARTYG I FRED, ÖRLOGSFARTYG I KRIG' },
  bibliotek: { cat: 'kun', name: 'BIBLIOTEK', icon: '\u{1F4DA}', money: 120, days: 3, drift: 1,
    stats: { hdi: 3, research: 2, integration: 3, qol: 1 }, desc: 'GRATIS BÖCKER, SPRÅKKURSER OCH INTERNET' },
  yrkesskola: { cat: 'kun', name: 'YRKESHÖGSKOLA', icon: '\u{1F527}', money: 210, days: 5, drift: 2,
    stats: { factory: 5, gdp: 3, hdi: 3, integration: 2 }, desc: 'SVETSARE, SJUKSKÖTERSKOR OCH PROGRAMMERARE' },
  observatorium: { cat: 'kun', name: 'OBSERVATORIUM', icon: '\u{1F52D}', money: 360, days: 8, research: ['space', 1],
    daily: { rp: 2 }, stats: { research: 3, ideopower: 2 }, desc: 'TELESKOP MOT UNIVERSUMS KANT' },
  vardcentral: { cat: 'val', name: 'VÅRDCENTRAL', icon: '\u{1FA7A}', money: 160, days: 4, drift: 3,
    stats: { qol: 4, hdi: 4, manpower: 2, approval: 2 }, desc: 'DOKTORN NÄRA HEMMET' },
  forskola: { cat: 'val', name: 'FÖRSKOLA', icon: '\u{1F9F8}', money: 140, days: 4, drift: 2,
    stats: { welfare: 4, approval: 3, hdi: 2, gdp: 2 }, desc: 'BÅDA FÖRÄLDRARNA KAN JOBBA' },
  stadspark: { cat: 'val', name: 'STADSPARK', icon: '\u{1F333}', money: 110, days: 3,
    stats: { qol: 4, approval: 2, unrest: -1 }, desc: 'GRÖNSKA, LEKPLATS OCH DAMM MED ÄNDER' },
  konserthus: { cat: 'sam', name: 'KONSERTHUS', icon: '\u{1F3BB}', money: 320, days: 7, drift: 1,
    daily: { money: 1 }, stats: { qol: 3, ideopower: 3, approval: 2 }, desc: 'SYMFONIER OCH POPKONSERTER' },
  nojespark: { cat: 'sam', name: 'NÖJESPARK', icon: '\u{1F3A2}', money: 450, days: 10,
    daily: { money: 6 }, stats: { approval: 4, qol: 3, unrest: -2 }, desc: 'BERG-OCH-DALBANA — TURISTERNA KOMMER' },
  brandstation: { cat: 'kon', name: 'BRANDSTATION', icon: '\u{1F692}', money: 150, days: 4, drift: 1,
    stats: { safety: 6, qol: 2, stability: 1 }, desc: 'RÄDDAR LIV NÄR DET BRINNER' },
  tingsratt: { cat: 'kon', name: 'TINGSRÄTT', icon: '\u{2696}\u{FE0F}', money: 260, days: 6, drift: 2,
    stats: { safety: 4, corruption: -4, stability: 3, freedom: 1 }, desc: 'RÄTTVISA PROCESSER — LAGEN GÄLLER ALLA' },
  solpark: { cat: 'eng', name: 'SOLCELLSPARK', icon: '\u{2600}\u{FE0F}', money: 320, days: 7, research: ['energy', 2],
    daily: { money: 2 }, stats: { factory: 6, income: 3, qol: 2 }, desc: 'REN EL NÄR SOLEN SKINER' },
  vattenkraft: { cat: 'eng', name: 'VATTENKRAFTVERK', icon: '\u{1F30A}', money: 700, days: 14, drift: 1, research: ['energy', 1],
    daily: { money: 5 }, stats: { factory: 12, income: 5, stability: 1 }, desc: 'DAMMEN GER EL DYGNET RUNT I HUNDRA ÅR' },
  oljeplattform: { cat: 'rav', name: 'OLJEPLATTFORM', icon: '\u{26FD}', money: 680, days: 14, resource: 'OLJA', research: ['economy', 3],
    daily: { money: 10 }, stats: { gdp: 3, qol: -1 }, desc: 'OLJA UR HAVSBOTTEN' },
  marinbas: { cat: 'mil', name: 'MARINBAS', icon: '\u{1F531}', money: 520, days: 10, drift: 2, research: ['navy', 2],
    stats: { milpower: 7, readiness: 5, safety: 2 }, desc: 'FLOTTAN VAKTAR KUSTEN' },
};

export const CITY_SLOTS = 30;   // V5.17: 3 → 15, V5.23: 15 → 30

// V5.23 TILLVÄXTEN: ingen mättnad längre — varje byggnad ger fullt i varje stad.
// (V5.17: efter 14 städer per sort gav varje ny mindre och mindre.)
export const YIELD_FULL = Infinity;
export const yieldWeight = () => 1;

// V5.23: driften är en andel av rikets inkomst, men aldrig mer än så här — fler byggnader
// får aldrig göra riket fattigare än det var utan dem
export const DRIFT_MAX = 40;

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
