// TRADE WARS — infrastrukturen du bygger själv.
//
// En förbindelse går mellan två städer i ett land du kontrollerar. Den kräver
// rätt terminal i BÅDA ändar (lastterminal / tågstation / hamn / flygplats),
// och båda städerna måste ha ström. När den är byggd rullar fordon fram och
// tillbaka; varje gång ett fordon KOMMER FRAM tickar inkomsten in.
//
// Fordonen är inte dekoration — de är kvittot på att linjen arbetar. Ser du
// tre lastbilar på en väg vet du att den är uppgraderad till nivå 3.

import { LINK, MAX_LINK_LEVEL, linkIncome, linkTripDays, kmBetween } from './econ.js';

export { LINK, MAX_LINK_LEVEL };

// Nyckel för en förbindelse — sorterad så A→B och B→A är samma linje.
export function linkKey(kind, a, b) {
  return `${kind}:${[a, b].sort().join('-')}`;
}

// Skapar en ny förbindelse. progress är 0..1 per fordon, ett per nivå.
export function makeLink(kind, a, b, aLL, bLL) {
  const km = kmBetween(aLL, bLL);
  return {
    kind, a, b, km, level: 1,
    // varje fordon startar utspritt så de inte åker i klump
    cars: [{ t: 0, dir: 1 }],
  };
}

// Lägg till ett fordon när linjen uppgraderas.
export function addCar(link) {
  const n = link.cars.length;
  link.cars.push({ t: n / (n + 1), dir: 1 });
  link.level = link.cars.length;
}

// Flyttar alla fordon ett dygn framåt. Returnerar hur många LEVERANSER som
// skedde — alltså hur många gånger ett fordon nådde fram.
export function tickLink(link, days, speedMult) {
  const trip = linkTripDays(link.kind, link.km) / Math.max(0.2, speedMult);
  const step = days / trip;
  let arrivals = 0;
  for (const car of link.cars) {
    car.t += step;
    while (car.t >= 1) {
      car.t -= 1;
      car.dir *= -1;      // vänder och kör tillbaka
      arrivals++;
    }
  }
  return arrivals;
}

// Inkomst per leverans, inklusive forskningens påslag.
export function payload(link, incomeMult) {
  return Math.round(linkIncome(link.kind, link.km, 1) * incomeMult);
}

// Var befinner sig ett fordon just nu (0..1 längs linjen)?
export function carPos(car) {
  return car.dir > 0 ? car.t : 1 - car.t;
}

// Har staden den terminal som krävs för den här sortens förbindelse?
export function hasTerminal(cityBuildings, cityKey, kind) {
  return (cityBuildings?.[cityKey] || []).includes(LINK[kind].terminal);
}

// Vilka hinder finns för att bygga just den här linjen? Tom lista = kör.
export function blockers(kind, aKey, bKey, ctx) {
  const out = [];
  const K = LINK[kind];
  if (!ctx.powered.has(aKey)) out.push(`${ctx.nameOf(aKey)} SAKNAR EL`);
  if (!ctx.powered.has(bKey)) out.push(`${ctx.nameOf(bKey)} SAKNAR EL`);
  if (!hasTerminal(ctx.cityBuildings, aKey, kind)) out.push(`${ctx.nameOf(aKey)} SAKNAR ${K.terminal === 'truckterminal' ? 'LASTTERMINAL' : K.terminal === 'trainstation' ? 'TÅGSTATION' : K.terminal === 'harbour' ? 'HAMN' : 'FLYGPLATS'}`);
  if (!hasTerminal(ctx.cityBuildings, bKey, kind)) out.push(`${ctx.nameOf(bKey)} SAKNAR ${K.terminal === 'truckterminal' ? 'LASTTERMINAL' : K.terminal === 'trainstation' ? 'TÅGSTATION' : K.terminal === 'harbour' ? 'HAMN' : 'FLYGPLATS'}`);
  if (K.coastalOnly) {
    if (!ctx.isCoastal(aKey)) out.push(`${ctx.nameOf(aKey)} LIGGER INTE VID HAVET`);
    if (!ctx.isCoastal(bKey)) out.push(`${ctx.nameOf(bKey)} LIGGER INTE VID HAVET`);
  }
  return out;
}

// Finns en kedja av förbindelser från staden till huvudstaden? Krävs för att
// en råvara ska kunna nå lagret — och för att sjöfart ska vara ett köpalternativ.
export function connectedToCapital(links, cityKey, capitalKey) {
  if (cityKey === capitalKey) return true;
  const adj = {};
  for (const l of Object.values(links)) {
    (adj[l.a] ||= []).push(l.b);
    (adj[l.b] ||= []).push(l.a);
  }
  const seen = new Set([cityKey]);
  const q = [cityKey];
  while (q.length) {
    const c = q.pop();
    if (c === capitalKey) return true;
    for (const nb of adj[c] || []) if (!seen.has(nb)) { seen.add(nb); q.push(nb); }
  }
  return false;
}

// Går det att nå huvudstaden sjövägen? (används av marknadsplatsen)
export function seaReachable(links, capitalKey) {
  return Object.values(links).some((l) => l.kind === 'sea'
    && connectedToCapital(links, l.a, capitalKey));
}
