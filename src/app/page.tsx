import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Brain,
  QrCode,
  MapPin,
  BarChart3,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Scan,
  Clock,
  Star,
  TrendingUp,
  Bell,
  Download,
  Globe,
  Lock,
} from "lucide-react";

// ── Feature Cards Data ──────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI Face Recognition",
    description:
      "Advanced face detection with liveness checks. Students mark attendance in under 2 seconds with 99.8% accuracy.",
    color: "from-blue-500 to-blue-700",
    glow: "shadow-blue-500/20",
  },
  {
    icon: QrCode,
    title: "Dynamic QR Codes",
    description:
      "Faculty generates encrypted, time-expiring QR codes per session. Auto-invalidates after configurable window.",
    color: "from-violet-500 to-purple-700",
    glow: "shadow-purple-500/20",
  },
  {
    icon: MapPin,
    title: "GPS Geofencing",
    description:
      "Attendance is only accepted when the student is physically inside campus boundaries — no proxy attendance.",
    color: "from-emerald-500 to-green-700",
    glow: "shadow-green-500/20",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Live dashboards with attendance trends, department comparisons, heat maps, and automated PDF reports.",
    color: "from-amber-500 to-orange-600",
    glow: "shadow-orange-500/20",
  },
  {
    icon: Shield,
    title: "RBAC Security",
    description:
      "Role-based access control for Students, Faculty, and Admins. JWT sessions, bcrypt encryption, audit logs.",
    color: "from-red-500 to-rose-700",
    glow: "shadow-rose-500/20",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "AI-triggered alerts for low attendance, class reminders, session start notifications, and leave approvals.",
    color: "from-cyan-500 to-teal-700",
    glow: "shadow-cyan-500/20",
  },
];

// ── How It Works Steps ──────────────────────────────────────────────────────
const steps = [
  {
    step: "01",
    title: "Register & Setup",
    description:
      "Students register with email, select department, and complete a one-time face registration via webcam.",
    icon: Users,
  },
  {
    step: "02",
    title: "Faculty Starts Session",
    description:
      "Faculty opens the dashboard, selects a course, and clicks Generate QR. A dynamic code appears with a live countdown.",
    icon: QrCode,
  },
  {
    step: "03",
    title: "Student Marks Attendance",
    description:
      "Students scan the QR or use face recognition. GPS is verified automatically in the background.",
    icon: Scan,
  },
  {
    step: "04",
    title: "AI Validates & Records",
    description:
      "The system checks face match, QR validity, GPS position, session time, and duplicate prevention before saving.",
    icon: CheckCircle2,
  },
];

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "99.8%", label: "Face Recognition Accuracy" },
  { value: "<2s", label: "Attendance Mark Time" },
  { value: "100%", label: "Proxy Prevention Rate" },
  { value: "50K+", label: "Students Tracked Daily" },
];

// ── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for small departments and pilots",
    features: [
      "Up to 100 students",
      "QR attendance",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹2,999",
    period: "/month",
    description: "For colleges and universities",
    features: [
      "Unlimited students",
      "Face recognition",
      "GPS geofencing",
      "Real-time analytics",
      "PDF/Excel exports",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Multi-campus, white-label solution",
    features: [
      "Everything in Pro",
      "Multi-campus support",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated manager",
      "On-premise option",
    ],
    cta: "Contact Sales",
    href: "#contact",
    highlighted: false,
  },
];

// ── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Dr. Priya Sharma",
    role: "HOD, Computer Science — NIT Delhi",
    avatar: "PS",
    rating: 5,
    quote:
      "AttendAI Pro reduced proxy attendance to zero within the first week. The face recognition is impressively accurate even in poor lighting.",
  },
  {
    name: "Prof. Rajesh Kumar",
    role: "Dean Academics — VIT University",
    avatar: "RK",
    rating: 5,
    quote:
      "The analytics dashboard gives me department-wide attendance insights in real time. The PDF export feature alone saves us hours every month.",
  },
  {
    name: "Ananya Singh",
    role: "Student — Delhi University",
    avatar: "AS",
    rating: 5,
    quote:
      "As a student, marking attendance via face recognition feels futuristic. It takes literally 2 seconds and I never have to worry about signing sheets.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-28 sm:pt-32 pb-36 sm:pb-44 lg:pb-52">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          {/* Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-500" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 animate-slide-up">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            AI-Powered • Face Recognition • GPS Verified
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up delay-100">
            The Future of{" "}
            <span className="gradient-brand-text">Attendance</span>
            <br />
            Is Already Here
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
            AttendAI Pro eliminates proxy attendance forever using{" "}
            <strong className="text-slate-200">AI face recognition</strong>,{" "}
            <strong className="text-slate-200">dynamic QR codes</strong>, and{" "}
            <strong className="text-slate-200">GPS geofencing</strong> — all in
            one powerful platform built for institutions that demand accuracy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
            <Link
              id="hero-get-started"
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl gradient-brand shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              id="hero-live-demo"
              href="/login"
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-white/8 border border-white/15 hover:bg-white/15 backdrop-blur-sm transition-all"
            >
              <Scan className="w-4 h-4" />
              View Live Demo
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto animate-slide-up delay-400 relative z-20">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 sm:p-5 text-center border border-white/10 shadow-xl shadow-black/20 hover:border-blue-400/40 hover:-translate-y-1 transition-all">
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-300/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Multi-Layer Smooth Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative block w-full h-14 sm:h-20 lg:h-28 text-slate-50 dark:text-slate-950"
            preserveAspectRatio="none"
          >
            {/* Subtle background layer wave for depth */}
            <path
              d="M0,32 C280,96 560,0 840,48 C1120,96 1300,16 1440,32 L1440,120 L0,120 Z"
              fill="currentColor"
              fillOpacity="0.35"
            />
            {/* Main foreground crisp wave */}
            <path
              d="M0,64 C320,120 640,24 960,72 C1200,108 1360,40 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
              Core Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to{" "}
              <span className="gradient-brand-text">Modernise Attendance</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Six powerful modules working together to ensure accurate, tamper-proof
              attendance records for every class, every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`card-hover group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl ${f.glow}`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-blue-400 tracking-wide uppercase mb-3">
              The Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How{" "}
              <span className="gradient-brand-text">AttendAI Pro</span> Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From student registration to validated attendance in just 4 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/40 to-transparent z-0" />
                  )}
                  <div className="glass rounded-2xl p-6 text-center relative z-10">
                    <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white/10 mb-2 leading-none">
                      {step.step}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by{" "}
              <span className="gradient-brand-text">Institutions Nationwide</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Join 500+ colleges and universities that have modernised their
              attendance with AttendAI Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-24 bg-white dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent{" "}
              <span className="gradient-brand-text">Pricing</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Start free and scale as your institution grows. No hidden fees, no
              surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? "gradient-brand text-white shadow-2xl shadow-blue-500/30 scale-105"
                    : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      plan.highlighted ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-black ${
                        plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`text-sm ${
                          plan.highlighted ? "text-blue-200" : "text-slate-400"
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          plan.highlighted ? "text-blue-200" : "text-green-500"
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-blue-50" : "text-slate-600 dark:text-slate-300"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXTRA FEATURES BANNER ────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Globe, label: "Multi-Language" },
              { icon: Download, label: "PDF & Excel Export" },
              { icon: Clock, label: "Real-Time Updates" },
              { icon: Lock, label: "End-to-End Secure" },
              { icon: TrendingUp, label: "AI Analytics" },
              { icon: Bell, label: "Push Notifications" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center"
              >
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Transform{" "}
            <span className="gradient-brand-text">Attendance</span>{" "}
            at Your Institution?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join 500+ institutions. Set up in under 10 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              id="cta-get-started"
              href="/register"
              className="group flex items-center justify-center gap-2 px-10 py-4 text-base font-bold text-white rounded-2xl gradient-brand shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-2xl border border-white/20 hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
