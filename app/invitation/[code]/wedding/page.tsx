import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import RSVPSectionDynamic from "@/components/wedding/RSVPSectionDynamic";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";
import MusicPlayer from "@/components/wedding/MusicPlayer";
import coupleImg from "@/assets/brideandgroom.jpeg";

import { connectDB } from "@/lib/db";
import Guest from "@/models/Guest";
import Setting from "@/models/Setting";

type Props = { params: { code: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const guest: any = await Guest.findOne({
    invitationCode: params.code,
  }).lean();
  if (!guest) return { title: "Undangan Tidak Ditemukan" };
  return { title: `Pernikahan Nada & Andrian - Undangan untuk ${guest.name}` };
}

// Simple version of the invitation: no scroll animations, essentials only.
export default async function SimpleInvitationPage({ params }: Props) {
  await connectDB();
  const guest: any = await Guest.findOne({ invitationCode: params.code })
    .select("name category maxPax status rsvp")
    .lean();
  if (!guest) return notFound();

  // ponytail: read-only here; the full page creates the default Setting doc
  const s: any = (await Setting.findOne().lean()) ?? {};
  const date = s.weddingDate
    ? new Date(`${s.weddingDate}T${s.resepsiTime || "16:00"}:00+07:00`)
    : null;
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    date?.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", ...o });

  const serif = { fontFamily: "var(--font-cormorant)" };
  const sans = { fontFamily: "var(--font-jost)" };

  return (
    <main className="w-full min-h-screen bg-[#FBE7EB] text-[#52363E]">
      {/* Hero */}
      <section className="relative h-[100svh] w-full">
        <Image
          src={coupleImg}
          alt="Nada & Andrian"
          fill
          priority
          placeholder="blur"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a1f]/85 via-[#2a1a1f]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 text-center text-white">
          <p
            className="text-[0.65rem] tracking-[0.3em] uppercase opacity-80"
            style={sans}
          >
            The Wedding of
          </p>
          <h1 className="mt-2 text-5xl italic font-light" style={serif}>
            {s.brideName || "Nada"} &amp; {s.groomName || "Andrian"}
          </h1>
          {date && (
            <p className="mt-3 text-sm tracking-widest" style={sans}>
              {fmt({
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <p className="mt-8 text-xs opacity-80" style={sans}>
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <p className="mt-1 text-2xl" style={serif}>
            {guest.name}
          </p>
        </div>
      </section>

      {/* Couple */}
      <section className="px-6 py-16 text-center max-w-xl mx-auto">
        <p className="text-sm leading-relaxed" style={sans}>
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
          menyelenggarakan pernikahan kami:
        </p>
        <h2 className="mt-10 text-3xl" style={serif}>
          {s.brideFullName || "Denada Putri"}
        </h2>
        <p className="mt-1 text-xs text-[#A6808B]" style={sans}>
          Putri dari {s.brideParents}
        </p>
        <p className="my-6 text-3xl text-[#D88C9C]" style={serif}>
          &amp;
        </p>
        <h2 className="text-3xl" style={serif}>
          {s.groomFullName || "Andrian Dwi Haryanto"}
        </h2>
        <p className="mt-1 text-xs text-[#A6808B]" style={sans}>
          Putra dari {s.groomParents}
        </p>
      </section>

      {/* Event */}
      <section className="px-6 pb-16">
        <div className="max-w-xl mx-auto rounded-2xl border border-[#D88C9C]/30 bg-white/50 p-8 text-center">
          <p
            className="text-[0.65rem] tracking-[0.3em] uppercase text-[#D88C9C]"
            style={sans}
          >
            Waktu &amp; Tempat
          </p>
          {date && (
            <p className="mt-4 text-2xl" style={serif}>
              {fmt({
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <div className="mt-4 space-y-1 text-sm" style={sans}>
            <p>Akad Nikah · {s.akadTime || "10:00"} WIB</p>
            <p>Resepsi · {s.resepsiTime || "16:00"} WIB</p>
          </div>
          <p className="mt-6 text-xl" style={serif}>
            {s.venueName}
          </p>
          <p
            className="mt-1 text-xs text-[#A6808B] whitespace-pre-line"
            style={sans}
          >
            {[s.venueAddress, s.venueCity].filter(Boolean).join("\n")}
          </p>
          {s.mapsLink && (
            <a
              href={s.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-[#52363E] px-6 py-3 text-xs tracking-widest uppercase text-white"
              style={sans}
            >
              Buka Google Maps
            </a>
          )}
        </div>
      </section>

      <RSVPSectionDynamic
        code={params.code}
        guestInfo={{ ...guest, _id: guest._id.toString() }}
      />
      <GiftSection settings={JSON.parse(JSON.stringify(s))} />
      <Footer />
      {/* <MusicPlayer /> */}
    </main>
  );
}
