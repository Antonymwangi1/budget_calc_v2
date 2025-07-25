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
      setForm({ name: "", description: "", amount: 0 }); // Reset the form
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="text-lg text-gray-600">
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
            className="border border-gray-400 px-3 py-2 w-full rounded mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="text-lg text-gray-600">
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
            className="border border-gray-400 px-3 py-2 w-full rounded mt-1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="total" className="text-lg text-gray-600">
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
            className="border border-gray-400 px-3 py-2 w-full rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {loading ? "Adding..." : "Add Budget"}
        </button>
      </form>
      {error && (
        <div className="mt-4 text-red-600">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AddBudget;
