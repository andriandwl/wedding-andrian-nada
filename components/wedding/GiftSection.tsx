"use client";

import { useEffect, useRef, useState } from "react";

// ── Gift data — update names / numbers as needed ──────────────────────────────
const BANK_ACCOUNTS = [
  {
    bank: "BCA",
    accountName: "Denada Putri",
    accountNumber: "1234567890",
    logo: "BCA",
  },
  {
    bank: "Mandiri",
    accountName: "Andrian Dwi Haryanto",
    accountNumber: "1370024475667",
    logo: "MDR",
  },
];

const EWALLET = {
  label: "GoPay / OVO / Dana",
  number: "0812-3456-7890",
  name: "Denada Putri",
};

const GIFT_ADDRESS = {
  names: "Denada & Andrian",
  address:
    "Jl. Melati Indah No. 12, Perumahan Harmoni\nKelurahan Sukamaju, Kec. Cimanggis\nDepok, Jawa Barat 16451",
};

// ── Copy-to-clipboard hook ───────────────────────────────────────────────────
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    });
  };
  return { copiedKey, copy };
}

// ── Icons ────────────────────────────────────────────────────────────────────
function IconCopy({ done }: { done: boolean }) {
  return done ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconGift() {
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
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ── Botanical divider (reused pattern from HeroScrollGallery) ────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-5">
      <div
        style={{
          flex: 1,
          height: "0.5px",
          background:
            "linear-gradient(90deg, transparent, rgba(201,169,110,0.4))",
        }}
      />
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 2 L16 12 L26 14 L16 16 L14 26 L12 16 L2 14 L12 12 Z"
          fill="rgba(201,169,110,0.5)"
        />
        <circle cx="14" cy="14" r="2.5" fill="#C9A96E" />
      </svg>
      <div
        style={{
          flex: 1,
          height: "0.5px",
          background:
            "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)",
        }}
      />
    </div>
  );
}

// ── Bank Card ─────────────────────────────────────────────────────────────────
function BankCard({
  bank,
  accountName,
  accountNumber,
  logo,
  delay,
}: {
  bank: string;
  accountName: string;
  accountNumber: string;
  logo: string;
  delay: number;
}) {
  const { copiedKey, copy } = useCopy();
  const copied = copiedKey === accountNumber;

  return (
    <div
      className="relative flex flex-col gap-4 rounded-2xl p-6 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(201,169,110,0.2)",
        animation: "giftFadeUp 0.7s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(201,169,110,0.1), transparent 70%)",
        }}
      />

      {/* Bank logo badge */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 48,
            height: 48,
            background: "rgba(201,169,110,0.12)",
            border: "0.5px solid rgba(201,169,110,0.25)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "#C9A96E",
            }}
          >
            {logo}
          </span>
        </div>
        <span
          className="text-[0.6rem] tracking-[0.22em] uppercase"
          style={{
            color: "rgba(201,169,110,0.6)",
            fontFamily: "var(--font-jost)",
          }}
        >
          {bank}
        </span>
      </div>

      {/* Account name */}
      <div>
        <p
          className="text-[0.58rem] tracking-[0.22em] uppercase mb-1"
          style={{
            color: "rgba(138,129,120,0.7)",
            fontFamily: "var(--font-jost)",
          }}
        >
          Account Name
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "1.15rem",
            color: "#F5F0E8",
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          {accountName}
        </p>
      </div>

      {/* Account number + copy */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <p
            className="text-[0.55rem] tracking-[0.22em] uppercase mb-1"
            style={{
              color: "rgba(138,129,120,0.6)",
              fontFamily: "var(--font-jost)",
            }}
          >
            Account Number
          </p>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "1rem",
              color: "#F5F0E8",
              letterSpacing: "0.1em",
              fontWeight: 300,
            }}
          >
            {accountNumber}
          </p>
        </div>
        <button
          onClick={() => copy(accountNumber, accountNumber)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200"
          style={{
            background: copied
              ? "rgba(201,169,110,0.2)"
              : "rgba(201,169,110,0.1)",
            border: `0.5px solid ${copied ? "#C9A96E" : "rgba(201,169,110,0.3)"}`,
            color: "#C9A96E",
            fontFamily: "var(--font-jost)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
          }}
          aria-label={`Copy ${bank} account number`}
        >
          <IconCopy done={copied} />
          <span className="uppercase">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}

