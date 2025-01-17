'use client'

import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { useEffect, useState } from 'react'
import { i18nSettings } from '../i18n/settings'

async function initI18next(locale: string) {
  try {
    const i18n = i18next.createInstance()
    
    await i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        debug: true,
        lng: locale,
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

    // Verificar se as traduções foram carregadas
    const resources = i18n.getResourceBundle(locale, 'common')
    if (!resources) {
      throw new Error(`No translations found for locale: ${locale}`)
    }

    return i18n
  } catch (error) {
    throw error
  }
}

export function TranslationProvider({ 
  children,
  locale
}: {
  children: React.ReactNode
  locale: string
}) {
  const [state, setState] = useState<{
    instance: typeof i18next | null;
    activeLocale: string | null;
    error: Error | null;
    loading: boolean;
  }>({
    instance: null,
    activeLocale: null,
    error: null,
    loading: true
  })

  useEffect(() => {
    if (!locale) {
      setState(prev => ({ 
        ...prev, 
        error: new Error('No locale provided'),
        loading: false 
      }))
      return
    }

    if (!i18nSettings.locales.includes(locale)) {
      setState(prev => ({ 
        ...prev, 
        error: new Error(`Invalid locale: ${locale}`),
        loading: false 
      }))
      return
    }

    // Só atualizar se o locale mudou
    if (state.activeLocale === locale && state.instance) {
      return
    }

    setState(prev => ({ ...prev, loading: true }))
    
    initI18next(locale)
      .then(i18n => {
        setState({
          instance: i18n,
          activeLocale: locale,
          error: null,
          loading: false
        })
      })
      .catch(error => {
        setState(prev => ({ 
          ...prev, 
          error, 
          loading: false 
        }))
      })
  }, [locale])

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error loading translations: {state.error.message}
        </div>
      </div>
    )
  }

  if (state.loading || !state.instance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading translations...</div>
      </div>
    )
  }

  return (
    <I18nextProvider i18n={state.instance}>
      {children}
    </I18nextProvider>
  )
}
