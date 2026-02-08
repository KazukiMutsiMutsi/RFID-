import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getMockWorker(id: string) {
  const idx = parseInt(id.replace(/\D/g, "")) || 0;
  const roles = ["Teacher", "Security", "Admin", "Custodial", "IT"] as const;
  const departments = ["Math", "Science", "English", "Facilities", "IT", "Admin"] as const;
  const statuses = ["active", "disabled"] as const;
  const worker = {
    id,
    name: `Worker ${idx}`,
    email: `worker${idx}@school.edu`,
    role: roles[idx % roles.length],
    department: departments[idx % departments.length],
    status: statuses[idx % statuses.length],
    tagId: `TAG-${2000 + (idx % 100)}`,
    lastSeen: new Date(Date.now() - (idx % 12) * 3600_000).toISOString(),
  };
  return worker;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  return NextResponse.json({ worker: getMockWorker(id) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const updates = await req.json();
    const current = getMockWorker(id);
    const next = { ...current, ...updates };
    return NextResponse.json({ worker: next });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
