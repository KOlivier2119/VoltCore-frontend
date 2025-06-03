"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { accountsApi } from "@/app/lib/api/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";

export default function NewAccount() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    accountHolderName: "",
    email: "",
    accountType: "CHECKING",
    balance: "",
    status: "ACTIVE",
    interestRate: ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (!user && !isLoading) {
    router.push("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await accountsApi.createAccount({
        accountHolderName: form.accountHolderName,
        accountNumber: "", // Backend will generate this
        accountType: form.accountType as "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT",
        balance: parseFloat(form.balance),
        status: form.status as "ACTIVE" | "INACTIVE" | "FROZEN",
        interestRate: form.interestRate ? parseFloat(form.interestRate) : undefined
      });
      toast.success("Account created successfully");
      router.push("/dashboard/accounts");
    } catch (error) {
      toast.error("Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-10 border border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">Add New Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="accountHolderName" className="text-blue-700">Account Holder Name</Label>
            <Input id="accountHolderName" name="accountHolderName" value={form.accountHolderName} onChange={handleChange} required className="mt-1 focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <Label htmlFor="email" className="text-blue-700">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="mt-1 focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <Label htmlFor="accountType" className="text-blue-700">Account Type</Label>
            <select id="accountType" name="accountType" value={form.accountType} onChange={handleChange} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-400">
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
              <option value="CREDIT">Credit</option>
              <option value="INVESTMENT">Investment</option>
            </select>
          </div>
          <div>
            <Label htmlFor="balance" className="text-blue-700">Balance</Label>
            <Input id="balance" name="balance" type="number" step="0.01" value={form.balance} onChange={handleChange} required className="mt-1 focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <Label htmlFor="status" className="text-blue-700">Status</Label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-400">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="FROZEN">Frozen</option>
            </select>
          </div>
          <div>
            <Label htmlFor="interestRate" className="text-blue-700">Interest Rate (%)</Label>
            <Input id="interestRate" name="interestRate" type="number" step="0.01" value={form.interestRate} onChange={handleChange} className="mt-1 focus:ring-2 focus:ring-blue-400" />
          </div>
          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200" disabled={submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
