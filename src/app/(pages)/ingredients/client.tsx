"use client";

import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding } from "react-icons/fa";
import {
  useDeleteIngredientMutation,
  useListIngredientQuery,
} from "@/store/api/ingredient.api";
import AddIngredientForm from "@/app/components/forms/AddIngredientForm";
import { Ingredient } from "@/types/domain";

export default function IngredientClient({
  initialState,
}: {
  initialState: RootState;
}) {
  return (
    <StoreProvider initialState={initialState}>
      <IngredientList />
    </StoreProvider>
  );
}

function IngredientList() {
  const { data, isLoading } = useListIngredientQuery();
  const [deleteIngredient, { isSuccess, isError, error }] =
    useDeleteIngredientMutation();

  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  console.log("data", data);
  const handleSubmit = (data: Omit<Ingredient, "ingredientId">) => {
    if (editingIngredient) {
      // Update existing ingredient
      setIngredient((prev: any) =>
        prev.map((ingredient: any) =>
          ingredient.ingredientId === editingIngredient.ingredientId
            ? {
                ...data,
                supplierId: editingIngredient.ingredientId,
                updatedAt: new Date().toISOString(),
              }
            : ingredient
        )
      );
    } else {
      // Add new ingredient
      const newIngredient: Ingredient = {
        ...data,
        ingredientId: Date.now().toString(), // Simple ID generation for demo
        createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
      };
      setIngredient((prev: any) => [...prev, newIngredient]);
    }

    setEditingIngredient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsDialogOpen(true);
  };

  const handleDelete = async (ingredientId: string) => {
    await deleteIngredient(ingredientId).unwrap();

    // if (confirm("Are you sure you want to delete this ingredient?")) {
    //   setSupplier((prev: any) =>
    //     prev.filter((ingredient: any) => ingredient.ingredientId !== ingredientId)
    //   );
    // }
  };

  const handleClose = () => {
    setEditingIngredient(null);
    setIsDialogOpen(false);
  };

  const filteredIngredients = (ingredient || []).filter(
    (ingredient: any) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.ingredientId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ingredient.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.purchaseQuantity
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ingredient.purchaseUnit
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ingredient.usageUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.purchaseCost
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ingredient.usageCost.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIngredients = filteredIngredients.slice(startIndex, endIndex);
  const emptyRowsCount = Math.max(0, itemsPerPage - currentIngredients.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-14">
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ingredient Management
        </h1>
        <p className="text-gray-600">
          Manage your ingredients, track contact information, and organize
          ingredient details and notes.
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FaPlus className="mr-2" size={16} />
          Add Ingredient
        </button>
      </div>

      {/* Ingredient Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div
          className="overflow-x-auto hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-blue-600 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Ingredient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Purchase Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Purchase Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Usage Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Purchase Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Purchase Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Usage Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map((ingredient: any, index: any) => (
                <tr
                  key={index}
                  className={`h-16 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaBuilding className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm font-medium text-gray-900">
                        {ingredient.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-900">
                      {ingredient?.supplier?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {ingredient.store}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {ingredient.purchaseQuantity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {ingredient.purchaseUnit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {ingredient.usageUnit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {ingredient.purchaseCost}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {ingredient.usageCost}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {ingredient.Description || "No Description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-middle">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(ingredient)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit ingredient"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient.ingredientId)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete ingredient"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty rows to fill the table height */}
              {Array.from({ length: emptyRowsCount }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className={`h-16 ${
                    (currentIngredients.length + index) % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-middle">
                    <div className="flex space-x-2">
                      <div className="w-4 h-4">&nbsp;</div>
                      <div className="w-4 h-4">&nbsp;</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentIngredients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No ingredients found
            </div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first ingredient to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredIngredients.length)} of{" "}
            {filteredIngredients.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Ingredient Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-opacity"
            onClick={handleClose}
          />

          {/* Dialog */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <AddIngredientForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                initialData={editingIngredient || undefined}
                isEditing={!!editingIngredient}
                submitButtonText={
                  editingIngredient ? "Update Ingredient" : "Add Ingredient"
                }
                cancelButtonText="Cancel"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
