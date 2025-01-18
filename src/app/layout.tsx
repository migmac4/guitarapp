import './globals.css'
import React from 'react'
import { i18nSettings } from '../i18n/settings'
import { TranslationProvider } from '../providers/TranslationProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { AuthProvider } from '@/contexts/AuthContext'
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
  // Determinar o locale final
  const locale = params?.locale || localeFromHeader || i18nSettings.defaultLocale

  // Validar o locale
  if (!i18nSettings.locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <AuthProvider>
            <TranslationProvider locale={locale}>
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
              {children}
            </TranslationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
