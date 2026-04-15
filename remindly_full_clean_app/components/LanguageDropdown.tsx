'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  current: 'en' | 'ro';
};

export default function LanguageDropdown({ current }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const labels = {
    en: {
      en: 'English',
      ro: 'Romanian'
    },
    ro: {
      en: 'Engleză',
      ro: 'Română'
    }
  };

  async function changeLanguage(lang: 'en' | 'ro') {
    if (lang === current) return;

    await fetch('/api/user/language', {
      method: 'POST',
      body: JSON.stringify({ language: lang }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    router.refresh();
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        🌐 {labels[current][current]}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            width: 180,
            background: '#0b1220',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        >
          {(['en', 'ro'] as const).map((lang) => (
            <div
              key={lang}
              onClick={() => changeLanguage(lang)}
              style={{
                padding: 10,
                borderRadius: 8,
                cursor: 'pointer',
                background: current === lang ? 'rgba(79,140,255,0.2)' : 'transparent',
                fontWeight: current === lang ? 700 : 500
              }}
            >
              {labels[current][lang]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}