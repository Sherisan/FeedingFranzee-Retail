import { useId } from 'react';

/** Naval-mine bomb swimmer — touching it kills the player's fish. */
export function Mine({ width = 46 }: { width?: number }) {
  const uid = useId();
  const body = `mine${uid}`;
  const spikes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    const x1 = 50 + Math.cos(angle) * 30;
    const y1 = 50 + Math.sin(angle) * 30;
    const x2 = 50 + Math.cos(angle) * 46;
    const y2 = 50 + Math.sin(angle) * 46;
    return { x1, y1, x2, y2, key: i };
  });
  return (
    <svg viewBox="0 0 100 100" width={width} className="mine" aria-label="mine">
      <defs>
        <radialGradient id={body} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#3d4f60" />
          <stop offset="0.6" stopColor="#1c2833" />
          <stop offset="1" stopColor="#0a1219" />
        </radialGradient>
      </defs>
      {spikes.map((s) => (
        <line key={s.key} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#2a3745" strokeWidth="7" strokeLinecap="round" />
      ))}
      <circle cx="50" cy="50" r="31" fill={`url(#${body})`} />
      <circle cx="41" cy="40" r="9" fill="rgba(255,255,255,0.14)" />
      <circle cx="50" cy="50" r="7" className="mine-light" fill="#ff2d3e" />
    </svg>
  );
}
