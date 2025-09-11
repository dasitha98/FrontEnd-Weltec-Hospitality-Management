"use client";

import React, { useState, useEffect } from "react";
import type { Class, Recipe } from "@/types/domain";

interface AddClassFormProps {
  onSubmit: (data: Omit<Class, "id">) => void;
  onCancel: () => void;
  initialData?: Partial<Class>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface RecipeEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  noOfStudents: string;
  reference: string;
  unitCost: string;
  totalCost: string;
}

interface FormData {
  name: string;
  description: string;
  notes: string;
  location: string;
  dateTime: string;
  recipes: RecipeEntry[];
}

interface FormErrors {
  name?: string;
  description?: string;
  notes?: string;
  location?: string;
  dateTime?: string;
  recipeValidation?: {
    [key: number]: {
      recipeId?: string;
      noOfStudents?: string;
      unitCost?: string;
    };
  };
}

const LOCATION_OPTIONS = [
  { value: "Kitchen A", label: "Kitchen A" },
  { value: "Kitchen B", label: "Kitchen B" },
  { value: "Main Kitchen", label: "Main Kitchen" },
  { value: "Demo Kitchen", label: "Demo Kitchen" },
  { value: "Lab Kitchen", label: "Lab Kitchen" },
  { value: "Other", label: "Other" },
];

// Mock recipe data - in real app, this would come from API
const RECIPE_OPTIONS = [
  { value: "recipe1", label: "Chicken Curry" },
  { value: "recipe2", label: "Pasta Carbonara" },
  { value: "recipe3", label: "Beef Stir Fry" },
  { value: "recipe4", label: "Vegetable Soup" },
  { value: "recipe5", label: "Fish and Chips" },
];

