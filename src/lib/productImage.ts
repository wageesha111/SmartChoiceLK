/**
 * Product photos come from Smart Choice LK's own Facebook posts, stored in
 * Cloudinary under `smartchoice/posts/<facebook photo id>`.
 *
 * The posters have prices, icons and text around the product, so we ask
 * Cloudinary to cut out only the product (`e_extract`), trim the empty
 * edges and centre it on a square, transparent canvas.
 */
const CLOUD = 'https://res.cloudinary.com/xdgeoud6/image/upload';

export type CutoutSubject =
  | 'air conditioner'
  | 'television'
  | 'washing machine'
  | 'refrigerator'
  | 'mini fridge'
  | 'water heater';

/** What to ask the extractor for. "television" is rejected by Cloudinary, "tv" works. */
const PROMPT: Record<CutoutSubject, string> = {
  'air conditioner': 'air conditioner',
  television: 'tv',
  'washing machine': 'washing machine',
  refrigerator: 'refrigerator',
  'mini fridge': 'mini fridge',
  'water heater': 'water heater',
};

/**
 * Clean cut-out of the product only.
 * `crop` (a Cloudinary crop step) narrows the poster first, e.g. when it also
 * shows an outdoor unit and we only want the indoor one.
 */
export function productCutout(postId: string, subject: CutoutSubject, size = 1000, crop?: string): string {
  const prompt = encodeURIComponent(PROMPT[subject]);
  const pre = crop ? `${crop}/` : '';
  return `${CLOUD}/${pre}e_extract:prompt_${prompt}/e_trim/c_pad,w_${size},h_${size},b_transparent/f_webp,q_auto/smartchoice/posts/${postId}`;
}

/** The original Facebook poster (with price and details), for reference. */
export function productPoster(postId: string, size = 1000): string {
  return `${CLOUD}/c_limit,w_${size}/f_webp,q_auto/smartchoice/posts/${postId}`;
}
