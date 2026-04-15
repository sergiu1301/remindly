export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    const tokenHash = hashToken(token);
    const verification = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash }
    });

    if (!verification || verification.expiresAt < new Date()) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true }
      }),
      prisma.emailVerificationToken.delete({
        where: { tokenHash }
      })
    ]);

    return NextResponse.redirect(new URL('/verify-success', request.url));
  } catch (error) {
    console.error('VERIFY_EMAIL_ERROR', error);
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }
}
