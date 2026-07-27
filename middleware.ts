import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  if (isApiAuthRoute) {
    return;
  }

  // Redirect to home if logged in and trying to access auth pages
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL('/', req.url));
  }

  // Protect /dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url));
  }

  // Protect /admin — redirect unless role is explicitly ADMIN
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', req.url));
    }
    const userRole = (req.auth?.user as any)?.role;
    if (userRole !== 'ADMIN') {
      return Response.redirect(new URL('/', req.url));
    }
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

