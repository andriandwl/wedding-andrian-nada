/**
 * middleware.ts
 * Protects /admin/* routes — redirects to /login if unauthenticated.
 * Runs on Edge runtime (no DB calls here).
 */
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // If token exists but role isn't admin — forbidden
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=forbidden', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized returns true → middleware fn runs; false → redirect to signIn
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: '/login' },
  },
);

export const config = {
  matcher: ['/admin/:path*'],
};
