// Bygger v2/data/cities.json + v2/data/facts.json för IMPERIUM
// - Städer: Natural Earth 10m populated places, geo-joinas till world-atlas-länder (50m)
// - Fakta: restcountries (befolkning + huvudstad) per alpha-2
import { geoContains, geoBounds } from 'd3-geo';
import * as topojson from 'topojson-client';
import { writeFileSync, mkdirSync } from 'fs';

const OUT_DIR = 'D:/GamesProjects/imperium/v2/data';
mkdirSync(OUT_DIR, { recursive: true });

const CITIES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson';
const COUNTRIES_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
const FACTS_URL = 'https://restcountries.com/v3.1/all?fields=cca2,population,capital';

const j = async (url) => {
  console.log('hämtar', url.slice(0, 80));
  const r = await fetch(url);
  if (!r.ok) throw new Error(url + ' -> ' + r.status);
  return r.json();
};

const [citiesRaw, countriesTopo, factsRaw] = await Promise.all([
  j(CITIES_URL), j(COUNTRIES_URL), j(FACTS_URL).catch((e) => { console.warn('facts failade:', e.message); return null; }),
]);

const countries = topojson.feature(countriesTopo, countriesTopo.objects.countries).features
  .map((f) => ({ id: String(f.id ?? ''), f, b: geoBounds(f) }))
  .filter((c) => c.id);

function findCountry(ll) {
  const [lon, lat] = ll;
  const e = 0.1;
  for (const c of countries) {
    const [[x0, y0], [x1, y1]] = c.b;
    if (lat < y0 - e || lat > y1 + e) continue;
    const lonIn = x0 <= x1 ? (lon >= x0 - e && lon <= x1 + e) : (lon >= x0 - e || lon <= x1 + e);
    if (!lonIn) continue;
    if (geoContains(c.f, ll)) return c.id;
  }
  return null;
}

const byCountry = new Map();
let unmatched = 0;
for (const feat of citiesRaw.features) {
  const p = feat.properties || {};
  const ll = feat.geometry?.coordinates;
  if (!ll || !p.name) continue;
  // prova exakt punkt, sen små offsets (kuststäder kan hamna precis utanför 50m-polygonen)
  let cid = findCountry(ll);
  if (!cid) {
    for (const [dx, dy] of [[0.15, 0], [-0.15, 0], [0, 0.15], [0, -0.15], [0.3, 0], [-0.3, 0]]) {
      cid = findCountry([ll[0] + dx, ll[1] + dy]);
      if (cid) break;
    }
  }
  if (!cid) { unmatched++; continue; }
  if (!byCountry.has(cid)) byCountry.set(cid, []);
  byCountry.get(cid).push({
    n: p.name,
    ll: [Math.round(ll[0] * 100) / 100, Math.round(ll[1] * 100) / 100],
    p: Math.max(0, p.pop_max | 0),
    c: p.adm0cap ? 1 : 0,
  });
}

const BIG = new Set(['840', '156', '356', '643', '076']); // US, CN, IN, RU, BR får fler städer
const out = {};
let total = 0;
for (const [cid, list] of byCountry) {
  list.sort((a, b) => b.p - a.p);
  const cap = BIG.has(cid) ? 12 : 8;
  let keep = list.slice(0, cap);
  const capital = list.find((c) => c.c);
  if (capital && !keep.includes(capital)) keep = [...keep.slice(0, cap - 1), capital];
  out[cid] = keep;
  total += keep.length;
}

writeFileSync(OUT_DIR + '/cities.json', JSON.stringify(out));
console.log(`cities.json: ${Object.keys(out).length} länder, ${total} städer (${unmatched} ojoinade hoppades över)`);

if (factsRaw) {
  const facts = {};
  for (const c of factsRaw) {
    if (!c.cca2) continue;
    facts[c.cca2] = { p: c.population || 0, c: (c.capital && c.capital[0]) || '' };
  }
  writeFileSync(OUT_DIR + '/facts.json', JSON.stringify(facts));
  console.log('facts.json:', Object.keys(facts).length, 'länder');
}

// sanity: Sverige
console.log('SVERIGE (752):', JSON.stringify(out['752']));
