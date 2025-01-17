import { i18n as nextI18n } from 'next-i18next'

export const i18nConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
  },
  localePath: './public/locales'
}

export const i18nSettings = {
  locales: ['en', 'pt', 'es'],
  defaultLocale: 'en'
}
