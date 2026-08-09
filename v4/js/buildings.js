// IMPERIUM v4 — stadsbyggnader: produktion, poäng, råvaror och handel. Allt är data.
// unlocksUnit = gör enhetstypen byggbar i landet där byggnaden står.
// daily = daglig avkastning. resource = landet producerar råvaran. tradeSlot = +1 handelsavtal.

export const BUILDINGS = {
  kasern: { name: 'KASERN', icon: '\u{1F396}\u{FE0F}', money: 120, days: 4, unlocksUnit: 'INF', desc: 'GÖR INFANTERI BYGGBART I LANDET' },
  fabrik: { name: 'STRIDSVAGNSFABRIK', icon: '\u{1F3ED}', money: 260, days: 6, unlocksUnit: 'TANK', research: ['tanks', 1], desc: 'GÖR STRIDSVAGNAR BYGGBARA I LANDET' },
  flygbas: { name: 'FLYGBAS', icon: '\u{1F6EB}', money: 340, days: 8, unlocksUnit: 'FLYG', research: ['aircraft', 1], desc: 'GÖR FLYG BYGGBART I LANDET' },
  universitet: { name: 'UNIVERSITET', icon: '\u{1F393}', money: 220, days: 5, daily: { rp: 2 }, desc: '+2 \u{1F52C} PER DAG' },
  bank: { name: 'BANK', icon: '\u{1F3E6}', money: 220, days: 5, daily: { money: 8 }, desc: '+8 \u{1F4B0} PER DAG' },
  rekryt: { name: 'REKRYTERINGSKONTOR', icon: '\u{1F9CD}', money: 150, days: 4, daily: { man: 1 }, desc: '+1 \u{1F9CD} PER DAG' },
  marknad: { name: 'HANDELSMARKNAD', icon: '\u{1F91D}', money: 200, days: 5, tradeSlot: 1, desc: '+1 HANDELSAVTAL' },
  gruva: { name: 'GRUVA', icon: '\u{26CF}\u{FE0F}', money: 240, days: 6, resource: 'JARN', research: ['economy', 1], desc: 'PRODUCERAR JÄRN' },
  raffinaderi: { name: 'RAFFINADERI', icon: '\u{1F6E2}\u{FE0F}', money: 320, days: 7, resource: 'OLJA', research: ['economy', 2], desc: 'PRODUCERAR OLJA' },
};

export const CITY_SLOTS = 3;

// vilken byggnad krävs (någonstans i landet) för att bygga enhetstypen där
export const UNIT_NEEDS_BUILDING = { INF: 'kasern', TANK: 'fabrik', FLYG: 'flygbas' };

// handelspriser per råvara: [engångskostnad, daglig kostnad]
export const TRADE_PRICES = {
  URAN: [120, 6], DIAMANT: [120, 6],
  OLJA: [90, 4], GULD: [90, 4],
  JARN: [70, 3], TIMMER: [60, 3], SPANNMAL: [60, 3], FISK: [50, 2],
};
export const TRADE_DEFAULT = [60, 3];
