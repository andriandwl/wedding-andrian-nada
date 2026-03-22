'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface Rsvp {
  attending:   boolean | null;
  pax:         number  | null;
  note:        string  | null;
  respondedAt: string  | null;
}

interface Guest {
  _id:            string;
  name:           string;
  phone:          string;
  invitationCode: string;
  category:       'Akad' | 'Resepsi' | 'Both';
  maxPax:         number;
  status:         'INVITED' | 'CONFIRMED' | 'DECLINED';
  rsvp:           Rsvp;
  createdAt:      string;
}

interface Summary {
  totalGuests: number;
  totalHadir:  number;
  totalTidak:  number;
  totalPax:    number;
}

interface Pagination {
  page:  number;
  limit: number;
  total: number;
  pages: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  INVITED:   'bg-yellow-100 text-yellow-800 border border-yellow-200',
  CONFIRMED: 'bg-green-100  text-green-800  border border-green-200',
  DECLINED:  'bg-red-100    text-red-800    border border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  INVITED:   'Menunggu',
  CONFIRMED: 'Hadir',
  DECLINED:  'Tidak Hadir',
};

const CATEGORY_STYLES: Record<string, string> = {
  Akad:    'bg-purple-50 text-purple-700',
  Resepsi: 'bg-blue-50   text-blue-700',
  Both:    'bg-teal-50   text-teal-700',
};

