"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";

import groomPhoto from "@/assets/groom.png";
import bridePhoto from "@/assets/bride.png";
import { MobileHero } from "./MobileHero";

// ── Constants ──────────────────────────────────────────────────────────────────
const GROOM_PHOTO = groomPhoto;
const BRIDE_PHOTO = bridePhoto;

const people = [
  {
    name: "Denada Putri",
    role: "Bride",
    parents: ["Bapak Hendra Wijaya", "Ibu Sari Dewi"],
    photo: BRIDE_PHOTO,
    instagram: "https://instagram.com",
    side: "bride",
  },
  {
    name: "Andrian Dwi Haryanto",
    role: "Groom",
    parents: ["Bapak Dal Haryanto", "Ibu Sukimah"],
    photo: GROOM_PHOTO,
    instagram: "https://instagram.com",
    side: "groom",
  },
];

// ── Reusable primitives ────────────────────────────────────────────────────────

function BotanicalDivider({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: wide ? "20px" : "12px", margin: "20px 0" }}
    >
      <svg
        width={wide ? 80 : 48}
        height="1"
        viewBox={`0 0 ${wide ? 80 : 48} 1`}
      >
        <line
          x1="0"
          y1="0.5"
          x2={wide ? 80 : 48}
          y2="0.5"
          stroke="#C9A96E"
          strokeWidth="0.5"
          strokeDasharray="3 2"
        />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4 C10 7 7 9 4 10 C7 10 10 11 12 14 C14 11 17 10 20 10 C17 9 14 7 12 4Z"
          fill="#C9A96E"
          fillOpacity="0.7"
        />
        <circle cx="12" cy="14" r="1.5" fill="#C9A96E" />
        <line
          x1="12"
          y1="15.5"
          x2="12"
          y2="20"
          stroke="#C9A96E"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />
      </svg>
      <svg
        width={wide ? 80 : 48}
        height="1"
        viewBox={`0 0 ${wide ? 80 : 48} 1`}
      >
        <line
          x1="0"
          y1="0.5"
          x2={wide ? 80 : 48}
          y2="0.5"
          stroke="#C9A96E"
          strokeWidth="0.5"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
}

