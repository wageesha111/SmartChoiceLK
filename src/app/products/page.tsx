'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Zap,
  Snowflake,
  Refrigerator,
  WashingMachine,
  Tv,
  CookingPot,
  Droplets,
  LayoutGrid,
  RotateCcw,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import PageHeader from '@/components/PageHeader';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { CATEGORIES } from '@/data/products';
import { whatsappLink } from '@/lib/site';

const CAT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'air-conditioners': Snowflake,
  refrigerators: Refrigerator,
  'washing-machines': WashingMachine,
  televisions: Tv,
  kitchen: CookingPot,
  'small-appliances': Droplets,
};

const MAX_PRICE = 600000;
const SORTS = [
  { v: 'featured', l: 'Featured' },
  { v: 'price-asc', l: 'Price: low to high' },
  { v: 'price-desc', l: 'Price: high to low' },
  { v: 'rating', l: 'Top rated' },
  { v: 'discount', l: 'Biggest discount' },
];

function Filters({
  brand,
  setBrand,
  inverterOnly,
  setInverterOnly,
  maxPrice,
  setMaxPrice,
  reset,
}: {
  brand: string;
  setBrand: (b: string) => void;
  inverterOnly: boolean;
  setInverterOnly: (v: boolean) => void;
  maxPrice: number;
  setMaxPrice: (n: number) => void;
  reset: () => void;
}) {
  const { formatLKR, products } = useStore();
  const BRANDS = ['All Brands', ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean) as string[]))];
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Filters</h2>
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:underline">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric-50 text-electric">
            <Zap className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink">Inverter only</span>
            <span className="block text-xs text-slate-500">Lower electricity use</span>
          </span>
        </span>
        <input
          type="checkbox"
          checked={inverterOnly}
          onChange={(e) => setInverterOnly(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-electric peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-electric peer-focus-visible:ring-offset-2"
        />
      </label>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Brand</h3>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((b) => {
            const val = b === 'All Brands' ? 'All' : b;
            const active = brand === val;
            return (
              <button
                key={b}
                onClick={() => setBrand(val)}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? 'bg-ink text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-ink'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Max price</h3>
          <span className="font-display text-sm font-bold text-ink">{formatLKR(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={50000}
          max={MAX_PRICE}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full cursor-pointer accent-electric"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          <span>{formatLKR(50000)}</span>
          <span>{formatLKR(MAX_PRICE)}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-ink p-5 text-white">
        <p className="font-display font-semibold">Not sure which one?</p>
        <p className="mt-1 text-sm text-white/60">Tell us your room size and budget — we’ll recommend the right model.</p>
        <a
          href={whatsappLink('Hi Smart Choice LK! Can you help me pick the right appliance?')}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}

function Catalog() {
  const { products: ALL_PRODUCTS } = useStore();
  const params = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(params.get('category') || 'all');
  const [query, setQuery] = useState(params.get('query') || '');
  const [brand, setBrand] = useState('All');
  const [inverterOnly, setInverterOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sortBy, setSortBy] = useState('featured');
  const [drawer, setDrawer] = useState(false);

  // Keep in sync when the navbar changes ?category= / ?query= without remounting
  useEffect(() => {
    setCategory(params.get('category') || 'all');
    setQuery(params.get('query') || '');
  }, [params]);

  const pickCategory = (id: string) => {
    setCategory(id);
    const sp = new URLSearchParams();
    if (id !== 'all') sp.set('category', id);
    if (query) sp.set('query', query);
    router.replace(`/products${sp.toString() ? `?${sp}` : ''}`, { scroll: false });
  };

  const reset = () => {
    setBrand('All');
    setInverterOnly(false);
    setMaxPrice(MAX_PRICE);
    setQuery('');
    pickCategory('all');
  };

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ALL_PRODUCTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (brand !== 'All' && p.brand !== brand) return false;
      if (inverterOnly && !p.inverter) return false;
      if (p.price > maxPrice) return false;
      if (q && !`${p.name} ${p.brand ?? ''} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'discount') list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return list;
  }, [category, brand, inverterOnly, maxPrice, query, sortBy]);

  const catName = CATEGORIES.find((c) => c.id === category)?.name;
  const activeFilters = (brand !== 'All' ? 1 : 0) + (inverterOnly ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  const filterProps = { brand, setBrand, inverterOnly, setInverterOnly, maxPrice, setMaxPrice, reset };

  return (
    <div className="bg-mist font-sans text-ink antialiased">
      <SiteNavbar />

      <PageHeader
        eyebrow="Shop"
        title={catName ?? 'All appliances'}
        sub="Genuine brands, fair prices, delivered and installed anywhere in Sri Lanka."
        crumbs={catName ? [{ label: 'Shop', href: '/products' }, { label: catName }] : [{ label: 'Shop' }]}
      >
        {/* Search */}
        <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 backdrop-blur-md focus-within:border-electric/60">
          <Search className="h-5 w-5 shrink-0 text-white/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or brand…"
            aria-label="Search products"
            className="h-14 flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search" className="text-white/50 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PageHeader>

      {/* Category rail */}
      <div className="sticky top-[76px] z-30 border-b border-slate-200/80 bg-mist/85 backdrop-blur-xl">
        <div className="sc-no-scrollbar mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-5 py-3">
          {[{ id: 'all', name: 'All' }, ...CATEGORIES].map((c) => {
            const Icon = CAT_ICON[c.id] ?? LayoutGrid;
            const active = category === c.id;
            const count = c.id === 'all' ? ALL_PRODUCTS.length : ALL_PRODUCTS.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => pickCategory(c.id)}
                aria-pressed={active}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{c.name.split(' & ')[0]}</span>
                <span className={`relative text-xs ${active ? 'text-white/50' : 'text-slate-400'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto grid max-w-[1280px] gap-8 px-5 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[150px]">
            <Filters {...filterProps} />
          </div>
        </aside>

        <section aria-live="polite">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              <span className="font-display text-base font-bold text-ink">{products.length}</span> products
              {query && (
                <>
                  {' '}
                  for “<span className="font-semibold text-ink">{query}</span>”
                </>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawer(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-slate-200 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilters > 0 && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-electric text-[11px] text-white">
                    {activeFilters}
                  </span>
                )}
              </button>
              <label className="sr-only" htmlFor="sort">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>
                    {s.l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="grid place-items-center rounded-[28px] bg-white px-6 py-20 text-center ring-1 ring-slate-200">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mist text-slate-400">
                <Search className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">No products match</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try another category, raise the price limit or reset the filters. Or ask us — we can often order it in.
              </p>
              <div className="mt-6 flex gap-2">
                <button onClick={reset} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
                  Reset filters
                </button>
                <a
                  href={whatsappLink(`Hi! Do you have ${query || 'this appliance'}?`)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {products.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-[1250] bg-ink/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-mist p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-300" />
              <Filters {...filterProps} />
              <button
                onClick={() => setDrawer(false)}
                className="mt-6 w-full rounded-full bg-ink py-4 font-bold text-white"
              >
                Show {products.length} products
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TrustRibbon />
      <SiteFooter />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <Catalog />
    </Suspense>
  );
}
