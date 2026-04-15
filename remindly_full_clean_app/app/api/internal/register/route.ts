import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators';
import { sendVerificationEmail } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (exists) {
      return NextResponse.json({ error: 'USER_ALREADY_EXISTS' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: await hashPassword(parsed.data.password),
        fullName: parsed.data.fullName,
        language: parsed.data.language || 'en',
        emailVerified: false
      }
    });

    await sendVerificationEmail(normalizedEmail, user.id, user.fullName);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email
      },
      emailVerificationSent: true
    }, { status: 201 });
  } catch (error) {
    console.error('REGISTER_ERROR', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
