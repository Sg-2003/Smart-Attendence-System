import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Access Denied
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          You don&apos;t have permission to access this page. Please sign in
          with an account that has the required role.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
