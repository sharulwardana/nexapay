import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  // Allow access to auth API routes
  if (isApiAuthRoute) {
    return;
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL('/', req.nextUrl));
  }

  // Protect /dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // Protect /admin — default deny: redirect unless role is explicitly ADMIN
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.nextUrl));
    }
    // Default deny: if role is missing or not ADMIN, redirect.
    // This prevents bypass when JWT doesn't have the role field populated.
    if (!req.auth?.user?.role || req.auth.user.role !== 'ADMIN') {
      return Response.redirect(new URL('/', req.nextUrl));
    }
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
