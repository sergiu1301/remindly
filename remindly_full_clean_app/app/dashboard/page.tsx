import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { getMessages } from '@/lib/messages';
import AppTopbar from '@/components/AppTopbar';
import ReminderList from '@/components/ReminderList';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { reminders: { orderBy: { dueDate: 'asc' } } }
  });

  if (!user) {
    redirect('/login');
  }

  if (!user.emailVerified) {
    redirect('/verify-email');
  }

  const t = getMessages(user.language);

  const now = new Date();
  const active = user.reminders.filter((x) => !x.isCompleted && x.dueDate >= now).length;
  const dueSoon = user.reminders.filter(
    (x) =>
      !x.isCompleted &&
      x.dueDate >= now &&
      x.dueDate.getTime() - now.getTime() <= 1000 * 60 * 60 * 24 * 7
  ).length;
  const overdue = user.reminders.filter((x) => !x.isCompleted && x.dueDate < now).length;

  const remindersFormatted = user.reminders.map((r) => ({
  ...r,
  dueDate: r.dueDate.toISOString(),
}));

  return (
    <div className="pageShell">
      <div className="appContainer">
        <AppTopbar
          fullName={user.fullName}
          email={user.email}
          language={user.language === 'ro' ? 'ro' : 'en'}
        />

        <section className="statsGrid">
          <div className="statCard">
            <div className="statLabel">{t.statActive}</div>
            <div className="statValue">{active}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">{t.statDueSoon}</div>
            <div className="statValue">{dueSoon}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">{t.statOverdue}</div>
            <div className="statValue">{overdue}</div>
          </div>
        </section>

        <section className="sectionCard">
          <div className="sectionHeader">
            <div>
              <h2 className="sectionTitle">{t.dashboardTitle}</h2>
              <p className="sectionCopy">{t.dashboardSubtitle}</p>
            </div>
            <a className="button" href="/reminders/new">
              {t.addReminder}
            </a>
          </div>

          <ReminderList reminders={remindersFormatted} t={t}/>
        </section>
      </div>
    </div>
  );
}