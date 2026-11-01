import { useEffect, useState } from 'react';
import type { GameState } from '../game/useGameState';
import { ClownfishFish } from './fish/ClownfishFish';
import seabedUrl from '../assets/seabed.png';
import lightraysUrl from '../assets/lightrays.png';

/** Shortest time the splash stays up, so it never just flickers. */
const MIN_SHOW_MS = 1600;
/** Give up waiting on the server after this long — the game shows its own offline state. */
const MAX_WAIT_MS = 10000;
const FADE_MS = 600;

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = url;
  });
}

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: 6 + ((i * 7) % 14),
  delay: `${(i * 0.45) % 5}s`,
  duration: `${5 + ((i * 3) % 5)}s`,
}));

/**
 * Full-screen loading splash. Takes over from the static boot splash in
 * index.html once the bundle has run, and stays up until the big arena art
 * and fonts are loaded and the game server connection has settled (online,
 * or given up) — then fades out over the live game.
 */
export function SplashScreen({ state }: { state: Pick<GameState, 'conn' | 'roundId'> }) {
  const [assetsDone, setAssetsDone] = useState(0);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.getElementById('boot-splash')?.remove();

    const tasks = [preloadImage(seabedUrl), preloadImage(lightraysUrl), document.fonts.ready];
    let alive = true;
    tasks.forEach((t) => t.then(() => alive && setAssetsDone((n) => n + 1)));

    const min = setTimeout(() => setMinElapsed(true), MIN_SHOW_MS);
    const max = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => {
      alive = false;
      clearTimeout(min);
      clearTimeout(max);
    };
  }, []);

  const assetsReady = assetsDone >= 3;
  const connected = state.conn === 'online' && state.roundId != null;
  const connSettled = connected || state.conn === 'offline' || timedOut;
  const ready = assetsReady && connSettled && minElapsed;

  useEffect(() => {
    if (!ready) return;
    setFading(true);
    const t = setTimeout(() => setGone(true), FADE_MS);
    return () => clearTimeout(t);
  }, [ready]);

  if (gone) return null;

  // 15% for the bundle having loaded at all, assets 15% each, server the rest.
  const progress = 15 + assetsDone * 15 + (connSettled ? 40 : 0);
  const status = !assetsReady
    ? 'Loading the reef…'
    : !connSettled
      ? 'Connecting to game server…'
      : 'Let’s feed!';

  return (
    <div className={`splash ${fading ? 'splash-out' : ''}`} role="status" aria-live="polite">
      <div className="splash-bubbles" aria-hidden>
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      <div className="splash-center">
        <div className="splash-fish">
          <ClownfishFish width={160} wagMs={420} />
        </div>
        <h1 className="splash-title">
          <span>FEEDING</span>
          <span className="splash-title-accent">FRANZEE</span>
        </h1>
        <div className="splash-bar">
          <div className="splash-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="splash-status">{status}</p>
      </div>
    </div>
  );
}
