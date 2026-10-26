'use client';

import React from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';

export default function AboutPage() {
  const stats = [
    { number: '12,500+', label: 'Sri Lankan Homes Powered' },
    { number: '25', label: 'Districts Islandwide Delivery' },
    { number: '10â€“20 Yrs', label: 'Official Inverter Warranties' },
    { number: '100%', label: 'Authorized Agent Genuine Stock' },
  ];

  const pillars = [
    {
      icon: 'ðŸ›¡ï¸',
      title: '100% Authorized Distributor Stock',
      desc: 'We never deal in parallel or grey market imports. Every appliance sold comes directly from authorized distributor channels with verified manufacturer warranty cards accepted nationwide.',
    },
    {
      icon: 'âš¡',
      title: 'Inverter Energy-Efficiency Pioneers',
      desc: 'With rising electricity unit tariffs in Sri Lanka, we specialize exclusively in high ISEER 5-star inverter technology that reduces monthly power consumption by up to 65%.',
    },
    {
      icon: 'ðŸ”§',
      title: 'Certified Installation Standards',
      desc: 'Our air conditioner installation technicians follow strict manufacturer guidelines: genuine high-grade copper piping, nitrogen pressure testing, and vacuum pump evacuation for maximum longevity.',
    },
    {
      icon: 'ðŸšš',
      title: 'Reliable Islandwide Logistics',
      desc: 'Our fleet provides express delivery in Colombo and Gampaha (often same-day), and insured transit across all 25 districts from Jaffna to Matara with unboxing and doorstep inspection.',
    },
  ];

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
            <li className="breadcrumbs-current">About Smart Choice LK</li>
          </ul>
        </div>
      </div>

      {/* About Hero */}
      <section className="about-hero">
        <div className="container">
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '50px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            Choose Smart â€¢ Live Better
          </span>
          <h1 className="about-hero-title">Sri Lankaâ€™s Trusted Inverter Appliance Partner</h1>
          <p className="about-hero-sub">
            Dedicated to providing authentic, energy-efficient home appliances and climate control systems backed by authorized manufacturer warranties and professional technician support across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container">
        <div className="about-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="about-stat-card">
              <div className="about-stat-number">{s.number}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="container" style={{ paddingBottom: '70px' }}>
        <div className="section-title-wrap">
          <h2 className="section-title">The Smart Choice Advantage</h2>
          <p className="section-subtitle">
            Why thousands of homeowners and commercial clients choose Smart Choice LK
          </p>
        </div>

        <div className="pillars-grid">
          {pillars.map((p, i) => (
            <div key={i} className="pillar-card">
              <span className="pillar-icon">{p.icon}</span>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Showroom Showcase Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8125rem' }}>
              Flagship Experience Center
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 16px' }}>
              Visit Our Colombo 03 Showroom
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '24px' }}>
              Experience inverter whisper-quiet acoustics, interactive touch controls, and smart app features live before you buy. Our engineering consultants are on hand to calculate your room BTU sizing and electricity savings.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#e2e8f0', marginBottom: '24px' }}>
              <div>ðŸ“ <strong>Address:</strong> No. 245 Galle Road, Colombo 03, Sri Lanka</div>
              <div>ðŸ“ž <strong>Hotline:</strong> (+94) 11 234 5678 / (+94) 77 123 4567</div>
              <div>ðŸ•’ <strong>Hours:</strong> Mon â€“ Sat: 9:00 AM â€“ 7:00 PM | Sun: 10:00 AM â€“ 4:00 PM</div>
            </div>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '50px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              Get Directions & Book Consultation â†’
            </Link>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '320px' }}>
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85"
              alt="Smart Choice LK Colombo Showroom"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <TrustRibbon />
      <SiteFooter />
    </div>
  );
}

