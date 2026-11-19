'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, type LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/data/products';

/* ───────── category colours ───────── */

export const CATEGORY_STYLE: Record<string, { from: string; to: string; soft: string; text: string; dot: string }> = {
  'air-conditioners': { from: '#38BDF8', to: '#2F6BFF', soft: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  refrigerators: { from: '#2DD4BF', to: '#0EA5E9', soft: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  'washing-machines': { from: '#A78BFA', to: '#6366F1', soft: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  televisions: { from: '#F472B6', to: '#8B5CF6', soft: 'bg-fuchsia-50', text: 'text-fuchsia-700', dot: 'bg-fuchsia-500' },
  kitchen: { from: '#FB923C', to: '#F43F5E', soft: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'small-appliances': { from: '#FBBF24', to: '#F97316', soft: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};
const FALLBACK = { from: '#94A3B8', to: '#475569', soft: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' };
export const catStyle = (id: string) => CATEGORY_STYLE[id] ?? FALLBACK;
export const catName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? id;

export const lkr = (n: number) => `Rs. ${Math.round(n).toLocaleString('en-LK')}`;

export function CategoryPill({ id, className = '' }: { id: string; className?: string }) {
  const s = catStyle(id);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.soft} ${s.text} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {catName(id)}
    </span>
  );
}

/* ───────── animated number ───────── */

export function CountUp({ value, format = (n: number) => Math.round(n).toLocaleString('en-LK'), duration = 900 }: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setShown(value);
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);
  return <span ref={ref}>{format(shown)}</span>;
}

/* ───────── stat card ───────── */

export function StatCard({
  icon: Icon,
  label,
  value,
  format,
  hint,
  from,
  to,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  format?: (n: number) => string;
  hint?: string;
  from: string;
  to: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_-18px_rgba(15,23,42,0.25)] backdrop-blur"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />
      <div
        className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 10px 24px -10px ${to}` }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-[13px] font-semibold text-slate-500">{label}</p>
      <p className="mt-0.5 font-display text-[26px] font-bold leading-tight tracking-tight text-ink">
        <CountUp value={value} format={format} />
      </p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </motion.div>
  );
}

/* ───────── toasts ───────── */

type ToastKind = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}
const ToastCtx = createContext<(text: string, kind?: ToastKind) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);
  const icon = { success: CheckCircle2, error: AlertTriangle, info: Info };
  const tone = {
    success: 'from-emerald-500 to-teal-500',
    error: 'from-rose-500 to-red-500',
    info: 'from-electric to-violet-500',
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:right-6 lg:left-auto lg:items-end">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icon[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink/95 p-3 pr-2 text-sm text-white shadow-2xl ring-1 ring-white/10 backdrop-blur"
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${tone[t.kind]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 font-medium">{t.text}</span>
                <button
                  onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
                  className="grid h-7 w-7 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────── confirm dialog ───────── */

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">{title}</h3>
            <div className="mt-1.5 text-sm leading-relaxed text-slate-500">{body}</div>
            <div className="mt-6 flex gap-2">
              <button onClick={onClose} className="flex-1 rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 hover:brightness-110"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────── page header ───────── */

export function PageHeader({ eyebrow, title, sub, action }: { eyebrow?: string; title: string; sub?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        {eyebrow && (
          <p className="bg-gradient-to-r from-electric to-violet-500 bg-clip-text text-xs font-bold uppercase tracking-[0.2em] text-transparent">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-[34px]">{title}</h1>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {action}
    </motion.div>
  );
}

export function GradientButton({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-electric via-indigo-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-electric/30 transition hover:shadow-xl hover:shadow-electric/40 hover:brightness-110 disabled:opacity-60 ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {children}
    </button>
  );
}
