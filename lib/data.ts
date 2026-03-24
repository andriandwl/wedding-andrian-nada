// ── lib/data.ts ──────────────────────────────────────────────────────────────
// Central data store for all wedding content

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
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
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80",
    alt: "Couple on the beach at golden hour",
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    alt: "Wedding bouquet",
    width: 800,
    height: 1000,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
    alt: "Couple embracing at sunset",
    width: 800,
    height: 1000,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    alt: "Romantic beach walk",
    width: 800,
    height: 1000,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    alt: "First dance together",
    width: 800,
    height: 1000,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    alt: "Couple in the garden",
    width: 800,
    height: 1000,
  },
];

// ── Love Story stages ─────────────────────────────────────────────────────────
export const storyStages: StoryStage[] = [
  {
    id: 1,
    label: "stage 01",
    title: "How We Met",
    description:
      "It was a rainy afternoon in Jakarta when Andrian bumped into Nada at a small bookstore. They spent three hours talking about everything — and forgot it was still raining.",
    photos: [
      {
        id: 101,
        src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&q=80",
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
    title: "First Adventure",
    description:
      "Six months later they drove to the coast with no map and no plan. That trip taught them they were better together than apart.",
    photos: [
      {
        id: 201,
        src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
        alt: "Road trip adventure",
        width: 600,
        height: 750,
      },
      {
        id: 202,
        src: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=80",
        alt: "Sunset at the coast",
        width: 600,
        height: 750,
      },
      {
        id: 203,
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
        alt: "Exploring together",
        width: 600,
        height: 750,
      },
    ],
  },
  {
    id: 3,
    label: "stage 03",
    title: "The Proposal",
    description:
      "Under a thousand paper stars that Andrian spent weeks folding, he asked the question Nada had been quietly hoping for. She said yes before he finished the sentence.",
    photos: [
      {
        id: 301,
        src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80",
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
    title: "Forever Begins",
    description:
      "Now we invite you to witness the next chapter — our wedding in Bali, surrounded by family, friends, and the ocean we both love.",
    photos: [
      {
        id: 401,
        src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80",
        alt: "Bali ceremony venue",
        width: 600,
        height: 750,
      },
      {
        id: 402,
        src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80",
        alt: "Beach wedding setup",
        width: 600,
        height: 750,
      },
      {
        id: 403,
        src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
        alt: "Wedding details",
        width: 600,
        height: 750,
      },
    ],
  },
];
