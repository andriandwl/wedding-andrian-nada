/**
 * app/api/admin/gifts/[id]/route.ts
 *
 * DELETE /api/admin/gifts/:id — hapus catatan (untuk koreksi salah input)
 */
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Gift from "@/models/Gift";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();
  if (!mongoose.Types.ObjectId.isValid(params.id)) return notFound("Catatan tidak ditemukan");

  try {
    await connectDB();
    const item = await Gift.findByIdAndDelete(params.id).lean();
    if (!item) return notFound("Catatan tidak ditemukan");
    return ok({ deleted: true, id: params.id });
  } catch (e) {
    console.error("[DELETE /api/admin/gifts/:id]", e);
    return serverError();
  }
}
