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

export function fromStored(
  data: StoredReview,
  status: ReviewStatus,
): Review {
  return {
    id: data.review_id,
    restaurant: data.name,
    meal: data.meal,
    description: data.meal_description ?? "",
    price: Number(data.price ?? 0),
    currency: data.currency ?? "GBP",
    reviewer: data.reviewer,
    quantity: Number(data.quantity_score ?? 0),
    taste: Number(data.taste_score ?? 0),
    atmosphere: Number(data.atmosphere_score ?? 0),
    overall: Number(data.overall_score ?? 0),
    comments: data.comments ?? "",
    date: data.date,
    latitude:
      typeof data.latitude === "number" ? data.latitude : undefined,
    longitude:
      typeof data.longitude === "number" ? data.longitude : undefined,
    status,
    submittedAt: data.submitted_at ?? new Date().toISOString(),
  };
}
