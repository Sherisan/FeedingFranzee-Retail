import { useId } from 'react';
import { fishWrapperProps, type FishProps } from '../fish/FishProps';

const DORSAL_SPIKES: Array<[number, number, number, number]> = [
  [100, 95, 85, 15], [115, 90, 105, 10], [130, 88, 125, 8], [145, 87, 143, 12],
  [160, 88, 160, 15], [175, 90, 178, 18], [190, 93, 195, 22],
];
const FAN_SPIKES: Array<[number, number, number, number]> = [
  [95, 130, 45, 200], [95, 130, 35, 190], [95, 130, 30, 178], [95, 130, 28, 165],
  [205, 130, 255, 200], [205, 130, 265, 190], [205, 130, 270, 178], [205, 130, 272, 165],
];
const VENTRAL_RAYS: Array<[number, number, number, number]> = [
  [120, 165, 115, 210], [140, 168, 138, 215], [160, 168, 162, 215],
];

/** Ambient reef decoration — venomous spiky fin rays fanning out from a striped body. */
export function Lionfish(props: FishProps) {
  const uid = useId();
  const body = `lionBody${uid}`;
  const spike = `lionSpike${uid}`;
  const fan = `lionFan${uid}`;
  const eye = `lionEye${uid}`;
  return (
    <div {...fishWrapperProps(props, 780)}>
      <svg viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" aria-label="Lionfish">
        <defs>
          <linearGradient id={spike} x1="0" y1="1" x2="0" y2="0">
            <stop stopColor="#DC143C" />
            <stop offset="1" stopColor="#FF6347" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id={fan} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#DC143C" />
            <stop offset="0.5" stopColor="#8B0000" />
            <stop offset="1" stopColor="#FF4500" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={body} x1="80" y1="80" x2="220" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B0000" />
            <stop offset="0.5" stopColor="#DC143C" />
            <stop offset="1" stopColor="#8B0000" />
          </linearGradient>
          <radialGradient id={eye} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(95 115) scale(10)">
            <stop stopColor="white" />
            <stop offset="0.3" stopColor="#FFD700" />
            <stop offset="1" stopColor="#B8860B" />
          </radialGradient>
        </defs>
        <g transform="translate(300,0) scale(-1,1)">
          <g className="f-tail" style={{ transformOrigin: '234px 125px' }}>
            <path d="M218 115C236 105 246.667 105 250 115C253.333 121.667 253.333 128.333 250 135C246.667 145 236 145 218 135" fill="#8B0000" stroke="#DC143C" />
          </g>
          <g className="f-body">
            {DORSAL_SPIKES.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${spike})`} strokeWidth="2" strokeLinecap="round" />
            ))}
            <path opacity="0.25" d="M85 15C91.6667 41.6667 98.3333 40 105 10C108.333 36.6667 115 36 125 8C128.333 36 134.333 37.3333 143 12C146.333 40.6667 152 41.6667 160 15C162 41.6667 168 42.6667 178 18C181.333 44.6667 187 46 195 22C193.667 47.3333 192 71 190 93" fill="#8B0000" />
            <g className="f-pect" style={{ transformOrigin: '95px 130px' }}>
              {FAN_SPIKES.slice(0, 4).map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${fan})`} strokeWidth={2.5 - i * 0.3} strokeLinecap="round" />
              ))}
            </g>
            {FAN_SPIKES.slice(4).map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${fan})`} strokeWidth={2.5 - i * 0.3} strokeLinecap="round" />
            ))}
            <path d="M150 170C188.66 170 220 149.853 220 125C220 100.147 188.66 80 150 80C111.34 80 80 100.147 80 125C80 149.853 111.34 170 150 170Z" fill={`url(#${body})`} />
            {[95, 115, 135, 155, 175, 195].map((x, i) => (
              <path key={x} opacity={0.6 - i * 0.02} d={`M${x} ${105 - i}C${x + 2} ${125} ${x + 2} ${145} ${x} ${157 - i * 0.3}`} stroke="#FFDAB9" strokeWidth={3 - i * 0.1} strokeLinecap="round" />
            ))}
            <circle cx="95" cy="115" r="10" fill={`url(#${eye})`} />
            <circle cx="95" cy="115" r="4" fill="#1A0000" />
            <circle opacity="0.7" cx="92" cy="112" r="2" fill="white" />
            <path opacity="0.5" d="M85 105C91.6667 101.667 98.3333 101.667 105 105" stroke="#1A0000" strokeWidth="2" strokeLinecap="round" />
            <path opacity="0.5" d="M85 125C91.6667 128.333 98.3333 128.333 105 125" stroke="#1A0000" strokeWidth="2" strokeLinecap="round" />
            {VENTRAL_RAYS.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${spike})`} strokeWidth="1.5" strokeLinecap="round" />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
