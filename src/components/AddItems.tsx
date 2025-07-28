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
  const [description, setDescription] = useState("N/A");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/items/add", {
        name,
        amount,
        description,
        budgetId,
      });
      onItemAdded();
      setName("");
      setAmount("");
      setDescription("N/A");
    } catch (error) {
      console.error("Error adding item:", error);
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
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
          Add Budget Item
        </h2>
        <div>
          <label className="block text-sm font-semibold text-blue-600 mb-2">
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
          <label className="block text-sm font-semibold text-blue-600 mb-2">
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
          <label className="block text-sm font-semibold text-blue-600 mb-2">
            Description
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-blue-200 rounded-xl p-3 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm bg-blue-50 placeholder:text-blue-300"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-4 py-3 rounded-xl shadow-lg transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItems;
