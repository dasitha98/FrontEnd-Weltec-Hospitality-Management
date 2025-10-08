"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import type { ID, Supplier } from "@/types/domain";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "@/store/api/supplier.api";

interface AddSupplierFormProps {
  onSubmit: (data: Omit<Supplier, "id">) => void;
  onCancel: () => void;
  initialData?: Partial<Supplier>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface FormData {
  id: string;
  name: string;
  repName: string;
  address: string;
  contactNumber: string;
  email: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  repName?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  notes?: string;
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  submitButtonText = "Add Supplier",
  cancelButtonText = "Cancel",
}) => {
  const [
    UpdateSupplier,
    { isLoading, isSuccess: updateSuccess, isError, error },
  ] = useUpdateSupplierMutation();
  const [
    CreateSupplier,
    {
      isLoading: isCreating,
      isSuccess: createSuccess,
      isError: createError,
      error: createErrorData,
    },
  ] = useCreateSupplierMutation();

  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    repName: "",
    address: "",
    contactNumber: "",
    email: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.supplierId || "",
        name: initialData.name || "",
        repName: initialData.repName || "",
        address: initialData.address || "",
        contactNumber: initialData.contactNumber || "",
        email: initialData.email || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (!formData.repName.trim()) {
      newErrors.repName = "Sales rep name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(
        formData.contactNumber.replace(/[\s\-\(\)]/g, "")
      )
    ) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        await UpdateSupplier(formData).unwrap();
      } else {
        await CreateSupplier(formData).unwrap();
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      onCancel();
    }
  }, [updateSuccess, createSuccess]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Supplier" : "Add New Supplier"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Supplier Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter supplier name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Sales Rep Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="repName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sales Rep Name *
            </label>
            <input
              type="text"
              id="repName"
              name="repName"
              value={formData.repName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.repName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter sales rep name"
            />
            {errors.repName && (
              <p className="mt-1 text-sm text-red-600">{errors.repName}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.address ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter supplier address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contact Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.contactNumber ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter contact number"
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any additional notes about the supplier"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierForm;
