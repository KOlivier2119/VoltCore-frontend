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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  amount: number;
  paymentMethod: string;
}

export default function AccountDetailsPage({ params }: { params: { accountNumber: string } }) {
  const { accountNumber } = params;
  const { register, handleSubmit } = useForm<FormData>();
  const { isAdmin } = useAuth();
  const [account, setAccount] = useState<AccountDTO | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
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
    setActionLoading(true);
    try {
      await api.post<TransactionDTO>(`/accounts/${accountNumber}/deposit?paymentMethod=${paymentMethod}`, data.amount);
      toast.success('Deposit successful');
      router.refresh();
    } catch {
      toast.error('Deposit failed: Invalid request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (data: FormData) => {
    setActionLoading(true);
    try {
      await api.post<TransactionDTO>(`/accounts/${accountNumber}/withdraw?paymentMethod=${paymentMethod}`, data.amount);
      toast.success('Withdrawal successful');
      router.refresh();
    } catch {
      toast.error('Withdrawal failed: Invalid request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    setActionLoading(true);
    try {
      await api.post(`/accounts/${accountNumber}/close`);
      toast.success('Account closed');
      router.push('/accounts');
    } catch {
      toast.error('Close failed: Invalid request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyInterest = async () => {
    setActionLoading(true);
    try {
      await api.post(`/accounts/${accountNumber}/apply-interest`);
      toast.success('Interest applied');
      router.refresh();
    } catch {
      toast.error('Interest application failed: Invalid request');
    } finally {
      setActionLoading(false);
    }
  };

  if (!account) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">Account Number</p>
            <p className="font-semibold text-gray-900">{account.accountNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Holder</p>
            <p className="font-semibold text-gray-900">{account.accountHolderName}</p>
          </div>
    <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">{account.email}</p>
      </div>
          <div>
            <p className="text-gray-600">Type</p>
            <p className="font-semibold text-gray-900">{account.accountType}</p>
          </div>
          <div>
            <p className="text-gray-600">Balance</p>
            <p className="font-semibold text-gray-900">${account.balance?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-semibold text-gray-900">{account.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Interest Rate</p>
            <p className="font-semibold text-gray-900">{account.interestRate ?? '-'}%</p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap mb-4">
          <Button variant="outline" onClick={handleApplyInterest} disabled={actionLoading}>Apply Interest</Button>
          <Button variant="outline" onClick={handleClose} disabled={actionLoading}>Close Account</Button>
          <Button variant="outline" onClick={() => router.push(`/accounts/${accountNumber}/edit`)}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit(handleDeposit)} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Deposit</h2>
            <Label htmlFor="depositAmount">Amount</Label>
            <Input id="depositAmount" type="number" step="0.01" {...register('amount', { required: true, min: 0.01 })} />
            <Label htmlFor="depositPaymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
              <SelectTrigger id="depositPaymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="PAYPAL">PayPal</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={actionLoading}>Deposit</Button>
          </form>
          <form onSubmit={handleSubmit(handleWithdraw)} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Withdraw</h2>
            <Label htmlFor="withdrawAmount">Amount</Label>
            <Input id="withdrawAmount" type="number" step="0.01" {...register('amount', { required: true, min: 0.01 })} />
            <Label htmlFor="withdrawPaymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
              <SelectTrigger id="withdrawPaymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="PAYPAL">PayPal</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={actionLoading}>Withdraw</Button>
        </form>
        </div>
      </div>
    </div>
  );
}