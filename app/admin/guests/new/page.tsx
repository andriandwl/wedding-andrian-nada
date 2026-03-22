import type { Metadata } from 'next';
import Link from 'next/link';
import GuestForm from '@/components/admin/GuestForm';

export const metadata: Metadata = { title: 'Tambah Tamu' };

export default function NewGuestPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/guests" className="hover:text-gray-800 transition">
          Daftar Tamu
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Tambah Tamu</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-900">Tambah Tamu Baru</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kode undangan unik akan dibuat otomatis.
          </p>
        </div>
        <div className="p-6">
          <GuestForm />
        </div>
      </div>
    </div>
  );
}
