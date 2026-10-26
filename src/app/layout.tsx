import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import GlobalDrawers from '@/components/GlobalDrawers';

export const metadata: Metadata = {
  title: 'Smart Choice LK — Choose Smart. Live Better. | Home Appliances Sri Lanka',
  description:
    'Smart Choice LK — Sri Lanka’s trusted home appliance & electronics store. Buy Inverter Air Conditioners, Refrigerators, AI Washing Machines, 4K TVs, and kitchen electronics with 10-20 year warranties and express islandwide delivery.',
  keywords: [
    'Smart Choice LK',
    'Inverter Air Conditioners Sri Lanka',
    'Refrigerators Colombo',
    'Washing Machines Sri Lanka',
    'LG Inverter AC',
    'Samsung Refrigerator',
    'Home Appliances LK',
  ],
  icons: {
    icon: '/smart-choice-logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          {children}
          <GlobalDrawers />
        </StoreProvider>
      </body>
    </html>
  );
}
