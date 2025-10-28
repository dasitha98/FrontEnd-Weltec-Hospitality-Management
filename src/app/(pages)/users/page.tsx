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
  FaUser,
  FaUserTag,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import type { User } from "@/types/domain";
import AddUserForm from "../../components/forms/AddUserForm";

// Mock data for demonstration
const mockUsers: User[] = [
  {
    Id: "1",
    Name: "John Smith",
    Email: "john.smith@weltec.ac.nz",
    Address: "123 Queen Street, Wellington",
    ContactNo: "+64 21 123-4567",
    Password: "hashedPassword123",
    Role: "admin",
    IsActive: true,
    CreatedAt: "2024-01-15T10:30:00Z",
    UpdatedAt: "2024-01-15T10:30:00Z",
  },
  {
    Id: "2",
    Name: "Sarah Johnson",
    Email: "sarah.johnson@weltec.ac.nz",
    Address: "456 Lambton Quay, Wellington",
    ContactNo: "+64 21 987-6543",
    Password: "hashedPassword456",
    Role: "instructor",
    IsActive: true,
    CreatedAt: "2024-01-10T14:20:00Z",
    UpdatedAt: "2024-01-10T14:20:00Z",
  },
  {
    Id: "3",
    Name: "Mike Wilson",
    Email: "mike.wilson@student.weltec.ac.nz",
    Address: "789 Willis Street, Wellington",
    ContactNo: "+64 21 456-7890",
    Password: "hashedPassword789",
    Role: "student",
    IsActive: true,
    CreatedAt: "2024-01-05T09:15:00Z",
    UpdatedAt: "2024-01-05T09:15:00Z",
  },
  {
    Id: "4",
    Name: "Lisa Brown",
    Email: "lisa.brown@student.weltec.ac.nz",
    Address: "321 Courtenay Place, Wellington",
    ContactNo: "+64 21 321-0987",
    Password: "hashedPassword321",
    Role: "student",
    IsActive: false,
    CreatedAt: "2024-01-01T08:00:00Z",
    UpdatedAt: "2024-01-01T08:00:00Z",
  },
  {
    Id: "5",
    Name: "Ahmed Hassan",
    Email: "ahmed.hassan@weltec.ac.nz",
    Address: "654 Cuba Street, Wellington",
    ContactNo: "+64 21 654-3210",
    Password: "hashedPassword654",
    Role: "instructor",
    IsActive: true,
    CreatedAt: "2024-01-12T11:30:00Z",
    UpdatedAt: "2024-01-12T11:30:00Z",
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const handleSubmit = (data: Omit<User, "Id">) => {
    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.Id === editingUser.Id
            ? {
                ...data,
                Id: editingUser.Id,
                UpdatedAt: new Date().toISOString(),
              }
            : user
        )
      );
    } else {
      // Add new user
      const newUser: User = {
        ...data,
        Id: Date.now().toString(), // Simple ID generation for demo
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.Id !== id));
    }
  };

  const handleClose = () => {
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ContactNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const emptyRowsCount = Math.max(0, itemsPerPage - currentUsers.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "instructor":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          className="overflow-x-auto hide-scrollbar"
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
                  Address
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
              {currentUsers.map((user, index) => (
                <tr
                  key={user.Id}
                  className={`h-16 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm font-medium text-gray-900">
                        {user.Name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm text-gray-900">{user.Email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaMapMarkerAlt
                        className="mr-2 text-gray-400"
                        size={14}
                      />
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {user.Address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" size={14} />
                      <div className="text-sm text-gray-900">
                        {user.ContactNo}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.Role
                      )}`}
                    >
                      <FaUserTag className="mr-1" size={10} />
                      {user.Role.charAt(0).toUpperCase() + user.Role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="flex items-center">
                      {user.IsActive ? (
                        <FaToggleOn className="text-green-500" size={16} />
                      ) : (
                        <FaToggleOff className="text-red-500" size={16} />
                      )}
                      <span
                        className={`ml-2 text-sm ${
                          user.IsActive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.IsActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.Id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
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
                    (currentUsers.length + index) % 2 === 0
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
                  <td className="px-6 py-4 whitespace-nowrap align-middle border-r border-gray-200">
                    <div className="text-sm text-gray-400">&nbsp;</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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

        {currentUsers.length === 0 && (
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
            {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
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
                initialData={editingUser || undefined}
                isEditing={!!editingUser}
                submitButtonText={editingUser ? "Update User" : "Add User"}
                cancelButtonText="Cancel"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
