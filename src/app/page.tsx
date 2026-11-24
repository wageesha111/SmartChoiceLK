'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Check,
  MapPin,
  Star,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter, { FacebookIcon } from '@/components/SiteFooter';
import RoomHero from '@/components/home/RoomHero';
import ShopByRoom from '@/components/home/ShopByRoom';
import SkipIntroButton from '@/components/home/SkipIntroButton';
import HomeFeaturesSection from '@/components/HomeFeaturesSection';
import EnergyCalculator from '@/components/EnergyCalculator';
import ProductCard from '@/components/ProductCard';
import Reveal, { SectionHeading } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { BorderBeam, Spotlight, ScrubText } from '@/components/fx';

import MirrorHallIntro from '@/components/three/MirrorHallIntro';
import { useStore } from '@/context/StoreContext';
import { SMARTCHOICE_BLOGS } from '@/data/smartchoice-data';
import { SITE, whatsappLink } from '@/lib/site';

const TABS = [
  { id: 'inverters', label: 'Inverter range' },
  { id: 'new', label: 'New arrivals' },
  { id: 'deals', label: 'Best deals' },
] as const;
type TabId = (typeof TABS)[number]['id'];


export default function SmartChoiceHomePage() {
  const { addToCart, formatLKR, showToast, products: ALL_PRODUCTS } = useStore();
  const [tab, setTab] = useState<TabId>('inverters');

  const products = useMemo(() => {
    if (tab === 'new') return [...ALL_PRODUCTS].sort((a, b) => b.id - a.id).slice(0, 8);
    if (tab === 'deals') return ALL_PRODUCTS.filter((p) => (p.discount ?? 0) > 0).slice(0, 8);
    return ALL_PRODUCTS.filter((p) => p.inverter).slice(0, 8);
  }, [ALL_PRODUCTS, tab]);

  // Two real deals for the offers band: biggest discount first, in stock only.
  const deals = useMemo(
    () =>
      [...ALL_PRODUCTS]
        .filter((p) => (p.discount ?? 0) > 0 && p.inStock !== false)
        .sort((a, b) => (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0) || (b.discount ?? 0) - (a.discount ?? 0))
        .slice(0, 2),
    [ALL_PRODUCTS]
  );

  return (
    <div className="bg-white font-sans text-ink antialiased">
      <SiteNavbar />

      {/* ───────────────── INTRO: Mirror Hall card ring ───────────────── */}
      <MirrorHallIntro />
      <SkipIntroButton />

      {/* ───────────────── HERO: scroll through the rooms ───────────────── */}
      <RoomHero />

      {/* ───────────────── SHOP BY ROOM (BENTO) ───────────────── */}
      <ShopByRoom />

      {/* ───────────────── FEATURED PRODUCTS ───────────────── */}
      <section id="products-section" className="bg-warm-sand py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading
            eyebrow="Featured"
            title="Popular right now"
            serif
            action={
              <div className="sc-no-scrollbar flex gap-1 self-start overflow-x-auto rounded-full bg-warm-linen p-1.5 ring-1 ring-[#e2dbd0] md:self-auto">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                      tab === t.id ? 'text-white' : 'text-slate-500 hover:text-ink'
                    }`}
                  >
                    {tab === t.id && (
                      <motion.span
                        layoutId="tab-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{t.label}</span>
                  </button>
                ))}
              </div>
            }
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} tone="stone" />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-ink py-4 pl-7 pr-5 text-sm font-bold text-white transition-colors hover:bg-electric"
            >
              Browse the full catalogue
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────── ENERGY BAND ───────────────── */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="sc-grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-electric/25 blur-[140px]" />
        <Spotlight />

        <div className="relative mx-auto max-w-[1280px] px-5">
          <ScrubText
            text="Inverter technology, honest advice and proper installation — so your home runs cooler, quieter and cheaper."
            className="mb-20 max-w-5xl font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
          />
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-electric-300">
                <Zap className="h-3.5 w-3.5" /> Inverter savings
              </p>
              <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Lower bills.
                <br />
                <span className="text-white/40">Same comfort.</span>
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-white/60">
                Inverter ACs and refrigerators adjust their speed instead of switching on and off — so they use far
                less electricity. Try the calculator to see what you could save on your CEB bill.
              </p>
              <ul className="mt-8 space-y-3">
                {['Quieter, steadier cooling', 'Lower monthly electricity usage', 'Longer compressor life'].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white/80">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-electric/20 text-electric-300">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/products?category=air-conditioners"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-ink transition-colors hover:bg-electric hover:text-white"
              >
                Shop inverter ACs <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div id="calculator-section" className="[&>*]:!m-0">
                <EnergyCalculator />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────── OFFERS ───────────────── */}
      <section id="featured-offers" className="bg-warm-stone py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading
            eyebrow="Current offers"
            serif
            title={
              <>
                Today’s best <span className="text-electric">deals</span>
              </>
            }
            action={
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-electric md:self-auto"
              >
                See all products <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 [&>*]:min-w-0">
            {deals.map((offer, i) => {
              const save = offer.originalPrice ? offer.originalPrice - offer.price : 0;
              return (
                <Reveal key={offer.id} delay={i * 0.08}>
                  <div className="group relative grid h-full overflow-hidden rounded-[28px] bg-ink text-white ring-1 ring-white/10 sm:grid-cols-[0.85fr_1.15fr]">
                    <BorderBeam duration={8 + i * 2} />
                    <Link href={`/products/${offer.id}`} className="relative grid min-h-[240px] place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_60%,rgba(47,107,255,0.35),transparent_70%)] p-6">
                      <img
                        src={offer.image}
                        alt={offer.name}
                        loading="lazy"
                        className="max-h-[220px] w-full object-contain drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-electric px-3 py-1.5 text-xs font-bold text-white">
                        {save > 0 ? `Save ${formatLKR(save)}` : `${offer.discount}% off`}
                      </span>
                    </Link>
                    <div className="flex min-w-0 flex-col p-6 sm:p-7">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-electric-300">{offer.brand}</p>
                      <Link href={`/products/${offer.id}`} className="mt-2 font-serif text-2xl font-medium leading-snug hover:text-electric-300">
                        {offer.name}
                      </Link>
                      <ul className="mt-4 space-y-2">
                        {(offer.features ?? []).slice(0, 3).map((f) => (
                          <li key={f} className="flex gap-2 text-sm text-white/70">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric-300" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                        <div>
                          {offer.originalPrice ? <p className="text-xs text-white/40 line-through">{formatLKR(offer.originalPrice)}</p> : null}
                          <p className="whitespace-nowrap font-display text-2xl font-bold">{formatLKR(offer.price)}</p>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(offer.id, 1);
                            showToast(`Added ${offer.name} to cart!`, '🎉');
                          }}
                          className="whitespace-nowrap rounded-full bg-electric px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-electric-600"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <HomeFeaturesSection />

      {/* ───────────────── COMMUNITY / VISIT ───────────────── */}
      <section className="bg-warm-stone pb-24">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 px-5 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1877F2] to-electric-700 p-8 text-white sm:p-12">
              <FacebookIcon className="absolute -bottom-10 -right-10 h-64 w-64 text-white/10" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Our community</p>
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <p className="font-display text-6xl font-extrabold leading-none sm:text-8xl">{SITE.facebookRecommend}</p>
                <div className="pb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-white/80">of reviewers recommend us</p>
                </div>
              </div>
              <p className="mt-6 max-w-md text-white/80">
                Join {SITE.facebookFollowers} people who follow Smart Choice LK for new arrivals, price drops and special
                offers.
              </p>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#1877F2] transition-transform hover:-translate-y-0.5"
              >
                <FacebookIcon className="h-4 w-4" /> Follow & read reviews
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-warm-linen p-8 text-ink ring-1 ring-[#e2dbd0] sm:p-12">
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric text-white">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-8 font-serif text-3xl font-medium">Visit our shop</h3>
                <p className="mt-2 text-[#6b6458]">
                  {SITE.address}
                  <br />
                  {SITE.hours} · {SITE.phoneDisplay}
                </p>
              </div>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-electric"
                >
                  Get directions <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold"
                >
                  Call now
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── GUIDES ───────────────── */}
      <section id="blog-section" className="bg-warm-sand py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading eyebrow="Buying guides" title="Tips before you buy" serif />
          <div className="grid gap-5 md:grid-cols-3">
            {SMARTCHOICE_BLOGS.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.07}>
                <article className="group h-full overflow-hidden rounded-[26px] bg-warm-linen ring-1 ring-[#e2dbd0] transition-shadow hover:shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-electric" /> Guide {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 font-serif text-xl font-medium leading-snug group-hover:text-electric">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6b6458]">{post.excerpt}</p>
                    <Link
                      href={post.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-electric"
                    >
                      {post.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
