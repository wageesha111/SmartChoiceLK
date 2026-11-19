'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Store,
  LogOut,
  Loader2,
  ShieldAlert,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { adminIsAllowed } from '@/lib/shopProducts';
import { ToastProvider } from './ui';

type State = 'loading' | 'signed-out' | 'recovery' | 'not-allowed' | 'ok' | 'no-config';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/new', label: 'Add product', icon: PlusCircle },
];

/** Wraps every /admin page: login, password reset, the admin check and the app shell. */
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>('loading');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setState('no-config');
      return;
    }
    const check = async (s: Session | null) => {
      setSession(s);
      if (!s) return setState('signed-out');
      setState((await adminIsAllowed()) ? 'ok' : 'not-allowed');
    };
    sb.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSession(s);
        setState('recovery');
        return;
      }
      check(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = () => getSupabase()?.auth.signOut();

  if (state === 'ok') {
    return (
      <ToastProvider>
        <Shell email={session?.user.email ?? ''} onSignOut={signOut}>
          {children}
        </Shell>
      </ToastProvider>
    );
  }

  return (
    <AuthBackdrop>
      {state === 'loading' && <Loader2 className="h-7 w-7 animate-spin text-white/70" />}
      {state === 'no-config' && (
        <Notice title="Supabase isn’t set up">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> and
          restart the site.
        </Notice>
      )}
      {state === 'signed-out' && <LoginForm />}
      {state === 'recovery' && <NewPasswordForm />}
      {state === 'not-allowed' && (
        <Notice title="This account can’t edit the shop" onSignOut={signOut}>
          You’re signed in as <b>{session?.user.email}</b>, but this email isn’t on the shop’s admin list. Ask the site owner to add it.
        </Notice>
      )}
    </AuthBackdrop>
  );
}

/* ───────── app shell ───────── */

