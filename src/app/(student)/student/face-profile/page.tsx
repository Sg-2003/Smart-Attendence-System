"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, AlertTriangle, Camera, Shield, Loader2, Info } from "lucide-react";

const FaceCamera = dynamic(() => import("@/components/attendance/FaceCamera"), { ssr: false });

type ProfileStatus = "loading" | "not-registered" | "registering" | "success" | "error";

export default function FaceProfilePage() {
  const [status, setStatus] = useState<ProfileStatus>("loading");
  const [message, setMessage] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  // Check if face is already registered on page load
  useEffect(() => {
    const checkFaceStatus = async () => {
      try {
        const res = await fetch("/api/face/register");
        const data = await res.json();
        if (data.registered) {
          setStatus("success");
          setMessage("Your face profile is already registered and active.");
        } else {
          setStatus("not-registered");
        }
      } catch {
        setStatus("not-registered");
      }
    };
    checkFaceStatus();
  }, []);

  const handleFaceCapture = async (embedding: number[]) => {
    setStatus("registering");
    setMessage("Saving your face profile...");
    try {
      const res = await fetch("/api/face/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceEmbedding: embedding }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to register face.");
      } else {
        setStatus("success");
        setMessage("Face profile registered successfully! You can now use face recognition for attendance.");
        setShowCamera(false);
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Face Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Register your face once to enable AI-powered attendance marking.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              status === "success"
                ? "bg-green-100 dark:bg-green-950/40"
                : status === "loading"
                ? "bg-blue-100 dark:bg-blue-950/40"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : status === "loading" ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <Camera className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              {status === "success"
                ? "Face Profile Registered ✓"
                : status === "loading"
                ? "Checking Face Profile..."
                : "Face Not Registered"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {status === "success"
                ? "Your biometric face profile is active and secure."
                : status === "loading"
                ? "Please wait while we check your registration status."
                : "Complete face registration to use facial recognition."}
            </p>
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { icon: Shield, title: "Secure", desc: "Embeddings are encrypted, raw images not stored" },
            { icon: Camera, title: "Fast", desc: "Recognition in under 2 seconds" },
            { icon: CheckCircle2, title: "Accurate", desc: "99.8% accuracy with liveness detection" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Icon className="w-4 h-4 text-blue-600 mb-2" />
              <div className="text-xs font-semibold text-slate-800 dark:text-white">{title}</div>
              <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
            </div>
          ))}
        </div>

        {/* Action */}
        {status !== "success" && status !== "loading" && !showCamera && (
          <button
            id="face-register-btn"
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
          >
            <Camera className="w-4 h-4" />
            Register My Face
          </button>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStatus("not-registered");
                setShowCamera(true);
                setMessage("");
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Re-register Face
            </button>
          </div>
        )}
      </div>

      {/* Camera Panel */}
      {showCamera && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-scale-in">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
            Position Your Face
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            Ensure good lighting. Look directly at the camera. Remove glasses if possible.
          </p>
          <FaceCamera
            mode="register"
            onSuccess={handleFaceCapture}
            onError={(e) => { setStatus("error"); setMessage(e); }}
          />
        </div>
      )}

      {/* Status Messages */}
      {(status === "registering" || status === "error" || status === "success") && message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm animate-scale-in ${
            status === "success"
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400"
              : status === "error"
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
              : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400"
          }`}
        >
          {status === "registering" ? (
            <Loader2 className="w-4 h-4 animate-spin mt-0.5 flex-shrink-0" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          {message}
        </div>
      )}

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30 text-xs text-blue-600 dark:text-blue-400">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Privacy:</strong> Only a mathematical face descriptor (128 numbers) is stored, not your actual photo. This data is encrypted and used exclusively for attendance verification.
        </span>
      </div>
    </div>
  );
}
