"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import api from "@/app/lib/api";
import { AccountDTO, TransactionDTO } from "@/app/lib/types";

export default function AccountsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await api.get<AccountDTO[]>("/accounts");
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Accounts</h1>
          <p className="text-gray-600 mt-1">
            Manage your bank accounts and cards
          </p>
        </div>
        <Button
          onClick={() => router.push("/accounts/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/accounts/${account.id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  account.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {account.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {account.accountHolderName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {account.accountNumber?.replace(/(\d{4})/g, "$1 ").trim()}
            </p>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-xl font-bold text-gray-900">
                  ${account.balance?.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {account.accountType}
                </p>
              </div>
            </div>

            {account.interestRate && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="text-sm font-medium text-blue-600">
                    {account.interestRate}%
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
