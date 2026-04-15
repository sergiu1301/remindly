'use client';

import { useState, useRef, useEffect } from 'react';

export default function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      {/* CLICK AREA */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.05)'
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#4f8cff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600
          }}
        >
          {name.charAt(0)}
        </div>

        <div style={{ lineHeight: 1 }}>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{email}</div>
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 55,
            right: 0,
            width: 200,
            background: '#0b1220',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            zIndex: 1000
          }}
        >
          <a
            href="/profile"
            style={{
              display: 'block',
              padding: 10,
              borderRadius: 8,
              textDecoration: 'none',
              color: 'white'
            }}
          >
            Profile
          </a>

          <div
            style={{
              height: 1,
              background: 'rgba(255,255,255,0.1)',
              margin: '6px 0'
            }}
          />

          <button
            onClick={() => {
              document.cookie = 'remindly_session=; Max-Age=0; path=/';
              window.location.href = '/login';
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: 10,
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              color: '#ff6b6b',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}