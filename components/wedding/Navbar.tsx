"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
      <nav
        ref={navRef}
        className={`
          flex items-center justify-between gap-4
          px-5 py-3 rounded-full
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "bg-[#FBE7EB]/80 backdrop-blur-md shadow-[0_2px_24px_rgba(44,40,37,0.08)] border border-[#D88C9C]/20"
              : "bg-[#FBE7EB]/60 backdrop-blur-sm shadow-[0_1px_12px_rgba(44,40,37,0.04)]"
          }
        `}
        style={{ minWidth: "min(680px, calc(100% - 32px))" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-medium tracking-wider text-[#52363E] shrink-0"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          N &amp; A
        </Link>

        {/* Nav links — hidden on small mobile */}
        <ul className="hidden sm:flex items-center gap-6">
          {["Travel", "Registry", "FAQ"].map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase()}`}
                className="font-sans text-xs tracking-[0.12em] uppercase text-[#A6808B] hover:text-[#52363E] transition-colors duration-200"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* RSVP button */}
        <Link
          href="#rsvp"
          className="
            shrink-0
            px-5 py-2 rounded-full
            bg-[#52363E] text-[#FBE7EB]
            font-sans text-xs tracking-[0.14em] uppercase
            hover:bg-[#D88C9C] transition-colors duration-300
          "
          style={{ fontFamily: "var(--font-jost)" }}
        >
          RSVP
        </Link>
      </nav>
    </header>
  );
}
