"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChipIcon } from "@/components/chip-icon";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="panel flex max-w-lg flex-col items-center gap-4 p-10 text-center">
        <ChipIcon size={72} bitten rotate={-12} />
        <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-salsa-deep)]">
          kitchen mishap
        </p>
        <h1 className="display text-4xl text-[var(--color-mole)]">
          Something dropped on the floor.
        </h1>
        <p className="serif italic text-[var(--color-mole)]/80">
          Try again, or head back to the dashboard.
        </p>
        <div className="flex gap-3">
          <button onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-ghost">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
