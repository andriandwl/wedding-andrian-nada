"use client";

import { useEffect, useRef, useState } from "react";

export default function OpeningScreen({ guestName }: { guestName?: string }) {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // ponytail: React kadang tidak render atribut `muted` → browser blokir autoplay.
    // Paksa muted di property sebelum play.
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  // Browser blokir autoplay bersuara → mulai muted, nyalakan suara di tap pertama.
  function unmute() {
    const v = videoRef.current;
    if (v && v.muted) {
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {});
    }
  }

  // Tombol Play: klik = user gesture → mulai video dari awal + trigger musik.
  function playAll() {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    window.dispatchEvent(new Event("wedding:play"));
  }

  // Klik "Buka Undangan": tutup layar, mulai musik, tampilkan tutorial 1x.
  function openInvitation() {
    window.dispatchEvent(new Event("wedding:play"));
    setOpen(true);
    try {
      if (!localStorage.getItem("weddingTipSeen")) setTip(true);
    } catch {
      setTip(true);
    }
  }

  function closeTip() {
    setTip(false);
    try {
      localStorage.setItem("weddingTipSeen", "1");
    } catch {}
  }

  if (open) {
    if (!tip) return null;
    return (
      <div
        onClick={closeTip}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-[1px] text-white"
      >
        {/* Sorotan tombol Photobooth (kanan-bawah, di atas musik) */}
        <div className="absolute bottom-20 right-5 flex items-center gap-3">
          <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#52363E] shadow-lg">
            📷 Photobooth — kirim foto & ucapan
          </span>
          <span className="h-11 w-11 shrink-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-transparent" />
        </div>
        {/* Sorotan tombol musik (kanan-bawah) */}
        <div className="absolute bottom-6 right-5 flex items-center gap-3">
          <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#52363E] shadow-lg">
            🎵 Ketuk untuk matikan / nyalakan musik
          </span>
          <span className="h-11 w-11 shrink-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-transparent" />
        </div>
        <p className="absolute inset-x-0 bottom-2 text-center text-xs text-white/70">
          Ketuk di mana saja untuk menutup
        </p>
      </div>
    );
  }

  return (
    <div
      onPointerDown={unmute}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black"
    >
      <video
        ref={videoRef}
        src="/first.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-16 text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em]">The Wedding of</p>
        <h1 className="font-serif text-4xl">Nada & Andrian</h1>
        {guestName && (
          <div className="mt-2">
            <p className="text-sm">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="text-lg font-semibold">{guestName}</p>
          </div>
        )}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={playAll}
            aria-label="Putar video & musik"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px] fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button
            onClick={openInvitation}
            className="rounded-full bg-white px-8 py-3 font-medium tracking-wide text-[#52363E] transition-all hover:bg-white/90 active:scale-95"
          >
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
}
