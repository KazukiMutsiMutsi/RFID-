import { NextRequest, NextResponse } from "next/server";
import { db, addScan, nextId } from "@/lib/db";

export const dynamic = "force-dynamic";

const LEVEL_MAP: Record<string, string> = {
  elementary: "Elementary", highschool: "High School",
  seniorhigh: "Senior High", college: "College",
};

export async function GET() {
  const now = Date.now();

  const gate = {
    id: "d1",
    name: "Main Gate",
    status: "online" as const,
    lastHeartbeat: new Date(now - 8_000).toISOString(),
  };

  const scans    = db.scans.slice(0, 50);
  const totalIn  = db.scans.filter(s => s.direction === "in").length;
  const totalOut = db.scans.filter(s => s.direction === "out").length;

  return NextResponse.json(
    { gate, scans, totalIn, totalOut },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** POST /api/dashboard/doors — simulate an RFID tap at the gate */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = String(body?.studentId || "").trim();
    const direction = body?.direction === "out" ? "out" : "in";

    const student = db.students.find(s => s.id === studentId || s.tagId === studentId);
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const scan = {
      id: nextId("scan"),
      studentId: student.id,
      studentName: student.name,
      level: LEVEL_MAP[student.studentType] ?? student.studentType,
      direction: direction as "in" | "out",
      time: new Date().toISOString(),
    };

    addScan(scan);

    // Update student lastSeen
    const idx = db.students.findIndex(s => s.id === student.id);
    if (idx !== -1) db.students[idx].lastSeen = scan.time;

    return NextResponse.json({ scan }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
