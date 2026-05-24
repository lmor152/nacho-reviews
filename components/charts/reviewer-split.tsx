"use client";

import { motion } from "motion/react";

interface Datum {
  reviewer: string;
  count: number;
  avgOverall: number;
}

const REVIEWER_COLORS = [
  "var(--color-salsa)",
  "var(--color-jalapeno)",
  "var(--color-tortilla-deep)",
  "var(--color-cheese-deep)",
];

export function ReviewerSplit({ data }: { data: Datum[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex h-3 overflow-hidden rounded-full border border-[var(--color-mole)]/30">
        {data.map((d, i) => (
          <motion.div
            key={d.reviewer}
            initial={{ width: 0 }}
            animate={{ width: `${(d.count / total) * 100}%` }}
            transition={{ duration: 0.9, delay: i * 0.1 }}
            style={{
              background: REVIEWER_COLORS[i % REVIEWER_COLORS.length],
            }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-2.5">
        {data.map((d, i) => {
          const pct = ((d.count / total) * 100).toFixed(0);
          return (
            <li
              key={d.reviewer}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: REVIEWER_COLORS[i % REVIEWER_COLORS.length],
                  }}
                />
                <span className="serif text-base text-[var(--color-mole)]">
                  {d.reviewer}
                </span>
              </span>
              <span className="mono text-xs text-[var(--color-mole)]/70">
                {d.count} {d.count === 1 ? "plate" : "plates"} · avg{" "}
                {d.avgOverall.toFixed(1)} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
