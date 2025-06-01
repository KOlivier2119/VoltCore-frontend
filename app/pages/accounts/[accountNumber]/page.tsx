'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { AccountDTO, TransactionDTO } from '../../../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

interface FormData {
  amount: number;
  paymentMethod: string;
}

export default function AccountDetailsPage({ params }: { params: { accountNumber: string } }) {
  const { accountNumber } = params;
  const { register, handleSubmit } = useForm<FormData>();
  const { isAdmin } = useAuth();
  const [account, setAccount] = useState<AccountDTO | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await api.get<AccountDTO>(`/accounts/${accountNumber}`);
        setAccount(response.data);
      } catch {
        toast.error('Account not found');
        router.push('/accounts');
      }
    };
    fetchAccount();
  }, [accountNumber, router]);

  const handleDeposit = async (data: FormData) => {
    try {
      await api.post<TransactionDTO>(`/accounts/${accountNumber}/deposit?paymentMethod=${data.paymentMethod}`, data.amount);
      toast.success('Deposit successful');
      router.refresh();
    } catch {
      toast.error('Deposit failed: Invalid request');
    }
  };

  const handleWithdraw = async (data: FormData) => {
    try {
      await api.post<TransactionDTO>(`/accounts/${accountNumber}/withdraw?paymentMethod=${data.paymentMethod}`, data.amount);
      toast.success('Withdrawal successful');
      router.refresh();
    } catch {
      toast.error('Withdrawal failed: Invalid request');
    }
  };

  const handleClose = async () => {
    try {
      await api.post(`/accounts/${accountNumber}/close`);
      toast.success('Account closed');
      router.push('/accounts');
    } catch {
      toast.error('Close failed: Invalid request');
    }
  };

  const handleApplyInterest = async () => {
    try {
      await api.post(`/accounts/${accountNumber}/apply-interest`);
      toast.success('Interest applied');
      router.refresh();
    } catch {
      toast.error('Interest application failed: Invalid request');
    }
  };

  if (!account) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account: {account.accountNumber}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>Holder: {account.accountHolderName}</div>
        <div>Balance: ${account.balance}</div>
        <div>Type: {account.accountType}</div>
        <div>Status: {account.status}</div>
        <div>Email: {account.email}</div>
        <div>Interest Rate: {account.interestRate}%</div>
      </div>
      <Link href={`/accounts/${accountNumber}/transactions`} className="text-blue-500">View Transactions</Link>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <form onSubmit={handleSubmit(handleDeposit)} className="space-y-4">
          <h2 className="text-xl font-semibold">Deposit</h2>
          <div>
            <Label htmlFor="deposit-amount">Amount</Label>
            <Input id="deposit-amount" type="number" {...register('amount', { required: true, min: 0 })} />
          </div>
          <div>
            <Label htmlFor="deposit-method">Payment Method</Label>
            <select id="deposit-method" {...register('paymentMethod', { required: true })} className="w-full p-2 border rounded">
              <option value="PAYPAL">PayPal</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          <Button type="submit">Deposit</Button>
        </form>
        <form onSubmit={handleSubmit(handleWithdraw)} className="space-y-4">
          <h2 className="text-xl font-semibold">Withdraw</h2>
          <div>
            <Label htmlFor="withdraw-amount">Amount</Label>
            <Input id="withdraw-amount" type="number" {...register('amount', { required: true, min: 0 })} />
          </div>
          <div>
            <Label htmlFor="withdraw-method">Payment Method</Label>
            <select id="withdraw-method" {...register('paymentMethod', { required: true })} className="w-full p-2 border rounded">
              <option value="PAYPAL">PayPal</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          <Button type="submit">Withdraw</Button>
        </form>
      </div>
      {isAdmin() && (
        <div className="mt-4 space-x-2">
          <Button onClick={handleClose}>Close Account</Button>
          <Button onClick={handleApplyInterest}>Apply Interest</Button>
        </div>
      )}
    </div>
  );
}