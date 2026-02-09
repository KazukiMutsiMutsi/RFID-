import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const defaultConfig = {
  sessionTimeout: 60,
  requireMFA: false,
  passwordExpiry: 90,
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  allowedIPs: [],
};

export async function GET() {
  try {
    return NextResponse.json({ config: defaultConfig });
  } catch (error) {
    console.error("Security settings API error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const config = await req.json();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Save security settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
