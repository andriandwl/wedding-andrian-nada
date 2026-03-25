import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";
import { syncNotionToMongo } from "@/lib/notion";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    await syncNotionToMongo();
    return ok({ message: "Sinkronisasi berhasil dijalankan", success: true });
  } catch (error) {
    console.error("[POST /api/admin/sync-notion]", error);
    return serverError();
  }
}
