import { ChipIcon } from "@/components/chip-icon";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="animate-spin-slow">
          <ChipIcon size={56} />
        </span>
        <p className="display text-3xl text-[var(--color-mole)]">
          Plating up…
        </p>
        <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
          fetching the field journal
        </p>
      </div>
    </div>
  );
}
