'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order } from '@/types';
import { ALL_PRODUCTS } from '@/data/products';

interface StoreContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  wishlist: number[];
  compareList: number[];
  user: User | null;
  orders: Order[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isCompareOpen: boolean;
  isAccountOpen: boolean;
  isCheckoutOpen: boolean;
  isInquiryOpen: boolean;
  inquiryProduct: Product | null;
  selectedQuickViewProduct: Product | null;
  toast: { message: string; emoji: string } | null;

  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsCompareOpen: (open: boolean) => void;
  setIsAccountOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsInquiryOpen: (open: boolean) => void;
  openInquiry: (product?: Product) => void;
  closeInquiry: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  addToCart: (productId: number, qty?: number) => void;
  changeQty: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  toggleCompare: (productId: number) => void;
  clearCompare: () => void;

  showToast: (message: string, emoji?: string) => void;
  login: (user: User) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  selectedOrderForTracking: Order | null;
  setSelectedOrderForTracking: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  reorderItems: (items: CartItem[]) => void;
  triggerHaptic: (type?: 'light' | 'success' | 'remove' | 'warning' | 'error') => void;

  subtotal: number;
  cartCount: number;
  formatLKR: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; emoji: string } | null>(null);

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setProducts(data.data);
      }
    } catch {
      // Fallback silently to ALL_PRODUCTS
      setProducts(ALL_PRODUCTS);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('smartchoice-cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('smartchoice-wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedCompare = localStorage.getItem('smartchoice-compare');
      if (storedCompare) setCompareList(JSON.parse(storedCompare));

      const storedUser = localStorage.getItem('smartchoice-user');
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedOrders = localStorage.getItem('smartchoice-orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (e) {
      console.error('Failed to parse localStorage data', e);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem('smartchoice-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('smartchoice-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('smartchoice-compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('smartchoice-orders', JSON.stringify(orders));
    }
  }, [orders]);

  const triggerHaptic = (type: 'light' | 'success' | 'remove' | 'warning' | 'error' = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'light': navigator.vibrate(8); break;
          case 'success': navigator.vibrate([10, 30, 20]); break;
          case 'remove': navigator.vibrate([20, 15, 10]); break;
          case 'warning': navigator.vibrate([30, 20, 30]); break;
          case 'error': navigator.vibrate([50, 40, 50]); break;
        }
      } catch {
        // Ignore devices blocking vibration
      }
    }
  };

  const showToast = (message: string, emoji = 'âœ¨') => {
    setToast({ message, emoji });
    triggerHaptic('success');
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (productId: number, qty = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });

    showToast(`Added ${product.name.slice(0, 25)}... to cart`, 'ðŸ›’');
  };

  const changeQty = (productId: number, delta: number) => {
    triggerHaptic('light');
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: number) => {
    triggerHaptic('remove');
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart', 'ðŸ—‘ï¸');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: number) => {
    triggerHaptic('light');
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'ðŸ¤');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist', 'â¤ï¸');
        return [...prev, productId];
      }
    });
  };

  const toggleCompare = (productId: number) => {
    triggerHaptic('light');
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from comparison', 'âš–ï¸');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showToast('You can compare maximum 4 appliances at a time', 'âš ï¸');
        return prev;
      }
      showToast('Added to appliance comparison', 'âš–ï¸');
      return [...prev, productId];
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const openQuickView = (product: Product) => {
    setSelectedQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setSelectedQuickViewProduct(null);
  };

  const openInquiry = (product?: Product) => {
    if (product) setInquiryProduct(product);
    setIsInquiryOpen(true);
  };

  const closeInquiry = () => {
    setIsInquiryOpen(false);
    setInquiryProduct(null);
  };

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('smartchoice-user', JSON.stringify(newUser));
    showToast(`Welcome back, ${newUser.name}!`, 'ðŸ‘‹');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartchoice-user');
    showToast('Signed out successfully', 'ðŸ‘‹');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
    showToast(`Order #${order.id} confirmed!`, 'ðŸŽ‰');
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const reorderItems = (items: CartItem[]) => {
    items.forEach((item) => addToCart(item.id, item.qty));
    setIsCartOpen(true);
    showToast('Items added to cart', 'ðŸ›’');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        refreshProducts,
        cart,
        wishlist,
        compareList,
        user,
        orders,
        isCartOpen,
        isWishlistOpen,
        isCompareOpen,
        isAccountOpen,
        isCheckoutOpen,
        isInquiryOpen,
        inquiryProduct,
        selectedQuickViewProduct,
        toast,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsCompareOpen,
        setIsAccountOpen,
        setIsCheckoutOpen,
        setIsInquiryOpen,
        openInquiry,
        closeInquiry,
        openQuickView,
        closeQuickView,
        addToCart,
        changeQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        toggleCompare,
        clearCompare,
        showToast,
        login,
        logout,
        addOrder,
        selectedOrderForTracking,
        setSelectedOrderForTracking,
        updateOrderStatus,
        reorderItems,
        triggerHaptic,
        subtotal,
        cartCount,
        formatLKR,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

