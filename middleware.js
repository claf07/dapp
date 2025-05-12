import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Temporarily allow all routes
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/register',
    '/admin/:path*',
    '/donor/:path*',
    '/patient/:path*'
  ]
}; 