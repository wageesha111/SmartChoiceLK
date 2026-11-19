'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, ImagePlus, Loader2, Plus, Trash2, X, Check } from 'lucide-react';
import { CATEGORIES } from '@/data/products';
import {
  adminCanCutout,
  adminSaveProduct,
  adminUploadPhoto,
  displayImage,
  plainImage,
  type ShopProductInput,
  type ShopProductRow,
} from '@/lib/shopProducts';

const BRANDS = ['LG', 'Samsung', 'Abans', 'Haier', 'Sharp', 'TCL', 'IGNIS', 'Hisense', 'Panasonic', 'Whirlpool', 'Singer', 'Sony'];
const MODEL3D: Record<string, string> = {
  'air-conditioners': 'ac',
  refrigerators: 'fridge',
  'washing-machines': 'washer',
  televisions: 'tv',
};

const EMPTY: ShopProductInput = {
  name: '',
  brand: '',
  category: 'air-conditioners',
  model: '',
  price: 0,
  original_price: null,
  discount: null,
  badge: '',
  capacity: '',
  unit: '',
  warranty: '',
  inverter: false,
  in_stock: true,
  published: true,
  image: null,
  cutout: true,
  gallery: [],
  description: '',
  features: [],
  specs: {},
  model3d_type: 'ac',
  sort_order: 0,
};

const field =
  'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-electric focus:ring-4 focus:ring-electric/15';

