import { NextResponse } from "next/server";
import { listReviews } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await listReviews({ status: "all" });
    const reviewers = Array.from(
      new Set(
        all
          .map((r) => {
            // Be defensive: legacy Firestore docs occasionally have missing
            // or non-string reviewer fields; coerce to string and skip blanks.
            const raw = (r as { reviewer?: unknown }).reviewer;
            return typeof raw === "string" ? raw.trim() : "";
          })
          .filter((r) => r.length > 0),
      ),
    ).sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ reviewers });
  } catch (err) {
    // Log to Cloud Run and degrade gracefully — the picker will fall back to
    // a free-text input rather than blocking submissions.
    console.error("[/api/reviewers] failed", err);
    return NextResponse.json(
      {
        reviewers: [],
        error: err instanceof Error ? err.message : "lookup failed",
      },
      { status: 200 },
    );
  }
}
