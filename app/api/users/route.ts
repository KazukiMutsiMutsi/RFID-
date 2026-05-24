import { NextRequest, NextResponse } from "next/server";
import { db, nextId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // Never expose passwords
  const safe = db.admins.map(({ password: _, ...a }) => a);
  return NextResponse.json({ data: safe, total: safe.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const name  = String(body?.name  || "").trim();
    const pw    = String(body?.password || "").trim();
    if (!email || !name || !pw) return NextResponse.json({ error: "email, name and password are required" }, { status: 400 });
    if (db.admins.find(a => a.email === email)) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

    const admin = { id: nextId("admin"), email, name, password: pw, role: (body?.role || "viewer") as "superadmin" | "admin" | "viewer" };
    db.admins.push(admin);
    const { password: _, ...safe } = admin;
    return NextResponse.json({ user: safe }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
