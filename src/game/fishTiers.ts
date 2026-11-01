// The six species from the Figma design (node 3:5 "Feeding_Frenzy_Root").
// The multiplier is the round multiplier at which the player's fish evolves
// into that species. Sardine (0.5x) is below the 1.00x launch point — it
// exists as ambient "food" fish and in the legend/paytable only.

export type Species = 'sardine' | 'clownfish' | 'grouper' | 'tuna' | 'shark' | 'whaleshark';

export interface FishTier {
  species: Species;
  name: string;
  tier: 'TINY' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'PREDATOR' | 'MYTHIC';
  /** Display form used in the legend / size label ("Small", "Mythic"). */
  tierLabel: string;
  multiplier: number;
  /** Card/tier accent color (Figma fish cards). */
  accent: string;
  /** Color of the multiplier value in the Species Legend. */
  multColor: string;
  /** Dark tier-pill background on the fish cards. */
  pillBg: string;
  /** Fish-card border color. */
  cardBorder: string;
}

export const FISH_TIERS: FishTier[] = [
  { species: 'sardine',    name: 'Sardine',     tier: 'TINY',     tierLabel: 'Tiny',     multiplier: 0.5, accent: '#b2d9f2', multColor: '#a1c4e6', pillBg: '#2d363d', cardBorder: '#475761' },
  { species: 'clownfish',  name: 'Clownfish',   tier: 'SMALL',    tierLabel: 'Small',    multiplier: 1,   accent: '#ff8c33', multColor: '#1de9b6', pillBg: '#40230d', cardBorder: '#663814' },
  { species: 'grouper',    name: 'Grouper',     tier: 'MEDIUM',   tierLabel: 'Medium',   multiplier: 2,   accent: '#99d980', multColor: '#00f5ff', pillBg: '#263620', cardBorder: '#3d5733' },
  { species: 'tuna',       name: 'Tuna',        tier: 'LARGE',    tierLabel: 'Large',    multiplier: 5,   accent: '#4db2ff', multColor: '#00f5ff', pillBg: '#132d40', cardBorder: '#1f4766' },
  { species: 'shark',      name: 'Shark',       tier: 'PREDATOR', tierLabel: 'Predator', multiplier: 10,  accent: '#ffc71a', multColor: '#ffd700', pillBg: '#403206', cardBorder: '#66500a' },
  { species: 'whaleshark', name: 'Whale Shark', tier: 'MYTHIC',   tierLabel: 'Mythic',   multiplier: 25,  accent: '#d94dff', multColor: '#ffd700', pillBg: '#361340', cardBorder: '#571f66' },
];

/** The species the player currently IS, given the live multiplier (starts as Clownfish at 1.00x). */
export function tierForMultiplier(multiplier: number): FishTier {
  let current = FISH_TIERS[1];
  for (const tier of FISH_TIERS) {
    if (tier.multiplier >= 1 && multiplier >= tier.multiplier) current = tier;
  }
  return current;
}

/** The tier that would EAT the player at the current size — used for the crash animation. */
export function predatorForMultiplier(multiplier: number): FishTier {
  const idx = FISH_TIERS.indexOf(tierForMultiplier(multiplier));
  return FISH_TIERS[Math.min(idx + 1, FISH_TIERS.length - 1)];
}

/** Accent color for a crash-history chip. */
export function tierColorForCrash(multiplier: number): string {
  return tierForMultiplier(multiplier).accent;
}

/** 1-based level for the "LVL n: TIER" growth label (Sardine=1 … Whale Shark=6). */
export function levelForTier(tier: FishTier): number {
  return FISH_TIERS.indexOf(tier) + 1;
}

/** Progress (0..1) from the current tier's threshold to the next tier's. */
export function progressToNext(multiplier: number): { progress: number; next: FishTier | null } {
  const current = tierForMultiplier(multiplier);
  const idx = FISH_TIERS.indexOf(current);
  const next = idx < FISH_TIERS.length - 1 ? FISH_TIERS[idx + 1] : null;
  if (!next) return { progress: 1, next: null };
  const span = next.multiplier - current.multiplier;
  return {
    progress: Math.min(1, Math.max(0, (multiplier - current.multiplier) / span)),
    next,
  };
}

/** Visual scale of the player fish: 1.00x → ~0.5, 25x+ → ~2.1, log growth. */
export function playerScale(multiplier: number): number {
  return Math.min(2.1, 0.5 + 0.35 * Math.log(Math.max(1, multiplier)) / Math.log(2.4));
}
