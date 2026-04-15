import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/reset-password';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = forgotPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await sendPasswordResetEmail(user.email, user.id, user.fullName);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('FORGOT_PASSWORD_ERROR', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
