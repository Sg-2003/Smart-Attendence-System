"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Brain,
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  ScrollText,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/logs", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-sm text-white">
              AttendAI <span className="gradient-brand-text">Pro</span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              Admin Control
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
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
                  ? "gradient-brand text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-2 py-3 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-950/40 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-700 transition-all z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-400" />
        )}
      </button>
    </aside>
  );
}
