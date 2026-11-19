import { getSupabase } from './supabase';

/* ───────── customer messages (contact form) ───────── */

export type InquiryStatus = 'new' | 'read' | 'done';

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  topic: string | null;
  town: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}

export type InquiryInput = Pick<Inquiry, 'name' | 'phone' | 'topic' | 'town' | 'message'>;

const clip = (s: string | null | undefined, n: number) => {
  const t = (s ?? '').trim();
  return t ? t.slice(0, n) : null;
};

/** Saves a contact-form message. Returns false when Supabase isn't configured or the save fails. */
export async function sendInquiry(input: InquiryInput): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from('shop_inquiries').insert({
    name: clip(input.name, 100),
    phone: clip(input.phone, 30),
    topic: clip(input.topic, 80),
    town: clip(input.town, 80),
    message: clip(input.message, 2000),
  });
  return !error;
}

export async function adminListInquiries(): Promise<Inquiry[]> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { data, error } = await sb.from('shop_inquiries').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) throw error;
  return data as Inquiry[];
}

export async function adminSetInquiryStatus(id: number, status: InquiryStatus) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { error } = await sb.from('shop_inquiries').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteInquiry(id: number) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { error } = await sb.from('shop_inquiries').delete().eq('id', id);
  if (error) throw error;
}

/* ───────── product reviews ───────── */

export interface Review {
  id: number;
  product_id: number;
  name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
}

export interface RatingSummary {
  rating: number;
  reviews: number;
}

/** Average rating (1 decimal) and count per product, from approved reviews only. */
export function summarizeRatings(rows: Pick<Review, 'product_id' | 'rating'>[]): Map<number, RatingSummary> {
  const acc = new Map<number, { sum: number; n: number }>();
  for (const r of rows) {
    const a = acc.get(r.product_id) ?? { sum: 0, n: 0 };
    a.sum += r.rating;
    a.n += 1;
    acc.set(r.product_id, a);
  }
  const out = new Map<number, RatingSummary>();
  acc.forEach((a, id) => out.set(id, { rating: Math.round((a.sum / a.n) * 10) / 10, reviews: a.n }));
  return out;
}

export async function fetchRatingSummaries(): Promise<Map<number, RatingSummary>> {
  const sb = getSupabase();
  if (!sb) return new Map();
  const { data, error } = await sb.from('shop_reviews').select('product_id, rating').eq('approved', true);
  if (error || !data) return new Map();
  return summarizeRatings(data as Pick<Review, 'product_id' | 'rating'>[]);
}

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('shop_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data as Review[];
}

export async function submitReview(input: { product_id: number; name: string; rating: number; comment: string }): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const { error } = await sb.from('shop_reviews').insert({
    product_id: input.product_id,
    name: clip(input.name, 60),
    rating,
    comment: clip(input.comment, 1500),
  });
  return !error;
}

export async function adminListReviews(): Promise<Review[]> {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { data, error } = await sb.from('shop_reviews').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) throw error;
  return data as Review[];
}

export async function adminSetReviewApproved(id: number, approved: boolean) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { error } = await sb.from('shop_reviews').update({ approved }).eq('id', id);
  if (error) throw error;
}

export async function adminDeleteReview(id: number) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase is not configured');
  const { error } = await sb.from('shop_reviews').delete().eq('id', id);
  if (error) throw error;
}

/** Counts for the admin sidebar badges and dashboard. */
export async function adminPendingCounts(): Promise<{ messages: number; reviews: number }> {
  const sb = getSupabase();
  if (!sb) return { messages: 0, reviews: 0 };
  const [m, r] = await Promise.all([
    sb.from('shop_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    sb.from('shop_reviews').select('id', { count: 'exact', head: true }).eq('approved', false),
  ]);
  return { messages: m.count ?? 0, reviews: r.count ?? 0 };
}
