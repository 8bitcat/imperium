// indicators.json: numeriskt ISO-id -> { nyckel: värde } — verkliga utgångsvärden
// för V5.6:s statistik (BNP per capita, HDI, medellivslängd, arbetslöshet …).
// Källor: World Bank WDI (senaste icke-tomma värdet per land), World Bank
// Worldwide Governance Indicators, FN:s Human Development Report (HDI).
// Körs bara när källdata ska uppdateras:  node tools/build-indicators.mjs
import { readFileSync, writeFileSync } from 'fs';

const ROOT = 'D:/GamesProjects/imperium';
const facts = JSON.parse(readFileSync(`${ROOT}/v4/data/facts.json`, 'utf8'));
const idByA2 = new Map(Object.entries(facts).filter(([, f]) => f.a2).map(([id, f]) => [f.a2, id]));

// [nyckel, World Bank-kod, källa]  (källa 2 = WDI, 3 = WGI)
const WB = [
  ['gdppc', 'NY.GDP.PCAP.CD'], ['gdp', 'NY.GDP.MKTP.CD'], ['gdpgrowth', 'NY.GDP.MKTP.KD.ZG'],
  ['life', 'SP.DYN.LE00.IN'], ['unemp', 'SL.UEM.TOTL.ZS'], ['youthunemp', 'SL.UEM.1524.ZS'],
  ['infl', 'FP.CPI.TOTL.ZG'], ['gini', 'SI.POV.GINI'], ['poverty', 'SI.POV.DDAY'],
  ['co2', 'EN.GHG.CO2.PC.CE.AR5'], ['internet', 'IT.NET.USER.ZS'], ['mobile', 'IT.CEL.SETS.P2'],
  ['urban', 'SP.URB.TOTL.IN.ZS'], ['birth', 'SP.DYN.CBRT.IN'], ['death', 'SP.DYN.CDRT.IN'],
  ['fert', 'SP.DYN.TFRT.IN'], ['infmort', 'SP.DYN.IMRT.IN'], ['u5mort', 'SH.DYN.MORT'],
  ['milx', 'MS.MIL.XPND.GD.ZS'], ['troops', 'MS.MIL.TOTL.P1'], ['tax', 'GC.TAX.TOTL.GD.ZS'],
  ['debt', 'GC.DOD.TOTL.GD.ZS'], ['exports', 'NE.EXP.GNFS.ZS'], ['imports', 'NE.IMP.GNFS.ZS'],
  ['homicide', 'VC.IHR.PSRC.P5'], ['healthx', 'SH.XPD.CHEX.GD.ZS'], ['edux', 'SE.XPD.TOTL.GD.ZS'],
  ['elec', 'EG.ELC.ACCS.ZS'], ['renew', 'EG.FEC.RNEW.ZS'], ['forest', 'AG.LND.FRST.ZS'],
  ['tourists', 'ST.INT.ARVL'], ['netmig', 'SM.POP.NETM'], ['popgrowth', 'SP.POP.GROW'],
  ['old', 'SP.POP.65UP.TO.ZS'], ['kids', 'SP.POP.0014.TO.ZS'], ['literacy', 'SE.ADT.LITR.ZS'],
  ['tertiary', 'SE.TER.ENRR'], ['doctors', 'SH.MED.PHYS.ZS'], ['beds', 'SH.MED.BEDS.ZS'],
  ['rnd', 'GB.XPD.RSDV.GD.ZS'], ['patents', 'IP.PAT.RESD'], ['area', 'AG.SRF.TOTL.K2'],
  ['density', 'EN.POP.DNST'], ['femlabor', 'SL.TLF.CACT.FE.ZS'], ['womenparl', 'SG.GEN.PARL.ZS'],
  ['airpax', 'IS.AIR.PSGR'], ['water', 'SH.H2O.SMDW.ZS'], ['fdi', 'BX.KLT.DINV.WD.GD.ZS'],
  ['lendrate', 'FR.INR.LEND'], ['hitech', 'TX.VAL.TECH.MF.ZS'], ['pm25', 'EN.ATM.PM25.MC.M3'],
  ['protected', 'ER.PTD.TOTL.ZS'], ['agri', 'NV.AGR.TOTL.ZS'], ['manuf', 'NV.IND.MANF.ZS'],
  ['services', 'NV.SRV.TOTL.ZS'], ['smoking', 'SH.PRV.SMOK'], ['alcohol', 'SH.ALC.PCAP.LI'],
  ['corruptgov', 'GOV_WGI_CC.EST', 3], ['goveff', 'GOV_WGI_GE.EST', 3], ['rulelaw', 'GOV_WGI_RL.EST', 3],
  ['voice', 'GOV_WGI_VA.EST', 3], ['polstab', 'GOV_WGI_PV.EST', 3], ['regq', 'GOV_WGI_RQ.EST', 3],
];

