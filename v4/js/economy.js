// IMPERIUM v4 — ländernas ekonomiska tyngd. Inkomst och militär skalar IHOP:
// ett land som ger mycket inkomster startar också med mycket mer militär.
// econOf ≈ sqrt(befolkning i miljoner) × välståndsfaktor (1 = fattig, 3 = rik).

export const WEALTH_TIER = {
  // rika länder (≈ tier 3)
  '840': 3,   // USA
  '124': 3,   // Kanada
  '826': 3,   // Storbritannien
  '372': 3,   // Irland
  '250': 3,   // Frankrike
  '276': 3,   // Tyskland
  '528': 3,   // Nederländerna
  '056': 3,   // Belgien
  '442': 3,   // Luxemburg
  '756': 3,   // Schweiz
  '040': 3,   // Österrike
  '208': 3,   // Danmark
  '578': 3,   // Norge
  '752': 3,   // Sverige
  '246': 3,   // Finland
  '352': 3,   // Island
  '380': 3,   // Italien
  '724': 3,   // Spanien
  '620': 3,   // Portugal
  '392': 3,   // Japan
  '410': 3,   // Sydkorea
  '036': 3,   // Australien
  '554': 3,   // Nya Zeeland
  '376': 3,   // Israel
  '702': 3,   // Singapore
  '634': 3,   // Qatar
  '784': 3,   // Förenade Arabemiraten
  '414': 3,   // Kuwait
  '158': 3,   // Taiwan
  // medel (≈ tier 1.3–2.5)
  '156': 1.8, // Kina
  '643': 2,   // Ryssland
  '682': 2.5, // Saudiarabien
  '076': 2,   // Brasilien
  '484': 2,   // Mexiko
  '792': 2,   // Turkiet
  '616': 2,   // Polen
  '203': 2,   // Tjeckien
  '703': 2,   // Slovakien
  '348': 2,   // Ungern
  '300': 2,   // Grekland
  '642': 2,   // Rumänien
  '100': 2,   // Bulgarien
  '191': 2,   // Kroatien
  '705': 2,   // Slovenien
  '233': 2,   // Estland
  '428': 2,   // Lettland
  '440': 2,   // Litauen
  '688': 2,   // Serbien
  '032': 2,   // Argentina
  '152': 2,   // Chile
  '858': 2,   // Uruguay
  '458': 2,   // Malaysia
  '764': 2,   // Thailand
  '710': 2,   // Sydafrika
  '398': 2,   // Kazakstan
  '364': 2,   // Iran
  '804': 1.5, // Ukraina
  '112': 1.5, // Belarus
  '170': 1.5, // Colombia
  '604': 1.5, // Peru
  '360': 1.5, // Indonesien
  '704': 1.5, // Vietnam
  '012': 1.5, // Algeriet
  '434': 1.5, // Libyen
  '818': 1.3, // Egypten
  '608': 1.3, // Filippinerna
  '504': 1.3, // Marocko
};

export function econOf(pop, cid) {
  return Math.sqrt((pop || 5e6) / 1e6) * (WEALTH_TIER[cid] || 1);
}

// daglig inkomst landet ger sin ägare
export function countryIncomeOf(pop, cid) {
  return Math.max(1, Math.round(econOf(pop, cid) * 0.4));
}

// stående arméns storlek (start + tak): rika/stora länder startar med mycket mer militär
export function armySizeOf(pop, cid) {
  return Math.max(3, Math.min(20, 3 + Math.round(econOf(pop, cid) / 3)));
}
