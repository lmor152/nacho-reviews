"use client";

import { motion } from "motion/react";
import type { Review } from "@/lib/types";
import { ScoreChips } from "@/components/score-display";
import { scoreColor } from "@/lib/scoring";

const RANK_LABEL = ["I", "II", "III", "IV", "V"];

export function Leaderboard({ reviews }: { reviews: Review[] }) {
  const ranked = [...reviews]
    .sort((a, b) => b.overall - a.overall || b.taste - a.taste)
    .slice(0, 5);

  return (
    <ol className="flex flex-col">
      {ranked.map((r, i) => (
        <motion.li
          key={r.id}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="group relative flex items-center gap-3 sm:gap-4 border-b border-dashed border-[var(--color-mole)]/30 py-3 sm:py-4 first:pt-2 last:border-none"
        >
          <span
            className="display text-2xl sm:text-3xl shrink-0"
            style={{ color: scoreColor(r.overall) }}
          >
            {RANK_LABEL[i] ?? `${i + 1}`}
          </span>
          <div className="flex-1 min-w-0">
            <p className="serif text-base sm:text-lg leading-tight text-[var(--color-mole)] truncate">
              {r.restaurant}
            </p>
            <p className="mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[var(--color-tortilla-deep)] truncate">
              {r.meal} · {r.reviewer}
            </p>
          </div>
          <div className="hidden lg:block">
            <ScoreChips score={r.overall} />
          </div>
          <div className="flex items-baseline gap-1 shrink-0">
            <span
              className="display text-2xl sm:text-3xl"
              style={{ color: scoreColor(r.overall) }}
            >
              {r.overall}
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-mole)]/60">
              /10
            </span>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
