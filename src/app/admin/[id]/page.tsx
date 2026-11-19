'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { adminGetProduct, type ShopProductRow } from '@/lib/shopProducts';

export default function EditProductPage() {
  return (
    <Suspense fallback={null}>
      <EditProduct />
    </Suspense>
  );
}

function EditProduct() {
  const params = useParams();
  const search = useSearchParams();
  const id = Number(params.id);
  const [row, setRow] = useState<ShopProductRow | null | undefined>(undefined);
  const [err, setErr] = useState('');

  useEffect(() => {
    adminGetProduct(id)
      .then(setRow)
      .catch((e) => setErr(e.message ?? 'Could not load'));
  }, [id]);

  if (err) return <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>;
  if (row === undefined)
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  if (row === null)
    return (
      <p className="py-16 text-center text-slate-500">
        Product not found. <Link href="/admin" className="font-semibold text-electric">Back to products</Link>
      </p>
    );
  return (
    <div className="space-y-4">
      {search.get('saved') && (
        <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5" /> Product added. It’s on the website now.
        </p>
      )}
      <ProductForm initial={row} />
    </div>
  );
}
