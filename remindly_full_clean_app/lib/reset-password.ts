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
<div style="margin:0;padding:0;background:#0b1220;font-family:Arial,sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;background:#0b1220;">
    <tr>
      <td align="center">

        <!-- CONTAINER -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
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

                    <!-- TITLE -->
                    <div style="
                      font-size:20px;
                      font-weight:700;
                      margin-bottom:12px;
                      color:#ffffff;
                    ">
                      🔐 Reset your password
                    </div>

                    <!-- TEXT -->
                    <div style="
                      font-size:15px;
                      line-height:1.6;
                      color:#d1d5db;
                      margin-bottom:20px;
                    ">
                      Hi ${fullName}, click the button below to set a new password.
                    </div>

                    <!-- BUTTON -->
                    <div style="text-align:center;margin:28px 0;">
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
                    <div style="height:1px;background:#1f2937;margin:24px 0;"></div>

                    <!-- FALLBACK -->
                    <div style="font-size:12px;color:#6b7280;">
                      If the button does not work, use this link:
                    </div>

                    <div style="
                      margin-top:8px;
                      font-size:12px;
                      color:#d4af37;
                      word-break:break-all;
                    ">
                      ${resetUrl}
                    </div>

                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="
                    padding:16px;
                    text-align:center;
                    font-size:11px;
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
}
