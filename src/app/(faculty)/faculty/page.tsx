import { auth } from "@/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, ClipboardCheck, BookOpen, BarChart3, Clock, QrCode, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

const mockStats = [
  {
    title: "Total Students",
    value: 186,
    subtitle: "Across all courses",
    icon: Users,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    trend: { value: 5, label: "vs last semester" },
  },
  {
    title: "Today's Attendance",
    value: "82%",
    subtitle: "All active sessions",
    icon: ClipboardCheck,
    iconColor: "text-green-600",
    iconBg: "bg-green-50 dark:bg-green-950/40",
  },
  {
    title: "Active Courses",
    value: 4,
    subtitle: "This semester",
    icon: BookOpen,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    title: "Avg Attendance",
    value: "79%",
    subtitle: "Semester average",
    icon: BarChart3,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    trend: { value: -2, label: "vs last month" },
  },
];

const todaysSessions = [
  { course: "Data Structures & Algorithms", time: "09:00 AM", room: "CS-201", present: 42, total: 48, status: "completed" },
  { course: "Database Management System", time: "11:00 AM", room: "CS-102", present: 38, total: 45, status: "completed" },
  { course: "Computer Networks", time: "02:00 PM", room: "CS-301", present: 0, total: 44, status: "upcoming" },
  { course: "Operating Systems", time: "04:00 PM", room: "CS-204", present: 0, total: 49, status: "upcoming" },
];

const recentActivity = [
  { type: "attendance", msg: "42/48 students present — Data Structures (9AM)", time: "2h ago" },
  { type: "qr", msg: "QR session expired — DBMS (11AM)", time: "1h ago" },
  { type: "alert", msg: "3 students below 75% — Computer Networks", time: "30min ago" },
  { type: "attendance", msg: "38/45 students present — DBMS (11AM)", time: "1h ago" },
];

export default async function FacultyDashboard() {
  const session = await auth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Faculty Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, {session?.user?.name?.split(" ")[0] ?? "Professor"} •{" "}
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          href="/faculty/qr"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
        >
          <QrCode className="w-4 h-4" />
          Generate QR
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Today&apos;s Sessions</h2>
            <Link href="/faculty/classes" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Manage Classes
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {todaysSessions.map((s) => {
              const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
              return (
                <div key={s.course} className="flex items-center gap-4 px-6 py-4">
                  <div className="text-center w-16 flex-shrink-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{s.time.split(" ")[0]}</div>
                    <div className="text-[10px] text-slate-400">{s.time.split(" ")[1]}</div>
                  </div>
                  <div className="w-0.5 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{s.course}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400">{s.room}</span>
                      {s.status === "completed" && (
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-20 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 75 ? "bg-green-500" : "bg-amber-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{s.present}/{s.total}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {s.status === "completed" ? (
                    <span className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {pct}%
                    </span>
                  ) : (
                    <Link
                      href="/faculty/qr"
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg gradient-brand text-white hover:-translate-y-0.5 transition-all"
                    >
                      <QrCode className="w-3 h-3" />
                      Start
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  a.type === "attendance" ? "bg-green-100 dark:bg-green-950/40" :
                  a.type === "qr" ? "bg-blue-100 dark:bg-blue-950/40" :
                  "bg-amber-100 dark:bg-amber-950/40"
                }`}>
                  {a.type === "attendance" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> :
                   a.type === "qr" ? <QrCode className="w-3.5 h-3.5 text-blue-600" /> :
                   <XCircle className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{a.msg}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
