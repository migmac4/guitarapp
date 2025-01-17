import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18nSettings } from './i18n/settings'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

type Locale = 'en' | 'pt' | 'es'

function getLocale(request: NextRequest): Locale {
  const headers = Object.fromEntries(request.headers.entries())
  const locales: Locale[] = i18nSettings.locales as Locale[]
  
  let languages: string[] = []
  try {
    const negotiator = new Negotiator({ 
      headers: { 
        'accept-language': headers['accept-language'] || '' 
      } as any
    })
    languages = negotiator.languages()
  } catch (e) {
    languages = [i18nSettings.defaultLocale]
  }

  return matchLocale(languages, locales, i18nSettings.defaultLocale) as Locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Ignorar arquivos estáticos e API routes
  if (
    pathname.includes('.') || // arquivos estáticos
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Extrair locale atual da URL se existir
  const currentLocale = pathname.split('/')[1]

  // Checar se já tem um locale válido na URL
  const pathnameIsMissingLocale = i18nSettings.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const detectedLocale = getLocale(request)
    
    // Construir nova URL com locale
    const newUrl = new URL(request.url)
    newUrl.pathname = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`
    
    // Redirecionar mantendo query params
    return NextResponse.redirect(newUrl)
  }

  // Validar se o locale na URL é suportado
  if (!i18nSettings.locales.includes(currentLocale as Locale)) {
    const defaultLocale = i18nSettings.defaultLocale
    const newUrl = new URL(request.url)
    newUrl.pathname = `/${defaultLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
    return NextResponse.redirect(newUrl)
  }

  const response = NextResponse.next()
  
  // Adicionar locale aos headers para uso posterior
  response.headers.set('x-locale', currentLocale)
  
  return response
}

export const config = {
  matcher: [
    // Pular arquivos estáticos e API
    '/((?!api|_next/static|_next/image|_next/scripts|favicon.ico).*)',
    '/',
  ],
}
