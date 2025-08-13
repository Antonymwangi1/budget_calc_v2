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
  const [currency, setCurrency] = useState<string>("$")
  const { budgetId } = useParams();

  useEffect(() => {
    if (budgetId) {
      fetchItems(budgetId as string);
    }
    setCurrency(getCurrency())
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
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-8 shadow-2xl rounded-2xl">
  <div className="max-w-4xl mx-auto">
    <header className="mb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl border-b-2 font-bold text-teal-900 tracking-tight">
          <Link
            href={`/budgets`}
            className="hover:text-blue-800 transition py-2"
          >
            {budget ? budget.name : "Budget Items"}
          </Link>
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2 w-full md:w-auto">
          <p className="text-green-700 text-base sm:text-lg">
            <b>Allocation: </b>{currency}{budget ? budget.amount : "0"}
          </p>
          <p className="text-base sm:text-lg">
            <b>Amount Spent: </b>{currency}{amountSpent.toFixed(2)}
          </p>
        </div>

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
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition w-full sm:w-auto"
          >
            + Add Items
          </button>
        </div>
      </div>
    </header>

    {/* Table wrapper with scroll on mobile */}
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
              <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 sm:px-6 py-4 font-extrabold">{idx + 1}</td>
                <td className="px-4 sm:px-6 py-4">{item.name}</td>
                <td className="px-4 sm:px-6 py-4">{currency}{item.amount.toFixed(2)}</td>
                <td className="px-4 sm:px-6 py-4">{item.quantity}</td>
                <td className="px-4 sm:px-6 py-4">{currency}{(item.amount * item.quantity).toFixed(2)}</td>
                <td className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setEditingBudget(true);
                      setShowModal(true);
                      setItemToEdit(item);
                    }}
                    className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-semibold shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-semibold shadow-sm"
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
</div>

      )}
    </ProtectedRoute>
  );
}
