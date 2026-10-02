// Ornament line between light sections — same ✦ motif as TransitionSection
export default function SectionDivider() {
  return (
    <div aria-hidden className="flex items-center gap-5 w-full max-w-xl mx-auto px-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D88C9C]/50" />
      <span
        className="text-[#D88C9C] text-xl select-none"
        style={{ fontFamily: "var(--font-great-vibes)" }}
      >
        ✦
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D88C9C]/50" />
    </div>
  );
}
