import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock users data
function getMockUsers() {
  return [
    {
      id: "user-1",
      name: "Admin User",
      email: "admin@school.edu",
      role: "admin" as const,
      status: "active" as const,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user-2",
      name: "John Teacher",
      email: "john.teacher@school.edu",
      role: "teacher" as const,
      status: "active" as const,
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user-3",
      name: "Security Guard",
      email: "security@school.edu",
      role: "security" as const,
      status: "active" as const,
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user-4",
      name: "Staff Member",
      email: "staff@school.edu",
      role: "staff" as const,
      status: "active" as const,
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "user-5",
      name: "Inactive User",
      email: "inactive@school.edu",
      role: "staff" as const,
      status: "inactive" as const,
      lastLogin: null,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export async function GET() {
  try {
    const users = getMockUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUsers = getMockUsers();
    const emailExists = existingUsers.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return NextResponse.json(
        { error: "This email is already in use. Please use a different email." },
        { status: 409 }
      );
    }

    // In a real app, hash the password and save to database
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      status: "active" as const,
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };

    // In a real app, send welcome email here
    console.log(`Sending welcome email to ${email}`);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
