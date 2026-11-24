'use client';

import React from 'react';
import { Store, ShieldCheck, Wrench, CreditCard } from 'lucide-react';

export const TRUST_ITEMS = [
  { icon: Store, title: 'Shop pickup', desc: 'Collect from our Seeduwa store' },
  { icon: ShieldCheck, title: 'Genuine warranty', desc: 'Original products, brand-backed' },
  { icon: Wrench, title: 'Installation help', desc: 'Ask us about setting it up' },
  { icon: CreditCard, title: 'Easy payments', desc: 'Cash, card & installment plans' },
];

export default function TrustRibbon() {
  return (
    <section className="relative z-10 bg-white">
      <div className="mx-auto max-w-[1280px] px-5">
        <div className="grid grid-cols-2 divide-slate-200/80 border-b border-slate-200/80 lg:grid-cols-4 lg:divide-x">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 px-2 py-6 lg:px-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-electric-50 text-electric">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h4 className="text-sm font-bold text-ink">{title}</h4>
                <p className="text-xs leading-snug text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
