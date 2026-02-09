import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const defaultConfig = {
  readerTimeout: 30,
  autoCheckout: true,
  checkoutDelay: 480,
  duplicateReadDelay: 5,
  enableVisitorMode: true,
  maxDailyScans: 100,
};

export async function GET() {
  try {
    // In a real app, fetch from database
    return NextResponse.json({ config: defaultConfig });
  } catch (error) {
    console.error("RFID settings API error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const config = await req.json();
    
    // In a real app, save to database
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Save RFID settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
