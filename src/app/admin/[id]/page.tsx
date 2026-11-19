'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PackageSearch } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { adminGetProduct, type ShopProductRow } from '@/lib/shopProducts';

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params.id);
  const [row, setRow] = useState<ShopProductRow | null | undefined>(undefined);
  const [err, setErr] = useState('');

  useEffect(() => {
    setRow(undefined);
    adminGetProduct(id)
      .then(setRow)
      .catch((e) => setErr(e.message ?? 'Could not load'));
  }, [id]);

  if (err) return <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</p>;
  if (row === undefined)
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {[280, 220, 180].map((h) => (
            <div key={h} className="animate-pulse rounded-3xl bg-white/70" style={{ height: h }} />
          ))}
        </div>
        <div className="h-[460px] animate-pulse rounded-3xl bg-white/70" />
      </div>
    );
  if (row === null)
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet-500 text-white shadow-lg shadow-electric/30">
          <PackageSearch className="h-6 w-6" />
        </div>
        <p className="mt-4 font-display text-lg font-bold">Product not found</p>
        <Link href="/admin/products" className="mt-2 inline-block text-sm font-bold text-electric">
          Back to products
        </Link>
      </div>
    );
  return <ProductForm key={row.id} initial={row} />;
}
