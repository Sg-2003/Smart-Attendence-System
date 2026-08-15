import { Brain, Shield, QrCode, BarChart3 } from "lucide-react";
import Link from "next/link";

const highlights = [
  { icon: Brain, text: "AI Face Recognition" },
  { icon: QrCode, text: "Dynamic QR Codes" },
  { icon: Shield, text: "GPS Geofencing" },
  { icon: BarChart3, text: "Real-Time Analytics" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-300" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl text-white">
              AttendAI <span className="gradient-brand-text">Pro</span>
            </div>
            <div className="text-[11px] text-slate-400 tracking-wide">
              Smart Attendance Platform
            </div>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-snug">
            Secure • Contactless •{" "}
            <span className="gradient-brand-text">Intelligent</span>
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">
            The AI-powered attendance platform trusted by 500+ institutions.
            Mark attendance in under 2 seconds with 99.8% accuracy.
          </p>
          <div className="space-y-3">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 glass rounded-2xl p-5">
          <p className="text-slate-300 text-sm italic leading-relaxed">
            &ldquo;AttendAI Pro reduced proxy attendance to zero within the
            first week. The face recognition is impressively accurate.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
              PS
            </div>
            <div>
              <div className="text-white text-xs font-medium">Dr. Priya Sharma</div>
              <div className="text-slate-500 text-[10px]">HOD, CS — NIT Delhi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 bg-slate-50 dark:bg-slate-950">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">
            AttendAI <span className="gradient-brand-text">Pro</span>
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}
