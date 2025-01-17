import './globals.css'
import { i18nSettings } from '../i18n/settings'
import { TranslationProvider } from '../providers/TranslationProvider'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { debug } from '../utils/debug'

export const metadata: Metadata = {
  title: 'Next.js Internationalization Example',
  description: 'A demo of Next.js internationalization using App Router',
}

export async function generateStaticParams() {
  return i18nSettings.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale?: string }
}) {
  debug.trace('Layout', '🔄 Rendering layout')
  debug.info('Layout', 'Received params:', params)

  // Tentar obter o locale de diferentes fontes
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-locale')
  const localeFromParams = params?.locale
  
  debug.info('Layout', 'Locale sources:', {
    header: localeFromHeader,
    params: localeFromParams
  })

  // Determinar o locale final
  const locale = localeFromParams || localeFromHeader || i18nSettings.defaultLocale

  debug.info('Layout', `Selected locale: ${locale}`)

  // Validar o locale
  if (!i18nSettings.locales.includes(locale)) {
    const error = `Invalid locale: ${locale}`
    debug.error('Layout', error)
    throw new Error(error)
  }

  debug.info('Layout', '✅ Rendering with locale:', locale)

  return (
    <html lang={locale}>
      <body>
        <TranslationProvider locale={locale}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
