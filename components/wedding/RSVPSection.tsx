"use client";

import { useEffect, useRef, useState } from "react";

export default function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".rsvp-content > *",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        );
      }, sectionRef.current!);
    };

    init();
    return () => ctx?.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="rsvp"
      ref={sectionRef}
      className="relative w-full py-32 px-6 bg-[#52363E] overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #D88C9C 0%, transparent 60%), radial-gradient(circle at 80% 50%, #D88C9C 0%, transparent 60%)`,
        }}
      />

      <div className="rsvp-content relative z-10 max-w-xl mx-auto flex flex-col items-center gap-8">
        <span
          className="text-[#D88C9C] text-xs tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          You&apos;re invited
        </span>

        <h2
          className="text-[clamp(40px,7vw,80px)] leading-none text-[#FBE7EB] italic text-center"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
        >
          Will you join us?
        </h2>

        <p
          className="text-[#A6808B] text-sm text-center max-w-sm leading-relaxed"
          style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
        >
          We&apos;d love to celebrate with you. Please let us know by August
          1st, 2025.
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <p
              className="text-[#D88C9C] text-4xl"
              style={{ fontFamily: "var(--font-great-vibes)" }}
            >
              See you there!
            </p>
            <p
              className="mt-3 text-[#A6808B] text-sm"
              style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
            >
              We can&apos;t wait to celebrate with you.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                className="
                  w-full px-5 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-[#FBE7EB] placeholder-[#A6808B]
                  text-sm focus:outline-none focus:border-[#D88C9C]/50
                  transition-colors duration-200
                "
                style={{ fontFamily: "var(--font-jost)" }}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="
                  w-full px-5 py-3 rounded-xl
                  bg-white/5 border border-white/10
                  text-[#FBE7EB] placeholder-[#A6808B]
                  text-sm focus:outline-none focus:border-[#D88C9C]/50
                  transition-colors duration-200
                "
                style={{ fontFamily: "var(--font-jost)" }}
              />
            </div>

            <input
              type="email"
              placeholder="Email address"
              required
              className="
                w-full px-5 py-3 rounded-xl
                bg-white/5 border border-white/10
                text-[#FBE7EB] placeholder-[#A6808B]
                text-sm focus:outline-none focus:border-[#D88C9C]/50
                transition-colors duration-200
              "
              style={{ fontFamily: "var(--font-jost)" }}
            />

            <div className="grid grid-cols-2 gap-4">
              {["Attending", "Cannot Attend"].map((opt) => (
                <label
                  key={opt}
                  className="
                    flex items-center justify-center gap-2
                    px-5 py-3 rounded-xl cursor-pointer
                    bg-white/5 border border-white/10
                    text-[#A6808B] text-sm
                    has-[:checked]:bg-[#D88C9C]/15
                    has-[:checked]:border-[#D88C9C]/40
                    has-[:checked]:text-[#FBE7EB]
                    transition-all duration-200
                  "
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={opt}
                    className="sr-only"
                    defaultChecked={opt === "Attending"}
                  />
                  {opt}
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="
                w-full py-4 rounded-xl mt-2
                bg-[#D88C9C] text-[#52363E]
                font-medium text-sm tracking-[0.14em] uppercase
                hover:bg-[#FBE7EB] transition-colors duration-300
              "
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Send RSVP
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
