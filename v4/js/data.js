// IMPERIUM v2 — världskartdata + städer + landsfakta
import { svName } from './names.js';

const ATLAS_110 = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const ATLAS_50 = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

async function fetchCountries(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('atlas ' + res.status);
  const topo = await res.json();
  const feats = topojson.feature(topo, topo.objects.countries).features;
  return feats.map((f) => {
    const id = String(f.id ?? f.properties?.name ?? '');
    return {
      id,
      feature: f,
      name: svName(id, f.properties?.name),
      bounds: d3.geoBounds(f),
      centroid: d3.geoCentroid(f),
    };
  }).filter((c) => c.id);
}

export async function loadWorld(onLevel) {
  const lo = await fetchCountries(ATLAS_110);
  onLevel(lo, '110m');
  fetchCountries(ATLAS_50)
    .then((hi) => onLevel(hi, '50m'))
    .catch((e) => console.warn('50m-karta kunde inte laddas, kör vidare på 110m', e));
}

// Städer: { "752": [{n, ll:[lon,lat], p, c}] } — byggd från Natural Earth 10m (se README)
export async function loadCities() {
  const res = await fetch('data/cities.json');
  if (!res.ok) throw new Error('cities ' + res.status);
  return res.json();
}

// Fakta: { "752": { p: befolkning, c: "Stockholm", a2: "SE" } }
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
