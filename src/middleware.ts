import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PREFIXES = [
  '/',
  '/auth',
  '/landing',
]

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_PREFIXES.some(
    (prefix) => prefix !== '/' && (pathname === prefix || pathname.startsWith(`${prefix}/`))
  )
}

function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    if (!payload.exp) return false
    return payload.exp < Math.floor(Date.now() / 1000)
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/auth/signup', request.url))
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token || isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    if (token) {
      response.cookies.delete('token')
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
