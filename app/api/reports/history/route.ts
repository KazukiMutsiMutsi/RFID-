import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { history: db.reportHistory },
    { headers: { "Cache-Control": "no-store" } }
  );
}
