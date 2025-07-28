import axios from "axios";
import React, { useState } from "react";

const AddBudget = () => {
  const [form, setForm] = useState({ name: "", description: "", amount: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/budget/add", form);
      console.log("Budget added:", response.data);
    } catch (error) {
      console.error("Error adding budget:", error);
      setError("Failed to add budget. Please try again.");
    } finally {
      setLoading(false);
      setForm({ name: "", description: "", amount: 0 });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Budget
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={form.name}
            required
            autoFocus
            placeholder="Budget Title"
            className="block w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 text-gray-900 bg-gray-50 transition"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            value={form.description}
            required
            rows={3}
            autoComplete="off"
            placeholder="Budget Description"
            className="block w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 text-gray-900 bg-gray-50 transition"
          />
        </div>
        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
          </label>
          <input
            type="number"
            onChange={handleChange}
            value={form.amount}
            required
            min="0"
            step="0.01"
            autoComplete="off"
            name="amount"
            placeholder="Total Amount"
            className="block w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 text-gray-900 bg-gray-50 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Adding...
            </span>
          ) : "Add Budget"}
        </button>
      </form>
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AddBudget;
