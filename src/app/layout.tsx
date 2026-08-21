import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/shared/ScrollToTop';
import PwaRegistry from '@/components/providers/PwaRegistry';
import AuthProvider from '@/components/providers/AuthProvider';
import JsonLd from '@/components/shared/JsonLd';
import ClientOverlays from '@/components/shared/ClientOverlays';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NexaPay — Level Up Instantly | Top Up Game & Produk Digital',
    template: '%s | NexaPay',
  },
  description:
    'Platform top-up game & produk digital terpercaya, tercepat, dan teraman di Indonesia. Top up Mobile Legends, Free Fire, Genshin Impact, dan ribuan produk digital lainnya dengan harga termurah.',
  keywords: [
    'top up game',
    'diamond mobile legends',
    'free fire',
    'genshin impact',
    'valorant',
    'voucher game',
    'pulsa murah',
    'token pln',
    'produk digital',
    'nexapay',
  ],
  authors: [{ name: 'NexaPay' }],
  creator: 'NexaPay',
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexapay.id'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'NexaPay',
    title: 'NexaPay — Level Up Instantly',
    description:
      'Platform top-up game & produk digital #1 di Indonesia. Proses instan, harga termurah, 500+ game & produk digital.',
    images: [{ url: '/icons/icon-512x512.png', width: 512, height: 512, alt: 'NexaPay' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaPay — Level Up Instantly',
    description: 'Platform top-up game & produk digital #1 di Indonesia.',
    images: ['/icons/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D1A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import MobileNav from '@/components/layout/MobileNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <JsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            {/* Skip navigation for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:gradient-primary focus:text-white focus:font-medium focus:text-sm"
            >
              Lewati ke konten utama
            </a>
            {/* Navbar is imported on individual pages to avoid double rendering */}
            {children}
            <ClientOverlays />
            <MobileNav />
            <ScrollToTop />
            <PwaRegistry />
            <Toaster
              position="top-center"
              theme="dark"
              toastOptions={{
                style: {
                  background: 'rgba(18, 18, 24, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  color: '#f8fafc',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 115, 0, 0.15)',
                  padding: '12px 16px',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
