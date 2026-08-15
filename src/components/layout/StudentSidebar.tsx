"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Brain,
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Camera,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/student", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/student/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/student/courses", label: "My Courses", icon: BookOpen },
  { href: "/student/face-profile", label: "Face Profile", icon: Camera },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/settings", label: "Settings", icon: Settings },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap overflow-hidden">
            AttendAI <span className="gradient-brand-text">Pro</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "gradient-brand text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-2 py-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
