'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { TiltCard } from '@/components/fx';
import type { Product } from '@/types';

type Media = { type: 'video'; src: string; poster?: string } | { type: 'image'; src: string };

/**
 * Product media box. If the product has a video it plays first (muted, inline);
 * when it ends the gallery moves on to the photos. The video stays in the
 * thumbnail strip so it can be watched again.
 */
export default function ProductGallery({ product }: { product: Product }) {
  const calm = useReducedMotion();
  const photos = product.gallery?.length ? product.gallery : [product.image];
  const media: Media[] = [
    ...(product.video ? [{ type: 'video' as const, src: product.video.src, poster: product.video.poster ?? photos[0] }] : []),
    ...photos.map((src) => ({ type: 'image' as const, src })),
  ];

  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = media[index] ?? media[0];

  // If the video file is missing or can't play, quietly fall back to the photos
  useEffect(() => {
    if (failed && media[0]?.type === 'video' && index === 0) setIndex(1);
  }, [failed, index, media]);

  const playVideo = () => {
    setEnded(false);
    setIndex(0);
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = 0;
      v.play().catch(() => undefined);
    });
  };

  const visible = media.filter((m) => !(failed && m.type === 'video'));

  return (
    <div>
      <TiltCard max={current.type === 'image' ? 4 : 0} glare={current.type === 'image'} scale={1} className="rounded-[32px]">
        <div
          className={`relative aspect-square overflow-hidden rounded-[32px] bg-gradient-to-br from-mist to-slate-200 ${
            current.type === 'image' ? 'cursor-zoom-in' : ''
          }`}
          onPointerMove={(e) => {
            if (current.type !== 'image') return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onPointerLeave={() => setZoom((z) => ({ ...z, on: false }))}
        >
          <AnimatePresence mode="wait" initial={false}>
            {current.type === 'video' && !failed ? (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink"
              >
                <video
                  ref={videoRef}
                  src={current.src}
                  poster={current.poster}
                  autoPlay={!calm}
                  muted
                  playsInline
                  preload="auto"
                  controls={!!calm}
                  aria-label={`${product.name} — product video`}
                  className="h-full w-full object-cover"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration) setProgress(v.currentTime / v.duration);
                  }}
                  onEnded={() => {
                    setEnded(true);
                    if (media.length > 1) setTimeout(() => setIndex(1), 600);
                  }}
                  onError={() => setFailed(true)}
                />
                {/* progress bar */}
                <div className="absolute inset-x-5 bottom-5 h-1 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
                </div>
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> Product video
                </span>
                {ended && (
                  <button
                    onClick={playVideo}
                    className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink shadow-xl"
                    aria-label="Watch the video again"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.img
                key={current.src}
                src={current.src}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: zoom.on ? 1.6 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
                className="h-full w-full object-contain p-6"
              />
            )}
          </AnimatePresence>

          {current.type === 'image' && (
            <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
              {product.discount ? (
                <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">-{product.discount}%</span>
              ) : null}
              {product.inverter && (
                <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-electric backdrop-blur">
                  <Zap className="h-3 w-3" /> Inverter
                </span>
              )}
            </div>
          )}
        </div>
      </TiltCard>

      {visible.length > 1 && (
        <div className="sc-no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {media.map((m, i) => {
            if (failed && m.type === 'video') return null;
            const active = i === index;
            return (
              <button
                key={`${m.type}-${m.src}`}
                onClick={() => (m.type === 'video' ? playVideo() : setIndex(i))}
                aria-label={m.type === 'video' ? 'Play product video' : `Show photo ${i + 1}`}
                aria-pressed={active}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition-all ${
                  active ? 'ring-electric' : 'ring-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={m.type === 'video' ? m.poster ?? photos[0] : m.src} alt="" className={`h-full w-full ${m.type === 'video' ? 'object-cover' : 'object-contain p-1'}`} />
                {m.type === 'video' && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/40">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
