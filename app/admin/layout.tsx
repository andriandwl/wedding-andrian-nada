import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader userEmail={session.user.email} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
