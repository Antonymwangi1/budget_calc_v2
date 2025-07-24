"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

type Expense = {
  id: number;
  name: string;
  amount: number;
  date: string;
};

export default function Dashboard() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);

  function addExpense() {
    if (!expenseName || expenseAmount <= 0) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        name: expenseName,
        amount: expenseAmount,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setExpenseName("");
    setExpenseAmount(0);
  }

  function removeExpense(id: number) {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const dates = sortedExpenses.map((exp) => exp.date);
  const amounts = sortedExpenses.map((exp) => exp.amount);

  const lineData = {
    labels: dates.length ? dates : ["No data"],
    datasets: [
      {
        label: "Spending Over Time",
        data: amounts.length ? amounts : [0],
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  const top5 = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const pieData = {
    labels: top5.length ? top5.map((exp) => exp.name) : ["No data"],
    datasets: [
      {
        data: top5.length ? top5.map((exp) => exp.amount) : [1],
        backgroundColor: [
          "#3b82f6",
          "#f59e42",
          "#10b981",
          "#ef4444",
          "#6366f1",
        ],
      },
    ],
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  const recentBudgets = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const mostExpensive = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          My Budget Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="mt-6">
              <ul className="mt-4">
                {expenses.map((exp) => (
                  <li
                    key={exp.id}
                    className="flex justify-between items-center py-1 border-b last:border-b-0"
                  >
                    <span>
                      {exp.name}:{" "}
                      <span className="font-semibold">${exp.amount}</span>{" "}
                      <span className="text-xs text-gray-500">
                        ({exp.date})
                      </span>
                    </span>
                    <button
                      onClick={() => removeExpense(exp.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Summary
            </h2>
            <div className="space-y-2">
              <p>
                Income: <span className="font-semibold">${income}</span>
              </p>
              <p>
                Money Used So Far:{" "}
                <span className="font-semibold text-blue-600">
                  ${totalExpenses}
                </span>
              </p>
              <p
                className={
                  balance < 0
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                Balance: ${balance}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-700">
                Recent Budgets
              </h3>
              <ul className="text-sm">
                {recentBudgets.length > 0 ? (
                  recentBudgets.map((exp) => (
                    <li key={exp.id} className="flex justify-between py-1">
                      <span>{exp.name}</span>
                      <span className="font-semibold">${exp.amount}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No recent budgets</li>
                )}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-gray-700">
                Most Expensive Items
              </h3>
              <ul className="text-sm">
                {mostExpensive.length > 0 ? (
                  mostExpensive.map((exp) => (
                    <li key={exp.id} className="flex justify-between py-1">
                      <span>{exp.name}</span>
                      <span className="font-semibold">${exp.amount}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No expensive items</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Spending Over Time
            </h2>
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { title: { display: true, text: "Date" } },
                  y: {
                    title: { display: true, text: "Amount ($)" },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Top 5 Spending Items
            </h2>
            <Pie
              data={pieData}
              options={{
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
