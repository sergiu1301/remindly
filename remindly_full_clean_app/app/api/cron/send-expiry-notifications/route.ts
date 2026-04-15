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
          <div style="margin:0;padding:0;background:#0b1220;color:#ffffff !important;font-family:Arial,sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.6);">

          <!-- HEADER -->
          <tr>
            <td style="
              padding:30px 32px 20px 32px;
              text-align:center;
              background:#111827;
            ">
              
              <span style="
                display:block;
                font-size:22px;
                font-weight:700;
                color:#ffffff !important;
              ">
                Remindly
              </span>

              <span style="
                display:block;
                margin-top:6px;
                font-size:13px;
                color:#cbd5f5 !important;
              ">
                Smart reminders for everything
              </span>

            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:12px 32px;">
              <div style="height:1px;background:#374151;width:100%;"></div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:20px 32px 32px 32px;background:#111827;color:#e5e7eb !important;">

              <span style="
                display:block;
                font-size:22px;
                font-weight:700;
                color:#ffffff !important;
                margin-bottom:12px;
              ">
                ${reminder.title}
              </span>

              <span style="
                display:block;
                font-size:15px;
                color:#d1d5db !important;
                line-height:1.6;
                margin-bottom:16px;
              ">
                This reminder is due on 
                <strong style="color:#ffffff">
                  ${reminder.dueDate.toLocaleDateString()}
                </strong>.
              </span>

              <span style="
                display:block;
                font-size:14px;
                color:#9ca3af !important;
                line-height:1.6;
              ">
                Category: <span style="color:#ffffff">${reminder.category}</span><br/>
                Notify before: <span style="color:#ffffff">${reminder.notifyBefore} day(s)</span>
              </span>

              <!-- OPTIONAL DESCRIPTION -->
              ${
                reminder.description
                  ? `
                <div style="margin-top:16px;color:#d1d5db;font-size:14px;">
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
              padding:20px;
              text-align:center;
              font-size:12px;
              color:#6b7280 !important;
              background:#111827;
            ">
              © ${new Date().getFullYear()} Remindly
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