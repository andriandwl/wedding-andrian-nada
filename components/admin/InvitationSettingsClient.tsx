"use client";

import { useState } from "react";

interface InvitationSettings {
  // Pengantin
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomParents: string;
  brideParents: string;

  // Akad Nikah
  akadDate: string;
  akadTime: string;
  akadVenue: string;
  akadAddress: string;

  // Resepsi
  resepsiDate: string;
  resepsiTime: string;
  resepsiVenue: string;
  resepsiAddress: string;

  // Pesan & Quote
  openingQuote: string;
  closingMessage: string;

  // Link Maps
  mapsLink: string;
}

const defaultSettings: InvitationSettings = {
  groomName: "Rizky",
  brideName: "Amira",
  groomFullName: "Muhammad Rizky Pratama, S.Kom",
  brideFullName: "Amira Zahra Putri, S.E.",
  groomParents: "Bapak Ahmad & Ibu Sari",
  brideParents: "Bapak Hasan & Ibu Dewi",

  akadDate: "2025-03-15",
  akadTime: "08:00",
  akadVenue: "Masjid Al-Ikhlas",
  akadAddress: "Jl. Raya Kebayoran No. 12, Jakarta Selatan",

  resepsiDate: "2025-03-15",
  resepsiTime: "11:00",
  resepsiVenue: "Gedung Graha Santika",
  resepsiAddress: "Jl. Gatot Subroto Kav. 25, Jakarta Selatan",

  openingQuote:
    '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri." (QS. Ar-Rum: 21)',
  closingMessage:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",

  mapsLink: "https://maps.google.com",
};

type Tab = "pengantin" | "akad" | "resepsi" | "pesan";

const tabItems: { id: Tab; label: string; icon: string }[] = [
  { id: "pengantin", label: "Pengantin", icon: "💑" },
  { id: "akad", label: "Akad Nikah", icon: "🕌" },
  { id: "resepsi", label: "Resepsi", icon: "🎊" },
  { id: "pesan", label: "Pesan & Info", icon: "💬" },
];

export default function InvitationSettingsClient() {
  const [settings, setSettings] = useState<InvitationSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<Tab>("pengantin");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: keyof InvitationSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    // Simulate save — connect to your API here
    await new Promise((res) => setTimeout(res, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            {settings.groomName} & {settings.brideName}
          </p>
          <p className="text-xs text-rose-500 mt-0.5 truncate">
            {settings.resepsiDate
              ? new Date(settings.resepsiDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Tanggal belum diatur"}{" "}
            · {settings.resepsiVenue || "Venue belum diatur"}
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
            <div className="space-y-6">
              <SectionTitle title="Data Mempelai Pria" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Nama Panggilan"
                  value={settings.groomName}
                  onChange={(v) => update("groomName", v)}
                  placeholder="contoh: Rizky"
                />
                <FormField
                  label="Nama Lengkap & Gelar"
                  value={settings.groomFullName}
                  onChange={(v) => update("groomFullName", v)}
                  placeholder="contoh: Muhammad Rizky Pratama, S.Kom"
                />
                <FormField
                  label="Nama Orang Tua"
                  value={settings.groomParents}
                  onChange={(v) => update("groomParents", v)}
                  placeholder="contoh: Bapak Ahmad & Ibu Sari"
                  className="sm:col-span-2"
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="Data Mempelai Wanita" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <FormField
                    label="Nama Panggilan"
                    value={settings.brideName}
                    onChange={(v) => update("brideName", v)}
                    placeholder="contoh: Amira"
                  />
                  <FormField
                    label="Nama Lengkap & Gelar"
                    value={settings.brideFullName}
                    onChange={(v) => update("brideFullName", v)}
                    placeholder="contoh: Amira Zahra Putri, S.E."
                  />
                  <FormField
                    label="Nama Orang Tua"
                    value={settings.brideParents}
                    onChange={(v) => update("brideParents", v)}
                    placeholder="contoh: Bapak Hasan & Ibu Dewi"
                    className="sm:col-span-2"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "akad" && (
            <div className="space-y-6">
              <SectionTitle title="Detail Akad Nikah" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Tanggal Akad"
                  type="date"
                  value={settings.akadDate}
                  onChange={(v) => update("akadDate", v)}
                />
                <FormField
                  label="Waktu Akad"
                  type="time"
                  value={settings.akadTime}
                  onChange={(v) => update("akadTime", v)}
                />
                <FormField
                  label="Nama Venue"
                  value={settings.akadVenue}
                  onChange={(v) => update("akadVenue", v)}
                  placeholder="contoh: Masjid Al-Ikhlas"
                />
                <FormField
                  label="Alamat Lengkap"
                  value={settings.akadAddress}
                  onChange={(v) => update("akadAddress", v)}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
              <DatePreview
                label="Akad Nikah"
                date={settings.akadDate}
                time={settings.akadTime}
                venue={settings.akadVenue}
                icon="🕌"
              />
            </div>
          )}

          {activeTab === "resepsi" && (
            <div className="space-y-6">
              <SectionTitle title="Detail Resepsi Pernikahan" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Tanggal Resepsi"
                  type="date"
                  value={settings.resepsiDate}
                  onChange={(v) => update("resepsiDate", v)}
                />
                <FormField
                  label="Waktu Resepsi"
                  type="time"
                  value={settings.resepsiTime}
                  onChange={(v) => update("resepsiTime", v)}
                />
                <FormField
                  label="Nama Venue"
                  value={settings.resepsiVenue}
                  onChange={(v) => update("resepsiVenue", v)}
                  placeholder="contoh: Gedung Graha Santika"
                />
                <FormField
                  label="Alamat Lengkap"
                  value={settings.resepsiAddress}
                  onChange={(v) => update("resepsiAddress", v)}
                  placeholder="Masukkan alamat lengkap"
                />
                <FormField
                  label="Link Google Maps"
                  value={settings.mapsLink}
                  onChange={(v) => update("mapsLink", v)}
                  placeholder="https://maps.google.com/..."
                  className="sm:col-span-2"
                />
              </div>
              <DatePreview
                label="Resepsi Pernikahan"
                date={settings.resepsiDate}
                time={settings.resepsiTime}
                venue={settings.resepsiVenue}
                icon="🎊"
              />
            </div>
          )}

          {activeTab === "pesan" && (
            <div className="space-y-6">
              <SectionTitle title="Quote Pembuka" />
              <FormField
                label="Ayat / Quote"
                value={settings.openingQuote}
                onChange={(v) => update("openingQuote", v)}
                multiline
                rows={3}
                placeholder="Masukkan ayat Al-Quran atau quote pembuka undangan"
              />

              <div className="border-t border-gray-100 pt-6">
                <SectionTitle title="Pesan Penutup" />
                <div className="mt-4">
                  <FormField
                    label="Pesan untuk Tamu"
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
                  Preview Quote
                </p>
                <p className="text-sm text-rose-800 italic leading-relaxed">
                  {settings.openingQuote || "—"}
                </p>
                <div className="border-t border-rose-100 mt-4 pt-4">
                  <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
                    Preview Pesan Penutup
                  </p>
                  <p className="text-sm text-rose-700 leading-relaxed">
                    {settings.closingMessage || "—"}
                  </p>
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
        {time && (
          <p className="text-xs text-gray-500 mt-0.5">Pukul {time} WIB</p>
        )}
        {venue && <p className="text-xs text-gray-400 mt-0.5">{venue}</p>}
      </div>
    </div>
  );
}
