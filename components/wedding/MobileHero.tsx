"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";

export function MobileHero({ guestName }: { guestName?: string }) {
  // Refs untuk elemen yang dianimasi
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const namesRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const gallerySec = useRef<HTMLDivElement>(null);
  const leftCol = useRef<HTMLDivElement>(null);
  const rightCol = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let ctx: { revert(): void } | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // ── 0. Floating gold particles ──────────────────────────────────────
        if (particlesRef.current) {
          const dots = particlesRef.current.querySelectorAll(".particle");
          dots.forEach((dot, i) => {
            gsap.to(dot, {
              y: `random(-30, 30)`,
              x: `random(-16, 16)`,
              opacity: `random(0.15, 0.55)`,
              duration: `random(3, 6)`,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.22,
            });
          });
        }

        // ── 1. Hero text entrance — staggered reveal ────────────────────────
        const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

        heroTl
          .fromTo(
            badgeRef.current,
            { opacity: 0, y: 24, letterSpacing: "0.6em" },
            { opacity: 1, y: 0, letterSpacing: "0.32em", duration: 1.1 },
            0.3,
          )
          .fromTo(
            namesRef.current,
            { opacity: 0, y: 48, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 1.3 },
            0.55,
          )
          .fromTo(
            subtitleRef.current,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.9 },
            0.85,
          )
          .fromTo(
            dividerRef.current,
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 0.8, transformOrigin: "center" },
            1.0,
          )
          .fromTo(
            scrollHintRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.7 },
            1.2,
          );

        // ── 2. Hero image parallax on scroll ────────────────────────────────
        if (heroImgRef.current) {
          gsap.to(heroImgRef.current, {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // ── 3. Overlay text fade out on scroll ──────────────────────────────
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            y: -30,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "40% top",
              scrub: true,
            },
          });
        }

        // ── 4. Gallery section reveal with split stagger ────────────────────
        if (leftCol.current && rightCol.current) {
          const leftCards = leftCol.current.querySelectorAll(".gallery-card");
          const rightCards = rightCol.current.querySelectorAll(".gallery-card");

          gsap.fromTo(
            leftCards,
            { opacity: 0, x: -40, rotate: -3 },
            {
              opacity: 1,
              x: 0,
              rotate: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: gallerySec.current,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.fromTo(
            rightCards,
            { opacity: 0, x: 40, rotate: 3 },
            {
              opacity: 1,
              x: 0,
              rotate: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "back.out(1.4)",
              scrollTrigger: {
                trigger: gallerySec.current,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        // ── 5. Gallery cards subtle parallax on scroll ──────────────────────
        if (gallerySec.current) {
          const cards = gallerySec.current.querySelectorAll(".gallery-card");
          cards.forEach((card, i) => {
            gsap.to(card, {
              yPercent: i % 2 === 0 ? -6 : 6,
              ease: "none",
              scrollTrigger: {
                trigger: gallerySec.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });
        }

        // ── 6. Gallery section header fade + scale ──────────────────────────
        const galleryHeader =
          gallerySec.current?.querySelector(".gallery-header");
        if (galleryHeader) {
          gsap.fromTo(
            galleryHeader,
            { opacity: 0, y: 28, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: {
                trigger: galleryHeader,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }, containerRef);

      // ── 7. Reliably start video on mobile (iOS requires explicit .play()) ──
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Autoplay blocked — wait for first user interaction then retry
          const resumeVideo = () => {
            videoRef.current?.play().catch(() => {});
            document.removeEventListener("touchstart", resumeVideo, true);
            document.removeEventListener("click", resumeVideo, true);
          };
          document.addEventListener("touchstart", resumeVideo, {
            once: true,
            capture: true,
          });
          document.addEventListener("click", resumeVideo, {
            once: true,
            capture: true,
          });
        });
      }
    };

    init();
    return () => ctx?.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-hidden"
      style={{
        background: "#FBE7EB",
        width: "100%",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* Parallax image wrapper — fallback shown while video loads */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55, objectPosition: "center 20%" }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Multi-layer gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%,  transparent 25%)",
              "linear-gradient(0deg,   rgba(0,0,0,0.62) 0%,  transparent 50%)",
              "radial-gradient(ellipse at 50% 80%, rgba(201,169,110,0.12) 0%, transparent 60%)",
            ].join(", "),
            zIndex: 1,
          }}
        />

        {/* Floating gold particles */}
        <div
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="particle absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: i % 4 === 0 ? "#D88C9C" : "rgba(201,169,110,0.4)",
                left: `${(i * 37 + 11) % 93}%`,
                top: `${(i * 53 + 7) % 85}%`,
                opacity: 0.25,
              }}
            />
          ))}
        </div>

        {/* Overlay text */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none"
          style={{
            zIndex: 3,
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingLeft: "clamp(20px, 6vw, 48px)",
            paddingRight: "clamp(20px, 6vw, 48px)",
          }}
        >
          <p
            ref={badgeRef}
            className="mb-2 text-[0.58rem] tracking-[0.32em] uppercase"
            style={{
              fontFamily: "var(--font-jost)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "clamp(10px, 7.5vw, 15px)",
              fontWeight: 500,
              opacity: 1,
              marginBottom: 15,
            }}
          >
            The Wedding of
          </p>

          {/* Names */}
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(70px, 7.5vw, 112px)",
              fontWeight: 500,
              letterSpacing: "0.015em",
              textShadow: "0 4px 40px rgba(0,0,0,0.3)",
              lineHeight: 0.92,
            }}
          >
            Nada{" "}
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(70px, 7.5vw, 112px)",
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              &amp;
            </span>{" "}
          </p>
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(70px, 7.5vw, 112px)",
              fontWeight: 500,
              letterSpacing: "0.015em",
              textShadow: "0 4px 40px rgba(0,0,0,0.3)",
              lineHeight: 0.92,
            }}
          >
            Andrian
          </p>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-4 text-[0.58rem] tracking-[0.22em] uppercase"
            style={{
              fontFamily: "var(--font-jost)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              opacity: 1,
              fontSize: "clamp(10px, 7.5vw, 10px)",
            }}
          >
            Celebrating Our Love
          </p>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="mt-5 flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <div
              style={{
                width: 32,
                height: "0.5px",
                background: "rgba(255,255,255,0.35)",
              }}
            />
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
              <path
                d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2Z"
                fill="rgba(255,255,255,0.55)"
              />
            </svg>
            <div
              style={{
                width: 32,
                height: "0.5px",
                background: "rgba(255,255,255,0.35)",
              }}
            />
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute left-1/2 flex flex-col items-center gap-2"
          style={{
            zIndex: 3,
            transform: "translateX(-50%)",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 22px)",
            opacity: 0,
          }}
        >
          {/* Guest greeting */}
          {guestName && (
            <div className="mt-5 text-center">
              <p
                className="tracking-[0.22em] uppercase"
                style={{
                  fontFamily: "var(--font-jost)",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(9px, 2.8vw, 11px)",
                  letterSpacing: "0.28em",
                }}
              >
                Kepada
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.95)",
                  fontSize: "clamp(18px, 5vw, 26px)",
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 20px rgba(0,0,0,0.35)",
                  lineHeight: 1.2,
                }}
              >
                {guestName}
              </p>
              <p
                className="text-center"
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "clamp(0.6rem, 2.6vw, 0.72rem)",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 300,
                  lineHeight: 1.75,
                  maxWidth: "clamp(220px, 68vw, 300px)",
                  marginBottom: "clamp(18px, 5vw, 26px)",
                }}
              >
                Dengan segala hormat, mengundang Anda
                <br />
                untuk menghadiri acara pernikahan kami.
              </p>
            </div>
          )}
          <p
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-jost)",
              color: "rgba(255,255,255,0.55)",
            }}
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
      </div>

      {/* ── GALLERY SECTION ──────────────────────────────────────────────── */}
      <div
        ref={gallerySec}
        style={{
          background: "#FBE7EB",
          padding: "32px 16px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        }}
      >
        {/* Section label */}
        <div className="gallery-header text-center mb-6" style={{ opacity: 0 }}>
          <p
            className="text-[0.6rem] tracking-[0.38em] uppercase mb-2"
            style={{ color: "#D88C9C", fontFamily: "var(--font-jost)" }}
          >
            Our Moments
          </p>
          <div className="flex items-center justify-center gap-3">
            <div
              style={{
                width: 28,
                height: "0.5px",
                background: "linear-gradient(90deg, transparent, #D88C9C)",
              }}
            />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M5 0L6 4H10L7 6.5L8 10L5 7.5L2 10L3 6.5L0 4H4Z"
                fill="#D88C9C"
                fillOpacity="0.7"
              />
            </svg>
            <div
              style={{
                width: 28,
                height: "0.5px",
                background: "linear-gradient(90deg, #D88C9C, transparent)",
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Left Column */}
          <div ref={leftCol} className="flex flex-col gap-2.5">
            {[galleryImages[1], galleryImages[3]].map((img, i) => (
              <div
                key={`left-${i}`}
                className="gallery-card overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: i === 0 ? "3/4" : "1/1",
                  opacity: 0,
                  boxShadow: "0 8px 32px rgba(44,40,37,0.13)",
                  // subtle hover handled via CSS
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="w-full h-full object-cover"
                  style={{
                    transition:
                      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div ref={rightCol} className="flex flex-col gap-2.5">
            {[galleryImages[2], galleryImages[4]].map((img, i) => (
              <div
                key={`right-${i}`}
                className="gallery-card overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: i === 0 ? "1/1" : "3/4",
                  opacity: 0,
                  boxShadow: "0 8px 32px rgba(44,40,37,0.13)",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="w-full h-full object-cover"
                  style={{
                    transition:
                      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Global keyframes ─────────────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes scrollWheel {
              0%   { opacity: 1; transform: translateY(0); }
              70%  { opacity: 0; transform: translateY(6px); }
              71%  { opacity: 0; transform: translateY(0); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `,
        }}
      />
    </div>
  );
}
