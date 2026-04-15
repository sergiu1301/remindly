'use client';

import { useEffect, useState } from 'react';
import { postJson } from '@/lib/auth-client';
import Toast from '@/components/Toast';
import Skeleton from '@/components/Skeleton';

type MeResponse = {
  user?: {
    fullName: string;
    email: string;
    phoneNumber?: string | null;
    language: 'en' | 'ro';
  };
};

const ui = {
  en: {
    title: 'Profile',
    subtitle: 'Manage your basic account settings.',
    back: 'Back',
    fullName: 'Full name',
    email: 'Email',
    phoneNumber: 'Phone number',
    language: 'Language',
    save: 'Save',
    saved: 'Saved successfully.',
    error: 'Could not save profile.',
    loading: 'Loading...',
    languages: {
      en: 'English',
      ro: 'Romanian'
    }
  },
  ro: {
    title: 'Profil',
    subtitle: 'Gestionează setările de bază ale contului tău.',
    back: 'Înapoi',
    fullName: 'Nume complet',
    email: 'Email',
    phoneNumber: 'Număr de telefon',
    language: 'Limbă',
    save: 'Salvează',
    saved: 'Salvat cu succes.',
    error: 'Profilul nu a putut fi salvat.',
    loading: 'Se încarcă...',
    languages: {
      en: 'Engleză',
      ro: 'Română'
    }
  }
} as const;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const [message, setMessage] = useState('');
  const [openLang, setOpenLang] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: MeResponse) => {
        if (data.user) {
          setFullName(data.user.fullName);
          setEmail(data.user.email);
          setPhoneNumber(data.user.phoneNumber || '');
          setLanguage(data.user.language);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const t = ui[language];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const result = await postJson('/api/profile', {
      fullName,
      phoneNumber,
      language
    });

    if (!result.ok) {
      setMessage(result.json.error || t.error);
      return;
    }

    setMessage(t.saved);
  }

  function changeLanguage(lang: 'en' | 'ro') {
    if (lang === language) return;
    setLanguage(lang);
    setOpenLang(false);
  }

  if (loading) {
  return (
    <div className="pageShell">
      <div className="appContainer">
        <div className="sectionCard">
          <Skeleton height={30} />
          <div style={{ height: 20 }} />
          <Skeleton height={20} />
          <div style={{ height: 30 }} />
          <Skeleton height={50} />
          <div style={{ height: 20 }} />
          <Skeleton height={50} />
          <div style={{ height: 20 }} />
          <Skeleton height={50} />
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="pageShell">
      <div className="appContainer">
        <section className="sectionCard">
          <div className="sectionHeader">
            <div>
              <h2 className="sectionTitle">{t.title}</h2>
              <p className="sectionCopy">{t.subtitle}</p>
            </div>
            <a className="buttonSecondary" href="/dashboard">
              {t.back}
            </a>
          </div>

          {message && <Toast message={message} onClose={() => setMessage('')} />}

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">{t.fullName}</label>
              <input
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">{t.email}</label>
              <input className="input" value={email} disabled />
            </div>

            <div className="formGridTwo">
              <div className="field">
                <label className="label">{t.phoneNumber}</label>
                <input
                  className="input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="field" style={{ position: 'relative' }}>
                <label className="label">{t.language}</label>

                <div
                  onClick={() => setOpenLang(!openLang)}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  🌐 {t.languages[language]}
                </div>

                {openLang && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 70,
                      left: 0,
                      width: '100%',
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
                          background:
                            language === lang
                              ? 'rgba(79,140,255,0.2)'
                              : 'transparent',
                          fontWeight: language === lang ? 700 : 500
                        }}
                      >
                        {t.languages[lang]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="button" type="submit">
              {t.save}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}