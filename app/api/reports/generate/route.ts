import { NextRequest, NextResponse } from "next/server";
import { db, nextId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body        = await req.json();
    const reportType  = String(body?.type || "attendance");
    const dateFrom    = body?.dateFrom || new Date().toISOString().split("T")[0];
    const filterLevel = String(body?.filterLevel || "");
    const filterStatus= String(body?.filterStatus || "");

    let rows: any[] = [];

    if (reportType === "students") {
      let data = db.students;
      if (filterLevel)  data = data.filter(s => s.studentType === filterLevel);
      if (filterStatus) data = data.filter(s => s.status === filterStatus);
      rows = data.map(s => ({
        "ID":      s.id,
        "Name":    s.name,
        "Email":   s.email,
        "Level":   s.studentType,
        "Grade":   s.grade ?? "—",
        "Section": s.section ?? "—",
        "Status":  s.status,
        "Tag ID":  s.tagId ?? "—",
      }));
    } else if (reportType === "tags") {
      rows = db.tags.map(t => ({
        "Tag ID":   t.id,
        "UID":      t.uid,
        "Status":   t.status,
        "Owner":    t.ownerName ?? "—",
        "Issued At":t.issuedAt ? new Date(t.issuedAt).toLocaleDateString() : "—",
        "Last Seen":t.lastSeen ? new Date(t.lastSeen).toLocaleString() : "—",
      }));
    } else {
      // attendance
      let data = db.students.filter(s => s.status === "active");
      if (filterLevel) data = data.filter(s => s.studentType === filterLevel);
      const STATUSES = ["present","present","present","late","absent"] as const;
      rows = data.map((s, i) => {
        const status = STATUSES[i % STATUSES.length];
        if (filterStatus && status !== filterStatus) return null;
        return {
          "Student ID": s.id,
          "Name":       s.name,
          "Level":      s.studentType,
          "Grade":      s.grade ?? "—",
          "Section":    s.section ?? "—",
          "Status":     status,
          "Date":       dateFrom,
        };
      }).filter(Boolean);
    }

    // Save to history
    db.reportHistory.unshift({
      id: nextId("rpt"),
      type: reportType,
      generatedAt: new Date().toISOString(),
      rows: rows.length,
      generatedBy: "Admin",
    });
    // Keep only last 50
    if (db.reportHistory.length > 50) db.reportHistory.length = 50;

    return NextResponse.json({ rows, total: rows.length, type: reportType });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
