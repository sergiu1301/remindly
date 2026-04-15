import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const COOKIE_NAME = 'remindly_session';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'change-this-super-secret');

export async function signSession(payload: { userId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { userId: string; email: string };
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', {
    expires: new Date(0),
    path: '/'
  });
}
