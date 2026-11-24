'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MessageCircle, Search, Store, ShieldCheck, Zap, HeartHandshake, MapPin, ArrowRight } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import PageHeader from '@/components/PageHeader';
import TrustRibbon from '@/components/TrustRibbon';
import Reveal, { SectionHeading } from '@/components/Reveal';
import { ScrubText, TiltCard, NumberTicker, Spotlight } from '@/components/fx';
import { SITE } from '@/lib/site';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  { icon: MessageCircle, n: '01', t: 'Tell us what you need', d: 'Message, call or walk in. Share your room size, family size and budget.' },
  { icon: Search, n: '02', t: 'We recommend honestly', d: 'We compare models and brands for you — including when a cheaper option is the better choice.' },
  { icon: Store, n: '03', t: 'Collect from our shop', d: 'We keep your appliance ready at our Raddoluwa, Seeduwa shop for you to pick up.' },
  { icon: HeartHandshake, n: '04', t: 'Supported after you buy', d: 'Help with warranty questions, and answers on WhatsApp whenever you need them.' },
];

const VALUES = [
  { icon: ShieldCheck, t: 'Genuine products', d: 'Original stock with the manufacturer’s warranty card.' },
  { icon: Zap, t: 'Energy-smart advice', d: 'Inverter models sized right, so your electricity bill stays low.' },
  { icon: HeartHandshake, t: 'Local and personal', d: 'A neighbourhood shop in Raddoluwa that knows its customers.' },
];

function HowWeWork() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // One pinned horizontal scene on large screens; plain grid elsewhere / reduced motion
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 80;
        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        // Icons spin in as each card slides into view (driven by the horizontal tween)
        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((card) => {
          gsap.from(card.querySelector('[data-step-icon]'), {
            rotate: -120,
            scale: 0.4,
            opacity: 0,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left 85%', end: 'left 55%', scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );

  return (
    <section ref={wrap} className="relative overflow-hidden bg-ink py-24 text-white lg:flex lg:h-screen lg:items-center lg:py-0">
      <div className="sc-grid-bg pointer-events-none absolute inset-0" />
      <Spotlight />
      <div ref={track} className="relative flex flex-col gap-5 px-5 lg:flex-row lg:items-stretch lg:gap-6 lg:pl-[max(20px,calc((100vw-1280px)/2+20px))]">
        <div className="flex shrink-0 flex-col justify-center lg:w-[420px] lg:pr-10">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-electric-300">
            <span className="h-px w-6 bg-current" /> How we work
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            From first question to <span className="text-white/40">after-sales care.</span>
          </h2>
          <p className="mt-5 hidden text-white/50 lg:block">Keep scrolling →</p>
        </div>
        {STEPS.map(({ icon: Icon, n, t, d }) => (
          <div key={n} data-step className="shrink-0 lg:w-[380px]">
            <TiltCard max={7} className="h-full rounded-[28px]">
              <div className="flex h-full min-h-[300px] flex-col rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-md lg:min-h-[420px]">
                <div className="flex items-start justify-between">
                  <span data-step-icon className="grid h-14 w-14 place-items-center rounded-2xl bg-electric shadow-[0_0_40px_-6px_rgba(47,107,255,0.9)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-6xl font-extrabold text-white/10">{n}</span>
                </div>
                <h3 className="mt-auto pt-10 font-display text-2xl font-bold">{t}</h3>
                <p className="mt-3 text-white/60">{d}</p>
              </div>
            </TiltCard>
          </div>
        ))}
        <div className="hidden w-10 shrink-0 lg:block" />
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-white font-sans text-ink antialiased">
      <SiteNavbar />
      <PageHeader
        eyebrow="About us"
        title={
          <>
            Your neighbourhood <span className="sc-text-gradient">electronics shop</span> in Seeduwa.
          </>
        }
        sub={`${SITE.name} is a one-stop shop for quality home electronics — with honest advice, fair prices and proper after-sales care.`}
        crumbs={[{ label: 'About' }]}
      >
        <div className="mt-10 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
          {[
            { n: 990, s: '+', l: 'Facebook followers' },
            { n: 100, s: '%', l: 'Recommend us on Facebook' },
            { n: 7, s: ' days', l: 'Open every week' },
          ].map((x) => (
            <div key={x.l} className="bg-ink/90 p-4 sm:p-6">
              <p className="font-display text-2xl font-bold sm:text-3xl">
                <NumberTicker value={x.n} suffix={x.s} />
              </p>
              <p className="mt-1 text-[11px] text-white/50 sm:text-sm">{x.l}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      <section className="mx-auto max-w-[1280px] px-5 py-24">
        <ScrubText
          text="We started Smart Choice LK because buying an appliance should feel simple. Ask us anything — we’ll tell you what we’d buy for our own home."
          className="max-w-5xl font-display text-3xl font-semibold leading-[1.18] tracking-tight sm:text-5xl"
        />
      </section>

      <HowWeWork />

      <section className="mx-auto max-w-[1280px] px-5 py-24">
        <SectionHeading eyebrow="What we stand for" title="Small shop. High standards." />
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.07}>
              <TiltCard max={6} className="h-full rounded-[26px]">
                <div className="h-full rounded-[26px] bg-mist p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-electric shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-10 font-display text-xl font-semibold">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{d}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4">
          <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-electric to-electric-700 p-8 text-white sm:flex-row sm:items-center sm:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-glow/40 blur-3xl" />
            <div className="relative">
              <p className="flex items-center gap-2 text-sm text-white/75">
                <MapPin className="h-4 w-4" /> {SITE.address}
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold">Come and see us — {SITE.hours.toLowerCase()}.</h3>
            </div>
            <Link href="/contact" className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-4 font-bold text-ink hover:bg-ink hover:text-white">
              Get directions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <TrustRibbon />
      <SiteFooter />
    </div>
  );
}
