'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Loader2, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { fetchProductReviews, submitReview, type Review } from '@/lib/shopExtras';

const field =
  'w-full rounded-2xl bg-white px-4 py-3.5 text-[15px] text-ink ring-1 ring-slate-200 transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-electric';

function Stars({ value, size = 'h-4 w-4' }: { value: number; size?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
      ))}
    </span>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProductReviews({ productId, productName }: { productId: number; productName: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [openedAt, setOpenedAt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchProductReviews(productId).then(setReviews);
  }, [productId]);

  const list = reviews ?? [];
  const avg = list.length ? Math.round((list.reduce((a, r) => a + r.rating, 0) / list.length) * 10) / 10 : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: list.filter((r) => r.rating === s).length }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!name.trim()) return setErr('Please enter your name.');
    if (!rating) return setErr('Please choose a star rating.');
    // bots submit instantly; people take a few seconds
    if (Date.now() - openedAt < 2500) return setErr('Please take a moment to check your review, then submit again.');
    setBusy(true);
    const ok = await submitReview({ product_id: productId, name, rating, comment });
    setBusy(false);
    if (ok) setDone(true);
    else setErr('Sorry, we couldn’t send your review. Please try again.');
  };

  return (
    <section id="reviews" className="mx-auto mt-20 max-w-[1280px] scroll-mt-28 px-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric">Customer reviews</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">What buyers say</h2>
        </div>
        {!open && !done && (
          <button
            onClick={() => {
              setOpen(true);
              setOpenedAt(Date.now());
            }}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-electric"
          >
            <MessageSquarePlus className="h-4 w-4" /> Write a review
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* summary */}
        <div className="h-fit rounded-[28px] bg-mist p-6">
          {list.length ? (
            <>
              <p className="font-display text-5xl font-bold">{avg.toFixed(1)}</p>
              <Stars value={avg} size="h-5 w-5" />
              <p className="mt-1 text-sm text-slate-500">
                {list.length} review{list.length === 1 ? '' : 's'}
              </p>
              <div className="mt-5 space-y-2">
                {dist.map(({ s, n }) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-3">{s}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                      <motion.span
                        className="block h-full rounded-full bg-amber-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(n / list.length) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      />
                    </span>
                    <span className="w-5 text-right">{n}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Stars value={0} size="h-5 w-5" />
              <p className="mt-3 font-semibold">No reviews yet</p>
              <p className="mt-1 text-sm text-slate-500">Bought this from us? Be the first to share how it’s working for you.</p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 rounded-[24px] bg-emerald-50 p-5 text-sm text-emerald-800">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>
                  <b>Thank you for your review!</b> It will appear here once the shop has checked it.
                </span>
              </motion.div>
            )}
            {open && !done && (
              <motion.form
                onSubmit={submit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-slate-200/80"
              >
                <p className="font-display text-lg font-bold">Review {productName}</p>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold">Your rating</p>
                  <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHover(i)}
                        aria-label={`${i} star${i > 1 ? 's' : ''}`}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star className={`h-8 w-8 ${i <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">Your name</span>
                    <input className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">Your review <span className="font-normal text-slate-400">(optional)</span></span>
                    <textarea className={`${field} min-h-[110px] resize-none`} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1500} placeholder="How is it working? Delivery, installation, performance…" />
                  </label>
                </div>
                {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-electric disabled:opacity-60">
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit review
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full px-5 py-3 text-sm font-bold text-slate-500 hover:text-ink">
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {reviews === null && <div className="h-28 animate-pulse rounded-[24px] bg-mist" />}
          {list.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 6) * 0.05 }}
              className="rounded-[24px] bg-white p-5 ring-1 ring-slate-200/80"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-electric to-violet-500 text-sm font-bold text-white">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <Stars value={r.rating} />
                  </div>
                </div>
                <time className="text-xs text-slate-400" dateTime={r.created_at}>
                  {fmtDate(r.created_at)}
                </time>
              </div>
              {r.comment && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{r.comment}</p>}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
