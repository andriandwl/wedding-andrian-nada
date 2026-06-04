/**
 * app/api/admin/photobooth/qr/route.ts
 *
 * GET /api/admin/photobooth/qr?url=<url>
 * Generate QR Code sebagai base64 data URL.
 * Admin UI bisa tampilkan inline dan tawarkan tombol download PNG.
 */
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdmin } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = req.nextUrl;
  const targetUrl =
    searchParams.get("url") ||
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/photobooth`;

  try {
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      type: "image/png",
      width: 512,
      margin: 3,
      color: {
        dark: "#1a0a0e",
        light: "#FBE7EB",
      },
    });

    return NextResponse.json({
      ok: true,
      data: { qrDataUrl, targetUrl },
    });
  } catch (e) {
    console.error("[GET /api/admin/photobooth/qr]", e);
    return serverError();
  }
}
