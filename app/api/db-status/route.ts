import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/db-status — health check for the in-memory fake backend */
export async function GET() {
  return NextResponse.json({
    status:   "ok",
    uptime:   process.uptime().toFixed(1) + "s",
    counts: {
      students:  db.students.length,
      tags:      db.tags.length,
      scans:     db.scans.length,
      admins:    db.admins.length,
      holidays:  db.holidays.length,
    },
    admins: db.admins.map(a => ({ email: a.email, role: a.role, name: a.name })),
    note: "In-memory store — data resets on server restart",
  }, { headers: { "Cache-Control": "no-store" } });
}
