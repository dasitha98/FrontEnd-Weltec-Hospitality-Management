// src/app/api/recipes/route.ts
import { NextResponse } from "next/server";
import type { Recipe } from "@/types/domain";

// Mock data for demonstration
const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta dish with eggs, cheese, and pancetta",
    category: "Main Course",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      {
        ingredientId: "1",
        ingredientName: "Spaghetti",
        quantity: 400,
        unit: "g",
        notes: "Dried pasta",
      },
      {
        ingredientId: "2",
        ingredientName: "Pancetta",
        quantity: 200,
        unit: "g",
        notes: "Diced",
      },
      {
        ingredientId: "3",
        ingredientName: "Eggs",
        quantity: 4,
        unit: "pieces",
        notes: "Large, room temperature",
      },
      {
        ingredientId: "4",
        ingredientName: "Parmesan Cheese",
        quantity: 100,
        unit: "g",
        notes: "Freshly grated",
      },
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package directions",
      "Meanwhile, cook pancetta in a large skillet over medium heat until crispy",
      "In a bowl, whisk together eggs and grated Parmesan cheese",
      "Drain pasta, reserving 1 cup of pasta water",
      "Add hot pasta to the skillet with pancetta and toss",
      "Remove from heat and quickly stir in egg mixture, adding pasta water as needed",
      "Serve immediately with extra Parmesan cheese",
    ],
    nutritionInfo: {
      calories: 520,
      protein: 28,
      carbs: 45,
      fat: 24,
    },
    tags: ["Italian", "Pasta", "Comfort Food"],
    createdBy: "Chef Mario",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Chocolate Chip Cookies",
    description: "Soft and chewy homemade chocolate chip cookies",
    category: "Dessert",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "Easy",
    ingredients: [
      {
        ingredientId: "5",
        ingredientName: "All-purpose flour",
        quantity: 250,
        unit: "g",
        notes: "Sifted",
      },
      {
        ingredientId: "6",
        ingredientName: "Butter",
        quantity: 115,
        unit: "g",
        notes: "Softened",
      },
      {
        ingredientId: "7",
        ingredientName: "Brown sugar",
        quantity: 100,
        unit: "g",
        notes: "Packed",
      },
      {
        ingredientId: "8",
        ingredientName: "Chocolate chips",
        quantity: 200,
        unit: "g",
        notes: "Semi-sweet",
      },
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Cream together butter and both sugars until light and fluffy",
      "Beat in eggs one at a time, then vanilla",
      "In a separate bowl, whisk together flour, baking soda, and salt",
      "Gradually mix dry ingredients into wet ingredients",
      "Fold in chocolate chips",
      "Drop rounded tablespoons of dough onto ungreased baking sheets",
      "Bake for 9-11 minutes until golden brown",
      "Cool on baking sheet for 2 minutes before removing",
    ],
    nutritionInfo: {
      calories: 180,
      protein: 2,
      carbs: 22,
      fat: 9,
    },
    tags: ["Dessert", "Cookies", "Baking"],
    createdBy: "Chef Sarah",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with homemade Caesar dressing",
    category: "Salad",
    prepTime: 20,
    cookTime: 0,
    servings: 6,
    difficulty: "Easy",
    ingredients: [
      {
        ingredientId: "9",
        ingredientName: "Romaine lettuce",
        quantity: 2,
        unit: "heads",
        notes: "Washed and chopped",
      },
      {
        ingredientId: "10",
        ingredientName: "Parmesan cheese",
        quantity: 50,
        unit: "g",
        notes: "Shaved",
      },
      {
        ingredientId: "11",
        ingredientName: "Croutons",
        quantity: 100,
        unit: "g",
        notes: "Homemade or store-bought",
      },
      {
        ingredientId: "12",
        ingredientName: "Anchovies",
        quantity: 6,
        unit: "pieces",
        notes: "Optional",
      },
    ],
    instructions: [
      "Wash and dry romaine lettuce thoroughly",
      "Tear lettuce into bite-sized pieces",
      "Make Caesar dressing by whisking together mayonnaise, lemon juice, garlic, and anchovies",
      "Toss lettuce with dressing until well coated",
      "Add croutons and shaved Parmesan cheese",
      "Serve immediately",
    ],
    nutritionInfo: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 9,
    },
    tags: ["Salad", "Healthy", "Quick"],
    createdBy: "Chef Alex",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
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
    const newRecipe: Omit<Recipe, "id"> = await request.json();

    const recipe: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
