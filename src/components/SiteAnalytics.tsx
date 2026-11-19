'use client';

import { Analytics } from '@vercel/analytics/react';

/** Vercel Web Analytics for the public site; admin pages are not counted. */
export default function SiteAnalytics() {
  return <Analytics beforeSend={(e) => (new URL(e.url).pathname.startsWith('/admin') ? null : e)} />;
}
