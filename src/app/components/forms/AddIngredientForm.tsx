"use client";

import {
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
} from "@/store/api/ingredient.api";
import { useListSupplierQuery } from "@/store/api/supplier.api";
import { Ingredient } from "@/types/domain";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";
import { getUserInfoFromToken } from "@/utils/jwt";
import {
  convert,
  isWeightUnit,
  isVolumeUnit,
  getUnitType,
} from "@/utils/unitConverter";

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
  PurchaseQuantity: number | string;
  PurchaseUnit: string;
  UsageUnit: string;
  PurchaseCost: number | string;
  UsageCost: number | string;
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
  { value: "Dry Storage", label: "Dry Storage" },
  { value: "Chill Storage", label: "Chill Storage" },
  { value: "Frozen Storage", label: "Frozen Storage" },
];

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "g", label: "Grams (g)" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (ml)" },
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
    PurchaseQuantity: "",
    PurchaseUnit: "",
    UsageUnit: "",
    PurchaseCost: "",
    UsageCost: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isTutorRole, setIsTutorRole] = useState(false);

  useEffect(() => {
    // Check user role from accessToken
    const token = Cookies.get("accessToken");
    if (token) {
      const userInfo = getUserInfoFromToken(token);
      setIsTutorRole(userInfo?.role === "Tutor");
    }
  }, []);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || "",
        Description: initialData.Description || "",
        SupplierId: initialData.SupplierId || "",
        Store: initialData.Store || "",
        PurchaseQuantity: initialData.PurchaseQuantity ?? "",
        PurchaseUnit: initialData.PurchaseUnit || "",
        UsageUnit: initialData.UsageUnit || "",
        PurchaseCost:
          initialData.PurchaseCost !== undefined &&
          initialData.PurchaseCost !== null
            ? Number(initialData.PurchaseCost).toFixed(3)
            : "",
        UsageCost:
          initialData.UsageCost !== undefined && initialData.UsageCost !== null
            ? Number(initialData.UsageCost).toFixed(3)
            : "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      onCancel();
    }
  }, [updateSuccess, createSuccess]);

  // Auto-update Usage Unit when Purchase Unit changes to ensure same unit type
  useEffect(() => {
    const purchaseUnit = formData.PurchaseUnit;
    const usageUnit = formData.UsageUnit;

    if (purchaseUnit) {
      // Normalize "liters" to "L" for type checking
      const normalizedPurchaseUnit =
        purchaseUnit === "liters" ? "L" : purchaseUnit;
      const normalizedUsageUnit = usageUnit === "liters" ? "L" : usageUnit;

      // Get unit types
      const purchaseUnitType = getUnitType(normalizedPurchaseUnit);
      const usageUnitType = getUnitType(normalizedUsageUnit);

      // If Usage Unit is set but different type, reset it
      if (
        usageUnit &&
        purchaseUnitType !== "unknown" &&
        usageUnitType !== "unknown"
      ) {
        if (purchaseUnitType !== usageUnitType) {
          // Reset Usage Unit and Usage Cost when types don't match
          setFormData((prev) => ({
            ...prev,
            UsageUnit: "",
            UsageCost: "",
          }));
        }
      }
    }
  }, [formData.PurchaseUnit]);

  // Auto-calculate Usage Cost when Purchase Cost, Purchase Quantity, Purchase Unit, or Usage Unit changes
  useEffect(() => {
    const purchaseCost = Number(formData.PurchaseCost);
    const purchaseQuantity = Number(formData.PurchaseQuantity);
    const purchaseUnit = formData.PurchaseUnit;
    const usageUnit = formData.UsageUnit;

    // Normalize "liters" to "L" for type checking and conversion
    const normalizedPurchaseUnit =
      purchaseUnit === "liters" ? "L" : purchaseUnit;
    const normalizedUsageUnit = usageUnit === "liters" ? "L" : usageUnit;

    // Only calculate if all required fields are valid
    if (
      purchaseCost > 0 &&
      purchaseQuantity > 0 &&
      purchaseUnit &&
      usageUnit &&
      (isWeightUnit(normalizedPurchaseUnit) ||
        isVolumeUnit(normalizedPurchaseUnit)) &&
      (isWeightUnit(normalizedUsageUnit) || isVolumeUnit(normalizedUsageUnit))
    ) {
      try {
        // Calculate cost per purchase unit
        const costPerPurchaseUnit = purchaseCost / purchaseQuantity;

        // Convert 1 purchase unit to usage unit to get the conversion factor
        const onePurchaseUnitInUsageUnit = convert(
          1,
          normalizedPurchaseUnit as "kg" | "g" | "L" | "ml",
          normalizedUsageUnit as "kg" | "g" | "L" | "ml"
        );

        // Calculate usage cost: cost per purchase unit divided by how many usage units are in 1 purchase unit
        const usageCost =
          costPerPurchaseUnit / onePurchaseUnitInUsageUnit.value;

        // Update Usage Cost (round to 3 decimal places)
        setFormData((prev) => ({
          ...prev,
          UsageCost: usageCost.toFixed(3),
        }));

        // Clear any existing Usage Cost error
        setErrors((prev) => ({
          ...prev,
          UsageCost: undefined,
        }));
      } catch (error) {
        // If conversion fails (e.g., different unit types), don't update Usage Cost
        // User will need to manually enter it or fix the units
        console.error("Error calculating usage cost:", error);
      }
    }
  }, [
    formData.PurchaseCost,
    formData.PurchaseQuantity,
    formData.PurchaseUnit,
    formData.UsageUnit,
  ]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Handle numeric fields - store as number but validate
    const numericFields: (keyof FormData)[] = [
      "PurchaseQuantity",
      "PurchaseCost",
      "UsageCost",
    ];

    let processedValue: string | number = value;

    // Clear error for cost fields when user starts typing (validation happens on submit)
    if (field === "PurchaseCost" || field === "UsageCost") {
      // Don't validate in real-time, only clear existing errors
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
      // Keep cost fields as string while typing for better UX
      processedValue = value;
    } else {
      // Clear error for other fields when user starts typing
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      if (field === "PurchaseQuantity") {
        // Allow empty string for better UX while typing
        if (value === "" || value === undefined || value === null) {
          processedValue = "";
        } else {
          const numValue = parseFloat(value);
          processedValue = isNaN(numValue) ? "" : numValue;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
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

    if (!formData.PurchaseQuantity || formData.PurchaseQuantity === "") {
      newErrors.PurchaseQuantity = "Purchase Qty is required";
    } else {
      const Quantity = Number(formData.PurchaseQuantity);
      if (isNaN(Quantity) || Quantity <= 0) {
        newErrors.PurchaseQuantity = "Purchase Qty must be a positive number";
      }
    }

    if (!formData.PurchaseUnit) {
      newErrors.PurchaseUnit = "Purchase Unit is required";
    }

    if (!formData.UsageUnit) {
      newErrors.UsageUnit = "Cost per Unit is required";
    } else if (formData.PurchaseUnit) {
      // Validate that Usage Unit is the same type as Purchase Unit
      const normalizedPurchaseUnit =
        formData.PurchaseUnit === "liters" ? "L" : formData.PurchaseUnit;
      const normalizedUsageUnit =
        formData.UsageUnit === "liters" ? "L" : formData.UsageUnit;

      const purchaseUnitType = getUnitType(normalizedPurchaseUnit);
      const usageUnitType = getUnitType(normalizedUsageUnit);

      if (
        purchaseUnitType !== "unknown" &&
        usageUnitType !== "unknown" &&
        purchaseUnitType !== usageUnitType
      ) {
        newErrors.UsageUnit = `Cost per Unit must be the same type as Purchase Unit (${purchaseUnitType})`;
      }
    }

    // Cost field validations
    if (
      formData.PurchaseCost === undefined ||
      formData.PurchaseCost === null ||
      formData.PurchaseCost === ""
    ) {
      newErrors.PurchaseCost = "Purchase Cost is required";
    } else {
      const purchaseCost = Number(formData.PurchaseCost);
      if (isNaN(purchaseCost) || purchaseCost <= 0) {
        newErrors.PurchaseCost = "Purchase Cost must be a positive number";
      }
    }

    if (
      formData.UsageCost === undefined ||
      formData.UsageCost === null ||
      formData.UsageCost === ""
    ) {
      newErrors.UsageCost = "Usage Cost is required";
    } else {
      const usageCost = Number(formData.UsageCost);
      if (isNaN(usageCost) || usageCost <= 0) {
        newErrors.UsageCost = "Usage Cost must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert string values to numbers for submission
      const submitData = {
        ...formData,
        PurchaseQuantity: Number(formData.PurchaseQuantity) || 0,
        PurchaseCost: Number(formData.PurchaseCost) || 0,
        UsageCost: Number(formData.UsageCost) || 0,
      };
      if (isEditing && initialData?.IngredientId) {
        await UpdateIngredient({
          id: initialData.IngredientId,
          ...submitData,
        }).unwrap();
      } else {
        await CreateIngredient(submitData).unwrap();
      }
    }
  };

  const handleReset = () => {
    setFormData({
      Name: "",
      Description: "",
      SupplierId: "",
      Store: "",
      PurchaseQuantity: "",
      PurchaseUnit: "",
      UsageUnit: "",
      PurchaseCost: "",
      UsageCost: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  // Get available units for Usage Unit based on Purchase Unit type
  const getAvailableUsageUnits = () => {
    const purchaseUnit = formData.PurchaseUnit;
    if (!purchaseUnit) {
      return UNIT_OPTIONS;
    }

    // Normalize "liters" to "L" for type checking
    const normalizedPurchaseUnit =
      purchaseUnit === "liters" ? "L" : purchaseUnit;
    const unitType = getUnitType(normalizedPurchaseUnit);

    if (unitType === "weight") {
      // Return only weight units
      return UNIT_OPTIONS.filter((option) => {
        const normalized = option.value === "liters" ? "L" : option.value;
        return isWeightUnit(normalized);
      });
    } else if (unitType === "volume") {
      // Return only volume units
      return UNIT_OPTIONS.filter((option) => {
        const normalized = option.value === "liters" ? "L" : option.value;
        return isVolumeUnit(normalized);
      });
    }

    // If unit type is unknown, return all options
    return UNIT_OPTIONS;
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

        {/* Purchase Qty, Purchase Unit, Cost per UnitRow */}
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
                value={
                  formData.PurchaseQuantity === ""
                    ? ""
                    : formData.PurchaseQuantity
                }
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
                Usage Unit<span className="text-red-500">*</span>
              </label>
              <select
                id="usageUnit"
                value={formData.UsageUnit}
                onChange={(e) => handleInputChange("UsageUnit", e.target.value)}
                disabled={!formData.PurchaseUnit}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.UsageUnit
                    ? "border-red-500 bg-red-50"
                    : formData.PurchaseUnit
                    ? "border-gray-300 hover:border-gray-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                title={
                  !formData.PurchaseUnit
                    ? "Please select Purchase Unit first"
                    : "Cost Per Unit must be the same type as Purchase Unit"
                }
              >
                <option value="">
                  {formData.PurchaseUnit
                    ? "Select Unit"
                    : "Select Purchase Unit first"}
                </option>
                {getAvailableUsageUnits().map((option) => (
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
                Purchase Cost <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">$</span>
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    &nbsp;
                  </span>
                </div>
                <input
                  id="purchaseCost"
                  type="number"
                  step="0.001"
                  min="0"
                  value={
                    formData.PurchaseCost === ""
                      ? ""
                      : typeof formData.PurchaseCost === "number"
                      ? formData.PurchaseCost.toFixed(3)
                      : String(formData.PurchaseCost)
                  }
                  onChange={(e) =>
                    handleInputChange("PurchaseCost", e.target.value)
                  }
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      handleInputChange("PurchaseCost", "");
                    } else if (!isNaN(parseFloat(value))) {
                      const numValue = parseFloat(value);
                      handleInputChange("PurchaseCost", numValue.toFixed(3));
                    }
                  }}
                  placeholder="0.000"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
                Usage Cost <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">$</span>
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    &nbsp;
                  </span>
                </div>
                <input
                  id="usageCost"
                  type="number"
                  step="0.001"
                  min="0"
                  value={
                    formData.UsageCost === ""
                      ? ""
                      : typeof formData.UsageCost === "number"
                      ? formData.UsageCost.toFixed(3)
                      : String(formData.UsageCost)
                  }
                  onChange={(e) =>
                    handleInputChange("UsageCost", e.target.value)
                  }
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      handleInputChange("UsageCost", "");
                    } else if (!isNaN(parseFloat(value))) {
                      const numValue = parseFloat(value);
                      handleInputChange("UsageCost", numValue.toFixed(3));
                    }
                  }}
                  placeholder="0.000"
                  readOnly
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 cursor-not-allowed ${
                    errors.UsageCost
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  title="Usage Cost is automatically calculated based on Purchase Cost, Purchase Quantity, and unit conversion"
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
            disabled={isTutorRole}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-950 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
