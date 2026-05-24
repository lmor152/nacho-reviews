"use client";

import { useEffect, useState } from "react";

const NEW_VALUE = "__new__";

interface ReviewerPickerProps {
  value: string;
  onChange: (next: string) => void;
}

interface ReviewersResponse {
  reviewers?: string[];
  error?: string;
}

export function ReviewerPicker({ value, onChange }: ReviewerPickerProps) {
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"existing" | "new">("existing");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviewers", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`reviewers ${res.status}`);
        }
        const data = (await res.json()) as ReviewersResponse;
        if (cancelled) return;
        const list = Array.isArray(data.reviewers) ? data.reviewers : [];
        setReviewers(list);
        if (data.error) setErrorMessage(data.error);
        // Decide initial mode:
        //   - if the form already carries a value not in the list → "new"
        //   - if there are no reviewers yet → "new"
        //   - otherwise stay on the existing-name dropdown
        if (value && !list.includes(value)) {
          setMode("new");
        } else if (list.length === 0) {
          setMode("new");
        } else {
          setMode("existing");
        }
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMode("new");
        setErrorMessage(
          err instanceof Error ? err.message : "lookup failed",
        );
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

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="input flex items-center text-[var(--color-mole)]/55 mono text-xs">
          loading reviewers…
        </div>
      </div>
    );
  }

  // "new" mode — free-text input, with a way back to the dropdown if any
  // existing reviewers loaded successfully.
  if (mode === "new") {
    return (
      <div className="flex flex-col gap-1.5">
        <input
          required
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name"
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
        {status === "error" && (
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-salsa-deep)]">
            couldn&apos;t load existing reviewers
            {errorMessage ? ` · ${errorMessage}` : ""}
          </p>
        )}
      </div>
    );
  }

  // "existing" mode — dropdown of known reviewers, with a "+ Someone new…"
  // option at the end to flip to free-text.
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
