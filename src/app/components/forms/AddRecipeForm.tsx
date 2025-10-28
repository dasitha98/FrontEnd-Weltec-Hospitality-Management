"use client";

import React, { useState, useEffect } from "react";
import type { Ingredient, Recipe, RecipeIngredient } from "@/types/domain";
import {
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
} from "@/store/api/recipes.api";
import { useListIngredientQuery } from "@/store/api/ingredient.api";

interface AddRecipeFormProps {
  onSubmit: (data: Omit<Recipe, "RecipeId">) => void;
  onCancel: () => void;
  initialRecipeData?: Partial<Recipe>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface FormData {
  Name: string;
  Description: string;
  RLevel: string;
  Year: string;
  RReference: string;
  Yield: number;
  RecipeIngredients: RecipeIngredient[];
  TotalCost: string;
}

interface FormErrors {
  Name?: string;
  Description?: string;
  RLevel?: string;
  Year?: string;
  RReference?: string;
  Yield?: string;
  TotalCost?: string;
  ingredientValidation?: {
    [key: number]:
      | {
          IngredientName?: string;
          Quantity?: string;
          Unit?: string;
          Cost?: string;
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
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
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
  initialRecipeData,
  isEditing = false,
  submitButtonText = "Add Recipe",
  cancelButtonText = "Cancel",
}: AddRecipeFormProps) {
  const [
    UpdateRecipe,
    { isLoading, isSuccess: updateSuccess, isError, error },
  ] = useUpdateRecipeMutation();
  const { data: IngredientListData, isLoading: isLoadingIngredients } =
    useListIngredientQuery();

  const [
    CreateRecipe,
    {
      isLoading: isCreating,
      isSuccess: createSuccess,
      isError: createError,
      error: createErrorData,
    },
  ] = useCreateRecipeMutation();
  const [formData, setFormData] = useState<FormData>({
    Name: "",
    Description: "",
    RLevel: "",
    Year: "",
    RReference: "",
    Yield: 0,
    RecipeIngredients: [],
    TotalCost: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [editingIngredients, setEditingIngredients] = useState<
    RecipeIngredient[]
  >([]);

  // Initialize form data when initialRecipeData changes
  useEffect(() => {
    if (initialRecipeData) {
      setFormData({
        Name: initialRecipeData.Name || "",
        Description: initialRecipeData.Description || "",
        RLevel: initialRecipeData.RLevel || "",
        Year: initialRecipeData.Year || "",
        RReference: initialRecipeData.RReference || "",
        Yield: initialRecipeData.Yield || 0,
        RecipeIngredients: initialRecipeData?.RecipeIngredients || [],
        TotalCost: initialRecipeData.TotalCost?.toString() || "",
      });
    }
  }, [initialRecipeData]);

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

  const saveCurrentIngredient = (index: number) => {
    const ingredient = editingIngredients[index];

    // Validate the ingredient
    if (
      ingredient.IngredientName &&
      ingredient.Quantity > 0 &&
      ingredient.Unit &&
      typeof ingredient.Cost === "number" &&
      ingredient.Cost >= 0
    ) {
      // Add to saved ingredients
      setFormData((prev) => ({
        ...prev,
        RecipeIngredients: [...prev.RecipeIngredients, ingredient],
      }));

      // Remove from editing ingredients
      setEditingIngredients((prev) => prev.filter((_, i) => i !== index));

      // Clear validation errors
      setErrors((prev) => ({
        ...prev,
        ingredientValidation: {
          ...prev.ingredientValidation,
          [index]: undefined,
        },
      }));
    } else {
      // Show validation errors
      const validationErrors: {
        IngredientName?: string;
        Quantity?: string;
        Unit?: string;
        Cost?: string;
      } = {};

      if (!ingredient.IngredientName) {
        validationErrors.IngredientName = "Ingredient name is required";
      }
      if (!ingredient.Quantity || ingredient.Quantity <= 0) {
        validationErrors.Quantity = "Quantity must be greater than 0";
      }
      if (!ingredient.Unit) {
        validationErrors.Unit = "Unit is required";
      }
      if (ingredient.Cost === undefined || ingredient.Cost < 0) {
        validationErrors.Cost = "Cost must be a non-negative number";
      }

      setErrors((prev) => ({
        ...prev,
        ingredientValidation: {
          ...prev.ingredientValidation,
          [index]: validationErrors,
        },
      }));
    }
  };

  const addIngredient = () => {
    // Add a new empty row for ingredient editing
    const newIngredientRow: RecipeIngredient = {
      IngredientId: Date.now().toString(),
      IngredientName: "",
      Quantity: 0,
      Unit: "",
      Cost: 0,
      Notes: "",
    };

    console.log("Adding new ingredient:", newIngredientRow);
    console.log("Current editingIngredients before:", editingIngredients);

    // Append the new row to the `editingIngredients` state
    setEditingIngredients((prev) => {
      const updated = [...prev, newIngredientRow];
      console.log("Updated editingIngredients:", updated);
      return updated;
    });
  };

  // Calculate total Cost from both saved and editing ingredients
  const calculateTotalCost = () => {
    const savedCost = formData.RecipeIngredients?.reduce((sum, ingredient) => {
      if (ingredient.Cost && typeof ingredient.Cost === "number") {
        return sum + ingredient.Cost;
      }
      return sum;
    }, 0);

    const editingCost = editingIngredients.reduce((sum, ingredient) => {
      if (ingredient.Cost && typeof ingredient.Cost === "number") {
        return sum + ingredient.Cost;
      }
      return sum;
    }, 0);

    return savedCost + editingCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty/invalid ingredients from saved ingredients
    const savedValidIngredients = formData.RecipeIngredients.filter(
      (ingredient) => {
        return ingredient.IngredientId && ingredient.IngredientId.trim() !== "";
      }
    );

    // Filter out empty/invalid ingredients from editing ingredients
    const editingValidIngredients = editingIngredients.filter((ingredient) => {
      return ingredient.IngredientId && ingredient.IngredientId.trim() !== "";
    });

    // Combine only valid ingredients
    const allIngredients = [
      ...savedValidIngredients,
      ...editingValidIngredients,
    ];

    console.log("Form submission debug:");
    console.log("formData.RecipeIngredients:", formData.RecipeIngredients);
    console.log("editingIngredients:", editingIngredients);
    console.log("allIngredients:", allIngredients);

    // Filter out empty/invalid ingredients (this should be redundant now but keeping for safety)
    const validIngredients = allIngredients.filter((ingredient) => {
      console.log("Checking ingredient:", ingredient);

      // Validate that ingredient has an ID
      const isValid =
        ingredient.IngredientId && ingredient.IngredientId.trim() !== "";

      console.log("Is valid:", isValid);
      return isValid;
    });

    console.log("validIngredients:", validIngredients);

    if (validateForm()) {
      // Calculate total Cost from all valid ingredients
      const totalCost = validIngredients.reduce(
        (sum, ingredient) => sum + (ingredient.Cost || 0),
        0
      );

      console.log("totalCost:", totalCost);

      const transformedIngredients = allIngredients.map((ingredient) => ({
        IngredientId: ingredient.IngredientId || ingredient.IngredientId || "",
        IngredientName: ingredient.IngredientName,
        Quantity: ingredient.Quantity,
        Unit: ingredient.Unit,
        Cost:
          ingredient.Cost !== undefined && ingredient.Cost !== null
            ? Number(ingredient.Cost)
            : 0,
        Notes: ingredient.Notes || "",
      }));

      if (isEditing) {
        const updatePayload: Partial<Recipe> & { id: string } = {
          id: initialRecipeData?.RecipeId || "",
          Name: formData.Name.trim(),
          Description: formData.Description.trim() || undefined,
          Yield: Number(formData.Yield) || 0,
          RLevel: formData.RLevel,
          RReference: formData.RReference,
          TotalCost: totalCost,
          Year: formData.Year,
          IngredientList: transformedIngredients,
        };

        console.log("updatePayload", updatePayload);
        await UpdateRecipe(updatePayload).unwrap();
      } else {
        const createPayload = {
          Name: formData.Name.trim(),
          Description: formData.Description.trim() || undefined,
          Yield: Number(formData.Yield) || 0,
          RLevel: formData.RLevel,
          RReference: formData.RReference,
          TotalCost: totalCost,
          Year: formData.Year,
          IngredientList: transformedIngredients,
        } as Omit<Recipe, "RecipeId">;

        console.log("createPayload:", createPayload);
        await CreateRecipe(createPayload).unwrap();
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "Recipe name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setFormData({
      Name: "",
      Description: "",
      RLevel: "",
      Year: "",
      RReference: "",
      Yield: 0,
      RecipeIngredients: [],
      TotalCost: "",
    });
    onCancel();
  };

  const updateEditingIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => {
    console.log(`Updating editing ingredient [${index}].${field} =`, value);

    setEditingIngredients((prev) => {
      const updated = prev.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      );
      console.log("Updated editingIngredients:", updated);
      return updated;
    });

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

  const updateSavedIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => {
    console.log(`Updating saved ingredient [${index}].${field} =`, value);

    setFormData((prev) => {
      const updated = {
        ...prev,
        RecipeIngredients: prev.RecipeIngredients.map((ingredient, i) =>
          i === index ? { ...ingredient, [field]: value } : ingredient
        ),
      };
      console.log(
        "Updated formData.RecipeIngredients:",
        updated.RecipeIngredients
      );
      return updated;
    });
  };

  // Remove ingredient from editing state
  const removeEditingIngredient = (index: number) => {
    setEditingIngredients((prev) => {
      // Filter out the ingredient at the specified index
      return prev.filter((_, i) => i !== index);
    });
  };
  return (
    <div className="flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 max-h-[80vh]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Recipe Information */}
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
                value={formData.Name}
                onChange={(e) => handleInputChange("Name", e.target.value)}
                placeholder="Enter recipe name"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.Name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
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
                value={formData.Description}
                onChange={(e) =>
                  handleInputChange("Description", e.target.value)
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
                  value={formData.RLevel}
                  onChange={(e) => handleInputChange("RLevel", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.RLevel
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
                {errors.RLevel && (
                  <p className="mt-1 text-sm text-red-600">{errors.RLevel}</p>
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
                  value={formData.Year}
                  onChange={(e) => handleInputChange("Year", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.Year
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
                {errors.Year && (
                  <p className="mt-1 text-sm text-red-600">{errors.Year}</p>
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
                  value={formData.RReference}
                  onChange={(e) =>
                    handleInputChange("RReference", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.RReference
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
                {errors.RReference && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.RReference}
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
                  value={formData.Yield}
                  onChange={(e) => handleInputChange("Yield", e.target.value)}
                  placeholder="1"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.Yield
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.Yield && (
                  <p className="mt-1 text-sm text-red-600">{errors.Yield}</p>
                )}
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
                  <thead className="bg-blue-950 text-white">
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
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Notes
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* All ingredients (both saved and editing) */}
                    {[...formData.RecipeIngredients, ...editingIngredients].map(
                      (data, index) => {
                        const isEditing =
                          index >= formData.RecipeIngredients.length;
                        const actualIndex = isEditing
                          ? index - formData.RecipeIngredients.length
                          : index;

                        return (
                          <tr
                            key={
                              isEditing
                                ? `editing-${actualIndex}`
                                : `saved-${index}`
                            }
                            className={`border-b border-gray-200 ${
                              isEditing ? "bg-gray-100" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-2">
                              <select
                                value={
                                  data.IngredientId ||
                                  data.IngredientIdAlternate ||
                                  data.Ingredient?.IngredientId ||
                                  ""
                                }
                                onChange={(e) => {
                                  console.log(
                                    "Dropdown changed, value:",
                                    e.target.value
                                  );
                                  const selectedIngredient =
                                    IngredientListData?.find(
                                      (ing) =>
                                        ing.IngredientId === e.target.value
                                    );
                                  console.log(
                                    "Selected ingredient:",
                                    selectedIngredient
                                  );

                                  const IngredientName =
                                    selectedIngredient?.Name || "";
                                  const IngredientId =
                                    selectedIngredient?.IngredientId || "";

                                  console.log(
                                    "Setting IngredientId:",
                                    IngredientId,
                                    "IngredientName:",
                                    IngredientName
                                  );

                                  if (isEditing) {
                                    console.log(
                                      "Updating editing ingredient at index:",
                                      actualIndex
                                    );
                                    updateEditingIngredient(
                                      actualIndex,
                                      "IngredientId",
                                      IngredientId
                                    );
                                    updateEditingIngredient(
                                      actualIndex,
                                      "IngredientName",
                                      IngredientName
                                    );
                                  } else {
                                    console.log(
                                      "Updating saved ingredient at index:",
                                      index
                                    );
                                    updateSavedIngredient(
                                      index,
                                      "IngredientId",
                                      IngredientId
                                    );
                                    updateSavedIngredient(
                                      index,
                                      "IngredientName",
                                      IngredientName
                                    );
                                  }
                                }}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.ingredientValidation?.[actualIndex]
                                    ?.IngredientName
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              >
                                <option value="">
                                  {isLoadingIngredients
                                    ? "Loading..."
                                    : "Select Ingredient"}
                                </option>
                                {IngredientListData &&
                                IngredientListData.length > 0 ? (
                                  IngredientListData.map((ingredient) => (
                                    <option
                                      key={ingredient.IngredientId}
                                      value={ingredient.IngredientId}
                                    >
                                      {ingredient.Name}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled>
                                    No ingredients available
                                  </option>
                                )}
                              </select>
                              {isEditing &&
                                errors.ingredientValidation?.[actualIndex]
                                  ?.IngredientName && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {
                                      errors.ingredientValidation[actualIndex]
                                        .IngredientName
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
                                value={data.Quantity}
                                onChange={(e) =>
                                  isEditing
                                    ? updateEditingIngredient(
                                        actualIndex,
                                        "Quantity",
                                        parseFloat(e.target.value) || 0
                                      )
                                    : updateSavedIngredient(
                                        index,
                                        "Quantity",
                                        parseFloat(e.target.value) || 0
                                      )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.ingredientValidation?.[actualIndex]
                                    ?.Quantity
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              />
                              {isEditing &&
                                errors.ingredientValidation?.[actualIndex]
                                  ?.Quantity && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {
                                      errors.ingredientValidation[actualIndex]
                                        .Quantity
                                    }
                                  </p>
                                )}
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={data.Unit}
                                onChange={(e) =>
                                  isEditing
                                    ? updateEditingIngredient(
                                        actualIndex,
                                        "Unit",
                                        e.target.value
                                      )
                                    : updateSavedIngredient(
                                        index,
                                        "Unit",
                                        e.target.value
                                      )
                                }
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.ingredientValidation?.[actualIndex]
                                    ?.Unit
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              >
                                <option value="">Unit</option>
                                {UNIT_OPTIONS.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              {isEditing &&
                                errors.ingredientValidation?.[actualIndex]
                                  ?.Unit && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {
                                      errors.ingredientValidation[actualIndex]
                                        .Unit
                                    }
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
                                  value={data.Cost}
                                  onChange={(e) =>
                                    isEditing
                                      ? updateEditingIngredient(
                                          actualIndex,
                                          "Cost",
                                          parseFloat(e.target.value) || 0
                                        )
                                      : updateSavedIngredient(
                                          index,
                                          "Cost",
                                          parseFloat(e.target.value) || 0
                                        )
                                  }
                                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.ingredientValidation?.[actualIndex]
                                      ?.Cost
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                />
                                {isEditing &&
                                  errors.ingredientValidation?.[actualIndex]
                                    ?.Cost && (
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 text-lg">
                                      *
                                    </span>
                                  )}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                placeholder="Notes"
                                value={data.Notes || ""}
                                onChange={(e) =>
                                  isEditing
                                    ? updateEditingIngredient(
                                        actualIndex,
                                        "Notes",
                                        e.target.value
                                      )
                                    : updateSavedIngredient(
                                        index,
                                        "Notes",
                                        e.target.value
                                      )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              {isEditing ? (
                                <div className="flex justify-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEditingIngredient(actualIndex)
                                    }
                                    className="text-gray-600 hover:text-red-600 text-lg font-bold"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Remove from saved ingredients
                                    setFormData((prev) => ({
                                      ...prev,
                                      RecipeIngredients:
                                        prev.RecipeIngredients.filter(
                                          (_, i) => i !== index
                                        ),
                                    }));
                                  }}
                                  className="text-red-600 hover:text-red-800 text-lg font-bold"
                                >
                                  ×
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}

                    {/* Empty state */}
                    {formData.RecipeIngredients.length === 0 &&
                      editingIngredients.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No ingredients yet. Click "Add New Ingredient" to
                            add ingredients.
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
                  className="px-4 py-2 bg-blue-950 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  value={`$${calculateTotalCost().toFixed(2)}`}
                  readOnly
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
                />
              </div>

              {/* {errors.ingredients && (
                <p className="text-sm text-red-600">{errors.ingredients}</p>
              )} */}
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-950 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
