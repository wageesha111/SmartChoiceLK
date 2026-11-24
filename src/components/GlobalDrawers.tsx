'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { cartOrderMessage, whatsappLink } from '@/lib/site';

export default function GlobalDrawers() {
  const {
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    cart,
    wishlist,
    products,
    changeQty,
    removeFromCart,
    addToCart,
    toggleWishlist,
    subtotal,
    cartCount,
    formatLKR,
    selectedQuickViewProduct,
    closeQuickView,
    toast,
  } = useStore();

  const [quickQty, setQuickQty] = useState(1);

  return (
    <>
      {/* 1. TOAST HUD */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: '50px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
            fontSize: '0.9375rem',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.15)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{toast.emoji}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 2. CART DRAWER (Slide from Right) */}
      {isCartOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsCartOpen(false)}
          style={{ justifyContent: 'flex-end', padding: 0 }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: '-10px 0 35px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              animation: 'slideInRight 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #e2e8f0',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>🛒</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Appliance Cart ({cartCount})
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Genuine brands · Collect from our Seeduwa shop
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 16px',
                    color: '#64748b',
                  }}
                >
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>
                    📦
                  </span>
                  <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>
                    Your cart is currently empty
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
                    Explore our high-efficiency Inverter Air Conditioners, Frost-Free Fridges, and Washing Machines.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      display: 'inline-block',
                      padding: '10px 24px',
                      backgroundColor: '#266bf9',
                      color: '#ffffff',
                      borderRadius: '50px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Browse All Appliances
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        paddingBottom: '12px',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '68px',
                          height: '68px',
                          objectFit: 'cover',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          padding: '4px',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.72rem', color: '#266bf9', fontWeight: 700, textTransform: 'uppercase' }}>
                          {item.brand}
                        </div>
                        <h4
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '4px',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.name}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 800 }}>
                          {formatLKR(item.price)}
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '6px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '6px',
                            padding: '2px 6px',
                          }}
                        >
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            style={{
                              width: '22px',
                              height: '22px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontWeight: 700,
                              cursor: 'pointer',
                              color: '#0f172a',
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            style={{
                              width: '22px',
                              height: '22px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontWeight: 700,
                              cursor: 'pointer',
                              color: '#0f172a',
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#64748b' }}>
                    Subtotal:
                  </span>
                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {formatLKR(subtotal)}
                  </span>
                </div>

                <a
                  href={whatsappLink(cartOrderMessage(cart, subtotal, formatLKR))}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#266bf9',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: '50px',
                    fontSize: '0.9375rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(38,107,249,0.3)',
                  }}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Checkout via WhatsApp
                </a>
                <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                  No payment now — we confirm stock on WhatsApp, then you collect from our shop.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. WISHLIST DRAWER (Slide from Right) */}
      {isWishlistOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsWishlistOpen(false)}
          style={{ justifyContent: 'flex-end', padding: 0 }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: '-10px 0 35px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              animation: 'slideInRight 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid #e2e8f0',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>❤️</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Saved Appliances ({wishlist.length})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {wishlist.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 16px',
                    color: '#64748b',
                  }}
                >
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>
                    🤍
                  </span>
                  <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>
                    Your wishlist is currently empty
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
                    Tap the heart icon on any appliance card to save items for comparison and future purchase.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setIsWishlistOpen(false)}
                    style={{
                      display: 'inline-block',
                      padding: '10px 24px',
                      backgroundColor: '#266bf9',
                      color: '#ffffff',
                      borderRadius: '50px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Discover Inverters
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {wishlist.map((id) => {
                    const prod = products.find((p) => p.id === id);
                    if (!prod) return null;
                    return (
                      <div
                        key={prod.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'cover',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            padding: '4px',
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#0f172a',
                              marginBottom: '4px',
                              lineHeight: 1.3,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {prod.name}
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: '#266bf9', fontWeight: 800, marginBottom: '6px' }}>
                            {formatLKR(prod.price)}
                          </div>
                          <button
                            onClick={() => {
                              addToCart(prod.id);
                              toggleWishlist(prod.id);
                            }}
                            style={{
                              padding: '5px 14px',
                              backgroundColor: '#266bf9',
                              color: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: '50px',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            Move to Cart
                          </button>
                        </div>
                        <button
                          onClick={() => toggleWishlist(prod.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. QUICK VIEW MODAL */}
      {selectedQuickViewProduct && (
        <div className="modal-backdrop" onClick={closeQuickView}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeQuickView}>
              ✕
            </button>

            <div className="quick-view-grid">
              <div className="quick-view-img-wrap">
                <img
                  src={selectedQuickViewProduct.image}
                  alt={selectedQuickViewProduct.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#eff6ff',
                    color: '#266bf9',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '50px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedQuickViewProduct.brand} • {selectedQuickViewProduct.warranty}
                </span>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {selectedQuickViewProduct.name}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#266bf9' }}>
                    {formatLKR(selectedQuickViewProduct.price)}
                  </span>
                  {selectedQuickViewProduct.originalPrice && (
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        color: '#94a3b8',
                        textDecoration: 'line-through',
                      }}
                    >
                      {formatLKR(selectedQuickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8125rem',
                    color: '#475569',
                    marginBottom: '16px',
                  }}
                >
                  💳 Or 3 interest-free payments of{' '}
                  <strong style={{ color: '#0f172a' }}>
                    {formatLKR(Math.round(selectedQuickViewProduct.price / 3))}
                  </strong>{' '}
                  with Koko / Mintpay.
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#475569',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  {selectedQuickViewProduct.description}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '50px',
                      padding: '4px 12px',
                    }}
                  >
                    <button
                      onClick={() => setQuickQty(Math.max(1, quickQty - 1))}
                      style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{quickQty}</span>
                    <button
                      onClick={() => setQuickQty(quickQty + 1)}
                      style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedQuickViewProduct.id, quickQty);
                      closeQuickView();
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      backgroundColor: '#266bf9',
                      color: '#ffffff',
                      borderRadius: '50px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(38,107,249,0.3)',
                    }}
                  >
                    Add to Cart
                  </button>
                </div>

                <Link
                  href={`/products/${selectedQuickViewProduct.id}`}
                  onClick={closeQuickView}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#266bf9',
                    textDecoration: 'underline',
                  }}
                >
                  View Full Technical Specs & Reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

