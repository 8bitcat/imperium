// IMPERIUM v4 — varje lands HÅLLNING. Den styr hur landet utvecklas och kan
// ändras av vad som händer runt omkring: ett fredligt handelsland som får en
// aggressiv granne rustar upp, och den som röstar för ett rike blir expansiv.

export const STANCES = {
  neutral: {
    name: 'NEUTRAL', icon: '\u{1F54A}\u{FE0F}', color: '#7fd1e8',
    desc: 'SATSAR PÅ HANDEL OCH VÄLSTÅND',
    units: 0.4,      // hur många förband per militärsatsning
    tech: 1.0,       // forskningstakt på armén
    expand: 0.0,     // benägenhet att ta grannländer
    focusMil: 0.15,  // hur ofta satsningen går till militären
  },
  defensive: {
    name: 'DEFENSIV', icon: '\u{1F6E1}\u{FE0F}', color: '#8fd8a0',
    desc: 'FORSKAR TUNGT PÅ FÖRSVAR — BYGGER UPP LÅNGSAMT MEN MODERNT',
    units: 0.6,
    tech: 2.2,       // forskar VÄLDIGT mycket på armén
    expand: 0.0,
    focusMil: 0.55,
  },
  aggressive: {
    name: 'AGGRESSIV', icon: '\u{2694}\u{FE0F}', color: '#ffb02e',
    desc: 'EXPANSIV — BYGGER MÅNGA FÖRBAND, FORSKAR LÅNGSAMMARE',
    units: 1.8,
    tech: 0.6,
    expand: 0.5,
    focusMil: 0.75,
  },
  ultra: {
    name: 'ULTRA-AGGRESSIV', icon: '\u{2620}\u{FE0F}', color: '#ff4f4f',
    desc: 'KRIGSMASKIN — BYGGER OAVBRUTET, FORSKAR MINST',
    units: 3.0,
    tech: 0.3,
    expand: 0.9,
    focusMil: 0.9,
  },
};

export const STANCE_ORDER = ['neutral', 'defensive', 'aggressive', 'ultra'];

export function stanceOf(world, cid) {
  world.stance ||= {};
  return world.stance[cid] || 'neutral';
}

export function setStance(world, cid, next) {
  world.stance ||= {};
  const prev = world.stance[cid] || 'neutral';
  if (prev === next) return null;
  world.stance[cid] = next;
  return { prev, next };
}
