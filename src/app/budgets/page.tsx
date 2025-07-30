"use client";

import AddBudget from "@/components/AddBudget";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface Budget {
  id: string;
  name: string;
  description: string;
  amount: number;
  remaining: number;
}

export default function Budget() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [budgets, setBudgets] = useState<Budget[] | []>([]);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get<{ budgets: Budget[] }>(
        "/api/budget/get"
      );
      if (!response) {
        throw new Error("Failed to fetch budgets");
      }
      const data = response.data;
      setBudgets(data.budgets);
      console.log("Fetched budgets:", data.budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const filteredBudgets = budgets.filter((budget) =>
    budget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <h1 className="text-3xl font-bold mb-2 md:mb-0">
                My Budgets
              </h1>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search budgets..."
                  className="px-5 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full md:w-56 bg-white shadow-md text-lg"
                />
                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:from-blue-600 hover:to-blue-800 transition text-lg"
                >
                  + Add Budget
                </button>
              </div>
            </div>
          </header>
          <div className="grid md:grid-cols-2 gap-10">
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((budget) => (
                <Link href={`/budgets/${budget.id}`} key={budget.id}>
                  <div
                    key={budget.id}
                    className="bg-white p-8 hover:shadow-2xl transition group rounded-2xl border border-gray-200 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold transition">
                        {budget.name}
                      </h2>
                      <div className="flex gap-3">
                        <button className="text-blue-500 hover:text-yellow-700 transition">
                          <FaEdit size={24} />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition">
                          <FaTrash size={21} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">
                      {budget.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-semibold text-gray-500 bg-blue-50 px-3 py-1 rounded-lg">
                        Amount: ${budget.amount.toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        Remaining: $0
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-teal-600 to-teal-500 h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (budget.remaining / budget.amount) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {Math.round((budget.remaining / budget.amount) * 100)}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No budgets found.
              </p>
            )}
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.91)] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-800">
                  Add New Budget
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-700 text-white rounded-full h-9 w-9 flex justify-center items-center font-bold text-xl shadow hover:bg-red-800 transition"
                >
                  ×
                </button>
              </div>
              <div>
                <AddBudget
                  onBudgetAdded={() => {
                    fetchBudgets();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
