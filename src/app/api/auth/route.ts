// src/app/api/auth/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const Auth = [
      {
        UserId: "1",
        Name: "John Smith",
        Email: "john.smith@weltec.ac.nz",
        ContactNumber: 64211234567,
        Password: "hashedPassword123",
        Role: "admin",
        Status: "active",
        CreatedAt: "2024-01-15T10:30:00Z",
      },
      {
        UserId: "2",
        Name: "Sarah Johnson",
        Email: "sarah.johnson@weltec.ac.nz",
        ContactNumber: 64219876543,
        Password: "hashedPassword456",
        Role: "instructor",
        Status: "active",
        CreatedAt: "2024-01-10T14:20:00Z",
      },
      {
        UserId: "3",
        Name: "Mike Wilson",
        Email: "mike.wilson@student.weltec.ac.nz",
        ContactNumber: 64214567890,
        Password: "hashedPassword789",
        Role: "student",
        Status: "active",
        CreatedAt: "2024-01-05T09:15:00Z",
      },
    ];

    console.log("➡️ API hit: GET /api/auth");

    return NextResponse.json(Auth);
  } catch (error) {
    console.error("❌ API error in /api/auth:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("➡️ API hit: POST /api/auth/login", { email });

    // Mock user database - In production, this should query your actual database
    const users = [
      {
        UserId: "1",
        Name: "John Smith",
        Email: "john.smith@weltec.ac.nz",
        ContactNumber: 64211234567,
        Password: "hashedPassword123", // In production, use bcrypt to compare hashed passwords
        Role: "admin",
        Status: "Active",
        CreatedAt: "2024-01-15T10:30:00Z",
      },
      {
        UserId: "2",
        Name: "Sarah Johnson",
        Email: "sarah.johnson@weltec.ac.nz",
        ContactNumber: 64219876543,
        Password: "hashedPassword456",
        Role: "instructor",
        Status: "Active",
        CreatedAt: "2024-01-10T14:20:00Z",
      },
      {
        UserId: "3",
        Name: "Mike Wilson",
        Email: "mike.wilson@student.weltec.ac.nz",
        ContactNumber: 64214567890,
        Password: "hashedPassword789",
        Role: "student",
        Status: "Active",
        CreatedAt: "2024-01-05T09:15:00Z",
      },
    ];

    // Find user by email
    const user = users.find((u) => u.Email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In production, compare hashed passwords using bcrypt
    // For demo purposes, we're doing a simple comparison
    if (user.Password !== password && password !== "password123") {
      // Accept "password123" for demo, or compare with hashedPassword
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a mock token (in production, use JWT)
    const token = `mock-jwt-token-${user.UserId}-${Date.now()}`;

    // Return success response
    return NextResponse.json({
      token,
      user: {
        UserId: user.UserId,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role,
        Status: user.Status,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ API error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
