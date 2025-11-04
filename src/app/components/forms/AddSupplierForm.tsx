"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "@/store/api/supplier.api";
import { Supplier } from "@/types/domain";
import Cookies from "js-cookie";
import { getUserInfoFromToken } from "@/utils/jwt";

interface AddSupplierFormProps {
  onSubmit: (data: Omit<Supplier, "SupplierId">) => void;
  onCancel: () => void;
  initialData?: Partial<Supplier>;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

interface FormData {
  Name: string;
  RepName: string;
  Address: string;
  ContactNumber: string;
  Email: string;
  Notes: string;
}

interface FormErrors {
  Name?: string;
  RepName?: string;
  Address?: string;
  ContactNumber?: string;
  Email?: string;
  Notes?: string;
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
    Name: "",
    RepName: "",
    Address: "",
    ContactNumber: "",
    Email: "",
    Notes: "",
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || "",
        RepName: initialData.RepName || "",
        Address: initialData.Address || "",
        ContactNumber: initialData.ContactNumber || "",
        Email: initialData.Email || "",
        Notes: initialData.Notes || "",
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "Supplier name is required";
    }

    if (!formData.RepName.trim()) {
      newErrors.RepName = "Sales rep name is required";
    }

    if (!formData.Address.trim()) {
      newErrors.Address = "Address is required";
    }

    if (!formData.ContactNumber.trim()) {
      newErrors.ContactNumber = "Contact number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(
        formData.ContactNumber.replace(/[\s\-\(\)]/g, "")
      )
    ) {
      newErrors.ContactNumber = "Please enter a valid contact number";
    }

    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing && initialData?.SupplierId) {
        await UpdateSupplier({
          id: initialData.SupplierId,
          ...formData,
        }).unwrap();
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
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.Name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter supplier name"
            />
            {errors.Name && (
              <p className="mt-1 text-sm text-red-600">{errors.Name}</p>
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
              id="RepName"
              name="RepName"
              value={formData.RepName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.RepName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter sales rep name"
            />
            {errors.RepName && (
              <p className="mt-1 text-sm text-red-600">{errors.RepName}</p>
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
              id="Address"
              name="Address"
              value={formData.Address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.Address ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter supplier address"
            />
            {errors.Address && (
              <p className="mt-1 text-sm text-red-600">{errors.Address}</p>
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
              id="ContactNumber"
              name="ContactNumber"
              value={formData.ContactNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.ContactNumber ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter contact number"
            />
            {errors.ContactNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ContactNumber}
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
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.Email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
            {errors.Email && (
              <p className="mt-1 text-sm text-red-600">{errors.Email}</p>
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label
              htmlFor="Notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes
            </label>
            <textarea
              id="Notes"
              name="Notes"
              value={formData.Notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any additional Notes about the supplier"
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
            disabled={isTutorRole}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-950 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierForm;
