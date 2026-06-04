/**
 * app/api/admin/photobooth/[id]/route.ts
 *
 * PATCH  /api/admin/photobooth/:id  — toggle visibilitas (tampil/sembunyikan)
 * DELETE /api/admin/photobooth/:id  — hapus permanen dari DB + Blob storage
 */
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { del } from "@vercel/blob";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import PhotoBooth from "@/models/PhotoBooth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── PATCH: toggle isVisible ───────────────────────────────────────────────────
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  if (!isValidId(params.id)) return notFound("Foto tidak ditemukan");

  try {
    await connectDB();
    const item = await PhotoBooth.findById(params.id);
    if (!item) return notFound("Foto tidak ditemukan");

    item.isVisible = !item.isVisible;
    await item.save();

    return ok({ id: params.id, isVisible: item.isVisible });
  } catch (e) {
    console.error("[PATCH /api/admin/photobooth/:id]", e);
    return serverError();
  }
}

// ── DELETE: hapus permanen ────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  if (!isValidId(params.id)) return notFound("Foto tidak ditemukan");

  try {
    await connectDB();
    const item = await PhotoBooth.findByIdAndDelete(params.id).lean();
    if (!item) return notFound("Foto tidak ditemukan");

    // Hapus file dari Vercel Blob (non-blocking, fail gracefully)
    const urlsToDelete = [item.framedPhotoUrl, item.audioUrl].filter(
      (u): u is string => !!u,
    );
    if (urlsToDelete.length > 0) {
      del(urlsToDelete).catch((e) =>
        console.error("[Blob delete error]", e),
      );
    }

    return ok({ deleted: true, id: params.id });
  } catch (e) {
    console.error("[DELETE /api/admin/photobooth/:id]", e);
    return serverError();
  }
}
