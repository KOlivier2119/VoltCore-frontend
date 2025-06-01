'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { AccountDTO, TransactionDTO } from '../../lib/types';
import { DataTable } from '../../components/DataTable';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [userCount, setUserCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (isAdmin()) {
          const accountsRes = await api.get<AccountDTO[]>('/accounts/status/ACTIVE');
          setAccounts(accountsRes.data);
          const usersRes = await api.get('/users');
          setUserCount(usersRes.data.length);
        } else {
          // Fetch user-specific accounts (mocked by username-based query if needed)
          const accountRes = await api.get<AccountDTO>(`/accounts/${user.username}-account`); // Adjust based on backend
          setAccounts([accountRes.data]);
        }
        // Fetch recent transactions (mocked for first account)
        if (accounts.length > 0) {
          const transRes = await api.get<TransactionDTO[]>(`/transactions/account/${accounts[0].id}`);
          setTransactions(transRes.data.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard');
      }
    };
    fetchData();
  }, [user, isAdmin, router, accounts]);

  const accountColumns: { key: keyof AccountDTO; label: string }[] = [
    { key: 'accountNumber', label: 'Account Number' },
    { key: 'accountHolderName', label: 'Holder' },
    { key: 'balance', label: 'Balance' },
    { key: 'status', label: 'Status' },
  ];

  const transactionColumns: { key: keyof TransactionDTO; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'transactionType', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'transactionDate', label: 'Date' },
  ];

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {isAdmin() ? (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold">Total Accounts</h2>
            <p>{accounts.length}</p>
          </div>
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p>{userCount}</p>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Welcome, {user.username}</h2>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2">Your Accounts</h2>
      <DataTable
        columns={accountColumns}
        data={accounts}
        renderActions={(account) => (
          <Link href={`/accounts/${account.accountNumber}`} className="text-blue-500">View</Link>
        )}
      />
      <h2 className="text-xl font-semibold mt-4 mb-2">Recent Transactions</h2>
      <DataTable columns={transactionColumns} data={transactions} />
    </div>
  );
}