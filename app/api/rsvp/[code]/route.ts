/**
 * app/api/rsvp/[code]/route.ts
 *
 * GET  /api/rsvp/:code  — fetch guest info for invitation page (public)
 * POST /api/rsvp/:code  — submit RSVP response (public)
 *
 * Security:
 *  - Guests can only update their own record (scoped by invitationCode)
 *  - pax is validated against maxPax
 *  - All input validated via Zod
 */
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Guest from "@/models/Guest";
import { rsvpSchema } from "@/lib/validations";
import { ok, zodErr, notFound, err, serverError } from "@/lib/api-response";

// ── GET /api/rsvp/:code ────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    await connectDB();

    const guest = await Guest.findOne({ invitationCode: params.code })
      .select("name category maxPax status rsvp")
      .lean();

    if (!guest) return notFound("Undangan tidak ditemukan");

    return ok(guest);
  } catch (e) {
    console.error("[GET /api/rsvp/:code]", e);
    return serverError();
  }
}

// ── POST /api/rsvp/:code ───────────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } },
) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("BAD_REQUEST", "Request body harus berupa JSON", 400);
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) return zodErr(parsed.error);

  const { attending, pax, category, note } = parsed.data;

  try {
    await connectDB();

    const guest = await Guest.findOne({ invitationCode: params.code });
    if (!guest) return notFound("Undangan tidak ditemukan");

    // Validate pax against maxPax
    if (attending) {
      if (!category) {
        return err("VALIDATION_ERROR", "Pilih kategori undangan", 400);
      }

      const finalPax = pax ?? 1;
      if (finalPax < 1) {
        return err("VALIDATION_ERROR", "Jumlah pax minimal 1", 400);
      }
      if (finalPax > guest.maxPax) {
        return err(
          "VALIDATION_ERROR",
          `Jumlah pax tidak boleh lebih dari ${guest.maxPax}`,
          400,
          { maxPax: guest.maxPax },
        );
      }
      guest.rsvp = {
        attending: true,
        pax: finalPax,
        status: "Accepted",
        note: note?.trim() || null,
        respondedAt: new Date(),
      };
      guest.category = category;
      guest.status = "CONFIRMED";
    } else {
      guest.rsvp = {
        attending: false,
        pax: null,
        status: "Declined",
        note: note?.trim() || null,
        respondedAt: new Date(),
      };
      guest.category = null;
      guest.status = "DECLINED";
    }

    await guest.save();

    // Sync to Notion - only update fields that RSVP changes!
    if (guest.notionPageId) {
      const { updateNotionGuest } = await import("@/lib/notion");
      updateNotionGuest(guest.notionPageId, {
        rsvp: guest.rsvp,
        category: guest.category,
        status: guest.status,
      }).catch(console.error);
    }

    return ok({
      message: "RSVP berhasil disimpan",
      status: guest.status,
      name: guest.name,
    });
  } catch (e) {
    console.error("[POST /api/rsvp/:code]", e);
    return serverError();
  }
}
