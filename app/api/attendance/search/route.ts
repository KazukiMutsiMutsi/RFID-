import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const LEVEL_MAP: Record<string, string> = {
  elementary: "Elementary", highschool: "High School",
  seniorhigh: "Senior High", college: "College",
};

export async function GET(req: NextRequest) {
  const query = (new URL(req.url).searchParams.get("q") || "").toLowerCase().trim();
  if (!query) return NextResponse.json({ results: [] });

  const matched = db.students
    .filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query) ||
      (s.tagId || "").toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    )
    .slice(0, 10)
    .map(s => ({
      studentId:       s.id,
      studentName:     s.name,
      level:           LEVEL_MAP[s.studentType] ?? s.studentType,
      grade:           s.grade,
      section:         s.section,
      tagId:           s.tagId,
      currentLocation: s.lastSeen ? "Main Gate" : null,
      lastSeen:        s.lastSeen,
      status:          s.status === "active" ? "present" : "absent",
    }));

  return NextResponse.json({ results: matched });
}
