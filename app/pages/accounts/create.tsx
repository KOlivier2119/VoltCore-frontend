'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { AccountDTO } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  accountHolderName: string;
  accountType: string;
  email: string;
  interestRate: number;
}

export default function CreateAccountPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const { isAdmin } = useAuth();
  // toast is now imported directly, not from useToast

  if (!isAdmin()) {
    router.push('/accounts');
    return null;
  }

  const onSubmit = async (data: FormData) => {
    try {
      await api.post<AccountDTO>('/accounts', data);
      toast('Account created');
      router.push('/accounts/list');
    } catch {
      toast('Creation failed: Invalid request');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="accountHolderName">Account Holder Name</Label>
          <Input id="accountHolderName" {...register('accountHolderName', { required: true })} />
        </div>
        <div>
          <Label htmlFor="accountType">Account Type</Label>
          <select id="accountType" {...register('accountType', { required: true })} className="w-full p-2 border rounded">
            <option value="SAVINGS">Savings</option>
            <option value="CHECKING">Checking</option>
          </select>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input id="interestRate" type="number" step="0.01" {...register('interestRate', { required: true, min: 0 })} />
        </div>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}