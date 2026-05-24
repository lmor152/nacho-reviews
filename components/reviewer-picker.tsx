"use client";

import { useEffect, useState } from "react";

const NEW_VALUE = "__new__";

interface ReviewerPickerProps {
  value: string;
  onChange: (next: string) => void;
}

interface Diagnostics {
  docs: number;
  withReviewer: number;
  unique: number;
  sampleReviewerKeys: string[];
  error: string | null;
  errorStack?: string;
  generatedAt: string;
}

interface ReviewersResponse {
  reviewers?: string[];
  _diag?: Diagnostics;
}

export function ReviewerPicker({ value, onChange }: ReviewerPickerProps) {
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [mode, setMode] = useState<"existing" | "new">("existing");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviewers", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`reviewers ${res.status} ${res.statusText}`);
        }
        const data = (await res.json()) as ReviewersResponse;
        if (cancelled) return;
        const list = Array.isArray(data.reviewers) ? data.reviewers : [];
        setReviewers(list);
        if (value && !list.includes(value)) {
          setMode("new");
        } else if (list.length === 0) {
          setMode("new");
        } else {
          setMode("existing");
        }
        setStatus("ready");
        // Diagnostic breadcrumb in the browser console for future
        // debugging — never rendered to the page.
        // eslint-disable-next-line no-console
        console.info("[ReviewerPicker] loaded", {
          listLength: list.length,
          diag: data._diag,
        });
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMode("new");
        // eslint-disable-next-line no-console
        console.error("[ReviewerPicker] fetch failed", err);
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
