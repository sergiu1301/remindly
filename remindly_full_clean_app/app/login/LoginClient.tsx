'use client';

import { useState } from 'react';
import AuthShell from '@/components/AuthShell';
import { postJson } from '@/lib/auth-client';
import { getMessages } from '@/lib/messages';

export default function LoginClient() {
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const t = getMessages(language);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const result = await postJson('/api/auth/login', { email, password });

    if (!result.ok) {
      if (result.json.error === 'EMAIL_NOT_VERIFIED') {
        localStorage.setItem('pending_verification_email', email);
        window.location.href = '/verify-email';
        return;
      }

      setMessage(
        result.json.error === 'INVALID_CREDENTIALS'
          ? t.statusInvalidCredentials
          : t.statusVerifyFirst
      );
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <AuthShell language={language} setLanguage={setLanguage}>
      <h2 className="panelTitle">{t.login}</h2>
      <p className="panelSubtitle">{t.loginSubtitle}</p>

      {message && <div className="alert alertError">{message}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button">{t.login}</button>

        <a className="helperLink" href="/forgot-password">
          {t.forgotPassword}
        </a>
      </form>
    </AuthShell>
  );
}