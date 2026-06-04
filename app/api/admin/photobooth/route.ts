/**
 * app/api/admin/photobooth/route.ts
 *
 * GET /api/admin/photobooth — semua foto termasuk yang disembunyikan (admin only)
 */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import PhotoBooth from "@/models/PhotoBooth";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const total = await PhotoBooth.countDocuments();
    const items = await PhotoBooth.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const [summary] = await PhotoBooth.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalVisible: { $sum: { $cond: ["$isVisible", 1, 0] } },
          totalHidden: { $sum: { $cond: ["$isVisible", 0, 1] } },
          totalWithAudio: {
            $sum: { $cond: [{ $ifNull: ["$audioUrl", false] }, 1, 0] },
          },
        },
      },
    ]);

    return ok({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: summary ?? { total: 0, totalVisible: 0, totalHidden: 0, totalWithAudio: 0 },
    });
  } catch (e) {
    console.error("[GET /api/admin/photobooth]", e);
    return serverError();
  }
}
