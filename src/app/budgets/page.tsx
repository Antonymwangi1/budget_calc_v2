"use client";

import AddBudget from "@/components/AddBudget";
import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-2 md:mb-0">
                Budgets
              </h1>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search budgets..."
                  className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full md:w-48 bg-white shadow-sm"
                />
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
                >
                  + Add Budget
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Manage your budgets efficiently and track your spending.
            </p>
          </header>
          <div className="grid md:grid-cols-2 gap-8">
            {budgets.map((budget, idx) => (
              <div
                key={budget.title}
                className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between border border-blue-100 hover:shadow-2xl transition-transform hover:-translate-y-1"
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
                  <div className="w-full bg-gray-100 rounded-full h-4 mb-4 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all"
                      style={{
                        width: `${
                          ((budget.total - budget.remaining) / budget.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium shadow hover:bg-blue-600 transition">
                    <FaEye className="text-lg" />
                    View
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600 transition">
                    <FaEdit className="text-lg" />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 transition">
                    <FaTrash className="text-lg" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.91)] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Budget</h2>
                <button onClick={() => setShowModal(false)} className="bg-red-700 text-white rounded-full h-8 w-8 flex justify-center items-center font-bold">x</button>
              </div>
              <div>
                <AddBudget />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
