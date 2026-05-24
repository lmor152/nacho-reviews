"use client";

import { motion } from "motion/react";
import { ChipIcon } from "@/components/chip-icon";
import { scoreColor, scoreVerdict } from "@/lib/scoring";

interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showVerdict?: boolean;
}

export function ScoreChips({ score }: { score: number }) {
  const total = 10;
  return (
    <div className="flex flex-wrap gap-[3px]">
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -6, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: i * 0.04, type: "spring", stiffness: 360 }}
        >
          <ChipIcon
            size={14}
            filled={i < Math.round(score)}
            rotate={(i % 2 === 0 ? -1 : 1) * (5 + i * 1.4)}
          />
        </motion.span>
      ))}
    </div>
  );
}

export function ScoreDisplay({
  score,
  label = "Overall",
  size = "md",
  showVerdict = true,
}: ScoreDisplayProps) {
  const numberSize =
    size === "lg" ? "text-7xl" : size === "md" ? "text-5xl" : "text-3xl";
  return (
    <div className="flex items-baseline gap-3">
      <div className="flex items-baseline gap-1">
        <span
          className={`display ${numberSize} leading-none`}
          style={{ color: scoreColor(score) }}
        >
          {score}
        </span>
        <span className="mono text-xs uppercase tracking-[0.2em] text-[var(--color-mole)]/70">
          /10
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-mole)]/60">
          {label}
        </span>
        {showVerdict && (
          <span className="serif italic text-base text-[var(--color-mole)]">
            {scoreVerdict(score)}
          </span>
        )}
      </div>
    </div>
  );
}
