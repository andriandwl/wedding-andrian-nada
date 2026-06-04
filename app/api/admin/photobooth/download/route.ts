/**
 * app/api/admin/photobooth/download/route.ts
 *
 * GET /api/admin/photobooth/download
 * Mengunduh semua foto + audio yang visible dalam satu file ZIP.
 * Maksimum 200 entri untuk mencegah timeout serverless.
 */
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import PhotoBooth from "@/models/PhotoBooth";
import { unauthorized, serverError, err } from "@/lib/api-response";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    await connectDB();

    const items = await PhotoBooth.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    if (items.length === 0) {
      return err("NOT_FOUND", "Belum ada foto untuk diunduh", 404);
    }

    const zip = new JSZip();
    const photosFolder = zip.folder("photos")!;
    const audioFolder = zip.folder("audio")!;

    await Promise.allSettled(
      items.map(async (item, i) => {
        const safeName = item.guestName
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "_")
          .slice(0, 40);
        const index = String(i + 1).padStart(3, "0");
        const prefix = `${index}_${safeName}`;

        // Foto
        try {
          const photoRes = await fetch(item.framedPhotoUrl);
          if (photoRes.ok) {
            const photoBuffer = await photoRes.arrayBuffer();
            const ext = item.framedPhotoUrl.endsWith(".png") ? "png" : "jpg";
            photosFolder.file(`${prefix}_photo.${ext}`, photoBuffer);
          }
        } catch (e) {
          console.error(`[ZIP] gagal fetch foto ${item._id}`, e);
        }

        // Audio
        if (item.audioUrl) {
          try {
            const audioRes = await fetch(item.audioUrl);
            if (audioRes.ok) {
              const audioBuffer = await audioRes.arrayBuffer();
              const ext = item.audioUrl.includes(".mp4") ? "mp4" : "webm";
              audioFolder.file(`${prefix}_voice.${ext}`, audioBuffer);
            }
          } catch (e) {
            console.error(`[ZIP] gagal fetch audio ${item._id}`, e);
          }
        }
      }),
    );

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    const now = new Date().toISOString().slice(0, 10);
    return new NextResponse(new Blob([zipBuffer], { type: "application/zip" }), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="photobooth_${now}.zip"`,
      },
    });
  } catch (e) {
    console.error("[GET /api/admin/photobooth/download]", e);
    return serverError();
  }
}
