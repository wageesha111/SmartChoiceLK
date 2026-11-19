'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ChevronDown, Send, Loader2, CheckCircle2 } from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { TiltCard, BorderBeam, Magnetic } from '@/components/fx';
import { WhatsAppIcon } from '@/components/FloatingActions';
import { FacebookIcon } from '@/components/SiteFooter';
import { useStore } from '@/context/StoreContext';
import { SITE, whatsappLink } from '@/lib/site';
import { sendInquiry } from '@/lib/shopExtras';

const TOPICS = ['Price / buying advice', 'Delivery & installation', 'Warranty or repair help', 'Bulk / business order', 'Something else'];

const FAQS = [
  {
    q: 'Do you deliver outside Seeduwa?',
    a: 'Yes — we deliver across Sri Lanka. Send us your town on WhatsApp and we’ll confirm the delivery date and any charges before you pay.',
  },
  {
    q: 'Can you install the AC for me?',
    a: 'Yes. Our team can install ACs and set up large appliances at your home. Installation costs depend on the unit and the piping length needed, so we’ll quote you first.',
  },
  {
    q: 'How does the warranty work?',
    a: 'Products come with the manufacturer’s warranty. Keep your bill and warranty card; if anything goes wrong, message us and we’ll help you get it serviced.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Cash, bank transfer and card payments, with installment plans on selected cards. Ask us which options apply to the product you want.',
  },
  {
    q: 'Can I see the product before buying?',
    a: `Of course — visit the shop at ${SITE.address}. We’re ${SITE.hours.toLowerCase()}. Call ahead if you want us to keep a specific model ready.`,
  },
];

const field =
  'w-full rounded-2xl bg-white px-4 py-3.5 text-[15px] text-ink ring-1 ring-slate-200 transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-electric';

