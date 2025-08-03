"use client";

import AddItems from "@/components/AddItems";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import bcrypt from "bcryptjs";

// import axios from "axios";
// import { useRouter, useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface Items {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  budgetId: string;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
}

export default function AddItem() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<Items[] | []>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { budgetId } = useParams();

  useEffect(() => {
    if (budgetId) {
      fetchItems(budgetId as string);
    }
  }, [budgetId]);

  const fetchItems = async (budgetId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/items/get?budgetId=${budgetId}`);
      if (!response || !response.data) {
        throw new Error("Failed to fetch items");
      }

      setItems(response.data.items);
      setBudget(response.data.budget);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const amountSpent = items.reduce((total, item) => {
    return total + item.amount * item.quantity;
  }, 0);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center text-gray-500 h-screen flex items-center justify-center">
        <h1 className="font-bold text-xl">Loading expenses...</h1>
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8 shadow-2xl rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl p-0 m-0 border-b-2 font-bold text-teal-900 tracking-tight mb-2 md:mb-0">
                <Link
                  href={`/budgets`}
                  className="hover:text-blue-800 transition py-2"
                >
                  {budget ? budget.name : "Budget Items"}
                </Link>
              </h1>
              <p className="text-green-700 text-lg">
                <b>Allocation: </b>${budget ? budget.amount : "0"}
              </p>
              <p>
                <b>Amount Spent: </b>
                {amountSpent.toFixed(2)}
              </p>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Items..."
                  className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full md:w-48 bg-white shadow-sm"
                />
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
                >
                  + Add Items
                </button>
              </div>
            </div>
          </header>
          <div className="overflow-x-auto">
            <div className="w-full overflow-x-auto rounded-xl shadow-lg bg-white">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-extrabold">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${(item.amount * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-semibold shadow-sm">
                            Edit
                          </button>
                          <button className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-semibold shadow-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center px-6 py-8 text-blue-400 font-semibold"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.91)] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-blue-900 p-0 m-0">
                  Add New Item
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold transition"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <div>
                <AddItems
                  budgetId={budgetId as string}
                  onItemAdded={() => {
                    fetchItems(budgetId as string);
                    setShowModal(false);
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
