import type { CSSProperties } from 'react';

export interface FishProps {
  /** Rendered width in px (aspect ratio is fixed at 2:1). */
  width?: number;
  /** Enables the tail-wag / fin-flutter swim cycle. */
  swim?: boolean;
  /** One tail-beat duration in ms — smaller fish beat faster. */
  wagMs?: number;
  className?: string;
  style?: CSSProperties;
}

export function fishWrapperProps(
  { width = 120, swim = true, wagMs, className = '', style }: FishProps,
  defaultWagMs: number,
) {
  return {
    className: `fish ${swim ? 'swim' : ''} ${className}`,
    style: {
      width,
      '--wag': `${wagMs ?? defaultWagMs}ms`,
      ...style,
    } as CSSProperties,
  };
}
