"use client";

import { useState } from "react";
import CameraCapture from "./CameraCapture";
import FrameCanvas from "./FrameCanvas";
import VoiceRecorder from "./VoiceRecorder";
import SignaturePad from "./SignaturePad";

// ── Types ──────────────────────────────────────────────────────────────────────
type Step =
  | "welcome"
  | "capture"
  | "frame"
  | "signature"
  | "frame-with-sig"
  | "voice"
  | "submitting"
  | "done";

interface Props {
  settings: any;
  initialName: string;
  initialCode: string;
}

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepDots({ current }: { current: Step }) {
  const visible: Step[] = ["capture", "frame", "signature", "voice", "done"];
  const idx = visible.indexOf(current);
  return (
    <div className="flex items-center gap-2">
      {visible.map((s, i) => (
        <div
          key={s}
          className={`rounded-full transition-all duration-300 ${
            i < idx
              ? "w-2 h-2 bg-[#D88C9C]"
              : i === idx
                ? "w-5 h-2 bg-[#52363E]"
                : "w-2 h-2 bg-[#D88C9C]/30"
          }`}
        />
      ))}
    </div>
  );
}

// ── Step wrapper card ──────────────────────────────────────────────────────────
function StepCard({
  title,
  subtitle,
  step,
  children,
}: {
  title: string;
  subtitle?: string;
  step: Step;
  children: React.ReactNode;
}) {
  const showDots =
    step !== "welcome" && step !== "submitting" && step !== "done";
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto px-4 py-8">
      {showDots && (
        <div className="mb-1">
          <StepDots current={step} />
        </div>
      )}
      <div className="text-center">
        <h2
          className="text-xl font-semibold text-[#52363E]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#A6808B] mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PhotoboothFlow({
  settings,
  initialName,
  initialCode,
}: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [guestName, setGuestName] = useState(initialName);
  const [nameError, setNameError] = useState("");

  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [framedBlob, setFramedBlob] = useState<Blob | null>(null);
  const [framedDataUrl, setFramedDataUrl] = useState("");

  // Signature (Phase 4)
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(
    undefined,
  );

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [submitError, setSubmitError] = useState("");

  const brideName = settings?.brideName || "Nada";
  const groomName = settings?.groomName || "Andrian";

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(overrideAudio?: {
    blob: Blob;
    duration: number;
  } | null) {
    if (!framedBlob || !guestName.trim()) return;
    setStep("submitting");
    setSubmitError("");

    const audio = overrideAudio !== undefined ? overrideAudio : null;

    const formData = new FormData();
    formData.append("guestName", guestName.trim());
    if (initialCode) formData.append("guestCode", initialCode);
    formData.append("photo", framedBlob, "photo.jpg");
    if (audio) {
      formData.append("audio", audio.blob, "voice.webm");
      formData.append("audioDuration", String(audio.duration));
    } else if (audioBlob) {
      formData.append("audio", audioBlob, "voice.webm");
      formData.append("audioDuration", String(audioDuration));
    }

    try {
      const res = await fetch("/api/photobooth", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (json.ok) {
        setStep("done");
      } else {
        setSubmitError(json.error?.message ?? "Gagal mengirim. Coba lagi.");
        setStep("voice");
      }
    } catch {
      setSubmitError("Koneksi gagal. Periksa jaringan Anda.");
      setStep("voice");
    }
  }

  // ── Download ─────────────────────────────────────────────────────────────────
  function handleDownload() {
    if (!framedDataUrl) return;
    const a = document.createElement("a");
    a.href = framedDataUrl;
    a.download = `foto-pernikahan-${brideName}-${groomName}.jpg`;
    a.click();
  }

  // ── Share ────────────────────────────────────────────────────────────────────
  async function handleShare() {
    if (!framedBlob) return;
    const file = new File([framedBlob], "foto-pernikahan.jpg", {
      type: "image/jpeg",
    });
    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare?.({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: `Foto Pernikahan ${brideName} & ${groomName}`,
          text: `Baru saja ambil foto di Virtual Photobooth Pernikahan ${brideName} & ${groomName}! 💕`,
        });
        return;
      } catch {
        // User cancelled or unsupported — fallback
      }
    }
    handleDownload();
  }

  // ── Bg style ─────────────────────────────────────────────────────────────────
  const pageBg = "#FBE7EB";

  // ────────────────────────────────────────────────────────────────────────────
  // WELCOME
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "welcome") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
        style={{ background: pageBg }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(216,140,156,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-7">
          <div className="text-center">
            <p
              className="text-[#D88C9C] mb-2"
              style={{
                fontFamily: "var(--font-great-vibes), cursive",
                fontSize: "clamp(1.5rem,5vw,2rem)",
              }}
            >
              Virtual Photobooth
            </p>
            <h1
              className="text-[#52363E] leading-tight"
              style={{
                fontFamily:
                  "var(--font-cormorant),'Cormorant Garamond',Georgia,serif",
                fontSize: "clamp(2rem,7vw,3rem)",
                fontWeight: 300,
              }}
            >
              {brideName} & {groomName}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-12 bg-[#D88C9C]/40" />
              <span className="text-[#D88C9C] text-xs">✦</span>
              <div className="h-px w-12 bg-[#D88C9C]/40" />
            </div>
          </div>

          <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#D88C9C]/10 p-6">
            <p className="text-sm text-[#A6808B] text-center mb-5">
              Abadikan momen spesial bersama kami 💕
            </p>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#52363E]/70 uppercase tracking-widest">
                Nama Anda
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setNameError("");
                }}
                placeholder="Masukkan nama Anda…"
                maxLength={60}
                autoFocus
                className={`w-full px-4 py-3 rounded-2xl border text-[#52363E] placeholder-[#D88C9C]/40
                  focus:outline-none focus:ring-2 focus:ring-[#D88C9C]/40 focus:border-[#D88C9C] transition text-sm
                  ${nameError ? "border-red-300" : "border-[#D88C9C]/30"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!guestName.trim()) setNameError("Nama wajib diisi");
                    else setStep("capture");
                  }
                }}
              />
              {nameError && (
                <p className="text-xs text-red-500">{nameError}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (!guestName.trim()) {
                  setNameError("Nama wajib diisi");
                  return;
                }
                setStep("capture");
              }}
              className="mt-5 w-full py-3.5 rounded-2xl bg-[#52363E] text-white font-semibold text-sm
                hover:bg-[#3d2830] active:scale-[0.98] transition-all shadow-md shadow-[#52363E]/20"
            >
              Mulai Photobooth 📷
            </button>
          </div>
          <p className="text-xs text-[#A6808B]/70 text-center">
            Foto Anda akan tampil di galeri kenangan pernikahan
          </p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CAPTURE
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "capture") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: pageBg }}>
        <div className="w-full max-w-md px-4 py-6">
          <button
            onClick={() => setStep("welcome")}
            className="mb-4 flex items-center gap-1.5 text-sm text-[#A6808B] hover:text-[#52363E] transition"
          >
            ← Kembali
          </button>
          <StepCard
            title="Ambil Foto"
            subtitle={`Hai ${guestName}! Ambil foto terbaik Anda`}
            step="capture"
          >
            <CameraCapture
              onCapture={(blob) => {
                setCapturedBlob(blob);
                setFramedBlob(null);
                setFramedDataUrl("");
                setSignatureDataUrl(undefined);
                setStep("frame");
              }}
            />
          </StepCard>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // FRAME
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "frame") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: pageBg }}>
        <div className="w-full max-w-md px-4 py-6">
          <button
            onClick={() => setStep("capture")}
            className="mb-4 flex items-center gap-1.5 text-sm text-[#A6808B] hover:text-[#52363E] transition"
          >
            ← Ambil Ulang
          </button>
          <StepCard
            title="Bingkai Polaroid"
            subtitle="Foto Anda sudah dibingkai otomatis"
            step="frame"
          >
            {capturedBlob && (
              <FrameCanvas
                photoBlob={capturedBlob}
                settings={settings}
                onFrameReady={(blob, dataUrl) => {
                  setFramedBlob(blob);
                  setFramedDataUrl(dataUrl);
                }}
              />
            )}
            {framedBlob && (
              <button
                onClick={() => setStep("signature")}
                className="w-full max-w-sm py-3.5 rounded-2xl bg-[#52363E] text-white font-semibold text-sm
                  hover:bg-[#3d2830] transition-all shadow-md shadow-[#52363E]/20"
              >
                Lanjut: Tanda Tangan ✍️ →
              </button>
            )}
          </StepCard>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SIGNATURE (Phase 4)
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "signature") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: pageBg }}>
        <div className="w-full max-w-md px-4 py-6">
          <button
            onClick={() => setStep("frame")}
            className="mb-4 flex items-center gap-1.5 text-sm text-[#A6808B] hover:text-[#52363E] transition"
          >
            ← Kembali
          </button>
          <StepCard
            title="Tanda Tangan Digital"
            subtitle="Opsional — bubuhkan tanda tangan Anda"
            step="signature"
          >
            {/* Show current framed photo preview */}
            {framedDataUrl && (
              <div
                className="shadow-lg rounded-sm overflow-hidden mb-2"
                style={{ width: "min(70vw, 240px)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={framedDataUrl} alt="Preview" className="w-full" />
              </div>
            )}

            <SignaturePad
              onComplete={(sigDataUrl) => {
                setSignatureDataUrl(sigDataUrl);
                // Re-render frame with signature, then go to voice
                setFramedBlob(null);
                setFramedDataUrl("");
                setStep("frame-with-sig");
              }}
              onSkip={() => {
                setSignatureDataUrl(undefined);
                setStep("voice");
              }}
            />
          </StepCard>
        </div>
      </div>
    );
  }

  // ── Hidden re-render step with signature ──────────────────────────────────
  if (step === "frame-with-sig") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: pageBg }}>
        <div className="w-full max-w-md px-4 py-6 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-8 h-8 border-2 border-[#D88C9C]/40 border-t-[#D88C9C] rounded-full animate-spin" />
            <p className="text-sm text-[#A6808B]">Menerapkan tanda tangan…</p>
          </div>
          {capturedBlob && (
            <div className="hidden">
              <FrameCanvas
                photoBlob={capturedBlob}
                settings={settings}
                signatureDataUrl={signatureDataUrl}
                onFrameReady={(blob, dataUrl) => {
                  setFramedBlob(blob);
                  setFramedDataUrl(dataUrl);
                  setStep("voice");
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // VOICE
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "voice") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: pageBg }}>
        <div className="w-full max-w-md px-4 py-6">
          <button
            onClick={() => setStep("signature")}
            className="mb-4 flex items-center gap-1.5 text-sm text-[#A6808B] hover:text-[#52363E] transition"
          >
            ← Kembali
          </button>
          <StepCard
            title="Pesan Suara"
            subtitle="Ucapkan doa & harapan untuk pengantin"
            step="voice"
          >
            {submitError && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 text-center">
                {submitError}
              </div>
            )}
            <VoiceRecorder
              onRecordingComplete={(blob, dur) => {
                setAudioBlob(blob);
                setAudioDuration(dur);
                handleSubmit({ blob, duration: dur });
              }}
              onSkip={() => {
                setAudioBlob(null);
                setAudioDuration(0);
                handleSubmit(null);
              }}
            />
          </StepCard>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBMITTING
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "submitting") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: pageBg }}
      >
        <div className="w-16 h-16 border-4 border-[#D88C9C]/30 border-t-[#D88C9C] rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-[#52363E] font-semibold text-base">
            Mengirim ke galeri…
          </p>
          <p className="text-sm text-[#A6808B] mt-1">Sebentar lagi selesai!</p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // DONE
  // ────────────────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-start px-4 py-10"
        style={{ background: pageBg }}
      >
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="text-5xl mb-4">💌</div>
            <h2
              className="text-[#52363E] text-2xl"
              style={{
                fontFamily:
                  "var(--font-cormorant),'Cormorant Garamond',Georgia,serif",
                fontWeight: 300,
              }}
            >
              Terima kasih, {guestName}!
            </h2>
            <p className="text-sm text-[#A6808B] mt-2">
              Foto kenangan Anda sudah masuk ke galeri kami 🎉
            </p>
          </div>

          {framedDataUrl && (
            <div className="shadow-xl rounded-sm overflow-hidden w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={framedDataUrl} alt="Foto polaroid Anda" className="w-full" />
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl bg-[#52363E] text-white font-semibold text-sm
                hover:bg-[#3d2830] transition-all shadow-md shadow-[#52363E]/20 flex items-center justify-center gap-2"
            >
              ⬇️ Unduh Foto
            </button>
            <button
              onClick={handleShare}
              className="w-full py-3.5 rounded-2xl border border-[#D88C9C]/50 text-[#52363E] font-medium text-sm
                hover:border-[#D88C9C] hover:bg-[#D88C9C]/10 transition-all flex items-center justify-center gap-2"
            >
              📤 Bagikan
            </button>
            <a
              href="/gallery"
              className="w-full py-3.5 rounded-2xl border border-[#52363E]/20 text-[#A6808B] font-medium text-sm text-center
                hover:border-[#52363E]/40 hover:text-[#52363E] transition-all"
            >
              🖼️ Lihat Galeri Tamu
            </a>
          </div>

          <div className="flex items-center gap-3 w-full">
            <div className="h-px flex-1 bg-[#D88C9C]/20" />
            <span className="text-[#D88C9C] text-xs">✦</span>
            <div className="h-px flex-1 bg-[#D88C9C]/20" />
          </div>

          <button
            onClick={() => {
              setCapturedBlob(null);
              setFramedBlob(null);
              setFramedDataUrl("");
              setSignatureDataUrl(undefined);
              setAudioBlob(null);
              setAudioDuration(0);
              setSubmitError("");
              setStep("capture");
            }}
            className="text-sm text-[#A6808B] underline underline-offset-2 hover:text-[#52363E] transition"
          >
            Ambil foto lagi
          </button>
        </div>
      </div>
    );
  }

  return null;
}
