"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  LineChart,
  Line,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import Link from "next/link";
import axios from "axios";
import { getCurrency } from "@/lib/settings";

type Budget = {
  id: string;
  name: string;
  amount: number;
};

type Expenses = {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  budgetId: string;
};

const COLORS = ["#028090", "#114B5F", "#456990", "#F45B69", "#8B5CF6"];

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expenses[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>("$");

  useEffect(() => {
    fetchBudgets();
    setCurrency(getCurrency());
  }, []);

  useEffect(() => {
    if (budgets.length > 0) {
      fetchExpenses(budgets.map((b) => b.id));
    }
  }, [budgets]);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get<{ budgets: Budget[] }>(
        "/api/budget/get"
      );
      if (!response) throw new Error("Failed to fetch budgets");
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const fetchExpenses = async (budgetIds: string[]) => {
    try {
      const query = budgetIds.join(",");
      const response = await axios.get(`/api/items/get?budgetId=${query}`);
      console.log("Raw response:", response.data);

      const expensesArray = Array.isArray(response.data)
        ? response.data
        : response.data.items;

      setExpenses(expensesArray);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const totalBudgets = budgets.length;
  const totalSpend = budgets.reduce((sum, e) => sum + e.amount, 0);

  // Combine budget with spent + remaining
  const budgetWithSpending = budgets.map((budget) => {
    const spent = (expenses ?? [])
      .filter((expense) => expense.budgetId === budget.id)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      ...budget,
      spent,
      remaining: Number(Math.max(budget.amount - spent, 0).toFixed(2)),
    };
  });

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 space-y-14">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow-sm">
          Budget Dashboard
        </h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-blue-200">
            <p className="text-sm sm:text-base font-medium text-gray-600 mb-2">
              Total Budgets
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              {totalBudgets}
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-green-200">
            <p className="text-sm sm:text-base font-medium text-gray-600 mb-2">
              Total Spend
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              {currency}
              {totalSpend}
            </p>
          </div>
        </div>

        {/* Budgets and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
          {/* Budgets */}
          <div className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 tracking-tight">
              Your Budgets
            </h2>
            {budgetWithSpending.slice(0, 2).map((b) => (
              <Link
                href={`/budgets/${b.id}`}
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md flex flex-col gap-3 hover:shadow-xl transition-shadow"
              >
                <div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <p className="text-base sm:text-lg font-semibold text-gray-700">
                      {b.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      <span className="font-bold text-blue-600">
                        {currency}
                        {b.spent}
                      </span>{" "}
                      /{" "}
                      <span className="text-gray-700">
                        {currency}
                        {b.amount}
                      </span>{" "}
                      used
                    </p>
                  </div>
                  <div className="w-full h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-teal-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min((b.spent / b.amount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mt-1">
                    <span>Spent</span>
                    <span>Budget</span>
                  </div>
                </div>
              </Link>
            ))}
            <p className="text-center font-bold">
              <Link
                href="/budgets"
                className="text-teal-600 hover:text-blue-600 underline"
              >
                View all budgets
              </Link>
            </p>
          </div>

          {/* Stacked Bar Chart */}
          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-700 tracking-tight">
              Spent vs Remaining
            </h2>
            {budgetWithSpending.length === 0 ? (
              <p className="text-gray-400">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetWithSpending}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="spent" stackId="a" fill="#028090" />
                  <Bar dataKey="remaining" stackId="a" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