function ArchPhoto({
  src,
  alt,
  delay = 0,
}: {
  src: string | typeof groomPhoto;
  alt: string;
  delay?: number;
}) {
  return (
    <div
      className="relative mx-auto"
      style={{
        // FIX: clamp now covers mobile (160px) → tablet (38vw) → desktop (260px)
        width: "clamp(160px, 38vw, 260px)",
        animation: `floatArch 7s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className="absolute"
        style={{
          inset: "-14px -10px -6px",
          border: "1px solid rgba(201,169,110,0.2)",
          borderRadius: "52% 52% 8px 8px / 42% 42% 8px 8px",
          zIndex: 0,
        }}
      />
      <div
        className="absolute"
        style={{
          inset: "-6px -4px 0px",
          border: "0.5px solid rgba(201,169,110,0.35)",
          borderRadius: "52% 52% 6px 6px / 38% 38% 6px 6px",
          zIndex: 0,
        }}
      />
      <div
        className="absolute"
        style={{
          inset: 0,
          borderRadius: "52% 52% 4px 4px / 32% 32% 4px 4px",
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(201,169,110,0.18) 0%, transparent 70%)",
          filter: "blur(18px)",
          zIndex: 0,
          transform: "scaleX(1.1) translateY(-10%)",
        }}
      />
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "52% 52% 4px 4px / 32% 32% 4px 4px",
          aspectRatio: "3 / 4",
          zIndex: 1,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 480px) 160px, (max-width: 640px) 38vw, 260px"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, rgba(44,40,37,0.25) 100%)",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

function PersonCard({
  person,
  index,
}: {
  person: (typeof people)[0];
  index: number;
}) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        // FIX: on mobile full width, on tablet/desktop bounded width
        width: "100%",
        maxWidth: "clamp(200px, 80vw, 300px)",
        animation: `fadeSlideUp 0.9s ease both`,
        animationDelay: `${0.2 + index * 0.18}s`,
      }}
    >
      {/* Role badge */}
      <div
        className="mb-4 inline-flex items-center gap-2"
        style={{ fontFamily: "var(--font-jost)" }}
      >
        <div
          style={{
            width: 18,
            height: "0.5px",
            background: "#C9A96E",
            opacity: 0.6,
          }}
        />
        <p
          className="text-[0.62rem] tracking-[0.32em] uppercase"
          style={{ color: "#C9A96E" }}
        >
          {person.role}
        </p>
        <div
          style={{
            width: 18,
            height: "0.5px",
            background: "#C9A96E",
            opacity: 0.6,
          }}
        />
      </div>

      <ArchPhoto src={person.photo} alt={person.name} delay={index * 1.5} />

      <div className="mt-8 px-2 w-full">
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            color: "var(--dark-warm)",
            // FIX: safe font size range for all screens
            fontSize: "clamp(1.35rem, 4vw, 1.75rem)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          {person.name}
        </h3>

        <div
          style={{
            width: 28,
            height: "0.5px",
            background:
              "linear-gradient(90deg, transparent, #C9A96E, transparent)",
            margin: "0.6rem auto 0.8rem",
          }}
        />

        <p
          className="text-[0.7rem] leading-loose"
          style={{ color: "var(--warm-gray)", fontFamily: "var(--font-jost)" }}
        >
          Putri/Putra dari
        </p>
        {person.parents.map((p, i) => (
          <p
            key={i}
            className="text-[0.78rem]"
            style={{
              color: "var(--dark-warm)",
              fontFamily: "var(--font-jost)",
              fontWeight: 400,
              lineHeight: 1.7,
              opacity: 0.8,
            }}
          >
            {p}
          </p>
        ))}

        <a
          href={person.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 transition-all duration-300 group"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <span
            className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              width: 32,
              height: 32,
              border: "0.5px solid rgba(201,169,110,0.4)",
              color: "#C9A96E",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </span>
          <span
            className="text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-300"
            style={{ color: "rgba(138,129,120,0.8)" }}
          >
            Instagram
          </span>
        </a>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-center justify-center flex-shrink-0 select-none md:px-12 py-6 md:py-0 md:-mt-8">
      <div className="w-[1.5px] h-[60px] bg-gradient-to-b from-transparent to-[#C9A96E]/50" />
      <div className="my-3 flex flex-col items-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 36 36"
          fill="none"
          className="mb-2 opacity-80"
        >
          <ellipse
            cx="18"
            cy="9"
            rx="2"
            ry="7"
            fill="rgba(201,169,110,0.4)"
            transform="rotate(0 18 18)"
          />
          <ellipse
            cx="18"
            cy="9"
            rx="2"
            ry="7"
            fill="rgba(201,169,110,0.4)"
            transform="rotate(45 18 18)"
          />
          <ellipse
            cx="18"
            cy="9"
            rx="2"
            ry="7"
            fill="rgba(201,169,110,0.4)"
            transform="rotate(90 18 18)"
          />
          <ellipse
            cx="18"
            cy="9"
            rx="2"
            ry="7"
            fill="rgba(201,169,110,0.4)"
            transform="rotate(135 18 18)"
          />
          <circle cx="18" cy="18" r="3" fill="#C9A96E" opacity="0.9" />
          <circle cx="18" cy="18" r="1.5" fill="#F5F0E8" />
        </svg>
        <span
          className="italic leading-none"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.8rem, 6vw, 4.2rem)",
            color: "var(--dark-warm)",
            opacity: 0.6,
            letterSpacing: "-0.02em",
          }}
        >
          &amp;
        </span>
      </div>
      <div className="w-[1.5px] h-[60px] bg-gradient-to-b from-[#C9A96E]/50 to-transparent" />
    </div>
  );
}

// ── CoupleStory ────────────────────────────────────────────────────────────────
export function CoupleStory() {
  return (
    <section
      id="story"
      className="w-full relative overflow-hidden"
      style={{ background: "var(--cream)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(201,169,110,0.07) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          aspectRatio: "1",
          zIndex: 0,
          opacity: 0.025,
          backgroundImage: `radial-gradient(ellipse at 50% 50%, #C9A96E 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "0.5px",
          background:
            "linear-gradient(90deg, transparent, #C9A96E 20%, #C9A96E 80%, transparent)",
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      {/* FIX: tighter vertical padding on mobile */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 lg:py-32">
        {/* Section header */}
        <header
          className="text-center mb-12 md:mb-20"
          style={{ animation: "fadeSlideUp 0.8s ease both" }}
        >
          <p
            style={{
              fontFamily: "var(--font-great-vibes)",
              // FIX: safe range for mobile
              fontSize: "clamp(1.2rem, 4vw, 2.1rem)",
              color: "#C9A96E",
              opacity: 0.9,
              marginBottom: "0.5rem",
              letterSpacing: "0.02em",
            }}
          >
            two hearts, one story
          </p>
          <p
            className="text-[0.64rem] tracking-[0.38em] uppercase mb-4"
            style={{
              color: "var(--warm-gray)",
              fontFamily: "var(--font-jost)",
            }}
          >
            The Couple
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              // FIX: safe mobile floor
              fontSize: "clamp(2rem, 6.5vw, 3.8rem)",
              color: "var(--dark-warm)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 0.95,
            }}
          >
            Bride and Groom
          </h2>
          <BotanicalDivider wide />
        </header>

        {/* ═══ Couple cards ═══ */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full mt-4">
          <div className="w-full md:w-auto flex justify-center">
            <PersonCard person={people[0]} index={0} />
          </div>
          <Connector />
          <div className="w-full md:w-auto flex justify-center">
            <PersonCard person={people[1]} index={1} />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "0.5px",
          background:
            "linear-gradient(90deg, transparent, #C9A96E 20%, #C9A96E 80%, transparent)",
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes floatArch {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `,
        }}
      />
    </section>
  );
}

// ── HeroScrollGallery ──────────────────────────────────────────────────────────
export default function HeroScrollGallery({
  guestName,
}: { guestName?: string } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const sideLeftTopRef = useRef<HTMLDivElement>(null);
  const sideLeftBotRef = useRef<HTMLDivElement>(null);
  const sideRightTopRef = useRef<HTMLDivElement>(null);
  const sideRightBotRef = useRef<HTMLDivElement>(null);
  const galleryWrapRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  // FIX: track viewport width to conditionally run GSAP on desktop only
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // FIX: skip GSAP scroll animation on mobile — show static gallery instead
    if (isMobile) return;

    let ctx: { revert(): void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=280%",
            scrub: 1.4,
          },
        });

        tl.to(scrollHintRef.current, { opacity: 0, y: -14, duration: 0.18 }, 0);
        tl.to(
          overlayTextRef.current,
          { opacity: 0, y: -40, duration: 0.22 },
          0,
        );

        tl.to(
          heroImgRef.current,
          {
            width: "290px",
            height: "390px",
            borderRadius: "24px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.22)",
            duration: 0.52,
            ease: "power2.inOut",
          },
          0,
        );

        tl.to(heroOverlayRef.current, { opacity: 0, duration: 0.18 }, 0.06);
        tl.to(galleryWrapRef.current, { opacity: 1, duration: 0.32 }, 0.1);

        const sideInProps = (x: number, y: number, rotate: number) => ({
          from: { x, y, opacity: 0, rotate: rotate * 0.5, scale: 0.94 },
          to: {
            x: 0,
            y: 0,
            opacity: 1,
            rotate,
            scale: 1,
            duration: 0.52,
            ease: "power3.out",
          },
        });

        tl.fromTo(
          sideLeftTopRef.current,
          sideInProps(-90, -24, -4).from,
          sideInProps(-90, -24, -4).to,
          0.18,
        );
        tl.fromTo(
          sideLeftBotRef.current,
          sideInProps(-90, 24, 2.5).from,
          sideInProps(-90, 24, 2.5).to,
          0.27,
        );
        tl.fromTo(
          sideRightTopRef.current,
          sideInProps(90, -24, 4).from,
          sideInProps(90, -24, 4).to,
          0.22,
        );
        tl.fromTo(
          sideRightBotRef.current,
          sideInProps(90, 24, -2.5).from,
          sideInProps(90, 24, -2.5).to,
          0.31,
        );

        tl.to(
          [sideLeftTopRef.current, sideRightTopRef.current],
          { y: -24, duration: 0.45 },
          0.58,
        );
        tl.to(
          [sideLeftBotRef.current, sideRightBotRef.current],
          { y: 24, duration: 0.45 },
          0.72,
        );
      });
    };

    init();
    return () => {
      ctx?.revert();
    };
  }, [isMobile]);

  // ── MOBILE: static hero layout (no scroll animation) ──────────────────────
  // if (isMobile) {
  //   return (
  //     /*
  //      * FIX SAFE AREA — Notch / Dynamic Island / Home Indicator
  //      *
  //      * WAJIB tambahkan di layout.tsx / _document.tsx:
  //      *   <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  //      *
  //      * Tanpa viewport-fit=cover, env(safe-area-inset-*) tidak bekerja.
  //      *
  //      * Penjelasan masalah di screenshot:
  //      *   1. Yellow strip kanan  → body/html punya default margin, atau scrollbar menambah lebar
  //      *   2. Konten di balik navbar (notch/DI) → tidak ada padding-top safe area
  //      *   3. Scroll hint terpotong → tidak ada padding-bottom safe area (home indicator)
  //      */
  //     <div
  //       className="relative overflow-x-hidden"
  //       style={{
  //         background: "#F5F0E8",
  //         // Gunakan 100% bukan 100vw untuk menghindari horizontal scrollbar
  //         width: "100%",
  //         // Safe area kiri-kanan untuk rounded corner device (misal iPhone landscape)
  //         paddingLeft: "env(safe-area-inset-left, 0px)",
  //         paddingRight: "env(safe-area-inset-right, 0px)",
  //       }}
  //     >
  //       {/* Hero photo — 100dvh lebih akurat dari 100svh/100vh di mobile browser */}
  //       <div
  //         className="relative w-full overflow-hidden"
  //         style={{ height: "100dvh" }}
  //       >
  //         <Image
  //           src={galleryImages[0].src}
  //           alt={galleryImages[0].alt}
  //           fill
  //           priority
  //           className="object-cover"
  //           sizes="100vw"
  //           style={{ objectPosition: "center 15%" }}
  //         />

  //         {/* Gradient — lebih gelap di atas (area notch) supaya konten tetap terbaca */}
  //         <div
  //           className="absolute inset-0"
  //           style={{
  //             background: [
  //               "linear-gradient(180deg, rgba(0,0,0,0.40) 0%, transparent 22%)",
  //               "linear-gradient(0deg,   rgba(0,0,0,0.55) 0%, transparent 45%)",
  //             ].join(", "),
  //           }}
  //         />

  //         {/* Overlay teks — padding-top mengikuti safe-area-inset-top (tinggi notch/DI) */}
  //         <div
  //           className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none"
  //           style={{
  //             paddingTop: "env(safe-area-inset-top, 0px)",
  //             paddingLeft: "clamp(20px, 6vw, 48px)",
  //             paddingRight: "clamp(20px, 6vw, 48px)",
  //           }}
  //         >
  //           {guestName ? (
  //             <p
  //               className="mb-2 text-[0.65rem] md:text-[0.7rem] tracking-[0.2em] uppercase text-white/90"
  //               style={{ fontFamily: "var(--font-jost)" }}
  //             >
  //               Dear {guestName},
  //             </p>
  //           ) : (
  //             <p
  //               className="mb-2 text-[0.58rem] tracking-[0.32em] uppercase text-white/60"
  //               style={{ fontFamily: "var(--font-jost)" }}
  //             >
  //               The Wedding of
  //             </p>
  //           )}

  //           <p
  //             className="leading-none text-center w-full"
  //             style={{
  //               fontFamily: "var(--font-great-vibes)",
  //               fontSize: "clamp(36px, 10vw, 64px)",
  //               textShadow: "0 2px 40px rgba(0,0,0,0.35)",
  //               letterSpacing: "0.01em",
  //               wordBreak: "break-word",
  //               overflowWrap: "break-word",
  //             }}
  //           >
  //             Denada &amp; Andrian
  //           </p>

  //           <p
  //             className="mt-4 text-[0.58rem] tracking-[0.2em] uppercase text-white/70"
  //             style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
  //           >
  //             Celebrating Our Love
  //           </p>

  //           <div className="mt-5 flex items-center gap-3">
  //             <div
  //               style={{
  //                 width: 28,
  //                 height: "0.5px",
  //                 background: "rgba(255,255,255,0.35)",
  //               }}
  //             />
  //             <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
  //               <path
  //                 d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"
  //                 fill="rgba(255,255,255,0.5)"
  //               />
  //             </svg>
  //             <div
  //               style={{
  //                 width: 28,
  //                 height: "0.5px",
  //                 background: "rgba(255,255,255,0.35)",
  //               }}
  //             />
  //           </div>
  //         </div>

  //         {/* Scroll hint — bottom mengikuti home indicator agar tidak terpotong */}
  //         <div
  //           className="absolute left-1/2 flex flex-col items-center gap-2"
  //           style={{
  //             transform: "translateX(-50%)",
  //             bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
  //           }}
  //         >
  //           <p
  //             className="text-[9px] tracking-[0.3em] uppercase text-white/60"
  //             style={{ fontFamily: "var(--font-jost)" }}
  //           >
  //             scroll
  //           </p>
  //           <svg
  //             width="18"
  //             height="26"
  //             viewBox="0 0 18 26"
  //             fill="none"
  //             className="opacity-50"
  //           >
  //             <rect
  //               x="1"
  //               y="1"
  //               width="16"
  //               height="24"
  //               rx="8"
  //               stroke="white"
  //               strokeWidth="1"
  //             />
  //             <rect
  //               x="8"
  //               y="5"
  //               width="2"
  //               height="5"
  //               rx="1"
  //               fill="white"
  //               style={{ animation: "scrollWheel 1.8s ease-in-out infinite" }}
  //             />
  //           </svg>
  //         </div>
  //       </div>

  //       {/* Mobile gallery grid */}
  //       <div
  //         className="grid grid-cols-2 gap-2"
  //         style={{
  //           background: "#F5F0E8",
  //           padding: "16px",
  //           paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
  //         }}
  //       >
  //         {/* Left Column */}
  //         <div className="flex flex-col gap-2">
  //           {[galleryImages[1], galleryImages[3]].map((img, i) => (
  //             <div
  //               key={`left-${i}`}
  //               className="overflow-hidden rounded-2xl"
  //               style={{ aspectRatio: i === 0 ? "3/4" : "1/1" }}
  //             >
  //               <Image
  //                 src={img.src}
  //                 alt={img.alt}
  //                 width={img.width}
  //                 height={img.height}
  //                 className="w-full h-full object-cover"
  //               />
  //             </div>
  //           ))}
  //         </div>
  //         {/* Right Column */}
  //         <div className="flex flex-col gap-2">
  //           {[galleryImages[2], galleryImages[4]].map((img, i) => (
  //             <div
  //               key={`right-${i}`}
  //               className="overflow-hidden rounded-2xl"
  //               style={{ aspectRatio: i === 0 ? "1/1" : "3/4" }}
  //             >
  //               <Image
  //                 src={img.src}
  //                 alt={img.alt}
  //                 width={img.width}
  //                 height={img.height}
  //                 className="w-full h-full object-cover"
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       <style
  //         dangerouslySetInnerHTML={{
  //           __html: `
  //         @keyframes scrollWheel {
  //           0%   { opacity: 1; transform: translateY(0); }
  //           70%  { opacity: 0; transform: translateY(6px); }
  //           71%  { opacity: 0; transform: translateY(0); }
  //           100% { opacity: 1; transform: translateY(0); }
  //         }
  //       `,
  //         }}
  //       />
  //     </div>
  //   );
  // }

  if (isMobile) {
    return <MobileHero guestName={guestName} />;
  }

  // ── TABLET & DESKTOP: scroll animation layout ──────────────────────────────
  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      // FIX: reduce scroll height on tablet to avoid over-scrolling dead zone
      style={{ height: "380vh" }}
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#F5F0E8" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(201,169,110,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            zIndex: 1,
          }}
        />

        {/* Gallery collage layer */}
        <div
          ref={galleryWrapRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, zIndex: 2 }}
        >
          {/* Left column
              FIX: use vw-based positioning so it stays visible on tablet
          */}
          <div
            className="absolute flex flex-col gap-5 items-end"
            style={{ left: "calc(50% - min(390px, 38vw))" }}
          >
            <div
              ref={sideLeftTopRef}
              className="overflow-hidden shadow-2xl"
              // FIX: responsive sizes for tablet
              style={{
                width: "clamp(140px, 18vw, 215px)",
                height: "clamp(180px, 23vw, 275px)",
                borderRadius: 20,
                opacity: 0,
              }}
            >
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                width={galleryImages[1].width}
                height={galleryImages[1].height}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              ref={sideLeftBotRef}
              className="overflow-hidden shadow-2xl"
              style={{
                width: "clamp(115px, 15vw, 175px)",
                height: "clamp(145px, 18vw, 225px)",
                borderRadius: 16,
                opacity: 0,
              }}
            >
              <Image
                src={galleryImages[2].src}
                alt={galleryImages[2].alt}
                width={galleryImages[2].width}
                height={galleryImages[2].height}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right column */}
          <div
            className="absolute flex flex-col gap-5 items-start"
            style={{ right: "calc(50% - min(390px, 38vw))" }}
          >
            <div
              ref={sideRightTopRef}
              className="overflow-hidden shadow-2xl"
              style={{
                width: "clamp(130px, 16vw, 195px)",
                height: "clamp(165px, 21vw, 255px)",
                borderRadius: 20,
                opacity: 0,
              }}
            >
              <Image
                src={galleryImages[3].src}
                alt={galleryImages[3].alt}
                width={galleryImages[3].width}
                height={galleryImages[3].height}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              ref={sideRightBotRef}
              className="overflow-hidden shadow-2xl"
              style={{
                width: "clamp(140px, 18vw, 215px)",
                height: "clamp(165px, 21vw, 255px)",
                borderRadius: 16,
                opacity: 0,
              }}
            >
              <Image
                src={galleryImages[4].src}
                alt={galleryImages[4].alt}
                width={galleryImages[4].width}
                height={galleryImages[4].height}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Hero / center photo */}
        <div
          ref={heroImgRef}
          className="relative z-20 overflow-hidden"
          style={{
            width: "100%",
            height: "100vh",
            borderRadius: "0px",
            transition: "none",
          }}
        >
          {/* Static image fallback (shown while video loads) */}
          {/* <Image
            src={galleryImages[0].src}
            alt={galleryImages[0].alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          /> */}

          {/* Looping background video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.88 }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Multi-layer gradient overlay for text legibility */}
          <div
            ref={heroOverlayRef}
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, transparent 30%)",
                "linear-gradient(0deg,   rgba(0,0,0,0.62) 0%, transparent 55%)",
              ].join(", "),
            }}
          />
        </div>

        {/* Hero overlay text */}
        <div
          ref={overlayTextRef}
          className="absolute inset-0 z-30 flex flex-col justify-end text-white pointer-events-none"
          style={{ padding: "clamp(28px, 5vw, 56px) clamp(32px, 6vw, 64px)" }}
        >
          <div
            className="flex items-center gap-3"
            style={{
              marginTop: "clamp(14px, 2vw, 22px)",
            }}
          >
            {/* "THE WEDDING OF" or guest label */}
            <p
              className="text-white/65"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "clamp(0.7rem, 0.85vw, 0.8rem)",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: "clamp(14px, 2vw, 20px)",
              }}
            >
              The Wedding of
            </p>
          </div>

          {/* Couple names — large serif, left-aligned */}
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(42px, 7.5vw, 112px)",
              fontWeight: 300,
              letterSpacing: "0.015em",
              textShadow: "0 4px 40px rgba(0,0,0,0.3)",
              lineHeight: 0.92,
            }}
          >
            Nada{" "}
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(38px, 7vw, 104px)",
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              {" "}
              &amp;
            </span>{" "}
          </p>
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(42px, 7.5vw, 112px)",
              fontWeight: 300,
              letterSpacing: "0.015em",
              textShadow: "0 4px 40px rgba(0,0,0,0.3)",
              lineHeight: 0.92,
            }}
          >
            Andrian
          </p>

          {/* Bottom micro-line */}
          <div
            className="flex items-center gap-3"
            style={{
              marginTop: "clamp(14px, 2vw, 22px)",
              marginBottom: "clamp(14px, 2vw, 22px)",
            }}
          >
            <div
              style={{
                width: "clamp(20px, 3vw, 36px)",
                height: "0.5px",
                background: "rgba(255,255,255,0.3)",
              }}
            />
            <p
              className="text-white/50"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "clamp(0.45rem, 0.7vw, 0.6rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Celebrating Our Love
            </p>
          </div>
          {guestName && (
            <p
              className="text-white/75"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "clamp(0.52rem, 0.9vw, 0.68rem)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 400,
                marginTop: "clamp(6px, 0.8vw, 10px)",
              }}
            >
              Dear {guestName}, you&apos;re invited
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 z-30 flex flex-col items-center gap-2"
          style={{ transform: "translateX(-50%)" }}
        >
          <p
            className="text-[9px] tracking-[0.3em] uppercase text-white/60"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            scroll
          </p>
          <svg
            width="18"
            height="26"
            viewBox="0 0 18 26"
            fill="none"
            className="opacity-50"
          >
            <rect
              x="1"
              y="1"
              width="16"
              height="24"
              rx="8"
              stroke="white"
              strokeWidth="1"
            />
            <rect
              x="8"
              y="5"
              width="2"
              height="5"
              rx="1"
              fill="white"
              style={{ animation: "scrollWheel 1.8s ease-in-out infinite" }}
            />
          </svg>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes scrollWheel {
            0%   { opacity: 1; transform: translateY(0); }
            70%  { opacity: 0; transform: translateY(6px); }
            71%  { opacity: 0; transform: translateY(0); }
            100% { opacity: 1; transform: translateY(0); }
          }
          /* Ken Burns: alternate between two positions for infinite variety */
          @keyframes kenBurns {
            0%   { transform: scale(1.0) translate(0%,    0%);   }
            25%  { transform: scale(1.06) translate(-0.8%, -1%);  }
            50%  { transform: scale(1.1) translate(1.2%,  0.5%); }
            75%  { transform: scale(1.06) translate(0.4%,  1.2%); }
            100% { transform: scale(1.0) translate(-0.6%, 0%);   }
          }
        `,
          }}
        />
      </div>
    </div>
  );
}
