'use client';

/**
 * Small animated building blocks (Magic UI–style, hand-built to the Smart Choice tokens):
 * MagneticButton · NumberTicker · BorderBeam · Spotlight · TiltCard · Parallax · ScrubText
 * All of them respect prefers-reduced-motion and clean up after themselves.
 */

import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

function usePrefersFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setFine(mq.matches);
  }, []);
  return fine;
}

/* ───────── Magnetic wrapper (ui-ux-pro-max "Hover Micro-interaction / Complex") ───────── */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactElement; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const fine = usePrefersFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1,0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1,0.4)' });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced, fine, strength]);

  return (
    <span ref={ref} className="inline-block will-change-transform">
      {children}
    </span>
  );
}

/* ───────── Count-up number ───────── */
export function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {prefix}
      {display.toLocaleString('en-LK')}
      {suffix}
    </span>
  );
}

/* ───────── Animated light beam around a card's border ───────── */
export function BorderBeam({ className = '', duration = 7 }: { className?: string; duration?: number }) {
  return (
    <span
      aria-hidden
      className={`sc-border-beam pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{ ['--beam-duration' as string]: `${duration}s` }}
    />
  );
}

/* ───────── Cursor spotlight for dark panels ───────── */
export function Spotlight({ className = '', color = 'rgba(47,107,255,0.22)' }: { className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePrefersFinePointer();
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !fine) return;
    const onMove = (e: PointerEvent) => {
      const r = parent.getBoundingClientRect();
      el.style.setProperty('--sx', `${e.clientX - r.left}px`);
      el.style.setProperty('--sy', `${e.clientY - r.top}px`);
      el.style.opacity = '1';
    };
    const onLeave = () => (el.style.opacity = '0');
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    return () => {
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
    };
  }, [fine]);
  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ${className}`}
      style={{ background: `radial-gradient(520px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 60%)` }}
    />
  );
}

/* ───────── 3D tilt (vanilla-tilt, desktop pointers only) ───────── */
export function TiltCard({
  children,
  className = '',
  max = 8,
  glare = true,
  scale = 1.02,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePrefersFinePointer();

  useEffect(() => {
    const el = ref.current as (HTMLDivElement & { vanillaTilt?: { destroy: () => void } }) | null;
    if (!el || reduced || !fine) return;
    let cancelled = false;
    import('vanilla-tilt').then(({ default: VanillaTilt }) => {
      if (cancelled || !el) return;
      VanillaTilt.init(el, {
        max,
        speed: 600,
        perspective: 1100,
        scale,
        glare,
        'max-glare': 0.18,
        gyroscope: false,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
      });
    });
    return () => {
      cancelled = true;
      el.vanillaTilt?.destroy();
    };
  }, [reduced, fine, max, glare, scale]);

  return (
    <div ref={ref} className={`[transform-style:preserve-3d] ${className}`}>
      {children}
    </div>
  );
}

/* ───────── Scroll parallax (GSAP ScrollTrigger, scrubbed) ───────── */
export function Parallax({
  children,
  speed = 12,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { yPercent: -speed / 2 },
          {
            yPercent: speed / 2,
            ease: 'none',
            scrollTrigger: { trigger: ref.current?.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/* ───────── Word-by-word scrubbed reveal for big statements ───────── */
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll('[data-word]');
      if (!words?.length) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-word aria-hidden className="inline-block will-change-[opacity]">
          {w}&nbsp;
        </span>
      ))}
    </p>
  );
}
