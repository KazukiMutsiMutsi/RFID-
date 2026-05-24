import { NextRequest, NextResponse } from "next/server";
import { db, nextId, type StudentType } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url        = new URL(req.url);
  const search     = (url.searchParams.get("search") || "").toLowerCase();
  const grade      = url.searchParams.get("grade") || "";
  const studentType= url.searchParams.get("studentType") || "";
  const course     = (url.searchParams.get("course") || "").toLowerCase();
  const status     = url.searchParams.get("status") || "";
  const page       = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize   = Math.min(50, Math.max(5, parseInt(url.searchParams.get("pageSize") || "10", 10)));

  let data = [...db.students];

  if (search)      data = data.filter(s => s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || (s.tagId || "").toLowerCase().includes(search));
  if (studentType) data = data.filter(s => s.studentType === studentType);
  if (grade)       { const g = parseInt(grade, 10); if (!isNaN(g)) data = data.filter(s => s.grade === g); }
  if (course)      data = data.filter(s => s.course?.toLowerCase().includes(course));
  if (status)      data = data.filter(s => s.status === status);

  const total    = data.length;
  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({ data: pageData, page, pageSize, total }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    if (!name || !email) return NextResponse.json({ error: "name and email are required" }, { status: 400 });

    const type: StudentType = body?.studentType || "elementary";
    const isCollege = type === "college";

    const student = {
      id: nextId("s"),
      name, email,
      studentType: type,
      grade: body?.grade ? Number(body.grade) : null,
      section: !isCollege ? (body?.section || "A") : null,
      college: isCollege ? (body?.college || null) : null,
      course:  isCollege ? (body?.course  || null) : null,
      status: "active" as const,
      tagId: body?.tagId || null,
      lastSeen: null,
      createdAt: new Date().toISOString(),
    };

    db.students.unshift(student);
    return NextResponse.json({ student }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
