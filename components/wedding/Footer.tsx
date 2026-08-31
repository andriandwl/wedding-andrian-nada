export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 bg-[#52363E] border-t border-white/5">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-4 text-center">
        <p
          className="text-[#D88C9C] text-3xl"
          style={{ fontFamily: "var(--font-great-vibes)" }}
        >
          Nada &amp; Andrian
        </p>
        <p
          className="text-[#A6808B] text-xs tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          10 Oktober 2026 · Riau, Indonesia
        </p>
        <div className="w-10 h-px bg-[#D88C9C]/30 mt-2" />
        <p
          className="text-[#A6808B]/50 text-xs"
          style={{ fontFamily: "var(--font-jost)", fontWeight: 300 }}
        >
          Made with love ✦
        </p>
      </div>
    </footer>
  );
}
