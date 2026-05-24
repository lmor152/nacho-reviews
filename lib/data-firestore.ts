import { randomUUID } from "node:crypto";
import type { DataAdapter } from "@/lib/data-adapter";
import { getDb } from "@/lib/firebase-admin";
import {
  fromStored,
  toStored,
  type NewReviewInput,
  type Review,
  type ReviewStatus,
  type StoredReview,
} from "@/lib/types";

const PENDING = "pending_reviews";
const APPROVED = "approved_reviews";

function collectionFor(status: ReviewStatus): string {
  return status === "approved" ? APPROVED : PENDING;
}

async function findStatus(
  id: string,
): Promise<{ status: ReviewStatus; data: StoredReview } | null> {
  const db = getDb();
  const approved = await db.collection(APPROVED).doc(id).get();
  if (approved.exists) {
    return { status: "approved", data: approved.data() as StoredReview };
  }
  const pending = await db.collection(PENDING).doc(id).get();
  if (pending.exists) {
    return { status: "pending", data: pending.data() as StoredReview };
  }
  return null;
}

export const firestoreAdapter: DataAdapter = {
  async list(opts) {
    const db = getDb();
    const status = opts?.status ?? "approved";
    if (status === "all") {
      const [a, p] = await Promise.all([
        db.collection(APPROVED).get(),
        db.collection(PENDING).get(),
      ]);
      const all = [
        ...a.docs.map((d) =>
          fromStored(d.data() as StoredReview, "approved"),
        ),
        ...p.docs.map((d) => fromStored(d.data() as StoredReview, "pending")),
      ];
      return all.sort((x, y) => (x.date < y.date ? 1 : -1));
    }
    const snap = await db.collection(collectionFor(status)).get();
    return snap.docs
      .map((d) => fromStored(d.data() as StoredReview, status))
      .sort((x, y) => (x.date < y.date ? 1 : -1));
  },

  async get(id) {
    const found = await findStatus(id);
    if (!found) return null;
    return fromStored(found.data, found.status);
  },

  async create(input: NewReviewInput) {
    const db = getDb();
    const status: ReviewStatus = input.status ?? "pending";
    const id = randomUUID().slice(0, 8);
    const review: Review = {
      ...input,
      id,
      status,
      submittedAt: new Date().toISOString(),
    };
    await db
      .collection(collectionFor(status))
      .doc(id)
      .set(toStored(review));
    return review;
  },

  async setStatus(id, status) {
    const found = await findStatus(id);
    if (!found) return null;
    if (found.status === status) {
      return fromStored(found.data, status);
    }
    const db = getDb();
    const next: StoredReview = { ...found.data, review_id: id };
    await db.collection(collectionFor(status)).doc(id).set(next);
    await db.collection(collectionFor(found.status)).doc(id).delete();
    return fromStored(next, status);
  },

  async remove(id) {
    const found = await findStatus(id);
    if (!found) return false;
    const db = getDb();
    await db.collection(collectionFor(found.status)).doc(id).delete();
    return true;
  },
};
