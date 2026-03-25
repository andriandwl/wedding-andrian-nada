"use client";

import { useState, useEffect } from "react";

export interface InvitationSettings {
  // Pengantin
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomParents: string;
  brideParents: string;
  groomInstagram: string;
  brideInstagram: string;

  // Acara (Event)
  weddingDate: string;
  akadTime: string;
  resepsiTime: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  mapsLink: string;

  // Pesan & Quote
  openingQuote: string;
  closingMessage: string;

  // Hadiah & Rekening
  bank1Name: string;
  bank1AccountName: string;
  bank1AccountNumber: string;
  
  bank2Name: string;
  bank2AccountName: string;
  bank2AccountNumber: string;

  ewalletName: string;
  ewalletAccountName: string;
  ewalletAccountNumber: string;

  giftAddressNames: string;
  giftAddressFull: string;
}

const defaultSettings: InvitationSettings = {
  groomName: "Andrian",
  brideName: "Nada",
  groomFullName: "Andrian Dwi Haryanto",
  brideFullName: "Denada Putri",
  groomParents: "Bapak Dal Haryanto & Ibu Sukimah",
  brideParents: "Bapak Hendra Wijaya & Ibu Sari Dewi",
  groomInstagram: "https://instagram.com",
  brideInstagram: "https://instagram.com",

  weddingDate: "2026-09-14",
  akadTime: "10:00",
  resepsiTime: "16:00",
  venueName: "Tanah Lot",
  venueCity: "Bali, Indonesia",
  venueAddress: "Jl. Raya Tanah Lot, Beraban, Kec. Kediri, Tabanan, Bali 82121",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=Tanah+Lot+Temple+Bali+Indonesia",

  openingQuote: '"Two souls, one heart — and a lifetime of adventures ahead."',
  closingMessage:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",

  bank1Name: "BCA",
  bank1AccountName: "Denada Putri",
  bank1AccountNumber: "1234567890",

  bank2Name: "Mandiri",
  bank2AccountName: "Andrian Dwi Haryanto",
  bank2AccountNumber: "1370024475667",

  ewalletName: "GoPay / OVO / Dana",
  ewalletAccountName: "Denada Putri",
  ewalletAccountNumber: "0812-3456-7890",

  giftAddressNames: "Nada & Andrian",
  giftAddressFull:
    "Jl. Melati Indah No. 12, Perumahan Harmoni\nKelurahan Sukamaju, Kec. Cimanggis\nDepok, Jawa Barat 16451",
};

type Tab = "pengantin" | "acara" | "pesan" | "hadiah";

const tabItems: { id: Tab; label: string; icon: string }[] = [
  { id: "pengantin", label: "Pengantin", icon: "💑" },
  { id: "acara", label: "Pelaksanaan", icon: "🕌" },
  { id: "pesan", label: "Pesan & Info", icon: "💬" },
  { id: "hadiah", label: "Kado & Rekening", icon: "🎁" },
];

