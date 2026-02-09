import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock data generator for attendance
function generateMockAttendance(date: string, grade?: string, status?: string) {
  const locations = ["Main Gate", "Library", "Gym", "Cafeteria", "Science Lab", "Computer Lab", "Auditorium"];
  const sections = ["A", "B", "C"];
  const statuses: Array<"present" | "absent" | "late" | "excused"> = ["present", "absent", "late", "excused"];
  const names = [
    "John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", "James Wilson",
    "Olivia Martinez", "William Anderson", "Ava Taylor", "Robert Thomas", "Isabella Garcia",
    "David Rodriguez", "Mia Hernandez", "Joseph Moore", "Charlotte Martin", "Daniel Lee",
    "Amelia White", "Matthew Harris", "Harper Clark", "Christopher Lewis", "Evelyn Walker",
  ];

  const records: any[] = [];
  let idCounter = 1;

  const grades = grade ? [Number(grade)] : [7, 8, 9, 10, 11, 12];

  for (const g of grades) {
    for (let i = 0; i < 20; i++) {
      const studentStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Apply status filter
      if (status && studentStatus !== status) continue;
      
      const isPresent = studentStatus === "present" || studentStatus === "late";
      const checkInTime = isPresent ? new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000) : null;
      
      records.push({
        id: `att-${idCounter++}`,
        studentId: `STU${g}${String(i + 1).padStart(3, "0")}`,
        studentName: names[Math.floor(Math.random() * names.length)],
        grade: g,
        section: sections[Math.floor(Math.random() * sections.length)],
        status: studentStatus,
        location: isPresent ? locations[Math.floor(Math.random() * locations.length)] : null,
        checkInTime: checkInTime?.toISOString() || null,
        checkOutTime: null,
        lastSeen: isPresent ? new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString() : null,
      });
    }
  }

  return records;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const grade = searchParams.get("grade") || "";
    const status = searchParams.get("status") || "";

    const records = generateMockAttendance(date, grade, status);

    const summary = {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      excused: records.filter((r) => r.status === "excused").length,
    };

    return NextResponse.json({
      records,
      date,
      summary,
    });
  } catch (error) {
    console.error("Attendance API error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}
