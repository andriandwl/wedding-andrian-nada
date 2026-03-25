import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Selamat datang di panel admin pernikahan
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/invitation"
          className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-rose-300 hover:shadow-md transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-rose-100 transition">
            <span className="text-xl">💌</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Pengaturan Undangan</h3>
          <p className="text-sm text-gray-500">Ubah nama, tanggal, lokasi, dan detail acara</p>
        </Link>

        <Link
          href="/admin/guests"
          className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-rose-300 hover:shadow-md transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
            <span className="text-xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Daftar Tamu</h3>
          <p className="text-sm text-gray-500">Kelola tamu undangan dan pantau status RSVP</p>
        </Link>
      </div>
    </div>
  );
}
