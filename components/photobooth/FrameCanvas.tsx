"use client";

import { useEffect, useState } from "react";

export type FrameStyle = "classic" | "dark" | "minimal";

interface Settings {
  brideName?: string;
  groomName?: string;
  brideFullName?: string;
  groomFullName?: string;
  weddingDate?: string;
  venueName?: string;
  photoboothFrameStyle?: FrameStyle;
}

interface Props {
  photoBlob: Blob;
  settings: Settings;
  signatureDataUrl?: string;
  onFrameReady: (blob: Blob, dataUrl: string) => void;
}

// ── Frame style tokens ─────────────────────────────────────────────────────────
const STYLES: Record<
  FrameStyle,
  {
    bg: string;
    shadowColor: string;
    ruleColor: string;
    ornamentColor: string;
    nameColor: string;
    nameFontStyle: string;
    dateColor: string;
    venueColor: string;
  }
> = {
  classic: {
    bg: "#FFFEF9",
    shadowColor: "rgba(82,54,62,0.18)",
    ruleColor: "rgba(216,140,156,0.35)",
    ornamentColor: "#D88C9C",
    nameColor: "#52363E",
    nameFontStyle: "italic",
    dateColor: "#A6808B",
    venueColor: "rgba(138,129,120,0.55)",
  },
  dark: {
    bg: "#1a0a0e",
    shadowColor: "rgba(216,140,156,0.12)",
    ruleColor: "rgba(216,140,156,0.25)",
    ornamentColor: "#D88C9C",
    nameColor: "#FBE7EB",
    nameFontStyle: "italic",
    dateColor: "#A6808B",
    venueColor: "rgba(216,140,156,0.45)",
  },
  minimal: {
    bg: "#FFFFFF",
    shadowColor: "rgba(0,0,0,0.10)",
    ruleColor: "rgba(0,0,0,0.12)",
    ornamentColor: "#888888",
    nameColor: "#111111",
    nameFontStyle: "normal",
    dateColor: "#666666",
    venueColor: "rgba(0,0,0,0.30)",
  },
};