export default function ContactPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', topic: TOPICS[0], town: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [open, setOpen] = useState<number | null>(0);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loadedAt] = useState(() => Date.now());

  const waText = () =>
    `Hello ${SITE.name}!\nName: ${form.name}\nPhone: ${form.phone}\nTopic: ${form.topic}${form.town ? `\nTown: ${form.town}` : ''}${
      form.message ? `\n\n${form.message}` : ''
    }`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Please enter your name.';
    if (!/^[0-9+\s-]{9,15}$/.test(form.phone.trim())) errs.phone = 'Please enter a valid phone number, e.g. 077 123 4567.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (Date.now() - loadedAt < 2500) return; // bots submit instantly
    setSending(true);
    const ok = await sendInquiry(form);
    setSending(false);
    if (ok) {
      setSent(true);
      showToast('Message sent — we’ll call you back soon', '✅');
    } else {
      window.open(whatsappLink(waText()), '_blank');
      showToast('Opening WhatsApp with your message…', '💬');
    }
  };

  const cards = [
    { icon: Phone, label: 'Call us', value: SITE.phoneDisplay, href: `tel:${SITE.phoneTel}` },
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: 'Visit', value: SITE.address, href: SITE.mapsUrl },
    { icon: Clock, label: 'Hours', value: SITE.hours },
  ];

  return (
    <div className="bg-mist font-sans text-ink antialiased">
      <SiteNavbar />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let’s find the <span className="sc-text-gradient">right one</span> for your home.
          </>
        }
        sub="Questions about a product, delivery or installation? Message us — a real person replies."
        crumbs={[{ label: 'Contact' }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="sc-shimmer inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-bold text-white"
            >
              <WhatsAppIcon /> WhatsApp {SITE.phoneDisplay}
            </a>
          </Magnetic>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-4 font-bold text-white backdrop-blur-md hover:bg-white/10"
          >
            <Phone className="h-4 w-4" /> Call now
          </a>
        </div>
      </PageHeader>

      <main className="mx-auto max-w-[1280px] px-5 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, href }, i) => (
            <Reveal key={label} delay={i * 0.06}>
              <TiltCard max={6} className="h-full rounded-[26px]">
                {React.createElement(
                  href ? 'a' : 'div',
                  {
                    href,
                    target: href?.startsWith('http') ? '_blank' : undefined,
                    rel: href?.startsWith('http') ? 'noreferrer' : undefined,
                    className: 'group flex h-full flex-col rounded-[26px] bg-white p-6 ring-1 ring-slate-200/80 transition-shadow hover:shadow-xl',
                  },
                  <>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white transition-colors group-hover:bg-electric">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                    <p className={`mt-1 break-words font-display font-semibold ${value.includes('@') ? 'text-[15px]' : 'text-lg'}`}>{value}</p>
                    {href && <ArrowUpRight className="mt-auto h-5 w-5 self-end pt-1 text-slate-300 group-hover:text-electric" />}
                  </>
                )}
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Form → WhatsApp */}
          <Reveal>
            <form onSubmit={submit} noValidate className="relative overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-slate-200/80 sm:p-10">
              <BorderBeam duration={10} />
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Send us a message</h2>
              <p className="mt-2 text-sm text-slate-500">We’ll get back to you by phone or WhatsApp, usually the same day.</p>

              {sent ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-3xl bg-emerald-50 p-6 text-center sm:p-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <p className="mt-3 font-display text-xl font-bold">Thank you, {form.name.split(' ')[0] || 'friend'}!</p>
                  <p className="mt-1 text-sm text-slate-600">Your message reached us. We’ll contact you on {form.phone || 'your phone'} soon.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a href={whatsappLink(waText())} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white">
                      <WhatsAppIcon className="h-4 w-4" /> Also chat on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setForm({ name: '', phone: '', topic: TOPICS[0], town: '', message: '' });
                      }}
                      className="rounded-full bg-white px-5 py-3 text-sm font-bold text-ink ring-1 ring-slate-200"
                    >
                      Send another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                    Your name <span className="text-rose-500">*</span>
                  </label>
                  <input id="name" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby="name-err" className={field} />
                  {errors.name && <p id="name-err" className="mt-1.5 text-sm text-rose-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                    Phone <span className="text-rose-500">*</span>
                  </label>
                  <input id="phone" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby="phone-err" className={field} />
                  {errors.phone && <p id="phone-err" className="mt-1.5 text-sm text-rose-600">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="topic" className="mb-2 block text-sm font-semibold">Topic</label>
                  <select id="topic" value={form.topic} onChange={set('topic')} className={`${field} cursor-pointer`}>
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="town" className="mb-2 block text-sm font-semibold">Your town</label>
                  <input id="town" value={form.town} onChange={set('town')} autoComplete="address-level2" className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="msg" className="mb-2 block text-sm font-semibold">Message</label>
                  <textarea id="msg" rows={4} value={form.message} onChange={set('message')} className={`${field} resize-none`} />
                  <p className="mt-1.5 text-xs text-slate-400">e.g. which product, room size, or the model number of an appliance that needs help.</p>
                </div>
              </div>
              <button type="submit" disabled={sending} className="mt-8 inline-flex disabled:opacity-60 items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white transition-colors hover:bg-electric">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {sending ? 'Sending…' : 'Send message'}
              </button>
                </>
              )}
            </form>
          </Reveal>

          {/* Map + Facebook */}
          <div className="grid gap-6">
            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-[28px] bg-white ring-1 ring-slate-200/80">
                <iframe
                  title={`Map of ${SITE.address}`}
                  src="https://www.google.com/maps?q=Raddoluwa,+Seeduwa,+Sri+Lanka&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-0 grayscale-[30%]"
                />
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-display font-semibold">{SITE.name}</p>
                    <p className="text-sm text-slate-500">{SITE.address}</p>
                  </div>
                  <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-electric">
                    Directions
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center justify-between overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1877F2] to-electric-700 p-6 text-white"
              >
                <FacebookIcon className="absolute -right-6 -top-6 h-32 w-32 text-white/10" />
                <div className="relative">
                  <p className="font-display text-lg font-semibold">Follow us on Facebook</p>
                  <p className="text-sm text-white/75">New arrivals, price drops and offers</p>
                </div>
                <ArrowUpRight className="relative h-6 w-6 transition-transform group-hover:rotate-45" />
              </a>
            </Reveal>
          </div>
        </div>

        {/* FAQ */}
        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">Common questions</h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold"
                  >
                    {f.q}
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
