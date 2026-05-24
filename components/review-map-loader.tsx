"use client";

import dynamic from "next/dynamic";
import type { Review } from "@/lib/types";

const ReviewMap = dynamic(() => import("@/components/review-map"), {
  ssr: false,
  loading: () => (
    <div className="grid-paper flex h-[360px] sm:h-[420px] lg:h-[460px] w-full items-center justify-center rounded-[20px] border-[1.5px] border-dashed border-[var(--color-mole)]/40">
      <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--color-mole)]/60">
        plotting plates…
      </p>
    </div>
  ),
});

export function ReviewMapLoader({ reviews }: { reviews: Review[] }) {
  return <ReviewMap reviews={reviews} />;
}
