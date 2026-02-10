import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getMockStudent(id: string) {
  const idx = parseInt(id.replace(/\D/g, "")) || 0;
  const grades = [7, 8, 9, 10, 11, 12] as const;
  const sections = ["A", "B", "C", "D"] as const;
  const statuses = ["active", "disabled"] as const;
  const studentTypes = ["highschool", "college"] as const;
  const colleges = ["College of Engineering", "College of Arts and Sciences", "College of Business", "College of Education"] as const;
  const courses = ["Computer Science", "Information Technology", "Business Administration", "Education", "Engineering"] as const;
  
  const studentType = studentTypes[idx % studentTypes.length];
  const student = {
    id,
    name: `Student ${idx}`,
    email: `student${idx}@students.school.edu`,
    studentType,
    grade: studentType === "highschool" ? grades[idx % grades.length] : null,
    section: studentType === "highschool" ? sections[idx % sections.length] : null,
    college: studentType === "college" ? colleges[idx % colleges.length] : null,
    course: studentType === "college" ? courses[idx % courses.length] : null,
    status: statuses[idx % statuses.length],
    tagId: `TAG-S-${3000 + (idx % 200)}`,
    location: null,
    emergencyContact: null,
    emergencyPhone: null,
    lastSeen: new Date(Date.now() - (idx % 18) * 1800_000).toISOString(),
  };
  return student;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ student: getMockStudent(id) }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const updates = await req.json();
    const current = getMockStudent(id);
    const next = { ...current, ...updates };
    return NextResponse.json({ student: next });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
