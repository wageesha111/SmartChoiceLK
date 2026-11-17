'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Spotlight } from '@/components/fx';

export default function PageHeader({
  eyebrow,
  title,
  sub,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="sc-noise relative -mt-[76px] overflow-hidden bg-ink pb-14 pt-[76px] text-white sm:pb-20">
      <div className="sc-grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-electric/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-glow/15 blur-[110px]" />
      <Spotlight />
      <div className="relative mx-auto max-w-[1280px] px-5 pt-12 sm:pt-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-white/50">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            {crumbs.map((c) => (
              <React.Fragment key={c.label}>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/80" aria-current="page">
                    {c.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-electric-300"
        >
          <span className="h-px w-6 bg-current" />
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl"
        >
          {title}
        </motion.h1>
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            {sub}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
