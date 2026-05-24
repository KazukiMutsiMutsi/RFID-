import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ config: db.settings.rfid }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    db.settings.rfid = { ...db.settings.rfid, ...body };
    return NextResponse.json({ success: true, config: db.settings.rfid });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 400 });
  }
}
