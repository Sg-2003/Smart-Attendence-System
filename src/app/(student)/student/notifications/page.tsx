import { Bell, CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react";

const notifications = [
  {
    id: "1",
    title: "Low Attendance Warning",
    message: "Your attendance in Computer Networks (CS303) is 65%. Minimum required is 75%.",
    type: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Attendance Marked",
    message: "Data Structures & Algorithms marked as PRESENT via Dynamic QR Code.",
    type: "success",
    time: "Today at 9:05 AM",
    read: true,
  },
  {
    id: "3",
    title: "Face Profile Active",
    message: "Your biometric face profile was verified successfully. Face recognition attendance enabled.",
    type: "info",
    time: "Yesterday",
    read: true,
  },
  {
    id: "4",
    title: "Class Schedule Update",
    message: "Operating Systems class for Friday has been rescheduled to 3:00 PM in Room CS-204.",
    type: "info",
    time: "3 days ago",
    read: true,
  },
];

export default function StudentNotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            System alerts, attendance confirmations, and announcements.
          </p>
        </div>
        <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {notifications.map((n) => {
          const Icon =
            n.type === "warning"
              ? AlertTriangle
              : n.type === "success"
              ? CheckCircle2
              : Info;
          const iconBg =
            n.type === "warning"
              ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600"
              : n.type === "success"
              ? "bg-green-100 dark:bg-green-950/40 text-green-600"
              : "bg-blue-100 dark:bg-blue-950/40 text-blue-600";

          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-5 transition-colors ${
                !n.read ? "bg-blue-50/40 dark:bg-blue-950/10" : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {n.title}
                  </h2>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {n.message}
                </p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
