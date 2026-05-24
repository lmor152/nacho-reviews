"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Review } from "@/lib/types";
import { ReviewCard } from "@/components/review-card";

interface ReviewsExplorerProps {
  reviews: Review[];
}

type SortKey = "date" | "overall" | "taste" | "price";

export function ReviewsExplorer({ reviews }: ReviewsExplorerProps) {
  const [reviewer, setReviewer] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [search, setSearch] = useState<string>("");

  const reviewerOptions = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.reviewer))).sort(),
    [reviews],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews
      .filter((r) =>
        reviewer === "all" ? true : r.reviewer === reviewer,
      )
      .filter((r) => r.overall >= minScore)
      .filter((r) =>
        q
          ? `${r.restaurant} ${r.meal} ${r.description} ${r.comments}`
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => {
        switch (sortKey) {
          case "overall":
            return b.overall - a.overall || b.taste - a.taste;
          case "taste":
            return b.taste - a.taste;
          case "price":
            return b.price - a.price;
          case "date":
          default:
            return a.date < b.date ? 1 : -1;
        }
      });
  }, [reviews, reviewer, minScore, sortKey, search]);

  return (
    <div className="flex flex-col gap-8">
      <div className="panel flex flex-col gap-4 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="restaurant, ingredient, comment…"
              className="input"
              type="search"
            />
          </Field>
          <Field label="Reviewer">
            <select
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              className="input"
            >
              <option value="all">All reviewers</option>
              {reviewerOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Min overall · ${minScore}`}>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-[var(--color-salsa)]"
            />
          </Field>
          <Field label="Sort by">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["date", "Date"],
                  ["overall", "Overall"],
                  ["taste", "Taste"],
                  ["price", "Price"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortKey(key)}
                  className={`rounded-full px-3 py-1 text-xs mono uppercase tracking-[0.18em] transition-colors ${
                    sortKey === key
                      ? "bg-[var(--color-mole)] text-[var(--color-cream-light)]"
                      : "border border-[var(--color-mole)]/40 text-[var(--color-mole)] hover:bg-[var(--color-paper-deep)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-mole)]/60 lg:text-right">
          Showing {filtered.length} of {reviews.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="panel grid place-items-center p-12 text-center">
          <p className="display text-3xl text-[var(--color-mole)]">
            No plates match.
          </p>
          <p className="serif mt-2 italic text-[var(--color-mole)]/70">
            Loosen your filters, or go file a new one.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-mole)]/60">
        {label}
      </span>
      {children}
    </label>
  );
}
