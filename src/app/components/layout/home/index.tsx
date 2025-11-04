"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { useListClassesQuery } from "@/store/api/classes.api";
import { useListRecipeQuery } from "@/store/api/recipes.api";
import { useListReportQuery } from "@/store/api/Report.api";
import "./index.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function HomePage() {
  // Fetch data from APIs
  const { data: classesData, isLoading: isLoadingClasses } =
    useListClassesQuery();
  const { data: recipesData, isLoading: isLoadingRecipes } =
    useListRecipeQuery();

  // Get all class IDs for report
  const allClassIds = useMemo(() => {
    return classesData?.map((cls) => cls.ClassId || "").filter(Boolean) || [];
  }, [classesData]);

  const { data: reportData, isLoading: isLoadingReport } = useListReportQuery(
    { ClassIds: allClassIds },
    { skip: allClassIds.length === 0 }
  );

  // Calculate classes cost data for pie chart
  const classesCostData = useMemo(() => {
    if (!classesData) return [];

    return classesData
      .map((cls) => {
        const totalCost =
          cls.RecipeList?.reduce((sum, recipe) => {
            return sum + (recipe.TotalCost || 0);
          }, 0) || 0;

        return {
          name: cls.Name || `Class ${cls.ClassId}`,
          value: totalCost,
        };
      })
      .filter((item) => item.value > 0);
  }, [classesData]);

  // Calculate recipe cost data for bar chart
  const recipeCostData = useMemo(() => {
    if (!recipesData) return [];

    return recipesData
      .map((recipe) => ({
        name: recipe.Name || `Recipe ${recipe.RecipeId}`,
        cost: recipe.TotalCost || 0,
      }))
      .filter((item) => item.cost > 0)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10); // Top 10 recipes
  }, [recipesData]);

  // Calculate storage cost data for line chart
  const storageCostData = useMemo(() => {
    if (!reportData) return [];

    const storageTypes = Object.keys(reportData);
    return storageTypes.map((storageType) => {
      const ingredients =
        reportData[storageType as keyof typeof reportData] || [];
      const totalCost = ingredients.reduce(
        (sum, ing) => sum + (ing.Cost || 0),
        0
      );

      return {
        name: storageType,
        cost: totalCost,
      };
    });
  }, [reportData]);

  // Calculate cumulative cost data for area chart
  const cumulativeCostData = useMemo(() => {
    if (!classesData) return [];

    let cumulative = 0;
    return classesData
      .map((cls) => {
        const classCost =
          cls.RecipeList?.reduce((sum, recipe) => {
            return sum + (recipe.TotalCost || 0);
          }, 0) || 0;
        cumulative += classCost;

        return {
          name: cls.Name || `Class ${cls.ClassId}`,
          cost: classCost,
          cumulative: cumulative,
        };
      })
      .filter((item) => item.cost > 0);
  }, [classesData]);

  const isLoading = isLoadingClasses || isLoadingRecipes || isLoadingReport;

  if (isLoading) {
    return (
      <div className="main-div">
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Layer 1: Top Row - Pie Chart and Bar Graph */}
      <div className="dashboard-layer layer-1">
        <div className="chart-card">
          <h2 className="chart-title">Classes Cost Distribution</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={classesCostData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(Number(percent) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {classesCostData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Top Recipe Costs</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recipeCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="cost" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Layer 2: Bottom Row - Line Chart and Area Chart */}
      <div className="dashboard-layer layer-2">
        <div className="chart-card">
          <h2 className="chart-title">Storage Cost Analysis</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={storageCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Cumulative Classes Cost</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulative"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="cost"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