export default function AddClassForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  submitButtonText = "Add Class",
  cancelButtonText = "Cancel",
}: AddClassFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    notes: "",
    location: "",
    dateTime: "",
    recipes: [
      {
        id: Date.now().toString(),
        recipeId: "",
        recipeName: "",
        noOfStudents: "",
        reference: "",
        unitCost: "",
        totalCost: "",
      },
    ],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        notes: "",
        location: initialData.location || "",
        dateTime: initialData.startDate || "",
        recipes: [],
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

  const validateRecipeRow = (recipe: RecipeEntry, index: number): boolean => {
    const newErrors: FormErrors = { ...errors };

    if (!newErrors.recipeValidation) {
      newErrors.recipeValidation = {};
    }

    let isValid = true;

    // Clear previous errors for this row
    newErrors.recipeValidation[index] = {};

    if (!recipe.recipeId) {
      newErrors.recipeValidation[index].recipeId = "Recipe is required";
      isValid = false;
    }

    if (!recipe.noOfStudents) {
      newErrors.recipeValidation[index].noOfStudents =
        "No of Students is required";
      isValid = false;
    } else {
      const students = parseFloat(recipe.noOfStudents);
      if (isNaN(students) || students <= 0) {
        newErrors.recipeValidation[index].noOfStudents =
          "No of Students must be a positive number";
        isValid = false;
      }
    }

    if (!recipe.unitCost) {
      newErrors.recipeValidation[index].unitCost = "Unit Cost is required";
      isValid = false;
    } else {
      const cost = parseFloat(recipe.unitCost);
      if (isNaN(cost) || cost < 0) {
        newErrors.recipeValidation[index].unitCost =
          "Unit Cost must be a non-negative number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const addRecipe = () => {
    // Validate the last recipe before adding a new one
    const lastRecipeIndex = formData.recipes.length - 1;
    const lastRecipe = formData.recipes[lastRecipeIndex];

    if (formData.recipes.length > 0 && lastRecipe) {
      // Check if the last recipe has required fields filled
      if (!validateRecipeRow(lastRecipe, lastRecipeIndex)) {
        // Don't add new recipe if current one is incomplete
        return;
      }
    }

    const newRecipe: RecipeEntry = {
      id: Date.now().toString(),
      recipeId: "",
      recipeName: "",
      noOfStudents: "",
      reference: "",
      unitCost: "",
      totalCost: "",
    };
    setFormData((prev) => ({
      ...prev,
      recipes: [...prev.recipes, newRecipe],
    }));
  };

  const removeRecipe = (recipeId: string) => {
    // Don't allow removing the last row
    if (formData.recipes.length <= 1) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      recipes: prev.recipes.filter((recipe) => recipe.id !== recipeId),
    }));
  };

  const updateRecipe = (
    recipeId: string,
    field: keyof RecipeEntry,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      recipes: prev.recipes.map((recipe) => {
        if (recipe.id === recipeId) {
          const updatedRecipe = { ...recipe, [field]: value };

          // Calculate total cost when relevant fields change
          if (field === "noOfStudents" || field === "unitCost") {
            const noOfStudents =
              field === "noOfStudents"
                ? parseFloat(value)
                : parseFloat(recipe.noOfStudents);
            const unitCost =
              field === "unitCost"
                ? parseFloat(value)
                : parseFloat(recipe.unitCost);

            if (!isNaN(noOfStudents) && !isNaN(unitCost)) {
              updatedRecipe.totalCost = (noOfStudents * unitCost).toFixed(2);
            } else {
              updatedRecipe.totalCost = "";
            }
          }

          return updatedRecipe;
        }
        return recipe;
      }),
    }));

    // Clear errors for this field when user starts typing
    const recipeIndex = formData.recipes.findIndex(
      (recipe) => recipe.id === recipeId
    );
    if (recipeIndex !== -1 && errors.recipeValidation?.[recipeIndex]) {
      setErrors((prev) => ({
        ...prev,
        recipeValidation: {
          ...prev.recipeValidation,
          [recipeIndex]: {
            ...prev.recipeValidation?.[recipeIndex],
            [field]: undefined,
          },
        },
      }));
    }
  };

  const getTotalCost = () => {
    return formData.recipes.reduce((total, recipe) => {
      const cost = parseFloat(recipe.totalCost);
      return total + (isNaN(cost) ? 0 : cost);
    }, 0);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.dateTime) {
      newErrors.dateTime = "Date Time is required";
    }

    // Validate all recipe rows
    let hasRecipeErrors = false;
    newErrors.recipeValidation = {};

    formData.recipes.forEach((recipe, index) => {
      if (!validateRecipeRow(recipe, index)) {
        hasRecipeErrors = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !hasRecipeErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const classData: Omit<Class, "id"> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      noOfStudents: formData.recipes.reduce((total, recipe) => {
        const students = parseFloat(recipe.noOfStudents);
        return total + (isNaN(students) ? 0 : students);
      }, 0),
      location: formData.location,
      reference: formData.notes.trim() || "",
      totalCost: getTotalCost(),
      startDate: formData.dateTime,
    };

    onSubmit(classData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      notes: "",
      location: "",
      dateTime: "",
      recipes: [
        {
          id: Date.now().toString(),
          recipeId: "",
          recipeName: "",
          noOfStudents: "",
          reference: "",
          unitCost: "",
          totalCost: "",
        },
      ],
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Class</h1>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
          title="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Details Section */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              General Details
            </h3>

            <div className="space-y-4">
              {/* Name */}
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
                  placeholder="Enter class name"
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

              {/* Description */}
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
                  placeholder="Enter class description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400 resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes
                </label>
                <input
                  id="notes"
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
                />
              </div>

              {/* Location and Date Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.location
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <option value="">Select Location</option>
                    {LOCATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dateTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date Time
                  </label>
                  <input
                    id="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) =>
                      handleInputChange("dateTime", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.dateTime
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.dateTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dateTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recipe & Cost Details Section */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Recipe & Cost Details
            </h3>

            <div className="space-y-4">
              {/* Recipe Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Recipe
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        No of Students
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Reference
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Unit Cost
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Total Cost
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.recipes.map((recipe, index) => (
                      <tr
                        key={recipe.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">
                          <select
                            value={recipe.recipeId}
                            onChange={(e) => {
                              const selectedRecipe = RECIPE_OPTIONS.find(
                                (r) => r.value === e.target.value
                              );
                              updateRecipe(
                                recipe.id,
                                "recipeId",
                                e.target.value
                              );
                              updateRecipe(
                                recipe.id,
                                "recipeName",
                                selectedRecipe?.label || ""
                              );
                            }}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.recipeValidation?.[index]?.recipeId
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select Recipe</option>
                            {RECIPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.recipeValidation?.[index]?.recipeId && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.recipeValidation[index].recipeId}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            placeholder="No of Students"
                            min="1"
                            value={recipe.noOfStudents}
                            onChange={(e) =>
                              updateRecipe(
                                recipe.id,
                                "noOfStudents",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.recipeValidation?.[index]?.noOfStudents
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.recipeValidation?.[index]?.noOfStudents && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.recipeValidation[index].noOfStudents}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            placeholder="Reference"
                            value={recipe.reference}
                            onChange={(e) =>
                              updateRecipe(
                                recipe.id,
                                "reference",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            placeholder="Unit Cost"
                            min="0"
                            step="0.01"
                            value={recipe.unitCost}
                            onChange={(e) =>
                              updateRecipe(
                                recipe.id,
                                "unitCost",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.recipeValidation?.[index]?.unitCost
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.recipeValidation?.[index]?.unitCost && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.recipeValidation[index].unitCost}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={`$${recipe.totalCost || "0.00"}`}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeRecipe(recipe.id)}
                            disabled={formData.recipes.length <= 1}
                            className={`text-lg font-bold ${
                              formData.recipes.length <= 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Recipe Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addRecipe}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Recipe
                </button>
              </div>

              {/* Total Cost */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700">
                  Total Cost for All Recipes
                </label>
                <input
                  type="text"
                  value={`$${getTotalCost().toFixed(2)}`}
                  readOnly
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
                />
              </div>
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
