// ── lib/data.ts ──────────────────────────────────────────────────────────────
// Central data store for all wedding content
import type { StaticImageData } from "next/image";
import gambar1 from "@/assets/gambar1.jpeg";
import gambar2 from "@/assets/gambar2.jpeg";
import gambar3 from "@/assets/gambar3.jpeg";
import gambar4 from "@/assets/gambar4.jpeg";
import gambar5 from "@/assets/gambar5.jpeg";
import gambar6 from "@/assets/gambar6.jpeg";
import gambar8 from "@/assets/gambar8.jpeg";
import gambar12 from "@/assets/gambar12.png";
import gambarhero1 from "@/assets/gambar-hero1.jpeg";
import gambarhero2 from "@/assets/gambar-hero2.jpeg";
import gambarhero3 from "@/assets/gambar-hero3.jpeg";
import gambarhero4 from "@/assets/gambar-hero4.jpeg";
import gambarhero5 from "@/assets/gambar-hero5.jpeg";
import gambarhero6 from "@/assets/gambar-hero6.jpeg";
import gambarhero7 from "@/assets/gambar-hero7.jpeg";
import gambarhero8 from "@/assets/gambar-hero8.jpeg";
import gambarhero9 from "@/assets/gambar-hero9.jpeg";
import gambarhero13 from "@/assets/gambar13.png";
import gambarhero14 from "@/assets/gambar14.png";
import gambarhero15 from "@/assets/gambar15.png";

import gambar11 from "@/assets/gambar11.jpeg";

export interface GalleryImage {
  id: number;
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
  live?: string; // path .mp4 pendek (muted) → tampil ala Apple Live Photo saat hover/tekan
}

export interface StoryStage {
  id: number;
  label: string; // "stage 01", "stage 02" …
  title: string; // short headline
  description: string; // 1–2 sentence narrative
  photos: GalleryImage[];
}

// ── Gallery images (hero + collage) ──────────────────────────────────────────
// Using Unsplash sourced landscape / couple photos as placeholders
export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: gambar1,
    alt: "Couple on the beach at golden hour",
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    src: gambar2,
    alt: "Wedding bouquet",
    width: 800,
    height: 1000,
  },
  {
    id: 3,
    src: gambar3,
    alt: "Couple embracing at sunset",
    width: 800,
    height: 1000,
  },
  {
    id: 4,
    src: gambar4,
    alt: "Romantic beach walk",
    width: 800,
    height: 1000,
  },
  {
    id: 5,
    src: gambar5,
    alt: "First dance together",
    width: 800,
    height: 1000,
  },
  {
    id: 6,
    src: gambar6,
    alt: "Couple in the garden",
    width: 800,
    height: 1000,
  },
];

// ── Live Photos ─────────────────────────────────────────────────────────────
// Taruh klip pendek muted di public/livephoto/*.mp4 (±2–4 dtk).
// Hapus baris `live` mana pun yang belum ada klipnya → jatuh balik ke foto diam.
export const livePhotos: GalleryImage[] = [
  {
    id: 1,
    src: gambar1,
    live: "/live-photo1.mp4",
    alt: "Momen pantai",
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    src: gambar2,
    live: "/live-photo9.mp4",
    alt: "Buket",
    width: 800,
    height: 1000,
  },
  {
    id: 3,
    src: gambar3,
    live: "/live-photo6.mp4",
    alt: "Senja",
    width: 800,
    height: 1000,
  },
  {
    id: 4,
    src: gambar4,
    live: "/live-photo2.mp4",
    alt: "Jalan berdua",
    width: 800,
    height: 1000,
  },
  {
    id: 5,
    src: gambar4,
    live: "/live-photo7.mp4",
    alt: "Jalan berdua",
    width: 800,
    height: 1000,
  },
  {
    id: 6,
    src: gambar4,
    live: "/live-photo3.mp4",
    alt: "Jalan berdua",
    width: 800,
    height: 1000,
  },
];

