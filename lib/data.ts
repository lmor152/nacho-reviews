import type { DashboardStats, NewReviewInput, Review } from "@/lib/types";
import type { DataAdapter } from "@/lib/data-adapter";
import { jsonAdapter } from "@/lib/data-json";
import { firestoreAdapter } from "@/lib/data-firestore";
import { isFirestoreConfigured } from "@/lib/firebase-admin";

let backend: DataAdapter | null = null;
let backendName: "firestore" | "json" = "json";

function adapter(): DataAdapter {
  if (backend) return backend;
  if (isFirestoreConfigured()) {
    backend = firestoreAdapter;
    backendName = "firestore";
  } else {
    backend = jsonAdapter;
    backendName = "json";
  }
  return backend;
}

export function getBackendName(): "firestore" | "json" {
  void adapter();
  return backendName;
}

export async function listReviews(opts?: {
  status?: Review["status"] | "all";
}): Promise<Review[]> {
  return adapter().list(opts);
}

export async function getReview(id: string): Promise<Review | null> {
  return adapter().get(id);
}

export async function createReview(input: NewReviewInput): Promise<Review> {
  return adapter().create(input);
}

export async function updateReviewStatus(
  id: string,
  status: Review["status"],
): Promise<Review | null> {
  return adapter().setStatus(id, status);
}

export async function deleteReview(id: string): Promise<boolean> {
  return adapter().remove(id);
}

export async function computeStats(): Promise<DashboardStats> {
  const all = await listReviews({ status: "all" });
  const approved = all.filter((r) => r.status === "approved");
  const pending = all.filter((r) => r.status === "pending");

  const total = approved.length;
  const averageOverall = total
    ? approved.reduce((s, r) => s + r.overall, 0) / total
    : 0;
  const averagePrice = total
    ? approved.reduce((s, r) => s + r.price, 0) / total
    : 0;
  const totalSpent = approved.reduce((s, r) => s + r.price, 0);

  const top = [...approved].sort((a, b) => b.overall - a.overall)[0];
  const uniqueRestaurants = new Set(
    approved.map((r) => r.restaurant.toLowerCase()),
  ).size;

  const reviewerMap = new Map<string, { count: number; total: number }>();
  for (const r of approved) {
    const cur = reviewerMap.get(r.reviewer) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += r.overall;
    reviewerMap.set(r.reviewer, cur);
  }
  const reviewerSplit = [...reviewerMap.entries()]
    .map(([reviewer, v]) => ({
      reviewer,
      count: v.count,
      avgOverall: v.count ? v.total / v.count : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const monthMap = new Map<string, { count: number; total: number }>();
  for (const r of approved) {
    const ym = r.date.slice(0, 7);
    const cur = monthMap.get(ym) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += r.overall;
    monthMap.set(ym, cur);
  }
  const byMonth = [...monthMap.entries()]
    .map(([month, v]) => ({
      month,
      count: v.count,
      avgOverall: v.count ? v.total / v.count : 0,
    }))
    .sort((a, b) => (a.month < b.month ? -1 : 1));

  const scoreDistribution = Array.from({ length: 10 }, (_, i) => i + 1).map(
    (score) => ({
      score,
      count: approved.filter((r) => r.overall === score).length,
    }),
  );

  const dimensions = (
    ["quantity", "taste", "atmosphere", "overall"] as const
  ).map((key) => ({
    dimension: key,
    avg: total ? approved.reduce((s, r) => s + r[key], 0) / total : 0,
  }));

  return {
    totalReviews: all.length,
    approvedReviews: approved.length,
    pendingReviews: pending.length,
    averageOverall,
    averagePrice,
    totalSpent,
    topRestaurant: top
      ? { name: top.restaurant, score: top.overall }
      : null,
    uniqueRestaurants,
    reviewerSplit,
    byMonth,
    scoreDistribution,
    dimensions,
  };
}
