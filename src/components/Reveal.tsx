'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = 'left',
  dark = false,
  action,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <Reveal
      className={`mb-10 flex flex-col gap-6 sm:mb-14 ${
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className="min-w-0 max-w-2xl">
        <p
          className={`mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] ${
            dark ? 'text-electric-300' : 'text-electric'
          }`}
        >
          <span className="h-px w-6 bg-current" />
          {eyebrow}
        </p>
        <h2
          className={`font-display text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-5xl ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
        {sub && (
          <p className={`mt-4 text-[15px] leading-relaxed sm:text-base ${dark ? 'text-white/60' : 'text-slate-500'}`}>
            {sub}
          </p>
        )}
      </div>
      {action && <div className="min-w-0 max-w-full">{action}</div>}
    </Reveal>
  );
}
