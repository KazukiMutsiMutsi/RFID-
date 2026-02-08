import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const buckets = [
    { label: "Grade 7", present: 125, late: 6, absent: 18 },
    { label: "Grade 8", present: 118, late: 11, absent: 12 },
    { label: "Grade 9", present: 134, late: 3, absent: 9 },
    { label: "Grade 10", present: 121, late: 10, absent: 20 },
  ];
  return NextResponse.json({ buckets }, { headers: { "Cache-Control": "no-store" } });
}
