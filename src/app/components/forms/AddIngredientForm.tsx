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
  onSubmit: (data: Omit<Ingredient, "IngredientId">) => void;
  onCancel: () => void;
  initialData?: Partial<Ingredient>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface FormData {
  Name: string;
  Description: string;
  SupplierId: string;
  Store: string;
  PurchaseQuantity: number;
  PurchaseUnit: string;
  UsageUnit: string;
  PurchaseCost: number;
  UsageCost: number;
}

interface FormErrors {
  Name?: string;
  Description?: string;
  SupplierId?: string;
  Store?: string;
  PurchaseQuantity?: string;
  PurchaseUnit?: string;
  UsageUnit?: string;
  PurchaseCost?: string;
  UsageCost?: string;
}

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
    Name: "",
    Description: "",
    SupplierId: "",
    Store: "",
    PurchaseQuantity: 0,
    PurchaseUnit: "",
    UsageUnit: "",
    PurchaseCost: 0,
    UsageCost: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || "",
        Description: initialData.Description || "",
        SupplierId: initialData.SupplierId || "",
        Store: initialData.Store || "",
        PurchaseQuantity: initialData.PurchaseQuantity || 0,
        PurchaseUnit: initialData.PurchaseUnit || "",
        UsageUnit: initialData.UsageUnit || "",
        PurchaseCost: initialData.PurchaseCost || 0,
        UsageCost: initialData.UsageCost || 0,
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
    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    }

    if (!formData.SupplierId) {
      newErrors.SupplierId = "Supplier is required";
    }

    if (!formData.Store) {
      newErrors.Store = "Store is required";
    }

    if (!formData.PurchaseQuantity) {
      newErrors.PurchaseQuantity = "Purchase Qty is required";
    } else {
      const Quantity = formData.PurchaseQuantity;
      if (isNaN(Quantity) || Quantity <= 0) {
        newErrors.PurchaseQuantity = "Purchase Qty must be a positive number";
      }
    }

    if (!formData.PurchaseUnit) {
      newErrors.PurchaseUnit = "Purchase Unit is required";
    }

    if (!formData.UsageUnit) {
      newErrors.UsageUnit = "Usage Unit is required";
    }

    // Optional field validations
    if (formData.PurchaseCost) {
      const Cost = formData.PurchaseCost;
      if (isNaN(Cost) || Cost < 0) {
        newErrors.PurchaseCost = "Purchase Cost must be a non-negative number";
      }
    }

    if (formData.UsageCost) {
      const Cost = formData.UsageCost;
      if (isNaN(Cost) || Cost < 0) {
        newErrors.UsageCost = "Usage Cost must be a non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing && initialData?.IngredientId) {
        await UpdateIngredient({
          id: initialData.IngredientId,
          ...formData,
        }).unwrap();
      } else {
        await CreateIngredient(formData).unwrap();
      }
    }
  };

  const handleReset = () => {
    setFormData({
      Name: "",
      Description: "",
      SupplierId: "",
      Store: "",
      PurchaseQuantity: 0,
      PurchaseUnit: "",
      UsageUnit: "",
      PurchaseCost: 0,
      UsageCost: 0,
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
            value={formData.Name}
            onChange={(e) => handleInputChange("Name", e.target.value)}
            placeholder="Enter ingredient name"
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
            value={formData.Description}
            onChange={(e) => handleInputChange("Description", e.target.value)}
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
              value={formData.SupplierId}
              onChange={(e) => handleInputChange("SupplierId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.SupplierId
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select Supplier</option>
              {data?.map((option) => (
                <option key={option.SupplierId} value={option.SupplierId}>
                  {option?.Name}
                </option>
              ))}
            </select>
            {errors.SupplierId && (
              <p className="mt-1 text-sm text-red-600">{errors.SupplierId}</p>
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
              value={formData.Store}
              onChange={(e) => handleInputChange("Store", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.Store
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
            {errors.Store && (
              <p className="mt-1 text-sm text-red-600">{errors.Store}</p>
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
                value={formData.PurchaseQuantity}
                onChange={(e) =>
                  handleInputChange("PurchaseQuantity", e.target.value)
                }
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.PurchaseQuantity
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.PurchaseQuantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.PurchaseQuantity}
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
                value={formData.PurchaseUnit}
                onChange={(e) =>
                  handleInputChange("PurchaseUnit", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.PurchaseUnit
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
              {errors.PurchaseUnit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.PurchaseUnit}
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
                value={formData.UsageUnit}
                onChange={(e) => handleInputChange("UsageUnit", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.UsageUnit
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
              {errors.UsageUnit && (
                <p className="mt-1 text-sm text-red-600">{errors.UsageUnit}</p>
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
                  value={formData.PurchaseCost}
                  onChange={(e) =>
                    handleInputChange("PurchaseCost", e.target.value)
                  }
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.PurchaseCost
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.PurchaseCost && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.PurchaseCost}
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
                  value={formData.UsageCost}
                  onChange={(e) =>
                    handleInputChange("UsageCost", e.target.value)
                  }
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.UsageCost
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.UsageCost && (
                <p className="mt-1 text-sm text-red-600">{errors.UsageCost}</p>
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-950 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
