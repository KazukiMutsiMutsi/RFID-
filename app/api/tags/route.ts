import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock data generator for tags
function getMockTags() {
  const statuses = ["unassigned", "assigned", "lost", "disabled", "retired"] as const;
  const types = ["student", "worker", "visitor"] as const;
  const ownerTypes = ["student", "worker"] as const;

  const arr = Array.from({ length: 80 }).map((_, i) => {
    const status = statuses[i % statuses.length];
    const type = types[i % types.length];
    const isAssigned = status === "assigned";
    
    return {
      id: `tag-${1000 + i}`,
      uid: `UID-${(3000 + i).toString(16).toUpperCase()}`,
      status,
      type,
      ownerId: isAssigned ? `${type === "student" ? "s" : "w"}-${10000 + (i % 50)}` : null,
      ownerType: isAssigned ? ownerTypes[i % ownerTypes.length] : null,
      issuedAt: new Date(Date.now() - (i % 30) * 86400_000).toISOString(),
      revokedAt: status === "retired" ? new Date(Date.now() - (i % 10) * 86400_000).toISOString() : null,
      lastSeen: isAssigned ? new Date(Date.now() - (i % 12) * 3600_000).toISOString() : null,
    };
  });
  return arr;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = (url.searchParams.get("search") || "").toLowerCase();
  const status = url.searchParams.get("status") || "";
  const type = url.searchParams.get("type") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(5, parseInt(url.searchParams.get("pageSize") || "10", 10)));

  let data = getMockTags();

  if (search) {
    data = data.filter((t) => 
      t.uid.toLowerCase().includes(search) || 
      (t.ownerId && t.ownerId.toLowerCase().includes(search))
    );
  }
  if (status) {
    data = data.filter((t) => t.status === status);
  }
  if (type) {
    data = data.filter((t) => t.type === type);
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
    const uid = String(body?.uid || "").trim();
    const type = body?.type || "student";

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    const created = {
      id: `tag-${Math.floor(Math.random() * 100000)}`,
      uid,
      type,
      status: "unassigned" as const,
      ownerId: null,
      ownerType: null,
      issuedAt: new Date().toISOString(),
      revokedAt: null,
      lastSeen: null,
    };

    return NextResponse.json({ tag: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
