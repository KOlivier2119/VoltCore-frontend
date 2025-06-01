'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { AccountDTO } from '../../../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';

interface FormData {
  accountHolderName: string;
  email: string;
  interestRate: number;
}

export default function EditAccountPage({ params }: { params: { accountNumber: string } }) {
  const { accountNumber } = params;
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { isAdmin } = useAuth();
  const [account, setAccount] = useState<AccountDTO | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/accounts');
      return;
    }

    const fetchAccount = async () => {
      try {
        const response = await api.get<AccountDTO>(`/accounts/${accountNumber}`);
        setAccount(response.data);
        reset({
          accountHolderName: response.data.accountHolderName,
          email: response.data.email,
          interestRate: response.data.interestRate || 0,
        });
      } catch {
        toast.error('Account not found');
        router.push('/accounts/list');
      }
    };
    fetchAccount();
  }, [accountNumber, isAdmin, router, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/accounts/${accountNumber}`, data);
      toast.success('Account updated');
      router.push('/accounts/list');
    } catch {
      toast.error('Update failed: Invalid request');
    }
  };

  if (!account) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Account: {accountNumber}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="accountHolderName">Account Holder Name</Label>
          <Input id="accountHolderName" {...register('accountHolderName', { required: true })} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input id="interestRate" type="number" step="0.01" {...register('interestRate', { required: true, min: 0 })} />
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}