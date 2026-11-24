'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/context/StoreContext';
import { SITE, whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from '@/components/FloatingActions';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  ArrowUpRight,
  Snowflake,
  Refrigerator,
  WashingMachine,
  Tv,
  CookingPot,
  LayoutGrid,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', url: '/' },
  { name: 'Shop', url: '/products' },
  { name: 'ACs', url: '/products?category=air-conditioners', cat: 'air-conditioners' },
  { name: 'Fridges', url: '/products?category=refrigerators', cat: 'refrigerators' },
  { name: 'Washers', url: '/products?category=washing-machines', cat: 'washing-machines' },
  { name: 'TVs', url: '/products?category=televisions', cat: 'televisions' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
];

const QUICK_CATS = [
  { name: 'Air Conditioners', url: '/products?category=air-conditioners', icon: Snowflake },
  { name: 'Refrigerators', url: '/products?category=refrigerators', icon: Refrigerator },
  { name: 'Washing Machines', url: '/products?category=washing-machines', icon: WashingMachine },
  { name: 'Televisions', url: '/products?category=televisions', icon: Tv },
  { name: 'Kitchen', url: '/products?category=kitchen', icon: CookingPot },
  { name: 'All Products', url: '/products', icon: LayoutGrid },
];

const ANNOUNCEMENTS = [
  'Visit & collect at our Seeduwa shop',
  `Call or WhatsApp ${SITE.phoneDisplay}`,
  'Genuine products with brand warranty',
  'Easy installment plans available',
  `Visit us at ${SITE.address}`,
  `${SITE.facebookRecommend} recommended on Facebook`,
  `Follow us on Instagram ${SITE.instagramHandle}`,
];

function useActiveLink() {
  const pathname = usePathname();
  const params = useSearchParams();
  return (link: (typeof NAV_LINKS)[number]) => {
    if (link.url === '/') return pathname === '/';
    if (link.cat) return pathname?.startsWith('/products') && params?.get('category') === link.cat;
    if (link.url === '/products') return pathname?.startsWith('/products') && !params?.get('category');
    return pathname === link.url;
  };
}

function NavInner() {
  const router = useRouter();
  const isActive = useActiveLink();
  const { cartCount, wishlist, setIsCartOpen, setIsWishlistOpen } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?query=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const iconBtn =
    'relative grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white';

  return (
    <>
      {/* Announcement marquee */}
      <div className="sc-announce relative z-[60] overflow-hidden border-b border-white/10 bg-ink text-[12.5px] font-medium text-white/70">
        <div className="flex w-max animate-marquee gap-10 py-2">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span>{t}</span>
              <span className="h-1 w-1 rounded-full bg-electric" />
            </span>
          ))}
        </div>
      </div>

      {/* Sticky glass header */}
      <header className="sc-header sticky top-0 z-[50] px-3 pt-3 sm:px-5">
        <div
          className={`mx-auto flex h-16 max-w-[1280px] items-center gap-3 rounded-2xl border px-3 transition-all duration-500 sm:px-4 ${
            scrolled
              ? 'border-white/10 bg-ink/80 shadow-[0_20px_50px_-20px_rgba(5,11,26,0.8)] backdrop-blur-xl'
              : 'border-white/[0.07] bg-ink-800/95 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${SITE.name} home`}>
            <span className="grid h-10 w-12 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-700 shadow-[0_0_24px_-4px_rgba(47,107,255,0.8)]">
              <img src="/brand/sc-mark-white.png" alt="" className="h-5 w-auto" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[17px] font-bold tracking-tight text-white">
                Smart Choice<span className="text-electric-400"> LK</span>
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {SITE.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                    active ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-white/10 ring-1 ring-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search">
              <Search className="h-[19px] w-[19px]" />
            </button>
            <button onClick={() => setIsWishlistOpen(true)} className={iconBtn} aria-label="Wishlist">
              <Heart className="h-[19px] w-[19px]" fill={wishlist.length ? 'currentColor' : 'none'} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className={iconBtn} aria-label="Cart">
              <ShoppingBag className="h-[19px] w-[19px]" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-electric px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <a
              href={`tel:${SITE.phoneTel}`}
              className="ml-2 hidden items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-[13px] font-bold text-ink transition-all hover:bg-electric hover:text-white xl:flex"
            >
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
            <button onClick={() => setMenuOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[1300] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-white/10 px-5">
                <Search className="h-5 w-5 text-electric-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ACs, fridges, TVs, brands…"
                  className="h-16 flex-1 bg-transparent text-lg text-white placeholder:text-white/35 focus:outline-none"
                />
                <kbd className="hidden rounded-md border border-white/15 px-2 py-1 text-[11px] text-white/50 sm:block">ESC</kbd>
              </form>
              <div className="p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">Browse categories</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {QUICK_CATS.map(({ name, url, icon: Icon }) => (
                    <Link
                      key={url}
                      href={url}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition-all hover:border-electric/50 hover:bg-electric/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-electric-400" />
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[1250] bg-ink/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ink-800 p-5 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <img src="/brand/sc-logo-full-white.png" alt={SITE.name} className="h-14 w-auto" />
                <button onClick={() => setMenuOpen(false)} className={iconBtn} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.url}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={link.url}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between border-b border-white/[0.06] py-3.5 font-display text-xl font-semibold ${
                        isActive(link) ? 'text-electric-400' : 'text-white/85'
                      }`}
                    >
                      {link.name}
                      <ArrowUpRight className="h-4 w-4 opacity-40" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 pt-6">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 font-bold"
                >
                  <WhatsAppIcon /> WhatsApp us
                </a>
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 py-3.5 font-bold"
                >
                  <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function SiteNavbar() {
  // useSearchParams needs a Suspense boundary in the App Router
  return (
    <React.Suspense fallback={<div className="h-[92px] bg-ink" />}>
      <NavInner />
    </React.Suspense>
  );
}
