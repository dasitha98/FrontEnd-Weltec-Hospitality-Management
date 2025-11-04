"use client";

import StoreProvider from "@/store/providers";
import type { RootState } from "@/store";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useListReportQuery,
  type StorageData,
  type IngredientData,
} from "@/store/api/Report.api";
import { useListClassesQuery } from "@/store/api/classes.api";

export default function PDFClient({
  initialState,
}: {
  initialState: RootState;
}) {
  const searchParams = useSearchParams();
  const classIdsParam = searchParams.get("classIds");
  const classIds = classIdsParam ? classIdsParam.split(",") : [];

  const [pdfComponents, setPdfComponents] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch classes data to get class names
  const { data: classesData } = useListClassesQuery();

  // Fetch report data
  const {
    data: storageData,
    isLoading,
    isError,
    error,
  } = useListReportQuery(
    { ClassIds: classIds },
    {
      skip: classIds.length === 0,
    }
  );

  // Get class names from classIds
  const getClassNames = () => {
    if (!classesData || classIds.length === 0) return [];
    return classIds
      .map((id) => {
        const cls = classesData.find((c) => c.ClassId === id);
        return cls?.Name || `Class ${id}`;
      })
      .filter(Boolean);
  };

  const classNames = getClassNames();

  // Ensure we're on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Dynamically import PDF components to skip SSR
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      import("@react-pdf/renderer")
        .then((pdf) => {
          setPdfComponents({
            Document: pdf.Document,
            Page: pdf.Page,
            Text: pdf.Text,
            View: pdf.View,
            StyleSheet: pdf.StyleSheet,
            pdf: pdf.pdf, // This is the browser API for generating PDF blobs
          });
        })
        .catch((error) => {
          console.error("Error loading PDF components:", error);
        });
    }
  }, [isClient]);

  const generatePDF = async () => {
    if (!pdfComponents || !storageData) return;

    setIsGenerating(true);
    try {
      const { Document, Page, Text, View, StyleSheet, pdf } = pdfComponents;

      // Get class names for PDF
      const pdfClassNames = classIds
        .map((id) => {
          const cls = classesData?.find((c) => c.ClassId === id);
          return cls?.Name || `Class ${id}`;
        })
        .filter(Boolean);

      const styles = StyleSheet.create({
        page: {
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          padding: 20,
          fontSize: 10,
        },
        title: {
          fontSize: 24,
          marginBottom: 20,
          fontWeight: "bold",
          textAlign: "center",
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 15,
          marginBottom: 10,
          color: "#1E3A8A",
        },
        table: {
          display: "flex",
          flexDirection: "column",
          borderWidth: 1,
          borderColor: "#C9C9C9",
          marginBottom: 20,
        },
        tableRow: {
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#C8C8C8",
          minHeight: 35,
        },
        tableHeader: {
          backgroundColor: "#1E3A8A",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#4A90E2",
        },
        tableHeaderCell: {
          flex: 1,
          padding: 8,
          borderRightWidth: 1,
          borderRightColor: "#4A90E2",
          alignItems: "flex-start",
          justifyContent: "center",
        },
        tableHeaderText: {
          color: "#FFFFFF",
          fontSize: 9,
          fontWeight: "bold",
          textTransform: "uppercase",
        },
        tableCell: {
          flex: 1,
          padding: 8,
          borderRightWidth: 1,
          borderRightColor: "#C8C8C8",
          justifyContent: "center",
        },
        tableCellText: {
          fontSize: 9,
          color: "#1F2937",
        },
        tableRowEven: {
          backgroundColor: "#F9FAFB",
        },
        tableRowOdd: {
          backgroundColor: "#FFFFFF",
        },
        emptyMessage: {
          padding: 20,
          textAlign: "center",
          fontSize: 12,
          color: "#6B7280",
        },
      });

      const renderStorageTable = (
        storageType: keyof StorageData,
        ingredients: IngredientData[] | undefined
      ) => {
        if (!ingredients || ingredients.length === 0) {
          return (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>{storageType}</Text>
              <View style={styles.emptyMessage}>
                <Text>No ingredients available</Text>
              </View>
            </View>
          );
        }

        return (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>{storageType}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCell, { flex: 1.5 }]}>
                  <Text style={styles.tableHeaderText}>Ingredient Name</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Quantity</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Unit</Text>
                </View>
                <View style={[styles.tableHeaderCell, { borderRightWidth: 0 }]}>
                  <Text style={styles.tableHeaderText}>Cost</Text>
                </View>
              </View>
              {ingredients.map((ingredient, index) => (
                <View
                  key={`${storageType}-${index}`}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  ]}
                >
                  <View style={[styles.tableCell, { flex: 1.5 }]}>
                    <Text style={styles.tableCellText}>
                      {ingredient.IngredientName || "-"}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>
                      {ingredient.Quantity?.toFixed(2) || "-"}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>
                      {ingredient.Unit || "-"}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { borderRightWidth: 0 }]}>
                    <Text style={styles.tableCellText}>
                      ${ingredient.Cost?.toFixed(2) || "-"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      };

      const pdfDoc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Inventory Report by Storage Type</Text>
            {pdfClassNames.length > 0 && (
              <View style={{ marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    marginBottom: 5,
                    color: "#374151",
                  }}
                >
                  Classes:
                </Text>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>
                  {pdfClassNames.join(", ")}
                </Text>
              </View>
            )}
            {renderStorageTable("Dry Storage", storageData["Dry Storage"])}
            {renderStorageTable("Chill Storage", storageData["Chill Storage"])}
            {renderStorageTable("Oven Storage", storageData["Oven Storage"])}
          </Page>
        </Document>
      );

      // Generate blob using browser API
      const blob = await pdf(pdfDoc).toBlob();
      setPdfBlob(blob);

      // Auto-download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Inventory-Report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to render table for display
  const renderTable = (
    storageType: keyof StorageData,
    ingredients: IngredientData[] | undefined
  ) => {
    if (!ingredients || ingredients.length === 0) {
      return (
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#1E3A8A",
            }}
          >
            {storageType}
          </h3>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#6B7280",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          >
            No ingredients available
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#1E3A8A",
          }}
        >
          {storageType}
        </h3>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#1E3A8A", color: "#ffffff" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRight: "1px solid #4A90E2",
                  }}
                >
                  Ingredient Name
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRight: "1px solid #4A90E2",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRight: "1px solid #4A90E2",
                  }}
                >
                  Unit
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr
                  key={`${storageType}-${index}`}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#F9FAFB" : "#FFFFFF",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#1F2937",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {ingredient.IngredientName || "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#1F2937",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {ingredient.Quantity?.toFixed(2) || "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#1F2937",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {ingredient.Unit || "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#1F2937",
                    }}
                  >
                    ${ingredient.Cost?.toFixed(2) || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Don't render anything PDF-related until we're definitely on the client
  if (typeof window === "undefined") {
    return null;
  }

  if (!isClient) {
    return (
      <StoreProvider initialState={initialState}>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Loading PDF viewer...</div>
        </div>
      </StoreProvider>
    );
  }

  if (classIds.length === 0) {
    return (
      <StoreProvider initialState={initialState}>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2 style={{ marginBottom: "10px" }}>No Classes Selected</h2>
            <p>Please select classes from the reports page.</p>
          </div>
        </div>
      </StoreProvider>
    );
  }

  return (
    <StoreProvider initialState={initialState}>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1F2937",
            }}
          >
            Inventory Report by Storage Type
          </h1>
          {classNames.length > 0 && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1E3A8A",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#1E3A8A" }}
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Classes:
                </span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {classNames.map((name, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 12px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1E3A8A",
                        backgroundColor: "#EFF6FF",
                        border: "1px solid #DBEAFE",
                        borderRadius: "20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Loading report data...
          </div>
        )}

        {isError && (
          <div style={{ padding: "20px", color: "red" }}>
            Error loading report:{" "}
            {error ? JSON.stringify(error) : "Unknown error"}
          </div>
        )}

        {!isLoading && !isError && storageData && (
          <>
            {renderTable("Dry Storage", storageData["Dry Storage"])}
            {renderTable("Chill Storage", storageData["Chill Storage"])}
            {renderTable("Oven Storage", storageData["Oven Storage"])}

            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <button
                onClick={generatePDF}
                disabled={isGenerating || !pdfComponents}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor:
                    isGenerating || !pdfComponents ? "#9CA3AF" : "#1E3A8A",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    isGenerating || !pdfComponents ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!isGenerating && pdfComponents) {
                    e.currentTarget.style.backgroundColor = "#1e40af";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isGenerating && pdfComponents) {
                    e.currentTarget.style.backgroundColor = "#1E3A8A";
                  }
                }}
              >
                {isGenerating ? "Generating PDF..." : "Generate PDF"}
              </button>

              {pdfBlob && (
                <button
                  onClick={() => {
                    const url = URL.createObjectURL(pdfBlob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `Inventory-Report-${
                      new Date().toISOString().split("T")[0]
                    }.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                  }}
                >
                  Download PDF Again
                </button>
              )}
            </div>
          </>
        )}

        {!isLoading && !isError && !storageData && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No data available for selected classes
          </div>
        )}
      </div>
    </StoreProvider>
  );
}
