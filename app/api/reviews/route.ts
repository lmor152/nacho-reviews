import { NextResponse } from "next/server";
import { z } from "zod";
import { createReview, listReviews } from "@/lib/data";
import type { Review } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  restaurant: z.string().min(1).max(140),
  meal: z.string().min(1).max(140),
  description: z.string().max(800).default(""),
  price: z.number().nonnegative().max(9999),
  currency: z.string().min(1).max(8).default("GBP"),
  reviewer: z.string().min(1).max(40),
  quantity: z.number().int().min(1).max(10),
  taste: z.number().int().min(1).max(10),
  atmosphere: z.number().int().min(1).max(10),
  overall: z.number().int().min(1).max(10),
  comments: z.string().max(2000).default(""),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, "Date must be ISO yyyy-mm-dd"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as Review["status"] | "all" | null;
  const data = await listReviews({ status: status ?? "approved" });
  return NextResponse.json({ reviews: data });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const created = await createReview({ ...parsed.data, status: "pending" });
  return NextResponse.json({ review: created }, { status: 201 });
}
