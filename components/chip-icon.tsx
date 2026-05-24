import type { CSSProperties } from "react";

interface ChipIconProps {
  size?: number;
  filled?: boolean;
  bitten?: boolean;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
}

export function ChipIcon({
  size = 28,
  filled = true,
  bitten = false,
  className,
  style,
  rotate = 0,
}: ChipIconProps) {
  // Triangular tortilla chip with a slight curl, a bite shape on one corner
  // when bitten=true.
  const fill = filled ? "var(--color-tortilla)" : "transparent";
  const stroke = "var(--color-mole)";
  const path = bitten
    ? "M50 6 L94 88 Q72 84 56 76 L46 92 L8 88 Z"
    : "M50 6 L94 88 L6 88 Z";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ ...(style ?? {}), transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-cheese)" />
          <stop offset="55%" stopColor="var(--color-tortilla)" />
          <stop offset="100%" stopColor="var(--color-tortilla-deep)" />
        </linearGradient>
        <pattern
          id="chipSpeckle"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.6" fill="rgba(42,24,18,0.55)" />
          <circle cx="5" cy="4" r="0.5" fill="rgba(42,24,18,0.35)" />
        </pattern>
      </defs>
      <path
        d={path}
        fill={filled ? "url(#chipGrad)" : fill}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {filled && (
        <path
          d={path}
          fill="url(#chipSpeckle)"
          opacity="0.9"
          stroke="none"
        />
      )}
      {filled && (
        <path
          d="M50 12 L84 80"
          stroke="rgba(255,247,219,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
