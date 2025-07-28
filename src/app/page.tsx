"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Budget = {
  id: number;
  name: string;
  total: number;
  spent: number;
  expenses: { name: string; amount: number; date: string }[];
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      name: "PC Build",
      total: 2000,
      spent: 500,
      expenses: [{ name: "GPU", amount: 500, date: "2024-06-01" }],
    },
    {
      id: 2,
      name: "Home Reno",
      total: 2500,
      spent: 1500,
      expenses: [
        { name: "Paint", amount: 500, date: "2024-06-02" },
        { name: "Flooring", amount: 1000, date: "2024-06-03" },
      ],
    },
  ]);

  const totalBudgets = budgets.length;
  const totalSpend = budgets.reduce((sum, b) => sum + b.spent, 0);

  const allExpenses = budgets.flatMap((b) =>
    b.expenses.map((e) => ({ ...e, budget: b.name }))
  );

  const recentExpense = allExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto mb-20 p-8 space-y-14">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow-sm">
          Budget Dashboard
        </h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 text-center shadow-lg border border-blue-200">
            <p className="text-base font-medium text-blue-600 mb-2">
              Total Budgets
            </p>
            <p className="text-4xl font-extrabold text-blue-800">
              {totalBudgets}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-2xl p-8 text-center shadow-lg border border-green-200">
            <p className="text-base font-medium text-green-600 mb-2">
              Total Spend
            </p>
            <p className="text-4xl font-extrabold text-green-800">
              ${totalSpend}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-8 shadow-md border border-yellow-100">
          <h2 className="text-xl font-bold text-gray-700 mb-2 tracking-tight">
            Recent Activity
          </h2>
          {recentExpense ? (
            <p className="text-gray-800 text-base">
              Added{" "}
              <strong className="text-yellow-700">{recentExpense.name}</strong>{" "}
              to{" "}
              <strong className="text-blue-700">{recentExpense.budget}</strong>
            </p>
          ) : (
            <p className="text-gray-400">No recent expenses</p>
          )}
        </div> */}

        {/* Recent Expense */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-3xl shadow-xl border border-gray-200 p-8">
          {/* Budgets */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
              Your Budgets
            </h2>
            {budgets.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md flex flex-col gap-3 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-700">
                    {b.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-bold text-blue-600">${b.spent}</span>{" "}
                    / <span className="text-gray-700">${b.total}</span> used
                  </p>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                    style={{
                      width: `${Math.min((b.spent / b.total) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Spent</span>
                  <span>Budget</span>
                </div>
                <p></p>
              </div>
            ))}
            <p>View All</p>
          </div>
          {/* Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-6 text-gray-700 tracking-tight">
              Spending Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={budgets}
                  dataKey="spent"
                  nameKey="name"
                  outerRadius={90}
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {budgets.map((_, index) => (
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
            <div className="flex justify-center gap-4 mt-6">
              {budgets.map((b, idx) => (
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
