'use client';

import { useEffect, useState } from 'react';
import AuthShell from '@/components/AuthShell';
import { postJson } from '@/lib/auth-client';
import { getMessages } from '@/lib/messages';

export default function VerifyEmailPage() {
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [seconds, setSeconds] = useState(60);
  const [message, setMessage] = useState('');
  const t = getMessages(language);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((x) => x - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  async function resend() {
    const email = localStorage.getItem('pending_verification_email');
    if (!email) {
      setMessage('No email stored for verification.');
      return;
    }

    const result = await postJson('/api/auth/resend-verification', { email });
    if (!result.ok) {
      setMessage(result.json.error || 'Could not resend verification email.');
      return;
    }

    setMessage(t.statusEmailSent);
    setSeconds(60);
  }

  return (
    <AuthShell language={language} setLanguage={setLanguage}>
      <h2 className="panelTitle">{t.verifyTitle}</h2>
      <p className="panelSubtitle">{t.verifySubtitle}</p>

      {message ? <div className="alert alertSuccess">{message}</div> : null}

      <div className="alert">
        We block login until the email address is verified.
      </div>

      <div style={{ height: 16 }} />

      <button className="button" type="button" disabled={seconds > 0} onClick={resend}>
        {seconds > 0 ? `${t.resendIn} ${seconds}s` : t.resendNow}
      </button>

      <div style={{ height: 16 }} />
      <a className="helperLink" href="/login">{t.backToLogin}</a>
    </AuthShell>
  );
}
