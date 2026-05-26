import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import SearchOverlay from '@/components/shared/SearchOverlay';
import ScrollToTop from '@/components/shared/ScrollToTop';
import ScratchAndWin from '@/components/shared/ScratchAndWin';
import Navbar from '@/components/layout/Navbar';
import PwaRegistry from '@/components/providers/PwaRegistry';
import AuthProvider from '@/components/providers/AuthProvider';
import JsonLd from '@/components/shared/JsonLd';

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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NexaPay' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexaPay — Level Up Instantly',
    description: 'Platform top-up game & produk digital #1 di Indonesia.',
    images: ['/og-image.jpg'],
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
    apple: '/apple-touch-icon.png',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans text-foreground antialiased min-h-screen relative bg-transparent`}
      >
        <JsonLd />
        {/* Advanced Modern Ambient Background */}
        <div className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-500">
          {/* Light Mode: Glowing Ambient Gradient (Hidden in Dark Mode) */}
          <div className="absolute inset-0 bg-[#f3f4f6] dark:opacity-0 transition-opacity duration-500" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] dark:opacity-0" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-500/15 blur-[120px] dark:opacity-0" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] rounded-full bg-violet-500/15 blur-[120px] dark:opacity-0" />
          
          {/* Dark Mode: Deep Space Background (Hidden in Light Mode) */}
          <div className="absolute inset-0 bg-background opacity-0 dark:opacity-100 transition-opacity duration-500" />
          {/* Subtle indigo glow for dark mode */}
          <div className="absolute top-[-10%] left-[40%] w-[50%] h-[30%] rounded-full bg-indigo-500/5 blur-[120px] opacity-0 dark:opacity-100" />
        </div>
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
            <Navbar />
            {children}
            <SearchOverlay />
            <ScrollToTop />
            <ScratchAndWin />
            <PwaRegistry />
            <Toaster
              position="top-center"
              toastOptions={{
                className: 'bg-card border border-border text-foreground',
                style: {
                  borderRadius: '12px',
                  fontSize: '13px',
                },
              }}
              richColors
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
