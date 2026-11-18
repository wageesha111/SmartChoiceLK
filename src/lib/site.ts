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
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Smart+Choice+LK+Raddoluwa+Seeduwa',
  facebookFollowers: '990+',
  facebookRecommend: '100%',
};

export function whatsappLink(message = `Hello ${SITE.name}! I'd like to know more about your appliances.`) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
