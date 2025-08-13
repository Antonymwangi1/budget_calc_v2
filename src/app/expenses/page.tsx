"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Item {
  id: string;
  name: string;
  amount: number;
  quantity: number;
  budgetId: string;
  budget?: {
    id: string;
    name: string;
    amount: number;
  };
}

interface Budget {
  id: string;
  name: string;
  amount: number;
}

const Page = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/items/getAll");
      setItems(response.data.items || []);
      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.budget?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBudget =
        !selectedBudget || item.budget?.name === selectedBudget;

      return matchesSearch && matchesBudget;
    })
    .sort((a, b) => (a.budget?.name || "").localeCompare(b.budget?.name || ""));

  if (loading) {
    return (
      <div className="text-center text-gray-500 h-screen flex items-center justify-center">
        <h1 className="font-bold text-xl">Loading expenses...</h1>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4 md:p-8 shadow-2xl rounded-2xl">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <header className="mb-6 md:mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-xl md:text-2xl font-bold">All Expenses</h1>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Items..."
                  className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-64 bg-white shadow-sm"
                />
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-48 bg-white shadow-sm"
                >
                  <option value="">Filter by Budget</option>
                  {budgets.map((budget, idx) => (
                    <option key={idx} value={budget.name}>
                      {budget.name || "No Budget"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          {/* TABLE WRAPPER */}
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="min-w-[600px] w-full divide-y divide-blue-100">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                <tr>
                  {[
                    "#",
                    "Item Name",
                    "Budget Name",
                    "Amount",
                    "Quantity",
                    "Total",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs md:text-sm font-bold text-blue-900 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50 transition-colors duration-200 text-sm md:text-base"
                    >
                      <td className="px-4 py-3 font-extrabold">{idx + 1}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/budgets/${item.budgetId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.budget?.name || "No Budget"}
                        </Link>
                      </td>
                      <td className="px-4 py-3">${item.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        ${(item.amount * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center px-4 py-8 text-blue-400 font-semibold"
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
    </ProtectedRoute>
  );
};

export default Page;
