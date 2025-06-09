"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { accountsApi } from "@/app/lib/api/accounts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/app/contexts/AuthContext"
import { ArrowLeft, CreditCard, DollarSign, Mail, Percent, User } from "lucide-react"

export default function NewAccount() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    accountHolderName: "",
    email: "",
    accountType: "CHECKING",
    balance: "",
    status: "ACTIVE",
    interestRate: "",
  })
  const [submitting, setSubmitting] = useState(false)

  if (!user && !isLoading) {
    router.push("/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await accountsApi.createAccount({
        accountHolderName: form.accountHolderName,
        accountNumber: "", // Backend will generate this
        accountType: form.accountType as "CHECKING" | "SAVINGS" | "CREDIT" | "INVESTMENT",
        balance: Number.parseFloat(form.balance),
        status: form.status as "ACTIVE" | "INACTIVE" | "FROZEN",
        interestRate: form.interestRate ? Number.parseFloat(form.interestRate) : undefined,
      })
      toast.success("Account created successfully")
      router.push("/dashboard/accounts")
    } catch (error) {
      toast.error("Failed to create account")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Create New Account
            </h1>
            <p className="text-slate-600 text-lg">Add a new account to your financial portfolio</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolderName" className="text-slate-700 font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  Account Holder Name
                </Label>
                <Input
                  id="accountHolderName"
                  name="accountHolderName"
                  value={form.accountHolderName}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                />
              </div>

              {/* Account Type and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-500" />
                    Account Type
                  </Label>
                  <Select value={form.accountType} onValueChange={(value) => handleSelectChange("accountType", value)}>
                    <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHECKING">Checking Account</SelectItem>
                      <SelectItem value="SAVINGS">Savings Account</SelectItem>
                      <SelectItem value="CREDIT">Credit Account</SelectItem>
                      <SelectItem value="INVESTMENT">Investment Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Account Status</Label>
                  <Select value={form.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="FROZEN">Frozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Balance and Interest Rate Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="balance" className="text-slate-700 font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    Initial Balance
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                      $
                    </span>
                    <Input
                      id="balance"
                      name="balance"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.balance}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="h-12 pl-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-slate-700 font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4 text-slate-500" />
                    Interest Rate (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={form.interestRate}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="h-12 pr-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Create Account
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-0 shadow-sm bg-slate-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-800">Account Information</h3>
                <p className="text-sm text-slate-600">
                  Your account number will be automatically generated upon creation. All accounts are subject to
                  verification and approval processes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
