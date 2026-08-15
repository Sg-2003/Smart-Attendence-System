import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Bell, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800/50">
              <Shield className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="text-xs font-semibold text-red-700 dark:text-red-400">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                {session.user.name?.charAt(0) ?? "A"}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {session.user.name ?? "Admin"}
                </div>
                <div className="text-[10px] text-slate-400">Administrator</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">{children}</main>
      </div>
    </div>
  );
}
