export interface SmartChoiceProduct {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeType?: 'new' | 'discount' | 'sale';
  tab: 'inverters' | 'new' | 'deals';
  rating: number;
  reviews: number;
  warranty: string;
  inverter: boolean;
  specs: string[];
  description: string;
}

export const SMARTCHOICE_PRODUCTS: SmartChoiceProduct[] = [
  {
    id: 1,
    sku: 'SCLK-AC-LG12',
    name: 'LG DUALCOOL 12,000 BTU Dual Inverter Air Conditioner',
    brand: 'LG',
    category: 'Air Conditioners',
    price: 198500,
    originalPrice: 235000,
    image: '/appliances/luxury-ac.jpg',
    badge: '-16%',
    badgeType: 'discount',
    tab: 'inverters',
    rating: 4.9,
    reviews: 42,
    inverter: true,
    warranty: '10 Years Compressor / 1 Year Agent Warranty',
    description:
      'Engineered for Sri Lankan tropical weather. Dual Inverter Compressor delivers rapid cooling while saving up to 65% electricity. Features Ocean Black Fin anti-corrosion coating and ThinQ Wi-Fi control.',
    specs: [
      '12,000 BTU (1.0 Ton) Cooling Capacity',
      'Dual Inverter Compressor (Up to 65% Power Saving)',
      'Ocean Black Fin Coastal Anti-Corrosion Protection',
      'LG ThinQ Wi-Fi App Remote Control & Diagnosis',
    ],
  },
  {
    id: 2,
    sku: 'SCLK-RF-SAM680',
    name: 'Samsung SpaceMaxâ„¢ 680L Side-by-Side Inverter Refrigerator',
    brand: 'Samsung',
    category: 'Refrigerators',
    price: 445000,
    originalPrice: 495000,
    image: '/appliances/luxury-fridge.jpg',
    badge: 'SALE',
    badgeType: 'sale',
    tab: 'inverters',
    rating: 4.9,
    reviews: 31,
    inverter: true,
    warranty: '20 Years Digital Inverter Compressor Warranty',
    description:
      'Spacious 680L capacity with SpaceMaxâ„¢ high-efficiency thin walls. Multi-vent All-Around Cooling maintains steady temperature on all shelves. Gentle matte black stainless finish.',
    specs: [
      '680 Litres Net Storage Capacity',
      'Digital Inverter (7-Speed Auto Adjustment)',
      'All-Around Cooling Even Temperature Distribution',
      'Power Freeze & Power Cool Instant Chilling',
    ],
  },
  {
    id: 3,
    sku: 'SCLK-WM-LG09',
    name: 'LG AI DDâ„¢ 9.0kg Front Load Steam Inverter Washing Machine',
    brand: 'LG',
    category: 'Washing Machines',
    price: 268000,
    originalPrice: 305000,
    image: '/appliances/luxury-washer.jpg',
    badge: 'NEW',
    badgeType: 'new',
    tab: 'inverters',
    rating: 4.9,
    reviews: 53,
    inverter: true,
    warranty: '10 Years Direct Drive Motor Warranty',
    description:
      'AI Direct Drive detects fabric weight and softness to choose optimal wash motions automatically. LG Steam Allergy Care removes 99.9% of dust mites and allergens.',
    specs: [
      '9.0kg Capacity / 1400 RPM High Spin Speed',
      'AI DDâ„¢ 18% Enhanced Fabric Protection',
      'Steamâ„¢ Allergy Care Hygiene Wash',
      'TurboWashâ„¢ 39-Minute Quick Cleaning Cycle',
    ],
  },
  {
    id: 4,
    sku: 'SCLK-TV-SON65',
    name: 'Sony BRAVIA XR 65" 4K OLED Smart Google TV (Cognitive XR)',
    brand: 'Sony',
    category: 'Televisions & Audio',
    price: 495000,
    originalPrice: 560000,
    image: '/appliances/luxury-tv.jpg',
    badge: '120Hz OLED',
    badgeType: 'new',
    tab: 'new',
    rating: 5.0,
    reviews: 28,
    inverter: false,
    warranty: '3 Years Authorized Agent Warranty',
    description:
      'Powered by Cognitive Processor XRâ„¢. Self-illuminating OLED pixels provide pure blacks and vibrant colors. Acoustic Surface Audio+ vibrates the glass screen for theater-grade direct sound.',
    specs: [
      '65-Inch 4K OLED Display (3840 x 2160)',
      'Cognitive Processor XRâ„¢ Picture & Sound Engine',
      'Acoustic Surface Audio+ Direct Sound',
      'Google TV with Voice Search & HDMI 2.1 120Hz',
    ],
  },
  {
    id: 5,
    sku: 'SCLK-AC-DAI18',
    name: 'Daikin 18,000 BTU Super Inverter Split Air Conditioner',
    brand: 'Daikin',
    category: 'Air Conditioners',
    price: 289000,
    originalPrice: 325000,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=85',
    badge: '-11%',
    badgeType: 'discount',
    tab: 'new',
    rating: 4.8,
    reviews: 24,
    inverter: true,
    warranty: '10 Years Compressor / 1 Year Parts',
    description:
      'Japanese engineering leader Daikin FTKM series delivers rapid cooling with Coanda airflow that sweeps ceiling breezes evenly across large living areas without uncomfortable cold drafts.',
    specs: [
      '18,000 BTU (1.5 Ton) Heavy Duty Cooling',
      'Intelligent Eye Infrared Human Presence Sensor',
      'Titanium Apatite Photocatalytic Air Purifier',
      'Blue Fin Anti-Corrosion Outdoor Condenser',
    ],
  },
  {
    id: 6,
    sku: 'SCLK-RF-PAN380',
    name: 'Panasonic PrimeFresh 380L Bottom Freezer Inverter Refrigerator',
    brand: 'Panasonic',
    category: 'Refrigerators',
    price: 245000,
    originalPrice: 275000,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=85',
    badge: 'SALE',
    badgeType: 'sale',
    tab: 'deals',
    rating: 4.8,
    reviews: 24,
    inverter: true,
    warranty: '10 Years Inverter Compressor Warranty',
    description:
      'PrimeFresh -3Â°C soft freezes meat and fish lightly, preserving nutrients and flavor without needing tedious defrosting. ECONAVI sensors automatically optimize power use based on room lighting and temperature.',
    specs: [
      '380 Litres Net Capacity with Ergonomic Bottom Freezer',
      'PrimeFresh -3Â°C Soft Freezing Technology',
      'Ag Clean Antibacterial Silver Ion 99.9% Deodorizer',
      'ECONAVI Multi-Sensor Intelligent Energy Saving',
    ],
  },
  {
    id: 7,
    sku: 'SCLK-WM-SAM85',
    name: 'Samsung EcoBubbleâ„¢ 8.5kg Front Load Inverter Washer',
    brand: 'Samsung',
    category: 'Washing Machines',
    price: 238000,
    originalPrice: 265000,
    image: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=900&q=85',
    badge: 'NEW',
    badgeType: 'new',
    tab: 'deals',
    rating: 4.8,
    reviews: 34,
    inverter: true,
    warranty: '20 Years Digital Inverter Motor Warranty',
    description:
      'EcoBubbleâ„¢ froths detergent into micro-bubbles that penetrate fabrics quickly for deeper stain removal at lower temperatures, saving electricity and protecting delicate fabrics.',
    specs: [
      '8.5kg Capacity / 1400 RPM Spin',
      'EcoBubbleâ„¢ Power Wash Technology',
      'Hygiene Steam Deep Sanitization Cycle',
      'Drum Clean+ 99.9% Bacteria Elimination',
    ],
  },
  {
    id: 8,
    sku: 'SCLK-KT-PHIXXL',
    name: 'Philips Inverter XXL 7.2L Connected Digital Airfryer',
    brand: 'Philips',
    category: 'Kitchen Appliances',
    price: 62500,
    originalPrice: 75000,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85',
    badge: '-17%',
    badgeType: 'discount',
    tab: 'deals',
    rating: 4.9,
    reviews: 67,
    inverter: true,
    warranty: '2 Years Comprehensive International Warranty',
    description:
      'Twin TurboStar technology removes excess fat while cooking crispy, tender meals for the whole family. Includes 16-in-1 cooking functions, NutriU smart recipe app connectivity, and quick clean basket.',
    specs: [
      '7.2 Litres XXL Family Size Basket',
      'Rapid CombiAir Inverter Heat Circulation',
      'Twin TurboStar Fat Removal Technology',
      'NutriU Smartphone Recipe Connectivity',
    ],
  },
];

