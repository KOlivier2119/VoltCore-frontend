"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import api from "@/app/lib/api"
import type { TransactionDTO } from "@/app/lib/types"
import {
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
  Search,
  Calendar,
  CreditCard,
  Activity,
  Eye,
  RefreshCw,
  X,
} from "lucide-react"

export default function TransactionsPage() {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])
  const [type, setType] = useState("ALL")
  const [accountId, setAccountId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ((!user || !isAdmin()) && !isLoading) {
      router.push("/login")
      return
    }
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        let response
        if (type && type !== "ALL") {
          response = await api.get<TransactionDTO[]>(`/transactions/type/${type}`)
        } else if (startDate && endDate) {
          response = await api.get<TransactionDTO[]>(
            `/transactions/date-range?startDate=${startDate}&endDate=${endDate}`,
          )
        } else if (accountId) {
          response = await api.get<TransactionDTO[]>(`/transactions/account/${accountId}`)
        } else {
          // Use the correct API endpoint
          response = await api.get<TransactionDTO[]>(`/transactions`)
        }

        console.log("Transactions API response:", response.data)
        setTransactions(response.data || [])
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast.error("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [user, isAdmin, isLoading, router, type, accountId, startDate, endDate])

  const clearFilters = () => {
    setType("ALL")
    setAccountId("")
    setStartDate("")
    setEndDate("")
  }

  const hasActiveFilters = type !== "ALL" || accountId || startDate || endDate

  const getTransactionIcon = (transactionType: string) => {
    switch (transactionType) {
      case "CREDIT":
      case "DEPOSIT":
      case "INTEREST":
        return <ArrowUpRight className="h-4 w-4" />
      case "DEBIT":
      case "WITHDRAWAL":
        return <ArrowDownRight className="h-4 w-4" />
      default:
        return <RefreshCw className="h-4 w-4" />
    }
  }

  const getTransactionColor = (transactionType: string) => {
    switch (transactionType) {
      case "CREDIT":
      case "DEPOSIT":
      case "INTEREST":
        return "text-green-600 bg-green-100"
      case "DEBIT":
      case "WITHDRAWAL":
        return "text-red-600 bg-red-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  const getAmountColor = (transactionType: string) => {
    switch (transactionType) {
      case "CREDIT":
      case "DEPOSIT":
      case "INTEREST":
        return "text-green-600"
      case "DEBIT":
      case "WITHDRAWAL":
        return "text-red-600"
      default:
        return "text-slate-900"
    }
  }

  const getAmountPrefix = (transactionType: string) => {
    switch (transactionType) {
      case "CREDIT":
      case "DEPOSIT":
      case "INTEREST":
        return "+"
      case "DEBIT":
      case "WITHDRAWAL":
        return "-"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-slate-600 text-lg">Manage and monitor all financial transactions</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/transactions/new")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Transaction
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                  Active
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-700 font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-500" />
                  Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger
                    id="type"
                    className="h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  >
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                    <SelectItem value="DEBIT">Debit</SelectItem>
                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="INTEREST">Interest</SelectItem>
                    <SelectItem value="REVERSAL">Reversal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountId" className="text-slate-700 font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-500" />
                  Account ID
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="accountId"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Search by Account ID"
                    className="h-10 pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-700 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="h-10 w-full border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                All Transactions
                <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700">
                  {transactions.length} total
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="hover:bg-slate-50 border-slate-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                  Loading transactions...
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-sm mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results."
                    : "No transactions have been created yet."}
                </p>
                <Button
                  onClick={() => router.push("/dashboard/transactions/new")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Transaction
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Transaction</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Account</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getTransactionColor(transaction.transactionType)}`}>
                              {getTransactionIcon(transaction.transactionType)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">#{transaction.id}</p>
                              <p className="text-sm text-slate-500">Transaction ID</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm text-slate-700">{transaction.accountId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className={`${getTransactionColor(transaction.transactionType)} border-0`}
                          >
                            {transaction.transactionType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-bold text-lg ${getAmountColor(transaction.transactionType)}`}>
                            {getAmountPrefix(transaction.transactionType)}${transaction.amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700">
                            {new Date(transaction.transactionDate || "").toLocaleDateString()}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(transaction.transactionDate || "").toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700 max-w-xs truncate" title={transaction.description}>
                            {transaction.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
