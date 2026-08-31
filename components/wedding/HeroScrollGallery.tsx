"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";

import coupleImg from "@/assets/brideandgroom.jpeg";
import { MobileHero } from "./MobileHero";

// ── Bride / Groom themes ──────────────────────────────────────────────────────
const BRIDE_THEME = {
  main: "#D88C9C",
  border: "rgba(216,140,156,0.4)",
  tint: "rgba(216,140,156,0.07)",
};
const GROOM_THEME = {
  main: "#6E86B5",
  border: "rgba(110,134,181,0.4)",
  tint: "rgba(110,134,181,0.07)",
};

function PersonList({
  person,
  theme,
  parentLabel = "Putra / Putri dari",
}: {
  person: { role: string; name: string; parents: string; instagram: string };
  theme: { main: string; border: string; tint: string };
  parentLabel?: string;
}) {
  const rows = [
    { label: "Nama Lengkap", value: person.name },
    {
      label: parentLabel,
      value: person.parents
        .split("&")
        .map((s) => s.trim())
        .join(" & "),
    },
  ];
  return (
    <div
      className="w-full rounded-2xl p-6 md:p-8"
      style={{
        background: theme.tint,
        border: `1px solid ${theme.border}`,
        animation: "fadeSlideUp 0.9s ease both",
      }}
    >
      <div className="mb-4 inline-flex items-center gap-2">
        <span
          style={{ width: 22, height: 1, background: theme.main, opacity: 0.6 }}
        />
        <p
          className="text-[0.62rem] tracking-[0.32em] uppercase"
          style={{ color: theme.main, fontFamily: "var(--font-jost)" }}
        >
          {person.role}
        </p>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(1.5rem, 4.5vw, 1.5rem)",
          color: "var(--dark-warm)",
          fontWeight: 400,
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}
      >
        {person.name}
      </h3>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex gap-3">
            <span
              className="mt-[7px] shrink-0 rounded-full"
              style={{ width: 7, height: 7, background: theme.main }}
            />
            <div>
              <p
                className="text-[0.58rem] tracking-[0.22em] uppercase"
                style={{
                  color: "var(--warm-gray)",
                  fontFamily: "var(--font-jost)",
                }}
              >
                {r.label}
              </p>
              <p
                className="text-[0.9rem]"
                style={{
                  color: "var(--dark-warm)",
                  fontFamily: "var(--font-jost)",
                  lineHeight: 1.5,
                }}
              >
                {r.value}
              </p>
            </div>
          </li>
        ))}
        <li className="flex gap-3">
          <span
            className="mt-[7px] shrink-0 rounded-full"
            style={{ width: 7, height: 7, background: theme.main }}
          />
          <a
            href={person.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
          >
            <span
              className="flex items-center justify-center rounded-full transition-transform group-hover:scale-110"
              style={{
                width: 30,
                height: 30,
                border: `1px solid ${theme.border}`,
                color: theme.main,
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
              className="text-[0.72rem] tracking-[0.16em] uppercase"
              style={{ color: theme.main, fontFamily: "var(--font-jost)" }}
            >
              Instagram
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}

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
          stroke="#D88C9C"
          strokeWidth="0.5"
          strokeDasharray="3 2"
        />
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4 C10 7 7 9 4 10 C7 10 10 11 12 14 C14 11 17 10 20 10 C17 9 14 7 12 4Z"
          fill="#D88C9C"
          fillOpacity="0.7"
        />
        <circle cx="12" cy="14" r="1.5" fill="#D88C9C" />
        <line
          x1="12"
          y1="15.5"
          x2="12"
          y2="20"
          stroke="#D88C9C"
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
          stroke="#D88C9C"
          strokeWidth="0.5"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
}

// ── Section 2: Bride & Groom introduction ────────────────────────────────────
export function CoupleStory({ settings }: { settings?: any }) {
  const bride = {
    role: "The Bride",
    name: settings?.brideFullName || settings?.brideName || "Denada Putri",
    parents: settings?.brideParents || "Bapak Hendra Wijaya & Ibu Sari Dewi",
    instagram: settings?.brideInstagram || "https://instagram.com",
  };
  const groom = {
    role: "The Groom",
    name:
      settings?.groomFullName || settings?.groomName || "Andrian Dwi Haryanto",
    parents: settings?.groomParents || "Bapak Dal Haryanto & Ibu Sukimah",
    instagram: settings?.groomInstagram || "https://instagram.com",
  };

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
        className="absolute top-0 left-0 right-0"
        style={{
          height: "0.5px",
          background:
            "linear-gradient(90deg, transparent, #D88C9C 20%, #D88C9C 80%, transparent)",
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24 lg:py-28">
        {/* Section header */}
        <header
          className="text-center mb-10 md:mb-14"
          style={{ animation: "fadeSlideUp 0.8s ease both" }}
        >
          <p
            style={{
              fontFamily: "var(--font-great-vibes)",
              fontSize: "clamp(1.2rem, 4vw, 2.1rem)",
              color: "#D88C9C",
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
              fontSize: "clamp(2rem, 6.5vw, 3.8rem)",
              color: "var(--dark-warm)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              lineHeight: 0.95,
            }}
          >
            Bride &amp; Groom
          </h2>
          <BotanicalDivider wide />
        </header>

        {/* Shared photo */}
        <div
          className="relative mx-auto"
          style={{ maxWidth: 520, animation: "fadeSlideUp 0.9s ease both" }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-12% -8%",
              background:
                "radial-gradient(ellipse at 28% 60%, rgba(216,140,156,0.28) 0%, transparent 60%), radial-gradient(ellipse at 74% 60%, rgba(110,134,181,0.28) 0%, transparent 60%)",
              filter: "blur(28px)",
              zIndex: 0,
            }}
          />
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: 24,
              boxShadow: "0 30px 70px rgba(82,54,62,0.25)",
              zIndex: 1,
            }}
          >
            <Image
              src={coupleImg}
              alt={`${bride.name} & ${groom.name}`}
              placeholder="blur"
              className="w-full h-auto object-cover"
              sizes="(max-width: 560px) 100vw, 520px"
            />
          </div>
          {/* Name tags matching each side of the photo */}
          <div className="mt-4 flex justify-between px-2">
            <span
              className="text-[0.7rem] tracking-[0.22em] uppercase"
              style={{
                color: BRIDE_THEME.main,
                fontFamily: "var(--font-jost)",
              }}
            >
              {settings?.brideName || "Nada"}
            </span>
            <span
              className="text-[0.7rem] tracking-[0.22em] uppercase"
              style={{
                color: GROOM_THEME.main,
                fontFamily: "var(--font-jost)",
              }}
            >
              {settings?.groomName || "Andrian"}
            </span>
          </div>
        </div>

        {/* Bride (pink) + Groom (blue) lists */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PersonList person={bride} theme={BRIDE_THEME} parentLabel="Putri dari" />
          <PersonList person={groom} theme={GROOM_THEME} parentLabel="Putra dari" />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "0.5px",
          background:
            "linear-gradient(90deg, transparent, #D88C9C 20%, #D88C9C 80%, transparent)",
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
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
  settings,
}: { guestName?: string; settings?: any } = {}) {
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

  if (isMobile) {
    return <MobileHero guestName={guestName} settings={settings} />;
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
        style={{ background: "#FBE7EB" }}
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
            <source src="/desktop-hero2.mp4" type="video/mp4" />
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
