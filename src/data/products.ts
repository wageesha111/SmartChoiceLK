import { Product, Category, Review } from '@/types';
import { CATALOG } from './catalog';

export const CATEGORIES: Category[] = [
  {
    id: 'air-conditioners',
    name: 'Air Conditioners',
    subtitle: 'Dual Inverter Split & Smart WiFi Cooling',
    icon: '❄️',
    image: 'https://res.cloudinary.com/xdgeoud6/image/upload/c_fill,w_1000,h_1080,g_north,f_auto,q_auto/smartchoice/categories/ac.jpg',
    brands: ['Abans', 'LG', 'Haier'],
    focus: '50% 22%',
    count: 5,
    badge: 'Up to 65% Energy Saving',
  },
  {
    id: 'refrigerators',
    name: 'Refrigerators & Freezers',
    subtitle: 'Side-by-Side, French Door & Frost-Free',
    icon: '🧊',
    image: 'https://res.cloudinary.com/xdgeoud6/image/upload/c_fill,w_960,h_704,f_auto,q_auto/smartchoice/categories/fridge.jpg',
    brands: ['LG', 'Samsung', 'Abans', 'Haier', 'Whirlpool'],
    focus: '50% 45%',
    count: 2,
    badge: '10-Yr Compressor Warranty',
  },
  {
    id: 'washing-machines',
    name: 'Washing Machines & Dryers',
    subtitle: 'AI Front Load, Top Load & Combos',
    icon: '🌀',
    image: 'https://res.cloudinary.com/xdgeoud6/image/upload/c_fill,w_960,h_704,f_auto,q_auto/smartchoice/categories/washer.jpg',
    brands: ['LG', 'Abans', 'Whirlpool', 'Haier', 'Electrolux'],
    focus: '50% 45%',
    count: 9,
    badge: 'Steam Hygiene Care',
  },
  {
    id: 'televisions',
    name: 'Televisions & Audio',
    subtitle: '4K QLED, OLED & Dolby Atmos Soundbars',
    icon: '📺',
    image: 'https://res.cloudinary.com/xdgeoud6/image/upload/c_fill,w_1600,h_640,f_auto,q_auto/smartchoice/categories/tv.jpg',
    brands: ['Abans', 'LG', 'Samsung', 'Sony'],
    focus: '50% 50%',
    count: 7,
    badge: 'Cinematic Experience',
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Built-in Cooking',
    subtitle: 'Induction Hobs, Inverter Microwaves & Airfryers',
    icon: '🍳',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    count: 0,
    badge: 'Smart Chef Series',
  },
  {
    id: 'small-appliances',
    name: 'Water Heaters & More',
    subtitle: 'Instant water heaters & small appliances',
    icon: '💧',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    count: 1,
    badge: 'Health & Pure Living',
  },
];

/** Real products from the Smart Choice LK Facebook page — see src/data/catalog.ts. */
export const ALL_PRODUCTS: Product[] = CATALOG;

/** Add real customer reviews here (e.g. from the Facebook page). */
export const REVIEWS_DATA: Review[] = [];

export const BRANDS = ['All Brands', ...Array.from(new Set(CATALOG.map((p) => p.brand).filter(Boolean) as string[]))];

export const FAQ_ITEMS = [
  {
    question: 'Are all appliances sold by Smart Choice LK 100% genuine and authorized?',
    answer: 'Yes, every appliance sold at Smart Choice LK is 100% genuine, brand-new, and comes with authorized manufacturer agent warranties (including 10 to 20-year compressor and motor warranties on inverter models). Official warranty cards are issued upon delivery.',
  },
  {
    question: 'How does islandwide delivery and installation work in Sri Lanka?',
    answer: 'We provide same-day or next-day express delivery across Colombo and Gampaha districts, and 2-3 business days delivery to all 25 districts across Sri Lanka. For Air Conditioners and large appliances, professional certified installation by trained technicians can be scheduled upon checkout.',
  },
  {
    question: 'What payment methods and installment options are available?',
    answer: 'We accept Cash on Delivery (COD) in eligible areas, Credit & Debit Cards (Visa, MasterCard), Online Bank Transfers, and 0% interest credit card installment plans up to 36 months with leading Sri Lankan commercial banks.',
  },
  {
    question: 'How much can I save on my electricity bill by switching to an Inverter appliance?',
    answer: 'Smart Inverter appliances dynamically adjust motor and compressor speeds rather than constantly switching on and off at full power. A 5-Star Inverter Air Conditioner or Refrigerator typically saves between 50% and 65% on electricity compared to non-inverter models.',
  },
];

