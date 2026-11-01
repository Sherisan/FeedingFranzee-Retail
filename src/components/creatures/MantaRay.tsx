import { useId } from 'react';
import { fishWrapperProps, type FishProps } from '../fish/FishProps';

/** Ambient glider — top-down manta ray, wings rocking gently instead of a tail-wag. */
export function MantaRay(props: FishProps) {
  const uid = useId();
  const body = `mantaBody${uid}`;
  const under = `mantaUnder${uid}`;
  const glow1 = `mantaGlow1${uid}`;
  const glow2 = `mantaGlow2${uid}`;
  return (
    <div {...fishWrapperProps(props, 1600)}>
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-label="Manta ray">
        <defs>
          <linearGradient id={body} x1="15" y1="43.6" x2="15" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A1A3E" />
            <stop offset="1" stopColor="#0D0D2B" />
          </linearGradient>
          <linearGradient id={under} x1="70" y1="92" x2="70" y2="115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2A2A5E" />
            <stop offset="1" stopColor="#1A1A3E" />
          </linearGradient>
          <radialGradient id={glow1}>
            <stop stopColor="#7B68EE" stopOpacity="0.4" />
            <stop offset="1" stopColor="#4B0082" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={glow2}>
            <stop stopColor="#7B68EE" stopOpacity="0.4" />
            <stop offset="1" stopColor="#4B0082" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="f-glide">
          <path d="M160 60C120 40 73.3333 38.3333 20 55C13.3333 61.6667 13.3333 70 20 80C46.6667 93.3333 80 98.3333 120 95C133.333 93.6667 146.667 95.3333 160 100C173.333 95.3333 186.667 93.6667 200 95C240 98.3333 273.333 93.3333 300 80C306.667 70 306.667 61.6667 300 55C246.667 38.3333 200 40 160 60Z" fill={`url(#${body})`} stroke="#4B0082" />
          <path opacity="0.6" d="M160 100C146.667 95.3333 133.333 93.6667 120 95C100 97 83.3333 96 70 92C90 100.667 110 106 130 108C143.333 109.333 153.333 111.667 160 115C166.667 111.667 176.667 109.333 190 108C210 106 230 100.667 250 92C236.667 96 220 97 200 95C186.667 93.6667 173.333 95.3333 160 100Z" fill={`url(#${under})`} />
          <path d="M160 115C158.667 135 157 155 155 175C156.333 178.333 158 179.333 160 178C162 179.333 163.667 178.333 165 175C163 155 161.333 135 160 115Z" fill="#0D0D2B" stroke="#4B0082" strokeWidth="0.8" />
          <path d="M145 65C141.667 51.6667 138.333 41.6667 135 35C137 38.3333 139.333 43.3333 142 50C142.667 55.3333 143.667 60.3333 145 65Z" fill="#1A1A3E" stroke="#7B68EE" strokeOpacity="0.5" strokeWidth="0.8" />
          <path d="M175 65C178.333 51.6667 181.667 41.6667 185 35C183 38.3333 180.667 43.3333 178 50C177.333 55.3333 176.333 60.3333 175 65Z" fill="#1A1A3E" stroke="#7B68EE" strokeOpacity="0.5" strokeWidth="0.8" />
          <circle cx="130" cy="72" r="5" fill="#1A1A3E" stroke="#7B68EE" strokeWidth="1.5" />
          <circle cx="130" cy="72" r="2" fill="#7B68EE" />
          <circle cx="190" cy="72" r="5" fill="#1A1A3E" stroke="#7B68EE" strokeWidth="1.5" />
          <circle cx="190" cy="72" r="2" fill="#7B68EE" />
          <circle cx="80" cy="70" r="8" fill={`url(#${glow1})`} />
          <circle cx="50" cy="65" r="6" fill={`url(#${glow1})`} />
          <circle cx="240" cy="70" r="8" fill={`url(#${glow2})`} />
          <circle cx="270" cy="65" r="6" fill={`url(#${glow2})`} />
          {[110, 160, 210].map((x, i) => (
            <circle key={x} opacity={0.25 - i * 0.02} cx={x} cy={83 + (i % 2)} r="1.6" fill="#7B68EE" />
          ))}
          <path opacity="0.2" d="M20 55C73.3333 38.3333 120 40 160 60" stroke="#7B68EE" />
          <path opacity="0.2" d="M160 60C200 40 246.667 38.3333 300 55" stroke="#7B68EE" />
        </g>
      </svg>
    </div>
  );
}
