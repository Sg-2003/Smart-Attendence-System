import { auth } from "@/auth";
import { getStudentCoursesProgress } from "@/lib/attendanceStore";
import { BookOpen, Users, Clock, CheckCircle2, AlertTriangle, FileText, QrCode } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StudentCoursesPage() {
  const session = await auth();
  const courses = getStudentCoursesProgress(session?.user?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Enrolled Courses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track live attendance progress and course metrics for Semester 4.
          </p>
        </div>
        <Link
          href="/student/attendance"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all w-fit"
        >
          <QrCode className="w-4 h-4" />
          Mark Attendance
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const isLow = course.attendanceRate < 75;
          return (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    {course.code} • {course.credits} Credits
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${
                      isLow
                        ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                        : "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                    }`}
                  >
                    {isLow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {course.attendanceRate}% Attendance
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {course.name}
                </h2>
                <p className="text-xs text-slate-400 mb-5">Faculty: {course.faculty}</p>

                {/* Progress bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Classes Attended</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {course.attended} / {course.total} Sessions
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLow ? "bg-red-500" : "gradient-brand"
                      }`}
                      style={{ width: `${course.attendanceRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">
                  {course.isTodayAttended ? "✓ Marked present today" : "Min. required: 75%"}
                </span>
                <Link
                  href={`/student/attendance`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Mark Attendance &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
