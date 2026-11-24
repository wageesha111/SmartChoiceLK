import type { Product } from '@/types';
import { getSupabase } from './supabase';

/** A row of `public.shop_products` in Supabase. */
export interface ShopProductRow {
  id: number;
  name: string;
  brand: string | null;
  category: string;
  model: string | null;
  price: number;
  original_price: number | null;
  discount: number | null;
  badge: string | null;
  capacity: string | null;
  unit: string | null;
  warranty: string | null;
  inverter: boolean;
  in_stock: boolean;
  published: boolean;
  image: string | null;
  cutout: boolean;
  gallery: string[];
  description: string | null;
  features: string[];
  specs: Record<string, string>;
  model3d_type: string | null;
  sort_order: number;
  updated_at?: string;
}

export type ShopProductInput = Omit<ShopProductRow, 'id' | 'updated_at'>;

const TABLE = 'shop_products';
export const PHOTO_BUCKET = 'product-photos';
const CLOUD = 'https://res.cloudinary.com/xdgeoud6/image';

const UPLOAD = `${CLOUD}/upload/`;

/**
 * What the site shows for a stored photo. Photos uploaded to Cloudinary get
 * their background removed (when `cutout` is on) and are centred on a square,
 * transparent canvas. Photos stored elsewhere are just resized.
 */
export function displayImage(raw: string | null | undefined, cutout: boolean, size = 1000): string {
  if (!raw) return '';
  if (raw.startsWith(UPLOAD)) {
    const rest = raw.slice(UPLOAD.length);
    // already transformed (e.g. the Facebook poster cut-outs) → leave as is
    if (!/^v\d+\//.test(rest) && !rest.startsWith('smartchoice/admin/')) return raw;
    const t = cutout
      ? `e_background_removal/e_trim/c_pad,w_${size},h_${size},b_transparent/f_webp,q_auto`
      : `c_pad,w_${size},h_${size},b_white/f_webp,q_auto`;
    return `${UPLOAD}${t}/${rest}`;
  }
  if (raw.includes('res.cloudinary.com/')) return raw;
  return `${CLOUD}/fetch/c_limit,w_${size}/f_webp,q_auto/${encodeURIComponent(raw)}`;
}

/** Original photo, resized (no background removal). */
export function plainImage(raw: string, size = 1000): string {
  if (raw.startsWith(UPLOAD)) {
    const rest = raw.slice(UPLOAD.length);
    if (/^v\d+\//.test(rest)) return `${UPLOAD}c_limit,w_${size}/f_webp,q_auto/${rest}`;
    return raw;
  }
  if (raw.includes('res.cloudinary.com/')) return raw;
  return `${CLOUD}/fetch/c_limit,w_${size}/f_webp,q_auto/${encodeURIComponent(raw)}`;
}

const MODEL3D = new Set(['ac', 'fridge', 'washer', 'tv']);

/** A JPEG on white for WhatsApp/Facebook link previews (they handle transparent WebP poorly). */
export function previewImage(raw: string | null | undefined, cutout: boolean, size = 800): string {
  return displayImage(raw, cutout, size)
    .replace(/b_transparent/g, 'b_white')
    .replace(/f_webp/g, 'f_jpg')
    .replace(/\.(webp|png)$/i, '.jpg');
}

export function rowToProduct(r: ShopProductRow): Product {
  const main = displayImage(r.image, r.cutout);
  return {
    id: r.id,
    sku: r.model ?? undefined,
    name: r.name,
    brand: r.brand ?? undefined,
    category: r.category,
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    discount: r.discount ?? undefined,
    rating: 0,
    reviews: 0,
    image: main,
    gallery: [main, ...(r.gallery ?? []).map((g) => plainImage(g))].filter(Boolean),
    badge: r.badge ?? undefined,
    unit: r.unit ?? undefined,
    capacity: r.capacity ?? undefined,
    inverter: r.inverter,
    warranty: r.warranty ?? undefined,
    inStock: r.in_stock,
    model3DType: r.model3d_type && MODEL3D.has(r.model3d_type) ? (r.model3d_type as Product['model3DType']) : undefined,
    description: r.description ?? undefined,
    features: r.features ?? [],
    specs: r.specs ?? {},
  };
}

/** Published products for the website (newest edits apply immediately). */
export async function fetchShopProducts(): Promise<Product[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from(TABLE)
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });
  if (error || !data) return null;
  return (data as ShopProductRow[]).map(rowToProduct);
}

/* ───────── admin helpers ───────── */

export async function adminListProducts(): Promise<ShopProductRow[]> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { data, error } = await sb.from(TABLE).select('*').order('sort_order').order('id');
  if (error) throw error;
  return data as ShopProductRow[];
}

export async function adminGetProduct(id: number): Promise<ShopProductRow | null> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { data, error } = await sb.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as ShopProductRow | null;
}

export async function adminSaveProduct(input: ShopProductInput, id?: number): Promise<number> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  if (id) {
    const { error } = await sb.from(TABLE).update(input).eq('id', id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await sb.from(TABLE).insert(input).select('id').single();
  if (error) throw error;
  return (data as { id: number }).id;
}

export async function adminPatchProduct(id: number, patch: Partial<ShopProductInput>) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { error } = await sb.from(TABLE).update(patch).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteProduct(id: number) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { error } = await sb.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/**
 * Upload a photo from the phone/computer; returns its URL.
 * Goes to Cloudinary (so the background can be removed) when the server has
 * Cloudinary keys; otherwise to Supabase Storage.
 */
export async function adminUploadPhoto(file: File): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');

  const { data: sess } = await sb.auth.getSession();
  const token = sess.session?.access_token;
  if (token) {
    const res = await fetch('/api/admin/sign-upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const sig = (await res.json()) as { cloudName: string; apiKey: string; timestamp: number; signature: string; folder: string };
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('signature', sig.signature);
      form.append('folder', sig.folder);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: form });
      const body = (await up.json()) as { secure_url?: string; error?: { message: string } };
      if (!up.ok || !body.secure_url) throw new Error(body.error?.message ?? 'Photo upload failed');
      return body.secure_url;
    }
    if (res.status === 403) throw new Error('This account is not allowed to upload photos.');
    // 501 = Cloudinary keys not set on the server → fall back to Supabase Storage
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return sb.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** True when photos uploaded now can have their background removed. */
export async function adminCanCutout(): Promise<boolean> {
  const res = await fetch('/api/admin/sign-upload', { method: 'GET' });
  return res.ok;
}

export async function adminIsAllowed(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data, error } = await sb.rpc('is_shop_admin');
  if (error) return false;
  return data === true;
}
