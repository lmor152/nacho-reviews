import type { NewReviewInput, Review } from "@/lib/types";

export interface DataAdapter {
  list(opts?: { status?: Review["status"] | "all" }): Promise<Review[]>;
  get(id: string): Promise<Review | null>;
  create(input: NewReviewInput): Promise<Review>;
  setStatus(id: string, status: Review["status"]): Promise<Review | null>;
  remove(id: string): Promise<boolean>;
}
