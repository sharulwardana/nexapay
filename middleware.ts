import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

interface AuthUser {
  role?: string;
}

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Bypass API and auth routes completely
  if (pathname.startsWith('/api')) {
    return;
  }

  const isAuthPage = pathname.startsWith('/login');

  // Redirect to home if logged in and trying to access auth pages
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL('/', req.url));
  }

  // Protect /dashboard
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }

  // Protect /admin — redirect unless role is explicitly ADMIN
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.url));
    }
    const user = req.auth?.user as AuthUser | undefined;
    const userRole = user?.role;
    if (userRole !== 'ADMIN') {
      return Response.redirect(new URL('/', req.url));
    }
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|images).*)',
  ],
}
