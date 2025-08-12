"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import React, { useState } from "react";

const currencies = [
  { code: "USD", label: "USD - US Dollar", symbol: "$" },
  { code: "KES", label: "KES - Kenyan Shilling", symbol: "KES " },
  { code: "EUR", label: "EUR - Euro", symbol: "€" },
  { code: "GBP", label: "GBP - British Pound", symbol: "£" },
];

interface User {
  id: string;
  name: string;
  email: string;
}


export default function SettingsPage() {
  const [currency, setCurrency] = useState<string>("");
  const { user } = useAuth();

  const hanldeCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCurrency(selected);
    localStorage.setItem("currency", selected)
  }
  

  return (
    <ProtectedRoute>
      <main className="settings-page max-w-3xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-6">Settings</h1>

        {/* USER INFO FORM */}
        <section className="mb-6 bg-white p-8 group rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-xl mb-4 font-semibold">Account Info</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
                defaultValue={user?.name}
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
                defaultValue={user?.email}
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
                placeholder="New password"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* CURRENCY SELECT */}
        <section className="mb-10 bg-white p-8 group rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-xl mb-4 font-semibold">Currency</h2>
          <select
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
            value={currency}
            onChange={hanldeCurrencyChange}
          >
            <option value="Select Currency">Select Currency</option>
            {currencies.map((c) => (
              <option key={c.code} value={c.symbol}>
                {c.code}
              </option>
            ))}
          </select>
        </section>

        {/* DEACTIVATE ACCOUNT */}
        <section className="bg-white p-8 group rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-xl mb-4 font-semibold text-red-500">
            Danger Zone
          </h2>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
            Deactivate Account
          </button>
        </section>
      </main>
    </ProtectedRoute>
  );
}
