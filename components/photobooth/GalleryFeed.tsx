"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  guestName: string;
  framedPhotoUrl: string;
  audioUrl?: string;
  audioDuration?: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Slight rotation per index for photo-wall feel
const ROTATIONS = [-2.5, 1.5, -1, 2, -1.8, 0.8, -2, 1.2, -0.5, 2.2];
function getRotation(idx: number) {
  return ROTATIONS[idx % ROTATIONS.length];
}

// Format duration: 65 → "1:05"
function formatDuration(sec?: number) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Format relative time
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export default function GalleryFeed() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newCount, setNewCount] = useState(0);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);

  const totalRef = useRef(0);

  // ── Fetch page ───────────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (p: number, append = false) => {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      try {
        const res = await fetch(
          `/api/photobooth?page=${p}&limit=12`,
        );
        const json = await res.json();
        if (!json.ok) return;

        const incoming: GalleryItem[] = json.data.items;
        setPagination(json.data.pagination);
        totalRef.current = json.data.pagination.total;

        if (append) {
          setItems((prev) => {
            const ids = new Set(prev.map((i) => i._id));
            return [...prev, ...incoming.filter((i) => !ids.has(i._id))];
          });
        } else {
          setItems(incoming);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Initial load
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Polling: silently check for new items every 5 s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/photobooth?page=1&limit=1");
        const json = await res.json();
        if (!json.ok) return;
        const latest = json.data.pagination.total;
        if (latest > totalRef.current) {
          setNewCount(latest - totalRef.current);
        }
      } catch {
        // silent
      }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Reload to top when "new photos" tapped ───────────────────────────────
  function handleRefresh() {
    setNewCount(0);
    setPage(1);
    fetchPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Load more ────────────────────────────────────────────────────────────
  function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    fetchPage(next, true);
  }

  // ── Audio toggle ─────────────────────────────────────────────────────────
  function toggleAudio(item: GalleryItem) {
    if (!item.audioUrl) return;

    if (playingId === item._id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setAudioProgress(0);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(item.audioUrl);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.onended = () => {
      setPlayingId(null);
      setAudioProgress(0);
    };

    audio.play().catch(() => setPlayingId(null));
    audioRef.current = audio;
    setPlayingId(item._id);
    setAudioProgress(0);
  }

  // Stop audio on unmount
  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ background: "#1a0a0e" }}
    >
      {/* Ambient dots */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(216,140,156,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header className="relative z-10 text-center pt-12 pb-6 px-4">
        <p
          className="text-[#D88C9C] mb-1"
          style={{
            fontFamily: "var(--font-great-vibes), cursive",
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
          }}
        >
          Kenangan Bersama
        </p>
        <h1
          className="text-[#FBE7EB]"
          style={{
            fontFamily:
              "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 300,
          }}
        >
          Galeri Tamu
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-px w-10 bg-[#D88C9C]/30" />
          <span className="text-[#D88C9C]/60 text-xs">✦</span>
          <div className="h-px w-10 bg-[#D88C9C]/30" />
        </div>
        {pagination && (
          <p className="text-[#A6808B] text-xs mt-3">
            {pagination.total} foto kenangan
          </p>
        )}
      </header>

      {/* New photo notification */}
      {newCount > 0 && (
        <div className="relative z-20 flex justify-center mb-2 px-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D88C9C] text-white text-sm font-medium shadow-lg shadow-[#D88C9C]/30 hover:bg-[#c97a8a] active:scale-95 transition-all animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {newCount} foto baru! Tap untuk muat
          </button>
        </div>
      )}

      {/* Grid */}
      <main className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-[#D88C9C]/30 border-t-[#D88C9C] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-[#A6808B] font-medium">Belum ada foto</p>
            <p className="text-sm text-[#A6808B]/60 mt-1">
              Jadilah yang pertama mengambil foto!
            </p>
            <a
              href="/photobooth"
              className="inline-block mt-5 px-6 py-2.5 rounded-full border border-[#D88C9C]/50 text-[#D88C9C] text-sm hover:border-[#D88C9C] transition"
            >
              Buka Photobooth →
            </a>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {items.map((item, idx) => (
              <div
                key={item._id}
                className="break-inside-avoid mb-3 sm:mb-4"
                style={{
                  transform: `rotate(${getRotation(idx)}deg)`,
                  transition: "transform 0.2s",
                }}
              >
                <div
                  className="group relative bg-[#FFFEF9] rounded-sm shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/50 hover:scale-[1.03] transition-all duration-200 cursor-pointer overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  onClick={() => toggleAudio(item)}
                >
                  {/* Photo */}
                  <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={item.framedPhotoUrl}
                      alt={`Foto ${item.guestName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Audio overlay */}
                    {item.audioUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                            ${playingId === item._id
                              ? "bg-[#D88C9C] opacity-90 scale-100"
                              : "bg-black/40 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                            }`}
                        >
                          {playingId === item._id ? (
                            // Pause icon
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                          ) : (
                            // Play icon
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audio progress bar */}
                  {playingId === item._id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D88C9C]/30">
                      <div
                        className="h-full bg-[#D88C9C] transition-all duration-200"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Caption strip */}
                  <div className="px-2.5 py-2 bg-[#FFFEF9]">
                    <p
                      className="text-[#52363E] text-xs font-medium truncate"
                      style={{ fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      {item.guestName}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p
                        className="text-[10px] text-[#A6808B]"
                        style={{ fontFamily: "var(--font-jost), sans-serif" }}
                      >
                        {timeAgo(item.createdAt)}
                      </p>
                      {item.audioUrl && item.audioDuration && (
                        <p className="text-[10px] text-[#D88C9C]">
                          🎙 {formatDuration(item.audioDuration)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {pagination && pagination.page < pagination.pages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 rounded-full border border-[#D88C9C]/40 text-[#D88C9C] text-sm
                hover:border-[#D88C9C] hover:bg-[#D88C9C]/10 disabled:opacity-50 transition-all"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-[#D88C9C]/40 border-t-[#D88C9C] rounded-full animate-spin" />
                  Memuat…
                </span>
              ) : (
                "Muat lebih banyak"
              )}
            </button>
          </div>
        )}
      </main>

      {/* CTA: take photo */}
      <div className="fixed bottom-6 right-5 z-30">
        <a
          href="/photobooth"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#D88C9C] text-white text-sm font-medium
            shadow-lg shadow-[#D88C9C]/30 hover:bg-[#c97a8a] active:scale-95 transition-all"
        >
          <span className="text-base">📷</span>
          Ambil Foto
        </a>
      </div>
    </div>
  );
}
