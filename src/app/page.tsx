"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

type Expense = {
  id: number;
  name: string;
  amount: number;
};

export default function Dashboard() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  function addExpense() {
    if (!expenseName || expenseAmount <= 0) return;
    setExpenses([
      ...expenses,
      { id: Date.now(), name: expenseName, amount: expenseAmount },
    ]);
    setExpenseName("");
    setExpenseAmount(0);
  }

  function removeExpense(id: number) {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  }

  return (
    <ProtectedRoute>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Budget Dashboard</h1>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Monthly Income</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
            min={0}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmount === 0 ? "" : expenseAmount}
              onChange={(e) => setExpenseAmount(Number(e.target.value))}
              className="border rounded px-2 py-1 w-24"
              min={0}
            />
            <button
              onClick={addExpense}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Add
            </button>
          </div>
          <ul>
            {expenses.map((exp) => (
              <li
                key={exp.id}
                className="flex justify-between items-center py-1"
              >
                <span>
                  {exp.name}: ${exp.amount}
                </span>
                <button
                  onClick={() => removeExpense(exp.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <p>Income: ${income}</p>
          <p>Total Expenses: ${totalExpenses}</p>
          <p className={balance < 0 ? "text-red-600" : "text-green-600"}>
            Balance: ${balance}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
