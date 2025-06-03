'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { UserDTO } from '../../lib/types';
import { DataTable } from '../../components/DataTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import Link from 'next/link';

export default function UserListPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; username: string | null }>({ open: false, username: null });
  const router = useRouter();

  useEffect(() => {
    if ((!user || !isAdmin()) && !isLoading) {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get<UserDTO[]>('/users');
        setUsers(response.data);
      } catch {
        toast.error('Failed to load users');
      }
    };
    fetchUsers();
  }, [user, isAdmin, isLoading, router]);

  const handleDelete = async () => {
    if (!deleteDialog.username) return;
    try {
      await api.delete(`/users/${deleteDialog.username}`);
      setUsers(users.filter((u) => u.username !== deleteDialog.username));
      toast('User deleted');
    } catch {
      toast.error('Deletion failed: Invalid request');
    }
  };

  const columns: { key: keyof UserDTO; label: string }[] = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <DataTable
        columns={columns}
        data={users}
        renderActions={(user) => (
          <div className="space-x-2">
            <Link href={`/users/${user.username}`} className="text-blue-500">View</Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialog({ open: true, username: user.username })}
            >
              Delete
            </Button>
          </div>
        )}
      />
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}