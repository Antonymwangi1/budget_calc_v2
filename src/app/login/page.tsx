"use client";

// Import dependencies
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// Login page component
export default function LoginPage() {
  const router = useRouter();

  // State for form fields and error message
  const [form, setForm] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState("");

  // Get authentication context values
  const { login, loading, user } = useAuth();

  // Handle input changes for email and password fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Redirect to home page if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await login(form); // Attempt login with form data
    } catch (err: any) {
      setErrMsg("Invalid email or password"); // Show error on failure
      console.error(err);
    }
  };

  // Show loading screen if authentication is in progress or user is logged in
  if (loading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Render login form
  return (
    <div className="card shadow-xl bg-white p-4 w-2/5 mx-auto my-12 rounded-2xl">
      <h1 className="text-center text-4xl font-bold p-2">Welcome Back</h1>
      <p className="text-center text-gray-500">
        Enter your credentials to access your account
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-6">
        <div className="form-group">
          <label htmlFor="email" className="text-lg text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-400 px-3 py-4 w-full rounded mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="text-lg text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-400 px-3 py-4 w-full rounded mt-1"
          />
        </div>
        <div className="flex justify-between">
          <div>
            {/* Remember me checkbox (not wired up) */}
            <input type="checkbox" name="" id="" />
            <label htmlFor="remember"> Remember me</label>
          </div>
          {/* Link to forgot password (placeholder) */}
          <Link
            href={`#`}
            className="text-blue-500 font-bold border-b-2 hover:text-blue-600"
          >
            Forgot password?
          </Link>
        </div>
        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 w-full"
        >
          Login
        </button>
        {/* Show error message if login fails */}
        {errMsg && <p className="text-red-600 text-sm">{errMsg}</p>}
      </form>
      {/* Link to registration page */}
      <p className="mt-6 text-center">
        Don't have an account?
        <Link href="/register" className="text-blue-600">
          {" "}
          Register
        </Link>
      </p>
    </div>
  );
}