const out = {};
const iso3ToId = new Map();
let done = 0;
async function fetchWB([key, code, source]) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&per_page=400&mrnev=1${source ? `&source=${source}` : ''}`;
  // Världsbanken svarar ibland 400/429/5xx när det går för fort — försök igen
  let j = null;
  for (let tries = 0; tries < 5 && !j; tries++) {
    if (tries) await new Promise((res) => setTimeout(res, 1500 * tries));
    try {
      const r = await fetch(url);
      if (r.ok) { const body = await r.json(); if (Array.isArray(body) && body[1]) j = body; }
    } catch { /* nästa försök */ }
  }
  if (!j) { done++; console.log(`✗ ${key} (${code}) gick inte att hämta — hoppas över`); return; }
  let n = 0;
  for (const row of j[1] || []) {
    const id = idByA2.get(row?.country?.id);
    if (!id || row.value == null) continue;
    if (row.countryiso3code) iso3ToId.set(row.countryiso3code, id);
    (out[id] ||= {})[key] = round(row.value);
    n++;
  }
  done++;
  console.log(`${String(done).padStart(2)}/${WB.length} ${key.padEnd(11)} ${code.padEnd(22)} ${n} länder`);
}

// rimlig precision: stora tal heltal, små med två-tre värdesiffror
function round(v) {
  const a = Math.abs(v);
  if (a >= 1000) return Math.round(v);
  if (a >= 10) return Math.round(v * 10) / 10;
  return Math.round(v * 1000) / 1000;
}

// några åt gången, så Världsbanken inte stänger dörren
for (let i = 0; i < WB.length; i += 3) await Promise.all(WB.slice(i, i + 3).map(fetchWB));

// FN:s HDI (senaste året i filen), medelutbildning och könsskillnader
const csv = await (await fetch('https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Composite_indices_complete_time_series.csv')).text();
const lines = csv.split(/\r?\n/);
const head = lines[0].split(',');
const lastCol = (prefix) => {
  const cols = head.map((h, i) => [h, i]).filter(([h]) => new RegExp(`^${prefix}_\\d{4}$`).test(h));
  return cols.sort((a, b) => a[0].localeCompare(b[0]));
};
const HDR = [['hdi', 'hdi'], ['schoolyears', 'mys'], ['gii', 'gii']];
const iso3Col = head.indexOf('iso3');
let hdrN = 0;
for (const line of lines.slice(1)) {
  const cells = line.split(',');
  const id = iso3ToId.get(cells[iso3Col]);
  if (!id) continue;
  for (const [key, prefix] of HDR) {
    // senaste året som har ett värde
    for (const [, i] of lastCol(prefix).reverse()) {
      const v = parseFloat(cells[i]);
      if (Number.isFinite(v)) { (out[id] ||= {})[key] = round(v); break; }
    }
  }
  hdrN++;
}
console.log(`HDR: ${hdrN} länder`);

writeFileSync(`${ROOT}/v4/data/indicators.json`, JSON.stringify(out));
const n = Object.keys(out).length;
console.log(`indicators.json: ${n} länder, ${JSON.stringify(out).length} byte`);
console.log('SVERIGE:', JSON.stringify(out['752']));
