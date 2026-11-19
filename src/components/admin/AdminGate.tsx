'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Session } from '@supabase/supabase-js';
import { LogOut, Loader2, ShieldAlert, Store } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { adminIsAllowed } from '@/lib/shopProducts';

type State = 'loading' | 'signed-out' | 'recovery' | 'not-allowed' | 'ok' | 'no-config';

/** Wraps every /admin page: login, password reset and the "is this person an admin?" check. */
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2 font-display text-[17px] font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-xs font-extrabold text-white">SC</span>
            Shop admin
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <Store className="h-4 w-4" /> Website
            </Link>
            {session && (
              <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
        {state === 'loading' && (
          <div className="flex justify-center py-24 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {state === 'no-config' && (
          <Notice title="Supabase isn’t set up">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env</code> and restart the
            site.
          </Notice>
        )}
        {state === 'signed-out' && <LoginForm />}
        {state === 'recovery' && <NewPasswordForm onDone={() => setState('loading')} />}
        {state === 'not-allowed' && (
          <Notice title="This account can’t edit the shop">
            You’re signed in as <b>{session?.user.email}</b>, but this email isn’t on the shop’s admin list. Ask the site owner to add it.
          </Notice>
        )}
        {state === 'ok' && children}
      </main>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <div className="flex items-center gap-2 font-display text-lg font-bold">
        <ShieldAlert className="h-5 w-5" /> {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

const input =
  'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-electric focus:ring-4 focus:ring-electric/15';

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

  const title = mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create admin account' : 'Reset password';
  return (
    <form onSubmit={submit} className="mx-auto mt-6 max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">Smart Choice LK products — add, edit and remove items.</p>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold">Email</span>
        <input className={input} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {mode !== 'forgot' && (
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold">Password</span>
          <input
            className={input}
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}
      {msg && <p className={`rounded-2xl px-4 py-3 text-sm ${msg.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>}
      <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-base font-bold text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} {title}
      </button>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        {mode !== 'login' ? (
          <button type="button" onClick={() => setMode('login')} className="font-semibold text-electric">
            Back to log in
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setMode('forgot')} className="font-semibold text-electric">
              Forgot password?
            </button>
            <button type="button" onClick={() => setMode('signup')} className="font-semibold text-electric">
              First time? Create account
            </button>
          </>
        )}
      </div>
    </form>
  );
}

function NewPasswordForm({ onDone }: { onDone: () => void }) {
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
    onDone();
    location.reload();
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-6 max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="font-display text-2xl font-bold">Set a new password</h1>
      <input className={input} type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}
      <button disabled={busy} className="w-full rounded-2xl bg-ink py-3.5 font-bold text-white disabled:opacity-60">
        Save password
      </button>
    </form>
  );
}
