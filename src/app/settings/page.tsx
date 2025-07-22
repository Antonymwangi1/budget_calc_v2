"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";
import { useForm } from "react-hook-form";

const SettingsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmitProfile = (data) => {
    console.log("Profile Data:", data);
  };

  const onSubmitPreferences = (data) => {
    console.log("Preferences Data:", data);
  };

  return (
    <ProtectedRoute>
      <main className="settings-page p-6 md:p-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800">
          Settings
        </h1>

        {/* Profile Section */}
        <section className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Profile</h2>
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="name"
              >
                Name:
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                {...register("name", { required: "Name is required" })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>

        {/* Preferences Section */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Preferences
          </h2>
          <form
            onSubmit={handleSubmit(onSubmitPreferences)}
            className="space-y-6"
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="currency"
              >
                Currency:
              </label>
              <select
                id="currency"
                {...register("currency")}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-600 mb-1"
                htmlFor="theme"
              >
                Theme:
              </label>
              <select
                id="theme"
                {...register("theme")}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Preferences"}
            </button>
          </form>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default SettingsPage;
