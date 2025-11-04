"use client";

import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserTag,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import {
  useCreateAuthMutation,
  useUpdateAuthMutation,
} from "@/store/api/auth.api";
import type { Auth } from "@/types/domain";
import Cookies from "js-cookie";
import { getUserInfoFromToken } from "@/utils/jwt";

interface AddUserFormProps {
  onSubmit: (data: Omit<Auth, "UserId">) => void;
  onCancel: () => void;
  initialData?: Auth;
  isEditing?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

export default function AddUserForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  submitButtonText = "Add User",
  cancelButtonText = "Cancel",
}: AddUserFormProps) {
  const [UpdateAuth, { isLoading, isSuccess: updateSuccess, isError, error }] =
    useUpdateAuthMutation();
  const [
    CreateAuth,
    {
      isLoading: isCreating,
      isSuccess: createSuccess,
      isError: createError,
      error: createErrorData,
    },
  ] = useCreateAuthMutation();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    ContactNumber: "",
    Password: "",
    Role: "Tutor",
    Status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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
        Email: initialData.Email || "",
        ContactNumber: initialData.ContactNumber?.toString() || "",
        Password: "", // Don't pre-fill password for security
        Role: initialData.Role || "Tutor",
        Status: initialData.Status || "Active",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (updateSuccess || createSuccess) {
      onCancel();
    }
  }, [updateSuccess, createSuccess, onCancel]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.Name?.trim()) {
      newErrors.Name = "Name is required";
    }

    if (!formData.Email?.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    if (!formData.ContactNumber.trim()) {
      newErrors.ContactNumber = "Contact number is required";
    } else {
      // Allow any numbers - just check that it contains at least one digit
      const hasDigits = /\d/.test(formData.ContactNumber);
      if (!hasDigits) {
        newErrors.ContactNumber = "Please enter a valid contact number";
      }
    }

    if (!isEditing && !formData.Password.trim()) {
      newErrors.Password = "Password is required";
    } else if (formData.Password && formData.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Clean the number by removing spaces, hyphens, parentheses, and plus signs
      // Then convert to number, allowing leading zeros by using the cleaned string
      const cleanedNumber = formData.ContactNumber.replace(/[\s\-\(\)\+]/g, "");
      // Try to parse as number, but if it's a valid string with digits, use it
      const contactNumber =
        cleanedNumber.length > 0 ? parseFloat(cleanedNumber) : NaN;

      const submitData = {
        Name: formData.Name || undefined,
        Email: formData.Email || undefined,
        ContactNumber: isNaN(contactNumber) ? undefined : contactNumber,
        Password: formData.Password || undefined,
        Role: formData.Role || undefined,
        Status: formData.Status || undefined,
      };

      try {
        if (isEditing && initialData?.UserId) {
          await UpdateAuth({
            id: initialData.UserId,
            ...submitData,
          }).unwrap();
        } else {
          await CreateAuth(submitData).unwrap();
        }
      } catch (error) {
        console.error("Error saving user:", error);
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            User Registration
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update user information"
              : "Add a new user to the system"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaUser className="inline mr-2" size={14} />
              Name
            </label>
            <input
              type="text"
              value={formData.Name}
              onChange={(e) => handleInputChange("Name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors.Name && (
              <p className="text-red-500 text-sm">{errors.Name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaEnvelope className="inline mr-2" size={14} />
              Email
            </label>
            <input
              type="email"
              value={formData.Email}
              onChange={(e) => handleInputChange("Email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
            {errors.Email && (
              <p className="text-red-500 text-sm">{errors.Email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaPhone className="inline mr-2" size={14} />
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.ContactNumber}
              onChange={(e) =>
                handleInputChange("ContactNumber", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ContactNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter contact number"
            />
            {errors.ContactNumber && (
              <p className="text-red-500 text-sm">{errors.ContactNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaLock className="inline mr-2" size={14} />
              Password
            </label>
            <input
              type="password"
              value={formData.Password}
              onChange={(e) => handleInputChange("Password", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={
                isEditing
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
            />
            {errors.Password && (
              <p className="text-red-500 text-sm">{errors.Password}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaUserTag className="inline mr-2" size={14} />
              Role
            </label>
            <select
              value={formData.Role}
              onChange={(e) => handleInputChange("Role", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tutor">Tutor</option>
              <option value="Manager">Manager</option>
              <option value="Technician">Technician</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() =>
                  handleInputChange(
                    "Status",
                    formData.Status === "Active" ? "Inactive" : "Active"
                  )
                }
                className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                  formData.Status === "Active"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {formData.Status === "Active" ? (
                  <FaToggleOn size={16} />
                ) : (
                  <FaToggleOff size={16} />
                )}
                <span>
                  {formData.Status === "Active" ? "Active" : "Inactive"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            type="submit"
            disabled={isLoading || isCreating || isTutorRole}
            className="px-6 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isCreating ? "Saving..." : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
