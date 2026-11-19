import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Fraunces } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import GlobalDrawers from '@/components/GlobalDrawers';
import FloatingActions from '@/components/FloatingActions';
import SiteAnalytics from '@/components/SiteAnalytics';
import { SITE_URL } from '@/lib/siteUrl';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: 'Smart Choice LK — Choose Smart. Live Better. | Home Electronics, Seeduwa',
  description:
    'Smart Choice LK, Raddoluwa – Seeduwa: your one-stop shop for high-quality home electronics. Inverter ACs, refrigerators, washing machines, smart TVs and kitchen appliances with islandwide delivery. Call / WhatsApp 076 646 7854.',
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
  viewportFit: 'cover',
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
        {/* Home page intro: hide the header from the very first paint, so it
            doesn't appear and then slide up when the intro script loads. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(location.pathname==='/'&&window.scrollY<window.innerHeight)document.documentElement.dataset.intro='on'}catch(e){}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&display=swap"
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
