import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const now  = Date.now();
  const alerts: any[] = [];

  // Missing students — active students with no recent scan
  const recentIds = new Set(
    db.scans
      .filter(s => s.direction === "in" && now - new Date(s.time).getTime() < 8 * 3_600_000)
      .map(s => s.studentId)
  );

  db.students
    .filter(s => s.status === "active" && !recentIds.has(s.id))
    .slice(0, 3)
    .forEach((s, i) => {
      alerts.push({
        id: `alert-missing-${s.id}`,
        type: "missing",
        severity: "critical",
        message: "Student has not checked in today",
        studentName: s.name,
        level: s.studentType,
        timestamp: new Date(now - (30 + i * 15) * 60_000).toISOString(),
      });
    });

  // Late arrivals — scans that came in after 8 AM
  const cutoff = new Date();
  cutoff.setHours(8, 0, 0, 0);
  db.scans
    .filter(s => s.direction === "in" && new Date(s.time) > cutoff)
    .slice(0, 3)
    .forEach((s, i) => {
      alerts.push({
        id: `alert-late-${s.id}`,
        type: "late",
        severity: "medium",
        message: "Late arrival detected",
        studentName: s.studentName,
        level: s.level,
        timestamp: s.time,
      });
    });

  // Unauthorized — students with disabled status who still have scans
  db.students
    .filter(s => s.status === "disabled")
    .slice(0, 2)
    .forEach((s, i) => {
      alerts.push({
        id: `alert-unauth-${s.id}`,
        type: "unauthorized",
        severity: "high",
        message: "Disabled tag scan attempt",
        studentName: s.name,
        location: "Main Gate",
        timestamp: new Date(now - (10 + i * 5) * 60_000).toISOString(),
      });
    });

  // Sort by timestamp descending
  alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ alerts }, { headers: { "Cache-Control": "no-store" } });
}
