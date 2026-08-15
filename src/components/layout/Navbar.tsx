"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Brain, Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center glow-blue group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-base text-slate-900 dark:text-white">
              AttendAI{" "}
              <span className="gradient-brand-text">Pro</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide">
              Smart Attendance
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm font-semibold text-white rounded-xl gradient-brand hover:opacity-90 transition-all shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          id="navbar-menu-toggle"
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="px-4 py-2.5 text-sm font-medium text-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2.5 text-sm font-semibold text-center text-white rounded-xl gradient-brand"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
