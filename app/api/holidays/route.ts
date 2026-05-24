import { NextRequest, NextResponse } from "next/server";
import { db, nextId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ holidays: db.holidays }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const date = String(body?.date || "").trim();
    const name = String(body?.name || "").trim();
    if (!date || !name) return NextResponse.json({ error: "date and name are required" }, { status: 400 });

    const holiday = {
      id: nextId("holiday"),
      date,
      name,
      type: (body?.type || "school") as "regular" | "special" | "school",
    };
    db.holidays.push(holiday);
    return NextResponse.json({ holiday }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
