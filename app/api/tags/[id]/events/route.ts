import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const now = Date.now();
  const events = Array.from({ length: 10 }).map((_, i) => ({
    id: `${id}-te-${i}`,
    time: new Date(now - i * 45_000).toISOString(),
    door: ["Main Gate", "Library", "Gym", "Lab A"][i % 4],
    direction: (['IN', 'OUT'] as const)[i % 2],
    status: (['allowed', 'denied'] as const)[i % 2],
  }));
  return NextResponse.json({ events }, { headers: { "Cache-Control": "no-store" } });
}