// ── Load image helper ──────────────────────────────────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ── Main renderer ──────────────────────────────────────────────────────────────
async function renderPolaroid(
  photoBlob: Blob,
  settings: Settings,
  signatureDataUrl?: string,
): Promise<{ blob: Blob; dataUrl: string }> {
  const W = 800;
  const H = 1000;
  const PAD = 36;
  const PHOTO_SIZE = W - PAD * 2; // 728

  const style = STYLES[settings.photoboothFrameStyle ?? "classic"];

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  await document.fonts.ready;

  // === BACKGROUND ===
  ctx.fillStyle = style.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle bottom vignette
  const grad = ctx.createLinearGradient(0, H - 80, 0, H);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, `rgba(0,0,0,0.03)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 80, W, 80);

  // === PHOTO ===
  const photoUrl = URL.createObjectURL(photoBlob);
  const img = await loadImage(photoUrl);

  const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
  const srcX = (img.naturalWidth - srcSize) / 2;
  const srcY = (img.naturalHeight - srcSize) / 2;

  ctx.save();
  ctx.shadowColor = style.shadowColor;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 3;
  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, PAD, PAD, PHOTO_SIZE, PHOTO_SIZE);
  ctx.restore();

  URL.revokeObjectURL(photoUrl);

  // === SIGNATURE OVERLAY ===
  if (signatureDataUrl) {
    const sigImg = await loadImage(signatureDataUrl);
    // Place signature in bottom-right of photo area
    const sigW = PHOTO_SIZE * 0.5;
    const sigH = PHOTO_SIZE * 0.15;
    const sigX = PAD + PHOTO_SIZE - sigW - 10;
    const sigY = PAD + PHOTO_SIZE - sigH - 10;

    ctx.save();
    ctx.globalAlpha = 0.75;
    // For dark style, invert signature color by using "difference" composite
    if (settings.photoboothFrameStyle === "dark") {
      ctx.filter = "invert(1)";
    }
    ctx.drawImage(sigImg, sigX, sigY, sigW, sigH);
    ctx.restore();
  }

  // === TEXT AREA ===
  const TEXT_TOP = PAD + PHOTO_SIZE + 10;

  const brideName = settings.brideName || settings.brideFullName || "Pengantin";
  const groomName = settings.groomName || settings.groomFullName || "Pengantin";

  // Top rule
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = style.ruleColor;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 80, TEXT_TOP + 22);
  ctx.lineTo(W / 2 + 80, TEXT_TOP + 22);
  ctx.stroke();
  ctx.restore();

  // Ornament ✦
  ctx.fillStyle = style.ornamentColor;
  ctx.font = "13px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦", W / 2, TEXT_TOP + 36);

  // Couple names
  ctx.fillStyle = style.nameColor;
  ctx.font = `${style.nameFontStyle} 34px "Cormorant Garamond", "Cormorant", Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${brideName} & ${groomName}`, W / 2, TEXT_TOP + 82);

  // Short divider
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = style.ruleColor;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 40, TEXT_TOP + 96);
  ctx.lineTo(W / 2 + 40, TEXT_TOP + 96);
  ctx.stroke();
  ctx.restore();

  // Date
  if (settings.weddingDate) {
    const dateStr = new Date(settings.weddingDate + "T00:00:00").toLocaleDateString(
      "id-ID",
      { day: "numeric", month: "long", year: "numeric" },
    );
    ctx.fillStyle = style.dateColor;
    ctx.font = '300 13px "Jost","Helvetica Neue","Segoe UI",Arial,sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(dateStr, W / 2, TEXT_TOP + 120);
  }

  // Venue
  if (settings.venueName) {
    ctx.fillStyle = style.venueColor;
    ctx.font = '300 11px "Jost","Helvetica Neue","Segoe UI",Arial,sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(`— ${settings.venueName} —`, W / 2, TEXT_TOP + 148);
  }

  // Export
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92);
  });

  return { blob, dataUrl };
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function FrameCanvas({
  photoBlob,
  settings,
  signatureDataUrl,
  onFrameReady,
}: Props) {
  const [framedDataUrl, setFramedDataUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setRendering(true);
    setError(false);

    renderPolaroid(photoBlob, settings, signatureDataUrl)
      .then(({ blob, dataUrl }) => {
        setFramedDataUrl(dataUrl);
        onFrameReady(blob, dataUrl);
        setRendering(false);
      })
      .catch((e) => {
        console.error("[FrameCanvas] render error", e);
        setError(true);
        setRendering(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoBlob, signatureDataUrl, settings.photoboothFrameStyle]);

  if (rendering) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/60"
        style={{ width: "min(90vw, 360px)", aspectRatio: "0.8" }}
      >
        <div className="w-8 h-8 border-2 border-[#D88C9C]/40 border-t-[#D88C9C] rounded-full animate-spin" />
        <p className="text-sm text-[#A6808B]">Membuat bingkai polaroid…</p>
      </div>
    );
  }

  if (error || !framedDataUrl) {
    return (
      <div className="text-center py-8 px-6">
        <div className="text-3xl mb-3">😕</div>
        <p className="text-[#52363E] text-sm font-medium">Gagal membuat frame</p>
        <p className="text-xs text-[#A6808B] mt-1">Coba kembali atau gunakan foto lain.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="shadow-2xl rounded-sm overflow-hidden"
        style={{ width: "min(85vw, 320px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={framedDataUrl}
          alt="Polaroid preview"
          className="w-full"
          style={{ display: "block" }}
        />
      </div>
      <p className="text-xs text-[#A6808B] text-center px-4">
        {signatureDataUrl
          ? "Tanda tangan sudah diterapkan ✍️"
          : "Preview bingkai polaroid Anda ✨"}
      </p>
    </div>
  );
}
