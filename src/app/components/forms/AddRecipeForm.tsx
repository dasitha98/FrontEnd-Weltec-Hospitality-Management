"use client";

import React, { useState, useEffect } from "react";
import type { Recipe, RecipeIngredient } from "@/types/domain";

interface AddRecipeFormProps {
  onSubmit: (data: Omit<Recipe, "id">) => void;
  onCancel: () => void;
  initialData?: Partial<Recipe>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface FormData {
  name: string;
  description: string;
  level: string;
  year: string;
  reference: string;
  yield: string;
  ingredients: RecipeIngredient[];
  totalCost: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  level?: string;
  year?: string;
  reference?: string;
  yield?: string;
  ingredients?: string;
  totalCost?: string;
  ingredientValidation?: {
    [key: number]:
      | {
          ingredientName?: string;
          quantity?: string;
          unit?: string;
          cost?: string;
        }
      | undefined;
  };
}

const LEVEL_OPTIONS = [
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
  { value: "Level 3", label: "Level 3" },
  { value: "Level 4", label: "Level 4" },
  { value: "Level 5", label: "Level 5" },
];

const YEAR_OPTIONS = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
];

const REFERENCE_OPTIONS = [
  { value: "Base Recipe 1", label: "Base Recipe 1" },
  { value: "Base Recipe 2", label: "Base Recipe 2" },
  { value: "Base Recipe 3", label: "Base Recipe 3" },
];

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "cups", label: "Cups" },
  { value: "tbsp", label: "Tablespoons" },
  { value: "tsp", label: "Teaspoons" },
  { value: "pieces", label: "Pieces" },
  { value: "slices", label: "Slices" },
  { value: "pinch", label: "Pinch" },
  { value: "dash", label: "Dash" },
];

