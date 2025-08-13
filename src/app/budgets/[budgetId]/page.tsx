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
import { getCurrency } from "@/lib/settings";

interface Item {
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
  const [items, setItems] = useState<Item[] | []>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [editingBudget, setEditingBudget] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [currency, setCurrency] = useState<string>("$");
  const { budgetId } = useParams();

  useEffect(() => {
    if (budgetId) {
      fetchItems(budgetId as string);
    }
    setCurrency(getCurrency());
  }, [budgetId, getCurrency()]);

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

  const deleteItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/items/delete?itemId=${itemId}`);
      window.location.reload();
    } catch (error: any) {
      console.error("❌ Delete request failed:", error);
    }
  };

  // if (loading)
  //   return (
  //     <div className="text-center text-gray-500 h-screen flex items-center justify-center">
  //       <h1 className="font-bold text-xl">Loading expenses...</h1>
  //     </div>
  //   );

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="text-center text-gray-500 h-screen flex items-center justify-center">
          <h1 className="font-bold text-xl">Loading expenses...</h1>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 md:p-8 shadow-2xl rounded-2xl">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-xl sm:text-2xl border-b-2 font-bold text-teal-900 tracking-tight">
                  <Link
                    href={`/budgets`}
                    className="hover:text-blue-800 transition"
                  >
                    {budget ? budget.name : "Budget Items"}
                  </Link>
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:text-base">
                  <p className="text-green-700 font-semibold">
                    <b>Allocation:</b> {currency}
                    {budget ? budget.amount : "0"}
                  </p>
                  <p>
                    <b>Amount Spent:</b> {currency}
                    {amountSpent.toFixed(2)}
                  </p>
                </div>

                {/* Search + Button */}
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Items..."
                    className="px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-48 bg-white shadow-sm"
                  />
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setEditingBudget(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
                  >
                    + Add Items
                  </button>
                </div>
              </div>
            </header>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
              <table className="min-w-full divide-y divide-blue-100 text-sm sm:text-base">
                <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 font-extrabold">
                          {idx + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-4">{item.name}</td>
                        <td className="px-4 sm:px-6 py-4">
                          {currency}
                          {item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4">{item.quantity}</td>
                        <td className="px-4 sm:px-6 py-4">
                          {currency}
                          {(item.amount * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setEditingBudget(true);
                              setShowModal(true);
                              setItemToEdit(item);
                            }}
                            className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-[90%] sm:w-[80%] md:w-[50%] max-w-lg relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-2xl font-extrabold text-blue-900">
                    {editingBudget ? "Edit Item" : "Add New Item"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold"
                  >
                    &times;
                  </button>
                </div>
                <AddItems
                  budgetId={budgetId as string}
                  onItemAdded={() => {
                    fetchItems(budgetId as string);
                    setShowModal(false);
                  }}
                  editing={editingBudget}
                  itemToEdit={itemToEdit}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
