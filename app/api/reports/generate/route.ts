import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function generateCSV(type: string, data: any[]): string {
  if (type === "attendance") {
    const headers = ["Date", "Student ID", "Name", "Grade", "Section", "Status", "Check In", "Check Out"];
    const rows = data.map((d) => [
      d.date,
      d.studentId,
      d.studentName,
      d.grade,
      d.section,
      d.status,
      d.checkIn || "N/A",
      d.checkOut || "N/A",
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  if (type === "events") {
    const headers = ["Timestamp", "Tag UID", "Door", "Action", "Status", "User Type", "User ID"];
    const rows = data.map((d) => [
      d.timestamp,
      d.tagUid,
      d.door,
      d.action,
      d.status,
      d.userType,
      d.userId,
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  if (type === "students") {
    const headers = ["Student ID", "Name", "Email", "Grade", "Section", "Status", "Tag ID", "Last Seen"];
    const rows = data.map((d) => [
      d.id,
      d.name,
      d.email,
      d.grade,
      d.section,
      d.status,
      d.tagId || "N/A",
      d.lastSeen || "N/A",
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  if (type === "workers") {
    const headers = ["Worker ID", "Name", "Email", "Role", "Department", "Status", "Tag ID", "Last Seen"];
    const rows = data.map((d) => [
      d.id,
      d.name,
      d.email,
      d.role,
      d.department,
      d.status,
      d.tagId || "N/A",
      d.lastSeen || "N/A",
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  if (type === "tags") {
    const headers = ["Tag ID", "UID", "Status", "Type", "Owner ID", "Owner Type", "Issued At", "Last Seen"];
    const rows = data.map((d) => [
      d.id,
      d.uid,
      d.status,
      d.type,
      d.ownerId || "N/A",
      d.ownerType || "N/A",
      d.issuedAt || "N/A",
      d.lastSeen || "N/A",
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  if (type === "doors") {
    const headers = ["Door", "Location", "Total Events", "Entries", "Exits", "Denied", "Peak Hour", "Status"];
    const rows = data.map((d) => [
      d.name,
      d.location,
      d.totalEvents,
      d.entries,
      d.exits,
      d.denied,
      d.peakHour,
      d.status,
    ]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  return "";
}

function generateMockData(type: string, dateFrom: string, dateTo: string): any[] {
  const data: any[] = [];

  if (type === "attendance") {
    for (let i = 0; i < 50; i++) {
      data.push({
        date: dateFrom,
        studentId: `STU${7 + (i % 6)}${String(i + 1).padStart(3, "0")}`,
        studentName: `Student ${i + 1}`,
        grade: 7 + (i % 6),
        section: ["A", "B", "C"][i % 3],
        status: ["present", "absent", "late"][i % 3],
        checkIn: i % 3 !== 1 ? "08:15 AM" : null,
        checkOut: i % 3 !== 1 ? "03:30 PM" : null,
      });
    }
  }

  if (type === "events") {
    for (let i = 0; i < 100; i++) {
      data.push({
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        tagUid: `UID-${3000 + i}`,
        door: ["Main Gate", "Library", "Gym", "Cafeteria"][i % 4],
        action: ["entry", "exit"][i % 2],
        status: i % 10 === 0 ? "denied" : "allowed",
        userType: ["student", "worker"][i % 2],
        userId: `${i % 2 === 0 ? "STU" : "WRK"}${1000 + i}`,
      });
    }
  }

  if (type === "students") {
    for (let i = 0; i < 120; i++) {
      data.push({
        id: `s-${10000 + i}`,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@school.edu`,
        grade: 7 + (i % 6),
        section: ["A", "B", "C", "D"][i % 4],
        status: i % 10 === 0 ? "disabled" : "active",
        tagId: `TAG-S-${3000 + i}`,
        lastSeen: new Date(Date.now() - i * 3600000).toISOString(),
      });
    }
  }

  if (type === "workers") {
    for (let i = 0; i < 48; i++) {
      data.push({
        id: `w-${1000 + i}`,
        name: `Worker ${i + 1}`,
        email: `worker${i + 1}@school.edu`,
        role: ["Teacher", "Security", "Admin", "Custodial", "IT"][i % 5],
        department: ["Math", "Science", "English", "Facilities", "IT", "Admin"][i % 6],
        status: i % 10 === 0 ? "disabled" : "active",
        tagId: `TAG-${2000 + i}`,
        lastSeen: new Date(Date.now() - i * 3600000).toISOString(),
      });
    }
  }

  if (type === "tags") {
    for (let i = 0; i < 80; i++) {
      data.push({
        id: `tag-${1000 + i}`,
        uid: `UID-${(3000 + i).toString(16).toUpperCase()}`,
        status: ["unassigned", "assigned", "lost", "disabled", "retired"][i % 5],
        type: ["student", "worker", "visitor"][i % 3],
        ownerId: i % 5 === 1 ? `${i % 3 === 0 ? "s" : "w"}-${10000 + i}` : null,
        ownerType: i % 5 === 1 ? (i % 3 === 0 ? "student" : "worker") : null,
        issuedAt: new Date(Date.now() - i * 86400000).toISOString(),
        lastSeen: i % 5 === 1 ? new Date(Date.now() - i * 3600000).toISOString() : null,
      });
    }
  }

  if (type === "doors") {
    const doors = ["Main Gate", "Library", "Gym", "Cafeteria", "Science Lab", "Computer Lab", "Auditorium", "Playground"];
    doors.forEach((door, i) => {
      data.push({
        name: door,
        location: `Building ${String.fromCharCode(65 + (i % 3))}`,
        totalEvents: 100 + i * 50,
        entries: 50 + i * 25,
        exits: 48 + i * 24,
        denied: i % 3,
        peakHour: `${8 + (i % 4)}:00 AM`,
        status: i % 8 === 0 ? "offline" : "online",
      });
    });
  }

  return data;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "attendance";
    const dateFrom = searchParams.get("dateFrom") || new Date().toISOString().split("T")[0];
    const dateTo = searchParams.get("dateTo") || new Date().toISOString().split("T")[0];
    const format = searchParams.get("format") || "csv";

    // Generate mock data
    const data = generateMockData(type, dateFrom, dateTo);

    if (format === "csv") {
      const csv = generateCSV(type, data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${type}-report.csv"`,
        },
      });
    }

    if (format === "pdf") {
      // In a real app, generate PDF using a library like pdfkit or puppeteer
      const pdfContent = `PDF Report: ${type}\nDate Range: ${dateFrom} to ${dateTo}\n\nThis is a mock PDF. In production, use a PDF generation library.`;
      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${type}-report.pdf"`,
        },
      });
    }

    if (format === "excel") {
      // In a real app, generate Excel using a library like exceljs
      const csv = generateCSV(type, data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "application/vnd.ms-excel",
          "Content-Disposition": `attachment; filename="${type}-report.xls"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Generate report error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
