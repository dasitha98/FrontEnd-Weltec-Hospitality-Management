"use client";

import { useListSupplierQuery } from "@/store/api/supplier.api";
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
import { Supplier } from "@/types/domain";
import AddSupplierForm from "@/app/components/forms/AddSupplierForm";

export default function SupplierClient({
  initialState,
}: {
  initialState: RootState;
}) {
  return (
    <StoreProvider initialState={initialState}>
      <SupplierList />
    </StoreProvider>
  );
}

function SupplierList() {
  const { data, isLoading } = useListSupplierQuery();
  // Print the data to the console once it is successfully fetched
  useEffect(() => {
    console.log("Suppliers1 Data:", data); // This will print the suppliers to the console
  }, []);

  if (isLoading) return <p>Loading…</p>;

  const [supplier, setSupplier] = useState<Supplier[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Print the data to the console once it is successfully fetched
  useEffect(() => {
    console.log("Suppliers2 Data:", supplier); // This will print the suppliers to the console
    setSupplier(data);
  }, [data]);

  const handleSubmit = (data: Omit<Supplier, "supplierId">) => {
    if (editingSupplier) {
      // Update existing supplier
      setSupplier((prev: any) =>
        prev.map((supplier: any) =>
          supplier.supplierId === editingSupplier.supplierId
            ? {
                ...data,
                supplierId: editingSupplier.supplierId,
                updatedAt: new Date().toISOString(),
              }
            : supplier
        )
      );
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        ...data,
        supplierId: Date.now().toString(), // Simple ID generation for demo
        createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
      };
      setSupplier((prev: any) => [...prev, newSupplier]);
    }

    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = (supplierId: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSupplier((prev: any) =>
        prev.filter((supplier: any) => supplier.supplierId !== supplierId)
      );
    }
  };

  const handleClose = () => {
    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  const filteredSuppliers = (supplier || []).filter(
    (supplier: any) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.repName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);
  const emptyRowsCount = Math.max(0, itemsPerPage - currentSuppliers.length);

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
          Supplier Management
        </h1>
        <p className="text-gray-600">
          Manage your suppliers, track contact information, and organize
          supplier details and notes.
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
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
          Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div
          className="overflow-x-auto hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-blue-600 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Supplier Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSuppliers.map((supplier: any, index: any) => (
                <tr
                  key={supplier.id}
                  className={`h-16 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaBuilding className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm font-medium text-gray-900">
                        {supplier.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-900">
                      {supplier.salesRepName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaMapMarkerAlt
                        className="mr-2 text-gray-400"
                        size={14}
                      />
                      <div className="text-sm text-gray-900">
                        {supplier.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm text-gray-900">
                        {supplier.contactNo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm text-gray-900">
                        {supplier.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {supplier.notes || "No notes"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-middle">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit supplier"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete supplier"
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
                    (currentSuppliers.length + index) % 2 === 0
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

        {currentSuppliers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No suppliers found</div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first supplier to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredSuppliers.length)} of{" "}
            {filteredSuppliers.length} results
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
              <AddSupplierForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                initialData={editingSupplier || undefined}
                isEditing={!!editingSupplier}
                submitButtonText={
                  editingSupplier ? "Update Supplier" : "Add Supplier"
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