export default function InvitationSettingsClient() {
  const [settings, setSettings] = useState<InvitationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<Tab>("pengantin");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.ok && json.data) {
          setSettings(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  function update(key: keyof InvitationSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <span className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pengaturan Undangan
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola tampilan dan detail halaman undangan digital
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/invitation/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-rose-200 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 transition"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : saved ? (
              <>✅ Tersimpan</>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview banner */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shrink-0 shadow-sm shadow-rose-200">
          <span className="text-lg">💍</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-rose-800">
            {settings.brideName} & {settings.groomName}
          </p>
          <p className="text-xs text-rose-500 mt-0.5 truncate">
            {settings.weddingDate
              ? new Date(settings.weddingDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Tanggal belum diatur"}{" "}
            · {settings.venueName || "Venue belum diatur"}
          </p>
        </div>
        <span className="text-xs text-rose-400 hidden sm:block shrink-0">
          Live preview →
        </span>
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-2 text-sm font-medium transition
                ${
                  activeTab === tab.id
                    ? "text-rose-600 border-b-2 border-rose-500 bg-rose-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="text-base hidden sm:block">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "pengantin" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionTitle title="Data Mempelai Pria" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Nama Panggilan"
                  value={settings.groomName}
                  onChange={(v) => update("groomName", v)}
                  placeholder="contoh: Andrian"
                />
                <FormField
                  label="Nama Lengkap & Gelar (jika ada)"
                  value={settings.groomFullName}
                  onChange={(v) => update("groomFullName", v)}
                  placeholder="contoh: Andrian Dwi Haryanto"
                />
                <FormField
                  label="Nama Orang Tua"
                  value={settings.groomParents}
                  onChange={(v) => update("groomParents", v)}
                  placeholder="contoh: Bapak Dal Haryanto & Ibu Sukimah"
                />
                <FormField
                  label="Link Instagram (opsional)"
                  value={settings.groomInstagram}
                  onChange={(v) => update("groomInstagram", v)}
                  placeholder="contoh: https://instagram.com/andrian"
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="Data Mempelai Wanita" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Nama Panggilan"
                    value={settings.brideName}
                    onChange={(v) => update("brideName", v)}
                    placeholder="contoh: Nada"
                  />
                  <FormField
                    label="Nama Lengkap & Gelar (jika ada)"
                    value={settings.brideFullName}
                    onChange={(v) => update("brideFullName", v)}
                    placeholder="contoh: Denada Putri"
                  />
                  <FormField
                    label="Nama Orang Tua"
                    value={settings.brideParents}
                    onChange={(v) => update("brideParents", v)}
                    placeholder="contoh: Bapak Hendra Wijaya & Ibu Sari Dewi"
                  />
                  <FormField
                    label="Link Instagram (opsional)"
                    value={settings.brideInstagram}
                    onChange={(v) => update("brideInstagram", v)}
                    placeholder="contoh: https://instagram.com/denada"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "acara" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionTitle title="Jadwal Pelaksanaan" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="Tanggal Acara"
                  type="date"
                  value={settings.weddingDate}
                  onChange={(v) => update("weddingDate", v)}
                />
                <FormField
                  label="Waktu Akad"
                  type="time"
                  value={settings.akadTime}
                  onChange={(v) => update("akadTime", v)}
                />
                <FormField
                  label="Waktu Resepsi"
                  type="time"
                  value={settings.resepsiTime}
                  onChange={(v) => update("resepsiTime", v)}
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="Lokasi (Venue)" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Nama Venue"
                    value={settings.venueName}
                    onChange={(v) => update("venueName", v)}
                    placeholder="contoh: Tanah Lot"
                  />
                  <FormField
                    label="Nama Kota / Wilayah"
                    value={settings.venueCity}
                    onChange={(v) => update("venueCity", v)}
                    placeholder="contoh: Bali, Indonesia"
                  />
                  <FormField
                    label="Alamat Lengkap"
                    value={settings.venueAddress}
                    onChange={(v) => update("venueAddress", v)}
                    placeholder="Masukkan alamat lengkap..."
                    multiline
                    rows={2}
                    className="sm:col-span-2"
                  />
                  <FormField
                    label="Link Google Maps"
                    value={settings.mapsLink}
                    onChange={(v) => update("mapsLink", v)}
                    placeholder="https://maps.google.com/..."
                    className="sm:col-span-2"
                  />
                </div>
              </div>

              <DatePreview
                label="Preview Jadwal & Venue"
                date={settings.weddingDate}
                time={`Akad: ${settings.akadTime} | Resepsi: ${settings.resepsiTime}`}
                venue={`${settings.venueName} — ${settings.venueCity}`}
                icon="🗺️"
              />
            </div>
          )}

          {activeTab === "pesan" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionTitle title="Pesan Pembuka (Opening Quote)" />
              <FormField
                label="Ayat / Quote Pembuka"
                value={settings.openingQuote}
                onChange={(v) => update("openingQuote", v)}
                multiline
                rows={3}
                placeholder="Two souls, one heart — and a lifetime of adventures ahead."
              />

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="Pesan Penutup (Closing Message)" />
                <div className="mt-4">
                  <FormField
                    label="Pesan Terima Kasih / Permohonan Doa"
                    value={settings.closingMessage}
                    onChange={(v) => update("closingMessage", v)}
                    multiline
                    rows={4}
                    placeholder="Tulis pesan penutup undangan..."
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-5">
                <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">
                  Preview Pembuka
                </p>
                <p className="text-sm text-rose-800 italic leading-relaxed">
                  {settings.openingQuote || "—"}
                </p>
                <div className="border-t border-rose-100 mt-4 pt-4">
                  <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
                    Preview Penutup
                  </p>
                  <p className="text-sm text-rose-700 leading-relaxed">
                    {settings.closingMessage || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hadiah" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <SectionTitle title="Kirim Hadiah (Bank Transfer)" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Bank 1</p>
                  <FormField label="Nama Bank (Cth: BCA)" value={settings.bank1Name} onChange={v => update("bank1Name", v)} />
                  <FormField label="Nama Pemilik Rekening" value={settings.bank1AccountName} onChange={v => update("bank1AccountName", v)} />
                  <FormField label="Nomor Rekening" value={settings.bank1AccountNumber} onChange={v => update("bank1AccountNumber", v)} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Bank 2</p>
                  <FormField label="Nama Bank (Cth: Mandiri)" value={settings.bank2Name} onChange={v => update("bank2Name", v)} />
                  <FormField label="Nama Pemilik Rekening" value={settings.bank2AccountName} onChange={v => update("bank2AccountName", v)} />
                  <FormField label="Nomor Rekening" value={settings.bank2AccountNumber} onChange={v => update("bank2AccountNumber", v)} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="E-Wallet (GoPay/OVO/Dana)" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <FormField label="Label (Cth: GoPay / OVO)" value={settings.ewalletName} onChange={v => update("ewalletName", v)} />
                  <FormField label="Atas Nama" value={settings.ewalletAccountName} onChange={v => update("ewalletAccountName", v)} />
                  <FormField label="Nomor Telepon/Akun" value={settings.ewalletAccountNumber} onChange={v => update("ewalletAccountNumber", v)} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="Alamat Pengiriman Kado Fisik" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <FormField label="Penerima" value={settings.giftAddressNames} onChange={v => update("giftAddressNames", v)} />
                  <FormField 
                    label="Alamat Pengiriman Lengkap" 
                    value={settings.giftAddressFull} 
                    onChange={v => update("giftAddressFull", v)} 
                    multiline 
                    rows={4} 
                    className="sm:col-span-2" 
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 3,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}) {
  const base =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition bg-white";

  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

function DatePreview({
  label,
  date,
  time,
  venue,
  icon,
}: {
  label: string;
  date: string;
  time: string;
  venue: string;
  icon: string;
}) {
  const formatted = date
    ? new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-start">
      <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-lg shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800">{formatted}</p>
        {time && <p className="text-xs text-gray-500 mt-0.5">{time}</p>}
        {venue && <p className="text-xs text-gray-400 mt-0.5">{venue}</p>}
      </div>
    </div>
  );
}
