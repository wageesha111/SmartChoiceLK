'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import { useStore } from '@/context/StoreContext';
import { ALL_PRODUCTS, CATEGORIES } from '@/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { addToCart, wishlist, toggleWishlist, formatLKR, showToast } = useStore();

  const product = ALL_PRODUCTS.find((p) => p.id === productId) || ALL_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'installation' | 'reviews'>('overview');

  const isWishlisted = wishlist.includes(product.id);

  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const categoryObj = CATEGORIES.find((c) => c.id === product.category);

  // Related products from same category or brand
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);

  const monthlyInstallment = Math.round(product.price / 3);

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Smart Choice LK! I would like to order: ${product.name} (SKU: ${product.sku || 'N/A'}) priced at ${formatLKR(product.price)}. Can you confirm islandwide delivery to my address?`
    );
    window.open(`https://wa.me/94771234567?text=${text}`, '_blank');
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
            {categoryObj && (
              <>
                <li className="breadcrumbs-separator">/</li>
                <li>
                  <Link href={`/products?category=${categoryObj.id}`}>{categoryObj.name}</Link>
                </li>
              </>
            )}
            <li className="breadcrumbs-separator">/</li>
            <li className="breadcrumbs-current">{product.name}</li>
          </ul>
        </div>
      </div>

      {/* Main Product Showcase */}
      <main className="pdp-page">
        <div className="container">
          <div className="pdp-grid">
            {/* Left: Sticky Image Gallery */}
            <div className="pdp-gallery-wrap">
              <div className="pdp-main-image-box">
                {product.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      zIndex: 10,
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.badge}
                  </div>
                )}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="pdp-main-image"
                />
              </div>

              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="pdp-thumbnails-row">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      className={`pdp-thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img src={imgUrl} alt={`${product.name} thumb ${idx}`} className="pdp-thumb-img" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Meta, Pricing, Installments & CTAs */}
            <div className="pdp-info">
              <div className="pdp-brand-category">
                {product.brand} â€¢ {product.category.replace('-', ' ')} {product.sku ? `â€¢ SKU: ${product.sku}` : ''}
              </div>

              <h1 className="pdp-title">{product.name}</h1>

              {/* Rating & Stock */}
              <div className="pdp-rating-row">
                <span className="pdp-stars">â˜…â˜…â˜…â˜…â˜…</span>
                <span style={{ fontWeight: 700, color: 'var(--color-dark)' }}>{product.rating}</span>
                <span className="pdp-reviews-count">({product.reviews} verified reviews)</span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span className="pdp-stock-badge">
                  â— In Stock ({product.stockCount || 12} units ready for islandwide dispatch)
                </span>
              </div>

              {/* Price Row */}
              <div className="pdp-price-wrap">
                <span className="pdp-price-main">{formatLKR(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="pdp-price-old">{formatLKR(product.originalPrice)}</span>
                    <span className="pdp-discount-badge">
                      Save {formatLKR(product.originalPrice - product.price)} ({product.discount}%)
                    </span>
                  </>
                )}
              </div>

              {/* 3-Month Installment Box */}
              <div className="pdp-installment-box">
                <span style={{ fontSize: '1.2rem' }}>ðŸ’³</span>
                <div>
                  <strong>Buy Now, Pay in 3 Interest-Free Installments</strong> of{' '}
                  <strong>{formatLKR(monthlyInstallment)}/month</strong> with Koko or Mintpay. Cash on delivery also available.
                </div>
              </div>

              {/* Description */}
              <p className="pdp-description">{product.description}</p>

              {/* Capacity Selector (if applicable) */}
              {product.capacity && (
                <div className="pdp-capacity-select">
                  <span className="pdp-capacity-label">Capacity / Size:</span>
                  <div className="pdp-capacity-options">
                    <button className="pdp-capacity-btn active">
                      {product.capacity}
                    </button>
                    {product.category === 'air-conditioners' && product.capacity.includes('12,000') && (
                      <>
                        <Link href="/products/2" className="pdp-capacity-btn">
                          18,000 BTU (1.5 Ton)
                        </Link>
                        <Link href="/products/3" className="pdp-capacity-btn">
                          24,000 BTU (2.0 Ton)
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Picker & Actions */}
              <div className="pdp-actions-row">
                <div className="pdp-qty-picker">
                  <button
                    className="pdp-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="pdp-qty-value">{quantity}</span>
                  <button
                    className="pdp-qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className="pdp-cart-btn"
                  onClick={() => addToCart(product.id, quantity)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>Add To Cart</span>
                </button>

                <button className="pdp-whatsapp-btn" onClick={handleWhatsAppOrder}>
                  <span>ðŸ’¬ WhatsApp Order</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border)',
                    backgroundColor: isWishlisted ? '#eff6ff' : '#ffffff',
                    color: isWishlisted ? 'var(--color-primary)' : 'var(--color-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="pdp-guarantee-boxes">
                <div className="pdp-guarantee-item">
                  <span className="pdp-guarantee-icon">ðŸ›¡ï¸</span>
                  <div>
                    <strong>{product.warranty || '10-Year Inverter Warranty'}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Authorized Agent Warranty Card Included</div>
                  </div>
                </div>

                <div className="pdp-guarantee-item">
                  <span className="pdp-guarantee-icon">ðŸšš</span>
                  <div>
                    <strong>Islandwide Safe Delivery</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Covering all 25 districts with transit insurance</div>
                  </div>
                </div>

                <div className="pdp-guarantee-item">
                  <span className="pdp-guarantee-icon">ðŸ”§</span>
                  <div>
                    <strong>Certified Installation Teams</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Genuine copper piping & vacuum pump testing</div>
                  </div>
                </div>

                <div className="pdp-guarantee-item">
                  <span className="pdp-guarantee-icon">ðŸ’µ</span>
                  <div>
                    <strong>Flexible Payment Methods</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cash / Card on Delivery & 0% installments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Tabbed Information */}
          <div className="pdp-tabs-container">
            <div className="pdp-tabs-nav">
              <button
                className={`pdp-tab-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Key Features & Overview
              </button>
              <button
                className={`pdp-tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Technical Specifications
              </button>
              <button
                className={`pdp-tab-nav-btn ${activeTab === 'installation' ? 'active' : ''}`}
                onClick={() => setActiveTab('installation')}
              >
                Installation & Warranty Scope
              </button>
              <button
                className={`pdp-tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Verified Customer Reviews ({product.reviews})
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '16px' }}>
                  Product Features & Engineering Highlights
                </h3>
                {product.features && product.features.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                    {product.features.map((feat, idx) => (
                      <li
                        key={idx}
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.875rem',
                          color: '#334155',
                        }}
                      >
                        <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1rem' }}>âœ“</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>{product.description}</p>
                )}
              </div>
            )}

            {/* Tab 2: Specs */}
            {activeTab === 'specs' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '16px' }}>
                  Full Technical Specifications
                </h3>
                {product.specs ? (
                  <table className="pdp-specs-table">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key}>
                          <th>{key}</th>
                          <td>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>Specifications available upon request.</p>
                )}
              </div>
            )}

            {/* Tab 3: Installation & Warranty */}
            {activeTab === 'installation' && (
              <div style={{ color: '#334155', lineHeight: '1.8', fontSize: '0.9375rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '14px' }}>
                  Authorized Distributor Warranty & Installation Scope
                </h3>
                <p style={{ marginBottom: '14px' }}>
                  All appliances purchased from Smart Choice LK are backed by 100% authorized agent warranty cards verified at the time of delivery.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>
                      Air Conditioning Installation Package
                    </h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#1e3a8a' }}>
                      <li>Standard 3-meter genuine copper refrigerant piping</li>
                      <li>High-grade outdoor bracket and vibration isolation pads</li>
                      <li>100% Nitrogen pressure testing for zero-leak assurance</li>
                      <li>Dual-stage vacuum pump moisture degassing</li>
                    </ul>
                  </div>

                  <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <h4 style={{ fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                      Authorized Agent Warranty Terms
                    </h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: '#14532d' }}>
                      <li>Inverter Compressor / Motor: 10 to 20 Years</li>
                      <li>PCB Electronic Boards: 1 to 3 Years</li>
                      <li>Islandwide authorized technician service network</li>
                      <li>Original stamped warranty booklet on doorstep arrival</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '20px' }}>
                  Customer Reviews from Sri Lankan Homeowners
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <strong>Dilshan Perera</strong> â€” <span style={{ color: '#64748b', fontSize: '0.8125rem' }}>Colombo 05 (Verified Buyer)</span>
                      </div>
                      <span style={{ color: '#f59e0b' }}>â˜…â˜…â˜…â˜…â˜…</span>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.6' }}>
                      "Installed this unit two weeks ago. The cooling speed is remarkable and whisper silent. Running it 8 hours every night has barely made an impact on our monthly electricity units. The technician team was very professional with vacuum pumps."
                    </p>
                  </div>

                  <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <strong>Nimesha Fernando</strong> â€” <span style={{ color: '#64748b', fontSize: '0.8125rem' }}>Kandy (Verified Buyer)</span>
                      </div>
                      <span style={{ color: '#f59e0b' }}>â˜…â˜…â˜…â˜…â˜…</span>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.6' }}>
                      "Super fast delivery to Kandy. Item was packed securely and the delivery crew handled it with utmost care. The agent warranty card was checked before payment. 10/10 service."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '60px' }}>
              <div className="section-title-wrap" style={{ textAlign: 'left', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-dark)' }}>
                  You May Also Like
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  More recommended appliances in this category
                </p>
              </div>

              <div className="products-grid">
                {relatedProducts.map((rel) => (
                  <div key={rel.id} className="product-card">
                    <div className="product-img-wrap">
                      <Link href={`/products/${rel.id}`} style={{ display: 'contents' }}>
                        <img src={rel.image} alt={rel.name} className="product-img" style={{ borderRadius: '8px' }} />
                      </Link>
                    </div>
                    <div className="product-category">{rel.brand} â€¢ {rel.capacity || rel.category}</div>
                    <h4 className="product-title">
                      <Link href={`/products/${rel.id}`}>{rel.name}</Link>
                    </h4>
                    <div className="product-price-wrap">
                      <span>{formatLKR(rel.price)}</span>
                      {rel.originalPrice && rel.originalPrice > rel.price && (
                        <span className="product-old-price">{formatLKR(rel.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <TrustRibbon />
      <SiteFooter />
    </div>
  );
}
