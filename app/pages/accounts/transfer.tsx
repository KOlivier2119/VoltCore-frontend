'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  paymentMethod: string;
}

export default function TransferPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push('/login');
    return null;
  }

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/accounts/transfer', data.amount, {
        params: {
          fromAccountNumber: data.fromAccountNumber,
          toAccountNumber: data.toAccountNumber,
          paymentMethod: data.paymentMethod,
        },
      });
      toast('Transfer successful');
      router.push('/accounts');
    } catch {
      toast('Transfer failed: Invalid request');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transfer Money</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fromAccountNumber">From Account</Label>
          <Input id="fromAccountNumber" {...register('fromAccountNumber', { required: true })} />
        </div>
        <div>
          <Label htmlFor="toAccountNumber">To Account</Label>
          <Input id="toAccountNumber" {...register('toAccountNumber', { required: true })} />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" {...register('amount', { required: true, min: 0 })} />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <select id="paymentMethod" {...register('paymentMethod', { required: true })} className="w-full p-2 border rounded">
            <option value="PAYPAL">PayPal</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
        <Button type="submit">Transfer</Button>
      </form>
    </div>
  );
}