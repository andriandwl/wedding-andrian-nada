"use client";

import { useEffect, useRef, useState } from "react";

// ── Google Maps link to Tanah Lot, Bali ───────────────────────────────────────
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Tanah+Lot+Temple+Bali+Indonesia";

// ── Target wedding date/time ──────────────────────────────────────────────────
const WEDDING_DATE = new Date("2026-09-14T16:00:00+08:00");

// ── Inline SVG icons ─────────────────────────────────────────────────────────
function IconCalendar() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

// ── Countdown hook ────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  // Start at 0 so server and client render the same HTML (avoids hydration mismatch).
  // The real value is set immediately after mount via useEffect.
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const update = () => setDiff(Math.max(0, target.getTime() - Date.now()));
    update(); // set real value immediately on mount
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

// ── CountCell ─────────────────────────────────────────────────────────────────
function CountCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
      <span
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
          color: "var(--dark-warm)",
          lineHeight: 1,
          fontWeight: 300,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="text-[0.55rem] tracking-[0.22em] uppercase mt-1"
        style={{ color: "var(--warm-gray)", fontFamily: "var(--font-jost)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function TransitionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const { d, h, m, s } = useCountdown(WEDDING_DATE);

  useEffect(() => {
    let ctx: { revert(): void } | null = null;
    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          [dividerRef.current, quoteRef.current, dateRef.current],
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }, sectionRef.current!);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 px-6 flex flex-col items-center overflow-hidden"
      style={{ background: "var(--cream)" }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Divider */}
      <div
        ref={dividerRef}
        className="flex items-center gap-5 w-full max-w-xl mb-16"
        style={{ opacity: 0 }}
      >
        <div className="flex-1 h-px bg-[#D88C9C]/40" />
        <span
          className="text-[#D88C9C] text-2xl select-none"
          style={{ fontFamily: "var(--font-great-vibes)" }}
        >
          ✦
        </span>
        <div className="flex-1 h-px bg-[#D88C9C]/40" />
      </div>

      {/* Quote */}
      <blockquote
        ref={quoteRef}
        className="text-center max-w-2xl"
        style={{ opacity: 0 }}
      >
        <p
          className="text-[clamp(28px,5vw,52px)] leading-tight text-[#52363E] italic"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
        >
          &ldquo;Two souls, one heart — and a lifetime of adventures
          ahead.&rdquo;
        </p>
      </blockquote>

      {/* ── Event details ─────────────────────────────────────────────────── */}
      <div
        ref={dateRef}
        className="mt-20 w-full max-w-3xl"
        style={{ opacity: 0 }}
      >
        {/* ── Three icon cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date */}
          <div
            className="flex flex-col items-center text-center gap-3 py-8 px-5 rounded-2xl"
            style={{
              background: "rgba(201,169,110,0.06)",
              border: "0.5px solid rgba(201,169,110,0.22)",
            }}
          >
            <span style={{ color: "#D88C9C" }}>
              <IconCalendar />
            </span>
            <div>
              <p
                className="text-[0.62rem] tracking-[0.28em] uppercase mb-1"
                style={{ color: "#D88C9C", fontFamily: "var(--font-jost)" }}
              >
                Date
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.7rem",
                  color: "var(--dark-warm)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                }}
              >
                14 September
              </p>
              <p
                className="text-sm mt-0.5"
                style={{
                  color: "var(--warm-gray)",
                  fontFamily: "var(--font-jost)",
                  fontWeight: 300,
                }}
              >
                2026
              </p>
            </div>
            <p
              className="text-[0.7rem] mt-1"
              style={{
                color: "var(--warm-gray)",
                fontFamily: "var(--font-jost)",
              }}
            >
              Sunday · Akad &amp; Resepsi
            </p>
          </div>

          {/* Time */}
          <div
            className="flex flex-col items-center text-center gap-3 py-8 px-5 rounded-2xl"
            style={{
              background: "rgba(201,169,110,0.06)",
              border: "0.5px solid rgba(201,169,110,0.22)",
            }}
          >
            <span style={{ color: "#D88C9C" }}>
              <IconClock />
            </span>
            <div>
              <p
                className="text-[0.62rem] tracking-[0.28em] uppercase mb-1"
                style={{ color: "#D88C9C", fontFamily: "var(--font-jost)" }}
              >
                Time
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.7rem",
                  color: "var(--dark-warm)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                }}
              >
                16:00
              </p>
              <p
                className="text-sm mt-0.5"
                style={{
                  color: "var(--warm-gray)",
                  fontFamily: "var(--font-jost)",
                  fontWeight: 300,
                }}
              >
                onwards
              </p>
            </div>
            <div
              className="mt-1 space-y-0.5 text-[0.7rem]"
              style={{
                color: "var(--warm-gray)",
                fontFamily: "var(--font-jost)",
              }}
            >
              <p>Akad Nikah · 10:00 WIB</p>
              <p>Resepsi · 16:00 WITA</p>
            </div>
          </div>

          {/* Venue */}
          <div
            className="flex flex-col items-center text-center gap-3 py-8 px-5 rounded-2xl"
            style={{
              background: "rgba(201,169,110,0.06)",
              border: "0.5px solid rgba(201,169,110,0.22)",
            }}
          >
            <span style={{ color: "#D88C9C" }}>
              <IconPin />
            </span>
            <div>
              <p
                className="text-[0.62rem] tracking-[0.28em] uppercase mb-1"
                style={{ color: "#D88C9C", fontFamily: "var(--font-jost)" }}
              >
                Venue
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.7rem",
                  color: "var(--dark-warm)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                }}
              >
                Tanah Lot
              </p>
              <p
                className="text-sm mt-0.5"
                style={{
                  color: "var(--warm-gray)",
                  fontFamily: "var(--font-jost)",
                  fontWeight: 300,
                }}
              >
                Bali, Indonesia
              </p>
            </div>
            <p
              className="text-[0.68rem] leading-relaxed mt-1"
              style={{
                color: "var(--warm-gray)",
                fontFamily: "var(--font-jost)",
              }}
            >
              Jl. Raya Tanah Lot,
              <br />
              Beraban, Kec. Kediri,
              <br />
              Tabanan, Bali 82121
            </p>
          </div>
        </div>

        {/* ── Open Maps button ── */}
        <div className="flex justify-center mt-6">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full transition-all duration-300 group"
            style={{
              border: "0.5px solid rgba(201,169,110,0.5)",
              color: "#D88C9C",
              fontFamily: "var(--font-jost)",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(201,169,110,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "#D88C9C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(201,169,110,0.5)";
            }}
          >
            <IconMap />
            <span className="uppercase tracking-widest">Open in Maps</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* ── Countdown ── */}
        <div className="mt-12 flex flex-col items-center">
          <p
            className="text-[0.6rem] tracking-[0.32em] uppercase mb-5"
            style={{
              color: "var(--warm-gray)",
              fontFamily: "var(--font-jost)",
            }}
          >
            Counting down to the big day
          </p>
          <div className="flex items-start gap-2 sm:gap-4">
            <CountCell value={d} label="Days" />
            <span
              style={{
                color: "var(--accent-warm)",
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                lineHeight: 1,
                opacity: 0.5,
                marginTop: 2,
              }}
            >
              ·
            </span>
            <CountCell value={h} label="Hours" />
            <span
              style={{
                color: "var(--accent-warm)",
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                lineHeight: 1,
                opacity: 0.5,
                marginTop: 2,
              }}
            >
              ·
            </span>
            <CountCell value={m} label="Min" />
            <span
              style={{
                color: "var(--accent-warm)",
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.8rem",
                lineHeight: 1,
                opacity: 0.5,
                marginTop: 2,
              }}
            >
              ·
            </span>
            <CountCell value={s} label="Sec" />
          </div>
        </div>
      </div>
    </section>
  );
}
