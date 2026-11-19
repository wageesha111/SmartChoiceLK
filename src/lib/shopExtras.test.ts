import { describe, expect, it } from 'vitest';
import { summarizeRatings } from './shopExtras';

describe('summarizeRatings', () => {
  it('averages per product to one decimal and counts reviews', () => {
    const m = summarizeRatings([
      { product_id: 1, rating: 5 },
      { product_id: 1, rating: 4 },
      { product_id: 1, rating: 4 },
      { product_id: 2, rating: 3 },
    ]);
    expect(m.get(1)).toEqual({ rating: 4.3, reviews: 3 });
    expect(m.get(2)).toEqual({ rating: 3, reviews: 1 });
    expect(m.has(3)).toBe(false);
  });

  it('returns an empty map for no reviews', () => {
    expect(summarizeRatings([]).size).toBe(0);
  });
});
