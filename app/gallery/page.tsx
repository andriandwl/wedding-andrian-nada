import type { Metadata } from "next";
import GalleryFeed from "@/components/photobooth/GalleryFeed";

export const metadata: Metadata = {
  title: "Galeri Kenangan — Nada & Andrian",
  description: "Foto kenangan para tamu pernikahan Nada & Andrian",
};

export default function GalleryPage() {
  return <GalleryFeed />;
}