export const SMARTCHOICE_OFFERS = [
  {
    id: 101,
    title: 'LG DUALCOOL 18,000 BTU Inverter Air Conditioner',
    category: 'Air Conditioners',
    price: 289000,
    originalPrice: 325000,
    image: '/appliances/luxury-ac.jpg',
    specs: [
      'Up to 65% Electricity Saving with Dual Inverter',
      'Ocean Black Fin anti-corrosion condenser for coastal zones',
      'Built-in Wi-Fi ThinQ mobile app control',
      'Free standard 3-meter copper piping installation kit',
    ],
  },
  {
    id: 102,
    title: 'Samsung SpaceMaxâ„¢ 680L Side-by-Side Refrigerator',
    category: 'Refrigerators',
    price: 445000,
    originalPrice: 495000,
    image: '/appliances/luxury-fridge.jpg',
    specs: [
      '20-Year Manufacturer Warranty on Digital Inverter Motor',
      'SpaceMaxâ„¢ technology with thinner high-efficiency walls',
      'All-Around Cooling multi-vent steady airflow',
      'Deodorizing active carbon filter with odor elimination',
    ],
  },
];

export const SMARTCHOICE_TESTIMONIALS = [
  {
    id: 1,
    name: 'Dilshan Perera',
    role: 'Verified Customer â€” Colombo 05',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote:
      'Installed two LG Dual Inverter ACs through Smart Choice LK for our apartment in Colombo. The installation team was certified and used genuine copper piping with vacuum pumps. Our monthly electricity bill dropped by over 40% even running every night!',
  },
  {
    id: 2,
    name: 'Nimesha Fernando',
    role: 'Verified Customer â€” Kandy',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote:
      'Purchased our Samsung 680L French Door Refrigerator from Smart Choice LK. Delivery to Kandy was super safe and right on schedule. The team helped unbox, level, and verified the official agent 20-year warranty card on the spot. Highly recommended!',
  },
];

