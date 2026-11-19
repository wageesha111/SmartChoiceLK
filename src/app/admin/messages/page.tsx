'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, MapPin, Trash2, CheckCheck, Mail, MailOpen, Inbox, RotateCcw } from 'lucide-react';
import { adminDeleteInquiry, adminListInquiries, adminSetInquiryStatus, type Inquiry, type InquiryStatus } from '@/lib/shopExtras';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { ConfirmDialog, PageHeader, useToast } from '@/components/admin/ui';

type Filter = 'open' | 'new' | 'done' | 'all';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'open', label: 'To do' },
  { id: 'new', label: 'Unread' },
  { id: 'done', label: 'Done' },
  { id: 'all', label: 'All' },
];

const when = (iso: string) => {
  const d = new Date(iso);
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

/** Sri Lankan numbers → international format for wa.me links. */
const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('94')) return d;
  if (d.startsWith('0')) return '94' + d.slice(1);
  return d;
};

const STATUS_STYLE: Record<InquiryStatus, string> = {
  new: 'bg-gradient-to-r from-electric to-violet-500 text-white',
  read: 'bg-amber-100 text-amber-800',
  done: 'bg-emerald-100 text-emerald-800',
};
const STATUS_LABEL: Record<InquiryStatus, string> = { new: 'New', read: 'Seen', done: 'Done' };

export default function AdminMessagesPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Inquiry[] | null>(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState<Filter>('open');
  const [del, setDel] = useState<Inquiry | null>(null);

  useEffect(() => {
    adminListInquiries()
      .then(setRows)
      .catch((e) => setErr(e.message ?? 'Could not load messages'));
  }, []);

  const list = useMemo(
    () =>
      (rows ?? []).filter((r) =>
        filter === 'all' ? true : filter === 'open' ? r.status !== 'done' : filter === 'new' ? r.status === 'new' : r.status === 'done'
      ),
    [rows, filter]
  );
  const unread = (rows ?? []).filter((r) => r.status === 'new').length;

  const setStatus = async (r: Inquiry, status: InquiryStatus, msg?: string) => {
    try {
      await adminSetInquiryStatus(r.id, status);
      setRows((all) => all?.map((x) => (x.id === r.id ? { ...x, status } : x)) ?? null);
      if (msg) toast(msg);
      window.dispatchEvent(new Event('sc-admin-counts'));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not save', 'error');
    }
  };

  const remove = async () => {
    if (!del) return;
    const r = del;
    setDel(null);
    try {
      await adminDeleteInquiry(r.id);
      setRows((all) => all?.filter((x) => x.id !== r.id) ?? null);
      toast('Message deleted');
      window.dispatchEvent(new Event('sc-admin-counts'));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Customers" title="Messages" sub={rows ? `${rows.length} messages · ${unread} unread` : 'Loading…'} />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-bold transition ${filter === f.id ? 'text-white' : 'bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'}`}
          >
            {filter === f.id && <motion.span layoutId="msg-filter" className="absolute inset-0 rounded-full bg-gradient-to-r from-electric to-violet-500 shadow-lg shadow-electric/30" />}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {err && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</p>}
      {!rows && !err && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-white/70" />
          ))}
        </div>
      )}

      <ul className="space-y-3">
        <AnimatePresence initial={false}>
          {list.map((r, i) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              className={`relative overflow-hidden rounded-3xl border bg-white/90 p-5 shadow-[0_10px_40px_-22px_rgba(15,23,42,0.35)] backdrop-blur ${
                r.status === 'new' ? 'border-electric/30' : 'border-white/70'
              }`}
            >
              {r.status === 'new' && <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-electric to-violet-500" />}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-electric font-bold text-white shadow-md">
                    {r.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-tight text-ink">{r.name}</p>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {r.phone}
                      </span>
                      {r.town && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {r.town}
                        </span>
                      )}
                      <span>{when(r.created_at)}</span>
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
              </div>

              {r.topic && <p className="mt-4 inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{r.topic}</p>}
              {r.message ? (
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700">{r.message}</p>
              ) : (
                <p className="mt-3 text-sm italic text-slate-400">No message — they asked to be contacted.</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${r.phone.replace(/\s/g, '')}`}
                  onClick={() => r.status === 'new' && setStatus(r, 'read')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-xs font-bold text-white hover:bg-ink-700"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${waNumber(r.phone)}?text=${encodeURIComponent(`Hello ${r.name}, this is Smart Choice LK replying to your message.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => r.status === 'new' && setStatus(r, 'read')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white hover:brightness-105"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
                {r.status === 'new' && (
                  <button onClick={() => setStatus(r, 'read', 'Marked as seen')} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    <MailOpen className="h-4 w-4" /> Mark seen
                  </button>
                )}
                {r.status !== 'done' ? (
                  <button onClick={() => setStatus(r, 'done', 'Marked as done')} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-bold text-white">
                    <CheckCheck className="h-4 w-4" /> Done
                  </button>
                ) : (
                  <button onClick={() => setStatus(r, 'read', 'Moved back to To do')} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    <RotateCcw className="h-4 w-4" /> Reopen
                  </button>
                )}
                {r.status === 'read' && (
                  <button onClick={() => setStatus(r, 'new')} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    <Mail className="h-4 w-4" /> Mark unread
                  </button>
                )}
                <button onClick={() => setDel(r)} className="ml-auto grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white" aria-label="Delete message">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {rows && list.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-electric text-white shadow-lg shadow-electric/30">
            <Inbox className="h-6 w-6" />
          </div>
          <p className="mt-4 font-display text-lg font-bold">{filter === 'all' ? 'No messages yet' : 'Nothing here'}</p>
          <p className="mt-1 text-sm text-slate-500">Messages from the website’s contact form show up here.</p>
        </motion.div>
      )}

      <ConfirmDialog
        open={!!del}
        title="Delete this message?"
        body={
          <>
            The message from <b className="text-ink">{del?.name}</b> will be removed for good.
          </>
        }
        onClose={() => setDel(null)}
        onConfirm={remove}
      />
    </div>
  );
}
