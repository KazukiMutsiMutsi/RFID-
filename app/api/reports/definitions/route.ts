import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ReportType = "attendance" | "zone-traffic" | "denied-attempts" | "reader-uptime" | "after-hours" | "custom";

type ReportDefinition = {
  id: string;
  name: string;
  type: ReportType;
  parameters: Record<string, any>;
  schedule: string | null; // cron or ISO interval expression
  recipients: string[];
  createdBy: string;
  updatedAt: string;
};

function mockDefinitions(): ReportDefinition[] {
  return [
    { id: "rdef-1", name: "Daily Attendance", type: "attendance", parameters: { range: "yesterday" }, schedule: "0 6 * * *", recipients: ["office@school.edu"], createdBy: "admin", updatedAt: new Date().toISOString() },
    { id: "rdef-2", name: "Denied Attempts (24h)", type: "denied-attempts", parameters: { range: "24h" }, schedule: null, recipients: [], createdBy: "security", updatedAt: new Date().toISOString() },
  ];
}

export async function GET() {
  return NextResponse.json({ definitions: mockDefinitions() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created: ReportDefinition = {
      id: `rdef-${Math.floor(Math.random() * 100000)}`,
      name: body?.name || "Untitled",
      type: body?.type || "custom",
      parameters: body?.parameters || {},
      schedule: body?.schedule || null,
      recipients: Array.isArray(body?.recipients) ? body.recipients : [],
      createdBy: "admin",
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ definition: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
