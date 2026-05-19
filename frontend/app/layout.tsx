import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ratemyoutfit.app'),
  title: {
    default: 'RateMyOutfit — AI Fashion Judge',
    template: '%s | RateMyOutfit',
  },
  description:
    'Get your outfit rated by AI in seconds. Score, tips, vibes, roasts — your personal fashion critic is ready.',
  keywords: [
    'outfit rating',
    'AI fashion',
    'style analysis',
    'outfit feedback',
    'fashion AI',
    'rate my fit',
  ],
  authors: [{ name: 'RateMyOutfit' }],
  creator: 'RateMyOutfit',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ratemyoutfit.app',
    title: 'RateMyOutfit — AI Fashion Judge',
    description: 'Get your outfit rated by AI in seconds.',
    siteName: 'RateMyOutfit',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RateMyOutfit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RateMyOutfit — AI Fashion Judge',
    description: 'Get your outfit rated by AI in seconds.',
    images: ['/og-image.png'],
    creator: '@ratemyoutfit',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
