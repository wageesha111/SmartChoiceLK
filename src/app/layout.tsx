import React from 'react';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import GlobalDrawers from '@/components/GlobalDrawers';
import FloatingActions from '@/components/FloatingActions';
import SiteAnalytics from '@/components/SiteAnalytics';
import { SITE_URL } from '@/lib/siteUrl';

// Fraunces is bundled with the site (SIL OFL) instead of fetched from Google Fonts at build time,
// so a Google Fonts hiccup can no longer fail the Vercel build.
const fraunces = localFont({
  src: [
    { path: './fonts/fraunces-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/fraunces-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/fraunces-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Choice LK — Choose Smart. Live Better. | Home Electronics, Seeduwa',
  description:
    'Smart Choice LK, Raddoluwa – Seeduwa: your one-stop shop for high-quality home electronics. Inverter ACs, refrigerators, washing machines, smart TVs and kitchen appliances. Visit and collect from our shop. Call / WhatsApp 076 646 7854.',
  keywords: [
    'Smart Choice LK',
    'Smart Choice Seeduwa',
    'Electronics shop Raddoluwa',
    'Inverter Air Conditioners Sri Lanka',
    'Refrigerators Sri Lanka',
    'Washing Machines Sri Lanka',
    'Samsung QLED TV Sri Lanka',
    'Home Appliances Negombo Seeduwa',
  ],
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: '/smart-choice-logo.png',
  },
  openGraph: {
    title: 'Smart Choice LK — Choose Smart. Live Better.',
    description: 'Your one-stop shop for high-quality home electronics in Seeduwa, Sri Lanka.',
    images: ['/smart-choice-logo.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050B1A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fraunces.variable} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* Home page hero: hide the header from the first paint so it doesn't flash in and slide away */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(location.pathname==='/'&&window.scrollY<window.innerHeight*0.6&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='on'}catch(e){}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&family=Oswald:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          {children}
          <GlobalDrawers />
          <FloatingActions />
        </StoreProvider>
        <SiteAnalytics />
      </body>
    </html>
  );
}
