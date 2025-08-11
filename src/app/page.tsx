"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import axios from "axios";

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
  budgetId: string; // was number before
};

const COLORS = ["#028090", "#114B5F", "#456990", "#F45B69", "#8B5CF6"];

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (budgets.length > 0) {
      fetchExpenses(budgets.map((b) => b.id)); // string[]
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
        : response.data.items; // <- changed to match your backend `items` key

      setExpenses(expensesArray);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const totalBudgets = budgets.length;
  const totalSpend = budgets.reduce((sum, e) => sum + e.amount, 0);

  // Combine budget and its total spent
  const budgetWithSpending = budgets.map((budget) => {
    const spent = (expenses ?? [])
      .filter((expense) => expense.budgetId === budget.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...budget,
      spent,
    };
  });

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto mb-20 p-8 space-y-14">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow-sm">
          Budget Dashboard
        </h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 text-center shadow-lg border border-blue-200">
            <p className="text-base font-medium text-gray-600 mb-2">
              Total Budgets
            </p>
            <p className="text-4xl font-extrabold text-gray-800">
              {totalBudgets}
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-2xl p-8 text-center shadow-lg border border-green-200">
            <p className="text-base font-medium text-gray-600 mb-2">
              Total Spend
            </p>
            <p className="text-4xl font-extrabold text-gray-800">
              ${totalSpend}
            </p>
          </div>
        </div>

        {/* Budgets and Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-3xl shadow-xl border border-gray-200 p-8">
          {/* Budgets */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
              Your Budgets
            </h2>
            {budgetWithSpending.slice(0, 2).map((b) => (
              <Link
                href={`/budgets/${b.id}`}
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md flex flex-col gap-3 hover:shadow-xl transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-700">
                      {b.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-bold text-blue-600">
                        ${b.spent}
                      </span>{" "}
                      / <span className="text-gray-700">${b.amount}</span> used
                    </p>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-4 bg-gradient-to-r from-teal-600 to-teal-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min((b.spent / b.amount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
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

          {/* Pie Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6 text-gray-700 tracking-tight">
              Spending Breakdown
            </h2>
            {budgetWithSpending.length === 0 || totalSpend === 0 ? (
              <p className="text-gray-400">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={budgetWithSpending}
                    dataKey="spent"
                    nameKey="name"
                    outerRadius={90}
                    label={({ name }) => name}
                    labelLine={false}
                  >
                    {budgetWithSpending.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {budgetWithSpending.map((b, idx) => (
                <div key={b.id} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
