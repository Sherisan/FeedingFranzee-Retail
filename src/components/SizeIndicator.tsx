import { FISH_TIERS, tierForMultiplier } from '../game/fishTiers';
import type { GameState } from '../game/useGameState';
import type { LiveClock } from '../game/useLiveClock';
import { Fish } from './fish/Fish';

/** Top-right growth stage indicator — Figma node 3:50 ("Size · 5 slots · Small"). */
export function SizeIndicator({ state, live }: { state: GameState; live: LiveClock }) {
  const current = tierForMultiplier(state.phase === 'flying' ? live.multiplier : 1);
  const playable = FISH_TIERS.slice(1); // Clownfish → Whale Shark

  return (
    <div className="size-panel glass">
      <span className="size-label">Size</span>
      <div className="size-slots">
        {playable.map((tier) => (
          <div
            key={tier.species}
            className={`size-slot ${tier === current ? 'active' : ''}`}
            title={`${tier.name} ×${tier.multiplier}`}
          >
            <Fish species={tier.species} width={22} swim={false} />
          </div>
        ))}
      </div>
      <span className="size-current">{current.tierLabel}</span>
    </div>
  );
}
