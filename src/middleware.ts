import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fallbackLng, languages } from './app/i18n'

export function middleware(request: NextRequest) {
  // パスから現在の言語を取得
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 言語が指定されていない場合、デフォルト言語にリダイレクト
  if (pathnameIsMissingLocale) {
    const locale = fallbackLng

    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
}

export const config = {
  // 静的ファイルは除外
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 