import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

import Navbar from "@/components/wedding/Navbar";
import HeroScrollGallery from "@/components/wedding/HeroScrollGallery";
import { CoupleStory } from "@/components/wedding/HeroScrollGallery";
import TransitionSection from "@/components/wedding/TransitionSection";
import LoveStoryScrollStack from "@/components/wedding/LoveStoryScrollStack";
import RSVPSectionDynamic from "@/components/wedding/RSVPSectionDynamic";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";

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

      {/* Section 5: RSVP form */}
      <RSVPSectionDynamic code={params.code} guestInfo={sanitizedGuest} />

      {/* Section 6: Gift / digital transfer */}
      <GiftSection settings={setting} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
