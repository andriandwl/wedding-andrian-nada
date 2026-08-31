import Navbar from "@/components/wedding/Navbar";
import HeroScrollGallery from "@/components/wedding/HeroScrollGallery";
import { CoupleStory } from "@/components/wedding/HeroScrollGallery";
import TransitionSection from "@/components/wedding/TransitionSection";
import LoveStoryScrollStack from "@/components/wedding/LoveStoryScrollStack";
import RSVPSection from "@/components/wedding/RSVPSection";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";
import MusicPlayer from "@/components/wedding/MusicPlayer";

export default function WeddingPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#FBE7EB]">
      {/* Sticky pill navbar */}
      <Navbar />

      {/* Section 1: Full-screen hero → scroll-morphing collage */}
      <HeroScrollGallery />

      {/* Section 2: Couple profiles + love story timeline */}
      <CoupleStory />

      {/* Section 3: Couple profiles + love story timeline */}
      <CoupleStory />

      {/* Section 4: Quote + event details + countdown */}
      <TransitionSection />

      {/* Section 5: Love story with polaroid stack animation */}
      <LoveStoryScrollStack />

      {/* Section 6: RSVP form */}
      <RSVPSection />

      {/* Section 7: Gift / digital transfer */}
      <GiftSection />

      {/* Footer */}
      <Footer />

      {/* Background music */}
      <MusicPlayer />
    </div>
  );
}
