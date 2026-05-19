'use client';

import { useState, useRef, useEffect } from 'react';
import { LANGUAGES, type Locale } from '@/lib/i18n';
import { useLanguageStore } from '@/store/language.store';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5 text-sm text-white/60 hover:text-white transition-colors border border-white/10 hover:border-white/20"
      >
        <span>{LANGUAGES[locale].flag}</span>
        <span className="font-medium uppercase tracking-wide text-xs">{locale}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 glass-strong rounded-xl border border-white/10 overflow-hidden z-50 min-w-[140px] shadow-xl">
          {(Object.entries(LANGUAGES) as [Locale, typeof LANGUAGES[Locale]][]).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => { setLocale(code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-white/8 ${
                locale === code ? 'text-white bg-white/5' : 'text-white/50'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {locale === code && <span className="ml-auto text-purple-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
