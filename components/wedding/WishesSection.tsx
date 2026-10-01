import Link from "next/link";
import { connectDB } from "@/lib/db";
import Guest from "@/models/Guest";

// Server component: reads RSVP notes straight from the DB. Only name + note are exposed.
export default async function WishesSection() {
  await connectDB();
  // ponytail: latest 100, add pagination if the list gets longer
  const wishes: any[] = await Guest.find({ "rsvp.note": { $nin: [null, ""] } })
    .select("name rsvp.note rsvp.respondedAt")
    .sort({ "rsvp.respondedAt": -1 })
    .limit(100)
    .lean();

  return (
    <section id="wishes" className="relative w-full py-28 px-6 bg-[#FBE7EB]">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-8">
        <span
          className="text-[#D88C9C] text-xs tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          {wishes.length} Wishes
        </span>
        <h2
          className="text-[clamp(40px,7vw,80px)] leading-none text-[#52363E] italic text-center"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
        >
          Wishes &amp; Prayers
        </h2>

        {wishes.length === 0 ? (
          <p
            className="text-sm text-[#A6808B] text-center"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          <ul className="w-full max-h-[480px] overflow-y-auto flex flex-col gap-3 pr-1">
            {wishes.map((w) => (
              <li
                key={w._id.toString()}
                className="rounded-xl bg-white/70 border border-[#D88C9C]/20 px-5 py-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className="text-[#52363E] text-lg italic"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {w.name}
                  </p>
                  {w.rsvp.respondedAt && (
                    <time
                      className="text-[10px] text-[#A6808B] shrink-0"
                      style={{ fontFamily: "var(--font-jost)" }}
                    >
                      {new Date(w.rsvp.respondedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </div>
                <p
                  className="mt-1 text-sm text-[#52363E]/80 whitespace-pre-line break-words"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {w.rsvp.note}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// Button placed on invitation pages, linking to /invitation/wishes
export function WishesLink({ code }: { code?: string }) {
  return (
    <section className="w-full py-16 px-6 bg-[#FBE7EB] flex justify-center">
      <Link
        href={code ? `/invitation/wishes?code=${encodeURIComponent(code)}` : "/invitation/wishes"}
        className="rounded-full border border-[#52363E]/30 px-8 py-3 text-xs tracking-[0.22em] uppercase text-[#52363E] transition-colors hover:bg-[#52363E] hover:text-[#FBE7EB]"
        style={{ fontFamily: "var(--font-jost)" }}
      >
        Lihat Ucapan &amp; Doa →
      </Link>
    </section>
  );
}
