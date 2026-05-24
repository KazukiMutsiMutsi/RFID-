import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock location data generator
function generateMockLocations() {
  return [
    { name: "Main Gate", count: 45, capacity: 100, status: "normal" as const, recentActivity: 3 },
  ];
}

export async function GET() {
  try {
    const locations = generateMockLocations();

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Location heatmap API error:", error);
    return NextResponse.json({ error: "Failed to fetch location data" }, { status: 500 });
  }
}