export const SMARTCHOICE_BRANDS = [
  { name: 'LG', label: 'LG Electronics' },
  { name: 'SAMSUNG', label: 'Samsung' },
  { name: 'DAIKIN', label: 'Daikin Air Conditioning' },
  { name: 'PANASONIC', label: 'Panasonic' },
  { name: 'SONY', label: 'Sony Bravia' },
  { name: 'BOSCH', label: 'Bosch Home Appliances' },
  { name: 'PHILIPS', label: 'Philips Domestic' },
];

export const SMARTCHOICE_BLOGS = [
  {
    id: 1,
    title: 'How to Choose the Right BTU Air Conditioner for Your Room in Sri Lanka',
    date: '18 October 2024',
    author: 'Smart Choice Tech Team',
    image: '/appliances/luxury-ac.jpg',
    excerpt:
      'Calculate exact BTU capacity factoring in ceiling height, direct sunlight, and glass windows to maximize cooling speed while slashing energy consumption.',
  },
  {
    id: 2,
    title: 'Inverter vs Non-Inverter Refrigerators: Real Electricity Bill Comparison',
    date: '12 October 2024',
    author: 'Energy Efficiency Advisor',
    image: '/appliances/luxury-fridge.jpg',
    excerpt:
      'A comprehensive 12-month power meter test showing how modern linear inverter compressors adjust speeds continuously to save thousands of rupees annually.',
  },
  {
    id: 3,
    title: 'Front Load vs Top Load: Which Washing Machine Lasts Longer in Tropical Climates?',
    date: '05 October 2024',
    author: 'Appliance Care Specialist',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'Compare water savings, spin RPM, steam hygiene cycles, and hard-water resistance to select the ideal washing machine for your family.',
  },
];

export function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

