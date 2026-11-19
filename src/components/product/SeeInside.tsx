'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from 'framer-motion';
import type { Product } from '@/types';
import { videoParts } from '@/lib/productVideo';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "See inside": the product's exploded-view video is tied to the scroll position,
 * so the parts come apart as you scroll down and go back together as you scroll up.
 * Captions for each part appear at their point in the video.
 * Reduced motion: no pinning — the video plays normally with controls.
 */
export default function SeeInside({ product }: { product: Product }) {
  const calm = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [p, setP] = useState(0);
  const [failed, setFailed] = useState(false);
  const parts = videoParts(product);
  const src = product.video?.src;

  // keep the browser from playing it on its own; we drive currentTime
  useEffect(() => {
    const v = videoRef.current;
    if (!v || calm) return;
    v.pause();
  }, [calm]);

  useGSAP(
    () => {
      if (!src || calm || failed) return;
      const v = videoRef.current!;
      let target = 0;
      let raf = 0;
      // ease the video time towards the scroll target (smooth, no jumps)
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!v.duration) return;
        const want = target * (v.duration - 0.05);
        const diff = want - v.currentTime;
        if (Math.abs(diff) > 0.01) v.currentTime += diff * 0.25;
      };
      tick();
      // desktop: pin the section while the video plays through; phones: scrub as it scrolls past
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const st = ScrollTrigger.create({
        trigger: wrap.current,
        start: desktop ? 'top top' : 'top 80%',
        end: desktop ? '+=250%' : 'bottom 20%',
        pin: desktop,
        scrub: true,
        onUpdate: (self) => {
          target = self.progress;
          setP(self.progress);
        },
      });
      return () => {
        cancelAnimationFrame(raf);
        st.kill();
      };
    },
    { scope: wrap, dependencies: [src, calm, failed] }
  );

  if (!src || failed) return null;

  const activeIdx = parts.reduce((acc, part, i) => (p >= part.at ? i : acc), -1);

  return (
    <section ref={wrap} aria-label={`Inside the ${product.name}`} className="relative overflow-hidden bg-ink text-white lg:h-screen">
      <div className="sc-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid h-full max-w-[1280px] items-center gap-8 px-5 py-16 lg:grid-cols-[1.25fr_1fr] lg:py-0">
        <div className="relative overflow-hidden rounded-[28px] bg-black/40 ring-1 ring-white/10">
          <video
            ref={videoRef}
            src={src}
            poster={product.video?.poster}
            muted
            playsInline
            preload="auto"
            controls={!!calm}
            onError={() => setFailed(true)}
            className="aspect-video w-full object-cover"
          />
          {!calm && (
            <div className="absolute inset-x-5 bottom-5 h-1 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-electric" style={{ width: `${p * 100}%` }} />
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-electric-300">
            <span className="h-px w-6 bg-current" /> See inside
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            What’s inside your {product.brand} — part by part.
          </h2>
          {!calm && <p className="mt-2 text-sm text-white/50">Keep scrolling to take it apart.</p>}
          <ol className="mt-8 space-y-3">
            {parts.map((part, i) => {
              const on = calm || i <= activeIdx;
              const now = i === activeIdx;
              return (
                <li
                  key={part.title}
                  className={`rounded-2xl border p-4 transition-all duration-500 ${
                    now
                      ? 'border-electric/60 bg-electric/10'
                      : on
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-white/5 bg-transparent opacity-35'
                  }`}
                >
                  <p className="flex items-center gap-3 font-display font-semibold">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${now ? 'bg-electric' : 'bg-white/10'}`}>
                      {i + 1}
                    </span>
                    {part.title}
                  </p>
                  <p className={`mt-1.5 pl-10 text-sm text-white/60 transition-all duration-500 ${on ? 'max-h-24 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
                    {part.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
