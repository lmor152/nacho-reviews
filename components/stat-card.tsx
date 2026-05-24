"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/animated-number";

interface StatCardProps {
  index: string;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  accent?: "salsa" | "cheese" | "jalapeno" | "tortilla";
  delay?: number;
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  salsa: "var(--color-salsa)",
  cheese: "var(--color-cheese-deep)",
  jalapeno: "var(--color-jalapeno)",
  tortilla: "var(--color-tortilla-deep)",
};

export function StatCard({
  index,
  label,
  value,
  decimals = 0,
  prefix,
  suffix,
  hint,
  accent = "salsa",
  delay = 0,
}: StatCardProps) {
  const colour = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="panel relative overflow-hidden p-4 sm:p-5"
    >
      <span
        className="absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-20"
        style={{ background: colour }}
        aria-hidden
      />
      <p className="mono text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.3em] text-[var(--color-tortilla-deep)] truncate">
        №{index} · {label}
      </p>
      <p
        className="display mt-2 sm:mt-3 text-3xl sm:text-5xl leading-none break-words"
        style={{ color: colour }}
      >
        <AnimatedNumber
          value={value}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      </p>
      {hint && (
        <p className="serif mt-2 text-xs sm:text-sm italic text-[var(--color-mole)]/75">
          {hint}
        </p>
      )}
    </motion.div>
  );
}
