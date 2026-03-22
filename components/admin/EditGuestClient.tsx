'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GuestForm from './GuestForm';

interface GuestData {
  _id:      string;
  name:     string;
  phone:    string;
  category: 'Akad' | 'Resepsi' | 'Both';
  maxPax:   number;
  status:   string;
  invitationCode: string;
  rsvp: {
    attending:   boolean | null;
    pax:         number  | null;
    note:        string  | null;
    respondedAt: string  | null;
  };
}

export default function EditGuestClient({ guestId }: { guestId: string }) {
  const router = useRouter();
  const [guest,   setGuest]   = useState<GuestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/admin/guests/${guestId}`);
        const json = await res.json();

        if (json.ok) {
          setGuest(json.data);
        } else {
          setError(json.error?.message ?? 'Tamu tidak ditemukan');
        }
      } catch {
        setError('Gagal memuat data tamu');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [guestId]);

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────
  if (error || !guest) {
    return (
      <div className="text-center py-10">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-gray-600 font-medium">{error || 'Tamu tidak ditemukan'}</p>
        <button
          onClick={() => router.push('/admin/guests')}
          className="mt-4 text-sm text-gray-500 underline"
        >
          Kembali ke daftar tamu
        </button>
      </div>
    );
  }

  // ── RSVP info banner (show if already responded) ─────────────────────
  const hasRsvp = guest.rsvp.attending !== null;

  return (
    <div className="space-y-5">
      {/* Guest meta info */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Kode Undangan</p>
          <p className="font-mono font-semibold text-gray-800">{guest.invitationCode}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Status</p>
          <p className="font-semibold text-gray-800">{guest.status}</p>
        </div>
        {hasRsvp && (
          <>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Kehadiran</p>
              <p className="font-semibold text-gray-800">
                {guest.rsvp.attending ? `✅ Hadir (${guest.rsvp.pax} pax)` : '❌ Tidak Hadir'}
              </p>
            </div>
            {guest.rsvp.note && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Pesan</p>
                <p className="text-gray-700 italic">"{guest.rsvp.note}"</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Copy invite link button */}
      <button
        type="button"
        onClick={() => {
          const url = `${window.location.origin}/invitation/${guest.invitationCode}`;
          navigator.clipboard.writeText(url);
        }}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition"
      >
        🔗 Copy link undangan
      </button>

      {/* The form itself */}
      <GuestForm
        initialData={{
          name:     guest.name,
          phone:    guest.phone,
          category: guest.category,
          maxPax:   guest.maxPax,
        }}
        guestId={guestId}
      />
    </div>
  );
}
