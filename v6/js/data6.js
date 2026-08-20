// TRADE WARS — världsdata. Samma atlas som tidigare versioner, men städerna
// kommer från cities50.json: minst 50 per land, eftersom hela spelet handlar
// om att bygga nät MELLAN städer.
import { svName } from './names.js';

const ATLAS_110 = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const ATLAS_50 = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

async function fetchCountries(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('atlas ' + res.status);
  const topo = await res.json();
  const feats = topojson.feature(topo, topo.objects.countries).features;
  const countries = feats.map((f) => {
    const id = String(f.id ?? f.properties?.name ?? '');
    return {
      id,
      feature: f,
      name: svName(id, f.properties?.name),
      bounds: d3.geoBounds(f),
      centroid: d3.geoCentroid(f),
    };
  }).filter((c) => c.id);
  return { countries, topo };
}

export async function loadWorld(onLevel) {
  const lo = await fetchCountries(ATLAS_110);
  onLevel(lo.countries, '110m', lo.topo);
  fetchCountries(ATLAS_50)
    .then((hi) => onLevel(hi.countries, '50m', hi.topo))
    .catch((e) => console.warn('50m-kartan kunde inte laddas, kör vidare på 110m', e));
}

export async function loadCities() {
  const res = await fetch('data/cities50.json');
  if (!res.ok) throw new Error('cities50 ' + res.status);
  return res.json();
}

export async function loadFacts() {
  try {
    const res = await fetch('data/facts.json');
    if (!res.ok) throw new Error('facts ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('facts.json saknas', e);
    return {};
  }
}
