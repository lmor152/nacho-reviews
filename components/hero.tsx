"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChipIcon } from "@/components/chip-icon";
import { AnimatedNumber } from "@/components/animated-number";
import type { DashboardStats } from "@/lib/types";

export function Hero({ stats }: { stats: DashboardStats }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative mx-auto mt-8 sm:mt-10 max-w-[1400px]">
      <div className="ticket relative overflow-hidden rounded-[24px] sm:rounded-[28px] border-[1.5px] border-[var(--color-mole)] p-5 sm:p-10 lg:p-12">
        <div className="absolute inset-0 hatched opacity-30" aria-hidden />
        <div className="relative grid gap-8 lg:gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="flex flex-col gap-5 sm:gap-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip-badge text-[var(--color-salsa-deep)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-salsa)]" />
                Field journal
              </span>
              <span className="mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.32em] text-[var(--color-mole)]/70">
                {today}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="display leading-[0.88] tracking-[-0.02em] text-[var(--color-mole)] text-[clamp(2.25rem,10vw,6.5rem)]"
            >
              <span className="block">A field</span>
              <span className="block">
                journal of{" "}
                <span className="relative inline-block">
                  <span className="underline-wavy">nachos</span>
                </span>
                .
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="serif italic text-base sm:text-lg lg:text-xl max-w-xl text-[var(--color-mole)]/85"
            >
              Every plate scored across four dimensions: quantity, taste,
              atmosphere, and an overall verdict.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link href="/reviews" className="btn-primary text-sm sm:text-base">
                Browse the archive
                <span aria-hidden>→</span>
              </Link>
              <Link href="/submit" className="btn-ghost text-sm sm:text-base">
                + File a new plate
              </Link>
              <span className="mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-mole)]/60">
                {stats.pendingReviews} awaiting approval
              </span>
            </motion.div>
          </div>

          <div className="relative">
            <div className="panel-dark relative isolate flex flex-col gap-2 overflow-hidden p-5 sm:p-7">
              {/* decorative chips behind the content */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -bottom-10 z-0 rotate-[8deg] opacity-60 sm:opacity-70"
              >
                <ChipIcon size={120} />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -left-3 -top-3 z-0 rotate-[-15deg] opacity-80"
              >
                <ChipIcon size={44} bitten />
              </div>

              <div className="relative z-10 flex flex-col gap-2">
                <p className="mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-cheese)]">
                  Headline figure
                </p>
                <p className="display leading-none text-[var(--color-cream-light)] text-[clamp(3rem,14vw,5.5rem)]">
                  <AnimatedNumber
                    value={stats.averageOverall}
                    decimals={2}
                  />
                  <span className="mono text-sm sm:text-base text-[var(--color-cheese)]">
                    /10
                  </span>
                </p>
                <p className="serif italic text-sm sm:text-base text-[var(--color-cream-light)]/80">
                  The average overall score of every plate filed to date.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[var(--color-cheese)]/30 pt-4">
                  <Stat
                    label="Top spot"
                    value={
                      stats.topRestaurant
                        ? stats.topRestaurant.name
                        : "—"
                    }
                    detail={
                      stats.topRestaurant
                        ? `${stats.topRestaurant.score}/10 overall`
                        : "no winners yet"
                    }
                  />
                  <Stat
                    label="Plates filed"
                    value={String(stats.approvedReviews)}
                    detail={`${stats.uniqueRestaurants} unique spots`}
                  />
                </div>
              </div>
            </div>

            <div className="absolute -left-6 -top-6 hidden lg:block">
              <span className="stamp text-[var(--color-salsa)]">
                approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-cheese)]/80">
        {label}
      </p>
      <p className="display text-xl sm:text-2xl text-[var(--color-cream-light)] truncate">
        {value}
      </p>
      <p className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-cream-light)]/60 truncate">
        {detail}
      </p>
    </div>
  );
}
