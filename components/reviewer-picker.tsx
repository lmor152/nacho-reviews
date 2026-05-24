"use client";

import { useEffect, useState } from "react";

const NEW_VALUE = "__new__";

interface ReviewerPickerProps {
  value: string;
  onChange: (next: string) => void;
}

export function ReviewerPicker({ value, onChange }: ReviewerPickerProps) {
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<"existing" | "new">("existing");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviewers");
        const data = (await res.json()) as { reviewers?: string[] };
        if (cancelled) return;
        const list = data.reviewers ?? [];
        setReviewers(list);
        // If the form already has a value that isn't in the list, treat it as
        // a new entry. Otherwise default to the existing-name dropdown.
        if (value && !list.includes(value)) {
          setMode("new");
        } else if (list.length === 0) {
          setMode("new");
        }
      } catch {
        setMode("new");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectChange(selected: string) {
    if (selected === NEW_VALUE) {
      setMode("new");
      onChange("");
    } else {
      setMode("existing");
      onChange(selected);
    }
  }

  if (loading) {
    return (
      <div className="input flex items-center text-[var(--color-mole)]/55 mono text-xs">
        loading reviewers…
      </div>
    );
  }

  if (mode === "new" || reviewers.length === 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <input
          required
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name (first review)"
          autoComplete="off"
        />
        {reviewers.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMode("existing");
              onChange(reviewers[0] ?? "");
            }}
            className="self-start mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-tortilla-deep)] hover:text-[var(--color-salsa)]"
          >
            ← pick an existing reviewer
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <select
        className="input"
        required
        value={reviewers.includes(value) ? value : ""}
        onChange={(e) => handleSelectChange(e.target.value)}
      >
        <option value="" disabled>
          Select your name…
        </option>
        {reviewers.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
        <option value={NEW_VALUE}>+ Someone new…</option>
      </select>
      <p className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
        Pick yourself from the list or add a new name.
      </p>
    </div>
  );
}
