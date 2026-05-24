import Link from "next/link";
import { ChipIcon } from "@/components/chip-icon";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="panel relative flex max-w-lg flex-col items-center gap-4 overflow-hidden p-10 text-center">
        <div className="pointer-events-none absolute inset-0 hatched opacity-20" />
        <div className="relative flex flex-col items-center gap-4">
          <ChipIcon size={88} bitten />
          <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
            error · 404
          </p>
          <h1 className="display text-5xl text-[var(--color-mole)]">
            Crumbs only.
          </h1>
          <p className="serif italic text-[var(--color-mole)]/80">
            That page has been eaten. Let's get you back to the buffet.
          </p>
          <Link href="/" className="btn-primary">
            Back to the dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
