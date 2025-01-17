import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18nSettings } from './i18n/settings'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { debug } from './utils/debug'

type Locale = 'en' | 'pt' | 'es'

function getLocale(request: NextRequest): Locale {
  debug.trace('Middleware:getLocale', 'Starting locale detection')
  
  const headers = Object.fromEntries(request.headers.entries())
  debug.info('Middleware:getLocale', 'Request headers:', headers)
  
  const locales: Locale[] = i18nSettings.locales as Locale[]
  debug.info('Middleware:getLocale', 'Available locales:', locales)
  
  let languages: string[] = []
  try {
    const negotiator = new Negotiator({ 
      headers: { 
        'accept-language': headers['accept-language'] || '' 
      } as any
    })
    languages = negotiator.languages()
    debug.info('Middleware:getLocale', 'Negotiated languages:', languages)
  } catch (e) {
    debug.error('Middleware:getLocale', 'Error negotiating languages:', e)
    languages = [i18nSettings.defaultLocale]
  }

  const detectedLocale = matchLocale(languages, locales, i18nSettings.defaultLocale) as Locale
  debug.info('Middleware:getLocale', `Detected locale: ${detectedLocale}`)
  return detectedLocale
}

export function middleware(request: NextRequest) {
  debug.trace('Middleware', '🔄 Request started')
  debug.info('Middleware', 'Request URL:', request.url)
  
  const pathname = request.nextUrl.pathname
  debug.info('Middleware', 'Pathname:', pathname)
  
  // Ignorar arquivos estáticos e API routes
  if (
    pathname.includes('.') || // arquivos estáticos
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    debug.info('Middleware', '⏭️ Skipping static/API route')
    return NextResponse.next()
  }

  // Extrair locale atual da URL se existir
  const currentLocale = pathname.split('/')[1]
  debug.info('Middleware', 'Current locale from URL:', currentLocale)

  // Checar se já tem um locale válido na URL
  const pathnameIsMissingLocale = i18nSettings.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  debug.info('Middleware', 'Pathname is missing locale:', pathnameIsMissingLocale)

  if (pathnameIsMissingLocale) {
    debug.info('Middleware', '🔍 No locale in URL, detecting preferred locale')
    const detectedLocale = getLocale(request)
    
    // Construir nova URL com locale
    const newUrl = new URL(request.url)
    newUrl.pathname = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`
    debug.info('Middleware', '➡️ Redirecting to:', newUrl.pathname)
    
    // Redirecionar mantendo query params
    return NextResponse.redirect(newUrl)
  }

  // Validar se o locale na URL é suportado
  if (!i18nSettings.locales.includes(currentLocale as Locale)) {
    debug.warn('Middleware', `⚠️ Invalid locale in URL: ${currentLocale}`)
    const defaultLocale = i18nSettings.defaultLocale
    const newUrl = new URL(request.url)
    newUrl.pathname = `/${defaultLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
    debug.info('Middleware', '➡️ Redirecting to default locale:', newUrl.pathname)
    return NextResponse.redirect(newUrl)
  }

  debug.info('Middleware', `✅ Proceeding with locale: ${currentLocale}`)
  const response = NextResponse.next()
  
  // Adicionar locale aos headers para uso posterior
  response.headers.set('x-locale', currentLocale)
  debug.info('Middleware', '📝 Added locale to headers:', currentLocale)
  
  return response
}

export const config = {
  matcher: [
    // Pular arquivos estáticos e API
    '/((?!api|_next/static|_next/image|_next/scripts|favicon.ico).*)',
    '/',
  ],
}
