"use client";

import { useDeleteAuthMutation, useListAuthQuery } from "@/store/api/auth.api";
import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaUserTag,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import AddUserForm from "@/app/components/forms/AddUserForm";
import { Auth } from "@/types/domain";

export default function UsersClient({
  initialState,
}: {
  initialState: RootState;
}) {
  return (
    <StoreProvider initialState={initialState}>
      <UsersList />
    </StoreProvider>
  );
}

function UsersList() {
  const { data, isLoading } = useListAuthQuery();
  const [deleteAuth, { isSuccess, isError, error }] = useDeleteAuthMutation();

  const [auth, setAuth] = useState<Auth[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuth, setEditingAuth] = useState<Auth | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Ensure we always have an array
  const authData = Array.isArray(data) ? data : Array.isArray(auth) ? auth : [];

  const handleSubmit = (data: Omit<Auth, "UserId">) => {
    if (editingAuth) {
      // Update existing auth
      setAuth((prev: Auth[]) =>
        prev.map((authItem: Auth) =>
          authItem.UserId === editingAuth.UserId
            ? {
                ...data,
                UserId: editingAuth.UserId,
              }
            : authItem
        )
      );
    } else {
      // Add new auth
      const newAuth: Auth = {
        ...data,
        UserId: Date.now().toString(), // Simple ID generation for demo
        CreatedAt: new Date().toISOString(),
      };
      setAuth((prev: Auth[]) => [...prev, newAuth]);
    }

    setEditingAuth(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (auth: Auth) => {
    setEditingAuth(auth);
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    await deleteAuth(userId).unwrap();
  };

  const handleClose = () => {
    setEditingAuth(null);
    setIsDialogOpen(false);
  };

  const filteredAuth = (Array.isArray(authData) ? authData : []).filter(
    (auth: Auth) =>
      auth?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth?.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth?.ContactNumber?.toString().includes(searchTerm) ||
      auth?.Role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auth?.Status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredAuth.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAuth = filteredAuth.slice(startIndex, endIndex);
  const emptyRowsCount = Math.max(0, itemsPerPage - currentAuth.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "Tutor":
        return "bg-gray-100 text-gray-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Technician":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusIcon = (status?: string) => {
    const isActive = status?.toLowerCase() === "Active";
    return isActive ? (
      <FaToggleOn className="text-green-500" size={16} />
    ) : (
      <FaToggleOff className="text-red-500" size={16} />
    );
  };

  if (isLoading) {
    return (
      <div className="p-14">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-14">
      <style jsx>{`
        .table-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .table-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage system users, assign roles, and control access permissions.
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-950 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FaPlus className="mr-2" size={16} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div
          className={`overflow-x-auto max-h-[600px] table-scrollbar ${
            isDialogOpen ? "overflow-y-hidden" : "overflow-y-auto"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-blue-950 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Contact No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-blue-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(currentAuth) &&
                currentAuth.map((auth: Auth, index: number) => (
                  <tr
                    key={auth.UserId}
                    className={`h-16 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-gray-400" size={14} />
                        <div className="text-sm font-medium text-gray-900">
                          {auth.Name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400" size={14} />
                        <div className="text-sm text-gray-900">
                          {auth.Email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                      <div className="flex items-center">
                        <FaPhone className="mr-2 text-gray-400" size={14} />
                        <div className="text-sm text-gray-900">
                          {auth.ContactNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          auth.Role
                        )}`}
                      >
                        {auth.Role ? (
                          <>
                            <FaUserTag className="mr-1" size={10} />
                            {auth.Role.charAt(0).toUpperCase() +
                              auth.Role.slice(1)}
                          </>
                        ) : (
                          "-"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                      <div className="flex items-center">
                        {getStatusIcon(auth.Status)}
                        <span
                          className={`ml-2 text-sm ${
                            auth.Status?.toLowerCase() === "Active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {auth.Status || "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-middle">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(auth)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit user"
                        >
                          <FaEdit size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(auth.UserId!)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <FaTrash size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Empty rows to fill the table height */}
              {Array.from({ length: emptyRowsCount }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className={`h-16 ${
                    (currentAuth.length + index) % 2 === 0
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

        {currentAuth.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No users found</div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first user to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredAuth.length)} of {filteredAuth.length}{" "}
            results
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
                        ? "bg-blue-950 text-white border-blue-600"
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

      {/* User Dialog */}
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
              <AddUserForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                initialData={editingAuth || undefined}
                isEditing={!!editingAuth}
                submitButtonText={editingAuth ? "Update User" : "Add User"}
                cancelButtonText="Cancel"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
