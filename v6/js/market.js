// TRADE WARS — marknadsplatsen.
//
// Alla länder lägger ut det de har i sitt lager. Köper du något betalar du
// säljarens pris PLUS frakten — och frakten är exakt den intäkt transporten
// skulle ha gett dig om du kört den åt andra hållet. Det är hela poängen:
// samma siffra är din vinst när du säljer och din kostnad när du köper.
//
// Flyg går alltid att välja. Sjöfart bara om du har en hamnstad som hänger
// ihop med din huvudstad — annars finns inget skepp att lasta på.

import { LINK, linkIncome, kmBetween } from './econ.js';

export const RESOURCES = {
  JARN: { name: 'JÄRN', icon: '\u{26CF}\u{FE0F}', base: 42 },
  OLJA: { name: 'OLJA', icon: '\u{1F6E2}\u{FE0F}', base: 68 },
  KOL: { name: 'KOL', icon: '\u{1FAA8}', base: 30 },
  TIMMER: { name: 'TIMMER', icon: '\u{1FAB5}', base: 26 },
  SPANNMAL: { name: 'SPANNMÅL', icon: '\u{1F33E}', base: 22 },
  FISK: { name: 'FISK', icon: '\u{1F41F}', base: 24 },
  GAS: { name: 'GAS', icon: '\u{1F4A8}', base: 58 },
  URAN: { name: 'URAN', icon: '\u{2622}\u{FE0F}', base: 130 },
  KOPPAR: { name: 'KOPPAR', icon: '\u{1F7E0}', base: 48 },
  DIAMANT: { name: 'DIAMANT', icon: '\u{1F48E}', base: 165 },
  BOMULL: { name: 'BOMULL', icon: '\u{1F9F5}', base: 28 },
  KAFFE: { name: 'KAFFE', icon: '\u{2615}', base: 34 },
};

// Vilka råvaror ett land har. Stabilt per land — samma värld varje gång.
export function resourcesOf(cid, hashFn) {
  const keys = Object.keys(RESOURCES);
  const h = hashFn(String(cid));
  const n = 1 + (h % 3);
  const out = [];
  for (let i = 0; i < n; i++) out.push(keys[(h >> (i * 4)) % keys.length]);
  return [...new Set(out)];
}

// Fraktkostnaden för ett köp = vad transporten hade gett i intäkt.
export function freightCost(kind, km) {
  return Math.max(6, linkIncome(kind, km, 1));
}

// Vilka transportsätt går att välja för det här köpet?
export function transportOptions(km, opts) {
  const list = [];
  // flyget når alltid fram — det är därför det är dyrast
  list.push({ kind: 'air', km, cost: freightCost('air', km), days: Math.max(1, Math.round(km / LINK.air.kmPerDay)) });
  if (opts.seaOk) {
    list.push({ kind: 'sea', km, cost: freightCost('sea', km), days: Math.max(2, Math.round(km / LINK.sea.kmPerDay)) });
  }
  if (opts.landOk) {
    list.push({ kind: 'rail', km, cost: freightCost('rail', km), days: Math.max(1, Math.round(km / LINK.rail.kmPerDay)) });
    list.push({ kind: 'road', km, cost: freightCost('road', km), days: Math.max(1, Math.round(km / LINK.road.kmPerDay)) });
  }
  return list.sort((a, b) => a.cost - b.cost);
}

// Totalpris = säljarens pris × mängd + frakt.
export function totalPrice(ask, qty, freight) {
  return Math.round(ask * qty + freight);
}

// Vad ett AI-land begär för sin råvara. Rika och välutvecklade länder tar mer.
export function askingPrice(res, devFactor) {
  return Math.round(RESOURCES[res].base * (0.8 + devFactor * 0.5));
}

// Bygger marknadens utbud. Varje land som har ett lager lägger ut sitt
// överskott; spelaren ser en lista att köpa ur.
export function buildListings(world, hashFn) {
  const out = [];
  for (const [cid, entry] of Object.entries(world.stores || {})) {
    if (!entry?.qty) continue;
    for (const [res, qty] of Object.entries(entry.qty)) {
      if (qty <= 0) continue;
      out.push({
        cid, res, qty,
        ask: askingPrice(res, entry.dev || 0.5),
        ll: entry.ll,
      });
    }
  }
  return out.sort((a, b) => a.ask - b.ask);
}

export { kmBetween };
