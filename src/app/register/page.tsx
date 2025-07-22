"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { json } from "stream/consumers";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/register", form);
      router.push("/login")
      console.log("User registered successfully", res.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="card shadow-xl bg-white p-4 w-2/5 mx-auto my-12 rounded-2xl">
      <h1 className="text-center text-4xl font-bold p-2">
        Create a New Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-6">
        <div className="form-group">
          <label htmlFor="name" className="text-lg text-gray-600">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-400 px-3 py-4 w-full rounded mt-1"
          />
        </div>
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-6">
        Already have an account?
        <Link href="/login" className="text-blue-600"> Login</Link>
      </p>
    </div>
  );
}
