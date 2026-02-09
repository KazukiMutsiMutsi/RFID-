import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock location data generator
function generateMockLocations() {
  return [
    { name: "Main Gate", count: 45, capacity: 100, status: "normal" as const, recentActivity: 3 },
    { name: "Library", count: 78, capacity: 80, status: "crowded" as const, recentActivity: 5 },
    { name: "Cafeteria", count: 120, capacity: 150, status: "crowded" as const, recentActivity: 12 },
    { name: "Gym", count: 35, capacity: 60, status: "normal" as const, recentActivity: 2 },
    { name: "Science Lab", count: 28, capacity: 30, status: "crowded" as const, recentActivity: 1 },
    { name: "Computer Lab", count: 42, capacity: 50, status: "normal" as const, recentActivity: 0 },
    { name: "Auditorium", count: 200, capacity: 200, status: "full" as const, recentActivity: 8 },
    { name: "Playground", count: 65, capacity: 200, status: "normal" as const, recentActivity: 4 },
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
