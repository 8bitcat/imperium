// IMPERIUM v2 — naturtillgångar per land + byggrecept
// Kurerad lista för kända länder, deterministisk fallback för resten.
export const RESOURCES = {
  OLJA:     { icon: '\u{1F6E2}️', name: 'Olja',      color: '#9aa0a6' },
  JARN:     { icon: '⛏️',    name: 'Järn',      color: '#d2691e' },
  GULD:     { icon: '\u{1FA99}',       name: 'Guld',      color: '#ffd700' },
  SPANNMAL: { icon: '\u{1F33E}',       name: 'Spannmål',  color: '#e8d87a' },
  TIMMER:   { icon: '\u{1F332}',       name: 'Timmer',    color: '#3ea34f' },
  FISK:     { icon: '\u{1F41F}',       name: 'Fisk',      color: '#4fa8ff' },
  URAN:     { icon: '☢️',    name: 'Uran',      color: '#66ff66' },
  DIAMANT:  { icon: '\u{1F48E}',       name: 'Diamanter', color: '#b9f2ff' },
};

// Vad som krävs för att bygga vad (används av kommande byggsystem)
export const RECIPES = [
  { name: 'INFANTERI',  icon: '\u{1FA96}',       needs: ['SPANNMAL'] },
  { name: 'STRIDSVAGN', icon: '\u{1F6E1}️', needs: ['JARN', 'OLJA'] },
  { name: 'FLYGPLAN',   icon: '✈️',    needs: ['JARN', 'OLJA', 'GULD'] },
  { name: 'FLOTTA',     icon: '\u{1F6A2}',       needs: ['TIMMER', 'JARN'] },
  { name: 'SPIONER',    icon: '\u{1F575}️', needs: ['DIAMANT', 'GULD'] },
  { name: 'KÄRNVAPEN',  icon: '☢️',    needs: ['URAN', 'GULD'] },
];

const CURATED = {
  '752': ['JARN', 'TIMMER'],        // Sverige
  '578': ['OLJA', 'FISK'],          // Norge
  '246': ['TIMMER'],                // Finland
  '208': ['SPANNMAL', 'FISK'],      // Danmark
  '352': ['FISK'],                  // Island
  '643': ['OLJA', 'URAN', 'TIMMER'],// Ryssland
  '840': ['OLJA', 'SPANNMAL', 'GULD'], // USA
  '124': ['TIMMER', 'OLJA', 'URAN'],// Kanada
  '076': ['TIMMER', 'GULD'],        // Brasilien
  '156': ['JARN', 'SPANNMAL'],      // Kina
  '356': ['SPANNMAL', 'JARN'],      // Indien
  '036': ['JARN', 'GULD', 'URAN'],  // Australien
  '682': ['OLJA'],                  // Saudiarabien
  '364': ['OLJA'],                  // Iran
  '368': ['OLJA'],                  // Irak
  '784': ['OLJA', 'GULD'],          // Förenade Arabemiraten
  '818': ['SPANNMAL'],              // Egypten
  '710': ['GULD', 'DIAMANT'],       // Sydafrika
  '180': ['DIAMANT'],               // Kongo-Kinshasa
  '072': ['DIAMANT'],               // Botswana
  '566': ['OLJA'],                  // Nigeria
  '012': ['OLJA'],                  // Algeriet
  '434': ['OLJA'],                  // Libyen
  '276': ['JARN'],                  // Tyskland
  '250': ['SPANNMAL'],              // Frankrike
  '826': ['OLJA', 'FISK'],          // Storbritannien
  '724': ['SPANNMAL'],              // Spanien
  '380': ['SPANNMAL'],              // Italien
  '616': ['JARN', 'SPANNMAL'],      // Polen
  '804': ['SPANNMAL', 'JARN'],      // Ukraina
  '792': ['SPANNMAL'],              // Turkiet
  '398': ['URAN', 'OLJA'],          // Kazakstan
  '860': ['GULD'],                  // Uzbekistan
  '604': ['GULD', 'FISK'],          // Peru
  '152': ['JARN', 'FISK'],          // Chile
  '032': ['SPANNMAL'],              // Argentina
  '484': ['OLJA', 'GULD'],          // Mexiko
  '862': ['OLJA', 'GULD'],          // Venezuela
  '170': ['GULD'],                  // Colombia
  '392': ['FISK', 'JARN'],          // Japan
  '410': ['JARN'],                  // Sydkorea
  '704': ['SPANNMAL', 'FISK'],      // Vietnam
  '764': ['SPANNMAL', 'FISK'],      // Thailand
  '360': ['TIMMER', 'OLJA'],        // Indonesien
  '458': ['TIMMER', 'OLJA'],        // Malaysia
  '554': ['SPANNMAL', 'FISK'],      // Nya Zeeland
  '620': ['FISK'],                  // Portugal
  '528': ['SPANNMAL', 'FISK'],      // Nederländerna
  '756': ['GULD'],                  // Schweiz
  '040': ['TIMMER'],                // Österrike
  '642': ['OLJA', 'SPANNMAL'],      // Rumänien
  '372': ['SPANNMAL', 'FISK'],      // Irland
};

// Vanliga tillgångar väger tyngre i fallbacken än uran/diamanter
const FALLBACK_POOL = [
  'SPANNMAL', 'TIMMER', 'FISK', 'JARN', 'OLJA', 'GULD',
  'SPANNMAL', 'TIMMER', 'FISK', 'JARN', 'URAN', 'DIAMANT',
];

function hashId(id) {
  let h = 7;
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function resourcesOf(countryId) {
  const cur = CURATED[String(countryId)];
  if (cur) return cur;
  const h = hashId(countryId);
  const first = FALLBACK_POOL[h % FALLBACK_POOL.length];
  if (h % 3 === 0) {
    const second = FALLBACK_POOL[(h >> 4) % FALLBACK_POOL.length];
    if (second !== first) return [first, second];
  }
  return [first];
}
