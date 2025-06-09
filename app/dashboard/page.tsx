"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, CreditCard, Send, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/app/lib/api"
import type { AccountDTO, TransactionDTO } from "@/app/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<AccountDTO[]>([])
  const [recentTransactions, setRecentTransactions] = useState<TransactionDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
      return
    }

    const fetchDashboardData = async () => {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          api.get<AccountDTO[]>("/accounts"),
          api.get<TransactionDTO[]>("/dashboard/transactions"),
        ])
        setAccounts(accountsRes.data)
        setRecentTransactions(transactionsRes.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, isLoading, router])

  if (!user) return null

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Welcome back, {user.username}!
            </h1>
            <p className="text-slate-600 text-lg">Here's your financial overview</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/transactions/new")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Send className="mr-2 h-5 w-5" />
            New Transaction
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Total Balance</p>
                  <h3 className="text-3xl font-bold text-slate-900">${totalBalance.toLocaleString()}</h3>
                </div>
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Active Accounts</p>
                  <h3 className="text-3xl font-bold text-slate-900">{accounts.length}</h3>
                </div>
                <div className="bg-green-100 p-4 rounded-2xl">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Monthly Income</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-bold text-green-600">+$3,240</h3>
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Monthly Expenses</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-bold text-red-600">-$2,140</h3>
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="bg-red-100 p-4 rounded-2xl">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Accounts Overview */}
          <Card className="xl:col-span-2 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Your Accounts
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/accounts")}
                  className="hover:bg-slate-50 border-slate-200"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No accounts found</p>
                </div>
              ) : (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="group flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl hover:from-blue-50 hover:to-blue-100/50 transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-blue-200 hover:shadow-md"
                    onClick={() => router.push(`/accounts/${account.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        <CreditCard className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{account.accountHolderName}</h3>
                        <p className="text-slate-500 font-mono text-sm">{account.accountNumber}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-slate-900 text-xl">${account.balance?.toLocaleString()}</p>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        {account.accountType}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-green-600" />
                  Recent Activity
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/transactions")}
                  className="hover:bg-slate-50 border-slate-200"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent transactions</p>
                </div>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/50 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl ${
                          transaction.transactionType === "CREDIT"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.transactionType === "CREDIT" ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 text-sm">{transaction.description}</p>
                        <p className="text-slate-500 text-xs">
                          {new Date(transaction.transactionDate || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          transaction.transactionType === "CREDIT" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType === "CREDIT" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
