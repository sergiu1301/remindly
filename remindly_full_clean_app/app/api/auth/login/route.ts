import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { setSessionCookie, signSession } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'EMAIL_NOT_VERIFIED' }, { status: 403 });
    }

    const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const token = await signSession({ userId: user.id, email: user.email });
    setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
