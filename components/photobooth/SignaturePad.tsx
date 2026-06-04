"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: (dataUrl: string) => void;
  onSkip: () => void;
}

export default function SignaturePad({ onComplete, onSkip }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // ── Canvas setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Retina scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = "#52363E";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  // ── Coordinate helper ──────────────────────────────────────────────────────
  function getPos(e: PointerEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
    };
  }

  // ── Drawing handlers ───────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    const canvas = canvasRef.current!;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPosRef.current = getPos(e.nativeEvent);
    setIsEmpty(false);

    const ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
  }

  function onPointerMove(e: React.PointerEvent) {
    e.preventDefault();
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e.nativeEvent);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPosRef.current = pos;
  }

  function onPointerUp(e: React.PointerEvent) {
    e.preventDefault();
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  function handleClear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }

  // ── Confirm ────────────────────────────────────────────────────────────────
  function handleConfirm() {
    const canvas = canvasRef.current!;
    onComplete(canvas.toDataURL("image/png"));
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <div className="text-center">
        <p className="text-[#52363E] font-semibold text-base">
          Tanda Tangan Digital
        </p>
        <p className="text-sm text-[#A6808B] mt-1">
          Bubuhkan tanda tangan Anda di bawah ini
        </p>
      </div>

      {/* Signature pad */}
      <div className="w-full relative">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="w-full rounded-2xl bg-white border-2 border-[#D88C9C]/30 cursor-crosshair"
          style={{ height: 140, touchAction: "none" }}
        />

        {/* Placeholder */}
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D88C9C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <p className="text-[#D88C9C]/50 text-xs tracking-widest uppercase">
              Tulis di sini
            </p>
          </div>
        )}

        {/* Baseline */}
        <div
          className="absolute left-6 right-6 pointer-events-none"
          style={{ bottom: 28, height: "0.5px", background: "rgba(216,140,156,0.35)" }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleClear}
          disabled={isEmpty}
          className="px-4 py-3 rounded-2xl border border-[#D88C9C]/30 text-[#A6808B] text-sm
            hover:border-[#D88C9C] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Hapus
        </button>
        <button
          onClick={handleConfirm}
          disabled={isEmpty}
          className="flex-1 py-3 rounded-2xl bg-[#52363E] text-white text-sm font-semibold
            hover:bg-[#3d2830] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Terapkan →
        </button>
      </div>

      <button
        onClick={onSkip}
        className="text-sm text-[#A6808B] hover:text-[#52363E] underline underline-offset-2 transition"
      >
        Lewati langkah ini →
      </button>
    </div>
  );
}
