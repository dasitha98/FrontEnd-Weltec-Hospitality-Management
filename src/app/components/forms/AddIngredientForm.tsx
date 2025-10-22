"use client";

import {
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
} from "@/store/api/ingredient.api";
import { useListSupplierQuery } from "@/store/api/supplier.api";
import { Ingredient } from "@/types/domain";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface AddIngredientFormProps {
  onSubmit: (data: Omit<Ingredient, "id">) => void;
  onCancel: () => void;
  initialData?: Partial<Ingredient>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface FormData {
  id: string;
  name: string;
  description: string;
  supplierId: string;
  store: string;
  purchaseQuantity: number;
  purchaseUnit: string;
  usageUnit: string;
  purchaseCost: number;
  usageCost: number;
}

interface FormErrors {
  name?: string;
  description?: string;
  supplierId?: string;
  store?: string;
  purchaseQuantity?: string;
  purchaseUnit?: string;
  usageUnit?: string;
  purchaseCost?: string;
  usageCost?: string;
}

const SUPPLIER_OPTIONS = [
  { value: "Supplier A", label: "Supplier A" },
  { value: "Supplier B", label: "Supplier B" },
  { value: "Supplier C", label: "Supplier C" },
  { value: "Local Market", label: "Local Market" },
  { value: "Wholesale", label: "Wholesale" },
  { value: "Other", label: "Other" },
];

const STORE_OPTIONS = [
  { value: "Main Store", label: "Main Store" },
  { value: "Cold Storage", label: "Cold Storage" },
  { value: "Dry Storage", label: "Dry Storage" },
  { value: "Freezer", label: "Freezer" },
  { value: "Pantry", label: "Pantry" },
  { value: "Other", label: "Other" },
];

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "pieces", label: "Pieces" },
  { value: "cups", label: "Cups" },
  { value: "tbsp", label: "Tablespoons" },
  { value: "tsp", label: "Teaspoons" },
  { value: "boxes", label: "Boxes" },
  { value: "bags", label: "Bags" },
];

export default function AddIngredientForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  submitButtonText = "Add Ingredient",
  cancelButtonText = "Cancel",
}: AddIngredientFormProps) {
  const [
    UpdateIngredient,
    { isLoading, isSuccess: updateSuccess, isError, error },
  ] = useUpdateIngredientMutation();
  const [
    CreateIngredient,
    {
      isLoading: isCreating,
      isSuccess: createSuccess,
      isError: createError,
      error: createErrorData,
    },
  ] = useCreateIngredientMutation();
  const { data } = useListSupplierQuery();

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    description: "",
    supplierId: "",
    store: "",
    purchaseQuantity: 0,
    purchaseUnit: "",
    usageUnit: "",
    purchaseCost: 0,
    usageCost: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.ingredientId || "",
        name: initialData.name || "",
        description: initialData.description || "",
        supplierId: initialData.supplierId || "",
        store: initialData.store || "",
        purchaseQuantity: initialData.purchaseQuantity || 0,
        purchaseUnit: initialData.purchaseUnit || "",
        usageUnit: initialData.usageUnit || "",
        purchaseCost: initialData.purchaseCost || 0,
        usageCost: initialData.usageCost || 0,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      onCancel();
    }
  }, [updateSuccess, createSuccess]);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.supplierId) {
      newErrors.supplierId = "Supplier is required";
    }

    if (!formData.store) {
      newErrors.store = "Store is required";
    }

    if (!formData.purchaseQuantity) {
      newErrors.purchaseQuantity = "Purchase Qty is required";
    } else {
      const quantity = formData.purchaseQuantity;
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.purchaseQuantity = "Purchase Qty must be a positive number";
      }
    }

    if (!formData.purchaseUnit) {
      newErrors.purchaseUnit = "Purchase Unit is required";
    }

    if (!formData.usageUnit) {
      newErrors.usageUnit = "Usage Unit is required";
    }

    // Optional field validations
    if (formData.purchaseCost) {
      const cost = formData.purchaseCost;
      if (isNaN(cost) || cost < 0) {
        newErrors.purchaseCost = "Purchase Cost must be a non-negative number";
      }
    }

    if (formData.usageCost) {
      const cost = formData.usageCost;
      if (isNaN(cost) || cost < 0) {
        newErrors.usageCost = "Usage Cost must be a non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("formData", formData);
      if (isEditing) {
        await UpdateIngredient(formData).unwrap();
      } else {
        await CreateIngredient(formData).unwrap();
      }
    }
  };

  const handleReset = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      supplierId: "",
      store: "",
      purchaseQuantity: 0,
      purchaseUnit: "",
      usageUnit: "",
      purchaseCost: 0,
      usageCost: 0,
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Ingredient" : "Add New Ingredient"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter ingredient name"
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
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter detailed description of the ingredient"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors hover:border-gray-400 resize-none"
          />
        </div>

        {/* Supplier and Store Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="supplierId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              id="supplierId"
              value={formData.supplierId}
              onChange={(e) => handleInputChange("supplierId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.supplierId
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select Supplier</option>
              {data?.map((option) => (
                <option key={option.supplierId} value={option.supplierId}>
                  {option?.name}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="store"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store <span className="text-red-500">*</span>
            </label>
            <select
              id="store"
              value={formData.store}
              onChange={(e) => handleInputChange("store", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.store
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select Store</option>
              {STORE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.store && (
              <p className="mt-1 text-sm text-red-600">{errors.store}</p>
            )}
          </div>
        </div>

        {/* Purchase Qty, Purchase Unit, Usage Unit Row */}
        <div className="bg-gray-50 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Quantity & Units
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="purchaseQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Qty <span className="text-red-500">*</span>
              </label>
              <input
                id="purchaseQuantity"
                type="number"
                step="0.01"
                min="0"
                value={formData.purchaseQuantity}
                onChange={(e) =>
                  handleInputChange("purchaseQuantity", e.target.value)
                }
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.purchaseQuantity
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.purchaseQuantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchaseQuantity}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="purchaseUnit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Unit <span className="text-red-500">*</span>
              </label>
              <select
                id="purchaseUnit"
                value={formData.purchaseUnit}
                onChange={(e) =>
                  handleInputChange("purchaseUnit", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.purchaseUnit
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <option value="">Select Unit</option>
                {UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.purchaseUnit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchaseUnit}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="usageUnit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usage Unit <span className="text-red-500">*</span>
              </label>
              <select
                id="usageUnit"
                value={formData.usageUnit}
                onChange={(e) => handleInputChange("usageUnit", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.usageUnit
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <option value="">Select Unit</option>
                {UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.usageUnit && (
                <p className="mt-1 text-sm text-red-600">{errors.usageUnit}</p>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Cost and Usage Cost Row */}
        <div className="bg-blue-50 rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Cost Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="purchaseCost"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Purchase Cost
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">$</span>
                </div>
                <input
                  id="purchaseCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchaseCost}
                  onChange={(e) =>
                    handleInputChange("purchaseCost", e.target.value)
                  }
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.purchaseCost
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.purchaseCost && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchaseCost}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="usageCost"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usage Cost
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">$</span>
                </div>
                <input
                  id="usageCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.usageCost}
                  onChange={(e) =>
                    handleInputChange("usageCost", e.target.value)
                  }
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.usageCost
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.usageCost && (
                <p className="mt-1 text-sm text-red-600">{errors.usageCost}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
