import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import PhotoboothFlow from "@/components/photobooth/PhotoboothFlow";

export const metadata: Metadata = {
  title: "Virtual Photobooth — Nada & Andrian",
  description: "Ambil foto kenangan dan rekam pesan suara untuk pengantin",
};

type Props = {
  searchParams: { name?: string; code?: string };
};

export default async function PhotoboothPage({ searchParams }: Props) {
  await connectDB();

  let setting: any = await Setting.findOne().lean();
  if (!setting) {
    const newSetting = new Setting();
    await newSetting.save();
    setting = JSON.parse(JSON.stringify(newSetting));
  }

  return (
    <PhotoboothFlow
      settings={setting}
      initialName={searchParams.name ?? ""}
      initialCode={searchParams.code ?? ""}
    />
  );
}
