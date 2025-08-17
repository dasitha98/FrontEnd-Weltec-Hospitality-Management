// src/app/api/students/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const foods = [
      { id: "1", name: "Pizza" },
      { id: "2", name: "Burger" },
      { id: "3", name: "Pasta" },
    ];

    console.log("➡️ API hit: GET /api/students");

    return NextResponse.json(foods);
  } catch (error) {
    console.error("❌ API error in /api/students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
