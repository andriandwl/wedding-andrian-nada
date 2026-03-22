'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────────
interface GuestFormData {
  name:     string;
  phone:    string;
  category: 'Akad' | 'Resepsi' | 'Both';
  maxPax:   number;
}

interface Props {
  initialData?: Partial<GuestFormData>;
  guestId?:     string;
}

type FieldErrors = Partial<Record<keyof GuestFormData, string[]>>;

// ── Component ──────────────────────────────────────────────────────────────
export default function GuestForm({ initialData, guestId }: Props) {
  const router = useRouter();
  const isEdit = !!guestId;

  const [form, setForm] = useState<GuestFormData>({
    name:     initialData?.name     ?? '',
    phone:    initialData?.phone    ?? '',
    category: initialData?.category ?? 'Both',
    maxPax:   initialData?.maxPax   ?? 1,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);

  function setField<K extends keyof GuestFormData>(key: K, value: GuestFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change
    if (fieldErrors[key]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setFieldErrors({});

    // Simple client-side validation
    const errs: FieldErrors = {};
    if (!form.name.trim())           errs.name    = ['Nama wajib diisi'];
    if (form.maxPax < 1)             errs.maxPax  = ['Minimal 1'];
    if (form.maxPax > 20)            errs.maxPax  = ['Maksimal 20'];
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setLoading(false);
      return;
    }

    const url    = isEdit ? `/api/admin/guests/${guestId}` : '/api/admin/guests';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name.trim(),
          phone:    form.phone.trim(),
          category: form.category,
          maxPax:   Number(form.maxPax),
        }),
      });

      const json = await res.json();
      setLoading(false);

      if (!json.ok) {
        if (json.error?.details) {
          // Zod field errors
          setFieldErrors(json.error.details as FieldErrors);
        } else {
          setServerError(json.error?.message ?? 'Terjadi kesalahan. Coba lagi.');
        }
        return;
      }

      setSuccess(true);
      // Brief success flash, then redirect
      setTimeout(() => {
        router.push('/admin/guests');
        router.refresh();
      }, 800);

    } catch {
      setLoading(false);
      setServerError('Koneksi gagal. Periksa jaringan Anda.');
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <span className="text-4xl">✅</span>
        <p className="font-semibold text-gray-800">
          {isEdit ? 'Perubahan tersimpan!' : 'Tamu berhasil ditambahkan!'}
        </p>
        <p className="text-sm text-gray-500">Mengalihkan ke daftar tamu...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Server error banner */}
      {serverError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
          <span className="shrink-0">⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      {/* Name */}
      <FormField
        label="Nama Tamu"
        required
        error={fieldErrors.name?.[0]}
      >
        <input
          type="text"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Contoh: Budi Santoso"
          disabled={loading}
          className={inputClass(!!fieldErrors.name)}
          autoFocus
        />
      </FormField>

      {/* Phone */}
      <FormField
        label="Nomor Telepon"
        hint="Opsional"
        error={fieldErrors.phone?.[0]}
      >
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setField('phone', e.target.value)}
          placeholder="Contoh: 0812-3456-7890"
          disabled={loading}
          className={inputClass(!!fieldErrors.phone)}
        />
      </FormField>

      {/* Category */}
      <FormField
        label="Kategori Undangan"
        error={fieldErrors.category?.[0]}
      >
        <div className="grid grid-cols-3 gap-3">
          {(['Akad', 'Resepsi', 'Both'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setField('category', cat)}
              disabled={loading}
              className={`py-2.5 rounded-xl border-2 text-sm font-medium transition
                ${form.category === cat
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'}
                disabled:opacity-50`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FormField>

      {/* Max Pax */}
      <FormField
        label="Maksimal Pax"
        hint="Jumlah tamu yang diperbolehkan hadir"
        error={fieldErrors.maxPax?.[0]}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setField('maxPax', Math.max(1, form.maxPax - 1))}
            disabled={loading || form.maxPax <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={20}
            value={form.maxPax}
            onChange={(e) => setField('maxPax', Number(e.target.value))}
            disabled={loading}
            className={`w-16 text-center ${inputClass(!!fieldErrors.maxPax)}`}
          />
          <button
            type="button"
            onClick={() => setField('maxPax', Math.min(20, form.maxPax + 1))}
            disabled={loading || form.maxPax >= 20}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
          >
            +
          </button>
          <span className="text-sm text-gray-400">orang</span>
        </div>
      </FormField>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium
            hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
            transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEdit ? 'Menyimpan...' : 'Menambahkan...'}
            </>
          ) : (
            isEdit ? '💾 Simpan Perubahan' : '+ Tambah Tamu'
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────
function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label:    string;
  required?: boolean;
  hint?:    string;
  error?:   string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
        {hint && <span className="text-gray-400 font-normal text-xs">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border rounded-xl px-4 py-2.5 text-sm
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:border-transparent transition
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${hasError
      ? 'border-red-300 focus:ring-red-400'
      : 'border-gray-200 focus:ring-gray-900'}`;
}
