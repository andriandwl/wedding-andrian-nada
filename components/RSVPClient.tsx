'use client';

import { useState, useEffect, FormEvent } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface GuestInfo {
  _id:    string;
  name:   string;
  category: 'Akad' | 'Resepsi' | 'Both';
  maxPax: number;
  status: 'INVITED' | 'CONFIRMED' | 'DECLINED';
  rsvp: {
    attending:   boolean | null;
    pax:         number  | null;
    note:        string  | null;
    respondedAt: string  | null;
  };
}

type PageState = 'loading' | 'not-found' | 'form' | 'submitting' | 'done' | 'error';

const CATEGORY_LABELS: Record<string, string> = {
  Akad:    'Akad Nikah',
  Resepsi: 'Resepsi',
  Both:    'Akad Nikah & Resepsi',
};

// ── Component ──────────────────────────────────────────────────────────────
export default function RSVPClient({ code }: { code: string }) {
  const [guest,     setGuest]     = useState<GuestInfo | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');

  // Form state
  const [attending, setAttending] = useState<boolean | null>(null);
  const [pax,       setPax]       = useState(1);
  const [note,      setNote]      = useState('');
  const [formError, setFormError] = useState('');

  // Fetch guest info on mount
  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/rsvp/${code}`);
        const json = await res.json();

        if (json.ok) {
          setGuest(json.data);
          // Pre-fill if already responded
          if (json.data.rsvp.attending !== null) {
            setAttending(json.data.rsvp.attending);
            setPax(json.data.rsvp.pax ?? 1);
            setNote(json.data.rsvp.note ?? '');
          }
          setPageState('form');
        } else {
          setPageState('not-found');
        }
      } catch {
        setPageState('error');
      }
    }
    load();
  }, [code]);

  // ── Submit RSVP ─────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    if (attending === null) {
      setFormError('Pilih status kehadiran terlebih dahulu.');
      return;
    }

    if (attending && (pax < 1 || pax > (guest?.maxPax ?? 1))) {
      setFormError(`Jumlah pax harus antara 1 dan ${guest?.maxPax}.`);
      return;
    }

    setPageState('submitting');

    try {
      const res  = await fetch(`/api/rsvp/${code}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attending,
          pax:  attending ? pax : undefined,
          note: note.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (json.ok) {
        setPageState('done');
      } else {
        setFormError(json.error?.message ?? 'Terjadi kesalahan. Coba lagi.');
        setPageState('form');
      }
    } catch {
      setFormError('Koneksi gagal. Periksa jaringan Anda.');
      setPageState('form');
    }
  }

  // ── Render states ───────────────────────────────────────────────────────

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (pageState === 'not-found') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Kode undangan tidak valid atau sudah tidak aktif.
            Pastikan Anda membuka link yang benar.
          </p>
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h1>
          <p className="text-gray-500 text-sm mb-4">Gagal memuat halaman undangan.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-rose-500 underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm animate-in fade-in duration-500">
          {/* Animated heart */}
          <div className="relative inline-block mb-6">
            <div className="text-7xl">💌</div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Terima Kasih!
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            {attending ? (
              <>
                Kami sangat senang <strong>{guest?.name}</strong> dapat hadir!
                Sampai jumpa di hari spesial kami. 🎉
              </>
            ) : (
              <>
                Kami menerima konfirmasi dari <strong>{guest?.name}</strong>.
                Terima kasih atas responnya. Semoga kita bisa berjumpa di lain waktu. 🙏
              </>
            )}
          </p>

          {attending && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm text-rose-700 mb-6">
              <p className="font-semibold mb-1">Detail Kehadiran</p>
              <p>Jumlah tamu: <strong>{pax} orang</strong></p>
              <p className="mt-1 text-xs text-rose-500">
                Silakan tunjukkan halaman ini atau kode <strong>{code}</strong> saat tiba di venue.
              </p>
            </div>
          )}

          <p className="text-xs text-gray-400">
            {CATEGORY_LABELS[guest?.category ?? 'Both']}
          </p>
        </div>
      </div>
    );
  }

  // ── Main RSVP form ──────────────────────────────────────────────────────
  const alreadyResponded = guest?.rsvp.attending !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Decorative top band */}
      <div className="h-1 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-rose-100/50 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 px-8 py-10 text-center text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <p className="text-rose-200 text-xs font-medium tracking-widest uppercase mb-3">
                  Undangan Pernikahan
                </p>
                <div className="text-5xl mb-4">💍</div>
                <h1 className="text-3xl font-bold mb-1">
                  Halo, {guest?.name}!
                </h1>
                <p className="text-rose-200 text-sm">
                  {CATEGORY_LABELS[guest?.category ?? 'Both']}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8">

              {/* Already responded notice */}
              {alreadyResponded && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3">
                  <span className="text-amber-500 shrink-0">ℹ️</span>
                  <div>
                    <p className="text-amber-800 text-sm font-medium">Anda sudah merespons sebelumnya</p>
                    <p className="text-amber-600 text-xs mt-0.5">Anda masih bisa mengubah respons Anda.</p>
                  </div>
                </div>
              )}

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-4 mb-5 flex gap-3">
                  <span className="shrink-0">⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Attendance choice */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Apakah Anda akan hadir?
                    <span className="text-red-400 ml-1">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <AttendButton
                      selected={attending === true}
                      onClick={() => {
                        setAttending(true);
                        setPax(guest?.rsvp.pax ?? 1);
                        setFormError('');
                      }}
                      icon="🎉"
                      label="Hadir"
                      description="Ya, saya akan hadir"
                      activeClass="border-green-500 bg-green-500 text-white shadow-green-200"
                      inactiveClass="border-gray-200 text-gray-600 hover:border-green-300"
                    />
                    <AttendButton
                      selected={attending === false}
                      onClick={() => {
                        setAttending(false);
                        setFormError('');
                      }}
                      icon="😔"
                      label="Tidak Hadir"
                      description="Maaf, tidak bisa hadir"
                      activeClass="border-red-400 bg-red-500 text-white shadow-red-200"
                      inactiveClass="border-gray-200 text-gray-600 hover:border-red-300"
                    />
                  </div>
                </div>

                {/* Pax — only when attending */}
                {attending === true && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Jumlah Tamu
                      <span className="ml-1 text-xs text-gray-400 font-normal">
                        (maks. {guest?.maxPax} orang)
                      </span>
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setPax((p) => Math.max(1, p - 1))}
                        disabled={pax <= 1}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 text-xl font-bold text-gray-600 hover:border-rose-400 hover:text-rose-500 disabled:opacity-30 transition"
                      >
                        −
                      </button>

                      <div className="flex-1 text-center">
                        <span className="text-4xl font-bold text-gray-900">{pax}</span>
                        <p className="text-xs text-gray-400 mt-0.5">orang</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPax((p) => Math.min(guest?.maxPax ?? 1, p + 1))}
                        disabled={pax >= (guest?.maxPax ?? 1)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-gray-200 text-xl font-bold text-gray-600 hover:border-rose-400 hover:text-rose-500 disabled:opacity-30 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Pax dots indicator */}
                    {(guest?.maxPax ?? 1) <= 10 && (
                      <div className="flex justify-center gap-1.5 mt-3">
                        {Array.from({ length: guest?.maxPax ?? 1 }).map((_, i) => (
                          <div
                            key={i}
                            onClick={() => setPax(i + 1)}
                            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition
                              ${i < pax ? 'bg-rose-400' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Note */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pesan untuk Pengantin
                    <span className="ml-1 text-xs text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tulis doa atau pesan untuk pengantin..."
                    maxLength={500}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm
                      placeholder:text-gray-300
                      focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent
                      transition resize-none"
                  />
                  <p className="text-right text-xs text-gray-300 mt-1">{note.length}/500</p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={attending === null || pageState === 'submitting'}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white
                    rounded-2xl py-4 text-sm font-semibold shadow-lg shadow-rose-200
                    hover:from-rose-600 hover:to-pink-700
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200
                    flex items-center justify-center gap-2"
                >
                  {pageState === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      💌 Kirim Konfirmasi
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Footer */}
            <div className="px-8 pb-6 text-center">
              <p className="text-xs text-gray-300">
                Kode undangan: <span className="font-mono">{code}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AttendButton sub-component ─────────────────────────────────────────────
function AttendButton({
  selected,
  onClick,
  icon,
  label,
  description,
  activeClass,
  inactiveClass,
}: {
  selected:     boolean;
  onClick:      () => void;
  icon:         string;
  label:        string;
  description:  string;
  activeClass:  string;
  inactiveClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2
        shadow-sm transition-all duration-200 font-medium text-sm
        ${selected ? `${activeClass} shadow-md` : inactiveClass}`}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
      <span className={`text-xs font-normal ${selected ? 'opacity-80' : 'text-gray-400'}`}>
        {description}
      </span>
    </button>
  );
}
