import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/crypto';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = resetPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const tokenHash = hashToken(parsed.data.token);
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash }
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'INVALID_TOKEN' }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash }
      }),
      prisma.passwordResetToken.delete({
        where: { tokenHash }
      })
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('RESET_PASSWORD_ERROR', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
