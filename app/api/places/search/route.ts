import { NextResponse } from "next/server";
import { getPlacesApiKey, searchPlaces } from "@/lib/places";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (!getPlacesApiKey()) {
    return NextResponse.json(
      { configured: false, places: [] },
      { status: 200 },
    );
  }
  try {
    const places = await searchPlaces(q);
    return NextResponse.json({ configured: true, places });
  } catch {
    return NextResponse.json(
      { configured: true, places: [], error: "Lookup failed" },
      { status: 200 },
    );
  }
}
