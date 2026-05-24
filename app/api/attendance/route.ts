import { NextRequest, NextResponse } from "next/server";
import { db, type Student } from "@/lib/db";

export const dynamic = "force-dynamic";

const LEVEL_MAP: Record<string, string> = {
  elementary: "Elementary", highschool: "High School",
  seniorhigh: "Senior High", college: "College",
};

const STATUS_WEIGHTS = [
  { status: "present", weight: 70 },
  { status: "late",    weight: 15 },
  { status: "absent",  weight: 12 },
  { status: "excused", weight: 3  },
] as const;

type AttendanceStatus = "present" | "late" | "absent" | "excused";

type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentType: string;
  level: string;
  grade: number | null;
  section: string | null;
  status: AttendanceStatus;
  location: string | null;
  checkInTime: string | null;
  checkOutTime: null;
  lastSeen: string | null;
};

function pickStatus(seed: number): AttendanceStatus {
  const roll = seed % 100;
  let acc = 0;
  for (const { status, weight } of STATUS_WEIGHTS) {
    acc += weight;
    if (roll < acc) return status;
  }
  return "present";
}

export async function GET(req: NextRequest) {
  const url         = new URL(req.url);
  const date        = url.searchParams.get("date") || new Date().toISOString().split("T")[0];
  const filterGrade = url.searchParams.get("grade") || "";
  const filterStatus= url.searchParams.get("status") || "";
  const search      = (url.searchParams.get("search") || "").toLowerCase();

  const dateSeed = date.replace(/-/g, "").slice(-4);
  const seedNum  = parseInt(dateSeed, 10) || 1;

  const locations = ["Main Gate", "Cafeteria", "Science Lab", "Computer Lab", "Auditorium"];

  let records: AttendanceRecord[] = db.students
    .filter((s: Student) => s.status === "active")
    .map((s: Student, i: number): AttendanceRecord => {
      const statusSeed = (i * 7 + seedNum) % 100;
      const status     = pickStatus(statusSeed);
      const isPresent  = status === "present" || status === "late";
      const checkIn    = isPresent
        ? new Date(new Date(date + "T07:00:00").getTime() + (i % 90) * 60_000).toISOString()
        : null;
      return {
        id:           `att-${date}-${s.id}`,
        studentId:    s.id,
        studentName:  s.name,
        studentType:  s.studentType,
        level:        LEVEL_MAP[s.studentType] ?? s.studentType,
        grade:        s.grade,
        section:      s.section,
        status,
        location:     isPresent ? locations[i % locations.length] : null,
        checkInTime:  checkIn,
        checkOutTime: null,
        lastSeen:     isPresent
          ? new Date(new Date(date + "T07:00:00").getTime() + (i % 120) * 60_000 + 3_600_000).toISOString()
          : null,
      };
    });

  if (search)       records = records.filter((r: AttendanceRecord) => r.studentName.toLowerCase().includes(search) || r.studentId.toLowerCase().includes(search));
  if (filterGrade)  { const g = parseInt(filterGrade, 10); records = records.filter((r: AttendanceRecord) => r.grade === g); }
  if (filterStatus) records = records.filter((r: AttendanceRecord) => r.status === filterStatus);

  return NextResponse.json({ records, date }, { headers: { "Cache-Control": "no-store" } });
}
