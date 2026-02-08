import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock data generator (deterministic per request)
function getMockWorkers() {
  const roles = ["Teacher", "Security", "Admin", "Custodial", "IT"] as const;
  const departments = ["Math", "Science", "English", "Facilities", "IT", "Admin"] as const;
  const statuses = ["active", "disabled"] as const;
  const first = ["Alice", "Ben", "Carla", "Dion", "Eve", "Fredo", "Gina", "Hugo", "Iris", "Jamal"];
  const last = ["Diaz", "Cruz", "Lim", "Santos", "Reyes", "Flores", "Velasquez", "Garcia", "Tan", "Lee"];

  const arr = Array.from({ length: 48 }).map((_, i) => {
    const name = `${first[i % first.length]} ${last[i % last.length]}`;
    const role = roles[i % roles.length];
    const department = departments[i % departments.length];
    const status = statuses[i % statuses.length];
    const id = `w-${1000 + i}`;
    const tagId = `TAG-${2000 + i}`;
    const lastSeen = new Date(Date.now() - (i % 12) * 3600_000).toISOString();
    return { id, name, email: `${name.replace(/\s+/g, ".").toLowerCase()}@school.edu`, role, department, status, tagId, lastSeen };
  });
  return arr;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = (url.searchParams.get("search") || "").toLowerCase();
  const role = url.searchParams.get("role") || "";
  const status = url.searchParams.get("status") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(5, parseInt(url.searchParams.get("pageSize") || "10", 10)));

  let data = getMockWorkers();

  if (search) {
    data = data.filter((w) => w.name.toLowerCase().includes(search) || w.email.toLowerCase().includes(search) || w.tagId.toLowerCase().includes(search));
  }
  if (role) {
    data = data.filter((w) => w.role === role);
  }
  if (status) {
    data = data.filter((w) => w.status === status);
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
    const role = String(body?.role || "").trim();
    const department = String(body?.department || "").trim();

    if (!name || !email || !role) {
      return NextResponse.json({ error: "name, email, and role are required" }, { status: 400 });
    }

    const created = {
      id: `w-${Math.floor(Math.random() * 100000)}`,
      name,
      email,
      role,
      department: department || "",
      status: "active" as const,
      tagId: body?.tagId || null,
      lastSeen: null as string | null,
    };

    return NextResponse.json({ worker: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
