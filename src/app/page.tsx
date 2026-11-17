'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Snowflake,
  Refrigerator,
  WashingMachine,
  Tv,
  CookingPot,
  Zap,
  ShieldCheck,
  Timer,
  Check,
  MapPin,
  Star,
  Sparkles,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter, { FacebookIcon } from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import HomeFeaturesSection from '@/components/HomeFeaturesSection';
import EnergyCalculator from '@/components/EnergyCalculator';
import ProductCard from '@/components/ProductCard';
import Reveal, { SectionHeading } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/FloatingActions';
import dynamic from 'next/dynamic';
import { Magnetic, NumberTicker, BorderBeam, Spotlight, TiltCard, Parallax, ScrubText } from '@/components/fx';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });
import { useStore } from '@/context/StoreContext';
import { ALL_PRODUCTS } from '@/data/products';
import { SMARTCHOICE_OFFERS, SMARTCHOICE_BRANDS, SMARTCHOICE_BLOGS } from '@/data/smartchoice-data';
import { SITE, whatsappLink } from '@/lib/site';

const HERO_SLIDES = [
  {
    kicker: 'Inverter Air Conditioners',
    image: '/antigravity/hero-ac-2.png',
    alt: 'Inverter split air conditioner',
    chip: 'Save up to 60% power',
    href: '/products?category=air-conditioners',
  },
  {
    kicker: 'Smart Washing Machines',
    image: '/antigravity/hero-washing-machine.png',
    alt: 'Front load inverter washing machine',
    chip: 'Quiet inverter motor',
    href: '/products?category=washing-machines',
  },
];

const HERO_CATS = [
  { name: 'ACs', icon: Snowflake, href: '/products?category=air-conditioners' },
  { name: 'Fridges', icon: Refrigerator, href: '/products?category=refrigerators' },
  { name: 'Washers', icon: WashingMachine, href: '/products?category=washing-machines' },
  { name: 'TVs', icon: Tv, href: '/products?category=televisions' },
  { name: 'Kitchen', icon: CookingPot, href: '/products?category=kitchen' },
];

const TABS = [
  { id: 'inverters', label: 'Inverter range' },
  { id: 'new', label: 'New arrivals' },
  { id: 'deals', label: 'Best deals' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function useCountdown(hours = 48) {
  const [left, setLeft] = useState(hours * 3600 - 102);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : hours * 3600)), 1000);
    return () => clearInterval(t);
  }, [hours]);
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0'));
}

