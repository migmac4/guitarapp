import './globals.css'
import { i18nSettings } from '../i18n/settings'
import { TranslationProvider } from '../providers/TranslationProvider'
import { Metadata } from 'next'
import { headers } from 'next/headers'

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
  // Tentar obter o locale de diferentes fontes
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-locale')
  const localeFromParams = params?.locale
  
  // Determinar o locale final
  const locale = localeFromParams || localeFromHeader || i18nSettings.defaultLocale

  // Validar o locale
  if (!i18nSettings.locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`)
  }

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
