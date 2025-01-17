'use client'

import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  })

export function useTranslation(lng: string, ns: string) {
  i18next.changeLanguage(lng)
  return {
    t: i18next.t,
    i18n: i18next
  }
}
