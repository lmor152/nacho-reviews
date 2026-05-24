"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ScoreSlider } from "@/components/score-slider";
import { ScoreChips } from "@/components/score-display";
import { ChipIcon } from "@/components/chip-icon";
import { PlaceSearch } from "@/components/place-search";
import { ReviewerPicker } from "@/components/reviewer-picker";
import { scoreVerdict } from "@/lib/scoring";
import type { PlaceCandidate } from "@/lib/places";

interface FormState {
  meal: string;
  description: string;
  price: string;
  currency: string;
  reviewer: string;
  date: string;
  comments: string;
  quantity: number;
  taste: number;
  atmosphere: number;
  overall: number;
}

const STEPS = [
  { id: "where", label: "Where & what" },
  { id: "score", label: "Score it" },
  { id: "notes", label: "Final notes" },
] as const;

const DEFAULT_FORM: FormState = {
  meal: "",
  description: "",
  price: "",
  currency: "GBP",
  reviewer: "",
  date: new Date().toISOString().slice(0, 10),
  comments: "",
  quantity: 5,
  taste: 5,
  atmosphere: 5,
  overall: 5,
};

export function ReviewForm() {
  const router = useRouter();
  const [step, setStep] = useState<(typeof STEPS)[number]["id"]>("where");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [place, setPlace] = useState<PlaceCandidate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const canAdvance = useMemo(() => {
    if (step === "where") {
      return (
        place !== null &&
        form.meal.trim().length > 0 &&
        form.reviewer.trim().length > 0 &&
        Number.isFinite(Number(form.price))
      );
    }
    return true;
  }, [step, form, place]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async () => {
    if (!place) {
      setError("Please pick a restaurant from the Google Places suggestions.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        restaurant: place.name,
        meal: form.meal.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        currency: form.currency.trim() || "GBP",
        reviewer: form.reviewer.trim(),
        quantity: form.quantity,
        taste: form.taste,
        atmosphere: form.atmosphere,
        overall: form.overall,
        comments: form.comments.trim(),
        date: form.date,
        latitude: place.latitude,
        longitude: place.longitude,
      };
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="panel relative overflow-hidden p-10 text-center"
      >
        <div className="pointer-events-none absolute inset-0 hatched opacity-20" />
        <div className="relative flex flex-col items-center gap-3">
          <motion.div
            initial={{ rotate: -20, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChipIcon size={88} />
          </motion.div>
          <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
            Submission received
          </p>
          <h3 className="display text-4xl text-[var(--color-mole)]">
            Filed for approval.
          </h3>
          <p className="serif italic text-[var(--color-mole)]/80 max-w-md">
            The chip-tender will review your plate. Approved entries appear on
            the dashboard within moments.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(DEFAULT_FORM);
                setPlace(null);
                setStep("where");
                setSubmitted(false);
              }}
              className="btn-ghost"
            >
              File another
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn-primary"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/60">
        {STEPS.map((s, i) => {
          const isActive = s.id === step;
          const isDone = i < stepIndex;
          return (
            <li key={s.id} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                  isActive
                    ? "bg-[var(--color-salsa)] text-[var(--color-cream-light)] border-[var(--color-salsa-deep)]"
                    : isDone
                      ? "bg-[var(--color-mole)] text-[var(--color-cream-light)] border-[var(--color-mole)]"
                      : "border-[var(--color-mole)]/40 text-[var(--color-mole)]"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={isActive ? "text-[var(--color-mole)]" : ""}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="hidden sm:inline-block h-px w-8 bg-[var(--color-mole)]/30" />
              )}
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === "notes") submit();
          else if (canAdvance) {
            setStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id);
          }
        }}
        className="panel p-4 sm:p-7"
      >
        <AnimatePresence mode="wait">
          {step === "where" && (
            <motion.div
              key="where"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="grid gap-4 sm:grid-cols-2 min-w-0"
            >
              <div className="sm:col-span-2 min-w-0">
                <PlaceSearch value={place} onChange={setPlace} />
              </div>
              <Field label="Meal name *">
                <input
                  required
                  className="input"
                  value={form.meal}
                  onChange={(e) => set("meal", e.target.value)}
                  placeholder="e.g. Grande Muchos Nachos"
                />
              </Field>
              <Field label="Reviewer *">
                <ReviewerPicker
                  value={form.reviewer}
                  onChange={(next) => set("reviewer", next)}
                />
              </Field>
              <Field label="Description" full>
                <textarea
                  className="input min-h-[88px] resize-y"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What was on the plate? Toppings, sauces, surprises…"
                />
              </Field>
              <Field label="Price">
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="0.00"
                  />
                  <select
                    className="input w-24"
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                  >
                    {[
                      "GBP",
                      "EUR",
                      "USD",
                      "CAD",
                      "AUD",
                      "NZD",
                      "MXN",
                      "JPY",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
              <Field label="Date">
                <input
                  className="input"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>
            </motion.div>
          )}

          {step === "score" && (
            <motion.div
              key="score"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-7"
            >
              <ScoreSlider
                dimension="quantity"
                value={form.quantity}
                onChange={(v) => set("quantity", v)}
              />
              <ScoreSlider
                dimension="taste"
                value={form.taste}
                onChange={(v) => set("taste", v)}
              />
              <ScoreSlider
                dimension="atmosphere"
                value={form.atmosphere}
                onChange={(v) => set("atmosphere", v)}
              />
              <ScoreSlider
                dimension="overall"
                value={form.overall}
                onChange={(v) => set("overall", v)}
              />
              <div className="rounded-2xl border border-dashed border-[var(--color-mole)]/30 p-4">
                <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-tortilla-deep)]">
                  Working verdict
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-4">
                  <span className="display text-3xl text-[var(--color-mole)]">
                    {scoreVerdict(form.overall)}
                  </span>
                  <ScoreChips score={form.overall} />
                </div>
              </div>
            </motion.div>
          )}

          {step === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <Field label="Comments" full>
                <textarea
                  className="input min-h-[120px] resize-y"
                  value={form.comments}
                  onChange={(e) => set("comments", e.target.value)}
                  placeholder="One memorable detail. The drink that paired well. The thing they got wrong. Something to remember next time."
                />
              </Field>
              <div className="rounded-2xl border border-dashed border-[var(--color-mole)]/30 p-4 grid gap-3 sm:grid-cols-2 text-sm">
                <Summary
                  label="Restaurant"
                  value={place?.name ?? "—"}
                />
                <Summary
                  label="Address"
                  value={place?.address ?? "—"}
                />
                <Summary label="Meal" value={form.meal || "—"} />
                <Summary label="Reviewer" value={form.reviewer || "—"} />
                <Summary
                  label="Date"
                  value={
                    form.date
                      ? new Date(form.date).toLocaleDateString()
                      : "—"
                  }
                />
                <Summary
                  label="Price"
                  value={
                    form.price
                      ? `${form.currency} ${Number(form.price).toFixed(2)}`
                      : "—"
                  }
                />
                <Summary
                  label="Coordinates"
                  value={
                    place
                      ? `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`
                      : "—"
                  }
                />
                <Summary
                  label="Overall"
                  value={`${form.overall}/10 · ${scoreVerdict(form.overall)}`}
                />
              </div>
              {error && (
                <p className="serif text-sm italic text-[var(--color-salsa-deep)]">
                  {error}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[var(--color-mole)]/30 pt-5">
          <button
            type="button"
            onClick={() => {
              if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
            }}
            disabled={stepIndex === 0}
            className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          {step === "notes" ? (
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-60"
            >
              {submitting ? "Filing…" : "File this plate"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canAdvance}
              className="btn-primary disabled:opacity-50"
            >
              Continue →
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 min-w-0 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <span className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-mole)]/60">
        {label}
      </span>
      {children}
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
        {label}
      </span>
      <span className="serif text-[var(--color-mole)] truncate">
        {value}
      </span>
    </div>
  );
}
