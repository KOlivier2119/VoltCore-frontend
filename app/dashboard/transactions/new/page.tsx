"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, LucideLoader2 } from "lucide-react";
import api from "@/app/lib/api";
import { AccountDTO } from "@/app/lib/types";

export default function NewTransactionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    description: "",
    transactionType: "DEBIT",
    category: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await api.get<AccountDTO[]>("/accounts");
        setAccounts(response.data);
        if (response.data.length > 0) {
          setFormData((prev) => ({ ...prev, accountId: response.data[0].id }));
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to load accounts");
      }
    };

    fetchAccounts();
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/transactions", {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success("Transaction created successfully");
      router.push("/transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          New Transaction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="accountId">Account</Label>
            <Select
              name="accountId"
              value={formData.accountId}
              onValueChange={(value) => handleSelectChange("accountId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountHolderName} - {account.accountNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select
              name="transactionType"
              value={formData.transactionType}
              onValueChange={(value) =>
                handleSelectChange("transactionType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEBIT">Debit (Expense)</SelectItem>
                <SelectItem value="CREDIT">Credit (Income)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 focus:bg-white"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              required
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 focus:bg-white"
              placeholder="Enter transaction description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOOD">Food & Dining</SelectItem>
                <SelectItem value="TRANSPORT">Transportation</SelectItem>
                <SelectItem value="UTILITIES">Utilities</SelectItem>
                <SelectItem value="SHOPPING">Shopping</SelectItem>
                <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                <SelectItem value="HEALTH">Healthcare</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Transaction...
              </>
            ) : (
              "Create Transaction"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
