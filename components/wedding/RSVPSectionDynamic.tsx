"use client";

import { useEffect, useRef, useState } from "react";

interface GuestInfo {
  _id: string;
  name: string;
  category: string;
  maxPax: number;
  status: "INVITED" | "CONFIRMED" | "DECLINED";
  rsvp: {
    attending: boolean | null;
    pax: number | null;
    category: string | null;
    note: string | null;
    respondedAt: string | null;
  };
}

export default function RSVPSectionDynamic({
  code,
  guestInfo,
}: {
  code: string;
  guestInfo: GuestInfo;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // State from GuestInfo
  const [attending, setAttending] = useState<boolean | null>(
    guestInfo.rsvp.attending,
  );
  const [pax, setPax] = useState<number>(guestInfo.rsvp.pax ?? 1);
  const [rsvpCategory, setRsvpCategory] = useState<string>(
    guestInfo.category || "",
  );
  const [note, setNote] = useState<string>(guestInfo.rsvp.note || "");
  const [submitted, setSubmitted] = useState<boolean>(
    guestInfo.rsvp.attending !== null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let ctx: any = null;

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
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) {
      setErrorText("Please select your attendance status.");
      return;
    }
    if (attending === true && !rsvpCategory) {
      setErrorText("Pilih Kategori Undangan yang akan dihadiri.");
      return;
    }
    setErrorText("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/rsvp/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending,
          pax: attending ? pax : undefined,
          category: attending ? rsvpCategory : undefined,
          note: note.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setSubmitted(true);
      } else {
        setErrorText(
          json.error?.message ?? "An error occurred. Please try again.",
        );
      }
    } catch {
      setErrorText("Connection failed. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
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
          {submitted ? "See you there!" : "Will you join us?"}
        </h2>

        {!submitted && (
          <p
            className="text-[#A6808B] text-sm text-center max-w-sm leading-relaxed"
            style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
          >
            Hi, {guestInfo.name}. We&apos;d love to celebrate with you. Please
            let us know your attendance below.
          </p>
        )}

        {submitted ? (
          <div className="text-center py-4 flex flex-col items-center gap-6 w-full">
            <p
              className="text-[#A6808B] text-sm leading-relaxed px-4"
              style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
            >
              {attending
                ? `Thank you for confirming! We look forward to seeing you at the ${
                    guestInfo.category === "Both"
                      ? "Akad Nikah & Resepsi"
                      : guestInfo.category
                  }.`
                : "Thank you for letting us know. We will miss you on our special day!"}
            </p>
            {attending && (
              <div className="bg-[#white/5] border border-white/10 rounded-2xl p-6 w-full max-w-md">
                <p
                  className="text-[#D88C9C] text-sm tracking-widest uppercase mb-2"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  Reservation Details
                </p>
                <div
                  className="flex justify-between items-center text-[#FBE7EB] mt-4"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  <span className="text-sm">Guests</span>
                  <span className="font-medium">{pax}</span>
                </div>
                <div
                  className="flex justify-between items-center text-[#FBE7EB] mt-2"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  <span className="text-sm">Invitation Code</span>
                  <span className="font-medium font-mono tracking-widest bg-black/20 px-2 py-1 rounded">
                    {code}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 border-b border-[#D88C9C]/50 text-[#D88C9C] text-xs tracking-widest uppercase pb-1 hover:border-[#D88C9C] transition-colors"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Change Response
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-6 mt-4"
          >
            {errorText && (
              <div
                className="w-full px-5 py-3 rounded-xl bg-red-950/40 border border-red-900/50 text-red-200 text-sm italic text-center"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                {errorText}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                className="text-[#A6808B] text-xs tracking-widest uppercase ml-1"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                Attendance
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: true, label: "Attending" },
                  { value: false, label: "Cannot Attend" },
                ].map((opt) => (
                  <label
                    key={opt.label}
                    className="
                      flex flex-col items-center justify-center gap-1
                      px-5 py-4 rounded-xl cursor-pointer
                      bg-white/5 border border-white/10
                      text-sm transition-all duration-200
                      has-[:checked]:bg-[#D88C9C]/15
                      has-[:checked]:border-[#D88C9C]/40
                      has-[:checked]:text-[#FBE7EB]
                    "
                    style={{
                      fontFamily: "var(--font-jost)",
                      color: attending === opt.value ? "#FBE7EB" : "#A6808B",
                    }}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      className="sr-only"
                      checked={attending === opt.value}
                      onChange={() => setAttending(opt.value)}
                    />
                    <span className="font-medium tracking-wide">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {attending === true && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[#A6808B] text-xs tracking-widest uppercase ml-1"
                    style={{ fontFamily: "var(--font-jost)" }}
                  >
                    Kategori Undangan
                  </label>
                  <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-1 relative">
                    <select
                      value={rsvpCategory}
                      onChange={(e) => setRsvpCategory(e.target.value)}
                      className="w-full bg-transparent text-[#FBE7EB] text-sm py-3 px-4 focus:outline-none appearance-none"
                      style={{ fontFamily: "var(--font-jost)" }}
                      required
                    >
                      <option value="" disabled className="bg-[#52363E]">
                        Pilih Kategori
                      </option>
                      {/* {(guestInfo.category === "Both" || guestInfo.category === "Akad") &&  */}
                      <option value="Akad" className="bg-[#52363E]">
                        Akad Nikah
                      </option>
                      {/* } */}
                      {/* {(guestInfo.category === "Both" || guestInfo.category === "Resepsi") &&  */}
                      <option value="Resepsi" className="bg-[#52363E]">
                        Resepsi
                      </option>
                      {/* } */}
                      {/* {guestInfo.category === "Both" && (
                     
                      )} */}
                      <option value="Both" className="bg-[#52363E]">
                        Akad Nikah & Resepsi
                      </option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A6808B]">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end ml-1">
                    <label
                      className="text-[#A6808B] text-xs tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-jost)" }}
                    >
                      Number of Guests
                    </label>
                    <span
                      className="text-[#A6808B] text-xs"
                      style={{ fontFamily: "var(--font-jost)" }}
                    >
                      max {guestInfo.maxPax}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-2">
                    <button
                      type="button"
                      onClick={() => setPax((p) => Math.max(1, p - 1))}
                      disabled={pax <= 1}
                      className="w-12 h-10 flex items-center justify-center rounded-lg bg-white/5 text-[#FBE7EB] text-lg hover:bg-[#D88C9C]/20 transition disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      −
                    </button>
                    <span
                      className="text-[#FBE7EB] text-xl font-medium"
                      style={{ fontFamily: "var(--font-jost)" }}
                    >
                      {pax}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPax((p) => Math.min(guestInfo.maxPax, p + 1))
                      }
                      disabled={pax >= guestInfo.maxPax}
                      className="w-12 h-10 flex items-center justify-center rounded-lg bg-white/5 text-[#FBE7EB] text-lg hover:bg-[#D88C9C]/20 transition disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                className="text-[#A6808B] text-xs tracking-widest uppercase ml-1 flex justify-between"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <span>Wishes for the Couple</span>
                <span className="opacity-60">(opsional)</span>
              </label>
              <textarea
                placeholder="Leave a message..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                rows={3}
                className="
                  w-full px-5 py-4 rounded-xl resize-none
                  bg-white/5 border border-white/10
                  text-[#FBE7EB] placeholder-[#A6808B]/50
                  text-sm focus:outline-none focus:border-[#D88C9C]/50
                  transition-colors duration-200
                "
                style={{ fontFamily: "var(--font-jost)" }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full py-4 rounded-xl mt-4
                bg-[#D88C9C] text-[#52363E]
                font-semibold text-sm tracking-[0.14em] uppercase
                hover:bg-[#FBE7EB] disabled:opacity-50 disabled:hover:bg-[#D88C9C] transition-colors duration-300
                flex justify-center items-center gap-2
              "
              style={{ fontFamily: "var(--font-jost)" }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#52363E]/40 border-t-[#52363E] rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send RSVP"
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
