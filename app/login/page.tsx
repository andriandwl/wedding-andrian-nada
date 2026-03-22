import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Login Admin' };

export default async function LoginPage() {
  // Already logged in → go to dashboard
  const session = await getSession();
  if (session?.user) redirect('/admin/guests');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 text-white text-2xl mb-4 shadow-lg">
            💍
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Wedding Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk ke panel manajemen</p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-gray-400 mt-6">
          Wedding Guest Management System
        </p>
      </div>
    </main>
  );
}