function Shell({ email, onSignOut, children }: { email: string; onSignOut: () => void; children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));
  const initial = email.charAt(0).toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-[#F4F6FB] font-sans text-ink">
      {/* soft colour blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-electric/15 blur-[110px]" />
        <div className="absolute right-[-120px] top-1/3 h-[420px] w-[420px] rounded-full bg-violet-400/15 blur-[110px]" />
        <div className="absolute bottom-[-160px] left-1/3 h-[420px] w-[420px] rounded-full bg-sky-300/20 blur-[120px]" />
      </div>

      {/* sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col overflow-hidden bg-gradient-to-b from-ink-900 via-ink-800 to-[#1B1350] p-5 text-white lg:flex">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-electric/30 blur-[90px]" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-10 h-64 w-64 rounded-full bg-violet-500/30 blur-[90px]" />

        <Link href="/admin" className="relative flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-glow to-electric font-display text-sm font-extrabold shadow-lg shadow-electric/40">
            SC
          </span>
          <span>
            <span className="block font-display text-[17px] font-bold leading-tight">Smart Choice</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Admin</span>
          </span>
        </Link>

        <nav className="relative mt-10 space-y-1.5">
          {NAV.map((n) => {
            const on = active(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  on ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="admin-nav"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric to-violet-500 shadow-lg shadow-electric/40"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <n.icon className="relative h-[18px] w-[18px]" />
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Store className="h-[18px] w-[18px]" /> View website
          </Link>
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 text-sm font-bold">
              {initial}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-white/70">{email}</span>
            <button onClick={onSignOut} className="grid h-8 w-8 place-items-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* top bar (mobile) */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/60 bg-white/70 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display text-[17px] font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-glow to-electric text-xs font-extrabold text-white">SC</span>
          Admin
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" target="_blank" className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100" aria-label="View website">
            <Store className="h-5 w-5" />
          </Link>
          <button onClick={onSignOut} className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100" aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 px-4 pb-32 pt-6 sm:px-6 lg:ml-[264px] lg:px-10 lg:pb-16 lg:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-6xl"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* bottom tabs (mobile) */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-3xl bg-ink/95 p-1.5 text-white shadow-2xl shadow-ink/40 ring-1 ring-white/10 backdrop-blur lg:hidden">
        {NAV.map((n) => {
          const on = active(n.href);
          return (
            <Link key={n.href} href={n.href} className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-semibold">
              {on && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric to-violet-500"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <n.icon className={`relative h-5 w-5 ${on ? '' : 'text-white/60'}`} />
              <span className={`relative ${on ? '' : 'text-white/60'}`}>{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* ───────── auth screens ───────── */

function AuthBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 py-10 font-sans">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-electric/40 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-violet-500/40 blur-[130px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/25 blur-[110px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </div>
  );
}

function Notice({ title, children, onSignOut }: { title: string; children: React.ReactNode; onSignOut?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-2xl"
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="mt-4 font-display text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{children}</p>
      {onSignOut && (
        <button onClick={onSignOut} className="mt-6 w-full rounded-2xl bg-white py-3 text-sm font-bold text-ink hover:bg-white/90">
          Sign out
        </button>
      )}
    </motion.div>
  );
}

const authInput =
  'w-full rounded-2xl border border-white/15 bg-white/10 py-3.5 pl-11 pr-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-glow focus:bg-white/15 focus:ring-4 focus:ring-glow/20';

function LoginForm() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'login') {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === 'signup') {
        const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/admin` } });
        if (error) throw error;
        if (!data.session) setMsg({ ok: true, text: 'Account created. Check your email and tap the confirm link, then log in here.' });
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin` });
        if (error) throw error;
        setMsg({ ok: true, text: 'We sent a password reset link to your email.' });
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create admin account' : 'Reset your password';
  const cta = mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link';

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-7 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-glow to-electric font-display text-base font-extrabold shadow-lg shadow-electric/40">
          SC
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-glow" /> Shop admin
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
          <h1 className="mt-6 font-display text-[28px] font-bold leading-tight">{title}</h1>
          <p className="mt-1 text-sm text-white/60">Manage Smart Choice LK products, prices and stock.</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 space-y-3">
        <label className="relative block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/40" />
          <input className={authInput} type="email" placeholder="Email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode !== 'forgot' && (
          <label className="relative block">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/40" />
            <input
              className={authInput}
              type="password"
              placeholder="Password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
      </div>

      <AnimatePresence>
        {msg && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 overflow-hidden rounded-2xl px-4 py-3 text-sm ${msg.ok ? 'bg-emerald-400/15 text-emerald-200' : 'bg-rose-400/15 text-rose-200'}`}
          >
            {msg.text}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        disabled={busy}
        className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-glow via-electric to-violet-500 py-3.5 text-base font-bold shadow-lg shadow-electric/40 transition hover:brightness-110 disabled:opacity-60"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {cta}
        {!busy && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
      </button>

      <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
        {mode !== 'login' ? (
          <button type="button" onClick={() => { setMode('login'); setMsg(null); }} className="font-semibold text-glow hover:text-white">
            Back to log in
          </button>
        ) : (
          <>
            <button type="button" onClick={() => { setMode('forgot'); setMsg(null); }} className="font-semibold text-white/60 hover:text-white">
              Forgot password?
            </button>
            <button type="button" onClick={() => { setMode('signup'); setMsg(null); }} className="font-semibold text-glow hover:text-white">
              First time? Create account
            </button>
          </>
        )}
      </div>
    </motion.form>
  );
}

function NewPasswordForm() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (error) return setErr(error.message);
    location.reload();
  };
  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-2xl"
    >
      <h1 className="font-display text-2xl font-bold">Set a new password</h1>
      <label className="relative mt-5 block">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/40" />
        <input className={authInput} type="password" placeholder="New password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {err && <p className="mt-3 rounded-2xl bg-rose-400/15 px-4 py-3 text-sm text-rose-200">{err}</p>}
      <button disabled={busy} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-glow via-electric to-violet-500 py-3.5 font-bold disabled:opacity-60">
        Save password
      </button>
    </motion.form>
  );
}
