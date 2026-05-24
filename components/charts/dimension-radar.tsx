"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface Datum {
  dimension: string;
  avg: number;
}

export function DimensionRadarChart({ data }: { data: Datum[] }) {
  const formatted = data.map((d) => ({
    dimension: d.dimension.charAt(0).toUpperCase() + d.dimension.slice(1),
    score: Number(d.avg.toFixed(2)),
  }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={formatted} outerRadius="78%">
          <PolarGrid stroke="rgba(42,24,18,0.18)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: "var(--color-mole)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
            }}
            tickFormatter={(v: string) => v.toUpperCase()}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{
              fill: "var(--color-mole)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}
            stroke="rgba(42,24,18,0.3)"
            tickCount={6}
          />
          <Radar
            name="avg"
            dataKey="score"
            stroke="var(--color-salsa)"
            fill="var(--color-tortilla)"
            fillOpacity={0.55}
            animationDuration={1100}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
