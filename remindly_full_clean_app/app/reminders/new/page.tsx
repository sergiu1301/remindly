import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import AppTopbar from '@/components/AppTopbar';
import ReminderForm from '@/components/ReminderForm';

const ui = {
  en: {
    title: 'Add reminder',
    subtitle: 'Create any reminder you want. Category is completely free text.'
  },
  ro: {
    title: 'Adaugă reminder',
    subtitle: 'Creează orice reminder dorești. Categoria este text liber.'
  }
} as const;

export default async function NewReminderPage() {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    redirect('/login');
  }

  const t = ui[user.language === 'ro' ? 'ro' : 'en'];

  return (
    <div className="pageShell">
      <div className="appContainer">
        <AppTopbar
          fullName={user.fullName}
          email={user.email}
          language={user.language === 'ro' ? 'ro' : 'en'}
        />

        <section className="sectionCard">
          <div className="sectionHeader">
            <div>
              <h2 className="sectionTitle">{t.title}</h2>
              <p className="sectionCopy">{t.subtitle}</p>
            </div>
          </div>

          <ReminderForm language={user.language === 'ro' ? 'ro' : 'en'} />
        </section>
      </div>
    </div>
  );
}