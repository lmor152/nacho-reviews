import { NextResponse } from "next/server";
import { listReviews } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const all = await listReviews({ status: "all" });
  const reviewers = Array.from(
    new Set(
      all
        .map((r) => r.reviewer.trim())
        .filter((r) => r.length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b));
  return NextResponse.json({ reviewers });
}
