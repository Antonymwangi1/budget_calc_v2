"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", form);
      console.log("User registered successfully", res.data);
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setErrMsg(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="card shadow-xl bg-white p-6 sm:p-8 w-full max-w-lg rounded-2xl">
        <h1 className="text-center text-3xl sm:text-4xl font-bold">
          Create a New Account
        </h1>
        <p className="text-center text-gray-500 mt-1">Sign up to get started</p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 max-w-md mx-auto mt-6"
        >
          <div className="form-group">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-3 w-full rounded mt-1 outline-none"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-3 w-full rounded mt-1 outline-none"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-3 w-full rounded mt-1 outline-none"
            />
          </div>

          {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-teal-600 text-white px-4 py-3 rounded hover:bg-teal-700 w-full transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
