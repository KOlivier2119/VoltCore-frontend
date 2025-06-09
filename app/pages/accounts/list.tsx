'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { AccountDTO } from '../../lib/types';
import { DataTable } from '../../components/DataTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AccountListPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; accountNumber: string | null }>({ open: false, accountNumber: null });
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if ((!user || !isAdmin()) && !isLoading) {
      router.push('/login');
      return;
    }

    const fetchAccounts = async () => {
      try {
        let response;
        if (status) {
          response = await api.get<AccountDTO[]>(`/accounts/status/${status}`);
        } else {
          response = await api.get<AccountDTO[]>('/accounts');
        }
        setAccounts(response.data);
      } catch {
          toast.error('Failed to load accounts');
        }
    };
    fetchAccounts();
  }, [user, isAdmin, isLoading, router, status]);

  const handleDelete = async () => {
    if (!deleteDialog.accountNumber) return;
    try {
      await api.delete(`/accounts/${deleteDialog.accountNumber}`);
      setAccounts(accounts.filter((a) => a.accountNumber !== deleteDialog.accountNumber));
      toast('Account deleted');
    } catch {
      toast.error('Deletion failed: Invalid request');
    }
  };

  const columns: { key: keyof AccountDTO; label: string }[] = [
    { key: 'accountNumber', label: 'Account Number' },
    { key: 'accountHolderName', label: 'Holder' },
    { key: 'email', label: 'Email' },
    { key: 'balance', label: 'Balance' },
    { key: 'accountType', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'interestRate', label: 'Interest Rate' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Account List</h1>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="FROZEN">Frozen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={accounts}
        renderActions={(account) => (
          <div className="space-x-2">
            <Link href={`/accounts/${account.accountNumber}`} className="text-blue-500">View</Link>
            <Link href={`/accounts/${account.accountNumber}/edit`} className="text-blue-500">Edit</Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialog({ open: true, accountNumber: account.accountNumber ?? null })}
            >
              Delete
            </Button>
          </div>
        )}
      />
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete Account"
        description="Are you sure you want to delete this account? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}