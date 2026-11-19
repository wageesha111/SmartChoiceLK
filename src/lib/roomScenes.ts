import type { Product } from '@/types';

/** A spec dot on a room photo. x / y are percentages of the *photo* (0–100), not the screen. */
export type Hotspot = { productId: number; specKey: string; x: number; y: number };

export type RoomScene = {
  id: 'ac' | 'washer' | 'fridge' | 'tv';
  eyebrow: string;
  title: string;
  accent: string;
  line: string;
  image: string;
  /** natural pixel size of `image`, used to place hotspots on an object-cover photo */
  size: [number, number];
  /** CSS object-position for the photo */
  focal: string;
  cta: { label: string; href: string };
  hotspots: Hotspot[];
};

export const ROOM_SCENES: RoomScene[] = [
  {
    id: 'ac',
    eyebrow: 'Inverter Air Conditioners',
    title: 'Cool rooms.',
    accent: 'Lower bills.',
    line: 'Inverter ACs delivered and installed across Sri Lanka from our shop in Seeduwa.',
    image: '/appliances/luxury-ac.jpg',
    size: [1376, 768],
    focal: '50% 30%',
    cta: { label: 'See inverter ACs', href: '/products?category=air-conditioners' },
    hotspots: [
      { productId: 1, specKey: 'Cooling Capacity', x: 43, y: 16 },
      { productId: 1, specKey: 'Compressor', x: 59, y: 18 },
    ],
  },
  {
    id: 'washer',
    eyebrow: 'Washing Machines',
    title: 'Cleaner clothes.',
    accent: 'Quieter days.',
    line: 'Inverter direct-drive washers that are gentle on clothes and easy on power.',
    image: '/appliances/luxury-washer.jpg',
    size: [1200, 896],
    focal: '50% 55%',
    cta: { label: 'See washing machines', href: '/products?category=washing-machines' },
    hotspots: [
      { productId: 15, specKey: 'Capacity', x: 52, y: 38 },
      { productId: 15, specKey: 'Motor', x: 51, y: 61 },
    ],
  },
  {
    id: 'fridge',
    eyebrow: 'Refrigerators',
    title: 'Fresher food.',
    accent: 'For longer.',
    line: 'Frost-free and inverter fridges for every kitchen and family size.',
    image: '/appliances/luxury-fridge.jpg',
    size: [1200, 896],
    focal: '50% 45%',
    cta: { label: 'See refrigerators', href: '/products?category=refrigerators' },
    hotspots: [{ productId: 22, specKey: 'Capacity', x: 41, y: 58 }],
  },
  {
    id: 'tv',
    eyebrow: 'Smart TVs',
    title: 'Every match.',
    accent: 'Every movie.',
    line: 'Big, bright smart TVs with brand warranty and wall-mount installation.',
    image: '/appliances/luxury-tv.jpg',
    size: [1376, 768],
    focal: '40% 45%',
    cta: { label: 'See smart TVs', href: '/products?category=televisions' },
    hotspots: [{ productId: 9, specKey: 'Screen Size', x: 36, y: 42 }],
  },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Which scene is active for a 0..1 scroll progress, and how far (0..1) we are towards the next one. */
export function sceneFromProgress(p: number, count: number): { index: number; local: number } {
  const t = clamp01(p) * (count - 1);
  const index = Math.min(count - 1, Math.floor(t + 1e-9));
  return { index, local: index === count - 1 ? 0 : Math.max(0, t - index) };
}

/** "Spec: value" from real product data, or null if the product or spec is missing. */
export function resolveHotspot(h: Hotspot, products: Product[]): string | null {
  const value = products.find((p) => p.id === h.productId)?.specs?.[h.specKey];
  return value ? `${h.specKey}: ${value}` : null;
}

/**
 * Where a photo-relative point lands on screen when the photo is drawn with object-fit: cover
 * and the given object-position percentages. Returns percentages of the stage.
 */
export function coverPoint(
  pt: { x: number; y: number },
  img: [number, number],
  stage: [number, number],
  pos: [number, number]
): { x: number; y: number } {
  const scale = Math.max(stage[0] / img[0], stage[1] / img[1]);
  const w = img[0] * scale;
  const h = img[1] * scale;
  const ox = (stage[0] - w) * (pos[0] / 100);
  const oy = (stage[1] - h) * (pos[1] / 100);
  return { x: ((ox + (pt.x / 100) * w) / stage[0]) * 100, y: ((oy + (pt.y / 100) * h) / stage[1]) * 100 };
}
