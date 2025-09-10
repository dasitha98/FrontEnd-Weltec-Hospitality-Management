"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaClock,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import type { Class } from "@/types/domain";
import AddClassForm from "../../components/forms/AddClassForm";

// Mock data for demonstration
const mockClasses: Class[] = [
  {
    id: "1",
    name: "Culinary Arts Fundamentals",
    noOfStudents: 24,
    location: "Kitchen Lab A",
    reference: "CLS-001",
    totalCost: 1250.0,
    description: "Introduction to basic cooking techniques and kitchen safety",
    instructor: "Chef Maria Rodriguez",
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Advanced Pastry Techniques",
    noOfStudents: 16,
    location: "Bakery Lab B",
    reference: "CLS-002",
    totalCost: 980.5,
    description: "Advanced techniques in pastry making and dessert preparation",
    instructor: "Chef James Wilson",
    startDate: "2024-02-15",
    endDate: "2024-06-15",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    name: "International Cuisine",
    noOfStudents: 20,
    location: "Main Kitchen",
    reference: "CLS-003",
    totalCost: 1100.75,
    description: "Exploring cuisines from around the world",
    instructor: "Chef Anna Chen",
    startDate: "2024-03-01",
    endDate: "2024-07-31",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
  },
  {
    id: "4",
    name: "Food Safety & Sanitation",
    noOfStudents: 30,
    location: "Lecture Hall 1",
    reference: "CLS-004",
    totalCost: 750.25,
    description: "Essential food safety practices and health regulations",
    instructor: "Dr. Sarah Thompson",
    startDate: "2024-01-20",
    endDate: "2024-04-20",
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z",
  },
  {
    id: "5",
    name: "Restaurant Management",
    noOfStudents: 18,
    location: "Conference Room 2",
    reference: "CLS-005",
    totalCost: 1350.0,
    description: "Business aspects of running a restaurant",
    instructor: "Prof. Michael Brown",
    startDate: "2024-02-10",
    endDate: "2024-06-10",
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-12T11:30:00Z",
  },
];

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (data: Omit<Class, "id">) => {
    if (editingClass) {
      // Update existing class
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === editingClass.id
            ? {
                ...data,
                id: editingClass.id,
                updatedAt: new Date().toISOString(),
              }
            : cls
        )
      );
    } else {
      // Add new class
      const newClass: Class = {
        ...data,
        id: Date.now().toString(), // Simple ID generation for demo
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setClasses((prev) => [...prev, newClass]);
    }

    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
    }
  };

  const handleClose = () => {
    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Class Management
        </h1>
        <p className="text-gray-600">
          Manage your culinary classes, track student enrollment, and organize
          class schedules and locations.
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes..."
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
          Add Class
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Class Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  No of Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((cls, index) => (
                <tr
                  key={cls.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cls.name}
                    </div>
                    {cls.instructor && (
                      <div className="text-xs text-gray-500">
                        Instructor: {cls.instructor}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-400" size={14} />
                      <span className="text-sm font-medium text-gray-900">
                        {cls.noOfStudents}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cls.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cls.reference}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${cls.totalCost.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit class"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete class"
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

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No classes found</div>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Add your first class to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Class Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AddClassForm
              onSubmit={handleSubmit}
              onCancel={handleClose}
              initialData={editingClass || undefined}
              isEditing={!!editingClass}
              submitButtonText={editingClass ? "Update Class" : "Add Class"}
              cancelButtonText="Cancel"
            />
          </div>
        </div>
      )}
    </div>
  );
}
