/**
 * app/api/photobooth/route.ts
 *
 * GET  /api/photobooth  — galeri publik (hanya isVisible:true, paginated)
 * POST /api/photobooth  — upload foto + audio dari tamu
 */
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { connectDB } from "@/lib/db";
import PhotoBooth from "@/models/PhotoBooth";
import { ok, err, serverError } from "@/lib/api-response";

export const runtime = "nodejs";

// ── GET /api/photobooth ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const total = await PhotoBooth.countDocuments({ isVisible: true });
    const items = await PhotoBooth.find({ isVisible: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("guestName framedPhotoUrl audioUrl audioDuration createdAt")
      .lean();

    return ok({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("[GET /api/photobooth]", e);
    return serverError();
  }
}

// ── POST /api/photobooth ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const guestName = (formData.get("guestName") as string | null)?.trim();
    if (!guestName || guestName.length === 0) {
      return err("VALIDATION_ERROR", "Nama tamu wajib diisi", 400);
    }
    if (guestName.length > 100) {
      return err("VALIDATION_ERROR", "Nama tamu maksimal 100 karakter", 400);
    }

    const guestCode = (formData.get("guestCode") as string | null)?.trim() || null;

    const photo = formData.get("photo") as File | null;
    if (!photo) {
      return err("VALIDATION_ERROR", "Foto wajib diupload", 400);
    }

    const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB
    if (photo.size > MAX_PHOTO_BYTES) {
      return err("VALIDATION_ERROR", "Ukuran foto maksimal 8 MB", 400);
    }

    const audio = formData.get("audio") as File | null;
    const audioDurationRaw = formData.get("audioDuration") as string | null;

    await connectDB();

    // Upload foto ke Vercel Blob
    const timestamp = Date.now();
    const safeName = guestName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
    const photoExt = photo.type.includes("png") ? "png" : "jpg";

    const photoBlob = await put(
      `photobooth/${timestamp}_${safeName}_photo.${photoExt}`,
      photo,
      { access: "public" },
    );

    // Upload audio jika ada
    let audioUrl: string | null = null;
    let audioDuration: number | null = null;

    if (audio && audio.size > 0) {
      const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB
      if (audio.size > MAX_AUDIO_BYTES) {
        return err("VALIDATION_ERROR", "Ukuran audio maksimal 10 MB", 400);
      }

      const audioExt = audio.type.includes("mp4") ? "mp4" : "webm";
      const audioBlob = await put(
        `photobooth/${timestamp}_${safeName}_audio.${audioExt}`,
        audio,
        { access: "public" },
      );
      audioUrl = audioBlob.url;
      audioDuration = audioDurationRaw ? parseFloat(audioDurationRaw) : null;
    }

    const entry = await PhotoBooth.create({
      guestCode,
      guestName,
      framedPhotoUrl: photoBlob.url,
      audioUrl,
      audioDuration,
      isVisible: true,
    });

    return ok(entry.toObject(), 201);
  } catch (e) {
    console.error("[POST /api/photobooth]", e);
    return serverError();
  }
}
