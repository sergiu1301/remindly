'use client';

import { useState } from 'react';
import AuthShell from '@/components/AuthShell';
import { getMessages } from '@/lib/messages';
import { postJson } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const t = getMessages(language);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await postJson('/api/auth/forgot-password', { email });

    if (!result.ok) {
      setMessage(result.json.error || 'Could not send reset email.');
      return;
    }

    setMessage(t.statusEmailSent);
  }

  return (
    <AuthShell language={language} setLanguage={setLanguage}>
      <h2 className="panelTitle">{t.forgotTitle}</h2>
      <p className="panelSubtitle">{t.forgotSubtitle}</p>

      {message ? <div className="alert alertSuccess">{message}</div> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">{t.email}</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <button className="button" type="submit">{t.sendLink}</button>

        <a className="helperLink" href="/login">{t.backToLogin}</a>
      </form>
    </AuthShell>
  );
}
