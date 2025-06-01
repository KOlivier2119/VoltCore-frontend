'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { TransactionDTO } from '../../../lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';

export default function TransactionDetailsPage({ params }: { params: { transactionId: string } }) {
  const { transactionId } = params;
  const [transaction, setTransaction] = useState<TransactionDTO | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [reverseDialog, setReverseDialog] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await api.get<TransactionDTO>(`/transactions/${transactionId}`);
        setTransaction(response.data);
      } catch {
        toast.error('Transaction not found');
        router.push('/accounts');
      }
    };
    fetchTransaction();
  }, [transactionId, router]);

  const handleReverse = async () => {
    try {
      await api.post(`/transactions/${transactionId}/reverse`);
      toast('Transaction reversed');
      router.refresh();
    } catch {
      toast.error('Reversal failed: Invalid request');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/transactions/${transactionId}`);
      toast('Transaction deleted');
      router.push('/accounts');
    } catch {
      toast.error('Deletion failed: Invalid request');
    }
  };

  if (!transaction) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transaction {transaction.id}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>Type: {transaction.transactionType}</div>
        <div>Amount: ${transaction.amount}</div>
        <div>Date: {transaction.transactionDate}</div>
        <div>Description: {transaction.description}</div>
        <div>Payment Method: {transaction.paymentMethod}</div>
        <div>Related Transaction: {transaction.relatedTransactionId || 'None'}</div>
      </div>
      {isAdmin() && (
        <div className="space-x-2">
          <Button onClick={() => setReverseDialog(true)}>Reverse</Button>
          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>Delete</Button>
        </div>
      )}
      <ConfirmationDialog
        open={reverseDialog}
        onOpenChange={setReverseDialog}
        title="Reverse Transaction"
        description="Are you sure you want to reverse this transaction?"
        onConfirm={handleReverse}
      />
      <ConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}