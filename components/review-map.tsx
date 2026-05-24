"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Review } from "@/lib/types";
import { scoreColor } from "@/lib/scoring";

function buildChipIcon(score: number) {
  const colour = scoreColor(score);
  const html = `
    <div class="chip-marker" style="position:relative;display:flex;align-items:center;justify-content:center">
      <svg width="42" height="42" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--color-cheese)"/>
            <stop offset="55%" stop-color="${colour}"/>
            <stop offset="100%" stop-color="var(--color-tortilla-deep)"/>
          </linearGradient>
        </defs>
        <path d="M50 8 L92 88 L8 88 Z" fill="url(#cg)" stroke="var(--color-mole)" stroke-width="3" stroke-linejoin="round"/>
        <path d="M50 14 L82 78" stroke="rgba(255,247,219,0.7)" stroke-width="2.5" stroke-linecap="round"/>
        <text x="50" y="74" text-anchor="middle" font-family="var(--font-display)" font-size="32" fill="var(--color-mole)">${score}</text>
      </svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconSize: [42, 42],
    iconAnchor: [21, 38],
    popupAnchor: [0, -36],
  });
}

interface ReviewMapProps {
  reviews: Review[];
}

function FitToMarkers({ reviews }: { reviews: Review[] }) {
  const map = useMap();
  useEffect(() => {
    const points = reviews
      .filter((r) => r.latitude != null && r.longitude != null)
      .map((r) => [r.latitude!, r.longitude!] as [number, number]);
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 5);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds.pad(0.4));
  }, [map, reviews]);
  return null;
}

export default function ReviewMap({ reviews }: ReviewMapProps) {
  const located = useMemo(
    () => reviews.filter((r) => r.latitude != null && r.longitude != null),
    [reviews],
  );
  const ref = useRef<L.Map | null>(null);

  if (located.length === 0) {
    return (
      <div className="grid-paper relative grid h-[360px] w-full place-items-center overflow-hidden rounded-[20px] border-[1.5px] border-dashed border-[var(--color-mole)]/40 p-6 text-center">
        <div className="flex max-w-md flex-col items-center gap-2">
          <p className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
            no coordinates yet
          </p>
          <p className="display text-3xl text-[var(--color-mole)]">
            The map is empty.
          </p>
          <p className="serif italic text-sm text-[var(--color-mole)]/75">
            Submit a review with the Google Places typeahead, or connect
            Firestore — pins appear automatically once any review has lat/long.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[360px] sm:h-[420px] lg:h-[460px] w-full overflow-hidden rounded-[20px] border-[1.5px] border-[var(--color-mole)]/40">
      <MapContainer
        ref={ref}
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map((r) => (
          <Marker
            key={r.id}
            position={[r.latitude!, r.longitude!]}
            icon={buildChipIcon(r.overall)}
          >
            <Popup>
              <div className="flex flex-col gap-1">
                <span className="display text-base text-[var(--color-mole)]">
                  {r.restaurant}
                </span>
                <span className="serif italic text-xs text-[var(--color-mole)]/80">
                  {r.meal}
                </span>
                <span className="mono text-[11px] text-[var(--color-mole)]">
                  overall {r.overall}/10 · {r.reviewer} ·{" "}
                  {new Date(r.date).toLocaleDateString()}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitToMarkers reviews={located} />
      </MapContainer>
      <div className="pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3 z-[400] panel px-2.5 py-1.5 sm:px-3 sm:py-2">
        <p className="mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--color-mole)]/70">
          Plotted · {located.length} of {reviews.length}
        </p>
      </div>
    </div>
  );
}