export const galleryHeroImages: GalleryImage[] = [
  {
    id: 1,
    src: gambarhero1,
    alt: "Couple on the beach at golden hour",
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    src: gambarhero2,
    alt: "Wedding bouquet",
    width: 800,
    height: 1000,
  },
  {
    id: 3,
    src: gambarhero3,
    alt: "Couple embracing at sunset",
    width: 800,
    height: 1000,
  },
  {
    id: 4,
    src: gambarhero4,
    alt: "Romantic beach walk",
    width: 800,
    height: 1000,
  },
  {
    id: 5,
    src: gambarhero5,
    alt: "First dance together",
    width: 800,
    height: 1000,
  },
  {
    id: 6,
    src: gambarhero6,
    alt: "Couple in the garden",
    width: 800,
    height: 1000,
  },
  {
    id: 7,
    src: gambarhero7,
    alt: "Romantic beach walk",
    width: 800,
    height: 1000,
  },
  {
    id: 8,
    src: gambarhero8,
    alt: "First dance together",
    width: 800,
    height: 1000,
  },
];

// ── Love Story stages ─────────────────────────────────────────────────────────
export const storyStages: StoryStage[] = [
  {
    id: 1,
    label: "stage 01",
    title: "Where It All Began",
    description:
      "In the quiet bustle of a Jakarta office, two strangers arrived on the same page of a brand-new chapter, both newcomers, both still finding their way.\n\nWe were only colleagues then. A passing greeting, a shared laugh over coffee, small conversations that seemed to mean nothing at all. Neither of us knew that the most ordinary of days was quietly writing the first line of our forever.",
    photos: [
      {
        id: 101,
        src: gambar6,
        alt: "Coffee shop first meeting",
        width: 600,
        height: 750,
      },
      {
        id: 102,
        src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
        alt: "Walking together in the city",
        width: 600,
        height: 750,
      },
      {
        id: 103,
        src: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=600&q=80",
        alt: "Laughing in the park",
        width: 600,
        height: 750,
      },
    ],
  },
  {
    id: 2,
    label: "stage 02",
    title: "When Our Story Began",
    description:
      "A few months later, he chose a different path and said goodbye to the office where it all started.\n\nAnd yet, as if the universe had its own plans, distance did not pull us apart. It drew us closer. The days without seeing each other taught us how much those small moments had mattered. Conversations became care, care became comfort, and comfort slowly bloomed into love. Until one day, we decided to walk the road ahead hand in hand.",
    photos: [
      {
        id: 201,
        src: gambarhero1,
        alt: "Road trip adventure",
        width: 600,
        height: 750,
      },
      {
        id: 202,
        src: gambarhero2,
        alt: "Sunset at the coast",
        width: 600,
        height: 750,
      },
      {
        id: 203,
        src: gambarhero3,
        alt: "Exploring together",
        width: 600,
        height: 750,
      },
    ],
  },
  {
    id: 3,
    label: "stage 03",
    title: "Toward the Same Destination",
    description:
      "Love, we learned, is not a path paved only with flowers.\n\nThere were differences to embrace, laughter that filled our days, tears that tested our hearts, and storms that taught us to hold on a little tighter. Each season shaped us, teaching us to listen more deeply and to love more patiently.\n\nThen came the day he stood before her parents, heart full and hands steady, asking for their blessing to turn two lives into one home. 💍",
    photos: [
      {
        id: 301,
        src: gambarhero14,
        alt: "The proposal moment",
        width: 600,
        height: 750,
      },
      {
        id: 302,
        src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
        alt: "Engagement ring",
        width: 600,
        height: 750,
      },
      {
        id: 303,
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
        alt: "Celebrating engagement",
        width: 600,
        height: 750,
      },
    ],
  },
  {
    id: 4,
    label: "stage 04",
    title: "Where Forever Begins",
    description:
      "On October 10, just two days after her birthday, we will stand in the town where she first opened her eyes to the world, and promise ourselves to each other for a lifetime.\n\nWhat began as a chance meeting between two newcomers in Jakarta has become a love we choose, again and again. Now, with grateful hearts, we are ready to begin our most beautiful chapter: as husband and wife.",
    photos: [
      {
        id: 401,
        src: gambarhero13,
        alt: "Bali ceremony venue",
        width: 600,
        height: 750,
      },
      {
        id: 402,
        src: gambarhero15,
        alt: "Beach wedding setup",
        width: 600,
        height: 750,
      },
    ],
  },
];
