import Navbar from "@/components/wedding/Navbar";
import HeroScrollGallery from "@/components/wedding/HeroScrollGallery";
import { CoupleStory } from "@/components/wedding/HeroScrollGallery";
import TransitionSection from "@/components/wedding/TransitionSection";
import LoveStoryScrollStack from "@/components/wedding/LoveStoryScrollStack";
import RSVPSection from "@/components/wedding/RSVPSection";
import GiftSection from "@/components/wedding/GiftSection";
import Footer from "@/components/wedding/Footer";

export default function WeddingPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#F5F0E8]">
      {/* Sticky pill navbar */}
      <Navbar />

      {/* Section 1: Full-screen hero → scroll-morphing collage */}
      <HeroScrollGallery />

      {/* Section 2: Couple profiles + love story timeline */}
      <CoupleStory />

      {/* Section 3: Quote + event details + countdown */}
      <TransitionSection />

      {/* Section 4: Love story with polaroid stack animation */}
      <LoveStoryScrollStack />

      {/* Section 5: RSVP form */}
      <RSVPSection />

      {/* Section 6: Gift / digital transfer */}
      <GiftSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
