/**
 * app/api/admin/gifts/route.ts
 *
 * GET  /api/admin/gifts — semua catatan amplop/transfer/kado + ringkasan
 * POST /api/admin/gifts — tambah catatan baru
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Gift, { GIFT_TYPES } from "@/models/Gift";
import { ok, err, unauthorized, zodErr, serverError } from "@/lib/api-response";

const GiftInput = z
  .object({
    guestName: z.string().trim().min(1, "Nama wajib diisi").max(120),
    type: z.enum(GIFT_TYPES),
    amount: z.number().int().min(0).max(1_000_000_000).default(0),
    item: z.string().trim().max(200).default(""),
    note: z.string().trim().max(300).default(""),
  })
  .refine((g) => (g.type === "kado" ? g.item.length > 0 : g.amount > 0), {
    message: "Isi nominal untuk amplop/transfer, atau isi barang untuk kado",
    path: ["amount"],
  });

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    await connectDB();
    // ponytail: no pagination, a wedding has hundreds of gifts at most
    const items = await Gift.find().sort({ createdAt: -1 }).lean();
    return ok({ items });
  } catch (e) {
    console.error("[GET /api/admin/gifts]", e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("BAD_REQUEST", "Invalid JSON", 400);
  }

  const parsed = GiftInput.safeParse(body);
  if (!parsed.success) return zodErr(parsed.error);

  const data = parsed.data;
  if (data.type === "kado") data.amount = 0;

  try {
    await connectDB();
    const gift = await Gift.create(data);
    return ok(gift.toObject(), 201);
  } catch (e) {
    console.error("[POST /api/admin/gifts]", e);
    return serverError();
  }
}
