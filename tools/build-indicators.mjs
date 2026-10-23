// indicators.json: numeriskt ISO-id -> { nyckel: värde } — verkliga utgångsvärden
// för V5.6:s statistik (BNP per capita, HDI, medellivslängd, arbetslöshet …).
// V5.8: 91 nya mått (köpkraft, arbete, energi, jordbruk, vaccin, hotade arter …).
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
  // V5.7
  ['lifefem', 'SP.DYN.LE00.FE.IN'], ['lifemale', 'SP.DYN.LE00.MA.IN'], ['overweight', 'SH.STA.OWAD.ZS'],
  ['undernourish', 'SN.ITK.DEFC.ZS'], ['sanitation', 'SH.STA.SMSS.ZS'], ['researchers', 'SP.POP.SCIE.RD.P6'],
  ['articles', 'IP.JRN.ARTC.SC'], ['primary', 'SE.PRM.CMPT.ZS'], ['broadband', 'IT.NET.BBND.P2'],
  ['govspend', 'GC.XPN.TOTL.GD.ZS'], ['curacc', 'BN.CAB.XOKA.GD.ZS'], ['stockcap', 'CM.MKT.LCAP.GD.ZS'],
  ['bankacc', 'FX.OWN.TOTL.ZS'], ['energyuse', 'EG.USE.PCAP.KG.OE'], ['armsexp', 'MS.MIL.XPRT.KD'],
  ['milpers', 'MS.MIL.TOTL.TF.ZS'], ['refugees', 'SM.POP.REFG'], ['refugeesout', 'SM.POP.REFG.OR'],
  ['labor', 'SL.TLF.TOTL.IN'], ['traffic', 'SH.STA.TRAF.P5'],
  ['corruptgov', 'GOV_WGI_CC.EST', 3], ['goveff', 'GOV_WGI_GE.EST', 3], ['rulelaw', 'GOV_WGI_RL.EST', 3],
  ['voice', 'GOV_WGI_VA.EST', 3], ['polstab', 'GOV_WGI_PV.EST', 3], ['regq', 'GOV_WGI_RQ.EST', 3],
  // V5.8: ekonomi
  ['gdppcppp', 'NY.GDP.PCAP.PP.CD'], ['savings', 'NY.GNS.ICTR.ZS'], ['consumption', 'NE.CON.PRVT.ZS'],
  ['invest', 'NE.GDI.TOTL.ZS'], ['industry', 'NV.IND.TOTL.ZS'], ['interestpay', 'GC.XPN.INTP.RV.ZS'],
  ['realrate', 'FR.INR.RINR'], ['reserves', 'FI.RES.TOTL.MO'], ['newbiz', 'IC.BUS.NDNS.ZS'],
  ['ictserv', 'BX.GSR.CCIS.ZS'], ['remit', 'BX.TRF.PWKR.DT.GD.ZS'], ['aid', 'DT.ODA.ODAT.PC.ZS'],
  ['natres', 'NY.GDP.TOTL.RT.ZS'], ['oilrent', 'NY.GDP.PETR.RT.ZS'], ['minrent', 'NY.GDP.MINR.RT.ZS'],
  ['listed', 'CM.MKT.LDOM.NO'], ['tariff', 'TM.TAX.MRCH.WM.AR.ZS'], ['productivity', 'SL.GDP.PCAP.EM.KD'],
  // turistintäkterna före pandemin (2020 års siffror är halverade); Kina,
  // Storbritannien och Spanien finns bara i resetjänsterna (ST.INT.TVLR.CD)
  ['tourrcpt', 'ST.INT.RCPT.CD', 2, '2010:2019', 'ST.INT.TVLR.CD'],
  // V5.8: arbete
  ['lfpr', 'SL.TLF.CACT.ZS'], ['lfprmale', 'SL.TLF.CACT.MA.ZS'], ['emprate', 'SL.EMP.TOTL.SP.ZS'],
  ['empagri', 'SL.AGR.EMPL.ZS'], ['empind', 'SL.IND.EMPL.ZS'], ['empserv', 'SL.SRV.EMPL.ZS'],
  ['vulnemp', 'SL.EMP.VULN.ZS'], ['selfemp', 'SL.EMP.SELF.ZS'], ['neet', 'SL.UEM.NEET.ZS'],
  // V5.8: infrastruktur och energi
  ['cleancook', 'EG.CFT.ACCS.ZS'], ['renewelec', 'EG.ELC.RNEW.ZS'], ['nuclear', 'EG.ELC.NUCL.ZS'],
  ['coal', 'EG.ELC.COAL.ZS'], ['hydro', 'EG.ELC.HYRO.ZS'], ['eleccons', 'EG.USE.ELEC.KH.PC'],
  ['energyimp', 'EG.IMP.CONS.ZS'], ['rail', 'IS.RRS.TOTL.KM'], ['airfreight', 'IS.AIR.GOOD.MT.K1'],
  ['ports', 'IS.SHP.GOOD.TU'], ['lpi', 'LP.LPI.OVRL.XQ'], ['phones', 'IT.MLT.MAIN.P2'],
  // V5.8: jordbruk och mat
  ['cerealyield', 'AG.YLD.CREL.KG'], ['cerealprod', 'AG.PRD.CREL.MT'], ['agland', 'AG.LND.AGRI.ZS'],
  ['arable', 'AG.LND.ARBL.HA.PC'], ['fertilizer', 'AG.CON.FERT.ZS'], ['irrigated', 'AG.LND.IRIG.AG.ZS'],
  ['fishcatch', 'ER.FSH.CAPT.MT'], ['aquaculture', 'ER.FSH.AQUA.MT'], ['stunting', 'SH.STA.STNT.ZS'],
  // V5.8: hälsa
  ['nurses', 'SH.MED.NUMW.P3'], ['measles', 'SH.IMM.MEAS'], ['dpt', 'SH.IMM.IDPT'], ['tb', 'SH.TBS.INCD'],
  ['hiv', 'SH.DYN.AIDS.ZS'], ['malaria', 'SH.MLR.INCD.P3'], ['matmort', 'SH.STA.MMRT'],
  ['oop', 'SH.XPD.OOPC.CH.ZS'], ['diabetes', 'SH.STA.DIAB.ZS'], ['ncd', 'SH.DYN.NCOM.ZS'],
  ['skilledbirth', 'SH.STA.BRTC.ZS'], ['anemia', 'SH.ANM.CHLD.ZS'], ['waterdeath', 'SH.STA.WASH.P5'],
  ['airdeath', 'SH.STA.AIRP.P5'], ['slums', 'EN.POP.SLUM.UR.ZS'],
  // V5.8: befolkning, kunskap, samhälle
  ['female', 'SP.POP.TOTL.FE.ZS'], ['urbgrowth', 'SP.URB.GROW'], ['dependency', 'SP.POP.DPND'],
  ['migrants', 'SM.POP.TOTL.ZS'], ['birthreg', 'SP.REG.BRTH.ZS'], ['pupilteacher', 'SE.PRM.ENRL.TC.ZS'],
  ['secondary', 'SE.SEC.ENRR'], ['preschool', 'SE.PRE.ENRR'], ['youthlit', 'SE.ADT.1524.LT.ZS'],
  ['outofschool', 'SE.PRM.UNER'], ['bachelor', 'SE.TER.CUAT.BA.ZS'], ['servers', 'IT.NET.SECR.P6'],
  ['ictgoods', 'TX.VAL.ICTG.ZS.UN'], ['hci', 'HD.HCI.OVRL'], ['top10', 'SI.DST.10TH.10'],
  ['bottom20', 'SI.DST.FRST.20'], ['womenmin', 'SG.GEN.MNST.ZS'],
  // V5.8: miljö och försvar
  ['co2total', 'EN.GHG.CO2.MT.CE.AR5'], ['methane', 'EN.GHG.CH4.MT.CE.AR5'], ['waterstress', 'ER.H2O.FWST.ZS'],
  ['freshwater', 'ER.H2O.INTR.PC'], ['marine', 'ER.MRN.PTMR.ZS'], ['thrmammals', 'EN.MAM.THRD.NO'],
  ['thrbirds', 'EN.BIR.THRD.NO'], ['thrfish', 'EN.FSH.THRD.NO'], ['thrplants', 'EN.HPT.THRD.NO'],
  ['armsimp', 'MS.MIL.MPRT.KD'],
];

