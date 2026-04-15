import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('remindly_session')?.value;
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/profile', '/reminders'];
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (requiresAuth && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/reminders/:path*']
};
