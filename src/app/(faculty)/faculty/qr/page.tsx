"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { QrCode, Play, Users, CheckCircle2, Clock, Loader2, RefreshCw, Zap, Radio, Sparkles } from "lucide-react";

const QRGenerator = dynamic(() => import("@/components/attendance/QRGenerator"), { ssr: false });

const mockCourses = [
  { id: "c1", name: "Data Structures & Algorithms", students: 48 },
  { id: "c2", name: "Database Management System", students: 45 },
  { id: "c3", name: "Computer Networks", students: 44 },
  { id: "c4", name: "Operating Systems", students: 49 },
];

const expiryOptions = [
  { label: "2 minutes", value: 120 },
  { label: "5 minutes", value: 300 },
  { label: "10 minutes", value: 600 },
  { label: "15 minutes", value: 900 },
];

interface LiveAttendee {
  id: string;
  studentName: string;
  rollNo: string;
  method: "QR" | "FACE" | "MANUAL";
  time: string;
}

export default function FacultyQRPage() {
  const [selectedCourse, setSelectedCourse] = useState("c1");
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [sessionId, setSessionId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [liveStudents, setLiveStudents] = useState<LiveAttendee[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for live attendance updates when session is active
  const fetchLiveAttendees = async (courseId: string) => {
    try {
      const res = await fetch(`/api/attendance/live?courseId=${courseId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.attendees)) {
        setLiveStudents(data.attendees);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch {}
  };

  useEffect(() => {
    if (sessionActive && selectedCourse) {
      fetchLiveAttendees(selectedCourse);
      intervalRef.current = setInterval(() => {
        fetchLiveAttendees(selectedCourse);
      }, 1500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionActive, selectedCourse]);

  const generateQR = async () => {
    if (!selectedCourse) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/qr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse, expiryMinutes: expirySeconds / 60 }),
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
      } else {
        setSessionId(`sess_${selectedCourse}_${Date.now()}`);
      }
      setSessionActive(true);
      fetchLiveAttendees(selectedCourse);
    } catch {
      setSessionId(`sess_${selectedCourse}_${Date.now()}`);
      setSessionActive(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSession = () => {
    setSessionActive(false);
    setSessionId("");
  };

  // Instant simulate test: Simulates a student marking attendance in real time
  const simulateLiveStudentJoin = async () => {
    if (!selectedCourse) return;
    const names = ["Ananya Singh", "Rahul Verma", "Priya Sharma", "Arjun Mehta", "Kavya Nair", "Rohan Gupta", "Sneha Patel"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const rollNo = `CS20240${Math.floor(10 + Math.random() * 90)}`;

    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          method: "QR",
          qrCode: sessionId || `demo_${Date.now()}`,
          location: "Campus Room CS-201",
        }),
      });
      fetchLiveAttendees(selectedCourse);
    } catch {}
  };

  const totalCourseStudents = mockCourses.find((c) => c.id === selectedCourse)?.students ?? 45;
  const liveCount = liveStudents.length;
  const courseName = mockCourses.find((c) => c.id === selectedCourse)?.name ?? "Selected Course";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">QR Attendance Session</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time dynamic QR attendance streaming with live attendee updates.
          </p>
        </div>

        {sessionActive && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs font-semibold text-green-700 dark:text-green-400 animate-pulse w-fit">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE STREAM ACTIVE</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-5">
          {/* Course Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
              Session Setup
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Course
                </label>
                <select
                  id="qr-course-select"
                  value={selectedCourse}
                  onChange={(e) => { setSelectedCourse(e.target.value); resetSession(); }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  {mockCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.students} students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  QR Expiry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {expiryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setExpirySeconds(opt.value)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                        expirySeconds === opt.value
                          ? "gradient-brand text-white border-transparent"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="generate-qr-btn"
                  onClick={generateQR}
                  disabled={!selectedCourse || isGenerating || sessionActive}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isGenerating ? "Generating..." : sessionActive ? "Session Broadcasting" : "Start Live QR Session"}
                </button>

                {sessionActive && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={simulateLiveStudentJoin}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl gradient-brand text-white text-xs font-semibold shadow-sm hover:-translate-y-0.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Simulate Live Scan
                    </button>
                    <button
                      onClick={resetSession}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      End Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Real-Time Attendance Counter Cards */}
          {sessionActive && (
            <div className="grid grid-cols-2 gap-3 animate-scale-in">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                  {liveCount}
                </div>
                <div className="text-xs font-medium text-green-600 dark:text-green-500 mt-0.5 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
                  Present in Class
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
                <div className="text-3xl font-extrabold text-slate-700 dark:text-slate-300">
                  {Math.max(0, totalCourseStudents - liveCount)}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Remaining / Absent
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QR Code Screen Display */}
        <div>
          {sessionActive && sessionId ? (
            <QRGenerator
              sessionId={sessionId}
              courseId={selectedCourse}
              courseName={courseName}
              expirySeconds={expirySeconds}
              onExpire={() => setSessionActive(false)}
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[300px] shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  No Active Session
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Select a course and click <strong>Start Live QR Session</strong> to project the attendance QR code.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Stream Attendee List (Updates in real time) */}
      {sessionActive && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-slide-up">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Live Attendees Stream — {courseName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-slate-900 dark:text-white">{liveCount}</span> of {totalCourseStudents} present
              {lastSyncTime && <span className="text-[10px] text-slate-400">({lastSyncTime})</span>}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {liveStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Waiting for first student scan...
              </div>
            ) : (
              liveStudents.map((s, i) => (
                <div key={s.id || i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors animate-scale-in">
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                    {s.studentName?.charAt(0) || "S"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{s.studentName}</div>
                    <div className="text-xs text-slate-400 font-mono">{s.rollNo}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium">
                      {s.method}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {s.time}
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
