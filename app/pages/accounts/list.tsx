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

export default function AccountListPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; accountNumber: string | null }>({ open: false, accountNumber: null });
  const router = useRouter();

  useEffect(() => {
    if ((!user || !isAdmin()) && !isLoading) {
      router.push('/login');
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await api.get<AccountDTO[]>('/accounts/status/ACTIVE');
        setAccounts(response.data);
      } catch {
          toast.error('Failed to load accounts');
        }
    };
    fetchAccounts();
  }, [user, isAdmin, isLoading, router]);

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
    { key: 'balance', label: 'Balance' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account List</h1>
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