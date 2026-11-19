'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { whatsappLink } from '@/lib/site';

export function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.8 9.8 0 0 1-1.5-5.23c0-5.42 4.42-9.84 9.85-9.84a9.78 9.78 0 0 1 9.83 9.85c0 5.43-4.42 9.84-9.85 9.84zm8.38-18.22A11.77 11.77 0 0 0 12.04.1C5.5.1.17 5.42.17 11.97c0 2.1.55 4.13 1.59 5.93L.07 24l6.25-1.64a11.84 11.84 0 0 0 5.71 1.46h.01c6.54 0 11.87-5.33 11.87-11.88 0-3.17-1.24-6.16-3.49-8.4z" />
    </svg>
  );
}

export default function FloatingActions() {
  const path = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (path?.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[900] flex flex-col items-end gap-3">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/80 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-electric ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-all duration-300 hover:pr-5"
      >
        <span className="relative grid h-7 w-7 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
          <WhatsAppIcon className="relative h-6 w-6" />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-[120px]">
          Chat with us
        </span>
      </a>
    </div>
  );
}
