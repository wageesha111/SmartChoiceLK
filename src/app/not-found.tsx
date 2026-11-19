import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { SITE, whatsappLink } from '@/lib/site';

export const metadata = { title: 'Page not found — Smart Choice LK' };

export default function NotFound() {
  return (
    <div className="bg-mist font-sans text-ink antialiased">
      <SiteNavbar />
      <main className="sc-noise relative -mt-[76px] overflow-hidden bg-ink pt-[76px] text-white">
        <div className="sc-grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-electric/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-glow/20 blur-[110px]" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-[720px] flex-col items-center justify-center px-5 py-24 text-center">
          <p className="bg-gradient-to-r from-glow to-electric bg-clip-text font-display text-[96px] font-bold leading-none text-transparent sm:text-[140px]">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">This page isn’t here</h1>
          <p className="mt-3 text-white/60">The link may be old, or the product may have been removed. Try the shop, or ask us directly.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="rounded-full bg-electric px-6 py-3 text-sm font-bold text-white hover:bg-electric-600">
              Browse products
            </Link>
            <Link href="/" className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/15 hover:bg-white/20">
              Go home
            </Link>
            <a href={whatsappLink(`Hello ${SITE.name}! I was looking for something on your website.`)} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white">
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
