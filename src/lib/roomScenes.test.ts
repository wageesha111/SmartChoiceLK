import { describe, it, expect } from 'vitest';
import { ROOM_SCENES, sceneFromProgress, resolveHotspot, coverPoint } from './roomScenes';
import { ALL_PRODUCTS } from '@/data/products';

describe('sceneFromProgress', () => {
  it('maps the ends and boundaries to whole scenes', () => {
    expect(sceneFromProgress(0, 4)).toEqual({ index: 0, local: 0 });
    expect(sceneFromProgress(1 / 3, 4)).toEqual({ index: 1, local: 0 });
    expect(sceneFromProgress(2 / 3, 4).index).toBe(2);
    expect(sceneFromProgress(1, 4)).toEqual({ index: 3, local: 0 });
  });
  it('reports progress between scenes', () => {
    const r = sceneFromProgress(1 / 6, 4);
    expect(r.index).toBe(0);
    expect(r.local).toBeCloseTo(0.5);
  });
  it('clamps out-of-range input', () => {
    expect(sceneFromProgress(-0.2, 4)).toEqual({ index: 0, local: 0 });
    expect(sceneFromProgress(1.4, 4)).toEqual({ index: 3, local: 0 });
  });
});

describe('ROOM_SCENES', () => {
  it('has the four rooms in order', () => {
    expect(ROOM_SCENES.map((s) => s.id)).toEqual(['ac', 'washer', 'fridge', 'tv']);
  });
  it('every hotspot resolves to real product data (no invented numbers)', () => {
    for (const s of ROOM_SCENES) {
      expect(s.hotspots.length).toBeGreaterThan(0);
      for (const h of s.hotspots) expect(resolveHotspot(h, ALL_PRODUCTS)).not.toBeNull();
    }
  });
});

describe('resolveHotspot', () => {
  it('returns null for a missing spec instead of "undefined"', () => {
    expect(resolveHotspot({ productId: 1, specKey: 'Nope', x: 0, y: 0 }, ALL_PRODUCTS)).toBeNull();
    expect(resolveHotspot({ productId: 99999, specKey: 'Capacity', x: 0, y: 0 }, ALL_PRODUCTS)).toBeNull();
  });
  it('formats a real spec', () => {
    expect(resolveHotspot({ productId: 1, specKey: 'Energy Efficiency', x: 0, y: 0 }, ALL_PRODUCTS)).toBe(
      'Energy Efficiency: 5-Star Inverter Rating'
    );
  });
});

describe('coverPoint', () => {
  it('is the identity when stage and photo share an aspect ratio', () => {
    expect(coverPoint({ x: 30, y: 70 }, [1200, 800], [600, 400], [50, 50])).toEqual({ x: 30, y: 70 });
  });
  it('accounts for horizontal cropping on a tall (phone) stage', () => {
    // 2:1 photo on a 1:1 stage, centred: only the middle half is visible
    const p = coverPoint({ x: 50, y: 50 }, [200, 100], [100, 100], [50, 50]);
    expect(p.x).toBeCloseTo(50);
    expect(coverPoint({ x: 25, y: 0 }, [200, 100], [100, 100], [50, 50]).x).toBeCloseTo(0);
  });
});
