import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const doors = [
    { id: "d1", name: "Main Gate", status: "online", lastHeartbeat: new Date(now - 10_000).toISOString() },
    { id: "d2", name: "Library", status: "offline", lastHeartbeat: new Date(now - 120_000).toISOString() },
    { id: "d3", name: "Gym", status: "online", lastHeartbeat: new Date(now - 25_000).toISOString() },
    { id: "d4", name: "Lab A", status: "online", lastHeartbeat: new Date(now - 6_000).toISOString() },
  ] as const;

  return NextResponse.json({ doors }, { headers: { "Cache-Control": "no-store" } });
}
