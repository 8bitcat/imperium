// Kontroll av v4/js/identity-data.js mot country-data.js (RELIGION_SHARES).
// Kör: node tools/check-identity.mjs   — slutkod 1 vid strukturfel.
import { IDENTITY, IDENTITY_YEAR, IDENTITY_PRIDE_WAVE } from '../v4/js/identity-data.js';
import { RELIGION_SHARES } from '../v4/js/country-data.js';

const FIELDS = ['anthem', 'anthemYear', 'anthemLyrics', 'motto', 'natday', 'flagYear', 'animal', 'holidays', 'embassies', 'visaFree', 'pride'];
const TYPES = { anthem: 'string', anthemYear: 'int', anthemLyrics: 'boolean', motto: 'string', natday: 'natday', flagYear: 'int', animal: 'string', holidays: 'int', embassies: 'int', visaFree: 'int', pride: 'int' };
const RANGES = { anthemYear: [1500, IDENTITY_YEAR], flagYear: [1200, 2025], holidays: [0, 40], visaFree: [0, 200], pride: [0, 100], embassies: [0, 300] };

const errors = [];
const warnings = [];
const keys = Object.keys(IDENTITY);
const want = Object.keys(RELIGION_SHARES);

if (!Number.isInteger(IDENTITY_YEAR)) errors.push('IDENTITY_YEAR saknas eller är inte ett heltal');
for (const k of keys) if (!/^\d{3}$/.test(k)) errors.push(`${k}: nyckeln är inte tre siffror`);
const missing = want.filter(k => !(k in IDENTITY));
const extra = keys.filter(k => !(k in RELIGION_SHARES));
for (const k of missing) errors.push(`${k}: finns i RELIGION_SHARES men saknas i IDENTITY`);
for (const k of extra) warnings.push(`${k}: finns i IDENTITY men inte i RELIGION_SHARES`);

const nonNull = Object.fromEntries(FIELDS.map(f => [f, 0]));
for (const [k, row] of Object.entries(IDENTITY)) {
  if (!Array.isArray(row) || row.length !== FIELDS.length) { errors.push(`${k}: raden ska ha ${FIELDS.length} fält`); continue; }
  FIELDS.forEach((f, i) => {
    const v = row[i];
    if (v === null) return;
    nonNull[f]++;
    const t = TYPES[f];
    if (t === 'int' && !Number.isInteger(v)) errors.push(`${k}.${f}: ${JSON.stringify(v)} är inte ett heltal`);
    else if (t === 'string' && (typeof v !== 'string' || !v.trim())) errors.push(`${k}.${f}: ${JSON.stringify(v)} är inte en sträng`);
    else if (t === 'boolean' && typeof v !== 'boolean') errors.push(`${k}.${f}: ${JSON.stringify(v)} är inte true/false`);
    else if (t === 'natday') {
      if (!Array.isArray(v) || v.length !== 2 || !v.every(Number.isInteger)) errors.push(`${k}.natday: ${JSON.stringify(v)} ska vara [månad, dag]`);
      else if (v[0] < 1 || v[0] > 12 || v[1] < 1 || v[1] > 31) warnings.push(`${k}.natday utanför intervall: ${JSON.stringify(v)}`);
    }
    const r = RANGES[f];
    if (r && Number.isInteger(v) && (v < r[0] || v > r[1])) warnings.push(`${k}.${f} utanför ${r[0]}–${r[1]}: ${v}`);
  });
}
for (const k of Object.keys(IDENTITY_PRIDE_WAVE || {})) {
  if (!(k in IDENTITY)) errors.push(`IDENTITY_PRIDE_WAVE.${k}: okänt land`);
  else if (IDENTITY[k][10] === null) warnings.push(`IDENTITY_PRIDE_WAVE.${k}: våg angiven men pride är null`);
}

const n = keys.length;
console.log(`IDENTITY ${IDENTITY_YEAR}: ${n} länder, RELIGION_SHARES ${want.length}, saknas ${missing.length}, extra ${extra.length}`);
console.log('Fält            ifyllda  saknas');
for (const f of FIELDS) console.log(`${f.padEnd(15)} ${String(nonNull[f]).padStart(7)} ${String(n - nonNull[f]).padStart(7)}`);
if (warnings.length) { console.log(`\nVarningar (${warnings.length}):`); for (const w of warnings) console.log('  ' + w); }
if (errors.length) { console.log(`\nFEL (${errors.length}):`); for (const e of errors) console.log('  ' + e); process.exit(1); }
console.log('\nInga strukturfel.');
