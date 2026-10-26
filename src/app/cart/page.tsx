'use client';

import React from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const {
    cart,
    cartCount,
    subtotal,
    changeQty,
    removeFromCart,
    clearCart,
    formatLKR,
    showToast,
  } = useStore();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const itemsSummary = cart
      .map((item, i) => `${i + 1}. ${item.name} (${item.capacity || 'Standard'}) x ${item.qty} = ${formatLKR(item.price * item.qty)}`)
      .join('%0A');
    const text = `Hello Smart Choice LK! I want to confirm my order:%0A%0A${itemsSummary}%0A%0ASubtotal: ${formatLKR(subtotal)}%0A%0APlease let me know the islandwide delivery schedule.`;
    window.open(`https://wa.me/94771234567?text=${text}`, '_blank');
  };

  return (
    <div className="antigravity-layout">
      <SiteNavbar />

      {/* Breadcrumbs */}
      <div className="breadcrumbs-bar">
        <div className="container">
          <ul className="breadcrumbs-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumbs-separator">/</li>
            <li className="breadcrumbs-current">Shopping Cart</li>
          </ul>
        </div>
      </div>

      <main className="cart-page-layout">
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h1 className="section-title">Your Shopping Cart</h1>
            <p className="section-subtitle" style={{ margin: 0 }}>
              {cartCount > 0
                ? `You have ${cartCount} appliance${cartCount > 1 ? 's' : ''} in your cart ready for delivery.`
                : 'Your shopping cart is currently empty.'}
            </p>
          </div>

          {cart.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '80px 20px',
                textAlign: 'center',
                boxShadow: 'var(--box-shadow-card)',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>ðŸ›’</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '8px' }}>
                Your cart is empty
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '28px', maxWidth: '440px', margin: '0 auto 28px' }}>
                Explore our catalog of Dual Inverter Air Conditioners, French Door Refrigerators, and AI Washing Machines with 10â€“20 year warranties.
              </p>
              <Link
                href="/products"
                style={{
                  padding: '12px 32px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Browse All Appliances</span>
                <span>â†’</span>
              </Link>
            </div>
          ) : (
            <div className="cart-grid-split">
              {/* Left: Cart Items List */}
              <div className="cart-table-card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr auto',
                        gap: '20px',
                        alignItems: 'center',
                        paddingBottom: '20px',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <Link href={`/products/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            padding: '6px',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      </Link>

                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                          {item.brand} â€¢ {item.category.replace('-', ' ')}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', margin: '4px 0 6px' }}>
                          <Link href={`/products/${item.id}`}>{item.name}</Link>
                        </h4>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px' }}>
                          ðŸ›¡ï¸ {item.warranty || 'Authorized Agent Warranty'}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {formatLKR(item.price)}
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                        <div className="pdp-qty-picker">
                          <button
                            className="pdp-qty-btn"
                            onClick={() => changeQty(item.id, -1)}
                            style={{ height: '36px', width: '32px' }}
                          >
                            -
                          </button>
                          <span className="pdp-qty-value" style={{ padding: '0 10px', fontSize: '0.85rem' }}>
                            {item.qty}
                          </span>
                          <button
                            className="pdp-qty-btn"
                            onClick={() => changeQty(item.id, 1)}
                            style={{ height: '36px', width: '32px' }}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            color: '#dc2626',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          ðŸ—‘ï¸ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                  <Link
                    href="/products"
                    style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}
                  >
                    â† Continue Shopping
                  </Link>

                  <button
                    onClick={() => clearCart()}
                    style={{ fontSize: '0.8125rem', color: '#64748b' }}
                  >
                    Clear Entire Cart
                  </button>
                </div>
              </div>

              {/* Right: Order Summary Box */}
              <div className="cart-summary-box">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '18px' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9375rem', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Subtotal ({cartCount} items):</span>
                    <strong style={{ color: 'var(--color-dark)' }}>{formatLKR(subtotal)}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Islandwide Delivery:</span>
                    <span style={{ color: '#166534', fontWeight: 700 }}>FREE (Colombo / Gampaha)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Installation Scope:</span>
                    <span style={{ color: '#1e3a8a', fontWeight: 600 }}>Standard Included</span>
                  </div>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)' }}>Total:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {formatLKR(subtotal)}
                  </span>
                </div>

                {/* Energy rebate note */}
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '0.8125rem',
                    color: '#1e40af',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  ðŸ’¡ <strong>Energy Savings Note:</strong> Replacing non-inverter models with this bundle can save approximately <strong>Rs. 7,500 â€“ 12,000/month</strong> on Sri Lankan domestic electricity tariffs.
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleWhatsAppCheckout}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '50px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <span>ðŸ’¬ Direct WhatsApp Checkout</span>
                </button>

                <button
                  onClick={() => showToast('Connecting to secure islandwide checkout gateway...', 'ðŸ”’')}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '50px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(38, 107, 249, 0.3)',
                  }}
                >
                  Proceed to Secure Checkout
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                  ðŸ”’ 100% Secure Checkout â€¢ Cash on Delivery Accepted â€¢ Authorized Agent Warranty Stamped on Delivery
                </div>
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

