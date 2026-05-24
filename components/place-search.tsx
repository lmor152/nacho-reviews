"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PlaceCandidate } from "@/lib/places";

interface PlaceSearchProps {
  value: PlaceCandidate | null;
  onChange: (next: PlaceCandidate | null) => void;
}

interface SearchResponse {
  configured: boolean;
  places?: PlaceCandidate[];
  error?: string;
}

export function PlaceSearch({ value, onChange }: PlaceSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<PlaceCandidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [configured, setConfigured] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (value) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/places/search?q=${encodeURIComponent(query)}`,
        );
        const data = (await res.json()) as SearchResponse;
        setConfigured(data.configured);
        setResults(data.places ?? []);
        if (data.error) setError(data.error);
      } catch {
        setError("Could not reach Google Places.");
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, value]);

  function pick(place: PlaceCandidate) {
    onChange(place);
    setQuery(place.name);
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setResults([]);
    setOpen(true);
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-mole)]/60">
          Restaurant *
        </span>
        {value ? (
          <div className="flex items-start gap-3 rounded-xl border-[1.5px] border-[var(--color-jalapeno-deep)]/60 bg-[var(--color-cream-light)] px-3 py-3">
            <div className="flex-1 min-w-0">
              <p className="serif text-base text-[var(--color-mole)] truncate">
                {value.name}
              </p>
              {value.address && (
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-mole)]/55 truncate">
                  {value.address}
                </p>
              )}
              <p className="mono text-[10px] tracking-[0.16em] text-[var(--color-jalapeno-deep)]">
                ✓ matched on Google · {value.latitude.toFixed(4)},{" "}
                {value.longitude.toFixed(4)}
              </p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-salsa-deep)] hover:underline"
            >
              change
            </button>
          </div>
        ) : (
          <input
            type="text"
            className="input"
            placeholder="Search Google Places…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
            spellCheck={false}
          />
        )}
        {!configured && !value && (
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-tortilla-deep)]">
            Google Places API key not configured · names will be saved without
            coordinates
          </p>
        )}
      </div>

      <AnimatePresence>
        {!value && open && query.trim().length >= 2 && (
          <motion.ul
            key="results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-[1.5px] border-[var(--color-mole)]/40 bg-[var(--color-cream-light)] shadow-[0_18px_40px_-22px_rgba(42,24,18,0.7)]"
          >
            {loading && (
              <li className="px-4 py-3 mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-mole)]/55">
                searching…
              </li>
            )}
            {!loading && results.length === 0 && (
              <li className="px-4 py-3 serif italic text-sm text-[var(--color-mole)]/65">
                {configured
                  ? "No matches yet — try the name as it appears on Google Maps."
                  : "Set GOOGLE_PLACES_API_KEY (or MAPS_API_KEY) to enable lookup. You can still submit without coordinates."}
              </li>
            )}
            {!loading &&
              results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => pick(p)}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[var(--color-paper-deep)]/70"
                  >
                    <span className="serif text-base text-[var(--color-mole)]">
                      {p.name}
                    </span>
                    {p.address && (
                      <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-mole)]/55">
                        {p.address}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            {error && (
              <li className="px-4 py-2 mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-salsa-deep)]">
                {error}
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
