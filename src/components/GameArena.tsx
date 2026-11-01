import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import {
  FISH_TIERS,
  playerScale,
  predatorForMultiplier,
  tierForMultiplier,
  type FishTier,
  type Species,
} from '../game/fishTiers';
import { msToMultiplier } from '../game/multiplier';
import { swimmerPosition, TIER_BOOSTS, type SpawnEvent } from '../game/spawnSchedule';
import type { GameActions, GameState } from '../game/useGameState';
import type { LiveClock } from '../game/useLiveClock';
import { Fish } from './fish/Fish';
import { Mine } from './Mine';
import { Anglerfish } from './creatures/Anglerfish';
import { Lanternfish } from './creatures/Lanternfish';
import { Lionfish } from './creatures/Lionfish';
import { Jellyfish } from './creatures/Jellyfish';
import { BioluminescentSquid } from './creatures/BioluminescentSquid';
import { MantaRay } from './creatures/MantaRay';
import seabedUrl from '../assets/seabed.png';
import lightraysUrl from '../assets/lightrays.png';
import skeletonUrl from '../assets/fish/skeleton.svg';

const SLOTS = [0, 1];
const HOME = { x: 50, y: 50 };
/** Player sprite width in px at scale 1 (before growth scaling). */
const PLAYER_PX = 190;
/** Swimmer sprite width in px by tier (sardine → tuna), at scale 1. */
const TIER_PX = [44, 56, 72, 94];
const MINE_PX = 46;
const SPECIES_BY_TIER: Species[] = ['sardine', 'clownfish', 'grouper', 'tuna'];
/** Spring stiffness (1/s) — higher follows the pointer more tightly. */
const FOLLOW_OMEGA = 7.5;
/** Fish sits this far above a finger on touch screens so it isn't hidden. */
const TOUCH_LIFT_PX = 70;

interface Floatie {
  key: number;
  x: number;
  y: number;
  text: string;
}

interface Motion {
  /** Position in arena percent. */
  x: number;
  y: number;
  /** Velocity in px/s. */
  vx: number;
  vy: number;
  /** 1 = facing right, -1 = facing left. */
  face: 1 | -1;
  /** Body tilt in degrees (nose down positive). */
  tilt: number;
}

let floatieKey = 0;

/** Arena size → one scale factor for every sprite, so phones and 4K screens both look right. */
function useArenaScale(ref: RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.min(1.25, Math.max(0.5, Math.min(width / 1280, height / 760))));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

/**
 * Fullscreen underwater canvas. Two ways to play:
 * - passive: classic crash game, the fish idles near the centre;
 * - interactive: move the mouse (or drag a finger) to steer the fish — eat
 *   smaller swimmers for multiplier boosts, dodge the mines.
 */
