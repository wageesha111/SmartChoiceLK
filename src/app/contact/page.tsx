'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import TrustRibbon from '@/components/TrustRibbon';
import { useStore } from '@/context/StoreContext';

export default function ContactPage() {
  const { showToast } = useStore();

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Purchase Inquiry & Quote',
    district: 'Colombo',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) {
      showToast('Please provide your name and phone number', 'âš ï¸');
      return;
    }
    setSubmitted(true);
    showToast('Your inquiry was sent to Smart Choice LK engineering team!', 'âœ…');
  };

  const faqs = [
    {
      q: 'How fast is islandwide delivery across Sri Lanka?',
      a: 'We deliver within 24 to 48 hours to Colombo, Gampaha, and Kalutara with same-day delivery available for orders confirmed before 11:00 AM. For all other districts (Kandy, Galle, Kurunegala, Jaffna, etc.), insured transit takes 2 to 3 business days.',
    },
    {
      q: 'What is included in the Air Conditioner installation package?',
      a: 'Our standard certified AC installation package includes: 3 meters of genuine high-grade copper refrigerant piping, outdoor wall bracket, vibration damper pads, 100% nitrogen pressure testing for leak prevention, and dual-stage vacuum pump moisture degassing. Additional piping is charged per meter at standard transparent rates.',
    },
    {
      q: 'How do I claim the 10 to 20-year inverter compressor warranty?',
      a: 'Every appliance from Smart Choice LK comes with an original authorized agent warranty card stamped upon delivery. For any technical service, you can simply call our hotline or the manufacturer authorized service center directly using the warranty booklet.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD) for selected areas, Credit / Debit Cards (Visa, Mastercard, AMEX), 0% installment plans, direct bank transfers, and 3-month interest-free installment apps (Koko and Mintpay).',
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
            <li className="breadcrumbs-current">Contact & Showroom</li>
          </ul>
        </div>
      </div>

      {/* Main Contact Layout */}
      <main className="contact-page">
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'left', marginBottom: '36px' }}>
            <span
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Get In Touch With Our Specialists
            </span>
            <h1 className="section-title">Showroom & Customer Support</h1>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Need advice on inverter AC room BTU sizing, refrigerator dimensions, or booking certified technician installation? We are here to help.
            </p>
          </div>

          <div className="contact-split">
            {/* Left: Contact Info Stack */}
            <div className="contact-cards-stack">
              {/* Showroom Location Card */}
              <div className="contact-card-box">
                <h3 className="contact-card-title">
                  <span>ðŸ“</span> Colombo Flagship Showroom
                </h3>
                <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '16px' }}>
                  No. 245 Galle Road, Colombo 03, Sri Lanka.
                  <br />
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    (Convenient customer parking available on premises)
                  </span>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#334155' }}>
                  <div>ðŸ“ž <strong>Hotline:</strong> (+94) 11 234 5678</div>
                  <div>ðŸ“± <strong>Mobile / WhatsApp:</strong> (+94) 77 123 4567</div>
                  <div>âœ‰ï¸ <strong>Sales & Quotes:</strong> sales@smartchoicelk.com</div>
                  <div>ðŸ•’ <strong>Showroom Hours:</strong> Mon â€“ Sat: 9:00 AM â€“ 7:00 PM | Sun: 10:00 AM â€“ 4:00 PM</div>
                </div>
              </div>

              {/* Direct WhatsApp Card */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 700, color: '#166534', fontSize: '1.05rem', marginBottom: '4px' }}>
                    Instant WhatsApp Support
                  </h4>
                  <p style={{ color: '#14532d', fontSize: '0.8125rem', margin: 0 }}>
                    Chat live with an appliance engineer for quick quotes and stock availability.
                  </p>
                </div>
                <a
                  href="https://wa.me/94771234567?text=Hello%20Smart%20Choice%20LK%2C%20I%20have%20an%20inquiry%20about%20appliances"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '50px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Islandwide Coverage Card */}
              <div className="contact-card-box">
                <h3 className="contact-card-title">
                  <span>ðŸšš</span> Islandwide Technician & Delivery Coverage
                </h3>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>
                  We service and deliver across all 25 administrative districts: Western, Central, Southern, North Western, Sabaragamuwa, Eastern, Uva, North Central, and Northern Provinces.
                </p>
              </div>
            </div>

            {/* Right: Service & Quote Booking Form */}
            <div className="contact-form-box">
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '8px' }}>
                Send Us an Inquiry / Book Installation
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
                Fill out the form below and an appliance consultant will respond within 30 minutes.
              </p>

              {submitted ? (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '36px 24px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>âœ…</div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                    Inquiry Received Successfully!
                  </h4>
                  <p style={{ color: '#14532d', fontSize: '0.875rem', marginBottom: '20px' }}>
                    Thank you, {formState.name}. Our Colombo showroom team will contact you at {formState.phone} shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        phone: '',
                        email: '',
                        serviceType: 'Purchase Inquiry & Quote',
                        district: 'Colombo',
                        message: '',
                      });
                    }}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      borderRadius: '50px',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Jayawardena"
                      className="form-input"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +94 77 123 4567"
                        className="form-input"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. kasun@example.com"
                        className="form-input"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Inquiry / Service Type</label>
                      <select
                        className="form-select"
                        value={formState.serviceType}
                        onChange={(e) => setFormState({ ...formState, serviceType: e.target.value })}
                      >
                        <option value="Purchase Inquiry & Quote">New Appliance Purchase & Price Quote</option>
                        <option value="Certified AC Installation Booking">Certified AC Installation Booking</option>
                        <option value="Inverter Sizing & Consultation">Room BTU Sizing & Consultation</option>
                        <option value="Warranty Claim & Technical Support">Warranty Claim & Technical Support</option>
                        <option value="Corporate / Bulk Order">Corporate / Bulk Order</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your District</label>
                      <select
                        className="form-select"
                        value={formState.district}
                        onChange={(e) => setFormState({ ...formState, district: e.target.value })}
                      >
                        <option value="Colombo">Colombo</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Kalutara">Kalutara</option>
                        <option value="Kandy">Kandy</option>
                        <option value="Galle">Galle</option>
                        <option value="Kurunegala">Kurunegala</option>
                        <option value="Matara">Matara</option>
                        <option value="Other">Other District</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message or Appliance Requirements</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about the appliance you are interested in (e.g. 18,000 BTU Inverter AC or Side-by-side Refrigerator), room size, or delivery location."
                      className="form-textarea"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="form-submit-btn">
                    Submit Inquiry & Request Callback
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <section style={{ marginTop: '70px' }}>
            <div className="section-title-wrap">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Clear answers regarding delivery, installation scope, and warranty verification in Sri Lanka
              </p>
            </div>

            <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: 'var(--box-shadow-card)',
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: 'var(--color-dark)',
                        cursor: 'pointer',
                        backgroundColor: isOpen ? '#eff6ff' : '#ffffff',
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                        {isOpen ? 'âˆ’' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '18px 24px', borderTop: '1px solid #f1f5f9', color: '#475569', fontSize: '0.875rem', lineHeight: '1.7' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <TrustRibbon />
      <SiteFooter />
    </div>
  );
}

