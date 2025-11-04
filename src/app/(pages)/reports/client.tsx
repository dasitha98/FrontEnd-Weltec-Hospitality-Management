"use client";

import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useListClassesQuery } from "@/store/api/classes.api";

export default function ReportClient({
  initialState,
}: {
  initialState: RootState;
}) {
  const router = useRouter();
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Fetch classes for the dropdown
  const { data: classesData, isLoading: isLoadingClasses } =
    useListClassesQuery();

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    if (classId && !selectedClassIds.includes(classId)) {
      setSelectedClassIds([...selectedClassIds, classId]);
      setSelectedClassId(""); // Reset dropdown after selection
    }
  };

  const handleRemoveClass = (classIdToRemove: string) => {
    setSelectedClassIds(
      selectedClassIds.filter((id) => id !== classIdToRemove)
    );
  };

  const getClassNameById = (classId: string) => {
    const cls = classesData?.find((c) => c.ClassId === classId);
    return cls?.Name || `Class ${classId}`;
  };

  const handleGeneratePDF = () => {
    if (selectedClassIds.length > 0) {
      // Navigate to PDF page with class IDs as query parameters
      const classIdsParam = selectedClassIds.join(",");
      router.push(`/reports/pdf?classIds=${encodeURIComponent(classIdsParam)}`);
    }
  };

  return (
    <StoreProvider initialState={initialState}>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <label
            htmlFor="classSelect"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Select Class <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            id="classSelect"
            value={selectedClassId}
            onChange={handleClassSelect}
            disabled={isLoadingClasses}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              cursor: isLoadingClasses ? "not-allowed" : "pointer",
              marginBottom: "12px",
            }}
          >
            <option value="">-- Select a class --</option>
            {isLoadingClasses ? (
              <option disabled>Loading classes...</option>
            ) : classesData && classesData.length > 0 ? (
              classesData
                .filter((cls) => !selectedClassIds.includes(cls.ClassId || ""))
                .map((cls) => (
                  <option key={cls.ClassId} value={cls.ClassId}>
                    {cls.Name || `Class ${cls.ClassId}`}
                  </option>
                ))
            ) : (
              <option disabled>No classes available</option>
            )}
          </select>

          {/* Selected Classes Display */}
          {selectedClassIds.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Selected Classes:
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {selectedClassIds.map((classId) => (
                  <div
                    key={classId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                    }}
                  >
                    <input
                      type="text"
                      value={getClassNameById(classId)}
                      readOnly
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "14px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "4px",
                        backgroundColor: "#f9fafb",
                        color: "#374151",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(classId)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        backgroundColor: "#ef4444",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#dc2626";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#ef4444";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Generate PDF Button - inside the selected classes section */}
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={handleGeneratePDF}
                  style={{
                    padding: "10px 24px",
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#1E3A8A",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e40af";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#1E3A8A";
                  }}
                >
                  Generate PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StoreProvider>
  );
}
