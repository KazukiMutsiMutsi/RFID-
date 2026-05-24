import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const total    = db.students.length;
  const active   = db.students.filter(s => s.status === "active").length;
  const present  = Math.round(active * 0.75);
  const late     = Math.round(active * 0.12);
  const absent   = active - present - late;
  const rate     = active > 0 ? +((present / active) * 100).toFixed(1) : 0;

  const stats = {
    totalStudents:  total,
    activeStudents: active,
    presentToday:   present,
    lateToday:      late,
    absentToday:    Math.max(0, absent),
    attendanceRate: rate,
    totalScans:     db.scans.length,
    totalTags:      db.tags.length,
    assignedTags:   db.tags.filter(t => t.status === "assigned").length,
    totalHolidays:  db.holidays.length,
    adminUsers:     db.admins.length,
  };

  return NextResponse.json({ stats }, { headers: { "Cache-Control": "no-store" } });
}
