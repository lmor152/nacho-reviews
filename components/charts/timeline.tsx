"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Datum {
  month: string;
  count: number;
  avgOverall: number;
}

export function TimelineChart({ data }: { data: Datum[] }) {
  const formatted = data.map((d) => ({
    ...d,
    avgOverall: Number(d.avgOverall.toFixed(2)),
    label: new Date(`${d.month}-01`).toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    }),
  }));

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formatted}
          margin={{ top: 8, right: 16, bottom: 4, left: -12 }}
        >
          <defs>
            <linearGradient id="cheeseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-cheese)" stopOpacity={0.85} />
              <stop offset="100%" stopColor="var(--color-tortilla)" stopOpacity={0.18} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(42,24,18,0.12)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke="var(--color-mole)"
            tickLine={false}
            tick={{ fill: "var(--color-mole)", fontFamily: "var(--font-mono)", fontSize: 11 }}
          />
          <YAxis
            domain={[0, 10]}
            stroke="var(--color-mole)"
            tickLine={false}
            tick={{ fill: "var(--color-mole)", fontFamily: "var(--font-mono)", fontSize: 11 }}
            width={28}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-cream-light)",
              border: "1.5px solid var(--color-mole)",
              borderRadius: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-mole)",
            }}
            formatter={(value, key) => {
              const num =
                typeof value === "number" ? value : Number(value ?? 0);
              return [
                key === "avgOverall" ? num.toFixed(2) : `${num}`,
                key === "avgOverall" ? "avg overall" : "plates",
              ];
            }}
          />
          <Area
            type="monotone"
            dataKey="avgOverall"
            stroke="var(--color-salsa)"
            strokeWidth={2.5}
            fill="url(#cheeseFill)"
            animationDuration={1100}
            dot={{
              r: 4,
              fill: "var(--color-cream-light)",
              stroke: "var(--color-salsa)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
