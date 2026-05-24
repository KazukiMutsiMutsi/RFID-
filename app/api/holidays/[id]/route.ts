import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.holidays.findIndex(h => h.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    db.holidays[idx] = { ...db.holidays[idx], ...body, id: params.id };
    return NextResponse.json({ holiday: db.holidays[idx] });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.holidays.findIndex(h => h.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.holidays.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
