"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface PhotoItem {
  _id: string;
  guestName: string;
  guestCode?: string;
  framedPhotoUrl: string;
  audioUrl?: string;
  audioDuration?: number;
  isVisible: boolean;
  createdAt: string;
}

interface Summary {
  total: number;
  totalVisible: number;
  totalHidden: number;
  totalWithAudio: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(sec?: number) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PhotoboothAdminClient() {
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    totalVisible: 0,
    totalHidden: 0,
    totalWithAudio: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // QR state
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrTargetUrl, setQrTargetUrl] = useState("");

  // Audio player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // ── Data fetch ─────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/photobooth?page=${p}&limit=20`);
      const json = await res.json();
      if (!json.ok) return;
      setItems(json.data.items);
      setSummary(json.data.summary);
      setPagination(json.data.pagination);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(page);
  }, [fetchItems, page]);

  // ── QR Code ────────────────────────────────────────────────────────────────
  async function fetchQR() {
    setQrLoading(true);
    try {
      const res = await fetch("/api/admin/photobooth/qr");
      const json = await res.json();
      if (json.ok) {
        setQrDataUrl(json.data.qrDataUrl);
        setQrTargetUrl(json.data.targetUrl);
      }
    } finally {
      setQrLoading(false);
    }
  }

  useEffect(() => {
    fetchQR();
  }, []);

  function downloadQR() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "photobooth-qr.png";
    a.click();
  }

  // ── Toggle visibility ──────────────────────────────────────────────────────
  async function toggleVisibility(item: PhotoItem) {
    setToggling(item._id);
    try {
      const res = await fetch(`/api/admin/photobooth/${item._id}`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.ok) {
        setItems((prev) =>
          prev.map((it) =>
            it._id === item._id
              ? { ...it, isVisible: json.data.isVisible }
              : it,
          ),
        );
        setSummary((s) => ({
          ...s,
          totalVisible: json.data.isVisible
            ? s.totalVisible + 1
            : s.totalVisible - 1,
          totalHidden: json.data.isVisible
            ? s.totalHidden - 1
            : s.totalHidden + 1,
        }));
        showToast(
          json.data.isVisible ? "Foto ditampilkan" : "Foto disembunyikan",
          "success",
        );
      } else {
        showToast("Gagal mengubah status", "error");
      }
    } catch {
      showToast("Koneksi gagal", "error");
    } finally {
      setToggling(null);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteItem(item: PhotoItem) {
    if (
      !confirm(
        `Hapus foto dari "${item.guestName}"?\nFoto dan audio akan dihapus permanen.`,
      )
    )
      return;
    setDeleting(item._id);
    try {
      const res = await fetch(`/api/admin/photobooth/${item._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.ok) {
        setItems((prev) => prev.filter((it) => it._id !== item._id));
        setSummary((s) => ({
          ...s,
          total: s.total - 1,
          totalVisible: item.isVisible ? s.totalVisible - 1 : s.totalVisible,
          totalHidden: !item.isVisible ? s.totalHidden - 1 : s.totalHidden,
          totalWithAudio:
            item.audioUrl ? s.totalWithAudio - 1 : s.totalWithAudio,
        }));
        showToast(`Foto "${item.guestName}" dihapus`, "success");
      } else {
        showToast("Gagal menghapus", "error");
      }
    } catch {
      showToast("Koneksi gagal", "error");
    } finally {
      setDeleting(null);
    }
  }

  // ── Bulk download ──────────────────────────────────────────────────────────
  async function handleBulkDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/photobooth/download");
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast(json.error?.message ?? "Gagal membuat ZIP", "error");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photobooth_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("ZIP berhasil diunduh!", "success");
    } catch {
      showToast("Koneksi gagal saat download", "error");
    } finally {
      setDownloading(false);
    }
  }

  // ── Audio player ───────────────────────────────────────────────────────────
  function toggleAudio(item: PhotoItem) {
    if (!item.audioUrl) return;
    if (playingId === item._id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(item.audioUrl);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(item._id);
  }

  useEffect(() => () => audioRef.current?.pause(), []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium
            ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Photobooth & QR Code
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Moderasi foto tamu, generate QR, dan unduh arsip
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            🖼️ Lihat Galeri
          </a>
          <a
            href="/slideshow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
          >
            📺 Slideshow
          </a>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: "📸", label: "Total Foto", value: summary.total, color: "bg-blue-50 border-blue-100", text: "text-blue-700" },
          { icon: "✅", label: "Ditampilkan", value: summary.totalVisible, color: "bg-green-50 border-green-100", text: "text-green-700" },
          { icon: "🚫", label: "Disembunyikan", value: summary.totalHidden, color: "bg-red-50 border-red-100", text: "text-red-700" },
          { icon: "🎙️", label: "Ada Suara", value: summary.totalWithAudio, color: "bg-purple-50 border-purple-100", text: "text-purple-700" },
        ].map((c) => (
          <div key={c.label} className={`rounded-2xl border p-5 ${c.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{c.icon}</span>
              <span className={`text-xs font-medium ${c.text} opacity-75`}>{c.label}</span>
            </div>
            <p className={`text-3xl font-bold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Two-column: QR Code + Bulk Download */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* QR Code */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-1">QR Code Photobooth</h3>
          <p className="text-sm text-gray-500 mb-4">
            Cetak dan pasang di venue agar tamu bisa scan
          </p>
          {qrLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
            </div>
          ) : qrDataUrl ? (
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-[#FBE7EB] rounded-2xl border border-rose-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="QR Photobooth"
                  className="w-40 h-40 rounded-xl"
                />
              </div>
              <p className="text-xs text-gray-400 text-center break-all max-w-xs">
                {qrTargetUrl}
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={downloadQR}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
                >
                  ⬇️ Download PNG
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(qrTargetUrl).then(() => showToast("Link disalin!", "success"))}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition"
                >
                  🔗
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={fetchQR}
              className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 transition"
            >
              Generate QR Code
            </button>
          )}
        </div>

        {/* Bulk download */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-1">Unduh Semua Arsip</h3>
          <p className="text-sm text-gray-500 mb-4">
            Download semua foto dan pesan suara dalam satu file ZIP
          </p>
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {summary.totalVisible} foto (JPG/PNG)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {summary.totalWithAudio} pesan suara (WebM/MP4)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                Maks. 200 foto per unduhan
              </div>
            </div>
            <button
              onClick={handleBulkDownload}
              disabled={downloading || summary.totalVisible === 0}
              className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold
                hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition
                flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Menyiapkan ZIP…
                </>
              ) : (
                "📦 Download ZIP"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Semua Foto{" "}
            <span className="text-sm font-normal text-gray-500">
              ({summary.total})
            </span>
          </h3>
          <button
            onClick={() => fetchItems(page)}
            className="text-xs text-gray-500 hover:text-gray-700 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📷</p>
            <p className="text-gray-500 font-medium">Belum ada foto</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`relative rounded-xl overflow-hidden border transition-all duration-200 group
                  ${item.isVisible
                    ? "border-gray-200 shadow-sm"
                    : "border-red-200 opacity-50"
                  }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/5]">
                  <Image
                    src={item.framedPhotoUrl}
                    alt={item.guestName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />

                  {/* Hidden badge */}
                  {!item.isVisible && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                      Tersembunyi
                    </div>
                  )}

                  {/* Audio badge */}
                  {item.audioUrl && (
                    <button
                      onClick={() => toggleAudio(item)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition
                        ${playingId === item._id
                          ? "bg-[#D88C9C] text-white"
                          : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
                        }`}
                    >
                      {playingId === item._id ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end justify-center opacity-0 group-hover:opacity-100 pb-2 gap-1.5">
                    <button
                      onClick={() => toggleVisibility(item)}
                      disabled={toggling === item._id}
                      className="px-2.5 py-1 rounded-lg bg-white/90 text-gray-800 text-xs font-medium hover:bg-white transition disabled:opacity-50"
                    >
                      {toggling === item._id
                        ? "..."
                        : item.isVisible
                          ? "Sembunyikan"
                          : "Tampilkan"}
                    </button>
                    <button
                      onClick={() => deleteItem(item)}
                      disabled={deleting === item._id}
                      className="px-2.5 py-1 rounded-lg bg-red-500/90 text-white text-xs font-medium hover:bg-red-500 transition disabled:opacity-50"
                    >
                      {deleting === item._id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>

                {/* Caption */}
                <div className="px-2 py-1.5 bg-white border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {item.guestName}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-gray-400">{timeAgo(item.createdAt)}</p>
                    {item.audioUrl && item.audioDuration && (
                      <p className="text-[10px] text-rose-400">
                        🎙 {formatDuration(item.audioDuration)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              {pagination.total} foto · hal. {pagination.page}/{pagination.pages}
            </span>
            <div className="flex gap-1">
              {[
                { label: "«", p: 1, disabled: page === 1 },
                { label: "‹", p: page - 1, disabled: page === 1 },
                { label: "›", p: page + 1, disabled: page === pagination.pages },
                { label: "»", p: pagination.pages, disabled: page === pagination.pages },
              ].map(({ label, p, disabled }) => (
                <button
                  key={label}
                  onClick={() => setPage(p)}
                  disabled={disabled}
                  className="w-8 h-8 rounded-lg text-xs flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
