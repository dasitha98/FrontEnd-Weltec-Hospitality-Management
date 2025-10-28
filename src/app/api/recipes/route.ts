// src/app/api/recipes/route.ts
import { NextResponse } from "next/server";
import type { Recipe } from "@/types/domain";

// Mock data for demonstration
const mockRecipes: Recipe[] = [
  {
    RecipeId: "1",
    Name: "Spaghetti Carbonara",
    Description: "Classic Italian pasta dish with eggs, cheese, and pancetta",
    category: "Main Course",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
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
