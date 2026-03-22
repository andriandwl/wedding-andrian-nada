export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 bg-[#2C2825] border-t border-white/5">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4 text-center">
        <p
          className="text-[#C9A96E] text-3xl"
          style={{ fontFamily: "var(--font-great-vibes)" }}
        >
          Denada &amp; Andrian
        </p>
        <p
          className="text-[#8A8178] text-xs tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          14 September 2025 · Bali, Indonesia
        </p>
        <div className="w-10 h-px bg-[#C9A96E]/30 mt-2" />
        <p
          className="text-[#8A8178]/50 text-xs"
          style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
        >
          Made with love ✦
        </p>
      </div>
    </footer>
  );
}
