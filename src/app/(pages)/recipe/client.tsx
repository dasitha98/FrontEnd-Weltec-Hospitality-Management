"use client";

import {
  useDeleteRecipeMutation,
  useListRecipeQuery,
} from "@/store/api/recipes.api";
import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";
import type { Recipe } from "@/types/domain";
import AddRecipeForm from "@/app/components/forms/AddRecipeForm";

export default function RecipeClient({
  initialState,
}: {
  initialState: RootState;
}) {
  return (
    <StoreProvider initialState={initialState}>
      <RecipeList />
    </StoreProvider>
  );
}


function RecipeList() {
    const { data, isLoading } = useListRecipeQuery();
    const [deleteRecipe, { isSuccess, isError, error }] =
      useDeleteRecipeMutation();

  const [recipes, setRecipes] = useState<Recipe[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

 const handleSubmit = (data: Omit<Recipe, "recipeID">) => {
     if (editingRecipe) {
       // Update existing recipe
       setRecipes((prev: any) =>
         prev.map((recipe: any) =>
           recipe.recipeId === editingRecipe.RecipeID
             ? {
                 ...data,
                 supplierId: editingRecipe.RecipeID,
                 updatedAt: new Date().toISOString(),
               }
             : recipe
         )
       );
     } else {
       // Add new recipe
       const newRecipe: Recipe = {
         ...data,
         RecipeID: Date.now().toString() // Simple ID generation for demo
         //CreatedAt: new Date().toISOString(),
         // updatedAt: new Date().toISOString(),
       };
       setRecipes((prev: any) => [...prev, newRecipe]);
     }
 
     setEditingRecipe(null);
     setIsDialogOpen(false);
   };
 
   const handleEdit = (recipe: Recipe) => {
     setEditingRecipe(recipe);
     setIsDialogOpen(true);
   };
 
   const handleDelete = async (recipeID: string|any) => {
     await deleteRecipe(recipeID).unwrap();
 
     // if (confirm("Are you sure you want to delete this supplier?")) {
     //   setSupplier((prev: any) =>
     //     prev.filter((supplier: any) => supplier.supplierId !== supplierId)
     //   );
     // }
   };
 
   const handleClose = () => {
     setEditingRecipe(null);
     setIsDialogOpen(false);
   };
 
   const filteredRecipes = (recipes || []).filter(
     (recipe: any) =>
       recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       recipe.repName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       recipe.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
       recipe.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
       recipe.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       recipe.notes?.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   // Pagination calculations
   const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentRecipes = filteredRecipes.slice(startIndex, endIndex);
   const emptyRowsCount = Math.max(0, itemsPerPage - currentRecipes.length);
 
   const handlePageChange = (page: number) => {
     setCurrentPage(page);
   };
 
   const handleSearch = (term: string) => {
     setSearchTerm(term);
     setCurrentPage(1); // Reset to first page when searching
   };
 

  // const calculateTotalCost = (ingredients: RecipeIngredient[]) => {
  //   return ingredients.reduce((total, ingredient) => {
  //     return total + (ingredient.cost || 0);
  //   }, 0);
  // };

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
          Recipe Management
        </h1>
        <p className="text-gray-600">
          Manage your recipe collection, track cooking times, and organize
          ingredients and instructions.
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
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
          Add Recipe
        </button>
      </div>

      {/* Recipes Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-blue-600 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map((recipe, index) => (
                <tr
                  key={recipe.RecipeID}
                  className={`h-16 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {recipe.Name}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-900">
                      {recipe.Description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-900">
                      {recipe.RReference || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {/* ${calculateTotalCost(recipe.ingredients).toFixed(2)} */}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-middle">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(recipe)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit recipe"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.RecipeID)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete recipe"
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
                  className={`h-16 ${(currentRecipes.length + index) % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">
                      &nbsp;
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">
                      &nbsp;
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">
                      &nbsp;
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">
                      &nbsp;
                    </div>
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

        {currentRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No recipes found</div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first recipe to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredRecipes.length)} of {filteredRecipes.length} results
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
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

      {/* Supplier Dialog */}
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
              <AddRecipeForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                initialData={editingRecipe || undefined}
                isEditing={!!editingRecipe}
                submitButtonText={
                  editingRecipe ? "Update Recipe" : "Add Recipe"
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
