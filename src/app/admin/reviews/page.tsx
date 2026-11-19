'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Check, EyeOff, Trash2, MessageSquareQuote, ImageOff, ExternalLink } from 'lucide-react';
import { adminDeleteReview, adminListReviews, adminSetReviewApproved, type Review } from '@/lib/shopExtras';
import { adminListProducts, displayImage, type ShopProductRow } from '@/lib/shopProducts';
import { ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui';

type Filter = 'pending' | 'approved' | 'all';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'pending', label: 'Waiting for approval' },
  { id: 'approved', label: 'On the website' },
  { id: 'all', label: 'All' },
];

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= value ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
      ))}
    </span>
  );
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminReviewsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Review[] | null>(null);
  const [products, setProducts] = useState<Map<number, ShopProductRow>>(new Map());
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState<Filter>('pending');
  const [del, setDel] = useState<Review | null>(null);

  useEffect(() => {
    Promise.all([adminListReviews(), adminListProducts()])
      .then(([r, p]) => {
        setRows(r);
        setProducts(new Map(p.map((x) => [x.id, x])));
      })
      .catch((e) => setErr(e.message ?? 'Could not load reviews'));
  }, []);

  const list = useMemo(
    () => (rows ?? []).filter((r) => (filter === 'all' ? true : filter === 'pending' ? !r.approved : r.approved)),
    [rows, filter]
  );
  const pending = (rows ?? []).filter((r) => !r.approved).length;

  const approve = async (r: Review, approved: boolean) => {
    try {
      await adminSetReviewApproved(r.id, approved);
      setRows((all) => all?.map((x) => (x.id === r.id ? { ...x, approved } : x)) ?? null);
      toast(approved ? 'Review is now on the website' : 'Review hidden from the website');
      window.dispatchEvent(new Event('sc-admin-counts'));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not save', 'error');
    }
  };

  const remove = async () => {
    if (!del) return;
    const r = del;
    setDel(null);
    try {
      await adminDeleteReview(r.id);
      setRows((all) => all?.filter((x) => x.id !== r.id) ?? null);
      toast('Review deleted');
      window.dispatchEvent(new Event('sc-admin-counts'));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customers"
        title="Reviews"
        sub={rows ? `${rows.length} reviews · ${pending} waiting for approval` : 'Loading…'}
      />

      <p className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-sm text-orange-900">
        New reviews stay hidden until you approve them. Approve real customer reviews; delete spam or fake ones.
      </p>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-bold transition ${filter === f.id ? 'text-white' : 'bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'}`}
          >
            {filter === f.id && <motion.span layoutId="rev-filter" className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30" />}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {err && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</p>}
      {!rows && !err && (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-3xl bg-white/70" />
          ))}
        </div>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {list.map((r, i) => {
            const p = products.get(r.product_id);
            return (
              <motion.li
                key={r.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
                className={`flex flex-col rounded-3xl border bg-white/90 p-5 shadow-[0_10px_40px_-22px_rgba(15,23,42,0.35)] backdrop-blur ${
                  r.approved ? 'border-white/70' : 'border-amber-300/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 p-1">
                    {p?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayImage(p.image, p.cutout, 120)} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <ImageOff className="h-4 w-4 text-slate-300" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{p?.name ?? `Product #${r.product_id}`}</p>
                    <p className="text-xs text-slate-400">{fmt(r.created_at)}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      r.approved ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                    }`}
                  >
                    {r.approved ? 'Live' : 'Pending'}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="font-semibold text-ink">{r.name}</span>
                  <Stars value={r.rating} />
                </div>
                {r.comment ? (
                  <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-slate-600">{r.comment}</p>
                ) : (
                  <p className="mt-2 flex-1 text-sm italic text-slate-400">Star rating only, no comment.</p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {r.approved ? (
                    <button onClick={() => approve(r, false)} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                      <EyeOff className="h-4 w-4" /> Hide
                    </button>
                  ) : (
                    <button onClick={() => approve(r, true)} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:brightness-110">
                      <Check className="h-4 w-4" /> Approve
                    </button>
                  )}
                  {p && (
                    <Link href={`/products/${p.id}#reviews`} target="_blank" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                      <ExternalLink className="h-4 w-4" /> View product
                    </Link>
                  )}
                  <button onClick={() => setDel(r)} className="ml-auto grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white" aria-label="Delete review">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {rows && list.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
            <MessageSquareQuote className="h-6 w-6" />
          </div>
          <p className="mt-4 font-display text-lg font-bold">{filter === 'pending' ? 'No reviews waiting' : 'No reviews yet'}</p>
          <p className="mt-1 text-sm text-slate-500">Customers can write reviews on each product page.</p>
        </motion.div>
      )}

      <ConfirmDialog
        open={!!del}
        title="Delete this review?"
        body={
          <>
            The review from <b className="text-ink">{del?.name}</b> will be removed for good.
          </>
        }
        onClose={() => setDel(null)}
        onConfirm={remove}
      />
    </div>
  );
}
