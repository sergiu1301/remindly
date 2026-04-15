'use client';
export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { getMessages } from '@/lib/messages';
import { postJson } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get('token');
  
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const t = getMessages(language);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await postJson('/api/auth/reset-password', { token, password });

    if (!result.ok) {
      setMessage(result.json.error || 'Could not reset password.');
      return;
    }

    window.location.href = '/login';
  }

  return (
    <AuthShell language={language} setLanguage={setLanguage}>
      <h2 className="panelTitle">{t.resetTitle}</h2>
      <p className="panelSubtitle">{t.resetSubtitle}</p>

      {message ? <div className="alert alertError">{message}</div> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">{t.password}</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="button" type="submit">{t.savePassword}</button>
      </form>
    </AuthShell>
  );
}
