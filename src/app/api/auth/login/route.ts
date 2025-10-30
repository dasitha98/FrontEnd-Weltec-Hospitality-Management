import { NextResponse } from "next/server";

// Simple in-memory mock auth. Replace with real DB lookup.
const MOCK_USERS = [
  {
    UserId: "1",
    Name: "Admin User",
    Email: "admin@weltec.ac.nz",
    ContactNumber: 64210000000,
    Password: "password123",
    Role: "admin",
    Status: "Active",
    CreatedAt: new Date().toISOString(),
  },
  {
    UserId: "2",
    Name: "Instructor User",
    Email: "instructor@weltec.ac.nz",
    ContactNumber: 64210000001,
    Password: "password123",
    Role: "instructor",
    Status: "Active",
    CreatedAt: new Date().toISOString(),
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { error: "username and password are required" },
        { status: 400 }
      );
    }

    // Find user by username (email). For real apps, verify hashed passwords
    const user = MOCK_USERS.find(
      (u) => u.Email.toLowerCase() === String(username).toLowerCase()
    );

    if (!user || user.Password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate a simple mock token. Replace with JWT from your auth service.
    const accessToken = Buffer.from(
      JSON.stringify({ sub: user.UserId, role: user.Role, ts: Date.now() })
    ).toString("base64");

    // Return token and user (without password)
    const { Password: _pw, ...userSafe } = user as any;

    return NextResponse.json({ accessToken, user: userSafe, message: "ok" });
  } catch (error) {
    console.error("❌ API error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
