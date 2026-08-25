"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onCapture: (blob: Blob, dataUrl: string) => void;
}

type Mode = "camera" | "upload";

export default function CameraCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<Mode>("camera");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [cameraReady, setCameraReady] = useState(false);
  const [permError, setPermError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [retakeKey, setRetakeKey] = useState(0);

  // ── Start / stop camera ────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "camera") {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraReady(false);
      return;
    }

    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setCameraReady(true);
        }
        setPermError(false);
      } catch {
        setPermError(true);
      }
    }

    startCamera();

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [mode, facingMode, retakeKey]);

  // ── Capture current frame from video ──────────────────────────────────────
  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Mirror if front camera
    if (facingMode === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setPreviewUrl(dataUrl);
        setCapturedBlob(blob);
      },
      "image/jpeg",
      0.9,
    );
  }

  // ── Upload from gallery ────────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCapturedBlob(file);
  }

  // ── Confirm selection ──────────────────────────────────────────────────────
  function handleConfirm() {
    if (!capturedBlob || !previewUrl) return;
    onCapture(capturedBlob, previewUrl);
  }

  function handleRetake() {
    setPreviewUrl(null);
    setCapturedBlob(null);
    setCameraReady(false);
    setRetakeKey((k) => k + 1);
  }

  // ── Preview state ──────────────────────────────────────────────────────────
  if (previewUrl) {
    return (
      <div className="flex flex-col items-center gap-5">
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{ width: "min(90vw, 400px)", aspectRatio: "1" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-[#A6808B] text-center">
          Sudah bagus? Atau ambil ulang?
        </p>
        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={handleRetake}
            className="flex-1 py-3 rounded-2xl border border-[#D88C9C]/40 text-[#A6808B] text-sm font-medium hover:border-[#D88C9C] transition"
          >
            Ambil Ulang
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-2xl bg-[#52363E] text-white text-sm font-semibold hover:bg-[#3d2830] transition"
          >
            Pakai Foto Ini →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Tab selector */}
      <div className="flex bg-white/60 rounded-2xl p-1 gap-1 border border-[#D88C9C]/20">
        {(["camera", "upload"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === m
                ? "bg-[#52363E] text-white shadow-sm"
                : "text-[#A6808B] hover:text-[#52363E]"
            }`}
          >
            {m === "camera" ? "📷 Kamera" : "🖼️ Galeri"}
          </button>
        ))}
      </div>

      {/* Camera view */}
      {mode === "camera" && (
        <div className="flex flex-col items-center gap-4 w-full">
          {permError ? (
            <div className="text-center py-8 px-6">
              <div className="text-4xl mb-3">📵</div>
              <p className="text-[#52363E] font-medium mb-1">
                Izin kamera ditolak
              </p>
              <p className="text-sm text-[#A6808B]">
                Aktifkan izin kamera di pengaturan browser, atau gunakan tab
                Galeri.
              </p>
              <button
                onClick={() => setMode("upload")}
                className="mt-4 text-sm text-[#D88C9C] underline"
              >
                Buka Galeri →
              </button>
            </div>
          ) : (
            <>
              {/* Video preview */}
              <div
                className="relative overflow-hidden rounded-2xl shadow-xl bg-black"
                style={{
                  width: "min(90vw, 400px)",
                  aspectRatio: "1",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    transform: facingMode === "user" ? "scaleX(-1)" : "none",
                  }}
                />
                {/* Square guide overlay */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                {/* Flip camera */}
                <button
                  onClick={() =>
                    setFacingMode((f) =>
                      f === "user" ? "environment" : "user",
                    )
                  }
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/70 border border-[#D88C9C]/20 text-[#52363E] text-lg hover:bg-white transition"
                  title="Ganti kamera"
                >
                  🔄
                </button>

                {/* Shutter */}
                <button
                  onClick={handleCapture}
                  disabled={!cameraReady}
                  className="w-20 h-20 rounded-full bg-white border-4 border-[#D88C9C] shadow-lg hover:scale-95 active:scale-90 transition-transform disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D88C9C]" />
                </button>

                {/* Placeholder for symmetry */}
                <div className="w-11 h-11" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Upload view */}
      {mode === "upload" && (
        <label
          className="flex flex-col items-center justify-center gap-4 cursor-pointer"
          style={{ width: "min(90vw, 400px)", aspectRatio: "1" }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D88C9C]/40 bg-white/60 hover:border-[#D88C9C] hover:bg-[#FBE7EB]/60 transition-all">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-[#52363E] font-medium">Pilih foto dari HP</p>
            <p className="text-sm text-[#A6808B] mt-1">JPG, PNG, atau HEIC</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
