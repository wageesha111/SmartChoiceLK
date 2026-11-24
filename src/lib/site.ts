import { SITE_URL } from './siteUrl';

// Central business details for Smart Choice LK.
// Update these in ONE place and every page (navbar, footer, WhatsApp buttons) follows.

export const SITE = {
  name: 'Smart Choice LK',
  tagline: 'Choose Smart. Live Better.',
  description: 'Your one-stop shop for high-quality home electronics.',
  phoneDisplay: '076 646 7854',
  phoneTel: '+94766467854',
  whatsappNumber: '94766467854',
  email: 'thesmartchoicelanka@gmail.com',
  address: 'Raddoluwa, Seeduwa, Sri Lanka',
  hours: 'Open 7 days',
  facebook: 'https://www.facebook.com/smartchoicelkofficial',
  instagram: 'https://www.instagram.com/smartchoicelanka',
  instagramHandle: '@smartchoicelanka',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Smart+Choice+LK+Raddoluwa+Seeduwa',
  facebookFollowers: '990+',
  facebookRecommend: '100%',
};

export function whatsappLink(message = `Hello ${SITE.name}! I'd like to know more about your appliances.`) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Public link to a product page (WhatsApp shows its photo as a link preview). */
export function productUrl(id: number) {
  return `${SITE_URL}/products/${id}`;
}

/** The WhatsApp order text for a cart: each item with its price and a link to its photo/page. */
export function cartOrderMessage(
  items: { id: number; name: string; qty: number; price: number }[],
  subtotal: number,
  formatLKR: (n: number) => string
) {
  const lines = items.map((it, i) => `${i + 1}. ${it.name} x${it.qty} — ${formatLKR(it.price * it.qty)}\n${productUrl(it.id)}`);
  return `Hello ${SITE.name}! I'd like to order:\n\n${lines.join('\n\n')}\n\nTotal: ${formatLKR(subtotal)}\n\nPlease confirm stock. I'll collect it from your shop in Raddoluwa, Seeduwa.`;
}
