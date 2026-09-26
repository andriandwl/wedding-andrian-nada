import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/wedding/Navbar";
import OpeningScreen from "@/components/wedding/OpeningScreen";
import HeroScrollGallery, {
  CoupleStory,
} from "@/components/wedding/HeroScrollGallery";
import TransitionSection from "@/components/wedding/TransitionSection";
import LoveStoryScrollStack from "@/components/wedding/LoveStoryScrollStack";
import LivePhotoSection from "@/components/wedding/LivePhotoSection";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";
import MusicPlayer from "@/components/wedding/MusicPlayer";

import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

export const metadata: Metadata = {
  title: "Pernikahan Nada & Andrian",
};

// Public invitation without a guest name. RSVP is omitted since it needs a guest code.
export default async function PublicInvitationPage() {
  await connectDB();

  let setting: any = await Setting.findOne().lean();
  if (!setting) {
    const newSetting = new Setting();
    await newSetting.save();
    setting = JSON.parse(JSON.stringify(newSetting));
  }

  return (
    <main className="relative w-full min-h-screen bg-[#FBE7EB]">
      <OpeningScreen />
      <Navbar hideRsvp />
      <HeroScrollGallery settings={setting} />
      <CoupleStory settings={setting} />
      <TransitionSection settings={setting} />
      <LoveStoryScrollStack />
      <LivePhotoSection />
      <GiftSection settings={setting} />
      <Footer />
      {/* Floating Photobooth button */}
      <Link
        href="/photobooth"
        aria-label="Photobooth"
        className="fixed bottom-20 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full
          bg-[#52363E] text-white shadow-lg transition-all hover:bg-[#3d2830] active:scale-95"
        style={{ boxShadow: "0 4px 24px rgba(82,54,62,0.35)" }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M9 3 7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        </svg>
      </Link>

      <MusicPlayer />
    </main>
  );
}
