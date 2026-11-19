export interface Product {
  id: number;
  sku?: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  emoji?: string;
  image: string;
  gallery?: string[];
  badge?: string;
  unit?: string;
  capacity?: string;
  energyRating?: number;
  inverter?: boolean;
  warranty?: string;
  inStock?: boolean;
  stockCount?: number;
  has3D?: boolean;
  model3DType?: 'ac' | 'fridge' | 'washer' | 'tv';
  description?: string;
  features?: string[];
  specs?: Record<string, string>;
  deliveryInfo?: string;
  /** Product video (e.g. an exploded view made with Google Flow). Plays first on the product page. */
  video?: ProductVideo;
}

export interface ProductVideoPart {
  /** 0–1: how far through the video this part is shown */
  at: number;
  title: string;
  text: string;
}

export interface ProductVideo {
  /** e.g. /videos/lg-dualcool-12000.mp4 (put the file in public/videos/) */
  src: string;
  /** still image shown before the video loads, e.g. /videos/lg-dualcool-12000.jpg */
  poster?: string;
  /** captions for the scroll "See inside" section; defaults per category if omitted */
  parts?: ProductVideoPart[];
}

export interface Review {
  id: string;
  productId?: number;
  productName?: string;
  author: string;
  avatar?: string;
  district?: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  verified?: boolean;
  verifiedPurchase?: boolean;
}

export interface CartItem extends Product {
  qty: number;
}

export interface User {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
  slot?: string;
  status: 'Processing' | 'Out for Delivery' | 'Delivered' | string;
  address?: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
  paymentMethod?: string;
  promoDiscount?: number;
  deliveryFee?: number;
}

export interface Category {
  id: string;
  name: string;
  subtitle?: string;
  icon: string;
  image: string;
  count: number;
  badge?: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Replied' | 'Resolved';
}
