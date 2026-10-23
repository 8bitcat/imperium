// IMPERIUM V5.6 — VERKLIGHETEN: spelets inre enheter → riktiga tal.
//
// Spelet räknar fortfarande i sina gamla enheter (hela balansen är satt där),
// men allt som VISAS går genom funktionerna här, så att spelaren ser riktiga
// belopp och riktiga antal människor.
//   1 💰  = 100 miljoner dollar   → 5 000 💰 = 500 miljarder $
//   1 🧍  = 1 000 människor        → manskapet 20 = 20 000 i reserven
// Ett förband innehåller lika många soldater som det kostar i manskap:
// infanteri 3 000, pansar 5 000 (besättningar + underhåll), flyg 4 000
// (piloter, mekaniker, markpersonal). Skadade förband har färre kvar.

export const DOLLARS_PER_COIN = 1e8;
export const PEOPLE_PER_MAN = 1000;
export const UNIT_SOLDIERS = { INF: 3000, TANK: 5000, FLYG: 4000 };

const STEPS = [
  [1e15, 'BILJARDER'],
  [1e12, 'BN'],   // biljoner
  [1e9, 'MDR'],   // miljarder
  [1e6, 'MN'],    // miljoner
];

// 1234567 → "1 234 567" (fast mellanslag, inget tusental med punkt)
function group(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u{00A0}');
}

// Ett tal med enhet: under en miljon skrivs det ut helt, därefter
// "12,5 MDR". Pixelfonten saknar U+2212, så minus är vanligt bindestreck.
export function bigNumber(v) {
  if (!Number.isFinite(v)) return '?';
  const neg = v < 0;
  const a = Math.abs(v);
  let out = null;
  for (const [lim, name] of STEPS) {
    if (a >= lim) {
      const x = a / lim;
      const txt = x >= 100 ? group(x) : x.toFixed(x >= 10 ? 1 : 2).replace(/\.?0+$/, '').replace('.', ',');
      out = `${txt}\u{00A0}${name}`;
      break;
    }
  }
  if (!out) out = group(a);
  return (neg ? '-' : '') + out;
}

// Riktiga dollar (t.ex. BNP per capita 54 300 $, BNP 1,2 BN $)
export function dollars(v) { return `${bigNumber(v)}\u{00A0}$`; }

// Spelets pengar (💰) i riktiga dollar
export function money(coins, { sign = false } = {}) {
  const d = (Number(coins) || 0) * DOLLARS_PER_COIN;
  return (sign && d > 0 ? '+' : '') + dollars(d);
}

// Manskap (🧍) i antal människor
export function people(man, { sign = false } = {}) {
  const p = Math.round((Number(man) || 0) * PEOPLE_PER_MAN);
  return (sign && p > 0 ? '+' : '') + bigNumber(p);
}

// hur många soldater finns kvar i ett förband (hp 10 = fullt förband;
// sammanslagna förband har hp över 10 och räknas som flera)
export function soldiersInUnit(u) {
  return Math.round((UNIT_SOLDIERS[u.type] || 3000) * Math.max(0, u.hp ?? 10) / 10);
}

export function soldiersOf(units) {
  let n = 0;
  for (const u of units || []) n += soldiersInUnit(u);
  return n;
}

// "36 000 SOLDATER"
export function soldiersText(units) { return `${bigNumber(soldiersOf(units))} SOLDATER`; }
