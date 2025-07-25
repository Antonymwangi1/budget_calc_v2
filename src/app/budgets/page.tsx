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

    fetchBudgets();
  }, []);

  const filteredBudgets = budgets.filter((budget) =>
    budget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-2 md:mb-0">
                My Budgets
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
          </header>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((budget, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                >
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">
                    {budget.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{budget.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-semibold text-blue-700">
                      Amount: ${budget.amount.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/budgets/${budget.id}`} className="text-blue-500 hover:text-blue-700">
                        <FaEye size={25} />
                      </Link>
                      <button className="text-green-500 hover:text-yellow-700">
                        <FaEdit size={23} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p>Remaining: ${(0.0).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No budgets found.
              </p>
            )}
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.91)] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Budget</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-700 text-white rounded-full h-8 w-8 flex justify-center items-center font-bold"
                >
                  x
                </button>
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