function Label({ en, si, hint, children }: { en: string; si?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">
        {en} {si && <span className="font-normal text-slate-400">· {si}</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Toggle({ on, onChange, label, sub }: { on: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {sub && <span className="block text-xs text-slate-500">{sub}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? 'bg-electric' : 'bg-slate-300'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
      </span>
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function ProductForm({ initial }: { initial?: ShopProductRow }) {
  const router = useRouter();
  const [p, setP] = useState<ShopProductInput>(() => {
    if (!initial) return EMPTY;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updated_at, ...rest } = initial;
    return rest;
  });
  const [specs, setSpecs] = useState<{ k: string; v: string }[]>(() =>
    Object.entries(initial?.specs ?? {}).map(([k, v]) => ({ k, v: String(v) }))
  );
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join('\n'));
  const [uploading, setUploading] = useState<'main' | 'extra' | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState<number | null>(null);
  const [canCutout, setCanCutout] = useState<boolean | null>(null);
  useEffect(() => {
    adminCanCutout()
      .then(setCanCutout)
      .catch(() => setCanCutout(false));
  }, []);
  const mainInput = useRef<HTMLInputElement>(null);
  const extraInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ShopProductInput>(k: K, v: ShopProductInput[K]) => {
    setSaved(null);
    setP((x) => ({ ...x, [k]: v }));
  };

  const num = (s: string) => {
    const n = Number(s.replace(/[^0-9]/g, ''));
    return s.trim() === '' || Number.isNaN(n) ? null : n;
  };

  const setPrices = (price: number, original: number | null) => {
    const discount = original && original > price ? Math.round(((original - price) / original) * 100) : p.discount;
    setP((x) => ({ ...x, price, original_price: original, discount: original && original > price ? discount : x.discount }));
    setSaved(null);
  };

  const uploadMain = async (f?: File | null) => {
    if (!f) return;
    setErr('');
    setUploading('main');
    try {
      set('image', await adminUploadPhoto(f));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const uploadExtra = async (files?: FileList | null) => {
    if (!files?.length) return;
    setErr('');
    setUploading('extra');
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await adminUploadPhoto(f));
      set('gallery', [...p.gallery, ...urls]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!p.name.trim()) return setErr('Please enter the product name.');
    if (!p.price || p.price <= 0) return setErr('Please enter the price.');
    if (!p.image) return setErr('Please add a photo.');
    setSaving(true);
    try {
      const clean = (s: string | null) => (s && s.trim() ? s.trim() : null);
      const input: ShopProductInput = {
        ...p,
        name: p.name.trim(),
        brand: clean(p.brand),
        model: clean(p.model),
        badge: clean(p.badge),
        capacity: clean(p.capacity),
        unit: clean(p.unit),
        warranty: clean(p.warranty),
        description: clean(p.description),
        features: featuresText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        specs: Object.fromEntries(specs.filter((s) => s.k.trim() && s.v.trim()).map((s) => [s.k.trim(), s.v.trim()])),
        model3d_type: MODEL3D[p.category] ?? null,
      };
      const id = await adminSaveProduct(input, initial?.id);
      setSaved(id);
      if (!initial) router.replace(`/admin/${id}?saved=1`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const preview = displayImage(p.image, p.cutout, 600);

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">{initial ? 'Edit product' : 'Add product'}</h1>
      </div>

      <Card title="Photo · ඡායාරූපය">
        <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
          <button
            type="button"
            onClick={() => mainInput.current?.click()}
            className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-[repeating-conic-gradient(#f1f5f9_0_25%,#fff_0_50%)] bg-[length:20px_20px]"
          >
            {uploading === 'main' ? (
              <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
            ) : preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain p-2" />
            ) : (
              <span className="flex flex-col items-center gap-2 text-sm font-semibold text-slate-500">
                <Camera className="h-8 w-8" /> Take or choose a photo
              </span>
            )}
          </button>
          <div className="space-y-3">
            <input ref={mainInput} type="file" accept="image/*" className="hidden" onChange={(e) => uploadMain(e.target.files?.[0])} />
            <button
              type="button"
              onClick={() => mainInput.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white"
            >
              <Camera className="h-4 w-4" /> {p.image ? 'Change photo' : 'Add photo'}
            </button>
            {canCutout !== false || p.image?.includes('/image/upload/') ? (
              <Toggle
                on={p.cutout}
                onChange={(v) => set('cutout', v)}
                label="Remove background"
                sub="Shows only the product, like the other items on the site. Turn off if the result looks wrong."
              />
            ) : (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
                Background removal isn’t switched on yet (Cloudinary keys missing on the server), so the photo is shown as it is.
              </p>
            )}
            <p className="text-xs text-slate-500">
              Tip: photograph the item straight on, in good light, with nothing in front of it. The first preview can take a few seconds.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">More photos (optional)</p>
          <div className="flex flex-wrap gap-2">
            {p.gallery.map((g, i) => (
              <div key={g} className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plainImage(g, 200)} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => set('gallery', p.gallery.filter((_, j) => j !== i))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => extraInput.current?.click()}
              className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400"
              aria-label="Add more photos"
            >
              {uploading === 'extra' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
            </button>
            <input ref={extraInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadExtra(e.target.files)} />
          </div>
        </div>
      </Card>

      <Card title="Basic details">
        <Label en="Product name" si="නම" hint="e.g. LG 9kg Top Load Washing Machine">
          <input className={field} value={p.name} onChange={(e) => set('name', e.target.value)} required />
        </Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label en="Brand" si="බ්‍රෑන්ඩ්">
            <input className={field} list="brands" value={p.brand ?? ''} onChange={(e) => set('brand', e.target.value)} />
            <datalist id="brands">
              {BRANDS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </Label>
          <Label en="Category" si="වර්ගය">
            <select className={field} value={p.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Label>
          <Label en="Model number" hint="From the box or poster, e.g. T2109VSAB">
            <input className={field} value={p.model ?? ''} onChange={(e) => set('model', e.target.value)} />
          </Label>
          <Label en="Size / capacity" hint="e.g. 12,000 BTU · 9 kg · 55 inch · 260 L">
            <input className={field} value={p.capacity ?? ''} onChange={(e) => set('capacity', e.target.value)} />
          </Label>
        </div>
      </Card>

      <Card title="Price · මිල">
        <div className="grid gap-4 sm:grid-cols-2">
          <Label en="Selling price (Rs.)" si="විකුණන මිල">
            <input
              className={field}
              inputMode="numeric"
              value={p.price ? p.price.toLocaleString('en-LK') : ''}
              onChange={(e) => setPrices(num(e.target.value) ?? 0, p.original_price)}
              required
            />
          </Label>
          <Label en="Old price (Rs.)" si="පරණ මිල" hint="Optional. Shows a crossed-out price and the % off.">
            <input
              className={field}
              inputMode="numeric"
              value={p.original_price ? p.original_price.toLocaleString('en-LK') : ''}
              onChange={(e) => setPrices(p.price, num(e.target.value))}
            />
          </Label>
          <Label en="Discount %" hint="Filled in from the old price; you can change it.">
            <input className={field} inputMode="numeric" value={p.discount ?? ''} onChange={(e) => set('discount', num(e.target.value))} />
          </Label>
          <Label en="Badge" hint="Short label on the card, e.g. 20% OFF • Free installation">
            <input className={field} value={p.badge ?? ''} onChange={(e) => set('badge', e.target.value)} />
          </Label>
        </div>
      </Card>

      <Card title="Availability">
        <Toggle on={p.in_stock} onChange={(v) => set('in_stock', v)} label="In stock" sub="Turn off when sold out — the item stays on the site." />
        <Toggle on={p.published} onChange={(v) => set('published', v)} label="Show on website" sub="Turn off to hide the item without deleting it." />
        <Toggle on={p.inverter} onChange={(v) => set('inverter', v)} label="Inverter model" sub="Shows the Inverter tag and the Inverter-only filter." />
      </Card>

      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Label en="Warranty" hint="e.g. 10-year warranty">
            <input className={field} value={p.warranty ?? ''} onChange={(e) => set('warranty', e.target.value)} />
          </Label>
          <Label en="Type / what’s included" hint="e.g. Top load · Indoor + outdoor unit">
            <input className={field} value={p.unit ?? ''} onChange={(e) => set('unit', e.target.value)} />
          </Label>
        </div>
        <Label en="Description" si="විස්තරය" hint="Two or three sentences about the item.">
          <textarea className={`${field} min-h-[110px]`} value={p.description ?? ''} onChange={(e) => set('description', e.target.value)} />
        </Label>
        <Label en="Key features" hint="One feature per line.">
          <textarea className={`${field} min-h-[130px]`} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
        </Label>
      </Card>

      <Card title="Specifications">
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={`${field} w-2/5`}
                placeholder="e.g. Capacity"
                value={s.k}
                onChange={(e) => setSpecs((all) => all.map((x, j) => (j === i ? { ...x, k: e.target.value } : x)))}
              />
              <input
                className={field}
                placeholder="e.g. 9 kg"
                value={s.v}
                onChange={(e) => setSpecs((all) => all.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)))}
              />
              <button
                type="button"
                onClick={() => setSpecs((all) => all.filter((_, j) => j !== i))}
                className="grid w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500"
                aria-label="Remove row"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSpecs((all) => [...all, { k: '', v: '' }])}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold"
        >
          <Plus className="h-4 w-4" /> Add row
        </button>
      </Card>

      {err && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{err}</p>}

      <div className="sticky bottom-3 z-30 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
        <button
          disabled={saving || uploading !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-electric py-3.5 text-base font-bold text-white disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : saved ? <Check className="h-5 w-5" /> : null}
          {saved ? 'Saved' : 'Save'}
        </button>
        {(saved || initial) && p.published && (
          <a
            href={`/products/${saved ?? initial?.id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-slate-100 px-4 py-3.5 text-sm font-bold"
          >
            View
          </a>
        )}
      </div>
    </form>
  );
}
