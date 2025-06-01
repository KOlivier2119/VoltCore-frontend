'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface RegisterForm {
  username: string;
  password: string;
  email: string;
  role: string;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post('/users/register', data);
      toast('Registration successful');
      router.push('/login');
    } catch {
      toast.error('Registration failed: Username may already exist');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register('username', { required: true })} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password', { required: true })} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <select id="role" {...register('role', { required: true })} className="w-full p-2 border rounded">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}