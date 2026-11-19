'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  FileText,
  Tag,
  ToggleRight,
  ListChecks,
  SlidersHorizontal,
  Copy,
  ExternalLink,
  UploadCloud,
  Wand2,
  Eye,
} from 'lucide-react';
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
import { CategoryPill, catStyle, lkr, useToast } from './ui';

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
  'w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-base outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-electric focus:bg-white focus:ring-4 focus:ring-electric/15';

function Label({ text, hint, children }: { text: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{text}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Toggle({ on, onChange, label, sub, tone = 'from-electric to-violet-500' }: { on: boolean; onChange: (v: boolean) => void; label: string; sub?: string; tone?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${on ? 'border-electric/20 bg-electric/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
    >
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {sub && <span className="block text-xs text-slate-500">{sub}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? `bg-gradient-to-r ${tone}` : 'bg-slate-300'}`}>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 600, damping: 32 }}
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
          style={{ left: on ? 24 : 4 }}
        />
      </span>
    </button>
  );
}

function Card({ title, icon: Icon, tone, children, delay = 0 }: { title: string; icon: typeof Tag; tone: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4 rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_10px_40px_-22px_rgba(15,23,42,0.3)] backdrop-blur sm:p-6"
    >
      <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
        <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md ${tone}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

const snapshot = (p: ShopProductInput, specs: { k: string; v: string }[], features: string) => JSON.stringify([p, specs, features]);

export default function ProductForm({ initial }: { initial?: ShopProductRow }) {
  const router = useRouter();
  const toast = useToast();
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
  const [duplicating, setDuplicating] = useState(false);
  const [err, setErr] = useState('');
  const [canCutout, setCanCutout] = useState<boolean | null>(null);
  const [drag, setDrag] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [baseline, setBaseline] = useState(() => snapshot(p, specs, featuresText));
  const dirty = snapshot(p, specs, featuresText) !== baseline;
  const mainInput = useRef<HTMLInputElement>(null);
  const extraInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminCanCutout()
      .then(setCanCutout)
      .catch(() => setCanCutout(false));
  }, []);

  // warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const set = <K extends keyof ShopProductInput>(k: K, v: ShopProductInput[K]) => setP((x) => ({ ...x, [k]: v }));

  const num = (s: string) => {
    const n = Number(s.replace(/[^0-9]/g, ''));
    return s.trim() === '' || Number.isNaN(n) ? null : n;
  };

  const setPrices = (price: number, original: number | null) => {
    setP((x) => ({
      ...x,
      price,
      original_price: original,
      discount: original && original > price ? Math.round(((original - price) / original) * 100) : x.discount,
    }));
  };

  const uploadMain = async (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('Please choose an image file', 'error');
    setErr('');
    setUploading('main');
    try {
      const url = await adminUploadPhoto(f);
      setImgLoading(true);
      set('image', url);
      toast('Photo uploaded');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setUploading(null);
    }
  };

  const uploadExtra = async (files?: FileList | null) => {
    if (!files?.length) return;
    setUploading('extra');
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await adminUploadPhoto(f));
      setP((x) => ({ ...x, gallery: [...x.gallery, ...urls] }));
      toast(urls.length === 1 ? 'Photo added' : `${urls.length} photos added`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error');
    } finally {
      setUploading(null);
    }
  };

  const build = (): ShopProductInput => {
    const clean = (s: string | null) => (s && s.trim() ? s.trim() : null);
    return {
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
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!p.name.trim()) return setErr('Please enter the product name.');
    if (!p.price || p.price <= 0) return setErr('Please enter the price.');
    if (!p.image) return setErr('Please add a photo.');
    setSaving(true);
    try {
      const id = await adminSaveProduct(build(), initial?.id);
      setBaseline(snapshot(p, specs, featuresText));
      if (!initial) {
        toast(p.published ? 'Product added — it’s on the website now' : 'Product added (hidden from the website)');
        router.replace(`/admin/${id}`);
      } else toast('Changes saved');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const duplicate = async () => {
    if (!initial) return;
    setDuplicating(true);
    try {
      const id = await adminSaveProduct({ ...build(), name: `${p.name.trim()} (copy)`, published: false });
      toast('Copy created as hidden — edit and show it when ready', 'info');
      router.push(`/admin/${id}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not duplicate', 'error');
    } finally {
      setDuplicating(false);
    }
  };

  const preview = displayImage(p.image, p.cutout, 600);
  const st = catStyle(p.category);
  const filledSpecs = specs.filter((s) => s.k.trim() && s.v.trim());
  const completeness = useMemo(() => {
    const checks = [!!p.name.trim(), !!p.price, !!p.image, !!p.brand, !!p.description?.trim(), filledSpecs.length > 0, featuresText.trim().length > 0];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [p, filledSpecs.length, featuresText]);

  return (
    <form onSubmit={save} className="space-y-6">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/products"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-x-0.5 hover:ring-electric/40"
          aria-label="Back to products"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="mr-auto">
          <p className="bg-gradient-to-r from-electric to-violet-500 bg-clip-text text-xs font-bold uppercase tracking-[0.2em] text-transparent">
            {initial ? `Product #${initial.id}` : 'New product'}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{initial ? 'Edit product' : 'Add product'}</h1>
        </div>
        {initial && (
          <button
            type="button"
            onClick={duplicate}
            disabled={duplicating}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:ring-violet-300 disabled:opacity-60"
          >
            {duplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />} Duplicate
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card title="Photos" icon={ImageIcon} tone="from-sky-400 to-electric">
            <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
              <button
                type="button"
                onClick={() => mainInput.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  uploadMain(e.dataTransfer.files?.[0]);
                }}
                className={`group relative grid aspect-square place-items-center overflow-hidden rounded-3xl border-2 border-dashed transition ${
                  drag ? 'scale-[1.02] border-electric bg-electric/5' : 'border-slate-300 hover:border-electric/60'
                } bg-[repeating-conic-gradient(#f1f5f9_0_25%,#fff_0_50%)] bg-[length:20px_20px]`}
              >
                {uploading === 'main' ? (
                  <span className="flex flex-col items-center gap-2 text-sm font-semibold text-electric">
                    <Loader2 className="h-8 w-8 animate-spin" /> Uploading…
                  </span>
                ) : preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="" onLoad={() => setImgLoading(false)} onError={() => setImgLoading(false)} className="h-full w-full object-contain p-3" />
                    {imgLoading && (
                      <span className="absolute inset-0 grid place-items-center bg-white/70 text-xs font-semibold text-slate-500 backdrop-blur-sm">
                        <span className="flex flex-col items-center gap-2">
                          <Wand2 className="h-6 w-6 animate-pulse text-violet-500" /> Preparing photo…
                        </span>
                      </span>
                    )}
                    <span className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-xl bg-ink/80 py-2 text-xs font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <Camera className="h-4 w-4" /> Change photo
                    </span>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-3 px-4 text-center text-sm font-semibold text-slate-500">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-electric text-white shadow-lg shadow-electric/30 transition-transform group-hover:-translate-y-1">
                      <UploadCloud className="h-7 w-7" />
                    </span>
                    Drop a photo here
                    <span className="text-xs font-normal text-slate-400">or tap to take / choose one</span>
                  </span>
                )}
              </button>
              <div className="space-y-3">
                <input ref={mainInput} type="file" accept="image/*" className="hidden" onChange={(e) => uploadMain(e.target.files?.[0])} />
                {canCutout !== false || p.image?.includes('/image/upload/') ? (
                  <Toggle
                    on={p.cutout}
                    onChange={(v) => {
                      setImgLoading(!!p.image);
                      set('cutout', v);
                    }}
                    label="Remove background"
                    sub="Shows only the product, like the other items on the site. Turn off if the result looks wrong."
                    tone="from-fuchsia-500 to-violet-500"
                  />
                ) : (
                  <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
                    Background removal isn’t switched on yet (Cloudinary keys missing on the server), so the photo is shown as it is.
                  </p>
                )}
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 p-4 text-xs leading-relaxed text-slate-600">
                  <b className="text-ink">Photo tips:</b> shoot the item straight on, in good light, with nothing in front of it. The first preview can take a few seconds.
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">More photos <span className="font-normal text-slate-400">(optional)</span></p>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence initial={false}>
                  {p.gallery.map((g, i) => (
                    <motion.div
                      key={g}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative h-24 w-24 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={plainImage(g, 200)} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => set('gallery', p.gallery.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition hover:bg-rose-500"
                        aria-label="Remove photo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => extraInput.current?.click()}
                  className="grid h-24 w-24 place-items-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-electric hover:text-electric"
                  aria-label="Add more photos"
                >
                  {uploading === 'extra' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                </button>
                <input ref={extraInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadExtra(e.target.files)} />
              </div>
            </div>
          </Card>

          <Card title="Basic details" icon={FileText} tone="from-violet-400 to-indigo-500" delay={0.05}>
            <Label text="Product name" hint="e.g. LG 9kg Top Load Washing Machine">
              <input className={field} value={p.name} onChange={(e) => set('name', e.target.value)} required />
            </Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label text="Brand">
                <input className={field} list="brands" value={p.brand ?? ''} onChange={(e) => set('brand', e.target.value)} />
                <datalist id="brands">
                  {BRANDS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Label>
              <Label text="Category">
                <select className={field} value={p.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Label>
              <Label text="Model number" hint="From the box or poster, e.g. T2109VSAB">
                <input className={field} value={p.model ?? ''} onChange={(e) => set('model', e.target.value)} />
              </Label>
              <Label text="Size / capacity" hint="e.g. 12,000 BTU · 9 kg · 55 inch · 260 L">
                <input className={field} value={p.capacity ?? ''} onChange={(e) => set('capacity', e.target.value)} />
              </Label>
            </div>
          </Card>

          <Card title="Pricing" icon={Tag} tone="from-amber-400 to-orange-500" delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label text="Selling price (Rs.)">
                <input
                  className={field}
                  inputMode="numeric"
                  value={p.price ? p.price.toLocaleString('en-LK') : ''}
                  onChange={(e) => setPrices(num(e.target.value) ?? 0, p.original_price)}
                  required
                />
              </Label>
              <Label text="Old price (Rs.)" hint="Optional. Shows a crossed-out price and the % off.">
                <input
                  className={field}
                  inputMode="numeric"
                  value={p.original_price ? p.original_price.toLocaleString('en-LK') : ''}
                  onChange={(e) => setPrices(p.price, num(e.target.value))}
                />
              </Label>
              <Label text="Discount %" hint="Filled in from the old price; you can change it.">
                <input className={field} inputMode="numeric" value={p.discount ?? ''} onChange={(e) => set('discount', num(e.target.value))} />
              </Label>
              <Label text="Badge" hint="Short label on the card, e.g. Free installation">
                <input className={field} value={p.badge ?? ''} onChange={(e) => set('badge', e.target.value)} />
              </Label>
            </div>
            <AnimatePresence>
              {p.original_price && p.original_price > p.price && p.price > 0 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-sm text-orange-800"
                >
                  Customers save <b>{lkr(p.original_price - p.price)}</b> ({p.discount}% off).
                </motion.p>
              )}
            </AnimatePresence>
          </Card>

          <Card title="Availability" icon={ToggleRight} tone="from-emerald-400 to-teal-500" delay={0.15}>
            <Toggle on={p.in_stock} onChange={(v) => set('in_stock', v)} label="In stock" sub="Turn off when sold out — the item stays on the site." tone="from-emerald-500 to-teal-500" />
            <Toggle on={p.published} onChange={(v) => set('published', v)} label="Show on website" sub="Turn off to hide the item without deleting it." />
            <Toggle on={p.inverter} onChange={(v) => set('inverter', v)} label="Inverter model" sub="Shows the Inverter tag and the Inverter-only filter." tone="from-sky-400 to-cyan-500" />
          </Card>

          <Card title="Description & features" icon={ListChecks} tone="from-pink-400 to-fuchsia-500" delay={0.2}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label text="Warranty" hint="e.g. 10-year warranty">
                <input className={field} value={p.warranty ?? ''} onChange={(e) => set('warranty', e.target.value)} />
              </Label>
              <Label text="Type / what’s included" hint="e.g. Top load · Indoor + outdoor unit">
                <input className={field} value={p.unit ?? ''} onChange={(e) => set('unit', e.target.value)} />
              </Label>
            </div>
            <Label text="Description" hint="Two or three sentences about the item.">
              <textarea className={`${field} min-h-[110px]`} value={p.description ?? ''} onChange={(e) => set('description', e.target.value)} />
            </Label>
            <Label text="Key features" hint="One feature per line.">
              <textarea className={`${field} min-h-[130px]`} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
            </Label>
          </Card>

          <Card title="Specifications" icon={SlidersHorizontal} tone="from-cyan-400 to-sky-600" delay={0.25}>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {specs.map((s, i) => (
                  <motion.div key={i} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-2">
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
                      className="grid w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-500 transition hover:bg-rose-500 hover:text-white"
                      aria-label="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => setSpecs((all) => [...all, { k: '', v: '' }])}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add row
            </button>
          </Card>
        </div>

        {/* live preview */}
        <aside className="space-y-4 lg:sticky lg:top-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_20px_60px_-25px_rgba(47,107,255,0.45)] backdrop-blur"
          >
            <p className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              <Eye className="h-4 w-4" /> Live preview
            </p>
            <div className="relative grid aspect-square place-items-center p-6" style={{ background: `radial-gradient(circle at 50% 60%, ${st.from}2a, transparent 70%), linear-gradient(180deg,#F8FAFC,#EEF2F7)` }}>
              <div className="pointer-events-none absolute bottom-6 left-1/2 h-10 w-2/3 -translate-x-1/2 rounded-full opacity-40 blur-2xl" style={{ background: `linear-gradient(90deg, ${st.from}, ${st.to})` }} />
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="relative h-full w-full object-contain drop-shadow-xl" />
              ) : (
                <ImageIcon className="h-10 w-10 text-slate-300" />
              )}
              {p.discount ? (
                <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-xs font-extrabold text-white shadow">-{p.discount}%</span>
              ) : null}
              {!p.in_stock && <span className="absolute right-4 top-4 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">Out of stock</span>}
            </div>
            <div className="space-y-2 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryPill id={p.category} />
                {p.inverter && <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">Inverter</span>}
                {p.badge && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700">{p.badge}</span>}
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{p.brand || 'Brand'}</p>
              <p className="line-clamp-2 font-semibold leading-snug text-ink">{p.name || 'Product name'}</p>
              <p className="font-display text-xl font-bold text-ink">
                {p.price ? lkr(p.price) : 'Rs. —'}
                {p.original_price && p.original_price > p.price ? <span className="ml-2 text-sm font-medium text-slate-400 line-through">{lkr(p.original_price)}</span> : null}
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rounded-3xl border border-white/70 bg-white/85 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Listing completeness</span>
              <span className="font-display font-bold text-ink">{completeness}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-electric via-violet-500 to-fuchsia-500"
                animate={{ width: `${completeness}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                <span className="sc-bar-shine absolute inset-0" />
              </motion.div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Photo, brand, description, features and specs help customers decide.</p>
          </motion.div>
        </aside>
      </div>

      {err && (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {err}
        </motion.p>
      )}

      {/* save bar */}
      <div className="sticky bottom-24 z-30 lg:bottom-6">
        <div className="flex items-center gap-3 rounded-3xl bg-ink/95 p-2.5 pl-5 text-white shadow-2xl shadow-ink/30 ring-1 ring-white/10 backdrop-blur">
          <span className="mr-auto flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${dirty ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="hidden font-semibold text-white/80 sm:inline">{dirty ? 'Unsaved changes' : initial ? 'All changes saved' : 'Fill in the details'}</span>
            <span className="text-xs font-semibold text-white/80 sm:hidden">{dirty ? 'Unsaved' : initial ? 'Saved' : ''}</span>
          </span>
          {initial && p.published && (
            <a
              href={`/products/${initial.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/20"
            >
              <ExternalLink className="h-4 w-4" /> View
            </a>
          )}
          <button
            disabled={saving || uploading !== null || (!!initial && !dirty)}
            className="group relative inline-flex min-w-[140px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-glow via-electric to-violet-500 px-6 py-3 text-base font-bold shadow-lg shadow-electric/40 transition hover:brightness-110 disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : !dirty && initial ? <Check className="h-5 w-5" /> : null}
            {saving ? 'Saving…' : initial ? (dirty ? 'Save changes' : 'Saved') : 'Add product'}
          </button>
        </div>
      </div>
    </form>
  );
}
