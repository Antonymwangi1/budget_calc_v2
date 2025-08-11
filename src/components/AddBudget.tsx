import axios from "axios";
import React, { useEffect, useState } from "react";

interface Budget {
  id: string;
  name: string;
  description: string;
  amount: number;
}

const AddBudget = ({
  onBudgetAdded,
  editing,
  budgetToEdit,
}: {
  onBudgetAdded: () => void;
  editing: boolean;
  budgetToEdit?: Budget | null;
}) => {
  const [form, setForm] = useState({ id: "", name: "", description: "", amount: 0 });
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
      onBudgetAdded();
      console.log("Budget added:", response.data);
    } catch (error) {
      console.error("Error adding budget:", error);
      setError("Failed to add budget. Please try again.");
    } finally {
      setLoading(false);
      setForm({ id: "", name: "", description: "", amount: 0 });
    }
  };

  useEffect(() => {
    if (editing && budgetToEdit) {
      setForm({
        id: budgetToEdit.id,
        name: budgetToEdit.name,
        description: budgetToEdit.description,
        amount: budgetToEdit.amount,
      });
    }
  }, [editing, budgetToEdit]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/budget/edit`,
        form
      );
      onBudgetAdded();
      console.log("Budget updated:", response.data);
    } catch (error) {
      console.error("Error updating budget:", error);
      setError("Failed to update budget. Please try again.");
    } finally {
      setLoading(false);
      setForm({id: "", name: "", description: "", amount: 0 });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      
      <form
        className="space-y-6"
        onSubmit={editing ? handleEdit : handleSubmit}
      >
        <input type="text" name="id" onChange={handleChange} value={form.id} className="hidden" disabled />
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <div>
          <label
            htmlFor="total"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
          disabled={loading}
        >
          {/* {loading ? "Saving..." : editing ? "Update Budget" : "Add Budget"} */}
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Saving...
            </span>
          ) : editing ? (
            "Update Budget"
          ) : (
            "Add Budget"
          )}
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
