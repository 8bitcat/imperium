// IMPERIUM — världskartdata (riktiga landsgränser)
// Laddar Natural Earth via world-atlas: först 110m (litet, syns direkt),
// sedan 50m (detaljerat, byts in tyst i bakgrunden när det anlänt).
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
      bounds: d3.geoBounds(f),        // [[minLon,minLat],[maxLon,maxLat]]
      centroid: d3.geoCentroid(f),    // [lon,lat]
    };
  }).filter((c) => c.id);
}

// onLevel(countries, level) anropas en gång per detaljnivå ('110m', sen '50m')
export async function loadWorld(onLevel) {
  const lo = await fetchCountries(ATLAS_110);
  onLevel(lo, '110m');
  fetchCountries(ATLAS_50)
    .then((hi) => onLevel(hi, '50m'))
    .catch((e) => console.warn('50m-karta kunde inte laddas, kör vidare på 110m', e));
}
