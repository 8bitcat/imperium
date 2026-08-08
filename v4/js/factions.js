// IMPERIUM v4 — M9: de fyra faktionerna (godkända namn). Allt är data.
// Sprites: umrex (CC BY-NC-SA 3.0). Balans enligt faktionsunderlaget.

export const FACTIONS = {
  jarngardet: {
    name: 'JÄRNGARDET', icon: '\u{1F6E1}\u{FE0F}',
    desc: 'Massarmén med bredast arsenal. Billig produktion, stark industri — bäst på inget, bra på allt.',
    color: '#57c46a', kenneyRow: 6,   // grön armé
    mods: { factory: 5, manpower: 5 },
    combat: { INF: 0, TANK: 0, FLYG: 0 },
    cost: { INF: 1, TANK: 1, FLYG: 1 },
    unitNames: { INF: 'SKYTTEGRUPP', TANK: 'HUVUDSTRIDSVAGN', FLYG: 'ATTACKHELIKOPTER' },
    sprites: { TANK: 'jarngardet-tank.png' },
  },
  vintergardet: {
    name: 'VINTERGARDET', icon: '\u{2744}\u{FE0F}',
    desc: 'Elitgardet i rött och guld. Få men överlägsna soldater — dyra, men slår hårdast man mot man.',
    color: '#ff5a4a', kenneyRow: 8,   // röd armé
    mods: { readiness: 8, qol: 3, manpower: -5 },
    combat: { INF: 2, TANK: 1, FLYG: 0 },
    cost: { INF: 1.6, TANK: 1.3, FLYG: 1.2 },
    unitNames: { INF: 'LIVGARDIST', TANK: 'VINTERSTRIDSVAGN', FLYG: 'GARDESHELIKOPTER' },
    sprites: { INF: 'vintergardet-inf.png', TANK: 'vintergardet-tank.png' },
  },
  askgardet: {
    name: 'ASKGARDET', icon: '\u{1F32B}\u{FE0F}',
    desc: 'Skyttegravskåren. Billigast massinfanteri i spelet och tyngst artilleri — men långsamma och nästan utan flyg.',
    color: '#9aa4ae', kenneyRow: 5,   // grå armé
    mods: { manpower: 10, income: -5 },
    combat: { INF: 0, TANK: 1, FLYG: -1 },
    cost: { INF: 0.5, TANK: 0.9, FLYG: 1.8 },
    unitNames: { INF: 'ASKSOLDATER', TANK: 'BELÄGRINGSVAGN', FLYG: 'GUNSHIP' },
    sprites: { INF: 'askgardet-inf.png', TANK: 'askgardet-tank.png' },
  },
  stjarnsamvaldet: {
    name: 'STJÄRNSAMVÄLDET', icon: '\u{1F6F8}',
    desc: 'Den hyperteknologiska federationen. Svävarteknik och rälskanoner — dyrt, fåtaligt, träffar först.',
    color: '#ffa53e', kenneyRow: 9,   // orange armé
    mods: { research: 8, gdp: 5, manpower: -8 },
    combat: { INF: 1, TANK: 1, FLYG: 2 },
    cost: { INF: 1.4, TANK: 1.4, FLYG: 1.3 },
    unitNames: { INF: 'ELDKRIGARE', TANK: 'SVÄVARTANK', FLYG: 'LANDKRYSSARE' },
    sprites: { INF: 'stjarnsamvaldet-inf.png', TANK: 'stjarnsamvaldet-tank.png', FLYG: 'stjarnsamvaldet-flyg.png' },
  },
};
