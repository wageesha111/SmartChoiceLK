'use client';

import React from 'react';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer id="footer" className="footer-main">
      <div className="container footer-grid">
        {/* Column 1: Logo & Company Bio */}
        <div className="footer-col">
          <Link
            href="/"
            className="footer-logo"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            <img
              src="/smart-choice-logo.png"
              alt="Smart Choice LK"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
            <span>
              Smart Choice<span style={{ color: 'var(--color-primary)' }}>.LK</span>
            </span>
          </Link>
          <p className="footer-desc">
            Sri Lanka's premier authorized dealer for genuine Inverter Air Conditioners,
            Frost-Free Refrigerators, AI Washing Machines, and 4K Home Electronics.
            Backed by official agent warranties and certified islandwide technician installation.
          </p>
          <div className="footer-social-icons">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.54l5.7 3.24-5.7 3.24z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Appliances & Shop */}
        <div className="footer-col">
          <h4>Appliances & Shop</h4>
          <ul className="footer-links">
            <li>
              <Link href="/products?category=air-conditioners">Inverter Air Conditioners</Link>
            </li>
            <li>
              <Link href="/products?category=refrigerators">Side-by-Side Refrigerators</Link>
            </li>
            <li>
              <Link href="/products?category=washing-machines">AI Front Load Washers</Link>
            </li>
            <li>
              <Link href="/products?category=televisions">4K OLED & QLED Televisions</Link>
            </li>
            <li>
              <Link href="/products?category=kitchen">Kitchen & Built-in Cooking</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Services */}
        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Smart Choice LK</Link>
            </li>
            <li>
              <Link href="/contact">Certified AC Installation Booking</Link>
            </li>
            <li>
              <Link href="/contact">Islandwide Delivery Guide (25 Districts)</Link>
            </li>
            <li>
              <Link href="/contact">Warranty Claim & Support</Link>
            </li>
            <li>
              <Link href="/cart">My Shopping Cart & Checkout</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Showroom & Contact */}
        <div className="footer-col footer-contact-info">
          <h4>Showroom & Contact</h4>
          <p>
            <strong>Address:</strong> No. 245 Galle Road, Colombo 03, Sri Lanka
          </p>
          <p>
            <strong>Hotline:</strong> (+94) 11 234 5678 / (+94) 77 123 4567
          </p>
          <p>
            <strong>Email:</strong> sales@smartchoicelk.com
          </p>
          <p>
            <strong>Hours:</strong> Mon â€“ Sat: 9:00 AM â€“ 7:00 PM | Sun: 10:00 AM â€“ 4:00 PM
          </p>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            Â© 2024 Smart Choice LK (Pvt) Ltd. All Rights Reserved. Choose Smart â€¢ Live Better.
          </p>
          <div className="payment-icons-wrap">
            <img
              src="/antigravity/assets_images_icons_payment.png"
              alt="Supported Payments: Visa, Mastercard, AMEX, Cash on Delivery, Bank Transfer, Koko"
              className="payment-icons-img"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

