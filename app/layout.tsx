import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import PWARegister from '@/components/PWARegister';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CartSnap - Smart Grocery Scanner & Budget Tracker',
  description: 'Smart grocery product scanning, OCR price extraction, and real-time basket tracking dashboard.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CartSnap',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0b1c30',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-50 min-h-screen text-[#0b1c30]" suppressHydrationWarning>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
