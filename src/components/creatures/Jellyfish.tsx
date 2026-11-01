import { useId } from 'react';
import { fishWrapperProps, type FishProps } from '../fish/FishProps';

const TENTACLES: Array<{ d: string; opacity: number; width: number; grad: boolean }> = [
  { d: 'M80 115C76.6666 141.667 78.3333 163.333 85 180C80.3333 193.333 81.3333 206.667 88 220C84 233.333 84.6666 246.667 90 260', opacity: 0.7, width: 5, grad: true },
  { d: 'M100 118C96.6666 146 98.3333 168.333 105 185C100.333 201.667 101.333 218.333 108 235C104 248.333 104.667 261.667 110 275', opacity: 0.65, width: 5, grad: true },
  { d: 'M120 118C123.333 146 121.667 168.333 115 185C119.667 201.667 118.667 218.333 112 235C116 248.333 115.333 263.333 110 280', opacity: 0.65, width: 5, grad: true },
  { d: 'M140 115C143.333 141.667 141.667 163.333 135 180C139.667 193.333 138.667 206.667 132 220C136 233.333 135.333 246.667 130 260', opacity: 0.7, width: 5, grad: true },
];

/** Ambient drifter — pulsing bell with long trailing tentacles. Vertical orientation, no left/right facing. */
export function Jellyfish(props: FishProps) {
  const uid = useId();
  const bell = `jellyBell${uid}`;
  const core = `jellyCore${uid}`;
  const tent = `jellyTent${uid}`;
  return (
    <div {...fishWrapperProps(props, 2560)}>
      <svg viewBox="0 0 220 320" xmlns="http://www.w3.org/2000/svg" aria-label="Jellyfish">
        <defs>
          <radialGradient id={bell} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 50.3) scale(96 60.5)">
            <stop stopColor="#DA70D6" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#9B30FF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#4B0082" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id={core} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(110 62) scale(40 32)">
            <stop stopColor="#FF69B4" stopOpacity="0.6" />
            <stop offset="1" stopColor="#9B30FF" stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id={tent} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#DA70D6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#7DF9FF" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <g className="f-bell">
          <path d="M30 110C30 50 56.6667 20 110 20C163.333 20 190 50 190 110C176.667 116.667 163.333 118.333 150 115C136.667 121.667 123.333 122.667 110 118C96.6667 122.667 83.3333 121.667 70 115C56.6667 118.333 43.3333 116.667 30 110Z" fill={`url(#${bell})`} stroke="#DA70D6" strokeOpacity="0.5" />
          <path d="M110 110C137.614 110 160 92.0914 160 70C160 47.9086 137.614 30 110 30C82.3858 30 60 47.9086 60 70C60 92.0914 82.3858 110 110 110Z" fill={`url(#${core})`} />
          <path opacity="0.4" d="M70 50C76.6667 40 86.6667 36.6667 100 40" stroke="#FF69B4" strokeWidth="1.5" strokeLinecap="round" />
          <path opacity="0.3" d="M60 70C66.6667 60 75 56.6667 85 60" stroke="#FF69B4" strokeLinecap="round" />
        </g>
        <g className="f-tentacles">
          {TENTACLES.map((t, i) => (
            <path key={i} opacity={t.opacity} d={t.d} stroke={`url(#${tent})`} strokeWidth={t.width} strokeLinecap="round" />
          ))}
          <path opacity="0.35" d="M65 112C58.3333 144 56.6667 173.333 60 200C53.3333 226.667 52.6667 253.333 58 280C54 293.333 53 303.333 55 310" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" />
          <path opacity="0.3" d="M90 120C84.6667 153.333 84 183.333 88 210C82.6667 236.667 81.6667 263.333 85 290C81.6667 300 80.6667 308.333 82 315" stroke="#DA70D6" strokeWidth="1.2" strokeLinecap="round" />
          <path opacity="0.3" d="M130 120C135.333 153.333 136 183.333 132 210C137.333 236.667 138.333 263.333 135 290C138.333 300 139.333 308.333 138 315" stroke="#DA70D6" strokeWidth="1.2" strokeLinecap="round" />
          <path opacity="0.35" d="M155 112C161.667 144 163.333 173.333 160 200C166.667 226.667 167.333 253.333 162 280C166 293.333 167 303.333 165 310" stroke="#7DF9FF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
