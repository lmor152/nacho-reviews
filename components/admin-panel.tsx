"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Review } from "@/lib/types";
import { ChipIcon } from "@/components/chip-icon";
import { ScoreChips } from "@/components/score-display";
import { scoreColor, scoreVerdict } from "@/lib/scoring";

const STORAGE_KEY = "nachodex.admin";
const ADMIN_HEADER = "x-nacho-admin";

interface AdminPanelProps {
  initialPending: Review[];
  initialApproved: Review[];
}

export function AdminPanel({
  initialPending,
  initialApproved,
}: AdminPanelProps) {
  const [pending, setPending] = useState(initialPending);
  const [approved, setApproved] = useState(initialApproved);
  const [password, setPassword] = useState<string>("");
  const [authed, setAuthed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      void verify(stored, false);
    }
  }, []);

  async function verify(pw: string, manual: boolean = true) {
    try {
      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { [ADMIN_HEADER]: pw },
      });
      const data = (await res.json()) as { ok: boolean };
      if (!data.ok) {
        if (manual) setError("That password isn't right.");
        return;
      }
      setAuthed(true);
      setError(null);
      window.localStorage.setItem(STORAGE_KEY, pw);
      setPassword(pw);
    } catch {
      setError("Could not reach the server.");
    }
  }

  function logout() {
    setAuthed(false);
    setPassword("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function setStatus(id: string, status: Review["status"]) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          [ADMIN_HEADER]: password,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { review: Review };
      const target = data.review;
      setPending((p) => p.filter((r) => r.id !== id));
      setApproved((p) => p.filter((r) => r.id !== id));
      if (status === "approved") setApproved((p) => [target, ...p]);
      if (status === "pending") setPending((p) => [target, ...p]);
    } catch {
      setError("Update failed. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function destroy(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        headers: { [ADMIN_HEADER]: password },
      });
      if (!res.ok) throw new Error();
      setPending((p) => p.filter((r) => r.id !== id));
      setApproved((p) => p.filter((r) => r.id !== id));
    } catch {
      setError("Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  if (!authed) {
    return (
      <div className="panel mx-auto max-w-md p-7">
        <div className="flex items-center gap-3">
          <ChipIcon size={36} rotate={-12} />
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
              Restricted area
            </p>
            <h3 className="display text-2xl text-[var(--color-mole)]">
              Sign in, chip-tender.
            </h3>
          </div>
        </div>
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void verify(password);
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-mole)]/60">
              Password
            </span>
            <input
              type="password"
              autoComplete="off"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="default: queso"
            />
          </label>
          {error && (
            <p className="serif text-sm italic text-[var(--color-salsa-deep)]">
              {error}
            </p>
          )}
          <button type="submit" className="btn-primary self-start">
            Open the kitchen
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: "pending" | "approved"; label: string; count: number }[] =
    [
      { id: "pending", label: "Awaiting", count: pending.length },
      { id: "approved", label: "Approved", count: approved.length },
    ];

  const list = tab === "pending" ? pending : approved;

  return (
    <div className="flex flex-col gap-6">
      <div className="panel flex flex-wrap items-center justify-between gap-3 p-3">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.id
                  ? "bg-[var(--color-mole)] text-[var(--color-cream-light)]"
                  : "border border-[var(--color-mole)]/30 text-[var(--color-mole)] hover:bg-[var(--color-paper-deep)]"
              }`}
            >
              <span className="mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                {t.id}
              </span>
              <span className="font-medium">{t.label}</span>
              <span
                className={`mono text-[10px] tracking-[0.12em] rounded-full px-1.5 ${
                  tab === t.id
                    ? "bg-[var(--color-cheese)] text-[var(--color-mole)]"
                    : "bg-[var(--color-paper-deep)] text-[var(--color-mole)]"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <button onClick={logout} className="btn-ghost text-xs">
          Sign out
        </button>
      </div>

      {error && (
        <p className="serif text-sm italic text-[var(--color-salsa-deep)]">
          {error}
        </p>
      )}

      {list.length === 0 ? (
        <div className="panel grid place-items-center p-12 text-center">
          <p className="display text-3xl text-[var(--color-mole)]">
            Nothing here.
          </p>
          <p className="serif italic text-[var(--color-mole)]/70">
            {tab === "pending"
              ? "Inbox zero. Go eat more nachos."
              : "No approved plates yet."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-5">
          <AnimatePresence>
            {list.map((r) => (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -32, scale: 0.96 }}
                transition={{ duration: 0.32 }}
                className="panel relative p-4 sm:p-6 min-w-0"
              >
                <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
                  <div className="min-w-0">
                    <p className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-tortilla-deep)] break-words">
                      submitted{" "}
                      {new Date(r.submittedAt).toLocaleString()}
                      {" · "}
                      {r.reviewer}
                    </p>
                    <h3 className="display text-xl sm:text-2xl text-[var(--color-mole)] break-words">
                      {r.restaurant}
                    </h3>
                    <p className="serif italic text-[var(--color-mole)]/85 break-words">
                      {r.meal}
                    </p>
                    {r.description && (
                      <p className="mt-2 serif text-sm text-[var(--color-mole)]/80">
                        {r.description}
                      </p>
                    )}
                    {r.comments && (
                      <p className="mt-2 serif italic text-sm text-[var(--color-mole)]/75">
                        “{r.comments}”
                      </p>
                    )}
                    <p className="mt-3 mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-mole)]/60">
                      {r.latitude != null && r.longitude != null
                        ? `${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}`
                        : "no coordinates"}{" "}
                      · {r.currency} {r.price.toFixed(2)} ·{" "}
                      {new Date(r.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
                    <Mini label="Quantity" value={r.quantity} />
                    <Mini label="Taste" value={r.taste} />
                    <Mini label="Atmosphere" value={r.atmosphere} />
                    <Mini label="Overall" value={r.overall} />
                    <div className="col-span-4 lg:col-span-2">
                      <ScoreChips score={r.overall} />
                      <p className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-mole)]/60">
                        verdict ·{" "}
                        <span
                          className="display normal-case tracking-normal"
                          style={{ color: scoreColor(r.overall) }}
                        >
                          {scoreVerdict(r.overall)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dashed border-[var(--color-mole)]/30 pt-4">
                  {r.status !== "approved" && (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => setStatus(r.id, "approved")}
                      className="rounded-full bg-[var(--color-jalapeno)] px-4 py-2 text-sm font-medium text-[var(--color-cream-light)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      Approve →
                    </button>
                  )}
                  {r.status === "approved" && (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => setStatus(r.id, "pending")}
                      className="rounded-full border border-[var(--color-mole)]/40 px-4 py-2 text-sm text-[var(--color-mole)] hover:bg-[var(--color-paper-deep)] disabled:opacity-50"
                    >
                      Send back to queue
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Reject and delete the ${r.restaurant} review?`,
                        )
                      ) {
                        void destroy(r.id);
                      }
                    }}
                    className="rounded-full border border-[var(--color-salsa)] px-4 py-2 text-sm text-[var(--color-salsa-deep)] transition-colors hover:bg-[var(--color-salsa)] hover:text-[var(--color-cream-light)] disabled:opacity-50"
                  >
                    {r.status === "pending" ? "Reject" : "Delete"}
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-mole)]/55">
        {label}
      </span>
      <span
        className="display text-2xl"
        style={{ color: scoreColor(value) }}
      >
        {value}
        <span className="mono text-[10px] ml-0.5 text-[var(--color-mole)]/55">
          /10
        </span>
      </span>
    </div>
  );
}
