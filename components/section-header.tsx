interface SectionHeaderProps {
  index: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <header
      className={`mb-8 flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="mono text-xs tracking-[0.3em] text-[var(--color-tortilla-deep)]">
          §{index}
        </span>
        {eyebrow && (
          <span className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-mole)]/60">
            {eyebrow}
          </span>
        )}
      </div>
      <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-[var(--color-mole)]">
        {title}
      </h2>
      {description && (
        <p className="serif italic max-w-2xl text-[var(--color-mole)]/80">
          {description}
        </p>
      )}
    </header>
  );
}
