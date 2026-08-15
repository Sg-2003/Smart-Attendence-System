"use client";

import { useEffect, useRef, useState } from "react";
import { QrCode, RefreshCw, Copy, Check, Clock, Smartphone } from "lucide-react";

interface QRGeneratorProps {
  sessionId: string;
  courseId: string;
  courseName: string;
  expirySeconds: number;
  onExpire?: () => void;
}

export default function QRGenerator({
  sessionId,
  courseId,
  courseName,
  expirySeconds,
  onExpire,
}: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(expirySeconds);
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);

  // Build a scannable URL — when students scan with phone camera, it opens this page
  const attendUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/attend/${sessionId}?course=${encodeURIComponent(courseId)}`;

  // Draw QR code on canvas
  useEffect(() => {
    const drawQR = async () => {
      const QRCode = (await import("qrcode")).default;
      if (canvasRef.current && attendUrl) {
        await QRCode.toCanvas(canvasRef.current, attendUrl, {
          width: 300,
          margin: 2,
          color: { dark: "#1e293b", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
      }
    };
    drawQR();
  }, [attendUrl]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      onExpire?.();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPct = (timeLeft / expirySeconds) * 100;
  const isWarning = progressPct < 30;

  const copyLink = () => {
    navigator.clipboard.writeText(attendUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Course Info */}
      <div className="text-center">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
          Active QR Session
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white">{courseName}</div>
      </div>

      {/* Scan Instruction */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
        <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          Students: Scan this QR with your phone camera to mark attendance
        </span>
      </div>

      {/* QR Code */}
      <div className="relative">
        <div
          className={`p-3 rounded-2xl border-4 transition-colors ${
            expired
              ? "border-red-400 opacity-40"
              : isWarning
              ? "border-amber-400"
              : "border-blue-500"
          }`}
        >
          <canvas ref={canvasRef} className="rounded-lg" />
          {expired && (
            <div className="absolute inset-3 bg-white/90 dark:bg-slate-900/90 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-red-500">QR Expired</p>
                <p className="text-xs text-slate-400">Generate a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-sm">
            <Clock className={`w-4 h-4 ${isWarning ? "text-red-500" : "text-slate-500"}`} />
            <span className={`font-mono font-bold text-lg ${
              expired ? "text-red-500" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-white"
            }`}>
              {expired ? "00:00" : formatTime(timeLeft)}
            </span>
          </div>
          <span className="text-xs text-slate-400">expires in</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              expired ? "bg-red-400" : isWarning ? "bg-amber-400" : "bg-blue-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Attendance Link */}
      <div className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Attendance Link</div>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
            {attendUrl}
          </div>
        </div>
        <button
          onClick={copyLink}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          aria-label="Copy attendance link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}
