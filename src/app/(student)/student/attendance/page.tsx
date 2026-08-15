"use client";

import { useState, useEffect } from "react";
import { Camera, QrCode, CheckCircle2, AlertTriangle, Loader2, MapPin, Smartphone, Zap, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy-load camera components (browser-only)
const QRGenerator = dynamic(() => import("@/components/attendance/QRGenerator"), { ssr: false });
const QRScanner = dynamic(() => import("@/components/attendance/QRScanner"), { ssr: false });
const FaceCamera = dynamic(() => import("@/components/attendance/FaceCamera"), { ssr: false });

type Tab = "qr-display" | "face" | "qr-camera";
type SubmitStatus = "idle" | "verifying" | "submitting" | "success" | "error";

const mockCourses = [
  { id: "c1", name: "Data Structures & Algorithms" },
  { id: "c2", name: "Database Management System" },
  { id: "c3", name: "Computer Networks" },
  { id: "c4", name: "Operating Systems" },
];

export default function StudentAttendancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("qr-display");
  const [selectedCourse, setSelectedCourse] = useState("c1");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Generate QR session when course changes or on initial load
  const generateSession = async (courseId: string) => {
    setIsGeneratingQR(true);
    try {
      const res = await fetch("/api/qr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, expiryMinutes: 10 }),
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
      } else {
        setSessionId(`sess_${courseId}_${Date.now()}`);
      }
    } catch {
      setSessionId(`sess_${courseId}_${Date.now()}`);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      generateSession(selectedCourse);
    }
  }, [selectedCourse]);

  const getLocation = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
    );

  // ── Quick Test Mode (Simulate Mobile Scan) ───────────────────────────────────
  const handleSimulateScan = async () => {
    if (!selectedCourse) {
      setMessage("Please select a course first.");
      setSubmitStatus("error");
      return;
    }
    setSubmitStatus("submitting");
    setMessage("Simulating mobile QR scan...");

    try {
      let location = "unavailable";
      try {
        const pos = await getLocation();
        location = `${pos.coords.latitude},${pos.coords.longitude}`;
      } catch {}

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          method: "QR",
          qrCode: sessionId || `sess_${selectedCourse}_${Date.now()}`,
          location,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitStatus("error");
        setMessage(data.error || "Attendance submission failed.");
      } else {
        setSubmitStatus("success");
        setMessage("Attendance marked successfully via QR scan! ✓");
      }
    } catch {
      setSubmitStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  // ── In-App Webcam QR Scan Handler ───────────────────────────────────────────
  const handleCameraQRScan = async (code: string) => {
    let detectedCourseId = selectedCourse;
    try {
      const url = new URL(code);
      const courseParam = url.searchParams.get("course");
      if (courseParam) {
        detectedCourseId = courseParam;
        setSelectedCourse(courseParam);
      }
    } catch {
      try {
        const parsed = JSON.parse(code);
        if (parsed.courseId) {
          detectedCourseId = parsed.courseId;
          setSelectedCourse(parsed.courseId);
        }
      } catch {}
    }

    const courseToUse = detectedCourseId || selectedCourse;
    setSubmitStatus("submitting");
    setMessage("Submitting QR attendance...");

    try {
      let location = "unavailable";
      try {
        const pos = await getLocation();
        location = `${pos.coords.latitude},${pos.coords.longitude}`;
      } catch {}

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseToUse, method: "QR", qrCode: code, location }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitStatus("error");
        setMessage(data.error || "Attendance submission failed.");
      } else {
        setSubmitStatus("success");
        setMessage("Attendance marked successfully via QR Code! ✓");
      }
    } catch {
      setSubmitStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  // ── Face Verify Handler ──────────────────────────────────────────────────────
  const handleFaceVerify = async (embedding: number[]) => {
    if (!selectedCourse) {
      setMessage("Please select a course first.");
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("verifying");
    setMessage("Verifying your face against registered profile...");

    try {
      const verifyRes = await fetch("/api/face/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceEmbedding: embedding }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setSubmitStatus("error");
        setMessage(verifyData.error || "Face verification failed. Make sure you've registered your face first.");
        return;
      }

      setSubmitStatus("submitting");
      setMessage(`Face matched (${verifyData.similarity}% confidence). Submitting attendance...`);

      let location = "unavailable";
      try {
        const pos = await getLocation();
        location = `${pos.coords.latitude},${pos.coords.longitude}`;
      } catch {}

      const attendRes = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse, method: "FACE", faceEmbedding: embedding, location }),
      });

      const attendData = await attendRes.json();
      if (!attendRes.ok) {
        setSubmitStatus("error");
        setMessage(attendData.error || "Attendance submission failed.");
      } else {
        setSubmitStatus("success");
        setMessage(`Attendance marked successfully! Face verified at ${verifyData.similarity}% confidence. ✓`);
      }
    } catch {
      setSubmitStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const currentCourseName = mockCourses.find((c) => c.id === selectedCourse)?.name || "Selected Course";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mark Attendance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Scan the on-screen QR code with your mobile device or use Face Recognition.
        </p>
      </div>

      {/* Course Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Course
        </label>
        <select
          id="attendance-course-select"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSubmitStatus("idle");
            setMessage("");
          }}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        >
          {mockCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Switcher */}
      <div className="flex rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          id="tab-qr-display"
          onClick={() => {
            setActiveTab("qr-display");
            setSubmitStatus("idle");
            setMessage("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
            activeTab === "qr-display"
              ? "gradient-brand text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Scan with Mobile (QR on Screen)
        </button>

        <button
          id="tab-face"
          onClick={() => {
            setActiveTab("face");
            setSubmitStatus("idle");
            setMessage("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
            activeTab === "face"
              ? "gradient-brand text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Camera className="w-4 h-4" />
          Face Recognition
        </button>
      </div>

      {/* Main Display Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        {activeTab === "qr-display" && (
          <div className="space-y-5">
            {isGeneratingQR || !sessionId ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm text-slate-500">Generating dynamic QR code...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <QRGenerator
                  sessionId={sessionId}
                  courseId={selectedCourse}
                  courseName={currentCourseName}
                  expirySeconds={600}
                  onExpire={() => generateSession(selectedCourse)}
                />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSimulateScan}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Simulate Scan (1-Click Test)
                  </button>

                  <button
                    onClick={() => generateSession(selectedCourse)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate QR
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "face" && (
          <FaceCamera
            mode="verify"
            onSuccess={handleFaceVerify}
            onError={(e) => { setMessage(e); setSubmitStatus("error"); }}
          />
        )}

        {activeTab === "qr-camera" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Laptop Webcam QR Scanner</span>
              <button
                onClick={() => setActiveTab("qr-display")}
                className="text-xs text-blue-600 hover:underline"
              >
                ← Back to on-screen QR
              </button>
            </div>
            <QRScanner
              onScan={handleCameraQRScan}
              onError={(e) => { setMessage(e); setSubmitStatus("error"); }}
            />
          </div>
        )}
      </div>

      {/* Submission Status */}
      {submitStatus !== "idle" && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm animate-scale-in ${
            submitStatus === "success"
              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400"
              : submitStatus === "error"
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400"
              : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400"
          }`}
        >
          {submitStatus === "submitting" || submitStatus === "verifying" ? (
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 mt-0.5" />
          ) : submitStatus === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          )}
          {message}
        </div>
      )}

      {/* GPS Info */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <MapPin className="w-3.5 h-3.5" />
        GPS location will be verified automatically for on-campus validation.
      </div>
    </div>
  );
}
