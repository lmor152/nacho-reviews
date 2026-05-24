import { NextResponse } from "next/server";
import { deleteReview, getReview, updateReviewStatus } from "@/lib/data";
import { isAdminAuthorised } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function PATCH(req: Request, { params }: Params) {
  if (!isAdminAuthorised(req)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | { status?: "approved" | "pending" }
    | null;
  if (!body?.status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }
  const updated = await updateReviewStatus(id, body.status);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ review: updated });
}

export async function DELETE(req: Request, { params }: Params) {
  if (!isAdminAuthorised(req)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteReview(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
