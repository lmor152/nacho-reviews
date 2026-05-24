export type ScoreDimensionKey = "quantity" | "taste" | "atmosphere" | "overall";

export interface ScoringDimension {
  key: ScoreDimensionKey;
  label: string;
  blurb: string;
}

export interface ScoreBand {
  range: [number, number];
  label: string;
  byDimension: Record<ScoreDimensionKey, string>;
}

export const SCORING_DIMENSIONS: ScoringDimension[] = [
  {
    key: "taste",
    label: "Taste",
    blurb:
      "How nice was the meal, how well did the flavours merge, salt-fat-acid-heat balance.",
  },
  {
    key: "quantity",
    label: "Quantity",
    blurb:
      "How big was the meal — would it feed a child or a horse?",
  },
  {
    key: "atmosphere",
    label: "Atmosphere",
    blurb:
      "How fun/nice was the place — did it have good vibes?",
  },
  {
    key: "overall",
    label: "Overall",
    blurb:
      "Weigh up all of the other scores and value-for-money for a total rating.",
  },
];

export const SCORE_BANDS: ScoreBand[] = [
  {
    range: [1, 3],
    label: "1 – 3 · Dealbreaker",
    byDimension: {
      taste: "Send it back",
      quantity: "A whisper",
      atmosphere: "Hostile",
      overall: "Avoid",
    },
  },
  {
    range: [4, 6],
    label: "4 – 6 · Take it or leave it",
    byDimension: {
      taste: "Solid, not special",
      quantity: "Right-sized",
      atmosphere: "Forgettable",
      overall: "Take it or leave it",
    },
  },
  {
    range: [7, 8],
    label: "7 – 8 · Recommend",
    byDimension: {
      taste: "Very good",
      quantity: "Generous",
      atmosphere: "Vibey",
      overall: "Tell your friends",
    },
  },
  {
    range: [9, 10],
    label: "9 – 10 · Hall of fame",
    byDimension: {
      taste: "Religious experience",
      quantity: "Bring a wheelbarrow",
      atmosphere: "Never want to leave",
      overall: "Moving in upstairs",
    },
  },
];

export function scoreColor(score: number): string {
  if (score >= 9) return "var(--color-cheese)";
  if (score >= 7) return "var(--color-tortilla)";
  if (score >= 5) return "var(--color-jalapeno)";
  if (score >= 3) return "var(--color-salsa)";
  return "var(--color-salsa-deep)";
}

export function scoreVerdict(score: number): string {
  if (score >= 9) return "Hall of Fame";
  if (score >= 7) return "Recommend";
  if (score >= 4) return "Take it or leave it";
  return "Dealbreaker";
}

export function bandForScore(score: number): ScoreBand {
  return (
    SCORE_BANDS.find(
      (b) => score >= b.range[0] && score <= b.range[1],
    ) ?? SCORE_BANDS[1]
  );
}
