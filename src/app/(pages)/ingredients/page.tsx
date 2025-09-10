"use client";

import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import type { Ingredient } from "@/types/domain";
import IngredientDialog from "@/app/components/dialogboxes/dialog";

// Mock data for demonstration
const mockIngredients: Ingredient[] = [
  {
    id: "1",
    name: "Tomatoes",
    category: "Vegetables",
    unit: "kg",
    quantity: 50,
    description: "Fresh red tomatoes",
    supplier: "Fresh Farm Co.",
    cost: 2.5,
    expiryDate: "2024-02-15",
  },
  {
    id: "2",
    name: "Olive Oil",
    category: "Oils",
    unit: "liters",
    quantity: 20,
    description: "Extra virgin olive oil",
    supplier: "Mediterranean Foods",
    cost: 8.99,
    expiryDate: "2025-06-30",
  },
  {
    id: "3",
    name: "Chicken Breast",
    category: "Meat",
    unit: "kg",
    quantity: 30,
    description: "Fresh chicken breast",
    supplier: "Premium Poultry",
    cost: 12.99,
    expiryDate: "2024-01-20",
  },
];

export default function Recipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (data: Omit<Ingredient, "id">) => {
    if (editingIngredient) {
      // Update existing ingredient
      setIngredients((prev) =>
        prev.map((ingredient) =>
          ingredient.id === editingIngredient.id
            ? { ...data, id: editingIngredient.id }
            : ingredient
        )
      );
    } else {
      // Add new ingredient
      const newIngredient: Ingredient = {
        ...data,
        id: Date.now().toString(), // Simple ID generation for demo
      };
      setIngredients((prev) => [...prev, newIngredient]);
    }

    setEditingIngredient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      setIngredients((prev) =>
        prev.filter((ingredient) => ingredient.id !== id)
      );
    }
  };

  const handleClose = () => {
    setEditingIngredient(null);
    setIsDialogOpen(false);
  };

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-15">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ingredients Management
        </h1>
        <p className="text-gray-600">
          Manage your kitchen ingredients, track inventory, and monitor
          suppliers.
        </p>
      </div>
      Search and Add Button
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
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
          Add Ingredient
        </button>
      </div>
      {/* Ingredients Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingredient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ingredient.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ingredient.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ingredient.supplier || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ingredient.category || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ingredient.cost ? `$${ingredient.cost.toFixed(2)}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ingredient.cost
                      ? `$${(ingredient.cost * 0.8).toFixed(2)}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit ingredient"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete ingredient"
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

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No ingredients found
            </div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first ingredient to get started"}
            </p>
          </div>
        )}
      </div>
      {/* Ingredient Dialog */}
      <IngredientDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingIngredient || undefined}
        isEditing={!!editingIngredient}
      />
    </div>
  );
}
