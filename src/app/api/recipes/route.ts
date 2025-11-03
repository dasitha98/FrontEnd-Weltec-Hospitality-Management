// src/app/api/recipes/route.ts
import { NextResponse } from "next/server";
import type { Recipe } from "@/types/domain";

// Mock data for demonstration
const mockRecipes: Recipe[] = [
  {
    RecipeId: "1",
    Name: "Spaghetti Carbonara",
    Description: "Classic Italian pasta dish with eggs, cheese, and pancetta",
    RecipeIngredients: [
      {
        IngredientId: "1",
        IngredientName: "Spaghetti",
        Quantity: 400,
        Unit: "g",
        Notes: "Dried pasta",
      },
      {
        IngredientId: "2",
        IngredientName: "Pancetta",
        Quantity: 200,
        Unit: "g",
        Notes: "Diced",
      },
      {
        IngredientId: "3",
        IngredientName: "Eggs",
        Quantity: 4,
        Unit: "pieces",
        Notes: "Large, room temperature",
      },
      {
        IngredientId: "4",
        IngredientName: "Parmesan Cheese",
        Quantity: 100,
        Unit: "g",
        Notes: "Freshly grated",
      },
    ],
    CreatedAt: "2024-01-15T10:30:00Z",
    UpdatedAt: "2024-01-15T10:30:00Z",
  },
  {
    RecipeId: "2",
    Name: "Chocolate Chip Cookies",
    Description: "Soft and chewy homemade chocolate chip cookies",
    RecipeIngredients: [
      {
        IngredientId: "5",
        IngredientName: "All-purpose flour",
        Quantity: 250,
        Unit: "g",
        Notes: "Sifted",
      },
      {
        IngredientId: "6",
        IngredientName: "Butter",
        Quantity: 115,
        Unit: "g",
        Notes: "Softened",
      },
      {
        IngredientId: "7",
        IngredientName: "Brown sugar",
        Quantity: 100,
        Unit: "g",
        Notes: "Packed",
      },
      {
        IngredientId: "8",
        IngredientName: "Chocolate chips",
        Quantity: 200,
        Unit: "g",
        Notes: "Semi-sweet",
      },
    ],
    CreatedAt: "2024-01-10T14:20:00Z",
    UpdatedAt: "2024-01-10T14:20:00Z",
  },
  {
    RecipeId: "3",
    Name: "Caesar Salad",
    Description: "Fresh romaine lettuce with homemade Caesar dressing",
    RecipeIngredients: [
      {
        IngredientId: "9",
        IngredientName: "Romaine lettuce",
        Quantity: 2,
        Unit: "heads",
        Notes: "Washed and chopped",
      },
      {
        IngredientId: "10",
        IngredientName: "Parmesan cheese",
        Quantity: 50,
        Unit: "g",
        Notes: "Shaved",
      },
      {
        IngredientId: "11",
        IngredientName: "Croutons",
        Quantity: 100,
        Unit: "g",
        Notes: "Homemade or store-bought",
      },
      {
        IngredientId: "12",
        IngredientName: "Anchovies",
        Quantity: 6,
        Unit: "pieces",
        Notes: "Optional",
      },
    ],
    CreatedAt: "2024-01-05T09:15:00Z",
    UpdatedAt: "2024-01-05T09:15:00Z",
  },
];

export async function GET() {
  try {
    console.log("➡️ API hit: GET /api/recipes");
    return NextResponse.json(mockRecipes);
  } catch (error) {
    console.error("❌ API error in /api/recipes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newRecipe: Omit<Recipe, "RecipeId"> = await request.json();

    const recipe: Recipe = {
      ...newRecipe,
      RecipeId: Date.now().toString(),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    console.log("➡️ API hit: POST /api/recipes", recipe);
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("❌ API error in POST /api/recipes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
