// IMPERIUM V5.13 — BANKEN (Henrys önskemål): har staten en skuld ska den betalas
// av varje månad tills den är borta, oavsett om den är 1 % eller 1 000 % av BNP.
// Hur mycket som betalas beror på hur stor skulden är och vad banken tillåter:
// banken sätter ett kreditbetyg, och betyget avgör räntan, hur lång
// avbetalningsplan man får välja och hur mycket mer man får låna.
//
// Ren logik — main.js håller tillståndet (state.solo.bank) och räknar
// pengarna. Ett spelår är 120 dagar, en månad 30 dagar → fyra betalningar per år.
export const BANK_MONTH = 30;
export const MONTHS_PER_YEAR = 4;

// Kreditbetygen. `max` = högsta "vägda skuld" (skuld i % av BNP delat med
// välståndsfaktorn) för betyget, `rate` = ränta i % per spelår, `term` = längsta
// avbetalningsplan i spelår, `limit` = vägd skuld som banken lånar ut upp till.
export const RATINGS = [
  { id: 'AAA', max: 20, rate: 1, term: 80, limit: 150, color: '#4ae37a' },
  { id: 'AA', max: 40, rate: 1.5, term: 60, limit: 120, color: '#4ae37a' },
  { id: 'A', max: 70, rate: 2, term: 50, limit: 100, color: '#9fe34a' },
  { id: 'BBB', max: 100, rate: 3, term: 40, limit: 80, color: '#e3d24a' },
  { id: 'BB', max: 140, rate: 4, term: 30, limit: 60, color: '#ffb02e' },
  { id: 'B', max: 200, rate: 6, term: 20, limit: 40, color: '#ff8a3d' },
  { id: 'CCC', max: 300, rate: 9, term: 15, limit: 20, color: '#ff6b5e' },
  { id: 'CC', max: 500, rate: 13, term: 10, limit: 0, color: '#ff4f4f' },
  { id: 'D', max: Infinity, rate: 12, term: 20, limit: 0, color: '#c21f1f' },   // efter en bankrutt: omstrukturerad skuld
];
export const PLAN_YEARS = [5, 10, 20, 30, 50, 80];
export const DEFAULT_PLAN = 30;
export const MISS_LIMIT = 3;            // så många missade månader i rad → statsbankrutt
export const DEFAULT_DAYS = 360;        // betyget D så länge efter en bankrutt
export const CRISIS_DAYS = 120;         // bankruttens kris i samhället
export const LOAN_SHARE = 0.05;         // ett lån = 5 % av BNP

// Rika länder bär större skulder (Japan, Italien) — skulden vägs efter välståndet
export const tierFactor = (tier) => 0.8 + 0.4 * (tier || 1);

// Betyget: vägd skuld ger grundbetyget, sedan steg upp eller ned för hur landet sköts.
// f = { pct, tier, stability, unrest, corruption, missed, defaulted, atWar, brake }
// brake = skuldbromsens steg (+ bättre, - sämre) från lagen Debt brake.
export function ratingOf(f) {
  if (f.defaulted) return { idx: RATINGS.length - 1, base: RATINGS.length - 1, notes: [['STATSBANKRUTT', -9]] };
  const eff = (f.pct || 0) / tierFactor(f.tier);
  let base = RATINGS.findIndex((r) => eff <= r.max);
  if (base < 0) base = RATINGS.length - 1;
  const notes = [];
  if ((f.stability ?? 0) >= 20 && (f.unrest ?? 0) <= 5) notes.push(['STABILT LAND', 1]);
  if ((f.unrest ?? 0) >= 30) notes.push(['ORO I LANDET', -1]);
  if ((f.corruption ?? 0) >= 25) notes.push(['KORRUPTION', -1]);
  if (f.atWar) notes.push(['I KRIG', -1]);
  if (f.brake) notes.push([f.brake > 0 ? 'SKULDBROMS' : 'LÅNAR UTAN GRÄNS', f.brake]);
  if (f.missed) notes.push([`MISSADE BETALNINGAR (${f.missed})`, -2 * f.missed]);
  let idx = base;
  for (const [, d] of notes) idx -= d;
  // en skuld över 1 000 % av BNP räddar ingen stabilitet
  idx = Math.max(eff > 500 ? RATINGS.length - 2 : 0, Math.min(RATINGS.length - 1, idx));
  return { idx, base, eff, notes };
}

// Månadsbetalning (annuitet): samma belopp varje månad, skulden borta efter `months`
export function annuity(debt, ratePerYear, months) {
  if (!(debt > 0)) return 0;
  if (!(months > 1)) return debt * (1 + ratePerYear / 100 / MONTHS_PER_YEAR);
  const r = ratePerYear / 100 / MONTHS_PER_YEAR;
  if (r <= 0) return debt / months;
  return debt * r / (1 - (1 + r) ** -months);
}

// De planer banken tillåter med ett visst betyg
export const allowedPlans = (idx) => PLAN_YEARS.filter((y) => y <= RATINGS[idx].term);

// Hur mycket mer banken lånar ut (i pengar) innan den vägda skulden når taket
export function creditRoom(debt, Y, tier, idx) {
  const lim = RATINGS[idx].limit * tierFactor(tier) / 100 * Y;
  return Math.max(0, lim - debt);
}

// Statsbankruttens kris i samhället (avtar dag för dag)
export function crisisMods(left) {
  if (!(left > 0)) return {};
  const k = Math.min(1, left / CRISIS_DAYS);
  const r = (n) => Math.round(n * k);
  return { approval: r(-22), stability: r(-25), unrest: r(25), gdp: r(-14), income: r(-10), factory: r(-8), corruption: r(6) };
}
