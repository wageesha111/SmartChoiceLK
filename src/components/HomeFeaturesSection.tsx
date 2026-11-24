'use client';

import React from 'react';
import { Wrench, Store, ShieldCheck, Zap, CreditCard, Headphones } from 'lucide-react';
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
    icon: Store,
    title: 'Visit & collect',
    desc: 'See it in person at our Raddoluwa, Seeduwa shop and take it home.',
  },
  {
    icon: Wrench,
    title: 'Setup help',
    desc: 'We show you how it works and help with setup questions on WhatsApp.',
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
    <section className="bg-warm-sand py-24">
      <div className="mx-auto max-w-[1280px] px-5">
        <SectionHeading
          eyebrow="Why Smart Choice"
          serif
          title={
            <>
              Buying appliances,
              <br />
              <span className="text-[#8a8275]">made simple.</span>
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
                    : 'bg-warm-linen text-ink ring-1 ring-[#e2dbd0] hover:bg-ink hover:text-white'
                }`}
              >
                {accent && (
                  <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-glow/40 blur-3xl" />
                )}
                <span
                  className={`relative mb-10 grid h-12 w-12 place-items-center rounded-2xl transition-colors ${
                    accent ? 'bg-white/15 text-white' : 'bg-warm-sand text-ink group-hover:bg-white/10 group-hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p
                  className={`relative mt-2 max-w-md text-sm leading-relaxed ${
                    accent ? 'text-white/80' : 'text-[#6b6458] group-hover:text-white/65'
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