// ── GiftSection ───────────────────────────────────────────────────────────────
export default function GiftSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert(): void } | null = null;
    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".gift-content > *",
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.14,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
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
      id="gift"
      ref={sectionRef}
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ background: "#211e1b" }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,169,110,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="gift-content relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* ── Header ── */}
        <div className="text-center">
          <p
            style={{
              fontFamily: "var(--font-great-vibes)",
              fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
              color: "#C9A96E",
              opacity: 0.85,
              marginBottom: "0.4rem",
            }}
          >
            with love &amp; gratitude
          </p>
          <p
            className="text-[0.64rem] tracking-[0.32em] uppercase mb-3"
            style={{
              color: "rgba(138,129,120,0.75)",
              fontFamily: "var(--font-jost)",
            }}
          >
            Your Kindness is Enough
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
              color: "#F5F0E8",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "0.02em",
            }}
          >
            Send Your Gift
          </h2>
          <GoldDivider />
          <p
            className="text-[0.72rem] leading-loose mt-1 max-w-sm mx-auto text-center"
            style={{
              color: "rgba(138,129,120,0.8)",
              fontFamily: "var(--font-jost)",
              letterSpacing: "0.08em",
            }}
          >
            Your presence is our greatest gift.
            <br />
            But if you wish to bless us further, we are grateful.
          </p>
        </div>

        {/* ── Bank Transfer Cards ── */}
        <div className="w-full mt-12">
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: "#C9A96E" }}>
              <IconGift />
            </span>
            <span
              className="text-[0.62rem] tracking-[0.28em] uppercase"
              style={{
                color: "rgba(201,169,110,0.7)",
                fontFamily: "var(--font-jost)",
              }}
            >
              Bank Transfer
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BANK_ACCOUNTS.map((acc, i) => (
              <BankCard key={acc.accountNumber} {...acc} delay={i * 120} />
            ))}
          </div>
        </div>

        {/* ── E-Wallet ── */}
        <div className="w-full mt-8">
          <div className="flex items-center gap-3 mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span
              className="text-[0.62rem] tracking-[0.28em] uppercase"
              style={{
                color: "rgba(201,169,110,0.7)",
                fontFamily: "var(--font-jost)",
              }}
            >
              E-Wallet
            </span>
          </div>

          <EWalletCard data={EWALLET} />
        </div>

        {/* ── Divider ── */}
        <GoldDivider />

        {/* ── Shipping Address ── */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-5">
            <span style={{ color: "#C9A96E" }}>
              <IconHome />
            </span>
            <span
              className="text-[0.62rem] tracking-[0.28em] uppercase"
              style={{
                color: "rgba(201,169,110,0.7)",
                fontFamily: "var(--font-jost)",
              }}
            >
              Gift Delivery Address
            </span>
          </div>

          <div
            className="rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "0.5px solid rgba(201,169,110,0.2)",
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(201,169,110,0.08), transparent 70%)",
              }}
            />

            <div className="text-center">
              <p
                style={{
                  fontFamily: "var(--font-great-vibes)",
                  fontSize: "1.5rem",
                  color: "#C9A96E",
                  opacity: 0.9,
                  marginBottom: "0.6rem",
                }}
              >
                {GIFT_ADDRESS.names}
              </p>
              <div
                style={{
                  width: 32,
                  height: "0.5px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)",
                  margin: "0 auto 1rem",
                }}
              />
              <p
                className="text-[0.72rem] leading-loose whitespace-pre-line"
                style={{
                  color: "rgba(138,129,120,0.85)",
                  fontFamily: "var(--font-jost)",
                  letterSpacing: "0.06em",
                }}
              >
                {GIFT_ADDRESS.address}
              </p>
            </div>
          </div>
        </div>

        {/* ── Closing note ── */}
        <p
          className="mt-10 text-center italic text-[0.78rem] leading-relaxed"
          style={{
            fontFamily: "var(--font-cormorant)",
            color: "rgba(245,240,232,0.35)",
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
          }}
        >
          &ldquo;Thank you from the bottom of our hearts.&rdquo;
        </p>
      </div>

      {/* Keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes giftFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </section>
  );
}

// ── EWalletCard (local sub-component) ────────────────────────────────────────
function EWalletCard({ data }: { data: typeof EWALLET }) {
  const { copiedKey, copy } = useCopy();
  const copied = copiedKey === "ewallet";

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(201,169,110,0.2)",
      }}
    >
      <div>
        <p
          className="text-[0.58rem] tracking-[0.22em] uppercase mb-1"
          style={{
            color: "rgba(138,129,120,0.6)",
            fontFamily: "var(--font-jost)",
          }}
        >
          {data.label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "1rem",
            color: "#F5F0E8",
            letterSpacing: "0.1em",
            fontWeight: 300,
          }}
        >
          {data.number}
        </p>
        <p
          className="text-[0.7rem] mt-0.5"
          style={{
            color: "rgba(138,129,120,0.7)",
            fontFamily: "var(--font-jost)",
          }}
        >
          a.n. {data.name}
        </p>
      </div>

      <button
        onClick={() => copy(data.number, "ewallet")}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 flex-shrink-0"
        style={{
          background: copied
            ? "rgba(201,169,110,0.2)"
            : "rgba(201,169,110,0.1)",
          border: `0.5px solid ${copied ? "#C9A96E" : "rgba(201,169,110,0.3)"}`,
          color: "#C9A96E",
          fontFamily: "var(--font-jost)",
          fontSize: "0.62rem",
          letterSpacing: "0.14em",
        }}
        aria-label="Copy e-wallet number"
      >
        <IconCopy done={copied} />
        <span className="uppercase">{copied ? "Copied!" : "Copy Number"}</span>
      </button>
    </div>
  );
}
