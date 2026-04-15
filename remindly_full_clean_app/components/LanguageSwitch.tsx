'use client';

type Props = {
  language: 'en' | 'ro';
  onChange: (nextLanguage: 'en' | 'ro') => void;
};

export default function LanguageSwitch({ language, onChange }: Props) {
  return (
    <div className="langSwitch">
      <button
        type="button"
        className={`langButton ${language === 'en' ? 'langButtonActive' : ''}`}
        onClick={() => onChange('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={`langButton ${language === 'ro' ? 'langButtonActive' : ''}`}
        onClick={() => onChange('ro')}
      >
        RO
      </button>
    </div>
  );
}
