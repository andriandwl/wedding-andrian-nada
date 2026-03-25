/**
 * lib/validations.ts
 * Zod schemas shared between server and client.
 */
import { z } from "zod";

export const GuestCategoryEnum = z.enum(["Akad", "Resepsi", "Both"]);
export const GuestStatusEnum = z.enum([
  "Invited",
  "Accepted",
  "Declined",
  "Not Invited",
  "Maybe",
]);

// ── Create / Update guest ──────────────────────────────────────────────────
export const createGuestSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  phone: z.string().max(20).optional().default(""),
  category: GuestCategoryEnum.default("Both"),
  maxPax: z.coerce.number().int().min(1).max(20).default(1),
});

export const updateGuestSchema = createGuestSchema.partial();

// ── RSVP ──────────────────────────────────────────────────────────────────
export const rsvpSchema = z.object({
  attending: z.boolean({ required_error: "Pilih status kehadiran" }),
  pax: z.coerce.number().int().min(1).optional(),
  status: GuestStatusEnum.optional().nullable(),
  category: GuestCategoryEnum.optional().nullable(),
  note: z.string().max(500).optional().default(""),
});

// ── Login ─────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
