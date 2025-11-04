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
    const body = await request.json();

    // Check if this is a ClassIds request (for listing reports)
    if (body.ClassIds && Array.isArray(body.ClassIds)) {
      console.log("➡️ API hit: POST /api/reports with ClassIds", body.ClassIds);

      // Mock StorageData based on ClassIds
      // In a real implementation, this would query the database based on ClassIds
      const storageData = {
        "Dry Storage": [
          {
            IngredientName: "ingredient_1",
            Quantity: 10.0,
            Unit: "g",
            Cost: 2.0,
            Store: "Dry Storage",
          },
          {
            IngredientName: "ingredient_1",
            Quantity: 15.0,
            Unit: "g",
            Cost: 2.0,
            Store: "Dry Storage",
          },
        ],
        "Frozen Storage": [
          {
            IngredientName: "ingredient_3",
            Quantity: 20.0,
            Unit: "g",
            Cost: 30.0,
            Store: "Frozen Storage",
          },
        ],
        "Chill Storage": [
          {
            IngredientName: "ingredient_2",
            Quantity: 10.0,
            Unit: "g",
            Cost: 20.0,
            Store: "Chill Storage",
          },
        ],
      };

      return NextResponse.json(storageData);
    }

    // Otherwise, create a new report (existing behavior)
    const newReport: Omit<Report, "ReportId"> = body;

    const report: Report = {
      ...newReport,
      ReportId: Date.now().toString(),
      GeneratedAt: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    console.log("➡️ API hit: POST /api/reports (create)", report);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("❌ API error in POST /api/reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
