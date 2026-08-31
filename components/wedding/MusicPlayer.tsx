"use client";

import { useEffect, useRef, useState } from "react";

// ponytail: single background track from /public/music.mp3. Ganti file itu untuk ganti lagu.
export default function MusicPlayer({ src = "/akad.mp3" }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Browser blokir autoplay audio; mulai di gesture pertama (tap mana pun atau tombol Play).
  useEffect(() => {
    const start = () => {
      audioRef.current
        ?.play()
        .then(() => setPlaying(true))
        .catch(() => {});
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("wedding:play", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("wedding:play", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("wedding:play", start);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        className="fixed bottom-6 right-5 z-50 flex h-11 w-11 items-center justify-center gap-[3px] rounded-full
          bg-[#52363E] shadow-lg transition-all hover:bg-[#3d2830] active:scale-95"
        style={{ boxShadow: "0 4px 24px rgba(82,54,62,0.35)" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-white"
            style={{
              height: 16,
              transformOrigin: "center",
              animation: playing ? `music-bar 0.9s ease-in-out ${i * 0.15}s infinite` : "none",
              transform: playing ? undefined : "scaleY(0.35)",
            }}
          />
        ))}
      </button>
      <style>{`
        @keyframes music-bar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
