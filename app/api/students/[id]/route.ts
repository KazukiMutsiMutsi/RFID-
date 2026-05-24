import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const student = db.students.find(s => s.id === params.id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ student });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.students.findIndex(s => s.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    const updated = { ...db.students[idx], ...body, id: params.id };
    db.students[idx] = updated;
    return NextResponse.json({ student: updated });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.students.findIndex(s => s.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.students.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
