'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import HomeFeaturesSection from '@/components/HomeFeaturesSection';
import EnergyCalculator from '@/components/EnergyCalculator';
import { useStore } from '@/context/StoreContext';
import { ALL_PRODUCTS } from '@/data/products';
import {
  SMARTCHOICE_OFFERS,
  SMARTCHOICE_TESTIMONIALS,
  SMARTCHOICE_BRANDS,
  SMARTCHOICE_BLOGS,
} from '@/data/smartchoice-data';

export default function SmartChoiceHomePage() {
  const { addToCart, wishlist, toggleWishlist, openQuickView, formatLKR, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'inverters' | 'new' | 'deals'>('inverters');
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Live Countdown Timer for Deals (e.g. 47h 58m 20s)
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 58,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to Top Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto Hero Slider Timer
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroSlide((prev) => (prev === 0 ? 1 : 0));
    }, 8000);
    return () => clearInterval(slideTimer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hero Slides Data (Air Conditioner & Washing Machine)
  const HERO_SLIDES = [
    {
      subtitle: 'Official Inverter Air Conditioner Store — Sri Lanka',
      heading: 'Dual Inverter Air Conditioners & Energy Savings',
      btnText: 'Explore Inverter Air Conditioners',
      targetCategory: 'air-conditioners',
      image: '/antigravity/hero-ac-2.png',
      alt: 'Dual Inverter Split Air Conditioner with Rising Animation',
      badge: 'Up to 65% Electricity Saving',
    },
    {
      subtitle: 'AI Smart Fabric Care & Hygiene Steam Protection',
      heading: 'AI Direct Drive Washing Machines & Steam Care',
      btnText: 'Explore Washing Machines',
      targetCategory: 'washing-machines',
      image: '/antigravity/hero-washing-machine.png',
      alt: 'AI Front Load Inverter Washing Machine with Rising Animation',
      badge: '10-Yr Direct Drive Motor Warranty',
    },
  ];

  const currentSlide = HERO_SLIDES[heroSlide];

  // Tab Filtering
  const displayedProducts = useMemo(() => {
    if (activeTab === 'new') {
      return ALL_PRODUCTS.filter((p) => p.badge?.includes('New') || p.id % 2 === 0).slice(0, 8);
    }
    if (activeTab === 'deals') {
      return ALL_PRODUCTS.filter((p) => (p.discount && p.discount > 0) || p.badge?.includes('Sale')).slice(0, 8);
    }
    // Default: 'inverters'
    return ALL_PRODUCTS.filter((p) => p.inverter).slice(0, 8);
  }, [activeTab]);

  return (
    <div className="antigravity-layout">
      {/* 1. UNIFIED MULTI-PAGE TOP BAR & NAVBAR */}
      <SiteNavbar />

      {/* 2. HERO SECTION (Bottom-To-Up Slow Rising Animation on Vibrant Blue Pedestal) */}
      <section className="hero-slider-section">
        {/* Left Circular Navigation Arrow */}
        <button
          className="slider-arrow slider-arrow-left"
          onClick={() => setHeroSlide((prev) => (prev === 0 ? 1 : 0))}
          aria-label="Previous Slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Right Circular Navigation Arrow */}
        <button
          className="slider-arrow slider-arrow-right"
          onClick={() => setHeroSlide((prev) => (prev === 1 ? 0 : 1))}
          aria-label="Next Slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="container hero-slider-container" key={`hero-slide-${heroSlide}`}>
          {/* Left Content with Staggered Entrance */}
          <div className="hero-content">
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '50px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                marginBottom: '14px',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              ★ {currentSlide.badge}
            </span>
            <p className="hero-subtitle hero-anim-subtitle">{currentSlide.subtitle}</p>
            <h1 className="hero-heading hero-anim-title">{currentSlide.heading}</h1>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
              <Link
                href={`/products?category=${currentSlide.targetCategory}`}
                className="hero-btn hero-anim-btn"
              >
                {currentSlide.btnText} →
              </Link>
              <Link
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '14px 28px',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s ease',
                }}
              >
                Browse All (20+)
              </Link>
            </div>
          </div>

          {/* Right Content: Glowing Dome Pedestal & Slow Bottom-To-Up Rising Product */}
          <div className="hero-image-wrap">
            {/* Circular Glowing Dome Pedestal */}
            <div className="hero-pedestal-wrap">
              <div className="hero-pedestal-outer"></div>
              <div className="hero-pedestal-inner"></div>
            </div>

            {/* Product image rising from bottom to up smoothly and slowly */}
            <img
              key={`hero-img-${heroSlide}`}
              src={currentSlide.image}
              alt={currentSlide.alt}
              className="hero-product-animated"
            />
          </div>
        </div>
      </section>

      {/* 3. TRUST RIBBON (Inverter Savings, Warranties, Safe Transit) */}
      <TrustRibbon />

      {/* 3.5 APPLIANCE FEATURES & SERVICES CAROUSEL (Embla + Framer Motion) */}
      <HomeFeaturesSection />

      {/* 4. LUXURY APPLIANCE BENTO GRID CATEGORIES */}
      <section id="categories-section" className="py-20 bg-slate-50/70 border-b border-slate-200/80 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              Official Authorized Collections
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Explore Appliance Categories
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Engineered for Sri Lankan tropical weather with authorized agent warranties & certified technician installation
            </p>
          </div>

          {/* Luxury 4-Card Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Card 1: Dual Inverter Air Conditioners (Col Span 7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group">
              <div className="relative z-10 max-w-md">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
                  Dual Inverter Series • Save Up to 65%
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Dual Inverter Air Conditioners
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mb-4 leading-relaxed">
                  Whisper-silent tropical climate cooling with R32 green eco-gas and Ocean Black Fin coastal corrosion defense.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg font-bold text-blue-600">From Rs. 198,500</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
                    10-Yr Agent Warranty
                  </span>
                </div>
                <Link
                  href="/products?category=air-conditioners"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-md group-hover:gap-3"
                >
                  <span>Explore Air Conditioners</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="mt-8 lg:mt-6 relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="/appliances/luxury-ac.jpg"
                  alt="Dual Inverter Air Conditioners"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Card 2: Smart Inverter Refrigerators (Col Span 5) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                  Twin Cooling Plus • No Frost
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Smart Refrigerators
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Multi-door French & Side-by-Side refrigerators with SpaceMax interior efficiency and digital inverter compressors.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg font-bold text-blue-600">From Rs. 175,000</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
                    20-Yr Motor
                  </span>
                </div>
                <Link
                  href="/products?category=refrigerators"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-md group-hover:gap-3"
                >
                  <span>Explore Refrigerators</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="mt-8 relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="/appliances/luxury-fridge.jpg"
                  alt="Multi-door Smart Refrigerators"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Card 3: AI Direct Drive Washing Machines (Col Span 6) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
                  AI Fabric Sensing • Steam Care
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  AI Washing Machines
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Front-load & top-load inverter washers with 99.9% allergy steam hygiene protection and whisper-quiet motors.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg font-bold text-blue-600">From Rs. 148,000</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
                    10-Yr Motor Warranty
                  </span>
                </div>
                <Link
                  href="/products?category=washing-machines"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-md group-hover:gap-3"
                >
                  <span>Explore Washing Machines</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="mt-8 relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="/appliances/luxury-washer.jpg"
                  alt="AI Direct Drive Washing Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Card 4: 4K OLED / QLED Televisions (Col Span 6) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group">
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
                  120Hz OLED • Dolby Atmos Sound
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  4K OLED & Smart Televisions
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Cinematic home theater displays powered by cognitive processors with authorized distributor warranty coverage.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg font-bold text-blue-600">From Rs. 165,000</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
                    3-Yr Official Warranty
                  </span>
                </div>
                <Link
                  href="/products?category=televisions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 shadow-md group-hover:gap-3"
                >
                  <span>Explore Televisions</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="mt-8 relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="/appliances/luxury-tv.jpg"
                  alt="4K OLED Smart Televisions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TABBED PRODUCT GRID (Inverter Appliances, New Arrivals, Best Deals) */}
      <section id="products-section" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              Handpicked Deals & Inventory
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured Home Appliances
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Official manufacturer warranties & certified islandwide installation across Sri Lanka
            </p>
          </div>

          {/* Pill-Shaped Filter Tabs */}
          <div className="flex items-center justify-center p-1.5 bg-slate-100/90 rounded-full max-w-md mx-auto mb-14 border border-slate-200/80 shadow-inner">
            <button
              className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'inverters'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('inverters')}
            >
              ⚡ Inverter Series
            </button>
            <button
              className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'new'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('new')}
            >
              ✨ New Arrivals
            </button>
            <button
              className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'deals'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('deals')}
            >
              🔥 Discount Deals
            </button>
          </div>

          {/* 4-Column Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-500/40 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Top Badges & Wishlist */}
                  <div className="flex items-center justify-between w-full mb-4">
                    {product.badge ? (
                      <span
                        className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          product.discount
                            ? 'bg-blue-100 text-blue-700'
                            : product.badge.includes('New')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-900 text-white'
                        }`}
                      >
                        {product.discount ? `-${product.discount}% OFF` : product.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isWishlisted
                          ? 'bg-rose-50 text-rose-600 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      aria-label="Wishlist"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link
                    href={`/products/${product.id}`}
                    className="block h-52 w-full relative rounded-2xl overflow-hidden bg-slate-50/70 mb-5 p-4 flex items-center justify-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </Link>

                  {/* Product Meta */}
                  <div className="flex flex-col flex-grow">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5">
                      {product.brand} • {product.category.replace('-', ' ')}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      <Link href={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </h4>

                    {/* Price & Installments */}
                    <div className="mt-auto pt-3 border-t border-slate-100">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-extrabold text-slate-900">
                          {formatLKR(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-medium">
                            {formatLKR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mb-4">
                        Or ~{formatLKR(Math.round(product.price / 12))}/mo with Koko / Card
                      </p>

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(product.id, 1)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md hover:shadow-blue-500/25"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `Hello Smart Choice LK! I am interested in ${product.name} priced at ${formatLKR(
                                product.price
                              )}. Is it available in stock with delivery?`
                            );
                            window.open(`https://wa.me/94771234567?text=${text}`, '_blank');
                          }}
                          className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200"
                          title="Inquire via WhatsApp"
                          aria-label="WhatsApp"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </button>

                        <button
                          onClick={() => openQuickView(product)}
                          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                          title="Quick View"
                          aria-label="Quick View"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:gap-4"
            >
              <span>Explore Complete Appliance Catalog (20+ Items)</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. VIP PROMOTIONAL SHOWCASE (Midnight Sapphire Gradient & Inverter Savings) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border border-blue-900/40 shadow-2xl text-white">
            {/* Ambient Radial Neon Glow */}
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                  ★ Official CEB Power-Saving Initiative
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
                  Slash Up To 65% Off Your Monthly CEB Electricity Bill
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
                  Upgrade your home to certified Dual Inverter air conditioners and digital inverter refrigerators. Guaranteed temperature stability, whisper-quiet operation, and massive bill reductions under Sri Lanka's domestic tariff slabs.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/products?category=air-conditioners"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:gap-3"
                  >
                    <span>Shop Inverter Specials</span>
                    <span>→</span>
                  </Link>

                  <a
                    href="#calculator-section"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all duration-300 border border-white/20 backdrop-blur-md"
                  >
                    <span>Calculate Your Bill Savings</span>
                  </a>
                </div>
              </div>

              {/* Right Side Metric Badges */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md shadow-lg">
                  <div className="text-xs uppercase font-bold tracking-wider text-blue-300 mb-1">
                    Typical AC Savings
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    Rs. 14,200+ <span className="text-sm font-normal text-slate-300">/ Month</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Based on 8 hours daily cooling vs non-inverter
                  </div>
                </div>

                <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md shadow-lg">
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-300 mb-1">
                    Warranty Protection
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    10–20 Years <span className="text-sm font-normal text-slate-300">Coverage</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    100% Authorized Sri Lankan Agent Guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE CEB TARIFF ENERGY CALCULATOR */}
      <section id="calculator-section" className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="container mx-auto px-4 max-w-5xl">
          <EnergyCalculator />
        </div>
      </section>

      {/* 8. FEATURED OFFERS (Countdown Timers & Dual Column Specs Layout) */}
      <section id="featured-offers" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              Limited Stock Flash Discounts
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured Seasonal Offers
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Limited-time authorized distributor discounts with certified technician installation across Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SMARTCHOICE_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col md:flex-row gap-6 items-center"
              >
                {/* Product Image */}
                <div className="w-full md:w-1/2 h-64 rounded-2xl overflow-hidden bg-slate-50 relative p-4 flex items-center justify-center">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Offer Details with Live Countdown Timer */}
                <div className="w-full md:w-1/2 flex flex-col justify-between h-full">
                  {/* Countdown Timer Capsule */}
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-full text-xs font-bold mb-3 self-start">
                    <span>⏳ Ends in:</span>
                    <span className="font-mono text-blue-700 font-extrabold">
                      {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                    {offer.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-extrabold text-blue-600">
                      {formatLKR(offer.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatLKR(offer.originalPrice)}
                    </span>
                  </div>

                  {/* Bulleted List of Specs */}
                  <ul className="space-y-1.5 text-xs text-slate-600 mb-5">
                    {offer.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                    onClick={() => {
                      const matched =
                        ALL_PRODUCTS.find(
                          (p) => p.name.includes(offer.category) || p.id === offer.id
                        ) || ALL_PRODUCTS[0];
                      addToCart(matched.id, 1);
                      showToast(`Added ${offer.title} to cart!`, '🎉');
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Add To Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CLIENT FEEDBACK (Testimonials from Sri Lanka) */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Client Feedback</h2>
            <p className="section-subtitle">
              Verified reviews from homeowners across Colombo, Kandy, Galle, and Gampaha
            </p>
          </div>

          <div className="testimonials-grid">
            {SMARTCHOICE_TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-quote-icon">“</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-author-wrap">
                  <img src={t.image} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <h4 className="testimonial-author-name">{t.name}</h4>
                    <span className="testimonial-author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. BRAND LOGOS (Authorized Brand Partners) */}
      <section id="brands" className="brands-section">
        <div className="container">
          <div className="brands-box" style={{ justifyContent: 'space-around' }}>
            {SMARTCHOICE_BRANDS.map((brand, i) => (
              <Link
                key={i}
                href={`/products?query=${encodeURIComponent(brand.name)}`}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: '#475569',
                  opacity: 0.8,
                  padding: '10px 20px',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  userSelect: 'none',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  backgroundColor: '#ffffff',
                }}
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. LATEST BLOG (Appliance Buying Guides) */}
      <section id="blog-section" className="blog-section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Appliance Guides & Tips</h2>
            <p className="section-subtitle">
              Expert advice on selecting the right capacity and saving electricity in Sri Lanka
            </p>
          </div>

          <div className="blog-grid">
            {SMARTCHOICE_BLOGS.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-img-wrap">
                  <img src={post.image} alt={post.title} className="blog-img" loading="lazy" />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span>{post.date}</span> — By <strong>{post.author}</strong>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <Link href="/about" className="blog-read-more-btn" style={{ textDecoration: 'none' }}>
                    Read Guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 12. UNIFIED MULTI-PAGE FOOTER */}
      <SiteFooter />

      {/* 13. FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{ display: 'flex' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}
