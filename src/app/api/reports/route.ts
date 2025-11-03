// src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import type { Report } from "@/types/domain";

// Mock data for demonstration
const mockReports: Report[] = [
  {
    ReportId: "1",
    Title: "Monthly Sales Report",
    Description: "Comprehensive monthly sales analysis",
    Type: "Sales",
    GeneratedBy: "Admin",
    GeneratedAt: new Date().toISOString(),
    CreatedAt: "2024-01-15T10:30:00Z",
    UpdatedAt: "2024-01-15T10:30:00Z",
  },
  {
    ReportId: "2",
    Title: "Inventory Status",
    Description: "Current inventory levels and stock status",
    Type: "Inventory",
    GeneratedBy: "Manager",
    GeneratedAt: new Date().toISOString(),
    CreatedAt: "2024-01-10T14:20:00Z",
    UpdatedAt: "2024-01-10T14:20:00Z",
  },
  {
    ReportId: "3",
    Title: "Student Performance",
    Description: "Student grades and performance metrics",
    Type: "Academic",
    GeneratedBy: "Instructor",
    GeneratedAt: new Date().toISOString(),
    CreatedAt: "2024-01-05T09:15:00Z",
    UpdatedAt: "2024-01-05T09:15:00Z",
  },
];

export async function GET() {
  try {
    console.log("➡️ API hit: GET /api/reports");
    return NextResponse.json(mockReports);
  } catch (error) {
    console.error("❌ API error in /api/reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newReport: Omit<Report, "ReportId"> = await request.json();

    const report: Report = {
      ...newReport,
      ReportId: Date.now().toString(),
      GeneratedAt: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    console.log("➡️ API hit: POST /api/reports", report);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("❌ API error in POST /api/reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
