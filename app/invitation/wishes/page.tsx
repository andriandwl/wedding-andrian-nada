import Link from "next/link";

import WishesSection from "@/components/wedding/WishesSection";

export const metadata = { title: "Wishes & Prayers - Nada & Andrian" };
export const dynamic = "force-dynamic";

// ?code=<guest code> (or "preview") makes the back link return to that invitation
export default function WishesPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const back = searchParams.code
    ? `/invitation/${encodeURIComponent(searchParams.code)}`
    : "/invitation";

  return (
    <main className="relative w-full min-h-screen bg-[#FBE7EB]">
      <div className="max-w-xl mx-auto px-6 pt-8">
        <Link
          href={back}
          className="text-xs tracking-[0.22em] uppercase text-[#A6808B] hover:text-[#52363E] transition-colors"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          ← Kembali ke undangan
        </Link>
      </div>
      <WishesSection />
    </main>
  );
}
