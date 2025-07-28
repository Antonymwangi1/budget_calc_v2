"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const currencies = [
  { code: "USD", label: "USD - US Dollar" },
  { code: "KES", label: "KES - Kenyan Shilling" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "GBP", label: "GBP - British Pound" },
];

const SettingsPage = () => {
  const [theme, setTheme] = useState("light");

  return (
    <ProtectedRoute>
      <main
        className={`settings-page p-6 md:p-10 max-w-3xl mx-auto transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-4xl font-extrabold">
          Settings
        </h1>
      </main>
    </ProtectedRoute>
  );
};

export default SettingsPage;
