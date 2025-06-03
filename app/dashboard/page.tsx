"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  CreditCard,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/app/lib/api";
import { AccountDTO, TransactionDTO } from "@/app/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          api.get<AccountDTO[]>("/accounts"),
          api.get<TransactionDTO[]>("/dashboard/transactions/recent"),
        ]);
        setAccounts(accountsRes.data);
        setRecentTransactions(transactionsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, router]);

  if (!user) return null;

  const totalBalance = accounts.reduce(
    (sum, account) => sum + (account.balance || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600 mt-1">Here's your financial overview</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/transactions/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="mr-2 h-4 w-4" /> New Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${totalBalance.toLocaleString()}
              </h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Accounts
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {accounts.length}
              </h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Income
              </p>
              <h3 className="text-2xl font-bold text-green-600 mt-1 flex items-center">
                +$3,240
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </h3>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Expenses
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1 flex items-center">
                -$2,140
                <ArrowDownRight className="h-4 w-4 ml-1" />
              </h3>
            </div>
            <div className="bg-red-50 p-3 rounded-full">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Accounts
            </h2>
            <Button
              variant="outline"
              onClick={() => router.push("/accounts")}
              className="text-sm"
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => router.push(`/accounts/${account.id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {account.accountHolderName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {account.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${account.balance?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{account.accountType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Transactions
            </h2>
            <Button
              variant="outline"
              onClick={() => router.push("/transactions")}
              className="text-sm"
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.transactionType === "CREDIT"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.transactionType === "CREDIT" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        transaction.transactionDate || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    transaction.transactionType === "CREDIT"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.transactionType === "CREDIT" ? "+" : "-"}$
                  {transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
