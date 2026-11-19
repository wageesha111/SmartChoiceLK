'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  PackageCheck,
  PackageX,
  EyeOff,
  Wallet,
  Plus,
  ArrowRight,
  ImageOff,
  Sparkles,
  Clock,
  Tag,
  AlertCircle,
  MessageSquare,
  Star,
} from 'lucide-react';
import { CATEGORIES } from '@/data/products';
import { adminListProducts, displayImage, type ShopProductRow } from '@/lib/shopProducts';
import { adminPendingCounts } from '@/lib/shopExtras';
import { CategoryPill, CountUp, GradientButton, StatCard, catStyle, lkr } from '@/components/admin/ui';

const ago = (iso?: string) => {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? 'yesterday' : `${d} days ago`;
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export default function AdminDashboard() {
  const [rows, setRows] = useState<ShopProductRow[] | null>(null);
  const [err, setErr] = useState('');
  const [hello, setHello] = useState('Welcome');
  const [pending, setPending] = useState<{ messages: number; reviews: number } | null>(null);

  useEffect(() => {
    setHello(greeting());
    adminPendingCounts().then(setPending).catch(() => {});
    adminListProducts()
      .then(setRows)
      .catch((e) => setErr(e.message ?? 'Could not load products'));
  }, []);

  const s = useMemo(() => {
    const r = rows ?? [];
    const live = r.filter((x) => x.published && x.in_stock);
    const byCat = CATEGORIES.map((c) => ({ ...c, n: r.filter((x) => x.category === c.id).length })).filter((c) => c.n > 0);
    return {
      total: r.length,
      live: live.length,
      out: r.filter((x) => !x.in_stock).length,
      hidden: r.filter((x) => !x.published).length,
      value: live.reduce((a, x) => a + x.price, 0),
      onSale: r.filter((x) => (x.discount ?? 0) > 0).length,
      byCat,
      max: Math.max(1, ...byCat.map((c) => c.n)),
      recent: [...r].sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? '')).slice(0, 6),
      needs: r.filter((x) => !x.image || !x.description || Object.keys(x.specs ?? {}).length === 0).slice(0, 5),
    };
  }, [rows]);

  return (
    <div className="space-y-8">
      {/* hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-ink-900 via-[#1B1A6B] to-violet-700 p-6 text-white shadow-[0_30px_80px_-30px_rgba(76,29,149,0.7)] sm:p-9"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-glow/40 blur-[90px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-fuchsia-500/40 blur-[100px]"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_left,black,transparent_70%)]" />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-glow" /> Smart Choice LK
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-[40px]">{hello}</h1>
            <p className="mt-2 max-w-md text-sm text-white/70 sm:text-base">
              {rows ? (
                <>
                  <b className="text-white">
                    <CountUp value={s.live} />
                  </b>{' '}
                  products are live on your website right now.
                </>
              ) : (
                'Loading your shop…'
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/new">
              <GradientButton className="!from-glow !via-electric !to-violet-500">
                <Plus className="h-5 w-5" /> Add product
              </GradientButton>
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/20"
            >
              Manage products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {err && (
        <p className="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4" /> {err}
        </p>
      )}

      {/* stats */}
      {rows ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5 [&>*]:min-w-0">
          <StatCard icon={Package} label="Total products" value={s.total} from="#38BDF8" to="#2F6BFF" delay={0.05} />
          <StatCard icon={PackageCheck} label="Live & in stock" value={s.live} from="#34D399" to="#0D9488" delay={0.1} />
          <StatCard icon={PackageX} label="Out of stock" value={s.out} from="#FB7185" to="#E11D48" delay={0.15} />
          <StatCard icon={EyeOff} label="Hidden" value={s.hidden} from="#A78BFA" to="#7C3AED" delay={0.2} />
          <div className="col-span-2 lg:col-span-1">
            <StatCard icon={Wallet} label="Live catalogue value" value={s.value} format={lkr} hint="Sum of one of each live item" from="#FBBF24" to="#F97316" delay={0.25} />
          </div>
        </div>
      ) : (
        !err && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[150px] animate-pulse rounded-3xl bg-white/70" />
            ))}
          </div>
        )
      )}

      {pending && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 [&>*]:min-w-0">
          <InboxCard
            href="/admin/messages"
            icon={MessageSquare}
            n={pending.messages}
            title={pending.messages === 1 ? 'new customer message' : 'new customer messages'}
            empty="No new messages"
            tone="from-sky-400 to-electric"
            delay={0.28}
          />
          <InboxCard
            href="/admin/reviews"
            icon={Star}
            n={pending.reviews}
            title={pending.reviews === 1 ? 'review waiting for approval' : 'reviews waiting for approval'}
            empty="No reviews waiting"
            tone="from-amber-400 to-orange-500"
            delay={0.32}
          />
        </div>
      )}

      {rows && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 [&>*]:min-w-0">
          {/* categories */}
          <Panel className="lg:col-span-3" title="Products by category" icon={Tag} delay={0.3}>
            <ul className="space-y-4">
              {s.byCat.map((c, i) => {
                const st = catStyle(c.id);
                return (
                  <li key={c.id}>
                    <Link href={`/admin/products`} className="group block">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-semibold text-ink">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${st.from}, ${st.to})` }} />
                          {c.name}
                        </span>
                        <span className="font-display font-bold text-slate-600">{c.n}</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="relative h-full overflow-hidden rounded-full"
                          style={{ background: `linear-gradient(90deg, ${st.from}, ${st.to})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(c.n / s.max) * 100}%` }}
                          transition={{ duration: 1, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="sc-bar-shine absolute inset-0" />
                        </motion.div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniStat label="On sale" value={s.onSale} tone="from-amber-400 to-orange-500" />
              <MiniStat label="Categories" value={s.byCat.length} tone="from-electric to-violet-500" />
            </div>
          </Panel>

          {/* needs attention */}
          <Panel className="lg:col-span-2" title="Needs attention" icon={AlertCircle} delay={0.35}>
            {s.needs.length === 0 ? (
              <div className="grid place-items-center py-10 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <p className="mt-3 font-semibold">Everything looks complete</p>
                <p className="text-sm text-slate-500">Every product has a photo, description and specs.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {s.needs.map((r) => (
                  <li key={r.id}>
                    <Link href={`/admin/${r.id}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50">
                      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-100 p-1">
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={displayImage(r.image, r.cutout, 120)} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <ImageOff className="h-4 w-4 text-slate-300" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{r.name}</span>
                        <span className="block text-xs text-amber-600">
                          Missing {[!r.image && 'photo', !r.description && 'description', Object.keys(r.specs ?? {}).length === 0 && 'specs'].filter(Boolean).join(', ')}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* recent */}
          <Panel className="lg:col-span-5" title="Recently updated" icon={Clock} delay={0.4} action={<Link href="/admin/products" className="text-sm font-bold text-electric hover:text-violet-600">See all</Link>}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
              {s.recent.map((r, i) => {
                const st = catStyle(r.category);
                return (
                  <motion.li key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.05 }}>
                    <Link
                      href={`/admin/${r.id}`}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_16px_40px_-20px_rgba(47,107,255,0.5)]"
                    >
                      <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl p-1.5" style={{ background: `linear-gradient(135deg, ${st.from}22, ${st.to}22)` }}>
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={displayImage(r.image, r.cutout, 200)} alt="" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <ImageOff className="h-5 w-5 text-slate-300" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <CategoryPill id={r.category} />
                        <span className="mt-1 block truncate text-sm font-semibold text-ink">{r.name}</span>
                        <span className="flex items-center justify-between text-xs text-slate-400">
                          <b className="font-display text-sm text-ink">{lkr(r.price)}</b>
                          {ago(r.updated_at)}
                        </span>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  className = '',
  delay = 0,
  action,
}: {
  title: string;
  icon: typeof Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  action?: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-electric to-violet-500 text-white">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-50 p-4">
      <div className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br opacity-30 blur-xl ${tone}`} />
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={`bg-gradient-to-r bg-clip-text font-display text-2xl font-bold text-transparent ${tone}`}>
        <CountUp value={value} />
      </p>
    </div>
  );
}

function InboxCard({
  href,
  icon: Icon,
  n,
  title,
  empty,
  tone,
  delay,
}: {
  href: string;
  icon: typeof Tag;
  n: number;
  title: string;
  empty: string;
  tone: string;
  delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}>
      <Link
        href={href}
        className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur transition hover:-translate-y-0.5"
      >
        <span className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40 ${tone}`} />
        <span className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${tone}`}>
          <Icon className="h-6 w-6" />
          {n > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-rose-500" />}
        </span>
        <span className="relative flex-1">
          {n > 0 ? (
            <>
              <span className="font-display text-2xl font-bold text-ink">
                <CountUp value={n} />
              </span>{' '}
              <span className="text-sm font-semibold text-slate-600">{title}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-slate-500">{empty}</span>
          )}
        </span>
        <ArrowRight className="relative h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-ink" />
      </Link>
    </motion.div>
  );
}
