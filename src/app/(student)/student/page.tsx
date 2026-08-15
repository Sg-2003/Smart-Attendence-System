import { auth } from "@/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import { getStudentDashboardMetrics } from "@/lib/attendanceStore";
import {
  ClipboardCheck,
  BookOpen,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const session = await auth();
  const metrics = getStudentDashboardMetrics(session?.user?.id);

  const stats = [
    {
      title: "Attendance Rate",
      value: metrics.overallRate,
      subtitle: "This semester",
      icon: ClipboardCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-50 dark:bg-green-950/40",
      trend: { value: 3, label: "vs last month" },
    },
    {
      title: "Classes Today",
      value: metrics.classesToday,
      subtitle: `Next: ${metrics.schedule[0]?.course || "Data Structures"}`,
      icon: BookOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Total Absences",
      value: metrics.totalAbsences,
      subtitle: "This semester",
      icon: XCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-50 dark:bg-red-950/40",
      trend: { value: -2, label: "vs last month" },
    },
    {
      title: "Classes Attended",
      value: metrics.totalAttendedCombined,
      subtitle: "All courses combined",
      icon: Calendar,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50 dark:bg-violet-950/40",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Good morning, {session?.user?.name?.split(" ")[0] ?? "Student"} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/student/attendance"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
          >
            <QrCode className="w-4 h-4" />
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
              Today&apos;s Schedule
            </h2>
            <Link
              href="/student/courses"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {metrics.schedule.map((cls) => (
              <div key={cls.id} className="flex items-center gap-4 px-6 py-4">
                <div className="text-center w-16 flex-shrink-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {cls.time.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {cls.time.split(" ")[1]}
                  </div>
                </div>
                <div className="w-0.5 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {cls.course}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cls.room}
                    </span>
                    <span className="text-xs text-slate-400">{cls.faculty}</span>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg ${
                    cls.status === "attended"
                      ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                      : "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {cls.status === "attended" ? "✓ Attended" : "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/student/attendance"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
              >
                <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Scan QR Code
                </span>
              </Link>
              <Link
                href="/student/attendance"
                className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-950/50 transition-colors"
              >
                <Camera className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  Face Recognition
                </span>
              </Link>
              <Link
                href="/student/face-profile"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Setup Face Profile
                </span>
              </Link>
            </div>
          </div>

          {/* Weekly Attendance Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
              This Week
            </h2>
            <div className="flex items-end gap-2 h-24">
              {metrics.weeklyData.map((d) => {
                const pct = (d.present / d.total) * 100;
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg relative" style={{ height: "72px" }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-lg gradient-brand transition-all"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attendance Status Notification */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Live Attendance Tracking
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  Subject counts and percentages update in real-time as you mark attendance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
            Recent Attendance
          </h2>
          <Link
            href="/student/attendance"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark Another &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {metrics.recentAttendance.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">
                    {row.courseName}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                    {row.date}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                    {row.time}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      {row.method === "QR" ? (
                        <QrCode className="w-3.5 h-3.5" />
                      ) : row.method === "FACE" ? (
                        <Camera className="w-3.5 h-3.5" />
                      ) : null}
                      {row.method}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${
                        row.status === "PRESENT"
                          ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                          : row.status === "LATE"
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                          : "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {row.status === "PRESENT" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : row.status === "LATE" ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
