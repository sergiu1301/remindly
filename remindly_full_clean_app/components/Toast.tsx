'use client';

import { useEffect } from 'react';

type Props = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // ⏱️ 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #1f2937, #111827)',
        color: 'white',
        padding: '14px 22px',
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        zIndex: 9999,
        animation: 'fadeInUp 0.3s ease',
        fontWeight: 600
      }}
    >
      {message}
    </div>
  );
}