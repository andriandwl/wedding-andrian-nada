import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

import Navbar from "@/components/wedding/Navbar";
import OpeningScreen from "@/components/wedding/OpeningScreen";
import HeroScrollGallery, {
  CoupleStory,
} from "@/components/wedding/HeroScrollGallery";
import TransitionSection from "@/components/wedding/TransitionSection";
import LoveStoryScrollStack from "@/components/wedding/LoveStoryScrollStack";
import LivePhotoSection from "@/components/wedding/LivePhotoSection";
import RSVPSectionDynamic from "@/components/wedding/RSVPSectionDynamic";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";
import MusicPlayer from "@/components/wedding/MusicPlayer";

import { connectDB } from "@/lib/db";
import Guest from "@/models/Guest";
import Setting from "@/models/Setting";

type Props = {
  params: { code: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  await connectDB();
  const guest: any = await Guest.findOne({
    invitationCode: params.code,
  }).lean();

  if (!guest) return { title: "Undangan Tidak Ditemukan" };
  return {
    title: `Pernikahan Nada & Andrian - Undangan untuk ${guest.name}`,
  };
}

export default async function InvitationPage({ params }: Props) {
  // Fetch guest directly on server
  await connectDB();
  const guest: any = await Guest.findOne({ invitationCode: params.code })
    .select("name category maxPax status rsvp")
    .lean();

  if (!guest) {
    return notFound();
  }

  let setting: any = await Setting.findOne().lean();
  if (!setting) {
    const newSetting = new Setting();
    await newSetting.save();
    setting = JSON.parse(JSON.stringify(newSetting));
  }

  // Convert MongoDB ObjectIds to string for client components
  const sanitizedGuest = {
    ...guest,
    _id: guest._id.toString(),
  };

  return (
    <main className="relative w-full min-h-screen bg-[#FBE7EB]">
      {/* Video cover + "Buka Undangan" button */}
      <OpeningScreen guestName={guest.name} />

      {/* Sticky pill navbar */}
      <Navbar />

      {/* Section 1: Full-screen hero → scroll-morphing collage */}
      <HeroScrollGallery guestName={guest.name} settings={setting} />

      {/* Section 2: Couple profiles + love story timeline */}
      <CoupleStory settings={setting} />

      {/* Section 3: Quote + event details + countdown */}
      <TransitionSection settings={setting} />

      {/* Section 4: Love story with polaroid stack animation */}
      <LoveStoryScrollStack />

      {/* Section 5: Live Photos gallery */}
      <LivePhotoSection />

      {/* Section 6: RSVP form */}
      <RSVPSectionDynamic code={params.code} guestInfo={sanitizedGuest} />

      {/* Section 6: Gift / digital transfer */}
      <GiftSection settings={setting} />

      {/* Footer */}
      <Footer />

      {/* Floating Photobooth button */}
      <Link
        href={`/photobooth?name=${encodeURIComponent(guest.name)}&code=${params.code}`}
        aria-label="Photobooth"
        className="fixed bottom-20 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full
          bg-[#52363E] text-white shadow-lg transition-all hover:bg-[#3d2830] active:scale-95"
        style={{ boxShadow: "0 4px 24px rgba(82,54,62,0.35)" }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M9 3 7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        </svg>
      </Link>

      {/* Background music */}
      <MusicPlayer />
    </main>
  );
}
