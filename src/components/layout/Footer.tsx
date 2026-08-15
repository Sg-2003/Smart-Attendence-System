import Link from "next/link";
import { Brain, GitBranch, MessageSquare, Link2, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Security", href: "#security" },
    { label: "Changelog", href: "#" },
  ],
  Solutions: [
    { label: "Universities", href: "#" },
    { label: "Schools", href: "#" },
    { label: "Training Centers", href: "#" },
    { label: "Corporate", href: "#" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

const socials = [
  { icon: GitBranch, href: "#", label: "GitHub" },
  { icon: MessageSquare, href: "#", label: "Twitter" },
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                AttendAI <span className="gradient-brand-text">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              The next-generation AI attendance platform combining face recognition,
              QR codes, and GPS for secure, contactless attendance management.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white text-sm mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AttendAI Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Built with</span>
            <span className="text-blue-400 font-medium">Next.js</span>
            <span>+</span>
            <span className="text-blue-400 font-medium">AI</span>
            <span>for the future of education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
