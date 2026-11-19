'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react';
import { CATEGORIES } from '@/data/products';
import {
  adminDeleteProduct,
  adminListProducts,
  adminPatchProduct,
  displayImage,
  type ShopProductRow,
} from '@/lib/shopProducts';

const lkr = (n: number) => `Rs. ${n.toLocaleString('en-LK')}`;
const catName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? id;

export default function AdminProductsPage() {
  const [rows, setRows] = useState<ShopProductRow[] | null>(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () =>
    adminListProducts()
      .then(setRows)
      .catch((e) => setErr(e.message ?? 'Could not load products'));
  useEffect(() => {
    load();
  }, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (cat === 'all' || r.category === cat) &&
        (!s || `${r.name} ${r.brand ?? ''} ${r.model ?? ''}`.toLowerCase().includes(s))
    );
  }, [rows, q, cat]);

  const patch = async (r: ShopProductRow, p: Partial<ShopProductRow>) => {
    setBusyId(r.id);
    try {
      await adminPatchProduct(r.id, p);
      setRows((all) => all?.map((x) => (x.id === r.id ? { ...x, ...p } : x)) ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r: ShopProductRow) => {
    if (!confirm(`Delete “${r.name}” for good?\n\nTo take it off the website for a while, use “Hide” instead.`)) return;
    setBusyId(r.id);
    try {
      await adminDeleteProduct(r.id);
      setRows((all) => all?.filter((x) => x.id !== r.id) ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not delete');
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    (rows ?? []).forEach((r) => (m[r.category] = (m[r.category] ?? 0) + 1));
    return m;
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-slate-500">{rows ? `${rows.length} items` : 'Loading…'}</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-3 text-sm font-bold text-white shadow-lg shadow-electric/25"
        >
          <Plus className="h-5 w-5" /> Add product
        </Link>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, brand or model"
          className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-base outline-none focus:border-electric focus:ring-4 focus:ring-electric/15"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {[{ id: 'all', name: 'All' }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              cat === c.id ? 'bg-ink text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            {c.name} {c.id !== 'all' && <span className="opacity-60">{counts[c.id] ?? 0}</span>}
          </button>
        ))}
      </div>

      {err && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}
      {!rows && !err && (
        <div className="flex justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      <ul className="space-y-3">
        {list.map((r) => (
          <li
            key={r.id}
            className={`flex gap-3 rounded-3xl border bg-white p-3 ${r.published ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-70'}`}
          >
            <Link href={`/admin/${r.id}`} className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100">
              {r.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImage(r.image, r.cutout, 300)} alt="" className="h-full w-full object-contain p-1.5" loading="lazy" />
              ) : (
                <span className="text-xs text-slate-400">No photo</span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {r.brand} · {catName(r.category)}
              </p>
              <Link href={`/admin/${r.id}`} className="line-clamp-2 font-semibold leading-snug">
                {r.name}
              </Link>
              <p className="mt-1 font-display font-bold">
                {lkr(r.price)}
                {!r.in_stock && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">Out of stock</span>}
                {!r.published && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">Hidden</span>}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Link href={`/admin/${r.id}`} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  disabled={busyId === r.id}
                  onClick={() => patch(r, { in_stock: !r.in_stock })}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold disabled:opacity-50"
                >
                  {r.in_stock ? 'Mark out of stock' : 'Mark in stock'}
                </button>
                <button
                  disabled={busyId === r.id}
                  onClick={() => patch(r, { published: !r.published })}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold disabled:opacity-50"
                >
                  {r.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {r.published ? 'Hide' : 'Show'}
                </button>
                {r.published && (
                  <a href={`/products/${r.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </a>
                )}
                <button
                  disabled={busyId === r.id}
                  onClick={() => remove(r)}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {rows && list.length === 0 && <p className="py-10 text-center text-slate-500">No products match.</p>}
    </div>
  );
}
