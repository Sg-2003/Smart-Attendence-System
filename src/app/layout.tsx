import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MediaErrorSuppressor from "@/components/MediaErrorSuppressor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AttendAI Pro – AI Smart Attendance Management System",
    template: "%s | AttendAI Pro",
  },
  description:
    "AttendAI Pro is a production-grade AI-powered attendance management system featuring face recognition, dynamic QR codes, GPS geofencing, and real-time analytics.",
  keywords: [
    "attendance management",
    "face recognition",
    "QR attendance",
    "AI attendance",
    "smart attendance",
  ],
  openGraph: {
    title: "AttendAI Pro – AI Smart Attendance Management System",
    description:
      "Secure • Contactless • Intelligent Attendance Platform combining Face Recognition, QR Codes, and GPS.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MediaErrorSuppressor />
        {children}
      </body>
    </html>
  );
}

