// src/app/api/students/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "2", name: "Bob", email: "bob@example.com" },
    ];

    console.log("➡️ API hit: GET /api/students");

    return NextResponse.json(students);
  } catch (error) {
    console.error("❌ API error in /api/students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
