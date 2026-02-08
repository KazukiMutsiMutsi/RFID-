import { NextRequest, NextResponse } from "next/server";

function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Vary"] = "Origin";
  } else {
    headers["Access-Control-Allow-Origin"] = "*";
  }

  return headers;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === "admin@test.com" && password === "admin123") {
      const res = NextResponse.json({ ok: true });

      // Set auth cookie
      res.cookies.set("auth", "true", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      // CORS headers (especially important if calling cross-origin)
      const cors = getCorsHeaders(req);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));

      return res;
    }

    const errRes = NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
    const cors = getCorsHeaders(req);
    Object.entries(cors).forEach(([k, v]) => errRes.headers.set(k, v));
    return errRes;
  } catch (err) {
    const badReq = NextResponse.json({ error: "Bad request" }, { status: 400 });
    const cors = getCorsHeaders(req);
    Object.entries(cors).forEach(([k, v]) => badReq.headers.set(k, v));
    return badReq;
  }
}
