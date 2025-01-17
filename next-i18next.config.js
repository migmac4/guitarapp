const { i18nConfig } = require('./src/i18n/settings')

module.exports = {
  ...i18nConfig,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  // Configuração específica para App Router
  localeDetection: false,
  localePath: './public/locales',
  serializeConfig: false,
  use: [],
  interpolation: {
    escapeValue: false,
  },
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    ...i18nConfig.i18n,
    localeDetection: false
  }
}
