'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import { useStore } from '@/context/StoreContext';
import { ALL_PRODUCTS, CATEGORIES, BRANDS } from '@/data/products';
import { Product } from '@/types';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('query') || '';

  const { addToCart, wishlist, toggleWishlist, formatLKR, showToast } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [inverterOnly, setInverterOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(600000);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
        return false;
      }
      if (inverterOnly && !p.inverter) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          (p.brand ? p.brand.toLowerCase().includes(q) : false) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedBrand, inverterOnly, maxPrice, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('All');
    setInverterOnly(false);
    setMaxPrice(600000);
    setSearchQuery('');
  };

  return (
    <div className="antigravity-layout">
      {/* Global Navigation */}
      <SiteNavbar />

      {/* Breadcrumbs */}
      <div className="breadcrumbs-bar">
        <div className="container">
          <ul className="breadcrumbs-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumbs-separator">/</li>
            <li>
              <Link href="/products">All Appliances</Link>
            </li>
            {selectedCategory !== 'all' && (
              <>
                <li className="breadcrumbs-separator">/</li>
                <li className="breadcrumbs-current">
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <main className="catalog-page">
        <div className="container">
          <div className="catalog-layout">
            {/* Sidebar Filters */}
            <aside className="filter-sidebar">
              <div className="filter-header">
                <h3>Filter Appliances</h3>
                <button onClick={resetFilters} className="filter-reset-btn">
                  Reset All
                </button>
              </div>

              {/* Inverter Only Switch */}
              <div className="filter-group">
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--color-dark)',
                  }}
                >
                  <span>âš¡ Inverter Only</span>
                  <input
                    type="checkbox"
                    checked={inverterOnly}
                    onChange={(e) => setInverterOnly(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Categories */}
              <div className="filter-group">
                <h4 className="filter-group-title">Category</h4>
                <div className="filter-chips-list">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`filter-chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  >
                    <span>All Appliances</span>
                    <span className="filter-chip-count">{ALL_PRODUCTS.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = ALL_PRODUCTS.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`filter-chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      >
                        <span>
                          {cat.icon} {cat.name}
                        </span>
                        <span className="filter-chip-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="filter-group">
                <h4 className="filter-group-title">Brand</h4>
                <div className="filter-chips-list">
                  <button
                    onClick={() => setSelectedBrand('All')}
                    className={`filter-chip-btn ${selectedBrand === 'All' ? 'active' : ''}`}
                  >
                    <span>All Brands</span>
                  </button>
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`filter-chip-btn ${selectedBrand === brand ? 'active' : ''}`}
                    >
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="filter-group">
                <h4 className="filter-group-title">
                  Max Price: {formatLKR(maxPrice)}
                </h4>
                <input
                  type="range"
                  min="50000"
                  max="600000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
              </div>
            </aside>

            {/* Products Grid & Toolbar */}
            <section>
              {/* Toolbar */}
              <div className="catalog-toolbar">
                <div className="catalog-results-count">
                  Showing <strong>{sortedProducts.length}</strong> appliances
                  {selectedCategory !== 'all' && (
                    <span> in {CATEGORIES.find((c) => c.id === selectedCategory)?.name}</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    Sort By:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="catalog-sort-select"
                  >
                    <option value="featured">Featured & Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>

              {/* Products List */}
              {sortedProducts.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '60px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '14px' }}>ðŸ”</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                    No matching appliances found
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '8px 0 20px' }}>
                    Try changing your category, adjusting the price slider, or resetting filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    style={{
                      padding: '10px 24px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      borderRadius: '50px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {sortedProducts.map((product) => {
                    const isWishlisted = wishlist.includes(product.id);
                    return (
                      <div key={product.id} className="product-card">
                        {/* Badges on Top Left */}
                        {product.badge && (
                          <div className="product-badges">
                            <span className="badge-tag badge-discount">
                              {product.badge}
                            </span>
                          </div>
                        )}

                        {/* Product Image & Hover Actions */}
                        <div className="product-img-wrap">
                          <Link href={`/products/${product.id}`} style={{ display: 'contents' }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-img"
                              loading="lazy"
                              style={{ borderRadius: '8px' }}
                            />
                          </Link>

                          {/* 4-Icon Action Overlay */}
                          <div className="product-action-dock">
                            {/* 1. Add to Cart */}
                            <button
                              className="product-action-btn"
                              onClick={() => addToCart(product.id)}
                              aria-label="Add to cart"
                              title="Add to Cart"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                              </svg>
                            </button>

                            {/* 2. Wishlist */}
                            <button
                              className="product-action-btn"
                              onClick={() => toggleWishlist(product.id)}
                              aria-label="Toggle Wishlist"
                              title="Save to Wishlist"
                              style={isWishlisted ? { backgroundColor: '#266bf9' } : {}}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill={isWishlisted ? '#ffffff' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </button>

                            {/* 3. Direct WhatsApp */}
                            <button
                              className="product-action-btn"
                              onClick={() => {
                                const msg = encodeURIComponent(
                                  `Hi Smart Choice LK! I am interested in ${product.name} priced at ${formatLKR(product.price)}. Is it available in stock?`
                                );
                                window.open(`https://wa.me/94771234567?text=${msg}`, '_blank');
                              }}
                              aria-label="WhatsApp Inquiry"
                              title="WhatsApp Inquiry"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                              </svg>
                            </button>

                            {/* 4. Quick View */}
                            <button
                              className="product-action-btn"
                              onClick={() => setQuickViewProduct(product)}
                              aria-label="Quick View"
                              title="Quick View"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="product-category">
                          {product.brand} â€¢ {product.capacity || product.category}
                        </div>
                        <h4 className="product-title">
                          <Link href={`/products/${product.id}`}>{product.name}</Link>
                        </h4>
                        <div className="product-price-wrap">
                          <span>{formatLKR(product.price)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="product-old-price">
                              {formatLKR(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Trust Ribbon */}
      <TrustRibbon />

      {/* Global Footer */}
      <SiteFooter />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close Modal"
            >
              âœ•
            </button>

            <div className="quick-view-grid">
              <div className="quick-view-img-wrap">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="quick-view-img"
                  style={{ borderRadius: '10px' }}
                />
              </div>

              <div>
                <span
                  style={{
                    color: '#266bf9',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {quickViewProduct.brand} â€¢ {quickViewProduct.category}
                </span>
                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    color: '#212529',
                    margin: '6px 0 10px',
                    lineHeight: 1.3,
                  }}
                >
                  {quickViewProduct.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#266bf9' }}>
                    {formatLKR(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1rem' }}>
                      {formatLKR(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '14px',
                  }}
                >
                  ðŸ›¡ï¸ {quickViewProduct.warranty || 'Official Agent Warranty'}
                </div>

                <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '18px' }}>
                  {quickViewProduct.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct.id);
                      setQuickViewProduct(null);
                    }}
                    style={{
                      backgroundColor: '#266bf9',
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: '50px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(38,107,249,0.3)',
                    }}
                  >
                    Add To Cart
                  </button>

                  <Link
                    href={`/products/${quickViewProduct.id}`}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f1f5f9',
                      color: '#212529',
                      borderRadius: '50px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    View Full Details â†’
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}

