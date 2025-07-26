"use client";

import AddItems from "@/components/AddItems";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useParams } from "next/navigation";

// import axios from "axios";
// import { useRouter, useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

interface Items {
  id: string;
  name: string;
  amount: number;
  description: string;
  budgetId: string;
}

interface Budget {
  id: string;
  name: string;
}

export default function AddItem() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<Items[] | []>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { budgetId } = useParams();

  useEffect(() => {
    if (budgetId) {
      fetchItems(budgetId as string);
    }
  }, [budgetId]);

  const fetchItems = async (budgetId: string) => {
    try {
      const response = await axios.get(`/api/items/get?budgetId=${budgetId}`);
      if (!response || !response.data) {
        throw new Error("Failed to fetch items");
      }

      setItems(response.data.items);
      setBudget(response.data.budget);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-2 md:mb-0">
                {budget ? budget.name : "Budget Items"}
              </h1>
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
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider border-b">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider border-b">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider border-b">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 border-b text-blue-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 border-b text-blue-800">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 border-b text-blue-800">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 border-b text-blue-800">
                        <button className="text-blue-600 hover:text-blue-800 transition">
                          Edit
                        </button>
                        <button className="ml-4 text-red-600 hover:text-red-800 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center px-6 py-4">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
