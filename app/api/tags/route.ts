import { NextRequest, NextResponse } from "next/server";
import { db, nextId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url      = new URL(req.url);
  const search   = (url.searchParams.get("search") || "").toLowerCase();
  const status   = url.searchParams.get("status") || "";
  const type     = url.searchParams.get("type") || "";
  const page     = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(5, parseInt(url.searchParams.get("pageSize") || "10", 10)));

  let data = [...db.tags];

  if (search) data = data.filter(t => t.uid.toLowerCase().includes(search) || (t.ownerName || "").toLowerCase().includes(search));
  if (status) data = data.filter(t => t.status === status);
  if (type)   data = data.filter(t => t.type === type);

  const total    = data.length;
  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ data: pageData, page, pageSize, total }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid  = String(body?.uid || "").trim();
    if (!uid) return NextResponse.json({ error: "uid is required" }, { status: 400 });

    const tag = {
      id: nextId("tag"),
      uid,
      type: (body?.type || "student") as "student" | "visitor",
      status: "unassigned" as const,
      ownerId: null,
      ownerName: null,
      issuedAt: new Date().toISOString(),
      revokedAt: null,
      lastSeen: null,
    };

    db.tags.unshift(tag);
    return NextResponse.json({ tag }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
