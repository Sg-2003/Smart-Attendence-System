import StatsCard from "@/components/dashboard/StatsCard";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Camera,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";

const systemStats = [
  {
    title: "Total Students",
    value: "2,847",
    subtitle: "Active enrollments",
    icon: GraduationCap,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    trend: { value: 12, label: "vs last semester" },
  },
  {
    title: "Faculty Members",
    value: 124,
    subtitle: "Across all departments",
    icon: Users,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    trend: { value: 4, label: "vs last semester" },
  },
  {
    title: "Active Courses",
    value: 68,
    subtitle: "This semester",
    icon: BookOpen,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    title: "Today's Attendance",
    value: "78%",
    subtitle: "System-wide average",
    icon: ClipboardCheck,
    iconColor: "text-green-600",
    iconBg: "bg-green-50 dark:bg-green-950/40",
    trend: { value: 2, label: "vs yesterday" },
  },
];

const departments = [
  { name: "Computer Science", students: 648, attendance: 85, courses: 18 },
  { name: "Information Technology", students: 512, attendance: 79, courses: 14 },
  { name: "Electronics & Comm.", students: 487, attendance: 73, courses: 15 },
  { name: "Mechanical Engg.", students: 423, attendance: 69, courses: 12 },
  { name: "Civil Engineering", students: 311, attendance: 77, courses: 9 },
];

const recentLogs = [
  { user: "Dr. Amit Gupta", action: "Generated QR Session", course: "Data Structures", time: "2:01 PM", type: "qr" },
  { user: "Ananya Singh", action: "Face Attendance Marked", course: "DBMS", time: "1:55 PM", type: "face" },
  { user: "Admin", action: "User account created", course: "—", time: "12:30 PM", type: "admin" },
  { user: "Prof. Sneha Reddy", action: "Manual Override", course: "DBMS — Rahul V.", time: "11:45 AM", type: "override" },
  { user: "System", action: "Low attendance alert sent", course: "Computer Networks", time: "10:00 AM", type: "alert" },
];

const weeklyAttendance = [
  { day: "Mon", pct: 82 },
  { day: "Tue", pct: 75 },
  { day: "Wed", pct: 88 },
  { day: "Thu", pct: 71 },
  { day: "Fri", pct: 78 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            System overview •{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Export Reports
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* AI Summary Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold mb-1">AI Attendance Summary — Today</div>
            <p className="text-sm text-blue-100 leading-relaxed">
              System-wide attendance is at <strong className="text-white">78%</strong> today, 
              2% above yesterday. <strong className="text-white">3 courses</strong> are flagging low 
              attendance (below 65%). Computer Networks has the lowest at <strong className="text-white">63%</strong>. 
              <strong className="text-white"> 12 students</strong> have used face recognition, 
              <strong className="text-white"> 87 students</strong> used QR codes.
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">
              Department Performance
            </h2>
            <Link href="/admin/departments" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Manage
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {departments.map((d) => (
                  <tr key={d.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">{d.name}</td>
                    <td className="px-6 py-3.5 text-slate-500">{d.students.toLocaleString()}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.attendance >= 75 ? "bg-green-500" : d.attendance >= 65 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${d.attendance}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${d.attendance >= 75 ? "text-green-600" : d.attendance >= 65 ? "text-amber-600" : "text-red-500"}`}>
                          {d.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{d.courses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
            Weekly Attendance Trend
          </h2>
          <div className="flex items-end gap-3 h-32 mb-3">
            {weeklyAttendance.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-slate-500">
                  {d.pct}%
                </span>
                <div
                  className="w-full rounded-lg gradient-brand min-h-[8px]"
                  style={{ height: `${(d.pct / 100) * 100}%` }}
                />
                <span className="text-[10px] text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Week Average</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.round(weeklyAttendance.reduce((a, d) => a + d.pct, 0) / weeklyAttendance.length)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            Recent Audit Logs
          </h2>
          <Link href="/admin/logs" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.type === "qr"
                    ? "bg-blue-100 dark:bg-blue-950/40"
                    : log.type === "face"
                    ? "bg-violet-100 dark:bg-violet-950/40"
                    : log.type === "alert"
                    ? "bg-amber-100 dark:bg-amber-950/40"
                    : log.type === "override"
                    ? "bg-orange-100 dark:bg-orange-950/40"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {log.type === "qr" ? <QrCode className="w-3.5 h-3.5 text-blue-600" /> :
                 log.type === "face" ? <Camera className="w-3.5 h-3.5 text-violet-600" /> :
                 log.type === "alert" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> :
                 log.type === "override" ? <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> :
                 <Shield className="w-3.5 h-3.5 text-slate-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-900 dark:text-white">
                  <span className="font-medium">{log.user}</span>{" "}
                  <span className="text-slate-500">— {log.action}</span>
                </div>
                {log.course !== "—" && (
                  <div className="text-xs text-slate-400 mt-0.5">{log.course}</div>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
