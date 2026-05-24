"use client";

import { motion } from "motion/react";
import type { Review } from "@/lib/types";
import { ScoreChips } from "@/components/score-display";
import { scoreColor, scoreVerdict } from "@/lib/scoring";
import { ChipIcon } from "@/components/chip-icon";

interface ReviewCardProps {
  review: Review;
  index?: number;
  /**
   * When the card is rendered inside another panel (e.g. the dashboard's
   * "latest from the field" feed), drop the decorative tilt and the
   * corner score badge so it doesn't poke past the parent's borders.
   */
  embedded?: boolean;
}

const tilts = [-0.6, 0.4, -0.3, 0.5, -0.2, 0.3];

export function ReviewCard({
  review,
  index = 0,
  embedded = false,
}: ReviewCardProps) {
  const tilt = embedded ? 0 : tilts[index % tilts.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.04 }}
      whileHover={embedded ? { y: -3 } : { rotate: 0, y: -6 }}
      style={{ rotate: tilt }}
      className="panel relative flex flex-col gap-4 p-4 sm:p-6 min-w-0"
    >
      {!embedded && (
        <div
          className="absolute -right-3 -top-3 hidden sm:flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-[var(--color-mole)] bg-[var(--color-cream-light)] shadow-[0_8px_18px_-12px_rgba(42,24,18,0.6)]"
          title="Overall score"
        >
          <span
            className="display text-2xl"
            style={{ color: scoreColor(review.overall) }}
          >
            {review.overall}
          </span>
        </div>
      )}

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
            {new Date(review.date).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {review.reviewer}
          </p>
          <h3 className="display text-xl sm:text-2xl leading-tight text-[var(--color-mole)] break-words">
            {review.restaurant}
          </h3>
          <p className="serif italic text-sm sm:text-base text-[var(--color-mole)]/85 break-words">
            {review.meal}
          </p>
        </div>
        <div className="hidden lg:flex items-start">
          <ChipIcon size={36} rotate={index % 2 === 0 ? -10 : 12} />
        </div>
      </header>

      {review.description && (
        <p className="serif text-sm leading-relaxed text-[var(--color-mole)]/85">
          {review.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <Stat label="Quantity" value={review.quantity} />
        <Stat label="Taste" value={review.taste} />
        <Stat label="Atmosphere" value={review.atmosphere} />
        <Stat label="Overall" value={review.overall} />
      </div>

      <ScoreChips score={review.overall} />

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dashed border-[var(--color-mole)]/30">
        <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-mole)]/60">
          {review.currency} {review.price.toFixed(2)} · verdict:{" "}
          <span
            className="display normal-case tracking-normal"
            style={{ color: scoreColor(review.overall) }}
          >
            {scoreVerdict(review.overall)}
          </span>
        </span>
        {review.comments && (
          <p className="serif italic text-xs text-[var(--color-mole)]/70">
            “{review.comments}”
          </p>
        )}
      </footer>
    </motion.article>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
        {label}
      </span>
      <span
        className="display text-2xl sm:text-3xl"
        style={{ color: scoreColor(value) }}
      >
        {value}
        <span className="mono text-[10px] sm:text-xs ml-0.5 text-[var(--color-mole)]/55">
          /10
        </span>
      </span>
    </div>
  );
}
