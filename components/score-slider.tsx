"use client";

import { motion } from "motion/react";
import { ChipIcon } from "@/components/chip-icon";
import {
  bandForScore,
  scoreColor,
  SCORING_DIMENSIONS,
  type ScoreDimensionKey,
} from "@/lib/scoring";

interface ScoreSliderProps {
  dimension: ScoreDimensionKey;
  value: number;
  onChange: (next: number) => void;
}

export function ScoreSlider({ dimension, value, onChange }: ScoreSliderProps) {
  const guide = SCORING_DIMENSIONS.find((d) => d.key === dimension)!;
  const band = bandForScore(value);
  const description = band.byDimension[dimension];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-mole)]/60">
          {guide.label}
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
          {band.label.split(" · ")[1]}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <motion.span
          key={value}
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="display text-5xl leading-none"
          style={{ color: scoreColor(value) }}
        >
          {value}
        </motion.span>
        <div className="flex-1">
          <input
            type="range"
            min={1}
            max={10}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: scoreColor(value) }}
            aria-label={guide.label}
          />
          <div className="mt-1 flex justify-between mono text-[9px] tracking-[0.22em] text-[var(--color-mole)]/45">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <ChipIcon
            size={28}
            filled={value >= 5}
            rotate={value % 2 === 0 ? 8 : -8}
          />
        </div>
      </div>
      <p className="serif italic text-xs text-[var(--color-mole)]/70">
        {description}
      </p>
    </div>
  );
}
