/**
 * app/api/admin/guests/[id]/route.ts
 *
 * GET    /api/admin/guests/:id  — fetch single guest
 * PUT    /api/admin/guests/:id  — update guest
 * DELETE /api/admin/guests/:id  — delete guest
 *
 * All routes require valid admin session.
 */
import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Guest from '@/models/Guest';
import { updateGuestSchema } from '@/lib/validations';
import {
  ok,
  zodErr,
  unauthorized,
  notFound,
  serverError,
  err,
} from '@/lib/api-response';

// ── Validate ObjectId helper ───────────────────────────────────────────────
function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ── GET /api/admin/guests/:id ──────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  if (!isValidId(params.id)) return notFound('Tamu tidak ditemukan');

  try {
    await connectDB();
    const guest = await Guest.findById(params.id).lean();
    if (!guest) return notFound('Tamu tidak ditemukan');
    return ok(guest);
  } catch (e) {
    console.error('[GET /api/admin/guests/:id]', e);
    return serverError();
  }
}

// ── PUT /api/admin/guests/:id ──────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  if (!isValidId(params.id)) return notFound('Tamu tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('BAD_REQUEST', 'Request body harus berupa JSON', 400);
  }

  const parsed = updateGuestSchema.safeParse(body);
  if (!parsed.success) return zodErr(parsed.error);

  try {
    await connectDB();
    const guest = await Guest.findByIdAndUpdate(
      params.id,
      { $set: parsed.data },
      { new: true, runValidators: true },
    ).lean();

    if (!guest) return notFound('Tamu tidak ditemukan');
    return ok(guest);
  } catch (e) {
    console.error('[PUT /api/admin/guests/:id]', e);
    return serverError();
  }
}

// ── DELETE /api/admin/guests/:id ───────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  if (!isValidId(params.id)) return notFound('Tamu tidak ditemukan');

  try {
    await connectDB();
    const guest = await Guest.findByIdAndDelete(params.id).lean();
    if (!guest) return notFound('Tamu tidak ditemukan');
    return ok({ deleted: true, id: params.id });
  } catch (e) {
    console.error('[DELETE /api/admin/guests/:id]', e);
    return serverError();
  }
}
