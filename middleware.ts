import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
  '/',
  '/login',
  '/api/auth',
  '/api/health',
  '/api/chat',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    // If already logged in and going to /login, redirect to /agent
    if (pathname === '/login') {
      const authToken = request.cookies.get('sb-access-token')?.value;
      if (authToken) {
        return NextResponse.redirect(new URL('/agent', request.url));
      }
    }
    return NextResponse.next();
  }

  // Allow static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/manifest'
  ) {
    return NextResponse.next();
  }

  // Check auth for protected routes
  const authToken = request.cookies.get('sb-access-token')?.value;

  if (!authToken) {
    // Allow /api/chat to be accessed without auth for demo purposes
    if (pathname.startsWith('/api/chat')) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};