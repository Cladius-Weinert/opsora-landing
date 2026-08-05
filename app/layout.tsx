import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Opsora AI — One Terminal. Every AI Provider. Zero Vendor Lock-in.',
    template: '%s | Opsora AI',
  },
  description: 'Multi-provider AI gateway with OpenAI-compatible API. Route to NVIDIA NIM, Alibaba DashScope, AWS Bedrock, and local models with intelligent fallback, cost tracking, and streaming.',
  keywords: ['AI gateway', 'multi-provider', 'LLM', 'NVIDIA NIM', 'Alibaba DashScope', 'OpenAI compatible', 'AI infrastructure'],
  authors: [{ name: 'Opsora AI', url: 'https://opsora.ai' }],
  creator: 'Opsora AI',
  publisher: 'Opsora AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://opsora.ai',
    title: 'Opsora AI — One Terminal. Every AI Provider.',
    description: 'Multi-provider AI gateway with intelligent routing, fallback, and cost tracking.',
    siteName: 'Opsora AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Opsora AI - Multi-provider AI Gateway',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opsora AI',
    description: 'One Terminal. Every AI Provider. Zero Vendor Lock-in.',
    images: ['/og-image.png'],
    creator: '@opsora_ai',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Opsora AI',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Cloud',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Multi-provider AI gateway with OpenAI-compatible API',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-void-50 text-foreground">
        {children}
      </body>
    </html>
  );
}