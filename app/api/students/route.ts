import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock data generator for students
function getMockStudents() {
  const first = ["Aiden", "Bianca", "Caleb", "Diana", "Ethan", "Faith", "Gavin", "Hannah", "Ivan", "Jade"];
  const last = ["Lopez", "Reyes", "Santos", "Garcia", "Cruz", "Diaz", "Tan", "Lim", "Flores", "Lee"];
  const grades = [7, 8, 9, 10, 11, 12] as const;
  const sections = ["A", "B", "C", "D"] as const;
  const statuses = ["active", "disabled"] as const; // keep same naming as workers for badge reuse

  const arr = Array.from({ length: 120 }).map((_, i) => {
    const name = `${first[i % first.length]} ${last[i % last.length]}`;
    const id = `s-${10000 + i}`;
    const email = `${name.replace(/\s+/g, ".").toLowerCase()}@students.school.edu`;
    const grade = grades[i % grades.length];
    const section = sections[i % sections.length];
    const status = statuses[i % statuses.length];
    const tagId = `TAG-S-${3000 + i}`;
    const lastSeen = new Date(Date.now() - (i % 18) * 1800_000).toISOString();
    return { id, name, email, grade, section, status, tagId, lastSeen };
  });
  return arr;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = (url.searchParams.get("search") || "").toLowerCase();
  const grade = url.searchParams.get("grade") || "";
  const status = url.searchParams.get("status") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(5, parseInt(url.searchParams.get("pageSize") || "10", 10)));

  let data = getMockStudents();

  if (search) {
    data = data.filter((s) => s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.tagId.toLowerCase().includes(search));
  }
  if (grade) {
    const g = parseInt(grade, 10);
    if (!Number.isNaN(g)) data = data.filter((s) => s.grade === g);
  }
  if (status) {
    data = data.filter((s) => s.status === status);
  }

  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  return NextResponse.json({ data: pageData, page, pageSize, total }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const grade = Number(body?.grade);
    const section = String(body?.section || "").trim();

    if (!name || !email || !grade) {
      return NextResponse.json({ error: "name, email, and grade are required" }, { status: 400 });
    }

    const created = {
      id: `s-${Math.floor(Math.random() * 100000)}`,
      name,
      email,
      grade,
      section,
      status: "active" as const,
      tagId: body?.tagId || null,
      lastSeen: null as string | null,
    };

    return NextResponse.json({ student: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
