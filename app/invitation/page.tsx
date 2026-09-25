import type { Metadata } from "next";

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
      <Navbar />
      <HeroScrollGallery settings={setting} />
      <CoupleStory settings={setting} />
      <TransitionSection settings={setting} />
      <LoveStoryScrollStack />
      <LivePhotoSection />
      <GiftSection settings={setting} />
      <Footer />
      <MusicPlayer />
    </main>
  );
}
