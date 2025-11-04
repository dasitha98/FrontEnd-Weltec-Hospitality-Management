import { NextResponse } from "next/server";

type User = {
  UserId: string;
  Name: string;
  Email: string;
  ContactNumber: number;
  Password: string;
  Role: string;
  Status: string;
  CreatedAt: string;
};

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

    // TODO: Replace with database lookup
    // Find user by username (email). For real apps, verify hashed passwords
    const user: User | null = null; // Replace with database query

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authentication not implemented. Please configure database lookup.",
        },
        { status: 501 }
      );
    }

    // TypeScript: user is now guaranteed to be User (not null)
    const authenticatedUser: User = user;

    // TODO: Verify hashed password using bcrypt or similar
    if (authenticatedUser.Password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate a simple mock token. Replace with JWT from your auth service.
    const accessToken = Buffer.from(
      JSON.stringify({
        sub: authenticatedUser.UserId,
        role: authenticatedUser.Role,
        ts: Date.now(),
      })
    ).toString("base64");

    // Return token and user (without password)
    const { Password: _pw, ...userSafe } = authenticatedUser;

    return NextResponse.json({ accessToken, user: userSafe, message: "ok" });
  } catch (error) {
    console.error("❌ API error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
