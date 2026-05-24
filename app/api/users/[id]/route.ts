import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = db.admins.find(a => a.id === params.id);
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { password: _pw, ...safe } = admin;
  return NextResponse.json({ user: safe });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.admins.findIndex(a => a.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    db.admins[idx] = { ...db.admins[idx], ...body, id: params.id };
    const { password: _pw2, ...safe } = db.admins[idx];
    return NextResponse.json({ user: safe });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_req2: NextRequest, { params }: { params: { id: string } }) {
  const idx = db.admins.findIndex(a => a.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  db.admins.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
