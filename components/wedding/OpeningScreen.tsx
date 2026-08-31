"use client";

import { useEffect, useRef, useState } from "react";

export default function OpeningScreen({ guestName }: { guestName?: string }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // ponytail: iOS/Android kadang skip autoplay attr sebelum hydration; force play manual
    videoRef.current?.play().catch(() => {});
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

  if (open) return null;

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
        <button
          onClick={() => setOpen(true)}
          className="mt-6 rounded-full bg-white px-8 py-3 font-medium tracking-wide text-[#52363E] transition-all hover:bg-white/90 active:scale-95"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}
