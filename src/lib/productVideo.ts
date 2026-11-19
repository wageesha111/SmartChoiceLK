import type { Product, ProductVideoPart } from '@/types';

/**
 * Default "See inside" captions per category, timed to the exploded-view videos
 * described in docs/product-videos.md. A product can override them with video.parts.
 */
export const DEFAULT_PARTS: Record<string, ProductVideoPart[]> = {
  'air-conditioners': [
    { at: 0.08, title: 'Front panel & display', text: 'Slim front cover with the temperature display and air vanes.' },
    { at: 0.28, title: 'Washable dust filter', text: 'Catches dust and pet hair — slide it out and rinse every few weeks.' },
    { at: 0.48, title: 'Evaporator coil', text: 'Copper tubes and aluminium fins that pull heat out of the room air.' },
    { at: 0.68, title: 'Cross-flow fan', text: 'A long, quiet fan that spreads cool air evenly across the room.' },
    { at: 0.86, title: 'Inverter control board', text: 'Adjusts compressor speed smoothly instead of switching on and off — that is where the savings come from.' },
  ],
  refrigerators: [
    { at: 0.1, title: 'Doors & seals', text: 'Magnetic gaskets keep the cold in and the warm air out.' },
    { at: 0.32, title: 'Shelves & crisper', text: 'Adjustable glass shelves and humidity-controlled vegetable drawers.' },
    { at: 0.54, title: 'Multi-airflow vents', text: 'Cold air reaches every shelf, so food cools evenly.' },
    { at: 0.76, title: 'Inverter compressor', text: 'Runs at variable speed — quieter and lighter on the electricity bill.' },
  ],
  'washing-machines': [
    { at: 0.1, title: 'Door & control panel', text: 'Wash programmes, temperature and spin speed at a touch.' },
    { at: 0.34, title: 'Stainless steel drum', text: 'Gentle drum pattern that protects fabrics.' },
    { at: 0.58, title: 'Direct-drive motor', text: 'No belt — fewer moving parts, less noise and vibration.' },
    { at: 0.8, title: 'Pump & filter', text: 'Drains water quickly and catches coins and lint.' },
  ],
  televisions: [
    { at: 0.1, title: 'Panel', text: 'The screen layer that creates sharp, bright images.' },
    { at: 0.36, title: 'Backlight & colour layer', text: 'Even lighting and wide colour for a vivid picture.' },
    { at: 0.62, title: 'Processor board', text: 'Upscales content and runs the smart TV apps.' },
    { at: 0.84, title: 'Speakers & stand', text: 'Built-in sound and a stable stand or wall mount.' },
  ],
};

export function videoParts(product: Product): ProductVideoPart[] {
  return product.video?.parts ?? DEFAULT_PARTS[product.category] ?? [];
}
