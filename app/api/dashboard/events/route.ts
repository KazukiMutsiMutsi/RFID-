import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const events = Array.from({ length: 12 }).map((_, i) => ({
    id: String(i + 1),
    time: new Date(now - i * 60_000).toISOString(),
    person: ["Alice Diaz", "Ben Cruz", "Carla Lim", "D. Santos"][i % 4],
    role: (['Student', 'Staff', 'Student', 'Visitor'] as const)[i % 4],
    tagId: `TAG-${1000 + i}`,
    door: ["Main Gate", "Library", "Gym", "Lab A"][i % 4],
    direction: (['IN', 'OUT'] as const)[i % 2],
    status: (['allowed', 'denied'] as const)[i % 2],
  }));

  return NextResponse.json({ events }, { headers: { "Cache-Control": "no-store" } });
}
