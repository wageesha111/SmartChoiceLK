'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { whatsappLink } from '@/lib/site';

/**
 * Opening hero: a night photo of a living room, soft smoke that follows the pointer, and the
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
  const tab = copy ? -1 : undefined;
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

      <div className="relative flex h-full flex-col items-center justify-center px-6 pt-16 text-center text-white">
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
        <div
          className="sc-hero-in mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
          style={{ animationDelay: '360ms' }}
        >
          <Link
            href="/products"
            tabIndex={tab}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold uppercase tracking-[0.08em] text-ink transition hover:-translate-y-0.5 hover:bg-electric hover:text-white active:scale-[0.98]"
          >
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tab}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-sm font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
          </a>
        </div>
      </div>
    </>
  );
}

/** A soft, cloudy puff drawn once and stamped for every smoke particle. */
function makePuff(size = 192) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  for (let i = 0; i < 46; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * size * 0.26;
    const x = size / 2 + Math.cos(a) * d;
    const y = size / 2 + Math.sin(a) * d;
    const r = size * (0.08 + Math.random() * 0.2);
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, 'rgba(214,228,245,0.14)');
    rg.addColorStop(1, 'rgba(214,228,245,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, size, size);
  }
  // fade the edges so no square ever shows
  g.globalCompositeOperation = 'destination-in';
  const m = g.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size / 2);
  m.addColorStop(0, 'rgba(0,0,0,1)');
  m.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = m;
  g.fillRect(0, 0, size, size);
  return c;
}

type P = { x: number; y: number; vx: number; vy: number; r: number; gr: number; rot: number; vr: number; t: number; life: number; a: number };

export default function SmokeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
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
      const o = easeInOut(clamp(raw / 0.85));
      openRef.current = o;
      if (leftRef.current) leftRef.current.style.transform = `translate3d(${-o * 100}%,0,0)`;
      if (rightRef.current) rightRef.current.style.transform = `translate3d(${o * 100}%,0,0)`;
      if (seamRef.current) seamRef.current.style.opacity = String(Math.min(o * 6, (1 - o) * 4));
      if (cueRef.current) cueRef.current.style.opacity = String(1 - clamp(raw * 8));
      if (canvasRef.current) canvasRef.current.style.opacity = String(1 - clamp(o * 2.2));
      section.style.pointerEvents = o > 0.98 ? 'none' : '';
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
      const hero = section.nextElementSibling as HTMLElement | null;
      if (hero) hero.style.transform = '';
    };
  }, []);

  // Smoke that follows the pointer (and drifts on its own, for phones).
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const puff = makePuff();
    const SCALE = 0.6; // drawn smaller, stretched by CSS: smoke is soft anyway
    let W = 0;
    let H = 0;
    const size = () => {
      W = Math.round(canvas.clientWidth * SCALE);
      H = Math.round(canvas.clientHeight * SCALE);
      canvas.width = W;
      canvas.height = H;
    };
    size();
    const parts: P[] = [];
    const MAX = 140;
    const spawn = (x: number, y: number, vx: number, vy: number, big = 1, alpha = 0.4) => {
      if (parts.length >= MAX) parts.shift();
      parts.push({
        x, y, vx, vy,
        r: (34 + Math.random() * 30) * big,
        gr: 0.4 + Math.random() * 0.4,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.01,
        t: 0,
        life: 150 + Math.random() * 110,
        a: alpha * (0.75 + Math.random() * 0.5),
      });
    };

    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (openRef.current > 0.6) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * SCALE;
      const y = (e.clientY - rect.top) * SCALE;
      if (y < 0 || y > H) return;
      if (!last) last = { x, y };
      const dx = x - last.x;
      const dy = y - last.y;
      const steps = Math.min(6, Math.floor(Math.hypot(dx, dy) / 9));
      for (let i = 1; i <= steps; i++) {
        spawn(last.x + (dx * i) / steps, last.y + (dy * i) / steps, dx * 0.04 + (Math.random() - 0.5) * 0.4, dy * 0.04 - 0.15, 1, 0.24);
      }
      if (steps) last = { x, y };
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(section);
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    let raf = 0;
    let tick = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || openRef.current > 0.95) return;
      tick++;
      // ambient haze rolling in from the lower left and right edges
      if (tick % 20 === 0) {
        const side = Math.random() < 0.5;
        spawn(side ? -20 : W + 20, H * (0.55 + Math.random() * 0.4), side ? 0.45 + Math.random() * 0.35 : -0.45 - Math.random() * 0.35, -0.1, 1.5, 0.12);
      }
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.t++;
        if (p.t > p.life) {
          parts.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 - 0.006;
        p.r += p.gr;
        p.rot += p.vr;
        const k = p.t / p.life;
        ctx.globalAlpha = p.a * Math.sin(Math.PI * Math.min(1, k * 1.4 + 0.02)) * (1 - k);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(puff, -p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Welcome to Smart Choice LK"
      className="relative z-10 -mt-[76px] h-[200vh] motion-reduce:h-screen"
    >
      <div className="sticky top-0 h-screen min-h-[560px] overflow-hidden">
        <div ref={leftRef} className="absolute inset-y-0 left-0 w-1/2 overflow-hidden will-change-transform">
          <div className="absolute inset-y-0 left-0 w-[200%]">
            <Face />
          </div>
        </div>
        <div ref={rightRef} aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 overflow-hidden will-change-transform">
          <div className="absolute inset-y-0 right-0 w-[200%]">
            <Face copy />
          </div>
        </div>

        <div
          ref={seamRef}
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(transparent,#38BDF8,transparent)] opacity-0 shadow-[0_0_28px_6px_rgba(56,189,248,0.45)]"
        />
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

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
