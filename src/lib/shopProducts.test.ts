import { describe, it, expect } from 'vitest';
import { displayImage, plainImage, rowToProduct, type ShopProductRow } from './shopProducts';

const UP = 'https://res.cloudinary.com/xdgeoud6/image/upload/';

describe('displayImage', () => {
  it('removes the background from photos uploaded in /admin', () => {
    expect(displayImage(`${UP}v1700/smartchoice/admin/abc.jpg`, true, 500)).toBe(
      `${UP}e_background_removal/e_trim/c_pad,w_500,h_500,b_transparent/f_webp,q_auto/v1700/smartchoice/admin/abc.jpg`
    );
  });
  it('keeps the photo as is when cut-out is off', () => {
    expect(displayImage(`${UP}v1700/smartchoice/admin/abc.jpg`, false, 500)).toBe(
      `${UP}c_pad,w_500,h_500,b_white/f_webp,q_auto/v1700/smartchoice/admin/abc.jpg`
    );
  });
  it('leaves already-transformed catalog cut-outs alone', () => {
    const u = `${UP}e_extract:prompt_tv/e_trim/f_webp/smartchoice/posts/1`;
    expect(displayImage(u, true)).toBe(u);
  });
  it('resizes photos stored outside Cloudinary without trying to cut them out', () => {
    const raw = 'https://x.supabase.co/storage/v1/object/public/product-photos/uploads/a.jpg';
    expect(displayImage(raw, true, 300)).toBe(
      `https://res.cloudinary.com/xdgeoud6/image/fetch/c_limit,w_300/f_webp,q_auto/${encodeURIComponent(raw)}`
    );
  });
  it('returns empty for no photo', () => {
    expect(displayImage(null, true)).toBe('');
  });
});

describe('rowToProduct', () => {
  it('maps a database row to a site product', () => {
    const row: ShopProductRow = {
      id: 30, name: 'Test TV', brand: 'LG', category: 'televisions', model: 'X1', price: 100000,
      original_price: 125000, discount: 20, badge: null, capacity: '55 inch', unit: null, warranty: '1 year',
      inverter: false, in_stock: false, published: true, image: `${UP}v1/smartchoice/admin/t.jpg`, cutout: true,
      gallery: [`${UP}v1/smartchoice/admin/t2.jpg`], description: null, features: ['A'], specs: { 'Screen Size': '55 inch' },
      model3d_type: 'tv', sort_order: 0,
    };
    const p = rowToProduct(row);
    expect(p.sku).toBe('X1');
    expect(p.inStock).toBe(false);
    expect(p.originalPrice).toBe(125000);
    expect(p.gallery?.length).toBe(2);
    expect(p.gallery?.[1]).toBe(plainImage(`${UP}v1/smartchoice/admin/t2.jpg`));
    expect(p.model3DType).toBe('tv');
    expect(p.reviews).toBe(0);
  });
});
