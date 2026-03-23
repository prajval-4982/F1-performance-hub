import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import AppShell from '@/components/layout/AppShell';
import { Inter, Orbitron, Rajdhani, Manrope } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], weight: ['600', '700', '900'], variable: '--font-orbitron', display: 'swap' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rajdhani', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'F1 Performance Hub · 2026',
  description: 'Track Analyzer, Live 2026 Season standings, and Car Comparison — powered by Jolpica F1 API and FastF1 telemetry',
  openGraph: {
    title: 'F1 Performance Hub · 2026',
    description: 'Interactive F1 dash with real-time standings and telemetry.',
    url: 'https://f1hub.app',
    siteName: 'F1 Performance Hub',
    images: [
      {
        url: 'https://f1hub.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'F1 Performance Hub · 2026',
    description: 'Track Analyzer, Live 2026 Season standings and more.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/hero-car.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e10600" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
