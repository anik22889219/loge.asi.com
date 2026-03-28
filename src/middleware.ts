import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
    const isVerifyPage = req.nextUrl.pathname.startsWith('/verify');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    if (!isAuth) {
      // Let next-auth handle redirecting unauthenticated users from protected routes
      return null; 
    }

    // User is authenticated
    if (token.verificationStatus !== 'Active') {
       // If they are not active and not already on the verify page, redirect them to verify
       if (!isVerifyPage) {
          return NextResponse.redirect(new URL('/verify', req.url));
       }
    } else {
       // If they are active and trying to access verify page, redirect to dashboard
       if (isVerifyPage) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
       }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require auth for specific paths, e.g. /dashboard, /verify
        const protectedPaths = ['/dashboard', '/verify', '/profile'];
        const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
        
        if (isProtected) {
          return !!token;
        }
        return true; // Allow access to public routes
      }
    }
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
