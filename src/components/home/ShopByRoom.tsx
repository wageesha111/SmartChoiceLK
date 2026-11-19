'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CookingPot, Droplets } from 'lucide-react';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { whatsappLink } from '@/lib/site';
import { CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';

/** "Shop by room" bento on warm stone: AC tall, washer + fridge, TV wide. */
const LAYOUT: Record<string, string> = {
  'air-conditioners': 'lg:row-span-2',
  'washing-machines': '',
  refrigerators: '',
  televisions: 'lg:col-span-2',
};
const ORDER = ['air-conditioners', 'washing-machines', 'refrigerators', 'televisions'];

export default function ShopByRoom() {
  const reduce = useReducedMotion();
  const { products } = useStore();
  // Show the kitchen card only once kitchen items are listed; until then point to water heaters.
  const hasKitchen = products.some((p) => p.category === 'kitchen');
  const extra = hasKitchen
    ? { href: '/products?category=kitchen', icon: CookingPot, title: 'Kitchen & built-in cooking', sub: 'Induction hobs, inverter microwaves & airfryers' }
    : { href: '/products?category=small-appliances', icon: Droplets, title: 'Water heaters & more', sub: 'Instant water heaters & small appliances' };
  const tiles = ORDER.map((id) => CATEGORIES.find((c) => c.id === id)).filter(Boolean) as typeof CATEGORIES;

  return (
    <section id="categories-section" className="bg-warm-stone py-24 text-ink">
      <div className="mx-auto max-w-[1280px] px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-electric">Shop by room</p>
            <h2 className="mt-3 font-serif text-4xl font-medium tracking-[-0.01em] text-ink sm:text-5xl">
              Everything your home runs on.
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-electric sm:self-auto"
          >
            Shop all products <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:grid-rows-[260px_260px]">
          {tiles.map((c, i) => (
            <motion.div
              key={c.id}
              className={LAYOUT[c.id]}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products?category=${c.id}`}
                className="group relative block aspect-[4/3] h-full overflow-hidden rounded-[26px] bg-warm-sand lg:aspect-auto"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized={c.image.includes('res.cloudinary.com')}
                  style={c.focus ? { objectPosition: c.focus } : undefined}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/35 to-transparent opacity-80" />
                {c.brands && c.brands.length > 0 && (() => {
                  const max = c.id === 'televisions' ? 6 : 3;
                  const shown = c.brands.slice(0, max);
                  const more = c.brands.length - shown.length;
                  const chips = more > 0 ? [...shown, `+${more}`] : shown;
                  return (
                    <ul
                      className="absolute left-4 right-4 top-4 flex flex-nowrap gap-1.5 overflow-hidden"
                      aria-label={`Brands: ${c.brands.join(', ')}`}
                    >
                      {chips.map((b, j) => (
                        <li
                          key={b}
                          style={reduce ? undefined : { animationDelay: `${300 + i * 80 + j * 70}ms` }}
                          className={`${reduce ? '' : 'sc-chip-in'} shrink-0 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/25`}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 transition-transform duration-500 group-hover:-translate-y-1.5">
                  <div>
                    {c.badge && (
                      <span className="mb-2 inline-block rounded-full bg-warm-linen/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">
                        {c.badge}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl font-medium text-white sm:text-[1.7rem]">{c.name}</h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90 text-ink transition-colors group-hover:bg-electric group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Kitchen (or water heaters) + "not sure?" */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href={extra.href}
            className="group flex items-center justify-between gap-4 rounded-[26px] bg-warm-linen p-6 ring-1 ring-[#e2dbd0] transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(14,31,68,0.35)] sm:p-8"
          >
            <span className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-warm-sand text-ink">
                <extra.icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-serif text-2xl font-medium">{extra.title}</span>
                <span className="text-sm text-[#6b6458]">{extra.sub}</span>
              </span>
            </span>
            <ArrowUpRight className="h-6 w-6 shrink-0 text-[#8a8275] transition-transform group-hover:rotate-45 group-hover:text-electric" />
          </Link>
          <a
            href={whatsappLink('Hi! I need help choosing the right appliance for my home.')}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-[26px] bg-ink p-6 text-white sm:p-8"
          >
            <span>
              <span className="block font-serif text-2xl font-medium">Not sure what fits your room?</span>
              <span className="text-sm text-white/65">Tell us the room size — we'll suggest the right model.</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold">
              <WhatsAppIcon className="h-4 w-4" /> Ask us
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