export function GameArena({
  state,
  live,
  schedule,
  actions,
}: {
  state: GameState;
  live: LiveClock;
  schedule: SpawnEvent[] | null;
  actions: GameActions;
}) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const scale = useArenaScale(arenaRef);
  const tier = tierForMultiplier(live.multiplier);
  const playerTierIdx = FISH_TIERS.indexOf(tier);
  // One shared fish serves both bet slots — steerable as long as either slot
  // still has a live, uncashed bet riding this round.
  const hasLiveBet = SLOTS.some((s) => {
    const b = state.myBets[s];
    return b != null && b.cashedOutAt == null && !b.lost;
  });

  // Evolution flash when the player fish levels up mid-flight.
  const prevSpecies = useRef(tier.species);
  const [evolved, setEvolved] = useState<FishTier | null>(null);
  useEffect(() => {
    if (state.phase !== 'flying') {
      prevSpecies.current = 'clownfish';
      return;
    }
    if (tier.species !== prevSpecies.current) {
      prevSpecies.current = tier.species;
      setEvolved(tier);
      const timer = setTimeout(() => setEvolved(null), 1700);
      return () => clearTimeout(timer);
    }
  }, [tier, state.phase]);

  // ── Interactive control ────────────────────────────────────────────
  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const motion = useRef<Motion>({ ...HOME, vx: 0, vy: 0, face: 1, tilt: 0 });
  const [engaged, setEngaged] = useState(false);
  const engagedRef = useRef(false);
  engagedRef.current = engaged;
  const [steered, setSteered] = useState(false);
  const eatenRef = useRef<Set<number>>(new Set());
  const [floaties, setFloaties] = useState<Floatie[]>([]);
  const [boom, setBoom] = useState<{ x: number; y: number } | null>(null);
  const [deathPos, setDeathPos] = useState<{ x: number; y: number } | null>(null);
  // Witnessed locally the instant a mine collision is detected — independent
  // of per-slot server state, since only one fish is ever on screen.
  const [fishDead, setFishDead] = useState(false);
  const canInteract = state.phase === 'flying' && hasLiveBet && !fishDead;

  // Fresh arena state each round.
  useEffect(() => {
    eatenRef.current = new Set();
    targetRef.current = null;
    motion.current = { ...HOME, vx: 0, vy: 0, face: 1, tilt: 0 };
    setFishDead(false);
    setEngaged(false);
    setSteered(false);
    setFloaties([]);
    setBoom(null);
    setDeathPos(null);
  }, [state.roundId]);

  /** Swimmable box in arena percent — below the top bar, above the bet panel. */
  const bounds = useCallback(() => {
    const arena = arenaRef.current?.getBoundingClientRect();
    const hud = document.querySelector('.hud-bar')?.getBoundingClientRect();
    let maxY = 90;
    if (arena && hud && arena.height > 0) {
      maxY = Math.min(90, ((hud.top - arena.top) / arena.height) * 100 - 6);
    }
    return { minX: 5, maxX: 95, minY: 16, maxY: Math.max(30, maxY) };
  }, []);

  const onPointer = useCallback(
    (e: ReactPointerEvent) => {
      if (!canInteract) return;
      const rect = arenaRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Touch: only steer while the finger is down; keep the fish above it.
      if (e.pointerType === 'touch' && e.buttons === 0 && e.type !== 'pointerdown') return;
      const lift = e.pointerType === 'touch' ? TOUCH_LIFT_PX : 0;
      const b = bounds();
      targetRef.current = {
        x: Math.min(b.maxX, Math.max(b.minX, ((e.clientX - rect.left) / rect.width) * 100)),
        y: Math.min(b.maxY, Math.max(b.minY, ((e.clientY - lift - rect.top) / rect.height) * 100)),
      };
      setEngaged(true);
      setSteered(true);
    },
    [canInteract, bounds],
  );
  const disengage = useCallback(() => setEngaged(false), []);

  // Everything the animation loop needs, refreshed every render.
  const latest = useRef({ canInteract, schedule, flyingAnchor: state.flyingAnchor, scale, actions });
  latest.current = { canInteract, schedule, flyingAnchor: state.flyingAnchor, scale, actions };

  // ── Movement + collision loop ──────────────────────────────────────
  // Spring-follow toward the pointer, frame-rate independent; the fish turns
  // to face where it's swimming and pitches up/down with its vertical speed.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const rect = arenaRef.current?.getBoundingClientRect();
      const L = latest.current;
      const m = motion.current;
      if (rect && rect.width > 0) {
        const b = bounds();
        let target = L.canInteract ? targetRef.current : null;
        if (!target) {
          // Idle: lazy figure-of-eight around the centre.
          const t = now / 1000;
          target = { x: HOME.x + Math.sin(t * 0.45) * 6, y: HOME.y + Math.sin(t * 0.9) * 3 };
        }
        const tx = Math.min(b.maxX, Math.max(b.minX, target.x));
        const ty = Math.min(b.maxY, Math.max(b.minY, target.y));

        // Critically-damped spring in px space.
        const dxPx = ((tx - m.x) / 100) * rect.width;
        const dyPx = ((ty - m.y) / 100) * rect.height;
        const w = FOLLOW_OMEGA;
        m.vx += (w * w * dxPx - 2 * w * m.vx) * dt;
        m.vy += (w * w * dyPx - 2 * w * m.vy) * dt;
        const maxSpeed = 1500 * L.scale;
        const speed = Math.hypot(m.vx, m.vy);
        if (speed > maxSpeed) {
          m.vx *= maxSpeed / speed;
          m.vy *= maxSpeed / speed;
        }
        m.x += ((m.vx * dt) / rect.width) * 100;
        m.y += ((m.vy * dt) / rect.height) * 100;

        // Turn around with a little hysteresis so it doesn't flicker.
        const turnAt = 35 * L.scale;
        if (m.vx > turnAt) m.face = 1;
        else if (m.vx < -turnAt) m.face = -1;
        // Pitch only kicks in at real swimming speed, so a gentle idle drift stays level.
        const pitch = (Math.atan2(m.vy, Math.max(Math.abs(m.vx), 220 * L.scale)) * 180) / Math.PI;
        const goal = Math.max(-32, Math.min(32, pitch));
        m.tilt += (goal - m.tilt) * Math.min(1, dt * 8);

        // Collisions only while the player is actively steering a live bet —
        // a hands-off player plays the classic crash game and can't hit a mine.
        if (L.canInteract && engagedRef.current && L.schedule && L.flyingAnchor != null) {
          const elapsed = now - L.flyingAnchor;
          const mult = msToMultiplier(elapsed);
          const tierIdx = FISH_TIERS.indexOf(tierForMultiplier(mult));
          const px = (m.x / 100) * rect.width;
          const py = (m.y / 100) * rect.height;
          const playerR = PLAYER_PX * L.scale * playerScale(mult) * 0.22;
          for (const ev of L.schedule) {
            if (eatenRef.current.has(ev.id)) continue;
            const pos = swimmerPosition(ev, elapsed);
            if (!pos) continue;
            const size = (ev.isBomb ? MINE_PX : TIER_PX[ev.tier]) * L.scale;
            const dist = Math.hypot(px - (pos.x / 100) * rect.width, py - (pos.y / 100) * rect.height);
            if (dist > playerR + size * 0.33) continue;

            if (ev.isBomb) {
              eatenRef.current.add(ev.id);
              setBoom({ x: pos.x, y: pos.y });
              setDeathPos({ x: m.x, y: m.y });
              setFishDead(true);
              // Notify both slots — the server only actually kills whichever ones
              // still have a live bet, so this is safe even if only one is active.
              SLOTS.forEach((s) => L.actions.bombHit(s, ev.id));
              break;
            }
            if (ev.tier < tierIdx) {
              eatenRef.current.add(ev.id);
              setFloaties((f) => [
                ...f.slice(-5),
                { key: ++floatieKey, x: pos.x, y: pos.y, text: `+${TIER_BOOSTS[ev.tier].toFixed(2)}x` },
              ]);
              SLOTS.forEach((s) => L.actions.eatFish(s, ev.id));
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bounds]);

  // Expire boost floaties.
  useEffect(() => {
    if (floaties.length === 0) return;
    const timer = setTimeout(() => setFloaties((f) => f.slice(1)), 900);
    return () => clearTimeout(timer);
  }, [floaties]);

  // Live swimmers for this frame (App re-renders ~60fps via the live clock).
  const elapsedMs =
    state.phase === 'flying' && state.flyingAnchor != null
      ? performance.now() - state.flyingAnchor
      : -1;
  const swimmers =
    schedule && elapsedMs >= 0
      ? schedule
          .filter((ev) => !eatenRef.current.has(ev.id))
          .map((ev) => ({ ev, pos: swimmerPosition(ev, elapsedMs) }))
          .filter((s): s is { ev: SpawnEvent; pos: { x: number; y: number } } => s.pos != null)
      : [];

  // Ambient dressing (non-interactive, pure decoration).
  const drifters = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        top: 12 + ((i * 41) % 60),
        scale: 0.3 + ((i * 13) % 10) / 24,
        duration: 18 + ((i * 7) % 14),
        delay: -((i * 5) % 17),
        opacity: 0.22 + ((i * 11) % 10) / 40,
      })),
    [],
  );
  const bubbles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: (i * 29 + 7) % 96,
        size: 3 + ((i * 17) % 9),
        duration: 7 + ((i * 13) % 10),
        delay: -((i * 3) % 11),
      })),
    [],
  );

  const crashed = state.phase === 'crashed' && state.lastCrash;
  const predator = crashed ? predatorForMultiplier(state.lastCrash!.multiplier) : null;
  const showPlayer = state.phase !== 'crashed' && !fishDead;
  const m = motion.current;
  const s = scale;

  return (
    <div
      ref={arenaRef}
      className={`underwater ${state.phase === 'crashed' || boom ? 'shake' : ''} ${canInteract ? 'steerable' : ''}`}
      onPointerDown={onPointer}
      onPointerMove={onPointer}
      onPointerLeave={disengage}
      onPointerUp={(e) => e.pointerType === 'touch' && disengage()}
      onPointerCancel={disengage}
    >
      <img className="uw-rays" src={lightraysUrl} alt="" aria-hidden />
      <img className="uw-seabed" src={seabedUrl} alt="" aria-hidden />

      <div className="uw-bubbles" aria-hidden>
        {bubbles.map((b, i) => (
          <span
            key={i}
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Deep-background decoration — no gameplay meaning, just atmosphere. */}
      <div className="uw-ambient" style={{ left: '6%', top: '38%', opacity: 0.4 }}>
        <Anglerfish width={130 * s} wagMs={900} />
      </div>
      <div className="uw-ambient" style={{ left: '80%', top: '10%', opacity: 0.32 }}>
        <MantaRay width={190 * s} wagMs={1400} />
      </div>
      <div className="uw-ambient" style={{ left: '68%', top: '40%', opacity: 0.4 }}>
        <Lionfish width={95 * s} wagMs={620} />
      </div>
      <div className="uw-ambient" style={{ left: '12%', top: '18%', opacity: 0.38 }}>
        <Lanternfish width={60 * s} wagMs={520} />
      </div>
      <div className="uw-ambient" style={{ left: '90%', top: '30%', opacity: 0.45 }}>
        <Jellyfish width={46 * s} wagMs={700} />
      </div>
      <div className="uw-ambient" style={{ left: '48%', top: '6%', opacity: 0.4 }}>
        <BioluminescentSquid width={40 * s} wagMs={640} />
      </div>
      {drifters.map((d, i) => (
        <div
          key={i}
          className="uw-drifter"
          style={{
            top: `${d.top}%`,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        >
          <Fish species="sardine" width={(80 * d.scale + 30) * s} wagMs={380} />
        </div>
      ))}

      {/* Scheduled swimmers — same deterministic set the server validates. */}
      {swimmers.map(({ ev, pos }) => (
        <div
          key={ev.id}
          className={`swimmer ${!ev.isBomb && ev.tier < playerTierIdx ? 'edible' : ''} ${canInteract && ev.isBomb ? 'danger' : ''}`}
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          {ev.isBomb ? (
            <Mine width={MINE_PX * s} />
          ) : (
            <Fish
              species={SPECIES_BY_TIER[ev.tier]}
              width={TIER_PX[ev.tier] * s}
              wagMs={420 + ev.tier * 120}
              style={ev.dir === -1 ? { transform: 'scaleX(-1)' } : undefined}
            />
          )}
        </div>
      ))}

      {floaties.map((f) => (
        <span key={f.key} className="floatie" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
          {f.text}
        </span>
      ))}

      {boom && (
        <span className="boom" style={{ left: `${boom.x}%`, top: `${boom.y}%` }} />
      )}

      {showPlayer && (
        <div
          className={`player-fish ${engaged ? 'controlled' : ''}`}
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            transform: `translate(-50%, -50%) scale(${state.phase === 'flying' ? playerScale(live.multiplier) : 0.5})`,
          }}
        >
          <div
            className="player-fish-body"
            style={{ transform: `scaleX(${m.face}) rotate(${m.tilt.toFixed(1)}deg)` }}
          >
            <Fish species={state.phase === 'waiting' ? 'clownfish' : tier.species} width={PLAYER_PX * s} />
          </div>
          {evolved && <span className="evolve-ring" />}
        </div>
      )}

      {canInteract && !steered && (
        <div className="steer-hint">
          <span className="steer-hint-icon" aria-hidden>👆</span>
          Move or drag to steer · eat smaller fish · avoid mines
        </div>
      )}

      {(crashed || fishDead) && (
        <div
          className="player-skeleton"
          style={deathPos ? { left: `${deathPos.x}%`, top: `${deathPos.y}%` } : { left: `${m.x}%`, top: `${m.y}%` }}
        >
          <img src={skeletonUrl} width={110 * s} alt="" draggable={false} />
        </div>
      )}

      {evolved && (
        <div className="evolve-toast" style={{ color: evolved.accent }}>
          EVOLVED — {evolved.name.toUpperCase()} x{evolved.multiplier}
        </div>
      )}

      {crashed && predator && (
        <div className="predator-lunge" style={{ top: `${Math.max(20, m.y - 12)}%` }}>
          <Fish species={predator.species} width={430 * s} wagMs={260} className="flipped" />
        </div>
      )}
    </div>
  );
}
