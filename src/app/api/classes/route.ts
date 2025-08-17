// src/app/api/students/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const classes = [
    { id: "1", name: "Class A" },
    { id: "2", name: "Class B" },
    { id: "3", name: "Class C" },
  ];

    console.log("➡️ API hit: GET /api/students");

    return NextResponse.json(classes);
  } catch (error) {
    console.error("❌ API error in /api/students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
