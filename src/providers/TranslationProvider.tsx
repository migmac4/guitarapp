'use client'

import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { useEffect, useState } from 'react'
import { i18nSettings } from '../i18n/settings'
import { debug } from '../utils/debug'

async function initI18next(locale: string) {
  try {
    debug.trace('TranslationProvider:init', `Initializing i18next for locale: ${locale}`)

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
    debug.info('TranslationProvider:init', `Resources loaded for ${locale}:`, resources)

    if (!resources) {
      throw new Error(`No translations found for locale: ${locale}`)
    }

    return i18n
  } catch (error) {
    debug.error('TranslationProvider:init', 'Initialization failed:', error)
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
    debug.trace('TranslationProvider', `Effect triggered for locale: ${locale}`)
    
    if (!locale) {
      debug.error('TranslationProvider', 'No locale provided')
      setState(prev => ({ 
        ...prev, 
        error: new Error('No locale provided'),
        loading: false 
      }))
      return
    }

    if (!i18nSettings.locales.includes(locale)) {
      debug.error('TranslationProvider', `Invalid locale: ${locale}`)
      setState(prev => ({ 
        ...prev, 
        error: new Error(`Invalid locale: ${locale}`),
        loading: false 
      }))
      return
    }

    // Só atualizar se o locale mudou
    if (state.activeLocale === locale && state.instance) {
      debug.info('TranslationProvider', `Using existing instance for locale: ${locale}`)
      return
    }

    debug.info('TranslationProvider', `Setting up new instance for locale: ${locale}`)
    setState(prev => ({ ...prev, loading: true }))
    
    initI18next(locale)
      .then(i18n => {
        debug.info('TranslationProvider', `Setup complete for locale: ${locale}`)
        setState({
          instance: i18n,
          activeLocale: locale,
          error: null,
          loading: false
        })
      })
      .catch(error => {
        debug.error('TranslationProvider', 'Setup failed:', error)
        setState(prev => ({ 
          ...prev, 
          error, 
          loading: false 
        }))
      })
  }, [locale])

  if (state.error) {
    debug.error('TranslationProvider', 'Rendering error state:', state.error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error loading translations: {state.error.message}
        </div>
      </div>
    )
  }

  if (state.loading || !state.instance) {
    debug.info('TranslationProvider', 'Rendering loading state')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading translations...</div>
      </div>
    )
  }

  debug.info('TranslationProvider', `Rendering with locale: ${state.activeLocale}`)
  return (
    <I18nextProvider i18n={state.instance}>
      {children}
    </I18nextProvider>
  )
}
