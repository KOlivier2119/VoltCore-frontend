"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (!user && !isLoading) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
            <p className="text-gray-600">Update your profile information, change your password, and manage your preferences.</p>
            <Button variant="outline" className="mt-2">Edit Profile</Button>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <p className="text-gray-600">Customize your notification preferences and alerts.</p>
            <Button variant="outline" className="mt-2">Manage Notifications</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 