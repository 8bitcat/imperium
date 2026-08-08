// v3: städer per land skalat på befolkning (fler städer i stora länder)
import { geoContains, geoBounds } from 'd3-geo';
import * as topojson from 'topojson-client';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';

const OUT_DIR = 'D:/GamesProjects/imperium/v3/data';
mkdirSync(OUT_DIR, { recursive: true });
const facts = JSON.parse(readFileSync('D:/GamesProjects/imperium/v3/data/facts.json', 'utf8'));

const CITIES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson';
const COUNTRIES_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

const j = async (url) => {
  console.log('hämtar', url.slice(0, 80));
  const r = await fetch(url);
  if (!r.ok) throw new Error(url + ' -> ' + r.status);
  return r.json();
};

const [citiesRaw, countriesTopo] = await Promise.all([j(CITIES_URL), j(COUNTRIES_URL)]);

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

// antal städer skalar med landets befolkning
function popCap(pop) {
  if (pop >= 200e6) return 22;
  if (pop >= 80e6) return 16;
  if (pop >= 30e6) return 12;
  if (pop >= 10e6) return 9;
  if (pop >= 3e6) return 6;
  if (pop >= 1e6) return 4;
  return 2;
}

const out = {};
let total = 0;
for (const [cid, list] of byCountry) {
  list.sort((a, b) => b.p - a.p);
  const pop = facts[cid]?.p || 2e6;
  const cap = popCap(pop);
  let keep = list.slice(0, cap);
  const capital = list.find((c) => c.c);
  if (capital && !keep.includes(capital)) keep = [...keep.slice(0, cap - 1), capital];
  out[cid] = keep;
  total += keep.length;
}

writeFileSync(OUT_DIR + '/cities.json', JSON.stringify(out));
console.log(`v3 cities.json: ${Object.keys(out).length} länder, ${total} städer (${unmatched} ojoinade)`);
console.log('SVERIGE:', out['752'].length, out['752'].map((x) => x.n).join(', '));
console.log('TYSKLAND:', out['276'].length, 'USA:', out['840'].length, 'KINA:', out['156'].length, 'NORGE:', out['578'].length);
