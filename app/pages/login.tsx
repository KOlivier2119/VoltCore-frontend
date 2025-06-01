'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/accounts');
    return null;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      toast('Login successful');
      router.push('/accounts');
    } catch {
      toast.error('Login failed: Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register('username', { required: true })} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password', { required: true })} />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}