import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FacultySidebar from "@/components/layout/FacultySidebar";
import { Bell, Search } from "lucide-react";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "FACULTY" && session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <FacultySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search students, courses..."
                className="pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-56 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
                {session.user.name?.charAt(0) ?? "F"}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {session.user.name ?? "Faculty"}
                </div>
                <div className="text-[10px] text-slate-400">Faculty</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">{children}</main>
      </div>
    </div>
  );
}
