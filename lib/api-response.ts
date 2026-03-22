/**
 * lib/api-response.ts
 * Consistent JSON response format for all API routes.
 *
 * Success:  { ok: true,  data: T }
 * Error:    { ok: false, error: { code, message, details? } }
 */
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function err(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    { ok: false, error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );
}

// Zod validation error → 400
export function zodErr(e: ZodError) {
  return err('VALIDATION_ERROR', 'Validation failed', 400, e.flatten().fieldErrors);
}

// Common shortcuts
export const unauthorized = () => err('UNAUTHORIZED', 'Authentication required', 401);
export const forbidden    = () => err('FORBIDDEN', 'Insufficient permissions', 403);
export const notFound     = (msg = 'Resource not found') => err('NOT_FOUND', msg, 404);
export const conflict     = (msg: string) => err('CONFLICT', msg, 409);
export const serverError  = () => err('INTERNAL_ERROR', 'An unexpected error occurred', 500);
