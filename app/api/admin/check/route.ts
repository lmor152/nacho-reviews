import { NextResponse } from "next/server";
import { isAdminAuthorised } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return NextResponse.json({ ok: isAdminAuthorised(req) });
}
