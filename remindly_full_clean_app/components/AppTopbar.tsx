'use client';

import { useState, useRef, useEffect } from 'react';

type Props = {
  fullName: string;
  email: string;
  language: 'en' | 'ro';
};

export default function AppTopbar({ fullName, email, language }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = fullName
    .split(' ')
    .map((x) => x[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // close dropdown when clicking outside
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
    <div className="topbar">
      <div className="brand">
        <div className="brandBadge">R</div>
        <div>
          <div className="brandTextTop">Secure reminders</div>
          <div style={{ fontWeight: 700, fontSize: 24 }}>Remindly</div>
        </div>
      </div>

      <div className="topbarActions">

        {/* USER DROPDOWN */}
        <div ref={ref} style={{ position: 'relative' }}>
          <div
            className="profileChip"
            onClick={() => setOpen(!open)}
            style={{ cursor: 'pointer' }}
          >
            <span className="avatar">{initials}</span>
            <span>
              <div style={{ fontWeight: 700 }}>{fullName}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{email}</div>
            </span>
          </div>

          {open && (
            <div
              style={{
                position: 'absolute',
                top: 60,
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

              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
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
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}