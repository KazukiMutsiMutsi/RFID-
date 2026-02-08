import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const tag = {
    id,
    uid: `UID-${(parseInt(id.replace(/\D/g, "")) || 0).toString(16)}`,
    status: "assigned",
    type: "student",
    ownerId: "s-10001",
    ownerType: "student",
    issuedAt: new Date(Date.now() - 86400000).toISOString(),
    revokedAt: null,
    lastSeen: new Date().toISOString(),
    notes: "Mock tag for demo",
  };
  return NextResponse.json({ tag }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const updates = await req.json();
    return NextResponse.json({ tag: { id, ...updates } });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
