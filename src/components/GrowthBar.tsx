import { levelForTier, progressToNext, tierForMultiplier } from '../game/fishTiers';
import type { GameState } from '../game/useGameState';
import type { LiveClock } from '../game/useLiveClock';

/** Growth progress bar above the HUD — Figma node 3:137 ("LVL 2: SMALL · 65% TO MEDIUM"). */
export function GrowthBar({ state, live }: { state: GameState; live: LiveClock }) {
  const multiplier = state.phase === 'flying' ? live.multiplier : 1;
  const tier = tierForMultiplier(multiplier);
  const { progress, next } = progressToNext(multiplier);
  const pct = Math.round(progress * 100);

  return (
    <div className="growth-bar">
      <div className="growth-labels">
        <span className="growth-level">LVL {levelForTier(tier)}: {tier.tier}</span>
        <span className="growth-next">
          {next ? `${pct}% TO ${next.tier}` : 'APEX PREDATOR'}
        </span>
      </div>
      <div className="growth-track">
        <div className="growth-fill" style={{ width: `${next ? pct : 100}%` }} />
      </div>
    </div>
  );
}
