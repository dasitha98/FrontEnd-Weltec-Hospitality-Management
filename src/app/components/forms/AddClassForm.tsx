"use client";

import React, { useState, useEffect } from "react";
import { useListRecipeQuery } from "@/store/api/recipes.api";
import {
  useCreateClassMutation,
  useUpdateClassMutation,
} from "@/store/api/classes.api";
import type { Class } from "@/types/domain";
import Cookies from "js-cookie";
import { getUserInfoFromToken } from "@/utils/jwt";

interface AddClassFormProps {
  onSubmit: (data: Omit<Class, "ClassId">) => void;
  onCancel: () => void;
  initialClassData?: Partial<Class>;
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
  instructor: string;
  description: string;
  Notes: string;
  sQuantity: string;
  location: string;
  dateTime: string;
  recipes: RecipeEntry[];
}

interface FormErrors {
  name?: string;
  description?: string;
  Notes?: string;
  sQuantity?: string;
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

// Remove mock recipe data; use real API data instead

export default function AddClassForm({
  onSubmit,
  onCancel,
  initialClassData,
  isEditing = false,
  submitButtonText = "Add Class",
  cancelButtonText = "Cancel",
}: AddClassFormProps) {
  const { data: recipeData, isLoading: recipesLoading } = useListRecipeQuery();
  const [
    CreateClass,
    {
      isLoading: isCreating,
      isSuccess: createSuccess,
      isError: createError,
      error: createErrorData,
    },
  ] = useCreateClassMutation();
  const [
    UpdateClass,
    { isLoading: isUpdating, isSuccess: updateSuccess, isError: updateError },
  ] = useUpdateClassMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    instructor: "",
    description: "",
    Notes: "",
    sQuantity: "",
    location: "",
    dateTime: "",
    recipes: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [editingRecipes, setEditingRecipes] = useState<RecipeEntry[]>([]);
  const [isTutorRole, setIsTutorRole] = useState(false);

  useEffect(() => {
    // Check user role from accessToken
    const token = Cookies.get("accessToken");
    if (token) {
      const userInfo = getUserInfoFromToken(token);
      setIsTutorRole(userInfo?.role === "Tutor");
    }
  }, []);

  // Helper to format Date to input[type="datetime-local"] string
  const formatDateTimeLocal = (value?: Date | string): string => {
    if (!value) return "";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  // Helper to format datetime-local input to ISO format "YYYY-MM-DDTHH:mm:ss"
  const formatClassDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    // datetime-local format is "YYYY-MM-DDTHH:mm"
    // Convert to "YYYY-MM-DDTHH:mm:ss" format
    if (dateTimeString.length === 16) {
      // Format: "2025-09-30T10:00" -> "2025-09-30T10:00:00"
      return `${dateTimeString}:00`;
    }
    // If already has seconds, return as is (or format properly)
    return dateTimeString;
  };

  // Initialize form data when initialClassData changes
  useEffect(() => {
    if (initialClassData) {
      // Populate recipes from RecipeList if available
      const initialRecipes: RecipeEntry[] =
        initialClassData.RecipeList && initialClassData.RecipeList.length > 0
          ? initialClassData.RecipeList.map((classRecipe, idx) => {
              // Find recipe name from recipeData
              const recipe = (recipeData || []).find(
                (r) => r.RecipeId === classRecipe.RecipeId
              );

              const unitCost = classRecipe.UnitCost || 0;
              const totalCost = classRecipe.TotalCost || 0;

              return {
                id: classRecipe.ClassRecipeId || `${Date.now()}-${idx}`,
                recipeId: classRecipe.RecipeId || "",
                recipeName: recipe?.Name || "",
                noOfStudents: "",
                reference: classRecipe.RReference || "",
                unitCost: unitCost ? unitCost.toString() : "",
                totalCost: totalCost ? totalCost.toFixed(2) : "",
              };
            })
          : [];

      setFormData({
        name: initialClassData.Name || "",
        instructor: initialClassData.Instructor || "",
        description: initialClassData.Description || "",
        Notes: initialClassData.Notes || "",
        sQuantity: initialClassData.SQuantity?.toString() || "",
        location: initialClassData.Location || "",
        dateTime: formatDateTimeLocal(initialClassData.ClassDateTime),
        recipes: initialRecipes,
      });
    }
  }, [initialClassData, recipeData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    // If sQuantity (No of Students) changes, recalculate all recipe total costs
    if (field === "sQuantity") {
      const noOfStudents = parseFloat(value);

      // Update form data and recalculate total costs for saved recipes
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        recipes: prev.recipes.map((recipe) => {
          const unitCost = parseFloat(recipe.unitCost);
          if (
            !isNaN(unitCost) &&
            unitCost >= 0 &&
            !isNaN(noOfStudents) &&
            noOfStudents > 0
          ) {
            return {
              ...recipe,
              totalCost: (unitCost * noOfStudents).toFixed(2),
            };
          } else if (!isNaN(unitCost) && unitCost >= 0) {
            return {
              ...recipe,
              totalCost: unitCost.toFixed(2),
            };
          }
          return recipe;
        }),
      }));

      // Recalculate total costs for editing recipes
      setEditingRecipes((prev) => {
        return prev.map((recipe) => {
          const unitCost = parseFloat(recipe.unitCost);
          if (
            !isNaN(unitCost) &&
            unitCost >= 0 &&
            !isNaN(noOfStudents) &&
            noOfStudents > 0
          ) {
            return {
              ...recipe,
              totalCost: (unitCost * noOfStudents).toFixed(2),
            };
          } else if (!isNaN(unitCost) && unitCost >= 0) {
            return {
              ...recipe,
              totalCost: unitCost.toFixed(2),
            };
          }
          return recipe;
        });
      });
    } else {
      // For other fields, just update the field value
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
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

    if (!recipe.unitCost) {
      newErrors.recipeValidation[index].unitCost = "Unit Cost is required";
      isValid = false;
    } else {
      const Cost = parseFloat(recipe.unitCost);
      if (isNaN(Cost) || Cost < 0) {
        newErrors.recipeValidation[index].unitCost =
          "Unit Cost must be a non-negative number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const addRecipe = () => {
    // Add a new empty row for recipe editing
    const newRecipe: RecipeEntry = {
      id: Date.now().toString(),
      recipeId: "",
      recipeName: "",
      noOfStudents: "",
      reference: "",
      unitCost: "",
      totalCost: "",
    };

    console.log("Adding new recipe:", newRecipe);
    console.log("Current editingRecipes before:", editingRecipes);

    // Append the new row to the `editingRecipes` state
    setEditingRecipes((prev) => {
      const updated = [...prev, newRecipe];
      console.log("Updated editingRecipes:", updated);
      return updated;
    });
  };

  const updateEditingRecipe = (
    index: number,
    field: keyof RecipeEntry,
    value: string
  ) => {
    console.log(`Updating editing recipe [${index}].${field} =`, value);

    setEditingRecipes((prev) => {
      const updated = prev.map((recipe, i) => {
        if (i === index) {
          const updatedRecipe = { ...recipe, [field]: value };

          // Calculate total Cost when unitCost changes or when noOfStudents changes
          if (field === "unitCost" || field === "noOfStudents") {
            const unitCost = parseFloat(updatedRecipe.unitCost);
            const noOfStudents = parseFloat(
              formData.sQuantity || updatedRecipe.noOfStudents
            );

            if (
              !isNaN(unitCost) &&
              unitCost >= 0 &&
              !isNaN(noOfStudents) &&
              noOfStudents > 0
            ) {
              // Total Cost = Unit Cost * No of Students
              updatedRecipe.totalCost = (unitCost * noOfStudents).toFixed(2);
            } else if (!isNaN(unitCost) && unitCost >= 0) {
              // If no students value, just use unit cost
              updatedRecipe.totalCost = unitCost.toFixed(2);
            } else {
              updatedRecipe.totalCost = "";
            }
          }

          return updatedRecipe;
        }
        return recipe;
      });
      console.log("Updated editingRecipes:", updated);
      return updated;
    });

    // Clear validation error for this field when user starts typing
    setErrors((prev) => ({
      ...prev,
      recipeValidation: {
        ...prev.recipeValidation,
        [index]: {
          ...prev.recipeValidation?.[index],
          [field]: undefined,
        },
      },
    }));
  };

  const updateSavedRecipe = (
    index: number,
    field: keyof RecipeEntry,
    value: string
  ) => {
    console.log(`Updating saved recipe [${index}].${field} =`, value);

    setFormData((prev) => {
      const updated = {
        ...prev,
        recipes: prev.recipes.map((recipe, i) => {
          if (i === index) {
            const updatedRecipe = { ...recipe, [field]: value };

            // Calculate total Cost when unitCost changes or when noOfStudents changes
            if (field === "unitCost" || field === "noOfStudents") {
              const unitCost = parseFloat(updatedRecipe.unitCost);
              const noOfStudents = parseFloat(
                prev.sQuantity || updatedRecipe.noOfStudents
              );

              if (
                !isNaN(unitCost) &&
                unitCost >= 0 &&
                !isNaN(noOfStudents) &&
                noOfStudents > 0
              ) {
                // Total Cost = Unit Cost * No of Students
                updatedRecipe.totalCost = (unitCost * noOfStudents).toFixed(2);
              } else if (!isNaN(unitCost) && unitCost >= 0) {
                // If no students value, just use unit cost
                updatedRecipe.totalCost = unitCost.toFixed(2);
              } else {
                updatedRecipe.totalCost = "";
              }
            }

            return updatedRecipe;
          }
          return recipe;
        }),
      };
      console.log("Updated formData.recipes:", updated.recipes);
      return updated;
    });

    // Clear errors for this field when user starts typing
    if (errors.recipeValidation?.[index]) {
      setErrors((prev) => ({
        ...prev,
        recipeValidation: {
          ...prev.recipeValidation,
          [index]: {
            ...prev.recipeValidation?.[index],
            [field]: undefined,
          },
        },
      }));
    }
  };

  // Remove recipe from editing state
  const removeEditingRecipe = (index: number) => {
    setEditingRecipes((prev) => {
      // Filter out the recipe at the specified index
      return prev.filter((_, i) => i !== index);
    });
  };

  const getTotalCost = () => {
    // Calculate total Cost from both saved and editing recipes
    const savedCost = formData.recipes.reduce((total, recipe) => {
      const Cost = parseFloat(recipe.totalCost);
      return total + (isNaN(Cost) ? 0 : Cost);
    }, 0);

    const editingCost = editingRecipes.reduce((total, recipe) => {
      const Cost = parseFloat(recipe.totalCost);
      return total + (isNaN(Cost) ? 0 : Cost);
    }, 0);

    return savedCost + editingCost;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.sQuantity || formData.sQuantity.trim() === "") {
      newErrors.sQuantity = "No of Students is required";
    } else {
      const sQty = parseFloat(formData.sQuantity);
      if (isNaN(sQty) || sQty < 0) {
        newErrors.sQuantity = "No of Students must be a non-negative number";
      }
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.dateTime) {
      newErrors.dateTime = "Date Time is required";
    }

    // Validate all recipe rows (both saved and editing)
    let hasRecipeErrors = false;
    // Don't initialize recipeValidation here - only add it if there are actual errors

    formData.recipes.forEach((recipe, index) => {
      if (!validateRecipeRow(recipe, index)) {
        hasRecipeErrors = true;
      }
    });

    editingRecipes.forEach((recipe, index) => {
      const actualIndex = formData.recipes.length + index;
      if (!validateRecipeRow(recipe, actualIndex)) {
        hasRecipeErrors = true;
      }
    });

    // Only add recipeValidation to errors if there are actual validation errors
    // Since validateRecipeRow sets errors in state, check the current errors state
    if (hasRecipeErrors && errors.recipeValidation) {
      const hasActualErrors = Object.keys(errors.recipeValidation).some(
        (key) => {
          const errorObj = errors.recipeValidation?.[Number(key)];
          return errorObj && Object.keys(errorObj).length > 0;
        }
      );
      if (hasActualErrors) {
        newErrors.recipeValidation = errors.recipeValidation;
      } else {
        // No actual errors, don't include recipeValidation in newErrors
      }
    }
    // If hasRecipeErrors is false, don't add recipeValidation at all

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !hasRecipeErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty/invalid recipes from saved recipes
    const savedValidRecipes = formData.recipes.filter((recipe) => {
      return recipe.recipeId && recipe.recipeId.trim() !== "";
    });

    // Filter out empty/invalid recipes from editing recipes
    const editingValidRecipes = editingRecipes.filter((recipe) => {
      return recipe.recipeId && recipe.recipeId.trim() !== "";
    });

    // Combine only valid recipes
    const allRecipes = [...savedValidRecipes, ...editingValidRecipes];

    console.log("Form submission debug:");
    console.log("formData.recipes:", formData.recipes);
    console.log("editingRecipes:", editingRecipes);
    console.log("allRecipes:", allRecipes);

    // Filter out empty/invalid recipes (this should be redundant now but keeping for safety)
    const validRecipes = allRecipes.filter((recipe) => {
      console.log("Checking recipe:", recipe);

      // Validate that recipe has an ID
      const isValid = recipe.recipeId && recipe.recipeId.trim() !== "";

      console.log("Is valid:", isValid);
      return isValid;
    });

    if (validateForm()) {
      console.log("validRecipes", validRecipes);

      const transformedRecipes = validRecipes.map((recipe) => {
        // RecipeId is now a string
        const recipeId = recipe.recipeId?.trim() || undefined;
        // Convert UnitCost from string to number
        const unitCostValue = recipe.unitCost
          ? parseFloat(recipe.unitCost)
          : NaN;
        return {
          RecipeId: recipeId,
          RReference: recipe.reference || "",
          UnitCost:
            Number.isFinite(unitCostValue) && unitCostValue >= 0
              ? unitCostValue
              : undefined,
        };
      });

      // Get SQuantity from form input
      const sQuantity = formData.sQuantity ? parseFloat(formData.sQuantity) : 0;

      if (isEditing) {
        const updatePayload: Partial<Omit<Class, "ClassDateTime">> & {
          id: string;
          ClassDateTime?: string;
        } = {
          id: initialClassData?.ClassId || "",
          Name: formData.name.trim(),
          Instructor: formData.instructor.trim() || undefined,
          Description: formData.description.trim() || undefined,
          Notes: formData.Notes.trim() || undefined,
          Location: formData.location,
          ClassDateTime: formData.dateTime
            ? formatClassDateTime(formData.dateTime)
            : undefined,
          SQuantity: sQuantity,
          RecipeList: transformedRecipes,
        };

        console.log("updatePayload", updatePayload);
        await UpdateClass(updatePayload as any).unwrap();
      } else {
        const createPayload = {
          Name: formData.name.trim(),
          Instructor: formData.instructor.trim() || undefined,
          Description: formData.description.trim() || undefined,
          Notes: formData.Notes.trim() || undefined,
          Location: formData.location,
          ClassDateTime: formData.dateTime
            ? formatClassDateTime(formData.dateTime)
            : undefined,
          SQuantity: sQuantity,
          RecipeList: transformedRecipes,
        } as Omit<Class, "ClassId"> & { ClassDateTime?: string };

        console.log("createPayload:", createPayload);
        await CreateClass(createPayload).unwrap();
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      instructor: "",
      description: "",
      Notes: "",
      sQuantity: "",
      location: "",
      dateTime: "",
      recipes: [],
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      onCancel();
    }
  }, [updateSuccess, createSuccess, onCancel]);

  return (
    <div className="flex flex-col bg-white">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? "Edit Class" : "Add New Class"}
        </h1>
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

            {/* Instructor */}
            <div>
              <label
                htmlFor="instructor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instructor
              </label>
              <input
                id="instructor"
                type="text"
                value={formData.instructor}
                onChange={(e) =>
                  handleInputChange("instructor", e.target.value)
                }
                placeholder="Enter instructor name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
              />
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
                htmlFor="Notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
              </label>
              <input
                id="Notes"
                type="text"
                value={formData.Notes}
                onChange={(e) => handleInputChange("Notes", e.target.value)}
                placeholder="Enter Notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400"
              />
            </div>

            {/* SQuantity */}
            <div>
              <label
                htmlFor="sQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                No of Students
              </label>
              <input
                id="sQuantity"
                type="number"
                min="0"
                value={formData.sQuantity}
                onChange={(e) => handleInputChange("sQuantity", e.target.value)}
                placeholder="Enter no. of Students"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.sQuantity
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.sQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.sQuantity}</p>
              )}
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
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
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
                  <p className="mt-1 text-sm text-red-600">{errors.dateTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recipe & Cost Details */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Recipe & Cost Details
            </h3>

            <div className="space-y-4">
              {/* Recipe Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                  <thead className="bg-blue-950 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        Recipe
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
                    {/* All recipes (both saved and editing) */}
                    {[...formData.recipes, ...editingRecipes].map(
                      (data, index) => {
                        const isEditing = index >= formData.recipes.length;
                        const actualIndex = isEditing
                          ? index - formData.recipes.length
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
                                value={data.recipeId}
                                disabled={recipesLoading}
                                onChange={(e) => {
                                  const RecipeId = e.target.value;

                                  // Update recipe name for display purposes
                                  const selectedRecipe = (
                                    recipeData || []
                                  ).find((r) => r.RecipeId === RecipeId);
                                  const RecipeName = selectedRecipe?.Name || "";
                                  const RecipeReference =
                                    selectedRecipe?.RReference || "";
                                  const RecipeUnitCost =
                                    selectedRecipe?.TotalCost || 0;

                                  if (isEditing) {
                                    updateEditingRecipe(
                                      actualIndex,
                                      "recipeId",
                                      RecipeId
                                    );
                                    updateEditingRecipe(
                                      actualIndex,
                                      "recipeName",
                                      RecipeName
                                    );
                                    // Auto-fill reference from selected recipe
                                    updateEditingRecipe(
                                      actualIndex,
                                      "reference",
                                      RecipeReference
                                    );
                                    // Auto-fill unit cost from selected recipe
                                    updateEditingRecipe(
                                      actualIndex,
                                      "unitCost",
                                      RecipeUnitCost.toString()
                                    );
                                  } else {
                                    updateSavedRecipe(
                                      index,
                                      "recipeId",
                                      RecipeId
                                    );
                                    updateSavedRecipe(
                                      index,
                                      "recipeName",
                                      RecipeName
                                    );
                                    // Auto-fill reference from selected recipe
                                    updateSavedRecipe(
                                      index,
                                      "reference",
                                      RecipeReference
                                    );
                                    // Auto-fill unit cost from selected recipe
                                    updateSavedRecipe(
                                      index,
                                      "unitCost",
                                      RecipeUnitCost.toString()
                                    );
                                  }
                                }}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.recipeValidation?.[actualIndex]
                                    ?.recipeId
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              >
                                <option value="">
                                  {recipesLoading
                                    ? "Loading recipes..."
                                    : "Select Recipe"}
                                </option>
                                {!recipesLoading &&
                                  (recipeData || []).map((option) => (
                                    <option
                                      key={option.RecipeId}
                                      value={option.RecipeId || ""}
                                    >
                                      {option.Name ||
                                        `Recipe #${option.RecipeId}`}
                                    </option>
                                  ))}
                              </select>
                              {isEditing &&
                                errors.recipeValidation?.[actualIndex]
                                  ?.recipeId && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {
                                      errors.recipeValidation[actualIndex]
                                        .recipeId
                                    }
                                  </p>
                                )}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                placeholder="Reference"
                                value={data.reference}
                                onChange={(e) =>
                                  isEditing
                                    ? updateEditingRecipe(
                                        actualIndex,
                                        "reference",
                                        e.target.value
                                      )
                                    : updateSavedRecipe(
                                        index,
                                        "reference",
                                        e.target.value
                                      )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Unit Cost"
                                  min="0"
                                  step="0.01"
                                  value={data.unitCost}
                                  onChange={(e) =>
                                    isEditing
                                      ? updateEditingRecipe(
                                          actualIndex,
                                          "unitCost",
                                          e.target.value
                                        )
                                      : updateSavedRecipe(
                                          index,
                                          "unitCost",
                                          e.target.value
                                        )
                                  }
                                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.recipeValidation?.[actualIndex]
                                      ?.unitCost
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </div>
                              {isEditing &&
                                errors.recipeValidation?.[actualIndex]
                                  ?.unitCost && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {
                                      errors.recipeValidation[actualIndex]
                                        .unitCost
                                    }
                                  </p>
                                )}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={`$${data.totalCost || "0.00"}`}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              {isEditing ? (
                                <div className="flex justify-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeEditingRecipe(actualIndex)
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
                                    setFormData((prev) => ({
                                      ...prev,
                                      recipes: prev.recipes.filter(
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
                    {formData.recipes.length === 0 &&
                      editingRecipes.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No recipes yet. Click "Add Recipe" to add recipes.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

              {/* Add Recipe Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addRecipe}
                  className="px-4 py-2 bg-blue-950 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              disabled={isTutorRole}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-950 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
