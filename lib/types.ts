export type Reviewer = "Liam" | "Madi" | (string & {});

export type ReviewStatus = "approved" | "pending";

export interface Review {
  id: string;
  restaurant: string;
  meal: string;
  description: string;
  price: number;
  currency: string;
  reviewer: Reviewer;
  quantity: number;
  taste: number;
  atmosphere: number;
  overall: number;
  comments: string;
  date: string; // ISO yyyy-mm-dd
  latitude?: number;
  longitude?: number;
  status: ReviewStatus;
  submittedAt: string;
}

export type NewReviewInput = Omit<Review, "id" | "status" | "submittedAt"> & {
  status?: ReviewStatus;
};

export interface DashboardStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  averageOverall: number;
  averagePrice: number;
  totalSpent: number;
  topRestaurant: { name: string; score: number } | null;
  uniqueRestaurants: number;
  reviewerSplit: { reviewer: string; count: number; avgOverall: number }[];
  byMonth: { month: string; count: number; avgOverall: number }[];
  scoreDistribution: { score: number; count: number }[];
  dimensions: { dimension: string; avg: number }[];
}

/**
 * Storage shape that lives in Firestore. Field names match the previous
 * version of this app so existing data is forward-compatible.
 */
export interface StoredReview {
  review_id: string;
  name: string;
  meal: string;
  meal_description: string;
  price: number;
  currency?: string;
  reviewer: string;
  quantity_score: number;
  taste_score: number;
  atmosphere_score: number;
  overall_score: number;
  comments: string;
  date: string;
  latitude?: number;
  longitude?: number;
  submitted_at?: string;
}

export function toStored(input: Review): StoredReview {
  return {
    review_id: input.id,
    name: input.restaurant,
    meal: input.meal,
    meal_description: input.description,
    price: input.price,
    currency: input.currency,
    reviewer: input.reviewer,
    quantity_score: input.quantity,
    taste_score: input.taste,
    atmosphere_score: input.atmosphere,
    overall_score: input.overall,
    comments: input.comments,
    date: input.date,
    latitude: input.latitude,
    longitude: input.longitude,
    submitted_at: input.submittedAt,
  };
}

function asString(value: unknown, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function fromStored(
  data: StoredReview,
  status: ReviewStatus,
): Review {
  // Production Firestore data was written by an older app that didn't enforce
  // any schema, so coerce every field defensively here. A single doc with a
  // missing or unexpectedly-typed field would otherwise propagate undefined
  // through the entire app (and explode in places that call `.trim()` etc.).
  return {
    id: asString(data.review_id),
    restaurant: asString(data.name),
    meal: asString(data.meal),
    description: asString(data.meal_description),
    price: asNumber(data.price),
    currency: asString(data.currency, "GBP"),
    reviewer: asString(data.reviewer),
    quantity: asNumber(data.quantity_score),
    taste: asNumber(data.taste_score),
    atmosphere: asNumber(data.atmosphere_score),
    overall: asNumber(data.overall_score),
    comments: asString(data.comments),
    date: asString(data.date),
    latitude:
      typeof data.latitude === "number" ? data.latitude : undefined,
    longitude:
      typeof data.longitude === "number" ? data.longitude : undefined,
    status,
    submittedAt:
      typeof data.submitted_at === "string"
        ? data.submitted_at
        : new Date().toISOString(),
  };
}
