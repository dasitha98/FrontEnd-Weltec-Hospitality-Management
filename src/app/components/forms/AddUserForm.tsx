"use client";

import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaLock,
  FaUserTag,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import type { User } from "@/types/domain";

interface AddUserFormProps {
  onSubmit: (data: Omit<User, "Id">) => void;
  onCancel: () => void;
  initialData?: User;
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
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Address: "",
    ContactNo: "",
    Password: "",
    Role: "student" as "admin" | "instructor" | "student",
    IsActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        Name: initialData.Name || "",
        Email: initialData.Email || "",
        Address: initialData.Address || "",
        ContactNo: initialData.ContactNo || "",
        Password: "", // Don't pre-fill password for security
        Role: initialData.Role || "student",
        IsActive: initialData.IsActive ?? true,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    }

    if (!formData.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    if (!formData.Address.trim()) {
      newErrors.Address = "Address is required";
    }

    if (!formData.ContactNo.trim()) {
      newErrors.ContactNo = "Contact number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(
        formData.ContactNo.replace(/[\s\-\(\)]/g, "")
      )
    ) {
      newErrors.ContactNo = "Please enter a valid contact number";
    }

    if (!isEditing && !formData.Password.trim()) {
      newErrors.Password = "Password is required";
    } else if (formData.Password && formData.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        Password: formData.Password || "defaultPassword123", // For editing, use default if password not provided
      };
      onSubmit(submitData);
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

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaMapMarkerAlt className="inline mr-2" size={14} />
              Address
            </label>
            <input
              type="text"
              value={formData.Address}
              onChange={(e) => handleInputChange("Address", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.Address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full address"
            />
            {errors.Address && (
              <p className="text-red-500 text-sm">{errors.Address}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <FaPhone className="inline mr-2" size={14} />
              Contact No
            </label>
            <input
              type="tel"
              value={formData.ContactNo}
              onChange={(e) => handleInputChange("ContactNo", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ContactNo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter contact number"
            />
            {errors.ContactNo && (
              <p className="text-red-500 text-sm">{errors.ContactNo}</p>
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
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
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
                  handleInputChange("IsActive", !formData.IsActive)
                }
                className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                  formData.IsActive
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {formData.IsActive ? (
                  <FaToggleOn size={16} />
                ) : (
                  <FaToggleOff size={16} />
                )}
                <span>{formData.IsActive ? "Active" : "Inactive"}</span>
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
            className="px-6 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
