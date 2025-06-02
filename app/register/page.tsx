"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <Image
              src="/logo.svg"
              alt="VoltCore Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your VoltCore account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join thousands of users managing their finances with VoltCore
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
