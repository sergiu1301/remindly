import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST() {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        isCompleted: false
      },
      include: {
        user: true
      }
    });

    const now = new Date();

    for (const reminder of reminders) {
      const diff = reminder.dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (diffDays === reminder.notifyBefore) {
        const alreadyNotifiedToday =
          reminder.notifiedAt &&
          reminder.notifiedAt.toDateString() === now.toDateString();

        if (alreadyNotifiedToday) continue;

        await sendEmail({
          to: reminder.user.email,
          subject: `Reminder: ${reminder.title}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
              <h1 style="font-size:24px;margin-bottom:12px">${reminder.title}</h1>
              <p style="font-size:16px;line-height:1.6">
                This reminder is due on ${reminder.dueDate.toLocaleDateString()}.
              </p>
              <p style="font-size:14px;color:#6b7280">
                Category: ${reminder.category}<br/>
                Notify before: ${reminder.notifyBefore} day(s)
              </p>
            </div>
          `
        });

        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { notifiedAt: now }
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('CRON_ERROR', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