// ── Component ──────────────────────────────────────────────────────────────
export default function GuestListClient() {
  const [guests,   setGuests]   = useState<Guest[]>([]);
  const [summary,  setSummary]  = useState<Summary>({ totalGuests: 0, totalHadir: 0, totalTidak: 0, totalPax: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 1 });

  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [category, setCategory] = useState('');
  const [page,     setPage]     = useState(1);

  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [copied,   setCopied]   = useState<string | null>(null);

  // Debounce search
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  // ── Fetch data ─────────────────────────────────────────────────────────
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({
        page:  String(page),
        limit: '20',
      });
      if (search)   p.set('search',   search);
      if (status)   p.set('status',   status);
      if (category) p.set('category', category);

      const res  = await fetch(`/api/admin/guests?${p.toString()}`);
      const json = await res.json();

      if (json.ok) {
        setGuests(json.data.guests);
        setSummary(json.data.summary);
        setPagination(json.data.pagination);
      } else {
        showToast(json.error?.message ?? 'Gagal memuat data', 'error');
      }
    } catch {
      showToast('Koneksi gagal', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  // Debounce search input
  function handleSearchChange(val: string) {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 350);
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  async function deleteGuest(id: string, name: string) {
    if (!confirm(`Hapus tamu "${name}"?\nTindakan ini tidak dapat dibatalkan.`)) return;

    setDeleting(id);
    try {
      const res  = await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.ok) {
        showToast(`Tamu "${name}" berhasil dihapus`, 'success');
        fetchGuests();
      } else {
        showToast(json.error?.message ?? 'Gagal menghapus', 'error');
      }
    } catch {
      showToast('Koneksi gagal', 'error');
    } finally {
      setDeleting(null);
    }
  }

  // ── Copy invite link ───────────────────────────────────────────────────
  function copyInviteLink(code: string) {
    const url = `${window.location.origin}/invitation/${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  // ── Toast helper ───────────────────────────────────────────────────────
  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'}`}
        >
          {toast.type === 'success' ? '✅' : '❌'}
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Tamu</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola tamu undangan dan pantau status RSVP
          </p>
        </div>
        <Link
          href="/admin/guests/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition"
        >
          <span>+</span> Tambah Tamu
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon="👥"
          label="Total Tamu"
          value={summary.totalGuests}
          color="bg-blue-50 border-blue-100"
          textColor="text-blue-700"
        />
        <SummaryCard
          icon="✅"
          label="Hadir"
          value={summary.totalHadir}
          color="bg-green-50 border-green-100"
          textColor="text-green-700"
        />
        <SummaryCard
          icon="❌"
          label="Tidak Hadir"
          value={summary.totalTidak}
          color="bg-red-50 border-red-100"
          textColor="text-red-700"
        />
        <SummaryCard
          icon="🪑"
          label="Total Pax"
          value={summary.totalPax}
          color="bg-purple-50 border-purple-100"
          textColor="text-purple-700"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Cari nama, nomor telepon, atau kode undangan..."
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition bg-white"
          >
            <option value="">Semua Status</option>
            <option value="INVITED">Menunggu</option>
            <option value="CONFIRMED">Hadir</option>
            <option value="DECLINED">Tidak Hadir</option>
          </select>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition bg-white"
          >
            <option value="">Semua Kategori</option>
            <option value="Akad">Akad</option>
            <option value="Resepsi">Resepsi</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Kategori</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Max Pax</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Hadir</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Pax</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Tgl RSVP</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-gray-500 font-medium">
                      {search || status || category
                        ? 'Tidak ada tamu yang sesuai filter'
                        : 'Belum ada tamu. Tambahkan tamu pertama!'}
                    </p>
                    {!search && !status && !category && (
                      <Link
                        href="/admin/guests/new"
                        className="inline-block mt-4 text-sm text-gray-900 font-medium underline underline-offset-2"
                      >
                        Tambah tamu sekarang →
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                guests.map((g) => (
                  <tr
                    key={g._id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    {/* Name + code */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{g.name}</p>
                      {g.phone && (
                        <p className="text-xs text-gray-400 mt-0.5">{g.phone}</p>
                      )}
                      <p className="text-xs text-gray-300 font-mono mt-0.5">
                        #{g.invitationCode}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${CATEGORY_STYLES[g.category]}`}>
                        {g.category}
                      </span>
                    </td>

                    {/* Max pax */}
                    <td className="px-5 py-4 hidden lg:table-cell text-gray-600">
                      {g.maxPax}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[g.status]}`}>
                        {STATUS_LABELS[g.status]}
                      </span>
                    </td>

                    {/* Attending */}
                    <td className="px-5 py-4 hidden md:table-cell text-center text-base">
                      {g.rsvp.attending === null ? (
                        <span className="text-gray-300">—</span>
                      ) : g.rsvp.attending ? '✅' : '❌'}
                    </td>

                    {/* Pax confirmed */}
                    <td className="px-5 py-4 hidden lg:table-cell text-gray-600">
                      {g.rsvp.pax ?? '—'}
                    </td>

                    {/* Responded at */}
                    <td className="px-5 py-4 hidden xl:table-cell text-gray-400 text-xs">
                      {g.rsvp.respondedAt
                        ? new Date(g.rsvp.respondedAt).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Copy link */}
                        <button
                          onClick={() => copyInviteLink(g.invitationCode)}
                          title="Copy link undangan"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition text-xs"
                        >
                          {copied === g.invitationCode ? '✅' : '🔗'}
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/admin/guests/${g._id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition text-xs font-medium"
                        >
                          Edit
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => deleteGuest(g._id, g.name)}
                          disabled={deleting === g._id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition text-xs font-medium disabled:opacity-50"
                        >
                          {deleting === g._id ? '...' : 'Hapus'}
                        </button>
                      </div>

                      {/* Always visible on mobile */}
                      <div className="flex items-center justify-end gap-1 sm:hidden">
                        <Link
                          href={`/admin/guests/${g._id}/edit`}
                          className="text-xs text-blue-600 underline"
                        >
                          Edit
                        </Link>
                        <span className="text-gray-300">·</span>
                        <button
                          onClick={() => deleteGuest(g._id, g.name)}
                          className="text-xs text-red-500 underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              {pagination.total} tamu &bull; halaman {pagination.page} dari {pagination.pages}
            </span>
            <div className="flex items-center gap-1">
              <PaginationButton
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </PaginationButton>
              <PaginationButton
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                ‹
              </PaginationButton>
              {/* Page numbers */}
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, pagination.pages - 4)) + i;
                return (
                  <PaginationButton
                    key={p}
                    onClick={() => setPage(p)}
                    active={p === page}
                  >
                    {p}
                  </PaginationButton>
                );
              })}
              <PaginationButton
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.pages}
              >
                ›
              </PaginationButton>
              <PaginationButton
                onClick={() => setPage(pagination.pages)}
                disabled={page === pagination.pages}
              >
                »
              </PaginationButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({
  icon, label, value, color, textColor,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  textColor: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className={`text-xs font-medium ${textColor} opacity-75`}>{label}</span>
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>{value.toLocaleString('id-ID')}</p>
    </div>
  );
}

function PaginationButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition
        ${active
          ? 'bg-gray-900 text-white'
          : 'hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed'
        }`}
    >
      {children}
    </button>
  );
}
