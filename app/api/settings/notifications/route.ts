import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const defaultConfig = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  notifyOnAbsence: true,
  notifyOnLateArrival: true,
  notifyOnUnauthorizedAccess: true,
  notifyOnCapacityAlert: true,
  notifyOnSystemError: true,
  emailRecipients: ["admin@school.edu"],
  smsRecipients: [],
};

export async function GET() {
  try {
    return NextResponse.json({ config: defaultConfig });
  } catch (error) {
    console.error("Notification settings API error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const config = await req.json();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Save notification settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
