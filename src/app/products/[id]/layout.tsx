import type { Metadata } from 'next';
import { previewImage } from '@/lib/shopProducts';
import { SITE } from '@/lib/site';

export const revalidate = 300;

type Row = { id: number; name: string; brand: string | null; price: number; description: string | null; image: string | null; cutout: boolean };

/** One published product straight from Supabase (server side), for link previews. */
async function getProduct(id: string): Promise<Row | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !/^\d+$/.test(id)) return null;
  try {
    const r = await fetch(`${url}/rest/v1/shop_products?select=id,name,brand,price,description,image,cutout&published=eq.true&id=eq.${id}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate },
    });
    if (!r.ok) return null;
    const rows = (await r.json()) as Row[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProduct(params.id);
  if (!p) return { title: `Product — ${SITE.name}` };
  const price = `Rs. ${p.price.toLocaleString('en-LK')}`;
  const title = `${p.name} — ${price} | ${SITE.name}`;
  const description = (p.description || `${p.brand ?? ''} ${p.name} at ${SITE.name}, Raddoluwa – Seeduwa.`).slice(0, 200);
  const image = p.image ? previewImage(p.image, p.cutout) : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: {
      title: `${p.name} — ${price}`,
      description,
      url: `/products/${p.id}`,
      siteName: SITE.name,
      type: 'website',
      images: image ? [{ url: image, width: 800, height: 800, alt: p.name }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: `${p.name} — ${price}`, description, images: image ? [image] : undefined },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
