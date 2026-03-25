/**
 * app/api/admin/guests/route.ts
 * GET  /api/admin/guests  — list with pagination + search
 * POST /api/admin/guests  — create new guest
 */
import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Guest from "@/models/Guest";
import { createGuestSchema } from "@/lib/validations";
import {
  ok,
  zodErr,
  unauthorized,
  conflict,
  serverError,
} from "@/lib/api-response";
import { createNotionGuest } from "@/lib/notion";

// ── GET /api/admin/guests ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") ?? 20)),
    );
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "";
    const category = searchParams.get("category") ?? "";

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      // Case-insensitive search across name, phone, invitationCode
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { invitationCode: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const total = await Guest.countDocuments(query);
    const guests = await Guest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Summary counts
    const [summary] = await Guest.aggregate([
      {
        $group: {
          _id: null,
          totalGuests: { $sum: 1 },
          totalHadir: {
            $sum: { $cond: [{ $eq: ["$rsvp.attending", true] }, 1, 0] },
          },
          totalTidak: {
            $sum: { $cond: [{ $eq: ["$rsvp.attending", false] }, 1, 0] },
          },
          totalPax: { $sum: { $ifNull: ["$rsvp.pax", 0] } },
        },
      },
    ]);

    return ok({
      guests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      summary: summary ?? {
        totalGuests: 0,
        totalHadir: 0,
        totalTidak: 0,
        totalPax: 0,
      },
    });
  } catch (e) {
    console.error("[GET /api/admin/guests]", e);
    return serverError();
  }
}

// ── POST /api/admin/guests ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = createGuestSchema.safeParse(body);
    if (!parsed.success) return zodErr(parsed.error);

    await connectDB();

    // Generate unique invitation code (retry up to 3x on collision)
    let invitationCode = "";
    for (let i = 0; i < 3; i++) {
      const candidate = nanoid(10);
      const exists = await Guest.exists({ invitationCode: candidate });
      if (!exists) {
        invitationCode = candidate;
        break;
      }
    }
    if (!invitationCode) return serverError();

    const payload = { ...parsed.data, invitationCode };

    const guest = await Guest.create(payload);
    console.log(guest);

    // Sync to Notion
    try {
      const pageId = await createNotionGuest(guest);
      if (pageId) {
        guest.notionPageId = pageId;
        await guest.save();
      }
    } catch (notionErr) {
      console.error("[Notion Sync Error on Create]", notionErr);
    }

    return ok(guest.toObject(), 201);
  } catch (e: any) {
    if (e.code === 11000) return conflict("Invitation code already exists");
    console.error("[POST /api/admin/guests]", e);
    return serverError();
  }
}