// Bara vissa nycklar:  node tools/build-indicators.mjs gdppcppp savings …
// (hämtar bara dem och lägger in dem i den befintliga filen — allt annat
// lämnas orört). Utan argument hämtas allt, och en nyckel som inte går att
// hämta behåller sina gamla värden i stället för att försvinna.
const ONLY = new Set(process.argv.slice(2));
const OLD = (() => { try { return JSON.parse(readFileSync(`${ROOT}/v4/data/indicators.json`, 'utf8')); } catch { return {}; } })();
const JOBS = ONLY.size ? WB.filter(([key]) => ONLY.has(key)) : WB;
const failed = [];

const out = {};
const iso3ToId = new Map();
let done = 0;
// en serie från Världsbanken → rader (null om det inte gick)
async function fetchRows(code, source, years) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json`
    + (years ? `&per_page=20000&date=${years}` : '&per_page=400&mrnev=1') + (source ? `&source=${source}` : '');
  // Världsbanken svarar ibland 400/429/5xx när det går för fort — försök igen
  for (let tries = 0; tries < 5; tries++) {
    if (tries) await new Promise((res) => setTimeout(res, 1500 * tries));
    try {
      const r = await fetch(url);
      if (r.ok) { const body = await r.json(); if (Array.isArray(body) && body[1]) return body[1]; }
    } catch { /* nästa försök */ }
  }
  return null;
}

// [nyckel, kod, källa?, år?, reservkod?]  år = 'ÅÅÅÅ:ÅÅÅÅ' → senaste värdet
// inom de åren. Reservkoden fyller i länder som huvudkoden saknar.
async function fetchWB([key, code, source, years, alt]) {
  const rows = await fetchRows(code, source, years);
  if (!rows) { done++; failed.push(key); console.log(`✗ ${key} (${code}) gick inte att hämta — behåller gamla värden`); return; }
  let n = 0, nAlt = 0;
  const year = {};
  const take = (list, isAlt) => {
    const got = new Set();
    for (const row of list || []) {
      const id = idByA2.get(row?.country?.id);
      if (!id || row.value == null) continue;
      if (isAlt && year[id] && !got.has(id)) continue;   // huvudkoden har redan landet
      if (row.countryiso3code) iso3ToId.set(row.countryiso3code, id);
      if (year[id] && year[id] >= +row.date) continue;   // ett senare år finns redan
      if (!year[id]) { if (isAlt) nAlt++; else n++; }
      got.add(id);
      year[id] = +row.date;
      (out[id] ||= {})[key] = round(row.value);
    }
  };
  take(rows, false);
  if (alt) take(await fetchRows(alt, source, years), true);
  done++;
  console.log(`${String(done).padStart(2)}/${JOBS.length} ${key.padEnd(11)} ${code.padEnd(22)} ${n} länder${nAlt ? ` + ${nAlt} ur ${alt}` : ''}`);
}

// rimlig precision: stora tal heltal, små med två-tre värdesiffror
function round(v) {
  const a = Math.abs(v);
  if (a >= 1000) return Math.round(v);
  if (a >= 10) return Math.round(v * 10) / 10;
  return Math.round(v * 1000) / 1000;
}

// några åt gången, så Världsbanken inte stänger dörren
for (let i = 0; i < JOBS.length; i += 3) await Promise.all(JOBS.slice(i, i + 3).map(fetchWB));

// Bara vissa nycklar: lägg in dem i den befintliga filen och sluta där
if (ONLY.size) {
  const merged = OLD;
  for (const [id, vals] of Object.entries(out)) Object.assign(merged[id] ||= {}, vals);
  writeFileSync(`${ROOT}/v4/data/indicators.json`, JSON.stringify(merged));
  console.log(`indicators.json: ${Object.keys(merged).length} länder, ${JSON.stringify(merged).length} byte (${JOBS.length} nycklar uppdaterade${failed.length ? `, misslyckade: ${failed.join(' ')}` : ''})`);
  process.exit(0);
}
// det som inte gick att hämta behåller sina gamla värden
for (const key of failed) {
  for (const [id, vals] of Object.entries(OLD)) if (vals[key] != null) (out[id] ||= {})[key] = vals[key];
}

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
