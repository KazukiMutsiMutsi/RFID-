import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Mock statistics - in a real app, calculate from database
    const stats = {
      totalStudents: 120,
      presentToday: 98,
      absentToday: 15,
      lateToday: 7,
      attendanceRate: 87.5,
      totalEvents: 1247,
      activeReaders: 8,
      totalReaders: 8,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