export default function AddRecipeForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  submitButtonText = "Add Recipe",
  cancelButtonText = "Cancel",
}: AddRecipeFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    level: "",
    year: "",
    reference: "",
    yield: "",
    ingredients: [],
    totalCost: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [newIngredient, setNewIngredient] = useState<RecipeIngredient>({
    ingredientId: "",
    ingredientName: "",
    quantity: 0,
    unit: "",
    cost: 0,
    notes: "",
  });
  const [editingIngredients, setEditingIngredients] = useState<
    RecipeIngredient[]
  >([
    {
      ingredientId: "default",
      ingredientName: "",
      quantity: 0,
      unit: "",
      cost: 0,
      notes: "",
    },
  ]);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        level: "",
        year: "",
        reference: initialData.reference || "",
        yield: initialData.servings?.toString() || "",
        ingredients: initialData.ingredients || [],
        totalCost: "",
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const addIngredient = () => {
    // Validate the last row before adding a new one
    const lastRow = editingIngredients[editingIngredients.length - 1];
    const lastRowIndex = editingIngredients.length - 1;

    if (
      lastRow &&
      lastRow.ingredientName &&
      lastRow.quantity > 0 &&
      lastRow.unit &&
      lastRow.cost !== undefined &&
      lastRow.cost >= 0
    ) {
      // Clear any validation errors for this row
      setErrors((prev) => ({
        ...prev,
        ingredientValidation: {
          ...prev.ingredientValidation,
          [lastRowIndex]: undefined,
        },
      }));

      // Save the last row to formData
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, lastRow],
      }));

      // Add a new empty row
      const newIngredientRow: RecipeIngredient = {
        ingredientId: Date.now().toString(),
        ingredientName: "",
        quantity: 0,
        unit: "",
        cost: 0,
        notes: "",
      };
      setEditingIngredients([newIngredientRow]);
    } else {
      // Show validation errors for the last row
      const validationErrors: {
        ingredientName?: string;
        quantity?: string;
        unit?: string;
        cost?: string;
      } = {};

      if (!lastRow?.ingredientName) {
        validationErrors.ingredientName = "Ingredient name is required";
      }
      if (!lastRow?.quantity || lastRow.quantity <= 0) {
        validationErrors.quantity = "Quantity must be greater than 0";
      }
      if (!lastRow?.unit) {
        validationErrors.unit = "Unit is required";
      }
      if (lastRow?.cost === undefined || lastRow.cost < 0) {
        validationErrors.cost = "Cost must be a non-negative number";
      }

      setErrors((prev) => ({
        ...prev,
        ingredientValidation: {
          ...prev.ingredientValidation,
          [lastRowIndex]: validationErrors,
        },
      }));
    }
  };

  const updateEditingIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => {
    setEditingIngredients((prev) =>
      prev.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    );

    // Clear validation error for this field when user starts typing
    setErrors((prev) => ({
      ...prev,
      ingredientValidation: {
        ...prev.ingredientValidation,
        [index]: {
          ...prev.ingredientValidation?.[index],
          [field]: undefined,
        },
      },
    }));
  };

  const saveIngredient = (index: number) => {
    const ingredient = editingIngredients[index];
    if (
      ingredient.ingredientName &&
      ingredient.quantity > 0 &&
      ingredient.unit
    ) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }));
      setEditingIngredients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeEditingIngredient = (index: number) => {
    setEditingIngredients((prev) => {
      const newIngredients = prev.filter((_, i) => i !== index);
      // Always keep at least one row
      if (newIngredients.length === 0) {
        return [
          {
            ingredientId: "default",
            ingredientName: "",
            quantity: 0,
            unit: "",
            cost: 0,
            notes: "",
          },
        ];
      }
      return newIngredients;
    });
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const total = formData.ingredients.reduce((sum, ingredient) => {
      return sum + (ingredient.cost || 0);
    }, 0);
    setFormData((prev) => ({
      ...prev,
      totalCost: total.toFixed(2),
    }));
  };

  // Update total cost when ingredients change
  useEffect(() => {
    calculateTotalCost();
  }, [formData.ingredients]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = "Recipe name is required";
    }

    if (!formData.level) {
      newErrors.level = "Level is required";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    }

    if (!formData.reference) {
      newErrors.reference = "Reference is required";
    }

    if (!formData.yield.trim()) {
      newErrors.yield = "Yield is required";
    } else {
      const yieldValue = parseInt(formData.yield);
      if (isNaN(yieldValue) || yieldValue <= 0) {
        newErrors.yield = "Yield must be a positive number";
      }
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-save all editing ingredients that have required fields filled
    const validEditingIngredients = editingIngredients.filter(
      (ingredient) =>
        ingredient.ingredientName && ingredient.quantity > 0 && ingredient.unit
    );

    const allIngredients = [
      ...formData.ingredients,
      ...validEditingIngredients,
    ];

    // Update form data with all ingredients
    const updatedFormData = {
      ...formData,
      ingredients: allIngredients,
    };

    // Validate with updated ingredients
    const newErrors: FormErrors = {};
    if (!updatedFormData.name.trim()) {
      newErrors.name = "Recipe name is required";
    }
    if (!updatedFormData.level) {
      newErrors.level = "Level is required";
    }
    if (!updatedFormData.year) {
      newErrors.year = "Year is required";
    }
    if (!updatedFormData.reference) {
      newErrors.reference = "Reference is required";
    }
    if (!updatedFormData.yield.trim()) {
      newErrors.yield = "Yield is required";
    } else {
      const yieldValue = parseInt(updatedFormData.yield);
      if (isNaN(yieldValue) || yieldValue <= 0) {
        newErrors.yield = "Yield must be a positive number";
      }
    }
    if (allIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const recipeData: Omit<Recipe, "id"> = {
      name: updatedFormData.name.trim(),
      description: updatedFormData.description.trim() || undefined,
      reference: updatedFormData.reference,
      category: "Recipe", // Default category
      prepTime: 0, // Default values
      cookTime: 0,
      servings: parseInt(updatedFormData.yield),
      difficulty: "Easy", // Default difficulty
      ingredients: allIngredients,
      instructions: [], // Empty instructions for now
      createdBy: "Current User", // This would come from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(recipeData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      level: "",
      year: "",
      reference: "",
      yield: "",
      ingredients: [],
      totalCost: "",
    });
    setErrors({});
    setEditingIngredients([
      {
        ingredientId: "default",
        ingredientName: "",
        quantity: 0,
        unit: "",
        cost: 0,
        notes: "",
      },
    ]);
    setNewIngredient({
      ingredientId: "",
      ingredientName: "",
      quantity: 0,
      unit: "",
      cost: 0,
      notes: "",
    });
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-4 max-h-[80vh]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Recipe Information */}
          <div className="bg-gray-50 rounded-md p-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter recipe name"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter recipe description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Level
                  </label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.level
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <option value="">Select Level</option>
                    {LEVEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.level && (
                    <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.year
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <option value="">Select Year</option>
                    {YEAR_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reference"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reference (Base recipe produces)
                  </label>
                  <select
                    id="reference"
                    value={formData.reference}
                    onChange={(e) =>
                      handleInputChange("reference", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.reference
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <option value="">Select Reference</option>
                    {REFERENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.reference && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.reference}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="yield"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Yield
                  </label>
                  <input
                    id="yield"
                    type="number"
                    min="1"
                    value={formData.yield}
                    onChange={(e) => handleInputChange("yield", e.target.value)}
                    placeholder="1"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.yield
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.yield && (
                    <p className="mt-1 text-sm text-red-600">{errors.yield}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients & Cost Details */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Ingredients & Cost Details
            </h3>

            <div className="space-y-4">
              {/* Ingredients Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Ingredient
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Unit
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Cost
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Saved ingredients */}
                    {formData.ingredients.map((ingredient, index) => (
                      <tr
                        key={`saved-${index}`}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 text-sm">
                          {ingredient.ingredientName}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {ingredient.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm">{ingredient.unit}</td>
                        <td className="px-4 py-2 text-sm">
                          ${ingredient.cost?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="text-red-600 hover:text-red-800 text-lg font-bold"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Editing ingredients (input rows) */}
                    {editingIngredients.map((ingredient, index) => (
                      <tr
                        key={`editing-${index}`}
                        className="border-b border-gray-200 bg-gray-100"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            placeholder="Ingredient"
                            value={ingredient.ingredientName}
                            onChange={(e) =>
                              updateEditingIngredient(
                                index,
                                "ingredientName",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.ingredientValidation?.[index]
                                ?.ingredientName
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.ingredientValidation?.[index]
                            ?.ingredientName && (
                            <p className="mt-1 text-xs text-red-600">
                              {
                                errors.ingredientValidation[index]
                                  .ingredientName
                              }
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            placeholder="Qty"
                            min="0"
                            step="0.01"
                            value={ingredient.quantity || ""}
                            onChange={(e) =>
                              updateEditingIngredient(
                                index,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.ingredientValidation?.[index]?.quantity
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.ingredientValidation?.[index]?.quantity && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.ingredientValidation[index].quantity}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={ingredient.unit}
                            onChange={(e) =>
                              updateEditingIngredient(
                                index,
                                "unit",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.ingredientValidation?.[index]?.unit
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Unit</option>
                            {UNIT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.ingredientValidation?.[index]?.unit && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.ingredientValidation[index].unit}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Cost"
                              min="0"
                              step="0.01"
                              value={ingredient.cost || ""}
                              onChange={(e) =>
                                updateEditingIngredient(
                                  index,
                                  "cost",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.ingredientValidation?.[index]?.cost
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.ingredientValidation?.[index]?.cost && (
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-lg">
                                *
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeEditingIngredient(index)}
                            className="text-gray-600 hover:text-red-600 text-lg font-bold"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Empty state */}
                    {formData.ingredients.length === 0 &&
                      editingIngredients.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No ingredients added yet. Click "Add New Ingredient"
                            to start.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

              {/* Add New Ingredient Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add New Ingredient
                </button>
              </div>

              {/* Total Cost */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700">
                  Total Cost for Recipe
                </label>
                <input
                  type="text"
                  value={`$${formData.totalCost}`}
                  readOnly
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
                />
              </div>

              {errors.ingredients && (
                <p className="text-sm text-red-600">{errors.ingredients}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {cancelButtonText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
