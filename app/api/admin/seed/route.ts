/**
 * app/api/admin/seed/route.ts
 *
 * POST /api/admin/seed
 * One-time endpoint to create the first admin account.
 * Only works in development environment.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/admin/seed \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"admin@wedding.com","password":"admin123"}'
 */
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import AdminUser from '@/models/AdminUser';
import { ok, err } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  // Guard: development only
  if (process.env.NODE_ENV !== 'development') {
    return err('FORBIDDEN', 'This endpoint is only available in development', 403);
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return err('BAD_REQUEST', 'Request body harus berupa JSON', 400);
  }

  const { email, password } = body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return err('VALIDATION_ERROR', 'Email tidak valid', 400);
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return err('VALIDATION_ERROR', 'Password minimal 6 karakter', 400);
  }

  try {
    await connectDB();

    const exists = await AdminUser.exists({ email: email.toLowerCase() });
    if (exists) {
      return err('CONFLICT', `Admin dengan email ${email} sudah ada`, 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await AdminUser.create({
      email:    email.toLowerCase(),
      passwordHash,
      role:     'admin',
    });

    return ok({ id: String(admin._id), email: admin.email, role: admin.role }, 201);
  } catch (e) {
    console.error('[POST /api/admin/seed]', e);
    return err('INTERNAL_ERROR', 'Gagal membuat admin', 500);
  }
}
