import { useId } from 'react';
import { fishWrapperProps, type FishProps } from '../fish/FishProps';

const ARMS: Array<{ d: string; width: number }> = [
  { d: 'M75 145C68.3333 175 66.6666 200 70 220C63.3333 240 61.6666 260 65 280C60.3333 293.333 59.3333 306.667 62 320', width: 4 },
  { d: 'M85 148C81.6667 179.333 81.6667 205 85 225C80.3334 245 79.3334 265 82 285C78 301.667 77.3334 316.667 80 330', width: 3.5 },
  { d: 'M95 150C93 183.333 93 210 95 230C91.6667 250 91.3334 270 94 290C91.3334 306.667 90.6667 321.667 92 335', width: 3 },
  { d: 'M105 150C107 183.333 107 210 105 230C108.333 250 108.667 270 106 290C108.667 306.667 109.333 321.667 108 335', width: 3 },
  { d: 'M115 148C118.333 179.333 118.333 205 115 225C119.667 245 120.667 265 118 285C122 301.667 122.667 316.667 120 330', width: 3.5 },
  { d: 'M125 145C131.667 175 133.333 200 130 220C136.667 240 138.333 260 135 280C139.667 293.333 140.667 306.667 138 320', width: 4 },
];

const PHOTOPHORES: Array<[number, number, number]> = [
  [85, 50, 6], [115, 45, 5], [100, 70, 7], [75, 80, 4], [125, 78, 4.5], [95, 30, 3], [110, 95, 3],
];

/** Ambient drifter — glowing mantle with trailing arms. Vertical orientation, no left/right facing. */
export function BioluminescentSquid(props: FishProps) {
  const uid = useId();
  const mantle = `sqMantle${uid}`;
  const eye = `sqEye${uid}`;
  const glow = `sqGlow${uid}`;
  const arm = `sqArm${uid}`;
  return (
    <div {...fishWrapperProps(props, 1360)}>
      <svg viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg" aria-label="Bioluminescent squid">
        <defs>
          <linearGradient id={mantle} x1="52.5" y1="10" x2="52.5" y2="145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A0533" />
            <stop offset="0.5" stopColor="#2D1B69" />
            <stop offset="1" stopColor="#1A0533" />
          </linearGradient>
          <radialGradient id={eye} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) scale(12 12)">
            <stop stopColor="white" />
            <stop offset="0.3" stopColor="#FF6EC7" />
            <stop offset="1" stopColor="#8B008B" />
          </radialGradient>
          <radialGradient id={glow}>
            <stop stopColor="#FF1493" stopOpacity="0.8" />
            <stop offset="0.6" stopColor="#FF69B4" stopOpacity="0.3" />
            <stop offset="1" stopColor="#FF1493" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={arm} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#2D1B69" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FF1493" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g className="f-bell">
          <path d="M100 10C126.667 10 141.667 20 145 40C148.333 66.6667 148.333 93.3333 145 120C141.667 133.333 126.667 141.667 100 145C73.3333 141.667 58.3333 133.333 55 120C51.6667 93.3333 51.6667 66.6667 55 40C58.3333 20 73.3333 10 100 10Z" fill={`url(#${mantle})`} stroke="#6A0DAD" />
          <path d="M55 50C35 63.3333 30 78.3333 40 95C46.6667 88.3333 51.6667 83.3333 55 80" fill="#2D1B69" stroke="#FF1493" strokeOpacity="0.4" strokeWidth="0.8" />
          <path d="M145 50C165 63.3333 170 78.3333 160 95C153.333 88.3333 148.333 83.3333 145 80" fill="#2D1B69" stroke="#FF1493" strokeOpacity="0.4" strokeWidth="0.8" />
          <circle cx="80" cy="110" r="12" fill={`url(#${eye})`} />
          <circle cx="80" cy="110" r="4" fill="#1A0533" />
          <circle cx="120" cy="110" r="12" fill={`url(#${eye})`} />
          <circle cx="120" cy="110" r="4" fill="#1A0533" />
          {PHOTOPHORES.map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${glow})`} />
          ))}
        </g>
        <g className="f-tentacles">
          {ARMS.map((a, i) => (
            <path key={i} d={a.d} stroke={`url(#${arm})`} strokeWidth={a.width} strokeLinecap="round" />
          ))}
          <path opacity="0.5" d="M90 148C76.6667 189.333 71.6667 226.667 75 260C65 280 58.3333 296.667 55 310C50.3333 316.667 47 321.667 45 325" stroke="#FF1493" strokeWidth="1.5" strokeLinecap="round" />
          <path opacity="0.5" d="M110 148C123.333 189.333 128.333 226.667 125 260C135 280 141.667 296.667 145 310C149.667 316.667 153 321.667 155 325" stroke="#FF1493" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
