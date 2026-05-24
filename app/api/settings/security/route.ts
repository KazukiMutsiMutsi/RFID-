import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ config: db.settings.security }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    db.settings.security = { ...db.settings.security, ...body };
    return NextResponse.json({ success: true, config: db.settings.security });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 400 });
  }
}
