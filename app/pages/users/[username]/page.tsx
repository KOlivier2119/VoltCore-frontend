'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { UserDTO } from '../../../lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';

interface FormData {
  email: string;
  password?: string;
  role: string;
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { user, isLoading, isAdmin } = useAuth();
  const [profile, setProfile] = useState<UserDTO | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login');
      return;
    }
    if (!isAdmin() && user && user.username !== username) {
      router.push(`/users/${user.username}`);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<UserDTO>(`/users/${username}`);
        setProfile(response.data);
        reset(response.data);
      } catch {
        toast.error('User not found');
        router.push('/accounts');
      }
    };
    fetchUser();
  }, [username, user, isAdmin, isLoading, router, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/users/${username}`, data);
      toast('Profile updated');
      router.refresh();
    } catch {
      toast.error('Update failed\nInvalid request');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Profile: {profile.username}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} />
        </div>
        <div>
          <Label htmlFor="password">New Password (optional)</Label>
          <Input id="password" type="password" {...register('password')} />
        </div>
        {isAdmin() && (
          <div>
            <Label htmlFor="role">Role</Label>
            <select id="role" {...register('role', { required: true })} className="w-full p-2 border rounded">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}