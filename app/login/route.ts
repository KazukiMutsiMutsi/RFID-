import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === "admin@test.com" && password === "admin123") {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("auth", "true", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
