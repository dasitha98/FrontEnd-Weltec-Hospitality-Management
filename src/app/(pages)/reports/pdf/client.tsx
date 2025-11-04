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

  // Generate PDF blob when data is ready
  useEffect(() => {
    if (
      !isClient ||
      !pdfComponents ||
      !storageData ||
      isLoading ||
      isGenerating ||
      pdfBlob
    ) {
      return;
    }

        const generatePDF = async () => {
      setIsGenerating(true);
      try {
        const { Document, Page, Text, View, StyleSheet, pdf } =
          pdfComponents;

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
        link.download = `Inventory-Report-${new Date().toISOString().split("T")[0]}.pdf`;
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

    generatePDF();
  }, [isClient, pdfComponents, storageData, isLoading, isGenerating, pdfBlob]);

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
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
            Error loading report: {error ? JSON.stringify(error) : "Unknown error"}
          </div>
        )}
        {isGenerating && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Generating PDF...
          </div>
        )}
        {!isLoading && !isError && !isGenerating && pdfBlob && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2 style={{ marginBottom: "10px", color: "#10b981" }}>
              PDF Generated Successfully!
            </h2>
            <p style={{ marginBottom: "20px", color: "#6b7280" }}>
              Your PDF has been downloaded automatically.
            </p>
            <button
              onClick={() => {
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `Inventory-Report-${new Date().toISOString().split("T")[0]}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: "10px 24px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#1E3A8A",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Download PDF Again
            </button>
          </div>
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
