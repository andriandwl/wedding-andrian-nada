import type { Metadata } from "next";

import Navbar from "@/components/wedding/Navbar";
import HeroScrollGallery from "@/components/wedding/HeroScrollGallery";
import { CoupleStory } from "@/components/wedding/HeroScrollGallery";
import TransitionSection from "@/components/wedding/TransitionSection";
import LoveStoryScrollStack from "@/components/wedding/LoveStoryScrollStack";
import RSVPSectionDynamic from "@/components/wedding/RSVPSectionDynamic";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";

import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

export const metadata: Metadata = {
  title: "Preview Undangan - Nada & Andrian",
};

export default async function PreviewPage() {
  await connectDB();
  
  let setting: any = await Setting.findOne().lean();
  if (!setting) {
    const newSetting = new Setting();
    await newSetting.save();
    setting = JSON.parse(JSON.stringify(newSetting));
  }

  // Dummy guest for preview purposes
  const sanitizedGuest = {
    _id: "preview-id",
    name: "Nama Tamu (Preview)",
    category: "Both",
    maxPax: 2,
    status: "INVITED",
    rsvp: {
      attending: null,
      pax: null,
      category: null,
      note: null,
      respondedAt: null,
    },
  };

  return (
    <main className="relative w-full min-h-screen bg-[#FBE7EB]">
      {/* Sticky pill navbar */}
      <Navbar />

      {/* Section 1: Full-screen hero → scroll-morphing collage */}
      <HeroScrollGallery guestName={sanitizedGuest.name} settings={setting} />

      {/* Section 2: Couple profiles + love story timeline */}
      <CoupleStory settings={setting} />

      {/* Section 3: Quote + event details + countdown */}
      <TransitionSection settings={setting} />

      {/* Section 4: Love story with polaroid stack animation */}
      <LoveStoryScrollStack />

      {/* Section 5: RSVP form */}
      <RSVPSectionDynamic code="PREVIEW" guestInfo={sanitizedGuest as any} />

      {/* Section 6: Gift / digital transfer */}
      <GiftSection settings={setting} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
