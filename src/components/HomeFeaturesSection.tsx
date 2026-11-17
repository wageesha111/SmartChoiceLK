'use client';

import React from 'react';
import { Wrench, Truck, ShieldCheck, Zap, CreditCard, Headphones } from 'lucide-react';
import Reveal, { SectionHeading } from '@/components/Reveal';

const FEATURES = [
  {
    icon: Zap,
    title: 'Save on your electricity bill',
    desc: 'We help you pick the right inverter model and size for your room, so you are not paying for power you do not need.',
    span: 'lg:col-span-2',
    accent: true,
  },
  {
    icon: Truck,
    title: 'Islandwide delivery',
    desc: 'Carefully packed and delivered to your doorstep, anywhere in Sri Lanka.',
  },
  {
    icon: Wrench,
    title: 'Proper installation',
    desc: 'Clean, correct installation and a full demo before we leave.',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine products',
    desc: 'Original stock with the manufacturer’s warranty card — no grey imports.',
  },
  {
    icon: CreditCard,
    title: 'Easy payments',
    desc: 'Card installment plans, bank transfer or cash — whatever suits you.',
  },
  {
    icon: Headphones,
    title: 'After-sales care',
    desc: 'A real person on WhatsApp when you need help — before and after you buy.',
    span: 'lg:col-span-2',
  },
];

export default function HomeFeaturesSection() {
  return (
    <section className="bg-white pb-24 pt-6">
      <div className="mx-auto max-w-[1280px] px-5">
        <SectionHeading
          eyebrow="Why Smart Choice"
          title={
            <>
              Buying appliances,
              <br />
              <span className="text-slate-400">made simple.</span>
            </>
          }
          sub="From choosing the right model to installation at home, we take care of everything — the way a good local shop should."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc, span, accent }, i) => (
            <Reveal key={title} delay={i * 0.06} className={span}>
              <div
                className={`group relative h-full overflow-hidden rounded-[26px] p-7 transition-all duration-500 ${
                  accent
                    ? 'bg-gradient-to-br from-electric to-electric-700 text-white'
                    : 'bg-mist text-ink hover:bg-ink hover:text-white'
                }`}
              >
                {accent && (
                  <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-glow/40 blur-3xl" />
                )}
                <span
                  className={`relative mb-10 grid h-12 w-12 place-items-center rounded-2xl transition-colors ${
                    accent ? 'bg-white/15 text-white' : 'bg-white text-electric group-hover:bg-white/10 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p
                  className={`relative mt-2 max-w-md text-sm leading-relaxed ${
                    accent ? 'text-white/80' : 'text-slate-500 group-hover:text-white/65'
                  }`}
                >
                  {desc}
                </p>
                <span
                  className={`absolute right-6 top-6 font-display text-sm font-semibold ${
                    accent ? 'text-white/50' : 'text-slate-300 group-hover:text-white/30'
                  }`}
                >
                  0{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
