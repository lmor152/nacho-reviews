import { NextResponse } from "next/server";
import { listReviews } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Diagnostics {
  docs: number;
  withReviewer: number;
  unique: number;
  sampleReviewerKeys: string[];
  error: string | null;
  errorStack?: string;
  generatedAt: string;
}

export async function GET() {
  const diag: Diagnostics = {
    docs: 0,
    withReviewer: 0,
    unique: 0,
    sampleReviewerKeys: [],
    error: null,
    generatedAt: new Date().toISOString(),
  };
  try {
    const all = await listReviews({ status: "all" });
    diag.docs = all.length;
    // Capture the *raw* shape of the reviewer field on the first few docs
    // so we can see in the response whether something arrived as int / null /
    // missing instead of a string.
    diag.sampleReviewerKeys = all
      .slice(0, 5)
      .map((r) => {
        const raw = (r as { reviewer?: unknown }).reviewer;
        if (raw == null) return "<null|undefined>";
        return `${typeof raw}:${JSON.stringify(raw).slice(0, 40)}`;
      });

    const cleaned = all
      .map((r) => {
        const raw = (r as { reviewer?: unknown }).reviewer;
        return typeof raw === "string" ? raw.trim() : "";
      })
      .filter((r) => r.length > 0);
    diag.withReviewer = cleaned.length;
    const reviewers = Array.from(new Set(cleaned)).sort((a, b) =>
      a.localeCompare(b),
    );
    diag.unique = reviewers.length;

    // eslint-disable-next-line no-console
    console.log("[/api/reviewers]", JSON.stringify(diag));
    return NextResponse.json({ reviewers, _diag: diag });
  } catch (err) {
    diag.error = err instanceof Error ? err.message : String(err);
    diag.errorStack = err instanceof Error ? err.stack : undefined;
    // eslint-disable-next-line no-console
    console.error("[/api/reviewers] failed", err);
    return NextResponse.json(
      { reviewers: [], _diag: diag },
      { status: 200 },
    );
  }
}
