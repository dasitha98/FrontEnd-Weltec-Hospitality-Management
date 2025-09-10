"use client";

import React, { useState } from "react";
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
import type { Supplier } from "@/types/domain";
import AddSupplierForm from "../../components/forms/AddSupplierForm";

// Mock data for demonstration
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Fresh Produce Co.",
    salesRepName: "John Smith",
    address: "123 Market Street, Downtown",
    contactNo: "+1 (555) 123-4567",
    email: "orders@freshproduce.com",
    notes: "Specializes in organic vegetables and fruits",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Quality Meats Ltd.",
    salesRepName: "Sarah Johnson",
    address: "456 Industrial Blvd, North Side",
    contactNo: "+1 (555) 987-6543",
    email: "supply@qualitymeats.com",
    notes: "Premium cuts, next-day delivery available",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "Ocean Fresh Seafood",
    salesRepName: "Mike Wilson",
    address: "789 Harbor View, Port District",
    contactNo: "+1 (555) 456-7890",
    email: "info@oceanfresh.com",
    notes: "Daily fresh catch, sustainable sourcing",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
  },
  {
    id: "4",
    name: "Dairy Direct",
    salesRepName: "Lisa Brown",
    address: "321 Farm Road, Rural Area",
    contactNo: "+1 (555) 321-0987",
    email: "contact@dairydirect.com",
    notes: "Local dairy products, farm-to-table",
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "5",
    name: "Spice World Imports",
    salesRepName: "Ahmed Hassan",
    address: "654 Trade Center, Business District",
    contactNo: "+1 (555) 654-3210",
    email: "sales@spiceworld.com",
    notes: "Exotic spices and seasonings from around the world",
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-12T11:30:00Z",
  },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (data: Omit<Supplier, "id">) => {
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...data,
                id: editingSupplier.id,
                updatedAt: new Date().toISOString(),
              }
            : supplier
        )
      );
    } else {
      // Add new supplier
      const newSupplier: Supplier = {
        ...data,
        id: Date.now().toString(), // Simple ID generation for demo
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }

    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
    }
  };

  const handleClose = () => {
    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.salesRepName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-15">
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Supplier Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier, index) => (
                <tr
                  key={supplier.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBuilding className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm font-medium text-gray-900">
                        {supplier.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.salesRepName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm text-gray-900">
                        {supplier.contactNo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm text-gray-900">
                        {supplier.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {supplier.notes || "No notes"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
            </tbody>
          </table>
        </div>

        {filteredSuppliers.length === 0 && (
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

      {/* Supplier Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
      )}
    </div>
  );
}
