"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaClock,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import type { Recipe, RecipeIngredient } from "@/types/domain";
import RecipeDialog from "@/app/components/dialogboxes/RecipeDialog";

// Mock data for demonstration
const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta dish with eggs, cheese, and pancetta",
    reference: "REC-001",
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
        cost: 2.5,
      },
      {
        ingredientId: "2",
        ingredientName: "Pancetta",
        quantity: 200,
        unit: "g",
        notes: "Diced",
        cost: 8.0,
      },
      {
        ingredientId: "3",
        ingredientName: "Eggs",
        quantity: 4,
        unit: "pieces",
        notes: "Large, room temperature",
        cost: 1.2,
      },
      {
        ingredientId: "4",
        ingredientName: "Parmesan Cheese",
        quantity: 100,
        unit: "g",
        notes: "Freshly grated",
        cost: 4.5,
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
    reference: "REC-002",
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
        cost: 0.75,
      },
      {
        ingredientId: "6",
        ingredientName: "Butter",
        quantity: 115,
        unit: "g",
        notes: "Softened",
        cost: 1.5,
      },
      {
        ingredientId: "7",
        ingredientName: "Brown sugar",
        quantity: 100,
        unit: "g",
        notes: "Packed",
        cost: 0.6,
      },
      {
        ingredientId: "8",
        ingredientName: "Chocolate chips",
        quantity: 200,
        unit: "g",
        notes: "Semi-sweet",
        cost: 3.2,
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
    reference: "REC-003",
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
        cost: 3.0,
      },
      {
        ingredientId: "10",
        ingredientName: "Parmesan cheese",
        quantity: 50,
        unit: "g",
        notes: "Shaved",
        cost: 2.25,
      },
      {
        ingredientId: "11",
        ingredientName: "Croutons",
        quantity: 100,
        unit: "g",
        notes: "Homemade or store-bought",
        cost: 1.5,
      },
      {
        ingredientId: "12",
        ingredientName: "Anchovies",
        quantity: 6,
        unit: "pieces",
        notes: "Optional",
        cost: 2.0,
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

export default function Recipe() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (data: Omit<Recipe, "id">) => {
    if (editingRecipe) {
      // Update existing recipe
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === editingRecipe.id
            ? {
                ...data,
                id: editingRecipe.id,
                updatedAt: new Date().toISOString(),
              }
            : recipe
        )
      );
    } else {
      // Add new recipe
      const newRecipe: Recipe = {
        ...data,
        id: Date.now().toString(), // Simple ID generation for demo
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRecipes((prev) => [...prev, newRecipe]);
    }

    setEditingRecipe(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    }
  };

  const handleClose = () => {
    setEditingRecipe(null);
    setIsDialogOpen(false);
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calculateTotalCost = (ingredients: RecipeIngredient[]) => {
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.cost || 0);
    }, 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recipe Management
        </h1>
        <p className="text-gray-600">
          Manage your recipe collection, track cooking times, and organize
          ingredients and instructions.
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FaPlus className="mr-2" size={16} />
          Add Recipe
        </button>
      </div>

      {/* Recipes Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecipes.map((recipe, index) => (
                <tr
                  key={recipe.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {recipe.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {recipe.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {recipe.reference || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${calculateTotalCost(recipe.ingredients).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(recipe)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit recipe"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete recipe"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No recipes found</div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first recipe to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Recipe Dialog */}
      <RecipeDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingRecipe || undefined}
        isEditing={!!editingRecipe}
      />
    </div>
  );
}
