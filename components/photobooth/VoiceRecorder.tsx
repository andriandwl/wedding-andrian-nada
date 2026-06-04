"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  onSkip: () => void;
}

type RecordState = "idle" | "requesting" | "recording" | "done" | "error";

const MAX_DURATION_SEC = 60;

export default function VoiceRecorder({ onRecordingComplete, onSkip }: Props) {
  const [state, setState] = useState<RecordState>("idle");
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Waveform canvas refs
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animFrameRef.current!);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  // ── Waveform animation ─────────────────────────────────────────────────────
  function drawWaveform() {
    const analyser = analyserRef.current;
    const canvas = waveCanvasRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext("2d")!;
    const bufLen = analyser.frequencyBinCount; // fftSize/2 = 32
    const data = new Uint8Array(bufLen);

    function frame() {
      animFrameRef.current = requestAnimationFrame(frame);
      analyser!.getByteFrequencyData(data);

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      const barW = canvas!.width / bufLen;
      const cy = canvas!.height / 2;

      for (let i = 0; i < bufLen; i++) {
        const magnitude = data[i] / 255;
        const barH = Math.max(3, magnitude * canvas!.height * 0.85);
        const alpha = 0.3 + magnitude * 0.7;

        ctx.fillStyle = `rgba(216, 140, 156, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(
          i * barW + 1,
          cy - barH / 2,
          barW - 2,
          barH,
          2,
        );
        ctx.fill();
      }
    }
    frame();
  }

  // ── Start recording ────────────────────────────────────────────────────────
  async function startRecording() {
    setState("requesting");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up Web Audio for waveform
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState("done");

        // Stop waveform
        cancelAnimationFrame(animFrameRef.current!);
        audioCtxRef.current?.close();
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      recorder.start(100);
      setState("recording");
      setDuration(0);
      drawWaveform();

      // Timer + auto-stop at MAX_DURATION_SEC
      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d + 1 >= MAX_DURATION_SEC) {
            stopRecording();
            return d + 1;
          }
          return d + 1;
        });
      }, 1000);
    } catch {
      setState("error");
    }
  }

  // ── Stop recording ─────────────────────────────────────────────────────────
  function stopRecording() {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }

  // ── Confirm recording ──────────────────────────────────────────────────────
  function handleConfirm() {
    if (!audioBlob) return;
    onRecordingComplete(audioBlob, duration);
  }

  // ── Playback toggle ────────────────────────────────────────────────────────
  function togglePlay() {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function handleReRecord() {
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);
    setState("idle");
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center">
        <p className="text-[#52363E] font-semibold text-base">
          Rekam Pesan Suara
        </p>
        <p className="text-sm text-[#A6808B] mt-1">
          Ucapkan doa & harapan untuk pengantin
        </p>
      </div>

      {/* Waveform canvas — only visible while recording */}
      <canvas
        ref={waveCanvasRef}
        width={300}
        height={64}
        className={`rounded-xl transition-opacity ${
          state === "recording" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ height: 64 }}
      />

      {/* Duration timer */}
      {(state === "recording" || state === "done") && (
        <div className="flex items-center gap-2">
          {state === "recording" && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span
            className="font-mono text-[#52363E] text-lg font-medium"
          >
            {String(Math.floor(duration / 60)).padStart(2, "0")}:
            {String(duration % 60).padStart(2, "0")}
          </span>
          {state === "recording" && (
            <span className="text-xs text-[#A6808B]">/ {MAX_DURATION_SEC}s</span>
          )}
        </div>
      )}

      {/* Record button */}
      {state === "idle" && (
        <button
          onClick={startRecording}
          className="w-24 h-24 rounded-full bg-[#D88C9C] shadow-lg shadow-[#D88C9C]/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {state === "requesting" && (
        <div className="w-24 h-24 rounded-full border-4 border-[#D88C9C]/40 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#D88C9C]/40 border-t-[#D88C9C] rounded-full animate-spin" />
        </div>
      )}

      {state === "recording" && (
        <button
          onClick={stopRecording}
          className="w-24 h-24 rounded-full bg-red-500 shadow-lg shadow-red-300/40 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-lg bg-white" />
        </button>
      )}

      {state === "error" && (
        <div className="text-center py-4">
          <p className="text-sm text-[#52363E] font-medium">Mikrofon tidak tersedia</p>
          <p className="text-xs text-[#A6808B] mt-1">
            Aktifkan izin mikrofon atau lewati langkah ini.
          </p>
        </div>
      )}

      {/* Done state: playback + actions */}
      {state === "done" && (
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Playback */}
          <button
            onClick={togglePlay}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#FBE7EB] border border-[#D88C9C]/30 text-[#52363E] text-sm font-medium hover:border-[#D88C9C] transition"
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#D88C9C] animate-pulse" />
                Pause
              </>
            ) : (
              <>▶ Putar Ulang</>
            )}
          </button>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleReRecord}
              className="flex-1 py-3 rounded-2xl border border-[#D88C9C]/40 text-[#A6808B] text-sm hover:border-[#D88C9C] transition"
            >
              Rekam Ulang
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-2xl bg-[#52363E] text-white text-sm font-semibold hover:bg-[#3d2830] transition"
            >
              Pakai Ini →
            </button>
          </div>
        </div>
      )}

      {/* Skip hint */}
      {(state === "idle" || state === "error") && (
        <button
          onClick={onSkip}
          className="text-sm text-[#A6808B] hover:text-[#52363E] underline underline-offset-2 transition"
        >
          Lewati langkah ini →
        </button>
      )}

      {state === "idle" && (
        <p className="text-xs text-[#A6808B] text-center">
          Tekan tombol untuk mulai merekam
        </p>
      )}
    </div>
  );
}
