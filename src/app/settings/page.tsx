"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosError } from "axios";
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
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeactivate, setShowDeactivate] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          alert("This email is already in use. Please choose another.");
        } else if (err.response?.status === 400) {
          alert("Name and email are required.");
        } else {
          alert("Something went wrong. Please try again.");
        }
      }
    }
  };

  const handleUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch("/api/auth/updateUserPass", { oldPass, newPass });
      alert("Password updated sucessfully");
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("Incorrect Password");
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await axios.delete("/api/auth/deactivate");
      alert("You've deactivated your account");
      window.location.reload();
    } catch (error) {
      alert("Failed to deactivate account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="settings-page max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6">Settings</h1>

        {/* USER INFO FORM */}
        <section className="mb-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-lg sm:text-xl mb-4 font-semibold">
            Account Info
          </h2>
          <form className="space-y-4" onSubmit={changeUserInfo}>
            <div>
              <label className="block mb-1 text-sm font-medium">Username</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
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
              className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* PASSWORD CHANGE */}
        <section className="mb-10 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-lg sm:text-xl mb-4 font-semibold">
            Change Password
          </h2>
          <form onSubmit={handleUserPassword}>
            <div className="space-y-4">
              <input
                type="password"
                onChange={(e) => setOldPass(e.target.value)}
                value={oldPass}
                placeholder="Old password"
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              />
              <input
                type="password"
                onChange={(e) => setNewPass(e.target.value)}
                value={newPass}
                name="password"
                placeholder="New password"
                className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
            >
              Change Password
            </button>
          </form>
        </section>

        {/* CURRENCY SELECT */}
        <section className="mb-10 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-lg sm:text-xl mb-4 font-semibold">Currency</h2>
          <select
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="">Select Currency</option>
            {currencies.map((c) => (
              <option key={c.code} value={c.symbol}>
                {c.code}
              </option>
            ))}
          </select>
        </section>

        {/* DEACTIVATE ACCOUNT */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          <h2 className="text-lg sm:text-xl mb-4 font-semibold text-red-500">
            Danger Zone
          </h2>
          <button
            onClick={() => setShowDeactivate(true)}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            {loading ? "Deactivating Account..." : "Deactivate Account"}
          </button>
        </section>

        {/* Modal */}
        {showDeactivate && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.91)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-lg border border-blue-100 max-h-[90vh] overflow-y-auto">
              <p className="text-xl">Are you sure you want to deactivate this account?</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleDeactivate}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  {loading ? "Deactivating Account..." : "Yes"}
                </button>
                <button
                  onClick={() => setShowDeactivate(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
