import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getMockReports() {
  return [
    {
      id: "report-1",
      type: "attendance",
      name: "Daily Attendance Report",
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
      format: "csv",
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      generatedBy: "Admin User",
      size: "45 KB",
    },
    {
      id: "report-2",
      type: "events",
      name: "Event Logs Report",
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
      format: "pdf",
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      generatedBy: "Admin User",
      size: "1.2 MB",
    },
    {
      id: "report-3",
      type: "students",
      name: "Student Directory",
      dateFrom: new Date().toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
      format: "excel",
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      generatedBy: "Admin User",
      size: "78 KB",
    },
    {
      id: "report-4",
      type: "doors",
      name: "Door Activity Summary",
      dateFrom: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      dateTo: new Date().toISOString().split("T")[0],
      format: "csv",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      generatedBy: "Security Guard",
      size: "23 KB",
    },
  ];
}

export async function GET() {
  try {
    const reports = getMockReports();
    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Report history API error:", error);
    return NextResponse.json({ error: "Failed to fetch report history" }, { status: 500 });
  }
}
