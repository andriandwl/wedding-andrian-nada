import type { Metadata } from "next";
import GiftsAdminClient from "@/components/admin/GiftsAdminClient";

export const metadata: Metadata = { title: "Amplop & Kado" };

export default function GiftsAdminPage() {
  return <GiftsAdminClient />;
}
