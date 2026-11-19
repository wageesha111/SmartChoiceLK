'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
  Check,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import ProductGallery from '@/components/product/ProductGallery';
import SeeInside from '@/components/product/SeeInside';
import ProductCard from '@/components/ProductCard';
import Reveal, { SectionHeading } from '@/components/Reveal';
import { Magnetic } from '@/components/fx';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { useStore } from '@/context/StoreContext';
import { ALL_PRODUCTS, CATEGORIES } from '@/data/products';
import { SITE, whatsappLink } from '@/lib/site';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specifications' },
  { id: 'delivery', label: 'Delivery & installation' },
] as const;
type Tab = (typeof TABS)[number]['id'];

export default function ProductDetailPage() {
  const params = useParams();
  const product = ALL_PRODUCTS.find((p) => p.id === Number(params.id)) || ALL_PRODUCTS[0];
  const { addToCart, wishlist, toggleWishlist, formatLKR } = useStore();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('overview');

  const wished = wishlist.includes(product.id);
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const related = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);
  const save = product.originalPrice ? product.originalPrice - product.price : 0;

  const orderMsg = `Hello ${SITE.name}! I'd like to order: ${product.name}${product.sku ? ` (SKU ${product.sku})` : ''} x${qty} — ${formatLKR(
    product.price * qty
  )}. Can you confirm stock and delivery to my area?`;

  return (
    <div className="bg-white font-sans text-ink antialiased">
      <SiteNavbar />

      <main className="mx-auto max-w-[1280px] px-5 pb-20 pt-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-ink">
            Shop
          </Link>
          {cat && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/products?category=${cat.id}`} className="hover:text-ink">
                {cat.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-ink" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Gallery: product video first (if any), then photos */}
          <div className="min-w-0 lg:sticky lg:top-[100px] lg:self-start">
            <ProductGallery product={product} />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">
              {product.brand} · {cat?.name ?? product.category}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-[2.6rem]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {product.rating}
              </span>
              {product.inStock !== false && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> In stock
                </span>
              )}
              {product.capacity && <span className="text-slate-500">{product.capacity}</span>}
            </div>

            <div className="mt-7 rounded-[26px] bg-mist p-6">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                <p className="font-display text-4xl font-bold">{formatLKR(product.price)}</p>
                {product.originalPrice && (
                  <p className="pb-1 text-slate-400 line-through">{formatLKR(product.originalPrice)}</p>
                )}
                {save > 0 && (
                  <span className="mb-1 rounded-full bg-electric px-2.5 py-1 text-xs font-bold text-white">
                    Save {formatLKR(save)}
                  </span>
                )}
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <CreditCard className="h-4 w-4" /> Card installment plans available — ask us for the options.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full bg-white ring-1 ring-slate-200">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-12 w-12 place-items-center rounded-full hover:bg-mist"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-display font-bold tabular-nums" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-12 w-12 place-items-center rounded-full hover:bg-mist"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Magnetic strength={0.2}>
                  <button
                    onClick={() => addToCart(product.id, qty)}
                    className="sc-shimmer flex h-12 items-center gap-2 rounded-full bg-ink px-7 font-bold text-white transition-colors hover:bg-electric"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to cart
                  </button>
                </Magnetic>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wished}
                  className={`grid h-12 w-12 place-items-center rounded-full ring-1 transition-colors ${
                    wished ? 'bg-rose-500 text-white ring-rose-500' : 'bg-white ring-slate-200 hover:text-rose-500'
                  }`}
                >
                  <Heart className="h-5 w-5" fill={wished ? 'currentColor' : 'none'} />
                </button>
              </div>
              <a
                href={whatsappLink(orderMsg)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon /> Order on WhatsApp
              </a>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, t: 'Islandwide delivery' },
                { icon: Wrench, t: 'Expert installation' },
                { icon: ShieldCheck, t: product.warranty ? 'Brand warranty' : 'Genuine product' },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl p-3 ring-1 ring-slate-200">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-electric-50 text-electric">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{t}</span>
                </li>
              ))}
            </ul>

            {/* Tabs */}
            <div className="mt-10">
              <div role="tablist" className="flex gap-1 overflow-x-auto rounded-full bg-mist p-1.5 sc-no-scrollbar">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                      tab === t.id ? 'text-white' : 'text-slate-500 hover:text-ink'
                    }`}
                  >
                    {tab === t.id && (
                      <motion.span layoutId="pdp-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                    )}
                    <span className="relative">{t.label}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="pt-6"
                >
                  {tab === 'overview' && (
                    <div>
                      {product.description && <p className="leading-relaxed text-slate-600">{product.description}</p>}
                      {product.features && (
                        <ul className="mt-5 space-y-2.5">
                          {product.features.map((f) => (
                            <li key={f} className="flex gap-3 text-sm text-slate-700">
                              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-electric-50 text-electric">
                                <Check className="h-3 w-3" />
                              </span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {tab === 'specs' && (
                    <dl className="divide-y divide-slate-100 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                      {Object.entries(product.specs ?? {}).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[1fr_1.4fr] gap-4 px-5 py-3.5 text-sm odd:bg-mist/60">
                          <dt className="font-semibold text-slate-500">{k}</dt>
                          <dd className="text-ink">{v}</dd>
                        </div>
                      ))}
                      {product.warranty && (
                        <div className="grid grid-cols-[1fr_1.4fr] gap-4 px-5 py-3.5 text-sm">
                          <dt className="font-semibold text-slate-500">Warranty</dt>
                          <dd>{product.warranty}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {tab === 'delivery' && (
                    <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                      {product.deliveryInfo && <p>{product.deliveryInfo}</p>}
                      <p>
                        We deliver across all 25 districts. For ACs and large appliances our team can install and demo
                        the unit at your home. Message us on WhatsApp with your town for a delivery date and any
                        installation charges.
                      </p>
                      <p>
                        Prefer to see it first? Visit the shop at {SITE.address} — {SITE.hours.toLowerCase()}.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </main>

      {/* Exploded view tied to scroll (only when the product has a video) */}
      <SeeInside product={product} />

      <div className="mx-auto max-w-[1280px] px-5 pb-20">
        {related.length > 0 && (
          <section className="mt-24">
            <SectionHeading eyebrow="You may also like" title="Similar products" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <TrustRibbon />
      <SiteFooter />
    </div>
  );
}
