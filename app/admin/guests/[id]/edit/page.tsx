import type { Metadata } from 'next';
import Link from 'next/link';
import EditGuestClient from '@/components/admin/EditGuestClient';

export const metadata: Metadata = { title: 'Edit Tamu' };

export default function EditGuestPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/guests" className="hover:text-gray-800 transition">
          Daftar Tamu
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Edit Tamu</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Edit Data Tamu</h1>
          <p className="text-sm text-gray-500 mt-1">
            Perubahan akan langsung tersimpan ke database.
          </p>
        </div>
        <div className="p-6">
          <EditGuestClient guestId={params.id} />
        </div>
      </div>
    </div>
  );
}
