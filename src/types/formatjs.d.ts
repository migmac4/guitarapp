declare module '@formatjs/intl-localematcher' {
  export function match(
    requestedLocales: string[],
    availableLocales: string[],
    defaultLocale: string
  ): string
}
