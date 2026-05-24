"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { scoreColor } from "@/lib/scoring";

interface Datum {
  score: number;
  count: number;
}

export function ScoreDistributionChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 8, left: 0 }}
        >
          <CartesianGrid
            stroke="rgba(42,24,18,0.12)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="score"
            tick={{ fill: "var(--color-mole)", fontFamily: "var(--font-mono)" }}
            stroke="var(--color-mole)"
            tickLine={false}
            label={{
              value: "score",
              position: "insideBottom",
              offset: -2,
              fill: "var(--color-mole)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
            }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--color-mole)", fontFamily: "var(--font-mono)" }}
            stroke="var(--color-mole)"
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "rgba(42,24,18,0.06)" }}
            contentStyle={{
              background: "var(--color-cream-light)",
              border: "1.5px solid var(--color-mole)",
              borderRadius: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-mole)",
            }}
            labelFormatter={(v) => `score ${v}`}
            formatter={(value) => [`${value}`, "plates"]}
          />
          <Bar dataKey="count" radius={[8, 8, 2, 2]} animationDuration={900}>
            {data.map((d) => (
              <Cell key={d.score} fill={scoreColor(d.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
