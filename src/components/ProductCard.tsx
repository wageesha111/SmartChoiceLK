'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Eye, Plus, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingActions';
import type { Product } from '@/types';

const CAT_LABEL: Record<string, string> = {
  'air-conditioners': 'Air Conditioner',
  refrigerators: 'Refrigerator',
  'washing-machines': 'Washing Machine',
  televisions: 'Television',
  kitchen: 'Kitchen',
  'small-appliances': 'Home Comfort',
};

export default function ProductCard({ product, tone = 'default' }: { product: Product; tone?: 'default' | 'stone' }) {
  const { addToCart, wishlist, toggleWishlist, openQuickView, formatLKR } = useStore();
  const wished = wishlist.includes(product.id);
  const stone = tone === 'stone';
  const benefit = product.badge ?? product.features?.[0];

  return (
    <article className={`group relative flex h-full flex-col rounded-[26px] p-2.5 ring-1 transition-[box-shadow,--tw-ring-color] duration-500 hover:shadow-[0_30px_60px_-30px_rgba(14,31,68,0.35)] hover:ring-electric/30 ${stone ? 'bg-warm-linen ring-[#e2dbd0]' : 'bg-white ring-slate-200/70'}`}>
      {/* Media */}
      <div className={`relative aspect-[4/3.4] overflow-hidden ${stone ? 'rounded-[22px] bg-warm-sand' : 'rounded-[20px] bg-gradient-to-br from-slate-100 to-slate-200'}`}>
        <Link href={`/products/${product.id}`} className="absolute inset-0">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 drop-shadow-[0_18px_22px_rgba(14,31,68,0.18)] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.discount ? (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">-{product.discount}%</span>
          ) : null}
          {product.inverter && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-electric backdrop-blur">
              Inverter
            </span>
          )}
        </div>

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all ${
            wished ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600 hover:text-rose-500'
          }`}
        >
          <Heart className="h-4 w-4" fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => openQuickView(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/95 py-2.5 text-xs font-bold text-ink shadow-sm backdrop-blur hover:bg-white"
          >
            <Eye className="h-3.5 w-3.5" /> Quick view
          </button>
          <a
            href={whatsappLink(`Hello Smart Choice LK! Is the ${product.name} (${formatLKR(product.price)}) available?`)}
            target="_blank"
            rel="noreferrer"
            aria-label="Ask on WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white shadow-sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>
            {product.brand} · {CAT_LABEL[product.category] ?? product.category}
          </span>
          {product.reviews > 0 && (
            <span className="flex items-center gap-1 normal-case tracking-normal text-slate-500">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-snug tracking-normal text-ink">
          <Link href={`/products/${product.id}`} className="hover:text-electric">
            {product.name}
          </Link>
        </h3>
        {stone && benefit && (
          <span className="mt-2 line-clamp-1 self-start rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold !text-[#F4F0EA]">{benefit}</span>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-slate-400 line-through">{formatLKR(product.originalPrice)}</p>
            )}
            <p className="font-display text-lg font-bold text-ink">{formatLKR(product.price)}</p>
          </div>
          <button
            onClick={() => addToCart(product.id, 1)}
            aria-label="Add to cart"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors duration-200 hover:bg-electric active:bg-electric-600 [&>svg]:transition-transform [&>svg]:duration-300 hover:[&>svg]:rotate-90"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
