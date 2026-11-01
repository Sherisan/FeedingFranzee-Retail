import { useId } from 'react';
import { fishWrapperProps, type FishProps } from '../fish/FishProps';

/** Ambient deep-sea decoration — glowing lure on a stalk, dark round body. */
export function Anglerfish(props: FishProps) {
  const uid = useId();
  const body = `anglBody${uid}`;
  const lure = `anglLure${uid}`;
  const eye = `anglEye${uid}`;
  return (
    <div {...fishWrapperProps(props, 900)}>
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" aria-label="Anglerfish">
        <defs>
          <radialGradient id={lure} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 26) scale(18)">
            <stop stopColor="#7DF9FF" />
            <stop offset="0.6" stopColor="#00CED1" stopOpacity="0.6" />
            <stop offset="1" stopColor="#00CED1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={body} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(133 98) scale(102 72)">
            <stop stopColor="#2A4858" />
            <stop offset="1" stopColor="#0D1B2A" />
          </radialGradient>
          <radialGradient id={eye} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(105 95) scale(12)">
            <stop stopColor="white" />
            <stop offset="0.4" stopColor="#7DF9FF" />
            <stop offset="1" stopColor="#005F6B" />
          </radialGradient>
        </defs>
        <g transform="translate(300,0) scale(-1,1)">
          <g className="f-tail" style={{ transformOrigin: '250px 110px' }}>
            <path d="M235 100C258.333 86.6667 268.333 88.3333 265 105C267 111.667 267 116.667 265 120C268.333 133.333 258.333 133.333 235 120" fill="#1A3A4A" stroke="#0E7C86" strokeWidth="1.5" />
          </g>
          <g className="f-body">
            <path d="M130 75C123.333 58.3333 126.667 43.3333 140 30C143.333 26.6667 146.667 26 150 28" stroke="#1A6E7A" strokeWidth="2" strokeLinecap="round" />
            <circle opacity="0.7" cx="150" cy="26" r="18" fill={`url(#${lure})`} />
            <circle cx="150" cy="26" r="6" fill="#7DF9FF" />
            <path d="M150 170C196.944 170 235 143.137 235 110C235 76.8629 196.944 50 150 50C103.056 50 65 76.8629 65 110C65 143.137 103.056 170 150 170Z" fill={`url(#${body})`} />
            <path opacity="0.5" d="M155 160C188.137 160 215 146.569 215 130C215 113.431 188.137 100 155 100C121.863 100 95 113.431 95 130C95 146.569 121.863 160 155 160Z" fill="#1A3A4A" />
            <path d="M100 65C93.3333 51.6667 96.6667 48.3333 110 55C116.667 58.3333 123.333 59.3333 130 58C133.333 56 131.667 60 125 70" fill="#1A3A4A" stroke="#0E7C86" />
            <g className="f-pect" style={{ transformOrigin: '110px 145px' }}>
              <path d="M120 135C106.667 148.333 101.667 160 105 170C111.667 166.667 120 158.333 130 145" fill="#1A3A4A" stroke="#0E7C86" />
            </g>
            <path d="M165 160C161.667 173.333 163.333 181.667 170 185C175.333 180.333 178.667 173.667 180 165" fill="#1A3A4A" stroke="#0E7C86" />
            <path d="M68 105C66 111.667 66.6667 118.333 70 125C76.6667 121.667 85 119.333 95 118" stroke="#0E7C86" strokeWidth="2" strokeLinecap="round" />
            <circle cx="105" cy="95" r="12" fill={`url(#${eye})`} />
            <circle cx="105" cy="95" r="5" fill="#0D1B2A" />
            {[[130, 100], [150, 90], [170, 105], [190, 95], [145, 125], [175, 120], [200, 110], [160, 140]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={1.2 - (i % 3) * 0.2} opacity={0.45 - i * 0.02} fill={i % 2 ? '#00CED1' : '#7DF9FF'} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
