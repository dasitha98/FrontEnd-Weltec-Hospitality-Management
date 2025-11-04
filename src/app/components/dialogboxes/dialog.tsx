"use client";

import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import AddIngredientForm from "../forms/AddIngredientForm";
import AddRecipeForm from "../forms/AddRecipeForm";
import type { Ingredient, Recipe } from "@/types/domain";

// Base Dialog Component
interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeOnBackdropClick?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
};

function BaseDialog({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdropClick = true,
}: BaseDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto hide-scrollbar">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-lg transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Ingredient Dialog Component
interface IngredientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Ingredient, "id">) => void;
  initialData?: Partial<Ingredient>;
  isEditing?: boolean;
}

// Ingredient Dialog Component
export function IngredientDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: IngredientDialogProps) {
  const handleSubmit = (data: Omit<Ingredient, "id">) => {
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Ingredient" : "Add New Ingredient"}
      size="2xl"
      closeOnBackdropClick={false}
    >
      <AddIngredientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={initialData}
        isEditing={isEditing}
        submitButtonText={isEditing ? "Update Ingredient" : "Add Ingredient"}
        cancelButtonText="Cancel"
      />
    </BaseDialog>
  );
}

// Recipe Dialog Component
interface RecipeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Recipe, "id">) => void;
  initialData?: Partial<Recipe>;
  isEditing?: boolean;
}

export function RecipeDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}: RecipeDialogProps) {
  const handleSubmit = (data: Omit<Recipe, "id">) => {
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Recipe" : "Add New Recipe"}
      size="2xl"
      closeOnBackdropClick={false}
    >
      <AddRecipeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialRecipeData={initialData}
        isEditing={isEditing}
        submitButtonText={isEditing ? "Update Recipe" : "Add Recipe"}
        cancelButtonText="Cancel"
      />
    </BaseDialog>
  );
}

// Default export for backward compatibility
export default IngredientDialog;
