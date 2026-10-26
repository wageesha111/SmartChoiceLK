'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function EnergyCalculator() {
  const { formatLKR } = useStore();
  const [dailyHours, setDailyHours] = useState(8);
  const [applianceType, setApplianceType] = useState<'ac' | 'fridge'>('ac');
  const [acCapacity, setAcCapacity] = useState<12 | 18 | 24>(12);

  // Sri Lanka average CEB commercial/domestic slab estimate (~Rs. 58 per kWh)
  const tariffPerUnit = 58;

  let nonInverterWatts = 1300;
  let inverterWatts = 580;

  if (applianceType === 'ac') {
    if (acCapacity === 12) {
      nonInverterWatts = 1300;
      inverterWatts = 580;
    } else if (acCapacity === 18) {
      nonInverterWatts = 1950;
      inverterWatts = 890;
    } else {
      nonInverterWatts = 2600;
      inverterWatts = 1200;
    }
  } else {
    // Refrigerator
    nonInverterWatts = 380;
    inverterWatts = 140;
  }

  const hoursPerDay = applianceType === 'fridge' ? 24 : dailyHours;
  const daysPerMonth = 30;

  const nonInverterUnits = (nonInverterWatts * hoursPerDay * daysPerMonth) / 1000;
  const inverterUnits = (inverterWatts * hoursPerDay * daysPerMonth) / 1000;

  const monthlyNonInverterCost = Math.round(nonInverterUnits * tariffPerUnit);
  const monthlyInverterCost = Math.round(inverterUnits * tariffPerUnit);
  const monthlySavings = Math.max(0, monthlyNonInverterCost - monthlyInverterCost);
  const annualSavings = monthlySavings * 12;
  const percentageSaving = Math.round(((nonInverterWatts - inverterWatts) / nonInverterWatts) * 100);

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at 80% 50%, #1e3a8a 0%, #0f172a 60%, #020617 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '44px 36px',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left Column: Interactive Inputs */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '50px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            âš¡ Sri Lanka Inverter Energy Calculator
          </div>

          <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '10px' }}>
            Calculate Your Monthly Electricity Savings
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '24px' }}>
            See how much you slash from your domestic CEB electricity bill by choosing an authorized 5-Star Smart Inverter appliance.
          </p>

          {/* Appliance Selector */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setApplianceType('ac')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: applianceType === 'ac' ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              â„ï¸ Inverter Air Conditioner
            </button>
            <button
              onClick={() => setApplianceType('fridge')}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: applianceType === 'fridge' ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ðŸ§Š Inverter Refrigerator
            </button>
          </div>

          {/* Capacity Buttons for AC */}
          {applianceType === 'ac' && (
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                Select AC Sizing:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAcCapacity(12)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    backgroundColor: acCapacity === 12 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: acCapacity === 12 ? '#38bdf8' : '#cbd5e1',
                    border: acCapacity === 12 ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                  }}
                >
                  12,000 BTU (1.0 Ton)
                </button>
                <button
                  onClick={() => setAcCapacity(18)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    backgroundColor: acCapacity === 18 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: acCapacity === 18 ? '#38bdf8' : '#cbd5e1',
                    border: acCapacity === 18 ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                  }}
                >
                  18,000 BTU (1.5 Ton)
                </button>
                <button
                  onClick={() => setAcCapacity(24)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    backgroundColor: acCapacity === 24 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: acCapacity === 24 ? '#38bdf8' : '#cbd5e1',
                    border: acCapacity === 24 ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                  }}
                >
                  24,000 BTU (2.0 Ton)
                </button>
              </div>
            </div>
          )}

          {/* Running Hours Slider */}
          {applianceType === 'ac' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                <span>Daily Night / Day Runtime:</span>
                <span style={{ color: '#38bdf8', fontWeight: 800 }}>{dailyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                <span>4 hrs (Evening)</span>
                <span>8 hrs (Full Night Sleep)</span>
                <span>16+ hrs (All Day)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Calculated Savings Presentation Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd', fontWeight: 800 }}>
                Estimated Energy Reduction
              </span>
              <span style={{ padding: '3px 10px', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                Up to {percentageSaving}% Less Power
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 600 }}>
                Monthly Savings on CEB Bill:
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#34d399', letterSpacing: '-0.02em', margin: '4px 0' }}>
                {formatLKR(monthlySavings)}
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 400, marginLeft: '4px' }}>/ month</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: '#cbd5e1' }}>Annual Bill Savings:</span>
              <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>{formatLKR(annualSavings)} / yr</strong>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              *Based on standard Sri Lankan electricity utility unit rates. Over a 3-year period, the electricity savings alone easily recover the entire appliance cost!
            </p>
          </div>

          <Link
            href="/products?category=air-conditioners"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '50px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
            }}
          >
            <span>Browse 5-Star Inverters</span>
            <span>â†’</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

