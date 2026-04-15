import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

async function runCronJob() {
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

      if (alreadyNotifiedToday) {
        continue;
      }

      await sendEmail({
        to: reminder.user.email,
        subject: `Reminder: ${reminder.title}`,
        html: `
<div style="margin:0;padding:0;background:#0b1220;color:#ffffff;font-family:Arial,sans-serif;width:100%;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;padding:0;background:#0b1220;">
    <tr>
      <td align="center">

        <!-- CONTAINER -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
          <tr>
            <td style="padding:20px;">

              <table width="100%" cellpadding="0" cellspacing="0" style="
                background:#111827;
                border-radius:16px;
                overflow:hidden;
              ">

                <!-- HEADER -->
                <tr>
                  <td style="
                    padding:24px;
                    text-align:center;
                    background:#0f172a;
                    color:#ffffff;
                  ">
                    <div style="font-size:20px;font-weight:700;">
                      Remindly
                    </div>
                    <div style="margin-top:6px;font-size:12px;color:#9ca3af;">
                      Smart reminders for everything
                    </div>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td style="padding:24px;color:#e5e7eb;">

                    <div style="font-size:20px;font-weight:700;margin-bottom:12px;color:#ffffff;">
                      🔔 ${reminder.title}
                    </div>

                    <div style="font-size:15px;line-height:1.6;color:#d1d5db;margin-bottom:16px;">
                      This reminder is due on 
                      <span style="color:#ffffff;font-weight:600;">
                        ${reminder.dueDate.toLocaleDateString()}
                      </span>.
                    </div>

                    <!-- INFO -->
                    <div style="
                      background:#020617;
                      border-radius:10px;
                      padding:14px;
                      border:1px solid #1f2937;
                    ">
                      <div style="font-size:12px;color:#6b7280;">Category</div>
                      <div style="font-size:14px;color:#ffffff;margin-bottom:8px;">
                        ${reminder.category}
                      </div>

                      <div style="font-size:12px;color:#6b7280;">Notify before</div>
                      <div style="font-size:14px;color:#ffffff;">
                        ${reminder.notifyBefore} day(s)
                      </div>
                    </div>

                    ${
                      reminder.description
                        ? `
                      <div style="margin-top:16px;font-size:14px;color:#cbd5f5;">
                        ${reminder.description}
                      </div>
                    `
                        : ''
                    }

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="
                    padding:16px;
                    text-align:center;
                    font-size:12px;
                    color:#6b7280;
                    background:#111827;
                  ">
                    © ${new Date().getFullYear()} Remindly
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

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
}

export async function GET() {
  try {
    return await runCronJob();
  } catch (error) {
    console.error('CRON_ERROR', error);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    return await runCronJob();
  } catch (error) {
    console.error('CRON_ERROR', error);
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}