"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  _id: string;
  guestName: string;
  framedPhotoUrl: string;
  audioUrl?: string;
  createdAt: string;
}

const INTERVAL_MS = 5000;
const POLL_MS = 30000;

export default function SlideshowPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/photobooth?page=1&limit=100");
      const json = await res.json();
      if (json.ok) {
        setItems(json.data.items);
        setLoaded(true);
      }
    } catch { /* silent */ }
  }, []);

  // Initial fetch + poll for new photos
  useEffect(() => {
    fetchAll();
    const pollId = setInterval(fetchAll, POLL_MS);
    return () => clearInterval(pollId);
  }, [fetchAll]);

  // Auto-advance
  useEffect(() => {
    if (items.length === 0) return;
    timerRef.current = setInterval(() => {
      advance(1);
    }, INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  function advance(dir: 1 | -1) {
    if (items.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + items.length) % items.length);
      setTransitioning(false);
    }, 300);
  }

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") advance(1);
      if (e.key === "ArrowLeft") advance(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const item = items[current];

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "#0d0608" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(216,140,156,0.06) 0%, transparent 60%)",
        }}
      />

      {!loaded || items.length === 0 ? (
        <div className="text-center">
          {!loaded ? (
            <div className="w-8 h-8 border-2 border-[#D88C9C]/30 border-t-[#D88C9C] rounded-full animate-spin mx-auto" />
          ) : (
            <>
              <p className="text-4xl mb-4">📷</p>
              <p className="text-[#A6808B]">Belum ada foto</p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Photo */}
          <div
            className="relative transition-all duration-300"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "scale(0.97)" : "scale(1)",
              height: "min(72vh, 560px)",
              aspectRatio: "4/5",
            }}
          >
            <Image
              src={item.framedPhotoUrl}
              alt={item.guestName}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="560px"
              priority
            />
          </div>

          {/* Guest name */}
          <div
            className="mt-6 text-center transition-all duration-300"
            style={{ opacity: transitioning ? 0 : 1 }}
          >
            <p
              className="text-[#D88C9C]"
              style={{
                fontFamily: "var(--font-great-vibes), cursive",
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              }}
            >
              {item.guestName}
            </p>
            {item.audioUrl && (
              <p className="text-[#A6808B]/60 text-xs mt-1 tracking-widest uppercase">
                🎙 Pesan Suara
              </p>
            )}
          </div>

          {/* Dot navigation */}
          <div className="absolute bottom-8 flex items-center gap-2">
            {items.slice(0, Math.min(items.length, 12)).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  clearInterval(timerRef.current);
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-200 ${
                  i === current % Math.min(items.length, 12)
                    ? "w-5 h-1.5 bg-[#D88C9C]"
                    : "w-1.5 h-1.5 bg-[#D88C9C]/30"
                }`}
              />
            ))}
            {items.length > 12 && (
              <span className="text-[#A6808B]/40 text-xs ml-1">
                +{items.length - 12}
              </span>
            )}
          </div>

          {/* Counter top-right */}
          <div className="absolute top-5 right-6 text-[#A6808B]/50 text-xs font-mono">
            {current + 1} / {items.length}
          </div>

          {/* Nav arrows */}
          <button
            onClick={() => advance(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D88C9C] hover:bg-white/10 transition"
          >
            ‹
          </button>
          <button
            onClick={() => advance(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D88C9C] hover:bg-white/10 transition"
          >
            ›
          </button>
        </>
      )}

      {/* Keyboard hint */}
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[#A6808B]/25 text-xs tracking-widest">
        ← → untuk navigasi
      </p>
    </div>
  );
}
