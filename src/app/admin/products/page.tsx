'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  LayoutGrid,
  List,
  PackageCheck,
  PackageX,
  CheckSquare,
  Square,
  X,
  ArrowUpDown,
  ImageOff,
} from 'lucide-react';
import { CATEGORIES } from '@/data/products';
import {
  adminDeleteProduct,
  adminListProducts,
  adminPatchProduct,
  displayImage,
  type ShopProductRow,
} from '@/lib/shopProducts';
import { CategoryPill, ConfirmDialog, GradientButton, PageHeader, catStyle, lkr, useToast } from '@/components/admin/ui';

type Status = 'all' | 'live' | 'out' | 'hidden';
type Sort = 'recent' | 'name' | 'price-asc' | 'price-desc';

const STATUS: { id: Status; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'out', label: 'Out of stock' },
  { id: 'hidden', label: 'Hidden' },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: 'recent', label: 'Recently updated' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];

export default function AdminProductsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<ShopProductRow[] | null>(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [status, setStatus] = useState<Status>('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<Set<number>>(new Set());
  const [confirm, setConfirm] = useState<{ ids: number[]; label: string } | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem('sc-admin-view');
      if (v === 'list' || v === 'grid') setView(v);
    } catch {}
    adminListProducts()
      .then(setRows)
      .catch((e) => setErr(e.message ?? 'Could not load products'));
  }, []);

  const changeView = (v: 'grid' | 'list') => {
    setView(v);
    try {
      localStorage.setItem('sc-admin-view', v);
    } catch {}
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    (rows ?? []).forEach((r) => (m[r.category] = (m[r.category] ?? 0) + 1));
    return m;
  }, [rows]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = (rows ?? []).filter((r) => {
      if (cat !== 'all' && r.category !== cat) return false;
      if (status === 'live' && !(r.published && r.in_stock)) return false;
      if (status === 'out' && r.in_stock) return false;
      if (status === 'hidden' && r.published) return false;
      return !s || `${r.name} ${r.brand ?? ''} ${r.model ?? ''}`.toLowerCase().includes(s);
    });
    const by: Record<Sort, (a: ShopProductRow, b: ShopProductRow) => number> = {
      recent: (a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? '') || b.id - a.id,
      name: (a, b) => a.name.localeCompare(b.name),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    };
    return out.sort(by[sort]);
  }, [rows, q, cat, status, sort]);

  const markBusy = (ids: number[], on: boolean) =>
    setBusy((b) => {
      const n = new Set(b);
      ids.forEach((id) => (on ? n.add(id) : n.delete(id)));
      return n;
    });

  const patchMany = async (ids: number[], p: Partial<ShopProductRow>, msg: string) => {
    markBusy(ids, true);
    const results = await Promise.allSettled(ids.map((id) => adminPatchProduct(id, p)));
    const ok = ids.filter((_, i) => results[i].status === 'fulfilled');
    setRows((all) => all?.map((x) => (ok.includes(x.id) ? { ...x, ...p, updated_at: new Date().toISOString() } : x)) ?? null);
    markBusy(ids, false);
    if (ok.length === ids.length) toast(msg);
    else toast(`${ids.length - ok.length} item(s) could not be saved`, 'error');
  };

  const removeMany = async (ids: number[]) => {
    setConfirm(null);
    markBusy(ids, true);
    const results = await Promise.allSettled(ids.map((id) => adminDeleteProduct(id)));
    const ok = ids.filter((_, i) => results[i].status === 'fulfilled');
    setRows((all) => all?.filter((x) => !ok.includes(x.id)) ?? null);
    setSelected((s) => {
      const n = new Set(s);
      ok.forEach((id) => n.delete(id));
      return n;
    });
    markBusy(ids, false);
    if (ok.length === ids.length) toast(ok.length === 1 ? 'Product deleted' : `${ok.length} products deleted`);
    else toast(`${ids.length - ok.length} item(s) could not be deleted`, 'error');
  };

  const toggleSel = (id: number) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allShownSelected = list.length > 0 && list.every((r) => selected.has(r.id));
  const selectAll = () => setSelected(allShownSelected ? new Set() : new Set(list.map((r) => r.id)));
  const sel = Array.from(selected);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        sub={rows ? `${rows.length} products · ${list.length} shown` : 'Loading…'}
        action={
          <Link href="/admin/new">
            <GradientButton>
              <Plus className="h-5 w-5" /> Add product
            </GradientButton>
          </Link>
        }
      />

      {/* toolbar */}
      <div className="rounded-3xl border border-white/70 bg-white/80 p-3 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, brand or model"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-12 pr-10 text-base outline-none transition focus:border-electric focus:bg-white focus:ring-4 focus:ring-electric/15"
            />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative flex items-center">
              <ArrowUpDown className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-electric focus:ring-4 focus:ring-electric/15"
                aria-label="Sort"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="relative flex rounded-2xl bg-slate-100 p-1">
              {(['grid', 'list'] as const).map((v) => (
                <button key={v} onClick={() => changeView(v)} className="relative grid h-10 w-10 place-items-center rounded-xl" aria-label={`${v} view`}>
                  {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-xl bg-white shadow" />}
                  {v === 'grid' ? <LayoutGrid className="relative h-4 w-4" /> : <List className="relative h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {STATUS.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              className={`relative rounded-full px-4 py-2.5 text-xs font-bold transition ${status === s.id ? 'text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {status === s.id && <motion.span layoutId="status-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-ink to-ink-700" />}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4">
          {[{ id: 'all', name: 'All categories' }, ...CATEGORIES].map((c) => {
            const on = cat === c.id;
            const st = catStyle(c.id);
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  on ? 'text-white shadow-lg' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
                style={on ? { background: c.id === 'all' ? 'linear-gradient(135deg,#2F6BFF,#8B5CF6)' : `linear-gradient(135deg, ${st.from}, ${st.to})` } : undefined}
              >
                {c.name} {c.id !== 'all' && <span className="opacity-70">{counts[c.id] ?? 0}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {err && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</p>}

      {rows && list.length > 0 && (
        <button onClick={selectAll} className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-ink">
          {allShownSelected ? <CheckSquare className="h-4 w-4 text-electric" /> : <Square className="h-4 w-4" />}
          {allShownSelected ? 'Clear selection' : 'Select all shown'}
        </button>
      )}

      {/* skeletons */}
      {!rows && !err && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[340px] animate-pulse rounded-3xl bg-white/70" />
          ))}
        </div>
      )}

      {view === 'grid' ? (
        <motion.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
          <AnimatePresence mode="popLayout">
            {list.map((r, i) => (
              <GridCard
                key={r.id}
                r={r}
                index={i}
                selected={selected.has(r.id)}
                busy={busy.has(r.id)}
                onSelect={() => toggleSel(r.id)}
                onStock={() => patchMany([r.id], { in_stock: !r.in_stock }, r.in_stock ? 'Marked out of stock' : 'Marked in stock')}
                onPublish={() => patchMany([r.id], { published: !r.published }, r.published ? 'Hidden from the website' : 'Now showing on the website')}
                onDelete={() => setConfirm({ ids: [r.id], label: r.name })}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur">
          <ul className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {list.map((r) => (
                <ListRow
                  key={r.id}
                  r={r}
                  selected={selected.has(r.id)}
                  busy={busy.has(r.id)}
                  onSelect={() => toggleSel(r.id)}
                  onStock={() => patchMany([r.id], { in_stock: !r.in_stock }, r.in_stock ? 'Marked out of stock' : 'Marked in stock')}
                  onPublish={() => patchMany([r.id], { published: !r.published }, r.published ? 'Hidden from the website' : 'Now showing on the website')}
                  onDelete={() => setConfirm({ ids: [r.id], label: r.name })}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}

      {rows && list.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet-500 text-white shadow-lg shadow-electric/30">
            <Search className="h-6 w-6" />
          </div>
          <p className="mt-4 font-display text-lg font-bold">No products match</p>
          <p className="mt-1 text-sm text-slate-500">Try another search or filter.</p>
        </motion.div>
      )}

      {/* bulk bar */}
      <AnimatePresence>
        {sel.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-x-3 bottom-24 z-50 mx-auto flex max-w-2xl flex-wrap items-center gap-2 rounded-3xl bg-ink/95 p-2 pl-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur lg:bottom-6 lg:left-[264px]"
          >
            <span className="mr-auto text-sm font-bold">
              <span className="mr-1.5 inline-grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-r from-electric to-violet-500 px-1.5 text-xs">{sel.length}</span>
              selected
            </span>
            <BulkBtn onClick={() => patchMany(sel, { in_stock: true }, 'Marked in stock')} icon={PackageCheck} label="In stock" />
            <BulkBtn onClick={() => patchMany(sel, { in_stock: false }, 'Marked out of stock')} icon={PackageX} label="Out" />
            <BulkBtn onClick={() => patchMany(sel, { published: true }, 'Now showing on the website')} icon={Eye} label="Show" />
            <BulkBtn onClick={() => patchMany(sel, { published: false }, 'Hidden from the website')} icon={EyeOff} label="Hide" />
            <button
              onClick={() => setConfirm({ ids: sel, label: `${sel.length} products` })}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-3 py-2 text-xs font-bold"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="grid h-9 w-9 place-items-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white" aria-label="Clear selection">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!confirm}
        title={confirm && confirm.ids.length > 1 ? `Delete ${confirm.ids.length} products?` : 'Delete this product?'}
        body={
          <>
            <b className="text-ink">{confirm?.label}</b> will be removed for good. To take it off the website for a while, use <b>Hide</b> instead.
          </>
        }
        onClose={() => setConfirm(null)}
        onConfirm={() => confirm && removeMany(confirm.ids)}
      />
    </div>
  );
}

function BulkBtn({ onClick, icon: Icon, label }: { onClick: () => void; icon: typeof Eye; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20">
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

interface RowProps {
  r: ShopProductRow;
  selected: boolean;
  busy: boolean;
  onSelect: () => void;
  onStock: () => void;
  onPublish: () => void;
  onDelete: () => void;
}

function StatusBadges({ r }: { r: ShopProductRow }) {
  return (
    <>
      {!r.published ? (
        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Hidden</span>
      ) : !r.in_stock ? (
        <span className="rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Out of stock</span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
        </span>
      )}
    </>
  );
}

function Thumb({ r, size }: { r: ShopProductRow; size: number }) {
  return r.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={displayImage(r.image, r.cutout, size)} alt="" className="h-full w-full object-contain" loading="lazy" />
  ) : (
    <ImageOff className="h-6 w-6 text-slate-300" />
  );
}

function GridCard({ r, index, selected, busy, onSelect, onStock, onPublish, onDelete }: RowProps & { index: number }) {
  const st = catStyle(r.category);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.035, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white/90 shadow-[0_10px_40px_-22px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow hover:shadow-[0_24px_60px_-24px_rgba(47,107,255,0.45)] ${
        selected ? 'border-electric ring-4 ring-electric/15' : 'border-white/70'
      } ${busy ? 'opacity-60' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: `radial-gradient(circle at 50% 60%, ${st.from}22, transparent 70%), linear-gradient(180deg,#F8FAFC,#EEF2F7)` }}>
        <div className="pointer-events-none absolute -bottom-12 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full opacity-30 blur-2xl" style={{ background: `linear-gradient(90deg, ${st.from}, ${st.to})` }} />
        <Link href={`/admin/${r.id}`} className="relative grid h-full w-full place-items-center p-5 transition-transform duration-500 group-hover:scale-[1.06]">
          <Thumb r={r} size={500} />
        </Link>
        <button
          onClick={onSelect}
          className={`absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-xl backdrop-blur transition ${
            selected ? 'bg-electric text-white' : 'bg-white/80 text-slate-400 opacity-100 hover:text-ink lg:opacity-0 lg:group-hover:opacity-100'
          }`}
          aria-label={selected ? 'Unselect' : 'Select'}
        >
          {selected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        </button>
        <div className="absolute right-3 top-3 flex gap-1">
          <StatusBadges r={r} />
        </div>
        {r.discount ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[11px] font-extrabold text-white shadow">-{r.discount}%</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <CategoryPill id={r.category} />
          {r.brand && <span className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400">{r.brand}</span>}
        </div>
        <Link href={`/admin/${r.id}`} className="mt-2 line-clamp-2 font-semibold leading-snug text-ink hover:text-electric">
          {r.name}
        </Link>
        <p className="mt-auto pt-2 font-display text-lg font-bold text-ink">
          {lkr(r.price)}
          {r.original_price && r.original_price > r.price && <span className="ml-2 text-xs font-medium text-slate-400 line-through">{lkr(r.original_price)}</span>}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <Link href={`/admin/${r.id}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-electric to-violet-500 py-2 text-xs font-bold text-white shadow-md shadow-electric/25 hover:brightness-110">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          <IconBtn disabled={busy} onClick={onStock} label={r.in_stock ? 'Mark out of stock' : 'Mark in stock'} icon={r.in_stock ? PackageX : PackageCheck} />
          <IconBtn disabled={busy} onClick={onPublish} label={r.published ? 'Hide from website' : 'Show on website'} icon={r.published ? EyeOff : Eye} />
          {r.published && <IconLink href={`/products/${r.id}`} label="View on website" icon={ExternalLink} />}
          <IconBtn disabled={busy} onClick={onDelete} label="Delete" icon={Trash2} danger />
        </div>
      </div>
    </motion.li>
  );
}

function ListRow({ r, selected, busy, onSelect, onStock, onPublish, onDelete }: RowProps) {
  const st = catStyle(r.category);
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-center gap-3 p-3 transition-colors hover:bg-slate-50/80 sm:gap-4 sm:px-4 ${selected ? 'bg-electric/5' : ''} ${busy ? 'opacity-60' : ''}`}
    >
      <button onClick={onSelect} className="shrink-0 text-slate-400 hover:text-ink" aria-label={selected ? 'Unselect' : 'Select'}>
        {selected ? <CheckSquare className="h-5 w-5 text-electric" /> : <Square className="h-5 w-5" />}
      </button>
      <Link href={`/admin/${r.id}`} className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl p-1.5" style={{ background: `linear-gradient(135deg, ${st.from}1f, ${st.to}1f)` }}>
        <Thumb r={r} size={200} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryPill id={r.category} />
          <StatusBadges r={r} />
        </div>
        <Link href={`/admin/${r.id}`} className="mt-1 line-clamp-1 font-semibold text-ink hover:text-electric">
          {r.name}
        </Link>
        <p className="text-xs text-slate-400">{[r.brand, r.model].filter(Boolean).join(' · ')}</p>
      </div>
      <p className="hidden shrink-0 font-display font-bold text-ink sm:block">{lkr(r.price)}</p>
      <div className="flex shrink-0 items-center gap-1">
        <IconLink href={`/admin/${r.id}`} label="Edit" icon={Pencil} />
        <span className="hidden gap-1 md:flex">
          <IconBtn disabled={busy} onClick={onStock} label={r.in_stock ? 'Mark out of stock' : 'Mark in stock'} icon={r.in_stock ? PackageX : PackageCheck} />
          <IconBtn disabled={busy} onClick={onPublish} label={r.published ? 'Hide from website' : 'Show on website'} icon={r.published ? EyeOff : Eye} />
        </span>
        <IconBtn disabled={busy} onClick={onDelete} label="Delete" icon={Trash2} danger />
      </div>
    </motion.li>
  );
}

function IconBtn({ onClick, label, icon: Icon, danger, disabled }: { onClick: () => void; label: string; icon: typeof Eye; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-xl transition disabled:opacity-40 ${
        danger ? 'bg-rose-50 text-rose-500 hover:bg-gradient-to-br hover:from-rose-500 hover:to-red-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-ink hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function IconLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Eye }) {
  const external = href.startsWith('/products');
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      title={label}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-ink hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}
