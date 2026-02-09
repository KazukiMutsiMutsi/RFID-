import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock alerts generator
function generateMockAlerts() {
  const alerts: any[] = [];
  const now = new Date();

  // Missing students
  alerts.push({
    id: "alert-1",
    type: "missing",
    severity: "critical",
    message: "Student has not checked in today",
    studentName: "John Smith",
    timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
  });

  alerts.push({
    id: "alert-2",
    type: "missing",
    severity: "critical",
    message: "Student has not checked in today",
    studentName: "Emma Johnson",
    timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
  });

  // Capacity issues
  alerts.push({
    id: "alert-3",
    type: "capacity",
    severity: "high",
    message: "Location at full capacity",
    location: "Auditorium",
    timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
  });

  // Late arrivals
  alerts.push({
    id: "alert-4",
    type: "late",
    severity: "medium",
    message: "Late arrival detected",
    studentName: "Michael Brown",
    timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
  });

  alerts.push({
    id: "alert-5",
    type: "late",
    severity: "medium",
    message: "Late arrival detected",
    studentName: "Sophia Davis",
    timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
  });

  // Unauthorized access
  alerts.push({
    id: "alert-6",
    type: "unauthorized",
    severity: "high",
    message: "Unauthorized access attempt",
    location: "Science Lab",
    timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
  });

  return alerts;
}

export async function GET() {
  try {
    const alerts = generateMockAlerts();

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Alerts API error:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
