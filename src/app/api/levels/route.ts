// src/app/api/levels/route.ts
import { NextResponse } from "next/server";
import type { Level } from "@/types/domain";

// Mock data for demonstration
const mockLevels: Level[] = [
  {
    LevelId: "1",
    Name: "Beginner",
  },
  {
    LevelId: "2",
    Name: "Intermediate",
  },
  {
    LevelId: "3",
    Name: "Advanced",
  },
];

export async function GET() {
  try {
    console.log("➡️ API hit: GET /api/levels");
    return NextResponse.json(mockLevels);
  } catch (error) {
    console.error("❌ API error in /api/levels:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newLevel: Omit<Level, "LevelId"> = await request.json();

    const level: Level = {
      ...newLevel,
      LevelId: Date.now().toString(),
    };

    console.log("➡️ API hit: POST /api/levels", level);
    return NextResponse.json(level, { status: 201 });
  } catch (error) {
    console.error("❌ API error in POST /api/levels:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
