import { auth } from "@/auth";
import { User, Mail, GraduationCap, Building2, Calendar, ShieldCheck, Download } from "lucide-react";

export default async function StudentProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Student Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          View personal details, academic information, and download attendance records.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/25">
            {user?.name?.charAt(0) ?? "S"}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {user?.name ?? "Student Name"}
            </h2>
            <p className="text-sm text-slate-400 mb-3">{user?.email}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Face Biometrics Active
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Download PDF Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500" />
              Department
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.department ?? "Computer Science"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
              Semester
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Semester {user?.semester ?? 4}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-500" />
              Role
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.role ?? "STUDENT"}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              Academic Year
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              2025 – 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
