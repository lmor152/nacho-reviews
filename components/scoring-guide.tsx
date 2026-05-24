"use client";

import { motion } from "motion/react";
import {
  SCORE_BANDS,
  SCORING_DIMENSIONS,
  type ScoreDimensionKey,
} from "@/lib/scoring";

const BAND_TINTS: Record<string, string> = {
  "1 – 3 · Dealbreaker": "var(--color-salsa-deep)",
  "4 – 6 · Take it or leave it": "var(--color-tortilla-deep)",
  "7 – 8 · Recommend": "var(--color-jalapeno-deep)",
  "9 – 10 · Hall of fame": "var(--color-cheese-deep)",
};

export function ScoringGuide() {
  return (
    <div className="flex flex-col gap-6">
      <div className="panel p-5 sm:p-6">
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-tortilla-deep)]">
          Categories
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {SCORING_DIMENSIONS.map((d) => (
            <li
              key={d.key}
              className="flex flex-col gap-1 rounded-2xl border border-dashed border-[var(--color-mole)]/25 p-3"
            >
              <span className="display text-xl text-[var(--color-mole)]">
                {d.label}
              </span>
              <span className="serif italic text-sm text-[var(--color-mole)]/80">
                {d.blurb}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel overflow-hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-[var(--color-mole)]/30 px-5 py-4">
          <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-tortilla-deep)]">
            What the scores mean
          </p>
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-mole)]/55">
            1 = bad · 5 = average · 10 = perfect
          </span>
        </div>

        {/* Mobile: stack each band as its own card with a 2-col axis grid. */}
        <ul className="md:hidden flex flex-col">
          {SCORE_BANDS.map((band, i) => {
            const tint = BAND_TINTS[band.label];
            const isTop = i === SCORE_BANDS.length - 1;
            return (
              <motion.li
                key={band.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="border-b border-dashed border-[var(--color-mole)]/15 last:border-none px-5 py-4"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="display text-3xl leading-none"
                    style={{ color: tint }}
                  >
                    {band.range[0]}–{band.range[1]}
                  </span>
                  <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
                    {band.label.split(" · ")[1]}
                  </p>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  {SCORING_DIMENSIONS.map((d) => (
                    <div key={d.key} className="min-w-0">
                      <dt className="mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
                        {d.label}
                      </dt>
                      <dd
                        className="serif text-sm leading-snug break-words mt-0.5"
                        style={
                          isTop
                            ? { color: tint, fontStyle: "italic" }
                            : { color: "var(--color-mole)" }
                        }
                      >
                        {band.byDimension[d.key as ScoreDimensionKey]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.li>
            );
          })}
        </ul>

        {/* md+ : full matrix table. */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-dashed border-[var(--color-mole)]/25 text-[var(--color-mole)]/60">
                <th className="px-5 py-3 mono text-[10px] uppercase tracking-[0.22em]">
                  Score band
                </th>
                {SCORING_DIMENSIONS.map((d) => (
                  <th
                    key={d.key}
                    className="px-4 py-3 mono text-[10px] uppercase tracking-[0.22em]"
                  >
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCORE_BANDS.map((band, i) => {
                const tint = BAND_TINTS[band.label];
                const isTop = i === SCORE_BANDS.length - 1;
                return (
                  <motion.tr
                    key={band.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="border-b border-dashed border-[var(--color-mole)]/15 last:border-none align-middle"
                  >
                    <td className="px-5 py-5 align-middle">
                      <span
                        className="display text-3xl leading-none"
                        style={{ color: tint }}
                      >
                        {band.range[0]}–{band.range[1]}
                      </span>
                      <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55 mt-1">
                        {band.label.split(" · ")[1]}
                      </p>
                    </td>
                    {SCORING_DIMENSIONS.map((d) => (
                      <td
                        key={d.key}
                        className={`px-4 py-5 serif text-base leading-tight ${
                          isTop
                            ? "italic"
                            : "text-[var(--color-mole)]/90"
                        }`}
                        style={isTop ? { color: tint } : undefined}
                      >
                        {band.byDimension[d.key as ScoreDimensionKey]}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
