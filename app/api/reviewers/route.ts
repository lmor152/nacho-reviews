import { NextResponse } from "next/server";
import { listReviews } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await listReviews({ status: "all" });
    const cleaned = all
      .map((r) => {
        const raw = (r as { reviewer?: unknown }).reviewer;
        return typeof raw === "string" ? raw.trim() : "";
      })
      .filter((r) => r.length > 0);
    const reviewers = Array.from(new Set(cleaned)).sort((a, b) =>
      a.localeCompare(b),
    );
    console.log(
      `[/api/reviewers] docs=${all.length} named=${cleaned.length} unique=${reviewers.length}`,
    );
    return NextResponse.json({ reviewers });
  } catch (err) {
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
