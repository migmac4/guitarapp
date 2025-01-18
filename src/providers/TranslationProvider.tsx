'use client'

import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { useEffect, useState } from 'react'
import { i18nSettings } from '../i18n/settings'

const i18n = i18next.createInstance()

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: i18nSettings.defaultLocale,
    supportedLngs: i18nSettings.locales,
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export function TranslationProvider({ 
  children,
  locale
}: {
  children: React.ReactNode
  locale: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!locale) {
      setError(new Error('No locale provided'))
      setIsLoading(false)
      return
    }

    if (!i18nSettings.locales.includes(locale)) {
      setError(new Error(`Invalid locale: ${locale}`))
      setIsLoading(false)
      return
    }

    i18n.changeLanguage(locale)
      .then(() => {
        setIsLoading(false)
        setError(null)
      })
      .catch(error => {
        setError(error)
        setIsLoading(false)
      })
  }, [locale])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error loading translations: {error.message}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading translations...</div>
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
