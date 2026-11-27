'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Opening hero: a night photo of a living room, soft a warm light that follows the cursor, and the
 * shop's name. Scrolling opens it like two doors down the middle, onto the room hero below.
 * The room hero (next sibling, pulled up by its own -mt-[100vh]) is held in place underneath
 * while the doors open, the same way the old intro handed off to it.
 */

const PHOTO = 'https://res.cloudinary.com/xdgeoud6/image/upload/f_auto,q_auto,w_2000/smartchoice/hero/night-living-room';
const PHOTO_SM = 'https://res.cloudinary.com/xdgeoud6/image/upload/f_auto,q_auto,c_fill,g_auto,w_900,h_1600/smartchoice/hero/night-living-room';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function Face({ copy }: { copy?: boolean }) {
  const Title = copy ? 'p' : 'h1';
  return (
    <>
      <picture>
        <source media="(max-width: 767px)" srcSet={PHOTO_SM} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO}
          alt=""
          fetchPriority={copy ? 'auto' : 'high'}
          className="sc-hero-photo absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {/* night grade: darker edges, a calm middle for the name */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(5,11,26,0.25),rgba(5,11,26,0.82)_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,11,26,0.75),transparent_28%,transparent_62%,rgba(5,11,26,0.9))]" />

      {/* warm light: the same room, lit like a lamp is on, shown only around the cursor */}
      <div aria-hidden="true" className="sc-warm pointer-events-none absolute inset-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={PHOTO_SM} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO} alt="" className="sc-hero-photo absolute inset-0 h-full w-full object-cover [filter:brightness(1.9)_contrast(1.08)_saturate(1.2)_sepia(0.38)]" />
        </picture>
        <div className="absolute inset-0 bg-[rgba(255,150,70,0.22)] mix-blend-overlay" />
      </div>

      <div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white"
        style={{ opacity: 'calc(1 - var(--words, 0))', transform: 'translateY(calc(var(--words, 0) * -24px))' }}
      >
        <p className="sc-hero-in text-[11px] font-semibold uppercase tracking-[0.42em] text-white/65 sm:text-xs">
          Smart Choice LK · Raddoluwa, Seeduwa
        </p>
        <Title
          className="sc-hero-in mt-5 font-[Oswald,Sora,sans-serif] text-[clamp(3.1rem,10.5vw,9.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.005em]"
          style={{ animationDelay: '120ms' }}
        >
          Choose smart.
          <br />
          Live better.
        </Title>
        <p
          className="sc-hero-in mt-6 max-w-[34rem] text-[15px] leading-relaxed text-white/75 sm:text-base"
          style={{ animationDelay: '240ms' }}
        >
          Authorized Abans dealer. Genuine TVs, air conditioners, fridges and washing machines with the
          full brand warranty, ready to collect from our shop.
        </p>
      </div>
    </>
  );
}

export default function SmokeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(0);

  // Scroll → doors open; the room hero underneath is held in place until they have.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const h = window.innerHeight;
      const total = r.height - h;
      const raw = total > 0 ? clamp(-r.top / total) : 0;
      const o = easeInOut(clamp((raw - 0.07) / 0.8));
      // the words leave first, so the doors never cut through letters
      section.style.setProperty('--words', clamp(raw / 0.06).toFixed(3));
      openRef.current = o;
      section.style.setProperty('--open', o.toFixed(4));
      const edge = Math.min(1, o * 10);
      if (leftRef.current) {
        leftRef.current.style.transform = `translate3d(${-o * 100}%,0,0)`;
        leftRef.current.style.boxShadow = edge ? `24px 0 48px rgba(0,0,0,${0.55 * edge})` : '';
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate3d(${o * 100}%,0,0)`;
        rightRef.current.style.boxShadow = edge ? `-24px 0 48px rgba(0,0,0,${0.55 * edge})` : '';
      }
      if (cueRef.current) cueRef.current.style.opacity = String(1 - clamp(raw * 8));
      if (veilRef.current) veilRef.current.style.opacity = String(1 - clamp(o * 1.4));
      section.style.pointerEvents = o > 0.98 ? 'none' : '';
      // keep the hero clean: no site header until the doors are mostly open
      const root = document.documentElement;
      const heroOn = o < 0.6 && r.bottom > 0;
      if (heroOn && root.dataset.intro !== 'on') root.dataset.intro = 'on';
      else if (!heroOn && root.dataset.intro === 'on') delete root.dataset.intro;
      const hero = section.nextElementSibling as HTMLElement | null;
      if (hero) {
        if (raw > 0 && raw < 1) {
          const heroTop = r.bottom - h; // where the room hero would sit right now
          hero.style.transform = `translateY(${-heroTop}px) scale(${0.94 + 0.06 * o})`;
          hero.style.transformOrigin = `50% ${h / 2}px`;
        } else {
          hero.style.transform = '';
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      delete document.documentElement.dataset.intro;
      const hero = section.nextElementSibling as HTMLElement | null;
      if (hero) hero.style.transform = '';
    };
  }, []);

  // Warm light that follows the cursor (and drifts slowly on its own on phones).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const touch = window.matchMedia('(hover: none)').matches;
    const cur = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 };
    const aim = { ...cur };
    let shown = 0; // how strongly the light is on, 0..1
    let want = touch ? 0.85 : 0;
    let user = false;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const y = e.clientY - Math.max(0, r.top);
      if (e.clientY < r.top || e.clientY > Math.min(r.bottom, window.innerHeight)) return;
      aim.x = e.clientX;
      aim.y = y;
      user = true;
      want = 1;
    };
    const onLeave = () => (want = touch ? 0.85 : 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(section);

    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (touch && !user) {
        // no cursor: the light wanders slowly across the room
        const s = (now - t0) / 1000;
        aim.x = window.innerWidth * (0.5 + 0.3 * Math.sin(s * 0.35));
        aim.y = window.innerHeight * (0.45 + 0.15 * Math.sin(s * 0.52 + 1));
      }
      cur.x += (aim.x - cur.x) * 0.12;
      cur.y += (aim.y - cur.y) * 0.12;
      shown += (want - shown) * 0.06;
      const fade = 1 - clamp(openRef.current * 3);
      section.style.setProperty('--lx', `${cur.x.toFixed(1)}px`);
      section.style.setProperty('--ly', `${cur.y.toFixed(1)}px`);
      section.style.setProperty('--lo', (shown * fade).toFixed(3));
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Welcome to Smart Choice LK"
      className="relative z-10 -mt-[113px] h-[200vh] motion-reduce:-mt-[76px] motion-reduce:h-screen"
    >
      <div className="sticky top-0 h-screen min-h-[560px] overflow-hidden">
        {/* dark behind the doors: the gap opens on night, then the room fades up */}
        <div ref={veilRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink" />
        <div ref={leftRef} className="absolute inset-y-0 left-0 z-[1] w-1/2 overflow-hidden will-change-transform">
          <div className="absolute inset-y-0 left-0 w-[200%]">
            <Face />
          </div>
        </div>
        <div ref={rightRef} aria-hidden="true" className="absolute inset-y-0 right-0 z-[1] w-1/2 overflow-hidden will-change-transform">
          <div className="absolute inset-y-0 right-0 w-[200%]">
            <Face copy />
          </div>
        </div>


        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55 motion-reduce:hidden"
        >
          Scroll
          <span className="sc-hero-cue h-9 w-px bg-white/60" />
        </div>
      </div>
    </section>
  );
}
