import { prisma } from '@/lib/prisma';
import { generateRawToken, hashToken } from '@/lib/crypto';
import { sendEmail } from '@/lib/email';

export async function sendPasswordResetEmail(email: string, userId: string, fullName: string): Promise<void> {
  await prisma.passwordResetToken.deleteMany({ where: { userId } });

  const token = generateRawToken();
  const tokenHash = hashToken(token);

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60)
    }
  });

  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your password',
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
                Reset your password
              </span>

              <span style="
                display:block;
                font-size:15px;
                color:#d1d5db !important;
                line-height:1.6;
                margin-bottom:20px;
              ">
                Hi ${fullName}, click the button below to set a new password.
              </span>

              <!-- BUTTON -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}"
                   style="
                     display:inline-block;
                     background:#d4af37;
                     color:#111827 !important;
                     text-decoration:none;
                     padding:14px 26px;
                     border-radius:10px;
                     font-weight:700;
                     font-size:15px;
                   ">
                  Reset Password
                </a>
              </div>

              <!-- DIVIDER -->
              <div style="height:1px;background:#374151;margin:24px 0;"></div>

              <!-- FALLBACK -->
              <span style="
                display:block;
                font-size:12px;
                color:#9ca3af !important;
              ">
                If the button does not work, copy this link:
              </span>

              <span style="
                display:block;
                margin-top:8px;
                font-size:12px;
                color:#d4af37 !important;
                word-break:break-all;
              ">
                ${resetUrl}
              </span>

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
}
