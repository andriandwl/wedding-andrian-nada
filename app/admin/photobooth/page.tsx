import type { Metadata } from "next";
import PhotoboothAdminClient from "@/components/admin/PhotoboothAdminClient";

export const metadata: Metadata = { title: "Photobooth & QR Code" };

export default function PhotoboothAdminPage() {
  return <PhotoboothAdminClient />;
}
