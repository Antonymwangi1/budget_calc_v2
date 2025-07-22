import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const budgets = [
  {
    title: "Desk Setup",
    description:
      "Budget for setting up a new desk with all the necessary equipment.",
    total: 500,
    remaining: 200,
  },
  {
    title: "Vacation Fund",
    description:
      "Budget for an upcoming vacation, including travel and accommodation.",
    total: 1500,
    remaining: 800,
  },
];

export default function Budget() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-2">
              Budgets
            </h1>
            <p className="text-gray-600">
              Manage your budgets efficiently and track your spending.
            </p>
          </header>
          <div className="grid md:grid-cols-2 gap-8">
            {budgets.map((budget, idx) => (
              <div
                key={budget.title}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">
                    {budget.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{budget.description}</p>
                  <div className="flex items-center gap-6 mb-4">
                    <span className="text-lg font-semibold text-blue-700">
                      Total: <span className="font-bold">${budget.total}</span>
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      Remaining:{" "}
                      <span className="font-bold">${budget.remaining}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          ((budget.total - budget.remaining) / budget.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
                    <FaEye />
                    View
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition">
                    <FaEdit />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition">
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
