import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const GROUPS: Record<string, { label: string; group: string }[]> = {
  elementary: [1,2,3,4,5,6].map(g => ({ label: `Grade ${g}`, group: "Elementary" })),
  highschool: [7,8,9,10].map(g => ({ label: `Grade ${g}`, group: "High School" })),
  seniorhigh: [11,12].map(g => ({ label: `Grade ${g}`, group: "Senior High" })),
  college:    [1,2,3,4].map(g => ({ label: `${["1st","2nd","3rd","4th"][g-1]} Year`, group: "College" })),
};

export async function GET() {
  const buckets: { label: string; group: string; present: number; late: number; absent: number }[] = [];

  for (const [type, rows] of Object.entries(GROUPS)) {
    for (const { label, group } of rows) {
      const gradeNum = parseInt(label.replace(/\D/g, ""), 10);
      const students = db.students.filter(s => s.studentType === type && s.grade === gradeNum && s.status === "active");
      const total    = students.length;
      if (total === 0) continue;

      // Deterministic split: ~75% present, ~12% late, ~13% absent
      const present = Math.round(total * 0.75);
      const late    = Math.round(total * 0.12);
      const absent  = total - present - late;

      buckets.push({ label, group, present, late, absent: Math.max(0, absent) });
    }
  }

  return NextResponse.json({ buckets }, { headers: { "Cache-Control": "no-store" } });
}
