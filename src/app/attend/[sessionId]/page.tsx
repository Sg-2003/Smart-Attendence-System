"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  QrCode,
  MapPin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

type Status = "verifying" | "marking" | "success" | "error" | "expired" | "login-required";

function AttendContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const courseId = searchParams.get("course") || "";

  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Verifying QR session...");
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Invalid attendance link. No session ID found.");
      return;
    }
    markAttendance();
  }, [sessionId]);

  const markAttendance = async () => {
    setStatus("verifying");
    setMessage("Verifying QR session...");

    try {
      // Step 1: Verify the QR session is valid and not expired
      const verifyRes = await fetch("/api/qr/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (verifyRes.status === 401) {
        setStatus("login-required");
        setMessage("Please log in to mark your attendance.");
        return;
      }

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        if (verifyRes.status === 410) {
          setStatus("expired");
          setMessage(verifyData.error || "This QR session has expired.");
        } else {
          setStatus("error");
          setMessage(verifyData.error || "Invalid QR session.");
        }
        return;
      }

      const resolvedCourseId = verifyData.courseId || courseId;
      setCourseName(verifyData.courseName || "Course");

      // Step 2: Get location (optional)
      setStatus("marking");
      setMessage("Getting your location & marking attendance...");

      let location = "unavailable";
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        location = `${pos.coords.latitude},${pos.coords.longitude}`;
      } catch {
        // GPS is optional
      }

      // Step 3: Submit attendance
      const attendRes = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: resolvedCourseId,
          method: "QR",
          qrCode: sessionId,
          location,
        }),
      });

      const attendData = await attendRes.json();

      if (attendRes.status === 401) {
        setStatus("login-required");
        setMessage("Please log in to mark your attendance.");
        return;
      }

      if (!attendRes.ok) {
        setStatus("error");
        setMessage(attendData.error || "Failed to mark attendance.");
        return;
      }

      setStatus("success");
      setMessage("Attendance marked successfully!");
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-500/5 p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                status === "success"
                  ? "bg-green-100 dark:bg-green-950/40"
                  : status === "error" || status === "expired"
                  ? "bg-red-100 dark:bg-red-950/40"
                  : status === "login-required"
                  ? "bg-amber-100 dark:bg-amber-950/40"
                  : "bg-blue-100 dark:bg-blue-950/40"
              }`}
            >
              {status === "success" ? (
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              ) : status === "error" || status === "expired" ? (
                <AlertTriangle className="w-10 h-10 text-red-500" />
              ) : status === "login-required" ? (
                <AlertTriangle className="w-10 h-10 text-amber-500" />
              ) : (
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {status === "success"
                ? "You're Marked Present!"
                : status === "expired"
                ? "Session Expired"
                : status === "login-required"
                ? "Login Required"
                : status === "error"
                ? "Attendance Failed"
                : "Marking Attendance..."}
            </h1>
            {courseName && status === "success" && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {courseName}
              </p>
            )}
          </div>

          {/* Message */}
          <p
            className={`text-sm ${
              status === "success"
                ? "text-green-600 dark:text-green-400"
                : status === "error" || status === "expired"
                ? "text-red-600 dark:text-red-400"
                : status === "login-required"
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {message}
          </p>

          {/* Success details */}
          {status === "success" && (
            <div className="space-y-3 animate-scale-in">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <QrCode className="w-3.5 h-3.5" />
                <span>Verified via QR Code</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Location captured</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {status === "login-required" && (
              <Link
                href={`/login?redirect=${encodeURIComponent(`/attend/${sessionId}?course=${courseId}`)}`}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
              >
                Sign In to Continue
              </Link>
            )}

            {(status === "error" || status === "expired") && (
              <button
                onClick={markAttendance}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
              >
                Try Again
              </button>
            )}

            <Link
              href="/student"
              className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-slate-400 mt-4">
          AttendAI Pro • Secure QR Attendance
        </p>
      </div>
    </div>
  );
}

export default function AttendPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <AttendContent />
    </Suspense>
  );
}
