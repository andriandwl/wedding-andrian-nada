"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";

// Still + klip pendek muted yang autoplay-loop (ala Apple Live Photo, tanpa hover).
// Tanpa `live` → render foto diam saja.
export default function LivePhoto({
  src,
  live,
  alt,
  width,
  height,
  className = "",
}: {
  src: StaticImageData | string;
  live?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const v = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    // ponytail: React kadang tak render atribut `muted` → autoplay diblokir. Paksa di property.
    el.muted = true;
    const tryPlay = () => el.play().catch(() => {});

    // Mobile: autoplay muted+inline hanya andal saat video di viewport. Main saat terlihat, jeda saat tidak.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? tryPlay() : el.pause()),
      { threshold: 0.25 },
    );
    io.observe(el);
    el.addEventListener("canplay", tryPlay);

    // Fallback iOS Low Power Mode: mulai di sentuhan pertama.
    const onTouch = () => {
      tryPlay();
      window.removeEventListener("touchstart", onTouch);
    };
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      io.disconnect();
      el.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [live]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-full w-full object-cover"
      />
      {live && (
        <>
          <video
            ref={v}
            src={live}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
            ● LIVE
          </span> */}
        </>
      )}
    </div>
  );
}
