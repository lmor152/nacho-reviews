"use client";

import { useEffect, useRef } from "react";
import { ChipIcon } from "@/components/chip-icon";

interface FloatingChip {
  left: string;
  top: string;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
}

const FLOATING_CHIPS: FloatingChip[] = [
  { left: "6%", top: "14%", size: 56, rotate: -22, delay: 0, duration: 8 },
  { left: "92%", top: "10%", size: 38, rotate: 18, delay: 1.4, duration: 9 },
  { left: "18%", top: "82%", size: 70, rotate: 12, delay: 0.6, duration: 11 },
  { left: "74%", top: "70%", size: 44, rotate: -8, delay: 2.2, duration: 10 },
  { left: "50%", top: "92%", size: 32, rotate: 30, delay: 1.1, duration: 9 },
  { left: "84%", top: "44%", size: 26, rotate: -15, delay: 0.3, duration: 7 },
  { left: "10%", top: "48%", size: 22, rotate: 5, delay: 1.8, duration: 8 },
];

export function ChipBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        transform: "translate3d(var(--mx, 0), var(--my, 0), 0)",
        transition: "transform 240ms ease-out",
      }}
    >
      {FLOATING_CHIPS.map((c, i) => (
        <div
          key={i}
          className="absolute opacity-30"
          style={{
            left: c.left,
            top: c.top,
            animation: `float-y ${c.duration}s ease-in-out ${c.delay}s infinite`,
          }}
        >
          <ChipIcon size={c.size} rotate={c.rotate} />
        </div>
      ))}
    </div>
  );
}
