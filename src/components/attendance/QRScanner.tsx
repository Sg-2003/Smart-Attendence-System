"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { QrCode, Loader2, CheckCircle2, AlertTriangle, RefreshCw, Zap } from "lucide-react";

interface QRScannerProps {
  onScan: (code: string) => void;
  onError?: (error: string) => void;
}

type ScanStatus = "initializing" | "scanning" | "success" | "error";

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const isStoppingRef = useRef(false);
  const [status, setStatus] = useState<ScanStatus>("initializing");
  const [scannedCode, setScannedCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const stopScanner = useCallback(async () => {
    if (isStoppingRef.current || !scannerRef.current) return;
    isStoppingRef.current = true;
    try {
      const scanner = scannerRef.current;
      const state = scanner.getState?.();
      // Html5QrcodeScannerState: SCANNING = 2, PAUSED = 3
      if (state === 2 || state === 3) {
        await scanner.stop();
      }
    } catch {
      // Ignore errors during stop - element may already be gone
    } finally {
      isStoppingRef.current = false;
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!isMountedRef.current) return;
    setStatus("initializing");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (!isMountedRef.current) return;

      // Clear any previous instance
      if (scannerRef.current) {
        await stopScanner();
        try { scannerRef.current.clear(); } catch {}
        scannerRef.current = null;
      }

      const scanner = new Html5Qrcode("qr-reader", { verbose: false });
      scannerRef.current = scanner;

      if (!isMountedRef.current) {
        try { scanner.clear(); } catch {}
        scannerRef.current = null;
        return;
      }

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          disableFlip: false,
        },
        (decodedText: string) => {
          if (!isMountedRef.current) return;
          setScannedCode(decodedText);
          setStatus("success");
          // Stop scanning after successful decode
          stopScanner();
          onScan(decodedText);
        },
        () => {
          // QR code not found in frame - ignore
        }
      );

      if (isMountedRef.current) {
        setStatus("scanning");
      } else {
        // Component unmounted during start, clean up
        await stopScanner();
      }
    } catch (e: any) {
      if (isMountedRef.current) {
        // Camera not available - still allow simulate mode
        setStatus("scanning");
      }
    }
  }, [onScan, stopScanner]);

  useEffect(() => {
    isMountedRef.current = true;
    startScanner();

    return () => {
      isMountedRef.current = false;
      // Synchronous teardown: aggressively pause any video elements in the
      // scanner container before React removes them from the DOM.
      const container = document.getElementById("qr-reader");
      if (container) {
        const videos = container.querySelectorAll("video");
        videos.forEach((video) => {
          try {
            video.pause();
            video.srcObject = null;
            video.removeAttribute("src");
            video.load(); // reset the media element
          } catch {}
        });
      }
      // Then do the async library cleanup
      stopScanner().then(() => {
        try { scannerRef.current?.clear(); } catch {}
        scannerRef.current = null;
      });
    };
  }, [startScanner, stopScanner]);

  const simulateScan = () => {
    const demoCode = JSON.stringify({
      sessionId: `sess_demo_${Math.random().toString(36).substr(2, 8)}`,
      course: "Data Structures & Algorithms",
      timestamp: Date.now(),
    });
    setScannedCode(demoCode);
    setStatus("success");
    stopScanner();
    onScan(demoCode);
  };

  const reset = () => {
    setStatus("initializing");
    setScannedCode("");
    setErrorMsg("");
    stopScanner().then(() => {
      try { scannerRef.current?.clear(); } catch {}
      scannerRef.current = null;
      startScanner();
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Scanner Box */}
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-md min-h-[260px] flex items-center justify-center">
        {status === "success" ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 p-4">
            <CheckCircle2 className="w-16 h-16 text-green-400 animate-scale-in" />
            <div className="text-center">
              <p className="text-green-400 font-bold text-sm">QR Code Decoded Successfully!</p>
              <p className="text-slate-400 text-[11px] mt-1 break-all px-4 font-mono bg-slate-950/60 py-1.5 rounded-lg border border-slate-800">
                {scannedCode}
              </p>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 text-xs text-center px-4">{errorMsg}</p>
          </div>
        ) : (
          <div className="w-full relative">
            {status === "initializing" && (
              <div className="absolute inset-0 z-10 bg-slate-900/90 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                <span className="text-slate-300 text-xs font-medium">Opening Camera Sensor...</span>
              </div>
            )}
            <div id="qr-reader" className="w-full text-white" />
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs font-medium">
        {status === "scanning" && (
          <>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 dark:text-blue-400">
              Align QR code inside optical target
            </span>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-green-600 dark:text-green-400">QR Code Verified</span>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {status !== "success" && (
          <button
            onClick={simulateScan}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Scan (Test Mode)
          </button>
        )}

        {(status === "success" || status === "error") && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Scan Another Code
          </button>
        )}
      </div>
    </div>
  );
}
