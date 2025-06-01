'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { TransactionDTO } from '../../../lib/types';
import { DataTable } from '../../../components/DataTable';
import { toast } from "sonner";
import Link from 'next/link';

export default function TransactionHistoryPage({ params }: { params: { accountNumber: string } }) {
  const { accountNumber } = params;
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accountRes = await api.get(`/accounts/${accountNumber}`);
        const response = await api.get<TransactionDTO[]>(`/transactions/account/${accountRes.data.id}`);
        setTransactions(response.data);
      } catch {
        toast.error('Failed to load transactions');
      }
    };
    fetchTransactions();
  }, [accountNumber]);

  const columns: { key: keyof TransactionDTO; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'transactionType', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'transactionDate', label: 'Date' },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transaction History for Account {accountNumber}</h1>
      <DataTable
        columns={columns}
        data={transactions}
        renderActions={(transaction) => (
          <Link href={`/transactions/${transaction.id}`} className="text-blue-500">View</Link>
        )}
      />
    </div>
  );
}