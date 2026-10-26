'use client';

import React from 'react';
import { ServiceCarousel, type Service } from '@/components/ui/services-card';
import { Wrench, Truck, Award, Zap, CreditCard, Headphones, Sparkles } from 'lucide-react';

const SMART_SERVICES: Service[] = [
  {
    number: '001',
    badge: '100% Copper Kit',
    title: 'Certified Inverter Installation',
    description:
      'Professional certified technician mounting, authentic vacuum degassing, and 100% pure copper kit for maximum cooling efficiency and long compressor life.',
    icon: Wrench,
    gradient: 'from-blue-50 via-sky-100 to-blue-200 dark:from-sky-950/60 dark:to-blue-900/40',
  },
  {
    number: '002',
    badge: 'All 25 Districts',
    title: 'Islandwide Insured Delivery',
    description:
      'Safe, damage-insured transit with specialized heavy appliance packaging and fast doorstep dispatch across every district in Sri Lanka.',
    icon: Truck,
    gradient: 'from-emerald-50 via-teal-100 to-emerald-200 dark:from-emerald-950/60 dark:to-teal-900/40',
  },
  {
    number: '003',
    badge: '10–20 Yrs Agent Warranty',
    title: 'Authorized Brand Warranties',
    description:
      '100% official agent warranty certificates issued directly upon delivery. Comprehensive coverage for inverter compressors, motors, and motherboards.',
    icon: Award,
    gradient: 'from-amber-50 via-yellow-100 to-amber-200 dark:from-amber-950/60 dark:to-yellow-900/40',
  },
  {
    number: '004',
    badge: 'Save Up to 65%',
    title: 'CEB Tariff & Energy Audit',
    description:
      'Smart BTU sizing and power consumption guidance engineered to slash Sri Lankan CEB electricity tariffs and avoid high domestic slab rates.',
    icon: Zap,
    gradient: 'from-violet-50 via-purple-100 to-indigo-200 dark:from-purple-950/60 dark:to-violet-900/40',
  },
  {
    number: '005',
    badge: '0% Interest / Koko',
    title: '0% Installments & Pay-Later',
    description:
      'Up to 36 months 0% credit card plans with leading Sri Lankan banks, plus 3-part split payments via Koko and Mintpay with zero hidden fees.',
    icon: CreditCard,
    gradient: 'from-rose-50 via-pink-100 to-rose-200 dark:from-rose-950/60 dark:to-pink-900/40',
  },
  {
    number: '006',
    badge: 'Fast Hotline Care',
    title: '24/7 Priority Technician Support',
    description:
      'Direct WhatsApp helpline with certified technicians, seasonal servicing reminders, and rapid on-site troubleshooting within 24 hours.',
    icon: Headphones,
    gradient: 'from-cyan-50 via-sky-100 to-teal-200 dark:from-cyan-950/60 dark:to-sky-900/40',
  },
];

export default function HomeFeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-y border-slate-200/80 relative overflow-hidden">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Why Sri Lanka Chooses Smart Choice LK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Engineered For Excellence. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Guaranteed For Life.
            </span>
          </h2>

          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Explore our certified inverter installation, official agent warranty protection, and flexible zero-interest financing designed for Sri Lankan homes.
          </p>
        </div>

        {/* Animated Carousel of Service Cards */}
        <ServiceCarousel services={SMART_SERVICES} />

        {/* Quick Trust Stat Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Over 12,500+ Inverters Installed Islandwide</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-amber-500 font-bold">★ 4.9/5</span>
            <span>Customer Satisfaction Rating</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-blue-600 font-bold">100%</span>
            <span>Authorized Official Warranty Claims</span>
          </div>
        </div>
      </div>
    </section>
  );
}
