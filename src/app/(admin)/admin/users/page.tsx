"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Filter, GraduationCap, Users, Shield, MoreVertical } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Ananya Singh", email: "ananya@college.edu", role: "STUDENT", department: "Computer Science", semester: 4, createdAt: "2024-08-01", status: "active" },
  { id: "2", name: "Rahul Verma", email: "rahul@college.edu", role: "STUDENT", department: "IT", semester: 6, createdAt: "2024-08-01", status: "active" },
  { id: "3", name: "Dr. Amit Gupta", email: "amit@college.edu", role: "FACULTY", department: "Computer Science", semester: null, createdAt: "2023-06-15", status: "active" },
  { id: "4", name: "Prof. Sneha Reddy", email: "sneha@college.edu", role: "FACULTY", department: "IT", semester: null, createdAt: "2023-06-15", status: "active" },
  { id: "5", name: "Kavya Nair", email: "kavya@college.edu", role: "STUDENT", department: "ECE", semester: 2, createdAt: "2025-01-10", status: "active" },
  { id: "6", name: "Arjun Mehta", email: "arjun@college.edu", role: "STUDENT", department: "Mechanical", semester: 3, createdAt: "2024-08-01", status: "inactive" },
  { id: "7", name: "Admin User", email: "admin@attendai.pro", role: "ADMIN", department: "—", semester: null, createdAt: "2023-01-01", status: "active" },
];

const roleConfig = {
  STUDENT: { icon: GraduationCap, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" },
  FACULTY: { icon: Users, color: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400" },
  ADMIN: { icon: Shield, color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400" },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {mockUsers.length} total users — manage students, faculty, and admins.
          </p>
        </div>
        <button
          id="add-user-btn"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl gradient-brand text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="user-search"
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "STUDENT", "FACULTY", "ADMIN"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  roleFilter === r
                    ? "gradient-brand text-white border-transparent"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((user) => {
                const { icon: RoleIcon, color } = roleConfig[user.role as keyof typeof roleConfig];
                return (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${color}`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {user.department}
                      {user.semester && <span className="text-slate-400"> • Sem {user.semester}</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                          aria-label="Edit user"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {mockUsers.length} users</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Previous</button>
            <button className="px-3 py-1.5 rounded-lg gradient-brand text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
