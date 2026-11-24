'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsDown } from 'lucide-react';

const TARGET = 'categories-section';

/**
 * Floating "Skip to shop" pill shown while the long scroll-driven intro and room hero are on screen.
 * One tap jumps straight to the shop sections, so returning visitors don't have to scroll through it again.
 */
export default function SkipIntroButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const el = document.getElementById(TARGET);
      if (!el) return setShow(false);
      // visible until the shop section reaches the lower part of the screen
      setShow(el.getBoundingClientRect().top > window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    // short delay on first load so the intro gets a moment on its own
    const t = window.setTimeout(check, 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const skip = () => {
    const el = document.getElementById(TARGET);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70; // leave room for the header
    // jump instantly: smooth-scrolling would play the whole intro at high speed
    window.scrollTo({ top, behavior: 'auto' });
    delete document.documentElement.dataset.intro; // bring the header back straight away
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={skip}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-4 z-[60] inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:bg-white/20 sm:bottom-6 sm:left-6 sm:px-5"
        >
          Skip to shop
          <ChevronsDown className="h-4 w-4 animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
