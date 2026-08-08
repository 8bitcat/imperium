// facts.json: numeriskt ISO-id -> { p: befolkning, c: huvudstad, a2: alpha-2 }
// Befolkning: World Bank (senaste icke-tomma värdet). Huvudstad+koder: mledoze/countries.
import { writeFileSync } from 'fs';

const j = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(url + ' -> ' + r.status);
  return r.json();
};

const [meta, wbRaw] = await Promise.all([
  j('https://raw.githubusercontent.com/mledoze/countries/master/countries.json'),
  j('https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=400&mrnev=1'),
]);

const popByA2 = new Map();
for (const row of wbRaw[1] || []) {
  if (row?.country?.id && row.value != null) popByA2.set(row.country.id, row.value);
}
console.log('World Bank-befolkning för', popByA2.size, 'länder/aggregat');

const facts = {};
for (const c of meta) {
  if (!c.ccn3) continue;
  facts[c.ccn3] = {
    p: popByA2.get(c.cca2) || 0,
    c: (c.capital && c.capital[0]) || '',
    a2: c.cca2,
  };
}
writeFileSync('D:/GamesProjects/imperium/v2/data/facts.json', JSON.stringify(facts));
console.log('facts.json:', Object.keys(facts).length, 'länder');
console.log('SVERIGE:', JSON.stringify(facts['752']));
console.log('USA:', JSON.stringify(facts['840']));
