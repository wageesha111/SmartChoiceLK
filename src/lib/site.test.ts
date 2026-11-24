import { describe, expect, it } from 'vitest';
import { cartOrderMessage, productUrl } from './site';
import { previewImage } from './shopProducts';

const fmt = (n: number) => `Rs. ${n.toLocaleString('en-LK')}`;

describe('cartOrderMessage', () => {
  it('lists each item with its line total and product link, then the total and pickup note', () => {
    const msg = cartOrderMessage(
      [
        { id: 1, name: 'LG AC', qty: 2, price: 100000 },
        { id: 25, name: 'Haier Fridge', qty: 1, price: 429990 },
      ],
      629990,
      fmt
    );
    expect(msg).toContain('1. LG AC x2 — Rs. 200,000\n' + productUrl(1));
    expect(msg).toContain('2. Haier Fridge x1 — Rs. 429,990\n' + productUrl(25));
    expect(msg).toContain('Total: Rs. 629,990');
    expect(msg).toMatch(/collect it from your shop/);
    expect(msg).not.toMatch(/deliver/i);
  });
});

describe('previewImage', () => {
  it('turns transparent WebP cutouts into JPEG on white for link previews', () => {
    const u = previewImage('https://res.cloudinary.com/xdgeoud6/image/upload/v123/smartchoice/admin/abc.png', true);
    expect(u).toContain('b_white');
    expect(u).toContain('f_jpg');
    expect(u).not.toContain('b_transparent');
    expect(u).not.toContain('f_webp');
    expect(u.endsWith('.jpg')).toBe(true);
  });
});
