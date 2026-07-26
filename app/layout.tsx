import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://opsora-landing-zeta.vercel.app"),
  title: {
    default: "Opsora — AI Receptionist for Service Businesses",
    template: "%s | Opsora"
  },
  description:
    "Capture inquiries from your website, WhatsApp, and social media. AI generates reply drafts in minutes. Your team reviews and sends. No auto-spam.",
  applicationName: "Opsora",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Opsora — AI Receptionist for Service Businesses",
    description:
      "Every inquiry captured, AI reply draft generated in under 3 minutes, saved to CRM. Human approval workflow. For service businesses worldwide.",
    url: "/",
    siteName: "Opsora",
    images: [{ url: "/opsora-dashboard-preview.png", width: 1536, height: 1024, alt: "Opsora dashboard" }],
    locale: "en_US",
    type: "website"
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Opsora — AI Receptionist for Service Businesses",
    description:
      "Inquiry captured → AI reply drafted in <3 min → your team approves → customer notified. Zero auto-send.",
    images: ["/opsora-dashboard-preview.png"]
  },
  keywords: [
    "AI receptionist",
    "lead capture automation",
    "customer response automation",
    "WhatsApp business API",
    "AI reply drafts",
    "CRM for service businesses",
    "human-in-the-loop AI",
    "business automation",
    "Opsora"
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050f0d"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
