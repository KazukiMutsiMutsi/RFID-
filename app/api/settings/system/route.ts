import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const defaultConfig = {
  schoolName: "Benedicto College",
  timezone: "Asia/Manila",
  dateFormat: "MM/DD/YYYY",
  dataRetention: 365,
};

export async function GET() {
  try {
    return NextResponse.json({ config: defaultConfig });
  } catch (error) {
    console.error("System settings API error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const config = await req.json();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Save system settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
