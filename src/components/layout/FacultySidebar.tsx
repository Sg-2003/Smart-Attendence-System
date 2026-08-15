"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Brain,
  LayoutDashboard,
  QrCode,
  ClipboardList,
  BarChart3,
  Users,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/faculty", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/faculty/classes", label: "My Classes", icon: BookOpen },
  { href: "/faculty/qr", label: "QR Session", icon: QrCode },
  { href: "/faculty/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/faculty/students", label: "Students", icon: Users },
  { href: "/faculty/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/faculty/notifications", label: "Notifications", icon: Bell },
  { href: "/faculty/settings", label: "Settings", icon: Settings },
];

export default function FacultySidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              AttendAI <span className="gradient-brand-text">Pro</span>
            </span>
            <div className="text-[10px] text-slate-400">Faculty Portal</div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "gradient-brand text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-500" />
        )}
      </button>
    </aside>
  );
}
