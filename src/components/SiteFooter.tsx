'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { Spotlight, Magnetic } from '@/components/fx';

export function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SHOP = [
  { name: 'Air Conditioners', url: '/products?category=air-conditioners' },
  { name: 'Refrigerators', url: '/products?category=refrigerators' },
  { name: 'Washing Machines', url: '/products?category=washing-machines' },
  { name: 'Smart TVs', url: '/products?category=televisions' },
  { name: 'Kitchen Appliances', url: '/products?category=kitchen' },
];

const HELP = [
  { name: 'About Smart Choice', url: '/about' },
  { name: 'Contact & Directions', url: '/contact' },
  { name: 'Visit Our Shop', url: '/contact' },
  { name: 'Warranty Support', url: '/contact' },
  { name: 'My Cart', url: '/cart' },
];

export default function SiteFooter() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]" />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-20">
        {/* CTA band */}
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
          <Spotlight />
          <div className="relative">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-electric-400">Need advice?</p>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
              Not sure what to buy?
              <br />
              <span className="text-white/50">Just message us.</span>
            </h2>
          </div>
          <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row lg:justify-end">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <img src="/brand/sc-logo-full-white.png" alt={SITE.name} className="h-20 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              {SITE.description} Genuine brands, fair prices and friendly service from Raddoluwa, Seeduwa.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-[#1877F2]"
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-[#25D366]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-electric"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Shop</h4>
            <ul className="space-y-3">
              {SHOP.map((l) => (
                <li key={l.name}>
                  <Link href={l.url} className="text-[15px] text-white/75 transition-colors hover:text-white">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Help</h4>
            <ul className="space-y-3">
              {HELP.map((l) => (
                <li key={l.name}>
                  <Link href={l.url} className="text-[15px] text-white/75 transition-colors hover:text-white">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Visit the shop</h4>
            <ul className="space-y-4 text-[15px] text-white/75">
              <li>
                <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="group flex gap-3 hover:text-white">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                  <span>
                    {SITE.address}
                    <span className="ml-1 inline-flex items-center text-xs text-electric-400 group-hover:underline">
                      Directions <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phoneTel}`} className="flex gap-3 hover:text-white">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex gap-3 break-all hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                {SITE.hours}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark — a light follows the cursor across the letters */}
      <FooterWordmark />

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * The big "SMART CHOICE" at the bottom. Faint at rest; where the cursor is,
 * a soft light shines on the letters (fill + rim) and a glow sits behind them.
 * On touch screens the light follows the finger while dragging.
 */
function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const frame = useRef(0);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = (textRef.current ?? el).getBoundingClientRect();
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      // container coords for the glow, text coords for the lit letters
      el.style.setProperty('--mx', `${clientX - r.left}px`);
      el.style.setProperty('--my', `${clientY - r.top}px`);
      el.style.setProperty('--tx', `${clientX - t.left}px`);
      el.style.setProperty('--ty', `${clientY - t.top}px`);
      el.dataset.lit = 'on';
    });
  };
  const leave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) delete ref.current.dataset.lit;
  };

  const word = 'mx-auto max-w-[1280px] translate-y-[22%] whitespace-nowrap text-center font-display text-[11vw] font-extrabold leading-none tracking-tighter xl:text-[150px]';
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerCancel={leave}
      className="sc-wordmark relative select-none overflow-hidden px-5"
      aria-hidden="true"
    >
      {/* glow behind the letters */}
      <div className="sc-wordmark-glow pointer-events-none absolute inset-0" />
      {/* resting letters */}
      <p ref={textRef} className={`${word} text-white/[0.05]`}>SMART CHOICE</p>
      {/* lit rim: thin outline that only shows near the cursor */}
      <p className={`${word} sc-wordmark-rim pointer-events-none absolute inset-x-5 top-0`}>SMART CHOICE</p>
      {/* lit fill */}
      <p className={`${word} sc-wordmark-fill pointer-events-none absolute inset-x-5 top-0`}>SMART CHOICE</p>
    </div>
  );
}
