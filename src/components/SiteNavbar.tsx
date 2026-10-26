'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { NavBar, NavItem } from '@/components/ui/tubelight-navbar';
import {
  Home,
  LayoutGrid,
  Snowflake,
  Refrigerator,
  Disc3,
  Tv,
  Info,
  PhoneCall,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react';

export default function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlist, setIsCartOpen, setIsWishlistOpen } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navItems: NavItem[] = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'All Appliances', url: '/products', icon: LayoutGrid },
    { name: 'Air Conditioners', url: '/products?category=air-conditioners', icon: Snowflake },
    { name: 'Refrigerators', url: '/products?category=refrigerators', icon: Refrigerator },
    { name: 'Washing Machines', url: '/products?category=washing-machines', icon: Disc3 },
    { name: 'Televisions', url: '/products?category=televisions', icon: Tv },
    { name: 'About Us', url: '/about', icon: Info },
    { name: 'Contact', url: '/contact', icon: PhoneCall },
  ];

  const activeTabName = useMemo(() => {
    if (pathname === '/') return 'Home';
    if (pathname === '/about') return 'About Us';
    if (pathname === '/contact') return 'Contact';
    if (pathname?.startsWith('/products')) {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat === 'air-conditioners') return 'Air Conditioners';
        if (cat === 'refrigerators') return 'Refrigerators';
        if (cat === 'washing-machines') return 'Washing Machines';
        if (cat === 'televisions') return 'Televisions';
      }
      return 'All Appliances';
    }
    return 'Home';
  }, [pathname]);

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span>
              🚚 Islandwide Safe Delivery & Certified Inverter Installation Across All 25 Districts in Sri Lanka
            </span>
          </div>
          <div className="top-bar-right">
            <a href="tel:+94112345678" className="top-bar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>+94 11 234 5678</span>
            </a>
            <a href="mailto:sales@smartchoicelk.com" className="top-bar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>sales@smartchoicelk.com</span>
            </a>
            <a
              href="https://wa.me/94771234567?text=Hello%20Smart%20Choice%20LK%2C%20I%20want%20to%20inquire%20about%20appliances"
              target="_blank"
              rel="noreferrer"
              className="top-bar-item"
              style={{ color: '#25D366' }}
            >
              <span>💬 WhatsApp: +94 77 123 4567</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Prominent Search Bar, Wishlist & Cart) */}
      <header className="main-header">
        <div className="container main-header-inner">
          {/* Brand Logo */}
          <Link
            href="/"
            className="brand-logo"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
          >
            <img
              src="/smart-choice-logo.png"
              alt="Smart Choice LK"
              style={{
                height: '44px',
                width: 'auto',
                maxWidth: '60px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
                Smart Choice<span style={{ color: 'var(--color-primary)' }}>.LK</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#9ca3af',
                  fontWeight: 600,
                }}
              >
                Choose Smart. Live Better.
              </span>
            </div>
          </Link>

          {/* Prominent Search Bar (Search included as requested) */}
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search Inverter ACs, Refrigerators, Washing Machines, 4K TVs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="header-search-btn" aria-label="Search">
              <Search size={18} strokeWidth={2.5} />
            </button>
          </form>

          {/* Right Header Actions */}
          <div className="header-actions">
            {/* Wishlist Button */}
            <button
              className="header-action-btn"
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              title="View Wishlist"
            >
              <Heart
                size={22}
                strokeWidth={2}
                fill={wishlist.length > 0 ? '#266bf9' : 'none'}
                color={wishlist.length > 0 ? '#266bf9' : 'currentColor'}
              />
              {wishlist.length > 0 && (
                <span className="header-badge">{wishlist.length}</span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              className="header-action-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingCart size={22} strokeWidth={2} />
              <span className="header-badge">{cartCount || 0}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="header-action-btn mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. MODERN TUBELIGHT NAVIGATION BAR */}
      <nav className="tubelight-nav-row bg-[#081225] border-t border-b border-white/10 py-3 relative z-30 overflow-x-auto">
        <div className="container flex justify-center items-center">
          <NavBar
            items={navItems}
            activeTab={activeTabName}
            className="relative bottom-auto sm:top-auto left-auto translate-x-0 mb-0 sm:pt-0 z-auto"
          />
        </div>
      </nav>

      {/* 4. MOBILE SLIDEOUT MENU */}
      {mobileMenuOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={{ justifyContent: 'flex-start', padding: 0, zIndex: 1200 }}
        >
          <div
            style={{
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              backgroundColor: '#0c1322',
              color: '#ffffff',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInLeft 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Smart Choice Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTabName === item.name;
                return (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        color: isActive ? '#266bf9' : '#e2e8f0',
                        backgroundColor: isActive ? 'rgba(38,107,249,0.14)' : 'transparent',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        textDecoration: 'none',
                      }}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                <span>💬 WhatsApp Hotline</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
