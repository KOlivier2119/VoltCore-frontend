"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Filter, Plus } from "lucide-react";
import api from "@/app/lib/api";
import { TransactionDTO } from "@/app/lib/types";

export default function TransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await api.get<TransactionDTO[]>("/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user, router]);

  if (!user) return null;

  const totalIncome = transactions
    .filter((t) => t.transactionType === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.transactionType === "DEBIT")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            View and manage your transactions
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="border-gray-200">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button
            onClick={() => router.push("/transactions/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> New Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1 flex items-center">
                +${totalIncome.toLocaleString()}
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1 flex items-center">
                -${totalExpenses.toLocaleString()}
                <ArrowDownRight className="h-4 w-4 ml-1" />
              </h3>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Flow</p>
              <h3
                className={`text-2xl font-bold mt-1 flex items-center ${
                  totalIncome - totalExpenses >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${(totalIncome - totalExpenses).toLocaleString()}
                {totalIncome - totalExpenses >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 ml-1" />
                )}
              </h3>
            </div>
            <div
              className={`p-3 rounded-full ${
                totalIncome - totalExpenses >= 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {totalIncome - totalExpenses >= 0 ? (
                <ArrowUpRight
                  className={`h-6 w-6 ${
                    totalIncome - totalExpenses >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
              ) : (
                <ArrowDownRight
                  className={`h-6 w-6 ${
                    totalIncome - totalExpenses >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Type
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/transactions/${transaction.id}`)}
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      transaction.transactionDate || ""
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          transaction.transactionType === "CREDIT"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.transactionType === "CREDIT" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.transactionType === "CREDIT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm font-medium ${
                      transaction.transactionType === "CREDIT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.transactionType === "CREDIT" ? "+" : "-"}$
                    {transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
