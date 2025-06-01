'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../../components/ui/button';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">VoltCore Bank</Link>
        {user && (
          <div className="space-x-4">
            <Link href="/accounts">Accounts</Link>
            {isAdmin() && (
              <>
                <Link href="/accounts/create">Create Account</Link>
                <Link href="/accounts/list">List Accounts</Link>
                <Link href="/users/list">List Users</Link>
              </>
            )}
            <Link href={`/users/${user.username}`}>Profile</Link>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        )}
      </div>
    </nav>
  );
}