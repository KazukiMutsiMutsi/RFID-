import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (origin) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
    h["Vary"] = "Origin";
  } else {
    h["Access-Control-Allow-Origin"] = "*";
  }
  return h;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const admin = db.admins.find(a => a.email === email && a.password === password);

    if (admin) {
      const res = NextResponse.json({ ok: true, name: admin.name, role: admin.role });
      res.cookies.set("auth", "true", {
        httpOnly: true, path: "/", maxAge: 60 * 60 * 24,
        sameSite: "lax", secure: process.env.NODE_ENV === "production",
      });
      res.cookies.set("admin_name", admin.name, { path: "/", maxAge: 60 * 60 * 24 });
      res.cookies.set("admin_role", admin.role, { path: "/", maxAge: 60 * 60 * 24 });
      Object.entries(corsHeaders(req)).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    const err = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    Object.entries(corsHeaders(req)).forEach(([k, v]) => err.headers.set(k, v));
    return err;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
