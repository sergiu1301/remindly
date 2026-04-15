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
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="font-size:24px;margin-bottom:12px">Reset your password</h1>
        <p style="font-size:16px;line-height:1.6">Hi ${fullName}, click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#111827;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;margin:16px 0">Reset password</a>
        <p style="font-size:14px;color:#6b7280">If the button does not work, copy this link:<br/>${resetUrl}</p>
      </div>
    `
  });
}
