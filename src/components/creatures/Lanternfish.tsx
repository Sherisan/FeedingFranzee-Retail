import { useId } from 'react';
import { fishWrapperProps, type FishProps } from '../fish/FishProps';

const PHOTOPHORES: Array<[number, number, number]> = [
  [100, 92, 5], [120, 96, 4.5], [140, 98, 5], [160, 97, 4], [178, 94, 4.5], [195, 89, 3.5], [210, 84, 3],
];

/** Ambient deep-sea decoration — small fish with a row of glowing photophores. */
export function Lanternfish(props: FishProps) {
  const uid = useId();
  const body = `lantBody${uid}`;
  const eye = `lantEye${uid}`;
  const glow = `lantGlow${uid}`;
  return (
    <div {...fishWrapperProps(props, 500)}>
      <svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg" aria-label="Lanternfish">
        <defs>
          <linearGradient id={body} x1="50" y1="33" x2="50" y2="127" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1B3A5C" />
            <stop offset="0.5" stopColor="#0F2844" />
            <stop offset="1" stopColor="#162D50" />
          </linearGradient>
          <radialGradient id={eye} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(75 72) scale(14)">
            <stop stopColor="white" />
            <stop offset="0.3" stopColor="#39FF14" />
            <stop offset="1" stopColor="#006400" />
          </radialGradient>
          <radialGradient id={glow}>
            <stop stopColor="#39FF14" />
            <stop offset="0.6" stopColor="#00FF41" stopOpacity="0.5" />
            <stop offset="1" stopColor="#006400" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(280,0) scale(-1,1)">
          <g className="f-tail" style={{ transformOrigin: '240px 80px' }}>
            <path d="M240 70C260 53.3333 269.333 53.3333 268 70C272.667 76.6667 272.667 83.3333 268 90C269.333 106.667 260 106.667 240 90" fill="#162D50" stroke="#39FF14" strokeOpacity="0.4" strokeWidth="0.8" />
          </g>
          <g className="f-body">
            <path d="M50 80C50 53.3333 66.6667 38.3333 100 35C133.333 30.3333 163.333 33.6667 190 45C216.667 51.6667 233.333 61.6667 240 75C243.333 79.6667 243.333 84 240 88C233.333 99.3333 216.667 108.333 190 115C163.333 126.333 133.333 129.667 100 125C66.6667 121.667 50 106.667 50 80Z" fill={`url(#${body})`} stroke="#1B4F72" />
            <path d="M120 38C116.667 22.6667 121.667 17.3333 135 22C145 24 151.667 28.3333 155 35" fill="#162D50" stroke="#39FF14" strokeOpacity="0.4" strokeWidth="0.8" />
            <g className="f-pect" style={{ transformOrigin: '105px 118px' }}>
              <path d="M110 100C96.6667 113.333 91.6667 125 95 135C101.667 130.333 108.333 122.667 115 112" fill="#162D50" stroke="#39FF14" strokeOpacity="0.4" strokeWidth="0.8" />
            </g>
            <path d="M175 115C173 128.333 176.333 133.333 185 130C189.667 126.667 191.333 120.667 190 112" fill="#162D50" stroke="#39FF14" strokeOpacity="0.4" strokeWidth="0.8" />
            <path opacity="0.5" d="M70 95C103.333 108.333 146.667 110 200 100" stroke="#1B4F72" />
            <circle cx="75" cy="72" r="14" fill={`url(#${eye})`} />
            <circle cx="75" cy="72" r="6" fill="#0D1B2A" />
            <circle opacity="0.8" cx="71" cy="68" r="2.5" fill="white" />
            {PHOTOPHORES.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${glow})`} />
            ))}
            <path opacity="0.5" d="M52 82C49.3333 79.3333 49.3333 76.6667 52 74" stroke="#39FF14" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
