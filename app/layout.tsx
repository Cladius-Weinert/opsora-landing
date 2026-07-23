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
    "AI receptionist untuk bisnis Bali: villa, gym, spa, klinik, rental. Lead capture, draft balasan AI, CRM, dan human handoff. Denpasar/Bali SMB.",
  applicationName: "Opsora",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Opsora AI Receptionist — Bali SMB",
    description:
      "Tangkap inquiry, draft balasan AI, simpan lead ke CRM. Khusus villa, gym, spa, klinik, rental di Bali.",
    url: "/",
    siteName: "Opsora",
    images: [{ url: "/opsora-dashboard-preview.png", width: 1536, height: 1024, alt: "Opsora dashboard" }],
    locale: "id_ID",
    type: "website"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050f0d"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={outfit.variable}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
