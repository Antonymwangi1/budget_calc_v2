"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const currencies = [
  { code: "USD", label: "USD - US Dollar", symbol: "$" },
  { code: "KES", label: "KES - Kenyan Shilling", symbol: "KES " },
  { code: "EUR", label: "EUR - Euro", symbol: "€" },
  { code: "GBP", label: "GBP - British Pound", symbol: "£" },
];

export default function SettingsPage() {
  const [currency, setCurrency] = useState<string>("");
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const hanldeCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCurrency(selected);
    localStorage.setItem("currency", selected);
  };

  const changeUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch("/api/auth/updateUser", form);
      alert("User updated successfully");
      window.location.reload();
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("This email is already in use. Please choose another.");
      } else if (err.response?.status === 400) {
        alert("Name and email are required.");
      } else {
        alert("Something went wrong. Please try again.");
      }
      console.error("Failed to update user:", err);
    }
  };

  return (
    <ProtectedRoute>
      <main className="settings-page max-w-3xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-6">Settings</h1>

        {/* USER INFO FORM */}
        <section className="mb-6 bg-white p-8 group rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-xl mb-4 font-semibold">Account Info</h2>
          <form className="space-y-4" onSubmit={changeUserInfo}>
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
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

        {/* password change */}
        <section className="mb-10 bg-white p-8 group rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-xl mb-4 font-semibold">Change Password</h2>
          <div className="mb-6">
            {/* <label className="block mb-1">Password</label> */}
            <input
              type="password"
              className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
              placeholder="Old password"
            />
          </div>
          <div className="mb-6">
            {/* <label className="block mb-1">Password</label> */}
            <input
              type="password"
              name="password"
              className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
              placeholder="New password"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
          >
            Change Password
          </button>
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
