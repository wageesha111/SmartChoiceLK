'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Wrench } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import PageHeader from '@/components/PageHeader';
import { BorderBeam, Magnetic } from '@/components/fx';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { useStore } from '@/context/StoreContext';
import { SITE, whatsappLink } from '@/lib/site';

export default function CartPage() {
  const { cart, cartCount, subtotal, changeQty, removeFromCart, clearCart, formatLKR } = useStore();

  const orderMsg = `Hello ${SITE.name}! I'd like to order:\n\n${cart
    .map((it, i) => `${i + 1}. ${it.name} x${it.qty} — ${formatLKR(it.price * it.qty)}`)
    .join('\n')}\n\nSubtotal: ${formatLKR(subtotal)}\n\nPlease confirm stock and the delivery date to my area.`;

  return (
    <div className="bg-mist font-sans text-ink antialiased">
      <SiteNavbar />
      <PageHeader
        eyebrow="Your cart"
        title={cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
        sub={cartCount ? 'Review your items, then send the order to us on WhatsApp — we’ll confirm stock, delivery date and payment.' : undefined}
        crumbs={[{ label: 'Cart' }]}
      />

      <main className="mx-auto max-w-[1280px] px-5 py-14">
        {cart.length === 0 ? (
          <div className="grid place-items-center rounded-[28px] bg-white px-6 py-20 text-center ring-1 ring-slate-200">
            <motion.span
              initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="grid h-20 w-20 place-items-center rounded-3xl bg-ink text-white"
            >
              <ShoppingBag className="h-8 w-8" />
            </motion.span>
            <h2 className="mt-6 font-display text-2xl font-bold">Nothing here yet</h2>
            <p className="mt-2 max-w-sm text-slate-500">Browse ACs, fridges, washing machines and TVs — add what you like and order in one message.</p>
            <Link href="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-electric px-7 py-4 font-bold text-white hover:bg-electric-600">
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <section aria-label="Cart items">
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {cart.map((it) => (
                    <motion.li
                      key={it.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 rounded-[24px] bg-white p-3 ring-1 ring-slate-200/80 sm:gap-6 sm:p-4"
                    >
                      <Link href={`/products/${it.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-mist sm:h-32 sm:w-32">
                        <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{it.brand}</p>
                        <Link href={`/products/${it.id}`} className="line-clamp-2 font-semibold leading-snug hover:text-electric">
                          {it.name}
                        </Link>
                        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                          <div className="flex items-center rounded-full ring-1 ring-slate-200">
                            <button onClick={() => changeQty(it.id, -1)} aria-label={`Decrease ${it.name}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center font-display font-bold tabular-nums">{it.qty}</span>
                            <button onClick={() => changeQty(it.id, 1)} aria-label={`Increase ${it.name}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-display text-lg font-bold">{formatLKR(it.price * it.qty)}</p>
                            <button onClick={() => removeFromCart(it.id)} aria-label={`Remove ${it.name}`} className="grid h-10 w-10 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="mt-5 flex items-center justify-between">
                <Link href="/products" className="text-sm font-semibold text-electric hover:underline">
                  ← Continue shopping
                </Link>
                <button onClick={clearCart} className="text-sm font-semibold text-slate-400 hover:text-rose-600">
                  Clear cart
                </button>
              </div>
            </section>

            <aside className="lg:sticky lg:top-[100px] lg:self-start">
              <div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white">
                <BorderBeam duration={9} />
                <div className="sc-grid-bg pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative">
                  <h2 className="font-display text-xl font-bold">Order summary</h2>
                  <dl className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between text-white/70">
                      <dt>Items ({cartCount})</dt>
                      <dd>{formatLKR(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <dt>Delivery & installation</dt>
                      <dd>Confirmed on WhatsApp</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                    <span className="text-white/70">Subtotal</span>
                    <span className="font-display text-3xl font-bold">{formatLKR(subtotal)}</span>
                  </div>
                  <Magnetic strength={0.15}>
                    <a
                      href={whatsappLink(orderMsg)}
                      target="_blank"
                      rel="noreferrer"
                      className="sc-shimmer mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-bold"
                    >
                      <WhatsAppIcon /> Send order on WhatsApp
                    </a>
                  </Magnetic>
                  <p className="mt-3 text-center text-xs text-white/45">No payment now — we’ll confirm everything with you first.</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  { icon: Truck, t: 'Delivery anywhere in Sri Lanka' },
                  { icon: Wrench, t: 'Installation available' },
                  { icon: ShieldCheck, t: 'Genuine products, brand warranty' },
                ].map(({ icon: Icon, t }) => (
                  <li key={t} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200/80">
                    <Icon className="h-4 w-4 text-electric" /> {t}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