export default function SmartChoiceHomePage() {
  const { addToCart, formatLKR, showToast } = useStore();
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState<TabId>('inverters');
  const [hh, mm, ss] = useCountdown();

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const products = useMemo(() => {
    if (tab === 'new') return ALL_PRODUCTS.filter((p) => p.badge?.includes('New') || p.id % 2 === 0).slice(0, 8);
    if (tab === 'deals') return ALL_PRODUCTS.filter((p) => (p.discount ?? 0) > 0).slice(0, 8);
    return ALL_PRODUCTS.filter((p) => p.inverter).slice(0, 8);
  }, [tab]);

  const current = HERO_SLIDES[slide];

  return (
    <div className="bg-white font-sans text-ink antialiased">
      <SiteNavbar />

      {/* ───────────────── HERO ───────────────── */}
      <section className="sc-noise relative -mt-[76px] overflow-hidden bg-ink pb-10 pt-[76px] text-white">
        {/* Ambient light */}
        <div className="pointer-events-none absolute inset-0">
          <div className="sc-grid-bg absolute inset-0" />
          <div className="absolute -left-40 top-20 h-[34rem] w-[34rem] rounded-full bg-electric/30 blur-[140px]" />
          <div className="absolute right-[-10rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-glow/20 blur-[130px]" />
          <div className="absolute bottom-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-electric/60 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-5 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pt-16">
          {/* Copy */}
          <div className="relative z-10 min-w-0">
            <motion.a
              href={SITE.facebook}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-[13px] text-white/75 backdrop-blur-md transition-colors hover:border-white/25"
            >
              <span className="flex items-center gap-1 rounded-full bg-electric px-2.5 py-1 text-[11px] font-bold text-white">
                <Star className="h-3 w-3 fill-white" /> {SITE.facebookRecommend}
              </span>
              Recommended by customers on Facebook
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-7xl xl:text-[5.4rem]"
            >
              Choose smart.
              <br />
              <span className="sc-text-gradient">Live better.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            >
              Inverter ACs, refrigerators, washing machines and smart TVs from the brands you trust —
              with honest advice, islandwide delivery and installation from our shop in Seeduwa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Link
                  href="/products"
                  className="sc-shimmer group inline-flex items-center gap-2 rounded-full bg-electric py-4 pl-7 pr-5 font-bold text-white shadow-[0_18px_40px_-12px_rgba(47,107,255,0.8)] transition-colors hover:bg-electric-600"
                >
                  Shop all products
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Magnetic>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-4 font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                Get a price on WhatsApp
              </a>
            </motion.div>

            {/* Category chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="sc-no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0"
            >
              {HERO_CATS.map(({ name, icon: Icon, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 transition-all hover:-translate-y-0.5 hover:border-electric/60 hover:bg-electric/15 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-electric-300" />
                  {name}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Product stage */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            {/* Static glow (also the fallback when WebGL / motion is unavailable) */}
            <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(47,107,255,0.55),rgba(47,107,255,0.08)_55%,transparent_70%)]" />
            {/* Real-time 3D: chrome orbit rings, floating shapes, particle field */}
            <HeroScene className="pointer-events-none absolute -inset-[18%]" />
            {/* Floor glow */}
            <div className="absolute bottom-[12%] left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-electric/50 blur-2xl" />

            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.alt}
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.96 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[10%] m-auto h-[80%] w-[80%] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]"
              />
            </AnimatePresence>

            {/* Floating glass chips */}
            <div className="absolute left-0 top-[16%] z-10 animate-floaty rounded-2xl border border-white/10 bg-ink/75 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-[-4%]">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Featured</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.kicker}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="font-display text-sm font-semibold"
                >
                  {current.kicker}
                </motion.p>
              </AnimatePresence>
            </div>
            <div
              className="absolute bottom-[18%] right-0 flex z-10 animate-floaty items-center gap-3 rounded-2xl border border-white/10 bg-ink/75 px-4 py-3 shadow-xl backdrop-blur-xl sm:right-[-2%]"
              style={{ animationDelay: '-3s' }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric">
                <Zap className="h-4 w-4" />
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.chip}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-semibold"
                >
                  {current.chip}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Slide controls */}
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.image}
                  onClick={() => setSlide(i)}
                  aria-label={`Show ${s.kicker}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === slide ? 'w-10 bg-white' : 'w-4 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hero stats */}
        <div className="relative mt-14 grid max-w-[1280px] grid-cols-3 gap-px overflow-hidden mx-5 rounded-3xl border border-white/[0.08] bg-white/[0.08] px-0 xl:mx-auto">
          {[
            { n: 990, suf: '+', v: 'Facebook followers' },
            { n: 25, suf: '', v: 'Districts we deliver to' },
            { n: 7, suf: ' days', v: 'Open every day' },
          ].map((s) => (
            <div key={s.v} className="bg-ink/90 px-4 py-5 text-center sm:px-8 sm:py-7 sm:text-left">
              <p className="font-display text-2xl font-bold sm:text-4xl">
                <NumberTicker value={s.n} suffix={s.suf} />
              </p>
              <p className="mt-1 text-[11px] text-white/50 sm:text-sm">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Brand marquee */}
        <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee-fast items-center gap-16">
            {[...SMARTCHOICE_BRANDS, ...SMARTCHOICE_BRANDS].map((b, i) => (
              <Link
                key={i}
                href={`/products?query=${encodeURIComponent(b.name)}`}
                className="font-display text-2xl font-extrabold tracking-[0.12em] text-white/25 transition-colors hover:text-white sm:text-3xl"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustRibbon />

      {/* ───────────────── CATEGORIES (BENTO) ───────────────── */}
      <section id="categories-section" className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading
            eyebrow="Shop by category"
            title={
              <>
                Everything your home
                <br />
                <span className="text-slate-400">runs on.</span>
              </>
            }
            action={
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 self-start rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white md:self-auto"
              >
                View all products
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Link>
            }
          />

          <div className="grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[280px]">
            {[
              {
                title: 'Air Conditioners',
                sub: 'Inverter split ACs · 9,000 – 24,000 BTU',
                img: '/appliances/luxury-ac.jpg',
                href: '/products?category=air-conditioners',
                cls: 'lg:col-span-7 lg:row-span-2 sm:col-span-2',
              },
              {
                title: 'Refrigerators',
                sub: 'Side-by-side, double door & more',
                img: '/appliances/luxury-fridge.jpg',
                href: '/products?category=refrigerators',
                cls: 'lg:col-span-5',
              },
              {
                title: 'Washing Machines',
                sub: 'Front & top load',
                img: '/appliances/luxury-washer.jpg',
                href: '/products?category=washing-machines',
                cls: 'lg:col-span-5',
              },
              {
                title: 'Smart TVs',
                sub: '4K QLED, OLED & sound',
                img: '/appliances/luxury-tv.jpg',
                href: '/products?category=televisions',
                cls: 'lg:col-span-7',
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07} className={c.cls}>
                <TiltCard max={5} className="h-full rounded-[28px]">
                <Link
                  href={c.href}
                  className="group relative block h-full overflow-hidden rounded-[28px] bg-slate-100"
                >
                  <Parallax speed={14} className="absolute -inset-y-[10%] inset-x-0">
                    <img
                      src={c.img}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{c.title}</h3>
                      <p className="mt-1 text-sm text-white/70">{c.sub}</p>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-electric group-hover:text-white">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
                </TiltCard>
              </Reveal>
            ))}

            {/* Kitchen + help tiles */}
            <Reveal delay={0.3} className="lg:col-span-5">
              <Link
                href="/products?category=kitchen"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-mist p-8"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-electric shadow-sm">
                  <CookingPot className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold">Kitchen & small appliances</h3>
                  <p className="mt-1 text-sm text-slate-500">Microwaves, air fryers, blenders and more</p>
                </div>
                <ArrowUpRight className="absolute right-8 top-8 h-6 w-6 text-slate-400 transition-transform group-hover:rotate-45 group-hover:text-electric" />
              </Link>
            </Reveal>
            <Reveal delay={0.36} className="sm:col-span-2 lg:col-span-12 lg:row-span-1">
              <a
                href={whatsappLink('Hi Smart Choice LK! Can you help me choose the right appliance?')}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-8 text-white sm:p-10 lg:flex-row lg:items-end"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-electric/40 blur-3xl transition-all duration-700 group-hover:bg-electric/60" />
                <Sparkles className="relative h-7 w-7 text-electric-300 lg:absolute lg:left-10 lg:top-10" />
                <div className="relative mt-8 flex w-full flex-col gap-5 lg:mt-0 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">Can’t find what you need?</h3>
                  <p className="mt-2 max-w-md text-sm text-white/60">
                    We can order most models for you. Send a message and we’ll get back with the best price.
                  </p>
                  </div>
                  <span className="inline-flex self-start lg:self-auto items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold">
                    <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
                  </span>
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────── FEATURED PRODUCTS ───────────────── */}
      <section id="products-section" className="bg-mist py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading
            eyebrow="Featured"
            title="Popular right now"
            action={
              <div className="sc-no-scrollbar flex gap-1 self-start overflow-x-auto rounded-full bg-white p-1.5 ring-1 ring-slate-200 md:self-auto">
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
                <ProductCard key={p.id} product={p} />
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
      <section id="featured-offers" className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading
            eyebrow="Limited-time offers"
            title={
              <>
                This week’s <span className="text-electric">deals</span>
              </>
            }
            action={
              <div className="flex items-center gap-3 self-start rounded-2xl bg-ink px-5 py-3 text-white md:self-auto">
                <Timer className="h-5 w-5 text-electric-300" />
                <span className="text-xs text-white/50">Ends in</span>
                <span className="font-display text-lg font-bold tabular-nums">
                  {hh}
                  <span className="text-white/30">:</span>
                  {mm}
                  <span className="text-white/30">:</span>
                  {ss}
                </span>
              </div>
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {SMARTCHOICE_OFFERS.map((offer, i) => {
              const save = offer.originalPrice - offer.price;
              return (
                <Reveal key={offer.id} delay={i * 0.08}>
                  <div className="group relative grid h-full overflow-hidden rounded-[28px] bg-mist ring-1 ring-slate-200/70 sm:grid-cols-[0.85fr_1.15fr]">
                    <BorderBeam duration={8 + i * 2} />
                    <div className="relative min-h-[240px] overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-electric px-3 py-1.5 text-xs font-bold text-white">
                        Save {formatLKR(save)}
                      </span>
                    </div>
                    <div className="flex flex-col p-7">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{offer.category}</p>
                      <h3 className="mt-2 font-display text-xl font-bold leading-snug">{offer.title}</h3>
                      <ul className="mt-4 space-y-2">
                        {offer.specs.slice(0, 3).map((s) => (
                          <li key={s} className="flex gap-2 text-sm text-slate-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                            {s}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                        <div>
                          <p className="text-xs text-slate-400 line-through">{formatLKR(offer.originalPrice)}</p>
                          <p className="whitespace-nowrap font-display text-2xl font-bold">{formatLKR(offer.price)}</p>
                        </div>
                        <button
                          onClick={() => {
                            const match =
                              ALL_PRODUCTS.find((p) => p.name.includes(offer.category) || p.id === offer.id) ||
                              ALL_PRODUCTS[0];
                            addToCart(match.id, 1);
                            showToast(`Added ${offer.title} to cart!`, '🎉');
                          }}
                          className="whitespace-nowrap rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-electric"
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
      <section className="bg-white pb-24">
        <div className="mx-auto grid max-w-[1280px] gap-4 px-5 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1877F2] to-electric-700 p-8 text-white sm:p-12">
              <FacebookIcon className="absolute -bottom-10 -right-10 h-64 w-64 text-white/10" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Our community</p>
              <div className="mt-6 flex items-end gap-4">
                <p className="font-display text-7xl font-extrabold leading-none sm:text-8xl">{SITE.facebookRecommend}</p>
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
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-ink p-8 text-white sm:p-12">
              <div className="sc-grid-bg pointer-events-none absolute inset-0" />
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-8 font-display text-3xl font-bold">Visit our shop</h3>
                <p className="mt-2 text-white/60">
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
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-electric hover:text-white"
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
      <section id="blog-section" className="bg-mist py-24">
        <div className="mx-auto max-w-[1280px] px-5">
          <SectionHeading eyebrow="Buying guides" title="Tips before you buy" />
          <div className="grid gap-5 md:grid-cols-3">
            {SMARTCHOICE_BLOGS.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.07}>
                <article className="group h-full overflow-hidden rounded-[26px] bg-white ring-1 ring-slate-200/70 transition-shadow hover:shadow-xl">
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
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug tracking-tight group-hover:text-electric">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{post.excerpt}</p>
                    <Link
                      href="/about"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-electric"
                    >
                      Read guide <ArrowRight className="h-4 w-4" />
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
