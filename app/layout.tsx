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
    default: "Opsora AI Receptionist — Bali SMB Automation",
    template: "%s | Opsora"
  },
  description:
    "AI receptionist for Bali businesses: villa, gym, spa, clinic, rental. Lead capture, AI reply draft, CRM, and human handoff. Denpasar/Bali SMB.",
  applicationName: "Opsora",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Opsora AI Receptionist — Bali SMB",
    description:
      "Capture inquiries, draft AI replies, save leads to CRM. For villas, gyms, spas, clinics, and rentals in Bali.",
    url: "/",
    siteName: "Opsora",
    images: [{ url: "/opsora-dashboard-preview.png", width: 1536, height: 1024, alt: "Opsora dashboard" }],
    locale: "en_US",
    type: "website"
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Opsora AI Receptionist — Bali SMB",
    description:
      "Capture inquiries, draft AI replies, save leads to CRM. For villas, gyms, spas, clinics, and rentals in Bali.",
    images: ["/opsora-dashboard-preview.png"]
  },
  keywords: [
    "AI receptionist Bali",
    "lead capture Bali",
    "business CRM Bali",
    "WhatsApp automation for businesses",
    "AI reply for villa Bali",
    "Opsora",
    "AI receptionist Indonesia"
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
