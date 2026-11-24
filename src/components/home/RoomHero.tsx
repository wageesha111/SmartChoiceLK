'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ROOM_SCENES, sceneFromProgress, resolveHotspot, coverPoint } from '@/lib/roomScenes';
import { useStore } from '@/context/StoreContext';
import { TRUST_ITEMS } from '@/components/TrustRibbon';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { whatsappLink } from '@/lib/site';

/**
 * Full-screen room hero. The section is 400vh tall with a sticky stage, so three
 * screen-heights of scroll walk through AC → washer → fridge → TV. GSAP is used only to
 * snap onto each room (no GSAP pin: the Mirror Hall intro transforms this element
 * while it hands off, so everything here animates inner elements only).
 */

const N = ROOM_SCENES.length;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const parsePos = (focal: string): [number, number] => {
  const [x, y] = focal.split(' ').map((s) => parseFloat(s));
  return [x ?? 50, y ?? 50];
};

export default function RoomHero() {
  const { products: ALL_PRODUCTS } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shown, setShown] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [stage, setStage] = useState<[number, number]>([1440, 900]);

  // Stage size → hotspot placement on the object-cover photos
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStage([el.clientWidth || 1, el.clientHeight || 1]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll → cross-fade between rooms
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) return;

    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      const { index, local } = sceneFromProgress(p, N);
      const fadeIn = smooth(0.35, 0.65, local);
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        let o = 0;
        let s = 1;
        if (i === index) {
          o = 1;
          s = 1 + local * 0.04; // slow push-in
        } else if (i === index + 1) {
          o = fadeIn;
          s = 1.06 - 0.06 * fadeIn;
        }
        el.style.opacity = String(o);
        el.style.transform = `scale(${s})`;
        el.style.zIndex = i === index + 1 ? '2' : i === index ? '1' : '0';
      });
      const now = fadeIn > 0.5 ? index + 1 : index;
      if (now !== last) {
        last = now;
        setShown(now);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // gentle snap onto each room
    let kill: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.12, ease: 'power1.inOut' },
      });
      kill = () => st.kill();
    })();

    return () => {
      cancelled = true;
      kill?.();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    if (reduced) {
      setShown(i);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const total = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (N - 1)) * total, behavior: 'smooth' });
  };

  const scene = ROOM_SCENES[shown];

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        aria-label="Featured rooms"
        className="relative -mt-[100vh] h-[400vh] bg-ink text-white motion-reduce:mt-0 motion-reduce:h-auto"
      >
        <div ref={stageRef} className="sticky top-0 h-screen min-h-[560px] overflow-hidden motion-reduce:relative">
          {/* Room photos */}
          {ROOM_SCENES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              aria-hidden={i !== shown}
              className="absolute inset-0 will-change-transform motion-reduce:transition-opacity motion-reduce:duration-700"
              style={{ opacity: reduced ? (i === shown ? 1 : 0) : i === 0 ? 1 : 0 }}
            >
              <Image
                src={s.image}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: s.focal }}
              />
            </div>
          ))}

          {/* Ink at the top (the intro opens onto it), clear middle, dark under the text */}
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(to_bottom,#050B1A_0%,rgba(5,11,26,0.45)_20%,rgba(5,11,26,0.08)_42%,rgba(5,11,26,0.5)_58%,rgba(5,11,26,0.9)_86%,#050B1A_100%)]" />

          {/* Hotspots on the product */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              className="absolute inset-0 z-[4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {scene.hotspots.map((h) => {
                const text = resolveHotspot(h, ALL_PRODUCTS);
                if (!text) return null;
                const pt = coverPoint(h, scene.size, stage, parsePos(scene.focal));
                if (pt.x < 4 || pt.x > 92 || pt.y < 12 || (pt.y / 100) * stage[1] > stage[1] - 480) return null; // cropped off, or would sit on the headline
                return (
                  <button
                    key={`${h.productId}-${h.specKey}`}
                    type="button"
                    aria-label={text}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 p-2 outline-none"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  >
                    <span className="relative grid h-7 w-7 place-items-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-electric/40 motion-reduce:animate-none" />
                      <span className="relative h-3.5 w-3.5 rounded-full bg-electric shadow-[0_0_0_5px_rgba(47,107,255,0.3),0_0_18px_#2F6BFF] group-focus-visible:ring-2 group-focus-visible:ring-white" />
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-xl border border-white/15 bg-ink/75 px-3 py-2 text-left text-xs font-semibold leading-snug text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                      {text}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <div className="absolute inset-x-0 bottom-[150px] z-[5] px-5 text-center sm:bottom-[132px]">
            <AnimatePresence mode="wait">
              <motion.div key={scene.id} initial="hidden" animate="show" exit="out">
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 }, out: { opacity: 0, y: -10 } }}
                  transition={{ duration: 0.45 }}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85"
                >
                  {scene.eyebrow}
                </motion.p>
                <h1 className="mt-3 drop-shadow-[0_2px_18px_rgba(5,11,26,0.6)] font-display text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                  {[scene.title, scene.accent].map((part, k) => (
                    <motion.span
                      key={part}
                      className={`inline-block ${k === 1 ? 'sc-text-gradient' : ''}`}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 }, out: { opacity: 0, y: -16 } }}
                      transition={{ duration: 0.55, delay: 0.08 * k, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {part}&nbsp;
                    </motion.span>
                  ))}
                </h1>
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}
                  transition={{ duration: 0.5, delay: 0.16 }}
                  className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75 sm:text-base"
                >
                  {scene.line}
                </motion.p>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 }, out: { opacity: 0 } }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="mt-6 flex flex-wrap items-center justify-center gap-3"
                >
                  <Link
                    href={scene.cta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-electric px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(47,107,255,0.9)] transition-transform hover:-translate-y-0.5"
                  >
                    {scene.cta.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={whatsappLink(`Hi! I'd like a price on ${scene.eyebrow.toLowerCase()}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Get a price on WhatsApp
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Rail: which room, and jump to any */}
          <div className="absolute right-2 top-1/2 z-[6] flex -translate-y-1/2 flex-col items-center sm:right-5 motion-reduce:hidden">
            {ROOM_SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${s.eyebrow}`}
                aria-current={i === shown}
                className="grid h-10 w-10 place-items-center"
              >
                <span className={`w-[3px] rounded-full transition-all duration-500 ${i === shown ? 'h-7 bg-white' : 'h-3 bg-white/35'}`} />
              </button>
            ))}
          </div>

          {/* Reduced motion: tap to switch rooms */}
          {reduced && (
            <div className="absolute inset-x-0 top-24 z-[6] flex justify-center gap-2 px-4">
              {ROOM_SCENES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-pressed={i === shown}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${i === shown ? 'bg-white text-ink' : 'border border-white/20 bg-white/[0.06] text-white/80'}`}
                >
                  {s.eyebrow.split(' ').slice(-1)[0]}
                </button>
              ))}
            </div>
          )}

          {/* Trust strip */}
          <div className="absolute inset-x-0 bottom-4 z-[6] pl-4 pr-20 sm:bottom-6 sm:pr-28">
            <ul className="mx-auto flex max-w-[1100px] snap-x gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-md [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:overflow-visible">
              {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex min-w-max snap-start items-center gap-3 rounded-xl px-3 py-2 sm:min-w-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-electric-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-white sm:text-[13px]">{title}</span>
                    <span className="hidden text-[11px] leading-snug text-white/55 lg:block">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ink → warm stone hand-over into the shopping sections */}
      <div aria-hidden className="h-40 bg-gradient-to-b from-ink to-warm-stone sm:h-56" />
    </>
  );
}
