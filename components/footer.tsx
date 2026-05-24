import Link from "next/link";
import { ChipIcon } from "@/components/chip-icon";

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-[var(--color-mole)]/20 bg-[var(--color-paper-deep)]/40 px-5 py-10 sm:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <ChipIcon size={36} rotate={8} />
          <div className="leading-tight">
            <p className="display text-xl text-[var(--color-mole)]">
              Eat the chips. Take notes.
            </p>
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-tortilla-deep)]">
              hand-graded · field-tested · cheese-pulled
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 mono text-xs uppercase tracking-[0.2em] text-[var(--color-mole)]/70">
          <Link href="/" className="hover:text-[var(--color-salsa)]">
            ← back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
