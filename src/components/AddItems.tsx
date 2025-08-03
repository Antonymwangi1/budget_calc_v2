import axios from "axios";
import { useState } from "react";

const AddItems = ({
  budgetId,
  onItemAdded,
}: {
  budgetId: string;
  onItemAdded: () => void;
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/items/add", {
        name,
        amount,
        quantity: parseInt(quantity, 10) || 1,
        budgetId,
      });
      onItemAdded();
      setName("");
      setAmount("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding item:", error);
      // check if error is item amount exceeds budget
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setError("Item amount exceeds budget's remaining amount");
      } else {
        setError("Failed to add item. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 space-y-8 border border-blue-100"
      >
        <div>
          <label className="block text-sm text-gray-700 font-semibold mb-2">
            Item Name
          </label>
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            step={"0.01"}
            min={0}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 font-semibold mb-2">
            Quantity
          </label>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border border-blue-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <p className="text-red-700 font-bold">{error}</p>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-4 py-3 rounded-xl shadow-lg transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
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
              Adding...
            </span>
          ) : (
            "Add Items"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddItems;
