"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { storyStages } from "@/lib/data";

export default function LoveStoryScrollStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // We create refs for each stage panel dynamically via a ref array
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const photoStackRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);

  // Initialise the nested arrays
  storyStages.forEach((stage, i) => {
    if (!photoStackRefs.current[i]) {
      photoStackRefs.current[i] = stage.photos.map(() => null);
    }
  });

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        if (!section) return;

        // ── 1. Reveal the big title ────────────────────────────────────────
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // ── 2. For each stage: pin + stagger photo stack ───────────────────
        storyStages.forEach((stage, stageIdx) => {
          const panel = stageRefs.current[stageIdx];
          const photos = photoStackRefs.current[stageIdx];
          if (!panel || !photos.length) return;

          // Set initial position: all photos off-screen below, stacked
          gsap.set(photos, {
            y: (i) => 60 + i * 20, // each photo slightly further down
            opacity: 0,
            rotate: (i) => (i % 2 === 0 ? -4 + i : 3 - i), // slight tilt
            scale: (i) => 1 - i * 0.04, // depth scale
            zIndex: (i) => photos.length - i,
          });

          // The first photo is the "back" visually when reading top card first
          // We reveal photos from last (bottom of stack) to first (top) as we scroll
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: "top 60%", // trigger as panel enters viewport
              end: "+=300", // over 300px of scroll
              scrub: 0.8,
            },
          });

          // Stagger reveal each photo into its resting position
          photos.forEach((_photo, photoIdx) => {
            const photo = photos[photoIdx];
            if (!photo) return;

            const restingRotate =
              photoIdx % 2 === 0
                ? [-5, -2, 1][photoIdx % 3]
                : [4, -1, 3][photoIdx % 3];

            tl.to(
              photo,
              {
                y: 0,
                opacity: 1,
                rotate: restingRotate,
                scale: 1 - photoIdx * 0.025,
                duration: 0.4,
                ease: "back.out(1.4)",
              },
              photoIdx * 0.15, // stagger each card
            );
          });

          // Text reveal for this stage
          const textEl = panel.querySelector(".stage-text");
          if (textEl) {
            gsap.fromTo(
              textEl,
              { opacity: 0, x: -30 },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 65%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
        });
      }, sectionRef.current!);
    };

    init();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative w-full bg-[#FBE7EB] py-24 overflow-hidden"
    >
      {/* ── Section title ── */}
      <div className="px-6 mb-20 text-center">
        <h2
          ref={titleRef}
          className="text-[clamp(52px,9vw,120px)] leading-none text-[#52363E] italic"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            opacity: 0,
          }}
        >
          our love story
        </h2>
        <p
          className="mt-4 text-[#A6808B] text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          Four chapters of a life together
        </p>
      </div>

      {/* ── Story stages ── */}
      <div className="flex flex-col gap-32 px-6 max-w-6xl mx-auto">
        {storyStages.map((stage, stageIdx) => (
          <div
            key={stage.id}
            ref={(el) => {
              stageRefs.current[stageIdx] = el;
            }}
            className={`
              flex flex-col md:flex-row items-center gap-12 md:gap-20
              ${stageIdx % 2 === 1 ? "md:flex-row-reverse" : ""}
            `}
          >
            {/* Text block */}
            <div
              className="stage-text flex-1 min-w-0 flex flex-col gap-4"
              style={{ opacity: 0 }}
            >
              <span
                className="text-[#D88C9C] text-xs tracking-[0.22em] uppercase"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                {stage.label}
              </span>

              <h3
                className="text-[clamp(32px,4vw,56px)] leading-tight text-[#52363E] italic"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
              >
                {stage.title}
              </h3>

              <p
                className="text-[#A6808B] text-base leading-relaxed max-w-sm"
                style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
              >
                {stage.description}
              </p>

              {/* Decorative line */}
              <div className="w-12 h-px bg-[#D88C9C] mt-2" />
            </div>

            {/* Polaroid photo stack */}
            <div
              className="flex-1 flex justify-center items-center"
              style={{ minHeight: 380 }}
            >
              {/* Stack container — relative so children stack on each other */}
              <div className="relative" style={{ width: 260, height: 340 }}>
                {stage.photos.map((photo, photoIdx) => (
                  <div
                    key={photo.id}
                    ref={(el) => {
                      photoStackRefs.current[stageIdx][photoIdx] = el;
                    }}
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(44,40,37,0.18)]"
                    style={{
                      // GSAP will override these via animation
                      transformOrigin: "center 80%",
                      willChange: "transform, opacity",
                      // Polaroid-style white border
                      padding: "10px 10px 36px 10px",
                      background: "#FEFCF8",
                    }}
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 80vw, 280px"
                      />
                    </div>
                    {/* Caption below photo (polaroid style) */}
                    <p
                      className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-[#A6808B] tracking-wide"
                      style={{
                        fontFamily: "var(--font-great-vibes)",
                        fontSize: 14,
                      }}
                    >
                      {stage.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom ornament */}
      <div className="mt-32 flex justify-center">
        <p
          className="text-[#D88C9C] text-4xl"
          style={{ fontFamily: "var(--font-great-vibes)" }}
        >
          to be continued...
        </p>
      </div>
    </section>
  );
}
