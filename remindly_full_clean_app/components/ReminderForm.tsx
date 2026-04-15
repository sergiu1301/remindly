'use client';

import { useState } from 'react';
import { postJson } from '@/lib/auth-client';
import Toast from '@/components/Toast';

type Props = {
  defaultValues?: {
    title?: string;
    category?: string;
    description?: string;
    dueDate?: string;
    notifyBefore?: number;
  };
  language?: 'en' | 'ro';
};

const ui = {
  en: {
    title: 'Title',
    category: 'Category',
    notifyBefore: 'Notify days before',
    dueDate: 'Due date',
    description: 'Description',
    save: 'Save reminder',
    titlePlaceholder: 'Electricity bill',
    categoryPlaceholder: 'bill, subscription, custom...',
    descriptionPlaceholder: 'Optional details',
    error: 'Could not save reminder.'
  },
  ro: {
    title: 'Titlu',
    category: 'Categorie',
    notifyBefore: 'Notifică cu câte zile înainte',
    dueDate: 'Dată limită',
    description: 'Descriere',
    save: 'Salvează reminderul',
    titlePlaceholder: 'Factura la electricitate',
    categoryPlaceholder: 'factură, abonament, personalizat...',
    descriptionPlaceholder: 'Detalii opționale',
    error: 'Reminderul nu a putut fi salvat.'
  }
} as const;

export default function ReminderForm({ defaultValues, language = 'en' }: Props) {
  const [title, setTitle] = useState(defaultValues?.title || '');
  const [category, setCategory] = useState(defaultValues?.category || '');
  const [description, setDescription] = useState(defaultValues?.description || '');
  const [dueDate, setDueDate] = useState(defaultValues?.dueDate || '');
  const [notifyBefore, setNotifyBefore] = useState(String(defaultValues?.notifyBefore ?? 7));
  const [message, setMessage] = useState('');

  const t = ui[language];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const result = await postJson('/api/reminders', {
      title,
      category,
      description,
      dueDate,
      notifyBefore
    });

    if (!result.ok) {
      setMessage(result.json.error || t.error);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && <Toast message={message} onClose={() => setMessage('')} />}

      <div className="field">
        <label className="label">{t.title}</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.titlePlaceholder}
        />
      </div>

      <div className="formGridTwo">
        <div className="field">
          <label className="label">{t.category}</label>
          <input
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t.categoryPlaceholder}
          />
        </div>

        <div className="field">
          <label className="label">{t.notifyBefore}</label>
          <input
            className="input"
            type="number"
            value={notifyBefore}
            onChange={(e) => setNotifyBefore(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">{t.dueDate}</label>
        <input
          className="input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">{t.description}</label>
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.descriptionPlaceholder}
        />
      </div>

      <button className="button" type="submit">
        {t.save}
      </button>
    </form>
  );
}